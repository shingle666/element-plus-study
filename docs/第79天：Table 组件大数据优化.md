# 第79天：Table 组件大数据优化

## 学习目标

- 掌握 Element Plus Table 组件的性能瓶颈分析
- 学习虚拟滚动技术在表格中的应用
- 实现大数据量表格的优化策略
- 构建高性能的企业级表格组件

## 1. 表格性能瓶颈分析

### 1.1 性能问题识别

```typescript
// 性能监控工具
class TablePerformanceMonitor {
  private metrics: Map<string, any> = new Map()
  private observers: Map<string, PerformanceObserver> = new Map()
  
  constructor() {
    this.initializeObservers()
  }
  
  private initializeObservers(): void {
    // 监控渲染性能
    const renderObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('table-render')) {
          this.recordMetric('render-time', entry.duration)
        }
      }
    })
    
    renderObserver.observe({ entryTypes: ['measure'] })
    this.observers.set('render', renderObserver)
    
    // 监控内存使用
    const memoryObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'memory') {
          this.recordMetric('memory-usage', (entry as any).usedJSHeapSize)
        }
      }
    })
    
    if ('memory' in performance) {
      memoryObserver.observe({ entryTypes: ['memory'] })
      this.observers.set('memory', memoryObserver)
    }
  }
  
  // 开始性能测量
  startMeasure(name: string): void {
    performance.mark(`${name}-start`)
  }
  
  // 结束性能测量
  endMeasure(name: string): number {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const entries = performance.getEntriesByName(name, 'measure')
    const duration = entries[entries.length - 1]?.duration || 0
    
    this.recordMetric(name, duration)
    return duration
  }
  
  // 记录指标
  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const values = this.metrics.get(name)
    values.push({
      value,
      timestamp: Date.now()
    })
    
    // 保留最近100条记录
    if (values.length > 100) {
      values.shift()
    }
  }
  
  // 获取性能报告
  getPerformanceReport(): any {
    const report: any = {}
    
    for (const [name, values] of this.metrics) {
      const recentValues = values.slice(-10).map((item: any) => item.value)
      
      report[name] = {
        current: recentValues[recentValues.length - 1] || 0,
        average: recentValues.reduce((sum: number, val: number) => sum + val, 0) / recentValues.length,
        min: Math.min(...recentValues),
        max: Math.max(...recentValues),
        trend: this.calculateTrend(recentValues)
      }
    }
    
    return report
  }
  
  private calculateTrend(values: number[]): 'improving' | 'stable' | 'degrading' {
    if (values.length < 2) return 'stable'
    
    const first = values.slice(0, Math.floor(values.length / 2))
    const second = values.slice(Math.floor(values.length / 2))
    
    const firstAvg = first.reduce((sum, val) => sum + val, 0) / first.length
    const secondAvg = second.reduce((sum, val) => sum + val, 0) / second.length
    
    const change = (secondAvg - firstAvg) / firstAvg
    
    if (change < -0.1) return 'improving'
    if (change > 0.1) return 'degrading'
    return 'stable'
  }
  
  // 清理资源
  dispose(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }
}

// 表格性能分析器
class TablePerformanceAnalyzer {
  private monitor: TablePerformanceMonitor
  
  constructor() {
    this.monitor = new TablePerformanceMonitor()
  }
  
  // 分析表格渲染性能
  analyzeRenderPerformance(tableElement: HTMLElement): any {
    const analysis = {
      domNodes: this.countDOMNodes(tableElement),
      visibleRows: this.countVisibleRows(tableElement),
      columnCount: this.countColumns(tableElement),
      cellComplexity: this.analyzeCellComplexity(tableElement),
      scrollPerformance: this.analyzeScrollPerformance(tableElement)
    }
    
    return {
      ...analysis,
      recommendations: this.generateRecommendations(analysis)
    }
  }
  
  private countDOMNodes(element: HTMLElement): number {
    return element.querySelectorAll('*').length
  }
  
  private countVisibleRows(element: HTMLElement): number {
    const tbody = element.querySelector('tbody')
    if (!tbody) return 0
    
    const rows = tbody.querySelectorAll('tr')
    let visibleCount = 0
    
    rows.forEach(row => {
      const rect = row.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visibleCount++
      }
    })
    
    return visibleCount
  }
  
  private countColumns(element: HTMLElement): number {
    const headerRow = element.querySelector('thead tr')
    return headerRow ? headerRow.children.length : 0
  }
  
  private analyzeCellComplexity(element: HTMLElement): any {
    const cells = element.querySelectorAll('td')
    let totalComplexity = 0
    let maxComplexity = 0
    
    cells.forEach(cell => {
      const complexity = this.calculateCellComplexity(cell)
      totalComplexity += complexity
      maxComplexity = Math.max(maxComplexity, complexity)
    })
    
    return {
      average: cells.length > 0 ? totalComplexity / cells.length : 0,
      max: maxComplexity,
      total: totalComplexity
    }
  }
  
  private calculateCellComplexity(cell: Element): number {
    let complexity = 1
    
    // 子元素数量
    complexity += cell.children.length
    
    // 文本长度
    complexity += Math.floor((cell.textContent?.length || 0) / 100)
    
    // 样式复杂度
    const computedStyle = window.getComputedStyle(cell)
    if (computedStyle.backgroundImage !== 'none') complexity += 2
    if (computedStyle.boxShadow !== 'none') complexity += 1
    if (computedStyle.transform !== 'none') complexity += 2
    
    return complexity
  }
  
  private analyzeScrollPerformance(element: HTMLElement): any {
    return new Promise((resolve) => {
      let frameCount = 0
      let startTime = performance.now()
      
      const measureFrames = () => {
        frameCount++
        
        if (frameCount < 60) {
          requestAnimationFrame(measureFrames)
        } else {
          const endTime = performance.now()
          const fps = 1000 / ((endTime - startTime) / frameCount)
          
          resolve({
            fps,
            frameTime: (endTime - startTime) / frameCount,
            isSmooth: fps > 55
          })
        }
      }
      
      // 触发滚动
      element.scrollTop += 1
      requestAnimationFrame(measureFrames)
    })
  }
  
  private generateRecommendations(analysis: any): string[] {
    const recommendations = []
    
    if (analysis.domNodes > 10000) {
      recommendations.push('考虑使用虚拟滚动减少DOM节点数量')
    }
    
    if (analysis.visibleRows > 50) {
      recommendations.push('减少同时显示的行数，使用分页或虚拟滚动')
    }
    
    if (analysis.cellComplexity.average > 5) {
      recommendations.push('简化单元格内容，避免复杂的嵌套结构')
    }
    
    if (analysis.columnCount > 20) {
      recommendations.push('考虑列的懒加载或隐藏不必要的列')
    }
    
    return recommendations
  }
}
```

### 1.2 内存泄漏检测

```typescript
// 内存泄漏检测器
class MemoryLeakDetector {
  private snapshots: Map<string, any> = new Map()
  private watchers: Map<string, any> = new Map()
  
  // 创建内存快照
  createSnapshot(name: string): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.snapshots.set(name, {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      })
    }
  }
  
  // 比较内存快照
  compareSnapshots(before: string, after: string): any {
    const beforeSnapshot = this.snapshots.get(before)
    const afterSnapshot = this.snapshots.get(after)
    
    if (!beforeSnapshot || !afterSnapshot) {
      throw new Error('Snapshot not found')
    }
    
    const memoryDiff = afterSnapshot.usedJSHeapSize - beforeSnapshot.usedJSHeapSize
    const timeDiff = afterSnapshot.timestamp - beforeSnapshot.timestamp
    
    return {
      memoryDiff,
      timeDiff,
      memoryRate: memoryDiff / timeDiff, // bytes per ms
      isLeak: memoryDiff > 1024 * 1024 && memoryDiff / timeDiff > 100, // 1MB+ and growing fast
      percentage: (memoryDiff / beforeSnapshot.usedJSHeapSize) * 100
    }
  }
  
  // 监控组件内存使用
  watchComponent(componentName: string, componentInstance: any): void {
    const watcher = {
      instance: componentInstance,
      initialMemory: 0,
      checkInterval: null as any
    }
    
    // 记录初始内存
    this.createSnapshot(`${componentName}-initial`)
    watcher.initialMemory = this.snapshots.get(`${componentName}-initial`)?.usedJSHeapSize || 0
    
    // 定期检查内存
    watcher.checkInterval = setInterval(() => {
      this.createSnapshot(`${componentName}-current`)
      const current = this.snapshots.get(`${componentName}-current`)?.usedJSHeapSize || 0
      const growth = current - watcher.initialMemory
      
      if (growth > 10 * 1024 * 1024) { // 10MB growth
        console.warn(`Potential memory leak detected in ${componentName}:`, {
          initialMemory: watcher.initialMemory,
          currentMemory: current,
          growth
        })
      }
    }, 30000) // Check every 30 seconds
    
    this.watchers.set(componentName, watcher)
  }
  
  // 停止监控
  unwatchComponent(componentName: string): void {
    const watcher = this.watchers.get(componentName)
    if (watcher && watcher.checkInterval) {
      clearInterval(watcher.checkInterval)
      this.watchers.delete(componentName)
    }
  }
  
  // 检测DOM节点泄漏
  detectDOMLeaks(): any {
    const allElements = document.querySelectorAll('*')
    const elementCounts = new Map<string, number>()
    
    allElements.forEach(element => {
      const tagName = element.tagName.toLowerCase()
      elementCounts.set(tagName, (elementCounts.get(tagName) || 0) + 1)
    })
    
    // 检查异常的元素数量
    const suspiciousElements = []
    for (const [tagName, count] of elementCounts) {
      if (count > 1000 && ['div', 'span', 'td', 'tr'].includes(tagName)) {
        suspiciousElements.push({ tagName, count })
      }
    }
    
    return {
      totalElements: allElements.length,
      elementCounts: Object.fromEntries(elementCounts),
      suspiciousElements,
      hasPotentialLeaks: suspiciousElements.length > 0
    }
  }
}
```

## 2. 虚拟滚动实现

### 2.1 核心虚拟滚动算法

```typescript
// 虚拟滚动配置
interface VirtualScrollConfig {
  itemHeight: number | ((index: number) => number)
  bufferSize: number
  threshold: number
  estimatedItemHeight: number
  overscan: number
}

// 虚拟滚动管理器
class VirtualScrollManager {
  private config: VirtualScrollConfig
  private scrollElement: HTMLElement
  private contentElement: HTMLElement
  private totalItems: number = 0
  private scrollTop: number = 0
  private containerHeight: number = 0
  private itemHeights: Map<number, number> = new Map()
  private estimatedTotalHeight: number = 0
  
  constructor(config: VirtualScrollConfig) {
    this.config = {
      bufferSize: 5,
      threshold: 100,
      estimatedItemHeight: 40,
      overscan: 3,
      ...config
    }
  }
  
  // 初始化虚拟滚动
  initialize(scrollElement: HTMLElement, contentElement: HTMLElement): void {
    this.scrollElement = scrollElement
    this.contentElement = contentElement
    this.containerHeight = scrollElement.clientHeight
    
    this.bindEvents()
    this.updateVisibleRange()
  }
  
  private bindEvents(): void {
    this.scrollElement.addEventListener('scroll', this.handleScroll.bind(this))
    
    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      this.containerHeight = this.scrollElement.clientHeight
      this.updateVisibleRange()
    })
    
    resizeObserver.observe(this.scrollElement)
  }
  
  private handleScroll(): void {
    const newScrollTop = this.scrollElement.scrollTop
    
    // 防抖处理
    if (Math.abs(newScrollTop - this.scrollTop) < this.config.threshold) {
      return
    }
    
    this.scrollTop = newScrollTop
    this.updateVisibleRange()
  }
  
  // 更新可见范围
  private updateVisibleRange(): void {
    const range = this.calculateVisibleRange()
    this.renderVisibleItems(range)
  }
  
  // 计算可见范围
  private calculateVisibleRange(): { start: number; end: number } {
    let start = 0
    let end = 0
    let accumulatedHeight = 0
    
    // 找到开始索引
    for (let i = 0; i < this.totalItems; i++) {
      const itemHeight = this.getItemHeight(i)
      
      if (accumulatedHeight + itemHeight > this.scrollTop) {
        start = Math.max(0, i - this.config.overscan)
        break
      }
      
      accumulatedHeight += itemHeight
    }
    
    // 找到结束索引
    const visibleHeight = this.containerHeight
    let visibleAccumulated = 0
    
    for (let i = start; i < this.totalItems; i++) {
      const itemHeight = this.getItemHeight(i)
      visibleAccumulated += itemHeight
      
      if (visibleAccumulated >= visibleHeight) {
        end = Math.min(this.totalItems - 1, i + this.config.overscan)
        break
      }
    }
    
    if (end === 0) {
      end = this.totalItems - 1
    }
    
    return { start, end }
  }
  
  // 获取项目高度
  private getItemHeight(index: number): number {
    // 如果已经测量过，返回实际高度
    if (this.itemHeights.has(index)) {
      return this.itemHeights.get(index)!
    }
    
    // 如果配置了动态高度函数
    if (typeof this.config.itemHeight === 'function') {
      return this.config.itemHeight(index)
    }
    
    // 如果配置了固定高度
    if (typeof this.config.itemHeight === 'number') {
      return this.config.itemHeight
    }
    
    // 返回估算高度
    return this.config.estimatedItemHeight
  }
  
  // 设置项目实际高度
  setItemHeight(index: number, height: number): void {
    this.itemHeights.set(index, height)
    this.updateEstimatedTotalHeight()
  }
  
  // 更新估算总高度
  private updateEstimatedTotalHeight(): void {
    let totalHeight = 0
    
    for (let i = 0; i < this.totalItems; i++) {
      totalHeight += this.getItemHeight(i)
    }
    
    this.estimatedTotalHeight = totalHeight
    this.updateScrollbarSize()
  }
  
  // 更新滚动条大小
  private updateScrollbarSize(): void {
    if (this.contentElement) {
      this.contentElement.style.height = `${this.estimatedTotalHeight}px`
    }
  }
  
  // 渲染可见项目
  private renderVisibleItems(range: { start: number; end: number }): void {
    // 计算偏移量
    let offsetTop = 0
    for (let i = 0; i < range.start; i++) {
      offsetTop += this.getItemHeight(i)
    }
    
    // 触发渲染事件
    this.onVisibleRangeChange?.({
      start: range.start,
      end: range.end,
      offsetTop,
      visibleItems: range.end - range.start + 1
    })
  }
  
  // 设置总项目数
  setTotalItems(count: number): void {
    this.totalItems = count
    this.updateEstimatedTotalHeight()
    this.updateVisibleRange()
  }
  
  // 滚动到指定项目
  scrollToItem(index: number, align: 'start' | 'center' | 'end' = 'start'): void {
    let targetScrollTop = 0
    
    for (let i = 0; i < index; i++) {
      targetScrollTop += this.getItemHeight(i)
    }
    
    if (align === 'center') {
      targetScrollTop -= this.containerHeight / 2 - this.getItemHeight(index) / 2
    } else if (align === 'end') {
      targetScrollTop -= this.containerHeight - this.getItemHeight(index)
    }
    
    targetScrollTop = Math.max(0, Math.min(targetScrollTop, this.estimatedTotalHeight - this.containerHeight))
    
    this.scrollElement.scrollTop = targetScrollTop
  }
  
  // 事件回调
  onVisibleRangeChange?: (range: {
    start: number
    end: number
    offsetTop: number
    visibleItems: number
  }) => void
  
  // 销毁
  destroy(): void {
    this.scrollElement?.removeEventListener('scroll', this.handleScroll)
    this.itemHeights.clear()
  }
}
```

### 2.2 虚拟表格组件

```vue
<!-- VirtualTable.vue -->
<template>
  <div class="virtual-table" ref="containerRef">
    <div class="virtual-table__header" v-if="showHeader">
      <table class="virtual-table__header-table">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.prop"
              :style="getColumnStyle(column)"
              :class="getColumnClass(column)"
              @click="handleSort(column)"
            >
              <div class="virtual-table__header-cell">
                <span>{{ column.label }}</span>
                <i 
                  v-if="column.sortable"
                  :class="getSortIconClass(column)"
                  class="virtual-table__sort-icon"
                />
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    
    <div 
      class="virtual-table__body"
      ref="scrollContainerRef"
      @scroll="handleScroll"
    >
      <div 
        class="virtual-table__content"
        ref="contentRef"
        :style="{ height: totalHeight + 'px' }"
      >
        <div 
          class="virtual-table__viewport"
          :style="{ transform: `translateY(${offsetTop}px)` }"
        >
          <table class="virtual-table__body-table">
            <tbody>
              <tr 
                v-for="(item, index) in visibleItems" 
                :key="getRowKey(item, visibleStartIndex + index)"
                :class="getRowClass(item, visibleStartIndex + index)"
                @click="handleRowClick(item, visibleStartIndex + index)"
                ref="rowRefs"
              >
                <td 
                  v-for="column in columns" 
                  :key="column.prop"
                  :style="getColumnStyle(column)"
                  :class="getCellClass(column, item)"
                >
                  <div class="virtual-table__cell">
                    <slot 
                      v-if="column.slot" 
                      :name="column.slot" 
                      :row="item" 
                      :column="column" 
                      :index="visibleStartIndex + index"
                    />
                    <template v-else>
                      {{ getCellValue(item, column) }}
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="virtual-table__loading" v-if="loading">
      <el-loading :text="loadingText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// 类型定义
interface Column {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  sortable?: boolean
  slot?: string
  formatter?: (row: any, column: Column, cellValue: any, index: number) => any
  className?: string | ((row: any, column: Column, rowIndex: number, columnIndex: number) => string)
}

interface SortState {
  prop: string
  order: 'ascending' | 'descending' | null
}

// Props
interface Props {
  data: any[]
  columns: Column[]
  height?: number | string
  itemHeight?: number | ((index: number) => number)
  bufferSize?: number
  showHeader?: boolean
  loading?: boolean
  loadingText?: string
  rowKey?: string | ((row: any) => string)
  rowClassName?: string | ((row: any, index: number) => string)
  estimatedRowHeight?: number
  overscan?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  itemHeight: 40,
  bufferSize: 5,
  showHeader: true,
  loading: false,
  loadingText: 'Loading...',
  rowKey: 'id',
  estimatedRowHeight: 40,
  overscan: 3
})

// Emits
interface Emits {
  'row-click': [row: any, index: number]
  'sort-change': [sort: SortState]
  'visible-change': [range: { start: number; end: number }]
}

const emit = defineEmits<Emits>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const scrollContainerRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const rowRefs = ref<HTMLElement[]>([])

const visibleStartIndex = ref(0)
const visibleEndIndex = ref(0)
const offsetTop = ref(0)
const containerHeight = ref(0)
const scrollTop = ref(0)
const sortState = ref<SortState>({ prop: '', order: null })

// 虚拟滚动管理器
let virtualScrollManager: VirtualScrollManager | null = null

// 计算属性
const visibleItems = computed(() => {
  return props.data.slice(visibleStartIndex.value, visibleEndIndex.value + 1)
})

const totalHeight = computed(() => {
  if (typeof props.itemHeight === 'number') {
    return props.data.length * props.itemHeight
  }
  
  // 动态高度计算
  let total = 0
  for (let i = 0; i < props.data.length; i++) {
    if (typeof props.itemHeight === 'function') {
      total += props.itemHeight(i)
    } else {
      total += props.estimatedRowHeight
    }
  }
  return total
})

// 方法
const initializeVirtualScroll = () => {
  if (!scrollContainerRef.value || !contentRef.value) return
  
  virtualScrollManager = new VirtualScrollManager({
    itemHeight: props.itemHeight,
    bufferSize: props.bufferSize,
    threshold: 1,
    estimatedItemHeight: props.estimatedRowHeight,
    overscan: props.overscan
  })
  
  virtualScrollManager.onVisibleRangeChange = (range) => {
    visibleStartIndex.value = range.start
    visibleEndIndex.value = range.end
    offsetTop.value = range.offsetTop
    
    emit('visible-change', { start: range.start, end: range.end })
  }
  
  virtualScrollManager.initialize(scrollContainerRef.value, contentRef.value)
  virtualScrollManager.setTotalItems(props.data.length)
  
  containerHeight.value = scrollContainerRef.value.clientHeight
}

const handleScroll = () => {
  scrollTop.value = scrollContainerRef.value?.scrollTop || 0
}

const updateRowHeights = async () => {
  await nextTick()
  
  if (!virtualScrollManager || !rowRefs.value) return
  
  rowRefs.value.forEach((row, index) => {
    if (row) {
      const height = row.offsetHeight
      const actualIndex = visibleStartIndex.value + index
      virtualScrollManager!.setItemHeight(actualIndex, height)
    }
  })
}

const getRowKey = (row: any, index: number): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] || index.toString()
}

const getRowClass = (row: any, index: number): any => {
  const classes = ['virtual-table__row']
  
  if (props.rowClassName) {
    if (typeof props.rowClassName === 'function') {
      classes.push(props.rowClassName(row, index))
    } else {
      classes.push(props.rowClassName)
    }
  }
  
  return classes
}

const getColumnStyle = (column: Column): any => {
  const style: any = {}
  
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  
  if (column.minWidth) {
    style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  }
  
  return style
}

const getColumnClass = (column: Column): any => {
  const classes = ['virtual-table__column']
  
  if (column.sortable) {
    classes.push('virtual-table__column--sortable')
  }
  
  if (sortState.value.prop === column.prop) {
    classes.push(`virtual-table__column--${sortState.value.order}`)
  }
  
  return classes
}

const getCellClass = (column: Column, row: any): any => {
  const classes = ['virtual-table__cell']
  
  if (column.className) {
    if (typeof column.className === 'function') {
      classes.push(column.className(row, column, 0, 0))
    } else {
      classes.push(column.className)
    }
  }
  
  return classes
}

const getCellValue = (row: any, column: Column): any => {
  const value = row[column.prop]
  
  if (column.formatter) {
    return column.formatter(row, column, value, 0)
  }
  
  return value
}

const getSortIconClass = (column: Column): string => {
  if (sortState.value.prop !== column.prop) {
    return 'el-icon-d-caret'
  }
  
  return sortState.value.order === 'ascending' 
    ? 'el-icon-caret-top' 
    : 'el-icon-caret-bottom'
}

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  let order: 'ascending' | 'descending' | null = 'ascending'
  
  if (sortState.value.prop === column.prop) {
    if (sortState.value.order === 'ascending') {
      order = 'descending'
    } else if (sortState.value.order === 'descending') {
      order = null
    }
  }
  
  sortState.value = {
    prop: order ? column.prop : '',
    order
  }
  
  emit('sort-change', sortState.value)
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

// 公开方法
const scrollToRow = (index: number, align: 'start' | 'center' | 'end' = 'start') => {
  virtualScrollManager?.scrollToItem(index, align)
}

const refresh = () => {
  virtualScrollManager?.setTotalItems(props.data.length)
}

// 监听数据变化
watch(() => props.data.length, (newLength) => {
  virtualScrollManager?.setTotalItems(newLength)
})

watch(visibleItems, () => {
  updateRowHeights()
}, { flush: 'post' })

// 生命周期
onMounted(() => {
  initializeVirtualScroll()
})

onUnmounted(() => {
  virtualScrollManager?.destroy()
})

// 暴露方法
defineExpose({
  scrollToRow,
  refresh
})
</script>

<style scoped>
.virtual-table {
  position: relative;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.virtual-table__header {
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

.virtual-table__header-table,
.virtual-table__body-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.virtual-table__header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px;
  font-weight: 500;
  color: #909399;
  font-size: 14px;
}

.virtual-table__column--sortable {
  cursor: pointer;
  user-select: none;
}

.virtual-table__column--sortable:hover {
  background-color: #f5f7fa;
}

.virtual-table__sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #c0c4cc;
}

.virtual-table__column--ascending .virtual-table__sort-icon,
.virtual-table__column--descending .virtual-table__sort-icon {
  color: #409eff;
}

.virtual-table__body {
  position: relative;
  overflow: auto;
  height: 400px;
}

.virtual-table__content {
  position: relative;
}

.virtual-table__viewport {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.virtual-table__row {
  border-bottom: 1px solid #ebeef5;
  transition: background-color 0.25s ease;
}

.virtual-table__row:hover {
  background-color: #f5f7fa;
}

.virtual-table__cell {
  padding: 12px 8px;
  font-size: 14px;
  color: #606266;
  word-break: break-all;
}

.virtual-table__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 滚动条样式 */
.virtual-table__body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.virtual-table__body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.virtual-table__body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.virtual-table__body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
```

## 3. 实践练习

1. **性能分析实践**：
   - 使用性能监控工具分析表格性能
   - 识别和解决内存泄漏问题
   - 优化表格渲染性能

2. **虚拟滚动实现**：
   - 实现基础虚拟滚动功能
   - 添加动态行高支持
   - 优化滚动平滑度

3. **大数据表格优化**：
   - 实现数据懒加载
   - 添加智能缓存机制
   - 优化列渲染性能

## 4. 学习资源

- [Virtual Scrolling Techniques](https://web.dev/virtual-scrolling/)
- [Performance Monitoring APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Memory Management in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Element Plus Table Source Code](https://github.com/element-plus/element-plus/tree/dev/packages/components/table)

## 5. 作业

- 实现完整的虚拟表格组件
- 添加性能监控和分析功能
- 创建大数据表格优化方案
- 编写性能优化最佳实践文档

## 总结

通过第79天的学习，我们深入掌握了：

1. **性能分析**：学会了如何分析和监控表格组件的性能瓶颈
2. **虚拟滚动**：实现了高效的虚拟滚动算法和组件
3. **内存优化**：掌握了内存泄漏检测和优化技术
4. **大数据处理**：构建了适用于大数据量的表格解决方案

这些技能将帮助我们构建高性能的企业级表格应用。