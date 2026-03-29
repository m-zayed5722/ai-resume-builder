import { headers } from "next/headers"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/prisma/client"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubUpsert(event.data.object as Stripe.Subscription)
        break
      case "customer.subscription.deleted":
        await handleSubDeleted(event.data.object as Stripe.Subscription)
        break
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  } catch (err) {
    console.error("Webhook handler error:", err)
    return new Response("Webhook handler failed", { status: 500 })
  }

  return new Response("OK", { status: 200 })
}

async function handleSubUpsert(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId
  if (!userId) return

  const isActive = ["active", "trialing"].includes(sub.status)

  // In Stripe API 2026+, current_period_start/end moved to invoice billing period.
  // Use start_date and cancel_at as available proxies.
  const periodStart = sub.start_date
    ? new Date(sub.start_date * 1000)
    : null
  const periodEnd = sub.cancel_at
    ? new Date(sub.cancel_at * 1000)
    : sub.trial_end
    ? new Date(sub.trial_end * 1000)
    : null

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: isActive ? "PRO" : "FREE",
      subscription: {
        upsert: {
          create: {
            stripeSubId: sub.id,
            stripePriceId: sub.items.data[0].price.id,
            status: sub.status as any,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            status: sub.status as any,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        },
      },
    },
  })
}

async function handleSubDeleted(sub: Stripe.Subscription) {
  const userId = sub.metadata?.userId
  if (!userId) return

  await prisma.user.update({
    where: { id: userId },
    data: { plan: "FREE" },
  })

  await prisma.subscription.updateMany({
    where: { stripeSubId: sub.id },
    data: { status: "canceled" },
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Log for now — in a future phase, send an email notification
  console.error(`Payment failed for invoice ${invoice.id}, customer ${invoice.customer}`)
}
