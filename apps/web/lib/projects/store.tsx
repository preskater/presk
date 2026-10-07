"use client"

import * as React from "react"
import { toast } from "sonner"

import { projectData as seedData } from "./mock-data"
import type {
  Activity,
  Comment,
  Label,
  Member,
  MemberRole,
  Project,
  ProjectData,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
} from "./types"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function projectKey(name: string, tasks: Task[]) {
  const base = name
    .replace(/[^a-zA-Z ]/g, "")
    .split(" ")
    .map((word) => word && word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3)
  const count = tasks.filter((task) => task.identifier.startsWith(base)).length
  return `${base || "TSK"}-${count + 1}`
}

export interface CreateTaskInput {
  projectId: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: string
  labelIds: string[]
  dueDate?: string
}

export interface CreateProjectInput {
  name: string
  description?: string
  status?: ProjectStatus
  memberIds?: string[]
  labelIds?: string[]
}

interface ProjectStore {
  projects: Project[]
  tasks: Task[]
  members: Member[]
  labels: Label[]
  activities: Activity[]
  getProject: (id: string) => Project | undefined
  getMember: (id?: string) => Member | undefined
  getLabel: (id: string) => Label | undefined
  tasksForProject: (projectId: string) => Task[]
  activitiesForProject: (projectId: string) => Activity[]
  createProject: (input: CreateProjectInput) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  createTask: (input: CreateTaskInput) => Task
  updateTask: (
    id: string,
    patch: Omit<Partial<Task>, "labelIds"> & { labelIds?: string[] },
    options?: { silent?: boolean }
  ) => void
  moveTask: (id: string, status: TaskStatus) => void
  deleteTask: (id: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, authorId: string, body: string) => void
  addMember: (input: { name: string; email: string; role: MemberRole }) => Member
  updateMemberRole: (id: string, role: MemberRole) => void
  removeMember: (id: string) => void
  addLabel: (name: string, color: string) => Label
  removeLabel: (id: string) => void
  reset: () => void
}

const ProjectStoreContext = React.createContext<ProjectStore | null>(null)

export function ProjectStoreProvider({
  children,
  initialData = seedData,
}: {
  children: React.ReactNode
  initialData?: ProjectData
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialData.projects)
  const [tasks, setTasks] = React.useState<Task[]>(initialData.tasks)
  const [members, setMembers] = React.useState<Member[]>(initialData.members)
  const [labels, setLabels] = React.useState<Label[]>(initialData.labels)
  const [activities, setActivities] = React.useState<Activity[]>(initialData.activities)

  const currentUserId = members[0]?.id ?? "u_aria"

  const pushActivity = React.useCallback(
    (projectId: string, action: string, target: string) => {
      setActivities((prev) => [
        {
          id: uid("a"),
          projectId,
          actorId: currentUserId,
          action,
          target,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    [currentUserId]
  )

  const store = React.useMemo<ProjectStore>(() => {
    const getProject = (id: string) => projects.find((p) => p.id === id)
    const getMember = (id?: string) =>
      id ? members.find((m) => m.id === id) : undefined
    const getLabel = (id: string) => labels.find((l) => l.id === id)

    return {
      projects,
      tasks,
      members,
      labels,
      activities,
      getProject,
      getMember,
      getLabel,
      tasksForProject: (projectId) =>
        tasks.filter((task) => task.projectId === projectId),
      activitiesForProject: (projectId) =>
        activities.filter((activity) => activity.projectId === projectId),
      createProject: (input) => {
        const project: Project = {
          id: uid("p"),
          name: input.name,
          description: input.description,
          status: input.status ?? "active",
          memberIds: input.memberIds?.length
            ? input.memberIds
            : [currentUserId],
          labelIds: input.labelIds ?? [],
          createdAt: new Date().toISOString(),
        }
        setProjects((prev) => [project, ...prev])
        toast.success(`Project “${project.name}” created.`)
        return project
      },
      updateProject: (id, patch) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, ...patch } : project
          )
        )
        toast.success("Project updated.")
      },
      deleteProject: (id) => {
        setProjects((prev) => prev.filter((project) => project.id !== id))
        setTasks((prev) => prev.filter((task) => task.projectId !== id))
        setActivities((prev) =>
          prev.filter((activity) => activity.projectId !== id)
        )
        toast.success("Project deleted.")
      },
      createTask: (input) => {
        const project = getProject(input.projectId)
        const task: Task = {
          id: uid("t"),
          identifier: projectKey(project?.name ?? "Task", tasks),
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          assigneeId: input.assigneeId,
          labelIds: input.labelIds,
          dueDate: input.dueDate,
          createdAt: new Date().toISOString(),
          subtasks: [],
          comments: [],
        }
        setTasks((prev) => [task, ...prev])
        pushActivity(input.projectId, "created", task.identifier)
        toast.success(`Task ${task.identifier} created.`)
        return task
      },
      updateTask: (id, patch, options) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? { ...task, ...patch } : task))
        )
        if (!options?.silent) {
          toast.success("Task updated.")
        }
      },
      moveTask: (id, status) => {
        const task = tasks.find((t) => t.id === id)
        if (!task || task.status === status) return
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        )
        pushActivity(
          task.projectId,
          "moved",
          `${task.identifier} to ${status.replace("_", " ")}`
        )
      },
      deleteTask: (id) => {
        const task = tasks.find((t) => t.id === id)
        setTasks((prev) => prev.filter((t) => t.id !== id))
        if (task) pushActivity(task.projectId, "deleted", task.identifier)
        toast.success("Task deleted.")
      },
      toggleSubtask: (taskId, subtaskId) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, done: !subtask.done }
                      : subtask
                  ),
                }
              : task
          )
        )
      },
      addComment: (taskId, authorId, body) => {
        const comment: Comment = {
          id: uid("c"),
          authorId,
          body,
          createdAt: new Date().toISOString(),
        }
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, comments: [...task.comments, comment] }
              : task
          )
        )
        const task = tasks.find((t) => t.id === taskId)
        if (task) pushActivity(task.projectId, "commented on", task.identifier)
      },
      addMember: (input) => {
        const member: Member = {
          id: uid("u"),
          name: input.name,
          email: input.email,
          role: input.role,
        }
        setMembers((prev) => [...prev, member])
        toast.success(`${member.name} added to the workspace.`)
        return member
      },
      updateMemberRole: (id, role) => {
        setMembers((prev) =>
          prev.map((member) =>
            member.id === id ? { ...member, role } : member
          )
        )
        toast.success("Role updated.")
      },
      removeMember: (id) => {
        setMembers((prev) => prev.filter((member) => member.id !== id))
        setProjects((prev) =>
          prev.map((project) => ({
            ...project,
            memberIds: project.memberIds.filter((memberId) => memberId !== id),
          }))
        )
        toast.success("Member removed.")
      },
      addLabel: (name, color) => {
        const label: Label = { id: uid("l"), name, color }
        setLabels((prev) => [...prev, label])
        toast.success(`Label “${name}” created.`)
        return label
      },
      removeLabel: (id) => {
        setLabels((prev) => prev.filter((label) => label.id !== id))
        setTasks((prev) =>
          prev.map((task) => ({
            ...task,
            labelIds: task.labelIds.filter((labelId) => labelId !== id),
          }))
        )
        toast.success("Label deleted.")
      },
      reset: () => {
        setProjects(seedData.projects)
        setTasks(seedData.tasks)
        setMembers(seedData.members)
        setLabels(seedData.labels)
        setActivities(seedData.activities)
        toast.success("Sample data restored.")
      },
    }
  }, [projects, tasks, members, labels, activities, currentUserId, pushActivity])

  return (
    <ProjectStoreContext.Provider value={store}>
      {children}
    </ProjectStoreContext.Provider>
  )
}

export function useProjectStore() {
  const context = React.useContext(ProjectStoreContext)
  if (!context) {
    throw new Error("useProjectStore must be used within a ProjectStoreProvider")
  }
  return context
}

export { initialsFor }
