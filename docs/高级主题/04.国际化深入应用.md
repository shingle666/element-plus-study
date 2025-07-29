# 第42天：Element Plus 国际化深入应用

## 学习目标

- 深入理解 Element Plus 国际化系统架构
- 掌握多语言配置和动态切换技术
- 学会创建自定义语言包和本地化策略
- 实现复杂场景下的国际化解决方案
- 优化国际化性能和用户体验

## 1. Element Plus 国际化系统深度解析

### 1.1 国际化架构设计
```typescript
// 国际化系统架构
interface I18nSystem {
  // 语言包管理
  localeManager: LocaleManager
  // 消息格式化
  messageFormatter: MessageFormatter
  // 日期时间格式化
  dateTimeFormatter: DateTimeFormatter
  // 数字格式化
  numberFormatter: NumberFormatter
  // 复数规则处理
  pluralRules: PluralRules
  // 语言检测
  languageDetector: LanguageDetector
}

// 语言包管理器
class LocaleManager {
  private locales: Map<string, LocaleData> = new Map()
  private currentLocale: string = 'zh-CN'
  private fallbackLocale: string = 'en'
  private observers: Set<LocaleObserver> = new Set()

  // 注册语言包
  registerLocale(locale: string, data: LocaleData): void {
    this.locales.set(locale, data)
    this.notifyObservers('localeRegistered', { locale, data })
  }

  // 设置当前语言
  setCurrentLocale(locale: string): void {
    if (this.locales.has(locale)) {
      const oldLocale = this.currentLocale
      this.currentLocale = locale
      this.notifyObservers('localeChanged', { oldLocale, newLocale: locale })
    } else {
      console.warn(`Locale ${locale} not found, falling back to ${this.fallbackLocale}`)
      this.setCurrentLocale(this.fallbackLocale)
    }
  }

  // 获取消息
  getMessage(key: string, params?: Record<string, any>): string {
    const locale = this.locales.get(this.currentLocale)
    if (!locale) {
      return this.getFallbackMessage(key, params)
    }

    const message = this.getNestedValue(locale.messages, key)
    if (message === undefined) {
      return this.getFallbackMessage(key, params)
    }

    return this.formatMessage(message, params)
  }

  // 获取嵌套值
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // 格式化消息
  private formatMessage(template: string, params?: Record<string, any>): string {
    if (!params) return template

    return template.replace(/\{([^}]+)\}/g, (match, key) => {
      const value = params[key]
      return value !== undefined ? String(value) : match
    })
  }

  // 获取回退消息
  private getFallbackMessage(key: string, params?: Record<string, any>): string {
    const fallbackLocale = this.locales.get(this.fallbackLocale)
    if (!fallbackLocale) {
      return key
    }

    const message = this.getNestedValue(fallbackLocale.messages, key)
    return message ? this.formatMessage(message, params) : key
  }

  // 通知观察者
  private notifyObservers(event: string, data: any): void {
    this.observers.forEach(observer => {
      observer.onLocaleEvent?.(event, data)
    })
  }

  // 添加观察者
  addObserver(observer: LocaleObserver): void {
    this.observers.add(observer)
  }

  // 移除观察者
  removeObserver(observer: LocaleObserver): void {
    this.observers.delete(observer)
  }
}

// 语言包数据结构
interface LocaleData {
  name: string
  messages: Record<string, any>
  dateTime: DateTimeFormats
  number: NumberFormats
  currency: CurrencyFormats
  pluralRule: (n: number) => string
}

// 日期时间格式
interface DateTimeFormats {
  short: string
  medium: string
  long: string
  full: string
  dateOnly: string
  timeOnly: string
  relative: RelativeTimeFormats
}

// 相对时间格式
interface RelativeTimeFormats {
  past: Record<string, string>
  future: Record<string, string>
  now: string
}

// 数字格式
interface NumberFormats {
  decimal: Intl.NumberFormatOptions
  currency: Intl.NumberFormatOptions
  percent: Intl.NumberFormatOptions
  scientific: Intl.NumberFormatOptions
}

// 货币格式
interface CurrencyFormats {
  symbol: string
  code: string
  format: Intl.NumberFormatOptions
}

// 语言观察者
interface LocaleObserver {
  onLocaleEvent?(event: string, data: any): void
}
```

### 1.2 高级消息格式化器
```typescript
// 消息格式化器
class MessageFormatter {
  private localeManager: LocaleManager
  private interpolationRegex = /\{([^}]+)\}/g
  private pluralRegex = /\{([^}]+)\s*,\s*plural\s*,\s*([^}]+)\}/g
  private selectRegex = /\{([^}]+)\s*,\s*select\s*,\s*([^}]+)\}/g

  constructor(localeManager: LocaleManager) {
    this.localeManager = localeManager
  }

  // 格式化消息
  format(key: string, params?: Record<string, any>): string {
    let message = this.localeManager.getMessage(key)
    
    if (!params) return message

    // 处理复数
    message = this.handlePlural(message, params)
    
    // 处理选择
    message = this.handleSelect(message, params)
    
    // 处理插值
    message = this.handleInterpolation(message, params)
    
    return message
  }

  // 处理复数
  private handlePlural(message: string, params: Record<string, any>): string {
    return message.replace(this.pluralRegex, (match, variable, options) => {
      const count = params[variable]
      if (typeof count !== 'number') return match

      const pluralOptions = this.parsePluralOptions(options)
      const rule = this.getPluralRule(count)
      
      return pluralOptions[rule] || pluralOptions.other || match
    })
  }

  // 处理选择
  private handleSelect(message: string, params: Record<string, any>): string {
    return message.replace(this.selectRegex, (match, variable, options) => {
      const value = params[variable]
      if (value === undefined) return match

      const selectOptions = this.parseSelectOptions(options)
      return selectOptions[String(value)] || selectOptions.other || match
    })
  }

  // 处理插值
  private handleInterpolation(message: string, params: Record<string, any>): string {
    return message.replace(this.interpolationRegex, (match, expression) => {
      const value = this.evaluateExpression(expression, params)
      return value !== undefined ? String(value) : match
    })
  }

  // 解析复数选项
  private parsePluralOptions(options: string): Record<string, string> {
    const result: Record<string, string> = {}
    const pairs = options.split(/\s+(?=\w+\s*{)/)
    
    pairs.forEach(pair => {
      const match = pair.match(/(\w+)\s*\{([^}]*)\}/)
      if (match) {
        result[match[1]] = match[2].trim()
      }
    })
    
    return result
  }

  // 解析选择选项
  private parseSelectOptions(options: string): Record<string, string> {
    const result: Record<string, string> = {}
    const pairs = options.split(/\s+(?=\w+\s*{)/)
    
    pairs.forEach(pair => {
      const match = pair.match(/(\w+)\s*\{([^}]*)\}/)
      if (match) {
        result[match[1]] = match[2].trim()
      }
    })
    
    return result
  }

  // 获取复数规则
  private getPluralRule(count: number): string {
    const locale = this.localeManager.getCurrentLocale()
    const localeData = this.localeManager.getLocaleData(locale)
    
    if (localeData?.pluralRule) {
      return localeData.pluralRule(count)
    }
    
    // 默认英语复数规则
    return count === 1 ? 'one' : 'other'
  }

  // 计算表达式
  private evaluateExpression(expression: string, params: Record<string, any>): any {
    // 简单的表达式计算，支持基本的数学运算和函数调用
    const trimmed = expression.trim()
    
    // 直接变量引用
    if (params.hasOwnProperty(trimmed)) {
      return params[trimmed]
    }
    
    // 函数调用
    const functionMatch = trimmed.match(/(\w+)\(([^)]*)\)/)
    if (functionMatch) {
      const [, funcName, args] = functionMatch
      return this.callFunction(funcName, args, params)
    }
    
    // 数学表达式
    try {
      return this.evaluateMathExpression(trimmed, params)
    } catch {
      return undefined
    }
  }

  // 调用函数
  private callFunction(name: string, args: string, params: Record<string, any>): any {
    const argValues = args.split(',').map(arg => {
      const trimmed = arg.trim()
      return params[trimmed] !== undefined ? params[trimmed] : trimmed
    })

    switch (name) {
      case 'number':
        return this.formatNumber(argValues[0], argValues[1])
      case 'date':
        return this.formatDate(argValues[0], argValues[1])
      case 'currency':
        return this.formatCurrency(argValues[0], argValues[1])
      default:
        return undefined
    }
  }

  // 格式化数字
  private formatNumber(value: any, format?: string): string {
    const num = Number(value)
    if (isNaN(num)) return String(value)

    const locale = this.localeManager.getCurrentLocale()
    const options = this.getNumberFormatOptions(format)
    
    return new Intl.NumberFormat(locale, options).format(num)
  }

  // 格式化日期
  private formatDate(value: any, format?: string): string {
    const date = new Date(value)
    if (isNaN(date.getTime())) return String(value)

    const locale = this.localeManager.getCurrentLocale()
    const options = this.getDateFormatOptions(format)
    
    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  // 格式化货币
  private formatCurrency(value: any, currency?: string): string {
    const num = Number(value)
    if (isNaN(num)) return String(value)

    const locale = this.localeManager.getCurrentLocale()
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency || 'USD'
    }
    
    return new Intl.NumberFormat(locale, options).format(num)
  }

  // 获取数字格式选项
  private getNumberFormatOptions(format?: string): Intl.NumberFormatOptions {
    switch (format) {
      case 'percent':
        return { style: 'percent' }
      case 'scientific':
        return { notation: 'scientific' }
      default:
        return { style: 'decimal' }
    }
  }

  // 获取日期格式选项
  private getDateFormatOptions(format?: string): Intl.DateTimeFormatOptions {
    switch (format) {
      case 'short':
        return { dateStyle: 'short' }
      case 'medium':
        return { dateStyle: 'medium' }
      case 'long':
        return { dateStyle: 'long' }
      case 'full':
        return { dateStyle: 'full' }
      case 'time':
        return { timeStyle: 'medium' }
      default:
        return { dateStyle: 'medium', timeStyle: 'short' }
    }
  }

  // 计算数学表达式
  private evaluateMathExpression(expression: string, params: Record<string, any>): number {
    // 替换变量
    let expr = expression
    Object.keys(params).forEach(key => {
      const value = params[key]
      if (typeof value === 'number') {
        expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), String(value))
      }
    })

    // 简单的数学表达式计算（仅支持基本运算）
    const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '')
    return Function(`"use strict"; return (${sanitized})`)() as number
  }
}
```

### 1.3 语言检测器
```typescript
// 语言检测器
class LanguageDetector {
  private detectionOrder: DetectionMethod[] = [
    'querystring',
    'cookie',
    'localStorage',
    'sessionStorage',
    'navigator',
    'htmlTag'
  ]

  private options: DetectorOptions = {
    order: this.detectionOrder,
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode']
  }

  // 检测语言
  detect(): string | undefined {
    for (const method of this.options.order) {
      const detected = this.detectFromMethod(method)
      if (detected) {
        return this.normalizeLanguage(detected)
      }
    }
    return undefined
  }

  // 从特定方法检测
  private detectFromMethod(method: DetectionMethod): string | undefined {
    switch (method) {
      case 'querystring':
        return this.detectFromQueryString()
      case 'cookie':
        return this.detectFromCookie()
      case 'localStorage':
        return this.detectFromLocalStorage()
      case 'sessionStorage':
        return this.detectFromSessionStorage()
      case 'navigator':
        return this.detectFromNavigator()
      case 'htmlTag':
        return this.detectFromHtmlTag()
      default:
        return undefined
    }
  }

  // 从查询字符串检测
  private detectFromQueryString(): string | undefined {
    if (typeof window === 'undefined') return undefined
    
    const params = new URLSearchParams(window.location.search)
    return params.get(this.options.lookupQuerystring) || undefined
  }

  // 从Cookie检测
  private detectFromCookie(): string | undefined {
    if (typeof document === 'undefined') return undefined
    
    const name = this.options.lookupCookie
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')[1]
    
    return value ? decodeURIComponent(value) : undefined
  }

  // 从localStorage检测
  private detectFromLocalStorage(): string | undefined {
    if (typeof window === 'undefined' || !window.localStorage) return undefined
    
    try {
      return window.localStorage.getItem(this.options.lookupLocalStorage) || undefined
    } catch {
      return undefined
    }
  }

  // 从sessionStorage检测
  private detectFromSessionStorage(): string | undefined {
    if (typeof window === 'undefined' || !window.sessionStorage) return undefined
    
    try {
      return window.sessionStorage.getItem(this.options.lookupSessionStorage) || undefined
    } catch {
      return undefined
    }
  }

  // 从浏览器检测
  private detectFromNavigator(): string | undefined {
    if (typeof navigator === 'undefined') return undefined
    
    const languages = navigator.languages || [navigator.language]
    return languages[0]
  }

  // 从HTML标签检测
  private detectFromHtmlTag(): string | undefined {
    if (typeof document === 'undefined') return undefined
    
    return document.documentElement.getAttribute('lang') || undefined
  }

  // 标准化语言代码
  private normalizeLanguage(lang: string): string {
    // 移除地区代码，只保留语言代码
    const normalized = lang.toLowerCase().split('-')[0]
    
    // 语言代码映射
    const mapping: Record<string, string> = {
      'zh': 'zh-CN',
      'en': 'en-US',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ru': 'ru-RU'
    }
    
    return mapping[normalized] || lang
  }

  // 缓存语言设置
  cacheUserLanguage(lng: string): void {
    this.options.caches.forEach(cache => {
      if (this.options.excludeCacheFor.includes(lng)) return
      
      switch (cache) {
        case 'localStorage':
          this.cacheToLocalStorage(lng)
          break
        case 'sessionStorage':
          this.cacheToSessionStorage(lng)
          break
        case 'cookie':
          this.cacheToCookie(lng)
          break
      }
    })
  }

  // 缓存到localStorage
  private cacheToLocalStorage(lng: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return
    
    try {
      window.localStorage.setItem(this.options.lookupLocalStorage, lng)
    } catch {
      // 忽略错误
    }
  }

  // 缓存到sessionStorage
  private cacheToSessionStorage(lng: string): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return
    
    try {
      window.sessionStorage.setItem(this.options.lookupSessionStorage, lng)
    } catch {
      // 忽略错误
    }
  }

  // 缓存到Cookie
  private cacheToCookie(lng: string): void {
    if (typeof document === 'undefined') return
    
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 1)
    
    document.cookie = `${this.options.lookupCookie}=${encodeURIComponent(lng)}; expires=${expires.toUTCString()}; path=/`
  }
}

// 检测方法类型
type DetectionMethod = 'querystring' | 'cookie' | 'localStorage' | 'sessionStorage' | 'navigator' | 'htmlTag'

// 检测器选项
interface DetectorOptions {
  order: DetectionMethod[]
  lookupQuerystring: string
  lookupCookie: string
  lookupLocalStorage: string
  lookupSessionStorage: string
  caches: string[]
  excludeCacheFor: string[]
}
```

## 2. 高级国际化组件实现

### 2.1 国际化提供者组件
```vue
<!-- I18nProvider.vue - 国际化提供者 -->
<template>
  <div class="i18n-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref, onMounted, watch } from 'vue'
import { LocaleManager, MessageFormatter, LanguageDetector } from './i18nSystem'
import type { LocaleData } from './types'

// Props
interface Props {
  locale?: string
  fallbackLocale?: string
  messages?: Record<string, LocaleData>
  detectBrowserLanguage?: boolean
  persistLanguage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: () => ({}),
  detectBrowserLanguage: true,
  persistLanguage: true
})

// 创建国际化系统实例
const localeManager = new LocaleManager()
const messageFormatter = new MessageFormatter(localeManager)
const languageDetector = new LanguageDetector()

// 响应式状态
const state = reactive({
  currentLocale: props.locale,
  availableLocales: Object.keys(props.messages),
  isLoading: false,
  error: null as string | null
})

// 初始化
onMounted(async () => {
  try {
    state.isLoading = true
    
    // 注册语言包
    Object.entries(props.messages).forEach(([locale, data]) => {
      localeManager.registerLocale(locale, data)
    })
    
    // 检测浏览器语言
    let detectedLocale = props.locale
    if (props.detectBrowserLanguage) {
      const detected = languageDetector.detect()
      if (detected && props.messages[detected]) {
        detectedLocale = detected
      }
    }
    
    // 设置当前语言
    await setLocale(detectedLocale)
    
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Unknown error'
    console.error('I18n initialization failed:', error)
  } finally {
    state.isLoading = false
  }
})

// 设置语言
const setLocale = async (locale: string) => {
  if (!props.messages[locale]) {
    console.warn(`Locale ${locale} not found`)
    return
  }
  
  state.currentLocale = locale
  localeManager.setCurrentLocale(locale)
  
  // 持久化语言设置
  if (props.persistLanguage) {
    languageDetector.cacheUserLanguage(locale)
  }
  
  // 更新HTML lang属性
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale)
  }
}

// 获取消息
const t = (key: string, params?: Record<string, any>): string => {
  return messageFormatter.format(key, params)
}

// 获取复数消息
const tc = (key: string, count: number, params?: Record<string, any>): string => {
  return messageFormatter.format(key, { ...params, count })
}

// 检查键是否存在
const te = (key: string): boolean => {
  return localeManager.hasMessage(key)
}

// 获取当前语言
const getLocale = (): string => {
  return state.currentLocale
}

// 获取可用语言列表
const getAvailableLocales = (): string[] => {
  return state.availableLocales
}

// 监听语言变化
watch(
  () => props.locale,
  (newLocale) => {
    if (newLocale !== state.currentLocale) {
      setLocale(newLocale)
    }
  }
)

// 提供给子组件
provide('i18n', {
  t,
  tc,
  te,
  setLocale,
  getLocale,
  getAvailableLocales,
  state: readonly(state)
})

// 暴露给父组件
defineExpose({
  setLocale,
  getLocale,
  getAvailableLocales,
  t,
  tc,
  te
})
</script>

<style scoped>
.i18n-provider {
  height: 100%;
}
</style>
```

### 2.2 语言切换器组件
```vue
<!-- LanguageSwitcher.vue - 语言切换器 -->
<template>
  <div class="language-switcher">
    <el-dropdown 
      :trigger="trigger"
      :placement="placement"
      @command="handleLanguageChange"
    >
      <el-button :type="buttonType" :size="size" class="language-trigger">
        <el-icon v-if="showIcon"><Globe /></el-icon>
        <span v-if="showText" class="language-text">
          {{ currentLanguageDisplay }}
        </span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      
      <template #dropdown>
        <el-dropdown-menu class="language-menu">
          <div v-if="showSearch && availableLanguages.length > searchThreshold" class="language-search">
            <el-input
              v-model="searchQuery"
              :placeholder="t('i18n.search')"
              size="small"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <div class="language-list">
            <el-dropdown-item
              v-for="lang in filteredLanguages"
              :key="lang.code"
              :command="lang.code"
              :class="{
                'is-active': lang.code === currentLocale,
                'is-disabled': lang.disabled
              }"
              :disabled="lang.disabled"
            >
              <div class="language-item">
                <div class="language-flag" v-if="showFlags">
                  <img 
                    :src="lang.flag" 
                    :alt="lang.name"
                    class="flag-icon"
                    v-if="lang.flag"
                  />
                  <span v-else class="flag-placeholder">{{ lang.code.slice(0, 2).toUpperCase() }}</span>
                </div>
                <div class="language-info">
                  <div class="language-name">{{ lang.name }}</div>
                  <div v-if="showNativeName" class="language-native">{{ lang.nativeName }}</div>
                </div>
                <el-icon v-if="lang.code === currentLocale" class="check-icon">
                  <Check />
                </el-icon>
              </div>
            </el-dropdown-item>
          </div>
          
          <el-divider v-if="showManageOption" />
          
          <el-dropdown-item v-if="showManageOption" class="manage-languages" @click="showManageDialog = true">
            <el-icon><Setting /></el-icon>
            <span>{{ t('i18n.manageLanguages') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 语言管理对话框 -->
    <LanguageManager 
      v-model="showManageDialog"
      :available-languages="availableLanguages"
      @update="handleLanguagesUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { ElMessage } from 'element-plus'
import { Globe, ArrowDown, Search, Check, Setting } from '@element-plus/icons-vue'
import LanguageManager from './LanguageManager.vue'
import type { LanguageInfo } from './types'

// Props
interface Props {
  trigger?: 'hover' | 'click'
  placement?: string
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  size?: 'large' | 'default' | 'small'
  showIcon?: boolean
  showText?: boolean
  showFlags?: boolean
  showNativeName?: boolean
  showSearch?: boolean
  showManageOption?: boolean
  searchThreshold?: number
  languages?: LanguageInfo[]
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  placement: 'bottom-end',
  buttonType: 'default',
  size: 'default',
  showIcon: true,
  showText: true,
  showFlags: true,
  showNativeName: true,
  showSearch: true,
  showManageOption: false,
  searchThreshold: 5,
  languages: () => []
})

// Emits
interface Emits {
  (e: 'change', locale: string): void
  (e: 'error', error: string): void
}

const emit = defineEmits<Emits>()

// 注入国际化
const i18n = inject('i18n') as any
const { t, setLocale, getLocale, getAvailableLocales } = i18n

// 响应式数据
const searchQuery = ref('')
const showManageDialog = ref(false)

// 计算属性
const currentLocale = computed(() => getLocale())

const availableLanguages = computed(() => {
  const locales = getAvailableLocales()
  return props.languages.length > 0 
    ? props.languages.filter(lang => locales.includes(lang.code))
    : locales.map(code => ({
        code,
        name: getLanguageName(code),
        nativeName: getNativeLanguageName(code),
        flag: getLanguageFlag(code),
        disabled: false
      }))
})

const filteredLanguages = computed(() => {
  if (!searchQuery.value) return availableLanguages.value
  
  const query = searchQuery.value.toLowerCase()
  return availableLanguages.value.filter(lang => 
    lang.name.toLowerCase().includes(query) ||
    lang.nativeName?.toLowerCase().includes(query) ||
    lang.code.toLowerCase().includes(query)
  )
})

const currentLanguageDisplay = computed(() => {
  const current = availableLanguages.value.find(lang => lang.code === currentLocale.value)
  return current?.name || currentLocale.value
})

// 事件处理
const handleLanguageChange = async (locale: string) => {
  try {
    await setLocale(locale)
    emit('change', locale)
    ElMessage.success(t('i18n.languageChanged', { language: getLanguageName(locale) }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    emit('error', message)
    ElMessage.error(t('i18n.languageChangeError'))
  }
}

const handleLanguagesUpdate = (languages: LanguageInfo[]) => {
  // 处理语言列表更新
  showManageDialog.value = false
}

// 辅助函数
const getLanguageName = (code: string): string => {
  const names: Record<string, string> = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'fr-FR': 'Français',
    'de-DE': 'Deutsch',
    'es-ES': 'Español',
    'it-IT': 'Italiano',
    'pt-BR': 'Português',
    'ru-RU': 'Русский',
    'ar-SA': 'العربية',
    'hi-IN': 'हिन्दी',
    'th-TH': 'ไทย',
    'vi-VN': 'Tiếng Việt'
  }
  return names[code] || code
}

const getNativeLanguageName = (code: string): string => {
  const nativeNames: Record<string, string> = {
    'zh-CN': '中文',
    'zh-TW': '中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'fr-FR': 'Français',
    'de-DE': 'Deutsch',
    'es-ES': 'Español',
    'it-IT': 'Italiano',
    'pt-BR': 'Português',
    'ru-RU': 'Русский',
    'ar-SA': 'العربية',
    'hi-IN': 'हिन्दी',
    'th-TH': 'ไทย',
    'vi-VN': 'Tiếng Việt'
  }
  return nativeNames[code] || code
}

const getLanguageFlag = (code: string): string => {
  const flags: Record<string, string> = {
    'zh-CN': '/flags/cn.svg',
    'zh-TW': '/flags/tw.svg',
    'en-US': '/flags/us.svg',
    'ja-JP': '/flags/jp.svg',
    'ko-KR': '/flags/kr.svg',
    'fr-FR': '/flags/fr.svg',
    'de-DE': '/flags/de.svg',
    'es-ES': '/flags/es.svg',
    'it-IT': '/flags/it.svg',
    'pt-BR': '/flags/br.svg',
    'ru-RU': '/flags/ru.svg',
    'ar-SA': '/flags/sa.svg',
    'hi-IN': '/flags/in.svg',
    'th-TH': '/flags/th.svg',
    'vi-VN': '/flags/vn.svg'
  }
  return flags[code] || ''
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.language-text {
  font-size: 14px;
}

.language-menu {
  min-width: 200px;
  max-width: 300px;
}

.language-search {
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.language-list {
  max-height: 300px;
  overflow-y: auto;
}

.language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.language-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 18px;
}

.flag-icon {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
}

.flag-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 18px;
  background-color: var(--el-fill-color-light);
  border-radius: 2px;
  font-size: 10px;
  font-weight: bold;
  color: var(--el-text-color-secondary);
}

.language-info {
  flex: 1;
  min-width: 0;
}

.language-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.language-native {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.2;
  margin-top: 2px;
}

.check-icon {
  color: var(--el-color-primary);
  font-size: 16px;
}

.is-active .language-item {
  color: var(--el-color-primary);
}

.is-active .language-name {
  color: var(--el-color-primary);
  font-weight: 600;
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.manage-languages {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.manage-languages:hover {
  color: var(--el-color-primary);
}
</style>
```

## 实践练习

### 练习1：多语言表单验证
```typescript
// 实现多语言表单验证消息
// 1. 创建验证规则国际化
// 2. 动态切换验证消息语言
// 3. 支持自定义验证消息
// 4. 处理复杂验证场景
```

### 练习2：RTL语言支持
```scss
// 实现RTL（从右到左）语言支持
// 1. 自动检测RTL语言
// 2. 动态切换布局方向
// 3. 适配组件样式
// 4. 处理图标和动画
```

### 练习3：懒加载语言包
```typescript
// 实现语言包懒加载
// 1. 按需加载语言包
// 2. 缓存已加载的语言包
// 3. 处理加载失败情况
// 4. 优化加载性能
```

### 练习4：国际化管理后台
```vue
// 构建国际化管理系统
// 1. 语言包在线编辑
// 2. 翻译进度管理
// 3. 批量导入导出
// 4. 翻译质量检查
```

## 学习资源

### 官方文档
- [Element Plus 国际化](https://element-plus.org/zh-CN/guide/i18n.html)
- [Vue I18n 文档](https://vue-i18n.intlify.dev/)
- [Intl API 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)

### 国际化标准
- [Unicode CLDR](http://cldr.unicode.org/)
- [BCP 47 语言标签](https://tools.ietf.org/html/bcp47)
- [ISO 639 语言代码](https://www.iso.org/iso-639-language-codes.html)

### 工具和服务
- [Crowdin 翻译平台](https://crowdin.com/)
- [Lokalise 本地化平台](https://lokalise.com/)
- [Google Translate API](https://cloud.google.com/translate)

## 作业

1. **国际化系统**：实现完整的国际化管理系统
2. **多语言表单**：创建支持多语言的复杂表单
3. **RTL支持**：实现阿拉伯语等RTL语言支持
4. **性能优化**：优化语言包加载和切换性能
5. **翻译工具**：开发翻译辅助工具

## 下一步学习

明天我们将学习「Element Plus 全局配置与命名空间」，包括：
- 全局配置系统
- 命名空间管理
- 样式隔离
- 配置继承机制