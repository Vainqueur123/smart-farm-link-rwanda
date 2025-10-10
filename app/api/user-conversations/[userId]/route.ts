import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// GET /api/user-conversations/[userId]
export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    const snap = await db.doc(`user_conversations/${userId}`).get()
    const conversationIds: string[] = snap.exists ? (snap.data()?.conversationIds || []) : []
    return NextResponse.json({ conversationIds })
  } catch (e) {
    console.error('GET /api/user-conversations/[userId] failed', e)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}


