# Component Design Patterns

## Overview

Element Plus follows established design patterns that ensure consistency, maintainability, and reusability across all components. This document explores the key design patterns used throughout the library.

## Core Design Patterns

### 1. Compound Component Pattern

Compound components work together to form a complete UI element, where the parent component manages shared state and child components handle specific functionality.

```vue
<!-- Form compound component -->
<template>
  <el-form :model="form" :rules="rules">
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: 'Username is required' }],
  password: [{ required: true, message: 'Password is required' }]
}
</script>
```

**Benefits:**
- Clear separation of concerns
- Flexible composition
- Shared state management
- Consistent API across related components

### 2. Render Props Pattern

Components that accept functions as props to customize rendering behavior.

```vue
<!-- Table with custom cell rendering -->
<template>
  <el-table :data="tableData">
    <el-table-column label="Name" prop="name" />
    <el-table-column label="Status">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="Actions">
      <template #default="{ row, $index }">
        <el-button size="small" @click="handleEdit(row, $index)">
          Edit
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(row, $index)">
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const getStatusType = (status) => {
  const typeMap = {
    active: 'success',
    inactive: 'info',
    pending: 'warning',
    error: 'danger'
  }
  return typeMap[status] || 'info'
}

const handleEdit = (row, index) => {
  console.log('Edit:', row, index)
}

const handleDelete = (row, index) => {
  console.log('Delete:', row, index)
}
</script>
```

**Benefits:**
- High flexibility in rendering
- Reusable component logic
- Custom presentation without component modification

### 3. Provider Pattern

Used for sharing state and functionality across component hierarchies without prop drilling.

```vue
<!-- Form Provider -->
<script setup>
import { provide, reactive } from 'vue'

const formState = reactive({
  model: {},
  rules: {},
  errors: {}
})

const formMethods = {
  validate: (callback) => {
    // Validation logic
  },
  validateField: (prop, callback) => {
    // Field validation logic
  },
  resetFields: () => {
    // Reset logic
  }
}

// Provide form context
provide('elForm', {
  ...formState,
  ...formMethods
})
</script>

<!-- Form Item Consumer -->
<script setup>
import { inject, computed } from 'vue'

const elForm = inject('elForm', {})

const fieldError = computed(() => {
  return elForm.errors?.[props.prop]
})

const validateField = () => {
  elForm.validateField?.(props.prop)
}
</script>
```

**Benefits:**
- Eliminates prop drilling
- Centralized state management
- Loose coupling between components

### 4. Higher-Order Component Pattern

Components that enhance other components with additional functionality.

```vue
<!-- Loading HOC -->
<template>
  <div class="loading-wrapper" :class="{ 'is-loading': loading }">
    <div v-if="loading" class="loading-mask">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <p v-if="loadingText">{{ loadingText }}</p>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
interface Props {
  loading?: boolean
  loadingText?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: 'Loading...'
})
</script>

<!-- Usage -->
<template>
  <LoadingWrapper :loading="isLoading" loading-text="Fetching data...">
    <el-table :data="tableData">
      <!-- table content -->
    </el-table>
  </LoadingWrapper>
</template>
```

**Benefits:**
- Reusable functionality
- Separation of concerns
- Enhanced component capabilities

### 5. Factory Pattern

Creating components or services dynamically based on configuration.

```typescript
// Message factory
class MessageFactory {
  static create(type: 'success' | 'warning' | 'error' | 'info', options: MessageOptions) {
    const baseConfig = {
      duration: 3000,
      showClose: false,
      center: false
    }
    
    const typeConfigs = {
      success: {
        icon: SuccessIcon,
        customClass: 'el-message--success'
      },
      warning: {
        icon: WarningIcon,
        customClass: 'el-message--warning'
      },
      error: {
        icon: ErrorIcon,
        customClass: 'el-message--error',
        duration: 5000 // Longer duration for errors
      },
      info: {
        icon: InfoIcon,
        customClass: 'el-message--info'
      }
    }
    
    return {
      ...baseConfig,
      ...typeConfigs[type],
      ...options
    }
  }
}

// Usage
const successMessage = MessageFactory.create('success', {
  message: 'Operation completed successfully!'
})

const errorMessage = MessageFactory.create('error', {
  message: 'An error occurred',
  showClose: true
})
```

**Benefits:**
- Consistent object creation
- Centralized configuration
- Easy to extend and modify

## Component Composition Patterns

### 1. Slot-based Composition

```vue
<!-- Card component with multiple slots -->
<template>
  <div class="el-card">
    <div v-if="$slots.header" class="el-card__header">
      <slot name="header" />
    </div>
    <div class="el-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="el-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<!-- Usage -->
<template>
  <el-card>
    <template #header>
      <h3>Card Title</h3>
    </template>
    
    <p>Card content goes here</p>
    
    <template #footer>
      <el-button type="primary">Action</el-button>
    </template>
  </el-card>
</template>
```

### 2. Scoped Slots for Data Sharing

```vue
<!-- List component with scoped slots -->
<template>
  <div class="el-list">
    <div 
      v-for="(item, index) in items" 
      :key="getItemKey(item, index)"
      class="el-list__item"
    >
      <slot 
        :item="item" 
        :index="index" 
        :isFirst="index === 0"
        :isLast="index === items.length - 1"
      >
        <!-- Default content -->
        {{ item }}
      </slot>
    </div>
  </div>
</template>

<!-- Usage -->
<template>
  <el-list :items="users">
    <template #default="{ item, index, isFirst, isLast }">
      <div class="user-item" :class="{ 'is-first': isFirst, 'is-last': isLast }">
        <el-avatar :src="item.avatar" />
        <div class="user-info">
          <h4>{{ item.name }}</h4>
          <p>{{ item.email }}</p>
        </div>
        <el-badge :value="item.unreadCount" :hidden="item.unreadCount === 0" />
      </div>
    </template>
  </el-list>
</template>
```

### 3. Dynamic Component Composition

```vue
<!-- Dynamic form field component -->
<template>
  <el-form-item :label="field.label" :prop="field.prop">
    <component 
      :is="getFieldComponent(field.type)"
      v-model="modelValue[field.prop]"
      v-bind="field.props"
      @change="handleFieldChange(field.prop, $event)"
    />
  </el-form-item>
</template>

<script setup>
const fieldComponents = {
  input: 'el-input',
  select: 'el-select',
  'date-picker': 'el-date-picker',
  switch: 'el-switch',
  radio: 'el-radio-group',
  checkbox: 'el-checkbox-group'
}

const getFieldComponent = (type) => {
  return fieldComponents[type] || 'el-input'
}

const handleFieldChange = (prop, value) => {
  emit('field-change', { prop, value })
}
</script>

<!-- Usage -->
<template>
  <el-form :model="form">
    <DynamicField
      v-for="field in formFields"
      :key="field.prop"
      :field="field"
      v-model="form"
      @field-change="handleFieldChange"
    />
  </el-form>
</template>

<script setup>
const formFields = [
  {
    type: 'input',
    prop: 'name',
    label: 'Name',
    props: { placeholder: 'Enter your name' }
  },
  {
    type: 'select',
    prop: 'country',
    label: 'Country',
    props: { 
      placeholder: 'Select country',
      options: countries
    }
  },
  {
    type: 'date-picker',
    prop: 'birthDate',
    label: 'Birth Date',
    props: { type: 'date' }
  }
]
</script>
```

## State Management Patterns

### 1. Local State Pattern

```vue
<!-- Component with local state -->
<template>
  <div class="counter">
    <el-button @click="decrement" :disabled="count <= 0">-</el-button>
    <span class="count">{{ count }}</span>
    <el-button @click="increment" :disabled="count >= max">+</el-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

interface Props {
  initialValue?: number
  max?: number
  min?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: 0,
  max: 100,
  min: 0
})

const emit = defineEmits<{
  change: [value: number]
}>()

const count = ref(props.initialValue)

const increment = () => {
  if (count.value < props.max) {
    count.value++
    emit('change', count.value)
  }
}

const decrement = () => {
  if (count.value > props.min) {
    count.value--
    emit('change', count.value)
  }
}
</script>
```

### 2. Shared State Pattern

```typescript
// Composable for shared state
export function useSharedCounter() {
  const count = ref(0)
  const history = ref<number[]>([])
  
  const increment = () => {
    history.value.push(count.value)
    count.value++
  }
  
  const decrement = () => {
    if (count.value > 0) {
      history.value.push(count.value)
      count.value--
    }
  }
  
  const reset = () => {
    history.value.push(count.value)
    count.value = 0
  }
  
  const undo = () => {
    if (history.value.length > 0) {
      count.value = history.value.pop()!
    }
  }
  
  return {
    count: readonly(count),
    history: readonly(history),
    increment,
    decrement,
    reset,
    undo
  }
}

// Usage in multiple components
const { count, increment, decrement, reset, undo } = useSharedCounter()
```

### 3. Store Pattern

```typescript
// Simple store implementation
class ComponentStore {
  private state = reactive({
    loading: false,
    data: null,
    error: null
  })
  
  get isLoading() {
    return this.state.loading
  }
  
  get data() {
    return this.state.data
  }
  
  get error() {
    return this.state.error
  }
  
  async fetchData(url: string) {
    this.state.loading = true
    this.state.error = null
    
    try {
      const response = await fetch(url)
      this.state.data = await response.json()
    } catch (error) {
      this.state.error = error.message
    } finally {
      this.state.loading = false
    }
  }
  
  clearData() {
    this.state.data = null
    this.state.error = null
  }
}

// Usage
const store = new ComponentStore()

// In component
const { isLoading, data, error } = toRefs(store)
```

## Event Handling Patterns

### 1. Event Bus Pattern

```typescript
// Event bus implementation
class EventBus {
  private events: Record<string, Function[]> = {}
  
  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  off(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
  
  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }
}

const eventBus = new EventBus()

// Component A
eventBus.on('user-updated', (user) => {
  console.log('User updated:', user)
})

// Component B
const updateUser = (user) => {
  // Update user logic
  eventBus.emit('user-updated', user)
}
```

### 2. Command Pattern

```typescript
// Command interface
interface Command {
  execute(): void
  undo(): void
}

// Concrete commands
class AddItemCommand implements Command {
  constructor(
    private list: any[],
    private item: any
  ) {}
  
  execute() {
    this.list.push(this.item)
  }
  
  undo() {
    const index = this.list.indexOf(this.item)
    if (index > -1) {
      this.list.splice(index, 1)
    }
  }
}

class RemoveItemCommand implements Command {
  private removedIndex: number = -1
  
  constructor(
    private list: any[],
    private item: any
  ) {}
  
  execute() {
    this.removedIndex = this.list.indexOf(this.item)
    if (this.removedIndex > -1) {
      this.list.splice(this.removedIndex, 1)
    }
  }
  
  undo() {
    if (this.removedIndex > -1) {
      this.list.splice(this.removedIndex, 0, this.item)
    }
  }
}

// Command manager
class CommandManager {
  private history: Command[] = []
  private currentIndex = -1
  
  execute(command: Command) {
    // Remove any commands after current index
    this.history = this.history.slice(0, this.currentIndex + 1)
    
    command.execute()
    this.history.push(command)
    this.currentIndex++
  }
  
  undo() {
    if (this.currentIndex >= 0) {
      const command = this.history[this.currentIndex]
      command.undo()
      this.currentIndex--
    }
  }
  
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      const command = this.history[this.currentIndex]
      command.execute()
    }
  }
}
```

## Validation Patterns

### 1. Schema-based Validation

```typescript
// Validation schema
interface ValidationRule {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any) => boolean | string
}

interface ValidationSchema {
  [field: string]: ValidationRule[]
}

// Validator class
class FormValidator {
  constructor(private schema: ValidationSchema) {}
  
  validate(data: Record<string, any>) {
    const errors: Record<string, string[]> = {}
    
    for (const field in this.schema) {
      const rules = this.schema[field]
      const value = data[field]
      const fieldErrors: string[] = []
      
      for (const rule of rules) {
        const error = this.validateRule(value, rule, field)
        if (error) {
          fieldErrors.push(error)
        }
      }
      
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors
      }
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  private validateRule(value: any, rule: ValidationRule, field: string): string | null {
    if (rule.required && (value === null || value === undefined || value === '')) {
      return `${field} is required`
    }
    
    if (rule.min && value.length < rule.min) {
      return `${field} must be at least ${rule.min} characters`
    }
    
    if (rule.max && value.length > rule.max) {
      return `${field} must be no more than ${rule.max} characters`
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${field} format is invalid`
    }
    
    if (rule.validator) {
      const result = rule.validator(value)
      if (typeof result === 'string') {
        return result
      }
      if (result === false) {
        return `${field} is invalid`
      }
    }
    
    return null
  }
}

// Usage
const schema: ValidationSchema = {
  email: [
    { required: true },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  ],
  password: [
    { required: true },
    { min: 8 },
    { 
      validator: (value) => {
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) || 
               'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      }
    }
  ]
}

const validator = new FormValidator(schema)
const result = validator.validate({ email: 'test@example.com', password: 'weak' })
```

## Performance Optimization Patterns

### 1. Memoization Pattern

```vue
<template>
  <div>
    <ExpensiveComponent 
      v-for="item in memoizedItems" 
      :key="item.id"
      :data="item"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const items = ref([])
const filter = ref('')
const sortBy = ref('name')

// Memoized computed property
const memoizedItems = computed(() => {
  return items.value
    .filter(item => 
      item.name.toLowerCase().includes(filter.value.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy.value]
      const bVal = b[sortBy.value]
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    })
})
</script>
```

### 2. Virtual Scrolling Pattern

```vue
<template>
  <div class="virtual-list" :style="{ height: containerHeight + 'px' }">
    <div 
      class="virtual-list-phantom" 
      :style="{ height: totalHeight + 'px' }"
    ></div>
    <div 
      class="virtual-list-content"
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  items: any[]
  itemHeight: number
  containerHeight: number
}

const props = defineProps<Props>()

const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleCount = computed(() => 
  Math.ceil(props.containerHeight / props.itemHeight) + 1
)

const startIndex = computed(() => 
  Math.floor(scrollTop.value / props.itemHeight)
)

const endIndex = computed(() => 
  Math.min(startIndex.value + visibleCount.value, props.items.length)
)

const visibleItems = computed(() => 
  props.items.slice(startIndex.value, endIndex.value).map((item, index) => ({
    ...item,
    index: startIndex.value + index
  }))
)

const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (event: Event) => {
  scrollTop.value = (event.target as HTMLElement).scrollTop
}

onMounted(() => {
  const container = document.querySelector('.virtual-list')
  container?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  const container = document.querySelector('.virtual-list')
  container?.removeEventListener('scroll', handleScroll)
})
</script>
```

## Best Practices

### 1. Component Design

- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Prefer composition patterns
- **Props Interface**: Design clear and consistent prop interfaces
- **Event Naming**: Use descriptive event names with consistent patterns

### 2. State Management

- **Local State First**: Start with local state, lift up when needed
- **Immutable Updates**: Always create new objects/arrays for state updates
- **Computed Properties**: Use computed properties for derived state
- **Reactive References**: Use reactive/ref appropriately

### 3. Performance

- **Lazy Loading**: Load components and data when needed
- **Memoization**: Cache expensive computations
- **Virtual Scrolling**: Handle large datasets efficiently
- **Tree Shaking**: Design for optimal bundle splitting

### 4. Accessibility

- **Semantic HTML**: Use appropriate HTML elements
- **ARIA Attributes**: Include necessary ARIA attributes
- **Keyboard Navigation**: Support keyboard interactions
- **Focus Management**: Handle focus appropriately

### 5. Testing

- **Unit Tests**: Test component logic in isolation
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Verify accessibility compliance
- **Visual Regression**: Test visual consistency

## Conclusion

These design patterns form the foundation of Element Plus's architecture. Understanding and applying these patterns helps create consistent, maintainable, and scalable component libraries. Each pattern serves specific use cases and can be combined to solve complex UI challenges while maintaining code quality and developer experience.