import { handle } from "@/lib/core/http"
import { deleteEvent, moveEvent, updateEvent } from "@/lib/calendars/controller"

export const PATCH = handle(updateEvent)
export const PUT = handle(moveEvent)
export const DELETE = handle(deleteEvent)
