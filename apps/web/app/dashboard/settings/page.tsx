import { Settings2Icon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
      <DashboardEmpty
        icon={Settings2Icon}
        title="Settings"
        description="Workspace and account settings will appear here."
        className="flex-1 border"
      />
    </div>
  )
}
