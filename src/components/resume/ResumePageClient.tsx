"use client"

import dynamic from "next/dynamic"
import { ResumeEditorProvider, useResumeEditor } from "./editor/ResumeEditorContext"
import { ResumeEditorContent } from "./editor/ResumeEditor"
import { ResumePreview } from "./ResumePreview"
import { ModernPreview } from "./previews/ModernPreview"
import { MinimalPreview } from "./previews/MinimalPreview"
import { ExecutivePreview } from "./previews/ExecutivePreview"
import { getTemplateList } from "@/lib/templates/registry"
import { updateResumeTemplate } from "@/lib/actions/resume"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"
import type { ResumeData } from "@/types/resume"

// Load react-pdf entirely client-side
const PDFDownloadButton = dynamic(
  () => import("./PDFDownloadButton").then((m) => m.PDFDownloadButton),
  { ssr: false, loading: () => null }
)

const previewComponents: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  classic: ResumePreview,
  modern: ModernPreview,
  minimal: MinimalPreview,
  executive: ExecutivePreview,
}

interface Props {
  resumeId: string
  resumeTitle: string
  initialData: ResumeData
  initialTemplate: string
  userPlan: "FREE" | "PRO"
}

function TemplateSelector() {
  const { templateId, setTemplateId, resumeId, userPlan } = useResumeEditor()
  const templates = getTemplateList()

  const handleChange = async (value: string | null) => {
    if (!value) return
    const tmpl = templates.find((t) => t.id === value)
    if (tmpl?.isPro && userPlan === "FREE") return
    setTemplateId(value)
    await updateResumeTemplate(resumeId, value)
  }

  return (
    <Select value={templateId} onValueChange={handleChange}>
      <SelectTrigger className="h-7 w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {templates.map((t) => (
          <SelectItem key={t.id} value={t.id} disabled={t.isPro && userPlan === "FREE"}>
            <span className="flex items-center gap-1.5">
              {t.name}
              {t.isPro && userPlan === "FREE" && <Lock className="h-3 w-3 text-muted-foreground" />}
              {t.isPro && userPlan === "FREE" && <span className="text-[10px] text-muted-foreground">(Pro)</span>}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function PreviewPane({ resumeTitle }: { resumeTitle: string }) {
  const { data, templateId } = useResumeEditor()
  const PreviewComponent = previewComponents[templateId] ?? ResumePreview

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-2 border-b bg-background">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Preview</span>
          <TemplateSelector />
        </div>
        <PDFDownloadButton filename={resumeTitle} />
      </div>
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-8 bg-muted/20">
        <div className="w-full max-w-[700px] bg-white shadow-lg rounded-sm min-h-[900px] p-12">
          <PreviewComponent data={data} />
        </div>
      </div>
    </div>
  )
}

export function ResumePageClient({ resumeId, resumeTitle, initialData, initialTemplate, userPlan }: Props) {
  return (
    <ResumeEditorProvider resumeId={resumeId} initialData={initialData} initialTemplate={initialTemplate} userPlan={userPlan}>
      <div className="flex h-screen overflow-hidden bg-muted/30">
        {/* Left pane: Editor (420px) */}
        <div className="w-[420px] shrink-0 flex flex-col border-r bg-background overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/40 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="truncate text-foreground font-medium">{resumeTitle}</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ResumeEditorContent />
          </div>
        </div>

        {/* Right pane: Live Preview */}
        <PreviewPane resumeTitle={resumeTitle} />
      </div>
    </ResumeEditorProvider>
  )
}
