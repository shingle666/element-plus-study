# 第77天：高级特性综合项目实践

## 学习目标

- 综合运用 Element Plus 的所有高级特性
- 构建企业级的完整应用系统
- 实践复杂业务场景的解决方案
- 掌握大型项目的架构设计和优化策略

## 1. 项目架构设计

### 1.1 整体架构规划

```typescript
// 项目架构配置
interface ProjectArchitecture {
  frontend: {
    framework: 'Vue 3'
    ui: 'Element Plus'
    stateManagement: 'Pinia'
    routing: 'Vue Router'
    build: 'Vite'
    testing: 'Vitest + Cypress'
  }
  backend: {
    runtime: 'Node.js'
    framework: 'Express/Fastify'
    database: 'PostgreSQL + Redis'
    auth: 'JWT + OAuth2'
    api: 'GraphQL + REST'
  }
  deployment: {
    containerization: 'Docker'
    orchestration: 'Kubernetes'
    ci_cd: 'GitHub Actions'
    monitoring: 'Prometheus + Grafana'
  }
}

// 微前端架构配置
interface MicrofrontendConfig {
  shell: {
    name: 'main-shell'
    port: 3000
    routes: ['/dashboard', '/profile']
    shared: ['vue', 'element-plus', 'pinia']
  }
  modules: [
    {
      name: 'user-management'
      port: 3001
      routes: ['/users', '/roles', '/permissions']
      exposed: ['./UserModule']
    },
    {
      name: 'content-management'
      port: 3002
      routes: ['/content', '/media', '/templates']
      exposed: ['./ContentModule']
    },
    {
      name: 'analytics-dashboard'
      port: 3003
      routes: ['/analytics', '/reports', '/insights']
      exposed: ['./AnalyticsModule']
    }
  ]
}

// 项目结构定义
const projectStructure = {
  'packages/': {
    'shared/': {
      'components/': 'Common UI components',
      'composables/': 'Shared composition functions',
      'utils/': 'Utility functions',
      'types/': 'TypeScript type definitions',
      'constants/': 'Application constants'
    },
    'shell/': {
      'src/': {
        'layouts/': 'Application layouts',
        'router/': 'Main routing configuration',
        'store/': 'Global state management',
        'plugins/': 'Vue plugins and configurations'
      }
    },
    'modules/': {
      'user-management/': 'User management microfrontend',
      'content-management/': 'Content management microfrontend',
      'analytics-dashboard/': 'Analytics dashboard microfrontend'
    }
  },
  'apps/': {
    'admin/': 'Admin application',
    'mobile/': 'Mobile application',
    'public/': 'Public website'
  },
  'tools/': {
    'build/': 'Build tools and configurations',
    'deploy/': 'Deployment scripts',
    'testing/': 'Testing utilities'
  }
}
```

### 1.2 核心系统架构

```typescript
// 系统核心服务架构
class SystemArchitecture {
  private services: Map<string, any> = new Map()
  private modules: Map<string, any> = new Map()
  private plugins: Map<string, any> = new Map()
  
  constructor() {
    this.initializeCoreServices()
  }
  
  private initializeCoreServices(): void {
    // 认证服务
    this.services.set('auth', new AuthenticationService())
    
    // 权限服务
    this.services.set('permission', new PermissionService())
    
    // 数据服务
    this.services.set('data', new DataService())
    
    // 通知服务
    this.services.set('notification', new NotificationService())
    
    // 日志服务
    this.services.set('logger', new LoggerService())
    
    // 缓存服务
    this.services.set('cache', new CacheService())
    
    // 国际化服务
    this.services.set('i18n', new I18nService())
    
    // 主题服务
    this.services.set('theme', new ThemeService())
  }
  
  // 注册模块
  registerModule(name: string, module: any): void {
    this.modules.set(name, module)
    
    // 初始化模块
    if (module.initialize) {
      module.initialize(this.services)
    }
  }
  
  // 注册插件
  registerPlugin(name: string, plugin: any): void {
    this.plugins.set(name, plugin)
    
    // 安装插件
    if (plugin.install) {
      plugin.install(this)
    }
  }
  
  // 获取服务
  getService<T>(name: string): T {
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service ${name} not found`)
    }
    return service
  }
  
  // 启动系统
  async bootstrap(): Promise<void> {
    console.log('Bootstrapping system...')
    
    // 启动核心服务
    for (const [name, service] of this.services) {
      if (service.start) {
        await service.start()
        console.log(`Service ${name} started`)
      }
    }
    
    // 启动模块
    for (const [name, module] of this.modules) {
      if (module.start) {
        await module.start()
        console.log(`Module ${name} started`)
      }
    }
    
    console.log('System bootstrap completed')
  }
  
  // 关闭系统
  async shutdown(): Promise<void> {
    console.log('Shutting down system...')
    
    // 关闭模块
    for (const [name, module] of this.modules) {
      if (module.stop) {
        await module.stop()
        console.log(`Module ${name} stopped`)
      }
    }
    
    // 关闭服务
    for (const [name, service] of this.services) {
      if (service.stop) {
        await service.stop()
        console.log(`Service ${name} stopped`)
      }
    }
    
    console.log('System shutdown completed')
  }
}

// 全局系统实例
export const systemArchitecture = new SystemArchitecture()
```

## 2. 企业级用户管理系统

### 2.1 用户管理模块

```typescript
// 用户管理核心类型
interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  roles: Role[]
  permissions: Permission[]
  status: 'active' | 'inactive' | 'suspended'
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
  profile: UserProfile
  preferences: UserPreferences
}

interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: Date
}

interface Permission {
  id: string
  name: string
  resource: string
  action: string
  conditions?: Record<string, any>
}

interface UserProfile {
  department: string
  position: string
  phone?: string
  address?: string
  bio?: string
  socialLinks?: Record<string, string>
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    layout: string
    widgets: string[]
  }
}

// 用户管理服务
class UserManagementService {
  private apiClient: ApiClient
  private cache: CacheService
  
  constructor(apiClient: ApiClient, cache: CacheService) {
    this.apiClient = apiClient
    this.cache = cache
  }
  
  // 获取用户列表
  async getUsers(params: UserQueryParams): Promise<PaginatedResponse<User>> {
    const cacheKey = `users:${JSON.stringify(params)}`
    
    // 尝试从缓存获取
    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    const response = await this.apiClient.get<PaginatedResponse<User>>('/users', {
      params
    })
    
    // 缓存结果
    await this.cache.set(cacheKey, response.data, 300) // 5分钟缓存
    
    return response.data
  }
  
  // 获取单个用户
  async getUser(id: string): Promise<User> {
    const cacheKey = `user:${id}`
    
    const cached = await this.cache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    const response = await this.apiClient.get<User>(`/users/${id}`)
    
    await this.cache.set(cacheKey, response.data, 600) // 10分钟缓存
    
    return response.data
  }
  
  // 创建用户
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await this.apiClient.post<User>('/users', userData)
    
    // 清除相关缓存
    await this.cache.deletePattern('users:*')
    
    return response.data
  }
  
  // 更新用户
  async updateUser(id: string, updates: UpdateUserRequest): Promise<User> {
    const response = await this.apiClient.put<User>(`/users/${id}`, updates)
    
    // 更新缓存
    await this.cache.set(`user:${id}`, response.data, 600)
    await this.cache.deletePattern('users:*')
    
    return response.data
  }
  
  // 删除用户
  async deleteUser(id: string): Promise<void> {
    await this.apiClient.delete(`/users/${id}`)
    
    // 清除缓存
    await this.cache.delete(`user:${id}`)
    await this.cache.deletePattern('users:*')
  }
  
  // 批量操作
  async batchUpdateUsers(operations: BatchUserOperation[]): Promise<BatchOperationResult> {
    const response = await this.apiClient.post<BatchOperationResult>('/users/batch', {
      operations
    })
    
    // 清除所有用户相关缓存
    await this.cache.deletePattern('user*')
    
    return response.data
  }
  
  // 用户角色管理
  async assignRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.apiClient.post(`/users/${userId}/roles`, { roleIds })
    
    // 清除用户缓存
    await this.cache.delete(`user:${userId}`)
  }
  
  async removeRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.apiClient.delete(`/users/${userId}/roles`, { data: { roleIds } })
    
    await this.cache.delete(`user:${userId}`)
  }
  
  // 用户权限检查
  async checkPermission(userId: string, permission: string): Promise<boolean> {
    const cacheKey = `permission:${userId}:${permission}`
    
    const cached = await this.cache.get(cacheKey)
    if (cached !== null) {
      return cached
    }
    
    const response = await this.apiClient.get<{ hasPermission: boolean }>(
      `/users/${userId}/permissions/${permission}`
    )
    
    const hasPermission = response.data.hasPermission
    await this.cache.set(cacheKey, hasPermission, 300)
    
    return hasPermission
  }
}
```

### 2.2 高级用户管理界面

```vue
<!-- UserManagementDashboard.vue -->
<template>
  <div class="user-management-dashboard">
    <!-- 顶部操作栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1>{{ $t('userManagement.title') }}</h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">
            {{ $t('common.dashboard') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('userManagement.title') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <div class="header-right">
        <el-button-group>
          <el-button 
            type="primary" 
            :icon="Plus" 
            @click="handleCreateUser"
            v-permission="'user:create'"
          >
            {{ $t('userManagement.createUser') }}
          </el-button>
          
          <el-button 
            :icon="Upload" 
            @click="handleImportUsers"
            v-permission="'user:import'"
          >
            {{ $t('userManagement.importUsers') }}
          </el-button>
          
          <el-button 
            :icon="Download" 
            @click="handleExportUsers"
            v-permission="'user:export'"
          >
            {{ $t('userManagement.exportUsers') }}
          </el-button>
        </el-button-group>
      </div>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="stat in userStats" :key="stat.key">
          <el-card class="stat-card" :class="`stat-card--${stat.type}`">
            <div class="stat-content">
              <div class="stat-icon">
                <component :is="stat.icon" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-change" :class="stat.changeClass">
                  <component :is="stat.changeIcon" />
                  {{ stat.change }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 搜索和过滤 -->
    <el-card class="search-card">
      <div class="search-form">
        <el-form :model="searchForm" inline>
          <el-form-item :label="$t('userManagement.search.keyword')">
            <el-input
              v-model="searchForm.keyword"
              :placeholder="$t('userManagement.search.keywordPlaceholder')"
              :prefix-icon="Search"
              clearable
              @input="handleSearch"
            />
          </el-form-item>
          
          <el-form-item :label="$t('userManagement.search.status')">
            <el-select 
              v-model="searchForm.status" 
              :placeholder="$t('userManagement.search.statusPlaceholder')"
              clearable
              @change="handleSearch"
            >
              <el-option 
                v-for="status in userStatusOptions" 
                :key="status.value"
                :label="status.label" 
                :value="status.value"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('userManagement.search.role')">
            <el-select 
              v-model="searchForm.roleId" 
              :placeholder="$t('userManagement.search.rolePlaceholder')"
              clearable
              @change="handleSearch"
            >
              <el-option 
                v-for="role in roles" 
                :key="role.id"
                :label="role.name" 
                :value="role.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('userManagement.search.dateRange')">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              :range-separator="$t('common.to')"
              :start-placeholder="$t('common.startDate')"
              :end-placeholder="$t('common.endDate')"
              @change="handleSearch"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              {{ $t('common.search') }}
            </el-button>
            <el-button :icon="Refresh" @click="handleReset">
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <!-- 用户表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="table-header">
          <span>{{ $t('userManagement.userList') }}</span>
          <div class="table-actions">
            <el-button-group>
              <el-button 
                size="small" 
                :icon="RefreshRight" 
                @click="handleRefresh"
              >
                {{ $t('common.refresh') }}
              </el-button>
              
              <el-dropdown @command="handleBatchAction">
                <el-button size="small" :disabled="!hasSelection">
                  {{ $t('common.batchActions') }}
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="activate">
                      {{ $t('userManagement.batchActivate') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="deactivate">
                      {{ $t('userManagement.batchDeactivate') }}
                    </el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      {{ $t('userManagement.batchDelete') }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button-group>
          </div>
        </div>
      </template>
      
      <smart-table
        ref="tableRef"
        :columns="tableColumns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
        :selection="true"
        :sortable="true"
        :filterable="true"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @page-change="handlePageChange"
      >
        <!-- 自定义列模板 -->
        <template #avatar="{ row }">
          <el-avatar :src="row.avatar" :size="40">
            {{ row.firstName?.[0] }}{{ row.lastName?.[0] }}
          </el-avatar>
        </template>
        
        <template #status="{ row }">
          <el-tag 
            :type="getUserStatusType(row.status)"
            size="small"
          >
            {{ $t(`userManagement.status.${row.status}`) }}
          </el-tag>
        </template>
        
        <template #roles="{ row }">
          <div class="roles-container">
            <el-tag 
              v-for="role in row.roles.slice(0, 2)" 
              :key="role.id"
              size="small"
              class="role-tag"
            >
              {{ role.name }}
            </el-tag>
            <el-popover 
              v-if="row.roles.length > 2"
              placement="top"
              trigger="hover"
            >
              <template #reference>
                <el-tag size="small" type="info">
                  +{{ row.roles.length - 2 }}
                </el-tag>
              </template>
              <div class="roles-popover">
                <el-tag 
                  v-for="role in row.roles.slice(2)" 
                  :key="role.id"
                  size="small"
                  class="role-tag"
                >
                  {{ role.name }}
                </el-tag>
              </div>
            </el-popover>
          </div>
        </template>
        
        <template #lastLoginAt="{ row }">
          <span v-if="row.lastLoginAt">
            {{ formatRelativeTime(row.lastLoginAt) }}
          </span>
          <span v-else class="text-muted">
            {{ $t('userManagement.neverLoggedIn') }}
          </span>
        </template>
        
        <template #actions="{ row }">
          <el-button-group>
            <el-button 
              size="small" 
              type="primary" 
              :icon="View" 
              @click="handleViewUser(row)"
              v-permission="'user:read'"
            >
              {{ $t('common.view') }}
            </el-button>
            
            <el-button 
              size="small" 
              :icon="Edit" 
              @click="handleEditUser(row)"
              v-permission="'user:update'"
            >
              {{ $t('common.edit') }}
            </el-button>
            
            <el-dropdown @command="(command) => handleUserAction(command, row)">
              <el-button size="small" :icon="MoreFilled" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="resetPassword">
                    {{ $t('userManagement.resetPassword') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="impersonate">
                    {{ $t('userManagement.impersonate') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="viewActivity">
                    {{ $t('userManagement.viewActivity') }}
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    {{ $t('common.delete') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-button-group>
        </template>
      </smart-table>
    </el-card>
    
    <!-- 用户详情/编辑弹窗 -->
    <user-detail-dialog
      v-model="detailDialogVisible"
      :user="selectedUser"
      :mode="dialogMode"
      @saved="handleUserSaved"
    />
    
    <!-- 批量导入弹窗 -->
    <user-import-dialog
      v-model="importDialogVisible"
      @imported="handleUsersImported"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserManagement } from '@/composables/useUserManagement'
import { usePermission } from '@/composables/usePermission'
import { useNotification } from '@/composables/useNotification'
import SmartTable from '@/components/SmartTable.vue'
import UserDetailDialog from './components/UserDetailDialog.vue'
import UserImportDialog from './components/UserImportDialog.vue'

// 组合式函数
const { t } = useI18n()
const { hasPermission } = usePermission()
const { success, error } = useNotification()
const {
  users,
  loading,
  pagination,
  userStats,
  roles,
  searchUsers,
  createUser,
  updateUser,
  deleteUser,
  batchUpdateUsers,
  exportUsers,
  getUserStats
} = useUserManagement()

// 响应式数据
const tableRef = ref()
const selectedUsers = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const detailDialogVisible = ref(false)
const importDialogVisible = ref(false)
const dialogMode = ref<'view' | 'edit' | 'create'>('view')

const searchForm = reactive({
  keyword: '',
  status: '',
  roleId: '',
  dateRange: null
})

// 计算属性
const hasSelection = computed(() => selectedUsers.value.length > 0)

const userStatusOptions = computed(() => [
  { label: t('userManagement.status.active'), value: 'active' },
  { label: t('userManagement.status.inactive'), value: 'inactive' },
  { label: t('userManagement.status.suspended'), value: 'suspended' }
])

const tableColumns = computed(() => [
  {
    prop: 'avatar',
    label: t('userManagement.columns.avatar'),
    width: 80,
    align: 'center'
  },
  {
    prop: 'username',
    label: t('userManagement.columns.username'),
    sortable: true,
    filterable: true
  },
  {
    prop: 'email',
    label: t('userManagement.columns.email'),
    sortable: true,
    filterable: true
  },
  {
    prop: 'firstName',
    label: t('userManagement.columns.name'),
    formatter: (row: User) => `${row.firstName} ${row.lastName}`
  },
  {
    prop: 'status',
    label: t('userManagement.columns.status'),
    width: 100,
    sortable: true
  },
  {
    prop: 'roles',
    label: t('userManagement.columns.roles'),
    width: 200
  },
  {
    prop: 'lastLoginAt',
    label: t('userManagement.columns.lastLogin'),
    width: 150,
    sortable: true
  },
  {
    prop: 'actions',
    label: t('common.actions'),
    width: 200,
    fixed: 'right'
  }
])

// 方法
const handleSearch = async () => {
  await searchUsers(searchForm)
}

const handleReset = () => {
  Object.assign(searchForm, {
    keyword: '',
    status: '',
    roleId: '',
    dateRange: null
  })
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
}

const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

const handleSortChange = ({ prop, order }) => {
  // 处理排序变化
}

const handlePageChange = (page: number, size: number) => {
  pagination.value.current = page
  pagination.value.size = size
  handleSearch()
}

const handleCreateUser = () => {
  selectedUser.value = null
  dialogMode.value = 'create'
  detailDialogVisible.value = true
}

const handleViewUser = (user: User) => {
  selectedUser.value = user
  dialogMode.value = 'view'
  detailDialogVisible.value = true
}

const handleEditUser = (user: User) => {
  selectedUser.value = user
  dialogMode.value = 'edit'
  detailDialogVisible.value = true
}

const handleUserAction = async (command: string, user: User) => {
  switch (command) {
    case 'resetPassword':
      // 重置密码逻辑
      break
    case 'impersonate':
      // 模拟登录逻辑
      break
    case 'viewActivity':
      // 查看活动日志逻辑
      break
    case 'delete':
      await handleDeleteUser(user)
      break
  }
}

const handleDeleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      t('userManagement.deleteConfirm', { name: user.username }),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    await deleteUser(user.id)
    success(t('userManagement.deleteSuccess'))
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      error(t('userManagement.deleteError'))
    }
  }
}

const handleBatchAction = async (command: string) => {
  const userIds = selectedUsers.value.map(user => user.id)
  
  try {
    switch (command) {
      case 'activate':
        await batchUpdateUsers(userIds.map(id => ({ id, status: 'active' })))
        success(t('userManagement.batchActivateSuccess'))
        break
      case 'deactivate':
        await batchUpdateUsers(userIds.map(id => ({ id, status: 'inactive' })))
        success(t('userManagement.batchDeactivateSuccess'))
        break
      case 'delete':
        await ElMessageBox.confirm(
          t('userManagement.batchDeleteConfirm', { count: userIds.length }),
          t('common.warning'),
          {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            type: 'warning'
          }
        )
        await batchUpdateUsers(userIds.map(id => ({ id, deleted: true })))
        success(t('userManagement.batchDeleteSuccess'))
        break
    }
    
    handleRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      error(t('userManagement.batchActionError'))
    }
  }
}

const handleImportUsers = () => {
  importDialogVisible.value = true
}

const handleExportUsers = async () => {
  try {
    await exportUsers(searchForm)
    success(t('userManagement.exportSuccess'))
  } catch (error) {
    error(t('userManagement.exportError'))
  }
}

const handleUserSaved = () => {
  detailDialogVisible.value = false
  handleRefresh()
}

const handleUsersImported = () => {
  importDialogVisible.value = false
  handleRefresh()
}

const getUserStatusType = (status: string) => {
  const typeMap = {
    active: 'success',
    inactive: 'info',
    suspended: 'danger'
  }
  return typeMap[status] || 'info'
}

const formatRelativeTime = (date: Date) => {
  // 格式化相对时间
  return new Intl.RelativeTimeFormat().format(
    Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  )
}

// 生命周期
onMounted(async () => {
  await Promise.all([
    handleSearch(),
    getUserStats()
  ])
})
</script>

<style scoped>
.user-management-dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.stat-card--primary .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card--success .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card--warning .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card--danger .stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  padding: 10px 0;
}

.table-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.role-tag {
  margin: 0;
}

.roles-popover {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 200px;
}

.text-muted {
  color: #999;
}
</style>
```

## 3. 实践练习

1. **完整系统实现**：
   - 实现用户管理系统
   - 添加角色权限管理
   - 创建内容管理模块

2. **高级功能开发**：
   - 实现实时通知系统
   - 添加数据分析仪表板
   - 创建工作流引擎

3. **性能优化实践**：
   - 实现虚拟滚动
   - 添加智能缓存
   - 优化打包体积

## 4. 学习资源

- [Vue 3 Enterprise Patterns](https://vuejs.org/guide/)
- [Element Plus Best Practices](https://element-plus.org/)
- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/)
- [Micro-frontend Architecture](https://micro-frontends.org/)

## 5. 作业

- 完成企业级用户管理系统
- 实现微前端架构
- 创建性能监控系统
- 编写项目部署文档

## 总结

通过第77天的学习，我们完成了：

1. **架构设计**：构建了完整的企业级应用架构
2. **系统实现**：开发了复杂的用户管理系统
3. **高级特性**：集成了所有 Element Plus 高级功能
4. **最佳实践**：应用了现代前端开发的最佳实践

这个综合项目展示了 Element Plus 在企业级应用中的强大能力和灵活性。