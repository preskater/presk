"use client"

import * as React from "react"

import { MessageItem } from "@/components/messaging/message-item"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { formatDayLabel, isSameDay } from "@/lib/messaging/format"
import { useMessaging } from "@/lib/messaging/store"

export function MessageList({
  conversationId,
  onReply,
}: {
  conversationId: string
  onReply: (messageId: string) => void
}) {
  const { messagesFor, typing, getMember } = useMessaging()
  const messages = messagesFor(conversationId)
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTo({ top: node.scrollHeight })
  }, [conversationId, messages.length])

  const typingIds = typing[conversationId] ?? []
  const typingNames = typingIds
    .map((id) => getMember(id)?.name.split(" ")[0])
    .filter(Boolean)

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto py-2">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-sm font-medium">No messages yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Be the first to say something in this conversation.
          </p>
        </div>
      ) : (
        messages.map((message, index) => {
          const previous = messages[index - 1]
          const showDay =
            !previous || !isSameDay(previous.createdAt, message.createdAt)
          return (
            <React.Fragment key={message.id}>
              {showDay ? (
                <div className="flex items-center gap-3 px-4 py-3">
                  <Separator className="flex-1" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {formatDayLabel(message.createdAt)}
                  </span>
                  <Separator className="flex-1" />
                </div>
              ) : null}
              <MessageItem message={message} onReply={onReply} />
            </React.Fragment>
          )
        })
      )}
      <div ref={bottomRef} />
      {typingNames.length > 0 ? (
        <TypingIndicator names={typingNames as string[]} />
      ) : null}
    </div>
  )
}

export function MessageListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TypingIndicator({ names }: { names: string[] }) {
  const text =
    names.length === 1
      ? `${names[0]} is typing`
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} are typing`
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
      <span className="flex gap-1">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </span>
      {text}
    </div>
  )
}
