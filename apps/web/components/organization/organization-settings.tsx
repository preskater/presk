"use client"

import * as React from "react"
import { Building2Icon, MailIcon, UsersIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"
import { OrganizationDangerZone } from "@/components/organization/danger-zone"
import { InvitationsTable } from "@/components/organization/invitations-table"
import { InviteMemberDialog } from "@/components/organization/invite-member-dialog"
import { MembersTable } from "@/components/organization/members-table"
import { OrganizationGeneralForm } from "@/components/organization/organization-general-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Spinner } from "@workspace/ui/components/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { authClient } from "@/lib/auth-client"
import { parseRoles } from "@/lib/organization/utils"
import { useOrgPermissions } from "@/lib/organization/use-permissions"

export function OrganizationSettings() {
  const permissions = useOrgPermissions()
  const {
    data: organization,
    isPending,
    error,
    refetch,
  } = authClient.useActiveOrganization()
  const { data: session } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (error || !organization) {
    return (
      <DashboardEmpty
        icon={Building2Icon}
        title="No active organization"
        description="Create or join an organization to manage it here."
        className="border"
      />
    )
  }

  const members = organization.members ?? []
  const invitations = organization.invitations ?? []
  const owners = members.filter((member) =>
    parseRoles(member.role).includes("owner")
  )
  const currentUserId = session?.user.id
  const isOnlyOwner =
    owners.length <= 1 &&
    owners.some((member) => member.userId === currentUserId)

  return (
    <Tabs defaultValue="general" className="flex flex-col gap-4">
      <TabsList variant="line" className="w-full justify-start border-b pb-0">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
        <TabsTrigger value="danger">Danger zone</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <OrganizationGeneralForm
          organization={organization}
          canEdit={permissions.canUpdateOrganization}
          onSaved={refetch}
        />
      </TabsContent>

      <TabsContent value="members">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="size-4" />
                  Members
                </CardTitle>
                <CardDescription>
                  People with access to {organization.name}.
                </CardDescription>
              </div>
              {permissions.canInviteMember ? (
                <InviteMemberDialog onInvited={refetch} />
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <MembersTable
              members={members}
              currentUserId={currentUserId ?? ""}
              canUpdate={permissions.canUpdateMember}
              canRemove={permissions.canDeleteMember}
              canTransferOwnership={permissions.isOwner}
              onChanged={refetch}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle className="flex items-center gap-2">
                  <MailIcon className="size-4" />
                  Invitations
                </CardTitle>
                <CardDescription>
                  Pending invitations to this organization.
                </CardDescription>
              </div>
              {permissions.canInviteMember ? (
                <InviteMemberDialog onInvited={refetch} />
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <InvitationsTable
              invitations={invitations}
              canCancel={permissions.canCancelInvitation}
              onChanged={refetch}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="danger">
        <OrganizationDangerZone
          organization={organization}
          isOwner={permissions.isOwner}
          isOnlyOwner={isOnlyOwner}
        />
      </TabsContent>
    </Tabs>
  )
}
