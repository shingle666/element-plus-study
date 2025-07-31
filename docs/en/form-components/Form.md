# Form Component

## Overview

Form contains input boxes, radio buttons, dropdown selections, checkboxes and other user input components. Using forms, you can collect, validate and submit data.

::: tip Note
The Form component has been upgraded from 2.x Float layout to Flex layout.
:::

## Learning Objectives

- Master the basic structure of el-form
- Understand the usage of el-form-item form items
- Learn form data binding (v-model)
- Master form layout: inline, label-position
- Understand form size control
- Learn form disabled state
- Master form reset and submission
- Understand form validation mechanism

## Basic Usage

### Typical Form

The most basic form includes various input form items, such as input, select, radio, checkbox, etc. In each form component, you need a form-item field as a container for input items, used to get values and validate values.

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Username">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Password">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
      <el-button @click="onReset">Reset</el-button>
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
  console.log('submit!', form)
}

const onReset = () => {
  form.name = ''
  form.password = ''
  form.email = ''
}
</script>
```

### Inline Form

When vertical space is limited and the form is relatively simple, you can put it in one line.

```vue
<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="formInline.user" placeholder="Approved by" clearable />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
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
  console.log('submit!')
}
</script>
```

### Label Alignment

Depending on your design, there are several different ways to align your label element.

```vue
<template>
  <el-radio-group v-model="labelPosition" size="small">
    <el-radio-button label="left">Left</el-radio-button>
    <el-radio-button label="right">Right</el-radio-button>
    <el-radio-button label="top">Top</el-radio-button>
  </el-radio-group>
  <div style="margin: 20px" />
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
  >
    <el-form-item label="Name">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-input v-model="formLabelAlign.region" />
    </el-form-item>
    <el-form-item label="Activity form">
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

### Form Validation

Form component allows you to verify your data, helping you find and correct errors.

```vue
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="Password" prop="pass">
      <el-input
        v-model="ruleForm.pass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="Confirm" prop="checkPass">
      <el-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="Age" prop="age">
      <el-input v-model.number="ruleForm.age" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Submit
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  pass: string
  checkPass: string
  age: number
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  pass: '',
  checkPass: '',
  age: 0
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RuleForm>>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [
    { required: true, message: 'Please input age', trigger: 'blur' },
    { type: 'number', message: 'Age must be a number', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
```

### Custom Validation Rules

This example shows how to customize your own validation rules to finish a two-factor password verification.

```vue
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="Password" prop="pass">
      <el-input
        v-model="ruleForm.pass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="Confirm" prop="checkPass">
      <el-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Submit
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  }, 1000)
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  age: ''
})

const rules = reactive<FormRules>({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [{ validator: checkAge, trigger: 'blur' }]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
```

## API Reference

### Form Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| model | data of form component | object | — | — |
| rules | validation rules of form | object | — | — |
| inline | whether the form is inline | boolean | — | false |
| label-position | position of label. If set to 'left' or 'right', `label-width` prop is also required | string | left / right / top | right |
| label-width | width of label, e.g. '50px'. All its direct child form-items will inherit this value. Width `auto` is supported. | string / number | — | — |
| label-suffix | suffix of the label | string | — | — |
| hide-required-asterisk | whether to hide required fields should have a red asterisk (star) beside their labels | boolean | — | false |
| require-asterisk-position | position of asterisk | string | left / right | left |
| show-message | whether to show the error message | boolean | — | true |
| inline-message | whether to display the error message inline with the form item | boolean | — | false |
| status-icon | whether to display an icon indicating the validation result | boolean | — | false |
| validate-on-rule-change | whether to trigger validation when the `rules` prop is changed | boolean | — | true |
| size | control the size of components in this form | string | large / default / small | — |
| disabled | whether to disable all components in this form. If set to true, it cannot be overridden by its inner components' `disabled` prop | boolean | — | false |
| scroll-to-error | When validation fails, scroll to the first error form entry | boolean | — | false |

### Form Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| validate | validate the whole form. Takes a callback as a param. After validation, the callback will be executed with two params: a boolean indicating if the validation has passed, and an object containing all fields that fail the validation. Returns a promise if callback is omitted | Function(callback: Function(boolean, object)) |
| validateField | validate one or several form items | Function(props: array \| string, callback: Function(errorMessage: string)) |
| resetFields | reset all the fields and remove validation result | — |
| scrollToField | scroll to the specified form field | Function(prop: string) |
| clearValidate | clear validation message for certain fields. The parameter is prop name or an array of prop names of the form items whose validation messages will be removed. When omitted, all fields' validation messages will be removed | Function(props: array \| string) |

### Form Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| validate | triggers after a form item is validated | prop name of the form item being validated, whether validation is passed and the error message if not |

### Form Slots

| Name | Description |
|------|-------------|
| — | content of Form |

### FormItem Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| prop | a key of `model`. In the use of validate and resetFields method, the attribute is required | string | keys of model that passed to form | — |
| label | label | string | — | — |
| label-width | width of label, e.g. '50px'. Width `auto` is supported. | string / number | — | — |
| required | whether the field is required or not, will be determined by validation rules if omitted | boolean | — | false |
| rules | validation rules of form, see the following table, more advanced usage at [async-validator](https://github.com/yiminghe/async-validator) | object / array | — | — |
| error | field error message, set its value and the field will validate error and show this message immediately | string | — | — |
| show-message | whether to show the error message | boolean | — | true |
| inline-message | inline style validate message | boolean | — | false |
| size | control the size of components in this form-item | string | large / default / small | — |

### FormItem Slots

| Name | Description |
|------|-------------|
| — | content of Form Item |
| label | content of Form Item label |
| error | content of Form Item error message |

### FormItem Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| resetField | reset current field and remove validation result | — |
| clearValidate | remove validation status of the field | — |

## Best Practices

1. **Use appropriate validation**: Implement both client-side and server-side validation
2. **Provide clear feedback**: Show validation errors immediately and clearly
3. **Group related fields**: Use logical grouping for better user experience
4. **Consider accessibility**: Ensure proper labeling and keyboard navigation
5. **Handle loading states**: Show loading indicators during form submission
6. **Preserve user input**: Don't clear forms unnecessarily

## Common Use Cases

### Login Form
```vue
<template>
  <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="Username" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="Password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleLogin">Login</el-button>
    </el-form-item>
  </el-form>
</template>
```

### Registration Form
```vue
<template>
  <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
    <el-form-item label="Email" prop="email">
      <el-input v-model="registerForm.email" />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="registerForm.password" type="password" />
    </el-form-item>
    <el-form-item label="Confirm Password" prop="confirmPassword">
      <el-input v-model="registerForm.confirmPassword" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleRegister">Register</el-button>
    </el-form-item>
  </el-form>
</template>
```