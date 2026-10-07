"use client"

import * as React from "react"
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Spinner } from "@workspace/ui/components/spinner"

import { authClient } from "@/lib/auth-client"
import { INVITABLE_ROLES, type OrgRole } from "@/lib/organization/roles"
import { buildInviteUrl } from "@/lib/organization/utils"

export function InviteMemberDialog({
  onInvited,
  trigger,
}: {
  onInvited?: () => void
  trigger?: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<OrgRole>("member")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setEmail("")
      setRole("member")
      setError(null)
      setInviteUrl(null)
      setCopied(false)
    }
  }, [open])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) {
      setError("Please enter an email address.")
      return
    }
    setSubmitting(true)
    setError(null)
    const { data, error } = await authClient.organization.inviteMember({
      email: trimmed,
      role,
    })
    if (error || !data) {
      setError(error?.message ?? "Unable to send the invitation.")
      setSubmitting(false)
      return
    }
    setInviteUrl(buildInviteUrl(data.id))
    setSubmitting(false)
    onInvited?.()
  }

  async function copyLink() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    toast.success("Invite link copied.")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button size="sm" />}>
        {trigger ? null : (
          <>
            <PlusIcon data-icon="inline-start" />
            Invite member
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Invite someone to this organization and choose their role.
          </DialogDescription>
        </DialogHeader>

        {inviteUrl ? (
          <div className="flex flex-col gap-3">
            <Field>
              <FieldLabel htmlFor="invite-link">Invite link</FieldLabel>
              <div className="flex items-center gap-2">
                <Input id="invite-link" value={inviteUrl} readOnly />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  aria-label="Copy invite link"
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
              </div>
              <FieldDescription>
                No email provider is configured. Share this link with the
                invited person so they can join.
              </FieldDescription>
            </Field>
            <DialogFooter>
              <DialogClose render={<Button />}>Done</DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="invite-email">Email</FieldLabel>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@company.com"
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="invite-role">Role</FieldLabel>
                <Select
                  items={INVITABLE_ROLES}
                  value={role}
                  onValueChange={(value) => setRole(value as OrgRole)}
                >
                  <SelectTrigger id="invite-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {INVITABLE_ROLES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  {
                    INVITABLE_ROLES.find((item) => item.value === role)
                      ?.description
                  }
                </FieldDescription>
              </Field>
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner /> : null}
                {submitting ? "Sending..." : "Send invite"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
