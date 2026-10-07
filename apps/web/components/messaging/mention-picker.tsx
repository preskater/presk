"use client"

import { AtSignIcon, SlashIcon } from "lucide-react"

import { MemberAvatar } from "@/components/task/member-avatar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

import { useMessaging } from "@/lib/messaging/store"

export interface SlashCommand {
  name: string
  description: string
}

const SLASH_COMMANDS: SlashCommand[] = [
  { name: "meeting", description: "Schedule a meeting" },
  { name: "call", description: "Start an audio call" },
  { name: "shrug", description: "Append ¯\\_(ツ)_/¯" },
]

export function CommandPopover({
  onCommand,
  trigger,
}: {
  onCommand: (command: SlashCommand) => void
  trigger: React.ReactElement
}) {
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
            <CommandGroup heading="Commands">
              {SLASH_COMMANDS.map((command) => (
                <CommandItem
                  key={command.name}
                  value={command.name}
                  onSelect={() => onCommand(command)}
                >
                  <SlashIcon />
                  <span className="flex flex-col">
                    <span>/{command.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {command.description}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function MentionPopover({
  onMention,
  trigger,
}: {
  onMention: (memberId: string, name: string) => void
  trigger: React.ReactElement
}) {
  const { members, currentUserId } = useMessaging()
  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Mention someone..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup heading="Members">
              {members
                .filter((member) => member.id !== currentUserId)
                .map((member) => (
                  <CommandItem
                    key={member.id}
                    value={member.name}
                    onSelect={() => onMention(member.id, member.name)}
                  >
                    <MemberAvatar member={member} size="sm" />
                    <span>{member.name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { SLASH_COMMANDS }
