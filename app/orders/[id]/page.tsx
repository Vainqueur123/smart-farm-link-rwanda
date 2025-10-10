"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrderTracking } from "@/components/order-tracking"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Tracking</h1>
            <p className="text-muted-foreground">Track your order status and delivery</p>
          </div>
        </div>

        <OrderTracking orderId={orderId} />
      </div>
    </DashboardLayout>
  )
}
