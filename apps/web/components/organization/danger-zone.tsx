"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
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
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { authClient } from "@/lib/auth-client"

export function OrganizationDangerZone({
  organization,
  isOwner,
  isOnlyOwner,
}: {
  organization: { id: string; name: string }
  isOwner: boolean
  isOnlyOwner: boolean
}) {
  const router = useRouter()
  const [confirmName, setConfirmName] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)
  const [leaving, setLeaving] = React.useState(false)

  async function deleteOrganization() {
    setDeleting(true)
    const { error } = await authClient.organization.delete({
      organizationId: organization.id,
    })
    if (error) {
      toast.error(error.message ?? "Unable to delete the organization.")
      setDeleting(false)
      return
    }
    toast.success("Organization deleted.")
    router.push("/onboarding")
    router.refresh()
  }

  async function leaveOrganization() {
    setLeaving(true)
    const { error } = await authClient.organization.leave({
      organizationId: organization.id,
    })
    if (error) {
      toast.error(error.message ?? "Unable to leave the organization.")
      setLeaving(false)
      return
    }
    toast.success("You left the organization.")
    router.push("/dashboard")
    router.refresh()
  }

  const canDelete = isOwner && !isOnlyOwner
  const canLeave = !isOwner

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Irreversible and destructive actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {canLeave ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Leave organization</span>
              <span className="text-sm text-muted-foreground">
                You will lose access to all projects and files.
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="outline" disabled={leaving} />}
              >
                <LogOutIcon data-icon="inline-start" />
                Leave
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Leave {organization.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You can be invited again later, but you will lose access
                    immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={leaveOrganization}
                  >
                    Leave organization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}

        {canDelete ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Delete organization</span>
              <span className="text-sm text-muted-foreground">
                Permanently delete the organization and all of its data.
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" disabled={deleting} />}
              >
                <Trash2Icon data-icon="inline-start" />
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete {organization.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. All members, invitations and
                    data will be removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                  <FieldLabel htmlFor="confirm-org-name">
                    Type &quot;{organization.name}&quot; to confirm
                  </FieldLabel>
                  <Input
                    id="confirm-org-name"
                    value={confirmName}
                    onChange={(event) => setConfirmName(event.target.value)}
                  />
                  <FieldDescription>
                    This helps prevent accidental deletion.
                  </FieldDescription>
                </Field>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={confirmName !== organization.name}
                    onClick={deleteOrganization}
                  >
                    Delete organization
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}

        {isOnlyOwner ? (
          <FieldDescription>
            You are the only owner. Transfer ownership to another member before
            deleting or leaving the organization.
          </FieldDescription>
        ) : null}
      </CardContent>
    </Card>
  )
}
