"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageStatusIndicator, MessageStatusDetails } from "@/components/message-status-indicator"
import { MessageStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export function MessageStatusDemo() {
  const [currentStatus, setCurrentStatus] = useState<MessageStatus>('waiting')
  const [sentAt, setSentAt] = useState<Date | undefined>()
  const [deliveredAt, setDeliveredAt] = useState<Date | undefined>()
  const [seenAt, setSeenAt] = useState<Date | undefined>()

  const progressStatus = () => {
    const now = new Date()
    
    if (currentStatus === 'waiting') {
      setCurrentStatus('sent')
      setSentAt(now)
    } else if (currentStatus === 'sent') {
      setCurrentStatus('delivered')
      setDeliveredAt(now)
    } else if (currentStatus === 'delivered') {
      setCurrentStatus('seen')
      setSeenAt(now)
    }
  }

  const reset = () => {
    setCurrentStatus('waiting')
    setSentAt(undefined)
    setDeliveredAt(undefined)
    setSeenAt(undefined)
  }

  const statusDescriptions = {
    waiting: "Message is queued and waiting to be sent to the server",
    sent: "Message has been successfully sent to the server",
    delivered: "Message has been delivered to the recipient's device",
    seen: "Recipient has opened the conversation and viewed your message"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Message Status Tracking Demo</CardTitle>
        <CardDescription>
          See how message status indicators work in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status Display */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Status</h3>
            <Badge variant={currentStatus === 'seen' ? 'default' : 'secondary'} className="text-sm">
              {currentStatus.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <MessageStatusIndicator status={currentStatus} className="scale-150" />
            <div className="flex-1">
              <p className="text-sm text-gray-700">{statusDescriptions[currentStatus]}</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Status Timeline:</h4>
            <MessageStatusDetails
              status={currentStatus}
              sentAt={sentAt}
              deliveredAt={deliveredAt}
              seenAt={seenAt}
              className="ml-4"
            />
          </div>
        </div>

        {/* All Status Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-4">All Status Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <MessageStatusIndicator status="waiting" />
              <div>
                <p className="font-medium text-sm">Waiting</p>
                <p className="text-xs text-gray-500">Queued to send</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <MessageStatusIndicator status="sent" />
              <div>
                <p className="font-medium text-sm">Sent</p>
                <p className="text-xs text-gray-500">Sent to server</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <MessageStatusIndicator status="delivered" />
              <div>
                <p className="font-medium text-sm">Delivered</p>
                <p className="text-xs text-gray-500">Reached recipient</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <MessageStatusIndicator status="seen" />
              <div>
                <p className="font-medium text-sm">Seen</p>
                <p className="text-xs text-gray-500 text-blue-600">Read by recipient</p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Bubble Examples */}
        <div>
          <h3 className="text-lg font-semibold mb-4">In Message Bubbles</h3>
          <div className="space-y-3">
            {/* Sent message example */}
            <div className="flex justify-end">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg max-w-xs">
                <p className="text-sm">Hey! Are your tomatoes still available?</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-70">10:30 AM</span>
                  <MessageStatusIndicator status={currentStatus} className="text-white opacity-70" />
                </div>
              </div>
            </div>

            {/* Received message example */}
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                <p className="text-sm">Yes, I have 50kg available!</p>
                <div className="flex items-center justify-end mt-1">
                  <span className="text-xs text-gray-500">10:31 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={progressStatus}
            disabled={currentStatus === 'seen'}
            className="flex-1"
          >
            {currentStatus === 'waiting' && 'Send Message'}
            {currentStatus === 'sent' && 'Deliver Message'}
            {currentStatus === 'delivered' && 'Mark as Seen'}
            {currentStatus === 'seen' && 'Completed'}
          </Button>
          <Button onClick={reset} variant="outline">
            Reset Demo
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 How it works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Status icons only appear on messages you send</li>
            <li>• Blue double check marks mean the recipient has seen your message</li>
            <li>• Messages automatically progress through statuses in real-time</li>
            <li>• Opening a conversation marks all unread messages as "seen"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
