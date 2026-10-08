"use server"

import { revalidatePath } from "next/cache"

import { getRequestContext } from "@/lib/core/auth-context"
import { fileService } from "@/lib/files"
import {
  addShareSchema,
  bulkFileIdsSchema,
  createFilesSchema,
  createFolderSchema,
  moveFileSchema,
  removeShareSchema,
  renameFileSchema,
  updateShareSchema,
} from "@/lib/files/schemas"

export async function listFilesAction() {
  const ctx = await getRequestContext()
  return fileService.list(ctx)
}

export async function createFolderAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createFolderSchema.parse(input)
  const folder = await fileService.createFolder(ctx, parsed)
  revalidatePath("/dashboard/files")
  return folder
}

export async function createFilesAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createFilesSchema.parse(input)
  const files = await fileService.createFiles(ctx, parsed)
  revalidatePath("/dashboard/files")
  return files
}

export async function renameFileAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = renameFileSchema.parse(input)
  const file = await fileService.renameFile(ctx, id, parsed)
  revalidatePath("/dashboard/files")
  return file
}

export async function moveFileAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = moveFileSchema.parse(input)
  const file = await fileService.moveFile(ctx, id, parsed)
  revalidatePath("/dashboard/files")
  return file
}

export async function duplicateFileAction(id: string) {
  const ctx = await getRequestContext()
  const file = await fileService.duplicateFile(ctx, id)
  revalidatePath("/dashboard/files")
  return file
}

export async function toggleStarAction(id: string) {
  const ctx = await getRequestContext()
  const file = await fileService.toggleStar(ctx, id)
  revalidatePath("/dashboard/files")
  return file
}

export async function trashFileAction(id: string) {
  const ctx = await getRequestContext()
  const file = await fileService.trashFile(ctx, id)
  revalidatePath("/dashboard/files")
  return file
}

export async function restoreFileAction(id: string) {
  const ctx = await getRequestContext()
  const file = await fileService.restoreFile(ctx, id)
  revalidatePath("/dashboard/files")
  return file
}

export async function deleteFileAction(id: string) {
  const ctx = await getRequestContext()
  const result = await fileService.deleteForever(ctx, id)
  revalidatePath("/dashboard/files")
  return result
}

export async function bulkTrashAction(input: unknown) {
  const ctx = await getRequestContext()
  const { ids } = bulkFileIdsSchema.parse(input)
  const result = await fileService.moveToTrashMany(ctx, ids)
  revalidatePath("/dashboard/files")
  return result
}

export async function bulkRestoreAction(input: unknown) {
  const ctx = await getRequestContext()
  const { ids } = bulkFileIdsSchema.parse(input)
  const result = await fileService.restoreMany(ctx, ids)
  revalidatePath("/dashboard/files")
  return result
}

export async function bulkDeleteAction(input: unknown) {
  const ctx = await getRequestContext()
  const { ids } = bulkFileIdsSchema.parse(input)
  const result = await fileService.deleteMany(ctx, ids)
  revalidatePath("/dashboard/files")
  return result
}

export async function addShareAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = addShareSchema.parse(input)
  const shares = await fileService.addShare(ctx, id, parsed)
  revalidatePath("/dashboard/files")
  return shares
}

export async function updateShareAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = updateShareSchema.parse(input)
  const shares = await fileService.updateShare(ctx, id, parsed)
  revalidatePath("/dashboard/files")
  return shares
}

export async function removeShareAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = removeShareSchema.parse(input)
  const shares = await fileService.removeShare(ctx, id, parsed)
  revalidatePath("/dashboard/files")
  return shares
}
