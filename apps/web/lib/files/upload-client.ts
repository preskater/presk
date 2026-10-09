import type { FileNode } from "./types"

export interface UploadedLargeObject {
  oid: number
  size: number
  sha256: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

function postUpload(
  url: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    xhr.responseType = "json"

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable || event.total === 0) return
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: (event.loaded / event.total) * 100,
        })
      }
    }

    xhr.onload = () => {
      const response = xhr.response as
        | { error?: { message?: string } }
        | null
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(response)
        return
      }
      reject(new Error(response?.error?.message ?? "Upload failed."))
    }
    xhr.onerror = () => reject(new Error("Upload failed."))
    xhr.onabort = () => reject(new Error("Upload cancelled."))

    xhr.send(file)
  })
}

function uploadParams(file: File, extra?: Record<string, string>) {
  const params = new URLSearchParams({ name: file.name })
  if (file.type) params.set("mimeType", file.type)
  for (const [key, value] of Object.entries(extra ?? {})) {
    params.set(key, value)
  }
  return params.toString()
}

/**
 * Stream a file to `/api/files/upload` using the raw request body (no
 * multipart/form-data, so nothing is buffered in memory). Returns the created
 * `FileNode` plus the large-object reference it was stored under.
 */
export async function uploadFile(
  file: File,
  options: {
    parentId: string | null
    onProgress?: (progress: UploadProgress) => void
  }
): Promise<FileNode> {
  const params = uploadParams(file, {
    ...(options.parentId ? { parentId: options.parentId } : {}),
  })
  const response = await postUpload(
    `/api/files/upload?${params}`,
    file,
    options.onProgress
  )
  return response as FileNode
}

/**
 * Upload bytes for a message attachment. The large object is created now and
 * its `oid` is persisted when the message is sent, so the composer does not
 * create a `FileNode` in the workspace.
 */
export async function uploadAttachment(
  file: File,
  options: { onProgress?: (progress: UploadProgress) => void } = {}
): Promise<UploadedLargeObject> {
  const params = uploadParams(file, { transient: "1" })
  const response = await postUpload(
    `/api/files/upload?${params}`,
    file,
    options.onProgress
  )
  return response as UploadedLargeObject
}
