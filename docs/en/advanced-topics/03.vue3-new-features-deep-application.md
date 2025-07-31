# Vue 3 New Features Deep Application

## Overview

This document explores how Element Plus leverages Vue 3's new features to provide enhanced performance, better developer experience, and more flexible component architecture. We'll examine the practical applications of Composition API, Teleport, Fragments, Suspense, and other Vue 3 innovations within Element Plus components.

## Composition API Deep Dive

### 1. Advanced Composables Architecture

Element Plus extensively uses the Composition API to create reusable logic and maintain clean component architecture.

```typescript
// Advanced form validation composable
import { ref, computed, watch, reactive, toRefs } from 'vue'
import type { Ref, ComputedRef } from 'vue'

interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
  message?: string
  trigger?: 'blur' | 'change' | 'input'
}

interface ValidationResult {
  valid: boolean
  message: string
}

interface UseValidationOptions {
  immediate?: boolean
  debounce?: number
  validateOnMount?: boolean
}

export function useValidation<T = any>(
  value: Ref<T>,
  rules: ValidationRule[],
  options: UseValidationOptions = {}
) {
  const { immediate = false, debounce = 0, validateOnMount = false } = options
  
  const validationState = reactive({
    valid: true,
    message: '',
    pending: false,
    touched: false,
    dirty: false
  })
  
  const initialValue = ref(value.value)
  
  // Track if field has been touched
  const markTouched = () => {
    validationState.touched = true
  }
  
  // Track if field value has changed
  watch(value, (newValue) => {
    if (newValue !== initialValue.value) {
      validationState.dirty = true
    }
  })
  
  // Validation function
  const validate = async (): Promise<ValidationResult> => {
    validationState.pending = true
    
    try {
      for (const rule of rules) {
        const result = await validateRule(value.value, rule)
        if (!result.valid) {
          validationState.valid = false
          validationState.message = result.message
          validationState.pending = false
          return result
        }
      }
      
      validationState.valid = true
      validationState.message = ''
      validationState.pending = false
      
      return { valid: true, message: '' }
    } catch (error) {
      validationState.valid = false
      validationState.message = 'Validation error'
      validationState.pending = false
      
      return { valid: false, message: 'Validation error' }
    }
  }
  
  // Individual rule validation
  const validateRule = async (val: T, rule: ValidationRule): Promise<ValidationResult> => {
    if (rule.required && (val === null || val === undefined || val === '')) {
      return { valid: false, message: rule.message || 'This field is required' }
    }
    
    if (rule.min && typeof val === 'string' && val.length < rule.min) {
      return { valid: false, message: rule.message || `Minimum length is ${rule.min}` }
    }
    
    if (rule.max && typeof val === 'string' && val.length > rule.max) {
      return { valid: false, message: rule.message || `Maximum length is ${rule.max}` }
    }
    
    if (rule.pattern && typeof val === 'string' && !rule.pattern.test(val)) {
      return { valid: false, message: rule.message || 'Invalid format' }
    }
    
    if (rule.validator) {
      const result = rule.validator(val)
      if (typeof result === 'string') {
        return { valid: false, message: result }
      }
      if (!result) {
        return { valid: false, message: rule.message || 'Validation failed' }
      }
    }
    
    return { valid: true, message: '' }
  }
  
  // Debounced validation
  const debouncedValidate = debounce ? 
    useDebounceFn(validate, debounce) : 
    validate
  
  // Auto-validation on value change
  if (immediate) {
    watch(value, debouncedValidate, { immediate: validateOnMount })
  }
  
  // Reset validation state
  const reset = () => {
    validationState.valid = true
    validationState.message = ''
    validationState.pending = false
    validationState.touched = false
    validationState.dirty = false
  }
  
  // Clear validation errors
  const clearValidation = () => {
    validationState.valid = true
    validationState.message = ''
    validationState.pending = false
  }
  
  return {
    ...toRefs(validationState),
    validate,
    reset,
    clearValidation,
    markTouched
  }
}

// Advanced data fetching composable
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: {
    immediate?: boolean
    resetOnExecute?: boolean
    shallow?: boolean
    server?: boolean
  } = {}
) {
  const {
    immediate = true,
    resetOnExecute = true,
    shallow = true,
    server = true
  } = options
  
  const data = shallow ? shallowRef<T | null>(null) : ref<T | null>(null)
  const pending = ref(false)
  const error = ref<Error | null>(null)
  const finished = ref(false)
  
  const execute = async (): Promise<T | null> => {
    if (resetOnExecute) {
      data.value = null
    }
    
    error.value = null
    pending.value = true
    finished.value = false
    
    try {
      const result = await fetcher()
      data.value = result
      return result
    } catch (err) {
      error.value = err as Error
      return null
    } finally {
      pending.value = false
      finished.value = true
    }
  }
  
  const refresh = () => execute()
  
  // Auto-execute on mount
  if (immediate) {
    if (server && typeof window === 'undefined') {
      // SSR execution
      execute()
    } else if (typeof window !== 'undefined') {
      // Client-side execution
      onMounted(execute)
    }
  }
  
  return {
    data: readonly(data),
    pending: readonly(pending),
    error: readonly(error),
    finished: readonly(finished),
    execute,
    refresh
  }
}

// Advanced state management composable
export function useToggle(initialValue = false) {
  const state = ref(initialValue)
  
  const toggle = (value?: boolean) => {
    state.value = typeof value === 'boolean' ? value : !state.value
  }
  
  const setTrue = () => toggle(true)
  const setFalse = () => toggle(false)
  
  return {
    state: readonly(state),
    toggle,
    setTrue,
    setFalse
  }
}
```

### 2. Advanced Reactivity Patterns

Element Plus uses Vue 3's advanced reactivity features for optimal performance.

```typescript
// Shallow reactivity for performance optimization
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// Large dataset management with shallow reactivity
export function useLargeDataset<T>(initialData: T[] = []) {
  const data = shallowRef<T[]>(initialData)
  const selectedItems = shallowReactive(new Set<T>())
  const filters = reactive({
    search: '',
    sortBy: '',
    sortOrder: 'asc' as 'asc' | 'desc'
  })
  
  // Efficient data updates
  const updateData = (newData: T[]) => {
    data.value = newData
    triggerRef(data) // Manually trigger reactivity
  }
  
  const addItem = (item: T) => {
    data.value.push(item)
    triggerRef(data)
  }
  
  const removeItem = (index: number) => {
    data.value.splice(index, 1)
    triggerRef(data)
  }
  
  const updateItem = (index: number, item: T) => {
    data.value[index] = item
    triggerRef(data)
  }
  
  // Selection management
  const selectItem = (item: T) => {
    selectedItems.add(item)
  }
  
  const deselectItem = (item: T) => {
    selectedItems.delete(item)
  }
  
  const toggleSelection = (item: T) => {
    if (selectedItems.has(item)) {
      selectedItems.delete(item)
    } else {
      selectedItems.add(item)
    }
  }
  
  const clearSelection = () => {
    selectedItems.clear()
  }
  
  const selectAll = () => {
    data.value.forEach(item => selectedItems.add(item))
  }
  
  // Computed properties with proper reactivity
  const filteredData = computed(() => {
    let result = data.value
    
    // Apply search filter
    if (filters.search) {
      result = result.filter(item => 
        JSON.stringify(item).toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    // Apply sorting
    if (filters.sortBy) {
      result = [...result].sort((a, b) => {
        const aVal = (a as any)[filters.sortBy]
        const bVal = (b as any)[filters.sortBy]
        
        if (filters.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }
    
    return result
  })
  
  const selectedCount = computed(() => selectedItems.size)
  const isAllSelected = computed(() => 
    data.value.length > 0 && selectedItems.size === data.value.length
  )
  
  return {
    data: readonly(data),
    selectedItems: readonly(selectedItems),
    filters,
    filteredData,
    selectedCount,
    isAllSelected,
    updateData,
    addItem,
    removeItem,
    updateItem,
    selectItem,
    deselectItem,
    toggleSelection,
    clearSelection,
    selectAll
  }
}

// Custom reactivity with effect scope
export function useEffectScope() {
  const scope = effectScope()
  
  const runInScope = <T>(fn: () => T): T => {
    return scope.run(fn)!
  }
  
  const stopScope = () => {
    scope.stop()
  }
  
  onScopeDispose(() => {
    scope.stop()
  })
  
  return {
    runInScope,
    stopScope
  }
}
```

## Teleport Integration

### 1. Modal and Overlay Components

Element Plus uses Teleport for modals, drawers, and overlay components to avoid z-index issues.

```vue
<!-- Enhanced Modal Component with Teleport -->
<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition
      name="el-modal"
      @enter="handleEnter"
      @after-enter="handleAfterEnter"
      @leave="handleLeave"
      @after-leave="handleAfterLeave"
    >
      <div
        v-show="visible"
        :class="modalClasses"
        :style="modalStyles"
        @click="handleMaskClick"
      >
        <div
          ref="dialogRef"
          :class="dialogClasses"
          :style="dialogStyles"
          @click.stop
        >
          <!-- Modal content -->
          <header v-if="showHeader" :class="ns.e('header')">
            <slot name="header">
              <span :class="ns.e('title')">{{ title }}</span>
            </slot>
            <button
              v-if="showClose"
              :class="ns.e('close')"
              @click="handleClose"
            >
              <el-icon><Close /></el-icon>
            </button>
          </header>
          
          <main :class="ns.e('body')">
            <slot />
          </main>
          
          <footer v-if="$slots.footer" :class="ns.e('footer')">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useNamespace, useZIndex, useLockScreen, useTrapFocus } from '@element-plus/hooks'
import { ElIcon } from '@element-plus/components/icon'
import { Close } from '@element-plus/icons-vue'

interface ModalProps {
  visible?: boolean
  title?: string
  width?: string | number
  top?: string
  modal?: boolean
  modalClass?: string
  appendToBody?: boolean
  lockScroll?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  showHeader?: boolean
  beforeClose?: (done: () => void) => void
  center?: boolean
  alignCenter?: boolean
  destroyOnClose?: boolean
  zIndex?: number
}

const props = withDefaults(defineProps<ModalProps>(), {
  visible: false,
  title: '',
  width: '50%',
  top: '15vh',
  modal: true,
  appendToBody: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  showHeader: true,
  center: false,
  alignCenter: false,
  destroyOnClose: false
})

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  open: []
  opened: []
  close: []
  closed: []
}>()

const ns = useNamespace('modal')
const { nextZIndex } = useZIndex()
const dialogRef = ref<HTMLElement>()

// Z-index management
const zIndex = computed(() => props.zIndex || nextZIndex())

// Lock screen when modal is open
const { lock, unlock } = useLockScreen()

// Focus trap for accessibility
const { trapFocus, releaseFocus } = useTrapFocus(dialogRef)

// Modal classes
const modalClasses = computed(() => [
  ns.b(),
  ns.is('center', props.center),
  props.modalClass
])

// Dialog classes
const dialogClasses = computed(() => [
  ns.e('dialog'),
  ns.is('center', props.alignCenter)
])

// Modal styles
const modalStyles = computed(() => ({
  zIndex: zIndex.value
}))

// Dialog styles
const dialogStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.top && !props.center) {
    styles.marginTop = props.top
  }
  
  return styles
})

// Handle mask click
const handleMaskClick = () => {
  if (props.closeOnClickModal) {
    handleClose()
  }
}

// Handle close
const handleClose = () => {
  if (props.beforeClose) {
    props.beforeClose(() => {
      emit('update:visible', false)
    })
  } else {
    emit('update:visible', false)
  }
}

// Handle escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    handleClose()
  }
}

// Transition handlers
const handleEnter = () => {
  emit('open')
}

const handleAfterEnter = () => {
  emit('opened')
  trapFocus()
}

const handleLeave = () => {
  emit('close')
  releaseFocus()
}

const handleAfterLeave = () => {
  emit('closed')
}

// Watch visibility changes
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (props.lockScroll) {
        lock()
      }
      document.addEventListener('keydown', handleEscapeKey)
    } else {
      if (props.lockScroll) {
        unlock()
      }
      document.removeEventListener('keydown', handleEscapeKey)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (props.lockScroll) {
    unlock()
  }
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>
```

### 2. Notification and Message Components

```typescript
// Notification system with Teleport
import { createApp, h, Teleport, Transition, ref } from 'vue'
import type { VNode, App } from 'vue'

interface NotificationOptions {
  title?: string
  message?: string
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  showClose?: boolean
  onClick?: () => void
  onClose?: () => void
}

class NotificationManager {
  private instances: Map<string, any> = new Map()
  private seed = 1
  
  create(options: NotificationOptions) {
    const id = `notification_${this.seed++}`
    const container = document.createElement('div')
    
    const instance = createApp({
      setup() {
        const visible = ref(true)
        const timer = ref<NodeJS.Timeout>()
        
        const close = () => {
          visible.value = false
          options.onClose?.()
        }
        
        const startTimer = () => {
          if (options.duration && options.duration > 0) {
            timer.value = setTimeout(close, options.duration)
          }
        }
        
        const clearTimer = () => {
          if (timer.value) {
            clearTimeout(timer.value)
            timer.value = undefined
          }
        }
        
        const handleClick = () => {
          options.onClick?.()
        }
        
        const handleAfterLeave = () => {
          this.destroy(id)
        }
        
        onMounted(() => {
          startTimer()
        })
        
        onBeforeUnmount(() => {
          clearTimer()
        })
        
        return {
          visible,
          close,
          startTimer,
          clearTimer,
          handleClick,
          handleAfterLeave
        }
      },
      render() {
        return h(Teleport, { to: 'body' }, [
          h(Transition, {
            name: 'el-notification',
            onAfterLeave: this.handleAfterLeave
          }, {
            default: () => this.visible ? h('div', {
              class: [
                'el-notification',
                `el-notification--${options.type || 'info'}`,
                `el-notification--${options.position || 'top-right'}`
              ],
              onClick: this.handleClick,
              onMouseenter: this.clearTimer,
              onMouseleave: this.startTimer
            }, [
              options.title && h('div', {
                class: 'el-notification__title'
              }, options.title),
              
              options.message && h('div', {
                class: 'el-notification__content'
              }, options.message),
              
              options.showClose && h('button', {
                class: 'el-notification__close',
                onClick: this.close
              }, '×')
            ]) : null
          })
        ])
      }
    })
    
    instance.mount(container)
    this.instances.set(id, { instance, container, close: instance.close })
    
    return {
      id,
      close: () => this.close(id)
    }
  }
  
  close(id: string) {
    const notification = this.instances.get(id)
    if (notification) {
      notification.close()
    }
  }
  
  closeAll() {
    this.instances.forEach(notification => {
      notification.close()
    })
  }
  
  destroy(id: string) {
    const notification = this.instances.get(id)
    if (notification) {
      notification.instance.unmount()
      notification.container.remove()
      this.instances.delete(id)
    }
  }
}

const notificationManager = new NotificationManager()

export const ElNotification = {
  success: (options: NotificationOptions) => 
    notificationManager.create({ ...options, type: 'success' }),
  warning: (options: NotificationOptions) => 
    notificationManager.create({ ...options, type: 'warning' }),
  info: (options: NotificationOptions) => 
    notificationManager.create({ ...options, type: 'info' }),
  error: (options: NotificationOptions) => 
    notificationManager.create({ ...options, type: 'error' }),
  close: (id: string) => notificationManager.close(id),
  closeAll: () => notificationManager.closeAll()
}
```

## Fragments and Multiple Root Nodes

### 1. Component with Multiple Root Nodes

Vue 3's fragment support allows Element Plus components to have multiple root nodes.

```vue
<!-- Button Group Component with Fragments -->
<template>
  <!-- Multiple root nodes without wrapper -->
  <button
    v-for="(button, index) in buttons"
    :key="button.key || index"
    :class="getButtonClasses(button, index)"
    :disabled="button.disabled || disabled"
    @click="handleClick(button, index)"
  >
    <el-icon v-if="button.icon" :class="ns.e('icon')">
      <component :is="button.icon" />
    </el-icon>
    <span v-if="button.text">{{ button.text }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { ElIcon } from '@element-plus/components/icon'

interface ButtonConfig {
  key?: string
  text?: string
  icon?: Component
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  disabled?: boolean
  onClick?: () => void
}

interface ButtonGroupProps {
  buttons: ButtonConfig[]
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  buttons: () => [],
  size: 'default',
  disabled: false
})

const emit = defineEmits<{
  click: [button: ButtonConfig, index: number]
}>()

const ns = useNamespace('button-group')

const getButtonClasses = (button: ButtonConfig, index: number) => {
  return [
    'el-button',
    `el-button--${button.type || props.type || 'default'}`,
    `el-button--${props.size}`,
    {
      'is-first': index === 0,
      'is-last': index === props.buttons.length - 1,
      'is-disabled': button.disabled || props.disabled
    }
  ]
}

const handleClick = (button: ButtonConfig, index: number) => {
  if (button.disabled || props.disabled) return
  
  button.onClick?.()
  emit('click', button, index)
}
</script>
```

### 2. Conditional Rendering with Fragments

```vue
<!-- Form Item Component with Conditional Fragments -->
<template>
  <!-- Label fragment -->
  <label
    v-if="label || $slots.label"
    :for="inputId"
    :class="labelClasses"
    :style="labelStyles"
  >
    <slot name="label">{{ label }}</slot>
    <span v-if="required" class="el-form-item__required">*</span>
  </label>
  
  <!-- Content fragment -->
  <div :class="contentClasses">
    <slot />
    
    <!-- Error message fragment -->
    <Transition name="el-form-item-error">
      <div
        v-if="validateState === 'error' && showMessage"
        :class="errorClasses"
      >
        {{ validateMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, provide, reactive, toRefs } from 'vue'
import { useNamespace, useId } from '@element-plus/hooks'
import { formContextKey, formItemContextKey } from '@element-plus/tokens'

interface FormItemProps {
  label?: string
  prop?: string
  required?: boolean
  rules?: any[]
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true,
  inlineMessage: false
})

const ns = useNamespace('form-item')
const inputId = useId()
const form = inject(formContextKey, undefined)

// Form item state
const formItemState = reactive({
  validateState: '',
  validateMessage: '',
  validateDisabled: false
})

// Computed properties
const labelClasses = computed(() => [
  ns.e('label'),
  ns.is('required', props.required || isRequired.value)
])

const contentClasses = computed(() => [
  ns.e('content')
])

const errorClasses = computed(() => [
  ns.e('error'),
  {
    [ns.em('error', 'inline')]: props.inlineMessage
  }
])

const labelStyles = computed(() => {
  if (form?.labelWidth) {
    return {
      width: form.labelWidth
    }
  }
  return {}
})

const isRequired = computed(() => {
  return props.rules?.some(rule => rule.required) || false
})

// Provide form item context
const formItemContext = {
  ...toRefs(props),
  ...toRefs(formItemState),
  inputId
}

provide(formItemContextKey, formItemContext)
</script>
```

## Suspense Integration

### 1. Async Component Loading

Element Plus uses Suspense for loading async components and data.

```vue
<!-- Async Data Table Component -->
<template>
  <Suspense>
    <template #default>
      <AsyncDataTable
        :api="tableApi"
        :columns="columns"
        :filters="filters"
      />
    </template>
    
    <template #fallback>
      <div class="loading-container">
        <el-skeleton :rows="5" animated />
        <div class="loading-text">Loading data...</div>
      </div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { ElSkeleton } from 'element-plus'

// Async component with lazy loading
const AsyncDataTable = defineAsyncComponent({
  loader: () => import('./DataTable.vue'),
  loadingComponent: () => h(ElSkeleton, { rows: 3, animated: true }),
  errorComponent: () => h('div', 'Failed to load component'),
  delay: 200,
  timeout: 3000
})

interface TableProps {
  tableApi: string
  columns: any[]
  filters?: Record<string, any>
}

defineProps<TableProps>()
</script>
```

### 2. Async Data Fetching with Suspense

```vue
<!-- Async Data Component -->
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <div class="user-stats">
      <div class="stat">
        <span class="label">Posts:</span>
        <span class="value">{{ user.postsCount }}</span>
      </div>
      <div class="stat">
        <span class="label">Followers:</span>
        <span class="value">{{ user.followersCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  postsCount: number
  followersCount: number
}

interface UserProfileProps {
  userId: number
}

const props = defineProps<UserProfileProps>()

// Async data fetching that works with Suspense
const user = ref<User>()

// This will be awaited by Suspense
const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

// Top-level await works with Suspense
user.value = await fetchUser(props.userId)
</script>
```

### 3. Error Boundaries with Suspense

```vue
<!-- Error Boundary Component -->
<template>
  <div class="error-boundary">
    <Suspense @pending="handlePending" @resolve="handleResolve" @reject="handleReject">
      <template #default>
        <slot />
      </template>
      
      <template #fallback>
        <div class="loading-state">
          <el-loading-spinner />
          <p>{{ loadingMessage }}</p>
        </div>
      </template>
    </Suspense>
    
    <!-- Error state -->
    <div v-if="error" class="error-state">
      <el-alert
        type="error"
        :title="errorTitle"
        :description="error.message"
        show-icon
      >
        <template #default>
          <el-button @click="retry">Retry</el-button>
          <el-button type="text" @click="reportError">Report Issue</el-button>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { ElAlert, ElButton } from 'element-plus'

interface ErrorBoundaryProps {
  loadingMessage?: string
  errorTitle?: string
  onError?: (error: Error) => void
  onRetry?: () => void
}

const props = withDefaults(defineProps<ErrorBoundaryProps>(), {
  loadingMessage: 'Loading...',
  errorTitle: 'Something went wrong'
})

const emit = defineEmits<{
  pending: []
  resolve: []
  reject: [error: Error]
  retry: []
}>()

const error = ref<Error | null>(null)
const isLoading = ref(false)

// Handle Suspense events
const handlePending = () => {
  isLoading.value = true
  error.value = null
  emit('pending')
}

const handleResolve = () => {
  isLoading.value = false
  error.value = null
  emit('resolve')
}

const handleReject = (err: Error) => {
  isLoading.value = false
  error.value = err
  props.onError?.(err)
  emit('reject', err)
}

// Error capture
onErrorCaptured((err: Error) => {
  error.value = err
  props.onError?.(err)
  return false // Prevent error from propagating
})

// Retry functionality
const retry = () => {
  error.value = null
  props.onRetry?.()
  emit('retry')
}

// Error reporting
const reportError = () => {
  if (error.value) {
    // Send error to monitoring service
    console.error('Reported error:', error.value)
  }
}
</script>
```

## Custom Directives with Vue 3

### 1. Advanced Directive Implementation

```typescript
// Advanced loading directive
import { Directive, DirectiveBinding } from 'vue'
import { createApp, h } from 'vue'
import { ElLoading } from 'element-plus'

interface LoadingOptions {
  text?: string
  spinner?: string
  background?: string
  customClass?: string
}

interface LoadingBinding extends DirectiveBinding {
  value: boolean | LoadingOptions
}

const loadingDirective: Directive = {
  mounted(el: HTMLElement, binding: LoadingBinding) {
    const options = getLoadingOptions(binding.value)
    if (options.show) {
      createLoadingInstance(el, options)
    }
  },
  
  updated(el: HTMLElement, binding: LoadingBinding) {
    const options = getLoadingOptions(binding.value)
    const instance = (el as any).__loadingInstance
    
    if (options.show && !instance) {
      createLoadingInstance(el, options)
    } else if (!options.show && instance) {
      destroyLoadingInstance(el)
    } else if (instance) {
      updateLoadingInstance(el, options)
    }
  },
  
  unmounted(el: HTMLElement) {
    destroyLoadingInstance(el)
  }
}

function getLoadingOptions(value: boolean | LoadingOptions) {
  if (typeof value === 'boolean') {
    return { show: value }
  }
  return { show: true, ...value }
}

function createLoadingInstance(el: HTMLElement, options: any) {
  const container = document.createElement('div')
  container.className = 'el-loading-mask'
  
  const instance = createApp({
    render() {
      return h(ElLoading, {
        text: options.text,
        spinner: options.spinner,
        background: options.background,
        customClass: options.customClass
      })
    }
  })
  
  instance.mount(container)
  el.appendChild(container)
  
  // Store instance for later cleanup
  ;(el as any).__loadingInstance = {
    instance,
    container
  }
}

function updateLoadingInstance(el: HTMLElement, options: any) {
  const loadingInstance = (el as any).__loadingInstance
  if (loadingInstance) {
    // Update loading options
    Object.assign(loadingInstance.instance._instance.props, options)
  }
}

function destroyLoadingInstance(el: HTMLElement) {
  const loadingInstance = (el as any).__loadingInstance
  if (loadingInstance) {
    loadingInstance.instance.unmount()
    loadingInstance.container.remove()
    delete (el as any).__loadingInstance
  }
}

// Intersection Observer directive
const intersectionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options = {
      threshold: 0.1,
      rootMargin: '0px',
      ...binding.modifiers
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value?.(entry)
          
          // If 'once' modifier is used, disconnect after first intersection
          if (binding.modifiers.once) {
            observer.disconnect()
          }
        }
      })
    }, options)
    
    observer.observe(el)
    ;(el as any).__intersectionObserver = observer
  },
  
  unmounted(el: HTMLElement) {
    const observer = (el as any).__intersectionObserver
    if (observer) {
      observer.disconnect()
      delete (el as any).__intersectionObserver
    }
  }
}

// Resize observer directive
const resizeDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const observer = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        binding.value?.(entry)
      })
    })
    
    observer.observe(el)
    ;(el as any).__resizeObserver = observer
  },
  
  unmounted(el: HTMLElement) {
    const observer = (el as any).__resizeObserver
    if (observer) {
      observer.disconnect()
      delete (el as any).__resizeObserver
    }
  }
}

export {
  loadingDirective as vLoading,
  intersectionDirective as vIntersection,
  resizeDirective as vResize
}
```

## Performance Optimizations with Vue 3

### 1. Compiler Optimizations

```vue
<!-- Optimized component with static hoisting -->
<template>
  <div class="optimized-component">
    <!-- Static content will be hoisted -->
    <header class="header">
      <h1>Static Title</h1>
      <nav class="navigation">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    
    <!-- Dynamic content -->
    <main class="content">
      <div v-for="item in items" :key="item.id" class="item">
        <!-- Patch flag optimization -->
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <button @click="handleClick(item)">{{ item.buttonText }}</button>
      </div>
    </main>
    
    <!-- Conditional rendering with v-memo -->
    <aside v-memo="[user.id, user.lastUpdated]" class="sidebar">
      <div class="user-info">
        <img :src="user.avatar" :alt="user.name" />
        <h4>{{ user.name }}</h4>
        <p>{{ user.email }}</p>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'

interface Item {
  id: number
  title: string
  description: string
  buttonText: string
}

interface User {
  id: number
  name: string
  email: string
  avatar: string
  lastUpdated: number
}

// Use shallowRef for large datasets
const items = shallowRef<Item[]>([])
const user = ref<User>({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg',
  lastUpdated: Date.now()
})

// Optimized event handler
const handleClick = (item: Item) => {
  console.log('Clicked item:', item.id)
}

// Computed with proper dependencies
const itemCount = computed(() => items.value.length)
</script>
```

### 2. Tree-shaking Optimizations

```typescript
// Optimized imports for tree-shaking
import { ElButton } from 'element-plus/es/components/button'
import { ElInput } from 'element-plus/es/components/input'
import { ElForm } from 'element-plus/es/components/form'

// Import only needed styles
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/form/style/css'

// Auto-import configuration for optimal bundle size
export const optimizedElementPlusConfig = {
  resolvers: [
    {
      type: 'component',
      resolve: (name: string) => {
        if (name.startsWith('El')) {
          return {
            name,
            from: 'element-plus/es',
            sideEffects: `element-plus/es/components/${name.slice(2).toLowerCase()}/style/css`
          }
        }
      }
    }
  ]
}
```

## Best Practices

### 1. Vue 3 Feature Usage Guidelines

- **Composition API**: Use for complex logic and reusable functionality
- **Teleport**: Use for modals, tooltips, and overlay components
- **Fragments**: Leverage for cleaner component templates
- **Suspense**: Implement for async data loading and code splitting
- **Custom Directives**: Create for DOM manipulation and third-party integrations

### 2. Performance Considerations

- **Reactivity**: Use `shallowRef` and `shallowReactive` for large datasets
- **Computed Properties**: Optimize dependencies and avoid expensive calculations
- **Event Handlers**: Use proper event delegation and cleanup
- **Memory Management**: Implement proper cleanup in `onBeforeUnmount`

### 3. Type Safety

- **Props**: Define comprehensive prop types with TypeScript
- **Emits**: Specify emit types for better IDE support
- **Composables**: Provide proper return type annotations
- **Generic Components**: Use generic types for reusable components

## Conclusion

Vue 3's new features enable Element Plus to provide:

- **Better Performance**: Through compiler optimizations and reactivity improvements
- **Enhanced Developer Experience**: With Composition API and TypeScript integration
- **Flexible Architecture**: Using Teleport, Fragments, and Suspense
- **Modern Patterns**: Leveraging the latest Vue.js capabilities
- **Optimal Bundle Size**: Through tree-shaking and code splitting

These features work together to create a modern, efficient, and developer-friendly component library that takes full advantage of Vue 3's capabilities.