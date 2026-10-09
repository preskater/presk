import { Readable } from "node:stream"

import { NextResponse } from "next/server"

import { getRequestContext } from "@/lib/core/auth-context"
import { toAppError } from "@/lib/core/errors"
import { jsonError } from "@/lib/core/http"
import { fileService } from "@/lib/files"
import { orgQuotaBytes, orgUsedBytes } from "@/lib/files/storage"
import { uploadLargeObject, unlinkLargeObject } from "@/lib/large-object"
import { ROLE_RANK } from "@/lib/organization/roles"

const MAX_FILE_BYTES = 4 * 1024 * 1024

export const runtime = "nodejs"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const ctx = await getRequestContext({ request })

    if ((ROLE_RANK[ctx.role] ?? 0) < 2) {
      return NextResponse.json(
        { error: { code: "forbidden", message: "Your role cannot modify files." } },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const name = url.searchParams.get("name")
    const parentId = url.searchParams.get("parentId")
    const mimeType = url.searchParams.get("mimeType") || undefined

    if (!name) {
      return NextResponse.json(
        { error: { code: "bad_request", message: "A file name is required." } },
        { status: 400 }
      )
    }

    if (!request.body) {
      return NextResponse.json(
        { error: { code: "bad_request", message: "A request body is required." } },
        { status: 400 }
      )
    }

    const [quota, used] = await Promise.all([
      orgQuotaBytes(ctx.organizationId),
      orgUsedBytes(ctx.organizationId),
    ])
    const maxBytes = Math.min(MAX_FILE_BYTES, Math.max(0, quota - used))
    if (maxBytes <= 0) {
      return NextResponse.json(
        { error: { code: "conflict", message: "Storage quota exceeded." } },
        { status: 413 }
      )
    }

    const body = Readable.fromWeb(
      request.body as Parameters<typeof Readable.fromWeb>[0]
    )

    const uploaded = await uploadLargeObject(body, { maxBytes })

    // Transient uploads (e.g. message attachments) only need the large object;
    // their metadata is persisted later by the caller that references the oid.
    if (url.searchParams.get("transient") === "1") {
      return NextResponse.json(uploaded)
    }

    try {
      const file = await fileService.finalizeUpload(ctx, {
        name,
        parentId: parentId || null,
        sizeBytes: uploaded.size,
        mimeType,
        oid: uploaded.oid,
        sha256: uploaded.sha256,
      })
      return NextResponse.json(file)
    } catch (error) {
      // The bytes are already committed; drop the orphaned large object so we
      // do not leak storage when the metadata write fails.
      await unlinkLargeObject(uploaded.oid).catch((unlinkError) =>
        console.error(
          `[files] failed to unlink orphaned large object ${uploaded.oid}`,
          unlinkError
        )
      )
      throw error
    }
  } catch (error) {
    return jsonError(toAppError(error))
  }
}

