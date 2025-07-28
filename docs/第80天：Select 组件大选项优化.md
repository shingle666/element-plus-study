# 第80天：Select 组件大选项优化

## 学习目标

- 掌握 Element Plus Select 组件的性能瓶颈分析
- 学习大选项列表的虚拟化技术
- 实现高性能的选择器组件
- 构建智能搜索和过滤机制

## 1. Select 组件性能分析

### 1.1 性能瓶颈识别

```typescript
// Select 性能分析器
class SelectPerformanceAnalyzer {
  private metrics: Map<string, any[]> = new Map()
  private observer: MutationObserver | null = null
  
  constructor() {
    this.initializeMetrics()
  }
  
  private initializeMetrics(): void {
    this.metrics.set('render-time', [])
    this.metrics.set('search-time', [])
    this.metrics.set('scroll-performance', [])
    this.metrics.set('memory-usage', [])
    this.metrics.set('dom-nodes', [])
  }
  
  // 分析选择器性能
  analyzeSelectPerformance(selectElement: HTMLElement, optionsCount: number): any {
    const startTime = performance.now()
    
    const analysis = {
      optionsCount,
      domComplexity: this.analyzeDOMComplexity(selectElement),
      renderPerformance: this.analyzeRenderPerformance(selectElement),
      searchPerformance: this.analyzeSearchPerformance(selectElement),
      memoryUsage: this.analyzeMemoryUsage(),
      scrollPerformance: this.analyzeScrollPerformance(selectElement)
    }
    
    const endTime = performance.now()
    this.recordMetric('render-time', endTime - startTime)
    
    return {
      ...analysis,
      totalAnalysisTime: endTime - startTime,
      recommendations: this.generateRecommendations(analysis)
    }
  }
  
  private analyzeDOMComplexity(element: HTMLElement): any {
    const dropdown = element.querySelector('.el-select-dropdown')
    if (!dropdown) return { nodes: 0, depth: 0, complexity: 'low' }
    
    const allNodes = dropdown.querySelectorAll('*')
    const depth = this.calculateMaxDepth(dropdown)
    
    return {
      nodes: allNodes.length,
      depth,
      complexity: this.calculateComplexity(allNodes.length, depth)
    }
  }
  
  private calculateMaxDepth(element: Element): number {
    let maxDepth = 0
    
    const traverse = (node: Element, depth: number) => {
      maxDepth = Math.max(maxDepth, depth)
      
      for (const child of node.children) {
        traverse(child, depth + 1)
      }
    }
    
    traverse(element, 0)
    return maxDepth
  }
  
  private calculateComplexity(nodeCount: number, depth: number): string {
    const score = nodeCount * 0.1 + depth * 2
    
    if (score < 50) return 'low'
    if (score < 200) return 'medium'
    return 'high'
  }
  
  private analyzeRenderPerformance(element: HTMLElement): any {
    const startTime = performance.now()
    
    // 模拟渲染测试
    const testOptions = this.createTestOptions(1000)
    const renderStart = performance.now()
    
    // 测量渲染时间
    requestAnimationFrame(() => {
      const renderEnd = performance.now()
      this.recordMetric('render-time', renderEnd - renderStart)
    })
    
    return {
      estimatedRenderTime: performance.now() - startTime,
      isOptimal: (performance.now() - startTime) < 16.67 // 60fps
    }
  }
  
  private createTestOptions(count: number): any[] {
    return Array.from({ length: count }, (_, index) => ({
      value: `option-${index}`,
      label: `Option ${index}`,
      disabled: Math.random() > 0.9
    }))
  }
  
  private analyzeSearchPerformance(element: HTMLElement): any {
    const searchInput = element.querySelector('.el-input__inner') as HTMLInputElement
    if (!searchInput) return { supported: false }
    
    const testQueries = ['test', 'option', 'item', 'value']
    const searchTimes: number[] = []
    
    testQueries.forEach(query => {
      const startTime = performance.now()
      
      // 模拟搜索
      searchInput.value = query
      searchInput.dispatchEvent(new Event('input'))
      
      const endTime = performance.now()
      searchTimes.push(endTime - startTime)
    })
    
    const averageSearchTime = searchTimes.reduce((sum, time) => sum + time, 0) / searchTimes.length
    
    return {
      supported: true,
      averageSearchTime,
      maxSearchTime: Math.max(...searchTimes),
      isOptimal: averageSearchTime < 5 // 5ms threshold
    }
  }
  
  private analyzeMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }
    }
    
    return { supported: false }
  }
  
  private analyzeScrollPerformance(element: HTMLElement): Promise<any> {
    return new Promise((resolve) => {
      const dropdown = element.querySelector('.el-select-dropdown__wrap')
      if (!dropdown) {
        resolve({ supported: false })
        return
      }
      
      let frameCount = 0
      const startTime = performance.now()
      
      const measureFrames = () => {
        frameCount++
        
        if (frameCount < 30) {
          dropdown.scrollTop += 10
          requestAnimationFrame(measureFrames)
        } else {
          const endTime = performance.now()
          const fps = 1000 / ((endTime - startTime) / frameCount)
          
          resolve({
            supported: true,
            fps,
            frameTime: (endTime - startTime) / frameCount,
            isSmooth: fps > 55
          })
        }
      }
      
      requestAnimationFrame(measureFrames)
    })
  }
  
  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)!
    values.push({
      value,
      timestamp: Date.now()
    })
    
    // 保留最近50条记录
    if (values.length > 50) {
      values.shift()
    }
  }
  
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []
    
    if (analysis.optionsCount > 1000) {
      recommendations.push('使用虚拟滚动优化大量选项的渲染性能')
    }
    
    if (analysis.domComplexity.complexity === 'high') {
      recommendations.push('简化选项模板，减少DOM复杂度')
    }
    
    if (!analysis.renderPerformance.isOptimal) {
      recommendations.push('优化渲染逻辑，确保60fps的流畅体验')
    }
    
    if (analysis.searchPerformance.supported && !analysis.searchPerformance.isOptimal) {
      recommendations.push('优化搜索算法，使用防抖和索引技术')
    }
    
    if (analysis.scrollPerformance.supported && !analysis.scrollPerformance.isSmooth) {
      recommendations.push('优化滚动性能，考虑使用transform代替scrollTop')
    }
    
    if (analysis.memoryUsage.supported && analysis.memoryUsage.usagePercentage > 80) {
      recommendations.push('注意内存使用，及时清理不必要的引用')
    }
    
    return recommendations
  }
  
  // 获取性能报告
  getPerformanceReport(): any {
    const report: any = {}
    
    for (const [name, values] of this.metrics) {
      if (values.length === 0) continue
      
      const recentValues = values.slice(-10).map((item: any) => item.value)
      
      report[name] = {
        current: recentValues[recentValues.length - 1] || 0,
        average: recentValues.reduce((sum: number, val: number) => sum + val, 0) / recentValues.length,
        min: Math.min(...recentValues),
        max: Math.max(...recentValues),
        samples: recentValues.length
      }
    }
    
    return report
  }
  
  // 清理资源
  dispose(): void {
    this.observer?.disconnect()
    this.metrics.clear()
  }
}
```

### 1.2 选项数据结构优化

```typescript
// 优化的选项数据结构
interface OptimizedOption {
  value: any
  label: string
  disabled?: boolean
  group?: string
  searchText?: string
  index?: number
  visible?: boolean
}

// 选项数据管理器
class OptionDataManager {
  private options: OptimizedOption[] = []
  private searchIndex: Map<string, Set<number>> = new Map()
  private groupIndex: Map<string, number[]> = new Map()
  private visibleOptions: OptimizedOption[] = []
  private searchCache: Map<string, OptimizedOption[]> = new Map()
  
  constructor(options: OptimizedOption[]) {
    this.setOptions(options)
  }
  
  // 设置选项数据
  setOptions(options: OptimizedOption[]): void {
    this.options = options.map((option, index) => ({
      ...option,
      index,
      searchText: this.generateSearchText(option),
      visible: true
    }))
    
    this.buildSearchIndex()
    this.buildGroupIndex()
    this.visibleOptions = [...this.options]
  }
  
  // 生成搜索文本
  private generateSearchText(option: OptimizedOption): string {
    const texts = [option.label]
    
    if (typeof option.value === 'string') {
      texts.push(option.value)
    }
    
    if (option.group) {
      texts.push(option.group)
    }
    
    return texts.join(' ').toLowerCase()
  }
  
  // 构建搜索索引
  private buildSearchIndex(): void {
    this.searchIndex.clear()
    
    this.options.forEach((option, index) => {
      const words = option.searchText!.split(/\s+/)
      
      words.forEach(word => {
        if (word.length > 0) {
          if (!this.searchIndex.has(word)) {
            this.searchIndex.set(word, new Set())
          }
          this.searchIndex.get(word)!.add(index)
        }
      })
    })
  }
  
  // 构建分组索引
  private buildGroupIndex(): void {
    this.groupIndex.clear()
    
    this.options.forEach((option, index) => {
      if (option.group) {
        if (!this.groupIndex.has(option.group)) {
          this.groupIndex.set(option.group, [])
        }
        this.groupIndex.get(option.group)!.push(index)
      }
    })
  }
  
  // 搜索选项
  search(query: string): OptimizedOption[] {
    if (!query.trim()) {
      this.visibleOptions = [...this.options]
      return this.visibleOptions
    }
    
    // 检查缓存
    const cacheKey = query.toLowerCase().trim()
    if (this.searchCache.has(cacheKey)) {
      this.visibleOptions = this.searchCache.get(cacheKey)!
      return this.visibleOptions
    }
    
    const queryWords = cacheKey.split(/\s+/).filter(word => word.length > 0)
    const matchedIndices = this.findMatchingIndices(queryWords)
    
    const results = matchedIndices
      .map(index => this.options[index])
      .filter(option => !option.disabled)
    
    // 缓存结果
    this.searchCache.set(cacheKey, results)
    
    // 限制缓存大小
    if (this.searchCache.size > 100) {
      const firstKey = this.searchCache.keys().next().value
      this.searchCache.delete(firstKey)
    }
    
    this.visibleOptions = results
    return results
  }
  
  // 查找匹配的索引
  private findMatchingIndices(queryWords: string[]): number[] {
    if (queryWords.length === 0) {
      return this.options.map((_, index) => index)
    }
    
    // 获取第一个词的匹配结果
    let matchedIndices = this.getIndicesForWord(queryWords[0])
    
    // 对每个后续词进行交集操作
    for (let i = 1; i < queryWords.length; i++) {
      const wordIndices = this.getIndicesForWord(queryWords[i])
      matchedIndices = matchedIndices.filter(index => wordIndices.has(index))
    }
    
    return Array.from(matchedIndices)
  }
  
  // 获取单词的匹配索引
  private getIndicesForWord(word: string): Set<number> {
    const matchedIndices = new Set<number>()
    
    // 精确匹配
    if (this.searchIndex.has(word)) {
      this.searchIndex.get(word)!.forEach(index => matchedIndices.add(index))
    }
    
    // 前缀匹配
    for (const [indexWord, indices] of this.searchIndex) {
      if (indexWord.startsWith(word)) {
        indices.forEach(index => matchedIndices.add(index))
      }
    }
    
    return matchedIndices
  }
  
  // 按分组获取选项
  getOptionsByGroup(group: string): OptimizedOption[] {
    const indices = this.groupIndex.get(group) || []
    return indices.map(index => this.options[index])
  }
  
  // 获取所有分组
  getGroups(): string[] {
    return Array.from(this.groupIndex.keys())
  }
  
  // 获取可见选项
  getVisibleOptions(): OptimizedOption[] {
    return this.visibleOptions
  }
  
  // 获取选项总数
  getTotalCount(): number {
    return this.options.length
  }
  
  // 获取可见选项数
  getVisibleCount(): number {
    return this.visibleOptions.length
  }
  
  // 根据值查找选项
  findOptionByValue(value: any): OptimizedOption | undefined {
    return this.options.find(option => option.value === value)
  }
  
  // 清理缓存
  clearCache(): void {
    this.searchCache.clear()
  }
}
```

## 2. 虚拟化 Select 组件

### 2.1 虚拟列表实现

```typescript
// 虚拟列表配置
interface VirtualListConfig {
  itemHeight: number
  visibleCount: number
  bufferSize: number
  threshold: number
}

// 虚拟列表管理器
class VirtualListManager {
  private config: VirtualListConfig
  private container: HTMLElement | null = null
  private content: HTMLElement | null = null
  private totalItems: number = 0
  private scrollTop: number = 0
  private startIndex: number = 0
  private endIndex: number = 0
  private offsetTop: number = 0
  
  constructor(config: Partial<VirtualListConfig> = {}) {
    this.config = {
      itemHeight: 34,
      visibleCount: 10,
      bufferSize: 3,
      threshold: 1,
      ...config
    }
  }
  
  // 初始化
  initialize(container: HTMLElement, content: HTMLElement): void {
    this.container = container
    this.content = content
    
    this.bindEvents()
    this.updateVisibleRange()
  }
  
  private bindEvents(): void {
    if (!this.container) return
    
    this.container.addEventListener('scroll', this.handleScroll.bind(this))
  }
  
  private handleScroll(): void {
    if (!this.container) return
    
    const newScrollTop = this.container.scrollTop
    
    if (Math.abs(newScrollTop - this.scrollTop) < this.config.threshold) {
      return
    }
    
    this.scrollTop = newScrollTop
    this.updateVisibleRange()
  }
  
  // 更新可见范围
  private updateVisibleRange(): void {
    const startIndex = Math.floor(this.scrollTop / this.config.itemHeight)
    const endIndex = Math.min(
      this.totalItems - 1,
      startIndex + this.config.visibleCount + this.config.bufferSize * 2
    )
    
    this.startIndex = Math.max(0, startIndex - this.config.bufferSize)
    this.endIndex = endIndex
    this.offsetTop = this.startIndex * this.config.itemHeight
    
    this.onVisibleRangeChange?.({
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      offsetTop: this.offsetTop
    })
  }
  
  // 设置总项目数
  setTotalItems(count: number): void {
    this.totalItems = count
    this.updateContentHeight()
    this.updateVisibleRange()
  }
  
  // 更新内容高度
  private updateContentHeight(): void {
    if (this.content) {
      const totalHeight = this.totalItems * this.config.itemHeight
      this.content.style.height = `${totalHeight}px`
    }
  }
  
  // 滚动到指定项目
  scrollToItem(index: number): void {
    if (!this.container) return
    
    const targetScrollTop = index * this.config.itemHeight
    this.container.scrollTop = targetScrollTop
  }
  
  // 获取可见范围
  getVisibleRange(): { startIndex: number; endIndex: number; offsetTop: number } {
    return {
      startIndex: this.startIndex,
      endIndex: this.endIndex,
      offsetTop: this.offsetTop
    }
  }
  
  // 事件回调
  onVisibleRangeChange?: (range: {
    startIndex: number
    endIndex: number
    offsetTop: number
  }) => void
  
  // 销毁
  destroy(): void {
    this.container?.removeEventListener('scroll', this.handleScroll)
  }
}
```

### 2.2 高性能 Select 组件

```vue
<!-- VirtualSelect.vue -->
<template>
  <div class="virtual-select" :class="selectClass">
    <el-input
      ref="inputRef"
      v-model="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="!filterable"
      :clearable="clearable"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput"
      @clear="handleClear"
    >
      <template #suffix>
        <i 
          :class="suffixIconClass"
          class="virtual-select__icon"
          @click="toggleDropdown"
        />
      </template>
    </el-input>
    
    <transition name="el-zoom-in-top">
      <div 
        v-show="dropdownVisible"
        ref="dropdownRef"
        class="virtual-select__dropdown"
        :style="dropdownStyle"
      >
        <div 
          v-if="showSearch && filterable"
          class="virtual-select__search"
        >
          <el-input
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            size="small"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <i class="el-icon-search" />
            </template>
          </el-input>
        </div>
        
        <div 
          ref="listContainerRef"
          class="virtual-select__list"
          :style="{ maxHeight: maxHeight + 'px' }"
        >
          <div 
            ref="listContentRef"
            class="virtual-select__content"
          >
            <div 
              class="virtual-select__viewport"
              :style="{ transform: `translateY(${offsetTop}px)` }"
            >
              <div 
                v-for="(option, index) in visibleOptions"
                :key="getOptionKey(option)"
                :class="getOptionClass(option)"
                class="virtual-select__option"
                @click="handleOptionClick(option)"
                @mouseenter="handleOptionHover(option)"
              >
                <slot 
                  name="option" 
                  :option="option" 
                  :index="startIndex + index"
                >
                  <span class="virtual-select__option-label">
                    {{ option.label }}
                  </span>
                </slot>
              </div>
            </div>
          </div>
          
          <div 
            v-if="loading"
            class="virtual-select__loading"
          >
            <i class="el-icon-loading" />
            <span>{{ loadingText }}</span>
          </div>
          
          <div 
            v-else-if="visibleOptions.length === 0"
            class="virtual-select__empty"
          >
            {{ emptyText }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElInput } from 'element-plus'

// 类型定义
interface Option {
  value: any
  label: string
  disabled?: boolean
  group?: string
}

// Props
interface Props {
  modelValue?: any
  options: Option[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  multiple?: boolean
  loading?: boolean
  loadingText?: string
  emptyText?: string
  searchPlaceholder?: string
  showSearch?: boolean
  maxHeight?: number
  itemHeight?: number
  visibleCount?: number
  bufferSize?: number
  valueKey?: string
  labelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  clearable: true,
  filterable: true,
  multiple: false,
  loading: false,
  loadingText: '加载中...',
  emptyText: '无数据',
  searchPlaceholder: '搜索选项',
  showSearch: true,
  maxHeight: 300,
  itemHeight: 34,
  visibleCount: 10,
  bufferSize: 3,
  valueKey: 'value',
  labelKey: 'label'
})

// Emits
interface Emits {
  'update:modelValue': [value: any]
  'change': [value: any]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
  'visible-change': [visible: boolean]
  'search': [query: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const inputRef = ref<InstanceType<typeof ElInput>>()
const dropdownRef = ref<HTMLElement>()
const listContainerRef = ref<HTMLElement>()
const listContentRef = ref<HTMLElement>()

const dropdownVisible = ref(false)
const searchQuery = ref('')
const hoveredOption = ref<Option | null>(null)
const startIndex = ref(0)
const endIndex = ref(0)
const offsetTop = ref(0)

// 数据管理器和虚拟列表管理器
let dataManager: OptionDataManager | null = null
let virtualListManager: VirtualListManager | null = null

// 计算属性
const displayValue = computed({
  get: () => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) 
        ? props.modelValue.map(val => getOptionLabel(val)).join(', ')
        : ''
    }
    return getOptionLabel(props.modelValue)
  },
  set: (value: string) => {
    if (props.filterable && !dropdownVisible.value) {
      searchQuery.value = value
    }
  }
})

const selectClass = computed(() => ({
  'virtual-select--disabled': props.disabled,
  'virtual-select--multiple': props.multiple,
  'virtual-select--focus': dropdownVisible.value
}))

const suffixIconClass = computed(() => ({
  'el-icon-arrow-down': !dropdownVisible.value,
  'el-icon-arrow-up': dropdownVisible.value
}))

const dropdownStyle = computed(() => ({
  minWidth: inputRef.value?.$el?.offsetWidth + 'px'
}))

const visibleOptions = computed(() => {
  if (!dataManager) return []
  
  const allVisible = dataManager.getVisibleOptions()
  return allVisible.slice(startIndex.value, endIndex.value + 1)
})

// 方法
const initializeDataManager = () => {
  dataManager = new OptionDataManager(props.options)
}

const initializeVirtualList = async () => {
  await nextTick()
  
  if (!listContainerRef.value || !listContentRef.value) return
  
  virtualListManager = new VirtualListManager({
    itemHeight: props.itemHeight,
    visibleCount: props.visibleCount,
    bufferSize: props.bufferSize
  })
  
  virtualListManager.onVisibleRangeChange = (range) => {
    startIndex.value = range.startIndex
    endIndex.value = range.endIndex
    offsetTop.value = range.offsetTop
  }
  
  virtualListManager.initialize(listContainerRef.value, listContentRef.value)
  updateVirtualList()
}

const updateVirtualList = () => {
  if (!virtualListManager || !dataManager) return
  
  const visibleCount = dataManager.getVisibleCount()
  virtualListManager.setTotalItems(visibleCount)
}

const getOptionKey = (option: Option): string => {
  return option[props.valueKey] || option.value
}

const getOptionLabel = (value: any): string => {
  if (value == null) return ''
  
  const option = dataManager?.findOptionByValue(value)
  return option ? option[props.labelKey] || option.label : String(value)
}

const getOptionClass = (option: Option) => ({
  'virtual-select__option--disabled': option.disabled,
  'virtual-select__option--selected': isOptionSelected(option),
  'virtual-select__option--hover': hoveredOption.value === option
})

const isOptionSelected = (option: Option): boolean => {
  const optionValue = option[props.valueKey] || option.value
  
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(optionValue)
  }
  
  return props.modelValue === optionValue
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  // 延迟隐藏下拉框，允许点击选项
  setTimeout(() => {
    dropdownVisible.value = false
    emit('visible-change', false)
  }, 200)
  
  emit('blur', event)
}

const handleInput = (value: string) => {
  if (props.filterable) {
    searchQuery.value = value
    handleSearch(value)
  }
}

const handleClear = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  emit('change', props.multiple ? [] : null)
  emit('clear')
}

const handleSearch = (query: string) => {
  if (!dataManager) return
  
  dataManager.search(query)
  updateVirtualList()
  
  emit('search', query)
}

const toggleDropdown = () => {
  if (props.disabled) return
  
  dropdownVisible.value = !dropdownVisible.value
  emit('visible-change', dropdownVisible.value)
  
  if (dropdownVisible.value) {
    nextTick(() => {
      initializeVirtualList()
    })
  }
}

const handleOptionClick = (option: Option) => {
  if (option.disabled) return
  
  const optionValue = option[props.valueKey] || option.value
  
  if (props.multiple) {
    const currentValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = currentValue.indexOf(optionValue)
    
    if (index > -1) {
      currentValue.splice(index, 1)
    } else {
      currentValue.push(optionValue)
    }
    
    emit('update:modelValue', currentValue)
    emit('change', currentValue)
  } else {
    emit('update:modelValue', optionValue)
    emit('change', optionValue)
    
    dropdownVisible.value = false
    emit('visible-change', false)
  }
}

const handleOptionHover = (option: Option) => {
  hoveredOption.value = option
}

// 监听器
watch(() => props.options, () => {
  initializeDataManager()
  updateVirtualList()
}, { deep: true })

watch(searchQuery, (query) => {
  handleSearch(query)
})

// 生命周期
onMounted(() => {
  initializeDataManager()
})

onUnmounted(() => {
  virtualListManager?.destroy()
})
</script>

<style scoped>
.virtual-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.virtual-select__icon {
  transition: transform 0.3s;
  cursor: pointer;
}

.virtual-select--focus .virtual-select__icon {
  transform: rotate(180deg);
}

.virtual-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 2000;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 4px;
}

.virtual-select__search {
  padding: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.virtual-select__list {
  position: relative;
  overflow: auto;
}

.virtual-select__content {
  position: relative;
}

.virtual-select__viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-select__option {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.3s;
}

.virtual-select__option:hover,
.virtual-select__option--hover {
  background-color: #f5f7fa;
}

.virtual-select__option--selected {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.virtual-select__option--disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.virtual-select__option--disabled:hover {
  background-color: transparent;
}

.virtual-select__option-label {
  display: block;
}

.virtual-select__loading,
.virtual-select__empty {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.virtual-select__loading i {
  margin-right: 8px;
}

/* 滚动条样式 */
.virtual-select__list::-webkit-scrollbar {
  width: 6px;
}

.virtual-select__list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.virtual-select__list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.virtual-select__list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 过渡动画 */
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}

.el-zoom-in-top-enter-from,
.el-zoom-in-top-leave-to {
  opacity: 0;
  transform: scaleY(0);
}
</style>
```

## 3. 智能搜索优化

### 3.1 防抖搜索实现

```typescript
// 防抖搜索管理器
class DebouncedSearchManager {
  private debounceTimer: number | null = null
  private searchCache: Map<string, any[]> = new Map()
  private searchHistory: string[] = []
  private maxCacheSize: number = 100
  private maxHistorySize: number = 50
  
  constructor(
    private searchFunction: (query: string) => Promise<any[]> | any[],
    private debounceDelay: number = 300
  ) {}
  
  // 执行搜索
  search(query: string): Promise<any[]> {
    return new Promise((resolve) => {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }
      
      // 空查询直接返回
      if (!query.trim()) {
        resolve([])
        return
      }
      
      // 检查缓存
      const cacheKey = query.toLowerCase().trim()
      if (this.searchCache.has(cacheKey)) {
        resolve(this.searchCache.get(cacheKey)!)
        return
      }
      
      // 设置防抖定时器
      this.debounceTimer = window.setTimeout(async () => {
        try {
          const results = await this.searchFunction(query)
          
          // 缓存结果
          this.cacheResults(cacheKey, results)
          
          // 记录搜索历史
          this.addToHistory(query)
          
          resolve(results)
        } catch (error) {
          console.error('Search error:', error)
          resolve([])
        }
      }, this.debounceDelay)
    })
  }
  
  // 缓存搜索结果
  private cacheResults(key: string, results: any[]): void {
    // 限制缓存大小
    if (this.searchCache.size >= this.maxCacheSize) {
      const firstKey = this.searchCache.keys().next().value
      this.searchCache.delete(firstKey)
    }
    
    this.searchCache.set(key, results)
  }
  
  // 添加到搜索历史
  private addToHistory(query: string): void {
    const trimmedQuery = query.trim()
    
    // 移除重复项
    const index = this.searchHistory.indexOf(trimmedQuery)
    if (index > -1) {
      this.searchHistory.splice(index, 1)
    }
    
    // 添加到开头
    this.searchHistory.unshift(trimmedQuery)
    
    // 限制历史大小
    if (this.searchHistory.length > this.maxHistorySize) {
      this.searchHistory.pop()
    }
  }
  
  // 获取搜索建议
  getSuggestions(query: string, limit: number = 5): string[] {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    
    return this.searchHistory
      .filter(item => item.toLowerCase().includes(lowerQuery))
      .slice(0, limit)
  }
  
  // 清除缓存
  clearCache(): void {
    this.searchCache.clear()
  }
  
  // 清除历史
  clearHistory(): void {
    this.searchHistory = []
  }
  
  // 取消当前搜索
  cancel(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
  }
  
  // 获取缓存统计
  getCacheStats(): any {
    return {
      cacheSize: this.searchCache.size,
      historySize: this.searchHistory.length,
      maxCacheSize: this.maxCacheSize,
      maxHistorySize: this.maxHistorySize
    }
  }
}
```

### 3.2 模糊搜索算法

```typescript
// 模糊搜索算法
class FuzzySearchAlgorithm {
  // 计算字符串相似度（Levenshtein距离）
  static calculateSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = []
    const len1 = str1.length
    const len2 = str2.length
    
    // 初始化矩阵
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }
    
    // 填充矩阵
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // 删除
          matrix[i][j - 1] + 1,      // 插入
          matrix[i - 1][j - 1] + cost // 替换
        )
      }
    }
    
    const maxLen = Math.max(len1, len2)
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen
  }
  
  // 模糊搜索
  static fuzzySearch(
    query: string, 
    items: any[], 
    options: {
      keys: string[]
      threshold?: number
      caseSensitive?: boolean
      includeScore?: boolean
    } = { keys: ['label'] }
  ): any[] {
    const {
      keys,
      threshold = 0.3,
      caseSensitive = false,
      includeScore = false
    } = options
    
    const normalizedQuery = caseSensitive ? query : query.toLowerCase()
    
    const results = items
      .map(item => {
        let maxScore = 0
        
        // 对每个搜索字段计算相似度
        for (const key of keys) {
          const value = this.getNestedValue(item, key)
          if (value != null) {
            const normalizedValue = caseSensitive ? String(value) : String(value).toLowerCase()
            const score = this.calculateSimilarity(normalizedQuery, normalizedValue)
            maxScore = Math.max(maxScore, score)
          }
        }
        
        return {
          item,
          score: maxScore
        }
      })
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
    
    return includeScore 
      ? results 
      : results.map(result => result.item)
  }
  
  // 获取嵌套属性值
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }
  
  // 高亮匹配文本
  static highlightMatches(
    text: string, 
    query: string, 
    className: string = 'highlight'
  ): string {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi')
    return text.replace(regex, `<span class="${className}">$1</span>`)
  }
  
  // 转义正则表达式特殊字符
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}
```

## 4. 实践练习

1. **性能优化实践**：
   - 分析 Select 组件性能瓶颈
   - 实现虚拟化选项列表
   - 优化搜索算法性能

2. **大数据处理**：
   - 处理10万+选项的选择器
   - 实现智能分页加载
   - 优化内存使用

3. **用户体验优化**：
   - 实现流畅的滚动体验
   - 添加搜索高亮功能
   - 优化键盘导航

## 5. 学习资源

- [Virtual Scrolling Best Practices](https://web.dev/virtual-scrolling/)
- [JavaScript Search Algorithms](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Performance Optimization Techniques](https://developers.google.com/web/fundamentals/performance)
- [Element Plus Select Source Code](https://github.com/element-plus/element-plus/tree/dev/packages/components/select)

## 6. 作业

- 实现完整的虚拟化 Select 组件
- 添加高级搜索功能（模糊搜索、拼音搜索）
- 创建性能测试套件
- 编写组件使用文档和最佳实践

## 总结

通过第80天的学习，我们深入掌握了：

1. **性能分析**：学会了如何分析和优化 Select 组件的性能问题
2. **虚拟化技术**：实现了高效的虚拟列表和选项渲染
3. **搜索优化**：构建了智能的搜索和过滤机制
4. **用户体验**：提升了大数据量选择器的使用体验

这些技能将帮助我们构建高性能的选择器组件，适用于各种复杂的业务场景。