"use client"

import * as React from "react"

import { Calendar } from "@workspace/ui/components/calendar"

import { useCalendars } from "@/lib/calendars/store"

export function MiniCalendar({
  focusDate,
  onSelectDate,
}: {
  focusDate: Date
  onSelectDate: (date: Date) => void
}) {
  const { eventsOnDay } = useCalendars()
  const eventDates = React.useMemo(() => {
    const dates: Date[] = []
    const cursor = new Date(focusDate)
    cursor.setDate(1)
    const month = cursor.getMonth()
    while (cursor.getMonth() === month) {
      if (eventsOnDay(cursor).length > 0) dates.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return dates
  }, [focusDate, eventsOnDay])

  return (
    <Calendar
      mode="single"
      selected={focusDate}
      month={focusDate}
      onMonthChange={onSelectDate}
      onSelect={(date) => date && onSelectDate(date)}
      modifiers={{ hasEvents: eventDates }}
      modifiersClassNames={{
        hasEvents:
          "relative after:absolute after:bottom-0.5 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
      }}
      className="[--cell-size:--spacing(7)] p-1"
    />
  )
}
