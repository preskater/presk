import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/landing/legal-page"
import { legalDocuments, legalSlugs } from "@/lib/landing/legal"

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const document = legalDocuments[slug]
  if (!document) return {}
  return { title: document.title, description: document.description }
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const document = legalDocuments[slug]
  if (!document) notFound()

  return <LegalPage document={document} />
}
