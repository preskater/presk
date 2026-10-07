"use client"

import { HashIcon, PinIcon, VolumeXIcon } from "lucide-react"

import { PresenceDot } from "@/components/messaging/presence-dot"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import { initials } from "@/lib/messaging/format"
import { useMessaging } from "@/lib/messaging/store"
import type { Conversation } from "@/lib/messaging/types"

export function ConversationItem({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation
  active: boolean
  onSelect: (id: string) => void
}) {
  const { getMember, dmPartner, lastMessageFor, presence } = useMessaging()
  const partnerId = dmPartner(conversation)
  const partner = getMember(partnerId)
  const last = lastMessageFor(conversation.id)
  const lastAuthor = last ? getMember(last.authorId) : undefined
  const preview = last
    ? last.meeting
      ? "Shared a meeting"
      : last.body
    : "No messages yet"

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-start transition-colors",
        active ? "bg-muted text-foreground" : "hover:bg-muted/60"
      )}
    >
      <div className="relative shrink-0">
        {conversation.kind === "channel" ? (
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <HashIcon className="size-4" />
          </span>
        ) : (
          <>
            <Avatar size="sm" className="size-8">
              {partner?.avatarUrl ? (
                <AvatarImage src={partner.avatarUrl} alt={partner.name} />
              ) : null}
              <AvatarFallback>
                {partner ? initials(partner.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <PresenceDot
              presence={partnerId ? presence[partnerId] : undefined}
              className="absolute -end-0.5 -bottom-0.5"
            />
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-sm",
              conversation.unreadCount > 0 ? "font-semibold" : "font-medium"
            )}
          >
            {conversation.name}
          </span>
          {conversation.pinned ? (
            <PinIcon className="size-3 shrink-0 text-muted-foreground" />
          ) : null}
          {conversation.muted ? (
            <VolumeXIcon className="size-3 shrink-0 text-muted-foreground" />
          ) : null}
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {conversation.kind === "channel" && lastAuthor
            ? `${lastAuthor.name.split(" ")[0]}: ${preview}`
            : preview}
        </span>
      </div>

      {conversation.unreadCount > 0 ? (
        <Badge className="shrink-0 tabular-nums">
          {conversation.unreadCount}
        </Badge>
      ) : null}
    </button>
  )
}
