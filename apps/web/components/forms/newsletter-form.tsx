"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@workspace/ui/components/button"
import { Field, FieldError } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { MailIcon } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({
  email: z.email("Enter a valid email address."),
})

export function NewsletterForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    toast.success("Subscribed!", {
      description: `Product updates will go to ${values.email}.`,
    })
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <InputGroup>
              <InputGroupInput
                {...field}
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@company.com"
              />
              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
              <Button type="submit" size="sm" className="me-1">
                Subscribe
              </Button>
            </InputGroup>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
    </form>
  )
}
