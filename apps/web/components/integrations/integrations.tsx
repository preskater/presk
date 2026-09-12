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
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { PlusIcon } from "lucide-react"

import { integrations, webhooks, webhookEvents } from "@/lib/data"

const statusClass: Record<string, string> = {
  up: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  down: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  degraded:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function Integrations() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Integrations</h2>
          <p className="text-sm text-muted-foreground">
            Tools marketplace and webhooks
          </p>
        </div>
        <Button size="sm">
          <PlusIcon />
          Add Integration
        </Button>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList>
          <TabsTrigger value="marketplace">Tools Marketplace</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="pt-4">
          <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle>{integration.name}</CardTitle>
                      <CardDescription>
                        {integration.category} · {integration.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusClass[integration.status]}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>Endpoint</Label>
                    <Input defaultValue={integration.endpoint} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Latency</span>
                    <span>
                      {integration.latency > 0
                        ? `${integration.latency}ms`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rate limit</span>
                    <span>{integration.rateLimit}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {integration.scopes.map((scope) => (
                      <Badge key={scope} variant="secondary">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {webhooks.map((webhook) => (
                <Card key={webhook.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="font-mono text-sm">
                          {webhook.url}
                        </CardTitle>
                        <CardDescription>
                          {webhook.events.join(", ")}
                        </CardDescription>
                      </div>
                      <Switch defaultChecked={webhook.status === "active"} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Success rate: {webhook.successRate}%
                    </span>
                    <span className="text-muted-foreground">
                      Last sent:{" "}
                      {new Date(webhook.lastSent).toLocaleString("en-US")}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Log</CardTitle>
                <CardDescription>Webhook delivery history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader className="bg-muted">
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Payload</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {webhookEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-mono text-sm">
                            {event.event}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                event.status === "success"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString("en-US")}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {event.payload}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
