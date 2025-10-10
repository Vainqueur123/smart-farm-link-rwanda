"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sprout, User, ShoppingCart, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp } = useAuth()
  const { t, i18n } = useTranslation()
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const initialRole = (searchParams?.get("role") as 'farmer' | 'buyer' | 'admin' | null) || null
  const [userType, setUserType] = useState<'farmer' | 'buyer' | 'admin' | null>(initialRole)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [enableNotifications, setEnableNotifications] = useState(true)

  // Ensure role is preselected from URL; if not present, redirect to homepage role selector
  useEffect(() => {
    if (!userType && !initialRole) {
      // Guide users to select role from Get Started
      router.push("/")
    }
  }, [userType, initialRole, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!userType) {
      setError(t("Choose your role to continue"))
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Please enter your full name")
      setLoading(false)
      return
    }

    if (!phone.trim() || phone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits)")
      setLoading(false)
      return
    }

    try {
      const user = await signUp(email, password, userType, {
        name: name.trim(),
        phone: phone.trim(),
        enableNotifications
      })
      setSuccess(t("Account created successfully") + "! " + t("Welcome! Your account has been created"))
      
      // Redirect immediately - user is now logged in
      setTimeout(() => {
        if (userType === 'farmer') {
          router.push("/onboarding")
        } else if (userType === 'admin') {
          router.push("/admin-dashboard")
        } else if (userType === 'buyer') {
          router.push("/buyer-dashboard")
        } else {
          router.push("/dashboard")
        }
      }, 1500)
    } catch (error: any) {
      if (error.message === "Account already exists") {
        setError(t("Account already exists") + ". " + t("An account with this email already exists") + ". " + t("Please try logging in instead"))
      } else {
        setError(error.message || "Failed to create account")
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t("signUp")}</CardTitle>
          <CardDescription>{t("Choose your role to continue")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" onClick={() => i18n.changeLanguage(i18n.language === "rw" ? "en" : "rw")}>
              {i18n.language === "rw" ? "EN" : "RW"}
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {/* Role display (preselected from Get Started) */}
            {userType && (
              <div className="mb-2 text-center">
                <p className="text-sm text-gray-700">
                  {t("User Type")}: <span className="font-semibold capitalize">{userType}</span>
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">{t("Full Name")} *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("Phone Number")} *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+250 7XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Used for SMS notifications when you receive messages</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("Email Address")} *</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <Label htmlFor="notifications" className="text-sm font-normal cursor-pointer">
                {t("Enable SMS & Email notifications for new messages")}
              </Label>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading || !userType}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("signUp")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("alreadyHaveAccount")} {" "}
              <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
                {t("signIn")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
