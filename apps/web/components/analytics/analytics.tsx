"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { DownloadIcon, SparklesIcon, TrendingUpIcon } from "lucide-react"

import { topAgents } from "@/lib/data"

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--primary)" },
  cost: { label: "Cost", color: "var(--chart-2)" },
} satisfies ChartConfig

const tenantData = [
  { tenant: "Acme", sessions: 3200, cost: 780, satisfaction: 4.4 },
  { tenant: "Globex", sessions: 1800, cost: 504, satisfaction: 4.1 },
]

const trendData = [
  { period: "W1", sessions: 420, cost: 180 },
  { period: "W2", sessions: 510, cost: 210 },
  { period: "W3", sessions: 480, cost: 195 },
  { period: "W4", sessions: 640, cost: 260 },
]

export function Analytics() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            KPIs, trends, and segmentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="month">
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <DownloadIcon />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboards" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="pt-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>KPIs by Tenant</CardTitle>
                  <CardDescription>Usage and cost per tenant</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <BarChart data={tenantData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="tenant"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar
                        dataKey="sessions"
                        fill="var(--color-sessions)"
                        radius={4}
                      />
                      <Bar dataKey="cost" fill="var(--color-cost)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trends</CardTitle>
                  <CardDescription>Period-over-period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                  >
                    <BarChart data={trendData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="period"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar
                        dataKey="sessions"
                        fill="var(--color-sessions)"
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Segmentation</CardTitle>
                <CardDescription>By agent</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {topAgents.map((agent) => (
                  <div
                    key={agent.name}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {agent.sessions.toLocaleString()} sessions
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${agent.cost.toLocaleString()}
                    </span>
                    <Badge variant="outline">
                      {agent.satisfaction.toFixed(1)}★
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-3">
            <ReportCard
              title="Activity Report"
              description="Weekly/monthly key metrics"
              format="PDF / CSV"
            />
            <ReportCard
              title="Cost Report"
              description="Breakdown by agent, project, tenant"
              format="CSV"
            />
            <ReportCard
              title="Performance Report"
              description="SLA compliance, response times, errors"
              format="PDF / CSV"
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pt-4">
          <div className="flex flex-col gap-3">
            <InsightCard
              icon={<TrendingUpIcon className="size-4 text-amber-500" />}
              title="Usage spike detected"
              description="Sessions increased 42% between 14:00–16:00. Consider scaling the Support Assistant."
            />
            <InsightCard
              icon={<SparklesIcon className="size-4 text-sky-500" />}
              title="Underused tool"
              description="The S3 tool has been connected but unused for 14 days. Review or disconnect it."
            />
            <InsightCard
              icon={<TrendingUpIcon className="size-4 text-red-500" />}
              title="Cost drift"
              description="Billing Analyst cost/session rose 18% this week. Consider lowering max tokens."
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportCard({
  title,
  description,
  format,
}: {
  title: string
  description: string
  format: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Badge variant="outline" className="w-fit">
          {format}
        </Badge>
        <Button variant="outline" size="sm" className="w-fit">
          <DownloadIcon />
          Download
        </Button>
      </CardContent>
    </Card>
  )
}

function InsightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-4">
        {icon}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
