"use client"

import * as React from "react"
import {
  ChevronRightIcon,
  ClockIcon,
  FolderIcon,
  FolderTreeIcon,
  HardDriveIcon,
  Share2Icon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"

import { Progress } from "@workspace/ui/components/progress"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "@/lib/files/file-utils"
import { useFiles } from "@/lib/files/store"
import type { FileLocation, FileNode } from "@/lib/files/types"

const LOCATIONS: { value: FileLocation; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "my-files", label: "My files", icon: FolderIcon },
  { value: "shared", label: "Shared with me", icon: Share2Icon },
  { value: "recent", label: "Recent", icon: ClockIcon },
  { value: "favorites", label: "Favorites", icon: StarIcon },
  { value: "trash", label: "Trash", icon: Trash2Icon },
]

const QUOTA_BYTES = 2 * 1024 * 1024 * 1024

function FolderTreeNode({
  folder,
  activeFolderId,
  onOpen,
  depth,
}: {
  folder: FileNode
  activeFolderId: string | null
  onOpen: (folderId: string) => void
  depth: number
}) {
  const { files } = useFiles()
  const children = files.filter(
    (node) => node.kind === "folder" && !node.trashed && node.parentId === folder.id
  )
  const active = activeFolderId === folder.id

  if (children.length === 0) {
    return (
      <button
        type="button"
        onClick={() => onOpen(folder.id)}
        className={cn(
          "flex items-center gap-2 rounded-md py-1 pe-2 text-sm transition-colors",
          active ? "bg-muted text-foreground" : "hover:bg-muted/60"
        )}
        style={{ paddingInlineStart: `${8 + depth * 14}px` }}
      >
        <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{folder.name}</span>
      </button>
    )
  }

  return (
    <Collapsible className="flex flex-col">
      <div className="flex items-center">
        <CollapsibleTrigger className="group/trigger flex size-4 shrink-0 items-center justify-center" style={{ marginInlineStart: `${depth * 14}px` }}>
          <ChevronRightIcon className="size-3.5 text-muted-foreground transition-transform group-data-open/trigger:rotate-90" />
        </CollapsibleTrigger>
        <button
          type="button"
          onClick={() => onOpen(folder.id)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-2 rounded-md py-1 pe-2 text-sm transition-colors",
            active ? "bg-muted text-foreground" : "hover:bg-muted/60"
          )}
        >
          <FolderIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{folder.name}</span>
        </button>
      </div>
      <CollapsibleContent className="flex flex-col gap-0.5">
        {children.map((child) => (
          <FolderTreeNode
            key={child.id}
            folder={child}
            activeFolderId={activeFolderId}
            onOpen={onOpen}
            depth={depth + 1}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export function FilesSidebar({
  location,
  activeFolderId,
  onSelectLocation,
  onOpenFolder,
}: {
  location: FileLocation
  activeFolderId: string | null
  onSelectLocation: (location: FileLocation) => void
  onOpenFolder: (folderId: string) => void
}) {
  const { files, locationCounts } = useFiles()

  const rootFolders = files.filter(
    (node) => node.kind === "folder" && !node.trashed && node.parentId === null
  )
  const usedBytes = files.reduce((total, file) => total + (file.sizeBytes ?? 0), 0)
  const quotaPercent = Math.min(100, Math.round((usedBytes / QUOTA_BYTES) * 100))

  return (
    <aside className="flex h-full min-h-0 flex-col border-e bg-sidebar text-sidebar-foreground">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-3">
          <div className="flex flex-col gap-0.5">
            {LOCATIONS.map((item) => {
              const active = location === item.value
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onSelectLocation(item.value)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                    active ? "bg-muted text-foreground" : "hover:bg-muted/60"
                  )}
                >
                  <item.icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-start">{item.label}</span>
                  {locationCounts[item.value] > 0 ? (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {locationCounts[item.value]}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="px-1 text-xs font-medium text-muted-foreground">Folders</h3>
            {rootFolders.map((folder) => (
              <FolderTreeNode
                key={folder.id}
                folder={folder}
                activeFolderId={activeFolderId}
                onOpen={onOpenFolder}
                depth={0}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="flex items-center gap-2 text-sm">
          <HardDriveIcon className="size-4 text-muted-foreground" />
          <span className="font-medium">Storage</span>
        </div>
        <Progress value={quotaPercent} className="mt-2" />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formatBytes(usedBytes)} of {formatBytes(QUOTA_BYTES)} used
        </p>
      </div>
    </aside>
  )
}
