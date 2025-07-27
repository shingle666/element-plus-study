# 第46天：Element Plus 微前端架构与模块联邦

## 学习目标

今天我们将深入学习 Element Plus 在微前端架构中的应用，掌握如何通过模块联邦实现组件共享和应用集成。

- 理解微前端架构设计原理
- 掌握 Module Federation 配置和使用
- 学习组件共享和版本管理策略
- 实现运行时集成和通信机制
- 掌握微前端性能优化技术

## 1. 微前端架构设计

### 1.1 微前端架构系统

```typescript
// micro-frontend-system.ts
export interface MicroAppConfig {
  name: string
  entry: string
  container: string
  activeRule: string | ((location: Location) => boolean)
  props?: Record<string, any>
  loader?: (loading: boolean) => void
  sandbox?: boolean | SandboxConfig
  singular?: boolean
}

export interface SandboxConfig {
  strictStyleIsolation?: boolean
  experimentalStyleIsolation?: boolean
  excludeAssetFilter?: (assetUrl: string) => boolean
}

export interface MicroFrontendConfig {
  apps: MicroAppConfig[]
  prefetch?: boolean | string[] | ((apps: MicroAppConfig[]) => MicroAppConfig[])
  sandbox?: boolean | SandboxConfig
  singular?: boolean
  fetch?: (url: string, options?: RequestInit) => Promise<Response>
  getPublicPath?: (entry: string) => string
  getTemplate?: (tpl: string) => string
}

export class MicroFrontendSystem {
  private config: MicroFrontendConfig
  private apps: Map<string, MicroAppConfig> = new Map()
  private loadedApps: Set<string> = new Set()
  private mountedApps: Set<string> = new Set()
  private eventBus: EventBus
  private sharedStore: SharedStore
  
  constructor(config: MicroFrontendConfig) {
    this.config = config
    this.eventBus = new EventBus()
    this.sharedStore = new SharedStore()
    this.initializeApps()
    this.setupRouting()
  }
  
  private initializeApps(): void {
    this.config.apps.forEach(app => {
      this.apps.set(app.name, app)
    })
  }
  
  private setupRouting(): void {
    // 监听路由变化
    window.addEventListener('popstate', this.handleRouteChange.bind(this))
    
    // 劫持 pushState 和 replaceState
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      this.handleRouteChange()
    }
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      this.handleRouteChange()
    }
    
    // 初始路由检查
    this.handleRouteChange()
  }
  
  private handleRouteChange(): void {
    const location = window.location
    
    this.apps.forEach((app, name) => {
      const shouldMount = this.shouldMountApp(app, location)
      const isMounted = this.mountedApps.has(name)
      
      if (shouldMount && !isMounted) {
        this.mountApp(name)
      } else if (!shouldMount && isMounted) {
        this.unmountApp(name)
      }
    })
  }
  
  private shouldMountApp(app: MicroAppConfig, location: Location): boolean {
    if (typeof app.activeRule === 'function') {
      return app.activeRule(location)
    }
    
    if (typeof app.activeRule === 'string') {
      return location.pathname.startsWith(app.activeRule)
    }
    
    return false
  }
  
  public async loadApp(name: string): Promise<void> {
    const app = this.apps.get(name)
    if (!app || this.loadedApps.has(name)) {
      return
    }
    
    try {
      // 加载应用资源
      const appModule = await this.loadAppModule(app)
      
      // 注册应用生命周期
      this.registerAppLifecycle(name, appModule)
      
      this.loadedApps.add(name)
      
      this.eventBus.emit('app-loaded', { name, app })
    } catch (error) {
      console.error(`Failed to load app ${name}:`, error)
      this.eventBus.emit('app-load-error', { name, error })
    }
  }
  
  private async loadAppModule(app: MicroAppConfig): Promise<any> {
    // 获取应用入口
    const response = await fetch(app.entry)
    const html = await response.text()
    
    // 解析 HTML 获取资源链接
    const { scripts, styles } = this.parseAppResources(html)
    
    // 加载样式
    await this.loadStyles(styles)
    
    // 加载脚本
    const appModule = await this.loadScripts(scripts)
    
    return appModule
  }
  
  private parseAppResources(html: string): { scripts: string[], styles: string[] } {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const scripts: string[] = []
    const styles: string[] = []
    
    // 解析脚本链接
    doc.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src')
      if (src) {
        scripts.push(src)
      }
    })
    
    // 解析样式链接
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href')
      if (href) {
        styles.push(href)
      }
    })
    
    return { scripts, styles }
  }
  
  private async loadStyles(styles: string[]): Promise<void> {
    const promises = styles.map(href => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = () => resolve()
        link.onerror = () => reject(new Error(`Failed to load style: ${href}`))
        document.head.appendChild(link)
      })
    })
    
    await Promise.all(promises)
  }
  
  private async loadScripts(scripts: string[]): Promise<any> {
    let appModule: any = {}
    
    for (const src of scripts) {
      const script = document.createElement('script')
      script.src = src
      
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          // 尝试获取应用导出
          if (window.__MICRO_APP_ENVIRONMENT__) {
            appModule = window.__MICRO_APP_ENVIRONMENT__
          }
          resolve()
        }
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.head.appendChild(script)
      })
    }
    
    return appModule
  }
  
  private registerAppLifecycle(name: string, appModule: any): void {
    const lifecycle = {
      bootstrap: appModule.bootstrap || (() => Promise.resolve()),
      mount: appModule.mount || (() => Promise.resolve()),
      unmount: appModule.unmount || (() => Promise.resolve()),
      update: appModule.update || (() => Promise.resolve())
    }
    
    this.apps.get(name)!.lifecycle = lifecycle
  }
  
  public async mountApp(name: string): Promise<void> {
    const app = this.apps.get(name)
    if (!app || this.mountedApps.has(name)) {
      return
    }
    
    try {
      // 确保应用已加载
      if (!this.loadedApps.has(name)) {
        await this.loadApp(name)
      }
      
      // 执行生命周期
      const lifecycle = app.lifecycle
      if (lifecycle) {
        await lifecycle.bootstrap(app.props)
        await lifecycle.mount(app.props)
      }
      
      this.mountedApps.add(name)
      
      this.eventBus.emit('app-mounted', { name, app })
    } catch (error) {
      console.error(`Failed to mount app ${name}:`, error)
      this.eventBus.emit('app-mount-error', { name, error })
    }
  }
  
  public async unmountApp(name: string): Promise<void> {
    const app = this.apps.get(name)
    if (!app || !this.mountedApps.has(name)) {
      return
    }
    
    try {
      const lifecycle = app.lifecycle
      if (lifecycle) {
        await lifecycle.unmount(app.props)
      }
      
      this.mountedApps.delete(name)
      
      this.eventBus.emit('app-unmounted', { name, app })
    } catch (error) {
      console.error(`Failed to unmount app ${name}:`, error)
      this.eventBus.emit('app-unmount-error', { name, error })
    }
  }
  
  public getEventBus(): EventBus {
    return this.eventBus
  }
  
  public getSharedStore(): SharedStore {
    return this.sharedStore
  }
  
  public registerApp(app: MicroAppConfig): void {
    this.apps.set(app.name, app)
  }
  
  public unregisterApp(name: string): void {
    this.unmountApp(name)
    this.apps.delete(name)
    this.loadedApps.delete(name)
  }
  
  public destroy(): void {
    // 卸载所有应用
    this.mountedApps.forEach(name => {
      this.unmountApp(name)
    })
    
    // 清理资源
    this.apps.clear()
    this.loadedApps.clear()
    this.mountedApps.clear()
    
    // 清理事件监听
    window.removeEventListener('popstate', this.handleRouteChange.bind(this))
  }
}
```

### 1.2 事件总线系统

```typescript
// event-bus.ts
export interface EventListener {
  (data: any): void
}

export class EventBus {
  private events: Map<string, Set<EventListener>> = new Map()
  private onceEvents: Map<string, Set<EventListener>> = new Map()
  
  public on(event: string, listener: EventListener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    const listeners = this.events.get(event)!
    listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      listeners.delete(listener)
    }
  }
  
  public once(event: string, listener: EventListener): () => void {
    if (!this.onceEvents.has(event)) {
      this.onceEvents.set(event, new Set())
    }
    
    const listeners = this.onceEvents.get(event)!
    listeners.add(listener)
    
    // 返回取消监听的函数
    return () => {
      listeners.delete(listener)
    }
  }
  
  public emit(event: string, data?: any): void {
    // 触发普通监听器
    const listeners = this.events.get(event)
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
    
    // 触发一次性监听器
    const onceListeners = this.onceEvents.get(event)
    if (onceListeners) {
      onceListeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in once event listener for ${event}:`, error)
        }
      })
      
      // 清除一次性监听器
      this.onceEvents.delete(event)
    }
  }
  
  public off(event: string, listener?: EventListener): void {
    if (listener) {
      // 移除特定监听器
      const listeners = this.events.get(event)
      if (listeners) {
        listeners.delete(listener)
      }
      
      const onceListeners = this.onceEvents.get(event)
      if (onceListeners) {
        onceListeners.delete(listener)
      }
    } else {
      // 移除所有监听器
      this.events.delete(event)
      this.onceEvents.delete(event)
    }
  }
  
  public clear(): void {
    this.events.clear()
    this.onceEvents.clear()
  }
  
  public getEventNames(): string[] {
    const eventNames = new Set<string>()
    
    this.events.forEach((_, event) => eventNames.add(event))
    this.onceEvents.forEach((_, event) => eventNames.add(event))
    
    return Array.from(eventNames)
  }
  
  public getListenerCount(event: string): number {
    const listeners = this.events.get(event)
    const onceListeners = this.onceEvents.get(event)
    
    return (listeners?.size || 0) + (onceListeners?.size || 0)
  }
}
```

### 1.3 共享状态管理

```typescript
// shared-store.ts
export interface StoreState {
  [key: string]: any
}

export interface StoreAction {
  type: string
  payload?: any
}

export interface StoreSubscriber {
  (state: StoreState, action: StoreAction): void
}

export interface StoreMiddleware {
  (store: SharedStore) => (next: (action: StoreAction) => void) => (action: StoreAction) => void
}

export class SharedStore {
  private state: StoreState = {}
  private subscribers: Set<StoreSubscriber> = new Set()
  private middlewares: StoreMiddleware[] = []
  private isDispatching = false
  
  constructor(initialState: StoreState = {}) {
    this.state = { ...initialState }
  }
  
  public getState(): StoreState {
    return { ...this.state }
  }
  
  public setState(newState: Partial<StoreState>): void {
    this.state = { ...this.state, ...newState }
    this.notifySubscribers({ type: 'SET_STATE', payload: newState })
  }
  
  public dispatch(action: StoreAction): void {
    if (this.isDispatching) {
      throw new Error('Cannot dispatch action while dispatching')
    }
    
    this.isDispatching = true
    
    try {
      // 应用中间件
      let next = (action: StoreAction) => {
        this.handleAction(action)
      }
      
      for (let i = this.middlewares.length - 1; i >= 0; i--) {
        next = this.middlewares[i](this)(next)
      }
      
      next(action)
    } finally {
      this.isDispatching = false
    }
  }
  
  private handleAction(action: StoreAction): void {
    switch (action.type) {
      case 'SET_STATE':
        this.state = { ...this.state, ...action.payload }
        break
      case 'RESET_STATE':
        this.state = action.payload || {}
        break
      case 'DELETE_KEY':
        const { [action.payload]: deleted, ...rest } = this.state
        this.state = rest
        break
      default:
        // 自定义 action 处理
        break
    }
    
    this.notifySubscribers(action)
  }
  
  private notifySubscribers(action: StoreAction): void {
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(this.state, action)
      } catch (error) {
        console.error('Error in store subscriber:', error)
      }
    })
  }
  
  public subscribe(subscriber: StoreSubscriber): () => void {
    this.subscribers.add(subscriber)
    
    // 返回取消订阅的函数
    return () => {
      this.subscribers.delete(subscriber)
    }
  }
  
  public use(middleware: StoreMiddleware): void {
    this.middlewares.push(middleware)
  }
  
  public clear(): void {
    this.state = {}
    this.subscribers.clear()
    this.notifySubscribers({ type: 'CLEAR' })
  }
  
  // 命名空间支持
  public createNamespace(namespace: string): NamespacedStore {
    return new NamespacedStore(this, namespace)
  }
}

export class NamespacedStore {
  constructor(
    private store: SharedStore,
    private namespace: string
  ) {}
  
  public getState(): any {
    const state = this.store.getState()
    return state[this.namespace]
  }
  
  public setState(newState: any): void {
    this.store.dispatch({
      type: 'SET_STATE',
      payload: {
        [this.namespace]: {
          ...this.getState(),
          ...newState
        }
      }
    })
  }
  
  public dispatch(action: StoreAction): void {
    this.store.dispatch({
      ...action,
      type: `${this.namespace}/${action.type}`
    })
  }
  
  public subscribe(subscriber: (state: any, action: StoreAction) => void): () => void {
    return this.store.subscribe((state, action) => {
      if (action.type.startsWith(`${this.namespace}/`) || action.type === 'SET_STATE') {
        subscriber(state[this.namespace], action)
      }
    })
  }
}
```

## 2. Module Federation 配置

### 2.1 主应用配置

```javascript
// webpack.config.js (主应用)
const ModuleFederationPlugin = require('@module-federation/webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue': '@vue/runtime-dom'
    }
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      
      // 远程模块
      remotes: {
        'mf-components': 'mf_components@http://localhost:3001/remoteEntry.js',
        'mf-business': 'mf_business@http://localhost:3002/remoteEntry.js',
        'mf-utils': 'mf_utils@http://localhost:3003/remoteEntry.js'
      },
      
      // 共享依赖
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0'
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.4.0'
        },
        '@element-plus/icons-vue': {
          singleton: true,
          requiredVersion: '^2.1.0'
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.0'
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0'
        }
      }
    }),
    
    new (require('vue-loader')).VueLoaderPlugin()
  ],
  
  devServer: {
    port: 3000,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
```

### 2.2 组件库微应用配置

```javascript
// webpack.config.js (组件库微应用)
const ModuleFederationPlugin = require('@module-federation/webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new ModuleFederationPlugin({
      name: 'mf_components',
      filename: 'remoteEntry.js',
      
      // 暴露的模块
      exposes: {
        './Button': './src/components/Button/index.ts',
        './Table': './src/components/Table/index.ts',
        './Form': './src/components/Form/index.ts',
        './Dialog': './src/components/Dialog/index.ts',
        './Charts': './src/components/Charts/index.ts',
        './utils': './src/utils/index.ts',
        './composables': './src/composables/index.ts'
      },
      
      // 共享依赖
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0'
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.4.0'
        },
        '@element-plus/icons-vue': {
          singleton: true,
          requiredVersion: '^2.1.0'
        }
      }
    }),
    
    new (require('vue-loader')).VueLoaderPlugin()
  ],
  
  devServer: {
    port: 3001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
```

### 2.3 组件导出配置

```typescript
// src/index.ts (组件库微应用入口)
import { App } from 'vue'
import Button from './components/Button/index.vue'
import Table from './components/Table/index.vue'
import Form from './components/Form/index.vue'
import Dialog from './components/Dialog/index.vue'
import Charts from './components/Charts/index.vue'

// 导出单个组件
export { Button, Table, Form, Dialog, Charts }

// 导出工具函数
export * from './utils'
export * from './composables'

// 导出插件安装函数
export const install = (app: App) => {
  app.component('MfButton', Button)
  app.component('MfTable', Table)
  app.component('MfForm', Form)
  app.component('MfDialog', Dialog)
  app.component('MfCharts', Charts)
}

// 默认导出
export default {
  install,
  Button,
  Table,
  Form,
  Dialog,
  Charts
}

// 微前端生命周期
export async function bootstrap() {
  console.log('Components micro app bootstrapped')
}

export async function mount(props: any) {
  console.log('Components micro app mounted', props)
}

export async function unmount() {
  console.log('Components micro app unmounted')
}

// 独立运行模式
if (!window.__POWERED_BY_QIANKUN__) {
  import('./standalone')
}
```

## 3. 组件共享和版本管理

### 3.1 组件版本管理器

```typescript
// component-version-manager.ts
export interface ComponentVersion {
  name: string
  version: string
  entry: string
  dependencies: Record<string, string>
  metadata: {
    description?: string
    author?: string
    tags?: string[]
    deprecated?: boolean
    changelog?: string
  }
}

export interface VersionRegistry {
  [componentName: string]: {
    [version: string]: ComponentVersion
  }
}

export class ComponentVersionManager {
  private registry: VersionRegistry = {}
  private loadedComponents: Map<string, any> = new Map()
  private versionConstraints: Map<string, string> = new Map()
  
  public registerComponent(component: ComponentVersion): void {
    const { name, version } = component
    
    if (!this.registry[name]) {
      this.registry[name] = {}
    }
    
    this.registry[name][version] = component
  }
  
  public getComponent(name: string, version?: string): ComponentVersion | null {
    const componentVersions = this.registry[name]
    if (!componentVersions) {
      return null
    }
    
    if (version) {
      return componentVersions[version] || null
    }
    
    // 返回最新版本
    const versions = Object.keys(componentVersions).sort(this.compareVersions)
    const latestVersion = versions[versions.length - 1]
    return componentVersions[latestVersion] || null
  }
  
  public async loadComponent(name: string, version?: string): Promise<any> {
    const componentKey = `${name}@${version || 'latest'}`
    
    // 检查缓存
    if (this.loadedComponents.has(componentKey)) {
      return this.loadedComponents.get(componentKey)
    }
    
    const component = this.getComponent(name, version)
    if (!component) {
      throw new Error(`Component ${name}@${version} not found`)
    }
    
    try {
      // 检查依赖
      await this.checkDependencies(component)
      
      // 加载组件
      const module = await this.loadModule(component.entry)
      
      // 缓存组件
      this.loadedComponents.set(componentKey, module)
      
      return module
    } catch (error) {
      throw new Error(`Failed to load component ${name}@${version}: ${error.message}`)
    }
  }
  
  private async checkDependencies(component: ComponentVersion): Promise<void> {
    const { dependencies } = component
    
    for (const [depName, depVersion] of Object.entries(dependencies)) {
      const constraint = this.versionConstraints.get(depName)
      
      if (constraint && !this.satisfiesConstraint(depVersion, constraint)) {
        throw new Error(
          `Dependency conflict: ${depName} requires ${depVersion} but ${constraint} is already loaded`
        )
      }
      
      // 设置版本约束
      if (!constraint) {
        this.versionConstraints.set(depName, depVersion)
      }
    }
  }
  
  private async loadModule(entry: string): Promise<any> {
    // 动态导入模块
    const module = await import(/* webpackIgnore: true */ entry)
    return module
  }
  
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number)
    const bParts = b.split('.').map(Number)
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0
      const bPart = bParts[i] || 0
      
      if (aPart < bPart) return -1
      if (aPart > bPart) return 1
    }
    
    return 0
  }
  
  private satisfiesConstraint(version: string, constraint: string): boolean {
    // 简单的版本约束检查
    if (constraint.startsWith('^')) {
      const constraintVersion = constraint.slice(1)
      return this.compareVersions(version, constraintVersion) >= 0
    }
    
    if (constraint.startsWith('~')) {
      const constraintVersion = constraint.slice(1)
      const versionParts = version.split('.')
      const constraintParts = constraintVersion.split('.')
      
      return (
        versionParts[0] === constraintParts[0] &&
        versionParts[1] === constraintParts[1] &&
        this.compareVersions(version, constraintVersion) >= 0
      )
    }
    
    return version === constraint
  }
  
  public getAvailableVersions(name: string): string[] {
    const componentVersions = this.registry[name]
    if (!componentVersions) {
      return []
    }
    
    return Object.keys(componentVersions).sort(this.compareVersions)
  }
  
  public getComponentInfo(name: string, version?: string): ComponentVersion | null {
    return this.getComponent(name, version)
  }
  
  public clearCache(): void {
    this.loadedComponents.clear()
    this.versionConstraints.clear()
  }
  
  public getRegistry(): VersionRegistry {
    return { ...this.registry }
  }
}
```

### 3.2 动态组件加载器

```vue
<!-- DynamicComponent.vue -->
<template>
  <div class="dynamic-component">
    <div v-if="loading" class="loading-placeholder">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="error" class="error-placeholder">
      <el-alert
        :title="`组件加载失败: ${componentName}`"
        :description="error.message"
        type="error"
        show-icon
      />
      <el-button @click="retry" type="primary" size="small" style="margin-top: 12px">
        重试
      </el-button>
    </div>
    
    <component
      v-else-if="dynamicComponent"
      :is="dynamicComponent"
      v-bind="componentProps"
      v-on="componentEvents"
    />
    
    <div v-else class="empty-placeholder">
      <el-empty description="组件未找到" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { ElSkeleton, ElAlert, ElButton, ElEmpty } from 'element-plus'
import { ComponentVersionManager } from './component-version-manager'

interface Props {
  name: string
  version?: string
  props?: Record<string, any>
  events?: Record<string, Function>
  fallback?: any
  timeout?: number
  retryCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  timeout: 10000,
  retryCount: 3
})

const emit = defineEmits<{
  'load-success': [component: any]
  'load-error': [error: Error]
  'load-start': []
  'load-end': []
}>()

// 响应式状态
const loading = ref(false)
const error = ref<Error | null>(null)
const dynamicComponent = ref<any>(null)
const currentRetryCount = ref(0)

// 计算属性
const componentName = computed(() => {
  return props.version ? `${props.name}@${props.version}` : props.name
})

const componentProps = computed(() => {
  return props.props || {}
})

const componentEvents = computed(() => {
  return props.events || {}
})

// 组件版本管理器实例
const versionManager = new ComponentVersionManager()

// 方法
const loadComponent = async () => {
  if (loading.value) return
  
  loading.value = true
  error.value = null
  emit('load-start')
  
  try {
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Component load timeout: ${componentName.value}`))
      }, props.timeout)
    })
    
    // 加载组件
    const loadPromise = versionManager.loadComponent(props.name, props.version)
    
    const component = await Promise.race([loadPromise, timeoutPromise])
    
    dynamicComponent.value = component.default || component
    emit('load-success', dynamicComponent.value)
    
    currentRetryCount.value = 0
  } catch (err) {
    error.value = err as Error
    emit('load-error', error.value)
    
    // 使用 fallback 组件
    if (props.fallback) {
      dynamicComponent.value = props.fallback
    }
  } finally {
    loading.value = false
    emit('load-end')
  }
}

const retry = async () => {
  if (currentRetryCount.value >= props.retryCount) {
    return
  }
  
  currentRetryCount.value++
  await loadComponent()
}

// 监听属性变化
watch(
  () => [props.name, props.version],
  () => {
    dynamicComponent.value = null
    currentRetryCount.value = 0
    loadComponent()
  },
  { immediate: true }
)

// 生命周期
onMounted(() => {
  // 预加载相关组件
  if (props.name) {
    loadComponent()
  }
})

onUnmounted(() => {
  // 清理资源
  dynamicComponent.value = null
})

// 暴露方法
defineExpose({
  loadComponent,
  retry,
  loading,
  error,
  dynamicComponent
})
</script>

<style scoped>
.dynamic-component {
  width: 100%;
}

.loading-placeholder,
.error-placeholder,
.empty-placeholder {
  padding: 20px;
  text-align: center;
}

.error-placeholder {
  border: 1px dashed var(--el-color-danger);
  border-radius: var(--el-border-radius-base);
  background: var(--el-color-danger-light-9);
}
</style>
```

## 4. 实践练习

### 练习1：微前端路由系统
```typescript
// 实现微前端路由管理
// 1. 路由分发和匹配
// 2. 应用间路由通信
// 3. 路由状态同步
// 4. 历史记录管理
```

### 练习2：组件市场平台
```vue
<!-- 构建组件市场系统 -->
<!-- 1. 组件发布和管理 -->
<!-- 2. 版本控制和回滚 -->
<!-- 3. 依赖分析和冲突检测 -->
<!-- 4. 使用统计和监控 -->
```

### 练习3：微前端监控系统
```typescript
// 开发微前端监控平台
// 1. 应用性能监控
// 2. 错误收集和分析
// 3. 用户行为追踪
// 4. 资源使用统计
```

### 练习4：跨应用通信优化
```typescript
// 优化微前端通信机制
// 1. 事件总线优化
// 2. 状态同步策略
// 3. 数据缓存管理
// 4. 通信性能优化
```

## 学习资源

### 官方文档
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [qiankun 微前端](https://qiankun.umijs.org/)
- [single-spa](https://single-spa.js.org/)

### 技术文章
- [微前端架构设计](https://micro-frontends.org/)
- [Module Federation 实践指南](https://module-federation.github.io/)
- [微前端最佳实践](https://martinfowler.com/articles/micro-frontends.html)

### 工具和库
- [@module-federation/webpack](https://www.npmjs.com/package/@module-federation/webpack)
- [qiankun](https://www.npmjs.com/package/qiankun)
- [single-spa](https://www.npmjs.com/package/single-spa)

## 作业

1. **微前端架构**：设计和实现完整的微前端系统
2. **组件共享**：构建组件版本管理和分发机制
3. **应用集成**：实现多个微应用的集成和通信
4. **性能优化**：优化微前端加载和运行性能
5. **监控系统**：建立微前端监控和错误处理机制

## 下一步学习

明天我们将学习「Element Plus 可视化编辑器开发」，包括：
- 拖拽编辑器架构
- 组件渲染引擎
- 属性配置系统
- 代码生成器
- 预览和发布功能

## 总结

今天我们深入学习了 Element Plus 在微前端架构中的应用：

1. **微前端架构**：构建了完整的微前端管理系统和应用生命周期
2. **Module Federation**：掌握了模块联邦的配置和组件共享机制
3. **版本管理**：实现了组件版本控制和依赖管理系统
4. **动态加载**：开发了动态组件加载器和错误处理机制
5. **通信机制**：建立了事件总线和共享状态管理系统

通过这些学习，你现在能够：
- 设计和实现微前端架构
- 配置和使用 Module Federation
- 管理组件版本和依赖关系
- 实现应用间的通信和状态共享
- 优化微前端的性能和用户体验