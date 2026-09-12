"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { topAgents } from "@/lib/data"

export function TopAgents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Agents</CardTitle>
        <CardDescription>Ranked by sessions</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {topAgents.map((agent, i) => (
          <div
            key={agent.name}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {i + 1}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{agent.name}</span>
              <span className="text-xs text-muted-foreground">
                {agent.sessions.toLocaleString()} sessions · $
                {agent.cost.toLocaleString()} cost
              </span>
            </div>
            <span className="text-sm font-medium tabular-nums">
              {agent.satisfaction.toFixed(1)}★
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
