import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

import { getActiveOrgSlug } from "@/lib/organization/paths"

export default async function OrganizationNotFound() {
  const orgSlug = await getActiveOrgSlug()
  const dashboardHref = orgSlug ? `/${orgSlug}` : "/onboarding"

  return (
    <NotFoundState
      icon={CompassIcon}
      title="Page not found"
      description="This page doesn't exist in your workspace. It may have been moved or deleted."
      actions={
        <Button nativeButton={false} render={<Link href={dashboardHref} />}>
          Back to dashboard
        </Button>
      }
    />
  )
}
