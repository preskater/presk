import { del, get, head } from "@vercel/blob"

import { prisma } from "@/lib/prisma"
import { quotaForPlan } from "@/lib/organization/plans"

export { orgPrefix, isOwnedPath } from "./paths"

export async function orgQuotaBytes(organizationId: string): Promise<number> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { storageQuotaBytes: true, metadata: true },
  })
  if (!organization) return quotaForPlan(null)
  if (organization.storageQuotaBytes !== null) {
    return Number(organization.storageQuotaBytes)
  }
  const plan = parsePlan(organization.metadata)
  return quotaForPlan(plan)
}

function parsePlan(metadata: string | null): string | null {
  if (!metadata) return null
  try {
    const parsed = JSON.parse(metadata) as { plan?: string }
    return parsed.plan ?? null
  } catch {
    return null
  }
}

export async function orgUsedBytes(organizationId: string): Promise<number> {
  const result = await prisma.fileNode.aggregate({
    where: { organizationId, trashed: false },
    _sum: { sizeBytes: true },
  })
  return result._sum.sizeBytes ?? 0
}

export async function getPrivateBlob(pathname: string) {
  return get(pathname, { access: "private" })
}

export async function blobMetadata(pathname: string) {
  try {
    return await head(pathname)
  } catch {
    return null
  }
}

export async function deleteBlobs(pathnames: string[]) {
  const owned = pathnames.filter(Boolean)
  if (owned.length === 0) return
  await del(owned)
}
