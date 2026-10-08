export type AppErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "conflict"
  | "bad_request"
  | "internal_error"

const STATUS_BY_CODE: Record<AppErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_error: 422,
  conflict: 409,
  bad_request: 400,
  internal_error: 500,
}

export class AppError extends Error {
  readonly code: AppErrorCode
  readonly status: number
  readonly details?: unknown

  constructor(
    code: AppErrorCode,
    message: string,
    details?: unknown
  ) {
    super(message)
    this.name = "AppError"
    this.code = code
    this.status = STATUS_BY_CODE[code]
    this.details = details
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "You must be signed in to do this.") {
    super("unauthorized", message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to do this.") {
    super("forbidden", message)
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super("not_found", `${resource} was not found.`)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends AppError {
  constructor(message = "The request was invalid.", details?: unknown) {
    super("validation_error", message, details)
    this.name = "ValidationError"
  }
}

export class ConflictError extends AppError {
  constructor(message = "That change conflicts with existing data.") {
    super("conflict", message)
    this.name = "ConflictError"
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super("bad_request", message)
    this.name = "BadRequestError"
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

interface ZodLikeError {
  name: string
  issues?: unknown
}

function isZodError(error: unknown): error is ZodLikeError {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as ZodLikeError).name === "ZodError" &&
    "issues" in error
  )
}

export function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error
  if (isZodError(error)) {
    return new ValidationError("The request was invalid.", error.issues)
  }
  if (error instanceof Error) {
    return new AppError("internal_error", error.message)
  }
  return new AppError("internal_error", "Something went wrong.")
}
