import { handle } from "@/lib/core/http"
import { toggleCalendar } from "@/lib/calendars/controller"

export const POST = handle(toggleCalendar)
