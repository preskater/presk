"use client"

import * as React from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
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

import { useEnumLabel } from "@/lib/i18n/labels"
import { useProjectStore } from "@/lib/projects/store"
import {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  type TaskPriority,
  type TaskStatus,
  type TaskTemplate,
} from "@/lib/projects/types"

function TemplateDialog({
  projectId,
  template,
  trigger,
}: {
  projectId: string
  template?: TaskTemplate
  trigger: React.ReactElement
}) {
  const t = useTranslations("Projects")
  const L = useEnumLabel()
  const { labels, createTemplate, updateTemplate } = useProjectStore()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(template?.name ?? "")
  const [description, setDescription] = React.useState(
    template?.description ?? ""
  )
  const [status, setStatus] = React.useState<TaskStatus>(
    template?.status ?? "todo"
  )
  const [priority, setPriority] = React.useState<TaskPriority>(
    template?.priority ?? "medium"
  )
  const [labelIds, setLabelIds] = React.useState<string[]>(
    template?.labelIds ?? []
  )

  function reset() {
    setName(template?.name ?? "")
    setDescription(template?.description ?? "")
    setStatus(template?.status ?? "todo")
    setPriority(template?.priority ?? "medium")
    setLabelIds(template?.labelIds ?? [])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {template ? t("editTemplate") : t("createTemplate")}
          </DialogTitle>
          <DialogDescription>{t("templateDescription")}</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!name.trim()) return
            if (template) {
              updateTemplate(template.id, {
                name: name.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                labelIds,
              })
            } else {
              createTemplate({
                projectId,
                name: name.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                labelIds,
              })
            }
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`tpl-${projectId}-name`}>
                {t("name")}
              </FieldLabel>
              <Input
                id={`tpl-${projectId}-name`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("templateNamePlaceholder")}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`tpl-${projectId}-description`}>
                {t("description")}
              </FieldLabel>
              <Textarea
                id={`tpl-${projectId}-description`}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t("taskDescriptionPlaceholder")}
              />
            </Field>
            <Field>
              <FieldLabel>{t("status")}</FieldLabel>
              <Select
                items={TASK_STATUS_VALUES.map((value) => ({
                  value,
                  label: L.taskStatus(value),
                }))}
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_STATUS_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {L.taskStatus(value)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>{t("priority")}</FieldLabel>
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
              <FieldLabel>{t("labels")}</FieldLabel>
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
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              {t("cancel")}
            </DialogClose>
            <Button type="submit">{template ? t("save") : t("createTemplate")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function TaskTemplatesManager({ projectId }: { projectId: string }) {
  const t = useTranslations("Projects")
  const L = useEnumLabel()
  const { templatesForProject, getLabel, removeTemplate } = useProjectStore()
  const templates = templatesForProject(projectId)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{t("templates")}</CardTitle>
            <CardDescription>{t("templatesDescription")}</CardDescription>
          </div>
          <TemplateDialog
            projectId={projectId}
            trigger={
              <Button size="sm">
                <PlusIcon data-icon="inline-start" />
                {t("createTemplate")}
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {templates.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            {t("noTemplates")}
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-sm font-medium">{template.name}</span>
                {template.description ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {template.description}
                  </span>
                ) : null}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{L.taskStatus(template.status)}</span>
                  <span aria-hidden>·</span>
                  <span>{L.taskPriority(template.priority)}</span>
                  {template.labelIds.map((labelId) => {
                    const label = getLabel(labelId)
                    if (!label) return null
                    return (
                      <span
                        key={labelId}
                        className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </span>
                    )
                  })}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <TemplateDialog
                  projectId={projectId}
                  template={template}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={t("editTemplate")}
                    >
                      <PencilIcon />
                    </Button>
                  }
                />
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t("deleteTemplate")}
                  onClick={() => removeTemplate(template.id)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
