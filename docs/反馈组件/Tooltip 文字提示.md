# Tooltip 文字提示

## 学习目标

通过本章学习，你将掌握：
- **基础文字提示**：掌握 Tooltip 的基本使用方法和属性配置
- **主题和样式**：学会使用内置主题和自定义样式
- **位置控制**：掌握提示框的位置设置和自动调整
- **触发方式**：理解不同触发方式的应用场景
- **HTML内容支持**：安全地使用HTML内容和富文本
- **虚拟触发**：实现高级的虚拟触发功能
- **受控模式**：掌握手动控制提示框的显示和隐藏
- **性能优化**：优化提示框的渲染和交互性能

**预计学习时间：** 45分钟

## 概述

Tooltip 文字提示组件常用于展示鼠标 hover 时的提示信息。它基于 ElPopper 开发，提供了丰富的配置选项和多种展示方式。Tooltip 支持多个方向的展示位置、自定义主题、HTML 内容、虚拟触发等高级功能。

## 基础用法

### 基础用法

在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。使用 `content` 属性来决定 hover 时的提示信息。由 `placement` 属性决定展示效果：`placement` 属性值为：`[方向]-[对齐位置]`；四个方向：`top`、`left`、`right`、`bottom`；三种对齐位置：`start`、`end`，默认为空。如 `placement="left-end"`，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。

```vue
<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Left prompts info"
        placement="top-start"
      >
        <el-button>top-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Center prompts info"
        placement="top"
      >
        <el-button>top</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Right prompts info"
        placement="top-end"
      >
        <el-button>top-end</el-button>
      </el-tooltip>
    </div>
    
    <div class="row">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Left Top prompts info"
        placement="left-start"
      >
        <el-button>left-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Right Top prompts info"
        placement="right-start"
      >
        <el-button>right-start</el-button>
      </el-tooltip>
    </div>
    
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <el-button>bottom-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <el-button>bottom</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <el-button>bottom-end</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
```

### 主题

Tooltip 组件内置了两个主题：`dark` 和 `light`。通过设置 `effect` 来修改主题，默认值为 `dark`。

```vue
<template>
  <el-tooltip content="Top center" placement="top">
    <el-button>Dark</el-button>
  </el-tooltip>
  
  <el-tooltip content="Bottom center" placement="bottom" effect="light">
    <el-button>Light</el-button>
  </el-tooltip>
  
  <el-tooltip content="Bottom center" effect="customized">
    <el-button>Customized theme</el-button>
  </el-tooltip>
</template>

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}
.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
```

### 更多内容的文字提示

展示多行文本或者是设置文本内容的格式。用具名 slot `content`，替代 tooltip 中的 `content` 属性。

```vue
<template>
  <el-tooltip placement="top">
    <template #content>
      multiple lines<br />second line
    </template>
    <el-button>Top center</el-button>
  </el-tooltip>
</template>
```

### 高级扩展

除了这些基本设置外，还有一些属性可以让使用者更好的定制自己的效果：`transition` 属性可以定制显隐的动画效果，默认为 `fade-in-linear`。如果需要关闭 tooltip 功能，`disabled` 属性可以满足这个需求，你只需要将其设置为 `true`。

```vue
<template>
  <el-tooltip
    :disabled="disabled"
    content="点击关闭 tooltip 功能"
    placement="bottom"
    effect="light"
  >
    <el-button @click="disabled = !disabled">
      点击{{ disabled ? '开启' : '关闭' }} tooltip 功能
    </el-button>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
const disabled = ref(false)
</script>
```

### 显示 HTML 内容

内容属性可以设置为 HTML 字符串。

```vue
<template>
  <el-tooltip raw-content>
    <template #content>
      <span>HTML content with <strong>bold text</strong></span>
    </template>
    <el-button>HTML Content</el-button>
  </el-tooltip>
</template>
```

**警告**：`content` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 `raw-content` 打开的情况下，请确保 `content` 的内容是可信的，永远不要将用户提交的内容赋值给 `content` 属性。

### 虚拟触发

有时候我们想把 tooltip 的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。

```vue
<template>
  <el-button ref="triggerRef">Trigger</el-button>
  
  <el-tooltip
    ref="tooltipRef"
    virtual-triggering
    :virtual-ref="triggerRef"
    content="Virtual trigger content"
  />
</template>

<script setup>
import { ref } from 'vue'
const triggerRef = ref()
const tooltipRef = ref()
</script>
```

**提示**：需要注意的是，虚拟触发的 tooltip 是受控组件，因此你必须自己去控制 tooltip 是否显示，你将无法通过点击空白处来关闭 tooltip。

### 受控模式

Tooltip 可以通过父组件使用 `:visible` 来控制它的显示与关闭。

```vue
<template>
  <el-tooltip
    :visible="visible"
    content="Controlled tooltip"
    placement="top"
  >
    <el-button @click="visible = !visible">
      Click to {{ visible ? 'hide' : 'show' }} tooltip
    </el-button>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

### 自定义动画

Tooltip 可以自定义动画，您可以使用 `transition` 设置所需的动画效果。

```vue
<template>
  <el-tooltip
    content="Custom animation"
    transition="my-fade"
    placement="top"
  >
    <el-button>Custom Animation</el-button>
  </el-tooltip>
</template>

<style>
.my-fade-enter-active,
.my-fade-leave-active {
  transition: opacity 0.5s ease;
}
.my-fade-enter-from,
.my-fade-leave-to {
  opacity: 0;
}
</style>
```

## API

### Attributes

| 名称 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | CSSSelector / HTMLElement | — | — |
| effect | Tooltip 主题，内置了 dark / light 两种 | string | dark / light | dark |
| content | 显示的内容，也可被 slot#content 覆盖 | string | — | '' |
| raw-content | content 中的内容是否作为 HTML 字符串处理 | boolean | — | false |
| placement | Tooltip 组件出现的位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| fallback-placements | Tooltip 可用的 positions 请查看 popper.js 文档 | array | — | — |
| visible / v-model:visible | Tooltip 组件可见性 | boolean | — | — |
| disabled | Tooltip 组件是否禁用 | boolean | — | — |
| offset | 出现位置的偏移量 | number | — | 12 |
| transition | 动画名称 | string | — | — |
| popper-options | popper.js 参数 | object | — | {} |
| arrow-offset | 控制 Tooltip 的箭头相对于弹出窗口的偏移 | number | — | 5 |
| show-after | 在触发后多久显示内容，单位毫秒 | number | — | 0 |
| show-arrow | tooltip 的内容是否有箭头 | boolean | — | true |
| hide-after | 延迟关闭，单位毫秒 | number | — | 200 |
| auto-close | tooltip 出现后自动隐藏延时，单位毫秒 | number | — | 0 |
| popper-class | 为 Tooltip 的 popper 添加类名 | string | — | — |
| enterable | 鼠标是否可进入到 tooltip 中 | boolean | — | true |
| teleported | 是否使用 teleport。设置成 true 则会被追加到 append-to 的位置 | boolean | — | true |
| trigger | 如何触发 Tooltip | string | hover / focus / click / contextmenu | hover |
| virtual-triggering | 用来标识虚拟触发是否被启用 | boolean | — | — |
| virtual-ref | 标识虚拟触发时的触发元素 | HTMLElement | — | — |
| trigger-keys | 当鼠标点击或者聚焦在触发元素上时，可以定义一组键盘按键并且通过它们来控制 Tooltip 的显示 | Array | — | ['Enter', 'Space'] |
| persistent | 当 tooltip 组件长时间不触发且 persistent 属性设置为 false 时，popconfirm 将会被删除 | boolean | — | — |
| aria-label | a11y 和 aria-label 属性保持一致 | string | — | — |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | Tooltip 触发 & 引用的元素 |
| content | 自定义内容 |

### Exposes

| 名称 | 详情 | 类型 |
|------|------|------|
| popperRef | el-popper 组件实例 | object |
| contentRef | el-tooltip-content 组件实例 | object |
| isFocusInsideContent | 验证当前焦点事件是否在 el-tooltip-content 中触发 | Function |

## 最佳实践

1. **选择合适的触发方式**：
   - `hover`：最常用，适合大多数提示场景
   - `focus`：适合表单元素的帮助信息
   - `click`：适合需要用户主动触发的场景
   - `contextmenu`：适合右键菜单场景

2. **合理设置位置**：根据页面布局选择合适的 `placement`，避免提示框超出视窗

3. **控制内容长度**：避免提示内容过长，影响用户体验

4. **谨慎使用 HTML 内容**：只在必要时使用 `raw-content`，确保内容安全

5. **性能优化**：对于大量 Tooltip，考虑使用虚拟触发或单例模式

6. **无障碍访问**：设置合适的 `aria-label` 属性，提升可访问性

## 常见问题

1. **Q: Tooltip 不显示？**
   A: 检查触发元素是否能接收相应的事件，确保 `disabled` 属性未设置为 `true`

2. **Q: 如何在 disabled 的表单元素上显示 Tooltip？**
   A: 在 disabled 表单元素外层添加一层包裹元素，将 Tooltip 应用到包裹元素上

3. **Q: Tooltip 内容可以包含链接吗？**
   A: Tooltip 内不支持 `router-link` 组件，请使用 `vm.$router.push` 代替

4. **Q: 如何自定义 Tooltip 的样式？**
   A: 使用 `popper-class` 属性添加自定义类名，或者使用 `effect` 属性设置自定义主题

5. **Q: 虚拟触发模式下如何关闭 Tooltip？**
   A: 虚拟触发的 Tooltip 是受控组件，需要手动控制 `visible` 属性来关闭

6. **Q: 如何设置 Tooltip 的延迟显示和隐藏？**
   A: 使用 `show-after` 和 `hide-after` 属性分别控制显示和隐藏的延迟时间

## 实践项目

### 智能提示系统
创建一个完整的智能提示系统，包含以下功能：

1. **多场景提示**
   - 实现表单字段的帮助提示
   - 支持按钮和图标的功能说明
   - 处理数据展示的详细信息提示

2. **自适应提示**
   - 实现提示内容的自动截断和展开
   - 支持动态内容的加载和更新
   - 处理多语言环境下的提示显示

3. **主题定制系统**
   - 实现多套提示主题
   - 支持暗黑模式和亮色模式
   - 处理品牌色彩的定制

4. **提示管理器**
   - 实现提示的全局配置
   - 支持提示的批量控制
   - 处理提示的性能监控

### 实践要点
- 合理选择触发方式和显示时机
- 实现提示内容的动态加载
- 处理提示的位置自适应
- 确保提示的无障碍访问
- 优化大量提示的性能

## 学习检查清单

### 基础功能
- [ ] 掌握 Tooltip 的基本使用方法
- [ ] 理解不同触发方式的特点
- [ ] 熟练使用 `placement`、`effect` 等基础属性
- [ ] 掌握 `content` 和插槽的使用

### 高级功能
- [ ] 实现虚拟触发功能
- [ ] 处理HTML内容的安全显示
- [ ] 自定义提示的样式和动画
- [ ] 实现受控模式的提示

### 性能优化
- [ ] 理解提示的渲染机制
- [ ] 合理使用延迟显示和隐藏
- [ ] 优化提示的内存使用
- [ ] 处理大量提示的性能问题

### 用户体验
- [ ] 实现提示的响应式设计
- [ ] 处理键盘导航和焦点管理
- [ ] 提供清晰的视觉层次
- [ ] 确保提示的无障碍访问

## 注意事项

### 弹出层的层级管理
- 合理设置提示的层级关系
- 避免提示被其他元素遮挡
- 注意提示与页面元素的层级冲突
- 控制同时显示的提示数量

### 用户操作的连贯性
- 保持提示操作的逻辑性
- 提供合适的显示和隐藏时机
- 避免过于频繁的提示显示
- 确保提示不会干扰用户操作

### 移动端的交互体验
- 在小屏幕设备上优化提示尺寸
- 支持触摸操作的提示触发
- 考虑手指遮挡对提示的影响
- 提供合适的触发区域大小

### 弹出层的性能影响
- 避免在提示中渲染复杂内容
- 使用合适的显示延迟减少闪烁
- 及时清理不需要的提示实例
- 监控提示对页面性能的影响

---

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 智能提示系统
- [ ] 多场景提示实现
- [ ] 自适应提示功能
- [ ] 主题定制系统
- [ ] 提示管理器