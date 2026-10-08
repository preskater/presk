"use client"

import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { useEnumLabel } from "@/lib/i18n/labels"
import {
  PRIORITY_BADGE_VARIANT,
  type Label,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/projects/types"

const STATUS_BADGE_VARIANT: Record<
  TaskStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  backlog: "outline",
  todo: "secondary",
  in_progress: "default",
  review: "secondary",
  done: "outline",
}

export function StatusBadge({
  status,
  className,
}: {
  status: TaskStatus
  className?: string
}) {
  const L = useEnumLabel()
  return (
    <Badge variant={STATUS_BADGE_VARIANT[status]} className={cn(className)}>
      {L.taskStatus(status)}
    </Badge>
  )
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority
  className?: string
}) {
  const L = useEnumLabel()
  return (
    <Badge
      variant={PRIORITY_BADGE_VARIANT[priority]}
      className={cn(className)}
    >
      {L.taskPriority(priority)}
    </Badge>
  )
}

export function LabelTag({
  label,
  className,
}: {
  label: Label
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: label.color }}
      />
      {label.name}
    </span>
  )
}
