"use client"

import * as React from "react"
import {
  Grid2x2Icon,
  MicIcon,
  MicOffIcon,
  MonitorUpIcon,
  MoreHorizontalIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react"
import { toast } from "sonner"

import { MemberAvatar } from "@/components/task/member-avatar"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

import { formatTime } from "@/lib/messaging/format"
import type { Member } from "@/lib/projects/types"

export function CallControls({
  kind,
  participants,
  startedAt,
  onLeave,
}: {
  kind: "audio" | "video"
  participants: Member[]
  startedAt: string
  onLeave: () => void
}) {
  const [muted, setMuted] = React.useState(false)
  const [videoOn, setVideoOn] = React.useState(kind === "video")
  const [sharing, setSharing] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-destructive" />
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {kind === "video" ? "Video call" : "Audio call"}
          </span>
          <span className="text-xs text-muted-foreground">
            Started {formatTime(startedAt)} · {participants.length} on the call
          </span>
        </div>
        <div className="flex -space-x-2">
          {participants.slice(0, 5).map((member) => (
            <MemberAvatar key={member.id} member={member} size="sm" />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant={muted ? "destructive" : "outline"}
                size="icon"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((prev) => !prev)}
              />
            }
          >
            {muted ? <MicOffIcon /> : <MicIcon />}
          </TooltipTrigger>
          <TooltipContent>{muted ? "Unmute" : "Mute"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant={videoOn ? "default" : "outline"}
                size="icon"
                aria-label={videoOn ? "Stop video" : "Start video"}
                onClick={() => setVideoOn((prev) => !prev)}
              />
            }
          >
            {videoOn ? <VideoIcon /> : <VideoOffIcon />}
          </TooltipTrigger>
          <TooltipContent>{videoOn ? "Stop video" : "Start video"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant={sharing ? "default" : "outline"}
                size="icon"
                aria-label={sharing ? "Stop sharing" : "Share screen"}
                onClick={() => setSharing((prev) => !prev)}
              />
            }
          >
            <MonitorUpIcon />
          </TooltipTrigger>
          <TooltipContent>{sharing ? "Stop sharing" : "Share screen"}</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="More call options" />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => toast.info("Participants panel")}>
                <Grid2x2Icon />
                View participants
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            toast.success("You left the call.")
            onLeave()
          }}
        >
          <PhoneOffIcon data-icon="inline-start" />
          Leave
        </Button>
      </div>
    </div>
  )
}
