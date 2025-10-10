import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// GET /api/orders/buyer/[id]
// Returns all orders for the specified buyer
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const buyerId = params.id
    if (!buyerId) {
      return NextResponse.json({ error: "Missing buyer id" }, { status: 400 })
    }

    // Orders are stored under orders/{orderId} and indexed under orders_by_buyer/{buyerId}
    const indexSnap = await db.doc(`orders_by_buyer/${buyerId}`).get()
    const orderIds: string[] = indexSnap.exists ? (indexSnap.data()?.orderIds || []) : []

    const orders = [] as any[]
    for (const orderId of orderIds) {
      const orderSnap = await db.doc(`orders/${orderId}`).get()
      if (orderSnap.exists) {
        orders.push(orderSnap.data())
      }
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("GET /api/orders/buyer/[id] failed", error)
    return NextResponse.json({ error: "Failed to fetch buyer orders" }, { status: 500 })
  }
}


