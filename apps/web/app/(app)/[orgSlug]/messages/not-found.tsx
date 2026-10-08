import Link from "next/link"
import { MessageSquareXIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

import { getActiveOrgSlug } from "@/lib/organization/paths"

export default async function MessagesNotFound() {
  const orgSlug = await getActiveOrgSlug()
  const messagesHref = orgSlug ? `/${orgSlug}/messages` : "/onboarding"

  return (
    <NotFoundState
      icon={MessageSquareXIcon}
      title="Conversation not found"
      description="This conversation may have been deleted or you no longer have access to it."
      actions={
        <Button nativeButton={false} render={<Link href={messagesHref} />}>
          Back to messages
        </Button>
      }
    />
  )
}
