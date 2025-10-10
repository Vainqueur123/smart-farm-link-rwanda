import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// GET /api/buyer/contact/[farmerId] -> returns { phone }
export async function GET(_req: Request, { params }: { params: { farmerId: string } }) {
  try {
    const { farmerId } = params
    if (!farmerId) return NextResponse.json({ error: 'Missing farmerId' }, { status: 400 })
    const farmerDoc = await db.doc(`farmers/${farmerId}`).get()
    const phone = farmerDoc.exists ? (farmerDoc.data()?.phone || '0785062969') : '0785062969'
    return NextResponse.json({ phone })
  } catch (e) {
    console.error('GET /api/buyer/contact/[farmerId] failed', e)
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}


