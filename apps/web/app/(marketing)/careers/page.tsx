import type { Metadata } from "next"
import { MapPinIcon } from "lucide-react"

import { PageHeader } from "@/components/landing/page-header"
import { Section } from "@/components/landing/section"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

import { jobs } from "@/lib/landing/content"

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Presk and help teams do their best work.",
}

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Do your life's best work with us"
        description="We're a small, distributed team of builders. If you care deeply about craft and collaboration, we'd love to meet you."
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Open roles
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{job.title}</span>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <Badge variant="outline">{job.team}</Badge>
                      <span className="inline-flex items-center gap-1">
                        <MapPinIcon className="size-3.5" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator className="my-10" />
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-lg font-semibold">
              Don&apos;t see your role?
            </h3>
            <p className="text-sm text-muted-foreground">
              We&apos;re always looking for exceptional people. Introduce
              yourself at careers@presk.app.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
