"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ErrorBoundary } from "react-error-boundary"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BuyerOnly } from "@/components/role-guard"
import { BuyerDashboardContent } from "@/components/buyer/buyer-dashboard-content"
import { useTranslation } from "@/lib/i18n"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

export default function BuyerDashboardPage() {
  const { user, buyerProfile, loading } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <BuyerOnly>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          }
        >
          <DashboardLayout>
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back{user.name ? `, ${user.name}` : ''}!</h1>
              <p className="text-muted-foreground">Here's what's happening with your orders today.</p>
            </div>
            <BuyerDashboardContent />
          </DashboardLayout>
        </Suspense>
      </ErrorBoundary>
    </BuyerOnly>
  )
}
