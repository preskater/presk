"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Spinner } from "@workspace/ui/components/spinner"

import { authClient } from "@/lib/auth-client"
import { slugify } from "@/lib/organization/utils"

export function OrganizationGeneralForm({
  organization,
  canEdit,
  onSaved,
}: {
  organization: { id: string; name: string; slug: string; logo?: string | null }
  canEdit: boolean
  onSaved: () => void
}) {
  const [name, setName] = React.useState(organization.name)
  const [slug, setSlug] = React.useState(organization.slug)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setName(organization.name)
    setSlug(organization.slug)
  }, [organization.name, organization.slug])

  const dirty = name !== organization.name || slug !== organization.slug

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedSlug = slugify(slug || name)
    if (!trimmedName || !trimmedSlug) {
      setError("Name and slug are required.")
      return
    }
    setSaving(true)
    setError(null)
    const { error } = await authClient.organization.update({
      data: { name: trimmedName, slug: trimmedSlug },
    })
    if (error) {
      setError(error.message ?? "Unable to update the organization.")
      setSaving(false)
      return
    }
    toast.success("Organization updated.")
    setSaving(false)
    onSaved()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>
          The name and URL of your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="org-name">Name</FieldLabel>
              <Input
                id="org-name"
                value={name}
                disabled={!canEdit}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
              <Input
                id="org-slug"
                value={slug}
                disabled={!canEdit}
                onChange={(event) => setSlug(event.target.value)}
              />
              <FieldDescription>
                Used to identify your organization in URLs.
              </FieldDescription>
            </Field>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            {canEdit ? (
              <Field orientation="horizontal">
                <Button type="submit" disabled={!dirty || saving}>
                  {saving ? <Spinner /> : null}
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </Field>
            ) : (
              <FieldDescription>
                You don&apos;t have permission to edit organization settings.
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
