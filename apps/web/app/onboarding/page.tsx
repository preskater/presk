import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  const invitations = await prisma.invitation.findMany({
    where: {
      email: { equals: session.user.email, mode: "insensitive" },
      status: "pending",
      expiresAt: { gt: new Date() },
    },
    include: { organization: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  const pendingInvitations = invitations.map((invitation) => ({
    id: invitation.id,
    organizationName: invitation.organization.name,
    role: invitation.role,
  }))

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <OnboardingFlow
          userName={session.user.name}
          invitations={pendingInvitations}
        />
      </div>
    </div>
  )
}
