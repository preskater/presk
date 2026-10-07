"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CirclePlusIcon, MailIcon } from "lucide-react"

import { ProjectFormDialog } from "@/components/project/project-dialog"
import { Button } from "@workspace/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"

import { useMessaging } from "@/lib/messaging/store"
import { useRecents, type AppKey } from "@/lib/recents/store"

export interface NavApp {
  key?: AppKey
  title: string
  url: string
  icon: React.ReactNode
}

export function NavMain({ items }: { items: NavApp[] }) {
  const pathname = usePathname()
  const router = useRouter()
  const { recents, setActive } = useRecents()
  const { unreadTotal } = useMessaging()

  function openRecent(app: NavApp, id: string) {
    if (!app.key) return
    setActive(app.key, id)
    router.push(app.url)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <ProjectFormDialog
              trigger={
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <CirclePlusIcon />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              }
            />
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              render={<Link href="/dashboard/messages" />}
              nativeButton={false}
            >
              <MailIcon />
              <span className="sr-only">Messages</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const entries = item.key ? recents[item.key].slice(0, 3) : []
            const active =
              pathname === item.url || pathname.startsWith(`${item.url}/`)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={active}
                  render={<Link href={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.key === "messages" && unreadTotal > 0 ? (
                  <SidebarMenuBadge>{unreadTotal}</SidebarMenuBadge>
                ) : null}
                {item.key && entries.length > 0 ? (
                  <SidebarMenuSub>
                    {entries.map((entry) => (
                      <SidebarMenuSubItem key={entry.id}>
                        <SidebarMenuSubButton
                          render={<button type="button" />}
                          onClick={() => openRecent(item, entry.id)}
                        >
                          <span className="truncate">{entry.label}</span>
                          {entry.hint ? (
                            <span className="ms-auto truncate text-xs text-sidebar-foreground/60">
                              {entry.hint}
                            </span>
                          ) : null}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
