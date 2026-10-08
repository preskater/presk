"use client"

import Link from "next/link"
import {
  CalendarIcon,
  CircleHelpIcon,
  CommandIcon,
  FileIcon,
  FolderIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react"

import { NavMain, type NavApp } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { OrgSwitcher } from "@/components/organization/org-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

function buildNavMain(orgSlug: string): NavApp[] {
  return [
    {
      title: "Dashboard",
      url: `/${orgSlug}`,
      icon: <LayoutDashboardIcon />,
    },
    {
      key: "projects",
      title: "Projects",
      url: `/${orgSlug}/projects`,
      icon: <FolderIcon />,
    },
    {
      key: "messages",
      title: "Messages",
      url: `/${orgSlug}/messages`,
      icon: <MessageSquareIcon />,
    },
    {
      key: "calendars",
      title: "Calendars",
      url: `/${orgSlug}/calendars`,
      icon: <CalendarIcon />,
    },
    {
      key: "files",
      title: "Files",
      url: `/${orgSlug}/files`,
      icon: <FileIcon />,
    },
  ]
}

function buildNavSecondary(orgSlug: string) {
  return [
    {
      title: "Settings",
      url: `/${orgSlug}/settings`,
      icon: <Settings2Icon />,
    },
    {
      title: "Search",
      url: `/${orgSlug}/search`,
      icon: <SearchIcon />,
    },
    {
      title: "Get Help",
      url: `/${orgSlug}/help`,
      icon: <CircleHelpIcon />,
    },
  ]
}

export function AppSidebar({
  user,
  orgSlug,
  activeOrganizationId,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    image?: string | null
  }
  orgSlug: string
  activeOrganizationId: string | null
}) {
  const navMain = buildNavMain(orgSlug)
  const navSecondary = buildNavSecondary(orgSlug)
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href={`/${orgSlug}`} />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Presk</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <OrgSwitcher activeOrganizationId={activeOrganizationId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
