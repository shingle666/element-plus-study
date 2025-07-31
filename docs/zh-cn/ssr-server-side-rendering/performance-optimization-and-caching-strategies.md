# 第56天：Element Plus SSR 性能优化与缓存策略

## 学习目标

* 掌握 SSR 性能优化的核心技术和策略
* 学会实现多层次的缓存机制
* 了解 Element Plus 在 SSR 环境下的性能优化方法
* 掌握性能监控和分析技术

## 知识点概览

### 1. SSR 性能优化基础

#### 1.1 性能指标体系

```typescript
// types/performance.ts
export interface SSRPerformanceMetrics {
  // 服务端指标
  server: {
    renderTime: number        // 渲染时间 (ms)
    memoryUsage: number       // 内存使用 (MB)
    cpuUsage: number          // CPU 使用率 (%)
    concurrentRequests: number // 并发请求数
    cacheHitRate: number      // 缓存命中率 (%)
  }
  
  // 客户端指标
  client: {
    ttfb: number             // Time to First Byte (ms)
    fcp: number              // First Contentful Paint (ms)
    lcp: number              // Largest Contentful Paint (ms)
    fid: number              // First Input Delay (ms)
    cls: number              // Cumulative Layout Shift
    hydrationTime: number    // 水合时间 (ms)
  }
  
  // 网络指标
  network: {
    htmlSize: number         // HTML 大小 (KB)
    jsSize: number           // JavaScript 大小 (KB)
    cssSize: number          // CSS 大小 (KB)
    totalSize: number        // 总大小 (KB)
    requestCount: number     // 请求数量
  }
}

// 性能预算配置
export interface PerformanceBudget {
  server: {
    maxRenderTime: 200       // 最大渲染时间
    maxMemoryUsage: 512      // 最大内存使用
    maxCpuUsage: 80          // 最大 CPU 使用率
  }
  
  client: {
    maxTTFB: 600            // 最大 TTFB
    maxFCP: 1500            // 最大 FCP
    maxLCP: 2500            // 最大 LCP
    maxFID: 100             // 最大 FID
    maxCLS: 0.1             // 最大 CLS
  }
  
  network: {
    maxHtmlSize: 50         // 最大 HTML 大小
    maxJsSize: 200          // 最大 JS 大小
    maxCssSize: 50          // 最大 CSS 大小
    maxRequestCount: 10     // 最大请求数
  }
}
```

#### 1.2 性能监控系统

```typescript
// utils/performance-monitor.ts
export class SSRPerformanceMonitor {
  private metrics: SSRPerformanceMetrics[] = []
  private budget: PerformanceBudget
  private observers: Map<string, PerformanceObserver> = new Map()
  
  constructor(budget: PerformanceBudget) {
    this.budget = budget
    this.setupObservers()
  }
  
  // 设置性能观察器
  private setupObservers() {
    if (typeof window === 'undefined') return
    
    // 观察导航时间
    const navObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.entryType === 'navigation') {
          this.recordNavigationMetrics(entry as PerformanceNavigationTiming)
        }
      })
    })
    navObserver.observe({ entryTypes: ['navigation'] })
    this.observers.set('navigation', navObserver)
    
    // 观察绘制时间
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.recordPaintMetrics(entry as PerformancePaintTiming)
      })
    })
    paintObserver.observe({ entryTypes: ['paint'] })
    this.observers.set('paint', paintObserver)
    
    // 观察布局偏移
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.recordLayoutShift(entry as PerformanceEntry)
      })
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('layout-shift', clsObserver)
    
    // 观察长任务
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.recordLongTask(entry as PerformanceEntry)
      })
    })
    longTaskObserver.observe({ entryTypes: ['longtask'] })
    this.observers.set('longtask', longTaskObserver)
  }
  
  // 记录导航指标
  private recordNavigationMetrics(entry: PerformanceNavigationTiming) {
    const metrics: Partial<SSRPerformanceMetrics> = {
      client: {
        ttfb: entry.responseStart - entry.requestStart,
        fcp: 0, // 将在 paint 观察器中设置
        lcp: 0, // 将在 LCP 观察器中设置
        fid: 0, // 将在 FID 观察器中设置
        cls: 0, // 将在 CLS 观察器中设置
        hydrationTime: 0 // 将在水合完成时设置
      },
      network: {
        htmlSize: entry.transferSize / 1024,
        jsSize: 0,
        cssSize: 0,
        totalSize: entry.transferSize / 1024,
        requestCount: 1
      }
    }
    
    this.updateMetrics(metrics)
  }
  
  // 记录绘制指标
  private recordPaintMetrics(entry: PerformancePaintTiming) {
    const metrics: Partial<SSRPerformanceMetrics> = {
      client: {
        fcp: entry.name === 'first-contentful-paint' ? entry.startTime : 0
      }
    }
    
    this.updateMetrics(metrics)
  }
  
  // 记录布局偏移
  private recordLayoutShift(entry: any) {
    if (!entry.hadRecentInput) {
      const metrics: Partial<SSRPerformanceMetrics> = {
        client: {
          cls: (this.getCurrentMetrics()?.client?.cls || 0) + entry.value
        }
      }
      
      this.updateMetrics(metrics)
    }
  }
  
  // 记录长任务
  private recordLongTask(entry: PerformanceEntry) {
    console.warn(`Long task detected: ${entry.duration}ms`, entry)
  }
  
  // 更新指标
  private updateMetrics(newMetrics: Partial<SSRPerformanceMetrics>) {
    const current = this.getCurrentMetrics() || this.createEmptyMetrics()
    const updated = this.mergeMetrics(current, newMetrics)
    
    this.metrics.push(updated)
    this.checkBudget(updated)
  }
  
  // 创建空指标
  private createEmptyMetrics(): SSRPerformanceMetrics {
    return {
      server: {
        renderTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        concurrentRequests: 0,
        cacheHitRate: 0
      },
      client: {
        ttfb: 0,
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        hydrationTime: 0
      },
      network: {
        htmlSize: 0,
        jsSize: 0,
        cssSize: 0,
        totalSize: 0,
        requestCount: 0
      }
    }
  }
  
  // 合并指标
  private mergeMetrics(
    current: SSRPerformanceMetrics, 
    updates: Partial<SSRPerformanceMetrics>
  ): SSRPerformanceMetrics {
    return {
      server: { ...current.server, ...updates.server },
      client: { ...current.client, ...updates.client },
      network: { ...current.network, ...updates.network }
    }
  }
  
  // 获取当前指标
  private getCurrentMetrics(): SSRPerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null
  }
  
  // 检查性能预算
  private checkBudget(metrics: SSRPerformanceMetrics) {
    const violations: string[] = []
    
    // 检查服务端预算
    if (metrics.server.renderTime > this.budget.server.maxRenderTime) {
      violations.push(`Render time exceeded: ${metrics.server.renderTime}ms > ${this.budget.server.maxRenderTime}ms`)
    }
    
    // 检查客户端预算
    if (metrics.client.ttfb > this.budget.client.maxTTFB) {
      violations.push(`TTFB exceeded: ${metrics.client.ttfb}ms > ${this.budget.client.maxTTFB}ms`)
    }
    
    if (metrics.client.fcp > this.budget.client.maxFCP) {
      violations.push(`FCP exceeded: ${metrics.client.fcp}ms > ${this.budget.client.maxFCP}ms`)
    }
    
    if (metrics.client.lcp > this.budget.client.maxLCP) {
      violations.push(`LCP exceeded: ${metrics.client.lcp}ms > ${this.budget.client.maxLCP}ms`)
    }
    
    // 检查网络预算
    if (metrics.network.htmlSize > this.budget.network.maxHtmlSize) {
      violations.push(`HTML size exceeded: ${metrics.network.htmlSize}KB > ${this.budget.network.maxHtmlSize}KB`)
    }
    
    if (violations.length > 0) {
      console.warn('Performance budget violations:', violations)
      this.reportViolations(violations)
    }
  }
  
  // 报告违规
  private reportViolations(violations: string[]) {
    // 发送到监控服务
    if (typeof window !== 'undefined' && window.gtag) {
      violations.forEach(violation => {
        window.gtag('event', 'performance_budget_violation', {
          violation_type: violation.split(':')[0],
          violation_details: violation
        })
      })
    }
  }
  
  // 记录服务端指标
  recordServerMetrics(metrics: Partial<SSRPerformanceMetrics['server']>) {
    const current = this.getCurrentMetrics() || this.createEmptyMetrics()
    const updated = this.mergeMetrics(current, { server: metrics })
    this.metrics.push(updated)
  }
  
  // 记录水合时间
  recordHydrationTime(startTime: number) {
    const hydrationTime = performance.now() - startTime
    const metrics: Partial<SSRPerformanceMetrics> = {
      client: { hydrationTime }
    }
    this.updateMetrics(metrics)
  }
  
  // 获取性能报告
  getPerformanceReport() {
    const latest = this.getCurrentMetrics()
    if (!latest) return null
    
    return {
      metrics: latest,
      budget: this.budget,
      score: this.calculatePerformanceScore(latest),
      recommendations: this.generateRecommendations(latest)
    }
  }
  
  // 计算性能分数
  private calculatePerformanceScore(metrics: SSRPerformanceMetrics): number {
    const scores = {
      ttfb: Math.max(0, 100 - (metrics.client.ttfb / this.budget.client.maxTTFB) * 100),
      fcp: Math.max(0, 100 - (metrics.client.fcp / this.budget.client.maxFCP) * 100),
      lcp: Math.max(0, 100 - (metrics.client.lcp / this.budget.client.maxLCP) * 100),
      cls: Math.max(0, 100 - (metrics.client.cls / this.budget.client.maxCLS) * 100)
    }
    
    return Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
  }
  
  // 生成优化建议
  private generateRecommendations(metrics: SSRPerformanceMetrics): string[] {
    const recommendations: string[] = []
    
    if (metrics.client.ttfb > this.budget.client.maxTTFB) {
      recommendations.push('优化服务器响应时间，考虑使用 CDN 或缓存')
    }
    
    if (metrics.client.fcp > this.budget.client.maxFCP) {
      recommendations.push('优化关键渲染路径，减少阻塞资源')
    }
    
    if (metrics.client.lcp > this.budget.client.maxLCP) {
      recommendations.push('优化最大内容绘制，压缩图片和字体')
    }
    
    if (metrics.client.cls > this.budget.client.maxCLS) {
      recommendations.push('减少布局偏移，为图片和广告预留空间')
    }
    
    if (metrics.network.totalSize > 500) {
      recommendations.push('减少资源大小，启用压缩和代码分割')
    }
    
    return recommendations
  }
  
  // 清理观察器
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
  }
}
```

### 2. 多层次缓存策略

#### 2.1 页面级缓存

```typescript
// server/cache/page-cache.ts
import LRU from 'lru-cache'
import { createHash } from 'crypto'

export class PageCache {
  private cache: LRU<string, CachedPage>
  private config: PageCacheConfig
  
  constructor(config: PageCacheConfig) {
    this.config = config
    this.cache = new LRU({
      max: config.maxPages,
      ttl: config.defaultTTL,
      updateAgeOnGet: true,
      allowStale: false
    })
  }
  
  // 生成缓存键
  private generateCacheKey(url: string, context: CacheContext): string {
    const keyData = {
      url: url.split('?')[0], // 移除查询参数
      locale: context.locale,
      theme: context.theme,
      userAgent: this.normalizeUserAgent(context.userAgent),
      viewport: context.viewport
    }
    
    const keyString = JSON.stringify(keyData)
    return createHash('md5').update(keyString).digest('hex')
  }
  
  // 标准化用户代理
  private normalizeUserAgent(userAgent: string): string {
    // 简化用户代理字符串，只保留主要信息
    if (userAgent.includes('Mobile')) return 'mobile'
    if (userAgent.includes('Tablet')) return 'tablet'
    return 'desktop'
  }
  
  // 检查是否可缓存
  private isCacheable(url: string, context: CacheContext): boolean {
    // 不缓存的条件
    const noCacheConditions = [
      url.includes('/api/'),
      url.includes('/admin/'),
      context.isAuthenticated,
      context.hasPersonalizedContent,
      url.includes('preview=true')
    ]
    
    return !noCacheConditions.some(condition => condition)
  }
  
  // 获取缓存
  async get(url: string, context: CacheContext): Promise<CachedPage | null> {
    if (!this.isCacheable(url, context)) {
      return null
    }
    
    const key = this.generateCacheKey(url, context)
    const cached = this.cache.get(key)
    
    if (cached) {
      // 检查是否需要重新验证
      if (this.needsRevalidation(cached)) {
        return null
      }
      
      // 更新命中统计
      this.updateHitStats(key)
      return cached
    }
    
    return null
  }
  
  // 设置缓存
  async set(
    url: string, 
    context: CacheContext, 
    html: string, 
    metadata: PageMetadata
  ): Promise<void> {
    if (!this.isCacheable(url, context)) {
      return
    }
    
    const key = this.generateCacheKey(url, context)
    const ttl = this.calculateTTL(url, metadata)
    
    const cachedPage: CachedPage = {
      html,
      metadata,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
      etag: this.generateETag(html),
      size: Buffer.byteLength(html, 'utf8')
    }
    
    this.cache.set(key, cachedPage, { ttl })
  }
  
  // 计算 TTL
  private calculateTTL(url: string, metadata: PageMetadata): number {
    // 根据页面类型调整 TTL
    if (url === '/' || url === '/home') {
      return this.config.homepageTTL
    }
    
    if (url.startsWith('/blog/')) {
      return this.config.blogTTL
    }
    
    if (url.startsWith('/product/')) {
      return this.config.productTTL
    }
    
    if (metadata.isStatic) {
      return this.config.staticTTL
    }
    
    return this.config.defaultTTL
  }
  
  // 检查是否需要重新验证
  private needsRevalidation(cached: CachedPage): boolean {
    const now = Date.now()
    const age = now - cached.createdAt
    
    // 如果超过最大年龄，需要重新验证
    if (age > this.config.maxAge) {
      return true
    }
    
    // 如果很少访问且年龄较大，需要重新验证
    if (cached.accessCount < 5 && age > this.config.defaultTTL / 2) {
      return true
    }
    
    return false
  }
  
  // 生成 ETag
  private generateETag(html: string): string {
    return createHash('md5').update(html).digest('hex').substring(0, 16)
  }
  
  // 更新命中统计
  private updateHitStats(key: string) {
    const cached = this.cache.get(key)
    if (cached) {
      cached.lastAccessed = Date.now()
      cached.accessCount++
    }
  }
  
  // 清除缓存
  clear(pattern?: string) {
    if (pattern) {
      // 清除匹配模式的缓存
      const keys = Array.from(this.cache.keys())
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      })
    } else {
      this.cache.clear()
    }
  }
  
  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.calculateMemoryUsage()
    }
  }
  
  // 计算命中率
  private calculateHitRate(): number {
    // 这里需要实现命中率计算逻辑
    return 0.85 // 示例值
  }
  
  // 计算内存使用
  private calculateMemoryUsage(): number {
    let totalSize = 0
    this.cache.forEach(page => {
      totalSize += page.size
    })
    return totalSize / 1024 / 1024 // 转换为 MB
  }
}

// 类型定义
interface PageCacheConfig {
  maxPages: number
  defaultTTL: number
  maxAge: number
  homepageTTL: number
  blogTTL: number
  productTTL: number
  staticTTL: number
}

interface CacheContext {
  locale: string
  theme: string
  userAgent: string
  viewport: string
  isAuthenticated: boolean
  hasPersonalizedContent: boolean
}

interface PageMetadata {
  title: string
  description: string
  isStatic: boolean
  lastModified: number
  dependencies: string[]
}

interface CachedPage {
  html: string
  metadata: PageMetadata
  createdAt: number
  lastAccessed: number
  accessCount: number
  etag: string
  size: number
}
```

#### 2.2 组件级缓存

```typescript
// server/cache/component-cache.ts
export class ComponentCache {
  private cache: Map<string, CachedComponent> = new Map()
  private config: ComponentCacheConfig
  
  constructor(config: ComponentCacheConfig) {
    this.config = config
    this.setupCleanupInterval()
  }
  
  // 设置清理间隔
  private setupCleanupInterval() {
    setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }
  
  // 生成组件缓存键
  private generateComponentKey(
    componentName: string, 
    props: Record<string, any>,
    context: ComponentCacheContext
  ): string {
    const keyData = {
      component: componentName,
      props: this.normalizeProps(props),
      locale: context.locale,
      theme: context.theme
    }
    
    const keyString = JSON.stringify(keyData)
    return createHash('md5').update(keyString).digest('hex')
  }
  
  // 标准化属性
  private normalizeProps(props: Record<string, any>): Record<string, any> {
    const normalized: Record<string, any> = {}
    
    Object.keys(props).sort().forEach(key => {
      const value = props[key]
      
      // 忽略函数和复杂对象
      if (typeof value === 'function') {
        return
      }
      
      if (typeof value === 'object' && value !== null) {
        // 只保留简单对象的序列化
        try {
          normalized[key] = JSON.parse(JSON.stringify(value))
        } catch {
          // 忽略无法序列化的对象
        }
      } else {
        normalized[key] = value
      }
    })
    
    return normalized
  }
  
  // 检查组件是否可缓存
  private isComponentCacheable(
    componentName: string, 
    props: Record<string, any>
  ): boolean {
    // 不可缓存的组件
    const noCacheComponents = [
      'UserProfile',
      'ShoppingCart',
      'LiveChat',
      'RandomContent'
    ]
    
    if (noCacheComponents.includes(componentName)) {
      return false
    }
    
    // 包含动态内容的属性
    const dynamicProps = ['timestamp', 'random', 'userId', 'sessionId']
    const hasDynamicProps = Object.keys(props).some(key => 
      dynamicProps.some(dynamicProp => key.includes(dynamicProp))
    )
    
    return !hasDynamicProps
  }
  
  // 获取组件缓存
  async getComponent(
    componentName: string,
    props: Record<string, any>,
    context: ComponentCacheContext
  ): Promise<string | null> {
    if (!this.isComponentCacheable(componentName, props)) {
      return null
    }
    
    const key = this.generateComponentKey(componentName, props, context)
    const cached = this.cache.get(key)
    
    if (cached && !this.isExpired(cached)) {
      cached.lastAccessed = Date.now()
      cached.accessCount++
      return cached.html
    }
    
    return null
  }
  
  // 设置组件缓存
  async setComponent(
    componentName: string,
    props: Record<string, any>,
    context: ComponentCacheContext,
    html: string
  ): Promise<void> {
    if (!this.isComponentCacheable(componentName, props)) {
      return
    }
    
    const key = this.generateComponentKey(componentName, props, context)
    const ttl = this.getComponentTTL(componentName)
    
    const cached: CachedComponent = {
      html,
      componentName,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      ttl,
      size: Buffer.byteLength(html, 'utf8')
    }
    
    this.cache.set(key, cached)
    
    // 检查缓存大小限制
    this.enforceMemoryLimit()
  }
  
  // 获取组件 TTL
  private getComponentTTL(componentName: string): number {
    const ttlMap: Record<string, number> = {
      'Header': 3600000,      // 1 小时
      'Footer': 3600000,      // 1 小时
      'Navigation': 1800000,  // 30 分钟
      'ProductCard': 600000,  // 10 分钟
      'BlogPost': 1800000,    // 30 分钟
      'StaticContent': 7200000 // 2 小时
    }
    
    return ttlMap[componentName] || this.config.defaultTTL
  }
  
  // 检查是否过期
  private isExpired(cached: CachedComponent): boolean {
    return Date.now() - cached.createdAt > cached.ttl
  }
  
  // 强制内存限制
  private enforceMemoryLimit() {
    let totalSize = 0
    this.cache.forEach(cached => {
      totalSize += cached.size
    })
    
    if (totalSize > this.config.maxMemoryUsage) {
      // 按最后访问时间排序，删除最旧的
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
      
      while (totalSize > this.config.maxMemoryUsage * 0.8 && entries.length > 0) {
        const [key, cached] = entries.shift()!
        this.cache.delete(key)
        totalSize -= cached.size
      }
    }
  }
  
  // 清理过期缓存
  private cleanup() {
    const now = Date.now()
    const toDelete: string[] = []
    
    this.cache.forEach((cached, key) => {
      if (this.isExpired(cached)) {
        toDelete.push(key)
      }
    })
    
    toDelete.forEach(key => {
      this.cache.delete(key)
    })
    
    console.log(`Cleaned up ${toDelete.length} expired component cache entries`)
  }
  
  // 清除特定组件的缓存
  clearComponent(componentName: string) {
    const toDelete: string[] = []
    
    this.cache.forEach((cached, key) => {
      if (cached.componentName === componentName) {
        toDelete.push(key)
      }
    })
    
    toDelete.forEach(key => {
      this.cache.delete(key)
    })
  }
  
  // 获取缓存统计
  getStats() {
    let totalSize = 0
    let totalAccess = 0
    const componentStats: Record<string, number> = {}
    
    this.cache.forEach(cached => {
      totalSize += cached.size
      totalAccess += cached.accessCount
      componentStats[cached.componentName] = 
        (componentStats[cached.componentName] || 0) + 1
    })
    
    return {
      totalEntries: this.cache.size,
      totalSize: totalSize / 1024 / 1024, // MB
      averageAccess: totalAccess / this.cache.size,
      componentStats
    }
  }
}

// 类型定义
interface ComponentCacheConfig {
  defaultTTL: number
  maxMemoryUsage: number
  cleanupInterval: number
}

interface ComponentCacheContext {
  locale: string
  theme: string
}

interface CachedComponent {
  html: string
  componentName: string
  createdAt: number
  lastAccessed: number
  accessCount: number
  ttl: number
  size: number
}
```

#### 2.3 数据缓存层

```typescript
// server/cache/data-cache.ts
import Redis from 'ioredis'

export class DataCache {
  private redis: Redis
  private localCache: Map<string, CachedData> = new Map()
  private config: DataCacheConfig
  
  constructor(config: DataCacheConfig) {
    this.config = config
    this.redis = new Redis(config.redis)
    this.setupLocalCacheCleanup()
  }
  
  // 设置本地缓存清理
  private setupLocalCacheCleanup() {
    setInterval(() => {
      this.cleanupLocalCache()
    }, this.config.localCleanupInterval)
  }
  
  // 获取数据
  async get<T>(key: string): Promise<T | null> {
    // 首先检查本地缓存
    const localData = this.getFromLocalCache<T>(key)
    if (localData !== null) {
      return localData
    }
    
    // 然后检查 Redis 缓存
    try {
      const redisData = await this.getFromRedis<T>(key)
      if (redisData !== null) {
        // 将数据存储到本地缓存
        this.setToLocalCache(key, redisData, this.config.localTTL)
        return redisData
      }
    } catch (error) {
      console.error('Redis get error:', error)
    }
    
    return null
  }
  
  // 设置数据
  async set<T>(
    key: string, 
    data: T, 
    ttl: number = this.config.defaultTTL
  ): Promise<void> {
    // 存储到本地缓存
    this.setToLocalCache(key, data, Math.min(ttl, this.config.localTTL))
    
    // 存储到 Redis
    try {
      await this.setToRedis(key, data, ttl)
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }
  
  // 从本地缓存获取
  private getFromLocalCache<T>(key: string): T | null {
    const cached = this.localCache.get(key)
    if (!cached) {
      return null
    }
    
    if (Date.now() > cached.expiresAt) {
      this.localCache.delete(key)
      return null
    }
    
    cached.lastAccessed = Date.now()
    return cached.data as T
  }
  
  // 设置到本地缓存
  private setToLocalCache<T>(key: string, data: T, ttl: number) {
    const cached: CachedData = {
      data,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      expiresAt: Date.now() + ttl
    }
    
    this.localCache.set(key, cached)
    
    // 检查本地缓存大小
    if (this.localCache.size > this.config.maxLocalEntries) {
      this.evictLocalCache()
    }
  }
  
  // 从 Redis 获取
  private async getFromRedis<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    if (!data) {
      return null
    }
    
    try {
      return JSON.parse(data) as T
    } catch (error) {
      console.error('JSON parse error:', error)
      return null
    }
  }
  
  // 设置到 Redis
  private async setToRedis<T>(key: string, data: T, ttl: number) {
    const serialized = JSON.stringify(data)
    await this.redis.setex(key, Math.floor(ttl / 1000), serialized)
  }
  
  // 驱逐本地缓存
  private evictLocalCache() {
    const entries = Array.from(this.localCache.entries())
    entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed)
    
    // 删除最旧的 25% 条目
    const toDelete = Math.floor(entries.length * 0.25)
    for (let i = 0; i < toDelete; i++) {
      this.localCache.delete(entries[i][0])
    }
  }
  
  // 清理本地缓存
  private cleanupLocalCache() {
    const now = Date.now()
    const toDelete: string[] = []
    
    this.localCache.forEach((cached, key) => {
      if (now > cached.expiresAt) {
        toDelete.push(key)
      }
    })
    
    toDelete.forEach(key => {
      this.localCache.delete(key)
    })
  }
  
  // 删除缓存
  async delete(key: string): Promise<void> {
    this.localCache.delete(key)
    
    try {
      await this.redis.del(key)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }
  
  // 批量删除
  async deletePattern(pattern: string): Promise<void> {
    // 清理本地缓存
    const localKeys = Array.from(this.localCache.keys())
    localKeys.forEach(key => {
      if (key.includes(pattern)) {
        this.localCache.delete(key)
      }
    })
    
    // 清理 Redis 缓存
    try {
      const keys = await this.redis.keys(`*${pattern}*`)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis delete pattern error:', error)
    }
  }
  
  // 获取缓存统计
  async getStats() {
    const localStats = {
      entries: this.localCache.size,
      maxEntries: this.config.maxLocalEntries
    }
    
    let redisStats = {
      entries: 0,
      memory: 0
    }
    
    try {
      const info = await this.redis.info('memory')
      const dbsize = await this.redis.dbsize()
      
      redisStats = {
        entries: dbsize,
        memory: this.parseRedisMemory(info)
      }
    } catch (error) {
      console.error('Redis stats error:', error)
    }
    
    return {
      local: localStats,
      redis: redisStats
    }
  }
  
  // 解析 Redis 内存信息
  private parseRedisMemory(info: string): number {
    const match = info.match(/used_memory:(\d+)/)
    return match ? parseInt(match[1]) / 1024 / 1024 : 0 // MB
  }
}

// 类型定义
interface DataCacheConfig {
  redis: {
    host: string
    port: number
    password?: string
    db?: number
  }
  defaultTTL: number
  localTTL: number
  maxLocalEntries: number
  localCleanupInterval: number
}

interface CachedData {
  data: any
  createdAt: number
  lastAccessed: number
  expiresAt: number
}
```

### 3. Element Plus 特定优化

#### 3.1 组件按需加载优化

```typescript
// utils/element-plus-optimizer.ts
export class ElementPlusOptimizer {
  private loadedComponents: Set<string> = new Set()
  private componentRegistry: Map<string, () => Promise<any>> = new Map()
  
  constructor() {
    this.setupComponentRegistry()
  }
  
  // 设置组件注册表
  private setupComponentRegistry() {
    // 按需注册 Element Plus 组件
    this.componentRegistry.set('ElButton', () => import('element-plus/es/components/button'))
    this.componentRegistry.set('ElInput', () => import('element-plus/es/components/input'))
    this.componentRegistry.set('ElForm', () => import('element-plus/es/components/form'))
    this.componentRegistry.set('ElTable', () => import('element-plus/es/components/table'))
    this.componentRegistry.set('ElDialog', () => import('element-plus/es/components/dialog'))
    this.componentRegistry.set('ElSelect', () => import('element-plus/es/components/select'))
    this.componentRegistry.set('ElDatePicker', () => import('element-plus/es/components/date-picker'))
    this.componentRegistry.set('ElPagination', () => import('element-plus/es/components/pagination'))
    // ... 更多组件
  }
  
  // 预加载关键组件
  async preloadCriticalComponents(): Promise<void> {
    const criticalComponents = [
      'ElButton',
      'ElInput',
      'ElForm',
      'ElMessage'
    ]
    
    const loadPromises = criticalComponents.map(component => 
      this.loadComponent(component)
    )
    
    await Promise.all(loadPromises)
  }
  
  // 加载组件
  async loadComponent(componentName: string): Promise<any> {
    if (this.loadedComponents.has(componentName)) {
      return
    }
    
    const loader = this.componentRegistry.get(componentName)
    if (!loader) {
      console.warn(`Component ${componentName} not found in registry`)
      return
    }
    
    try {
      const component = await loader()
      this.loadedComponents.add(componentName)
      return component
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error)
    }
  }
  
  // 分析页面组件使用情况
  analyzePageComponents(html: string): string[] {
    const componentPattern = /<el-([a-z-]+)/gi
    const matches = html.match(componentPattern) || []
    
    const components = matches.map(match => {
      const componentName = match.replace('<el-', '').replace(/[^a-z-]/gi, '')
      return this.kebabToPascal(`el-${componentName}`)
    })
    
    return [...new Set(components)]
  }
  
  // 转换命名格式
  private kebabToPascal(kebab: string): string {
    return kebab
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
  
  // 生成组件加载脚本
  generateLoadScript(components: string[]): string {
    const loadStatements = components
      .filter(component => this.componentRegistry.has(component))
      .map(component => `import('element-plus/es/components/${this.pascalToKebab(component.replace('El', ''))}')`)
    
    return `
      Promise.all([
        ${loadStatements.join(',\n        ')}
      ]).then(() => {
        console.log('Element Plus components loaded');
      });
    `
  }
  
  // 转换命名格式
  private pascalToKebab(pascal: string): string {
    return pascal.replace(/([A-Z])/g, '-$1').toLowerCase().slice(1)
  }
  
  // 获取加载统计
  getLoadStats() {
    return {
      totalRegistered: this.componentRegistry.size,
      totalLoaded: this.loadedComponents.size,
      loadedComponents: Array.from(this.loadedComponents),
      loadRate: this.loadedComponents.size / this.componentRegistry.size
    }
  }
}
```

#### 3.2 样式优化

```typescript
// utils/style-optimizer.ts
export class StyleOptimizer {
  private criticalCSS: string = ''
  private nonCriticalCSS: string = ''
  
  // 提取关键 CSS
  async extractCriticalCSS(html: string, fullCSS: string): Promise<string> {
    // 分析 HTML 中使用的 Element Plus 组件
    const usedComponents = this.analyzeUsedComponents(html)
    
    // 提取关键样式
    const criticalRules = this.extractComponentStyles(fullCSS, usedComponents)
    
    // 添加基础样式
    const baseStyles = this.extractBaseStyles(fullCSS)
    
    return baseStyles + criticalRules
  }
  
  // 分析使用的组件
  private analyzeUsedComponents(html: string): string[] {
    const componentClasses = new Set<string>()
    
    // Element Plus 组件类名模式
    const classPatterns = [
      /el-button[\w-]*/g,
      /el-input[\w-]*/g,
      /el-form[\w-]*/g,
      /el-table[\w-]*/g,
      /el-dialog[\w-]*/g,
      /el-select[\w-]*/g,
      /el-date-picker[\w-]*/g,
      /el-pagination[\w-]*/g
    ]
    
    classPatterns.forEach(pattern => {
      const matches = html.match(pattern) || []
      matches.forEach(match => componentClasses.add(match))
    })
    
    return Array.from(componentClasses)
  }
  
  // 提取组件样式
  private extractComponentStyles(css: string, components: string[]): string {
    const rules: string[] = []
    
    components.forEach(component => {
      // 提取组件相关的 CSS 规则
      const componentRules = this.extractRulesForComponent(css, component)
      rules.push(...componentRules)
    })
    
    return rules.join('\n')
  }
  
  // 提取特定组件的规则
  private extractRulesForComponent(css: string, component: string): string[] {
    const rules: string[] = []
    const rulePattern = new RegExp(`\\.[^{]*${component}[^{]*\\{[^}]*\\}`, 'g')
    
    const matches = css.match(rulePattern) || []
    rules.push(...matches)
    
    return rules
  }
  
  // 提取基础样式
  private extractBaseStyles(css: string): string {
    const baseSelectors = [
      ':root',
      'html',
      'body',
      '*',
      '*::before',
      '*::after'
    ]
    
    const rules: string[] = []
    
    baseSelectors.forEach(selector => {
      const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]*\\}`, 'g')
      const matches = css.match(pattern) || []
      rules.push(...matches)
    })
    
    return rules.join('\n')
  }
  
  // 生成内联关键 CSS
  generateInlineCriticalCSS(criticalCSS: string): string {
    return `<style>${this.minifyCSS(criticalCSS)}</style>`
  }
  
  // 生成非关键 CSS 加载脚本
  generateNonCriticalCSSLoader(cssUrl: string): string {
    return `
      <script>
        (function() {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '${cssUrl}';
          link.media = 'print';
          link.onload = function() {
            this.media = 'all';
          };
          document.head.appendChild(link);
        })();
      </script>
    `
  }
  
  // 压缩 CSS
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
      .replace(/\s+/g, ' ')            // 压缩空白
      .replace(/;\s*}/g, '}')         // 移除最后的分号
      .replace(/\s*{\s*/g, '{')       // 压缩大括号
      .replace(/;\s*/g, ';')          // 压缩分号
      .trim()
  }
  
  // 分析 CSS 使用情况
  analyzeCSSUsage(html: string, css: string) {
    const allRules = this.extractAllRules(css)
    const usedRules = allRules.filter(rule => 
      this.isRuleUsed(rule, html)
    )
    
    return {
      totalRules: allRules.length,
      usedRules: usedRules.length,
      unusedRules: allRules.length - usedRules.length,
      usageRate: usedRules.length / allRules.length,
      potentialSavings: this.calculateSavings(allRules, usedRules)
    }
  }
  
  // 提取所有规则
  private extractAllRules(css: string): string[] {
    const rulePattern = /[^{}]+\{[^}]*\}/g
    return css.match(rulePattern) || []
  }
  
  // 检查规则是否被使用
  private isRuleUsed(rule: string, html: string): boolean {
    const selectorMatch = rule.match(/^([^{]+)/)
    if (!selectorMatch) return false
    
    const selector = selectorMatch[1].trim()
    
    // 简化的选择器检查
    if (selector.startsWith('.')) {
      const className = selector.substring(1).split(/[\s:>+~]/)[0]
      return html.includes(className)
    }
    
    if (selector.startsWith('#')) {
      const id = selector.substring(1).split(/[\s:>+~]/)[0]
      return html.includes(`id="${id}"`)
    }
    
    // 元素选择器
    const element = selector.split(/[\s:>+~]/)[0]
    return html.includes(`<${element}`)
  }
  
  // 计算潜在节省
  private calculateSavings(allRules: string[], usedRules: string[]): number {
    const totalSize = allRules.join('').length
    const usedSize = usedRules.join('').length
    return totalSize - usedSize
  }
}
```

## 4. 实践练习

1. **性能监控实践**：
   - 集成性能监控系统
   - 设置性能预算和告警
   - 分析性能瓶颈

2. **缓存策略实践**：
   - 实现多层次缓存
   - 测试缓存效果
   - 优化缓存策略

3. **Element Plus 优化实践**：
   - 实现按需加载
   - 优化样式加载
   - 测试优化效果

## 5. 学习资源

- [Web Performance Optimization](https://web.dev/performance/)
- [Vue.js Performance Guide](https://cn.vuejs.org/guide/best-practices/performance.html)
- [Element Plus Performance Tips](https://element-plus.org/zh-CN/guide/performance.html)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)

## 6. 作业

- 实现完整的 SSR 性能监控系统
- 设计和实现多层次缓存架构
- 优化 Element Plus 组件的加载性能
- 创建性能优化最佳实践文档

## 总结

通过第56天的学习，我们深入掌握了：

1. **性能监控**：建立了完整的 SSR 性能指标体系和监控系统
2. **缓存策略**：实现了页面级、组件级和数据级的多层次缓存
3. **Element Plus 优化**：掌握了组件按需加载和样式优化技术
4. **性能分析**：学会了性能瓶颈分析和优化方法

这些技能将帮助我们构建高性能、可扩展的 SSR 应用。