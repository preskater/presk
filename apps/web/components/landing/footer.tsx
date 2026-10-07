import Link from "next/link"

import { Container } from "@/components/landing/section"
import { Wordmark } from "@/components/landing/wordmark"
import { NewsletterForm } from "@/components/forms/newsletter-form"
import { Separator } from "@workspace/ui/components/separator"
import { footerColumns } from "@/lib/landing/content"

export function Footer() {
  return (
    <footer id="footer" className="border-t bg-muted/30">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_2.5fr]">
          <div className="flex flex-col gap-4">
            <Wordmark />
            <p className="max-w-xs text-sm text-muted-foreground">
              The AI-native productivity platform. Projects, messaging,
              calendars and files — in one workspace.
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Get product updates</span>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <span className="text-sm font-medium">{column.title}</span>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Presk. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js and shadcn/ui.
          </p>
        </div>
      </Container>
    </footer>
  )
}
