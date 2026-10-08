import { NextResponse } from "next/server"

import { toAppError, type AppError } from "./errors"

export function jsonError(error: AppError) {
  return NextResponse.json(
    { error: { code: error.code, message: error.message, details: error.details } },
    { status: error.status }
  )
}

export function handle<T extends unknown[]>(
  fn: (...args: T) => Promise<Response | unknown>
) {
  return async (...args: T): Promise<Response> => {
    try {
      const result = await fn(...args)
      if (result instanceof Response) return result
      return NextResponse.json(result ?? null)
    } catch (error) {
      return jsonError(toAppError(error))
    }
  }
}
