"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown } from "lucide-react"
import { DEFAULT_SECTION_ORDER, SECTION_LABELS } from "@/types/resume"

export function SectionOrderPanel() {
  const { data, updateField } = useResumeEditor()
  const order = data.sectionOrder ?? DEFAULT_SECTION_ORDER

  const move = (index: number, direction: -1 | 1) => {
    const newOrder = [...order]
    const target = index + direction
    if (target < 0 || target >= newOrder.length) return
    ;[newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]]
    updateField("sectionOrder", newOrder)
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Section Order
      </h3>
      <p className="text-xs text-muted-foreground">
        Drag sections up or down to change the order they appear in your resume.
      </p>
      <div className="space-y-1">
        {order.map((key, idx) => (
          <div
            key={key}
            className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-background"
          >
            <span className="text-xs text-muted-foreground w-5 text-center">{idx + 1}</span>
            <span className="text-sm flex-1">{SECTION_LABELS[key] ?? key}</span>
            <div className="flex gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={idx === order.length - 1}
                onClick={() => move(idx, 1)}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
