import { HeroSection } from "@/components/landing/hero-section"
import { LogoCloud } from "@/components/landing/logo-cloud"
import { FeatureGrid } from "@/components/landing/feature-grid"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { Testimonials } from "@/components/landing/testimonials"
import { PricingPreview } from "@/components/landing/pricing-preview"
import { FinalCta } from "@/components/landing/final-cta"

import { isAuthenticated } from "@/lib/landing/session"

export default async function HomePage() {
  const authenticated = await isAuthenticated()

  return (
    <>
      <HeroSection isAuthenticated={authenticated} />
      <LogoCloud />
      <FeatureGrid limit={3} showCta />
      <ProductShowcase />
      <Testimonials />
      <PricingPreview isAuthenticated={authenticated} />
      <FinalCta isAuthenticated={authenticated} />
    </>
  )
}
