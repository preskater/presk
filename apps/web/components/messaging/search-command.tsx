"use client"

import * as React from "react"
import { HashIcon, MessageSquareIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

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
  const t = useTranslations("Messaging")
  const tc = useTranslations("Common")
  const locale = useLocale()
  const { conversations, messages, getConversation, getMember } = useMessaging()

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("searchLabel")}
      description={t("searchConversationsAndMessages")}
      className="sm:max-w-lg"
    >
      <Command
        shouldFilter
        filter={(value, search) =>
          value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
        }
      >
        <CommandInput placeholder={t("searchPlaceholder")} />
        <CommandList>
          <CommandEmpty>{t("noResults")}</CommandEmpty>
          <CommandGroup heading={t("conversations")}>
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
          <CommandGroup heading={t("messages")}>
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
                      {t("authorInConversation", {
                        author: author?.name ?? "",
                        conversation: conversation?.name ?? "",
                      })}{" "}
                      · {formatRelative(message.createdAt, locale, tc)}
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
