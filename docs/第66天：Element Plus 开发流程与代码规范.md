# 第66天：Element Plus 开发流程与代码规范

## 学习目标

* 了解 Element Plus 的开发流程和贡献指南
* 掌握项目的代码规范和最佳实践
* 学习如何设置开发环境和调试工具
* 理解组件开发的标准流程

## 知识点概览

### 1. Element Plus 项目结构

#### 1.1 项目架构概览

```
element-plus/
├── packages/                    # 核心包目录
│   ├── components/             # 组件源码
│   │   ├── button/            # 按钮组件
│   │   ├── input/             # 输入框组件
│   │   └── ...
│   ├── directives/            # 指令
│   ├── hooks/                 # 组合式函数
│   ├── locale/                # 国际化
│   ├── theme-chalk/           # 样式主题
│   ├── tokens/                # 设计令牌
│   └── utils/                 # 工具函数
├── docs/                       # 文档源码
├── play/                       # 开发调试环境
├── scripts/                    # 构建脚本
├── typings/                    # 类型定义
├── .github/                    # GitHub 配置
├── .vscode/                    # VS Code 配置
├── package.json
├── pnpm-workspace.yaml        # pnpm 工作空间配置
├── tsconfig.json              # TypeScript 配置
├── vite.config.ts             # Vite 配置
└── vitest.config.ts           # 测试配置
```

#### 1.2 开发环境配置

```bash
# 克隆项目
git clone https://github.com/element-plus/element-plus.git
cd element-plus

# 安装依赖（使用 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 类型检查
pnpm typecheck
```

### 2. 代码规范和风格指南

#### 2.1 TypeScript 代码规范

```typescript
// types/button.ts
// 组件类型定义规范

// 1. 导入顺序：第三方库 -> 内部模块 -> 类型导入
import { ExtractPropTypes, PropType } from 'vue'
import { isString } from '@element-plus/utils'
import type { Component } from 'vue'

// 2. 使用 const assertion 定义常量
export const buttonTypes = ['default', 'primary', 'success', 'warning', 'info', 'danger', 'text'] as const
export const buttonSizes = ['large', 'default', 'small'] as const
export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

// 3. Props 定义使用 buildProps 工具函数
export const buttonProps = buildProps({
  /**
   * @description button size
   */
  size: {
    type: String as PropType<ButtonSize>,
    validator: (val: string): val is ButtonSize => buttonSizes.includes(val as ButtonSize)
  },
  /**
   * @description disable the button
   */
  disabled: Boolean,
  /**
   * @description button type
   */
  type: {
    type: String as PropType<ButtonType>,
    values: buttonTypes,
    default: 'default'
  },
  /**
   * @description icon component
   */
  icon: {
    type: iconPropType
  },
  /**
   * @description determine whether it's loading
   */
  loading: Boolean,
  /**
   * @description customize loading icon component
   */
  loadingIcon: {
    type: iconPropType,
    default: () => Loading
  },
  /**
   * @description native button type
   */
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    values: buttonNativeTypes,
    default: 'button'
  },
  /**
   * @description determine whether it's a plain button
   */
  plain: Boolean,
  /**
   * @description determine whether it's a text button
   */
  text: Boolean,
  /**
   * @description determine whether it's a link button
   */
  link: Boolean,
  /**
   * @description determine whether the button is round
   */
  round: Boolean,
  /**
   * @description determine whether the button is circle
   */
  circle: Boolean,
  /**
   * @description custom button color, automatically calculate `hover` and `active` color
   */
  color: String,
  /**
   * @description dark mode, which automatically switches styles
   */
  dark: Boolean,
  /**
   * @description native autofocus attribute
   */
  autofocus: Boolean,
  /**
   * @description custom element tag
   */
  tag: {
    type: definePropType<string | Component>(String),
    default: 'button'
  }
} as const)

// 4. 导出类型
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonType = typeof buttonTypes[number]
export type ButtonSize = typeof buttonSizes[number]
export type ButtonNativeType = typeof buttonNativeTypes[number]

// 5. Emits 定义
export const buttonEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent
}
export type ButtonEmits = typeof buttonEmits

// 6. 组件实例类型
export type ButtonInstance = InstanceType<typeof Button>
```

#### 2.2 Vue 组件规范

```vue
<!-- Button.vue -->
<!-- 1. 模板结构清晰，使用语义化标签 -->
<template>
  <component
    :is="tag"
    ref="_ref"
    :class="[
      ns.b(),
      ns.m(buttonType),
      ns.m(buttonSize),
      ns.is('disabled', buttonDisabled),
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('text', text),
      ns.is('link', link),
      ns.is('has-bg', hasBackground)
    ]"
    :aria-disabled="buttonDisabled || loading ? 'true' : 'false'"
    :disabled="buttonDisabled || loading || undefined"
    :autofocus="autofocus"
    :type="tag === 'button' ? nativeType : undefined"
    :style="buttonStyle"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <el-icon v-else :class="ns.is('loading')">
        <component :is="loadingIcon" />
      </el-icon>
    </template>
    <el-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </el-icon>
    <span
      v-if="$slots.default"
      :class="{ [ns.em('text', 'expand')]: shouldAddSpace }"
    >
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
// 2. 导入顺序规范
import { computed, inject, ref, useSlots } from 'vue'
import { ElIcon } from '@element-plus/components/icon'
import {
  useDisabled,
  useFormItem,
  useGlobalConfig,
  useNamespace,
  useSize
} from '@element-plus/hooks'
import { buttonGroupContextKey } from '@element-plus/tokens'
import { TinyColor } from '@ctrl/tinycolor'
import { buttonEmits, buttonProps } from './button'
import type { ButtonEmits, ButtonProps } from './button'

// 3. 定义组件选项
defineOptions({
  name: 'ElButton',
  inheritAttrs: false
})

// 4. Props 和 Emits
const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)

// 5. 组合式函数使用
const slots = useSlots()
const buttonGroupContext = inject(buttonGroupContextKey, undefined)
const globalConfig = useGlobalConfig('button')
const ns = useNamespace('button')
const { form } = useFormItem()
const _size = useSize(computed(() => buttonGroupContext?.size))
const _disabled = useDisabled()
const _ref = ref<HTMLButtonElement>()

// 6. 计算属性
const buttonSize = computed(() => props.size || _size.value || 'default')
const buttonDisabled = computed(() => props.disabled || _disabled.value || false)
const buttonType = computed(() => props.type || buttonGroupContext?.type || 'default')

const autoInsertSpace = computed(
  () => props.autoInsertSpace ?? globalConfig.value?.autoInsertSpace ?? false
)

// 检查是否需要在文字两侧添加空格
const shouldAddSpace = computed(() => {
  const defaultSlot = slots.default?.()
  if (autoInsertSpace.value && defaultSlot?.length === 1) {
    const slot = defaultSlot[0]
    if (slot?.type === Text) {
      const text = slot.children as string
      return /^\p{Unified_Ideograph}{2}$/u.test(text.trim())
    }
  }
  return false
})

// 7. 样式计算
const buttonStyle = computed(() => {
  let styles: CSSProperties = {}
  
  const buttonColor = props.color
  if (buttonColor) {
    const color = new TinyColor(buttonColor)
    const activeBgColor = props.dark
      ? color.tint(20).toString()
      : color.shade(10).toString()
    
    if (props.plain) {
      styles = {
        '--el-button-bg-color': props.dark
          ? color.tint(90).toString()
          : color.tint(90).toString(),
        '--el-button-text-color': buttonColor,
        '--el-button-border-color': props.dark
          ? color.tint(50).toString()
          : color.tint(50).toString(),
        '--el-button-hover-text-color': `var(--el-color-white)`,
        '--el-button-hover-bg-color': buttonColor,
        '--el-button-hover-border-color': buttonColor,
        '--el-button-active-bg-color': activeBgColor,
        '--el-button-active-text-color': `var(--el-color-white)`,
        '--el-button-active-border-color': activeBgColor
      }
    } else {
      const hoverBgColor = props.dark
        ? color.tint(20).toString()
        : color.tint(20).toString()
      
      styles = {
        '--el-button-bg-color': buttonColor,
        '--el-button-border-color': buttonColor,
        '--el-button-hover-bg-color': hoverBgColor,
        '--el-button-hover-border-color': hoverBgColor,
        '--el-button-active-bg-color': activeBgColor,
        '--el-button-active-border-color': activeBgColor
      }
    }
    
    if (buttonDisabled.value) {
      const disabledButtonColor = props.dark
        ? color.tint(50).toString()
        : color.tint(50).toString()
      
      styles['--el-button-disabled-bg-color'] = disabledButtonColor
      styles['--el-button-disabled-border-color'] = disabledButtonColor
    }
  }
  
  return styles
})

const hasBackground = computed(() => {
  return (
    props.type !== 'text' &&
    props.type !== 'link' &&
    !props.plain
  )
})

// 8. 事件处理
const handleClick = (evt: MouseEvent) => {
  if (props.nativeType === 'reset') {
    form?.resetFields()
  }
  emit('click', evt)
}

// 9. 暴露给父组件的方法和属性
defineExpose({
  /** @description button html element */
  ref: _ref,
  /** @description button size */
  size: buttonSize,
  /** @description button type */
  type: buttonType,
  /** @description button disabled */
  disabled: buttonDisabled
})
</script>
```

#### 2.3 样式规范 (SCSS)

```scss
// button.scss
// 1. 使用 BEM 命名规范
@use 'sass:map';
@use 'mixins/mixins' as *;
@use 'mixins/utils' as *;
@use 'mixins/var' as *;
@use 'common/var' as *;

// 2. 组件变量定义
$button-font-weight: getCssVar('font-weight-primary') !default;
$button-border-width: getCssVar('border-width') !default;
$button-border-style: getCssVar('border-style') !default;
$button-border-color: getCssVar('border-color') !default;
$button-border-radius: getCssVar('border-radius-base') !default;
$button-bg-color: getCssVar('color-white') !default;
$button-font-size: getCssVar('font-size-base') !default;
$button-outline-color: getCssVar('color-primary-light-5') !default;
$button-active-color: getCssVar('color-primary-dark-2') !default;

// 3. 主要样式块
@include b(button) {
  // 基础样式
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
  transition: 0.1s;
  font-weight: $button-font-weight;
  user-select: none;
  vertical-align: middle;
  -webkit-appearance: none;
  background-color: getCssVar('button-bg-color');
  border: $button-border-width $button-border-style
    getCssVar('button-border-color');
  border-radius: $button-border-radius;
  font-size: $button-font-size;
  padding: getCssVar('button-padding-vertical')
    getCssVar('button-padding-horizontal');

  // 悬停状态
  &:hover,
  &:focus {
    color: getCssVar('button-hover-text-color');
    border-color: getCssVar('button-hover-border-color');
    background-color: getCssVar('button-hover-bg-color');
    outline: none;
  }

  // 激活状态
  &:active {
    color: getCssVar('button-active-text-color');
    border-color: getCssVar('button-active-border-color');
    background-color: getCssVar('button-active-bg-color');
    outline: none;
  }

  // 焦点状态
  &:focus-visible {
    outline: 2px solid getCssVar('button-outline-color');
    outline-offset: 1px;
  }

  // 4. 修饰符样式
  @include m(primary) {
    @include button-variant(
      getCssVar('color-white'),
      getCssVar('color-primary'),
      getCssVar('color-primary')
    );
  }

  @include m(success) {
    @include button-variant(
      getCssVar('color-white'),
      getCssVar('color-success'),
      getCssVar('color-success')
    );
  }

  @include m(warning) {
    @include button-variant(
      getCssVar('color-white'),
      getCssVar('color-warning'),
      getCssVar('color-warning')
    );
  }

  @include m(danger) {
    @include button-variant(
      getCssVar('color-white'),
      getCssVar('color-danger'),
      getCssVar('color-danger')
    );
  }

  @include m(info) {
    @include button-variant(
      getCssVar('color-white'),
      getCssVar('color-info'),
      getCssVar('color-info')
    );
  }

  // 5. 尺寸变体
  @include m(large) {
    @include set-css-var-value('button-size', getCssVar('component-size-large'));
    height: getCssVar('button-size');
    padding: getCssVar('button-large-padding-vertical')
      getCssVar('button-large-padding-horizontal');
    font-size: getCssVar('button-large-font-size');
    border-radius: getCssVar('button-large-border-radius');
  }

  @include m(small) {
    @include set-css-var-value('button-size', getCssVar('component-size-small'));
    height: getCssVar('button-size');
    padding: getCssVar('button-small-padding-vertical')
      getCssVar('button-small-padding-horizontal');
    font-size: getCssVar('button-small-font-size');
    border-radius: getCssVar('button-small-border-radius');
  }

  // 6. 状态样式
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

  @include when(loading) {
    position: relative;
    pointer-events: none;

    &:before {
      // loading 遮罩
      z-index: 1;
      pointer-events: none;
      content: '';
      position: absolute;
      left: -1px;
      top: -1px;
      right: -1px;
      bottom: -1px;
      border-radius: inherit;
      background-color: getCssVar('mask-color-extra-light');
    }
  }

  @include when(plain) {
    @include css-var-from-global('button-hover-text-color', 'color-primary');
    @include css-var-from-global('button-hover-bg-color', 'color-primary-light-9');
    @include css-var-from-global('button-hover-border-color', 'color-primary');
  }

  @include when(round) {
    border-radius: getCssVar('border-radius-round');
  }

  @include when(circle) {
    border-radius: 50%;
    padding: getCssVar('button-padding-vertical');
    width: getCssVar('button-size');
    height: getCssVar('button-size');
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
      background-color: transparent !important;
      border-color: transparent !important;
    }
  }

  // 7. 元素样式
  @include e(text) {
    @include m(expand) {
      letter-spacing: 0.3em;
      margin-right: -0.3em;
    }
  }

  // 8. 图标样式
  .#{$namespace}-icon {
    & + span {
      margin-left: getCssVar('button-icon-span-gap');
    }

    svg {
      vertical-align: bottom;
    }

    @include when(loading) {
      animation: rotating 2s linear infinite;
    }
  }

  // 9. 响应式设计
  @include res(phone) {
    @include m(large) {
      padding: getCssVar('button-padding-vertical')
        getCssVar('button-padding-horizontal');
      font-size: getCssVar('button-font-size');
    }
  }
}

// 10. 按钮组样式
@include b(button-group) {
  @include utils-clearfix;
  display: inline-block;
  vertical-align: middle;

  &::before,
  &::after {
    display: table;
    content: '';
  }

  &::after {
    clear: both;
  }

  & > .#{$namespace}-button {
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

    &:hover,
    &:focus,
    &:active {
      z-index: 1;
    }

    @include when(active) {
      z-index: 1;
    }
  }

  & > .#{$namespace}-dropdown {
    & > .#{$namespace}-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left-color: getCssVar('button-group-border-color');
    }
  }

  @each $type in (primary, success, warning, danger, info) {
    .#{$namespace}-button--#{$type} {
      &:first-child {
        border-right-color: getCssVar('button', $type, 'border-color');
      }

      &:last-child {
        border-left-color: getCssVar('button', $type, 'border-color');
      }

      &:not(:first-child):not(:last-child) {
        border-left-color: getCssVar('button', $type, 'border-color');
        border-right-color: getCssVar('button', $type, 'border-color');
      }
    }
  }
}
```

### 3. 测试规范

#### 3.1 单元测试规范

```typescript
// __tests__/button.test.tsx
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test, vi } from 'vitest'
import { Loading, Search } from '@element-plus/icons-vue'
import Button from '../src/button.vue'
import ButtonGroup from '../src/button-group.vue'

// 1. 测试组织结构
describe('Button', () => {
  // 2. 基础功能测试
  describe('basic functionality', () => {
    it('should render correctly', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Test Button'
        }
      })
      
      expect(wrapper.text()).toBe('Test Button')
      expect(wrapper.classes()).toContain('el-button')
    })

    it('should handle click events', async () => {
      const handleClick = vi.fn()
      const wrapper = mount(Button, {
        props: {
          onClick: handleClick
        },
        slots: {
          default: 'Click Me'
        }
      })

      await wrapper.trigger('click')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', async () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  // 3. Props 测试
  describe('props', () => {
    it('should render different types correctly', () => {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      
      types.forEach(type => {
        const wrapper = mount(Button, {
          props: { type }
        })
        expect(wrapper.classes()).toContain(`el-button--${type}`)
      })
    })

    it('should render different sizes correctly', () => {
      const sizes = ['large', 'default', 'small']
      
      sizes.forEach(size => {
        const wrapper = mount(Button, {
          props: { size }
        })
        if (size !== 'default') {
          expect(wrapper.classes()).toContain(`el-button--${size}`)
        }
      })
    })

    it('should show loading state', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        }
      })

      expect(wrapper.classes()).toContain('is-loading')
      expect(wrapper.findComponent(Loading).exists()).toBe(true)
    })

    it('should render custom loading icon', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true,
          loadingIcon: Search
        }
      })

      expect(wrapper.findComponent(Search).exists()).toBe(true)
    })

    it('should render icon correctly', () => {
      const wrapper = mount(Button, {
        props: {
          icon: Search
        }
      })

      expect(wrapper.findComponent(Search).exists()).toBe(true)
    })
  })

  // 4. 插槽测试
  describe('slots', () => {
    it('should render icon slot', () => {
      const wrapper = mount(Button, {
        slots: {
          icon: '<i class="custom-icon"></i>'
        }
      })

      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })

    it('should render loading slot', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        },
        slots: {
          loading: '<span class="custom-loading">Loading...</span>'
        }
      })

      expect(wrapper.find('.custom-loading').exists()).toBe(true)
    })
  })

  // 5. 事件测试
  describe('events', () => {
    it('should not trigger click when disabled', async () => {
      const handleClick = vi.fn()
      const wrapper = mount(Button, {
        props: {
          disabled: true,
          onClick: handleClick
        }
      })

      await wrapper.trigger('click')
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not trigger click when loading', async () => {
      const handleClick = vi.fn()
      const wrapper = mount(Button, {
        props: {
          loading: true,
          onClick: handleClick
        }
      })

      await wrapper.trigger('click')
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  // 6. 样式测试
  describe('styles', () => {
    it('should apply custom color', () => {
      const customColor = '#ff0000'
      const wrapper = mount(Button, {
        props: {
          color: customColor
        }
      })

      const style = wrapper.attributes('style')
      expect(style).toContain('--el-button-bg-color')
    })

    it('should add space between Chinese characters', async () => {
      const wrapper = mount(Button, {
        props: {
          autoInsertSpace: true
        },
        slots: {
          default: '按钮'
        }
      })

      await nextTick()
      expect(wrapper.find('.el-button__text--expand').exists()).toBe(true)
    })
  })

  // 7. 可访问性测试
  describe('accessibility', () => {
    it('should have correct aria attributes when disabled', () => {
      const wrapper = mount(Button, {
        props: {
          disabled: true
        }
      })

      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('should have correct aria attributes when loading', () => {
      const wrapper = mount(Button, {
        props: {
          loading: true
        }
      })

      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
  })
})

// 8. 按钮组测试
describe('ButtonGroup', () => {
  it('should render button group correctly', () => {
    const wrapper = mount(ButtonGroup, {
      slots: {
        default: `
          <el-button>Button 1</el-button>
          <el-button>Button 2</el-button>
        `
      },
      global: {
        components: {
          'el-button': Button
        }
      }
    })

    expect(wrapper.classes()).toContain('el-button-group')
    expect(wrapper.findAllComponents(Button)).toHaveLength(2)
  })

  it('should apply group size to buttons', () => {
    const wrapper = mount(ButtonGroup, {
      props: {
        size: 'large'
      },
      slots: {
        default: '<el-button>Button</el-button>'
      },
      global: {
        components: {
          'el-button': Button
        }
      }
    })

    const button = wrapper.findComponent(Button)
    expect(button.vm.size).toBe('large')
  })
})
```

#### 3.2 E2E 测试规范

```typescript
// e2e/button.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Button E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/button')
  })

  test('should render basic button', async ({ page }) => {
    const button = page.locator('.el-button').first()
    await expect(button).toBeVisible()
    await expect(button).toHaveText('Default')
  })

  test('should handle click interaction', async ({ page }) => {
    const button = page.locator('[data-testid="click-button"]')
    const counter = page.locator('[data-testid="click-counter"]')
    
    await expect(counter).toHaveText('0')
    await button.click()
    await expect(counter).toHaveText('1')
  })

  test('should show loading state', async ({ page }) => {
    const loadingButton = page.locator('[data-testid="loading-button"]')
    await loadingButton.click()
    
    await expect(loadingButton).toHaveClass(/is-loading/)
    await expect(loadingButton.locator('.el-icon')).toBeVisible()
  })

  test('should be keyboard accessible', async ({ page }) => {
    const button = page.locator('.el-button').first()
    
    // 使用 Tab 键聚焦
    await page.keyboard.press('Tab')
    await expect(button).toBeFocused()
    
    // 使用 Enter 键激活
    await page.keyboard.press('Enter')
    // 验证点击效果
  })

  test('should support different themes', async ({ page }) => {
    const primaryButton = page.locator('.el-button--primary').first()
    const successButton = page.locator('.el-button--success').first()
    
    await expect(primaryButton).toHaveCSS('background-color', 'rgb(64, 158, 255)')
    await expect(successButton).toHaveCSS('background-color', 'rgb(103, 194, 58)')
  })

  test('should work in button group', async ({ page }) => {
    const buttonGroup = page.locator('.el-button-group').first()
    const buttons = buttonGroup.locator('.el-button')
    
    await expect(buttons).toHaveCount(3)
    
    // 检查第一个按钮的边框半径
    const firstButton = buttons.first()
    await expect(firstButton).toHaveCSS('border-top-right-radius', '0px')
    await expect(firstButton).toHaveCSS('border-bottom-right-radius', '0px')
  })
})
```

### 4. 文档规范

#### 4.1 组件文档结构

```markdown
# Button 按钮

常用的操作按钮。

## 基础用法

基础的按钮用法。

:::demo 使用 `type`、`plain`、`round` 和 `circle` 属性来定义 Button 的样式。

button/basic

:::

## 禁用状态

按钮不可用状态。

:::demo 你可以使用 `disabled` 属性来定义按钮是否可用，它接受一个 `Boolean` 值。

button/disabled

:::

## 链接按钮

没有边框和背景色的按钮。

:::demo 使用 `link` 属性创建链接按钮，通常用于页面内的功能性链接。

button/link

:::

## 文字按钮

没有边框和背景色的按钮。

:::demo 使用 `text` 属性创建文字按钮。

button/text

:::

## 图标按钮

带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。

:::demo 设置 `icon` 属性即可，icon 的列表可以参考 Element Plus 的 icon 组件，也可以设置在文字右边的 icon ，只要使用 `i` 标签即可，可以使用自定义图标。

button/icon

:::

## 按钮组

以按钮组的方式出现，常用于多项类似操作。

:::demo 使用 `<el-button-group>` 标签来嵌套你的按钮。

button/group

:::

## 加载中

点击按钮后进行数据加载操作，在按钮上显示加载状态。

:::demo 要设置为 loading 状态，只要设置 `loading` 属性为 `true` 即可。

button/loading

:::

## 不同尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 额外的尺寸：`large`、`small`，通过设置 `size` 属性来配置它们。

button/size

:::

## 自定义颜色

您可以自定义按钮颜色。

:::demo 我们将自动计算 hover 和 active 颜色。

button/custom-color

:::

## Button API

### Button Attributes

| 属性名                | 说明                                                         | 类型                                                         | 默认值    |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | --------- |
| size                  | 尺寸                                                         | `enum` - `'large'\| 'default' \| 'small'`                    | —         |
| type                  | 类型                                                         | `enum` - `'primary'\| 'success' \| 'warning' \| 'danger' \| 'info'` | —         |
| plain                 | 是否朴素按钮                                                 | `boolean`                                                    | `false`   |
| text ^(2.2.0)         | 是否文字按钮                                                 | `boolean`                                                    | `false`   |
| link ^(2.2.1)         | 是否链接按钮                                                 | `boolean`                                                    | `false`   |
| round                 | 是否圆角按钮                                                 | `boolean`                                                    | `false`   |
| circle                | 是否圆形按钮                                                 | `boolean`                                                    | `false`   |
| loading               | 是否加载中状态                                               | `boolean`                                                    | `false`   |
| loading-icon          | 自定义加载中状态图标组件                                     | `string \| Component`                                        | `Loading` |
| disabled              | 按钮是否为禁用状态                                           | `boolean`                                                    | `false`   |
| icon                  | 图标组件                                                     | `string \| Component`                                        | —         |
| autofocus             | 原生 `autofocus` 属性                                        | `boolean`                                                    | `false`   |
| native-type           | 原生 `type` 属性                                             | `enum` - `'button' \| 'submit' \| 'reset'`                   | `button`  |
| auto-insert-space     | 自动在两个中文字符之间插入空格                               | `boolean`                                                    | —         |
| color                 | 自定义按钮颜色, 并自动计算 `hover` 和 `active` 触发后的颜色 | `string`                                                     | —         |
| dark                  | dark 模式, 意味着自动设置 `color` 为 dark 模式的颜色        | `boolean`                                                    | `false`   |
| tag ^(2.3.4)          | 自定义元素标签                                               | `string \| Component`                                        | `button`  |

### Button Events

| 事件名 | 说明             | 类型                      |
| ------ | ---------------- | ------------------------- |
| click  | 点击按钮时触发   | `(event: MouseEvent) => void` |

### Button Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |
| loading | 自定义加载中组件 |
| icon    | 自定义图标组件 |

### Button Exposes

| 名称     | 说明           | 类型                 |
| -------- | -------------- | -------------------- |
| ref      | 按钮 html 元素 | `Ref<HTMLButtonElement>` |
| size     | 按钮尺寸       | `ComputedRef<string>`    |
| type     | 按钮类型       | `ComputedRef<string>`    |
| disabled | 按钮是否禁用   | `ComputedRef<boolean>`   |

## ButtonGroup API

### ButtonGroup Attributes

| 属性名 | 说明                                             | 类型                                              | 默认值 |
| ------ | ------------------------------------------------ | ------------------------------------------------- | ------ |
| size   | 用于控制该按钮组内按钮的大小                     | `enum` - `'large' \| 'default' \| 'small'`        | —      |
| type   | 用于控制该按钮组内按钮的类型                     | `enum` - `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | —      |

### ButtonGroup Slots

| 插槽名  | 说明                    | 子标签 |
| ------- | ----------------------- | ------ |
| default | 自定义按钮组内容        | Button |
```

## 实践练习

### 练习 1：创建自定义按钮组件

基于 Element Plus 的代码规范，创建一个自定义的按钮组件：
1. 支持所有标准按钮功能
2. 添加自定义动画效果
3. 完整的 TypeScript 类型定义
4. 完善的测试用例

### 练习 2：贡献代码到 Element Plus

尝试为 Element Plus 项目贡献代码：
1. Fork 项目并设置开发环境
2. 找到一个 issue 或提出改进建议
3. 按照规范编写代码
4. 提交 Pull Request

### 练习 3：编写组件文档

为自定义组件编写完整的文档：
1. API 文档
2. 使用示例
3. 最佳实践指南
4. 常见问题解答

## 学习资源

* [Element Plus 官方仓库](https://github.com/element-plus/element-plus)
* [Element Plus 贡献指南](https://github.com/element-plus/element-plus/blob/dev/.github/CONTRIBUTING.md)
* [Vue 3 风格指南](https://vuejs.org/style-guide/)
* [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

## 作业

1. 完成所有实践练习
2. 阅读 Element Plus 源码，理解组件实现原理
3. 参与 Element Plus 社区讨论
4. 尝试修复一个简单的 bug 或添加小功能

## 下一步学习计划

接下来我们将学习 **Element Plus 代码贡献与 Pull Request 流程**，深入了解如何参与开源项目的开发和维护。