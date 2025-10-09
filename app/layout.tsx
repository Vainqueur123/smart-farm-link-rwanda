import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ErrorMonitoringSetup } from "@/components/error-monitoring-setup"

export const metadata: Metadata = {
  title: "Smart Farm Link Rwanda",
  description: "Empowering farmers across all 30 districts of Rwanda with smart agriculture technology",
  generator: "Smart Farm Link Rwanda",
  manifest: "/manifest.json",
  keywords: ["agriculture", "farming", "Rwanda", "marketplace", "crops", "smart farming"],
  authors: [{ name: "Smart Farm Link Rwanda Team" }],
  creator: "Smart Farm Link Rwanda",
  publisher: "Smart Farm Link Rwanda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.jpg",
    apple: "/icons/icon-192x192.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmLink RW",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#16a34a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FarmLink RW" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ErrorMonitoringSetup />
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
