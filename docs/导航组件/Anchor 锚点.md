# Anchor 锚点

## 概述

通过锚点，您可以很快找到当前页面上信息内容的位置。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

## 基础用法

### 基础锚点

最简单的用法。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-anchor>
    <el-anchor-link href="#basic-usage" title="基础用法" />
    <el-anchor-link href="#horizontal-mode" title="水平模式" />
    <el-anchor-link href="#scroll-container" title="滚动容器" />
  </el-anchor>
</template>
```

### 水平模式

水平排列的锚点。水平模式不支持 sub-link 槽位。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-anchor direction="horizontal">
    <el-anchor-link href="#part1" title="Part 1" />
    <el-anchor-link href="#part2" title="Part 2" />
    <el-anchor-link href="#part3" title="Part 3" />
  </el-anchor>
</template>
```

### 自定义滚动容器

自定义滚动区域，使用 `offset` props 可以设置锚点滚动偏移。监听 `link-click` 事件并阻止浏览器的默认行为，然后它不会改变历史。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <div style="height: 400px; overflow: auto;" id="scroll-container">
    <el-anchor 
      container="#scroll-container" 
      :offset="50"
      @link-click="handleLinkClick"
    >
      <el-anchor-link href="#section1" title="Section 1" />
      <el-anchor-link href="#section2" title="Section 2" />
    </el-anchor>
  </div>
</template>

<script setup>
const handleLinkClick = (e, link) => {
  e.preventDefault()
  // 自定义滚动逻辑
}
</script>
```

### 下划线类型

设置 `type="underline"` 更改为下划线类型。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-anchor type="underline">
    <el-anchor-link href="#section1" title="Section 1" />
    <el-anchor-link href="#section2" title="Section 2" />
  </el-anchor>
</template>
```

### 固定模式

使用 affix 组件来固定住页面中的锚点。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-affix :offset="50">
    <el-anchor>
      <el-anchor-link href="#section1" title="Section 1" />
      <el-anchor-link href="#section2" title="Section 2" />
    </el-anchor>
  </el-affix>
</template>
```

## API

### Anchor Attributes

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| container | 滚动的容器 | string / HTMLElement / Window | — |
| offset | 设置锚点滚动的偏移量 | number | 0 |
| bound | 触发锚点的元素的位置偏移量 | number | 15 |
| duration | 设置容器滚动持续时间，单位为毫秒 | number | 300 |
| marker | 是否显示标记 | boolean | true |
| type | 设置锚点类型 | enum | default |
| direction | 设置锚点方向 | enum | vertical |
| select-scroll-top | 滚动时，链接是否选中位于顶部 | boolean | false |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| change | step 改变时的回调 | Function |
| click | 当用户点击链接时触发 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| scrollTo | 手动滚动到特定位置 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Slots

| 名称 | 说明 |
|------|------|
| default | AnchorLink 组件列表 |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### AnchorLink Attributes

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 链接的文本内容 | string | — |
| href | 链接的地址 | string | — |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### AnchorLink Slots

| 名称 | 说明 |
|------|------|
| default | 链接的内容 |
| sub-link | 子链接的槽位 |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

## 最佳实践

1. **合理设置偏移量**：根据页面头部高度设置合适的 `offset` 值，确保锚点定位准确
2. **容器滚动**：在自定义滚动容器中使用时，确保容器有明确的高度和滚动属性
3. **链接命名**：使用语义化的 href 值，便于 SEO 和用户理解
4. **嵌套结构**：合理使用 sub-link 槽位创建层级结构，提升导航体验
5. **响应式适配**：在移动端考虑使用水平模式或简化锚点结构

## 常见问题

### Q: 锚点滚动不够平滑？
A: 可以通过调整 `duration` 属性来控制滚动动画时长，或者使用 CSS `scroll-behavior: smooth` 属性。

### Q: 如何在自定义容器中使用锚点？
A: 设置 `container` 属性指向滚动容器的选择器或 DOM 元素，确保容器有正确的滚动属性。

### Q: 锚点定位不准确怎么办？
A: 检查 `offset` 和 `bound` 属性设置，根据页面布局（如固定头部）调整偏移量。

### Q: 水平模式下子链接不显示？
A: 水平模式不支持 sub-link 槽位，如需层级结构请使用垂直模式。