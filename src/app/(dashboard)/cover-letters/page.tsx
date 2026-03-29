import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createCoverLetter, deleteCoverLetter } from "@/lib/actions/cover-letter"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Trash2, ArrowRight, CreditCard, Mail } from "lucide-react"
import { PLAN_LIMITS } from "@/lib/guards/plan-guard"
import { formatDistanceToNow } from "date-fns"

async function DeleteCoverLetterButton({ id }: { id: string }) {
  const action = deleteCoverLetter.bind(null, id)
  return (
    <form action={action}>
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  )
}

export default async function CoverLettersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [coverLetters, user] = await Promise.all([
    prisma.coverLetter.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, companyName: true, updatedAt: true, createdAt: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
  ])

  const isPro = user?.plan === "PRO"
  const atLimit = !isPro && coverLetters.length >= PLAN_LIMITS.FREE.coverLetters

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-lg">
            ResumeAI
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/dashboard">
              <Button size="sm" variant="ghost" className="h-8 text-sm">Resumes</Button>
            </Link>
            <Link href="/cover-letters">
              <Button size="sm" variant="ghost" className="h-8 text-sm font-semibold">Cover Letters</Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isPro ? (
            <Badge variant="default">Pro</Badge>
          ) : (
            <Link href="/billing">
              <Button size="sm" variant="outline" className="gap-1.5 h-8">
                <CreditCard className="h-3.5 w-3.5" />
                Upgrade to Pro
              </Button>
            </Link>
          )}
          <Link href="/billing">
            <Button size="sm" variant="ghost" className="h-8">Billing</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Cover Letters</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isPro ? "Pro plan — Unlimited cover letters" : `Free plan — ${coverLetters.length}/${PLAN_LIMITS.FREE.coverLetters} cover letters`}
            </p>
          </div>
          <form action={createCoverLetter}>
            <Button type="submit" disabled={atLimit} className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Cover Letter
              {atLimit && <span className="text-xs opacity-70">(Pro)</span>}
            </Button>
          </form>
        </div>

        {coverLetters.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-xl">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No cover letters yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create a cover letter and let AI tailor it to any job description.
            </p>
            <form action={createCoverLetter}>
              <Button type="submit" className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Cover Letter
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverLetters.map((cl) => (
              <Card key={cl.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <CardTitle className="text-base leading-snug">{cl.title}</CardTitle>
                    </div>
                    <DeleteCoverLetterButton id={cl.id} />
                  </div>
                  <CardDescription className="text-xs">
                    {cl.companyName && <span>{cl.companyName} · </span>}
                    Edited {formatDistanceToNow(new Date(cl.updatedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Link href={`/cover-letter/${cl.id}`} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full gap-1.5">
                      Open Editor <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {atLimit && (
          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Unlock unlimited cover letters</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Upgrade to Pro for unlimited cover letters, resumes, and AI.
              </p>
            </div>
            <Link href="/billing">
              <Button className="shrink-0">Upgrade — $5.99/mo</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
