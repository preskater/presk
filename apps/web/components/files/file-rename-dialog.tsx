"use client"

import * as React from "react"

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
import type { FileNode } from "@/lib/files/types"

export function FileRenameDialog({
  file,
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  file: FileNode
  children: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { renameFile } = useFiles()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const [name, setName] = React.useState(file.name)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setName(file.name)
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Rename {file.kind === "folder" ? "folder" : "file"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) return
            renameFile(file.id, name)
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`rename-${file.id}`}>Name</FieldLabel>
              <Input
                id={`rename-${file.id}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
