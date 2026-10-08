"use client"

import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { ErrorState } from "@/components/states/error-state"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='system'||!t?window.matchMedia('(prefers-color-scheme: dark)').matches:t==='dark';document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
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
        <ErrorState
          error={error}
          retry={retry}
          title="Something went wrong"
          description="The application hit an unexpected error while rendering. You can try again."
          className="min-h-svh"
        />
      </body>
    </html>
  )
}
