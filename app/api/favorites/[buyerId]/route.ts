import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// GET /api/favorites/[buyerId]
export async function GET(
  _req: Request,
  { params }: { params: { buyerId: string } }
) {
  try {
    const buyerId = params.buyerId
    if (!buyerId) {
      return NextResponse.json({ error: "Missing buyer id" }, { status: 400 })
    }

    const favSnap = await db.doc(`favorites/${buyerId}`).get()
    const favorites: string[] = favSnap.exists ? (favSnap.data()?.productIds || []) : []
    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("GET /api/favorites/[buyerId] failed", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}


