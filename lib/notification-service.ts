/**
 * Notification Service for Smart Farm Link Rwanda
 * Handles SMS and Email notifications for messages and platform events
 */

import { db, doc, getDoc, setDoc, updateDoc } from "./firebase"
import type { User, FarmerProfile, BuyerProfile } from "./types"

export interface NotificationPayload {
  recipientId: string
  type: "message" | "order" | "payment" | "system"
  title: string
  body: string
  data?: Record<string, any>
}

export interface SMSPayload {
  phoneNumber: string
  message: string
  senderId?: string
}

export interface EmailPayload {
  to: string
  subject: string
  body: string
  html?: string
}

/**
 * Send SMS notification (integrates with Rwanda SMS providers)
 * Supports: MTN Rwanda, Airtel Rwanda
 */
export async function sendSMS(payload: SMSPayload): Promise<boolean> {
  try {
    console.log("[SMS Service] Sending SMS to:", payload.phoneNumber)
    
    // In production, integrate with SMS gateway APIs:
    // - MTN Rwanda SMS API
    // - Airtel Rwanda SMS API
    // - Africa's Talking
    // - Twilio (international)
    
    // Example API call structure:
    /*
    const response = await fetch('https://api.mtn.rw/sms/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MTN_SMS_API_KEY}`
      },
      body: JSON.stringify({
        to: payload.phoneNumber,
        message: payload.message,
        sender: payload.senderId || 'SmartFarm'
      })
    })
    
    return response.ok
    */
    
    // For development, log the SMS
    console.log("[SMS Service] SMS Content:", payload.message)
    
    // Store notification in database for tracking
    await storeNotification({
      recipientId: payload.senderId || "system",
      type: "message",
      title: "SMS Notification",
      body: payload.message,
      data: {
        phoneNumber: payload.phoneNumber,
        channel: "sms",
        status: "sent"
      }
    })
    
    return true
  } catch (error) {
    console.error("[SMS Service] Error sending SMS:", error)
    return false
  }
}

/**
 * Send Email notification
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    console.log("[Email Service] Sending email to:", payload.to)
    
    // In production, integrate with email service:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Postmark
    
    // Example API call structure:
    /*
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
        from: { email: 'noreply@smartfarmlink.rw' },
        subject: payload.subject,
        content: [{
          type: 'text/html',
          value: payload.html || payload.body
        }]
      })
    })
    
    return response.ok
    */
    
    // For development, log the email
    console.log("[Email Service] Email Subject:", payload.subject)
    console.log("[Email Service] Email Body:", payload.body)
    
    return true
  } catch (error) {
    console.error("[Email Service] Error sending email:", error)
    return false
  }
}

/**
 * Send notification when a new message is received
 */
export async function notifyNewMessage(
  senderId: string,
  recipientId: string,
  messageContent: string
): Promise<void> {
  try {
    // Get recipient profile to check notification preferences
    const recipientProfile = await getUserProfile(recipientId)
    
    if (!recipientProfile || !recipientProfile.notificationsEnabled) {
      console.log("[Notification] Notifications disabled for user:", recipientId)
      return
    }
    
    // Get sender info
    const senderProfile = await getUserProfile(senderId)
    const senderName = senderProfile?.name || "A user"
    
    // Prepare notification content
    const truncatedMessage = messageContent.length > 100 
      ? messageContent.substring(0, 100) + "..." 
      : messageContent
    
    // Send SMS if phone number is available
    if (recipientProfile.phone) {
      await sendSMS({
        phoneNumber: recipientProfile.phone,
        message: `New message from ${senderName}: ${truncatedMessage}\n\nReply on Smart Farm Link app.`,
        senderId: senderId
      })
    }
    
    // Send Email if email is available
    const recipientUser = await getUserData(recipientId)
    if (recipientUser?.email) {
      await sendEmail({
        to: recipientUser.email,
        subject: `New message from ${senderName}`,
        body: `You have received a new message on Smart Farm Link Rwanda:\n\n"${messageContent}"\n\nLog in to the platform to reply: https://smartfarmlink.rw/messages`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">New Message on Smart Farm Link</h2>
            <p>You have received a new message from <strong>${senderName}</strong>:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">${messageContent}</p>
            </div>
            <a href="https://smartfarmlink.rw/messages" style="display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Reply Now
            </a>
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              To disable these notifications, update your preferences in your account settings.
            </p>
          </div>
        `
      })
    }
    
    // Store in-app notification
    await storeNotification({
      recipientId,
      type: "message",
      title: `New message from ${senderName}`,
      body: truncatedMessage,
      data: {
        senderId,
        messageId: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
    })
    
    console.log("[Notification] Successfully sent notifications to:", recipientId)
  } catch (error) {
    console.error("[Notification] Error sending message notification:", error)
  }
}

/**
 * Store notification in database for in-app display
 */
async function storeNotification(payload: NotificationPayload): Promise<void> {
  try {
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await setDoc(doc(db, `notifications/${notificationId}`), {
      ...payload,
      id: notificationId,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  } catch (error) {
    console.error("[Notification] Error storing notification:", error)
  }
}

/**
 * Get user profile (farmer or buyer)
 */
async function getUserProfile(userId: string): Promise<(FarmerProfile | BuyerProfile) | null> {
  try {
    // Try farmer profile first
    const farmerDoc = await getDoc(doc(db, `farmers/${userId}`))
    if (farmerDoc.exists()) {
      return farmerDoc.data() as FarmerProfile
    }
    
    // Try buyer profile
    const buyerDoc = await getDoc(doc(db, `buyers/${userId}`))
    if (buyerDoc.exists()) {
      return buyerDoc.data() as BuyerProfile
    }
    
    return null
  } catch (error) {
    console.error("[Notification] Error getting user profile:", error)
    return null
  }
}

/**
 * Get user data
 */
async function getUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, `users/${userId}`))
    if (userDoc.exists()) {
      return userDoc.data() as User
    }
    return null
  } catch (error) {
    console.error("[Notification] Error getting user data:", error)
    return null
  }
}

/**
 * Send order notification
 */
export async function notifyOrderUpdate(
  buyerId: string,
  sellerId: string,
  orderId: string,
  status: string
): Promise<void> {
  try {
    const recipientId = status === "pending" ? sellerId : buyerId
    const recipientProfile = await getUserProfile(recipientId)
    
    if (!recipientProfile || !recipientProfile.notificationsEnabled) {
      return
    }
    
    const message = status === "pending"
      ? `You have a new order #${orderId.substring(0, 8)}. Check your dashboard to confirm.`
      : `Your order #${orderId.substring(0, 8)} status has been updated to: ${status}`
    
    if (recipientProfile.phone) {
      await sendSMS({
        phoneNumber: recipientProfile.phone,
        message: message
      })
    }
    
    await storeNotification({
      recipientId,
      type: "order",
      title: "Order Update",
      body: message,
      data: { orderId, status }
    })
  } catch (error) {
    console.error("[Notification] Error sending order notification:", error)
  }
}

/**
 * Test notification function (for development)
 */
export async function sendTestNotification(userId: string): Promise<void> {
  const profile = await getUserProfile(userId)
  
  if (profile?.phone) {
    await sendSMS({
      phoneNumber: profile.phone,
      message: "Test notification from Smart Farm Link Rwanda! Your notifications are working correctly."
    })
  }
  
  const user = await getUserData(userId)
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: "Test Notification - Smart Farm Link",
      body: "This is a test notification. Your email notifications are working correctly!"
    })
  }
}
