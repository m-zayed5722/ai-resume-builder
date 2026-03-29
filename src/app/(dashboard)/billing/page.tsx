import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import { createMonthlyCheckoutSession, createAnnualCheckoutSession, createBillingPortalSession } from "@/lib/actions/billing"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, CreditCard, Settings } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

const FREE_FEATURES = [
  "3 resumes",
  "10 AI uses per month",
  "All editor sections",
  "PDF export (with watermark)",
  "3 free templates",
]

const PRO_FEATURES = [
  "Unlimited resumes",
  "Unlimited AI generation",
  "Unlimited ATS analysis",
  "Clean PDF export (no watermark)",
  "All premium templates",
  "AI cover letter generator",
  "AI skill suggestions",
  "Priority support",
]

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { success } = await searchParams

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      subscription: {
        select: {
          status: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
        },
      },
    },
  })

  const isPro = user?.plan === "PRO"

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-lg">
          ResumeAI
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">Dashboard</Button>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your subscription</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="font-medium text-green-900">Upgrade successful!</p>
              <p className="text-sm text-green-700">Your account has been upgraded to Pro.</p>
            </div>
          </div>
        )}

        {/* Current plan */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Current Plan</CardTitle>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPro && user?.subscription && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Status: <span className="capitalize font-medium text-foreground">{user.subscription.status}</span>
                </p>
                {user.subscription.currentPeriodEnd && (
                  <p>
                    {user.subscription.cancelAtPeriodEnd ? "Cancels" : "Renews"} on:{" "}
                    <span className="font-medium text-foreground">
                      {format(new Date(user.subscription.currentPeriodEnd), "MMM d, yyyy")}
                    </span>
                  </p>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action */}
        {isPro ? (
          <form action={createBillingPortalSession}>
            <Button type="submit" variant="outline" className="gap-1.5 w-full">
              <Settings className="h-4 w-4" />
              Manage Subscription (Cancel, Update Payment)
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock unlimited AI, unlimited resumes, and clean PDF export.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {PRO_FEATURES.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <form action={createMonthlyCheckoutSession}>
                    <Button type="submit" className="w-full gap-1.5" variant="outline">
                      <CreditCard className="h-4 w-4" />
                      $5.99 / month
                    </Button>
                  </form>
                  <form action={createAnnualCheckoutSession}>
                    <Button type="submit" className="w-full gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      $3.99 / month
                      <Badge variant="secondary" className="ml-1 text-[10px]">Save 33%</Badge>
                    </Button>
                  </form>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Annual plan billed at $47.88/year. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
