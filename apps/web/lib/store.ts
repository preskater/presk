import type {
  Agent,
  Approval,
  Session,
  User,
  Tenant,
  Integration,
  Webhook,
  AuditEntry,
  ApiKey,
  Tool,
  ApprovalRule,
} from "./types"
import {
  agents as agentsData,
  sessions as sessionsData,
  approvals as approvalsData,
  users as usersData,
  tenants as tenantsData,
  integrations as integrationsData,
  webhooks as webhooksData,
  auditLog as auditLogData,
  apiKeys as apiKeysData,
  tools as toolsData,
  approvalRules as approvalRulesData,
} from "./data"

// In-memory stores. Swap these with real API calls later.
let agents = [...agentsData]
let sessions = [...sessionsData]
let approvals = [...approvalsData]
let users = [...usersData]
let tenants = [...tenantsData]
let integrations = [...integrationsData]
let webhooks = [...webhooksData]
let auditLog = [...auditLogData]
let apiKeys = [...apiKeysData]
let tools = [...toolsData]
let approvalRules = [...approvalRulesData]

export function listAgents(): Agent[] {
  return agents
}

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export function listSessions(): Session[] {
  return sessions
}

export function getSession(id: string): Session | undefined {
  return sessions.find((s) => s.id === id)
}

export function listApprovals(): Approval[] {
  return approvals
}

export function getApproval(id: string): Approval | undefined {
  return approvals.find((a) => a.id === id)
}

export function listUsers(): User[] {
  return users
}

export function listTenants(): Tenant[] {
  return tenants
}

export function listIntegrations(): Integration[] {
  return integrations
}

export function listWebhooks(): Webhook[] {
  return webhooks
}

export function listAuditLog(): AuditEntry[] {
  return auditLog
}

export function listApiKeys(): ApiKey[] {
  return apiKeys
}

export function listTools(): Tool[] {
  return tools
}

export function listApprovalRules(): ApprovalRule[] {
  return approvalRules
}
