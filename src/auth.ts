import NextAuth from "next-auth"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma/client"
import { authConfig } from "@/auth.config"

const providers: Provider[] = [
  // Google OAuth — only works when GOOGLE_CLIENT_ID is configured
  ...(process.env.GOOGLE_CLIENT_ID
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : []),
  // Magic-link email — only works when AUTH_RESEND_KEY is configured
  ...(process.env.AUTH_RESEND_KEY
    ? [
        Resend({
          apiKey: process.env.AUTH_RESEND_KEY!,
          from: process.env.AUTH_EMAIL_FROM ?? "no-reply@yourdomain.com",
        }),
      ]
    : []),
]

// Dev login — only available in development
if (process.env.NODE_ENV !== "production") {
  providers.unshift(
    Credentials({
      id: "dev-login",
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const email = String(credentials.email).toLowerCase().trim()
        if (!email.includes("@")) return null

        let user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
          user = await prisma.user.create({
            data: { email, name: email.split("@")[0] },
          })
        }
        return { id: user.id, email: user.email, name: user.name, plan: user.plan }
      },
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, store user id and plan
      if (user) {
        token.id = user.id
        token.plan = user.plan ?? "FREE"
      }
      // On session update or token refresh, re-fetch plan from DB
      // This ensures plan changes (e.g. Stripe upgrade) are reflected without re-login
      if (trigger === "update" || (!user && token.id)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true },
        })
        if (dbUser) {
          token.plan = dbUser.plan
        }
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.plan = (token.plan === "PRO" ? "PRO" : "FREE") as "FREE" | "PRO"
      }
      return session
    },
  },
})
