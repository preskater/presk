import type { OrgRole } from "@/lib/organization/roles"

export interface RequestContext {
  userId: string
  userName: string
  userEmail: string
  organizationId: string
  role: OrgRole
}

export type RequestContextInput = Partial<RequestContext> & {
  organizationId?: string | null
  userId?: string | null
}

export function isSystemActor(ctx: RequestContext) {
  return ctx.userId === "system"
}
