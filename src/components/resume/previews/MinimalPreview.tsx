"use client"

import type { ResumeData } from "@/types/resume"

function formatDate(date: string | null | undefined): string {
  if (!date) return "Present"
  return date
}

interface Props {
  data: ResumeData
}

export function MinimalPreview({ data }: Props) {
  const p = data.personalInfo
  const contacts = [
    p.email,
    p.phone,
    p.location,
    p.website,
    p.linkedin,
  ].filter(Boolean) as string[]

  return (
    <div className="text-[10px] leading-[1.45] px-[52px] py-[48px] text-[#222222] min-h-full">
      {/* Header */}
      <div className="mb-5 pb-3 border-b border-[#d1d5db]">
        <h1 className="text-[24px] font-bold text-[#111111] mb-0.5">
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p className="text-[11px] text-[#555555] mb-1.5">{p.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-2.5">
          {contacts.map((c, i) => (
            <span key={i} className="text-[9px] text-[#666666]">{c}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Summary
          </h2>
          <p className="text-[9.5px] text-[#333333] leading-[1.6]">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{exp.title}</span>
                <span className="text-[9px] text-[#666666] shrink-0 ml-2">
                  {exp.startDate} – {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-[9px] text-[#555555] mb-0.5">
                {exp.company}{exp.location ? ` · ${exp.location}` : ""}
              </p>
              {exp.bullets.filter(Boolean).map((bullet, i) => (
                <div key={i} className="flex gap-1.5 pl-1.5 mb-0.5">
                  <span className="text-[10px] text-[#555555]">•</span>
                  <span className="text-[9px] text-[#333333] flex-1">{bullet}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{edu.institution}</span>
                <span className="text-[9px] text-[#666666] shrink-0 ml-2">
                  {edu.startDate} – {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-[9px] text-[#555555]">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Skills
          </h2>
          {data.skills.map((group) => (
            <div key={group.id} className="flex mb-0.5">
              <span className="font-bold text-[9px] w-[85px] text-[#333333]">{group.category}:</span>
              <span className="text-[9px] text-[#555555] flex-1">{group.skills.join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {(data.certifications ?? []).length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Certifications
          </h2>
          {data.certifications!.map((cert) => (
            <div key={cert.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{cert.name}</span>
                <span className="text-[9px] text-[#666666]">{cert.date}</span>
              </div>
              <p className="text-[9px] text-[#555555]">{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {(data.projects ?? []).length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Projects
          </h2>
          {data.projects!.map((proj) => (
            <div key={proj.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{proj.name}</span>
                {proj.startDate && (
                  <span className="text-[9px] text-[#666666] shrink-0 ml-2">
                    {proj.startDate}{proj.endDate !== undefined ? ` – ${formatDate(proj.endDate)}` : ""}
                  </span>
                )}
              </div>
              {proj.url && <p className="text-[9px] text-[#555555]">{proj.url}</p>}
              {proj.description && <p className="text-[9px] text-[#333333]">{proj.description}</p>}
              {proj.technologies.length > 0 && (
                <p className="text-[9px] text-[#555555]">{proj.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {(data.languages ?? []).length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Languages
          </h2>
          {data.languages!.map((lang) => (
            <div key={lang.id} className="flex mb-0.5">
              <span className="font-bold text-[9px] w-[85px] text-[#333333]">{lang.language}:</span>
              <span className="text-[9px] text-[#555555]">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      )}

      {/* Volunteer */}
      {(data.volunteer ?? []).length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Volunteer Experience
          </h2>
          {data.volunteer!.map((vol) => (
            <div key={vol.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{vol.role}</span>
                <span className="text-[9px] text-[#666666] shrink-0 ml-2">
                  {vol.startDate} – {formatDate(vol.endDate)}
                </span>
              </div>
              <p className="text-[9px] text-[#555555] mb-0.5">{vol.organization}</p>
              {vol.description && <p className="text-[9px] text-[#333333]">{vol.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Awards */}
      {(data.awards ?? []).length > 0 && (
        <div className="mb-3.5">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
            Awards
          </h2>
          {data.awards!.map((award) => (
            <div key={award.id} className="mb-2.5">
              <div className="flex justify-between items-start">
                <span className="font-bold text-[10px] text-[#111111]">{award.title}</span>
                <span className="text-[9px] text-[#666666]">{award.date}</span>
              </div>
              <p className="text-[9px] text-[#555555]">{award.issuer}</p>
              {award.description && <p className="text-[9px] text-[#333333]">{award.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Custom Sections */}
      {(data.customSections ?? []).map((section) => (
        section.items.length > 0 && (
          <div key={section.id} className="mb-3.5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#333333] border-b border-[#d1d5db] pb-0.5 mb-2">
              {section.title}
            </h2>
            {section.items.map((item) => (
              <div key={item.id} className="mb-2.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111111]">{item.heading}</span>
                  {item.date && <span className="text-[9px] text-[#666666]">{item.date}</span>}
                </div>
                {item.subheading && <p className="text-[9px] text-[#555555]">{item.subheading}</p>}
                {item.description && <p className="text-[9px] text-[#333333]">{item.description}</p>}
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  )
}
