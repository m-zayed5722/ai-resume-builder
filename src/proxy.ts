import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const { auth } = NextAuth(authConfig)

// NextAuth's auth() returns a handler compatible with the proxy convention.
// The `authorized` callback in auth.config.ts handles redirect logic for protected routes.
export const proxy = auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
