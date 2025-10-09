"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sprout } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return // Prevent multiple submissions
    
    setLoading(true)
    setError("")

    try {
      console.log("Attempting sign in with:", email)
      const user = await signIn(email, password)
      console.log("Sign in successful, user:", user)
      
      if (!user) {
        throw new Error("User not found")
      }
      
      // Redirect based on user role
      const redirectPath = user.role === 'admin' 
        ? '/admin-dashboard'
        : user.role === 'farmer' 
          ? '/farmer-dashboard' 
          : user.role === 'buyer'
            ? '/buyer-dashboard'
            : '/'
            
      console.log(`Redirecting to: ${redirectPath}`)
      router.push(redirectPath)
      // The component will be unmounted during navigation, so we don't need to setLoading(false)
      return
    } catch (error: any) {
      console.error("Sign in error:", error)
      if (error.message === "Account does not exist") {
        setError(t("Account does not exist") + ". " + t("Please sign up first to create an account"))
      } else if (error.message === "Invalid credentials") {
        setError(t("Invalid credentials") + ". " + t("Please check your email and password"))
      } else {
        setError(error.message || "Failed to sign in")
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
          <CardTitle className="text-2xl font-bold">{t("signIn")}</CardTitle>
          <CardDescription>{t("signinDescription")}</CardDescription>
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

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setEmail("demo@smartfarm.rw")
                  setPassword("demo123")
                }}
                disabled={loading}
              >
                {t("Use Demo Account")}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("signIn")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("noAccountQuestion")} {" "}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                {t("signUp")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
