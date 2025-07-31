# Performance Optimization and Monitoring for Element Plus Applications

## Overview

This guide covers comprehensive performance optimization strategies and monitoring solutions for Element Plus applications, including bundle optimization, runtime performance monitoring, Core Web Vitals tracking, and advanced performance analysis.

## Bundle Optimization and Code Splitting

### Advanced Vite Configuration for Performance

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import legacy from '@vitejs/plugin-legacy'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      vue(),
      
      // Legacy browser support
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true,
        polyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      }),
      
      // HTML optimization
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Element Plus App',
            description: env.VITE_APP_DESCRIPTION || 'Modern Vue 3 application with Element Plus',
            keywords: env.VITE_APP_KEYWORDS || 'vue,element-plus,typescript',
            author: env.VITE_APP_AUTHOR || 'Your Name'
          }
        }
      }),
      
      // Gzip compression
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024,
        deleteOriginFile: false
      }),
      
      // Brotli compression
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 1024,
        deleteOriginFile: false
      }),
      
      // Bundle analyzer
      isProduction && visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      }),
      
      // Vendor chunk splitting
      splitVendorChunkPlugin()
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@styles': resolve(__dirname, 'src/styles')
      }
    },
    
    build: {
      target: 'es2015',
      minify: 'terser',
      cssCodeSplit: true,
      sourcemap: isProduction ? false : true,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Terser options for better compression
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log', 'console.info'] : []
        },
        format: {
          comments: false
        }
      },
      
      // Advanced rollup options
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vue ecosystem
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            
            // Element Plus
            'element-plus': ['element-plus'],
            
            // Utilities
            'utils': [
              'lodash-es',
              'dayjs',
              'axios',
              '@vueuse/core'
            ],
            
            // Charts and visualization
            'charts': [
              'echarts',
              'vue-echarts'
            ],
            
            // Icons
            'icons': [
              '@element-plus/icons-vue'
            ]
          },
          
          // File naming for better caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              const fileName = facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '')
              return `js/${fileName}-[hash].js`
            }
            return 'js/[name]-[hash].js'
          },
          
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
              return `images/[name]-[hash].${ext}`
            }
            
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return `fonts/[name]-[hash].${ext}`
            }
            
            if (/\.css$/i.test(assetInfo.name || '')) {
              return `css/[name]-[hash].${ext}`
            }
            
            return `assets/[name]-[hash].${ext}`
          }
        },
        
        // External dependencies (for CDN)
        external: isProduction ? [] : [],
        
        // Tree shaking configuration
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        }
      },
      
      // CSS optimization
      cssMinify: 'lightningcss',
      
      // Asset optimization
      assetsInlineLimit: 4096,
      
      // Report compressed file sizes
      reportCompressedSize: true
    },
    
    // Development server optimization
    server: {
      hmr: {
        overlay: false
      },
      fs: {
        strict: false
      }
    },
    
    // Dependency optimization
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'dayjs',
        'lodash-es',
        '@vueuse/core'
      ],
      exclude: [
        'vue-demi'
      ]
    },
    
    // CSS preprocessing
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `
        }
      },
      
      // PostCSS configuration
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('cssnano')({
            preset: 'default'
          })
        ]
      }
    }
  }
})
```

### Dynamic Import and Lazy Loading

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { usePerformanceStore } from '@/stores/performance'

// Lazy loading with chunk names and prefetch
const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
const Dashboard = () => import(
  /* webpackChunkName: "dashboard" */
  /* webpackPrefetch: true */
  '@/views/Dashboard.vue'
)
const Profile = () => import(
  /* webpackChunkName: "profile" */
  /* webpackPreload: true */
  '@/views/Profile.vue'
)
const Settings = () => import(
  /* webpackChunkName: "settings" */
  '@/views/Settings.vue'
)

// Heavy components with dynamic imports
const DataVisualization = () => import(
  /* webpackChunkName: "data-viz" */
  '@/views/DataVisualization.vue'
)
const Reports = () => import(
  /* webpackChunkName: "reports" */
  '@/views/Reports.vue'
)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      preload: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      prefetch: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings',
      requiresAuth: true
    }
  },
  {
    path: '/data-visualization',
    name: 'DataVisualization',
    component: DataVisualization,
    meta: {
      title: 'Data Visualization',
      requiresAuth: true,
      heavy: true
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      title: 'Reports',
      requiresAuth: true,
      heavy: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Performance monitoring for route changes
router.beforeEach((to, from, next) => {
  const performanceStore = usePerformanceStore()
  
  // Start navigation timing
  performanceStore.startNavigation(to.name as string)
  
  // Prefetch related routes
  if (to.meta.prefetch) {
    prefetchRelatedRoutes(to)
  }
  
  next()
})

router.afterEach((to, from) => {
  const performanceStore = usePerformanceStore()
  
  // End navigation timing
  performanceStore.endNavigation(to.name as string)
  
  // Update page title
  document.title = `${to.meta.title} - Element Plus App`
})

// Prefetch related routes based on user behavior
function prefetchRelatedRoutes(route: any) {
  const relatedRoutes: Record<string, string[]> = {
    'Dashboard': ['Profile', 'Settings'],
    'Profile': ['Settings'],
    'DataVisualization': ['Reports']
  }
  
  const related = relatedRoutes[route.name]
  if (related) {
    related.forEach(routeName => {
      const routeRecord = routes.find(r => r.name === routeName)
      if (routeRecord && typeof routeRecord.component === 'function') {
        // Prefetch the component
        routeRecord.component()
      }
    })
  }
}

export default router
```

### Component-Level Optimization

```vue
<!-- src/components/LazyComponent.vue -->
<template>
  <div class="lazy-component">
    <Suspense>
      <template #default>
        <AsyncComponent v-bind="$attrs" v-on="$listeners" />
      </template>
      
      <template #fallback>
        <div class="loading-placeholder">
          <el-skeleton :rows="skeletonRows" animated />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from 'vue'
import { ElSkeleton } from 'element-plus'

interface Props {
  componentPath: string
  loadingComponent?: any
  errorComponent?: any
  delay?: number
  timeout?: number
  skeletonRows?: number
  retryAttempts?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 200,
  timeout: 10000,
  skeletonRows: 3,
  retryAttempts: 3
})

const retryCount = ref(0)

const AsyncComponent = computed(() => {
  return defineAsyncComponent({
    loader: async () => {
      try {
        const module = await import(/* @vite-ignore */ props.componentPath)
        retryCount.value = 0
        return module.default || module
      } catch (error) {
        console.error(`Failed to load component: ${props.componentPath}`, error)
        
        if (retryCount.value < props.retryAttempts) {
          retryCount.value++
          // Exponential backoff retry
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, retryCount.value) * 1000)
          )
          throw error // This will trigger a retry
        }
        
        throw error
      }
    },
    
    loadingComponent: props.loadingComponent || {
      template: `
        <div class="loading-placeholder">
          <el-skeleton :rows="${props.skeletonRows}" animated />
        </div>
      `
    },
    
    errorComponent: props.errorComponent || {
      template: `
        <div class="error-placeholder">
          <el-alert
            title="Failed to load component"
            type="error"
            :description="'Retry attempt: ' + ${retryCount.value}"
            show-icon
          />
        </div>
      `
    },
    
    delay: props.delay,
    timeout: props.timeout,
    
    suspensible: true
  })
})
</script>

<style scoped>
.lazy-component {
  min-height: 100px;
}

.loading-placeholder,
.error-placeholder {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

## Runtime Performance Monitoring

### Performance Store with Metrics Collection

```typescript
// src/stores/performance.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  type: 'navigation' | 'resource' | 'measure' | 'custom'
  metadata?: Record<string, any>
}

export interface NavigationTiming {
  route: string
  startTime: number
  endTime?: number
  duration?: number
  loadTime?: number
  renderTime?: number
}

export interface ResourceTiming {
  name: string
  type: string
  size: number
  duration: number
  startTime: number
  endTime: number
}

export interface CoreWebVitals {
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
  TTI?: number // Time to Interactive
}

export const usePerformanceStore = defineStore('performance', () => {
  // State
  const metrics = ref<PerformanceMetric[]>([])
  const navigationTimings = ref<NavigationTiming[]>([])
  const resourceTimings = ref<ResourceTiming[]>([])
  const coreWebVitals = ref<CoreWebVitals>({})
  const isMonitoring = ref(false)
  const currentNavigation = ref<NavigationTiming | null>(null)
  
  // Computed
  const averageNavigationTime = computed(() => {
    const completedNavigations = navigationTimings.value.filter(n => n.duration)
    if (completedNavigations.length === 0) return 0
    
    const total = completedNavigations.reduce((sum, nav) => sum + (nav.duration || 0), 0)
    return total / completedNavigations.length
  })
  
  const slowestNavigations = computed(() => {
    return navigationTimings.value
      .filter(n => n.duration)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 5)
  })
  
  const largestResources = computed(() => {
    return resourceTimings.value
      .sort((a, b) => b.size - a.size)
      .slice(0, 10)
  })
  
  const performanceScore = computed(() => {
    const { FCP, LCP, FID, CLS } = coreWebVitals.value
    
    let score = 100
    
    // FCP scoring (0-2.5s = good, 2.5-4s = needs improvement, >4s = poor)
    if (FCP) {
      if (FCP > 4000) score -= 25
      else if (FCP > 2500) score -= 15
    }
    
    // LCP scoring (0-2.5s = good, 2.5-4s = needs improvement, >4s = poor)
    if (LCP) {
      if (LCP > 4000) score -= 25
      else if (LCP > 2500) score -= 15
    }
    
    // FID scoring (0-100ms = good, 100-300ms = needs improvement, >300ms = poor)
    if (FID) {
      if (FID > 300) score -= 25
      else if (FID > 100) score -= 15
    }
    
    // CLS scoring (0-0.1 = good, 0.1-0.25 = needs improvement, >0.25 = poor)
    if (CLS) {
      if (CLS > 0.25) score -= 25
      else if (CLS > 0.1) score -= 15
    }
    
    return Math.max(0, score)
  })
  
  // Actions
  const startMonitoring = () => {
    if (isMonitoring.value) return
    
    isMonitoring.value = true
    
    // Initialize performance observers
    initializePerformanceObservers()
    
    // Collect initial metrics
    collectInitialMetrics()
    
    // Set up periodic collection
    setInterval(collectPeriodicMetrics, 30000) // Every 30 seconds
  }
  
  const stopMonitoring = () => {
    isMonitoring.value = false
    // Disconnect observers would go here
  }
  
  const addMetric = (metric: PerformanceMetric) => {
    metrics.value.push(metric)
    
    // Keep only last 1000 metrics to prevent memory leaks
    if (metrics.value.length > 1000) {
      metrics.value = metrics.value.slice(-1000)
    }
  }
  
  const startNavigation = (route: string) => {
    currentNavigation.value = {
      route,
      startTime: performance.now()
    }
  }
  
  const endNavigation = (route: string) => {
    if (currentNavigation.value && currentNavigation.value.route === route) {
      const endTime = performance.now()
      const duration = endTime - currentNavigation.value.startTime
      
      const navigation: NavigationTiming = {
        ...currentNavigation.value,
        endTime,
        duration
      }
      
      navigationTimings.value.push(navigation)
      currentNavigation.value = null
      
      // Add metric
      addMetric({
        name: 'navigation',
        value: duration,
        timestamp: Date.now(),
        type: 'navigation',
        metadata: { route }
      })
    }
  }
  
  const measureCustom = (name: string, fn: () => void | Promise<void>) => {
    const startTime = performance.now()
    
    const result = fn()
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - startTime
        addMetric({
          name,
          value: duration,
          timestamp: Date.now(),
          type: 'custom'
        })
      })
    } else {
      const duration = performance.now() - startTime
      addMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        type: 'custom'
      })
    }
  }
  
  const initializePerformanceObservers = () => {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      // Navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            
            addMetric({
              name: 'TTFB',
              value: navEntry.responseStart - navEntry.requestStart,
              timestamp: Date.now(),
              type: 'navigation'
            })
            
            addMetric({
              name: 'DOM_LOAD',
              value: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              timestamp: Date.now(),
              type: 'navigation'
            })
          }
        }
      })
      
      navObserver.observe({ entryTypes: ['navigation'] })
      
      // Resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming
            
            resourceTimings.value.push({
              name: resourceEntry.name,
              type: getResourceType(resourceEntry.name),
              size: resourceEntry.transferSize || 0,
              duration: resourceEntry.duration,
              startTime: resourceEntry.startTime,
              endTime: resourceEntry.responseEnd
            })
          }
        }
      })
      
      resourceObserver.observe({ entryTypes: ['resource'] })
      
      // Paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            coreWebVitals.value.FCP = entry.startTime
            
            addMetric({
              name: 'FCP',
              value: entry.startTime,
              timestamp: Date.now(),
              type: 'measure'
            })
          }
        }
      })
      
      paintObserver.observe({ entryTypes: ['paint'] })
      
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        coreWebVitals.value.LCP = lastEntry.startTime
        
        addMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          timestamp: Date.now(),
          type: 'measure'
        })
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        
        coreWebVitals.value.CLS = clsValue
        
        addMetric({
          name: 'CLS',
          value: clsValue,
          timestamp: Date.now(),
          type: 'measure'
        })
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    }
    
    // First Input Delay
    if ('addEventListener' in window) {
      let firstInputDelay: number | null = null
      
      const measureFID = (event: Event) => {
        if (firstInputDelay === null) {
          firstInputDelay = performance.now() - event.timeStamp
          coreWebVitals.value.FID = firstInputDelay
          
          addMetric({
            name: 'FID',
            value: firstInputDelay,
            timestamp: Date.now(),
            type: 'measure'
          })
          
          // Remove listeners after first input
          window.removeEventListener('click', measureFID)
          window.removeEventListener('keydown', measureFID)
        }
      }
      
      window.addEventListener('click', measureFID, { once: true })
      window.addEventListener('keydown', measureFID, { once: true })
    }
  }
  
  const collectInitialMetrics = () => {
    // Collect navigation timing if available
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      
      if (navEntries.length > 0) {
        const navEntry = navEntries[0]
        
        coreWebVitals.value.TTFB = navEntry.responseStart - navEntry.requestStart
        
        addMetric({
          name: 'TTFB',
          value: coreWebVitals.value.TTFB,
          timestamp: Date.now(),
          type: 'navigation'
        })
      }
    }
    
    // Collect memory information if available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      addMetric({
        name: 'MEMORY_USED',
        value: memory.usedJSHeapSize,
        timestamp: Date.now(),
        type: 'custom',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      })
    }
  }
  
  const collectPeriodicMetrics = () => {
    // Collect current memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      
      addMetric({
        name: 'MEMORY_USED',
        value: memory.usedJSHeapSize,
        timestamp: Date.now(),
        type: 'custom',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      })
    }
    
    // Collect connection information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      addMetric({
        name: 'CONNECTION_SPEED',
        value: connection.downlink || 0,
        timestamp: Date.now(),
        type: 'custom',
        metadata: {
          effectiveType: connection.effectiveType,
          rtt: connection.rtt
        }
      })
    }
  }
  
  const getResourceType = (url: string): string => {
    if (url.includes('.js')) return 'script'
    if (url.includes('.css')) return 'stylesheet'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font'
    if (url.includes('api/')) return 'api'
    return 'other'
  }
  
  const exportMetrics = () => {
    return {
      metrics: metrics.value,
      navigationTimings: navigationTimings.value,
      resourceTimings: resourceTimings.value,
      coreWebVitals: coreWebVitals.value,
      summary: {
        averageNavigationTime: averageNavigationTime.value,
        performanceScore: performanceScore.value,
        totalMetrics: metrics.value.length
      }
    }
  }
  
  const clearMetrics = () => {
    metrics.value = []
    navigationTimings.value = []
    resourceTimings.value = []
    coreWebVitals.value = {}
  }
  
  return {
    // State
    metrics,
    navigationTimings,
    resourceTimings,
    coreWebVitals,
    isMonitoring,
    currentNavigation,
    
    // Computed
    averageNavigationTime,
    slowestNavigations,
    largestResources,
    performanceScore,
    
    // Actions
    startMonitoring,
    stopMonitoring,
    addMetric,
    startNavigation,
    endNavigation,
    measureCustom,
    exportMetrics,
    clearMetrics
  }
})
```

### Performance Monitoring Component

```vue
<!-- src/components/PerformanceMonitor.vue -->
<template>
  <div class="performance-monitor">
    <el-card class="monitor-card">
      <template #header>
        <div class="card-header">
          <span>Performance Monitor</span>
          <div class="header-actions">
            <el-switch
              v-model="isMonitoring"
              @change="toggleMonitoring"
              active-text="Monitoring"
              inactive-text="Stopped"
            />
            <el-button
              type="primary"
              size="small"
              @click="exportData"
              :disabled="!hasData"
            >
              Export
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="clearData"
              :disabled="!hasData"
            >
              Clear
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- Core Web Vitals -->
      <div class="vitals-section">
        <h3>Core Web Vitals</h3>
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="vital-card" :class="getVitalStatus('FCP')">
              <div class="vital-label">FCP</div>
              <div class="vital-value">{{ formatTime(coreWebVitals.FCP) }}</div>
              <div class="vital-description">First Contentful Paint</div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="vital-card" :class="getVitalStatus('LCP')">
              <div class="vital-label">LCP</div>
              <div class="vital-value">{{ formatTime(coreWebVitals.LCP) }}</div>
              <div class="vital-description">Largest Contentful Paint</div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="vital-card" :class="getVitalStatus('FID')">
              <div class="vital-label">FID</div>
              <div class="vital-value">{{ formatTime(coreWebVitals.FID) }}</div>
              <div class="vital-description">First Input Delay</div>
            </div>
          </el-col>
          
          <el-col :span="6">
            <div class="vital-card" :class="getVitalStatus('CLS')">
              <div class="vital-label">CLS</div>
              <div class="vital-value">{{ formatCLS(coreWebVitals.CLS) }}</div>
              <div class="vital-description">Cumulative Layout Shift</div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- Performance Score -->
      <div class="score-section">
        <h3>Performance Score</h3>
        <el-progress
          :percentage="performanceScore"
          :color="getScoreColor(performanceScore)"
          :stroke-width="20"
          text-inside
        />
      </div>
      
      <!-- Navigation Timings -->
      <div class="navigation-section">
        <h3>Navigation Performance</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Average Navigation Time</div>
            <div class="stat-value">{{ formatTime(averageNavigationTime) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Total Navigations</div>
            <div class="stat-value">{{ navigationTimings.length }}</div>
          </div>
        </div>
        
        <el-table
          :data="slowestNavigations.slice(0, 5)"
          size="small"
          class="navigation-table"
        >
          <el-table-column prop="route" label="Route" />
          <el-table-column
            prop="duration"
            label="Duration"
            :formatter="(row) => formatTime(row.duration)"
          />
          <el-table-column
            prop="startTime"
            label="Time"
            :formatter="(row) => new Date(row.startTime).toLocaleTimeString()"
          />
        </el-table>
      </div>
      
      <!-- Resource Performance -->
      <div class="resource-section">
        <h3>Largest Resources</h3>
        <el-table
          :data="largestResources.slice(0, 5)"
          size="small"
          class="resource-table"
        >
          <el-table-column
            prop="name"
            label="Resource"
            :formatter="(row) => getResourceName(row.name)"
          />
          <el-table-column prop="type" label="Type" />
          <el-table-column
            prop="size"
            label="Size"
            :formatter="(row) => formatBytes(row.size)"
          />
          <el-table-column
            prop="duration"
            label="Load Time"
            :formatter="(row) => formatTime(row.duration)"
          />
        </el-table>
      </div>
      
      <!-- Real-time Metrics Chart -->
      <div class="chart-section" v-if="showChart">
        <h3>Real-time Metrics</h3>
        <div ref="chartContainer" class="chart-container"></div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  ElCard,
  ElSwitch,
  ElButton,
  ElRow,
  ElCol,
  ElProgress,
  ElTable,
  ElTableColumn,
  ElMessage
} from 'element-plus'
import { usePerformanceStore } from '@/stores/performance'
import * as echarts from 'echarts'

interface Props {
  showChart?: boolean
  autoStart?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showChart: true,
  autoStart: true
})

const performanceStore = usePerformanceStore()
const chartContainer = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

// Reactive data from store
const {
  isMonitoring,
  coreWebVitals,
  navigationTimings,
  resourceTimings,
  averageNavigationTime,
  slowestNavigations,
  largestResources,
  performanceScore,
  metrics
} = performanceStore

const hasData = computed(() => {
  return metrics.length > 0 || navigationTimings.length > 0
})

const toggleMonitoring = (value: boolean) => {
  if (value) {
    performanceStore.startMonitoring()
    ElMessage.success('Performance monitoring started')
  } else {
    performanceStore.stopMonitoring()
    ElMessage.info('Performance monitoring stopped')
  }
}

const exportData = () => {
  const data = performanceStore.exportMetrics()
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-metrics-${new Date().toISOString()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('Performance data exported')
}

const clearData = () => {
  performanceStore.clearMetrics()
  ElMessage.success('Performance data cleared')
}

const getVitalStatus = (vital: string): string => {
  const value = coreWebVitals[vital as keyof typeof coreWebVitals]
  if (!value) return 'unknown'
  
  switch (vital) {
    case 'FCP':
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    default:
      return 'unknown'
  }
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

const formatTime = (time?: number): string => {
  if (!time) return 'N/A'
  return `${Math.round(time)}ms`
}

const formatCLS = (cls?: number): string => {
  if (!cls) return 'N/A'
  return cls.toFixed(3)
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const getResourceName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/').pop() || urlObj.pathname
  } catch {
    return url.split('/').pop() || url
  }
}

const initChart = async () => {
  if (!props.showChart || !chartContainer.value) return
  
  await nextTick()
  
  chart = echarts.init(chartContainer.value)
  
  const option = {
    title: {
      text: 'Performance Metrics Over Time'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Navigation Time', 'Memory Usage']
    },
    xAxis: {
      type: 'time'
    },
    yAxis: [
      {
        type: 'value',
        name: 'Time (ms)',
        position: 'left'
      },
      {
        type: 'value',
        name: 'Memory (MB)',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'Navigation Time',
        type: 'line',
        data: [],
        smooth: true,
        yAxisIndex: 0
      },
      {
        name: 'Memory Usage',
        type: 'line',
        data: [],
        smooth: true,
        yAxisIndex: 1
      }
    ]
  }
  
  chart.setOption(option)
  
  // Update chart data
  updateChart()
}

const updateChart = () => {
  if (!chart) return
  
  const navigationData = navigationTimings.map(nav => [
    nav.startTime,
    nav.duration || 0
  ])
  
  const memoryData = metrics
    .filter(m => m.name === 'MEMORY_USED')
    .map(m => [
      m.timestamp,
      Math.round(m.value / 1024 / 1024) // Convert to MB
    ])
  
  chart.setOption({
    series: [
      {
        data: navigationData
      },
      {
        data: memoryData
      }
    ]
  })
}

// Watch for data changes and update chart
watch(
  [navigationTimings, metrics],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  if (props.autoStart) {
    performanceStore.startMonitoring()
  }
  
  if (props.showChart) {
    initChart()
  }
})

onUnmounted(() => {
  if (chart) {
    chart.dispose()
  }
})
</script>

<style scoped>
.performance-monitor {
  width: 100%;
}

.monitor-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.vitals-section,
.score-section,
.navigation-section,
.resource-section,
.chart-section {
  margin-bottom: 24px;
}

.vitals-section h3,
.score-section h3,
.navigation-section h3,
.resource-section h3,
.chart-section h3 {
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}

.vital-card {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid;
  transition: all 0.3s ease;
}

.vital-card.good {
  border-color: #67c23a;
  background-color: #f0f9ff;
}

.vital-card.needs-improvement {
  border-color: #e6a23c;
  background-color: #fdf6ec;
}

.vital-card.poor {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.vital-card.unknown {
  border-color: #909399;
  background-color: #f4f4f5;
}

.vital-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.vital-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.vital-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.navigation-table,
.resource-table {
  margin-top: 16px;
}

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
```

This comprehensive performance optimization and monitoring guide provides advanced techniques for optimizing Element Plus applications, including bundle optimization, runtime performance monitoring, Core Web Vitals tracking, and detailed performance analysis tools.