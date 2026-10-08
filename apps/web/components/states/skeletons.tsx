import { Skeleton } from "@workspace/ui/components/skeleton"

function SkeletonHeader() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-64 max-w-full" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <Skeleton className="h-72 rounded-xl" />
      </div>
      <div className="px-4 lg:px-6">
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <SkeletonHeader />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>
      <div className="@container/main grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <SkeletonHeader />
      <div className="flex flex-col gap-4 pt-2">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  )
}

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-[calc(100svh_-_var(--header-height)_-_var(--assistant-bar-space))] min-h-0 gap-4 overflow-hidden p-4 md:h-[calc(100svh_-_var(--header-height)_-_var(--assistant-bar-space)_-_1rem)]">
      <div className="hidden w-64 shrink-0 flex-col gap-3 lg:flex">
        <Skeleton className="h-8 w-full rounded-lg" />
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Skeleton className="h-10 w-72 max-w-full rounded-lg" />
        <Skeleton className="flex-1 rounded-xl" />
      </div>
    </div>
  )
}

export function ProjectWorkspaceSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <SkeletonHeader />
      </div>
      <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function MarketingSkeleton() {
  return (
    <div className="min-h-[60svh]">
      <section className="border-b bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-10 w-80 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </section>
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function ProseSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-16">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}

export function FullPageSkeleton() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Skeleton className="size-10 rounded-xl" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <Skeleton className="mt-2 h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
