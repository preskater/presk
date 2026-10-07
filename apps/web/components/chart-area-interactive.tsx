"use client"

import { ChartNoAxesCombinedIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Your workspace activity
          </span>
          <span className="@[540px]/card:hidden">Activity</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <DashboardEmpty
          icon={ChartNoAxesCombinedIcon}
          title="No activity yet"
          description="Activity from your projects, messages, and files will show up here."
          className="h-[250px] border"
        />
      </CardContent>
    </Card>
  )
}
