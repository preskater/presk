"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"
import { SearchIcon } from "lucide-react"

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  agents: "Agents",
  sessions: "Sessions",
  approvals: "Approvals",
  analytics: "Analytics",
  integrations: "Integrations",
  settings: "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const root = segments[0] ?? "dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/${root}`} />}>
                {titles[root] ?? root}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments.length > 1 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">
                    {segments[segments.length - 1]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ms-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-muted-foreground"
            data-command-trigger
          >
            <SearchIcon className="size-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>
    </header>
  )
}
