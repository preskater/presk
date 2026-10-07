import type {
  Activity,
  Comment,
  Label,
  Member,
  Project,
  ProjectData,
  Subtask,
  Task,
  TaskPriority,
  TaskStatus,
} from "./types"

export const members: Member[] = [
  {
    id: "u_aria",
    name: "Aria Chen",
    email: "aria@presk.app",
    role: "owner",
  },
  {
    id: "u_marcus",
    name: "Marcus Reid",
    email: "marcus@presk.app",
    role: "admin",
  },
  {
    id: "u_priya",
    name: "Priya Nair",
    email: "priya@presk.app",
    role: "member",
  },
  {
    id: "u_jon",
    name: "Jon Alvarez",
    email: "jon@presk.app",
    role: "member",
  },
  {
    id: "u_lena",
    name: "Lena Fischer",
    email: "lena@presk.app",
    role: "member",
  },
  {
    id: "u_tom",
    name: "Tom Becker",
    email: "tom@presk.app",
    role: "viewer",
  },
]

export const labels: Label[] = [
  { id: "l_design", name: "Design", color: "var(--chart-1)" },
  { id: "l_frontend", name: "Frontend", color: "var(--chart-2)" },
  { id: "l_backend", name: "Backend", color: "var(--chart-3)" },
  { id: "l_bug", name: "Bug", color: "var(--chart-4)" },
  { id: "l_docs", name: "Docs", color: "var(--chart-5)" },
  { id: "l_research", name: "Research", color: "var(--chart-2)" },
]

export const projects: Project[] = [
  {
    id: "p_web",
    name: "Website Redesign",
    description:
      "Full marketing site refresh with a new design system and CMS migration.",
    status: "active",
    memberIds: ["u_aria", "u_marcus", "u_priya", "u_jon"],
    labelIds: ["l_design", "l_frontend", "l_docs"],
    createdAt: "2026-08-12T09:00:00.000Z",
    dueDate: "2026-11-30T00:00:00.000Z",
  },
  {
    id: "p_mobile",
    name: "Mobile App v2",
    description:
      "Native rewrite of the companion app with offline sync and push notifications.",
    status: "active",
    memberIds: ["u_aria", "u_jon", "u_lena", "u_tom"],
    labelIds: ["l_frontend", "l_backend", "l_research"],
    createdAt: "2026-07-01T09:00:00.000Z",
    dueDate: "2026-12-15T00:00:00.000Z",
  },
  {
    id: "p_api",
    name: "Public API Platform",
    description:
      "Developer-facing REST and webhook platform with keys, quotas and docs.",
    status: "active",
    memberIds: ["u_marcus", "u_priya", "u_lena"],
    labelIds: ["l_backend", "l_docs"],
    createdAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "p_onboard",
    name: "Customer Onboarding",
    description:
      "Guided onboarding flows, checklist and activation metrics dashboard.",
    status: "paused",
    memberIds: ["u_aria", "u_tom"],
    labelIds: ["l_design", "l_research"],
    createdAt: "2026-05-10T09:00:00.000Z",
  },
  {
    id: "p_billing",
    name: "Billing Migration",
    description:
      "Move from legacy billing to usage-based pricing with a new provider.",
    status: "completed",
    memberIds: ["u_marcus", "u_lena"],
    labelIds: ["l_backend"],
    createdAt: "2026-03-02T09:00:00.000Z",
    dueDate: "2026-08-01T00:00:00.000Z",
  },
]

function subtasks(...titles: string[]): Subtask[] {
  return titles.map((title, index) => ({
    id: `st_${title.slice(0, 4)}_${index}`,
    title,
    done: index === 0,
  }))
}

function comments(...entries: [string, string][]): Comment[] {
  return entries.map(([authorId, body], index) => ({
    id: `c_${authorId}_${index}`,
    authorId,
    body,
    createdAt: `2026-09-${(10 + index).toString().padStart(2, "0")}T14:00:00.000Z`,
  }))
}

interface TaskSeed {
  projectId: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  labelIds: string[]
  dueDate?: string
  key: string
  subtasks?: Subtask[]
  comments?: Comment[]
  description?: string
}

const taskSeeds: TaskSeed[] = [
  {
    projectId: "p_web",
    key: "WEB-1",
    title: "Audit current site content and IA",
    status: "done",
    priority: "medium",
    assigneeId: "u_aria",
    labelIds: ["l_research", "l_docs"],
    dueDate: "2026-10-02T00:00:00.000Z",
    description: "Inventory pages, owners and stale content before the rebuild.",
  },
  {
    projectId: "p_web",
    key: "WEB-2",
    title: "Define new design tokens and type scale",
    status: "review",
    priority: "high",
    assigneeId: "u_marcus",
    labelIds: ["l_design"],
    dueDate: "2026-10-08T00:00:00.000Z",
    subtasks: subtasks("Color palette", "Type scale", "Spacing system"),
    comments: comments(["u_priya", "Looks great, one note on contrast."]),
  },
  {
    projectId: "p_web",
    key: "WEB-3",
    title: "Build responsive marketing pages",
    status: "in_progress",
    priority: "high",
    assigneeId: "u_priya",
    labelIds: ["l_frontend"],
    dueDate: "2026-10-14T00:00:00.000Z",
    subtasks: subtasks("Home", "Pricing", "Features", "Contact"),
  },
  {
    projectId: "p_web",
    key: "WEB-4",
    title: "Migrate blog to new CMS",
    status: "todo",
    priority: "medium",
    assigneeId: "u_jon",
    labelIds: ["l_backend", "l_docs"],
    dueDate: "2026-10-20T00:00:00.000Z",
  },
  {
    projectId: "p_web",
    key: "WEB-5",
    title: "Fix broken footer links",
    status: "backlog",
    priority: "low",
    labelIds: ["l_bug"],
  },
  {
    projectId: "p_web",
    key: "WEB-6",
    title: "Set up analytics events",
    status: "todo",
    priority: "medium",
    assigneeId: "u_marcus",
    labelIds: ["l_frontend"],
    dueDate: "2026-10-22T00:00:00.000Z",
  },
  {
    projectId: "p_mobile",
    key: "MOB-1",
    title: "Choose offline sync strategy",
    status: "review",
    priority: "urgent",
    assigneeId: "u_lena",
    labelIds: ["l_research", "l_backend"],
    dueDate: "2026-10-09T00:00:00.000Z",
    comments: comments(
      ["u_aria", "CRDT vs last-write-wins — let's decide this week."],
      ["u_lena", "Prototype for both is ready for review."]
    ),
  },
  {
    projectId: "p_mobile",
    key: "MOB-2",
    title: "Push notification permissions flow",
    status: "in_progress",
    priority: "high",
    assigneeId: "u_jon",
    labelIds: ["l_frontend"],
    dueDate: "2026-10-13T00:00:00.000Z",
  },
  {
    projectId: "p_mobile",
    key: "MOB-3",
    title: "Biometric login",
    status: "todo",
    priority: "medium",
    assigneeId: "u_lena",
    labelIds: ["l_frontend"],
    dueDate: "2026-10-18T00:00:00.000Z",
  },
  {
    projectId: "p_mobile",
    key: "MOB-4",
    title: "Crash on cold start (Android 14)",
    status: "in_progress",
    priority: "urgent",
    assigneeId: "u_jon",
    labelIds: ["l_bug"],
    dueDate: "2026-10-10T00:00:00.000Z",
  },
  {
    projectId: "p_mobile",
    key: "MOB-5",
    title: "Design empty and error states",
    status: "backlog",
    priority: "low",
    labelIds: ["l_design"],
  },
  {
    projectId: "p_mobile",
    key: "MOB-6",
    title: "Performance pass on list screens",
    status: "todo",
    priority: "medium",
    assigneeId: "u_lena",
    labelIds: ["l_frontend"],
    dueDate: "2026-10-25T00:00:00.000Z",
  },
  {
    projectId: "p_api",
    key: "API-1",
    title: "Design API key rotation flow",
    status: "in_progress",
    priority: "high",
    assigneeId: "u_marcus",
    labelIds: ["l_backend"],
    dueDate: "2026-10-11T00:00:00.000Z",
    subtasks: subtasks("Key model", "Rotation endpoint", "Audit log"),
  },
  {
    projectId: "p_api",
    key: "API-2",
    title: "Rate limiting and quotas",
    status: "review",
    priority: "high",
    assigneeId: "u_priya",
    labelIds: ["l_backend"],
    dueDate: "2026-10-12T00:00:00.000Z",
  },
  {
    projectId: "p_api",
    key: "API-3",
    title: "Publish OpenAPI spec and reference docs",
    status: "todo",
    priority: "medium",
    assigneeId: "u_lena",
    labelIds: ["l_docs"],
    dueDate: "2026-10-19T00:00:00.000Z",
  },
  {
    projectId: "p_api",
    key: "API-4",
    title: "Webhook retries with backoff",
    status: "backlog",
    priority: "medium",
    labelIds: ["l_backend"],
  },
  {
    projectId: "p_api",
    key: "API-5",
    title: "Sandbox environment",
    status: "todo",
    priority: "low",
    assigneeId: "u_marcus",
    labelIds: ["l_backend", "l_docs"],
  },
  {
    projectId: "p_onboard",
    key: "ONB-1",
    title: "Map activation funnel",
    status: "in_progress",
    priority: "medium",
    assigneeId: "u_aria",
    labelIds: ["l_research"],
    dueDate: "2026-10-16T00:00:00.000Z",
  },
  {
    projectId: "p_onboard",
    key: "ONB-2",
    title: "Welcome checklist component",
    status: "todo",
    priority: "medium",
    assigneeId: "u_tom",
    labelIds: ["l_design", "l_frontend"],
  },
  {
    projectId: "p_onboard",
    key: "ONB-3",
    title: "Sample data importer",
    status: "backlog",
    priority: "low",
    labelIds: ["l_backend"],
  },
  {
    projectId: "p_billing",
    key: "BIL-1",
    title: "Cut over subscription sync",
    status: "done",
    priority: "urgent",
    assigneeId: "u_marcus",
    labelIds: ["l_backend"],
    dueDate: "2026-07-28T00:00:00.000Z",
  },
  {
    projectId: "p_billing",
    key: "BIL-2",
    title: "Invoice PDF regeneration",
    status: "done",
    priority: "medium",
    assigneeId: "u_lena",
    labelIds: ["l_backend"],
    dueDate: "2026-07-20T00:00:00.000Z",
  },
  {
    projectId: "p_billing",
    key: "BIL-3",
    title: "Dunning email copy",
    status: "done",
    priority: "low",
    assigneeId: "u_marcus",
    labelIds: ["l_docs"],
  },
]

export const tasks: Task[] = taskSeeds.map((seed, index) => ({
  id: `t_${seed.key.toLowerCase()}`,
  identifier: seed.key,
  projectId: seed.projectId,
  title: seed.title,
  description: seed.description,
  status: seed.status,
  priority: seed.priority,
  assigneeId: seed.assigneeId,
  labelIds: seed.labelIds,
  dueDate: seed.dueDate,
  createdAt: new Date(Date.UTC(2026, 8, 1 + (index % 27))).toISOString(),
  subtasks: seed.subtasks ?? [],
  comments: seed.comments ?? [],
}))

export const activities: Activity[] = [
  {
    id: "a_1",
    projectId: "p_web",
    actorId: "u_priya",
    action: "moved",
    target: "WEB-3 to In Progress",
    createdAt: "2026-10-06T09:12:00.000Z",
  },
  {
    id: "a_2",
    projectId: "p_web",
    actorId: "u_marcus",
    action: "requested review on",
    target: "WEB-2",
    createdAt: "2026-10-05T16:40:00.000Z",
  },
  {
    id: "a_3",
    projectId: "p_web",
    actorId: "u_aria",
    action: "commented on",
    target: "WEB-2",
    createdAt: "2026-10-05T14:02:00.000Z",
  },
  {
    id: "a_4",
    projectId: "p_web",
    actorId: "u_jon",
    action: "created",
    target: "WEB-4",
    createdAt: "2026-10-04T11:25:00.000Z",
  },
  {
    id: "a_5",
    projectId: "p_web",
    actorId: "u_aria",
    action: "completed",
    target: "WEB-1",
    createdAt: "2026-10-02T18:10:00.000Z",
  },
  {
    id: "a_6",
    projectId: "p_mobile",
    actorId: "u_jon",
    action: "commented on",
    target: "MOB-4",
    createdAt: "2026-10-06T08:30:00.000Z",
  },
  {
    id: "a_7",
    projectId: "p_mobile",
    actorId: "u_lena",
    action: "moved",
    target: "MOB-1 to Review",
    createdAt: "2026-10-05T10:05:00.000Z",
  },
  {
    id: "a_8",
    projectId: "p_api",
    actorId: "u_priya",
    action: "opened a pull request for",
    target: "API-2",
    createdAt: "2026-10-04T13:45:00.000Z",
  },
]

export const projectData: ProjectData = {
  projects,
  tasks,
  members,
  labels,
  activities,
}
