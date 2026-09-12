"use client"

import * as React from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { SendIcon, BotIcon, UserIcon } from "lucide-react"

import { agents } from "@/lib/data"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Playground() {
  const [agentId, setAgentId] = React.useState(agents[0]?.id ?? "")
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([])

  const agent = agents.find((a) => a.id === agentId) ?? agents[0]

  const send = () => {
    if (!input.trim()) return
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content: `[${agent?.name}] This is a simulated response to: "${input}"`,
      },
    ])
    setInput("")
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div>
        <h2 className="text-lg font-semibold">Playground</h2>
        <p className="text-sm text-muted-foreground">
          Test prompts against an agent or orchestrator
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={agentId}
          onValueChange={(v) => setAgentId(v ?? agents[0]?.id ?? "")}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {agent && (
          <Badge variant="outline">
            {agent.model} · temp {agent.temperature}
          </Badge>
        )}
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>Conversation with {agent?.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex min-h-[300px] flex-col gap-3 rounded-lg border p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Start a conversation to test the agent.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                {msg.role === "assistant" && (
                  <BotIcon className="mt-0.5 size-4 text-muted-foreground" />
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    msg.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <UserIcon className="mt-0.5 size-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />
            <Button onClick={send} size="icon">
              <SendIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
