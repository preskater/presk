"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("Projects")
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
          <DialogTitle>
            {task
              ? t("editTaskTitle", { identifier: task.identifier })
              : t("createTaskTitle")}
          </DialogTitle>
          <DialogDescription>
            {task ? t("updateTaskDescription") : t("createTaskDescription")}
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
            {t("cancel")}
          </DialogClose>
          <Button type="submit" form={formId}>
            {task ? t("save") : t("createTask")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
