# Element Plus 跨平台开发实践

## 学习目标

今天我们将学习如何使用 Element Plus 进行跨平台开发，掌握移动端适配、桌面应用开发、小程序开发和跨平台组件设计。

- 理解跨平台开发的挑战和解决方案
- 掌握移动端适配的最佳实践
- 学习桌面应用开发技术
- 了解小程序开发实践
- 实现跨平台组件设计

## 1. 跨平台开发架构

### 1.1 跨平台架构设计

```typescript
// packages/cross-platform/src/core/platform-manager.ts

export enum PlatformType {
  WEB = 'web',
  MOBILE_WEB = 'mobile-web',
  DESKTOP = 'desktop',
  MOBILE_APP = 'mobile-app',
  MINI_PROGRAM = 'mini-program'
}

export interface PlatformCapabilities {
  touch: boolean
  mouse: boolean
  keyboard: boolean
  camera: boolean
  geolocation: boolean
  notification: boolean
  fileSystem: boolean
  clipboard: boolean
  vibration: boolean
  orientation: boolean
}

export interface PlatformConfig {
  type: PlatformType
  capabilities: PlatformCapabilities
  viewport: {
    width: number
    height: number
    density: number
  }
  theme: {
    primaryColor: string
    darkMode: boolean
    customTheme?: Record<string, any>
  }
  features: {
    responsive: boolean
    accessibility: boolean
    i18n: boolean
    offline: boolean
  }
}

export interface PlatformAdapter {
  name: string
  type: PlatformType
  detect(): boolean
  initialize(config: PlatformConfig): Promise<void>
  getCapabilities(): PlatformCapabilities
  adaptComponent(component: any, options?: any): any
  adaptStyle(style: any, options?: any): any
}

export class PlatformManager {
  private adapters = new Map<PlatformType, PlatformAdapter>()
  private currentPlatform: PlatformType | null = null
  private currentAdapter: PlatformAdapter | null = null
  private config: PlatformConfig | null = null

  /**
   * 注册平台适配器
   */
  registerAdapter(adapter: PlatformAdapter): void {
    this.adapters.set(adapter.type, adapter)
  }

  /**
   * 检测当前平台
   */
  detectPlatform(): PlatformType {
    for (const [type, adapter] of this.adapters) {
      if (adapter.detect()) {
        this.currentPlatform = type
        this.currentAdapter = adapter
        return type
      }
    }
    
    // 默认为 web 平台
    this.currentPlatform = PlatformType.WEB
    this.currentAdapter = this.adapters.get(PlatformType.WEB) || null
    return PlatformType.WEB
  }

  /**
   * 初始化平台
   */
  async initialize(config: PlatformConfig): Promise<void> {
    if (!this.currentAdapter) {
      this.detectPlatform()
    }
    
    if (!this.currentAdapter) {
      throw new Error('No platform adapter found')
    }
    
    this.config = config
    await this.currentAdapter.initialize(config)
  }

  /**
   * 获取当前平台类型
   */
  getCurrentPlatform(): PlatformType | null {
    return this.currentPlatform
  }

  /**
   * 获取平台能力
   */
  getCapabilities(): PlatformCapabilities | null {
    return this.currentAdapter?.getCapabilities() || null
  }

  /**
   * 适配组件
   */
  adaptComponent(component: any, options?: any): any {
    if (!this.currentAdapter) {
      return component
    }
    
    return this.currentAdapter.adaptComponent(component, options)
  }

  /**
   * 适配样式
   */
  adaptStyle(style: any, options?: any): any {
    if (!this.currentAdapter) {
      return style
    }
    
    return this.currentAdapter.adaptStyle(style, options)
  }

  /**
   * 检查平台能力
   */
  hasCapability(capability: keyof PlatformCapabilities): boolean {
    const capabilities = this.getCapabilities()
    return capabilities ? capabilities[capability] : false
  }

  /**
   * 是否为移动平台
   */
  isMobile(): boolean {
    return this.currentPlatform === PlatformType.MOBILE_WEB ||
           this.currentPlatform === PlatformType.MOBILE_APP
  }

  /**
   * 是否为桌面平台
   */
  isDesktop(): boolean {
    return this.currentPlatform === PlatformType.DESKTOP ||
           this.currentPlatform === PlatformType.WEB
  }

  /**
   * 是否为小程序平台
   */
  isMiniProgram(): boolean {
    return this.currentPlatform === PlatformType.MINI_PROGRAM
  }
}
```

### 1.2 Web 平台适配器

```typescript
// packages/cross-platform/src/adapters/web-adapter.ts
import type { PlatformAdapter, PlatformCapabilities, PlatformConfig } from '../core/platform-manager'
import { PlatformType } from '../core/platform-manager'

export class WebAdapter implements PlatformAdapter {
  name = 'WebAdapter'
  type = PlatformType.WEB

  /**
   * 检测是否为 Web 平台
   */
  detect(): boolean {
    return typeof window !== 'undefined' && 
           typeof document !== 'undefined' &&
           !this.isMobile() &&
           !this.isMiniProgram()
  }

  /**
   * 初始化 Web 平台
   */
  async initialize(config: PlatformConfig): Promise<void> {
    // 设置视口
    this.setupViewport(config.viewport)
    
    // 设置主题
    this.setupTheme(config.theme)
    
    // 设置响应式
    if (config.features.responsive) {
      this.setupResponsive()
    }
    
    // 设置无障碍
    if (config.features.accessibility) {
      this.setupAccessibility()
    }
  }

  /**
   * 获取平台能力
   */
  getCapabilities(): PlatformCapabilities {
    return {
      touch: 'ontouchstart' in window,
      mouse: true,
      keyboard: true,
      camera: navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined,
      geolocation: navigator.geolocation !== undefined,
      notification: 'Notification' in window,
      fileSystem: 'showOpenFilePicker' in window,
      clipboard: navigator.clipboard !== undefined,
      vibration: 'vibrate' in navigator,
      orientation: 'orientation' in screen
    }
  }

  /**
   * 适配组件
   */
  adaptComponent(component: any, options?: any): any {
    // Web 平台通常不需要特殊适配
    return component
  }

  /**
   * 适配样式
   */
  adaptStyle(style: any, options?: any): any {
    return {
      ...style,
      // 添加 Web 特定的样式
      userSelect: style.userSelect || 'auto',
      cursor: style.cursor || 'default'
    }
  }

  /**
   * 设置视口
   */
  private setupViewport(viewport: PlatformConfig['viewport']): void {
    const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (meta) {
      meta.content = `width=${viewport.width}, height=${viewport.height}, initial-scale=1.0`
    }
  }

  /**
   * 设置主题
   */
  private setupTheme(theme: PlatformConfig['theme']): void {
    document.documentElement.style.setProperty('--el-color-primary', theme.primaryColor)
    
    if (theme.darkMode) {
      document.documentElement.classList.add('dark')
    }
    
    if (theme.customTheme) {
      Object.entries(theme.customTheme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value as string)
      })
    }
  }

  /**
   * 设置响应式
   */
  private setupResponsive(): void {
    const style = document.createElement('style')
    style.textContent = `
      @media (max-width: 768px) {
        .el-container {
          flex-direction: column;
        }
        .el-aside {
          width: 100% !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 设置无障碍
   */
  private setupAccessibility(): void {
    // 添加键盘导航支持
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    })
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation')
    })
  }

  /**
   * 检测是否为移动设备
   */
  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * 检测是否为小程序
   */
  private isMiniProgram(): boolean {
    return typeof wx !== 'undefined' || typeof my !== 'undefined' || typeof swan !== 'undefined'
  }
}
```

### 1.3 移动端适配器

```typescript
// packages/cross-platform/src/adapters/mobile-adapter.ts
import type { PlatformAdapter, PlatformCapabilities, PlatformConfig } from '../core/platform-manager'
import { PlatformType } from '../core/platform-manager'

export class MobileAdapter implements PlatformAdapter {
  name = 'MobileAdapter'
  type = PlatformType.MOBILE_WEB
  private touchStartY = 0
  private touchEndY = 0

  /**
   * 检测是否为移动端
   */
  detect(): boolean {
    return typeof window !== 'undefined' && 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  /**
   * 初始化移动端
   */
  async initialize(config: PlatformConfig): Promise<void> {
    // 设置移动端视口
    this.setupMobileViewport()
    
    // 设置触摸事件
    this.setupTouchEvents()
    
    // 设置移动端主题
    this.setupMobileTheme(config.theme)
    
    // 禁用双击缩放
    this.disableDoubleTapZoom()
    
    // 设置安全区域
    this.setupSafeArea()
  }

  /**
   * 获取移动端能力
   */
  getCapabilities(): PlatformCapabilities {
    return {
      touch: true,
      mouse: false,
      keyboard: 'ontouchstart' in window,
      camera: navigator.mediaDevices && navigator.mediaDevices.getUserMedia !== undefined,
      geolocation: navigator.geolocation !== undefined,
      notification: 'Notification' in window,
      fileSystem: false,
      clipboard: navigator.clipboard !== undefined,
      vibration: 'vibrate' in navigator,
      orientation: true
    }
  }

  /**
   * 适配移动端组件
   */
  adaptComponent(component: any, options?: any): any {
    // 为移动端组件添加触摸优化
    return {
      ...component,
      props: {
        ...component.props,
        // 增大触摸目标
        size: component.props?.size || 'large',
        // 启用触摸反馈
        touchFeedback: true
      },
      style: {
        ...component.style,
        // 最小触摸目标尺寸
        minHeight: '44px',
        minWidth: '44px',
        // 触摸优化
        touchAction: 'manipulation'
      }
    }
  }

  /**
   * 适配移动端样式
   */
  adaptStyle(style: any, options?: any): any {
    return {
      ...style,
      // 移动端特定样式
      WebkitTapHighlightColor: 'transparent',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'manipulation',
      // 字体大小适配
      fontSize: this.adaptFontSize(style.fontSize),
      // 间距适配
      padding: this.adaptSpacing(style.padding),
      margin: this.adaptSpacing(style.margin)
    }
  }

  /**
   * 设置移动端视口
   */
  private setupMobileViewport(): void {
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'viewport'
      document.head.appendChild(meta)
    }
    
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
  }

  /**
   * 设置触摸事件
   */
  private setupTouchEvents(): void {
    // 阻止默认的触摸行为
    document.addEventListener('touchstart', (e) => {
      this.touchStartY = e.touches[0].clientY
    }, { passive: true })
    
    document.addEventListener('touchmove', (e) => {
      this.touchEndY = e.touches[0].clientY
      
      // 阻止页面滚动（在某些情况下）
      const target = e.target as HTMLElement
      if (target.classList.contains('no-scroll')) {
        e.preventDefault()
      }
    }, { passive: false })
    
    // 添加触摸反馈
    document.addEventListener('touchstart', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('touch-feedback')) {
        target.classList.add('touching')
      }
    })
    
    document.addEventListener('touchend', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('touch-feedback')) {
        setTimeout(() => {
          target.classList.remove('touching')
        }, 150)
      }
    })
  }

  /**
   * 设置移动端主题
   */
  private setupMobileTheme(theme: PlatformConfig['theme']): void {
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --mobile-safe-area-top: env(safe-area-inset-top);
        --mobile-safe-area-bottom: env(safe-area-inset-bottom);
        --mobile-safe-area-left: env(safe-area-inset-left);
        --mobile-safe-area-right: env(safe-area-inset-right);
      }
      
      .touch-feedback.touching {
        opacity: 0.7;
        transform: scale(0.95);
        transition: all 0.15s ease;
      }
      
      .mobile-container {
        padding-top: var(--mobile-safe-area-top);
        padding-bottom: var(--mobile-safe-area-bottom);
        padding-left: var(--mobile-safe-area-left);
        padding-right: var(--mobile-safe-area-right);
      }
    `
    document.head.appendChild(style)
  }

  /**
   * 禁用双击缩放
   */
  private disableDoubleTapZoom(): void {
    let lastTouchEnd = 0
    document.addEventListener('touchend', (e) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }, false)
  }

  /**
   * 设置安全区域
   */
  private setupSafeArea(): void {
    // 检测是否有刘海屏
    const hasNotch = window.CSS && CSS.supports('padding-top', 'env(safe-area-inset-top)')
    
    if (hasNotch) {
      document.body.classList.add('has-safe-area')
    }
  }

  /**
   * 适配字体大小
   */
  private adaptFontSize(fontSize?: string): string {
    if (!fontSize) return '16px'
    
    const size = parseInt(fontSize)
    // 移动端字体稍大一些
    return `${Math.max(size + 2, 14)}px`
  }

  /**
   * 适配间距
   */
  private adaptSpacing(spacing?: string): string {
    if (!spacing) return '0'
    
    const value = parseInt(spacing)
    // 移动端间距稍大一些
    return `${Math.max(value * 1.2, 8)}px`
  }
}
```

## 2. 桌面应用开发

### 2.1 Electron 集成

```typescript
// packages/desktop/src/electron-adapter.ts
import { app, BrowserWindow, Menu, ipcMain, dialog, shell } from 'electron'
import type { PlatformAdapter, PlatformCapabilities, PlatformConfig } from '../cross-platform/src/core/platform-manager'
import { PlatformType } from '../cross-platform/src/core/platform-manager'
import path from 'path'

export class ElectronAdapter implements PlatformAdapter {
  name = 'ElectronAdapter'
  type = PlatformType.DESKTOP
  private mainWindow: BrowserWindow | null = null

  /**
   * 检测是否为 Electron 环境
   */
  detect(): boolean {
    return typeof process !== 'undefined' && 
           process.versions && 
           process.versions.electron !== undefined
  }

  /**
   * 初始化 Electron 应用
   */
  async initialize(config: PlatformConfig): Promise<void> {
    await app.whenReady()
    
    // 创建主窗口
    this.createMainWindow(config)
    
    // 设置菜单
    this.setupMenu()
    
    // 设置 IPC 通信
    this.setupIPC()
    
    // 设置应用事件
    this.setupAppEvents()
  }

  /**
   * 获取桌面端能力
   */
  getCapabilities(): PlatformCapabilities {
    return {
      touch: false,
      mouse: true,
      keyboard: true,
      camera: true,
      geolocation: false,
      notification: true,
      fileSystem: true,
      clipboard: true,
      vibration: false,
      orientation: false
    }
  }

  /**
   * 适配桌面端组件
   */
  adaptComponent(component: any, options?: any): any {
    return {
      ...component,
      props: {
        ...component.props,
        // 桌面端默认尺寸
        size: component.props?.size || 'default'
      },
      style: {
        ...component.style,
        // 桌面端特定样式
        cursor: 'pointer'
      }
    }
  }

  /**
   * 适配桌面端样式
   */
  adaptStyle(style: any, options?: any): any {
    return {
      ...style,
      // 桌面端特定样式
      userSelect: 'text',
      cursor: style.cursor || 'default'
    }
  }

  /**
   * 创建主窗口
   */
  private createMainWindow(config: PlatformConfig): void {
    this.mainWindow = new BrowserWindow({
      width: config.viewport.width || 1200,
      height: config.viewport.height || 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false
    })

    // 加载应用
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    }

    // 窗口准备好后显示
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    // 窗口关闭事件
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  /**
   * 设置菜单
   */
  private setupMenu(): void {
    const template = [
      {
        label: '文件',
        submenu: [
          {
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.mainWindow?.webContents.send('menu-new')
            }
          },
          {
            label: '打开',
            accelerator: 'CmdOrCtrl+O',
            click: async () => {
              const result = await dialog.showOpenDialog(this.mainWindow!, {
                properties: ['openFile'],
                filters: [
                  { name: 'JSON Files', extensions: ['json'] },
                  { name: 'All Files', extensions: ['*'] }
                ]
              })
              
              if (!result.canceled) {
                this.mainWindow?.webContents.send('menu-open', result.filePaths[0])
              }
            }
          },
          {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.mainWindow?.webContents.send('menu-save')
            }
          },
          { type: 'separator' },
          {
            label: '退出',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              app.quit()
            }
          }
        ]
      },
      {
        label: '编辑',
        submenu: [
          { role: 'undo', label: '撤销' },
          { role: 'redo', label: '重做' },
          { type: 'separator' },
          { role: 'cut', label: '剪切' },
          { role: 'copy', label: '复制' },
          { role: 'paste', label: '粘贴' }
        ]
      },
      {
        label: '视图',
        submenu: [
          { role: 'reload', label: '重新加载' },
          { role: 'forceReload', label: '强制重新加载' },
          { role: 'toggleDevTools', label: '开发者工具' },
          { type: 'separator' },
          { role: 'resetZoom', label: '实际大小' },
          { role: 'zoomIn', label: '放大' },
          { role: 'zoomOut', label: '缩小' },
          { type: 'separator' },
          { role: 'togglefullscreen', label: '全屏' }
        ]
      },
      {
        label: '窗口',
        submenu: [
          { role: 'minimize', label: '最小化' },
          { role: 'close', label: '关闭' }
        ]
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            click: () => {
              dialog.showMessageBox(this.mainWindow!, {
                type: 'info',
                title: '关于',
                message: 'Element Plus Desktop App',
                detail: '基于 Element Plus 的桌面应用'
              })
            }
          }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template as any)
    Menu.setApplicationMenu(menu)
  }

  /**
   * 设置 IPC 通信
   */
  private setupIPC(): void {
    // 文件操作
    ipcMain.handle('file:read', async (event, filePath: string) => {
      try {
        const fs = await import('fs/promises')
        const content = await fs.readFile(filePath, 'utf-8')
        return { success: true, content }
      } catch (error) {
        return { success: false, error: (error as Error).message }
      }
    })

    ipcMain.handle('file:write', async (event, filePath: string, content: string) => {
      try {
        const fs = await import('fs/promises')
        await fs.writeFile(filePath, content, 'utf-8')
        return { success: true }
      } catch (error) {
        return { success: false, error: (error as Error).message }
      }
    })

    // 对话框
    ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow!, options)
      return result
    })

    ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow!, options)
      return result
    })

    // 系统操作
    ipcMain.handle('system:openExternal', async (event, url: string) => {
      await shell.openExternal(url)
    })

    ipcMain.handle('system:showItemInFolder', async (event, fullPath: string) => {
      shell.showItemInFolder(fullPath)
    })

    // 窗口操作
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize()
    })

    ipcMain.handle('window:maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow?.maximize()
      }
    })

    ipcMain.handle('window:close', () => {
      this.mainWindow?.close()
    })
  }

  /**
   * 设置应用事件
   */
  private setupAppEvents(): void {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow({
          type: PlatformType.DESKTOP,
          capabilities: this.getCapabilities(),
          viewport: { width: 1200, height: 800, density: 1 },
          theme: { primaryColor: '#409eff', darkMode: false },
          features: { responsive: false, accessibility: true, i18n: true, offline: false }
        })
      }
    })
  }
}
```

### 2.2 Electron 预加载脚本

```typescript
// packages/desktop/src/preload.ts
import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作
  file: {
    read: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
    write: (filePath: string, content: string) => ipcRenderer.invoke('file:write', filePath, content)
  },
  
  // 对话框
  dialog: {
    showSaveDialog: (options: any) => ipcRenderer.invoke('dialog:showSaveDialog', options),
    showOpenDialog: (options: any) => ipcRenderer.invoke('dialog:showOpenDialog', options)
  },
  
  // 系统操作
  system: {
    openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
    showItemInFolder: (fullPath: string) => ipcRenderer.invoke('system:showItemInFolder', fullPath)
  },
  
  // 窗口操作
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close')
  },
  
  // 菜单事件监听
  onMenuAction: (callback: (action: string, data?: any) => void) => {
    ipcRenderer.on('menu-new', () => callback('new'))
    ipcRenderer.on('menu-open', (event, filePath) => callback('open', filePath))
    ipcRenderer.on('menu-save', () => callback('save'))
  }
})

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      file: {
        read: (filePath: string) => Promise<{ success: boolean; content?: string; error?: string }>
        write: (filePath: string, content: string) => Promise<{ success: boolean; error?: string }>
      }
      dialog: {
        showSaveDialog: (options: any) => Promise<any>
        showOpenDialog: (options: any) => Promise<any>
      }
      system: {
        openExternal: (url: string) => Promise<void>
        showItemInFolder: (fullPath: string) => Promise<void>
      }
      window: {
        minimize: () => Promise<void>
        maximize: () => Promise<void>
        close: () => Promise<void>
      }
      onMenuAction: (callback: (action: string, data?: any) => void) => void
    }
  }
}
```

## 3. 小程序开发实践

### 3.1 小程序适配器

```typescript
// packages/mini-program/src/mini-program-adapter.ts
import type { PlatformAdapter, PlatformCapabilities, PlatformConfig } from '../cross-platform/src/core/platform-manager'
import { PlatformType } from '../cross-platform/src/core/platform-manager'

export class MiniProgramAdapter implements PlatformAdapter {
  name = 'MiniProgramAdapter'
  type = PlatformType.MINI_PROGRAM
  private platform: 'wechat' | 'alipay' | 'baidu' | 'toutiao' | null = null

  /**
   * 检测是否为小程序环境
   */
  detect(): boolean {
    if (typeof wx !== 'undefined') {
      this.platform = 'wechat'
      return true
    }
    if (typeof my !== 'undefined') {
      this.platform = 'alipay'
      return true
    }
    if (typeof swan !== 'undefined') {
      this.platform = 'baidu'
      return true
    }
    if (typeof tt !== 'undefined') {
      this.platform = 'toutiao'
      return true
    }
    return false
  }

  /**
   * 初始化小程序
   */
  async initialize(config: PlatformConfig): Promise<void> {
    // 设置小程序主题
    this.setupMiniProgramTheme(config.theme)
    
    // 设置导航栏
    this.setupNavigationBar(config)
    
    // 设置页面配置
    this.setupPageConfig(config)
  }

  /**
   * 获取小程序能力
   */
  getCapabilities(): PlatformCapabilities {
    const baseCapabilities = {
      touch: true,
      mouse: false,
      keyboard: true,
      camera: true,
      geolocation: true,
      notification: false,
      fileSystem: false,
      clipboard: false,
      vibration: true,
      orientation: true
    }

    // 根据不同平台调整能力
    switch (this.platform) {
      case 'wechat':
        return {
          ...baseCapabilities,
          notification: true,
          clipboard: true
        }
      case 'alipay':
        return {
          ...baseCapabilities,
          notification: true
        }
      default:
        return baseCapabilities
    }
  }

  /**
   * 适配小程序组件
   */
  adaptComponent(component: any, options?: any): any {
    // 将 Element Plus 组件转换为小程序组件
    return {
      ...component,
      // 小程序特定的属性
      props: {
        ...component.props,
        // 小程序组件通常需要更大的触摸目标
        size: 'large'
      },
      // 小程序事件处理
      events: this.adaptEvents(component.events || {}),
      // 小程序样式
      style: this.adaptStyle(component.style || {})
    }
  }

  /**
   * 适配小程序样式
   */
  adaptStyle(style: any, options?: any): any {
    return {
      ...style,
      // 小程序不支持的样式属性需要移除或替换
      boxShadow: undefined, // 小程序不支持 box-shadow
      // 使用 rpx 单位
      fontSize: this.convertToRpx(style.fontSize),
      padding: this.convertToRpx(style.padding),
      margin: this.convertToRpx(style.margin),
      width: this.convertToRpx(style.width),
      height: this.convertToRpx(style.height)
    }
  }

  /**
   * 设置小程序主题
   */
  private setupMiniProgramTheme(theme: PlatformConfig['theme']): void {
    // 小程序主题设置通常在 app.json 中配置
    const themeConfig = {
      navigationBarBackgroundColor: theme.primaryColor,
      navigationBarTextStyle: theme.darkMode ? 'white' : 'black'
    }
    
    // 这里只是示例，实际需要通过小程序 API 设置
    console.log('Mini program theme config:', themeConfig)
  }

  /**
   * 设置导航栏
   */
  private setupNavigationBar(config: PlatformConfig): void {
    if (this.platform === 'wechat' && typeof wx !== 'undefined') {
      wx.setNavigationBarColor({
        frontColor: config.theme.darkMode ? '#ffffff' : '#000000',
        backgroundColor: config.theme.primaryColor
      })
    }
  }

  /**
   * 设置页面配置
   */
  private setupPageConfig(config: PlatformConfig): void {
    // 小程序页面配置
    const pageConfig = {
      enablePullDownRefresh: true,
      onReachBottomDistance: 50,
      backgroundTextStyle: config.theme.darkMode ? 'dark' : 'light'
    }
    
    console.log('Mini program page config:', pageConfig)
  }

  /**
   * 适配事件
   */
  private adaptEvents(events: Record<string, Function>): Record<string, Function> {
    const adaptedEvents: Record<string, Function> = {}
    
    Object.entries(events).forEach(([eventName, handler]) => {
      // 将 Web 事件名转换为小程序事件名
      const miniProgramEventName = this.convertEventName(eventName)
      adaptedEvents[miniProgramEventName] = handler
    })
    
    return adaptedEvents
  }

  /**
   * 转换事件名
   */
  private convertEventName(eventName: string): string {
    const eventMap: Record<string, string> = {
      'click': 'tap',
      'mouseenter': 'touchstart',
      'mouseleave': 'touchend',
      'input': 'input',
      'change': 'change'
    }
    
    return eventMap[eventName] || eventName
  }

  /**
   * 转换为 rpx 单位
   */
  private convertToRpx(value?: string): string | undefined {
    if (!value) return undefined
    
    // 如果已经是 rpx 单位，直接返回
    if (value.includes('rpx')) return value
    
    // 将 px 转换为 rpx (假设设计稿宽度为 750px)
    const pxValue = parseInt(value)
    if (isNaN(pxValue)) return value
    
    return `${pxValue * 2}rpx`
  }

  /**
   * 获取小程序平台信息
   */
  getPlatformInfo(): any {
    switch (this.platform) {
      case 'wechat':
        return typeof wx !== 'undefined' ? wx.getSystemInfoSync() : null
      case 'alipay':
        return typeof my !== 'undefined' ? my.getSystemInfoSync() : null
      case 'baidu':
        return typeof swan !== 'undefined' ? swan.getSystemInfoSync() : null
      case 'toutiao':
        return typeof tt !== 'undefined' ? tt.getSystemInfoSync() : null
      default:
        return null
    }
  }
}
```

### 3.2 小程序组件转换器

```typescript
// packages/mini-program/src/component-converter.ts

export interface MiniProgramComponent {
  template: string
  script: string
  style: string
  config: any
}

export class ComponentConverter {
  /**
   * 将 Vue 组件转换为小程序组件
   */
  convertToMiniProgram(vueComponent: any, platform: 'wechat' | 'alipay' | 'baidu' | 'toutiao'): MiniProgramComponent {
    const template = this.convertTemplate(vueComponent.template, platform)
    const script = this.convertScript(vueComponent.script, platform)
    const style = this.convertStyle(vueComponent.style, platform)
    const config = this.generateConfig(vueComponent, platform)
    
    return {
      template,
      script,
      style,
      config
    }
  }

  /**
   * 转换模板
   */
  private convertTemplate(template: string, platform: string): string {
    let converted = template
    
    // 转换指令
    converted = converted.replace(/v-if="([^"]+)"/g, 'wx:if="{{$1}}"')
    converted = converted.replace(/v-for="([^"]+) in ([^"]+)"/g, 'wx:for="{{$2}}" wx:for-item="$1"')
    converted = converted.replace(/v-show="([^"]+)"/g, 'hidden="{{!($1)}}"')
    
    // 转换事件
    converted = converted.replace(/@click="([^"]+)"/g, 'bindtap="$1"')
    converted = converted.replace(/@input="([^"]+)"/g, 'bindinput="$1"')
    converted = converted.replace(/@change="([^"]+)"/g, 'bindchange="$1"')
    
    // 转换插值
    converted = converted.replace(/{{\s*([^}]+)\s*}}/g, '{{$1}}')
    
    // 转换组件名
    converted = this.convertComponentNames(converted, platform)
    
    return converted
  }

  /**
   * 转换脚本
   */
  private convertScript(script: string, platform: string): string {
    // 这里需要将 Vue 的 Composition API 转换为小程序的 Page/Component 语法
    // 这是一个复杂的转换过程，这里只是示例
    
    let converted = `
Component({
  properties: {
    // 组件属性
  },
  
  data: {
    // 组件数据
  },
  
  methods: {
    // 组件方法
  },
  
  lifetimes: {
    attached() {
      // 组件生命周期
    }
  }
})
`
    
    return converted
  }

  /**
   * 转换样式
   */
  private convertStyle(style: string, platform: string): string {
    let converted = style
    
    // 移除不支持的 CSS 属性
    converted = converted.replace(/box-shadow:[^;]+;/g, '')
    converted = converted.replace(/filter:[^;]+;/g, '')
    
    // 转换单位
    converted = converted.replace(/(\d+)px/g, (match, num) => {
      return `${parseInt(num) * 2}rpx`
    })
    
    return converted
  }

  /**
   * 生成配置
   */
  private generateConfig(vueComponent: any, platform: string): any {
    const config: any = {
      component: true
    }
    
    // 根据平台添加特定配置
    switch (platform) {
      case 'wechat':
        config.styleIsolation = 'isolated'
        break
      case 'alipay':
        config.styleIsolation = 'apply-shared'
        break
    }
    
    return config
  }

  /**
   * 转换组件名
   */
  private convertComponentNames(template: string, platform: string): string {
    const componentMap: Record<string, string> = {
      'el-button': 'button',
      'el-input': 'input',
      'el-image': 'image',
      'el-text': 'text'
    }
    
    let converted = template
    Object.entries(componentMap).forEach(([vueComponent, miniComponent]) => {
      const regex = new RegExp(`<${vueComponent}`, 'g')
      converted = converted.replace(regex, `<${miniComponent}`)
      
      const closeRegex = new RegExp(`</${vueComponent}>`, 'g')
      converted = converted.replace(closeRegex, `</${miniComponent}>`)
    })
    
    return converted
  }
}
```

## 4. 实践练习

### 练习1：平台检测
```typescript
// 实现平台检测和适配
// 1. 创建平台检测器
// 2. 实现自动适配逻辑
// 3. 添加平台特性检测
// 4. 实现优雅降级
```

### 练习2：移动端优化
```vue
<!-- 实现移动端优化 -->
<!-- 1. 响应式布局设计 -->
<!-- 2. 触摸交互优化 -->
<!-- 3. 性能优化策略 -->
<!-- 4. 移动端特效实现 -->
```

### 练习3：桌面应用
```typescript
// 开发桌面应用
// 1. Electron 应用搭建
// 2. 原生功能集成
// 3. 菜单和快捷键
// 4. 文件系统操作
```

### 练习4：小程序开发
```typescript
// 小程序开发实践
// 1. 组件转换实现
// 2. API 适配层开发
// 3. 样式兼容处理
// 4. 性能优化策略
```

## 学习资源

### 跨平台开发
- [Electron 官方文档](https://www.electronjs.org/docs)
- [Tauri 官方文档](https://tauri.app/)
- [Capacitor 官方文档](https://capacitorjs.com/)

### 移动端开发
- [移动端适配指南](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Mobile)
- [PWA 开发指南](https://web.dev/progressive-web-apps/)
- [响应式设计原则](https://web.dev/responsive-web-design-basics/)

### 小程序开发
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/)
- [支付宝小程序文档](https://opendocs.alipay.com/mini)
- [百度小程序文档](https://smartprogram.baidu.com/docs/)

## 作业

1. **平台适配器**：实现完整的平台检测和适配系统
2. **移动端应用**：开发一个移动端优化的 Element Plus 应用
3. **桌面应用**：使用 Electron 创建一个桌面应用
4. **小程序应用**：将 Element Plus 组件转换为小程序组件
5. **跨平台组件**：设计一套跨平台的组件库

## 下一步学习

明天我们将学习「Element Plus 社区贡献与开源实践」，包括：
- 开源项目贡献流程
- 代码规范和质量保证
- 文档编写和维护
- 社区建设和管理
- 版本发布和维护

## 总结

今天我们深入学习了 Element Plus 的跨平台开发实践：

1. **跨平台架构**：设计了完整的平台管理和适配系统
2. **移动端适配**：实现了移动端的触摸优化和响应式设计
3. **桌面应用开发**：学习了 Electron 集成和原生功能调用
4. **小程序开发**：掌握了小程序适配和组件转换技术
5. **平台特性适配**：了解了不同平台的能力和限制

通过这些学习，你现在能够：
- 设计跨平台的应用架构
- 实现移动端的优化和适配
- 开发 Electron 桌面应用
- 适配小程序平台
- 处理平台差异和兼容性问题