import { NextResponse } from "next/server"

import { getRequestContext } from "@/lib/core/auth-context"
import { getPrivateBlob } from "@/lib/files/storage"
import { isOwnedPath } from "@/lib/files/paths"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attachmentId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { attachmentId } = await params

  const attachment = await prisma.messageAttachment.findFirst({
    where: {
      id: attachmentId,
      message: { conversation: { organizationId: ctx.organizationId } },
    },
    select: { name: true, storageKey: true, mimeType: true },
  })

  if (!attachment?.storageKey) {
    return new NextResponse("Not found", { status: 404 })
  }
  if (!isOwnedPath(ctx.organizationId, attachment.storageKey)) {
    return new NextResponse("Not found", { status: 404 })
  }

  const result = await getPrivateBlob(attachment.storageKey)
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new NextResponse("Not found", { status: 404 })
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type":
        result.blob.contentType ||
        attachment.mimeType ||
        "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(attachment.name)}"`,
      "Cache-Control": "private, no-cache",
    },
  })
}
