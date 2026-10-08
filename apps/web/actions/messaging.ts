"use server"

import { revalidatePath } from "next/cache"

import { getRequestContext } from "@/lib/core/auth-context"
import { messagingService } from "@/lib/messaging"
import {
  addThreadReplySchema,
  createChannelSchema,
  editMessageSchema,
  muteSchema,
  pinSchema,
  sendMessageSchema,
  setTypingSchema,
  startDmSchema,
  toggleReactionSchema,
} from "@/lib/messaging/schemas"

export async function listMessagingAction() {
  const ctx = await getRequestContext()
  return messagingService.list(ctx)
}

export async function sendMessageAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = sendMessageSchema.parse(input)
  const message = await messagingService.sendMessage(ctx, parsed)
  revalidatePath("/dashboard/messages")
  return message
}

export async function editMessageAction(id: string, body: string) {
  const ctx = await getRequestContext()
  const parsed = editMessageSchema.parse({ body })
  const message = await messagingService.editMessage(ctx, id, parsed)
  revalidatePath("/dashboard/messages")
  return message
}

export async function deleteMessageAction(id: string) {
  const ctx = await getRequestContext()
  const result = await messagingService.deleteMessage(ctx, id)
  revalidatePath("/dashboard/messages")
  return result
}

export async function toggleReactionAction(messageId: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = toggleReactionSchema.parse(input)
  const message = await messagingService.toggleReaction(ctx, messageId, parsed)
  revalidatePath("/dashboard/messages")
  return message
}

export async function addThreadReplyAction(parentId: string, body: string) {
  const ctx = await getRequestContext()
  const parsed = addThreadReplySchema.parse({ parentId, body })
  const message = await messagingService.addThreadReply(ctx, parsed)
  revalidatePath("/dashboard/messages")
  return message
}

export async function markReadAction(conversationId: string) {
  const ctx = await getRequestContext()
  const conversation = await messagingService.markRead(ctx, conversationId)
  revalidatePath("/dashboard/messages")
  return conversation
}

export async function startDmAction(memberId: string) {
  const ctx = await getRequestContext()
  const parsed = startDmSchema.parse({ memberId })
  const conversation = await messagingService.startDirectMessage(ctx, parsed)
  revalidatePath("/dashboard/messages")
  return conversation
}

export async function createChannelAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createChannelSchema.parse(input)
  const conversation = await messagingService.createChannel(ctx, parsed)
  revalidatePath("/dashboard/messages")
  return conversation
}

export async function setTypingAction(conversationId: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = setTypingSchema.parse(input)
  void conversationId
  return messagingService.setTyping(ctx, parsed)
}

export async function toggleMuteAction(conversationId: string, muted?: boolean) {
  const ctx = await getRequestContext()
  muteSchema.parse({ muted })
  const conversation = await messagingService.toggleMute(
    ctx,
    conversationId,
    muted
  )
  revalidatePath("/dashboard/messages")
  return conversation
}

export async function togglePinAction(conversationId: string, pinned?: boolean) {
  const ctx = await getRequestContext()
  pinSchema.parse({ pinned })
  const conversation = await messagingService.togglePin(
    ctx,
    conversationId,
    pinned
  )
  revalidatePath("/dashboard/messages")
  return conversation
}
