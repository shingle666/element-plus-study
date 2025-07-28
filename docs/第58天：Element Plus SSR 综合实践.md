# 第58天：Element Plus SSR 综合实践

## 学习目标

* 综合运用 Element Plus SSR 的所有技术栈
* 构建完整的企业级 SSR 应用
* 掌握复杂业务场景的 SSR 解决方案
* 实现高性能、可扩展的 SSR 架构

## 知识点概览

### 1. 项目架构设计

#### 1.1 整体架构规划

```typescript
// types/architecture.ts
export interface SSRArchitecture {
  // 前端层
  frontend: {
    framework: 'Vue 3 + TypeScript'
    ui: 'Element Plus'
    routing: 'Vue Router 4'
    state: 'Pinia'
    styling: 'SCSS + CSS Variables'
    build: 'Vite'
  }
  
  // SSR 层
  ssr: {
    renderer: 'Vue Server Renderer'
    hydration: 'Progressive Hydration'
    caching: 'Multi-level Caching'
    optimization: 'Code Splitting + Lazy Loading'
  }
  
  // 服务层
  server: {
    runtime: 'Node.js + Express'
    clustering: 'PM2 Cluster'
    proxy: 'Nginx'
    loadBalancer: 'Kubernetes'
  }
  
  // 数据层
  data: {
    api: 'RESTful + GraphQL'
    cache: 'Redis Cluster'
    database: 'PostgreSQL'
    cdn: 'CloudFlare'
  }
  
  // 监控层
  monitoring: {
    apm: 'New Relic'
    logging: 'ELK Stack'
    metrics: 'Prometheus + Grafana'
    alerts: 'PagerDuty'
  }
  
  // 部署层
  deployment: {
    containerization: 'Docker'
    orchestration: 'Kubernetes'
    cicd: 'GitHub Actions'
    infrastructure: 'AWS/Azure/GCP'
  }
}

// 项目结构
export interface ProjectStructure {
  src: {
    components: 'UI 组件'
    composables: 'Vue 组合式函数'
    layouts: '布局组件'
    pages: '页面组件'
    plugins: '插件配置'
    stores: 'Pinia 状态管理'
    styles: '样式文件'
    utils: '工具函数'
    types: 'TypeScript 类型定义'
  }
  
  server: {
    api: 'API 路由'
    middleware: '中间件'
    services: '业务服务'
    cache: '缓存层'
    config: '配置文件'
    utils: '服务端工具'
  }
  
  build: {
    client: '客户端构建配置'
    server: '服务端构建配置'
    shared: '共享构建配置'
  }
  
  deployment: {
    docker: 'Docker 配置'
    kubernetes: 'K8s 配置'
    scripts: '部署脚本'
    monitoring: '监控配置'
  }
}
```

#### 1.2 核心配置系统

```typescript
// config/app.config.ts
import { defineConfig } from './types'

export default defineConfig({
  // 应用基础配置
  app: {
    name: 'Element Plus SSR Enterprise',
    version: '1.0.0',
    description: '基于 Element Plus 的企业级 SSR 应用',
    author: 'Your Team',
    homepage: 'https://example.com'
  },
  
  // 服务器配置
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: parseInt(process.env.PORT || '3000'),
    workers: parseInt(process.env.WORKERS || '4'),
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    maxMemory: process.env.MAX_MEMORY || '2GB'
  },
  
  // SSR 配置
  ssr: {
    enabled: process.env.SSR_ENABLED !== 'false',
    hydration: {
      strategy: 'progressive',
      chunkSize: 50,
      delay: 100
    },
    prerender: {
      enabled: process.env.PRERENDER_ENABLED === 'true',
      routes: ['/about', '/contact', '/privacy'],
      concurrency: 4
    }
  },
  
  // 缓存配置
  cache: {
    page: {
      enabled: true,
      ttl: 3600000, // 1 hour
      maxSize: 1000
    },
    component: {
      enabled: true,
      ttl: 1800000, // 30 minutes
      maxSize: 5000
    },
    data: {
      enabled: true,
      ttl: 600000, // 10 minutes
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        cluster: process.env.REDIS_CLUSTER === 'true'
      }
    }
  },
  
  // API 配置
  api: {
    baseURL: process.env.API_BASE_URL || 'https://api.example.com',
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
    retries: parseInt(process.env.API_RETRIES || '3'),
    rateLimit: {
      windowMs: 60000,
      max: 100
    }
  },
  
  // 安全配置
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'", "'unsafe-eval'"]
        }
      }
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },
  
  // 监控配置
  monitoring: {
    enabled: process.env.NODE_ENV === 'production',
    apm: {
      serviceName: 'element-plus-ssr',
      environment: process.env.NODE_ENV || 'development',
      serverUrl: process.env.APM_SERVER_URL
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: 'json',
      transports: {
        console: true,
        file: process.env.NODE_ENV === 'production',
        elasticsearch: process.env.ELASTICSEARCH_URL ? true : false
      }
    }
  },
  
  // 性能配置
  performance: {
    compression: {
      enabled: true,
      level: 6,
      threshold: 1024
    },
    static: {
      maxAge: 31536000, // 1 year
      etag: true,
      lastModified: true
    },
    bundleAnalyzer: {
      enabled: process.env.ANALYZE === 'true'
    }
  },
  
  // 开发配置
  development: {
    hmr: true,
    overlay: true,
    devtools: true,
    sourcemap: true
  }
})
```

### 2. 企业级组件系统

#### 2.1 高级数据表格组件

```vue
<!-- components/DataTable/DataTable.vue -->
<template>
  <div class="data-table">
    <!-- 表格工具栏 -->
    <div class="data-table__toolbar">
      <div class="data-table__toolbar-left">
        <slot name="toolbar-left">
          <el-button
            v-if="showRefresh"
            :icon="Refresh"
            @click="handleRefresh"
          >
            刷新
          </el-button>
          
          <el-button
            v-if="showExport"
            :icon="Download"
            @click="handleExport"
          >
            导出
          </el-button>
        </slot>
      </div>
      
      <div class="data-table__toolbar-right">
        <slot name="toolbar-right">
          <!-- 搜索框 -->
          <el-input
            v-if="showSearch"
            v-model="searchKeyword"
            :placeholder="searchPlaceholder"
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
            style="width: 300px; margin-right: 12px;"
          />
          
          <!-- 列设置 -->
          <el-dropdown v-if="showColumnSettings" trigger="click">
            <el-button :icon="Setting" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="column in configurableColumns"
                  :key="column.prop"
                  @click="toggleColumn(column)"
                >
                  <el-checkbox
                    :model-value="column.visible"
                    @change="toggleColumn(column)"
                  >
                    {{ column.label }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </slot>
      </div>
    </div>
    
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :max-height="maxHeight"
      :stripe="stripe"
      :border="border"
      :size="size"
      :row-key="rowKey"
      :tree-props="treeProps"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :highlight-current-row="highlightCurrentRow"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :span-method="spanMethod"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @sort-change="handleSortChange"
      @expand-change="handleExpandChange"
      @row-click="handleRowClick"
      @row-dblclick="handleRowDblclick"
      @row-contextmenu="handleRowContextmenu"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        :width="selectionWidth"
        :fixed="selectionFixed"
        :selectable="selectable"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :label="indexLabel"
        :width="indexWidth"
        :fixed="indexFixed"
        :index="indexMethod"
      />
      
      <!-- 展开列 -->
      <el-table-column
        v-if="showExpand"
        type="expand"
        :width="expandWidth"
        :fixed="expandFixed"
      >
        <template #default="{ row, $index }">
          <slot name="expand" :row="row" :index="$index" />
        </template>
      </el-table-column>
      
      <!-- 数据列 -->
      <template v-for="column in visibleColumns" :key="column.prop">
        <el-table-column
          v-if="!column.children"
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
          :filter-method="column.filterMethod"
          :filter-multiple="column.filterMultiple"
          :filter-placement="column.filterPlacement"
        >
          <template v-if="column.headerSlot" #header="scope">
            <slot :name="column.headerSlot" v-bind="scope" />
          </template>
          
          <template #default="scope">
            <slot
              v-if="column.slot"
              :name="column.slot"
              v-bind="scope"
            />
            <component
              v-else-if="column.component"
              :is="column.component"
              v-bind="{ ...scope, ...column.componentProps }"
              @click="(event) => handleCellClick(event, scope, column)"
            />
            <span v-else>
              {{ formatCellValue(scope.row, column) }}
            </span>
          </template>
        </el-table-column>
        
        <!-- 多级表头 -->
        <el-table-column
          v-else
          :label="column.label"
          :align="column.align"
          :header-align="column.headerAlign"
        >
          <template v-for="child in column.children" :key="child.prop">
            <el-table-column
              :prop="child.prop"
              :label="child.label"
              :width="child.width"
              :min-width="child.minWidth"
              :fixed="child.fixed"
              :sortable="child.sortable"
              :formatter="child.formatter"
              :show-overflow-tooltip="child.showOverflowTooltip"
              :align="child.align"
              :header-align="child.headerAlign"
            >
              <template v-if="child.headerSlot" #header="scope">
                <slot :name="child.headerSlot" v-bind="scope" />
              </template>
              
              <template #default="scope">
                <slot
                  v-if="child.slot"
                  :name="child.slot"
                  v-bind="scope"
                />
                <component
                  v-else-if="child.component"
                  :is="child.component"
                  v-bind="{ ...scope, ...child.componentProps }"
                />
                <span v-else>
                  {{ formatCellValue(scope.row, child) }}
                </span>
              </template>
            </el-table-column>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        :label="actionsLabel"
        :width="actionsWidth"
        :min-width="actionsMinWidth"
        :fixed="actionsFixed"
        :align="actionsAlign"
        class-name="data-table__actions"
      >
        <template #default="scope">
          <slot name="actions" v-bind="scope">
            <el-button
              v-for="action in getRowActions(scope.row)"
              :key="action.key"
              :type="action.type"
              :size="action.size || 'small'"
              :icon="action.icon"
              :disabled="action.disabled"
              :loading="action.loading"
              @click="handleActionClick(action, scope)"
            >
              {{ action.label }}
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页器 -->
    <div v-if="showPagination" class="data-table__pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        :layout="paginationLayout"
        :background="paginationBackground"
        :small="paginationSmall"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
      />
    </div>
    
    <!-- 批量操作栏 -->
    <div v-if="showBatchActions && selectedRows.length > 0" class="data-table__batch-actions">
      <div class="data-table__batch-info">
        已选择 {{ selectedRows.length }} 项
        <el-button type="text" @click="clearSelection">清空</el-button>
      </div>
      
      <div class="data-table__batch-buttons">
        <slot name="batch-actions" :selected-rows="selectedRows">
          <el-button
            v-for="action in batchActions"
            :key="action.key"
            :type="action.type"
            :icon="action.icon"
            :disabled="action.disabled"
            :loading="action.loading"
            @click="handleBatchAction(action)"
          >
            {{ action.label }}
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElInput, ElDropdown, ElDropdownMenu, ElDropdownItem, ElCheckbox, ElPagination } from 'element-plus'
import { Search, Refresh, Download, Setting } from '@element-plus/icons-vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'

// 类型定义
interface DataTableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  sortMethod?: Function
  sortBy?: string | string[] | Function
  sortOrders?: string[]
  resizable?: boolean
  formatter?: Function
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  filters?: Array<{ text: string; value: any }>
  filterMethod?: Function
  filterMultiple?: boolean
  filterPlacement?: string
  slot?: string
  headerSlot?: string
  component?: any
  componentProps?: Record<string, any>
  visible?: boolean
  children?: DataTableColumn[]
}

interface DataTableAction {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  icon?: any
  disabled?: boolean
  loading?: boolean
  show?: (row: any) => boolean
  handler: (row: any, index: number) => void
}

interface DataTableBatchAction {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  icon?: any
  disabled?: boolean
  loading?: boolean
  handler: (selectedRows: any[]) => void
}

// Props
interface DataTableProps {
  // 数据相关
  data?: any[]
  columns: DataTableColumn[]
  loading?: boolean
  
  // 表格配置
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  rowKey?: string | Function
  treeProps?: { children?: string; hasChildren?: string }
  expandRowKeys?: any[]
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
  highlightCurrentRow?: boolean
  rowClassName?: string | Function
  cellClassName?: string | Function
  spanMethod?: Function
  
  // 功能配置
  showSelection?: boolean
  selectionWidth?: number
  selectionFixed?: boolean | 'left' | 'right'
  selectable?: Function
  
  showIndex?: boolean
  indexLabel?: string
  indexWidth?: number
  indexFixed?: boolean | 'left' | 'right'
  indexMethod?: Function
  
  showExpand?: boolean
  expandWidth?: number
  expandFixed?: boolean | 'left' | 'right'
  
  showActions?: boolean
  actionsLabel?: string
  actionsWidth?: number
  actionsMinWidth?: number
  actionsFixed?: boolean | 'left' | 'right'
  actionsAlign?: 'left' | 'center' | 'right'
  actions?: DataTableAction[]
  
  showBatchActions?: boolean
  batchActions?: DataTableBatchAction[]
  
  // 工具栏配置
  showRefresh?: boolean
  showExport?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  showColumnSettings?: boolean
  
  // 分页配置
  showPagination?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  paginationLayout?: string
  paginationBackground?: boolean
  paginationSmall?: boolean
}

const props = withDefaults(defineProps<DataTableProps>(), {
  data: () => [],
  loading: false,
  stripe: true,
  border: true,
  size: 'default',
  highlightCurrentRow: true,
  showSelection: false,
  selectionWidth: 55,
  selectionFixed: 'left',
  showIndex: false,
  indexLabel: '#',
  indexWidth: 55,
  indexFixed: 'left',
  showExpand: false,
  expandWidth: 55,
  expandFixed: 'left',
  showActions: true,
  actionsLabel: '操作',
  actionsWidth: 150,
  actionsFixed: 'right',
  actionsAlign: 'center',
  actions: () => [],
  showBatchActions: true,
  batchActions: () => [],
  showRefresh: true,
  showExport: true,
  showSearch: true,
  searchPlaceholder: '请输入搜索关键词',
  showColumnSettings: true,
  showPagination: true,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  paginationLayout: 'total, sizes, prev, pager, next, jumper',
  paginationBackground: true,
  paginationSmall: false
})

// Emits
interface DataTableEmits {
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
  'selection-change': [selection: any[]]
  'current-change': [currentRow: any, oldCurrentRow: any]
  'sort-change': [{ column: TableColumnCtx<any>, prop: string, order: string | null }]
  'expand-change': [row: any, expandedRows: any[]]
  'row-click': [row: any, column: TableColumnCtx<any>, event: Event]
  'row-dblclick': [row: any, column: TableColumnCtx<any>, event: Event]
  'row-contextmenu': [row: any, column: TableColumnCtx<any>, event: Event]
  'cell-click': [row: any, column: TableColumnCtx<any>, cell: HTMLTableCellElement, event: Event]
  'action-click': [action: DataTableAction, row: any, index: number]
  'batch-action': [action: DataTableBatchAction, selectedRows: any[]]
  'refresh': []
  'export': []
  'search': [keyword: string]
}

const emit = defineEmits<DataTableEmits>()

// Refs
const tableRef = ref<TableInstance>()
const searchKeyword = ref('')
const selectedRows = ref<any[]>([])

// Computed
const tableData = computed(() => {
  if (!searchKeyword.value) {
    return props.data
  }
  
  return props.data.filter(row => {
    return Object.values(row).some(value => {
      return String(value).toLowerCase().includes(searchKeyword.value.toLowerCase())
    })
  })
})

const configurableColumns = computed(() => {
  return props.columns.filter(column => !column.children).map(column => ({
    ...column,
    visible: column.visible !== false
  }))
})

const visibleColumns = computed(() => {
  return props.columns.filter(column => {
    if (column.children) {
      return column.children.some(child => child.visible !== false)
    }
    return column.visible !== false
  })
})

// Methods
const handleRefresh = () => {
  emit('refresh')
}

const handleExport = () => {
  emit('export')
}

const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

const toggleColumn = (column: DataTableColumn) => {
  column.visible = !column.visible
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleCurrentChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-change', currentRow, oldCurrentRow)
}

const handleSortChange = (sortInfo: { column: TableColumnCtx<any>, prop: string, order: string | null }) => {
  emit('sort-change', sortInfo)
}

const handleExpandChange = (row: any, expandedRows: any[]) => {
  emit('expand-change', row, expandedRows)
}

const handleRowClick = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowDblclick = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleRowContextmenu = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

const handleCellClick = (event: Event, scope: any, column: DataTableColumn) => {
  emit('cell-click', scope.row, scope.column, scope.$el, event)
}

const handleSizeChange = (size: number) => {
  emit('update:pageSize', size)
}

const handleCurrentPageChange = (page: number) => {
  emit('update:currentPage', page)
}

const handleActionClick = (action: DataTableAction, scope: any) => {
  emit('action-click', action, scope.row, scope.$index)
  action.handler(scope.row, scope.$index)
}

const handleBatchAction = (action: DataTableBatchAction) => {
  emit('batch-action', action, selectedRows.value)
  action.handler(selectedRows.value)
}

const getRowActions = (row: any) => {
  return props.actions.filter(action => {
    return action.show ? action.show(row) : true
  })
}

const formatCellValue = (row: any, column: DataTableColumn) => {
  if (column.formatter) {
    return column.formatter(row, column, row[column.prop], 0)
  }
  return row[column.prop]
}

const clearSelection = () => {
  tableRef.value?.clearSelection()
}

// 暴露方法
defineExpose({
  tableRef,
  clearSelection,
  toggleRowSelection: (row: any, selected?: boolean) => {
    tableRef.value?.toggleRowSelection(row, selected)
  },
  toggleAllSelection: () => {
    tableRef.value?.toggleAllSelection()
  },
  toggleRowExpansion: (row: any, expanded?: boolean) => {
    tableRef.value?.toggleRowExpansion(row, expanded)
  },
  setCurrentRow: (row: any) => {
    tableRef.value?.setCurrentRow(row)
  },
  clearSort: () => {
    tableRef.value?.clearSort()
  },
  clearFilter: (columnKeys?: string[]) => {
    tableRef.value?.clearFilter(columnKeys)
  },
  doLayout: () => {
    tableRef.value?.doLayout()
  },
  sort: (prop: string, order: string) => {
    tableRef.value?.sort(prop, order)
  }
})
</script>

<style lang="scss" scoped>
.data-table {
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    &-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  &__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
  
  &__batch-actions {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: var(--el-box-shadow);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 1000;
    
    &-info {
      color: var(--el-text-color-regular);
      font-size: 14px;
    }
    
    &-buttons {
      display: flex;
      gap: 8px;
    }
  }
  
  :deep(.data-table__actions) {
    .cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
  }
}
</style>
```

#### 2.2 智能表单组件

```vue
<!-- components/SmartForm/SmartForm.vue -->
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
    <template v-for="field in visibleFields" :key="field.prop">
      <!-- 分组标题 -->
      <div v-if="field.type === 'group'" class="smart-form__group">
        <div class="smart-form__group-title">
          {{ field.label }}
        </div>
        <div class="smart-form__group-description" v-if="field.description">
          {{ field.description }}
        </div>
      </div>
      
      <!-- 分割线 -->
      <el-divider v-else-if="field.type === 'divider'" :content-position="field.contentPosition">
        {{ field.label }}
      </el-divider>
      
      <!-- 表单项 -->
      <el-form-item
        v-else
        :prop="field.prop"
        :label="field.label"
        :label-width="field.labelWidth"
        :required="field.required"
        :rules="getFieldRules(field)"
        :error="fieldErrors[field.prop]"
        :show-message="field.showMessage !== false"
        :inline-message="field.inlineMessage"
        :size="field.size || size"
        :class="getFieldClass(field)"
      >
        <template v-if="field.labelSlot" #label>
          <slot :name="field.labelSlot" :field="field" />
        </template>
        
        <!-- 输入框 -->
        <el-input
          v-if="field.type === 'input'"
          v-model="formData[field.prop]"
          :type="field.inputType || 'text'"
          :placeholder="field.placeholder"
          :clearable="field.clearable !== false"
          :show-password="field.showPassword"
          :show-word-limit="field.showWordLimit"
          :maxlength="field.maxlength"
          :minlength="field.minlength"
          :prefix-icon="field.prefixIcon"
          :suffix-icon="field.suffixIcon"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :size="field.size"
          :resize="field.resize"
          :autosize="field.autosize"
          :autocomplete="field.autocomplete"
          :name="field.name"
          :max="field.max"
          :min="field.min"
          :step="field.step"
          :validate-event="field.validateEvent !== false"
          @input="handleFieldChange(field, $event)"
          @change="handleFieldChange(field, $event)"
          @focus="handleFieldFocus(field, $event)"
          @blur="handleFieldBlur(field, $event)"
        >
          <template v-if="field.prepend" #prepend>
            {{ field.prepend }}
          </template>
          <template v-if="field.append" #append>
            {{ field.append }}
          </template>
        </el-input>
        
        <!-- 文本域 -->
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.prop]"
          type="textarea"
          :placeholder="field.placeholder"
          :rows="field.rows || 3"
          :autosize="field.autosize"
          :maxlength="field.maxlength"
          :minlength="field.minlength"
          :show-word-limit="field.showWordLimit"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :resize="field.resize"
          @input="handleFieldChange(field, $event)"
          @change="handleFieldChange(field, $event)"
          @focus="handleFieldFocus(field, $event)"
          @blur="handleFieldBlur(field, $event)"
        />
        
        <!-- 数字输入框 -->
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="formData[field.prop]"
          :min="field.min"
          :max="field.max"
          :step="field.step || 1"
          :step-strictly="field.stepStrictly"
          :precision="field.precision"
          :size="field.size"
          :disabled="field.disabled"
          :controls="field.controls !== false"
          :controls-position="field.controlsPosition"
          :placeholder="field.placeholder"
          @change="handleFieldChange(field, $event)"
          @blur="handleFieldBlur(field, $event)"
          @focus="handleFieldFocus(field, $event)"
        />
        
        <!-- 选择器 -->
        <el-select
          v-else-if="field.type === 'select'"
          v-model="formData[field.prop]"
          :multiple="field.multiple"
          :disabled="field.disabled"
          :value-key="field.valueKey"
          :size="field.size"
          :clearable="field.clearable !== false"
          :collapse-tags="field.collapseTags"
          :collapse-tags-tooltip="field.collapseTagsTooltip"
          :multiple-limit="field.multipleLimit"
          :name="field.name"
          :autocomplete="field.autocomplete"
          :placeholder="field.placeholder"
          :filterable="field.filterable"
          :allow-create="field.allowCreate"
          :filter-method="field.filterMethod"
          :remote="field.remote"
          :remote-method="field.remoteMethod"
          :remote-show-suffix="field.remoteShowSuffix"
          :loading="field.loading"
          :loading-text="field.loadingText"
          :no-match-text="field.noMatchText"
          :no-data-text="field.noDataText"
          :popper-class="field.popperClass"
          :reserve-keyword="field.reserveKeyword"
          :default-first-option="field.defaultFirstOption"
          :teleported="field.teleported !== false"
          :persistent="field.persistent"
          :automatic-dropdown="field.automaticDropdown"
          :clear-icon="field.clearIcon"
          :fit-input-width="field.fitInputWidth"
          :suffix-icon="field.suffixIcon"
          :tag-type="field.tagType"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
          @visible-change="handleSelectVisibleChange(field, $event)"
          @remove-tag="handleSelectRemoveTag(field, $event)"
          @clear="handleSelectClear(field)"
          @blur="handleFieldBlur(field, $event)"
          @focus="handleFieldFocus(field, $event)"
        >
          <el-option
            v-for="option in getSelectOptions(field)"
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
          :options="field.options"
          :props="field.cascaderProps"
          :size="field.size"
          :placeholder="field.placeholder"
          :disabled="field.disabled"
          :clearable="field.clearable !== false"
          :show-all-levels="field.showAllLevels !== false"
          :collapse-tags="field.collapseTags"
          :collapse-tags-tooltip="field.collapseTagsTooltip"
          :separator="field.separator"
          :filterable="field.filterable"
          :filter-method="field.filterMethod"
          :debounce="field.debounce"
          :before-filter="field.beforeFilter"
          :popper-class="field.popperClass"
          :teleported="field.teleported !== false"
          :tag-type="field.tagType"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
          @expand-change="handleCascaderExpandChange(field, $event)"
          @blur="handleFieldBlur(field, $event)"
          @focus="handleFieldFocus(field, $event)"
          @visible-change="handleCascaderVisibleChange(field, $event)"
        />
        
        <!-- 日期选择器 -->
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="formData[field.prop]"
          :type="field.dateType || 'date'"
          :placeholder="field.placeholder"
          :start-placeholder="field.startPlaceholder"
          :end-placeholder="field.endPlaceholder"
          :format="field.format"
          :value-format="field.valueFormat"
          :size="field.size"
          :disabled="field.disabled"
          :clearable="field.clearable !== false"
          :readonly="field.readonly"
          :editable="field.editable !== false"
          :disabled-date="field.disabledDate"
          :shortcuts="field.shortcuts"
          :cell-class-name="field.cellClassName"
          :range-separator="field.rangeSeparator"
          :default-value="field.defaultValue"
          :default-time="field.defaultTime"
          :popper-class="field.popperClass"
          :unlink-panels="field.unlinkPanels"
          :prefix-icon="field.prefixIcon"
          :clear-icon="field.clearIcon"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
          @blur="handleFieldBlur(field, $event)"
          @focus="handleFieldFocus(field, $event)"
          @calendar-change="handleDateCalendarChange(field, $event)"
          @panel-change="handleDatePanelChange(field, $event)"
          @visible-change="handleDateVisibleChange(field, $event)"
        />
        
        <!-- 时间选择器 -->
        <el-time-picker
          v-else-if="field.type === 'time'"
          v-model="formData[field.prop]"
          :is-range="field.isRange"
          :placeholder="field.placeholder"
          :start-placeholder="field.startPlaceholder"
          :end-placeholder="field.endPlaceholder"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :editable="field.editable !== false"
          :clearable="field.clearable !== false"
          :size="field.size"
          :format="field.format"
          :value-format="field.valueFormat"
          :disabled-hours="field.disabledHours"
          :disabled-minutes="field.disabledMinutes"
          :disabled-seconds="field.disabledSeconds"
          :arrow-control="field.arrowControl"
          :popper-class="field.popperClass"
          :range-separator="field.rangeSeparator"
          :prefix-icon="field.prefixIcon"
          :clear-icon="field.clearIcon"
          :default-value="field.defaultValue"
          @change="handleFieldChange(field, $event)"
          @blur="handleFieldBlur(field, $event)"
          @focus="handleFieldFocus(field, $event)"
          @visible-change="handleTimeVisibleChange(field, $event)"
        />
        
        <!-- 开关 -->
        <el-switch
          v-else-if="field.type === 'switch'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
          :loading="field.loading"
          :size="field.size"
          :width="field.width"
          :inline-prompt="field.inlinePrompt"
          :active-icon="field.activeIcon"
          :inactive-icon="field.inactiveIcon"
          :active-text="field.activeText"
          :inactive-text="field.inactiveText"
          :active-value="field.activeValue"
          :inactive-value="field.inactiveValue"
          :active-color="field.activeColor"
          :inactive-color="field.inactiveColor"
          :border-color="field.borderColor"
          :name="field.name"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
        />
        
        <!-- 滑块 -->
        <el-slider
          v-else-if="field.type === 'slider'"
          v-model="formData[field.prop]"
          :min="field.min || 0"
          :max="field.max || 100"
          :disabled="field.disabled"
          :step="field.step || 1"
          :show-input="field.showInput"
          :show-input-controls="field.showInputControls !== false"
          :input-size="field.inputSize"
          :show-stops="field.showStops"
          :show-tooltip="field.showTooltip !== false"
          :format-tooltip="field.formatTooltip"
          :range="field.range"
          :vertical="field.vertical"
          :height="field.height"
          :label="field.sliderLabel"
          :debounce="field.debounce"
          :tooltip-class="field.tooltipClass"
          :marks="field.marks"
          @change="handleFieldChange(field, $event)"
          @input="handleSliderInput(field, $event)"
        />
        
        <!-- 评分 -->
        <el-rate
          v-else-if="field.type === 'rate'"
          v-model="formData[field.prop]"
          :max="field.max || 5"
          :disabled="field.disabled"
          :allow-half="field.allowHalf"
          :low-threshold="field.lowThreshold"
          :high-threshold="field.highThreshold"
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
          :size="field.size"
          @change="handleFieldChange(field, $event)"
        />
        
        <!-- 颜色选择器 -->
        <el-color-picker
          v-else-if="field.type === 'color'"
          v-model="formData[field.prop]"
          :disabled="field.disabled"
          :size="field.size"
          :show-alpha="field.showAlpha"
          :color-format="field.colorFormat"
          :popper-class="field.popperClass"
          :predefine="field.predefine"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
          @active-change="handleColorActiveChange(field, $event)"
        />
        
        <!-- 单选框组 -->
        <el-radio-group
          v-else-if="field.type === 'radio'"
          v-model="formData[field.prop]"
          :size="field.size"
          :disabled="field.disabled"
          :text-color="field.textColor"
          :fill="field.fill"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
        >
          <template v-if="field.radioType === 'button'">
            <el-radio-button
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio-button>
          </template>
          <template v-else>
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
              :border="field.border"
              :size="field.size"
            >
              {{ option.label }}
            </el-radio>
          </template>
        </el-radio-group>
        
        <!-- 复选框组 -->
        <el-checkbox-group
          v-else-if="field.type === 'checkbox'"
          v-model="formData[field.prop]"
          :size="field.size"
          :disabled="field.disabled"
          :min="field.min"
          :max="field.max"
          :text-color="field.textColor"
          :fill="field.fill"
          :tag="field.tag"
          :validate-event="field.validateEvent !== false"
          @change="handleFieldChange(field, $event)"
        >
          <template v-if="field.checkboxType === 'button'">
            <el-checkbox-button
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-checkbox-button>
          </template>
          <template v-else>
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
              :border="field.border"
              :size="field.size"
              :indeterminate="option.indeterminate"
              :checked="option.checked"
              :true-label="option.trueLabel"
              :false-label="option.falseLabel"
            >
              {{ option.label }}
            </el-checkbox>
          </template>
        </el-checkbox-group>
        
        <!-- 上传 -->
        <el-upload
          v-else-if="field.type === 'upload'"
          :action="field.action"
          :headers="field.headers"
          :method="field.method"
          :multiple="field.multiple"
          :data="field.data"
          :name="field.name"
          :with-credentials="field.withCredentials"
          :show-file-list="field.showFileList !== false"
          :drag="field.drag"
          :accept="field.accept"
          :on-preview="field.onPreview"
          :on-remove="(file, fileList) => handleUploadRemove(field, file, fileList)"
          :on-success="(response, file, fileList) => handleUploadSuccess(field, response, file, fileList)"
          :on-error="(err, file, fileList) => handleUploadError(field, err, file, fileList)"
          :on-progress="(event, file, fileList) => handleUploadProgress(field, event, file, fileList)"
          :on-change="(file, fileList) => handleUploadChange(field, file, fileList)"
          :before-upload="field.beforeUpload"
          :before-remove="field.beforeRemove"
          :list-type="field.listType"
          :auto-upload="field.autoUpload !== false"
          :file-list="formData[field.prop] || []"
          :http-request="field.httpRequest"
          :disabled="field.disabled"
          :limit="field.limit"
          :on-exceed="field.onExceed"
        >
          <template v-if="field.drag">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </template>
          <template v-else-if="field.listType === 'picture-card'">
            <el-icon><Plus /></el-icon>
          </template>
          <template v-else>
            <el-button type="primary">点击上传</el-button>
          </template>
          
          <template v-if="field.tip" #tip>
            <div class="el-upload__tip">{{ field.tip }}</div>
          </template>
        </el-upload>
        
        <!-- 自定义组件 -->
        <component
          v-else-if="field.component"
          :is="field.component"
          v-model="formData[field.prop]"
          v-bind="field.componentProps"
          @change="handleFieldChange(field, $event)"
        />
        
        <!-- 插槽 -->
        <slot
          v-else-if="field.slot"
          :name="field.slot"
          :field="field"
          :value="formData[field.prop]"
          :form-data="formData"
          @change="handleFieldChange(field, $event)"
        />
        
        <!-- 帮助文本 -->
        <div v-if="field.help" class="smart-form__help">
          {{ field.help }}
        </div>
      </el-form-item>
    </template>
    
    <!-- 表单操作按钮 -->
    <el-form-item v-if="showActions" class="smart-form__actions">
      <slot name="actions" :form-data="formData" :validate="validate" :reset="resetForm">
        <el-button
          v-if="showSubmit"
          type="primary"
          :loading="submitLoading"
          :disabled="submitDisabled"
          @click="handleSubmit"
        >
          {{ submitText }}
        </el-button>
        
        <el-button
          v-if="showReset"
          :disabled="resetDisabled"
          @click="handleReset"
        >
          {{ resetText }}
        </el-button>
        
        <el-button
          v-if="showCancel"
          :disabled="cancelDisabled"
          @click="handleCancel"
        >
          {{ cancelText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, nextTick } from 'vue'
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElCascader, ElDatePicker, ElTimePicker, ElSwitch, ElSlider, ElRate, ElColorPicker, ElRadioGroup, ElRadio, ElRadioButton, ElCheckboxGroup, ElCheckbox, ElCheckboxButton, ElUpload, ElButton, ElDivider, ElIcon } from 'element-plus'
import { Plus, UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 字段类型定义
interface SmartFormField {
  prop: string
  label?: string
  type: string
  required?: boolean
  rules?: any[]
  visible?: boolean | ((formData: any) => boolean)
  disabled?: boolean | ((formData: any) => boolean)
  readonly?: boolean
  placeholder?: string
  help?: string
  labelWidth?: string
  labelSlot?: string
  size?: 'large' | 'default' | 'small'
  showMessage?: boolean
  inlineMessage?: boolean
  slot?: string
  component?: any
  componentProps?: Record<string, any>
  
  // 输入框特有属性
  inputType?: string
  clearable?: boolean
  showPassword?: boolean
  showWordLimit?: boolean
  maxlength?: number
  minlength?: number
  prefixIcon?: any
  suffixIcon?: any
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  autosize?: boolean | { minRows?: number; maxRows?: number }
  autocomplete?: string
  name?: string
  max?: number
  min?: number
  step?: number
  validateEvent?: boolean
  prepend?: string
  append?: string
  
  // 文本域特有属性
  rows?: number
  
  // 数字输入框特有属性
  stepStrictly?: boolean
  precision?: number
  controls?: boolean
  controlsPosition?: 'right' | ''
  
  // 选择器特有属性
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  multiple?: boolean
  valueKey?: string
  collapseTags?: boolean
  collapseTagsTooltip?: boolean
  multipleLimit?: number
  filterable?: boolean
  allowCreate?: boolean
  filterMethod?: Function
  remote?: boolean
  remoteMethod?: Function
  remoteShowSuffix?: boolean
  loading?: boolean
  loadingText?: string
  noMatchText?: string
  noDataText?: string
  popperClass?: string
  reserveKeyword?: boolean
  defaultFirstOption?: boolean
  teleported?: boolean
  persistent?: boolean
  automaticDropdown?: boolean
  clearIcon?: any
  fitInputWidth?: boolean