import { handle } from "@/lib/core/http"
import {
  addShare,
  listShares,
  removeShare,
  updateShare,
} from "@/lib/files/controller"

export const GET = handle(listShares)
export const POST = handle(addShare)
export const PATCH = handle(updateShare)
export const DELETE = handle(removeShare)
