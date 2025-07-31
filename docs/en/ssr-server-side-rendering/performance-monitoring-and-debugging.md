# Performance Monitoring and Debugging for Element Plus SSR

## Overview

This guide covers comprehensive performance monitoring and debugging strategies for Element Plus applications in server-side rendering environments, including performance metrics collection, real-time monitoring, and advanced debugging techniques.

## Server-Side Performance Monitoring

### Express.js Performance Middleware

```typescript
// src/server/middleware/performance.ts
import { Request, Response, NextFunction } from 'express'
import { performance, PerformanceObserver } from 'perf_hooks'
import { createHash } from 'crypto'

interface PerformanceMetrics {
  requestId: string
  method: string
  url: string
  userAgent: string
  startTime: number
  endTime?: number
  duration?: number
  memoryUsage: NodeJS.MemoryUsage
  renderTime?: number
  hydrationTime?: number
  bundleSize?: number
  cacheHit?: boolean
  statusCode?: number
  errorMessage?: string
}

class SSRPerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private observer: PerformanceObserver
  
  constructor() {
    this.setupPerformanceObserver()
  }
  
  private setupPerformanceObserver() {
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.name.startsWith('ssr-render-')) {
          const requestId = entry.name.replace('ssr-render-', '')
          const metrics = this.metrics.get(requestId)
          
          if (metrics) {
            metrics.renderTime = entry.duration
            this.updateMetrics(requestId, metrics)
          }
        }
      })
    })
    
    this.observer.observe({ entryTypes: ['measure'] })
  }
  
  public startRequest(req: Request): string {
    const requestId = this.generateRequestId(req)
    
    const metrics: PerformanceMetrics = {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent') || 'unknown',
      startTime: performance.now(),
      memoryUsage: process.memoryUsage()
    }
    
    this.metrics.set(requestId, metrics)
    
    // Start performance measurement
    performance.mark(`ssr-start-${requestId}`)
    
    return requestId
  }
  
  public endRequest(requestId: string, res: Response, error?: Error) {
    const metrics = this.metrics.get(requestId)
    if (!metrics) return
    
    // End performance measurement
    performance.mark(`ssr-end-${requestId}`)
    performance.measure(
      `ssr-render-${requestId}`,
      `ssr-start-${requestId}`,
      `ssr-end-${requestId}`
    )
    
    metrics.endTime = performance.now()
    metrics.duration = metrics.endTime - metrics.startTime
    metrics.statusCode = res.statusCode
    
    if (error) {
      metrics.errorMessage = error.message
    }
    
    this.updateMetrics(requestId, metrics)
    this.reportMetrics(metrics)
    
    // Clean up
    setTimeout(() => {
      this.metrics.delete(requestId)
      performance.clearMarks(`ssr-start-${requestId}`)
      performance.clearMarks(`ssr-end-${requestId}`)
      performance.clearMeasures(`ssr-render-${requestId}`)
    }, 60000) // Keep for 1 minute
  }
  
  private generateRequestId(req: Request): string {
    const hash = createHash('md5')
    hash.update(`${Date.now()}-${req.ip}-${Math.random()}`)
    return hash.digest('hex').substring(0, 8)
  }
  
  private updateMetrics(requestId: string, metrics: PerformanceMetrics) {
    this.metrics.set(requestId, metrics)
  }
  
  private reportMetrics(metrics: PerformanceMetrics) {
    // Log performance metrics
    console.log('📊 SSR Performance Metrics:', {
      requestId: metrics.requestId,
      url: metrics.url,
      duration: `${metrics.duration?.toFixed(2)}ms`,
      renderTime: `${metrics.renderTime?.toFixed(2)}ms`,
      memoryUsage: `${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      statusCode: metrics.statusCode
    })
    
    // Send to monitoring service
    this.sendToMonitoring(metrics)
    
    // Check for performance issues
    this.checkPerformanceThresholds(metrics)
  }
  
  private async sendToMonitoring(metrics: PerformanceMetrics) {
    try {
      // Send to external monitoring service (e.g., DataDog, New Relic)
      if (process.env.MONITORING_ENDPOINT) {
        await fetch(process.env.MONITORING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MONITORING_API_KEY}`
          },
          body: JSON.stringify({
            service: 'element-plus-ssr',
            metrics,
            timestamp: Date.now()
          })
        })
      }
    } catch (error) {
      console.error('Failed to send metrics to monitoring service:', error)
    }
  }
  
  private checkPerformanceThresholds(metrics: PerformanceMetrics) {
    const thresholds = {
      duration: 1000, // 1 second
      renderTime: 500, // 500ms
      memoryUsage: 100 * 1024 * 1024 // 100MB
    }
    
    const warnings: string[] = []
    
    if (metrics.duration && metrics.duration > thresholds.duration) {
      warnings.push(`Slow request: ${metrics.duration.toFixed(2)}ms`)
    }
    
    if (metrics.renderTime && metrics.renderTime > thresholds.renderTime) {
      warnings.push(`Slow render: ${metrics.renderTime.toFixed(2)}ms`)
    }
    
    if (metrics.memoryUsage.heapUsed > thresholds.memoryUsage) {
      warnings.push(`High memory usage: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`)
    }
    
    if (warnings.length > 0) {
      console.warn('⚠️ Performance Warning:', {
        requestId: metrics.requestId,
        url: metrics.url,
        warnings
      })
    }
  }
  
  public getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }
  
  public getAverageMetrics(timeWindow: number = 300000): any {
    const now = performance.now()
    const recentMetrics = Array.from(this.metrics.values())
      .filter(m => m.endTime && (now - m.endTime) < timeWindow)
    
    if (recentMetrics.length === 0) {
      return null
    }
    
    const totals = recentMetrics.reduce((acc, metrics) => {
      acc.duration += metrics.duration || 0
      acc.renderTime += metrics.renderTime || 0
      acc.memoryUsage += metrics.memoryUsage.heapUsed
      return acc
    }, { duration: 0, renderTime: 0, memoryUsage: 0 })
    
    return {
      count: recentMetrics.length,
      averageDuration: totals.duration / recentMetrics.length,
      averageRenderTime: totals.renderTime / recentMetrics.length,
      averageMemoryUsage: totals.memoryUsage / recentMetrics.length,
      timeWindow: timeWindow / 1000 // Convert to seconds
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new SSRPerformanceMonitor()

// Express middleware
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = performanceMonitor.startRequest(req)
  
  // Store request ID for later use
  req.requestId = requestId
  
  // Override res.end to capture completion
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any) {
    performanceMonitor.endRequest(requestId, res)
    originalEnd.call(this, chunk, encoding)
  }
  
  // Handle errors
  res.on('error', (error) => {
    performanceMonitor.endRequest(requestId, res, error)
  })
  
  next()
}
```

### Vue SSR Performance Tracking

```typescript
// src/server/ssr-renderer.ts
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
import { performance } from 'perf_hooks'
import { performanceMonitor } from './middleware/performance'

interface RenderContext {
  requestId: string
  url: string
  userAgent: string
  startTime: number
}

class SSRRenderer {
  private renderCache = new Map<string, { html: string, timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes
  
  async renderApp(context: RenderContext): Promise<string> {
    const { requestId, url } = context
    
    try {
      // Check cache first
      const cached = this.getCachedRender(url)
      if (cached) {
        console.log(`📦 Cache hit for ${url}`);
        return cached
      }
      
      // Start render timing
      const renderStart = performance.now()
      performance.mark(`render-start-${requestId}`)
      
      // Create app instance
      const app = await this.createApp(context)
      
      // Render to string
      const html = await renderToString(app)
      
      // End render timing
      performance.mark(`render-end-${requestId}`)
      performance.measure(
        `render-duration-${requestId}`,
        `render-start-${requestId}`,
        `render-end-${requestId}`
      )
      
      const renderTime = performance.now() - renderStart
      
      // Log render performance
      console.log(`🎨 Rendered ${url} in ${renderTime.toFixed(2)}ms`)
      
      // Cache the result
      this.setCachedRender(url, html)
      
      // Clean up performance marks
      setTimeout(() => {
        performance.clearMarks(`render-start-${requestId}`)
        performance.clearMarks(`render-end-${requestId}`)
        performance.clearMeasures(`render-duration-${requestId}`)
      }, 60000)
      
      return html
      
    } catch (error) {
      console.error(`❌ Render error for ${url}:`, error)
      throw error
    }
  }
  
  private async createApp(context: RenderContext) {
    const { createApp } = await import('../main')
    return createApp()
  }
  
  private getCachedRender(url: string): string | null {
    const cached = this.renderCache.get(url)
    
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.html
    }
    
    // Remove expired cache
    if (cached) {
      this.renderCache.delete(url)
    }
    
    return null
  }
  
  private setCachedRender(url: string, html: string) {
    this.renderCache.set(url, {
      html,
      timestamp: Date.now()
    })
    
    // Clean up old cache entries
    this.cleanupCache()
  }
  
  private cleanupCache() {
    const now = Date.now()
    
    for (const [url, cached] of this.renderCache.entries()) {
      if ((now - cached.timestamp) > this.cacheTimeout) {
        this.renderCache.delete(url)
      }
    }
  }
  
  public getCacheStats() {
    return {
      size: this.renderCache.size,
      entries: Array.from(this.renderCache.keys())
    }
  }
  
  public clearCache() {
    this.renderCache.clear()
  }
}

export const ssrRenderer = new SSRRenderer()
```

## Client-Side Performance Monitoring

### Hydration Performance Tracker

```typescript
// src/utils/client-performance.ts
import { App } from 'vue'

interface ClientPerformanceMetrics {
  hydrationStart: number
  hydrationEnd?: number
  hydrationDuration?: number
  firstPaint?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  timeToInteractive?: number
  memoryUsage?: any
  networkInfo?: any
}

class ClientPerformanceMonitor {
  private metrics: ClientPerformanceMetrics
  private observer: PerformanceObserver | null = null
  private vitalsObserver: PerformanceObserver | null = null
  
  constructor() {
    this.metrics = {
      hydrationStart: performance.now()
    }
    
    this.setupPerformanceObserver()
    this.setupWebVitalsObserver()
    this.collectInitialMetrics()
  }
  
  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-paint') {
                this.metrics.firstPaint = entry.startTime
              } else if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime
              }
              break
              
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime
              break
              
            case 'first-input':
              this.metrics.firstInputDelay = entry.processingStart - entry.startTime
              break
          }
        })
      })
      
      try {
        this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }
    }
  }
  
  private setupWebVitalsObserver() {
    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      this.vitalsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        
        this.metrics.cumulativeLayoutShift = clsValue
      })
      
      try {
        this.vitalsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        console.warn('Layout shift observer not supported:', error)
      }
    }
  }
  
  private collectInitialMetrics() {
    // Collect navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      // Calculate Time to Interactive (TTI) approximation
      this.metrics.timeToInteractive = navigation.domInteractive - navigation.navigationStart
    }
    
    // Collect memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory
    }
    
    // Collect network information if available
    if ('connection' in navigator) {
      this.metrics.networkInfo = {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      }
    }
  }
  
  public markHydrationComplete() {
    this.metrics.hydrationEnd = performance.now()
    this.metrics.hydrationDuration = this.metrics.hydrationEnd - this.metrics.hydrationStart
    
    console.log('🚀 Hydration completed in', `${this.metrics.hydrationDuration.toFixed(2)}ms`)
    
    // Report metrics after a short delay to ensure all measurements are captured
    setTimeout(() => {
      this.reportMetrics()
    }, 1000)
  }
  
  private reportMetrics() {
    const report = {
      ...this.metrics,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
    
    // Log to console
    console.log('📊 Client Performance Report:', report)
    
    // Send to analytics
    this.sendToAnalytics(report)
    
    // Store locally for debugging
    localStorage.setItem('performance-metrics', JSON.stringify(report))
  }
  
  private async sendToAnalytics(report: any) {
    try {
      // Send to Google Analytics 4
      if (window.gtag) {
        window.gtag('event', 'performance_metrics', {
          custom_map: {
            hydration_duration: report.hydrationDuration,
            first_contentful_paint: report.firstContentfulPaint,
            largest_contentful_paint: report.largestContentfulPaint,
            cumulative_layout_shift: report.cumulativeLayoutShift
          }
        })
      }
      
      // Send to custom analytics endpoint
      if (process.env.VITE_ANALYTICS_ENDPOINT) {
        await fetch(process.env.VITE_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'client_performance',
            data: report
          })
        })
      }
    } catch (error) {
      console.error('Failed to send performance metrics:', error)
    }
  }
  
  public getMetrics(): ClientPerformanceMetrics {
    return { ...this.metrics }
  }
  
  public destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    
    if (this.vitalsObserver) {
      this.vitalsObserver.disconnect()
    }
  }
}

// Global client performance monitor
export const clientPerformanceMonitor = new ClientPerformanceMonitor()

// Vue plugin for performance monitoring
export const PerformancePlugin = {
  install(app: App) {
    app.config.globalProperties.$performance = clientPerformanceMonitor
    
    // Mark hydration complete when app is mounted
    app.mixin({
      mounted() {
        if (this.$el === document.getElementById('app')) {
          clientPerformanceMonitor.markHydrationComplete()
        }
      }
    })
  }
}
```

## Real-Time Performance Dashboard

### Performance Dashboard Component

```vue
<!-- src/components/PerformanceDashboard.vue -->
<template>
  <div class="performance-dashboard">
    <el-card class="dashboard-header">
      <template #header>
        <div class="header-content">
          <h2>SSR Performance Dashboard</h2>
          <div class="controls">
            <el-switch
              v-model="autoRefresh"
              active-text="Auto Refresh"
              @change="toggleAutoRefresh"
            />
            <el-button @click="refreshData" :loading="loading">
              Refresh
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="metrics-overview">
        <div class="metric-card">
          <div class="metric-value">{{ averageResponseTime }}ms</div>
          <div class="metric-label">Avg Response Time</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{{ averageRenderTime }}ms</div>
          <div class="metric-label">Avg Render Time</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{{ requestsPerMinute }}</div>
          <div class="metric-label">Requests/min</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{{ errorRate }}%</div>
          <div class="metric-label">Error Rate</div>
        </div>
      </div>
    </el-card>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card title="Response Time Trend">
          <div ref="responseTimeChart" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card title="Memory Usage">
          <div ref="memoryChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card title="Recent Requests">
          <el-table
            :data="recentRequests"
            v-loading="loading"
            max-height="400"
          >
            <el-table-column prop="timestamp" label="Time" width="180">
              <template #default="{ row }">
                {{ formatTime(row.timestamp) }}
              </template>
            </el-table-column>
            
            <el-table-column prop="method" label="Method" width="80" />
            
            <el-table-column prop="url" label="URL" min-width="200" />
            
            <el-table-column prop="duration" label="Duration" width="100">
              <template #default="{ row }">
                <span :class="getDurationClass(row.duration)">
                  {{ row.duration?.toFixed(2) }}ms
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="renderTime" label="Render" width="100">
              <template #default="{ row }">
                {{ row.renderTime?.toFixed(2) }}ms
              </template>
            </el-table-column>
            
            <el-table-column prop="statusCode" label="Status" width="80">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.statusCode)">
                  {{ row.statusCode }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="memoryUsage" label="Memory" width="100">
              <template #default="{ row }">
                {{ formatMemory(row.memoryUsage?.heapUsed) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card title="Performance Alerts">
          <div class="alerts-container">
            <div
              v-for="alert in performanceAlerts"
              :key="alert.id"
              class="alert-item"
              :class="`alert-${alert.severity}`"
            >
              <div class="alert-header">
                <span class="alert-title">{{ alert.title }}</span>
                <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
              </div>
              <div class="alert-message">{{ alert.message }}</div>
            </div>
            
            <div v-if="performanceAlerts.length === 0" class="no-alerts">
              ✅ No performance alerts
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card title="System Health">
          <div class="health-indicators">
            <div class="health-item">
              <div class="health-label">CPU Usage</div>
              <el-progress
                :percentage="systemHealth.cpu"
                :color="getHealthColor(systemHealth.cpu)"
              />
            </div>
            
            <div class="health-item">
              <div class="health-label">Memory Usage</div>
              <el-progress
                :percentage="systemHealth.memory"
                :color="getHealthColor(systemHealth.memory)"
              />
            </div>
            
            <div class="health-item">
              <div class="health-label">Response Time</div>
              <el-progress
                :percentage="systemHealth.responseTime"
                :color="getHealthColor(systemHealth.responseTime)"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  ElCard,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElSwitch,
  ElProgress
} from 'element-plus'
import * as echarts from 'echarts'

interface PerformanceData {
  timestamp: number
  method: string
  url: string
  duration?: number
  renderTime?: number
  statusCode?: number
  memoryUsage?: any
  errorMessage?: string
}

interface PerformanceAlert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
}

const loading = ref(false)
const autoRefresh = ref(true)
const refreshInterval = ref<number | null>(null)
const recentRequests = ref<PerformanceData[]>([])
const performanceAlerts = ref<PerformanceAlert[]>([])
const responseTimeChart = ref<HTMLElement>()
const memoryChart = ref<HTMLElement>()

const systemHealth = ref({
  cpu: 45,
  memory: 67,
  responseTime: 23
})

// Computed metrics
const averageResponseTime = computed(() => {
  if (recentRequests.value.length === 0) return 0
  const total = recentRequests.value.reduce((sum, req) => sum + (req.duration || 0), 0)
  return Math.round(total / recentRequests.value.length)
})

const averageRenderTime = computed(() => {
  if (recentRequests.value.length === 0) return 0
  const total = recentRequests.value.reduce((sum, req) => sum + (req.renderTime || 0), 0)
  return Math.round(total / recentRequests.value.length)
})

const requestsPerMinute = computed(() => {
  const oneMinuteAgo = Date.now() - 60000
  return recentRequests.value.filter(req => req.timestamp > oneMinuteAgo).length
})

const errorRate = computed(() => {
  if (recentRequests.value.length === 0) return 0
  const errors = recentRequests.value.filter(req => req.statusCode && req.statusCode >= 400).length
  return Math.round((errors / recentRequests.value.length) * 100)
})

const refreshData = async () => {
  loading.value = true
  
  try {
    // Fetch performance data from API
    const response = await fetch('/api/performance/metrics')
    const data = await response.json()
    
    recentRequests.value = data.requests || []
    performanceAlerts.value = data.alerts || []
    systemHealth.value = data.systemHealth || systemHealth.value
    
    // Update charts
    updateCharts()
    
  } catch (error) {
    console.error('Failed to fetch performance data:', error)
  } finally {
    loading.value = false
  }
}

const toggleAutoRefresh = (enabled: boolean) => {
  if (enabled) {
    refreshInterval.value = setInterval(refreshData, 30000) // Refresh every 30 seconds
  } else {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }
}

const updateCharts = () => {
  updateResponseTimeChart()
  updateMemoryChart()
}

const updateResponseTimeChart = () => {
  if (!responseTimeChart.value) return
  
  const chart = echarts.init(responseTimeChart.value)
  
  const data = recentRequests.value
    .slice(-20) // Last 20 requests
    .map(req => [req.timestamp, req.duration || 0])
  
  const option = {
    title: {
      text: 'Response Time Trend',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0]
        return `Time: ${formatTime(point.data[0])}<br/>Duration: ${point.data[1].toFixed(2)}ms`
      }
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: number) => new Date(value).toLocaleTimeString()
      }
    },
    yAxis: {
      type: 'value',
      name: 'Duration (ms)'
    },
    series: [{
      data,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#409EFF' },
      areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
    }]
  }
  
  chart.setOption(option)
}

const updateMemoryChart = () => {
  if (!memoryChart.value) return
  
  const chart = echarts.init(memoryChart.value)
  
  const data = recentRequests.value
    .slice(-20)
    .map(req => [req.timestamp, req.memoryUsage?.heapUsed ? req.memoryUsage.heapUsed / 1024 / 1024 : 0])
  
  const option = {
    title: {
      text: 'Memory Usage Trend',
      textStyle: { fontSize: 14 }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0]
        return `Time: ${formatTime(point.data[0])}<br/>Memory: ${point.data[1].toFixed(2)}MB`
      }
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: number) => new Date(value).toLocaleTimeString()
      }
    },
    yAxis: {
      type: 'value',
      name: 'Memory (MB)'
    },
    series: [{
      data,
      type: 'line',
      smooth: true,
      lineStyle: { color: '#67C23A' },
      areaStyle: { color: 'rgba(103, 194, 58, 0.1)' }
    }]
  }
  
  chart.setOption(option)
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatMemory = (bytes?: number) => {
  if (!bytes) return 'N/A'
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

const getDurationClass = (duration?: number) => {
  if (!duration) return ''
  if (duration > 1000) return 'duration-slow'
  if (duration > 500) return 'duration-medium'
  return 'duration-fast'
}

const getStatusType = (statusCode?: number) => {
  if (!statusCode) return 'info'
  if (statusCode >= 500) return 'danger'
  if (statusCode >= 400) return 'warning'
  if (statusCode >= 300) return 'info'
  return 'success'
}

const getHealthColor = (percentage: number) => {
  if (percentage > 80) return '#F56C6C'
  if (percentage > 60) return '#E6A23C'
  return '#67C23A'
}

onMounted(() => {
  refreshData()
  toggleAutoRefresh(autoRefresh.value)
  
  // Initialize charts after DOM is ready
  setTimeout(() => {
    updateCharts()
  }, 100)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.performance-dashboard {
  padding: 20px;
}

.dashboard-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h2 {
  margin: 0;
  color: #303133;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metrics-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.metric-card {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.metric-value {
  font-size: 32px;
  font-weight: 600;
  color: #409EFF;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #606266;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.duration-fast {
  color: #67C23A;
}

.duration-medium {
  color: #E6A23C;
}

.duration-slow {
  color: #F56C6C;
}

.alerts-container {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  border-left: 4px solid;
}

.alert-item.alert-low {
  background: #f0f9ff;
  border-left-color: #409EFF;
}

.alert-item.alert-medium {
  background: #fdf6ec;
  border-left-color: #E6A23C;
}

.alert-item.alert-high {
  background: #fef0f0;
  border-left-color: #F56C6C;
}

.alert-item.alert-critical {
  background: #f5f5f5;
  border-left-color: #909399;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.alert-title {
  font-weight: 600;
  font-size: 14px;
}

.alert-time {
  font-size: 12px;
  color: #909399;
}

.alert-message {
  font-size: 13px;
  color: #606266;
}

.no-alerts {
  text-align: center;
  color: #67C23A;
  padding: 40px;
}

.health-indicators {
  space-y: 16px;
}

.health-item {
  margin-bottom: 16px;
}

.health-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}
</style>
```

This comprehensive guide covers performance monitoring and debugging for Element Plus SSR applications, including server-side monitoring, client-side tracking, and real-time dashboard visualization.