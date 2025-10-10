"use client"

import { Check, CheckCheck, Clock, Send } from "lucide-react"
import { MessageStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageStatusIndicatorProps {
  status: MessageStatus
  className?: string
  showLabel?: boolean
}

export function MessageStatusIndicator({ 
  status, 
  className,
  showLabel = false 
}: MessageStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-3 w-3" />
      case 'sent':
        return <Check className="h-3 w-3" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />
      case 'seen':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'waiting':
        return 'text-gray-400'
      case 'sent':
        return 'text-gray-500'
      case 'delivered':
        return 'text-gray-600'
      case 'seen':
        return 'text-blue-500'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'waiting':
        return 'Waiting'
      case 'sent':
        return 'Sent'
      case 'delivered':
        return 'Delivered'
      case 'seen':
        return 'Seen'
      default:
        return ''
    }
  }

  return (
    <div className={cn("flex items-center gap-1", getStatusColor(), className)}>
      {getStatusIcon()}
      {showLabel && (
        <span className="text-xs">{getStatusLabel()}</span>
      )}
    </div>
  )
}

// Detailed status component with timestamps
interface MessageStatusDetailsProps {
  status: MessageStatus
  sentAt?: Date
  deliveredAt?: Date
  seenAt?: Date
  className?: string
}

export function MessageStatusDetails({
  status,
  sentAt,
  deliveredAt,
  seenAt,
  className
}: MessageStatusDetailsProps) {
  const formatTime = (date?: Date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={cn("space-y-1 text-xs", className)}>
      {status === 'waiting' && (
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="h-3 w-3" />
          <span>Waiting to send...</span>
        </div>
      )}
      
      {sentAt && (
        <div className="flex items-center gap-2 text-gray-600">
          <Check className="h-3 w-3" />
          <span>Sent at {formatTime(sentAt)}</span>
        </div>
      )}
      
      {deliveredAt && (
        <div className="flex items-center gap-2 text-gray-700">
          <CheckCheck className="h-3 w-3" />
          <span>Delivered at {formatTime(deliveredAt)}</span>
        </div>
      )}
      
      {seenAt && (
        <div className="flex items-center gap-2 text-blue-600">
          <CheckCheck className="h-3 w-3" />
          <span>Seen at {formatTime(seenAt)}</span>
        </div>
      )}
    </div>
  )
}
