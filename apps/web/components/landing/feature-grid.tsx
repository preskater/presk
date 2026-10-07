import Link from "next/link"
import {
  CalendarIcon,
  FolderIcon,
  MessageSquareIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import { Section, SectionHeading } from "@/components/landing/section"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { features, type Feature } from "@/lib/landing/content"

const ICONS: Record<Feature["icon"], LucideIcon> = {
  zap: ZapIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
  folder: FolderIcon,
  message: MessageSquareIcon,
  shield: ShieldCheckIcon,
}

export function FeatureGrid({
  limit,
  showCta = false,
}: {
  limit?: number
  showCta?: boolean
}) {
  const visible = limit ? features.slice(0, limit) : features

  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Why Presk"
        title="Everything your team needs, in one workspace"
        description="Stop stitching together five tools. Presk keeps your work, conversations and files connected by default."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((feature) => {
          const Icon = ICONS[feature.icon]
          return (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg border bg-muted/40">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
      {showCta ? (
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/features" />}
            nativeButton={false}
          >
            Explore all features
          </Button>
        </div>
      ) : null}
    </Section>
  )
}
