import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import { CompassIcon } from "lucide-react"

import type { Metadata } from "next"

import "@workspace/ui/globals.css"
import { Button } from "@workspace/ui/components/button"
import { NotFoundState } from "@/components/states/not-found-state"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='system'||!t?window.matchMedia('(prefers-color-scheme: dark)').matches:t==='dark';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export const metadata: Metadata = {
  title: "Page not found · Presk",
}

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground">
        <main className="flex min-h-svh w-full items-center justify-center">
          <NotFoundState
            icon={CompassIcon}
            title="Page not found"
            description="We couldn't find the page you were looking for. It may have moved or no longer exists."
            actions={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button nativeButton={false} render={<Link href="/en" />}>
                  Back to home
                </Button>
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/en/sign-in" />}
                >
                  Sign in
                </Button>
              </div>
            }
          />
        </main>
      </body>
    </html>
  )
}
