"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const FREE_FEATURES = [
  "3 resumes",
  "10 AI uses per month",
  "Full editor access",
  "Live preview",
  "PDF export (with watermark)",
  "3 free templates",
]
const PRO_FEATURES = [
  "Unlimited resumes",
  "Unlimited AI generation",
  "Unlimited ATS analysis",
  "Clean PDF export (no watermark)",
  "All premium templates",
  "AI cover letter generator",
  "AI skill suggestions",
  "Priority support",
]

export function PricingCards() {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            annual ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual
        </span>
        {annual && <Badge variant="secondary" className="text-xs">Save 33%</Badge>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Free</CardTitle>
            <p className="text-4xl font-bold mt-2">$0</p>
            <p className="text-sm text-muted-foreground">Forever</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button variant="outline" className="w-full">Get Started Free</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card className="border-2 border-blue-500 bg-blue-50 relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>
            <div className="mt-2">
              <p className="text-4xl font-bold">
                {annual ? "$3.99" : "$5.99"}
              </p>
              <p className="text-sm text-muted-foreground">
                {annual
                  ? "per month · billed $47.88/year"
                  : "per month · cancel anytime"}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button className="w-full">
                Start Pro — {annual ? "$3.99/mo" : "$5.99/mo"}
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">No contracts. Cancel anytime.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
