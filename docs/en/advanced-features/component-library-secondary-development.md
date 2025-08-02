# Day 73: Element Plus Component Library Secondary Development

## Learning Objectives

* Master component library secondary development techniques based on Element Plus
* Learn best practices for component extension and enhancement
* Understand component library packaging, publishing, and version management
* Implement enterprise-level component library construction and maintenance

## Knowledge Overview

### 1. Component Library Architecture Design

#### 1.1 Component Library Basic Architecture

```typescript
// Component library configuration interface
interface ComponentLibraryConfig {
  name: string
  version: string
  description: string
  author: string
  license: string
  repository: string
  
  // Build configuration
  build: {
    entry: string
    output: string
    formats: ('es' | 'cjs' | 'umd')[]
    external: string[]
    globals: Record<string, string>
  }
  
  // Component configuration
  components: {
    prefix: string
    namespace: string
    stylePrefix: string
    iconPrefix: string
  }
  
  // Theme configuration
  theme: {
    primary: string
    variables: Record<string, string>
    darkMode: boolean
  }
  
  // Documentation configuration
  docs: {
    title: string
    description: string
    logo: string
    favicon: string
    baseUrl: string
  }
}

// Component library manager
class ComponentLibraryManager {
  private config: ComponentLibraryConfig
  private components: Map<string, ComponentDefinition> = new Map()
  private themes: Map<string, ThemeDefinition> = new Map()
  private plugins: Map<string, PluginDefinition> = new Map()
  
  constructor(config: ComponentLibraryConfig) {
    this.config = config
    this.initializeLibrary()
  }
  
  // Initialize component library
  private initializeLibrary(): void {
    this.loadBaseComponents()
    this.loadCustomComponents()
    this.loadThemes()
    this.setupGlobalConfig()
  }
  
  // Load base components (Element Plus)
  private loadBaseComponents(): void {
    // Import base components from Element Plus
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
  
  // Load custom components
  private loadCustomComponents(): void {
    // Scan custom component directory
    const customComponents = this.scanCustomComponents()
    
    customComponents.forEach(component => {
      this.registerComponent(component)
    })
  }
  
  // Scan custom components
  private scanCustomComponents(): ComponentDefinition[] {
    // In actual implementation, would scan the file system
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
  
  // Register component
  registerComponent(definition: ComponentDefinition): void {
    this.components.set(definition.name, definition)
    console.log(`Component '${definition.name}' registered successfully`)
  }
  
  // Get component definition
  getComponent(name: string): ComponentDefinition | undefined {
    return this.components.get(name)
  }
  
  // Get all components
  getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }
  
  // Register theme
  registerTheme(name: string, theme: ThemeDefinition): void {
    this.themes.set(name, theme)
  }
  
  // Register plugin
  registerPlugin(name: string, plugin: PluginDefinition): void {
    this.plugins.set(name, plugin)
  }
  
  // Setup global configuration
  private setupGlobalConfig(): void {
    // Set global style variables
    const root = document.documentElement
    Object.entries(this.config.theme.variables).forEach(([key, value]) => {
      root.style.setProperty(`--${this.config.components.stylePrefix}-${key}`, value)
    })
  }
  
  // Build component library
  async build(): Promise<void> {
    console.log('Building component library...')
    
    // Generate component index
    await this.generateComponentIndex()
    
    // Generate type definitions
    await this.generateTypeDefinitions()
    
    // Generate style files
    await this.generateStyleFiles()
    
    // Generate documentation
    await this.generateDocumentation()
    
    console.log('Component library built successfully')
  }
  
  // Generate component index
  private async generateComponentIndex(): Promise<void> {
    const components = this.getAllComponents()
    const indexContent = this.generateIndexContent(components)
    
    // Write to file (in actual implementation)
    console.log('Generated component index:', indexContent)
  }
  
  // Generate index content
  private generateIndexContent(components: ComponentDefinition[]): string {
    const imports = components.map(comp => 
      `export { default as ${comp.name} } from '${comp.path}'`
    ).join('\n')
    
    const exports = components.map(comp => comp.name).join(', ')
    
    return `${imports}\n\nexport { ${exports} }`
  }
  
  // Generate type definitions
  private async generateTypeDefinitions(): Promise<void> {
    const components = this.getAllComponents()
    const typeContent = this.generateTypeContent(components)
    
    console.log('Generated type definitions:', typeContent)
  }
  
  // Generate type content
  private generateTypeContent(components: ComponentDefinition[]): string {
    return components.map(comp => {
      return `declare module '${this.config.name}' {
  export const ${comp.name}: any
}`
    }).join('\n\n')
  }
  
  // Generate style files
  private async generateStyleFiles(): Promise<void> {
    const styleContent = this.generateStyleContent()
    console.log('Generated style files:', styleContent)
  }
  
  // Generate style content
  private generateStyleContent(): string {
    const prefix = this.config.components.stylePrefix
    const variables = Object.entries(this.config.theme.variables)
      .map(([key, value]) => `  --${prefix}-${key}: ${value};`)
      .join('\n')
    
    return `:root {\n${variables}\n}`
  }
  
  // Generate documentation
  private async generateDocumentation(): Promise<void> {
    const components = this.getAllComponents()
    const docContent = this.generateDocContent(components)
    
    console.log('Generated documentation:', docContent)
  }
  
  // Generate documentation content
  private generateDocContent(components: ComponentDefinition[]): string {
    return components.map(comp => {
      return `## ${comp.name}\n\n${comp.description || 'No description available'}\n`
    }).join('\n')
  }
}

// Component definition interface
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

// Theme definition interface
interface ThemeDefinition {
  name: string
  variables: Record<string, string>
  colors: Record<string, string>
  fonts: Record<string, string>
  spacing: Record<string, string>
}

// Plugin definition interface
interface PluginDefinition {
  name: string
  version: string
  install: (app: any, options?: any) => void
  dependencies?: string[]
}
```

#### 1.2 Component Extension Base Class

```typescript
// Component extension base class
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
  
  // Initialize extension
  protected abstract initialize(): void
  
  // Extend properties
  protected abstract extendProps(): Record<string, any>
  
  // Extend events
  protected abstract extendEvents(): Record<string, Function>
  
  // Extend slots
  protected abstract extendSlots(): Record<string, any>
  
  // Extend methods
  protected abstract extendMethods(): Record<string, Function>
  
  // Generate extended component
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
        // Call base component's setup
        const baseSetup = this.baseComponent.setup?.(props, { emit, slots, expose })
        
        // Extend functionality
        const extensions = this.setupExtensions(props, emit, slots)
        
        // Merge and return
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
  
  // Get component name
  protected abstract getComponentName(): string
  
  // Setup extensions
  protected abstract setupExtensions(props: any, emit: Function, slots: any): any
  
  // Render component
  protected abstract renderComponent(): any
  
  // Emit event
  protected emit(event: string, ...args: any[]): void {
    this.eventBus.emit(event, ...args)
  }
  
  // Listen to event
  protected on(event: string, callback: Function): void {
    this.eventBus.on(event, callback)
  }
}

// Event emitter
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

### 2. Component Extension Practice

#### 2.1 Enhanced Button Component

```vue
<!-- EnhancedButton.vue -->
<template>
  <el-button
    v-bind="buttonProps"
    :class="buttonClasses"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <!-- Loading state -->
    <template v-if="loading">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
      <span v-if="loadingText">{{ loadingText }}</span>
    </template>
    
    <!-- Normal state -->
    <template v-else>
      <!-- Prefix icon -->
      <el-icon v-if="prefixIcon" class="prefix-icon">
        <component :is="prefixIcon" />
      </el-icon>
      
      <!-- Button content -->
      <slot>
        {{ text }}
      </slot>
      
      <!-- Suffix icon -->
      <el-icon v-if="suffixIcon" class="suffix-icon">
        <component :is="suffixIcon" />
      </el-icon>
      
      <!-- Badge -->
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

// Props definition
interface EnhancedButtonProps {
  // Inherit all ElButton props
  size?: 'large' | 'default' | 'small'
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  
  // Extended props
  text?: string
  prefixIcon?: string | Component
  suffixIcon?: string | Component
  loading?: boolean
  loadingText?: string
  
  // Badge configuration
  badge?: {
    value: string | number
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    isDot?: boolean
  }
  
  // Permission control
  permission?: string | string[]
  
  // Debounce configuration
  debounce?: number
  
  // Confirmation configuration
  confirm?: {
    title: string
    message?: string
    type?: 'warning' | 'info' | 'success' | 'error'
  }
  
  // Async operation
  asyncHandler?: () => Promise<any>
}

// Events definition
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

// State management
const isLoading = ref(false)
const lastClickTime = ref(0)

// Computed properties
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

// Permission check
const hasPermission = computed(() => {
  if (!props.permission) return true
  
  // This should call the actual permission check logic
  return checkPermission(props.permission)
})

// Permission check function (example)
function checkPermission(permission: string | string[]): boolean {
  // In actual implementation, should check from user permissions
  const userPermissions = ['read', 'write', 'delete'] // Example permissions
  
  if (Array.isArray(permission)) {
    return permission.some(p => userPermissions.includes(p))
  }
  
  return userPermissions.includes(permission)
}

// Debounce handling
function debounceClick(callback: Function): void {
  const now = Date.now()
  if (now - lastClickTime.value < props.debounce) {
    return
  }
  lastClickTime.value = now
  callback()
}

// Confirmation dialog
async function showConfirm(): Promise<boolean> {
  if (!props.confirm) return true
  
  try {
    // This should call the actual confirmation dialog
    const { ElMessageBox } = await import('element-plus')
    
    await ElMessageBox.confirm(
      props.confirm.message || 'Are you sure you want to perform this action?',
      props.confirm.title,
      {
        type: props.confirm.type || 'warning',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }
    )
    
    return true
  } catch {
    return false
  }
}

// Handle async operation
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

// Click handling
async function handleClick(event: MouseEvent): Promise<void> {
  debounceClick(async () => {
    // Permission check
    if (!hasPermission.value) {
      console.warn('No permission to perform this action')
      return
    }
    
    // Confirmation check
    if (props.confirm) {
      const confirmed = await showConfirm()
      if (!confirmed) return
    }
    
    // Emit click event
    emit('click', event)
    
    // Handle async operation
    if (props.asyncHandler) {
      await handleAsyncOperation()
    }
  })
}

// Watch loading state changes
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

#### 2.2 Advanced Data Table Component

```vue
<!-- AdvancedTable.vue -->
<template>
  <div class="advanced-table">
    <!-- Table toolbar -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <!-- Batch operations -->
        <el-dropdown
          v-if="batchActions.length > 0 && selectedRows.length > 0"
          @command="handleBatchAction"
        >
          <el-button type="primary">
            Batch Actions ({{ selectedRows.length }})
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
        
        <!-- Custom toolbar buttons -->
        <slot name="toolbar-left" :selected-rows="selectedRows" />
      </div>
      
      <div class="toolbar-right">
        <!-- Search box -->
        <el-input
          v-if="searchable"
          v-model="searchKeyword"
          placeholder="Search..."
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
          class="search-input"
        />
        
        <!-- Column settings -->
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
              <span>Column Settings</span>
              <el-button
                type="text"
                size="small"
                @click="resetColumns"
              >
                Reset
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
        
        <!-- Refresh button -->
        <el-button
          v-if="refreshable"
          :icon="Refresh"
          :loading="loading"
          circle
          @click="handleRefresh"
        />
        
        <!-- Custom toolbar buttons -->
        <slot name="toolbar-right" :selected-rows="selectedRows" />
      </div>
    </div>
    
    <!-- Table body -->
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
        label="Index"
        width="80"
        :index="indexMethod"
      />
      
      <!-- Dynamic columns -->
      <template v-for="column in displayColumns" :key="column.prop">
        <el-table-column
          v-bind="column"
          :show-overflow-tooltip="column.showOverflowTooltip ?? true"
        >
          <!-- Custom column header -->
          <template v-if="column.headerSlot" #header="scope">
            <slot :name="`header-${column.prop}`" v-bind="scope">
              {{ column.label }}
            </slot>
          </template>
          
          <!-- Custom column content -->
          <template #default="scope">
            <slot
              v-if="column.slot"
              :name="column.prop"
              v-bind="scope"
            >
              {{ getCellValue(scope.row, column.prop) }}
            </slot>
            
            <!-- Default rendering -->
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
      
      <!-- Action column -->
      <el-table-column
        v-if="actions.length > 0"
        label="Actions"
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
    
    <!-- Pagination -->
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

// Type definitions
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

// Props definition
interface AdvancedTableProps {
  data: any[]
  columns: TableColumn[]
  loading?: boolean
  
  // Table configuration
  height?: string | number
  maxHeight?: string | number
  stripe?: boolean
  border?: boolean
  size?: 'large' | 'default' | 'small'
  
  // Feature configuration
  selectable?: boolean
  selectableFunction?: (row: any, index: number) => boolean
  showIndex?: boolean
  indexMethod?: (index: number) => number
  
  // Toolbar configuration
  showToolbar?: boolean
  searchable?: boolean
  columnSettable?: boolean
  refreshable?: boolean
  
  // Action configuration
  actions?: TableAction[]
  batchActions?: BatchAction[]
  actionColumnWidth?: string | number
  
  // Pagination configuration
  pagination?: boolean
  currentPage?: number
  pageSize?: number
  total?: number
  pageSizes?: number[]
  
  // Other configuration
  emptyText?: string
  defaultSort?: { prop: string; order: 'ascending' | 'descending' }
}

// Events definition
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
  emptyText: 'No Data'
})

const emit = defineEmits<AdvancedTableEmits>()

// References
const tableRef = ref<InstanceType<typeof ElTable>>()

// State management
const selectedRows = ref<any[]>([])
const searchKeyword = ref('')
const visibleColumns = ref<string[]>([])
const allColumns = ref<TableColumn[]>([])
const sortConfig = ref<{ prop: string; order: string } | null>(null)
const filterConfig = ref<Record<string, any>>({})

// Computed properties
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
  
  // Search filtering
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(keyword)
      )
    })
  }
  
  // Column filtering
  Object.entries(filterConfig.value).forEach(([prop, values]) => {
    if (values && values.length > 0) {
      result = result.filter(row => values.includes(row[prop]))
    }
  })
  
  // Sorting
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

// Initialization
function initialize(): void {
  allColumns.value = [...props.columns]
  visibleColumns.value = props.columns.map(col => col.prop)
  
  if (props.defaultSort) {
    sortConfig.value = props.defaultSort
  }
}

// Get cell value
function getCellValue(row: any, prop: string): any {
  return prop.split('.').reduce((obj, key) => obj?.[key], row)
}

// Format cell value
function formatCellValue(row: any, column: TableColumn): string {
  const value = getCellValue(row, column.prop)
  
  if (column.formatter) {
    return column.formatter(row, column, value, 0)
  }
  
  return String(value ?? '')
}

// Get row actions
function getRowActions(row: any): TableAction[] {
  return props.actions.filter(action => {
    if (typeof action.visible === 'function') {
      return action.visible(row)
    }
    return action.visible !== false
  })
}

// Event handling
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

// Public methods
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

// Expose methods
defineExpose({
  clearSelection,
  toggleRowSelection,
  toggleAllSelection,
  setCurrentRow,
  sort,
  tableRef
})

// Initialize
initialize()

// Watch column changes
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

### 3. Component Library Build and Publishing

#### 3.1 Build Configuration

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
  "description": "Enterprise-level component library based on Element Plus",
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

#### 3.2 Automated Publishing Workflow

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

## Practical Exercises

### Exercise 1: Create Enhanced Components

1. Create an enhanced button component based on ElButton
2. Add permission control, debounce, confirmation, and other features
3. Implement async operation handling
4. Write complete type definitions

### Exercise 2: Develop Advanced Table Component

1. Create an advanced table component based on ElTable
2. Implement search, filter, and sort functionality
3. Add batch operations and row actions
4. Support column settings and data export

### Exercise 3: Build Component Library

1. Set up component library project structure
2. Configure build and packaging process
3. Implement automated testing and publishing
4. Write component documentation and usage guides

## Learning Resources

* [Vue 3 Component Development Guide](https://vuejs.org/guide/components/)
* [Element Plus Source Code Analysis](https://github.com/element-plus/element-plus)
* [Vite Build Tool](https://vitejs.dev/)
* [Component Library Design Patterns](https://component-driven.org/)

## Assignments

1. Complete all practical exercises
2. Design and implement a complete component library
3. Write usage documentation for the component library
4. Analyze component library performance optimization strategies

## Next Learning Plan

Next, we will learn about **Element Plus Performance Monitoring and Analysis**, understanding how to monitor and analyze the performance of Element Plus applications, implementing performance optimization and problem diagnosis.
