import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// GET /api/orders/[id]
// Returns a single order by ID
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    if (!orderId) {
      return NextResponse.json({ error: "Missing order id" }, { status: 400 })
    }

    const orderSnap = await db.doc(`orders/${orderId}`).get()
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderSnap.data()
    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error("GET /api/orders/[id] failed", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
