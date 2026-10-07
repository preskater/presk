"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Please tell us a little more (10+ characters)."),
})

export function ContactForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    toast.success("Thanks — we'll be in touch!", {
      description: `We received your message and will reply to ${values.email}.`,
    })
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="contact-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Jane Doe"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="contact-email">Work email</FieldLabel>
                <Input
                  {...field}
                  id="contact-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="jane@company.com"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>
        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-company">Company</FieldLabel>
              <Input
                {...field}
                id="contact-company"
                aria-invalid={fieldState.invalid}
                placeholder="Acme Corp"
              />
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-message">How can we help?</FieldLabel>
              <Textarea
                {...field}
                id="contact-message"
                aria-invalid={fieldState.invalid}
                placeholder="Tell us about your team and what you're looking for..."
              />
              <FieldDescription>
                We usually respond within one business day.
              </FieldDescription>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto">
        Send message
      </Button>
    </form>
  )
}
