"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateSummaryAction } from "@/lib/actions/ai"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"

export function PersonalInfoSection() {
  const { data, updateField } = useResumeEditor()
  const p = data.personalInfo
  const [generatingSummary, setGeneratingSummary] = useState(false)

  const update = (field: keyof typeof p, value: string) => {
    updateField("personalInfo", { ...p, [field]: value })
  }

  const handleGenerateSummary = async () => {
    if (!p.jobTitle) return
    setGeneratingSummary(true)
    const skills = data.skills.flatMap((g) => g.skills).slice(0, 6)
    const years = data.experience.length > 0 ? data.experience.length + 2 : 3
    const { summary, error } = await generateSummaryAction({
      jobTitle: p.jobTitle,
      yearsOfExperience: years,
      topSkills: skills,
    })
    if (summary) update("summary", summary)
    if (error) alert(error)
    setGeneratingSummary(false)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={p.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={p.jobTitle}
            onChange={(e) => update("jobTitle", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={p.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={p.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={p.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="New York, NY"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={p.linkedin ?? ""}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/janesmith"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label htmlFor="website">Website / Portfolio</Label>
          <Input
            id="website"
            value={p.website ?? ""}
            onChange={(e) => update("website", e.target.value)}
            placeholder="janesmith.dev"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={generatingSummary || !p.jobTitle}
            className="h-7 text-xs gap-1"
          >
            {generatingSummary ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            AI Generate
          </Button>
        </div>
        <Textarea
          id="summary"
          value={p.summary}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="A brief professional summary highlighting your key skills and experience..."
          rows={4}
        />
      </div>
    </div>
  )
}
