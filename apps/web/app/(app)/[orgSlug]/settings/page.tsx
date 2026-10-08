import { OrganizationSettings } from "@/components/organization/organization-settings"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your organization, members and roles.
        </p>
      </div>
      <OrganizationSettings />
    </div>
  )
}
