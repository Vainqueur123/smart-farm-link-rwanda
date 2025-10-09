"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function StartConversationPage() {
	const router = useRouter()
	const search = useSearchParams()
	const productId = search?.get("productId")
	const farmerId = search?.get("farmerId")

	useEffect(() => {
		// In a real app, create/find conversation ID here
		const conversationId = `${farmerId || 'unknown'}-${productId || 'unknown'}`
		router.replace(`/messages/${encodeURIComponent(conversationId)}`)
	}, [productId, farmerId, router])

	return null
}
