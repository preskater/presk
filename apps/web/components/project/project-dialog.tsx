"use client"

import * as React from "react"

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
import {
  Field,
  FieldDescription,
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
import { Textarea } from "@workspace/ui/components/textarea"

import { useProjectStore } from "@/lib/projects/store"
import type { Project, ProjectStatus } from "@/lib/projects/types"

const statusItems: { label: string; value: ProjectStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Completed", value: "completed" },
]

export function ProjectFormDialog({
  trigger,
  project,
}: {
  trigger: React.ReactElement
  project?: Project
}) {
  const { createProject, updateProject } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(project?.name ?? "")
  const [description, setDescription] = React.useState(
    project?.description ?? ""
  )
  const [status, setStatus] = React.useState<ProjectStatus>(
    project?.status ?? "active"
  )

  React.useEffect(() => {
    if (open) {
      setName(project?.name ?? "")
      setDescription(project?.description ?? "")
      setStatus(project?.status ?? "active")
    }
  }, [open, project])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    if (project) {
      updateProject(project.id, { name, description, status })
    } else {
      createProject({ name: name.trim(), description, status })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit project" : "Create project"}
          </DialogTitle>
          <DialogDescription>
            {project
              ? "Update the details of this project."
              : "Projects group tasks, members and progress in one place."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Website Redesign"
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-description">Description</FieldLabel>
              <Textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What is this project about?"
              />
              <FieldDescription>
                A short summary shown on the project card.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="project-status">Status</FieldLabel>
              <Select
                items={statusItems}
                value={status}
                onValueChange={(value) => setStatus(value as ProjectStatus)}
              >
                <SelectTrigger id="project-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {statusItems.map((item) => (
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
            <Button type="submit">{project ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CreateProjectButton({
  label = "Create project",
}: {
  label?: string
}) {
  return (
    <ProjectFormDialog
      trigger={<Button>{label}</Button>}
    />
  )
}
