import { handle } from "@/lib/core/http"
import {
  removeTaskTemplate,
  updateTaskTemplate,
} from "@/lib/projects/controller"

export const PATCH = handle(updateTaskTemplate)
export const PUT = handle(updateTaskTemplate)
export const DELETE = handle(removeTaskTemplate)
