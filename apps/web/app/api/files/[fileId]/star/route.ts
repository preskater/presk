import { handle } from "@/lib/core/http"
import { toggleStar } from "@/lib/files/controller"

export const POST = handle(toggleStar)
