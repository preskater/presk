import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

import { getRequestContext } from "@/lib/core/auth-context"
import {
  isOwnedPath,
  orgQuotaBytes,
  orgUsedBytes,
} from "@/lib/files/storage"
import { ROLE_RANK } from "@/lib/organization/roles"

const MAX_FILE_BYTES = 100 * 1024 * 1024

export const runtime = "nodejs"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const ctx = await getRequestContext({ request })

    if ((ROLE_RANK[ctx.role] ?? 0) < 2) {
      return NextResponse.json(
        { error: "Your role cannot modify files." },
        { status: 403 }
      )
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isOwnedPath(ctx.organizationId, pathname)) {
          throw new Error("Invalid upload path.")
        }
        const [quota, used] = await Promise.all([
          orgQuotaBytes(ctx.organizationId),
          orgUsedBytes(ctx.organizationId),
        ])
        const maximumSizeInBytes = Math.min(
          MAX_FILE_BYTES,
          Math.max(0, quota - used)
        )
        if (maximumSizeInBytes <= 0) {
          throw new Error("Storage quota exceeded.")
        }
        return {
          access: "private",
          addRandomSuffix: true,
          maximumSizeInBytes,
          tokenPayload: JSON.stringify({
            organizationId: ctx.organizationId,
            userId: ctx.userId,
          }),
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 }
    )
  }
}
