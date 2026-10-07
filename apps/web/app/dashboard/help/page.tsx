import { CircleHelpIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
      <DashboardEmpty
        icon={CircleHelpIcon}
        title="Get help"
        description="Guides and support resources will appear here."
        className="flex-1 border"
      />
    </div>
  )
}
