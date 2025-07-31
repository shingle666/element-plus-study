# 第49天：Element Plus 自定义组件库开发

## 学习目标

今天我们将学习如何基于 Element Plus 开发自定义组件库，掌握组件库的设计、开发、打包和发布流程。

- 理解组件库架构设计原理
- 掌握组件库开发环境搭建
- 学习组件设计和开发规范
- 实现组件库的构建和打包
- 掌握组件库的发布和维护

## 1. 组件库架构设计

### 1.1 项目结构设计

```
my-ui-library/
├── packages/                    # 组件包目录
│   ├── components/              # 组件源码
│   │   ├── button/
│   │   │   ├── src/
│   │   │   │   ├── button.vue
│   │   │   │   └── button.ts
│   │   │   ├── index.ts
│   │   │   └── __tests__/
│   │   ├── input/
│   │   └── ...
│   ├── theme-chalk/             # 样式主题
│   │   ├── src/
│   │   │   ├── common/
│   │   │   ├── button.scss
│   │   │   ├── input.scss
│   │   │   └── index.scss
│   │   └── gulpfile.ts
│   ├── utils/                   # 工具函数
│   │   ├── src/
│   │   │   ├── dom.ts
│   │   │   ├── util.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                   # 组合式函数
│   │   ├── src/
│   │   │   ├── use-namespace.ts
│   │   │   ├── use-size.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── tokens/                  # 设计令牌
│   │   ├── src/
│   │   │   ├── button.ts
│   │   │   ├── form.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── my-ui/                   # 主包
│       ├── src/
│       │   ├── components.ts
│       │   ├── index.ts
│       │   └── make-installer.ts
│       └── index.ts
├── docs/                        # 文档站点
│   ├── .vitepress/
│   ├── components/
│   ├── guide/
│   └── examples/
├── playground/                  # 开发调试
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── scripts/                     # 构建脚本
│   ├── build.ts
│   ├── gen-version.ts
│   └── publish.ts
├── typings/                     # 类型定义
├── .github/                     # GitHub 配置
│   └── workflows/
├── build/                       # 构建配置
│   ├── vite.config.ts
│   └── rollup.config.ts
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

### 1.2 Monorepo 配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'docs'
  - 'playground'
```

```json
// package.json
{
  "name": "my-ui-library",
  "version": "1.0.0",
  "description": "A Vue 3 UI Library based on Element Plus",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "pnpm run -C playground dev",
    "build": "pnpm run build:components && pnpm run build:theme",
    "build:components": "pnpm run -r --filter=./packages/* build",
    "build:theme": "pnpm run -C packages/theme-chalk build",
    "docs:dev": "pnpm run -C docs dev",
    "docs:build": "pnpm run -C docs build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix",
    "typecheck": "vue-tsc --noEmit",
    "release": "node scripts/release.js",
    "publish:npm": "node scripts/publish.js"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-vue": "^4.0.0",
    "@vue/test-utils": "^2.4.0",
    "eslint": "^8.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "gulp": "^4.0.2",
    "gulp-sass": "^5.1.0",
    "jsdom": "^22.0.0",
    "sass": "^1.60.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0",
    "vitest": "^0.34.0",
    "vue": "^3.3.0",
    "vue-tsc": "^1.8.0"
  }
}
```

## 2. 组件开发规范

### 2.1 组件设计原则

```typescript
// packages/tokens/src/button.ts
export interface ButtonProps {
  /**
   * @description 按钮类型
   */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
  /**
   * @description 按钮尺寸
   */
  size?: 'large' | 'default' | 'small'
  /**
   * @description 是否为朴素按钮
   */
  plain?: boolean
  /**
   * @description 是否为圆角按钮
   */
  round?: boolean
  /**
   * @description 是否为圆形按钮
   */
  circle?: boolean
  /**
   * @description 是否为加载中状态
   */
  loading?: boolean
  /**
   * @description 是否禁用
   */
  disabled?: boolean
  /**
   * @description 图标组件
   */
  icon?: string | Component
  /**
   * @description 是否为自动获取焦点
   */
  autofocus?: boolean
  /**
   * @description 原生 type 属性
   */
  nativeType?: 'button' | 'submit' | 'reset'
  /**
   * @description 自定义元素标签
   */
  tag?: string | Component
}

export interface ButtonEmits {
  /**
   * @description 点击事件
   */
  click: [evt: MouseEvent]
}

export interface ButtonExpose {
  /**
   * @description 按钮元素引用
   */
  ref: Ref<HTMLButtonElement | undefined>
  /**
   * @description 按钮尺寸
   */
  size: ComputedRef<string>
  /**
   * @description 按钮类型
   */
  type: ComputedRef<string>
  /**
   * @description 是否禁用
   */
  disabled: ComputedRef<boolean>
}
```

### 2.2 组件实现

```vue
<!-- packages/components/button/src/button.vue -->
<template>
  <component
    :is="tag"
    ref="buttonRef"
    :class="[
      ns.b(),
      ns.m(buttonType),
      ns.m(buttonSize),
      ns.is('disabled', buttonDisabled),
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle)
    ]"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : undefined"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <my-icon v-else class="is-loading">
        <Loading />
      </my-icon>
    </template>
    <my-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </my-icon>
    
    <span
      v-if="$slots.default"
      :class="{ [ns.em('text', 'expand')]: shouldAddSpace }"
    >
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, inject, ref, Text, useSlots } from 'vue'
import { Loading } from '@element-plus/icons-vue'
import { useNamespace, useSize, useDisabled } from '@my-ui/hooks'
import { buttonEmits, buttonProps } from './button'
import MyIcon from '../../icon'

import type { ButtonEmits, ButtonProps } from './button'

defineOptions({
  name: 'MyButton'
})

const props = defineProps(buttonProps)
const emit = defineEmits<ButtonEmits>()
const slots = useSlots()

const buttonRef = ref<HTMLButtonElement>()
const ns = useNamespace('button')
const { size: buttonSize } = useSize(props)
const buttonDisabled = useDisabled(props)

const buttonType = computed(() => props.type || 'default')

const shouldAddSpace = computed(() => {
  const defaultSlot = slots.default?.()
  if (defaultSlot?.length === 1) {
    const slot = defaultSlot[0]
    if (slot?.type === Text) {
      const text = slot.children as string
      return /^\p{Unified_Ideograph}{2}$/u.test(text.trim())
    }
  }
  return false
})

const handleClick = (evt: MouseEvent) => {
  if (props.disabled || loading.value) return
  emit('click', evt)
}

defineExpose({
  ref: buttonRef,
  size: buttonSize,
  type: buttonType,
  disabled: buttonDisabled
})
</script>
```

### 2.3 组件类型定义

```typescript
// packages/components/button/src/button.ts
import { buildProps, definePropType } from '@my-ui/utils'
import type { ExtractPropTypes, Component } from 'vue'
import type Button from './button.vue'

export const buttonTypes = [
  'default',
  'primary',
  'success',
  'warning',
  'info',
  'danger'
] as const

export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

export const buttonProps = buildProps({
  /**
   * @description 按钮尺寸
   */
  size: {
    type: String,
    values: ['large', 'default', 'small'],
    default: ''
  },
  /**
   * @description 是否禁用
   */
  disabled: Boolean,
  /**
   * @description 按钮类型
   */
  type: {
    type: String,
    values: buttonTypes,
    default: ''
  },
  /**
   * @description 图标组件
   */
  icon: {
    type: definePropType<string | Component>([String, Object]),
    default: ''
  },
  /**
   * @description 原生 type 属性
   */
  nativeType: {
    type: String,
    values: buttonNativeTypes,
    default: 'button'
  },
  /**
   * @description 是否为加载中状态
   */
  loading: Boolean,
  /**
   * @description 是否为朴素按钮
   */
  plain: Boolean,
  /**
   * @description 是否为文字按钮
   */
  text: Boolean,
  /**
   * @description 是否为链接按钮
   */
  link: Boolean,
  /**
   * @description 是否显示文字按钮背景颜色
   */
  bg: Boolean,
  /**
   * @description 是否为自动获取焦点
   */
  autofocus: Boolean,
  /**
   * @description 是否为圆角按钮
   */
  round: Boolean,
  /**
   * @description 是否为圆形按钮
   */
  circle: Boolean,
  /**
   * @description 自定义按钮颜色, 并自动计算 hover 和 active 触发后的颜色
   */
  color: String,
  /**
   * @description dark 模式, 意味着自动设置 color 为 dark 模式的颜色
   */
  dark: Boolean,
  /**
   * @description 自定义元素标签
   */
  tag: {
    type: definePropType<string | Component>([String, Object]),
    default: 'button'
  }
} as const)

export const buttonEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = typeof buttonEmits
export type ButtonInstance = InstanceType<typeof Button>
```

## 3. 样式系统设计

### 3.1 SCSS 变量系统

```scss
// packages/theme-chalk/src/common/var.scss
:root {
  // 颜色系统
  --my-color-white: #ffffff;
  --my-color-black: #000000;
  --my-color-primary: #409eff;
  --my-color-success: #67c23a;
  --my-color-warning: #e6a23c;
  --my-color-danger: #f56c6c;
  --my-color-error: #f56c6c;
  --my-color-info: #909399;
  
  // 主色调色板
  --my-color-primary-light-3: #79bbff;
  --my-color-primary-light-5: #a0cfff;
  --my-color-primary-light-7: #c6e2ff;
  --my-color-primary-light-8: #d9ecff;
  --my-color-primary-light-9: #ecf5ff;
  --my-color-primary-dark-2: #337ecc;
  
  // 文本颜色
  --my-text-color-primary: #303133;
  --my-text-color-regular: #606266;
  --my-text-color-secondary: #909399;
  --my-text-color-placeholder: #a8abb2;
  --my-text-color-disabled: #c0c4cc;
  
  // 边框颜色
  --my-border-color: #dcdfe6;
  --my-border-color-light: #e4e7ed;
  --my-border-color-lighter: #ebeef5;
  --my-border-color-extra-light: #f2f6fc;
  --my-border-color-dark: #d4d7de;
  --my-border-color-darker: #cdd0d6;
  
  // 填充颜色
  --my-fill-color: #f0f2f5;
  --my-fill-color-light: #f5f7fa;
  --my-fill-color-lighter: #fafafa;
  --my-fill-color-extra-light: #fafcff;
  --my-fill-color-dark: #ebedf0;
  --my-fill-color-darker: #e6e8eb;
  --my-fill-color-blank: #ffffff;
  
  // 背景颜色
  --my-bg-color: #ffffff;
  --my-bg-color-page: #f2f3f5;
  --my-bg-color-overlay: #ffffff;
  
  // 尺寸
  --my-component-size-large: 40px;
  --my-component-size: 32px;
  --my-component-size-small: 24px;
  
  // 字体
  --my-font-size-extra-large: 20px;
  --my-font-size-large: 18px;
  --my-font-size-medium: 16px;
  --my-font-size-base: 14px;
  --my-font-size-small: 13px;
  --my-font-size-extra-small: 12px;
  
  // 字重
  --my-font-weight-primary: 500;
  
  // 行高
  --my-font-line-height-primary: 24px;
  
  // 边框
  --my-border-width: 1px;
  --my-border-style: solid;
  --my-border-color-hover: var(--my-text-color-disabled);
  --my-border: var(--my-border-width) var(--my-border-style) var(--my-border-color);
  --my-border-radius-base: 4px;
  --my-border-radius-small: 2px;
  --my-border-radius-round: 20px;
  --my-border-radius-circle: 100%;
  
  // 阴影
  --my-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08);
  --my-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.12);
  --my-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, 0.12);
  --my-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16);
  
  // 禁用透明度
  --my-disabled-opacity: 0.5;
  
  // 过渡
  --my-transition-duration: 0.3s;
  --my-transition-duration-fast: 0.2s;
  --my-transition-function-ease-in-out-bezier: cubic-bezier(0.645, 0.045, 0.355, 1);
  --my-transition-function-fast-bezier: cubic-bezier(0.23, 1, 0.32, 1);
  --my-transition-all: all var(--my-transition-duration) var(--my-transition-function-ease-in-out-bezier);
  --my-transition-fade: opacity var(--my-transition-duration) var(--my-transition-function-fast-bezier);
  --my-transition-md-fade: transform var(--my-transition-duration) var(--my-transition-function-fast-bezier), opacity var(--my-transition-duration) var(--my-transition-function-fast-bezier);
  --my-transition-fade-linear: opacity var(--my-transition-duration-fast) linear;
  --my-transition-border: border-color var(--my-transition-duration-fast) var(--my-transition-function-ease-in-out-bezier);
  --my-transition-box-shadow: box-shadow var(--my-transition-duration-fast) var(--my-transition-function-ease-in-out-bezier);
  --my-transition-color: color var(--my-transition-duration-fast) var(--my-transition-function-ease-in-out-bezier);
  
  // 层级
  --my-index-normal: 1;
  --my-index-top: 1000;
  --my-index-popper: 2000;
}
```

### 3.2 按钮组件样式

```scss
// packages/theme-chalk/src/button.scss
@use 'mixins/mixins' as *;
@use 'mixins/utils' as *;
@use 'mixins/button' as *;
@use 'common/var' as *;

@include b(button) {
  @include set-component-css-var('button', $button);
}

@include b(button) {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  min-height: getCssVar('component-size');
  white-space: nowrap;
  cursor: pointer;
  color: getCssVar('button-text-color');
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: getCssVar('transition-duration');
  font-weight: getCssVar('button-font-weight');
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: getCssVar('button-bg-color');
  border: getCssVar('border');
  border-color: getCssVar('button-border-color');
  padding: getCssVar('button-padding-vertical') getCssVar('button-padding-horizontal');
  font-size: getCssVar('button-font-size');
  border-radius: getCssVar('button-border-radius');
  
  &:hover,
  &:focus {
    color: getCssVar('button-hover-text-color');
    border-color: getCssVar('button-hover-border-color');
    background-color: getCssVar('button-hover-bg-color');
    outline: none;
  }
  
  &:active {
    color: getCssVar('button-active-text-color');
    border-color: getCssVar('button-active-border-color');
    background-color: getCssVar('button-active-bg-color');
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid getCssVar('button-outline-color');
    outline-offset: 1px;
  }
  
  > span {
    display: inline-flex;
    align-items: center;
  }
  
  & + & {
    margin-left: 12px;
  }
  
  @include button-size(
    getCssVar('button-padding-vertical'),
    getCssVar('button-padding-horizontal'),
    getCssVar('button-font-size'),
    getCssVar('button-border-radius')
  );
  
  @include when(loading) {
    position: relative;
    pointer-events: none;
    
    &:before {
      pointer-events: none;
      content: '';
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: inherit;
      background-color: getCssVar('mask-color', 'extra-light');
    }
  }
  
  @include when(disabled) {
    &,
    &:hover,
    &:focus {
      color: getCssVar('button-disabled-text-color');
      cursor: not-allowed;
      background-image: none;
      background-color: getCssVar('button-disabled-bg-color');
      border-color: getCssVar('button-disabled-border-color');
    }
  }
  
  [class*='#{$namespace}-icon'] {
    & + span {
      margin-left: 6px;
    }
    
    svg {
      vertical-align: bottom;
    }
  }
  
  @include when(round) {
    border-radius: getCssVar('border-radius-round');
  }
  
  @include when(circle) {
    border-radius: 50%;
    padding: getCssVar('button-padding-vertical');
    
    span {
      display: none;
    }
  }
  
  @include when(plain) {
    @include button-plain(getCssVar('button-text-color'));
  }
  
  @include when(text) {
    color: getCssVar('button-text-color');
    border: 0 solid transparent;
    background-color: transparent;
    
    @include when(disabled) {
      color: getCssVar('button-disabled-text-color');
      background-color: transparent !important;
    }
    
    &:not(.is-disabled) {
      &:hover,
      &:focus {
        background-color: getCssVar('button-hover-bg-color');
      }
      
      &:focus-visible {
        outline: 2px solid getCssVar('button-outline-color');
        outline-offset: 1px;
        border-radius: getCssVar('border-radius-base');
      }
      
      &:active {
        background-color: getCssVar('button-active-bg-color');
      }
    }
  }
  
  @include when(link) {
    border-color: transparent;
    color: getCssVar('button-text-color');
    background: transparent;
    padding: 2px;
    height: auto;
    
    &:hover,
    &:focus {
      color: getCssVar('button-hover-text-color');
    }
    
    @include when(disabled) {
      color: getCssVar('button-disabled-text-color');
    }
  }
  
  @include m(text) {
    @include button-variant(
      getCssVar('button-text-color'),
      transparent,
      transparent,
      getCssVar('button-hover-text-color'),
      getCssVar('button-hover-bg-color'),
      transparent,
      getCssVar('button-active-text-color'),
      getCssVar('button-active-bg-color'),
      transparent
    );
    
    @include when(disabled) {
      &,
      &:hover,
      &:focus {
        border-color: transparent;
      }
    }
  }
  
  @each $type in (primary, success, warning, danger, info) {
    @include m($type) {
      @include button-variant(
        getCssVar('color-white'),
        getCssVar('color', $type),
        getCssVar('color', $type),
        getCssVar('color-white'),
        getCssVar('color', $type, 'light-3'),
        getCssVar('color', $type, 'light-3'),
        getCssVar('color-white'),
        getCssVar('color', $type, 'dark-2'),
        getCssVar('color', $type, 'dark-2')
      );
      
      @include when(plain) {
        @include button-plain(getCssVar('color', $type));
      }
      
      @include when(text) {
        @include button-variant(
          getCssVar('color', $type),
          transparent,
          transparent,
          getCssVar('color-white'),
          getCssVar('color', $type),
          getCssVar('color', $type),
          getCssVar('color-white'),
          getCssVar('color', $type, 'dark-2'),
          getCssVar('color', $type, 'dark-2')
        );
      }
      
      @include when(link) {
        @include button-variant(
          getCssVar('color', $type),
          transparent,
          transparent,
          getCssVar('color', $type, 'light-3'),
          transparent,
          transparent,
          getCssVar('color', $type, 'dark-2'),
          transparent,
          transparent
        );
        
        @include when(disabled) {
          &,
          &:hover,
          &:focus {
            border-color: transparent;
          }
        }
      }
    }
  }
  
  @include m(large) {
    @include button-size(
      getCssVar('button-padding-vertical', 'large'),
      getCssVar('button-padding-horizontal', 'large'),
      getCssVar('button-font-size', 'large'),
      getCssVar('button-border-radius', 'large')
    );
    
    [class*='#{$namespace}-icon'] {
      & + span {
        margin-left: 8px;
      }
    }
  }
  
  @include m(small) {
    @include button-size(
      getCssVar('button-padding-vertical', 'small'),
      getCssVar('button-padding-horizontal', 'small'),
      getCssVar('button-font-size', 'small'),
      getCssVar('button-border-radius', 'small')
    );
    
    [class*='#{$namespace}-icon'] {
      & + span {
        margin-left: 4px;
      }
    }
  }
}

@include b(button-group) {
  @include set-component-css-var('button', $button);
}

@include b(button-group) {
  display: inline-flex;
  vertical-align: middle;
  
  &::after {
    clear: both;
  }
  
  & > :deep(.#{$namespace}-button) {
    float: left;
    position: relative;
    margin-left: 0;
    
    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: getCssVar('button-group-border-color');
    }
    
    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left-color: getCssVar('button-group-border-color');
    }
    
    &:not(:first-child):not(:last-child) {
      border-radius: 0;
      border-left-color: getCssVar('button-group-border-color');
      border-right-color: getCssVar('button-group-border-color');
    }
    
    &:not(:last-child) {
      margin-right: -1px;
    }
    
    &:first-child:last-child {
      border-top-right-radius: getCssVar('button-border-radius');
      border-bottom-right-radius: getCssVar('button-border-radius');
      border-top-left-radius: getCssVar('button-border-radius');
      border-bottom-left-radius: getCssVar('button-border-radius');
      
      &.is-round {
        border-radius: getCssVar('border-radius-round');
      }
      
      &.is-circle {
        border-radius: 50%;
      }
    }
    
    &:hover,
    &:focus,
    &:active {
      z-index: 1;
    }
    
    @include when(active) {
      z-index: 1;
    }
  }
  
  & > :deep(.#{$namespace}-dropdown) {
    & > .#{$namespace}-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left-color: getCssVar('button-group-border-color');
    }
  }
  
  @each $type in (primary, success, warning, danger, info) {
    .#{$namespace}-button--#{$type} {
      &:first-child {
        border-right-color: getCssVar('color', $type, 'dark-2');
      }
      
      &:last-child {
        border-left-color: getCssVar('color', $type, 'dark-2');
      }
      
      &:not(:first-child):not(:last-child) {
        border-left-color: getCssVar('color', $type, 'dark-2');
        border-right-color: getCssVar('color', $type, 'dark-2');
      }
    }
  }
}
```

## 4. 构建和打包

### 4.1 Vite 构建配置

```typescript
// build/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      skipDiagnostics: false,
      tsConfigFilePath: '../../tsconfig.json'
    })
  ],
  build: {
    target: 'es2018',
    lib: {
      entry: resolve(__dirname, '../packages/my-ui/index.ts'),
      name: 'MyUI',
      fileName: (format) => `my-ui.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named'
      }
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../packages')
    }
  }
})
```

### 4.2 构建脚本

```typescript
// scripts/build.ts
import { build } from 'vite'
import { resolve } from 'path'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'

const root = resolve(__dirname, '..')
const outDir = resolve(root, 'dist')

async function buildLibrary() {
  console.log('🚀 开始构建组件库...')
  
  // 清理输出目录
  if (existsSync(outDir)) {
    execSync(`rm -rf ${outDir}`)
  }
  mkdirSync(outDir, { recursive: true })
  
  // 构建组件
  await build({
    configFile: resolve(root, 'build/vite.config.ts'),
    build: {
      outDir
    }
  })
  
  // 构建样式
  console.log('📦 构建样式文件...')
  execSync('pnpm run -C packages/theme-chalk build', { stdio: 'inherit' })
  
  // 复制样式文件到输出目录
  const stylesSrc = resolve(root, 'packages/theme-chalk/dist')
  const stylesDest = resolve(outDir, 'theme-chalk')
  execSync(`cp -r ${stylesSrc} ${stylesDest}`)
  
  // 复制 package.json
  copyFileSync(
    resolve(root, 'packages/my-ui/package.json'),
    resolve(outDir, 'package.json')
  )
  
  // 复制 README.md
  copyFileSync(
    resolve(root, 'README.md'),
    resolve(outDir, 'README.md')
  )
  
  console.log('✅ 构建完成！')
}

buildLibrary().catch(console.error)
```

## 5. 实践练习

### 练习1：组件开发
```typescript
// 开发一个自定义 Input 组件
// 1. 设计组件 API
// 2. 实现组件逻辑
// 3. 编写组件样式
// 4. 添加类型定义
```

### 练习2：主题定制
```scss
// 创建自定义主题
// 1. 定义颜色变量
// 2. 实现主题切换
// 3. 支持暗黑模式
// 4. 组件样式适配
```

### 练习3：构建优化
```typescript
// 优化构建配置
// 1. 按需加载支持
// 2. Tree-shaking 优化
// 3. 代码分割策略
// 4. 性能监控
```

### 练习4：文档站点
```vue
<!-- 构建组件文档 -->
<!-- 1. VitePress 配置 -->
<!-- 2. 组件示例展示 -->
<!-- 3. API 文档生成 -->
<!-- 4. 在线演示功能 -->
```

## 学习资源

### 官方文档
- [Vue 3 组件开发](https://cn.vuejs.org/guide/components/)
- [Vite 构建工具](https://vitejs.dev/)
- [TypeScript 类型系统](https://www.typescriptlang.org/)

### 开源项目
- [Element Plus](https://github.com/element-plus/element-plus)
- [Ant Design Vue](https://github.com/vueComponent/ant-design-vue)
- [Naive UI](https://github.com/tusen-ai/naive-ui)

### 工具和库
- [Vue SFC Playground](https://sfc.vuejs.org/)
- [Rollup.js](https://rollupjs.org/)
- [Sass](https://sass-lang.com/)

## 作业

1. **组件库架构**：设计和搭建完整的组件库项目结构
2. **组件开发**：实现 3-5 个基础组件（Button、Input、Select 等）
3. **样式系统**：建立完整的设计令牌和样式系统
4. **构建配置**：配置组件库的构建和打包流程
5. **文档站点**：创建组件库的文档和演示站点

## 下一步学习

明天我们将学习「Element Plus 插件生态系统构建」，包括：
- 插件架构设计
- 插件开发规范
- 插件市场建设
- 社区生态维护
- 插件质量保证

## 总结

今天我们深入学习了基于 Element Plus 的自定义组件库开发：

1. **架构设计**：掌握了组件库的项目结构和 Monorepo 管理
2. **组件开发**：学习了组件设计原则和开发规范
3. **样式系统**：建立了完整的 SCSS 变量系统和样式架构
4. **类型系统**：实现了完善的 TypeScript 类型定义
5. **构建打包**：配置了 Vite 构建和自动化脚本

通过这些学习，你现在能够：
- 设计和搭建组件库架构
- 开发高质量的 Vue 3 组件
- 建立完整的样式和主题系统
- 配置现代化的构建流程
- 发布和维护组件库