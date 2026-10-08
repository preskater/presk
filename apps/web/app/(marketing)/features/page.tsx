import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { FeatureGrid } from "@/components/landing/feature-grid"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { FinalCta } from "@/components/landing/final-cta"

import { getMarketingAuth } from "@/lib/landing/session"

export const metadata: Metadata = {
  title: "Features",
  description:
    "Projects, messaging, calendars and files — one workspace with AI built in.",
}

export default async function FeaturesPage() {
  const { isAuthenticated: authenticated, dashboardHref } = await getMarketingAuth()

  return (
    <>
      <PageHeader
        eyebrow="Features"
        title="Every workflow, one workspace"
        description="Plan projects, chat with your team, schedule meetings and share files — all connected by the same people and permissions."
      />
      <FeatureGrid />
      <ProductShowcase />
      <LogoCloud />
      <FinalCta isAuthenticated={authenticated} dashboardHref={dashboardHref} />
    </>
  )
}
