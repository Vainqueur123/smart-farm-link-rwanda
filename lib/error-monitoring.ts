"use client"

import { User } from "./types"

export interface ErrorLog {
  id: string
  timestamp: Date
  level: "error" | "warning" | "info"
  message: string
  stack?: string
  userId?: string
  userRole?: string
  page?: string
  action?: string
  metadata?: Record<string, any>
  userAgent?: string
  url?: string
}

export interface PerformanceLog {
  id: string
  timestamp: Date
  page: string
  loadTime: number
  renderTime: number
  userId?: string
  userRole?: string
  metadata?: Record<string, any>
}

class ErrorMonitoringService {
  private errors: ErrorLog[] = []
  private performanceLogs: PerformanceLog[] = []
  private maxLogs = 1000 // Keep only last 1000 logs in memory

  // Log an error
  logError(
    error: Error | string,
    context?: {
      userId?: string
      userRole?: string
      page?: string
      action?: string
      metadata?: Record<string, any>
    }
  ) {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      level: "error",
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "object" && error.stack ? error.stack : undefined,
      userId: context?.userId,
      userRole: context?.userRole,
      page: context?.page || window.location.pathname,
      action: context?.action,
      metadata: context?.metadata,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    this.errors.push(errorLog)
    this.trimLogs()

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorLog)
    }

    // In production, you would send this to your error monitoring service
    // this.sendToMonitoringService(errorLog)
  }

  // Log a warning
  logWarning(
    message: string,
    context?: {
      userId?: string
      userRole?: string
      page?: string
      action?: string
      metadata?: Record<string, any>
    }
  ) {
    const warningLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date(),
      level: "warning",
      message,
      userId: context?.userId,
      userRole: context?.userRole,
      page: context?.page || window.location.pathname,
      action: context?.action,
      metadata: context?.metadata,
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    this.errors.push(warningLog)
    this.trimLogs()

    if (process.env.NODE_ENV === "development") {
      console.warn("Warning logged:", warningLog)
    }
  }

  // Log performance metrics
  logPerformance(
    page: string,
    loadTime: number,
    renderTime: number,
    context?: {
      userId?: string
      userRole?: string
      metadata?: Record<string, any>
    }
  ) {
    const performanceLog: PerformanceLog = {
      id: this.generateId(),
      timestamp: new Date(),
      page,
      loadTime,
      renderTime,
      userId: context?.userId,
      userRole: context?.userRole,
      metadata: context?.metadata,
    }

    this.performanceLogs.push(performanceLog)
    this.trimLogs()

    if (process.env.NODE_ENV === "development") {
      console.log("Performance logged:", performanceLog)
    }
  }

  // Get error logs
  getErrors(filter?: {
    level?: "error" | "warning" | "info"
    userId?: string
    page?: string
    startDate?: Date
    endDate?: Date
  }): ErrorLog[] {
    let filtered = this.errors

    if (filter) {
      if (filter.level) {
        filtered = filtered.filter(log => log.level === filter.level)
      }
      if (filter.userId) {
        filtered = filtered.filter(log => log.userId === filter.userId)
      }
      if (filter.page) {
        filtered = filtered.filter(log => log.page === filter.page)
      }
      if (filter.startDate) {
        filtered = filtered.filter(log => log.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        filtered = filtered.filter(log => log.timestamp <= filter.endDate!)
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get performance logs
  getPerformanceLogs(filter?: {
    page?: string
    userId?: string
    startDate?: Date
    endDate?: Date
  }): PerformanceLog[] {
    let filtered = this.performanceLogs

    if (filter) {
      if (filter.page) {
        filtered = filtered.filter(log => log.page === filter.page)
      }
      if (filter.userId) {
        filtered = filtered.filter(log => log.userId === filter.userId)
      }
      if (filter.startDate) {
        filtered = filtered.filter(log => log.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        filtered = filtered.filter(log => log.timestamp <= filter.endDate!)
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get error statistics
  getErrorStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const errors24h = this.errors.filter(e => e.timestamp >= last24h)
    const errors7d = this.errors.filter(e => e.timestamp >= last7d)

    return {
      total: this.errors.length,
      last24h: errors24h.length,
      last7d: errors7d.length,
      byLevel: {
        error: this.errors.filter(e => e.level === "error").length,
        warning: this.errors.filter(e => e.level === "warning").length,
        info: this.errors.filter(e => e.level === "info").length,
      },
      byPage: this.getErrorsByPage(),
      byUser: this.getErrorsByUser(),
    }
  }

  // Get performance statistics
  getPerformanceStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const perf24h = this.performanceLogs.filter(p => p.timestamp >= last24h)
    const perf7d = this.performanceLogs.filter(p => p.timestamp >= last7d)

    return {
      total: this.performanceLogs.length,
      last24h: perf24h.length,
      last7d: perf7d.length,
      averageLoadTime: this.performanceLogs.reduce((sum, p) => sum + p.loadTime, 0) / this.performanceLogs.length || 0,
      averageRenderTime: this.performanceLogs.reduce((sum, p) => sum + p.renderTime, 0) / this.performanceLogs.length || 0,
      byPage: this.getPerformanceByPage(),
    }
  }

  // Clear all logs
  clearLogs() {
    this.errors = []
    this.performanceLogs = []
  }

  // Export logs as JSON
  exportLogs() {
    return {
      errors: this.errors,
      performance: this.performanceLogs,
      exportedAt: new Date().toISOString(),
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private trimLogs() {
    if (this.errors.length > this.maxLogs) {
      this.errors = this.errors.slice(-this.maxLogs)
    }
    if (this.performanceLogs.length > this.maxLogs) {
      this.performanceLogs = this.performanceLogs.slice(-this.maxLogs)
    }
  }

  private getErrorsByPage(): Record<string, number> {
    const pageCounts: Record<string, number> = {}
    this.errors.forEach(error => {
      pageCounts[error.page || "unknown"] = (pageCounts[error.page || "unknown"] || 0) + 1
    })
    return pageCounts
  }

  private getErrorsByUser(): Record<string, number> {
    const userCounts: Record<string, number> = {}
    this.errors.forEach(error => {
      if (error.userId) {
        userCounts[error.userId] = (userCounts[error.userId] || 0) + 1
      }
    })
    return userCounts
  }

  private getPerformanceByPage(): Record<string, { count: number; avgLoadTime: number; avgRenderTime: number }> {
    const pageStats: Record<string, { count: number; avgLoadTime: number; avgRenderTime: number }> = {}
    
    this.performanceLogs.forEach(log => {
      if (!pageStats[log.page]) {
        pageStats[log.page] = { count: 0, avgLoadTime: 0, avgRenderTime: 0 }
      }
      pageStats[log.page].count++
      pageStats[log.page].avgLoadTime += log.loadTime
      pageStats[log.page].avgRenderTime += log.renderTime
    })

    // Calculate averages
    Object.keys(pageStats).forEach(page => {
      const stats = pageStats[page]
      stats.avgLoadTime = stats.avgLoadTime / stats.count
      stats.avgRenderTime = stats.avgRenderTime / stats.count
    })

    return pageStats
  }

  // Send to external monitoring service (implement as needed)
  private async sendToMonitoringService(log: ErrorLog) {
    // Example implementation for Sentry, LogRocket, or custom service
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // })
    } catch (error) {
      console.error('Failed to send log to monitoring service:', error)
    }
  }
}

// Create singleton instance
export const errorMonitoring = new ErrorMonitoringService()

// React hook for error monitoring
export function useErrorMonitoring(user?: User | null) {
  const logError = (error: Error | string, context?: {
    page?: string
    action?: string
    metadata?: Record<string, any>
  }) => {
    errorMonitoring.logError(error, {
      userId: user?.id,
      userRole: user?.role,
      ...context,
    })
  }

  const logWarning = (message: string, context?: {
    page?: string
    action?: string
    metadata?: Record<string, any>
  }) => {
    errorMonitoring.logWarning(message, {
      userId: user?.id,
      userRole: user?.role,
      ...context,
    })
  }

  const logPerformance = (page: string, loadTime: number, renderTime: number, metadata?: Record<string, any>) => {
    errorMonitoring.logPerformance(page, loadTime, renderTime, {
      userId: user?.id,
      userRole: user?.role,
      metadata,
    })
  }

  return {
    logError,
    logWarning,
    logPerformance,
    getErrors: errorMonitoring.getErrors.bind(errorMonitoring),
    getPerformanceLogs: errorMonitoring.getPerformanceLogs.bind(errorMonitoring),
    getErrorStats: errorMonitoring.getErrorStats.bind(errorMonitoring),
    getPerformanceStats: errorMonitoring.getPerformanceStats.bind(errorMonitoring),
  }
}

// Global error handler
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorMonitoring.logError(
      `Unhandled promise rejection: ${event.reason}`,
      {
        page: window.location.pathname,
        action: 'unhandled_promise_rejection',
        metadata: { reason: event.reason }
      }
    )
  })

  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    errorMonitoring.logError(
      event.error || event.message,
      {
        page: window.location.pathname,
        action: 'javascript_error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        }
      }
    )
  })
}
