import { handle } from "@/lib/core/http"
import {
  bulkDelete,
  bulkRestore,
  bulkTrash,
} from "@/lib/files/controller"

export const POST = handle(bulkTrash)
export const PATCH = handle(bulkRestore)
export const DELETE = handle(bulkDelete)
