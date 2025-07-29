# 第41天：Element Plus 主题系统深入定制

## 学习目标
- 深入理解 Element Plus 主题系统架构
- 掌握 CSS 变量和 SCSS 变量的使用
- 学习主题切换的实现方案
- 实践动态主题生成和定制

## 学习内容

### 1. Element Plus 主题系统架构

#### 1.1 主题系统概述
```scss
// Element Plus 主题架构
// theme-chalk/src/common/var.scss - 主题变量定义

// 基础颜色系统
$colors: () !default;
$colors: map.merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #409eff,
    ),
    'success': (
      'base': #67c23a,
    ),
    'warning': (
      'base': #e6a23c,
    ),
    'danger': (
      'base': #f56c6c,
    ),
    'error': (
      'base': #f56c6c,
    ),
    'info': (
      'base': #909399,
    ),
  ),
  $colors
);

// 生成颜色变体
@each $type in (primary, success, warning, danger, error, info) {
  $colors: map.merge(
    $colors,
    (
      $type: (
        'light-3': mix(#fff, map.get($colors, $type, 'base'), 30%),
        'light-5': mix(#fff, map.get($colors, $type, 'base'), 50%),
        'light-7': mix(#fff, map.get($colors, $type, 'base'), 70%),
        'light-8': mix(#fff, map.get($colors, $type, 'base'), 80%),
        'light-9': mix(#fff, map.get($colors, $type, 'base'), 90%),
        'dark-2': mix(#000, map.get($colors, $type, 'base'), 20%),
      ),
    )
  );
}

// 文本颜色
$text-color: () !default;
$text-color: map.merge(
  (
    'primary': #303133,
    'regular': #606266,
    'secondary': #909399,
    'placeholder': #a8abb2,
    'disabled': #c0c4cc,
  ),
  $text-color
);

// 边框颜色
$border-color: () !default;
$border-color: map.merge(
  (
    '': #dcdfe6,
    'light': #e4e7ed,
    'lighter': #ebeef5,
    'extra-light': #f2f6fc,
    'dark': #d4d7de,
    'darker': #cdd0d6,
  ),
  $border-color
);

// 填充颜色
$fill-color: () !default;
$fill-color: map.merge(
  (
    '': #f0f2f5,
    'light': #f5f7fa,
    'lighter': #fafafa,
    'extra-light': #fafcff,
    'dark': #ebedf0,
    'darker': #e6e8eb,
    'blank': #ffffff,
  ),
  $fill-color
);

// 背景颜色
$bg-color: () !default;
$bg-color: map.merge(
  (
    '': #ffffff,
    'page': #f2f3f5,
    'overlay': #ffffff,
  ),
  $bg-color
);
```

#### 1.2 CSS 变量系统
```scss
// CSS 变量生成 mixin
@mixin set-css-var-value($name, $value) {
  #{getCssVarName($name)}: #{$value};
}

@mixin set-css-color-type($colors, $type) {
  @include set-css-var-value(('color', $type), map.get($colors, $type, 'base'));
  
  @each $level in (3, 5, 7, 8, 9) {
    @include set-css-var-value(
      ('color', $type, 'light', $level),
      map.get($colors, $type, 'light-#{$level}')
    );
  }
  
  @include set-css-var-value(
    ('color', $type, 'dark-2'),
    map.get($colors, $type, 'dark-2')
  );
}

// 生成所有 CSS 变量
:root {
  // 颜色变量
  @each $type in (primary, success, warning, danger, error, info) {
    @include set-css-color-type($colors, $type);
  }
  
  // 文本颜色变量
  @each $type, $value in $text-color {
    @include set-css-var-value(('text-color', $type), $value);
  }
  
  // 边框颜色变量
  @each $type, $value in $border-color {
    @if $type == '' {
      @include set-css-var-value('border-color', $value);
    } @else {
      @include set-css-var-value(('border-color', $type), $value);
    }
  }
  
  // 填充颜色变量
  @each $type, $value in $fill-color {
    @if $type == '' {
      @include set-css-var-value('fill-color', $value);
    } @else {
      @include set-css-var-value(('fill-color', $type), $value);
    }
  }
  
  // 背景颜色变量
  @each $type, $value in $bg-color {
    @if $type == '' {
      @include set-css-var-value('bg-color', $value);
    } @else {
      @include set-css-var-value(('bg-color', $type), $value);
    }
  }
  
  // 组件特定变量
  @include set-css-var-value('border-radius-base', 4px);
  @include set-css-var-value('border-radius-small', 2px);
  @include set-css-var-value('border-radius-round', 20px);
  @include set-css-var-value('border-radius-circle', 100%);
  
  // 字体大小
  @include set-css-var-value('font-size-extra-large', 20px);
  @include set-css-var-value('font-size-large', 18px);
  @include set-css-var-value('font-size-medium', 16px);
  @include set-css-var-value('font-size-base', 14px);
  @include set-css-var-value('font-size-small', 13px);
  @include set-css-var-value('font-size-extra-small', 12px);
  
  // 字体粗细
  @include set-css-var-value('font-weight-primary', 500);
  
  // 行高
  @include set-css-var-value('font-line-height-primary', 24px);
  
  // 字体家族
  @include set-css-var-value(
    'font-family',
    "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif"
  );
  
  // 阴影
  @include set-css-var-value('box-shadow', 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08));
  @include set-css-var-value('box-shadow-light', 0px 0px 12px rgba(0, 0, 0, 0.12));
  @include set-css-var-value('box-shadow-lighter', 0px 0px 6px rgba(0, 0, 0, 0.12));
  @include set-css-var-value('box-shadow-dark', 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16));
  
  // 禁用透明度
  @include set-css-var-value('disabled-opacity', 0.5);
  
  // 遮罩层
  @include set-css-var-value('overlay-color', rgba(0, 0, 0, 0.8));
  @include set-css-var-value('overlay-color-light', rgba(0, 0, 0, 0.7));
  @include set-css-var-value('overlay-color-lighter', rgba(0, 0, 0, 0.5));
  
  // 遮罩层
  @include set-css-var-value('mask-color', rgba(255, 255, 255, 0.9));
  @include set-css-var-value('mask-color-extra-light', rgba(255, 255, 255, 0.3));
}
```

### 2. 自定义主题实现

#### 2.1 SCSS 变量定制
```scss
// custom-theme.scss - 自定义主题变量

// 重新定义颜色系统
$custom-colors: (
  'primary': (
    'base': #1890ff,  // 蓝色主题
  ),
  'success': (
    'base': #52c41a,  // 绿色
  ),
  'warning': (
    'base': #faad14,  // 橙色
  ),
  'danger': (
    'base': #ff4d4f,  // 红色
  ),
  'info': (
    'base': #1890ff,  // 信息色
  ),
);

// 合并自定义颜色
$colors: map.merge($colors, $custom-colors) !global;

// 自定义文本颜色
$custom-text-color: (
  'primary': #262626,
  'regular': #595959,
  'secondary': #8c8c8c,
  'placeholder': #bfbfbf,
  'disabled': #d9d9d9,
);

$text-color: map.merge($text-color, $custom-text-color) !global;

// 自定义边框颜色
$custom-border-color: (
  '': #d9d9d9,
  'light': #e8e8e8,
  'lighter': #f0f0f0,
  'extra-light': #fafafa,
);

$border-color: map.merge($border-color, $custom-border-color) !global;

// 自定义圆角
$border-radius-base: 6px !global;
$border-radius-small: 4px !global;
$border-radius-round: 16px !global;

// 自定义字体
$font-family: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" !global;
$font-size-base: 14px !global;
$font-size-small: 12px !global;
$font-size-large: 16px !global;

// 自定义阴影
$box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15) !global;
$box-shadow-light: 0 1px 3px rgba(0, 0, 0, 0.12) !global;

// 组件特定定制
// Button 组件
$button-padding-vertical: 8px !global;
$button-padding-horizontal: 16px !global;
$button-font-weight: 400 !global;
$button-border-width: 1px !global;
$button-bg-color: transparent !global;
$button-text-color: getCssVar('text-color', 'regular') !global;
$button-disabled-text-color: getCssVar('text-color', 'disabled') !global;
$button-disabled-bg-color: getCssVar('fill-color', 'light') !global;
$button-disabled-border-color: getCssVar('border-color', 'light') !global;

// Input 组件
$input-height: 36px !global;
$input-text-color: getCssVar('text-color', 'regular') !global;
$input-border: getCssVar('border') !global;
$input-hover-border-color: getCssVar('color', 'primary') !global;
$input-focus-border-color: getCssVar('color', 'primary') !global;
$input-transparent-border: 0 0 0 1px transparent inset !global;
$input-border-color: getCssVar('border-color') !global;
$input-border-radius: getCssVar('border-radius', 'base') !global;
$input-bg-color: getCssVar('fill-color', 'blank') !global;
$input-icon-color: getCssVar('text-color', 'placeholder') !global;
$input-placeholder-color: getCssVar('text-color', 'placeholder') !global;
$input-max-width: 314px !global;

// Table 组件
$table-border-color: getCssVar('border-color', 'lighter') !global;
$table-border: 1px solid $table-border-color !global;
$table-text-color: getCssVar('text-color', 'regular') !global;
$table-header-text-color: getCssVar('text-color', 'secondary') !global;
$table-row-hover-bg-color: getCssVar('fill-color', 'light') !global;
$table-current-row-bg-color: getCssVar('color', 'primary', 'light-9') !global;
$table-header-bg-color: getCssVar('bg-color', 'page') !global;
$table-fixed-box-shadow: 0 0 10px rgba(0, 0, 0, 0.12) !global;
$table-bg-color: getCssVar('fill-color', 'blank') !global;
$table-tr-bg-color: getCssVar('fill-color', 'blank') !global;
$table-expanded-cell-bg-color: getCssVar('fill-color', 'light') !global;

// Card 组件
$card-border-color: getCssVar('border-color', 'light') !global;
$card-border-radius: getCssVar('border-radius', 'base') !global;
$card-padding: 20px !global;
$card-bg-color: getCssVar('fill-color', 'blank') !global;
```

#### 2.2 动态主题切换
```typescript
// themeManager.ts - 主题管理器
import { ref, computed, watch } from 'vue'

// 主题类型定义
interface ThemeConfig {
  name: string
  displayName: string
  colors: {
    primary: string
    success: string
    warning: string
    danger: string
    info: string
  }
  textColors: {
    primary: string
    regular: string
    secondary: string
    placeholder: string
    disabled: string
  }
  borderColors: {
    base: string
    light: string
    lighter: string
    extraLight: string
  }
  fillColors: {
    base: string
    light: string
    lighter: string
    extraLight: string
  }
  bgColors: {
    base: string
    page: string
    overlay: string
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
  fontFamily: string
  boxShadow: {
    base: string
    light: string
    lighter: string
    dark: string
  }
}

// 预定义主题
const themes: Record<string, ThemeConfig> = {
  default: {
    name: 'default',
    displayName: '默认主题',
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399'
    },
    textColors: {
      primary: '#303133',
      regular: '#606266',
      secondary: '#909399',
      placeholder: '#a8abb2',
      disabled: '#c0c4cc'
    },
    borderColors: {
      base: '#dcdfe6',
      light: '#e4e7ed',
      lighter: '#ebeef5',
      extraLight: '#f2f6fc'
    },
    fillColors: {
      base: '#f0f2f5',
      light: '#f5f7fa',
      lighter: '#fafafa',
      extraLight: '#fafcff'
    },
    bgColors: {
      base: '#ffffff',
      page: '#f2f3f5',
      overlay: '#ffffff'
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
    fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
    boxShadow: {
      base: '0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08)',
      light: '0px 0px 12px rgba(0, 0, 0, 0.12)',
      lighter: '0px 0px 6px rgba(0, 0, 0, 0.12)',
      dark: '0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12)'
    }
  },
  
  dark: {
    name: 'dark',
    displayName: '暗黑主题',
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399'
    },
    textColors: {
      primary: '#e5eaf3',
      regular: '#cfd3dc',
      secondary: '#a3a6ad',
      placeholder: '#8d9095',
      disabled: '#6c6e72'
    },
    borderColors: {
      base: '#4c4d4f',
      light: '#414243',
      lighter: '#363637',
      extraLight: '#2b2b2c'
    },
    fillColors: {
      base: '#303133',
      light: '#262727',
      lighter: '#1d1d1d',
      extraLight: '#191919'
    },
    bgColors: {
      base: '#141414',
      page: '#0a0a0a',
      overlay: '#1d1e1f'
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
    fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
    boxShadow: {
      base: '0px 12px 32px 4px rgba(0, 0, 0, 0.36), 0px 8px 20px rgba(0, 0, 0, 0.72)',
      light: '0px 0px 12px rgba(0, 0, 0, 0.72)',
      lighter: '0px 0px 6px rgba(0, 0, 0, 0.72)',
      dark: '0px 16px 48px 16px rgba(0, 0, 0, 0.72), 0px 12px 32px rgba(0, 0, 0, 0.84)'
    }
  },
  
  blue: {
    name: 'blue',
    displayName: '蓝色主题',
    colors: {
      primary: '#1890ff',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#1890ff'
    },
    textColors: {
      primary: '#262626',
      regular: '#595959',
      secondary: '#8c8c8c',
      placeholder: '#bfbfbf',
      disabled: '#d9d9d9'
    },
    borderColors: {
      base: '#d9d9d9',
      light: '#e8e8e8',
      lighter: '#f0f0f0',
      extraLight: '#fafafa'
    },
    fillColors: {
      base: '#f5f5f5',
      light: '#fafafa',
      lighter: '#ffffff',
      extraLight: '#ffffff'
    },
    bgColors: {
      base: '#ffffff',
      page: '#f0f2f5',
      overlay: '#ffffff'
    },
    borderRadius: {
      base: '6px',
      small: '4px',
      round: '16px',
      circle: '100%'
    },
    fontSize: {
      extraLarge: '20px',
      large: '18px',
      medium: '16px',
      base: '14px',
      small: '12px',
      extraSmall: '12px'
    },
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxShadow: {
      base: '0 2px 8px rgba(0, 0, 0, 0.15)',
      light: '0 1px 3px rgba(0, 0, 0, 0.12)',
      lighter: '0 1px 2px rgba(0, 0, 0, 0.08)',
      dark: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  },
  
  green: {
    name: 'green',
    displayName: '绿色主题',
    colors: {
      primary: '#52c41a',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#1890ff'
    },
    textColors: {
      primary: '#262626',
      regular: '#595959',
      secondary: '#8c8c8c',
      placeholder: '#bfbfbf',
      disabled: '#d9d9d9'
    },
    borderColors: {
      base: '#d9d9d9',
      light: '#e8e8e8',
      lighter: '#f0f0f0',
      extraLight: '#f6ffed'
    },
    fillColors: {
      base: '#f6ffed',
      light: '#f6ffed',
      lighter: '#ffffff',
      extraLight: '#ffffff'
    },
    bgColors: {
      base: '#ffffff',
      page: '#f6ffed',
      overlay: '#ffffff'
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
    fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
    boxShadow: {
      base: '0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08)',
      light: '0px 0px 12px rgba(0, 0, 0, 0.12)',
      lighter: '0px 0px 6px rgba(0, 0, 0, 0.12)',
      dark: '0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12)'
    }
  }
}

// 主题管理器类
class ThemeManager {
  private currentTheme = ref<string>('default')
  private customThemes = ref<Record<string, ThemeConfig>>({})
  
  constructor() {
    this.loadThemeFromStorage()
    this.watchThemeChange()
  }
  
  // 获取当前主题
  get theme() {
    return this.currentTheme
  }
  
  // 获取当前主题配置
  get themeConfig() {
    return computed(() => {
      const themeName = this.currentTheme.value
      return this.customThemes.value[themeName] || themes[themeName] || themes.default
    })
  }
  
  // 获取所有可用主题
  get availableThemes() {
    return computed(() => {
      return {
        ...themes,
        ...this.customThemes.value
      }
    })
  }
  
  // 切换主题
  setTheme(themeName: string) {
    if (this.availableThemes.value[themeName]) {
      this.currentTheme.value = themeName
      this.applyTheme(this.availableThemes.value[themeName])
      this.saveThemeToStorage(themeName)
    } else {
      console.warn(`Theme '${themeName}' not found`)
    }
  }
  
  // 应用主题到 DOM
  private applyTheme(config: ThemeConfig) {
    const root = document.documentElement
    
    // 应用颜色变量
    Object.entries(config.colors).forEach(([type, color]) => {
      root.style.setProperty(`--el-color-${type}`, color)
      
      // 生成颜色变体
      this.generateColorVariants(root, type, color)
    })
    
    // 应用文本颜色
    Object.entries(config.textColors).forEach(([type, color]) => {
      root.style.setProperty(`--el-text-color-${type}`, color)
    })
    
    // 应用边框颜色
    Object.entries(config.borderColors).forEach(([type, color]) => {
      const varName = type === 'base' ? '--el-border-color' : `--el-border-color-${type}`
      root.style.setProperty(varName, color)
    })
    
    // 应用填充颜色
    Object.entries(config.fillColors).forEach(([type, color]) => {
      const varName = type === 'base' ? '--el-fill-color' : `--el-fill-color-${type}`
      root.style.setProperty(varName, color)
    })
    
    // 应用背景颜色
    Object.entries(config.bgColors).forEach(([type, color]) => {
      const varName = type === 'base' ? '--el-bg-color' : `--el-bg-color-${type}`
      root.style.setProperty(varName, color)
    })
    
    // 应用圆角
    Object.entries(config.borderRadius).forEach(([type, value]) => {
      const varName = type === 'base' ? '--el-border-radius-base' : `--el-border-radius-${type}`
      root.style.setProperty(varName, value)
    })
    
    // 应用字体大小
    Object.entries(config.fontSize).forEach(([type, value]) => {
      root.style.setProperty(`--el-font-size-${type.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
    })
    
    // 应用字体家族
    root.style.setProperty('--el-font-family', config.fontFamily)
    
    // 应用阴影
    Object.entries(config.boxShadow).forEach(([type, value]) => {
      const varName = type === 'base' ? '--el-box-shadow' : `--el-box-shadow-${type}`
      root.style.setProperty(varName, value)
    })
    
    // 添加主题类名
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${config.name}`)
  }
  
  // 生成颜色变体
  private generateColorVariants(root: HTMLElement, type: string, baseColor: string) {
    // 生成浅色变体
    const lightLevels = [3, 5, 7, 8, 9]
    lightLevels.forEach(level => {
      const lightColor = this.mixColors('#ffffff', baseColor, level / 10)
      root.style.setProperty(`--el-color-${type}-light-${level}`, lightColor)
    })
    
    // 生成深色变体
    const darkColor = this.mixColors('#000000', baseColor, 0.2)
    root.style.setProperty(`--el-color-${type}-dark-2`, darkColor)
  }
  
  // 颜色混合函数
  private mixColors(color1: string, color2: string, ratio: number): string {
    const hex1 = color1.replace('#', '')
    const hex2 = color2.replace('#', '')
    
    const r1 = parseInt(hex1.substr(0, 2), 16)
    const g1 = parseInt(hex1.substr(2, 2), 16)
    const b1 = parseInt(hex1.substr(4, 2), 16)
    
    const r2 = parseInt(hex2.substr(0, 2), 16)
    const g2 = parseInt(hex2.substr(2, 2), 16)
    const b2 = parseInt(hex2.substr(4, 2), 16)
    
    const r = Math.round(r1 * ratio + r2 * (1 - ratio))
    const g = Math.round(g1 * ratio + g2 * (1 - ratio))
    const b = Math.round(b1 * ratio + b2 * (1 - ratio))
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  
  // 注册自定义主题
  registerTheme(config: ThemeConfig) {
    this.customThemes.value[config.name] = config
  }
  
  // 移除自定义主题
  removeTheme(themeName: string) {
    if (this.customThemes.value[themeName]) {
      delete this.customThemes.value[themeName]
      
      // 如果当前主题被删除，切换到默认主题
      if (this.currentTheme.value === themeName) {
        this.setTheme('default')
      }
    }
  }
  
  // 从本地存储加载主题
  private loadThemeFromStorage() {
    try {
      const savedTheme = localStorage.getItem('element-plus-theme')
      const savedCustomThemes = localStorage.getItem('element-plus-custom-themes')
      
      if (savedTheme && this.availableThemes.value[savedTheme]) {
        this.currentTheme.value = savedTheme
      }
      
      if (savedCustomThemes) {
        this.customThemes.value = JSON.parse(savedCustomThemes)
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error)
    }
  }
  
  // 保存主题到本地存储
  private saveThemeToStorage(themeName: string) {
    try {
      localStorage.setItem('element-plus-theme', themeName)
      localStorage.setItem('element-plus-custom-themes', JSON.stringify(this.customThemes.value))
    } catch (error) {
      console.warn('Failed to save theme to storage:', error)
    }
  }
  
  // 监听主题变化
  private watchThemeChange() {
    watch(
      this.currentTheme,
      (newTheme) => {
        const config = this.availableThemes.value[newTheme]
        if (config) {
          this.applyTheme(config)
        }
      },
      { immediate: true }
    )
  }
  
  // 导出主题配置
  exportTheme(themeName: string): string | null {
    const config = this.availableThemes.value[themeName]
    if (config) {
      return JSON.stringify(config, null, 2)
    }
    return null
  }
  
  // 导入主题配置
  importTheme(configJson: string): boolean {
    try {
      const config: ThemeConfig = JSON.parse(configJson)
      
      // 验证配置格式
      if (this.validateThemeConfig(config)) {
        this.registerTheme(config)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }
  
  // 验证主题配置
  private validateThemeConfig(config: any): config is ThemeConfig {
    const requiredFields = ['name', 'displayName', 'colors', 'textColors', 'borderColors', 'fillColors', 'bgColors']
    
    return requiredFields.every(field => {
      return config && typeof config[field] !== 'undefined'
    })
  }
  
  // 重置所有主题
  resetThemes() {
    this.customThemes.value = {}
    this.setTheme('default')
    localStorage.removeItem('element-plus-custom-themes')
  }
}

// 创建主题管理器实例
const themeManager = new ThemeManager()

// 导出组合式函数
export function useTheme() {
  return {
    currentTheme: themeManager.theme,
    themeConfig: themeManager.themeConfig,
    availableThemes: themeManager.availableThemes,
    setTheme: themeManager.setTheme.bind(themeManager),
    registerTheme: themeManager.registerTheme.bind(themeManager),
    removeTheme: themeManager.removeTheme.bind(themeManager),
    exportTheme: themeManager.exportTheme.bind(themeManager),
    importTheme: themeManager.importTheme.bind(themeManager),
    resetThemes: themeManager.resetThemes.bind(themeManager)
  }
}

export { themeManager, themes }
export type { ThemeConfig }
```

### 3. 主题切换组件实现

#### 3.1 主题选择器组件
```vue
<!-- ThemeSelector.vue - 主题选择器组件 -->
<template>
  <div class="theme-selector">
    <el-dropdown 
      trigger="click" 
      placement="bottom-end"
      @command="handleThemeChange"
    >
      <el-button class="theme-trigger">
        <el-icon><Palette /></el-icon>
        <span>{{ currentThemeConfig.displayName }}</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      
      <template #dropdown>
        <el-dropdown-menu class="theme-dropdown">
          <div class="theme-section">
            <div class="theme-section-title">预设主题</div>
            <div class="theme-grid">
              <div 
                v-for="(theme, key) in presetThemes" 
                :key="key"
                class="theme-item"
                :class="{ active: currentTheme === key }"
                @click="handleThemeChange(key)"
              >
                <div class="theme-preview">
                  <div 
                    class="color-dot primary" 
                    :style="{ backgroundColor: theme.colors.primary }"
                  ></div>
                  <div 
                    class="color-dot success" 
                    :style="{ backgroundColor: theme.colors.success }"
                  ></div>
                  <div 
                    class="color-dot warning" 
                    :style="{ backgroundColor: theme.colors.warning }"
                  ></div>
                  <div 
                    class="color-dot danger" 
                    :style="{ backgroundColor: theme.colors.danger }"
                  ></div>
                </div>
                <div class="theme-name">{{ theme.displayName }}</div>
              </div>
            </div>
          </div>
          
          <el-divider v-if="Object.keys(customThemes).length > 0" />
          
          <div v-if="Object.keys(customThemes).length > 0" class="theme-section">
            <div class="theme-section-title">
              自定义主题
              <el-button 
                type="text" 
                size="small" 
                @click="showCustomThemeDialog = true"
              >
                管理
              </el-button>
            </div>
            <div class="theme-grid">
              <div 
                v-for="(theme, key) in customThemes" 
                :key="key"
                class="theme-item"
                :class="{ active: currentTheme === key }"
                @click="handleThemeChange(key)"
              >
                <div class="theme-preview">
                  <div 
                    class="color-dot primary" 
                    :style="{ backgroundColor: theme.colors.primary }"
                  ></div>
                  <div 
                    class="color-dot success" 
                    :style="{ backgroundColor: theme.colors.success }"
                  ></div>
                  <div 
                    class="color-dot warning" 
                    :style="{ backgroundColor: theme.colors.warning }"
                  ></div>
                  <div 
                    class="color-dot danger" 
                    :style="{ backgroundColor: theme.colors.danger }"
                  ></div>
                </div>
                <div class="theme-name">{{ theme.displayName }}</div>
              </div>
            </div>
          </div>
          
          <el-divider />
          
          <el-dropdown-item class="theme-action" @click="showThemeEditor = true">
            <el-icon><Plus /></el-icon>
            创建自定义主题
          </el-dropdown-item>
          
          <el-dropdown-item class="theme-action" @click="showImportDialog = true">
            <el-icon><Upload /></el-icon>
            导入主题
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 主题编辑器对话框 -->
    <ThemeEditor 
      v-model="showThemeEditor"
      :initial-theme="editingTheme"
      @save="handleThemeSave"
    />
    
    <!-- 主题管理对话框 -->
    <ThemeManager 
      v-model="showCustomThemeDialog"
      @delete="handleThemeDelete"
      @edit="handleThemeEdit"
    />
    
    <!-- 导入主题对话框 -->
    <ImportThemeDialog 
      v-model="showImportDialog"
      @import="handleThemeImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Palette, ArrowDown, Plus, Upload } from '@element-plus/icons-vue'
import { useTheme, type ThemeConfig } from './themeManager'
import ThemeEditor from './ThemeEditor.vue'
import ThemeManager from './ThemeManager.vue'
import ImportThemeDialog from './ImportThemeDialog.vue'

// 使用主题管理器
const {
  currentTheme,
  themeConfig: currentThemeConfig,
  availableThemes,
  setTheme,
  registerTheme,
  removeTheme
} = useTheme()

// 对话框状态
const showThemeEditor = ref(false)
const showCustomThemeDialog = ref(false)
const showImportDialog = ref(false)
const editingTheme = ref<ThemeConfig | null>(null)

// 计算属性
const presetThemes = computed(() => {
  const preset = ['default', 'dark', 'blue', 'green']
  const result: Record<string, ThemeConfig> = {}
  
  preset.forEach(key => {
    if (availableThemes.value[key]) {
      result[key] = availableThemes.value[key]
    }
  })
  
  return result
})

const customThemes = computed(() => {
  const preset = ['default', 'dark', 'blue', 'green']
  const result: Record<string, ThemeConfig> = {}
  
  Object.entries(availableThemes.value).forEach(([key, theme]) => {
    if (!preset.includes(key)) {
      result[key] = theme
    }
  })
  
  return result
})

// 事件处理
const handleThemeChange = (themeName: string) => {
  setTheme(themeName)
  ElMessage.success(`已切换到${availableThemes.value[themeName]?.displayName}主题`)
}

const handleThemeSave = (theme: ThemeConfig) => {
  registerTheme(theme)
  setTheme(theme.name)
  showThemeEditor.value = false
  editingTheme.value = null
  ElMessage.success(`主题 "${theme.displayName}" 已保存`)
}

const handleThemeDelete = (themeName: string) => {
  const theme = availableThemes.value[themeName]
  removeTheme(themeName)
  ElMessage.success(`主题 "${theme?.displayName}" 已删除`)
}

const handleThemeEdit = (themeName: string) => {
  editingTheme.value = availableThemes.value[themeName]
  showThemeEditor.value = true
  showCustomThemeDialog.value = false
}

const handleThemeImport = (theme: ThemeConfig) => {
  registerTheme(theme)
  showImportDialog.value = false
  ElMessage.success(`主题 "${theme.displayName}" 导入成功`)
}
</script>

<style scoped>
.theme-selector {
  display: inline-block;
}

.theme-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-dropdown {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.theme-section {
  padding: 12px;
}

.theme-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.theme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-item:hover {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
}

.theme-item.active {
  border-color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-8);
}

.theme-preview {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--el-border-color-light);
}

.theme-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  text-align: center;
}

.theme-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}

.theme-action:hover {
  background-color: var(--el-fill-color-light);
}
</style>
```

#### 3.2 主题编辑器组件
```vue
<!-- ThemeEditor.vue - 主题编辑器 -->
<template>
  <el-dialog
    v-model="visible"
    title="主题编辑器"
    width="800px"
    :before-close="handleClose"
  >
    <div class="theme-editor">
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- 基本信息 -->
        <div class="editor-section">
          <h3>基本信息</h3>
          <el-form-item label="主题名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入主题名称" />
          </el-form-item>
          <el-form-item label="显示名称" prop="displayName">
            <el-input v-model="form.displayName" placeholder="请输入显示名称" />
          </el-form-item>
        </div>
        
        <!-- 主要颜色 -->
        <div class="editor-section">
          <h3>主要颜色</h3>
          <div class="color-grid">
            <el-form-item 
              v-for="(color, key) in form.colors" 
              :key="key"
              :label="colorLabels[key]"
            >
              <div class="color-input">
                <el-color-picker 
                  v-model="form.colors[key]"
                  show-alpha
                  :predefine="predefineColors"
                />
                <el-input 
                  v-model="form.colors[key]"
                  class="color-text"
                  placeholder="#000000"
                />
              </div>
            </el-form-item>
          </div>
        </div>
        
        <!-- 文本颜色 -->
        <div class="editor-section">
          <h3>文本颜色</h3>
          <div class="color-grid">
            <el-form-item 
              v-for="(color, key) in form.textColors" 
              :key="key"
              :label="textColorLabels[key]"
            >
              <div class="color-input">
                <el-color-picker 
                  v-model="form.textColors[key]"
                  show-alpha
                  :predefine="predefineColors"
                />
                <el-input 
                  v-model="form.textColors[key]"
                  class="color-text"
                  placeholder="#000000"
                />
              </div>
            </el-form-item>
          </div>
        </div>
        
        <!-- 边框和填充 -->
        <div class="editor-section">
          <h3>边框和填充</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <h4>边框颜色</h4>
              <el-form-item 
                v-for="(color, key) in form.borderColors" 
                :key="key"
                :label="borderColorLabels[key]"
              >
                <div class="color-input">
                  <el-color-picker 
                    v-model="form.borderColors[key]"
                    show-alpha
                    :predefine="predefineColors"
                  />
                  <el-input 
                    v-model="form.borderColors[key]"
                    class="color-text"
                    placeholder="#000000"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h4>填充颜色</h4>
              <el-form-item 
                v-for="(color, key) in form.fillColors" 
                :key="key"
                :label="fillColorLabels[key]"
              >
                <div class="color-input">
                  <el-color-picker 
                    v-model="form.fillColors[key]"
                    show-alpha
                    :predefine="predefineColors"
                  />
                  <el-input 
                    v-model="form.fillColors[key]"
                    class="color-text"
                    placeholder="#000000"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 字体设置 -->
        <div class="editor-section">
          <h3>字体设置</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="字体家族">
                <el-input 
                  v-model="form.fontFamily"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入字体家族"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <h4>字体大小</h4>
              <el-form-item 
                v-for="(size, key) in form.fontSize" 
                :key="key"
                :label="fontSizeLabels[key]"
              >
                <el-input 
                  v-model="form.fontSize[key]"
                  placeholder="14px"
                >
                  <template #append>px</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <!-- 圆角设置 -->
        <div class="editor-section">
          <h3>圆角设置</h3>
          <el-row :gutter="20">
            <el-col :span="6" v-for="(radius, key) in form.borderRadius" :key="key">
              <el-form-item :label="borderRadiusLabels[key]">
                <el-input 
                  v-model="form.borderRadius[key]"
                  placeholder="4px"
                >
                  <template #append>px</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      
      <!-- 预览区域 -->
      <div class="preview-section">
        <h3>预览效果</h3>
        <div class="preview-container" :style="previewStyles">
          <div class="preview-card">
            <div class="preview-header">
              <h4>预览标题</h4>
              <el-button type="primary" size="small">主要按钮</el-button>
            </div>
            <div class="preview-content">
              <p>这是一段预览文本，用于展示主题效果。</p>
              <el-button>默认按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSave">保存主题</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { ThemeConfig } from './themeManager'

// Props
interface Props {
  modelValue: boolean
  initialTheme?: ThemeConfig | null
}

const props = withDefaults(defineProps<Props>(), {
  initialTheme: null
})

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', theme: ThemeConfig): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()

// 表单数据
const defaultForm = (): ThemeConfig => ({
  name: '',
  displayName: '',
  colors: {
    primary: '#409eff',
    success: '#67c23a',
    warning: '#e6a23c',
    danger: '#f56c6c',
    info: '#909399'
  },
  textColors: {
    primary: '#303133',
    regular: '#606266',
    secondary: '#909399',
    placeholder: '#a8abb2',
    disabled: '#c0c4cc'
  },
  borderColors: {
    base: '#dcdfe6',
    light: '#e4e7ed',
    lighter: '#ebeef5',
    extraLight: '#f2f6fc'
  },
  fillColors: {
    base: '#f0f2f5',
    light: '#f5f7fa',
    lighter: '#fafafa',
    extraLight: '#fafcff'
  },
  bgColors: {
    base: '#ffffff',
    page: '#f2f3f5',
    overlay: '#ffffff'
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
  fontFamily: "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
  boxShadow: {
    base: '0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08)',
    light: '0px 0px 12px rgba(0, 0, 0, 0.12)',
    lighter: '0px 0px 6px rgba(0, 0, 0, 0.12)',
    dark: '0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12)'
  }
})

const form = ref<ThemeConfig>(defaultForm())

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入主题名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_-]*$/, message: '主题名称只能包含字母、数字、下划线和连字符，且必须以字母开头', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入显示名称', trigger: 'blur' }
  ]
}

// 标签映射
const colorLabels = {
  primary: '主要色',
  success: '成功色',
  warning: '警告色',
  danger: '危险色',
  info: '信息色'
}

const textColorLabels = {
  primary: '主要文本',
  regular: '常规文本',
  secondary: '次要文本',
  placeholder: '占位文本',
  disabled: '禁用文本'
}

const borderColorLabels = {
  base: '基础边框',
  light: '浅色边框',
  lighter: '更浅边框',
  extraLight: '极浅边框'
}

const fillColorLabels = {
  base: '基础填充',
  light: '浅色填充',
  lighter: '更浅填充',
  extraLight: '极浅填充'
}

const fontSizeLabels = {
  extraLarge: '超大字体',
  large: '大字体',
  medium: '中等字体',
  base: '基础字体',
  small: '小字体',
  extraSmall: '超小字体'
}

const borderRadiusLabels = {
  base: '基础圆角',
  small: '小圆角',
  round: '圆形',
  circle: '圆形'
}

// 预定义颜色
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]

// 预览样式
const previewStyles = computed(() => {
  return {
    '--preview-primary': form.value.colors.primary,
    '--preview-success': form.value.colors.success,
    '--preview-warning': form.value.colors.warning,
    '--preview-danger': form.value.colors.danger,
    '--preview-text-primary': form.value.textColors.primary,
    '--preview-text-regular': form.value.textColors.regular,
    '--preview-border': form.value.borderColors.base,
    '--preview-bg': form.value.bgColors.base,
    '--preview-fill': form.value.fillColors.base,
    '--preview-border-radius': form.value.borderRadius.base,
    '--preview-font-family': form.value.fontFamily,
    '--preview-font-size': form.value.fontSize.base
  }
})

// 监听初始主题变化
watch(
  () => props.initialTheme,
  (newTheme) => {
    if (newTheme) {
      form.value = { ...newTheme }
    } else {
      form.value = defaultForm()
    }
  },
  { immediate: true, deep: true }
)

// 事件处理
const handleClose = () => {
  visible.value = false
}

const handleReset = () => {
  if (props.initialTheme) {
    form.value = { ...props.initialTheme }
  } else {
    form.value = defaultForm()
  }
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const handleSave = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    emit('save', { ...form.value })
  } catch (error) {
    ElMessage.error('请检查表单输入')
  }
}
</script>

<style scoped>
.theme-editor {
  max-height: 600px;
  overflow-y: auto;
}

.editor-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.editor-section:last-child {
  border-bottom: none;
}

.editor-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.editor-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.color-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-text {
  flex: 1;
}

.preview-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.preview-container {
  padding: 16px;
  border: 1px solid var(--preview-border);
  border-radius: var(--preview-border-radius);
  background-color: var(--preview-bg);
  font-family: var(--preview-font-family);
  font-size: var(--preview-font-size);
}

.preview-card {
  background: var(--preview-fill);
  border-radius: var(--preview-border-radius);
  padding: 16px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h4 {
  margin: 0;
  color: var(--preview-text-primary);
}

.preview-content p {
  color: var(--preview-text-regular);
  margin-bottom: 16px;
}

.preview-content .el-button {
  margin-right: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
```

## 实践练习

### 练习1：自定义主题创建
```scss
// 创建企业级主题
// 1. 定义品牌色彩系统
// 2. 设置文本和背景色
// 3. 配置组件样式
// 4. 实现主题切换
```

### 练习2：暗黑模式实现
```typescript
// 实现暗黑模式切换
// 1. 定义暗黑主题变量
// 2. 实现自动切换逻辑
// 3. 处理图片和图标适配
// 4. 优化用户体验
```

### 练习3：动态主题生成
```typescript
// 实现动态主题生成器
// 1. 基于主色生成配色方案
// 2. 自动计算对比度
// 3. 生成完整主题配置
// 4. 实时预览效果
```

### 练习4：主题管理系统
```typescript
// 构建完整的主题管理系统
// 1. 主题导入导出功能
// 2. 主题版本管理
// 3. 主题分享机制
// 4. 主题市场功能
```

## 学习资源

### 官方文档
- [Element Plus 主题定制](https://element-plus.org/zh-CN/guide/theming.html)
- [CSS 变量文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [SCSS 变量指南](https://sass-lang.com/documentation/variables)

### 设计系统
- [Material Design Color](https://material.io/design/color/)
- [Ant Design 色彩](https://ant.design/docs/spec/colors-cn)
- [Adobe Color](https://color.adobe.com/)

### 工具和资源
- [Coolors 配色工具](https://coolors.co/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [CSS Variables Polyfill](https://github.com/jhildenbiddle/css-vars-ponyfill)

## 作业

1. **主题系统**：实现完整的主题切换系统
2. **自定义主题**：创建符合企业品牌的自定义主题
3. **暗黑模式**：实现自动暗黑模式切换功能
4. **主题编辑器**：开发可视化主题编辑工具
5. **性能优化**：优化主题切换的性能和用户体验

## 下一步学习

明天我们将学习「Element Plus 国际化深入应用」，包括：
- 多语言配置系统
- 动态语言切换
- 自定义语言包
- 国际化最佳实践
```