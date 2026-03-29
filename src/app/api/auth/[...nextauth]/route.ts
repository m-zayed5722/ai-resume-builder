import { handlers } from "@/auth"
import type { NextRequest } from "next/server"

// Wrap to satisfy Next.js 16 route handler signature
export async function GET(req: NextRequest) {
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  return handlers.POST(req)
}
