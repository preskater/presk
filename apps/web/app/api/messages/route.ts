import { handle } from "@/lib/core/http"
import { listMessaging, sendMessage } from "@/lib/messaging/controller"

export const GET = handle(listMessaging)
export const POST = handle(sendMessage)
