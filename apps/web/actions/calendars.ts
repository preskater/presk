"use server"

import { revalidatePath } from "next/cache"

import { getRequestContext } from "@/lib/core/auth-context"
import { calendarService } from "@/lib/calendars"
import {
  createCalendarSchema,
  createEventSchema,
  moveEventSchema,
  setAttendeeResponseSchema,
  updateEventSchema,
} from "@/lib/calendars/schemas"

export async function listCalendarDataAction() {
  const ctx = await getRequestContext()
  return calendarService.list(ctx)
}

export async function createEventAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createEventSchema.parse(input)
  const event = await calendarService.createEvent(ctx, parsed)
  revalidatePath("/dashboard/calendars")
  revalidatePath("/dashboard")
  return event
}

export async function updateEventAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = updateEventSchema.parse(input)
  const event = await calendarService.updateEvent(ctx, id, parsed)
  revalidatePath("/dashboard/calendars")
  return event
}

export async function moveEventAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = moveEventSchema.parse(input)
  const event = await calendarService.moveEvent(ctx, id, parsed)
  revalidatePath("/dashboard/calendars")
  return event
}

export async function deleteEventAction(id: string) {
  const ctx = await getRequestContext()
  const result = await calendarService.removeEvent(ctx, id)
  revalidatePath("/dashboard/calendars")
  return result
}

export async function addCalendarAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createCalendarSchema.parse(input)
  const calendar = await calendarService.addCalendar(ctx, parsed)
  revalidatePath("/dashboard/calendars")
  return calendar
}

export async function toggleCalendarAction(id: string, visible?: boolean) {
  const ctx = await getRequestContext()
  const calendar = await calendarService.toggleCalendar(ctx, id, visible)
  revalidatePath("/dashboard/calendars")
  return calendar
}

export async function respondToEventAction(
  eventId: string,
  input: unknown
) {
  const ctx = await getRequestContext()
  const parsed = setAttendeeResponseSchema.parse(input)
  const event = await calendarService.setAttendeeResponse(ctx, eventId, parsed)
  revalidatePath("/dashboard/calendars")
  return event
}
