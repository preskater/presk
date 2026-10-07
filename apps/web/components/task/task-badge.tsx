import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import {
  PRIORITY_BADGE_VARIANT,
  TASK_PRIORITIES,
  TASK_STATUSES,
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
  const label = TASK_STATUSES.find((item) => item.value === status)?.label ?? status
  return (
    <Badge variant={STATUS_BADGE_VARIANT[status]} className={cn(className)}>
      {label}
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
  const label =
    TASK_PRIORITIES.find((item) => item.value === priority)?.label ?? priority
  return (
    <Badge
      variant={PRIORITY_BADGE_VARIANT[priority]}
      className={cn(className)}
    >
      {label}
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
