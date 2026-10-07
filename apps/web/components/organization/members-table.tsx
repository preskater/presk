"use client"

import * as React from "react"
import { MoreHorizontalIcon, UserMinusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { authClient } from "@/lib/auth-client"
import { ORG_ROLES, type OrgRole } from "@/lib/organization/roles"
import { getInitials, parseRoles } from "@/lib/organization/utils"

export interface OrgMember {
  id: string
  userId: string
  role: string
  user: { id: string; name: string; email: string; image?: string | null }
}

export function MembersTable({
  members,
  currentUserId,
  canUpdate,
  canRemove,
  canTransferOwnership,
  onChanged,
}: {
  members: OrgMember[]
  currentUserId: string
  canUpdate: boolean
  canRemove: boolean
  canTransferOwnership: boolean
  onChanged: () => void
}) {
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  async function updateRole(memberId: string, role: OrgRole) {
    setPendingId(memberId)
    const { error } = await authClient.organization.updateMemberRole({
      memberId,
      role,
    })
    setPendingId(null)
    if (error) {
      toast.error(error.message ?? "Unable to update the role.")
      return
    }
    toast.success("Role updated.")
    onChanged()
  }

  async function removeMember(member: OrgMember) {
    setPendingId(member.id)
    const { error } = await authClient.organization.removeMember({
      memberIdOrEmail: member.id,
    })
    setPendingId(null)
    if (error) {
      toast.error(error.message ?? "Unable to remove the member.")
      return
    }
    toast.success(`${member.user.name} removed.`)
    onChanged()
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => {
          const memberRoles = parseRoles(member.role)
          const isOwner = memberRoles.includes("owner")
          const isSelf = member.userId === currentUserId
          const canEditThisRole =
            (canUpdate && !isOwner) || (canTransferOwnership && isSelf)
          const canRemoveThis = canRemove && !isOwner && !isSelf

          return (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarImage
                      src={member.user.image ?? undefined}
                      alt={member.user.name}
                    />
                    <AvatarFallback>
                      {getInitials(member.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.user.name}</span>
                    {isSelf ? (
                      <span className="text-xs text-muted-foreground">
                        You
                      </span>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {member.user.email}
              </TableCell>
              <TableCell>
                {canEditThisRole ? (
                  <Select
                    items={ORG_ROLES.filter(
                      (item) => item.value !== "owner" || canTransferOwnership
                    )}
                    value={
                      memberRoles[0] && memberRoles[0] !== "owner"
                        ? memberRoles[0]
                        : "owner"
                    }
                    disabled={pendingId === member.id}
                    onValueChange={(value) =>
                      updateRole(member.id, value as OrgRole)
                    }
                  >
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ORG_ROLES.filter(
                          (item) =>
                            item.value !== "owner" || canTransferOwnership
                        ).map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={isOwner ? "default" : "secondary"}>
                    {ORG_ROLES.find((item) => item.value === memberRoles[0])
                      ?.label ?? "Member"}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {canRemoveThis ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Manage ${member.user.name}`}
                        />
                      }
                    >
                      <MoreHorizontalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => removeMember(member)}
                        >
                          <UserMinusIcon />
                          Remove from organization
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
