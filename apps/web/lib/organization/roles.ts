export type OrgRole = "owner" | "admin" | "member" | "viewer"

export interface RoleMeta {
  value: OrgRole
  badge: "default" | "secondary" | "outline"
}

export const ORG_ROLES: RoleMeta[] = [
  { value: "owner", badge: "default" },
  { value: "admin", badge: "default" },
  { value: "member", badge: "secondary" },
  { value: "viewer", badge: "outline" },
]

export const INVITABLE_ROLES = ORG_ROLES.filter((role) => role.value !== "owner")

export function getRoleMeta(role: string | null | undefined): RoleMeta {
  return ORG_ROLES.find((item) => item.value === role) ?? { value: "member", badge: "outline" }
}

export function parseRoles(role: string | null | undefined): OrgRole[] {
  const roles = (role ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  return roles.length > 0 ? (roles as OrgRole[]) : ["member"]
}
