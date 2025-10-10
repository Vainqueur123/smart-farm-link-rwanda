"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MessagingSystem } from "@/components/messaging-system"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)

  useEffect(() => {
    // Get seller ID from URL params
    const sellerId = searchParams.get('sellerId')
    const sellerName = searchParams.get('sellerName')
    
    if (sellerId) {
      console.log('Opening conversation with seller:', sellerId, sellerName)
      setSelectedSeller(sellerId)
    }
  }, [searchParams])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center py-12 px-4">
          <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to send messages</h3>
          <p className="text-gray-600 mb-4">
            You need to be logged in to chat with sellers
          </p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">Chat with sellers and buyers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messaging System - Full Screen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <MessagingSystem 
            className="border-0 h-full" 
            sellerId={selectedSeller || undefined}
            autoOpen={!!selectedSeller}
          />
        </div>
      </div>
    </div>
  )
}
