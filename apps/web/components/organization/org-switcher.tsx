"use client"

import * as React from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Building2Icon, CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/organization/utils"

export function OrgSwitcher({
  activeOrganizationId,
}: {
  activeOrganizationId: string | null
}) {
  const router = useRouter()
  const t = useTranslations("Org")
  const { data: organizations, isPending } =
    authClient.useListOrganizations()
  const [switching, setSwitching] = React.useState(false)

  const active = organizations?.find(
    (organization) => organization.id === activeOrganizationId
  )

  async function switchOrganization(organization: {
    id: string
    slug: string
  }) {
    if (organization.id === activeOrganizationId) return
    setSwitching(true)
    const { error } = await authClient.organization.setActive({
      organizationId: organization.id,
    })
    if (error) {
      toast.error(error.message ?? t("unableToSwitchOrganization"))
      setSwitching(false)
      return
    }
    router.push(`/${organization.slug}`)
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2Icon className="size-4" />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">
                {isPending
                  ? t("loading")
                  : (active?.name ?? t("selectOrganization"))}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {active?.slug ?? t("workspace")}
              </span>
            </div>
            <ChevronsUpDownIcon className="ms-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("organizations")}
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {(organizations ?? []).map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  disabled={switching}
                  onClick={() => switchOrganization(organization)}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <span className="text-xs">
                      {getInitials(organization.name)}
                    </span>
                  </div>
                  <span className="flex-1 truncate">{organization.name}</span>
                  {organization.id === activeOrganizationId ? (
                    <CheckIcon className="size-4" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/onboarding?create=1")
                router.refresh()
              }}
            >
              <PlusIcon />
              {t("createOrganization")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
