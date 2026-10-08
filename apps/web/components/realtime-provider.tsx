"use client"

import * as React from "react"

import { useRouter } from "@/i18n/navigation"
import { touchPresenceAction } from "@/actions/messaging"
import { emitRealtime, onRealtime } from "@/lib/realtime/bus"
import type { RealtimeEvent, RealtimeEventType } from "@/lib/realtime/pg"

const ALL_EVENTS: RealtimeEventType[] = [
  "message.created",
  "message.updated",
  "message.deleted",
  "conversation.updated",
  "typing",
  "presence",
  "project.changed",
  "calendar.changed",
  "file.changed",
]

const SERVER_EVENTS = new Set<RealtimeEventType>([
  "message.created",
  "message.updated",
  "message.deleted",
  "conversation.updated",
  "project.changed",
  "calendar.changed",
  "file.changed",
])

export function RealtimeProvider({
  organizationId,
  children,
}: {
  organizationId: string
  children: React.ReactNode
}) {
  const router = useRouter()

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = onRealtime((event: RealtimeEvent) => {
      if (!SERVER_EVENTS.has(event.type)) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => router.refresh(), 300)
    })
    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [router])

  React.useEffect(() => {
    const ping = () => {
      void touchPresenceAction()
    }
    ping()
    const interval = setInterval(ping, 60000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const source = new EventSource(
      `/api/realtime/stream?org=${encodeURIComponent(organizationId)}`
    )

    const handlers: Array<[string, (event: MessageEvent) => void]> = []
    for (const type of ALL_EVENTS) {
      const handler = (message: MessageEvent) => {
        try {
          emitRealtime(JSON.parse(message.data) as RealtimeEvent)
        } catch {
          // ignore malformed events
        }
      }
      source.addEventListener(type, handler)
      handlers.push([type, handler])
    }

    return () => {
      for (const [type, handler] of handlers) {
        source.removeEventListener(type, handler)
      }
      source.close()
    }
  }, [organizationId])

  return <>{children}</>
}
