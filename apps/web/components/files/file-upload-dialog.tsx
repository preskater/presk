"use client"

import * as React from "react"
import { CloudUploadIcon, FileIcon, Trash2Icon, UploadIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@workspace/ui/components/button"
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
import { Progress } from "@workspace/ui/components/progress"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { formatBytes } from "@/lib/files/file-utils"
import { useFiles } from "@/lib/files/store"
import type { UploadStatus } from "@/lib/files/types"

const STATUS_VARIANT: Record<
  UploadStatus,
  "secondary" | "default" | "outline" | "destructive"
> = {
  queued: "outline",
  uploading: "default",
  done: "secondary",
  error: "destructive",
}

interface PendingFile {
  id: string
  name: string
  sizeBytes: number
}

const SAMPLE_FILES: PendingFile[] = [
  { id: "s1", name: "quarterly-plan.pdf", sizeBytes: 2.1 * 1024 * 1024 },
  { id: "s2", name: "team-offsite.png", sizeBytes: 4.6 * 1024 * 1024 },
  { id: "s3", name: "notes.docx", sizeBytes: 42 * 1024 },
]

export function FileUploadDialog({
  parentId,
  children,
}: {
  parentId: string | null
  children: React.ReactElement
}) {
  const { enqueueUploads } = useFiles()
  const t = useTranslations("Files")
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState<PendingFile[]>([])

  function addFile(file: PendingFile) {
    setPending((prev) =>
      prev.some((item) => item.name === file.name) ? prev : [...prev, file]
    )
  }

  function handleSubmit() {
    if (pending.length === 0) return
    enqueueUploads(
      pending.map((item) => ({ name: item.name, sizeBytes: item.sizeBytes })),
      parentId
    )
    setPending([])
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setPending([])
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("uploadFiles")}</DialogTitle>
          <DialogDescription>
            {t("uploadDescription")}
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-6 text-center"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault()
            addFile({
              id: `d_${Math.random().toString(36).slice(2, 7)}`,
              name: `dropped-file-${pending.length + 1}.pdf`,
              sizeBytes: 1.4 * 1024 * 1024,
            })
          }}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <CloudUploadIcon className="size-5 text-muted-foreground" />
          </span>
          <p className="text-sm font-medium">{t("dragDrop")}</p>
          <p className="text-xs text-muted-foreground">{t("orSample")}</p>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {SAMPLE_FILES.map((file) => (
              <Button
                key={file.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addFile(file)}
              >
                <FileIcon data-icon="inline-start" />
                {file.name}
              </Button>
            ))}
          </div>
        </div>

        {pending.length > 0 ? (
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {pending.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-lg border px-3 py-2"
              >
                <FileIcon className="size-4 text-muted-foreground" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(file.sizeBytes)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("removeFile", { name: file.name })}
                  onClick={() =>
                    setPending((prev) => prev.filter((item) => item.id !== file.id))
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            {t("cancel")}
          </DialogClose>
          <Button type="button" disabled={pending.length === 0} onClick={handleSubmit}>
            <UploadIcon data-icon="inline-start" />
            {t("uploadCount", { count: pending.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UploadQueue() {
  const { uploads, removeUpload, clearCompletedUploads } = useFiles()
  const t = useTranslations("Files")
  if (uploads.length === 0) return null

  const activeCount = uploads.filter(
    (item) => item.status === "queued" || item.status === "uploading"
  ).length

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {activeCount > 0
            ? t("uploadingCount", { count: activeCount })
            : t("uploadsComplete")}
        </span>
        <Button variant="ghost" size="sm" onClick={clearCompletedUploads}>
          {t("clear")}
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {uploads.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatBytes(item.sizeBytes)}
                  </span>
                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {t(`uploadStatus.${item.status}`)}
                  </Badge>
                </div>
              </div>
              <Progress
                value={item.progress}
                className={cn(item.status === "done" && "opacity-60")}
              />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("removeFile", { name: item.name })}
              onClick={() => removeUpload(item.id)}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
