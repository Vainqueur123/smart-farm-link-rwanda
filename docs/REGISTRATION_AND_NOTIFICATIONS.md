# Registration & Notification System Documentation

## Overview
Smart Farm Link Rwanda now includes comprehensive user registration with phone number and name collection, plus SMS and email notifications for messages and platform events.

---

## 📝 Registration Process

### Updated Signup Form

The signup form now collects the following information:

#### **Required Fields:**
1. **Full Name** - User's complete name
2. **Phone Number** - For SMS notifications (format: +250 7XX XXX XXX)
3. **Email Address** - For email notifications and login
4. **Password** - Minimum 6 characters
5. **Confirm Password** - Must match password
6. **User Role** - Farmer or Buyer (pre-selected from homepage)

#### **Optional Settings:**
- **Enable Notifications** - Checkbox to opt-in/out of SMS & Email notifications (enabled by default)

### Form Validation

```typescript
// Name validation
if (!name.trim()) {
  error = "Please enter your full name"
}

// Phone validation
if (!phone.trim() || phone.length < 10) {
  error = "Please enter a valid phone number (at least 10 digits)"
}

// Email validation
Built-in HTML5 email validation

// Password validation
if (password.length < 6) {
  error = "Password must be at least 6 characters"
}

// Password match
if (password !== confirmPassword) {
  error = "Passwords do not match"
}
```

### Data Storage

When a user registers, the following data is stored:

#### **User Document** (`users/{userId}`)
```typescript
{
  id: string
  email: string
  role: 'farmer' | 'buyer' | 'admin'
  name: string
  phone?: string
  isActive: boolean
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### **Farmer Profile** (`farmers/{userId}`)
```typescript
{
  id: string
  userId: string
  name: string
  phone: string
  district: string
  notificationsEnabled: boolean  // ← NEW
  // ... other farmer fields
}
```

#### **Buyer Profile** (`buyers/{userId}`)
```typescript
{
  id: string
  userId: string
  name: string
  phone: string
  location: { district, address }
  notificationsEnabled: boolean  // ← NEW
  // ... other buyer fields
}
```

---

## 📲 Notification System

### Notification Types

1. **Message Notifications** - When someone sends you a message
2. **Order Notifications** - Order status updates
3. **Payment Notifications** - Payment confirmations
4. **System Notifications** - Platform announcements

### Notification Channels

#### **1. SMS Notifications**

**Provider Integration:**
- MTN Rwanda SMS API
- Airtel Rwanda SMS API
- Africa's Talking (backup)
- Twilio (international)

**SMS Format:**
```
New message from [Sender Name]: [Message Preview]

Reply on Smart Farm Link app.
```

**Example:**
```
New message from John Farmer: Hi, I'm interested in your tomatoes. Are they still available?

Reply on Smart Farm Link app.
```

#### **2. Email Notifications**

**Provider Integration:**
- SendGrid (recommended)
- AWS SES
- Mailgun
- Postmark

**Email Template:**
```html
Subject: New message from [Sender Name]

Body:
You have received a new message on Smart Farm Link Rwanda:

"[Full Message Content]"

[Reply Now Button] → Links to: https://smartfarmlink.rw/messages

---
To disable these notifications, update your preferences in account settings.
```

#### **3. In-App Notifications**

Stored in Firebase: `notifications/{notificationId}`

```typescript
{
  id: string
  recipientId: string
  type: 'message' | 'order' | 'payment' | 'system'
  title: string
  body: string
  read: boolean
  createdAt: Date
  data?: {
    senderId?: string
    messageId?: string
    orderId?: string
  }
}
```

---

## 🔧 Implementation Details

### Notification Service Functions

#### **1. Send SMS**
```typescript
import { sendSMS } from '@/lib/notification-service'

await sendSMS({
  phoneNumber: '+250788123456',
  message: 'Your notification message',
  senderId: 'SmartFarm'
})
```

#### **2. Send Email**
```typescript
import { sendEmail } from '@/lib/notification-service'

await sendEmail({
  to: 'user@example.com',
  subject: 'Notification Subject',
  body: 'Plain text body',
  html: '<h1>HTML body</h1>'
})
```

#### **3. Notify New Message**
```typescript
import { notifyNewMessage } from '@/lib/notification-service'

// Automatically sends SMS + Email + In-App notification
await notifyNewMessage(
  senderId,
  recipientId,
  messageContent
)
```

#### **4. Notify Order Update**
```typescript
import { notifyOrderUpdate } from '@/lib/notification-service'

await notifyOrderUpdate(
  buyerId,
  sellerId,
  orderId,
  'confirmed' // status
)
```

### Integration with Messaging System

The notification service is automatically triggered when:

1. **User sends a message** in `messaging-system.tsx`:
```typescript
const handleSendMessage = async () => {
  // ... create message
  
  // Send notification
  await notifyNewMessage(user.id, recipientId, message.content)
  
  // ... rest of logic
}
```

2. **User sends a message** in conversation page:
```typescript
const send = async () => {
  // ... create message
  
  // Send notification
  await notifyNewMessage(user.id, recipientId, newMessage.content)
  
  // ... rest of logic
}
```

---

## 🎯 User Flow

### Registration Flow

```
1. User clicks "Get Started" on homepage
   ↓
2. Selects role (Farmer/Buyer)
   ↓
3. Redirected to signup page with role pre-selected
   ↓
4. Fills in:
   - Full Name
   - Phone Number
   - Email
   - Password
   - Confirms Password
   - Enables/Disables Notifications (checkbox)
   ↓
5. Submits form
   ↓
6. Account created with:
   - User document
   - Role-specific profile (Farmer/Buyer)
   - Notification preferences saved
   ↓
7. Auto-login and redirect to dashboard
```

### Message Notification Flow

```
Sender sends message
   ↓
Message saved to database
   ↓
Check recipient's notification preferences
   ↓
If notifications enabled:
   ├─→ Send SMS (if phone available)
   ├─→ Send Email (if email available)
   └─→ Create in-app notification
   ↓
Recipient receives notification
   ↓
Recipient clicks notification
   ↓
Opens conversation in app
```

---

## 🔐 Privacy & Preferences

### Notification Settings

Users can manage notification preferences in their profile settings:

```typescript
// Update notification preferences
await updateProfile({
  notificationsEnabled: false  // Disable all notifications
})
```

### Data Privacy

- Phone numbers are stored securely in Firebase
- SMS content is truncated to 160 characters
- Email addresses are never shared with other users
- Users can opt-out of notifications anytime

---

## 🚀 Production Setup

### SMS Provider Setup (MTN Rwanda)

1. **Register for MTN SMS API**
   - Visit: https://developer.mtn.rw
   - Create account and get API credentials

2. **Configure Environment Variables**
```env
MTN_SMS_API_KEY=your_api_key_here
MTN_SMS_SENDER_ID=SmartFarm
```

3. **Update notification-service.ts**
```typescript
const response = await fetch('https://api.mtn.rw/sms/v1/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.MTN_SMS_API_KEY}`
  },
  body: JSON.stringify({
    to: payload.phoneNumber,
    message: payload.message,
    sender: process.env.MTN_SMS_SENDER_ID
  })
})
```

### Email Provider Setup (SendGrid)

1. **Create SendGrid Account**
   - Visit: https://sendgrid.com
   - Get API key

2. **Configure Environment Variables**
```env
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@smartfarmlink.rw
```

3. **Update notification-service.ts**
```typescript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
  },
  body: JSON.stringify({
    personalizations: [{
      to: [{ email: payload.to }]
    }],
    from: { email: process.env.SENDGRID_FROM_EMAIL },
    subject: payload.subject,
    content: [{
      type: 'text/html',
      value: payload.html || payload.body
    }]
  })
})
```

---

## 📊 Testing

### Test Registration

1. Navigate to homepage
2. Click "Get Started"
3. Select "I'm a Buyer" or "I'm a Farmer"
4. Fill in all fields:
   - Name: "Test User"
   - Phone: "+250788123456"
   - Email: "test@example.com"
   - Password: "test123"
5. Check "Enable notifications"
6. Submit form
7. Verify account created and redirected to dashboard

### Test Notifications

```typescript
import { sendTestNotification } from '@/lib/notification-service'

// Send test notification to a user
await sendTestNotification(userId)
```

This will send:
- Test SMS to user's phone
- Test email to user's email
- Verify both are received

### Manual Testing Checklist

- [ ] Registration form validates all fields
- [ ] Phone number is saved correctly
- [ ] Name is saved correctly
- [ ] Notification preference is saved
- [ ] SMS is sent when message received (check phone)
- [ ] Email is sent when message received (check inbox)
- [ ] In-app notification appears
- [ ] Notifications can be disabled in settings
- [ ] No notifications sent when disabled

---

## 🐛 Troubleshooting

### SMS Not Sending

1. Check phone number format (must include country code)
2. Verify SMS API credentials
3. Check API rate limits
4. Review SMS provider logs

### Email Not Sending

1. Verify email address is valid
2. Check spam/junk folder
3. Verify SendGrid API key
4. Check email provider logs

### Notifications Disabled

1. Check user's `notificationsEnabled` field
2. Verify user has phone/email in profile
3. Check notification service logs

---

## 📈 Future Enhancements

1. **Push Notifications** - Browser and mobile push notifications
2. **Notification Scheduling** - Schedule notifications for specific times
3. **Notification Templates** - Customizable templates for different events
4. **Multi-language Support** - Notifications in Kinyarwanda and English
5. **Notification Analytics** - Track delivery rates and engagement
6. **WhatsApp Integration** - Send notifications via WhatsApp Business API
7. **Voice Calls** - IVR system for voice notifications
8. **Notification Preferences** - Granular control (only SMS, only email, etc.)

---

## 📞 Support

For issues with the registration or notification system:
- Check the troubleshooting section above
- Review Firebase console for data
- Check browser console for errors
- Contact development team

---

**Last Updated**: October 10, 2025  
**Version**: 1.0.0  
**Maintainer**: Smart Farm Link Rwanda Development Team
