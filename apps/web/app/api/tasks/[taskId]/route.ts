import { handle } from "@/lib/core/http"
import {
  deleteTask,
  getTask,
  moveTask,
  updateTask,
} from "@/lib/projects/controller"

export const GET = handle(getTask)
export const PATCH = handle(updateTask)
export const PUT = handle(moveTask)
export const DELETE = handle(deleteTask)
