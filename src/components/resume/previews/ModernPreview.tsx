"use client"

import type { ResumeData } from "@/types/resume"

function formatDate(date: string | null | undefined): string {
  if (!date) return "Present"
  return date
}

interface Props {
  data: ResumeData
}

export function ModernPreview({ data }: Props) {
  const p = data.personalInfo

  return (
    <div className="flex text-[10px] leading-[1.4] min-h-full">
      {/* ---- Sidebar ---- */}
      <div className="w-[180px] shrink-0 bg-slate-800 text-white px-4 py-8">
        <h1 className="text-[18px] font-bold mb-0.5">{p.fullName || "Your Name"}</h1>
        {p.jobTitle && (
          <p className="text-[10px] text-slate-400 mb-4">{p.jobTitle}</p>
        )}

        {/* Contact */}
        <h2 className="text-[9px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-600 pb-0.5 mb-1.5 mt-3">
          Contact
        </h2>
        {p.email && <p className="text-[8.5px] text-slate-300 mb-0.5">{p.email}</p>}
        {p.phone && <p className="text-[8.5px] text-slate-300 mb-0.5">{p.phone}</p>}
        {p.location && <p className="text-[8.5px] text-slate-300 mb-0.5">{p.location}</p>}
        {p.website && <p className="text-[8.5px] text-slate-300 mb-0.5">{p.website}</p>}
        {p.linkedin && <p className="text-[8.5px] text-slate-300 mb-0.5">{p.linkedin}</p>}

        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <h2 className="text-[9px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-600 pb-0.5 mb-1.5 mt-3">
              Skills
            </h2>
            {data.skills.map((group) => (
              <div key={group.id} className="mb-1.5">
                <p className="text-[8px] font-bold text-blue-400">{group.category}</p>
                <p className="text-[8px] text-slate-300 leading-[1.5]">{group.skills.join(", ")}</p>
              </div>
            ))}
          </>
        )}

        {/* Languages */}
        {(data.languages ?? []).length > 0 && (
          <>
            <h2 className="text-[9px] font-bold uppercase tracking-wider text-blue-400 border-b border-slate-600 pb-0.5 mb-1.5 mt-3">
              Languages
            </h2>
            {data.languages!.map((lang) => (
              <div key={lang.id} className="flex justify-between mb-0.5">
                <span className="text-[8.5px] text-slate-200">{lang.language}</span>
                <span className="text-[8px] text-slate-400">{lang.proficiency}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ---- Main Content ---- */}
      <div className="flex-1 py-8 pl-6 pr-8">
        {/* Summary */}
        {p.summary && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Summary
            </h2>
            <p className="text-[9.5px] text-[#374151] leading-[1.5]">{p.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{exp.title}</span>
                  <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
                    {exp.startDate} – {formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-[9px] text-[#4b5563] mb-0.5">
                  {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                </p>
                {exp.bullets.filter(Boolean).map((bullet, i) => (
                  <div key={i} className="flex gap-1.5 pl-1 mb-0.5">
                    <span className="text-[10px] text-blue-500">•</span>
                    <span className="text-[9px] text-[#374151] flex-1">{bullet}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{edu.institution}</span>
                  <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
                    {edu.startDate} – {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-[9px] text-[#4b5563]">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {(data.certifications ?? []).length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Certifications
            </h2>
            {data.certifications!.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{cert.name}</span>
                  <span className="text-[9px] text-[#6b7280]">{cert.date}</span>
                </div>
                <p className="text-[9px] text-[#4b5563]">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {(data.projects ?? []).length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Projects
            </h2>
            {data.projects!.map((proj) => (
              <div key={proj.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{proj.name}</span>
                  {proj.startDate && (
                    <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
                      {proj.startDate}{proj.endDate !== undefined ? ` – ${formatDate(proj.endDate)}` : ""}
                    </span>
                  )}
                </div>
                {proj.url && <p className="text-[9px] text-blue-500">{proj.url}</p>}
                {proj.description && <p className="text-[9px] text-[#374151]">{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-[#4b5563]">{proj.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Volunteer */}
        {(data.volunteer ?? []).length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Volunteer Experience
            </h2>
            {data.volunteer!.map((vol) => (
              <div key={vol.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{vol.role}</span>
                  <span className="text-[9px] text-[#6b7280] shrink-0 ml-2">
                    {vol.startDate} – {formatDate(vol.endDate)}
                  </span>
                </div>
                <p className="text-[9px] text-[#4b5563] mb-0.5">{vol.organization}</p>
                {vol.description && <p className="text-[9px] text-[#374151]">{vol.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Awards */}
        {(data.awards ?? []).length > 0 && (
          <div className="mb-3">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
              Awards
            </h2>
            {data.awards!.map((award) => (
              <div key={award.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-[10px] text-[#111827]">{award.title}</span>
                  <span className="text-[9px] text-[#6b7280]">{award.date}</span>
                </div>
                <p className="text-[9px] text-[#4b5563]">{award.issuer}</p>
                {award.description && <p className="text-[9px] text-[#374151]">{award.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {(data.customSections ?? []).map((section) => (
          section.items.length > 0 && (
            <div key={section.id} className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-blue-500 pb-0.5 mb-1.5">
                {section.title}
              </h2>
              {section.items.map((item) => (
                <div key={item.id} className="mb-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[10px] text-[#111827]">{item.heading}</span>
                    {item.date && <span className="text-[9px] text-[#6b7280]">{item.date}</span>}
                  </div>
                  {item.subheading && <p className="text-[9px] text-[#4b5563]">{item.subheading}</p>}
                  {item.description && <p className="text-[9px] text-[#374151]">{item.description}</p>}
                </div>
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  )
}
