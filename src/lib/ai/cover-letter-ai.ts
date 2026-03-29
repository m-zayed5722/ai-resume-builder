import { openai, AI_MODEL, USE_JSON_MODE } from "./openai"
import type { ResumeData } from "@/types/resume"

export async function generateCoverLetter(params: {
  resumeData: ResumeData
  jobDescription: string
  companyName: string
}): Promise<string> {
  const resumeSummary = buildResumeSummary(params.resumeData)

  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.7,
    max_tokens: 800,
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer. Write a professional, compelling cover letter tailored to the job description using information from the candidate's resume. The letter should:
- Be 3-4 paragraphs
- Open with enthusiasm for the specific role and company
- Highlight 2-3 relevant accomplishments from the resume that match the job requirements
- Show knowledge of the company and how the candidate can add value
- Close with a strong call to action
Return ONLY the cover letter body text. No greeting line, no closing signature, no markdown formatting.`,
      },
      {
        role: "user",
        content: `RESUME SUMMARY:\n${resumeSummary}\n\nCOMPANY: ${params.companyName}\n\nJOB DESCRIPTION:\n${params.jobDescription}`,
      },
    ],
  })

  return completion.choices[0].message.content?.trim() ?? ""
}

function buildResumeSummary(data: ResumeData): string {
  const lines: string[] = []

  const p = data.personalInfo
  if (p.fullName) lines.push(`Name: ${p.fullName}`)
  if (p.jobTitle) lines.push(`Title: ${p.jobTitle}`)
  if (p.summary) lines.push(`Summary: ${p.summary}`)

  if (data.experience.length > 0) {
    lines.push("\nExperience:")
    for (const exp of data.experience.slice(0, 3)) {
      lines.push(`- ${exp.title} at ${exp.company}`)
      for (const bullet of exp.bullets.slice(0, 2)) {
        if (bullet) lines.push(`  • ${bullet}`)
      }
    }
  }

  const allSkills = data.skills.flatMap((g) => g.skills)
  if (allSkills.length > 0) {
    lines.push(`\nSkills: ${allSkills.join(", ")}`)
  }

  if (data.education.length > 0) {
    lines.push("\nEducation:")
    for (const edu of data.education) {
      lines.push(`- ${edu.degree} in ${edu.field} from ${edu.institution}`)
    }
  }

  return lines.join("\n")
}
