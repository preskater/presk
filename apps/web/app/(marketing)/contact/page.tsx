import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { Section } from "@/components/landing/section"
import { ContactForm } from "@/components/forms/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { contactChannels } from "@/lib/landing/content"

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to the Presk team about plans, demos and support.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the Presk team"
        description="Book a demo, ask about plans, or just say hello. We usually respond within one business day."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {contactChannels.map((channel) => (
              <Card key={channel.title}>
                <CardHeader>
                  <CardTitle className="text-base">{channel.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm">
                  <p className="text-muted-foreground">{channel.description}</p>
                  <span className="font-medium">{channel.detail}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
