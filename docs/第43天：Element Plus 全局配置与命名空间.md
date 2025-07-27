# 第43天：Element Plus 全局配置与命名空间

## 学习目标

- 深入理解 Element Plus 全局配置系统
- 掌握命名空间管理和样式隔离技术
- 学会自定义全局配置和主题变量
- 实现多实例配置和配置继承机制
- 优化配置管理和性能

## 1. Element Plus 全局配置系统

### 1.1 配置系统架构
```typescript
// 全局配置系统架构
interface GlobalConfigSystem {
  // 配置管理器
  configManager: ConfigManager
  // 命名空间管理器
  namespaceManager: NamespaceManager
  // 主题管理器
  themeManager: ThemeManager
  // 组件配置器
  componentConfigurator: ComponentConfigurator
  // 配置验证器
  configValidator: ConfigValidator
}

// 全局配置接口
interface GlobalConfig {
  // 命名空间
  namespace?: string
  // 尺寸
  size?: ComponentSize
  // 层级
  zIndex?: number
  // 语言
  locale?: Locale
  // 主题
  theme?: ThemeConfig
  // 组件默认配置
  components?: ComponentsConfig
  // 实验性功能
  experimental?: ExperimentalConfig
  // 性能配置
  performance?: PerformanceConfig
  // 可访问性配置
  accessibility?: AccessibilityConfig
}

// 配置管理器
class ConfigManager {
  private config: GlobalConfig = {}
  private observers: Set<ConfigObserver> = new Set()
  private validators: Map<string, ConfigValidator> = new Map()
  private middlewares: ConfigMiddleware[] = []

  constructor(initialConfig?: Partial<GlobalConfig>) {
    if (initialConfig) {
      this.setConfig(initialConfig)
    }
    this.setupDefaultValidators()
  }

  // 设置配置
  setConfig(config: Partial<GlobalConfig>): void {
    const oldConfig = { ...this.config }
    const newConfig = this.mergeConfig(this.config, config)
    
    // 验证配置
    const validationResult = this.validateConfig(newConfig)
    if (!validationResult.valid) {
      throw new Error(`Invalid config: ${validationResult.errors.join(', ')}`)
    }
    
    // 应用中间件
    const processedConfig = this.applyMiddlewares(newConfig)
    
    this.config = processedConfig
    this.notifyObservers('configChanged', { oldConfig, newConfig: processedConfig })
  }

  // 获取配置
  getConfig(): GlobalConfig {
    return { ...this.config }
  }

  // 获取配置项
  getConfigValue<K extends keyof GlobalConfig>(key: K): GlobalConfig[K] {
    return this.config[key]
  }

  // 更新配置项
  updateConfigValue<K extends keyof GlobalConfig>(key: K, value: GlobalConfig[K]): void {
    this.setConfig({ [key]: value } as Partial<GlobalConfig>)
  }

  // 合并配置
  private mergeConfig(base: GlobalConfig, override: Partial<GlobalConfig>): GlobalConfig {
    const merged = { ...base }
    
    Object.keys(override).forEach(key => {
      const typedKey = key as keyof GlobalConfig
      const value = override[typedKey]
      
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          merged[typedKey] = {
            ...(merged[typedKey] as object || {}),
            ...value
          } as GlobalConfig[typeof typedKey]
        } else {
          merged[typedKey] = value
        }
      }
    })
    
    return merged
  }

  // 验证配置
  private validateConfig(config: GlobalConfig): ValidationResult {
    const errors: string[] = []
    
    for (const [key, validator] of this.validators) {
      const value = config[key as keyof GlobalConfig]
      if (value !== undefined) {
        const result = validator.validate(value)
        if (!result.valid) {
          errors.push(...result.errors)
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  // 应用中间件
  private applyMiddlewares(config: GlobalConfig): GlobalConfig {
    return this.middlewares.reduce((acc, middleware) => {
      return middleware.process(acc)
    }, config)
  }

  // 设置默认验证器
  private setupDefaultValidators(): void {
    // 尺寸验证器
    this.validators.set('size', {
      validate: (value: any) => {
        const validSizes = ['large', 'default', 'small']
        return {
          valid: validSizes.includes(value),
          errors: validSizes.includes(value) ? [] : [`Invalid size: ${value}`]
        }
      }
    })
    
    // 层级验证器
    this.validators.set('zIndex', {
      validate: (value: any) => {
        const isValid = typeof value === 'number' && value >= 0
        return {
          valid: isValid,
          errors: isValid ? [] : ['zIndex must be a non-negative number']
        }
      }
    })
    
    // 命名空间验证器
    this.validators.set('namespace', {
      validate: (value: any) => {
        const isValid = typeof value === 'string' && /^[a-zA-Z][a-zA-Z0-9-_]*$/.test(value)
        return {
          valid: isValid,
          errors: isValid ? [] : ['namespace must be a valid CSS class name']
        }
      }
    })
  }

  // 添加验证器
  addValidator(key: string, validator: ConfigValidator): void {
    this.validators.set(key, validator)
  }

  // 添加中间件
  addMiddleware(middleware: ConfigMiddleware): void {
    this.middlewares.push(middleware)
  }

  // 添加观察者
  addObserver(observer: ConfigObserver): void {
    this.observers.add(observer)
  }

  // 移除观察者
  removeObserver(observer: ConfigObserver): void {
    this.observers.delete(observer)
  }

  // 通知观察者
  private notifyObservers(event: string, data: any): void {
    this.observers.forEach(observer => {
      observer.onConfigEvent?.(event, data)
    })
  }

  // 重置配置
  reset(): void {
    const oldConfig = { ...this.config }
    this.config = {}
    this.notifyObservers('configReset', { oldConfig })
  }

  // 导出配置
  export(): string {
    return JSON.stringify(this.config, null, 2)
  }

  // 导入配置
  import(configJson: string): void {
    try {
      const config = JSON.parse(configJson)
      this.setConfig(config)
    } catch (error) {
      throw new Error('Invalid config JSON')
    }
  }
}

// 配置验证器接口
interface ConfigValidator {
  validate(value: any): ValidationResult
}

// 验证结果
interface ValidationResult {
  valid: boolean
  errors: string[]
}

// 配置中间件
interface ConfigMiddleware {
  process(config: GlobalConfig): GlobalConfig
}

// 配置观察者
interface ConfigObserver {
  onConfigEvent?(event: string, data: any): void
}

// 组件尺寸
type ComponentSize = 'large' | 'default' | 'small'

// 语言配置
interface Locale {
  name: string
  messages: Record<string, any>
}

// 主题配置
interface ThemeConfig {
  name: string
  colors: Record<string, string>
  variables: Record<string, string>
}

// 组件配置
interface ComponentsConfig {
  button?: ButtonConfig
  input?: InputConfig
  table?: TableConfig
  form?: FormConfig
  dialog?: DialogConfig
  message?: MessageConfig
  [key: string]: any
}

// 实验性功能配置
interface ExperimentalConfig {
  virtualScrolling?: boolean
  lazyLoading?: boolean
  asyncComponents?: boolean
  webComponents?: boolean
}

// 性能配置
interface PerformanceConfig {
  debounceTime?: number
  throttleTime?: number
  cacheSize?: number
  enableVirtualization?: boolean
}

// 可访问性配置
interface AccessibilityConfig {
  enableScreenReader?: boolean
  enableKeyboardNavigation?: boolean
  enableHighContrast?: boolean
  enableReducedMotion?: boolean
}
```

### 1.2 命名空间管理器
```typescript
// 命名空间管理器
class NamespaceManager {
  private namespaces: Map<string, NamespaceConfig> = new Map()
  private currentNamespace: string = 'el'
  private cssVariablePrefix: string = '--el'
  private classPrefix: string = 'el'

  constructor(defaultNamespace?: string) {
    if (defaultNamespace) {
      this.currentNamespace = defaultNamespace
      this.updatePrefixes(defaultNamespace)
    }
    this.registerDefaultNamespace()
  }

  // 注册命名空间
  registerNamespace(name: string, config: NamespaceConfig): void {
    this.validateNamespace(name)
    this.namespaces.set(name, {
      ...config,
      name,
      createdAt: new Date(),
      isActive: false
    })
  }

  // 设置当前命名空间
  setCurrentNamespace(name: string): void {
    if (!this.namespaces.has(name)) {
      throw new Error(`Namespace '${name}' not found`)
    }

    // 停用当前命名空间
    const current = this.namespaces.get(this.currentNamespace)
    if (current) {
      current.isActive = false
    }

    // 激活新命名空间
    const newNamespace = this.namespaces.get(name)!
    newNamespace.isActive = true
    this.currentNamespace = name
    this.updatePrefixes(name)
    
    // 应用命名空间样式
    this.applyNamespaceStyles(newNamespace)
  }

  // 获取当前命名空间
  getCurrentNamespace(): string {
    return this.currentNamespace
  }

  // 获取命名空间配置
  getNamespaceConfig(name: string): NamespaceConfig | undefined {
    return this.namespaces.get(name)
  }

  // 获取所有命名空间
  getAllNamespaces(): NamespaceConfig[] {
    return Array.from(this.namespaces.values())
  }

  // 生成CSS类名
  generateClassName(component: string, modifier?: string, element?: string): string {
    let className = `${this.classPrefix}-${component}`
    
    if (element) {
      className += `__${element}`
    }
    
    if (modifier) {
      className += `--${modifier}`
    }
    
    return className
  }

  // 生成CSS变量名
  generateCSSVariable(name: string): string {
    return `${this.cssVariablePrefix}-${name}`
  }

  // 创建样式隔离
  createStyleIsolation(namespace: string): StyleIsolation {
    return new StyleIsolation(namespace, this)
  }

  // 验证命名空间
  private validateNamespace(name: string): void {
    if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
      throw new Error('Invalid namespace name')
    }
    
    if (this.namespaces.has(name)) {
      throw new Error(`Namespace '${name}' already exists`)
    }
  }

  // 更新前缀
  private updatePrefixes(namespace: string): void {
    this.classPrefix = namespace
    this.cssVariablePrefix = `--${namespace}`
  }

  // 应用命名空间样式
  private applyNamespaceStyles(config: NamespaceConfig): void {
    if (typeof document === 'undefined') return

    // 移除旧的命名空间样式
    const oldStyle = document.getElementById('el-namespace-styles')
    if (oldStyle) {
      oldStyle.remove()
    }

    // 创建新的样式
    const style = document.createElement('style')
    style.id = 'el-namespace-styles'
    style.textContent = this.generateNamespaceCSS(config)
    document.head.appendChild(style)
  }

  // 生成命名空间CSS
  private generateNamespaceCSS(config: NamespaceConfig): string {
    const { name, variables, customProperties } = config
    let css = ''

    // 生成CSS变量
    if (variables) {
      css += `:root {\n`
      Object.entries(variables).forEach(([key, value]) => {
        css += `  --${name}-${key}: ${value};\n`
      })
      css += `}\n\n`
    }

    // 生成自定义属性
    if (customProperties) {
      Object.entries(customProperties).forEach(([selector, properties]) => {
        css += `${selector} {\n`
        Object.entries(properties).forEach(([prop, value]) => {
          css += `  ${prop}: ${value};\n`
        })
        css += `}\n\n`
      })
    }

    return css
  }

  // 注册默认命名空间
  private registerDefaultNamespace(): void {
    this.registerNamespace('el', {
      name: 'el',
      description: 'Default Element Plus namespace',
      variables: {
        'color-primary': '#409eff',
        'color-success': '#67c23a',
        'color-warning': '#e6a23c',
        'color-danger': '#f56c6c',
        'color-info': '#909399'
      },
      customProperties: {},
      isActive: true,
      createdAt: new Date()
    })
  }

  // 移除命名空间
  removeNamespace(name: string): void {
    if (name === 'el') {
      throw new Error('Cannot remove default namespace')
    }
    
    if (name === this.currentNamespace) {
      this.setCurrentNamespace('el')
    }
    
    this.namespaces.delete(name)
  }

  // 克隆命名空间
  cloneNamespace(sourceName: string, targetName: string): void {
    const source = this.namespaces.get(sourceName)
    if (!source) {
      throw new Error(`Source namespace '${sourceName}' not found`)
    }
    
    this.registerNamespace(targetName, {
      ...source,
      name: targetName,
      description: `Cloned from ${sourceName}`,
      isActive: false
    })
  }
}

// 命名空间配置
interface NamespaceConfig {
  name: string
  description?: string
  variables?: Record<string, string>
  customProperties?: Record<string, Record<string, string>>
  isActive?: boolean
  createdAt?: Date
}

// 样式隔离类
class StyleIsolation {
  private namespace: string
  private namespaceManager: NamespaceManager
  private isolatedStyles: Map<string, string> = new Map()

  constructor(namespace: string, namespaceManager: NamespaceManager) {
    this.namespace = namespace
    this.namespaceManager = namespaceManager
  }

  // 隔离CSS选择器
  isolateSelector(selector: string): string {
    // 简单的选择器隔离实现
    const prefix = `.${this.namespace}`
    
    if (selector.startsWith(':root')) {
      return selector.replace(':root', `:root .${this.namespace}`)
    }
    
    if (selector.startsWith('.')  || selector.startsWith('#')) {
      return `${prefix} ${selector}`
    }
    
    return `${prefix} ${selector}`
  }

  // 隔离CSS规则
  isolateCSS(css: string): string {
    const rules = this.parseCSS(css)
    return rules.map(rule => {
      if (rule.type === 'rule') {
        const isolatedSelectors = rule.selectors.map(sel => this.isolateSelector(sel))
        return `${isolatedSelectors.join(', ')} {\n${rule.declarations}\n}`
      }
      return rule.raw
    }).join('\n\n')
  }

  // 解析CSS
  private parseCSS(css: string): CSSRule[] {
    const rules: CSSRule[] = []
    const ruleRegex = /([^{]+)\{([^}]+)\}/g
    let match

    while ((match = ruleRegex.exec(css)) !== null) {
      const selectors = match[1].trim().split(',').map(s => s.trim())
      const declarations = match[2].trim()
      
      rules.push({
        type: 'rule',
        selectors,
        declarations,
        raw: match[0]
      })
    }

    return rules
  }

  // 应用隔离样式
  applyIsolatedStyles(css: string, id?: string): void {
    if (typeof document === 'undefined') return

    const styleId = id || `isolated-styles-${this.namespace}`
    const isolatedCSS = this.isolateCSS(css)
    
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }
    
    styleElement.textContent = isolatedCSS
    this.isolatedStyles.set(styleId, isolatedCSS)
  }

  // 移除隔离样式
  removeIsolatedStyles(id: string): void {
    if (typeof document === 'undefined') return

    const styleElement = document.getElementById(id)
    if (styleElement) {
      styleElement.remove()
      this.isolatedStyles.delete(id)
    }
  }

  // 获取所有隔离样式
  getAllIsolatedStyles(): Record<string, string> {
    return Object.fromEntries(this.isolatedStyles)
  }
}

// CSS规则接口
interface CSSRule {
  type: 'rule' | 'media' | 'keyframes' | 'import'
  selectors?: string[]
  declarations?: string
  raw: string
}
```

### 1.3 组件配置器
```typescript
// 组件配置器
class ComponentConfigurator {
  private componentConfigs: Map<string, ComponentConfig> = new Map()
  private globalConfig: GlobalConfig
  private configManager: ConfigManager

  constructor(configManager: ConfigManager) {
    this.configManager = configManager
    this.globalConfig = configManager.getConfig()
    this.setupDefaultConfigs()
    
    // 监听全局配置变化
    configManager.addObserver({
      onConfigEvent: (event, data) => {
        if (event === 'configChanged') {
          this.globalConfig = data.newConfig
          this.updateComponentConfigs()
        }
      }
    })
  }

  // 注册组件配置
  registerComponentConfig(name: string, config: ComponentConfig): void {
    this.componentConfigs.set(name, {
      ...config,
      name,
      registeredAt: new Date()
    })
  }

  // 获取组件配置
  getComponentConfig(name: string): ResolvedComponentConfig {
    const componentConfig = this.componentConfigs.get(name)
    const globalComponentConfig = this.globalConfig.components?.[name]
    
    return this.resolveConfig(componentConfig, globalComponentConfig)
  }

  // 更新组件配置
  updateComponentConfig(name: string, config: Partial<ComponentConfig>): void {
    const existing = this.componentConfigs.get(name)
    if (existing) {
      this.componentConfigs.set(name, {
        ...existing,
        ...config,
        updatedAt: new Date()
      })
    } else {
      this.registerComponentConfig(name, config as ComponentConfig)
    }
  }

  // 解析配置
  private resolveConfig(
    componentConfig?: ComponentConfig,
    globalConfig?: any
  ): ResolvedComponentConfig {
    const resolved: ResolvedComponentConfig = {
      size: this.globalConfig.size || 'default',
      namespace: this.globalConfig.namespace || 'el',
      zIndex: this.globalConfig.zIndex || 2000,
      locale: this.globalConfig.locale,
      theme: this.globalConfig.theme
    }

    // 合并组件默认配置
    if (componentConfig?.defaults) {
      Object.assign(resolved, componentConfig.defaults)
    }

    // 合并全局组件配置
    if (globalConfig) {
      Object.assign(resolved, globalConfig)
    }

    // 应用配置变换
    if (componentConfig?.transforms) {
      componentConfig.transforms.forEach(transform => {
        Object.assign(resolved, transform(resolved))
      })
    }

    return resolved
  }

  // 设置默认配置
  private setupDefaultConfigs(): void {
    // Button组件配置
    this.registerComponentConfig('button', {
      name: 'button',
      defaults: {
        size: 'default',
        type: 'default',
        plain: false,
        round: false,
        circle: false,
        loading: false,
        disabled: false,
        autofocus: false
      },
      validators: {
        size: (value) => ['large', 'default', 'small'].includes(value),
        type: (value) => ['primary', 'success', 'warning', 'danger', 'info', 'text', 'default'].includes(value)
      },
      transforms: [
        (config) => {
          // 根据主题调整按钮样式
          if (config.theme?.name === 'dark') {
            return { ...config, plain: true }
          }
          return config
        }
      ],
      registeredAt: new Date()
    })

    // Input组件配置
    this.registerComponentConfig('input', {
      name: 'input',
      defaults: {
        size: 'default',
        type: 'text',
        clearable: false,
        showPassword: false,
        disabled: false,
        readonly: false,
        placeholder: ''
      },
      validators: {
        size: (value) => ['large', 'default', 'small'].includes(value),
        type: (value) => ['text', 'password', 'number', 'email', 'url', 'tel'].includes(value)
      },
      transforms: [
        (config) => {
          // 根据语言调整占位符
          if (config.locale?.name === 'en-US' && !config.placeholder) {
            return { ...config, placeholder: 'Please input' }
          }
          return config
        }
      ],
      registeredAt: new Date()
    })

    // Table组件配置
    this.registerComponentConfig('table', {
      name: 'table',
      defaults: {
        size: 'default',
        stripe: false,
        border: false,
        showHeader: true,
        highlightCurrentRow: false,
        emptyText: 'No Data',
        defaultExpandAll: false,
        showSummary: false
      },
      validators: {
        size: (value) => ['large', 'default', 'small'].includes(value)
      },
      transforms: [
        (config) => {
          // 根据性能配置调整虚拟化
          if (config.performance?.enableVirtualization) {
            return { ...config, virtualScrolling: true }
          }
          return config
        }
      ],
      registeredAt: new Date()
    })
  }

  // 更新所有组件配置
  private updateComponentConfigs(): void {
    // 当全局配置变化时，重新计算所有组件配置
    this.componentConfigs.forEach((config, name) => {
      // 触发配置更新事件
      this.notifyConfigUpdate(name, this.getComponentConfig(name))
    })
  }

  // 通知配置更新
  private notifyConfigUpdate(componentName: string, config: ResolvedComponentConfig): void {
    // 可以在这里添加事件发射逻辑
    console.log(`Component config updated: ${componentName}`, config)
  }

  // 获取所有组件配置
  getAllComponentConfigs(): Record<string, ResolvedComponentConfig> {
    const configs: Record<string, ResolvedComponentConfig> = {}
    this.componentConfigs.forEach((_, name) => {
      configs[name] = this.getComponentConfig(name)
    })
    return configs
  }

  // 重置组件配置
  resetComponentConfig(name: string): void {
    this.componentConfigs.delete(name)
    this.setupDefaultConfigs()
  }

  // 导出组件配置
  exportComponentConfigs(): string {
    const configs = Object.fromEntries(this.componentConfigs)
    return JSON.stringify(configs, null, 2)
  }

  // 导入组件配置
  importComponentConfigs(configJson: string): void {
    try {
      const configs = JSON.parse(configJson)
      Object.entries(configs).forEach(([name, config]) => {
        this.registerComponentConfig(name, config as ComponentConfig)
      })
    } catch (error) {
      throw new Error('Invalid component config JSON')
    }
  }
}

// 组件配置接口
interface ComponentConfig {
  name: string
  defaults?: Record<string, any>
  validators?: Record<string, (value: any) => boolean>
  transforms?: Array<(config: ResolvedComponentConfig) => Partial<ResolvedComponentConfig>>
  registeredAt?: Date
  updatedAt?: Date
}

// 解析后的组件配置
interface ResolvedComponentConfig {
  size?: ComponentSize
  namespace?: string
  zIndex?: number
  locale?: Locale
  theme?: ThemeConfig
  performance?: PerformanceConfig
  [key: string]: any
}

// 具体组件配置接口
interface ButtonConfig {
  size?: ComponentSize
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  plain?: boolean
  round?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  autofocus?: boolean
}

interface InputConfig {
  size?: ComponentSize
  type?: string
  clearable?: boolean
  showPassword?: boolean
  disabled?: boolean
  readonly?: boolean
  placeholder?: string
}

interface TableConfig {
  size?: ComponentSize
  stripe?: boolean
  border?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  emptyText?: string
  defaultExpandAll?: boolean
  showSummary?: boolean
  virtualScrolling?: boolean
}

interface FormConfig {
  size?: ComponentSize
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  labelSuffix?: string
  inline?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  showMessage?: boolean
  validateOnRuleChange?: boolean
  hideRequiredAsterisk?: boolean
  scrollToError?: boolean
}

interface DialogConfig {
  width?: string
  fullscreen?: boolean
  top?: string
  modal?: boolean
  modalAppendToBody?: boolean
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
  center?: boolean
  destroyOnClose?: boolean
}

interface MessageConfig {
  showClose?: boolean
  center?: boolean
  dangerouslyUseHTMLString?: boolean
  duration?: number
  iconClass?: string
  customClass?: string
  offset?: number
  appendTo?: string | HTMLElement
  grouping?: boolean
}
```

## 2. 高级配置应用实例

### 2.1 全局配置提供者组件
```vue
<!-- ConfigProvider.vue - 全局配置提供者 -->
<template>
  <div 
    :class="rootClasses"
    :style="rootStyles"
    class="el-config-provider"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, computed, watch, onMounted, reactive } from 'vue'
import { ConfigManager, NamespaceManager, ComponentConfigurator } from './configSystem'
import type { GlobalConfig } from './types'

// Props
interface Props {
  namespace?: string
  size?: 'large' | 'default' | 'small'
  zIndex?: number
  locale?: any
  theme?: any
  components?: Record<string, any>
  experimental?: Record<string, boolean>
  performance?: Record<string, any>
  accessibility?: Record<string, boolean>
}

const props = withDefaults(defineProps<Props>(), {
  namespace: 'el',
  size: 'default',
  zIndex: 2000
})

// 创建配置管理器实例
const configManager = new ConfigManager()
const namespaceManager = new NamespaceManager(props.namespace)
const componentConfigurator = new ComponentConfigurator(configManager)

// 响应式状态
const state = reactive({
  isInitialized: false,
  currentConfig: {} as GlobalConfig,
  error: null as string | null
})

// 计算属性
const rootClasses = computed(() => {
  const classes = [`${props.namespace}-config-provider`]
  
  if (props.size) {
    classes.push(`${props.namespace}-config-provider--${props.size}`)
  }
  
  if (props.theme?.name) {
    classes.push(`${props.namespace}-theme-${props.theme.name}`)
  }
  
  return classes
})

const rootStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.zIndex) {
    styles[`--${props.namespace}-z-index-base`] = String(props.zIndex)
  }
  
  // 应用主题变量
  if (props.theme?.variables) {
    Object.entries(props.theme.variables).forEach(([key, value]) => {
      styles[`--${props.namespace}-${key}`] = value
    })
  }
  
  return styles
})

// 初始化配置
onMounted(async () => {
  try {
    await initializeConfig()
    state.isInitialized = true
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Unknown error'
    console.error('Config provider initialization failed:', error)
  }
})

// 初始化配置
const initializeConfig = async (): Promise<void> => {
  const config: GlobalConfig = {
    namespace: props.namespace,
    size: props.size,
    zIndex: props.zIndex,
    locale: props.locale,
    theme: props.theme,
    components: props.components,
    experimental: props.experimental,
    performance: props.performance,
    accessibility: props.accessibility
  }
  
  configManager.setConfig(config)
  state.currentConfig = configManager.getConfig()
  
  // 设置命名空间
  if (props.namespace !== 'el') {
    namespaceManager.setCurrentNamespace(props.namespace)
  }
}

// 监听配置变化
watch(
  () => ({
    namespace: props.namespace,
    size: props.size,
    zIndex: props.zIndex,
    locale: props.locale,
    theme: props.theme,
    components: props.components,
    experimental: props.experimental,
    performance: props.performance,
    accessibility: props.accessibility
  }),
  (newConfig) => {
    if (state.isInitialized) {
      configManager.setConfig(newConfig)
      state.currentConfig = configManager.getConfig()
    }
  },
  { deep: true }
)

// 提供配置给子组件
provide('elConfigProvider', {
  configManager,
  namespaceManager,
  componentConfigurator,
  getConfig: () => state.currentConfig,
  updateConfig: (config: Partial<GlobalConfig>) => {
    configManager.setConfig(config)
    state.currentConfig = configManager.getConfig()
  }
})

// 暴露给父组件
defineExpose({
  configManager,
  namespaceManager,
  componentConfigurator,
  getConfig: () => state.currentConfig,
  updateConfig: (config: Partial<GlobalConfig>) => {
    configManager.setConfig(config)
    state.currentConfig = configManager.getConfig()
  }
})
</script>

<style scoped>
.el-config-provider {
  height: 100%;
}

/* 尺寸变量 */
.el-config-provider--large {
  --el-component-size-large: 40px;
  --el-component-size: 36px;
  --el-component-size-small: 32px;
}

.el-config-provider--small {
  --el-component-size-large: 32px;
  --el-component-size: 28px;
  --el-component-size-small: 24px;
}

/* 主题变量 */
.el-theme-dark {
  --el-bg-color: #1a1a1a;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-border-color: #4c4d4f;
}

.el-theme-light {
  --el-bg-color: #ffffff;
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-border-color: #dcdfe6;
}
</style>
```

### 2.2 配置管理面板组件
```vue
<!-- ConfigPanel.vue - 配置管理面板 -->
<template>
  <div class="config-panel">
    <el-card class="config-card">
      <template #header>
        <div class="config-header">
          <h3>全局配置管理</h3>
          <div class="config-actions">
            <el-button size="small" @click="exportConfig">
              <el-icon><Download /></el-icon>
              导出配置
            </el-button>
            <el-button size="small" @click="showImportDialog = true">
              <el-icon><Upload /></el-icon>
              导入配置
            </el-button>
            <el-button size="small" type="danger" @click="resetConfig">
              <el-icon><Refresh /></el-icon>
              重置配置
            </el-button>
          </div>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="config-tabs">
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="configForm" label-width="120px">
            <el-form-item label="命名空间">
              <el-input 
                v-model="configForm.namespace"
                placeholder="请输入命名空间"
                @change="updateConfig"
              />
            </el-form-item>
            
            <el-form-item label="默认尺寸">
              <el-radio-group v-model="configForm.size" @change="updateConfig">
                <el-radio label="large">大</el-radio>
                <el-radio label="default">默认</el-radio>
                <el-radio label="small">小</el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="层级基数">
              <el-input-number 
                v-model="configForm.zIndex"
                :min="1000"
                :max="9999"
                @change="updateConfig"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 主题配置 -->
        <el-tab-pane label="主题配置" name="theme">
          <div class="theme-config">
            <el-form :model="themeForm" label-width="120px">
              <el-form-item label="主题名称">
                <el-input v-model="themeForm.name" @change="updateTheme" />
              </el-form-item>
              
              <el-form-item label="主要颜色">
                <div class="color-grid">
                  <div 
                    v-for="(color, key) in themeForm.colors" 
                    :key="key"
                    class="color-item"
                  >
                    <label>{{ colorLabels[key] }}</label>
                    <el-color-picker 
                      v-model="themeForm.colors[key]"
                      @change="updateTheme"
                    />
                  </div>
                </div>
              </el-form-item>
              
              <el-form-item label="自定义变量">
                <div class="variable-list">
                  <div 
                    v-for="(value, key) in themeForm.variables" 
                    :key="key"
                    class="variable-item"
                  >
                    <el-input 
                      v-model="themeForm.variables[key]"
                      :placeholder="key"
                      @change="updateTheme"
                    >
                      <template #prepend>{{ key }}</template>
                    </el-input>
                    <el-button 
                      type="danger" 
                      size="small" 
                      @click="removeVariable(key)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                  
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="showAddVariableDialog = true"
                  >
                    <el-icon><Plus /></el-icon>
                    添加变量
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        
        <!-- 组件配置 -->
        <el-tab-pane label="组件配置" name="components">
          <div class="component-config">
            <el-select 
              v-model="selectedComponent"
              placeholder="选择组件"
              class="component-selector"
            >
              <el-option 
                v-for="component in availableComponents"
                :key="component"
                :label="component"
                :value="component"
              />
            </el-select>
            
            <div v-if="selectedComponent" class="component-form">
              <h4>{{ selectedComponent }} 配置</h4>
              <component 
                :is="getComponentConfigForm(selectedComponent)"
                :config="componentConfigs[selectedComponent]"
                @update="updateComponentConfig"
              />
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 性能配置 -->
        <el-tab-pane label="性能配置" name="performance">
          <el-form :model="performanceForm" label-width="150px">
            <el-form-item label="防抖时间(ms)">
              <el-input-number 
                v-model="performanceForm.debounceTime"
                :min="0"
                :max="1000"
                @change="updatePerformance"
              />
            </el-form-item>
            
            <el-form-item label="节流时间(ms)">
              <el-input-number 
                v-model="performanceForm.throttleTime"
                :min="0"
                :max="1000"
                @change="updatePerformance"
              />
            </el-form-item>
            
            <el-form-item label="缓存大小">
              <el-input-number 
                v-model="performanceForm.cacheSize"
                :min="10"
                :max="1000"
                @change="updatePerformance"
              />
            </el-form-item>
            
            <el-form-item label="启用虚拟化">
              <el-switch 
                v-model="performanceForm.enableVirtualization"
                @change="updatePerformance"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 实验性功能 -->
        <el-tab-pane label="实验性功能" name="experimental">
          <el-form :model="experimentalForm" label-width="150px">
            <el-form-item label="虚拟滚动">
              <el-switch 
                v-model="experimentalForm.virtualScrolling"
                @change="updateExperimental"
              />
            </el-form-item>
            
            <el-form-item label="懒加载">
              <el-switch 
                v-model="experimentalForm.lazyLoading"
                @change="updateExperimental"
              />
            </el-form-item>
            
            <el-form-item label="异步组件">
              <el-switch 
                v-model="experimentalForm.asyncComponents"
                @change="updateExperimental"
              />
            </el-form-item>
            
            <el-form-item label="Web Components">
              <el-switch 
                v-model="experimentalForm.webComponents"
                @change="updateExperimental"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <!-- 导入配置对话框 -->
    <el-dialog v-model="showImportDialog" title="导入配置" width="600px">
      <el-input 
        v-model="importConfigText"
        type="textarea"
        :rows="10"
        placeholder="请粘贴配置JSON"
      />
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="importConfig">导入</el-button>
      </template>
    </el-dialog>
    
    <!-- 添加变量对话框 -->
    <el-dialog v-model="showAddVariableDialog" title="添加变量" width="400px">
      <el-form :model="newVariable" label-width="80px">
        <el-form-item label="变量名">
          <el-input v-model="newVariable.key" placeholder="变量名" />
        </el-form-item>
        <el-form-item label="变量值">
          <el-input v-model="newVariable.value" placeholder="变量值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddVariableDialog = false">取消</el-button>
        <el-button type="primary" @click="addVariable">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Upload, Refresh, Delete, Plus } from '@element-plus/icons-vue'
import ButtonConfigForm from './components/ButtonConfigForm.vue'
import InputConfigForm from './components/InputConfigForm.vue'
import TableConfigForm from './components/TableConfigForm.vue'

// 注入配置提供者
const configProvider = inject('elConfigProvider') as any
const { configManager, getConfig, updateConfig: updateGlobalConfig } = configProvider

// 响应式数据
const activeTab = ref('basic')
const selectedComponent = ref('')
const showImportDialog = ref(false)
const showAddVariableDialog = ref(false)
const importConfigText = ref('')

// 表单数据
const configForm = reactive({
  namespace: 'el',
  size: 'default',
  zIndex: 2000
})

const themeForm = reactive({
  name: 'default',
  colors: {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  },
  variables: {}
})

const performanceForm = reactive({
  debounceTime: 300,
  throttleTime: 100,
  cacheSize: 100,
  enableVirtualization: false
})

const experimentalForm = reactive({
  virtualScrolling: false,
  lazyLoading: false,
  asyncComponents: false,
  webComponents: false
})

const componentConfigs = reactive({})

const newVariable = reactive({
  key: '',
  value: ''
})

// 计算属性
const availableComponents = computed(() => {
  return ['button', 'input', 'table', 'form', 'dialog', 'message']
})

const colorLabels = {
  primary: '主要色',
  success: '成功色',
  warning: '警告色',
  danger: '危险色',
  info: '信息色'
}

// 初始化
onMounted(() => {
  loadCurrentConfig()
})

// 加载当前配置
const loadCurrentConfig = () => {
  const config = getConfig()
  
  Object.assign(configForm, {
    namespace: config.namespace || 'el',
    size: config.size || 'default',
    zIndex: config.zIndex || 2000
  })
  
  if (config.theme) {
    Object.assign(themeForm, config.theme)
  }
  
  if (config.performance) {
    Object.assign(performanceForm, config.performance)
  }
  
  if (config.experimental) {
    Object.assign(experimentalForm, config.experimental)
  }
  
  if (config.components) {
    Object.assign(componentConfigs, config.components)
  }
}

// 更新配置
const updateConfig = () => {
  updateGlobalConfig({
    namespace: configForm.namespace,
    size: configForm.size,
    zIndex: configForm.zIndex
  })
}

// 更新主题
const updateTheme = () => {
  updateGlobalConfig({
    theme: { ...themeForm }
  })
}

// 更新性能配置
const updatePerformance = () => {
  updateGlobalConfig({
    performance: { ...performanceForm }
  })
}

// 更新实验性功能
const updateExperimental = () => {
  updateGlobalConfig({
    experimental: { ...experimentalForm }
  })
}

// 更新组件配置
const updateComponentConfig = (componentName: string, config: any) => {
  componentConfigs[componentName] = config
  updateGlobalConfig({
    components: { ...componentConfigs }
  })
}

// 获取组件配置表单
const getComponentConfigForm = (componentName: string) => {
  const forms = {
    button: ButtonConfigForm,
    input: InputConfigForm,
    table: TableConfigForm
  }
  return forms[componentName] || 'div'
}

// 添加变量
const addVariable = () => {
  if (newVariable.key && newVariable.value) {
    themeForm.variables[newVariable.key] = newVariable.value
    updateTheme()
    newVariable.key = ''
    newVariable.value = ''
    showAddVariableDialog.value = false
    ElMessage.success('变量添加成功')
  }
}

// 移除变量
const removeVariable = (key: string) => {
  delete themeForm.variables[key]
  updateTheme()
  ElMessage.success('变量移除成功')
}

// 导出配置
const exportConfig = () => {
  const config = getConfig()
  const configJson = JSON.stringify(config, null, 2)
  
  // 创建下载链接
  const blob = new Blob([configJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'element-plus-config.json'
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('配置导出成功')
}

// 导入配置
const importConfig = () => {
  try {
    const config = JSON.parse(importConfigText.value)
    updateGlobalConfig(config)
    loadCurrentConfig()
    showImportDialog.value = false
    importConfigText.value = ''
    ElMessage.success('配置导入成功')
  } catch (error) {
    ElMessage.error('配置格式错误')
  }
}

// 重置配置
const resetConfig = async () => {
  try {
    await ElMessageBox.confirm('确定要重置所有配置吗？', '警告', {
      type: 'warning'
    })
    
    configManager.reset()
    loadCurrentConfig()
    ElMessage.success('配置重置成功')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.config-panel {
  padding: 20px;
}

.config-card {
  max-width: 800px;
  margin: 0 auto;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.config-actions {
  display: flex;
  gap: 8px;
}

.config-tabs {
  margin-top: 20px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-item label {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.variable-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-selector {
  width: 200px;
  margin-bottom: 20px;
}

.component-form {
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
}

.component-form h4 {
  margin: 0 0 16px 0;
  color: var(--el-text-color-primary);
}
</style>
```

## 实践练习

### 练习1：多实例配置隔离
```typescript
// 实现多个Element Plus实例的配置隔离
// 1. 创建独立的配置作用域
// 2. 实现配置继承机制
// 3. 处理配置冲突
// 4. 优化配置性能
```

### 练习2：动态主题切换
```typescript
// 实现动态主题切换系统
// 1. 运行时主题变量更新
// 2. CSS变量动态注入
// 3. 主题过渡动画
// 4. 主题持久化存储
```

### 练习3：配置验证系统
```typescript
// 构建完整的配置验证系统
// 1. 配置模式定义
// 2. 运行时验证
// 3. 错误提示和修复建议
// 4. 配置迁移工具
```

### 练习4：配置管理工具
```vue
// 开发配置管理工具
// 1. 可视化配置编辑器
// 2. 配置预览和测试
// 3. 配置版本管理
// 4. 团队配置共享
```

## 学习资源

### 官方文档
- [Element Plus 全局配置](https://element-plus.org/zh-CN/guide/config-provider.html)
- [CSS 自定义属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)

### 设计系统
- [Design Tokens](https://designtokens.org/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
- [Theo](https://github.com/salesforce-ux/theo)

### 工具和库
- [PostCSS](https://postcss.org/)
- [Sass](https://sass-lang.com/)
- [CSS Modules](https://github.com/css-modules/css-modules)

## 作业

1. **配置系统**：实现完整的全局配置管理系统
2. **命名空间**：创建多命名空间支持和样式隔离
3. **主题管理**：开发动态主题切换功能
4. **配置工具**：构建配置管理和编辑工具
5. **性能优化**：优化配置系统的性能和内存使用

## 下一步学习

明天我们将学习「Element Plus 暗黑模式与自适应主题」，包括：
- 暗黑模式实现原理
- 自适应主题系统
- 系统主题检测
- 主题切换动画
- 主题持久化存储

## 总结

今天我们深入学习了 Element Plus 的全局配置与命名空间系统：

1. **全局配置系统**：理解了配置管理器、验证器和中间件的设计
2. **命名空间管理**：掌握了命名空间注册、切换和样式隔离技术
3. **组件配置器**：学会了组件级配置的管理和解析
4. **配置应用实例**：实现了配置提供者组件和管理面板
5. **高级特性**：包括配置验证、导入导出、多实例隔离等

通过这些学习，你现在能够：
- 构建完整的配置管理系统
- 实现多命名空间支持和样式隔离
- 开发配置管理工具和界面
- 优化配置系统的性能和可维护性