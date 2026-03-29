"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { canCreateResume } from "@/lib/guards/plan-guard"
import type { ResumeData } from "@/types/resume"
import { emptyResumeData } from "@/types/resume"

export async function createResume() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const allowed = await canCreateResume(session.user.id)
  if (!allowed) throw new Error("Upgrade to Pro to create more resumes")

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: "Untitled Resume",
      data: JSON.stringify(emptyResumeData),
    },
  })

  redirect(`/resume/${resume.id}`)
}

export async function updateResume(id: string, data: ResumeData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existing = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  })
  if (!existing) throw new Error("Resume not found")

  await prisma.resume.update({
    where: { id },
    data: { data: JSON.stringify(data), updatedAt: new Date() },
  })
}

export async function updateResumeTitle(id: string, title: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.resume.updateMany({
    where: { id, userId: session.user.id },
    data: { title },
  })

  revalidatePath("/dashboard")
}

export async function deleteResume(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.resume.deleteMany({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/dashboard")
}

export async function getUserResumes() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      createdAt: true,
    },
  })
}

export async function updateResumeTemplate(id: string, template: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.resume.updateMany({
    where: { id, userId: session.user.id },
    data: { template },
  })
}

export async function duplicateResume(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const allowed = await canCreateResume(session.user.id)
  if (!allowed) throw new Error("Upgrade to Pro to create more resumes")

  const original = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!original) throw new Error("Resume not found")

  await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: `${original.title} (Copy)`,
      data: original.data,
      template: original.template,
    },
  })

  revalidatePath("/dashboard")
}
