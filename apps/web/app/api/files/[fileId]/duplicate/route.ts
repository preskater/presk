import { handle } from "@/lib/core/http"
import { duplicateFile } from "@/lib/files/controller"

export const POST = handle(duplicateFile)
