"use client"

import * as React from "react"
import { CalendarPlusIcon } from "lucide-react"

import { DatePicker } from "@/components/task/date-picker"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { useMessaging } from "@/lib/messaging/store"

const DURATIONS = [15, 30, 45, 60].map((minutes) => ({
  label: minutes >= 60 ? "1 hour" : `${minutes} minutes`,
  value: String(minutes),
}))

const TIMES = Array.from({ length: 11 }).map((_, index) => {
  const hour = 8 + index
  const label = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`
  return { label, value: String(hour) }
})

export function MeetingDialog({
  conversationId,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: {
  conversationId: string
  trigger: React.ReactElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { sendMessage } = useMessaging()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const [title, setTitle] = React.useState("Team sync")
  const [date, setDate] = React.useState<string | undefined>(
    new Date().toISOString()
  )
  const [hour, setHour] = React.useState("15")
  const [duration, setDuration] = React.useState("30")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a meeting</DialogTitle>
          <DialogDescription>
            Posts a meeting card to this conversation.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!title.trim() || !date) return
            const startsAt = new Date(date)
            startsAt.setHours(Number(hour), 0, 0, 0)
            sendMessage({
              conversationId,
              body: "",
              meeting: {
                title: title.trim(),
                startsAt: startsAt.toISOString(),
                durationMinutes: Number(duration),
              },
            })
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="meeting-title">Title</FieldLabel>
              <Input
                id="meeting-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                autoFocus
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="meeting-date">Date</FieldLabel>
              <DatePicker value={date} onChange={setDate} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="meeting-time">Start time</FieldLabel>
                <Select
                  items={TIMES}
                  value={hour}
                  onValueChange={(value) => setHour(value as string)}
                >
                  <SelectTrigger id="meeting-time" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TIMES.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="meeting-duration">Duration</FieldLabel>
                <Select
                  items={DURATIONS}
                  value={duration}
                  onValueChange={(value) => setDuration(value as string)}
                >
                  <SelectTrigger id="meeting-duration" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DURATIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <FieldDescription>
              Everyone in the conversation will be invited.
            </FieldDescription>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">
              <CalendarPlusIcon data-icon="inline-start" />
              Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
