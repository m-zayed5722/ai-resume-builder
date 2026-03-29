"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { Language } from "@/types/resume"

const proficiencyLevels: Language["proficiency"][] = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
]

function newLanguage(): Language {
  return {
    id: crypto.randomUUID(),
    language: "",
    proficiency: "Intermediate",
  }
}

export function LanguagesSection() {
  const { data, updateField } = useResumeEditor()

  const items = data.languages ?? []
  const update = (langs: Language[]) => updateField("languages", langs)

  const addItem = () => {
    const item = newLanguage()
    update([...items, item])
  }

  const removeItem = (id: string) => {
    update(items.filter((l) => l.id !== id))
  }

  const updateItem = (id: string, field: keyof Language, value: string) => {
    update(items.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Languages
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No languages added yet. Click Add to get started.
        </p>
      )}

      {items.map((lang) => (
        <div key={lang.id} className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Language</Label>
              <Input
                value={lang.language}
                onChange={(e) => updateItem(lang.id, "language", e.target.value)}
                placeholder="English"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Proficiency</Label>
              <Select
                value={lang.proficiency}
                onValueChange={(value) => value && updateItem(lang.id, "proficiency", value)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive"
              onClick={() => removeItem(lang.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
