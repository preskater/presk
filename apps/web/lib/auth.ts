import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin, organization } from "better-auth/plugins"

import { ac, orgRoles } from "./organization/access"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      teams: { enabled: true },
      ac,
      roles: orgRoles,
      allowUserToCreateOrganization: true,
      organizationLimit: 10,
      membershipLimit: 100,
      creatorRole: "owner",
      requireEmailVerificationOnInvitation: false,
      organizationHooks: {
        afterCreateOrganization: async ({ organization, user }) => {
          await prisma.calendar.create({
            data: {
              organizationId: organization.id,
              name: "Personal",
              kind: "personal",
              color: "blue",
              members: { create: [{ userId: user.id }] },
            },
          })
        },
      },
    }),
    admin(),
    nextCookies(),
  ],
})
