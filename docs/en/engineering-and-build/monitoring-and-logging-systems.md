# Monitoring and Logging Systems for Element Plus Applications

## Overview

This guide covers comprehensive monitoring and logging strategies for Element Plus applications in production environments, including performance monitoring, error tracking, user analytics, and operational insights.

## Application Performance Monitoring (APM)

### Core Web Vitals Monitoring

```typescript
// src/utils/performance-monitor.ts
export interface PerformanceMetrics {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
}

export class WebVitalsMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []
  
  constructor(private reportCallback: (metrics: PerformanceMetrics) => void) {
    this.initializeObservers()
  }
  
  private initializeObservers() {
    // Largest Contentful Paint
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1]
      this.metrics.lcp = lastEntry.startTime
      this.reportMetric('LCP', lastEntry.startTime)
    })
    
    // First Input Delay
    this.observeMetric('first-input', (entries) => {
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime
        this.metrics.fid = fid
        this.reportMetric('FID', fid)
      })
    })
    
    // Cumulative Layout Shift
    let clsValue = 0
    this.observeMetric('layout-shift', (entries) => {
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.metrics.cls = clsValue
      this.reportMetric('CLS', clsValue)
    })
    
    // First Contentful Paint
    this.observeMetric('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
          this.reportMetric('FCP', entry.startTime)
        }
      })
    })
    
    // Time to First Byte
    this.observeMetric('navigation', (entries) => {
      entries.forEach((entry: any) => {
        this.metrics.ttfb = entry.responseStart - entry.requestStart
        this.reportMetric('TTFB', this.metrics.ttfb)
      })
    })
  }
  
  private observeMetric(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries())
      })
      
      observer.observe({ entryTypes: [entryType] })
      this.observers.push(observer)
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error)
    }
  }
  
  private reportMetric(name: string, value: number) {
    // Send to analytics service
    this.sendToAnalytics({
      event: 'web_vital',
      metric: name,
      value: Math.round(value),
      url: window.location.pathname,
      timestamp: Date.now()
    })
    
    // Check thresholds and alert if needed
    this.checkThresholds(name, value)
  }
  
  private checkThresholds(metric: string, value: number) {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    }
    
    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return
    
    let status: 'good' | 'needs-improvement' | 'poor'
    if (value <= threshold.good) {
      status = 'good'
    } else if (value <= threshold.poor) {
      status = 'needs-improvement'
    } else {
      status = 'poor'
    }
    
    this.sendToAnalytics({
      event: 'performance_threshold',
      metric,
      value,
      status,
      url: window.location.pathname
    })
  }
  
  private sendToAnalytics(data: any) {
    // Send to your analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof gtag !== 'undefined') {
      gtag('event', data.event, {
        custom_parameter_1: data.metric,
        custom_parameter_2: data.value,
        custom_parameter_3: data.status
      })
    }
    
    // Send to custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error)
  }
  
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }
  
  public destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Usage
const monitor = new WebVitalsMonitor((metrics) => {
  console.log('Performance metrics:', metrics)
})
```

### Custom Performance Tracking

```typescript
// src/utils/custom-performance.ts
export class CustomPerformanceTracker {
  private timers: Map<string, number> = new Map()
  private marks: Map<string, number> = new Map()
  
  // Track component render times
  trackComponentRender(componentName: string) {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.reportCustomMetric({
        type: 'component_render',
        name: componentName,
        duration,
        timestamp: Date.now()
      })
      
      return duration
    }
  }
  
  // Track route navigation times
  trackRouteNavigation(fromRoute: string, toRoute: string) {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.reportCustomMetric({
        type: 'route_navigation',
        from: fromRoute,
        to: toRoute,
        duration,
        timestamp: Date.now()
      })
      
      return duration
    }
  }
  
  // Track API call performance
  trackApiCall(endpoint: string, method: string) {
    const startTime = performance.now()
    
    return (status: number, responseSize?: number) => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      this.reportCustomMetric({
        type: 'api_call',
        endpoint,
        method,
        status,
        duration,
        responseSize,
        timestamp: Date.now()
      })
      
      return duration
    }
  }
  
  // Track user interactions
  trackUserInteraction(action: string, element: string, metadata?: any) {
    this.reportCustomMetric({
      type: 'user_interaction',
      action,
      element,
      metadata,
      timestamp: Date.now(),
      url: window.location.pathname
    })
  }
  
  // Track Element Plus component usage
  trackElementPlusUsage(component: string, props?: any) {
    this.reportCustomMetric({
      type: 'element_plus_usage',
      component,
      props: props ? Object.keys(props) : [],
      timestamp: Date.now(),
      url: window.location.pathname
    })
  }
  
  // Memory usage tracking
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      this.reportCustomMetric({
        type: 'memory_usage',
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      })
    }
  }
  
  // Bundle size tracking
  trackBundleSize() {
    if ('getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      const jsResources = resources.filter(resource => 
        resource.name.endsWith('.js') && resource.name.includes('/assets/')
      )
      
      const cssResources = resources.filter(resource => 
        resource.name.endsWith('.css') && resource.name.includes('/assets/')
      )
      
      const totalJSSize = jsResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      )
      
      const totalCSSSize = cssResources.reduce((total, resource) => 
        total + (resource.transferSize || 0), 0
      )
      
      this.reportCustomMetric({
        type: 'bundle_size',
        jsSize: totalJSSize,
        cssSize: totalCSSSize,
        totalSize: totalJSSize + totalCSSSize,
        jsFiles: jsResources.length,
        cssFiles: cssResources.length,
        timestamp: Date.now()
      })
    }
  }
  
  private reportCustomMetric(metric: any) {
    // Send to analytics service
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    }).catch(console.error)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Custom metric:', metric)
    }
  }
}

// Global instance
export const performanceTracker = new CustomPerformanceTracker()
```

## Error Tracking and Monitoring

### Error Boundary Implementation

```vue
<!-- src/components/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <el-result
      icon="error"
      title="Something went wrong"
      :sub-title="errorMessage"
    >
      <template #extra>
        <el-button type="primary" @click="retry">
          Try Again
        </el-button>
        <el-button @click="reportError">
          Report Issue
        </el-button>
      </template>
    </el-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick } from 'vue'
import { ElResult, ElButton } from 'element-plus'
import { errorReporter } from '@/utils/error-reporter'

interface Props {
  fallback?: string
  onError?: (error: Error, instance: any, info: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: 'An unexpected error occurred'
})

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref<any>(null)

onErrorCaptured((error: Error, instance: any, info: string) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallback
  errorDetails.value = {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    instance,
    info,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }
  
  // Report error
  errorReporter.captureException(error, {
    tags: {
      component: 'ErrorBoundary',
      info
    },
    extra: errorDetails.value
  })
  
  // Call custom error handler
  props.onError?.(error, instance, info)
  
  // Prevent the error from propagating
  return false
})

const retry = async () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = null
  
  await nextTick()
}

const reportError = () => {
  errorReporter.showReportDialog(errorDetails.value)
}
</script>

<style scoped>
.error-boundary {
  padding: 20px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

### Comprehensive Error Reporter

```typescript
// src/utils/error-reporter.ts
import { ElMessageBox, ElNotification } from 'element-plus'

export interface ErrorContext {
  tags?: Record<string, string>
  extra?: Record<string, any>
  user?: {
    id: string
    email: string
    name: string
  }
  level?: 'error' | 'warning' | 'info' | 'debug'
}

export class ErrorReporter {
  private userId: string | null = null
  private sessionId: string
  private errorQueue: any[] = []
  private isOnline = navigator.onLine
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupGlobalErrorHandlers()
    this.setupNetworkMonitoring()
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private setupGlobalErrorHandlers() {
    // Capture unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        tags: {
          type: 'javascript_error',
          filename: event.filename,
          lineno: event.lineno?.toString(),
          colno: event.colno?.toString()
        }
      })
    })
    
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason)),
        {
          tags: {
            type: 'unhandled_promise_rejection'
          }
        }
      )
    })
    
    // Capture resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement
        this.captureMessage('Resource loading error', {
          level: 'error',
          tags: {
            type: 'resource_error',
            tagName: target.tagName,
            src: (target as any).src || (target as any).href
          }
        })
      }
    }, true)
  }
  
  private setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrorQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }
  
  public setUser(user: { id: string; email: string; name: string }) {
    this.userId = user.id
  }
  
  public captureException(error: Error, context: ErrorContext = {}) {
    const errorData = {
      type: 'exception',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        userId: this.userId
      },
      breadcrumbs: this.getBreadcrumbs(),
      environment: {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: screen.width,
          height: screen.height
        },
        memory: this.getMemoryInfo(),
        connection: this.getConnectionInfo()
      }
    }
    
    this.sendError(errorData)
  }
  
  public captureMessage(message: string, context: ErrorContext = {}) {
    const messageData = {
      type: 'message',
      message,
      level: context.level || 'info',
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        sessionId: this.sessionId,
        userId: this.userId
      }
    }
    
    this.sendError(messageData)
  }
  
  public addBreadcrumb(message: string, category: string, data?: any) {
    const breadcrumbs = this.getBreadcrumbs()
    breadcrumbs.push({
      message,
      category,
      data,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 50 breadcrumbs
    if (breadcrumbs.length > 50) {
      breadcrumbs.shift()
    }
    
    localStorage.setItem('error_breadcrumbs', JSON.stringify(breadcrumbs))
  }
  
  private getBreadcrumbs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('error_breadcrumbs') || '[]')
    } catch {
      return []
    }
  }
  
  private getMemoryInfo(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }
    return null
  }
  
  private getConnectionInfo(): any {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  }
  
  private sendError(errorData: any) {
    if (!this.isOnline) {
      this.errorQueue.push(errorData)
      return
    }
    
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData)
    }).catch((error) => {
      console.error('Failed to send error report:', error)
      this.errorQueue.push(errorData)
    })
  }
  
  private flushErrorQueue() {
    if (this.errorQueue.length === 0) return
    
    const errors = [...this.errorQueue]
    this.errorQueue = []
    
    fetch('/api/errors/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ errors })
    }).catch((error) => {
      console.error('Failed to flush error queue:', error)
      // Re-add errors to queue
      this.errorQueue.unshift(...errors)
    })
  }
  
  public showReportDialog(errorDetails: any) {
    ElMessageBox.prompt(
      'Please describe what you were doing when this error occurred:',
      'Report Error',
      {
        confirmButtonText: 'Send Report',
        cancelButtonText: 'Cancel',
        inputType: 'textarea',
        inputPlaceholder: 'Describe the steps that led to this error...'
      }
    ).then(({ value }) => {
      this.captureMessage('User reported error', {
        level: 'error',
        extra: {
          userDescription: value,
          errorDetails
        },
        tags: {
          type: 'user_report'
        }
      })
      
      ElNotification({
        title: 'Thank you!',
        message: 'Your error report has been sent.',
        type: 'success'
      })
    }).catch(() => {
      // User cancelled
    })
  }
}

// Global instance
export const errorReporter = new ErrorReporter()
```

## User Analytics and Behavior Tracking

```typescript
// src/utils/analytics.ts
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

export class AnalyticsTracker {
  private sessionId: string
  private userId: string | null = null
  private eventQueue: AnalyticsEvent[] = []
  private isInitialized = false
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private async initialize() {
    // Initialize analytics services
    await this.initializeGoogleAnalytics()
    await this.initializeMixpanel()
    
    this.isInitialized = true
    this.flushEventQueue()
  }
  
  private async initializeGoogleAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        session_id: this.sessionId,
        custom_map: {
          custom_parameter_1: 'element_plus_component',
          custom_parameter_2: 'user_interaction_type'
        }
      })
    }
  }
  
  private async initializeMixpanel() {
    // Initialize Mixpanel if available
    if (typeof mixpanel !== 'undefined') {
      mixpanel.register({
        session_id: this.sessionId,
        app_version: import.meta.env.VITE_APP_VERSION,
        environment: import.meta.env.MODE
      })
    }
  }
  
  public setUserId(userId: string) {
    this.userId = userId
    
    // Set user ID in analytics services
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        user_id: userId
      })
    }
    
    if (typeof mixpanel !== 'undefined') {
      mixpanel.identify(userId)
    }
  }
  
  public track(eventName: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.pathname,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }
    
    if (!this.isInitialized) {
      this.eventQueue.push(event)
      return
    }
    
    this.sendEvent(event)
  }
  
  // Track Element Plus component usage
  public trackComponentUsage(component: string, action: string, properties: Record<string, any> = {}) {
    this.track('element_plus_component_usage', {
      component,
      action,
      ...properties
    })
  }
  
  // Track page views
  public trackPageView(path: string, title?: string) {
    this.track('page_view', {
      path,
      title: title || document.title,
      timestamp: Date.now()
    })
    
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: window.location.href,
        page_path: path
      })
    }
  }
  
  // Track user interactions
  public trackInteraction(element: string, action: string, properties: Record<string, any> = {}) {
    this.track('user_interaction', {
      element,
      action,
      ...properties
    })
  }
  
  // Track form submissions
  public trackFormSubmission(formName: string, success: boolean, errors?: string[]) {
    this.track('form_submission', {
      form_name: formName,
      success,
      errors,
      timestamp: Date.now()
    })
  }
  
  // Track search queries
  public trackSearch(query: string, results: number, filters?: Record<string, any>) {
    this.track('search', {
      query,
      results_count: results,
      filters,
      timestamp: Date.now()
    })
  }
  
  // Track feature usage
  public trackFeatureUsage(feature: string, context?: Record<string, any>) {
    this.track('feature_usage', {
      feature,
      context,
      timestamp: Date.now()
    })
  }
  
  private sendEvent(event: AnalyticsEvent) {
    // Send to custom analytics endpoint
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).catch(console.error)
    
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, event.properties)
    }
    
    // Send to Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event.name, event.properties)
    }
  }
  
  private flushEventQueue() {
    const events = [...this.eventQueue]
    this.eventQueue = []
    
    events.forEach(event => this.sendEvent(event))
  }
}

// Global instance
export const analytics = new AnalyticsTracker()
```

## Logging System

### Structured Logging

```typescript
// src/utils/logger.ts
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  tags?: string[]
  userId?: string
  sessionId?: string
  url?: string
}

export class Logger {
  private logLevel: LogLevel
  private sessionId: string
  private userId: string | null = null
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 1000
  
  constructor(logLevel: LogLevel = LogLevel.INFO) {
    this.logLevel = logLevel
    this.sessionId = this.generateSessionId()
    this.setupPeriodicFlush()
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private setupPeriodicFlush() {
    // Flush logs every 30 seconds
    setInterval(() => {
      this.flush()
    }, 30000)
    
    // Flush logs before page unload
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }
  
  public setUserId(userId: string) {
    this.userId = userId
  }
  
  public setLogLevel(level: LogLevel) {
    this.logLevel = level
  }
  
  public debug(message: string, context?: Record<string, any>, tags?: string[]) {
    this.log(LogLevel.DEBUG, message, context, tags)
  }
  
  public info(message: string, context?: Record<string, any>, tags?: string[]) {
    this.log(LogLevel.INFO, message, context, tags)
  }
  
  public warn(message: string, context?: Record<string, any>, tags?: string[]) {
    this.log(LogLevel.WARN, message, context, tags)
  }
  
  public error(message: string, context?: Record<string, any>, tags?: string[]) {
    this.log(LogLevel.ERROR, message, context, tags)
  }
  
  private log(level: LogLevel, message: string, context?: Record<string, any>, tags?: string[]) {
    if (level < this.logLevel) return
    
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      tags,
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href
    }
    
    // Add to buffer
    this.logBuffer.push(logEntry)
    
    // Flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flush()
    }
    
    // Console output in development
    if (import.meta.env.DEV) {
      this.consoleOutput(logEntry)
    }
  }
  
  private consoleOutput(entry: LogEntry) {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR']
    const levelColors = ['#888', '#007acc', '#ff8c00', '#ff0000']
    
    const style = `color: ${levelColors[entry.level]}; font-weight: bold;`
    const prefix = `[${levelNames[entry.level]}] ${entry.timestamp}`
    
    console.log(`%c${prefix}`, style, entry.message, entry.context || '')
  }
  
  public flush() {
    if (this.logBuffer.length === 0) return
    
    const logs = [...this.logBuffer]
    this.logBuffer = []
    
    // Send to logging service
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ logs })
    }).catch((error) => {
      console.error('Failed to send logs:', error)
      // Re-add logs to buffer if sending fails
      this.logBuffer.unshift(...logs)
    })
  }
  
  // Specialized logging methods
  public logApiCall(method: string, url: string, status: number, duration: number, error?: Error) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    this.log(level, `API ${method} ${url}`, {
      method,
      url,
      status,
      duration,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    }, ['api'])
  }
  
  public logComponentRender(component: string, duration: number, props?: any) {
    this.debug(`Component ${component} rendered`, {
      component,
      duration,
      props: props ? Object.keys(props) : []
    }, ['component', 'render'])
  }
  
  public logRouteChange(from: string, to: string, duration: number) {
    this.info(`Route changed from ${from} to ${to}`, {
      from,
      to,
      duration
    }, ['routing'])
  }
  
  public logUserAction(action: string, element: string, context?: Record<string, any>) {
    this.info(`User ${action} on ${element}`, {
      action,
      element,
      ...context
    }, ['user-action'])
  }
}

// Global logger instance
export const logger = new Logger(
  import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO
)
```

## Real User Monitoring (RUM)

```typescript
// src/utils/rum.ts
export class RealUserMonitoring {
  private sessionId: string
  private userId: string | null = null
  private pageLoadTime: number
  private interactions: any[] = []
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.pageLoadTime = performance.now()
    this.setupMonitoring()
  }
  
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private setupMonitoring() {
    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackVisibilityChange()
    })
    
    // Monitor user interactions
    this.setupInteractionTracking()
    
    // Monitor network conditions
    this.setupNetworkMonitoring()
    
    // Monitor device information
    this.trackDeviceInfo()
    
    // Monitor page performance
    this.setupPerformanceMonitoring()
  }
  
  private setupInteractionTracking() {
    const events = ['click', 'scroll', 'keydown', 'touchstart']
    
    events.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        this.trackInteraction(eventType, event)
      }, { passive: true })
    })
  }
  
  private trackInteraction(type: string, event: Event) {
    const interaction = {
      type,
      timestamp: Date.now(),
      target: this.getElementSelector(event.target as Element),
      viewport: {
        x: window.scrollX,
        y: window.scrollY
      }
    }
    
    this.interactions.push(interaction)
    
    // Keep only last 50 interactions
    if (this.interactions.length > 50) {
      this.interactions.shift()
    }
  }
  
  private getElementSelector(element: Element): string {
    if (!element) return 'unknown'
    
    const id = element.id ? `#${element.id}` : ''
    const classes = element.className ? `.${element.className.split(' ').join('.')}` : ''
    const tag = element.tagName.toLowerCase()
    
    return `${tag}${id}${classes}`
  }
  
  private setupNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      const trackConnection = () => {
        this.sendRUMData({
          type: 'network_change',
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
          timestamp: Date.now()
        })
      }
      
      connection.addEventListener('change', trackConnection)
      trackConnection() // Initial state
    }
  }
  
  private trackDeviceInfo() {
    const deviceInfo = {
      type: 'device_info',
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: Date.now()
    }
    
    this.sendRUMData(deviceInfo)
  }
  
  private setupPerformanceMonitoring() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.sendRUMData({
              type: 'long_task',
              duration: entry.duration,
              startTime: entry.startTime,
              timestamp: Date.now()
            })
          })
        })
        
        observer.observe({ entryTypes: ['longtask'] })
      } catch (error) {
        console.warn('Long task monitoring not supported:', error)
      }
    }
    
    // Monitor resource timing
    this.trackResourceTiming()
  }
  
  private trackResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming
        
        this.sendRUMData({
          type: 'resource_timing',
          name: resource.name,
          duration: resource.duration,
          transferSize: resource.transferSize,
          encodedBodySize: resource.encodedBodySize,
          decodedBodySize: resource.decodedBodySize,
          timestamp: Date.now()
        })
      })
    })
    
    observer.observe({ entryTypes: ['resource'] })
  }
  
  private trackVisibilityChange() {
    this.sendRUMData({
      type: 'visibility_change',
      hidden: document.hidden,
      visibilityState: document.visibilityState,
      timestamp: Date.now()
    })
  }
  
  public setUserId(userId: string) {
    this.userId = userId
  }
  
  public trackCustomEvent(name: string, data: any) {
    this.sendRUMData({
      type: 'custom_event',
      name,
      data,
      timestamp: Date.now()
    })
  }
  
  private sendRUMData(data: any) {
    const rumData = {
      ...data,
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      referrer: document.referrer
    }
    
    // Send to RUM endpoint
    fetch('/api/rum', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rumData)
    }).catch(console.error)
  }
  
  public getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      sessionDuration: Date.now() - this.pageLoadTime,
      interactionCount: this.interactions.length,
      url: window.location.href,
      timestamp: Date.now()
    }
  }
}

// Global RUM instance
export const rum = new RealUserMonitoring()
```

## Integration with Vue Application

```typescript
// src/plugins/monitoring.ts
import type { App } from 'vue'
import { WebVitalsMonitor } from '@/utils/performance-monitor'
import { errorReporter } from '@/utils/error-reporter'
import { analytics } from '@/utils/analytics'
import { logger } from '@/utils/logger'
import { rum } from '@/utils/rum'

export function setupMonitoring(app: App) {
  // Initialize performance monitoring
  const webVitals = new WebVitalsMonitor((metrics) => {
    logger.info('Web Vitals updated', metrics, ['performance'])
  })
  
  // Setup global error handling
  app.config.errorHandler = (error, instance, info) => {
    errorReporter.captureException(error as Error, {
      tags: {
        vue_error_info: info
      },
      extra: {
        componentName: instance?.$options.name || 'Unknown',
        propsData: instance?.$props
      }
    })
  }
  
  // Track route changes
  app.config.globalProperties.$trackRoute = (to: any, from: any) => {
    analytics.trackPageView(to.path, to.meta?.title)
    logger.logRouteChange(from.path, to.path, performance.now())
  }
  
  // Track component usage
  app.config.globalProperties.$trackComponent = (name: string, action: string, props?: any) => {
    analytics.trackComponentUsage(name, action, props)
    logger.logComponentRender(name, performance.now(), props)
  }
  
  // Provide monitoring utilities globally
  app.provide('errorReporter', errorReporter)
  app.provide('analytics', analytics)
  app.provide('logger', logger)
  app.provide('rum', rum)
  
  return {
    webVitals,
    errorReporter,
    analytics,
    logger,
    rum
  }
}
```

This comprehensive monitoring and logging system provides complete visibility into your Element Plus application's performance, errors, and user behavior in production environments.