# Menu 菜单

## 学习目标

通过本章学习，你将掌握：
- 基础菜单结构和垂直菜单布局
- 水平菜单布局和菜单分组
- 子菜单展开和菜单项状态
- 菜单路由集成和权限控制
- 菜单主题定制和响应式菜单

**预计学习时间：** 105分钟

## 概述

为网站提供导航功能的菜单。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

## 基础用法

### 顶栏

顶部栏菜单可以在各种场景中使用。导航菜单默认为垂直模式，通过将 `mode` 属性设置为 `horizontal` 来使导航菜单变更为水平模式。另外，在菜单中通过 `sub-menu` 组件可以生成二级菜单。Menu 还提供了 `background-color`、`text-color` 和 `active-text-color`，分别用于设置菜单的背景色、菜单的文字颜色和当前激活菜单的文字颜色。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-sub-menu index="2">
      <template #title>我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>消息中心</el-menu-item>
    <el-menu-item index="4">订单管理</el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

### 侧栏

垂直菜单，可内嵌子菜单。通过 `el-menu-item-group` 组件可以实现菜单进行分组，分组名可以通过 `title` 属性直接设定，也可以通过具名 slot 来设定。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-row class="tac">
    <el-col :span="12">
      <h5>默认颜色</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>导航一</span>
          </template>
          <el-menu-item-group title="分组一">
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <span>导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>导航四</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

### 折叠

垂直导航菜单可以被折叠。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">展开</el-radio-button>
    <el-radio-button :label="true">收起</el-radio-button>
  </el-radio-group>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template #title><span>分组一</span></template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>导航二</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><document /></el-icon>
      <template #title>导航三</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

## API

### Menu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| mode | 菜单展示模式 | enum | vertical |
| collapse | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） | boolean | false |
| ellipsis | 是否省略多余的子项（仅在横向模式生效） | boolean | true |
| ellipsis-icon | 自定义省略图标 (仅在水平模式下可用) | string / Component | — |
| popper-offset | 弹出层的偏移量(对所有子菜单有效) | number | 6 |
| default-active | 页面加载时默认激活菜单的 index | string | '' |
| default-openeds | 默认打开的 sub-menu 的 index 的数组 | object[] | [] |
| unique-opened | 是否只保持一个子菜单的展开 | boolean | false |
| menu-trigger | 子菜单打开的触发方式，只在 mode 为 horizontal 时有效 | enum | hover |
| router | 是否启用 vue-router 模式 | boolean | false |
| collapse-transition | 是否开启折叠动画 | boolean | true |
| popper-effect | Tooltip 主题，内置了 dark / light 两种主题，当菜单折叠时生效 | enum / string | dark |
| close-on-click-outside | 可选，单击外部时是否折叠菜单 | boolean | false |
| popper-class | 为 popper 添加类名 | string | — |
| show-timeout | 菜单出现前的延迟 | number | 300 |
| hide-timeout | 菜单消失前的延迟 | number | 300 |
| background-color | 菜单的背景颜色 (十六进制格式) | string | #ffffff |
| text-color | 菜单的文字颜色 (十六进制格式) | string | #303133 |
| active-text-color | 活动菜单项的文本颜色（十六进制格式） | string | #409eff |
| persistent | 当菜单处于非活动状态且 persistent 为 false 时，下拉菜单将被销毁 | boolean | true |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| select | 菜单激活回调 | Function |
| open | sub-menu 展开的回调 | Function |
| close | sub-menu 收起的回调 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Methods

| 方法名 | 说明 | 类型 |
|--------|------|------|
| open | 打开一个特定的子菜单，参数是要打开的子菜单的索引 | Function |
| close | 关闭一个特定的子菜单，参数是要关闭子菜单的索引 | Function |
| updateActiveIndex | 通过索引激活指定菜单 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### SubMenu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| index | 唯一标志 | string | — |
| popper-class | 为 popper 添加类名 | string | — |
| show-timeout | 子菜单出现之前的延迟 | number | — |
| hide-timeout | 子菜单消失之前的延迟 | number | — |
| disabled | 是否禁用 | boolean | false |
| teleported | 是否将弹出菜单挂载到 body 上 | boolean | undefined |
| popper-offset | 弹出窗口的偏移量 | number | — |
| expand-close-icon | 父菜单展开且子菜单关闭时的图标 | string / Component | — |
| expand-open-icon | 父菜单展开且子菜单打开时的图标 | string / Component | — |
| collapse-close-icon | 父菜单收起且子菜单关闭时的图标 | string / Component | — |
| collapse-open-icon | 父菜单收起且子菜单打开时的图标 | string / Component | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### SubMenu Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |
| title | 自定义标题内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| index | 唯一标志 | string | — |
| route | Vue Route 路由位置参数 | string / object | — |
| disabled | 是否禁用 | boolean | false |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| click | 点击菜单项时回调函数, 参数为菜单项实例 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |
| title | 自定义标题内容 |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item-Group Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 组标题 | string | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item-Group Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 默认插槽内容 | Menu-Item |
| title | 自定义组标题内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

## 最佳实践

1. **菜单结构设计**：保持菜单层级简单，避免过深的嵌套，一般不超过3层
2. **路由集成**：启用 `router` 模式可以与 Vue Router 无缝集成，提升用户体验
3. **响应式设计**：在移动端考虑使用折叠菜单，节省屏幕空间
4. **图标使用**：合理使用图标可以提升菜单的可识别性和美观度
5. **状态管理**：使用 `default-active` 和 `default-openeds` 正确设置菜单的初始状态

## 常见问题

### Q: 菜单项点击后没有反应？
A: 检查是否正确设置了 `index` 属性，确保每个菜单项都有唯一的 `index` 值。

### Q: 如何实现菜单与路由的联动？
A: 设置 `router="true"` 属性，并确保菜单项的 `index` 值与路由路径一致。

### Q: 折叠菜单后子菜单无法正常显示？
A: 确保在折叠模式下使用了正确的插槽结构，特别是 `#title` 插槽的使用。

### Q: 如何自定义菜单的样式？
A: 可以通过 CSS 变量或直接设置 `background-color`、`text-color`、`active-text-color` 属性来自定义样式。

## 实践项目

### 菜单系统实现

创建一个完整的管理系统导航菜单，包含以下功能：

1. **多级菜单系统**
   - 垂直导航菜单
   - 水平顶部菜单
   - 多层级子菜单

2. **菜单功能特性**
   - 菜单折叠展开
   - 菜单项状态管理
   - 菜单权限控制

3. **路由集成**
   - 菜单与路由联动
   - 动态菜单生成
   - 面包屑导航配合

### 实践要点

- 设计合理的菜单层级结构
- 实现菜单的响应式布局
- 处理菜单的权限验证
- 优化菜单的用户体验

## 学习检查清单

- [ ] 掌握基础菜单结构的创建
- [ ] 理解垂直和水平菜单布局
- [ ] 熟练使用菜单分组功能
- [ ] 掌握子菜单展开和状态管理
- [ ] 理解菜单路由集成机制
- [ ] 完成菜单系统的实践项目

## 注意事项

1. **导航的层级结构**
   - 菜单层级不宜过深，建议不超过3层
   - 保持菜单结构的逻辑性和一致性
   - 合理使用菜单分组功能

2. **用户操作的一致性**
   - 菜单项的交互行为要统一
   - 激活状态的视觉反馈要明确
   - 菜单的展开收起要有合适的动画

3. **移动端的适配**
   - 在小屏幕设备上使用折叠菜单
   - 考虑触摸操作的便利性
   - 优化菜单的响应式布局

4. **导航的可访问性**
   - 确保菜单支持键盘导航
   - 提供合适的ARIA标签
   - 考虑屏幕阅读器的兼容性

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**