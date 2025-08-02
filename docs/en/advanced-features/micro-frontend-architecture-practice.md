# Day 72: Element Plus Micro-Frontend Architecture Practice

## Learning Objectives

* Understand core concepts and advantages of micro-frontend architecture
* Master best practices for using Element Plus in micro-frontend environments
* Learn strategies for sharing component libraries and themes across applications
* Understand communication and state management between micro-frontend applications

## Knowledge Overview

### 1. Micro-Frontend Architecture Fundamentals

#### 1.1 Micro-Frontend Concepts and Architecture

```typescript
// Micro-frontend architecture definition
interface MicrofrontendArchitecture {
  // Main application (container application)
  shell: {
    framework: 'Vue 3' | 'React' | 'Angular'
    responsibilities: string[]
    routing: 'client-side' | 'server-side'
    communication: 'event-bus' | 'shared-state' | 'props'
  }
  
  // Micro applications
  microfrontends: {
    id: string
    name: string
    framework: string
    entry: string
    routes: string[]
    dependencies: string[]
    shared: string[]
  }[]
  
  // Shared resources
  shared: {
    libraries: string[]
    components: string[]
    themes: string[]
    utilities: string[]
  }
  
  // Deployment strategy
  deployment: {
    strategy: 'independent' | 'coordinated'
    registry: string
    cdn: string
    versioning: 'semantic' | 'timestamp'
  }
}

// Micro-frontend manager
class MicrofrontendManager {
  private applications: Map<string, MicrofrontendApp> = new Map()
  private sharedResources: SharedResourceManager
  private communicationBus: EventBus
  
  constructor() {
    this.sharedResources = new SharedResourceManager()
    this.communicationBus = new EventBus()
    this.initializeSharedResources()
  }
  
  // Register micro application
  registerApp(config: MicrofrontendConfig): void {
    const app = new MicrofrontendApp(config, this.sharedResources, this.communicationBus)
    this.applications.set(config.name, app)
    
    console.log(`Microfrontend '${config.name}' registered successfully`)
  }
  
  // Start micro application
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
  
  // Stop micro application
  async stopApp(name: string): Promise<void> {
    const app = this.applications.get(name)
    if (app) {
      await app.unmount()
      console.log(`Microfrontend '${name}' stopped successfully`)
    }
  }
  
  // Initialize shared resources
  private initializeSharedResources(): void {
    // Share Element Plus
    this.sharedResources.register('element-plus', {
      type: 'library',
      version: '2.4.0',
      url: 'https://unpkg.com/element-plus@2.4.0/dist/index.full.min.js',
      css: 'https://unpkg.com/element-plus@2.4.0/dist/index.css'
    })
    
    // Share Vue
    this.sharedResources.register('vue', {
      type: 'library',
      version: '3.3.0',
      url: 'https://unpkg.com/vue@3.3.0/dist/vue.global.prod.js'
    })
    
    // Share theme
    this.sharedResources.register('design-tokens', {
      type: 'theme',
      version: '1.0.0',
      url: '/shared/design-tokens.css'
    })
  }
  
  // Get application list
  getApplications(): string[] {
    return Array.from(this.applications.keys())
  }
  
  // Get shared resources
  getSharedResources(): SharedResource[] {
    return this.sharedResources.getAll()
  }
}

// Micro-frontend application class
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
  
  // Mount application
  async mount(container: HTMLElement): Promise<void> {
    this.container = container
    
    // Load dependencies
    await this.loadDependencies()
    
    // Load application code
    const appModule = await this.loadAppModule()
    
    // Create application instance
    this.instance = await appModule.mount({
      container,
      props: this.config.props || {},
      shared: this.getSharedContext()
    })
  }
  
  // Unmount application
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
  
  // Load dependencies
  private async loadDependencies(): Promise<void> {
    const dependencies = this.config.dependencies || []
    
    for (const dep of dependencies) {
      await this.sharedResources.load(dep)
    }
  }
  
  // Load application module
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
  
  // Get shared context
  private getSharedContext(): any {
    return {
      eventBus: this.communicationBus,
      sharedResources: this.sharedResources,
      theme: this.sharedResources.get('design-tokens')
    }
  }
}

// Micro-frontend configuration interface
interface MicrofrontendConfig {
  name: string
  entry: string
  globalName: string
  routes?: string[]
  dependencies?: string[]
  props?: Record<string, any>
}

// Shared resource interface
interface SharedResource {
  type: 'library' | 'component' | 'theme' | 'utility'
  version: string
  url: string
  css?: string
  dependencies?: string[]
}
```

#### 1.2 Shared Resource Management

```typescript
// Shared resource manager
class SharedResourceManager {
  private resources: Map<string, SharedResource> = new Map()
  private loadedResources: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()
  
  // Register shared resource
  register(name: string, resource: SharedResource): void {
    this.resources.set(name, resource)
  }
  
  // Load shared resource
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
  
  // Load resource implementation
  private async loadResource(name: string, resource: SharedResource): Promise<void> {
    // Load dependencies
    if (resource.dependencies) {
      for (const dep of resource.dependencies) {
        await this.load(dep)
      }
    }
    
    // Load CSS
    if (resource.css) {
      await this.loadCSS(resource.css)
    }
    
    // Load JavaScript
    await this.loadScript(resource.url)
  }
  
  // Load CSS
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
  
  // Load JavaScript
  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = url
      
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
      
      document.head.appendChild(script)
    })
  }
  
  // Get resource
  get(name: string): SharedResource | undefined {
    return this.resources.get(name)
  }
  
  // Get all resources
  getAll(): SharedResource[] {
    return Array.from(this.resources.values())
  }
  
  // Check if resource is loaded
  isLoaded(name: string): boolean {
    return this.loadedResources.has(name)
  }
}

// Event bus
class EventBus {
  private events: Map<string, Set<Function>> = new Map()
  
  // Subscribe to event
  on(event: string, callback: Function): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    
    this.events.get(event)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.events.get(event)?.delete(callback)
    }
  }
  
  // Publish event
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
  
  // Subscribe once
  once(event: string, callback: Function): void {
    const unsubscribe = this.on(event, (...args: any[]) => {
      callback(...args)
      unsubscribe()
    })
  }
  
  // Remove all listeners
  off(event?: string): void {
    if (event) {
      this.events.delete(event)
    } else {
      this.events.clear()
    }
  }
}
```

### 2. Element Plus in Micro-Frontend Applications

#### 2.1 Main Application Configuration

```vue
<!-- Shell Application -->
<template>
  <div id="app" class="shell-app">
    <!-- Global navigation -->
    <el-container>
      <el-header class="shell-header">
        <div class="header-content">
          <div class="logo">
            <img src="/logo.png" alt="Logo" />
            <span>Micro-Frontend Platform</span>
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
            <!-- Theme switcher -->
            <ThemeSelector />
            
            <!-- User menu -->
            <el-dropdown @command="handleUserCommand">
              <span class="user-info">
                <el-avatar :src="userInfo.avatar" />
                <span>{{ userInfo.name }}</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">Profile</el-dropdown-item>
                  <el-dropdown-item command="settings">Settings</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main class="shell-main">
        <!-- Micro-application containers -->
        <div
          v-for="app in applications"
          :key="app.name"
          :ref="el => setAppContainer(app.name, el)"
          v-show="activeApp === app.name"
          class="microfrontend-container"
        >
          <!-- Loading state -->
          <div v-if="loadingApps.has(app.name)" class="loading-container">
            <el-loading-service />
            <p>Loading {{ app.title }}...</p>
          </div>
          
          <!-- Error state -->
          <div v-else-if="errorApps.has(app.name)" class="error-container">
            <el-result
              icon="error"
              title="Loading Failed"
              :sub-title="errorApps.get(app.name)"
            >
              <template #extra>
                <el-button type="primary" @click="retryLoadApp(app.name)">
                  Retry
                </el-button>
              </template>
            </el-result>
          </div>
        </div>
      </el-main>
    </el-container>
    
    <!-- Global notifications -->
    <GlobalNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { MicrofrontendManager } from '@/utils/microfrontend'
import ThemeSelector from '@/components/ThemeSelector.vue'
import GlobalNotifications from '@/components/GlobalNotifications.vue'

// Micro-frontend manager
const microfrontendManager = new MicrofrontendManager()

// Application configuration
const applications = ref([
  {
    name: 'user-management',
    title: 'User Management',
    entry: '/microfrontends/user-management/index.js',
    globalName: 'UserManagementApp',
    dependencies: ['vue', 'element-plus', 'design-tokens']
  },
  {
    name: 'product-catalog',
    title: 'Product Catalog',
    entry: '/microfrontends/product-catalog/index.js',
    globalName: 'ProductCatalogApp',
    dependencies: ['vue', 'element-plus', 'design-tokens']
  },
  {
    name: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    entry: '/microfrontends/analytics-dashboard/index.js',
    globalName: 'AnalyticsDashboardApp',
    dependencies: ['vue', 'element-plus', 'design-tokens', 'echarts']
  }
])

// State management
const activeApp = ref('user-management')
const activeMenu = ref('user-management')
const loadingApps = reactive(new Set<string>())
const errorApps = reactive(new Map<string, string>())
const appContainers = reactive(new Map<string, HTMLElement>())

// User information
const userInfo = reactive({
  name: 'John Doe',
  avatar: '/avatars/default.png'
})

// Set application container reference
function setAppContainer(appName: string, el: HTMLElement | null): void {
  if (el) {
    appContainers.set(appName, el)
  }
}

// Handle menu selection
async function handleMenuSelect(appName: string): Promise<void> {
  if (activeApp.value === appName) {
    return
  }
  
  // Stop current application
  if (activeApp.value) {
    await microfrontendManager.stopApp(activeApp.value)
  }
  
  // Start new application
  activeApp.value = appName
  activeMenu.value = appName
  
  await nextTick()
  await loadMicrofrontend(appName)
}

// Load micro-frontend application
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
    errorApps.set(appName, error instanceof Error ? error.message : 'Unknown error')
  } finally {
    loadingApps.delete(appName)
  }
}

// Retry loading application
async function retryLoadApp(appName: string): Promise<void> {
  await loadMicrofrontend(appName)
}

// Handle user command
function handleUserCommand(command: string): void {
  switch (command) {
    case 'profile':
      // Open profile page
      break
    case 'settings':
      // Open settings page
      break
    case 'logout':
      // Execute logout operation
      break
  }
}

// Initialize
onMounted(async () => {
  // Register all micro applications
  applications.value.forEach(app => {
    microfrontendManager.registerApp(app)
  })
  
  // Load default application
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

#### 2.2 Micro-Application Development Template

```typescript
// Micro-application entry file (microfrontend-entry.ts)
import { createApp, App as VueApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import type { MicrofrontendContext } from '@/types/microfrontend'

// Micro-application class
class MicrofrontendApp {
  private app: VueApp | null = null
  private container: HTMLElement | null = null
  
  // Mount application
  async mount(context: MicrofrontendContext): Promise<void> {
    const { container, props = {}, shared } = context
    
    this.container = container
    
    // Create Vue application
    this.app = createApp(App, props)
    
    // Configure Pinia
    const pinia = createPinia()
    this.app.use(pinia)
    
    // Configure router
    this.app.use(router)
    
    // Configure Element Plus
    this.app.use(ElementPlus, {
      // Use shared theme configuration
      namespace: 'el',
      locale: shared?.locale,
      size: shared?.size || 'default'
    })
    
    // Register icons
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      this.app.component(key, component)
    }
    
    // Provide shared context
    this.app.provide('microfrontendContext', context)
    this.app.provide('eventBus', shared?.eventBus)
    this.app.provide('sharedResources', shared?.sharedResources)
    
    // Mount to container
    this.app.mount(container)
    
    // Notify main application of mount completion
    shared?.eventBus?.emit('microfrontend:mounted', {
      name: 'user-management',
      timestamp: Date.now()
    })
  }
  
  // Unmount application
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
  
  // Update properties
  update(props: Record<string, any>): void {
    // Logic to update application properties
    console.log('Updating microfrontend props:', props)
  }
}

// Export micro-application instance
const microfrontendApp = new MicrofrontendApp()

// Global exposure
;(window as any).UserManagementApp = microfrontendApp

export default microfrontendApp
```

```vue
<!-- Micro-application main component (App.vue) -->
<template>
  <div class="microfrontend-app">
    <!-- In-app navigation -->
    <div class="app-nav" v-if="showLocalNav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <!-- Router view -->
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <!-- Application-level notifications -->
    <AppNotifications />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppNotifications from './components/AppNotifications.vue'
import type { EventBus } from '@/types/microfrontend'

// Inject shared context
const microfrontendContext = inject('microfrontendContext')
const eventBus = inject<EventBus>('eventBus')
const sharedResources = inject('sharedResources')

// Route information
const route = useRoute()

// Computed properties
const showLocalNav = computed(() => {
  return route.meta?.showBreadcrumb !== false
})

const currentPageTitle = computed(() => {
  return route.meta?.title || 'Page'
})

// Event handling
let unsubscribeEvents: (() => void)[] = []

onMounted(() => {
  // Listen to global events
  if (eventBus) {
    // Listen to theme changes
    const unsubscribeTheme = eventBus.on('theme:changed', (theme: string) => {
      console.log('Theme changed to:', theme)
      // Handle theme change
    })
    
    // Listen to user state changes
    const unsubscribeUser = eventBus.on('user:changed', (user: any) => {
      console.log('User changed:', user)
      // Handle user state change
    })
    
    unsubscribeEvents.push(unsubscribeTheme, unsubscribeUser)
  }
  
  // Notify application ready
  eventBus?.emit('microfrontend:ready', {
    name: 'user-management',
    timestamp: Date.now()
  })
})

onUnmounted(() => {
  // Clean up event listeners
  unsubscribeEvents.forEach(unsubscribe => unsubscribe())
  
  // Notify application unmounted
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

### 3. Cross-Application Communication

#### 3.1 Event-Driven Communication

```typescript
// Cross-application communication manager
class CrossAppCommunication {
  private eventBus: EventBus
  private messageQueue: Map<string, any[]> = new Map()
  private subscriptions: Map<string, Set<string>> = new Map()
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupGlobalEvents()
  }
  
  // Set up global events
  private setupGlobalEvents(): void {
    // Listen to application mount events
    this.eventBus.on('microfrontend:mounted', (data: any) => {
      this.handleAppMounted(data.name)
    })
    
    // Listen to application unmount events
    this.eventBus.on('microfrontend:unmounted', (data: any) => {
      this.handleAppUnmounted(data.name)
    })
  }
  
  // Handle application mount
  private handleAppMounted(appName: string): void {
    // Send queued messages
    const queuedMessages = this.messageQueue.get(appName) || []
    queuedMessages.forEach(message => {
      this.eventBus.emit(`app:${appName}:message`, message)
    })
    this.messageQueue.delete(appName)
  }
  
  // Handle application unmount
  private handleAppUnmounted(appName: string): void {
    // Clean up subscriptions
    this.subscriptions.delete(appName)
  }
  
  // Send message to specific application
  sendMessage(targetApp: string, message: any): void {
    const eventName = `app:${targetApp}:message`
    
    // Check if target application is mounted
    if (this.subscriptions.has(targetApp)) {
      this.eventBus.emit(eventName, message)
    } else {
      // Application not mounted, queue message
      if (!this.messageQueue.has(targetApp)) {
        this.messageQueue.set(targetApp, [])
      }
      this.messageQueue.get(targetApp)!.push(message)
    }
  }
  
  // Broadcast message to all applications
  broadcast(message: any, excludeApps: string[] = []): void {
    this.eventBus.emit('global:broadcast', {
      message,
      excludeApps,
      timestamp: Date.now()
    })
  }
  
  // Subscribe to messages
  subscribe(appName: string, callback: (message: any) => void): () => void {
    if (!this.subscriptions.has(appName)) {
      this.subscriptions.set(appName, new Set())
    }
    
    const eventName = `app:${appName}:message`
    const unsubscribe = this.eventBus.on(eventName, callback)
    
    // Subscribe to broadcast messages
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
  
  // Request-response pattern
  async request(targetApp: string, request: any, timeout = 5000): Promise<any> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Request timeout: ${targetApp}`))
      }, timeout)
      
      // Listen for response
      const unsubscribe = this.eventBus.on(`response:${requestId}`, (response: any) => {
        clearTimeout(timer)
        unsubscribe()
        
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.data)
        }
      })
      
      // Send request
      this.sendMessage(targetApp, {
        type: 'request',
        id: requestId,
        data: request
      })
    })
  }
  
  // Respond to request
  respond(requestId: string, response: any): void {
    this.eventBus.emit(`response:${requestId}`, {
      data: response,
      timestamp: Date.now()
    })
  }
  
  // Respond with error
  respondError(requestId: string, error: string): void {
    this.eventBus.emit(`response:${requestId}`, {
      error,
      timestamp: Date.now()
    })
  }
}
```

#### 3.2 Shared State Management

```typescript
// Cross-application state management
class SharedStateManager {
  private state: Map<string, any> = new Map()
  private subscribers: Map<string, Set<Function>> = new Map()
  private eventBus: EventBus
  
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
    this.setupStateSync()
  }
  
  // Set up state synchronization
  private setupStateSync(): void {
    this.eventBus.on('state:update', (data: any) => {
      this.handleStateUpdate(data.key, data.value, data.source)
    })
    
    this.eventBus.on('state:request', (data: any) => {
      this.handleStateRequest(data.key, data.requestId)
    })
  }
  
  // Handle state update
  private handleStateUpdate(key: string, value: any, source: string): void {
    const oldValue = this.state.get(key)
    this.state.set(key, value)
    
    // Notify subscribers
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
  
  // Handle state request
  private handleStateRequest(key: string, requestId: string): void {
    const value = this.state.get(key)
    this.eventBus.emit(`state:response:${requestId}`, { key, value })
  }
  
  // Set state
  setState(key: string, value: any, source = 'unknown'): void {
    this.state.set(key, value)
    
    // Broadcast state update
    this.eventBus.emit('state:update', { key, value, source })
  }
  
  // Get state
  getState(key: string): any {
    return this.state.get(key)
  }
  
  // Asynchronously get state (from other applications)
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
  
  // Subscribe to state changes
  subscribe(key: string, callback: (value: any, oldValue: any, source: string) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    
    this.subscribers.get(key)!.add(callback)
    
    // Immediately call callback once
    const currentValue = this.state.get(key)
    if (currentValue !== undefined) {
      callback(currentValue, undefined, 'initial')
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback)
    }
  }
  
  // Batch update state
  batchUpdate(updates: Record<string, any>, source = 'batch'): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.setState(key, value, source)
    })
  }
  
  // Clear state
  clearState(key: string, source = 'clear'): void {
    this.state.delete(key)
    this.eventBus.emit('state:update', { key, value: undefined, source })
  }
  
  // Get all state
  getAllState(): Record<string, any> {
    return Object.fromEntries(this.state)
  }
}
```

### 4. Theme and Style Sharing

#### 4.1 Theme Sharing Strategy

```typescript
// Theme sharing manager
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
  
  // Set up theme synchronization
  private setupThemeSync(): void {
    this.eventBus.on('theme:change', (data: any) => {
      this.applyTheme(data.theme, data.source)
    })
    
    this.eventBus.on('theme:tokens:update', (data: any) => {
      this.updateThemeTokens(data.theme, data.tokens, data.source)
    })
  }
  
  // Load shared themes
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
  
  // Apply theme
  applyTheme(themeName: string, source = 'unknown'): void {
    const tokens = this.themeTokens.get(themeName)
    if (!tokens) {
      console.warn(`Theme '${themeName}' not found`)
      return
    }
    
    this.currentTheme = themeName
    this.updateCSSVariables(tokens)
    
    // Update HTML attribute
    document.documentElement.setAttribute('data-theme', themeName)
    
    // Notify other applications
    if (source !== 'sync') {
      this.eventBus.emit('theme:change', {
        theme: themeName,
        source: 'sync'
      })
    }
  }
  
  // Update theme tokens
  updateThemeTokens(themeName: string, tokens: any, source = 'unknown'): void {
    this.themeTokens.set(themeName, tokens)
    
    // If current theme, apply immediately
    if (this.currentTheme === themeName) {
      this.updateCSSVariables(tokens)
    }
    
    // Notify other applications
    if (source !== 'sync') {
      this.eventBus.emit('theme:tokens:update', {
        theme: themeName,
        tokens,
        source: 'sync'
      })
    }
  }
  
  // Update CSS variables
  private updateCSSVariables(tokens: any): void {
    const root = document.documentElement
    const flatTokens = this.flattenTokens(tokens)
    
    Object.entries(flatTokens).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/\./g, '-')}`
      root.style.setProperty(cssVar, String(value))
      this.cssVariables.set(cssVar, String(value))
    })
  }
  
  // Flatten tokens
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
  
  // Get current theme
  getCurrentTheme(): string {
    return this.currentTheme
  }
  
  // Get theme tokens
  getThemeTokens(themeName: string): any {
    return this.themeTokens.get(themeName)
  }
  
  // Get all themes
  getAllThemes(): string[] {
    return Array.from(this.themeTokens.keys())
  }
  
  // Register new theme
  registerTheme(name: string, tokens: any): void {
    this.themeTokens.set(name, tokens)
    
    // Notify other applications
    this.eventBus.emit('theme:registered', {
      name,
      tokens
    })
  }
  
  // Get CSS variable value
  getCSSVariable(name: string): string | undefined {
    return this.cssVariables.get(name)
  }
  
  // Listen to theme changes
  onThemeChange(callback: (theme: string) => void): () => void {
    return this.eventBus.on('theme:change', (data: any) => {
      callback(data.theme)
    })
  }
}
```

## Practical Exercises

### Exercise 1: Set Up Micro-Frontend Infrastructure

1. Create a main application (Shell Application)
2. Develop two micro-applications (User Management, Product Management)
3. Implement dynamic loading and unloading of applications
4. Configure shared Element Plus component library

### Exercise 2: Implement Cross-Application Communication

1. Implement event bus communication mechanism
2. Develop shared state management system
3. Implement request-response communication pattern
4. Test data synchronization between applications

### Exercise 3: Theme and Style Sharing

1. Implement cross-application theme sharing
2. Develop dynamic theme switching functionality
3. Ensure style isolation and consistency
4. Support registration and application of custom themes

## Learning Resources

* [Micro-Frontend Architecture Guide](https://micro-frontends.org/)
* [qiankun Micro-Frontend Framework](https://qiankun.umijs.org/)
* [Module Federation](https://webpack.js.org/concepts/module-federation/)
* [Single-SPA Framework](https://single-spa.js.org/)

## Assignment

1. Complete all practical exercises
2. Design and implement a complete micro-frontend system
3. Write micro-frontend development and deployment guidelines
4. Analyze the advantages, disadvantages, and use cases of micro-frontend architecture

## Next Learning Plan

Next, we will learn about **Element Plus Component Library Secondary Development**, understanding how to develop custom component libraries based on Element Plus, implementing enterprise-level component extensions and customizations.
