import { Section, SectionHeading } from "@/components/landing/section"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import { faqs } from "@/lib/landing/content"

export function FaqSection() {
  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything you need to know before getting started."
      />
      <Accordion className="mx-auto mt-12 max-w-3xl">
        {faqs.map((faq) => (
          <AccordionItem key={faq.value} value={faq.value}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}
