"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Award } from "@/types/resume"

function newAward(): Award {
  return {
    id: crypto.randomUUID(),
    title: "",
    issuer: "",
    date: "",
    description: "",
  }
}

export function AwardsSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const items = data.awards ?? []
  const update = (awards: Award[]) => updateField("awards", awards)

  const addItem = () => {
    const item = newAward()
    update([...items, item])
  }

  const removeItem = (id: string) => {
    update(items.filter((a) => a.id !== id))
  }

  const updateItem = (id: string, field: keyof Award, value: string) => {
    update(items.map((a) => (a.id === id ? { ...a, [field]: value } : a)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Awards
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No awards added yet. Click Add to get started.
        </p>
      )}

      {items.map((award, idx) => (
        <div key={award.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {award.title || `Award ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [award.id]: !c[award.id] }))}
              >
                {collapsed[award.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(award.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[award.id] && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Award Title</Label>
                  <Input
                    value={award.title}
                    onChange={(e) => updateItem(award.id, "title", e.target.value)}
                    placeholder="Employee of the Year"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Issuer</Label>
                  <Input
                    value={award.issuer}
                    onChange={(e) => updateItem(award.id, "issuer", e.target.value)}
                    placeholder="Acme Corp"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    value={award.date}
                    onChange={(e) => updateItem(award.id, "date", e.target.value)}
                    placeholder="Dec 2023"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Description (optional)</Label>
                <Textarea
                  value={award.description ?? ""}
                  onChange={(e) => updateItem(award.id, "description", e.target.value)}
                  placeholder="Brief description of the award..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
