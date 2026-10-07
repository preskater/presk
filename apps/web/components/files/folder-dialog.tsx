"use client"

import * as React from "react"
import { FolderPlusIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

import { useFiles } from "@/lib/files/store"

export function FolderDialog({
  parentId,
  children,
}: {
  parentId: string | null
  children: React.ReactElement
}) {
  const { createFolder } = useFiles()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setName("")
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) return
            createFolder(parentId, name)
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="folder-name">Folder name</FieldLabel>
              <Input
                id="folder-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Q4 Planning"
                autoFocus
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">
              <FolderPlusIcon data-icon="inline-start" />
              Create folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
