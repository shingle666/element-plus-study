# Popover 弹出框

## 学习目标

通过本章学习，你将掌握：
- **基础弹出框**：掌握 Popover 的基本使用方法和属性配置
- **弹出框触发方式**：学会使用不同的触发方式（hover、click、focus等）
- **弹出框位置设置**：掌握弹出框的位置控制和自动调整
- **弹出框内容定制**：实现丰富的弹出框内容和交互
- **弹出框箭头样式**：自定义弹出框的箭头和样式
- **弹出框事件处理**：掌握各种事件的监听和处理
- **弹出框性能优化**：优化弹出框的渲染和内存使用

**预计学习时间：** 75分钟

## 概述

Popover 是一个轻量级的弹出框组件，基于 ElTooltip 开发。它可以在用户悬停、点击或聚焦元素时显示额外的信息或操作。Popover 支持多种触发方式和丰富的自定义选项，适用于显示详细信息、操作菜单或复杂内容。

## 基础用法

### 基础用法

`trigger` 属性被用来决定 popover 的触发方式，支持的触发方式：`hover`、`click`、`focus` 或 `contextmenu`。如果你想手动控制它，可以设置 `:visible` 属性。

```vue
<template>
  <el-popover
    placement="top-start"
    title="Title"
    :width="200"
    trigger="hover"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button>Hover to activate</el-button>
    </template>
  </el-popover>
  
  <el-popover
    placement="bottom"
    title="Title"
    :width="200"
    trigger="click"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button>Click to activate</el-button>
    </template>
  </el-popover>
  
  <el-popover
    placement="right"
    title="Title"
    :width="200"
    trigger="focus"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button>Focus to activate</el-button>
    </template>
  </el-popover>
  
  <el-popover
    :visible="visible"
    placement="bottom"
    title="Title"
    :width="200"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <el-button @click="visible = !visible">Manual to activate</el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

### 展示位置

Popover 弹出框提供 9 种展示位置。使用 `content` 属性来设置悬停时显示的信息。由 `placement` 属性决定 Popover 弹出框的位置。该属性值格式为：`[方向]-[对齐位置]`，可供选择的四个方向分别是 `top`、`left`、`right`、`bottom`，可供选择的三种对齐方式分别是 `start`、`end`、`null`，默认的对齐方式为 `null`。

```vue
<template>
  <div class="popover-base-box">
    <div class="row center">
      <el-popover
        class="box-item"
        title="Title"
        content="Top Left prompts info"
        placement="top-start"
      >
        <template #reference>
          <el-button>top-start</el-button>
        </template>
      </el-popover>
      
      <el-popover
        class="box-item"
        title="Title"
        content="Top Center prompts info"
        placement="top"
      >
        <template #reference>
          <el-button>top</el-button>
        </template>
      </el-popover>
      
      <el-popover
        class="box-item"
        title="Title"
        content="Top Right prompts info"
        placement="top-end"
      >
        <template #reference>
          <el-button>top-end</el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>
```

### 虚拟触发

像 Tooltip 一样，Popover 可以由虚拟元素触发，这个功能就很适合使用在触发元素和展示内容元素是分开的场景。通常我们使用 `#reference` 来放置我们的触发元素，用 `triggering-element` API，您可以任意设置您的触发元素，但注意到触发元素应该是接受 mouse 和 keyboard 事件的元素。

```vue
<template>
  <el-button ref="buttonRef" v-click-outside="onClickOutside">
    Click me
  </el-button>
  
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    title="With title"
    virtual-triggering
  >
    <span>Some content</span>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, unref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'

const buttonRef = ref()
const popoverRef = ref()

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.()
}
</script>
```

### 内容可扩展

可以在 Popover 中嵌套其它组件，以下为嵌套表格的例子。利用插槽取代 `content` 属性。

```vue
<template>
  <el-popover placement="right" :width="400" trigger="click">
    <template #reference>
      <el-button>Click to activate</el-button>
    </template>
    
    <el-table :data="gridData">
      <el-table-column width="150" property="date" label="date" />
      <el-table-column width="100" property="name" label="name" />
      <el-table-column width="300" property="address" label="address" />
    </el-table>
  </el-popover>
</template>

<script lang="ts" setup>
const gridData = [
  {
    date: '2016-05-02',
    name: 'Jack',
    address: 'New York City',
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'New York City',
  },
]
</script>
```

### 嵌套操作

当然，你还可以嵌套操作，它比使用 dialog 更加轻量。

```vue
<template>
  <el-popover
    :width="300"
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
  >
    <template #reference>
      <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
    </template>
    
    <template #default>
      <div class="demo-rich-content" style="display: flex; gap: 16px; flex-direction: column">
        <el-avatar
          :size="60"
          src="https://avatars.githubusercontent.com/u/72015883?v=4"
          style="margin-bottom: 8px"
        />
        <div>
          <p class="demo-rich-content__name" style="margin: 0; font-weight: 500">
            Element Plus
          </p>
          <p class="demo-rich-content__mention" style="margin: 0; font-size: 14px; color: var(--el-color-info)">
            @element-plus
          </p>
        </div>
        <p class="demo-rich-content__desc" style="margin: 0">
          Element Plus, a Vue 3 based component library for developers, designers and product managers
        </p>
      </div>
    </template>
  </el-popover>
</template>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| trigger | 触发方式 | string | hover / click / focus / contextmenu | hover |
| trigger-keys | 当鼠标点击或者聚焦在触发元素上时，可以定义一组键盘按键并且通过它们来控制 Popover 的显示 | Array | — | ['Enter', 'Space'] |
| title | 标题 | string | — | — |
| effect | Tooltip 主题，Element Plus 内置了 dark / light 两种主题 | string | dark / light | light |
| content | 显示的内容，也可以通过写入默认 slot 修改显示内容 | string | — | '' |
| width | 宽度 | string / number | — | 150 |
| placement | 出现位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| disabled | Popover 是否可用 | boolean | — | false |
| visible / v-model:visible | Popover 是否显示 | boolean | — | false |
| offset | 浮层偏移量 | number | — | undefined |
| transition | 定义渐变动画 | string | — | el-fade-in-linear |
| show-arrow | 是否显示 Tooltip 箭头 | boolean | — | true |
| popper-options | popper.js 的参数 | object | — | {modifiers: [{name: 'computeStyles', options: {gpuAcceleration: false}}]} |
| popper-class | 为 popper 添加类名 | string | — | — |
| popper-style | 为 popper 自定义样式 | string / object | — | — |
| show-after | 在触发后多久显示内容，单位毫秒 | number | — | 0 |
| hide-after | 延迟关闭，单位毫秒 | number | — | 200 |
| auto-close | tooltip 出现后自动隐藏延时，单位毫秒 | number | — | 0 |
| tabindex | Popover 组件的 tabindex | number / string | — | 0 |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | boolean | — | true |
| append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | CSSSelector / HTMLElement | — | body |
| persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时，popover 将会被删除 | boolean | — | true |
| virtual-triggering | 是否启用虚拟触发器 | boolean | — | — |
| virtual-ref | 代表 tooltip 所要附加的参照元素 | HTMLElement | — | — |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| show | 显示时触发 | Function |
| before-enter | 显示动画播放前触发 | Function |
| after-enter | 显示动画播放完毕后触发 | Function |
| hide | 隐藏时触发 | Function |
| before-leave | 隐藏动画播放前触发 | Function |
| after-leave | 隐藏动画播放完毕后触发 | Function |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | Popover 内嵌 HTML 文本 |
| reference | 触发 Popover 显示的 HTML 元素 |

### Exposes

| 名称 | 详情 | 类型 |
|------|------|------|
| hide | 隐藏 popover | Function |

## 最佳实践

1. **选择合适的触发方式**：
   - `hover`：适用于显示提示信息
   - `click`：适用于显示操作菜单或复杂内容
   - `focus`：适用于表单元素的帮助信息
   - `contextmenu`：适用于右键菜单

2. **合理设置位置**：根据页面布局选择合适的 `placement`，避免弹出框超出视窗

3. **控制内容大小**：设置合适的 `width`，避免内容过长影响用户体验

4. **使用虚拟触发**：当触发元素和内容元素分离时，使用虚拟触发功能

5. **性能优化**：对于不常用的 Popover，可以设置 `persistent="false"` 来自动销毁

## 常见问题

1. **Q: Popover 不显示？**
   A: 检查 `trigger` 设置是否正确，确保触发元素能够接收相应的事件

2. **Q: 如何手动控制 Popover 的显示隐藏？**
   A: 使用 `v-model:visible` 绑定一个响应式变量来控制

3. **Q: Popover 位置不正确？**
   A: 检查 `placement` 设置，考虑使用 `offset` 进行微调

4. **Q: 在 SSR 环境下使用注意事项？**
   A: 需要将组件包裹在 `<client-only></client-only>` 中

5. **Q: v-popover 指令被废弃了吗？**
   A: 是的，建议使用 `virtual-ref` 作为替代方案

## 实践项目

### 信息提示弹框系统
创建一个完整的信息提示弹框系统，包含以下功能：

1. **多样化提示内容**
   - 实现文本提示、富文本提示、表格提示
   - 支持图片、图标、链接等多媒体内容
   - 处理动态内容的加载和更新

2. **智能位置调整**
   - 实现弹出框的自动位置调整
   - 处理边界检测和位置优化
   - 支持自定义位置偏移

3. **交互式弹出框**
   - 实现可交互的弹出框内容
   - 支持表单输入、按钮操作
   - 处理弹出框内的事件冒泡

4. **弹出框管理器**
   - 实现弹出框的全局管理
   - 支持弹出框的队列和优先级
   - 处理弹出框的生命周期

### 实践要点
- 合理选择触发方式和显示位置
- 实现弹出框内容的懒加载
- 处理弹出框的层级和遮挡问题
- 确保弹出框的无障碍访问
- 优化移动端的交互体验

## 学习检查清单

### 基础功能
- [ ] 掌握 Popover 的基本使用方法
- [ ] 理解不同触发方式的应用场景
- [ ] 熟练使用 `placement`、`width` 等基础属性
- [ ] 掌握 `content` 和插槽的使用

### 高级功能
- [ ] 实现虚拟触发功能
- [ ] 处理复杂的弹出框内容
- [ ] 自定义弹出框的样式和主题
- [ ] 实现弹出框的手动控制

### 性能优化
- [ ] 理解弹出框的渲染机制
- [ ] 合理使用 `persistent` 属性
- [ ] 优化弹出框的显示和隐藏动画
- [ ] 处理大量弹出框的性能问题

### 用户体验
- [ ] 实现弹出框的响应式设计
- [ ] 处理键盘导航和焦点管理
- [ ] 提供清晰的视觉反馈
- [ ] 确保弹出框的无障碍访问

## 注意事项

### 弹出层的层级管理
- 合理设置弹出框的层级关系
- 避免弹出框被其他元素遮挡
- 注意弹出框与页面元素的层级冲突
- 控制同时显示的弹出框数量

### 用户操作的连贯性
- 保持弹出框操作的逻辑性
- 提供明确的触发和关闭反馈
- 避免意外的弹出框显示
- 确保用户能够轻松关闭弹出框

### 移动端的交互体验
- 在小屏幕设备上优化弹出框尺寸
- 支持触摸操作和手势交互
- 考虑虚拟键盘对弹出框的影响
- 提供合适的触发区域大小

### 弹出层的性能影响
- 避免在弹出框中渲染过多内容
- 使用懒加载减少初始渲染时间
- 及时销毁不需要的弹出框实例
- 监控弹出框对页面性能的影响

---

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 信息提示弹框系统
- [ ] 多样化提示内容
- [ ] 智能位置调整
- [ ] 交互式弹出框
- [ ] 弹出框管理器