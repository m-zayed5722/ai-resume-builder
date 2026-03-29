import type { NextAuthConfig } from "next-auth"

/**
 * Edge-compatible auth config - no Prisma, no Node.js-only modules.
 * Used by middleware. Actual providers and Prisma adapter are in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      const isProtected =
        path.startsWith("/dashboard") ||
        path.startsWith("/resume") ||
        path.startsWith("/billing") ||
        path.startsWith("/cover-letter")

      if (isProtected && !isLoggedIn) return false
      return true
    },
  },
  providers: [],
}
