"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { MailIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Spinner } from "@workspace/ui/components/spinner"

import { authClient } from "@/lib/auth-client"
import { formatRoleLabel } from "@/lib/organization/roles"

interface InvitationDetails {
  organizationName: string
  inviterEmail: string
  role: string | null
  email: string
}

export function AcceptInvitationCard({
  invitationId,
}: {
  invitationId: string
}) {
  const router = useRouter()
  const [invitation, setInvitation] = React.useState<InvitationDetails | null>(
    null
  )
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, setPending] = React.useState<"accept" | "decline" | null>(null)

  React.useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await authClient.organization.getInvitation({
        query: { id: invitationId },
      })
      if (!active) return
      if (error || !data) {
        setError(error?.message ?? "This invitation could not be found.")
        setLoading(false)
        return
      }
      setInvitation({
        organizationName: data.organizationName,
        inviterEmail: data.inviterEmail,
        role: data.role,
        email: data.email,
      })
      setLoading(false)
    }
    load().catch(() => {
      if (active) {
        setError("This invitation could not be found.")
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [invitationId])

  async function accept() {
    setPending("accept")
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    })
    if (error) {
      toast.error(error.message ?? "Unable to accept the invitation.")
      setPending(null)
      return
    }
    toast.success("Invitation accepted.")
    router.push("/dashboard")
    router.refresh()
  }

  async function decline() {
    setPending("decline")
    const { error } = await authClient.organization.rejectInvitation({
      invitationId,
    })
    if (error) {
      toast.error(error.message ?? "Unable to decline the invitation.")
      setPending(null)
      return
    }
    toast.success("Invitation declined.")
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MailIcon className="size-4" />
          Organization invitation
        </CardTitle>
        <CardDescription>
          {loading
            ? "Loading invitation details..."
            : error
              ? error
              : `You've been invited to join ${invitation?.organizationName}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {invitation ? (
          <div className="flex flex-col gap-1 rounded-lg border border-border p-3 text-sm">
            <span className="font-medium">{invitation.organizationName}</span>
            <span className="text-muted-foreground">
              Invited by {invitation.inviterEmail}
            </span>
            <div className="mt-1">
              <Badge variant="secondary">
                {formatRoleLabel(invitation.role)}
              </Badge>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        ) : error ? null : (
          <div className="flex items-center gap-2">
            <Button
              className="flex-1"
              disabled={pending !== null}
              onClick={accept}
            >
              {pending === "accept" ? <Spinner /> : null}
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={pending !== null}
              onClick={decline}
            >
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
