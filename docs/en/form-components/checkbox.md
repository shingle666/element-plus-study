# Checkbox Component

## Overview

The Checkbox component is used to select multiple options from a set of choices. It is one of the commonly used components in forms, supporting both single checkbox and checkbox group usage methods, and providing rich configuration options and styles.

## Learning Objectives

- Master the basic concepts and use cases of Checkbox
- Learn how to use basic checkboxes
- Understand checkbox group configuration and management
- Master different checkbox styles implementation
- Learn checkbox state control and event handling
- Understand checkbox sizes and disabled states
- Master the implementation of select all and indeterminate states
- Master the complete usage of the API

## Basic Usage

### Basic Checkbox

The simplest checkbox usage:

```vue
<template>
  <div>
    <el-checkbox v-model="checked1" label="Option 1" />
    <el-checkbox v-model="checked2" label="Option 2" />
    <p>Option 1 status: {{ checked1 }}</p>
    <p>Option 2 status: {{ checked2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
</script>
```

### Disabled State

Use the `disabled` attribute to disable a checkbox:

```vue
<template>
  <div>
    <el-checkbox v-model="checked1" disabled>Disabled state</el-checkbox>
    <el-checkbox v-model="checked2" disabled>Checked and disabled</el-checkbox>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checked1 = ref(false)
const checked2 = ref(true)
</script>
```

## Checkbox Group

### Basic Checkbox Group

Use the `el-checkbox-group` element to manage multiple checkboxes as a group:

```vue
<template>
  <div>
    <el-checkbox-group v-model="checkboxGroup">
      <el-checkbox label="Shanghai">Shanghai</el-checkbox>
      <el-checkbox label="Beijing">Beijing</el-checkbox>
      <el-checkbox label="Guangzhou">Guangzhou</el-checkbox>
      <el-checkbox label="Shenzhen">Shenzhen</el-checkbox>
    </el-checkbox-group>
    <p>Selected cities: {{ checkboxGroup }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxGroup = ref(['Shanghai', 'Beijing'])
</script>
```

### Button Style

Use the `el-checkbox-button` element to implement button-style checkboxes:

```vue
<template>
  <div>
    <h4>Default Button Style</h4>
    <el-checkbox-group v-model="checkboxButton1">
      <el-checkbox-button label="Shanghai">Shanghai</el-checkbox-button>
      <el-checkbox-button label="Beijing">Beijing</el-checkbox-button>
      <el-checkbox-button label="Guangzhou">Guangzhou</el-checkbox-button>
      <el-checkbox-button label="Shenzhen">Shenzhen</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>Disabled State</h4>
    <el-checkbox-group v-model="checkboxButton2">
      <el-checkbox-button label="Shanghai">Shanghai</el-checkbox-button>
      <el-checkbox-button label="Beijing" disabled>Beijing</el-checkbox-button>
      <el-checkbox-button label="Guangzhou">Guangzhou</el-checkbox-button>
      <el-checkbox-button label="Shenzhen">Shenzhen</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxButton1 = ref(['Shanghai'])
const checkboxButton2 = ref(['Shanghai', 'Guangzhou'])
</script>
```

### With Border

Set the `border` attribute to render checkboxes with borders:

```vue
<template>
  <div>
    <h4>Checkboxes with Border</h4>
    <el-checkbox v-model="checkboxBorder1" label="Option 1" border>Option 1</el-checkbox>
    <el-checkbox v-model="checkboxBorder2" label="Option 2" border>Option 2</el-checkbox>
    
    <h4>Checkbox Group with Border</h4>
    <el-checkbox-group v-model="checkboxBorderGroup">
      <el-checkbox label="Shanghai" border>Shanghai</el-checkbox>
      <el-checkbox label="Beijing" border>Beijing</el-checkbox>
      <el-checkbox label="Guangzhou" border disabled>Guangzhou</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxBorder1 = ref(true)
const checkboxBorder2 = ref(false)
const checkboxBorderGroup = ref(['Shanghai'])
</script>
```

## Sizes

Use the `size` attribute to set the size of checkboxes:

```vue
<template>
  <div>
    <h4>Large Size</h4>
    <el-checkbox-group v-model="checkboxSize1" size="large">
      <el-checkbox-button label="Shanghai">Shanghai</el-checkbox-button>
      <el-checkbox-button label="Beijing">Beijing</el-checkbox-button>
      <el-checkbox-button label="Guangzhou">Guangzhou</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>Default Size</h4>
    <el-checkbox-group v-model="checkboxSize2">
      <el-checkbox-button label="Shanghai">Shanghai</el-checkbox-button>
      <el-checkbox-button label="Beijing">Beijing</el-checkbox-button>
      <el-checkbox-button label="Guangzhou">Guangzhou</el-checkbox-button>
    </el-checkbox-group>
    
    <h4>Small Size</h4>
    <el-checkbox-group v-model="checkboxSize3" size="small">
      <el-checkbox-button label="Shanghai">Shanghai</el-checkbox-button>
      <el-checkbox-button label="Beijing">Beijing</el-checkbox-button>
      <el-checkbox-button label="Guangzhou">Guangzhou</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkboxSize1 = ref(['Shanghai'])
const checkboxSize2 = ref(['Shanghai'])
const checkboxSize3 = ref(['Shanghai'])
</script>
```

## Select All and Indeterminate State

Implementing select all and indeterminate functionality:

```vue
<template>
  <div>
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      Select All
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
const checkedCities = ref(['Shanghai', 'Beijing'])
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']
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

## Limiting the Number of Checked Items

Use the `min` and `max` attributes to limit the number of items that can be checked:

```vue
<template>
  <div>
    <p>Select at least 2 and at most 3 cities:</p>
    <el-checkbox-group
      v-model="checkedCities"
      :min="2"
      :max="3"
    >
      <el-checkbox v-for="city in cities" :key="city" :label="city">
        {{ city }}
      </el-checkbox>
    </el-checkbox-group>
    <p>Selected: {{ checkedCities.length }} cities</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const checkedCities = ref(['Shanghai', 'Beijing'])
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Hangzhou']
</script>
```

## API Documentation

### Checkbox Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string / number / boolean | — |
| label | value of the Checkbox when used inside a checkbox-group | string / number / boolean / object | — |
| true-label | value of the Checkbox if it's checked | string / number | — |
| false-label | value of the Checkbox if it's not checked | string / number | — |
| disabled | whether the Checkbox is disabled | boolean | false |
| border | whether to add a border around Checkbox | boolean | false |
| size | size of the Checkbox | enum | — |
| name | native 'name' attribute | string | — |
| checked | if the Checkbox is checked | boolean | false |
| indeterminate | same as indeterminate in native checkbox | boolean | false |
| validate-event | whether to trigger form validation | boolean | true |
| tabindex | input tabindex | string / number | — |
| id | input id | string | — |
| controls | same as aria-controls | string | — |

### Checkbox Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |

### Checkbox Slots

| Name | Description |
|------|-------------|
| default | customize default content |

### CheckboxGroup Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | object | — |
| size | size of checkbox buttons or bordered checkboxes | enum | — |
| disabled | whether the nesting checkboxes are disabled | boolean | false |
| min | minimum number of checkbox checked | number | — |
| max | maximum number of checkbox checked | number | — |
| text-color | font color when button is active | string | #ffffff |
| fill | border and background color when button is active | string | #409eff |
| tag | element tag of the checkbox group | string | div |
| validate-event | whether to trigger form validation | boolean | true |
| label | label for screen reader | string | — |
| id | input id | string | — |

### CheckboxGroup Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |

### CheckboxGroup Slots

| Name | Description |
|------|-------------|
| default | customize default content |

### CheckboxButton Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| label | value of the checkbox when used inside a checkbox-group | string / number / boolean / object | — |
| true-label | value of the checkbox if it's checked | string / number | — |
| false-label | value of the checkbox if it's not checked | string / number | — |
| disabled | whether the checkbox is disabled | boolean | false |
| name | native 'name' attribute | string | — |
| checked | if the checkbox is checked | boolean | false |

### CheckboxButton Slots

| Name | Description |
|------|-------------|
| default | customize default content |

## Common Issues

### 1. Checkbox Value Not Updating

**Issue**: Checkbox value is not correctly bound or updated

**Solution**:
```vue
<!-- Incorrect usage -->
<el-checkbox v-model="value" :label="item">{{ item }}</el-checkbox>

<!-- Correct usage -->
<el-checkbox v-model="value" :label="item.value">{{ item.label }}</el-checkbox>
```

### 2. Incorrect Select All State

**Issue**: Select all and indeterminate states are not displaying correctly

**Solution**:
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

### 3. Key Issues with Dynamic Options

**Issue**: Dynamically generated checkbox options may have rendering problems

**Solution**:
```vue
<el-checkbox
  v-for="option in options"
  :key="option.id"
  :label="option.value"
>
  {{ option.label }}
</el-checkbox>
```

## Best Practices

1. **Semantic Labels**: Provide meaningful labels for checkbox groups
2. **Logical Grouping**: Related options should be placed in the same checkbox group
3. **State Management**: Use disabled states appropriately to guide user operations
4. **User Feedback**: Provide appropriate feedback when values change
5. **Accessibility**: Ensure keyboard navigation and screen reader support
6. **Select All Control**: Provide select all/deselect all functionality in multi-select scenarios

## Summary

The Checkbox component is an important form component that supports:

- Basic checkboxes and checkbox groups
- Multiple styles (default, button, border)
- Size control and state management
- Select all and indeterminate states
- Quantity limitation functionality
- Rich event handling mechanisms
- Good accessibility support

Mastering the use of the Checkbox component can help you build more flexible and user-friendly form interfaces.

## References

- [Element Plus Checkbox Official Documentation](https://element-plus.org/en-US/component/checkbox.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)