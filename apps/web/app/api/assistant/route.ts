import { run, type AgentInputItem, type RunStreamEvent } from "@openai/agents"

import { getRequestContext } from "@/lib/core/auth-context"
import { assistantAgent } from "@/lib/assistant/agent"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_TURNS = 8
const STREAM_ERROR_MESSAGE =
  "The assistant could not complete your request. Please try again."

type AssistantEvent =
  | { type: "text"; delta: string }
  | { type: "reasoning"; text: string }
  | { type: "tool_call"; name: string; callId: string; args: string }
  | { type: "tool_output"; name: string; callId: string; output: string }
  | { type: "error"; message: string }
  | { type: "done" }

function toOutputString(output: unknown): string {
  if (typeof output === "string") return output
  try {
    return JSON.stringify(output)
  } catch {
    return String(output)
  }
}

function toClientEvent(event: RunStreamEvent): AssistantEvent | undefined {
  if (event.type === "raw_model_stream_event") {
    if (event.data.type === "output_text_delta") {
      return { type: "text", delta: event.data.delta }
    }
    return undefined
  }

  if (event.type !== "run_item_stream_event") return undefined

  if (event.name === "tool_called") {
    const raw = event.item.rawItem
    if (raw.type !== "function_call") return undefined
    return {
      type: "tool_call",
      name: raw.name,
      callId: raw.callId,
      args: raw.arguments,
    }
  }

  if (event.name === "tool_output") {
    const item = event.item
    if (item.type !== "tool_call_output_item") return undefined
    const raw = item.rawItem
    if (!("name" in raw) || !("callId" in raw)) return undefined
    return {
      type: "tool_output",
      name: raw.name,
      callId: raw.callId,
      output: toOutputString(item.output),
    }
  }

  if (event.name === "reasoning_item_created") {
    const raw = event.item.rawItem
    if (raw.type !== "reasoning") return undefined
    const text = raw.content
      .map((part) => (part.type === "input_text" ? part.text : ""))
      .join("")
    if (!text) return undefined
    return { type: "reasoning", text }
  }

  return undefined
}

export async function POST(request: Request) {
  const ctx = await getRequestContext({ request })
  const { messages }: { messages: AgentInputItem[] } = await request.json()

  const stream = await run(assistantAgent, messages, {
    stream: true,
    context: ctx,
    maxTurns: MAX_TURNS,
  })

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AssistantEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
      }
      try {
        for await (const event of stream) {
          const clientEvent = toClientEvent(event)
          if (clientEvent) send(clientEvent)
        }
        await stream.completed
        send({ type: "done" })
      } catch (error) {
        console.error("[assistant] stream error", error)
        send({ type: "error", message: STREAM_ERROR_MESSAGE })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
