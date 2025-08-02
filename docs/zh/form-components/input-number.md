# Input Number 数字输入框

## 概述

仅允许输入标准的数字值，可定义范围。Input Number 是一个仅允许输入数字的输入框组件，支持定义数值范围、步长、精度等功能。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

## 学习目标

- 掌握 el-input-number 基础用法
- 理解数值范围的设置（min、max）
- 学会步长控制（step）
- 掌握精度设置（precision）
- 了解不同尺寸的数字输入框
- 学会禁用状态和只读状态
- 掌握按钮位置的控制
- 理解数字输入框的事件处理

## 基础用法

### 基础数字输入

要使用它，只需要在 `el-input-number` 元素中使用 `v-model` 绑定变量即可，变量的初始值即为默认值。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
    <p>当前值：{{ num }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num = ref(1)

const handleChange = (value) => {
  console.log('数值改变:', value)
}
</script>
```

### 禁用状态

`disabled` 属性接受一个 `Boolean`，设置为 `true` 即可禁用整个组件。如果你只需要控制数值在某一范围内，可以设置 `min` 属性和 `max` 属性，默认最小值为 `0`。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <el-input-number v-model="num1" :min="1" :max="10" />
    <el-input-number v-model="num2" :min="1" :max="10" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(1)
</script>
```

## 步长

允许定义递增递减的步长控制。设置 `step` 属性可以控制步长。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <span class="demo-label">步长为1：</span>
    <el-input-number v-model="num1" :min="0" :max="10" :step="1" />
    
    <span class="demo-label">步长为2：</span>
    <el-input-number v-model="num2" :min="0" :max="10" :step="2" />
    
    <span class="demo-label">步长为0.1：</span>
    <el-input-number v-model="num3" :min="0" :max="10" :step="0.1" :precision="2" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(0)
const num2 = ref(0)
const num3 = ref(0)
</script>

<style>
.demo-label {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
}
</style>
```

## 严格步长

`step-strictly` 属性接受一个 `Boolean`。如果这个属性被设置为 `true`，则只能输入步长的倍数。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <span class="demo-label">严格步长：</span>
    <el-input-number v-model="num" :min="0" :max="10" :step="2" step-strictly />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num = ref(2)
</script>

<style>
.demo-label {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
}
</style>
```

## 精度

设置 `precision` 属性可以控制数值精度，接收一个 `Number`。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <span class="demo-label">精度为2：</span>
    <el-input-number v-model="num1" :precision="2" :step="0.1" :max="10" />
    
    <span class="demo-label">精度为0：</span>
    <el-input-number v-model="num2" :precision="0" :step="1" :max="10" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(1.00)
const num2 = ref(1)
</script>

<style>
.demo-label {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
}
</style>
```

::: tip 提示
`precision` 的值必须是一个非负整数，并且不能小于 `step` 的小数位数。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>
:::

## 尺寸

使用 `size` 属性额外配置尺寸，可选的尺寸大小为：`large` 或 `small`。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div class="demo-input-number-size">
    <el-input-number v-model="num1" size="large" />
    <el-input-number v-model="num2" />
    <el-input-number v-model="num3" size="small" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(1)
const num3 = ref(1)
</script>

<style>
.demo-input-number-size .el-input-number {
  margin-right: 10px;
}
</style>
```

## 按钮位置

设置 `controls-position` 属性可以控制按钮位置。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <span class="demo-label">默认位置：</span>
    <el-input-number v-model="num1" :min="1" :max="10" />
    
    <span class="demo-label">右侧位置：</span>
    <el-input-number v-model="num2" :min="1" :max="10" controls-position="right" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(1)
</script>

<style>
.demo-label {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
```

## 无边框

通过设置 `controls` 属性为 `false` 来隐藏按钮。<mcreference link="https://element-plus.org/zh-CN/component/input-number.html" index="2">2</mcreference>

```vue
<template>
  <div>
    <span class="demo-label">有按钮：</span>
    <el-input-number v-model="num1" :min="1" :max="10" />
    
    <span class="demo-label">无按钮：</span>
    <el-input-number v-model="num2" :min="1" :max="10" :controls="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const num1 = ref(1)
const num2 = ref(1)
</script>

<style>
.demo-label {
  display: inline-block;
  width: 120px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
```

## 实际应用示例

### 商品数量选择器

```vue
<template>
  <div class="product-quantity">
    <span class="product-label">商品数量：</span>
    <el-input-number
      v-model="quantity"
      :min="1"
      :max="stock"
      @change="handleQuantityChange"
    />
    <span class="stock-info">库存：{{ stock }} 件</span>
  </div>
  
  <div class="price-info">
    <p>单价：¥{{ price }}</p>
    <p>总价：¥{{ totalPrice }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const quantity = ref(1)
const stock = ref(99)
const price = ref(29.9)

const totalPrice = computed(() => {
  return (quantity.value * price.value).toFixed(2)
})

const handleQuantityChange = (value) => {
  console.log('数量变更为:', value)
}
</script>

<style>
.product-quantity {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-label {
  margin-right: 10px;
}

.stock-info {
  margin-left: 10px;
  color: #999;
}

.price-info p {
  margin: 5px 0;
}
</style>
```

### 分页大小选择器

```vue
<template>
  <div class="pagination-size">
    <span>每页显示：</span>
    <el-input-number
      v-model="pageSize"
      :min="10"
      :max="100"
      :step="10"
      step-strictly
      @change="handlePageSizeChange"
    />
    <span>条记录</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const pageSize = ref(20)

const handlePageSizeChange = (value) => {
  console.log('每页显示条数:', value)
  // 这里可以触发数据重新加载
}
</script>

<style>
.pagination-size {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
```

### 价格输入器

```vue
<template>
  <div class="price-input">
    <span class="price-label">商品价格：</span>
    <el-input-number
      v-model="price"
      :min="0"
      :max="99999"
      :precision="2"
      :step="0.01"
      placeholder="请输入价格"
    />
    <span class="currency">元</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const price = ref(0.00)
</script>

<style>
.price-input {
  display: flex;
  align-items: center;
}

.price-label {
  margin-right: 10px;
}

.currency {
  margin-left: 10px;
}
</style>
```

## API

### InputNumber Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 绑定值 | number | — |
| min | 设置计数器允许的最小值 | number | -Infinity |
| max | 设置计数器允许的最大值 | number | Infinity |
| step | 计数器步长 | number | 1 |
| step-strictly | 是否只能输入 step 的倍数 | boolean | false |
| precision | 数值精度 | number | — |
| size | 计数器尺寸 | enum | — |
| readonly | 原生 readonly 属性，是否只读 | boolean | false |
| disabled | 是否禁用状态 | boolean | false |
| controls | 是否使用控制按钮 | boolean | true |
| controls-position | 控制按钮位置 | enum | — |
| name | 等价于原生 input name 属性 | string | — |
| label | 等价于原生 input aria-label 属性 | string | — |
| placeholder | 等价于原生 input placeholder 属性 | string | — |
| id | 等价于原生 input id 属性 | string | — |
| value-on-clear | 当输入框被清空时显示的值 | number / null | null |
| validate-event | 输入时是否触发表单的校验 | boolean | true |

### InputNumber Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 绑定值被改变时触发 | Function |
| blur | 在组件 Input 失去焦点时触发 | Function |
| focus | 在组件 Input 获得焦点时触发 | Function |

### InputNumber Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

## 实践练习

### 练习1：购物车数量控制

创建一个购物车商品数量控制组件：
- 最小数量为1
- 最大数量根据库存限制
- 实时计算总价
- 数量变化时更新购物车

### 练习2：表单数值输入

实现一个包含多种数值输入的表单：
- 年龄输入（18-100岁）
- 身高输入（精确到小数点后1位）
- 体重输入（精确到小数点后1位）
- 收入输入（整数，步长1000）

### 练习3：配置参数设置

创建一个系统配置界面：
- 超时时间设置（秒）
- 重试次数设置
- 缓存大小设置（MB）
- 并发数设置

## 常见问题

### 1. 精度问题

当使用小数步长时，可能会遇到 JavaScript 浮点数精度问题：

```javascript
// 解决方案：设置合适的 precision
<el-input-number
  v-model="value"
  :step="0.1"
  :precision="1"
/>
```

### 2. 数值验证

```vue
<template>
  <el-form :model="form" :rules="rules">
    <el-form-item label="数量" prop="quantity">
      <el-input-number v-model="form.quantity" :min="1" :max="100" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  quantity: 1
})

const rules = {
  quantity: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '数量必须在1-100之间', trigger: 'blur' }
  ]
}
</script>
```

### 3. 自定义格式化

```vue
<template>
  <el-input-number
    v-model="value"
    :formatter="formatter"
    :parser="parser"
  />
</template>

<script setup>
import { ref } from 'vue'

const value = ref(1000)

const formatter = (value) => {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const parser = (value) => {
  return value.replace(/\$\s?|(,*)/g, '')
}
</script>
```

## 总结

Input Number 数字输入框是处理数值输入的专用组件，相比普通输入框具有更强的数值控制能力。重点要掌握：

1. **基础配置**：min、max、step 等基本属性
2. **精度控制**：precision 属性的正确使用
3. **用户体验**：合理的步长和范围设置
4. **样式定制**：尺寸、按钮位置等外观控制
5. **事件处理**：change、focus、blur 等事件的使用

通过合理使用 Input Number 组件，可以为用户提供更好的数值输入体验，避免无效输入，提高数据质量。