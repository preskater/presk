import { handle } from "@/lib/core/http"
import { respondToEvent } from "@/lib/calendars/controller"

export const POST = handle(respondToEvent)
