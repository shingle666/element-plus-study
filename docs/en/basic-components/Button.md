# Button Component

## Overview

The Button component is one of the most fundamental interactive elements in Element Plus. It provides various styles, sizes, and states to meet different design requirements.

## Basic Usage

### Default Buttons

```vue
<template>
  <div class="button-demo">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
</template>

<style>
.button-demo .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
```

### Plain Buttons

```vue
<template>
  <div class="button-demo">
    <el-button plain>Plain</el-button>
    <el-button type="primary" plain>Primary</el-button>
    <el-button type="success" plain>Success</el-button>
    <el-button type="info" plain>Info</el-button>
    <el-button type="warning" plain>Warning</el-button>
    <el-button type="danger" plain>Danger</el-button>
  </div>
</template>
```

## Button Sizes

```vue
<template>
  <div class="button-demo">
    <el-button size="large">Large</el-button>
    <el-button>Default</el-button>
    <el-button size="small">Small</el-button>
  </div>
</template>
```

## Button States

### Disabled State

```vue
<template>
  <div class="button-demo">
    <el-button disabled>Disabled</el-button>
    <el-button type="primary" disabled>Primary Disabled</el-button>
    <el-button type="success" disabled>Success Disabled</el-button>
  </div>
</template>
```

### Loading State

```vue
<template>
  <div class="button-demo">
    <el-button loading>Loading</el-button>
    <el-button type="primary" loading>Primary Loading</el-button>
    <el-button 
      type="success" 
      :loading="isLoading"
      @click="handleClick"
    >
      Click to Load
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(false)

const handleClick = () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>
```

## Icon Buttons

### With Icons

```vue
<template>
  <div class="button-demo">
    <!-- Using Element Plus icons -->
    <el-button type="primary" :icon="Edit">Edit</el-button>
    <el-button type="success" :icon="Check">Confirm</el-button>
    <el-button type="danger" :icon="Delete">Delete</el-button>
    
    <!-- Icon only buttons -->
    <el-button type="primary" :icon="Search" circle />
    <el-button type="success" :icon="Plus" circle />
    <el-button type="danger" :icon="Close" circle />
  </div>
</template>

<script setup>
import { Edit, Check, Delete, Search, Plus, Close } from '@element-plus/icons-vue'
</script>
```

### Custom Icons

```vue
<template>
  <div class="button-demo">
    <el-button>
      <template #icon>
        <svg viewBox="0 0 1024 1024" width="1em" height="1em">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z" fill="currentColor"/>
        </svg>
      </template>
      Custom Icon
    </el-button>
  </div>
</template>
```

## Button Groups

```vue
<template>
  <div class="button-demo">
    <el-button-group>
      <el-button type="primary" :icon="ArrowLeft">Previous</el-button>
      <el-button type="primary" :icon="ArrowRight">Next</el-button>
    </el-button-group>
    
    <el-button-group>
      <el-button :icon="Edit" />
      <el-button :icon="Share" />
      <el-button :icon="Delete" />
    </el-button-group>
  </div>
</template>

<script setup>
import { ArrowLeft, ArrowRight, Edit, Share, Delete } from '@element-plus/icons-vue'
</script>
```

## Advanced Usage

### Text Buttons

```vue
<template>
  <div class="button-demo">
    <el-button text>Text Button</el-button>
    <el-button text type="primary">Primary Text</el-button>
    <el-button text type="success">Success Text</el-button>
    <el-button text type="danger">Danger Text</el-button>
    <el-button text disabled>Disabled Text</el-button>
  </div>
</template>
```

### Link Buttons

```vue
<template>
  <div class="button-demo">
    <el-button link type="primary">Primary Link</el-button>
    <el-button link type="success">Success Link</el-button>
    <el-button link type="danger">Danger Link</el-button>
    <el-button link disabled>Disabled Link</el-button>
  </div>
</template>
```

### Round and Circle Buttons

```vue
<template>
  <div class="button-demo">
    <!-- Round buttons -->
    <el-button round>Round</el-button>
    <el-button type="primary" round>Primary Round</el-button>
    <el-button type="success" round>Success Round</el-button>
    
    <!-- Circle buttons -->
    <el-button :icon="Search" circle />
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
  </div>
</template>

<script setup>
import { Search, Edit, Check } from '@element-plus/icons-vue'
</script>
```

## Event Handling

```vue
<template>
  <div class="button-demo">
    <el-button @click="handleClick">Click Me</el-button>
    <el-button @click="handleAsyncAction" :loading="loading">
      Async Action
    </el-button>
    <el-button @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      Hover Me
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)

const handleClick = () => {
  ElMessage.success('Button clicked!')
}

const handleAsyncAction = async () => {
  loading.value = true
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('Action completed!')
  } catch (error) {
    ElMessage.error('Action failed!')
  } finally {
    loading.value = false
  }
}

const handleMouseEnter = () => {
  console.log('Mouse entered')
}

const handleMouseLeave = () => {
  console.log('Mouse left')
}
</script>
```

## Customization

### Custom Styles

```vue
<template>
  <div class="button-demo">
    <el-button class="custom-button">Custom Styled</el-button>
    <el-button class="gradient-button">Gradient Button</el-button>
  </div>
</template>

<style>
.custom-button {
  --el-button-bg-color: #ff6b6b;
  --el-button-border-color: #ff6b6b;
  --el-button-hover-bg-color: #ff5252;
  --el-button-hover-border-color: #ff5252;
}

.gradient-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.gradient-button:hover {
  background: linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
```

### Theme Variables

```scss
// Custom button theme
:root {
  --el-button-font-size: 14px;
  --el-button-border-radius: 6px;
  --el-button-padding-horizontal: 20px;
  --el-button-padding-vertical: 12px;
}

// Size-specific customization
.el-button--large {
  --el-button-padding-horizontal: 24px;
  --el-button-padding-vertical: 16px;
  --el-button-font-size: 16px;
}

.el-button--small {
  --el-button-padding-horizontal: 16px;
  --el-button-padding-vertical: 8px;
  --el-button-font-size: 12px;
}
```

## API Reference

### Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'large' \| 'default' \| 'small'` | `'default'` | Button size |
| `type` | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `''` | Button type |
| `plain` | `boolean` | `false` | Whether button is plain |
| `text` | `boolean` | `false` | Whether button is text button |
| `link` | `boolean` | `false` | Whether button is link button |
| `round` | `boolean` | `false` | Whether button is round |
| `circle` | `boolean` | `false` | Whether button is circle |
| `loading` | `boolean` | `false` | Whether button is loading |
| `disabled` | `boolean` | `false` | Whether button is disabled |
| `icon` | `Component` | `undefined` | Icon component |
| `autofocus` | `boolean` | `false` | Whether button should autofocus |
| `native-type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type |

### Button Events

| Event | Parameters | Description |
|-------|------------|-------------|
| `click` | `(event: MouseEvent)` | Triggered when button is clicked |
| `focus` | `(event: FocusEvent)` | Triggered when button gains focus |
| `blur` | `(event: FocusEvent)` | Triggered when button loses focus |

### Button Slots

| Slot | Description |
|------|-------------|
| `default` | Button content |
| `icon` | Custom icon |
| `loading` | Custom loading icon |

## Best Practices

### 1. Choose Appropriate Types

```vue
<!-- ✅ Good: Use semantic button types -->
<el-button type="primary">Save</el-button>
<el-button type="danger">Delete</el-button>
<el-button type="success">Confirm</el-button>

<!-- ❌ Bad: Misusing button types -->
<el-button type="danger">Save</el-button>
<el-button type="success">Cancel</el-button>
```

### 2. Provide Clear Labels

```vue
<!-- ✅ Good: Clear, action-oriented labels -->
<el-button type="primary">Save Changes</el-button>
<el-button>Cancel</el-button>

<!-- ❌ Bad: Vague labels -->
<el-button type="primary">OK</el-button>
<el-button>No</el-button>
```

### 3. Use Loading States

```vue
<!-- ✅ Good: Show loading state for async actions -->
<el-button 
  type="primary" 
  :loading="isSubmitting"
  @click="handleSubmit"
>
  {{ isSubmitting ? 'Saving...' : 'Save' }}
</el-button>
```

### 4. Accessibility

```vue
<!-- ✅ Good: Proper accessibility attributes -->
<el-button 
  :aria-label="buttonLabel"
  :aria-disabled="disabled"
  role="button"
>
  {{ text }}
</el-button>
```

## Common Patterns

### Form Actions

```vue
<template>
  <div class="form-actions">
    <el-button type="primary" @click="handleSubmit">Submit</el-button>
    <el-button @click="handleReset">Reset</el-button>
    <el-button text @click="handleCancel">Cancel</el-button>
  </div>
</template>

<style>
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
```

### Toolbar Actions

```vue
<template>
  <div class="toolbar">
    <el-button-group>
      <el-button :icon="Plus" @click="handleAdd">Add</el-button>
      <el-button :icon="Edit" @click="handleEdit" :disabled="!selected">
        Edit
      </el-button>
      <el-button :icon="Delete" @click="handleDelete" :disabled="!selected">
        Delete
      </el-button>
    </el-button-group>
  </div>
</template>
```

## Next Steps

- [Border Component](/en/basic-components/Border)
- [Color System](/en/basic-components/Color)
- [Layout Components](/en/basic-components/Layout)
- [Form Components](/en/form-components/Input)

---

**The Button component is the foundation of user interactions. Master its usage to build intuitive interfaces.** 🎯