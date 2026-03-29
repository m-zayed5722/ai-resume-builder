import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer"
import type { ResumeData } from "@/types/resume"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 52,
    paddingRight: 52,
    color: "#222222",
    lineHeight: 1.45,
  },
  // Header
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    color: "#555555",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  contactItem: {
    fontSize: 9,
    color: "#666666",
  },
  // Section
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#333333",
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
    paddingBottom: 3,
    marginBottom: 8,
  },
  // Summary
  summaryText: {
    fontSize: 9.5,
    color: "#333333",
    lineHeight: 1.6,
  },
  // Entries
  entryBlock: {
    marginBottom: 9,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#111111",
  },
  entryDate: {
    fontSize: 9,
    color: "#666666",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletDot: {
    fontSize: 10,
    marginRight: 6,
    color: "#555555",
  },
  bulletText: {
    fontSize: 9,
    flex: 1,
    color: "#333333",
  },
  // Skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    width: 85,
    color: "#333333",
  },
  skillList: {
    fontSize: 9,
    flex: 1,
    color: "#555555",
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

export function MinimalTemplate({ data, showWatermark = false }: Props) {
  const p = data.personalInfo
  const contacts = [
    p.email,
    p.phone,
    p.location,
    p.website,
    p.linkedin,
  ].filter(Boolean) as string[]

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{p.fullName || "Your Name"}</Text>
          {p.jobTitle && <Text style={styles.jobTitle}>{p.jobTitle}</Text>}
          <View style={styles.contactRow}>
            {contacts.map((c, i) => (
              <Text key={i} style={styles.contactItem}>
                {c}
              </Text>
            ))}
          </View>
        </View>

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

        {/* Skills */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((group) => (
              <View key={group.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{group.category}:</Text>
                <Text style={styles.skillList}>
                  {group.skills.join(", ")}
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

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((lang) => (
              <View key={lang.id} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{lang.language}:</Text>
                <Text style={styles.skillList}>{lang.proficiency}</Text>
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

        {showWatermark && (
          <Text style={styles.watermark} fixed>
            Built with ResumeAI — resumeai.com
          </Text>
        )}
      </Page>
    </Document>
  )
}
