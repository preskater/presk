import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "../lib/generated/prisma/client"
import { calendarData } from "../lib/calendars/mock-data"
import { filesData } from "../lib/files/mock-data"
import { localizeSeed } from "../lib/i18n/seed-translations"
import { messagingData } from "../lib/messaging/mock-data"
import { projectData } from "../lib/projects/mock-data"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

interface SeedOrg {
  id: string
  name: string
  slug: string
  locale: "en" | "fr"
  prefix: string
}

const EN_ORG: SeedOrg = {
  id: "org_demo_presk",
  name: "Presk Demo",
  slug: "presk-demo",
  locale: "en",
  prefix: "",
}

const FR_ORG: SeedOrg = {
  id: "org_demo_presk_fr",
  name: "Presk Démo",
  slug: "presk-demo-fr",
  locale: "fr",
  prefix: "fr_",
}

const FR_ID_KEYS = new Set([
  "id",
  "parentId",
  "projectId",
  "calendarId",
  "conversationId",
  "teamId",
  "labelId",
])

const FR_ID_LIST_KEYS = new Set(["labelIds", "channelIds"])

function prefixForFr(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(prefixForFr)
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (typeof item === "string" && FR_ID_KEYS.has(key)) {
        out[key] = item.startsWith("u_") ? item : `fr_${item}`
      } else if (Array.isArray(item) && FR_ID_LIST_KEYS.has(key)) {
        out[key] = item.map((entry) =>
          typeof entry === "string" && !entry.startsWith("u_")
            ? `fr_${entry}`
            : entry
        )
      } else if (
        item &&
        typeof item === "object" &&
        !Array.isArray(item) &&
        !(item instanceof Date) &&
        (key === "shares" || key === "versions" || key === "activities")
      ) {
        const entries = Object.entries(item as Record<string, unknown>)
        const isFileMap = entries.every(([, entryValue]) =>
          Array.isArray(entryValue)
        )
        if (isFileMap) {
          const map: Record<string, unknown> = {}
          for (const [mapKey, mapValue] of entries) {
            map[`fr_${mapKey}`] = prefixForFr(mapValue)
          }
          out[key] = map
        } else {
          out[key] = prefixForFr(item)
        }
      } else {
        out[key] = prefixForFr(item)
      }
    }
    return out
  }
  return value
}

function buildOrgData<T>(data: T, org: SeedOrg): T {
  if (!org.prefix) {
    return data
  }
  return prefixForFr(localizeSeed(data, org.locale)) as T
}

async function seedWorkspace(
  org: SeedOrg,
  data: typeof projectData,
  now: Date
) {
  await prisma.organization.upsert({
    where: { id: org.id },
    update: { name: org.name, slug: org.slug },
    create: {
      id: org.id,
      name: org.name,
      slug: org.slug,
      createdAt: now,
    },
  })

  for (const member of data.members) {
    await prisma.user.upsert({
      where: { id: member.id },
      update: { name: member.name, email: member.email },
      create: {
        id: member.id,
        name: member.name,
        email: member.email,
        emailVerified: true,
        image: member.avatarUrl ?? null,
      },
    })
    await prisma.member.upsert({
      where: { id: `${org.prefix}member_${member.id}` },
      update: { role: member.role },
      create: {
        id: `${org.prefix}member_${member.id}`,
        organizationId: org.id,
        userId: member.id,
        role: member.role,
        createdAt: now,
      },
    })
  }
}

async function seedProjects(org: SeedOrg, data: typeof projectData) {
  const memberIds = data.members.map((member) => member.id)
  const labelIdMap = new Map<string, string>()
  for (const label of data.labels) {
    const created = await prisma.label.upsert({
      where: {
        organizationId_name: {
          organizationId: org.id,
          name: label.name,
        },
      },
      update: { color: label.color },
      create: {
        organizationId: org.id,
        name: label.name,
        color: label.color,
      },
    })
    labelIdMap.set(label.id, created.id)
  }

  const projectIdMap = new Map<string, string>()
  for (const project of data.projects) {
    const created = await prisma.project.upsert({
      where: { id: project.id },
      update: {
        name: project.name,
        description: project.description ?? null,
        status: project.status,
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
      },
      create: {
        id: project.id,
        organizationId: org.id,
        name: project.name,
        description: project.description ?? null,
        status: project.status,
        dueDate: project.dueDate ? new Date(project.dueDate) : null,
      },
    })
    projectIdMap.set(project.id, created.id)

    await prisma.projectMember.deleteMany({ where: { projectId: created.id } })
    await prisma.projectMember.createMany({
      data: project.memberIds.map((userId) => ({ projectId: created.id, userId })),
      skipDuplicates: true,
    })

    await prisma.projectLabel.deleteMany({ where: { projectId: created.id } })
    await prisma.projectLabel.createMany({
      data: project.labelIds.map((labelId) => ({
        projectId: created.id,
        labelId: labelIdMap.get(labelId) ?? labelId,
      })),
      skipDuplicates: true,
    })
  }

  let order = 0
  for (const task of data.tasks) {
    const created = await prisma.task.upsert({
      where: { id: task.id },
      update: {
        title: task.title,
        description: task.description ?? null,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      },
      create: {
        id: task.id,
        organizationId: org.id,
        projectId: projectIdMap.get(task.projectId) ?? task.projectId,
        identifier: task.identifier,
        title: task.title,
        description: task.description ?? null,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId ?? null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        order: order++,
        createdAt: new Date(task.createdAt),
      },
    })

    await prisma.taskLabel.deleteMany({ where: { taskId: created.id } })
    if (task.labelIds.length) {
      await prisma.taskLabel.createMany({
        data: task.labelIds.map((labelId) => ({
          taskId: created.id,
          labelId: labelIdMap.get(labelId) ?? labelId,
        })),
        skipDuplicates: true,
      })
    }

    await prisma.subtask.deleteMany({ where: { taskId: created.id } })
    if (task.subtasks.length) {
      await prisma.subtask.createMany({
        data: task.subtasks.map((subtask, index) => ({
          id: subtask.id,
          taskId: created.id,
          title: subtask.title,
          done: subtask.done,
          order: index,
        })),
        skipDuplicates: true,
      })
    }

    await prisma.taskComment.deleteMany({ where: { taskId: created.id } })
    if (task.comments.length) {
      await prisma.taskComment.createMany({
        data: task.comments.map((comment) => ({
          id: comment.id,
          taskId: created.id,
          authorId: comment.authorId,
          body: comment.body,
          createdAt: new Date(comment.createdAt),
        })),
        skipDuplicates: true,
      })
    }
  }

  for (const activity of data.activities) {
    await prisma.projectActivity.upsert({
      where: { id: activity.id },
      update: {},
      create: {
        id: activity.id,
        projectId: projectIdMap.get(activity.projectId) ?? activity.projectId,
        actorId: activity.actorId,
        action: activity.action,
        target: activity.target,
        createdAt: new Date(activity.createdAt),
      },
    })
  }

  void memberIds
}

async function seedCalendars(org: SeedOrg, data: typeof calendarData) {
  const calendarIdMap = new Map<string, string>()
  for (const calendar of data.calendars) {
    const created = await prisma.calendar.upsert({
      where: { id: calendar.id },
      update: { name: calendar.name, color: calendar.color, kind: calendar.kind, visible: calendar.visible },
      create: {
        id: calendar.id,
        organizationId: org.id,
        name: calendar.name,
        color: calendar.color,
        kind: calendar.kind,
        visible: calendar.visible,
      },
    })
    calendarIdMap.set(calendar.id, created.id)
    await prisma.calendarMember.deleteMany({ where: { calendarId: created.id } })
    if (calendar.memberIds.length) {
      await prisma.calendarMember.createMany({
        data: calendar.memberIds.map((userId) => ({ calendarId: created.id, userId })),
        skipDuplicates: true,
      })
    }
  }

  for (const event of data.events) {
    const created = await prisma.calendarEvent.upsert({
      where: { id: event.id },
      update: {
        title: event.title,
        description: event.description ?? null,
        startAt: new Date(event.startAt),
        endAt: new Date(event.endAt),
        allDay: event.allDay ?? false,
        location: event.location ?? null,
        meetingUrl: event.meetingUrl ?? null,
        color: event.color,
        reminderMinutes: event.reminderMinutes ?? null,
      },
      create: {
        id: event.id,
        organizationId: org.id,
        calendarId: calendarIdMap.get(event.calendarId) ?? event.calendarId,
        title: event.title,
        description: event.description ?? null,
        startAt: new Date(event.startAt),
        endAt: new Date(event.endAt),
        allDay: event.allDay ?? false,
        location: event.location ?? null,
        meetingUrl: event.meetingUrl ?? null,
        color: event.color,
        reminderMinutes: event.reminderMinutes ?? null,
        createdBy: event.createdBy,
      },
    })
    await prisma.eventAttendee.deleteMany({ where: { eventId: created.id } })
    if (event.attendees.length) {
      await prisma.eventAttendee.createMany({
        data: event.attendees.map((attendee) => ({
          eventId: created.id,
          userId: attendee.memberId,
          response: attendee.response,
        })),
        skipDuplicates: true,
      })
    }
  }
}

async function seedFiles(org: SeedOrg, data: typeof filesData) {
  for (const file of data.files) {
    await prisma.fileNode.upsert({
      where: { id: file.id },
      update: {
        name: file.name,
        kind: file.kind,
        parentId: file.parentId,
        ownerId: file.ownerId,
        modifiedAt: new Date(file.modifiedAt),
        sizeBytes: file.sizeBytes ?? null,
        starred: file.starred,
        trashed: file.trashed,
        trashedAt: file.trashedAt ? new Date(file.trashedAt) : null,
        shared: file.shared,
        restricted: file.restricted,
      },
      create: {
        id: file.id,
        organizationId: org.id,
        name: file.name,
        kind: file.kind,
        parentId: file.parentId,
        ownerId: file.ownerId,
        modifiedAt: new Date(file.modifiedAt),
        sizeBytes: file.sizeBytes ?? null,
        starred: file.starred,
        trashed: file.trashed,
        trashedAt: file.trashedAt ? new Date(file.trashedAt) : null,
        shared: file.shared,
        restricted: file.restricted,
      },
    })
  }

  for (const [fileId, entries] of Object.entries(data.shares)) {
    for (const entry of entries) {
      await prisma.fileShare.upsert({
        where: { fileId_userId: { fileId, userId: entry.memberId } },
        update: { permission: entry.permission },
        create: { fileId, userId: entry.memberId, permission: entry.permission },
      })
    }
  }

  for (const [fileId, versions] of Object.entries(data.versions)) {
    for (const version of versions) {
      await prisma.fileVersion.upsert({
        where: { id: version.id },
        update: {},
        create: {
          id: version.id,
          fileId,
          userId: version.memberId,
          note: version.note,
          at: new Date(version.at),
        },
      })
    }
  }

  for (const [fileId, activities] of Object.entries(data.activities)) {
    for (const activity of activities) {
      await prisma.fileActivity.upsert({
        where: { id: activity.id },
        update: {},
        create: {
          id: activity.id,
          fileId,
          userId: activity.memberId,
          action: activity.action,
          at: new Date(activity.at),
        },
      })
    }
  }
}

async function seedMessaging(org: SeedOrg, data: typeof messagingData) {
  const teamIdMap = new Map<string, string>()
  for (const team of data.teams) {
    const created = await prisma.chatTeam.upsert({
      where: { id: team.id },
      update: { name: team.name, description: team.description ?? null },
      create: {
        id: team.id,
        organizationId: org.id,
        name: team.name,
        description: team.description ?? null,
      },
    })
    teamIdMap.set(team.id, created.id)
  }

  const conversationIdMap = new Map<string, string>()
  for (const conversation of data.conversations) {
    const created = await prisma.conversation.upsert({
      where: { id: conversation.id },
      update: {
        name: conversation.name,
        topic: conversation.topic ?? null,
        teamId: conversation.teamId
          ? (teamIdMap.get(conversation.teamId) ?? conversation.teamId)
          : null,
        unreadCount: conversation.unreadCount,
        lastMessageAt: new Date(conversation.lastMessageAt),
        muted: conversation.muted ?? false,
        pinned: conversation.pinned ?? false,
      },
      create: {
        id: conversation.id,
        organizationId: org.id,
        kind: conversation.kind,
        name: conversation.name,
        topic: conversation.topic ?? null,
        teamId: conversation.teamId
          ? (teamIdMap.get(conversation.teamId) ?? conversation.teamId)
          : null,
        unreadCount: conversation.unreadCount,
        lastMessageAt: new Date(conversation.lastMessageAt),
        muted: conversation.muted ?? false,
        pinned: conversation.pinned ?? false,
      },
    })
    conversationIdMap.set(conversation.id, created.id)
    await prisma.conversationMember.deleteMany({
      where: { conversationId: created.id },
    })
    if (conversation.memberIds.length) {
      await prisma.conversationMember.createMany({
        data: conversation.memberIds.map((userId) => ({
          conversationId: created.id,
          userId,
        })),
        skipDuplicates: true,
      })
    }
  }

  for (const message of data.messages) {
    const created = await prisma.message.upsert({
      where: { id: message.id },
      update: {
        body: message.body,
        edited: message.edited ?? false,
        system: message.system ?? false,
        parentId: message.parentId ?? null,
        meetingTitle: message.meeting?.title ?? null,
        meetingStartsAt: message.meeting ? new Date(message.meeting.startsAt) : null,
        meetingDuration: message.meeting?.durationMinutes ?? null,
      },
      create: {
        id: message.id,
        conversationId:
          conversationIdMap.get(message.conversationId) ?? message.conversationId,
        authorId: message.authorId,
        body: message.body,
        createdAt: new Date(message.createdAt),
        edited: message.edited ?? false,
        system: message.system ?? false,
        parentId: message.parentId ?? null,
        meetingTitle: message.meeting?.title ?? null,
        meetingStartsAt: message.meeting ? new Date(message.meeting.startsAt) : null,
        meetingDuration: message.meeting?.durationMinutes ?? null,
      },
    })

    await prisma.messageAttachment.deleteMany({ where: { messageId: created.id } })
    if (message.attachments.length) {
      await prisma.messageAttachment.createMany({
        data: message.attachments.map((attachment) => ({
          id: attachment.id,
          messageId: created.id,
          name: attachment.name,
          kind: attachment.kind,
          meta: attachment.meta ?? null,
        })),
        skipDuplicates: true,
      })
    }

    for (const reaction of message.reactions) {
      for (const userId of reaction.memberIds) {
        await prisma.messageReaction.upsert({
          where: {
            messageId_emoji_userId: {
              messageId: created.id,
              emoji: reaction.emoji,
              userId,
            },
          },
          update: {},
          create: {
            messageId: created.id,
            emoji: reaction.emoji,
            userId,
          },
        })
      }
    }
  }
}

async function seedOrganization(org: SeedOrg) {
  const now = new Date()
  const localizedProjectData = buildOrgData(projectData, org)
  const localizedCalendarData = buildOrgData(calendarData, org)
  const localizedFilesData = buildOrgData(filesData, org)
  const localizedMessagingData = buildOrgData(messagingData, org)

  console.log(`Seeding workspace (${org.slug})…`)
  await seedWorkspace(org, localizedProjectData, now)
  console.log(`Seeding projects (${org.slug})…`)
  await seedProjects(org, localizedProjectData)
  console.log(`Seeding calendars (${org.slug})…`)
  await seedCalendars(org, localizedCalendarData)
  console.log(`Seeding files (${org.slug})…`)
  await seedFiles(org, localizedFilesData)
  console.log(`Seeding messaging (${org.slug})…`)
  await seedMessaging(org, localizedMessagingData)
}

async function main() {
  await seedOrganization(EN_ORG)
  await seedOrganization(FR_ORG)
  console.log(
    `Done. Demo organization ids: ${EN_ORG.id}, ${FR_ORG.id}`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
