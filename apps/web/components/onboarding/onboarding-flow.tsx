"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2Icon, CheckIcon, MailIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
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
import { formatRoleLabel } from "@/lib/organization/roles"
import { getInitials, slugify } from "@/lib/organization/utils"

interface PendingInvitation {
  id: string
  organizationName: string
  role: string | null
}

export function OnboardingFlow({
  userName,
  invitations: initialInvitations,
}: {
  userName: string
  invitations: PendingInvitation[]
}) {
  const router = useRouter()
  const [invitations, setInvitations] =
    React.useState<PendingInvitation[]>(initialInvitations)

  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const [name, setName] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function accept(invitationId: string) {
    setPendingId(invitationId)
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    })
    if (error) {
      toast.error(error.message ?? "Unable to accept the invitation.")
      setPendingId(null)
      return
    }
    toast.success("Welcome to the organization!")
    router.push("/dashboard")
    router.refresh()
  }

  async function decline(invitationId: string) {
    setPendingId(invitationId)
    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    })
    if (error) {
      toast.error(error.message ?? "Unable to decline the invitation.")
      setPendingId(null)
      return
    }
    setInvitations((prev) => prev.filter((item) => item.id !== invitationId))
    setPendingId(null)
  }

  async function createOrganization(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Please enter an organization name.")
      return
    }
    const slug = slugify(trimmed)
    if (!slug) {
      setError("Please use letters or numbers in the name.")
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await authClient.organization.create({
      name: trimmed,
      slug,
    })
    if (error) {
      setError(error.message ?? "Unable to create the organization.")
      setSubmitting(false)
      return
    }
    toast.success("Organization created.")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {userName.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new organization or join one you&apos;ve been invited to.
        </p>
      </div>

      {invitations.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="size-4" />
              Pending invitations
            </CardTitle>
            <CardDescription>
              You&apos;ve been invited to the following organizations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <Avatar className="size-9 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {getInitials(invitation.organizationName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {invitation.organizationName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Role: {formatRoleLabel(invitation.role)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={pendingId === invitation.id}
                    onClick={() => accept(invitation.id)}
                  >
                    {pendingId === invitation.id ? (
                      <Spinner />
                    ) : (
                      <CheckIcon data-icon="inline-start" />
                    )}
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pendingId === invitation.id}
                    onClick={() => decline(invitation.id)}
                  >
                    <XIcon data-icon="inline-start" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2Icon className="size-4" />
            Create an organization
          </CardTitle>
          <CardDescription>
            Set up a workspace for your team. You can invite members once it
            exists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createOrganization}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="organization-name">
                  Organization name
                </FieldLabel>
                <Input
                  id="organization-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Acme Inc."
                  autoFocus
                />
                <FieldDescription>
                  {name.trim()
                    ? `Workspace URL: presk.app/${slugify(name)}`
                    : "This can be changed later."}
                </FieldDescription>
              </Field>
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
              <Field>
                <Button type="submit" disabled={submitting}>
                  {submitting ? <Spinner /> : null}
                  {submitting ? "Creating..." : "Create organization"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
