"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { DownloadIcon } from "lucide-react"

import { sessions, agents } from "@/lib/data"
import type { SessionStatus } from "@/lib/types"

const statusClass: Record<SessionStatus, string> = {
  running: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  completed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  failed: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function SessionList() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<string>("all")
  const [agent, setAgent] = React.useState<string>("all")

  const filtered = sessions.filter((s) => {
    if (status !== "all" && s.status !== status) return false
    if (agent !== "all" && s.agentId !== agent) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = [s.id, s.agentName, s.user, ...s.tags]
        .join(" ")
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  const exportData = (format: "csv" | "json") => {
    const rows = filtered.map((s) => ({
      id: s.id,
      agent: s.agentName,
      status: s.status,
      duration: s.duration,
      cost: s.cost,
      timestamp: s.timestamp,
    }))
    const content =
      format === "json"
        ? JSON.stringify(rows, null, 2)
        : [
            "id,agent,status,duration,cost,timestamp",
            ...rows.map((r) =>
              [r.id, r.agent, r.status, r.duration, r.cost, r.timestamp].join(
                ","
              )
            ),
          ].join("\n")
    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sessions.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sessions</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {sessions.length} sessions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("csv")}
            >
              <DownloadIcon />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("json")}
            >
              <DownloadIcon />
              JSON
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by ID, agent, user, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={agent} onValueChange={(v) => setAgent(v ?? "all")}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All agents</SelectItem>
              {agents.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mx-4 overflow-hidden rounded-lg border lg:mx-6">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Link
                    href={`/sessions/${s.id}`}
                    className="font-mono text-sm hover:underline"
                  >
                    {s.id}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {s.agentName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusClass[s.status]}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {s.duration}s
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ${s.cost.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(s.timestamp).toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
