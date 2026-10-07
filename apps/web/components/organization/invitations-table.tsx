"use client"

import * as React from "react"
import { CopyIcon, MailIcon, XIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"

import { authClient } from "@/lib/auth-client"
import { formatRoleLabel } from "@/lib/organization/roles"
import { buildInviteUrl } from "@/lib/organization/utils"

export interface OrgInvitation {
  id: string
  email: string
  role: string | null
  status: string
  expiresAt: string | Date
}

export function InvitationsTable({
  invitations,
  canCancel,
  onChanged,
}: {
  invitations: OrgInvitation[]
  canCancel: boolean
  onChanged: () => void
}) {
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const pending = invitations.filter((inv) => inv.status === "pending")

  async function cancel(invitation: OrgInvitation) {
    setPendingId(invitation.id)
    const { error } = await authClient.organization.cancelInvitation({
      invitationId: invitation.id,
    })
    setPendingId(null)
    if (error) {
      toast.error(error.message ?? "Unable to cancel the invitation.")
      return
    }
    toast.success("Invitation cancelled.")
    onChanged()
  }

  async function copy(invitation: OrgInvitation) {
    await navigator.clipboard.writeText(buildInviteUrl(invitation.id))
    toast.success("Invite link copied.")
  }

  if (pending.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MailIcon />
          </EmptyMedia>
          <EmptyTitle>No pending invitations</EmptyTitle>
          <EmptyDescription>
            Invitations you send will appear here until they are accepted.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden sm:table-cell">Expires</TableHead>
          <TableHead className="w-40" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {pending.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell className="font-medium">{invitation.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {formatRoleLabel(invitation.role)}
              </Badge>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {new Date(invitation.expiresAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(invitation)}
                >
                  <CopyIcon data-icon="inline-start" />
                  Copy link
                </Button>
                {canCancel ? (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Cancel invitation for ${invitation.email}`}
                    disabled={pendingId === invitation.id}
                    onClick={() => cancel(invitation)}
                  >
                    {pendingId === invitation.id ? (
                      <Spinner />
                    ) : (
                      <XIcon />
                    )}
                  </Button>
                ) : null}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
