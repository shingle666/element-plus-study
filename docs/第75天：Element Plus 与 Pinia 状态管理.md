# 第75天：Element Plus 与 Pinia 状态管理

## 学习目标

* 掌握 Pinia 在 Element Plus 应用中的最佳实践
* 学习组件状态与全局状态的协调管理
* 了解状态持久化和数据同步策略
* 实现复杂业务场景下的状态管理方案

## 知识点概览

### 1. Pinia 与 Element Plus 集成基础

#### 1.1 Pinia 配置与初始化

```typescript
// stores/index.ts
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

// 创建 Pinia 实例
const pinia = createPinia()

// 配置持久化插件
pinia.use(
  createPersistedState({
    storage: localStorage,
    serializer: {
      serialize: JSON.stringify,
      deserialize: JSON.parse
    },
    key: id => `pinia-${id}`,
    auto: true
  })
)

// 安装 Pinia
export function setupStore(app: App) {
  app.use(pinia)
}

export { pinia }
export default pinia
```

#### 1.2 状态管理架构设计

```typescript
// types/store.ts

// 基础状态接口
export interface BaseState {
  loading: boolean
  error: string | null
  lastUpdated: number
}

// 分页状态接口
export interface PaginationState {
  current: number
  pageSize: number
  total: number
  showSizeChanger: boolean
  showQuickJumper: boolean
  pageSizes: number[]
}

// 表格状态接口
export interface TableState extends BaseState {
  data: any[]
  selectedRows: any[]
  pagination: PaginationState
  filters: Record<string, any>
  sorter: {
    field?: string
    order?: 'ascend' | 'descend'
  }
  columns: any[]
}

// 表单状态接口
export interface FormState extends BaseState {
  data: Record<string, any>
  rules: Record<string, any>
  disabled: boolean
  readonly: boolean
  mode: 'create' | 'edit' | 'view'
}

// 用户状态接口
export interface UserState extends BaseState {
  userInfo: {
    id: string
    username: string
    nickname: string
    avatar: string
    email: string
    phone: string
    roles: string[]
    permissions: string[]
  }
  token: string
  refreshToken: string
  loginTime: number
  lastActiveTime: number
}

// 应用状态接口
export interface AppState {
  theme: 'light' | 'dark'
  locale: string
  sidebar: {
    collapsed: boolean
    width: number
  }
  device: 'desktop' | 'tablet' | 'mobile'
  size: 'large' | 'default' | 'small'
}
```

### 2. 核心状态管理模块

#### 2.1 用户状态管理

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { login, logout, getUserInfo, refreshToken } from '@/api/auth'
import { removeToken, setToken, getToken } from '@/utils/auth'
import type { UserState } from '@/types/store'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: {
      id: '',
      username: '',
      nickname: '',
      avatar: '',
      email: '',
      phone: '',
      roles: [],
      permissions: []
    },
    token: getToken() || '',
    refreshToken: '',
    loginTime: 0,
    lastActiveTime: Date.now(),
    loading: false,
    error: null,
    lastUpdated: 0
  }),
  
  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,
    
    // 是否为管理员
    isAdmin: (state) => state.userInfo.roles.includes('admin'),
    
    // 获取用户显示名称
    displayName: (state) => {
      return state.userInfo.nickname || state.userInfo.username || '未知用户'
    },
    
    // 检查是否有指定权限
    hasPermission: (state) => (permission: string) => {
      return state.userInfo.permissions.includes(permission)
    },
    
    // 检查是否有指定角色
    hasRole: (state) => (role: string) => {
      return state.userInfo.roles.includes(role)
    },
    
    // 检查是否有任一权限
    hasAnyPermission: (state) => (permissions: string[]) => {
      return permissions.some(permission => 
        state.userInfo.permissions.includes(permission)
      )
    },
    
    // 检查是否有所有权限
    hasAllPermissions: (state) => (permissions: string[]) => {
      return permissions.every(permission => 
        state.userInfo.permissions.includes(permission)
      )
    },
    
    // 是否需要刷新token
    needRefreshToken: (state) => {
      const now = Date.now()
      const tokenAge = now - state.loginTime
      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7天
      return tokenAge > maxAge * 0.8 // 超过80%时间时刷新
    }
  },
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo: Partial<UserState['userInfo']>) {
      this.userInfo = { ...this.userInfo, ...userInfo }
      this.lastUpdated = Date.now()
    },
    
    // 设置token
    setToken(token: string) {
      this.token = token
      setToken(token)
      this.loginTime = Date.now()
    },
    
    // 设置刷新token
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
    
    // 更新最后活跃时间
    updateLastActiveTime() {
      this.lastActiveTime = Date.now()
    },
    
    // 登录
    async login(loginForm: { username: string; password: string; captcha?: string }) {
      this.loading = true
      this.error = null
      
      try {
        const response = await login(loginForm)
        const { token, refreshToken, userInfo } = response.data
        
        this.setToken(token)
        this.setRefreshToken(refreshToken)
        this.setUserInfo(userInfo)
        
        ElMessage.success('登录成功')
        return response
      } catch (error: any) {
        this.error = error.message || '登录失败'
        ElMessage.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      if (!this.token) {
        throw new Error('未登录')
      }
      
      this.loading = true
      this.error = null
      
      try {
        const response = await getUserInfo()
        this.setUserInfo(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message || '获取用户信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 刷新token
    async refreshUserToken() {
      if (!this.refreshToken) {
        throw new Error('无刷新token')
      }
      
      try {
        const response = await refreshToken(this.refreshToken)
        const { token, refreshToken: newRefreshToken } = response.data
        
        this.setToken(token)
        this.setRefreshToken(newRefreshToken)
        
        return response
      } catch (error) {
        // 刷新失败，清除所有信息
        await this.logout()
        throw error
      }
    },
    
    // 登出
    async logout(showConfirm = false) {
      if (showConfirm) {
        try {
          await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }
          )
        } catch {
          return
        }
      }
      
      try {
        if (this.token) {
          await logout()
        }
      } catch (error) {
        console.error('登出请求失败:', error)
      } finally {
        // 清除本地状态
        this.token = ''
        this.refreshToken = ''
        this.userInfo = {
          id: '',
          username: '',
          nickname: '',
          avatar: '',
          email: '',
          phone: '',
          roles: [],
          permissions: []
        }
        this.loginTime = 0
        this.lastActiveTime = 0
        
        removeToken()
        ElMessage.success('已退出登录')
        
        // 跳转到登录页
        window.location.href = '/login'
      }
    },
    
    // 重置状态
    resetState() {
      this.$reset()
      removeToken()
    }
  },
  
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['userInfo', 'token', 'refreshToken', 'loginTime']
  }
})
```

#### 2.2 应用状态管理

```typescript
// stores/app.ts
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { AppState } from '@/types/store'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    locale: 'zh-CN',
    sidebar: {
      collapsed: false,
      width: 240
    },
    device: 'desktop',
    size: 'default'
  }),
  
  getters: {
    // 是否为暗黑主题
    isDark: (state) => state.theme === 'dark',
    
    // 是否为移动设备
    isMobile: (state) => state.device === 'mobile',
    
    // 侧边栏实际宽度
    sidebarWidth: (state) => {
      return state.sidebar.collapsed ? 64 : state.sidebar.width
    },
    
    // 主内容区域样式
    mainContentStyle: (state) => {
      const marginLeft = state.sidebar.collapsed ? 64 : state.sidebar.width
      return {
        marginLeft: `${marginLeft}px`,
        transition: 'margin-left 0.3s'
      }
    }
  },
  
  actions: {
    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.applyTheme()
      ElMessage.success(`已切换到${this.theme === 'light' ? '浅色' : '深色'}主题`)
    },
    
    // 设置主题
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      this.applyTheme()
    },
    
    // 应用主题
    applyTheme() {
      const html = document.documentElement
      if (this.theme === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    },
    
    // 设置语言
    setLocale(locale: string) {
      this.locale = locale
      // 这里可以触发国际化更新
      ElMessage.success('语言设置已更新')
    },
    
    // 切换侧边栏
    toggleSidebar() {
      this.sidebar.collapsed = !this.sidebar.collapsed
    },
    
    // 设置侧边栏状态
    setSidebarCollapsed(collapsed: boolean) {
      this.sidebar.collapsed = collapsed
    },
    
    // 设置侧边栏宽度
    setSidebarWidth(width: number) {
      this.sidebar.width = Math.max(200, Math.min(400, width))
    },
    
    // 设置设备类型
    setDevice(device: 'desktop' | 'tablet' | 'mobile') {
      this.device = device
      
      // 移动设备自动收起侧边栏
      if (device === 'mobile') {
        this.sidebar.collapsed = true
      }
    },
    
    // 设置组件尺寸
    setSize(size: 'large' | 'default' | 'small') {
      this.size = size
    },
    
    // 初始化应用设置
    initializeApp() {
      this.applyTheme()
      this.detectDevice()
    },
    
    // 检测设备类型
    detectDevice() {
      const width = window.innerWidth
      if (width < 768) {
        this.setDevice('mobile')
      } else if (width < 1024) {
        this.setDevice('tablet')
      } else {
        this.setDevice('desktop')
      }
    }
  },
  
  persist: {
    key: 'app-store',
    storage: localStorage
  }
})
```

### 3. 业务状态管理模块

#### 3.1 表格状态管理

```typescript
// stores/table.ts
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { TableState } from '@/types/store'

// 创建表格状态管理工厂
export function createTableStore(name: string, api: any) {
  return defineStore(`table-${name}`, {
    state: (): TableState => ({
      data: [],
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizes: [10, 20, 50, 100]
      },
      filters: {},
      sorter: {},
      columns: [],
      loading: false,
      error: null,
      lastUpdated: 0
    }),
    
    getters: {
      // 是否有选中行
      hasSelectedRows: (state) => state.selectedRows.length > 0,
      
      // 选中行数量
      selectedCount: (state) => state.selectedRows.length,
      
      // 是否全选
      isAllSelected: (state) => {
        return state.data.length > 0 && 
               state.selectedRows.length === state.data.length
      },
      
      // 是否部分选中
      isIndeterminate: (state) => {
        return state.selectedRows.length > 0 && 
               state.selectedRows.length < state.data.length
      },
      
      // 分页信息
      paginationInfo: (state) => {
        const { current, pageSize, total } = state.pagination
        const start = (current - 1) * pageSize + 1
        const end = Math.min(current * pageSize, total)
        return { start, end, total }
      }
    },
    
    actions: {
      // 加载数据
      async loadData(params: any = {}) {
        this.loading = true
        this.error = null
        
        try {
          const requestParams = {
            page: this.pagination.current,
            pageSize: this.pagination.pageSize,
            ...this.filters,
            ...this.sorter,
            ...params
          }
          
          const response = await api.getList(requestParams)
          const { data, total } = response.data
          
          this.data = data
          this.pagination.total = total
          this.lastUpdated = Date.now()
          
          return response
        } catch (error: any) {
          this.error = error.message || '加载数据失败'
          ElMessage.error(this.error)
          throw error
        } finally {
          this.loading = false
        }
      },
      
      // 刷新数据
      async refresh() {
        await this.loadData()
      },
      
      // 重置并加载
      async reset() {
        this.pagination.current = 1
        this.filters = {}
        this.sorter = {}
        this.selectedRows = []
        await this.loadData()
      },
      
      // 设置分页
      setPagination(pagination: Partial<TableState['pagination']>) {
        this.pagination = { ...this.pagination, ...pagination }
      },
      
      // 页码变化
      async handlePageChange(page: number) {
        this.pagination.current = page
        await this.loadData()
      },
      
      // 页大小变化
      async handlePageSizeChange(pageSize: number) {
        this.pagination.pageSize = pageSize
        this.pagination.current = 1
        await this.loadData()
      },
      
      // 设置过滤器
      async setFilters(filters: Record<string, any>) {
        this.filters = { ...filters }
        this.pagination.current = 1
        await this.loadData()
      },
      
      // 设置排序
      async setSorter(sorter: { field?: string; order?: 'ascend' | 'descend' }) {
        this.sorter = { ...sorter }
        await this.loadData()
      },
      
      // 选择行
      setSelectedRows(rows: any[]) {
        this.selectedRows = [...rows]
      },
      
      // 选择单行
      toggleRowSelection(row: any, selected?: boolean) {
        const index = this.selectedRows.findIndex(item => item.id === row.id)
        
        if (selected === undefined) {
          selected = index === -1
        }
        
        if (selected && index === -1) {
          this.selectedRows.push(row)
        } else if (!selected && index !== -1) {
          this.selectedRows.splice(index, 1)
        }
      },
      
      // 全选/取消全选
      toggleAllSelection(selected?: boolean) {
        if (selected === undefined) {
          selected = !this.isAllSelected
        }
        
        this.selectedRows = selected ? [...this.data] : []
      },
      
      // 清除选择
      clearSelection() {
        this.selectedRows = []
      },
      
      // 删除选中行
      async deleteSelected() {
        if (this.selectedRows.length === 0) {
          ElMessage.warning('请选择要删除的数据')
          return
        }
        
        try {
          const ids = this.selectedRows.map(row => row.id)
          await api.batchDelete(ids)
          
          ElMessage.success('删除成功')
          this.clearSelection()
          await this.refresh()
        } catch (error: any) {
          ElMessage.error(error.message || '删除失败')
          throw error
        }
      },
      
      // 添加数据
      async addItem(item: any) {
        try {
          const response = await api.create(item)
          ElMessage.success('添加成功')
          await this.refresh()
          return response
        } catch (error: any) {
          ElMessage.error(error.message || '添加失败')
          throw error
        }
      },
      
      // 更新数据
      async updateItem(id: string, item: any) {
        try {
          const response = await api.update(id, item)
          ElMessage.success('更新成功')
          await this.refresh()
          return response
        } catch (error: any) {
          ElMessage.error(error.message || '更新失败')
          throw error
        }
      },
      
      // 删除数据
      async deleteItem(id: string) {
        try {
          await api.delete(id)
          ElMessage.success('删除成功')
          await this.refresh()
        } catch (error: any) {
          ElMessage.error(error.message || '删除失败')
          throw error
        }
      }
    }
  })
}

// 用户表格状态
export const useUserTableStore = createTableStore('user', {
  getList: (params: any) => import('@/api/user').then(m => m.getUserList(params)),
  create: (data: any) => import('@/api/user').then(m => m.createUser(data)),
  update: (id: string, data: any) => import('@/api/user').then(m => m.updateUser(id, data)),
  delete: (id: string) => import('@/api/user').then(m => m.deleteUser(id)),
  batchDelete: (ids: string[]) => import('@/api/user').then(m => m.batchDeleteUsers(ids))
})
```

#### 3.2 表单状态管理

```typescript
// stores/form.ts
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { FormState } from '@/types/store'

// 创建表单状态管理工厂
export function createFormStore(name: string, api: any, initialData: any = {}) {
  return defineStore(`form-${name}`, {
    state: (): FormState => ({
      data: { ...initialData },
      rules: {},
      disabled: false,
      readonly: false,
      mode: 'create',
      loading: false,
      error: null,
      lastUpdated: 0
    }),
    
    getters: {
      // 是否为创建模式
      isCreateMode: (state) => state.mode === 'create',
      
      // 是否为编辑模式
      isEditMode: (state) => state.mode === 'edit',
      
      // 是否为查看模式
      isViewMode: (state) => state.mode === 'view',
      
      // 表单是否可编辑
      isEditable: (state) => {
        return !state.readonly && !state.disabled && state.mode !== 'view'
      },
      
      // 获取表单标题
      formTitle: (state) => {
        const titles = {
          create: '新增',
          edit: '编辑',
          view: '查看'
        }
        return titles[state.mode]
      }
    },
    
    actions: {
      // 设置表单数据
      setData(data: Record<string, any>) {
        this.data = { ...this.data, ...data }
        this.lastUpdated = Date.now()
      },
      
      // 设置字段值
      setFieldValue(field: string, value: any) {
        this.data[field] = value
        this.lastUpdated = Date.now()
      },
      
      // 设置表单规则
      setRules(rules: Record<string, any>) {
        this.rules = { ...rules }
      },
      
      // 设置表单模式
      setMode(mode: 'create' | 'edit' | 'view') {
        this.mode = mode
        this.readonly = mode === 'view'
      },
      
      // 设置禁用状态
      setDisabled(disabled: boolean) {
        this.disabled = disabled
      },
      
      // 设置只读状态
      setReadonly(readonly: boolean) {
        this.readonly = readonly
      },
      
      // 重置表单
      reset() {
        this.data = { ...initialData }
        this.error = null
        this.lastUpdated = Date.now()
      },
      
      // 加载数据（编辑/查看模式）
      async loadData(id: string) {
        if (!id) return
        
        this.loading = true
        this.error = null
        
        try {
          const response = await api.getById(id)
          this.setData(response.data)
          return response.data
        } catch (error: any) {
          this.error = error.message || '加载数据失败'
          ElMessage.error(this.error)
          throw error
        } finally {
          this.loading = false
        }
      },
      
      // 提交表单
      async submit() {
        this.loading = true
        this.error = null
        
        try {
          let response
          
          if (this.mode === 'create') {
            response = await api.create(this.data)
            ElMessage.success('创建成功')
          } else if (this.mode === 'edit') {
            response = await api.update(this.data.id, this.data)
            ElMessage.success('更新成功')
          }
          
          return response
        } catch (error: any) {
          this.error = error.message || '提交失败'
          ElMessage.error(this.error)
          throw error
        } finally {
          this.loading = false
        }
      },
      
      // 验证表单
      async validate(formRef: any) {
        if (!formRef) {
          throw new Error('表单引用不存在')
        }
        
        try {
          await formRef.validate()
          return true
        } catch (error) {
          ElMessage.error('表单验证失败，请检查输入')
          return false
        }
      },
      
      // 清除验证
      clearValidate(formRef: any, fields?: string[]) {
        if (formRef) {
          formRef.clearValidate(fields)
        }
      }
    }
  })
}

// 用户表单状态
export const useUserFormStore = createFormStore('user', {
  getById: (id: string) => import('@/api/user').then(m => m.getUserById(id)),
  create: (data: any) => import('@/api/user').then(m => m.createUser(data)),
  update: (id: string, data: any) => import('@/api/user').then(m => m.updateUser(id, data))
}, {
  username: '',
  nickname: '',
  email: '',
  phone: '',
  status: 1,
  roles: []
})
```

### 4. 状态持久化与同步

#### 4.1 高级持久化策略

```typescript
// utils/persistence.ts
import { PiniaPluginContext } from 'pinia'
import { watch } from 'vue'

// 持久化配置接口
interface PersistenceConfig {
  key?: string
  storage?: Storage
  paths?: string[]
  serializer?: {
    serialize: (value: any) => string
    deserialize: (value: string) => any
  }
  beforeRestore?: (context: PiniaPluginContext) => void
  afterRestore?: (context: PiniaPluginContext) => void
  filter?: (mutation: any) => boolean
}

// 创建持久化插件
export function createPersistencePlugin(defaultConfig: PersistenceConfig = {}) {
  return (context: PiniaPluginContext) => {
    const { store, options } = context
    const config = { ...defaultConfig, ...options.persist }
    
    if (!config || config === false) return
    
    const {
      key = store.$id,
      storage = localStorage,
      paths,
      serializer = {
        serialize: JSON.stringify,
        deserialize: JSON.parse
      },
      beforeRestore,
      afterRestore,
      filter
    } = config
    
    // 恢复状态
    const restore = () => {
      try {
        beforeRestore?.(context)
        
        const stored = storage.getItem(key)
        if (stored) {
          const data = serializer.deserialize(stored)
          
          if (paths) {
            // 只恢复指定路径的数据
            paths.forEach(path => {
              if (data[path] !== undefined) {
                store.$patch({ [path]: data[path] })
              }
            })
          } else {
            // 恢复所有数据
            store.$patch(data)
          }
        }
        
        afterRestore?.(context)
      } catch (error) {
        console.error('恢复状态失败:', error)
      }
    }
    
    // 保存状态
    const persist = () => {
      try {
        let data = store.$state
        
        if (paths) {
          // 只保存指定路径的数据
          data = paths.reduce((acc, path) => {
            acc[path] = store.$state[path]
            return acc
          }, {} as any)
        }
        
        storage.setItem(key, serializer.serialize(data))
      } catch (error) {
        console.error('保存状态失败:', error)
      }
    }
    
    // 监听状态变化
    store.$subscribe((mutation, state) => {
      if (!filter || filter(mutation)) {
        persist()
      }
    })
    
    // 初始恢复
    restore()
  }
}

// 状态同步管理器
class StateSyncManager {
  private syncChannels: Map<string, BroadcastChannel> = new Map()
  private stores: Map<string, any> = new Map()
  
  // 注册状态同步
  registerSync(storeId: string, store: any, options: {
    channel?: string
    paths?: string[]
    debounce?: number
  } = {}) {
    const {
      channel = `sync-${storeId}`,
      paths,
      debounce = 100
    } = options
    
    this.stores.set(storeId, store)
    
    // 创建广播通道
    if (!this.syncChannels.has(channel)) {
      const bc = new BroadcastChannel(channel)
      
      bc.onmessage = (event) => {
        const { type, storeId: sourceStoreId, data } = event.data
        
        if (type === 'state-update' && sourceStoreId !== storeId) {
          const targetStore = this.stores.get(storeId)
          if (targetStore) {
            targetStore.$patch(data)
          }
        }
      }
      
      this.syncChannels.set(channel, bc)
    }
    
    const bc = this.syncChannels.get(channel)!
    
    // 防抖发送更新
    let timeoutId: number
    
    store.$subscribe((mutation: any, state: any) => {
      clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        let data = state
        
        if (paths) {
          data = paths.reduce((acc, path) => {
            acc[path] = state[path]
            return acc
          }, {} as any)
        }
        
        bc.postMessage({
          type: 'state-update',
          storeId,
          data,
          timestamp: Date.now()
        })
      }, debounce)
    })
  }
  
  // 取消同步
  unregisterSync(storeId: string) {
    this.stores.delete(storeId)
  }
  
  // 关闭所有通道
  closeAllChannels() {
    this.syncChannels.forEach(channel => channel.close())
    this.syncChannels.clear()
    this.stores.clear()
  }
}

export const stateSyncManager = new StateSyncManager()
```

#### 4.2 状态监控与调试

```typescript
// utils/storeDevtools.ts
import { PiniaPluginContext } from 'pinia'

// 状态监控插件
export function createDevtoolsPlugin() {
  return (context: PiniaPluginContext) => {
    const { store } = context
    
    if (process.env.NODE_ENV === 'development') {
      // 添加调试方法
      store.$debug = {
        // 获取状态快照
        getSnapshot: () => JSON.parse(JSON.stringify(store.$state)),
        
        // 恢复状态快照
        restoreSnapshot: (snapshot: any) => {
          store.$patch(snapshot)
        },
        
        // 获取状态历史
        getHistory: () => store._history || [],
        
        // 清除历史
        clearHistory: () => {
          if (store._history) {
            store._history.length = 0
          }
        },
        
        // 时间旅行
        timeTravel: (index: number) => {
          const history = store._history
          if (history && history[index]) {
            store.$patch(history[index])
          }
        }
      }
      
      // 记录状态历史
      if (!store._history) {
        store._history = []
      }
      
      store.$subscribe((mutation, state) => {
        const history = store._history
        if (history) {
          history.push({
            mutation: {
              type: mutation.type,
              storeId: mutation.storeId,
              payload: mutation.payload
            },
            state: JSON.parse(JSON.stringify(state)),
            timestamp: Date.now()
          })
          
          // 限制历史记录数量
          if (history.length > 50) {
            history.shift()
          }
        }
      })
      
      // 性能监控
      const originalPatch = store.$patch
      store.$patch = function(partialStateOrMutator: any) {
        const start = performance.now()
        const result = originalPatch.call(this, partialStateOrMutator)
        const end = performance.now()
        
        console.log(`[${store.$id}] $patch took ${end - start} milliseconds`)
        return result
      }
    }
  }
}

// 状态性能分析器
class StorePerformanceAnalyzer {
  private metrics: Map<string, any[]> = new Map()
  
  // 开始监控
  startMonitoring(storeId: string, store: any) {
    if (!this.metrics.has(storeId)) {
      this.metrics.set(storeId, [])
    }
    
    const metrics = this.metrics.get(storeId)!
    
    store.$subscribe((mutation: any, state: any) => {
      metrics.push({
        type: 'mutation',
        mutation: mutation.type,
        timestamp: Date.now(),
        stateSize: JSON.stringify(state).length
      })
      
      // 限制指标数量
      if (metrics.length > 1000) {
        metrics.splice(0, 500)
      }
    })
  }
  
  // 获取性能报告
  getPerformanceReport(storeId: string) {
    const metrics = this.metrics.get(storeId) || []
    
    if (metrics.length === 0) {
      return null
    }
    
    const mutationCounts = metrics.reduce((acc, metric) => {
      acc[metric.mutation] = (acc[metric.mutation] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const avgStateSize = metrics.reduce((sum, metric) => 
      sum + metric.stateSize, 0
    ) / metrics.length
    
    const timeRange = {
      start: metrics[0]?.timestamp,
      end: metrics[metrics.length - 1]?.timestamp
    }
    
    return {
      storeId,
      totalMutations: metrics.length,
      mutationCounts,
      avgStateSize: Math.round(avgStateSize),
      timeRange,
      duration: timeRange.end - timeRange.start
    }
  }
  
  // 清除指标
  clearMetrics(storeId?: string) {
    if (storeId) {
      this.metrics.delete(storeId)
    } else {
      this.metrics.clear()
    }
  }
}

export const performanceAnalyzer = new StorePerformanceAnalyzer()
```

## 实践练习

### 练习 1：构建用户管理状态

1. 创建完整的用户状态管理模块
2. 实现用户信息的持久化存储
3. 添加权限验证和角色管理
4. 测试状态的响应性和一致性

### 练习 2：实现表格状态管理

1. 创建可复用的表格状态管理工厂
2. 实现分页、排序、筛选功能
3. 添加批量操作和选择管理
4. 优化数据加载和缓存策略

### 练习 3：开发状态同步系统

1. 实现多标签页状态同步
2. 添加状态持久化和恢复
3. 创建状态监控和调试工具
4. 测试性能和内存使用

## 学习资源

* [Pinia 官方文档](https://pinia.vuejs.org/)
* [Vue 3 状态管理](https://cn.vuejs.org/guide/scaling-up/state-management.html)
* [Element Plus 表格组件](https://element-plus.org/zh-CN/component/table.html)
* [Element Plus 表单组件](https://element-plus.org/zh-CN/component/form.html)

## 作业

1. 完成所有实践练习
2. 设计一个完整的状态管理架构
3. 实现状态的性能优化方案
4. 编写状态管理最佳实践文档

## 下一步学习计划

接下来我们将学习 **Element Plus 迁移工具使用与实践**，了解如何使用官方迁移工具进行版本升级和代码迁移。