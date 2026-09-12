import { Badge } from "@workspace/ui/components/badge"
import type { AgentStatus } from "@/lib/types"

const config: Record<AgentStatus, { label: string; className: string }> = {
  active: {
    label: "Active",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  idle: {
    label: "Idle",
    className: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  error: {
    label: "Error",
    className: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  },
  stalled: {
    label: "Stalled",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  archived: {
    label: "Archived",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
  },
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const c = config[status]
  return (
    <Badge variant="outline" className={c.className}>
      {c.label}
    </Badge>
  )
}
