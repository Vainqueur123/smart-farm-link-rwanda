"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { MessageCircle, Send, ShoppingCart } from "lucide-react"
import { rtdb, onValue, pushValue } from "@/lib/firebase"
import { createOrder } from "@/lib/order-service"
import type { Order } from "@/lib/types"

interface ChatMessage {
	id: string
	senderId: string
	senderName: string
	content: string
	timestamp: number
}

export default function ConversationPage() {
	const { user } = useAuth()
	const params = useParams()
	const router = useRouter()
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [text, setText] = useState("")
	const [quantity, setQuantity] = useState<number>(1)
	const [delivery, setDelivery] = useState<string>("")
	const [notes, setNotes] = useState<string>("")
	const endRef = useRef<HTMLDivElement>(null)

	// Subscribe to realtime messages
	useEffect(() => {
		const id = params.conversationId as string
		const ref = rtdb.ref(`conversations/${id}`)
		const off = onValue(ref, (list: ChatMessage[] = []) => {
			setMessages(list)
		})
		return off
	}, [params.conversationId])

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages])

	const send = () => {
		if (!text.trim() || !user) return
		const id = params.conversationId as string
		pushValue(rtdb.ref(`conversations/${id}`), {
			id: `${Date.now()}`,
			senderId: user.id,
			senderName: user.name || user.email,
			content: text.trim(),
			timestamp: Date.now(),
		} as ChatMessage)
		setText("")
	}

	const proceedToBuy = async () => {
		if (!user) return
		const id = params.conversationId as string
		const order: Order = {
			id: `order_${Date.now()}`,
			buyerId: user.id,
			sellerId: "unknown",
			items: [{ productId: id, productName: "Conversation Product", quantity, unit: "kg", pricePerUnit: 0, totalPrice: 0 }],
			totalAmount: 0,
			currency: "RWF",
			status: "pending",
			paymentStatus: "pending",
			paymentMethod: "cash",
			deliveryAddress: { district: "Kicukiro", address: delivery, contactPhone: "" },
			deliveryMethod: "pickup",
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		await createOrder(order)
		router.push(`/buyer-dashboard?order=${order.id}`)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-3xl mx-auto p-4">
				<Card>
					<CardHeader className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<MessageCircle className="h-5 w-5 text-green-600" />
							Conversation
						</CardTitle>
						<Button onClick={() => router.back()} variant="outline">Back</Button>
					</CardHeader>
					<CardContent>
						<div className="h-[60vh] overflow-y-auto space-y-3 p-2 border rounded-md bg-gray-50">
							{messages.map(m => (
								<div key={m.id} className={`flex ${m.senderId === user?.id ? "justify-end" : "justify-start"}`}>
									<div className={`max-w-[75%] px-3 py-2 rounded-lg ${m.senderId === user?.id ? "bg-green-600 text-white" : "bg-white border"}`}>
										<div className="text-xs opacity-70 mb-1">{m.senderName} • {new Date(m.timestamp).toLocaleTimeString()}</div>
										<div className="text-sm whitespace-pre-wrap">{m.content}</div>
									</div>
								</div>
							))}
							<div ref={endRef} />
						</div>

						<div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
							<input className="border rounded px-2 py-2 text-sm" placeholder="Quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
							<input className="border rounded px-2 py-2 text-sm" placeholder="Delivery location (optional)" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
							<input className="border rounded px-2 py-2 text-sm md:col-span-3" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
						</div>

						<div className="mt-3 flex items-center gap-2">
							<Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
							<Button onClick={send}><Send className="h-4 w-4 mr-1" />Send</Button>
							<Button variant="outline" onClick={proceedToBuy}>
								<ShoppingCart className="h-4 w-4 mr-1" />Proceed to Buy
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
