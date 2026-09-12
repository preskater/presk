"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { agentStatusCounts } from "@/lib/data"

const statusConfig = [
  { key: "active", label: "Active", color: "bg-emerald-500" },
  { key: "idle", label: "Idle", color: "bg-sky-500" },
  { key: "error", label: "Error", color: "bg-red-500" },
  { key: "stalled", label: "Stalled", color: "bg-amber-500" },
] as const

const quotas = [
  { label: "SLA target", value: 92, target: "95% on-time" },
  { label: "Usage quota", value: 68, target: "5,000 sessions/day" },
  { label: "Budget consumed", value: 82, target: "$10,000 / month" },
]

export function SystemStatus() {
  const total = Object.values(agentStatusCounts).reduce((a, b) => a + b, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Agent health check</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {statusConfig.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-2 rounded-lg border p-3"
            >
              <span className={`size-2.5 rounded-full ${s.color}`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{s.label}</span>
                <span className="text-xs text-muted-foreground">
                  {agentStatusCounts[s.key]} of {total} agents
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {quotas.map((q) => (
            <div key={q.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{q.label}</span>
                <span className="text-muted-foreground">{q.target}</span>
              </div>
              <Progress value={q.value} className="w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
