"use client"

import type { ResumeData } from "@/types/resume"
import { DEFAULT_SECTION_ORDER } from "@/types/resume"
import { type ReactNode } from "react"

function formatDate(date: string | null | undefined): string {
  if (!date) return "Present"
  return date
}

interface Props {
  data: ResumeData
}

export function ResumePreview({ data }: Props) {
  const p = data.personalInfo
  const contacts = [p.email, p.phone, p.location, p.website, p.linkedin].filter(Boolean) as string[]

  const hasContent =
    p.fullName || p.jobTitle || p.summary ||
    data.experience.length > 0 ||
    data.education.length > 0 ||
    data.skills.length > 0 ||
    (data.projects ?? []).length > 0 ||
    (data.certifications ?? []).length > 0

  if (!hasContent) {
    return (
      <p className="text-center text-muted-foreground text-xs pt-40">
        Fill in the editor on the left — changes save automatically.
      </p>
    )
  }

  const sectionOrder = data.sectionOrder ?? DEFAULT_SECTION_ORDER

  const sectionRenderers: Record<string, () => ReactNode> = {
    experience: () => renderExperience(data),
    education: () => renderEducation(data),
    skills: () => renderSkills(data),
    projects: () => renderProjects(data),
    certifications: () => renderCertifications(data),
    languages: () => renderLanguages(data),
    volunteer: () => renderVolunteer(data),
    awards: () => renderAwards(data),
    customSections: () => renderCustomSections(data),
  }

  return (
    <div className="font-serif text-[10px] leading-[1.4] text-[#1a1a1a]">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-2.5 mb-3.5">
        <h1 className="text-[22px] font-bold text-[#111827] mb-0.5 font-sans">
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p className="text-xs text-[#4b5563] mb-1.5">{p.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {contacts.map((c, i) => (
            <span key={i} className="text-[9px] text-[#6b7280]">{c}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-0.5 mb-1.5 font-sans">
            Summary
          </h2>
          <p className="text-[9.5px] text-[#374151] leading-[1.5]">{p.summary}</p>
        </div>
      )}

      {/* Ordered sections */}
      {sectionOrder.map((key) => {
        const renderer = sectionRenderers[key]
        if (!renderer) return null
        return <div key={key}>{renderer()}</div>
      })}
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 border-b border-blue-100 pb-0.5 mb-1.5 font-sans">
      {children}
    </h2>
  )
}

function formatDate2(date: string | null | undefined): string {
  if (!date) return "Present"
  return date
}

function renderExperience(data: ResumeData) {
  if (data.experience.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Experience</SectionHeading>
      {data.experience.map((exp) => (
        <div key={exp.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{exp.title}</span>
            <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
              {exp.startDate} – {formatDate2(exp.endDate)}
            </span>
          </div>
          <p className="text-[9px] text-[#4b5563] mb-0.5">
            {exp.company}{exp.location ? ` · ${exp.location}` : ""}
          </p>
          {exp.bullets.filter(Boolean).map((bullet, i) => (
            <div key={i} className="flex gap-1.5 pl-1 mb-0.5">
              <span className="text-[10px] text-[#4b5563]">&bull;</span>
              <span className="text-[9px] text-[#374151] flex-1">{bullet}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function renderEducation(data: ResumeData) {
  if (data.education.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Education</SectionHeading>
      {data.education.map((edu) => (
        <div key={edu.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{edu.institution}</span>
            <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
              {edu.startDate} – {formatDate2(edu.endDate)}
            </span>
          </div>
          <p className="text-[9px] text-[#4b5563]">
            {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
            {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
          </p>
        </div>
      ))}
    </div>
  )
}

function renderSkills(data: ResumeData) {
  if (data.skills.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Skills</SectionHeading>
      {data.skills.map((group) => (
        <div key={group.id} className="flex mb-0.5">
          <span className="font-bold text-[9px] w-20 text-[#374151] font-sans shrink-0">{group.category}:</span>
          <span className="text-[9px] text-[#4b5563] flex-1">{group.skills.join(", ")}</span>
        </div>
      ))}
    </div>
  )
}

function renderProjects(data: ResumeData) {
  const projects = data.projects ?? []
  if (projects.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Projects</SectionHeading>
      {projects.map((proj) => (
        <div key={proj.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{proj.name}</span>
            {proj.startDate && (
              <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
                {proj.startDate}{proj.endDate !== undefined ? ` – ${formatDate2(proj.endDate)}` : ""}
              </span>
            )}
          </div>
          {proj.url && <p className="text-[9px] text-blue-600">{proj.url}</p>}
          {proj.description && <p className="text-[9px] text-[#374151]">{proj.description}</p>}
          {proj.technologies.length > 0 && <p className="text-[9px] text-[#4b5563]">{proj.technologies.join(", ")}</p>}
        </div>
      ))}
    </div>
  )
}

function renderCertifications(data: ResumeData) {
  const certs = data.certifications ?? []
  if (certs.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Certifications</SectionHeading>
      {certs.map((cert) => (
        <div key={cert.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{cert.name}</span>
            <span className="text-[9px] text-[#6b7280]">{cert.date}</span>
          </div>
          <p className="text-[9px] text-[#4b5563]">{cert.issuer}</p>
        </div>
      ))}
    </div>
  )
}

function renderLanguages(data: ResumeData) {
  const langs = data.languages ?? []
  if (langs.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Languages</SectionHeading>
      {langs.map((lang) => (
        <div key={lang.id} className="flex mb-0.5">
          <span className="font-bold text-[9px] w-20 text-[#374151] font-sans shrink-0">{lang.language}:</span>
          <span className="text-[9px] text-[#4b5563] flex-1">{lang.proficiency}</span>
        </div>
      ))}
    </div>
  )
}

function renderVolunteer(data: ResumeData) {
  const vols = data.volunteer ?? []
  if (vols.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Volunteer Experience</SectionHeading>
      {vols.map((vol) => (
        <div key={vol.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{vol.role}</span>
            <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
              {vol.startDate} – {formatDate2(vol.endDate)}
            </span>
          </div>
          <p className="text-[9px] text-[#4b5563] mb-0.5">{vol.organization}</p>
          {vol.description && <p className="text-[9px] text-[#374151]">{vol.description}</p>}
        </div>
      ))}
    </div>
  )
}

function renderAwards(data: ResumeData) {
  const awards = data.awards ?? []
  if (awards.length === 0) return null
  return (
    <div className="mb-3">
      <SectionHeading>Awards</SectionHeading>
      {awards.map((award) => (
        <div key={award.id} className="mb-2">
          <div className="flex justify-between items-start">
            <span className="font-bold text-[10px] font-sans">{award.title}</span>
            <span className="text-[9px] text-[#6b7280]">{award.date}</span>
          </div>
          <p className="text-[9px] text-[#4b5563]">{award.issuer}</p>
          {award.description && <p className="text-[9px] text-[#374151]">{award.description}</p>}
        </div>
      ))}
    </div>
  )
}

function renderCustomSections(data: ResumeData) {
  const sections = data.customSections ?? []
  if (sections.length === 0) return null
  return (
    <>
      {sections.map((section) => (
        section.items.length > 0 && (
          <div key={section.id} className="mb-3">
            <SectionHeading>{section.title}</SectionHeading>
            {section.items.map((item) => (
              <div key={item.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] font-sans">{item.heading}</span>
                  {item.date && <span className="text-[9px] text-[#6b7280]">{item.date}</span>}
                </div>
                {item.subheading && <p className="text-[9px] text-[#4b5563]">{item.subheading}</p>}
                {item.description && <p className="text-[9px] text-[#374151]">{item.description}</p>}
              </div>
            ))}
          </div>
        )
      ))}
    </>
  )
}
