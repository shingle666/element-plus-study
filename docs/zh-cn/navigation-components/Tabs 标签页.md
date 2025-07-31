# Tabs 标签页

## 学习目标

通过本章学习，你将掌握：
- 基础标签页和标签页位置设置
- 标签页类型样式和可关闭标签
- 动态标签页和标签页事件处理
- 标签页内容懒加载和自定义标签
- 标签页路由集成和最佳实践

**预计学习时间：** 120分钟

## 概述

Tabs 标签页是一种常用的导航组件，用于在同一页面中展示不同类别但相关联的内容。通过标签页的切换，用户可以在多个内容面板之间快速导航，有效节省页面空间并提升用户体验。<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="2">2</mcreference>

### 主要特性

- **多样式支持**：提供基础、卡片、边框卡片等多种视觉风格
- **灵活布局**：支持顶部、底部、左侧、右侧四个方向的标签位置
- **动态管理**：支持动态添加、删除标签页，满足复杂交互需求
- **自定义内容**：支持自定义标签标题，可添加图标等元素
- **延迟渲染**：提供懒加载功能，优化页面性能
- **事件丰富**：提供完整的事件回调，便于业务逻辑处理

### 适用场景

- **内容分类展示**：如产品详情的基本信息、规格参数、用户评价等
- **功能模块切换**：如管理后台的用户管理、权限设置、系统配置等
- **多步骤流程**：如表单向导、设置向导等分步骤操作
- **数据视图切换**：如图表的不同维度展示、报表的不同时间段等
- **工作区管理**：如代码编辑器的多文件标签、浏览器标签等

## 基础用法

### 基础用法

基础的、简洁的标签页。<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `value` 属性来指定当前选中的标签页。<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

```vue
<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="User" name="first">User</el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
```

### 卡片风格的标签

你可以设置具有卡片风格的标签。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

只需要设置 `type` 属性为 `card` 就可以使选项卡改变为标签风格。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

```vue
<template>
  <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane label="User" name="first">User</el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
```

### 带有边框的卡片风格

你还可以设置标签页为带有边框的卡片。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

将 `type` 设置为 `border-card`。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

```vue
<template>
  <el-tabs type="border-card">
    <el-tab-pane label="User">User</el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>
```

### 标签位置的设置

可以通过 `tab-position` 设置标签的位置。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

标签一共有四个方向的设置 `tabPosition="left|right|top|bottom"`。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

```vue
<template>
  <el-radio-group v-model="tabPosition" style="margin-bottom: 30px">
    <el-radio-button label="top">top</el-radio-button>
    <el-radio-button label="right">right</el-radio-button>
    <el-radio-button label="bottom">bottom</el-radio-button>
    <el-radio-button label="left">left</el-radio-button>
  </el-radio-group>
  <el-tabs :tab-position="tabPosition" style="height: 200px" class="demo-tabs">
    <el-tab-pane label="User">User</el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tabPosition = ref('left')
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
```

### 自定义标签页的内容

可以通过具名插槽来实现自定义标签页的内容。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

```vue
<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Route</span>
        </span>
      </template>
      Route
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Calendar } from '@element-plus/icons-vue'
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
```

### 动态增减标签页

增减标签页按钮只能在选项卡样式的标签页下使用。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/fe67f1fa6b93704f.md" index="2">2</mcreference>

```vue
<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    editable
    class="demo-tabs"
    @edit="handleTabsEdit"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabPaneName } from 'element-plus'

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const handleTabsEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
  if (action === 'add') {
    const newTabName = `${++tabIndex}`
    editableTabs.value.push({
      title: 'New Tab',
      name: newTabName,
      content: 'New Tab content',
    })
    editableTabsValue.value = newTabName
  } else if (action === 'remove') {
    const tabs = editableTabs.value
    let activeName = editableTabsValue.value
    if (activeName === targetName) {
      tabs.forEach((tab, index) => {
        if (tab.name === targetName) {
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if (nextTab) {
            activeName = nextTab.name
          }
        }
      })
    }
    editableTabsValue.value = activeName
    editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
  }
}
</script>
```

### 自定义增加标签页触发器

```vue
<template>
  <el-tabs v-model="editableTabsValue" type="card" addable @tab-add="addTab">
    <template #add-icon>
      <el-icon><Plus /></el-icon>
    </template>
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

let tabIndex = 2
const editableTabsValue = ref('2')
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])

const addTab = () => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
</script>
```

## 实际应用示例

### 产品详情页标签

一个完整的产品详情页面，包含基本信息、规格参数、用户评价等标签页。

```vue
<template>
  <div class="product-detail">
    <el-tabs v-model="activeTab" type="card" class="product-tabs">
      <el-tab-pane label="商品详情" name="detail">
        <div class="product-info">
          <h3>产品介绍</h3>
          <p>这是一款高品质的产品，具有优秀的性能和可靠的质量...</p>
          <div class="product-images">
            <img src="/api/placeholder/300/200" alt="产品图片" />
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane name="specs">
        <template #label>
          <span class="custom-tab-label">
            <el-icon><Setting /></el-icon>
            规格参数
          </span>
        </template>
        <el-table :data="specifications" style="width: 100%">
          <el-table-column prop="name" label="参数名称" width="200" />
          <el-table-column prop="value" label="参数值" />
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="用户评价" name="reviews" lazy>
        <div class="reviews-section">
          <div class="review-summary">
            <el-rate v-model="averageRating" disabled show-score />
            <span class="review-count">共 {{ reviews.length }} 条评价</span>
          </div>
          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <span class="username">{{ review.username }}</span>
                <el-rate v-model="review.rating" disabled size="small" />
              </div>
              <p class="review-content">{{ review.content }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'

const activeTab = ref('detail')
const averageRating = ref(4.5)

const specifications = ref([
  { name: '品牌', value: 'Element Plus' },
  { name: '型号', value: 'EP-2024' },
  { name: '尺寸', value: '200mm × 150mm × 50mm' },
  { name: '重量', value: '500g' },
  { name: '材质', value: '优质塑料' }
])

const reviews = ref([
  {
    id: 1,
    username: '用户A',
    rating: 5,
    content: '产品质量很好，使用体验非常棒！'
  },
  {
    id: 2,
    username: '用户B',
    rating: 4,
    content: '性价比不错，推荐购买。'
  }
])
</script>

<style scoped>
.product-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.product-tabs {
  margin-top: 20px;
}

.custom-tab-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.product-info {
  padding: 20px 0;
}

.product-images img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 15px;
}

.reviews-section {
  padding: 20px 0;
}

.review-summary {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.review-count {
  color: #666;
  font-size: 14px;
}

.review-item {
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.username {
  font-weight: 500;
  color: #333;
}

.review-content {
  color: #666;
  line-height: 1.6;
  margin: 0;
}
</style>
```

### 管理后台工作台

一个管理后台的工作台界面，支持动态添加和关闭标签页。

```vue
<template>
  <div class="admin-workspace">
    <el-tabs
      v-model="activeWorkspace"
      type="card"
      editable
      @edit="handleTabEdit"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="workspace in workspaces"
        :key="workspace.name"
        :label="workspace.title"
        :name="workspace.name"
        :closable="workspace.closable"
      >
        <component :is="workspace.component" :data="workspace.data" />
      </el-tab-pane>
    </el-tabs>
    
    <!-- 快速添加菜单 -->
    <el-dropdown trigger="click" @command="addWorkspace">
      <el-button type="primary" size="small" style="margin-top: 10px;">
        添加工作区
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="users">用户管理</el-dropdown-item>
          <el-dropdown-item command="orders">订单管理</el-dropdown-item>
          <el-dropdown-item command="products">商品管理</el-dropdown-item>
          <el-dropdown-item command="analytics">数据分析</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { TabPaneName } from 'element-plus'

// 模拟组件
const DashboardComponent = markRaw({
  template: '<div class="workspace-content"><h3>仪表盘</h3><p>欢迎使用管理后台</p></div>'
})

const UsersComponent = markRaw({
  template: '<div class="workspace-content"><h3>用户管理</h3><p>用户列表和管理功能</p></div>'
})

const OrdersComponent = markRaw({
  template: '<div class="workspace-content"><h3>订单管理</h3><p>订单列表和处理功能</p></div>'
})

const ProductsComponent = markRaw({
  template: '<div class="workspace-content"><h3>商品管理</h3><p>商品列表和管理功能</p></div>'
})

const AnalyticsComponent = markRaw({
  template: '<div class="workspace-content"><h3>数据分析</h3><p>各种数据图表和分析</p></div>'
})

let workspaceIndex = 1
const activeWorkspace = ref('dashboard')

const workspaces = ref([
  {
    name: 'dashboard',
    title: '仪表盘',
    component: DashboardComponent,
    closable: false,
    data: {}
  }
])

const workspaceTemplates = {
  users: {
    title: '用户管理',
    component: UsersComponent
  },
  orders: {
    title: '订单管理',
    component: OrdersComponent
  },
  products: {
    title: '商品管理',
    component: ProductsComponent
  },
  analytics: {
    title: '数据分析',
    component: AnalyticsComponent
  }
}

const handleTabEdit = (targetName: TabPaneName | undefined, action: 'remove' | 'add') => {
  if (action === 'remove' && targetName) {
    const index = workspaces.value.findIndex(ws => ws.name === targetName)
    if (index > -1) {
      workspaces.value.splice(index, 1)
      
      // 如果删除的是当前激活的标签，切换到其他标签
      if (activeWorkspace.value === targetName) {
        activeWorkspace.value = workspaces.value[Math.max(0, index - 1)]?.name || 'dashboard'
      }
    }
  }
}

const addWorkspace = (command: string) => {
  const template = workspaceTemplates[command as keyof typeof workspaceTemplates]
  if (template) {
    const newWorkspace = {
      name: `${command}-${++workspaceIndex}`,
      title: template.title,
      component: template.component,
      closable: true,
      data: {}
    }
    
    workspaces.value.push(newWorkspace)
    activeWorkspace.value = newWorkspace.name
  }
}

const handleTabClick = (tab: any) => {
  console.log('切换到工作区:', tab.props.name)
}
</script>

<style scoped>
.admin-workspace {
  padding: 20px;
  min-height: 500px;
}

.workspace-content {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.workspace-content h3 {
  color: #333;
  margin-bottom: 15px;
}

.workspace-content p {
  color: #666;
  margin: 0;
}
</style>
```

## API

### Tabs Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| model-value / v-model | 绑定值，选中选项卡的 name | string / number | — | 第一个选项卡的 name |
| type | 风格类型 | string | card/border-card | — |
| closable | 标签是否可关闭 | boolean | — | false |
| addable | 标签是否可增加 | boolean | — | false |
| editable | 标签是否同时可增加和关闭 | boolean | — | false |
| tab-position | 选项卡所在位置 | string | top/right/bottom/left | top |
| stretch | 标签的宽度是否自撑开 | boolean | — | false |
| before-leave | 切换标签之前的钩子函数，若返回 false 或者返回被 reject 的 Promise，则阻止切换。 | Function | — | — |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

### Tabs Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| tab-click | tab 被选中时触发 | (pane: TabsPaneContext, ev: Event) |
| tab-change | activeName 改变时触发 | (name: TabPaneName) |
| tab-remove | 点击 tab 移除按钮时触发 | (name: TabPaneName) |
| tab-add | 点击 tab 新增按钮时触发 | — |
| edit | 点击 tab 的新增或移除按钮后触发 | (paneName: TabPaneName \| undefined, action: 'remove' \| 'add') |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

### Tabs Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| — | 默认插槽 | Tab-pane |
| add-icon | 自定义添加按钮图标 | — |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

### Tabs Exposes

| 属性名 | 说明 | 类型 |
|--------|------|------|
| currentName | 当前活动的面板名称 | object |
| tabNavRef | tab-nav 组件实例 | object |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

### Tab-pane Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| label | 选项卡标题 | string | — | — |
| disabled | 是否禁用 | boolean | — | false |
| name | 与选项卡绑定值 value 对应的标识符，表示选项卡别名 | string / number | — | 该选项卡在选项卡列表中的序数值，第一个选项卡为 '0' |
| closable | 标签是否可关闭 | boolean | — | false |
| lazy | 标签是否延迟渲染 | boolean | — | false |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

### Tab-pane Slots

| 插槽名 | 说明 |
|--------|------|
| — | Tab-pane 的内容 |
| label | Tab-pane 的标题内容 |

<mcreference link="https://element-plus.org/zh-CN/component/tabs.html" index="1">1</mcreference>

## 最佳实践

1. **标签数量控制**：避免标签过多导致界面拥挤，建议不超过 8 个标签
2. **标签命名**：使用简洁明了的标签名称，避免过长的文本
3. **响应式设计**：在移动端考虑使用垂直布局或简化标签内容
4. **状态管理**：合理使用 `v-model` 来管理当前激活的标签
5. **延迟渲染**：对于内容较多的标签页，可以使用 `lazy` 属性进行延迟渲染
6. **钩子函数**：使用 `before-leave` 钩子来处理切换前的验证逻辑

## 常见问题

### Q: 如何动态添加和删除标签页？
A: 设置 `editable` 属性为 true，或者分别设置 `addable` 和 `closable` 属性，然后监听 `edit`、`tab-add`、`tab-remove` 事件来处理相应逻辑。

### Q: 如何自定义标签页的标题内容？
A: 使用 `label` 插槽可以自定义标签页的标题内容，支持添加图标等元素。

### Q: 如何阻止标签页的切换？
A: 使用 `before-leave` 钩子函数，在函数中返回 `false` 或被 reject 的 Promise 即可阻止切换。

### Q: 标签页内容何时渲染？
A: 默认情况下所有标签页内容都会渲染，设置 `lazy` 属性为 true 可以实现延迟渲染，只有当标签页被激活时才渲染内容。

## 实践项目

### 标签页应用系统

创建一个完整的标签页应用系统，包含以下功能：

1. **多功能标签页**
   - 基础标签页切换
   - 可关闭标签页
   - 动态添加标签页

2. **标签页高级功能**
   - 标签页拖拽排序
   - 标签页内容懒加载
   - 标签页状态保持

3. **标签页集成应用**
   - 标签页路由集成
   - 标签页权限控制
   - 标签页数据管理

### 实践要点

- 设计合理的标签页结构
- 实现标签页的动态管理
- 处理标签页的状态同步
- 优化标签页的性能表现

## 学习检查清单

- [ ] 掌握基础标签页的使用
- [ ] 理解标签页位置和类型设置
- [ ] 熟练使用可关闭标签页功能
- [ ] 掌握动态标签页的实现
- [ ] 理解标签页事件处理机制
- [ ] 掌握标签页内容懒加载
- [ ] 完成标签页应用的实践项目

## 注意事项

1. **内容的组织结构**
   - 标签页内容应该相关但独立
   - 避免标签页数量过多影响用户体验
   - 合理使用标签页的嵌套结构

2. **用户操作的一致性**
   - 标签页的切换行为要统一
   - 可关闭标签页的操作要明确
   - 提供合适的视觉反馈

3. **性能的优化考虑**
   - 使用懒加载减少初始渲染压力
   - 合理管理标签页的生命周期
   - 避免不必要的数据重复加载

4. **移动端的适配**
   - 在小屏幕设备上优化标签页布局
   - 考虑触摸操作的便利性
   - 提供滑动切换功能

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**

## 总结

Tabs 标签页是一个功能丰富且灵活的导航组件，具有以下特点：

- **样式多样**：支持基础、卡片、边框卡片等多种视觉风格
- **布局灵活**：支持四个方向的标签位置，适应不同设计需求
- **功能完整**：提供动态添加删除、自定义内容、延迟渲染等高级功能
- **事件丰富**：完整的事件回调机制，便于业务逻辑处理
- **性能优化**：支持懒加载，减少初始渲染压力
- **用户友好**：提供切换钩子函数，支持复杂的业务验证逻辑

适用于内容分类展示、功能模块切换、多步骤流程等场景。通过合理的标签设计和交互逻辑，可以有效提升用户的浏览体验和操作效率。

## 参考资料

- [Element Plus Tabs 官方文档](https://element-plus.org/zh-CN/component/tabs.html)
- [Vue 3 动态组件](https://cn.vuejs.org/guide/essentials/component-basics.html#dynamic-components)
- [Web 可访问性标签页设计](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)
- [用户界面设计模式](https://ui-patterns.com/patterns/Tabs)