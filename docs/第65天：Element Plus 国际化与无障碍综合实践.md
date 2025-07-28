# 第65天：Element Plus 国际化与无障碍综合实践

## 学习目标

* 综合应用国际化和无障碍设计知识
* 构建多语言无障碍应用的完整解决方案
* 掌握国际化与无障碍的最佳实践
* 学习测试和验证方法

## 知识点概览

### 1. 国际化与无障碍集成架构

#### 1.1 整体架构设计

```typescript
// types/i18n-a11y.ts
// 国际化无障碍集成类型定义
export interface I18nA11yConfig {
  // 语言配置
  defaultLocale: string
  supportedLocales: string[]
  fallbackLocale: string
  
  // 无障碍配置
  enableScreenReader: boolean
  enableKeyboardNavigation: boolean
  enableHighContrast: boolean
  enableReducedMotion: boolean
  
  // RTL 支持
  rtlLocales: string[]
  autoDetectDirection: boolean
  
  // 字体和排版
  fontScaling: boolean
  lineHeightAdjustment: boolean
}

export interface LocaleA11yData {
  locale: string
  direction: 'ltr' | 'rtl'
  screenReaderMessages: Record<string, string>
  keyboardShortcuts: Record<string, string>
  ariaLabels: Record<string, string>
  dateFormats: {
    short: string
    medium: string
    long: string
    full: string
  }
  numberFormats: {
    decimal: Intl.NumberFormatOptions
    currency: Intl.NumberFormatOptions
    percent: Intl.NumberFormatOptions
  }
}

// 国际化无障碍管理器
export class I18nA11yManager {
  private config: I18nA11yConfig
  private currentLocale: string
  private localeData: Map<string, LocaleA11yData> = new Map()
  private screenReaderManager: ScreenReaderManager
  private keyboardManager: KeyboardNavigationManager
  
  constructor(config: I18nA11yConfig) {
    this.config = config
    this.currentLocale = config.defaultLocale
    this.screenReaderManager = ScreenReaderManager.getInstance()
    this.keyboardManager = new KeyboardNavigationManager(document.body)
    
    this.initialize()
  }
  
  // 初始化
  private async initialize(): Promise<void> {
    // 加载语言数据
    await this.loadLocaleData(this.currentLocale)
    
    // 设置文档属性
    this.updateDocumentAttributes()
    
    // 初始化无障碍功能
    this.initializeAccessibility()
    
    // 监听用户偏好变化
    this.listenToUserPreferences()
  }
  
  // 加载语言数据
  private async loadLocaleData(locale: string): Promise<void> {
    try {
      const data = await import(`@/locales/${locale}/a11y.json`)
      this.localeData.set(locale, data.default)
    } catch (error) {
      console.warn(`Failed to load locale data for ${locale}`, error)
      // 使用回退语言
      if (locale !== this.config.fallbackLocale) {
        await this.loadLocaleData(this.config.fallbackLocale)
      }
    }
  }
  
  // 更新文档属性
  private updateDocumentAttributes(): void {
    const localeData = this.localeData.get(this.currentLocale)
    if (!localeData) return
    
    // 设置语言和方向
    document.documentElement.lang = this.currentLocale
    document.documentElement.dir = localeData.direction
    
    // 设置无障碍属性
    if (this.config.enableScreenReader) {
      document.documentElement.setAttribute('data-screen-reader', 'enabled')
    }
    
    if (this.config.enableKeyboardNavigation) {
      document.documentElement.setAttribute('data-keyboard-navigation', 'enabled')
    }
  }
  
  // 初始化无障碍功能
  private initializeAccessibility(): void {
    if (this.config.enableScreenReader) {
      this.setupScreenReaderSupport()
    }
    
    if (this.config.enableKeyboardNavigation) {
      this.setupKeyboardNavigation()
    }
    
    if (this.config.enableHighContrast) {
      this.setupHighContrastSupport()
    }
    
    if (this.config.enableReducedMotion) {
      this.setupReducedMotionSupport()
    }
  }
  
  // 设置屏幕阅读器支持
  private setupScreenReaderSupport(): void {
    const localeData = this.localeData.get(this.currentLocale)
    if (!localeData) return
    
    // 公告语言变化
    this.screenReaderManager.announce({
      message: localeData.screenReaderMessages.languageChanged || `Language changed to ${this.currentLocale}`,
      priority: 'polite'
    })
  }
  
  // 设置键盘导航
  private setupKeyboardNavigation(): void {
    const localeData = this.localeData.get(this.currentLocale)
    if (!localeData) return
    
    // 注册本地化的键盘快捷键
    Object.entries(localeData.keyboardShortcuts).forEach(([key, description]) => {
      // 这里可以注册具体的快捷键处理
    })
  }
  
  // 设置高对比度支持
  private setupHighContrastSupport(): void {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute('data-high-contrast', e.matches.toString())
    }
    
    mediaQuery.addListener(handleContrastChange)
    handleContrastChange({ matches: mediaQuery.matches } as MediaQueryListEvent)
  }
  
  // 设置减少动画支持
  private setupReducedMotionSupport(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute('data-reduced-motion', e.matches.toString())
    }
    
    mediaQuery.addListener(handleMotionChange)
    handleMotionChange({ matches: mediaQuery.matches } as MediaQueryListEvent)
  }
  
  // 监听用户偏好变化
  private listenToUserPreferences(): void {
    // 监听语言偏好变化
    window.addEventListener('languagechange', () => {
      const newLocale = navigator.language.split('-')[0]
      if (this.config.supportedLocales.includes(newLocale)) {
        this.setLocale(newLocale)
      }
    })
  }
  
  // 设置语言
  async setLocale(locale: string): Promise<void> {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`Locale ${locale} is not supported`)
      return
    }
    
    // 加载新语言数据
    await this.loadLocaleData(locale)
    
    this.currentLocale = locale
    this.updateDocumentAttributes()
    
    // 重新初始化无障碍功能
    this.initializeAccessibility()
    
    // 触发语言变化事件
    window.dispatchEvent(new CustomEvent('localechange', {
      detail: { locale, direction: this.getDirection() }
    }))
  }
  
  // 获取当前语言
  getLocale(): string {
    return this.currentLocale
  }
  
  // 获取文本方向
  getDirection(): 'ltr' | 'rtl' {
    return this.config.rtlLocales.includes(this.currentLocale) ? 'rtl' : 'ltr'
  }
  
  // 获取本地化的 ARIA 标签
  getAriaLabel(key: string, fallback?: string): string {
    const localeData = this.localeData.get(this.currentLocale)
    return localeData?.ariaLabels[key] || fallback || key
  }
  
  // 获取屏幕阅读器消息
  getScreenReaderMessage(key: string, fallback?: string): string {
    const localeData = this.localeData.get(this.currentLocale)
    return localeData?.screenReaderMessages[key] || fallback || key
  }
  
  // 格式化日期
  formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
    const localeData = this.localeData.get(this.currentLocale)
    const formatString = localeData?.dateFormats[format]
    
    if (formatString) {
      return dayjs(date).locale(this.currentLocale).format(formatString)
    }
    
    return new Intl.DateTimeFormat(this.currentLocale).format(date)
  }
  
  // 格式化数字
  formatNumber(number: number, type: 'decimal' | 'currency' | 'percent' = 'decimal', currency?: string): string {
    const localeData = this.localeData.get(this.currentLocale)
    let options = localeData?.numberFormats[type] || {}
    
    if (type === 'currency' && currency) {
      options = { ...options, currency }
    }
    
    return new Intl.NumberFormat(this.currentLocale, options).format(number)
  }
}
```

### 2. 多语言无障碍组件库

#### 2.1 国际化无障碍表单组件

```vue
<!-- I18nA11yForm.vue -->
<template>
  <form
    :id="formId"
    :class="formClasses"
    :dir="direction"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    @submit="handleSubmit"
  >
    <!-- 表单标题 -->
    <h2 :id="titleId" class="form-title">
      {{ $t(titleKey) }}
    </h2>
    
    <!-- 表单描述 -->
    <p :id="descriptionId" class="form-description">
      {{ $t(descriptionKey) }}
    </p>
    
    <!-- 语言切换器 -->
    <div class="language-switcher">
      <label :for="languageSelectId" class="language-label">
        {{ getAriaLabel('selectLanguage') }}
      </label>
      <el-select
        :id="languageSelectId"
        v-model="currentLocale"
        @change="handleLocaleChange"
        :aria-label="getAriaLabel('selectLanguage')"
      >
        <el-option
          v-for="locale in supportedLocales"
          :key="locale.code"
          :label="locale.nativeName"
          :value="locale.code"
          :aria-label="`${locale.name} (${locale.nativeName})`"
        />
      </el-select>
    </div>
    
    <!-- 无障碍设置 -->
    <fieldset class="accessibility-settings">
      <legend>{{ getAriaLabel('accessibilitySettings') }}</legend>
      
      <div class="setting-group">
        <el-checkbox
          v-model="a11ySettings.highContrast"
          @change="handleA11ySettingChange('highContrast', $event)"
        >
          {{ getAriaLabel('enableHighContrast') }}
        </el-checkbox>
      </div>
      
      <div class="setting-group">
        <el-checkbox
          v-model="a11ySettings.reducedMotion"
          @change="handleA11ySettingChange('reducedMotion', $event)"
        >
          {{ getAriaLabel('enableReducedMotion') }}
        </el-checkbox>
      </div>
      
      <div class="setting-group">
        <el-checkbox
          v-model="a11ySettings.screenReaderMode"
          @change="handleA11ySettingChange('screenReaderMode', $event)"
        >
          {{ getAriaLabel('enableScreenReaderMode') }}
        </el-checkbox>
      </div>
      
      <div class="setting-group">
        <label :for="fontSizeId" class="font-size-label">
          {{ getAriaLabel('fontSize') }}
        </label>
        <el-slider
          :id="fontSizeId"
          v-model="a11ySettings.fontSize"
          :min="12"
          :max="24"
          :step="2"
          :format-tooltip="formatFontSizeTooltip"
          @change="handleFontSizeChange"
          :aria-label="getAriaLabel('fontSize')"
        />
      </div>
    </fieldset>
    
    <!-- 表单字段 -->
    <div class="form-fields">
      <I18nA11yFormItem
        v-for="field in formFields"
        :key="field.name"
        :field="field"
        :model-value="formData[field.name]"
        :error="errors[field.name]"
        @update:model-value="updateField(field.name, $event)"
        @validate="handleFieldValidate"
      />
    </div>
    
    <!-- 表单操作 -->
    <div class="form-actions" :class="{ 'rtl-actions': direction === 'rtl' }">
      <el-button
        type="primary"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        @click="handleSubmit"
        :aria-describedby="submitButtonDescId"
      >
        {{ $t('common.submit') }}
      </el-button>
      
      <el-button
        @click="handleReset"
        :aria-describedby="resetButtonDescId"
      >
        {{ $t('common.reset') }}
      </el-button>
      
      <el-button
        @click="handleCancel"
        :aria-describedby="cancelButtonDescId"
      >
        {{ $t('common.cancel') }}
      </el-button>
    </div>
    
    <!-- 按钮描述（屏幕阅读器） -->
    <div class="sr-only">
      <div :id="submitButtonDescId">
        {{ getScreenReaderMessage('submitButtonDescription') }}
      </div>
      <div :id="resetButtonDescId">
        {{ getScreenReaderMessage('resetButtonDescription') }}
      </div>
      <div :id="cancelButtonDescId">
        {{ getScreenReaderMessage('cancelButtonDescription') }}
      </div>
    </div>
    
    <!-- 表单状态公告区域 -->
    <div
      :id="statusId"
      class="form-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ statusMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useI18nA11y } from '@/composables/useI18nA11y'
import { AriaUtils } from '@/utils/aria'
import I18nA11yFormItem from './I18nA11yFormItem.vue'

interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio'
  labelKey: string
  placeholderKey?: string
  required?: boolean
  options?: Array<{ value: any; labelKey: string }>
  validation?: (value: any) => string | null
}

interface Props {
  titleKey: string
  descriptionKey: string
  fields: FormField[]
  initialData?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({})
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
  reset: []
}>()

const { t, locale } = useI18n()
const {
  i18nA11yManager,
  direction,
  getAriaLabel,
  getScreenReaderMessage,
  announce
} = useI18nA11y()

// 响应式数据
const formId = ref(AriaUtils.generateId('form'))
const titleId = ref(AriaUtils.generateId('title'))
const descriptionId = ref(AriaUtils.generateId('desc'))
const languageSelectId = ref(AriaUtils.generateId('lang-select'))
const fontSizeId = ref(AriaUtils.generateId('font-size'))
const statusId = ref(AriaUtils.generateId('status'))
const submitButtonDescId = ref(AriaUtils.generateId('submit-desc'))
const resetButtonDescId = ref(AriaUtils.generateId('reset-desc'))
const cancelButtonDescId = ref(AriaUtils.generateId('cancel-desc'))

const currentLocale = ref(locale.value)
const formData = ref<Record<string, any>>({ ...props.initialData })
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const statusMessage = ref('')

// 无障碍设置
const a11ySettings = ref({
  highContrast: false,
  reducedMotion: false,
  screenReaderMode: false,
  fontSize: 16
})

// 支持的语言
const supportedLocales = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'fr', name: 'French', nativeName: 'Français' }
]

// 计算属性
const formClasses = computed(() => ({
  'i18n-a11y-form': true,
  [`i18n-a11y-form--${direction.value}`]: true,
  'i18n-a11y-form--high-contrast': a11ySettings.value.highContrast,
  'i18n-a11y-form--reduced-motion': a11ySettings.value.reducedMotion,
  'i18n-a11y-form--screen-reader': a11ySettings.value.screenReaderMode
}))

const formFields = computed(() => props.fields)

const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 && 
         formFields.value.every(field => {
           if (field.required) {
             const value = formData.value[field.name]
             return value !== undefined && value !== null && value !== ''
           }
           return true
         })
})

// 方法
const handleLocaleChange = async (newLocale: string) => {
  await i18nA11yManager.setLocale(newLocale)
  locale.value = newLocale
  
  announce(getScreenReaderMessage('languageChanged', `Language changed to ${newLocale}`))
  
  // 更新状态消息
  statusMessage.value = getScreenReaderMessage('languageChanged', `Language changed to ${newLocale}`)
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

const handleA11ySettingChange = (setting: keyof typeof a11ySettings.value, value: boolean) => {
  a11ySettings.value[setting] = value
  
  // 应用设置到文档
  switch (setting) {
    case 'highContrast':
      document.documentElement.setAttribute('data-high-contrast', value.toString())
      break
    case 'reducedMotion':
      document.documentElement.setAttribute('data-reduced-motion', value.toString())
      break
    case 'screenReaderMode':
      document.documentElement.setAttribute('data-screen-reader-mode', value.toString())
      break
  }
  
  const settingName = getAriaLabel(setting)
  const statusText = value 
    ? getScreenReaderMessage('settingEnabled', `${settingName} enabled`)
    : getScreenReaderMessage('settingDisabled', `${settingName} disabled`)
  
  announce(statusText)
}

const handleFontSizeChange = (size: number) => {
  document.documentElement.style.fontSize = `${size}px`
  announce(getScreenReaderMessage('fontSizeChanged', `Font size changed to ${size}px`))
}

const formatFontSizeTooltip = (value: number) => {
  return `${value}px`
}

const updateField = (fieldName: string, value: any) => {
  formData.value[fieldName] = value
  
  // 清除该字段的错误
  if (errors.value[fieldName]) {
    delete errors.value[fieldName]
  }
}

const handleFieldValidate = (fieldName: string, error: string | null) => {
  if (error) {
    errors.value[fieldName] = error
  } else {
    delete errors.value[fieldName]
  }
}

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {}
  
  formFields.value.forEach(field => {
    const value = formData.value[field.name]
    
    // 必填验证
    if (field.required && (!value || value === '')) {
      newErrors[field.name] = t('validation.required', { field: t(field.labelKey) })
      return
    }
    
    // 自定义验证
    if (field.validation && value) {
      const error = field.validation(value)
      if (error) {
        newErrors[field.name] = error
      }
    }
  })
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async (event?: Event) => {
  if (event) {
    event.preventDefault()
  }
  
  if (!validateForm()) {
    const errorCount = Object.keys(errors.value).length
    const errorMessage = getScreenReaderMessage('formValidationFailed', 
      `Form validation failed. ${errorCount} errors found.`)
    
    announce(errorMessage, 'assertive')
    statusMessage.value = errorMessage
    
    // 聚焦到第一个错误字段
    const firstErrorField = Object.keys(errors.value)[0]
    if (firstErrorField) {
      const fieldElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
      fieldElement?.focus()
    }
    
    return
  }
  
  isSubmitting.value = true
  
  try {
    emit('submit', { ...formData.value })
    
    const successMessage = getScreenReaderMessage('formSubmitted', 'Form submitted successfully')
    announce(successMessage)
    statusMessage.value = successMessage
  } catch (error) {
    const errorMessage = getScreenReaderMessage('formSubmitError', 'Form submission failed')
    announce(errorMessage, 'assertive')
    statusMessage.value = errorMessage
  } finally {
    isSubmitting.value = false
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

const handleReset = () => {
  formData.value = { ...props.initialData }
  errors.value = {}
  
  const resetMessage = getScreenReaderMessage('formReset', 'Form has been reset')
  announce(resetMessage)
  statusMessage.value = resetMessage
  
  emit('reset')
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

const handleCancel = () => {
  emit('cancel')
}

// 监听语言变化
watch(currentLocale, (newLocale) => {
  if (newLocale !== locale.value) {
    handleLocaleChange(newLocale)
  }
})

// 初始化
onMounted(() => {
  // 从用户偏好加载无障碍设置
  const savedSettings = localStorage.getItem('a11y-settings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      a11ySettings.value = { ...a11ySettings.value, ...parsed }
      
      // 应用保存的设置
      Object.entries(parsed).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          handleA11ySettingChange(key as any, value)
        } else if (key === 'fontSize') {
          handleFontSizeChange(value as number)
        }
      })
    } catch (error) {
      console.warn('Failed to load accessibility settings', error)
    }
  }
})

// 保存无障碍设置
watch(a11ySettings, (newSettings) => {
  localStorage.setItem('a11y-settings', JSON.stringify(newSettings))
}, { deep: true })
</script>

<style scoped>
.i18n-a11y-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: var(--el-font-family);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.form-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 20px;
  line-height: 1.5;
}

.language-switcher {
  margin-bottom: 20px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
}

.language-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.accessibility-settings {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  background: var(--el-bg-color);
}

.accessibility-settings legend {
  font-weight: bold;
  font-size: 16px;
  color: var(--el-text-color-primary);
  padding: 0 8px;
}

.setting-group {
  margin-bottom: 16px;
}

.font-size-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.form-fields {
  margin-bottom: 30px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.rtl-actions {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.form-status {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
  font-size: 14px;
  min-height: 20px;
}

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

/* RTL 支持 */
.i18n-a11y-form--rtl {
  direction: rtl;
  text-align: right;
}

.i18n-a11y-form--rtl .form-actions {
  justify-content: flex-start;
}

/* 高对比度模式 */
.i18n-a11y-form--high-contrast {
  --el-border-color: #000;
  --el-text-color-primary: #000;
  --el-bg-color: #fff;
}

.i18n-a11y-form--high-contrast .accessibility-settings {
  border-width: 2px;
}

/* 减少动画模式 */
.i18n-a11y-form--reduced-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* 屏幕阅读器模式 */
.i18n-a11y-form--screen-reader {
  font-size: 18px;
  line-height: 1.6;
}

.i18n-a11y-form--screen-reader .form-title {
  font-size: 28px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .i18n-a11y-form {
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .rtl-actions {
    flex-direction: column;
  }
}

/* 打印样式 */
@media print {
  .language-switcher,
  .accessibility-settings,
  .form-actions {
    display: none;
  }
}
</style>
```

### 3. 测试和验证工具

#### 3.1 自动化无障碍测试

```typescript
// tests/a11y-test-utils.ts
import { axe, toHaveNoViolations } from 'jest-axe'
import { mount, VueWrapper } from '@vue/test-utils'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

export interface A11yTestOptions {
  rules?: Record<string, any>
  tags?: string[]
  locale?: string
  screenReaderMode?: boolean
}

export class A11yTestRunner {
  // 运行无障碍测试
  static async runA11yTest(
    component: any,
    props: Record<string, any> = {},
    options: A11yTestOptions = {}
  ): Promise<void> {
    const wrapper = mount(component, {
      props,
      global: {
        plugins: [
          // 添加必要的插件
        ]
      }
    })
    
    // 等待组件渲染完成
    await wrapper.vm.$nextTick()
    
    // 配置 axe 规则
    const axeConfig = {
      rules: options.rules || {},
      tags: options.tags || ['wcag2a', 'wcag2aa', 'wcag21aa']
    }
    
    // 运行 axe 测试
    const results = await axe(wrapper.element, axeConfig)
    
    // 断言没有违规
    expect(results).toHaveNoViolations()
    
    wrapper.unmount()
  }
  
  // 测试键盘导航
  static async testKeyboardNavigation(
    wrapper: VueWrapper<any>,
    expectedFocusSequence: string[]
  ): Promise<void> {
    const focusableElements = wrapper.findAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    // 模拟 Tab 键导航
    for (let i = 0; i < expectedFocusSequence.length; i++) {
      const element = focusableElements[i]
      await element.trigger('focus')
      
      expect(document.activeElement).toBe(element.element)
      
      // 检查元素是否有正确的 aria 属性
      const expectedSelector = expectedFocusSequence[i]
      expect(element.element.matches(expectedSelector)).toBe(true)
    }
  }
  
  // 测试屏幕阅读器支持
  static testScreenReaderSupport(wrapper: VueWrapper<any>): void {
    // 检查 ARIA 标签
    const elementsWithAriaLabel = wrapper.findAll('[aria-label]')
    elementsWithAriaLabel.forEach(element => {
      const ariaLabel = element.attributes('aria-label')
      expect(ariaLabel).toBeTruthy()
      expect(ariaLabel.length).toBeGreaterThan(0)
    })
    
    // 检查 ARIA 描述
    const elementsWithAriaDescribedby = wrapper.findAll('[aria-describedby]')
    elementsWithAriaDescribedby.forEach(element => {
      const describedbyId = element.attributes('aria-describedby')
      const descriptionElement = wrapper.find(`#${describedbyId}`)
      expect(descriptionElement.exists()).toBe(true)
    })
    
    // 检查实时区域
    const liveRegions = wrapper.findAll('[aria-live]')
    liveRegions.forEach(region => {
      const liveValue = region.attributes('aria-live')
      expect(['polite', 'assertive', 'off']).toContain(liveValue)
    })
  }
  
  // 测试多语言支持
  static async testI18nSupport(
    component: any,
    props: Record<string, any>,
    locales: string[]
  ): Promise<void> {
    for (const locale of locales) {
      const wrapper = mount(component, {
        props: { ...props, locale },
        global: {
          plugins: [
            // 配置 i18n 插件
          ]
        }
      })
      
      await wrapper.vm.$nextTick()
      
      // 检查文档语言属性
      expect(document.documentElement.lang).toBe(locale)
      
      // 检查文本方向
      const isRTL = ['ar', 'he', 'fa'].includes(locale)
      expect(document.documentElement.dir).toBe(isRTL ? 'rtl' : 'ltr')
      
      // 运行无障碍测试
      await this.runA11yTest(component, { ...props, locale })
      
      wrapper.unmount()
    }
  }
}

// 测试用例示例
describe('I18nA11yForm', () => {
  it('should pass accessibility tests', async () => {
    await A11yTestRunner.runA11yTest(I18nA11yForm, {
      titleKey: 'form.title',
      descriptionKey: 'form.description',
      fields: [
        {
          name: 'name',
          type: 'text',
          labelKey: 'form.name',
          required: true
        }
      ]
    })
  })
  
  it('should support keyboard navigation', async () => {
    const wrapper = mount(I18nA11yForm, {
      props: {
        titleKey: 'form.title',
        descriptionKey: 'form.description',
        fields: [
          {
            name: 'name',
            type: 'text',
            labelKey: 'form.name',
            required: true
          }
        ]
      }
    })
    
    await A11yTestRunner.testKeyboardNavigation(wrapper, [
      'select[aria-label*="language"]',
      'input[type="checkbox"]',
      'input[name="name"]',
      'button[type="submit"]'
    ])
  })
  
  it('should support multiple locales', async () => {
    await A11yTestRunner.testI18nSupport(
      I18nA11yForm,
      {
        titleKey: 'form.title',
        descriptionKey: 'form.description',
        fields: []
      },
      ['en', 'zh-cn', 'ar', 'ja']
    )
  })
  
  it('should have proper screen reader support', () => {
    const wrapper = mount(I18nA11yForm, {
      props: {
        titleKey: 'form.title',
        descriptionKey: 'form.description',
        fields: []
      }
    })
    
    A11yTestRunner.testScreenReaderSupport(wrapper)
  })
})
```

## 实践练习

### 练习 1：构建多语言无障碍导航菜单

创建一个支持多语言和完整无障碍功能的导航菜单：
1. 多级菜单结构
2. 键盘导航支持
3. 屏幕阅读器友好
4. RTL 布局支持

### 练习 2：开发国际化数据可视化组件

构建一个图表组件，支持：
1. 多语言标签和说明
2. 数字和日期本地化
3. 无障碍数据表格替代
4. 键盘操作支持

### 练习 3：实现完整的用户设置面板

设计一个用户偏好设置界面：
1. 语言选择
2. 无障碍选项配置
3. 主题和显示设置
4. 设置的持久化存储

## 学习资源

* [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
* [ARIA Authoring Practices Guide](https://www.w3.org/TR/wai-aria-practices-1.1/)
* [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
* [axe-core 无障碍测试工具](https://github.com/dequelabs/axe-core)

## 作业

1. 完成所有实践练习
2. 创建一个完整的多语言无障碍应用
3. 编写全面的无障碍测试套件
4. 进行真实用户的可用性测试

## 下一步学习计划

接下来我们将学习 **Element Plus 开发流程与代码规范**，了解如何参与 Element Plus 的开源开发，包括代码规范、提交流程和最佳实践。