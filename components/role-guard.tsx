"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
  showAccessDenied?: boolean
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackPath = "/dashboard",
  showAccessDenied = true 
}: RoleGuardProps) {
  const { user, loading, isAdmin, isFarmer, isBuyer } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      const hasAccess = allowedRoles.includes(user.role)
      
      if (!hasAccess) {
        if (fallbackPath) {
          router.push(fallbackPath)
        }
      }
    }
  }, [user, loading, allowedRoles, fallbackPath, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth/signin")
    return null
  }

  const hasAccess = allowedRoles.includes(user.role)

  if (!hasAccess && showAccessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800">
                    This page requires one of the following roles: {allowedRoles.join(", ")}
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    Your current role: <span className="font-medium">{user.role}</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => router.push("/dashboard")} 
                className="w-full"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="w-full"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}

// Convenience components for specific roles
export function FarmerOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["farmer"]} fallbackPath="/marketplace">
      {children}
    </RoleGuard>
  )
}

export function BuyerOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["buyer"]} fallbackPath="/marketplace">
      {children}
    </RoleGuard>
  )
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]} fallbackPath="/dashboard">
      {children}
    </RoleGuard>
  )
}

export function FarmerOrBuyer({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["farmer", "buyer"]} fallbackPath="/auth/signin">
      {children}
    </RoleGuard>
  )
}
