"use client"

import * as React from "react"
import Link from "next/link"

import { AgentStatusBadge } from "@/components/agent-status-badge"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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
import {
  EllipsisVerticalIcon,
  PlusIcon,
  PlayIcon,
  SquareIcon,
  RotateCwIcon,
  CopyIcon,
  ArchiveIcon,
} from "lucide-react"

import { agents, teams, domains } from "@/lib/data"
import type { AgentStatus } from "@/lib/types"

export function AgentList() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState<string>("all")
  const [team, setTeam] = React.useState<string>("all")
  const [domain, setDomain] = React.useState<string>("all")

  const filtered = agents.filter((agent) => {
    if (status !== "all" && agent.status !== status) return false
    if (team !== "all" && agent.team !== team) return false
    if (domain !== "all" && agent.domain !== domain) return false
    if (search) {
      const q = search.toLowerCase()
      const haystack = [agent.name, agent.role, agent.owner, ...agent.tags]
        .join(" ")
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Agents</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} of {agents.length} agents
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/agents/new" />}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search by name, role, tags..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="stalled">Stalled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={team} onValueChange={(v) => setTeam(v ?? "all")}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={domain} onValueChange={(v) => setDomain(v ?? "all")}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All domains</SelectItem>
              {domains.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
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
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <Link
                    href={`/agents/${agent.id}`}
                    className="font-medium hover:underline"
                  >
                    {agent.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.role}
                </TableCell>
                <TableCell>
                  <AgentStatusBadge status={agent.status} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-muted-foreground">
                    {agent.team}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {agent.owner}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(agent.lastActivity).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <AgentActions status={agent.status} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No agents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function AgentActions({ status }: { status: AgentStatus }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="size-8" />}
      >
        <EllipsisVerticalIcon />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {status === "active" ? (
          <DropdownMenuItem>
            <SquareIcon />
            Stop
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <PlayIcon />
            Start
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <RotateCwIcon />
          Restart
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <ArchiveIcon />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
