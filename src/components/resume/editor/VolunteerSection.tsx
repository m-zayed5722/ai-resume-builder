"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { VolunteerWork } from "@/types/resume"

function newVolunteer(): VolunteerWork {
  return {
    id: crypto.randomUUID(),
    organization: "",
    role: "",
    startDate: "",
    endDate: null,
    description: "",
  }
}

export function VolunteerSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const items = data.volunteer ?? []
  const update = (volunteer: VolunteerWork[]) => updateField("volunteer", volunteer)

  const addItem = () => {
    const item = newVolunteer()
    update([...items, item])
  }

  const removeItem = (id: string) => {
    update(items.filter((v) => v.id !== id))
  }

  const updateItem = (id: string, field: keyof VolunteerWork, value: any) => {
    update(items.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Volunteer Experience
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No volunteer experience added yet. Click Add to get started.
        </p>
      )}

      {items.map((vol, idx) => (
        <div key={vol.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {vol.role || vol.organization || `Volunteer ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [vol.id]: !c[vol.id] }))}
              >
                {collapsed[vol.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(vol.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[vol.id] && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Organization</Label>
                  <Input
                    value={vol.organization}
                    onChange={(e) => updateItem(vol.id, "organization", e.target.value)}
                    placeholder="Red Cross"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Input
                    value={vol.role}
                    onChange={(e) => updateItem(vol.id, "role", e.target.value)}
                    placeholder="Volunteer Coordinator"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    value={vol.startDate}
                    onChange={(e) => updateItem(vol.id, "startDate", e.target.value)}
                    placeholder="Jun 2021"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    value={vol.endDate ?? ""}
                    onChange={(e) => updateItem(vol.id, "endDate", e.target.value || null)}
                    placeholder="Present"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={vol.description}
                  onChange={(e) => updateItem(vol.id, "description", e.target.value)}
                  placeholder="Describe your volunteer work..."
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
