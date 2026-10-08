import Link from "next/link"
import { FileQuestionIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

export default function LegalDocumentNotFound() {
  return (
    <NotFoundState
      icon={FileQuestionIcon}
      title="Document not found"
      description="This legal document doesn't exist or may have been moved."
      className="min-h-[70svh]"
      actions={
        <Button nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      }
    />
  )
}
