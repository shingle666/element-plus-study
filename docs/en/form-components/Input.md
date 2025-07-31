# Input

## Overview

The Input component is a fundamental form control that allows users to enter and edit text. It supports various input types, validation states, and interactive features.

## Basic Usage

```vue
<template>
  <div>
    <el-input v-model="input" placeholder="Please input" />
    <p>Input value: {{ input }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
</script>
```

## Input Types

### Text Input
```vue
<template>
  <el-input v-model="text" placeholder="Enter text" />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('')
</script>
```

### Password Input
```vue
<template>
  <el-input
    v-model="password"
    type="password"
    placeholder="Enter password"
    show-password
  />
</template>

<script setup>
import { ref } from 'vue'
const password = ref('')
</script>
```

### Textarea
```vue
<template>
  <el-input
    v-model="textarea"
    type="textarea"
    :rows="4"
    placeholder="Enter description"
  />
</template>

<script setup>
import { ref } from 'vue'
const textarea = ref('')
</script>
```

## Input Sizes

```vue
<template>
  <div class="input-sizes">
    <el-input v-model="input1" size="large" placeholder="Large" />
    <el-input v-model="input2" placeholder="Default" />
    <el-input v-model="input3" size="small" placeholder="Small" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
</script>

<style>
.input-sizes .el-input {
  margin-bottom: 10px;
}
</style>
```

## Input States

### Disabled State
```vue
<template>
  <el-input v-model="input" disabled placeholder="Disabled input" />
</template>
```

### Readonly State
```vue
<template>
  <el-input v-model="input" readonly placeholder="Readonly input" />
</template>
```

### Clearable
```vue
<template>
  <el-input v-model="input" clearable placeholder="Clearable input" />
</template>
```

## Input with Icons

### Prefix and Suffix Icons
```vue
<template>
  <div>
    <el-input
      v-model="input1"
      placeholder="Please input"
      :prefix-icon="Search"
    />
    <el-input
      v-model="input2"
      placeholder="Please input"
      :suffix-icon="Calendar"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Calendar } from '@element-plus/icons-vue'

const input1 = ref('')
const input2 = ref('')
</script>
```

### Prepend and Append
```vue
<template>
  <div>
    <el-input v-model="input1" placeholder="Please input">
      <template #prepend>Http://</template>
    </el-input>
    
    <el-input v-model="input2" placeholder="Please input">
      <template #append>.com</template>
    </el-input>
    
    <el-input v-model="input3" placeholder="Please input">
      <template #prepend>
        <el-select v-model="select" placeholder="Select" style="width: 115px">
          <el-option label="Restaurant" value="1" />
          <el-option label="Order No." value="2" />
          <el-option label="Tel" value="3" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" />
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const select = ref('')
</script>
```

## Input Validation

### Basic Validation
```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username" placeholder="Enter username" />
    </el-form-item>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" placeholder="Enter email" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm">Submit</el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()

const form = reactive({
  username: '',
  email: ''
})

const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 15, message: 'Length should be 3 to 15', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input correct email', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  try {
    await formRef.value.validate()
    ElMessage.success('Form submitted successfully!')
  } catch (error) {
    ElMessage.error('Please fix the errors')
  }
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>
```

## Input Formatting

### Number Input with Formatting
```vue
<template>
  <div>
    <el-input
      v-model="price"
      placeholder="Enter price"
      @input="formatPrice"
    >
      <template #prepend>$</template>
    </el-input>
    
    <el-input
      v-model="phone"
      placeholder="Enter phone number"
      @input="formatPhone"
      maxlength="14"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const price = ref('')
const phone = ref('')

const formatPrice = (value) => {
  // Remove non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '')
  
  // Ensure only one decimal point
  const parts = numericValue.split('.')
  if (parts.length > 2) {
    price.value = parts[0] + '.' + parts.slice(1).join('')
  } else {
    price.value = numericValue
  }
}

const formatPhone = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (numericValue.length >= 6) {
    phone.value = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`
  } else if (numericValue.length >= 3) {
    phone.value = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`
  } else {
    phone.value = numericValue
  }
}
</script>
```

## Advanced Features

### Auto-resize Textarea
```vue
<template>
  <el-input
    v-model="textarea"
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 6 }"
    placeholder="Auto-resize textarea"
  />
</template>

<script setup>
import { ref } from 'vue'
const textarea = ref('')
</script>
```

### Input with Character Count
```vue
<template>
  <div>
    <el-input
      v-model="input"
      maxlength="100"
      show-word-limit
      placeholder="Max 100 characters"
    />
    
    <el-input
      v-model="textarea"
      type="textarea"
      maxlength="200"
      show-word-limit
      :autosize="{ minRows: 3, maxRows: 6 }"
      placeholder="Max 200 characters"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const input = ref('')
const textarea = ref('')
</script>
```

## Input Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| model-value / v-model | Binding value | string / number | — |
| type | Input type | string | text |
| maxlength | Maximum input length | string / number | — |
| minlength | Minimum input length | number | — |
| show-word-limit | Whether to show word count | boolean | false |
| placeholder | Input placeholder | string | — |
| clearable | Whether to show clear button | boolean | false |
| show-password | Whether to show password toggle | boolean | false |
| disabled | Whether Input is disabled | boolean | false |
| size | Input size | string | — |
| prefix-icon | Prefix icon component | string / Component | — |
| suffix-icon | Suffix icon component | string / Component | — |
| rows | Number of rows for textarea | number | 2 |
| autosize | Whether textarea auto-resize | boolean / object | false |
| readonly | Whether Input is readonly | boolean | false |
| resize | Control resize behavior | string | — |

## Input Events

| Event | Description | Parameters |
|-------|-------------|------------|
| blur | Triggers when Input loses focus | (event: Event) |
| focus | Triggers when Input gets focus | (event: Event) |
| change | Triggers when value changes | (value: string \| number) |
| input | Triggers when value is input | (value: string \| number) |
| clear | Triggers when clear button is clicked | — |

## Input Slots

| Slot | Description |
|------|-------------|
| prefix | Content as Input prefix |
| suffix | Content as Input suffix |
| prepend | Content to prepend before Input |
| append | Content to append after Input |

## Best Practices

1. **Validation**: Always provide clear validation messages
2. **Accessibility**: Use proper labels and ARIA attributes
3. **User Experience**: Provide helpful placeholder text
4. **Performance**: Debounce input events for expensive operations
5. **Security**: Validate and sanitize input on both client and server

## Related Components

- [Form](./form.md) - Form container and validation
- [Select](./select.md) - Dropdown selection
- [Autocomplete](./autocomplete.md) - Input with suggestions