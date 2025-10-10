"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { format } from "date-fns"

interface OrderTrackingProps {
  orderId: string
}

interface OrderStatus {
  id: string
  buyerId: string
  sellerId: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: string
  totalAmount: number
  currency: string
  deliveryAddress: string | { address?: string; district?: string; contactPhone?: string }
  estimatedDelivery?: string
  actualDelivery?: string
  trackingNotes?: string
  items: Array<{
    productName: string
    quantity: number
    unit: string
    pricePerUnit: number
    totalPrice: number
  }>
  createdAt: string
  updatedAt: string
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
]

const getStatusIndex = (status: string) => {
  const index = statusSteps.findIndex((s) => s.key === status.toLowerCase())
  return index >= 0 ? index : 0
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-500"
    case "shipped":
      return "bg-blue-500"
    case "processing":
      return "bg-yellow-500"
    case "pending":
      return "bg-gray-400"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-300"
  }
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) throw new Error("Failed to fetch order")
        const data = await res.json()
        setOrder(data.order)
      } catch (err) {
        console.error(err)
        setError("Could not load order details")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-red-500">{error || "Order not found"}</p>
        </CardContent>
      </Card>
    )
  }

  const currentStatusIndex = getStatusIndex(order.status)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Placed on {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </CardDescription>
          </div>
          <Badge
            variant={
              order.status === "delivered"
                ? "default"
                : order.status === "cancelled"
                ? "destructive"
                : "secondary"
            }
            className="capitalize"
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Timeline */}
        <div className="relative">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const isLast = index === statusSteps.length - 1

              return (
                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                  {/* Connecting Line */}
                  {!isLast && (
                    <div
                      className={`absolute top-5 left-1/2 w-full h-0.5 ${
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? getStatusColor(step.key) : "bg-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-2 text-xs text-center ${
                      isCurrent ? "font-semibold text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Delivery Information */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Delivery Information
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p>{typeof order.deliveryAddress === 'string' 
              ? order.deliveryAddress 
              : order.deliveryAddress?.address || 'No address provided'}</p>
          </div>
          {order.estimatedDelivery && (
            <p className="text-sm text-gray-600">
              <Clock className="h-4 w-4 inline mr-1" />
              Estimated delivery: {format(new Date(order.estimatedDelivery), "MMM d, yyyy")}
            </p>
          )}
          {order.actualDelivery && (
            <p className="text-sm text-green-600 font-medium">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              Delivered on {format(new Date(order.actualDelivery), "MMM d, yyyy 'at' h:mm a")}
            </p>
          )}
        </div>

        <Separator />

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-semibold">Order Items</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-gray-500">
                  {item.quantity} {item.unit} × {order.currency} {item.pricePerUnit.toLocaleString()}
                </p>
              </div>
              <span className="font-medium">
                {order.currency} {item.totalPrice.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total</span>
          <span className="font-bold text-lg">
            {order.currency} {order.totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Tracking Notes */}
        {order.trackingNotes && (
          <>
            <Separator />
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> {order.trackingNotes}
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
          {order.status === "delivered" && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Leave Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
