"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"
import {
  LayoutDashboardIcon,
  BotIcon,
  PlayIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  SettingsIcon,
  PlugIcon,
  PlusIcon,
} from "lucide-react"

const pages = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboardIcon },
  { title: "Agents", url: "/agents", icon: BotIcon },
  { title: "Sessions", url: "/sessions", icon: PlayIcon },
  { title: "Approvals", url: "/approvals", icon: ShieldCheckIcon },
  { title: "Analytics", url: "/analytics", icon: ChartBarIcon },
  { title: "Integrations", url: "/integrations", icon: PlugIcon },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
]

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest("[data-command-trigger]")) {
        setOpen(true)
      }
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Search agents, sessions, users, logs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {pages.map((page) => (
              <CommandItem
                key={page.url}
                value={page.title}
                onSelect={() => run(() => router.push(page.url))}
              >
                <page.icon />
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick actions">
            <CommandItem
              value="create agent"
              onSelect={() => run(() => router.push("/agents/new"))}
            >
              <PlusIcon />
              Create agent
            </CommandItem>
            <CommandItem
              value="view approvals"
              onSelect={() => run(() => router.push("/approvals"))}
            >
              <ShieldCheckIcon />
              View approvals
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
