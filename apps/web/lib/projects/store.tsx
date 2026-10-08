"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  addCommentAction,
  addLabelAction,
  addMemberAction,
  createProjectAction,
  createTaskAction,
  deleteProjectAction,
  deleteTaskAction,
  moveTaskAction,
  removeLabelAction,
  removeMemberAction,
  toggleSubtaskAction,
  updateMemberRoleAction,
  updateProjectAction,
  updateTaskAction,
} from "@/actions/projects"
import type { CreateTaskInput } from "@/lib/projects/schemas"
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
} from "@/lib/projects/types"

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

export type { CreateTaskInput }

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
  currentUserId: string
  getProject: (id: string) => Project | undefined
  getMember: (id?: string) => Member | undefined
  getLabel: (id: string) => Label | undefined
  tasksForProject: (projectId: string) => Task[]
  activitiesForProject: (projectId: string) => Activity[]
  createProject: (input: CreateProjectInput) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  createTask: (input: CreateTaskInput) => void
  updateTask: (
    id: string,
    patch: Omit<Partial<Task>, "labelIds" | "dueDate" | "assigneeId"> & {
      labelIds?: string[]
      dueDate?: string | null
      assigneeId?: string | null
    },
    options?: { silent?: boolean }
  ) => void
  moveTask: (id: string, status: TaskStatus) => void
  deleteTask: (id: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, authorId: string, body: string) => void
  addMember: (input: { name: string; email: string; role: MemberRole }) => void
  updateMemberRole: (id: string, role: MemberRole) => void
  removeMember: (id: string) => void
  addLabel: (name: string, color: string) => void
  removeLabel: (id: string) => void
}

const ProjectStoreContext = React.createContext<ProjectStore | null>(null)

export function ProjectStoreProvider({
  children,
  initialData,
  currentUserId,
}: {
  children: React.ReactNode
  initialData: ProjectData
  currentUserId: string
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialData.projects)
  const [tasks, setTasks] = React.useState<Task[]>(initialData.tasks)
  const [members, setMembers] = React.useState<Member[]>(initialData.members)
  const [labels, setLabels] = React.useState<Label[]>(initialData.labels)
  const [activities, setActivities] = React.useState<Activity[]>(
    initialData.activities
  )

  React.useEffect(() => {
    setProjects(initialData.projects)
    setTasks(initialData.tasks)
    setMembers(initialData.members)
    setLabels(initialData.labels)
    setActivities(initialData.activities)
  }, [initialData])

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
      currentUserId,
      getProject,
      getMember,
      getLabel,
      tasksForProject: (projectId) =>
        tasks.filter((task) => task.projectId === projectId),
      activitiesForProject: (projectId) =>
        activities.filter((activity) => activity.projectId === projectId),
      createProject: (input) => {
        const optimistic: Project = {
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
        setProjects((prev) => [optimistic, ...prev])
        void createProjectAction(input)
          .then((project) => {
            setProjects((prev) =>
              prev.map((item) => (item.id === optimistic.id ? project : item))
            )
            toast.success(`Project “${project.name}” created.`)
          })
          .catch((error) => {
            setProjects((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Could not create project.")
          })
      },
      updateProject: (id, patch) => {
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? { ...project, ...patch } : project
          )
        )
        void updateProjectAction(id, patch)
          .then(() => toast.success("Project updated."))
          .catch((error) => toast.error(error.message ?? "Update failed."))
      },
      deleteProject: (id) => {
        setProjects((prev) => prev.filter((project) => project.id !== id))
        setTasks((prev) => prev.filter((task) => task.projectId !== id))
        setActivities((prev) =>
          prev.filter((activity) => activity.projectId !== id)
        )
        void deleteProjectAction(id)
          .then(() => toast.success("Project deleted."))
          .catch((error) => toast.error(error.message ?? "Delete failed."))
      },
      createTask: (input) => {
        const project = getProject(input.projectId)
        const optimistic: Task = {
          id: uid("t"),
          identifier: projectKey(project?.name ?? "Task", tasks),
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          status: input.status ?? "todo",
          priority: input.priority ?? "medium",
          assigneeId: input.assigneeId ?? undefined,
          labelIds: input.labelIds ?? [],
          dueDate: input.dueDate ?? undefined,
          createdAt: new Date().toISOString(),
          subtasks: [],
          comments: [],
        }
        setTasks((prev) => [optimistic, ...prev])
        void createTaskAction({
          ...input,
          status: input.status ?? "todo",
          priority: input.priority ?? "medium",
          labelIds: input.labelIds ?? [],
        })
          .then((task) => {
            setTasks((prev) =>
              prev.map((item) => (item.id === optimistic.id ? task : item))
            )
            toast.success(`Task ${task.identifier} created.`)
          })
          .catch((error) => {
            setTasks((prev) => prev.filter((item) => item.id !== optimistic.id))
            toast.error(error.message ?? "Could not create task.")
          })
        pushActivity(input.projectId, "created", optimistic.identifier)
      },
      updateTask: (id, patch, options) => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...patch,
                  assigneeId: patch.assigneeId ?? undefined,
                  dueDate: patch.dueDate ?? undefined,
                }
              : task
          )
        )
        void updateTaskAction(id, patch)
          .then(() => {
            if (!options?.silent) toast.success("Task updated.")
          })
          .catch((error) => toast.error(error.message ?? "Update failed."))
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
        void moveTaskAction(id, { status }).catch((error) =>
          toast.error(error.message ?? "Move failed.")
        )
      },
      deleteTask: (id) => {
        const task = tasks.find((t) => t.id === id)
        setTasks((prev) => prev.filter((t) => t.id !== id))
        if (task) pushActivity(task.projectId, "deleted", task.identifier)
        void deleteTaskAction(id)
          .then(() => toast.success("Task deleted."))
          .catch((error) => toast.error(error.message ?? "Delete failed."))
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
        void toggleSubtaskAction(taskId, subtaskId).catch((error) =>
          toast.error(error.message ?? "Update failed.")
        )
      },
      addComment: (taskId, _authorId, body) => {
        const comment: Comment = {
          id: uid("c"),
          authorId: currentUserId,
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
        void addCommentAction(taskId, body).catch((error) =>
          toast.error(error.message ?? "Comment failed.")
        )
      },
      addMember: (input) => {
        const optimistic: Member = {
          id: uid("u"),
          name: input.name,
          email: input.email,
          role: input.role,
        }
        setMembers((prev) => [...prev, optimistic])
        void addMemberAction(input)
          .then((member) => {
            setMembers((prev) =>
              prev.map((item) => (item.id === optimistic.id ? member : item))
            )
            toast.success(`${member.name} added to the workspace.`)
          })
          .catch((error) => {
            setMembers((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Could not add member.")
          })
      },
      updateMemberRole: (id, role) => {
        setMembers((prev) =>
          prev.map((member) =>
            member.id === id ? { ...member, role } : member
          )
        )
        void updateMemberRoleAction(id, { role })
          .then(() => toast.success("Role updated."))
          .catch((error) => toast.error(error.message ?? "Update failed."))
      },
      removeMember: (id) => {
        setMembers((prev) => prev.filter((member) => member.id !== id))
        setProjects((prev) =>
          prev.map((project) => ({
            ...project,
            memberIds: project.memberIds.filter((memberId) => memberId !== id),
          }))
        )
        void removeMemberAction(id)
          .then(() => toast.success("Member removed."))
          .catch((error) => toast.error(error.message ?? "Remove failed."))
      },
      addLabel: (name, color) => {
        const optimistic: Label = { id: uid("l"), name, color }
        setLabels((prev) => [...prev, optimistic])
        void addLabelAction({ name, color })
          .then((label) => {
            setLabels((prev) =>
              prev.map((item) => (item.id === optimistic.id ? label : item))
            )
            toast.success(`Label “${name}” created.`)
          })
          .catch((error) => {
            setLabels((prev) =>
              prev.filter((item) => item.id !== optimistic.id)
            )
            toast.error(error.message ?? "Could not add label.")
          })
      },
      removeLabel: (id) => {
        setLabels((prev) => prev.filter((label) => label.id !== id))
        setTasks((prev) =>
          prev.map((task) => ({
            ...task,
            labelIds: task.labelIds.filter((labelId) => labelId !== id),
          }))
        )
        void removeLabelAction(id)
          .then(() => toast.success("Label deleted."))
          .catch((error) => toast.error(error.message ?? "Delete failed."))
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
export type { TaskPriority, TaskStatus }
