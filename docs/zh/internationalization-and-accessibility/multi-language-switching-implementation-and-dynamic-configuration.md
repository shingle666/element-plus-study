# 第60天：Element Plus 多语言切换实现与动态配置

## 学习目标

* 掌握 Element Plus 多语言系统的高级应用
* 学会实现动态语言切换功能
* 了解多语言配置的最佳实践
* 掌握复杂业务场景下的国际化解决方案

## 知识点概览

### 1. 多语言系统架构设计

#### 1.1 国际化架构规划

```typescript
// types/i18n.ts
export interface I18nConfig {
  // 默认语言
  defaultLocale: string
  
  // 支持的语言列表
  supportedLocales: LocaleInfo[]
  
  // 语言检测策略
  detection: {
    // 检测顺序
    order: ('localStorage' | 'navigator' | 'header' | 'cookie')[]
    // 缓存配置
    cache: {
      enabled: boolean
      key: string
      expires: number
    }
  }
  
  // 回退策略
  fallback: {
    enabled: boolean
    locale: string
  }
  
  // 懒加载配置
  lazy: {
    enabled: boolean
    chunkName: string
  }
  
  // 插值配置
  interpolation: {
    escapeValue: boolean
    format: (value: any, format: string, lng: string) => string
  }
}

export interface LocaleInfo {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
  dateFormat: string
  timeFormat: string
  numberFormat: {
    decimal: string
    thousands: string
    currency: string
  }
  enabled: boolean
}

export interface TranslationResource {
  [key: string]: string | TranslationResource
}

export interface I18nState {
  currentLocale: string
  availableLocales: LocaleInfo[]
  translations: Record<string, TranslationResource>
  loading: boolean
  error: string | null
}
```

#### 1.2 多语言状态管理

```typescript
// stores/i18n.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { I18nState, LocaleInfo, TranslationResource } from '@/types/i18n'

export const useI18nStore = defineStore('i18n', () => {
  // 状态
  const state = ref<I18nState>({
    currentLocale: 'zh-CN',
    availableLocales: [],
    translations: {},
    loading: false,
    error: null
  })
  
  // 配置
  const config = ref({
    defaultLocale: 'zh-CN',
    supportedLocales: [
      {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        nativeName: '简体中文',
        flag: '🇨🇳',
        direction: 'ltr',
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          currency: '¥'
        },
        enabled: true
      },
      {
        code: 'en-US',
        name: 'English (US)',
        nativeName: 'English',
        flag: '🇺🇸',
        direction: 'ltr',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'hh:mm:ss A',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          currency: '$'
        },
        enabled: true
      },
      {
        code: 'ja-JP',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        direction: 'ltr',
        dateFormat: 'YYYY/MM/DD',
        timeFormat: 'HH:mm:ss',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          currency: '¥'
        },
        enabled: true
      },
      {
        code: 'ko-KR',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷',
        direction: 'ltr',
        dateFormat: 'YYYY.MM.DD',
        timeFormat: 'HH:mm:ss',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          currency: '₩'
        },
        enabled: true
      },
      {
        code: 'ar-SA',
        name: 'Arabic',
        nativeName: 'العربية',
        flag: '🇸🇦',
        direction: 'rtl',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm:ss',
        numberFormat: {
          decimal: '.',
          thousands: ',',
          currency: 'ر.س'
        },
        enabled: true
      }
    ] as LocaleInfo[],
    detection: {
      order: ['localStorage', 'navigator', 'header'],
      cache: {
        enabled: true,
        key: 'app_locale',
        expires: 30 * 24 * 60 * 60 * 1000 // 30 days
      }
    },
    fallback: {
      enabled: true,
      locale: 'en-US'
    },
    lazy: {
      enabled: true,
      chunkName: 'locale-[locale]'
    }
  })
  
  // 计算属性
  const currentLocaleInfo = computed(() => {
    return state.value.availableLocales.find(
      locale => locale.code === state.value.currentLocale
    ) || config.value.supportedLocales[0]
  })
  
  const isRTL = computed(() => {
    return currentLocaleInfo.value.direction === 'rtl'
  })
  
  const enabledLocales = computed(() => {
    return state.value.availableLocales.filter(locale => locale.enabled)
  })
  
  // 初始化
  const initialize = async () => {
    try {
      state.value.loading = true
      state.value.availableLocales = config.value.supportedLocales
      
      // 检测用户语言偏好
      const detectedLocale = detectUserLocale()
      
      // 设置初始语言
      await setLocale(detectedLocale)
      
      state.value.error = null
    } catch (error) {
      state.value.error = '初始化多语言系统失败'
      console.error('I18n initialization failed:', error)
    } finally {
      state.value.loading = false
    }
  }
  
  // 检测用户语言偏好
  const detectUserLocale = (): string => {
    const { order, cache } = config.value.detection
    
    for (const method of order) {
      let detectedLocale: string | null = null
      
      switch (method) {
        case 'localStorage':
          if (cache.enabled) {
            detectedLocale = localStorage.getItem(cache.key)
          }
          break
          
        case 'navigator':
          detectedLocale = navigator.language || navigator.languages[0]
          break
          
        case 'header':
          // 在服务端渲染时从请求头获取
          if (typeof window === 'undefined') {
            // SSR 环境下的语言检测逻辑
          }
          break
          
        case 'cookie':
          // 从 cookie 中获取语言设置
          detectedLocale = getCookieValue('locale')
          break
      }
      
      if (detectedLocale && isLocaleSupported(detectedLocale)) {
        return detectedLocale
      }
    }
    
    return config.value.defaultLocale
  }
  
  // 检查语言是否支持
  const isLocaleSupported = (locale: string): boolean => {
    return config.value.supportedLocales.some(
      supportedLocale => supportedLocale.code === locale
    )
  }
  
  // 设置语言
  const setLocale = async (locale: string) => {
    if (!isLocaleSupported(locale)) {
      console.warn(`Locale ${locale} is not supported`)
      locale = config.value.fallback.enabled 
        ? config.value.fallback.locale 
        : config.value.defaultLocale
    }
    
    try {
      state.value.loading = true
      
      // 加载翻译资源
      await loadTranslations(locale)
      
      // 更新当前语言
      state.value.currentLocale = locale
      
      // 缓存语言设置
      if (config.value.detection.cache.enabled) {
        localStorage.setItem(
          config.value.detection.cache.key, 
          locale
        )
      }
      
      // 更新 HTML 属性
      updateHTMLAttributes(locale)
      
      // 触发语言变更事件
      emitLocaleChange(locale)
      
      ElMessage.success(`语言已切换为 ${currentLocaleInfo.value.nativeName}`)
    } catch (error) {
      state.value.error = `切换语言失败: ${error}`
      ElMessage.error('语言切换失败')
      throw error
    } finally {
      state.value.loading = false
    }
  }
  
  // 加载翻译资源
  const loadTranslations = async (locale: string) => {
    if (state.value.translations[locale]) {
      return // 已加载
    }
    
    try {
      let translations: TranslationResource
      
      if (config.value.lazy.enabled) {
        // 懒加载翻译文件
        const module = await import(`@/locales/${locale}.json`)
        translations = module.default || module
      } else {
        // 静态导入
        const response = await fetch(`/locales/${locale}.json`)
        translations = await response.json()
      }
      
      state.value.translations[locale] = translations
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error)
      
      // 如果加载失败且启用了回退，尝试加载回退语言
      if (config.value.fallback.enabled && locale !== config.value.fallback.locale) {
        await loadTranslations(config.value.fallback.locale)
      }
      
      throw error
    }
  }
  
  // 更新 HTML 属性
  const updateHTMLAttributes = (locale: string) => {
    const localeInfo = config.value.supportedLocales.find(
      l => l.code === locale
    )
    
    if (localeInfo) {
      document.documentElement.lang = locale
      document.documentElement.dir = localeInfo.direction
      
      // 更新 CSS 变量
      document.documentElement.style.setProperty(
        '--text-direction', 
        localeInfo.direction
      )
    }
  }
  
  // 触发语言变更事件
  const emitLocaleChange = (locale: string) => {
    const event = new CustomEvent('localeChange', {
      detail: { locale, localeInfo: currentLocaleInfo.value }
    })
    window.dispatchEvent(event)
  }
  
  // 翻译函数
  const t = (key: string, params?: Record<string, any>): string => {
    const translations = state.value.translations[state.value.currentLocale]
    if (!translations) {
      return key
    }
    
    const value = getNestedValue(translations, key)
    if (value === undefined) {
      // 尝试回退语言
      if (config.value.fallback.enabled) {
        const fallbackTranslations = state.value.translations[config.value.fallback.locale]
        if (fallbackTranslations) {
          const fallbackValue = getNestedValue(fallbackTranslations, key)
          if (fallbackValue !== undefined) {
            return interpolate(fallbackValue, params)
          }
        }
      }
      
      console.warn(`Translation key "${key}" not found for locale "${state.value.currentLocale}"`)
      return key
    }
    
    return interpolate(value, params)
  }
  
  // 获取嵌套对象值
  const getNestedValue = (obj: any, path: string): string | undefined => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }
  
  // 字符串插值
  const interpolate = (template: string, params?: Record<string, any>): string => {
    if (!params) return template
    
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }
  
  // 格式化数字
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = state.value.currentLocale
    return new Intl.NumberFormat(locale, options).format(value)
  }
  
  // 格式化货币
  const formatCurrency = (value: number, currency?: string): string => {
    const locale = state.value.currentLocale
    const localeInfo = currentLocaleInfo.value
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || localeInfo.numberFormat.currency.replace(/[^A-Z]/g, '') || 'USD'
    }).format(value)
  }
  
  // 格式化日期
  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    const locale = state.value.currentLocale
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj)
  }
  
  // 格式化相对时间
  const formatRelativeTime = (value: number, unit: Intl.RelativeTimeFormatUnit): string => {
    const locale = state.value.currentLocale
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    
    return rtf.format(value, unit)
  }
  
  // 获取 Cookie 值
  const getCookieValue = (name: string): string | null => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  }
  
  // 添加新语言
  const addLocale = (localeInfo: LocaleInfo) => {
    const existingIndex = state.value.availableLocales.findIndex(
      locale => locale.code === localeInfo.code
    )
    
    if (existingIndex >= 0) {
      state.value.availableLocales[existingIndex] = localeInfo
    } else {
      state.value.availableLocales.push(localeInfo)
    }
  }
  
  // 移除语言
  const removeLocale = (localeCode: string) => {
    const index = state.value.availableLocales.findIndex(
      locale => locale.code === localeCode
    )
    
    if (index >= 0) {
      state.value.availableLocales.splice(index, 1)
      
      // 如果移除的是当前语言，切换到默认语言
      if (state.value.currentLocale === localeCode) {
        setLocale(config.value.defaultLocale)
      }
    }
  }
  
  // 启用/禁用语言
  const toggleLocale = (localeCode: string, enabled: boolean) => {
    const locale = state.value.availableLocales.find(
      l => l.code === localeCode
    )
    
    if (locale) {
      locale.enabled = enabled
      
      // 如果禁用的是当前语言，切换到默认语言
      if (!enabled && state.value.currentLocale === localeCode) {
        setLocale(config.value.defaultLocale)
      }
    }
  }
  
  // 监听语言变化
  watch(
    () => state.value.currentLocale,
    (newLocale) => {
      // 更新 Element Plus 语言
      updateElementPlusLocale(newLocale)
    },
    { immediate: true }
  )
  
  // 更新 Element Plus 语言
  const updateElementPlusLocale = async (locale: string) => {
    try {
      let elementLocale
      
      switch (locale) {
        case 'zh-CN':
          elementLocale = (await import('element-plus/dist/locale/zh-cn.mjs')).default
          break
        case 'en-US':
          elementLocale = (await import('element-plus/dist/locale/en.mjs')).default
          break
        case 'ja-JP':
          elementLocale = (await import('element-plus/dist/locale/ja.mjs')).default
          break
        case 'ko-KR':
          elementLocale = (await import('element-plus/dist/locale/ko.mjs')).default
          break
        case 'ar-SA':
          elementLocale = (await import('element-plus/dist/locale/ar.mjs')).default
          break
        default:
          elementLocale = (await import('element-plus/dist/locale/en.mjs')).default
      }
      
      // 这里需要与 Element Plus 的配置提供者集成
      // 具体实现取决于应用的架构
    } catch (error) {
      console.error('Failed to update Element Plus locale:', error)
    }
  }
  
  return {
    // 状态
    state: readonly(state),
    config: readonly(config),
    
    // 计算属性
    currentLocaleInfo,
    isRTL,
    enabledLocales,
    
    // 方法
    initialize,
    setLocale,
    addLocale,
    removeLocale,
    toggleLocale,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime
  }
})
```

### 2. 动态语言切换组件

#### 2.1 语言选择器组件

```vue
<!-- components/LanguageSelector/LanguageSelector.vue -->
<template>
  <div class="language-selector">
    <!-- 下拉选择器模式 -->
    <el-dropdown
      v-if="mode === 'dropdown'"
      :class="['language-selector__dropdown', { 'is-loading': loading }]"
      trigger="click"
      @command="handleLocaleChange"
    >
      <el-button
        :type="buttonType"
        :size="size"
        :loading="loading"
        :disabled="disabled"
      >
        <span class="language-selector__current">
          <span v-if="showFlag" class="language-selector__flag">
            {{ currentLocaleInfo.flag }}
          </span>
          <span v-if="showName" class="language-selector__name">
            {{ showNativeName ? currentLocaleInfo.nativeName : currentLocaleInfo.name }}
          </span>
          <span v-if="showCode" class="language-selector__code">
            ({{ currentLocaleInfo.code }})
          </span>
        </span>
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="locale in availableLocales"
            :key="locale.code"
            :command="locale.code"
            :disabled="locale.code === currentLocale || !locale.enabled"
            :class="{
              'is-active': locale.code === currentLocale,
              'is-disabled': !locale.enabled
            }"
          >
            <div class="language-selector__option">
              <span v-if="showFlag" class="language-selector__flag">
                {{ locale.flag }}
              </span>
              <span class="language-selector__info">
                <span class="language-selector__name">
                  {{ showNativeName ? locale.nativeName : locale.name }}
                </span>
                <span v-if="showCode" class="language-selector__code">
                  {{ locale.code }}
                </span>
              </span>
              <el-icon v-if="locale.code === currentLocale" class="language-selector__check">
                <check />
              </el-icon>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 按钮组模式 -->
    <el-button-group v-else-if="mode === 'buttons'" class="language-selector__buttons">
      <el-button
        v-for="locale in availableLocales"
        :key="locale.code"
        :type="locale.code === currentLocale ? 'primary' : 'default'"
        :size="size"
        :loading="loading && locale.code === pendingLocale"
        :disabled="disabled || !locale.enabled"
        @click="handleLocaleChange(locale.code)"
      >
        <span v-if="showFlag" class="language-selector__flag">
          {{ locale.flag }}
        </span>
        <span v-if="showName">
          {{ showNativeName ? locale.nativeName : locale.name }}
        </span>
        <span v-if="showCode" class="language-selector__code">
          ({{ locale.code }})
        </span>
      </el-button>
    </el-button-group>
    
    <!-- 选择器模式 -->
    <el-select
      v-else-if="mode === 'select'"
      :model-value="currentLocale"
      :size="size"
      :loading="loading"
      :disabled="disabled"
      :placeholder="placeholder"
      :clearable="false"
      class="language-selector__select"
      @change="handleLocaleChange"
    >
      <el-option
        v-for="locale in availableLocales"
        :key="locale.code"
        :label="getOptionLabel(locale)"
        :value="locale.code"
        :disabled="!locale.enabled"
      >
        <div class="language-selector__option">
          <span v-if="showFlag" class="language-selector__flag">
            {{ locale.flag }}
          </span>
          <span class="language-selector__info">
            <span class="language-selector__name">
              {{ showNativeName ? locale.nativeName : locale.name }}
            </span>
            <span v-if="showCode" class="language-selector__code">
              {{ locale.code }}
            </span>
          </span>
        </div>
      </el-option>
    </el-select>
    
    <!-- 标签页模式 -->
    <el-tabs
      v-else-if="mode === 'tabs'"
      :model-value="currentLocale"
      :size="size"
      :type="tabType"
      class="language-selector__tabs"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="locale in availableLocales"
        :key="locale.code"
        :label="getTabLabel(locale)"
        :name="locale.code"
        :disabled="!locale.enabled"
      >
        <template #label>
          <div class="language-selector__tab">
            <span v-if="showFlag" class="language-selector__flag">
              {{ locale.flag }}
            </span>
            <span v-if="showName">
              {{ showNativeName ? locale.nativeName : locale.name }}
            </span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 自定义模式 -->
    <div v-else class="language-selector__custom">
      <slot
        :locales="availableLocales"
        :current-locale="currentLocale"
        :current-locale-info="currentLocaleInfo"
        :loading="loading"
        :disabled="disabled"
        :change-locale="handleLocaleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElButtonGroup, ElSelect, ElOption, ElTabs, ElTabPane, ElIcon, ElMessage } from 'element-plus'
import { ArrowDown, Check } from '@element-plus/icons-vue'
import { useI18nStore } from '@/stores/i18n'
import type { LocaleInfo } from '@/types/i18n'
import type { TabsPaneContext } from 'element-plus'

// Props
interface LanguageSelectorProps {
  mode?: 'dropdown' | 'buttons' | 'select' | 'tabs' | 'custom'
  size?: 'large' | 'default' | 'small'
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  tabType?: 'card' | 'border-card'
  showFlag?: boolean
  showName?: boolean
  showCode?: boolean
  showNativeName?: boolean
  disabled?: boolean
  placeholder?: string
  confirmChange?: boolean
  confirmMessage?: string
}

const props = withDefaults(defineProps<LanguageSelectorProps>(), {
  mode: 'dropdown',
  size: 'default',
  buttonType: 'default',
  tabType: 'card',
  showFlag: true,
  showName: true,
  showCode: false,
  showNativeName: true,
  disabled: false,
  placeholder: '选择语言',
  confirmChange: false,
  confirmMessage: '确定要切换语言吗？'
})

// Emits
interface LanguageSelectorEmits {
  'before-change': [locale: string]
  'change': [locale: string, oldLocale: string]
  'error': [error: string]
}

const emit = defineEmits<LanguageSelectorEmits>()

// Store
const i18nStore = useI18nStore()

// Refs
const loading = ref(false)
const pendingLocale = ref('')

// Computed
const currentLocale = computed(() => i18nStore.state.currentLocale)
const currentLocaleInfo = computed(() => i18nStore.currentLocaleInfo)
const availableLocales = computed(() => i18nStore.enabledLocales)

// Methods
const handleLocaleChange = async (locale: string) => {
  if (locale === currentLocale.value || loading.value) {
    return
  }
  
  try {
    // 触发变更前事件
    emit('before-change', locale)
    
    // 确认变更
    if (props.confirmChange) {
      await ElMessageBox.confirm(
        props.confirmMessage,
        '确认',
        {
          type: 'info',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
    }
    
    loading.value = true
    pendingLocale.value = locale
    
    const oldLocale = currentLocale.value
    
    // 切换语言
    await i18nStore.setLocale(locale)
    
    // 触发变更事件
    emit('change', locale, oldLocale)
    
  } catch (error) {
    if (error !== 'cancel') {
      const errorMessage = error instanceof Error ? error.message : '语言切换失败'
      emit('error', errorMessage)
      ElMessage.error(errorMessage)
    }
  } finally {
    loading.value = false
    pendingLocale.value = ''
  }
}

const handleTabClick = (tab: TabsPaneContext) => {
  if (tab.props.name) {
    handleLocaleChange(tab.props.name as string)
  }
}

const getOptionLabel = (locale: LocaleInfo): string => {
  const parts = []
  
  if (props.showFlag) parts.push(locale.flag)
  if (props.showName) {
    parts.push(props.showNativeName ? locale.nativeName : locale.name)
  }
  if (props.showCode) parts.push(`(${locale.code})`)
  
  return parts.join(' ')
}

const getTabLabel = (locale: LocaleInfo): string => {
  return getOptionLabel(locale)
}
</script>

<style lang="scss" scoped>
.language-selector {
  &__dropdown {
    &.is-loading {
      pointer-events: none;
    }
  }
  
  &__current {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 8px;
  }
  
  &__info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  &__flag {
    font-size: 16px;
    line-height: 1;
  }
  
  &__name {
    font-weight: 500;
  }
  
  &__code {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  
  &__check {
    color: var(--el-color-primary);
  }
  
  &__buttons {
    .language-selector__flag {
      margin-right: 4px;
    }
    
    .language-selector__code {
      margin-left: 4px;
    }
  }
  
  &__select {
    min-width: 150px;
  }
  
  &__tabs {
    .language-selector__tab {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  
  &__custom {
    // 自定义样式由使用者定义
  }
}

// RTL 支持
[dir="rtl"] {
  .language-selector {
    &__current,
    &__option,
    &__tab {
      flex-direction: row-reverse;
    }
    
    &__buttons {
      .language-selector__flag {
        margin-right: 0;
        margin-left: 4px;
      }
      
      .language-selector__code {
        margin-left: 0;
        margin-right: 4px;
      }
    }
  }
}
</style>
```

#### 2.2 语言切换快捷操作

```vue
<!-- components/LanguageQuickSwitch/LanguageQuickSwitch.vue -->
<template>
  <div class="language-quick-switch">
    <!-- 浮动按钮 -->
    <el-affix v-if="mode === 'float'" :offset="offset" :position="position">
      <div class="language-quick-switch__float">
        <el-button
          :type="buttonType"
          :size="size"
          circle
          @click="togglePanel"
        >
          <el-icon>
            <globe />
          </el-icon>
        </el-button>
        
        <transition name="slide-fade">
          <div v-show="panelVisible" class="language-quick-switch__panel">
            <div class="language-quick-switch__header">
              <span>{{ t('common.selectLanguage') }}</span>
              <el-button
                type="text"
                size="small"
                @click="panelVisible = false"
              >
                <el-icon><close /></el-icon>
              </el-button>
            </div>
            
            <div class="language-quick-switch__list">
              <div
                v-for="locale in availableLocales"
                :key="locale.code"
                :class="[
                  'language-quick-switch__item',
                  {
                    'is-active': locale.code === currentLocale,
                    'is-disabled': !locale.enabled
                  }
                ]"
                @click="handleQuickSwitch(locale.code)"
              >
                <span class="language-quick-switch__flag">{{ locale.flag }}</span>
                <span class="language-quick-switch__name">{{ locale.nativeName }}</span>
                <el-icon v-if="locale.code === currentLocale" class="language-quick-switch__check">
                  <check />
                </el-icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </el-affix>
    
    <!-- 键盘快捷键 -->
    <div v-if="mode === 'keyboard'" class="language-quick-switch__keyboard">
      <el-tooltip
        :content="`${t('common.pressKey')} ${shortcutKey} ${t('common.toSwitchLanguage')}`"
        placement="top"
      >
        <el-tag size="small" type="info">
          <el-icon><keyboard /></el-icon>
          {{ shortcutKey }}
        </el-tag>
      </el-tooltip>
    </div>
    
    <!-- 手势切换 -->
    <div
      v-if="mode === 'gesture'"
      class="language-quick-switch__gesture"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="language-quick-switch__gesture-indicator">
        <el-icon><d-arrow-left /></el-icon>
        <span>{{ t('common.swipeToSwitchLanguage') }}</span>
        <el-icon><d-arrow-right /></el-icon>
      </div>
    </div>
    
    <!-- 自动检测 -->
    <div v-if="mode === 'auto'" class="language-quick-switch__auto">
      <el-alert
        v-if="showAutoDetectTip"
        :title="t('common.autoDetectLanguage')"
        type="info"
        :closable="true"
        show-icon
        @close="handleAutoDetectClose"
      >
        <template #default>
          <p>{{ t('common.detectedLanguage', { language: detectedLanguage }) }}</p>
          <div class="language-quick-switch__auto-actions">
            <el-button
              size="small"
              type="primary"
              @click="handleAcceptDetected"
            >
              {{ t('common.accept') }}
            </el-button>
            <el-button
              size="small"
              @click="handleRejectDetected"
            >
              {{ t('common.reject') }}
            </el-button>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElAffix, ElButton, ElIcon, ElTooltip, ElTag, ElAlert } from 'element-plus'
import { Globe, Close, Check, Keyboard, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { useI18nStore } from '@/stores/i18n'

// Props
interface LanguageQuickSwitchProps {
  mode?: 'float' | 'keyboard' | 'gesture' | 'auto'
  position?: 'top' | 'bottom'
  offset?: number
  size?: 'large' | 'default' | 'small'
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  shortcutKey?: string
  enableGesture?: boolean
  autoDetect?: boolean
}

const props = withDefaults(defineProps<LanguageQuickSwitchProps>(), {
  mode: 'float',
  position: 'bottom',
  offset: 20,
  size: 'default',
  buttonType: 'primary',
  shortcutKey: 'Alt+L',
  enableGesture: true,
  autoDetect: true
})

// Store
const i18nStore = useI18nStore()

// Refs
const panelVisible = ref(false)
const showAutoDetectTip = ref(false)
const detectedLanguage = ref('')
const touchStartX = ref(0)
const touchStartY = ref(0)

// Computed
const currentLocale = computed(() => i18nStore.state.currentLocale)
const availableLocales = computed(() => i18nStore.enabledLocales)
const { t } = i18nStore

// Methods
const togglePanel = () => {
  panelVisible.value = !panelVisible.value
}

const handleQuickSwitch = async (locale: string) => {
  if (locale === currentLocale.value) return
  
  try {
    await i18nStore.setLocale(locale)
    panelVisible.value = false
  } catch (error) {
    console.error('Quick switch failed:', error)
  }
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  if (props.mode !== 'keyboard') return
  
  const { altKey, ctrlKey, key } = event
  const shortcut = props.shortcutKey.toLowerCase()
  
  if (shortcut.includes('alt') && altKey && key.toLowerCase() === 'l') {
    event.preventDefault()
    switchToNextLanguage()
  } else if (shortcut.includes('ctrl') && ctrlKey && key.toLowerCase() === 'l') {
    event.preventDefault()
    switchToNextLanguage()
  }
}

const switchToNextLanguage = () => {
  const currentIndex = availableLocales.value.findIndex(
    locale => locale.code === currentLocale.value
  )
  
  const nextIndex = (currentIndex + 1) % availableLocales.value.length
  const nextLocale = availableLocales.value[nextIndex]
  
  if (nextLocale) {
    handleQuickSwitch(nextLocale.code)
  }
}

// 手势处理
const handleTouchStart = (event: TouchEvent) => {
  if (!props.enableGesture) return
  
  const touch = event.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
}

const handleTouchMove = (event: TouchEvent) => {
  if (!props.enableGesture) return
  
  event.preventDefault()
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!props.enableGesture) return
  
  const touch = event.changedTouches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value
  
  // 检查是否为水平滑动
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      // 向右滑动，切换到上一个语言
      switchToPreviousLanguage()
    } else {
      // 向左滑动，切换到下一个语言
      switchToNextLanguage()
    }
  }
}

const switchToPreviousLanguage = () => {
  const currentIndex = availableLocales.value.findIndex(
    locale => locale.code === currentLocale.value
  )
  
  const prevIndex = currentIndex === 0 
    ? availableLocales.value.length - 1 
    : currentIndex - 1
  
  const prevLocale = availableLocales.value[prevIndex]
  
  if (prevLocale) {
    handleQuickSwitch(prevLocale.code)
  }
}

// 自动检测处理
const detectUserLanguage = () => {
  if (!props.autoDetect) return
  
  const browserLanguage = navigator.language || navigator.languages[0]
  const supportedLocale = availableLocales.value.find(
    locale => locale.code === browserLanguage
  )
  
  if (supportedLocale && supportedLocale.code !== currentLocale.value) {
    detectedLanguage.value = supportedLocale.nativeName
    showAutoDetectTip.value = true
  }
}

const handleAcceptDetected = () => {
  const detectedLocale = availableLocales.value.find(
    locale => locale.nativeName === detectedLanguage.value
  )
  
  if (detectedLocale) {
    handleQuickSwitch(detectedLocale.code)
  }
  
  showAutoDetectTip.value = false
}

const handleRejectDetected = () => {
  showAutoDetectTip.value = false
  // 记住用户的选择，避免重复提示
  localStorage.setItem('language-auto-detect-rejected', 'true')
}

const handleAutoDetectClose = () => {
  showAutoDetectTip.value = false
}

// 生命周期
onMounted(() => {
  if (props.mode === 'keyboard') {
    document.addEventListener('keydown', handleKeydown)
  }
  
  if (props.mode === 'auto') {
    const rejected = localStorage.getItem('language-auto-detect-rejected')
    if (!rejected) {
      setTimeout(detectUserLanguage, 1000)
    }
  }
  
  // 点击外部关闭面板
  document.addEventListener('click', (event) => {
    const target = event.target as Element
    if (!target.closest('.language-quick-switch__float')) {
      panelVisible.value = false
    }
  })
})

onUnmounted(() => {
  if (props.mode === 'keyboard') {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style lang="scss" scoped>
.language-quick-switch {
  &__float {
    position: relative;
  }
  
  &__panel {
    position: absolute;
    bottom: 60px;
    right: 0;
    width: 200px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    box-shadow: var(--el-box-shadow);
    z-index: 1000;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    font-weight: 500;
  }
  
  &__list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  &__item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--el-fill-color-light);
    }
    
    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
    
    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        background-color: transparent;
      }
    }
  }
  
  &__flag {
    margin-right: 8px;
    font-size: 16px;
  }
  
  &__name {
    flex: 1;
  }
  
  &__check {
    color: var(--el-color-primary);
  }
  
  &__keyboard {
    display: inline-block;
  }
  
  &__gesture {
    padding: 20px;
    text-align: center;
    border: 2px dashed var(--el-border-color);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
  
  &__gesture-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--el-text-color-secondary);
  }
  
  &__auto-actions {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }
}

// 动画
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

// RTL 支持
[dir="rtl"] {
  .language-quick-switch {
    &__panel {
      right: auto;
      left: 0;
    }
    
    &__flag {
      margin-right: 0;
      margin-left: 8px;
    }
  }
}
</style>
```

### 3. 翻译资源管理

#### 3.1 翻译文件结构

```json
// locales/zh-CN.json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑",
    "add": "添加",
    "search": "搜索",
    "reset": "重置",
    "submit": "提交",
    "loading": "加载中...",
    "noData": "暂无数据",
    "selectLanguage": "选择语言",
    "pressKey": "按下",
    "toSwitchLanguage": "切换语言",
    "swipeToSwitchLanguage": "滑动切换语言",
    "autoDetectLanguage": "自动检测语言",
    "detectedLanguage": "检测到您的语言为 {{language}}",
    "accept": "接受",
    "reject": "拒绝"
  },
  "navigation": {
    "home": "首页",
    "dashboard": "仪表板",
    "users": "用户管理",
    "settings": "设置",
    "profile": "个人资料",
    "logout": "退出登录"
  },
  "user": {
    "title": "用户管理",
    "description": "管理系统用户账号、角色和权限",
    "username": "用户名",
    "email": "邮箱",
    "phone": "手机号",
    "realName": "真实姓名",
    "department": "部门",
    "position": "职位",
    "role": "角色",
    "status": "状态",
    "lastLogin": "最后登录",
    "createTime": "创建时间",
    "actions": "操作",
    "view": "查看",
    "edit": "编辑",
    "delete": "删除",
    "enable": "启用",
    "disable": "禁用",
    "addUser": "新增用户",
    "editUser": "编辑用户",
    "deleteConfirm": "确定要删除用户 \"{{name}}\" 吗？",
    "batchDeleteConfirm": "确定要删除选中的 {{count}} 个用户吗？"
  },
  "form": {
    "required": "{{field}} 是必填项",
    "email": "请输入正确的邮箱地址",
    "phone": "请输入正确的手机号",
    "minLength": "{{field}} 长度不能少于 {{min}} 个字符",
    "maxLength": "{{field}} 长度不能超过 {{max}} 个字符",
    "passwordMismatch": "两次输入密码不一致"
  },
  "message": {
    "success": {
      "save": "保存成功",
      "delete": "删除成功",
      "update": "更新成功",
      "create": "创建成功",
      "languageChanged": "语言已切换为 {{language}}"
    },
    "error": {
      "save": "保存失败",
      "delete": "删除失败",
      "update": "更新失败",
      "create": "创建失败",
      "network": "网络错误，请稍后重试",
      "languageChange": "语言切换失败"
    }
  },
  "date": {
    "today": "今天",
    "yesterday": "昨天",
    "tomorrow": "明天",
    "thisWeek": "本周",
    "lastWeek": "上周",
    "nextWeek": "下周",
    "thisMonth": "本月",
    "lastMonth": "上月",
    "nextMonth": "下月",
    "thisYear": "今年",
    "lastYear": "去年",
    "nextYear": "明年"
  }
}
```

```json
// locales/en-US.json
{
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "reset": "Reset",
    "submit": "Submit",
    "loading": "Loading...",
    "noData": "No Data",
    "selectLanguage": "Select Language",
    "pressKey": "Press",
    "toSwitchLanguage": "to switch language",
    "swipeToSwitchLanguage": "Swipe to switch language",
    "autoDetectLanguage": "Auto Detect Language",
    "detectedLanguage": "Detected your language as {{language}}",
    "accept": "Accept",
    "reject": "Reject"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "users": "User Management",
    "settings": "Settings",
    "profile": "Profile",
    "logout": "Logout"
  },
  "user": {
    "title": "User Management",
    "description": "Manage system user accounts, roles and permissions",
    "username": "Username",
    "email": "Email",
    "phone": "Phone",
    "realName": "Real Name",
    "department": "Department",
    "position": "Position",
    "role": "Role",
    "status": "Status",
    "lastLogin": "Last Login",
    "createTime": "Create Time",
    "actions": "Actions",
    "view": "View",
    "edit": "Edit",
    "delete": "Delete",
    "enable": "Enable",
    "disable": "Disable",
    "addUser": "Add User",
    "editUser": "Edit User",
    "deleteConfirm": "Are you sure to delete user \"{{name}}\"?",
    "batchDeleteConfirm": "Are you sure to delete {{count}} selected users?"
  },
  "form": {
    "required": "{{field}} is required",
    "email": "Please enter a valid email address",
    "phone": "Please enter a valid phone number",
    "minLength": "{{field}} must be at least {{min}} characters",
    "maxLength": "{{field}} cannot exceed {{max}} characters",
    "passwordMismatch": "Passwords do not match"
  },
  "message": {
    "success": {
      "save": "Saved successfully",
      "delete": "Deleted successfully",
      "update": "Updated successfully",
      "create": "Created successfully",
      "languageChanged": "Language changed to {{language}}"
    },
    "error": {
      "save": "Save failed",
      "delete": "Delete failed",
      "update": "Update failed",
      "create": "Create failed",
      "network": "Network error, please try again later",
      "languageChange": "Language change failed"
    }
  },
  "date": {
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow",
    "thisWeek": "This Week",
    "lastWeek": "Last Week",
    "nextWeek": "Next Week",
    "thisMonth": "This Month",
    "lastMonth": "Last Month",
    "nextMonth": "Next Month",
    "thisYear": "This Year",
    "lastYear": "Last Year",
    "nextYear": "Next Year"
  }
}
```

#### 3.2 翻译管理工具

```typescript
// utils/translation-manager.ts
export class TranslationManager {
  private translations: Map<string, any> = new Map()
  private missingKeys: Set<string> = new Set()
  private config: TranslationConfig
  
  constructor(config: TranslationConfig) {
    this.config = config
  }
  
  // 加载翻译文件
  async loadTranslations(locale: string): Promise<void> {
    try {
      const response = await fetch(`/api/translations/${locale}`)
      const translations = await response.json()
      this.translations.set(locale, translations)
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error)
      throw error
    }
  }
  
  // 获取翻译
  getTranslation(locale: string, key: string, params?: Record<string, any>): string {
    const translations = this.translations.get(locale)
    if (!translations) {
      this.missingKeys.add(`${locale}:${key}`)
      return key
    }
    
    const value = this.getNestedValue(translations, key)
    if (value === undefined) {
      this.missingKeys.add(`${locale}:${key}`)
      return key
    }
    
    return this.interpolate(value, params)
  }
  
  // 批量更新翻译
  async updateTranslations(locale: string, updates: Record<string, any>): Promise<void> {
    try {
      await fetch(`/api/translations/${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      // 更新本地缓存
      const existing = this.translations.get(locale) || {}
      this.translations.set(locale, { ...existing, ...updates })
    } catch (error) {
      console.error('Failed to update translations:', error)
      throw error
    }
  }
  
  // 导出缺失的翻译键
  exportMissingKeys(): string[] {
    return Array.from(this.missingKeys)
  }
  
  // 清除缺失键记录
  clearMissingKeys(): void {
    this.missingKeys.clear()
  }
  
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }
  
  private interpolate(template: string, params?: Record<string, any>): string {
    if (!params) return template
    
    return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }
}

interface TranslationConfig {
  apiEndpoint: string
  cacheEnabled: boolean
  fallbackLocale: string
}
```

### 4. 动态配置系统

#### 4.1 配置管理

```typescript
// utils/config-manager.ts
export class I18nConfigManager {
  private config: I18nDynamicConfig
  private listeners: Set<(config: I18nDynamicConfig) => void> = new Set()
  
  constructor(initialConfig: I18nDynamicConfig) {
    this.config = initialConfig
  }
  
  // 获取配置
  getConfig(): I18nDynamicConfig {
    return { ...this.config }
  }
  
  // 更新配置
  updateConfig(updates: Partial<I18nDynamicConfig>): void {
    this.config = { ...this.config, ...updates }
    this.notifyListeners()
  }
  
  // 从服务器加载配置
  async loadFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/i18n/config')
      const serverConfig = await response.json()
      this.updateConfig(serverConfig)
    } catch (error) {
      console.error('Failed to load i18n config from server:', error)
    }
  }
  
  // 保存配置到服务器
  async saveToServer(): Promise<void> {
    try {
      await fetch('/api/i18n/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.config)
      })
    } catch (error) {
      console.error('Failed to save i18n config to server:', error)
      throw error
    }
  }
  
  // 添加配置变更监听器
  addListener(listener: (config: I18nDynamicConfig) => void): void {
    this.listeners.add(listener)
  }
  
  // 移除配置变更监听器
  removeListener(listener: (config: I18nDynamicConfig) => void): void {
    this.listeners.delete(listener)
  }
  
  // 通知监听器
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getConfig())
      } catch (error) {
        console.error('Error in config listener:', error)
      }
    })
  }
}

interface I18nDynamicConfig {
  defaultLocale: string
  supportedLocales: string[]
  autoDetect: boolean
  fallbackEnabled: boolean
  cacheEnabled: boolean
  lazyLoading: boolean
  rtlSupport: boolean
  dateFormat: Record<string, string>
  numberFormat: Record<string, any>
  currencyFormat: Record<string, any>
}
```

## 4. 实践练习

1. **多语言系统搭建**：
   - 实现完整的多语言架构
   - 配置动态语言切换
   - 集成 Element Plus 国际化

2. **高级功能实现**：
   - 实现语言自动检测
   - 添加 RTL 布局支持
   - 实现翻译资源懒加载

3. **用户体验优化**：
   - 实现平滑的语言切换动画
   - 添加语言切换快捷操作
   - 优化移动端语言选择体验

## 5. 学习资源

- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [Element Plus Internationalization](https://element-plus.org/zh-CN/guide/i18n.html)
- [Web Internationalization Best Practices](https://www.w3.org/International/)
- [Unicode CLDR](https://cldr.unicode.org/)

## 6. 作业

- 实现完整的多语言切换系统
- 创建动态翻译资源管理工具
- 优化多语言用户体验
- 编写多语言最佳实践文档

## 总结

通过第60天的学习，我们深入掌握了：

1. **多语言架构**：设计了完整的国际化系统架构
2. **动态切换**：实现了多种语言切换方式和用户体验
3. **资源管理**：建立了高效的翻译资源管理系统
4. **配置系统**：实现了灵活的动态配置机制

这些技能将帮助我们构建真正国际化的 Element Plus 应用。