"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { ChatPanel } from "@/components/messaging/chat-panel"
import { ConversationDetailsSheet } from "@/components/messaging/conversation-details-sheet"
import { ConversationSidebar } from "@/components/messaging/conversation-sidebar"
import { SearchCommand } from "@/components/messaging/search-command"
import { ThreadSheet } from "@/components/messaging/thread-sheet"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@workspace/ui/components/empty"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"
import { MessageSquareIcon } from "lucide-react"

import { useEnumLabel } from "@/lib/i18n/labels"
import { useMessaging } from "@/lib/messaging/store"
import { useRecents } from "@/lib/recents/store"

export function MessagingWorkspace() {
  const t = useTranslations("Messaging")
  const L = useEnumLabel()
  const { conversations, getConversation, getMember, dmPartner, markRead } =
    useMessaging()
  const { record, active, hydrated } = useRecents()
  const [activeId, setActiveId] = React.useState<string | undefined>(
    () => active.messages ?? conversations[0]?.id
  )
  const [threadId, setThreadId] = React.useState<string | undefined>()
  const [threadOpen, setThreadOpen] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  const activeConversation = getConversation(activeId)

  const markedReadRef = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (!activeId || markedReadRef.current === activeId) return
    if (!getConversation(activeId)) return
    markedReadRef.current = activeId
    markRead(activeId)
  }, [activeId, getConversation, markRead])

  const restoredRef = React.useRef(false)
  React.useEffect(() => {
    if (!hydrated || restoredRef.current) return
    restoredRef.current = true
    if (active.messages) setActiveId(active.messages)
  }, [hydrated, active.messages])

  React.useEffect(() => {
    if (!hydrated || !activeId) return
    const conversation = getConversation(activeId)
    if (!conversation) return
    record("messages", {
      id: conversation.id,
      label:
        conversation.kind === "channel"
          ? `#${conversation.name}`
          : (getMember(dmPartner(conversation))?.name ?? t("directMessage")),
      hint: dmPartner(conversation)
        ? L.conversationKind("dm")
        : L.conversationKind("channel"),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, hydrated])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function selectConversation(id: string) {
    setActiveId(id)
    markRead(id)
  }

  function openThread(messageId: string) {
    setThreadId(messageId)
    setThreadOpen(true)
  }

  return (
    <>
      <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <ResizablePanelGroup
          id="messages-layout"
          orientation="horizontal"
          className="h-full min-h-0"
        >
          <ResizablePanel
            id="conversations"
            defaultSize="288px"
            minSize="220px"
            maxSize="440px"
            className="min-h-0"
          >
            <ConversationSidebar
              activeId={activeId}
              onSelect={selectConversation}
              onOpenSearch={() => setSearchOpen(true)}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel id="chat" minSize="50%" className="min-h-0">
            {activeConversation ? (
              <ChatPanel
                conversation={activeConversation}
                onOpenDetails={() => setDetailsOpen(true)}
                onOpenSearch={() => setSearchOpen(true)}
                onReply={openThread}
              />
            ) : (
              <Empty className="h-full">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MessageSquareIcon />
                  </EmptyMedia>
                  <EmptyTitle>{t("noConversationSelected")}</EmptyTitle>
                  <EmptyDescription>
                    {t("noConversationSelectedDescription")}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <ThreadSheet
        messageId={threadId}
        open={threadOpen}
        onOpenChange={setThreadOpen}
      />

      {activeConversation && activeConversation.kind === "channel" ? (
        <ConversationDetailsSheet
          conversation={activeConversation}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      ) : null}

      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectConversation={selectConversation}
      />
    </>
  )
}
