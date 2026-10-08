import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { getActiveOrgSlug } from "@/lib/organization/paths"

export async function isAuthenticated() {
  const session = await auth.api.getSession({ headers: await headers() })
  return Boolean(session)
}

export async function getMarketingAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { isAuthenticated: false, dashboardHref: "/sign-up" }
  }
  const slug = await getActiveOrgSlug()
  return {
    isAuthenticated: true,
    dashboardHref: slug ? `/${slug}` : "/onboarding",
  }
}
