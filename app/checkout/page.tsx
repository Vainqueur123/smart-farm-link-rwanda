"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
	const search = useSearchParams()
	const router = useRouter()
	const conversation = search?.get("conversation")
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Checkout</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="mb-4 text-sm text-gray-700">Conversation: {conversation}</p>
					<p className="mb-6 text-gray-600">This is a minimal stub. Your order intent has been recorded.</p>
					<Button onClick={() => router.push("/buyer-dashboard")}>Go to Buyer Dashboard</Button>
				</CardContent>
			</Card>
		</div>
	)
}



