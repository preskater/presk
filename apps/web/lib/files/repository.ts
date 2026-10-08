import type { PrismaClient } from "@/lib/generated/prisma/client"

export class FileRepository {
  constructor(private readonly db: PrismaClient) {}

  list(organizationId: string) {
    return this.db.fileNode.findMany({
      where: { organizationId },
      include: {
        shares: true,
        versions: { orderBy: { at: "desc" } },
        activities: { orderBy: { at: "desc" } },
      },
      orderBy: { name: "asc" },
    })
  }

  findById(organizationId: string, id: string) {
    return this.db.fileNode.findFirst({
      where: { id, organizationId },
      include: {
        shares: true,
        versions: { orderBy: { at: "desc" } },
        activities: { orderBy: { at: "desc" } },
      },
    })
  }

  create(data: {
    organizationId: string
    name: string
    kind: string
    parentId: string | null
    ownerId: string
    sizeBytes?: number
    mimeType?: string
    storageKey?: string
    checksum?: string
  }) {
    return this.db.fileNode.create({
      data: {
        organizationId: data.organizationId,
        name: data.name,
        kind: data.kind,
        parentId: data.parentId,
        ownerId: data.ownerId,
        sizeBytes: data.sizeBytes,
        mimeType: data.mimeType,
        storageKey: data.storageKey,
        checksum: data.checksum,
      },
      include: {
        shares: true,
        versions: { orderBy: { at: "desc" } },
        activities: { orderBy: { at: "desc" } },
      },
    })
  }

  createMany(
    data: {
      organizationId: string
      name: string
      kind: string
      parentId: string | null
      ownerId: string
      sizeBytes?: number
      mimeType?: string
      storageKey?: string
    }[]
  ) {
    return this.db.$transaction(
      data.map((item) =>
        this.db.fileNode.create({ data: item })
      )
    )
  }

  update(
    id: string,
    data: {
      name?: string
      parentId?: string | null
      starred?: boolean
      trashed?: boolean
      trashedAt?: Date | null
      shared?: boolean
      modifiedAt?: Date
      sizeBytes?: number
      mimeType?: string
      storageKey?: string
      checksum?: string
    }
  ) {
    return this.db.fileNode.update({
      where: { id },
      data,
      include: {
        shares: true,
        versions: { orderBy: { at: "desc" } },
        activities: { orderBy: { at: "desc" } },
      },
    })
  }

  updateMany(
    ids: string[],
    data: {
      trashed?: boolean
      trashedAt?: Date | null
    }
  ) {
    return this.db.fileNode.updateMany({
      where: { id: { in: ids } },
      data,
    })
  }

  delete(id: string) {
    return this.db.fileNode.delete({ where: { id } })
  }

  deleteMany(ids: string[]) {
    return this.db.fileNode.deleteMany({ where: { id: { in: ids } } })
  }

  addActivity(fileId: string, userId: string, action: string) {
    return this.db.fileActivity.create({
      data: { fileId, userId, action },
    })
  }

  addVersion(data: {
    fileId: string
    userId: string
    note: string
    storageKey?: string
    mimeType?: string
    sizeBytes?: number
  }) {
    return this.db.fileVersion.create({ data })
  }

  addShare(fileId: string, userId: string, permission: string) {
    return this.db.fileShare.upsert({
      where: { fileId_userId: { fileId, userId } },
      update: { permission },
      create: { fileId, userId, permission },
    })
  }

  removeShare(fileId: string, userId: string) {
    return this.db.fileShare.deleteMany({ where: { fileId, userId } })
  }
}
