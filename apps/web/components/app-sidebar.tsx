"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
  LayoutDashboardIcon,
  BotIcon,
  PlayIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  SettingsIcon,
  PlugIcon,
  CommandIcon,
  MessageSquareIcon,
  Grid3x3Icon,
} from "lucide-react"

const navGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartBarIcon,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Agents",
        url: "/agents",
        icon: BotIcon,
      },
      {
        title: "Sessions",
        url: "/sessions",
        icon: PlayIcon,
      },
      {
        title: "Approvals",
        url: "/approvals",
        icon: ShieldCheckIcon,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Integrations",
        url: "/integrations",
        icon: PlugIcon,
      },
      {
        title: "Playground",
        url: "/playground",
        icon: MessageSquareIcon,
      },
      {
        title: "Multi-Agent",
        url: "/multi-agent",
        icon: Grid3x3Icon,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: SettingsIcon,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

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
        <NavMain groups={navGroups} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "Sarah Chen",
            email: "sarah@acme.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
