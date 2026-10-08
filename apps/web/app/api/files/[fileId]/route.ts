import { handle } from "@/lib/core/http"
import {
  deleteFile,
  getFile,
  moveFile,
  renameFile,
} from "@/lib/files/controller"

export const GET = handle(getFile)
export const PATCH = handle(renameFile)
export const PUT = handle(moveFile)
export const DELETE = handle(deleteFile)
