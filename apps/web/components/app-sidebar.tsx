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

const navMain: NavApp[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    key: "projects",
    title: "Projects",
    url: "/dashboard/projects",
    icon: <FolderIcon />,
  },
  {
    key: "messages",
    title: "Messages",
    url: "/dashboard/messages",
    icon: <MessageSquareIcon />,
  },
  {
    key: "calendars",
    title: "Calendars",
    url: "/dashboard/calendars",
    icon: <CalendarIcon />,
  },
  {
    key: "files",
    title: "Files",
    url: "/dashboard/files",
    icon: <FileIcon />,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: <SearchIcon />,
  },
  {
    title: "Get Help",
    url: "/dashboard/help",
    icon: <CircleHelpIcon />,
  },
]

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    image?: string | null
  }
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/dashboard" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Presk</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
