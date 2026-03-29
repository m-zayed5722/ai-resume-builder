"use client"

import { useResumeEditor } from "./ResumeEditorContext"
import { PersonalInfoSection } from "./PersonalInfoSection"
import { ExperienceSection } from "./ExperienceSection"
import { EducationSection } from "./EducationSection"
import { SkillsSection } from "./SkillsSection"
import { CertificationsSection } from "./CertificationsSection"
import { ProjectsSection } from "./ProjectsSection"
import { LanguagesSection } from "./LanguagesSection"
import { VolunteerSection } from "./VolunteerSection"
import { AwardsSection } from "./AwardsSection"
import { CustomSectionEditor } from "./CustomSectionEditor"
import { SectionOrderPanel } from "./SectionOrderPanel"
import { ATSScorePanel } from "./ATSScorePanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

function SaveIndicator() {
  const { saveStatus } = useResumeEditor()

  if (saveStatus === "idle") return null

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {saveStatus === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {saveStatus === "saved" && (
        <>
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span className="text-green-600">Saved</span>
        </>
      )}
      {saveStatus === "error" && (
        <>
          <AlertCircle className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Save failed</span>
        </>
      )}
    </div>
  )
}

function EditorContent() {
  const { userPlan } = useResumeEditor()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Resume Editor</span>
          {userPlan === "PRO" && (
            <Badge variant="default" className="text-xs h-5">Pro</Badge>
          )}
        </div>
        <SaveIndicator />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="info" className="w-full">
          <div className="overflow-x-auto border-b">
            <TabsList className="w-max min-w-full rounded-none h-10 px-1">
              <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">Work</TabsTrigger>
              <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
              <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
              <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
              <TabsTrigger value="certs" className="text-xs">Certs</TabsTrigger>
              <TabsTrigger value="more" className="text-xs">More</TabsTrigger>
              <TabsTrigger value="ats" className="text-xs">ATS</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="info" className="mt-0">
              <PersonalInfoSection />
            </TabsContent>
            <TabsContent value="experience" className="mt-0">
              <ExperienceSection />
            </TabsContent>
            <TabsContent value="education" className="mt-0">
              <EducationSection />
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <SkillsSection />
            </TabsContent>
            <TabsContent value="projects" className="mt-0">
              <ProjectsSection />
            </TabsContent>
            <TabsContent value="certs" className="mt-0">
              <CertificationsSection />
            </TabsContent>
            <TabsContent value="more" className="mt-0">
              <div className="space-y-8">
                <LanguagesSection />
                <VolunteerSection />
                <AwardsSection />
                <CustomSectionEditor />
                <SectionOrderPanel />
              </div>
            </TabsContent>
            <TabsContent value="ats" className="mt-0">
              <ATSScorePanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export function ResumeEditorContent() {
  return <EditorContent />
}
