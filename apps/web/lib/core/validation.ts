import type { ZodType } from "zod"

export function parse<T>(schema: ZodType<T>, input: unknown): T {
  return schema.parse(input)
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return {}
  }
}
