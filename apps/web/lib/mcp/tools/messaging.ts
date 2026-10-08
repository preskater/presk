import { z } from "zod"

import type { RequestContext } from "@/lib/core/context"
import { messagingService } from "@/lib/messaging"
import {
  createChannelSchema,
  sendMessageSchema,
} from "@/lib/messaging/schemas"

import type { McpTool } from "./projects"

export const messagingTools: McpTool[] = [
  {
    name: "list_conversations",
    title: "List conversations",
    description:
      "List the workspace conversations (channels and direct messages) with their messages.",
    inputSchema: {},
    readOnly: true,
    run: (ctx) => messagingService.list(ctx),
  },
  {
    name: "list_messages",
    title: "List messages",
    description: "List the top-level messages in a conversation.",
    inputSchema: { conversationId: z.string() },
    readOnly: true,
    run: (ctx, input) =>
      messagingService.messagesFor(ctx, String(input.conversationId)),
  },
  {
    name: "send_message",
    title: "Send message",
    description:
      "Send a message to a conversation. Supports attaching a meeting card via the meeting field.",
    inputSchema: sendMessageSchema.shape,
    readOnly: false,
    run: (ctx, input) =>
      messagingService.sendMessage(ctx, sendMessageSchema.parse(input)),
  },
  {
    name: "create_channel",
    title: "Create channel",
    description: "Create a new channel inside a team.",
    inputSchema: createChannelSchema.shape,
    readOnly: false,
    run: (ctx, input) =>
      messagingService.createChannel(ctx, createChannelSchema.parse(input)),
  },
]

export type { RequestContext }
