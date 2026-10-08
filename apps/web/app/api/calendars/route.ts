import { handle } from "@/lib/core/http"
import {
  createCalendar,
  listEvents,
} from "@/lib/calendars/controller"

export const GET = handle(listEvents)
export const POST = handle(createCalendar)
