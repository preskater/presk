"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

import { activityData } from "@/lib/data"

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--primary)",
  },
  tasks: {
    label: "Tasks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ActivityChart() {
  const [metric, setMetric] = React.useState("sessions")

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Sessions and tasks per hour</CardDescription>
        <CardAction>
          <ToggleGroup
            multiple={false}
            value={[metric]}
            onValueChange={(value) => setMetric(value[0] ?? "sessions")}
            variant="outline"
            className="*:data-[slot=toggle-group-item]:px-3!"
          >
            <ToggleGroupItem value="sessions">Sessions</ToggleGroupItem>
            <ToggleGroupItem value="tasks">Tasks</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sessions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey={metric}
              type="natural"
              fill="url(#fillActivity)"
              stroke={`var(--color-${metric})`}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
