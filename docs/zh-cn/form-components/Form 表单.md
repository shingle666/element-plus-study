# Form 表单

## 概述

表单包含 输入框, 单选框, 下拉选择, 多选框 等用户输入的组件。使用表单，您可以收集、验证和提交数据。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

::: tip 提示
Form 组件已经从 2.x 的 Float 布局升级为 Flex 布局。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>
:::

## 学习目标

- 掌握 el-form 基础结构
- 理解 el-form-item 表单项的使用
- 学会表单数据绑定（v-model）
- 掌握表单布局：inline、label-position
- 了解表单尺寸控制
- 学会表单禁用状态
- 掌握表单重置和提交
- 理解表单验证机制

## 基础用法

### 典型表单

最基础的表单包括各种输入表单项，比如input、select、radio、checkbox等。在每一个 form 组件中，你需要一个 form-item 字段作为输入项的容器，用于获取值与验证值。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="用户名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  password: '',
  email: ''
})

const onSubmit = () => {
  console.log('提交表单:', form)
}

const onReset = () => {
  form.name = ''
  form.password = ''
  form.email = ''
}
</script>
```

::: tip W3C 标准
当一个表单中只有一个单行文本输入字段时，浏览器应当将在此字段中按下 Enter（回车键）的行为视为提交表单的请求。如果希望阻止这一默认行为，可以在 `<el-form>` 标签上添加 `@submit.prevent`。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>
:::

### 行内表单

当垂直方向空间受限且表单较简单时，可以在一行内放置表单。通过设置 `inline` 属性为 `true` 可以让表单域变为行内的表单域。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

```vue
<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="用户名">
      <el-input v-model="formInline.user" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="活动区域">
      <el-select v-model="formInline.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai" />
        <el-option label="区域二" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const formInline = reactive({
  user: '',
  region: ''
})

const onSubmit = () => {
  console.log('查询:', formInline)
}
</script>
```

### 对齐方式

根据你们的设计情况，来选择最佳的标签对齐方式。通过设置 `label-position` 属性可以改变表单域标签的位置，可选值为 `top`、`left`，当设为 `top` 时标签会置于表单域的顶部。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

```vue
<template>
  <el-radio-group v-model="labelPosition" size="small">
    <el-radio-button label="left">左对齐</el-radio-button>
    <el-radio-button label="right">右对齐</el-radio-button>
    <el-radio-button label="top">顶部对齐</el-radio-button>
  </el-radio-group>
  
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
  >
    <el-form-item label="姓名">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="活动区域">
      <el-input v-model="formLabelAlign.region" />
    </el-form-item>
    <el-form-item label="活动形式">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const labelPosition = ref('right')
const formLabelAlign = reactive({
  name: '',
  region: '',
  type: ''
})
</script>
```

## 表单验证

Form 组件允许你验证用户的输入是否符合规范，来帮助你找到和纠正错误。Form 组件提供了表单验证的功能，只需为 `rules` 属性传入约定的验证规则，并将 `form-Item` 的 `prop` 属性设置为需要验证的特殊键值即可。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

```vue
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    status-icon
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPassword">
      <el-input v-model="ruleForm.checkPassword" type="password" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPassword', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  name: '',
  password: '',
  checkPassword: '',
  email: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [{ validator: validatePass, trigger: 'blur' }],
  checkPassword: [{ validator: validatePass2, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('提交成功!', ruleForm)
    } else {
      console.log('验证失败!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
```

## 尺寸控制

表单中的所有子组件都继承了该表单的 `size` 属性。同样，`form-item` 也有一个 `size` 属性。如果希望某个表单项或某个表单组件的尺寸不同于 Form 上的 `size` 属性，直接为这个表单项或表单组件设置自己的 `size` 属性即可。<mcreference link="https://element-plus.org/zh-CN/component/form.html" index="0">0</mcreference>

```vue
<template>
  <el-form :model="sizeForm" size="large" label-width="120px">
    <el-form-item label="用户名">
      <el-input v-model="sizeForm.name" />
    </el-form-item>
    <el-form-item label="活动区域" size="default">
      <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai" />
        <el-option label="区域二" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="活动时间" size="small">
      <el-date-picker
        v-model="sizeForm.date"
        type="date"
        placeholder="选择日期"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const sizeForm = reactive({
  name: '',
  region: '',
  date: ''
})
</script>
```

## API

### Form Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model | 表单数据对象 | object | — |
| rules | 表单验证规则 | object | — |
| inline | 行内表单模式 | boolean | false |
| label-position | 表单域标签的位置，当设置为 left 或 right 时，则也需要设置 label-width 属性 | enum | right |
| label-width | 标签的长度，例如 '50px'。作为 Form 直接子元素的 form-item 会继承该值。可以使用 auto。 | string / number | '' |
| label-suffix | 表单域标签的后缀 | string | '' |
| hide-required-asterisk | 是否隐藏必填字段标签旁边的红色星号。 | boolean | false |
| require-asterisk-position | 星号的位置。 | enum | left |
| show-message | 是否显示校验错误信息 | boolean | true |
| inline-message | 是否以行内形式展示校验信息 | boolean | false |
| status-icon | 是否在输入框中显示校验结果反馈图标 | boolean | false |
| validate-on-rule-change | 是否在 rules 属性改变后立即触发一次验证 | boolean | true |
| size | 用于控制该表单内组件的尺寸 | enum | — |
| disabled | 是否禁用该表单内的所有组件。如果设置为 true，它将覆盖内部组件的 disabled 属性 | boolean | false |
| scroll-to-error | 当校验失败时，滚动到第一个错误表单项 | boolean | false |

### Form Events

| 名称 | 说明 | 类型 |
|------|------|------|
| validate | 任一表单项被校验后触发 | Function |

### Form Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| validate | 对整个表单的内容进行验证。接收一个回调函数，或返回 Promise。 | Function |
| validateField | 验证具体的某个字段。 | Function |
| resetFields | 重置该表单项，将其值重置为初始值，并移除校验结果 | Function |
| scrollToField | 滚动到指定的字段 | Function |
| clearValidate | 清理某个字段的表单验证信息。 | Function |

### FormItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| prop | model 的键名。它可以是一个属性的值 | string | — |
| label | 标签文本 | string | — |
| label-width | 表单域标签的宽度，例如 '50px'。支持 auto。 | string / number | '' |
| required | 是否为必填项，如不设置，则会根据校验规则确认 | boolean | false |
| rules | 表单验证规则，具体配置见下表，更多内容可以参考async-validator | object / array | — |
| error | 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 error，并显示该错误信息。 | string | — |
| show-message | 是否显示校验错误信息 | boolean | true |
| inline-message | 是否在行内显示校验信息 | boolean | false |
| size | 用于控制该表单域下组件的默认尺寸 | enum | — |

## 实践练习

### 练习1：用户注册表单

创建一个完整的用户注册表单，包含以下字段：
- 用户名（必填，3-15个字符）
- 密码（必填，6-20个字符）
- 确认密码（必填，与密码一致）
- 邮箱（必填，邮箱格式）
- 手机号（必填，手机号格式）
- 年龄（可选，18-100岁）

### 练习2：表单布局实践

实现不同布局的表单：
- 垂直布局表单
- 行内表单
- 标签在顶部的表单
- 混合布局表单

### 练习3：动态表单

实现一个可以动态添加和删除表单项的表单，例如：
- 联系人列表（可添加多个联系人）
- 技能列表（可添加多个技能）

## 常见问题

### 1. 表单验证不生效

确保：
- `el-form` 设置了 `:rules` 属性
- `el-form-item` 设置了 `prop` 属性
- `prop` 的值与 `rules` 中的键名一致

### 2. 表单重置不完全

使用 `resetFields()` 方法重置表单，确保表单项都有 `prop` 属性。

### 3. 自定义验证规则

```javascript
const validateCustom = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入内容'))
  } else if (value.length < 3) {
    callback(new Error('长度不能少于3个字符'))
  } else {
    callback()
  }
}
```

## 总结

Form 表单是 Element Plus 中最重要的组件之一，掌握表单的使用对于构建完整的应用程序至关重要。重点要理解：

1. **表单结构**：`el-form` + `el-form-item` 的组合
2. **数据绑定**：使用 `v-model` 绑定表单数据
3. **表单验证**：配置 `rules` 和 `prop` 实现验证
4. **表单操作**：提交、重置、清空等操作
5. **用户体验**：合理的布局和反馈机制

通过不断练习和实践，你将能够熟练使用 Form 组件构建各种复杂的表单应用。