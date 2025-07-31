# Large Data Processing and Virtual Scrolling

## Overview

This document provides comprehensive strategies for handling large datasets in Element Plus applications. We'll explore virtual scrolling implementations, data pagination techniques, memory-efficient data structures, and performance optimization patterns for applications dealing with thousands or millions of records.

## Virtual Scrolling Implementation

### 1. Advanced Virtual List Component

```typescript
// Advanced virtual scrolling with dynamic heights and horizontal support
import { defineComponent, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useResizeObserver, useThrottleFn } from '@vueuse/core'

interface VirtualScrollItem {
  index: number
  data: any
  height?: number
  width?: number
  offset: number
}

interface VirtualScrollProps {
  items: any[]
  itemSize: number | ((index: number) => number)
  containerSize: number
  direction?: 'vertical' | 'horizontal'
  overscan?: number
  getItemKey?: (item: any, index: number) => string | number
  estimatedItemSize?: number
  onScroll?: (scrollOffset: number) => void
  onVisibleRangeChange?: (startIndex: number, endIndex: number) => void
}

export const VirtualScroller = defineComponent({
  name: 'VirtualScroller',
  props: {
    items: {
      type: Array,
      required: true
    },
    itemSize: {
      type: [Number, Function],
      required: true
    },
    containerSize: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      default: 'vertical'
    },
    overscan: {
      type: Number,
      default: 5
    },
    getItemKey: {
      type: Function,
      default: (item: any, index: number) => index
    },
    estimatedItemSize: {
      type: Number,
      default: 50
    }
  },
  emits: ['scroll', 'visible-range-change'],
  setup(props, { emit, slots }) {
    const containerRef = ref<HTMLElement>()
    const scrollOffset = ref(0)
    const isHorizontal = computed(() => props.direction === 'horizontal')
    
    // Cache for measured sizes
    const sizeCache = new Map<number, number>()
    const offsetCache = new Map<number, number>()
    
    // Get item size with caching
    const getItemSize = (index: number): number => {
      if (sizeCache.has(index)) {
        return sizeCache.get(index)!
      }
      
      let size: number
      if (typeof props.itemSize === 'function') {
        size = props.itemSize(index)
      } else {
        size = props.itemSize
      }
      
      sizeCache.set(index, size)
      return size
    }
    
    // Get item offset with caching
    const getItemOffset = (index: number): number => {
      if (offsetCache.has(index)) {
        return offsetCache.get(index)!
      }
      
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += getItemSize(i)
      }
      
      offsetCache.set(index, offset)
      return offset
    }
    
    // Clear cache for items after the given index
    const clearCacheAfter = (index: number) => {
      for (let i = index; i < props.items.length; i++) {
        offsetCache.delete(i)
      }
    }
    
    // Update item size and clear dependent cache
    const updateItemSize = (index: number, size: number) => {
      const currentSize = sizeCache.get(index)
      if (currentSize !== size) {
        sizeCache.set(index, size)
        clearCacheAfter(index + 1)
      }
    }
    
    // Calculate total size
    const totalSize = computed(() => {
      if (props.items.length === 0) return 0
      return getItemOffset(props.items.length - 1) + getItemSize(props.items.length - 1)
    })
    
    // Binary search for start index
    const findStartIndex = (scrollOffset: number): number => {
      let low = 0
      let high = props.items.length - 1
      
      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const offset = getItemOffset(mid)
        
        if (offset < scrollOffset) {
          low = mid + 1
        } else {
          high = mid - 1
        }
      }
      
      return Math.max(0, low - 1)
    }
    
    // Calculate visible range
    const visibleRange = computed(() => {
      const containerSize = props.containerSize
      const scrollStart = scrollOffset.value
      const scrollEnd = scrollStart + containerSize
      
      let startIndex = findStartIndex(scrollStart)
      let endIndex = startIndex
      
      // Find end index
      let currentOffset = getItemOffset(startIndex)
      while (endIndex < props.items.length && currentOffset < scrollEnd) {
        currentOffset += getItemSize(endIndex)
        endIndex++
      }
      
      // Apply overscan
      startIndex = Math.max(0, startIndex - props.overscan)
      endIndex = Math.min(props.items.length - 1, endIndex + props.overscan)
      
      return { startIndex, endIndex }
    })
    
    // Visible items with positioning
    const visibleItems = computed((): VirtualScrollItem[] => {
      const { startIndex, endIndex } = visibleRange.value
      const items: VirtualScrollItem[] = []
      
      for (let i = startIndex; i <= endIndex; i++) {
        items.push({
          index: i,
          data: props.items[i],
          height: isHorizontal.value ? undefined : getItemSize(i),
          width: isHorizontal.value ? getItemSize(i) : undefined,
          offset: getItemOffset(i)
        })
      }
      
      return items
    })
    
    // Throttled scroll handler
    const handleScroll = useThrottleFn((event: Event) => {
      const target = event.target as HTMLElement
      const newOffset = isHorizontal.value ? target.scrollLeft : target.scrollTop
      
      scrollOffset.value = newOffset
      emit('scroll', newOffset)
      
      const { startIndex, endIndex } = visibleRange.value
      emit('visible-range-change', startIndex, endIndex)
    }, 16)
    
    // Scroll to specific item
    const scrollToItem = (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      if (!containerRef.value || index < 0 || index >= props.items.length) return
      
      const itemOffset = getItemOffset(index)
      const itemSize = getItemSize(index)
      const containerSize = props.containerSize
      
      let scrollTo = itemOffset
      
      if (align === 'center') {
        scrollTo = itemOffset - (containerSize - itemSize) / 2
      } else if (align === 'end') {
        scrollTo = itemOffset - containerSize + itemSize
      }
      
      scrollTo = Math.max(0, Math.min(scrollTo, totalSize.value - containerSize))
      
      if (isHorizontal.value) {
        containerRef.value.scrollLeft = scrollTo
      } else {
        containerRef.value.scrollTop = scrollTo
      }
    }
    
    // Scroll to offset
    const scrollToOffset = (offset: number) => {
      if (!containerRef.value) return
      
      const clampedOffset = Math.max(0, Math.min(offset, totalSize.value - props.containerSize))
      
      if (isHorizontal.value) {
        containerRef.value.scrollLeft = clampedOffset
      } else {
        containerRef.value.scrollTop = clampedOffset
      }
    }
    
    // Resize observer for dynamic sizing
    const itemRefs = ref(new Map<number, HTMLElement>())
    
    const observeItemSize = (index: number, element: HTMLElement) => {
      itemRefs.value.set(index, element)
      
      if (typeof props.itemSize === 'function') {
        useResizeObserver(element, (entries) => {
          const entry = entries[0]
          if (entry) {
            const size = isHorizontal.value 
              ? entry.contentRect.width 
              : entry.contentRect.height
            updateItemSize(index, size)
          }
        })
      }
    }
    
    return {
      containerRef,
      visibleItems,
      totalSize,
      handleScroll,
      scrollToItem,
      scrollToOffset,
      observeItemSize,
      isHorizontal
    }
  },
  render() {
    const containerStyle = {
      [this.isHorizontal ? 'width' : 'height']: `${this.containerSize}px`,
      overflow: 'auto'
    }
    
    const contentStyle = {
      [this.isHorizontal ? 'width' : 'height']: `${this.totalSize}px`,
      [this.isHorizontal ? 'height' : 'width']: '100%',
      position: 'relative'
    }
    
    return (
      <div
        ref="containerRef"
        class="virtual-scroller"
        style={containerStyle}
        onScroll={this.handleScroll}
      >
        <div class="virtual-scroller__content" style={contentStyle}>
          {this.visibleItems.map((item) => {
            const itemStyle = {
              position: 'absolute',
              [this.isHorizontal ? 'left' : 'top']: `${item.offset}px`,
              [this.isHorizontal ? 'width' : 'height']: `${item.height || item.width}px`,
              [this.isHorizontal ? 'height' : 'width']: '100%'
            }
            
            return (
              <div
                key={this.getItemKey(item.data, item.index)}
                class="virtual-scroller__item"
                style={itemStyle}
                ref={(el) => el && this.observeItemSize(item.index, el as HTMLElement)}
              >
                {this.$slots.default?.({ item: item.data, index: item.index })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
```

### 2. Virtual Table with Column Virtualization

```typescript
// Virtual table with both row and column virtualization
import { defineComponent, ref, computed, reactive } from 'vue'

interface TableColumn {
  key: string
  title: string
  width: number
  fixed?: 'left' | 'right'
  render?: (value: any, record: any, index: number) => any
}

interface VirtualTableProps {
  data: any[]
  columns: TableColumn[]
  height: number
  width: number
  rowHeight: number
  headerHeight?: number
  overscanRowCount?: number
  overscanColumnCount?: number
}

export const VirtualTable = defineComponent({
  name: 'VirtualTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    rowHeight: {
      type: Number,
      default: 40
    },
    headerHeight: {
      type: Number,
      default: 40
    },
    overscanRowCount: {
      type: Number,
      default: 5
    },
    overscanColumnCount: {
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const tableRef = ref<HTMLElement>()
    const scrollState = reactive({
      scrollTop: 0,
      scrollLeft: 0
    })
    
    // Column calculations
    const columnMetrics = computed(() => {
      let offset = 0
      const metrics = props.columns.map(column => {
        const metric = {
          ...column,
          offset,
          width: column.width
        }
        offset += column.width
        return metric
      })
      
      return {
        columns: metrics,
        totalWidth: offset
      }
    })
    
    // Visible column range
    const visibleColumnRange = computed(() => {
      const { columns } = columnMetrics.value
      const scrollLeft = scrollState.scrollLeft
      const viewportWidth = props.width
      
      let startIndex = 0
      let endIndex = columns.length - 1
      
      // Find start column
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].offset + columns[i].width > scrollLeft) {
          startIndex = i
          break
        }
      }
      
      // Find end column
      for (let i = startIndex; i < columns.length; i++) {
        if (columns[i].offset > scrollLeft + viewportWidth) {
          endIndex = i - 1
          break
        }
      }
      
      // Apply overscan
      startIndex = Math.max(0, startIndex - props.overscanColumnCount)
      endIndex = Math.min(columns.length - 1, endIndex + props.overscanColumnCount)
      
      return { startIndex, endIndex }
    })
    
    // Visible row range
    const visibleRowRange = computed(() => {
      const scrollTop = scrollState.scrollTop
      const viewportHeight = props.height - props.headerHeight
      
      const startIndex = Math.floor(scrollTop / props.rowHeight)
      const endIndex = Math.min(
        props.data.length - 1,
        Math.ceil((scrollTop + viewportHeight) / props.rowHeight)
      )
      
      // Apply overscan
      const overscanStartIndex = Math.max(0, startIndex - props.overscanRowCount)
      const overscanEndIndex = Math.min(props.data.length - 1, endIndex + props.overscanRowCount)
      
      return {
        startIndex: overscanStartIndex,
        endIndex: overscanEndIndex
      }
    })
    
    // Visible columns
    const visibleColumns = computed(() => {
      const { startIndex, endIndex } = visibleColumnRange.value
      return columnMetrics.value.columns.slice(startIndex, endIndex + 1)
    })
    
    // Visible rows
    const visibleRows = computed(() => {
      const { startIndex, endIndex } = visibleRowRange.value
      return props.data.slice(startIndex, endIndex + 1).map((row, index) => ({
        data: row,
        index: startIndex + index
      }))
    })
    
    // Scroll handler
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement
      scrollState.scrollTop = target.scrollTop
      scrollState.scrollLeft = target.scrollLeft
    }
    
    // Scroll to row
    const scrollToRow = (rowIndex: number) => {
      if (!tableRef.value) return
      
      const scrollTop = rowIndex * props.rowHeight
      tableRef.value.scrollTop = scrollTop
    }
    
    // Scroll to column
    const scrollToColumn = (columnIndex: number) => {
      if (!tableRef.value) return
      
      const column = columnMetrics.value.columns[columnIndex]
      if (column) {
        tableRef.value.scrollLeft = column.offset
      }
    }
    
    return {
      tableRef,
      columnMetrics,
      visibleColumns,
      visibleRows,
      visibleRowRange,
      scrollState,
      handleScroll,
      scrollToRow,
      scrollToColumn
    }
  },
  render() {
    const tableStyle = {
      width: `${this.width}px`,
      height: `${this.height}px`,
      overflow: 'auto'
    }
    
    const contentStyle = {
      width: `${this.columnMetrics.totalWidth}px`,
      height: `${this.data.length * this.rowHeight + this.headerHeight}px`,
      position: 'relative'
    }
    
    const headerStyle = {
      position: 'absolute',
      top: '0px',
      left: `${-this.scrollState.scrollLeft}px`,
      height: `${this.headerHeight}px`,
      display: 'flex',
      backgroundColor: '#f5f7fa',
      borderBottom: '1px solid #ebeef5'
    }
    
    return (
      <div
        ref="tableRef"
        class="virtual-table"
        style={tableStyle}
        onScroll={this.handleScroll}
      >
        <div class="virtual-table__content" style={contentStyle}>
          {/* Header */}
          <div class="virtual-table__header" style={headerStyle}>
            {this.visibleColumns.map(column => (
              <div
                key={column.key}
                class="virtual-table__header-cell"
                style={{
                  width: `${column.width}px`,
                  height: `${this.headerHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  borderRight: '1px solid #ebeef5'
                }}
              >
                {column.title}
              </div>
            ))}
          </div>
          
          {/* Rows */}
          {this.visibleRows.map(({ data: row, index }) => {
            const rowStyle = {
              position: 'absolute',
              top: `${index * this.rowHeight + this.headerHeight}px`,
              left: `${-this.scrollState.scrollLeft}px`,
              height: `${this.rowHeight}px`,
              display: 'flex',
              borderBottom: '1px solid #ebeef5'
            }
            
            return (
              <div
                key={index}
                class="virtual-table__row"
                style={rowStyle}
              >
                {this.visibleColumns.map(column => (
                  <div
                    key={column.key}
                    class="virtual-table__cell"
                    style={{
                      width: `${column.width}px`,
                      height: `${this.rowHeight}px`,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      borderRight: '1px solid #ebeef5'
                    }}
                  >
                    {column.render 
                      ? column.render(row[column.key], row, index)
                      : row[column.key]
                    }
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
})
```

## Data Pagination and Lazy Loading

### 1. Advanced Pagination with Caching

```typescript
// Advanced pagination system with intelligent caching
import { ref, computed, reactive, watch } from 'vue'

interface PaginationOptions {
  pageSize: number
  prefetchPages?: number
  cacheSize?: number
  enableInfiniteScroll?: boolean
}

interface PageData<T> {
  data: T[]
  total: number
  hasMore: boolean
  timestamp: number
}

interface DataFetcher<T> {
  (page: number, pageSize: number, filters?: any): Promise<{
    data: T[]
    total: number
    hasMore: boolean
  }>
}

export function usePaginatedData<T>(
  fetcher: DataFetcher<T>,
  options: PaginationOptions
) {
  const {
    pageSize,
    prefetchPages = 1,
    cacheSize = 10,
    enableInfiniteScroll = false
  } = options
  
  // State
  const currentPage = ref(1)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const filters = ref<any>({})
  
  // Cache management
  const cache = reactive(new Map<string, PageData<T>>())
  const cacheKeys = ref<string[]>([])
  
  // Generate cache key
  const getCacheKey = (page: number, filters: any) => {
    return `${page}-${JSON.stringify(filters)}`
  }
  
  // Cache operations
  const setCache = (key: string, data: PageData<T>) => {
    if (cache.size >= cacheSize) {
      // Remove oldest cache entry
      const oldestKey = cacheKeys.value.shift()
      if (oldestKey) {
        cache.delete(oldestKey)
      }
    }
    
    cache.set(key, data)
    cacheKeys.value.push(key)
  }
  
  const getCache = (key: string): PageData<T> | undefined => {
    const data = cache.get(key)
    if (data) {
      // Move to end (LRU)
      const index = cacheKeys.value.indexOf(key)
      if (index > -1) {
        cacheKeys.value.splice(index, 1)
        cacheKeys.value.push(key)
      }
    }
    return data
  }
  
  // Fetch data for a specific page
  const fetchPage = async (page: number, useCache = true): Promise<PageData<T>> => {
    const cacheKey = getCacheKey(page, filters.value)
    
    // Check cache first
    if (useCache) {
      const cached = getCache(cacheKey)
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
        return cached
      }
    }
    
    try {
      const result = await fetcher(page, pageSize, filters.value)
      const pageData: PageData<T> = {
        ...result,
        timestamp: Date.now()
      }
      
      setCache(cacheKey, pageData)
      return pageData
    } catch (err) {
      throw err as Error
    }
  }
  
  // Current page data
  const currentPageData = computed(() => {
    const cacheKey = getCacheKey(currentPage.value, filters.value)
    return getCache(cacheKey)
  })
  
  // Load current page
  const loadPage = async (page: number) => {
    if (loading.value) return
    
    loading.value = true
    error.value = null
    
    try {
      await fetchPage(page)
      currentPage.value = page
      
      // Prefetch adjacent pages
      if (prefetchPages > 0) {
        const prefetchPromises: Promise<any>[] = []
        
        for (let i = 1; i <= prefetchPages; i++) {
          if (page + i <= Math.ceil((currentPageData.value?.total || 0) / pageSize)) {
            prefetchPromises.push(fetchPage(page + i, false).catch(() => {}))
          }
          if (page - i >= 1) {
            prefetchPromises.push(fetchPage(page - i, false).catch(() => {}))
          }
        }
        
        // Don't wait for prefetch
        Promise.all(prefetchPromises).catch(() => {})
      }
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  
  // Infinite scroll data
  const allData = ref<T[]>([])
  const hasMore = ref(true)
  
  // Load more for infinite scroll
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    
    const nextPage = Math.floor(allData.value.length / pageSize) + 1
    
    loading.value = true
    error.value = null
    
    try {
      const pageData = await fetchPage(nextPage)
      allData.value.push(...pageData.data)
      hasMore.value = pageData.hasMore
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  
  // Navigation methods
  const goToPage = (page: number) => {
    if (page >= 1) {
      loadPage(page)
    }
  }
  
  const nextPage = () => {
    const totalPages = Math.ceil((currentPageData.value?.total || 0) / pageSize)
    if (currentPage.value < totalPages) {
      goToPage(currentPage.value + 1)
    }
  }
  
  const prevPage = () => {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  }
  
  // Filter management
  const updateFilters = (newFilters: any) => {
    filters.value = { ...newFilters }
    if (enableInfiniteScroll) {
      allData.value = []
      hasMore.value = true
      loadMore()
    } else {
      goToPage(1)
    }
  }
  
  // Refresh current page
  const refresh = () => {
    const cacheKey = getCacheKey(currentPage.value, filters.value)
    cache.delete(cacheKey)
    
    if (enableInfiniteScroll) {
      allData.value = []
      hasMore.value = true
      loadMore()
    } else {
      loadPage(currentPage.value)
    }
  }
  
  // Clear cache
  const clearCache = () => {
    cache.clear()
    cacheKeys.value = []
  }
  
  // Computed properties
  const totalPages = computed(() => {
    return Math.ceil((currentPageData.value?.total || 0) / pageSize)
  })
  
  const canGoNext = computed(() => {
    return currentPage.value < totalPages.value
  })
  
  const canGoPrev = computed(() => {
    return currentPage.value > 1
  })
  
  // Initialize
  if (enableInfiniteScroll) {
    loadMore()
  } else {
    loadPage(1)
  }
  
  return {
    // State
    currentPage: readonly(currentPage),
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    
    // Data
    currentPageData,
    allData: readonly(allData),
    hasMore: readonly(hasMore),
    
    // Computed
    totalPages,
    canGoNext,
    canGoPrev,
    
    // Methods
    goToPage,
    nextPage,
    prevPage,
    loadMore,
    updateFilters,
    refresh,
    clearCache
  }
}
```

### 2. Infinite Scroll Implementation

```typescript
// Infinite scroll with intersection observer
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface InfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  immediate?: boolean
  distance?: number
  disabled?: boolean
}

export function useInfiniteScroll(
  target: Ref<HTMLElement | undefined>,
  onLoadMore: () => void | Promise<void>,
  options: InfiniteScrollOptions = {}
) {
  const {
    threshold = 0,
    rootMargin = '0px',
    immediate = true,
    distance = 0,
    disabled = false
  } = options
  
  const isLoading = ref(false)
  const observer = ref<IntersectionObserver>()
  
  const stop = () => {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }
  
  const start = () => {
    if (disabled || !target.value) return
    
    stop()
    
    observer.value = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading.value) {
          isLoading.value = true
          
          try {
            await onLoadMore()
          } catch (error) {
            console.error('Infinite scroll load error:', error)
          } finally {
            isLoading.value = false
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    )
    
    // Create sentinel element
    const sentinel = document.createElement('div')
    sentinel.style.height = '1px'
    sentinel.style.position = 'absolute'
    sentinel.style.bottom = `${distance}px`
    sentinel.style.width = '100%'
    
    target.value.appendChild(sentinel)
    observer.value.observe(sentinel)
  }
  
  onMounted(() => {
    if (immediate) {
      start()
    }
  })
  
  onBeforeUnmount(stop)
  
  return {
    isLoading: readonly(isLoading),
    start,
    stop
  }
}

// Infinite scroll component
export const InfiniteScrollList = defineComponent({
  name: 'InfiniteScrollList',
  props: {
    items: {
      type: Array,
      required: true
    },
    loading: Boolean,
    hasMore: Boolean,
    loadMore: {
      type: Function,
      required: true
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    distance: {
      type: Number,
      default: 100
    }
  },
  setup(props) {
    const listRef = ref<HTMLElement>()
    
    const { isLoading } = useInfiniteScroll(
      listRef,
      props.loadMore,
      {
        threshold: props.threshold,
        distance: props.distance,
        disabled: computed(() => props.loading || !props.hasMore)
      }
    )
    
    return {
      listRef,
      isLoading
    }
  },
  render() {
    return (
      <div ref="listRef" class="infinite-scroll-list">
        {/* Render items */}
        {this.items.map((item, index) => (
          <div key={index} class="infinite-scroll-item">
            {this.$slots.default?.({ item, index })}
          </div>
        ))}
        
        {/* Loading indicator */}
        {(this.loading || this.isLoading) && (
          <div class="infinite-scroll-loading">
            {this.$slots.loading?.() || 'Loading...'}
          </div>
        )}
        
        {/* No more data indicator */}
        {!this.hasMore && this.items.length > 0 && (
          <div class="infinite-scroll-finished">
            {this.$slots.finished?.() || 'No more data'}
          </div>
        )}
      </div>
    )
  }
})
```

## Memory-Efficient Data Structures

### 1. Chunked Data Management

```typescript
// Chunked data structure for memory efficiency
class ChunkedDataManager<T> {
  private chunks = new Map<number, T[]>()
  private chunkSize: number
  private maxChunks: number
  private accessOrder: number[] = []
  
  constructor(chunkSize = 1000, maxChunks = 10) {
    this.chunkSize = chunkSize
    this.maxChunks = maxChunks
  }
  
  private getChunkIndex(index: number): number {
    return Math.floor(index / this.chunkSize)
  }
  
  private getItemIndex(index: number): number {
    return index % this.chunkSize
  }
  
  private evictOldestChunk(): void {
    if (this.accessOrder.length >= this.maxChunks) {
      const oldestChunk = this.accessOrder.shift()
      if (oldestChunk !== undefined) {
        this.chunks.delete(oldestChunk)
      }
    }
  }
  
  private updateAccessOrder(chunkIndex: number): void {
    const existingIndex = this.accessOrder.indexOf(chunkIndex)
    if (existingIndex > -1) {
      this.accessOrder.splice(existingIndex, 1)
    }
    this.accessOrder.push(chunkIndex)
  }
  
  setChunk(chunkIndex: number, data: T[]): void {
    this.evictOldestChunk()
    this.chunks.set(chunkIndex, data)
    this.updateAccessOrder(chunkIndex)
  }
  
  getItem(index: number): T | undefined {
    const chunkIndex = this.getChunkIndex(index)
    const itemIndex = this.getItemIndex(index)
    
    const chunk = this.chunks.get(chunkIndex)
    if (chunk) {
      this.updateAccessOrder(chunkIndex)
      return chunk[itemIndex]
    }
    
    return undefined
  }
  
  hasChunk(chunkIndex: number): boolean {
    return this.chunks.has(chunkIndex)
  }
  
  getChunk(chunkIndex: number): T[] | undefined {
    const chunk = this.chunks.get(chunkIndex)
    if (chunk) {
      this.updateAccessOrder(chunkIndex)
    }
    return chunk
  }
  
  clear(): void {
    this.chunks.clear()
    this.accessOrder = []
  }
  
  getMemoryUsage(): { chunks: number; totalItems: number } {
    let totalItems = 0
    this.chunks.forEach(chunk => {
      totalItems += chunk.length
    })
    
    return {
      chunks: this.chunks.size,
      totalItems
    }
  }
}

// Composable for chunked data
export function useChunkedData<T>(
  fetcher: (chunkIndex: number, chunkSize: number) => Promise<T[]>,
  chunkSize = 1000,
  maxChunks = 10
) {
  const dataManager = new ChunkedDataManager<T>(chunkSize, maxChunks)
  const loading = ref(new Set<number>())
  const error = ref<Error | null>(null)
  
  const loadChunk = async (chunkIndex: number): Promise<T[]> => {
    if (dataManager.hasChunk(chunkIndex)) {
      return dataManager.getChunk(chunkIndex)!
    }
    
    if (loading.value.has(chunkIndex)) {
      // Wait for existing request
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          if (!loading.value.has(chunkIndex)) {
            const chunk = dataManager.getChunk(chunkIndex)
            if (chunk) {
              resolve(chunk)
            } else {
              reject(new Error('Failed to load chunk'))
            }
          } else {
            setTimeout(checkLoading, 10)
          }
        }
        checkLoading()
      })
    }
    
    loading.value.add(chunkIndex)
    
    try {
      const data = await fetcher(chunkIndex, chunkSize)
      dataManager.setChunk(chunkIndex, data)
      return data
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value.delete(chunkIndex)
    }
  }
  
  const getItem = async (index: number): Promise<T | undefined> => {
    const chunkIndex = Math.floor(index / chunkSize)
    
    try {
      await loadChunk(chunkIndex)
      return dataManager.getItem(index)
    } catch (err) {
      console.error('Failed to get item:', err)
      return undefined
    }
  }
  
  const getItems = async (startIndex: number, count: number): Promise<T[]> => {
    const items: T[] = []
    const promises: Promise<void>[] = []
    
    for (let i = 0; i < count; i++) {
      const index = startIndex + i
      promises.push(
        getItem(index).then(item => {
          if (item !== undefined) {
            items[i] = item
          }
        })
      )
    }
    
    await Promise.all(promises)
    return items.filter(item => item !== undefined)
  }
  
  const preloadChunks = async (chunkIndices: number[]): Promise<void> => {
    const promises = chunkIndices.map(index => 
      loadChunk(index).catch(() => {})
    )
    await Promise.all(promises)
  }
  
  const clear = () => {
    dataManager.clear()
    loading.value.clear()
    error.value = null
  }
  
  const getMemoryUsage = () => {
    return dataManager.getMemoryUsage()
  }
  
  return {
    getItem,
    getItems,
    loadChunk,
    preloadChunks,
    clear,
    getMemoryUsage,
    loading: readonly(loading),
    error: readonly(error)
  }
}
```

### 2. Data Streaming and Progressive Loading

```typescript
// Progressive data loading with streaming
export class DataStream<T> {
  private buffer: T[] = []
  private bufferSize: number
  private onData: (items: T[]) => void
  private onError: (error: Error) => void
  private onComplete: () => void
  
  constructor(
    bufferSize = 100,
    callbacks: {
      onData: (items: T[]) => void
      onError: (error: Error) => void
      onComplete: () => void
    }
  ) {
    this.bufferSize = bufferSize
    this.onData = callbacks.onData
    this.onError = callbacks.onError
    this.onComplete = callbacks.onComplete
  }
  
  push(item: T): void {
    this.buffer.push(item)
    
    if (this.buffer.length >= this.bufferSize) {
      this.flush()
    }
  }
  
  pushBatch(items: T[]): void {
    this.buffer.push(...items)
    
    while (this.buffer.length >= this.bufferSize) {
      const batch = this.buffer.splice(0, this.bufferSize)
      this.onData(batch)
    }
  }
  
  flush(): void {
    if (this.buffer.length > 0) {
      const batch = this.buffer.splice(0)
      this.onData(batch)
    }
  }
  
  complete(): void {
    this.flush()
    this.onComplete()
  }
  
  error(err: Error): void {
    this.onError(err)
  }
}

// Progressive loading composable
export function useProgressiveLoading<T>(
  fetcher: (offset: number, limit: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: {
    batchSize?: number
    bufferSize?: number
    autoStart?: boolean
  } = {}
) {
  const {
    batchSize = 100,
    bufferSize = 50,
    autoStart = true
  } = options
  
  const data = ref<T[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const hasMore = ref(true)
  const progress = ref(0)
  
  let offset = 0
  let stream: DataStream<T> | null = null
  
  const createStream = () => {
    return new DataStream<T>(bufferSize, {
      onData: (items: T[]) => {
        data.value.push(...items)
        progress.value = data.value.length
      },
      onError: (err: Error) => {
        error.value = err
        loading.value = false
      },
      onComplete: () => {
        loading.value = false
      }
    })
  }
  
  const loadBatch = async (): Promise<boolean> => {
    try {
      const result = await fetcher(offset, batchSize)
      
      if (stream) {
        stream.pushBatch(result.data)
      }
      
      offset += result.data.length
      hasMore.value = result.hasMore
      
      return result.hasMore
    } catch (err) {
      if (stream) {
        stream.error(err as Error)
      }
      return false
    }
  }
  
  const start = async () => {
    if (loading.value) return
    
    loading.value = true
    error.value = null
    stream = createStream()
    
    try {
      while (hasMore.value) {
        const shouldContinue = await loadBatch()
        if (!shouldContinue) break
        
        // Allow UI to update
        await nextTick()
      }
      
      stream.complete()
    } catch (err) {
      if (stream) {
        stream.error(err as Error)
      }
    }
  }
  
  const reset = () => {
    data.value = []
    offset = 0
    hasMore.value = true
    progress.value = 0
    error.value = null
    loading.value = false
    stream = null
  }
  
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return
    
    loading.value = true
    
    if (!stream) {
      stream = createStream()
    }
    
    await loadBatch()
    loading.value = false
  }
  
  if (autoStart) {
    start()
  }
  
  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    progress: readonly(progress),
    start,
    reset,
    loadMore
  }
}
```

## Performance Optimization Patterns

### 1. Data Processing Optimization

```typescript
// Optimized data processing with Web Workers
export class DataProcessor {
  private worker: Worker | null = null
  private taskQueue: Array<{
    id: string
    data: any
    resolve: (result: any) => void
    reject: (error: Error) => void
  }> = []
  
  constructor(workerScript: string) {
    this.initWorker(workerScript)
  }
  
  private initWorker(script: string) {
    try {
      this.worker = new Worker(script)
      this.worker.onmessage = this.handleWorkerMessage.bind(this)
      this.worker.onerror = this.handleWorkerError.bind(this)
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread')
    }
  }
  
  private handleWorkerMessage(event: MessageEvent) {
    const { id, result, error } = event.data
    const task = this.taskQueue.find(t => t.id === id)
    
    if (task) {
      this.taskQueue = this.taskQueue.filter(t => t.id !== id)
      
      if (error) {
        task.reject(new Error(error))
      } else {
        task.resolve(result)
      }
    }
  }
  
  private handleWorkerError(error: ErrorEvent) {
    console.error('Worker error:', error)
    this.taskQueue.forEach(task => {
      task.reject(new Error('Worker error'))
    })
    this.taskQueue = []
  }
  
  async process<T, R>(data: T, operation: string): Promise<R> {
    if (!this.worker) {
      // Fallback to main thread
      return this.processInMainThread(data, operation)
    }
    
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9)
      
      this.taskQueue.push({ id, data, resolve, reject })
      
      this.worker!.postMessage({
        id,
        operation,
        data
      })
    })
  }
  
  private async processInMainThread<T, R>(data: T, operation: string): Promise<R> {
    // Implement fallback processing
    switch (operation) {
      case 'sort':
        return this.sortData(data as any) as R
      case 'filter':
        return this.filterData(data as any) as R
      case 'transform':
        return this.transformData(data as any) as R
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }
  
  private sortData(data: any[]): any[] {
    return [...data].sort((a, b) => {
      // Implement sorting logic
      return a.id - b.id
    })
  }
  
  private filterData(data: any[]): any[] {
    return data.filter(item => {
      // Implement filtering logic
      return item.active
    })
  }
  
  private transformData(data: any[]): any[] {
    return data.map(item => {
      // Implement transformation logic
      return { ...item, processed: true }
    })
  }
  
  destroy() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
    this.taskQueue = []
  }
}

// Composable for data processing
export function useDataProcessor(workerScript?: string) {
  const processor = ref<DataProcessor | null>(null)
  
  onMounted(() => {
    if (workerScript) {
      processor.value = new DataProcessor(workerScript)
    }
  })
  
  onBeforeUnmount(() => {
    processor.value?.destroy()
  })
  
  const processData = async <T, R>(data: T, operation: string): Promise<R> => {
    if (!processor.value) {
      throw new Error('Data processor not initialized')
    }
    
    return processor.value.process<T, R>(data, operation)
  }
  
  return {
    processData
  }
}
```

### 2. Batch Operations

```typescript
// Batch operation manager
export class BatchOperationManager {
  private batches = new Map<string, {
    operations: Array<() => Promise<any>>
    timer: NodeJS.Timeout | null
    resolve: (results: any[]) => void
    reject: (error: Error) => void
  }>()
  
  private batchSize: number
  private delay: number
  
  constructor(batchSize = 10, delay = 100) {
    this.batchSize = batchSize
    this.delay = delay
  }
  
  addOperation<T>(
    batchKey: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, {
          operations: [],
          timer: null,
          resolve: () => {},
          reject: () => {}
        })
      }
      
      const batch = this.batches.get(batchKey)!
      batch.operations.push(operation)
      
      // Clear existing timer
      if (batch.timer) {
        clearTimeout(batch.timer)
      }
      
      // Execute immediately if batch is full
      if (batch.operations.length >= this.batchSize) {
        this.executeBatch(batchKey)
      } else {
        // Set timer for delayed execution
        batch.timer = setTimeout(() => {
          this.executeBatch(batchKey)
        }, this.delay)
      }
      
      // Store resolve/reject for this specific operation
      const operationIndex = batch.operations.length - 1
      const originalResolve = batch.resolve
      const originalReject = batch.reject
      
      batch.resolve = (results: any[]) => {
        resolve(results[operationIndex])
        originalResolve(results)
      }
      
      batch.reject = (error: Error) => {
        reject(error)
        originalReject(error)
      }
    })
  }
  
  private async executeBatch(batchKey: string) {
    const batch = this.batches.get(batchKey)
    if (!batch) return
    
    const { operations, timer } = batch
    
    if (timer) {
      clearTimeout(timer)
    }
    
    this.batches.delete(batchKey)
    
    try {
      const results = await Promise.all(
        operations.map(op => op())
      )
      batch.resolve(results)
    } catch (error) {
      batch.reject(error as Error)
    }
  }
  
  flush(batchKey?: string) {
    if (batchKey) {
      this.executeBatch(batchKey)
    } else {
      // Flush all batches
      for (const key of this.batches.keys()) {
        this.executeBatch(key)
      }
    }
  }
  
  clear() {
    for (const batch of this.batches.values()) {
      if (batch.timer) {
        clearTimeout(batch.timer)
      }
    }
    this.batches.clear()
  }
}

// Composable for batch operations
export function useBatchOperations(batchSize = 10, delay = 100) {
  const manager = new BatchOperationManager(batchSize, delay)
  
  onBeforeUnmount(() => {
    manager.clear()
  })
  
  const addToBatch = <T>(
    batchKey: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    return manager.addOperation(batchKey, operation)
  }
  
  const flushBatch = (batchKey?: string) => {
    manager.flush(batchKey)
  }
  
  return {
    addToBatch,
    flushBatch
  }
}
```

## Best Practices

### 1. Performance Guidelines

- **Virtual Scrolling**: Essential for lists with >1000 items
- **Chunked Loading**: Use for datasets with >10,000 items
- **Memory Management**: Implement LRU caching for large datasets
- **Progressive Loading**: Stream data for better perceived performance
- **Batch Operations**: Group similar operations to reduce overhead

### 2. Memory Optimization

- **Lazy Loading**: Load data only when needed
- **Data Cleanup**: Remove unused data from memory
- **Efficient Data Structures**: Use appropriate data structures for your use case
- **Garbage Collection**: Be mindful of object references

### 3. User Experience

- **Loading States**: Provide clear feedback during data loading
- **Error Handling**: Gracefully handle network and data errors
- **Smooth Scrolling**: Maintain 60fps during scrolling
- **Responsive Design**: Ensure performance across different devices

## Conclusion

Effective large data processing in Element Plus applications requires:

- **Virtual Scrolling**: For rendering performance with large lists
- **Smart Pagination**: With caching and prefetching strategies
- **Memory Management**: Efficient data structures and cleanup
- **Progressive Loading**: For better user experience
- **Performance Monitoring**: Continuous optimization based on metrics

By implementing these patterns, you can handle millions of records while maintaining excellent performance and user experience.