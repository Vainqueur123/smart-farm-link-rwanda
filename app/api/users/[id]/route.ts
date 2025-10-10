import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"

// PUT /api/users/[id]
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    await db.doc(`users/${id}`).set({ ...body, id },)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('PUT /api/users/[id] failed', e)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/users/[id]
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    // Soft delete: mark deleted flag; in a real app, cascade delete related data
    await db.doc(`users/${id}`).set({ deleted: true },)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/users/[id] failed', e)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}


