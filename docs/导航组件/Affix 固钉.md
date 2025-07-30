# Affix 固钉

## 概述

将页面元素固定在特定可视区域。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

## 基础用法

### 基础固钉

固钉默认固定在页面顶部。通过设置 `offset` 属性来改变吸顶距离，默认值为 0。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <el-affix :offset="120">
    <el-button type="primary">固定在距离顶部 120px 的位置</el-button>
  </el-affix>
</template>
```

### 指定容器

通过设置 `target` 属性，让固钉始终保持在容器内，超过范围则隐藏。请注意容器避免出现滚动条。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <div id="container" style="height: 400px; overflow: auto;">
    <el-affix target="#container" :offset="50">
      <el-button type="primary">固定在容器内</el-button>
    </el-affix>
  </div>
</template>
```

### 固定位置

Affix 组件提供 2 个固定的位置参数 `top` 和 `bottom`。通过设置 `position` 属性来改变固定位置，默认值为 `top`。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <el-affix position="bottom" :offset="20">
    <el-button type="primary">固定在底部</el-button>
  </el-affix>
</template>
```

## API

### Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| offset | 偏移距离 | number | 0 |
| position | 固钉位置 | enum | top |
| target | 指定容器（CSS 选择器） | string | — |
| z-index | z-index | number | 100 |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 固钉状态改变时触发的事件 | Function |
| scroll | 滚动时触发的事件 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### 暴露方法

| 名称 | 说明 | 类型 |
|------|------|------|
| update | 手动更新固钉状态 | Function |
| updateRoot | 手动更新根元素的盒模型信息 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

## 最佳实践

1. **合理设置偏移量**：根据页面布局设置合适的 `offset` 值，避免遮挡重要内容
2. **容器固钉**：在有限高度的容器中使用固钉时，确保容器不会出现滚动条
3. **性能考虑**：避免在固钉内容中放置过于复杂的组件，以免影响滚动性能
4. **响应式设计**：在不同屏幕尺寸下测试固钉效果，确保用户体验一致

## 常见问题

### Q: 固钉在某些情况下不生效？
A: 检查父容器的 CSS 属性，确保没有 `transform`、`perspective` 等会影响 `position: fixed` 的属性。

### Q: 如何在固钉状态改变时执行自定义逻辑？
A: 监听 `change` 事件，该事件会在固钉状态改变时触发，可以在回调中执行相应逻辑。

### Q: 固钉组件的 z-index 如何调整？
A: 通过 `z-index` 属性设置层级，默认值为 100，可根据页面需要调整。