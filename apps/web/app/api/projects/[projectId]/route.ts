import { handle } from "@/lib/core/http"
import {
  deleteProject,
  getProject,
  updateProject,
} from "@/lib/projects/controller"

export const GET = handle(getProject)
export const PATCH = handle(updateProject)
export const DELETE = handle(deleteProject)
