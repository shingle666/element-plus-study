# 第60天：Element Plus 综合项目实战（四）

## 学习目标

完成我们的智能企业管理平台开发，今天重点实现错误处理、测试体系、部署发布和项目总结。

- 建立完善的错误处理机制
- 构建全面的测试体系
- 实现自动化部署流程
- 进行性能优化和监控
- 项目总结和经验分享

## 1. 错误处理与日志系统

### 1.1 全局错误处理

```typescript
// src/utils/error-handler.ts

import { App } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useErrorStore } from '@/store/modules/error'
import { logger } from './logger'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'network',
  BUSINESS = 'business',
  RUNTIME = 'runtime',
  PERMISSION = 'permission',
  VALIDATION = 'validation'
}

/**
 * 错误级别枚举
 */
export enum ErrorLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * 应用错误类
 */
export class AppError extends Error {
  public readonly type: ErrorType
  public readonly level: ErrorLevel
  public readonly code: string
  public readonly timestamp: Date
  public readonly context?: any
  public readonly stack?: string

  constructor(
    message: string,
    type: ErrorType = ErrorType.RUNTIME,
    level: ErrorLevel = ErrorLevel.MEDIUM,
    code?: string,
    context?: any
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.level = level
    this.code = code || this.generateErrorCode()
    this.timestamp = new Date()
    this.context = context
    
    // 保留堆栈信息
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  private generateErrorCode(): string {
    return `${this.type.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 转换为可序列化的对象
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      level: this.level,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack
    }
  }
}

/**
 * 错误处理器类
 */
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorStore: any
  private reportQueue: AppError[] = []
  private isReporting = false

  private constructor() {
    this.errorStore = useErrorStore()
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * 处理错误
   */
  public handleError(error: Error | AppError, context?: any): void {
    let appError: AppError

    if (error instanceof AppError) {
      appError = error
    } else {
      appError = this.convertToAppError(error, context)
    }

    // 记录错误
    this.logError(appError)

    // 存储错误
    this.storeError(appError)

    // 显示错误
    this.displayError(appError)

    // 上报错误
    this.reportError(appError)
  }

  /**
   * 转换为应用错误
   */
  private convertToAppError(error: Error, context?: any): AppError {
    let type = ErrorType.RUNTIME
    let level = ErrorLevel.MEDIUM

    // 根据错误类型和消息判断错误类型和级别
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      type = ErrorType.NETWORK
      level = ErrorLevel.HIGH
    } else if (error.message.includes('Permission')) {
      type = ErrorType.PERMISSION
      level = ErrorLevel.HIGH
    } else if (error.message.includes('Validation')) {
      type = ErrorType.VALIDATION
      level = ErrorLevel.LOW
    }

    return new AppError(error.message, type, level, undefined, {
      originalError: error.name,
      context
    })
  }

  /**
   * 记录错误日志
   */
  private logError(error: AppError): void {
    const logLevel = this.getLogLevel(error.level)
    logger[logLevel]('Application Error:', {
      code: error.code,
      type: error.type,
      level: error.level,
      message: error.message,
      timestamp: error.timestamp,
      context: error.context,
      stack: error.stack
    })
  }

  /**
   * 存储错误到状态管理
   */
  private storeError(error: AppError): void {
    this.errorStore.addError(error)
  }

  /**
   * 显示错误给用户
   */
  private displayError(error: AppError): void {
    const shouldDisplay = this.shouldDisplayError(error)
    
    if (!shouldDisplay) return

    switch (error.level) {
      case ErrorLevel.CRITICAL:
      case ErrorLevel.HIGH:
        ElNotification({
          title: '系统错误',
          message: this.getUserFriendlyMessage(error),
          type: 'error',
          duration: 0, // 不自动关闭
          showClose: true
        })
        break
      
      case ErrorLevel.MEDIUM:
        ElMessage({
          message: this.getUserFriendlyMessage(error),
          type: 'error',
          duration: 5000
        })
        break
      
      case ErrorLevel.LOW:
        ElMessage({
          message: this.getUserFriendlyMessage(error),
          type: 'warning',
          duration: 3000
        })
        break
    }
  }

  /**
   * 上报错误到服务器
   */
  private async reportError(error: AppError): Promise<void> {
    // 只上报中等级别以上的错误
    if (error.level === ErrorLevel.LOW) return

    this.reportQueue.push(error)
    
    if (!this.isReporting) {
      this.processReportQueue()
    }
  }

  /**
   * 处理错误上报队列
   */
  private async processReportQueue(): Promise<void> {
    if (this.isReporting || this.reportQueue.length === 0) return

    this.isReporting = true

    try {
      while (this.reportQueue.length > 0) {
        const errors = this.reportQueue.splice(0, 10) // 批量上报
        await this.sendErrorReport(errors)
      }
    } catch (reportError) {
      console.error('Failed to report errors:', reportError)
    } finally {
      this.isReporting = false
    }
  }

  /**
   * 发送错误报告
   */
  private async sendErrorReport(errors: AppError[]): Promise<void> {
    try {
      const response = await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          errors: errors.map(error => error.toJSON()),
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error reporting failed:', error)
      // 重新加入队列，稍后重试
      this.reportQueue.unshift(...errors)
    }
  }

  /**
   * 判断是否应该显示错误
   */
  private shouldDisplayError(error: AppError): boolean {
    // 避免重复显示相同错误
    const recentErrors = this.errorStore.getRecentErrors(60000) // 1分钟内
    const duplicateError = recentErrors.find((e: AppError) => 
      e.message === error.message && e.type === error.type
    )
    
    return !duplicateError
  }

  /**
   * 获取用户友好的错误消息
   */
  private getUserFriendlyMessage(error: AppError): string {
    const messageMap: Record<string, string> = {
      [ErrorType.NETWORK]: '网络连接异常，请检查网络设置',
      [ErrorType.PERMISSION]: '您没有权限执行此操作',
      [ErrorType.VALIDATION]: '输入数据格式不正确',
      [ErrorType.BUSINESS]: '业务处理异常',
      [ErrorType.RUNTIME]: '系统运行异常'
    }

    return messageMap[error.type] || error.message
  }

  /**
   * 获取日志级别
   */
  private getLogLevel(errorLevel: ErrorLevel): 'error' | 'warn' | 'info' {
    switch (errorLevel) {
      case ErrorLevel.CRITICAL:
      case ErrorLevel.HIGH:
        return 'error'
      case ErrorLevel.MEDIUM:
        return 'warn'
      case ErrorLevel.LOW:
        return 'info'
      default:
        return 'error'
    }
  }
}

/**
 * 设置全局错误处理
 */
export function setupErrorHandler(app: App): void {
  const errorHandler = ErrorHandler.getInstance()

  // Vue 错误处理
  app.config.errorHandler = (error: any, instance, info) => {
    console.error('Vue Error:', error, info)
    errorHandler.handleError(error, { instance, info })
  }

  // 全局未捕获错误
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error)
    errorHandler.handleError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  // Promise 未捕获错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason)
    errorHandler.handleError(
      new AppError(
        event.reason?.message || 'Unhandled Promise Rejection',
        ErrorType.RUNTIME,
        ErrorLevel.HIGH
      ),
      { reason: event.reason }
    )
  })

  // 资源加载错误
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Resource Error:', event)
      errorHandler.handleError(
        new AppError(
          `Failed to load resource: ${(event.target as any)?.src || (event.target as any)?.href}`,
          ErrorType.NETWORK,
          ErrorLevel.MEDIUM
        ),
        { target: event.target }
      )
    }
  }, true)
}

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance()
```

### 1.2 日志系统

```typescript
// src/utils/logger.ts

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * 日志接口
 */
export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
  source?: string
  userId?: string
  sessionId?: string
}

/**
 * 日志配置接口
 */
export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteUrl?: string
  maxLocalLogs: number
  batchSize: number
  flushInterval: number
}

/**
 * 日志器类
 */
export class Logger {
  private config: LoggerConfig
  private localLogs: LogEntry[] = []
  private pendingLogs: LogEntry[] = []
  private flushTimer: NodeJS.Timeout | null = null
  private sessionId: string

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      maxLocalLogs: 1000,
      batchSize: 50,
      flushInterval: 30000, // 30秒
      ...config
    }
    
    this.sessionId = this.generateSessionId()
    this.startFlushTimer()
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 开始定时刷新
   */
  private startFlushTimer(): void {
    if (this.config.enableRemote) {
      this.flushTimer = setInterval(() => {
        this.flush()
      }, this.config.flushInterval)
    }
  }

  /**
   * 停止定时刷新
   */
  public stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  /**
   * 记录调试日志
   */
  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * 记录信息日志
   */
  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * 记录警告日志
   */
  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * 记录错误日志
   */
  public error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data)
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: any): void {
    if (level < this.config.level) return

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      source: this.getSource(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId
    }

    // 控制台输出
    if (this.config.enableConsole) {
      this.logToConsole(logEntry)
    }

    // 本地存储
    this.storeLocally(logEntry)

    // 远程发送
    if (this.config.enableRemote) {
      this.queueForRemote(logEntry)
    }
  }

  /**
   * 控制台输出
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const levelName = LogLevel[entry.level]
    const prefix = `[${timestamp}] [${levelName}]`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data)
        break
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data)
        break
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data)
        break
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data)
        break
    }
  }

  /**
   * 本地存储
   */
  private storeLocally(entry: LogEntry): void {
    this.localLogs.push(entry)
    
    // 限制本地日志数量
    if (this.localLogs.length > this.config.maxLocalLogs) {
      this.localLogs.shift()
    }
  }

  /**
   * 加入远程发送队列
   */
  private queueForRemote(entry: LogEntry): void {
    this.pendingLogs.push(entry)
    
    // 达到批量大小时立即发送
    if (this.pendingLogs.length >= this.config.batchSize) {
      this.flush()
    }
  }

  /**
   * 刷新待发送日志
   */
  public async flush(): Promise<void> {
    if (this.pendingLogs.length === 0 || !this.config.enableRemote) return

    const logsToSend = this.pendingLogs.splice(0, this.config.batchSize)
    
    try {
      await this.sendLogs(logsToSend)
    } catch (error) {
      console.error('Failed to send logs:', error)
      // 重新加入队列
      this.pendingLogs.unshift(...logsToSend)
    }
  }

  /**
   * 发送日志到远程服务器
   */
  private async sendLogs(logs: LogEntry[]): Promise<void> {
    if (!this.config.remoteUrl) return

    const response = await fetch(this.config.remoteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logs: logs.map(log => ({
          ...log,
          timestamp: log.timestamp.toISOString()
        })),
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  /**
   * 获取本地日志
   */
  public getLocalLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.localLogs.filter(log => log.level >= level)
    }
    return [...this.localLogs]
  }

  /**
   * 清空本地日志
   */
  public clearLocalLogs(): void {
    this.localLogs = []
  }

  /**
   * 获取当前源
   */
  private getSource(): string {
    const error = new Error()
    const stack = error.stack
    if (stack) {
      const lines = stack.split('\n')
      // 跳过 Logger 相关的堆栈
      for (let i = 3; i < lines.length; i++) {
        const line = lines[i]
        if (line && !line.includes('Logger')) {
          const match = line.match(/at\s+(.+?)\s+\(/)
          if (match) {
            return match[1]
          }
        }
      }
    }
    return 'unknown'
  }

  /**
   * 获取当前用户ID
   */
  private getCurrentUserId(): string | undefined {
    // 这里应该从用户状态管理中获取
    try {
      const userStore = (window as any).__USER_STORE__
      return userStore?.id
    } catch {
      return undefined
    }
  }

  /**
   * 更新配置
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
    
    // 重启定时器
    this.stopFlushTimer()
    this.startFlushTimer()
  }

  /**
   * 销毁日志器
   */
  public destroy(): void {
    this.stopFlushTimer()
    this.flush() // 最后一次刷新
  }
}

// 创建默认日志器实例
export const logger = new Logger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: !import.meta.env.DEV,
  remoteUrl: '/api/logs'
})

// 页面卸载时刷新日志
window.addEventListener('beforeunload', () => {
  logger.flush()
})
```

## 2. 测试体系构建

### 2.1 单元测试配置

```typescript
// vitest.config.ts

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
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

```typescript
// tests/setup.ts

import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { vi } from 'vitest'

// 全局配置
config.global.plugins = [ElementPlus]

// Mock 全局对象
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})
```

### 2.2 组件测试示例

```typescript
// tests/components/UserForm.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElForm, ElFormItem, ElInput, ElSelect, ElOption } from 'element-plus'
import UserForm from '@/views/user/components/UserForm.vue'
import type { User } from '@/types/user'

// Mock API
vi.mock('@/api/role', () => ({
  getRoleList: vi.fn().mockResolvedValue({
    data: {
      items: [
        { code: 'admin', name: '管理员' },
        { code: 'user', name: '普通用户' }
      ]
    }
  })
}))

vi.mock('@/api/department', () => ({
  getDepartmentList: vi.fn().mockResolvedValue({
    data: {
      items: [
        { code: 'tech', name: '技术部' },
        { code: 'sales', name: '销售部' }
      ]
    }
  })
}))

describe('UserForm', () => {
  let wrapper: any
  
  const defaultProps = {
    userData: {
      id: undefined,
      username: '',
      name: '',
      email: '',
      password: '',
      avatar: '',
      roles: [],
      department: '',
      position: '',
      status: 1
    } as Partial<User>,
    dialogStatus: 'create' as const
  }

  beforeEach(() => {
    wrapper = mount(UserForm, {
      props: defaultProps,
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElSelect,
          ElOption
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.user-form').exists()).toBe(true)
  })

  it('displays form fields', () => {
    expect(wrapper.find('input[placeholder="请输入用户名"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入姓名"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入邮箱"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入密码"]').exists()).toBe(true)
  })

  it('validates required fields', async () => {
    // 触发表单验证
    await wrapper.vm.submitForm()
    
    // 检查是否显示验证错误
    await wrapper.vm.$nextTick()
    
    const errorMessages = wrapper.findAll('.el-form-item__error')
    expect(errorMessages.length).toBeGreaterThan(0)
  })

  it('validates email format', async () => {
    const emailInput = wrapper.find('input[placeholder="请输入邮箱"]')
    
    // 输入无效邮箱
    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    
    const errorMessage = wrapper.find('.el-form-item__error')
    expect(errorMessage.text()).toContain('邮箱格式')
  })

  it('validates username format', async () => {
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    
    // 输入包含特殊字符的用户名
    await usernameInput.setValue('user@name')
    await usernameInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    
    const errorMessage = wrapper.find('.el-form-item__error')
    expect(errorMessage.text()).toContain('只能包含字母、数字和下划线')
  })

  it('emits submit event with valid data', async () => {
    // 填写有效数据
    await wrapper.find('input[placeholder="请输入用户名"]').setValue('testuser')
    await wrapper.find('input[placeholder="请输入姓名"]').setValue('测试用户')
    await wrapper.find('input[placeholder="请输入邮箱"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="请输入密码"]').setValue('password123')
    
    // 提交表单
    await wrapper.vm.submitForm()
    
    // 检查是否触发了 submit 事件
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toMatchObject({
      username: 'testuser',
      name: '测试用户',
      email: 'test@example.com'
    })
  })

  it('disables username field in update mode', async () => {
    await wrapper.setProps({
      ...defaultProps,
      dialogStatus: 'update'
    })
    
    const usernameInput = wrapper.find('input[placeholder="请输入用户名"]')
    expect(usernameInput.attributes('disabled')).toBeDefined()
  })

  it('makes password optional in update mode', async () => {
    await wrapper.setProps({
      ...defaultProps,
      dialogStatus: 'update',
      userData: {
        ...defaultProps.userData,
        username: 'existinguser',
        name: '现有用户',
        email: 'existing@example.com'
      }
    })
    
    // 不填写密码直接提交
    await wrapper.vm.submitForm()
    
    // 应该能够通过验证
    expect(wrapper.emitted('submit')).toBeTruthy()
  })
})
```

### 2.3 API 测试

```typescript
// tests/api/user.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import type { User, UserQuery } from '@/types/user'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('User API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getUserList', () => {
    it('should fetch user list with correct parameters', async () => {
      const mockResponse = {
        code: 200,
        data: {
          items: [
            {
              id: 1,
              username: 'testuser',
              name: '测试用户',
              email: 'test@example.com'
            }
          ],
          total: 1
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const query: UserQuery = {
        page: 1,
        limit: 20,
        keyword: 'test'
      }

      const result = await getUserList(query)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users'),
        expect.objectContaining({
          method: 'GET'
        })
      )
      expect(result.data.items).toHaveLength(1)
      expect(result.data.items[0].username).toBe('testuser')
    })

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(getUserList({ page: 1, limit: 20 })).rejects.toThrow()
    })
  })

  describe('createUser', () => {
    it('should create user with correct data', async () => {
      const mockResponse = {
        code: 200,
        data: {
          id: 1,
          username: 'newuser',
          name: '新用户'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const userData: Partial<User> = {
        username: 'newuser',
        name: '新用户',
        email: 'new@example.com',
        password: 'password123'
      }

      const result = await createUser(userData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(userData)
        })
      )
      expect(result.data.username).toBe('newuser')
    })
  })

  describe('updateUser', () => {
    it('should update user with correct data', async () => {
      const mockResponse = {
        code: 200,
        data: {
          id: 1,
          username: 'updateduser',
          name: '更新用户'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const userData: Partial<User> = {
        name: '更新用户',
        email: 'updated@example.com'
      }

      const result = await updateUser(1, userData)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(userData)
        })
      )
      expect(result.data.name).toBe('更新用户')
    })
  })

  describe('deleteUser', () => {
    it('should delete user with correct id', async () => {
      const mockResponse = {
        code: 200,
        message: '删除成功'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      await deleteUser(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/1'),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })
})
```

### 2.4 E2E 测试配置

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

```typescript
// tests/e2e/user-management.spec.ts

import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[placeholder="请输入用户名"]', 'admin')
    await page.fill('[placeholder="请输入密码"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // 等待跳转到首页
    await page.waitForURL('/dashboard')
    
    // 导航到用户管理页面
    await page.click('text=用户管理')
    await page.click('text=用户列表')
    await page.waitForURL('/user/list')
  })

  test('should display user list', async ({ page }) => {
    // 检查页面标题
    await expect(page.locator('h1')).toContainText('用户列表')
    
    // 检查表格是否存在
    await expect(page.locator('.el-table')).toBeVisible()
    
    // 检查表格列
    await expect(page.locator('th').filter({ hasText: '用户名' })).toBeVisible()
    await expect(page.locator('th').filter({ hasText: '姓名' })).toBeVisible()
    await expect(page.locator('th').filter({ hasText: '邮箱' })).toBeVisible()
  })

  test('should create new user', async ({ page }) => {
    // 点击添加用户按钮
    await page.click('text=添加用户')
    
    // 等待对话框出现
    await expect(page.locator('.el-dialog')).toBeVisible()
    await expect(page.locator('.el-dialog__title')).toContainText('创建用户')
    
    // 填写表单
    await page.fill('[placeholder="请输入用户名"]', 'testuser')
    await page.fill('[placeholder="请输入姓名"]', '测试用户')
    await page.fill('[placeholder="请输入邮箱"]', 'test@example.com')
    await page.fill('[placeholder="请输入密码"]', 'password123')
    
    // 选择角色
    await page.click('.el-select')
    await page.click('text=普通用户')
    
    // 提交表单
    await page.click('text=确定')
    
    // 等待成功消息
    await expect(page.locator('.el-message--success')).toBeVisible()
    
    // 检查用户是否出现在列表中
    await expect(page.locator('text=testuser')).toBeVisible()
  })

  test('should search users', async ({ page }) => {
    // 在搜索框中输入关键词
    await page.fill('[placeholder="请输入用户名或邮箱"]', 'admin')
    
    // 点击搜索按钮
    await page.click('text=搜索')
    
    // 等待表格更新
    await page.waitForTimeout(1000)
    
    // 检查搜索结果
    const rows = page.locator('.el-table__body tr')
    await expect(rows).toHaveCount(1)
    await expect(rows.first()).toContainText('admin')
  })

  test('should edit user', async ({ page }) => {
    // 点击第一行的编辑按钮
    await page.click('.el-table__body tr:first-child .el-button:has-text("编辑")')
    
    // 等待对话框出现
    await expect(page.locator('.el-dialog')).toBeVisible()
    await expect(page.locator('.el-dialog__title')).toContainText('编辑用户')
    
    // 修改姓名
    await page.fill('[placeholder="请输入姓名"]', '修改后的姓名')
    
    // 提交表单
    await page.click('text=确定')
    
    // 等待成功消息
    await expect(page.locator('.el-message--success')).toBeVisible()
    
    // 检查修改是否生效
    await expect(page.locator('text=修改后的姓名')).toBeVisible()
  })

  test('should delete user', async ({ page }) => {
    // 点击第一行的删除按钮
    await page.click('.el-table__body tr:first-child .el-button:has-text("删除")')
    
    // 等待确认对话框
    await expect(page.locator('.el-message-box')).toBeVisible()
    
    // 点击确定
    await page.click('.el-message-box .el-button--primary')
    
    // 等待成功消息
    await expect(page.locator('.el-message--success')).toBeVisible()
  })

  test('should handle validation errors', async ({ page }) => {
    // 点击添加用户按钮
    await page.click('text=添加用户')
    
    // 直接提交空表单
    await page.click('text=确定')
    
    // 检查验证错误消息
    await expect(page.locator('.el-form-item__error')).toHaveCount(4) // 用户名、姓名、邮箱、密码
    
    // 输入无效邮箱
    await page.fill('[placeholder="请输入邮箱"]', 'invalid-email')
    await page.click('[placeholder="请输入姓名"]') // 触发 blur 事件
    
    // 检查邮箱格式错误
    await expect(page.locator('.el-form-item__error:has-text("邮箱格式")')).toBeVisible()
  })
})
```

## 3. 实践练习

### 练习 1：完善错误处理

1. 实现错误边界组件
2. 添加网络错误重试机制
3. 完善用户友好的错误提示
4. 实现错误上报功能

### 练习 2：扩展测试覆盖

1. 为所有组件编写单元测试
2. 添加集成测试用例
3. 完善 E2E 测试场景
4. 实现测试数据管理

### 练习 3：优化日志系统

1. 添加日志分级和过滤
2. 实现日志可视化界面
3. 添加性能监控日志
4. 实现日志分析功能

## 学习资源

* [Vitest 官方文档](https://vitest.dev/)
* [Vue Test Utils](https://test-utils.vuejs.org/)
* [Playwright 官方文档](https://playwright.dev/)
* [测试最佳实践](https://testing-library.com/docs/guiding-principles/)

## 作业

1. 完成错误处理和日志系统
2. 编写完整的测试用例
3. 实现自动化测试流程
4. 优化测试覆盖率到 80% 以上

## 总结

今天我们完成了综合项目实战的最后部分：

1. **错误处理系统**：建立了完善的错误捕获、处理和上报机制
2. **日志系统**：实现了分级日志记录和远程上报功能
3. **测试体系**：构建了单元测试、集成测试和 E2E 测试
4. **质量保证**：通过测试覆盖率和代码质量检查确保项目质量

## 下一步学习计划

明天我们将学习：
- 项目部署和发布流程
- CI/CD 自动化配置
- 性能监控和优化
- 项目维护和迭代策略