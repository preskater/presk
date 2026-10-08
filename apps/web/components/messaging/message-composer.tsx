"use client"

import * as React from "react"
import {
  AtSignIcon,
  ImageIcon,
  PaperclipIcon,
  SendIcon,
  SmilePlusIcon,
  SlashIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import {
  CommandPopover,
  MentionPopover,
  type SlashCommand,
} from "@/components/messaging/mention-picker"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Textarea } from "@workspace/ui/components/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

import { useMessaging } from "@/lib/messaging/store"
import type { Attachment } from "@/lib/messaging/types"

const EMOJI = [
  "😀", "😄", "😉", "😍", "🤔", "😅", "😂", "🥳",
  "👍", "👎", "🙏", "👏", "🎉", "🔥", "✨", "❤️",
  "✅", "❌", "👀", "🚀", "🐛", "💡", "📌", "☕",
]

const GIFS = ["👋 wave", "🎉 confetti", "🙌 high five", "🤝 deal", "😹 laugh"]

export function MessageComposer({
  conversationId,
  parentId,
  onScheduleMeeting,
}: {
  conversationId: string
  parentId?: string
  onScheduleMeeting?: () => void
}) {
  const t = useTranslations("Messaging")
  const { sendMessage, currentUserId, setTyping } = useMessaging()
  const [value, setValue] = React.useState("")
  const [attachments, setAttachments] = React.useState<Attachment[]>([])
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  function submit() {
    const body = value.trim()
    if (!body && attachments.length === 0) return
    sendMessage({ conversationId, body, attachments, parentId })
    setValue("")
    setAttachments([])
    setTyping(conversationId, currentUserId, false)
    textareaRef.current?.focus()
  }

  function handleCommand(command: SlashCommand) {
    if (command.name === "meeting") {
      onScheduleMeeting?.()
      return
    }
    if (command.name === "call") {
      toast.success(t("startingAudioCall"))
      return
    }
    if (command.name === "shrug") {
      setValue((prev) => `${prev}¯\\_(ツ)_/¯`)
    }
  }

  return (
    <div className="shrink-0 border-t p-3">
      <div className="rounded-lg border bg-background">
        {attachments.length > 0 ? (
          <div className="flex flex-wrap gap-2 border-b p-2">
            {attachments.map((attachment) => (
              <span
                key={attachment.id}
                className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs"
              >
                <PaperclipIcon className="size-3" />
                {attachment.name}
                <button
                  type="button"
                  aria-label={t("removeAttachment", { name: attachment.name })}
                  onClick={() =>
                    setAttachments((prev) =>
                      prev.filter((item) => item.id !== attachment.id)
                    )
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        ) : null}

        <Textarea
          ref={textareaRef}
          value={value}
          placeholder={parentId ? t("replyInThread") : t("typeMessage")}
          className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          onChange={(event) => {
            setValue(event.target.value)
            setTyping(conversationId, currentUserId, event.target.value.length > 0)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
        />

        <div className="flex items-center justify-between border-t p-1.5">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("attachFile")}
              onClick={() =>
                setAttachments((prev) => [
                  ...prev,
                  {
                    id: `a_${Math.random().toString(36).slice(2, 7)}`,
                    name: "document.pdf",
                    kind: "file",
                    meta: "PDF · 240 KB",
                  },
                ])
              }
            >
              <PaperclipIcon />
            </Button>

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("addEmoji")}
                  />
                }
              >
                <SmilePlusIcon />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="rounded-md p-1 text-lg transition-colors hover:bg-muted"
                      onClick={() =>
                        setValue((prev) => `${prev}${emoji}`)
                      }
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={t("addGif")}
                  >
                    GIF
                  </Button>
                }
              />
              <PopoverContent align="start" className="w-56 p-1">
                {GIFS.map((gif) => (
                  <button
                    key={gif}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors hover:bg-muted"
                    onClick={() => setValue((prev) => `${prev}[${gif}]`)}
                  >
                    {gif}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <CommandPopover
              onCommand={handleCommand}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label={t("commands")}>
                  <SlashIcon />
                </Button>
              }
            />

            <MentionPopover
              onMention={(_, name) =>
                setValue((prev) => `${prev}@${name.split(" ")[0]} `)
              }
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label={t("mentionSomeone")}>
                  <AtSignIcon />
                </Button>
              }
            />

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("attachImage")}
                  />
                }
              >
                <ImageIcon />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-sm transition-colors hover:bg-muted"
                  onClick={() =>
                    setAttachments((prev) => [
                      ...prev,
                      {
                        id: `a_${Math.random().toString(36).slice(2, 7)}`,
                        name: "screenshot.png",
                        kind: "image",
                        meta: "PNG · 640 KB",
                      },
                    ])
                  }
                >
                  <ImageIcon className="size-4" />
                  {t("uploadImage")}
                </button>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:block">
              {t("sendHint")}
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon-sm"
                    aria-label={t("sendMessage")}
                    disabled={!value.trim() && attachments.length === 0}
                    onClick={submit}
                  />
                }
              >
                <SendIcon />
              </TooltipTrigger>
              <TooltipContent>{t("send")}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
