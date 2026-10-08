import { prisma } from "@/lib/prisma"

import { ProjectRepository } from "./repository"
import { ProjectService } from "./service"

export const projectRepository = new ProjectRepository(prisma)
export const projectService = new ProjectService(projectRepository, prisma)

export { ProjectRepository, ProjectService }
export * from "./schemas"
export type {
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
