import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

export default function MarketingNotFound() {
  return (
    <NotFoundState
      icon={CompassIcon}
      title="Page not found"
      description="We couldn't find that page. It may have been moved, or the link is incorrect."
      className="min-h-[70svh]"
      actions={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button nativeButton={false} render={<Link href="/" />}>
            Back to home
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/blog" />}
          >
            Read the blog
          </Button>
        </div>
      }
    />
  )
}
