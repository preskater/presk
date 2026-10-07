"use client"

import * as React from "react"
import {
  BellOffIcon,
  HashIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PhoneIcon,
  PinIcon,
  SearchIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react"

import { MemberAvatar } from "@/components/task/member-avatar"
import { PresenceDot } from "@/components/messaging/presence-dot"
import { AvatarGroup } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Separator } from "@workspace/ui/components/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

import { useMessaging } from "@/lib/messaging/store"
import type { Conversation } from "@/lib/messaging/types"

export function ChatHeader({
  conversation,
  onToggleDetails,
  onStartCall,
  onOpenSearch,
}: {
  conversation: Conversation
  onToggleDetails: () => void
  onStartCall: (kind: "audio" | "video") => void
  onOpenSearch: () => void
}) {
  const { getMember, dmPartner, toggleMute, togglePin, presence } =
    useMessaging()
  const members = conversation.memberIds
    .map((id) => getMember(id))
    .filter((member) => member !== undefined)
  const partnerId = dmPartner(conversation)
  const partner = getMember(partnerId)

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {conversation.kind === "channel" ? (
          <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <HashIcon className="size-4" />
          </span>
        ) : (
          <div className="relative">
            <MemberAvatar member={partner} />
            <PresenceDot
              presence={partnerId ? presence[partnerId] : undefined}
              className="absolute -end-0.5 -bottom-0.5"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold">
              {conversation.kind === "channel"
                ? `#${conversation.name}`
                : conversation.name}
            </h2>
            {conversation.pinned ? (
              <PinIcon className="size-3 shrink-0 text-muted-foreground" />
            ) : null}
            {conversation.muted ? (
              <Badge variant="outline">Muted</Badge>
            ) : null}
          </div>
          {conversation.topic ? (
            <p className="truncate text-xs text-muted-foreground">
              {conversation.topic}
            </p>
          ) : partner ? (
            <p className="truncate text-xs text-muted-foreground">
              {partner.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {conversation.kind === "channel" ? (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="View members"
                  onClick={onToggleDetails}
                />
              }
            >
              <AvatarGroup>
                {members.slice(0, 4).map((member) => (
                  <MemberAvatar key={member.id} member={member} size="sm" />
                ))}
              </AvatarGroup>
            </TooltipTrigger>
            <TooltipContent>{members.length} members</TooltipContent>
          </Tooltip>
        ) : null}

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Search messages"
                onClick={onOpenSearch}
              />
            }
          >
            <SearchIcon />
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Start audio call"
                onClick={() => onStartCall("audio")}
              />
            }
          >
            <PhoneIcon />
          </TooltipTrigger>
          <TooltipContent>Audio call</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Start video call"
                onClick={() => onStartCall("video")}
              />
            }
          >
            <VideoIcon />
          </TooltipTrigger>
          <TooltipContent>Video call</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="More options" />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={onToggleDetails}>
                <InfoIcon />
                Conversation details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => togglePin(conversation.id)}>
                <PinIcon />
                {conversation.pinned ? "Unpin" : "Pin"} conversation
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toggleMute(conversation.id)}>
                <BellOffIcon />
                {conversation.muted ? "Unmute" : "Mute"} notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => onStartCall("audio")}>
                <UsersIcon />
                Meet now
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
