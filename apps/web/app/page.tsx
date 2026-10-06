import Link from "next/link"

import { Button } from "@workspace/ui/components/button"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>Authentication with Better Auth is configured.</p>
          <div className="mt-4 flex gap-2">
            <Button render={<Link href="/login" />}>Login</Button>
            <Button variant="outline" render={<Link href="/signup" />}>
              Sign up
            </Button>
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
