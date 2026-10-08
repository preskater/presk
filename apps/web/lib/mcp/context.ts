import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js"

import { UnauthorizedError } from "@/lib/core/errors"
import type { RequestContext } from "@/lib/core/context"
import type { OrgRole } from "@/lib/organization/roles"

interface McpTokenExtra {
  userId?: string
  organizationId?: string
  role?: OrgRole
  userName?: string
  userEmail?: string
}

export function contextFromAuthInfo(
  authInfo: AuthInfo | undefined
): RequestContext {
  const extra = (authInfo?.extra ?? {}) as McpTokenExtra
  if (!extra.userId || !extra.organizationId) {
    throw new UnauthorizedError(
      "Missing workspace context on the MCP token. Configure MCP_SERVICE_* env vars."
    )
  }
  return {
    userId: extra.userId,
    organizationId: extra.organizationId,
    role: extra.role ?? "member",
    userName: extra.userName ?? "Presk Assistant",
    userEmail: extra.userEmail ?? "assistant@presk.app",
  }
}
