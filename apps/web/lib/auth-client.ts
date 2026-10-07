import { createAuthClient } from "better-auth/react"
import { adminClient, organizationClient } from "better-auth/client/plugins"

import { ac, orgRoles } from "./organization/access"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: orgRoles,
    }),
    adminClient(),
  ],
})
