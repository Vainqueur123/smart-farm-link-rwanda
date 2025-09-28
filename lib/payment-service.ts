// Payment service for Rwanda mobile money integration
export interface PaymentMethod {
  id: string
  type: "mtn_momo" | "airtel_money" | "bank_transfer"
  name: string
  phoneNumber?: string
  accountNumber?: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  type: "purchase" | "sale" | "escrow_release" | "refund"
  amount: number
  currency: "RWF"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  fromUserId: string
  toUserId: string
  listingId?: string
  paymentMethod: PaymentMethod
  escrowId?: string
  createdAt: string
  completedAt?: string
  failureReason?: string
  metadata?: Record<string, any>
}

export interface EscrowAccount {
  id: string
  transactionId: string
  amount: number
  status: "holding" | "released" | "refunded"
  buyerId: string
  sellerId: string
  listingId: string
  releaseConditions: string[]
  createdAt: string
  releaseDate?: string
}

class PaymentService {
  private baseUrl = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "https://api.smartfarmlink.rw"

  async initializePayment(data: {
    amount: number
    currency: "RWF"
    paymentMethod: PaymentMethod
    buyerId: string
    sellerId: string
    listingId: string
    description: string
  }): Promise<{ transactionId: string; paymentUrl?: string }> {
    // Simulate payment initialization
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    console.log("[v0] Initializing payment:", data)

    // For mobile money, we would integrate with MTN MoMo API or Airtel Money API
    if (data.paymentMethod.type === "mtn_momo") {
      return this.initializeMTNMoMo(data, transactionId)
    } else if (data.paymentMethod.type === "airtel_money") {
      return this.initializeAirtelMoney(data, transactionId)
    }

    return { transactionId }
  }

  private async initializeMTNMoMo(data: any, transactionId: string) {
    // MTN Mobile Money API integration
    const momoPayload = {
      amount: data.amount.toString(),
      currency: data.currency,
      externalId: transactionId,
      payer: {
        partyIdType: "MSISDN",
        partyId: data.paymentMethod.phoneNumber,
      },
      payerMessage: `Payment for ${data.description}`,
      payeeNote: `Smart Farm Link - ${data.listingId}`,
    }

    console.log("[v0] MTN MoMo payload:", momoPayload)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      transactionId,
      paymentUrl: `momo://pay?amount=${data.amount}&reference=${transactionId}`,
    }
  }

  private async initializeAirtelMoney(data: any, transactionId: string) {
    // Airtel Money API integration
    const airtelPayload = {
      reference: transactionId,
      subscriber: {
        country: "RW",
        currency: data.currency,
        msisdn: data.paymentMethod.phoneNumber,
      },
      transaction: {
        amount: data.amount,
        country: "RW",
        currency: data.currency,
        id: transactionId,
      },
    }

    console.log("[v0] Airtel Money payload:", airtelPayload)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      transactionId,
      paymentUrl: `airtel://pay?amount=${data.amount}&reference=${transactionId}`,
    }
  }

  async createEscrowAccount(data: {
    transactionId: string
    amount: number
    buyerId: string
    sellerId: string
    listingId: string
  }): Promise<EscrowAccount> {
    const escrowId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const escrowAccount: EscrowAccount = {
      id: escrowId,
      transactionId: data.transactionId,
      amount: data.amount,
      status: "holding",
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      listingId: data.listingId,
      releaseConditions: ["Buyer confirms receipt of goods", "Quality inspection passed", "Delivery completed"],
      createdAt: new Date().toISOString(),
    }

    console.log("[v0] Created escrow account:", escrowAccount)

    return escrowAccount
  }

  async releaseEscrow(escrowId: string, reason: string): Promise<boolean> {
    console.log("[v0] Releasing escrow:", escrowId, reason)

    // Simulate escrow release
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return true
  }

  async getTransactionStatus(transactionId: string): Promise<Transaction["status"]> {
    // Simulate checking transaction status
    await new Promise((resolve) => setTimeout(resolve, 500))

    const statuses: Transaction["status"][] = ["pending", "processing", "completed"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // Mock payment methods for demonstration
    return [
      {
        id: "pm_1",
        type: "mtn_momo",
        name: "MTN Mobile Money",
        phoneNumber: "+250788123456",
        isDefault: true,
      },
      {
        id: "pm_2",
        type: "airtel_money",
        name: "Airtel Money",
        phoneNumber: "+250738123456",
        isDefault: false,
      },
    ]
  }

  async addPaymentMethod(userId: string, method: Omit<PaymentMethod, "id">): Promise<PaymentMethod> {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }

    console.log("[v0] Added payment method:", newMethod)

    return newMethod
  }
}

export const paymentService = new PaymentService()
