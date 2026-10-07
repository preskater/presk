"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { toast } from "sonner"

const schema = z.object({
  email: z.email("Please enter a valid email address."),
})

export function WaitlistForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: z.infer<typeof schema>) {
    toast.success("You're on the list!", {
      description: `We'll reach out at ${values.email} soon.`,
    })
    form.reset()
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-md"
    >
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <InputGroup className="h-10 flex-1">
                <InputGroupInput
                  {...field}
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@company.com"
                />
              </InputGroup>
              <Button type="submit" size="lg">
                Join the waitlist
              </Button>
            </div>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
    </form>
  )
}
