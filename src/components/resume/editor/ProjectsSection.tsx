"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Project } from "@/types/resume"

function newProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: "",
    url: "",
    description: "",
    technologies: [],
    startDate: "",
    endDate: null,
  }
}

export function ProjectsSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const items = data.projects ?? []
  const update = (projects: Project[]) => updateField("projects", projects)

  const addItem = () => {
    const item = newProject()
    update([...items, item])
  }

  const removeItem = (id: string) => {
    update(items.filter((p) => p.id !== id))
  }

  const updateItem = (id: string, field: keyof Project, value: any) => {
    update(items.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Projects
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No projects added yet. Click Add to get started.
        </p>
      )}

      {items.map((proj, idx) => (
        <div key={proj.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {proj.name || `Project ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [proj.id]: !c[proj.id] }))}
              >
                {collapsed[proj.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(proj.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[proj.id] && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Project Name</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => updateItem(proj.id, "name", e.target.value)}
                    placeholder="My Awesome Project"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={proj.url ?? ""}
                    onChange={(e) => updateItem(proj.id, "url", e.target.value || undefined)}
                    placeholder="https://github.com/..."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    value={proj.startDate ?? ""}
                    onChange={(e) => updateItem(proj.id, "startDate", e.target.value || undefined)}
                    placeholder="Jan 2023"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    value={proj.endDate ?? ""}
                    onChange={(e) => updateItem(proj.id, "endDate", e.target.value || null)}
                    placeholder="Present"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Technologies (comma-separated)</Label>
                  <Input
                    value={proj.technologies.join(", ")}
                    onChange={(e) =>
                      updateItem(
                        proj.id,
                        "technologies",
                        e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean)
                      )
                    }
                    placeholder="React, TypeScript, Node.js"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) => updateItem(proj.id, "description", e.target.value)}
                  placeholder="Describe what the project does..."
                  rows={3}
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
