"use client"

import { useLocale, useTranslations } from "next-intl"
import { FileIcon } from "lucide-react"

import { Link } from "@/i18n/navigation"
import { DashboardEmpty } from "@/components/dashboard-empty"
import { MemberAvatar } from "@/components/task/member-avatar"
import { StatusBadge } from "@/components/task/task-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { useProjectStore } from "@/lib/projects/store"
import { useOrgSlug } from "@/lib/organization/use-org-slug"
import { formatDate } from "@/lib/projects/types"

export function DataTable() {
  const t = useTranslations("Dashboard")
  const locale = useLocale()
  const { tasks, getMember, getProject } = useProjectStore()
  const orgSlug = useOrgSlug()
  const recent = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="px-4 lg:px-6">
      {recent.length === 0 ? (
        <DashboardEmpty
          icon={FileIcon}
          title={t("noRecentItemsTitle")}
          description={t("noRecentItemsDescription")}
          className="min-h-64 border"
        />
      ) : (
        <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("task")}</TableHead>
                <TableHead className="hidden sm:table-cell">
                  {t("project")}
                </TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("assignee")}
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t("created")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((task) => {
                const assignee = getMember(task.assigneeId)
                const project = getProject(task.projectId)
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Link
                        href={`/${orgSlug}/projects/${task.projectId}`}
                        className="flex flex-col hover:underline"
                      >
                        <span className="text-xs text-muted-foreground">
                          {task.identifier}
                        </span>
                        <span className="font-medium">{task.title}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {project?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {assignee ? (
                        <div className="flex items-center gap-2">
                          <MemberAvatar member={assignee} size="sm" />
                          <span>{assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {t("unassigned")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      {formatDate(task.createdAt, locale)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
