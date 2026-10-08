"use client"

import type { RealtimeEvent } from "@/lib/realtime/pg"

type Listener = (event: RealtimeEvent) => void

const globalForBus = globalThis as unknown as {
  __preskRealtimeBus?: Set<Listener>
}

function listeners(): Set<Listener> {
  if (!globalForBus.__preskRealtimeBus) {
    globalForBus.__preskRealtimeBus = new Set()
  }
  return globalForBus.__preskRealtimeBus
}

export function emitRealtime(event: RealtimeEvent) {
  for (const listener of listeners()) listener(event)
}

export function onRealtime(listener: Listener): () => void {
  listeners().add(listener)
  return () => {
    listeners().delete(listener)
  }
}
