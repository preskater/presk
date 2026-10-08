import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { PricingSection } from "@/components/landing/pricing-section"
import { FaqSection } from "@/components/landing/faq-section"
import { FinalCta } from "@/components/landing/final-cta"

import { getMarketingAuth } from "@/lib/landing/session"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing. Start free and upgrade when your team is ready.",
}

export default async function PricingPage() {
  const { isAuthenticated: authenticated, dashboardHref } = await getMarketingAuth()

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Plans for every team"
        description="Start free, then scale as you grow. Save 20% with annual billing. No credit card required to begin."
      />
      <PricingSection isAuthenticated={authenticated} dashboardHref={dashboardHref} />
      <FaqSection />
      <FinalCta isAuthenticated={authenticated} dashboardHref={dashboardHref} />
    </>
  )
}
