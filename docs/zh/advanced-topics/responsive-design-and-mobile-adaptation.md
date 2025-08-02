# 第45天：Element Plus 响应式设计与移动端适配

## 学习目标

今天我们将深入学习 Element Plus 的响应式设计与移动端适配，掌握如何构建适配多种设备的现代化界面。

- 理解响应式设计原理和断点系统
- 掌握 Element Plus 移动端组件适配
- 学习触摸交互优化技术
- 实现跨平台兼容性方案
- 掌握移动端性能优化策略

## 1. 响应式设计系统

### 1.1 响应式设计架构

```typescript
// responsive-system.ts
export interface BreakpointConfig {
  name: string
  minWidth: number
  maxWidth?: number
  columns: number
  gutter: number
  margin: number
}

export interface ResponsiveConfig {
  breakpoints: BreakpointConfig[]
  defaultBreakpoint: string
  enableTouch: boolean
  enableGestures: boolean
}

export class ResponsiveSystem {
  private config: ResponsiveConfig
  private currentBreakpoint: string = ''
  private mediaQueries: Map<string, MediaQueryList> = new Map()
  private listeners: Map<string, Set<(matches: boolean) => void>> = new Map()
  
  constructor(config: ResponsiveConfig) {
    this.config = config
    this.initializeMediaQueries()
    this.detectCurrentBreakpoint()
  }
  
  private initializeMediaQueries(): void {
    this.config.breakpoints.forEach(breakpoint => {
      const query = this.createMediaQuery(breakpoint)
      const mediaQuery = window.matchMedia(query)
      
      this.mediaQueries.set(breakpoint.name, mediaQuery)
      this.listeners.set(breakpoint.name, new Set())
      
      mediaQuery.addEventListener('change', (e) => {
        this.handleBreakpointChange(breakpoint.name, e.matches)
      })
    })
  }
  
  private createMediaQuery(breakpoint: BreakpointConfig): string {
    let query = `(min-width: ${breakpoint.minWidth}px)`
    
    if (breakpoint.maxWidth) {
      query += ` and (max-width: ${breakpoint.maxWidth}px)`
    }
    
    return query
  }
  
  private detectCurrentBreakpoint(): void {
    for (const breakpoint of this.config.breakpoints) {
      const mediaQuery = this.mediaQueries.get(breakpoint.name)
      if (mediaQuery?.matches) {
        this.currentBreakpoint = breakpoint.name
        break
      }
    }
    
    if (!this.currentBreakpoint) {
      this.currentBreakpoint = this.config.defaultBreakpoint
    }
  }
  
  private handleBreakpointChange(breakpoint: string, matches: boolean): void {
    if (matches) {
      this.currentBreakpoint = breakpoint
    }
    
    const listeners = this.listeners.get(breakpoint)
    if (listeners) {
      listeners.forEach(listener => listener(matches))
    }
  }
  
  public getCurrentBreakpoint(): string {
    return this.currentBreakpoint
  }
  
  public getBreakpointConfig(name?: string): BreakpointConfig | undefined {
    const breakpointName = name || this.currentBreakpoint
    return this.config.breakpoints.find(bp => bp.name === breakpointName)
  }
  
  public isBreakpointActive(breakpoint: string): boolean {
    const mediaQuery = this.mediaQueries.get(breakpoint)
    return mediaQuery?.matches || false
  }
  
  public onBreakpointChange(
    breakpoint: string,
    callback: (matches: boolean) => void
  ): () => void {
    const listeners = this.listeners.get(breakpoint)
    if (listeners) {
      listeners.add(callback)
      
      // 返回取消监听的函数
      return () => {
        listeners.delete(callback)
      }
    }
    
    return () => {}
  }
  
  public getResponsiveValue<T>(
    values: Partial<Record<string, T>>,
    fallback: T
  ): T {
    // 按优先级查找匹配的值
    for (const breakpoint of this.config.breakpoints) {
      if (this.isBreakpointActive(breakpoint.name) && values[breakpoint.name] !== undefined) {
        return values[breakpoint.name]!
      }
    }
    
    return fallback
  }
}

// 默认配置
export const defaultResponsiveConfig: ResponsiveConfig = {
  breakpoints: [
    { name: 'xs', minWidth: 0, maxWidth: 767, columns: 1, gutter: 16, margin: 16 },
    { name: 'sm', minWidth: 768, maxWidth: 991, columns: 2, gutter: 16, margin: 24 },
    { name: 'md', minWidth: 992, maxWidth: 1199, columns: 3, gutter: 24, margin: 32 },
    { name: 'lg', minWidth: 1200, maxWidth: 1599, columns: 4, gutter: 24, margin: 32 },
    { name: 'xl', minWidth: 1600, columns: 6, gutter: 32, margin: 40 }
  ],
  defaultBreakpoint: 'md',
  enableTouch: true,
  enableGestures: true
}
```

### 1.2 响应式布局管理器

```typescript
// layout-manager.ts
export interface LayoutConfig {
  container: {
    maxWidth: Record<string, number>
    padding: Record<string, number>
  }
  grid: {
    columns: Record<string, number>
    gutter: Record<string, number>
  }
  typography: {
    fontSize: Record<string, number>
    lineHeight: Record<string, number>
  }
}

export class LayoutManager {
  private responsiveSystem: ResponsiveSystem
  private config: LayoutConfig
  private styleElement: HTMLStyleElement
  
  constructor(
    responsiveSystem: ResponsiveSystem,
    config: LayoutConfig
  ) {
    this.responsiveSystem = responsiveSystem
    this.config = config
    this.styleElement = this.createStyleElement()
    this.generateResponsiveStyles()
    this.setupBreakpointListeners()
  }
  
  private createStyleElement(): HTMLStyleElement {
    const style = document.createElement('style')
    style.id = 'element-plus-responsive-styles'
    document.head.appendChild(style)
    return style
  }
  
  private generateResponsiveStyles(): void {
    let css = ''
    
    // 生成容器样式
    css += this.generateContainerStyles()
    
    // 生成网格样式
    css += this.generateGridStyles()
    
    // 生成排版样式
    css += this.generateTypographyStyles()
    
    // 生成组件响应式样式
    css += this.generateComponentStyles()
    
    this.styleElement.textContent = css
  }
  
  private generateContainerStyles(): string {
    let css = ''
    
    Object.entries(this.config.container.maxWidth).forEach(([breakpoint, maxWidth]) => {
      const breakpointConfig = this.responsiveSystem.getBreakpointConfig(breakpoint)
      if (breakpointConfig) {
        const mediaQuery = this.createMediaQuery(breakpointConfig)
        const padding = this.config.container.padding[breakpoint] || 16
        
        css += `
          @media ${mediaQuery} {
            .el-container--responsive {
              max-width: ${maxWidth}px;
              padding-left: ${padding}px;
              padding-right: ${padding}px;
              margin-left: auto;
              margin-right: auto;
            }
          }
        `
      }
    })
    
    return css
  }
  
  private generateGridStyles(): string {
    let css = ''
    
    Object.entries(this.config.grid.columns).forEach(([breakpoint, columns]) => {
      const breakpointConfig = this.responsiveSystem.getBreakpointConfig(breakpoint)
      if (breakpointConfig) {
        const mediaQuery = this.createMediaQuery(breakpointConfig)
        const gutter = this.config.grid.gutter[breakpoint] || 16
        
        css += `
          @media ${mediaQuery} {
            .el-row--responsive {
              margin-left: -${gutter / 2}px;
              margin-right: -${gutter / 2}px;
            }
            
            .el-col--responsive {
              padding-left: ${gutter / 2}px;
              padding-right: ${gutter / 2}px;
            }
            
            .el-col--responsive.el-col-auto {
              flex: 0 0 ${100 / columns}%;
              max-width: ${100 / columns}%;
            }
          }
        `
      }
    })
    
    return css
  }
  
  private generateTypographyStyles(): string {
    let css = ''
    
    Object.entries(this.config.typography.fontSize).forEach(([breakpoint, fontSize]) => {
      const breakpointConfig = this.responsiveSystem.getBreakpointConfig(breakpoint)
      if (breakpointConfig) {
        const mediaQuery = this.createMediaQuery(breakpointConfig)
        const lineHeight = this.config.typography.lineHeight[breakpoint] || 1.5
        
        css += `
          @media ${mediaQuery} {
            .el-typography--responsive {
              font-size: ${fontSize}px;
              line-height: ${lineHeight};
            }
            
            .el-typography--responsive h1 { font-size: ${fontSize * 2.5}px; }
            .el-typography--responsive h2 { font-size: ${fontSize * 2}px; }
            .el-typography--responsive h3 { font-size: ${fontSize * 1.75}px; }
            .el-typography--responsive h4 { font-size: ${fontSize * 1.5}px; }
            .el-typography--responsive h5 { font-size: ${fontSize * 1.25}px; }
            .el-typography--responsive h6 { font-size: ${fontSize}px; }
          }
        `
      }
    })
    
    return css
  }
  
  private generateComponentStyles(): string {
    return `
      /* 移动端组件优化 */
      @media (max-width: 767px) {
        .el-dialog {
          width: 95% !important;
          margin: 0 auto;
        }
        
        .el-drawer {
          width: 100% !important;
        }
        
        .el-table {
          font-size: 12px;
        }
        
        .el-table .el-table__cell {
          padding: 8px 4px;
        }
        
        .el-form-item {
          margin-bottom: 16px;
        }
        
        .el-button {
          min-height: 44px;
          padding: 0 16px;
        }
        
        .el-input__inner {
          min-height: 44px;
          font-size: 16px;
        }
        
        .el-select .el-input__inner {
          min-height: 44px;
        }
        
        .el-date-editor .el-input__inner {
          min-height: 44px;
        }
      }
      
      /* 平板端优化 */
      @media (min-width: 768px) and (max-width: 991px) {
        .el-dialog {
          width: 80% !important;
        }
        
        .el-table {
          font-size: 13px;
        }
      }
      
      /* 触摸设备优化 */
      @media (hover: none) and (pointer: coarse) {
        .el-button:hover {
          transform: none;
        }
        
        .el-menu-item:hover {
          background-color: transparent;
        }
        
        .el-tooltip__trigger:hover .el-tooltip__popper {
          display: none;
        }
      }
    `
  }
  
  private createMediaQuery(breakpoint: BreakpointConfig): string {
    let query = `(min-width: ${breakpoint.minWidth}px)`
    
    if (breakpoint.maxWidth) {
      query += ` and (max-width: ${breakpoint.maxWidth}px)`
    }
    
    return query
  }
  
  private setupBreakpointListeners(): void {
    this.responsiveSystem.onBreakpointChange('xs', (matches) => {
      if (matches) {
        document.body.classList.add('is-mobile')
      } else {
        document.body.classList.remove('is-mobile')
      }
    })
    
    this.responsiveSystem.onBreakpointChange('sm', (matches) => {
      if (matches) {
        document.body.classList.add('is-tablet')
      } else {
        document.body.classList.remove('is-tablet')
      }
    })
  }
  
  public updateConfig(newConfig: Partial<LayoutConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.generateResponsiveStyles()
  }
  
  public destroy(): void {
    if (this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement)
    }
  }
}
```

## 2. 移动端组件适配

### 2.1 移动端表格组件

```vue
<!-- MobileTable.vue -->
<template>
  <div class="mobile-table" :class="tableClasses">
    <!-- 移动端卡片视图 -->
    <div v-if="isMobile && viewMode === 'card'" class="mobile-table__cards">
      <div
        v-for="(row, index) in data"
        :key="getRowKey(row, index)"
        class="mobile-table__card"
        @click="handleRowClick(row, index)"
      >
        <div class="card-header" v-if="showCardHeader">
          <slot name="card-header" :row="row" :index="index">
            <span class="card-title">{{ getCardTitle(row) }}</span>
          </slot>
        </div>
        
        <div class="card-content">
          <div
            v-for="column in visibleColumns"
            :key="column.prop"
            class="card-field"
          >
            <div class="field-label">{{ column.label }}</div>
            <div class="field-value">
              <slot
                :name="column.prop"
                :row="row"
                :column="column"
                :index="index"
              >
                {{ getFieldValue(row, column) }}
              </slot>
            </div>
          </div>
        </div>
        
        <div class="card-actions" v-if="showCardActions">
          <slot name="card-actions" :row="row" :index="index"></slot>
        </div>
      </div>
    </div>
    
    <!-- 移动端列表视图 -->
    <div v-else-if="isMobile && viewMode === 'list'" class="mobile-table__list">
      <div
        v-for="(row, index) in data"
        :key="getRowKey(row, index)"
        class="mobile-table__list-item"
        @click="handleRowClick(row, index)"
      >
        <div class="list-item-main">
          <div class="list-item-title">{{ getCardTitle(row) }}</div>
          <div class="list-item-subtitle">{{ getCardSubtitle(row) }}</div>
        </div>
        
        <div class="list-item-extra">
          <slot name="list-extra" :row="row" :index="index"></slot>
        </div>
      </div>
    </div>
    
    <!-- 桌面端表格视图 -->
    <el-table
      v-else
      ref="tableRef"
      :data="data"
      v-bind="$attrs"
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        v-bind="column"
      >
        <template #default="scope">
          <slot
            :name="column.prop"
            :row="scope.row"
            :column="column"
            :index="scope.$index"
          >
            {{ getFieldValue(scope.row, column) }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 视图切换器 -->
    <div v-if="showViewSwitcher" class="mobile-table__view-switcher">
      <el-radio-group v-model="viewMode" size="small">
        <el-radio-button label="table">表格</el-radio-button>
        <el-radio-button label="card">卡片</el-radio-button>
        <el-radio-button label="list">列表</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElTable, ElTableColumn, ElRadioGroup, ElRadioButton } from 'element-plus'

interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | string
  sortable?: boolean
  formatter?: (row: any, column: any, cellValue: any, index: number) => string
  showInMobile?: boolean
}

interface Props {
  data: any[]
  columns: TableColumn[]
  rowKey?: string | ((row: any) => string)
  showCardHeader?: boolean
  showCardActions?: boolean
  showViewSwitcher?: boolean
  defaultViewMode?: 'table' | 'card' | 'list'
  cardTitleField?: string
  cardSubtitleField?: string
  mobileBreakpoint?: number
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  showCardHeader: true,
  showCardActions: false,
  showViewSwitcher: true,
  defaultViewMode: 'card',
  cardTitleField: 'name',
  cardSubtitleField: 'description',
  mobileBreakpoint: 768
})

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'view-change': [mode: string]
}>()

// 响应式状态
const tableRef = ref<InstanceType<typeof ElTable>>()
const isMobile = ref(false)
const viewMode = ref(props.defaultViewMode)

// 计算属性
const tableClasses = computed(() => {
  return [
    {
      'mobile-table--mobile': isMobile.value,
      'mobile-table--desktop': !isMobile.value,
      [`mobile-table--${viewMode.value}`]: true
    }
  ]
})

const visibleColumns = computed(() => {
  return props.columns.filter(column => {
    return isMobile.value ? column.showInMobile !== false : true
  })
})

// 方法
const checkMobile = () => {
  isMobile.value = window.innerWidth < props.mobileBreakpoint
  
  // 移动端自动切换到卡片视图
  if (isMobile.value && viewMode.value === 'table') {
    viewMode.value = 'card'
  }
}

const getRowKey = (row: any, index: number): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return row[props.rowKey] || index.toString()
}

const getCardTitle = (row: any): string => {
  return row[props.cardTitleField] || ''
}

const getCardSubtitle = (row: any): string => {
  return row[props.cardSubtitleField] || ''
}

const getFieldValue = (row: any, column: TableColumn): string => {
  const value = row[column.prop]
  
  if (column.formatter) {
    return column.formatter(row, column, value, 0)
  }
  
  return value?.toString() || ''
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

// 监听视图模式变化
watch(viewMode, (newMode) => {
  emit('view-change', newMode)
})

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 暴露方法
defineExpose({
  tableRef,
  isMobile,
  viewMode,
  switchView: (mode: string) => {
    viewMode.value = mode
  }
})
</script>

<style scoped>
.mobile-table {
  width: 100%;
}

/* 卡片视图样式 */
.mobile-table__cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-table__card {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
  overflow: hidden;
  transition: all 0.3s;
}

.mobile-table__card:active {
  transform: scale(0.98);
  background: var(--el-fill-color-light);
}

.card-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
}

.card-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-size: 16px;
}

.card-content {
  padding: 16px;
}

.card-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-field:last-child {
  margin-bottom: 0;
}

.field-label {
  color: var(--el-text-color-regular);
  font-size: 14px;
  flex-shrink: 0;
  margin-right: 16px;
}

.field-value {
  color: var(--el-text-color-primary);
  font-size: 14px;
  text-align: right;
  word-break: break-all;
}

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
}

/* 列表视图样式 */
.mobile-table__list {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

.mobile-table__list-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
  transition: background-color 0.3s;
}

.mobile-table__list-item:last-child {
  border-bottom: none;
}

.mobile-table__list-item:active {
  background: var(--el-fill-color-light);
}

.list-item-main {
  flex: 1;
  min-width: 0;
}

.list-item-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-subtitle {
  font-size: 14px;
  color: var(--el-text-color-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-extra {
  flex-shrink: 0;
  margin-left: 16px;
}

/* 视图切换器样式 */
.mobile-table__view-switcher {
  margin-top: 16px;
  text-align: center;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .mobile-table__card {
    margin: 0 -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .mobile-table__card:first-child {
    border-top: none;
  }
  
  .mobile-table__list {
    margin: 0 -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .card-field {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  
  .field-label {
    margin-right: 0;
    margin-bottom: 4px;
    font-size: 12px;
  }
  
  .field-value {
    text-align: left;
    font-size: 14px;
  }
}
</style>
```

### 2.2 移动端表单组件

```vue
<!-- MobileForm.vue -->
<template>
  <div class="mobile-form" :class="formClasses">
    <el-form
      ref="formRef"
      :model="model"
      :rules="rules"
      v-bind="formProps"
    >
      <div
        v-for="(field, index) in formFields"
        :key="field.prop"
        class="mobile-form__field"
      >
        <!-- 分组标题 -->
        <div
          v-if="field.type === 'group'"
          class="mobile-form__group-title"
        >
          {{ field.label }}
        </div>
        
        <!-- 表单项 -->
        <el-form-item
          v-else
          :prop="field.prop"
          :label="field.label"
          :required="field.required"
          :class="getFieldClasses(field)"
        >
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input'"
            v-model="model[field.prop]"
            :placeholder="field.placeholder"
            :type="field.inputType || 'text'"
            :maxlength="field.maxlength"
            :show-word-limit="field.showWordLimit"
            :clearable="field.clearable !== false"
            v-bind="field.props"
          />
          
          <!-- 文本域 -->
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="model[field.prop]"
            type="textarea"
            :placeholder="field.placeholder"
            :rows="field.rows || 3"
            :maxlength="field.maxlength"
            :show-word-limit="field.showWordLimit"
            v-bind="field.props"
          />
          
          <!-- 选择器 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="model[field.prop]"
            :placeholder="field.placeholder"
            :clearable="field.clearable !== false"
            :multiple="field.multiple"
            :filterable="field.filterable"
            v-bind="field.props"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :disabled="option.disabled"
            />
          </el-select>
          
          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="model[field.prop]"
            :type="field.dateType || 'date'"
            :placeholder="field.placeholder"
            :format="field.format"
            :value-format="field.valueFormat"
            v-bind="field.props"
          />
          
          <!-- 开关 -->
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="model[field.prop]"
            :active-text="field.activeText"
            :inactive-text="field.inactiveText"
            v-bind="field.props"
          />
          
          <!-- 单选框组 -->
          <el-radio-group
            v-else-if="field.type === 'radio'"
            v-model="model[field.prop]"
            v-bind="field.props"
          >
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
          
          <!-- 复选框组 -->
          <el-checkbox-group
            v-else-if="field.type === 'checkbox'"
            v-model="model[field.prop]"
            v-bind="field.props"
          >
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :label="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
          
          <!-- 自定义字段 -->
          <slot
            v-else
            :name="field.prop"
            :field="field"
            :model="model"
            :index="index"
          >
            <div class="mobile-form__custom-field">
              自定义字段: {{ field.type }}
            </div>
          </slot>
          
          <!-- 字段描述 -->
          <div
            v-if="field.description"
            class="mobile-form__field-description"
          >
            {{ field.description }}
          </div>
        </el-form-item>
      </div>
      
      <!-- 表单操作按钮 -->
      <div v-if="showActions" class="mobile-form__actions">
        <slot name="actions" :validate="validate" :reset="resetForm">
          <el-button
            v-if="showReset"
            @click="resetForm"
            :loading="loading"
          >
            重置
          </el-button>
          <el-button
            type="primary"
            @click="validate"
            :loading="loading"
            class="mobile-form__submit-btn"
          >
            {{ submitText }}
          </el-button>
        </slot>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElSwitch,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElButton,
  type FormInstance,
  type FormRules
} from 'element-plus'

interface FormField {
  prop: string
  label: string
  type: string
  required?: boolean
  placeholder?: string
  description?: string
  options?: Array<{ label: string; value: any; disabled?: boolean }>
  props?: Record<string, any>
  // 输入框特有属性
  inputType?: string
  maxlength?: number
  showWordLimit?: boolean
  clearable?: boolean
  // 文本域特有属性
  rows?: number
  // 选择器特有属性
  multiple?: boolean
  filterable?: boolean
  // 日期选择器特有属性
  dateType?: string
  format?: string
  valueFormat?: string
  // 开关特有属性
  activeText?: string
  inactiveText?: string
}

interface Props {
  model: Record<string, any>
  fields: FormField[]
  rules?: FormRules
  loading?: boolean
  showActions?: boolean
  showReset?: boolean
  submitText?: string
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  showReset: true,
  submitText: '提交',
  labelPosition: 'top',
  labelWidth: 'auto',
  size: 'default'
})

const emit = defineEmits<{
  'submit': [valid: boolean, model: Record<string, any>]
  'reset': []
  'field-change': [prop: string, value: any]
}>()

// 响应式状态
const formRef = ref<FormInstance>()

// 计算属性
const formClasses = computed(() => {
  return [
    `mobile-form--${props.size}`,
    `mobile-form--label-${props.labelPosition}`
  ]
})

const formProps = computed(() => {
  return {
    labelPosition: props.labelPosition,
    labelWidth: props.labelWidth,
    size: props.size
  }
})

const formFields = computed(() => {
  return props.fields.filter(field => field.type !== 'hidden')
})

// 方法
const getFieldClasses = (field: FormField) => {
  return [
    `mobile-form__field--${field.type}`,
    {
      'mobile-form__field--required': field.required
    }
  ]
}

const validate = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', true, props.model)
  } catch (error) {
    emit('submit', false, props.model)
  }
}

const resetForm = () => {
  if (!formRef.value) return
  
  formRef.value.resetFields()
  emit('reset')
}

const validateField = (prop: string) => {
  if (!formRef.value) return
  
  formRef.value.validateField(prop)
}

const clearValidation = (props?: string | string[]) => {
  if (!formRef.value) return
  
  formRef.value.clearValidate(props)
}

// 监听模型变化
watch(
  () => props.model,
  (newModel, oldModel) => {
    if (newModel !== oldModel) {
      Object.keys(newModel).forEach(prop => {
        if (newModel[prop] !== oldModel?.[prop]) {
          emit('field-change', prop, newModel[prop])
        }
      })
    }
  },
  { deep: true }
)

// 暴露方法
defineExpose({
  formRef,
  validate,
  resetForm,
  validateField,
  clearValidation
})
</script>

<style scoped>
.mobile-form {
  width: 100%;
}

/* 分组标题 */
.mobile-form__group-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.mobile-form__group-title:first-child {
  margin-top: 0;
}

/* 表单字段 */
.mobile-form__field {
  margin-bottom: 0;
}

.mobile-form__field--required :deep(.el-form-item__label::before) {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}

/* 字段描述 */
.mobile-form__field-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

/* 自定义字段 */
.mobile-form__custom-field {
  padding: 12px;
  border: 1px dashed var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  color: var(--el-text-color-placeholder);
  text-align: center;
}

/* 表单操作 */
.mobile-form__actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.mobile-form__submit-btn {
  flex: 1;
  min-width: 120px;
}

/* 标签位置样式 */
.mobile-form--label-top :deep(.el-form-item) {
  margin-bottom: 20px;
}

.mobile-form--label-top :deep(.el-form-item__label) {
  padding-bottom: 8px;
  line-height: 1.4;
}

.mobile-form--label-left :deep(.el-form-item__label),
.mobile-form--label-right :deep(.el-form-item__label) {
  line-height: 40px;
}

/* 尺寸样式 */
.mobile-form--small :deep(.el-form-item) {
  margin-bottom: 16px;
}

.mobile-form--large :deep(.el-form-item) {
  margin-bottom: 24px;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .mobile-form {
    padding: 0 16px;
  }
  
  .mobile-form__actions {
    position: sticky;
    bottom: 0;
    background: var(--el-bg-color);
    padding: 16px 0;
    margin: 24px -16px 0;
    border-top: 1px solid var(--el-border-color-lighter);
  }
  
  .mobile-form__submit-btn {
    min-height: 44px;
  }
  
  /* 强制顶部标签布局 */
  .mobile-form :deep(.el-form-item) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  
  .mobile-form :deep(.el-form-item__label) {
    text-align: left !important;
    padding-bottom: 8px;
    margin-bottom: 0;
    line-height: 1.4 !important;
  }
  
  .mobile-form :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
  
  /* 输入框优化 */
  .mobile-form :deep(.el-input__inner) {
    min-height: 44px;
    font-size: 16px;
  }
  
  .mobile-form :deep(.el-textarea__inner) {
    font-size: 16px;
  }
  
  .mobile-form :deep(.el-select .el-input__inner) {
    min-height: 44px;
  }
  
  .mobile-form :deep(.el-date-editor .el-input__inner) {
    min-height: 44px;
  }
  
  /* 单选框和复选框优化 */
  .mobile-form :deep(.el-radio),
  .mobile-form :deep(.el-checkbox) {
    margin-right: 0;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    min-height: 44px;
  }
  
  .mobile-form :deep(.el-radio__label),
  .mobile-form :deep(.el-checkbox__label) {
    font-size: 16px;
    line-height: 1.4;
  }
}
</style>
```

## 3. 触摸交互优化

### 3.1 触摸手势管理器

```typescript
// touch-manager.ts
export interface TouchPoint {
  id: number
  x: number
  y: number
  timestamp: number
}

export interface GestureEvent {
  type: string
  touches: TouchPoint[]
  deltaX: number
  deltaY: number
  distance: number
  scale: number
  rotation: number
  velocity: number
  direction: string
  target: HTMLElement
}

export interface GestureConfig {
  enableSwipe: boolean
  enablePinch: boolean
  enableRotate: boolean
  enableLongPress: boolean
  swipeThreshold: number
  pinchThreshold: number
  longPressDelay: number
  preventDefaultTouchMove: boolean
}

export class TouchManager {
  private element: HTMLElement
  private config: GestureConfig
  private touches: Map<number, TouchPoint> = new Map()
  private startTouches: Map<number, TouchPoint> = new Map()
  private listeners: Map<string, Set<(event: GestureEvent) => void>> = new Map()
  private longPressTimer: number | null = null
  private isLongPressed = false
  
  constructor(element: HTMLElement, config: Partial<GestureConfig> = {}) {
    this.element = element
    this.config = {
      enableSwipe: true,
      enablePinch: true,
      enableRotate: true,
      enableLongPress: true,
      swipeThreshold: 30,
      pinchThreshold: 0.1,
      longPressDelay: 500,
      preventDefaultTouchMove: false,
      ...config
    }
    
    this.bindEvents()
  }
  
  private bindEvents(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false })
  }
  
  private handleTouchStart(event: TouchEvent): void {
    const touches = Array.from(event.changedTouches)
    
    touches.forEach(touch => {
      const touchPoint: TouchPoint = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      }
      
      this.touches.set(touch.identifier, touchPoint)
      this.startTouches.set(touch.identifier, { ...touchPoint })
    })
    
    // 长按检测
    if (this.config.enableLongPress && this.touches.size === 1) {
      this.startLongPressTimer()
    }
    
    this.emitGestureEvent('touchstart', event)
  }
  
  private handleTouchMove(event: TouchEvent): void {
    if (this.config.preventDefaultTouchMove) {
      event.preventDefault()
    }
    
    const touches = Array.from(event.changedTouches)
    
    touches.forEach(touch => {
      const touchPoint: TouchPoint = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now()
      }
      
      this.touches.set(touch.identifier, touchPoint)
    })
    
    // 取消长按
    this.cancelLongPressTimer()
    
    // 检测手势
    this.detectGestures(event)
    
    this.emitGestureEvent('touchmove', event)
  }
  
  private handleTouchEnd(event: TouchEvent): void {
    const touches = Array.from(event.changedTouches)
    
    touches.forEach(touch => {
      this.touches.delete(touch.identifier)
    })
    
    // 取消长按
    this.cancelLongPressTimer()
    
    // 检测滑动手势
    if (this.config.enableSwipe && this.touches.size === 0) {
      this.detectSwipe(event)
    }
    
    this.emitGestureEvent('touchend', event)
    
    // 清理开始触摸点
    if (this.touches.size === 0) {
      this.startTouches.clear()
      this.isLongPressed = false
    }
  }
  
  private handleTouchCancel(event: TouchEvent): void {
    this.touches.clear()
    this.startTouches.clear()
    this.cancelLongPressTimer()
    this.isLongPressed = false
    
    this.emitGestureEvent('touchcancel', event)
  }
  
  private detectGestures(event: TouchEvent): void {
    const touchArray = Array.from(this.touches.values())
    
    if (touchArray.length === 2 && this.config.enablePinch) {
      this.detectPinch(touchArray, event)
    }
    
    if (touchArray.length === 2 && this.config.enableRotate) {
      this.detectRotation(touchArray, event)
    }
  }
  
  private detectSwipe(event: TouchEvent): void {
    const touches = Array.from(event.changedTouches)
    
    touches.forEach(touch => {
      const startTouch = this.startTouches.get(touch.identifier)
      if (!startTouch) return
      
      const deltaX = touch.clientX - startTouch.x
      const deltaY = touch.clientY - startTouch.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const duration = Date.now() - startTouch.timestamp
      const velocity = distance / duration
      
      if (distance > this.config.swipeThreshold) {
        const direction = this.getSwipeDirection(deltaX, deltaY)
        
        const gestureEvent: GestureEvent = {
          type: 'swipe',
          touches: [{
            id: touch.identifier,
            x: touch.clientX,
            y: touch.clientY,
            timestamp: Date.now()
          }],
          deltaX,
          deltaY,
          distance,
          scale: 1,
          rotation: 0,
          velocity,
          direction,
          target: event.target as HTMLElement
        }
        
        this.emitGestureEvent('swipe', event, gestureEvent)
        this.emitGestureEvent(`swipe${direction}`, event, gestureEvent)
      }
    })
  }
  
  private detectPinch(touches: TouchPoint[], event: TouchEvent): void {
    const [touch1, touch2] = touches
    const startTouches = Array.from(this.startTouches.values())
    
    if (startTouches.length !== 2) return
    
    const [startTouch1, startTouch2] = startTouches
    
    const currentDistance = this.getDistance(touch1, touch2)
    const startDistance = this.getDistance(startTouch1, startTouch2)
    const scale = currentDistance / startDistance
    
    if (Math.abs(scale - 1) > this.config.pinchThreshold) {
      const gestureEvent: GestureEvent = {
        type: 'pinch',
        touches,
        deltaX: 0,
        deltaY: 0,
        distance: currentDistance,
        scale,
        rotation: 0,
        velocity: 0,
        direction: scale > 1 ? 'out' : 'in',
        target: event.target as HTMLElement
      }
      
      this.emitGestureEvent('pinch', event, gestureEvent)
    }
  }
  
  private detectRotation(touches: TouchPoint[], event: TouchEvent): void {
    const [touch1, touch2] = touches
    const startTouches = Array.from(this.startTouches.values())
    
    if (startTouches.length !== 2) return
    
    const [startTouch1, startTouch2] = startTouches
    
    const currentAngle = this.getAngle(touch1, touch2)
    const startAngle = this.getAngle(startTouch1, startTouch2)
    const rotation = currentAngle - startAngle
    
    const gestureEvent: GestureEvent = {
      type: 'rotate',
      touches,
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      scale: 1,
      rotation,
      velocity: 0,
      direction: rotation > 0 ? 'clockwise' : 'counterclockwise',
      target: event.target as HTMLElement
    }
    
    this.emitGestureEvent('rotate', event, gestureEvent)
  }
  
  private startLongPressTimer(): void {
    this.longPressTimer = window.setTimeout(() => {
      if (this.touches.size === 1 && !this.isLongPressed) {
        this.isLongPressed = true
        const touch = Array.from(this.touches.values())[0]
        
        const gestureEvent: GestureEvent = {
          type: 'longpress',
          touches: [touch],
          deltaX: 0,
          deltaY: 0,
          distance: 0,
          scale: 1,
          rotation: 0,
          velocity: 0,
          direction: '',
          target: this.element
        }
        
        this.emitGestureEvent('longpress', null, gestureEvent)
      }
    }, this.config.longPressDelay)
  }
  
  private cancelLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }
  
  private getDistance(touch1: TouchPoint, touch2: TouchPoint): number {
    const deltaX = touch2.x - touch1.x
    const deltaY = touch2.y - touch1.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }
  
  private getAngle(touch1: TouchPoint, touch2: TouchPoint): number {
    const deltaX = touch2.x - touch1.x
    const deltaY = touch2.y - touch1.y
    return Math.atan2(deltaY, deltaX) * 180 / Math.PI
  }
  
  private getSwipeDirection(deltaX: number, deltaY: number): string {
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)
    
    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }
  
  private emitGestureEvent(
    type: string,
    originalEvent: TouchEvent | null,
    gestureEvent?: GestureEvent
  ): void {
    const listeners = this.listeners.get(type)
    if (!listeners) return
    
    const event = gestureEvent || {
      type,
      touches: Array.from(this.touches.values()),
      deltaX: 0,
      deltaY: 0,
      distance: 0,
      scale: 1,
      rotation: 0,
      velocity: 0,
      direction: '',
      target: originalEvent?.target as HTMLElement || this.element
    }
    
    listeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in gesture event listener:', error)
      }
    })
  }
  
  public on(type: string, listener: (event: GestureEvent) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    
    const listeners = this.listeners.get(type)!
    listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      listeners.delete(listener)
    }
  }
  
  public off(type: string, listener?: (event: GestureEvent) => void): void {
    const listeners = this.listeners.get(type)
    if (!listeners) return
    
    if (listener) {
      listeners.delete(listener)
    } else {
      listeners.clear()
    }
  }
  
  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this))
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this))
    
    this.cancelLongPressTimer()
    this.touches.clear()
    this.startTouches.clear()
    this.listeners.clear()
  }
}
```

## 4. 实践练习

### 练习1：响应式导航组件
```vue
<!-- 实现自适应导航组件 -->
<!-- 1. 桌面端水平导航 -->
<!-- 2. 移动端抽屉导航 -->
<!-- 3. 平板端折叠导航 -->
<!-- 4. 触摸手势支持 -->
```

### 练习2：移动端数据可视化
```vue
<!-- 开发移动端图表组件 -->
<!-- 1. 响应式图表布局 -->
<!-- 2. 触摸缩放和平移 -->
<!-- 3. 手势交互优化 -->
<!-- 4. 性能优化策略 -->
```

### 练习3：跨平台组件库
```typescript
// 构建跨平台组件系统
// 1. 平台检测和适配
// 2. 组件行为差异化
// 3. 样式自动适配
// 4. 性能监控和优化
```

### 练习4：移动端性能优化
```typescript
// 实现移动端性能优化
// 1. 懒加载和虚拟滚动
// 2. 图片压缩和预加载
// 3. 内存管理和清理
// 4. 网络请求优化
```

## 学习资源

### 官方文档
- [Element Plus 响应式设计](https://element-plus.org/zh-CN/guide/design.html)
- [CSS 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries)
- [Touch Events API](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch_events)

### 设计指南
- [Material Design Responsive Layout](https://material.io/design/layout/responsive-layout-grid.html)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals/)

### 工具和库
- [Hammer.js](https://hammerjs.github.io/)
- [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)
- [better-scroll](https://github.com/ustbhuangyi/better-scroll)

## 作业

1. **响应式布局**：实现完整的响应式布局系统
2. **移动端组件**：开发移动端优化的表格和表单组件
3. **触摸交互**：实现手势识别和触摸优化
4. **性能优化**：优化移动端加载和渲染性能
5. **跨平台适配**：构建跨平台兼容的组件库

## 下一步学习

明天我们将学习「Element Plus 微前端架构与模块联邦」，包括：
- 微前端架构设计
- Module Federation 配置
- 组件共享和版本管理
- 运行时集成策略
- 性能优化和监控

## 总结

今天我们深入学习了 Element Plus 的响应式设计与移动端适配：

1. **响应式系统**：构建了完整的响应式设计架构和布局管理器
2. **移动端组件**：实现了移动端优化的表格和表单组件
3. **触摸交互**：开发了手势识别和触摸事件管理系统
4. **性能优化**：掌握了移动端性能优化的关键技术
5. **跨平台适配**：学会了构建跨设备兼容的界面

通过这些学习，你现在能够：
- 构建响应式的组件库和应用
- 优化移动端用户体验
- 实现高性能的触摸交互
- 解决跨平台兼容性问题
- 提升移动端应用的性能和可用性