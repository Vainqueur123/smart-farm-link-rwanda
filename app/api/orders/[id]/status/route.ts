import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// PATCH /api/orders/[id]/status
// Update order status and tracking info
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    }

    const body = await req.json()
    const { status, estimatedDelivery, actualDelivery, trackingNotes } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Fetch existing order
    const orderSnap = await db.doc(`orders/${orderId}`).get()
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const existingOrder = orderSnap.data()
    const now = new Date().toISOString()

    // Build update object
    const updates: any = {
      status: status.toLowerCase(),
      updatedAt: now,
    }

    if (estimatedDelivery) {
      updates.estimatedDelivery = estimatedDelivery
    }

    if (actualDelivery) {
      updates.actualDelivery = actualDelivery
    }

    if (trackingNotes) {
      updates.trackingNotes = trackingNotes
    }

    // Auto-set actualDelivery when status becomes 'delivered'
    if (status.toLowerCase() === 'delivered' && !actualDelivery) {
      updates.actualDelivery = now
    }

    const updatedOrder = {
      ...existingOrder,
      ...updates,
    }

    await db.doc(`orders/${orderId}`).set(updatedOrder)

    return NextResponse.json({ order: updatedOrder }, { status: 200 })
  } catch (error) {
    console.error("PATCH /api/orders/[id]/status failed", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
