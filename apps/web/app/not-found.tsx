import Link from "next/link"
import { CompassIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center">
      <NotFoundState
        icon={CompassIcon}
        title="Page not found"
        description="We couldn't find the page you were looking for. It may have moved or no longer exists."
        actions={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button nativeButton={false} render={<Link href="/" />}>
              Back to home
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/sign-in" />}
            >
              Sign in
            </Button>
          </div>
        }
      />
    </main>
  )
}
