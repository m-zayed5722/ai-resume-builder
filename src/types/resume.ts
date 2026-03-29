export interface ResumeData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    summary: string
  }
  experience: WorkExperience[]
  education: Education[]
  skills: SkillGroup[]
  certifications?: Certification[]
  projects?: Project[]
  languages?: Language[]
  volunteer?: VolunteerWork[]
  awards?: Award[]
  customSections?: CustomSection[]
  sectionOrder?: string[]
}

export interface WorkExperience {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string | null
  bullets: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string | null
  gpa?: string
}

export interface SkillGroup {
  id: string
  category: string
  skills: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
}

export interface Project {
  id: string
  name: string
  url?: string
  description: string
  technologies: string[]
  startDate?: string
  endDate?: string | null
}

export interface Language {
  id: string
  language: string
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic"
}

export interface VolunteerWork {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string | null
  description: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
}

export interface CustomSectionItem {
  id: string
  heading: string
  subheading?: string
  date?: string
  description?: string
}

export const DEFAULT_SECTION_ORDER = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "volunteer",
  "awards",
  "customSections",
]

export const SECTION_LABELS: Record<string, string> = {
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  volunteer: "Volunteer",
  awards: "Awards",
  customSections: "Custom Sections",
}

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
  volunteer: [],
  awards: [],
  customSections: [],
}
