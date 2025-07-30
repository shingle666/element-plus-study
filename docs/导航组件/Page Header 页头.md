# Page Header 页头

## 概述

如果页面的路径比较简单，推荐使用页头组件而非面包屑组件。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

## 基础用法

### 基础用法

简单场景下的标准页头。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script setup>
const goBack = () => {
  console.log('go back')
}
</script>
```

### 自定义图标

默认图标可能无法满足您的需求，您可以通过设置 `icon` 属性来自定义图标。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
</script>
```

### 无图标

有时，页面全是元素，您可能不想展示页面上方的图标，您可以设置 `icon` 属性值为 `null` 来去除它。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="null">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>
```

### 面包屑导航

使用页头组件，您可以通过添加插槽 `breadcrumb` 来设置面包屑路由导航。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header>
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="./page-header.html">route 1</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>
```

### 额外操作部分

头部可能会变得很复杂，您可以在头部添加更多的区块，以允许丰富的交互。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="null">
    <template #content>
      <div class="flex items-center">
        <el-avatar
          :size="32"
          class="mr-3"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> Title </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          Sub title
        </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
  </el-page-header>
</template>
```

### 主要内容

有时我们想让页头显示一些协同响应内容，我们可以使用 `default` 插槽。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="./page-header.html">route 1</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <div class="flex items-center">
        <el-avatar
          class="mr-3"
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> Title </span>
        <span
          class="text-sm mr-2"
          style="color: var(--el-text-color-regular)"
        >
          Sub title
        </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
    <el-descriptions :column="3" size="small" class="mt-4">
      <el-descriptions-item label="Username">
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item label="Telephone">
        18100000000
      </el-descriptions-item>
      <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
    <p class="mt-4 text-sm">
      Your additional content can be added with default slot, You may put as many content as you want here.
    </p>
  </el-page-header>
</template>

<script setup>
import { ElNotification as notify } from 'element-plus'

const onBack = () => {
  notify('Back')
}
</script>
```

### 组件插槽结构

本组件由这些部件构成：<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header>
    <!-- Line 1 -->
    <template #breadcrumb />
    <!-- Line 2 -->
    <template #icon />
    <template #title />
    <template #content />
    <template #extra />
    <!-- Lines after 2 -->
    <template #default />
  </el-page-header>
</template>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| icon | Page Header 的图标 Icon 组件 | string / Component | Back |
| title | Page Header 的主标题，默认是 Back (内置 a11y) | string | '' |
| content | Page Header 的内容 | string | '' |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| back | 点击左侧区域触发 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

### Slots

| 名称 | 说明 |
|------|------|
| icon | 图标内容 |
| title | 标题内容 |
| content | 内容 |
| extra | 扩展设置 |
| breadcrumb | 面包屑导航内容 |
| default | 默认内容 |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

## 最佳实践

1. **简单路径优先**：当页面路径比较简单时，优先使用页头组件而非面包屑组件
2. **图标选择**：根据页面功能选择合适的图标，或在不需要时设置为 `null`
3. **内容布局**：合理使用各个插槽，保持页头信息的层次清晰
4. **响应式设计**：在移动端考虑简化页头内容，避免信息过载
5. **交互一致性**：确保返回按钮的行为与用户预期一致

## 常见问题

### Q: 如何隐藏默认的返回图标？
A: 设置 `icon` 属性为 `null` 或空字符串即可隐藏默认图标。

### Q: 页头组件与面包屑组件如何选择？
A: 当页面路径比较简单时推荐使用页头组件，复杂的多层级路径建议使用面包屑组件。

### Q: 如何在页头中添加更多操作按钮？
A: 使用 `extra` 插槽可以在页头右侧添加操作按钮或其他元素。

### Q: 页头的返回事件如何处理？
A: 监听 `@back` 事件，在事件处理函数中实现具体的返回逻辑，如路由跳转或历史记录回退。