import Link from "next/link"
import { FileXIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

import { getActiveOrgSlug } from "@/lib/organization/paths"

export default async function FilesNotFound() {
  const orgSlug = await getActiveOrgSlug()
  const filesHref = orgSlug ? `/${orgSlug}/files` : "/onboarding"

  return (
    <NotFoundState
      icon={FileXIcon}
      title="File not found"
      description="This file or folder may have been deleted or the link is incorrect."
      actions={
        <Button nativeButton={false} render={<Link href={filesHref} />}>
          Back to files
        </Button>
      }
    />
  )
}
