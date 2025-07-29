# Autocomplete 自动补全输入框

## 组件概述

Autocomplete 自动补全输入框是一个带输入建议的输入框组件，可以根据用户输入提供相关的建议选项。

## 学习目标

- 掌握 Autocomplete 组件的基本用法
- 理解数据源配置和过滤机制
- 学会自定义建议项模板
- 掌握远程搜索功能

## 基础用法

最简单的自动补全功能。

<div class="demo-block">
  <div class="demo-title">基础用法</div>
  <div class="demo-content">
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
    />
  </div>
</div>

```vue
<template>
  <div class="autocomplete-demo">
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const restaurants = [
  { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
  { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
  { value: '泷千家(天山西路店)', address: '天山西路438号' },
  { value: '胖仙女烧烤-精酿啤酒·新疆烧烤', address: '金沙江路1699号鑫乐惠美食广场A13' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurants.filter(createFilter(queryString))
    : restaurants
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item) => {
  console.log(item)
}
</script>
```

## API

### Autocomplete Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| model-value / v-model | 绑定值 | string | — | — |
| placeholder | 输入框占位文本 | string | — | — |
| fetch-suggestions | 返回输入建议的方法 | Function(queryString, callback) | — | — |
| trigger-on-focus | 是否在输入框 focus 时显示建议列表 | boolean | — | true |
| clearable | 是否可清空 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| value-key | 输入建议对象中用于显示的键名 | string | — | value |
| debounce | 获取输入建议的去抖延时 | number | — | 300 |
| placement | 菜单弹出位置 | string | top / top-start / top-end / bottom / bottom-start / bottom-end | bottom-start |
| hide-loading | 是否隐藏远程加载时的加载图标 | boolean | — | false |
| popper-class | Autocomplete 下拉列表的类名 | string | — | — |
| teleported | 是否将下拉列表插入至 body 元素 | boolean | — | true |
| highlight-first-item | 是否默认突出显示远程搜索建议中的第一项 | boolean | — | false |

### Autocomplete Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击选中建议项时触发 | 选中建议项 |
| change | 在 Input 值改变时触发 | (value: string \| number) |
| focus | 在 Input 获得焦点时触发 | (event: Event) |
| blur | 在 Input 失去焦点时触发 | (event: Event) |
| clear | 在点击由 clearable 属性生成的清空按钮时触发 | — |

### Autocomplete Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| focus | 使 input 获取焦点 | — |
| blur | 使 input 失去焦点 | — |

### Autocomplete Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义输入建议的内容 | — |
| prefix | 输入框头部内容 | — |
| suffix | 输入框尾部内容 | — |
| prepend | 输入框前置内容 | — |
| append | 输入框后置内容 | — |

## 实践练习

1. 创建一个城市搜索的自动补全输入框
2. 实现远程搜索功能
3. 自定义建议项的显示模板
4. 添加防抖功能优化性能