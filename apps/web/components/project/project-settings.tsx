"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"

import { MemberAvatar } from "@/components/task/member-avatar"
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
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { useProjectStore } from "@/lib/projects/store"
import {
  TASK_STATUSES,
  type MemberRole,
  type Project,
} from "@/lib/projects/types"

const roleItems: { label: string; value: MemberRole }[] = [
  { label: "Owner", value: "owner" },
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
]

const LABEL_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function InviteMemberDialog() {
  const { addMember } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<MemberRole>("member")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Invite member
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
          <DialogDescription>
            Add a teammate to this workspace. In this demo the member is created
            locally.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim() || !email.trim()) return
            addMember({ name: name.trim(), email: email.trim(), role })
            setName("")
            setEmail("")
            setRole("member")
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="member-name">Name</FieldLabel>
              <Input
                id="member-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-email">Email</FieldLabel>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="jane@company.com"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="member-role">Role</FieldLabel>
              <Select
                items={roleItems}
                value={role}
                onValueChange={(value) => setRole(value as MemberRole)}
              >
                <SelectTrigger id="member-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roleItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Send invite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddLabelDialog() {
  const { addLabel } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState(LABEL_COLORS[0] as string)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon data-icon="inline-start" />
        Add label
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add label</DialogTitle>
          <DialogDescription>
            Labels help you categorise tasks across the project.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) return
            addLabel(name.trim(), color)
            setName("")
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="label-name">Name</FieldLabel>
              <Input
                id="label-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Design"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel>Color</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {LABEL_COLORS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-label={`Use color ${option}`}
                    aria-pressed={color === option}
                    onClick={() => setColor(option)}
                    className="size-7 rounded-full ring-offset-2 ring-offset-background transition-shadow data-[selected=true]:ring-2 data-[selected=true]:ring-ring"
                    data-selected={color === option}
                    style={{ backgroundColor: option }}
                  />
                ))}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Add label</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectSettings({ project }: { project: Project }) {
  const { members, labels, updateMemberRole, removeMember, removeLabel } =
    useProjectStore()

  return (
    <Tabs defaultValue="members" className="flex flex-col gap-4">
      <TabsList variant="line" className="w-full justify-start border-b pb-0">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="labels">Labels</TabsTrigger>
        <TabsTrigger value="statuses">Statuses</TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  People with access to this project.
                </CardDescription>
              </div>
              <InviteMemberDialog />
            </div>
          </CardHeader>
          <CardContent className="px-0">
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
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MemberAvatar member={member} size="sm" />
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        items={roleItems}
                        value={member.role}
                        onValueChange={(value) =>
                          updateMemberRole(member.id, value as MemberRole)
                        }
                      >
                        <SelectTrigger size="sm" className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {roleItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${member.name}`}
                            />
                          }
                        >
                          <Trash2Icon />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Remove {member.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              They will lose access to this project. You can
                              invite them again later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => removeMember(member.id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="labels">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>Labels</CardTitle>
                <CardDescription>
                  Available when tagging tasks in this project.
                </CardDescription>
              </div>
              <AddLabelDialog />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {labels.map((label) => (
              <div
                key={label.id}
                className="flex items-center gap-2 rounded-full border border-border py-1 pe-1 ps-3"
              >
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-sm">{label.name}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Delete ${label.name}`}
                  onClick={() => removeLabel(label.id)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="statuses">
        <Card>
          <CardHeader>
            <CardTitle>Workflow statuses</CardTitle>
            <CardDescription>
              The stages every task moves through on the board.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {TASK_STATUSES.map((status) => (
              <div
                key={status.value}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <span className="text-sm font-medium">{status.label}</span>
                <Badge variant="outline">{status.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
