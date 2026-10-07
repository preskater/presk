export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "done"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export type ProjectStatus = "active" | "paused" | "completed"

export type MemberRole = "owner" | "admin" | "member" | "viewer"

export interface Member {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: MemberRole
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Comment {
  id: string
  authorId: string
  body: string
  createdAt: string
}

export interface Task {
  id: string
  identifier: string
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  labelIds: string[]
  dueDate?: string
  createdAt: string
  subtasks: Subtask[]
  comments: Comment[]
}

export interface Project {
  id: string
  name: string
  description?: string
  status: ProjectStatus
  memberIds: string[]
  labelIds: string[]
  createdAt: string
  dueDate?: string
}

export interface Activity {
  id: string
  projectId: string
  actorId: string
  action: string
  target: string
  createdAt: string
}

export interface ProjectData {
  projects: Project[]
  tasks: Task[]
  members: Member[]
  labels: Label[]
  activities: Activity[]
}

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
]

export const PRIORITY_BADGE_VARIANT: Record<
  TaskPriority,
  "default" | "secondary" | "outline" | "destructive"
> = {
  low: "outline",
  medium: "secondary",
  high: "default",
  urgent: "destructive",
}

export function formatDate(value?: string) {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}
