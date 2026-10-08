"use client"

import { useTranslations } from "next-intl"
import { ChartNoAxesCombinedIcon } from "lucide-react"

import { DashboardEmpty } from "@/components/dashboard-empty"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export function ChartAreaInteractive() {
  const t = useTranslations("Dashboard")
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("activity")}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {t("workspaceActivity")}
          </span>
          <span className="@[540px]/card:hidden">{t("activity")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <DashboardEmpty
          icon={ChartNoAxesCombinedIcon}
          title={t("noActivityTitle")}
          description={t("noActivityDescription")}
          className="h-[250px] border"
        />
      </CardContent>
    </Card>
  )
}
