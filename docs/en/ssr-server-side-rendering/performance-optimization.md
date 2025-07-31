# SSR Performance Optimization with Element Plus

## Overview

Optimizing Server-Side Rendering (SSR) performance is crucial for delivering fast, responsive applications. This guide covers comprehensive strategies for optimizing Element Plus SSR applications, from server-side optimizations to client-side hydration improvements.

## Performance Metrics and Monitoring

### Key SSR Performance Metrics

1. **Time to First Byte (TTFB)**: Server response time
2. **First Contentful Paint (FCP)**: When content first appears
3. **Largest Contentful Paint (LCP)**: When main content loads
4. **Time to Interactive (TTI)**: When page becomes interactive
5. **Hydration Time**: Time to complete client-side hydration
6. **Cumulative Layout Shift (CLS)**: Visual stability

### Performance Monitoring Setup

```javascript
// utils/performance.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.setupObservers()
  }
  
  setupObservers() {
    if (typeof window === 'undefined') return
    
    // Core Web Vitals
    this.observeWebVitals()
    
    // Custom SSR metrics
    this.observeSSRMetrics()
    
    // Resource timing
    this.observeResourceTiming()
  }
  
  observeWebVitals() {
    // LCP Observer
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('LCP', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    
    // FCP Observer
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        this.recordMetric('FCP', fcpEntry.startTime)
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })
    
    // CLS Observer
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.recordMetric('CLS', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
  }
  
  observeSSRMetrics() {
    // Hydration timing
    const hydrationStart = performance.mark('hydration-start')
    
    // Listen for hydration complete
    window.addEventListener('app:hydrated', () => {
      performance.mark('hydration-end')
      performance.measure('hydration-duration', 'hydration-start', 'hydration-end')
      
      const measure = performance.getEntriesByName('hydration-duration')[0]
      this.recordMetric('Hydration', measure.duration)
    })
  }
  
  observeResourceTiming() {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('element-plus')) {
          this.recordMetric(`Resource-${entry.name}`, entry.duration)
        }
      }
    })
    resourceObserver.observe({ entryTypes: ['resource'] })
  }
  
  recordMetric(name, value) {
    this.metrics.set(name, {
      value,
      timestamp: Date.now(),
      url: window.location.href
    })
    
    // Send to analytics
    this.sendToAnalytics(name, value)
  }
  
  sendToAnalytics(name, value) {
    // Send to your analytics service
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_parameter: window.location.pathname
      })
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  window.performanceMonitor = new PerformanceMonitor()
}
```

## Server-Side Optimizations

### Caching Strategies

#### Page-Level Caching

```javascript
// server/cache.js
import Redis from 'ioredis'
import LRU from 'lru-cache'

class CacheManager {
  constructor() {
    // Redis for distributed caching
    this.redis = new Redis(process.env.REDIS_URL)
    
    // LRU for in-memory caching
    this.memoryCache = new LRU({
      max: 1000,
      ttl: 1000 * 60 * 5 // 5 minutes
    })
  }
  
  async get(key) {
    // Try memory cache first
    let value = this.memoryCache.get(key)
    if (value) return value
    
    // Try Redis cache
    value = await this.redis.get(key)
    if (value) {
      const parsed = JSON.parse(value)
      this.memoryCache.set(key, parsed)
      return parsed
    }
    
    return null
  }
  
  async set(key, value, ttl = 300) {
    // Set in memory cache
    this.memoryCache.set(key, value)
    
    // Set in Redis with TTL
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }
  
  generateCacheKey(req) {
    const { url, headers } = req
    const userAgent = headers['user-agent'] || ''
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent)
    
    return `page:${url}:${isMobile ? 'mobile' : 'desktop'}`
  }
  
  shouldCache(req) {
    // Don't cache authenticated requests
    if (req.headers.authorization || req.headers.cookie?.includes('auth')) {
      return false
    }
    
    // Don't cache POST requests
    if (req.method !== 'GET') {
      return false
    }
    
    // Don't cache admin pages
    if (req.url.startsWith('/admin')) {
      return false
    }
    
    return true
  }
}

export const cacheManager = new CacheManager()

// Express middleware for page caching
export const pageCacheMiddleware = async (req, res, next) => {
  if (!cacheManager.shouldCache(req)) {
    return next()
  }
  
  const cacheKey = cacheManager.generateCacheKey(req)
  const cached = await cacheManager.get(cacheKey)
  
  if (cached) {
    res.set({
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=300',
      'X-Cache': 'HIT'
    })
    return res.send(cached.html)
  }
  
  // Store original send method
  const originalSend = res.send
  
  // Override send to cache response
  res.send = function(html) {
    if (res.statusCode === 200 && typeof html === 'string') {
      cacheManager.set(cacheKey, { html }, 300)
    }
    
    res.set('X-Cache', 'MISS')
    return originalSend.call(this, html)
  }
  
  next()
}
```

#### Component-Level Caching

```javascript
// server/componentCache.js
class ComponentCache {
  constructor() {
    this.cache = new Map()
    this.maxSize = 10000
    this.ttl = 1000 * 60 * 10 // 10 minutes
  }
  
  generateKey(component, props) {
    return `${component}:${JSON.stringify(props)}`
  }
  
  get(component, props) {
    const key = this.generateKey(component, props)
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.html
    }
    
    if (cached) {
      this.cache.delete(key)
    }
    
    return null
  }
  
  set(component, props, html) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries())
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
      
      for (let i = 0; i < Math.floor(this.maxSize * 0.1); i++) {
        this.cache.delete(entries[i][0])
      }
    }
    
    const key = this.generateKey(component, props)
    this.cache.set(key, {
      html,
      timestamp: Date.now()
    })
  }
}

export const componentCache = new ComponentCache()

// Vue component caching mixin
export const cacheable = {
  beforeCreate() {
    if (this.$isServer && this.$options.cache) {
      const cached = componentCache.get(
        this.$options.name,
        this.$props
      )
      
      if (cached) {
        this.$ssrContext.cached = true
        return cached
      }
    }
  },
  
  created() {
    if (this.$isServer && this.$options.cache && !this.$ssrContext.cached) {
      const originalRender = this.$options.render
      
      this.$options.render = function(h) {
        const result = originalRender.call(this, h)
        
        // Cache the rendered result
        if (result && typeof result === 'string') {
          componentCache.set(
            this.$options.name,
            this.$props,
            result
          )
        }
        
        return result
      }
    }
  }
}
```

### Streaming SSR

```javascript
// server/streaming.js
import { renderToNodeStream } from 'vue/server-renderer'
import { Transform } from 'stream'

class SSRStream extends Transform {
  constructor(options = {}) {
    super({ objectMode: true })
    this.template = options.template
    this.context = options.context
    this.headerSent = false
  }
  
  _transform(chunk, encoding, callback) {
    if (!this.headerSent) {
      // Send HTML head immediately
      const head = this.template.split('<!--ssr-outlet-->')[0]
      this.push(head)
      this.headerSent = true
    }
    
    // Stream the chunk
    this.push(chunk)
    callback()
  }
  
  _flush(callback) {
    // Send closing HTML
    const tail = this.template.split('<!--ssr-outlet-->')[1]
    this.push(tail)
    callback()
  }
}

export const streamingSSR = async (req, res, app, template) => {
  try {
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Transfer-Encoding', 'chunked')
    
    // Create streaming renderer
    const stream = renderToNodeStream(app)
    const ssrStream = new SSRStream({ template })
    
    // Handle stream errors
    stream.on('error', (error) => {
      console.error('SSR Stream Error:', error)
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error')
      }
    })
    
    // Pipe the stream
    stream.pipe(ssrStream).pipe(res)
    
  } catch (error) {
    console.error('Streaming SSR Error:', error)
    res.status(500).send('Internal Server Error')
  }
}
```

### Resource Optimization

#### Bundle Splitting

```javascript
// vite.config.js - Advanced bundle splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vue-vendor': ['vue', 'vue-router'],
          'element-plus': ['element-plus'],
          'element-icons': ['@element-plus/icons-vue'],
          
          // Feature-based chunks
          'charts': ['echarts', 'vue-echarts'],
          'forms': ['async-validator', 'normalize-wheel-es'],
          'utils': ['lodash-es', 'dayjs'],
          
          // Route-based chunks
          'admin': [
            './src/pages/admin/index.vue',
            './src/pages/admin/users.vue',
            './src/pages/admin/settings.vue'
          ],
          'dashboard': [
            './src/pages/dashboard/index.vue',
            './src/pages/dashboard/analytics.vue'
          ]
        },
        
        // Optimize chunk loading
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const name = facadeModuleId.split('/').pop().replace('.vue', '')
            return `chunks/${name}-[hash].js`
          }
          return 'chunks/[name]-[hash].js'
        }
      }
    },
    
    // Enable tree shaking
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    }
  }
})
```

#### CSS Optimization

```javascript
// vite.config.js - CSS optimization
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Optimize SCSS compilation
        additionalData: `
          @use "sass:math";
          @import "~/assets/scss/variables.scss";
        `
      }
    },
    
    // PostCSS optimization
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true },
            normalizeWhitespace: true,
            minifySelectors: true
          }]
        })
      ]
    }
  },
  
  // Extract CSS
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash].css'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

## Client-Side Optimizations

### Hydration Optimization

```javascript
// utils/hydration.js
export class HydrationOptimizer {
  constructor() {
    this.hydrationQueue = []
    this.isHydrating = false
    this.priorityComponents = new Set([
      'ElButton',
      'ElInput',
      'ElForm',
      'ElDialog'
    ])
  }
  
  scheduleHydration(component, priority = 'normal') {
    this.hydrationQueue.push({ component, priority })
    
    if (!this.isHydrating) {
      this.processQueue()
    }
  }
  
  async processQueue() {
    this.isHydrating = true
    
    // Sort by priority
    this.hydrationQueue.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1
      if (a.priority !== 'high' && b.priority === 'high') return 1
      return 0
    })
    
    // Process in chunks to avoid blocking
    while (this.hydrationQueue.length > 0) {
      const chunk = this.hydrationQueue.splice(0, 5)
      
      await Promise.all(
        chunk.map(({ component }) => this.hydrateComponent(component))
      )
      
      // Yield to browser
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    this.isHydrating = false
    
    // Emit hydration complete event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:hydrated'))
    }
  }
  
  async hydrateComponent(component) {
    return new Promise((resolve) => {
      // Use requestIdleCallback if available
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          component.hydrate()
          resolve()
        })
      } else {
        setTimeout(() => {
          component.hydrate()
          resolve()
        }, 0)
      }
    })
  }
  
  isPriorityComponent(componentName) {
    return this.priorityComponents.has(componentName)
  }
}

export const hydrationOptimizer = new HydrationOptimizer()
```

### Progressive Hydration

```vue
<!-- components/ProgressiveHydration.vue -->
<template>
  <div ref="container">
    <slot v-if="isHydrated" />
    <div v-else v-html="ssrContent" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  when: {
    type: String,
    default: 'visible', // 'visible', 'idle', 'interaction', 'immediate'
    validator: (value) => ['visible', 'idle', 'interaction', 'immediate'].includes(value)
  },
  rootMargin: {
    type: String,
    default: '0px'
  }
})

const container = ref(null)
const isHydrated = ref(false)
const ssrContent = ref('')

// Store SSR content before hydration
if (typeof window !== 'undefined' && container.value) {
  ssrContent.value = container.value.innerHTML
}

const hydrate = async () => {
  if (isHydrated.value) return
  
  // Mark as hydrating
  isHydrated.value = true
  
  // Wait for next tick to ensure DOM updates
  await nextTick()
  
  // Emit hydration event
  container.value?.dispatchEvent(new CustomEvent('component:hydrated'))
}

const setupHydrationTrigger = () => {
  switch (props.when) {
    case 'immediate':
      hydrate()
      break
      
    case 'visible':
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              hydrate()
              observer.disconnect()
            }
          },
          { rootMargin: props.rootMargin }
        )
        observer.observe(container.value)
      } else {
        hydrate() // Fallback for older browsers
      }
      break
      
    case 'idle':
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(hydrate)
      } else {
        setTimeout(hydrate, 100)
      }
      break
      
    case 'interaction':
      const events = ['click', 'keydown', 'touchstart', 'mouseover']
      const handleInteraction = () => {
        hydrate()
        events.forEach(event => {
          container.value?.removeEventListener(event, handleInteraction)
        })
      }
      
      events.forEach(event => {
        container.value?.addEventListener(event, handleInteraction, { once: true })
      })
      break
  }
}

onMounted(() => {
  setupHydrationTrigger()
})
</script>
```

### Lazy Loading Components

```javascript
// utils/lazyComponents.js
export const createLazyComponent = (importFn, options = {}) => {
  const {
    loading: LoadingComponent,
    error: ErrorComponent,
    delay = 200,
    timeout = 10000
  } = options
  
  return defineAsyncComponent({
    loader: importFn,
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay,
    timeout,
    
    onError(error, retry, fail, attempts) {
      if (attempts <= 3) {
        // Retry up to 3 times
        setTimeout(retry, 1000 * attempts)
      } else {
        fail()
      }
    }
  })
}

// Pre-defined lazy components
export const LazyDataTable = createLazyComponent(
  () => import('../components/DataTable.vue'),
  {
    loading: () => h('div', { class: 'loading-skeleton' }, 'Loading table...'),
    error: () => h('div', { class: 'error-message' }, 'Failed to load table')
  }
)

export const LazyChart = createLazyComponent(
  () => import('../components/Chart.vue'),
  {
    loading: () => h('el-skeleton', { rows: 5, animated: true }),
    error: () => h('el-alert', {
      title: 'Chart Loading Error',
      type: 'error',
      'show-icon': true
    })
  }
)

export const LazyRichEditor = createLazyComponent(
  () => import('../components/RichEditor.vue'),
  {
    loading: () => h('el-skeleton', { rows: 10, animated: true }),
    delay: 500 // Delay loading for better UX
  }
)
```

### Image Optimization

```vue
<!-- components/OptimizedImage.vue -->
<template>
  <div class="optimized-image" :class="{ loaded: isLoaded }">
    <img
      v-if="shouldLoad"
      :src="optimizedSrc"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      @load="handleLoad"
      @error="handleError"
      class="main-image"
    />
    
    <!-- Placeholder -->
    <div v-if="!isLoaded" class="placeholder">
      <el-skeleton v-if="showSkeleton" animated />
      <div v-else class="placeholder-color" :style="placeholderStyle" />
    </div>
    
    <!-- Low quality placeholder -->
    <img
      v-if="lqip && !isLoaded"
      :src="lqip"
      :alt="alt"
      class="lqip"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: [Number, String] },
  height: { type: [Number, String] },
  quality: { type: Number, default: 80 },
  format: { type: String, default: 'webp' },
  loading: { type: String, default: 'lazy' },
  decoding: { type: String, default: 'async' },
  lqip: { type: String }, // Low Quality Image Placeholder
  placeholder: { type: String, default: '#f0f0f0' },
  showSkeleton: { type: Boolean, default: false },
  lazy: { type: Boolean, default: true }
})

const isLoaded = ref(false)
const shouldLoad = ref(!props.lazy)
const observer = ref(null)
const imageRef = ref(null)

const optimizedSrc = computed(() => {
  if (!props.src) return ''
  
  // Build optimized image URL
  const url = new URL(props.src, window.location.origin)
  
  if (props.width) url.searchParams.set('w', props.width.toString())
  if (props.height) url.searchParams.set('h', props.height.toString())
  if (props.quality) url.searchParams.set('q', props.quality.toString())
  if (props.format) url.searchParams.set('f', props.format)
  
  return url.toString()
})

const placeholderStyle = computed(() => ({
  backgroundColor: props.placeholder,
  width: props.width ? `${props.width}px` : '100%',
  height: props.height ? `${props.height}px` : '200px'
}))

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  console.error('Failed to load image:', props.src)
}

const setupIntersectionObserver = () => {
  if (!props.lazy || typeof window === 'undefined') return
  
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        shouldLoad.value = true
        observer.value?.disconnect()
      }
    },
    { rootMargin: '50px' }
  )
  
  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
}

onMounted(() => {
  if (props.lazy) {
    setupIntersectionObserver()
  } else {
    shouldLoad.value = true
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.optimized-image {
  position: relative;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-color {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.lqip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(5px);
  transition: opacity 0.3s ease;
}

.loaded .lqip {
  opacity: 0;
}

.loaded .placeholder {
  opacity: 0;
}
</style>
```

## Advanced Optimization Techniques

### Service Worker for Caching

```javascript
// public/sw.js
const CACHE_NAME = 'element-plus-app-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/css/app.css',
  '/js/app.js',
  '/fonts/element-icons.woff2'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map(name => caches.delete(name))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }
  
  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }
  
  // Handle pages
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidate(request))
    return
  }
  
  // Default: network first
  event.respondWith(networkFirst(request))
})

// Cache strategies
async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached || fetch(request)
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(DYNAMIC_CACHE)
    cache.put(request, response.clone())
    return response
  } catch (error) {
    return caches.match(request)
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then(response => {
    cache.put(request, response.clone())
    return response
  })
  
  return cached || fetchPromise
}
```

### Critical CSS Extraction

```javascript
// build/critical-css.js
import { PurgeCSS } from 'purgecss'
import critical from 'critical'
import fs from 'fs/promises'
import path from 'path'

export async function extractCriticalCSS() {
  const routes = [
    '/',
    '/about',
    '/contact',
    '/dashboard'
  ]
  
  for (const route of routes) {
    try {
      const { css } = await critical.generate({
        base: 'dist/',
        src: `index.html`,
        target: {
          css: `critical${route.replace('/', '-') || '-home'}.css`,
          html: `optimized${route.replace('/', '-') || '-home'}.html`
        },
        width: 1300,
        height: 900,
        minify: true,
        extract: true,
        inlineImages: true
      })
      
      console.log(`Critical CSS extracted for ${route}`)
    } catch (error) {
      console.error(`Failed to extract critical CSS for ${route}:`, error)
    }
  }
}

export async function purgeUnusedCSS() {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: [
      'dist/**/*.html',
      'dist/**/*.js'
    ],
    css: ['dist/**/*.css'],
    safelist: {
      standard: [
        /^el-/,
        /^is-/,
        /^has-/,
        'active',
        'disabled',
        'loading'
      ],
      deep: [
        /^el-.*__/,
        /^el-.*--/
      ]
    }
  })
  
  for (const result of purgeCSSResult) {
    await fs.writeFile(result.file, result.css)
  }
  
  console.log('Unused CSS purged')
}
```

## Performance Testing

### Automated Performance Testing

```javascript
// tests/performance.test.js
import { test, expect } from '@playwright/test'
import { injectSpeedInsights } from '@vercel/speed-insights'

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to page
    await page.goto('/')
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const metrics = {}
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.LCP = entry.startTime
            }
            if (entry.entryType === 'first-input') {
              metrics.FID = entry.processingStart - entry.startTime
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.CLS = (metrics.CLS || 0) + entry.value
            }
          })
          
          resolve(metrics)
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
        
        // Timeout after 10 seconds
        setTimeout(() => resolve({}), 10000)
      })
    })
    
    // Assert Core Web Vitals thresholds
    if (metrics.LCP) expect(metrics.LCP).toBeLessThan(2500) // Good LCP < 2.5s
    if (metrics.FID) expect(metrics.FID).toBeLessThan(100)  // Good FID < 100ms
    if (metrics.CLS) expect(metrics.CLS).toBeLessThan(0.1)  // Good CLS < 0.1
  })
  
  test('should load within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Assert load time budget
    expect(loadTime).toBeLessThan(3000) // 3 seconds
  })
  
  test('should have optimal bundle sizes', async ({ page }) => {
    const response = await page.goto('/')
    const html = await response.text()
    
    // Extract script and CSS links
    const scripts = html.match(/<script[^>]*src="([^"]*)"/g) || []
    const styles = html.match(/<link[^>]*href="([^"]*\.css)"/g) || []
    
    let totalJSSize = 0
    let totalCSSSize = 0
    
    // Measure JS bundle sizes
    for (const script of scripts) {
      const src = script.match(/src="([^"]*)"/)?.[1]
      if (src && !src.startsWith('http')) {
        const response = await page.request.get(src)
        totalJSSize += (await response.body()).length
      }
    }
    
    // Measure CSS bundle sizes
    for (const style of styles) {
      const href = style.match(/href="([^"]*)"/)?.[1]
      if (href && !href.startsWith('http')) {
        const response = await page.request.get(href)
        totalCSSSize += (await response.body()).length
      }
    }
    
    // Assert bundle size budgets
    expect(totalJSSize).toBeLessThan(500 * 1024)  // 500KB JS budget
    expect(totalCSSSize).toBeLessThan(100 * 1024) // 100KB CSS budget
  })
})
```

## Monitoring and Analytics

### Real User Monitoring (RUM)

```javascript
// utils/rum.js
class RealUserMonitoring {
  constructor(config = {}) {
    this.config = {
      endpoint: '/api/metrics',
      sampleRate: 0.1, // 10% sampling
      ...config
    }
    
    this.metrics = new Map()
    this.init()
  }
  
  init() {
    if (typeof window === 'undefined') return
    
    // Sample users based on rate
    if (Math.random() > this.config.sampleRate) return
    
    this.observePerformance()
    this.observeErrors()
    this.observeUserInteractions()
    
    // Send metrics on page unload
    window.addEventListener('beforeunload', () => {
      this.sendMetrics()
    })
    
    // Send metrics periodically
    setInterval(() => {
      this.sendMetrics()
    }, 30000) // Every 30 seconds
  }
  
  observePerformance() {
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      this.recordMetric('TTFB', navigation.responseStart - navigation.requestStart)
      this.recordMetric('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.navigationStart)
      this.recordMetric('LoadComplete', navigation.loadEventEnd - navigation.navigationStart)
    }
    
    // Core Web Vitals
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.recordMetric('LCP', entry.startTime)
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })
    
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FID', entry.processingStart - entry.startTime)
      }
    }).observe({ entryTypes: ['first-input'] })
    
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.recordMetric('CLS', clsValue)
        }
      }
    }).observe({ entryTypes: ['layout-shift'] })
  }
  
  observeErrors() {
    window.addEventListener('error', (event) => {
      this.recordError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack
      })
    })
  }
  
  observeUserInteractions() {
    let interactionCount = 0
    
    ['click', 'keydown', 'scroll'].forEach(eventType => {
      window.addEventListener(eventType, () => {
        interactionCount++
        this.recordMetric('Interactions', interactionCount)
      }, { passive: true })
    })
  }
  
  recordMetric(name, value) {
    this.metrics.set(name, {
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: navigator.connection?.effectiveType
    })
  }
  
  recordError(error) {
    this.metrics.set(`Error-${Date.now()}`, {
      ...error,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    })
  }
  
  async sendMetrics() {
    if (this.metrics.size === 0) return
    
    const data = Object.fromEntries(this.metrics)
    
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: data,
          session: this.getSessionId(),
          timestamp: Date.now()
        })
      })
      
      this.metrics.clear()
    } catch (error) {
      console.error('Failed to send metrics:', error)
    }
  }
  
  getSessionId() {
    let sessionId = sessionStorage.getItem('rum-session-id')
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('rum-session-id', sessionId)
    }
    return sessionId
  }
}

// Initialize RUM
if (typeof window !== 'undefined') {
  new RealUserMonitoring({
    endpoint: '/api/rum',
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
  })
}
```

## Best Practices Summary

### Server-Side

1. **Implement Multi-Level Caching**: Page, component, and data caching
2. **Use Streaming SSR**: Improve TTFB with streaming responses
3. **Optimize Bundle Splitting**: Strategic code splitting for optimal loading
4. **Enable Compression**: Gzip/Brotli compression for all assets
5. **CDN Integration**: Serve static assets from CDN

### Client-Side

1. **Progressive Hydration**: Hydrate components based on priority and visibility
2. **Lazy Loading**: Load components and images on demand
3. **Service Worker**: Implement caching strategies with service workers
4. **Critical CSS**: Extract and inline critical CSS
5. **Resource Hints**: Use preload, prefetch, and preconnect

### Monitoring

1. **Core Web Vitals**: Monitor LCP, FID, and CLS
2. **Real User Monitoring**: Collect performance data from real users
3. **Error Tracking**: Monitor and track JavaScript errors
4. **Performance Budgets**: Set and enforce performance budgets
5. **Continuous Testing**: Automated performance testing in CI/CD

By implementing these optimization strategies, you can achieve excellent SSR performance with Element Plus, providing users with fast, responsive applications while maintaining good SEO and accessibility.