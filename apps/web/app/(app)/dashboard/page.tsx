import { ActivityChart } from "@/components/dashboard/activity-chart"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { SystemStatus } from "@/components/dashboard/system-status"
import { TopAgents } from "@/components/dashboard/top-agents"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <KpiCards />
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-3">
        <div className="@3xl/main:col-span-2">
          <ActivityChart />
        </div>
        <SystemStatus />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        <TopAgents />
        <AlertsPanel />
      </div>
    </div>
  )
}
