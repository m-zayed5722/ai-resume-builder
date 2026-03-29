"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import type { Education } from "@/types/resume"

function newEducation(): Education {
  return {
    id: crypto.randomUUID(),
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: null,
    gpa: "",
  }
}

export function EducationSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const update = (items: Education[]) => updateField("education", items)

  const addItem = () => update([...data.education, newEducation()])
  const removeItem = (id: string) => update(data.education.filter((e) => e.id !== id))
  const updateItem = (id: string, field: keyof Education, value: any) =>
    update(data.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Education
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {data.education.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No education added yet. Click Add to get started.
        </p>
      )}

      {data.education.map((edu, idx) => (
        <div key={edu.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {edu.institution || `Education ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [edu.id]: !c[edu.id] }))}
              >
                {collapsed[edu.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(edu.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[edu.id] && (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 space-y-1">
                <Label className="text-xs">Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateItem(edu.id, "institution", e.target.value)}
                  placeholder="Massachusetts Institute of Technology"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateItem(edu.id, "degree", e.target.value)}
                  placeholder="Bachelor of Science"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateItem(edu.id, "field", e.target.value)}
                  placeholder="Computer Science"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateItem(edu.id, "startDate", e.target.value)}
                  placeholder="Sep 2018"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <Input
                  value={edu.endDate ?? ""}
                  onChange={(e) => updateItem(edu.id, "endDate", e.target.value || null)}
                  placeholder="May 2022"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GPA (optional)</Label>
                <Input
                  value={edu.gpa ?? ""}
                  onChange={(e) => updateItem(edu.id, "gpa", e.target.value)}
                  placeholder="3.8"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
