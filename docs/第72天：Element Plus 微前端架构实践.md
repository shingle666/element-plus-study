# 第72天：Element Plus 微前端架构实践

## 学习目标

* 理解微前端架构的核心概念和优势
* 掌握在微前端环境中使用 Element Plus 的最佳实践
* 学习组件库和主题的跨应用共享策略
* 了解微前端应用间的通信和状态管理

## 知识点概览

### 1. 微前端架构基础

#### 1.1 微前端概念与架构

```typescript
// 微前端架构定义
interface MicrofrontendArchitecture {
  // 主应用（容器应用）
  shell: {
    framework: 'Vue 3' | 'React' | 'Angular'
    responsibilities: string[]
    routing: 'client-side' | 'server-side'
    communication: 'event-bus' | 'shared-state' | 'props'
  }
  
  // 微应用
  microfrontends: {
    id: string
    name: string
    framework: string
    entry: string
    routes: string[]
    dependencies: string[]
    shared: string[]
  }[]
  
  // 共享资源
  shared: {
    libraries: string[]
    components: string[]
    themes: string[]
    utilities: string[]
  }
  
  // 部署策略
  deployment: {
    strategy: 'independent' | 'coordinated'
    registry: string
    cdn: string
    versioning: 'semantic' | 'timestamp'
  }
}

// 微前端管理器
class MicrofrontendManager {
  private applications: Map<string, MicrofrontendApp> = new Map()
  private sharedResources: SharedResourceManager
  private communicationBus: EventBus
  
  constructor() {
    this.sharedResources = new SharedResourceManager()
    this.communicationBus = new EventBus()
    this.initializeSharedResources()
  }
  
  // 注册微应用
  registerApp(config: MicrofrontendConfig): void {
    const app = new MicrofrontendApp(config, this.sharedResources, this.communicationBus)
    this.applications.set(config.name, app)
    
    console.log(`Microfrontend '${config.name}' registered successfully`)
  }
  
  // 启动微应用
  async startApp(name: string, container: HTMLElement): Promise<void> {
    const app = this.applications.get(name)
    if (!app) {
      throw new Error(`Microfrontend '${name}' not found`)
    }
    
    try {
      await app.mount(container)
      console.log(`Microfrontend '${name}' started successfully`)
    } catch (error) {
      console.error(`Failed to start microfrontend '${name}':`, error)
      throw error
    }
  }
  
  // 停止微应用
  async stopApp(name: string): Promise<void> {
    const app = this.applications.get(name)
    if (app) {
      await app.unmount()
      console.log(`Microfrontend '${name}' stopped successfully`)
    }
  }
  
  // 初始化共享资源
  private initializeSharedResources(): void {
    // 共享 Element Plus
    this.sharedResources.register('element-plus', {
      type: 'library',
      version: '2.4.0',
      url: 'https://unpkg.com/element-plus@2.4.0/dist/index.full.min.js',
      css: 'https://unpkg.com/element-plus@2.4.0/dist/index.css'
    })
    
    // 共享 Vue
    this.sharedResources.register('vue', {
      type: 'library',
      version: '3.3.0',
      url: 'https://unpkg.com/vue@3.3.0/dist/vue.global.prod.js'
    })
    
    // 共享主题
    this.sharedResources.register('design-tokens', {
      type: 'theme',
      version: '1.0.0',
      url: '/shared/design-tokens.css'
    })
  }
  
  // 获取应用列表
  getApplications(): string[] {
    return Array.from(this.applications.keys())
  }
  
  // 获取共享资源
  getSharedResources(): SharedResource[] {
    return this.sharedResources.getAll()
  }
}

// 微前端应用类
class MicrofrontendApp {
  private config: MicrofrontendConfig
  private sharedResources: SharedResourceManager
  private communicationBus: EventBus
  private instance: any = null
  private container: HTMLElement | null = null
  
  constructor(
    config: MicrofrontendConfig,
    sharedResources: SharedResourceManager,
    communicationBus: EventBus
  ) {
    this.config = config
    this.sharedResources = sharedResources
    this.communicationBus = communicationBus
  }
  
  // 挂载应用
  async mount(container: HTMLElement): Promise<void> {
    this.container = container
    
    // 加载依赖
    await this.loadDependencies()
    
    // 加载应用代码
    const appModule = await this.loadAppModule()
    
    // 创建应用实例
    this.instance = await appModule.mount({
      container,
      props: this.config.props || {},
      shared: this.getSharedContext()
    })
  }
  
  // 卸载应用
  async unmount(): Promise<void> {
    if (this.instance && typeof this.instance.unmount === 'function') {
      await this.instance.unmount()
    }
    
    if (this.container) {
      this.container.innerHTML = ''
    }
    
    this.instance = null
    this.container = null
  }
  
  // 加载依赖
  private async loadDependencies(): Promise<void> {
    const dependencies = this.config.dependencies || []
    
    for (const dep of dependencies) {
      await this.sharedResources.load(dep)
    }
  }
  
  // 加载应用模块
  private async loadAppModule(): Promise<any> {
    const script = document.createElement('script')
    script.src = this.config.entry
    script.type = 'module'
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        const appModule = (window as any)[this.config.globalName]
        if (appModule) {
          resolve(appModule)
        } else {
          reject(new Error(`Global '${this.config.globalName}' not found`))
        }
      }
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${this.config.entry}`))
      }
      
      document.head.appendChild(script)
    })
  }
  
  // 获取共享上下文
  private getSharedContext(): any {
    return {
      eventBus: this.communicationBus,
      sharedResources: this.sharedResources,
      theme: this.sharedResources.get('design-tokens')
    }
  }
}

// 微前端配置接口
interface MicrofrontendConfig {
  name: string
  entry: string
  globalName: string
  routes?: string[]
  dependencies?: string[]
  props?: Record<string, any>
}

// 共享资源接口
interface SharedResource {
  type: 'library' | 'component' | 'theme' | 'utility'
  version: string
  url: string
  css?: string
  dependencies?: string[]
}
```

#### 1.2 共享资源管理

```typescript
// 共享资源管理器
class SharedResourceManager {
  private resources: Map<string, SharedResource> = new Map()
  private loadedResources: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()
  
  // 注册共享资源
  register(name: string, resource: SharedResource): void {
    this.resources.set(name, resource)
  }
  
  // 加载共享资源
  async load(name: string): Promise<void> {
    if (this.loadedResources.has(name)) {
      return
    }
    
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)
    }
    
    const resource = this.resources.get(name)
    if (!resource) {
      throw new Error(`Shared resource '${name}' not found`)
    }
    
    const loadingPromise = this.loadResource(name, resource)
    this.loadingPromises.set(name, loadingPromise)
    
    try {
      await loadingPromise
      this.loadedResources.add(name)
    } finally {
      this.loadingPromises.delete(name)
    }
  }
  
  // 加载资源实现
  private async loadResource(name: string, resource: SharedResource): Promise<void> {
    // 加载依赖
    if (resource.dependencies) {
      for (const dep of resource.dependencies) {
        await this.load(dep)
      }
    }
    
    // 加载 CSS
    if (resource.css) {
      await this.loadCSS(resource.css)
    }
    
    // 加载 JavaScript
    await this.loadScript(resource.url)
  }
  
  // 加载 CSS
  private loadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      
      link.onload = () => resolve()
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`))
      
      document.head.appendChild(link)
    })
  }
  
  // 加载 JavaScript
  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
      
      document.head.appendChild(script)
    })
  }
  
  // 获取资源
  get(name: string): SharedResource | undefined {
    return this.resources.get(name)
  }
  
  // 获取所有资源
  getAll(): SharedResource[] {
    return Array.from(this.resources.values())
  }
  
  // 检查资源是否已加载
  isLoaded(name: string): boolean {
    return this.loadedResources.has(name)
  }
}

// 事件总线
class EventBus {
  private events: Map<string, Set<Function>> = new Map()
  
  // 订阅事件
  on(event: string, callback: Function): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    this.events.get(event)!.add(callback)
    
    // 返回取消订阅函数
    return () => {
      this.events.get(event)?.delete(callback)
    }
  }
  
  // 发布事件
  emit(event: string, ...args: any[]): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Error in event callback for '${event}':`, error)
        }
      })
    }
  }
  
  // 一次性订阅
  once(event: string, callback: Function): void {
    const unsubscribe = this.on(event, (...args: any[]) => {
      callback(...args)
      unsubscribe()
    })
  }
  
  // 移除所有监听器
  off(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }
}
```

### 2. Element Plus 在微前端中的应用

#### 2.1 主应用配置

```vue
<!-- Shell Application (主应用) -->
<template>
  <div id="app" class="shell-app">
    <!-- 全局导航 -->
    <el-container>
      <el-header class="shell-header">
        <div class="header-content">
          <div class="logo">
            <img src="/logo.png" alt="Logo" />
            <span>微前端平台</span>
          </div>
          
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            @select="handleMenuSelect"
            class="main-menu"
          >
            <el-menu-item
              v-for="app in applications"
              :key="app.name"
              :index="app.name"
            >
              {{ app.title }}
            </el-menu-item>
          </el-menu>
          
          <div class="header-actions">
            <!-- 主题切换 -->
            <ThemeSelector />
            
            <!-- 用户菜单 -->
            <el-dropdown @command="handleUserCommand">
              <span class="user-info">
                <el-avatar :src="userInfo.avatar" />
                <span>{{ userInfo.name }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main class="shell-main">
        <!-- 微应用容器 -->
        <div
          v-for="app in applications"
          :key="app.name"
          :ref="el => setAppContainer(app.name, el)"
          v-show="activeApp === app.name"
          class="microfrontend-container"
        >
          <!-- 加载状态 -->
          <div v-if="loadingApps.has(app.name)" class="loading-container">
            <el-loading-service />
            <p>正在加载 {{ app.title }}...</p>
          </div>
          
          <!-- 错误状态 -->
          <div v-else-if="errorApps.has(app.name)" class="error-container">
            <el-result
              icon="error"
              title="加载失败"
              :sub-title="errorApps.get(app.name)"
            >
              <template #extra>
                <el-button type="primary" @click="retryLoadApp(app.name)">
                  重试
                </el-button>
              </template>
            </el-result>
          </div>
        </div>
      </el-main>
    </el-container>
    
    <!-- 全局通知 -->
    <GlobalNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { MicrofrontendManager } from '@/utils/microfrontend'
import ThemeSelector from '@/components/ThemeSelector.vue'
import GlobalNotifications from '@/components/GlobalNotifications.vue'

// 微前端管理器
const microfrontendManager = new MicrofrontendManager()

// 应用配置
const applications = ref([
  {
    name: 'user-management',
    title: '用户管理',
    entry: '/microfrontends/user-management/index.js',
    globalName: 'UserManagementApp',
    dependencies: ['vue', 'element-plus', 'design-tokens']
  },
  {
    name: 'product-catalog',
    title: '商品目录',
    entry: '/microfrontends/product-catalog/index.js',
    globalName: 'ProductCatalogApp',
    dependencies: ['vue', 'element-plus', 'design-tokens']
  },
  {
    name: 'analytics-dashboard',
    title: '数据分析',
    entry: '/microfrontends/analytics-dashboard/index.js',
    globalName: 'AnalyticsDashboardApp',
    dependencies: ['vue', 'element-plus', 'design-tokens', 'echarts']
  }
])

// 状态管理
const activeApp = ref('user-management')
const activeMenu = ref('user-management')
const loadingApps = reactive(new Set<string>())
const errorApps = reactive(new Map<string, string>())
const appContainers = reactive(new Map<string, HTMLElement>())

// 用户信息
const userInfo = reactive({
  name: '张三',
  avatar: '/avatars/default.png'
})

// 设置应用容器引用
function setAppContainer(appName: string, el: HTMLElement | null): void {
  if (el) {
    appContainers.set(appName, el)
  }
}

// 处理菜单选择
async function handleMenuSelect(appName: string): Promise<void> {
  if (activeApp.value === appName) {
    return
  }
  
  // 停止当前应用
  if (activeApp.value) {
    await microfrontendManager.stopApp(activeApp.value)
  }
  
  // 启动新应用
  activeApp.value = appName
  activeMenu.value = appName
  
  await nextTick()
  await loadMicrofrontend(appName)
}

// 加载微前端应用
async function loadMicrofrontend(appName: string): Promise<void> {
  const container = appContainers.get(appName)
  if (!container) {
    console.error(`Container for app '${appName}' not found`)
    return
  }
  
  loadingApps.add(appName)
  errorApps.delete(appName)
  
  try {
    await microfrontendManager.startApp(appName, container)
  } catch (error) {
    console.error(`Failed to load microfrontend '${appName}':`, error)
    errorApps.set(appName, error instanceof Error ? error.message : '未知错误')
  } finally {
    loadingApps.delete(appName)
  }
}

// 重试加载应用
async function retryLoadApp(appName: string): Promise<void> {
  await loadMicrofrontend(appName)
}

// 处理用户命令
function handleUserCommand(command: string): void {
  switch (command) {
    case 'profile':
      // 打开个人资料页面
      break
    case 'settings':
      // 打开设置页面
      break
    case 'logout':
      // 执行登出操作
      break
  }
}

// 初始化
onMounted(async () => {
  // 注册所有微应用
  applications.value.forEach(app => {
    microfrontendManager.registerApp(app)
  })
  
  // 加载默认应用
  await nextTick()
  await loadMicrofrontend(activeApp.value)
})
</script>

<style lang="scss" scoped>
.shell-app {
  height: 100vh;
  
  .shell-header {
    background: var(--el-color-white);
    border-bottom: 1px solid var(--el-border-color-light);
    padding: 0;
    
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 20px;
      
      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        
        img {
          height: 32px;
        }
        
        span {
          font-size: 18px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
      }
      
      .main-menu {
        flex: 1;
        margin: 0 40px;
        border-bottom: none;
      }
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.3s;
          
          &:hover {
            background-color: var(--el-fill-color-light);
          }
        }
      }
    }
  }
  
  .shell-main {
    padding: 0;
    
    .microfrontend-container {
      height: 100%;
      
      .loading-container,
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        
        p {
          margin-top: 16px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
```

#### 2.2 微应用开发模板

```typescript
// 微应用入口文件 (microfrontend-entry.ts)
import { createApp, App as VueApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import type { MicrofrontendContext } from '@/types/microfrontend'

// 微应用类
class MicrofrontendApp {
  private app: VueApp | null = null
  private container: HTMLElement | null = null
  
  // 挂载应用
  async mount(context: MicrofrontendContext): Promise<void> {
    const { container, props = {}, shared } = context
    
    this.container = container
    
    // 创建 Vue 应用
    this.app = createApp(App, props)
    
    // 配置 Pinia
    const pinia = createPinia()
    this.app.use(pinia)
    
    // 配置路由
    this.app.use(router)
    
    // 配置 Element Plus
    this.app.use(ElementPlus, {
      // 使用共享的主题配置
      namespace: 'el',
      locale: shared?.locale,
      size: shared?.size || 'default'
    })
    
    // 注册图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      this.app.component(key, component)
    }
    
    // 提供共享上下文
    this.app.provide('microfrontendContext', context)
    this.app.provide('eventBus', shared?.eventBus)
    this.app.provide('sharedResources', shared?.sharedResources)
    
    // 挂载到容器
    this.app.mount(container)
    
    // 通知主应用挂载完成
    shared?.eventBus?.emit('microfrontend:mounted', {
      name: 'user-management',
      timestamp: Date.now()
    })
  }
  
  // 卸载应用
  async unmount(): Promise<void> {
    if (this.app) {
      this.app.unmount()
      this.app = null
    }
    
    if (this.container) {
      this.container.innerHTML = ''
      this.container = null
    }
  }
  
  // 更新属性
  update(props: Record<string, any>): void {
    // 更新应用属性的逻辑
    console.log('Updating microfrontend props:', props)
  }
}

// 导出微应用实例
const microfrontendApp = new MicrofrontendApp()

// 全局暴露
;(window as any).UserManagementApp = microfrontendApp

export default microfrontendApp
```

```vue
<!-- 微应用主组件 (App.vue) -->
<template>
  <div class="microfrontend-app">
    <!-- 应用内导航 -->
    <div class="app-nav" v-if="showLocalNav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- 路由视图 -->
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <!-- 应用级通知 -->
    <AppNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNotifications from './components/AppNotifications.vue'
import type { EventBus } from '@/types/microfrontend'

// 注入共享上下文
const microfrontendContext = inject('microfrontendContext')
const eventBus = inject<EventBus>('eventBus')
const sharedResources = inject('sharedResources')

// 路由信息
const route = useRoute()

// 计算属性
const showLocalNav = computed(() => {
  return route.meta?.showBreadcrumb !== false
})

const currentPageTitle = computed(() => {
  return route.meta?.title || '页面'
})

// 事件处理
let unsubscribeEvents: (() => void)[] = []

onMounted(() => {
  // 监听全局事件
  if (eventBus) {
    // 监听主题变化
    const unsubscribeTheme = eventBus.on('theme:changed', (theme: string) => {
      console.log('Theme changed to:', theme)
      // 处理主题变化
    })
    
    // 监听用户状态变化
    const unsubscribeUser = eventBus.on('user:changed', (user: any) => {
      console.log('User changed:', user)
      // 处理用户状态变化
    })
    
    unsubscribeEvents.push(unsubscribeTheme, unsubscribeUser)
  }
  
  // 通知应用就绪
  eventBus?.emit('microfrontend:ready', {
    name: 'user-management',
    timestamp: Date.now()
  })
})

onUnmounted(() => {
  // 清理事件监听
  unsubscribeEvents.forEach(unsubscribe => unsubscribe())
  
  // 通知应用卸载
  eventBus?.emit('microfrontend:unmounted', {
    name: 'user-management',
    timestamp: Date.now()
  })
})
</script>

<style lang="scss" scoped>
.microfrontend-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .app-nav {
    padding: 16px 24px;
    background: var(--el-bg-color-page);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  
  .app-content {
    flex: 1;
    overflow: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### 3. 跨应用通信

#### 3.1 事件驱动通信

```typescript
// 跨应用通信管理器
class CrossAppCommunication {
  private eventBus: EventBus
  private messageQueue: Map<string, any[]> = new Map()
  private subscriptions: Map<string, Set<string>> = new Map()
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupGlobalEvents()
  }
  
  // 设置全局事件
  private setupGlobalEvents(): void {
    // 监听应用挂载事件
    this.eventBus.on('microfrontend:mounted', (data: any) => {
      this.handleAppMounted(data.name)
    })
    
    // 监听应用卸载事件
    this.eventBus.on('microfrontend:unmounted', (data: any) => {
      this.handleAppUnmounted(data.name)
    })
  }
  
  // 处理应用挂载
  private handleAppMounted(appName: string): void {
    // 发送排队的消息
    const queuedMessages = this.messageQueue.get(appName) || []
    queuedMessages.forEach(message => {
      this.eventBus.emit(`app:${appName}:message`, message)
    })
    this.messageQueue.delete(appName)
  }
  
  // 处理应用卸载
  private handleAppUnmounted(appName: string): void {
    // 清理订阅
    this.subscriptions.delete(appName)
  }
  
  // 发送消息到指定应用
  sendMessage(targetApp: string, message: any): void {
    const eventName = `app:${targetApp}:message`
    
    // 检查目标应用是否已挂载
    if (this.subscriptions.has(targetApp)) {
      this.eventBus.emit(eventName, message)
    } else {
      // 应用未挂载，将消息加入队列
      if (!this.messageQueue.has(targetApp)) {
        this.messageQueue.set(targetApp, [])
      }
      this.messageQueue.get(targetApp)!.push(message)
    }
  }
  
  // 广播消息到所有应用
  broadcast(message: any, excludeApps: string[] = []): void {
    this.eventBus.emit('global:broadcast', {
      message,
      excludeApps,
      timestamp: Date.now()
    })
  }
  
  // 订阅消息
  subscribe(appName: string, callback: (message: any) => void): () => void {
    if (!this.subscriptions.has(appName)) {
      this.subscriptions.set(appName, new Set())
    }
    
    const eventName = `app:${appName}:message`
    const unsubscribe = this.eventBus.on(eventName, callback)
    
    // 订阅广播消息
    const unsubscribeBroadcast = this.eventBus.on('global:broadcast', (data: any) => {
      if (!data.excludeApps.includes(appName)) {
        callback(data.message)
      }
    })
    
    return () => {
      unsubscribe()
      unsubscribeBroadcast()
    }
  }
  
  // 请求-响应模式
  async request(targetApp: string, request: any, timeout = 5000): Promise<any> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout: ${targetApp}`)
      }, timeout)
      
      // 监听响应
      const unsubscribe = this.eventBus.on(`response:${requestId}`, (response: any) => {
        clearTimeout(timer)
        unsubscribe()
        
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.data)
        }
      })
      
      // 发送请求
      this.sendMessage(targetApp, {
        type: 'request',
        id: requestId,
        data: request
      })
    })
  }
  
  // 响应请求
  respond(requestId: string, response: any): void {
    this.eventBus.emit(`response:${requestId}`, {
      data: response,
      timestamp: Date.now()
    })
  }
  
  // 响应错误
  respondError(requestId: string, error: string): void {
    this.eventBus.emit(`response:${requestId}`, {
      error,
      timestamp: Date.now()
    })
  }
}
```

#### 3.2 共享状态管理

```typescript
// 跨应用状态管理
class SharedStateManager {
  private state: Map<string, any> = new Map()
  private subscribers: Map<string, Set<Function>> = new Map()
  private eventBus: EventBus
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupStateSync()
  }
  
  // 设置状态同步
  private setupStateSync(): void {
    this.eventBus.on('state:update', (data: any) => {
      this.handleStateUpdate(data.key, data.value, data.source)
    })
    
    this.eventBus.on('state:request', (data: any) => {
      this.handleStateRequest(data.key, data.requestId)
    })
  }
  
  // 处理状态更新
  private handleStateUpdate(key: string, value: any, source: string): void {
    const oldValue = this.state.get(key)
    this.state.set(key, value)
    
    // 通知订阅者
    const keySubscribers = this.subscribers.get(key)
    if (keySubscribers) {
      keySubscribers.forEach(callback => {
        try {
          callback(value, oldValue, source)
        } catch (error) {
          console.error('Error in state subscriber:', error)
        }
      })
    }
  }
  
  // 处理状态请求
  private handleStateRequest(key: string, requestId: string): void {
    const value = this.state.get(key)
    this.eventBus.emit(`state:response:${requestId}`, { key, value })
  }
  
  // 设置状态
  setState(key: string, value: any, source = 'unknown'): void {
    this.state.set(key, value)
    
    // 广播状态更新
    this.eventBus.emit('state:update', { key, value, source })
  }
  
  // 获取状态
  getState(key: string): any {
    return this.state.get(key)
  }
  
  // 异步获取状态（从其他应用）
  async getStateAsync(key: string, timeout = 3000): Promise<any> {
    const requestId = `state_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`State request timeout: ${key}`))
      }, timeout)
      
      const unsubscribe = this.eventBus.on(`state:response:${requestId}`, (data: any) => {
        clearTimeout(timer)
        unsubscribe()
        resolve(data.value)
      })
      
      this.eventBus.emit('state:request', { key, requestId })
    })
  }
  
  // 订阅状态变化
  subscribe(key: string, callback: (value: any, oldValue: any, source: string) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    
    this.subscribers.get(key)!.add(callback)
    
    // 立即调用一次回调
    const currentValue = this.state.get(key)
    if (currentValue !== undefined) {
      callback(currentValue, undefined, 'initial')
    }
    
    // 返回取消订阅函数
    return () => {
      this.subscribers.get(key)?.delete(callback)
    }
  }
  
  // 批量更新状态
  batchUpdate(updates: Record<string, any>, source = 'batch'): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.setState(key, value, source)
    })
  }
  
  // 清除状态
  clearState(key: string, source = 'clear'): void {
    this.state.delete(key)
    this.eventBus.emit('state:update', { key, value: undefined, source })
  }
  
  // 获取所有状态
  getAllState(): Record<string, any> {
    return Object.fromEntries(this.state)
  }
}
```

### 4. 主题和样式共享

#### 4.1 主题共享策略

```typescript
// 主题共享管理器
class ThemeShareManager {
  private currentTheme: string = 'default'
  private themeTokens: Map<string, any> = new Map()
  private eventBus: EventBus
  private cssVariables: Map<string, string> = new Map()
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupThemeSync()
    this.loadSharedThemes()
  }
  
  // 设置主题同步
  private setupThemeSync(): void {
    this.eventBus.on('theme:change', (data: any) => {
      this.applyTheme(data.theme, data.source)
    })
    
    this.eventBus.on('theme:tokens:update', (data: any) => {
      this.updateThemeTokens(data.theme, data.tokens, data.source)
    })
  }
  
  // 加载共享主题
  private async loadSharedThemes(): Promise<void> {
    try {
      const response = await fetch('/shared/themes.json')
      const themes = await response.json()
      
      Object.entries(themes).forEach(([name, tokens]) => {
        this.themeTokens.set(name, tokens)
      })
    } catch (error) {
      console.error('Failed to load shared themes:', error)
    }
  }
  
  // 应用主题
  applyTheme(themeName: string, source = 'unknown'): void {
    const tokens = this.themeTokens.get(themeName)
    if (!tokens) {
      console.warn(`Theme '${themeName}' not found`)
      return
    }
    
    this.currentTheme = themeName
    this.updateCSSVariables(tokens)
    
    // 更新 HTML 属性
    document.documentElement.setAttribute('data-theme', themeName)
    
    // 通知其他应用
    if (source !== 'sync') {
      this.eventBus.emit('theme:change', {
        theme: themeName,
        source: 'sync'
      })
    }
  }
  
  // 更新主题令牌
  updateThemeTokens(themeName: string, tokens: any, source = 'unknown'): void {
    this.themeTokens.set(themeName, tokens)
    
    // 如果是当前主题，立即应用
    if (this.currentTheme === themeName) {
      this.updateCSSVariables(tokens)
    }
    
    // 通知其他应用
    if (source !== 'sync') {
      this.eventBus.emit('theme:tokens:update', {
        theme: themeName,
        tokens,
        source: 'sync'
      })
    }
  }
  
  // 更新 CSS 变量
  private updateCSSVariables(tokens: any): void {
    const root = document.documentElement
    const flatTokens = this.flattenTokens(tokens)
    
    Object.entries(flatTokens).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/\./g, '-')}`
      root.style.setProperty(cssVar, String(value))
      this.cssVariables.set(cssVar, String(value))
    })
  }
  
  // 扁平化令牌
  private flattenTokens(obj: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {}
    
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenTokens(value, newKey))
      } else {
        flattened[newKey] = value
      }
    })
    
    return flattened
  }
  
  // 获取当前主题
  getCurrentTheme(): string {
    return this.currentTheme
  }
  
  // 获取主题令牌
  getThemeTokens(themeName: string): any {
    return this.themeTokens.get(themeName)
  }
  
  // 获取所有主题
  getAllThemes(): string[] {
    return Array.from(this.themeTokens.keys())
  }
  
  // 注册新主题
  registerTheme(name: string, tokens: any): void {
    this.themeTokens.set(name, tokens)
    
    // 通知其他应用
    this.eventBus.emit('theme:registered', {
      name,
      tokens
    })
  }
  
  // 获取 CSS 变量值
  getCSSVariable(name: string): string | undefined {
    return this.cssVariables.get(name)
  }
  
  // 监听主题变化
  onThemeChange(callback: (theme: string) => void): () => void {
    return this.eventBus.on('theme:change', (data: any) => {
      callback(data.theme)
    })
  }
}
```

## 实践练习

### 练习 1：搭建微前端基础架构

1. 创建主应用（Shell Application）
2. 开发两个微应用（用户管理、商品管理）
3. 实现应用的动态加载和卸载
4. 配置共享的 Element Plus 组件库

### 练习 2：实现跨应用通信

1. 实现事件总线通信机制
2. 开发共享状态管理系统
3. 实现请求-响应通信模式
4. 测试应用间的数据同步

### 练习 3：主题和样式共享

1. 实现主题的跨应用共享
2. 开发主题动态切换功能
3. 确保样式隔离和一致性
4. 支持自定义主题的注册和应用

## 学习资源

* [微前端架构指南](https://micro-frontends.org/)
* [qiankun 微前端框架](https://qiankun.umijs.org/)
* [Module Federation](https://webpack.js.org/concepts/module-federation/)
* [Single-SPA 框架](https://single-spa.js.org/)

## 作业

1. 完成所有实践练习
2. 设计并实现一个完整的微前端系统
3. 编写微前端开发和部署指南
4. 分析微前端架构的优缺点和适用场景

## 下一步学习计划

接下来我们将学习 **Element Plus 组件库二次开发**，了解如何基于 Element Plus 开发自定义组件库，实现企业级的组件扩展和定制。