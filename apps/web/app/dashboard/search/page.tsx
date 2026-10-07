import { SearchIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"

export default function SearchPage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
      <DashboardEmpty
        icon={SearchIcon}
        title="Search"
        description="Search across your projects, messages, and files."
        className="flex-1 border"
      />
    </div>
  )
}
