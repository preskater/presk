export function orgPrefix(organizationId: string) {
  return `org/${organizationId}`
}

export function isOwnedPath(organizationId: string, pathname: string) {
  return pathname.startsWith(`${orgPrefix(organizationId)}/`)
}

export function buildUploadPath(organizationId: string, name: string) {
  const safe = name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 120)
  return `${orgPrefix(organizationId)}/${safe}`
}
