import { handle } from "@/lib/core/http"
import { startDm } from "@/lib/messaging/controller"

export const POST = handle(startDm)
