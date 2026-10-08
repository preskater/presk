import { getRequestContext } from "@/lib/core/auth-context"
import { orgChannel, subscribe, type RealtimeEvent } from "@/lib/realtime/pg"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const SCOPES = ["chat", "projects", "calendars", "files"] as const

export async function GET(request: Request) {
  const ctx = await getRequestContext({ request })
  const encoder = new TextEncoder()

  const unsubscribers: Array<() => void> = []
  let heartbeat: ReturnType<typeof setInterval> | undefined

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: string) => {
        try {
          controller.enqueue(encoder.encode(payload))
        } catch {
          // stream already closed
        }
      }

      send(": connected\n\n")

      for (const scope of SCOPES) {
        const unsubscribe = await subscribe(
          orgChannel(ctx.organizationId, scope),
          (event: RealtimeEvent) => {
            send(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`)
          }
        )
        unsubscribers.push(unsubscribe)
      }

      heartbeat = setInterval(() => send(": ping\n\n"), 25000)

      request.signal.addEventListener("abort", () => {
        if (heartbeat) clearInterval(heartbeat)
        for (const unsubscribe of unsubscribers) unsubscribe()
        try {
          controller.close()
        } catch {
          // already closed
        }
      })
    },
    cancel() {
      if (heartbeat) clearInterval(heartbeat)
      for (const unsubscribe of unsubscribers) unsubscribe()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "private, no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
