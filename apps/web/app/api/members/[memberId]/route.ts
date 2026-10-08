import { handle } from "@/lib/core/http"
import { removeMember } from "@/lib/projects/controller"

export const DELETE = handle(removeMember)
