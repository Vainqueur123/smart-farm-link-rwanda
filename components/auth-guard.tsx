"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "farmer" | "buyer" | "advisor" | "admin"
  requireProfile?: boolean
}

export function AuthGuard({ children, requiredRole, requireProfile = true }: AuthGuardProps) {
  const { user, userProfile, userRole, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/forgot-password"]
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (loading) return

    // If it's a public route, allow access
    if (isPublicRoute) {
      setIsChecking(false)
      return
    }

    // If user is not authenticated, redirect to sign in
    if (!user) {
      router.push("/auth/signin")
      return
    }

    // If user is authenticated but no profile exists, redirect to onboarding
    if (requireProfile && !userProfile) {
      router.push("/onboarding")
      return
    }

    // If a specific role is required, check if user has that role
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      if (userRole === "farmer") {
        router.push("/dashboard")
      } else if (userRole === "buyer") {
        router.push("/buyer-dashboard")
      } else if (userRole === "advisor") {
        router.push("/advisor-dashboard")
      } else if (userRole === "admin") {
        router.push("/admin-dashboard")
      } else {
        router.push("/onboarding")
      }
      return
    }

    setIsChecking(false)
  }, [user, userProfile, userRole, loading, pathname, router, requiredRole, requireProfile, isPublicRoute])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If it's a public route or user is properly authenticated, render children
  if (isPublicRoute || (user && (!requireProfile || userProfile))) {
    return <>{children}</>
  }

  // If we get here, something went wrong with authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
