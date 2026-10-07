export type OrgRole = "owner" | "admin" | "member" | "viewer"

export interface RoleMeta {
  value: OrgRole
  label: string
  description: string
  badge: "default" | "secondary" | "outline"
}

export const ORG_ROLES: RoleMeta[] = [
  {
    value: "owner",
    label: "Owner",
    description: "Full access, including deleting the organization.",
    badge: "default",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage members, invitations and organization settings.",
    badge: "default",
  },
  {
    value: "member",
    label: "Member",
    description: "Use the workspace. Cannot manage people or settings.",
    badge: "secondary",
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Read-only access to the workspace.",
    badge: "outline",
  },
]

export const INVITABLE_ROLES = ORG_ROLES.filter((role) => role.value !== "owner")

export function getRoleMeta(role: string | null | undefined): RoleMeta {
  return (
    ORG_ROLES.find((item) => item.value === role) ?? {
      value: "member",
      label: role ?? "Member",
      description: "",
      badge: "outline",
    }
  )
}

export function formatRoleLabel(role: string | null | undefined) {
  const roles = (role ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  if (roles.length === 0) return "Member"
  return roles.map((value) => getRoleMeta(value).label).join(", ")
}
