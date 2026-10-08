import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parseRoles } from "@/lib/organization/utils"
import type { OrgRole } from "@/lib/organization/roles"

import { UnauthorizedError, ForbiddenError } from "./errors"
import type { RequestContext } from "./context"

const DEFAULT_ROLE: OrgRole = "member"

function resolveRole(role: string | null | undefined): OrgRole {
  const roles = parseRoles(role)
  return roles[0] ?? DEFAULT_ROLE
}

async function contextFromSession(): Promise<RequestContext | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const organizationId = session.session.activeOrganizationId
  if (!organizationId) return null

  const member = await prisma.member.findFirst({
    where: { organizationId, userId: session.user.id },
    select: { role: true },
  })

  return {
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    organizationId,
    role: resolveRole(member?.role),
  }
}

function contextFromServiceToken(token: string): RequestContext | null {
  const expected = process.env.MCP_SERVICE_TOKEN
  if (!expected || token !== expected) return null

  const organizationId = process.env.MCP_SERVICE_ORG_ID
  const userId = process.env.MCP_SERVICE_USER_ID
  const role = resolveRole(process.env.MCP_SERVICE_ROLE)

  if (!organizationId || !userId) return null

  return {
    userId,
    userName: process.env.MCP_SERVICE_USER_NAME ?? "Presk Assistant",
    userEmail: process.env.MCP_SERVICE_USER_EMAIL ?? "assistant@presk.app",
    organizationId,
    role,
  }
}

export interface GetRequestContextOptions {
  request?: Request
  required?: boolean
}

export async function getRequestContext(
  options: GetRequestContextOptions = {}
): Promise<RequestContext> {
  // Only an explicit Bearer token (machine-to-machine) or an authenticated
  // session may establish context. We never fall back to the service token
  // implicitly, otherwise any unauthenticated request would inherit the MCP
  // service organization's context.
  const token = options.request?.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")

  if (token) {
    const fromToken = contextFromServiceToken(token)
    if (fromToken) return fromToken
  }

  const ctx = await contextFromSession()
  if (ctx) return ctx

  throw new UnauthorizedError()
}

export async function getOptionalRequestContext(): Promise<RequestContext | null> {
  try {
    return await contextFromSession()
  } catch {
    return null
  }
}

export async function getRequestContextForOrganization(
  organizationId: string
): Promise<RequestContext> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new UnauthorizedError()

  const member = await prisma.member.findFirst({
    where: { organizationId, userId: session.user.id },
    select: { role: true },
  })

  return {
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    organizationId,
    role: resolveRole(member?.role),
  }
}

export function requirePermission(ctx: RequestContext, allowed: OrgRole[]) {
  if (allowed.includes(ctx.role)) return
  throw new ForbiddenError()
}
