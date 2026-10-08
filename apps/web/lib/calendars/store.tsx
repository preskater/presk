"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  addCalendarAction,
  createEventAction,
  deleteEventAction,
  moveEventAction,
  respondToEventAction,
  toggleCalendarAction,
  updateEventAction,
} from "@/actions/calendars"
import type { Member } from "@/lib/projects/types"

import type { CalendarData, CalendarEvent, CalendarSource } from "./types"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export interface EventInput {
  title: string
  description?: string
  startAt: string
  endAt: string
  allDay?: boolean
  calendarId: string
  location?: string
  meetingUrl?: string
  attendees: CalendarEvent["attendees"]
  color: CalendarEvent["color"]
  reminderMinutes?: number
}

interface CalendarStore extends CalendarData {
  members: Member[]
  currentUserId: string
  getMember: (id?: string) => Member | undefined
  getCalendar: (id: string) => CalendarSource | undefined
  visibleEvents: CalendarEvent[]
  eventsInRange: (start: Date, end: Date) => CalendarEvent[]
  eventsOnDay: (date: Date) => CalendarEvent[]
  createEvent: (input: EventInput) => void
  updateEvent: (id: string, patch: Partial<EventInput>) => void
  deleteEvent: (id: string) => void
  moveEvent: (id: string, startAt: string, endAt: string) => void
  toggleCalendar: (id: string) => void
  addCalendar: (
    name: string,
    kind: CalendarSource["kind"],
    color: CalendarSource["color"]
  ) => void
  setAttendeeResponse: (
    eventId: string,
    memberId: string,
    response: CalendarEvent["attendees"][number]["response"]
  ) => void
}

const CalendarContext = React.createContext<CalendarStore | null>(null)

export function CalendarsProvider({
  children,
  initialData,
  currentUserId,
  members = [],
}: {
  children: React.ReactNode
  initialData: CalendarData
  currentUserId: string
  members?: Member[]
}) {
  const [calendars, setCalendars] = React.useState<CalendarSource[]>(
    initialData.calendars
  )
  const [events, setEvents] = React.useState<CalendarEvent[]>(initialData.events)

  React.useEffect(() => {
    setCalendars(initialData.calendars)
    setEvents(initialData.events)
  }, [initialData])

  const visibleIds = React.useMemo(
    () =>
      new Set(
        calendars
          .filter((calendar) => calendar.visible)
          .map((calendar) => calendar.id)
      ),
    [calendars]
  )
  const visibleEvents = React.useMemo(
    () => events.filter((event) => visibleIds.has(event.calendarId)),
    [events, visibleIds]
  )

  const store = React.useMemo<CalendarStore>(() => {
    const getMember = (id?: string) =>
      id ? members.find((member) => member.id === id) : undefined
    const getCalendar = (id: string) =>
      calendars.find((calendar) => calendar.id === id)

    return {
      calendars,
      events,
      members,
      currentUserId,
      getMember,
      getCalendar,
      visibleEvents,
      eventsInRange: (start, end) =>
        visibleEvents.filter((event) => {
          const eventStart = new Date(event.startAt)
          const eventEnd = new Date(event.endAt)
          return eventStart <= end && eventEnd >= start
        }),
      eventsOnDay: (date) =>
        visibleEvents.filter((event) => {
          const eventStart = new Date(event.startAt)
          const eventEnd = new Date(event.endAt)
          const dayStart = new Date(date)
          dayStart.setHours(0, 0, 0, 0)
          const dayEnd = new Date(date)
          dayEnd.setHours(23, 59, 59, 999)
          return eventStart <= dayEnd && eventEnd >= dayStart
        }),
      createEvent: (input) => {
        const optimistic: CalendarEvent = {
          id: uid("ev"),
          createdBy: currentUserId,
          ...input,
        }
        setEvents((prev) => [...prev, optimistic])
        void createEventAction(input)
          .then((event) => {
            setEvents((prev) =>
              prev.map((item) => (item.id === optimistic.id ? event : item))
            )
            toast.success(`Event “${event.title}” created.`)
          })
          .catch((error) => {
            setEvents((prev) => prev.filter((item) => item.id !== optimistic.id))
            toast.error(error.message ?? "Could not create event.")
          })
      },
      updateEvent: (id, patch) => {
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? { ...event, ...patch } : event))
        )
        void updateEventAction(id, patch)
          .then(() => toast.success("Event updated."))
          .catch((error) => toast.error(error.message ?? "Update failed."))
      },
      deleteEvent: (id) => {
        setEvents((prev) => prev.filter((event) => event.id !== id))
        void deleteEventAction(id)
          .then(() => toast.success("Event deleted."))
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      moveEvent: (id, startAt, endAt) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === id ? { ...event, startAt, endAt } : event
          )
        )
        void moveEventAction(id, { startAt, endAt }).catch((error) =>
          toast.error(error.message ?? "Move failed.")
        )
      },
      toggleCalendar: (id) => {
        setCalendars((prev) =>
          prev.map((calendar) =>
            calendar.id === id
              ? { ...calendar, visible: !calendar.visible }
              : calendar
          )
        )
        void toggleCalendarAction(id).catch((error) =>
          toast.error(error.message ?? "Update failed.")
        )
      },
      addCalendar: (name, kind, color) => {
        const optimistic: CalendarSource = {
          id: uid("cal"),
          name,
          kind,
          color,
          visible: true,
          memberIds: [currentUserId],
        }
        setCalendars((prev) => [...prev, optimistic])
        void addCalendarAction({ name, kind, color })
          .then((calendar) => {
            setCalendars((prev) =>
              prev.map((item) => (item.id === optimistic.id ? calendar : item))
            )
            toast.success(`Calendar “${name}” added.`)
          })
          .catch((error) => {
            setCalendars((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Could not add calendar.")
          })
      },
      setAttendeeResponse: (eventId, memberId, response) => {
        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  attendees: event.attendees.map((attendee) =>
                    attendee.memberId === memberId
                      ? { ...attendee, response }
                      : attendee
                  ),
                }
              : event
          )
        )
        void respondToEventAction(eventId, { memberId, response }).catch(
          (error) => toast.error(error.message ?? "Update failed.")
        )
      },
    }
  }, [calendars, events, members, currentUserId, visibleEvents])

  return (
    <CalendarContext.Provider value={store}>
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendars() {
  const context = React.useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendars must be used within a CalendarsProvider")
  }
  return context
}
