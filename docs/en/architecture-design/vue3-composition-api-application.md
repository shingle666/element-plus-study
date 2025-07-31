# Vue 3 Composition API Application in Element Plus

## Overview

This document explores how Element Plus leverages Vue 3's Composition API to create maintainable, reusable, and performant components. We'll examine the architectural decisions, implementation patterns, and best practices used throughout the library.

## Composition API Fundamentals in Element Plus

### 1. Reactive State Management

Element Plus uses Vue 3's reactivity system extensively for component state management.

```typescript
// Button component state management
import { ref, computed, inject } from 'vue'
import type { ButtonProps } from './button'

export const useButton = (props: ButtonProps, emit: any) => {
  const buttonRef = ref<HTMLButtonElement>()
  const loading = ref(false)
  
  // Computed properties for dynamic classes
  const buttonClass = computed(() => {
    return [
      'el-button',
      `el-button--${props.type}`,
      `el-button--${props.size}`,
      {
        'is-disabled': props.disabled,
        'is-loading': loading.value,
        'is-plain': props.plain,
        'is-round': props.round,
        'is-circle': props.circle
      }
    ]
  })
  
  // Reactive style computation
  const buttonStyle = computed(() => {
    const style: Record<string, string> = {}
    
    if (props.color) {
      style['--el-button-bg-color'] = props.color
      style['--el-button-border-color'] = props.color
    }
    
    return style
  })
  
  return {
    buttonRef,
    loading,
    buttonClass,
    buttonStyle
  }
}
```

### 2. Lifecycle Management

Composition API provides better lifecycle management compared to Options API.

```typescript
// Dialog component lifecycle management
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useZIndex } from '@element-plus/hooks'

export const useDialog = (props: DialogProps, emit: any) => {
  const visible = ref(false)
  const dialogRef = ref<HTMLElement>()
  const { nextZIndex } = useZIndex()
  
  // Watch for visibility changes
  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        open()
      } else {
        close()
      }
    },
    { immediate: true }
  )
  
  const open = async () => {
    visible.value = true
    emit('open')
    
    await nextTick()
    
    // Focus management
    if (dialogRef.value) {
      const focusableElement = dialogRef.value.querySelector(
        '[autofocus], input, button, select, textarea'
      ) as HTMLElement
      
      if (focusableElement) {
        focusableElement.focus()
      }
    }
  }
  
  const close = () => {
    visible.value = false
    emit('close')
    emit('update:modelValue', false)
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    if (visible.value) {
      close()
    }
  })
  
  return {
    visible,
    dialogRef,
    open,
    close
  }
}
```

## Custom Composables Architecture

### 1. Namespace Management

Element Plus uses a sophisticated namespace system for CSS class management.

```typescript
// useNamespace composable
import { computed, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'

const defaultNamespace = 'el'
const statePrefix = 'is-'

export const useNamespace = (block: string) => {
  const namespace = computed(() => defaultNamespace)
  
  const b = (blockSuffix = '') => 
    `${namespace.value}-${block}${blockSuffix ? `-${blockSuffix}` : ''}`
  
  const e = (element?: string) => 
    element ? `${b()}__${element}` : ''
  
  const m = (modifier?: string) => 
    modifier ? `${b()}--${modifier}` : ''
  
  const be = (blockSuffix?: string, element?: string) => 
    `${b(blockSuffix)}${e(element)}`
  
  const em = (element?: string, modifier?: string) => 
    `${e(element)}${m(modifier)}`
  
  const bm = (blockSuffix?: string, modifier?: string) => 
    `${b(blockSuffix)}${m(modifier)}`
  
  const bem = (blockSuffix?: string, element?: string, modifier?: string) => 
    `${b(blockSuffix)}${e(element)}${m(modifier)}`
  
  const is = (name: string, state?: boolean | undefined) => 
    name && state ? `${statePrefix}${name}` : ''
  
  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${key}`] = object[key]
      }
    }
    return styles
  }
  
  const cssVarName = (name: string) => `--${namespace.value}-${name}`
  
  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {}
    for (const key in object) {
      if (object[key]) {
        styles[`--${namespace.value}-${block}-${key}`] = object[key]
      }
    }
    return styles
  }
  
  const cssVarBlockName = (name: string) => `--${namespace.value}-${block}-${name}`
  
  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is,
    cssVar,
    cssVarName,
    cssVarBlock,
    cssVarBlockName
  }
}

// Usage in components
export const Button = defineComponent({
  name: 'ElButton',
  setup(props) {
    const ns = useNamespace('button')
    
    const buttonClass = computed(() => [
      ns.b(),
      ns.m(props.type),
      ns.m(props.size),
      ns.is('disabled', props.disabled),
      ns.is('loading', props.loading)
    ])
    
    return { buttonClass }
  }
})
```

### 2. Form Validation System

Complex form validation using Composition API patterns.

```typescript
// useFormItem composable
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import AsyncValidator from 'async-validator'
import { formContextKey, formItemContextKey } from './constants'
import type { FormItemRule, FormValidateCallback } from './types'

export const useFormItem = (props: FormItemProps) => {
  const formContext = inject(formContextKey, undefined)
  const validateState = ref('')
  const validateMessage = ref('')
  const validateDisabled = ref(false)
  
  // Get field value from form model
  const fieldValue = computed(() => {
    const model = formContext?.model
    if (!model || !props.prop) return
    
    return getPropByPath(model, props.prop).v
  })
  
  // Get validation rules
  const normalizedRules = computed(() => {
    const { required } = props
    const rules: FormItemRule[] = []
    
    if (props.rules) {
      rules.push(...(Array.isArray(props.rules) ? props.rules : [props.rules]))
    }
    
    const formRules = formContext?.rules
    if (formRules && props.prop) {
      const _rules = getPropByPath(formRules, props.prop).v
      if (_rules) {
        rules.push(...(Array.isArray(_rules) ? _rules : [_rules]))
      }
    }
    
    if (required !== undefined) {
      const requiredRules = rules.filter(rule => rule.required)
      if (requiredRules.length === 0) {
        rules.push({ required: !!required })
      }
    }
    
    return rules
  })
  
  // Validation function
  const validate = async (
    trigger: string,
    callback?: FormValidateCallback
  ): Promise<boolean> => {
    const rules = getFilteredRule(trigger)
    
    if ((!rules || rules.length === 0) && props.required === undefined) {
      callback?.()
      return true
    }
    
    validateState.value = 'validating'
    
    const descriptor: Record<string, FormItemRule[]> = {}
    if (rules && rules.length > 0) {
      rules.forEach(rule => {
        delete rule.trigger
      })
    }
    descriptor[props.prop!] = rules
    
    const validator = new AsyncValidator(descriptor)
    const model: Record<string, unknown> = {}
    
    model[props.prop!] = fieldValue.value
    
    try {
      await validator.validate(model)
      validateState.value = 'success'
      callback?.()
      return true
    } catch (error: any) {
      const { errors } = error
      validateState.value = 'error'
      validateMessage.value = errors ? errors[0].message : ''
      callback?.(validateMessage.value)
      return false
    }
  }
  
  const clearValidate = () => {
    validateState.value = ''
    validateMessage.value = ''
    validateDisabled.value = false
  }
  
  const resetField = async () => {
    const model = formContext?.model
    if (!model || !props.prop) return
    
    const computedValue = getPropByPath(model, props.prop)
    
    validateDisabled.value = true
    computedValue.o[computedValue.k] = clone(initialValue)
    
    await nextTick()
    clearValidate()
    validateDisabled.value = false
  }
  
  const getFilteredRule = (trigger: string) => {
    const rules = normalizedRules.value
    return rules
      .filter(rule => {
        if (!rule.trigger || trigger === '') return true
        if (Array.isArray(rule.trigger)) {
          return rule.trigger.includes(trigger)
        } else {
          return rule.trigger === trigger
        }
      })
      .map(rule => ({ ...rule }))
  }
  
  // Provide context for child components
  const context = {
    prop: props.prop,
    validate,
    clearValidate,
    resetField
  }
  
  provide(formItemContextKey, context)
  
  // Register with form
  onMounted(() => {
    if (props.prop) {
      formContext?.addField(context)
    }
  })
  
  onUnmounted(() => {
    formContext?.removeField(context)
  })
  
  return {
    validateState,
    validateMessage,
    validate,
    clearValidate,
    resetField
  }
}
```

### 3. Event Handling Composables

Reusable event handling logic using Composition API.

```typescript
// useClickOutside composable
import { onMounted, onUnmounted, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'

export const useClickOutside = (
  target: MaybeRef<HTMLElement | undefined>,
  handler: (event: MouseEvent) => void
) => {
  const listener = (event: MouseEvent) => {
    const el = unref(target)
    if (!el || el.contains(event.target as Node)) {
      return
    }
    handler(event)
  }
  
  onMounted(() => {
    document.addEventListener('click', listener, true)
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', listener, true)
  })
}

// useKeyboard composable
export const useKeyboard = () => {
  const onKeydown = (event: KeyboardEvent, handlers: Record<string, () => void>) => {
    const handler = handlers[event.key] || handlers[event.code]
    if (handler) {
      event.preventDefault()
      handler()
    }
  }
  
  const createKeydownHandler = (handlers: Record<string, () => void>) => {
    return (event: KeyboardEvent) => onKeydown(event, handlers)
  }
  
  return {
    onKeydown,
    createKeydownHandler
  }
}

// Usage in Select component
export const Select = defineComponent({
  setup(props, { emit }) {
    const selectRef = ref<HTMLElement>()
    const visible = ref(false)
    const { createKeydownHandler } = useKeyboard()
    
    const close = () => {
      visible.value = false
      emit('visible-change', false)
    }
    
    useClickOutside(selectRef, close)
    
    const keydownHandler = createKeydownHandler({
      Escape: close,
      ArrowDown: () => {
        if (!visible.value) {
          visible.value = true
        }
      }
    })
    
    return {
      selectRef,
      visible,
      keydownHandler
    }
  }
})
```

## Advanced Composition Patterns

### 1. Provide/Inject Pattern

Element Plus uses provide/inject extensively for component communication.

```typescript
// Table component context
import { provide, inject, computed } from 'vue'
import type { InjectionKey } from 'vue'

interface TableContext {
  store: any
  layout: any
  refs: {
    tableWrapper: HTMLElement
    headerWrapper: HTMLElement
    bodyWrapper: HTMLElement
  }
}

export const tableContextKey: InjectionKey<TableContext> = Symbol('tableContext')

// Table component
export const Table = defineComponent({
  setup(props) {
    const store = createStore()
    const layout = createTableLayout()
    
    const tableContext: TableContext = {
      store,
      layout,
      refs: {
        tableWrapper: null!,
        headerWrapper: null!,
        bodyWrapper: null!
      }
    }
    
    provide(tableContextKey, tableContext)
    
    return { store, layout }
  }
})

// TableColumn component
export const TableColumn = defineComponent({
  setup(props) {
    const tableContext = inject(tableContextKey)
    
    if (!tableContext) {
      throw new Error('TableColumn must be used within Table')
    }
    
    const { store } = tableContext
    
    onMounted(() => {
      store.commit('insertColumn', props)
    })
    
    onUnmounted(() => {
      store.commit('removeColumn', props)
    })
    
    return {}
  }
})
```

### 2. Composable Composition

Combining multiple composables for complex functionality.

```typescript
// usePopper composable combining multiple concerns
import { useFloating } from '@floating-ui/vue'
import { useClickOutside } from './useClickOutside'
import { useEscapeKeydown } from './useEscapeKeydown'

export const usePopper = (options: PopperOptions) => {
  const triggerRef = ref<HTMLElement>()
  const popperRef = ref<HTMLElement>()
  const visible = ref(false)
  
  // Floating UI integration
  const { floatingStyles, placement, middlewareData } = useFloating(
    triggerRef,
    popperRef,
    {
      placement: options.placement,
      middleware: [
        offset(options.offset),
        flip(),
        shift({ padding: 8 })
      ]
    }
  )
  
  // Click outside to close
  useClickOutside(popperRef, () => {
    if (visible.value && options.hideOnClickOutside) {
      hide()
    }
  })
  
  // Escape key to close
  useEscapeKeydown(() => {
    if (visible.value && options.hideOnEscape) {
      hide()
    }
  })
  
  const show = () => {
    visible.value = true
    options.onShow?.()
  }
  
  const hide = () => {
    visible.value = false
    options.onHide?.()
  }
  
  const toggle = () => {
    visible.value ? hide() : show()
  }
  
  return {
    triggerRef,
    popperRef,
    visible,
    floatingStyles,
    placement,
    show,
    hide,
    toggle
  }
}

// Usage in Tooltip component
export const Tooltip = defineComponent({
  setup(props) {
    const {
      triggerRef,
      popperRef,
      visible,
      floatingStyles,
      show,
      hide
    } = usePopper({
      placement: props.placement,
      offset: props.offset,
      hideOnClickOutside: true,
      hideOnEscape: true
    })
    
    return {
      triggerRef,
      popperRef,
      visible,
      floatingStyles,
      show,
      hide
    }
  }
})
```

### 3. Reactive Transform Integration

Element Plus leverages Vue 3's reactivity transform for cleaner syntax.

```typescript
// Using $ref for cleaner reactive declarations
export const useCounter = (initialValue = 0) => {
  let count = $ref(initialValue)
  let doubled = $computed(() => count * 2)
  
  const increment = () => {
    count++
  }
  
  const decrement = () => {
    count--
  }
  
  const reset = () => {
    count = initialValue
  }
  
  return {
    count: $$(count),
    doubled: $$(doubled),
    increment,
    decrement,
    reset
  }
}

// Component using reactive transform
export const Counter = defineComponent({
  setup() {
    const { count, doubled, increment, decrement } = useCounter()
    
    return {
      count,
      doubled,
      increment,
      decrement
    }
  }
})
```

## Performance Optimizations

### 1. Computed Properties and Memoization

```typescript
// Memoized computed properties for expensive calculations
import { computed, shallowRef } from 'vue'

export const useTableData = (props: TableProps) => {
  const data = shallowRef(props.data)
  
  // Memoized sorting
  const sortedData = computed(() => {
    if (!props.sortBy) return data.value
    
    return [...data.value].sort((a, b) => {
      const aVal = a[props.sortBy!]
      const bVal = b[props.sortBy!]
      
      if (props.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
  })
  
  // Memoized filtering
  const filteredData = computed(() => {
    if (!props.filter) return sortedData.value
    
    return sortedData.value.filter(item => {
      return Object.keys(props.filter!).every(key => {
        const filterValue = props.filter![key]
        const itemValue = item[key]
        
        if (typeof filterValue === 'string') {
          return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase())
        }
        
        return itemValue === filterValue
      })
    })
  })
  
  return {
    sortedData,
    filteredData
  }
}
```

### 2. Lazy Evaluation

```typescript
// Lazy loading composable
export const useLazyLoad = <T>(loader: () => Promise<T>) => {
  const data = shallowRef<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const loaded = ref(false)
  
  const load = async () => {
    if (loaded.value) return data.value
    
    loading.value = true
    error.value = null
    
    try {
      data.value = await loader()
      loaded.value = true
      return data.value
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    loaded: readonly(loaded),
    load
  }
}
```

## Testing Composition API Components

### 1. Testing Composables

```typescript
// Testing composables in isolation
import { describe, it, expect } from 'vitest'
import { useCounter } from '../composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })
  
  it('should increment count', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
  
  it('should compute doubled value', () => {
    const { count, doubled, increment } = useCounter()
    increment()
    increment()
    expect(doubled.value).toBe(4)
  })
})
```

### 2. Testing Components with Composition API

```typescript
// Testing components that use composables
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '../Button.vue'

describe('Button', () => {
  it('should handle loading state', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })
    
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
    
    await wrapper.setProps({ loading: false })
    await nextTick()
    
    expect(wrapper.classes()).not.toContain('is-loading')
  })
})
```

## Best Practices

### 1. Composable Design Principles

- **Single Responsibility**: Each composable should have one clear purpose
- **Reusability**: Design composables to be reusable across components
- **Testability**: Make composables easy to test in isolation
- **Type Safety**: Provide comprehensive TypeScript types

### 2. Performance Guidelines

- Use `shallowRef` for large objects that don't need deep reactivity
- Prefer `computed` over `watch` for derived state
- Use `readonly` to prevent accidental mutations
- Implement proper cleanup in `onUnmounted`

### 3. Code Organization

- Group related composables in dedicated files
- Use consistent naming conventions
- Provide comprehensive JSDoc comments
- Export types alongside composables

## Conclusion

Element Plus demonstrates excellent use of Vue 3's Composition API, showcasing:

- **Modular Architecture**: Well-organized composables for specific concerns
- **Type Safety**: Comprehensive TypeScript integration
- **Performance**: Optimized reactivity and computed properties
- **Reusability**: Composables that can be used across multiple components
- **Maintainability**: Clear separation of concerns and testable code

These patterns provide excellent guidance for building modern Vue 3 applications with the Composition API.