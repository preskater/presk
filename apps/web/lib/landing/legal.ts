export const legalSlugs = ["privacy", "terms", "security", "cookies"] as const

export type LegalSlug = (typeof legalSlugs)[number]

export function isLegalSlug(value: string): value is LegalSlug {
  return (legalSlugs as readonly string[]).includes(value)
}
