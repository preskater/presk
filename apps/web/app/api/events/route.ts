import { handle } from "@/lib/core/http"
import { createEvent } from "@/lib/calendars/controller"

export const POST = handle(createEvent)
