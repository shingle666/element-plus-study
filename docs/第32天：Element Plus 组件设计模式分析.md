# 第32天：Element Plus 组件设计模式分析

## 学习目标
- 掌握 Element Plus 中常用的设计模式
- 理解组件间的通信机制
- 学习组件的可扩展性设计
- 了解组件的生命周期管理

## 学习内容

### 1. 常用设计模式

#### 1.1 工厂模式 (Factory Pattern)
用于创建不同类型的组件实例

```typescript
// 消息组件工厂
const createMessage = (type: string, options: MessageOptions) => {
  switch (type) {
    case 'success':
      return new SuccessMessage(options)
    case 'error':
      return new ErrorMessage(options)
    case 'warning':
      return new WarningMessage(options)
    default:
      return new InfoMessage(options)
  }
}
```

#### 1.2 观察者模式 (Observer Pattern)
用于组件间的事件通信

```typescript
// 表单验证观察者
class FormValidator {
  private observers: Array<(valid: boolean) => void> = []
  
  subscribe(callback: (valid: boolean) => void) {
    this.observers.push(callback)
  }
  
  notify(valid: boolean) {
    this.observers.forEach(callback => callback(valid))
  }
}
```

#### 1.3 策略模式 (Strategy Pattern)
用于不同的验证策略

```typescript
// 表单验证策略
interface ValidationStrategy {
  validate(value: any): boolean
}

class RequiredStrategy implements ValidationStrategy {
  validate(value: any): boolean {
    return value !== null && value !== undefined && value !== ''
  }
}

class EmailStrategy implements ValidationStrategy {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }
}
```

#### 1.4 装饰器模式 (Decorator Pattern)
用于功能增强

```typescript
// 组件功能装饰器
function withLoading<T extends ComponentConstructor>(Component: T) {
  return class extends Component {
    loading = ref(false)
    
    async executeWithLoading(fn: () => Promise<any>) {
      this.loading.value = true
      try {
        await fn()
      } finally {
        this.loading.value = false
      }
    }
  }
}
```

### 2. 组件通信机制

#### 2.1 Props Down, Events Up
```vue
<!-- 父组件 -->
<template>
  <el-form @submit="handleSubmit">
    <el-form-item :rules="rules" prop="username">
      <el-input v-model="form.username" @change="handleChange" />
    </el-form-item>
  </el-form>
</template>
```

#### 2.2 Provide/Inject
```typescript
// 表单组件提供上下文
const FormContextKey = Symbol('FormContext')

// 父组件提供
const formContext = {
  model: formModel,
  rules: formRules,
  validateField: (prop: string) => { /* ... */ }
}
provide(FormContextKey, formContext)

// 子组件注入
const formContext = inject(FormContextKey)
```

#### 2.3 Event Bus
```typescript
// 全局事件总线
class EventBus {
  private events: Map<string, Function[]> = new Map()
  
  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(callback)
  }
  
  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }
}
```

### 3. 组件可扩展性设计

#### 3.1 插槽系统
```vue
<template>
  <div class="el-card">
    <div class="el-card__header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="el-card__body">
      <slot></slot>
    </div>
    <div class="el-card__footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
```

#### 3.2 渲染函数
```typescript
// 动态渲染
const renderContent = () => {
  if (props.render) {
    return props.render()
  }
  if (slots.default) {
    return slots.default()
  }
  return h('span', props.content)
}
```

#### 3.3 混入 (Mixins) 和组合式函数
```typescript
// 组合式函数
export function useFormValidation() {
  const errors = ref<Record<string, string>>({})
  const isValid = computed(() => Object.keys(errors.value).length === 0)
  
  const validate = (rules: ValidationRule[], value: any) => {
    // 验证逻辑
  }
  
  return {
    errors,
    isValid,
    validate
  }
}
```

### 4. 生命周期管理

#### 4.1 组件生命周期
```typescript
// 组件生命周期钩子
export default defineComponent({
  setup() {
    onMounted(() => {
      // 组件挂载后的初始化
    })
    
    onBeforeUnmount(() => {
      // 清理工作
    })
    
    onUpdated(() => {
      // 组件更新后的处理
    })
  }
})
```

#### 4.2 资源清理
```typescript
// 自动清理的组合式函数
export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  onMounted(() => target.addEventListener(event, handler))
  onBeforeUnmount(() => target.removeEventListener(event, handler))
}
```

### 5. 实践练习

#### 练习1：设计模式识别
1. 分析 el-message 组件的工厂模式实现
2. 研究 el-form 组件的观察者模式应用
3. 理解 el-table 组件的策略模式使用

#### 练习2：组件通信实现
1. 实现一个简单的表单组件
2. 使用 provide/inject 实现上下文传递
3. 添加事件通信机制

#### 练习3：可扩展性设计
1. 设计一个支持多种渲染方式的组件
2. 实现插槽和渲染函数的结合使用
3. 创建可复用的组合式函数

## 学习资源
- [Vue 3 设计模式](https://vuejs.org/guide/reusability/composables.html)
- [TypeScript 设计模式](https://refactoring.guru/design-patterns/typescript)
- [Element Plus 源码分析](https://github.com/element-plus/element-plus)

## 作业
1. 总结 Element Plus 中使用的设计模式
2. 实现一个使用多种设计模式的组件
3. 分析组件间通信的最佳实践

## 下一步
明天我们将学习 Element Plus 中 Vue 3 Composition API 的应用。