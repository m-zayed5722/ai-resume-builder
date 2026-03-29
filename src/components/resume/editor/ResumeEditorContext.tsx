"use client"

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"
import type { ResumeData } from "@/types/resume"
import { emptyResumeData } from "@/types/resume"
import { updateResume } from "@/lib/actions/resume"

interface ResumeEditorContextValue {
  data: ResumeData
  setData: (data: ResumeData) => void
  updateField: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void
  saveStatus: "idle" | "saving" | "saved" | "error"
  resumeId: string
  userPlan: "FREE" | "PRO"
  templateId: string
  setTemplateId: (id: string) => void
}

const ResumeEditorContext = createContext<ResumeEditorContextValue | null>(null)

export function useResumeEditor() {
  const ctx = useContext(ResumeEditorContext)
  if (!ctx) throw new Error("useResumeEditor must be used inside ResumeEditorProvider")
  return ctx
}

interface Props {
  resumeId: string
  initialData: ResumeData
  initialTemplate: string
  userPlan: "FREE" | "PRO"
  children: React.ReactNode
}

export function ResumeEditorProvider({ resumeId, initialData, initialTemplate, userPlan, children }: Props) {
  const [data, setDataRaw] = useState<ResumeData>(initialData ?? emptyResumeData)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [templateId, setTemplateId] = useState(initialTemplate)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestDataRef = useRef<ResumeData>(data)

  // Keep ref in sync with state
  useEffect(() => {
    latestDataRef.current = data
  }, [data])

  const saveData = useCallback(async (newData: ResumeData) => {
    setSaveStatus("saving")
    try {
      await updateResume(resumeId, newData)
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
    }
  }, [resumeId])

  const setData = useCallback((newData: ResumeData) => {
    setDataRaw(newData)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => saveData(newData), 1500)
  }, [saveData])

  // Use callback form of setState to avoid stale closure
  const updateField = useCallback(<K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setDataRaw(prev => {
      const newData = { ...prev, [key]: value }
      // Schedule save with the new data
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => saveData(newData), 1500)
      return newData
    })
  }, [saveData])

  // Flush pending save on unmount instead of just clearing
  useEffect(() => () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      // Fire final save with latest data
      saveData(latestDataRef.current)
    }
  }, [saveData])

  return (
    <ResumeEditorContext.Provider value={{ data, setData, updateField, saveStatus, resumeId, userPlan, templateId, setTemplateId }}>
      {children}
    </ResumeEditorContext.Provider>
  )
}
