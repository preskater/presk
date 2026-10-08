import { handle } from "@/lib/core/http"
import { addTaskComment } from "@/lib/projects/controller"

export const POST = handle(addTaskComment)
