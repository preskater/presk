import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

export function AuthHomeButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      nativeButton={false}
      render={<Link href="/" />}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      Back to home
    </Button>
  )
}
