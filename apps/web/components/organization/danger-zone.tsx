"use client"

import * as React from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
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
  const t = useTranslations("Org")
  const [confirmName, setConfirmName] = React.useState("")
  const [deleting, setDeleting] = React.useState(false)
  const [leaving, setLeaving] = React.useState(false)

  async function deleteOrganization() {
    setDeleting(true)
    const { error } = await authClient.organization.delete({
      organizationId: organization.id,
    })
    if (error) {
      toast.error(error.message ?? t("unableToDeleteOrganization"))
      setDeleting(false)
      return
    }
    toast.success(t("organizationDeleted"))
    router.push("/onboarding")
    router.refresh()
  }

  async function leaveOrganization() {
    setLeaving(true)
    const { error } = await authClient.organization.leave({
      organizationId: organization.id,
    })
    if (error) {
      toast.error(error.message ?? t("unableToLeaveOrganization"))
      setLeaving(false)
      return
    }
    toast.success(t("youLeftOrganization"))
    const { data: remaining } = await authClient.organization.list()
    router.push(remaining?.[0]?.slug ? `/${remaining[0].slug}` : "/onboarding")
    router.refresh()
  }

  const canDelete = isOwner && !isOnlyOwner
  const canLeave = !isOwner

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">{t("dangerZone")}</CardTitle>
        <CardDescription>
          {t("dangerZoneDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {canLeave ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{t("leaveOrganization")}</span>
              <span className="text-sm text-muted-foreground">
                {t("leaveOrganizationDescription")}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="outline" disabled={leaving} />}
              >
                <LogOutIcon data-icon="inline-start" />
                {t("leave")}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("leaveConfirmTitle", { name: organization.name })}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("leaveConfirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={leaveOrganization}
                  >
                    {t("leaveOrganization")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}

        {canDelete ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{t("deleteOrganization")}</span>
              <span className="text-sm text-muted-foreground">
                {t("deleteOrganizationData")}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" disabled={deleting} />}
              >
                <Trash2Icon data-icon="inline-start" />
                {t("delete")}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("deleteConfirmTitle", { name: organization.name })}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("deleteConfirmDescription")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Field>
                  <FieldLabel htmlFor="confirm-org-name">
                    {t("typeToConfirm", { name: organization.name })}
                  </FieldLabel>
                  <Input
                    id="confirm-org-name"
                    value={confirmName}
                    onChange={(event) => setConfirmName(event.target.value)}
                  />
                  <FieldDescription>
                    {t("deletePreventHint")}
                  </FieldDescription>
                </Field>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={confirmName !== organization.name}
                    onClick={deleteOrganization}
                  >
                    {t("deleteOrganization")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}

        {isOnlyOwner ? (
          <FieldDescription>
            {t("onlyOwnerWarning")}
          </FieldDescription>
        ) : null}
      </CardContent>
    </Card>
  )
}
