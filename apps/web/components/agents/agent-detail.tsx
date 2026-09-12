"use client"

import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AgentStatusBadge } from "@/components/agent-status-badge"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { ArrowLeftIcon, PlayIcon, SquareIcon } from "lucide-react"

import { agents, sessions, tools } from "@/lib/data"

export function AgentDetail({ id }: { id: string }) {
  const agent = agents.find((a) => a.id === id)
  if (!agent) notFound()

  const agentSessions = sessions.filter((s) => s.agentId === id)
  const connectedTools = tools.filter((t) => agent.tools.includes(t.id))

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/agents" />}
        >
          <ArrowLeftIcon />
        </Button>
        <div className="flex flex-1 items-center gap-3">
          <div>
            <h2 className="text-lg font-semibold">{agent.name}</h2>
            <p className="text-sm text-muted-foreground">{agent.role}</p>
          </div>
          <AgentStatusBadge status={agent.status} />
        </div>
        <Button variant="outline" size="sm">
          {agent.status === "active" ? <SquareIcon /> : <PlayIcon />}
          {agent.status === "active" ? "Stop" : "Start"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="logs">Logs & Traces</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Agent card</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <ConfigRow label="Model" value={agent.model} />
                <ConfigRow
                  label="Temperature"
                  value={String(agent.temperature)}
                />
                <ConfigRow label="Max tokens" value={String(agent.maxTokens)} />
                <ConfigRow label="Timeout" value={`${agent.timeout}s`} />
                <ConfigRow label="Owner" value={agent.owner} />
                <ConfigRow label="Team" value={agent.team} />
                <ConfigRow label="Domain" value={agent.domain} />
                <ConfigRow label="Tenant" value={agent.tenant} />
                <div className="flex flex-wrap gap-1.5">
                  {agent.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>System prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {agent.instructions}
                </p>
                <Separator className="my-4" />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Handoffs</span>
                  {agent.handoffs.length > 0 ? (
                    agent.handoffs.map((h) => {
                      const target = agents.find((a) => a.id === h)
                      return (
                        <Link
                          key={h}
                          href={`/agents/${h}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {target?.name ?? h}
                        </Link>
                      )
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No handoffs configured
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Tools</CardTitle>
              <CardDescription>Tools and APIs with status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {connectedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {tool.category} · {tool.scopes.join(", ")}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      tool.status === "connected"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : tool.status === "degraded"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }
                  >
                    {tool.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>Past sessions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {agentSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.id}`}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{session.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(session.timestamp).toLocaleString("en-US")}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {session.duration}s
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${session.cost.toFixed(2)}
                  </span>
                  <Badge variant="outline">{session.status}</Badge>
                </Link>
              ))}
              {agentSessions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No sessions yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs & Traces</CardTitle>
              <CardDescription>Timeline of turns and decisions</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {agentSessions.flatMap((session) =>
                session.turns.map((turn) => (
                  <div
                    key={turn.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Badge variant="outline" className="mt-0.5">
                      {turn.role}
                    </Badge>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm">{turn.content}</span>
                      {turn.tool && (
                        <span className="text-xs text-muted-foreground">
                          tool: {turn.tool}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {turn.duration}s
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="pt-4">
          <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Average metrics</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <MetricBar
                  label="Success rate"
                  value={agent.metrics.successRate}
                  suffix="%"
                />
                <MetricBar
                  label="Satisfaction"
                  value={agent.metrics.satisfaction * 20}
                  suffix="/5"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Stat
                    label="Avg response"
                    value={`${agent.metrics.avgResponseTime}s`}
                  />
                  <Stat
                    label="Cost/session"
                    value={`$${agent.metrics.costPerSession.toFixed(2)}`}
                  />
                  <Stat
                    label="Sessions"
                    value={String(agent.metrics.sessions)}
                  />
                  <Stat
                    label="Satisfaction"
                    value={`${agent.metrics.satisfaction.toFixed(1)}/5`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function MetricBar({
  label,
  value,
  suffix,
}: {
  label: string
  value: number
  suffix: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value.toFixed(1)}
          {suffix}
        </span>
      </div>
      <Progress value={value} className="w-full" />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  )
}
