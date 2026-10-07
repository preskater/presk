"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { ArrowUpIcon, SparklesIcon, XIcon } from "lucide-react"

import { AssistantMessage } from "@/components/assistant/assistant-message"
import { useOverlayOpen } from "@/components/assistant/use-overlay-open"
import { Button } from "@workspace/ui/components/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@workspace/ui/components/message-scroller"
import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

import {
  assistantInitialMessages,
  assistantTransport,
} from "@/lib/assistant/chat"
import { suggestions } from "@/lib/assistant/suggestions"

export function AssistantBar() {
  const { messages, sendMessage, status } = useChat({
    messages: assistantInitialMessages,
    transport: assistantTransport,
  })
  const [input, setInput] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const overlayOpen = useOverlayOpen()

  const isBusy = status === "submitted" || status === "streaming"

  function submit(text: string) {
    const value = text.trim()
    if (!value || isBusy) return
    setOpen(true)
    void sendMessage({ text: value })
    setInput("")
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    submit(input)
  }

  if (overlayOpen) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 sm:p-4 md:left-(--sidebar-width) md:peer-data-[collapsible=offcanvas]:left-0">
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-popover shadow-lg",
          open && "ring-1 ring-foreground/5"
        )}
      >
        {open ? (
          <div className="flex h-80 min-h-0 flex-col border-b">
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                <span className="text-sm font-medium">Presk assistant</span>
                {isBusy ? (
                  <Badge variant="secondary" className="shimmer">
                    Thinking
                  </Badge>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Collapse assistant"
                onClick={() => setOpen(false)}
              >
                <XIcon />
              </Button>
            </div>
            <MessageScrollerProvider autoScroll>
              <MessageScroller className="px-4">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="gap-4 pb-4">
                    {messages.map((message) => (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={message.role === "user"}
                      >
                        <AssistantMessage message={message} />
                      </MessageScrollerItem>
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 px-3 pt-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => submit(suggestion.prompt)}
                className="rounded-full border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2.5">
          <SparklesIcon className="ms-1.5 size-4 shrink-0 text-muted-foreground" />
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Ask the Presk assistant…"
            aria-label="Ask the Presk assistant"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon-sm"
            aria-label="Send"
            disabled={!input.trim() || isBusy}
          >
            <ArrowUpIcon />
          </Button>
        </form>
      </div>
    </div>
  )
}
