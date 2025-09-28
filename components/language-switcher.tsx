"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "@/lib/lucide-react"
import { useTranslation } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const unsubscribe = i18n.onLanguageChanged(() => {
        // Force re-render when language changes
        setMounted(false)
        setTimeout(() => setMounted(true), 0)
      })
      return unsubscribe
    }
  }, [mounted, i18n])

  if (!mounted) return null

  const currentLanguage = i18n.language
  const languageNames = {
    en: t("english"),
    rw: t("kinyarwanda"),
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{languageNames[currentLanguage as keyof typeof languageNames]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("en")}
          className={currentLanguage === "en" ? "bg-green-50" : ""}
        >
          🇺🇸 {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => i18n.changeLanguage("rw")}
          className={currentLanguage === "rw" ? "bg-green-50" : ""}
        >
          🇷🇼 {t("kinyarwanda")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
