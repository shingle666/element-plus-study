# 第73天：Element Plus 组件库二次开发

## 学习目标

* 掌握基于 Element Plus 的组件库二次开发技术
* 学习组件扩展和增强的最佳实践
* 了解组件库的打包、发布和版本管理
* 实现企业级组件库的构建和维护

## 知识点概览

### 1. 组件库架构设计

#### 1.1 组件库基础架构

```typescript
// 组件库配置接口
interface ComponentLibraryConfig {
  name: string
  version: string
  description: string
  author: string
  license: string
  repository: string
  
  // 构建配置
  build: {
    entry: string
    output: string
    formats: ('es' | 'cjs' | 'umd')[]
    external: string[]
    globals: Record<string, string>
  }
  
  // 组件配置
  components: {
    prefix: string
    namespace: string
    stylePrefix: string
    iconPrefix: string
  }
  
  // 主题配置
  theme: {
    primary: string
    variables: Record<string, string>
    darkMode: boolean
  }
  
  // 文档配置
  docs: {
    title: string
    description: string
    logo: string
    favicon: string
    baseUrl: string
  }
}

// 组件库管理器
class ComponentLibraryManager {
  private config: ComponentLibraryConfig
  private components: Map<string, ComponentDefinition> = new Map()
  private themes: Map<string, ThemeDefinition> = new Map()
  private plugins: Map<string, PluginDefinition> = new Map()
  
  constructor(config: ComponentLibraryConfig) {
    this.config = config
    this.initializeLibrary()
  }
  
  // 初始化组件库
  private initializeLibrary(): void {
    this.loadBaseComponents()
    this.loadCustomComponents()
    this.loadThemes()
    this.setupGlobalConfig()
  }
  
  // 加载基础组件（Element Plus）
  private loadBaseComponents(): void {
    // 从 Element Plus 导入基础组件
    const elementComponents = [
      'ElButton', 'ElInput', 'ElSelect', 'ElTable',
      'ElForm', 'ElDialog', 'ElMessage', 'ElNotification'
    ]
    
    elementComponents.forEach(name => {
      this.components.set(name, {
        name,
        type: 'base',
        source: 'element-plus',
        version: '2.4.0'
      })
    })
  }
  
  // 加载自定义组件
  private loadCustomComponents(): void {
    // 扫描自定义组件目录
    const customComponents = this.scanCustomComponents()
    
    customComponents.forEach(component => {
      this.registerComponent(component)
    })
  }
  
  // 扫描自定义组件
  private scanCustomComponents(): ComponentDefinition[] {
    // 实际实现中会扫描文件系统
    return [
      {
        name: 'MyButton',
        type: 'custom',
        source: 'local',
        version: '1.0.0',
        extends: 'ElButton',
        path: './components/MyButton'
      },
      {
        name: 'DataTable',
        type: 'custom',
        source: 'local',
        version: '1.0.0',
        extends: 'ElTable',
        path: './components/DataTable'
      }
    ]
  }
  
  // 注册组件
  registerComponent(definition: ComponentDefinition): void {
    this.components.set(definition.name, definition)
    console.log(`Component '${definition.name}' registered successfully`)
  }
  
  // 获取组件定义
  getComponent(name: string): ComponentDefinition | undefined {
    return this.components.get(name)
  }
  
  // 获取所有组件
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }
  
  // 注册主题
  registerTheme(name: string, theme: ThemeDefinition): void {
    this.themes.set(name, theme)
  }
  
  // 注册插件
  registerPlugin(name: string, plugin: PluginDefinition): void {
    this.plugins.set(name, plugin)
  }
  
  // 设置全局配置
  private setupGlobalConfig(): void {
    // 设置全局样式变量
    const root = document.documentElement
    Object.entries(this.config.theme.variables).forEach(([key, value]) => {
      root.style.setProperty(`--${this.config.components.stylePrefix}-${key}`, value)
    })
  }
  
  // 构建组件库
  async build(): Promise<void> {
    console.log('Building component library...')
    
    // 生成组件索引
    await this.generateComponentIndex()
    
    // 生成类型定义
    await this.generateTypeDefinitions()
    
    // 生成样式文件
    await this.generateStyleFiles()
    
    // 生成文档
    await this.generateDocumentation()
    
    console.log('Component library built successfully')
  }
  
  // 生成组件索引
  private async generateComponentIndex(): Promise<void> {
    const components = this.getAllComponents()
    const indexContent = this.generateIndexContent(components)
    
    // 写入文件（实际实现中）
    console.log('Generated component index:', indexContent)
  }
  
  // 生成索引内容
  private generateIndexContent(components: ComponentDefinition[]): string {
    const imports = components.map(comp => 
      `export { default as ${comp.name} } from '${comp.path}'`
    ).join('\n')
    
    const exports = components.map(comp => comp.name).join(', ')
    
    return `${imports}\n\nexport { ${exports} }`
  }
  
  // 生成类型定义
  private async generateTypeDefinitions(): Promise<void> {
    const components = this.getAllComponents()
    const typeContent = this.generateTypeContent(components)
    
    console.log('Generated type definitions:', typeContent)
  }
  
  // 生成类型内容
  private generateTypeContent(components: ComponentDefinition[]): string {
    return components.map(comp => {
      return `declare module '${this.config.name}' {
  export const ${comp.name}: any
}`
    }).join('\n\n')
  }
  
  // 生成样式文件
  private async generateStyleFiles(): Promise<void> {
    const styleContent = this.generateStyleContent()
    console.log('Generated style files:', styleContent)
  }
  
  // 生成样式内容
  private generateStyleContent(): string {
    const prefix = this.config.components.stylePrefix
    const variables = Object.entries(this.config.theme.variables)
      .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
      .join('\n')
    
    return `:root {\n${variables}\n}`
  }
  
  // 生成文档
  private async generateDocumentation(): Promise<void> {
    const components = this.getAllComponents()
    const docContent = this.generateDocContent(components)
    
    console.log('Generated documentation:', docContent)
  }
  
  // 生成文档内容
  private generateDocContent(components: ComponentDefinition[]): string {
    return components.map(comp => {
      return `## ${comp.name}\n\n${comp.description || 'No description available'}\n`
    }).join('\n')
  }
}

// 组件定义接口
interface ComponentDefinition {
  name: string
  type: 'base' | 'custom' | 'enhanced'
  source: 'element-plus' | 'local' | 'external'
  version: string
  extends?: string
  path?: string
  description?: string
  props?: Record<string, any>
  events?: Record<string, any>
  slots?: Record<string, any>
}

// 主题定义接口
interface ThemeDefinition {
  name: string
  variables: Record<string, string>
  colors: Record<string, string>
  fonts: Record<string, string>
  spacing: Record<string, string>
}

// 插件定义接口
interface PluginDefinition {
  name: string
  version: string
  install: (app: any, options?: any) => void
  dependencies?: string[]
}
```

#### 1.2 组件扩展基类

```typescript
// 组件扩展基类
abstract class ComponentExtension<T = any> {
  protected baseComponent: any
  protected options: T
  protected eventBus: EventEmitter
  
  constructor(baseComponent: any, options: T) {
    this.baseComponent = baseComponent
    this.options = options
    this.eventBus = new EventEmitter()
    this.initialize()
  }
  
  // 初始化扩展
  protected abstract initialize(): void
  
  // 扩展属性
  protected abstract extendProps(): Record<string, any>
  
  // 扩展事件
  protected abstract extendEvents(): Record<string, Function>
  
  // 扩展插槽
  protected abstract extendSlots(): Record<string, any>
  
  // 扩展方法
  protected abstract extendMethods(): Record<string, Function>
  
  // 生成扩展组件
  generateComponent(): any {
    const extendedProps = this.extendProps()
    const extendedEvents = this.extendEvents()
    const extendedSlots = this.extendSlots()
    const extendedMethods = this.extendMethods()
    
    return {
      name: this.getComponentName(),
      extends: this.baseComponent,
      props: {
        ...this.baseComponent.props,
        ...extendedProps
      },
      emits: [
        ...this.baseComponent.emits || [],
        ...Object.keys(extendedEvents)
      ],
      setup(props: any, { emit, slots, expose }: any) {
        // 调用基础组件的 setup
        const baseSetup = this.baseComponent.setup?.(props, { emit, slots, expose })
        
        // 扩展功能
        const extensions = this.setupExtensions(props, emit, slots)
        
        // 合并并返回
        return {
          ...baseSetup,
          ...extensions,
          ...extendedMethods
        }
      },
      render() {
        return this.renderComponent()
      }
    }
  }
  
  // 获取组件名称
  protected abstract getComponentName(): string
  
  // 设置扩展功能
  protected abstract setupExtensions(props: any, emit: Function, slots: any): any
  
  // 渲染组件
  protected abstract renderComponent(): any
  
  // 触发事件
  protected emit(event: string, ...args: any[]): void {
    this.eventBus.emit(event, ...args)
  }
  
  // 监听事件
  protected on(event: string, callback: Function): void {
    this.eventBus.on(event, callback)
  }
}

// 事件发射器
class EventEmitter {
  private events: Map<string, Set<Function>> = new Map()
  
  on(event: string, callback: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(callback)
  }
  
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }
  
  off(event: string, callback?: Function): void {
    if (callback) {
      this.events.get(event)?.delete(callback)
    } else {
      this.events.delete(event)
    }
  }
}
```

### 2. 组件扩展实践

#### 2.1 增强型按钮组件

```vue
<!-- EnhancedButton.vue -->
<template>
  <el-button
    v-bind="buttonProps"
    :class="buttonClasses"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <span v-if="loadingText">{{ loadingText }}</span>
    </template>
    
    <!-- 正常状态 -->
    <template v-else>
      <!-- 前置图标 -->
      <el-icon v-if="prefixIcon" class="prefix-icon">
        <component :is="prefixIcon" />
      </el-icon>
      
      <!-- 按钮内容 -->
      <slot>
        {{ text }}
      </slot>
      
      <!-- 后置图标 -->
      <el-icon v-if="suffixIcon" class="suffix-icon">
        <component :is="suffixIcon" />
      </el-icon>
      
      <!-- 徽章 -->
      <el-badge
        v-if="badge"
        :value="badge.value"
        :type="badge.type"
        :is-dot="badge.isDot"
        class="button-badge"
      />
    </template>
  </el-button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElButton, ElIcon, ElBadge } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

// 属性定义
interface EnhancedButtonProps {
  // 继承 ElButton 的所有属性
  size?: 'large' | 'default' | 'small'
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  
  // 扩展属性
  text?: string
  prefixIcon?: string | Component
  suffixIcon?: string | Component
  loading?: boolean
  loadingText?: string
  
  // 徽章配置
  badge?: {
    value: string | number
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    isDot?: boolean
  }
  
  // 权限控制
  permission?: string | string[]
  
  // 防抖配置
  debounce?: number
  
  // 确认配置
  confirm?: {
    title: string
    message?: string
    type?: 'warning' | 'info' | 'success' | 'error'
  }
  
  // 异步操作
  asyncHandler?: () => Promise<any>
}

// 事件定义
interface EnhancedButtonEmits {
  click: [event: MouseEvent]
  asyncStart: []
  asyncSuccess: [result: any]
  asyncError: [error: any]
  asyncComplete: []
}

const props = withDefaults(defineProps<EnhancedButtonProps>(), {
  size: 'default',
  type: 'primary',
  debounce: 300
})

const emit = defineEmits<EnhancedButtonEmits>()

// 状态管理
const isLoading = ref(false)
const lastClickTime = ref(0)

// 计算属性
const buttonProps = computed(() => {
  const { text, prefixIcon, suffixIcon, loading, loadingText, badge, permission, debounce, confirm, asyncHandler, ...rest } = props
  return rest
})

const buttonClasses = computed(() => {
  return [
    'enhanced-button',
    {
      'has-badge': props.badge,
      'is-loading': isLoading.value || props.loading
    }
  ]
})

const isDisabled = computed(() => {
  return props.disabled || isLoading.value || !hasPermission.value
})

// 权限检查
const hasPermission = computed(() => {
  if (!props.permission) return true
  
  // 这里应该调用实际的权限检查逻辑
  return checkPermission(props.permission)
})

// 权限检查函数（示例）
function checkPermission(permission: string | string[]): boolean {
  // 实际实现中应该从用户权限中检查
  const userPermissions = ['read', 'write', 'delete'] // 示例权限
  
  if (Array.isArray(permission)) {
    return permission.some(p => userPermissions.includes(p))
  }
  
  return userPermissions.includes(permission)
}

// 防抖处理
function debounceClick(callback: Function): void {
  const now = Date.now()
  if (now - lastClickTime.value < props.debounce) {
    return
  }
  lastClickTime.value = now
  callback()
}

// 确认对话框
async function showConfirm(): Promise<boolean> {
  if (!props.confirm) return true
  
  try {
    // 这里应该调用实际的确认对话框
    const { ElMessageBox } = await import('element-plus')
    
    await ElMessageBox.confirm(
      props.confirm.message || '确定要执行此操作吗？',
      props.confirm.title,
      {
        type: props.confirm.type || 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    return true
  } catch {
    return false
  }
}

// 处理异步操作
async function handleAsyncOperation(): Promise<void> {
  if (!props.asyncHandler) return
  
  isLoading.value = true
  emit('asyncStart')
  
  try {
    const result = await props.asyncHandler()
    emit('asyncSuccess', result)
  } catch (error) {
    emit('asyncError', error)
    console.error('Async operation failed:', error)
  } finally {
    isLoading.value = false
    emit('asyncComplete')
  }
}

// 点击处理
async function handleClick(event: MouseEvent): Promise<void> {
  debounceClick(async () => {
    // 权限检查
    if (!hasPermission.value) {
      console.warn('No permission to perform this action')
      return
    }
    
    // 确认检查
    if (props.confirm) {
      const confirmed = await showConfirm()
      if (!confirmed) return
    }
    
    // 发射点击事件
    emit('click', event)
    
    // 处理异步操作
    if (props.asyncHandler) {
      await handleAsyncOperation()
    }
  })
}

// 监听加载状态变化
watch(() => props.loading, (newVal) => {
  if (newVal !== undefined) {
    isLoading.value = newVal
  }
})
</script>

<style lang="scss" scoped>
.enhanced-button {
  position: relative;
  
  .prefix-icon,
  .suffix-icon {
    margin: 0 4px;
  }
  
  .button-badge {
    position: absolute;
    top: -8px;
    right: -8px;
  }
  
  &.is-loading {
    pointer-events: none;
    
    .is-loading {
      animation: rotating 2s linear infinite;
    }
  }
  
  &.has-badge {
    margin-right: 8px;
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
```

#### 2.2 高级数据表格组件

```vue
<!-- AdvancedTable.vue -->
<template>
  <div class="advanced-table">
    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <!-- 批量操作 -->
        <el-dropdown
          v-if="batchActions.length > 0 && selectedRows.length > 0"
          @command="handleBatchAction"
        >
          <el-button type="primary">
            批量操作 ({{ selectedRows.length }})
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="action in batchActions"
                :key="action.key"
                :command="action.key"
                :disabled="action.disabled"
              >
                <el-icon v-if="action.icon">
                  <component :is="action.icon" />
                </el-icon>
                {{ action.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 自定义工具栏按钮 -->
        <slot name="toolbar-left" :selected-rows="selectedRows" />
      </div>
      
      <div class="toolbar-right">
        <!-- 搜索框 -->
        <el-input
          v-if="searchable"
          v-model="searchKeyword"
          placeholder="搜索..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
        
        <!-- 列设置 -->
        <el-popover
          v-if="columnSettable"
          placement="bottom-end"
          :width="300"
          trigger="click"
        >
          <template #reference>
            <el-button :icon="Setting" circle />
          </template>
          
          <div class="column-settings">
            <div class="settings-header">
              <span>列设置</span>
              <el-button
                type="text"
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
                class="column-item"
              >
                <el-checkbox :label="column.prop">
                  {{ column.label }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-popover>
        
        <!-- 刷新按钮 -->
        <el-button
          v-if="refreshable"
          :icon="Refresh"
          :loading="loading"
          circle
          @click="handleRefresh"
        />
        
        <!-- 自定义工具栏按钮 -->
        <slot name="toolbar-right" :selected-rows="selectedRows" />
      </div>
    </div>
    
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="tableProps"
      :data="filteredData"
      :loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      class="main-table"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="selectable"
        type="selection"
        width="55"
        :selectable="selectableFunction"
      />
      
      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="80"
        :index="indexMethod"
      />
      
      <!-- 动态列 -->
      <template v-for="column in displayColumns" :key="column.prop">
        <el-table-column
          v-bind="column"
          :show-overflow-tooltip="column.showOverflowTooltip ?? true"
        >
          <!-- 自定义列头 -->
          <template v-if="column.headerSlot" #header="scope">
            <slot :name="`header-${column.prop}`" v-bind="scope">
              {{ column.label }}
            </slot>
          </template>
          
          <!-- 自定义列内容 -->
          <template #default="scope">
            <slot
              v-if="column.slot"
              :name="column.prop"
              v-bind="scope"
            >
              {{ getCellValue(scope.row, column.prop) }}
            </slot>
            
            <!-- 默认渲染 -->
            <template v-else>
              <component
                v-if="column.component"
                :is="column.component"
                v-bind="column.componentProps"
                :value="getCellValue(scope.row, column.prop)"
                :row="scope.row"
                :column="column"
                :index="scope.$index"
              />
              
              <span v-else>
                {{ formatCellValue(scope.row, column) }}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
      
      <!-- 操作列 -->
      <el-table-column
        v-if="actions.length > 0"
        label="操作"
        :width="actionColumnWidth"
        fixed="right"
      >
        <template #default="scope">
          <div class="action-buttons">
            <template v-for="action in getRowActions(scope.row)" :key="action.key">
              <el-button
                v-if="action.type === 'button'"
                :type="action.buttonType || 'text'"
                :size="action.size || 'small'"
                :disabled="action.disabled"
                @click="handleAction(action, scope.row, scope.$index)"
              >
                <el-icon v-if="action.icon">
                  <component :is="action.icon" />
                </el-icon>
                {{ action.label }}
              </el-button>
              
              <el-dropdown
                v-else-if="action.type === 'dropdown'"
                @command="(command) => handleAction(command, scope.row, scope.$index)"
              >
                <el-button type="text" size="small">
                  {{ action.label }}
                  <el-icon><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in action.items"
                      :key="item.key"
                      :command="item"
                      :disabled="item.disabled"
                    >
                      <el-icon v-if="item.icon">
                        <component :is="item.icon" />
                      </el-icon>
                      {{ item.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页器 -->
    <div v-if="pagination" class="table-pagination">
      <el-pagination
        v-bind="paginationProps"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElTable, ElTableColumn, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElInput, ElPopover, ElCheckbox, ElCheckboxGroup, ElPagination, ElIcon } from 'element-plus'
import { ArrowDown, Search, Setting, Refresh } from '@element-plus/icons-vue'

// 类型定义
interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  sortable?: boolean | 'custom'
  filterable?: boolean
  filters?: Array<{ text: string; value: any }>
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  showOverflowTooltip?: boolean
  slot?: boolean
  headerSlot?: boolean
  component?: any
  componentProps?: Record<string, any>
}

interface TableAction {
  key: string
  label: string
  type: 'button' | 'dropdown'
  icon?: any
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  disabled?: boolean | ((row: any) => boolean)
  visible?: boolean | ((row: any) => boolean)
  items?: TableAction[] // for dropdown
  handler?: (row: any, index: number) => void
}

interface BatchAction {
  key: string
  label: string
  icon?: any
  disabled?: boolean
  handler?: (rows: any[]) => void
}

// 属性定义
interface AdvancedTableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  
  // 表格配置
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  
  // 功能配置
  selectable?: boolean
  selectableFunction?: (row: any, index: number) => boolean
  showIndex?: boolean
  indexMethod?: (index: number) => number
  
  // 工具栏配置
  showToolbar?: boolean
  searchable?: boolean
  columnSettable?: boolean
  refreshable?: boolean
  
  // 操作配置
  actions?: TableAction[]
  batchActions?: BatchAction[]
  actionColumnWidth?: string | number
  
  // 分页配置
  pagination?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  
  // 其他配置
  emptyText?: string
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
}

// 事件定义
interface AdvancedTableEmits {
  'selection-change': [selection: any[]]
  'sort-change': [{ column: any; prop: string; order: string }]
  'filter-change': [filters: Record<string, any>]
  'current-change': [currentPage: number]
  'size-change': [pageSize: number]
  'refresh': []
  'search': [keyword: string]
  'action': [action: TableAction, row: any, index: number]
  'batch-action': [action: BatchAction, rows: any[]]
}

const props = withDefaults(defineProps<AdvancedTableProps>(), {
  loading: false,
  stripe: true,
  border: true,
  size: 'default',
  selectable: false,
  showIndex: false,
  showToolbar: true,
  searchable: true,
  columnSettable: true,
  refreshable: true,
  actions: () => [],
  batchActions: () => [],
  actionColumnWidth: 150,
  pagination: true,
  currentPage: 1,
  pageSize: 20,
  total: 0,
  pageSizes: () => [10, 20, 50, 100],
  emptyText: '暂无数据'
})

const emit = defineEmits<AdvancedTableEmits>()

// 引用
const tableRef = ref<InstanceType<typeof ElTable>>()

// 状态管理
const selectedRows = ref<any[]>([])
const searchKeyword = ref('')
const visibleColumns = ref<string[]>([])
const allColumns = ref<TableColumn[]>([])
const sortConfig = ref<{ prop: string; order: string } | null>(null)
const filterConfig = ref<Record<string, any>>({})

// 计算属性
const tableProps = computed(() => {
  const { data, columns, actions, batchActions, showToolbar, searchable, columnSettable, refreshable, pagination, ...rest } = props
  return rest
})

const paginationProps = computed(() => {
  return {
    background: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: props.pageSizes
  }
})

const displayColumns = computed(() => {
  return allColumns.value.filter(column => 
    visibleColumns.value.includes(column.prop)
  )
})

const filteredData = computed(() => {
  let result = [...props.data]
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(keyword)
      )
    })
  }
  
  // 列过滤
  Object.entries(filterConfig.value).forEach(([prop, values]) => {
    if (values && values.length > 0) {
      result = result.filter(row => values.includes(row[prop]))
    }
  })
  
  // 排序
  if (sortConfig.value) {
    const { prop, order } = sortConfig.value
    result.sort((a, b) => {
      const aVal = getCellValue(a, prop)
      const bVal = getCellValue(b, prop)
      
      if (order === 'ascending') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  return result
})

// 初始化
function initialize(): void {
  allColumns.value = [...props.columns]
  visibleColumns.value = props.columns.map(col => col.prop)
  
  if (props.defaultSort) {
    sortConfig.value = props.defaultSort
  }
}

// 获取单元格值
function getCellValue(row: any, prop: string): any {
  return prop.split('.').reduce((obj, key) => obj?.[key], row)
}

// 格式化单元格值
function formatCellValue(row: any, column: TableColumn): string {
  const value = getCellValue(row, column.prop)
  
  if (column.formatter) {
    return column.formatter(row, column, value, 0)
  }
  
  return String(value ?? '')
}

// 获取行操作
function getRowActions(row: any): TableAction[] {
  return props.actions.filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(row)
    }
    return action.visible !== false
  })
}

// 事件处理
function handleSelectionChange(selection: any[]): void {
  selectedRows.value = selection
  emit('selection-change', selection)
}

function handleSortChange({ column, prop, order }: any): void {
  sortConfig.value = order ? { prop, order } : null
  emit('sort-change', { column, prop, order })
}

function handleFilterChange(filters: Record<string, any>): void {
  filterConfig.value = filters
  emit('filter-change', filters)
}

function handleCurrentChange(currentPage: number): void {
  emit('current-change', currentPage)
}

function handleSizeChange(pageSize: number): void {
  emit('size-change', pageSize)
}

function handleRefresh(): void {
  emit('refresh')
}

function handleSearch(): void {
  emit('search', searchKeyword.value)
}

function handleAction(action: TableAction, row: any, index: number): void {
  if (action.handler) {
    action.handler(row, index)
  }
  emit('action', action, row, index)
}

function handleBatchAction(actionKey: string): void {
  const action = props.batchActions.find(a => a.key === actionKey)
  if (action) {
    if (action.handler) {
      action.handler(selectedRows.value)
    }
    emit('batch-action', action, selectedRows.value)
  }
}

function resetColumns(): void {
  visibleColumns.value = allColumns.value.map(col => col.prop)
}

// 公开方法
function clearSelection(): void {
  tableRef.value?.clearSelection()
}

function toggleRowSelection(row: any, selected?: boolean): void {
  tableRef.value?.toggleRowSelection(row, selected)
}

function toggleAllSelection(): void {
  tableRef.value?.toggleAllSelection()
}

function setCurrentRow(row: any): void {
  tableRef.value?.setCurrentRow(row)
}

function sort(prop: string, order: string): void {
  tableRef.value?.sort(prop, order)
}

// 暴露方法
defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  sort,
  tableRef
})

// 初始化
initialize()

// 监听列变化
watch(() => props.columns, () => {
  initialize()
}, { deep: true })
</script>

<style lang="scss" scoped>
.advanced-table {
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .search-input {
      width: 200px;
    }
  }
  
  .main-table {
    .action-buttons {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }
  
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
  
  .column-settings {
    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--el-border-color-lighter);
    }
    
    .column-item {
      margin-bottom: 8px;
    }
  }
}
</style>
```

### 3. 组件库构建与发布

#### 3.1 构建配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      tsConfigFilePath: './tsconfig.json'
    })
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyComponentLibrary',
      fileName: (format) => `my-component-library.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    },
    
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue'
      ],
      
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@element-plus/icons-vue': 'ElementPlusIconsVue'
        },
        
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'my-component-library.css'
          }
          return assetInfo.name
        }
      }
    },
    
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

```json
// package.json
{
  "name": "my-component-library",
  "version": "1.0.0",
  "description": "基于 Element Plus 的企业级组件库",
  "main": "dist/my-component-library.cjs.js",
  "module": "dist/my-component-library.es.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "exports": {
    ".": {
      "import": "./dist/my-component-library.es.js",
      "require": "./dist/my-component-library.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./dist/style.css": "./dist/my-component-library.css"
  },
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "build:docs": "vitepress build docs",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .vue,.js,.ts",
    "lint:fix": "eslint src --ext .vue,.js,.ts --fix",
    "type-check": "vue-tsc --noEmit",
    "release": "npm run build && npm publish",
    "prepublishOnly": "npm run build && npm run test"
  },
  "peerDependencies": {
    "vue": "^3.3.0",
    "element-plus": "^2.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.4.0",
    "@vue/tsconfig": "^0.4.0",
    "typescript": "^5.2.0",
    "vite": "^4.4.0",
    "vite-plugin-dts": "^3.6.0",
    "vue-tsc": "^1.8.0",
    "vitest": "^0.34.0",
    "@vitest/coverage-v8": "^0.34.0",
    "eslint": "^8.50.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint-plugin-vue": "^9.17.0"
  },
  "keywords": [
    "vue",
    "vue3",
    "element-plus",
    "component-library",
    "ui",
    "typescript"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-component-library.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/my-component-library/issues"
  },
  "homepage": "https://github.com/your-username/my-component-library#readme"
}
```

#### 3.2 自动化发布流程

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build library
        run: npm run build
      
      - name: Build documentation
        run: npm run build:docs
      
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
      
      - name: Deploy documentation
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
```

## 实践练习

### 练习 1：创建增强型组件

1. 基于 ElButton 创建增强型按钮组件
2. 添加权限控制、防抖、确认等功能
3. 实现异步操作处理
4. 编写完整的类型定义

### 练习 2：开发高级表格组件

1. 基于 ElTable 创建高级表格组件
2. 实现搜索、筛选、排序功能
3. 添加批量操作和行操作
4. 支持列设置和数据导出

### 练习 3：构建组件库

1. 搭建组件库项目结构
2. 配置构建和打包流程
3. 实现自动化测试和发布
4. 编写组件文档和使用指南

## 学习资源

* [Vue 3 组件开发指南](https://vuejs.org/guide/components/)
* [Element Plus 源码分析](https://github.com/element-plus/element-plus)
* [Vite 构建工具](https://vitejs.dev/)
* [组件库设计模式](https://component-driven.org/)

## 作业

1. 完成所有实践练习
2. 设计并实现一个完整的组件库
3. 编写组件库的使用文档
4. 分析组件库的性能优化策略

## 下一步学习计划

接下来我们将学习 **Element Plus 性能监控与分析**，了解如何监控和分析 Element Plus 应用的性能，实现性能优化和问题诊断。