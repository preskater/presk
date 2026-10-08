import { handle } from "@/lib/core/http"
import { markRead, toggleMute, togglePin } from "@/lib/messaging/controller"

export const POST = handle(markRead)
export const PATCH = handle(toggleMute)
export const PUT = handle(togglePin)
