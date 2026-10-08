"use client"

import * as React from "react"
import {
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FolderInputIcon,
  LinkIcon,
  PencilIcon,
  RotateCcwIcon,
  Share2Icon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { FileRenameDialog } from "@/components/files/file-rename-dialog"
import { FileMoveDialog } from "@/components/files/file-move-dialog"
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
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "@workspace/ui/components/context-menu"

import { useFiles } from "@/lib/files/store"
import { useOrgSlug } from "@/lib/organization/use-org-slug"
import type { FileLocation, FileNode } from "@/lib/files/types"

export function FileMenuItems({
  menu,
  file,
  location,
  onPreview,
  onOpenFolder,
  onOpenShare,
}: {
  menu: "dropdown" | "context"
  file: FileNode
  location: FileLocation
  onPreview: (file: FileNode) => void
  onOpenFolder: (file: FileNode) => void
  onOpenShare: (file: FileNode) => void
}) {
  const { duplicateFile, toggleStar, trashFile, restoreFile, deleteForever } =
    useFiles()
  const orgSlug = useOrgSlug()

  const Item =
    menu === "context"
      ? (props: React.ComponentProps<typeof ContextMenuItem>) => (
          <ContextMenuItem {...props} />
        )
      : (props: React.ComponentProps<typeof DropdownMenuItem>) => (
          <DropdownMenuItem {...props} />
        )
  const Separator = menu === "context" ? ContextMenuSeparator : DropdownMenuSeparator

  const download = () => toast.success(`Downloading “${file.name}”.`)
  const copyLink = () => {
    void navigator.clipboard?.writeText(
      `${window.location.origin}/${orgSlug}/files`
    )
    toast.success("Link copied to clipboard.")
  }
  const isFolder = file.kind === "folder"

  if (location === "trash") {
    return (
      <>
        <Item onSelect={() => restoreFile(file.id)}>
          <RotateCcwIcon />
          Restore
        </Item>
        <DeleteForeverDialog onConfirm={() => deleteForever(file.id)} name={file.name}>
          <Item variant="destructive" onSelect={(event) => event.preventDefault()}>
            <Trash2Icon />
            Delete forever
          </Item>
        </DeleteForeverDialog>
      </>
    )
  }

  return (
    <>
      {isFolder ? (
        <Item onSelect={() => onOpenFolder(file)}>
          <FolderInputIcon />
          Open
        </Item>
      ) : (
        <>
          <Item onSelect={() => onPreview(file)}>
            <EyeIcon />
            Preview
          </Item>
          <Item onSelect={download}>
            <DownloadIcon />
            Download
          </Item>
        </>
      )}
      <Item onSelect={() => duplicateFile(file.id)}>
        <CopyIcon />
        Make a copy
      </Item>
      <FileRenameDialog file={file}>
        <Item onSelect={(event) => event.preventDefault()}>
          <PencilIcon />
          Rename
        </Item>
      </FileRenameDialog>
      <FileMoveDialog file={file}>
        <Item onSelect={(event) => event.preventDefault()}>
          <FolderInputIcon />
          Move to…
        </Item>
      </FileMoveDialog>
      <Item onSelect={copyLink}>
        <LinkIcon />
        Copy link
      </Item>
      {!isFolder ? (
        <Item onSelect={() => onOpenShare(file)}>
          <Share2Icon />
          Share
        </Item>
      ) : null}
      <Item onSelect={() => toggleStar(file.id)}>
        {file.starred ? <StarOffIcon /> : <StarIcon />}
        {file.starred ? "Remove from favorites" : "Add to favorites"}
      </Item>
      <Separator />
      <Item variant="destructive" onSelect={() => trashFile(file.id)}>
        <Trash2Icon />
        Move to trash
      </Item>
    </>
  )
}

function DeleteForeverDialog({
  name,
  onConfirm,
  children,
}: {
  name: string
  onConfirm: () => void
  children: React.ReactElement
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete forever?</AlertDialogTitle>
          <AlertDialogDescription>
            “{name}” will be permanently deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete forever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
