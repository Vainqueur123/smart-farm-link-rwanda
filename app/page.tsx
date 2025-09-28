"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Users, TrendingUp, Shield, Globe, Smartphone } from "@/lib/lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

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
      title: "Smart Farm Management",
      description: "Track crops, schedule activities, and get district-specific recommendations",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Market Prices",
      description: "Compare prices across all 30 districts and find the best deals",
    },
    {
      icon: Users,
      title: "Connect with Buyers",
      description: "Direct marketplace connecting farmers with buyers nationwide",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Mobile money integration with escrow protection",
    },
    {
      icon: Globe,
      title: "Bilingual Support",
      description: "Available in Kinyarwanda and English with voice features",
    },
    {
      icon: Smartphone,
      title: "Works Offline",
      description: "Full functionality even without internet connection",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
              Smart Farm Link
              <span className="text-green-600"> Rwanda</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty max-w-3xl mx-auto">
              Empowering farmers across all 30 districts of Rwanda with smart agriculture technology. From seedling to
              sale, we're digitizing Rwanda's agricultural future.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" onClick={() => router.push("/auth/signup")} className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/auth/signin")}>
                Sign In
              </Button>
              {isInstallable && (
                <Button variant="secondary" size="lg" onClick={handleInstall}>
                  Install App
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
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600">Comprehensive tools designed specifically for Rwandan farmers</p>
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
              <div className="text-green-100">Districts Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">1M+</div>
              <div className="text-green-100">Farmers Ready</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">24/7</div>
              <div className="text-green-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-balance">
              Ready to transform your farming?
            </h2>
            <p className="mt-4 text-lg text-gray-600 text-pretty">
              Join thousands of farmers already using Smart Farm Link Rwanda to increase their income and improve their
              harvests.
            </p>
            <div className="mt-8">
              <Button size="lg" onClick={() => router.push("/auth/signup")} className="bg-green-600 hover:bg-green-700">
                Start Your Journey Today
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
