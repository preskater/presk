import { toAppError } from "./errors"

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } }

export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.ok) {
    const error = new Error(result.error.message) as Error & { code?: string }
    error.code = result.error.code
    throw error
  }
  return result.data
}

export function withAction<Args extends unknown[], T>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<ActionResult<T>> {
  return async (...args: Args): Promise<ActionResult<T>> => {
    try {
      const data = await fn(...args)
      return { ok: true, data }
    } catch (error) {
      const appError = toAppError(error)
      if (appError.status >= 500) {
        console.error(appError)
      }
      return {
        ok: false,
        error: { code: appError.code, message: appError.message },
      }
    }
  }
}
