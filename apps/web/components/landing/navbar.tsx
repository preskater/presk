"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { Wordmark } from "@/components/landing/wordmark"
import { Button } from "@workspace/ui/components/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Separator } from "@workspace/ui/components/separator"

import {
  companyNav,
  productNav,
  resourceNav,
  solutionNav,
  type NavColumn,
} from "@/lib/landing/content"

function NavMenuColumn({ column }: { column: NavColumn }) {
  return (
    <div className="grid gap-1 p-1">
      {column.links.map((link) => (
        <NavigationMenuLink
          key={link.title}
          render={<Link href={link.href} />}
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-medium">{link.title}</span>
            {link.description ? (
              <span className="text-xs text-muted-foreground">
                {link.description}
              </span>
            ) : null}
          </span>
        </NavigationMenuLink>
      ))}
    </div>
  )
}

const columns = [productNav, solutionNav, resourceNav, companyNav]

export function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-6">
        <div className="flex items-center">
          <Link href="/" aria-label="Presk home">
            <Wordmark />
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {columns.map((column) => (
              <NavigationMenuItem key={column.title}>
                <NavigationMenuTrigger>{column.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="w-72">
                  <NavMenuColumn column={column} />
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/pricing" />}
                className="h-9 items-center px-2.5 py-1.5"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button
              className="hidden sm:inline-flex"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                render={<Link href="/sign-in" />}
                nativeButton={false}
              >
                Sign in
              </Button>
              <Button
                className="hidden sm:inline-flex"
                render={<Link href="/sign-up" />}
                nativeButton={false}
              >
                Start free
              </Button>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <SheetHeader>
                <SheetTitle>
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 overflow-y-auto p-4">
                {columns.map((column) => (
                  <div key={column.title} className="flex flex-col gap-1">
                    <p className="px-1 text-xs font-medium text-muted-foreground">
                      {column.title}
                    </p>
                    {column.links.map((link) => (
                      <Link
                        key={link.title}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      >
                        {link.title}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link
                  href="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                >
                  Pricing
                </Link>
              </div>
              <div className="mt-auto flex flex-col gap-2 border-t p-4">
                <Separator className="mb-2" />
                {isAuthenticated ? (
                  <Button
                    render={<Link href="/dashboard" />}
                    nativeButton={false}
                  >
                    Go to dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      render={<Link href="/sign-up" />}
                      nativeButton={false}
                    >
                      Start free
                    </Button>
                    <Button
                      variant="outline"
                      render={<Link href="/sign-in" />}
                      nativeButton={false}
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
