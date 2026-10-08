"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  addShareAction,
  bulkDeleteAction,
  bulkRestoreAction,
  bulkTrashAction,
  createFilesAction,
  createFolderAction,
  deleteFileAction,
  duplicateFileAction,
  moveFileAction,
  removeShareAction,
  renameFileAction,
  restoreFileAction,
  toggleStarAction,
  trashFileAction,
  updateShareAction,
} from "@/actions/files"
import { unwrapActionResult } from "@/lib/core/action"
import type { Member } from "@/lib/projects/types"

import { kindFromName } from "./file-utils"
import type {
  FileLocation,
  FileNode,
  FilesData,
  ShareEntry,
  SharePermission,
  UploadItem,
} from "./types"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

interface FilesStore extends FilesData {
  members: Member[]
  currentUserId: string
  uploads: UploadItem[]
  getMember: (id?: string) => Member | undefined
  getFile: (id?: string) => FileNode | undefined
  breadcrumbFor: (folderId: string | null) => FileNode[]
  childrenOf: (
    location: FileLocation,
    folderId: string | null,
    query?: string
  ) => FileNode[]
  sharesFor: (id: string) => ShareEntry[]
  locationCounts: Record<FileLocation, number>
  createFolder: (parentId: string | null, name: string) => void
  createFiles: (
    parentId: string | null,
    files: { name: string; sizeBytes: number }[]
  ) => void
  renameFile: (id: string, name: string) => void
  moveFile: (id: string, parentId: string | null) => void
  duplicateFile: (id: string) => void
  toggleStar: (id: string) => void
  trashFile: (id: string) => void
  restoreFile: (id: string) => void
  deleteForever: (id: string) => void
  moveToTrashMany: (ids: string[]) => void
  restoreMany: (ids: string[]) => void
  deleteMany: (ids: string[]) => void
  addShare: (id: string, memberId: string, permission: SharePermission) => void
  setPermission: (
    id: string,
    memberId: string,
    permission: SharePermission
  ) => void
  removeShare: (id: string, memberId: string) => void
  enqueueUploads: (
    items: { name: string; sizeBytes: number }[],
    parentId: string | null
  ) => void
  advanceUploads: () => void
  removeUpload: (id: string) => void
  clearCompletedUploads: () => void
}

const FilesContext = React.createContext<FilesStore | null>(null)

export function FilesProvider({
  children,
  initialData,
  currentUserId,
  members = [],
}: {
  children: React.ReactNode
  initialData: FilesData
  currentUserId: string
  members?: Member[]
}) {
  const [files, setFiles] = React.useState<FileNode[]>(initialData.files)
  const [shares, setShares] = React.useState<Record<string, ShareEntry[]>>(
    initialData.shares
  )
  const [versions, setVersions] =
    React.useState<Record<string, FilesData["versions"][string]>>(
      initialData.versions
    )
  const [activities, setActivities] =
    React.useState<Record<string, FilesData["activities"][string]>>(
      initialData.activities
    )
  const [uploads, setUploads] = React.useState<UploadItem[]>([])

  React.useEffect(() => {
    setFiles(initialData.files)
    setShares(initialData.shares)
    setVersions(initialData.versions)
    setActivities(initialData.activities)
  }, [initialData])

  const store = React.useMemo<FilesStore>(() => {
    const getMember = (id?: string) =>
      id ? members.find((member) => member.id === id) : undefined
    const getFile = (id?: string) =>
      id ? files.find((file) => file.id === id) : undefined

    const breadcrumbFor = (folderId: string | null) => {
      const trail: FileNode[] = []
      let current = folderId ? getFile(folderId) : undefined
      while (current) {
        trail.unshift(current)
        current = current.parentId ? getFile(current.parentId) : undefined
      }
      return trail
    }

    const matches = (file: FileNode, query: string) =>
      !query || file.name.toLowerCase().includes(query.toLowerCase())

    const childrenOf = (
      location: FileLocation,
      folderId: string | null,
      query = ""
    ) => {
      let list: FileNode[]
      if (location === "trash") {
        list = files.filter((file) => file.trashed)
      } else if (location === "favorites") {
        list = files.filter(
          (file) => !file.trashed && file.starred && file.kind !== "folder"
        )
      } else if (location === "shared") {
        list = files.filter(
          (file) =>
            !file.trashed &&
            file.kind !== "folder" &&
            (file.ownerId !== currentUserId || file.shared)
        )
      } else if (location === "recent") {
        list = files
          .filter((file) => !file.trashed && file.kind !== "folder")
          .sort(
            (a, b) =>
              new Date(b.modifiedAt).getTime() -
              new Date(a.modifiedAt).getTime()
          )
      } else {
        list = files.filter(
          (file) => !file.trashed && file.parentId === folderId
        )
      }
      return list
        .filter((file) => matches(file, query))
        .sort((a, b) => {
          if (a.kind === "folder" && b.kind !== "folder") return -1
          if (b.kind === "folder" && a.kind !== "folder") return 1
          return a.name.localeCompare(b.name)
        })
    }

    const locationCounts: Record<FileLocation, number> = {
      "my-files": files.filter((file) => !file.trashed && file.kind !== "folder")
        .length,
      shared: files.filter(
        (file) =>
          !file.trashed &&
          file.kind !== "folder" &&
          (file.ownerId !== currentUserId || file.shared)
      ).length,
      recent: files.filter((file) => !file.trashed && file.kind !== "folder")
        .length,
      favorites: files.filter(
        (file) => !file.trashed && file.starred && file.kind !== "folder"
      ).length,
      trash: files.filter((file) => file.trashed).length,
    }

    function logActivity(id: string, action: string) {
      setActivities((prev) => ({
        ...prev,
        [id]: [
          {
            id: uid("t"),
            memberId: currentUserId,
            action,
            at: new Date().toISOString(),
          },
          ...(prev[id] ?? []),
        ],
      }))
    }

    function trashIds(ids: string[]) {
      const set = new Set(ids)
      setFiles((prev) =>
        prev.map((file) =>
          set.has(file.id)
            ? { ...file, trashed: true, trashedAt: new Date().toISOString() }
            : file
        )
      )
    }

    function createFiles(
      parentId: string | null,
      items: { name: string; sizeBytes: number }[]
    ) {
      const created: FileNode[] = items.map((item) => ({
        id: uid("file"),
        name: item.name,
        kind: kindFromName(item.name),
        parentId,
        ownerId: currentUserId,
        modifiedAt: new Date().toISOString(),
        sizeBytes: item.sizeBytes,
        starred: false,
        trashed: false,
        shared: false,
        restricted: false,
      }))
      setFiles((prev) => [...prev, ...created])
      void createFilesAction({ parentId, files: items })
        .then((result) => {
          const files = unwrapActionResult(result)
          setFiles((prev) => {
            const byName = new Map(files.map((file) => [file.name, file]))
            return prev.map((file) => {
              const match = created.find((item) => item.id === file.id)
              return match ? (byName.get(match.name) ?? file) : file
            })
          })
          toast.success(
            `${created.length} file${created.length === 1 ? "" : "s"} uploaded.`
          )
        })
        .catch((error) => {
          const ids = new Set(created.map((file) => file.id))
          setFiles((prev) => prev.filter((file) => !ids.has(file.id)))
          toast.error(error.message ?? "Upload failed.")
        })
    }

    return {
      files,
      shares,
      versions,
      activities,
      members,
      uploads,
      currentUserId,
      getMember,
      getFile,
      breadcrumbFor,
      childrenOf,
      sharesFor: (id) => shares[id] ?? [],
      locationCounts,
      createFolder: (parentId, name) => {
        const optimistic: FileNode = {
          id: uid("folder"),
          name: name.trim(),
          kind: "folder",
          parentId,
          ownerId: currentUserId,
          modifiedAt: new Date().toISOString(),
          starred: false,
          trashed: false,
          shared: false,
          restricted: false,
        }
        setFiles((prev) => [...prev, optimistic])
        void createFolderAction({ parentId, name })
          .then((result) => {
            const folder = unwrapActionResult(result)
            setFiles((prev) =>
              prev.map((item) => (item.id === optimistic.id ? folder : item))
            )
            toast.success(`Folder “${folder.name}” created.`)
          })
          .catch((error) => {
            setFiles((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Could not create folder.")
          })
      },
      createFiles,
      renameFile: (id, name) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? {
                  ...file,
                  name: name.trim(),
                  modifiedAt: new Date().toISOString(),
                }
              : file
          )
        )
        logActivity(id, "renamed this file")
        void renameFileAction(id, { name })
          .then((result) => {
            unwrapActionResult(result)
            toast.success("File renamed.")
          })
          .catch((error) => toast.error(error.message ?? "Rename failed."))
      },
      moveFile: (id, parentId) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? { ...file, parentId, modifiedAt: new Date().toISOString() }
              : file
          )
        )
        void moveFileAction(id, { parentId })
          .then((result) => {
            unwrapActionResult(result)
            toast.success("File moved.")
          })
          .catch((error) => toast.error(error.message ?? "Move failed."))
      },
      duplicateFile: (id) => {
        const source = getFile(id)
        if (!source) return
        const dotIndex = source.name.lastIndexOf(".")
        const copyName =
          dotIndex > 0
            ? `${source.name.slice(0, dotIndex)} (copy)${source.name.slice(dotIndex)}`
            : `${source.name} (copy)`
        const optimistic: FileNode = {
          ...source,
          id: uid("file"),
          name: copyName,
          ownerId: currentUserId,
          modifiedAt: new Date().toISOString(),
          starred: false,
          trashed: false,
        }
        setFiles((prev) => [...prev, optimistic])
        void duplicateFileAction(id)
          .then((result) => {
            const file = unwrapActionResult(result)
            setFiles((prev) =>
              prev.map((item) => (item.id === optimistic.id ? file : item))
            )
            toast.success("Duplicate created.")
          })
          .catch((error) => {
            setFiles((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Duplicate failed.")
          })
      },
      toggleStar: (id) => {
        let starred = false
        setFiles((prev) =>
          prev.map((file) => {
            if (file.id !== id) return file
            starred = !file.starred
            return { ...file, starred }
          })
        )
        void toggleStarAction(id)
          .then((result) => {
            unwrapActionResult(result)
            toast.success(
              starred ? "Added to favorites." : "Removed from favorites."
            )
          })
          .catch((error) => toast.error(error.message ?? "Update failed."))
      },
      trashFile: (id) => {
        trashIds([id])
        logActivity(id, "moved this file to trash")
        void trashFileAction(id)
          .then((result) => {
            unwrapActionResult(result)
            toast.success("Moved to trash.")
          })
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      restoreFile: (id) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? { ...file, trashed: false, trashedAt: undefined }
              : file
          )
        )
        void restoreFileAction(id)
          .then((result) => {
            unwrapActionResult(result)
            toast.success("File restored.")
          })
          .catch((error) => toast.error(error.message ?? "Restore failed."))
      },
      deleteForever: (id) => {
        setFiles((prev) => prev.filter((file) => file.id !== id))
        void deleteFileAction(id)
          .then((result) => {
            unwrapActionResult(result)
            toast.success("File permanently deleted.")
          })
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      moveToTrashMany: (ids) => {
        trashIds(ids)
        void bulkTrashAction({ ids })
          .then((result) => {
            unwrapActionResult(result)
            toast.success(
              `${ids.length} item${ids.length === 1 ? "" : "s"} moved to trash.`
            )
          })
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      restoreMany: (ids) => {
        const set = new Set(ids)
        setFiles((prev) =>
          prev.map((file) =>
            set.has(file.id)
              ? { ...file, trashed: false, trashedAt: undefined }
              : file
          )
        )
        void bulkRestoreAction({ ids })
          .then((result) => {
            unwrapActionResult(result)
            toast.success(
              `${ids.length} item${ids.length === 1 ? "" : "s"} restored.`
            )
          })
          .catch((error) => toast.error(error.message ?? "Restore failed."))
      },
      deleteMany: (ids) => {
        const set = new Set(ids)
        setFiles((prev) => prev.filter((file) => !set.has(file.id)))
        void bulkDeleteAction({ ids })
          .then((result) => {
            unwrapActionResult(result)
            toast.success(
              `${ids.length} item${ids.length === 1 ? "" : "s"} deleted.`
            )
          })
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      addShare: (id, memberId, permission) => {
        setShares((prev) => {
          const existing = prev[id] ?? []
          if (existing.some((entry) => entry.memberId === memberId)) {
            return prev
          }
          return { ...prev, [id]: [...existing, { memberId, permission }] }
        })
        setFiles((prev) =>
          prev.map((file) => (file.id === id ? { ...file, shared: true } : file))
        )
        void addShareAction(id, { memberId, permission })
          .then((result) => unwrapActionResult(result))
          .catch((error) => toast.error(error.message ?? "Share failed."))
      },
      setPermission: (id, memberId, permission) => {
        setShares((prev) => ({
          ...prev,
          [id]: (prev[id] ?? []).map((entry) =>
            entry.memberId === memberId ? { ...entry, permission } : entry
          ),
        }))
        void updateShareAction(id, { memberId, permission })
          .then((result) => {
            unwrapActionResult(result)
            toast.success("Permission updated.")
          })
          .catch((error) => toast.error(error.message ?? "Update failed."))
      },
      removeShare: (id, memberId) => {
        setShares((prev) => ({
          ...prev,
          [id]: (prev[id] ?? []).filter((entry) => entry.memberId !== memberId),
        }))
        void removeShareAction(id, { memberId })
          .then((result) => {
            unwrapActionResult(result)
            toast.success("Access removed.")
          })
          .catch((error) => toast.error(error.message ?? "Remove failed."))
      },
      enqueueUploads: (items, parentId) => {
        const queued: UploadItem[] = items.map((item) => ({
          id: uid("upload"),
          name: item.name,
          sizeBytes: item.sizeBytes,
          progress: 0,
          status: "queued",
        }))
        setUploads((prev) => [...prev, ...queued])
        window.setTimeout(() => {
          createFiles(parentId, items)
        }, 1600)
      },
      advanceUploads: () => {
        setUploads((prev) =>
          prev.map((item) => {
            if (item.status === "done" || item.status === "error") return item
            const next = Math.min(100, item.progress + 12 + Math.random() * 18)
            if (next >= 100) return { ...item, progress: 100, status: "done" }
            return { ...item, progress: next, status: "uploading" }
          })
        )
      },
      removeUpload: (id) => {
        setUploads((prev) => prev.filter((item) => item.id !== id))
      },
      clearCompletedUploads: () => {
        setUploads((prev) => prev.filter((item) => item.status !== "done"))
      },
    }
  }, [files, shares, versions, activities, uploads, members, currentUserId])

  return <FilesContext.Provider value={store}>{children}</FilesContext.Provider>
}

export function useFiles() {
  const context = React.useContext(FilesContext)
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider")
  }
  return context
}
