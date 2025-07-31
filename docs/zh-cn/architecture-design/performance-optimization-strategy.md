# 第39天：Element Plus 性能优化策略

## 学习目标
- 深入理解 Element Plus 性能优化原理
- 掌握组件级性能优化技术
- 学习应用级性能优化策略
- 实践性能监控与分析

## 学习内容

### 1. Element Plus 性能优化概述

#### 1.1 性能优化维度
```typescript
// 性能优化的四个维度
interface PerformanceOptimization {
  // 1. 加载性能 - Loading Performance
  loading: {
    bundleSize: number      // 包体积优化
    codesplitting: boolean // 代码分割
    lazyLoading: boolean   // 懒加载
    treeshaking: boolean   // 树摇优化
  }
  
  // 2. 渲染性能 - Rendering Performance
  rendering: {
    virtualScrolling: boolean  // 虚拟滚动
    componentCaching: boolean  // 组件缓存
    updateOptimization: boolean // 更新优化
    memoryManagement: boolean  // 内存管理
  }
  
  // 3. 交互性能 - Interaction Performance
  interaction: {
    debouncing: boolean    // 防抖
    throttling: boolean    // 节流
    eventOptimization: boolean // 事件优化
    asyncProcessing: boolean   // 异步处理
  }
  
  // 4. 网络性能 - Network Performance
  network: {
    requestOptimization: boolean // 请求优化
    caching: boolean            // 缓存策略
    compression: boolean        // 压缩
    cdn: boolean               // CDN 使用
  }
}
```

#### 1.2 性能监控指标
```typescript
// 性能监控指标定义
interface PerformanceMetrics {
  // Core Web Vitals
  coreWebVitals: {
    LCP: number  // Largest Contentful Paint
    FID: number  // First Input Delay
    CLS: number  // Cumulative Layout Shift
  }
  
  // 自定义指标
  customMetrics: {
    componentMountTime: number    // 组件挂载时间
    tableRenderTime: number      // 表格渲染时间
    formValidationTime: number   // 表单验证时间
    dialogOpenTime: number       // 弹窗打开时间
  }
  
  // 资源指标
  resourceMetrics: {
    bundleSize: number          // 包体积
    memoryUsage: number         // 内存使用
    networkRequests: number     // 网络请求数
    cacheHitRate: number        // 缓存命中率
  }
}

// 性能监控工具
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    coreWebVitals: { LCP: 0, FID: 0, CLS: 0 },
    customMetrics: { componentMountTime: 0, tableRenderTime: 0, formValidationTime: 0, dialogOpenTime: 0 },
    resourceMetrics: { bundleSize: 0, memoryUsage: 0, networkRequests: 0, cacheHitRate: 0 }
  }
  
  // 测量组件渲染时间
  measureComponentRender<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    console.log(`${name} render time: ${end - start}ms`)
    return result
  }
  
  // 测量异步操作时间
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`${name} async time: ${end - start}ms`)
    return result
  }
  
  // 监控内存使用
  monitorMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.resourceMetrics.memoryUsage = memory.usedJSHeapSize
      
      console.log('Memory usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      })
    }
  }
  
  // 监控 Core Web Vitals
  monitorCoreWebVitals() {
    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.coreWebVitals.LCP = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })
    
    // FID
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        this.metrics.coreWebVitals.FID = entry.processingStart - entry.startTime
      })
    }).observe({ entryTypes: ['first-input'] })
    
    // CLS
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          this.metrics.coreWebVitals.CLS += entry.value
        }
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

const performanceMonitor = new PerformanceMonitor()
export { performanceMonitor }
```

### 2. 组件级性能优化

#### 2.1 组件懒加载优化
```typescript
// 组件懒加载策略
import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { ElLoading } from 'element-plus'

// 基础懒加载
const LazyTable = defineAsyncComponent(() => import('./components/DataTable.vue'))

// 带加载状态的懒加载
const LazyTableWithLoading = defineAsyncComponent({
  loader: () => import('./components/DataTable.vue'),
  loadingComponent: {
    template: `
      <div v-loading="true" style="height: 200px;">
        <div>加载中...</div>
      </div>
    `
  },
  errorComponent: {
    template: `
      <div class="error-component">
        <el-alert title="组件加载失败" type="error" show-icon />
      </div>
    `
  },
  delay: 200,
  timeout: 3000
})

// 条件懒加载
const ConditionalLazyComponent = defineAsyncComponent({
  loader: () => {
    // 根据条件决定加载哪个组件
    if (window.innerWidth > 768) {
      return import('./components/DesktopTable.vue')
    } else {
      return import('./components/MobileTable.vue')
    }
  }
})

// 预加载策略
class ComponentPreloader {
  private preloadedComponents = new Map<string, Promise<any>>()
  
  // 预加载组件
  preload(name: string, loader: AsyncComponentLoader) {
    if (!this.preloadedComponents.has(name)) {
      this.preloadedComponents.set(name, loader())
    }
    return this.preloadedComponents.get(name)!
  }
  
  // 获取预加载的组件
  getPreloaded(name: string) {
    return this.preloadedComponents.get(name)
  }
  
  // 清理预加载缓存
  clear() {
    this.preloadedComponents.clear()
  }
}

const preloader = new ComponentPreloader()

// 使用预加载
const PreloadedChart = defineAsyncComponent({
  loader: () => preloader.preload('chart', () => import('./components/Chart.vue'))
})
```

#### 2.2 虚拟滚动优化
```vue
<!-- VirtualTable.vue - 虚拟滚动表格 -->
<template>
  <div class="virtual-table" ref="containerRef">
    <div 
      class="virtual-table__wrapper"
      :style="{ height: `${totalHeight}px` }"
    >
      <div 
        class="virtual-table__content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <el-table
          :data="visibleData"
          :height="containerHeight"
          @scroll="handleScroll"
        >
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

interface TableColumn {
  prop: string
  label: string
  width?: number
}

interface Props {
  data: any[]
  columns: TableColumn[]
  itemHeight?: number
  containerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  containerHeight: 400
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(props.containerHeight)

// 计算可见区域
const visibleCount = computed(() => {
  return Math.ceil(containerHeight.value / props.itemHeight) + 2
})

const startIndex = computed(() => {
  return Math.floor(scrollTop.value / props.itemHeight)
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + visibleCount.value, props.data.length)
})

const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value)
})

const totalHeight = computed(() => {
  return props.data.length * props.itemHeight
})

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight
})

// 滚动处理
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

// 响应式容器高度
const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

const resizeObserver = new ResizeObserver(updateContainerHeight)

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
</script>

<style scoped>
.virtual-table {
  height: 100%;
  overflow: hidden;
}

.virtual-table__wrapper {
  position: relative;
  overflow: auto;
}

.virtual-table__content {
  position: relative;
}
</style>
```

#### 2.3 组件缓存优化
```vue
<!-- CachedComponents.vue - 组件缓存示例 -->
<template>
  <div class="cached-components">
    <!-- 使用 KeepAlive 缓存组件 -->
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="用户管理" name="users">
        <KeepAlive :include="cacheIncludes">
          <UserManagement v-if="activeTab === 'users'" />
        </KeepAlive>
      </el-tab-pane>
      
      <el-tab-pane label="订单管理" name="orders">
        <KeepAlive :include="cacheIncludes">
          <OrderManagement v-if="activeTab === 'orders'" />
        </KeepAlive>
      </el-tab-pane>
      
      <el-tab-pane label="数据分析" name="analytics">
        <!-- 数据分析组件不缓存，每次都重新加载 -->
        <DataAnalytics v-if="activeTab === 'analytics'" />
      </el-tab-pane>
    </el-tabs>
    
    <!-- 手动缓存管理 -->
    <div class="cache-controls">
      <el-button @click="clearCache">清理缓存</el-button>
      <el-button @click="refreshCurrentTab">刷新当前页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTabs, ElTabPane, ElButton } from 'element-plus'
import UserManagement from './UserManagement.vue'
import OrderManagement from './OrderManagement.vue'
import DataAnalytics from './DataAnalytics.vue'

const activeTab = ref('users')
const cacheIncludes = ref(['UserManagement', 'OrderManagement'])
const refreshKey = ref(0)

// 标签切换处理
const handleTabChange = (tabName: string) => {
  console.log(`Switched to tab: ${tabName}`)
  
  // 记录用户行为，用于缓存策略优化
  recordTabUsage(tabName)
}

// 清理缓存
const clearCache = () => {
  cacheIncludes.value = []
  setTimeout(() => {
    cacheIncludes.value = ['UserManagement', 'OrderManagement']
  }, 100)
}

// 刷新当前标签页
const refreshCurrentTab = () => {
  const currentComponent = getComponentNameByTab(activeTab.value)
  if (currentComponent) {
    // 临时从缓存中移除
    const index = cacheIncludes.value.indexOf(currentComponent)
    if (index > -1) {
      cacheIncludes.value.splice(index, 1)
      setTimeout(() => {
        cacheIncludes.value.push(currentComponent)
      }, 100)
    }
  }
}

// 根据标签页获取组件名
const getComponentNameByTab = (tabName: string): string | null => {
  const mapping: Record<string, string> = {
    users: 'UserManagement',
    orders: 'OrderManagement'
  }
  return mapping[tabName] || null
}

// 记录标签页使用情况
const recordTabUsage = (tabName: string) => {
  const usage = JSON.parse(localStorage.getItem('tabUsage') || '{}')
  usage[tabName] = (usage[tabName] || 0) + 1
  localStorage.setItem('tabUsage', JSON.stringify(usage))
}
</script>
```

### 3. 表格性能优化

#### 3.1 大数据表格优化
```vue
<!-- OptimizedTable.vue - 优化的大数据表格 -->
<template>
  <div class="optimized-table">
    <!-- 搜索和过滤 -->
    <div class="table-controls">
      <el-input
        v-model="searchText"
        placeholder="搜索..."
        :debounce="300"
        @input="handleSearch"
        clearable
      />
      
      <el-select
        v-model="pageSize"
        @change="handlePageSizeChange"
      >
        <el-option label="10" :value="10" />
        <el-option label="20" :value="20" />
        <el-option label="50" :value="50" />
        <el-option label="100" :value="100" />
      </el-select>
    </div>
    
    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="paginatedData"
      :height="tableHeight"
      v-loading="loading"
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      row-key="id"
      lazy
    >
      <el-table-column type="selection" width="55" fixed />
      
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sortable"
        :fixed="column.fixed"
      >
        <template #default="{ row }" v-if="column.render">
          <component :is="column.render" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredData.length"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElTable, ElTableColumn, ElInput, ElSelect, ElOption, ElPagination } from 'element-plus'
import { debounce } from 'lodash-es'

interface TableColumn {
  prop: string
  label: string
  width?: number
  sortable?: boolean
  fixed?: boolean | string
  render?: any
}

interface Props {
  data: any[]
  columns: TableColumn[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400
})

const emit = defineEmits(['selection-change', 'sort-change'])

const tableRef = ref()
const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const sortConfig = ref({ prop: '', order: '' })
const selectedRows = ref([])
const tableHeight = ref(props.height)

// 可见列管理
const visibleColumns = computed(() => {
  // 根据屏幕宽度动态调整可见列
  const screenWidth = window.innerWidth
  if (screenWidth < 768) {
    return props.columns.slice(0, 3) // 移动端只显示前3列
  } else if (screenWidth < 1024) {
    return props.columns.slice(0, 5) // 平板显示前5列
  }
  return props.columns // 桌面端显示所有列
})

// 数据过滤
const filteredData = computed(() => {
  let data = [...props.data]
  
  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(search)
      )
    })
  }
  
  // 排序
  if (sortConfig.value.prop) {
    data.sort((a, b) => {
      const aVal = a[sortConfig.value.prop]
      const bVal = b[sortConfig.value.prop]
      const order = sortConfig.value.order === 'ascending' ? 1 : -1
      
      if (aVal < bVal) return -1 * order
      if (aVal > bVal) return 1 * order
      return 0
    })
  }
  
  return data
})

// 分页数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 防抖搜索
const handleSearch = debounce(() => {
  currentPage.value = 1
  loading.value = true
  
  // 模拟异步搜索
  setTimeout(() => {
    loading.value = false
  }, 300)
}, 300)

// 排序处理
const handleSortChange = ({ prop, order }) => {
  sortConfig.value = { prop, order }
  emit('sort-change', { prop, order })
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

// 分页处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  
  // 滚动到顶部
  if (tableRef.value) {
    tableRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 响应式表格高度
const updateTableHeight = () => {
  const windowHeight = window.innerHeight
  const headerHeight = 60
  const controlsHeight = 60
  const paginationHeight = 60
  const padding = 40
  
  tableHeight.value = windowHeight - headerHeight - controlsHeight - paginationHeight - padding
}

const resizeHandler = debounce(updateTableHeight, 100)

onMounted(() => {
  updateTableHeight()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})

// 监听数据变化，重置分页
watch(() => props.data, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.optimized-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
}

.el-table {
  flex: 1;
}

.el-pagination {
  margin-top: 16px;
  justify-content: center;
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
```

#### 3.2 表格数据缓存策略
```typescript
// tableCache.ts - 表格数据缓存管理
interface CacheItem<T> {
  data: T
  timestamp: number
  expiry: number
}

class TableDataCache {
  private cache = new Map<string, CacheItem<any>>()
  private maxSize = 50 // 最大缓存项数
  private defaultExpiry = 5 * 60 * 1000 // 5分钟过期
  
  // 设置缓存
  set<T>(key: string, data: T, expiry?: number): void {
    // 清理过期缓存
    this.cleanup()
    
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: expiry || this.defaultExpiry
    })
  }
  
  // 获取缓存
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  // 删除缓存
  delete(key: string): boolean {
    return this.cache.delete(key)
  }
  
  // 清理过期缓存
  private cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry) {
        this.cache.delete(key)
      }
    }
  }
  
  // 清空所有缓存
  clear(): void {
    this.cache.clear()
  }
  
  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys())
    }
  }
}

// 表格数据管理器
class TableDataManager {
  private cache = new TableDataCache()
  private loadingStates = new Map<string, boolean>()
  
  // 获取表格数据
  async getData(key: string, fetcher: () => Promise<any>, useCache = true): Promise<any> {
    // 检查缓存
    if (useCache) {
      const cached = this.cache.get(key)
      if (cached) {
        console.log(`Cache hit for key: ${key}`)
        return cached
      }
    }
    
    // 检查是否正在加载
    if (this.loadingStates.get(key)) {
      console.log(`Already loading for key: ${key}`)
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loadingStates.get(key)) {
            const cached = this.cache.get(key)
            resolve(cached)
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }
    
    // 开始加载
    this.loadingStates.set(key, true)
    
    try {
      console.log(`Fetching data for key: ${key}`)
      const data = await fetcher()
      
      // 缓存数据
      if (useCache) {
        this.cache.set(key, data)
      }
      
      return data
    } finally {
      this.loadingStates.set(key, false)
    }
  }
  
  // 预加载数据
  async preloadData(key: string, fetcher: () => Promise<any>): Promise<void> {
    if (!this.cache.get(key) && !this.loadingStates.get(key)) {
      await this.getData(key, fetcher, true)
    }
  }
  
  // 刷新数据
  async refreshData(key: string, fetcher: () => Promise<any>): Promise<any> {
    this.cache.delete(key)
    return this.getData(key, fetcher, true)
  }
  
  // 清理缓存
  clearCache(pattern?: string): void {
    if (pattern) {
      const regex = new RegExp(pattern)
      const stats = this.cache.getStats()
      stats.keys.forEach(key => {
        if (regex.test(key)) {
          this.cache.delete(key)
        }
      })
    } else {
      this.cache.clear()
    }
  }
}

const tableDataManager = new TableDataManager()
export { tableDataManager }
```

### 4. 表单性能优化

#### 4.1 表单验证优化
```vue
<!-- OptimizedForm.vue - 优化的表单组件 -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="computedRules"
    label-width="120px"
    @validate="handleValidate"
  >
    <el-form-item
      v-for="field in formFields"
      :key="field.prop"
      :label="field.label"
      :prop="field.prop"
      :required="field.required"
    >
      <component
        :is="getFieldComponent(field.type)"
        v-model="formData[field.prop]"
        v-bind="field.props"
        @blur="handleFieldBlur(field.prop)"
        @change="handleFieldChange(field.prop)"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        提交
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElForm, ElFormItem, ElButton, ElInput, ElSelect, ElDatePicker } from 'element-plus'
import { debounce } from 'lodash-es'

interface FormField {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'textarea'
  required?: boolean
  rules?: any[]
  props?: Record<string, any>
}

interface Props {
  fields: FormField[]
  initialData?: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['submit', 'validate'])

const formRef = ref()
const formData = ref<Record<string, any>>({})
const submitting = ref(false)
const validationErrors = ref<Record<string, string>>({})
const validatedFields = ref(new Set<string>())

// 初始化表单数据
const initFormData = () => {
  const data: Record<string, any> = {}
  props.fields.forEach(field => {
    data[field.prop] = props.initialData?.[field.prop] || getDefaultValue(field.type)
  })
  formData.value = data
}

// 获取默认值
const getDefaultValue = (type: string) => {
  switch (type) {
    case 'input':
    case 'textarea':
      return ''
    case 'select':
      return null
    case 'date':
      return null
    default:
      return ''
  }
}

// 获取字段组件
const getFieldComponent = (type: string) => {
  const components = {
    input: ElInput,
    textarea: ElInput,
    select: ElSelect,
    date: ElDatePicker
  }
  return components[type] || ElInput
}

// 计算验证规则
const computedRules = computed(() => {
  const rules: Record<string, any[]> = {}
  
  props.fields.forEach(field => {
    const fieldRules = [...(field.rules || [])]
    
    // 添加必填验证
    if (field.required) {
      fieldRules.unshift({
        required: true,
        message: `请输入${field.label}`,
        trigger: ['blur', 'change']
      })
    }
    
    rules[field.prop] = fieldRules
  })
  
  return rules
})

// 表单字段配置
const formFields = computed(() => props.fields)

// 防抖验证
const debouncedValidate = debounce((prop: string) => {
  if (formRef.value) {
    formRef.value.validateField(prop, (valid: boolean, error: any) => {
      if (valid) {
        delete validationErrors.value[prop]
      } else {
        validationErrors.value[prop] = error[prop][0].message
      }
      validatedFields.value.add(prop)
    })
  }
}, 300)

// 字段失焦处理
const handleFieldBlur = (prop: string) => {
  debouncedValidate(prop)
}

// 字段变化处理
const handleFieldChange = (prop: string) => {
  // 如果字段已经验证过，立即重新验证
  if (validatedFields.value.has(prop)) {
    debouncedValidate(prop)
  }
}

// 验证处理
const handleValidate = (prop: string, valid: boolean, message: string) => {
  emit('validate', { prop, valid, message })
}

// 提交处理
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    submitting.value = true
    
    // 验证表单
    const valid = await new Promise((resolve) => {
      formRef.value.validate((valid: boolean) => {
        resolve(valid)
      })
    })
    
    if (valid) {
      emit('submit', { ...formData.value })
    }
  } finally {
    submitting.value = false
  }
}

// 重置处理
const handleReset = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    validationErrors.value = {}
    validatedFields.value.clear()
  }
}

// 监听初始数据变化
watch(() => props.initialData, initFormData, { immediate: true })
watch(() => props.fields, initFormData)
</script>
```

#### 4.2 动态表单优化
```typescript
// dynamicForm.ts - 动态表单优化
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'

interface DynamicField {
  id: string
  type: string
  label: string
  value: any
  visible: boolean
  disabled: boolean
  rules: any[]
  dependencies: string[]
}

class DynamicFormManager {
  private fields = ref<Map<string, DynamicField>>(new Map())
  private fieldOrder = ref<string[]>([])
  private validationCache = new Map<string, { result: boolean, timestamp: number }>()
  private dependencyGraph = new Map<string, Set<string>>()
  
  // 添加字段
  addField(field: DynamicField) {
    this.fields.value.set(field.id, field)
    this.fieldOrder.value.push(field.id)
    this.updateDependencyGraph(field)
  }
  
  // 移除字段
  removeField(fieldId: string) {
    this.fields.value.delete(fieldId)
    const index = this.fieldOrder.value.indexOf(fieldId)
    if (index > -1) {
      this.fieldOrder.value.splice(index, 1)
    }
    this.dependencyGraph.delete(fieldId)
  }
  
  // 更新字段
  updateField(fieldId: string, updates: Partial<DynamicField>) {
    const field = this.fields.value.get(fieldId)
    if (field) {
      Object.assign(field, updates)
      if (updates.dependencies) {
        this.updateDependencyGraph(field)
      }
    }
  }
  
  // 获取可见字段
  getVisibleFields = computed(() => {
    return this.fieldOrder.value
      .map(id => this.fields.value.get(id)!)
      .filter(field => field.visible)
  })
  
  // 更新依赖图
  private updateDependencyGraph(field: DynamicField) {
    // 清理旧的依赖关系
    for (const [key, deps] of this.dependencyGraph.entries()) {
      deps.delete(field.id)
    }
    
    // 建立新的依赖关系
    field.dependencies.forEach(depId => {
      if (!this.dependencyGraph.has(depId)) {
        this.dependencyGraph.set(depId, new Set())
      }
      this.dependencyGraph.get(depId)!.add(field.id)
    })
  }
  
  // 字段值变化处理
  handleFieldChange = debounce((fieldId: string, value: any) => {
    const field = this.fields.value.get(fieldId)
    if (field) {
      field.value = value
      
      // 更新依赖字段
      this.updateDependentFields(fieldId)
      
      // 清理相关验证缓存
      this.clearValidationCache(fieldId)
    }
  }, 100)
  
  // 更新依赖字段
  private updateDependentFields(fieldId: string) {
    const dependents = this.dependencyGraph.get(fieldId)
    if (dependents) {
      dependents.forEach(depId => {
        const depField = this.fields.value.get(depId)
        if (depField) {
          // 重新计算字段状态
          this.recalculateFieldState(depField)
        }
      })
    }
  }
  
  // 重新计算字段状态
  private recalculateFieldState(field: DynamicField) {
    // 根据依赖字段的值重新计算可见性和禁用状态
    const dependencyValues = field.dependencies.map(depId => {
      const depField = this.fields.value.get(depId)
      return depField ? depField.value : null
    })
    
    // 这里可以根据业务逻辑计算字段状态
    // 示例：如果依赖字段有值，则显示当前字段
    field.visible = dependencyValues.some(value => value !== null && value !== '')
  }
  
  // 验证字段
  async validateField(fieldId: string): Promise<boolean> {
    const field = this.fields.value.get(fieldId)
    if (!field) return false
    
    // 检查验证缓存
    const cached = this.validationCache.get(fieldId)
    if (cached && Date.now() - cached.timestamp < 1000) {
      return cached.result
    }
    
    // 执行验证
    let isValid = true
    for (const rule of field.rules) {
      if (typeof rule.validator === 'function') {
        try {
          await rule.validator(field.value)
        } catch (error) {
          isValid = false
          break
        }
      }
    }
    
    // 缓存验证结果
    this.validationCache.set(fieldId, {
      result: isValid,
      timestamp: Date.now()
    })
    
    return isValid
  }
  
  // 清理验证缓存
  private clearValidationCache(fieldId: string) {
    this.validationCache.delete(fieldId)
    
    // 清理依赖字段的缓存
    const dependents = this.dependencyGraph.get(fieldId)
    if (dependents) {
      dependents.forEach(depId => {
        this.validationCache.delete(depId)
      })
    }
  }
  
  // 获取表单数据
  getFormData() {
    const data: Record<string, any> = {}
    this.fields.value.forEach((field, id) => {
      if (field.visible) {
        data[id] = field.value
      }
    })
    return data
  }
  
  // 重置表单
  reset() {
    this.fields.value.forEach(field => {
      field.value = this.getDefaultValue(field.type)
    })
    this.validationCache.clear()
  }
  
  private getDefaultValue(type: string) {
    switch (type) {
      case 'string': return ''
      case 'number': return 0
      case 'boolean': return false
      case 'array': return []
      case 'object': return {}
      default: return null
    }
  }
}

export { DynamicFormManager }
```

### 5. 网络请求优化

#### 5.1 请求缓存与去重
```typescript
// requestOptimizer.ts - 请求优化器
interface RequestConfig {
  url: string
  method: string
  params?: any
  data?: any
  headers?: Record<string, string>
  cache?: boolean
  cacheTTL?: number
}

interface CachedResponse {
  data: any
  timestamp: number
  ttl: number
}

class RequestOptimizer {
  private cache = new Map<string, CachedResponse>()
  private pendingRequests = new Map<string, Promise<any>>()
  private requestQueue: RequestConfig[] = []
  private isProcessing = false
  private maxConcurrent = 6
  private activeRequests = 0
  
  // 生成缓存键
  private getCacheKey(config: RequestConfig): string {
    const { url, method, params, data } = config
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
  }
  
  // 检查缓存
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  // 设置缓存
  private setCache(key: string, data: any, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  // 发送请求
  async request(config: RequestConfig): Promise<any> {
    const cacheKey = this.getCacheKey(config)
    
    // 检查缓存
    if (config.cache !== false) {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log(`Cache hit: ${cacheKey}`)
        return cached
      }
    }
    
    // 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`Request deduplication: ${cacheKey}`)
      return this.pendingRequests.get(cacheKey)!
    }
    
    // 创建请求 Promise
    const requestPromise = this.executeRequest(config)
    this.pendingRequests.set(cacheKey, requestPromise)
    
    try {
      const result = await requestPromise
      
      // 缓存结果
      if (config.cache !== false) {
        const ttl = config.cacheTTL || 5 * 60 * 1000 // 默认5分钟
        this.setCache(cacheKey, result, ttl)
      }
      
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
  
  // 执行请求
  private async executeRequest(config: RequestConfig): Promise<any> {
    // 如果达到并发限制，加入队列
    if (this.activeRequests >= this.maxConcurrent) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({
          ...config,
          resolve,
          reject
        } as any)
      })
    }
    
    this.activeRequests++
    
    try {
      // 实际的 HTTP 请求
      const response = await fetch(config.url, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        },
        body: config.data ? JSON.stringify(config.data) : undefined
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } finally {
      this.activeRequests--
      this.processQueue()
    }
  }
  
  // 处理请求队列
  private processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const config = this.requestQueue.shift()!
      this.executeRequest(config)
        .then((config as any).resolve)
        .catch((config as any).reject)
    }
  }
  
  // 批量请求
  async batchRequest(configs: RequestConfig[]): Promise<any[]> {
    const promises = configs.map(config => this.request(config))
    return Promise.all(promises)
  }
  
  // 清理缓存
  clearCache(pattern?: string) {
    if (pattern) {
      const regex = new RegExp(pattern)
      for (const key of this.cache.keys()) {
        if (regex.test(key)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }
  
  // 预加载
  async preload(configs: RequestConfig[]) {
    const promises = configs.map(config => 
      this.request({ ...config, cache: true })
    )
    
    // 不等待结果，只是触发请求
    Promise.all(promises).catch(console.error)
  }
  
  // 获取缓存统计
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      pendingRequests: this.pendingRequests.size,
      queueLength: this.requestQueue.length,
      activeRequests: this.activeRequests
    }
  }
}

const requestOptimizer = new RequestOptimizer()
export { requestOptimizer }
```

## 学习资源
- [Vue 3 性能优化指南](https://cn.vuejs.org/guide/best-practices/performance.html)
- [Element Plus 性能最佳实践](https://element-plus.org/zh-CN/guide/performance.html)
- [Web Performance API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance)
- [Chrome DevTools 性能分析](https://developer.chrome.com/docs/devtools/performance/)

## 作业
1. 实现一个虚拟滚动的表格组件
2. 优化现有项目的表单验证性能
3. 建立性能监控体系
4. 分析并优化组件的内存使用

## 下一步
明天我们将学习 Element Plus 的工程化配置与构建优化。