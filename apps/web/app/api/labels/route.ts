import { handle } from "@/lib/core/http"
import { addLabel, listLabels } from "@/lib/projects/controller"

export const GET = handle(listLabels)
export const POST = handle(addLabel)
