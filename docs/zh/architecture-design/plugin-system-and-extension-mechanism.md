# 第37天：Element Plus 插件系统与扩展机制

## 学习目标
- 深入理解 Element Plus 的插件系统架构
- 掌握自定义插件的开发方法
- 学习组件扩展和增强技术
- 实践插件开发和集成

## 学习内容

### 1. Element Plus 插件系统概述

#### 1.1 插件系统架构
```typescript
// Element Plus 插件系统基础结构
import type { App, Plugin } from 'vue'

// 插件接口定义
interface ElementPlusPlugin {
  install(app: App, options?: any): void
  version?: string
  name?: string
}

// 基础插件类
abstract class BasePlugin implements ElementPlusPlugin {
  abstract name: string
  abstract version: string
  
  abstract install(app: App, options?: any): void
  
  // 插件验证
  protected validateOptions(options: any): boolean {
    return true
  }
  
  // 插件初始化
  protected initialize(app: App, options: any): void {
    console.log(`Plugin ${this.name} v${this.version} initialized`)
  }
  
  // 插件清理
  protected cleanup(): void {
    console.log(`Plugin ${this.name} cleaned up`)
  }
}
```

#### 1.2 Element Plus 核心插件结构
```typescript
// Element Plus 组件注册插件
import { App } from 'vue'
import * as components from './components'
import * as directives from './directives'

interface InstallOptions {
  size?: 'large' | 'default' | 'small'
  zIndex?: number
  locale?: any
  namespace?: string
}

const ElementPlusPlugin: Plugin = {
  install(app: App, options: InstallOptions = {}) {
    // 设置全局配置
    const globalConfig = {
      size: options.size || 'default',
      zIndex: options.zIndex || 2000,
      namespace: options.namespace || 'el'
    }
    
    app.config.globalProperties.$ELEMENT = globalConfig
    
    // 注册所有组件
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
    
    // 注册所有指令
    Object.entries(directives).forEach(([name, directive]) => {
      app.directive(name, directive)
    })
    
    // 提供全局配置
    app.provide('ELEMENT_CONFIG', globalConfig)
  }
}

export default ElementPlusPlugin
```

### 2. 自定义插件开发

#### 2.1 简单功能插件
```typescript
// 消息通知插件
import { App, createApp, h } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

interface NotificationOptions {
  title?: string
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

class NotificationManager {
  private defaultOptions: Partial<NotificationOptions> = {
    duration: 4500,
    position: 'top-right'
  }
  
  // 显示消息
  message(message: string, type: NotificationOptions['type'] = 'info') {
    ElMessage({
      message,
      type,
      duration: this.defaultOptions.duration
    })
  }
  
  // 显示通知
  notify(options: NotificationOptions) {
    ElNotification({
      ...this.defaultOptions,
      ...options
    })
  }
  
  // 成功消息
  success(message: string, title?: string) {
    if (title) {
      this.notify({ title, message, type: 'success' })
    } else {
      this.message(message, 'success')
    }
  }
  
  // 错误消息
  error(message: string, title?: string) {
    if (title) {
      this.notify({ title, message, type: 'error' })
    } else {
      this.message(message, 'error')
    }
  }
  
  // 警告消息
  warning(message: string, title?: string) {
    if (title) {
      this.notify({ title, message, type: 'warning' })
    } else {
      this.message(message, 'warning')
    }
  }
  
  // 信息消息
  info(message: string, title?: string) {
    if (title) {
      this.notify({ title, message, type: 'info' })
    } else {
      this.message(message, 'info')
    }
  }
}

// 通知插件
const NotificationPlugin: Plugin = {
  install(app: App, options: Partial<NotificationOptions> = {}) {
    const notificationManager = new NotificationManager()
    
    // 设置默认选项
    Object.assign(notificationManager['defaultOptions'], options)
    
    // 全局属性
    app.config.globalProperties.$notify = notificationManager
    
    // 提供注入
    app.provide('notification', notificationManager)
  }
}

export default NotificationPlugin
```

#### 2.2 复杂组件插件
```typescript
// 数据表格增强插件
import { App, Plugin, defineComponent, ref, computed } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElInput, ElSelect } from 'element-plus'

// 增强表格组件
const EnhancedTable = defineComponent({
  name: 'EnhancedTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    searchable: {
      type: Boolean,
      default: false
    },
    sortable: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: [Boolean, Object],
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selection-change', 'sort-change', 'page-change', 'search'],
  setup(props, { emit, slots }) {
    const searchText = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const sortConfig = ref({ prop: '', order: '' })
    
    // 过滤数据
    const filteredData = computed(() => {
      let data = [...props.data]
      
      // 搜索过滤
      if (props.searchable && searchText.value) {
        const search = searchText.value.toLowerCase()
        data = data.filter(item => {
          return Object.values(item).some(value => 
            String(value).toLowerCase().includes(search)
          )
        })
      }
      
      // 排序
      if (props.sortable && sortConfig.value.prop) {
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
      if (!props.pagination) return filteredData.value
      
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredData.value.slice(start, end)
    })
    
    // 总数
    const total = computed(() => filteredData.value.length)
    
    // 搜索处理
    const handleSearch = () => {
      currentPage.value = 1
      emit('search', searchText.value)
    }
    
    // 排序处理
    const handleSortChange = ({ prop, order }) => {
      sortConfig.value = { prop, order }
      emit('sort-change', { prop, order })
    }
    
    // 分页处理
    const handlePageChange = (page: number) => {
      currentPage.value = page
      emit('page-change', { page, pageSize: pageSize.value })
    }
    
    // 选择处理
    const handleSelectionChange = (selection: any[]) => {
      emit('selection-change', selection)
    }
    
    return () => {
      const tableSlots = {
        default: () => props.columns.map(column => 
          h(ElTableColumn, {
            key: column.prop,
            ...column
          }, slots[column.prop] ? { default: slots[column.prop] } : undefined)
        )
      }
      
      return h('div', { class: 'enhanced-table' }, [
        // 搜索栏
        props.searchable && h('div', { class: 'table-search' }, [
          h(ElInput, {
            modelValue: searchText.value,
            'onUpdate:modelValue': (value: string) => searchText.value = value,
            placeholder: '搜索...',
            clearable: true,
            onClear: handleSearch,
            onKeyup: (e: KeyboardEvent) => {
              if (e.key === 'Enter') handleSearch()
            }
          })
        ]),
        
        // 表格
        h(ElTable, {
          data: paginatedData.value,
          loading: props.loading,
          onSelectionChange: handleSelectionChange,
          onSortChange: handleSortChange
        }, tableSlots),
        
        // 分页
        props.pagination && h(ElPagination, {
          currentPage: currentPage.value,
          pageSize: pageSize.value,
          total: total.value,
          layout: 'total, sizes, prev, pager, next, jumper',
          onCurrentChange: handlePageChange,
          onSizeChange: (size: number) => {
            pageSize.value = size
            currentPage.value = 1
            emit('page-change', { page: 1, pageSize: size })
          }
        })
      ])
    }
  }
})

// 表格增强插件
const EnhancedTablePlugin: Plugin = {
  install(app: App) {
    app.component('EnhancedTable', EnhancedTable)
  }
}

export default EnhancedTablePlugin
```

### 3. 指令插件开发

#### 3.1 自定义指令插件
```typescript
// 自定义指令集合插件
import { App, Directive } from 'vue'

// 点击外部指令
const clickOutside: Directive = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}

// 长按指令
const longPress: Directive = {
  mounted(el, binding) {
    let timer: number | null = null
    const duration = binding.arg ? parseInt(binding.arg) : 1000
    
    const start = () => {
      timer = setTimeout(() => {
        binding.value()
      }, duration)
    }
    
    const cancel = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    
    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', cancel)
    el.addEventListener('mouseleave', cancel)
    el.addEventListener('touchstart', start)
    el.addEventListener('touchend', cancel)
    
    el._longPressCleanup = () => {
      el.removeEventListener('mousedown', start)
      el.removeEventListener('mouseup', cancel)
      el.removeEventListener('mouseleave', cancel)
      el.removeEventListener('touchstart', start)
      el.removeEventListener('touchend', cancel)
      cancel()
    }
  },
  unmounted(el) {
    el._longPressCleanup?.()
  }
}

// 懒加载指令
const lazyLoad: Directive = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = binding.value
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })
    
    el.classList.add('lazy')
    observer.observe(el)
    el._lazyObserver = observer
  },
  unmounted(el) {
    el._lazyObserver?.disconnect()
  }
}

// 防抖指令
const debounce: Directive = {
  mounted(el, binding) {
    let timer: number | null = null
    const delay = binding.arg ? parseInt(binding.arg) : 300
    
    const handler = (event: Event) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        binding.value(event)
      }, delay)
    }
    
    el.addEventListener('input', handler)
    el._debounceHandler = handler
  },
  unmounted(el) {
    el.removeEventListener('input', el._debounceHandler)
  }
}

// 权限指令
const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const permissions = getUserPermissions() // 获取用户权限的函数
    
    if (!hasPermission(permissions, value)) {
      el.style.display = 'none'
    }
  },
  updated(el, binding) {
    const { value } = binding
    const permissions = getUserPermissions()
    
    if (!hasPermission(permissions, value)) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  }
}

// 辅助函数
function getUserPermissions(): string[] {
  // 实际项目中从状态管理或 API 获取
  return ['read', 'write', 'delete']
}

function hasPermission(userPermissions: string[], required: string | string[]): boolean {
  if (Array.isArray(required)) {
    return required.some(perm => userPermissions.includes(perm))
  }
  return userPermissions.includes(required)
}

// 指令插件
const DirectivesPlugin: Plugin = {
  install(app: App) {
    app.directive('click-outside', clickOutside)
    app.directive('long-press', longPress)
    app.directive('lazy-load', lazyLoad)
    app.directive('debounce', debounce)
    app.directive('permission', permission)
  }
}

export default DirectivesPlugin
```

### 4. 主题插件开发

#### 4.1 动态主题插件
```typescript
// 动态主题管理插件
import { App, ref, reactive, watch } from 'vue'

interface ThemeConfig {
  primaryColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  infoColor: string
  textColor: string
  backgroundColor: string
  borderColor: string
}

interface ThemeOptions {
  themes: Record<string, ThemeConfig>
  defaultTheme: string
  storage: boolean
}

class ThemeManager {
  private themes: Record<string, ThemeConfig>
  private currentTheme = ref('')
  private storage: boolean
  
  constructor(options: ThemeOptions) {
    this.themes = options.themes
    this.storage = options.storage
    
    // 从存储中恢复主题
    if (this.storage) {
      const saved = localStorage.getItem('element-plus-theme')
      this.currentTheme.value = saved || options.defaultTheme
    } else {
      this.currentTheme.value = options.defaultTheme
    }
    
    // 监听主题变化
    watch(this.currentTheme, (newTheme) => {
      this.applyTheme(newTheme)
      if (this.storage) {
        localStorage.setItem('element-plus-theme', newTheme)
      }
    }, { immediate: true })
  }
  
  // 应用主题
  private applyTheme(themeName: string) {
    const theme = this.themes[themeName]
    if (!theme) {
      console.warn(`Theme ${themeName} not found`)
      return
    }
    
    const root = document.documentElement
    
    // 设置 CSS 变量
    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = `--el-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
      root.style.setProperty(cssVar, value)
    })
    
    // 设置主题类名
    root.setAttribute('data-theme', themeName)
  }
  
  // 切换主题
  setTheme(themeName: string) {
    if (this.themes[themeName]) {
      this.currentTheme.value = themeName
    }
  }
  
  // 获取当前主题
  getCurrentTheme() {
    return this.currentTheme.value
  }
  
  // 获取所有主题
  getThemes() {
    return Object.keys(this.themes)
  }
  
  // 添加主题
  addTheme(name: string, config: ThemeConfig) {
    this.themes[name] = config
  }
  
  // 更新主题配置
  updateTheme(name: string, config: Partial<ThemeConfig>) {
    if (this.themes[name]) {
      Object.assign(this.themes[name], config)
      if (this.currentTheme.value === name) {
        this.applyTheme(name)
      }
    }
  }
  
  // 切换暗黑模式
  toggleDarkMode() {
    const isDark = this.currentTheme.value.includes('dark')
    const newTheme = isDark 
      ? this.currentTheme.value.replace('-dark', '') 
      : `${this.currentTheme.value}-dark`
    
    if (this.themes[newTheme]) {
      this.setTheme(newTheme)
    }
  }
}

// 预定义主题
const defaultThemes: Record<string, ThemeConfig> = {
  default: {
    primaryColor: '#409eff',
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',
    textColor: '#303133',
    backgroundColor: '#ffffff',
    borderColor: '#dcdfe6'
  },
  'default-dark': {
    primaryColor: '#409eff',
    successColor: '#67c23a',
    warningColor: '#e6a23c',
    dangerColor: '#f56c6c',
    infoColor: '#909399',
    textColor: '#e5eaf3',
    backgroundColor: '#141414',
    borderColor: '#4c4d4f'
  },
  blue: {
    primaryColor: '#1890ff',
    successColor: '#52c41a',
    warningColor: '#faad14',
    dangerColor: '#ff4d4f',
    infoColor: '#909399',
    textColor: '#303133',
    backgroundColor: '#ffffff',
    borderColor: '#d9d9d9'
  }
}

// 主题插件
const ThemePlugin: Plugin = {
  install(app: App, options: Partial<ThemeOptions> = {}) {
    const config: ThemeOptions = {
      themes: defaultThemes,
      defaultTheme: 'default',
      storage: true,
      ...options
    }
    
    const themeManager = new ThemeManager(config)
    
    // 全局属性
    app.config.globalProperties.$theme = themeManager
    
    // 提供注入
    app.provide('theme', themeManager)
  }
}

export default ThemePlugin
```

### 5. 国际化插件扩展

#### 5.1 增强国际化插件
```typescript
// 增强国际化插件
import { App, ref, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'

interface I18nConfig {
  locale: string
  fallbackLocale: string
  messages: Record<string, Record<string, any>>
  dateTimeFormats?: Record<string, any>
  numberFormats?: Record<string, any>
}

class I18nManager {
  private config: I18nConfig
  private currentLocale = ref('')
  
  constructor(config: I18nConfig) {
    this.config = config
    this.currentLocale.value = config.locale
  }
  
  // 翻译函数
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.')
    let message = this.config.messages[this.currentLocale.value]
    
    // 查找翻译
    for (const k of keys) {
      if (message && typeof message === 'object') {
        message = message[k]
      } else {
        message = undefined
        break
      }
    }
    
    // 回退到默认语言
    if (message === undefined) {
      message = this.config.messages[this.config.fallbackLocale]
      for (const k of keys) {
        if (message && typeof message === 'object') {
          message = message[k]
        } else {
          message = key // 最终回退到 key
          break
        }
      }
    }
    
    // 参数替换
    if (typeof message === 'string' && params) {
      return message.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? String(params[param]) : match
      })
    }
    
    return typeof message === 'string' ? message : key
  }
  
  // 设置语言
  setLocale(locale: string) {
    if (this.config.messages[locale]) {
      this.currentLocale.value = locale
    }
  }
  
  // 获取当前语言
  getLocale() {
    return this.currentLocale.value
  }
  
  // 获取可用语言
  getAvailableLocales() {
    return Object.keys(this.config.messages)
  }
  
  // 添加翻译
  addMessages(locale: string, messages: Record<string, any>) {
    if (!this.config.messages[locale]) {
      this.config.messages[locale] = {}
    }
    Object.assign(this.config.messages[locale], messages)
  }
  
  // 格式化日期
  formatDate(date: Date, format?: string): string {
    const locale = this.currentLocale.value
    const formats = this.config.dateTimeFormats?.[locale]
    
    if (formats && format && formats[format]) {
      return new Intl.DateTimeFormat(locale, formats[format]).format(date)
    }
    
    return new Intl.DateTimeFormat(locale).format(date)
  }
  
  // 格式化数字
  formatNumber(number: number, format?: string): string {
    const locale = this.currentLocale.value
    const formats = this.config.numberFormats?.[locale]
    
    if (formats && format && formats[format]) {
      return new Intl.NumberFormat(locale, formats[format]).format(number)
    }
    
    return new Intl.NumberFormat(locale).format(number)
  }
}

// 默认翻译
const defaultMessages = {
  'zh-cn': {
    common: {
      confirm: '确认',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      add: '添加',
      search: '搜索',
      reset: '重置',
      submit: '提交',
      loading: '加载中...',
      noData: '暂无数据'
    },
    form: {
      required: '此项为必填项',
      email: '请输入正确的邮箱地址',
      phone: '请输入正确的手机号码',
      minLength: '长度不能少于{min}个字符',
      maxLength: '长度不能超过{max}个字符'
    }
  },
  'en': {
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      reset: 'Reset',
      submit: 'Submit',
      loading: 'Loading...',
      noData: 'No Data'
    },
    form: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      minLength: 'Length cannot be less than {min} characters',
      maxLength: 'Length cannot exceed {max} characters'
    }
  }
}

// 国际化插件
const I18nPlugin: Plugin = {
  install(app: App, options: Partial<I18nConfig> = {}) {
    const config: I18nConfig = {
      locale: 'zh-cn',
      fallbackLocale: 'en',
      messages: defaultMessages,
      ...options
    }
    
    const i18nManager = new I18nManager(config)
    
    // 全局属性
    app.config.globalProperties.$t = i18nManager.t.bind(i18nManager)
    app.config.globalProperties.$i18n = i18nManager
    
    // 提供注入
    app.provide('i18n', i18nManager)
  }
}

export default I18nPlugin
```

### 6. 插件集成与使用

#### 6.1 插件集成示例
```typescript
// main.ts - 插件集成
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 自定义插件
import NotificationPlugin from './plugins/notification'
import EnhancedTablePlugin from './plugins/enhanced-table'
import DirectivesPlugin from './plugins/directives'
import ThemePlugin from './plugins/theme'
import I18nPlugin from './plugins/i18n'

import App from './App.vue'

const app = createApp(App)

// Element Plus
app.use(ElementPlus)

// 自定义插件
app.use(NotificationPlugin, {
  duration: 3000,
  position: 'top-right'
})

app.use(EnhancedTablePlugin)
app.use(DirectivesPlugin)

app.use(ThemePlugin, {
  defaultTheme: 'default',
  storage: true
})

app.use(I18nPlugin, {
  locale: 'zh-cn',
  fallbackLocale: 'en'
})

app.mount('#app')
```

#### 6.2 插件使用示例
```vue
<template>
  <div class="plugin-demo">
    <!-- 主题切换 -->
    <el-card title="主题管理">
      <el-select v-model="currentTheme" @change="handleThemeChange">
        <el-option 
          v-for="theme in availableThemes" 
          :key="theme"
          :label="theme"
          :value="theme"
        />
      </el-select>
      <el-button @click="toggleDarkMode">切换暗黑模式</el-button>
    </el-card>
    
    <!-- 语言切换 -->
    <el-card title="语言设置">
      <el-select v-model="currentLocale" @change="handleLocaleChange">
        <el-option 
          v-for="locale in availableLocales" 
          :key="locale"
          :label="locale"
          :value="locale"
        />
      </el-select>
    </el-card>
    
    <!-- 增强表格 -->
    <el-card title="增强表格">
      <enhanced-table
        :data="tableData"
        :columns="tableColumns"
        searchable
        sortable
        :pagination="true"
        @selection-change="handleSelectionChange"
      />
    </el-card>
    
    <!-- 自定义指令演示 -->
    <el-card title="自定义指令">
      <el-button 
        v-long-press:2000="handleLongPress"
        type="primary"
      >
        长按2秒
      </el-button>
      
      <div 
        v-click-outside="handleClickOutside"
        style="padding: 20px; border: 1px solid #ccc; margin: 10px 0;"
      >
        点击外部区域
      </div>
      
      <img 
        v-lazy-load="'https://via.placeholder.com/300x200'"
        alt="懒加载图片"
        style="width: 300px; height: 200px;"
      />
      
      <el-input 
        v-debounce:500="handleDebounceInput"
        placeholder="防抖输入"
      />
      
      <el-button v-permission="'admin'" type="danger">
        管理员按钮
      </el-button>
    </el-card>
    
    <!-- 通知演示 -->
    <el-card title="通知系统">
      <el-button @click="showSuccess">成功消息</el-button>
      <el-button @click="showError">错误消息</el-button>
      <el-button @click="showWarning">警告消息</el-button>
      <el-button @click="showInfo">信息消息</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

// 注入插件实例
const theme = inject('theme')
const i18n = inject('i18n')
const notification = inject('notification')

// 主题管理
const currentTheme = ref('')
const availableThemes = ref<string[]>([])

// 语言管理
const currentLocale = ref('')
const availableLocales = ref<string[]>([])

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' }
])

const tableColumns = ref([
  { prop: 'id', label: 'ID', sortable: true },
  { prop: 'name', label: '姓名', sortable: true },
  { prop: 'age', label: '年龄', sortable: true },
  { prop: 'email', label: '邮箱' }
])

// 主题切换
const handleThemeChange = (themeName: string) => {
  theme?.setTheme(themeName)
}

const toggleDarkMode = () => {
  theme?.toggleDarkMode()
  currentTheme.value = theme?.getCurrentTheme()
}

// 语言切换
const handleLocaleChange = (locale: string) => {
  i18n?.setLocale(locale)
}

// 表格事件
const handleSelectionChange = (selection: any[]) => {
  console.log('Selection changed:', selection)
}

// 指令事件
const handleLongPress = () => {
  notification?.success('长按触发!')
}

const handleClickOutside = () => {
  notification?.info('点击了外部区域')
}

const handleDebounceInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  console.log('Debounced input:', value)
}

// 通知演示
const showSuccess = () => {
  notification?.success('操作成功!', '成功')
}

const showError = () => {
  notification?.error('操作失败!', '错误')
}

const showWarning = () => {
  notification?.warning('请注意!', '警告')
}

const showInfo = () => {
  notification?.info('这是一条信息', '信息')
}

// 初始化
onMounted(() => {
  if (theme) {
    currentTheme.value = theme.getCurrentTheme()
    availableThemes.value = theme.getThemes()
  }
  
  if (i18n) {
    currentLocale.value = i18n.getLocale()
    availableLocales.value = i18n.getAvailableLocales()
  }
})
</script>
```

## 学习资源
- [Vue 3 插件开发](https://cn.vuejs.org/guide/reusability/plugins.html)
- [Element Plus 源码分析](https://github.com/element-plus/element-plus)
- [Vue 3 自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)

## 作业
1. 开发一个完整的表单验证插件
2. 创建一个数据可视化组件插件
3. 实现一个权限管理插件系统

## 下一步
明天我们将学习 Element Plus 的测试策略与质量保证。