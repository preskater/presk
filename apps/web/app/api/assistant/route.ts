import {
  convertToModelMessages,
  isStepCount,
  streamText,
  type UIMessage,
} from "ai"

import { getRequestContext } from "@/lib/core/auth-context"
import { buildTools } from "@/lib/assistant/tools"

export const runtime = "nodejs"
export const maxDuration = 60

const MODEL = process.env.ASSISTANT_MODEL ?? "openai/gpt-4o-mini"

const INSTRUCTIONS = `You are the Presk assistant, embedded in an AI-native productivity workspace.
You can read and modify the user's projects, tasks, calendars, files and messages through tools.
Prefer calling a read tool before making changes. Keep replies concise and action-oriented.
When you create or change something, confirm briefly what you did.
Always finish with a short, self-contained text answer that summarizes the result for the user.`

export async function POST(request: Request) {
  const ctx = await getRequestContext({ request })
  const { messages }: { messages: UIMessage[] } = await request.json()

  const result = streamText({
    model: MODEL,
    instructions: INSTRUCTIONS,
    messages: await convertToModelMessages(messages),
    tools: buildTools(ctx),
    stopWhen: isStepCount(8),
  })

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("[assistant] stream error", error)
      return "The assistant could not complete your request. Please try again."
    },
  })
}
