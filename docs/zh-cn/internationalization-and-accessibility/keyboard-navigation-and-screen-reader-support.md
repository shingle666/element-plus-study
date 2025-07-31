# 第64天：Element Plus 键盘导航与屏幕阅读器支持

## 学习目标

* 掌握键盘导航的设计原则和实现方法
* 学习屏幕阅读器的工作原理和适配技巧
* 理解焦点管理和键盘陷阱的概念
* 实现完整的键盘和屏幕阅读器支持方案

## 知识点概览

### 1. 键盘导航基础

#### 1.1 键盘导航原则

* **可达性**：所有交互元素都应该可以通过键盘访问
* **可预测性**：键盘行为应该符合用户期望
* **高效性**：提供快捷键和跳转功能
* **可见性**：清晰的焦点指示器

#### 1.2 标准键盘快捷键

```typescript
// types/keyboard.ts
// 键盘事件类型定义
export interface KeyboardEventMap {
  // 导航键
  'Tab': () => void
  'Shift+Tab': () => void
  'ArrowUp': () => void
  'ArrowDown': () => void
  'ArrowLeft': () => void
  'ArrowRight': () => void
  'Home': () => void
  'End': () => void
  'PageUp': () => void
  'PageDown': () => void
  
  // 激活键
  'Enter': () => void
  'Space': () => void
  
  // 功能键
  'Escape': () => void
  'Delete': () => void
  'Backspace': () => void
  
  // 组合键
  'Ctrl+A': () => void
  'Ctrl+C': () => void
  'Ctrl+V': () => void
  'Ctrl+Z': () => void
}

// 键盘导航管理器
export class KeyboardNavigationManager {
  private handlers: Map<string, () => void> = new Map()
  private element: HTMLElement
  private isActive: boolean = false
  
  constructor(element: HTMLElement) {
    this.element = element
    this.bindEvents()
  }
  
  // 注册键盘事件处理器
  register<K extends keyof KeyboardEventMap>(key: K, handler: KeyboardEventMap[K]): void {
    this.handlers.set(key, handler)
  }
  
  // 注销键盘事件处理器
  unregister(key: keyof KeyboardEventMap): void {
    this.handlers.delete(key)
  }
  
  // 激活键盘导航
  activate(): void {
    this.isActive = true
    this.element.addEventListener('keydown', this.handleKeydown)
  }
  
  // 停用键盘导航
  deactivate(): void {
    this.isActive = false
    this.element.removeEventListener('keydown', this.handleKeydown)
  }
  
  // 键盘事件处理
  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.isActive) return
    
    const key = this.getKeyString(event)
    const handler = this.handlers.get(key)
    
    if (handler) {
      event.preventDefault()
      handler()
    }
  }
  
  // 获取键盘组合字符串
  private getKeyString(event: KeyboardEvent): string {
    const parts: string[] = []
    
    if (event.ctrlKey) parts.push('Ctrl')
    if (event.altKey) parts.push('Alt')
    if (event.shiftKey) parts.push('Shift')
    if (event.metaKey) parts.push('Meta')
    
    parts.push(event.key)
    
    return parts.join('+')
  }
  
  // 绑定事件
  private bindEvents(): void {
    // 默认绑定一些通用的键盘事件
    this.element.addEventListener('focus', () => {
      this.activate()
    })
    
    this.element.addEventListener('blur', () => {
      this.deactivate()
    })
  }
  
  // 销毁
  destroy(): void {
    this.deactivate()
    this.handlers.clear()
  }
}
```

### 2. 焦点管理系统

#### 2.1 焦点管理器

```typescript
// utils/focus-manager.ts
export interface FocusableElement extends HTMLElement {
  focus(options?: FocusOptions): void
  blur(): void
}

export interface FocusManagerOptions {
  container?: HTMLElement
  autoRestore?: boolean
  trapFocus?: boolean
  initialFocus?: HTMLElement | string
  fallbackFocus?: HTMLElement | string
}

export class FocusManager {
  private container: HTMLElement
  private options: FocusManagerOptions
  private previousActiveElement: Element | null = null
  private focusableElements: FocusableElement[] = []
  private currentIndex: number = -1
  private isTrapping: boolean = false
  
  constructor(container: HTMLElement, options: FocusManagerOptions = {}) {
    this.container = container
    this.options = {
      autoRestore: true,
      trapFocus: false,
      ...options
    }
    
    this.updateFocusableElements()
  }
  
  // 更新可聚焦元素列表
  updateFocusableElements(): void {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')
    
    this.focusableElements = Array.from(
      this.container.querySelectorAll(selector)
    ).filter(el => {
      return this.isVisible(el as HTMLElement) && !this.isDisabled(el as HTMLElement)
    }) as FocusableElement[]
  }
  
  // 检查元素是否可见
  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.offsetParent !== null
    )
  }
  
  // 检查元素是否被禁用
  private isDisabled(element: HTMLElement): boolean {
    return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
  }
  
  // 开始焦点管理
  start(): void {
    this.previousActiveElement = document.activeElement
    
    if (this.options.trapFocus) {
      this.trapFocus()
    }
    
    this.setInitialFocus()
  }
  
  // 停止焦点管理
  stop(): void {
    if (this.options.trapFocus) {
      this.untrapFocus()
    }
    
    if (this.options.autoRestore && this.previousActiveElement) {
      (this.previousActiveElement as HTMLElement).focus()
    }
  }
  
  // 设置初始焦点
  private setInitialFocus(): void {
    let initialElement: HTMLElement | null = null
    
    if (this.options.initialFocus) {
      if (typeof this.options.initialFocus === 'string') {
        initialElement = this.container.querySelector(this.options.initialFocus)
      } else {
        initialElement = this.options.initialFocus
      }
    }
    
    if (!initialElement && this.focusableElements.length > 0) {
      initialElement = this.focusableElements[0]
    }
    
    if (initialElement) {
      initialElement.focus()
      this.currentIndex = this.focusableElements.indexOf(initialElement)
    }
  }
  
  // 陷阱焦点
  private trapFocus(): void {
    this.isTrapping = true
    document.addEventListener('keydown', this.handleTrapKeydown)
  }
  
  // 取消陷阱焦点
  private untrapFocus(): void {
    this.isTrapping = false
    document.removeEventListener('keydown', this.handleTrapKeydown)
  }
  
  // 处理陷阱键盘事件
  private handleTrapKeydown = (event: KeyboardEvent): void => {
    if (!this.isTrapping || event.key !== 'Tab') return
    
    this.updateFocusableElements()
    
    if (this.focusableElements.length === 0) {
      event.preventDefault()
      return
    }
    
    const firstElement = this.focusableElements[0]
    const lastElement = this.focusableElements[this.focusableElements.length - 1]
    
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
  
  // 聚焦到下一个元素
  focusNext(): boolean {
    this.updateFocusableElements()
    
    if (this.focusableElements.length === 0) return false
    
    this.currentIndex = (this.currentIndex + 1) % this.focusableElements.length
    this.focusableElements[this.currentIndex].focus()
    return true
  }
  
  // 聚焦到上一个元素
  focusPrevious(): boolean {
    this.updateFocusableElements()
    
    if (this.focusableElements.length === 0) return false
    
    this.currentIndex = this.currentIndex <= 0 
      ? this.focusableElements.length - 1 
      : this.currentIndex - 1
    this.focusableElements[this.currentIndex].focus()
    return true
  }
  
  // 聚焦到第一个元素
  focusFirst(): boolean {
    this.updateFocusableElements()
    
    if (this.focusableElements.length === 0) return false
    
    this.currentIndex = 0
    this.focusableElements[this.currentIndex].focus()
    return true
  }
  
  // 聚焦到最后一个元素
  focusLast(): boolean {
    this.updateFocusableElements()
    
    if (this.focusableElements.length === 0) return false
    
    this.currentIndex = this.focusableElements.length - 1
    this.focusableElements[this.currentIndex].focus()
    return true
  }
}
```

#### 2.2 键盘导航组件

```vue
<!-- KeyboardNavigationProvider.vue -->
<template>
  <div
    ref="containerRef"
    :class="containerClasses"
    :tabindex="containerTabindex"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <slot :focus-manager="focusManager" />
    
    <!-- 跳过链接 -->
    <a 
      v-if="showSkipLink"
      ref="skipLinkRef"
      :href="skipLinkTarget"
      class="skip-link"
      @click="handleSkipLink"
    >
      {{ skipLinkText }}
    </a>
    
    <!-- 键盘提示 -->
    <div 
      v-if="showKeyboardHints && isKeyboardUser"
      class="keyboard-hints"
      role="status"
      aria-live="polite"
    >
      <div class="keyboard-hint" v-for="hint in keyboardHints" :key="hint.key">
        <kbd>{{ hint.key }}</kbd> {{ hint.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide } from 'vue'
import { FocusManager, type FocusManagerOptions } from '@/utils/focus-manager'
import { KeyboardNavigationManager } from '@/utils/keyboard-navigation'

interface KeyboardHint {
  key: string
  description: string
}

interface Props {
  // 焦点管理选项
  trapFocus?: boolean
  autoRestore?: boolean
  initialFocus?: string
  
  // 键盘导航选项
  enableArrowKeys?: boolean
  enableHomeEnd?: boolean
  enablePageKeys?: boolean
  
  // 跳过链接
  showSkipLink?: boolean
  skipLinkText?: string
  skipLinkTarget?: string
  
  // 键盘提示
  showKeyboardHints?: boolean
  customHints?: KeyboardHint[]
  
  // 样式
  containerTabindex?: number
}

const props = withDefaults(defineProps<Props>(), {
  trapFocus: false,
  autoRestore: true,
  enableArrowKeys: true,
  enableHomeEnd: true,
  enablePageKeys: false,
  showSkipLink: false,
  skipLinkText: '跳到主要内容',
  skipLinkTarget: '#main-content',
  showKeyboardHints: false,
  containerTabindex: -1
})

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
  navigate: [direction: 'next' | 'previous' | 'first' | 'last']
}>()

// 响应式数据
const containerRef = ref<HTMLElement>()
const skipLinkRef = ref<HTMLAnchorElement>()
const focusManager = ref<FocusManager>()
const keyboardManager = ref<KeyboardNavigationManager>()
const isKeyboardUser = ref(false)
const isFocused = ref(false)

// 计算属性
const containerClasses = computed(() => ({
  'keyboard-navigation-container': true,
  'keyboard-navigation-container--focused': isFocused.value,
  'keyboard-navigation-container--keyboard-user': isKeyboardUser.value
}))

const keyboardHints = computed((): KeyboardHint[] => {
  const defaultHints: KeyboardHint[] = []
  
  if (props.enableArrowKeys) {
    defaultHints.push(
      { key: '↑↓', description: '上下导航' },
      { key: '←→', description: '左右导航' }
    )
  }
  
  if (props.enableHomeEnd) {
    defaultHints.push(
      { key: 'Home', description: '跳到开始' },
      { key: 'End', description: '跳到结束' }
    )
  }
  
  defaultHints.push(
    { key: 'Tab', description: '下一个元素' },
    { key: 'Shift+Tab', description: '上一个元素' },
    { key: 'Enter/Space', description: '激活' },
    { key: 'Esc', description: '取消/关闭' }
  )
  
  return [...defaultHints, ...(props.customHints || [])]
})

// 方法
const initializeManagers = () => {
  if (!containerRef.value) return
  
  // 初始化焦点管理器
  const focusOptions: FocusManagerOptions = {
    container: containerRef.value,
    trapFocus: props.trapFocus,
    autoRestore: props.autoRestore,
    initialFocus: props.initialFocus
  }
  
  focusManager.value = new FocusManager(containerRef.value, focusOptions)
  
  // 初始化键盘导航管理器
  keyboardManager.value = new KeyboardNavigationManager(containerRef.value)
  
  // 注册键盘事件
  registerKeyboardEvents()
}

const registerKeyboardEvents = () => {
  if (!keyboardManager.value || !focusManager.value) return
  
  const km = keyboardManager.value
  const fm = focusManager.value
  
  if (props.enableArrowKeys) {
    km.register('ArrowDown', () => {
      fm.focusNext()
      emit('navigate', 'next')
    })
    
    km.register('ArrowUp', () => {
      fm.focusPrevious()
      emit('navigate', 'previous')
    })
    
    km.register('ArrowRight', () => {
      fm.focusNext()
      emit('navigate', 'next')
    })
    
    km.register('ArrowLeft', () => {
      fm.focusPrevious()
      emit('navigate', 'previous')
    })
  }
  
  if (props.enableHomeEnd) {
    km.register('Home', () => {
      fm.focusFirst()
      emit('navigate', 'first')
    })
    
    km.register('End', () => {
      fm.focusLast()
      emit('navigate', 'last')
    })
  }
  
  if (props.enablePageKeys) {
    km.register('PageDown', () => {
      // 实现分页导航逻辑
      for (let i = 0; i < 5; i++) {
        if (!fm.focusNext()) break
      }
      emit('navigate', 'next')
    })
    
    km.register('PageUp', () => {
      // 实现分页导航逻辑
      for (let i = 0; i < 5; i++) {
        if (!fm.focusPrevious()) break
      }
      emit('navigate', 'previous')
    })
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // 检测键盘用户
  isKeyboardUser.value = true
  
  emit('keydown', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  
  if (focusManager.value) {
    focusManager.value.start()
  }
  
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  // 检查焦点是否仍在容器内
  const relatedTarget = event.relatedTarget as HTMLElement
  if (!containerRef.value?.contains(relatedTarget)) {
    isFocused.value = false
    
    if (focusManager.value) {
      focusManager.value.stop()
    }
  }
  
  emit('blur', event)
}

const handleSkipLink = (event: Event) => {
  event.preventDefault()
  const target = document.querySelector(props.skipLinkTarget)
  if (target) {
    (target as HTMLElement).focus()
  }
}

// 检测鼠标用户
const handleMouseMove = () => {
  isKeyboardUser.value = false
}

// 生命周期
onMounted(() => {
  initializeManagers()
  
  // 监听鼠标移动以检测鼠标用户
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (focusManager.value) {
    focusManager.value.stop()
  }
  
  if (keyboardManager.value) {
    keyboardManager.value.destroy()
  }
  
  document.removeEventListener('mousemove', handleMouseMove)
})

// 提供给子组件
provide('keyboardNavigation', {
  focusManager,
  keyboardManager,
  isKeyboardUser
})
</script>

<style scoped>
.keyboard-navigation-container {
  position: relative;
  outline: none;
}

.keyboard-navigation-container--focused {
  /* 容器获得焦点时的样式 */
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

.keyboard-hints {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 1000;
  max-width: 200px;
}

.keyboard-hint {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.keyboard-hint:last-child {
  margin-bottom: 0;
}

kbd {
  background: #333;
  border: 1px solid #555;
  border-radius: 3px;
  padding: 2px 4px;
  margin-right: 8px;
  font-family: monospace;
  font-size: 10px;
  min-width: 20px;
  text-align: center;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .keyboard-navigation-container--focused {
    outline: 3px solid;
  }
  
  .keyboard-hints {
    background: black;
    border: 2px solid white;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
}
</style>
```

### 3. 屏幕阅读器支持

#### 3.1 屏幕阅读器工具类

```typescript
// utils/screen-reader.ts
export interface ScreenReaderAnnouncement {
  message: string
  priority: 'polite' | 'assertive'
  delay?: number
}

export class ScreenReaderManager {
  private static instance: ScreenReaderManager
  private announceContainer: HTMLElement
  private politeRegion: HTMLElement
  private assertiveRegion: HTMLElement
  
  private constructor() {
    this.createAnnounceRegions()
  }
  
  static getInstance(): ScreenReaderManager {
    if (!ScreenReaderManager.instance) {
      ScreenReaderManager.instance = new ScreenReaderManager()
    }
    return ScreenReaderManager.instance
  }
  
  // 创建公告区域
  private createAnnounceRegions(): void {
    // 创建容器
    this.announceContainer = document.createElement('div')
    this.announceContainer.className = 'sr-announce-container'
    this.announceContainer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `
    
    // 创建 polite 区域
    this.politeRegion = document.createElement('div')
    this.politeRegion.setAttribute('aria-live', 'polite')
    this.politeRegion.setAttribute('aria-atomic', 'true')
    this.politeRegion.className = 'sr-polite-region'
    
    // 创建 assertive 区域
    this.assertiveRegion = document.createElement('div')
    this.assertiveRegion.setAttribute('aria-live', 'assertive')
    this.assertiveRegion.setAttribute('aria-atomic', 'true')
    this.assertiveRegion.className = 'sr-assertive-region'
    
    this.announceContainer.appendChild(this.politeRegion)
    this.announceContainer.appendChild(this.assertiveRegion)
    
    document.body.appendChild(this.announceContainer)
  }
  
  // 公告消息
  announce(announcement: ScreenReaderAnnouncement): void {
    const { message, priority, delay = 0 } = announcement
    
    setTimeout(() => {
      const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion
      
      // 清空区域
      region.textContent = ''
      
      // 稍后设置消息（确保屏幕阅读器能检测到变化）
      setTimeout(() => {
        region.textContent = message
      }, 10)
      
      // 清空消息（避免重复读取）
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }, delay)
  }
  
  // 公告状态变化
  announceStateChange(element: HTMLElement, state: string, value: any): void {
    const elementName = this.getElementName(element)
    const message = `${elementName} ${state} ${value}`
    
    this.announce({
      message,
      priority: 'polite'
    })
  }
  
  // 公告导航变化
  announceNavigation(from: string, to: string, total?: number, current?: number): void {
    let message = `从 ${from} 导航到 ${to}`
    
    if (total && current) {
      message += `，第 ${current} 项，共 ${total} 项`
    }
    
    this.announce({
      message,
      priority: 'polite'
    })
  }
  
  // 公告错误信息
  announceError(error: string): void {
    this.announce({
      message: `错误：${error}`,
      priority: 'assertive'
    })
  }
  
  // 公告成功信息
  announceSuccess(message: string): void {
    this.announce({
      message: `成功：${message}`,
      priority: 'polite'
    })
  }
  
  // 获取元素名称
  private getElementName(element: HTMLElement): string {
    // 优先级：aria-label > aria-labelledby > title > textContent
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel
    
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy)
      if (labelElement) return labelElement.textContent || ''
    }
    
    const title = element.getAttribute('title')
    if (title) return title
    
    return element.textContent || element.tagName.toLowerCase()
  }
  
  // 销毁
  destroy(): void {
    if (this.announceContainer && this.announceContainer.parentNode) {
      this.announceContainer.parentNode.removeChild(this.announceContainer)
    }
  }
}

// 屏幕阅读器组合函数
export function useScreenReader() {
  const screenReader = ScreenReaderManager.getInstance()
  
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReader.announce({ message, priority })
  }
  
  const announceStateChange = (element: HTMLElement, state: string, value: any) => {
    screenReader.announceStateChange(element, state, value)
  }
  
  const announceNavigation = (from: string, to: string, total?: number, current?: number) => {
    screenReader.announceNavigation(from, to, total, current)
  }
  
  const announceError = (error: string) => {
    screenReader.announceError(error)
  }
  
  const announceSuccess = (message: string) => {
    screenReader.announceSuccess(message)
  }
  
  return {
    announce,
    announceStateChange,
    announceNavigation,
    announceError,
    announceSuccess
  }
}
```

#### 3.2 屏幕阅读器友好的数据表格

```vue
<!-- AccessibleTable.vue -->
<template>
  <div class="accessible-table-container">
    <!-- 表格标题和描述 -->
    <div v-if="caption || description" class="table-header">
      <h3 v-if="caption" :id="captionId" class="table-caption">
        {{ caption }}
      </h3>
      <p v-if="description" :id="descriptionId" class="table-description">
        {{ description }}
      </p>
    </div>
    
    <!-- 表格控制 -->
    <div v-if="showControls" class="table-controls">
      <div class="table-info" role="status" aria-live="polite">
        显示第 {{ startIndex + 1 }} - {{ endIndex }} 项，共 {{ totalItems }} 项
      </div>
      
      <div class="table-actions">
        <el-button
          size="small"
          @click="selectAll"
          :aria-label="allSelected ? '取消全选' : '全选'"
        >
          {{ allSelected ? '取消全选' : '全选' }}
        </el-button>
        
        <el-button
          size="small"
          @click="exportData"
          aria-label="导出表格数据"
        >
          导出
        </el-button>
      </div>
    </div>
    
    <!-- 表格 -->
    <table
      :id="tableId"
      class="accessible-table"
      role="table"
      :aria-labelledby="captionId"
      :aria-describedby="descriptionId"
      :aria-rowcount="totalItems"
      :aria-colcount="columns.length"
    >
      <!-- 表头 -->
      <thead>
        <tr role="row">
          <th
            v-if="selectable"
            scope="col"
            class="selection-column"
            :aria-label="'选择列'"
          >
            <el-checkbox
              v-model="allSelected"
              :indeterminate="someSelected"
              @change="handleSelectAll"
              :aria-label="allSelected ? '取消全选' : '全选所有行'"
            />
          </th>
          
          <th
            v-for="(column, index) in columns"
            :key="column.key"
            scope="col"
            :class="getColumnClasses(column)"
            :aria-sort="getSortDirection(column.key)"
            :tabindex="column.sortable ? 0 : -1"
            @click="column.sortable && handleSort(column.key)"
            @keydown="handleHeaderKeydown($event, column)"
          >
            <div class="column-header">
              <span class="column-title">{{ column.title }}</span>
              <el-icon v-if="column.sortable" class="sort-icon">
                <ArrowUp v-if="sortKey === column.key && sortOrder === 'asc'" />
                <ArrowDown v-else-if="sortKey === column.key && sortOrder === 'desc'" />
                <Sort v-else />
              </el-icon>
            </div>
            
            <!-- 列描述（屏幕阅读器） -->
            <span v-if="column.description" class="sr-only">
              {{ column.description }}
            </span>
          </th>
        </tr>
      </thead>
      
      <!-- 表体 -->
      <tbody>
        <tr
          v-for="(row, rowIndex) in paginatedData"
          :key="getRowKey(row, rowIndex)"
          role="row"
          :class="getRowClasses(row, rowIndex)"
          :aria-rowindex="startIndex + rowIndex + 1"
          :aria-selected="isRowSelected(row)"
          @click="handleRowClick(row, rowIndex)"
          @keydown="handleRowKeydown($event, row, rowIndex)"
          :tabindex="rowIndex === focusedRowIndex ? 0 : -1"
        >
          <td v-if="selectable" class="selection-cell">
            <el-checkbox
              :model-value="isRowSelected(row)"
              @change="handleRowSelect(row, $event)"
              :aria-label="`选择第 ${startIndex + rowIndex + 1} 行`"
            />
          </td>
          
          <td
            v-for="(column, colIndex) in columns"
            :key="column.key"
            :class="getCellClasses(column, row)"
            :aria-describedby="getCellDescribedBy(column, row)"
            role="gridcell"
            :tabindex="getCellTabindex(rowIndex, colIndex)"
            @focus="handleCellFocus(rowIndex, colIndex)"
          >
            <slot
              :name="column.key"
              :row="row"
              :column="column"
              :value="row[column.key]"
              :row-index="rowIndex"
              :col-index="colIndex"
            >
              {{ formatCellValue(row[column.key], column) }}
            </slot>
          </td>
        </tr>
        
        <!-- 空状态 -->
        <tr v-if="paginatedData.length === 0" class="empty-row">
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="empty-cell">
            <div class="empty-content">
              <p>暂无数据</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- 分页 -->
    <div v-if="showPagination" class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalItems"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ArrowUp, ArrowDown, Sort } from '@element-plus/icons-vue'
import { useScreenReader } from '@/utils/screen-reader'
import { AriaUtils } from '@/utils/aria'

interface TableColumn {
  key: string
  title: string
  description?: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
}

interface Props {
  data: any[]
  columns: TableColumn[]
  caption?: string
  description?: string
  selectable?: boolean
  showControls?: boolean
  showPagination?: boolean
  pageSize?: number
  rowKey?: string | ((row: any) => string)
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  showControls: true,
  showPagination: true,
  pageSize: 20,
  rowKey: 'id'
})

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'selection-change': [selectedRows: any[]]
  'sort-change': [key: string, order: 'asc' | 'desc' | null]
}>()

// 屏幕阅读器
const { announce, announceStateChange } = useScreenReader()

// 响应式数据
const tableId = ref(AriaUtils.generateId('table'))
const captionId = ref(AriaUtils.generateId('caption'))
const descriptionId = ref(AriaUtils.generateId('desc'))

const currentPage = ref(1)
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)
const selectedRows = ref<any[]>([])
const focusedRowIndex = ref(0)
const focusedColIndex = ref(0)

// 计算属性
const totalItems = computed(() => props.data.length)

const startIndex = computed(() => (currentPage.value - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, totalItems.value))

const sortedData = computed(() => {
  if (!sortKey.value || !sortOrder.value) {
    return props.data
  }
  
  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedData = computed(() => {
  return sortedData.value.slice(startIndex.value, endIndex.value)
})

const allSelected = computed({
  get: () => selectedRows.value.length === props.data.length && props.data.length > 0,
  set: (value: boolean) => {
    if (value) {
      selectedRows.value = [...props.data]
    } else {
      selectedRows.value = []
    }
  }
})

const someSelected = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length
})

// 方法
const getRowKey = (row: any, index: number): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] || index.toString()
}

const isRowSelected = (row: any): boolean => {
  return selectedRows.value.some(selected => 
    getRowKey(selected, 0) === getRowKey(row, 0)
  )
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? null : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  if (sortOrder.value === null) {
    sortKey.value = null
  }
  
  emit('sort-change', key, sortOrder.value)
  
  // 公告排序变化
  const column = props.columns.find(col => col.key === key)
  if (column) {
    const orderText = sortOrder.value === 'asc' ? '升序' : sortOrder.value === 'desc' ? '降序' : '取消排序'
    announce(`${column.title} 列已按 ${orderText} 排序`)
  }
}

const getSortDirection = (key: string): string | undefined => {
  if (sortKey.value !== key) return 'none'
  return sortOrder.value || 'none'
}

const handleSelectAll = (value: boolean) => {
  allSelected.value = value
  emit('selection-change', selectedRows.value)
  
  announce(value ? '已选择所有行' : '已取消选择所有行')
}

const handleRowSelect = (row: any, selected: boolean) => {
  if (selected) {
    selectedRows.value.push(row)
  } else {
    const index = selectedRows.value.findIndex(selected => 
      getRowKey(selected, 0) === getRowKey(row, 0)
    )
    if (index > -1) {
      selectedRows.value.splice(index, 1)
    }
  }
  
  emit('selection-change', selectedRows.value)
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  announce(`已跳转到第 ${page} 页`)
}

const handleSizeChange = (size: number) => {
  props.pageSize = size
  currentPage.value = 1
  announce(`每页显示 ${size} 项`)
}

// 键盘导航
const handleHeaderKeydown = (event: KeyboardEvent, column: TableColumn) => {
  if ((event.key === 'Enter' || event.key === ' ') && column.sortable) {
    event.preventDefault()
    handleSort(column.key)
  }
}

const handleRowKeydown = (event: KeyboardEvent, row: any, rowIndex: number) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleRowClick(row, rowIndex)
      break
      
    case 'ArrowDown':
      event.preventDefault()
      if (rowIndex < paginatedData.value.length - 1) {
        focusedRowIndex.value = rowIndex + 1
        nextTick(() => {
          const nextRow = document.querySelector(`[aria-rowindex="${startIndex.value + rowIndex + 2}"]`) as HTMLElement
          nextRow?.focus()
        })
      }
      break
      
    case 'ArrowUp':
      event.preventDefault()
      if (rowIndex > 0) {
        focusedRowIndex.value = rowIndex - 1
        nextTick(() => {
          const prevRow = document.querySelector(`[aria-rowindex="${startIndex.value + rowIndex}"]`) as HTMLElement
          prevRow?.focus()
        })
      }
      break
  }
}

// 其他方法省略...
</script>

<style scoped>
/* 样式省略... */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
```

## 实践练习

### 练习 1：创建无障碍下拉菜单

开发一个完全支持键盘导航和屏幕阅读器的下拉菜单：
1. 完整的键盘导航支持
2. 焦点管理和陷阱
3. 屏幕阅读器公告

### 练习 2：实现无障碍标签页组件

构建一个符合 ARIA 规范的标签页组件：
1. 标签页键盘导航
2. 内容面板焦点管理
3. 状态变化公告

### 练习 3：开发无障碍树形组件

设计一个支持完整键盘操作的树形组件：
1. 树节点导航
2. 展开/折叠操作
3. 多选支持

## 学习资源

* [ARIA 键盘导航指南](https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard)
* [屏幕阅读器测试指南](https://webaim.org/articles/screenreader_testing/)
* [NVDA 屏幕阅读器](https://www.nvaccess.org/)
* [JAWS 屏幕阅读器](https://www.freedomscientific.com/products/software/jaws/)

## 作业

1. 完成所有实践练习
2. 使用多种屏幕阅读器测试你的组件
3. 进行完整的键盘导航测试
4. 编写无障碍测试自动化脚本

## 下一步学习计划

接下来我们将学习 **Element Plus 国际化与无障碍综合实践**，将前面学到的国际化和无障碍知识进行综合应用，构建一个完整的多语言无障碍应用。