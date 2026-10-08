"use client"

import Link from "next/link"
import { FolderXIcon } from "lucide-react"

import { ProjectView } from "@/components/project/project-view"
import { DashboardEmpty } from "@/components/dashboard-empty"
import { Button } from "@workspace/ui/components/button"

import { useProjectStore } from "@/lib/projects/store"
import { useOrgSlug } from "@/lib/organization/use-org-slug"

export function ProjectWorkspace({ projectId }: { projectId: string }) {
  const { getProject } = useProjectStore()
  const orgSlug = useOrgSlug()
  const project = getProject(projectId)

  if (!project) {
    return (
      <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
        <DashboardEmpty
          icon={FolderXIcon}
          title="Project not found"
          description="This project may have been deleted or the link is incorrect."
          className="flex-1 border"
          action={
            <Button render={<Link href={`/${orgSlug}/projects`} />} nativeButton={false}>
              Back to projects
            </Button>
          }
        />
      </div>
    )
  }

  return <ProjectView project={project} />
}
