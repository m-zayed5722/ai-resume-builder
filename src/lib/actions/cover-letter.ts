"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { canCreateCoverLetter, canUseAI, incrementAIUsage } from "@/lib/guards/plan-guard"
import { generateCoverLetter } from "@/lib/ai/cover-letter-ai"
import type { ResumeData } from "@/types/resume"

export async function createCoverLetter() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const allowed = await canCreateCoverLetter(session.user.id)
  if (!allowed) throw new Error("Upgrade to Pro to create more cover letters")

  const coverLetter = await prisma.coverLetter.create({
    data: {
      userId: session.user.id,
      title: "Untitled Cover Letter",
    },
  })

  redirect(`/cover-letter/${coverLetter.id}`)
}

export async function getUserCoverLetters() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      companyName: true,
      updatedAt: true,
      createdAt: true,
    },
  })
}

export async function getCoverLetter(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.coverLetter.findFirst({
    where: { id, userId: session.user.id },
  })
}

export async function updateCoverLetter(
  id: string,
  data: { title?: string; content?: string; jobDescription?: string; companyName?: string }
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.coverLetter.updateMany({
    where: { id, userId: session.user.id },
    data: { ...data, updatedAt: new Date() },
  })
}

export async function deleteCoverLetter(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.coverLetter.deleteMany({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/cover-letters")
}

export async function generateCoverLetterAction(params: {
  coverLetterId: string
  resumeId?: string
  jobDescription: string
  companyName: string
}): Promise<{ content?: string; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const allowed = await canUseAI(session.user.id)
  if (!allowed) return { error: "Monthly AI limit reached. Upgrade to Pro for unlimited access." }

  let resumeData: ResumeData | null = null
  if (params.resumeId) {
    const resume = await prisma.resume.findFirst({
      where: { id: params.resumeId, userId: session.user.id },
    })
    if (resume) {
      resumeData = JSON.parse(resume.data) as ResumeData
    }
  }

  // If no resume selected, try the most recent one
  if (!resumeData) {
    const latest = await prisma.resume.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })
    if (latest) {
      resumeData = JSON.parse(latest.data) as ResumeData
    }
  }

  if (!resumeData) {
    return { error: "No resume found. Create a resume first to generate a cover letter." }
  }

  try {
    const content = await generateCoverLetter({
      resumeData,
      jobDescription: params.jobDescription,
      companyName: params.companyName,
    })
    await incrementAIUsage(session.user.id)

    // Save to cover letter
    await prisma.coverLetter.updateMany({
      where: { id: params.coverLetterId, userId: session.user.id },
      data: {
        content,
        jobDescription: params.jobDescription,
        companyName: params.companyName,
        updatedAt: new Date(),
      },
    })

    return { content }
  } catch (err) {
    console.error("Cover letter generation failed:", err)
    return { error: "AI service unavailable. Please try again." }
  }
}
