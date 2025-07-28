# 第73天：组件间复杂通信模式

## 学习目标

- 掌握 Vue 3 中高级组件通信模式
- 学习 Element Plus 组件间的复杂交互机制
- 实践跨层级组件通信解决方案
- 构建可扩展的组件通信架构

## 1. 高级组件通信模式

### 1.1 事件总线增强模式

```typescript
// 类型安全的事件总线
interface EventMap {
  'user:login': { userId: string; username: string }
  'user:logout': { userId: string }
  'data:update': { type: string; payload: any }
  'ui:theme-change': { theme: string }
  'form:validate': { formId: string; isValid: boolean }
  'table:selection-change': { selectedRows: any[] }
}

type EventKey = keyof EventMap
type EventHandler<K extends EventKey> = (data: EventMap[K]) => void

class TypedEventBus {
  private events: Map<string, Set<Function>> = new Map()
  private onceEvents: Map<string, Set<Function>> = new Map()
  private middlewares: Array<(event: string, data: any) => boolean> = []
  
  // 添加中间件
  use(middleware: (event: string, data: any) => boolean): void {
    this.middlewares.push(middleware)
  }
  
  // 监听事件
  on<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    this.events.get(event)!.add(handler)
    
    // 返回取消监听函数
    return () => this.off(event, handler)
  }
  
  // 监听一次
  once<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, new Set())
    }
    
    this.onceEvents.get(event)!.add(handler)
  }
  
  // 取消监听
  off<K extends EventKey>(event: K, handler: EventHandler<K>): void {
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.delete(handler)
    }
    
    const onceHandlers = this.onceEvents.get(event)
    if (onceHandlers) {
      onceHandlers.delete(handler)
    }
  }
  
  // 发射事件
  emit<K extends EventKey>(event: K, data: EventMap[K]): void {
    // 执行中间件
    for (const middleware of this.middlewares) {
      if (!middleware(event, data)) {
        return // 中间件阻止事件传播
      }
    }
    
    // 执行普通监听器
    const handlers = this.events.get(event)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error)
        }
      })
    }
    
    // 执行一次性监听器
    const onceHandlers = this.onceEvents.get(event)
    if (onceHandlers) {
      onceHandlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in once event handler for ${event}:`, error)
        }
      })
      onceHandlers.clear()
    }
  }
  
  // 清除所有监听器
  clear(): void {
    this.events.clear()
    this.onceEvents.clear()
  }
  
  // 获取事件统计
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {}
    
    for (const [event, handlers] of this.events) {
      stats[event] = handlers.size
    }
    
    return stats
  }
}

// 全局事件总线实例
export const eventBus = new TypedEventBus()

// 事件总线中间件示例
eventBus.use((event, data) => {
  // 日志中间件
  console.log(`Event emitted: ${event}`, data)
  return true
})

eventBus.use((event, data) => {
  // 权限检查中间件
  if (event.startsWith('admin:') && !checkAdminPermission()) {
    console.warn(`Permission denied for event: ${event}`)
    return false
  }
  return true
})
```

### 1.2 依赖注入通信模式

```typescript
// 依赖注入系统
interface InjectionKey<T> extends Symbol {}

function createInjectionKey<T>(description: string): InjectionKey<T> {
  return Symbol(description) as InjectionKey<T>
}

// 服务接口定义
interface UserService {
  getCurrentUser(): Promise<User>
  updateUser(user: Partial<User>): Promise<void>
  logout(): Promise<void>
}

interface NotificationService {
  success(message: string): void
  error(message: string): void
  warning(message: string): void
  info(message: string): void
}

interface DataService {
  fetch<T>(url: string): Promise<T>
  post<T>(url: string, data: any): Promise<T>
  put<T>(url: string, data: any): Promise<T>
  delete(url: string): Promise<void>
}

// 注入键定义
const USER_SERVICE_KEY = createInjectionKey<UserService>('userService')
const NOTIFICATION_SERVICE_KEY = createInjectionKey<NotificationService>('notificationService')
const DATA_SERVICE_KEY = createInjectionKey<DataService>('dataService')

// 服务实现
class DefaultUserService implements UserService {
  private currentUser: Ref<User | null> = ref(null)
  
  async getCurrentUser(): Promise<User> {
    if (!this.currentUser.value) {
      // 从 API 获取用户信息
      const user = await fetch('/api/user/current').then(res => res.json())
      this.currentUser.value = user
    }
    return this.currentUser.value!
  }
  
  async updateUser(user: Partial<User>): Promise<void> {
    await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
    
    if (this.currentUser.value) {
      Object.assign(this.currentUser.value, user)
    }
  }
  
  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' })
    this.currentUser.value = null
  }
}

class ElementPlusNotificationService implements NotificationService {
  success(message: string): void {
    ElNotification({
      type: 'success',
      title: 'Success',
      message
    })
  }
  
  error(message: string): void {
    ElNotification({
      type: 'error',
      title: 'Error',
      message
    })
  }
  
  warning(message: string): void {
    ElNotification({
      type: 'warning',
      title: 'Warning',
      message
    })
  }
  
  info(message: string): void {
    ElNotification({
      type: 'info',
      title: 'Info',
      message
    })
  }
}

// 服务提供者组合式函数
function useServiceProvider() {
  const userService = new DefaultUserService()
  const notificationService = new ElementPlusNotificationService()
  const dataService = new DefaultDataService()
  
  return {
    provide: (app: App) => {
      app.provide(USER_SERVICE_KEY, userService)
      app.provide(NOTIFICATION_SERVICE_KEY, notificationService)
      app.provide(DATA_SERVICE_KEY, dataService)
    },
    userService,
    notificationService,
    dataService
  }
}

// 服务消费者组合式函数
function useUserService(): UserService {
  const service = inject(USER_SERVICE_KEY)
  if (!service) {
    throw new Error('UserService not provided')
  }
  return service
}

function useNotification(): NotificationService {
  const service = inject(NOTIFICATION_SERVICE_KEY)
  if (!service) {
    throw new Error('NotificationService not provided')
  }
  return service
}

function useDataService(): DataService {
  const service = inject(DATA_SERVICE_KEY)
  if (!service) {
    throw new Error('DataService not provided')
  }
  return service
}
```

## 2. 跨层级组件通信

### 2.1 Context 模式实现

```typescript
// Context 创建工具
function createContext<T>(defaultValue?: T) {
  const key = Symbol('context')
  
  function useProvideContext(value: T) {
    provide(key, value)
    return value
  }
  
  function useInjectContext(fallback?: T): T {
    const value = inject(key, fallback ?? defaultValue)
    if (value === undefined) {
      throw new Error('Context not provided')
    }
    return value
  }
  
  return {
    useProvideContext,
    useInjectContext
  }
}

// 表单上下文
interface FormContextValue {
  formData: Ref<Record<string, any>>
  errors: Ref<Record<string, string>>
  isSubmitting: Ref<boolean>
  validateField: (field: string) => Promise<boolean>
  setFieldValue: (field: string, value: any) => void
  setFieldError: (field: string, error: string) => void
  clearFieldError: (field: string) => void
  submitForm: () => Promise<boolean>
  resetForm: () => void
}

const { useProvideContext: useProvideFormContext, useInjectContext: useInjectFormContext } = 
  createContext<FormContextValue>()

// 表单提供者组件
const FormProvider = defineComponent({
  name: 'FormProvider',
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    },
    validationRules: {
      type: Object,
      default: () => ({})
    },
    onSubmit: {
      type: Function,
      required: true
    }
  },
  setup(props, { slots }) {
    const formData = ref({ ...props.initialData })
    const errors = ref<Record<string, string>>({})
    const isSubmitting = ref(false)
    
    const validateField = async (field: string): Promise<boolean> => {
      const rule = props.validationRules[field]
      if (!rule) return true
      
      try {
        const value = formData.value[field]
        const result = await rule(value)
        
        if (result === true) {
          clearFieldError(field)
          return true
        } else {
          setFieldError(field, result || 'Validation failed')
          return false
        }
      } catch (error) {
        setFieldError(field, error.message)
        return false
      }
    }
    
    const setFieldValue = (field: string, value: any) => {
      formData.value[field] = value
      // 自动清除错误
      if (errors.value[field]) {
        clearFieldError(field)
      }
    }
    
    const setFieldError = (field: string, error: string) => {
      errors.value[field] = error
    }
    
    const clearFieldError = (field: string) => {
      delete errors.value[field]
    }
    
    const submitForm = async (): Promise<boolean> => {
      isSubmitting.value = true
      
      try {
        // 验证所有字段
        const fieldNames = Object.keys(props.validationRules)
        const validationResults = await Promise.all(
          fieldNames.map(field => validateField(field))
        )
        
        const isValid = validationResults.every(result => result)
        
        if (isValid) {
          await props.onSubmit(formData.value)
          return true
        }
        
        return false
      } finally {
        isSubmitting.value = false
      }
    }
    
    const resetForm = () => {
      formData.value = { ...props.initialData }
      errors.value = {}
    }
    
    const contextValue: FormContextValue = {
      formData,
      errors,
      isSubmitting,
      validateField,
      setFieldValue,
      setFieldError,
      clearFieldError,
      submitForm,
      resetForm
    }
    
    useProvideFormContext(contextValue)
    
    return () => slots.default?.()
  }
})

// 表单字段组件
const FormField = defineComponent({
  name: 'FormField',
  props: {
    name: {
      type: String,
      required: true
    },
    label: String,
    required: Boolean
  },
  setup(props, { slots }) {
    const formContext = useInjectFormContext()
    
    const fieldValue = computed({
      get: () => formContext.formData.value[props.name],
      set: (value) => formContext.setFieldValue(props.name, value)
    })
    
    const fieldError = computed(() => formContext.errors.value[props.name])
    
    const validate = () => formContext.validateField(props.name)
    
    return () => (
      <div class="form-field">
        {props.label && (
          <label class={['form-field__label', { 'is-required': props.required }]}>
            {props.label}
          </label>
        )}
        <div class="form-field__content">
          {slots.default?.({ 
            value: fieldValue.value, 
            onChange: (value: any) => fieldValue.value = value,
            onBlur: validate,
            error: fieldError.value
          })}
        </div>
        {fieldError.value && (
          <div class="form-field__error">{fieldError.value}</div>
        )}
      </div>
    )
  }
})
```

### 2.2 状态管理通信模式

```typescript
// 组件状态管理
interface ComponentState {
  id: string
  type: string
  props: Record<string, any>
  state: Record<string, any>
  children: string[]
  parent?: string
}

class ComponentStateManager {
  private components: Map<string, ComponentState> = new Map()
  private subscribers: Map<string, Set<Function>> = new Map()
  private globalSubscribers: Set<Function> = new Set()
  
  // 注册组件
  register(component: ComponentState): void {
    this.components.set(component.id, component)
    this.notifySubscribers(component.id, 'register', component)
  }
  
  // 注销组件
  unregister(componentId: string): void {
    const component = this.components.get(componentId)
    if (component) {
      this.components.delete(componentId)
      this.subscribers.delete(componentId)
      this.notifySubscribers(componentId, 'unregister', component)
    }
  }
  
  // 更新组件状态
  updateState(componentId: string, updates: Record<string, any>): void {
    const component = this.components.get(componentId)
    if (component) {
      Object.assign(component.state, updates)
      this.notifySubscribers(componentId, 'state-update', { componentId, updates })
    }
  }
  
  // 更新组件属性
  updateProps(componentId: string, updates: Record<string, any>): void {
    const component = this.components.get(componentId)
    if (component) {
      Object.assign(component.props, updates)
      this.notifySubscribers(componentId, 'props-update', { componentId, updates })
    }
  }
  
  // 获取组件状态
  getComponent(componentId: string): ComponentState | undefined {
    return this.components.get(componentId)
  }
  
  // 获取子组件
  getChildren(componentId: string): ComponentState[] {
    const component = this.components.get(componentId)
    if (!component) return []
    
    return component.children
      .map(childId => this.components.get(childId))
      .filter(Boolean) as ComponentState[]
  }
  
  // 获取父组件
  getParent(componentId: string): ComponentState | undefined {
    const component = this.components.get(componentId)
    if (!component || !component.parent) return undefined
    
    return this.components.get(component.parent)
  }
  
  // 获取兄弟组件
  getSiblings(componentId: string): ComponentState[] {
    const component = this.components.get(componentId)
    if (!component || !component.parent) return []
    
    const parent = this.components.get(component.parent)
    if (!parent) return []
    
    return parent.children
      .filter(childId => childId !== componentId)
      .map(childId => this.components.get(childId))
      .filter(Boolean) as ComponentState[]
  }
  
  // 查找组件
  findComponents(predicate: (component: ComponentState) => boolean): ComponentState[] {
    return Array.from(this.components.values()).filter(predicate)
  }
  
  // 订阅组件变化
  subscribe(componentId: string, callback: Function): () => void {
    if (!this.subscribers.has(componentId)) {
      this.subscribers.set(componentId, new Set())
    }
    
    this.subscribers.get(componentId)!.add(callback)
    
    return () => {
      const subs = this.subscribers.get(componentId)
      if (subs) {
        subs.delete(callback)
      }
    }
  }
  
  // 订阅全局变化
  subscribeGlobal(callback: Function): () => void {
    this.globalSubscribers.add(callback)
    
    return () => {
      this.globalSubscribers.delete(callback)
    }
  }
  
  // 通知订阅者
  private notifySubscribers(componentId: string, event: string, data: any): void {
    // 通知组件特定订阅者
    const componentSubs = this.subscribers.get(componentId)
    if (componentSubs) {
      componentSubs.forEach(callback => {
        try {
          callback(event, data)
        } catch (error) {
          console.error('Error in component subscriber:', error)
        }
      })
    }
    
    // 通知全局订阅者
    this.globalSubscribers.forEach(callback => {
      try {
        callback(event, data)
      } catch (error) {
        console.error('Error in global subscriber:', error)
      }
    })
  }
  
  // 组件间通信
  sendMessage(fromId: string, toId: string, message: any): void {
    const fromComponent = this.components.get(fromId)
    const toComponent = this.components.get(toId)
    
    if (fromComponent && toComponent) {
      this.notifySubscribers(toId, 'message', {
        from: fromId,
        to: toId,
        message,
        timestamp: Date.now()
      })
    }
  }
  
  // 广播消息
  broadcast(fromId: string, message: any, filter?: (component: ComponentState) => boolean): void {
    const fromComponent = this.components.get(fromId)
    if (!fromComponent) return
    
    for (const [componentId, component] of this.components) {
      if (componentId !== fromId && (!filter || filter(component))) {
        this.sendMessage(fromId, componentId, message)
      }
    }
  }
}

// 全局组件状态管理器
export const componentStateManager = new ComponentStateManager()

// 组件状态管理组合式函数
function useComponentState(componentId: string, initialState: Record<string, any> = {}) {
  const state = reactive(initialState)
  
  onMounted(() => {
    componentStateManager.register({
      id: componentId,
      type: getCurrentInstance()?.type.name || 'Unknown',
      props: getCurrentInstance()?.props || {},
      state,
      children: [],
      parent: undefined
    })
  })
  
  onUnmounted(() => {
    componentStateManager.unregister(componentId)
  })
  
  const updateState = (updates: Record<string, any>) => {
    Object.assign(state, updates)
    componentStateManager.updateState(componentId, updates)
  }
  
  const sendMessage = (toId: string, message: any) => {
    componentStateManager.sendMessage(componentId, toId, message)
  }
  
  const broadcast = (message: any, filter?: (component: ComponentState) => boolean) => {
    componentStateManager.broadcast(componentId, message, filter)
  }
  
  const subscribe = (callback: Function) => {
    return componentStateManager.subscribe(componentId, callback)
  }
  
  return {
    state: readonly(state),
    updateState,
    sendMessage,
    broadcast,
    subscribe
  }
}
```

## 3. Element Plus 组件通信增强

### 3.1 表格与表单联动

```typescript
// 表格表单联动管理器
class TableFormLinker {
  private tableRef: Ref<any>
  private formRef: Ref<any>
  private linkConfig: TableFormLinkConfig
  
  constructor(tableRef: Ref<any>, formRef: Ref<any>, config: TableFormLinkConfig) {
    this.tableRef = tableRef
    this.formRef = formRef
    this.linkConfig = config
    this.setupLinking()
  }
  
  private setupLinking(): void {
    // 监听表格选择变化
    watch(
      () => this.tableRef.value?.getSelectionRows?.(),
      (selectedRows) => {
        if (selectedRows && selectedRows.length > 0) {
          this.handleTableSelection(selectedRows)
        }
      },
      { deep: true }
    )
    
    // 监听表单数据变化
    if (this.linkConfig.formToTable) {
      watch(
        () => this.formRef.value?.model,
        (formData) => {
          if (formData) {
            this.handleFormChange(formData)
          }
        },
        { deep: true }
      )
    }
  }
  
  private handleTableSelection(selectedRows: any[]): void {
    const { tableToForm } = this.linkConfig
    
    if (tableToForm && this.formRef.value) {
      if (selectedRows.length === 1) {
        // 单选：填充表单
        const selectedRow = selectedRows[0]
        const formData = this.mapTableRowToForm(selectedRow, tableToForm.mapping)
        
        Object.keys(formData).forEach(key => {
          this.formRef.value.model[key] = formData[key]
        })
        
        if (tableToForm.onSelection) {
          tableToForm.onSelection(selectedRow, formData)
        }
      } else if (selectedRows.length > 1) {
        // 多选：批量操作模式
        if (tableToForm.onMultiSelection) {
          tableToForm.onMultiSelection(selectedRows)
        }
      }
    }
  }
  
  private handleFormChange(formData: any): void {
    const { formToTable } = this.linkConfig
    
    if (formToTable && this.tableRef.value) {
      // 根据表单数据过滤表格
      if (formToTable.filterTable) {
        const filterConditions = this.mapFormToTableFilter(formData, formToTable.mapping)
        this.applyTableFilter(filterConditions)
      }
      
      if (formToTable.onChange) {
        formToTable.onChange(formData)
      }
    }
  }
  
  private mapTableRowToForm(row: any, mapping: Record<string, string>): any {
    const formData: any = {}
    
    Object.entries(mapping).forEach(([formField, tableField]) => {
      if (row[tableField] !== undefined) {
        formData[formField] = row[tableField]
      }
    })
    
    return formData
  }
  
  private mapFormToTableFilter(formData: any, mapping: Record<string, string>): any {
    const filterConditions: any = {}
    
    Object.entries(mapping).forEach(([formField, tableField]) => {
      if (formData[formField] !== undefined && formData[formField] !== '') {
        filterConditions[tableField] = formData[formField]
      }
    })
    
    return filterConditions
  }
  
  private applyTableFilter(conditions: any): void {
    // 应用表格过滤条件
    if (this.tableRef.value && this.tableRef.value.clearFilter) {
      this.tableRef.value.clearFilter()
      
      Object.entries(conditions).forEach(([column, value]) => {
        if (this.tableRef.value.filter) {
          this.tableRef.value.filter(column, value)
        }
      })
    }
  }
  
  // 手动同步数据
  syncTableToForm(): void {
    const selectedRows = this.tableRef.value?.getSelectionRows?.()
    if (selectedRows && selectedRows.length > 0) {
      this.handleTableSelection(selectedRows)
    }
  }
  
  syncFormToTable(): void {
    const formData = this.formRef.value?.model
    if (formData) {
      this.handleFormChange(formData)
    }
  }
}

interface TableFormLinkConfig {
  tableToForm?: {
    mapping: Record<string, string> // formField -> tableField
    onSelection?: (row: any, formData: any) => void
    onMultiSelection?: (rows: any[]) => void
  }
  formToTable?: {
    mapping: Record<string, string> // formField -> tableField
    filterTable?: boolean
    onChange?: (formData: any) => void
  }
}

// 使用组合式函数
function useTableFormLink(config: TableFormLinkConfig) {
  const tableRef = ref()
  const formRef = ref()
  let linker: TableFormLinker | null = null
  
  onMounted(() => {
    if (tableRef.value && formRef.value) {
      linker = new TableFormLinker(tableRef, formRef, config)
    }
  })
  
  onUnmounted(() => {
    linker = null
  })
  
  return {
    tableRef,
    formRef,
    syncTableToForm: () => linker?.syncTableToForm(),
    syncFormToTable: () => linker?.syncFormToTable()
  }
}
```

### 3.2 弹窗与页面通信

```typescript
// 弹窗通信管理器
class DialogCommunicationManager {
  private dialogs: Map<string, DialogInstance> = new Map()
  private messageQueue: Map<string, any[]> = new Map()
  
  // 注册弹窗
  registerDialog(id: string, instance: DialogInstance): void {
    this.dialogs.set(id, instance)
    
    // 处理排队的消息
    const queuedMessages = this.messageQueue.get(id) || []
    queuedMessages.forEach(message => {
      instance.receiveMessage(message)
    })
    this.messageQueue.delete(id)
  }
  
  // 注销弹窗
  unregisterDialog(id: string): void {
    this.dialogs.delete(id)
  }
  
  // 发送消息到弹窗
  sendToDialog(dialogId: string, message: any): void {
    const dialog = this.dialogs.get(dialogId)
    
    if (dialog) {
      dialog.receiveMessage(message)
    } else {
      // 弹窗未注册，加入队列
      if (!this.messageQueue.has(dialogId)) {
        this.messageQueue.set(dialogId, [])
      }
      this.messageQueue.get(dialogId)!.push(message)
    }
  }
  
  // 从弹窗发送消息到页面
  sendFromDialog(dialogId: string, message: any): void {
    eventBus.emit('dialog:message', {
      dialogId,
      message,
      timestamp: Date.now()
    })
  }
  
  // 广播消息到所有弹窗
  broadcast(message: any): void {
    this.dialogs.forEach((dialog, id) => {
      dialog.receiveMessage({
        ...message,
        broadcast: true,
        targetId: id
      })
    })
  }
  
  // 获取活跃弹窗列表
  getActiveDialogs(): string[] {
    return Array.from(this.dialogs.keys())
  }
}

interface DialogInstance {
  receiveMessage(message: any): void
}

// 全局弹窗通信管理器
export const dialogManager = new DialogCommunicationManager()

// 弹窗通信组合式函数
function useDialogCommunication(dialogId: string) {
  const messageHandlers: Map<string, Function[]> = new Map()
  
  const dialogInstance: DialogInstance = {
    receiveMessage(message: any) {
      const handlers = messageHandlers.get(message.type) || []
      handlers.forEach(handler => {
        try {
          handler(message)
        } catch (error) {
          console.error('Error in dialog message handler:', error)
        }
      })
    }
  }
  
  onMounted(() => {
    dialogManager.registerDialog(dialogId, dialogInstance)
  })
  
  onUnmounted(() => {
    dialogManager.unregisterDialog(dialogId)
  })
  
  const onMessage = (type: string, handler: Function) => {
    if (!messageHandlers.has(type)) {
      messageHandlers.set(type, [])
    }
    messageHandlers.get(type)!.push(handler)
  }
  
  const sendMessage = (message: any) => {
    dialogManager.sendFromDialog(dialogId, message)
  }
  
  const sendToDialog = (targetDialogId: string, message: any) => {
    dialogManager.sendToDialog(targetDialogId, message)
  }
  
  return {
    onMessage,
    sendMessage,
    sendToDialog
  }
}

// 页面弹窗通信组合式函数
function usePageDialogCommunication() {
  const sendToDialog = (dialogId: string, message: any) => {
    dialogManager.sendToDialog(dialogId, message)
  }
  
  const broadcast = (message: any) => {
    dialogManager.broadcast(message)
  }
  
  const onDialogMessage = (handler: (data: any) => void) => {
    return eventBus.on('dialog:message', handler)
  }
  
  return {
    sendToDialog,
    broadcast,
    onDialogMessage
  }
}
```

## 4. 实践练习

1. **事件总线实现**：
   - 实现类型安全的事件总线
   - 添加事件中间件机制
   - 创建事件调试工具

2. **依赖注入系统**：
   - 设计服务注入架构
   - 实现服务生命周期管理
   - 创建服务测试框架

3. **复杂组件通信**：
   - 实现表格表单联动
   - 创建弹窗通信系统
   - 设计跨页面组件通信

## 5. 学习资源

- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Composition API](https://vuejs.org/guide/reusability/composables.html)
- [Element Plus Component Communication](https://element-plus.org/zh-CN/guide/)
- [Advanced Vue.js Patterns](https://vueschool.io/courses/)

## 6. 作业

- 实现一个完整的组件通信框架
- 开发表格表单联动系统
- 创建弹窗通信管理器
- 设计组件通信最佳实践文档

## 总结

通过第73天的学习，我们深入掌握了：

1. **高级通信模式**：理解了事件总线、依赖注入等高级通信模式
2. **跨层级通信**：学会了 Context 模式和状态管理通信
3. **Element Plus 集成**：掌握了在 Element Plus 组件中实现复杂通信
4. **实际应用**：实践了表格表单联动、弹窗通信等实际场景

这些技能将帮助我们构建更加灵活和可维护的 Element Plus 应用架构。