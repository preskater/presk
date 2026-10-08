import Link from "next/link"
import { CalendarXIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

import { getActiveOrgSlug } from "@/lib/organization/paths"

export default async function CalendarsNotFound() {
  const orgSlug = await getActiveOrgSlug()
  const calendarsHref = orgSlug ? `/${orgSlug}/calendars` : "/onboarding"

  return (
    <NotFoundState
      icon={CalendarXIcon}
      title="Calendar not found"
      description="This calendar or event may have been deleted or the link is incorrect."
      actions={
        <Button nativeButton={false} render={<Link href={calendarsHref} />}>
          Back to calendars
        </Button>
      }
    />
  )
}
