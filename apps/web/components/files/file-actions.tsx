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
import { useTranslations } from "next-intl"

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
  const t = useTranslations("Files")
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

  const download = () => toast.success(t("downloading", { name: file.name }))
  const copyLink = () => {
    void navigator.clipboard?.writeText(
      `${window.location.origin}/${orgSlug}/files`
    )
    toast.success(t("linkCopied"))
  }
  const isFolder = file.kind === "folder"

  if (location === "trash") {
    return (
      <>
        <Item onSelect={() => restoreFile(file.id)}>
          <RotateCcwIcon />
          {t("restore")}
        </Item>
        <DeleteForeverDialog onConfirm={() => deleteForever(file.id)} name={file.name}>
          <Item variant="destructive" onSelect={(event) => event.preventDefault()}>
            <Trash2Icon />
            {t("deleteForever")}
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
          {t("open")}
        </Item>
      ) : (
        <>
          <Item onSelect={() => onPreview(file)}>
            <EyeIcon />
            {t("preview")}
          </Item>
          <Item onSelect={download}>
            <DownloadIcon />
            {t("download")}
          </Item>
        </>
      )}
      <Item onSelect={() => duplicateFile(file.id)}>
        <CopyIcon />
        {t("makeCopy")}
      </Item>
      <FileRenameDialog file={file}>
        <Item onSelect={(event) => event.preventDefault()}>
          <PencilIcon />
          {t("rename")}
        </Item>
      </FileRenameDialog>
      <FileMoveDialog file={file}>
        <Item onSelect={(event) => event.preventDefault()}>
          <FolderInputIcon />
          {t("moveTo")}
        </Item>
      </FileMoveDialog>
      <Item onSelect={copyLink}>
        <LinkIcon />
        {t("copyLink")}
      </Item>
      {!isFolder ? (
        <Item onSelect={() => onOpenShare(file)}>
          <Share2Icon />
          {t("share")}
        </Item>
      ) : null}
      <Item onSelect={() => toggleStar(file.id)}>
        {file.starred ? <StarOffIcon /> : <StarIcon />}
        {file.starred ? t("removeFromFavorites") : t("addToFavorites")}
      </Item>
      <Separator />
      <Item variant="destructive" onSelect={() => trashFile(file.id)}>
        <Trash2Icon />
        {t("moveToTrash")}
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
  const t = useTranslations("Files")
  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteForeverQuestion")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteForeverDescription", { name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            {t("deleteForever")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
