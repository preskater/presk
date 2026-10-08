import { DefaultChatTransport } from "ai"

export const assistantTransport = new DefaultChatTransport({
  api: "/api/assistant",
})

export const assistantInitialMessages: never[] = []
