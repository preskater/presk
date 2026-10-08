import { prisma } from "@/lib/prisma"

import { FileRepository } from "./repository"
import { FileService } from "./service"

export const fileRepository = new FileRepository(prisma)
export const fileService = new FileService(fileRepository)

export { FileRepository, FileService }
export * from "./schemas"
export type {
  FileActivity,
  FileKind,
  FileLocation,
  FileNode,
  FilesData,
  FileVersion,
  ShareEntry,
  SharePermission,
  UploadItem,
  UploadStatus,
} from "./types"
