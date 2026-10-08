import type { Metadata } from "next"
import { Building2Icon, GlobeIcon, RocketIcon, UsersIcon } from "lucide-react"

import { PageHeader } from "@/components/landing/page-header"
import { Section, SectionHeading } from "@/components/landing/section"
import { FinalCta } from "@/components/landing/final-cta"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { companyStats, companyValues } from "@/lib/landing/content"
import { getMarketingAuth } from "@/lib/landing/session"

export const metadata: Metadata = {
  title: "About",
  description:
    "Presk is the AI-native productivity platform built by a distributed team.",
}

const statIcons = [RocketIcon, UsersIcon, GlobeIcon, Building2Icon]

export default async function AboutPage() {
  const { isAuthenticated: authenticated, dashboardHref } = await getMarketingAuth()

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Building the workspace teams deserve"
        description="Presk started with a simple belief: work, conversation, time and files belong in one place. We're a distributed team building that."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companyStats.map((stat, index) => {
            const Icon = statIcons[index] ?? RocketIcon
            return (
              <Card key={stat.label}>
                <CardHeader>
                  <Icon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-3xl font-semibold tabular-nums">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {stat.label}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <SectionHeading
          className="mt-20"
          eyebrow="Values"
          title="What we care about"
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {companyValues.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {value.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <FinalCta isAuthenticated={authenticated} dashboardHref={dashboardHref} />
    </>
  )
}
