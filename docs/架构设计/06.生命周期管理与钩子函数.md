# 第36天：Element Plus 生命周期管理与钩子函数

## 学习目标
- 深入理解 Vue 3 生命周期在 Element Plus 中的应用
- 掌握组合式 API 生命周期钩子的使用
- 学习组件生命周期的最佳实践
- 实践复杂生命周期管理场景

## 学习内容

### 1. Vue 3 生命周期钩子回顾

#### 1.1 组合式 API 生命周期钩子
```typescript
// Vue 3 Composition API 生命周期钩子
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from 'vue'

export function useLifecycleDemo() {
  console.log('Setup function called')
  
  onBeforeMount(() => {
    console.log('Before mount: 组件挂载前')
  })
  
  onMounted(() => {
    console.log('Mounted: 组件挂载完成')
  })
  
  onBeforeUpdate(() => {
    console.log('Before update: 组件更新前')
  })
  
  onUpdated(() => {
    console.log('Updated: 组件更新完成')
  })
  
  onBeforeUnmount(() => {
    console.log('Before unmount: 组件卸载前')
  })
  
  onUnmounted(() => {
    console.log('Unmounted: 组件卸载完成')
  })
  
  // KeepAlive 相关钩子
  onActivated(() => {
    console.log('Activated: 组件被激活')
  })
  
  onDeactivated(() => {
    console.log('Deactivated: 组件被停用')
  })
  
  // 错误捕获
  onErrorCaptured((error, instance, info) => {
    console.error('Error captured:', error, info)
    return false // 阻止错误继续传播
  })
}
```

#### 1.2 生命周期执行顺序
```vue
<template>
  <div class="lifecycle-demo">
    <h3>生命周期演示</h3>
    <p>计数器: {{ count }}</p>
    <el-button @click="increment">增加</el-button>
    <el-button @click="toggleChild">切换子组件</el-button>
    
    <child-component v-if="showChild" :count="count" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLifecycleDemo } from './useLifecycleDemo'

// 使用生命周期钩子
useLifecycleDemo()

const count = ref(0)
const showChild = ref(true)

const increment = () => {
  count.value++
}

const toggleChild = () => {
  showChild.value = !showChild.value
}
</script>
```

### 2. Element Plus 组件生命周期模式

#### 2.1 Element Plus 组件初始化模式
```typescript
// Element Plus 组件典型的生命周期管理
import { 
  ref, 
  reactive, 
  computed, 
  watch, 
  onMounted, 
  onBeforeUnmount,
  nextTick
} from 'vue'

export function useElementPlusComponent() {
  // 组件状态
  const isReady = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // DOM 引用
  const elementRef = ref<HTMLElement>()
  
  // 配置状态
  const config = reactive({
    size: 'default',
    disabled: false,
    readonly: false
  })
  
  // 计算属性
  const componentClasses = computed(() => {
    return {
      'is-loading': loading.value,
      'is-disabled': config.disabled,
      'is-readonly': config.readonly,
      [`el-component--${config.size}`]: config.size
    }
  })
  
  // 初始化函数
  const initialize = async () => {
    try {
      loading.value = true
      error.value = null
      
      // 模拟异步初始化
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 初始化完成
      isReady.value = true
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化失败'
    } finally {
      loading.value = false
    }
  }
  
  // 清理函数
  const cleanup = () => {
    isReady.value = false
    loading.value = false
    error.value = null
  }
  
  // 生命周期钩子
  onMounted(async () => {
    await nextTick() // 确保 DOM 已渲染
    await initialize()
  })
  
  onBeforeUnmount(() => {
    cleanup()
  })
  
  return {
    isReady,
    loading,
    error,
    elementRef,
    config,
    componentClasses,
    initialize,
    cleanup
  }
}
```

#### 2.2 表单组件生命周期管理
```vue
<template>
  <div class="form-lifecycle-demo">
    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="rules"
      @validate="handleValidate"
    >
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="formData.username" 
          @focus="handleFieldFocus('username')"
          @blur="handleFieldBlur('username')"
        />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input 
          v-model="formData.email"
          @focus="handleFieldFocus('email')"
          @blur="handleFieldBlur('email')"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 表单状态显示 -->
    <el-card title="表单状态">
      <p>表单是否就绪: {{ formState.isReady }}</p>
      <p>表单是否有效: {{ formState.isValid }}</p>
      <p>当前焦点字段: {{ formState.focusedField }}</p>
      <p>已修改字段: {{ formState.modifiedFields.join(', ') }}</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import type { FormInstance } from 'element-plus'

// 表单数据
const formData = reactive({
  username: '',
  email: ''
})

// 表单状态
const formState = reactive({
  isReady: false,
  isValid: false,
  focusedField: '',
  modifiedFields: [] as string[],
  validationErrors: {} as Record<string, string>
})

// 表单引用
const formRef = ref<FormInstance>()

// 验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 字段焦点处理
const handleFieldFocus = (field: string) => {
  formState.focusedField = field
  console.log(`Field ${field} focused`)
}

const handleFieldBlur = (field: string) => {
  if (formState.focusedField === field) {
    formState.focusedField = ''
  }
  
  // 记录已修改的字段
  if (formData[field] && !formState.modifiedFields.includes(field)) {
    formState.modifiedFields.push(field)
  }
  
  console.log(`Field ${field} blurred`)
}

// 表单验证处理
const handleValidate = (prop: string, isValid: boolean, message: string) => {
  if (isValid) {
    delete formState.validationErrors[prop]
  } else {
    formState.validationErrors[prop] = message
  }
  
  // 更新整体验证状态
  formState.isValid = Object.keys(formState.validationErrors).length === 0
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      console.log('Form submitted:', formData)
      // 提交逻辑
    }
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  
  formRef.value.resetFields()
  formState.modifiedFields = []
  formState.validationErrors = {}
  formState.isValid = false
}

// 监听表单数据变化
watch(
  formData,
  () => {
    // 表单数据变化时的处理
    console.log('Form data changed:', formData)
  },
  { deep: true }
)

// 生命周期钩子
onMounted(() => {
  console.log('Form component mounted')
  formState.isReady = true
  
  // 可以在这里进行表单初始化
  // 比如从 API 加载初始数据
})

onBeforeUnmount(() => {
  console.log('Form component will unmount')
  // 清理工作，比如取消未完成的请求
})
</script>
```

### 3. 异步组件生命周期管理

#### 3.1 异步数据加载
```typescript
// 异步数据加载的生命周期管理
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useAsyncData<T>(fetchFn: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const abortController = ref<AbortController | null>(null)
  
  const load = async () => {
    try {
      loading.value = true
      error.value = null
      
      // 创建新的 AbortController
      abortController.value = new AbortController()
      
      const result = await fetchFn()
      
      // 检查是否已被取消
      if (!abortController.value.signal.aborted) {
        data.value = result
      }
    } catch (err) {
      if (!abortController.value?.signal.aborted) {
        error.value = err instanceof Error ? err : new Error('Unknown error')
      }
    } finally {
      if (!abortController.value?.signal.aborted) {
        loading.value = false
      }
    }
  }
  
  const cancel = () => {
    if (abortController.value) {
      abortController.value.abort()
    }
  }
  
  const reload = () => {
    cancel()
    load()
  }
  
  // 组件挂载时自动加载
  onMounted(() => {
    load()
  })
  
  // 组件卸载时取消请求
  onBeforeUnmount(() => {
    cancel()
  })
  
  return {
    data,
    loading,
    error,
    load,
    reload,
    cancel
  }
}
```

#### 3.2 使用异步数据加载
```vue
<template>
  <div class="async-data-demo">
    <el-card title="用户列表">
      <template #extra>
        <el-button @click="reload" :loading="loading">
          刷新
        </el-button>
      </template>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <el-alert 
        v-else-if="error" 
        type="error" 
        :title="error.message"
        show-icon
      />
      
      <el-table v-else-if="data" :data="data">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteUser(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData } from './useAsyncData'

// 模拟 API 调用
const fetchUsers = async () => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 模拟可能的错误
  if (Math.random() < 0.1) {
    throw new Error('网络错误')
  }
  
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' }
  ]
}

// 使用异步数据加载
const { data, loading, error, reload } = useAsyncData(fetchUsers)

// 编辑用户
const editUser = (user: any) => {
  console.log('Edit user:', user)
  // 编辑逻辑
}

// 删除用户
const deleteUser = async (userId: number) => {
  try {
    // 删除逻辑
    console.log('Delete user:', userId)
    
    // 删除成功后重新加载数据
    await reload()
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>
```

### 4. 组件清理与资源管理

#### 4.1 资源清理管理器
```typescript
// 资源清理管理器
import { onBeforeUnmount } from 'vue'

class ResourceManager {
  private resources: Array<() => void> = []
  
  // 添加需要清理的资源
  addResource(cleanup: () => void) {
    this.resources.push(cleanup)
  }
  
  // 添加定时器
  addTimer(timerId: number) {
    this.addResource(() => clearTimeout(timerId))
  }
  
  // 添加间隔器
  addInterval(intervalId: number) {
    this.addResource(() => clearInterval(intervalId))
  }
  
  // 添加事件监听器
  addEventListener(element: Element, event: string, handler: EventListener) {
    element.addEventListener(event, handler)
    this.addResource(() => element.removeEventListener(event, handler))
  }
  
  // 添加 ResizeObserver
  addResizeObserver(observer: ResizeObserver) {
    this.addResource(() => observer.disconnect())
  }
  
  // 添加 MutationObserver
  addMutationObserver(observer: MutationObserver) {
    this.addResource(() => observer.disconnect())
  }
  
  // 添加 AbortController
  addAbortController(controller: AbortController) {
    this.addResource(() => controller.abort())
  }
  
  // 清理所有资源
  cleanup() {
    this.resources.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        console.error('Error during cleanup:', error)
      }
    })
    this.resources = []
  }
}

// 创建资源管理器的组合式函数
export function useResourceManager() {
  const resourceManager = new ResourceManager()
  
  // 组件卸载时自动清理
  onBeforeUnmount(() => {
    resourceManager.cleanup()
  })
  
  return resourceManager
}
```

#### 4.2 使用资源管理器
```vue
<template>
  <div class="resource-demo" ref="containerRef">
    <el-card title="资源管理演示">
      <p>鼠标位置: {{ mousePosition.x }}, {{ mousePosition.y }}</p>
      <p>窗口大小: {{ windowSize.width }} x {{ windowSize.height }}</p>
      <p>计时器: {{ timer }}</p>
      
      <el-button @click="startTimer">开始计时</el-button>
      <el-button @click="stopTimer">停止计时</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useResourceManager } from './useResourceManager'

// 使用资源管理器
const resourceManager = useResourceManager()

// 容器引用
const containerRef = ref<HTMLElement>()

// 鼠标位置
const mousePosition = reactive({ x: 0, y: 0 })

// 窗口大小
const windowSize = reactive({ width: 0, height: 0 })

// 计时器
const timer = ref(0)
let timerInterval: number | null = null

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  mousePosition.x = event.clientX
  mousePosition.y = event.clientY
}

// 窗口大小变化处理
const handleResize = () => {
  windowSize.width = window.innerWidth
  windowSize.height = window.innerHeight
}

// 开始计时
const startTimer = () => {
  if (timerInterval) return
  
  timerInterval = setInterval(() => {
    timer.value++
  }, 1000)
  
  // 添加到资源管理器
  resourceManager.addInterval(timerInterval)
}

// 停止计时
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 组件挂载时设置事件监听
onMounted(() => {
  // 添加鼠标移动监听
  resourceManager.addEventListener(document, 'mousemove', handleMouseMove)
  
  // 添加窗口大小变化监听
  resourceManager.addEventListener(window, 'resize', handleResize)
  
  // 初始化窗口大小
  handleResize()
  
  // 设置 ResizeObserver
  if (containerRef.value) {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log('Container resized:', entry.contentRect)
      }
    })
    
    resizeObserver.observe(containerRef.value)
    resourceManager.addResizeObserver(resizeObserver)
  }
})
</script>
```

### 5. 错误处理与恢复

#### 5.1 错误边界组件
```vue
<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-fallback">
      <el-alert
        type="error"
        title="组件发生错误"
        :description="errorMessage"
        show-icon
      />
      <el-button @click="retry">重试</el-button>
    </div>
    
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

// 捕获子组件错误
onErrorCaptured((error, instance, info) => {
  console.error('Error captured by boundary:', error, info)
  
  hasError.value = true
  errorMessage.value = error.message || '未知错误'
  
  // 返回 false 阻止错误继续传播
  return false
})

// 重试函数
const retry = () => {
  hasError.value = false
  errorMessage.value = ''
}
</script>
```

#### 5.2 组件错误恢复
```typescript
// 错误恢复的组合式函数
import { ref, onErrorCaptured } from 'vue'

export function useErrorRecovery() {
  const error = ref<Error | null>(null)
  const retryCount = ref(0)
  const maxRetries = ref(3)
  
  // 捕获错误
  onErrorCaptured((err, instance, info) => {
    console.error('Component error:', err, info)
    error.value = err
    return false
  })
  
  // 重试函数
  const retry = () => {
    if (retryCount.value < maxRetries.value) {
      retryCount.value++
      error.value = null
      return true
    }
    return false
  }
  
  // 重置错误状态
  const reset = () => {
    error.value = null
    retryCount.value = 0
  }
  
  // 手动设置错误
  const setError = (err: Error) => {
    error.value = err
  }
  
  return {
    error,
    retryCount,
    maxRetries,
    retry,
    reset,
    setError
  }
}
```

### 6. 实践练习

#### 练习1：复杂组件生命周期管理
```vue
<template>
  <div class="complex-lifecycle-demo">
    <el-card title="复杂组件生命周期演示">
      <!-- 状态显示 -->
      <div class="status-panel">
        <el-tag :type="componentState.isReady ? 'success' : 'info'">
          {{ componentState.isReady ? '就绪' : '初始化中' }}
        </el-tag>
        <el-tag v-if="componentState.isLoading" type="warning">加载中</el-tag>
        <el-tag v-if="componentState.hasError" type="danger">错误</el-tag>
      </div>
      
      <!-- 数据展示 -->
      <el-table v-if="tableData" :data="tableData" v-loading="componentState.isLoading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="editItem(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteItem(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 操作按钮 -->
      <div class="actions">
        <el-button @click="refreshData" :loading="componentState.isLoading">
          刷新数据
        </el-button>
        <el-button @click="addItem">添加项目</el-button>
        <el-button @click="simulateError" type="danger">模拟错误</el-button>
      </div>
    </el-card>
    
    <!-- 生命周期日志 -->
    <el-card title="生命周期日志">
      <div class="lifecycle-log">
        <div v-for="(log, index) in lifecycleLogs" :key="index" class="log-item">
          <span class="timestamp">{{ log.timestamp }}</span>
          <span class="event">{{ log.event }}</span>
          <span class="details">{{ log.details }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { 
  ref, 
  reactive, 
  onBeforeMount, 
  onMounted, 
  onBeforeUpdate, 
  onUpdated, 
  onBeforeUnmount, 
  onUnmounted,
  watch,
  nextTick
} from 'vue'
import { useResourceManager } from './useResourceManager'
import { useErrorRecovery } from './useErrorRecovery'

// 组件状态
const componentState = reactive({
  isReady: false,
  isLoading: false,
  hasError: false,
  errorMessage: ''
})

// 表格数据
const tableData = ref<any[]>([])

// 生命周期日志
const lifecycleLogs = ref<Array<{
  timestamp: string
  event: string
  details: string
}>>([])

// 使用资源管理器和错误恢复
const resourceManager = useResourceManager()
const { error, retry, setError } = useErrorRecovery()

// 添加生命周期日志
const addLifecycleLog = (event: string, details: string = '') => {
  lifecycleLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    event,
    details
  })
}

// 模拟数据加载
const loadData = async () => {
  try {
    componentState.isLoading = true
    componentState.hasError = false
    
    addLifecycleLog('数据加载', '开始加载数据')
    
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟可能的错误
    if (Math.random() < 0.1) {
      throw new Error('数据加载失败')
    }
    
    tableData.value = [
      { id: 1, name: '项目A', status: '进行中' },
      { id: 2, name: '项目B', status: '已完成' },
      { id: 3, name: '项目C', status: '待开始' }
    ]
    
    addLifecycleLog('数据加载', '数据加载成功')
    
  } catch (err) {
    componentState.hasError = true
    componentState.errorMessage = err instanceof Error ? err.message : '未知错误'
    setError(err instanceof Error ? err : new Error('未知错误'))
    addLifecycleLog('数据加载', '数据加载失败: ' + componentState.errorMessage)
  } finally {
    componentState.isLoading = false
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 添加项目
const addItem = () => {
  const newId = Math.max(...tableData.value.map(item => item.id)) + 1
  tableData.value.push({
    id: newId,
    name: `项目${String.fromCharCode(65 + newId - 1)}`,
    status: '待开始'
  })
  addLifecycleLog('操作', '添加新项目')
}

// 编辑项目
const editItem = (item: any) => {
  console.log('编辑项目:', item)
  addLifecycleLog('操作', `编辑项目: ${item.name}`)
}

// 删除项目
const deleteItem = (id: number) => {
  const index = tableData.value.findIndex(item => item.id === id)
  if (index > -1) {
    const item = tableData.value[index]
    tableData.value.splice(index, 1)
    addLifecycleLog('操作', `删除项目: ${item.name}`)
  }
}

// 模拟错误
const simulateError = () => {
  const error = new Error('这是一个模拟错误')
  setError(error)
  componentState.hasError = true
  componentState.errorMessage = error.message
  addLifecycleLog('错误', '模拟错误触发')
}

// 监听错误状态
watch(error, (newError) => {
  if (newError) {
    addLifecycleLog('错误捕获', newError.message)
  }
})

// 生命周期钩子
onBeforeMount(() => {
  addLifecycleLog('生命周期', 'onBeforeMount - 组件挂载前')
})

onMounted(async () => {
  addLifecycleLog('生命周期', 'onMounted - 组件挂载完成')
  
  await nextTick()
  componentState.isReady = true
  
  // 初始化数据
  await loadData()
  
  // 设置定时器（演示资源管理）
  const timerId = setInterval(() => {
    addLifecycleLog('定时器', '定时器触发')
  }, 10000)
  
  resourceManager.addInterval(timerId)
})

onBeforeUpdate(() => {
  addLifecycleLog('生命周期', 'onBeforeUpdate - 组件更新前')
})

onUpdated(() => {
  addLifecycleLog('生命周期', 'onUpdated - 组件更新完成')
})

onBeforeUnmount(() => {
  addLifecycleLog('生命周期', 'onBeforeUnmount - 组件卸载前')
})

onUnmounted(() => {
  addLifecycleLog('生命周期', 'onUnmounted - 组件卸载完成')
})
</script>

<style scoped>
.status-panel {
  margin-bottom: 16px;
}

.status-panel .el-tag {
  margin-right: 8px;
}

.actions {
  margin-top: 16px;
}

.actions .el-button {
  margin-right: 8px;
}

.lifecycle-log {
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}

.log-item {
  display: flex;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
}

.timestamp {
  width: 100px;
  color: #666;
}

.event {
  width: 120px;
  font-weight: bold;
  color: #409eff;
}

.details {
  flex: 1;
  color: #333;
}
</style>
```

## 学习资源
- [Vue 3 生命周期钩子](https://cn.vuejs.org/guide/essentials/lifecycle.html)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Element Plus 源码分析](https://github.com/element-plus/element-plus)

## 作业
1. 实现一个完整的组件生命周期管理系统
2. 创建一个资源清理管理器，支持多种资源类型
3. 分析 Element Plus Dialog 组件的生命周期管理

## 下一步
明天我们将学习 Element Plus 的插件系统与扩展机制。