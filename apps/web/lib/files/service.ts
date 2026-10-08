import { ForbiddenError, NotFoundError } from "@/lib/core/errors"
import type { RequestContext } from "@/lib/core/context"

import { kindFromName } from "./file-utils"
import { FileRepository } from "./repository"
import type {
  CreateFilesInput,
  CreateFolderInput,
  MoveFileInput,
  RenameFileInput,
  AddShareInput,
  UpdateShareInput,
  RemoveShareInput,
} from "./schemas"
import type {
  FileActivity,
  FileKind,
  FileNode,
  FileVersion,
  FilesData,
  ShareEntry,
} from "./types"

const ROLE_RANK: Record<string, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
}

function canWrite(ctx: RequestContext) {
  if ((ROLE_RANK[ctx.role] ?? 0) >= 2) return
  throw new ForbiddenError("Your role cannot modify files.", {
    code: "role_cannot_modify_files",
  })
}

type FileRow = Awaited<ReturnType<FileRepository["list"]>>[number]

export class FileService {
  constructor(private readonly repo: FileRepository) {}

  private mapFile(row: FileRow): FileNode {
    return {
      id: row.id,
      name: row.name,
      kind: row.kind as FileKind,
      parentId: row.parentId,
      ownerId: row.ownerId,
      modifiedAt: row.modifiedAt.toISOString(),
      sizeBytes: row.sizeBytes ?? undefined,
      starred: row.starred,
      trashed: row.trashed,
      trashedAt: row.trashedAt?.toISOString(),
      shared: row.shared,
      restricted: row.restricted,
    }
  }

  private mapShares(row: FileRow): ShareEntry[] {
    return row.shares.map((share) => ({
      memberId: share.userId,
      permission: share.permission as ShareEntry["permission"],
    }))
  }

  private mapVersions(row: FileRow): FileVersion[] {
    return row.versions.map((version) => ({
      id: version.id,
      memberId: version.userId,
      at: version.at.toISOString(),
      note: version.note,
    }))
  }

  private mapActivities(row: FileRow): FileActivity[] {
    return row.activities.map((activity) => ({
      id: activity.id,
      memberId: activity.userId,
      action: activity.action,
      at: activity.at.toISOString(),
    }))
  }

  async list(ctx: RequestContext): Promise<FilesData> {
    const rows = await this.repo.list(ctx.organizationId)
    const shares: Record<string, ShareEntry[]> = {}
    const versions: Record<string, FileVersion[]> = {}
    const activities: Record<string, FileActivity[]> = {}
    for (const row of rows) {
      shares[row.id] = this.mapShares(row)
      versions[row.id] = this.mapVersions(row)
      activities[row.id] = this.mapActivities(row)
    }
    return {
      files: rows.map((row) => this.mapFile(row)),
      shares,
      versions,
      activities,
    }
  }

  async get(ctx: RequestContext, id: string): Promise<FileNode> {
    const row = await this.repo.findById(ctx.organizationId, id)
    if (!row) throw new NotFoundError("File")
    return this.mapFile(row)
  }

  async createFolder(
    ctx: RequestContext,
    input: CreateFolderInput
  ): Promise<FileNode> {
    canWrite(ctx)
    const row = await this.repo.create({
      organizationId: ctx.organizationId,
      name: input.name.trim(),
      kind: "folder",
      parentId: input.parentId ?? null,
      ownerId: ctx.userId,
    })
    return this.mapFile(row)
  }

  async createFiles(
    ctx: RequestContext,
    input: CreateFilesInput
  ): Promise<FileNode[]> {
    canWrite(ctx)
    const rows = await this.repo.createMany(
      input.files.map((file) => ({
        organizationId: ctx.organizationId,
        name: file.name,
        kind: kindFromName(file.name),
        parentId: input.parentId ?? null,
        ownerId: ctx.userId,
        sizeBytes: file.sizeBytes,
      }))
    )
    return rows.map((row) => this.mapFile(row as FileRow))
  }

  private async require(
    ctx: RequestContext,
    id: string
  ): Promise<NonNullable<Awaited<ReturnType<FileRepository["findById"]>>>> {
    const row = await this.repo.findById(ctx.organizationId, id)
    if (!row) throw new NotFoundError("File")
    return row
  }

  async renameFile(
    ctx: RequestContext,
    id: string,
    input: RenameFileInput
  ): Promise<FileNode> {
    canWrite(ctx)
    await this.require(ctx, id)
    const row = await this.repo.update(id, {
      name: input.name.trim(),
      modifiedAt: new Date(),
    })
    await this.repo.addActivity(id, ctx.userId, "renamedThisFile")
    return this.mapFile(row)
  }

  async moveFile(
    ctx: RequestContext,
    id: string,
    input: MoveFileInput
  ): Promise<FileNode> {
    canWrite(ctx)
    await this.require(ctx, id)
    const row = await this.repo.update(id, {
      parentId: input.parentId,
      modifiedAt: new Date(),
    })
    return this.mapFile(row)
  }

  async duplicateFile(ctx: RequestContext, id: string): Promise<FileNode> {
    canWrite(ctx)
    const source = await this.require(ctx, id)
    const dotIndex = source.name.lastIndexOf(".")
    const copyName =
      dotIndex > 0
        ? `${source.name.slice(0, dotIndex)} (copy)${source.name.slice(dotIndex)}`
        : `${source.name} (copy)`
    const row = await this.repo.create({
      organizationId: ctx.organizationId,
      name: copyName,
      kind: source.kind,
      parentId: source.parentId,
      ownerId: ctx.userId,
      sizeBytes: source.sizeBytes ?? undefined,
    })
    return this.mapFile(row)
  }

  async toggleStar(ctx: RequestContext, id: string): Promise<FileNode> {
    const existing = await this.require(ctx, id)
    const row = await this.repo.update(id, { starred: !existing.starred })
    return this.mapFile(row)
  }

  async trashFile(ctx: RequestContext, id: string): Promise<FileNode> {
    canWrite(ctx)
    await this.require(ctx, id)
    const row = await this.repo.update(id, {
      trashed: true,
      trashedAt: new Date(),
    })
    await this.repo.addActivity(id, ctx.userId, "movedThisFileToTrash")
    return this.mapFile(row)
  }

  async restoreFile(ctx: RequestContext, id: string): Promise<FileNode> {
    canWrite(ctx)
    await this.require(ctx, id)
    const row = await this.repo.update(id, {
      trashed: false,
      trashedAt: null,
    })
    return this.mapFile(row)
  }

  async deleteForever(ctx: RequestContext, id: string): Promise<{ id: string }> {
    canWrite(ctx)
    await this.require(ctx, id)
    await this.repo.delete(id)
    return { id }
  }

  async moveToTrashMany(
    ctx: RequestContext,
    ids: string[]
  ): Promise<{ count: number }> {
    canWrite(ctx)
    const result = await this.repo.updateMany(ids, {
      trashed: true,
      trashedAt: new Date(),
    })
    return { count: result.count }
  }

  async restoreMany(
    ctx: RequestContext,
    ids: string[]
  ): Promise<{ count: number }> {
    canWrite(ctx)
    const result = await this.repo.updateMany(ids, {
      trashed: false,
      trashedAt: null,
    })
    return { count: result.count }
  }

  async deleteMany(
    ctx: RequestContext,
    ids: string[]
  ): Promise<{ count: number }> {
    canWrite(ctx)
    const result = await this.repo.deleteMany(ids)
    return { count: result.count }
  }

  async sharesFor(ctx: RequestContext, id: string): Promise<ShareEntry[]> {
    const row = await this.require(ctx, id)
    return this.mapShares(row)
  }

  async addShare(
    ctx: RequestContext,
    id: string,
    input: AddShareInput
  ): Promise<ShareEntry[]> {
    canWrite(ctx)
    await this.require(ctx, id)
    await this.repo.addShare(id, input.memberId, input.permission)
    await this.repo.update(id, { shared: true })
    const row = await this.require(ctx, id)
    return this.mapShares(row)
  }

  async updateShare(
    ctx: RequestContext,
    id: string,
    input: UpdateShareInput
  ): Promise<ShareEntry[]> {
    canWrite(ctx)
    await this.require(ctx, id)
    await this.repo.addShare(id, input.memberId, input.permission)
    const row = await this.require(ctx, id)
    return this.mapShares(row)
  }

  async removeShare(
    ctx: RequestContext,
    id: string,
    input: RemoveShareInput
  ): Promise<ShareEntry[]> {
    canWrite(ctx)
    await this.require(ctx, id)
    await this.repo.removeShare(id, input.memberId)
    const row = await this.require(ctx, id)
    return this.mapShares(row)
  }
}
