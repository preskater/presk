"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"

import { formatDayLabel, formatEventRange } from "@/lib/calendars/date-utils"
import { EVENT_COLOR_CLASSES } from "@/lib/calendars/event-colors"
import { useCalendars } from "@/lib/calendars/store"
import { cn } from "@workspace/ui/lib/utils"
import type { CalendarEvent } from "@/lib/calendars/types"

export function CalendarsSearchCommand({
  open,
  onOpenChange,
  onSelectEvent,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectEvent: (event: CalendarEvent) => void
}) {
  const { events, getCalendar } = useCalendars()

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search events"
      description="Search across all calendars"
      className="sm:max-w-lg"
    >
      <Command
        filter={(value, search) =>
          value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
        }
      >
        <CommandInput placeholder="Search events..." />
        <CommandList>
          <CommandEmpty>No events found.</CommandEmpty>
          <CommandGroup heading="Events">
            {events.map((event) => {
              const calendar = getCalendar(event.calendarId)
              return (
                <CommandItem
                  key={event.id}
                  value={`${event.title} ${event.description ?? ""} ${calendar?.name ?? ""}`}
                  onSelect={() => {
                    onSelectEvent(event)
                    onOpenChange(false)
                  }}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      EVENT_COLOR_CLASSES[event.color].dot
                    )}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{event.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {formatDayLabel(new Date(event.startAt))} ·{" "}
                      {formatEventRange(event)}
                      {calendar ? ` · ${calendar.name}` : ""}
                    </span>
                  </span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
