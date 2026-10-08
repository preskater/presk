import { Client } from "pg"

export type RealtimeEventType =
  | "message.created"
  | "message.updated"
  | "message.deleted"
  | "conversation.updated"
  | "typing"
  | "presence"
  | "project.changed"
  | "calendar.changed"
  | "file.changed"

export interface RealtimeEvent {
  type: RealtimeEventType
  orgId: string
  at: string
  data: Record<string, unknown>
}

export function orgChannel(
  orgId: string,
  scope: "chat" | "projects" | "calendars" | "files"
) {
  return `org:${orgId}:${scope}`
}

type Handler = (event: RealtimeEvent) => void

interface ListenerState {
  client: Client
  handlers: Map<string, Set<Handler>>
  connecting: Promise<void> | null
  connected: boolean
  queue: Promise<unknown>
}

const globalForRealtime = globalThis as unknown as {
  __preskRealtime?: ListenerState
}

function run<T>(state: ListenerState, fn: () => Promise<T>): Promise<T> {
  const next = state.queue.then(fn, fn)
  state.queue = next.catch(() => {})
  return next
}

function dispatch(state: ListenerState, channel: string, payload?: string) {
  if (!payload) return
  const handlers = state.handlers.get(channel)
  if (!handlers || handlers.size === 0) return
  let event: RealtimeEvent
  try {
    event = JSON.parse(payload) as RealtimeEvent
  } catch {
    return
  }
  for (const handler of handlers) handler(event)
}

function attach(state: ListenerState) {
  state.client.on("notification", (message) => {
    if (!message.channel) return
    dispatch(state, message.channel, message.payload)
  })
  state.client.on("error", (error) => {
    console.error("[realtime] pg listener error", error)
    state.connecting = null
    state.connected = false
  })
  state.client.on("end", () => {
    state.connecting = null
    state.connected = false
  })
}

function createState(): ListenerState {
  const state: ListenerState = {
    client: new Client({ connectionString: process.env.DATABASE_URL }),
    handlers: new Map(),
    connecting: null,
    connected: false,
    queue: Promise.resolve(),
  }
  attach(state)
  return state
}

function getState(): ListenerState {
  if (!globalForRealtime.__preskRealtime) {
    globalForRealtime.__preskRealtime = createState()
  }
  return globalForRealtime.__preskRealtime
}

async function ensureConnected(state: ListenerState) {
  if (state.connected) return
  if (!state.connecting) {
    state.connecting = state.client
      .connect()
      .then(async () => {
        state.connected = true
        for (const channel of state.handlers.keys()) {
          await state.client.query(`LISTEN "${channel}"`)
        }
      })
      .catch((error) => {
        state.connecting = null
        state.connected = false
        throw error
      })
  }
  await state.connecting
}

export async function subscribe(
  channel: string,
  handler: Handler
): Promise<() => void> {
  const state = getState()
  await ensureConnected(state)
  let handlers = state.handlers.get(channel)
  const isNew = !handlers
  if (!handlers) {
    handlers = new Set()
    state.handlers.set(channel, handlers)
  }
  handlers.add(handler)
  if (isNew) {
    await run(state, () => state.client.query(`LISTEN "${channel}"`))
  }
  return () => {
    const current = state.handlers.get(channel)
    if (!current) return
    current.delete(handler)
    if (current.size === 0) {
      state.handlers.delete(channel)
      void run(state, () => state.client.query(`UNLISTEN "${channel}"`)).catch(
        () => {}
      )
    }
  }
}

export async function publish(
  channel: string,
  event: RealtimeEvent
): Promise<void> {
  const payload = JSON.stringify(event)
  if (payload.length > 7000) {
    console.warn("[realtime] payload too large, dropping", event.type)
    return
  }
  const state = getState()
  try {
    await ensureConnected(state)
    await run(state, () =>
      state.client.query("SELECT pg_notify($1, $2)", [channel, payload])
    )
  } catch (error) {
    console.error("[realtime] publish failed", error)
  }
}

export function startRealtimeListener(): void {
  const state = getState()
  void ensureConnected(state).catch((error) => {
    console.error("[realtime] initial connect failed", error)
  })
}
