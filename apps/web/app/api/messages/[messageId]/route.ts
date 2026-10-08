import { handle } from "@/lib/core/http"
import { deleteMessage, editMessage } from "@/lib/messaging/controller"

export const PATCH = handle(editMessage)
export const DELETE = handle(deleteMessage)

