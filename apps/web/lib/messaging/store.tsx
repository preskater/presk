"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  addThreadReplyAction,
  createChannelAction,
  deleteMessageAction,
  editMessageAction,
  markReadAction,
  sendMessageAction,
  startDmAction,
  toggleMuteAction,
  togglePinAction,
  toggleReactionAction,
} from "@/actions/messaging"
import type { Member } from "@/lib/projects/types"

import type {
  Attachment,
  Conversation,
  MeetingMeta,
  Message,
  MessagingData,
  Presence,
  Reaction,
  Team,
} from "./types"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export interface SendMessageInput {
  conversationId: string
  body: string
  attachments?: Attachment[]
  meeting?: MeetingMeta
  parentId?: string
}

interface MessagingStore extends MessagingData {
  members: Member[]
  currentUserId: string
  getMember: (id?: string) => Member | undefined
  getTeam: (id?: string) => Team | undefined
  getConversation: (id?: string) => Conversation | undefined
  messagesFor: (conversationId: string) => Message[]
  repliesFor: (parentId: string) => Message[]
  lastMessageFor: (conversationId: string) => Message | undefined
  dmPartner: (conversation: Conversation) => string | undefined
  unreadTotal: number
  sendMessage: (input: SendMessageInput) => void
  editMessage: (id: string, body: string) => void
  deleteMessage: (id: string) => void
  toggleReaction: (messageId: string, emoji: string) => void
  toggleReactionMember: (
    messageId: string,
    emoji: string,
    memberId: string
  ) => void
  addThreadReply: (parentId: string, body: string) => void
  markRead: (conversationId: string) => void
  startDirectMessage: (memberId: string) => string
  createChannel: (teamId: string, name: string, topic?: string) => string
  setTyping: (
    conversationId: string,
    memberId: string,
    isTyping: boolean
  ) => void
  toggleMute: (conversationId: string) => void
  togglePin: (conversationId: string) => void
}

const MessagingContext = React.createContext<MessagingStore | null>(null)

export function MessagingProvider({
  children,
  initialData,
  currentUserId,
  members: initialMembers = [],
}: {
  children: React.ReactNode
  initialData: MessagingData
  currentUserId: string
  members?: Member[]
}) {
  const [conversations, setConversations] = React.useState<Conversation[]>(
    initialData.conversations
  )
  const [messages, setMessages] = React.useState<Message[]>(initialData.messages)
  const [teams, setTeams] = React.useState<Team[]>(initialData.teams)
  const [presence] = React.useState<Record<string, Presence>>(
    initialData.presence
  )
  const [typing, setTypingState] = React.useState<Record<string, string[]>>(
    initialData.typing
  )

  const members = initialMembers

  React.useEffect(() => {
    setConversations(initialData.conversations)
    setMessages(initialData.messages)
    setTeams(initialData.teams)
    setTypingState(initialData.typing)
  }, [initialData])

  const store = React.useMemo<MessagingStore>(() => {
    const getMember = (id?: string) =>
      id ? members.find((member) => member.id === id) : undefined
    const getTeam = (id?: string) => teams.find((team) => team.id === id)
    const getConversation = (id?: string) =>
      conversations.find((conversation) => conversation.id === id)

    const messagesFor = (conversationId: string) =>
      messages
        .filter(
          (message) =>
            message.conversationId === conversationId && !message.parentId
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

    const repliesFor = (parentId: string) =>
      messages
        .filter((message) => message.parentId === parentId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

    const lastMessageFor = (conversationId: string) => {
      const list = messages
        .filter((message) => message.conversationId === conversationId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      return list[list.length - 1]
    }

    const dmPartner = (conversation: Conversation) =>
      conversation.kind === "dm"
        ? conversation.memberIds.find((id) => id !== currentUserId)
        : undefined

    function sendMessage(input: SendMessageInput) {
      const optimistic: Message = {
        id: uid("m"),
        conversationId: input.conversationId,
        authorId: currentUserId,
        body: input.body,
        createdAt: new Date().toISOString(),
        reactions: [],
        attachments: input.attachments ?? [],
        parentId: input.parentId,
        meeting: input.meeting,
      }
      setMessages((prev) => [...prev, optimistic])
      if (!input.parentId) {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === input.conversationId
              ? {
                  ...conversation,
                  lastMessageAt: optimistic.createdAt,
                  unreadCount: 0,
                }
              : conversation
          )
        )
      }
      void sendMessageAction(input)
        .then((message) => {
          setMessages((prev) =>
            prev.map((item) => (item.id === optimistic.id ? message : item))
          )
        })
        .catch((error) => {
          setMessages((prev) =>
            prev.filter((item) => item.id !== optimistic.id)
          )
          toast.error(error.message ?? "Message failed to send.")
        })
    }

    return {
      teams,
      conversations,
      messages,
      presence,
      typing,
      members,
      currentUserId,
      getMember,
      getTeam,
      getConversation,
      messagesFor,
      repliesFor,
      lastMessageFor,
      dmPartner,
      unreadTotal: conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0
      ),
      sendMessage,
      editMessage: (id, body) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id ? { ...message, body, edited: true } : message
          )
        )
        void editMessageAction(id, body)
          .then(() => toast.success("Message edited."))
          .catch((error) => toast.error(error.message ?? "Edit failed."))
      },
      deleteMessage: (id) => {
        setMessages((prev) =>
          prev.filter(
            (message) => message.id !== id && message.parentId !== id
          )
        )
        void deleteMessageAction(id)
          .then(() => toast.success("Message deleted."))
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      toggleReaction: (messageId, emoji) => {
        setMessages((prev) =>
          prev.map((message) => {
            if (message.id !== messageId) return message
            return {
              ...message,
              reactions: toggleReactionFor(
                message.reactions,
                emoji,
                currentUserId
              ),
            }
          })
        )
        void toggleReactionAction(messageId, { emoji }).catch((error) =>
          toast.error(error.message ?? "Reaction failed.")
        )
      },
      toggleReactionMember: (messageId, emoji, memberId) => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  reactions: toggleReactionFor(
                    message.reactions,
                    emoji,
                    memberId
                  ),
                }
              : message
          )
        )
        void toggleReactionAction(messageId, { emoji, memberId }).catch(
          (error) => toast.error(error.message ?? "Reaction failed.")
        )
      },
      addThreadReply: (parentId, body) => {
        const parentMessage = messages.find((message) => message.id === parentId)
        if (!parentMessage) return
        const optimistic: Message = {
          id: uid("m"),
          conversationId: parentMessage.conversationId,
          authorId: currentUserId,
          body,
          createdAt: new Date().toISOString(),
          reactions: [],
          attachments: [],
          parentId,
        }
        setMessages((prev) => [...prev, optimistic])
        void addThreadReplyAction(parentId, body)
          .then((message) => {
            setMessages((prev) =>
              prev.map((item) => (item.id === optimistic.id ? message : item))
            )
          })
          .catch((error) =>
            toast.error(error.message ?? "Reply failed.")
          )
      },
      markRead: (conversationId) => {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unreadCount: 0 }
              : conversation
          )
        )
        void markReadAction(conversationId).catch(() => undefined)
      },
      startDirectMessage: (memberId) => {
        const existing = conversations.find(
          (conversation) =>
            conversation.kind === "dm" &&
            conversation.memberIds.includes(memberId)
        )
        if (existing) return existing.id
        const member = getMember(memberId)
        const id = uid("dm")
        setConversations((prev) => [
          {
            id,
            kind: "dm",
            name: member?.name ?? "Direct message",
            memberIds: [currentUserId, memberId],
            unreadCount: 0,
            lastMessageAt: new Date().toISOString(),
          },
          ...prev,
        ])
        void startDmAction(memberId)
          .then((conversation) => {
            setConversations((prev) =>
              prev.map((item) => (item.id === id ? conversation : item))
            )
            toast.success(`Started a chat with ${member?.name ?? "teammate"}.`)
          })
          .catch((error) => {
            setConversations((prev) => prev.filter((item) => item.id !== id))
            toast.error(error.message ?? "Could not start chat.")
          })
        return id
      },
      createChannel: (teamId, name, topic) => {
        const id = uid("c")
        setConversations((prev) => [
          ...prev,
          {
            id,
            kind: "channel",
            name,
            teamId,
            topic,
            memberIds: [currentUserId],
            unreadCount: 0,
            lastMessageAt: new Date().toISOString(),
          },
        ])
        setTeams((prev) =>
          prev.map((team) =>
            team.id === teamId
              ? { ...team, channelIds: [...team.channelIds, id] }
              : team
          )
        )
        void createChannelAction({ teamId, name, topic })
          .then((conversation) => {
            setConversations((prev) =>
              prev.map((item) => (item.id === id ? conversation : item))
            )
            toast.success(`Channel #${name} created.`)
          })
          .catch((error) => {
            setConversations((prev) => prev.filter((item) => item.id !== id))
            toast.error(error.message ?? "Could not create channel.")
          })
        return id
      },
      setTyping: (conversationId, memberId, isTyping) => {
        setTypingState((prev) => {
          const current = prev[conversationId] ?? []
          const next = isTyping
            ? Array.from(new Set([...current, memberId]))
            : current.filter((id) => id !== memberId)
          return { ...prev, [conversationId]: next }
        })
      },
      toggleMute: (conversationId) => {
        let muted = false
        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation.id !== conversationId) return conversation
            muted = !conversation.muted
            return { ...conversation, muted }
          })
        )
        void toggleMuteAction(conversationId, muted).catch((error) =>
          toast.error(error.message ?? "Update failed.")
        )
      },
      togglePin: (conversationId) => {
        let pinned = false
        setConversations((prev) =>
          prev.map((conversation) => {
            if (conversation.id !== conversationId) return conversation
            pinned = !conversation.pinned
            return { ...conversation, pinned }
          })
        )
        void togglePinAction(conversationId, pinned).catch((error) =>
          toast.error(error.message ?? "Update failed.")
        )
      },
    }
  }, [conversations, messages, teams, presence, typing, members, currentUserId])

  return (
    <MessagingContext.Provider value={store}>
      {children}
    </MessagingContext.Provider>
  )
}

function toggleReactionFor(
  reactions: Reaction[],
  emoji: string,
  memberId: string
): Reaction[] {
  const existing = reactions.find((reaction) => reaction.emoji === emoji)
  if (!existing) {
    return [...reactions, { emoji, memberIds: [memberId] }]
  }
  const hasReacted = existing.memberIds.includes(memberId)
  const memberIds = hasReacted
    ? existing.memberIds.filter((id) => id !== memberId)
    : [...existing.memberIds, memberId]
  return reactions
    .map((reaction) =>
      reaction.emoji === emoji ? { ...reaction, memberIds } : reaction
    )
    .filter((reaction) => reaction.memberIds.length > 0)
}

export function useMessaging() {
  const context = React.useContext(MessagingContext)
  if (!context) {
    throw new Error("useMessaging must be used within a MessagingProvider")
  }
  return context
}
