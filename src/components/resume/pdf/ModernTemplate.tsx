import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import type { ResumeData } from "@/types/resume"

const SIDEBAR_WIDTH = 180
const ACCENT = "#3b82f6"
const DARK_BG = "#1e293b"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    lineHeight: 1.4,
    flexDirection: "row",
  },
  // Sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: DARK_BG,
    color: "#ffffff",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  sidebarName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  sidebarJobTitle: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 16,
  },
  sidebarSectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: ACCENT,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 12,
  },
  sidebarText: {
    fontSize: 8.5,
    color: "#cbd5e1",
    marginBottom: 2,
  },
  sidebarLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: "#e2e8f0",
    marginBottom: 1,
  },
  sidebarSkillGroup: {
    marginBottom: 5,
  },
  sidebarSkillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: ACCENT,
    marginBottom: 1,
  },
  sidebarSkillList: {
    fontSize: 8,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  languageName: {
    fontSize: 8.5,
    color: "#e2e8f0",
  },
  languageLevel: {
    fontSize: 8,
    color: "#94a3b8",
  },
  // Main area
  main: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 28,
    paddingRight: 40,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: DARK_BG,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.5,
  },
  entryBlock: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#111827",
  },
  entryDate: {
    fontSize: 9,
    color: "#6b7280",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 10,
    marginRight: 5,
    color: ACCENT,
  },
  bulletText: {
    fontSize: 9,
    flex: 1,
    color: "#374151",
  },
  watermark: {
    position: "absolute" as const,
    bottom: 12,
    left: 0,
    right: 0,
    textAlign: "center" as const,
    fontSize: 7,
    color: "#9ca3af",
    opacity: 0.5,
  },
})

function formatDate(date: string | null | undefined): string {
  if (!date) return "Present"
  return date
}

interface Props {
  data: ResumeData
  showWatermark?: boolean
}

export function ModernTemplate({ data, showWatermark = false }: Props) {
  const p = data.personalInfo

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* ---- Sidebar ---- */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarName}>{p.fullName || "Your Name"}</Text>
          {p.jobTitle && (
            <Text style={styles.sidebarJobTitle}>{p.jobTitle}</Text>
          )}

          {/* Contact */}
          <Text style={styles.sidebarSectionTitle}>Contact</Text>
          {p.email && <Text style={styles.sidebarText}>{p.email}</Text>}
          {p.phone && <Text style={styles.sidebarText}>{p.phone}</Text>}
          {p.location && <Text style={styles.sidebarText}>{p.location}</Text>}
          {p.website && <Text style={styles.sidebarText}>{p.website}</Text>}
          {p.linkedin && <Text style={styles.sidebarText}>{p.linkedin}</Text>}

          {/* Skills */}
          {data.skills.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {data.skills.map((group) => (
                <View key={group.id} style={styles.sidebarSkillGroup}>
                  <Text style={styles.sidebarSkillCategory}>
                    {group.category}
                  </Text>
                  <Text style={styles.sidebarSkillList}>
                    {group.skills.join(", ")}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <>
              <Text style={styles.sidebarSectionTitle}>Languages</Text>
              {data.languages.map((lang) => (
                <View key={lang.id} style={styles.languageRow}>
                  <Text style={styles.languageName}>{lang.language}</Text>
                  <Text style={styles.languageLevel}>{lang.proficiency}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ---- Main Content ---- */}
        <View style={styles.main}>
          {/* Summary */}
          {p.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.summaryText}>{p.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{exp.title}</Text>
                    <Text style={styles.entryDate}>
                      {exp.startDate} – {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </Text>
                  {exp.bullets.filter(Boolean).map((bullet, i) => (
                    <View key={i} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {data.education.map((edu) => (
                <View key={edu.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{edu.institution}</Text>
                    <Text style={styles.entryDate}>
                      {edu.startDate} – {formatDate(edu.endDate)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ""}
                    {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {data.certifications.map((cert) => (
                <View key={cert.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{cert.name}</Text>
                    <Text style={styles.entryDate}>{cert.date}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {data.projects.map((proj) => (
                <View key={proj.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.startDate && (
                      <Text style={styles.entryDate}>
                        {proj.startDate}
                        {proj.endDate !== undefined
                          ? ` – ${formatDate(proj.endDate)}`
                          : ""}
                      </Text>
                    )}
                  </View>
                  {proj.url && (
                    <Text style={styles.entrySubtitle}>{proj.url}</Text>
                  )}
                  {proj.description && (
                    <Text style={styles.bulletText}>{proj.description}</Text>
                  )}
                  {proj.technologies.length > 0 && (
                    <Text style={styles.entrySubtitle}>
                      {proj.technologies.join(", ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Volunteer */}
          {data.volunteer && data.volunteer.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Volunteer Experience</Text>
              {data.volunteer.map((vol) => (
                <View key={vol.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{vol.role}</Text>
                    <Text style={styles.entryDate}>
                      {vol.startDate} – {formatDate(vol.endDate)}
                    </Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{vol.organization}</Text>
                  {vol.description && (
                    <Text style={styles.bulletText}>{vol.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {data.awards && data.awards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Awards</Text>
              {data.awards.map((award) => (
                <View key={award.id} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{award.title}</Text>
                    <Text style={styles.entryDate}>{award.date}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{award.issuer}</Text>
                  {award.description && (
                    <Text style={styles.bulletText}>{award.description}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Custom Sections */}
          {data.customSections &&
            data.customSections.map(
              (section) =>
                section.items.length > 0 && (
                  <View key={section.id} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.items.map((item) => (
                      <View key={item.id} style={styles.entryBlock}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>{item.heading}</Text>
                          {item.date && (
                            <Text style={styles.entryDate}>{item.date}</Text>
                          )}
                        </View>
                        {item.subheading && (
                          <Text style={styles.entrySubtitle}>
                            {item.subheading}
                          </Text>
                        )}
                        {item.description && (
                          <Text style={styles.bulletText}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ),
            )}
        </View>

        {showWatermark && (
          <Text style={styles.watermark} fixed>
            Built with ResumeAI — resumeai.com
          </Text>
        )}
      </Page>
    </Document>
  )
}
