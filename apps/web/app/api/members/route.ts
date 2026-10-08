import { handle } from "@/lib/core/http"
import { addMember, listMembers } from "@/lib/projects/controller"

export const GET = handle(listMembers)
export const POST = handle(addMember)
