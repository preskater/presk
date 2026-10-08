"use client"

import { LanguagesIcon } from "lucide-react"
import { useLocale } from "next-intl"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

const labels: Record<string, string> = {
  en: "English",
  fr: "Français",
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Change language"
          />
        }
      >
        <LanguagesIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((option) => (
          <DropdownMenuItem
            key={option}
            render={<Link href={pathname} locale={option} />}
            disabled={option === locale}
          >
            {labels[option] ?? option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
