import type { ResumeData } from "@/types/resume"
import type { ComponentType } from "react"

export interface TemplateDefinition {
  id: string
  name: string
  description: string
  isPro: boolean
}

// We store template ID -> metadata. The actual components are loaded lazily.
export const templates: Record<string, TemplateDefinition> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional layout with blue accents. Great for most industries.",
    isPro: false,
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Two-column design with a dark sidebar. Stand out visually.",
    isPro: false,
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean, no-color design. Maximum ATS compatibility.",
    isPro: false,
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Serif fonts, conservative styling. Ideal for senior roles.",
    isPro: true,
  },
}

export function getTemplate(id: string): TemplateDefinition {
  return templates[id] ?? templates.classic
}

export function getTemplateList(): TemplateDefinition[] {
  return Object.values(templates)
}
