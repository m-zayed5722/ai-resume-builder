import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Sparkles,
  Target,
  Download,
  CheckCircle2,
  ArrowRight,
  Zap,
  Mail,
  Layout,
  BookOpen,
  Brain,
  GripVertical,
} from "lucide-react"

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Bullet Generator",
    description:
      "Paste any job responsibility and our AI rewrites it as a powerful achievement-focused bullet point using the XYZ formula.",
  },
  {
    icon: Target,
    title: "ATS Score Analyzer",
    description:
      "Paste a job description and get an instant ATS keyword match score, missing keywords, and specific improvement suggestions.",
  },
  {
    icon: Layout,
    title: "4 Professional Templates",
    description:
      "Choose from Classic, Modern, Minimal, and Executive templates. Switch between them with one click — your content adapts instantly.",
  },
  {
    icon: Mail,
    title: "AI Cover Letters",
    description:
      "Generate tailored cover letters in seconds. Just paste a job description and our AI creates a personalized letter matching your resume.",
  },
  {
    icon: BookOpen,
    title: "Pre-Written Phrases",
    description:
      "Browse 150+ proven bullet points organized by job title. Click to insert — no AI needed. Free for all users.",
  },
  {
    icon: Brain,
    title: "AI Skill Suggestions",
    description:
      "Enter your job title and get smart skill recommendations. Add them to your resume in one click to improve ATS match rates.",
  },
]

const SECTION_FEATURES = [
  "Work Experience",
  "Education",
  "Skills",
  "Projects",
  "Certifications",
  "Languages",
  "Volunteer",
  "Awards",
  "Custom Sections",
]

const FREE_FEATURES = [
  "3 resumes",
  "10 AI uses per month",
  "3 free templates",
  "PDF export (watermarked)",
  "1 cover letter",
  "Pre-written phrase library",
  "Section reordering",
]
const PRO_FEATURES = [
  "Unlimited resumes",
  "Unlimited AI generation",
  "All 4 templates",
  "Clean PDF export",
  "Unlimited cover letters",
  "AI skill suggestions",
  "ATS score analysis",
  "Priority support",
]

const TEMPLATES = [
  { name: "Classic", description: "Clean and professional — works for any industry", pro: false },
  { name: "Modern", description: "Two-column with sidebar — stands out visually", pro: false },
  { name: "Minimal", description: "No color, max whitespace — ultra ATS-friendly", pro: false },
  { name: "Executive", description: "Serif, conservative — ideal for senior roles", pro: true },
]

const FAQS = [
  {
    q: "What is an ATS?",
    a: "Applicant Tracking Systems (ATS) are software used by companies to automatically filter resumes before a human ever sees them. Up to 75% of resumes are rejected by ATS before reaching a recruiter.",
  },
  {
    q: "How does the AI bullet generator work?",
    a: "You paste a job responsibility, and our AI rewrites it using the XYZ formula — Accomplished [X] as measured by [Y], by doing [Z] — turning duties into quantified achievements.",
  },
  {
    q: "How do cover letters work?",
    a: "Select a resume, paste a job description and company name, and our AI generates a tailored cover letter referencing your specific experiences. Free users get 1 cover letter, Pro users get unlimited.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, anytime with no penalties. You keep access until the end of your billing period.",
  },
  {
    q: "Is my data private?",
    a: "Your resume data is stored securely and is never shared or used to train AI models.",
  },
  {
    q: "What AI model powers ResumeAI?",
    a: "We use OpenAI GPT-4o-mini to generate bullet points, cover letters, and ATS analysis — the same model family powering leading AI applications.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            ResumeAI
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-4 gap-1.5">
          <Zap className="h-3 w-3" />
          AI-powered resume & cover letter builder
        </Badge>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-5">
          Get past ATS.<br />
          <span className="text-blue-600">Get the interview.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          75% of resumes are rejected by ATS before a human sees them. ResumeAI scores your resume,
          suggests missing skills, generates cover letters, and rewrites your bullet points with AI — so
          you land more interviews.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg" className="gap-2 px-8">
              Build My Resume Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="px-8">
              See Pricing
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Free to start · No credit card required · 3 resumes free
        </p>
      </section>

      {/* Problem statement */}
      <section className="bg-gray-50 border-y py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-2xl font-semibold text-gray-800">
            &ldquo;75% of qualified candidates are eliminated by ATS systems before a recruiter reads a single word.&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mt-3">The problem is keyword optimization — not your qualifications.</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Everything you need to land the job</h2>
          <p className="text-gray-600">AI-powered tools, professional templates, and a phrase library — all in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.title} className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates showcase */}
      <section className="bg-gray-50 border-y py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Professional templates</h2>
            <p className="text-gray-600">Switch templates with one click. Your content adapts instantly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border-2 p-5 text-center hover:border-blue-200 transition-colors relative">
                {t.pro && (
                  <Badge className="absolute -top-2 right-3 text-xs">Pro</Badge>
                )}
                <div className="h-28 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="font-semibold mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resume sections */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">9 resume sections, fully customizable</h2>
          <p className="text-gray-600">Add what matters for your industry. Drag to reorder. Every section renders beautifully in all templates.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {SECTION_FEATURES.map((s) => (
            <div key={s} className="flex items-center gap-2 bg-gray-50 border rounded-full px-4 py-2 text-sm">
              <GripVertical className="h-3.5 w-3.5 text-gray-400" />
              {s}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 border-y py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, honest pricing</h2>
            <p className="text-gray-600">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <p className="text-3xl font-bold">$0 <span className="text-base font-normal text-muted-foreground">/ forever</span></p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-blue-500 bg-blue-50 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <p className="text-3xl font-bold">$5.99 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                <p className="text-xs text-muted-foreground">or $3.99/mo billed annually ($47.88/yr)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button className="w-full">Start Pro — $5.99/mo</Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">Cancel anytime</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600">{faq.a}</p>
              <Separator className="mt-6" />
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-3">Ready to beat the ATS?</h2>
        <p className="text-blue-100 mb-8 max-w-md mx-auto">
          Join thousands of job seekers landing interviews with AI-optimized resumes and cover letters.
        </p>
        <Link href="/login">
          <Button size="lg" variant="secondary" className="gap-2 px-8">
            Build My Resume Free <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <FileText className="h-4 w-4 text-blue-600" />
            ResumeAI
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
