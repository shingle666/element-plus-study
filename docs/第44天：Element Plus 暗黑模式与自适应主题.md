# 第44天：Element Plus 暗黑模式与自适应主题

## 学习目标

- 深入理解 Element Plus 暗黑模式实现原理
- 掌握自适应主题系统的设计和开发
- 学会系统主题检测和响应机制
- 实现主题切换动画和过渡效果
- 构建主题持久化存储系统
- 优化主题性能和用户体验

## 1. Element Plus 暗黑模式实现原理

### 1.1 暗黑模式架构设计
```typescript
// 暗黑模式系统架构
interface DarkModeSystem {
  // 主题管理器
  themeManager: ThemeManager
  // 系统检测器
  systemDetector: SystemThemeDetector
  // 主题切换器
  themeSwitcher: ThemeSwitcher
  // 存储管理器
  storageManager: ThemeStorageManager
  // 动画控制器
  animationController: ThemeAnimationController
  // 性能优化器
  performanceOptimizer: ThemePerformanceOptimizer
}

// 主题类型定义
type ThemeMode = 'light' | 'dark' | 'auto'
type ThemePreference = 'system' | 'light' | 'dark'

// 主题配置接口
interface ThemeConfig {
  mode: ThemeMode
  preference: ThemePreference
  colors: ThemeColors
  variables: ThemeVariables
  transitions: ThemeTransitions
  customizations: ThemeCustomizations
}

// 主题颜色定义
interface ThemeColors {
  // 基础颜色
  primary: string
  success: string
  warning: string
  danger: string
  info: string
  
  // 背景颜色
  bgColor: string
  bgColorPage: string
  bgColorOverlay: string
  
  // 文本颜色
  textColorPrimary: string
  textColorRegular: string
  textColorSecondary: string
  textColorPlaceholder: string
  textColorDisabled: string
  
  // 边框颜色
  borderColor: string
  borderColorLight: string
  borderColorLighter: string
  borderColorExtraLight: string
  borderColorDark: string
  borderColorDarker: string
  
  // 填充颜色
  fillColor: string
  fillColorLight: string
  fillColorLighter: string
  fillColorExtraLight: string
  fillColorDark: string
  fillColorDarker: string
  fillColorBlank: string
}

// 主题变量定义
interface ThemeVariables {
  // 尺寸变量
  componentSize: string
  componentSizeLarge: string
  componentSizeSmall: string
  
  // 圆角变量
  borderRadiusBase: string
  borderRadiusSmall: string
  borderRadiusRound: string
  borderRadiusCircle: string
  
  // 阴影变量
  boxShadowBase: string
  boxShadowLight: string
  boxShadowLighter: string
  boxShadowDark: string
  
  // 字体变量
  fontSizeExtraLarge: string
  fontSizeLarge: string
  fontSizeMedium: string
  fontSizeBase: string
  fontSizeSmall: string
  fontSizeExtraSmall: string
  
  // 层级变量
  zIndexNormal: number
  zIndexTop: number
  zIndexPopper: number
}

// 主题管理器
class ThemeManager {
  private currentTheme: ThemeConfig
  private themes: Map<string, ThemeConfig> = new Map()
  private observers: Set<ThemeObserver> = new Set()
  private systemDetector: SystemThemeDetector
  private storageManager: ThemeStorageManager
  private animationController: ThemeAnimationController

  constructor() {
    this.systemDetector = new SystemThemeDetector()
    this.storageManager = new ThemeStorageManager()
    this.animationController = new ThemeAnimationController()
    
    this.initializeThemes()
    this.loadSavedTheme()
    this.setupSystemListener()
  }

  // 初始化主题
  private initializeThemes(): void {
    // 注册亮色主题
    this.registerTheme('light', {
      mode: 'light',
      preference: 'light',
      colors: this.getLightThemeColors(),
      variables: this.getDefaultVariables(),
      transitions: this.getDefaultTransitions(),
      customizations: {}
    })

    // 注册暗色主题
    this.registerTheme('dark', {
      mode: 'dark',
      preference: 'dark',
      colors: this.getDarkThemeColors(),
      variables: this.getDefaultVariables(),
      transitions: this.getDefaultTransitions(),
      customizations: {}
    })

    // 注册自动主题
    this.registerTheme('auto', {
      mode: 'auto',
      preference: 'system',
      colors: this.getAutoThemeColors(),
      variables: this.getDefaultVariables(),
      transitions: this.getDefaultTransitions(),
      customizations: {}
    })
  }

  // 注册主题
  registerTheme(name: string, config: ThemeConfig): void {
    this.themes.set(name, config)
  }

  // 获取主题
  getTheme(name: string): ThemeConfig | undefined {
    return this.themes.get(name)
  }

  // 设置当前主题
  async setTheme(name: string, options?: ThemeSetOptions): Promise<void> {
    const theme = this.themes.get(name)
    if (!theme) {
      throw new Error(`Theme '${name}' not found`)
    }

    const oldTheme = this.currentTheme
    const newTheme = { ...theme }

    // 处理自动主题
    if (newTheme.mode === 'auto') {
      const systemTheme = this.systemDetector.getSystemTheme()
      newTheme.mode = systemTheme
      newTheme.colors = systemTheme === 'dark' 
        ? this.getDarkThemeColors() 
        : this.getLightThemeColors()
    }

    // 应用主题切换动画
    if (options?.animated !== false && oldTheme) {
      await this.animationController.animateThemeChange(oldTheme, newTheme)
    }

    this.currentTheme = newTheme
    this.applyTheme(newTheme)
    this.saveTheme(name)
    this.notifyObservers('themeChanged', { oldTheme, newTheme, name })
  }

  // 获取当前主题
  getCurrentTheme(): ThemeConfig {
    return this.currentTheme
  }

  // 切换主题模式
  async toggleTheme(options?: ThemeSetOptions): Promise<void> {
    const currentMode = this.currentTheme.mode
    const nextMode = currentMode === 'light' ? 'dark' : 'light'
    await this.setTheme(nextMode, options)
  }

  // 应用主题
  private applyTheme(theme: ThemeConfig): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // 设置主题模式类
    root.classList.remove('light', 'dark')
    root.classList.add(theme.mode)
    
    // 应用CSS变量
    this.applyCSSVariables(theme)
    
    // 应用自定义样式
    this.applyCustomStyles(theme)
  }

  // 应用CSS变量
  private applyCSSVariables(theme: ThemeConfig): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // 应用颜色变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = this.convertToCSSVariable(key)
      root.style.setProperty(cssVar, value)
    })
    
    // 应用其他变量
    Object.entries(theme.variables).forEach(([key, value]) => {
      const cssVar = this.convertToCSSVariable(key)
      root.style.setProperty(cssVar, String(value))
    })
  }

  // 转换为CSS变量名
  private convertToCSSVariable(key: string): string {
    return `--el-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
  }

  // 应用自定义样式
  private applyCustomStyles(theme: ThemeConfig): void {
    if (typeof document === 'undefined') return

    // 移除旧的自定义样式
    const oldStyle = document.getElementById('el-theme-custom-styles')
    if (oldStyle) {
      oldStyle.remove()
    }

    // 应用新的自定义样式
    if (theme.customizations && Object.keys(theme.customizations).length > 0) {
      const style = document.createElement('style')
      style.id = 'el-theme-custom-styles'
      style.textContent = this.generateCustomCSS(theme.customizations)
      document.head.appendChild(style)
    }
  }

  // 生成自定义CSS
  private generateCustomCSS(customizations: ThemeCustomizations): string {
    let css = ''
    
    Object.entries(customizations).forEach(([selector, properties]) => {
      css += `${selector} {\n`
      Object.entries(properties).forEach(([prop, value]) => {
        css += `  ${prop}: ${value};\n`
      })
      css += `}\n\n`
    })
    
    return css
  }

  // 加载保存的主题
  private loadSavedTheme(): void {
    const savedTheme = this.storageManager.getTheme()
    if (savedTheme && this.themes.has(savedTheme)) {
      this.setTheme(savedTheme, { animated: false })
    } else {
      // 使用系统主题作为默认
      const systemTheme = this.systemDetector.getSystemTheme()
      this.setTheme(systemTheme, { animated: false })
    }
  }

  // 保存主题
  private saveTheme(name: string): void {
    this.storageManager.setTheme(name)
  }

  // 设置系统监听器
  private setupSystemListener(): void {
    this.systemDetector.onSystemThemeChange((systemTheme) => {
      if (this.currentTheme.preference === 'system') {
        this.setTheme('auto')
      }
    })
  }

  // 获取亮色主题颜色
  private getLightThemeColors(): ThemeColors {
    return {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
      
      bgColor: '#ffffff',
      bgColorPage: '#f2f3f5',
      bgColorOverlay: '#ffffff',
      
      textColorPrimary: '#303133',
      textColorRegular: '#606266',
      textColorSecondary: '#909399',
      textColorPlaceholder: '#a8abb2',
      textColorDisabled: '#c0c4cc',
      
      borderColor: '#dcdfe6',
      borderColorLight: '#e4e7ed',
      borderColorLighter: '#ebeef5',
      borderColorExtraLight: '#f2f6fc',
      borderColorDark: '#d4d7de',
      borderColorDarker: '#cdd0d6',
      
      fillColor: '#f0f2f5',
      fillColorLight: '#f5f7fa',
      fillColorLighter: '#fafafa',
      fillColorExtraLight: '#fafcff',
      fillColorDark: '#ebedf0',
      fillColorDarker: '#e6e8eb',
      fillColorBlank: '#ffffff'
    }
  }

  // 获取暗色主题颜色
  private getDarkThemeColors(): ThemeColors {
    return {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',
      
      bgColor: '#141414',
      bgColorPage: '#0a0a0a',
      bgColorOverlay: '#1d1e1f',
      
      textColorPrimary: '#e5eaf3',
      textColorRegular: '#cfd3dc',
      textColorSecondary: '#a3a6ad',
      textColorPlaceholder: '#8d9095',
      textColorDisabled: '#6c6e72',
      
      borderColor: '#4c4d4f',
      borderColorLight: '#414243',
      borderColorLighter: '#363637',
      borderColorExtraLight: '#2b2b2c',
      borderColorDark: '#58585b',
      borderColorDarker: '#636466',
      
      fillColor: '#262727',
      fillColorLight: '#1d1d1d',
      fillColorLighter: '#191919',
      fillColorExtraLight: '#141414',
      fillColorDark: '#39393a',
      fillColorDarker: '#424243',
      fillColorBlank: '#141414'
    }
  }

  // 获取自动主题颜色
  private getAutoThemeColors(): ThemeColors {
    const systemTheme = this.systemDetector.getSystemTheme()
    return systemTheme === 'dark' 
      ? this.getDarkThemeColors() 
      : this.getLightThemeColors()
  }

  // 获取默认变量
  private getDefaultVariables(): ThemeVariables {
    return {
      componentSize: '32px',
      componentSizeLarge: '40px',
      componentSizeSmall: '24px',
      
      borderRadiusBase: '4px',
      borderRadiusSmall: '2px',
      borderRadiusRound: '20px',
      borderRadiusCircle: '100%',
      
      boxShadowBase: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
      boxShadowLight: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
      boxShadowLighter: '0 2px 4px 0 rgba(0, 0, 0, 0.12)',
      boxShadowDark: '0 2px 4px 0 rgba(0, 0, 0, 0.12)',
      
      fontSizeExtraLarge: '20px',
      fontSizeLarge: '18px',
      fontSizeMedium: '16px',
      fontSizeBase: '14px',
      fontSizeSmall: '13px',
      fontSizeExtraSmall: '12px',
      
      zIndexNormal: 1,
      zIndexTop: 1000,
      zIndexPopper: 2000
    }
  }

  // 获取默认过渡
  private getDefaultTransitions(): ThemeTransitions {
    return {
      all: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
      fade: 'opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      mdFade: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      border: 'border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
      color: 'color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)'
    }
  }

  // 添加观察者
  addObserver(observer: ThemeObserver): void {
    this.observers.add(observer)
  }

  // 移除观察者
  removeObserver(observer: ThemeObserver): void {
    this.observers.delete(observer)
  }

  // 通知观察者
  private notifyObservers(event: string, data: any): void {
    this.observers.forEach(observer => {
      observer.onThemeEvent?.(event, data)
    })
  }

  // 创建主题变体
  createThemeVariant(baseName: string, variantName: string, modifications: Partial<ThemeConfig>): void {
    const baseTheme = this.themes.get(baseName)
    if (!baseTheme) {
      throw new Error(`Base theme '${baseName}' not found`)
    }

    const variantTheme: ThemeConfig = {
      ...baseTheme,
      ...modifications,
      colors: {
        ...baseTheme.colors,
        ...modifications.colors
      },
      variables: {
        ...baseTheme.variables,
        ...modifications.variables
      }
    }

    this.registerTheme(variantName, variantTheme)
  }

  // 导出主题
  exportTheme(name: string): string {
    const theme = this.themes.get(name)
    if (!theme) {
      throw new Error(`Theme '${name}' not found`)
    }
    return JSON.stringify(theme, null, 2)
  }

  // 导入主题
  importTheme(name: string, themeJson: string): void {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig
      this.registerTheme(name, theme)
    } catch (error) {
      throw new Error('Invalid theme JSON')
    }
  }
}

// 主题设置选项
interface ThemeSetOptions {
  animated?: boolean
  duration?: number
  easing?: string
}

// 主题过渡定义
interface ThemeTransitions {
  all: string
  fade: string
  mdFade: string
  border: string
  color: string
}

// 主题自定义样式
interface ThemeCustomizations {
  [selector: string]: {
    [property: string]: string
  }
}

// 主题观察者
interface ThemeObserver {
  onThemeEvent?(event: string, data: any): void
}
```

### 1.2 系统主题检测器
```typescript
// 系统主题检测器
class SystemThemeDetector {
  private mediaQuery: MediaQueryList | null = null
  private listeners: Set<(theme: ThemeMode) => void> = new Set()
  private currentSystemTheme: ThemeMode = 'light'

  constructor() {
    this.initializeDetection()
  }

  // 初始化检测
  private initializeDetection(): void {
    if (typeof window === 'undefined') return

    // 检测系统是否支持暗色模式
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      this.currentSystemTheme = this.mediaQuery.matches ? 'dark' : 'light'
      
      // 监听系统主题变化
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this))
    }
  }

  // 获取系统主题
  getSystemTheme(): ThemeMode {
    return this.currentSystemTheme
  }

  // 检查是否支持系统主题检测
  isSupported(): boolean {
    return this.mediaQuery !== null
  }

  // 处理系统主题变化
  private handleSystemThemeChange(event: MediaQueryListEvent): void {
    const newTheme: ThemeMode = event.matches ? 'dark' : 'light'
    
    if (newTheme !== this.currentSystemTheme) {
      this.currentSystemTheme = newTheme
      this.notifyListeners(newTheme)
    }
  }

  // 监听系统主题变化
  onSystemThemeChange(callback: (theme: ThemeMode) => void): () => void {
    this.listeners.add(callback)
    
    // 返回取消监听的函数
    return () => {
      this.listeners.delete(callback)
    }
  }

  // 通知监听器
  private notifyListeners(theme: ThemeMode): void {
    this.listeners.forEach(listener => {
      try {
        listener(theme)
      } catch (error) {
        console.error('Error in system theme change listener:', error)
      }
    })
  }

  // 获取系统主题偏好信息
  getSystemThemeInfo(): SystemThemeInfo {
    const info: SystemThemeInfo = {
      supported: this.isSupported(),
      currentTheme: this.currentSystemTheme,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      platform: typeof navigator !== 'undefined' ? navigator.platform : ''
    }

    if (this.mediaQuery) {
      info.mediaQuery = this.mediaQuery.media
      info.matches = this.mediaQuery.matches
    }

    return info
  }

  // 模拟系统主题变化（用于测试）
  simulateSystemThemeChange(theme: ThemeMode): void {
    if (process.env.NODE_ENV === 'development') {
      this.currentSystemTheme = theme
      this.notifyListeners(theme)
    }
  }

  // 销毁检测器
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this))
    }
    this.listeners.clear()
  }
}

// 系统主题信息
interface SystemThemeInfo {
  supported: boolean
  currentTheme: ThemeMode
  userAgent: string
  platform: string
  mediaQuery?: string
  matches?: boolean
}
```

### 1.3 主题存储管理器
```typescript
// 主题存储管理器
class ThemeStorageManager {
  private storageKey = 'el-theme-preference'
  private storage: Storage | null = null
  private fallbackStorage: Map<string, string> = new Map()

  constructor() {
    this.initializeStorage()
  }

  // 初始化存储
  private initializeStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        // 测试localStorage是否可用
        const testKey = '__el_theme_test__'
        window.localStorage.setItem(testKey, 'test')
        window.localStorage.removeItem(testKey)
        this.storage = window.localStorage
      } catch (error) {
        console.warn('localStorage not available, using fallback storage')
      }
    }
  }

  // 设置主题
  setTheme(theme: string): void {
    const data = {
      theme,
      timestamp: Date.now(),
      version: '1.0.0'
    }

    try {
      if (this.storage) {
        this.storage.setItem(this.storageKey, JSON.stringify(data))
      } else {
        this.fallbackStorage.set(this.storageKey, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error)
    }
  }

  // 获取主题
  getTheme(): string | null {
    try {
      let dataStr: string | null = null
      
      if (this.storage) {
        dataStr = this.storage.getItem(this.storageKey)
      } else {
        dataStr = this.fallbackStorage.get(this.storageKey) || null
      }

      if (dataStr) {
        const data = JSON.parse(dataStr)
        
        // 检查数据版本和有效性
        if (this.isValidThemeData(data)) {
          return data.theme
        }
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error)
    }

    return null
  }

  // 验证主题数据
  private isValidThemeData(data: any): boolean {
    return (
      data &&
      typeof data.theme === 'string' &&
      typeof data.timestamp === 'number' &&
      typeof data.version === 'string'
    )
  }

  // 清除主题
  clearTheme(): void {
    try {
      if (this.storage) {
        this.storage.removeItem(this.storageKey)
      } else {
        this.fallbackStorage.delete(this.storageKey)
      }
    } catch (error) {
      console.error('Failed to clear theme preference:', error)
    }
  }

  // 获取存储信息
  getStorageInfo(): StorageInfo {
    return {
      type: this.storage ? 'localStorage' : 'memory',
      available: this.storage !== null,
      key: this.storageKey,
      hasData: this.getTheme() !== null
    }
  }

  // 迁移旧版本数据
  migrateOldData(): void {
    const oldKeys = ['theme', 'dark-mode', 'color-scheme']
    
    for (const oldKey of oldKeys) {
      try {
        if (this.storage) {
          const oldValue = this.storage.getItem(oldKey)
          if (oldValue && !this.getTheme()) {
            // 尝试解析旧格式
            let theme = oldValue
            if (oldValue === 'true' || oldValue === 'dark') {
              theme = 'dark'
            } else if (oldValue === 'false' || oldValue === 'light') {
              theme = 'light'
            }
            
            this.setTheme(theme)
            this.storage.removeItem(oldKey)
            break
          }
        }
      } catch (error) {
        console.error(`Failed to migrate old theme data from ${oldKey}:`, error)
      }
    }
  }

  // 导出配置
  exportConfig(): string {
    const theme = this.getTheme()
    const config = {
      theme,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }
    return JSON.stringify(config, null, 2)
  }

  // 导入配置
  importConfig(configJson: string): boolean {
    try {
      const config = JSON.parse(configJson)
      if (config.theme && typeof config.theme === 'string') {
        this.setTheme(config.theme)
        return true
      }
    } catch (error) {
      console.error('Failed to import theme config:', error)
    }
    return false
  }
}

// 存储信息接口
interface StorageInfo {
  type: 'localStorage' | 'memory'
  available: boolean
  key: string
  hasData: boolean
}
```

## 2. 主题切换动画控制器

### 2.1 动画控制器实现
```typescript
// 主题动画控制器
class ThemeAnimationController {
  private isAnimating = false
  private animationQueue: ThemeAnimation[] = []
  private defaultDuration = 300
  private defaultEasing = 'cubic-bezier(0.4, 0, 0.2, 1)'

  // 执行主题切换动画
  async animateThemeChange(
    oldTheme: ThemeConfig,
    newTheme: ThemeConfig,
    options?: ThemeAnimationOptions
  ): Promise<void> {
    if (this.isAnimating) {
      // 如果正在动画中，加入队列
      return new Promise((resolve) => {
        this.animationQueue.push({
          oldTheme,
          newTheme,
          options,
          resolve
        })
      })
    }

    this.isAnimating = true

    try {
      await this.performAnimation(oldTheme, newTheme, options)
    } finally {
      this.isAnimating = false
      this.processQueue()
    }
  }

  // 执行动画
  private async performAnimation(
    oldTheme: ThemeConfig,
    newTheme: ThemeConfig,
    options?: ThemeAnimationOptions
  ): Promise<void> {
    const animationType = options?.type || 'fade'
    const duration = options?.duration || this.defaultDuration
    const easing = options?.easing || this.defaultEasing

    switch (animationType) {
      case 'fade':
        await this.fadeAnimation(duration, easing)
        break
      case 'slide':
        await this.slideAnimation(options?.direction || 'left', duration, easing)
        break
      case 'zoom':
        await this.zoomAnimation(duration, easing)
        break
      case 'ripple':
        await this.rippleAnimation(options?.origin, duration, easing)
        break
      case 'morph':
        await this.morphAnimation(oldTheme, newTheme, duration, easing)
        break
      default:
        await this.fadeAnimation(duration, easing)
    }
  }

  // 淡入淡出动画
  private async fadeAnimation(duration: number, easing: string): Promise<void> {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // 创建过渡样式
    const originalTransition = root.style.transition
    root.style.transition = `opacity ${duration}ms ${easing}`
    
    // 执行动画
    root.style.opacity = '0.8'
    
    await new Promise(resolve => {
      setTimeout(() => {
        root.style.opacity = ''
        root.style.transition = originalTransition
        resolve(void 0)
      }, duration)
    })
  }

  // 滑动动画
  private async slideAnimation(
    direction: 'left' | 'right' | 'up' | 'down',
    duration: number,
    easing: string
  ): Promise<void> {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const overlay = this.createAnimationOverlay()
    
    // 设置初始位置
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    }
    
    overlay.style.transform = transforms[direction]
    overlay.style.transition = `transform ${duration}ms ${easing}`
    
    // 执行动画
    requestAnimationFrame(() => {
      overlay.style.transform = 'translate(0, 0)'
    })
    
    await new Promise(resolve => {
      setTimeout(() => {
        overlay.remove()
        resolve(void 0)
      }, duration)
    })
  }

  // 缩放动画
  private async zoomAnimation(duration: number, easing: string): Promise<void> {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const originalTransition = root.style.transition
    
    root.style.transition = `transform ${duration}ms ${easing}`
    root.style.transform = 'scale(0.95)'
    
    await new Promise(resolve => {
      setTimeout(() => {
        root.style.transform = ''
        root.style.transition = originalTransition
        resolve(void 0)
      }, duration)
    })
  }

  // 波纹动画
  private async rippleAnimation(
    origin?: { x: number; y: number },
    duration: number,
    easing: string
  ): Promise<void> {
    if (typeof document === 'undefined') return

    const ripple = this.createRippleElement(origin)
    document.body.appendChild(ripple)
    
    // 执行波纹动画
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(100)'
      ripple.style.opacity = '0'
    })
    
    await new Promise(resolve => {
      setTimeout(() => {
        ripple.remove()
        resolve(void 0)
      }, duration)
    })
  }

  // 变形动画
  private async morphAnimation(
    oldTheme: ThemeConfig,
    newTheme: ThemeConfig,
    duration: number,
    easing: string
  ): Promise<void> {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const steps = 20
    const stepDuration = duration / steps
    
    // 计算颜色插值
    const colorInterpolations = this.calculateColorInterpolations(
      oldTheme.colors,
      newTheme.colors,
      steps
    )
    
    // 执行分步动画
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const interpolatedColors = colorInterpolations[i]
      
      // 应用插值颜色
      Object.entries(interpolatedColors).forEach(([key, value]) => {
        const cssVar = `--el-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
        root.style.setProperty(cssVar, value)
      })
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }
    }
  }

  // 创建动画遮罩
  private createAnimationOverlay(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--el-bg-color);
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(overlay)
    return overlay
  }

  // 创建波纹元素
  private createRippleElement(origin?: { x: number; y: number }): HTMLElement {
    const ripple = document.createElement('div')
    const size = Math.max(window.innerWidth, window.innerHeight) * 2
    
    const x = origin?.x || window.innerWidth / 2
    const y = origin?.y || window.innerHeight / 2
    
    ripple.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: var(--el-bg-color);
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      transform: scale(0);
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms;
      z-index: 9999;
      pointer-events: none;
    `
    
    return ripple
  }

  // 计算颜色插值
  private calculateColorInterpolations(
    oldColors: ThemeColors,
    newColors: ThemeColors,
    steps: number
  ): ThemeColors[] {
    const interpolations: ThemeColors[] = []
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const interpolated: Partial<ThemeColors> = {}
      
      Object.keys(oldColors).forEach(key => {
        const oldColor = oldColors[key as keyof ThemeColors]
        const newColor = newColors[key as keyof ThemeColors]
        
        if (oldColor && newColor) {
          interpolated[key as keyof ThemeColors] = this.interpolateColor(
            oldColor,
            newColor,
            progress
          )
        }
      })
      
      interpolations.push(interpolated as ThemeColors)
    }
    
    return interpolations
  }

  // 颜色插值
  private interpolateColor(color1: string, color2: string, progress: number): string {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)
    
    if (!rgb1 || !rgb2) return color2
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress)
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress)
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  // 十六进制转RGB
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // 处理动画队列
  private async processQueue(): Promise<void> {
    if (this.animationQueue.length > 0) {
      const next = this.animationQueue.shift()!
      await this.animateThemeChange(next.oldTheme, next.newTheme, next.options)
      next.resolve()
    }
  }

  // 取消所有动画
  cancelAllAnimations(): void {
    this.isAnimating = false
    this.animationQueue.forEach(animation => {
      animation.resolve()
    })
    this.animationQueue = []
  }

  // 设置默认动画参数
  setDefaults(duration: number, easing: string): void {
    this.defaultDuration = duration
    this.defaultEasing = easing
  }
}

// 主题动画选项
interface ThemeAnimationOptions {
  type?: 'fade' | 'slide' | 'zoom' | 'ripple' | 'morph'
  duration?: number
  easing?: string
  direction?: 'left' | 'right' | 'up' | 'down'
  origin?: { x: number; y: number }
}

// 主题动画接口
interface ThemeAnimation {
  oldTheme: ThemeConfig
  newTheme: ThemeConfig
  options?: ThemeAnimationOptions
  resolve: () => void
}
```

## 3. 自适应主题组件实现

### 3.1 主题切换器组件
```vue
<!-- ThemeSwitcher.vue - 主题切换器组件 -->
<template>
  <div class="theme-switcher" :class="switcherClasses">
    <!-- 简单切换按钮 -->
    <el-button
      v-if="mode === 'button'"
      :icon="currentIcon"
      :size="size"
      :type="type"
      :circle="circle"
      :loading="isLoading"
      @click="toggleTheme"
    >
      <span v-if="!circle && showText">{{ currentText }}</span>
    </el-button>
    
    <!-- 下拉选择器 -->
    <el-select
      v-else-if="mode === 'select'"
      v-model="currentTheme"
      :size="size"
      :placeholder="placeholder"
      :loading="isLoading"
      @change="handleThemeChange"
    >
      <el-option
        v-for="option in themeOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
        <div class="theme-option">
          <el-icon :class="option.icon" />
          <span>{{ option.label }}</span>
          <div 
            v-if="option.preview"
            class="theme-preview"
            :style="{ backgroundColor: option.preview }"
          />
        </div>
      </el-option>
    </el-select>
    
    <!-- 分段控制器 -->
    <el-segmented
      v-else-if="mode === 'segmented'"
      v-model="currentTheme"
      :options="segmentedOptions"
      :size="size"
      :disabled="isLoading"
      @change="handleThemeChange"
    />
    
    <!-- 开关切换器 -->
    <div v-else-if="mode === 'switch'" class="theme-switch">
      <el-icon class="theme-icon light"><Sunny /></el-icon>
      <el-switch
        v-model="isDark"
        :size="size"
        :loading="isLoading"
        :disabled="disabled"
        @change="handleSwitchChange"
      />
      <el-icon class="theme-icon dark"><Moon /></el-icon>
    </div>
    
    <!-- 自定义切换器 -->
    <div v-else-if="mode === 'custom'" class="theme-custom">
      <slot
        :current-theme="currentTheme"
        :is-loading="isLoading"
        :toggle-theme="toggleTheme"
        :set-theme="setTheme"
        :available-themes="availableThemes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, watch } from 'vue'
import { Sunny, Moon, Monitor, Palette } from '@element-plus/icons-vue'
import type { ThemeManager } from '../theme/ThemeManager'

// Props
interface Props {
  mode?: 'button' | 'select' | 'segmented' | 'switch' | 'custom'
  size?: 'large' | 'default' | 'small'
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  circle?: boolean
  showText?: boolean
  placeholder?: string
  disabled?: boolean
  animated?: boolean
  animationType?: 'fade' | 'slide' | 'zoom' | 'ripple' | 'morph'
  animationDuration?: number
  themes?: string[]
  labels?: Record<string, string>
  icons?: Record<string, any>
  previews?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'button',
  size: 'default',
  type: 'default',
  circle: false,
  showText: true,
  placeholder: '选择主题',
  disabled: false,
  animated: true,
  animationType: 'fade',
  animationDuration: 300,
  themes: () => ['light', 'dark', 'auto'],
  labels: () => ({
    light: '亮色模式',
    dark: '暗色模式',
    auto: '跟随系统'
  }),
  icons: () => ({
    light: Sunny,
    dark: Moon,
    auto: Monitor
  }),
  previews: () => ({
    light: '#ffffff',
    dark: '#141414',
    auto: 'linear-gradient(45deg, #ffffff 50%, #141414 50%)'
  })
})

// Emits
interface Emits {
  (e: 'change', theme: string): void
  (e: 'before-change', theme: string): void
  (e: 'after-change', theme: string): void
}

const emit = defineEmits<Emits>()

// 注入主题管理器
const themeManager = inject<ThemeManager>('themeManager')
if (!themeManager) {
  throw new Error('ThemeManager not provided')
}

// 响应式状态
const isApplying = ref(false)
const sampleText = ref('示例文本')
const sampleTableData = ref([
  { name: '张三', age: 25, city: '北京' },
  { name: '李四', age: 30, city: '上海' },
  { name: '王五', age: 28, city: '广州' }
])

// 计算属性
const previewClasses = computed(() => {
  return [
    `theme-preview--${props.size}`,
    {
      'theme-preview--interactive': props.interactive
    }
  ]
})

const currentTheme = computed(() => {
  return themeManager.getTheme(props.themeName)
})

const previewStyles = computed(() => {
  if (!currentTheme.value) return {}
  
  const styles: Record<string, string> = {}
  
  // 应用主题颜色变量
  Object.entries(currentTheme.value.colors).forEach(([key, value]) => {
    const cssVar = `--el-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    styles[cssVar] = value
  })
  
  // 应用主题变量
  Object.entries(currentTheme.value.variables).forEach(([key, value]) => {
    const cssVar = `--el-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    styles[cssVar] = String(value)
  })
  
  return styles
})

const mainColors = computed(() => {
  if (!currentTheme.value) return {}
  
  return {
    primary: currentTheme.value.colors.primary,
    success: currentTheme.value.colors.success,
    warning: currentTheme.value.colors.warning,
    danger: currentTheme.value.colors.danger,
    info: currentTheme.value.colors.info
  }
})

const colorLabels = {
  primary: '主要色',
  success: '成功色',
  warning: '警告色',
  danger: '危险色',
  info: '信息色'
}

// 方法
const applyTheme = async () => {
  if (isApplying.value) return
  
  isApplying.value = true
  
  try {
    await themeManager.setTheme(props.themeName)
    emit('apply', props.themeName)
    ElMessage.success('主题应用成功')
  } catch (error) {
    ElMessage.error('主题应用失败')
    console.error('Failed to apply theme:', error)
  } finally {
    isApplying.value = false
  }
}

const exportTheme = () => {
  if (!currentTheme.value) return
  
  try {
    const themeJson = themeManager.exportTheme(props.themeName)
    
    // 创建下载链接
    const blob = new Blob([themeJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.themeName}-theme.json`
    link.click()
    URL.revokeObjectURL(url)
    
    emit('export', props.themeName, currentTheme.value)
    ElMessage.success('主题导出成功')
  } catch (error) {
    ElMessage.error('主题导出失败')
    console.error('Failed to export theme:', error)
  }
}

const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    ElMessage.success(`颜色 ${color} 已复制到剪贴板`)
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.theme-preview {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  background: var(--el-bg-color);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);
}

.preview-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 500;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.preview-content {
  padding: 20px;
}

.color-preview,
.component-preview,
.text-preview {
  margin-bottom: 24px;
}

.color-preview h4,
.component-preview h4,
.text-preview h4 {
  margin: 0 0 16px 0;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 500;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
  transition: all 0.3s;
}

.color-item:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color);
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.color-value {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-family: monospace;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.component-section {
  padding: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  background: var(--el-fill-color-blank);
}

.component-section h5 {
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
  font-size: 13px;
  font-weight: 500;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-card {
  max-width: 100%;
}

.text-samples {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-samples p {
  margin: 0;
  font-size: 14px;
}

.text-primary {
  color: var(--el-text-color-primary);
}

.text-regular {
  color: var(--el-text-color-regular);
}

.text-secondary {
  color: var(--el-text-color-secondary);
}

.text-placeholder {
  color: var(--el-text-color-placeholder);
}

.text-disabled {
  color: var(--el-text-color-disabled);
}

/* 尺寸变体 */
.theme-preview--small {
  font-size: 12px;
}

.theme-preview--small .preview-header {
  padding: 12px 16px;
}

.theme-preview--small .preview-content {
  padding: 16px;
}

.theme-preview--large {
  font-size: 16px;
}

.theme-preview--large .preview-header {
  padding: 20px 24px;
}

.theme-preview--large .preview-content {
  padding: 24px;
}

/* 交互式变体 */
.theme-preview--interactive {
  cursor: pointer;
  transition: all 0.3s;
}

.theme-preview--interactive:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow-light);
}
</style>
```

## 4. 实践练习

### 练习1：自定义主题系统
```typescript
// 实现完整的自定义主题系统
// 1. 主题编辑器界面
// 2. 实时预览功能
// 3. 主题验证和优化
// 4. 主题分享和导入
```

### 练习2：智能主题切换
```typescript
// 开发智能主题切换功能
// 1. 基于时间的自动切换
// 2. 基于环境光的自适应
// 3. 用户习惯学习
// 4. 场景化主题推荐
```

### 练习3：主题动画优化
```typescript
// 优化主题切换动画
// 1. 性能优化策略
// 2. 自定义动画效果
// 3. 动画中断处理
// 4. 无障碍访问支持
```

### 练习4：主题管理工具
```vue
// 构建主题管理工具
// 1. 主题库管理
// 2. 版本控制系统
// 3. 团队协作功能
// 4. 主题市场平台
```

## 学习资源

### 官方文档
- [Element Plus 暗黑模式](https://element-plus.org/zh-CN/guide/dark-mode.html)
- [CSS 媒体查询](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries)
- [Web API - matchMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/matchMedia)

### 设计指南
- [Material Design Dark Theme](https://material.io/design/color/dark-theme.html)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Ant Design Dark Theme](https://ant.design/docs/spec/dark)

### 工具和库
- [color](https://github.com/Qix-/color)
- [chroma-js](https://gka.github.io/chroma.js/)
- [culori](https://culorijs.org/)

## 作业

1. **暗黑模式**：实现完整的暗黑模式支持系统
2. **自适应主题**：开发基于系统偏好的自适应主题
3. **主题动画**：创建流畅的主题切换动画效果
4. **主题工具**：构建主题编辑和管理工具
5. **性能优化**：优化主题系统的性能和用户体验

## 下一步学习

明天我们将学习「Element Plus 响应式设计与移动端适配」，包括：
- 响应式设计原理
- 移动端组件适配
- 触摸交互优化
- 性能优化策略
- 跨平台兼容性

## 总结

今天我们深入学习了 Element Plus 的暗黑模式与自适应主题系统：

1. **暗黑模式实现**：理解了主题管理器、系统检测器和存储管理器的设计
2. **主题切换动画**：掌握了多种动画效果和性能优化技术
3. **自适应主题**：学会了系统主题检测和响应机制
4. **组件实现**：实现了主题切换器和预览组件
5. **高级特性**：包括主题验证、导入导出、动画控制等

通过这些学习，你现在能够：
- 构建完整的暗黑模式支持系统
- 实现流畅的主题切换动画
- 开发自适应主题检测机制
- 创建用户友好的主题管理界面
- 优化主题系统的性能和可访问性状态
const currentTheme = ref('light')
const isLoading = ref(false)
const availableThemes = ref(props.themes)

// 计算属性
const switcherClasses = computed(() => {
  return [
    `theme-switcher--${props.mode}`,
    `theme-switcher--${props.size}`,
    {
      'theme-switcher--loading': isLoading.value,
      'theme-switcher--disabled': props.disabled
    }
  ]
})

const isDark = computed({
  get: () => currentTheme.value === 'dark',
  set: (value: boolean) => {
    currentTheme.value = value ? 'dark' : 'light'
  }
})

const currentIcon = computed(() => {
  const iconMap = {
    light: Sunny,
    dark: Moon,
    auto: Monitor,
    ...props.icons
  }
  return iconMap[currentTheme.value] || Palette
})

const currentText = computed(() => {
  return props.labels[currentTheme.value] || currentTheme.value
})

const themeOptions = computed(() => {
  return availableThemes.value.map(theme => ({
    value: theme,
    label: props.labels[theme] || theme,
    icon: props.icons[theme],
    preview: props.previews[theme]
  }))
})

const segmentedOptions = computed(() => {
  return availableThemes.value.map(theme => ({
    label: props.labels[theme] || theme,
    value: theme,
    icon: props.icons[theme]
  }))
})

// 初始化
onMounted(() => {
  loadCurrentTheme()
  setupThemeListener()
})

// 加载当前主题
const loadCurrentTheme = () => {
  const current = themeManager.getCurrentTheme()
  currentTheme.value = current.preference || 'light'
}

// 设置主题监听器
const setupThemeListener = () => {
  themeManager.addObserver({
    onThemeEvent: (event, data) => {
      if (event === 'themeChanged') {
        currentTheme.value = data.name
      }
    }
  })
}

// 切换主题
const toggleTheme = async () => {
  if (isLoading.value || props.disabled) return

  const currentIndex = availableThemes.value.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % availableThemes.value.length
  const nextTheme = availableThemes.value[nextIndex]
  
  await setTheme(nextTheme)
}

// 设置主题
const setTheme = async (theme: string) => {
  if (isLoading.value || props.disabled || theme === currentTheme.value) return

  emit('before-change', theme)
  isLoading.value = true

  try {
    await themeManager.setTheme(theme, {
      animated: props.animated,
      duration: props.animationDuration,
      type: props.animationType
    })
    
    currentTheme.value = theme
    emit('change', theme)
    emit('after-change', theme)
  } catch (error) {
    console.error('Failed to set theme:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理主题变化
const handleThemeChange = (theme: string) => {
  setTheme(theme)
}

// 处理开关变化
const handleSwitchChange = (value: boolean) => {
  const theme = value ? 'dark' : 'light'
  setTheme(theme)
}

// 监听主题变化
watch(currentTheme, (newTheme) => {
  if (newTheme !== themeManager.getCurrentTheme().preference) {
    setTheme(newTheme)
  }
})

// 暴露方法
defineExpose({
  toggleTheme,
  setTheme,
  getCurrentTheme: () => currentTheme.value,
  getAvailableThemes: () => availableThemes.value
})
</script>

<style scoped>
.theme-switcher {
  display: inline-flex;
  align-items: center;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-preview {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  border: 1px solid var(--el-border-color);
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-icon {
  color: var(--el-text-color-regular);
  transition: color 0.3s;
}

.theme-icon.light {
  color: #f39c12;
}

.theme-icon.dark {
  color: #34495e;
}

.theme-switcher--loading {
  pointer-events: none;
}

.theme-switcher--disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* 尺寸变体 */
.theme-switcher--large .theme-icon {
  font-size: 18px;
}

.theme-switcher--small .theme-icon {
  font-size: 14px;
}

/* 模式变体 */
.theme-switcher--button {
  /* 按钮模式样式 */
}

.theme-switcher--select {
  min-width: 120px;
}

.theme-switcher--segmented {
  /* 分段控制器样式 */
}

.theme-switcher--switch {
  /* 开关样式 */
}

.theme-switcher--custom {
  /* 自定义样式 */
}
</style>
```

### 3.2 主题预览组件
```vue
<!-- ThemePreview.vue - 主题预览组件 -->
<template>
  <div class="theme-preview" :class="previewClasses">
    <div class="preview-header">
      <h3>{{ title || `${themeName} 主题预览` }}</h3>
      <div class="preview-actions">
        <el-button
          v-if="showApplyButton"
          type="primary"
          size="small"
          :loading="isApplying"
          @click="applyTheme"
        >
          应用主题
        </el-button>
        <el-button
          v-if="showExportButton"
          size="small"
          @click="exportTheme"
        >
          导出主题
        </el-button>
      </div>
    </div>
    
    <div class="preview-content" :style="previewStyles">
      <!-- 颜色预览 -->
      <div class="color-preview">
        <h4>主要颜色</h4>
        <div class="color-grid">
          <div
            v-for="(color, name) in mainColors"
            :key="name"
            class="color-item"
          >
            <div
              class="color-swatch"
              :style="{ backgroundColor: color }"
              @click="copyColor(color)"
            />
            <span class="color-name">{{ colorLabels[name] || name }}</span>
            <span class="color-value">{{ color }}</span>
          </div>
        </div>
      </div>
      
      <!-- 组件预览 -->
      <div class="component-preview">
        <h4>组件预览</h4>
        <div class="component-grid">
          <!-- 按钮预览 -->
          <div class="component-section">
            <h5>按钮</h5>
            <div class="button-group">
              <el-button>默认按钮</el-button>
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </div>
          </div>
          
          <!-- 输入框预览 -->
          <div class="component-section">
            <h5>输入框</h5>
            <el-input v-model="sampleText" placeholder="请输入内容" />
          </div>
          
          <!-- 卡片预览 -->
          <div class="component-section">
            <h5>卡片</h5>
            <el-card class="sample-card">
              <template #header>
                <span>卡片标题</span>
              </template>
              <p>这是卡片内容，用于展示主题效果。</p>
            </el-card>
          </div>
          
          <!-- 表格预览 -->
          <div class="component-section">
            <h5>表格</h5>
            <el-table :data="sampleTableData" size="small">
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="age" label="年龄" />
              <el-table-column prop="city" label="城市" />
            </el-table>
          </div>
        </div>
      </div>
      
      <!-- 文本预览 -->
      <div class="text-preview">
        <h4>文本样式</h4>
        <div class="text-samples">
          <p class="text-primary">主要文本颜色</p>
          <p class="text-regular">常规文本颜色</p>
          <p class="text-secondary">次要文本颜色</p>
          <p class="text-placeholder">占位符文本颜色</p>
          <p class="text-disabled">禁用文本颜色</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { ElMessage } from 'element-plus'
import type { ThemeManager, ThemeConfig } from '../theme/ThemeManager'

// Props
interface Props {
  themeName: string
  title?: string
  showApplyButton?: boolean
  showExportButton?: boolean
  interactive?: boolean
  size?: 'small' | 'default' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  showApplyButton: true,
  showExportButton: true,
  interactive: true,
  size: 'default'
})

// Emits
interface Emits {
  (e: 'apply', themeName: string): void
  (e: 'export', themeName: string, theme: ThemeConfig): void
}

const emit = defineEmits<Emits>()

// 注入主题管理器
const themeManager = inject<ThemeManager>('themeManager')
if (!themeManager) {
  throw new Error('ThemeManager not provided')
}

// 响应式