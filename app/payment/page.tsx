"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { HorizontalDashboardLayout } from "@/components/horizontal-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function PaymentPage() {
  const { user, userRole } = useAuth()
  const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] = useState("mtn_momo")
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const paymentMethods = [
    { id: "mtn_momo", name: "MTN Mobile Money", icon: Smartphone },
    { id: "airtel_money", name: "Airtel Money", icon: Smartphone },
    { id: "bank_transfer", name: "Bank Transfer", icon: CreditCard },
    { id: "cash", name: "Cash on Delivery", icon: Wallet },
  ]

  const handlePayment = () => {
    // Payment logic would go here
    console.log("Processing payment...")
  }

  return (
    <HorizontalDashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("payment")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("manage_payments_and_transactions")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>{t("payment_methods")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">{method.name}</span>
                    {selectedMethod === method.id && (
                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t("make_payment")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">{t("amount")} (RWF)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {selectedMethod.includes("momo") && (
                <div>
                  <Label htmlFor="phone">{t("phone_number")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0781234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              <Button onClick={handlePayment} className="w-full">
                {t("process_payment")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("recent_transactions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t("payment_to_farmer")}</p>
                    <p className="text-sm text-gray-500">John Doe - Maize Purchase</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">RWF 25,000</p>
                  <Badge variant="outline" className="text-green-600">
                    {t("completed")}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Wallet className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t("pending_payment")}</p>
                    <p className="text-sm text-gray-500">Jane Smith - Beans Order</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">RWF 15,000</p>
                  <Badge variant="outline" className="text-yellow-600">
                    {t("pending")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </HorizontalDashboardLayout>
  )
}