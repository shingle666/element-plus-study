# Performance Best Practices for Element Plus Applications

## Overview

This guide provides comprehensive performance optimization strategies for Element Plus applications, covering bundle optimization, runtime performance, memory management, and user experience improvements.

## Bundle Optimization

### Tree Shaking and Code Splitting

```javascript
// vite.config.js - Optimal Vite configuration
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    vue(),
    // Auto import Element Plus components
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true
    }),
    // Auto import Element Plus APIs
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: true
    })
  ],
  
  build: {
    // Enable tree shaking
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Vendor chunk for large libraries
          vendor: ['vue', 'vue-router', 'pinia'],
          // Element Plus chunk
          'element-plus': ['element-plus'],
          // Utility libraries
          utils: ['lodash-es', 'dayjs', 'axios']
        }
      }
    },
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'element-plus/es',
      'element-plus/es/components/*/style/css',
      '@element-plus/icons-vue'
    ]
  }
})
```

### Selective Component Import

```javascript
// Good: Import only needed components
import { ElButton, ElInput, ElForm } from 'element-plus'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/form/style/css'

// Better: Use auto-import plugin (recommended)
// Components are automatically imported when used

// Bad: Import entire library
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
```

### CSS Optimization

```scss
// styles/element-variables.scss - Custom theme variables
@use 'element-plus/theme-chalk/src/common/var.scss' as *;
@use 'element-plus/theme-chalk/src/mixins/mixins.scss' as *;

// Override only necessary variables
$colors: (
  'primary': (
    'base': #409eff,
  ),
  'success': (
    'base': #67c23a,
  ),
  'warning': (
    'base': #e6a23c,
  ),
  'danger': (
    'base': #f56c6c,
  ),
);

// Use CSS custom properties for runtime theming
:root {
  --el-color-primary: #{map.get($colors, 'primary', 'base')};
  --el-color-success: #{map.get($colors, 'success', 'base')};
  --el-color-warning: #{map.get($colors, 'warning', 'base')};
  --el-color-danger: #{map.get($colors, 'danger', 'base')};
}
```

```javascript
// vite.config.js - CSS optimization
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element-variables.scss" as *;`
      }
    },
    
    // PostCSS optimization
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: 'default'
        })
      ]
    }
  }
})
```

## Component Performance

### Lazy Loading Components

```vue
<template>
  <div class="dashboard">
    <!-- Immediately visible components -->
    <DashboardHeader />
    <DashboardSidebar />
    
    <!-- Lazy load heavy components -->
    <Suspense>
      <template #default>
        <AsyncDataTable v-if="showTable" />
      </template>
      <template #fallback>
        <el-skeleton :rows="5" animated />
      </template>
    </Suspense>
    
    <!-- Lazy load modal components -->
    <component 
      :is="currentModal" 
      v-if="currentModal"
      @close="currentModal = null"
    />
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import DashboardSidebar from './components/DashboardSidebar.vue'

// Lazy load heavy components
const AsyncDataTable = defineAsyncComponent({
  loader: () => import('./components/DataTable.vue'),
  loadingComponent: () => h('div', 'Loading table...'),
  errorComponent: () => h('div', 'Failed to load table'),
  delay: 200,
  timeout: 3000
})

// Lazy load modal components
const modalComponents = {
  UserModal: defineAsyncComponent(() => import('./modals/UserModal.vue')),
  SettingsModal: defineAsyncComponent(() => import('./modals/SettingsModal.vue')),
  ReportModal: defineAsyncComponent(() => import('./modals/ReportModal.vue'))
}

const currentModal = ref(null)
const showTable = ref(false)

const openModal = (modalName) => {
  currentModal.value = modalComponents[modalName]
}
</script>
```

### Virtual Scrolling for Large Lists

```vue
<template>
  <div class="virtual-list-container">
    <!-- Element Plus Table with virtual scrolling -->
    <el-table-v2
      :columns="columns"
      :data="tableData"
      :width="800"
      :height="600"
      :row-height="50"
      fixed
    />
    
    <!-- Custom virtual list for complex items -->
    <div 
      ref="containerRef"
      class="virtual-scroll-container"
      @scroll="handleScroll"
    >
      <div 
        class="virtual-scroll-content"
        :style="{ height: totalHeight + 'px' }"
      >
        <div 
          class="virtual-scroll-items"
          :style="{ transform: `translateY(${offsetY}px)` }"
        >
          <div
            v-for="item in visibleItems"
            :key="item.id"
            class="virtual-item"
            :style="{ height: itemHeight + 'px' }"
          >
            <UserCard :user="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVirtualList } from '@vueuse/core'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    default: 80
  }
})

const containerRef = ref()
const containerHeight = ref(600)

// Virtual scrolling logic
const {
  list: visibleItems,
  containerProps,
  wrapperProps
} = useVirtualList(
  computed(() => props.items),
  {
    itemHeight: props.itemHeight,
    containerHeight: containerHeight.value
  }
)

// Table columns for el-table-v2
const columns = [
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150
  },
  {
    key: 'email',
    title: 'Email',
    dataKey: 'email',
    width: 200
  },
  {
    key: 'status',
    title: 'Status',
    dataKey: 'status',
    width: 100,
    cellRenderer: ({ cellData }) => {
      return h(ElTag, {
        type: cellData === 'active' ? 'success' : 'info'
      }, () => cellData)
    }
  },
  {
    key: 'actions',
    title: 'Actions',
    width: 150,
    cellRenderer: ({ rowData }) => {
      return h('div', [
        h(ElButton, {
          size: 'small',
          onClick: () => editUser(rowData)
        }, () => 'Edit'),
        h(ElButton, {
          size: 'small',
          type: 'danger',
          onClick: () => deleteUser(rowData)
        }, () => 'Delete')
      ])
    }
  }
]
</script>
```

### Optimized Form Handling

```vue
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="120px"
    @submit.prevent="handleSubmit"
  >
    <!-- Use v-memo for expensive form items -->
    <div v-memo="[form.category]">
      <el-form-item label="Category" prop="category">
        <el-select
          v-model="form.category"
          placeholder="Select category"
          filterable
          remote
          :remote-method="searchCategories"
          :loading="categoryLoading"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
    </div>
    
    <!-- Debounced input for search -->
    <el-form-item label="Search" prop="search">
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        clearable
        @input="debouncedSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    
    <!-- Optimized file upload -->
    <el-form-item label="Files" prop="files">
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        :before-upload="beforeUpload"
        multiple
        drag
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          Drop files here or <em>click to upload</em>
        </div>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'

const formRef = ref()
const uploadRef = ref()
const categoryLoading = ref(false)
const categories = ref([])
const searchQuery = ref('')

const form = reactive({
  category: '',
  search: '',
  files: []
})

// Debounced search to avoid excessive API calls
const debouncedSearch = useDebounceFn((query) => {
  if (query.length > 2) {
    performSearch(query)
  }
}, 300)

// Throttled category search
const searchCategories = useThrottleFn(async (query) => {
  if (!query) return
  
  categoryLoading.value = true
  try {
    const response = await api.searchCategories(query)
    categories.value = response.data
  } catch (error) {
    ElMessage.error('Failed to search categories')
  } finally {
    categoryLoading.value = false
  }
}, 500)

// Optimized file handling
const handleFileChange = (file, fileList) => {
  // Validate file size and type before adding
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('File size cannot exceed 10MB')
    return false
  }
  
  form.files = fileList
}

const beforeUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('Only JPG, PNG and PDF files are allowed')
    return false
  }
  return true
}

// Memoized validation rules
const rules = computed(() => ({
  category: [
    { required: true, message: 'Please select a category', trigger: 'change' }
  ],
  search: [
    { min: 3, message: 'Search query must be at least 3 characters', trigger: 'blur' }
  ]
}))
</script>
```

## Memory Management

### Proper Cleanup

```vue
<template>
  <div class="data-dashboard">
    <el-card>
      <div ref="chartContainer" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'

const chartContainer = ref()
let chartInstance = null
let resizeObserver = null
let intervalId = null

// Cleanup function
const cleanup = () => {
  // Dispose chart instance
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  
  // Disconnect resize observer
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  // Clear intervals
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  
  // Remove event listeners
  window.removeEventListener('beforeunload', cleanup)
}

onMounted(() => {
  // Initialize chart
  chartInstance = echarts.init(chartContainer.value)
  
  // Set up resize observer
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartContainer.value)
  
  // Set up data refresh interval
  intervalId = setInterval(() => {
    refreshChartData()
  }, 30000)
  
  // Add cleanup listener
  window.addEventListener('beforeunload', cleanup)
})

// Cleanup on unmount
onUnmounted(cleanup)

// Watch for prop changes and update chart
watch(
  () => props.data,
  (newData) => {
    if (chartInstance && newData) {
      chartInstance.setOption({
        series: [{ data: newData }]
      })
    }
  },
  { deep: true }
)
</script>
```

### Efficient State Management

```javascript
// stores/optimized-store.js
import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'

export const useOptimizedStore = defineStore('optimized', () => {
  // Use shallowRef for large datasets that don't need deep reactivity
  const largeDataset = shallowRef([])
  
  // Use ref for simple values
  const loading = ref(false)
  const error = ref(null)
  
  // Use Map for O(1) lookups
  const itemsMap = ref(new Map())
  
  // Computed with proper dependencies
  const filteredItems = computed(() => {
    return largeDataset.value.filter(item => item.active)
  })
  
  // Memoized expensive computations
  const expensiveComputation = computed(() => {
    if (largeDataset.value.length === 0) return 0
    
    return largeDataset.value.reduce((sum, item) => {
      return sum + (item.value || 0)
    }, 0)
  })
  
  // Batch updates for better performance
  const updateItems = (newItems) => {
    // Use nextTick to batch DOM updates
    nextTick(() => {
      largeDataset.value = newItems
      
      // Update map for fast lookups
      itemsMap.value.clear()
      newItems.forEach(item => {
        itemsMap.value.set(item.id, item)
      })
    })
  }
  
  // Efficient item lookup
  const getItem = (id) => {
    return itemsMap.value.get(id)
  }
  
  // Cleanup method
  const cleanup = () => {
    largeDataset.value = []
    itemsMap.value.clear()
    error.value = null
  }
  
  return {
    largeDataset,
    loading,
    error,
    filteredItems,
    expensiveComputation,
    updateItems,
    getItem,
    cleanup
  }
})
```

## Network Optimization

### Request Optimization

```javascript
// utils/api-optimizer.js
import { ref } from 'vue'

// Request deduplication
const pendingRequests = new Map()

export const deduplicateRequest = (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key)
  })
  
  pendingRequests.set(key, promise)
  return promise
}

// Request batching
class RequestBatcher {
  constructor(batchFn, delay = 50) {
    this.batchFn = batchFn
    this.delay = delay
    this.queue = []
    this.timeoutId = null
  }
  
  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject })
      
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      
      this.timeoutId = setTimeout(() => {
        this.flush()
      }, this.delay)
    })
  }
  
  async flush() {
    if (this.queue.length === 0) return
    
    const batch = this.queue.splice(0)
    const requests = batch.map(item => item.request)
    
    try {
      const results = await this.batchFn(requests)
      
      batch.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      batch.forEach(item => {
        item.reject(error)
      })
    }
  }
}

// Usage example
const userBatcher = new RequestBatcher(async (userIds) => {
  const response = await api.getUsers({ ids: userIds })
  return response.data
})

export const batchGetUser = (userId) => {
  return userBatcher.add(userId)
}

// Caching with TTL
class CacheManager {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map()
    this.ttl = ttl
  }
  
  set(key, value) {
    const expiry = Date.now() + this.ttl
    this.cache.set(key, { value, expiry })
  }
  
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  clear() {
    this.cache.clear()
  }
}

export const apiCache = new CacheManager()

// Cached API wrapper
export const cachedApiCall = async (key, apiFn) => {
  const cached = apiCache.get(key)
  if (cached) {
    return cached
  }
  
  const result = await apiFn()
  apiCache.set(key, result)
  return result
}
```

### Image Optimization

```vue
<template>
  <div class="image-gallery">
    <!-- Lazy loaded images with placeholder -->
    <div 
      v-for="image in images" 
      :key="image.id"
      class="image-container"
    >
      <el-image
        :src="image.url"
        :lazy="true"
        :preview-src-list="previewList"
        fit="cover"
        loading="lazy"
        @load="handleImageLoad"
        @error="handleImageError"
      >
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-error">
            <el-icon><PictureFilled /></el-icon>
            <span>Load failed</span>
          </div>
        </template>
      </el-image>
    </div>
    
    <!-- Progressive image loading -->
    <div class="progressive-image">
      <img
        v-if="!highResLoaded"
        :src="lowResImage"
        class="low-res"
        alt="Loading..."
      >
      <img
        :src="highResImage"
        class="high-res"
        :class="{ loaded: highResLoaded }"
        @load="highResLoaded = true"
        alt="High resolution"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
})

const highResLoaded = ref(false)
const visibleImages = ref(new Set())

// Generate different image sizes
const getOptimizedImageUrl = (url, width, quality = 80) => {
  // Assuming you have an image optimization service
  return `${url}?w=${width}&q=${quality}&f=webp`
}

const previewList = computed(() => {
  return props.images.map(img => getOptimizedImageUrl(img.url, 1200))
})

// Intersection observer for lazy loading
const imageRefs = ref([])

onMounted(() => {
  imageRefs.value.forEach((el, index) => {
    if (el) {
      const { stop } = useIntersectionObserver(
        el,
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            visibleImages.value.add(index)
            stop() // Stop observing once loaded
          }
        },
        {
          rootMargin: '50px' // Start loading 50px before entering viewport
        }
      )
    }
  })
})

const handleImageLoad = (event) => {
  // Image loaded successfully
  console.log('Image loaded:', event.target.src)
}

const handleImageError = (event) => {
  // Handle image load error
  console.error('Image failed to load:', event.target.src)
}
</script>

<style scoped>
.image-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 10px;
}

.image-placeholder,
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
}

.progressive-image {
  position: relative;
  overflow: hidden;
}

.progressive-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.low-res {
  filter: blur(2px);
  transform: scale(1.1);
}

.high-res {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.high-res.loaded {
  opacity: 1;
}
</style>
```

## Performance Monitoring

### Performance Metrics Collection

```javascript
// utils/performance-monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
    this.init()
  }
  
  init() {
    // Core Web Vitals
    this.observeCLS()
    this.observeFID()
    this.observeLCP()
    this.observeFCP()
    
    // Custom metrics
    this.observeNavigationTiming()
    this.observeResourceTiming()
  }
  
  observeCLS() {
    let clsValue = 0
    let clsEntries = []
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          clsEntries.push(entry)
        }
      }
      
      this.metrics.set('CLS', {
        value: clsValue,
        entries: clsEntries,
        timestamp: Date.now()
      })
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(observer)
  }
  
  observeFID() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.set('FID', {
          value: entry.processingStart - entry.startTime,
          entry,
          timestamp: Date.now()
        })
      }
    })
    
    observer.observe({ entryTypes: ['first-input'] })
    this.observers.push(observer)
  }
  
  observeLCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      this.metrics.set('LCP', {
        value: lastEntry.startTime,
        entry: lastEntry,
        timestamp: Date.now()
      })
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(observer)
  }
  
  observeFCP() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', {
            value: entry.startTime,
            entry,
            timestamp: Date.now()
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['paint'] })
    this.observers.push(observer)
  }
  
  observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      
      this.metrics.set('Navigation', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
        timestamp: Date.now()
      })
    })
  }
  
  observeResourceTiming() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
          this.trackAPICall(entry)
        }
      }
    })
    
    observer.observe({ entryTypes: ['resource'] })
    this.observers.push(observer)
  }
  
  trackAPICall(entry) {
    const apiCalls = this.metrics.get('APICalls') || []
    
    apiCalls.push({
      url: entry.name,
      duration: entry.responseEnd - entry.requestStart,
      size: entry.transferSize,
      timestamp: Date.now()
    })
    
    // Keep only last 100 API calls
    if (apiCalls.length > 100) {
      apiCalls.shift()
    }
    
    this.metrics.set('APICalls', apiCalls)
  }
  
  // Custom timing measurement
  startTiming(name) {
    performance.mark(`${name}-start`)
  }
  
  endTiming(name) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name, 'measure')[0]
    this.metrics.set(name, {
      value: measure.duration,
      timestamp: Date.now()
    })
  }
  
  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
  
  // Send metrics to analytics
  sendMetrics() {
    const metrics = this.getMetrics()
    
    // Send to your analytics service
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        metrics,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      })
    }).catch(console.error)
  }
  
  // Cleanup
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.metrics.clear()
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor()

// Vue plugin
export default {
  install(app) {
    app.config.globalProperties.$performance = performanceMonitor
    app.provide('performance', performanceMonitor)
  }
}
```

### Performance Dashboard Component

```vue
<template>
  <el-card class="performance-dashboard">
    <template #header>
      <div class="card-header">
        <span>Performance Metrics</span>
        <el-button size="small" @click="refreshMetrics">
          Refresh
        </el-button>
      </div>
    </template>
    
    <el-row :gutter="20">
      <!-- Core Web Vitals -->
      <el-col :span="8">
        <div class="metric-card">
          <h4>Largest Contentful Paint</h4>
          <div class="metric-value" :class="getLCPClass(metrics.LCP?.value)">
            {{ formatTime(metrics.LCP?.value) }}
          </div>
          <div class="metric-threshold">
            Good: &lt; 2.5s, Needs Improvement: 2.5s - 4s, Poor: &gt; 4s
          </div>
        </div>
      </el-col>
      
      <el-col :span="8">
        <div class="metric-card">
          <h4>First Input Delay</h4>
          <div class="metric-value" :class="getFIDClass(metrics.FID?.value)">
            {{ formatTime(metrics.FID?.value) }}
          </div>
          <div class="metric-threshold">
            Good: &lt; 100ms, Needs Improvement: 100ms - 300ms, Poor: &gt; 300ms
          </div>
        </div>
      </el-col>
      
      <el-col :span="8">
        <div class="metric-card">
          <h4>Cumulative Layout Shift</h4>
          <div class="metric-value" :class="getCLSClass(metrics.CLS?.value)">
            {{ formatCLS(metrics.CLS?.value) }}
          </div>
          <div class="metric-threshold">
            Good: &lt; 0.1, Needs Improvement: 0.1 - 0.25, Poor: &gt; 0.25
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- API Performance -->
    <el-divider />
    
    <h3>API Performance</h3>
    <el-table :data="apiMetrics" style="width: 100%">
      <el-table-column prop="url" label="URL" min-width="200" />
      <el-table-column prop="duration" label="Duration (ms)" width="120" />
      <el-table-column prop="size" label="Size (KB)" width="100">
        <template #default="{ row }">
          {{ Math.round(row.size / 1024) }}
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="Time" width="150">
        <template #default="{ row }">
          {{ new Date(row.timestamp).toLocaleTimeString() }}
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Performance Chart -->
    <el-divider />
    
    <div ref="chartContainer" class="chart-container"></div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import * as echarts from 'echarts/core'

const performance = inject('performance')
const chartContainer = ref()
let chartInstance = null

const metrics = ref({})

const apiMetrics = computed(() => {
  return (metrics.value.APICalls || []).slice(-10) // Show last 10 API calls
})

const refreshMetrics = () => {
  metrics.value = performance.getMetrics()
  updateChart()
}

const formatTime = (time) => {
  if (!time) return 'N/A'
  return `${Math.round(time)}ms`
}

const formatCLS = (cls) => {
  if (!cls) return 'N/A'
  return cls.toFixed(3)
}

const getLCPClass = (lcp) => {
  if (!lcp) return ''
  if (lcp < 2500) return 'good'
  if (lcp < 4000) return 'needs-improvement'
  return 'poor'
}

const getFIDClass = (fid) => {
  if (!fid) return ''
  if (fid < 100) return 'good'
  if (fid < 300) return 'needs-improvement'
  return 'poor'
}

const getCLSClass = (cls) => {
  if (!cls) return ''
  if (cls < 0.1) return 'good'
  if (cls < 0.25) return 'needs-improvement'
  return 'poor'
}

const updateChart = () => {
  if (!chartInstance) return
  
  const apiCalls = metrics.value.APICalls || []
  const chartData = apiCalls.map(call => ({
    name: call.url.split('/').pop(),
    value: [new Date(call.timestamp), call.duration]
  }))
  
  chartInstance.setOption({
    title: {
      text: 'API Response Times'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const point = params[0]
        return `${point.seriesName}<br/>${point.data.name}: ${point.data.value[1]}ms`
      }
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value',
      name: 'Response Time (ms)'
    },
    series: [{
      name: 'API Calls',
      type: 'scatter',
      data: chartData
    }]
  })
}

onMounted(() => {
  chartInstance = echarts.init(chartContainer.value)
  refreshMetrics()
  
  // Auto-refresh every 30 seconds
  const interval = setInterval(refreshMetrics, 30000)
  
  onUnmounted(() => {
    clearInterval(interval)
    chartInstance?.dispose()
  })
})
</script>

<style scoped>
.performance-dashboard {
  margin: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.metric-value.good {
  color: #67c23a;
}

.metric-value.needs-improvement {
  color: #e6a23c;
}

.metric-value.poor {
  color: #f56c6c;
}

.metric-threshold {
  font-size: 12px;
  color: #909399;
}

.chart-container {
  height: 300px;
  margin-top: 20px;
}
</style>
```

## Best Practices Summary

### 1. Bundle Optimization
- Use tree shaking and code splitting
- Import only necessary Element Plus components
- Optimize CSS and use custom themes
- Configure build tools properly

### 2. Runtime Performance
- Implement virtual scrolling for large lists
- Use lazy loading for components and images
- Optimize form handling with debouncing
- Implement proper caching strategies

### 3. Memory Management
- Clean up event listeners and timers
- Dispose of chart instances and observers
- Use appropriate reactivity APIs
- Implement proper component lifecycle management

### 4. Network Optimization
- Batch and deduplicate requests
- Implement request caching
- Optimize image loading
- Use compression and CDN

### 5. Monitoring and Measurement
- Track Core Web Vitals
- Monitor API performance
- Implement performance dashboards
- Set up alerts for performance regressions

By following these performance best practices, you can ensure your Element Plus application delivers excellent user experience with fast load times, smooth interactions, and efficient resource usage.