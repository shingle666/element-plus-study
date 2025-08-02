# Day 72: Custom Directives in Components

## Learning Objectives

- Deeply understand the principles and lifecycle of Vue 3 custom directives
- Master techniques for integrating custom directives in Element Plus components
- Learn advanced directive development patterns and best practices
- Practice directive applications in complex business scenarios

## 1. Custom Directive Fundamentals

### 1.1 Directive Lifecycle and Hook Functions

```typescript
// Directive lifecycle hooks
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

// Advanced directive base class
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

### 1.2 Directive Argument Parsing and Validation

```typescript
// Directive argument parser
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
    
    // Parse complex argument format: prop.subprop:value
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
    // Try to parse as integer
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10)
    }
    
    // Try to parse as float
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value)
    }
    
    // Try to parse as boolean
    if (value === 'true') return true
    if (value === 'false') return false
    
    // Return as string
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

## 2. Element Plus Component Enhancement Directives

### 2.1 Form Enhancement Directives

```typescript
// Form auto-validate directive
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
    
    // Find input element
    const inputEl = this.findInputElement(el)
    if (!inputEl) {
      console.warn('Auto-validate directive: input element not found')
      return
    }
    
    // Bind events
    this.bindEvents(inputEl, instance)
    
    // Create error display element
    if (options.showError) {
      instance.errorElement = this.createErrorElement()
      el.appendChild(instance.errorElement)
    }
  }
  
  private findInputElement(el: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
    // Find actual input element in Element Plus input component
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
    
    // Bind validation trigger events
    if (options.trigger === 'input') {
      inputEl.addEventListener('input', validateHandler)
    } else if (options.trigger === 'blur') {
      inputEl.addEventListener('blur', validateHandler)
    } else if (options.trigger === 'change') {
      inputEl.addEventListener('change', validateHandler)
    }
    
    // Save event handler for cleanup
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
      // Validation passed
      this.clearError(instance)
    } else {
      // Validation failed
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
    
    // Clean up event listeners
    if (inputElement && validateHandler) {
      inputElement.removeEventListener('input', validateHandler)
      inputElement.removeEventListener('blur', validateHandler)
      inputElement.removeEventListener('change', validateHandler)
    }
    
    // Clean up timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }
}

// Usage example
const autoValidate = new AutoValidateDirective()

// Use in component
// <el-input v-auto-validate.blur.300="validateEmail" />
```

### 2.2 Table Enhancement Directives

```typescript
// Table row drag-and-drop sorting directive
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
    // Find table body element
    const tableBody = el.querySelector('tbody') || el.querySelector('.el-table__body tbody')
    if (!tableBody) {
      console.warn('Table sortable directive: tbody not found')
      return
    }
    
    instance.tableBody = tableBody
    
    // Dynamically import Sortable.js
    this.loadSortable().then(Sortable => {
      instance.sortableInstance = new Sortable(tableBody, {
        ...instance.options,
        onEnd: (evt) => this.handleSortEnd(evt, instance)
      })
    })
  }
  
  private async loadSortable(): Promise<any> {
    // Dynamically import Sortable.js
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
      // Update configuration
      const newOptions = {
        ...instance.options,
        ...DirectiveArgumentParser.parseModifiers(binding.modifiers)
      }
      
      Object.assign(instance.options, newOptions)
      
      // Update Sortable instance options
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

// Table virtual scroll directive
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
    
    // Create virtual list container
    const virtualList = document.createElement('div')
    virtualList.style.position = 'relative'
    virtualList.style.height = `${instance.data.length * options.itemHeight}px`
    
    instance.virtualList = virtualList
    
    // Listen for scroll events
    scrollContainer.addEventListener('scroll', () => {
      this.handleScroll(instance)
    })
    
    // Initial render
    this.updateVisibleItems(instance)
  }
  
  private handleScroll(instance: any): void {
    const { scrollContainer, options } = instance
    const scrollTop = scrollContainer.scrollTop
    
    instance.scrollTop = scrollTop
    
    // Calculate visible range
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
    
    // Trigger parent component to update visible items
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

## 3. Business Scenario Directives

### 3.1 Permission Control Directive

```typescript
// Permission control directive
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
      checkInterval: 0 // 0 means no periodic check
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
    
    // Set up periodic check
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
      // Restore original state
      el.style.display = originalDisplay
      if ('disabled' in el) {
        (el as any).disabled = originalDisabled
      }
      if ('readonly' in el) {
        (el as any).readonly = originalReadonly
      }
    } else {
      // Apply permission restriction
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
    
    // Trigger permission change event
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

// Permission service interface
interface PermissionService {
  hasPermission(permission: string): Promise<boolean>
  hasAnyPermission(permissions: string[]): Promise<boolean>
  hasAllPermissions(permissions: string[]): Promise<boolean>
}

// Permission service implementation
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

### 3.2 Data Loading Directive

```typescript
// Lazy loading directive
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
    
    // Set placeholder
    if (options.placeholder) {
      this.setPlaceholder(el, options.placeholder)
    }
    
    // Create Intersection Observer
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
      // Assume it's an image URL
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
    
    // Trigger error event
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

## 4. Directive Composition and Reuse

### 4.1 Directive Factory Pattern

```typescript
// Directive factory
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

// Composite directive
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

// Register directives
DirectiveFactory.register('autoValidate', AutoValidateDirective)
DirectiveFactory.register('permission', PermissionDirective)
DirectiveFactory.register('lazyLoad', LazyLoadDirective)
DirectiveFactory.register('tableSortable', TableSortableDirective)

// Usage example
const compositeDirective = DirectiveFactory.createComposite([
  { name: 'permission', options: { mode: 'disable' } },
  { name: 'autoValidate', options: { trigger: 'input' } }
])
```

## 5. Practical Exercises

1. **Basic Directive Development**:
   - Implement form auto-save directive
   - Create element drag directive
   - Develop image lazy loading directive

2. **Advanced Directive Application**:
   - Implement complex permission control system
   - Create virtual scrolling directive
   - Develop data visualization directive

3. **Directive Ecosystem Building**:
   - Design directive composition pattern
   - Establish directive testing framework
   - Create directive documentation system

## 6. Learning Resources

- [Vue 3 Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html)
- [Element Plus Directive Examples](https://github.com/element-plus/element-plus/tree/dev/packages/directives)
- [Advanced Directive Patterns](https://vueschool.io/articles/vuejs-tutorials/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## 7. Assignments

- Implement a complete form validation directive system
- Develop a permission control directive supporting multiple modes
- Create a high-performance virtual scrolling directive
- Design directive development best practices documentation

## Summary

Through Day 72's learning, we have mastered:

1. **Directive Principles**: Understanding Vue 3 custom directive lifecycle and hook functions
2. **Component Integration**: Learning how to integrate custom directives in Element Plus components
3. **Advanced Patterns**: Mastering complex directive development patterns and best practices
4. **Business Applications**: Practicing directive implementation for permission control, data loading, and other business scenarios

These skills will help us build more flexible and powerful Element Plus applications.