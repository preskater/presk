"use client"

import * as React from "react"

import { TaskForm, type TaskFormValue } from "@/components/task/task-form"
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

import { useProjectStore } from "@/lib/projects/store"
import type { Task } from "@/lib/projects/types"

export function TaskFormDialog({
  projectId,
  task,
  trigger,
}: {
  projectId: string
  task?: Task
  trigger: React.ReactElement
}) {
  const { createTask, updateTask } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const formId = React.useId()

  function handleSubmit(value: TaskFormValue) {
    if (task) {
      updateTask(task.id, value)
    } else {
      createTask(value)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? `Edit ${task.identifier}` : "Create task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update the details of this task."
              : "Add a task to track work for this project."}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          key={open ? "open" : "closed"}
          formId={formId}
          projectId={projectId}
          task={task}
          onSubmit={handleSubmit}
        />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancel
          </DialogClose>
          <Button type="submit" form={formId}>
            {task ? "Save" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
