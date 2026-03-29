import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { redirect, notFound } from "next/navigation"
import { CoverLetterEditor } from "./editor"

export default async function CoverLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [coverLetter, resumes] = await Promise.all([
    prisma.coverLetter.findFirst({
      where: { id, userId: session.user.id },
    }),
    prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    }),
  ])

  if (!coverLetter) notFound()

  return (
    <CoverLetterEditor
      coverLetter={{
        id: coverLetter.id,
        title: coverLetter.title,
        content: coverLetter.content,
        jobDescription: coverLetter.jobDescription,
        companyName: coverLetter.companyName,
        resumeId: coverLetter.resumeId,
      }}
      resumes={resumes}
    />
  )
}
