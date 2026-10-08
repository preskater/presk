import { getRequestContext } from "@/lib/core/auth-context"
import { readJson } from "@/lib/core/validation"

import { calendarService } from "./index"
import {
  createCalendarSchema,
  createEventSchema,
  moveEventSchema,
  setAttendeeResponseSchema,
  toggleCalendarSchema,
  updateEventSchema,
} from "./schemas"

export async function listEvents(request: Request) {
  const ctx = await getRequestContext({ request })
  return calendarService.list(ctx)
}

export async function createEvent(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = createEventSchema.parse(await readJson(request))
  return calendarService.createEvent(ctx, input)
}

export async function updateEvent(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { eventId } = await params
  const input = updateEventSchema.parse(await readJson(request))
  return calendarService.updateEvent(ctx, eventId, input)
}

export async function deleteEvent(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { eventId } = await params
  return calendarService.removeEvent(ctx, eventId)
}

export async function moveEvent(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { eventId } = await params
  const input = moveEventSchema.parse(await readJson(request))
  return calendarService.moveEvent(ctx, eventId, input)
}

export async function respondToEvent(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { eventId } = await params
  const input = setAttendeeResponseSchema.parse(await readJson(request))
  return calendarService.setAttendeeResponse(ctx, eventId, input)
}

export async function createCalendar(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = createCalendarSchema.parse(await readJson(request))
  return calendarService.addCalendar(ctx, input)
}

export async function toggleCalendar(
  request: Request,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { calendarId } = await params
  const input = toggleCalendarSchema.parse(await readJson(request))
  return calendarService.toggleCalendar(ctx, calendarId, input.visible)
}
