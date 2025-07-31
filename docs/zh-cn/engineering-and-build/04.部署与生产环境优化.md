# 第69天：Element Plus 部署与生产环境优化

## 学习目标

* 掌握 Element Plus 应用的部署策略和最佳实践
* 学习生产环境的性能优化技巧
* 了解 CDN、缓存和压缩等优化手段
* 理解监控和错误追踪在生产环境中的重要性

## 知识点概览

### 1. 构建优化

#### 1.1 Vite 生产构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  plugins: [
    vue(),
    
    // HTML 模板处理
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Element Plus App',
          description: 'Production-ready Element Plus application'
        }
      }
    }),
    
    // Gzip 压缩
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    
    // Brotli 压缩
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    
    // 包分析
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  // 构建配置
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源目录
    assetsDir: 'assets',
    
    // 生成 source map
    sourcemap: process.env.NODE_ENV === 'development',
    
    // 代码分割阈值
    chunkSizeWarningLimit: 1000,
    
    // Rollup 配置
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      
      output: {
        // 手动分包
        manualChunks: {
          // Vue 相关
          vue: ['vue', 'vue-router', 'pinia'],
          
          // Element Plus
          'element-plus': ['element-plus'],
          
          // 图标
          'element-icons': ['@element-plus/icons-vue'],
          
          // 工具库
          utils: ['lodash-es', 'dayjs', 'axios'],
          
          // 图表库
          charts: ['echarts', 'vue-echarts']
        },
        
        // 文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.')
          const ext = info[info.length - 1]
          
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name!)) {
            return `assets/media/[name]-[hash].${ext}`
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name!)) {
            return `assets/images/[name]-[hash].${ext}`
          }
          
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name!)) {
            return `assets/fonts/[name]-[hash].${ext}`
          }
          
          return `assets/[ext]/[name]-[hash].${ext}`
        }
      },
      
      // 外部依赖（CDN）
      external: process.env.USE_CDN === 'true' ? [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue'
      ] : []
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        // 移除 debugger
        drop_debugger: true,
        // 移除无用代码
        dead_code: true,
        // 移除无用变量
        unused: true
      },
      mangle: {
        // 混淆变量名
        toplevel: true
      }
    }
  },
  
  // 依赖优化
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      '@element-plus/icons-vue',
      'axios',
      'dayjs'
    ]
  },
  
  // 服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true
  }
})
```

#### 1.2 环境变量配置

```bash
# .env.production
VITE_APP_TITLE=Element Plus App
VITE_APP_API_BASE_URL=https://api.example.com
VITE_APP_CDN_URL=https://cdn.example.com
VITE_APP_SENTRY_DSN=https://your-sentry-dsn
VITE_APP_ENABLE_ANALYTICS=true
VITE_APP_VERSION=1.0.0

# 是否使用 CDN
USE_CDN=true

# 是否启用 PWA
ENABLE_PWA=true
```

```typescript
// src/config/env.ts
interface AppConfig {
  title: string
  apiBaseUrl: string
  cdnUrl: string
  sentryDsn: string
  enableAnalytics: boolean
  version: string
  isDevelopment: boolean
  isProduction: boolean
  isTest: boolean
}

class EnvironmentConfig {
  private static instance: EnvironmentConfig
  private config: AppConfig
  
  private constructor() {
    this.config = {
      title: import.meta.env.VITE_APP_TITLE || 'Element Plus App',
      apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3001',
      cdnUrl: import.meta.env.VITE_APP_CDN_URL || '',
      sentryDsn: import.meta.env.VITE_APP_SENTRY_DSN || '',
      enableAnalytics: import.meta.env.VITE_APP_ENABLE_ANALYTICS === 'true',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      isTest: import.meta.env.MODE === 'test'
    }
  }
  
  static getInstance(): EnvironmentConfig {
    if (!this.instance) {
      this.instance = new EnvironmentConfig()
    }
    return this.instance
  }
  
  getConfig(): AppConfig {
    return { ...this.config }
  }
  
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key]
  }
  
  // 验证必需的环境变量
  validateRequiredEnvVars(): void {
    const required = ['VITE_APP_API_BASE_URL']
    const missing = required.filter(key => !import.meta.env[key])
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

export const envConfig = EnvironmentConfig.getInstance()
export type { AppConfig }
```

### 2. CDN 集成

#### 2.1 CDN 资源配置

```typescript
// src/utils/cdn.ts
interface CDNResource {
  name: string
  library: string
  js: string
  css?: string
}

class CDNManager {
  private static readonly CDN_RESOURCES: CDNResource[] = [
    {
      name: 'vue',
      library: 'Vue',
      js: 'https://unpkg.com/vue@3/dist/vue.global.prod.js'
    },
    {
      name: 'vue-router',
      library: 'VueRouter',
      js: 'https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js'
    },
    {
      name: 'pinia',
      library: 'Pinia',
      js: 'https://unpkg.com/pinia@2/dist/pinia.iife.prod.js'
    },
    {
      name: 'element-plus',
      library: 'ElementPlus',
      js: 'https://unpkg.com/element-plus@2/dist/index.full.min.js',
      css: 'https://unpkg.com/element-plus@2/dist/index.css'
    },
    {
      name: '@element-plus/icons-vue',
      library: 'ElementPlusIconsVue',
      js: 'https://unpkg.com/@element-plus/icons-vue@2/dist/index.iife.min.js'
    }
  ]
  
  // 生成 HTML 中的 CDN 链接
  static generateCDNLinks(): { js: string[], css: string[] } {
    const js: string[] = []
    const css: string[] = []
    
    this.CDN_RESOURCES.forEach(resource => {
      js.push(resource.js)
      if (resource.css) {
        css.push(resource.css)
      }
    })
    
    return { js, css }
  }
  
  // 生成 Vite 外部依赖配置
  static generateExternals(): Record<string, string> {
    const externals: Record<string, string> = {}
    
    this.CDN_RESOURCES.forEach(resource => {
      externals[resource.name] = resource.library
    })
    
    return externals
  }
  
  // 动态加载 CDN 资源
  static async loadCDNResource(url: string, type: 'js' | 'css' = 'js'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (type === 'js') {
        const script = document.createElement('script')
        script.src = url
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
        document.head.appendChild(script)
      } else {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        link.onload = () => resolve()
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`))
        document.head.appendChild(link)
      }
    })
  }
  
  // 预加载 CDN 资源
  static preloadCDNResources(): void {
    this.CDN_RESOURCES.forEach(resource => {
      // 预加载 JS
      const jsLink = document.createElement('link')
      jsLink.rel = 'preload'
      jsLink.as = 'script'
      jsLink.href = resource.js
      document.head.appendChild(jsLink)
      
      // 预加载 CSS
      if (resource.css) {
        const cssLink = document.createElement('link')
        cssLink.rel = 'preload'
        cssLink.as = 'style'
        cssLink.href = resource.css
        document.head.appendChild(cssLink)
      }
    })
  }
}

export { CDNManager }
export type { CDNResource }
```

#### 2.2 HTML 模板配置

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%- title %></title>
  <meta name="description" content="<%- description %>" />
  
  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="//unpkg.com" />
  <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
  
  <!-- 预连接 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  
  <!-- PWA 配置 -->
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#409eff" />
  
  <!-- iOS PWA 配置 -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="<%- title %>" />
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
  
  <!-- 条件加载 CDN 资源 -->
  <% if (process.env.USE_CDN === 'true') { %>
    <!-- CSS CDN -->
    <link rel="stylesheet" href="https://unpkg.com/element-plus@2/dist/index.css" />
    
    <!-- JS CDN -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
    <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.prod.js"></script>
    <script src="https://unpkg.com/pinia@2/dist/pinia.iife.prod.js"></script>
    <script src="https://unpkg.com/element-plus@2/dist/index.full.min.js"></script>
    <script src="https://unpkg.com/@element-plus/icons-vue@2/dist/index.iife.min.js"></script>
  <% } %>
  
  <!-- 关键 CSS 内联 -->
  <style>
    /* 加载动画 */
    .app-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #409eff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div id="app">
    <!-- 加载动画 -->
    <div class="app-loading">
      <div class="loading-spinner"></div>
    </div>
  </div>
  
  <!-- 错误边界 -->
  <script>
    window.addEventListener('error', function(event) {
      console.error('Global error:', event.error)
      // 发送错误到监控服务
    })
    
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Unhandled promise rejection:', event.reason)
      // 发送错误到监控服务
    })
  </script>
  
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 3. 缓存策略

#### 3.1 HTTP 缓存配置

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Brotli 压缩
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        application/xml+rss
        text/javascript;
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # 启用 ETag
        etag on;
        
        # 预压缩文件
        location ~* \.(js|css)$ {
            gzip_static on;
            brotli_static on;
        }
    }
    
    # HTML 文件缓存
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
        add_header Vary "Accept-Encoding";
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://backend-server;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # API 缓存
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_key $scheme$proxy_host$request_uri;
        add_header X-Cache-Status $upstream_cache_status;
    }
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.example.com;" always;
}
```

#### 3.2 Service Worker 缓存

```typescript
// public/sw.js
const CACHE_NAME = 'element-plus-app-v1.0.0'
const STATIC_CACHE = 'static-cache-v1'
const DYNAMIC_CACHE = 'dynamic-cache-v1'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 添加其他静态资源
]

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }
  
  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // API 请求策略：网络优先，缓存备用
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 缓存成功的 API 响应
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // 网络失败时从缓存获取
          return caches.match(request)
        })
    )
    return
  }
  
  // 静态资源策略：缓存优先
  if (isStaticAsset(request.url)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone()
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone)
                  })
              }
              return response
            })
        })
    )
    return
  }
  
  // HTML 页面策略：网络优先，缓存备用
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone)
            })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
          .then((response) => {
            return response || caches.match('/index.html')
          })
      })
  )
})

// 判断是否为静态资源
function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(url)
}

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
```

### 4. 性能监控

#### 4.1 性能指标收集

```typescript
// src/utils/performance.ts
interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  
  // 其他指标
  ttfb: number // Time to First Byte
  domContentLoaded: number
  loadComplete: number
  
  // 自定义指标
  appInitTime: number
  routeChangeTime: number
  apiResponseTime: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observer: PerformanceObserver | null = null
  
  constructor() {
    this.initPerformanceObserver()
    this.collectNavigationMetrics()
  }
  
  private initPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry)
        }
      })
      
      // 观察不同类型的性能条目
      try {
        this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
      } catch (error) {
        console.warn('Performance observer not supported:', error)
      }
    }
  }
  
  private handlePerformanceEntry(entry: PerformanceEntry): void {
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime
        }
        break
        
      case 'largest-contentful-paint':
        this.metrics.lcp = entry.startTime
        break
        
      case 'first-input':
        this.metrics.fid = (entry as PerformanceEventTiming).processingStart - entry.startTime
        break
        
      case 'layout-shift':
        if (!(entry as any).hadRecentInput) {
          this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value
        }
        break
    }
  }
  
  private collectNavigationMetrics(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
        this.metrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart
      }
    }
  }
  
  // 记录应用初始化时间
  recordAppInitTime(startTime: number): void {
    this.metrics.appInitTime = performance.now() - startTime
  }
  
  // 记录路由切换时间
  recordRouteChangeTime(startTime: number): void {
    this.metrics.routeChangeTime = performance.now() - startTime
  }
  
  // 记录 API 响应时间
  recordApiResponseTime(url: string, duration: number): void {
    // 可以按 URL 分类记录
    console.log(`API ${url} response time: ${duration}ms`)
  }
  
  // 获取所有指标
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }
  
  // 发送指标到监控服务
  async sendMetrics(): Promise<void> {
    const metrics = this.getMetrics()
    
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      console.error('Failed to send metrics:', error)
    }
  }
  
  // 清理资源
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 页面可见性变化时发送指标
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    performanceMonitor.sendMetrics()
  }
})

// 页面卸载时发送指标
window.addEventListener('beforeunload', () => {
  performanceMonitor.sendMetrics()
})
```

#### 4.2 错误监控

```typescript
// src/utils/error-tracking.ts
import * as Sentry from '@sentry/vue'
import { App } from 'vue'
import { Router } from 'vue-router'
import { envConfig } from '@/config/env'

interface ErrorInfo {
  message: string
  stack?: string
  componentName?: string
  propsData?: any
  url: string
  userAgent: string
  timestamp: number
  userId?: string
}

class ErrorTracker {
  private static instance: ErrorTracker
  private errors: ErrorInfo[] = []
  private maxErrors = 100
  
  private constructor() {
    this.setupGlobalErrorHandlers()
  }
  
  static getInstance(): ErrorTracker {
    if (!this.instance) {
      this.instance = new ErrorTracker()
    }
    return this.instance
  }
  
  // 初始化 Sentry
  static initSentry(app: App, router: Router): void {
    if (envConfig.get('sentryDsn') && envConfig.get('isProduction')) {
      Sentry.init({
        app,
        dsn: envConfig.get('sentryDsn'),
        environment: envConfig.get('isProduction') ? 'production' : 'development',
        release: envConfig.get('version'),
        
        integrations: [
          new Sentry.BrowserTracing({
            router,
            routingInstrumentation: Sentry.vueRouterInstrumentation(router)
          })
        ],
        
        // 性能监控
        tracesSampleRate: 0.1,
        
        // 错误过滤
        beforeSend(event, hint) {
          // 过滤掉一些不重要的错误
          const error = hint.originalException
          
          if (error && typeof error === 'object') {
            // 过滤网络错误
            if ('message' in error && typeof error.message === 'string') {
              if (error.message.includes('Network Error') || 
                  error.message.includes('Failed to fetch')) {
                return null
              }
            }
          }
          
          return event
        },
        
        // 用户上下文
        initialScope: {
          tags: {
            component: 'element-plus-app'
          }
        }
      })
    }
  }
  
  private setupGlobalErrorHandlers(): void {
    // 捕获 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    })
    
    // 捕获 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    })
  }
  
  // 捕获错误
  captureError(errorInfo: Partial<ErrorInfo>): void {
    const error: ErrorInfo = {
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.stack,
      componentName: errorInfo.componentName,
      propsData: errorInfo.propsData,
      url: errorInfo.url || window.location.href,
      userAgent: errorInfo.userAgent || navigator.userAgent,
      timestamp: errorInfo.timestamp || Date.now(),
      userId: this.getCurrentUserId()
    }
    
    // 添加到本地错误列表
    this.errors.push(error)
    
    // 限制错误数量
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }
    
    // 发送到 Sentry
    if (envConfig.get('isProduction')) {
      Sentry.captureException(new Error(error.message), {
        extra: {
          componentName: error.componentName,
          propsData: error.propsData,
          stack: error.stack
        },
        user: {
          id: error.userId
        }
      })
    }
    
    // 发送到自定义错误服务
    this.sendErrorToService(error)
  }
  
  // Vue 错误处理器
  vueErrorHandler(err: Error, instance: any, info: string): void {
    this.captureError({
      message: err.message,
      stack: err.stack,
      componentName: instance?.$options.name || instance?.$options.__name,
      propsData: instance?.$props,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    })
  }
  
  private getCurrentUserId(): string | undefined {
    // 从用户状态或本地存储获取用户 ID
    return localStorage.getItem('userId') || undefined
  }
  
  private async sendErrorToService(error: ErrorInfo): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      })
    } catch (err) {
      console.error('Failed to send error to service:', err)
    }
  }
  
  // 获取错误列表
  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }
  
  // 清除错误
  clearErrors(): void {
    this.errors = []
  }
}

export const errorTracker = ErrorTracker.getInstance()
export { ErrorTracker }
```

### 5. 部署自动化

#### 5.1 Docker 配置

```dockerfile
# Dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    
  # 可选：添加 Redis 缓存
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
    
  # 可选：添加监控
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    restart: unless-stopped
```

#### 5.2 CI/CD 流水线

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT
          
      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
            
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run linting
        run: pnpm lint
        
      - name: Run type checking
        run: pnpm typecheck
        
      - name: Run tests
        run: pnpm test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build application
        run: pnpm build
        env:
          VITE_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_APP_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
          USE_CDN: true
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
          
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/element-plus-app:latest
            ${{ secrets.DOCKER_USERNAME }}/element-plus-app:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKER_USERNAME }}/element-plus-app:latest
            docker stop element-plus-app || true
            docker rm element-plus-app || true
            docker run -d \
              --name element-plus-app \
              -p 80:80 \
              --restart unless-stopped \
              ${{ secrets.DOCKER_USERNAME }}/element-plus-app:latest
              
      - name: Health check
        run: |
          sleep 30
          curl -f http://${{ secrets.HOST }} || exit 1
```

## 实践练习

### 练习 1：构建优化配置

1. 配置 Vite 生产构建，实现代码分割和压缩
2. 设置 CDN 资源加载
3. 配置环境变量管理
4. 分析打包产物大小

### 练习 2：缓存策略实现

1. 配置 Nginx 静态资源缓存
2. 实现 Service Worker 缓存策略
3. 设置 API 响应缓存
4. 测试缓存效果

### 练习 3：监控系统搭建

1. 集成性能监控
2. 设置错误追踪
3. 配置日志收集
4. 创建监控仪表板

## 学习资源

* [Vite 官方文档](https://vitejs.dev/)
* [Nginx 官方文档](https://nginx.org/en/docs/)
* [Docker 官方文档](https://docs.docker.com/)
* [Sentry 官方文档](https://docs.sentry.io/)
* [Web Performance 最佳实践](https://web.dev/performance/)

## 作业

1. 完成所有实践练习
2. 为你的 Element Plus 项目配置完整的部署流程
3. 实现性能监控和错误追踪
4. 编写部署文档和运维指南

## 下一步学习计划

接下来我们将学习 **Element Plus 项目实战总结与最佳实践**，回顾整个学习过程，总结最佳实践，并展望未来的发展方向。