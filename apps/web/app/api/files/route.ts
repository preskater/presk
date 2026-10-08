import { handle } from "@/lib/core/http"
import { createFiles, createFolder, listFiles } from "@/lib/files/controller"

export const GET = handle(listFiles)
export const POST = handle(createFiles)
export const PUT = handle(createFolder)
