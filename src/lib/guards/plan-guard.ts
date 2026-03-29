import { prisma } from "@/lib/prisma/client"

export const PLAN_LIMITS = {
  FREE: {
    resumes: 3,
    aiUses: 10,
    coverLetters: 1,
    templates: ["classic", "modern", "minimal"],
  },
  PRO: {
    resumes: Infinity,
    aiUses: Infinity,
    coverLetters: Infinity,
    templates: "all" as const,
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS

export async function canCreateResume(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, _count: { select: { resumes: true } } },
  })
  if (!user) return false
  if (user.plan === "PRO") return true
  return user._count.resumes < PLAN_LIMITS.FREE.resumes
}

export async function canUseAI(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      aiUsagesThisMonth: true,
      aiUsageResetAt: true,
    },
  })
  if (!user) return false
  if (user.plan === "PRO") return true

  const now = new Date()
  const resetDate = new Date(user.aiUsageResetAt)
  const needsReset =
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()

  if (needsReset) {
    await prisma.user.update({
      where: { id: userId },
      data: { aiUsagesThisMonth: 0, aiUsageResetAt: now },
    })
    return true
  }

  return user.aiUsagesThisMonth < PLAN_LIMITS.FREE.aiUses
}

export async function canUseTemplate(userId: string, templateId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })
  if (!user) return false
  if (user.plan === "PRO") return true
  return PLAN_LIMITS.FREE.templates.includes(templateId as "classic" | "modern" | "minimal")
}

export async function canCreateCoverLetter(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, _count: { select: { coverLetters: true } } },
  })
  if (!user) return false
  if (user.plan === "PRO") return true
  return user._count.coverLetters < PLAN_LIMITS.FREE.coverLetters
}

export async function incrementAIUsage(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { aiUsagesThisMonth: { increment: 1 } },
  })
}

export async function getAIUsageCount(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { aiUsagesThisMonth: true },
  })
  return user?.aiUsagesThisMonth ?? 0
}
