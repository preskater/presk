export type AgentStatus = "active" | "idle" | "error" | "stalled" | "archived"

export type SessionStatus = "running" | "completed" | "failed" | "pending"

export type RiskLevel = "low" | "medium" | "high"

export type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated"

export type UserRole = "admin" | "editor" | "viewer"

export interface Tool {
  id: string
  name: string
  category: string
  description: string
  status: "connected" | "disconnected" | "degraded"
  latency: number
  scopes: string[]
  rateLimit: string
}

export interface AgentVersion {
  id: string
  version: number
  createdAt: string
  author: string
  summary: string
  diff: string
}

export interface Agent {
  id: string
  name: string
  role: string
  description: string
  instructions: string
  model: string
  temperature: number
  maxTokens: number
  timeout: number
  status: AgentStatus
  team: string
  domain: string
  tenant: string
  owner: string
  lastActivity: string
  tags: string[]
  tools: string[]
  handoffs: string[]
  versions: AgentVersion[]
  metrics: {
    avgResponseTime: number
    successRate: number
    costPerSession: number
    sessions: number
    satisfaction: number
  }
}

export interface SessionTurn {
  id: string
  role: "user" | "assistant" | "tool" | "system"
  content: string
  tool?: string
  duration: number
  timestamp: string
  status: "ok" | "error"
}

export interface Session {
  id: string
  agentId: string
  agentName: string
  status: SessionStatus
  duration: number
  cost: number
  timestamp: string
  tenant: string
  user: string
  tags: string[]
  turns: SessionTurn[]
  artifacts: { name: string; type: string; size: string }[]
}

export interface Approval {
  id: string
  action: string
  agentId: string
  agentName: string
  risk: RiskLevel
  deadline: string
  status: ApprovalStatus
  context: string
  justification: string
  impact: string
  amount?: number
  requestedBy: string
  decisions: {
    by: string
    action: "approved" | "rejected" | "escalated" | "commented"
    comment?: string
    at: string
  }[]
}

export interface ApprovalRule {
  id: string
  agentId: string
  agentName: string
  actionTypes: string[]
  threshold: number
  autoApprove: boolean
  escalation: string
  escalationTimeout: number
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  tenant: string
  lastLogin: string
}

export interface Tenant {
  id: string
  name: string
  maxAgents: number
  maxSessionsPerDay: number
  monthlyBudget: number
  logo: string
  color: string
  domain: string
}

export interface Integration {
  id: string
  name: string
  category: string
  description: string
  status: "up" | "down" | "degraded"
  latency: number
  endpoint: string
  scopes: string[]
  rateLimit: string
}

export interface Webhook {
  id: string
  url: string
  events: string[]
  status: "active" | "disabled"
  lastSent: string
  successRate: number
}

export interface WebhookEvent {
  id: string
  webhookId: string
  event: string
  status: "success" | "failed"
  timestamp: string
  payload: string
}

export interface AuditEntry {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  tenant: string
}

export interface ApiKey {
  id: string
  name: string
  key: string
  scopes: string[]
  createdAt: string
  lastUsed: string
  status: "active" | "revoked"
}

export interface KpiMetric {
  label: string
  value: string
  change: number
  changeLabel: string
  trend: "up" | "down"
}

export interface AlertItem {
  id: string
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: string
}
