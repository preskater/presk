"use client"

import * as React from "react"
import Link from "next/link"

import { Section, SectionHeading } from "@/components/landing/section"
import { PricingGrid } from "@/components/landing/pricing-section"
import { Button } from "@workspace/ui/components/button"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

export function PricingPreview({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const [yearly, setYearly] = React.useState(false)

  return (
    <Section id="pricing" className="bg-muted/30">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple, transparent pricing"
        description="Start free and upgrade when your team is ready. Save 20% with annual billing."
      />
      <div className="mt-8 flex justify-center">
        <ToggleGroup
          value={[yearly ? "yearly" : "monthly"]}
          onValueChange={(value) => setYearly(value[0] === "yearly")}
          spacing={0}
          className="rounded-lg bg-muted p-1"
        >
          <ToggleGroupItem value="monthly" variant="outline" size="sm">
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value="yearly" variant="outline" size="sm">
            Yearly
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="mt-10">
        <PricingGrid yearly={yearly} isAuthenticated={isAuthenticated} />
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          variant="outline"
          render={<Link href="/pricing" />}
          nativeButton={false}
        >
          Compare all plans
        </Button>
      </div>
    </Section>
  )
}
