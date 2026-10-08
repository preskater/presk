import { NextResponse } from "next/server"

import { getRequestContext } from "@/lib/core/auth-context"
import { getPrivateBlob } from "@/lib/files/storage"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params

  const file = await prisma.fileNode.findFirst({
    where: { id: fileId, organizationId: ctx.organizationId },
    select: { name: true, storageKey: true, mimeType: true },
  })

  if (!file || !file.storageKey) {
    return new NextResponse("Not found", { status: 404 })
  }

  const result = await getPrivateBlob(file.storageKey)
  if (!result || result.statusCode !== 200 || !result.stream) {
    return new NextResponse("Not found", { status: 404 })
  }

  const contentType =
    result.blob.contentType || file.mimeType || "application/octet-stream"

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(file.name)}"`,
      "Cache-Control": "private, no-cache",
    },
  })
}
