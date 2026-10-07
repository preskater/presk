"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

import { useProjectStore } from "@/lib/projects/store"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projects": "Projects",
  "/dashboard/messages": "Messages",
  "/dashboard/calendars": "Calendars",
  "/dashboard/files": "Files",
  "/dashboard/settings": "Settings",
  "/dashboard/search": "Search",
  "/dashboard/help": "Get Help",
}

function usePageTitle(pathname: string) {
  const { getProject } = useProjectStore()

  if (titles[pathname]) return titles[pathname]
  if (pathname.startsWith("/dashboard/projects/")) {
    const projectId = pathname.split("/")[3]
    return projectId ? (getProject(projectId)?.name ?? "Project") : "Projects"
  }
  return "Dashboard"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = usePageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
