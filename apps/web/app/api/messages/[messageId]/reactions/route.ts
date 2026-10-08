import { handle } from "@/lib/core/http"
import { toggleReaction } from "@/lib/messaging/controller"

export const POST = handle(toggleReaction)
