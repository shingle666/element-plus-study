# 第47天：Element Plus 可视化编辑器开发

## 学习目标

今天我们将学习如何开发基于 Element Plus 的可视化编辑器，掌握拖拽编辑器的核心技术和实现方案。

- 理解可视化编辑器架构设计
- 掌握拖拽系统的实现原理
- 学习组件渲染引擎开发
- 实现属性配置系统
- 掌握代码生成和预览功能

## 1. 编辑器架构设计

### 1.1 编辑器核心架构

```typescript
// editor-core.ts
export interface EditorConfig {
  canvas: {
    width: number
    height: number
    scale: number
    grid: boolean
    snapToGrid: boolean
    gridSize: number
  }
  components: ComponentRegistry
  plugins: PluginRegistry
  theme: ThemeConfig
  i18n: I18nConfig
}

export interface ComponentSchema {
  id: string
  type: string
  name: string
  props: Record<string, any>
  style: CSSProperties
  children?: ComponentSchema[]
  slots?: Record<string, ComponentSchema[]>
  events?: Record<string, string>
  conditions?: {
    show?: string
    disabled?: string
  }
  loop?: {
    source: string
    item: string
    index?: string
  }
}

export interface EditorState {
  canvas: {
    components: ComponentSchema[]
    selectedIds: string[]
    hoveredId: string | null
    clipboard: ComponentSchema[]
    history: HistoryState[]
    historyIndex: number
  }
  ui: {
    activePanel: string
    sidebarCollapsed: boolean
    propertiesCollapsed: boolean
    zoom: number
    mode: 'design' | 'preview' | 'code'
  }
  project: {
    name: string
    version: string
    description: string
    settings: ProjectSettings
  }
}

export interface HistoryState {
  id: string
  timestamp: number
  action: string
  components: ComponentSchema[]
  selectedIds: string[]
}

export class VisualEditor {
  private state: EditorState
  private config: EditorConfig
  private eventBus: EventBus
  private commandManager: CommandManager
  private componentRegistry: ComponentRegistry
  private pluginManager: PluginManager
  
  constructor(config: EditorConfig) {
    this.config = config
    this.eventBus = new EventBus()
    this.commandManager = new CommandManager()
    this.componentRegistry = new ComponentRegistry()
    this.pluginManager = new PluginManager()
    
    this.initializeState()
    this.setupEventListeners()
    this.loadPlugins()
  }
  
  private initializeState(): void {
    this.state = {
      canvas: {
        components: [],
        selectedIds: [],
        hoveredId: null,
        clipboard: [],
        history: [],
        historyIndex: -1
      },
      ui: {
        activePanel: 'components',
        sidebarCollapsed: false,
        propertiesCollapsed: false,
        zoom: 1,
        mode: 'design'
      },
      project: {
        name: '未命名项目',
        version: '1.0.0',
        description: '',
        settings: {
          responsive: true,
          theme: 'default',
          language: 'zh-CN'
        }
      }
    }
  }
  
  private setupEventListeners(): void {
    // 键盘快捷键
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    
    // 组件变化监听
    this.eventBus.on('component:add', this.handleComponentAdd.bind(this))
    this.eventBus.on('component:remove', this.handleComponentRemove.bind(this))
    this.eventBus.on('component:update', this.handleComponentUpdate.bind(this))
    this.eventBus.on('component:select', this.handleComponentSelect.bind(this))
    
    // 历史记录监听
    this.eventBus.on('history:push', this.pushHistory.bind(this))
    this.eventBus.on('history:undo', this.undo.bind(this))
    this.eventBus.on('history:redo', this.redo.bind(this))
  }
  
  private handleKeyDown(event: KeyboardEvent): void {
    const { ctrlKey, metaKey, key } = event
    const isCtrl = ctrlKey || metaKey
    
    if (isCtrl) {
      switch (key) {
        case 'z':
          event.preventDefault()
          if (event.shiftKey) {
            this.redo()
          } else {
            this.undo()
          }
          break
        case 'c':
          event.preventDefault()
          this.copy()
          break
        case 'v':
          event.preventDefault()
          this.paste()
          break
        case 'x':
          event.preventDefault()
          this.cut()
          break
        case 'a':
          event.preventDefault()
          this.selectAll()
          break
        case 's':
          event.preventDefault()
          this.save()
          break
      }
    } else {
      switch (key) {
        case 'Delete':
        case 'Backspace':
          event.preventDefault()
          this.deleteSelected()
          break
        case 'Escape':
          this.clearSelection()
          break
      }
    }
  }
  
  // 组件操作方法
  public addComponent(component: ComponentSchema, parentId?: string, index?: number): void {
    const newComponent = {
      ...component,
      id: this.generateId()
    }
    
    if (parentId) {
      const parent = this.findComponent(parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        
        if (typeof index === 'number') {
          parent.children.splice(index, 0, newComponent)
        } else {
          parent.children.push(newComponent)
        }
      }
    } else {
      if (typeof index === 'number') {
        this.state.canvas.components.splice(index, 0, newComponent)
      } else {
        this.state.canvas.components.push(newComponent)
      }
    }
    
    this.eventBus.emit('component:add', { component: newComponent, parentId, index })
    this.pushHistory('添加组件')
  }
  
  public removeComponent(id: string): void {
    const component = this.findComponent(id)
    if (!component) return
    
    const parent = this.findParentComponent(id)
    if (parent && parent.children) {
      const index = parent.children.findIndex(child => child.id === id)
      if (index !== -1) {
        parent.children.splice(index, 1)
      }
    } else {
      const index = this.state.canvas.components.findIndex(comp => comp.id === id)
      if (index !== -1) {
        this.state.canvas.components.splice(index, 1)
      }
    }
    
    // 清除选中状态
    this.state.canvas.selectedIds = this.state.canvas.selectedIds.filter(selectedId => selectedId !== id)
    
    this.eventBus.emit('component:remove', { id, component })
    this.pushHistory('删除组件')
  }
  
  public updateComponent(id: string, updates: Partial<ComponentSchema>): void {
    const component = this.findComponent(id)
    if (!component) return
    
    const oldComponent = { ...component }
    Object.assign(component, updates)
    
    this.eventBus.emit('component:update', { id, component, oldComponent, updates })
    this.pushHistory('更新组件')
  }
  
  public selectComponent(id: string, multiple = false): void {
    if (multiple) {
      if (this.state.canvas.selectedIds.includes(id)) {
        this.state.canvas.selectedIds = this.state.canvas.selectedIds.filter(selectedId => selectedId !== id)
      } else {
        this.state.canvas.selectedIds.push(id)
      }
    } else {
      this.state.canvas.selectedIds = [id]
    }
    
    this.eventBus.emit('component:select', { selectedIds: this.state.canvas.selectedIds })
  }
  
  public clearSelection(): void {
    this.state.canvas.selectedIds = []
    this.eventBus.emit('component:select', { selectedIds: [] })
  }
  
  public selectAll(): void {
    const allIds = this.getAllComponentIds()
    this.state.canvas.selectedIds = allIds
    this.eventBus.emit('component:select', { selectedIds: allIds })
  }
  
  // 剪贴板操作
  public copy(): void {
    const selectedComponents = this.state.canvas.selectedIds
      .map(id => this.findComponent(id))
      .filter(Boolean) as ComponentSchema[]
    
    this.state.canvas.clipboard = this.deepCloneComponents(selectedComponents)
    this.eventBus.emit('clipboard:copy', { components: this.state.canvas.clipboard })
  }
  
  public cut(): void {
    this.copy()
    this.deleteSelected()
  }
  
  public paste(): void {
    if (this.state.canvas.clipboard.length === 0) return
    
    const pastedComponents = this.deepCloneComponents(this.state.canvas.clipboard)
    
    pastedComponents.forEach(component => {
      // 重新生成 ID
      this.regenerateIds(component)
      
      // 添加偏移
      if (component.style.position === 'absolute') {
        component.style.left = (parseInt(component.style.left as string) || 0) + 20
        component.style.top = (parseInt(component.style.top as string) || 0) + 20
      }
      
      this.addComponent(component)
    })
    
    // 选中粘贴的组件
    this.state.canvas.selectedIds = pastedComponents.map(comp => comp.id)
    
    this.eventBus.emit('clipboard:paste', { components: pastedComponents })
  }
  
  public deleteSelected(): void {
    const selectedIds = [...this.state.canvas.selectedIds]
    selectedIds.forEach(id => this.removeComponent(id))
  }
  
  // 历史记录管理
  public pushHistory(action: string): void {
    const historyState: HistoryState = {
      id: this.generateId(),
      timestamp: Date.now(),
      action,
      components: this.deepCloneComponents(this.state.canvas.components),
      selectedIds: [...this.state.canvas.selectedIds]
    }
    
    // 清除当前位置之后的历史记录
    this.state.canvas.history = this.state.canvas.history.slice(0, this.state.canvas.historyIndex + 1)
    
    // 添加新的历史记录
    this.state.canvas.history.push(historyState)
    this.state.canvas.historyIndex = this.state.canvas.history.length - 1
    
    // 限制历史记录数量
    const maxHistory = 50
    if (this.state.canvas.history.length > maxHistory) {
      this.state.canvas.history = this.state.canvas.history.slice(-maxHistory)
      this.state.canvas.historyIndex = this.state.canvas.history.length - 1
    }
    
    this.eventBus.emit('history:push', { historyState })
  }
  
  public undo(): void {
    if (this.state.canvas.historyIndex <= 0) return
    
    this.state.canvas.historyIndex--
    const historyState = this.state.canvas.history[this.state.canvas.historyIndex]
    
    this.restoreHistoryState(historyState)
    this.eventBus.emit('history:undo', { historyState })
  }
  
  public redo(): void {
    if (this.state.canvas.historyIndex >= this.state.canvas.history.length - 1) return
    
    this.state.canvas.historyIndex++
    const historyState = this.state.canvas.history[this.state.canvas.historyIndex]
    
    this.restoreHistoryState(historyState)
    this.eventBus.emit('history:redo', { historyState })
  }
  
  private restoreHistoryState(historyState: HistoryState): void {
    this.state.canvas.components = this.deepCloneComponents(historyState.components)
    this.state.canvas.selectedIds = [...historyState.selectedIds]
  }
  
  // 工具方法
  private findComponent(id: string, components?: ComponentSchema[]): ComponentSchema | null {
    const searchComponents = components || this.state.canvas.components
    
    for (const component of searchComponents) {
      if (component.id === id) {
        return component
      }
      
      if (component.children) {
        const found = this.findComponent(id, component.children)
        if (found) return found
      }
    }
    
    return null
  }
  
  private findParentComponent(id: string, components?: ComponentSchema[]): ComponentSchema | null {
    const searchComponents = components || this.state.canvas.components
    
    for (const component of searchComponents) {
      if (component.children) {
        if (component.children.some(child => child.id === id)) {
          return component
        }
        
        const found = this.findParentComponent(id, component.children)
        if (found) return found
      }
    }
    
    return null
  }
  
  private getAllComponentIds(components?: ComponentSchema[]): string[] {
    const searchComponents = components || this.state.canvas.components
    const ids: string[] = []
    
    const traverse = (comps: ComponentSchema[]) => {
      comps.forEach(comp => {
        ids.push(comp.id)
        if (comp.children) {
          traverse(comp.children)
        }
      })
    }
    
    traverse(searchComponents)
    return ids
  }
  
  private deepCloneComponents(components: ComponentSchema[]): ComponentSchema[] {
    return JSON.parse(JSON.stringify(components))
  }
  
  private regenerateIds(component: ComponentSchema): void {
    component.id = this.generateId()
    
    if (component.children) {
      component.children.forEach(child => this.regenerateIds(child))
    }
  }
  
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 公共 API
  public getState(): EditorState {
    return { ...this.state }
  }
  
  public getConfig(): EditorConfig {
    return { ...this.config }
  }
  
  public getEventBus(): EventBus {
    return this.eventBus
  }
  
  public save(): Promise<void> {
    return new Promise((resolve) => {
      const data = {
        project: this.state.project,
        components: this.state.canvas.components,
        config: this.config
      }
      
      // 这里可以实现保存到服务器或本地存储
      localStorage.setItem('visual-editor-project', JSON.stringify(data))
      
      this.eventBus.emit('project:save', { data })
      resolve()
    })
  }
  
  public load(data: any): void {
    if (data.project) {
      this.state.project = data.project
    }
    
    if (data.components) {
      this.state.canvas.components = data.components
    }
    
    if (data.config) {
      this.config = { ...this.config, ...data.config }
    }
    
    this.eventBus.emit('project:load', { data })
  }
  
  public export(): string {
    return JSON.stringify({
      project: this.state.project,
      components: this.state.canvas.components,
      config: this.config
    }, null, 2)
  }
  
  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    this.eventBus.clear()
    this.pluginManager.destroy()
  }
}
```

### 1.2 拖拽系统实现

```typescript
// drag-drop-system.ts
export interface DragData {
  type: 'component' | 'move' | 'resize'
  componentType?: string
  componentId?: string
  sourceIndex?: number
  sourceParentId?: string
  offset?: { x: number; y: number }
}

export interface DropZone {
  id: string
  element: HTMLElement
  accepts: string[]
  onDrop: (data: DragData, position: { x: number; y: number }) => void
  onDragOver?: (data: DragData, position: { x: number; y: number }) => boolean
  onDragEnter?: (data: DragData) => void
  onDragLeave?: (data: DragData) => void
}

export class DragDropSystem {
  private dragData: DragData | null = null
  private dropZones: Map<string, DropZone> = new Map()
  private currentDropZone: DropZone | null = null
  private dragElement: HTMLElement | null = null
  private ghostElement: HTMLElement | null = null
  private eventBus: EventBus
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupEventListeners()
  }
  
  private setupEventListeners(): void {
    document.addEventListener('dragstart', this.handleDragStart.bind(this))
    document.addEventListener('dragover', this.handleDragOver.bind(this))
    document.addEventListener('dragenter', this.handleDragEnter.bind(this))
    document.addEventListener('dragleave', this.handleDragLeave.bind(this))
    document.addEventListener('drop', this.handleDrop.bind(this))
    document.addEventListener('dragend', this.handleDragEnd.bind(this))
  }
  
  public registerDropZone(dropZone: DropZone): void {
    this.dropZones.set(dropZone.id, dropZone)
    
    // 设置元素属性
    dropZone.element.setAttribute('data-drop-zone', dropZone.id)
  }
  
  public unregisterDropZone(id: string): void {
    const dropZone = this.dropZones.get(id)
    if (dropZone) {
      dropZone.element.removeAttribute('data-drop-zone')
      this.dropZones.delete(id)
    }
  }
  
  public startDrag(element: HTMLElement, data: DragData): void {
    this.dragElement = element
    this.dragData = data
    
    // 设置拖拽属性
    element.draggable = true
    element.setAttribute('data-drag-type', data.type)
    
    // 创建拖拽幽灵元素
    this.createGhostElement(element)
    
    this.eventBus.emit('drag:start', { element, data })
  }
  
  private createGhostElement(element: HTMLElement): void {
    this.ghostElement = element.cloneNode(true) as HTMLElement
    this.ghostElement.style.position = 'fixed'
    this.ghostElement.style.pointerEvents = 'none'
    this.ghostElement.style.zIndex = '9999'
    this.ghostElement.style.opacity = '0.8'
    this.ghostElement.style.transform = 'scale(0.8)'
    this.ghostElement.classList.add('drag-ghost')
    
    document.body.appendChild(this.ghostElement)
  }
  
  private handleDragStart(event: DragEvent): void {
    if (!this.dragElement || !this.dragData) return
    
    // 设置拖拽数据
    event.dataTransfer?.setData('application/json', JSON.stringify(this.dragData))
    event.dataTransfer!.effectAllowed = 'move'
    
    // 隐藏默认拖拽图像
    const emptyImg = new Image()
    event.dataTransfer?.setDragImage(emptyImg, 0, 0)
    
    this.eventBus.emit('drag:start', { element: this.dragElement, data: this.dragData })
  }
  
  private handleDragOver(event: DragEvent): void {
    event.preventDefault()
    
    if (!this.dragData) return
    
    // 更新幽灵元素位置
    if (this.ghostElement) {
      this.ghostElement.style.left = `${event.clientX + 10}px`
      this.ghostElement.style.top = `${event.clientY + 10}px`
    }
    
    // 查找当前的放置区域
    const dropZone = this.findDropZone(event.target as HTMLElement)
    if (dropZone && dropZone !== this.currentDropZone) {
      if (this.currentDropZone) {
        this.currentDropZone.onDragLeave?.(this.dragData)
        this.removeDropZoneHighlight(this.currentDropZone)
      }
      
      this.currentDropZone = dropZone
      dropZone.onDragEnter?.(this.dragData)
      this.addDropZoneHighlight(dropZone)
    }
    
    // 检查是否可以放置
    if (dropZone) {
      const position = { x: event.clientX, y: event.clientY }
      const canDrop = dropZone.onDragOver?.(this.dragData, position) ?? true
      
      if (canDrop && dropZone.accepts.includes(this.dragData.type)) {
        event.dataTransfer!.dropEffect = 'move'
      } else {
        event.dataTransfer!.dropEffect = 'none'
      }
    }
  }
  
  private handleDragEnter(event: DragEvent): void {
    event.preventDefault()
  }
  
  private handleDragLeave(event: DragEvent): void {
    // 检查是否真的离开了放置区域
    const relatedTarget = event.relatedTarget as HTMLElement
    if (relatedTarget && this.currentDropZone) {
      const dropZone = this.findDropZone(relatedTarget)
      if (dropZone !== this.currentDropZone) {
        this.currentDropZone.onDragLeave?.(this.dragData!)
        this.removeDropZoneHighlight(this.currentDropZone)
        this.currentDropZone = null
      }
    }
  }
  
  private handleDrop(event: DragEvent): void {
    event.preventDefault()
    
    if (!this.dragData) return
    
    const dropZone = this.findDropZone(event.target as HTMLElement)
    if (dropZone && dropZone.accepts.includes(this.dragData.type)) {
      const position = { x: event.clientX, y: event.clientY }
      dropZone.onDrop(this.dragData, position)
      
      this.eventBus.emit('drag:drop', {
        data: this.dragData,
        dropZone,
        position
      })
    }
  }
  
  private handleDragEnd(event: DragEvent): void {
    // 清理状态
    if (this.currentDropZone) {
      this.removeDropZoneHighlight(this.currentDropZone)
      this.currentDropZone = null
    }
    
    if (this.ghostElement) {
      document.body.removeChild(this.ghostElement)
      this.ghostElement = null
    }
    
    if (this.dragElement) {
      this.dragElement.draggable = false
      this.dragElement.removeAttribute('data-drag-type')
    }
    
    this.eventBus.emit('drag:end', {
      element: this.dragElement,
      data: this.dragData
    })
    
    this.dragElement = null
    this.dragData = null
  }
  
  private findDropZone(element: HTMLElement): DropZone | null {
    let current = element
    
    while (current && current !== document.body) {
      const dropZoneId = current.getAttribute('data-drop-zone')
      if (dropZoneId) {
        return this.dropZones.get(dropZoneId) || null
      }
      current = current.parentElement!
    }
    
    return null
  }
  
  private addDropZoneHighlight(dropZone: DropZone): void {
    dropZone.element.classList.add('drop-zone-active')
  }
  
  private removeDropZoneHighlight(dropZone: DropZone): void {
    dropZone.element.classList.remove('drop-zone-active')
  }
  
  public destroy(): void {
    document.removeEventListener('dragstart', this.handleDragStart.bind(this))
    document.removeEventListener('dragover', this.handleDragOver.bind(this))
    document.removeEventListener('dragenter', this.handleDragEnter.bind(this))
    document.removeEventListener('dragleave', this.handleDragLeave.bind(this))
    document.removeEventListener('drop', this.handleDrop.bind(this))
    document.removeEventListener('dragend', this.handleDragEnd.bind(this))
    
    this.dropZones.clear()
  }
}
```

## 2. 组件渲染引擎

### 2.1 渲染引擎核心

```vue
<!-- ComponentRenderer.vue -->
<template>
  <div class="component-renderer">
    <component
      v-for="component in components"
      :key="component.id"
      :is="getComponentType(component)"
      v-bind="getComponentProps(component)"
      :style="getComponentStyle(component)"
      :class="getComponentClass(component)"
      @click="handleComponentClick(component, $event)"
      @mouseenter="handleComponentHover(component, true)"
      @mouseleave="handleComponentHover(component, false)"
    >
      <template v-if="component.children">
        <ComponentRenderer
          :components="component.children"
          :editor="editor"
          :mode="mode"
        />
      </template>
      
      <template v-for="(slotComponents, slotName) in component.slots" :key="slotName" #[slotName]>
        <ComponentRenderer
          :components="slotComponents"
          :editor="editor"
          :mode="mode"
        />
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, CSSProperties } from 'vue'
import type { ComponentSchema, VisualEditor } from './editor-core'

interface Props {
  components: ComponentSchema[]
  editor: VisualEditor
  mode: 'design' | 'preview' | 'code'
}

const props = defineProps<Props>()

// 注入组件注册表
const componentRegistry = inject('componentRegistry') as any

// 计算属性
const editorState = computed(() => props.editor.getState())

// 方法
const getComponentType = (component: ComponentSchema): string => {
  const registeredComponent = componentRegistry.getComponent(component.type)
  return registeredComponent?.component || 'div'
}

const getComponentProps = (component: ComponentSchema): Record<string, any> => {
  const props = { ...component.props }
  
  // 在设计模式下添加编辑器相关属性
  if (props.mode === 'design') {
    props['data-component-id'] = component.id
    props['data-component-type'] = component.type
  }
  
  // 处理条件显示
  if (component.conditions?.show) {
    const showCondition = evaluateExpression(component.conditions.show, props)
    if (!showCondition) {
      props.style = { ...props.style, display: 'none' }
    }
  }
  
  // 处理禁用条件
  if (component.conditions?.disabled) {
    const disabledCondition = evaluateExpression(component.conditions.disabled, props)
    if (disabledCondition) {
      props.disabled = true
    }
  }
  
  // 处理循环渲染
  if (component.loop) {
    // 这里需要根据具体的数据源处理循环逻辑
    // 暂时简化处理
  }
  
  return props
}

const getComponentStyle = (component: ComponentSchema): CSSProperties => {
  const style = { ...component.style }
  
  // 在设计模式下添加选中和悬停样式
  if (props.mode === 'design') {
    const isSelected = editorState.value.canvas.selectedIds.includes(component.id)
    const isHovered = editorState.value.canvas.hoveredId === component.id
    
    if (isSelected) {
      style.outline = '2px solid #409eff'
      style.outlineOffset = '1px'
    } else if (isHovered) {
      style.outline = '1px dashed #409eff'
      style.outlineOffset = '1px'
    }
  }
  
  return style
}

const getComponentClass = (component: ComponentSchema): string[] => {
  const classes = ['visual-component']
  
  if (props.mode === 'design') {
    classes.push('design-mode')
    
    const isSelected = editorState.value.canvas.selectedIds.includes(component.id)
    const isHovered = editorState.value.canvas.hoveredId === component.id
    
    if (isSelected) {
      classes.push('selected')
    }
    
    if (isHovered) {
      classes.push('hovered')
    }
  }
  
  return classes
}

const handleComponentClick = (component: ComponentSchema, event: MouseEvent): void => {
  if (props.mode !== 'design') return
  
  event.stopPropagation()
  
  const multiple = event.ctrlKey || event.metaKey
  props.editor.selectComponent(component.id, multiple)
}

const handleComponentHover = (component: ComponentSchema, isEnter: boolean): void => {
  if (props.mode !== 'design') return
  
  const state = props.editor.getState()
  state.canvas.hoveredId = isEnter ? component.id : null
}

// 表达式求值函数（简化版）
const evaluateExpression = (expression: string, context: any): any => {
  try {
    // 这里应该使用安全的表达式求值器
    // 为了演示，使用简化的实现
    const func = new Function('context', `with(context) { return ${expression} }`)
    return func(context)
  } catch (error) {
    console.warn('Expression evaluation error:', error)
    return false
  }
}
</script>

<style scoped>
.component-renderer {
  width: 100%;
  height: 100%;
}

.visual-component.design-mode {
  position: relative;
  cursor: pointer;
}

.visual-component.design-mode:hover {
  outline: 1px dashed #409eff;
  outline-offset: 1px;
}

.visual-component.selected {
  outline: 2px solid #409eff !important;
  outline-offset: 1px;
}

.visual-component.hovered {
  outline: 1px dashed #409eff;
  outline-offset: 1px;
}
</style>
```

### 2.2 组件注册表

```typescript
// component-registry.ts
export interface ComponentDefinition {
  type: string
  name: string
  category: string
  icon: string
  component: any
  props: ComponentPropDefinition[]
  defaultProps: Record<string, any>
  defaultStyle: CSSProperties
  slots?: SlotDefinition[]
  events?: EventDefinition[]
  preview?: string
  description?: string
  tags?: string[]
}

export interface ComponentPropDefinition {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'color' | 'select' | 'textarea'
  label: string
  description?: string
  defaultValue?: any
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
  required?: boolean
  group?: string
}

export interface SlotDefinition {
  name: string
  label: string
  description?: string
  accepts?: string[]
}

export interface EventDefinition {
  name: string
  label: string
  description?: string
  params?: { name: string; type: string; description?: string }[]
}

export class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map()
  private categories: Map<string, ComponentDefinition[]> = new Map()
  
  public register(definition: ComponentDefinition): void {
    this.components.set(definition.type, definition)
    
    // 按分类组织组件
    if (!this.categories.has(definition.category)) {
      this.categories.set(definition.category, [])
    }
    
    const categoryComponents = this.categories.get(definition.category)!
    const existingIndex = categoryComponents.findIndex(comp => comp.type === definition.type)
    
    if (existingIndex !== -1) {
      categoryComponents[existingIndex] = definition
    } else {
      categoryComponents.push(definition)
    }
  }
  
  public unregister(type: string): void {
    const definition = this.components.get(type)
    if (definition) {
      this.components.delete(type)
      
      const categoryComponents = this.categories.get(definition.category)
      if (categoryComponents) {
        const index = categoryComponents.findIndex(comp => comp.type === type)
        if (index !== -1) {
          categoryComponents.splice(index, 1)
        }
      }
    }
  }
  
  public getComponent(type: string): ComponentDefinition | undefined {
    return this.components.get(type)
  }
  
  public getAllComponents(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }
  
  public getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.categories.get(category) || []
  }
  
  public getCategories(): string[] {
    return Array.from(this.categories.keys())
  }
  
  public searchComponents(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase()
    
    return this.getAllComponents().filter(comp => {
      return (
        comp.name.toLowerCase().includes(lowerQuery) ||
        comp.type.toLowerCase().includes(lowerQuery) ||
        comp.description?.toLowerCase().includes(lowerQuery) ||
        comp.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    })
  }
  
  public createComponentSchema(type: string, overrides?: Partial<ComponentSchema>): ComponentSchema {
    const definition = this.getComponent(type)
    if (!definition) {
      throw new Error(`Component type "${type}" not found`)
    }
    
    return {
      id: this.generateId(),
      type,
      name: definition.name,
      props: { ...definition.defaultProps },
      style: { ...definition.defaultStyle },
      children: [],
      slots: {},
      events: {},
      ...overrides
    }
  }
  
  private generateId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// 预定义的 Element Plus 组件
export const elementPlusComponents: ComponentDefinition[] = [
  {
    type: 'el-button',
    name: '按钮',
    category: '基础组件',
    icon: 'el-icon-mouse',
    component: 'el-button',
    props: [
      {
        name: 'type',
        type: 'select',
        label: '类型',
        defaultValue: 'default',
        options: [
          { label: '默认', value: 'default' },
          { label: '主要', value: 'primary' },
          { label: '成功', value: 'success' },
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '危险', value: 'danger' }
        ]
      },
      {
        name: 'size',
        type: 'select',
        label: '尺寸',
        defaultValue: 'default',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      {
        name: 'plain',
        type: 'boolean',
        label: '朴素按钮',
        defaultValue: false
      },
      {
        name: 'round',
        type: 'boolean',
        label: '圆角按钮',
        defaultValue: false
      },
      {
        name: 'circle',
        type: 'boolean',
        label: '圆形按钮',
        defaultValue: false
      },
      {
        name: 'disabled',
        type: 'boolean',
        label: '禁用',
        defaultValue: false
      },
      {
        name: 'loading',
        type: 'boolean',
        label: '加载中',
        defaultValue: false
      }
    ],
    defaultProps: {
      type: 'default',
      size: 'default',
      plain: false,
      round: false,
      circle: false,
      disabled: false,
      loading: false
    },
    defaultStyle: {
      margin: '4px'
    },
    slots: [
      {
        name: 'default',
        label: '默认插槽',
        description: '按钮内容'
      }
    ],
    events: [
      {
        name: 'click',
        label: '点击事件',
        description: '点击按钮时触发'
      }
    ],
    preview: '按钮',
    description: 'Element Plus 按钮组件',
    tags: ['button', '按钮', '交互']
  },
  
  {
    type: 'el-input',
    name: '输入框',
    category: '表单组件',
    icon: 'el-icon-edit',
    component: 'el-input',
    props: [
      {
        name: 'type',
        type: 'select',
        label: '类型',
        defaultValue: 'text',
        options: [
          { label: '文本', value: 'text' },
          { label: '密码', value: 'password' },
          { label: '数字', value: 'number' },
          { label: '邮箱', value: 'email' },
          { label: '电话', value: 'tel' },
          { label: '网址', value: 'url' }
        ]
      },
      {
        name: 'placeholder',
        type: 'string',
        label: '占位符',
        defaultValue: '请输入'
      },
      {
        name: 'clearable',
        type: 'boolean',
        label: '可清空',
        defaultValue: false
      },
      {
        name: 'disabled',
        type: 'boolean',
        label: '禁用',
        defaultValue: false
      },
      {
        name: 'readonly',
        type: 'boolean',
        label: '只读',
        defaultValue: false
      },
      {
        name: 'maxlength',
        type: 'number',
        label: '最大长度',
        min: 0
      },
      {
        name: 'show-word-limit',
        type: 'boolean',
        label: '显示字数统计',
        defaultValue: false
      }
    ],
    defaultProps: {
      type: 'text',
      placeholder: '请输入',
      clearable: false,
      disabled: false,
      readonly: false
    },
    defaultStyle: {
      width: '200px',
      margin: '4px'
    },
    events: [
      {
        name: 'input',
        label: '输入事件',
        description: '输入值改变时触发'
      },
      {
        name: 'change',
        label: '变化事件',
        description: '输入框失去焦点或用户按下回车时触发'
      },
      {
        name: 'focus',
        label: '获得焦点',
        description: '输入框获得焦点时触发'
      },
      {
        name: 'blur',
        label: '失去焦点',
        description: '输入框失去焦点时触发'
      }
    ],
    preview: '输入框',
    description: 'Element Plus 输入框组件',
    tags: ['input', '输入框', '表单']
  }
  
  // 可以继续添加更多组件定义...
]
```

## 3. 属性配置系统

### 3.1 属性面板组件

```vue
<!-- PropertyPanel.vue -->
<template>
  <div class="property-panel">
    <div class="panel-header">
      <h3>属性配置</h3>
      <el-button
        v-if="selectedComponents.length > 0"
        size="small"
        type="danger"
        @click="deleteSelected"
      >
        删除组件
      </el-button>
    </div>
    
    <div class="panel-content">
      <div v-if="selectedComponents.length === 0" class="empty-state">
        <el-empty description="请选择组件" />
      </div>
      
      <div v-else-if="selectedComponents.length === 1" class="single-component">
        <ComponentPropertyEditor
          :component="selectedComponents[0]"
          :definition="getComponentDefinition(selectedComponents[0])"
          @update="handleComponentUpdate"
        />
      </div>
      
      <div v-else class="multiple-components">
        <el-alert
          title="多选模式"
          :description="`已选择 ${selectedComponents.length} 个组件`"
          type="info"
          show-icon
          :closable="false"
        />
        
        <div class="common-properties">
          <h4>通用属性</h4>
          <CommonPropertyEditor
            :components="selectedComponents"
            @update="handleMultipleComponentUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { ElButton, ElEmpty, ElAlert } from 'element-plus'
import type { ComponentSchema, ComponentDefinition, VisualEditor } from './editor-core'
import ComponentPropertyEditor from './ComponentPropertyEditor.vue'
import CommonPropertyEditor from './CommonPropertyEditor.vue'

interface Props {
  editor: VisualEditor
}

const props = defineProps<Props>()

// 注入组件注册表
const componentRegistry = inject('componentRegistry') as any

// 计算属性
const editorState = computed(() => props.editor.getState())

const selectedComponents = computed(() => {
  return editorState.value.canvas.selectedIds
    .map(id => findComponent(id))
    .filter(Boolean) as ComponentSchema[]
})

// 方法
const findComponent = (id: string): ComponentSchema | null => {
  const findInComponents = (components: ComponentSchema[]): ComponentSchema | null => {
    for (const component of components) {
      if (component.id === id) {
        return component
      }
      
      if (component.children) {
        const found = findInComponents(component.children)
        if (found) return found
      }
    }
    return null
  }
  
  return findInComponents(editorState.value.canvas.components)
}

const getComponentDefinition = (component: ComponentSchema): ComponentDefinition | undefined => {
  return componentRegistry.getComponent(component.type)
}

const handleComponentUpdate = (updates: Partial<ComponentSchema>): void => {
  if (selectedComponents.value.length === 1) {
    props.editor.updateComponent(selectedComponents.value[0].id, updates)
  }
}

const handleMultipleComponentUpdate = (updates: Partial<ComponentSchema>): void => {
  selectedComponents.value.forEach(component => {
    props.editor.updateComponent(component.id, updates)
  })
}

const deleteSelected = (): void => {
  selectedComponents.value.forEach(component => {
    props.editor.removeComponent(component.id)
  })
}
</script>

<style scoped>
.property-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  border-left: 1px solid var(--el-border-color);
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.common-properties {
  margin-top: 16px;
}

.common-properties h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}
</style>
```

## 4. 实践练习

### 练习1：组件库扩展
```typescript
// 扩展组件注册表
// 1. 添加自定义组件定义
// 2. 实现组件属性编辑器
// 3. 支持组件预览和文档
// 4. 实现组件分组和搜索
```

### 练习2：高级拖拽功能
```typescript
// 实现高级拖拽特性
// 1. 智能对齐和吸附
// 2. 多选拖拽
// 3. 拖拽预览和反馈
// 4. 拖拽撤销和重做
```

### 练习3：代码生成器
```typescript
// 开发代码生成功能
// 1. Vue 3 代码生成
// 2. TypeScript 支持
// 3. 样式代码生成
// 4. 项目结构生成
```

### 练习4：实时预览系统
```vue
<!-- 构建实时预览功能 -->
<!-- 1. 多设备预览 -->
<!-- 2. 响应式预览 -->
<!-- 3. 交互预览 -->
<!-- 4. 性能监控 -->
```

## 学习资源

### 技术文档
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [拖拽 API](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API)
- [Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

### 开源项目
- [Vue Designer](https://github.com/kaorun343/vue-property-decorator)
- [Quasar App Extension](https://github.com/quasarframework/quasar)
- [Vant Weapp](https://github.com/youzan/vant-weapp)

### 设计工具
- [Figma](https://www.figma.com/)
- [Sketch](https://www.sketch.com/)
- [Adobe XD](https://www.adobe.com/products/xd.html)

## 作业

1. **编辑器架构**：设计和实现完整的可视化编辑器架构
2. **拖拽系统**：开发高级拖拽功能和交互体验
3. **组件渲染**：实现动态组件渲染和属性绑定
4. **属性配置**：构建灵活的属性配置系统
5. **代码生成**：开发代码生成和导出功能

## 下一步学习

明天我们将学习「Element Plus 数据可视化与图表集成」，包括：
- 图表库集成方案
- 数据绑定和更新
- 交互式图表开发
- 图表主题和样式
- 性能优化技术

## 总结

今天我们深入学习了 Element Plus 可视化编辑器的开发：

1. **编辑器架构**：构建了完整的可视化编辑器核心系统
2. **拖拽系统**：实现了高级拖拽功能和交互机制
3. **组件渲染**：开发了动态组件渲染引擎
4. **组件注册**：建立了灵活的组件注册和管理系统
5. **属性配置**：实现了可视化的属性配置面板

通过这些学习，你现在能够：
- 设计和实现可视化编辑器架构
- 开发拖拽交互和组件操作功能
- 构建动态组件渲染系统
- 实现属性配置和代码生成
- 优化编辑器的性能和用户体验