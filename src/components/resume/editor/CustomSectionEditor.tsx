"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { CustomSection, CustomSectionItem } from "@/types/resume"

function newSection(): CustomSection {
  return {
    id: crypto.randomUUID(),
    title: "",
    items: [],
  }
}

function newItem(): CustomSectionItem {
  return {
    id: crypto.randomUUID(),
    heading: "",
    subheading: "",
    date: "",
    description: "",
  }
}

export function CustomSectionEditor() {
  const { data, updateField } = useResumeEditor()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const sections = data.customSections ?? []
  const update = (customSections: CustomSection[]) =>
    updateField("customSections", customSections)

  const addSection = () => {
    const section = newSection()
    update([...sections, section])
  }

  const removeSection = (id: string) => {
    update(sections.filter((s) => s.id !== id))
  }

  const updateSectionTitle = (id: string, title: string) => {
    update(sections.map((s) => (s.id === id ? { ...s, title } : s)))
  }

  const addItemToSection = (sectionId: string) => {
    const item = newItem()
    update(
      sections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s
      )
    )
  }

  const removeItemFromSection = (sectionId: string, itemId: string) => {
    update(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      )
    )
  }

  const updateItemField = (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    update(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, [field]: value } : i
              ),
            }
          : s
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Custom Sections
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addSection} className="h-7 gap-1 text-xs">
          <Plus className="h-3 w-3" /> Add Section
        </Button>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
          No custom sections added yet. Click Add Section to get started.
        </p>
      )}

      {sections.map((section, sIdx) => (
        <div key={section.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {section.title || `Section ${sIdx + 1}`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [section.id]: !c[section.id] }))
                }
              >
                {collapsed[section.id] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronUp className="h-3 w-3" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {!collapsed[section.id] && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Section Title</Label>
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  placeholder="Publications, Hobbies, etc."
                  className="h-8 text-sm"
                />
              </div>

              {section.items.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-3 border border-dashed rounded">
                  No items yet. Add one below.
                </p>
              )}

              {section.items.map((item, iIdx) => (
                <div key={item.id} className="border rounded p-3 space-y-2 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium truncate">
                      {item.heading || `Item ${iIdx + 1}`}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeItemFromSection(section.id, item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Heading</Label>
                      <Input
                        value={item.heading}
                        onChange={(e) =>
                          updateItemField(section.id, item.id, "heading", e.target.value)
                        }
                        placeholder="Item title"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Subheading</Label>
                      <Input
                        value={item.subheading ?? ""}
                        onChange={(e) =>
                          updateItemField(section.id, item.id, "subheading", e.target.value)
                        }
                        placeholder="Optional subtitle"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Date</Label>
                      <Input
                        value={item.date ?? ""}
                        onChange={(e) =>
                          updateItemField(section.id, item.id, "date", e.target.value)
                        }
                        placeholder="2024"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Description (optional)</Label>
                    <Textarea
                      value={item.description ?? ""}
                      onChange={(e) =>
                        updateItemField(section.id, item.id, "description", e.target.value)
                      }
                      placeholder="Brief description..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addItemToSection(section.id)}
                className="h-7 text-xs gap-1 w-full border border-dashed"
              >
                <Plus className="h-3 w-3" /> Add Item
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
