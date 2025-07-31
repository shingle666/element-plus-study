# Checkbox 多选框

## 概述

Checkbox 多选框组件用于在一组选项中选择多个选项。它是表单中常用的组件之一，支持单个复选框和复选框组的使用方式，提供了丰富的配置选项和样式。

## 学习目标

- 掌握 Checkbox 的基本概念和使用场景
- 学会基础复选框的使用方法
- 了解复选框组的配置和管理
- 掌握不同样式的复选框实现
- 学会复选框的状态控制和事件处理
- 了解复选框的尺寸和禁用状态
- 掌握全选和半选状态的实现
- 掌握 API 的完整使用方法

## 基础用法

### 基本复选框

最简单的复选框用法：

```vue
<template>
  <div>
    <el-checkbox v-model="checked1" label="选项1" />
    <el-checkbox v-model="checked2" label="选项2" />
    <p>选项1状态：{{ checked1 }}</p>
    <p>选项2状态：{{ checked2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用复选框：

```vue
<template>
  <div>
    <el-checkbox v-model="checked1" disabled>禁用状态</el-checkbox>
    <el-checkbox v-model="checked2" disabled>选中且禁用</el-checkbox>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checked1 = ref(false)
const checked2 = ref(true)
</script>
```

## 复选框组

### 基础复选框组

使用 `el-checkbox-group` 元素能把多个 checkbox 管理为一组：

```vue
<template>
  <div>
    <el-checkbox-group v-model="checkboxGroup">
      <el-checkbox label="上海">上海</el-checkbox>
      <el-checkbox label="北京">北京</el-checkbox>
      <el-checkbox label="广州">广州</el-checkbox>
      <el-checkbox label="深圳">深圳</el-checkbox>
    </el-checkbox-group>
    <p>选中的城市：{{ checkboxGroup }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxGroup = ref(['上海', '北京'])
</script>
```

### 按钮样式

使用 `el-checkbox-button` 元素来实现按钮样式的复选框：

```vue
<template>
  <div>
    <h4>默认按钮样式</h4>
    <el-checkbox-group v-model="checkboxButton1">
      <el-checkbox-button label="上海">上海</el-checkbox-button>
      <el-checkbox-button label="北京">北京</el-checkbox-button>
      <el-checkbox-button label="广州">广州</el-checkbox-button>
      <el-checkbox-button label="深圳">深圳</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>禁用状态</h4>
    <el-checkbox-group v-model="checkboxButton2">
      <el-checkbox-button label="上海">上海</el-checkbox-button>
      <el-checkbox-button label="北京" disabled>北京</el-checkbox-button>
      <el-checkbox-button label="广州">广州</el-checkbox-button>
      <el-checkbox-button label="深圳">深圳</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxButton1 = ref(['上海'])
const checkboxButton2 = ref(['上海', '广州'])
</script>
```

### 带有边框

设置 `border` 属性可以渲染为带有边框的复选框：

```vue
<template>
  <div>
    <h4>带边框的复选框</h4>
    <el-checkbox v-model="checkboxBorder1" label="选项1" border>选项1</el-checkbox>
    <el-checkbox v-model="checkboxBorder2" label="选项2" border>选项2</el-checkbox>
    
    <h4>带边框的复选框组</h4>
    <el-checkbox-group v-model="checkboxBorderGroup">
      <el-checkbox label="上海" border>上海</el-checkbox>
      <el-checkbox label="北京" border>北京</el-checkbox>
      <el-checkbox label="广州" border disabled>广州</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxBorder1 = ref(true)
const checkboxBorder2 = ref(false)
const checkboxBorderGroup = ref(['上海'])
</script>
```

## 尺寸

使用 `size` 属性来设置复选框的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-checkbox-group v-model="checkboxSize1" size="large">
      <el-checkbox-button label="上海">上海</el-checkbox-button>
      <el-checkbox-button label="北京">北京</el-checkbox-button>
      <el-checkbox-button label="广州">广州</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>默认尺寸</h4>
    <el-checkbox-group v-model="checkboxSize2">
      <el-checkbox-button label="上海">上海</el-checkbox-button>
      <el-checkbox-button label="北京">北京</el-checkbox-button>
      <el-checkbox-button label="广州">广州</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>小尺寸</h4>
    <el-checkbox-group v-model="checkboxSize3" size="small">
      <el-checkbox-button label="上海">上海</el-checkbox-button>
      <el-checkbox-button label="北京">北京</el-checkbox-button>
      <el-checkbox-button label="广州">广州</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxSize1 = ref(['上海'])
const checkboxSize2 = ref(['上海'])
const checkboxSize3 = ref(['上海'])
</script>
```

## 全选和半选

实现全选和半选功能：

```vue
<template>
  <div>
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    
    <div style="margin: 15px 0;"></div>
    
    <el-checkbox-group
      v-model="checkedCities"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox v-for="city in cities" :key="city" :label="city">
        {{ city }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const checkAll = ref(false)
const checkedCities = ref(['上海', '北京'])
const cities = ['上海', '北京', '广州', '深圳']
const isIndeterminate = ref(true)

const handleCheckAllChange = (val) => {
  checkedCities.value = val ? cities : []
  isIndeterminate.value = false
}

const handleCheckedCitiesChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}
</script>
```

## 可选项目数量的限制

使用 `min` 和 `max` 属性能够限制可以被勾选的项目的数量：

```vue
<template>
  <div>
    <p>最少选择2个，最多选择3个城市：</p>
    <el-checkbox-group
      v-model="checkedCities"
      :min="2"
      :max="3"
    >
      <el-checkbox v-for="city in cities" :key="city" :label="city">
        {{ city }}
      </el-checkbox>
    </el-checkbox-group>
    <p>已选择：{{ checkedCities.length }} 个城市</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkedCities = ref(['上海', '北京'])
const cities = ['上海', '北京', '广州', '深圳', '杭州']
</script>
```

## API 文档

### Checkbox Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string / number / boolean | — |
| label | 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效） | string / number / boolean / object | — |
| true-label | 选中时的值 | string / number | — |
| false-label | 没有选中时的值 | string / number | — |
| disabled | 是否禁用 | boolean | false |
| border | 是否显示边框 | boolean | false |
| size | Checkbox 的尺寸 | enum | — |
| name | 原生 name 属性 | string | — |
| checked | 当前是否勾选 | boolean | false |
| indeterminate | 设置 indeterminate 状态，只负责样式控制 | boolean | false |
| validate-event | 是否触发表单验证 | boolean | true |
| tabindex | 输入框的 tabindex | string / number | — |
| id | 输入框的 id | string | — |
| controls | 与 aria-controls 属性相关 | string | — |

### Checkbox Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 当绑定值变化时触发的事件 | Function |

### Checkbox Slots

| 名称 | 说明 |
|------|------|
| default | 自定义默认内容 |

### CheckboxGroup Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | object | — |
| size | 多选框组尺寸 | enum | — |
| disabled | 是否禁用 | boolean | false |
| min | 可被勾选的 checkbox 的最小数量 | number | — |
| max | 可被勾选的 checkbox 的最大数量 | number | — |
| text-color | 按钮形式的 Checkbox 激活时的文本颜色 | string | #ffffff |
| fill | 按钮形式的 Checkbox 激活时的填充色和边框色 | string | #409eff |
| tag | 复选框组元素的标签 | string | div |
| validate-event | 是否触发表单验证 | boolean | true |
| label | 为屏幕阅读器准备的标签 | string | — |
| id | 原生 id 属性 | string | — |

### CheckboxGroup Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 当绑定值变化时触发的事件 | Function |

### CheckboxGroup Slots

| 名称 | 说明 |
|------|------|
| default | 自定义默认内容 |

### CheckboxButton Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 选中状态的值 | string / number / boolean / object | — |
| true-label | 选中时的值 | string / number | — |
| false-label | 没有选中时的值 | string / number | — |
| disabled | 是否禁用 | boolean | false |
| name | 原生 name 属性 | string | — |
| checked | 当前是否勾选 | boolean | false |

### CheckboxButton Slots

| 名称 | 说明 |
|------|------|
| default | 自定义默认内容 |

## 常见问题

### 1. 复选框值不更新

**问题**：复选框的值没有正确绑定或更新

**解决方案**：
```vue
<!-- 错误写法 -->
<el-checkbox v-model="value" :label="item">{{ item }}</el-checkbox>

<!-- 正确写法 -->
<el-checkbox v-model="value" :label="item.value">{{ item.label }}</el-checkbox>
```

### 2. 全选状态不正确

**问题**：全选和半选状态显示不正确

**解决方案**：
```vue
<script setup>
const handleCheckAllChange = (val) => {
  checkedItems.value = val ? allItems.map(item => item.value) : []
  isIndeterminate.value = false
}

const handleCheckedItemsChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allItems.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allItems.length
}
</script>
```

### 3. 动态选项的 key 问题

**问题**：动态生成的复选框选项可能出现渲染问题

**解决方案**：
```vue
<el-checkbox
  v-for="option in options"
  :key="option.id"
  :label="option.value"
>
  {{ option.label }}
</el-checkbox>
```

## 最佳实践

1. **语义化标签**：为复选框组提供有意义的标签
2. **合理分组**：相关的选项应该放在同一个复选框组中
3. **状态管理**：合理使用禁用状态来引导用户操作
4. **用户反馈**：在值变化时提供适当的反馈
5. **可访问性**：确保键盘导航和屏幕阅读器支持
6. **全选控制**：在多选场景中提供全选/取消全选功能

## 总结

Checkbox 多选框是表单中的重要组件，支持：

- 基础复选框和复选框组
- 多种样式（默认、按钮、边框）
- 尺寸控制和状态管理
- 全选和半选状态
- 数量限制功能
- 丰富的事件处理机制
- 良好的可访问性支持

掌握 Checkbox 组件的使用，能够帮助你构建更加灵活和用户友好的表单界面。

## 参考资料

- [Element Plus Checkbox 官方文档](https://element-plus.org/zh-CN/component/checkbox.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)