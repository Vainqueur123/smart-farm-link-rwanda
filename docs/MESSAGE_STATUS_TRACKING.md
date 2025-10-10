# Message Status Tracking System

## Overview
The Smart Farm Link Rwanda messaging system now includes comprehensive message status tracking between buyers and farmers. Each message displays its current state with visual indicators.

## Message Status Types

### 1. **Waiting** ⏱️
- **Icon**: Clock icon
- **Color**: Gray
- **Meaning**: Message is queued and waiting to be sent
- **Duration**: Typically < 1 second

### 2. **Sent** ✓
- **Icon**: Single check mark
- **Color**: Gray/White (depending on message bubble)
- **Meaning**: Message has been sent to the server
- **Timestamp**: `sentAt` field is populated

### 3. **Delivered** ✓✓
- **Icon**: Double check mark
- **Color**: Gray/White
- **Meaning**: Message has been delivered to recipient's device
- **Timestamp**: `deliveredAt` field is populated

### 4. **Seen** ✓✓
- **Icon**: Double check mark
- **Color**: Blue
- **Meaning**: Recipient has opened the conversation and viewed the message
- **Timestamp**: `seenAt` field is populated

## Implementation Details

### Type Definitions (`lib/types.ts`)

```typescript
export type MessageStatus = 'waiting' | 'sent' | 'delivered' | 'seen'

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  type: "text" | "image" | "file"
  isRead: boolean
  status: MessageStatus
  createdAt: Date
  sentAt?: Date
  deliveredAt?: Date
  seenAt?: Date
  attachments?: string[]
}
```

### Status Indicator Component

The `MessageStatusIndicator` component displays the appropriate icon and color based on the message status:

```typescript
import { MessageStatusIndicator } from "@/components/message-status-indicator"

<MessageStatusIndicator 
  status={message.status} 
  className="text-white opacity-70"
/>
```

### Status Progression Flow

1. **Message Creation**: Status starts as `waiting`
2. **After 500ms**: Status updates to `sent` (simulated network delay)
3. **After 2 seconds**: Status updates to `delivered`
4. **When recipient opens conversation**: Status updates to `seen`

## Features

### Automatic Status Updates

- **Sent Status**: Automatically set 500ms after message is created
- **Delivered Status**: Automatically set 2 seconds after message is created
- **Seen Status**: Automatically set when recipient opens the conversation (1 second delay)

### Visual Indicators

- Status icons appear next to the timestamp on sent messages
- Only sender sees their own message status
- Recipients don't see status indicators on received messages
- Color coding helps quickly identify message state

### Real-time Updates

The system simulates real-time status updates using `setTimeout`. In production, these would be triggered by:
- Firebase Realtime Database listeners
- WebSocket connections
- Server-sent events (SSE)

## Usage Examples

### Sending a Message

```typescript
const handleSendMessage = () => {
  const message: Message = {
    id: `msg-${Date.now()}`,
    senderId: user.id,
    receiverId: recipientId,
    content: messageText,
    type: "text",
    isRead: false,
    status: "waiting",
    createdAt: new Date(),
  }
  
  // Message status will automatically progress:
  // waiting → sent → delivered → seen
}
```

### Marking Messages as Seen

```typescript
const markConversationAsSeen = (conversationId: string) => {
  setMessages(prev => prev.map(msg => {
    if (msg.senderId !== user.id && msg.status !== "seen") {
      return {
        ...msg,
        status: "seen",
        isRead: true,
        seenAt: new Date()
      }
    }
    return msg
  }))
}
```

### Displaying Status with Details

```typescript
import { MessageStatusDetails } from "@/components/message-status-indicator"

<MessageStatusDetails
  status={message.status}
  sentAt={message.sentAt}
  deliveredAt={message.deliveredAt}
  seenAt={message.seenAt}
/>
```

## Integration with Firebase

For production deployment with Firebase Realtime Database:

```typescript
// Update message status in Firebase
const updateMessageStatus = async (
  conversationId: string,
  messageId: string,
  status: MessageStatus
) => {
  const messageRef = ref(db, `conversations/${conversationId}/messages/${messageId}`)
  await update(messageRef, {
    status,
    [`${status}At`]: serverTimestamp()
  })
}

// Listen for status changes
const messageRef = ref(db, `conversations/${conversationId}/messages/${messageId}`)
onValue(messageRef, (snapshot) => {
  const message = snapshot.val()
  // Update UI with new status
})
```

## Best Practices

1. **Only show status for sent messages**: Recipients don't need to see status indicators
2. **Use color coding**: Blue for "seen" helps users quickly identify read messages
3. **Batch updates**: When marking multiple messages as seen, use a single database transaction
4. **Handle offline scenarios**: Queue status updates when offline and sync when back online
5. **Privacy considerations**: Some users may want to disable "seen" receipts

## Troubleshooting

### Status not updating
- Check that `updateMessageStatus` function is being called
- Verify Firebase listeners are properly attached
- Ensure message IDs match between local state and database

### Status stuck on "waiting"
- Check network connectivity
- Verify Firebase configuration
- Check for JavaScript errors in console

### "Seen" status not working
- Ensure `markConversationAsSeen` is called when conversation opens
- Verify user ID comparison logic
- Check that `seenAt` timestamp is being set

## Future Enhancements

1. **Typing indicators**: Show when the other person is typing
2. **Message reactions**: Allow users to react to messages with emojis
3. **Message editing**: Track edit history and show "edited" indicator
4. **Message deletion**: Support for deleting messages with status tracking
5. **Read receipts toggle**: Allow users to disable read receipts in settings
6. **Bulk status updates**: Optimize status updates for conversations with many messages

## Testing

### Manual Testing Checklist

- [ ] Send a message and verify status progresses: waiting → sent → delivered
- [ ] Open a conversation and verify unread messages change to "seen"
- [ ] Check that status icons display correctly in both light and dark themes
- [ ] Verify status indicators only appear on sent messages
- [ ] Test with multiple conversations simultaneously
- [ ] Verify unread count decreases when messages are marked as seen

### Automated Testing

```typescript
describe('Message Status Tracking', () => {
  it('should progress from waiting to sent', async () => {
    const message = sendMessage('Hello')
    expect(message.status).toBe('waiting')
    await wait(600)
    expect(message.status).toBe('sent')
  })
  
  it('should mark messages as seen when conversation opens', () => {
    const messages = openConversation('conv-123')
    const unreadMessages = messages.filter(m => !m.isRead)
    expect(unreadMessages.every(m => m.status === 'seen')).toBe(true)
  })
})
```

## Support

For questions or issues with the message status tracking system:
- Check the troubleshooting section above
- Review the implementation in `components/messaging-system.tsx`
- Consult the type definitions in `lib/types.ts`
- Contact the development team

---

**Last Updated**: October 10, 2025
**Version**: 1.0.0
**Maintainer**: Smart Farm Link Rwanda Development Team
