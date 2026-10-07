"use client"

import * as React from "react"
import { toast } from "sonner"

import type { Member } from "@/lib/projects/types"

import { filesData as seedData, members as seedMembers } from "./mock-data"
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
  createFolder: (parentId: string | null, name: string) => FileNode
  createFiles: (parentId: string | null, files: { name: string; sizeBytes: number }[]) => void
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
  setPermission: (id: string, memberId: string, permission: SharePermission) => void
  removeShare: (id: string, memberId: string) => void
  enqueueUploads: (items: { name: string; sizeBytes: number }[], parentId: string | null) => void
  advanceUploads: () => void
  removeUpload: (id: string) => void
  clearCompletedUploads: () => void
  reset: () => void
}

const FilesContext = React.createContext<FilesStore | null>(null)

export function FilesProvider({
  children,
  initialData = seedData,
}: {
  children: React.ReactNode
  initialData?: FilesData
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

  const members = seedMembers
  const currentUserId = members[0]?.id ?? "u_aria"

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
          { id: uid("t"), memberId: currentUserId, action, at: new Date().toISOString() },
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
        const folder: FileNode = {
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
        setFiles((prev) => [...prev, folder])
        toast.success(`Folder “${folder.name}” created.`)
        return folder
      },
      createFiles: (parentId, items) => {
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
        toast.success(
          `${created.length} file${created.length === 1 ? "" : "s"} uploaded.`
        )
      },
      renameFile: (id, name) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? { ...file, name: name.trim(), modifiedAt: new Date().toISOString() }
              : file
          )
        )
        logActivity(id, "renamed this file")
        toast.success("File renamed.")
      },
      moveFile: (id, parentId) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id
              ? { ...file, parentId, modifiedAt: new Date().toISOString() }
              : file
          )
        )
        toast.success("File moved.")
      },
      duplicateFile: (id) => {
        const source = getFile(id)
        if (!source) return
        const dotIndex = source.name.lastIndexOf(".")
        const copyName =
          dotIndex > 0
            ? `${source.name.slice(0, dotIndex)} (copy)${source.name.slice(dotIndex)}`
            : `${source.name} (copy)`
        setFiles((prev) => [
          ...prev,
          {
            ...source,
            id: uid("file"),
            name: copyName,
            ownerId: currentUserId,
            modifiedAt: new Date().toISOString(),
            starred: false,
            trashed: false,
          },
        ])
        toast.success("Duplicate created.")
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
        toast.success(starred ? "Added to favorites." : "Removed from favorites.")
      },
      trashFile: (id) => {
        trashIds([id])
        logActivity(id, "moved this file to trash")
        toast.success("Moved to trash.")
      },
      restoreFile: (id) => {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, trashed: false, trashedAt: undefined } : file
          )
        )
        toast.success("File restored.")
      },
      deleteForever: (id) => {
        setFiles((prev) => prev.filter((file) => file.id !== id))
        toast.success("File permanently deleted.")
      },
      moveToTrashMany: (ids) => {
        trashIds(ids)
        toast.success(`${ids.length} item${ids.length === 1 ? "" : "s"} moved to trash.`)
      },
      restoreMany: (ids) => {
        const set = new Set(ids)
        setFiles((prev) =>
          prev.map((file) =>
            set.has(file.id) ? { ...file, trashed: false, trashedAt: undefined } : file
          )
        )
        toast.success(`${ids.length} item${ids.length === 1 ? "" : "s"} restored.`)
      },
      deleteMany: (ids) => {
        const set = new Set(ids)
        setFiles((prev) => prev.filter((file) => !set.has(file.id)))
        toast.success(`${ids.length} item${ids.length === 1 ? "" : "s"} deleted.`)
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
      },
      setPermission: (id, memberId, permission) => {
        setShares((prev) => ({
          ...prev,
          [id]: (prev[id] ?? []).map((entry) =>
            entry.memberId === memberId ? { ...entry, permission } : entry
          ),
        }))
        toast.success("Permission updated.")
      },
      removeShare: (id, memberId) => {
        setShares((prev) => ({
          ...prev,
          [id]: (prev[id] ?? []).filter((entry) => entry.memberId !== memberId),
        }))
        toast.success("Access removed.")
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
          const created = items.map((item) => ({ name: item.name, sizeBytes: item.sizeBytes }))
          setFiles((prev) => [
            ...prev,
            ...created.map((item) => ({
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
            })),
          ])
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
      reset: () => {
        setFiles(seedData.files)
        setShares(seedData.shares)
        setVersions(seedData.versions)
        setActivities(seedData.activities)
        setUploads([])
        toast.success("Sample files restored.")
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
