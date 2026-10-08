import { getTranslations } from "next-intl/server"
import { CircleHelpIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"

export default async function HelpPage() {
  const t = await getTranslations("AppPages")
  return (
    <div className="flex flex-1 flex-col px-4 py-4 md:py-6 lg:px-6">
      <DashboardEmpty
        icon={CircleHelpIcon}
        title={t("helpTitle")}
        description={t("helpDescription")}
        className="flex-1 border"
      />
    </div>
  )
}
