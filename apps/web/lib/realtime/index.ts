import {
  orgChannel,
  publish,
  type RealtimeEvent,
  type RealtimeEventType,
} from "./pg"

function emit(
  orgId: string,
  scope: "chat" | "projects" | "calendars" | "files",
  type: RealtimeEventType,
  data: Record<string, unknown>
) {
  const event: RealtimeEvent = {
    type,
    orgId,
    at: new Date().toISOString(),
    data,
  }
  return publish(orgChannel(orgId, scope), event)
}

export const realtime = {
  messageCreated: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "message.created", data),
  messageUpdated: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "message.updated", data),
  messageDeleted: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "message.deleted", data),
  conversationUpdated: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "conversation.updated", data),
  typing: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "typing", data),
  presence: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "chat", "presence", data),
  projectChanged: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "projects", "project.changed", data),
  calendarChanged: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "calendars", "calendar.changed", data),
  fileChanged: (orgId: string, data: Record<string, unknown>) =>
    emit(orgId, "files", "file.changed", data),
}
