"use client"

import * as React from "react"

import { AgentStatusBadge } from "@/components/agent-status-badge"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { agents } from "@/lib/data"

const liveOutput: Record<string, string[]> = {
  "agt-001": [
    "> Resolving ticket #4821...",
    "> Found 3 matching KB articles",
    "> Drafting response...",
  ],
  "agt-002": [
    "> Querying Stripe invoices...",
    "> 1,204 invoices loaded",
    "> Computing totals...",
  ],
  "agt-003": ["> Triggering Airflow DAG...", "> Waiting for pipeline..."],
  "agt-004": ["> ERROR: Zendesk API timeout", "> Retrying (1/3)..."],
  "agt-005": ["> Drafting blog post...", "> (stalled) waiting for input"],
}

export function MultiAgentView() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div>
        <h2 className="text-lg font-semibold">Multi-Agent View</h2>
        <p className="text-sm text-muted-foreground">
          All agents in parallel with live terminal output
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {agents
          .filter((a) => a.status !== "archived")
          .map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.role}</CardDescription>
                  </div>
                  <AgentStatusBadge status={agent.status} />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="rounded-lg bg-black p-3 font-mono text-xs text-emerald-400">
                  {(liveOutput[agent.id] ?? ["> idle"]).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {agent.metrics.sessions.toLocaleString()} sessions
                  </span>
                  <Badge variant="outline">
                    {agent.metrics.successRate}% success
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
