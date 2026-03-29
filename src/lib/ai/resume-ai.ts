import { openai, AI_MODEL, USE_JSON_MODE } from "./openai"
import type { ResumeData } from "@/types/resume"

// Extract JSON from a response that may have surrounding text (Ollama models often do this)
function extractJSON(text: string): unknown | null {
  const firstBrace = text.indexOf("{")
  const lastBrace = text.lastIndexOf("}")
  if (firstBrace === -1 || lastBrace === -1) return null
  try {
    return JSON.parse(text.slice(firstBrace, lastBrace + 1))
  } catch {
    return null
  }
}

export async function generateBulletPoints(params: {
  jobTitle: string
  responsibility: string
}): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.7,
    max_tokens: 400,
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer. Transform job responsibilities into strong, achievement-focused bullet points using the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". Use action verbs and quantify results where possible. Return exactly 3 bullet points as a JSON object with a "bullets" array of strings. No markdown, no explanation. Example output: {"bullets": ["Led migration of legacy system...", "Reduced load time by 40%...", "Collaborated with 5-person team..."]}`,
      },
      {
        role: "user",
        content: `Job Title: ${params.jobTitle}
Responsibility: ${params.responsibility}`,
      },
    ],
    ...(USE_JSON_MODE ? { response_format: { type: "json_object" } } : {}),
  })

  const raw = completion.choices[0].message.content ?? "{}"
  const result = extractJSON(raw) as { bullets?: string[] } | null
  if (!result) return []
  return result.bullets ?? []
}

export async function scoreATSMatch(params: {
  resumeData: ResumeData
  jobDescription: string
}): Promise<{
  score: number
  missing: string[]
  suggestions: string[]
}> {
  const resumeText = serializeResumeToText(params.resumeData)

  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.2,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and return a JSON object with exactly these fields:
- "score": number 0-100 representing ATS keyword match percentage
- "missing": array of up to 8 keywords/skills from the job description absent from the resume
- "suggestions": array of up to 5 specific actionable improvements
No explanation, only JSON. Example: {"score": 72, "missing": ["Python", "AWS"], "suggestions": ["Add Python to skills section"]}`,
      },
      {
        role: "user",
        content: `RESUME:
${resumeText}

JOB DESCRIPTION:
${params.jobDescription}`,
      },
    ],
    ...(USE_JSON_MODE ? { response_format: { type: "json_object" } } : {}),
  })

  const raw = completion.choices[0].message.content ?? "{}"
  const result = extractJSON(raw) as { score?: number; missing?: string[]; suggestions?: string[] } | null
  return {
    score: result?.score ?? 0,
    missing: result?.missing ?? [],
    suggestions: result?.suggestions ?? [],
  }
}

export async function generateSummary(params: {
  jobTitle: string
  yearsOfExperience: number
  topSkills: string[]
}): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.7,
    max_tokens: 200,
    messages: [
      {
        role: "system",
        content: `You are a professional resume writer. Write a compelling 2-3 sentence professional summary for a resume. Be concise, impactful, and highlight value. Return just the summary text, no JSON, no markdown, no labels.`,
      },
      {
        role: "user",
        content: `Job Title: ${params.jobTitle}
Years of Experience: ${params.yearsOfExperience}
Top Skills: ${params.topSkills.join(", ")}`,
      },
    ],
  })

  return completion.choices[0].message.content?.trim() ?? ""
}

function serializeResumeToText(data: ResumeData): string {
  const lines: string[] = []

  const p = data.personalInfo
  if (p.fullName) lines.push(p.fullName)
  if (p.jobTitle) lines.push(p.jobTitle)
  if (p.summary) lines.push(p.summary)

  for (const exp of data.experience) {
    lines.push(`${exp.title} at ${exp.company}`)
    for (const bullet of exp.bullets) {
      lines.push(bullet)
    }
  }

  for (const edu of data.education) {
    lines.push(`${edu.degree} in ${edu.field} from ${edu.institution}`)
  }

  for (const group of data.skills) {
    lines.push(`${group.category}: ${group.skills.join(", ")}`)
  }

  if (data.certifications) {
    for (const cert of data.certifications) {
      lines.push(`${cert.name} - ${cert.issuer}`)
    }
  }

  if (data.projects) {
    for (const proj of data.projects) {
      lines.push(`Project: ${proj.name}`)
      if (proj.description) lines.push(proj.description)
      if (proj.technologies.length > 0) lines.push(`Technologies: ${proj.technologies.join(", ")}`)
    }
  }

  if (data.languages) {
    for (const lang of data.languages) {
      lines.push(`${lang.language}: ${lang.proficiency}`)
    }
  }

  if (data.volunteer) {
    for (const vol of data.volunteer) {
      lines.push(`${vol.role} at ${vol.organization}`)
      if (vol.description) lines.push(vol.description)
    }
  }

  if (data.awards) {
    for (const award of data.awards) {
      lines.push(`Award: ${award.title} - ${award.issuer}`)
      if (award.description) lines.push(award.description)
    }
  }

  if (data.customSections) {
    for (const section of data.customSections) {
      for (const item of section.items) {
        lines.push(item.heading)
        if (item.description) lines.push(item.description)
      }
    }
  }

  return lines.join("\n")
}

export async function suggestSkills(params: {
  jobTitle: string
  currentSkills: string[]
}): Promise<string[]> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.5,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You are a career expert. Suggest 8-10 relevant technical and soft skills for the given job title that the candidate is missing. Return a JSON object with a "skills" array of strings. Only include skills NOT already listed. No markdown, no explanation. Example: {"skills": ["Python", "Data Visualization", "Stakeholder Management"]}`,
      },
      {
        role: "user",
        content: `Job Title: ${params.jobTitle}\nCurrent Skills: ${params.currentSkills.join(", ")}`,
      },
    ],
    ...(USE_JSON_MODE ? { response_format: { type: "json_object" } } : {}),
  })

  const raw = completion.choices[0].message.content ?? "{}"
  const result = extractJSON(raw) as { skills?: string[] } | null
  return result?.skills ?? []
}
