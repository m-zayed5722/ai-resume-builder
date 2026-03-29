"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { canUseAI, incrementAIUsage, getAIUsageCount, PLAN_LIMITS } from "@/lib/guards/plan-guard"
import { generateBulletPoints, scoreATSMatch, generateSummary, suggestSkills } from "@/lib/ai/resume-ai"
import type { ResumeData } from "@/types/resume"

export async function generateBulletsAction(params: {
  jobTitle: string
  responsibility: string
}): Promise<{ bullets?: string[]; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const allowed = await canUseAI(session.user.id)
  if (!allowed) return { error: "Monthly AI limit reached. Upgrade to Pro for unlimited access." }

  try {
    const bullets = await generateBulletPoints(params)
    await incrementAIUsage(session.user.id)
    return { bullets }
  } catch (err) {
    console.error("AI bullet generation failed:", err)
    return { error: "AI service unavailable. Please try again." }
  }
}

export async function scoreATSAction(params: {
  resumeId: string
  jobDescription: string
}): Promise<{
  score?: number
  missing?: string[]
  suggestions?: string[]
  error?: string
}> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const allowed = await canUseAI(session.user.id)
  if (!allowed) return { error: "Monthly AI limit reached. Upgrade to Pro for unlimited access." }

  const resume = await prisma.resume.findFirst({
    where: { id: params.resumeId, userId: session.user.id },
  })
  if (!resume) return { error: "Resume not found" }

  try {
    const result = await scoreATSMatch({
      resumeData: resume.data as unknown as ResumeData,
      jobDescription: params.jobDescription,
    })
    await incrementAIUsage(session.user.id)
    return result
  } catch (err) {
    console.error("ATS scoring failed:", err)
    return { error: "AI service unavailable. Please try again." }
  }
}

export async function generateSummaryAction(params: {
  jobTitle: string
  yearsOfExperience: number
  topSkills: string[]
}): Promise<{ summary?: string; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const allowed = await canUseAI(session.user.id)
  if (!allowed) return { error: "Monthly AI limit reached. Upgrade to Pro for unlimited access." }

  try {
    const summary = await generateSummary(params)
    await incrementAIUsage(session.user.id)
    return { summary }
  } catch (err) {
    console.error("AI summary generation failed:", err)
    return { error: "AI service unavailable. Please try again." }
  }
}

export async function getAIUsageAction(): Promise<{
  used: number
  limit: number
  isPro: boolean
}> {
  const session = await auth()
  if (!session?.user?.id) return { used: 0, limit: PLAN_LIMITS.FREE.aiUses, isPro: false }

  const isPro = session.user.plan === "PRO"
  const used = await getAIUsageCount(session.user.id)

  return { used, limit: PLAN_LIMITS.FREE.aiUses, isPro }
}

export async function suggestSkillsAction(params: {
  jobTitle: string
  currentSkills: string[]
}): Promise<{ skills?: string[]; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const allowed = await canUseAI(session.user.id)
  if (!allowed) return { error: "Monthly AI limit reached. Upgrade to Pro for unlimited access." }

  try {
    const skills = await suggestSkills(params)
    await incrementAIUsage(session.user.id)
    return { skills }
  } catch (err) {
    console.error("AI skill suggestion failed:", err)
    return { error: "AI service unavailable. Please try again." }
  }
}
