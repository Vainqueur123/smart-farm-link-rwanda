"use client"

import { useEffect } from "react"
import { setupGlobalErrorHandling } from "@/lib/error-monitoring"

export function ErrorMonitoringSetup() {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling()
    
    // Log app initialization
    console.log("Smart Farm Link Rwanda - Error monitoring initialized")
  }, [])

  return null
}

