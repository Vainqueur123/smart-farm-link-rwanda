// SMS service for offline communication fallback
export interface SMSMessage {
  id: string
  phoneNumber: string
  message: string
  type: "market_alert" | "payment_notification" | "weather_update" | "general"
  status: "pending" | "sent" | "failed"
  timestamp: number
  retryCount: number
}

class SMSService {
  private apiUrl = process.env.NEXT_PUBLIC_SMS_API_URL || "https://api.smartfarmlink.rw/sms"
  private apiKey = process.env.NEXT_PUBLIC_SMS_API_KEY || ""

  async sendSMS(phoneNumber: string, message: string, type: SMSMessage["type"] = "general"): Promise<boolean> {
    const smsMessage: SMSMessage = {
      id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phoneNumber,
      message,
      type,
      status: "pending",
      timestamp: Date.now(),
      retryCount: 0,
    }

    console.log("[v0] Sending SMS:", smsMessage)

    try {
      // In a real implementation, this would integrate with Rwanda SMS gateways
      // such as Africa's Talking, Twilio, or local providers

      // Mock SMS sending
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success/failure
      const success = Math.random() > 0.1 // 90% success rate

      if (success) {
        console.log("[v0] SMS sent successfully to", phoneNumber)
        return true
      } else {
        throw new Error("SMS delivery failed")
      }
    } catch (error) {
      console.error("[v0] SMS sending failed:", error)
      return false
    }
  }

  // Send market price alerts via SMS
  async sendMarketAlert(phoneNumber: string, crop: string, price: number, district: string): Promise<boolean> {
    const message = `FarmLink Alert: ${crop} price in ${district} is now ${price.toLocaleString()} RWF/kg. Check the app for buyers. Reply STOP to unsubscribe.`
    return this.sendSMS(phoneNumber, message, "market_alert")
  }

  // Send payment notifications via SMS
  async sendPaymentNotification(phoneNumber: string, amount: number, status: string): Promise<boolean> {
    const message = `FarmLink Payment: Your payment of ${amount.toLocaleString()} RWF is ${status}. Check the app for details.`
    return this.sendSMS(phoneNumber, message, "payment_notification")
  }

  // Send weather updates via SMS
  async sendWeatherUpdate(phoneNumber: string, district: string, forecast: string): Promise<boolean> {
    const message = `FarmLink Weather: ${district} - ${forecast}. Plan your farming activities accordingly.`
    return this.sendSMS(phoneNumber, message, "weather_update")
  }

  // Send general farming tips via SMS
  async sendFarmingTip(phoneNumber: string, tip: string): Promise<boolean> {
    const message = `FarmLink Tip: ${tip} Visit the app for more farming guidance.`
    return this.sendSMS(phoneNumber, message, "general")
  }

  // Batch SMS sending for multiple recipients
  async sendBatchSMS(
    recipients: { phoneNumber: string; message: string }[],
  ): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS(recipient.phoneNumber, recipient.message)
        if (result) {
          success++
        } else {
          failed++
        }
      } catch (error) {
        failed++
      }

      // Add delay between messages to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    console.log("[v0] Batch SMS results:", { success, failed })
    return { success, failed }
  }
}

export const smsService = new SMSService()
