import { PrismaClient } from "@/generated/prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL || "file:./prisma/dev.db"

  // If it's already an absolute path or non-file URL, use as-is
  if (!raw.startsWith("file:") || raw.startsWith("file:///") || raw.startsWith("file://")) {
    return raw
  }

  const filePath = raw.slice(5)

  // Already absolute (Windows or Unix)
  if (/^[A-Za-z]:/.test(filePath) || filePath.startsWith("/")) {
    return raw
  }

  // Relative path — resolve relative to cwd
  const cwd = process.cwd().replace(/\\/g, "/")
  const rel = filePath.replace(/^\.\//, "")
  return `file:${cwd}/${rel}`
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl()
  const authToken = process.env.DATABASE_AUTH_TOKEN
  // PrismaLibSql v7.6 expects a config object, not a pre-created client
  const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) })
  return new PrismaClient({ adapter } as any)
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
