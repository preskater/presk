"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { ProjectFilters, defaultFilters, filterTasks, type TaskFilters } from "@/components/project/project-filters"
import { ProjectHeader } from "@/components/project/project-header"
import { ProjectOverview } from "@/components/project/project-overview"
import { ProjectSettings } from "@/components/project/project-settings"
import { TaskBoard } from "@/components/task/task-board"
import { TaskCalendar } from "@/components/task/task-calendar"
import { TaskDetails } from "@/components/task/task-details"
import { TaskList } from "@/components/task/task-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { useProjectStore } from "@/lib/projects/store"
import { useRecents } from "@/lib/recents/store"
import type { Project } from "@/lib/projects/types"

export function ProjectView({ project }: { project: Project }) {
  const router = useRouter()
  const store = useProjectStore()
  const { record } = useRecents()
  const [filters, setFilters] = React.useState<TaskFilters>(defaultFilters)
  const [activeTaskId, setActiveTaskId] = React.useState<string | undefined>()
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [tab, setTab] = React.useState("overview")

  const currentUserId = store.members[0]?.id ?? "u_aria"
  const projectTasks = store.tasksForProject(project.id)
  const filteredTasks = filterTasks(projectTasks, filters, currentUserId)

  React.useEffect(() => {
    record("projects", {
      id: project.id,
      label: project.name,
      hint: `${projectTasks.length} task${projectTasks.length === 1 ? "" : "s"}`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  function openTask(taskId: string) {
    setActiveTaskId(taskId)
    setDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <ProjectHeader
        project={project}
        onDeleted={() => router.push("/dashboard/projects")}
      />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as string)}
        className="flex flex-1 flex-col gap-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>

        {tab !== "overview" && tab !== "settings" ? (
          <ProjectFilters filters={filters} onChange={setFilters} />
        ) : null}

        <TabsContent value="overview">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="board">
          <TaskBoard
            projectId={project.id}
            tasks={filteredTasks}
            onOpen={openTask}
          />
        </TabsContent>

        <TabsContent value="list">
          <TaskList tasks={filteredTasks} onOpen={openTask} />
        </TabsContent>

        <TabsContent value="calendar">
          <TaskCalendar tasks={filteredTasks} onOpen={openTask} />
        </TabsContent>

        <TabsContent value="settings">
          <ProjectSettings project={project} />
        </TabsContent>
      </Tabs>

      <TaskDetails
        taskId={activeTaskId}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
}
