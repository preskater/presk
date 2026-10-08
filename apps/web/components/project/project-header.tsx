"use client"

import Link from "next/link"
import { EllipsisIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { MemberAvatar } from "@/components/task/member-avatar"
import { TaskFormDialog } from "@/components/task/task-dialog"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"

import { useProjectStore } from "@/lib/projects/store"
import { useOrgSlug } from "@/lib/organization/use-org-slug"
import {
  formatDate,
  type Project,
  type ProjectStatus,
} from "@/lib/projects/types"

const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
}

export function ProjectHeader({
  project,
  onDeleted,
}: {
  project: Project
  onDeleted: () => void
}) {
  const { getMember, deleteProject } = useProjectStore()
  const orgSlug = useOrgSlug()
  const members = project.memberIds
    .map((id) => getMember(id))
    .filter((member) => member !== undefined)

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/${orgSlug}/projects`} />}>
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <Badge variant="outline">
              {PROJECT_STATUS_LABEL[project.status]}
            </Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {project.description ?? "No description"}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((member) => (
                  <Tooltip key={member.id}>
                    <TooltipTrigger
                      render={<span className="inline-flex" />}
                    >
                      <MemberAvatar member={member} size="sm" />
                    </TooltipTrigger>
                    <TooltipContent>{member.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <span>
                {members.length} member{members.length === 1 ? "" : "s"}
              </span>
            </div>
            {project.dueDate ? (
              <span>Target {formatDate(project.dueDate)}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TaskFormDialog
            projectId={project.id}
            trigger={
              <Button>
                <PlusIcon data-icon="inline-start" />
                Create task
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" />}
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
                        This will permanently remove “{project.name}” and all of
                        its tasks. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => {
                          deleteProject(project.id)
                          onDeleted()
                        }}
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
      </div>
    </div>
  )
}
