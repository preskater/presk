import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/landing/page-header"
import { FaqSection } from "@/components/landing/faq-section"
import { Button } from "@workspace/ui/components/button"

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about plans, security, the AI assistants and migrating your team.",
}

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything you need to know before getting started. Can't find what you're looking for?"
      >
        <Button render={<Link href="/contact" />} nativeButton={false}>
          Contact us
        </Button>
      </PageHeader>
      <FaqSection />
    </>
  )
}
