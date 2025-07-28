# 第63天：Element Plus 无障碍设计实践与 ARIA 属性应用

## 学习目标

* 理解无障碍设计的重要性和基本原则
* 掌握 ARIA 属性在 Element Plus 中的应用
* 学习如何为组件添加无障碍支持
* 了解无障碍测试和验证方法

## 知识点概览

### 1. 无障碍设计基础

#### 1.1 无障碍设计原则

* **可感知性（Perceivable）**：信息和用户界面组件必须以用户能够感知的方式呈现
* **可操作性（Operable）**：用户界面组件和导航必须是可操作的
* **可理解性（Understandable）**：信息和用户界面的操作必须是可理解的
* **健壮性（Robust）**：内容必须足够健壮，能够被各种用户代理可靠地解释

#### 1.2 ARIA 基础概念

```typescript
// types/aria.ts
// ARIA 属性类型定义
export interface AriaAttributes {
  // 标签属性
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  
  // 状态属性
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
  'aria-checked'?: boolean | 'mixed'
  'aria-disabled'?: boolean
  'aria-hidden'?: boolean
  'aria-pressed'?: boolean | 'mixed'
  
  // 属性
  'aria-required'?: boolean
  'aria-readonly'?: boolean
  'aria-invalid'?: boolean | 'grammar' | 'spelling'
  'aria-multiselectable'?: boolean
  'aria-orientation'?: 'horizontal' | 'vertical'
  
  // 关系属性
  'aria-controls'?: string
  'aria-owns'?: string
  'aria-activedescendant'?: string
  'aria-flowto'?: string
  
  // 实时区域属性
  'aria-live'?: 'off' | 'polite' | 'assertive'
  'aria-atomic'?: boolean
  'aria-relevant'?: string
  
  // 拖放属性
  'aria-dropeffect'?: string
  'aria-grabbed'?: boolean
}

// ARIA 角色类型
export type AriaRole = 
  | 'button' | 'link' | 'menuitem' | 'tab' | 'tabpanel'
  | 'dialog' | 'alertdialog' | 'tooltip' | 'status'
  | 'alert' | 'log' | 'marquee' | 'timer'
  | 'combobox' | 'listbox' | 'option' | 'tree'
  | 'treeitem' | 'grid' | 'gridcell' | 'row'
  | 'columnheader' | 'rowheader' | 'table'
  | 'group' | 'radiogroup' | 'menu' | 'menubar'
  | 'tablist' | 'toolbar' | 'banner' | 'main'
  | 'navigation' | 'complementary' | 'contentinfo'
  | 'form' | 'search' | 'region'

// ARIA 工具类
export class AriaUtils {
  // 生成唯一 ID
  static generateId(prefix: string = 'aria'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 设置 ARIA 标签
  static setAriaLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label)
  }
  
  // 设置 ARIA 描述
  static setAriaDescription(element: HTMLElement, description: string, descriptionId?: string): void {
    const id = descriptionId || this.generateId('desc')
    element.setAttribute('aria-describedby', id)
    
    // 创建隐藏的描述元素
    let descElement = document.getElementById(id)
    if (!descElement) {
      descElement = document.createElement('div')
      descElement.id = id
      descElement.className = 'sr-only'
      descElement.textContent = description
      document.body.appendChild(descElement)
    }
  }
  
  // 设置 ARIA 状态
  static setAriaState(element: HTMLElement, state: keyof AriaAttributes, value: any): void {
    element.setAttribute(state, String(value))
  }
  
  // 移除 ARIA 属性
  static removeAriaAttribute(element: HTMLElement, attribute: keyof AriaAttributes): void {
    element.removeAttribute(attribute)
  }
  
  // 切换 ARIA 状态
  static toggleAriaState(element: HTMLElement, state: 'aria-expanded' | 'aria-selected' | 'aria-checked'): boolean {
    const currentValue = element.getAttribute(state) === 'true'
    const newValue = !currentValue
    element.setAttribute(state, String(newValue))
    return newValue
  }
}
```

### 2. Element Plus 无障碍组件开发

#### 2.1 无障碍按钮组件

```vue
<!-- AccessibleButton.vue -->
<template>
  <button
    :id="buttonId"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    :aria-pressed="ariaPressed"
    :aria-expanded="ariaExpanded"
    :aria-controls="ariaControls"
    :aria-haspopup="ariaHaspopup"
    @click="handleClick"
    @keydown="handleKeydown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <el-icon v-if="icon && iconPosition === 'left'" :class="iconClass">
      <component :is="icon" />
    </el-icon>
    
    <span v-if="$slots.default" class="button-text">
      <slot />
    </span>
    
    <el-icon v-if="icon && iconPosition === 'right'" :class="iconClass">
      <component :is="icon" />
    </el-icon>
    
    <span v-if="loading" class="loading-indicator" aria-hidden="true">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </span>
    
    <!-- 屏幕阅读器专用文本 -->
    <span v-if="srOnlyText" class="sr-only">{{ srOnlyText }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { AriaUtils } from '@/utils/aria'

interface Props {
  // 基础属性
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  loading?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
  
  // 图标属性
  icon?: any
  iconPosition?: 'left' | 'right'
  
  // 无障碍属性
  ariaLabel?: string
  ariaDescribedby?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaControls?: string
  ariaHaspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  srOnlyText?: string
  
  // 键盘导航
  tabindex?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  nativeType: 'button',
  iconPosition: 'left',
  tabindex: 0
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

// 响应式数据
const buttonId = ref(AriaUtils.generateId('btn'))
const isFocused = ref(false)

// 计算属性
const buttonClasses = computed(() => ({
  'el-button': true,
  [`el-button--${props.type}`]: props.type,
  [`el-button--${props.size}`]: props.size,
  'is-disabled': props.disabled,
  'is-loading': props.loading,
  'is-focused': isFocused.value
}))

const iconClass = computed(() => ({
  'button-icon': true,
  'button-icon--left': props.iconPosition === 'left',
  'button-icon--right': props.iconPosition === 'right'
}))

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  // 支持空格键和回车键激活按钮
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    if (!props.disabled && !props.loading) {
      emit('click', event as any)
    }
  }
  emit('keydown', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
.el-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  color: #606266;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.el-button:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.el-button:focus {
  outline: 2px solid #409eff;
  outline-offset: 2px;
}

.el-button.is-disabled {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}

.el-button.is-loading {
  pointer-events: none;
}

.button-icon {
  display: inline-flex;
  align-items: center;
}

.button-icon--left {
  margin-right: 6px;
}

.button-icon--right {
  margin-left: 6px;
}

.loading-indicator {
  margin-left: 6px;
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

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .el-button {
    border-width: 2px;
  }
  
  .el-button:focus {
    outline-width: 3px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .el-button {
    transition: none;
  }
}
</style>
```

#### 2.2 无障碍表单组件

```vue
<!-- AccessibleForm.vue -->
<template>
  <form
    :id="formId"
    :class="formClasses"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaDescribedby"
    :novalidate="novalidate"
    @submit="handleSubmit"
  >
    <fieldset v-if="legend" class="form-fieldset">
      <legend class="form-legend">{{ legend }}</legend>
      <slot />
    </fieldset>
    
    <template v-else>
      <slot />
    </template>
    
    <!-- 表单错误汇总 -->
    <div
      v-if="showErrorSummary && hasErrors"
      :id="errorSummaryId"
      class="form-error-summary"
      role="alert"
      aria-live="polite"
      tabindex="-1"
    >
      <h3 class="error-summary-title">{{ $t('form.errorSummary.title') }}</h3>
      <ul class="error-summary-list">
        <li v-for="error in errorList" :key="error.field">
          <a :href="`#${error.fieldId}`" @click="focusField(error.fieldId)">
            {{ error.message }}
          </a>
        </li>
      </ul>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, provide } from 'vue'
import { AriaUtils } from '@/utils/aria'

interface FormError {
  field: string
  fieldId: string
  message: string
}

interface Props {
  // 基础属性
  model?: Record<string, any>
  rules?: Record<string, any>
  legend?: string
  
  // 无障碍属性
  ariaLabelledby?: string
  ariaDescribedby?: string
  showErrorSummary?: boolean
  novalidate?: boolean
  
  // 布局属性
  labelPosition?: 'top' | 'left' | 'right'
  labelWidth?: string
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showErrorSummary: true,
  novalidate: true,
  labelPosition: 'top'
})

const emit = defineEmits<{
  submit: [event: Event, valid: boolean]
  validate: [field: string, valid: boolean, message?: string]
}>()

// 响应式数据
const formId = ref(AriaUtils.generateId('form'))
const errorSummaryId = ref(AriaUtils.generateId('error-summary'))
const errors = ref<Map<string, FormError>>(new Map())

// 计算属性
const formClasses = computed(() => ({
  'accessible-form': true,
  [`accessible-form--${props.labelPosition}`]: props.labelPosition,
  'accessible-form--inline': props.inline
}))

const hasErrors = computed(() => errors.value.size > 0)

const errorList = computed(() => Array.from(errors.value.values()))

// 提供给子组件的上下文
provide('formContext', {
  addError: (field: string, fieldId: string, message: string) => {
    errors.value.set(field, { field, fieldId, message })
  },
  removeError: (field: string) => {
    errors.value.delete(field)
  },
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth
})

// 方法
const handleSubmit = async (event: Event) => {
  event.preventDefault()
  
  // 清空之前的错误
  errors.value.clear()
  
  // 执行表单验证
  const valid = await validateForm()
  
  // 如果有错误，聚焦到错误汇总
  if (!valid && props.showErrorSummary) {
    nextTick(() => {
      const errorSummary = document.getElementById(errorSummaryId.value)
      errorSummary?.focus()
    })
  }
  
  emit('submit', event, valid)
}

const validateForm = async (): Promise<boolean> => {
  // 这里应该实现实际的表单验证逻辑
  // 暂时返回 true
  return true
}

const focusField = (fieldId: string) => {
  const field = document.getElementById(fieldId)
  field?.focus()
}
</script>

<style scoped>
.accessible-form {
  max-width: 600px;
}

.form-fieldset {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  margin: 0 0 20px 0;
}

.form-legend {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  padding: 0 10px;
}

.form-error-summary {
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
}

.error-summary-title {
  color: #f56c6c;
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.error-summary-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.error-summary-list li {
  margin-bottom: 8px;
}

.error-summary-list a {
  color: #f56c6c;
  text-decoration: none;
}

.error-summary-list a:hover,
.error-summary-list a:focus {
  text-decoration: underline;
}

/* 标签位置样式 */
.accessible-form--left .form-item {
  display: flex;
  align-items: flex-start;
}

.accessible-form--right .form-item {
  display: flex;
  align-items: flex-start;
  flex-direction: row-reverse;
}

.accessible-form--inline {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
```

#### 2.3 无障碍表单项组件

```vue
<!-- AccessibleFormItem.vue -->
<template>
  <div :class="formItemClasses">
    <label
      v-if="label"
      :for="inputId"
      :class="labelClasses"
      :style="labelStyle"
    >
      {{ label }}
      <span v-if="required" class="required-indicator" aria-label="必填">*</span>
    </label>
    
    <div class="form-item-content">
      <div class="form-item-control">
        <slot :input-id="inputId" :aria-describedby="ariaDescribedby" />
      </div>
      
      <!-- 帮助文本 -->
      <div
        v-if="help"
        :id="helpId"
        class="form-item-help"
        :aria-live="helpLive"
      >
        {{ help }}
      </div>
      
      <!-- 错误信息 -->
      <div
        v-if="error"
        :id="errorId"
        class="form-item-error"
        role="alert"
        aria-live="polite"
      >
        <el-icon class="error-icon">
          <WarningFilled />
        </el-icon>
        {{ error }}
      </div>
      
      <!-- 成功信息 -->
      <div
        v-if="success"
        :id="successId"
        class="form-item-success"
        role="status"
        aria-live="polite"
      >
        <el-icon class="success-icon">
          <SuccessFilled />
        </el-icon>
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { WarningFilled, SuccessFilled } from '@element-plus/icons-vue'
import { AriaUtils } from '@/utils/aria'

interface Props {
  label?: string
  required?: boolean
  error?: string
  success?: string
  help?: string
  helpLive?: 'off' | 'polite' | 'assertive'
  prop?: string
}

const props = withDefaults(defineProps<Props>(), {
  helpLive: 'polite'
})

// 注入表单上下文
const formContext = inject('formContext', {
  addError: () => {},
  removeError: () => {},
  labelPosition: 'top',
  labelWidth: undefined
})

// 响应式数据
const inputId = ref(AriaUtils.generateId('input'))
const helpId = ref(AriaUtils.generateId('help'))
const errorId = ref(AriaUtils.generateId('error'))
const successId = ref(AriaUtils.generateId('success'))

// 计算属性
const formItemClasses = computed(() => ({
  'form-item': true,
  'form-item--error': !!props.error,
  'form-item--success': !!props.success,
  'form-item--required': props.required
}))

const labelClasses = computed(() => ({
  'form-item-label': true,
  [`form-item-label--${formContext.labelPosition}`]: formContext.labelPosition
}))

const labelStyle = computed(() => {
  if (formContext.labelPosition === 'left' && formContext.labelWidth) {
    return { width: formContext.labelWidth }
  }
  return {}
})

const ariaDescribedby = computed(() => {
  const ids = []
  if (props.help) ids.push(helpId.value)
  if (props.error) ids.push(errorId.value)
  if (props.success) ids.push(successId.value)
  return ids.join(' ') || undefined
})

// 监听错误状态变化
watch(() => props.error, (newError, oldError) => {
  if (props.prop) {
    if (newError) {
      formContext.addError(props.prop, inputId.value, newError)
    } else if (oldError) {
      formContext.removeError(props.prop)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.form-item {
  margin-bottom: 20px;
}

.form-item-label {
  display: block;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.form-item-label--left {
  text-align: right;
  padding-right: 12px;
  margin-bottom: 0;
  line-height: 32px;
}

.form-item-label--right {
  text-align: left;
  padding-left: 12px;
  margin-bottom: 0;
  line-height: 32px;
}

.required-indicator {
  color: #f56c6c;
  margin-left: 4px;
}

.form-item-content {
  flex: 1;
}

.form-item-control {
  position: relative;
}

.form-item-help {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

.form-item-error {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #f56c6c;
  margin-top: 4px;
  line-height: 1.4;
}

.form-item-success {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #67c23a;
  margin-top: 4px;
  line-height: 1.4;
}

.error-icon,
.success-icon {
  margin-right: 4px;
  font-size: 14px;
}

/* 错误状态样式 */
.form-item--error .form-item-control :deep(.el-input__wrapper) {
  border-color: #f56c6c;
}

.form-item--error .form-item-control :deep(.el-input__wrapper):hover {
  border-color: #f56c6c;
}

.form-item--error .form-item-control :deep(.el-input__wrapper.is-focus) {
  border-color: #f56c6c;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
}

/* 成功状态样式 */
.form-item--success .form-item-control :deep(.el-input__wrapper) {
  border-color: #67c23a;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .form-item-error {
    font-weight: bold;
  }
  
  .form-item--error .form-item-control :deep(.el-input__wrapper) {
    border-width: 2px;
  }
}
</style>
```

### 3. 键盘导航支持

```typescript
// composables/useKeyboardNavigation.ts
import { ref, onMounted, onUnmounted } from 'vue'

export interface KeyboardNavigationOptions {
  container?: HTMLElement | string
  focusableSelector?: string
  loop?: boolean
  autoFocus?: boolean
  skipHidden?: boolean
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    container,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    loop = true,
    autoFocus = false,
    skipHidden = true
  } = options
  
  const currentFocusIndex = ref(-1)
  const focusableElements = ref<HTMLElement[]>([])
  
  // 获取可聚焦元素
  const updateFocusableElements = () => {
    const containerEl = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container || document.body
    
    if (!containerEl) return
    
    const elements = Array.from(
      containerEl.querySelectorAll(focusableSelector)
    ) as HTMLElement[]
    
    focusableElements.value = elements.filter(el => {
      if (skipHidden && (el.offsetParent === null || el.hidden)) {
        return false
      }
      return !el.disabled && el.tabIndex !== -1
    })
  }
  
  // 聚焦到指定索引的元素
  const focusElement = (index: number) => {
    if (index < 0 || index >= focusableElements.value.length) return
    
    const element = focusableElements.value[index]
    element.focus()
    currentFocusIndex.value = index
  }
  
  // 聚焦到下一个元素
  const focusNext = () => {
    updateFocusableElements()
    
    let nextIndex = currentFocusIndex.value + 1
    
    if (nextIndex >= focusableElements.value.length) {
      nextIndex = loop ? 0 : focusableElements.value.length - 1
    }
    
    focusElement(nextIndex)
  }
  
  // 聚焦到上一个元素
  const focusPrevious = () => {
    updateFocusableElements()
    
    let prevIndex = currentFocusIndex.value - 1
    
    if (prevIndex < 0) {
      prevIndex = loop ? focusableElements.value.length - 1 : 0
    }
    
    focusElement(prevIndex)
  }
  
  // 聚焦到第一个元素
  const focusFirst = () => {
    updateFocusableElements()
    focusElement(0)
  }
  
  // 聚焦到最后一个元素
  const focusLast = () => {
    updateFocusableElements()
    focusElement(focusableElements.value.length - 1)
  }
  
  // 键盘事件处理
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        focusNext()
        break
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        focusPrevious()
        break
        
      case 'Home':
        event.preventDefault()
        focusFirst()
        break
        
      case 'End':
        event.preventDefault()
        focusLast()
        break
        
      case 'Tab':
        // 让浏览器处理 Tab 键
        updateCurrentFocusIndex()
        break
    }
  }
  
  // 更新当前聚焦索引
  const updateCurrentFocusIndex = () => {
    const activeElement = document.activeElement as HTMLElement
    const index = focusableElements.value.indexOf(activeElement)
    currentFocusIndex.value = index
  }
  
  // 初始化
  onMounted(() => {
    updateFocusableElements()
    
    if (autoFocus && focusableElements.value.length > 0) {
      focusFirst()
    }
    
    // 监听键盘事件
    document.addEventListener('keydown', handleKeydown)
    
    // 监听焦点变化
    document.addEventListener('focusin', updateCurrentFocusIndex)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('focusin', updateCurrentFocusIndex)
  })
  
  return {
    focusableElements,
    currentFocusIndex,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
    focusElement,
    updateFocusableElements
  }
}
```

## 实践练习

### 练习 1：创建无障碍数据表格

开发一个完全无障碍的数据表格组件：
1. 支持键盘导航
2. 屏幕阅读器友好
3. 排序和筛选的无障碍支持

### 练习 2：实现无障碍模态对话框

构建一个符合 ARIA 规范的模态对话框：
1. 焦点管理
2. 键盘陷阱
3. ESC 键关闭

### 练习 3：开发无障碍导航菜单

设计一个多级导航菜单：
1. 键盘导航支持
2. ARIA 状态管理
3. 屏幕阅读器公告

## 学习资源

* [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
* [ARIA 规范](https://www.w3.org/TR/wai-aria-1.1/)
* [MDN 无障碍指南](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility)
* [Element Plus 无障碍文档](https://element-plus.org/zh-CN/guide/accessibility.html)

## 作业

1. 完成所有实践练习
2. 使用屏幕阅读器测试你的组件
3. 进行键盘导航测试
4. 编写无障碍测试用例

## 下一步学习计划

接下来我们将学习 **Element Plus 键盘导航与屏幕阅读器支持**，深入了解如何优化键盘操作体验和屏幕阅读器的兼容性。