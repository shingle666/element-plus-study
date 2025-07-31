# Micro-Frontend Architecture and Module Federation for Element Plus Applications

## Overview

This guide covers implementing micro-frontend architecture using Module Federation with Element Plus applications, including shared dependencies, cross-application communication, and deployment strategies.

## Module Federation Setup

### Host Application Configuration

```typescript
// vite.config.ts (Host Application)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        'user-management': 'http://localhost:3001/assets/remoteEntry.js',
        'product-catalog': 'http://localhost:3002/assets/remoteEntry.js',
        'order-system': 'http://localhost:3003/assets/remoteEntry.js',
        'analytics-dashboard': 'http://localhost:3004/assets/remoteEntry.js'
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0'
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.4.0'
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.0'
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0'
        },
        axios: {
          singleton: true,
          requiredVersion: '^1.5.0'
        },
        'vue-i18n': {
          singleton: true,
          requiredVersion: '^9.5.0'
        }
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'src/shared')
    }
  },
  
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'element-plus', 'vue-router', 'pinia']
    }
  },
  
  server: {
    port: 3000,
    cors: true
  }
})
```

### Remote Application Configuration

```typescript
// vite.config.ts (Remote Application - User Management)
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'user-management',
      filename: 'remoteEntry.js',
      exposes: {
        './UserManagement': './src/components/UserManagement.vue',
        './UserProfile': './src/components/UserProfile.vue',
        './UserList': './src/components/UserList.vue',
        './UserRoutes': './src/router/routes.ts',
        './UserStore': './src/stores/userStore.ts'
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.3.0'
        },
        'element-plus': {
          singleton: true,
          requiredVersion: '^2.4.0'
        },
        'vue-router': {
          singleton: true,
          requiredVersion: '^4.2.0'
        },
        pinia: {
          singleton: true,
          requiredVersion: '^2.1.0'
        },
        axios: {
          singleton: true,
          requiredVersion: '^1.5.0'
        }
      }
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'element-plus', 'vue-router', 'pinia']
    }
  },
  
  server: {
    port: 3001,
    cors: true
  }
})
```

## Shared Component Library

### Design System Components

```vue
<!-- packages/shared-components/src/components/SharedButton.vue -->
<template>
  <el-button
    :type="computedType"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :round="round"
    :circle="circle"
    :plain="plain"
    :text="text"
    :bg="bg"
    :link="link"
    :color="color"
    :dark="dark"
    :auto-insert-space="autoInsertSpace"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElButton } from 'element-plus'
import type { ButtonProps } from 'element-plus'

interface SharedButtonProps extends Partial<ButtonProps> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  analytics?: {
    event: string
    category: string
    label?: string
  }
}

const props = withDefaults(defineProps<SharedButtonProps>(), {
  variant: 'primary',
  size: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const computedType = computed(() => {
  const variantMap = {
    primary: 'primary',
    secondary: 'default',
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info'
  }
  return variantMap[props.variant] || 'primary'
})

const handleClick = (event: MouseEvent) => {
  // Analytics tracking
  if (props.analytics) {
    // Send analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', props.analytics.event, {
        event_category: props.analytics.category,
        event_label: props.analytics.label
      })
    }
  }
  
  emit('click', event)
}
</script>
```

```vue
<!-- packages/shared-components/src/components/SharedForm.vue -->
<template>
  <el-form
    ref="formRef"
    :model="modelValue"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :inline="inline"
    :size="size"
    :disabled="disabled"
    :validate-on-rule-change="validateOnRuleChange"
    :hide-required-asterisk="hideRequiredAsterisk"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    @validate="handleValidate"
    v-bind="$attrs"
  >
    <slot />
    
    <div v-if="showActions" class="form-actions">
      <shared-button
        v-if="showSubmit"
        type="primary"
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ submitText }}
      </shared-button>
      
      <shared-button
        v-if="showReset"
        type="default"
        @click="handleReset"
      >
        {{ resetText }}
      </shared-button>
      
      <shared-button
        v-if="showCancel"
        type="default"
        @click="handleCancel"
      >
        {{ cancelText }}
      </shared-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElForm } from 'element-plus'
import type { FormInstance, FormRules, FormValidateCallback } from 'element-plus'
import SharedButton from './SharedButton.vue'

interface SharedFormProps {
  modelValue: Record<string, any>
  rules?: FormRules
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  inline?: boolean
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  validateOnRuleChange?: boolean
  hideRequiredAsterisk?: boolean
  showMessage?: boolean
  inlineMessage?: boolean
  statusIcon?: boolean
  showActions?: boolean
  showSubmit?: boolean
  showReset?: boolean
  showCancel?: boolean
  submitText?: string
  resetText?: string
  cancelText?: string
  submitting?: boolean
}

const props = withDefaults(defineProps<SharedFormProps>(), {
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',
  validateOnRuleChange: true,
  showMessage: true,
  showActions: true,
  showSubmit: true,
  showReset: false,
  showCancel: false,
  submitText: 'Submit',
  resetText: 'Reset',
  cancelText: 'Cancel',
  submitting: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  validate: [prop: string, isValid: boolean, message: string]
  submit: [formData: Record<string, any>]
  reset: []
  cancel: []
}>()

const formRef = ref<FormInstance>()

const handleValidate: FormValidateCallback = (prop, isValid, message) => {
  emit('validate', prop, isValid, message)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('submit', props.modelValue)
  } catch (error) {
    console.error('Form validation failed:', error)
  }
}

const handleReset = () => {
  if (!formRef.value) return
  
  formRef.value.resetFields()
  emit('reset')
}

const handleCancel = () => {
  emit('cancel')
}

// Expose form methods
defineExpose({
  validate: () => formRef.value?.validate(),
  validateField: (props: string | string[]) => formRef.value?.validateField(props),
  resetFields: () => formRef.value?.resetFields(),
  scrollToField: (prop: string) => formRef.value?.scrollToField(prop),
  clearValidate: (props?: string | string[]) => formRef.value?.clearValidate(props)
})
</script>

<style scoped>
.form-actions {
  margin-top: 24px;
  text-align: right;
}

.form-actions .el-button {
  margin-left: 12px;
}
</style>
```

### Shared Utilities and Services

```typescript
// packages/shared-utils/src/api/base-api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

export class BaseApiService {
  private instance: AxiosInstance
  private tokenKey = 'auth_token'
  
  constructor(config: ApiConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      withCredentials: config.withCredentials || false
    })
    
    this.setupInterceptors()
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId()
        
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    
    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response
        
        if (data.success === false) {
          ElMessage.error(data.message || 'Request failed')
          return Promise.reject(new Error(data.message))
        }
        
        return response
      },
      (error) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }
  
  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          this.handleUnauthorized()
          break
        case 403:
          ElMessage.error('Access denied')
          break
        case 404:
          ElMessage.error('Resource not found')
          break
        case 500:
          ElMessage.error('Server error')
          break
        default:
          ElMessage.error(data?.message || 'Request failed')
      }
    } else if (error.request) {
      ElMessage.error('Network error')
    } else {
      ElMessage.error('Request configuration error')
    }
  }
  
  private handleUnauthorized() {
    this.removeToken()
    ElMessage.error('Session expired, please login again')
    
    // Emit global event for logout
    window.dispatchEvent(new CustomEvent('auth:logout'))
  }
  
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }
  
  private removeToken(): void {
    localStorage.removeItem(this.tokenKey)
  }
  
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Public API methods
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config)
    return response.data
  }
  
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config)
    return response.data
  }
  
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config)
    return response.data
  }
  
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config)
    return response.data
  }
  
  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }
}

// Create singleton instance
export const createApiService = (config: ApiConfig) => {
  return new BaseApiService(config)
}
```

## Cross-Application Communication

### Event Bus System

```typescript
// packages/shared-utils/src/communication/event-bus.ts
export interface MicroFrontendEvent {
  type: string
  payload?: any
  source: string
  timestamp: number
  id: string
}

export interface EventSubscription {
  id: string
  type: string
  callback: (event: MicroFrontendEvent) => void
  once?: boolean
}

export class MicroFrontendEventBus {
  private static instance: MicroFrontendEventBus
  private subscriptions: Map<string, EventSubscription[]> = new Map()
  private eventHistory: MicroFrontendEvent[] = []
  private maxHistorySize = 100
  
  private constructor() {
    this.setupWindowMessageListener()
  }
  
  public static getInstance(): MicroFrontendEventBus {
    if (!MicroFrontendEventBus.instance) {
      MicroFrontendEventBus.instance = new MicroFrontendEventBus()
    }
    return MicroFrontendEventBus.instance
  }
  
  private setupWindowMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data && event.data.__MICRO_FRONTEND_EVENT__) {
        this.handleEvent(event.data.event)
      }
    })
  }
  
  public emit(type: string, payload?: any, source = 'unknown'): void {
    const event: MicroFrontendEvent = {
      type,
      payload,
      source,
      timestamp: Date.now(),
      id: this.generateEventId()
    }
    
    this.addToHistory(event)
    this.handleEvent(event)
    
    // Broadcast to other micro-frontends
    this.broadcastEvent(event)
  }
  
  public on(
    type: string,
    callback: (event: MicroFrontendEvent) => void
  ): () => void {
    return this.subscribe(type, callback, false)
  }
  
  public once(
    type: string,
    callback: (event: MicroFrontendEvent) => void
  ): () => void {
    return this.subscribe(type, callback, true)
  }
  
  private subscribe(
    type: string,
    callback: (event: MicroFrontendEvent) => void,
    once: boolean
  ): () => void {
    const subscription: EventSubscription = {
      id: this.generateSubscriptionId(),
      type,
      callback,
      once
    }
    
    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, [])
    }
    
    this.subscriptions.get(type)!.push(subscription)
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(subscription.id)
    }
  }
  
  public unsubscribe(subscriptionId: string): void {
    for (const [type, subscriptions] of this.subscriptions.entries()) {
      const index = subscriptions.findIndex(sub => sub.id === subscriptionId)
      if (index !== -1) {
        subscriptions.splice(index, 1)
        if (subscriptions.length === 0) {
          this.subscriptions.delete(type)
        }
        break
      }
    }
  }
  
  private handleEvent(event: MicroFrontendEvent): void {
    const subscriptions = this.subscriptions.get(event.type)
    if (!subscriptions) return
    
    // Create a copy to avoid issues with modifications during iteration
    const subscriptionsCopy = [...subscriptions]
    
    subscriptionsCopy.forEach(subscription => {
      try {
        subscription.callback(event)
        
        // Remove one-time subscriptions
        if (subscription.once) {
          this.unsubscribe(subscription.id)
        }
      } catch (error) {
        console.error('Error in event subscription callback:', error)
      }
    })
  }
  
  private broadcastEvent(event: MicroFrontendEvent): void {
    // Broadcast to parent window
    if (window.parent !== window) {
      window.parent.postMessage({
        __MICRO_FRONTEND_EVENT__: true,
        event
      }, '*')
    }
    
    // Broadcast to all iframes
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          __MICRO_FRONTEND_EVENT__: true,
          event
        }, '*')
      }
    })
  }
  
  private addToHistory(event: MicroFrontendEvent): void {
    this.eventHistory.push(event)
    
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }
  }
  
  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateSubscriptionId(): string {
    return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  public getEventHistory(): MicroFrontendEvent[] {
    return [...this.eventHistory]
  }
  
  public clearHistory(): void {
    this.eventHistory = []
  }
  
  public getSubscriptions(): Map<string, EventSubscription[]> {
    return new Map(this.subscriptions)
  }
}

// Global instance
export const eventBus = MicroFrontendEventBus.getInstance()

// Convenience functions
export const emit = (type: string, payload?: any, source?: string) => {
  eventBus.emit(type, payload, source)
}

export const on = (type: string, callback: (event: MicroFrontendEvent) => void) => {
  return eventBus.on(type, callback)
}

export const once = (type: string, callback: (event: MicroFrontendEvent) => void) => {
  return eventBus.once(type, callback)
}
```

### Shared State Management

```typescript
// packages/shared-state/src/stores/global-store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { eventBus } from '@shared/communication/event-bus'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  roles: string[]
  permissions: string[]
}

export interface GlobalState {
  user: User | null
  theme: 'light' | 'dark'
  language: string
  notifications: Notification[]
  loading: boolean
}

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

export const useGlobalStore = defineStore('global', () => {
  // State
  const user = ref<User | null>(null)
  const theme = ref<'light' | 'dark'>('light')
  const language = ref('en')
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  
  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )
  const userPermissions = computed(() => user.value?.permissions || [])
  
  // Actions
  const setUser = (newUser: User | null) => {
    user.value = newUser
    
    // Emit event to other micro-frontends
    eventBus.emit('user:changed', { user: newUser }, 'global-store')
  }
  
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme)
    
    // Persist to localStorage
    localStorage.setItem('theme', newTheme)
    
    // Emit event
    eventBus.emit('theme:changed', { theme: newTheme }, 'global-store')
  }
  
  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage
    
    // Persist to localStorage
    localStorage.setItem('language', newLanguage)
    
    // Emit event
    eventBus.emit('language:changed', { language: newLanguage }, 'global-store')
  }
  
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    }
    
    notifications.value.unshift(newNotification)
    
    // Emit event
    eventBus.emit('notification:added', { notification: newNotification }, 'global-store')
    
    return newNotification.id
  }
  
  const markNotificationAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      
      // Emit event
      eventBus.emit('notification:read', { notificationId }, 'global-store')
    }
  }
  
  const removeNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      
      // Emit event
      eventBus.emit('notification:removed', { notificationId }, 'global-store')
    }
  }
  
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
    
    // Emit event
    eventBus.emit('loading:changed', { loading: isLoading }, 'global-store')
  }
  
  const hasPermission = (permission: string): boolean => {
    return userPermissions.value.includes(permission)
  }
  
  const hasRole = (role: string): boolean => {
    return user.value?.roles.includes(role) || false
  }
  
  // Initialize from localStorage
  const initializeFromStorage = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse saved user:', error)
      }
    }
  }
  
  // Listen to events from other micro-frontends
  const setupEventListeners = () => {
    eventBus.on('user:logout', () => {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
    })
    
    eventBus.on('user:login', (event) => {
      if (event.payload?.user) {
        setUser(event.payload.user)
        localStorage.setItem('user', JSON.stringify(event.payload.user))
      }
    })
  }
  
  // Initialize store
  initializeFromStorage()
  setupEventListeners()
  
  return {
    // State
    user,
    theme,
    language,
    notifications,
    loading,
    
    // Computed
    isAuthenticated,
    unreadNotifications,
    userPermissions,
    
    // Actions
    setUser,
    setTheme,
    setLanguage,
    addNotification,
    markNotificationAsRead,
    removeNotification,
    setLoading,
    hasPermission,
    hasRole
  }
})
```

## Dynamic Module Loading

### Remote Component Loader

```typescript
// src/utils/remote-component-loader.ts
import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { ElLoading } from 'element-plus'

export interface RemoteComponentConfig {
  url: string
  scope: string
  module: string
  fallback?: any
  loading?: any
  error?: any
  timeout?: number
  retries?: number
}

export class RemoteComponentLoader {
  private static loadedScripts = new Set<string>()
  private static loadingPromises = new Map<string, Promise<any>>()
  
  public static async loadRemoteComponent(config: RemoteComponentConfig) {
    const { url, scope, module, fallback, loading, error, timeout = 10000, retries = 3 } = config
    
    return defineAsyncComponent({
      loader: () => this.loadRemoteModule(url, scope, module, retries),
      loadingComponent: loading,
      errorComponent: error || fallback,
      timeout,
      suspensible: false
    })
  }
  
  private static async loadRemoteModule(
    url: string,
    scope: string,
    module: string,
    retries: number
  ): Promise<any> {
    const cacheKey = `${url}#${scope}#${module}`
    
    // Check if already loading
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }
    
    const loadPromise = this.attemptLoad(url, scope, module, retries)
    this.loadingPromises.set(cacheKey, loadPromise)
    
    try {
      const result = await loadPromise
      this.loadingPromises.delete(cacheKey)
      return result
    } catch (error) {
      this.loadingPromises.delete(cacheKey)
      throw error
    }
  }
  
  private static async attemptLoad(
    url: string,
    scope: string,
    module: string,
    retries: number
  ): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Load the remote script
        await this.loadScript(url)
        
        // Get the container
        const container = (window as any)[scope]
        if (!container) {
          throw new Error(`Container '${scope}' not found`)
        }
        
        // Initialize the container
        await container.init(__webpack_share_scopes__.default)
        
        // Get the factory
        const factory = await container.get(module)
        
        // Get the module
        const Module = factory()
        
        return Module
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed to load ${url}#${scope}#${module}:`, error)
        
        if (attempt === retries) {
          throw new Error(`Failed to load remote module after ${retries + 1} attempts: ${error}`)
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }
  
  private static async loadScript(url: string): Promise<void> {
    if (this.loadedScripts.has(url)) {
      return Promise.resolve()
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = url
      
      script.onload = () => {
        this.loadedScripts.add(url)
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${url}`))
      }
      
      document.head.appendChild(script)
    })
  }
  
  public static createLoadingComponent(message = 'Loading component...') {
    return {
      template: `
        <div class="remote-component-loading">
          <el-loading-spinner />
          <p>{{ message }}</p>
        </div>
      `,
      data() {
        return { message }
      }
    }
  }
  
  public static createErrorComponent(errorMessage = 'Failed to load component') {
    return {
      template: `
        <div class="remote-component-error">
          <el-result
            icon="error"
            title="Component Load Error"
            :sub-title="errorMessage"
          >
            <template #extra>
              <el-button type="primary" @click="retry">
                Retry
              </el-button>
            </template>
          </el-result>
        </div>
      `,
      data() {
        return { errorMessage }
      },
      methods: {
        retry() {
          window.location.reload()
        }
      }
    }
  }
}

// Convenience function
export const loadRemoteComponent = (config: RemoteComponentConfig) => {
  return RemoteComponentLoader.loadRemoteComponent({
    loading: RemoteComponentLoader.createLoadingComponent(),
    error: RemoteComponentLoader.createErrorComponent(),
    ...config
  })
}
```

### Dynamic Route Loading

```typescript
// src/router/dynamic-routes.ts
import type { RouteRecordRaw } from 'vue-router'
import { loadRemoteComponent } from '@/utils/remote-component-loader'

export interface RemoteRouteConfig {
  name: string
  path: string
  remoteUrl: string
  scope: string
  module: string
  meta?: Record<string, any>
  children?: RemoteRouteConfig[]
}

export class DynamicRouteManager {
  private static instance: DynamicRouteManager
  private remoteRoutes: Map<string, RemoteRouteConfig> = new Map()
  
  public static getInstance(): DynamicRouteManager {
    if (!DynamicRouteManager.instance) {
      DynamicRouteManager.instance = new DynamicRouteManager()
    }
    return DynamicRouteManager.instance
  }
  
  public registerRemoteRoute(config: RemoteRouteConfig): void {
    this.remoteRoutes.set(config.name, config)
  }
  
  public async loadRemoteRoutes(): Promise<RouteRecordRaw[]> {
    const routes: RouteRecordRaw[] = []
    
    for (const [name, config] of this.remoteRoutes.entries()) {
      try {
        const route = await this.createRouteFromConfig(config)
        routes.push(route)
      } catch (error) {
        console.error(`Failed to load remote route '${name}':`, error)
        
        // Create fallback route
        routes.push(this.createFallbackRoute(config))
      }
    }
    
    return routes
  }
  
  private async createRouteFromConfig(config: RemoteRouteConfig): Promise<RouteRecordRaw> {
    const component = await loadRemoteComponent({
      url: config.remoteUrl,
      scope: config.scope,
      module: config.module
    })
    
    const route: RouteRecordRaw = {
      name: config.name,
      path: config.path,
      component,
      meta: {
        remote: true,
        remoteUrl: config.remoteUrl,
        scope: config.scope,
        module: config.module,
        ...config.meta
      }
    }
    
    // Handle children routes
    if (config.children && config.children.length > 0) {
      route.children = await Promise.all(
        config.children.map(child => this.createRouteFromConfig(child))
      )
    }
    
    return route
  }
  
  private createFallbackRoute(config: RemoteRouteConfig): RouteRecordRaw {
    return {
      name: config.name,
      path: config.path,
      component: {
        template: `
          <div class="remote-route-error">
            <el-result
              icon="error"
              title="Module Unavailable"
              sub-title="The requested module could not be loaded"
            >
              <template #extra>
                <el-button type="primary" @click="retry">
                  Retry
                </el-button>
                <el-button @click="goHome">
                  Go Home
                </el-button>
              </template>
            </el-result>
          </div>
        `,
        methods: {
          retry() {
            window.location.reload()
          },
          goHome() {
            this.$router.push('/')
          }
        }
      },
      meta: {
        remote: true,
        fallback: true,
        ...config.meta
      }
    }
  }
  
  public getRemoteRoutes(): RemoteRouteConfig[] {
    return Array.from(this.remoteRoutes.values())
  }
  
  public removeRemoteRoute(name: string): boolean {
    return this.remoteRoutes.delete(name)
  }
  
  public hasRemoteRoute(name: string): boolean {
    return this.remoteRoutes.has(name)
  }
}

// Global instance
export const dynamicRouteManager = DynamicRouteManager.getInstance()

// Register remote routes
dynamicRouteManager.registerRemoteRoute({
  name: 'user-management',
  path: '/users',
  remoteUrl: 'http://localhost:3001/assets/remoteEntry.js',
  scope: 'userManagement',
  module: './UserRoutes',
  meta: {
    requiresAuth: true,
    permissions: ['user:read']
  }
})

dynamicRouteManager.registerRemoteRoute({
  name: 'product-catalog',
  path: '/products',
  remoteUrl: 'http://localhost:3002/assets/remoteEntry.js',
  scope: 'productCatalog',
  module: './ProductRoutes',
  meta: {
    requiresAuth: false
  }
})
```

## Testing Micro-Frontend Applications

### Integration Testing

```typescript
// tests/integration/micro-frontend.test.ts
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { eventBus } from '@shared/communication/event-bus'
import App from '@/App.vue'

// Mock remote components
vi.mock('@/utils/remote-component-loader', () => ({
  loadRemoteComponent: vi.fn(() => {
    return {
      template: '<div data-testid="mock-remote-component">Mock Remote Component</div>'
    }
  })
}))

describe('Micro-Frontend Integration', () => {
  let wrapper: any
  let router: any
  let pinia: any
  
  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: { template: '<div>Home</div>' }
        },
        {
          path: '/users',
          component: { template: '<div data-testid="users-page">Users</div>' }
        }
      ]
    })
    
    pinia = createPinia()
    
    wrapper = mount(App, {
      global: {
        plugins: [router, pinia]
      }
    })
  })
  
  it('should load remote components successfully', async () => {
    await router.push('/users')
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('[data-testid="users-page"]').exists()).toBe(true)
  })
  
  it('should handle cross-application communication', async () => {
    const mockCallback = vi.fn()
    
    // Subscribe to event
    eventBus.on('test:event', mockCallback)
    
    // Emit event
    eventBus.emit('test:event', { message: 'Hello from test' }, 'test')
    
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'test:event',
        payload: { message: 'Hello from test' },
        source: 'test'
      })
    )
  })
  
  it('should handle authentication state across micro-frontends', async () => {
    const { useGlobalStore } = await import('@shared/stores/global-store')
    const globalStore = useGlobalStore()
    
    // Mock user login
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read']
    }
    
    globalStore.setUser(mockUser)
    
    expect(globalStore.isAuthenticated).toBe(true)
    expect(globalStore.user).toEqual(mockUser)
  })
  
  it('should handle theme changes across micro-frontends', async () => {
    const { useGlobalStore } = await import('@shared/stores/global-store')
    const globalStore = useGlobalStore()
    
    const mockCallback = vi.fn()
    eventBus.on('theme:changed', mockCallback)
    
    globalStore.setTheme('dark')
    
    expect(globalStore.theme).toBe('dark')
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'theme:changed',
        payload: { theme: 'dark' }
      })
    )
  })
})
```

### E2E Testing with Multiple Applications

```typescript
// tests/e2e/micro-frontend-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Micro-Frontend E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start all micro-frontend applications
    await page.goto('http://localhost:3000') // Host app
  })
  
  test('should navigate between micro-frontends', async ({ page }) => {
    // Navigate to user management
    await page.click('[data-testid="nav-users"]')
    await expect(page).toHaveURL(/.*\/users/)
    
    // Verify user management micro-frontend loaded
    await expect(page.locator('[data-testid="user-list"]')).toBeVisible()
    
    // Navigate to product catalog
    await page.click('[data-testid="nav-products"]')
    await expect(page).toHaveURL(/.*\/products/)
    
    // Verify product catalog micro-frontend loaded
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible()
  })
  
  test('should maintain authentication state across micro-frontends', async ({ page }) => {
    // Login in host application
    await page.click('[data-testid="login-button"]')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-login"]')
    
    // Verify login success
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible()
    
    // Navigate to user management
    await page.click('[data-testid="nav-users"]')
    
    // Verify authenticated state in micro-frontend
    await expect(page.locator('[data-testid="authenticated-content"]')).toBeVisible()
    
    // Navigate to product catalog
    await page.click('[data-testid="nav-products"]')
    
    // Verify authenticated state persists
    await expect(page.locator('[data-testid="user-specific-content"]')).toBeVisible()
  })
  
  test('should handle theme changes across micro-frontends', async ({ page }) => {
    // Change theme in host application
    await page.click('[data-testid="theme-toggle"]')
    
    // Verify dark theme applied to host
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    
    // Navigate to user management
    await page.click('[data-testid="nav-users"]')
    
    // Verify dark theme applied to micro-frontend
    await expect(page.locator('[data-testid="user-management-container"]')).toHaveClass(/dark-theme/)
    
    // Navigate to product catalog
    await page.click('[data-testid="nav-products"]')
    
    // Verify dark theme applied to micro-frontend
    await expect(page.locator('[data-testid="product-catalog-container"]')).toHaveClass(/dark-theme/)
  })
  
  test('should handle error states gracefully', async ({ page }) => {
    // Simulate network error by blocking remote entry
    await page.route('**/remoteEntry.js', route => route.abort())
    
    // Navigate to user management
    await page.click('[data-testid="nav-users"]')
    
    // Verify error state is displayed
    await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible()
    await expect(page.locator('text=Module Unavailable')).toBeVisible()
    
    // Verify retry button is available
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })
})
```

This comprehensive guide covers all aspects of implementing micro-frontend architecture with Element Plus applications, from basic setup to advanced testing strategies.