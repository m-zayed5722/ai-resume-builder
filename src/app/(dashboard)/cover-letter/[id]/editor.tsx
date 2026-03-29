"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Loader2, Save, Copy, Check } from "lucide-react"
import { updateCoverLetter, generateCoverLetterAction } from "@/lib/actions/cover-letter"

interface Props {
  coverLetter: {
    id: string
    title: string
    content: string
    jobDescription: string
    companyName: string
    resumeId: string | null
  }
  resumes: { id: string; title: string }[]
}

export function CoverLetterEditor({ coverLetter, resumes }: Props) {
  const [title, setTitle] = useState(coverLetter.title)
  const [content, setContent] = useState(coverLetter.content)
  const [jobDescription, setJobDescription] = useState(coverLetter.jobDescription)
  const [companyName, setCompanyName] = useState(coverLetter.companyName)
  const [resumeId, setResumeId] = useState(coverLetter.resumeId ?? resumes[0]?.id ?? "")
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save with debounce
  const debouncedSave = useCallback(
    (data: { title?: string; content?: string; jobDescription?: string; companyName?: string }) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(async () => {
        setSaving(true)
        await updateCoverLetter(coverLetter.id, data)
        setSaving(false)
      }, 1500)
    },
    [coverLetter.id]
  )

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  const handleTitleChange = (value: string) => {
    setTitle(value)
    debouncedSave({ title: value })
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    debouncedSave({ content: value })
  }

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value)
    debouncedSave({ jobDescription: value })
  }

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value)
    debouncedSave({ companyName: value })
  }

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return alert("Please enter a job description first.")
    setGenerating(true)
    const result = await generateCoverLetterAction({
      coverLetterId: coverLetter.id,
      resumeId: resumeId || undefined,
      jobDescription,
      companyName,
    })
    if (result.content) {
      setContent(result.content)
    }
    if (result.error) alert(result.error)
    setGenerating(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/cover-letters">
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="h-8 text-sm font-medium border-transparent hover:border-input focus:border-input max-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving...
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!content}
            className="h-8 gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => handleCompanyNameChange(e.target.value)}
                placeholder="e.g. Google"
                className="h-9 text-sm"
              />
            </div>

            {resumes.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Resume to Reference</Label>
                <Select value={resumeId} onValueChange={(v) => v && setResumeId(v)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Job Description</Label>
              <Textarea
                value={jobDescription}
                onChange={(e) => handleJobDescriptionChange(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="text-sm resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !jobDescription.trim()}
              className="w-full gap-1.5"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {generating ? "Generating..." : "Generate Cover Letter"}
            </Button>
          </div>

          {/* Right: Content editor */}
          <div className="lg:col-span-2 space-y-2">
            <Label className="text-xs font-medium">Cover Letter Content</Label>
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Your cover letter will appear here after generation. You can also write or edit it manually."
              rows={24}
              className="text-sm resize-none leading-relaxed"
            />
            {content && (
              <p className="text-xs text-muted-foreground text-right">
                {content.split(/\s+/).filter(Boolean).length} words
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
