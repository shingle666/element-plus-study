# 第96天：基于 Element Plus 的组件库设计

## 学习目标
- 掌握基于 Element Plus 的组件库设计原则
- 学习组件库架构设计
- 了解组件库开发流程
- 实践组件库构建与发布

## 1. 组件库设计原则

### 1.1 设计理念
```markdown
- 一致性：保持设计风格统一
- 可复用性：组件高度可复用
- 可扩展性：支持功能扩展
- 易用性：API 设计简洁明了
- 可维护性：代码结构清晰
```

### 1.2 设计系统
```typescript
// 设计令牌定义
interface DesignTokens {
  colors: {
    primary: string
    success: string
    warning: string
    danger: string
    info: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, string>
    fontWeight: Record<string, number>
  }
}
```

## 2. 组件库架构设计

### 2.1 项目结构
```
my-ui-library/
├── packages/
│   ├── components/          # 组件源码
│   │   ├── button/
│   │   ├── input/
│   │   └── ...
│   ├── theme/              # 主题系统
│   ├── utils/              # 工具函数
│   └── tokens/             # 设计令牌
├── docs/                   # 文档站点
├── playground/             # 组件演示
├── build/                  # 构建配置
└── tests/                  # 测试文件
```

### 2.2 组件设计模式
```vue
<!-- 基础组件模板 -->n<template>
  <component
    :is="tag"
    :class="componentClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '../hooks'

interface Props {
  tag?: string
  type?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  type: 'primary',
  size: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ns = useNamespace('button')

const componentClasses = computed(() => [
  ns.b(),
  ns.m(props.type),
  ns.m(props.size),
  ns.is('disabled', props.disabled)
])

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return
  emit('click', event)
}
</script>
```

## 3. 主题系统设计

### 3.1 CSS 变量系统
```scss
// 主题变量定义
:root {
  // 颜色系统
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
  
  // 间距系统
  --el-spacing-xs: 4px;
  --el-spacing-sm: 8px;
  --el-spacing-md: 16px;
  --el-spacing-lg: 24px;
  --el-spacing-xl: 32px;
  
  // 字体系统
  --el-font-size-xs: 12px;
  --el-font-size-sm: 14px;
  --el-font-size-base: 16px;
  --el-font-size-lg: 18px;
  --el-font-size-xl: 20px;
}
```

### 3.2 主题切换实现
```typescript
// 主题管理器
class ThemeManager {
  private currentTheme = 'light'
  
  setTheme(theme: 'light' | 'dark' | string) {
    this.currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
    this.loadThemeVariables(theme)
  }
  
  private loadThemeVariables(theme: string) {
    const themeVariables = this.getThemeVariables(theme)
    Object.entries(themeVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
  
  private getThemeVariables(theme: string) {
    // 返回主题变量配置
    return themes[theme] || themes.light
  }
}
```

## 4. 组件开发流程

### 4.1 组件开发步骤
```markdown
1. 需求分析与设计
   - API 设计
   - 交互设计
   - 视觉设计

2. 组件实现
   - 基础功能实现
   - 样式开发
   - 类型定义

3. 测试编写
   - 单元测试
   - 集成测试
   - 视觉回归测试

4. 文档编写
   - API 文档
   - 使用示例
   - 最佳实践

5. 发布与维护
   - 版本发布
   - 问题修复
   - 功能迭代
```

### 4.2 组件质量保证
```typescript
// 组件测试示例
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button', () => {
  test('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
      slots: { default: 'Click me' }
    })
    
    expect(wrapper.classes()).toContain('el-button--primary')
    expect(wrapper.text()).toBe('Click me')
  })
  
  test('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  test('disabled state', () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })
    
    expect(wrapper.classes()).toContain('is-disabled')
  })
})
```

## 5. 构建与发布

### 5.1 构建配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['packages/**/*'],
      exclude: ['**/*.test.*']
    })
  ],
  build: {
    lib: {
      entry: 'packages/index.ts',
      name: 'MyUILibrary',
      fileName: (format) => `my-ui-library.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

### 5.2 发布流程
```json
{
  "scripts": {
    "build": "vite build",
    "build:types": "vue-tsc --declaration --emitDeclarationOnly",
    "test": "vitest",
    "lint": "eslint packages --ext .ts,.vue",
    "release": "npm run build && npm publish",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```

## 6. 实践项目

### 6.1 创建基础组件库
```bash
# 初始化项目
npm create vue@latest my-ui-library
cd my-ui-library

# 安装依赖
npm install
npm install -D @vitejs/plugin-vue vite-plugin-dts

# 创建组件
mkdir -p packages/components/button
```

### 6.2 组件库文档站点
```typescript
// docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My UI Library',
  description: '基于 Element Plus 的组件库',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: {
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' }
          ]
        }
      ]
    }
  }
})
```

## 7. 最佳实践

### 7.1 组件设计原则
- 保持 API 简洁一致
- 提供合理的默认值
- 支持插槽和事件
- 考虑无障碍访问
- 提供完整的类型定义

### 7.2 性能优化
- 按需加载
- Tree Shaking 支持
- 样式隔离
- 组件懒加载

## 总结

今天学习了基于 Element Plus 的组件库设计，包括设计原则、架构设计、主题系统、开发流程和构建发布。通过实践项目，掌握了组件库开发的完整流程。

## 作业

1. 设计一个基础组件库的架构
2. 实现一个简单的 Button 组件
3. 配置组件库的构建和发布流程
4. 编写组件的单元测试
5. 创建组件库文档站点