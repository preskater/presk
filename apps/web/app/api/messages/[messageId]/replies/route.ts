import { handle } from "@/lib/core/http"
import { addThreadReply, listThreadReplies } from "@/lib/messaging/controller"

export const GET = handle(listThreadReplies)
export const POST = handle(addThreadReply)
