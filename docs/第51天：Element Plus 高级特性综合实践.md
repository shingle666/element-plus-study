# 第51天：Element Plus 高级特性综合实践

## 学习目标

* 综合运用 Element Plus 的各种高级特性
* 构建一个完整的企业级应用示例
* 掌握高级特性的组合使用技巧
* 实现复杂业务场景的解决方案

## 知识点概览

### 1. 项目架构设计

#### 1.1 整体架构规划

```typescript
// src/types/global.ts

// 全局配置接口
export interface GlobalConfig {
  // 应用配置
  app: {
    name: string
    version: string
    description: string
    author: string
  }
  
  // API 配置
  api: {
    baseURL: string
    timeout: number
    retryCount: number
  }
  
  // 主题配置
  theme: {
    mode: 'light' | 'dark' | 'auto'
    primaryColor: string
    borderRadius: number
    componentSize: 'large' | 'default' | 'small'
  }
  
  // 国际化配置
  i18n: {
    locale: string
    fallbackLocale: string
    availableLocales: string[]
  }
  
  // 权限配置
  auth: {
    tokenKey: string
    refreshTokenKey: string
    tokenExpiry: number
  }
  
  // 路由配置
  router: {
    mode: 'hash' | 'history'
    base: string
    scrollBehavior: boolean
  }
}

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: Role[]
  permissions: Permission[]
  profile: UserProfile
  preferences: UserPreferences
}

// 角色接口
export interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: Permission[]
  level: number
}

// 权限接口
export interface Permission {
  id: string
  name: string
  code: string
  type: 'menu' | 'button' | 'api'
  resource: string
  action: string
  description: string
}

// 用户配置接口
export interface UserProfile {
  department: string
  position: string
  joinDate: string
  lastLoginTime: string
  loginCount: number
}

// 用户偏好设置
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  dateFormat: string
  timeFormat: string
  pageSize: number
  sidebarCollapsed: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

// API 响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  traceId: string
}

// 分页接口
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 表格列配置
export interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  type?: 'selection' | 'index' | 'expand'
  formatter?: (row: any, column: any, cellValue: any) => string
  renderHeader?: (h: any, { column }: any) => any
  renderCell?: (h: any, { row, column, $index }: any) => any
}

// 表单字段配置
export interface FormField {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'datetime' | 'number' | 'textarea' | 'switch' | 'radio' | 'checkbox' | 'upload' | 'custom'
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: any }>
  rules?: any[]
  span?: number
  offset?: number
  component?: any
  props?: Record<string, any>
  slots?: Record<string, any>
}
```

#### 1.2 核心服务架构

```typescript
// src/services/base.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import type { ApiResponse } from '@/types/global'

// HTTP 客户端类
export class HttpClient {
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number
  private retryCount: number
  
  constructor(config: {
    baseURL: string
    timeout?: number
    retryCount?: number
  }) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 10000
    this.retryCount = config.retryCount || 3
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    this.setupInterceptors()
  }
  
  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore()
        const appStore = useAppStore()
        
        // 添加认证头
        if (userStore.token) {
          config.headers.Authorization = `Bearer ${userStore.token}`
        }
        
        // 添加语言头
        config.headers['Accept-Language'] = appStore.locale
        
        // 添加请求ID
        config.headers['X-Request-ID'] = this.generateRequestId()
        
        // 添加时间戳
        config.headers['X-Timestamp'] = Date.now().toString()
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { code, message, data } = response.data
        
        // 成功响应
        if (code === 200) {
          return data
        }
        
        // 业务错误
        if (code >= 400 && code < 500) {
          ElMessage.error(message || '请求失败')
          return Promise.reject(new Error(message))
        }
        
        // 服务器错误
        if (code >= 500) {
          ElMessage.error('服务器错误，请稍后重试')
          return Promise.reject(new Error(message))
        }
        
        return data
      },
      async (error) => {
        const { response, config } = error
        
        // 网络错误
        if (!response) {
          ElMessage.error('网络连接失败，请检查网络设置')
          return Promise.reject(error)
        }
        
        const { status } = response
        
        // 处理不同的HTTP状态码
        switch (status) {
          case 401:
            await this.handleUnauthorized()
            break
          case 403:
            ElMessage.error('没有权限访问该资源')
            break
          case 404:
            ElMessage.error('请求的资源不存在')
            break
          case 429:
            ElMessage.error('请求过于频繁，请稍后重试')
            break
          case 500:
            ElMessage.error('服务器内部错误')
            break
          case 502:
          case 503:
          case 504:
            // 重试逻辑
            if (config._retryCount < this.retryCount) {
              config._retryCount = (config._retryCount || 0) + 1
              await this.delay(1000 * config._retryCount)
              return this.instance.request(config)
            }
            ElMessage.error('服务暂时不可用，请稍后重试')
            break
          default:
            ElMessage.error('请求失败，请稍后重试')
        }
        
        return Promise.reject(error)
      }
    )
  }
  
  // 处理未授权
  private async handleUnauthorized() {
    const userStore = useUserStore()
    
    try {
      await ElMessageBox.confirm(
        '登录状态已过期，请重新登录',
        '提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      
      await userStore.logout()
      window.location.href = '/login'
    } catch {
      // 用户取消
    }
  }
  
  // 生成请求ID
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // GET 请求
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }
  
  // POST 请求
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }
  
  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }
  
  // DELETE 请求
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
  
  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }
  
  // 上传文件
  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(progress)
        }
      }
    })
  }
  
  // 下载文件
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(downloadUrl)
  }
}

// 创建默认HTTP客户端实例
export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  retryCount: 3
})
```

### 2. 高级组件封装

#### 2.1 智能表格组件

```vue
<!-- src/components/SmartTable/index.vue -->
<template>
  <div class="smart-table">
    <!-- 表格工具栏 -->
    <div class="smart-table__toolbar" v-if="showToolbar">
      <div class="smart-table__toolbar-left">
        <slot name="toolbar-left">
          <el-button
            v-if="showRefresh"
            :icon="Refresh"
            @click="handleRefresh"
          >
            刷新
          </el-button>
          
          <el-button
            v-if="showAdd && hasPermission('add')"
            type="primary"
            :icon="Plus"
            @click="handleAdd"
          >
            新增
          </el-button>
          
          <el-button
            v-if="showBatchDelete && hasPermission('delete') && selectedRows.length > 0"
            type="danger"
            :icon="Delete"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          
          <el-button
            v-if="showExport && hasPermission('export')"
            :icon="Download"
            @click="handleExport"
          >
            导出
          </el-button>
        </slot>
      </div>
      
      <div class="smart-table__toolbar-right">
        <slot name="toolbar-right">
          <!-- 搜索框 -->
          <el-input
            v-if="showSearch"
            v-model="searchKeyword"
            placeholder="请输入关键词搜索"
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
            style="width: 200px; margin-right: 10px;"
          />
          
          <!-- 列设置 -->
          <el-popover
            v-if="showColumnSetting"
            placement="bottom-end"
            :width="200"
            trigger="click"
          >
            <template #reference>
              <el-button :icon="Setting" circle />
            </template>
            
            <div class="column-setting">
              <div class="column-setting__header">
                <span>列设置</span>
                <el-button
                  type="primary"
                  text
                  size="small"
                  @click="resetColumns"
                >
                  重置
                </el-button>
              </div>
              
              <el-checkbox-group v-model="visibleColumns">
                <div
                  v-for="column in allColumns"
                  :key="column.prop"
                  class="column-setting__item"
                >
                  <el-checkbox :label="column.prop">
                    {{ column.label }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
          </el-popover>
          
          <!-- 密度设置 -->
          <el-dropdown
            v-if="showDensity"
            @command="handleDensityChange"
          >
            <el-button :icon="Grid" circle />
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="large">
                  <el-icon><el-icon-expand /></el-icon>
                  宽松
                </el-dropdown-item>
                <el-dropdown-item command="default">
                  <el-icon><el-icon-minus /></el-icon>
                  默认
                </el-dropdown-item>
                <el-dropdown-item command="small">
                  <el-icon><el-icon-compress /></el-icon>
                  紧凑
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </slot>
      </div>
    </div>
    
    <!-- 高级筛选 -->
    <div class="smart-table__filters" v-if="showFilters && filters.length > 0">
      <el-form
        :model="filterForm"
        :inline="true"
        label-width="auto"
      >
        <el-form-item
          v-for="filter in filters"
          :key="filter.prop"
          :label="filter.label"
        >
          <component
            :is="getFilterComponent(filter.type)"
            v-model="filterForm[filter.prop]"
            v-bind="filter.props"
            :placeholder="filter.placeholder"
            :options="filter.options"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleFilter">
            筛选
          </el-button>
          <el-button @click="handleResetFilter">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :size="tableSize"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :row-key="rowKey"
      :tree-props="treeProps"
      :lazy="lazy"
      :load="loadChildren"
      :expand-row-keys="expandRowKeys"
      :default-expand-all="defaultExpandAll"
      :selection-change="handleSelectionChange"
      :sort-change="handleSortChange"
      :filter-change="handleFilterChange"
      :current-change="handleCurrentChange"
      :row-click="handleRowClick"
      :row-dblclick="handleRowDblclick"
      :header-click="handleHeaderClick"
      :cell-click="handleCellClick"
      :cell-dblclick="handleCellDblclick"
      :row-contextmenu="handleRowContextmenu"
      :header-contextmenu="handleHeaderContextmenu"
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        :selectable="selectable"
        :reserve-selection="reserveSelection"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        :index="indexMethod"
      />
      
      <!-- 展开列 -->
      <el-table-column
        v-if="showExpand"
        type="expand"
        width="55"
      >
        <template #default="{ row, $index }">
          <slot name="expand" :row="row" :index="$index" />
        </template>
      </el-table-column>
      
      <!-- 数据列 -->
      <el-table-column
        v-for="column in displayColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :sort-method="column.sortMethod"
        :sort-by="column.sortBy"
        :sort-orders="column.sortOrders"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align"
        :header-align="column.headerAlign"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
        :filters="column.filters"
        :filter-placement="column.filterPlacement"
        :filter-multiple="column.filterMultiple"
        :filter-method="column.filterMethod"
        :filtered-value="column.filteredValue"
      >
        <!-- 自定义表头 -->
        <template #header="{ column: col, $index }" v-if="column.renderHeader">
          <component
            :is="column.renderHeader"
            :column="col"
            :index="$index"
          />
        </template>
        
        <!-- 自定义单元格 -->
        <template #default="{ row, column: col, $index }">
          <slot
            :name="column.prop"
            :row="row"
            :column="col"
            :index="$index"
            :value="row[column.prop]"
          >
            <component
              v-if="column.renderCell"
              :is="column.renderCell"
              :row="row"
              :column="col"
              :index="$index"
              :value="row[column.prop]"
            />
            <span v-else>{{ formatCellValue(row, column) }}</span>
          </slot>
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionWidth"
        :fixed="actionFixed"
        class-name="table-actions"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <el-button
              v-if="hasPermission('edit')"
              type="primary"
              text
              size="small"
              @click="handleEdit(row, $index)"
            >
              编辑
            </el-button>
            
            <el-button
              v-if="hasPermission('delete')"
              type="danger"
              text
              size="small"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
            
            <el-dropdown
              v-if="moreActions.length > 0"
              @command="(command) => handleMoreAction(command, row, $index)"
            >
              <el-button type="primary" text size="small">
                更多
                <el-icon><el-icon-arrow-down /></el-icon>
              </el-button>
              
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="action in moreActions"
                    :key="action.command"
                    :command="action.command"
                    :disabled="action.disabled?.(row)"
                  >
                    <el-icon v-if="action.icon">
                      <component :is="action.icon" />
                    </el-icon>
                    {{ action.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页器 -->
    <div class="smart-table__pagination" v-if="showPagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        :layout="paginationLayout"
        :background="paginationBackground"
        :small="paginationSmall"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElPopover,
  ElCheckboxGroup,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElForm,
  ElFormItem,
  ElPagination,
  ElIcon,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import {
  Refresh,
  Plus,
  Delete,
  Download,
  Search,
  Setting,
  Grid
} from '@element-plus/icons-vue'
import { usePermission } from '@/hooks/usePermission'
import { useDebounceFn } from '@vueuse/core'
import type { TableColumn, PaginationParams } from '@/types/global'

// 组件属性定义
interface SmartTableProps {
  // 数据相关
  data?: any[]
  columns: TableColumn[]
  loading?: boolean
  
  // 表格配置
  size?: 'large' | 'default' | 'small'
  stripe?: boolean
  border?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  rowKey?: string
  treeProps?: any
  lazy?: boolean
  defaultExpandAll?: boolean
  
  // 功能开关
  showToolbar?: boolean
  showRefresh?: boolean
  showAdd?: boolean
  showBatchDelete?: boolean
  showExport?: boolean
  showSearch?: boolean
  showColumnSetting?: boolean
  showDensity?: boolean
  showFilters?: boolean
  showSelection?: boolean
  showIndex?: boolean
  showExpand?: boolean
  showActions?: boolean
  showPagination?: boolean
  
  // 选择相关
  selectable?: (row: any, index: number) => boolean
  reserveSelection?: boolean
  
  // 操作相关
  actionWidth?: number
  actionFixed?: 'left' | 'right'
  moreActions?: Array<{
    command: string
    label: string
    icon?: any
    disabled?: (row: any) => boolean
  }>
  
  // 筛选相关
  filters?: Array<{
    prop: string
    label: string
    type: string
    placeholder?: string
    options?: any[]
    props?: any
  }>
  
  // 分页相关
  total?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
  paginationBackground?: boolean
  paginationSmall?: boolean
  
  // API 相关
  api?: {
    list: (params: any) => Promise<any>
    delete: (id: string) => Promise<any>
    batchDelete: (ids: string[]) => Promise<any>
    export: (params: any) => Promise<any>
  }
  
  // 权限相关
  permissions?: {
    add?: string
    edit?: string
    delete?: string
    export?: string
  }
}

// 组件事件定义
interface SmartTableEmits {
  (e: 'refresh'): void
  (e: 'add'): void
  (e: 'edit', row: any, index: number): void
  (e: 'delete', row: any, index: number): void
  (e: 'batchDelete', rows: any[]): void
  (e: 'export', params: any): void
  (e: 'search', keyword: string): void
  (e: 'filter', filters: any): void
  (e: 'sort', sort: any): void
  (e: 'selectionChange', selection: any[]): void
  (e: 'currentChange', current: any): void
  (e: 'pageChange', page: number, pageSize: number): void
  (e: 'moreAction', command: string, row: any, index: number): void
}

const props = withDefaults(defineProps<SmartTableProps>(), {
  data: () => [],
  loading: false,
  size: 'default',
  stripe: true,
  border: true,
  showHeader: true,
  highlightCurrentRow: true,
  rowKey: 'id',
  lazy: false,
  defaultExpandAll: false,
  showToolbar: true,
  showRefresh: true,
  showAdd: true,
  showBatchDelete: true,
  showExport: true,
  showSearch: true,
  showColumnSetting: true,
  showDensity: true,
  showFilters: false,
  showSelection: true,
  showIndex: true,
  showExpand: false,
  showActions: true,
  showPagination: true,
  reserveSelection: false,
  actionWidth: 150,
  actionFixed: 'right',
  moreActions: () => [],
  filters: () => [],
  total: 0,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  paginationBackground: true,
  paginationSmall: false,
  permissions: () => ({})
})

const emit = defineEmits<SmartTableEmits>()

// 权限检查
const { hasPermission } = usePermission()

// 表格引用
const tableRef = ref<InstanceType<typeof ElTable>>()

// 响应式数据
const tableData = ref(props.data)
const selectedRows = ref<any[]>([])
const currentPage = ref(1)
const searchKeyword = ref('')
const filterForm = ref<any>({})
const tableSize = ref(props.size)
const allColumns = ref(props.columns)
const visibleColumns = ref(props.columns.map(col => col.prop))
const expandRowKeys = ref<any[]>([])

// 计算属性
const displayColumns = computed(() => {
  return allColumns.value.filter(col => visibleColumns.value.includes(col.prop))
})

// 防抖搜索
const debouncedSearch = useDebounceFn((keyword: string) => {
  emit('search', keyword)
}, 300)

// 方法定义
const handleRefresh = () => {
  emit('refresh')
}

const handleAdd = () => {
  emit('add')
}

const handleEdit = (row: any, index: number) => {
  emit('edit', row, index)
}

const handleDelete = async (row: any, index: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条记录吗？',
      '提示',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    emit('delete', row, index)
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
      '提示',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    emit('batchDelete', selectedRows.value)
  } catch {
    // 用户取消
  }
}

const handleExport = () => {
  const params = {
    keyword: searchKeyword.value,
    filters: filterForm.value,
    selectedIds: selectedRows.value.map(row => row[props.rowKey])
  }
  emit('export', params)
}

const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  debouncedSearch(keyword)
}

const handleFilter = () => {
  emit('filter', filterForm.value)
}

const handleResetFilter = () => {
  filterForm.value = {}
  emit('filter', {})
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selectionChange', selection)
}

const handleSortChange = (sort: any) => {
  emit('sort', sort)
}

const handleFilterChange = (filters: any) => {
  emit('filter', filters)
}

const handleCurrentChange = (current: any) => {
  emit('currentChange', current)
}

const handleSizeChange = (size: number) => {
  emit('pageChange', currentPage.value, size)
}

const handleCurrentPageChange = (page: number) => {
  currentPage.value = page
  emit('pageChange', page, props.pageSize)
}

const handleMoreAction = (command: string, row: any, index: number) => {
  emit('moreAction', command, row, index)
}

const handleDensityChange = (density: string) => {
  tableSize.value = density as any
}

const resetColumns = () => {
  visibleColumns.value = allColumns.value.map(col => col.prop)
}

const getFilterComponent = (type: string) => {
  const components: Record<string, string> = {
    input: 'el-input',
    select: 'el-select',
    date: 'el-date-picker',
    datetime: 'el-date-picker'
  }
  return components[type] || 'el-input'
}

const formatCellValue = (row: any, column: TableColumn) => {
  const value = row[column.prop]
  if (column.formatter) {
    return column.formatter(row, column, value)
  }
  return value
}

const indexMethod = (index: number) => {
  return (currentPage.value - 1) * props.pageSize + index + 1
}

const loadChildren = async (row: any, treeNode: any, resolve: any) => {
  // 懒加载子节点逻辑
  if (props.api?.list) {
    try {
      const children = await props.api.list({ parentId: row.id })
      resolve(children)
    } catch (error) {
      resolve([])
    }
  } else {
    resolve([])
  }
}

// 事件处理器
const handleRowClick = (row: any, column: any, event: Event) => {
  // 行点击事件
}

const handleRowDblclick = (row: any, column: any, event: Event) => {
  // 行双击事件
}

const handleHeaderClick = (column: any, event: Event) => {
  // 表头点击事件
}

const handleCellClick = (row: any, column: any, cell: any, event: Event) => {
  // 单元格点击事件
}

const handleCellDblclick = (row: any, column: any, cell: any, event: Event) => {
  // 单元格双击事件
}

const handleRowContextmenu = (row: any, column: any, event: Event) => {
  // 行右键菜单事件
}

const handleHeaderContextmenu = (column: any, event: Event) => {
  // 表头右键菜单事件
}

const handleSelect = (selection: any[], row: any) => {
  // 选择事件
}

const handleSelectAll = (selection: any[]) => {
  // 全选事件
}

// 监听数据变化
watch(
  () => props.data,
  (newData) => {
    tableData.value = newData
  },
  { deep: true }
)

// 暴露方法
defineExpose({
  refresh: handleRefresh,
  clearSelection: () => tableRef.value?.clearSelection(),
  toggleRowSelection: (row: any, selected?: boolean) => {
    tableRef.value?.toggleRowSelection(row, selected)
  },
  toggleAllSelection: () => tableRef.value?.toggleAllSelection(),
  toggleRowExpansion: (row: any, expanded?: boolean) => {
    tableRef.value?.toggleRowExpansion(row, expanded)
  },
  setCurrentRow: (row: any) => tableRef.value?.setCurrentRow(row),
  clearSort: () => tableRef.value?.clearSort(),
  clearFilter: (columnKeys?: string[]) => tableRef.value?.clearFilter(columnKeys),
  doLayout: () => tableRef.value?.doLayout(),
  sort: (prop: string, order: string) => tableRef.value?.sort(prop, order)
})
</script>

<style lang="scss" scoped>
.smart-table {
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    &-left {
      display: flex;
      gap: 8px;
    }
    
    &-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  &__filters {
    margin-bottom: 16px;
    padding: 16px;
    background-color: var(--el-bg-color-page);
    border-radius: var(--el-border-radius-base);
  }
  
  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.column-setting {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 500;
  }
  
  &__item {
    margin-bottom: 8px;
  }
}

:deep(.table-actions) {
  .cell {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
```

#### 2.2 动态表单组件

```vue
<!-- src/components/SmartForm/index.vue -->
<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :size="size"
    :disabled="disabled"
    :validate-on-rule-change="validateOnRuleChange"
    :hide-required-asterisk="hideRequiredAsterisk"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    @validate="handleValidate"
  >
    <el-row :gutter="gutter">
      <el-col
        v-for="field in displayFields"
        :key="field.prop"
        :span="field.span || defaultSpan"
        :offset="field.offset || 0"
      >
        <el-form-item
          :prop="field.prop"
          :label="field.label"
          :required="field.required"
          :rules="field.rules"
          :error="fieldErrors[field.prop]"
          :show-message="field.showMessage !== false"
          :inline-message="field.inlineMessage"
          :size="field.size || size"
        >
          <!-- 自定义组件 -->
          <component
            v-if="field.component"
            :is="field.component"
            v-model="formData[field.prop]"
            v-bind="field.props"
            :disabled="field.disabled || disabled"
            :readonly="field.readonly"
            :placeholder="field.placeholder"
          >
            <!-- 传递插槽 -->
            <template
              v-for="(slot, name) in field.slots"
              :key="name"
              #[name]
            >
              <component :is="slot" />
            </template>
          </component>
          
          <!-- 内置组件 -->
          <template v-else>
            <!-- 输入框 -->
            <el-input
              v-if="field.type === 'input'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :type="field.inputType || 'text'"
              :maxlength="field.maxlength"
              :minlength="field.minlength"
              :show-word-limit="field.showWordLimit"
              :clearable="field.clearable !== false"
              :show-password="field.showPassword"
              :prefix-icon="field.prefixIcon"
              :suffix-icon="field.suffixIcon"
              @input="handleFieldChange(field.prop, $event)"
              @change="handleFieldChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            />
            
            <!-- 文本域 -->
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              type="textarea"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :rows="field.rows || 3"
              :autosize="field.autosize"
              :maxlength="field.maxlength"
              :minlength="field.minlength"
              :show-word-limit="field.showWordLimit"
              :resize="field.resize"
              @input="handleFieldChange(field.prop, $event)"
              @change="handleFieldChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            />
            
            <!-- 数字输入框 -->
            <el-input-number
              v-else-if="field.type === 'number'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :min="field.min"
              :max="field.max"
              :step="field.step || 1"
              :precision="field.precision"
              :controls="field.controls !== false"
              :controls-position="field.controlsPosition"
              @change="handleFieldChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            />
            
            <!-- 选择器 -->
            <el-select
              v-else-if="field.type === 'select'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :multiple="field.multiple"
              :multiple-limit="field.multipleLimit"
              :clearable="field.clearable !== false"
              :filterable="field.filterable"
              :allow-create="field.allowCreate"
              :filter-method="field.filterMethod"
              :remote="field.remote"
              :remote-method="field.remoteMethod"
              :loading="field.loading"
              :loading-text="field.loadingText"
              :no-match-text="field.noMatchText"
              :no-data-text="field.noDataText"
              :popper-class="field.popperClass"
              :reserve-keyword="field.reserveKeyword"
              :default-first-option="field.defaultFirstOption"
              :teleported="field.teleported !== false"
              :automatic-dropdown="field.automaticDropdown"
              @change="handleFieldChange(field.prop, $event)"
              @visible-change="handleSelectVisibleChange(field.prop, $event)"
              @remove-tag="handleSelectRemoveTag(field.prop, $event)"
              @clear="handleSelectClear(field.prop)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            >
              <el-option
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
              />
            </el-select>
            
            <!-- 级联选择器 -->
            <el-cascader
              v-else-if="field.type === 'cascader'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :placeholder="field.placeholder"
              :options="field.options"
              :props="field.cascaderProps"
              :size="field.size || size"
              :clearable="field.clearable !== false"
              :show-all-levels="field.showAllLevels !== false"
              :collapse-tags="field.collapseTags"
              :collapse-tags-tooltip="field.collapseTagsTooltip"
              :separator="field.separator || ' / '"
              :filterable="field.filterable"
              :filter-method="field.filterMethod"
              :debounce="field.debounce || 300"
              :before-filter="field.beforeFilter"
              :popper-class="field.popperClass"
              :teleported="field.teleported !== false"
              @change="handleFieldChange(field.prop, $event)"
              @expand-change="handleCascaderExpandChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            />
            
            <!-- 日期选择器 -->
            <el-date-picker
              v-else-if="field.type === 'date' || field.type === 'datetime'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :type="field.dateType || field.type"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :start-placeholder="field.startPlaceholder"
              :end-placeholder="field.endPlaceholder"
              :format="field.format"
              :value-format="field.valueFormat"
              :clearable="field.clearable !== false"
              :size="field.size || size"
              :editable="field.editable !== false"
              :prefix-icon="field.prefixIcon"
              :clear-icon="field.clearIcon"
              :validate-event="field.validateEvent !== false"
              :disabled-date="field.disabledDate"
              :shortcuts="field.shortcuts"
              :cell-class-name="field.cellClassName"
              :range-separator="field.rangeSeparator || '-'"
              :default-value="field.defaultValue"
              :default-time="field.defaultTime"
              :popper-class="field.popperClass"
              :teleported="field.teleported !== false"
              @change="handleFieldChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
              @calendar-change="handleDateCalendarChange(field.prop, $event)"
              @panel-change="handleDatePanelChange(field.prop, $event)"
            />
            
            <!-- 时间选择器 -->
            <el-time-picker
              v-else-if="field.type === 'time'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :readonly="field.readonly"
              :placeholder="field.placeholder"
              :start-placeholder="field.startPlaceholder"
              :end-placeholder="field.endPlaceholder"
              :is-range="field.isRange"
              :arrow-control="field.arrowControl"
              :format="field.format"
              :value-format="field.valueFormat"
              :clearable="field.clearable !== false"
              :size="field.size || size"
              :editable="field.editable !== false"
              :prefix-icon="field.prefixIcon"
              :clear-icon="field.clearIcon"
              :disabled-hours="field.disabledHours"
              :disabled-minutes="field.disabledMinutes"
              :disabled-seconds="field.disabledSeconds"
              :range-separator="field.rangeSeparator || '-'"
              :popper-class="field.popperClass"
              :teleported="field.teleported !== false"
              @change="handleFieldChange(field.prop, $event)"
              @blur="handleFieldBlur(field.prop, $event)"
              @focus="handleFieldFocus(field.prop, $event)"
            />
            
            <!-- 开关 -->
            <el-switch
              v-else-if="field.type === 'switch'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :loading="field.loading"
              :size="field.size || size"
              :width="field.width"
              :inline-prompt="field.inlinePrompt"
              :active-icon="field.activeIcon"
              :inactive-icon="field.inactiveIcon"
              :active-text="field.activeText"
              :inactive-text="field.inactiveText"
              :active-value="field.activeValue !== undefined ? field.activeValue : true"
              :inactive-value="field.inactiveValue !== undefined ? field.inactiveValue : false"
              :active-color="field.activeColor"
              :inactive-color="field.inactiveColor"
              :border-color="field.borderColor"
              :name="field.name"
              :validate-event="field.validateEvent !== false"
              :before-change="field.beforeChange"
              @change="handleFieldChange(field.prop, $event)"
            />
            
            <!-- 单选框组 -->
            <el-radio-group
              v-else-if="field.type === 'radio'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :size="field.size || size"
              :text-color="field.textColor"
              :fill="field.fill"
              :validate-event="field.validateEvent !== false"
              @change="handleFieldChange(field.prop, $event)"
            >
              <el-radio
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
                :border="field.border"
                :size="field.size || size"
              >
                {{ option.label }}
              </el-radio>
            </el-radio-group>
            
            <!-- 复选框组 -->
            <el-checkbox-group
              v-else-if="field.type === 'checkbox'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :min="field.min"
              :max="field.max"
              :size="field.size || size"
              :text-color="field.textColor"
              :fill="field.fill"
              :tag="field.tag"
              :validate-event="field.validateEvent !== false"
              @change="handleFieldChange(field.prop, $event)"
            >
              <el-checkbox
                v-for="option in field.options"
                :key="option.value"
                :label="option.value"
                :disabled="option.disabled"
                :border="field.border"
                :size="field.size || size"
                :checked="field.checked"
                :indeterminate="field.indeterminate"
              >
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
            
            <!-- 滑块 -->
            <el-slider
              v-else-if="field.type === 'slider'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :min="field.min || 0"
              :max="field.max || 100"
              :step="field.step || 1"
              :show-input="field.showInput"
              :show-input-controls="field.showInputControls !== false"
              :input-size="field.inputSize || size"
              :show-stops="field.showStops"
              :show-tooltip="field.showTooltip !== false"
              :format-tooltip="field.formatTooltip"
              :range="field.range"
              :vertical="field.vertical"
              :height="field.height"
              :label="field.sliderLabel"
              :debounce="field.debounce || 300"
              :tooltip-class="field.tooltipClass"
              :marks="field.marks"
              @change="handleFieldChange(field.prop, $event)"
              @input="handleSliderInput(field.prop, $event)"
            />
            
            <!-- 评分 -->
            <el-rate
              v-else-if="field.type === 'rate'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :max="field.max || 5"
              :size="field.size || size"
              :allow-half="field.allowHalf"
              :low-threshold="field.lowThreshold || 2"
              :high-threshold="field.highThreshold || 4"
              :colors="field.colors"
              :void-color="field.voidColor"
              :disabled-void-color="field.disabledVoidColor"
              :icon-classes="field.iconClasses"
              :void-icon-class="field.voidIconClass"
              :disabled-void-icon-class="field.disabledVoidIconClass"
              :show-text="field.showText"
              :show-score="field.showScore"
              :text-color="field.textColor"
              :texts="field.texts"
              :score-template="field.scoreTemplate"
              @change="handleFieldChange(field.prop, $event)"
            />
            
            <!-- 颜色选择器 -->
            <el-color-picker
              v-else-if="field.type === 'color'"
              v-model="formData[field.prop]"
              v-bind="field.props"
              :disabled="field.disabled || disabled"
              :size="field.size || size"
              :show-alpha="field.showAlpha"
              :color-format="field.colorFormat"
              :popper-class="field.popperClass"
              :predefine="field.predefine"
              :validate-event="field.validateEvent !== false"
              @change="handleFieldChange(field.prop, $event)"
              @active-change="handleColorActiveChange(field.prop, $event)"
            />
            
            <!-- 上传 -->
            <el-upload
              v-else-if="field.type === 'upload'"
              v-bind="field.props"
              :action="field.action"
              :headers="field.headers"
              :method="field.method || 'post'"
              :multiple="field.multiple"
              :data="field.data"
              :name="field.name || 'file'"
              :with-credentials="field.withCredentials"
              :show-file-list="field.showFileList !== false"
              :drag="field.drag"
              :accept="field.accept"
              :on-preview="field.onPreview"
              :on-remove="field.onRemove"
              :on-success="(response, file, fileList) => handleUploadSuccess(field.prop, response, file, fileList)"
              :on-error="(error, file, fileList) => handleUploadError(field.prop, error, file, fileList)"
              :on-progress="field.onProgress"
              :on-change="(file, fileList) => handleUploadChange(field.prop, file, fileList)"
              :before-upload="field.beforeUpload"
              :before-remove="field.beforeRemove"
              :list-type="field.listType"
              :auto-upload="field.autoUpload !== false"
              :file-list="formData[field.prop] || []"
              :http-request="field.httpRequest"
              :disabled="field.disabled || disabled"
              :limit="field.limit"
              :on-exceed="field.onExceed"
            >
              <template v-if="field.drag">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
              </template>
              <template v-else>
                <el-button type="primary">点击上传</el-button>
              </template>
            </el-upload>
          </template>
          
          <!-- 字段描述 -->
          <div
            v-if="field.description"
            class="field-description"
          >
            {{ field.description }}
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    
    <!-- 表单操作按钮 -->
    <el-row v-if="showActions">
      <el-col :span="24">
        <el-form-item class="form-actions">
          <slot name="actions">
            <el-button
              v-if="showSubmit"
              type="primary"
              :loading="submitLoading"
              @click="handleSubmit"
            >
              {{ submitText }}
            </el-button>
            
            <el-button
              v-if="showReset"
              @click="handleReset"
            >
              {{ resetText }}
            </el-button>
            
            <el-button
              v-if="showCancel"
              @click="handleCancel"
            >
              {{ cancelText }}
            </el-button>
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
 </template>

<script lang="ts" setup>
import { ref, computed, watch, reactive, nextTick } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElButton,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCascader,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElSlider,
  ElRate,
  ElColorPicker,
  ElUpload,
  ElIcon,
  ElMessage
} from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormField } from '@/types/global'

// 组件属性定义
interface SmartFormProps {
  // 表单数据
  modelValue?: Record<string, any>
  fields: FormField[]
  
  // 表单配置
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  validateOnRuleChange?: boolean
  hideRequiredAsterisk?: boolean
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  
  // 布局配置
  gutter?: number
  defaultSpan?: number
  
  // 操作按钮
  showActions?: boolean
  showSubmit?: boolean
  showReset?: boolean
  showCancel?: boolean
  submitText?: string
  resetText?: string
  cancelText?: string
  submitLoading?: boolean
  
  // 表单验证
  rules?: Record<string, any[]>
  
  // 其他配置
  readonly?: boolean
  inline?: boolean
}

// 组件事件定义
interface SmartFormEmits {
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', value: Record<string, any>): void
  (e: 'reset'): void
  (e: 'cancel'): void
  (e: 'validate', prop: string, isValid: boolean, message: string): void
  (e: 'fieldChange', prop: string, value: any): void
  (e: 'fieldBlur', prop: string, value: any): void
  (e: 'fieldFocus', prop: string, value: any): void
}

const props = withDefaults(defineProps<SmartFormProps>(), {
  modelValue: () => ({}),
  labelWidth: '100px',
  labelPosition: 'right',
  size: 'default',
  disabled: false,
  validateOnRuleChange: true,
  hideRequiredAsterisk: false,
  showMessage: true,
  inlineMessage: false,
  statusIcon: false,
  gutter: 20,
  defaultSpan: 24,
  showActions: true,
  showSubmit: true,
  showReset: true,
  showCancel: false,
  submitText: '提交',
  resetText: '重置',
  cancelText: '取消',
  submitLoading: false,
  rules: () => ({}),
  readonly: false,
  inline: false
})

const emit = defineEmits<SmartFormEmits>()

// 表单引用
const formRef = ref<InstanceType<typeof ElForm>>()

// 响应式数据
const formData = ref<Record<string, any>>({})
const fieldErrors = ref<Record<string, string>>({})

// 计算属性
const displayFields = computed(() => {
  return props.fields.filter(field => !field.hidden)
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = { ...props.rules }
  
  // 从字段配置中提取验证规则
  props.fields.forEach(field => {
    if (field.rules && field.rules.length > 0) {
      rules[field.prop] = field.rules
    } else if (field.required) {
      rules[field.prop] = [
        {
          required: true,
          message: `请输入${field.label}`,
          trigger: getValidateTrigger(field.type)
        }
      ]
    }
  })
  
  return rules
})

// 方法定义
const getValidateTrigger = (type: string): string | string[] => {
  const triggerMap: Record<string, string | string[]> = {
    input: 'blur',
    textarea: 'blur',
    number: 'blur',
    select: 'change',
    cascader: 'change',
    date: 'change',
    datetime: 'change',
    time: 'change',
    switch: 'change',
    radio: 'change',
    checkbox: 'change',
    slider: 'change',
    rate: 'change',
    color: 'change',
    upload: 'change'
  }
  return triggerMap[type] || 'blur'
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (valid) {
      emit('submit', formData.value)
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}

const handleCancel = () => {
  emit('cancel')
}

const handleValidate = (prop: string, isValid: boolean, message: string) => {
  if (!isValid) {
    fieldErrors.value[prop] = message
  } else {
    delete fieldErrors.value[prop]
  }
  emit('validate', prop, isValid, message)
}

const handleFieldChange = (prop: string, value: any) => {
  formData.value[prop] = value
  emit('update:modelValue', formData.value)
  emit('fieldChange', prop, value)
}

const handleFieldBlur = (prop: string, event: any) => {
  emit('fieldBlur', prop, event.target?.value || event)
}

const handleFieldFocus = (prop: string, event: any) => {
  emit('fieldFocus', prop, event.target?.value || event)
}

// 特殊组件事件处理
const handleSelectVisibleChange = (prop: string, visible: boolean) => {
  // 选择器显示/隐藏事件
}

const handleSelectRemoveTag = (prop: string, tag: any) => {
  // 多选标签移除事件
}

const handleSelectClear = (prop: string) => {
  // 选择器清空事件
}

const handleCascaderExpandChange = (prop: string, activeNames: any[]) => {
  // 级联选择器展开事件
}

const handleDateCalendarChange = (prop: string, date: any) => {
  // 日期选择器日历变化事件
}

const handleDatePanelChange = (prop: string, date: any, mode: string) => {
  // 日期选择器面板变化事件
}

const handleSliderInput = (prop: string, value: any) => {
  // 滑块输入事件
}

const handleColorActiveChange = (prop: string, color: string) => {
  // 颜色选择器激活变化事件
}

const handleUploadSuccess = (prop: string, response: any, file: any, fileList: any[]) => {
  formData.value[prop] = fileList
  emit('update:modelValue', formData.value)
}

const handleUploadError = (prop: string, error: any, file: any, fileList: any[]) => {
  ElMessage.error('文件上传失败')
}

const handleUploadChange = (prop: string, file: any, fileList: any[]) => {
  formData.value[prop] = fileList
  emit('update:modelValue', formData.value)
}

// 监听数据变化
watch(
  () => props.modelValue,
  (newValue) => {
    formData.value = { ...newValue }
  },
  { immediate: true, deep: true }
)

// 暴露方法
defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (props: string | string[]) => formRef.value?.validateField(props),
  resetFields: () => formRef.value?.resetFields(),
  scrollToField: (prop: string) => formRef.value?.scrollToField(prop),
  clearValidate: (props?: string | string[]) => formRef.value?.clearValidate(props)
})
</script>

<style lang="scss" scoped>
.field-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
  
  .el-button {
    margin: 0 8px;
  }
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-upload) {
  width: 100%;
}

:deep(.el-upload-dragger) {
   width: 100%;
 }
 </style>
 ```

### 3. 综合实践示例

#### 3.1 企业级用户管理系统

```vue
<!-- src/views/UserManagement.vue -->
<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            新增用户
          </el-button>
        </div>
      </template>
      
      <!-- 智能表格 -->
      <SmartTable
        ref="tableRef"
        :columns="tableColumns"
        :data="tableData"
        :loading="tableLoading"
        :total="total"
        :api="tableApi"
        :permissions="{
          add: 'user:add',
          edit: 'user:edit',
          delete: 'user:delete',
          export: 'user:export'
        }"
        :more-actions="moreActions"
        @refresh="loadTableData"
        @add="handleAdd"
        @edit="handleEdit"
        @delete="handleDelete"
        @batch-delete="handleBatchDelete"
        @export="handleExport"
        @search="handleSearch"
        @filter="handleFilter"
        @page-change="handlePageChange"
        @more-action="handleMoreAction"
      >
        <!-- 自定义状态列 -->
        <template #status="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
        
        <!-- 自定义头像列 -->
        <template #avatar="{ row }">
          <el-avatar
            :size="32"
            :src="row.avatar"
            :alt="row.nickname"
          >
            {{ row.nickname?.charAt(0) }}
          </el-avatar>
        </template>
        
        <!-- 自定义角色列 -->
        <template #roles="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role.id"
            size="small"
            style="margin-right: 4px;"
          >
            {{ role.name }}
          </el-tag>
        </template>
      </SmartTable>
    </el-card>
    
    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="showFormDialog"
      :title="formMode === 'add' ? '新增用户' : '编辑用户'"
      width="800px"
      :close-on-click-modal="false"
    >
      <SmartForm
        ref="formRef"
        v-model="formData"
        :fields="formFields"
        :submit-loading="formLoading"
        @submit="handleFormSubmit"
        @cancel="showFormDialog = false"
      />
    </el-dialog>
    
    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      title="用户详情"
      width="600px"
    >
      <el-descriptions
        v-if="currentUser"
        :column="2"
        border
      >
        <el-descriptions-item label="用户名">
          {{ currentUser.username }}
        </el-descriptions-item>
        <el-descriptions-item label="昵称">
          {{ currentUser.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.email }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentUser.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ currentUser.profile?.department }}
        </el-descriptions-item>
        <el-descriptions-item label="职位">
          {{ currentUser.profile?.position }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentUser.status)">
            {{ getStatusText(currentUser.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(currentUser.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="角色" :span="2">
          <el-tag
            v-for="role in currentUser.roles"
            :key="role.id"
            style="margin-right: 8px;"
          >
            {{ role.name }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import {
  ElCard,
  ElButton,
  ElDialog,
  ElTag,
  ElAvatar,
  ElDescriptions,
  ElDescriptionsItem,
  ElMessage,
  ElMessageBox
} from 'element-plus'
import SmartTable from '@/components/SmartTable/index.vue'
import SmartForm from '@/components/SmartForm/index.vue'
import { userApi } from '@/api/user'
import { roleApi } from '@/api/role'
import { departmentApi } from '@/api/department'
import type { UserInfo, TableColumn, FormField } from '@/types/global'
import { formatDate } from '@/utils/date'

// 响应式数据
const tableRef = ref()
const formRef = ref()
const tableData = ref<UserInfo[]>([])
const tableLoading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const searchParams = ref({})

const showFormDialog = ref(false)
const showDetailDialog = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const formData = ref<Partial<UserInfo>>({})
const formLoading = ref(false)
const currentUser = ref<UserInfo | null>(null)

const roleOptions = ref([])
const departmentOptions = ref([])

// 表格配置
const tableColumns: TableColumn[] = [
  {
    prop: 'avatar',
    label: '头像',
    width: 80,
    align: 'center'
  },
  {
    prop: 'username',
    label: '用户名',
    width: 120,
    sortable: true,
    searchable: true
  },
  {
    prop: 'nickname',
    label: '昵称',
    width: 120,
    searchable: true
  },
  {
    prop: 'email',
    label: '邮箱',
    width: 180,
    searchable: true
  },
  {
    prop: 'phone',
    label: '手机号',
    width: 130
  },
  {
    prop: 'roles',
    label: '角色',
    width: 150
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    sortable: true,
    filterable: true,
    filters: [
      { text: '正常', value: 'active' },
      { text: '禁用', value: 'disabled' },
      { text: '锁定', value: 'locked' }
    ]
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 160,
    sortable: true,
    formatter: (row) => formatDate(row.createdAt)
  }
]

// 表单配置
const formFields = computed<FormField[]>(() => [
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    required: true,
    span: 12,
    placeholder: '请输入用户名',
    rules: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
    ]
  },
  {
    prop: 'nickname',
    label: '昵称',
    type: 'input',
    required: true,
    span: 12,
    placeholder: '请输入昵称'
  },
  {
    prop: 'email',
    label: '邮箱',
    type: 'input',
    required: true,
    span: 12,
    placeholder: '请输入邮箱地址',
    rules: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  },
  {
    prop: 'phone',
    label: '手机号',
    type: 'input',
    span: 12,
    placeholder: '请输入手机号',
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ]
  },
  {
    prop: 'password',
    label: '密码',
    type: 'input',
    required: formMode.value === 'add',
    span: 12,
    placeholder: formMode.value === 'add' ? '请输入密码' : '留空则不修改密码',
    showPassword: true,
    rules: formMode.value === 'add' ? [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ] : []
  },
  {
    prop: 'confirmPassword',
    label: '确认密码',
    type: 'input',
    required: formMode.value === 'add',
    span: 12,
    placeholder: '请再次输入密码',
    showPassword: true,
    rules: formMode.value === 'add' ? [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: any) => {
          if (value !== formData.value.password) {
            callback(new Error('两次输入密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ] : []
  },
  {
    prop: 'roleIds',
    label: '角色',
    type: 'select',
    required: true,
    span: 12,
    multiple: true,
    placeholder: '请选择角色',
    options: roleOptions.value
  },
  {
    prop: 'departmentId',
    label: '部门',
    type: 'select',
    span: 12,
    placeholder: '请选择部门',
    options: departmentOptions.value
  },
  {
    prop: 'position',
    label: '职位',
    type: 'input',
    span: 12,
    placeholder: '请输入职位'
  },
  {
    prop: 'status',
    label: '状态',
    type: 'radio',
    required: true,
    span: 12,
    options: [
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'disabled' }
    ]
  },
  {
    prop: 'avatar',
    label: '头像',
    type: 'upload',
    span: 24,
    action: '/api/upload/avatar',
    listType: 'picture-card',
    limit: 1,
    accept: 'image/*'
  }
])

// 更多操作配置
const moreActions = [
  {
    command: 'detail',
    label: '查看详情',
    icon: 'View'
  },
  {
    command: 'resetPassword',
    label: '重置密码',
    icon: 'Key'
  },
  {
    command: 'lock',
    label: '锁定用户',
    icon: 'Lock',
    disabled: (row: UserInfo) => row.status === 'locked'
  },
  {
    command: 'unlock',
    label: '解锁用户',
    icon: 'Unlock',
    disabled: (row: UserInfo) => row.status !== 'locked'
  }
]

// API 配置
const tableApi = {
  list: userApi.getList,
  delete: userApi.delete,
  batchDelete: userApi.batchDelete,
  export: userApi.export
}

// 方法定义
const loadTableData = async () => {
  tableLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    }
    const result = await userApi.getList(params)
    tableData.value = result.list
    total.value = result.total
  } catch (error) {
    ElMessage.error('加载用户数据失败')
  } finally {
    tableLoading.value = false
  }
}

const loadOptions = async () => {
  try {
    const [roles, departments] = await Promise.all([
      roleApi.getAll(),
      departmentApi.getAll()
    ])
    
    roleOptions.value = roles.map((role: any) => ({
      label: role.name,
      value: role.id
    }))
    
    departmentOptions.value = departments.map((dept: any) => ({
      label: dept.name,
      value: dept.id
    }))
  } catch (error) {
    ElMessage.error('加载选项数据失败')
  }
}

const handleAdd = () => {
  formMode.value = 'add'
  formData.value = { status: 'active' }
  showFormDialog.value = true
}

const handleEdit = (row: UserInfo) => {
  formMode.value = 'edit'
  formData.value = {
    ...row,
    roleIds: row.roles?.map(role => role.id) || [],
    departmentId: row.profile?.departmentId
  }
  showFormDialog.value = true
}

const handleDelete = async (row: UserInfo) => {
  try {
    await userApi.delete(row.id)
    ElMessage.success('删除成功')
    await loadTableData()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async (rows: UserInfo[]) => {
  try {
    const ids = rows.map(row => row.id)
    await userApi.batchDelete(ids)
    ElMessage.success('批量删除成功')
    await loadTableData()
  } catch (error) {
    ElMessage.error('批量删除失败')
  }
}

const handleExport = async (params: any) => {
  try {
    await userApi.export(params)
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

const handleSearch = (keyword: string) => {
  searchParams.value = { ...searchParams.value, keyword }
  currentPage.value = 1
  loadTableData()
}

const handleFilter = (filters: any) => {
  searchParams.value = { ...searchParams.value, ...filters }
  currentPage.value = 1
  loadTableData()
}

const handlePageChange = (page: number, size: number) => {
  currentPage.value = page
  pageSize.value = size
  loadTableData()
}

const handleMoreAction = async (command: string, row: UserInfo) => {
  switch (command) {
    case 'detail':
      currentUser.value = row
      showDetailDialog.value = true
      break
      
    case 'resetPassword':
      try {
        await ElMessageBox.confirm(
          '确定要重置该用户的密码吗？',
          '提示',
          { type: 'warning' }
        )
        await userApi.resetPassword(row.id)
        ElMessage.success('密码重置成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('密码重置失败')
        }
      }
      break
      
    case 'lock':
      try {
        await userApi.updateStatus(row.id, 'locked')
        ElMessage.success('用户已锁定')
        await loadTableData()
      } catch (error) {
        ElMessage.error('锁定失败')
      }
      break
      
    case 'unlock':
      try {
        await userApi.updateStatus(row.id, 'active')
        ElMessage.success('用户已解锁')
        await loadTableData()
      } catch (error) {
        ElMessage.error('解锁失败')
      }
      break
  }
}

const handleFormSubmit = async (data: any) => {
  formLoading.value = true
  try {
    if (formMode.value === 'add') {
      await userApi.create(data)
      ElMessage.success('用户创建成功')
    } else {
      await userApi.update(data.id, data)
      ElMessage.success('用户更新成功')
    }
    
    showFormDialog.value = false
    await loadTableData()
  } catch (error) {
    ElMessage.error(formMode.value === 'add' ? '创建失败' : '更新失败')
  } finally {
    formLoading.value = false
  }
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    active: 'success',
    disabled: 'warning',
    locked: 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '正常',
    disabled: '禁用',
    locked: '锁定'
  }
  return textMap[status] || '未知'
}

// 生命周期
onMounted(() => {
  loadTableData()
  loadOptions()
})
</script>

<style lang="scss" scoped>
.user-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```

## 4. 实践练习

1. **完善智能表格组件**：
   - 添加表格数据导入功能
   - 实现表格列的拖拽排序
   - 添加表格数据的实时筛选

2. **扩展动态表单组件**：
   - 支持表单字段的动态显示/隐藏
   - 实现表单数据的自动保存
   - 添加表单步骤向导功能

3. **构建完整的业务模块**：
   - 基于智能组件构建商品管理模块
   - 实现订单管理系统
   - 开发权限管理功能

## 5. 学习资源

- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Vue 3 Composition API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vite 构建工具](https://cn.vitejs.dev/)

## 6. 作业

- 基于提供的智能组件，构建一个完整的后台管理系统
- 实现用户、角色、权限的完整 CRUD 操作
- 添加数据统计和图表展示功能
- 优化组件的性能和用户体验

## 总结

通过第51天的学习，我们综合运用了 Element Plus 的各种高级特性，构建了企业级的智能组件和完整的业务系统。这些实践帮助我们：

1. **掌握了组件封装技巧**：学会了如何设计可复用、可配置的高级组件
2. **理解了架构设计原则**：掌握了企业级应用的架构设计和代码组织
3. **提升了开发效率**：通过智能组件大大提高了开发效率和代码质量
4. **增强了系统可维护性**：规范的代码结构和组件设计让系统更易维护

这些技能将为我们后续的 Element Plus 深度应用和企业级项目开发奠定坚实的基础。