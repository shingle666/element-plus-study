# Theme Customization

## Overview

Element Plus provides a comprehensive theming system that allows you to customize the appearance of all components to match your brand and design requirements. The theming system is built on CSS custom properties (CSS variables) and SCSS variables, providing flexibility and maintainability.

## CSS Variables Approach

### Basic Usage

The simplest way to customize Element Plus themes is by overriding CSS variables:

```css
:root {
  /* Primary color */
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
  
  /* Success color */
  --el-color-success: #67c23a;
  --el-color-success-light-3: #95d475;
  --el-color-success-light-5: #b3e19d;
  --el-color-success-light-7: #d1edc4;
  --el-color-success-light-8: #e1f3d8;
  --el-color-success-light-9: #f0f9eb;
  --el-color-success-dark-2: #529b2e;
  
  /* Warning color */
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #eebe77;
  --el-color-warning-light-5: #f3d19e;
  --el-color-warning-light-7: #f8e3c5;
  --el-color-warning-light-8: #faecd8;
  --el-color-warning-light-9: #fdf6ec;
  --el-color-warning-dark-2: #b88230;
  
  /* Danger color */
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #f89898;
  --el-color-danger-light-5: #fab6b6;
  --el-color-danger-light-7: #fcd3d3;
  --el-color-danger-light-8: #fde2e2;
  --el-color-danger-light-9: #fef0f0;
  --el-color-danger-dark-2: #c45656;
  
  /* Info color */
  --el-color-info: #909399;
  --el-color-info-light-3: #b1b3b8;
  --el-color-info-light-5: #c8c9cc;
  --el-color-info-light-7: #dedfe0;
  --el-color-info-light-8: #e9e9eb;
  --el-color-info-light-9: #f4f4f5;
  --el-color-info-dark-2: #73767a;
}
```

### Custom Brand Colors

```css
/* Custom brand theme */
:root {
  --el-color-primary: #6366f1; /* Indigo */
  --el-color-success: #10b981; /* Emerald */
  --el-color-warning: #f59e0b; /* Amber */
  --el-color-danger: #ef4444;  /* Red */
  --el-color-info: #6b7280;    /* Gray */
}
```

### Typography Customization

```css
:root {
  /* Font family */
  --el-font-family: 'Inter', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;
  
  /* Font sizes */
  --el-font-size-extra-large: 20px;
  --el-font-size-large: 18px;
  --el-font-size-medium: 16px;
  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-extra-small: 12px;
  
  /* Line heights */
  --el-line-height-primary: 28px;
  --el-line-height-large: 26px;
  --el-line-height-medium: 24px;
  --el-line-height-base: 22px;
  --el-line-height-small: 20px;
  --el-line-height-extra-small: 18px;
}
```

### Spacing and Layout

```css
:root {
  /* Border radius */
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  --el-border-radius-circle: 100%;
  
  /* Box shadow */
  --el-box-shadow: 0 12px 32px 4px rgba(0, 0, 0, 0.04), 0 8px 20px rgba(0, 0, 0, 0.08);
  --el-box-shadow-light: 0 0 12px rgba(0, 0, 0, 0.12);
  --el-box-shadow-lighter: 0 0 6px rgba(0, 0, 0, 0.12);
  --el-box-shadow-dark: 0 16px 48px 16px rgba(0, 0, 0, 0.08), 0 12px 32px rgba(0, 0, 0, 0.12), 0 8px 16px -8px rgba(0, 0, 0, 0.16);
}
```

## SCSS Variables Approach

### Setting up SCSS Customization

1. **Install SCSS dependencies:**

```bash
npm install sass -D
```

2. **Create a custom theme file:**

```scss
// styles/element-variables.scss

// Override default variables
$colors: (
  'primary': (
    'base': #6366f1,
  ),
  'success': (
    'base': #10b981,
  ),
  'warning': (
    'base': #f59e0b,
  ),
  'danger': (
    'base': #ef4444,
  ),
  'error': (
    'base': #ef4444,
  ),
  'info': (
    'base': #6b7280,
  ),
);

// Typography
$font-family: 'Inter', 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif;

$font-size: (
  'extra-large': 20px,
  'large': 18px,
  'medium': 16px,
  'base': 14px,
  'small': 13px,
  'extra-small': 12px,
);

// Border radius
$border-radius: (
  'base': 6px,
  'small': 3px,
  'round': 20px,
  'circle': 100%,
);

// Import Element Plus styles
@import 'element-plus/theme-chalk/src/index.scss';
```

3. **Import in your main CSS file:**

```scss
// main.scss
@import './styles/element-variables.scss';
```

### Advanced SCSS Customization

```scss
// Advanced theme customization

// Component-specific variables
$button: (
  'font-weight': 500,
  'border-width': 1px,
  'border-style': solid,
  'border-color': transparent,
  'border-radius': 6px,
  'box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'font-size': 14px,
  'padding-vertical': 8px,
  'padding-horizontal': 16px,
);

$input: (
  'font-size': 14px,
  'border-radius': 6px,
  'border-width': 1px,
  'border-style': solid,
  'border-color': #d1d5db,
  'inner-height': 32px,
  'clear-hover-color': #909399,
);

$card: (
  'border-radius': 8px,
  'border-width': 1px,
  'border-style': solid,
  'border-color': #e5e7eb,
  'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'padding': 20px,
);

// Import Element Plus
@import 'element-plus/theme-chalk/src/index.scss';
```

## Dark Mode Support

### Automatic Dark Mode

```css
/* Light mode (default) */
:root {
  --el-bg-color: #ffffff;
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-text-color-disabled: #c0c4cc;
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
  --el-fill-color: #f0f2f5;
  --el-fill-color-light: #f5f7fa;
  --el-fill-color-lighter: #fafafa;
  --el-fill-color-extra-light: #fafcff;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --el-bg-color: #141414;
    --el-text-color-primary: #e5eaf3;
    --el-text-color-regular: #cfd3dc;
    --el-text-color-secondary: #a3a6ad;
    --el-text-color-placeholder: #8d9095;
    --el-text-color-disabled: #6c6e72;
    --el-border-color: #4c4d4f;
    --el-border-color-light: #414243;
    --el-border-color-lighter: #363637;
    --el-border-color-extra-light: #2b2b2c;
    --el-fill-color: #2b2b2c;
    --el-fill-color-light: #262727;
    --el-fill-color-lighter: #1d1d1d;
    --el-fill-color-extra-light: #191919;
  }
}
```

### Manual Dark Mode Toggle

```vue
<template>
  <div :class="{ 'dark': isDark }">
    <el-switch 
      v-model="isDark" 
      @change="toggleDarkMode"
      active-text="Dark"
      inactive-text="Light"
    />
    
    <!-- Your app content -->
    <el-button type="primary">Primary Button</el-button>
    <el-card>
      <p>Card content</p>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const isDark = ref(false)

const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  isDark.value = savedTheme === 'dark'
  toggleDarkMode()
} else {
  // Use system preference
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  toggleDarkMode()
}
</script>

<style>
/* Dark mode styles */
.dark {
  --el-bg-color: #141414;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-text-color-disabled: #6c6e72;
  --el-border-color: #4c4d4f;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-border-color-extra-light: #2b2b2c;
  --el-fill-color: #2b2b2c;
  --el-fill-color-light: #262727;
  --el-fill-color-lighter: #1d1d1d;
  --el-fill-color-extra-light: #191919;
}
</style>
```

## Component-Specific Theming

### Button Customization

```css
/* Custom button styles */
.el-button {
  --el-button-font-weight: 500;
  --el-button-border-width: 1px;
  --el-button-border-radius: 6px;
  --el-button-padding-vertical: 10px;
  --el-button-padding-horizontal: 20px;
}

.el-button--primary {
  --el-button-text-color: #ffffff;
  --el-button-bg-color: var(--el-color-primary);
  --el-button-border-color: var(--el-color-primary);
  --el-button-hover-text-color: #ffffff;
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
  --el-button-active-text-color: #ffffff;
  --el-button-active-bg-color: var(--el-color-primary-dark-2);
  --el-button-active-border-color: var(--el-color-primary-dark-2);
}

/* Custom button variants */
.el-button--gradient {
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.el-button--gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}
```

### Form Component Theming

```css
/* Input customization */
.el-input {
  --el-input-border-radius: 6px;
  --el-input-border-color: #d1d5db;
  --el-input-hover-border-color: var(--el-color-primary);
  --el-input-focus-border-color: var(--el-color-primary);
  --el-input-font-size: 14px;
  --el-input-height: 40px;
}

.el-input__wrapper {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.el-input__wrapper:hover {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

/* Select customization */
.el-select {
  --el-select-border-color-hover: var(--el-color-primary);
  --el-select-input-focus-border-color: var(--el-color-primary);
}

/* Form item customization */
.el-form-item__label {
  font-weight: 500;
  color: var(--el-text-color-primary);
}
```

### Table Theming

```css
/* Table customization */
.el-table {
  --el-table-border-color: #e5e7eb;
  --el-table-border: 1px solid var(--el-table-border-color);
  --el-table-text-color: var(--el-text-color-primary);
  --el-table-header-text-color: var(--el-text-color-primary);
  --el-table-header-bg-color: #f9fafb;
  --el-table-row-hover-bg-color: #f3f4f6;
  --el-table-current-row-bg-color: #eff6ff;
  --el-table-header-border-bottom: 2px solid #e5e7eb;
}

.el-table th.el-table__cell {
  font-weight: 600;
  background-color: var(--el-table-header-bg-color);
  border-bottom: var(--el-table-header-border-bottom);
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: #f9fafb;
}
```

## Advanced Theming Techniques

### CSS-in-JS Integration

```javascript
// Using CSS-in-JS with Element Plus
const theme = {
  colors: {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#6b7280'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  }
}

// Apply theme to CSS variables
const applyTheme = (theme) => {
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--el-color-${key}`, value)
  })
  
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--el-spacing-${key}`, value)
  })
  
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--el-border-radius-${key}`, value)
  })
}

applyTheme(theme)
```

### Dynamic Theme Switching

```vue
<template>
  <div class="theme-switcher">
    <el-select v-model="currentTheme" @change="switchTheme">
      <el-option 
        v-for="theme in themes" 
        :key="theme.name"
        :label="theme.label" 
        :value="theme.name"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentTheme = ref('default')

const themes = [
  {
    name: 'default',
    label: 'Default',
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c'
    }
  },
  {
    name: 'purple',
    label: 'Purple',
    colors: {
      primary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  },
  {
    name: 'green',
    label: 'Green',
    colors: {
      primary: '#059669',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    }
  }
]

const switchTheme = (themeName) => {
  const theme = themes.find(t => t.name === themeName)
  if (!theme) return
  
  const root = document.documentElement
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--el-color-${key}`, value)
  })
  
  // Save to localStorage
  localStorage.setItem('selected-theme', themeName)
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('selected-theme')
if (savedTheme) {
  currentTheme.value = savedTheme
  switchTheme(savedTheme)
}
</script>
```

### Theme Generator Utility

```typescript
// Theme generator utility
interface ThemeConfig {
  primary: string
  success?: string
  warning?: string
  danger?: string
  info?: string
}

class ThemeGenerator {
  private generateColorPalette(baseColor: string) {
    // Convert hex to HSL
    const hsl = this.hexToHsl(baseColor)
    
    return {
      'base': baseColor,
      'light-3': this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 100)),
      'light-5': this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 25, 100)),
      'light-7': this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 35, 100)),
      'light-8': this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 40, 100)),
      'light-9': this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 45, 100)),
      'dark-2': this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 0))
    }
  }
  
  generateTheme(config: ThemeConfig) {
    const theme: Record<string, any> = {}
    
    // Generate color palettes
    Object.entries(config).forEach(([colorName, colorValue]) => {
      const palette = this.generateColorPalette(colorValue)
      Object.entries(palette).forEach(([shade, value]) => {
        theme[`--el-color-${colorName}${shade === 'base' ? '' : '-' + shade}`] = value
      })
    })
    
    return theme
  }
  
  applyTheme(theme: Record<string, string>) {
    const root = document.documentElement
    Object.entries(theme).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }
  
  private hexToHsl(hex: string) {
    // Implementation for hex to HSL conversion
    // ... (implementation details)
  }
  
  private hslToHex(h: number, s: number, l: number) {
    // Implementation for HSL to hex conversion
    // ... (implementation details)
  }
}

// Usage
const themeGenerator = new ThemeGenerator()
const customTheme = themeGenerator.generateTheme({
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
})

themeGenerator.applyTheme(customTheme)
```

## Build Integration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/element-variables.scss";
        `
      }
    }
  }
})
```

### Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "./src/styles/element-variables.scss";`
            }
          }
        ]
      }
    ]
  }
}
```

## Best Practices

### 1. Consistent Color System

- Use a systematic approach to color generation
- Maintain proper contrast ratios for accessibility
- Test colors in both light and dark modes
- Document your color choices and their usage

### 2. Scalable Architecture

- Organize theme files logically
- Use CSS custom properties for runtime changes
- Keep SCSS variables for build-time customization
- Create reusable theme utilities

### 3. Performance Considerations

- Minimize CSS custom property usage in animations
- Use CSS-in-JS sparingly for theme switching
- Optimize theme bundle size
- Cache theme preferences

### 4. Accessibility

- Ensure sufficient color contrast (WCAG AA: 4.5:1, AAA: 7:1)
- Test with color blindness simulators
- Provide high contrast mode options
- Don't rely solely on color to convey information

### 5. Maintenance

- Document theme customization guidelines
- Create theme testing procedures
- Version your theme configurations
- Provide migration guides for theme updates

## Conclusion

Element Plus's theming system provides powerful customization capabilities through CSS variables and SCSS. Whether you need simple color changes or comprehensive design system integration, the flexible architecture supports various approaches while maintaining performance and accessibility standards. Choose the method that best fits your project's requirements and team workflow.