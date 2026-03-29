"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { ClassicTemplate } from "./pdf/ClassicTemplate"
import { ModernTemplate } from "./pdf/ModernTemplate"
import { MinimalTemplate } from "./pdf/MinimalTemplate"
import { ExecutiveTemplate } from "./pdf/ExecutiveTemplate"
import { useResumeEditor } from "./editor/ResumeEditorContext"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { ResumeData } from "@/types/resume"
import type { ComponentType } from "react"

const pdfComponents: Record<string, ComponentType<{ data: ResumeData; showWatermark?: boolean }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  executive: ExecutiveTemplate,
}

interface Props {
  filename?: string
}

export function PDFDownloadButton({ filename = "resume" }: Props) {
  const { data, userPlan, templateId } = useResumeEditor()
  const showWatermark = userPlan === "FREE"
  const PDFComponent = pdfComponents[templateId] ?? ClassicTemplate

  return (
    <PDFDownloadLink
      document={<PDFComponent data={data} showWatermark={showWatermark} />}
      fileName={`${filename}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <Button size="sm" disabled={loading} className="gap-1.5">
          <Download className="h-3.5 w-3.5" />
          {loading ? "Preparing..." : "Download PDF"}
          {showWatermark && (
            <span className="text-xs opacity-70">(watermark)</span>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
