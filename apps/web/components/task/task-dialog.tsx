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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

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
  const { createTask, updateTask, templatesForProject } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const [templateId, setTemplateId] = React.useState<string>("blank")
  const formId = React.useId()
  const templates = templatesForProject(projectId)
  const template = templates.find((item) => item.id === templateId)

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
        {!task && templates.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{t("template")}</span>
            <Select
              items={[
                { value: "blank", label: t("quickTask") },
                ...templates.map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
              value={templateId}
              onValueChange={(value) => setTemplateId(value ?? "blank")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="blank">{t("quickTask")}</SelectItem>
                  {templates.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <TaskForm
          key={`${open ? "open" : "closed"}-${templateId}`}
          formId={formId}
          projectId={projectId}
          task={task}
          template={task ? undefined : template}
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
