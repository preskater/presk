"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Spinner } from "@workspace/ui/components/spinner"

import { authClient } from "@/lib/auth-client"

function ProfileCard() {
  const t = useTranslations("Account")
  const { data: session, refetch } = authClient.useSession()
  const user = session?.user

  const [name, setName] = React.useState("")
  const [image, setImage] = React.useState("")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setName(user?.name ?? "")
    setImage(user?.image ?? "")
  }, [user?.name, user?.image])

  const dirty = name !== (user?.name ?? "") || image !== (user?.image ?? "")

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError(t("nameRequired"))
      return
    }
    setSaving(true)
    setError(null)
    const { error } = await authClient.updateUser({
      name: trimmedName,
      image: image.trim() || null,
    })
    setSaving(false)
    if (error) {
      setError(error.message ?? t("unableToUpdateProfile"))
      return
    }
    toast.success(t("profileUpdated"))
    await refetch()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile")}</CardTitle>
        <CardDescription>{t("profileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="account-name">{t("name")}</FieldLabel>
              <Input
                id="account-name"
                value={name}
                placeholder={t("namePlaceholder")}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-email">{t("email")}</FieldLabel>
              <Input id="account-email" value={user?.email ?? ""} disabled />
              <FieldDescription>{t("emailDescription")}</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="account-image">
                {t("imageUrl")}
              </FieldLabel>
              <Input
                id="account-image"
                value={image}
                placeholder={t("imageUrlPlaceholder")}
                onChange={(event) => setImage(event.target.value)}
              />
            </Field>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <Field orientation="horizontal">
              <Button type="submit" disabled={!dirty || saving}>
                {saving ? <Spinner /> : null}
                {saving ? t("saving") : t("save")}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function SecurityCard() {
  const t = useTranslations("Account")
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (newPassword.length < 8) {
      setError(t("passwordTooShort"))
      return
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwordsDoNotMatch"))
      return
    }
    setSaving(true)
    setError(null)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions,
    })
    setSaving(false)
    if (error) {
      setError(error.message ?? t("unableToUpdatePassword"))
      return
    }
    toast.success(t("passwordUpdated"))
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setRevokeOtherSessions(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("security")}</CardTitle>
        <CardDescription>{t("securityDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="account-current-password">
                {t("currentPassword")}
              </FieldLabel>
              <Input
                id="account-current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-new-password">
                {t("newPassword")}
              </FieldLabel>
              <Input
                id="account-new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="account-confirm-password">
                {t("confirmPassword")}
              </FieldLabel>
              <Input
                id="account-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="account-revoke-sessions"
                checked={revokeOtherSessions}
                onCheckedChange={(checked) =>
                  setRevokeOtherSessions(checked === true)
                }
              />
              <FieldLabel htmlFor="account-revoke-sessions">
                {t("revokeOtherSessions")}
              </FieldLabel>
            </Field>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <Field orientation="horizontal">
              <Button type="submit" disabled={!canSubmit || saving}>
                {saving ? <Spinner /> : null}
                {saving ? t("updating") : t("updatePassword")}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export function AccountSettings() {
  const t = useTranslations("Account")

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <p className="text-sm text-muted-foreground">{t("description")}</p>
      <div className="mt-3 flex flex-col gap-4">
        <ProfileCard />
        <SecurityCard />
      </div>
    </div>
  )
}
