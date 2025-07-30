# Input 输入框

## 概述

通过鼠标或键盘输入字符。Input 为受控组件，它总会显示 Vue 绑定值。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

::: warning 注意
通常情况下，应当处理 `input` 事件，并更新组件的绑定值（或使用 `v-model`）。否则，输入框内显示的值将不会改变。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>
:::

::: warning 注意
不支持 `v-model` 修饰符。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>
:::

## 学习目标

- 掌握 el-input 基础用法
- 理解不同类型的输入框（text、password、textarea等）
- 学会输入框的尺寸控制
- 掌握输入框的状态（禁用、只读、清空等）
- 了解输入框的前缀和后缀
- 学会输入框的字数限制
- 掌握复合型输入框的使用
- 理解输入框的事件处理

## 基础用法

### 基础文本输入

```vue
<template>
  <div>
    <el-input v-model="input" placeholder="请输入内容" />
    <p>输入的内容：{{ input }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

### 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div>
    <el-input v-model="input1" placeholder="请输入内容" />
    <el-input v-model="input2" placeholder="请输入内容" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input1 = ref('')
const input2 = ref('')
</script>
```

### 一键清空

使用 `clearable` 属性即可得到一个可一键清空的输入框。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <el-input v-model="input" placeholder="请输入内容" clearable />
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

### 密码框

使用 `show-password` 属性即可得到一个可切换显示隐藏的密码框。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <el-input
    v-model="input"
    type="password"
    placeholder="请输入密码"
    show-password
  />
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

## 带图标的输入框

### 前缀和后缀图标

可以通过 `prefix-icon` 和 `suffix-icon` 属性在 input 组件首部和尾部增加显示图标，也可以通过 slot 来放置图标。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div class="demo-input-suffix">
    <!-- 使用属性方式 -->
    <span class="demo-input-label">属性方式：</span>
    <el-input
      v-model="input1"
      placeholder="请选择日期"
      suffix-icon="Calendar"
    />
    <el-input
      v-model="input2"
      placeholder="请输入内容"
      prefix-icon="Search"
    />
  </div>
  
  <div class="demo-input-suffix">
    <!-- 使用 slot 方式 -->
    <span class="demo-input-label">slot 方式：</span>
    <el-input v-model="input3" placeholder="请选择日期">
      <template #suffix>
        <el-icon class="el-input__icon"><calendar /></el-icon>
      </template>
    </el-input>
    <el-input v-model="input4" placeholder="请输入内容">
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, Search } from '@element-plus/icons-vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
</script>

<style>
.demo-input-suffix {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.demo-input-suffix .demo-input-label {
  display: inline-block;
  width: 130px;
}
</style>
```

## 文本域

### 基础文本域

用于输入多行文本信息可缩放的输入框。添加 `type="textarea"` 属性来将 input 元素转换为原生的 textarea 元素。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <el-input
    v-model="textarea"
    :rows="2"
    type="textarea"
    placeholder="请输入内容"
  />
</template>

<script setup>
import { ref } from 'vue'

const textarea = ref('')
</script>
```

### 自适应文本域

设置文字输入类型的 `autosize` 属性使得根据内容自动调整的高度。你可以给 `autosize` 提供一个包含有最大和最小高度的对象，让输入框自动调整。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div>
    <el-input
      v-model="textarea1"
      autosize
      type="textarea"
      placeholder="请输入内容"
    />
    
    <el-input
      v-model="textarea2"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="请输入内容"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const textarea1 = ref('')
const textarea2 = ref('')
</script>
```

## 复合型输入框

可以在输入框前置或后置一个元素，通常是标签或按钮。可通过 slot 来指定在 input 中前置或者后置内容。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div>
    <div class="demo-input-suffix">
      <span class="demo-input-label">前置内容</span>
      <el-input v-model="input1" placeholder="请输入内容">
        <template #prepend>Http://</template>
      </el-input>
    </div>
    
    <div class="demo-input-suffix">
      <span class="demo-input-label">后置内容</span>
      <el-input v-model="input2" placeholder="请输入内容">
        <template #append>.com</template>
      </el-input>
    </div>
    
    <div class="demo-input-suffix">
      <span class="demo-input-label">前后置内容</span>
      <el-input v-model="input3" placeholder="请输入内容">
        <template #prepend>Http://</template>
        <template #append>.com</template>
      </el-input>
    </div>
    
    <div class="demo-input-suffix">
      <span class="demo-input-label">后置按钮</span>
      <el-input v-model="input4" placeholder="请输入内容">
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
</script>

<style>
.demo-input-suffix {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.demo-input-suffix .demo-input-label {
  display: inline-block;
  width: 130px;
}
</style>
```

## 尺寸

使用 `size` 属性改变输入框大小。除了默认大小外，还有另外两个选项： `large`, `small`。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div class="demo-input-size">
    <el-input v-model="input1" size="large" placeholder="Large size" />
    <el-input v-model="input2" placeholder="Default size" />
    <el-input v-model="input3" size="small" placeholder="Small size" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
</script>

<style>
.demo-input-size .el-input {
  margin: 10px 0;
}
</style>
```

## 带输入建议

根据输入内容提供对应的输入建议。autocomplete 是一个可带输入建议的输入框组件，`fetch-suggestions` 是一个返回输入建议的方法属性，如 querySearch(queryString, cb)，在该方法中你可以在你的输入建议数据准备好时通过 cb(data) 返回到 autocomplete 组件中。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])
const state = ref('')

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value
  // 调用 callback 返回建议列表的数据
  cb(results)
}

const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' }
  ]
}

const handleSelect = (item: LinkItem) => {
  console.log(item)
}

onMounted(() => {
  links.value = loadAll()
})
</script>
```

## 输入长度限制

使用 `maxlength` 和 `minlength` 属性，来控制输入内容的最大字数和最小字数。"字符数"使用JavaScript字符串长度来衡量。为文本或文本输入类型设置 `maxlength` prop可以限制输入值的长度，允许你通过设置 `show-word-limit` 到 `true` 来显示剩余字数。<mcreference link="https://element-plus.org/zh-CN/component/input.html" index="1">1</mcreference>

```vue
<template>
  <div>
    <el-input
      v-model="text"
      maxlength="10"
      placeholder="请输入内容"
      show-word-limit
      type="text"
    />
    
    <el-input
      v-model="textarea"
      maxlength="30"
      placeholder="请输入内容"
      show-word-limit
      type="textarea"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const textarea = ref('')
</script>
```

## API

### Input Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 类型 | string | text |
| model-value / v-model | 绑定值 | string / number | — |
| maxlength | 最大输入长度 | string / number | — |
| minlength | 原生属性，最小输入长度 | number | — |
| show-word-limit | 是否显示统计字数，只在 type 为 'text' 或 'textarea' 的时候生效 | boolean | false |
| placeholder | 输入框占位文本 | string | — |
| clearable | 是否显示清除按钮，只有当 type 不是 textarea时生效 | boolean | false |
| formatter | 指定输入值的格式。(只有当 type 是"text"时才能工作) | function(value: string / number): string | — |
| parser | 指定从格式化器输入中提取的值。(仅当 type 是"text"时才工作) | function(string): string | — |
| show-password | 是否显示切换密码图标 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| size | 输入框尺寸 | enum | — |
| prefix-icon | 自定义前缀图标 | string / Component | — |
| suffix-icon | 自定义后缀图标 | string / Component | — |
| rows | 输入框行数，仅 type 为 'textarea' 时有效 | number | 2 |
| autosize | textarea 高度是否自适应，仅 type 为 'textarea' 时生效。可以接受一个对象，比如: { minRows: 2, maxRows: 6 } | boolean / object | false |
| autocomplete | 原生 autocomplete 属性 | string | off |
| readonly | 原生  readonly 属性，是否只读 | boolean | false |
| max | 原生 max 属性，设置最大值 | — | — |
| min | 原生属性，设置最小值 | — | — |
| step | 原生属性，设置输入字段的合法数字间隔 | — | — |
| resize | 控制是否能被用户缩放 | enum | — |
| autofocus | 原生属性，自动获取焦点 | boolean | false |
| form | 原生属性 | string | — |
| label | 等价于原生 input aria-label 属性 | string | — |
| tabindex | 输入框的 tabindex | string / number | — |
| validate-event | 输入时是否触发表单的校验 | boolean | true |
| input-style | input 元素或 textarea 元素的 style | string / object | {} |

### Input Events

| 名称 | 说明 | 类型 |
|------|------|------|
| blur | 当选择器的输入框失去焦点时触发 | Function |
| focus | 当选择器的输入框获得焦点时触发 | Function |
| change | 仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发 | Function |
| input | 在 Input 值改变时触发 | Function |
| clear | 在点击由 clearable 属性生成的清空按钮时触发 | Function |

### Input Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| blur | 使 input 失去焦点 | Function |
| clear | 清除 input 值 | Function |
| focus | 使 input 获取焦点 | Function |
| select | 选中 input 中的文字 | Function |

### Input Slots

| 名称 | 说明 |
|------|------|
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |
| prepend | 输入框前置内容 |
| append | 输入框后置内容 |

## 实践练习

### 练习1：搜索框组件

创建一个带搜索图标和清空功能的搜索框：
- 前缀搜索图标
- 可清空内容
- 回车触发搜索
- 实时搜索建议

### 练习2：表单输入验证

实现不同类型的输入框验证：
- 用户名输入（字母数字组合）
- 密码输入（强度提示）
- 邮箱输入（格式验证）
- 手机号输入（格式验证）

### 练习3：富文本编辑器

基于 textarea 实现简单的文本编辑器：
- 字数统计
- 自动保存
- 格式化功能
- 撤销重做

## 常见问题

### 1. 输入框不响应 v-model

确保：
- 正确绑定 `v-model`
- 数据是响应式的（使用 `ref` 或 `reactive`）
- 没有阻止默认事件

### 2. 自定义格式化

```javascript
// 数字格式化示例
const formatter = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const parser = (value) => {
  return value.replace(/\$\s?|(,*)/g, '')
}
```

### 3. 动态改变输入框类型

```vue
<template>
  <el-input
    v-model="input"
    :type="inputType"
    placeholder="请输入内容"
  />
  <el-button @click="toggleType">切换类型</el-button>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const inputType = ref('text')

const toggleType = () => {
  inputType.value = inputType.value === 'text' ? 'password' : 'text'
}
</script>
```

## 总结

Input 输入框是表单中最基础和常用的组件，掌握其各种用法对于构建用户界面至关重要。重点要理解：

1. **基础用法**：文本输入、密码输入、文本域
2. **状态控制**：禁用、只读、清空
3. **样式定制**：尺寸、图标、前后置内容
4. **功能增强**：输入建议、字数限制、格式化
5. **事件处理**：输入、焦点、清空等事件

通过不断练习和实践，你将能够熟练使用 Input 组件构建各种输入场景的用户界面。