import { FilesWorkspace } from "@/components/files/files-workspace"

export default function FilesPage() {
  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col overflow-hidden p-4 md:h-[calc(100svh-var(--header-height)-1rem)]">
      <FilesWorkspace />
    </div>
  )
}
