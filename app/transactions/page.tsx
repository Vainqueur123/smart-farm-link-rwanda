"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, Shield, Clock, CheckCircle, XCircle, Eye, Download } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface Transaction {
  id: string
  type: "purchase" | "sale" | "escrow_release" | "refund"
  amount: number
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  crop: string
  quantity: number
  unit: string
  otherParty: string
  otherPartyDistrict: string
  paymentMethod: string
  escrowStatus?: "holding" | "released" | "refunded"
  createdAt: string
  completedAt?: string
}

export default function TransactionsPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: "txn_001",
        type: "purchase",
        amount: 175000,
        status: "completed",
        crop: "Maize",
        quantity: 500,
        unit: "kg",
        otherParty: "Jean Baptiste Uwimana",
        otherPartyDistrict: "Nyagatare",
        paymentMethod: "MTN Mobile Money",
        escrowStatus: "released",
        createdAt: "2024-01-15T10:30:00Z",
        completedAt: "2024-01-16T14:20:00Z",
      },
      {
        id: "txn_002",
        type: "sale",
        amount: 280000,
        status: "processing",
        crop: "Irish Potatoes",
        quantity: 1000,
        unit: "kg",
        otherParty: "Marie Claire Mukamana",
        otherPartyDistrict: "Kigali",
        paymentMethod: "Airtel Money",
        escrowStatus: "holding",
        createdAt: "2024-01-14T08:15:00Z",
      },
      {
        id: "txn_003",
        type: "purchase",
        amount: 240000,
        status: "pending",
        crop: "Coffee",
        quantity: 200,
        unit: "kg",
        otherParty: "Emmanuel Nzeyimana",
        otherPartyDistrict: "Huye",
        paymentMethod: "MTN Mobile Money",
        escrowStatus: "holding",
        createdAt: "2024-01-13T16:45:00Z",
      },
    ]

    setTransactions(mockTransactions)
    setLoading(false)
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      pending: "outline",
      failed: "destructive",
      cancelled: "destructive",
    } as const

    return <Badge variant={variants[status] || "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const getEscrowBadge = (escrowStatus?: Transaction["escrowStatus"]) => {
    if (!escrowStatus) return null

    const variants = {
      holding: "secondary",
      released: "default",
      refunded: "outline",
    } as const

    return (
      <Badge variant={variants[escrowStatus]} className="ml-2">
        <Shield className="h-3 w-3 mr-1" />
        {escrowStatus === "holding" ? "Escrow" : escrowStatus.charAt(0).toUpperCase() + escrowStatus.slice(1)}
      </Badge>
    )
  }

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "all") return true
    if (activeTab === "purchases") return transaction.type === "purchase"
    if (activeTab === "sales") return transaction.type === "sale"
    return true
  })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("Loading transactions...")}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">{t("Transaction History")}</h1>
            <p className="text-muted-foreground text-pretty">{t("Track all your payments and sales")}</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t("Export")}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Total Purchases")}</p>
                  <p className="text-2xl font-bold">415,000 RWF</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Total Sales")}</p>
                  <p className="text-2xl font-bold">280,000 RWF</p>
                </div>
                <ArrowDownLeft className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("In Escrow")}</p>
                  <p className="text-2xl font-bold">520,000 RWF</p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">{t("All Transactions")}</TabsTrigger>
            <TabsTrigger value="purchases">{t("Purchases")}</TabsTrigger>
            <TabsTrigger value="sales">{t("Sales")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{t("No transactions found")}</p>
                </CardContent>
              </Card>
            ) : (
              filteredTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          {transaction.type === "purchase" ? (
                            <ArrowUpRight className="h-6 w-6 text-red-600" />
                          ) : (
                            <ArrowDownLeft className="h-6 w-6 text-green-600" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {transaction.type === "purchase" ? t("Purchased") : t("Sold")} {transaction.crop}
                            </h3>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.quantity} {transaction.unit} • {transaction.otherParty},{" "}
                            {transaction.otherPartyDistrict}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="text-lg font-semibold">
                          {transaction.type === "purchase" ? "-" : "+"}
                          {transaction.amount.toLocaleString()} RWF
                        </p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(transaction.status)}
                          {getEscrowBadge(transaction.escrowStatus)}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          {t("Details")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
