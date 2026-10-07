import { Container } from "@/components/landing/section"
import { logos } from "@/lib/landing/content"

export function LogoCloud() {
  return (
    <div className="border-y bg-muted/30 py-10">
      <Container className="flex flex-col items-center gap-6">
        <p className="text-sm text-muted-foreground">
          Trusted by fast-moving teams at
        </p>
        <div className="grid w-full grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-center font-heading text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </Container>
    </div>
  )
}
