import Link from "next/link"
import { ArrowRightIcon, PlayIcon } from "lucide-react"

import { Container } from "@/components/landing/section"
import { WaitlistForm } from "@/components/forms/waitlist-form"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"

export function HeroSection({
  isAuthenticated,
  dashboardHref,
}: {
  isAuthenticated: boolean
  dashboardHref: string
}) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/8%,transparent_60%)]"
      />
      <Container className="flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-6">
          New: AI-powered workflows
        </Badge>

        <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Build better products with your entire team
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
          Plan projects, collaborate with your team, and ship faster from one
          unified workspace — projects, messaging, calendars and files with
          built-in AI assistants.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Button
              size="lg"
              render={<Link href={dashboardHref} />}
              nativeButton={false}
            >
              Go to dashboard
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button
              size="lg"
              render={<Link href="/sign-up" />}
              nativeButton={false}
            >
              Start building free
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
          <Button size="lg" variant="outline" render={<Link href="/contact" />} nativeButton={false}>
            <PlayIcon data-icon="inline-start" />
            Book a demo
          </Button>
        </div>

        {!isAuthenticated ? (
          <div className="mt-10 w-full">
            <p className="mb-3 text-sm text-muted-foreground">
              Be first in line — join the waitlist
            </p>
            <WaitlistForm />
          </div>
        ) : null}
      </Container>
    </section>
  )
}
