# 暗黑模式与自适应主题

在现代 Web 应用中，主题切换已成为提升用户体验的重要功能。Element Plus 提供了完善的主题系统，支持亮色模式、暗黑模式以及自定义主题。本章将深入探讨如何实现灵活的主题管理系统。

## 1. 主题系统架构

### 1.1 主题管理器设计

```typescript
// theme/ThemeManager.ts
export interface ThemeConfig {
  name: string
  displayName: string
  colors: {
    primary: string
    success: string
    warning: string
    danger: string
    info: string
    textPrimary: string
    textRegular: string
    textSecondary: string
    textPlaceholder: string
    textDisabled: string
    borderBase: string
    borderLight: string
    borderLighter: string
    borderExtraLight: string
    fillBase: string
    fillLight: string
    fillLighter: string
    fillExtraLight: string
    bgBase: string
    bgPage: string
    bgOverlay: string
  }
  shadows: {
    base: string
    light: string
    lighter: string
    dark: string
  }
  borderRadius: {
    base: string
    small: string
    round: string
    circle: string
  }
  fontSize: {
    extraLarge: string
    large: string
    medium: string
    base: string
    small: string
    extraSmall: string
  }
  spacing: {
    none: string
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    xxl: string
  }
  zIndex: {
    normal: number
    top: number
    popper: number
  }
  animation: {
    duration: {
      slow: string
      base: string
      fast: string
    }
    easing: {
      easeInOut: string
      easeOut: string
      easeIn: string
    }
  }
}

export type ThemeMode = 'light' | 'dark' | 'auto'

export interface ThemeSetOptions {
  animated?: boolean
  duration?: number
  type?: 'fade' | 'slide' | 'zoom' | 'ripple'
  saveToStorage?: boolean
}

export interface ThemeObserver {
  (theme: ThemeConfig, mode: ThemeMode): void
}

export class ThemeManager {
  private currentTheme: ThemeConfig | null = null
  private currentMode: ThemeMode = 'auto'
  private themes: Map<string, ThemeConfig> = new Map()
  private observers: Set<ThemeObserver> = new Set()
  private mediaQuery: MediaQueryList
  private storageKey = 'element-plus-theme'
  private modeStorageKey = 'element-plus-theme-mode'

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this))
    this.initializeDefaultThemes()
    this.loadFromStorage()
  }

  private initializeDefaultThemes(): void {
    // 亮色主题
    this.registerTheme({
      name: 'light',
      displayName: '亮色模式',
      colors: {
        primary: '#409eff',
        success: '#67c23a',
        warning: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399',
        textPrimary: '#303133',
        textRegular: '#606266',
        textSecondary: '#909399',
        textPlaceholder: '#a8abb2',
        textDisabled: '#c0c4cc',
        borderBase: '#dcdfe6',
        borderLight: '#e4e7ed',
        borderLighter: '#ebeef5',
        borderExtraLight: '#f2f6fc',
        fillBase: '#f0f2f5',
        fillLight: '#f5f7fa',
        fillLighter: '#fafafa',
        fillExtraLight: '#fafcff',
        bgBase: '#ffffff',
        bgPage: '#f2f3f5',
        bgOverlay: 'rgba(255, 255, 255, 0.8)'
      },
      shadows: {
        base: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
        lighter: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
        dark: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12)'
      },
      borderRadius: {
        base: '4px',
        small: '2px',
        round: '20px',
        circle: '100%'
      },
      fontSize: {
        extraLarge: '20px',
        large: '18px',
        medium: '16px',
        base: '14px',
        small: '13px',
        extraSmall: '12px'
      },
      spacing: {
        none: '0',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '24px'
      },
      zIndex: {
        normal: 1,
        top: 1000,
        popper: 2000
      },
      animation: {
        duration: {
          slow: '0.3s',
          base: '0.2s',
          fast: '0.1s'
        },
        easing: {
          easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
          easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
        }
      }
    })

    // 暗色主题
    this.registerTheme({
      name: 'dark',
      displayName: '暗色模式',
      colors: {
        primary: '#409eff',
        success: '#67c23a',
        warning: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399',
        textPrimary: '#e5eaf3',
        textRegular: '#cfd3dc',
        textSecondary: '#a3a6ad',
        textPlaceholder: '#8d9095',
        textDisabled: '#6c6e72',
        borderBase: '#4c4d4f',
        borderLight: '#414243',
        borderLighter: '#363637',
        borderExtraLight: '#2b2b2c',
        fillBase: '#303133',
        fillLight: '#262727',
        fillLighter: '#1d1d1d',
        fillExtraLight: '#191919',
        bgBase: '#141414',
        bgPage: '#0a0a0a',
        bgOverlay: 'rgba(0, 0, 0, 0.8)'
      },
      shadows: {
        base: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
        lighter: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
        dark: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12)'
      },
      borderRadius: {
        base: '4px',
        small: '2px',
        round: '20px',
        circle: '100%'
      },
      fontSize: {
        extraLarge: '20px',
        large: '18px',
        medium: '16px',
        base: '14px',
        small: '13px',
        extraSmall: '12px'
      },
      spacing: {
        none: '0',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        xxl: '24px'
      },
      zIndex: {
        normal: 1,
        top: 1000,
        popper: 2000
      },
      animation: {
        duration: {
          slow: '0.3s',
          base: '0.2s',
          fast: '0.1s'
        },
        easing: {
          easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
          easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
          easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'
        }
      }
    })
  }

  public registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.name, theme)
  }

  public getTheme(name: string): ThemeConfig | undefined {
    return this.themes.get(name)
  }

  public getAllThemes(): ThemeConfig[] {
    return Array.from(this.themes.values())
  }

  public getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme
  }

  public getCurrentMode(): ThemeMode {
    return this.currentMode
  }

  public async setTheme(name: string, options: ThemeSetOptions = {}): Promise<void> {
    const theme = this.themes.get(name)
    if (!theme) {
      throw new Error(`Theme '${name}' not found`)
    }

    const {
      animated = true,
      duration = 300,
      type = 'fade',
      saveToStorage = true
    } = options

    if (animated) {
      await this.animateThemeChange(theme, { duration, type })
    } else {
      this.applyTheme(theme)
    }

    this.currentTheme = theme
    
    if (saveToStorage) {
      localStorage.setItem(this.storageKey, name)
    }

    this.notifyObservers(theme, this.currentMode)
  }

  public async setMode(mode: ThemeMode, options: ThemeSetOptions = {}): Promise<void> {
    this.currentMode = mode
    localStorage.setItem(this.modeStorageKey, mode)

    const effectiveTheme = this.getEffectiveTheme(mode)
    if (effectiveTheme) {
      await this.setTheme(effectiveTheme.name, { ...options, saveToStorage: false })
    }
  }

  public async toggleTheme(options: ThemeSetOptions = {}): Promise<void> {
    const currentName = this.currentTheme?.name || 'light'
    const nextTheme = currentName === 'light' ? 'dark' : 'light'
    await this.setTheme(nextTheme, options)
  }

  private getEffectiveTheme(mode: ThemeMode): ThemeConfig | null {
    if (mode === 'auto') {
      const prefersDark = this.mediaQuery.matches
      return this.themes.get(prefersDark ? 'dark' : 'light') || null
    }
    return this.themes.get(mode) || null
  }

  private handleSystemThemeChange(): void {
    if (this.currentMode === 'auto') {
      const effectiveTheme = this.getEffectiveTheme('auto')
      if (effectiveTheme && effectiveTheme !== this.currentTheme) {
        this.setTheme(effectiveTheme.name, { animated: true })
      }
    }
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement
    
    // 应用颜色变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--el-color-${this.kebabCase(key)}`, value)
    })

    // 应用阴影变量
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--el-box-shadow-${key}`, value)
    })

    // 应用边框圆角变量
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--el-border-radius-${key}`, value)
    })

    // 应用字体大小变量
    Object.entries(theme.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--el-font-size-${this.kebabCase(key)}`, value)
    })

    // 应用间距变量
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--el-spacing-${key}`, value)
    })

    // 应用层级变量
    Object.entries(theme.zIndex).forEach(([key, value]) => {
      root.style.setProperty(`--el-z-index-${this.kebabCase(key)}`, value.toString())
    })

    // 应用动画变量
    Object.entries(theme.animation.duration).forEach(([key, value]) => {
      root.style.setProperty(`--el-transition-duration-${key}`, value)
    })
    
    Object.entries(theme.animation.easing).forEach(([key, value]) => {
      root.style.setProperty(`--el-transition-${this.kebabCase(key)}`, value)
    })

    // 设置主题类名
    root.className = root.className.replace(/theme-\w+/g, '')
    root.classList.add(`theme-${theme.name}`)
  }

  private async animateThemeChange(
    theme: ThemeConfig,
    options: { duration: number; type: string }
  ): Promise<void> {
    const { duration, type } = options
    
    switch (type) {
      case 'fade':
        await this.fadeAnimation(duration)
        break
      case 'slide':
        await this.slideAnimation(duration)
        break
      case 'zoom':
        await this.zoomAnimation(duration)
        break
      case 'ripple':
        await this.rippleAnimation(duration)
        break
      default:
        break
    }
    
    this.applyTheme(theme)
    
    // 恢复动画
    await new Promise(resolve => setTimeout(resolve, 50))
    document.body.style.transition = ''
    document.body.style.transform = ''
    document.body.style.opacity = ''
  }

  private async fadeAnimation(duration: number): Promise<void> {
    document.body.style.transition = `opacity ${duration}ms ease-in-out`
    document.body.style.opacity = '0'
    await new Promise(resolve => setTimeout(resolve, duration / 2))
    document.body.style.opacity = '1'
  }

  private async slideAnimation(duration: number): Promise<void> {
    document.body.style.transition = `transform ${duration}ms ease-in-out`
    document.body.style.transform = 'translateX(-100%)'
    await new Promise(resolve => setTimeout(resolve, duration / 2))
    document.body.style.transform = 'translateX(0)'
  }

  private async zoomAnimation(duration: number): Promise<void> {
    document.body.style.transition = `transform ${duration}ms ease-in-out`
    document.body.style.transform = 'scale(0.95)'
    await new Promise(resolve => setTimeout(resolve, duration / 2))
    document.body.style.transform = 'scale(1)'
  }

  private async rippleAnimation(duration: number): Promise<void> {
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.3) 100%);
      pointer-events: none;
      z-index: 9999;
      animation: ripple ${duration}ms ease-out;
    `
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(ripple)
    
    await new Promise(resolve => setTimeout(resolve, duration))
    
    document.body.removeChild(ripple)
    document.head.removeChild(style)
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }

  private loadFromStorage(): void {
    const savedTheme = localStorage.getItem(this.storageKey)
    const savedMode = localStorage.getItem(this.modeStorageKey) as ThemeMode
    
    if (savedMode) {
      this.currentMode = savedMode
    }
    
    const effectiveTheme = savedTheme 
      ? this.themes.get(savedTheme)
      : this.getEffectiveTheme(this.currentMode)
    
    if (effectiveTheme) {
      this.setTheme(effectiveTheme.name, { animated: false, saveToStorage: false })
    }
  }

  public subscribe(observer: ThemeObserver): () => void {
    this.observers.add(observer)
    return () => this.observers.delete(observer)
  }

  private notifyObservers(theme: ThemeConfig, mode: ThemeMode): void {
    this.observers.forEach(observer => observer(theme, mode))
  }

  public createThemeVariant(baseName: string, variantName: string, modifications: Partial<ThemeConfig>): void {
    const baseTheme = this.themes.get(baseName)
    if (!baseTheme) {
      throw new Error(`Base theme '${baseName}' not found`)
    }

    const variantTheme: ThemeConfig = {
      ...baseTheme,
      ...modifications,
      name: variantName,
      colors: {
        ...baseTheme.colors,
        ...modifications.colors
      }
    }

    this.registerTheme(variantTheme)
  }

  public exportTheme(name: string): string {
    const theme = this.themes.get(name)
    if (!theme) {
      throw new Error(`Theme '${name}' not found`)
    }
    return JSON.stringify(theme, null, 2)
  }

  public importTheme(themeJson: string): void {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig
      this.registerTheme(theme)
    } catch (error) {
      throw new Error('Invalid theme JSON format')
    }
  }

  public destroy(): void {
    this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this))
    this.observers.clear()
  }
}
```

### 1.2 主题模式管理

```typescript
// theme/ThemeModeManager.ts
export class ThemeModeManager {
  private mode: ThemeMode = 'auto'
  private listeners: Set<(theme: ThemeMode) => void> = new Set()
  private mediaQuery: MediaQueryList
  private storageKey = 'theme-mode'

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', this.handleSystemChange.bind(this))
    this.loadFromStorage()
  }

  public getMode(): ThemeMode {
    return this.mode
  }

  public setMode(mode: ThemeMode): void {
    this.mode = mode
    this.saveToStorage()
    this.notifyListeners()
  }

  public getEffectiveMode(): 'light' | 'dark' {
    if (this.mode === 'auto') {
      return this.mediaQuery.matches ? 'dark' : 'light'
    }
    return this.mode as 'light' | 'dark'
  }

  public subscribe(listener: (mode: ThemeMode) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private handleSystemChange(): void {
    if (this.mode === 'auto') {
      this.notifyListeners()
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.mode))
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, this.mode)
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.storageKey) as ThemeMode
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      this.mode = saved
    }
  }
}
```

## 2. 主题存储与持久化

### 2.1 本地存储管理

```typescript
// theme/ThemeStorage.ts
export interface ThemeStorageData {
  currentTheme: string
  mode: ThemeMode
  customThemes: Record<string, ThemeConfig>
  preferences: {
    animationEnabled: boolean
    animationType: string
    animationDuration: number
  }
}

export class ThemeStorage {
  private storageKey = 'element-plus-theme-data'
  private fallbackStorage: Map<string, string> = new Map()

  public save(data: Partial<ThemeStorageData>): void {
    try {
      const existing = this.load()
      const merged = { ...existing, ...data }
      const serialized = JSON.stringify(merged)
      
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem(this.storageKey, serialized)
      } else {
        this.fallbackStorage.set(this.storageKey, serialized)
      }
    } catch (error) {
      console.warn('Failed to save theme data:', error)
    }
  }

  public load(): ThemeStorageData {
    try {
      let data: string | null = null
      
      if (this.isLocalStorageAvailable()) {
        data = localStorage.getItem(this.storageKey)
      } else {
        data = this.fallbackStorage.get(this.storageKey) || null
      }
      
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.warn('Failed to load theme data:', error)
    }
    
    return this.getDefaultData()
  }

  public clear(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.removeItem(this.storageKey)
      } else {
        this.fallbackStorage.delete(this.storageKey)
      }
    } catch (error) {
      console.warn('Failed to clear theme data:', error)
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__theme_storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  private getDefaultData(): ThemeStorageData {
    return {
      currentTheme: 'light',
      mode: 'auto',
      customThemes: {},
      preferences: {
        animationEnabled: true,
        animationType: 'fade',
        animationDuration: 300
      }
    }
  }
}
```

### 2.2 主题同步服务

```typescript
// theme/ThemeSyncService.ts
export interface ThemeSyncOptions {
  endpoint: string
  apiKey?: string
  userId?: string
  syncInterval?: number
}

export class ThemeSyncService {
  private options: ThemeSyncOptions
  private syncTimer: NodeJS.Timeout | null = null
  private storage: ThemeStorage

  constructor(options: ThemeSyncOptions, storage: ThemeStorage) {
    this.options = options
    this.storage = storage
    
    if (options.syncInterval) {
      this.startAutoSync()
    }
  }

  public async syncToServer(): Promise<void> {
    try {
      const data = this.storage.load()
      const response = await fetch(`${this.options.endpoint}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
        },
        body: JSON.stringify({
          userId: this.options.userId,
          themeData: data
        })
      })
      
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to sync theme to server:', error)
      throw error
    }
  }

  public async syncFromServer(): Promise<void> {
    try {
      const response = await fetch(
        `${this.options.endpoint}/sync?userId=${this.options.userId}`,
        {
          headers: {
            ...(this.options.apiKey && { 'Authorization': `Bearer ${this.options.apiKey}` })
          }
        }
      )
      
      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`)
      }
      
      const { themeData } = await response.json()
      this.storage.save(themeData)
    } catch (error) {
      console.error('Failed to sync theme from server:', error)
      throw error
    }
  }

  public startAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
    }
    
    this.syncTimer = setInterval(() => {
      this.syncToServer().catch(console.error)
    }, this.options.syncInterval || 300000) // 默认5分钟
  }

  public stopAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer)
      this.syncTimer = null
    }
  }

  public destroy(): void {
    this.stopAutoSync()
  }
}
```

## 3. 主题动画系统

### 3.1 动画管理器

```typescript
// theme/ThemeAnimationManager.ts
export interface AnimationConfig {
  type: 'fade' | 'slide' | 'zoom' | 'ripple' | 'morph'
  duration: number
  easing: string
  direction?: 'left' | 'right' | 'up' | 'down'
}

export class ThemeAnimationManager {
  private isAnimating = false
  private animationQueue: Array<() => Promise<void>> = []

  public async animate(
    config: AnimationConfig,
    applyTheme: () => void
  ): Promise<void> {
    if (this.isAnimating) {
      return new Promise(resolve => {
        this.animationQueue.push(async () => {
          await this.performAnimation(config, applyTheme)
          resolve()
        })
      })
    }

    await this.performAnimation(config, applyTheme)
    await this.processQueue()
  }

  private async performAnimation(
    config: AnimationConfig,
    applyTheme: () => void
  ): Promise<void> {
    this.isAnimating = true

    try {
      switch (config.type) {
        case 'fade':
          await this.fadeAnimation(config.duration, config.easing, applyTheme)
          break
        case 'slide':
          await this.slideAnimation(
            config.duration,
            config.easing,
            config.direction || 'left',
            applyTheme
          )
          break
        case 'zoom':
          await this.zoomAnimation(config.duration, config.easing, applyTheme)
          break
        case 'ripple':
          await this.rippleAnimation(
            config.duration,
            config.easing,
            applyTheme
          )
          break
        case 'morph':
          await this.morphAnimation(
            config.duration,
            config.easing,
            applyTheme
          )
          break
      }
    } finally {
      this.isAnimating = false
    }
  }

  private async fadeAnimation(duration: number, easing: string, applyTheme: () => void): Promise<void> {
    const body = document.body
    body.style.transition = `opacity ${duration}ms ${easing}`
    body.style.opacity = '0'

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    applyTheme()
    body.style.opacity = '1'

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    body.style.transition = ''
  }

  private async slideAnimation(
    duration: number,
    easing: string,
    direction: string,
    applyTheme: () => void
  ): Promise<void> {
    const body = document.body
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    }

    body.style.transition = `transform ${duration}ms ${easing}`
    body.style.transform = transforms[direction as keyof typeof transforms]

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    applyTheme()
    body.style.transform = 'translate(0, 0)'

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    body.style.transition = ''
    body.style.transform = ''
  }

  private async zoomAnimation(duration: number, easing: string, applyTheme: () => void): Promise<void> {
    const body = document.body
    body.style.transition = `transform ${duration}ms ${easing}`
    body.style.transform = 'scale(0.95)'

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    applyTheme()
    body.style.transform = 'scale(1)'

    await new Promise(resolve => setTimeout(resolve, duration / 2))
    body.style.transition = ''
    body.style.transform = ''
  }

  private async rippleAnimation(
    duration: number,
    easing: string,
    applyTheme: () => void
  ): Promise<void> {
    const overlay = this.createRippleOverlay(duration, easing)
    document.body.appendChild(overlay)

    await new Promise(resolve => setTimeout(resolve, duration / 3))
    applyTheme()

    await new Promise(resolve => setTimeout(resolve, (duration * 2) / 3))
    document.body.removeChild(overlay)
  }

  private async morphAnimation(
    duration: number,
    easing: string,
    applyTheme: () => void
  ): Promise<void> {
    const canvas = this.createMorphCanvas()
    document.body.appendChild(canvas)

    await this.performMorphTransition(canvas, duration, easing, applyTheme)
    document.body.removeChild(canvas)
  }

  private createRippleOverlay(duration: number, easing: string): HTMLElement {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0.3) 100%);
      pointer-events: none;
      z-index: 9999;
      animation: ripple-expand ${duration}ms ${easing};
    `

    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple-expand {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.2); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    setTimeout(() => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }, duration)

    return overlay
  }

  private createMorphCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    return canvas
  }

  private async performMorphTransition(
    canvas: HTMLCanvasElement,
    duration: number,
    easing: string,
    applyTheme: () => void
  ): Promise<void> {
    const ctx = canvas.getContext('2d')!
    const startTime = Date.now()

    return new Promise(resolve => {
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = this.applyEasing(progress, easing)

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.drawMorphFrame(ctx, easedProgress)

        if (progress >= 0.5 && !applyTheme.called) {
          applyTheme()
          applyTheme.called = true
        }

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          resolve()
        }
      }
      animate()
    })
  }

  private drawMorphFrame(ctx: CanvasRenderingContext2D, progress: number): void {
    const { width, height } = ctx.canvas
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY)
    const radius = maxRadius * progress

    ctx.fillStyle = `rgba(0, 0, 0, ${0.8 * (1 - progress)})`
    ctx.fillRect(0, 0, width, height)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  private applyEasing(progress: number, easing: string): number {
    switch (easing) {
      case 'ease-in':
        return progress * progress
      case 'ease-out':
        return 1 - (1 - progress) * (1 - progress)
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - 2 * (1 - progress) * (1 - progress)
      default:
        return progress
    }
  }

  private async processQueue(): Promise<void> {
    if (this.animationQueue.length > 0) {
      const next = this.animationQueue.shift()!
      await next()
    }
  }
}
```

## 4. Vue 组件实现

### 4.1 主题切换器组件

```vue
<!-- ThemeSwitcher.vue - 主题切换器组件 -->
<template>
  <div class="theme-switcher" :class="switcherClasses">
    <!-- 简单切换按钮 -->
    <el-button
      v-if="mode === 'button'"
      :type="type"
      :size="size"
      :circle="circle"
      :loading="isLoading"
      :disabled="disabled"
      @click="toggleTheme"
    >
      <template v-if="!isLoading">
        <el-icon v-if="showText"><component :is="currentIcon" /></el-icon>
        <span v-if="showText && !circle">{{ currentLabel }}</span>
      </template>
    </el-button>

    <!-- 下拉选择器 -->
    <el-select
      v-else-if="mode === 'select'"
      v-model="currentTheme"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled || isLoading"
      @change="setTheme"
    >
      <el-option
        v-for="theme in availableThemes"
        :key="theme"
        :label="getThemeLabel(theme)"
        :value="theme"
      >
        <div class="theme-option">
          <div
            class="theme-preview"
            :style="{ backgroundColor: getThemePreview(theme) }"
          />
          <span>{{ getThemeLabel(theme) }}</span>
        </div>
      </el-option>
    </el-select>

    <!-- 分段控制器 -->
    <el-radio-group
      v-else-if="mode === 'segmented'"
      v-model="currentTheme"
      :size="size"
      :disabled="disabled || isLoading"
      @change="setTheme"
    >
      <el-radio-button v-for="theme in availableThemes" :key="theme" :label="theme">
        {{ getThemeLabel(theme) }}
      </el-radio-button>
    </el-radio-group>

    <!-- 开关切换器 -->
    <div v-else-if="mode === 'switch'" class="theme-switch">
      <el-icon class="theme-icon light"><Sunny /></el-icon>
      <el-switch
        v-model="isDark"
        :size="size"
        :disabled="disabled || isLoading"
        @change="handleSwitchChange"
      />
      <el-icon class="theme-icon dark"><Moon /></el-icon>
    </div>

    <!-- 自定义切换器 -->
    <div v-else-if="mode === 'custom'" class="theme-custom">
      <slot
        :current-theme="currentTheme"
        :available-themes="availableThemes"
        :is-loading="isLoading"
        :toggle-theme="toggleTheme"
        :set-theme="setTheme"
        :get-theme-label="getThemeLabel"
        :get-theme-preview="getThemePreview"
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
    light: '#409eff',
    dark: '#303133',
    auto: 'linear-gradient(45deg, #409eff 50%, #303133 50%)'
  })
})

// Emits
interface Emits {
  (e: 'change', theme: string): void
  (e: 'before-change', theme: string): void
}

const emit = defineEmits<Emits>()

// 注入主题管理器
const themeManager = inject<ThemeManager>('themeManager')
if (!themeManager) {
  throw new Error('ThemeManager not provided')
}

// 响应式状态
const isLoading = ref(false)
const currentTheme = ref('light')

// 计算属性
const switcherClasses = computed(() => ({
  [`theme-switcher--${props.size}`]: true,
  [`theme-switcher--${props.mode}`]: true,
  'theme-switcher--loading': isLoading.value,
  'theme-switcher--disabled': props.disabled
}))

const availableThemes = computed(() => {
  return props.themes || ['light', 'dark', 'auto']
})

const currentIcon = computed(() => {
  return props.icons[currentTheme.value] || Palette
})

const currentLabel = computed(() => {
  return props.labels[currentTheme.value] || currentTheme.value
})

const isDark = computed({
  get: () => currentTheme.value === 'dark',
  set: (value: boolean) => {
    currentTheme.value = value ? 'dark' : 'light'
  }
})

// 方法
const getThemeLabel = (theme: string): string => {
  return props.labels[theme] || theme
}

const getThemePreview = (theme: string): string => {
  return props.previews[theme] || '#409eff'
}

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
  } catch (error) {
    console.error('Failed to set theme:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleTheme = async () => {
  const currentIndex = availableThemes.value.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % availableThemes.value.length
  const nextTheme = availableThemes.value[nextIndex]
  await setTheme(nextTheme)
}

const handleSwitchChange = (value: boolean) => {
  setTheme(value ? 'dark' : 'light')
}

// 生命周期
onMounted(() => {
  const current = themeManager.getCurrentTheme()
  if (current) {
    currentTheme.value = current.name
  }

  // 监听主题变化
  themeManager.subscribe((theme) => {
    currentTheme.value = theme.name
  })
})

// 监听器
watch(
  () => props.themes,
  (newThemes) => {
    if (newThemes && !newThemes.includes(currentTheme.value)) {
      currentTheme.value = newThemes[0] || 'light'
    }
  }
)

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

.theme-switcher--small {
  font-size: 12px;
}

.theme-switcher--large {
  font-size: 16px;
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

// 响应式数据
const isApplying = ref(false)
const sampleText = ref('示例文本')
const sampleTableData = ref([
  { name: '张三', age: 25, city: '北京' },
  { name: '李四', age: 30, city: '上海' },
  { name: '王五', age: 28, city: '广州' }
])

// 计算属性
const previewClasses = computed(() => ({
  [`theme-preview--${props.size}`]: true,
  'theme-preview--interactive': props.interactive
}))

const previewStyles = computed(() => {
  const theme = themeManager.getTheme(props.themeName)
  if (!theme) return {}
  
  return {
    '--el-color-primary': theme.colors.primary,
    '--el-color-success': theme.colors.success,
    '--el-color-warning': theme.colors.warning,
    '--el-color-danger': theme.colors.danger,
    '--el-color-info': theme.colors.info,
    '--el-text-color-primary': theme.colors.textPrimary,
    '--el-text-color-regular': theme.colors.textRegular,
    '--el-text-color-secondary': theme.colors.textSecondary,
    '--el-text-color-placeholder': theme.colors.textPlaceholder,
    '--el-text-color-disabled': theme.colors.textDisabled
  }
})

const mainColors = computed(() => {
  const theme = themeManager.getTheme(props.themeName)
  if (!theme) return {}
  
  return {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    info: theme.colors.info
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
  try {
    isApplying.value = true
    await themeManager.setTheme(props.themeName)
    emit('apply', props.themeName)
    ElMessage.success('主题应用成功')
  } catch (error) {
    ElMessage.error('主题应用失败')
    console.error('Apply theme error:', error)
  } finally {
    isApplying.value = false
  }
}

const exportTheme = () => {
  const theme = themeManager.getTheme(props.themeName)
  if (theme) {
    emit('export', props.themeName, theme)
    ElMessage.success('主题导出成功')
  }
}

const copyColor = async (color: string) => {
  try {
    await navigator.clipboard.writeText(color)
    ElMessage.success(`颜色值 ${color} 已复制到剪贴板`)
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
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color);
}

.preview-header h3 {
  margin: 0;
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
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.color-preview .color-item,
.component-preview .demo-item,
.text-preview .text-item {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
  transition: all 0.3s ease;
}

.color-preview .color-item:hover,
.component-preview .demo-item:hover,
.text-preview .text-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}
</style>