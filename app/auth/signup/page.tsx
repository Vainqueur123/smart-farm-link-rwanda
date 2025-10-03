"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sprout, User, ShoppingCart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState<'farmer' | 'buyer' | null>(null)

  // Debug userType changes
  useEffect(() => {
    console.log("UserType changed to:", userType)
  }, [userType])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()
  const { t, i18n } = useTranslation()

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

    try {
      await signUp(email, password, userType)
      setSuccess(t("Account created successfully") + "! " + t("Welcome! Your account has been created"))
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        if (userType === 'farmer') {
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }
      }, 2000)
    } catch (error: any) {
      if (error.message === "Account already exists") {
        setError(t("Account already exists") + ". " + t("An account with this email already exists") + ". " + t("Please try logging in instead"))
      } else {
        setError(error.message || "Failed to create account")
      }
    } finally {
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

            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("User Type")}</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                    userType === 'farmer' 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg' 
                      : 'hover:bg-green-50 border-gray-300'
                  }`}
                  onClick={() => {
                    console.log("Farmer button clicked")
                    setUserType('farmer')
                  }}
                  disabled={loading}
                >
                  <User className={`h-6 w-6 ${userType === 'farmer' ? 'text-white' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${userType === 'farmer' ? 'text-white' : 'text-gray-700'}`}>
                    {t("Farmer")}
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                    userType === 'buyer' 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg' 
                      : 'hover:bg-green-50 border-gray-300'
                  }`}
                  onClick={() => {
                    console.log("Buyer button clicked")
                    setUserType('buyer')
                  }}
                  disabled={loading}
                >
                  <ShoppingCart className={`h-6 w-6 ${userType === 'buyer' ? 'text-white' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${userType === 'buyer' ? 'text-white' : 'text-gray-700'}`}>
                    {t("Buyer")}
                  </span>
                </Button>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  {userType === 'farmer' ? t("I am a farmer") : userType === 'buyer' ? t("I am a buyer") : t("Select your role")}
                </p>
                {userType && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    ✓ {userType === 'farmer' ? t("Farmer") : t("Buyer")} {t("selected")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email / {t("phoneNumber")}</Label>
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
