import { tool } from "ai"
import { z } from "zod"

import { calendarService } from "@/lib/calendars"
import { createEventSchema } from "@/lib/calendars/schemas"
import type { RequestContext } from "@/lib/core/context"
import { fileService } from "@/lib/files"
import { messagingService } from "@/lib/messaging"
import { sendMessageSchema } from "@/lib/messaging/schemas"
import { projectService } from "@/lib/projects"
import {
  createProjectSchema,
  createTaskSchema,
  moveTaskSchema,
  updateTaskSchema,
} from "@/lib/projects/schemas"

const empty = z.object({})
const idInput = z.object({ id: z.string().describe("The resource id") })

export function buildTools(ctx: RequestContext) {
  return {
    list_projects: tool({
      description:
        "List all projects in the workspace with their tasks, members and labels.",
      inputSchema: empty,
      execute: async () => projectService.list(ctx),
    }),
    get_project: tool({
      description: "Fetch a single project by id.",
      inputSchema: idInput,
      execute: async ({ id }) => projectService.get(ctx, id),
    }),
    list_tasks: tool({
      description: "List the tasks belonging to a project.",
      inputSchema: createTaskSchema.pick({ projectId: true }),
      execute: async ({ projectId }) =>
        projectService.listTasks(ctx, projectId),
    }),
    create_project: tool({
      description: "Create a new project.",
      inputSchema: createProjectSchema,
      execute: async (input) => projectService.create(ctx, input),
    }),
    create_task: tool({
      description: "Create a task inside a project.",
      inputSchema: createTaskSchema,
      execute: async (input) => projectService.createTask(ctx, input),
    }),
    update_task: tool({
      description: "Update a task's title, status, priority or assignee.",
      inputSchema: updateTaskSchema.extend(idInput.shape),
      execute: async ({ id, ...patch }) =>
        projectService.updateTask(ctx, id, patch),
    }),
    move_task: tool({
      description: "Move a task to a different status column.",
      inputSchema: moveTaskSchema.extend(idInput.shape),
      execute: async ({ id, status }) => projectService.moveTask(ctx, id, { status }),
    }),
    list_calendar: tool({
      description: "List workspace calendars and their events.",
      inputSchema: empty,
      execute: async () => calendarService.list(ctx),
    }),
    create_event: tool({
      description:
        "Schedule a calendar event. startAt/endAt are ISO timestamp strings.",
      inputSchema: createEventSchema,
      execute: async (input) => calendarService.createEvent(ctx, input),
    }),
    list_files: tool({
      description: "List files and folders in the workspace.",
      inputSchema: empty,
      execute: async () => fileService.list(ctx),
    }),
    list_conversations: tool({
      description: "List workspace conversations and their messages.",
      inputSchema: empty,
      execute: async () => messagingService.list(ctx),
    }),
    send_message: tool({
      description: "Send a message to a conversation.",
      inputSchema: sendMessageSchema,
      execute: async (input) => messagingService.sendMessage(ctx, input),
    }),
  }
}
