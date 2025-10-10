"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { MessageCircle, Send, ShoppingCart } from "lucide-react"
import { rtdb, onValue, pushValue } from "@/lib/firebase"
import type { Order, MessageStatus } from "@/lib/types"
import { MessageStatusIndicator } from "@/components/message-status-indicator"
import { notifyNewMessage, notifyOrderUpdate } from "@/lib/notification-service"

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
  const [orderOpen, setOrderOpen] = useState(false)
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
    // Attempt to derive farmerId and productId from conversationId (format buyer_farmer_product)
    const parts = id.split('_')
    const buyerId = user.id
    const farmerId = parts.find(p => p !== buyerId) || "unknown"
    const productId = parts[2] || id
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId, farmerId, productId, quantity, address: { address: delivery }, notes })
      })
      const data = await res.json()
      if (res.ok) {
        try { await notifyOrderUpdate(buyerId, farmerId, data.order.id, 'pending') } catch {}
        router.push(`/buyer-dashboard?order=${data.order.id}`)
      }
    } catch (e) {
      console.error('Failed to create order', e)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with context (Farmer/Product) */}
      <div className="p-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <div className="font-medium">Conversation</div>
        </div>
        <Button onClick={() => router.back()} variant="outline" size="sm">Back</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
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
      </div>
      <div className="p-2 border-t bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input className="border rounded px-2 py-2 text-sm" placeholder="Quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <input className="border rounded px-2 py-2 text-sm" placeholder="Delivery location (optional)" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
          <input className="border rounded px-2 py-2 text-sm md:col-span-3" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message..." onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
          <Button onClick={send}><Send className="h-4 w-4 mr-1" />Send</Button>
          {user?.role === 'buyer' && (
            <Button variant="outline" onClick={() => setOrderOpen(true)}>
              <ShoppingCart className="h-4 w-4 mr-1" />Proceed to Buy
            </Button>
          )}
        </div>
      </div>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input className="border rounded px-2 py-2 text-sm w-full" placeholder="Quantity" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <input className="border rounded px-2 py-2 text-sm w-full" placeholder="Delivery address" value={delivery} onChange={(e) => setDelivery(e.target.value)} />
            <input className="border rounded px-2 py-2 text-sm w-full" placeholder="Delivery notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOrderOpen(false); proceedToBuy() }}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

