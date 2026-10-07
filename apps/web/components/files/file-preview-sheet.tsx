"use client"

import * as React from "react"
import {
  CalendarIcon,
  DownloadIcon,
  HardDriveIcon,
  HistoryIcon,
  LockIcon,
  PencilIcon,
  Share2Icon,
  ShieldIcon,
  StarIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import { FileIcon } from "@/components/files/file-icon"
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
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { formatBytes, formatRelativeDate, FILE_KIND_LABEL } from "@/lib/files/file-utils"
import { useFiles } from "@/lib/files/store"
import type { FileNode } from "@/lib/files/types"

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate">{value}</span>
    </div>
  )
}

export function FilePreviewSheet({
  file,
  open,
  onOpenChange,
  onOpenShare,
  onOpenPermissions,
}: {
  file?: FileNode
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenShare: (file: FileNode) => void
  onOpenPermissions: (file: FileNode) => void
}) {
  const { getMember, sharesFor, versions, activities, toggleStar, trashFile } =
    useFiles()

  if (!file) return null
  const owner = getMember(file.ownerId)
  const entries = sharesFor(file.id)
  const fileVersions = versions[file.id] ?? []
  const fileActivities = activities[file.id] ?? []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle className="truncate">{file.name}</SheetTitle>
          <SheetDescription>
            {FILE_KIND_LABEL[file.kind]} · {formatBytes(file.sizeBytes)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted/40">
            <FileIcon kind={file.kind} className="size-16" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success(`Downloading “${file.name}”.`)}>
              <DownloadIcon data-icon="inline-start" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => onOpenShare(file)}>
              <Share2Icon data-icon="inline-start" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleStar(file.id)}>
              <StarIcon data-icon="inline-start" />
              {file.starred ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <DetailRow icon={UsersIcon} label="Owner" value={owner?.name ?? "Unknown"} />
            <DetailRow
              icon={CalendarIcon}
              label="Modified"
              value={formatRelativeDate(file.modifiedAt)}
            />
            <DetailRow
              icon={HardDriveIcon}
              label="Size"
              value={formatBytes(file.sizeBytes)}
            />
            <DetailRow
              icon={ShieldIcon}
              label="Type"
              value={FILE_KIND_LABEL[file.kind]}
            />
          </div>

          <Tabs defaultValue="details">
            <TabsList variant="line">
              <TabsTrigger value="details">People</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <MemberAvatar member={owner} size="sm" />
                  <span className="flex-1 text-sm">{owner?.name}</span>
                  <Badge variant="secondary">Owner</Badge>
                </div>
                {entries.map((entry) => {
                  const member = getMember(entry.memberId)
                  if (!member) return null
                  return (
                    <div key={entry.memberId} className="flex items-center gap-3">
                      <MemberAvatar member={member} size="sm" />
                      <span className="flex-1 text-sm">{member.name}</span>
                      <Badge variant="outline">{entry.permission}</Badge>
                    </div>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 w-fit"
                  onClick={() => onOpenPermissions(file)}
                >
                  <LockIcon data-icon="inline-start" />
                  Manage permissions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="versions" className="pt-3">
              <div className="flex flex-col gap-3">
                {fileVersions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No version history yet.
                  </p>
                ) : (
                  fileVersions.map((version) => {
                    const author = getMember(version.memberId)
                    return (
                      <div key={version.id} className="flex items-start gap-3">
                        <span className="mt-1 flex size-7 items-center justify-center rounded-full bg-muted">
                          <HistoryIcon className="size-3.5 text-muted-foreground" />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm">{version.note}</span>
                          <span className="text-xs text-muted-foreground">
                            {author?.name} · {formatRelativeDate(version.at)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="pt-3">
              <div className="flex flex-col gap-3">
                {fileActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity yet.</p>
                ) : (
                  fileActivities.map((activity) => {
                    const actor = getMember(activity.memberId)
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <MemberAvatar member={actor} size="sm" />
                        <div className="flex flex-col">
                          <span className="text-sm">
                            <span className="font-medium">{actor?.name}</span>{" "}
                            <span className="text-muted-foreground">
                              {activity.action}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(activity.at)}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-between gap-2 border-t p-4">
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="sm">
                  <Trash2Icon data-icon="inline-start" />
                  Move to trash
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Move to trash?</AlertDialogTitle>
                <AlertDialogDescription>
                  “{file.name}” will be moved to trash. You can restore it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => {
                    trashFile(file.id)
                    onOpenChange(false)
                  }}
                >
                  Move to trash
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={() => onOpenPermissions(file)}>
            <PencilIcon data-icon="inline-start" />
            Permissions
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
