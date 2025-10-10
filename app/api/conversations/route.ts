import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// POST /api/conversations
// Body: { buyerId, farmerId, productId }
// Creates or returns existing conversation id linking buyer, farmer, product
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { buyerId, farmerId, productId } = body || {}

    if (!buyerId || !farmerId || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const convKey = `${buyerId}_${farmerId}_${productId}`
    const convRef = db.doc(`conversations_meta/${convKey}`)
    const snap = await convRef.get()

    if (!snap.exists) {
      const conversation = {
        id: convKey,
        buyerId,
        farmerId,
        productId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participants: [buyerId, farmerId],
      }
      await convRef.set(conversation)
      // index by user for quick listing
      const buyerIdxRef = db.doc(`user_conversations/${buyerId}`)
      const buyerIdxSnap = await buyerIdxRef.get()
      const buyerList: string[] = buyerIdxSnap.exists ? (buyerIdxSnap.data()?.conversationIds || []) : []
      await buyerIdxRef.set({ conversationIds: Array.from(new Set([...buyerList, convKey])) })

      const farmerIdxRef = db.doc(`user_conversations/${farmerId}`)
      const farmerIdxSnap = await farmerIdxRef.get()
      const farmerList: string[] = farmerIdxSnap.exists ? (farmerIdxSnap.data()?.conversationIds || []) : []
      await farmerIdxRef.set({ conversationIds: Array.from(new Set([...farmerList, convKey])) })
    }

    return NextResponse.json({ conversationId: convKey })
  } catch (error) {
    console.error("POST /api/conversations failed", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}


