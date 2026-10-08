import { handle } from "@/lib/core/http"
import { restoreFile, trashFile } from "@/lib/files/controller"

export const POST = handle(trashFile)
export const PUT = handle(restoreFile)
