"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, Sprout, ShoppingCart, CreditCard, Settings, User, LogOut, Menu, Bell, Globe, BarChart2, Users, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import { OfflineIndicator } from "@/components/offline-indicator"
import { NotificationSystem } from "@/components/notification-system"

interface HorizontalDashboardLayoutProps {
  children: React.ReactNode
}

export function HorizontalDashboardLayout({ children }: HorizontalDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, userProfile, userRole, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const setLanguage = (lng: string) => i18n.changeLanguage(lng)

  const getNavigation = () => {
    if (userRole === "admin") {
      return [
        { name: "Admin Dashboard", href: "/admin-dashboard", icon: Home },
        { name: "Users", href: "/admin-dashboard?tab=users", icon: Users },
        { name: "Products", href: "/admin-dashboard?tab=products", icon: ShoppingCart },
        { name: "Analytics", href: "/admin-dashboard?tab=analytics", icon: BarChart2 },
        { name: "Settings", href: "/admin-dashboard?tab=settings", icon: Settings },
      ]
    } else if (userRole === "buyer") {
      return [
        { name: "Dashboard", href: "/buyer-dashboard", icon: Home },
        { name: "Products", href: "/buyer-dashboard?tab=products", icon: ShoppingCart },
        { name: "Farmers", href: "/buyer-dashboard?tab=farmers", icon: Users },
        { name: "Orders", href: "/buyer-dashboard?tab=orders", icon: CreditCard },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    } else if (userRole === "advisor") {
      return [
        { name: "Dashboard", href: "/advisor-dashboard", icon: Home },
        { name: "Requests", href: "/advisor-dashboard?tab=requests", icon: MessageSquare },
        { name: "Farmers", href: "/advisor-dashboard?tab=farmers", icon: Users },
        { name: "Analytics", href: "/advisor-dashboard?tab=analytics", icon: BarChart2 },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    } else {
      // Default farmer navigation
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Farm", href: "/farm", icon: Sprout },
        { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
        { name: "Statistics", href: "/dashboard/statistics", icon: BarChart2 },
        { name: "Transactions", href: "/transactions", icon: CreditCard },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    }
  }

  const navigation = getNavigation()

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      await logout()
      console.log('Logout complete, redirecting...')
      router.push("/")
    } catch (error) {
      console.error('Sign out error:', error)
      // Force redirect even if logout fails
      router.push("/")
    }
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "rw" : "en"
    setLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center px-6 border-b">
                      <Sprout className="h-8 w-8 text-green-600" />
                      <span className="ml-2 text-lg font-semibold">{t("FarmLink RW")}</span>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon className="mr-3 h-5 w-5" />
                            {t(item.name)}
                          </Link>
                        )
                      })}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center ml-4">
                <Sprout className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-lg font-semibold">{t("FarmLink RW")}</span>
              </div>
            </div>

            {/* Horizontal Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {t(item.name)}
                  </Link>
                )
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-x-4">
              {/* Offline Indicator */}
              <OfflineIndicator />

              {/* Language toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLanguage === "en" ? "EN" : "RW"}</span>
              </Button>

              {/* Notifications */}
              <NotificationSystem />

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile?.name || user?.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
