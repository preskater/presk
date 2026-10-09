"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { DatePicker } from "@/components/task/date-picker"
import { MemberPicker } from "@/components/task/member-picker"
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
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import { useProjectStore, type CreateTaskInput } from "@/lib/projects/store"
import { useEnumLabel } from "@/lib/i18n/labels"
import {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type TaskTemplate,
} from "@/lib/projects/types"

export interface TaskFormValue extends CreateTaskInput {}

export function TaskForm({
  projectId,
  task,
  template,
  formId,
  onSubmit,
}: {
  projectId: string
  task?: Task
  template?: TaskTemplate
  formId: string
  onSubmit: (value: TaskFormValue) => void
}) {
  const t = useTranslations("Projects")
  const L = useEnumLabel()
  const statusItems = TASK_STATUS_VALUES.map((value) => ({
    label: L.taskStatus(value),
    value,
  }))
  const { labels } = useProjectStore()
  const [title, setTitle] = React.useState(task?.title ?? "")
  const [description, setDescription] = React.useState(
    task?.description ?? template?.description ?? ""
  )
  const [status, setStatus] = React.useState<TaskStatus>(
    task?.status ?? template?.status ?? "todo"
  )
  const [priority, setPriority] = React.useState<TaskPriority>(
    task?.priority ?? template?.priority ?? "medium"
  )
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>(
    task?.assigneeId
  )
  const [labelIds, setLabelIds] = React.useState<string[]>(
    task?.labelIds ?? template?.labelIds ?? []
  )
  const [dueDate, setDueDate] = React.useState<string | undefined>(task?.dueDate)
  const [endDate, setEndDate] = React.useState<string | undefined>(task?.endDate)

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        if (!title.trim()) return
        onSubmit({
          projectId,
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          assigneeId,
          labelIds,
          dueDate,
          endDate,
        })
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${formId}-title`}>{t("title")}</FieldLabel>
          <Input
            id={`${formId}-title`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("titlePlaceholder")}
            autoFocus
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${formId}-description`}>
            {t("description")}
          </FieldLabel>
          <Textarea
            id={`${formId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("taskDescriptionPlaceholder")}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-status`}>{t("status")}</FieldLabel>
            <Select
              items={statusItems}
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger id={`${formId}-status`} className="w-full">
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
          <Field>
            <FieldLabel htmlFor={`${formId}-assignee`}>{t("assignee")}</FieldLabel>
            <MemberPicker
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={false}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={`${formId}-priority`}>{t("priority")}</FieldLabel>
          <ToggleGroup
            value={[priority]}
            onValueChange={(value) =>
              value[0] && setPriority(value[0] as TaskPriority)
            }
            spacing={2}
            className="flex-wrap"
          >
            {TASK_PRIORITY_VALUES.map((value) => (
              <ToggleGroupItem
                key={value}
                value={value}
                variant="outline"
                size="sm"
              >
                {L.taskPriority(value)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${formId}-labels`}>{t("labels")}</FieldLabel>
          <ToggleGroup
            multiple
            value={labelIds}
            onValueChange={(value) => setLabelIds(value as string[])}
            spacing={2}
            className="flex-wrap"
          >
            {labels.map((label) => (
              <ToggleGroupItem
                key={label.id}
                value={label.id}
                variant="outline"
                size="sm"
              >
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldDescription>{t("labelsHint")}</FieldDescription>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-due`}>{t("dueDate")}</FieldLabel>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${formId}-end`}>{t("endDate")}</FieldLabel>
            <DatePicker value={endDate} onChange={setEndDate} />
          </Field>
        </div>
      </FieldGroup>
    </form>
  )
}
