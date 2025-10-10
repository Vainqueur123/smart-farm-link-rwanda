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
import type { Order, MessageStatus } from "@/lib/types"
import { MessageStatusIndicator } from "@/components/message-status-indicator"
import { notifyNewMessage } from "@/lib/notification-service"

interface ChatMessage {
	id: string
	senderId: string
	senderName: string
	content: string
	timestamp: number
	status?: MessageStatus
	sentAt?: number
	deliveredAt?: number
	seenAt?: number
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
			
			// Mark messages from others as seen after 1 second
			if (user) {
				setTimeout(() => {
					markMessagesAsSeen(list, id)
				}, 1000)
			}
		})
		return off
	}, [params.conversationId, user])
	
	const markMessagesAsSeen = (messageList: ChatMessage[], conversationId: string) => {
		if (!user) return
		
		setMessages(prev => prev.map(msg => {
			if (msg.senderId !== user.id && msg.status !== 'seen') {
				return {
					...msg,
					status: 'seen',
					seenAt: Date.now()
				}
			}
			return msg
		}))
	}

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" })
	}, [messages])

	const send = async () => {
		if (!text.trim() || !user) return
		const id = params.conversationId as string
		const now = Date.now()
		const messageId = `msg-${now}`
		
		const newMessage: ChatMessage = {
			id: messageId,
			senderId: user.id,
			senderName: user.name || user.email,
			content: text.trim(),
			timestamp: now,
			status: 'waiting',
		}
		
		pushValue(rtdb.ref(`conversations/${id}`), newMessage)
		setText("")
		
		// Send notification to recipient
		// Extract recipient ID from conversation ID or participants
		const recipientId = id.split('_').find(pid => pid !== user.id) || 'unknown'
		try {
			await notifyNewMessage(user.id, recipientId, newMessage.content)
		} catch (error) {
			console.error("Failed to send notification:", error)
		}
		
		// Simulate status progression
		setTimeout(() => {
			updateMessageStatus(id, messageId, 'sent', now)
		}, 500)
		
		setTimeout(() => {
			updateMessageStatus(id, messageId, 'delivered', now)
		}, 2000)
	}
	
	const updateMessageStatus = (conversationId: string, messageId: string, status: MessageStatus, baseTime: number) => {
		const messageRef = rtdb.ref(`conversations/${conversationId}`)
		// In production, update specific message in Firebase
		setMessages(prev => prev.map(msg => {
			if (msg.id === messageId) {
				const updated = { ...msg, status }
				if (status === 'sent' && !msg.sentAt) {
					updated.sentAt = baseTime + 500
				} else if (status === 'delivered' && !msg.deliveredAt) {
					updated.deliveredAt = baseTime + 2000
				} else if (status === 'seen' && !msg.seenAt) {
					updated.seenAt = Date.now()
				}
				return updated
			}
			return msg
		}))
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
					<CardHeader className="flex flex-row items-center justify-between">
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
									<div className="text-sm whitespace-pre-wrap mb-1">{m.content}</div>
									<div className="flex items-center justify-between gap-2 mt-1">
										<div className="text-xs opacity-70">{m.senderName}</div>
										<div className="flex items-center gap-1">
											<span className="text-xs opacity-70">{new Date(m.timestamp).toLocaleTimeString()}</span>
											{m.senderId === user?.id && m.status && (
												<MessageStatusIndicator 
													status={m.status} 
													className={m.senderId === user?.id ? "text-white opacity-70" : ""}
												/>
											)}
										</div>
									</div>
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
