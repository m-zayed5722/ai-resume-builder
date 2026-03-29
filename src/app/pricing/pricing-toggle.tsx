"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function PricingToggle() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="flex items-center justify-center gap-3">
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
      <Badge variant="secondary" className="text-xs">Save 33%</Badge>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          // This is handled client-side by the toggle state
          `,
        }}
      />
    </div>
  )
}
