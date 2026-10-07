"use client"

import * as React from "react"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import { Section, SectionHeading } from "@/components/landing/section"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { pricingTiers, type PricingTier } from "@/lib/landing/content"

function priceLabel(tier: PricingTier, yearly: boolean) {
  if (tier.name === "Enterprise") return "Custom"
  const amount = yearly ? tier.yearly : tier.monthly
  if (amount === 0) return "Free"
  return `$${amount}`
}

function PricingCard({
  tier,
  yearly,
  isAuthenticated,
}: {
  tier: PricingTier
  yearly: boolean
  isAuthenticated: boolean
}) {
  const ctaHref =
    tier.name === "Enterprise"
      ? "/contact"
      : isAuthenticated
        ? "/dashboard"
        : "/sign-up"
  const ctaLabel = isAuthenticated ? "Go to dashboard" : tier.cta

  return (
    <Card
      className={
        tier.featured
          ? "relative overflow-visible ring-2 ring-primary"
          : "relative"
      }
    >
      {tier.featured ? (
        <Badge className="absolute -top-2.5 start-6">Most popular</Badge>
      ) : null}
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-heading text-4xl font-semibold tracking-tight">
            {priceLabel(tier, yearly)}
          </span>
          {tier.name !== "Enterprise" ? (
            <span className="text-sm text-muted-foreground">
              {tier.monthly === 0 ? "forever" : "/ user / month"}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex flex-col gap-2.5 text-sm">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="size-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={tier.featured ? "default" : "outline"}
          render={<Link href={ctaHref} />}
          nativeButton={false}
        >
          {ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function PricingGrid({
  yearly,
  isAuthenticated,
}: {
  yearly: boolean
  isAuthenticated: boolean
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {pricingTiers.map((tier) => (
        <PricingCard
          key={tier.name}
          tier={tier}
          yearly={yearly}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  )
}

export function PricingSection({
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
    </Section>
  )
}
