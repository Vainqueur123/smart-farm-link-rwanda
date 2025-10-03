"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { paymentService, type PaymentMethod, type Transaction } from "@/lib/payment-service"
import { useTranslation } from "@/lib/i18n"

export default function PaymentPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listing")
  const amount = searchParams.get("amount")
  const sellerId = searchParams.get("seller")

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "complete">("select")

  // Mock listing data
  const listing = {
    id: listingId,
    crop: "maize",
    quantity: 500,
    unit: "kg",
    pricePerUnit: 350,
    farmerName: "Jean Baptiste Uwimana",
    farmerDistrict: "Nyagatare",
  }

  useEffect(() => {
    if (user) {
      loadPaymentMethods()
    }
  }, [user])

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getUserPaymentMethods(user!.uid)
      setPaymentMethods(methods)
      setSelectedMethod(methods.find((m) => m.isDefault) || methods[0] || null)
    } catch (error) {
      console.error("Failed to load payment methods:", error)
    }
  }

  const handlePayment = async () => {
    if (!selectedMethod || !user || !listingId || !amount || !sellerId) return

    setLoading(true)
    setStep("processing")

    try {
      // Initialize payment
      const { transactionId } = await paymentService.initializePayment({
        amount: Number.parseInt(amount),
        currency: "RWF",
        paymentMethod: selectedMethod,
        buyerId: user.uid,
        sellerId,
        listingId,
        description: `${listing.crop} - ${listing.quantity}${listing.unit}`,
      })

      // Create escrow account
      await paymentService.createEscrowAccount({
        transactionId,
        amount: Number.parseInt(amount),
        buyerId: user.uid,
        sellerId,
        listingId,
      })

      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setStep("complete")
    } catch (error) {
      console.error("Payment failed:", error)
      setStep("select")
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = Number.parseInt(amount || "0")
  const serviceFee = Math.round(totalAmount * 0.025) // 2.5% service fee
  const finalAmount = totalAmount + serviceFee

  if (step === "complete") {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("Payment Successful!")}</h2>
                <p className="text-muted-foreground">
                  {t("Your payment has been processed and funds are held in escrow")}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("Amount Paid")}</span>
                  <span className="font-medium">{finalAmount.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Payment Method")}</span>
                  <span>{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("Status")}</span>
                  <Badge className="bg-green-600">{t("Secured in Escrow")}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => (window.location.href = "/dashboard")}>
                  {t("Go to Dashboard")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => (window.location.href = "/marketplace")}
                >
                  {t("Continue Shopping")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (step === "processing") {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto space-y-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{t("Processing Payment...")}</h2>
                <p className="text-muted-foreground">{t("Please wait while we process your payment securely")}</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>{t("• Verifying payment method")}</p>
                <p>{t("• Creating secure escrow account")}</p>
                <p>{t("• Notifying seller")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("Secure Payment")}</h1>
            <p className="text-muted-foreground">{t("Complete your purchase safely")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Order Summary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/field-of-maize.png"
                  alt={t(listing.crop)}
                  className="w-15 h-15 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{t(listing.crop)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {listing.quantity} {listing.unit} × {listing.pricePerUnit.toLocaleString()} RWF
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("From")}: {listing.farmerName}, {listing.farmerDistrict}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("Subtotal")}</span>
                  <span>{totalAmount.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("Service Fee")} (2.5%)</span>
                  <span>{serviceFee.toLocaleString()} RWF</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{t("Total")}</span>
                  <span>{finalAmount.toLocaleString()} RWF</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">{t("Escrow Protection")}</p>
                    <p className="text-blue-700">
                      {t("Your payment is held securely until you confirm receipt of goods")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Payment Method")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">{t("No payment methods found")}</p>
                  <Button variant="outline" className="mt-2 bg-transparent">
                    {t("Add Payment Method")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod?.id === method.id
                          ? "border-green-600 bg-green-50"
                          : "border-border hover:border-muted-foreground"
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            {method.type === "mtn_momo" ? "MTN" : "AM"}
                          </div>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.phoneNumber}</p>
                          </div>
                        </div>
                        {method.isDefault && <Badge variant="secondary">{t("Default")}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedMethod && (
                <div className="space-y-4 pt-4">
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">{t("Payment Instructions")}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>1. {t("You will receive a payment prompt on your phone")}</p>
                      <p>2. {t("Enter your mobile money PIN to confirm")}</p>
                      <p>3. {t("Funds will be held in escrow until delivery")}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePayment} disabled={loading}>
                    {loading ? t("Processing...") : t(`Pay ${finalAmount.toLocaleString()} RWF`)}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
