"use client"

import * as React from "react"

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
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/projects/types"

const statusItems = TASK_STATUSES.map((status) => ({
  label: status.label,
  value: status.value,
}))

export interface TaskFormValue extends CreateTaskInput {}

export function TaskForm({
  projectId,
  task,
  formId,
  onSubmit,
}: {
  projectId: string
  task?: Task
  formId: string
  onSubmit: (value: TaskFormValue) => void
}) {
  const { labels } = useProjectStore()
  const [title, setTitle] = React.useState(task?.title ?? "")
  const [description, setDescription] = React.useState(task?.description ?? "")
  const [status, setStatus] = React.useState<TaskStatus>(task?.status ?? "todo")
  const [priority, setPriority] = React.useState<TaskPriority>(
    task?.priority ?? "medium"
  )
  const [assigneeId, setAssigneeId] = React.useState<string | undefined>(
    task?.assigneeId
  )
  const [labelIds, setLabelIds] = React.useState<string[]>(task?.labelIds ?? [])
  const [dueDate, setDueDate] = React.useState<string | undefined>(task?.dueDate)

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
        })
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
          <Input
            id={`${formId}-title`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Build responsive marketing pages"
            autoFocus
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
          <Textarea
            id={`${formId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add more detail about this task..."
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-status`}>Status</FieldLabel>
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
            <FieldLabel htmlFor={`${formId}-assignee`}>Assignee</FieldLabel>
            <MemberPicker
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={false}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={`${formId}-priority`}>Priority</FieldLabel>
          <ToggleGroup
            value={[priority]}
            onValueChange={(value) =>
              value[0] && setPriority(value[0] as TaskPriority)
            }
            spacing={2}
            className="flex-wrap"
          >
            {TASK_PRIORITIES.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                variant="outline"
                size="sm"
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${formId}-labels`}>Labels</FieldLabel>
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
          <FieldDescription>Tag this task with one or more labels.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${formId}-due`}>Due date</FieldLabel>
          <DatePicker value={dueDate} onChange={setDueDate} />
        </Field>
      </FieldGroup>
    </form>
  )
}
