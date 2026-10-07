"use client"

import * as React from "react"
import { PlusIcon, SearchIcon } from "lucide-react"

import { ConversationList } from "@/components/messaging/conversation-list"
import { NewMessageDialog } from "@/components/messaging/new-message-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

import { useMessaging } from "@/lib/messaging/store"

export function ConversationSidebar({
  activeId,
  onSelect,
  onOpenSearch,
}: {
  activeId?: string
  onSelect: (id: string) => void
  onOpenSearch: () => void
}) {
  const { unreadTotal } = useMessaging()
  const [query, setQuery] = React.useState("")

  return (
    <aside className="flex h-full min-h-0 flex-col border-e bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Chat</h2>
          {unreadTotal > 0 ? (
            <span className="text-xs text-muted-foreground tabular-nums">
              {unreadTotal} unread
            </span>
          ) : null}
        </div>
        <NewMessageDialog
          onStart={(id) => onSelect(id)}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="New message">
              <PlusIcon />
            </Button>
          }
        />
      </div>

      <div className="px-3 pb-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Search conversations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                onOpenSearch()
              }
            }}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <ConversationList activeId={activeId} onSelect={onSelect} query={query} />
      </ScrollArea>
    </aside>
  )
}
