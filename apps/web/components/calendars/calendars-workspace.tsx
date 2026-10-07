"use client"

import * as React from "react"

import { AgendaView } from "@/components/calendars/agenda-view"
import { AvailabilityView } from "@/components/calendars/availability-view"
import { CalendarsHeader } from "@/components/calendars/calendars-header"
import { CalendarsSearchCommand } from "@/components/calendars/calendars-search"
import { CalendarsSidebar } from "@/components/calendars/calendars-sidebar"
import { EventDetailsSheet } from "@/components/calendars/event-details-sheet"
import { EventDialog } from "@/components/calendars/event-dialog"
import { MonthView } from "@/components/calendars/month-view"
import { TimeGrid } from "@/components/calendars/time-grid"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"

import {
  endOfWeek,
  formatRange,
  startOfWeek,
  addDays,
} from "@/lib/calendars/date-utils"
import { useCalendars } from "@/lib/calendars/store"
import { useRecents } from "@/lib/recents/store"
import type { CalendarEvent, CalendarView } from "@/lib/calendars/types"

const VIEW_LABEL: Record<CalendarView, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  agenda: "Agenda",
  availability: "Availability",
}

export function CalendarsWorkspace() {
  const { moveEvent, members, currentUserId } = useCalendars()
  const { record, active, hydrated } = useRecents()
  const [focusDate, setFocusDate] = React.useState(new Date())
  const [view, setView] = React.useState<CalendarView>("week")
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [detailsEvent, setDetailsEvent] = React.useState<CalendarEvent | undefined>()
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [createRange, setCreateRange] = React.useState<
    { start: Date; end: Date } | undefined
  >()
  const [createOpen, setCreateOpen] = React.useState(false)
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<string[]>(
    () => members.filter((member) => member.id !== currentUserId).map((member) => member.id)
  )

  const restoredRef = React.useRef(false)
  React.useEffect(() => {
    if (!hydrated || restoredRef.current || !active.calendars) return
    restoredRef.current = true
    const separator = active.calendars.indexOf(":")
    const candidate = active.calendars.slice(0, separator) as CalendarView
    if (candidate in VIEW_LABEL) setView(candidate)
    const parsed = new Date(active.calendars.slice(separator + 1))
    if (!Number.isNaN(parsed.getTime())) setFocusDate(parsed)
  }, [hydrated, active.calendars])

  React.useEffect(() => {
    if (!hydrated) return
    if (!restoredRef.current && active.calendars) return
    record("calendars", {
      id: `${view}:${focusDate.toISOString()}`,
      label: VIEW_LABEL[view],
      hint: focusDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      data: { view, date: focusDate.toISOString() },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, focusDate, hydrated])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const weekDays = React.useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(focusDate), index)),
    [focusDate]
  )

  const rangeLabel =
    view === "week"
      ? formatRange(startOfWeek(focusDate), endOfWeek(focusDate), "week")
      : formatRange(focusDate, focusDate, view)

  function shift(direction: -1 | 1) {
    setFocusDate((prev) => {
      if (view === "day") return addDays(prev, direction)
      if (view === "week") return addDays(prev, direction * 7)
      if (view === "month" || view === "agenda") {
        const next = new Date(prev)
        next.setMonth(next.getMonth() + direction)
        return next
      }
      return addDays(prev, direction * 7)
    })
  }

  function openEvent(event: CalendarEvent) {
    setDetailsEvent(event)
    setDetailsOpen(true)
  }

  function handleCreate(start: Date, end: Date) {
    setCreateRange({ start, end })
    setCreateOpen(true)
  }

  function toggleMember(memberId: string) {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <ResizablePanelGroup
          id="calendar-layout"
          orientation="horizontal"
          className="h-full min-h-0"
        >
          <ResizablePanel
            id="calendar-sidebar"
            defaultSize="248px"
            minSize="200px"
            maxSize="360px"
            className="hidden min-h-0 md:block"
          >
            <CalendarsSidebar
              focusDate={focusDate}
              onSelectDate={setFocusDate}
              selectedMemberIds={selectedMemberIds}
              onToggleMember={toggleMember}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden md:flex" />

          <ResizablePanel id="calendar-main" minSize="50%" className="flex min-h-0 flex-col">
            <CalendarsHeader
              rangeLabel={rangeLabel}
              view={view}
              onViewChange={setView}
              onToday={() => setFocusDate(new Date())}
              onPrev={() => shift(-1)}
              onNext={() => shift(1)}
              onSearch={() => setSearchOpen(true)}
            />
            {view === "month" ? (
              <MonthView
                focusDate={focusDate}
                onSelectDate={setFocusDate}
                onOpenEvent={openEvent}
              />
            ) : null}
            {view === "week" ? (
              <TimeGrid
                days={weekDays}
                onOpenEvent={openEvent}
                onCreate={handleCreate}
                onMove={moveEvent}
                onSelectDate={setFocusDate}
              />
            ) : null}
            {view === "day" ? (
              <TimeGrid
                days={[focusDate]}
                onOpenEvent={openEvent}
                onCreate={handleCreate}
                onMove={moveEvent}
                onSelectDate={setFocusDate}
              />
            ) : null}
            {view === "agenda" ? (
              <AgendaView focusDate={focusDate} onOpenEvent={openEvent} />
            ) : null}
            {view === "availability" ? (
              <AvailabilityView
                focusDate={focusDate}
                selectedMemberIds={selectedMemberIds}
                onOpenEvent={openEvent}
              />
            ) : null}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <EventDetailsSheet
        event={detailsEvent}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <CalendarsSearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectEvent={(event) => {
          setFocusDate(new Date(event.startAt))
          openEvent(event)
        }}
      />

      <EventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultStart={createRange?.start}
        defaultEnd={createRange?.end}
        trigger={<span className="hidden" />}
      />
    </>
  )
}
