"use client"

import * as React from "react"
import { HashIcon, MessageSquareIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"

import { formatRelative } from "@/lib/messaging/format"
import { useMessaging } from "@/lib/messaging/store"

export function SearchCommand({
  open,
  onOpenChange,
  onSelectConversation,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectConversation: (id: string) => void
}) {
  const { conversations, messages, getConversation, getMember } = useMessaging()

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search conversations and messages"
      className="sm:max-w-lg"
    >
      <Command
        shouldFilter
        filter={(value, search) =>
          value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
        }
      >
        <CommandInput placeholder="Search messages and conversations..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Conversations">
            {conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                value={`conv ${conversation.name}`}
                onSelect={() => {
                  onSelectConversation(conversation.id)
                  onOpenChange(false)
                }}
              >
                {conversation.kind === "channel" ? (
                  <HashIcon />
                ) : (
                  <MessageSquareIcon />
                )}
                <span>{conversation.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Messages">
            {messages.slice(-30).reverse().map((message) => {
              const author = getMember(message.authorId)
              const conversation = getConversation(message.conversationId)
              if (!message.body) return null
              return (
                <CommandItem
                  key={message.id}
                  value={`msg ${message.body} ${author?.name ?? ""}`}
                  onSelect={() => {
                    onSelectConversation(message.conversationId)
                    onOpenChange(false)
                  }}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">{message.body}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {author?.name} in {conversation?.name} ·{" "}
                      {formatRelative(message.createdAt)}
                    </span>
                  </span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
