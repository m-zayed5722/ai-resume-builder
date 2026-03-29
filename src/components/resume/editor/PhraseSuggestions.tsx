"use client"

import { useState } from "react"
import { searchPhrases } from "@/lib/phrases"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, ChevronDown, ChevronUp } from "lucide-react"

interface Props {
  onInsert: (phrase: string) => void
}

export function PhraseSuggestions({ onInsert }: Props) {
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const results = searchPhrases(query)

  const toggle = (role: string) =>
    setExpanded((prev) => ({ ...prev, [role]: !prev[role] }))

  return (
    <div className="border rounded-lg bg-muted/30 overflow-hidden">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phrases by role or keyword..."
            className="h-7 text-xs pl-7"
          />
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {results.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No phrases found.
          </p>
        )}
        {results.map((cat) => (
          <div key={cat.role} className="border-b last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(cat.role)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <span>{cat.role}</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span>{cat.phrases.length}</span>
                {expanded[cat.role] ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </span>
            </button>
            {expanded[cat.role] && (
              <div className="px-2 pb-2 space-y-1">
                {cat.phrases.map((phrase, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1 group"
                  >
                    <p className="text-[11px] text-muted-foreground flex-1 leading-relaxed py-1 px-1">
                      {phrase}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onInsert(phrase)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
