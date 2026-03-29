"use server"

import { auth } from "@/auth"
import { stripe } from "@/lib/stripe/client"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"

export async function createCheckoutSession(plan: "monthly" | "annual" = "monthly") {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  if (session.user.plan === "PRO") {
    redirect("/billing")
  }

  const customerId = await getOrCreateStripeCustomer(
    session.user.id,
    session.user.email!,
    session.user.name ?? undefined
  )

  const priceId =
    plan === "annual"
      ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID!
      : process.env.STRIPE_PRO_PRICE_ID!

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      { price: priceId, quantity: 1 },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  })

  redirect(checkoutSession.url!)
}

export async function createMonthlyCheckoutSession() {
  return createCheckoutSession("monthly")
}

export async function createAnnualCheckoutSession() {
  return createCheckoutSession("annual")
}

export async function createBillingPortalSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  })

  if (!user?.stripeCustomerId) throw new Error("No billing account found")

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  })

  redirect(portalSession.url)
}

async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}
