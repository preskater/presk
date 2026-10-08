import Link from "next/link"
import { FolderXIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

import { getActiveOrgSlug } from "@/lib/organization/paths"

export default async function ProjectNotFound() {
  const orgSlug = await getActiveOrgSlug()
  const projectsHref = orgSlug ? `/${orgSlug}/projects` : "/onboarding"

  return (
    <NotFoundState
      icon={FolderXIcon}
      title="Project not found"
      description="This project may have been deleted or the link is incorrect."
      actions={
        <Button nativeButton={false} render={<Link href={projectsHref} />}>
          Back to projects
        </Button>
      }
    />
  )
}
