import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// POST /api/orders
// Body: { id?, buyerId, farmerId, productId, quantity, address, notes?, totalAmount?, currency? }
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      id,
      buyerId,
      farmerId,
      productId,
      quantity,
      address,
      notes,
      totalAmount,
      currency = "RWF",
      merge = false,
    } = body || {}

    if (!buyerId || !farmerId || !productId || !quantity || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const now = new Date().toISOString()

    // If merge is requested, try to find an existing pending/processing order for this buyer and product
    if (merge) {
      const buyerIdxRef = db.doc(`orders_by_buyer/${buyerId}`)
      const buyerIdxSnap = await buyerIdxRef.get()
      const buyerOrderIds: string[] = buyerIdxSnap.exists ? (buyerIdxSnap.data()?.orderIds || []) : []

      let mergedOrder: any | null = null
      for (const existingOrderId of buyerOrderIds) {
        const existingSnap = await db.doc(`orders/${existingOrderId}`).get()
        if (!existingSnap.exists) continue
        const existing = existingSnap.data()
        const status = (existing.status || "").toLowerCase()
        const firstItem = Array.isArray(existing.items) && existing.items.length > 0 ? existing.items[0] : null
        if ((status === "pending" || status === "processing") && firstItem && firstItem.productId === productId) {
          // increment quantity and totals
          const newQuantity = (firstItem.quantity || 0) + quantity
          const unitPrice = firstItem.pricePerUnit || 0
          const newItemTotal = unitPrice * newQuantity
          const otherItemsTotal = existing.items.slice(1).reduce((sum: number, it: any) => sum + (it.totalPrice || 0), 0)
          const newTotal = newItemTotal + otherItemsTotal

          const updatedOrder = {
            ...existing,
            items: [
              {
                ...firstItem,
                quantity: newQuantity,
                totalPrice: newItemTotal,
              },
              ...existing.items.slice(1),
            ],
            totalAmount: newTotal,
            updatedAt: now,
          }

          await db.doc(`orders/${existing.id}`).set(updatedOrder)
          mergedOrder = updatedOrder
          break
        }
      }

      if (mergedOrder) {
        return NextResponse.json({ order: mergedOrder }, { status: 200 })
      }
      // fall through to create new order if none found
    }

    const orderId = id || `order_${Date.now()}`
    const order = {
      id: orderId,
      buyerId,
      sellerId: farmerId,
      items: [
        {
          id: `item_${Date.now()}`,
          orderId,
          productId,
          productName: "",
          quantity,
          unit: "kg",
          pricePerUnit: totalAmount ? (totalAmount / quantity) : 0,
          totalPrice: totalAmount || 0,
          imageUrl: "",
          category: "vegetables",
        },
      ],
      totalAmount: totalAmount || 0,
      currency,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: null,
      deliveryAddress: address,
      deliveryMethod: "delivery",
      estimatedDelivery: null,
      actualDelivery: null,
      notes: notes || null,
      createdAt: now,
      updatedAt: now,
    }

    await db.doc(`orders/${orderId}`).set(order)

    // maintain buyer and seller indexes for quick lookup
    const buyerIdxRef = db.doc(`orders_by_buyer/${buyerId}`)
    const buyerIdxSnap = await buyerIdxRef.get()
    const buyerOrderIds: string[] = buyerIdxSnap.exists ? buyerIdxSnap.data()?.orderIds || [] : []
    await buyerIdxRef.set({ orderIds: Array.from(new Set([...buyerOrderIds, orderId])) })

    const sellerIdxRef = db.doc(`orders_by_seller/${farmerId}`)
    const sellerIdxSnap = await sellerIdxRef.get()
    const sellerOrderIds: string[] = sellerIdxSnap.exists ? sellerIdxSnap.data()?.orderIds || [] : []
    await sellerIdxRef.set({ orderIds: Array.from(new Set([...sellerOrderIds, orderId])) })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error("POST /api/orders failed", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}


