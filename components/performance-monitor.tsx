"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useErrorMonitoring } from "@/lib/error-monitoring"

interface PerformanceMonitorProps {
  pageName: string
  children: React.ReactNode
}

export function PerformanceMonitor({ pageName, children }: PerformanceMonitorProps) {
  const { user } = useAuth()
  const { logPerformance } = useErrorMonitoring(user)
  const [startTime] = useState(Date.now())
  const [renderTime, setRenderTime] = useState<number | null>(null)

  useEffect(() => {
    // Measure render time
    const renderEndTime = Date.now()
    const renderDuration = renderEndTime - startTime
    setRenderTime(renderDuration)

    // Log performance after component mounts
    const timer = setTimeout(() => {
      logPerformance(pageName, renderDuration, renderDuration, {
        component: "PerformanceMonitor",
        timestamp: new Date().toISOString(),
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [pageName, startTime, logPerformance])

  // Log page load performance
  useEffect(() => {
    const handleLoad = () => {
      const loadTime = performance.now()
      logPerformance(pageName, loadTime, renderTime || 0, {
        event: "page_load",
        timestamp: new Date().toISOString(),
      })
    }

    if (document.readyState === "complete") {
      handleLoad()
    } else {
      window.addEventListener("load", handleLoad)
      return () => window.removeEventListener("load", handleLoad)
    }
  }, [pageName, renderTime, logPerformance])

  return <>{children}</>
}

// Hook for measuring component performance
export function usePerformanceMonitor(componentName: string) {
  const { user } = useAuth()
  const { logPerformance } = useErrorMonitoring(user)
  const [startTime] = useState(Date.now())

  const endMeasurement = (action?: string) => {
    const endTime = Date.now()
    const duration = endTime - startTime
    
    logPerformance(componentName, duration, duration, {
      action: action || "component_render",
      timestamp: new Date().toISOString(),
    })

    return duration
  }

  return { endMeasurement }
}

// Hook for measuring async operations
export function useAsyncPerformanceMonitor(operationName: string) {
  const { user } = useAuth()
  const { logPerformance } = useErrorMonitoring(user)

  const measureAsync = async <T>(
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const startTime = Date.now()
    
    try {
      const result = await operation()
      const endTime = Date.now()
      const duration = endTime - startTime

      logPerformance(operationName, duration, 0, {
        ...metadata,
        success: true,
        timestamp: new Date().toISOString(),
      })

      return result
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - startTime

      logPerformance(operationName, duration, 0, {
        ...metadata,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      })

      throw error
    }
  }

  return { measureAsync }
}
