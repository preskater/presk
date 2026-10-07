"use client"

import { cn } from "@workspace/ui/lib/utils"

import type { Presence } from "@/lib/messaging/types"

const PRESENCE_COLOR: Record<Presence, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  busy: "bg-destructive",
  offline: "bg-muted-foreground/40",
}

const PRESENCE_LABEL: Record<Presence, string> = {
  online: "Available",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
}

export function PresenceDot({
  presence = "offline",
  className,
  label = false,
}: {
  presence?: Presence
  className?: string
  label?: boolean
}) {
  if (label) {
    return (
      <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
        <span
          aria-hidden
          className={cn("size-2 rounded-full", PRESENCE_COLOR[presence])}
        />
        {PRESENCE_LABEL[presence]}
      </span>
    )
  }

  return (
    <span
      aria-label={PRESENCE_LABEL[presence]}
      title={PRESENCE_LABEL[presence]}
      className={cn(
        "size-2.5 rounded-full ring-2 ring-background",
        PRESENCE_COLOR[presence],
        className
      )}
    />
  )
}
