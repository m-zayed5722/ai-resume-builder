import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { notFound, redirect } from "next/navigation"
import type { ResumeData } from "@/types/resume"
import { emptyResumeData } from "@/types/resume"
import { ResumePageClient } from "@/components/resume/ResumePageClient"

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!resume) notFound()

  let resumeData: ResumeData = emptyResumeData
  try {
    resumeData = JSON.parse(resume.data as string) as ResumeData
  } catch {
    resumeData = emptyResumeData
  }

  return (
    <ResumePageClient
      resumeId={resume.id}
      resumeTitle={resume.title}
      initialData={resumeData}
      initialTemplate={resume.template}
      userPlan={session.user.plan as "FREE" | "PRO"}
    />
  )
}
