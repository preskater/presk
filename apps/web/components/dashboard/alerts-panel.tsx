"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { AlertTriangleIcon, InfoIcon, XCircleIcon } from "lucide-react"

import { alerts } from "@/lib/data"

const severityConfig = {
  critical: { icon: XCircleIcon, color: "text-red-500" },
  warning: { icon: AlertTriangleIcon, color: "text-amber-500" },
  info: { icon: InfoIcon, color: "text-sky-500" },
} as const

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts & Notifications</CardTitle>
        <CardDescription>
          Threshold breaches and pending approvals
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <Icon className={`mt-0.5 size-4 ${config.color}`} />
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{alert.title}</span>
                <span className="text-xs text-muted-foreground">
                  {alert.description}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(alert.timestamp).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
