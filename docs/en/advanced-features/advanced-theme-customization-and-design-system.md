# Advanced Theme Customization and Design System

## Overview

This document explores Element Plus's advanced theme customization capabilities and design system architecture. We'll examine CSS custom properties, design tokens, theme switching, and building comprehensive design systems.

## Design System Architecture

### 1. Design Token Structure

Element Plus uses a hierarchical design token system for consistent theming.

```scss
// Core design tokens
:root {
  // Color palette
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
  
  // Semantic colors
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-error: #f56c6c;
  --el-color-info: #909399;
  
  // Text colors
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-text-color-disabled: #c0c4cc;
  
  // Border colors
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
  --el-border-color-dark: #d4d7de;
  --el-border-color-darker: #cdd0d6;
  
  // Background colors
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f2f3f5;
  --el-bg-color-overlay: #ffffff;
  
  // Typography
  --el-font-size-extra-large: 20px;
  --el-font-size-large: 18px;
  --el-font-size-medium: 16px;
  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-extra-small: 12px;
  
  --el-font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  --el-font-weight-primary: 500;
  
  // Spacing
  --el-spacing-xs: 4px;
  --el-spacing-sm: 8px;
  --el-spacing-md: 12px;
  --el-spacing-lg: 16px;
  --el-spacing-xl: 20px;
  --el-spacing-xxl: 24px;
  
  // Border radius
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  --el-border-radius-circle: 100%;
  
  // Shadows
  --el-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --el-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --el-box-shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --el-box-shadow-dark: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12);
  
  // Z-index
  --el-index-normal: 1;
  --el-index-top: 1000;
  --el-index-popper: 2000;
  
  // Transitions
  --el-transition-duration: 0.3s;
  --el-transition-duration-fast: 0.2s;
  --el-transition-function-ease-in-out-bezier: cubic-bezier(0.645, 0.045, 0.355, 1);
  --el-transition-function-fast-bezier: cubic-bezier(0.23, 1, 0.32, 1);
  --el-transition-all: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
  --el-transition-fade: opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);
  --el-transition-md-fade: transform var(--el-transition-duration) var(--el-transition-function-fast-bezier), opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);
  --el-transition-fade-linear: opacity var(--el-transition-duration-fast) linear;
  --el-transition-border: border-color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);
  --el-transition-box-shadow: box-shadow var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);
  --el-transition-color: color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);
}
```

### 2. Component-Specific Tokens

```scss
// Button component tokens
:root {
  --el-button-font-weight: var(--el-font-weight-primary);
  --el-button-border-color: var(--el-border-color);
  --el-button-bg-color: var(--el-bg-color);
  --el-button-text-color: var(--el-text-color-regular);
  --el-button-disabled-text-color: var(--el-text-color-disabled);
  --el-button-disabled-bg-color: var(--el-bg-color);
  --el-button-disabled-border-color: var(--el-border-color-light);
  --el-button-divide-border-color: rgba(255, 255, 255, 0.5);
  --el-button-hover-text-color: var(--el-color-primary);
  --el-button-hover-bg-color: var(--el-color-primary-light-9);
  --el-button-hover-border-color: var(--el-color-primary-light-7);
  --el-button-active-text-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
  --el-button-active-bg-color: var(--el-color-primary-light-9);
  --el-button-outline-color: var(--el-color-primary-light-5);
  --el-button-active-color: var(--el-text-color-primary);
}

// Form component tokens
:root {
  --el-form-label-font-size: var(--el-font-size-base);
  --el-form-inline-content-width: 220px;
}

// Input component tokens
:root {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: var(--el-border);
  --el-input-hover-border: var(--el-border-color-hover);
  --el-input-focus-border: var(--el-color-primary);
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: var(--el-border-color);
  --el-input-border-radius: var(--el-border-radius-base);
  --el-input-bg-color: var(--el-bg-color);
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: var(--el-border-color-hover);
  --el-input-clear-hover-color: var(--el-text-color-secondary);
  --el-input-focus-border-color: var(--el-color-primary);
}
```

## Advanced Theme System

### 1. Theme Manager Implementation

```typescript
// Advanced theme management system
import { reactive, computed, watch } from 'vue'

interface ThemeConfig {
  name: string
  colors: {
    primary: string
    success: string
    warning: string
    danger: string
    info: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      base: string
      small: string
      large: string
    }
    fontWeight: {
      normal: number
      medium: number
      bold: number
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    small: string
    base: string
    large: string
  }
  shadows: {
    base: string
    light: string
    dark: string
  }
  transitions: {
    duration: string
    easing: string
  }
}

class AdvancedThemeManager {
  private themes = new Map<string, ThemeConfig>()
  private state = reactive({
    currentTheme: 'default',
    customizations: {} as Record<string, any>,
    darkMode: false,
    highContrast: false,
    reducedMotion: false
  })
  
  constructor() {
    this.initializeDefaultThemes()
    this.setupMediaQueryListeners()
  }
  
  private initializeDefaultThemes() {
    // Default light theme
    this.registerTheme('default', {
      name: 'Default',
      colors: {
        primary: '#409eff',
        success: '#67c23a',
        warning: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399'
      },
      typography: {
        fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
        fontSize: {
          base: '14px',
          small: '12px',
          large: '16px'
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          bold: 600
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px'
      },
      borderRadius: {
        small: '2px',
        base: '4px',
        large: '8px'
      },
      shadows: {
        base: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
        dark: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12)'
      },
      transitions: {
        duration: '0.3s',
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
      }
    })
    
    // Dark theme
    this.registerTheme('dark', {
      name: 'Dark',
      colors: {
        primary: '#409eff',
        success: '#67c23a',
        warning: '#e6a23c',
        danger: '#f56c6c',
        info: '#909399'
      },
      typography: {
        fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
        fontSize: {
          base: '14px',
          small: '12px',
          large: '16px'
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          bold: 600
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px'
      },
      borderRadius: {
        small: '2px',
        base: '4px',
        large: '8px'
      },
      shadows: {
        base: '0 2px 4px rgba(0, 0, 0, 0.24), 0 0 6px rgba(0, 0, 0, 0.08)',
        light: '0 2px 12px 0 rgba(0, 0, 0, 0.2)',
        dark: '0 2px 4px rgba(0, 0, 0, 0.24), 0 0 6px rgba(0, 0, 0, 0.24)'
      },
      transitions: {
        duration: '0.3s',
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
      }
    })
  }
  
  private setupMediaQueryListeners() {
    // Dark mode detection
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeQuery.addEventListener('change', (e) => {
      this.state.darkMode = e.matches
    })
    this.state.darkMode = darkModeQuery.matches
    
    // High contrast detection
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')
    highContrastQuery.addEventListener('change', (e) => {
      this.state.highContrast = e.matches
    })
    this.state.highContrast = highContrastQuery.matches
    
    // Reduced motion detection
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionQuery.addEventListener('change', (e) => {
      this.state.reducedMotion = e.matches
    })
    this.state.reducedMotion = reducedMotionQuery.matches
  }
  
  registerTheme(name: string, config: ThemeConfig) {
    this.themes.set(name, config)
  }
  
  setTheme(name: string) {
    const theme = this.themes.get(name)
    if (!theme) {
      console.warn(`Theme ${name} not found`)
      return
    }
    
    this.state.currentTheme = name
    this.applyTheme(theme)
  }
  
  private applyTheme(theme: ThemeConfig) {
    const root = document.documentElement
    
    // Apply color tokens
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--el-color-${key}`, value)
      
      // Generate color variations
      if (key === 'primary') {
        this.generateColorVariations(root, value)
      }
    })
    
    // Apply typography tokens
    root.style.setProperty('--el-font-family', theme.typography.fontFamily)
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--el-font-size-${key}`, value)
    })
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--el-font-weight-${key}`, value.toString())
    })
    
    // Apply spacing tokens
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--el-spacing-${key}`, value)
    })
    
    // Apply border radius tokens
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--el-border-radius-${key}`, value)
    })
    
    // Apply shadow tokens
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--el-box-shadow-${key}`, value)
    })
    
    // Apply transition tokens
    root.style.setProperty('--el-transition-duration', theme.transitions.duration)
    root.style.setProperty('--el-transition-function-ease-in-out-bezier', theme.transitions.easing)
    
    // Apply accessibility preferences
    this.applyAccessibilityPreferences()
  }
  
  private generateColorVariations(root: HTMLElement, primaryColor: string) {
    // Generate light variations
    for (let i = 1; i <= 9; i++) {
      const lightColor = this.lightenColor(primaryColor, i * 10)
      root.style.setProperty(`--el-color-primary-light-${i}`, lightColor)
    }
    
    // Generate dark variations
    for (let i = 1; i <= 3; i++) {
      const darkColor = this.darkenColor(primaryColor, i * 10)
      root.style.setProperty(`--el-color-primary-dark-${i}`, darkColor)
    }
  }
  
  private lightenColor(color: string, percent: number): string {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Lighten
    const newR = Math.min(255, Math.round(r + (255 - r) * percent / 100))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent / 100))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent / 100))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  }
  
  private darkenColor(color: string, percent: number): string {
    // Convert hex to RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Darken
    const newR = Math.max(0, Math.round(r * (100 - percent) / 100))
    const newG = Math.max(0, Math.round(g * (100 - percent) / 100))
    const newB = Math.max(0, Math.round(b * (100 - percent) / 100))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
  }
  
  private applyAccessibilityPreferences() {
    const root = document.documentElement
    
    if (this.state.highContrast) {
      root.classList.add('el-high-contrast')
    } else {
      root.classList.remove('el-high-contrast')
    }
    
    if (this.state.reducedMotion) {
      root.style.setProperty('--el-transition-duration', '0s')
      root.style.setProperty('--el-transition-duration-fast', '0s')
    }
    
    if (this.state.darkMode && this.state.currentTheme === 'default') {
      this.setTheme('dark')
    }
  }
  
  customizeTheme(customizations: Record<string, any>) {
    this.state.customizations = { ...this.state.customizations, ...customizations }
    this.applyCustomizations()
  }
  
  private applyCustomizations() {
    const root = document.documentElement
    
    Object.entries(this.state.customizations).forEach(([key, value]) => {
      root.style.setProperty(`--el-${key}`, value)
    })
  }
  
  exportTheme(): string {
    const currentTheme = this.themes.get(this.state.currentTheme)
    if (!currentTheme) return ''
    
    return JSON.stringify({
      theme: currentTheme,
      customizations: this.state.customizations
    }, null, 2)
  }
  
  importTheme(themeData: string) {
    try {
      const { theme, customizations } = JSON.parse(themeData)
      
      if (theme) {
        this.registerTheme('imported', theme)
        this.setTheme('imported')
      }
      
      if (customizations) {
        this.customizeTheme(customizations)
      }
    } catch (error) {
      console.error('Failed to import theme:', error)
    }
  }
  
  // Getters
  get currentTheme() {
    return this.state.currentTheme
  }
  
  get availableThemes() {
    return Array.from(this.themes.keys())
  }
  
  get isDarkMode() {
    return this.state.darkMode
  }
  
  get isHighContrast() {
    return this.state.highContrast
  }
  
  get isReducedMotion() {
    return this.state.reducedMotion
  }
}

export const themeManager = new AdvancedThemeManager()
```

### 2. Theme Builder Component

```vue
<!-- ThemeBuilder.vue -->
<template>
  <div class="theme-builder">
    <el-card class="theme-builder__header">
      <template #header>
        <div class="theme-builder__title">
          <h2>Theme Builder</h2>
          <div class="theme-builder__actions">
            <el-button @click="resetTheme">Reset</el-button>
            <el-button @click="exportTheme">Export</el-button>
            <el-button type="primary" @click="saveTheme">Save</el-button>
          </div>
        </div>
      </template>
      
      <div class="theme-builder__presets">
        <h3>Presets</h3>
        <div class="preset-grid">
          <div
            v-for="theme in availableThemes"
            :key="theme"
            class="preset-item"
            :class="{ active: currentTheme === theme }"
            @click="setTheme(theme)"
          >
            <div class="preset-preview">
              <div class="preset-colors">
                <div
                  v-for="color in getThemeColors(theme)"
                  :key="color.name"
                  class="preset-color"
                  :style="{ backgroundColor: color.value }"
                />
              </div>
            </div>
            <span class="preset-name">{{ theme }}</span>
          </div>
        </div>
      </div>
    </el-card>
    
    <div class="theme-builder__content">
      <div class="theme-builder__sidebar">
        <el-tabs v-model="activeTab" tab-position="left">
          <el-tab-pane label="Colors" name="colors">
            <div class="color-section">
              <h4>Brand Colors</h4>
              <div class="color-group">
                <div
                  v-for="(color, key) in colors.brand"
                  :key="key"
                  class="color-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="color-input-group">
                    <el-color-picker
                      v-model="colors.brand[key]"
                      @change="updateColor('brand', key, $event)"
                    />
                    <el-input
                      v-model="colors.brand[key]"
                      size="small"
                      @input="updateColor('brand', key, $event)"
                    />
                  </div>
                </div>
              </div>
              
              <h4>Semantic Colors</h4>
              <div class="color-group">
                <div
                  v-for="(color, key) in colors.semantic"
                  :key="key"
                  class="color-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="color-input-group">
                    <el-color-picker
                      v-model="colors.semantic[key]"
                      @change="updateColor('semantic', key, $event)"
                    />
                    <el-input
                      v-model="colors.semantic[key]"
                      size="small"
                      @input="updateColor('semantic', key, $event)"
                    />
                  </div>
                </div>
              </div>
              
              <h4>Text Colors</h4>
              <div class="color-group">
                <div
                  v-for="(color, key) in colors.text"
                  :key="key"
                  class="color-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="color-input-group">
                    <el-color-picker
                      v-model="colors.text[key]"
                      @change="updateColor('text', key, $event)"
                    />
                    <el-input
                      v-model="colors.text[key]"
                      size="small"
                      @input="updateColor('text', key, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="Typography" name="typography">
            <div class="typography-section">
              <h4>Font Family</h4>
              <el-input
                v-model="typography.fontFamily"
                @input="updateTypography('fontFamily', $event)"
              />
              
              <h4>Font Sizes</h4>
              <div class="size-group">
                <div
                  v-for="(size, key) in typography.fontSize"
                  :key="key"
                  class="size-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <el-input-number
                    v-model="typography.fontSize[key]"
                    :min="8"
                    :max="48"
                    @change="updateTypography('fontSize', key, $event + 'px')"
                  />
                </div>
              </div>
              
              <h4>Font Weights</h4>
              <div class="weight-group">
                <div
                  v-for="(weight, key) in typography.fontWeight"
                  :key="key"
                  class="weight-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <el-select
                    v-model="typography.fontWeight[key]"
                    @change="updateTypography('fontWeight', key, $event)"
                  >
                    <el-option label="Light (300)" :value="300" />
                    <el-option label="Normal (400)" :value="400" />
                    <el-option label="Medium (500)" :value="500" />
                    <el-option label="Semibold (600)" :value="600" />
                    <el-option label="Bold (700)" :value="700" />
                  </el-select>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="Spacing" name="spacing">
            <div class="spacing-section">
              <h4>Spacing Scale</h4>
              <div class="spacing-group">
                <div
                  v-for="(space, key) in spacing"
                  :key="key"
                  class="spacing-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="spacing-input-group">
                    <el-input-number
                      v-model="spacingValues[key]"
                      :min="0"
                      :max="100"
                      @change="updateSpacing(key, $event + 'px')"
                    />
                    <div class="spacing-preview" :style="{ width: space, height: space }" />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="Border Radius" name="borderRadius">
            <div class="border-radius-section">
              <h4>Border Radius Scale</h4>
              <div class="border-radius-group">
                <div
                  v-for="(radius, key) in borderRadius"
                  :key="key"
                  class="border-radius-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="border-radius-input-group">
                    <el-input-number
                      v-model="borderRadiusValues[key]"
                      :min="0"
                      :max="50"
                      @change="updateBorderRadius(key, $event + 'px')"
                    />
                    <div
                      class="border-radius-preview"
                      :style="{ borderRadius: radius }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="Shadows" name="shadows">
            <div class="shadows-section">
              <h4>Shadow Presets</h4>
              <div class="shadow-group">
                <div
                  v-for="(shadow, key) in shadows"
                  :key="key"
                  class="shadow-item"
                >
                  <label>{{ formatLabel(key) }}</label>
                  <div class="shadow-input-group">
                    <el-input
                      v-model="shadows[key]"
                      @input="updateShadow(key, $event)"
                    />
                    <div
                      class="shadow-preview"
                      :style="{ boxShadow: shadow }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="theme-builder__preview">
        <h3>Preview</h3>
        <div class="preview-content">
          <ComponentPreview />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { themeManager } from './theme-manager'
import ComponentPreview from './ComponentPreview.vue'

const activeTab = ref('colors')
const currentTheme = ref(themeManager.currentTheme)

const colors = reactive({
  brand: {
    primary: '#409eff'
  },
  semantic: {
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  },
  text: {
    primary: '#303133',
    regular: '#606266',
    secondary: '#909399',
    placeholder: '#a8abb2',
    disabled: '#c0c4cc'
  }
})

const typography = reactive({
  fontFamily: '"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif',
  fontSize: {
    small: 12,
    base: 14,
    large: 16
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    bold: 600
  }
})

const spacing = reactive({
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px'
})

const spacingValues = reactive({
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20
})

const borderRadius = reactive({
  small: '2px',
  base: '4px',
  large: '8px'
})

const borderRadiusValues = reactive({
  small: 2,
  base: 4,
  large: 8
})

const shadows = reactive({
  base: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)',
  light: '0 2px 12px 0 rgba(0, 0, 0, 0.1)',
  dark: '0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.12)'
})

const availableThemes = computed(() => themeManager.availableThemes)

const updateColor = (category: string, key: string, value: string) => {
  const cssVar = `color-${category === 'brand' ? key : `${category}-${key}`}`
  themeManager.customizeTheme({ [cssVar]: value })
}

const updateTypography = (category: string, key: string, value: any) => {
  const cssVar = category === 'fontFamily' ? 'font-family' : `font-${category.replace('font', '').toLowerCase()}-${key}`
  themeManager.customizeTheme({ [cssVar]: value })
}

const updateSpacing = (key: string, value: string) => {
  spacing[key] = value
  themeManager.customizeTheme({ [`spacing-${key}`]: value })
}

const updateBorderRadius = (key: string, value: string) => {
  borderRadius[key] = value
  themeManager.customizeTheme({ [`border-radius-${key}`]: value })
}

const updateShadow = (key: string, value: string) => {
  themeManager.customizeTheme({ [`box-shadow-${key}`]: value })
}

const setTheme = (theme: string) => {
  themeManager.setTheme(theme)
  currentTheme.value = theme
}

const resetTheme = () => {
  themeManager.setTheme('default')
  currentTheme.value = 'default'
}

const exportTheme = () => {
  const themeData = themeManager.exportTheme()
  const blob = new Blob([themeData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'theme.json'
  a.click()
  URL.revokeObjectURL(url)
}

const saveTheme = () => {
  // Implementation for saving theme
  console.log('Theme saved')
}

const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const getThemeColors = (themeName: string) => {
  // Implementation to get theme colors for preview
  return [
    { name: 'primary', value: '#409eff' },
    { name: 'success', value: '#67c23a' },
    { name: 'warning', value: '#e6a23c' },
    { name: 'danger', value: '#f56c6c' }
  ]
}
</script>

<style scoped>
.theme-builder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.theme-builder__header {
  margin-bottom: 20px;
}

.theme-builder__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-builder__title h2 {
  margin: 0;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.preset-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s;
}

.preset-item:hover {
  border-color: var(--el-color-primary-light-7);
}

.preset-item.active {
  border-color: var(--el-color-primary);
}

.preset-preview {
  margin-bottom: 8px;
}

.preset-colors {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.preset-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--el-border-color);
}

.preset-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  text-transform: capitalize;
}

.theme-builder__content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 20px;
}

.theme-builder__sidebar {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
}

.color-section,
.typography-section,
.spacing-section,
.border-radius-section,
.shadows-section {
  padding: 20px;
}

.color-group,
.size-group,
.weight-group,
.spacing-group,
.border-radius-group,
.shadow-group {
  margin-top: 16px;
}

.color-item,
.size-item,
.weight-item,
.spacing-item,
.border-radius-item,
.shadow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.color-item label,
.size-item label,
.weight-item label,
.spacing-item label,
.border-radius-item label,
.shadow-item label {
  font-weight: 500;
  min-width: 80px;
}

.color-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-input-group .el-input {
  width: 80px;
}

.spacing-input-group,
.border-radius-input-group,
.shadow-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spacing-preview,
.border-radius-preview,
.shadow-preview {
  width: 24px;
  height: 24px;
  background-color: var(--el-color-primary);
  border: 1px solid var(--el-border-color);
}

.border-radius-preview {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
}

.shadow-preview {
  background-color: var(--el-bg-color);
}

.theme-builder__preview {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 20px;
}

.theme-builder__preview h3 {
  margin-top: 0;
  margin-bottom: 20px;
}

.preview-content {
  min-height: 600px;
}
</style>
```

### 3. CSS Custom Properties Integration

```scss
// Advanced CSS custom properties usage
.el-button {
  // Use CSS custom properties with fallbacks
  background-color: var(--el-button-bg-color, var(--el-bg-color));
  border-color: var(--el-button-border-color, var(--el-border-color));
  color: var(--el-button-text-color, var(--el-text-color-regular));
  
  // Dynamic color calculations
  &:hover {
    background-color: var(--el-button-hover-bg-color, 
      color-mix(in srgb, var(--el-button-bg-color) 90%, var(--el-color-primary) 10%));
    border-color: var(--el-button-hover-border-color,
      color-mix(in srgb, var(--el-button-border-color) 70%, var(--el-color-primary) 30%));
  }
  
  &:active {
    background-color: var(--el-button-active-bg-color,
      color-mix(in srgb, var(--el-button-bg-color) 80%, var(--el-color-primary) 20%));
  }
  
  // Size variations using custom properties
  &.el-button--large {
    padding: var(--el-button-large-padding, var(--el-spacing-lg) var(--el-spacing-xl));
    font-size: var(--el-button-large-font-size, var(--el-font-size-large));
  }
  
  &.el-button--small {
    padding: var(--el-button-small-padding, var(--el-spacing-sm) var(--el-spacing-md));
    font-size: var(--el-button-small-font-size, var(--el-font-size-small));
  }
  
  // Type variations
  &.el-button--primary {
    background-color: var(--el-button-primary-bg-color, var(--el-color-primary));
    border-color: var(--el-button-primary-border-color, var(--el-color-primary));
    color: var(--el-button-primary-text-color, #ffffff);
  }
  
  &.el-button--success {
    background-color: var(--el-button-success-bg-color, var(--el-color-success));
    border-color: var(--el-button-success-border-color, var(--el-color-success));
    color: var(--el-button-success-text-color, #ffffff);
  }
}

// Dark theme overrides
@media (prefers-color-scheme: dark) {
  :root {
    --el-bg-color: #1a1a1a;
    --el-bg-color-page: #0a0a0a;
    --el-text-color-primary: #e4e7ed;
    --el-text-color-regular: #cfd3dc;
    --el-text-color-secondary: #a3a6ad;
    --el-border-color: #4c4d4f;
    --el-border-color-light: #414243;
    --el-border-color-lighter: #363637;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  :root {
    --el-color-primary: #0066cc;
    --el-text-color-primary: #000000;
    --el-border-color: #000000;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  :root {
    --el-transition-duration: 0s;
    --el-transition-duration-fast: 0s;
  }
}
```

## Best Practices

### 1. Design Token Organization

- **Hierarchical Structure**: Organize tokens from global to component-specific
- **Semantic Naming**: Use meaningful names that describe purpose, not appearance
- **Consistent Scale**: Maintain consistent spacing and sizing scales
- **Accessibility**: Ensure sufficient color contrast and support for accessibility preferences

### 2. Theme Development Guidelines

- **Mobile-First**: Design themes with mobile devices in mind
- **Performance**: Minimize CSS custom property usage in performance-critical areas
- **Fallbacks**: Always provide fallback values for custom properties
- **Testing**: Test themes across different devices and accessibility settings

### 3. Customization Strategies

- **Progressive Enhancement**: Start with a solid base theme and add customizations
- **Component Isolation**: Ensure theme changes don't break component functionality
- **Documentation**: Document all available customization options
- **Validation**: Validate theme configurations to prevent invalid values

## Conclusion

Element Plus's advanced theme system provides:

- **Comprehensive Customization**: Full control over visual appearance
- **Design System Integration**: Structured approach to design tokens
- **Accessibility Support**: Built-in support for accessibility preferences
- **Performance Optimization**: Efficient CSS custom property usage
- **Developer Experience**: Intuitive APIs and comprehensive tooling
- **Future-Proof**: Extensible architecture for future enhancements

This system serves as an excellent foundation for building sophisticated design systems and theme management solutions.