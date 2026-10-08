import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { AssistantBar } from "@/components/assistant/assistant-bar"
import { OrganizationSync } from "@/components/organization/organization-sync"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { auth } from "@/lib/auth"
import { calendarService } from "@/lib/calendars"
import { getRequestContextForOrganization } from "@/lib/core/auth-context"
import { fileService } from "@/lib/files"
import { messagingService } from "@/lib/messaging"
import { projectService } from "@/lib/projects"
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

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  })

  if (organizations.length === 0) {
    redirect("/onboarding")
  }

  const sessionOrganizationId = session.session.activeOrganizationId ?? null

  const needsSync =
    !sessionOrganizationId ||
    !organizations.some((org) => org.id === sessionOrganizationId)

  const activeOrganizationId =
    needsSync
      ? (organizations[0]?.id ?? null)
      : sessionOrganizationId

  if (!activeOrganizationId) {
    redirect("/onboarding")
  }

  const ctx = await getRequestContextForOrganization(activeOrganizationId)

  const [projectData, calendarData, filesData, messagingData] =
    await Promise.all([
      projectService.list(ctx),
      calendarService.list(ctx),
      fileService.list(ctx),
      messagingService.list(ctx),
    ])

  return (
    <TooltipProvider>
      <RecentsProvider organizationId={activeOrganizationId}>
        <ProjectStoreProvider
          initialData={projectData}
          currentUserId={ctx.userId}
        >
          <MessagingProvider
            initialData={messagingData}
            currentUserId={ctx.userId}
            members={projectData.members}
          >
            <CalendarsProvider
              initialData={calendarData}
              currentUserId={ctx.userId}
              members={projectData.members}
            >
              <FilesProvider
                initialData={filesData}
                currentUserId={ctx.userId}
                members={projectData.members}
              >
                <SidebarProvider
                  style={
                    {
                      "--sidebar-width": "calc(var(--spacing) * 72)",
                      "--header-height": "calc(var(--spacing) * 12)",
                      "--assistant-bar-space": "calc(var(--spacing) * 18)",
                    } as React.CSSProperties
                  }
                >
                  {needsSync && activeOrganizationId ? (
                    <OrganizationSync
                      needsSync={needsSync}
                      organizationId={activeOrganizationId}
                    />
                  ) : null}
                  <AppSidebar
                    variant="inset"
                    user={session.user}
                    activeOrganizationId={activeOrganizationId}
                  />
                  <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                      <div className="@container/main flex flex-1 flex-col gap-2 pb-[var(--assistant-bar-space)]">
                        {children}
                      </div>
                    </div>
                  </SidebarInset>
                  <AssistantBar />
                </SidebarProvider>
              </FilesProvider>
            </CalendarsProvider>
          </MessagingProvider>
        </ProjectStoreProvider>
      </RecentsProvider>
    </TooltipProvider>
  )
}
