"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Certification } from "@/types/resume"

function newCertification(): Certification {
  return {
    id: crypto.randomUUID(),
    name: "",
    issuer: "",
    date: "",
  }
}

export function CertificationsSection() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const items = data.certifications ?? []
  const update = (certs: Certification[]) => updateField("certifications", certs)

  const addItem = () => {
    const item = newCertification()
    update([...items, item])
  }

  const removeItem = (id: string) => {
    update(items.filter((c) => c.id !== id))
  }

  const updateItem = (id: string, field: keyof Certification, value: string) => {
    update(items.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Certifications
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No certifications added yet. Click Add to get started.
        </p>
      )}

      {items.map((cert, idx) => (
        <div key={cert.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {cert.name || `Certification ${idx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCollapsed((c) => ({ ...c, [cert.id]: !c[cert.id] }))}
              >
                {collapsed[cert.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeItem(cert.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[cert.id] && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Certification Name</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateItem(cert.id, "name", e.target.value)}
                    placeholder="AWS Solutions Architect"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Issuer</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateItem(cert.id, "issuer", e.target.value)}
                    placeholder="Amazon Web Services"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date</Label>
                  <Input
                    value={cert.date}
                    onChange={(e) => updateItem(cert.id, "date", e.target.value)}
                    placeholder="Mar 2024"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
