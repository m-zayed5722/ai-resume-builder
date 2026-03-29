"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { suggestSkillsAction } from "@/lib/actions/ai"
import type { SkillGroup } from "@/types/resume"

function newGroup(): SkillGroup {
  return { id: crypto.randomUUID(), category: "", skills: [] }
}

export function SkillsSection() {
  const { data, updateField } = useResumeEditor()
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({})
  const [suggesting, setSuggesting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const update = (items: SkillGroup[]) => updateField("skills", items)

  const addGroup = () => update([...data.skills, newGroup()])
  const removeGroup = (id: string) => update(data.skills.filter((g) => g.id !== id))
  const updateCategory = (id: string, category: string) =>
    update(data.skills.map((g) => (g.id === id ? { ...g, category } : g)))

  const addSkill = (id: string) => {
    const value = skillInputs[id]?.trim()
    if (!value) return
    update(
      data.skills.map((g) =>
        g.id === id ? { ...g, skills: [...g.skills, value] } : g
      )
    )
    setSkillInputs((prev) => ({ ...prev, [id]: "" }))
  }

  const removeSkill = (groupId: string, skill: string) => {
    update(
      data.skills.map((g) =>
        g.id === groupId ? { ...g, skills: g.skills.filter((s) => s !== skill) } : g
      )
    )
  }

  const handleSuggestSkills = async () => {
    const jobTitle = data.personalInfo.jobTitle
    if (!jobTitle) return alert("Add a job title in the Info tab first.")
    setSuggesting(true)
    setSuggestions([])
    const currentSkills = data.skills.flatMap((g) => g.skills)
    const result = await suggestSkillsAction({ jobTitle, currentSkills })
    if (result.skills) setSuggestions(result.skills)
    if (result.error) alert(result.error)
    setSuggesting(false)
  }

  const addSuggestion = (skill: string) => {
    // Add to first group, or create a new one
    if (data.skills.length === 0) {
      update([{ id: crypto.randomUUID(), category: "Skills", skills: [skill] }])
    } else {
      update(
        data.skills.map((g, i) =>
          i === 0 ? { ...g, skills: [...g.skills, skill] } : g
        )
      )
    }
    setSuggestions((prev) => prev.filter((s) => s !== skill))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Skills
        </h3>
        <div className="flex gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSuggestSkills}
            disabled={suggesting}
            className="h-7 gap-1 text-xs"
          >
            {suggesting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            AI Suggest
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addGroup} className="h-7 gap-1 text-xs">
            <Plus className="h-3 w-3" /> Add Group
          </Button>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="border rounded-lg p-3 bg-blue-50 space-y-2">
          <Label className="text-xs flex items-center gap-1 text-blue-700">
            <Sparkles className="h-3 w-3" /> Suggested skills (click to add)
          </Label>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-blue-100 text-xs"
                onClick={() => addSuggestion(skill)}
              >
                <Plus className="h-2.5 w-2.5 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {data.skills.length === 0 && suggestions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No skills added yet. Click Add Group or AI Suggest to get started.
        </p>
      )}

      {data.skills.map((group) => (
        <div key={group.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex gap-2 items-center">
            <Input
              value={group.category}
              onChange={(e) => updateCategory(group.id, e.target.value)}
              placeholder="Category (e.g. Languages, Frameworks)"
              className="h-8 text-sm flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-destructive"
              onClick={() => removeGroup(group.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-1">
            {group.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="gap-1 text-xs">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(group.id, skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-1">
            <Input
              value={skillInputs[group.id] ?? ""}
              onChange={(e) => setSkillInputs((p) => ({ ...p, [group.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(group.id))}
              placeholder="Type a skill and press Enter or Add"
              className="h-8 text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSkill(group.id)}
              className="h-8 shrink-0"
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
