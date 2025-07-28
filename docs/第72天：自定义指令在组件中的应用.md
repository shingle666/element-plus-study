# 第72天：自定义指令在组件中的应用

## 学习目标

- 深入理解 Vue 3 自定义指令的原理和生命周期
- 掌握在 Element Plus 组件中集成自定义指令的技巧
- 学习高级指令开发模式和最佳实践
- 实践复杂业务场景下的指令应用

## 1. 自定义指令基础深入

### 1.1 指令生命周期与钩子函数

```typescript
// 指令生命周期钩子
interface DirectiveHooks {
  created?: DirectiveHook
  beforeMount?: DirectiveHook
  mounted?: DirectiveHook
  beforeUpdate?: DirectiveHook
  updated?: DirectiveHook
  beforeUnmount?: DirectiveHook
  unmounted?: DirectiveHook
}

type DirectiveHook = (
  el: HTMLElement,
  binding: DirectiveBinding,
  vnode: VNode,
  prevVNode?: VNode
) => void

interface DirectiveBinding {
  value: any
  oldValue: any
  arg?: string
  modifiers: Record<string, boolean>
  instance: ComponentInternalInstance | null
  dir: ObjectDirective
}

// 高级指令基类
abstract class AdvancedDirective implements ObjectDirective {
  protected options: any = {}
  protected instances: WeakMap<HTMLElement, any> = new WeakMap()
  
  constructor(options?: any) {
    this.options = { ...this.getDefaultOptions(), ...options }
  }
  
  protected abstract getDefaultOptions(): any
  
  created(el: HTMLElement, binding: DirectiveBinding): void {
    this.onCreate(el, binding)
  }
  
  beforeMount(el: HTMLElement, binding: DirectiveBinding): void {
    this.onBeforeMount(el, binding)
  }
  
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    const instance = this.createInstance(el, binding)
    this.instances.set(el, instance)
    this.onMounted(el, binding, instance)
  }
  
  beforeUpdate(el: HTMLElement, binding: DirectiveBinding): void {
    const instance = this.instances.get(el)
    this.onBeforeUpdate(el, binding, instance)
  }
  
  updated(el: HTMLElement, binding: DirectiveBinding): void {
    const instance = this.instances.get(el)
    this.onUpdated(el, binding, instance)
  }
  
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding): void {
    const instance = this.instances.get(el)
    this.onBeforeUnmount(el, binding, instance)
  }
  
  unmounted(el: HTMLElement, binding: DirectiveBinding): void {
    const instance = this.instances.get(el)
    this.onUnmounted(el, binding, instance)
    this.instances.delete(el)
  }
  
  protected onCreate(el: HTMLElement, binding: DirectiveBinding): void {}
  protected onBeforeMount(el: HTMLElement, binding: DirectiveBinding): void {}
  protected abstract createInstance(el: HTMLElement, binding: DirectiveBinding): any
  protected abstract onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void
  protected onBeforeUpdate(el: HTMLElement, binding: DirectiveBinding, instance: any): void {}
  protected onUpdated(el: HTMLElement, binding: DirectiveBinding, instance: any): void {}
  protected onBeforeUnmount(el: HTMLElement, binding: DirectiveBinding, instance: any): void {}
  protected onUnmounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {}
}
```

### 1.2 指令参数解析与验证

```typescript
// 指令参数解析器
class DirectiveArgumentParser {
  static parseValue(value: any, expectedType?: string): any {
    if (expectedType) {
      return this.validateAndConvert(value, expectedType)
    }
    return value
  }
  
  static parseModifiers(modifiers: Record<string, boolean>): any {
    const parsed = {}
    
    Object.keys(modifiers).forEach(modifier => {
      if (modifier.includes(':')) {
        const [key, value] = modifier.split(':')
        parsed[key] = this.parseModifierValue(value)
      } else {
        parsed[modifier] = true
      }
    })
    
    return parsed
  }
  
  static parseArgument(arg?: string): any {
    if (!arg) return null
    
    // 解析复杂参数格式：prop.subprop:value
    if (arg.includes(':')) {
      const [path, value] = arg.split(':')
      return {
        path: path.split('.'),
        value: this.parseModifierValue(value)
      }
    }
    
    return {
      path: arg.split('.'),
      value: true
    }
  }
  
  private static parseModifierValue(value: string): any {
    // 尝试解析为数字
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10)
    }
    
    // 尝试解析为浮点数
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value)
    }
    
    // 尝试解析为布尔值
    if (value === 'true') return true
    if (value === 'false') return false
    
    // 返回字符串
    return value
  }
  
  private static validateAndConvert(value: any, expectedType: string): any {
    switch (expectedType) {
      case 'string':
        return String(value)
      case 'number':
        const num = Number(value)
        if (isNaN(num)) {
          throw new Error(`Expected number, got ${typeof value}`)
        }
        return num
      case 'boolean':
        return Boolean(value)
      case 'object':
        if (typeof value !== 'object' || value === null) {
          throw new Error(`Expected object, got ${typeof value}`)
        }
        return value
      case 'array':
        if (!Array.isArray(value)) {
          throw new Error(`Expected array, got ${typeof value}`)
        }
        return value
      default:
        return value
    }
  }
}
```

## 2. Element Plus 组件增强指令

### 2.1 表单增强指令

```typescript
// 表单自动验证指令
class AutoValidateDirective extends AdvancedDirective {
  protected getDefaultOptions() {
    return {
      trigger: 'blur',
      debounce: 300,
      showError: true,
      errorClass: 'el-form-item__error'
    }
  }
  
  protected createInstance(el: HTMLElement, binding: DirectiveBinding) {
    const options = {
      ...this.options,
      ...DirectiveArgumentParser.parseModifiers(binding.modifiers)
    }
    
    return {
      options,
      validator: binding.value,
      errorElement: null,
      debounceTimer: null,
      isValidating: false
    }
  }
  
  protected onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const { options } = instance
    
    // 查找输入元素
    const inputEl = this.findInputElement(el)
    if (!inputEl) {
      console.warn('Auto-validate directive: input element not found')
      return
    }
    
    // 绑定事件
    this.bindEvents(inputEl, instance)
    
    // 创建错误显示元素
    if (options.showError) {
      instance.errorElement = this.createErrorElement()
      el.appendChild(instance.errorElement)
    }
  }
  
  private findInputElement(el: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
    // 查找 Element Plus 输入组件中的实际输入元素
    const selectors = [
      'input',
      'textarea',
      '.el-input__inner',
      '.el-textarea__inner'
    ]
    
    for (const selector of selectors) {
      const input = el.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement
      if (input) return input
    }
    
    return null
  }
  
  private bindEvents(inputEl: HTMLElement, instance: any): void {
    const { options, validator } = instance
    
    const validateHandler = () => {
      if (instance.debounceTimer) {
        clearTimeout(instance.debounceTimer)
      }
      
      instance.debounceTimer = setTimeout(() => {
        this.performValidation(inputEl, instance)
      }, options.debounce)
    }
    
    // 绑定验证触发事件
    if (options.trigger === 'input') {
      inputEl.addEventListener('input', validateHandler)
    } else if (options.trigger === 'blur') {
      inputEl.addEventListener('blur', validateHandler)
    } else if (options.trigger === 'change') {
      inputEl.addEventListener('change', validateHandler)
    }
    
    // 保存事件处理器以便清理
    instance.validateHandler = validateHandler
    instance.inputElement = inputEl
  }
  
  private async performValidation(inputEl: HTMLElement, instance: any): Promise<void> {
    const { validator, options } = instance
    const value = (inputEl as HTMLInputElement).value
    
    if (!validator || typeof validator !== 'function') {
      return
    }
    
    instance.isValidating = true
    
    try {
      const result = await validator(value)
      this.handleValidationResult(result, instance)
    } catch (error) {
      this.handleValidationError(error, instance)
    } finally {
      instance.isValidating = false
    }
  }
  
  private handleValidationResult(result: any, instance: any): void {
    const { options, errorElement } = instance
    
    if (result === true || result === undefined) {
      // 验证通过
      this.clearError(instance)
    } else {
      // 验证失败
      const errorMessage = typeof result === 'string' ? result : 'Validation failed'
      this.showError(errorMessage, instance)
    }
  }
  
  private handleValidationError(error: any, instance: any): void {
    const errorMessage = error.message || 'Validation error'
    this.showError(errorMessage, instance)
  }
  
  private showError(message: string, instance: any): void {
    const { errorElement, options } = instance
    
    if (errorElement && options.showError) {
      errorElement.textContent = message
      errorElement.style.display = 'block'
      errorElement.className = options.errorClass
    }
  }
  
  private clearError(instance: any): void {
    const { errorElement } = instance
    
    if (errorElement) {
      errorElement.style.display = 'none'
      errorElement.textContent = ''
    }
  }
  
  private createErrorElement(): HTMLElement {
    const errorEl = document.createElement('div')
    errorEl.style.display = 'none'
    errorEl.style.color = '#f56c6c'
    errorEl.style.fontSize = '12px'
    errorEl.style.lineHeight = '1'
    errorEl.style.paddingTop = '4px'
    return errorEl
  }
  
  protected onUnmounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const { inputElement, validateHandler, debounceTimer } = instance
    
    // 清理事件监听器
    if (inputElement && validateHandler) {
      inputElement.removeEventListener('input', validateHandler)
      inputElement.removeEventListener('blur', validateHandler)
      inputElement.removeEventListener('change', validateHandler)
    }
    
    // 清理定时器
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }
}

// 使用示例
const autoValidate = new AutoValidateDirective()

// 在组件中使用
// <el-input v-auto-validate.blur.300="validateEmail" />
```

### 2.2 表格增强指令

```typescript
// 表格行拖拽排序指令
class TableSortableDirective extends AdvancedDirective {
  protected getDefaultOptions() {
    return {
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      animation: 150,
      disabled: false
    }
  }
  
  protected createInstance(el: HTMLElement, binding: DirectiveBinding) {
    const options = {
      ...this.options,
      ...DirectiveArgumentParser.parseModifiers(binding.modifiers),
      onEnd: binding.value
    }
    
    return {
      options,
      sortableInstance: null,
      tableBody: null
    }
  }
  
  protected onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    // 查找表格体元素
    const tableBody = el.querySelector('tbody') || el.querySelector('.el-table__body tbody')
    if (!tableBody) {
      console.warn('Table sortable directive: tbody not found')
      return
    }
    
    instance.tableBody = tableBody
    
    // 动态导入 Sortable.js
    this.loadSortable().then(Sortable => {
      instance.sortableInstance = new Sortable(tableBody, {
        ...instance.options,
        onEnd: (evt) => this.handleSortEnd(evt, instance)
      })
    })
  }
  
  private async loadSortable(): Promise<any> {
    // 动态导入 Sortable.js
    try {
      const { default: Sortable } = await import('sortablejs')
      return Sortable
    } catch (error) {
      console.error('Failed to load Sortable.js:', error)
      throw error
    }
  }
  
  private handleSortEnd(evt: any, instance: any): void {
    const { options } = instance
    const { oldIndex, newIndex } = evt
    
    if (oldIndex !== newIndex && options.onEnd) {
      options.onEnd({
        oldIndex,
        newIndex,
        element: evt.item
      })
    }
  }
  
  protected onUpdated(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const { sortableInstance } = instance
    
    if (sortableInstance) {
      // 更新配置
      const newOptions = {
        ...instance.options,
        ...DirectiveArgumentParser.parseModifiers(binding.modifiers)
      }
      
      Object.assign(instance.options, newOptions)
      
      // 更新 Sortable 实例选项
      sortableInstance.option('disabled', newOptions.disabled)
    }
  }
  
  protected onUnmounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const { sortableInstance } = instance
    
    if (sortableInstance) {
      sortableInstance.destroy()
    }
  }
}

// 表格虚拟滚动指令
class TableVirtualScrollDirective extends AdvancedDirective {
  protected getDefaultOptions() {
    return {
      itemHeight: 40,
      bufferSize: 5,
      threshold: 100
    }
  }
  
  protected createInstance(el: HTMLElement, binding: DirectiveBinding) {
    return {
      options: {
        ...this.options,
        ...DirectiveArgumentParser.parseModifiers(binding.modifiers)
      },
      data: binding.value || [],
      scrollContainer: null,
      virtualList: null,
      startIndex: 0,
      endIndex: 0,
      scrollTop: 0
    }
  }
  
  protected onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const scrollContainer = el.querySelector('.el-table__body-wrapper')
    if (!scrollContainer) {
      console.warn('Virtual scroll directive: scroll container not found')
      return
    }
    
    instance.scrollContainer = scrollContainer
    this.setupVirtualScroll(instance)
  }
  
  private setupVirtualScroll(instance: any): void {
    const { scrollContainer, options } = instance
    
    // 创建虚拟列表容器
    const virtualList = document.createElement('div')
    virtualList.style.position = 'relative'
    virtualList.style.height = `${instance.data.length * options.itemHeight}px`
    
    instance.virtualList = virtualList
    
    // 监听滚动事件
    scrollContainer.addEventListener('scroll', () => {
      this.handleScroll(instance)
    })
    
    // 初始渲染
    this.updateVisibleItems(instance)
  }
  
  private handleScroll(instance: any): void {
    const { scrollContainer, options } = instance
    const scrollTop = scrollContainer.scrollTop
    
    instance.scrollTop = scrollTop
    
    // 计算可见范围
    const containerHeight = scrollContainer.clientHeight
    const startIndex = Math.floor(scrollTop / options.itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / options.itemHeight) + options.bufferSize,
      instance.data.length
    )
    
    instance.startIndex = Math.max(0, startIndex - options.bufferSize)
    instance.endIndex = endIndex
    
    this.updateVisibleItems(instance)
  }
  
  private updateVisibleItems(instance: any): void {
    const { startIndex, endIndex, data, options } = instance
    
    // 触发父组件更新可见项
    if (instance.options.onVisibleChange) {
      instance.options.onVisibleChange({
        startIndex,
        endIndex,
        visibleData: data.slice(startIndex, endIndex)
      })
    }
  }
}
```

## 3. 业务场景指令

### 3.1 权限控制指令

```typescript
// 权限控制指令
class PermissionDirective extends AdvancedDirective {
  private permissionService: PermissionService
  
  constructor(permissionService: PermissionService) {
    super()
    this.permissionService = permissionService
  }
  
  protected getDefaultOptions() {
    return {
      mode: 'hide', // hide, disable, readonly
      fallback: null,
      checkInterval: 0 // 0 表示不定期检查
    }
  }
  
  protected createInstance(el: HTMLElement, binding: DirectiveBinding) {
    const permissions = Array.isArray(binding.value) ? binding.value : [binding.value]
    const mode = binding.arg || this.options.mode
    
    return {
      permissions,
      mode,
      originalDisplay: el.style.display,
      originalDisabled: (el as any).disabled,
      originalReadonly: (el as any).readonly,
      checkTimer: null,
      lastCheckResult: null
    }
  }
  
  protected onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    this.checkPermissions(el, instance)
    
    // 设置定期检查
    if (this.options.checkInterval > 0) {
      instance.checkTimer = setInterval(() => {
        this.checkPermissions(el, instance)
      }, this.options.checkInterval)
    }
  }
  
  private async checkPermissions(el: HTMLElement, instance: any): Promise<void> {
    const { permissions, mode } = instance
    
    try {
      const hasPermission = await this.permissionService.hasAnyPermission(permissions)
      
      if (hasPermission !== instance.lastCheckResult) {
        instance.lastCheckResult = hasPermission
        this.applyPermissionResult(el, instance, hasPermission)
      }
    } catch (error) {
      console.error('Permission check failed:', error)
      this.applyPermissionResult(el, instance, false)
    }
  }
  
  private applyPermissionResult(el: HTMLElement, instance: any, hasPermission: boolean): void {
    const { mode, originalDisplay, originalDisabled, originalReadonly } = instance
    
    if (hasPermission) {
      // 恢复原始状态
      el.style.display = originalDisplay
      if ('disabled' in el) {
        (el as any).disabled = originalDisabled
      }
      if ('readonly' in el) {
        (el as any).readonly = originalReadonly
      }
    } else {
      // 应用权限限制
      switch (mode) {
        case 'hide':
          el.style.display = 'none'
          break
        case 'disable':
          if ('disabled' in el) {
            (el as any).disabled = true
          }
          break
        case 'readonly':
          if ('readonly' in el) {
            (el as any).readonly = true
          }
          break
      }
    }
    
    // 触发权限变更事件
    el.dispatchEvent(new CustomEvent('permission-change', {
      detail: { hasPermission, mode }
    }))
  }
  
  protected onUnmounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    if (instance.checkTimer) {
      clearInterval(instance.checkTimer)
    }
  }
}

// 权限服务接口
interface PermissionService {
  hasPermission(permission: string): Promise<boolean>
  hasAnyPermission(permissions: string[]): Promise<boolean>
  hasAllPermissions(permissions: string[]): Promise<boolean>
}

// 权限服务实现
class DefaultPermissionService implements PermissionService {
  private userPermissions: Set<string> = new Set()
  
  constructor(permissions: string[] = []) {
    this.userPermissions = new Set(permissions)
  }
  
  async hasPermission(permission: string): Promise<boolean> {
    return this.userPermissions.has(permission)
  }
  
  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    return permissions.some(permission => this.userPermissions.has(permission))
  }
  
  async hasAllPermissions(permissions: string[]): Promise<boolean> {
    return permissions.every(permission => this.userPermissions.has(permission))
  }
  
  updatePermissions(permissions: string[]): void {
    this.userPermissions = new Set(permissions)
  }
}
```

### 3.2 数据加载指令

```typescript
// 懒加载指令
class LazyLoadDirective extends AdvancedDirective {
  protected getDefaultOptions() {
    return {
      threshold: 0.1,
      rootMargin: '50px',
      once: true,
      placeholder: null,
      errorPlaceholder: null
    }
  }
  
  protected createInstance(el: HTMLElement, binding: DirectiveBinding) {
    return {
      options: {
        ...this.options,
        ...DirectiveArgumentParser.parseModifiers(binding.modifiers)
      },
      loader: binding.value,
      observer: null,
      isLoaded: false,
      isLoading: false,
      error: null
    }
  }
  
  protected onMounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    const { options } = instance
    
    // 设置占位符
    if (options.placeholder) {
      this.setPlaceholder(el, options.placeholder)
    }
    
    // 创建 Intersection Observer
    instance.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries, instance),
      {
        threshold: options.threshold,
        rootMargin: options.rootMargin
      }
    )
    
    instance.observer.observe(el)
  }
  
  private async handleIntersection(entries: IntersectionObserverEntry[], instance: any): Promise<void> {
    const entry = entries[0]
    
    if (entry.isIntersecting && !instance.isLoaded && !instance.isLoading) {
      instance.isLoading = true
      
      try {
        await this.loadContent(entry.target as HTMLElement, instance)
        instance.isLoaded = true
        
        if (instance.options.once) {
          instance.observer.unobserve(entry.target)
        }
      } catch (error) {
        instance.error = error
        this.handleLoadError(entry.target as HTMLElement, instance, error)
      } finally {
        instance.isLoading = false
      }
    }
  }
  
  private async loadContent(el: HTMLElement, instance: any): Promise<void> {
    const { loader } = instance
    
    if (typeof loader === 'function') {
      const content = await loader()
      this.setContent(el, content)
    } else if (typeof loader === 'string') {
      // 假设是图片 URL
      await this.loadImage(el, loader)
    } else {
      throw new Error('Invalid loader type')
    }
  }
  
  private loadImage(el: HTMLElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        if (el.tagName === 'IMG') {
          (el as HTMLImageElement).src = src
        } else {
          el.style.backgroundImage = `url(${src})`
        }
        resolve()
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`))
      }
      
      img.src = src
    })
  }
  
  private setContent(el: HTMLElement, content: any): void {
    if (typeof content === 'string') {
      el.innerHTML = content
    } else if (content instanceof HTMLElement) {
      el.appendChild(content)
    } else {
      el.textContent = String(content)
    }
  }
  
  private setPlaceholder(el: HTMLElement, placeholder: any): void {
    if (typeof placeholder === 'string') {
      el.innerHTML = placeholder
    } else {
      el.appendChild(placeholder)
    }
  }
  
  private handleLoadError(el: HTMLElement, instance: any, error: Error): void {
    const { options } = instance
    
    if (options.errorPlaceholder) {
      this.setPlaceholder(el, options.errorPlaceholder)
    }
    
    // 触发错误事件
    el.dispatchEvent(new CustomEvent('lazy-load-error', {
      detail: { error }
    }))
  }
  
  protected onUnmounted(el: HTMLElement, binding: DirectiveBinding, instance: any): void {
    if (instance.observer) {
      instance.observer.disconnect()
    }
  }
}
```

## 4. 指令组合与复用

### 4.1 指令工厂模式

```typescript
// 指令工厂
class DirectiveFactory {
  private static directives: Map<string, any> = new Map()
  
  static register(name: string, directive: any): void {
    this.directives.set(name, directive)
  }
  
  static create(name: string, options?: any): any {
    const DirectiveClass = this.directives.get(name)
    if (!DirectiveClass) {
      throw new Error(`Directive ${name} not found`)
    }
    
    return new DirectiveClass(options)
  }
  
  static createComposite(directives: Array<{ name: string; options?: any }>): any {
    return new CompositeDirective(directives.map(({ name, options }) => 
      this.create(name, options)
    ))
  }
}

// 复合指令
class CompositeDirective {
  private directives: any[]
  
  constructor(directives: any[]) {
    this.directives = directives
  }
  
  created(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.created) {
        directive.created(el, binding)
      }
    })
  }
  
  beforeMount(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.beforeMount) {
        directive.beforeMount(el, binding)
      }
    })
  }
  
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.mounted) {
        directive.mounted(el, binding)
      }
    })
  }
  
  beforeUpdate(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.beforeUpdate) {
        directive.beforeUpdate(el, binding)
      }
    })
  }
  
  updated(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.updated) {
        directive.updated(el, binding)
      }
    })
  }
  
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.beforeUnmount) {
        directive.beforeUnmount(el, binding)
      }
    })
  }
  
  unmounted(el: HTMLElement, binding: DirectiveBinding): void {
    this.directives.forEach(directive => {
      if (directive.unmounted) {
        directive.unmounted(el, binding)
      }
    })
  }
}

// 注册指令
DirectiveFactory.register('autoValidate', AutoValidateDirective)
DirectiveFactory.register('permission', PermissionDirective)
DirectiveFactory.register('lazyLoad', LazyLoadDirective)
DirectiveFactory.register('tableSortable', TableSortableDirective)

// 使用示例
const compositeDirective = DirectiveFactory.createComposite([
  { name: 'permission', options: { mode: 'disable' } },
  { name: 'autoValidate', options: { trigger: 'input' } }
])
```

## 5. 实践练习

1. **基础指令开发**：
   - 实现表单自动保存指令
   - 创建元素拖拽指令
   - 开发图片懒加载指令

2. **高级指令应用**：
   - 实现复杂的权限控制系统
   - 创建虚拟滚动指令
   - 开发数据可视化指令

3. **指令生态建设**：
   - 设计指令组合模式
   - 建立指令测试框架
   - 创建指令文档系统

## 6. 学习资源

- [Vue 3 Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html)
- [Element Plus Directive Examples](https://github.com/element-plus/element-plus/tree/dev/packages/directives)
- [Advanced Directive Patterns](https://vueschool.io/articles/vuejs-tutorials/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 7. 作业

- 实现一个完整的表单验证指令系统
- 开发一个支持多种模式的权限控制指令
- 创建一个高性能的虚拟滚动指令
- 设计指令开发最佳实践文档

## 总结

通过第72天的学习，我们深入掌握了：

1. **指令原理**：理解了 Vue 3 自定义指令的生命周期和钩子函数
2. **组件集成**：学会了在 Element Plus 组件中集成自定义指令
3. **高级模式**：掌握了复杂指令的开发模式和最佳实践
4. **业务应用**：实践了权限控制、数据加载等业务场景的指令实现

这些技能将帮助我们构建更加灵活和强大的 Element Plus 应用。