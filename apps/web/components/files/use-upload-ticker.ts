"use client"

import * as React from "react"

import { useFiles } from "@/lib/files/store"

export function useUploadTicker() {
  const { uploads, advanceUploads } = useFiles()
  const active = uploads.some(
    (item) => item.status === "queued" || item.status === "uploading"
  )

  React.useEffect(() => {
    if (!active) return
    const interval = window.setInterval(() => {
      advanceUploads()
    }, 500)
    return () => window.clearInterval(interval)
  }, [active, advanceUploads])

  return { uploads }
}
