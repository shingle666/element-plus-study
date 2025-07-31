# Pinia State Management with Element Plus

## Overview

This guide demonstrates how to effectively integrate Pinia state management with Element Plus components, covering advanced patterns, best practices, and real-world implementation scenarios.

## Basic Pinia Setup with Element Plus

### Store Configuration

```typescript
// src/stores/index.ts
import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

// Pinia plugins
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createPiniaLogger } from 'pinia-plugin-logger'

const pinia = createPinia()

// Add persistence plugin
pinia.use(createPersistedState({
  storage: localStorage,
  serializer: {
    serialize: JSON.stringify,
    deserialize: JSON.parse
  }
}))

// Add logger plugin for development
if (import.meta.env.DEV) {
  pinia.use(createPiniaLogger({
    disabled: false,
    logErrors: true
  }))
}

// Router plugin for navigation in stores
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

export default pinia

// Type augmentation for router
declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}
```

### User Authentication Store

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User, LoginCredentials, AuthResponse } from '@/types/auth'
import { authAPI } from '@/api/auth'
import { useUserStore } from './user'
import { usePermissionStore } from './permission'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const loginAttempts = ref(0)
  const lastLoginTime = ref<Date | null>(null)
  
  // Getters
  const isAuthenticated = computed(() => {
    return !!token.value && !!userStore.currentUser
  })
  
  const isTokenExpired = computed(() => {
    if (!token.value) return true
    
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return Date.now() >= payload.exp * 1000
    } catch {
      return true
    }
  })
  
  const timeUntilExpiry = computed(() => {
    if (!token.value) return 0
    
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      return Math.max(0, payload.exp * 1000 - Date.now())
    } catch {
      return 0
    }
  })
  
  // Store dependencies
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    
    try {
      // Rate limiting check
      if (loginAttempts.value >= 5) {
        throw new Error('Too many login attempts. Please try again later.')
      }
      
      const response: AuthResponse = await authAPI.login(credentials)
      
      // Store tokens
      token.value = response.accessToken
      refreshToken.value = response.refreshToken
      lastLoginTime.value = new Date()
      
      // Update user store
      await userStore.setCurrentUser(response.user)
      
      // Update permissions
      await permissionStore.loadUserPermissions(response.user.id)
      
      // Reset login attempts
      loginAttempts.value = 0
      
      // Setup token refresh timer
      setupTokenRefresh()
      
      ElMessage.success('Login successful!')
      
      return response
    } catch (error: any) {
      loginAttempts.value++
      
      ElMessage.error({
        message: error.message || 'Login failed',
        duration: 5000,
        showClose: true
      })
      
      throw error
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async (showConfirmation = true) => {
    if (showConfirmation) {
      try {
        await ElMessageBox.confirm(
          'Are you sure you want to logout?',
          'Confirm Logout',
          {
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            type: 'warning',
            confirmButtonClass: 'el-button--danger'
          }
        )
      } catch {
        return // User cancelled
      }
    }
    
    isLoading.value = true
    
    try {
      // Call logout API if token exists
      if (token.value) {
        await authAPI.logout(refreshToken.value!)
      }
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      // Clear all auth data
      token.value = null
      refreshToken.value = null
      lastLoginTime.value = null
      loginAttempts.value = 0
      
      // Clear user data
      userStore.$reset()
      permissionStore.$reset()
      
      // Clear token refresh timer
      clearTokenRefresh()
      
      isLoading.value = false
      
      ElMessage.success('Logged out successfully')
      
      // Redirect to login page
      router.push({ name: 'Login' })
    }
  }
  
  const refreshAccessToken = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }
    
    try {
      const response = await authAPI.refreshToken(refreshToken.value)
      
      token.value = response.accessToken
      refreshToken.value = response.refreshToken
      
      // Setup new refresh timer
      setupTokenRefresh()
      
      return response.accessToken
    } catch (error) {
      // Refresh failed, logout user
      await logout(false)
      throw error
    }
  }
  
  const checkAuthStatus = async () => {
    if (!token.value) return false
    
    if (isTokenExpired.value) {
      try {
        await refreshAccessToken()
        return true
      } catch {
        return false
      }
    }
    
    return true
  }
  
  // Token refresh management
  let refreshTimer: NodeJS.Timeout | null = null
  
  const setupTokenRefresh = () => {
    clearTokenRefresh()
    
    if (timeUntilExpiry.value > 0) {
      // Refresh token 5 minutes before expiry
      const refreshTime = Math.max(0, timeUntilExpiry.value - 5 * 60 * 1000)
      
      refreshTimer = setTimeout(async () => {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Auto token refresh failed:', error)
        }
      }, refreshTime)
    }
  }
  
  const clearTokenRefresh = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }
  
  // Initialize auth state
  const initialize = async () => {
    if (token.value && !isTokenExpired.value) {
      try {
        // Verify token with server
        const user = await authAPI.getCurrentUser()
        await userStore.setCurrentUser(user)
        await permissionStore.loadUserPermissions(user.id)
        
        setupTokenRefresh()
        return true
      } catch (error) {
        console.warn('Token verification failed:', error)
        await logout(false)
        return false
      }
    }
    
    return false
  }
  
  return {
    // State
    token,
    refreshToken,
    isLoading,
    loginAttempts,
    lastLoginTime,
    
    // Getters
    isAuthenticated,
    isTokenExpired,
    timeUntilExpiry,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    checkAuthStatus,
    initialize
  }
}, {
  persist: {
    key: 'auth-store',
    paths: ['token', 'refreshToken', 'lastLoginTime'],
    storage: localStorage
  }
})
```

### UI State Management Store

```typescript
// src/stores/ui.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ComponentSize } from 'element-plus'

export type Theme = 'light' | 'dark' | 'auto'
export type Language = 'en' | 'zh' | 'es' | 'fr' | 'de'

export const useUIStore = defineStore('ui', () => {
  // State
  const theme = ref<Theme>('auto')
  const language = ref<Language>('en')
  const componentSize = ref<ComponentSize>('default')
  const sidebarCollapsed = ref(false)
  const loading = ref(false)
  const loadingText = ref('')
  const breadcrumbs = ref<Array<{ title: string; path?: string }>>([])
  
  // Notification settings
  const notificationsEnabled = ref(true)
  const soundEnabled = ref(true)
  const desktopNotifications = ref(false)
  
  // Layout settings
  const headerFixed = ref(true)
  const sidebarFixed = ref(true)
  const showTabs = ref(true)
  const showFooter = ref(true)
  
  // Getters
  const isDarkMode = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })
  
  const currentThemeClass = computed(() => {
    return isDarkMode.value ? 'dark' : 'light'
  })
  
  const isRTL = computed(() => {
    return ['ar', 'he', 'fa'].includes(language.value)
  })
  
  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    updateThemeClass()
  }
  
  const setLanguage = (newLanguage: Language) => {
    language.value = newLanguage
    updateDocumentLanguage()
  }
  
  const setComponentSize = (size: ComponentSize) => {
    componentSize.value = size
  }
  
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }
  
  const showLoading = (text = 'Loading...') => {
    loading.value = true
    loadingText.value = text
  }
  
  const hideLoading = () => {
    loading.value = false
    loadingText.value = ''
  }
  
  const setBreadcrumbs = (crumbs: Array<{ title: string; path?: string }>) => {
    breadcrumbs.value = crumbs
  }
  
  const addBreadcrumb = (crumb: { title: string; path?: string }) => {
    breadcrumbs.value.push(crumb)
  }
  
  const clearBreadcrumbs = () => {
    breadcrumbs.value = []
  }
  
  const updateNotificationSettings = (settings: {
    enabled?: boolean
    sound?: boolean
    desktop?: boolean
  }) => {
    if (settings.enabled !== undefined) {
      notificationsEnabled.value = settings.enabled
    }
    if (settings.sound !== undefined) {
      soundEnabled.value = settings.sound
    }
    if (settings.desktop !== undefined) {
      desktopNotifications.value = settings.desktop
      
      // Request permission for desktop notifications
      if (settings.desktop && 'Notification' in window) {
        Notification.requestPermission()
      }
    }
  }
  
  const updateLayoutSettings = (settings: {
    headerFixed?: boolean
    sidebarFixed?: boolean
    showTabs?: boolean
    showFooter?: boolean
  }) => {
    if (settings.headerFixed !== undefined) {
      headerFixed.value = settings.headerFixed
    }
    if (settings.sidebarFixed !== undefined) {
      sidebarFixed.value = settings.sidebarFixed
    }
    if (settings.showTabs !== undefined) {
      showTabs.value = settings.showTabs
    }
    if (settings.showFooter !== undefined) {
      showFooter.value = settings.showFooter
    }
  }
  
  // Helper functions
  const updateThemeClass = () => {
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    html.classList.add(currentThemeClass.value)
    
    // Update CSS custom properties
    if (isDarkMode.value) {
      html.style.setProperty('--el-color-primary', '#409eff')
      html.style.setProperty('--el-bg-color', '#141414')
      html.style.setProperty('--el-text-color-primary', '#e5eaf3')
    } else {
      html.style.removeProperty('--el-color-primary')
      html.style.removeProperty('--el-bg-color')
      html.style.removeProperty('--el-text-color-primary')
    }
  }
  
  const updateDocumentLanguage = () => {
    document.documentElement.lang = language.value
    document.documentElement.dir = isRTL.value ? 'rtl' : 'ltr'
  }
  
  // Initialize
  const initialize = () => {
    updateThemeClass()
    updateDocumentLanguage()
    
    // Listen for system theme changes
    if (theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateThemeClass)
    }
  }
  
  return {
    // State
    theme,
    language,
    componentSize,
    sidebarCollapsed,
    loading,
    loadingText,
    breadcrumbs,
    notificationsEnabled,
    soundEnabled,
    desktopNotifications,
    headerFixed,
    sidebarFixed,
    showTabs,
    showFooter,
    
    // Getters
    isDarkMode,
    currentThemeClass,
    isRTL,
    
    // Actions
    setTheme,
    setLanguage,
    setComponentSize,
    toggleSidebar,
    setSidebarCollapsed,
    showLoading,
    hideLoading,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    updateNotificationSettings,
    updateLayoutSettings,
    initialize
  }
}, {
  persist: {
    key: 'ui-store',
    paths: [
      'theme',
      'language',
      'componentSize',
      'sidebarCollapsed',
      'notificationsEnabled',
      'soundEnabled',
      'desktopNotifications',
      'headerFixed',
      'sidebarFixed',
      'showTabs',
      'showFooter'
    ]
  }
})
```

### Data Table Store with Element Plus Integration

```typescript
// src/stores/dataTable.ts
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'

export interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  filterable?: boolean
  searchable?: boolean
  type?: 'selection' | 'index' | 'expand'
  formatter?: (row: any, column: TableColumnCtx<any>, cellValue: any) => string
  visible?: boolean
}

export interface TableState {
  data: any[]
  loading: boolean
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: 'ascending' | 'descending' | null
  filters: Record<string, any>
  searchQuery: string
  selectedRows: any[]
  expandedRows: any[]
}

export const useDataTableStore = defineStore('dataTable', () => {
  // State
  const tables = reactive<Record<string, TableState>>({})
  const columns = reactive<Record<string, TableColumn[]>>({})
  
  // Getters
  const getTableState = computed(() => (tableId: string) => {
    return tables[tableId] || createDefaultTableState()
  })
  
  const getTableColumns = computed(() => (tableId: string) => {
    return columns[tableId] || []
  })
  
  const getVisibleColumns = computed(() => (tableId: string) => {
    return (columns[tableId] || []).filter(col => col.visible !== false)
  })
  
  const getSearchableColumns = computed(() => (tableId: string) => {
    return (columns[tableId] || []).filter(col => col.searchable)
  })
  
  const getFilteredData = computed(() => (tableId: string) => {
    const state = tables[tableId]
    if (!state) return []
    
    let filteredData = [...state.data]
    
    // Apply search filter
    if (state.searchQuery) {
      const searchableColumns = getSearchableColumns.value(tableId)
      filteredData = filteredData.filter(row => {
        return searchableColumns.some(col => {
          const value = row[col.prop]
          return value && value.toString().toLowerCase().includes(state.searchQuery.toLowerCase())
        })
      })
    }
    
    // Apply column filters
    Object.entries(state.filters).forEach(([prop, filterValue]) => {
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        filteredData = filteredData.filter(row => {
          const value = row[prop]
          if (Array.isArray(filterValue)) {
            return filterValue.includes(value)
          }
          return value === filterValue
        })
      }
    })
    
    // Apply sorting
    if (state.sortBy && state.sortOrder) {
      filteredData.sort((a, b) => {
        const aVal = a[state.sortBy]
        const bVal = b[state.sortBy]
        
        let result = 0
        if (aVal < bVal) result = -1
        else if (aVal > bVal) result = 1
        
        return state.sortOrder === 'ascending' ? result : -result
      })
    }
    
    return filteredData
  })
  
  const getPaginatedData = computed(() => (tableId: string) => {
    const state = tables[tableId]
    const filteredData = getFilteredData.value(tableId)
    
    if (!state || state.pageSize <= 0) return filteredData
    
    const start = (state.currentPage - 1) * state.pageSize
    const end = start + state.pageSize
    
    return filteredData.slice(start, end)
  })
  
  // Actions
  const initializeTable = (tableId: string, initialColumns: TableColumn[] = []) => {
    if (!tables[tableId]) {
      tables[tableId] = createDefaultTableState()
    }
    
    if (initialColumns.length > 0) {
      columns[tableId] = initialColumns.map(col => ({
        ...col,
        visible: col.visible !== false
      }))
    }
  }
  
  const setTableData = (tableId: string, data: any[], total?: number) => {
    if (!tables[tableId]) {
      initializeTable(tableId)
    }
    
    tables[tableId].data = data
    tables[tableId].total = total || data.length
    tables[tableId].loading = false
  }
  
  const setLoading = (tableId: string, loading: boolean) => {
    if (!tables[tableId]) {
      initializeTable(tableId)
    }
    
    tables[tableId].loading = loading
  }
  
  const updatePagination = (tableId: string, page: number, pageSize?: number) => {
    if (!tables[tableId]) return
    
    tables[tableId].currentPage = page
    if (pageSize) {
      tables[tableId].pageSize = pageSize
    }
  }
  
  const updateSort = (tableId: string, sortBy: string, sortOrder: 'ascending' | 'descending' | null) => {
    if (!tables[tableId]) return
    
    tables[tableId].sortBy = sortBy
    tables[tableId].sortOrder = sortOrder
  }
  
  const updateFilter = (tableId: string, prop: string, value: any) => {
    if (!tables[tableId]) return
    
    tables[tableId].filters[prop] = value
    tables[tableId].currentPage = 1 // Reset to first page when filtering
  }
  
  const updateSearch = (tableId: string, query: string) => {
    if (!tables[tableId]) return
    
    tables[tableId].searchQuery = query
    tables[tableId].currentPage = 1 // Reset to first page when searching
  }
  
  const clearFilters = (tableId: string) => {
    if (!tables[tableId]) return
    
    tables[tableId].filters = {}
    tables[tableId].searchQuery = ''
    tables[tableId].currentPage = 1
  }
  
  const setSelectedRows = (tableId: string, rows: any[]) => {
    if (!tables[tableId]) return
    
    tables[tableId].selectedRows = rows
  }
  
  const toggleRowSelection = (tableId: string, row: any) => {
    if (!tables[tableId]) return
    
    const selectedRows = tables[tableId].selectedRows
    const index = selectedRows.findIndex(r => r.id === row.id)
    
    if (index > -1) {
      selectedRows.splice(index, 1)
    } else {
      selectedRows.push(row)
    }
  }
  
  const clearSelection = (tableId: string) => {
    if (!tables[tableId]) return
    
    tables[tableId].selectedRows = []
  }
  
  const updateColumnVisibility = (tableId: string, prop: string, visible: boolean) => {
    if (!columns[tableId]) return
    
    const column = columns[tableId].find(col => col.prop === prop)
    if (column) {
      column.visible = visible
    }
  }
  
  const reorderColumns = (tableId: string, oldIndex: number, newIndex: number) => {
    if (!columns[tableId]) return
    
    const cols = columns[tableId]
    const [movedColumn] = cols.splice(oldIndex, 1)
    cols.splice(newIndex, 0, movedColumn)
  }
  
  const exportTableData = (tableId: string, format: 'csv' | 'excel' = 'csv') => {
    const data = getFilteredData.value(tableId)
    const visibleColumns = getVisibleColumns.value(tableId)
    
    if (data.length === 0) {
      ElMessage.warning('No data to export')
      return
    }
    
    try {
      if (format === 'csv') {
        exportToCSV(data, visibleColumns, tableId)
      } else {
        exportToExcel(data, visibleColumns, tableId)
      }
      
      ElMessage.success(`Data exported successfully as ${format.toUpperCase()}`)
    } catch (error) {
      ElMessage.error('Export failed')
      console.error('Export error:', error)
    }
  }
  
  const resetTable = (tableId: string) => {
    if (tables[tableId]) {
      tables[tableId] = createDefaultTableState()
    }
  }
  
  // Helper functions
  function createDefaultTableState(): TableState {
    return {
      data: [],
      loading: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
      sortBy: '',
      sortOrder: null,
      filters: {},
      searchQuery: '',
      selectedRows: [],
      expandedRows: []
    }
  }
  
  function exportToCSV(data: any[], columns: TableColumn[], filename: string) {
    const headers = columns.map(col => col.label).join(',')
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.prop]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
    
    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }
  
  function exportToExcel(data: any[], columns: TableColumn[], filename: string) {
    // This would require a library like xlsx
    console.log('Excel export not implemented yet')
  }
  
  return {
    // State
    tables,
    columns,
    
    // Getters
    getTableState,
    getTableColumns,
    getVisibleColumns,
    getSearchableColumns,
    getFilteredData,
    getPaginatedData,
    
    // Actions
    initializeTable,
    setTableData,
    setLoading,
    updatePagination,
    updateSort,
    updateFilter,
    updateSearch,
    clearFilters,
    setSelectedRows,
    toggleRowSelection,
    clearSelection,
    updateColumnVisibility,
    reorderColumns,
    exportTableData,
    resetTable
  }
})
```

### Store Composition and Integration

```vue
<!-- src/components/DataTableManager.vue -->
<template>
  <div class="data-table-manager">
    <!-- Table Controls -->
    <div class="table-controls">
      <el-row :gutter="16" justify="space-between">
        <el-col :span="12">
          <el-input
            v-model="searchQuery"
            placeholder="Search..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        
        <el-col :span="12" class="text-right">
          <el-button-group>
            <el-button :icon="Refresh" @click="refreshData">
              Refresh
            </el-button>
            
            <el-dropdown @command="handleExport">
              <el-button :icon="Download">
                Export<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="csv">Export as CSV</el-dropdown-item>
                  <el-dropdown-item command="excel">Export as Excel</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            
            <el-button :icon="Setting" @click="showColumnSettings = true">
              Columns
            </el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </div>
    
    <!-- Data Table -->
    <el-table
      ref="tableRef"
      :data="paginatedData"
      :loading="tableState.loading"
      v-loading="tableState.loading"
      element-loading-text="Loading data..."
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @filter-change="handleFilterChange"
      stripe
      border
      height="600"
    >
      <!-- Selection Column -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        fixed="left"
      />
      
      <!-- Index Column -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="#"
        width="60"
        fixed="left"
      />
      
      <!-- Dynamic Columns -->
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :filters="getColumnFilters(column)"
        :filter-method="column.filterable ? undefined : null"
        :formatter="column.formatter"
        show-overflow-tooltip
      >
        <template v-if="column.type === 'actions'" #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index" />
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Pagination -->
    <div class="table-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="filteredTotal"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- Column Settings Dialog -->
    <el-dialog
      v-model="showColumnSettings"
      title="Column Settings"
      width="500px"
    >
      <div class="column-settings">
        <el-checkbox-group v-model="selectedColumns">
          <div
            v-for="column in allColumns"
            :key="column.prop"
            class="column-item"
          >
            <el-checkbox :label="column.prop">
              {{ column.label }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      
      <template #footer>
        <el-button @click="showColumnSettings = false">Cancel</el-button>
        <el-button type="primary" @click="applyColumnSettings">
          Apply
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElPagination,
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElRow,
  ElCol,
  ElIcon
} from 'element-plus'
import {
  Search,
  Refresh,
  Download,
  Setting,
  ArrowDown
} from '@element-plus/icons-vue'
import { useDataTableStore } from '@/stores/dataTable'
import type { TableColumn } from '@/stores/dataTable'

interface Props {
  tableId: string
  columns: TableColumn[]
  dataLoader: () => Promise<any[]>
  selectable?: boolean
  showIndex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  showIndex: false
})

const emit = defineEmits<{
  refresh: []
  selectionChange: [rows: any[]]
}>()

// Store
const dataTableStore = useDataTableStore()

// Refs
const tableRef = ref<InstanceType<typeof ElTable>>()
const showColumnSettings = ref(false)
const selectedColumns = ref<string[]>([])

// Computed
const tableState = computed(() => dataTableStore.getTableState(props.tableId))
const allColumns = computed(() => dataTableStore.getTableColumns(props.tableId))
const visibleColumns = computed(() => dataTableStore.getVisibleColumns(props.tableId))
const paginatedData = computed(() => dataTableStore.getPaginatedData(props.tableId))
const filteredTotal = computed(() => dataTableStore.getFilteredData(props.tableId).length)

// Reactive properties
const searchQuery = computed({
  get: () => tableState.value.searchQuery,
  set: (value) => dataTableStore.updateSearch(props.tableId, value)
})

const currentPage = computed({
  get: () => tableState.value.currentPage,
  set: (value) => dataTableStore.updatePagination(props.tableId, value)
})

const pageSize = computed({
  get: () => tableState.value.pageSize,
  set: (value) => dataTableStore.updatePagination(props.tableId, tableState.value.currentPage, value)
})

// Methods
const refreshData = async () => {
  dataTableStore.setLoading(props.tableId, true)
  
  try {
    const data = await props.dataLoader()
    dataTableStore.setTableData(props.tableId, data)
    emit('refresh')
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const handleSearch = (query: string) => {
  dataTableStore.updateSearch(props.tableId, query)
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  const sortOrder = order === 'ascending' ? 'ascending' : order === 'descending' ? 'descending' : null
  dataTableStore.updateSort(props.tableId, prop, sortOrder)
}

const handleSelectionChange = (rows: any[]) => {
  dataTableStore.setSelectedRows(props.tableId, rows)
  emit('selectionChange', rows)
}

const handleFilterChange = (filters: Record<string, any>) => {
  Object.entries(filters).forEach(([prop, value]) => {
    dataTableStore.updateFilter(props.tableId, prop, value)
  })
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleExport = (format: 'csv' | 'excel') => {
  dataTableStore.exportTableData(props.tableId, format)
}

const getColumnFilters = (column: TableColumn) => {
  if (!column.filterable) return undefined
  
  // Generate filter options based on unique values in the column
  const data = dataTableStore.getTableState(props.tableId).data
  const uniqueValues = [...new Set(data.map(row => row[column.prop]))]
    .filter(value => value !== null && value !== undefined)
    .map(value => ({ text: String(value), value }))
  
  return uniqueValues.length > 0 ? uniqueValues : undefined
}

const applyColumnSettings = () => {
  allColumns.value.forEach(column => {
    const visible = selectedColumns.value.includes(column.prop)
    dataTableStore.updateColumnVisibility(props.tableId, column.prop, visible)
  })
  
  showColumnSettings.value = false
}

// Lifecycle
onMounted(() => {
  // Initialize table
  dataTableStore.initializeTable(props.tableId, props.columns)
  
  // Set initial selected columns
  selectedColumns.value = visibleColumns.value.map(col => col.prop)
  
  // Load initial data
  refreshData()
})

// Watch for column changes
watch(visibleColumns, (newColumns) => {
  selectedColumns.value = newColumns.map(col => col.prop)
}, { deep: true })
</script>

<style scoped>
.data-table-manager {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.table-controls {
  margin-bottom: 20px;
}

.table-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.column-settings {
  max-height: 400px;
  overflow-y: auto;
}

.column-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.column-item:last-child {
  border-bottom: none;
}

.text-right {
  text-align: right;
}
</style>
```

This comprehensive guide demonstrates advanced Pinia integration with Element Plus, covering authentication, UI state management, data table management, and practical component implementation patterns.