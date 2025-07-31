# Project Structure and Standards for Element Plus Applications

## Overview

This guide establishes comprehensive project structure and coding standards for Element Plus applications, ensuring maintainability, scalability, and team collaboration efficiency.

## Recommended Project Structure

### Basic Project Layout

```
element-plus-app/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
├── src/                        # Source code
│   ├── assets/                 # Static resources
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/             # Reusable components
│   │   ├── common/             # Common components
│   │   ├── business/           # Business components
│   │   └── layout/             # Layout components
│   ├── composables/            # Vue 3 composables
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useTheme.ts
│   ├── directives/             # Custom directives
│   │   ├── loading.ts
│   │   └── permission.ts
│   ├── hooks/                  # Custom hooks (legacy)
│   ├── layouts/                # Page layouts
│   │   ├── DefaultLayout.vue
│   │   ├── AdminLayout.vue
│   │   └── AuthLayout.vue
│   ├── pages/                  # Page components
│   │   ├── home/
│   │   ├── dashboard/
│   │   └── admin/
│   ├── router/                 # Routing configuration
│   │   ├── index.ts
│   │   ├── guards.ts
│   │   └── routes/
│   ├── stores/                 # State management
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── app.ts
│   ├── styles/                 # Global styles
│   │   ├── index.scss
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── element/
│   ├── types/                  # TypeScript definitions
│   │   ├── api.ts
│   │   ├── global.ts
│   │   └── components.ts
│   ├── utils/                  # Utility functions
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   ├── App.vue                 # Root component
│   └── main.ts                 # Application entry
├── tests/                      # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                       # Documentation
│   ├── api/
│   ├── components/
│   └── deployment/
├── scripts/                    # Build scripts
│   ├── build.ts
│   ├── deploy.ts
│   └── generate-types.ts
├── .env.example               # Environment template
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

### Component Organization

```
src/components/
├── common/                     # Reusable UI components
│   ├── Button/
│   │   ├── index.vue
│   │   ├── types.ts
│   │   └── Button.stories.ts
│   ├── Form/
│   │   ├── index.vue
│   │   ├── FormItem.vue
│   │   ├── types.ts
│   │   └── hooks/
│   └── Table/
│       ├── index.vue
│       ├── TableColumn.vue
│       ├── TablePagination.vue
│       └── composables/
├── business/                   # Domain-specific components
│   ├── UserProfile/
│   ├── ProductCard/
│   └── OrderSummary/
└── layout/                     # Layout components
    ├── Header/
    ├── Sidebar/
    ├── Footer/
    └── Breadcrumb/
```

## Coding Standards

### TypeScript Standards

```typescript
// types/api.ts - API type definitions
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// User-related types
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

// Component prop types
export interface TableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => any
}

export interface FormField {
  name: string
  label: string
  type: 'input' | 'select' | 'textarea' | 'date' | 'number'
  required?: boolean
  rules?: any[]
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  disabled?: boolean
}
```

### Component Standards

```vue
<!-- components/common/DataTable/index.vue -->
<template>
  <div class="data-table">
    <!-- Search and filters -->
    <div class="table-header" v-if="showHeader">
      <div class="table-title">
        <h3>{{ title }}</h3>
        <p v-if="description" class="table-description">{{ description }}</p>
      </div>
      
      <div class="table-actions">
        <el-input
          v-if="searchable"
          v-model="searchQuery"
          :placeholder="searchPlaceholder"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
        
        <el-button
          v-if="refreshable"
          :icon="Refresh"
          @click="handleRefresh"
          :loading="loading"
        >
          Refresh
        </el-button>
        
        <slot name="actions" />
      </div>
    </div>
    
    <!-- Table -->
    <el-table
      ref="tableRef"
      :data="tableData"
      :loading="loading"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :empty-text="emptyText"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      v-bind="$attrs"
    >
      <!-- Selection column -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        :selectable="selectableFunction"
      />
      
      <!-- Index column -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="#"
        width="60"
        :index="getIndex"
      />
      
      <!-- Data columns -->
      <el-table-column
        v-for="column in normalizedColumns"
        :key="column.key"
        :prop="column.dataIndex"
        :label="column.title"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.showOverflowTooltip"
      >
        <template #default="{ row, column: tableColumn, $index }">
          <slot
            :name="column.key"
            :row="row"
            :column="tableColumn"
            :index="$index"
            :value="row[column.dataIndex]"
          >
            <span v-if="column.render">
              <component
                :is="column.render"
                :value="row[column.dataIndex]"
                :row="row"
                :index="$index"
              />
            </span>
            <span v-else>{{ row[column.dataIndex] }}</span>
          </slot>
        </template>
        
        <template #header v-if="column.headerSlot">
          <slot :name="`${column.key}-header`" :column="column" />
        </template>
      </el-table-column>
      
      <!-- Actions column -->
      <el-table-column
        v-if="$slots.actions"
        label="Actions"
        :width="actionsWidth"
        align="center"
        fixed="right"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Pagination -->
    <div class="table-footer" v-if="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElInput, ElButton, ElPagination } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import type { TableColumn } from '@/types/components'

// Props definition with proper typing
interface Props {
  // Data
  data?: any[]
  columns: TableColumn[]
  loading?: boolean
  
  // Table appearance
  title?: string
  description?: string
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  emptyText?: string
  
  // Features
  searchable?: boolean
  searchPlaceholder?: string
  refreshable?: boolean
  selectable?: boolean
  showIndex?: boolean
  showHeader?: boolean
  
  // Pagination
  pagination?: boolean
  total?: number
  pageSize?: number
  pageSizes?: number[]
  paginationLayout?: string
  
  // Actions
  actionsWidth?: number
  selectableFunction?: (row: any, index: number) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  loading: false,
  stripe: true,
  border: true,
  size: 'default',
  emptyText: 'No data',
  searchable: true,
  searchPlaceholder: 'Search...',
  refreshable: true,
  selectable: false,
  showIndex: false,
  showHeader: true,
  pagination: true,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  actionsWidth: 150
})

// Emits definition
interface Emits {
  search: [query: string]
  refresh: []
  selectionChange: [selection: any[]]
  sortChange: [sort: { prop: string; order: string }]
  filterChange: [filters: Record<string, any>]
  pageChange: [page: number]
  pageSizeChange: [size: number]
}

const emit = defineEmits<Emits>()

// Reactive state
const tableRef = ref<InstanceType<typeof ElTable>>()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(props.pageSize)
const selectedRows = ref<any[]>([])

// Computed properties
const tableData = computed(() => {
  if (!props.data) return []
  
  let filteredData = [...props.data]
  
  // Apply search filter
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    filteredData = filteredData.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(query)
      )
    })
  }
  
  return filteredData
})

const normalizedColumns = computed(() => {
  return props.columns.map(column => ({
    ...column,
    key: column.key || column.dataIndex,
    align: column.align || 'left',
    showOverflowTooltip: column.showOverflowTooltip ?? true
  }))
})

const total = computed(() => props.total || tableData.value.length)

// Event handlers
const handleSearch = (query: string) => {
  emit('search', query)
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selectionChange', selection)
}

const handleSortChange = (sort: { prop: string; order: string }) => {
  emit('sortChange', sort)
}

const handleFilterChange = (filters: Record<string, any>) => {
  emit('filterChange', filters)
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  emit('pageChange', page)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('pageSizeChange', size)
}

const getIndex = (index: number) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

// Public methods
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

const toggleRowSelection = (row: any, selected?: boolean) => {
  tableRef.value?.toggleRowSelection(row, selected)
}

const setCurrentRow = (row: any) => {
  tableRef.value?.setCurrentRow(row)
}

// Expose public methods
defineExpose({
  clearSelection,
  toggleRowSelection,
  setCurrentRow,
  selectedRows: readonly(selectedRows)
})

// Watchers
watch(() => props.pageSize, (newSize) => {
  pageSize.value = newSize
})

// Lifecycle
onMounted(() => {
  // Initialize component
})
</script>

<style scoped lang="scss">
.data-table {
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .table-title {
      h3 {
        margin: 0 0 4px 0;
        color: var(--el-text-color-primary);
      }
      
      .table-description {
        margin: 0;
        color: var(--el-text-color-secondary);
        font-size: 14px;
      }
    }
    
    .table-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .search-input {
        width: 240px;
      }
    }
  }
  
  .table-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .data-table {
    .table-header {
      flex-direction: column;
      gap: 12px;
      
      .table-actions {
        width: 100%;
        justify-content: space-between;
        
        .search-input {
          flex: 1;
          max-width: none;
        }
      }
    }
  }
}
</style>
```

### Composables Standards

```typescript
// composables/useApi.ts
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { request } from '@/utils/request'
import type { ApiResponse, PaginationParams, PaginationResponse } from '@/types/api'

export interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  transform?: (data: any) => any
}

export interface UseApiReturn<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: (...args: any[]) => Promise<T>
  refresh: () => Promise<T>
  reset: () => void
}

/**
 * Composable for API requests with loading states and error handling
 */
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    transform
  } = options
  
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastArgs = ref<any[]>([])
  
  const execute = async (...args: any[]): Promise<T> => {
    try {
      loading.value = true
      error.value = null
      lastArgs.value = args
      
      const response = await apiFunction(...args)
      
      if (response.code === 200) {
        const result = transform ? transform(response.data) : response.data
        data.value = result
        onSuccess?.(result)
        return result
      } else {
        throw new Error(response.message || 'API request failed')
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred'
      error.value = errorMessage
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const refresh = () => execute(...lastArgs.value)
  
  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
    lastArgs.value = []
  }
  
  if (immediate) {
    execute()
  }
  
  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset
  }
}

/**
 * Composable for paginated API requests
 */
export function usePaginatedApi<T = any>(
  apiFunction: (params: PaginationParams) => Promise<ApiResponse<PaginationResponse<T>>>,
  initialParams: Partial<PaginationParams> = {}
) {
  const params = ref<PaginationParams>({
    page: 1,
    pageSize: 20,
    ...initialParams
  })
  
  const { data, loading, error, execute } = useApi(apiFunction)
  
  const items = computed(() => data.value?.items || [])
  const total = computed(() => data.value?.total || 0)
  const totalPages = computed(() => data.value?.totalPages || 0)
  
  const loadPage = (page: number) => {
    params.value.page = page
    return execute(params.value)
  }
  
  const changePageSize = (pageSize: number) => {
    params.value.pageSize = pageSize
    params.value.page = 1
    return execute(params.value)
  }
  
  const sort = (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
    params.value.sortBy = sortBy
    params.value.sortOrder = sortOrder
    params.value.page = 1
    return execute(params.value)
  }
  
  const refresh = () => execute(params.value)
  
  return {
    // Data
    items,
    total,
    totalPages,
    params: readonly(params),
    
    // States
    loading,
    error,
    
    // Methods
    loadPage,
    changePageSize,
    sort,
    refresh
  }
}

/**
 * Composable for form submission with API integration
 */
export function useFormApi<T = any, R = any>(
  submitFunction: (data: T) => Promise<ApiResponse<R>>,
  options: UseApiOptions = {}
) {
  const { data, loading, error, execute } = useApi(submitFunction, options)
  
  const submit = async (formData: T): Promise<R> => {
    return execute(formData)
  }
  
  return {
    data,
    loading,
    error,
    submit
  }
}
```

### Store Standards (Pinia)

```typescript
// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import { storage } from '@/utils/storage'
import type { User, LoginRequest } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(storage.get('token'))
  const refreshToken = ref<string | null>(storage.get('refreshToken'))
  const loading = ref(false)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRoles = computed(() => user.value?.roles || [])
  const userPermissions = computed(() => user.value?.permissions || [])
  
  // Actions
  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true
      
      const response = await authApi.login(credentials)
      
      if (response.code === 200) {
        const { user: userData, token: accessToken, refreshToken: newRefreshToken } = response.data
        
        // Update state
        user.value = userData
        token.value = accessToken
        refreshToken.value = newRefreshToken
        
        // Persist to storage
        storage.set('token', accessToken)
        storage.set('refreshToken', newRefreshToken)
        storage.set('user', userData)
        
        ElMessage.success('Login successful')
        return userData
      } else {
        throw new Error(response.message)
      }
    } catch (error: any) {
      ElMessage.error(error.message || 'Login failed')
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear state
      user.value = null
      token.value = null
      refreshToken.value = null
      
      // Clear storage
      storage.remove('token')
      storage.remove('refreshToken')
      storage.remove('user')
      
      // Redirect to login
      const router = useRouter()
      router.push('/login')
    }
  }
  
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('No refresh token available')
      }
      
      const response = await authApi.refreshToken(refreshToken.value)
      
      if (response.code === 200) {
        const { token: newToken, refreshToken: newRefreshToken } = response.data
        
        token.value = newToken
        refreshToken.value = newRefreshToken
        
        storage.set('token', newToken)
        storage.set('refreshToken', newRefreshToken)
        
        return newToken
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      await logout()
      throw error
    }
  }
  
  const fetchUserProfile = async () => {
    try {
      const response = await authApi.getProfile()
      
      if (response.code === 200) {
        user.value = response.data
        storage.set('user', response.data)
        return response.data
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }
  
  const hasRole = (role: string) => {
    return userRoles.value.includes(role)
  }
  
  const hasPermission = (permission: string) => {
    return userPermissions.value.includes(permission)
  }
  
  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role))
  }
  
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => hasPermission(permission))
  }
  
  // Initialize from storage
  const initializeAuth = () => {
    const storedUser = storage.get('user')
    const storedToken = storage.get('token')
    
    if (storedUser && storedToken) {
      user.value = storedUser
      token.value = storedToken
    }
  }
  
  return {
    // State
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    
    // Getters
    isAuthenticated,
    userRoles,
    userPermissions,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    fetchUserProfile,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    initializeAuth
  }
})
```

## File Naming Conventions

### Component Files
- **PascalCase** for component names: `UserProfile.vue`, `DataTable.vue`
- **kebab-case** for file directories: `user-profile/`, `data-table/`
- **Index files** for main exports: `index.vue`, `index.ts`

### TypeScript Files
- **camelCase** for utilities: `requestHelper.ts`, `dateUtils.ts`
- **PascalCase** for classes: `ApiClient.ts`, `EventBus.ts`
- **kebab-case** for composables: `use-auth.ts`, `use-table.ts`

### Style Files
- **kebab-case**: `global-styles.scss`, `element-theme.scss`
- **Underscore prefix** for partials: `_variables.scss`, `_mixins.scss`

## Code Quality Standards

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    // Vue-specific rules
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'error',
    'vue/no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    
    // General rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always'
      }
    ]
  }
}
```

### Git Commit Standards

```bash
# Commit message format
<type>(<scope>): <subject>

<body>

<footer>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
perf:     Performance improvements
test:     Adding or updating tests
chore:    Build process or auxiliary tool changes

# Examples
feat(auth): add login functionality
fix(table): resolve pagination issue
docs(api): update authentication guide
style(components): format code according to prettier
refactor(store): simplify user state management
perf(table): optimize large dataset rendering
test(auth): add unit tests for login flow
chore(deps): update element-plus to v2.4.0
```

This comprehensive guide establishes clear standards for Element Plus project structure, coding practices, and quality assurance, ensuring consistent and maintainable codebases across development teams.