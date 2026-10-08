import { handle } from "@/lib/core/http"
import { removeLabel } from "@/lib/projects/controller"

export const DELETE = handle(removeLabel)
