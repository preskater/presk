"use client"

import * as React from "react"
import { LockIcon } from "lucide-react"

import { MemberAvatar } from "@/components/task/member-avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { useFiles } from "@/lib/files/store"
import {
  SHARE_PERMISSIONS,
  type FileNode,
  type SharePermission,
} from "@/lib/files/types"

export function FilePermissionsSheet({
  file,
  open,
  onOpenChange,
}: {
  file?: FileNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { getMember, sharesFor, setPermission, removeShare } = useFiles()
  const [inherited, setInherited] = React.useState(true)
  const [linkAccess, setLinkAccess] = React.useState("view")

  if (!file) return null
  const entries = sharesFor(file.id)

  const permissionItems = SHARE_PERMISSIONS.map((item) => ({
    label: item.label,
    value: item.value,
  }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Manage permissions</SheetTitle>
          <SheetDescription className="line-clamp-1">
            {file.name}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">People</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const member = getMember(entry.memberId)
                  if (!member) return null
                  return (
                    <TableRow key={entry.memberId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MemberAvatar member={member} size="sm" />
                          <span className="text-sm">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          items={permissionItems}
                          value={entry.permission}
                          onValueChange={(value) =>
                            setPermission(
                              file.id,
                              entry.memberId,
                              value as SharePermission
                            )
                          }
                        >
                          <SelectTrigger size="sm" className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {permissionItems.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => removeShare(file.id, entry.memberId)}
                        >
                          Remove
                        </button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Organization access</h3>
            <label className="flex items-start gap-2">
              <Checkbox
                checked={inherited}
                onCheckedChange={(checked) => setInherited(checked === true)}
              />
              <span className="text-sm">
                Inherit permissions from parent folder
                <span className="block text-xs text-muted-foreground">
                  People with access to the parent folder can also access this
                  file.
                </span>
              </span>
            </label>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Link access</h3>
              {file.restricted ? (
                <Badge variant="secondary">
                  <LockIcon />
                  Restricted
                </Badge>
              ) : null}
            </div>
            <Select
              items={permissionItems}
              value={linkAccess}
              onValueChange={(value) => setLinkAccess(value as string)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {permissionItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Anyone in your organization with the link can access this file.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
