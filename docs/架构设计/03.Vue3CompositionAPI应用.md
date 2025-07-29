# 第33天：Element Plus 中 Vue 3 Composition API 应用

## 学习目标
- 深入理解 Composition API 在 Element Plus 中的应用
- 掌握组合式函数的设计和使用
- 学习响应式系统的高级用法
- 了解 Composition API 的最佳实践

## 学习内容

### 1. Composition API 基础回顾

#### 1.1 setup 函数
```typescript
import { defineComponent, ref, computed, onMounted } from 'vue'

export default defineComponent({
  name: 'ElButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    disabled: Boolean
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    // 响应式数据
    const buttonRef = ref<HTMLButtonElement>()
    const loading = ref(false)
    
    // 计算属性
    const buttonClass = computed(() => {
      return [
        'el-button',
        `el-button--${props.type}`,
        props.size && `el-button--${props.size}`,
        {
          'is-disabled': props.disabled,
          'is-loading': loading.value
        }
      ]
    })
    
    // 方法
    const handleClick = (event: MouseEvent) => {
      if (props.disabled || loading.value) return
      emit('click', event)
    }
    
    // 生命周期
    onMounted(() => {
      console.log('Button mounted')
    })
    
    return {
      buttonRef,
      loading,
      buttonClass,
      handleClick
    }
  }
})
```

### 2. 组合式函数 (Composables)

#### 2.1 useNamespace - 命名空间管理
```typescript
// packages/hooks/use-namespace/index.ts
export const useNamespace = (block: string) => {
  const namespace = computed(() => {
    return useGlobalConfig('namespace', defaultNamespace)
  })
  
  const b = (blockSuffix = '') => 
    `${namespace.value}-${block}${blockSuffix ? `-${blockSuffix}` : ''}`
  
  const e = (element: string) => 
    element ? `${b()}__${element}` : ''
  
  const m = (modifier: string) => 
    modifier ? `${b()}--${modifier}` : ''
  
  const be = (blockSuffix: string, element: string) => 
    `${b(blockSuffix)}__${element}`
  
  const em = (element: string, modifier: string) => 
    `${e(element)}--${modifier}`
  
  const bm = (blockSuffix: string, modifier: string) => 
    `${b(blockSuffix)}--${modifier}`
  
  const bem = (blockSuffix: string, element: string, modifier: string) => 
    `${be(blockSuffix, element)}--${modifier}`
  
  const is = (name: string, state?: boolean | undefined) => 
    name && state ? `is-${name}` : ''
  
  return {
    namespace,
    b, e, m, be, em, bm, bem, is
  }
}
```

#### 2.2 useFormItem - 表单项管理
```typescript
// packages/hooks/use-form-item/index.ts
export const useFormItem = () => {
  const form = inject(formContextKey, undefined)
  const formItem = inject(formItemContextKey, undefined)
  
  return {
    form,
    formItem
  }
}

export const useFormItemInputId = (props: any, { formItemContext }: any) => {
  const inputId = ref<string>()
  
  onMounted(() => {
    inputId.value = props.id || formItemContext?.inputIds?.[0] || useId().value
  })
  
  return {
    inputId
  }
}
```

#### 2.3 useSize - 尺寸管理
```typescript
// packages/hooks/use-size/index.ts
export const useSize = (
  fallback?: MaybeRef<ComponentSize | ''>,
  ignore: Partial<Record<'prop' | 'form' | 'formItem' | 'global', boolean>> = {}
) => {
  const emptyRef = ref(undefined)
  
  const size = computed((): ComponentSize => {
    return (
      (!ignore.prop ? unref(fallback) : undefined) ||
      (!ignore.formItem ? formItemContext?.size : undefined) ||
      (!ignore.form ? formContext?.size : undefined) ||
      (!ignore.global ? globalConfig.value?.size : undefined) ||
      ''
    )
  })
  
  return {
    size: readonly(size)
  }
}
```

#### 2.4 useDisabled - 禁用状态管理
```typescript
// packages/hooks/use-disabled/index.ts
export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = computed(() => {
    return (
      unref(fallback) ||
      formContext?.disabled ||
      false
    )
  })
  
  return {
    disabled: readonly(disabled)
  }
}
```

### 3. 响应式系统高级用法

#### 3.1 自定义 ref
```typescript
// 自定义 ref 实现双向绑定
export function useVModel<T>(
  props: Record<string, any>,
  key: string,
  emit: (event: string, ...args: any[]) => void
) {
  return computed<T>({
    get() {
      return props[key]
    },
    set(value) {
      emit(`update:${key}`, value)
    }
  })
}
```

#### 3.2 watchEffect 的应用
```typescript
// 自动清理的副作用
export function useEventListener(
  target: MaybeRef<EventTarget | null>,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) {
  let cleanup = () => {}
  
  const stopWatcher = watchEffect(() => {
    const element = unref(target)
    if (!element) return
    
    element.addEventListener(event, handler, options)
    
    cleanup = () => {
      element.removeEventListener(event, handler, options)
    }
  })
  
  const stop = () => {
    cleanup()
    stopWatcher()
  }
  
  tryOnScopeDispose(stop)
  
  return stop
}
```

#### 3.3 响应式工具函数
```typescript
// 防抖的响应式函数
export function useDebouncedRef<T>(value: T, delay = 200) {
  const debounced = ref(value)
  const immediate = ref(value)
  
  watchEffect(() => {
    immediate.value = value
  })
  
  watch(
    immediate,
    (newValue) => {
      const timer = setTimeout(() => {
        debounced.value = newValue
      }, delay)
      
      return () => clearTimeout(timer)
    },
    { flush: 'sync' }
  )
  
  return debounced
}
```

### 4. Element Plus 中的实际应用

#### 4.1 Input 组件的 Composition API 应用
```typescript
// packages/components/input/src/input.vue
export default defineComponent({
  name: 'ElInput',
  setup(props, { emit, slots, expose }) {
    const ns = useNamespace('input')
    const { form, formItem } = useFormItem()
    const { inputId } = useFormItemInputId(props, { formItemContext: formItem })
    const { size } = useSize()
    const { disabled } = useDisabled()
    
    const input = ref<HTMLInputElement>()
    const textarea = ref<HTMLTextAreaElement>()
    
    const focused = ref(false)
    const hovering = ref(false)
    const isComposing = ref(false)
    
    const nativeInputValue = computed(() => 
      props.modelValue === null || props.modelValue === undefined 
        ? '' 
        : String(props.modelValue)
    )
    
    const showClear = computed(() => 
      props.clearable &&
      !disabled.value &&
      !props.readonly &&
      !!nativeInputValue.value &&
      (focused.value || hovering.value)
    )
    
    const setNativeInputValue = () => {
      const inputElement = input.value || textarea.value
      if (!inputElement || inputElement.value === nativeInputValue.value) return
      inputElement.value = nativeInputValue.value
    }
    
    const handleInput = async (event: Event) => {
      const { value } = event.target as HTMLInputElement
      
      if (isComposing.value) return
      
      if (value === nativeInputValue.value) {
        setNativeInputValue()
        return
      }
      
      emit('update:modelValue', value)
      emit('input', value)
      
      await nextTick()
      setNativeInputValue()
    }
    
    const focus = async () => {
      await nextTick()
      input.value?.focus()
    }
    
    const blur = () => {
      input.value?.blur()
    }
    
    expose({
      input,
      textarea,
      ref: input,
      textareaRef: textarea,
      focus,
      blur
    })
    
    return {
      ns,
      input,
      textarea,
      focused,
      hovering,
      showClear,
      handleInput,
      focus,
      blur
    }
  }
})
```

### 5. 实践练习

#### 练习1：创建组合式函数
```typescript
// 创建一个表单验证的组合式函数
export function useFormValidation() {
  const errors = ref<Record<string, string[]>>({})
  const isValidating = ref(false)
  
  const validate = async (rules: ValidationRule[], value: any, prop: string) => {
    isValidating.value = true
    const fieldErrors: string[] = []
    
    for (const rule of rules) {
      try {
        await rule.validator(value)
      } catch (error) {
        fieldErrors.push(error.message)
      }
    }
    
    if (fieldErrors.length > 0) {
      errors.value[prop] = fieldErrors
    } else {
      delete errors.value[prop]
    }
    
    isValidating.value = false
    return fieldErrors.length === 0
  }
  
  const clearValidation = (prop?: string) => {
    if (prop) {
      delete errors.value[prop]
    } else {
      errors.value = {}
    }
  }
  
  const isValid = computed(() => Object.keys(errors.value).length === 0)
  
  return {
    errors: readonly(errors),
    isValidating: readonly(isValidating),
    isValid,
    validate,
    clearValidation
  }
}
```

#### 练习2：实现自定义指令
```typescript
// 创建一个点击外部的指令
export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handler = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event)
      }
    }
    
    el._clickOutsideHandler = handler
    document.addEventListener('click', handler)
  },
  
  beforeUnmount(el: HTMLElement) {
    document.removeEventListener('click', el._clickOutsideHandler)
    delete el._clickOutsideHandler
  }
}
```

## 学习资源
- [Vue 3 Composition API 官方文档](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Element Plus Hooks 源码](https://github.com/element-plus/element-plus/tree/dev/packages/hooks)
- [VueUse 组合式函数库](https://vueuse.org/)

## 作业
1. 分析 Element Plus 中的 5 个组合式函数
2. 实现一个自定义的组合式函数
3. 创建一个使用多个 hooks 的组件

## 下一步
明天我们将学习 Element Plus 的 TypeScript 类型系统解析。