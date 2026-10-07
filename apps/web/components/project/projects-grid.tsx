"use client"

import Link from "next/link"
import {
  EllipsisIcon,
  FolderIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"
import { MemberAvatar } from "@/components/task/member-avatar"
import { ProjectFormDialog } from "@/components/project/project-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Progress } from "@workspace/ui/components/progress"

import { useProjectStore } from "@/lib/projects/store"
import { formatDate, type Project } from "@/lib/projects/types"

const PROJECT_STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
}

function ProjectCard({ project }: { project: Project }) {
  const { tasksForProject, getMember, deleteProject } = useProjectStore()
  const tasks = tasksForProject(project.id)
  const done = tasks.filter((task) => task.status === "done").length
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0
  const members = project.memberIds
    .map((id) => getMember(id))
    .filter((member) => member !== undefined)

  return (
    <Card className="group/card relative transition-colors hover:ring-foreground/20">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="line-clamp-1">
              <Link href={`/dashboard/projects/${project.id}`}>
                <span className="absolute inset-0" />
                {project.name}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description ?? "No description"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="relative z-10 shrink-0"
                />
              }
            >
              <EllipsisIcon />
              <span className="sr-only">Project actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <ProjectFormDialog
                  project={project}
                  trigger={
                    <DropdownMenuItem>
                      <PencilIcon />
                      Edit project
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <DropdownMenuItem variant="destructive">
                        <Trash2Icon />
                        Delete project
                      </DropdownMenuItem>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove “{project.name}” and its{" "}
                        {tasks.length} task{tasks.length === 1 ? "" : "s"}. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{PROJECT_STATUS_LABEL[project.status]}</Badge>
          <span className="text-xs text-muted-foreground">
            {done}/{tasks.length} tasks
          </span>
        </div>
        <Progress value={progress} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((member) => (
              <MemberAvatar key={member.id} member={member} size="sm" />
            ))}
          </div>
          {project.dueDate ? (
            <span className="text-xs text-muted-foreground">
              Due {formatDate(project.dueDate)}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectsGrid() {
  const { projects } = useProjectStore()

  if (projects.length === 0) {
    return (
      <DashboardEmpty
        icon={FolderIcon}
        title="No projects yet"
        description="Create a project to start assigning tasks and tracking progress."
        className="flex-1 border"
        action={<ProjectFormDialog trigger={<Button>Create project</Button>} />}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
