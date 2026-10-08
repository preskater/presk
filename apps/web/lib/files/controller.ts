import { getRequestContext } from "@/lib/core/auth-context"
import { readJson } from "@/lib/core/validation"

import { fileService } from "./index"
import {
  addShareSchema,
  bulkFileIdsSchema,
  createFilesSchema,
  createFolderSchema,
  moveFileSchema,
  removeShareSchema,
  renameFileSchema,
  updateShareSchema,
} from "./schemas"

export async function listFiles(request: Request) {
  const ctx = await getRequestContext({ request })
  return fileService.list(ctx)
}

export async function createFolder(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = createFolderSchema.parse(await readJson(request))
  return fileService.createFolder(ctx, input)
}

export async function createFiles(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = createFilesSchema.parse(await readJson(request))
  return fileService.createFiles(ctx, input)
}

export async function getFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.get(ctx, fileId)
}

export async function renameFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  const input = renameFileSchema.parse(await readJson(request))
  return fileService.renameFile(ctx, fileId, input)
}

export async function moveFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  const input = moveFileSchema.parse(await readJson(request))
  return fileService.moveFile(ctx, fileId, input)
}

export async function duplicateFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.duplicateFile(ctx, fileId)
}

export async function toggleStar(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.toggleStar(ctx, fileId)
}

export async function trashFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.trashFile(ctx, fileId)
}

export async function restoreFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.restoreFile(ctx, fileId)
}

export async function deleteFile(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.deleteForever(ctx, fileId)
}

export async function bulkTrash(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = bulkFileIdsSchema.parse(await readJson(request))
  return fileService.moveToTrashMany(ctx, input.ids)
}

export async function bulkRestore(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = bulkFileIdsSchema.parse(await readJson(request))
  return fileService.restoreMany(ctx, input.ids)
}

export async function bulkDelete(request: Request) {
  const ctx = await getRequestContext({ request })
  const input = bulkFileIdsSchema.parse(await readJson(request))
  return fileService.deleteMany(ctx, input.ids)
}

export async function listShares(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  return fileService.sharesFor(ctx, fileId)
}

export async function addShare(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  const input = addShareSchema.parse(await readJson(request))
  return fileService.addShare(ctx, fileId, input)
}

export async function updateShare(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  const input = updateShareSchema.parse(await readJson(request))
  return fileService.updateShare(ctx, fileId, input)
}

export async function removeShare(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const ctx = await getRequestContext({ request })
  const { fileId } = await params
  const input = removeShareSchema.parse(await readJson(request))
  return fileService.removeShare(ctx, fileId, input)
}
