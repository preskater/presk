import Link from "next/link"
import { FileQuestionIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

export default function BlogPostNotFound() {
  return (
    <NotFoundState
      icon={FileQuestionIcon}
      title="Post not found"
      description="This article doesn't exist or may have been removed."
      className="min-h-[70svh]"
      actions={
        <Button nativeButton={false} render={<Link href="/blog" />}>
          Back to all posts
        </Button>
      }
    />
  )
}
