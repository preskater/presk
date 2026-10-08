"use server"

import { revalidatePath } from "next/cache"

import { withAction } from "@/lib/core/action"
import { getRequestContext } from "@/lib/core/auth-context"
import { calendarService } from "@/lib/calendars"
import {
  createCalendarSchema,
  createEventSchema,
  moveEventSchema,
  setAttendeeResponseSchema,
  updateEventSchema,
} from "@/lib/calendars/schemas"

export const listCalendarDataAction = withAction(async () => {
  const ctx = await getRequestContext()
  return calendarService.list(ctx)
})

export const createEventAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = createEventSchema.parse(input)
  const event = await calendarService.createEvent(ctx, parsed)
  revalidatePath("/dashboard/calendars")
  revalidatePath("/dashboard")
  return event
})

export const updateEventAction = withAction(
  async (id: string, input: unknown) => {
    const ctx = await getRequestContext()
    const parsed = updateEventSchema.parse(input)
    const event = await calendarService.updateEvent(ctx, id, parsed)
    revalidatePath("/dashboard/calendars")
    return event
  }
)

export const moveEventAction = withAction(async (id: string, input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = moveEventSchema.parse(input)
  const event = await calendarService.moveEvent(ctx, id, parsed)
  revalidatePath("/dashboard/calendars")
  return event
})

export const deleteEventAction = withAction(async (id: string) => {
  const ctx = await getRequestContext()
  const result = await calendarService.removeEvent(ctx, id)
  revalidatePath("/dashboard/calendars")
  return result
})

export const addCalendarAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = createCalendarSchema.parse(input)
  const calendar = await calendarService.addCalendar(ctx, parsed)
  revalidatePath("/dashboard/calendars")
  return calendar
})

export const toggleCalendarAction = withAction(
  async (id: string, visible?: boolean) => {
    const ctx = await getRequestContext()
    const calendar = await calendarService.toggleCalendar(ctx, id, visible)
    revalidatePath("/dashboard/calendars")
    return calendar
  }
)

export const respondToEventAction = withAction(
  async (eventId: string, input: unknown) => {
    const ctx = await getRequestContext()
    const parsed = setAttendeeResponseSchema.parse(input)
    const event = await calendarService.setAttendeeResponse(ctx, eventId, parsed)
    revalidatePath("/dashboard/calendars")
    return event
  }
)
