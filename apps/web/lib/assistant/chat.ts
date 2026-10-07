import { createChat } from "@shadcn/helpers/ai-sdk"

import { replyFor, suggestions } from "./suggestions"

const [catchUp, planDay, summarize, draft] = suggestions

function scripted(reply: string) {
  return ({ writer }: { writer: { reasoning: (text: string) => void; text: (text: string) => void } }) => {
    writer.reasoning("Reviewing your workspace and recent activity…")
    writer.text(reply)
  }
}

export const assistantChat = createChat()
  .user(catchUp?.prompt ?? "Catch me up on my workspace")
  .assistant(scripted(replyFor(catchUp?.prompt ?? "catch me up")))
  .user(planDay?.prompt ?? "Help me plan my day")
  .assistant(scripted(replyFor(planDay?.prompt ?? "plan my day")))
  .user(summarize?.prompt ?? "Summarize the Website Redesign project")
  .assistant(scripted(replyFor(summarize?.prompt ?? "summarize project")))
  .user(draft?.prompt ?? "Draft a message to the engineering channel")
  .assistant(scripted(replyFor(draft?.prompt ?? "draft a message")))

export const assistantTransport = assistantChat.transport({
  delayMs: 18,
  fallback: ({ writer, messages }) => {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.role === "user")
    const text =
      lastUser?.parts
        .filter((part) => part.type === "text")
        .map((part) => ("text" in part ? part.text : ""))
        .join(" ") ?? ""
    writer.reasoning("Thinking about your request…")
    writer.text(replyFor(text))
  },
})

export const assistantInitialMessages = assistantChat.get(0)
