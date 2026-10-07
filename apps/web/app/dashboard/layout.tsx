import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { auth } from "@/lib/auth"
import { CalendarsProvider } from "@/lib/calendars/store"
import { FilesProvider } from "@/lib/files/store"
import { MessagingProvider } from "@/lib/messaging/store"
import { ProjectStoreProvider } from "@/lib/projects/store"
import { RecentsProvider } from "@/lib/recents/store"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <TooltipProvider>
      <RecentsProvider>
        <ProjectStoreProvider>
          <MessagingProvider>
            <CalendarsProvider>
              <FilesProvider>
                <SidebarProvider
                  style={
                    {
                      "--sidebar-width": "calc(var(--spacing) * 72)",
                      "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                  }
                >
                  <AppSidebar variant="inset" user={session.user} />
                  <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                      <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}
                      </div>
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </FilesProvider>
            </CalendarsProvider>
          </MessagingProvider>
        </ProjectStoreProvider>
      </RecentsProvider>
    </TooltipProvider>
  )
}
