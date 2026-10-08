import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { PageHeader } from "@/components/landing/page-header"
import { Section } from "@/components/landing/section"
import { ContactForm } from "@/components/forms/contact-form"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { contactChannels } from "@/lib/landing/content"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Marketing.contact")
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  }
}

const channelKeys = [
  { title: "sales", description: "salesDescription" },
  { title: "support", description: "supportDescription" },
  { title: "careers", description: "careersDescription" },
] as const

export default async function ContactPage() {
  const t = await getTranslations("Marketing.contact")

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("cardTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {contactChannels.map((channel, index) => {
              const keys = channelKeys[index]
              return (
                <Card key={channel.key}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {keys ? t(keys.title) : channel.key}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-sm">
                    <p className="text-muted-foreground">
                      {keys ? t(keys.description) : ""}
                    </p>
                    <span className="font-medium">{channel.detail}</span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </Section>
    </>
  )
}
