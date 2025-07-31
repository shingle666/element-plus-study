# 第71天：Element Plus 高级主题定制与设计系统

## 学习目标

* 深入理解 Element Plus 主题系统的底层实现
* 掌握高级主题定制技巧和设计令牌系统
* 学习构建企业级设计系统的方法
* 了解主题动态切换和多主题管理

## 知识点概览

### 1. 设计令牌系统

#### 1.1 设计令牌架构

```typescript
// 设计令牌类型定义
interface DesignTokens {
  // 颜色令牌
  colors: {
    // 基础色彩
    primitive: {
      blue: Record<string, string>
      green: Record<string, string>
      red: Record<string, string>
      orange: Record<string, string>
      gray: Record<string, string>
    }
    
    // 语义化色彩
    semantic: {
      primary: string
      success: string
      warning: string
      danger: string
      info: string
    }
    
    // 功能性色彩
    functional: {
      text: {
        primary: string
        secondary: string
        disabled: string
        inverse: string
      }
      background: {
        primary: string
        secondary: string
        tertiary: string
        overlay: string
      }
      border: {
        primary: string
        secondary: string
        focus: string
        error: string
      }
    }
  }
  
  // 尺寸令牌
  sizing: {
    // 间距
    spacing: Record<string, string>
    // 圆角
    radius: Record<string, string>
    // 边框宽度
    borderWidth: Record<string, string>
    // 阴影
    shadow: Record<string, string>
  }
  
  // 字体令牌
  typography: {
    fontFamily: Record<string, string>
    fontSize: Record<string, string>
    fontWeight: Record<string, string>
    lineHeight: Record<string, string>
    letterSpacing: Record<string, string>
  }
  
  // 动画令牌
  motion: {
    duration: Record<string, string>
    easing: Record<string, string>
    transition: Record<string, string>
  }
  
  // 层级令牌
  elevation: {
    zIndex: Record<string, number>
    shadow: Record<string, string>
  }
}

// 设计令牌管理器
class DesignTokenManager {
  private tokens: DesignTokens
  private customTokens: Partial<DesignTokens> = {}
  
  constructor(baseTokens: DesignTokens) {
    this.tokens = baseTokens
  }
  
  // 获取令牌值
  getToken(path: string): any {
    const keys = path.split('.')
    let value: any = { ...this.tokens, ...this.customTokens }
    
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) {
        console.warn(`Token not found: ${path}`)
        return undefined
      }
    }
    
    return value
  }
  
  // 设置自定义令牌
  setCustomTokens(customTokens: Partial<DesignTokens>): void {
    this.customTokens = { ...this.customTokens, ...customTokens }
    this.updateCSSVariables()
  }
  
  // 更新 CSS 变量
  private updateCSSVariables(): void {
    const root = document.documentElement
    const flatTokens = this.flattenTokens({ ...this.tokens, ...this.customTokens })
    
    Object.entries(flatTokens).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, String(value))
    })
  }
  
  // 扁平化令牌对象
  private flattenTokens(obj: any, prefix = ''): Record<string, any> {
    const flattened: Record<string, any> = {}
    
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}-${key}` : key
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenTokens(value, newKey))
      } else {
        flattened[newKey] = value
      }
    })
    
    return flattened
  }
  
  // 生成 CSS 变量
  generateCSSVariables(): string {
    const flatTokens = this.flattenTokens({ ...this.tokens, ...this.customTokens })
    
    return Object.entries(flatTokens)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n')
  }
  
  // 导出令牌为 JSON
  exportTokens(): string {
    return JSON.stringify({ ...this.tokens, ...this.customTokens }, null, 2)
  }
  
  // 从 JSON 导入令牌
  importTokens(tokensJson: string): void {
    try {
      const importedTokens = JSON.parse(tokensJson)
      this.setCustomTokens(importedTokens)
    } catch (error) {
      console.error('Failed to import tokens:', error)
    }
  }
}

// 默认设计令牌
const defaultTokens: DesignTokens = {
  colors: {
    primitive: {
      blue: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12'
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
      }
    },
    semantic: {
      primary: 'var(--colors-primitive-blue-500)',
      success: 'var(--colors-primitive-green-500)',
      warning: 'var(--colors-primitive-orange-500)',
      danger: 'var(--colors-primitive-red-500)',
      info: 'var(--colors-primitive-gray-500)'
    },
    functional: {
      text: {
        primary: 'var(--colors-primitive-gray-900)',
        secondary: 'var(--colors-primitive-gray-600)',
        disabled: 'var(--colors-primitive-gray-400)',
        inverse: 'var(--colors-primitive-gray-50)'
      },
      background: {
        primary: '#ffffff',
        secondary: 'var(--colors-primitive-gray-50)',
        tertiary: 'var(--colors-primitive-gray-100)',
        overlay: 'rgba(0, 0, 0, 0.5)'
      },
      border: {
        primary: 'var(--colors-primitive-gray-200)',
        secondary: 'var(--colors-primitive-gray-300)',
        focus: 'var(--colors-semantic-primary)',
        error: 'var(--colors-semantic-danger)'
      }
    }
  },
  sizing: {
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem'
    },
    radius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    borderWidth: {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px'
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
    }
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  motion: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms'
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    transition: {
      all: 'all var(--motion-duration-normal) var(--motion-easing-ease-in-out)',
      colors: 'color var(--motion-duration-fast) var(--motion-easing-ease-in-out), background-color var(--motion-duration-fast) var(--motion-easing-ease-in-out), border-color var(--motion-duration-fast) var(--motion-easing-ease-in-out)',
      opacity: 'opacity var(--motion-duration-fast) var(--motion-easing-ease-in-out)',
      transform: 'transform var(--motion-duration-normal) var(--motion-easing-ease-in-out)'
    }
  },
  elevation: {
    zIndex: {
      hide: -1,
      auto: 0,
      base: 1,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800
    },
    shadow: {
      none: 'none',
      sm: 'var(--sizing-shadow-sm)',
      base: 'var(--sizing-shadow-base)',
      md: 'var(--sizing-shadow-md)',
      lg: 'var(--sizing-shadow-lg)',
      xl: 'var(--sizing-shadow-xl)',
      '2xl': 'var(--sizing-shadow-2xl)'
    }
  }
}
```

#### 1.2 主题生成器

```typescript
// 主题生成器
class ThemeGenerator {
  private tokenManager: DesignTokenManager
  
  constructor(tokenManager: DesignTokenManager) {
    this.tokenManager = tokenManager
  }
  
  // 生成基于品牌色的主题
  generateBrandTheme(brandColor: string): Partial<DesignTokens> {
    const colorPalette = this.generateColorPalette(brandColor)
    
    return {
      colors: {
        primitive: {
          brand: colorPalette
        },
        semantic: {
          primary: colorPalette[500]
        }
      }
    }
  }
  
  // 生成颜色调色板
  private generateColorPalette(baseColor: string): Record<string, string> {
    const hsl = this.hexToHsl(baseColor)
    const palette: Record<string, string> = {}
    
    // 生成不同明度的颜色
    const lightnesses = {
      50: 95,
      100: 90,
      200: 80,
      300: 70,
      400: 60,
      500: hsl.l, // 基础色
      600: 40,
      700: 30,
      800: 20,
      900: 10
    }
    
    Object.entries(lightnesses).forEach(([key, lightness]) => {
      palette[key] = this.hslToHex({
        h: hsl.h,
        s: hsl.s,
        l: lightness
      })
    })
    
    return palette
  }
  
  // 生成暗色主题
  generateDarkTheme(): Partial<DesignTokens> {
    return {
      colors: {
        functional: {
          text: {
            primary: 'var(--colors-primitive-gray-50)',
            secondary: 'var(--colors-primitive-gray-300)',
            disabled: 'var(--colors-primitive-gray-500)',
            inverse: 'var(--colors-primitive-gray-900)'
          },
          background: {
            primary: 'var(--colors-primitive-gray-900)',
            secondary: 'var(--colors-primitive-gray-800)',
            tertiary: 'var(--colors-primitive-gray-700)',
            overlay: 'rgba(255, 255, 255, 0.1)'
          },
          border: {
            primary: 'var(--colors-primitive-gray-700)',
            secondary: 'var(--colors-primitive-gray-600)',
            focus: 'var(--colors-semantic-primary)',
            error: 'var(--colors-semantic-danger)'
          }
        }
      }
    }
  }
  
  // 生成高对比度主题
  generateHighContrastTheme(): Partial<DesignTokens> {
    return {
      colors: {
        functional: {
          text: {
            primary: '#000000',
            secondary: '#000000',
            disabled: '#666666',
            inverse: '#ffffff'
          },
          background: {
            primary: '#ffffff',
            secondary: '#f0f0f0',
            tertiary: '#e0e0e0',
            overlay: 'rgba(0, 0, 0, 0.8)'
          },
          border: {
            primary: '#000000',
            secondary: '#333333',
            focus: '#0066cc',
            error: '#cc0000'
          }
        }
      },
      sizing: {
        borderWidth: {
          1: '2px',
          2: '3px'
        }
      }
    }
  }
  
  // 颜色转换工具
  private hexToHsl(hex: string): { h: number, s: number, l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }
  
  private hslToHex({ h, s, l }: { h: number, s: number, l: number }): string {
    h /= 360
    s /= 100
    l /= 100
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }
}
```

### 2. 动态主题切换

#### 2.1 主题管理器

```typescript
// 主题管理器
class ThemeManager {
  private currentTheme: string = 'default'
  private themes: Map<string, Partial<DesignTokens>> = new Map()
  private tokenManager: DesignTokenManager
  private themeGenerator: ThemeGenerator
  private observers: Set<(theme: string) => void> = new Set()
  
  constructor(tokenManager: DesignTokenManager) {
    this.tokenManager = tokenManager
    this.themeGenerator = new ThemeGenerator(tokenManager)
    this.initializeDefaultThemes()
    this.loadSavedTheme()
  }
  
  // 初始化默认主题
  private initializeDefaultThemes(): void {
    // 默认主题
    this.themes.set('default', {})
    
    // 暗色主题
    this.themes.set('dark', this.themeGenerator.generateDarkTheme())
    
    // 高对比度主题
    this.themes.set('high-contrast', this.themeGenerator.generateHighContrastTheme())
  }
  
  // 注册主题
  registerTheme(name: string, theme: Partial<DesignTokens>): void {
    this.themes.set(name, theme)
  }
  
  // 应用主题
  applyTheme(themeName: string): void {
    const theme = this.themes.get(themeName)
    if (!theme) {
      console.warn(`Theme '${themeName}' not found`)
      return
    }
    
    this.currentTheme = themeName
    this.tokenManager.setCustomTokens(theme)
    
    // 更新 HTML 属性
    document.documentElement.setAttribute('data-theme', themeName)
    
    // 保存到本地存储
    localStorage.setItem('preferred-theme', themeName)
    
    // 通知观察者
    this.observers.forEach(observer => observer(themeName))
  }
  
  // 获取当前主题
  getCurrentTheme(): string {
    return this.currentTheme
  }
  
  // 获取所有主题
  getAvailableThemes(): string[] {
    return Array.from(this.themes.keys())
  }
  
  // 切换主题
  toggleTheme(): void {
    const themes = this.getAvailableThemes()
    const currentIndex = themes.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    this.applyTheme(themes[nextIndex])
  }
  
  // 根据系统偏好自动切换主题
  enableAutoTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateTheme = () => {
      const preferredTheme = mediaQuery.matches ? 'dark' : 'default'
      this.applyTheme(preferredTheme)
    }
    
    // 初始设置
    updateTheme()
    
    // 监听变化
    mediaQuery.addEventListener('change', updateTheme)
  }
  
  // 加载保存的主题
  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('preferred-theme')
    if (savedTheme && this.themes.has(savedTheme)) {
      this.applyTheme(savedTheme)
    }
  }
  
  // 添加主题变化观察者
  addThemeObserver(observer: (theme: string) => void): void {
    this.observers.add(observer)
  }
  
  // 移除主题变化观察者
  removeThemeObserver(observer: (theme: string) => void): void {
    this.observers.delete(observer)
  }
  
  // 创建品牌主题
  createBrandTheme(name: string, brandColor: string): void {
    const brandTheme = this.themeGenerator.generateBrandTheme(brandColor)
    this.registerTheme(name, brandTheme)
  }
  
  // 导出主题配置
  exportTheme(themeName: string): string | null {
    const theme = this.themes.get(themeName)
    if (!theme) {
      return null
    }
    
    return JSON.stringify({
      name: themeName,
      tokens: theme
    }, null, 2)
  }
  
  // 导入主题配置
  importTheme(themeConfig: string): boolean {
    try {
      const { name, tokens } = JSON.parse(themeConfig)
      this.registerTheme(name, tokens)
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }
}
```

#### 2.2 主题切换组件

```vue
<!-- ThemeSelector.vue -->
<template>
  <div class="theme-selector">
    <!-- 主题选择器 -->
    <el-select
      v-model="currentTheme"
      placeholder="选择主题"
      @change="handleThemeChange"
      class="theme-select"
    >
      <el-option
        v-for="theme in availableThemes"
        :key="theme.value"
        :label="theme.label"
        :value="theme.value"
      >
        <div class="theme-option">
          <div class="theme-preview" :style="getThemePreviewStyle(theme.value)"></div>
          <span class="theme-name">{{ theme.label }}</span>
        </div>
      </el-option>
    </el-select>
    
    <!-- 快速切换按钮 -->
    <el-button-group class="theme-toggle-group">
      <el-button
        :type="currentTheme === 'default' ? 'primary' : 'default'"
        @click="applyTheme('default')"
        :icon="Sunny"
        size="small"
      />
      <el-button
        :type="currentTheme === 'dark' ? 'primary' : 'default'"
        @click="applyTheme('dark')"
        :icon="Moon"
        size="small"
      />
      <el-button
        :type="currentTheme === 'high-contrast' ? 'primary' : 'default'"
        @click="applyTheme('high-contrast')"
        :icon="View"
        size="small"
      />
    </el-button-group>
    
    <!-- 自动主题开关 -->
    <el-switch
      v-model="autoTheme"
      @change="handleAutoThemeChange"
      active-text="自动主题"
      inactive-text="手动主题"
      class="auto-theme-switch"
    />
    
    <!-- 主题编辑器 -->
    <el-button
      @click="showThemeEditor = true"
      :icon="Setting"
      size="small"
      text
    >
      自定义主题
    </el-button>
    
    <!-- 主题编辑对话框 -->
    <el-dialog
      v-model="showThemeEditor"
      title="主题编辑器"
      width="80%"
      :before-close="handleEditorClose"
    >
      <ThemeEditor
        :current-theme="currentTheme"
        @theme-updated="handleThemeUpdated"
        @theme-created="handleThemeCreated"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Sunny, Moon, View, Setting } from '@element-plus/icons-vue'
import { useThemeManager } from '@/composables/useTheme'
import ThemeEditor from './ThemeEditor.vue'

// 主题管理
const { themeManager, currentTheme: managedTheme } = useThemeManager()

// 响应式数据
const currentTheme = ref(managedTheme.value)
const autoTheme = ref(false)
const showThemeEditor = ref(false)

// 可用主题
const availableThemes = computed(() => {
  const themes = themeManager.getAvailableThemes()
  return themes.map(theme => ({
    value: theme,
    label: getThemeLabel(theme)
  }))
})

// 获取主题标签
function getThemeLabel(theme: string): string {
  const labels: Record<string, string> = {
    default: '默认主题',
    dark: '暗色主题',
    'high-contrast': '高对比度',
    brand: '品牌主题'
  }
  return labels[theme] || theme
}

// 获取主题预览样式
function getThemePreviewStyle(theme: string): Record<string, string> {
  const styles: Record<string, Record<string, string>> = {
    default: {
      background: 'linear-gradient(45deg, #409eff 0%, #67c23a 100%)'
    },
    dark: {
      background: 'linear-gradient(45deg, #2c3e50 0%, #34495e 100%)'
    },
    'high-contrast': {
      background: 'linear-gradient(45deg, #000000 0%, #ffffff 100%)'
    }
  }
  
  return styles[theme] || {
    background: 'linear-gradient(45deg, #409eff 0%, #67c23a 100%)'
  }
}

// 应用主题
function applyTheme(theme: string): void {
  themeManager.applyTheme(theme)
  currentTheme.value = theme
}

// 处理主题变化
function handleThemeChange(theme: string): void {
  applyTheme(theme)
}

// 处理自动主题变化
function handleAutoThemeChange(enabled: boolean): void {
  if (enabled) {
    themeManager.enableAutoTheme()
  }
}

// 处理编辑器关闭
function handleEditorClose(): void {
  showThemeEditor.value = false
}

// 处理主题更新
function handleThemeUpdated(themeName: string): void {
  // 重新应用主题以更新样式
  applyTheme(themeName)
}

// 处理主题创建
function handleThemeCreated(themeName: string): void {
  // 应用新创建的主题
  applyTheme(themeName)
  showThemeEditor.value = false
}

// 监听主题变化
onMounted(() => {
  themeManager.addThemeObserver((theme) => {
    currentTheme.value = theme
  })
})
</script>

<style lang="scss" scoped>
.theme-selector {
  display: flex;
  align-items: center;
  gap: var(--sizing-spacing-4);
  
  .theme-select {
    width: 150px;
  }
  
  .theme-option {
    display: flex;
    align-items: center;
    gap: var(--sizing-spacing-2);
    
    .theme-preview {
      width: 20px;
      height: 20px;
      border-radius: var(--sizing-radius-base);
      border: 1px solid var(--colors-functional-border-primary);
    }
  }
  
  .theme-toggle-group {
    .el-button {
      padding: var(--sizing-spacing-2);
    }
  }
  
  .auto-theme-switch {
    :deep(.el-switch__label) {
      font-size: var(--typography-fontSize-sm);
    }
  }
}
</style>
```

### 3. 可视化主题编辑器

#### 3.1 主题编辑器组件

```vue
<!-- ThemeEditor.vue -->
<template>
  <div class="theme-editor">
    <div class="editor-layout">
      <!-- 左侧编辑面板 -->
      <div class="editor-panel">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- 颜色编辑 -->
          <el-tab-pane label="颜色" name="colors">
            <div class="color-editor">
              <div class="color-section">
                <h4>语义化颜色</h4>
                <div class="color-grid">
                  <div
                    v-for="(color, key) in semanticColors"
                    :key="key"
                    class="color-item"
                  >
                    <label>{{ getColorLabel(key) }}</label>
                    <el-color-picker
                      v-model="semanticColors[key]"
                      @change="updateSemanticColor(key, $event)"
                      show-alpha
                    />
                  </div>
                </div>
              </div>
              
              <div class="color-section">
                <h4>功能性颜色</h4>
                <div class="color-subsection">
                  <h5>文本颜色</h5>
                  <div class="color-grid">
                    <div
                      v-for="(color, key) in functionalColors.text"
                      :key="key"
                      class="color-item"
                    >
                      <label>{{ getColorLabel(key) }}</label>
                      <el-color-picker
                        v-model="functionalColors.text[key]"
                        @change="updateFunctionalColor('text', key, $event)"
                        show-alpha
                      />
                    </div>
                  </div>
                </div>
                
                <div class="color-subsection">
                  <h5>背景颜色</h5>
                  <div class="color-grid">
                    <div
                      v-for="(color, key) in functionalColors.background"
                      :key="key"
                      class="color-item"
                    >
                      <label>{{ getColorLabel(key) }}</label>
                      <el-color-picker
                        v-model="functionalColors.background[key]"
                        @change="updateFunctionalColor('background', key, $event)"
                        show-alpha
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 尺寸编辑 -->
          <el-tab-pane label="尺寸" name="sizing">
            <div class="sizing-editor">
              <div class="sizing-section">
                <h4>间距</h4>
                <div class="sizing-grid">
                  <div
                    v-for="(size, key) in spacing"
                    :key="key"
                    class="sizing-item"
                  >
                    <label>{{ key }}</label>
                    <el-input
                      v-model="spacing[key]"
                      @change="updateSpacing(key, $event)"
                      size="small"
                    />
                  </div>
                </div>
              </div>
              
              <div class="sizing-section">
                <h4>圆角</h4>
                <div class="sizing-grid">
                  <div
                    v-for="(radius, key) in borderRadius"
                    :key="key"
                    class="sizing-item"
                  >
                    <label>{{ key }}</label>
                    <el-input
                      v-model="borderRadius[key]"
                      @change="updateBorderRadius(key, $event)"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 字体编辑 -->
          <el-tab-pane label="字体" name="typography">
            <div class="typography-editor">
              <div class="typography-section">
                <h4>字体大小</h4>
                <div class="typography-grid">
                  <div
                    v-for="(size, key) in fontSize"
                    :key="key"
                    class="typography-item"
                  >
                    <label>{{ key }}</label>
                    <el-input
                      v-model="fontSize[key]"
                      @change="updateFontSize(key, $event)"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <!-- 导入导出 -->
          <el-tab-pane label="导入导出" name="import-export">
            <div class="import-export">
              <div class="section">
                <h4>导出主题</h4>
                <el-button @click="exportTheme" type="primary">
                  导出当前主题
                </el-button>
              </div>
              
              <div class="section">
                <h4>导入主题</h4>
                <el-upload
                  :before-upload="importTheme"
                  :show-file-list="false"
                  accept=".json"
                >
                  <el-button>选择主题文件</el-button>
                </el-upload>
              </div>
              
              <div class="section">
                <h4>重置主题</h4>
                <el-button @click="resetTheme" type="danger">
                  重置为默认主题
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 右侧预览面板 -->
      <div class="preview-panel">
        <div class="preview-header">
          <h3>主题预览</h3>
          <el-button @click="saveTheme" type="primary" size="small">
            保存主题
          </el-button>
        </div>
        
        <div class="preview-content">
          <ThemePreview :theme-tokens="currentThemeTokens" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useThemeManager } from '@/composables/useTheme'
import ThemePreview from './ThemePreview.vue'
import type { DesignTokens } from '@/types/theme'

interface Props {
  currentTheme: string
}

interface Emits {
  (e: 'theme-updated', themeName: string): void
  (e: 'theme-created', themeName: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 主题管理
const { themeManager, tokenManager } = useThemeManager()

// 响应式数据
const activeTab = ref('colors')

// 颜色编辑
const semanticColors = reactive({
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399'
})

const functionalColors = reactive({
  text: {
    primary: '#303133',
    secondary: '#606266',
    disabled: '#c0c4cc',
    inverse: '#ffffff'
  },
  background: {
    primary: '#ffffff',
    secondary: '#f5f7fa',
    tertiary: '#ebeef5',
    overlay: 'rgba(0, 0, 0, 0.5)'
  }
})

// 尺寸编辑
const spacing = reactive({
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px'
})

const borderRadius = reactive({
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px'
})

// 字体编辑
const fontSize = reactive({
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px'
})

// 当前主题令牌
const currentThemeTokens = computed(() => {
  return {
    colors: {
      semantic: semanticColors,
      functional: functionalColors
    },
    sizing: {
      spacing,
      radius: borderRadius
    },
    typography: {
      fontSize
    }
  }
})

// 获取颜色标签
function getColorLabel(key: string): string {
  const labels: Record<string, string> = {
    primary: '主要',
    success: '成功',
    warning: '警告',
    danger: '危险',
    info: '信息',
    secondary: '次要',
    disabled: '禁用',
    inverse: '反色',
    tertiary: '第三级',
    overlay: '遮罩'
  }
  return labels[key] || key
}

// 更新语义化颜色
function updateSemanticColor(key: string, color: string): void {
  semanticColors[key] = color
  applyThemeChanges()
}

// 更新功能性颜色
function updateFunctionalColor(category: string, key: string, color: string): void {
  functionalColors[category][key] = color
  applyThemeChanges()
}

// 更新间距
function updateSpacing(key: string, value: string): void {
  spacing[key] = value
  applyThemeChanges()
}

// 更新圆角
function updateBorderRadius(key: string, value: string): void {
  borderRadius[key] = value
  applyThemeChanges()
}

// 更新字体大小
function updateFontSize(key: string, value: string): void {
  fontSize[key] = value
  applyThemeChanges()
}

// 应用主题变化
function applyThemeChanges(): void {
  const customTheme = {
    colors: {
      semantic: { ...semanticColors },
      functional: { ...functionalColors }
    },
    sizing: {
      spacing: { ...spacing },
      radius: { ...borderRadius }
    },
    typography: {
      fontSize: { ...fontSize }
    }
  }
  
  tokenManager.setCustomTokens(customTheme)
}

// 保存主题
function saveTheme(): void {
  const themeName = `custom-${Date.now()}`
  themeManager.registerTheme(themeName, currentThemeTokens.value)
  emit('theme-created', themeName)
  ElMessage.success('主题保存成功')
}

// 导出主题
function exportTheme(): void {
  const themeConfig = {
    name: `custom-theme-${Date.now()}`,
    tokens: currentThemeTokens.value
  }
  
  const blob = new Blob([JSON.stringify(themeConfig, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${themeConfig.name}.json`
  a.click()
  
  URL.revokeObjectURL(url)
  ElMessage.success('主题导出成功')
}

// 导入主题
function importTheme(file: File): boolean {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const themeConfig = JSON.parse(e.target?.result as string)
      
      if (themeConfig.tokens) {
        // 更新编辑器状态
        Object.assign(semanticColors, themeConfig.tokens.colors?.semantic || {})
        Object.assign(functionalColors, themeConfig.tokens.colors?.functional || {})
        Object.assign(spacing, themeConfig.tokens.sizing?.spacing || {})
        Object.assign(borderRadius, themeConfig.tokens.sizing?.radius || {})
        Object.assign(fontSize, themeConfig.tokens.typography?.fontSize || {})
        
        applyThemeChanges()
        ElMessage.success('主题导入成功')
      }
    } catch (error) {
      ElMessage.error('主题文件格式错误')
    }
  }
  
  reader.readAsText(file)
  return false // 阻止默认上传行为
}

// 重置主题
function resetTheme(): void {
  // 重置为默认值
  Object.assign(semanticColors, {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  })
  
  Object.assign(functionalColors.text, {
    primary: '#303133',
    secondary: '#606266',
    disabled: '#c0c4cc',
    inverse: '#ffffff'
  })
  
  Object.assign(functionalColors.background, {
    primary: '#ffffff',
    secondary: '#f5f7fa',
    tertiary: '#ebeef5',
    overlay: 'rgba(0, 0, 0, 0.5)'
  })
  
  applyThemeChanges()
  ElMessage.success('主题已重置')
}
</script>

<style lang="scss" scoped>
.theme-editor {
  height: 600px;
  
  .editor-layout {
    display: flex;
    height: 100%;
    gap: var(--sizing-spacing-4);
  }
  
  .editor-panel {
    flex: 1;
    
    .el-tabs {
      height: 100%;
      
      :deep(.el-tab-pane) {
        height: 500px;
        overflow-y: auto;
      }
    }
  }
  
  .preview-panel {
    flex: 1;
    border: 1px solid var(--colors-functional-border-primary);
    border-radius: var(--sizing-radius-md);
    
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--sizing-spacing-4);
      border-bottom: 1px solid var(--colors-functional-border-primary);
      
      h3 {
        margin: 0;
        font-size: var(--typography-fontSize-lg);
      }
    }
    
    .preview-content {
      padding: var(--sizing-spacing-4);
      height: calc(100% - 60px);
      overflow-y: auto;
    }
  }
  
  .color-editor,
  .sizing-editor,
  .typography-editor {
    padding: var(--sizing-spacing-4);
  }
  
  .color-section,
  .sizing-section,
  .typography-section {
    margin-bottom: var(--sizing-spacing-6);
    
    h4 {
      margin: 0 0 var(--sizing-spacing-4) 0;
      font-size: var(--typography-fontSize-base);
      font-weight: var(--typography-fontWeight-semibold);
    }
    
    h5 {
      margin: var(--sizing-spacing-4) 0 var(--sizing-spacing-2) 0;
      font-size: var(--typography-fontSize-sm);
      font-weight: var(--typography-fontWeight-medium);
    }
  }
  
  .color-grid,
  .sizing-grid,
  .typography-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--sizing-spacing-4);
  }
  
  .color-item,
  .sizing-item,
  .typography-item {
    display: flex;
    flex-direction: column;
    gap: var(--sizing-spacing-2);
    
    label {
      font-size: var(--typography-fontSize-sm);
      color: var(--colors-functional-text-secondary);
    }
  }
  
  .import-export {
    padding: var(--sizing-spacing-4);
    
    .section {
      margin-bottom: var(--sizing-spacing-6);
      
      h4 {
        margin: 0 0 var(--sizing-spacing-4) 0;
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-semibold);
      }
    }
  }
}
</style>
```

## 实践练习

### 练习 1：创建企业品牌主题

1. 基于公司品牌色创建自定义主题
2. 实现主题的动态切换功能
3. 添加主题预览和导出功能
4. 确保主题在所有组件中正确应用

### 练习 2：构建设计令牌系统

1. 设计完整的设计令牌架构
2. 实现令牌的层级管理
3. 创建令牌的可视化编辑器
4. 支持令牌的导入导出功能

### 练习 3：开发主题管理系统

1. 实现多主题的注册和管理
2. 支持主题的继承和覆盖
3. 添加主题的版本控制
4. 实现主题的热更新功能

## 学习资源

* [Design Tokens 规范](https://design-tokens.github.io/community-group/)
* [CSS 自定义属性](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
* [Element Plus 主题定制](https://element-plus.org/zh-CN/guide/theming.html)
* [设计系统最佳实践](https://designsystemsrepo.com/)

## 作业

1. 完成所有实践练习
2. 为你的项目创建完整的设计令牌系统
3. 实现可视化的主题编辑器
4. 编写主题系统的使用文档

## 下一步学习计划

接下来我们将学习 **Element Plus 微前端架构实践**，了解如何在微前端环境中使用 Element Plus，实现组件和主题的共享。