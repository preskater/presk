"use server"

import { withAction } from "@/lib/core/action"
import { getRequestContext } from "@/lib/core/auth-context"
import { revalidateOrgPath } from "@/lib/organization/paths"
import { projectService } from "@/lib/projects"
import {
  addCommentSchema,
  addLabelSchema,
  addMemberSchema,
  createProjectSchema,
  createTaskSchema,
  moveTaskSchema,
  updateMemberRoleSchema,
  updateProjectSchema,
  updateTaskSchema,
} from "@/lib/projects/schemas"

export const listProjectsAction = withAction(async () => {
  const ctx = await getRequestContext()
  return projectService.list(ctx)
})

export const createProjectAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = createProjectSchema.parse(input)
  const project = await projectService.create(ctx, parsed)
  await revalidateOrgPath(ctx.organizationId, "/projects")
  await revalidateOrgPath(ctx.organizationId)
  return project
})

export const updateProjectAction = withAction(
  async (id: string, input: unknown) => {
    const ctx = await getRequestContext()
    const parsed = updateProjectSchema.parse(input)
    const project = await projectService.update(ctx, id, parsed)
    await revalidateOrgPath(ctx.organizationId, "/projects")
    await revalidateOrgPath(ctx.organizationId, `/projects/${id}`)
    return project
  }
)

export const deleteProjectAction = withAction(async (id: string) => {
  const ctx = await getRequestContext()
  const result = await projectService.remove(ctx, id)
  await revalidateOrgPath(ctx.organizationId, "/projects")
  await revalidateOrgPath(ctx.organizationId)
  return result
})

export const createTaskAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = createTaskSchema.parse(input)
  const task = await projectService.createTask(ctx, parsed)
  await revalidateOrgPath(ctx.organizationId, `/projects/${parsed.projectId}`)
  await revalidateOrgPath(ctx.organizationId)
  return task
})

export const updateTaskAction = withAction(async (id: string, input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = updateTaskSchema.parse(input)
  const task = await projectService.updateTask(ctx, id, parsed)
  await revalidateOrgPath(ctx.organizationId, `/projects/${task.projectId}`)
  return task
})

export const moveTaskAction = withAction(async (id: string, status: unknown) => {
  const ctx = await getRequestContext()
  const parsed = moveTaskSchema.parse(status)
  const task = await projectService.moveTask(ctx, id, parsed)
  await revalidateOrgPath(ctx.organizationId, `/projects/${task.projectId}`)
  return task
})

export const deleteTaskAction = withAction(async (id: string) => {
  const ctx = await getRequestContext()
  const result = await projectService.removeTask(ctx, id)
  await revalidateOrgPath(ctx.organizationId)
  return result
})

export const toggleSubtaskAction = withAction(
  async (taskId: string, subtaskId: string) => {
    const ctx = await getRequestContext()
    const task = await projectService.toggleSubtask(ctx, taskId, subtaskId)
    await revalidateOrgPath(ctx.organizationId, `/projects/${task.projectId}`)
    return task
  }
)

export const addCommentAction = withAction(
  async (taskId: string, body: string) => {
    const ctx = await getRequestContext()
    const parsed = addCommentSchema.parse({ body })
    const task = await projectService.addComment(ctx, taskId, parsed)
    await revalidateOrgPath(ctx.organizationId, `/projects/${task.projectId}`)
    return task
  }
)

export const listMembersAction = withAction(async () => {
  const ctx = await getRequestContext()
  return projectService.listMembers(ctx)
})

export const addMemberAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = addMemberSchema.parse(input)
  const member = await projectService.addMember(ctx, parsed)
  await revalidateOrgPath(ctx.organizationId, "/settings")
  return member
})

export const updateMemberRoleAction = withAction(
  async (userId: string, role: unknown) => {
    const ctx = await getRequestContext()
    const parsed = updateMemberRoleSchema.parse(role)
    const member = await projectService.updateMemberRole(ctx, userId, parsed)
    await revalidateOrgPath(ctx.organizationId, "/settings")
    return member
  }
)

export const removeMemberAction = withAction(async (userId: string) => {
  const ctx = await getRequestContext()
  const result = await projectService.removeMember(ctx, userId)
  await revalidateOrgPath(ctx.organizationId, "/settings")
  return result
})

export const listLabelsAction = withAction(async () => {
  const ctx = await getRequestContext()
  return projectService.listLabels(ctx)
})

export const addLabelAction = withAction(async (input: unknown) => {
  const ctx = await getRequestContext()
  const parsed = addLabelSchema.parse(input)
  const label = await projectService.addLabel(ctx, parsed)
  await revalidateOrgPath(ctx.organizationId, "/projects")
  return label
})

export const removeLabelAction = withAction(async (id: string) => {
  const ctx = await getRequestContext()
  const result = await projectService.removeLabel(ctx, id)
  await revalidateOrgPath(ctx.organizationId, "/projects")
  return result
})
