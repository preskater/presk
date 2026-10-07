import { AnnouncementBar } from "@/components/landing/announcement-bar"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

import { isAuthenticated } from "@/lib/landing/session"

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const authenticated = await isAuthenticated()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AnnouncementBar />
      <Navbar isAuthenticated={authenticated} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
