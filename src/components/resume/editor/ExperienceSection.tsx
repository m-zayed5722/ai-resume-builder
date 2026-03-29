"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { generateBulletsAction } from "@/lib/actions/ai"
import { useState } from "react"
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp, BookOpen } from "lucide-react"
import { PhraseSuggestions } from "./PhraseSuggestions"
import type { WorkExperience } from "@/types/resume"

function newExperience(): WorkExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    title: "",
    location: "",
    startDate: "",
    endDate: null,
    bullets: [""],
  }
}

export function ExperienceSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [generating, setGenerating] = useState<string | null>(null)
  const [aiInput, setAiInput] = useState<Record<string, string>>({})
  const [showPhrases, setShowPhrases] = useState<string | null>(null)

  const update = (items: WorkExperience[]) => updateField("experience", items)

  const addItem = () => {
    const item = newExperience()
    update([...data.experience, item])
  }

  const removeItem = (id: string) => {
    update(data.experience.filter((e) => e.id !== id))
  }

  const updateItem = (id: string, field: keyof WorkExperience, value: any) => {
    update(data.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)))
  }

  const addBullet = (id: string) => {
    update(
      data.experience.map((e) =>
        e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e
      )
    )
  }

  const removeBullet = (id: string, idx: number) => {
    update(
      data.experience.map((e) =>
        e.id === id ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
      )
    )
  }

  const updateBullet = (id: string, idx: number, value: string) => {
    update(
      data.experience.map((e) => {
        if (e.id !== id) return e
        const bullets = [...e.bullets]
        bullets[idx] = value
        return { ...e, bullets }
      })
    )
  }

  const handleGenerateBullets = async (exp: WorkExperience) => {
    const input = aiInput[exp.id] ?? ""
    if (!input || !exp.title) return
    setGenerating(exp.id)
    const { bullets, error } = await generateBulletsAction({
      jobTitle: exp.title,
      responsibility: input,
    })
    if (bullets) {
      update(
        data.experience.map((e) =>
          e.id === exp.id
            ? { ...e, bullets: [...e.bullets.filter((b) => b), ...bullets] }
            : e
        )
      )
      setAiInput((prev) => ({ ...prev, [exp.id]: "" }))
    }
    if (error) alert(error)
    setGenerating(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Work Experience
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {data.experience.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No experience added yet. Click Add to get started.
        </p>
      )}

      {data.experience.map((exp, idx) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {exp.title || exp.company || `Experience ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [exp.id]: !c[exp.id] }))}
              >
                {collapsed[exp.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(exp.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[exp.id] && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Job Title</Label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateItem(exp.id, "title", e.target.value)}
                    placeholder="Software Engineer"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateItem(exp.id, "company", e.target.value)}
                    placeholder="Acme Corp"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    value={exp.startDate}
                    onChange={(e) => updateItem(exp.id, "startDate", e.target.value)}
                    placeholder="Jan 2022"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    value={exp.endDate ?? ""}
                    onChange={(e) => updateItem(exp.id, "endDate", e.target.value || null)}
                    placeholder="Present"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateItem(exp.id, "location", e.target.value)}
                    placeholder="New York, NY"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Bullet Points</Label>
                {exp.bullets.map((bullet, i) => (
                  <div key={i} className="flex gap-1">
                    <Textarea
                      value={bullet}
                      onChange={(e) => updateBullet(exp.id, i, e.target.value)}
                      placeholder="Describe an achievement..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-destructive"
                      onClick={() => removeBullet(exp.id, i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => addBullet(exp.id)}
                  className="h-7 text-xs gap-1 w-full border border-dashed"
                >
                  <Plus className="h-3 w-3" /> Add bullet
                </Button>
              </div>

              <div className="space-y-1 pt-1 border-t">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Bullet Generator
                </Label>
                <div className="flex gap-1">
                  <Input
                    value={aiInput[exp.id] ?? ""}
                    onChange={(e) => setAiInput((p) => ({ ...p, [exp.id]: e.target.value }))}
                    placeholder="Paste a responsibility or task..."
                    className="h-8 text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    disabled={generating === exp.id || !aiInput[exp.id] || !exp.title}
                    onClick={() => handleGenerateBullets(exp)}
                    className="h-8 shrink-0"
                  >
                    {generating === exp.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-1 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPhrases(showPhrases === exp.id ? null : exp.id)}
                  className="h-7 text-xs gap-1 w-full"
                >
                  <BookOpen className="h-3 w-3" />
                  {showPhrases === exp.id ? "Hide Phrases" : "Browse Phrases"}
                </Button>
                {showPhrases === exp.id && (
                  <div className="mt-2">
                    <PhraseSuggestions
                      onInsert={(phrase) =>
                        update(
                          data.experience.map((e) =>
                            e.id === exp.id
                              ? { ...e, bullets: [...e.bullets.filter((b) => b), phrase] }
                              : e
                          )
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
