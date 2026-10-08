import { handle } from "@/lib/core/http"
import {
  createTask,
  listProjectTasks,
} from "@/lib/projects/controller"

export const GET = handle(listProjectTasks)
export const POST = handle(createTask)
