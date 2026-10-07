"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { cn } from "@workspace/ui/lib/utils"

import { initialsFor } from "@/lib/projects/store"
import type { Member } from "@/lib/projects/types"

export function MemberAvatar({
  member,
  size = "default",
  className,
}: {
  member?: Member
  size?: "sm" | "default" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={cn(className)}>
      {member?.avatarUrl ? (
        <AvatarImage src={member.avatarUrl} alt={member.name} />
      ) : null}
      <AvatarFallback>
        {member ? initialsFor(member.name) : "?"}
      </AvatarFallback>
    </Avatar>
  )
}
