"use client"

import { useTranslations } from "next-intl"

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
  const t = useTranslations("Dashboard")
  const { projects, tasks, members } = useProjectStore()

  const metrics = [
    {
      label: t("activeProjects"),
      value: projects.filter((project) => project.status === "active").length,
      hint: t("totalCount", { count: projects.length }),
    },
    {
      label: t("openTasks"),
      value: tasks.filter((task) => task.status !== "done").length,
      hint: t("completedCount", {
        count: tasks.filter((task) => task.status === "done").length,
      }),
    },
    {
      label: t("teamMembers"),
      value: members.length,
      hint: t("acrossWorkspace"),
    },
    {
      label: t("projectsPaused"),
      value: projects.filter((project) => project.status === "paused").length,
      hint: t("onHold"),
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
              <Badge variant="outline">{t("live")}</Badge>
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
