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
import { Home, Sprout, ShoppingCart, CreditCard, Settings, User, LogOut, Menu, Bell, Globe, BarChart2, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"
import { OfflineIndicator } from "@/components/offline-indicator"
import { MessagingWidget } from "@/components/messaging-system"
import { PerformanceMonitor } from "@/components/performance-monitor"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, farmerProfile, buyerProfile, logout, isAdmin, isFarmer, isBuyer } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language
  const setLanguage = (lng: string) => i18n.changeLanguage(lng)
  
  // Role-based navigation
  const getNavigation = () => {
    if (isAdmin()) {
      return [
        { name: "Admin Dashboard", href: "/admin-dashboard", icon: Shield },
        { name: "User Management", href: "/admin-dashboard?tab=users", icon: User },
        { name: "Analytics", href: "/admin-dashboard?tab=analytics", icon: BarChart2 },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    } else if (isBuyer()) {
      return [
        { name: "Buyer Dashboard", href: "/buyer-dashboard", icon: Home },
        { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
        { name: "My Orders", href: "/buyer-dashboard?tab=orders", icon: CreditCard },
        { name: "Favorites", href: "/buyer-dashboard?tab=favorites", icon: ShoppingCart },
        { name: "Settings", href: "/settings", icon: Settings },
      ]
    } else {
      return [
        { name: "Farmer Dashboard", href: "/farmer-dashboard", icon: Home },
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
    await logout()
    router.push("/")
  }

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "rw" : "en"
    setLanguage(newLang)
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-lg font-semibold">{t("FarmLink RW")}</span>
            </div>

            {/* Navigation */}
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

            

            {/* User info */}
            <div className="border-t p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || farmerProfile?.name || buyerProfile?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'Administrator' : 
                     user?.role === 'farmer' ? farmerProfile?.district : 
                     user?.role === 'buyer' ? buyerProfile?.location.district : 
                     'User'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-lg font-semibold">{t("FarmLink RW")}</span>
          </div>

          {/* Navigation */}
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
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {t(item.name)}
                </Link>
              )
            })}
          </nav>

          

          {/* User info */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || farmerProfile?.name || buyerProfile?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Administrator' : 
                   user?.role === 'farmer' ? farmerProfile?.district : 
                   user?.role === 'buyer' ? buyerProfile?.location.district : 
                   'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center">
              <OfflineIndicator />
            </div>
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Language toggle */}
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="h-4 w-4 mr-2" />
                {currentLanguage === "en" ? "RW" : "EN"}
              </Button>

              {/* Messaging Widget */}
              {(isFarmer() || isBuyer()) && <MessagingWidget />}

              {/* Notifications */}
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("My Account")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("Profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("Settings")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("Sign out")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <PerformanceMonitor pageName={pathname}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Welcome to your dashboard</h2>
              </div>
              {children}
            </PerformanceMonitor>
          </div>
        </main>
      </div>
    </div>
  )
}
