# Segmented 分段控制器

## 概述

Segmented 分段控制器是 Element Plus 提供的一个用于展示多个选项并允许用户选择其中单个选项的组件。它提供了一种直观的方式来在多个相关选项之间进行切换，常用于标签页、过滤器或模式切换等场景。

## 学习目标

通过本文档的学习，你将掌握：
- Segmented 分段控制器的基本概念和使用场景
- 基础用法和配置选项
- 不同方向和样式的设置
- 禁用状态和自定义选项的实现
- 实际项目中的应用示例
- 完整的 API 文档和最佳实践

## 基础用法

### 基础分段控制器

最简单的分段控制器用法，设置 `v-model` 为选项值：

```vue
<template>
  <el-segmented v-model="value" :options="options" />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('Mon')
const options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
```

### 配置方向

设置 `vertical` 来改变方向：

```vue
<template>
  <div>
    <h4>水平方向</h4>
    <el-segmented v-model="value1" :options="sizeOptions" />
    
    <h4>垂直方向</h4>
    <el-segmented v-model="value2" :options="fruitOptions" vertical />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('default')
const sizeOptions = ['large', 'default', 'small']

const value2 = ref('Apple')
const fruitOptions = ['Apple', 'Cherry', 'Grape', 'Orange', 'Pear', 'Watermelon']
</script>
```

### 禁用状态

设置 `disabled` 属性来禁用一些选项：

```vue
<template>
  <el-segmented 
    v-model="value" 
    :options="options" 
    :disabled="['Wed', 'Fri']"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('Mon')
const options = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
```

### 自定义选项

当您的 options 格式不同于默认格式时，可通过 `props` 属性自定义 options：

```vue
<template>
  <el-segmented 
    v-model="value" 
    :options="customOptions"
    :props="{ value: 'key', label: 'name' }"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('mon')
const customOptions = [
  { key: 'mon', name: 'Monday' },
  { key: 'tue', name: 'Tuesday' },
  { key: 'wed', name: 'Wednesday' },
  { key: 'thu', name: 'Thursday' },
  { key: 'fri', name: 'Friday' },
  { key: 'sat', name: 'Saturday' },
  { key: 'sun', name: 'Sunday' }
]
</script>
```

### Block 分段选择器

设置 `block` 为 `true` 以适应父元素的宽度：

```vue
<template>
  <el-segmented 
    v-model="value" 
    :options="options" 
    block
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('Mon')
const options = [
  'Mon', 
  'Tue', 
  'Wed', 
  'Thu', 
  'Fri', 
  'Saturday long long long long long long long'
]
</script>
```

### 自定义内容

设置 `default` slot 来渲染自定义内容：

```vue
<template>
  <el-segmented v-model="value" :options="options">
    <template #default="{ item, index }">
      <div style="padding: 4px">
        <el-icon><Apple /></el-icon>
        <span>{{ item }}</span>
      </div>
    </template>
  </el-segmented>
</template>

<script setup>
import { ref } from 'vue'
import { Apple } from '@element-plus/icons-vue'

const value = ref('Apple')
const options = ['Apple', 'Cherry', 'Grape', 'Orange', 'Pear', 'Watermelon']
</script>
```

### 自定义样式

使用 CSS 变量设置自定义样式：

```vue
<template>
  <el-segmented 
    v-model="value" 
    :options="options"
    class="custom-segmented"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref('Delicacy')
const options = ['Delicacy', 'Desserts & Drinks', 'Fresh foods', 'Supermarket']
</script>

<style>
.custom-segmented {
  --el-segmented-bg-color: #f0f9ff;
  --el-segmented-item-selected-bg-color: #3b82f6;
  --el-segmented-item-selected-color: #ffffff;
}
</style>
```

## 实际应用示例

### 内容过滤器

```vue
<template>
  <div class="content-filter">
    <el-segmented 
      v-model="activeCategory" 
      :options="categories"
      @change="handleCategoryChange"
    />
    
    <div class="content-area">
      <div v-for="item in filteredContent" :key="item.id" class="content-item">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')
const categories = [
  { value: 'all', label: '全部' },
  { value: 'tech', label: '技术' },
  { value: 'design', label: '设计' },
  { value: 'product', label: '产品' }
]

const content = ref([
  { id: 1, title: 'Vue 3 新特性', category: 'tech', description: 'Vue 3 带来的新功能介绍' },
  { id: 2, title: 'UI 设计趋势', category: 'design', description: '2024年UI设计趋势分析' },
  { id: 3, title: '产品规划', category: 'product', description: '如何制定产品发展规划' },
  { id: 4, title: 'React vs Vue', category: 'tech', description: '前端框架对比分析' }
])

const filteredContent = computed(() => {
  if (activeCategory.value === 'all') {
    return content.value
  }
  return content.value.filter(item => item.category === activeCategory.value)
})

const handleCategoryChange = (value) => {
  console.log('分类切换:', value)
}
</script>

<style scoped>
.content-filter {
  padding: 20px;
}

.content-area {
  margin-top: 20px;
}

.content-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 12px;
}

.content-item h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.content-item p {
  margin: 0;
  color: #606266;
}
</style>
```

### 视图模式切换

```vue
<template>
  <div class="view-switcher">
    <div class="toolbar">
      <el-segmented 
        v-model="viewMode" 
        :options="viewOptions"
        @change="handleViewChange"
      >
        <template #default="{ item }">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </template>
      </el-segmented>
    </div>
    
    <div class="data-container">
      <div v-if="viewMode === 'list'" class="list-view">
        <div v-for="item in dataList" :key="item.id" class="list-item">
          <h4>{{ item.name }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
      
      <div v-else-if="viewMode === 'grid'" class="grid-view">
        <div v-for="item in dataList" :key="item.id" class="grid-item">
          <h4>{{ item.name }}</h4>
          <p>{{ item.description }}</p>
        </div>
      </div>
      
      <div v-else class="table-view">
        <el-table :data="dataList">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="description" label="描述" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { List, Grid, Table } from '@element-plus/icons-vue'

const viewMode = ref('list')
const viewOptions = [
  { value: 'list', label: '列表', icon: List },
  { value: 'grid', label: '网格', icon: Grid },
  { value: 'table', label: '表格', icon: Table }
]

const dataList = ref([
  { id: 1, name: '项目A', description: '这是项目A的描述信息' },
  { id: 2, name: '项目B', description: '这是项目B的描述信息' },
  { id: 3, name: '项目C', description: '这是项目C的描述信息' }
])

const handleViewChange = (value) => {
  console.log('视图模式切换:', value)
}
</script>

<style scoped>
.view-switcher {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.list-view .list-item {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.grid-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
```

## API 文档

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 绑定值 | `string / number / boolean` | — |
| options | 选项的数据 | `array` | `[]` |
| props | 配置选项，详见下表 | `object` | — |
| size | 组件大小 | `'large' / 'default' / 'small'` | `''` |
| block | 撑满父元素宽度 | `boolean` | — |
| disabled | 是否禁用 | `boolean` | `false` |
| validate-event | 是否触发表单验证 | `boolean` | `true` |
| name | 原生 name 属性 | `string` | — |
| id | 原生 id 属性 | `string` | — |
| aria-label | a11y 原生 aria-label 属性 | `string` | — |
| direction | 展示的方向 | `'horizontal' / 'vertical'` | `'horizontal'` |

### 自定义配置选项

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 指定键为节点对象的某个属性值 | `string` | `'value'` |
| label | 指定标签为节点对象的某个属性值 | `string` | `'label'` |
| disabled | 指定禁用状态为节点对象的某个属性值 | `string` | `'disabled'` |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| change | 当所选值更改时触发，参数是当前选中的值 | `Function` |

### Slots

| 插槽名 | 说明 | 类型 |
|--------|------|------|
| default | 自定义 Option 模板 | `object` |

### 类型声明

```typescript
type Option = Record<string, any> | string | number | boolean
```

## 最佳实践

### 选项设计

1. **选项数量控制**：建议选项数量控制在 2-7 个之间，过多会影响用户体验
2. **标签简洁性**：选项标签应该简洁明了，避免过长的文本
3. **语义化**：选项应该具有明确的语义，用户能够快速理解每个选项的含义

### 交互设计

1. **默认选中**：应该有一个合理的默认选中项
2. **状态反馈**：选中状态应该有明显的视觉反馈
3. **禁用处理**：禁用的选项应该有明确的视觉提示

### 响应式设计

1. **移动端适配**：在移动端考虑使用垂直布局或调整选项大小
2. **触摸友好**：确保选项有足够的点击区域
3. **自适应宽度**：合理使用 `block` 属性适应容器宽度

### 可访问性

1. **键盘导航**：支持键盘导航，使用方向键切换选项
2. **屏幕阅读器**：为选项提供合适的 `aria-label`
3. **焦点管理**：确保焦点状态清晰可见

## 常见问题

### 选项不显示

**问题**：设置了 options 但选项不显示

**解决方案**：
1. 检查 options 数组是否为空
2. 确认数据格式是否正确
3. 如果使用自定义格式，检查 props 配置

```vue
<!-- 错误示例 -->
<el-segmented v-model="value" :options="[]" />

<!-- 正确示例 -->
<el-segmented v-model="value" :options="['选项1', '选项2']" />
```

### 自定义选项格式问题

**问题**：使用对象数组作为选项时显示异常

**解决方案**：正确配置 props 属性

```vue
<!-- 错误示例 -->
<el-segmented 
  v-model="value" 
  :options="[{id: 1, name: '选项1'}]"
/>

<!-- 正确示例 -->
<el-segmented 
  v-model="value" 
  :options="[{id: 1, name: '选项1'}]"
  :props="{value: 'id', label: 'name'}"
/>
```

### 样式覆盖问题

**问题**：自定义样式不生效

**解决方案**：使用 CSS 变量或深度选择器

```vue
<style>
/* 使用 CSS 变量 */
.el-segmented {
  --el-segmented-bg-color: #f0f0f0;
}

/* 或使用深度选择器 */
:deep(.el-segmented__item) {
  border-radius: 8px;
}
</style>
```

## 总结

Segmented 分段控制器是一个功能强大且易用的组件，适用于多种场景下的选项切换需求。通过本文档的学习，你应该能够：

1. 理解 Segmented 组件的基本概念和使用场景
2. 掌握基础用法和各种配置选项
3. 实现自定义样式和内容
4. 在实际项目中合理应用该组件
5. 解决常见的使用问题

在实际开发中，建议根据具体的业务需求选择合适的配置，注意用户体验和可访问性，确保组件能够为用户提供良好的交互体验。

## 参考资料

- [Element Plus Segmented 官方文档](https://element-plus.org/zh-CN/component/segmented.html)
- [Element Plus 设计规范](https://element-plus.org/zh-CN/guide/design.html)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)