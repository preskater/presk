import Link from "next/link"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 py-2 text-center text-sm">
        <SparklesIcon className="size-4 shrink-0" />
        <span>New: AI-powered workflows are here.</span>
        <Link
          href="/blog/ai-native-workflows"
          className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
        >
          See what&apos;s new
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
