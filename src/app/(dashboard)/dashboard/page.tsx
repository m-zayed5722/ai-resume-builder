import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createResume, deleteResume, duplicateResume } from "@/lib/actions/resume"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Trash2, ArrowRight, CreditCard, Copy } from "lucide-react"
import { PLAN_LIMITS } from "@/lib/guards/plan-guard"
import { formatDistanceToNow } from "date-fns"

async function CreateResumeButton({ isPro, count }: { isPro: boolean; count: number }) {
  const atLimit = !isPro && count >= PLAN_LIMITS.FREE.resumes
  return (
    <form action={createResume}>
      <Button type="submit" disabled={atLimit} className="gap-1.5">
        <Plus className="h-4 w-4" />
        New Resume
        {atLimit && <span className="text-xs opacity-70">(Pro)</span>}
      </Button>
    </form>
  )
}

async function DeleteResumeButton({ id }: { id: string }) {
  const action = deleteResume.bind(null, id)
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

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [resumes, user] = await Promise.all([
    prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true, createdAt: true },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, aiUsagesThisMonth: true },
    }),
  ])

  const isPro = user?.plan === "PRO"

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Nav */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold text-lg">
            ResumeAI
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/dashboard">
              <Button size="sm" variant="ghost" className="h-8 text-sm font-semibold">Resumes</Button>
            </Link>
            <Link href="/cover-letters">
              <Button size="sm" variant="ghost" className="h-8 text-sm">Cover Letters</Button>
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
            <Button size="sm" variant="ghost" className="h-8">
              Billing
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Resumes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isPro
                ? "Pro plan — Unlimited resumes & AI"
                : `Free plan — ${user?.aiUsagesThisMonth ?? 0}/${PLAN_LIMITS.FREE.aiUses} AI uses this month`}
            </p>
          </div>
          <CreateResumeButton isPro={isPro} count={resumes.length} />
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-xl">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first resume and let AI help you stand out.
            </p>
            <form action={createResume}>
              <Button type="submit" className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Resume
              </Button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <CardTitle className="text-base leading-snug">{resume.title}</CardTitle>
                    </div>
                    <DeleteResumeButton id={resume.id} />
                  </div>
                  <CardDescription className="text-xs">
                    Edited {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 gap-2">
                  <Link href={`/resume/${resume.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full gap-1.5">
                      Open Editor <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <form action={duplicateResume.bind(null, resume.id)}>
                    <Button type="submit" variant="outline" size="icon" className="h-8 w-8 shrink-0" title="Duplicate">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!isPro && resumes.length >= PLAN_LIMITS.FREE.resumes && (
          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Unlock unlimited resumes</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Upgrade to Pro for unlimited resumes, unlimited AI, and clean PDF export.
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
