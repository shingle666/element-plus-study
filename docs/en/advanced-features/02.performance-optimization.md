# Performance Optimization

## Overview

Element Plus is designed with performance in mind, but there are many strategies you can employ to optimize your application's performance when using the library. This guide covers various optimization techniques, from basic setup to advanced patterns.

## Bundle Optimization

### Tree Shaking

Element Plus supports tree shaking out of the box when using ES modules:

```javascript
// ✅ Good - Only imports what you need
import { ElButton, ElInput, ElForm } from 'element-plus'

// ❌ Avoid - Imports entire library
import ElementPlus from 'element-plus'
```

### Auto Import (Recommended)

Use the official auto-import plugin for optimal bundle size:

```bash
npm install -D unplugin-vue-components unplugin-auto-import
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

### Manual Import

For fine-grained control over imports:

```javascript
// main.js
import { createApp } from 'vue'
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElTable,
  ElTableColumn
} from 'element-plus'

// Import only the CSS for components you use
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/form/style/css'
import 'element-plus/es/components/form-item/style/css'
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'

const app = createApp(App)

app.use(ElButton)
app.use(ElInput)
app.use(ElForm)
app.use(ElFormItem)
app.use(ElTable)
app.use(ElTableColumn)
```

### CSS Optimization

```javascript
// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "element-plus/theme-chalk/src/index.scss" as *;
        `,
      },
    },
  },
  build: {
    cssCodeSplit: true, // Split CSS into separate chunks
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})
```

## Component-Level Optimization

### Lazy Loading Components

```vue
<template>
  <div>
    <!-- Load heavy components only when needed -->
    <el-button @click="showChart = true">Show Chart</el-button>
    
    <Suspense v-if="showChart">
      <template #default>
        <LazyChart :data="chartData" />
      </template>
      <template #fallback>
        <el-skeleton :rows="5" animated />
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const showChart = ref(false)
const chartData = ref([])

// Lazy load heavy components
const LazyChart = defineAsyncComponent(() => import('./components/Chart.vue'))
</script>
```

### Virtual Scrolling for Large Lists

```vue
<template>
  <div class="virtual-list-container">
    <el-virtual-list
      :data="items"
      :height="400"
      :item-size="50"
      v-slot="{ item, index }"
    >
      <div class="list-item" :key="index">
        <el-avatar :src="item.avatar" />
        <div class="item-content">
          <h4>{{ item.name }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </el-virtual-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Large dataset
const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  description: `Description for user ${i}`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
})))
</script>

<style scoped>
.virtual-list-container {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.item-content {
  margin-left: 12px;
}

.item-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.item-content p {
  margin: 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
```

### Optimized Table Performance

```vue
<template>
  <div>
    <!-- Use virtual scrolling for large datasets -->
    <el-table
      :data="visibleData"
      height="400"
      v-loading="loading"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        sortable="custom"
      />
      <el-table-column
        prop="name"
        label="Name"
        min-width="120"
        sortable="custom"
        :filters="nameFilters"
        :filter-method="filterName"
      >
        <template #default="{ row }">
          <!-- Use v-memo for expensive renders -->
          <div v-memo="[row.name, row.status]">
            <el-tag :type="getStatusType(row.status)">{{ row.name }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
        min-width="200"
      />
      <el-table-column
        prop="status"
        label="Status"
        width="100"
        :filters="statusFilters"
        :filter-method="filterStatus"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="editUser(row)">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Pagination for better performance -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredData.length"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const sortField = ref('')
const sortOrder = ref('')
const filters = ref({})

// Large dataset simulation
const allData = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: ['active', 'inactive', 'pending'][i % 3]
})))

// Computed properties for performance
const filteredData = computed(() => {
  let result = allData.value
  
  // Apply filters
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key] && filters.value[key].length > 0) {
      result = result.filter(item => filters.value[key].includes(item[key]))
    }
  })
  
  // Apply sorting
  if (sortField.value) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]
      
      if (sortOrder.value === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  return result
})

// Paginated data
const visibleData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// Filter options
const nameFilters = computed(() => {
  const names = [...new Set(allData.value.map(item => item.name))]
  return names.slice(0, 10).map(name => ({ text: name, value: name }))
})

const statusFilters = [
  { text: 'Active', value: 'active' },
  { text: 'Inactive', value: 'inactive' },
  { text: 'Pending', value: 'pending' }
]

// Event handlers
const handleSortChange = ({ prop, order }) => {
  sortField.value = prop
  sortOrder.value = order
}

const handleFilterChange = (filterValues) => {
  filters.value = filterValues
  currentPage.value = 1 // Reset to first page
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const filterName = (value, row) => {
  return row.name === value
}

const filterStatus = (value, row) => {
  return row.status === value
}

const getStatusType = (status) => {
  const types = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning'
  }
  return types[status] || 'info'
}

const editUser = (user) => {
  console.log('Edit user:', user)
}

// Watch for performance monitoring
watch(visibleData, () => {
  console.log(`Rendering ${visibleData.value.length} items`)
})
</script>
```

## Memory Management

### Proper Event Cleanup

```vue
<template>
  <div>
    <el-input
      v-model="searchTerm"
      @input="handleSearch"
      placeholder="Search..."
    />
    <div ref="scrollContainer" @scroll="handleScroll">
      <!-- Content -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'

const searchTerm = ref('')
const scrollContainer = ref(null)

// Debounced search to prevent excessive API calls
const handleSearch = debounce((value) => {
  // Perform search
  console.log('Searching for:', value)
}, 300)

// Throttled scroll handler
let scrollTimeout = null
const handleScroll = (event) => {
  if (scrollTimeout) return
  
  scrollTimeout = setTimeout(() => {
    // Handle scroll logic
    console.log('Scroll position:', event.target.scrollTop)
    scrollTimeout = null
  }, 16) // ~60fps
}

// Global event listeners
let resizeHandler = null

onMounted(() => {
  resizeHandler = debounce(() => {
    // Handle window resize
    console.log('Window resized')
  }, 250)
  
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  // Clean up event listeners
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  
  // Cancel pending debounced calls
  handleSearch.cancel()
  
  // Clear timeouts
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>
```

### Efficient State Management

```javascript
// stores/useOptimizedStore.js
import { ref, computed, readonly } from 'vue'

export function useOptimizedStore() {
  // Use refs for reactive state
  const state = ref({
    users: [],
    loading: false,
    error: null
  })
  
  // Memoized computed properties
  const activeUsers = computed(() => {
    return state.value.users.filter(user => user.status === 'active')
  })
  
  const userCount = computed(() => state.value.users.length)
  
  // Actions
  const setUsers = (users) => {
    state.value.users = users
  }
  
  const addUser = (user) => {
    state.value.users.push(user)
  }
  
  const updateUser = (id, updates) => {
    const index = state.value.users.findIndex(user => user.id === id)
    if (index !== -1) {
      // Use Object.assign for better performance than spread
      Object.assign(state.value.users[index], updates)
    }
  }
  
  const removeUser = (id) => {
    const index = state.value.users.findIndex(user => user.id === id)
    if (index !== -1) {
      state.value.users.splice(index, 1)
    }
  }
  
  const setLoading = (loading) => {
    state.value.loading = loading
  }
  
  const setError = (error) => {
    state.value.error = error
  }
  
  // Return readonly state and actions
  return {
    // Readonly state
    state: readonly(state),
    activeUsers,
    userCount,
    
    // Actions
    setUsers,
    addUser,
    updateUser,
    removeUser,
    setLoading,
    setError
  }
}
```

## Image and Asset Optimization

### Lazy Loading Images

```vue
<template>
  <div class="image-gallery">
    <div
      v-for="image in images"
      :key="image.id"
      class="image-item"
    >
      <el-image
        :src="image.url"
        :lazy="true"
        :preview-src-list="previewList"
        :initial-index="image.index"
        fit="cover"
        loading="lazy"
      >
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
        <template #error>
          <div class="image-error">
            <el-icon><Picture /></el-icon>
            <span>Load failed</span>
          </div>
        </template>
      </el-image>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const previewList = computed(() => {
  return props.images.map(img => img.url)
})
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  height: 200px;
}

.image-placeholder,
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
}

.el-image {
  width: 100%;
  height: 100%;
}
</style>
```

### Progressive Image Loading

```vue
<template>
  <div class="progressive-image">
    <el-image
      :src="currentSrc"
      :class="{ 'loaded': isLoaded }"
      @load="handleLoad"
      @error="handleError"
    >
      <template #placeholder>
        <div class="blur-placeholder" :style="placeholderStyle" />
      </template>
    </el-image>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  src: String,
  placeholder: String, // Low-quality placeholder
  blurDataUrl: String // Base64 blur placeholder
})

const isLoaded = ref(false)
const currentSrc = ref(props.placeholder || props.src)

const placeholderStyle = computed(() => {
  if (props.blurDataUrl) {
    return {
      backgroundImage: `url(${props.blurDataUrl})`,
      backgroundSize: 'cover',
      filter: 'blur(10px)'
    }
  }
  return {}
})

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  console.error('Failed to load image:', props.src)
}

onMounted(() => {
  // Load high-quality image
  if (props.placeholder && props.src !== props.placeholder) {
    const img = new Image()
    img.onload = () => {
      currentSrc.value = props.src
    }
    img.src = props.src
  }
})
</script>

<style scoped>
.progressive-image {
  position: relative;
  overflow: hidden;
}

.blur-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.el-image.loaded + .blur-placeholder {
  opacity: 0;
}
</style>
```

## Network Optimization

### Request Batching and Caching

```javascript
// utils/apiOptimizer.js
class ApiOptimizer {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.batchQueue = new Map()
    this.batchTimeout = null
  }
  
  // Cache GET requests
  async get(url, options = {}) {
    const cacheKey = `${url}${JSON.stringify(options)}`
    
    // Return cached result if available and not expired
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (Date.now() - cached.timestamp < (options.cacheTime || 300000)) { // 5 min default
        return cached.data
      }
    }
    
    // Return pending request if already in progress
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }
    
    // Make new request
    const request = fetch(url, options)
      .then(response => response.json())
      .then(data => {
        // Cache the result
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        })
        
        // Remove from pending
        this.pendingRequests.delete(cacheKey)
        
        return data
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey)
        throw error
      })
    
    this.pendingRequests.set(cacheKey, request)
    return request
  }
  
  // Batch multiple requests
  batchRequest(endpoint, ids) {
    return new Promise((resolve) => {
      // Add to batch queue
      ids.forEach(id => {
        if (!this.batchQueue.has(endpoint)) {
          this.batchQueue.set(endpoint, new Set())
        }
        this.batchQueue.get(endpoint).add({ id, resolve })
      })
      
      // Clear existing timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout)
      }
      
      // Set new timeout to process batch
      this.batchTimeout = setTimeout(() => {
        this.processBatch(endpoint)
      }, 50) // 50ms batch window
    })
  }
  
  async processBatch(endpoint) {
    const batch = this.batchQueue.get(endpoint)
    if (!batch || batch.size === 0) return
    
    const ids = Array.from(batch).map(item => item.id)
    const resolvers = new Map(Array.from(batch).map(item => [item.id, item.resolve]))
    
    try {
      // Make batched request
      const response = await fetch(`${endpoint}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })
      
      const results = await response.json()
      
      // Resolve individual promises
      results.forEach(result => {
        const resolver = resolvers.get(result.id)
        if (resolver) {
          resolver(result)
        }
      })
    } catch (error) {
      // Reject all promises in batch
      resolvers.forEach(resolver => {
        resolver(Promise.reject(error))
      })
    }
    
    // Clear batch
    this.batchQueue.delete(endpoint)
  }
  
  // Clear cache
  clearCache() {
    this.cache.clear()
  }
  
  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

export const apiOptimizer = new ApiOptimizer()
```

### Optimized Data Fetching

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      v-loading="loading"
      @sort-change="handleSort"
      @filter-change="handleFilter"
    >
      <!-- Table columns -->
    </el-table>
    
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      @current-change="fetchData"
      @size-change="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { apiOptimizer } from '@/utils/apiOptimizer'

const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const sortField = ref('')
const sortOrder = ref('')
const filters = ref({})

// Debounced fetch to prevent excessive requests
const debouncedFetch = debounce(fetchData, 300)

async function fetchData() {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
      sort: sortField.value,
      order: sortOrder.value,
      ...filters.value
    }
    
    const url = `/api/users?${new URLSearchParams(params)}`
    const response = await apiOptimizer.get(url, { cacheTime: 60000 }) // 1 min cache
    
    tableData.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const handleSort = ({ prop, order }) => {
  sortField.value = prop
  sortOrder.value = order
  debouncedFetch()
}

const handleFilter = (filterValues) => {
  filters.value = filterValues
  currentPage.value = 1
  debouncedFetch()
}

// Watch for changes and fetch data
watch([currentPage, pageSize], fetchData)

onMounted(fetchData)
</script>
```

## Performance Monitoring

### Performance Metrics

```javascript
// utils/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
  }
  
  // Measure component render time
  measureRender(componentName, renderFn) {
    const start = performance.now()
    const result = renderFn()
    const end = performance.now()
    
    this.recordMetric('render', componentName, end - start)
    return result
  }
  
  // Measure API call time
  async measureApiCall(endpoint, apiFn) {
    const start = performance.now()
    try {
      const result = await apiFn()
      const end = performance.now()
      this.recordMetric('api', endpoint, end - start)
      return result
    } catch (error) {
      const end = performance.now()
      this.recordMetric('api-error', endpoint, end - start)
      throw error
    }
  }
  
  // Record metric
  recordMetric(type, name, value) {
    const key = `${type}:${name}`
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    const metrics = this.metrics.get(key)
    metrics.push({
      value,
      timestamp: Date.now()
    })
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift()
    }
  }
  
  // Get performance stats
  getStats(type, name) {
    const key = `${type}:${name}`
    const metrics = this.metrics.get(key) || []
    
    if (metrics.length === 0) return null
    
    const values = metrics.map(m => m.value)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    return { avg, min, max, count: values.length }
  }
  
  // Monitor Core Web Vitals
  observeWebVitals() {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.recordMetric('web-vitals', 'lcp', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.push(lcpObserver)
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.recordMetric('web-vitals', 'fid', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.push(fidObserver)
    
    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.recordMetric('web-vitals', 'cls', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.push(clsObserver)
  }
  
  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
  
  // Export metrics
  exportMetrics() {
    const exported = {}
    this.metrics.forEach((values, key) => {
      const [type, name] = key.split(':')
      if (!exported[type]) exported[type] = {}
      exported[type][name] = this.getStats(type, name)
    })
    return exported
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.observeWebVitals()
}
```

### Performance Dashboard Component

```vue
<template>
  <el-card class="performance-dashboard">
    <template #header>
      <div class="card-header">
        <span>Performance Metrics</span>
        <el-button size="small" @click="refreshMetrics">Refresh</el-button>
      </div>
    </template>
    
    <el-row :gutter="20">
      <el-col :span="8" v-for="(metric, key) in webVitals" :key="key">
        <el-statistic
          :title="metric.title"
          :value="metric.value"
          :precision="2"
          suffix="ms"
          :value-style="getValueStyle(metric.status)"
        >
          <template #prefix>
            <el-icon :color="getStatusColor(metric.status)">
              <component :is="getStatusIcon(metric.status)" />
            </el-icon>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
    
    <el-divider />
    
    <el-table :data="componentMetrics" size="small">
      <el-table-column prop="name" label="Component" />
      <el-table-column prop="avg" label="Avg Render (ms)" width="150">
        <template #default="{ row }">
          {{ row.avg?.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="max" label="Max Render (ms)" width="150">
        <template #default="{ row }">
          {{ row.max?.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="count" label="Renders" width="100" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { performanceMonitor } from '@/utils/performanceMonitor'
import { 
  CheckCircle, 
  WarningFilled, 
  CircleCloseFilled 
} from '@element-plus/icons-vue'

const metrics = ref({})

const webVitals = computed(() => {
  const vitals = metrics.value['web-vitals'] || {}
  
  return {
    lcp: {
      title: 'Largest Contentful Paint',
      value: vitals.lcp?.avg || 0,
      status: getVitalStatus('lcp', vitals.lcp?.avg || 0)
    },
    fid: {
      title: 'First Input Delay',
      value: vitals.fid?.avg || 0,
      status: getVitalStatus('fid', vitals.fid?.avg || 0)
    },
    cls: {
      title: 'Cumulative Layout Shift',
      value: vitals.cls?.avg || 0,
      status: getVitalStatus('cls', vitals.cls?.avg || 0)
    }
  }
})

const componentMetrics = computed(() => {
  const renders = metrics.value.render || {}
  return Object.keys(renders).map(name => ({
    name,
    ...renders[name]
  }))
})

const getVitalStatus = (type, value) => {
  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 }
  }
  
  const threshold = thresholds[type]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

const getStatusColor = (status) => {
  const colors = {
    good: '#67c23a',
    'needs-improvement': '#e6a23c',
    poor: '#f56c6c'
  }
  return colors[status] || '#909399'
}

const getStatusIcon = (status) => {
  const icons = {
    good: CheckCircle,
    'needs-improvement': WarningFilled,
    poor: CircleCloseFilled
  }
  return icons[status] || CheckCircle
}

const getValueStyle = (status) => {
  return {
    color: getStatusColor(status)
  }
}

const refreshMetrics = () => {
  metrics.value = performanceMonitor.exportMetrics()
}

let refreshInterval = null

onMounted(() => {
  refreshMetrics()
  refreshInterval = setInterval(refreshMetrics, 5000) // Refresh every 5 seconds
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
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
</style>
```

## Best Practices Summary

### 1. Bundle Optimization
- Use auto-import plugins for optimal tree shaking
- Import only the components and styles you need
- Split CSS into separate chunks
- Use dynamic imports for code splitting

### 2. Component Performance
- Implement virtual scrolling for large lists
- Use `v-memo` for expensive renders
- Lazy load heavy components
- Optimize table rendering with pagination

### 3. Memory Management
- Clean up event listeners in `onUnmounted`
- Use debounced/throttled event handlers
- Implement proper state management
- Avoid memory leaks in watchers

### 4. Network Optimization
- Cache API responses appropriately
- Batch multiple requests when possible
- Use request deduplication
- Implement progressive loading

### 5. Monitoring
- Track Core Web Vitals
- Monitor component render times
- Measure API call performance
- Set up performance budgets

### 6. Image Optimization
- Use lazy loading for images
- Implement progressive image loading
- Optimize image formats and sizes
- Use appropriate placeholder strategies

By following these optimization strategies, you can ensure your Element Plus applications perform well across different devices and network conditions while providing an excellent user experience.