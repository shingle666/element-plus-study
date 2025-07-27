# 第34天：Element Plus 组件通信机制深入

## 学习目标
- 深入理解 Element Plus 组件间通信机制
- 掌握 Props、Events、Provide/Inject 的高级用法
- 学习组件状态管理和数据流控制
- 实践复杂组件通信场景

## 学习内容

### 1. Props 通信机制

#### 1.1 Props 类型定义与验证
```typescript
// Element Plus 中的 Props 定义模式
import { ExtractPropTypes, PropType } from 'vue'

// 基础 Props 定义
export const buttonProps = {
  size: {
    type: String as PropType<'large' | 'default' | 'small'>,
    default: 'default',
    validator: (value: string) => ['large', 'default', 'small'].includes(value)
  },
  type: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
```

#### 1.2 复杂 Props 处理
```vue
<template>
  <div class="complex-component">
    <el-form :model="formData" :rules="computedRules">
      <el-form-item 
        v-for="field in normalizedFields" 
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
      >
        <component 
          :is="field.component"
          v-model="formData[field.prop]"
          v-bind="field.attrs"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface FieldConfig {
  prop: string
  label: string
  component: string
  attrs?: Record<string, any>
  rules?: any[]
}

interface Props {
  fields: FieldConfig[]
  modelValue: Record<string, any>
  globalRules?: Record<string, any[]>
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  modelValue: () => ({}),
  globalRules: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

// 标准化字段配置
const normalizedFields = computed(() => {
  return props.fields.map(field => ({
    ...field,
    attrs: {
      placeholder: `请输入${field.label}`,
      clearable: true,
      ...field.attrs
    }
  }))
})

// 计算验证规则
const computedRules = computed(() => {
  const rules: Record<string, any[]> = { ...props.globalRules }
  
  props.fields.forEach(field => {
    if (field.rules) {
      rules[field.prop] = field.rules
    }
  })
  
  return rules
})

// 响应式表单数据
const formData = reactive({ ...props.modelValue })

// 监听表单数据变化
watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })
</script>
```

### 2. Events 事件通信

#### 2.1 事件定义与触发
```typescript
// Element Plus 事件定义模式
export interface FormEmits {
  submit: [formData: Record<string, any>]
  reset: []
  validate: [prop: string, isValid: boolean, message: string]
  'field-change': [prop: string, value: any, oldValue: any]
}

// 在组件中使用
const emit = defineEmits<FormEmits>()

// 触发事件的函数
const handleSubmit = async () => {
  try {
    const isValid = await formRef.value?.validate()
    if (isValid) {
      emit('submit', formData)
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const handleFieldChange = (prop: string, newValue: any, oldValue: any) => {
  emit('field-change', prop, newValue, oldValue)
}
```

#### 2.2 事件修饰符与高级用法
```vue
<template>
  <div class="event-demo">
    <!-- 事件修饰符 -->
    <el-button @click.stop="handleClick">阻止冒泡</el-button>
    <el-button @click.prevent="handleClick">阻止默认行为</el-button>
    <el-button @click.once="handleClick">只触发一次</el-button>
    
    <!-- 键盘事件 -->
    <el-input 
      @keyup.enter="handleEnter"
      @keyup.esc="handleEscape"
      @keyup.ctrl.s="handleSave"
    />
    
    <!-- 自定义事件处理 -->
    <custom-component 
      @custom-event="handleCustomEvent"
      @update:visible="handleVisibilityChange"
    />
  </div>
</template>

<script setup>
// 事件处理函数
const handleClick = (event: MouseEvent) => {
  console.log('Button clicked:', event)
}

const handleEnter = () => {
  console.log('Enter key pressed')
}

const handleCustomEvent = (payload: any) => {
  console.log('Custom event received:', payload)
}
</script>
```

### 3. Provide/Inject 依赖注入

#### 3.1 基础依赖注入
```typescript
// 定义注入键
export const formContextKey = Symbol('formContext') as InjectionKey<FormContext>
export const configProviderContextKey = Symbol('configProvider') as InjectionKey<ConfigProviderContext>

// 提供者组件
interface FormContext {
  model: Record<string, any>
  rules: Record<string, any[]>
  validateField: (prop: string) => Promise<boolean>
  clearValidate: (prop?: string) => void
}

// 在 Form 组件中提供上下文
const formContext: FormContext = {
  model: formData,
  rules: formRules,
  validateField,
  clearValidate
}

provide(formContextKey, formContext)

// 在 FormItem 组件中注入上下文
const formContext = inject(formContextKey, null)

if (!formContext) {
  console.warn('FormItem must be used within Form component')
}
```

#### 3.2 响应式依赖注入
```vue
<!-- 配置提供者组件 -->
<template>
  <div class="config-provider">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, computed } from 'vue'

interface ConfigProviderProps {
  locale?: string
  theme?: 'light' | 'dark'
  size?: 'large' | 'default' | 'small'
  zIndex?: number
}

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  locale: 'zh-cn',
  theme: 'light',
  size: 'default',
  zIndex: 2000
})

// 响应式配置
const config = reactive({
  locale: computed(() => props.locale),
  theme: computed(() => props.theme),
  size: computed(() => props.size),
  zIndex: computed(() => props.zIndex)
})

// 提供配置
provide(configProviderContextKey, config)
</script>
```

### 4. 组件状态管理

#### 4.1 本地状态管理
```typescript
// 使用 Composition API 管理组件状态
import { ref, reactive, computed, watch } from 'vue'

export function useComponentState() {
  // 基础状态
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = reactive<Record<string, any>>({})
  
  // 计算属性
  const hasError = computed(() => error.value !== null)
  const isEmpty = computed(() => Object.keys(data).length === 0)
  
  // 状态操作方法
  const setLoading = (value: boolean) => {
    loading.value = value
  }
  
  const setError = (message: string | null) => {
    error.value = message
  }
  
  const updateData = (newData: Record<string, any>) => {
    Object.assign(data, newData)
  }
  
  const resetState = () => {
    loading.value = false
    error.value = null
    Object.keys(data).forEach(key => {
      delete data[key]
    })
  }
  
  // 监听状态变化
  watch(error, (newError) => {
    if (newError) {
      console.error('Component error:', newError)
    }
  })
  
  return {
    // 状态
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    
    // 计算属性
    hasError,
    isEmpty,
    
    // 方法
    setLoading,
    setError,
    updateData,
    resetState
  }
}
```

#### 4.2 跨组件状态共享
```typescript
// 全局状态管理
import { ref, reactive } from 'vue'

// 全局状态
const globalState = reactive({
  user: null as any,
  theme: 'light' as 'light' | 'dark',
  locale: 'zh-cn',
  loading: false
})

// 状态管理器
export class StateManager {
  private static instance: StateManager
  private state = globalState
  
  static getInstance() {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager()
    }
    return StateManager.instance
  }
  
  getState() {
    return this.state
  }
  
  updateUser(user: any) {
    this.state.user = user
  }
  
  updateTheme(theme: 'light' | 'dark') {
    this.state.theme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }
  
  updateLocale(locale: string) {
    this.state.locale = locale
  }
  
  setLoading(loading: boolean) {
    this.state.loading = loading
  }
}

// 在组件中使用
export function useGlobalState() {
  const stateManager = StateManager.getInstance()
  return {
    state: stateManager.getState(),
    updateUser: stateManager.updateUser.bind(stateManager),
    updateTheme: stateManager.updateTheme.bind(stateManager),
    updateLocale: stateManager.updateLocale.bind(stateManager),
    setLoading: stateManager.setLoading.bind(stateManager)
  }
}
```

### 5. 事件总线模式

#### 5.1 简单事件总线
```typescript
// 事件总线实现
type EventHandler = (...args: any[]) => void

class EventBus {
  private events: Map<string, EventHandler[]> = new Map()
  
  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(handler)
  }
  
  off(event: string, handler?: EventHandler) {
    if (!this.events.has(event)) return
    
    if (handler) {
      const handlers = this.events.get(event)!
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    } else {
      this.events.delete(event)
    }
  }
  
  emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return
    
    const handlers = this.events.get(event)!
    handlers.forEach(handler => {
      try {
        handler(...args)
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error)
      }
    })
  }
  
  once(event: string, handler: EventHandler) {
    const onceHandler = (...args: any[]) => {
      handler(...args)
      this.off(event, onceHandler)
    }
    this.on(event, onceHandler)
  }
}

// 全局事件总线实例
export const eventBus = new EventBus()
```

#### 5.2 在组件中使用事件总线
```vue
<template>
  <div class="event-bus-demo">
    <el-button @click="sendMessage">发送消息</el-button>
    <el-button @click="sendNotification">发送通知</el-button>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { eventBus } from './eventBus'

// 发送消息
const sendMessage = () => {
  eventBus.emit('message', {
    type: 'info',
    content: '这是一条消息',
    timestamp: Date.now()
  })
}

// 发送通知
const sendNotification = () => {
  eventBus.emit('notification', {
    title: '新通知',
    message: '您有一条新消息',
    type: 'success'
  })
}

// 监听消息
const handleMessage = (data: any) => {
  console.log('Received message:', data)
  ElMessage({
    message: data.content,
    type: data.type
  })
}

// 监听通知
const handleNotification = (data: any) => {
  console.log('Received notification:', data)
  ElNotification({
    title: data.title,
    message: data.message,
    type: data.type
  })
}

onMounted(() => {
  eventBus.on('message', handleMessage)
  eventBus.on('notification', handleNotification)
})

onBeforeUnmount(() => {
  eventBus.off('message', handleMessage)
  eventBus.off('notification', handleNotification)
})
</script>
```

### 6. 实践练习

#### 练习1：复杂表单通信
```vue
<template>
  <div class="complex-form">
    <el-form ref="formRef" :model="formData" :rules="rules">
      <!-- 基础信息 -->
      <form-section title="基础信息">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" @change="handleFieldChange" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" @change="handleFieldChange" />
        </el-form-item>
      </form-section>
      
      <!-- 联系信息 -->
      <form-section title="联系信息">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" @change="handleFieldChange" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" @change="handleFieldChange" />
        </el-form-item>
      </form-section>
      
      <!-- 动态字段 -->
      <dynamic-fields 
        v-model="formData.dynamicFields"
        @field-add="handleFieldAdd"
        @field-remove="handleFieldRemove"
      />
    </el-form>
    
    <div class="form-actions">
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'

// 表单数据
const formData = reactive({
  name: '',
  age: null,
  email: '',
  phone: '',
  dynamicFields: []
})

// 表单引用
const formRef = ref()

// 验证规则
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  email: [{ required: true, type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]
}

// 提供表单上下文
provide('formContext', {
  formData,
  formRef,
  rules
})

// 事件处理
const handleFieldChange = (value, prop) => {
  console.log(`Field ${prop} changed to:`, value)
  eventBus.emit('form-field-change', { prop, value })
}

const handleFieldAdd = (field) => {
  formData.dynamicFields.push(field)
}

const handleFieldRemove = (index) => {
  formData.dynamicFields.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('Form submitted:', formData)
      eventBus.emit('form-submit', formData)
    }
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

const handleReset = () => {
  formRef.value.resetFields()
  formData.dynamicFields = []
  eventBus.emit('form-reset')
}
</script>
```

## 学习资源
- [Vue 3 组件通信](https://cn.vuejs.org/guide/components/)
- [Element Plus 源码分析](https://github.com/element-plus/element-plus)
- [TypeScript 类型定义](https://www.typescriptlang.org/docs/)

## 作业
1. 实现一个复杂的表单组件，包含多种通信方式
2. 创建一个事件总线系统，支持组件间通信
3. 分析 Element Plus 中 Table 组件的通信机制

## 下一步
明天我们将学习 Element Plus 的响应式系统与数据绑定机制。