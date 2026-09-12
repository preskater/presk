"use client"

import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { ArrowLeftIcon, FileIcon, RotateCwIcon } from "lucide-react"

import { sessions } from "@/lib/data"

export function SessionDetail({ id }: { id: string }) {
  const session = sessions.find((s) => s.id === id)
  if (!session) notFound()

  const isRunning = session.status === "running"

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/sessions" />}
        >
          <ArrowLeftIcon />
        </Button>
        <div className="flex flex-1 flex-col">
          <h2 className="font-mono text-lg font-semibold">{session.id}</h2>
          <p className="text-sm text-muted-foreground">
            {session.agentName} · {session.user}
          </p>
        </div>
        <Badge variant="outline">{session.status}</Badge>
        <Button variant="outline" size="sm">
          <RotateCwIcon />
          Replay
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Duration" value={`${session.duration}s`} />
        <Stat label="Cost" value={`$${session.cost.toFixed(2)}`} />
        <Stat label="Turns" value={String(session.turns.length)} />
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
          <TabsTrigger value="debug">Replay / Debug</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Timeline</CardTitle>
              <CardDescription>
                {isRunning
                  ? "Live streaming"
                  : "Each turn with input and output"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {session.turns.map((turn) => (
                <div
                  key={turn.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <Badge
                    variant="outline"
                    className={
                      turn.role === "assistant"
                        ? "bg-primary/10"
                        : turn.role === "tool"
                          ? "bg-muted"
                          : "bg-secondary"
                    }
                  >
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
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {turn.duration}s
                    </span>
                    {turn.status === "error" && (
                      <Badge variant="destructive">error</Badge>
                    )}
                  </div>
                </div>
              ))}
              {session.turns.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No turns yet. Session is pending.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artifacts" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Artifacts</CardTitle>
              <CardDescription>Files produced by the agent</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {session.artifacts.map((artifact) => (
                <div
                  key={artifact.name}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <FileIcon className="size-4 text-muted-foreground" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{artifact.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {artifact.type} · {artifact.size}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
              {session.artifacts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No artifacts generated.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Replay / Debug</CardTitle>
              <CardDescription>Re-run or modify an input</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Re-run this session with the same inputs, or modify an input to
                compare results.
              </p>
              <Separator />
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RotateCwIcon />
                  Re-run session
                </Button>
                <Button variant="outline" size="sm">
                  Modify input
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}
