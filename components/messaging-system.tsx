"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Info
} from "lucide-react"
import { Message, Conversation, MessageStatus } from "@/lib/types"
import { format, formatDistanceToNow } from "date-fns"
import { MessageStatusIndicator } from "@/components/message-status-indicator"
import { notifyNewMessage } from "@/lib/notification-service"

// Mock data for messaging
const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: ["farmer-1", "buyer-1"],
    lastMessage: {
      id: "msg-1",
      senderId: "buyer-1",
      receiverId: "farmer-1",
      content: "Hi, I'm interested in your tomatoes. Are they still available?",
      type: "text",
      isRead: true,
      status: "seen" as MessageStatus,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000),
      seenAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    participants: ["farmer-2", "buyer-1"],
    lastMessage: {
      id: "msg-2",
      senderId: "farmer-2",
      receiverId: "buyer-1",
      content: "The potatoes will be ready for harvest next week.",
      type: "text",
      isRead: false,
      status: "delivered" as MessageStatus,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 30 * 60 * 1000 + 2000),
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
  }
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "msg-1",
      senderId: "buyer-1",
      receiverId: "farmer-1",
      content: "Hi, I'm interested in your tomatoes. Are they still available?",
      type: "text",
      isRead: true,
      status: "seen" as MessageStatus,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000),
      seenAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
    },
    {
      id: "msg-2",
      senderId: "farmer-1",
      receiverId: "buyer-1",
      content: "Yes, I have 50kg available. Freshly harvested yesterday.",
      type: "text",
      isRead: true,
      status: "seen" as MessageStatus,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000 + 1000),
      seenAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000 + 3000),
    },
    {
      id: "msg-3",
      senderId: "buyer-1",
      receiverId: "farmer-1",
      content: "Great! What's your price per kg?",
      type: "text",
      isRead: true,
      status: "seen" as MessageStatus,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000 + 2000),
      seenAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10 * 60 * 1000 + 6000),
    },
    {
      id: "msg-4",
      senderId: "farmer-1",
      receiverId: "buyer-1",
      content: "800 RWF per kg. I can deliver to Kigali.",
      type: "text",
      isRead: false,
      status: "delivered" as MessageStatus,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1500),
    }
  ],
  "2": [
    {
      id: "msg-5",
      senderId: "buyer-1",
      receiverId: "farmer-2",
      content: "When will your potatoes be ready?",
      type: "text",
      isRead: true,
      status: "seen" as MessageStatus,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 1000),
      seenAt: new Date(Date.now() - 1 * 60 * 60 * 1000 + 4000),
    },
    {
      id: "msg-6",
      senderId: "farmer-2",
      receiverId: "buyer-1",
      content: "The potatoes will be ready for harvest next week.",
      type: "text",
      isRead: false,
      status: "delivered" as MessageStatus,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      sentAt: new Date(Date.now() - 30 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 30 * 60 * 1000 + 2000),
    }
  ]
}

interface MessagingSystemProps {
  className?: string
}

export function MessagingSystem({ className }: MessagingSystemProps) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || [])
      
      // Mark messages as seen when conversation is opened
      setTimeout(() => {
        markConversationAsSeen(selectedConversation)
      }, 1000)
    }
  }, [selectedConversation])

  const markConversationAsSeen = (conversationId: string) => {
    if (!user) return
    
    setMessages(prev => prev.map(msg => {
      // Only mark messages from other participants as seen
      if (msg.senderId !== user.id && msg.status !== "seen") {
        return {
          ...msg,
          status: "seen" as MessageStatus,
          isRead: true,
          seenAt: new Date()
        }
      }
      return msg
    }))

    // Update conversation unread count
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return

    const now = new Date()
    const recipientId = getOtherParticipant(selectedConversation)
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: recipientId,
      content: newMessage.trim(),
      type: "text",
      isRead: false,
      status: "waiting" as MessageStatus,
      createdAt: now,
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Send notification to recipient (SMS/Email)
    try {
      await notifyNewMessage(user.id, recipientId, message.content)
    } catch (error) {
      console.error("Failed to send notification:", error)
    }

    // Simulate message status progression
    // In production, these would be triggered by server/Firebase events
    setTimeout(() => {
      updateMessageStatus(message.id, "sent", now)
    }, 500)

    setTimeout(() => {
      updateMessageStatus(message.id, "delivered", now)
    }, 2000)

    // Update conversation
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { 
            ...conv, 
            lastMessage: message, 
            updatedAt: new Date(),
            unreadCount: conv.participants.includes(user.id) ? 0 : conv.unreadCount + 1
          }
        : conv
    ))
  }

  const updateMessageStatus = (messageId: string, status: MessageStatus, baseTime: Date) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const updated = { ...msg, status }
        if (status === "sent" && !msg.sentAt) {
          updated.sentAt = new Date(baseTime.getTime() + 500)
        } else if (status === "delivered" && !msg.deliveredAt) {
          updated.deliveredAt = new Date(baseTime.getTime() + 2000)
        } else if (status === "seen" && !msg.seenAt) {
          updated.seenAt = new Date()
          updated.isRead = true
        }
        return updated
      }
      return msg
    }))
  }

  const getOtherParticipant = (conversationId: string): string => {
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation || !user) return ""
    return conversation.participants.find(p => p !== user.id) || ""
  }

  const getParticipantName = (participantId: string): string => {
    // In a real app, this would fetch from user data
    const names: Record<string, string> = {
      "farmer-1": "John Doe",
      "farmer-2": "Jane Smith",
      "buyer-1": "Mike Johnson",
    }
    return names[participantId] || "Unknown User"
  }

  const getParticipantRole = (participantId: string): string => {
    // In a real app, this would fetch from user data
    const roles: Record<string, string> = {
      "farmer-1": "Farmer",
      "farmer-2": "Farmer", 
      "buyer-1": "Buyer",
    }
    return roles[participantId] || "User"
  }

  const formatMessageTime = (date: Date): string => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return format(date, "HH:mm")
    } else if (diffInHours < 168) { // 7 days
      return format(date, "EEE HH:mm")
    } else {
      return format(date, "MMM d")
    }
  }

  return (
    <div className={`flex h-[600px] border rounded-lg overflow-hidden ${className}`}>
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Messages</h3>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedConversation === conversation.id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getParticipantName(getOtherParticipant(conversation.id)).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">
                      {getParticipantName(getOtherParticipant(conversation.id))}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {getParticipantRole(getOtherParticipant(conversation.id))}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conversation.lastMessage && formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getParticipantName(getOtherParticipant(selectedConversation)).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {getParticipantName(getOtherParticipant(selectedConversation))}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getParticipantRole(getOtherParticipant(selectedConversation))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      <span className="text-xs opacity-70">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {message.senderId === user?.id && (
                        <MessageStatusIndicator 
                          status={message.status} 
                          className={message.senderId === user?.id ? "text-white opacity-70" : ""}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact messaging widget for dashboard
export function MessagingWidget() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(3)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Messages
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 z-50">
          <MessagingSystem className="h-96" />
        </div>
      )}
    </div>
  )
}
