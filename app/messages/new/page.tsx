"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function StartConversationPage() {
	const router = useRouter()
	const search = useSearchParams()
	const productId = search?.get("productId")
	const farmerId = search?.get("farmerId")
  const { user } = useAuth()

	useEffect(() => {
    const createAndRoute = async () => {
      if (!productId || !farmerId || !user) return
      try {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ buyerId: user.id, farmerId, productId })
        })
        const data = await res.json()
        if (res.ok && data.conversationId) {
          router.replace(`/messages/${encodeURIComponent(data.conversationId)}`)
        }
      } catch (e) {
        console.error('Failed to start conversation', e)
      }
    }
    createAndRoute()
  }, [productId, farmerId, user, router])

	return null
}
