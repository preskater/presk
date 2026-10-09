import { handle } from "@/lib/core/http"
import {
  createTaskTemplate,
  listTaskTemplates,
} from "@/lib/projects/controller"

export const GET = handle(listTaskTemplates)
export const POST = handle(createTaskTemplate)
