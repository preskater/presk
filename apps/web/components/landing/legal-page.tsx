import { Container, Section } from "@/components/landing/section"
import type { LegalDocument } from "@/lib/landing/legal"

export function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance">
              {document.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {document.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated {document.updated}
            </p>
          </div>
        </Container>
      </section>
      <Section className="py-16">
        <div className="mx-auto max-w-3xl">
          {document.sections.map((section) => (
            <div key={section.heading} className="mb-10">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
