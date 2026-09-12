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
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { ArrowLeftIcon } from "lucide-react"

import { approvalRules } from "@/lib/data"

export function ApprovalRules() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/approvals" />}
        >
          <ArrowLeftIcon />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Approval Rules</h2>
          <p className="text-sm text-muted-foreground">
            Per-agent policies and thresholds
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {approvalRules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle>{rule.agentName}</CardTitle>
                  <CardDescription>Approval policy</CardDescription>
                </div>
                <Switch defaultChecked={!rule.autoApprove} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-1.5">
                {rule.actionTypes.map((action) => (
                  <Badge key={action} variant="secondary">
                    {action}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Threshold (€)</Label>
                  <Input defaultValue={String(rule.threshold)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Escalation timeout (min)</Label>
                  <Input defaultValue={String(rule.escalationTimeout)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Escalation contact</Label>
                <Input defaultValue={rule.escalation} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
