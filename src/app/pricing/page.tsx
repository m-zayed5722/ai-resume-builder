import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { PricingCards } from "./pricing-cards"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          ResumeAI
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, honest pricing</h1>
          <p className="text-lg text-muted-foreground">Start free. Upgrade when you need more.</p>
        </div>

        <PricingCards />
      </main>
    </div>
  )
}
