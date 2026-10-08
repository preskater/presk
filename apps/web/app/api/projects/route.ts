import { handle } from "@/lib/core/http"
import { createProject, listProjects } from "@/lib/projects/controller"

export const GET = handle(listProjects)
export const POST = handle(createProject)
