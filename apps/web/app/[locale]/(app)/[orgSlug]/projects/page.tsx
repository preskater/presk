import { ProjectFormDialog } from "@/components/project/project-dialog"
import { ProjectsGrid } from "@/components/project/projects-grid"
import { Button } from "@workspace/ui/components/button"

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Track progress across every initiative in your workspace.
          </p>
        </div>
        <ProjectFormDialog trigger={<Button>Create project</Button>} />
      </div>
      <ProjectsGrid />
    </div>
  )
}
