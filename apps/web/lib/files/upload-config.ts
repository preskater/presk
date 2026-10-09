/**
 * Chunked-upload tuning.
 *
 * Vercel caps a Function request body at 4.5 MB, so each chunk request must be
 * comfortably under that. The chunk size is also a multiple of `LOBLKSIZE`
 * (2048) so writes land on large-object page boundaries.
 */
export const UPLOAD_CHUNK_SIZE = 3 * 1024 * 1024

/** How long an unfinished upload session stays resumable before it is swept. */
export const UPLOAD_SESSION_TTL_MS = 60 * 60 * 1000

/** Client-side retry budget per chunk (in-memory only; no cross-reload resume). */
export const UPLOAD_CHUNK_RETRIES = 3

export function uploadSessionExpiry(from: Date = new Date()): Date {
  return new Date(from.getTime() + UPLOAD_SESSION_TTL_MS)
}
