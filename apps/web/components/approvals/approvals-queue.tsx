"use client"

import * as React from "react"
import Link from "next/link"

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { CheckIcon, XIcon, ArrowUpIcon, MessageSquareIcon } from "lucide-react"

import { approvals } from "@/lib/data"
import type { RiskLevel } from "@/lib/types"

const riskClass: Record<RiskLevel, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium:
    "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
}

export function ApprovalsQueue() {
  const pending = approvals.filter((a) => a.status === "pending")
  const decided = approvals.filter((a) => a.status !== "pending")

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Approvals</h2>
          <p className="text-sm text-muted-foreground">
            {pending.length} pending · {decided.length} decided
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/approvals/rules" />}
        >
          Configure rules
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="history">Decision History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="pt-4">
          <div className="flex flex-col gap-3">
            {pending.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle>{approval.action}</CardTitle>
                      <CardDescription>
                        {approval.agentName} · requested by{" "}
                        {approval.requestedBy}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={riskClass[approval.risk]}
                    >
                      {approval.risk} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Context</span>
                    <span>{approval.context}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Justification</span>
                    <span>{approval.justification}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground">Impact</span>
                    <span>{approval.impact}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Deadline</span>
                    <span>
                      {new Date(approval.deadline).toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm">
                      <CheckIcon />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      <XIcon />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline">
                      <ArrowUpIcon />
                      Escalate
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MessageSquareIcon />
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pending.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No pending approvals.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <div className="flex flex-col gap-3">
            {decided.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <CardTitle>{approval.action}</CardTitle>
                      <CardDescription>{approval.agentName}</CardDescription>
                    </div>
                    <Badge variant="outline">{approval.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {approval.decisions.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{d.by}</span>
                      <span className="text-muted-foreground">{d.action}</span>
                      {d.comment && (
                        <span className="text-muted-foreground">
                          — {d.comment}
                        </span>
                      )}
                      <span className="ms-auto text-xs text-muted-foreground">
                        {new Date(d.at).toLocaleString("en-US")}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
