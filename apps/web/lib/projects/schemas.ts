import { z } from "zod"

export const taskStatusSchema = z.enum([
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
])

export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"])

export const projectStatusSchema = z.enum(["active", "paused", "completed"])

export const memberRoleSchema = z.enum(["owner", "admin", "member", "viewer"])

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  status: projectStatusSchema.optional(),
  memberIds: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  status: projectStatusSchema.optional(),
  memberIds: z.array(z.string()).optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.string().nullable().optional(),
})

export const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1).max(240),
  description: z.string().max(5000).optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(240).optional(),
  description: z.string().max(5000).nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().nullable().optional(),
  labelIds: z.array(z.string()).optional(),
  dueDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
})

export const moveTaskSchema = z.object({
  status: taskStatusSchema,
})

export const addCommentSchema = z.object({
  body: z.string().min(1).max(4000),
})

export const addMemberSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email(),
  role: memberRoleSchema,
})

export const updateMemberRoleSchema = z.object({
  role: memberRoleSchema,
})

export const addLabelSchema = z.object({
  name: z.string().min(1).max(60),
  color: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Enter a valid hex color.")
    .transform((value) => value.toLowerCase()),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type MoveTaskInput = z.infer<typeof moveTaskSchema>
export type AddCommentInput = z.infer<typeof addCommentSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>
export type AddLabelInput = z.infer<typeof addLabelSchema>
