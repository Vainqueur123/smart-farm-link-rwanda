"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Users, TrendingUp, Shield, Globe, Smartphone, User, ShoppingCart } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function HomePage() {
  const router = useRouter()
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    }
  }

  const features = [
    {
      icon: Sprout,
      title: t("feature_smartFarm"),
      description: t("feature_smartFarm_desc"),
    },
    {
      icon: TrendingUp,
      title: t("feature_marketPrices"),
      description: t("feature_marketPrices_desc"),
    },
    {
      icon: Users,
      title: t("feature_connectBuyers"),
      description: t("feature_connectBuyers_desc"),
    },
    {
      icon: Shield,
      title: t("feature_securePayments"),
      description: t("feature_securePayments_desc"),
    },
    {
      icon: Globe,
      title: t("feature_bilingual"),
      description: t("feature_bilingual_desc"),
    },
    {
      icon: Smartphone,
      title: t("feature_offline"),
      description: t("feature_offline_desc"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => i18n.changeLanguage(i18n.language === "rw" ? "en" : "rw")}> 
                {i18n.language === "rw" ? "EN" : "RW"}
              </Button>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty max-w-3xl mx-auto">
              {t("heroSub")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" onClick={() => setShowRoleSelection(true)} className="bg-green-600 hover:bg-green-700">
                {t("getStarted")}
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                console.log("Sign in button clicked, navigating to /auth/signin")
                router.push("/auth/signin")
              }}>
                {t("signIn")}
              </Button>
              {isInstallable && (
                <Button variant="secondary" size="lg" onClick={handleInstall}>
                  {t("installApp")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("featuresTitle")}</h2>
            <p className="mt-4 text-lg text-gray-600">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={feature.title}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold text-white">30</div>
              <div className="text-green-100">{t("stats_districts")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">1M+</div>
              <div className="text-green-100">{t("stats_farmers")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="text-green-100">{t("stats_support")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-balance">{t("cta_title")}</h2>
            <p className="mt-4 text-lg text-gray-600 text-pretty">{t("cta_sub")}</p>
            <div className="mt-8">
              <Button size="lg" onClick={() => setShowRoleSelection(true)} className="bg-green-600 hover:bg-green-700">
                {t("startJourney")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{t("Choose your role")}</CardTitle>
              <CardDescription className="text-center">
                {t("Select how you want to use Smart Farm Link")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farmer Role */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-600"
                  onClick={() => router.push("/auth/signup?role=farmer")}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Sprout className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <CardTitle>{t("I'm a Farmer")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {t("Sell your produce, get farming advice, and connect with buyers")}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Buyer Role */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-600"
                  onClick={() => router.push("/auth/signup?role=buyer")}
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <ShoppingCart className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <CardTitle>{t("I'm a Buyer")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {t("Purchase fresh produce directly from local farmers")}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowRoleSelection(false)}
                >
                  {t("Cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}
