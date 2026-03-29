"use client"

import { useState } from "react"
import { scoreATSAction } from "@/lib/actions/ai"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, Target, AlertCircle, CheckCircle2 } from "lucide-react"
import { useResumeEditor } from "./ResumeEditorContext"

export function ATSScorePanel() {
  const { resumeId, userPlan } = useResumeEditor()
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    score: number
    missing: string[]
    suggestions: string[]
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScore = async () => {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError(null)
    const res = await scoreATSAction({ resumeId, jobDescription })
    if (res.error) {
      setError(res.error)
    } else if (res.score !== undefined) {
      setResult({ score: res.score, missing: res.missing ?? [], suggestions: res.suggestions ?? [] })
    }
    setLoading(false)
  }

  const scoreColor = result
    ? result.score >= 75
      ? "text-green-600"
      : result.score >= 50
      ? "text-yellow-600"
      : "text-red-600"
    : ""

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
        <Target className="h-4 w-4" /> ATS Score Analyzer
      </h3>
      <p className="text-xs text-muted-foreground">
        Paste a job description to see how well your resume matches the ATS keywords.
      </p>

      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job description here..."
        rows={6}
        className="text-sm"
      />

      <Button
        onClick={handleScore}
        disabled={loading || !jobDescription.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Analyzing...
          </>
        ) : (
          "Analyze Resume"
        )}
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">ATS Match Score</span>
              <span className={`text-2xl font-bold ${scoreColor}`}>{result.score}%</span>
            </div>
            <Progress value={result.score} className="h-2" />
          </div>

          {result.missing.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" /> Missing Keywords
              </p>
              <div className="flex flex-wrap gap-1">
                {result.missing.map((kw) => (
                  <Badge key={kw} variant="destructive" className="text-xs font-normal">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium flex items-center gap-1 text-green-700">
                <CheckCircle2 className="h-3 w-3" /> Suggestions
              </p>
              <ul className="space-y-1">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="shrink-0 text-green-600 font-bold">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
