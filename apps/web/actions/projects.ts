"use server"

import { revalidatePath } from "next/cache"

import { getRequestContext } from "@/lib/core/auth-context"
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

export async function listProjectsAction() {
  const ctx = await getRequestContext()
  return projectService.list(ctx)
}

export async function createProjectAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createProjectSchema.parse(input)
  const project = await projectService.create(ctx, parsed)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
  return project
}

export async function updateProjectAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = updateProjectSchema.parse(input)
  const project = await projectService.update(ctx, id, parsed)
  revalidatePath("/dashboard/projects")
  revalidatePath(`/dashboard/projects/${id}`)
  return project
}

export async function deleteProjectAction(id: string) {
  const ctx = await getRequestContext()
  const result = await projectService.remove(ctx, id)
  revalidatePath("/dashboard/projects")
  revalidatePath("/dashboard")
  return result
}

export async function createTaskAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = createTaskSchema.parse(input)
  const task = await projectService.createTask(ctx, parsed)
  revalidatePath(`/dashboard/projects/${parsed.projectId}`)
  revalidatePath("/dashboard")
  return task
}

export async function updateTaskAction(id: string, input: unknown) {
  const ctx = await getRequestContext()
  const parsed = updateTaskSchema.parse(input)
  const task = await projectService.updateTask(ctx, id, parsed)
  revalidatePath(`/dashboard/projects/${task.projectId}`)
  return task
}

export async function moveTaskAction(id: string, status: unknown) {
  const ctx = await getRequestContext()
  const parsed = moveTaskSchema.parse(status)
  const task = await projectService.moveTask(ctx, id, parsed)
  revalidatePath(`/dashboard/projects/${task.projectId}`)
  return task
}

export async function deleteTaskAction(id: string) {
  const ctx = await getRequestContext()
  const result = await projectService.removeTask(ctx, id)
  revalidatePath("/dashboard")
  return result
}

export async function toggleSubtaskAction(taskId: string, subtaskId: string) {
  const ctx = await getRequestContext()
  const task = await projectService.toggleSubtask(ctx, taskId, subtaskId)
  revalidatePath(`/dashboard/projects/${task.projectId}`)
  return task
}

export async function addCommentAction(taskId: string, body: string) {
  const ctx = await getRequestContext()
  const parsed = addCommentSchema.parse({ body })
  const task = await projectService.addComment(ctx, taskId, parsed)
  revalidatePath(`/dashboard/projects/${task.projectId}`)
  return task
}

export async function listMembersAction() {
  const ctx = await getRequestContext()
  return projectService.listMembers(ctx)
}

export async function addMemberAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = addMemberSchema.parse(input)
  const member = await projectService.addMember(ctx, parsed)
  revalidatePath("/dashboard/settings")
  return member
}

export async function updateMemberRoleAction(userId: string, role: unknown) {
  const ctx = await getRequestContext()
  const parsed = updateMemberRoleSchema.parse(role)
  const member = await projectService.updateMemberRole(ctx, userId, parsed)
  revalidatePath("/dashboard/settings")
  return member
}

export async function removeMemberAction(userId: string) {
  const ctx = await getRequestContext()
  const result = await projectService.removeMember(ctx, userId)
  revalidatePath("/dashboard/settings")
  return result
}

export async function listLabelsAction() {
  const ctx = await getRequestContext()
  return projectService.listLabels(ctx)
}

export async function addLabelAction(input: unknown) {
  const ctx = await getRequestContext()
  const parsed = addLabelSchema.parse(input)
  const label = await projectService.addLabel(ctx, parsed)
  revalidatePath("/dashboard/projects")
  return label
}

export async function removeLabelAction(id: string) {
  const ctx = await getRequestContext()
  const result = await projectService.removeLabel(ctx, id)
  revalidatePath("/dashboard/projects")
  return result
}
