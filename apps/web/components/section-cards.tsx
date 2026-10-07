"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

import { useProjectStore } from "@/lib/projects/store"

export function SectionCards() {
  const { projects, tasks, members } = useProjectStore()

  const metrics = [
    {
      label: "Active Projects",
      value: projects.filter((project) => project.status === "active").length,
      hint: `${projects.length} total`,
    },
    {
      label: "Open Tasks",
      value: tasks.filter((task) => task.status !== "done").length,
      hint: `${tasks.filter((task) => task.status === "done").length} completed`,
    },
    {
      label: "Team Members",
      value: members.length,
      hint: "Across the workspace",
    },
    {
      label: "Projects Paused",
      value: projects.filter((project) => project.status === "paused").length,
      hint: "On hold right now",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {metrics.map((metric) => (
        <Card key={metric.label} className="@container/card">
          <CardHeader>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {metric.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">Live</Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{metric.hint}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
