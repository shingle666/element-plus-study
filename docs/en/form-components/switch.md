# Switch Component

## Overview

The Switch component represents a toggle between two opposing states, commonly used for "on/off" triggers. It is a simple and intuitive component that provides clear visual feedback and a good user experience.

## Learning Objectives

- Master the basic concepts and use cases of Switch
- Learn how to use basic switches
- Understand switch state control and event handling
- Master different styles and sizes of switches
- Learn to customize switch text and icons
- Understand disabled states and loading states
- Master the complete usage of the API

## Basic Usage

### Basic Switch

The simplest switch usage:

```vue
<template>
  <div>
    <el-switch v-model="value1" />
    <el-switch v-model="value2" />
    <p>Switch 1 status: {{ value1 }}</p>
    <p>Switch 2 status: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

### Disabled State

Use the `disabled` attribute to disable a switch:

```vue
<template>
  <div>
    <el-switch v-model="value1" disabled />
    <el-switch v-model="value2" disabled />
    <p>Disabled state (off): {{ value1 }}</p>
    <p>Disabled state (on): {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(false)
const value2 = ref(true)
</script>
```

### Loading State

Use the `loading` attribute to set the loading state of a switch:

```vue
<template>
  <div>
    <el-switch v-model="value1" loading />
    <el-switch v-model="value2" loading />
    <p>Loading state (off): {{ value1 }}</p>
    <p>Loading state (on): {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(false)
const value2 = ref(true)
</script>
```

## Text Description

### Basic Text Description

Use the `active-text` and `inactive-text` attributes to set the text description of a switch:

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      active-text="On"
      inactive-text="Off"
    />
    <br />
    <el-switch
      v-model="value2"
      active-text="Enable"
      inactive-text="Disable"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

### Text Inside Switch

Set the `inline-prompt` attribute to display text inside the switch:

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      inline-prompt
      active-text="ON"
      inactive-text="OFF"
    />
    <br />
    <el-switch
      v-model="value2"
      inline-prompt
      active-text="Y"
      inactive-text="N"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

## Display Custom Icons

Use the `active-icon` and `inactive-icon` attributes to set the icons of a switch:

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      :active-icon="Check"
      :inactive-icon="Close"
    />
    <br />
    <el-switch
      v-model="value2"
      inline-prompt
      :active-icon="Check"
      :inactive-icon="Close"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

## Extended Value Types

Set the `active-value` and `inactive-value` attributes to accept `Boolean`, `String`, or `Number` type values:

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      active-value="100"
      inactive-value="0"
    />
    <p>Current value: {{ value1 }} (Type: {{ typeof value1 }})</p>
    
    <el-switch
      v-model="value2"
      active-value="on"
      inactive-value="off"
    />
    <p>Current value: {{ value2 }} (Type: {{ typeof value2 }})</p>
    
    <el-switch
      v-model="value3"
      :active-value="1"
      :inactive-value="0"
    />
    <p>Current value: {{ value3 }} (Type: {{ typeof value3 }})</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('100')
const value2 = ref('on')
const value3 = ref(1)
</script>
```

## Sizes

Use the `size` attribute to set the size of a switch:

```vue
<template>
  <div>
    <h4>Large Size</h4>
    <el-switch v-model="value1" size="large" />
    
    <h4>Default Size</h4>
    <el-switch v-model="value2" />
    
    <h4>Small Size</h4>
    <el-switch v-model="value3" size="small" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(true)
const value3 = ref(true)
</script>
```

## Practical Application Examples

### Settings Panel Switches

```vue
<template>
  <div class="settings-panel">
    <h3>System Settings</h3>
    
    <div class="setting-item">
      <span>Notifications</span>
      <el-switch
        v-model="settings.notification"
        active-text="On"
        inactive-text="Off"
        @change="handleNotificationChange"
      />
    </div>
    
    <div class="setting-item">
      <span>Auto Save</span>
      <el-switch
        v-model="settings.autoSave"
        :loading="autoSaveLoading"
        @change="handleAutoSaveChange"
      />
    </div>
    
    <div class="setting-item">
      <span>Dark Mode</span>
      <el-switch
        v-model="settings.darkMode"
        inline-prompt
        active-text="D"
        inactive-text="L"
        @change="handleThemeChange"
      />
    </div>
    
    <div class="setting-item">
      <span>Maintenance Mode</span>
      <el-switch
        v-model="settings.maintenance"
        :disabled="!isAdmin"
        style="--el-switch-on-color: #ff4949"
        @change="handleMaintenanceChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const isAdmin = ref(true)
const autoSaveLoading = ref(false)

const settings = reactive({
  notification: true,
  autoSave: false,
  darkMode: false,
  maintenance: false
})

const handleNotificationChange = (value) => {
  ElMessage.success(`Notifications ${value ? 'enabled' : 'disabled'}`)
}

const handleAutoSaveChange = async (value) => {
  autoSaveLoading.value = true
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000))
  autoSaveLoading.value = false
  ElMessage.success(`Auto save ${value ? 'enabled' : 'disabled'}`)
}

const handleThemeChange = (value) => {
  document.documentElement.classList.toggle('dark', value)
  ElMessage.success(`Switched to ${value ? 'dark' : 'light'} mode`)
}

const handleMaintenanceChange = (value) => {
  if (value) {
    ElMessage.warning('System entered maintenance mode')
  } else {
    ElMessage.success('System exited maintenance mode')
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}
</style>
```

### Table Row Status Control

```vue
<template>
  <div>
    <h3>User Management</h3>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="email" label="Email" width="200" />
      <el-table-column label="Status" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.active"
            active-text="Active"
            inactive-text="Inactive"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="VIP" width="80">
        <template #default="{ row }">
          <el-switch
            v-model="row.vip"
            inline-prompt
            active-text="V"
            inactive-text="N"
            style="--el-switch-on-color: #f56c6c"
            @change="handleVipChange(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const users = reactive([
  { id: 1, name: 'John Doe', email: 'john@example.com', active: true, vip: false },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false, vip: true },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: true, vip: false }
])

const handleStatusChange = (user) => {
  ElMessage.success(`User ${user.name} ${user.active ? 'activated' : 'deactivated'}`)
}

const handleVipChange = (user) => {
  ElMessage.success(`User ${user.name} VIP status ${user.vip ? 'enabled' : 'disabled'}`)
}
</script>
```

## API Documentation

### Switch Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value, must be identical to either active-value or inactive-value, by default it's boolean | boolean / string / number | false |
| disabled | whether Switch is disabled | boolean | false |
| loading | whether Switch is in loading state | boolean | false |
| size | size of Switch | enum | — |
| width | width of Switch | number / string | — |
| inline-prompt | whether icon or text is displayed inside dot | boolean | false |
| active-icon | component of the icon displayed when in active state, overrides active-text | string / Component | — |
| inactive-icon | component of the icon displayed when in inactive state, overrides inactive-text | string / Component | — |
| active-text | text displayed when in active state | string | — |
| inactive-text | text displayed when in inactive state | string | — |
| active-value | switch value when in active state | boolean / string / number | true |
| inactive-value | switch value when in inactive state | boolean / string / number | false |
| name | input name of Switch | string | — |
| validate-event | whether to trigger form validation | boolean | true |
| before-change | before-change hook before the switch state changes. If false is returned or a Promise is returned and then is rejected, will stop switching | Function | — |
| id | id for input | string | — |
| tabindex | input tabindex | string / number | — |
| label | label for screen reader | string | — |

### Switch Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when value changes | Function |

### Switch Exposes

| Name | Description | Type |
|------|-------------|------|
| focus | focus the Switch component | Function |
| checked | whether Switch is checked | boolean |

## Practice Exercises

### Exercise 1: Permission Control Panel

Create a permission control panel with multiple feature switches:

```vue
<template>
  <div class="permission-panel">
    <h3>Permission Settings</h3>
    <div v-for="permission in permissions" :key="permission.key" class="permission-item">
      <div class="permission-info">
        <span class="permission-name">{{ permission.name }}</span>
        <span class="permission-desc">{{ permission.description }}</span>
      </div>
      <el-switch
        v-model="permission.enabled"
        :disabled="permission.required"
        @change="handlePermissionChange(permission)"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const permissions = reactive([
  {
    key: 'read',
    name: 'View Permission',
    description: 'Allow viewing system data',
    enabled: true,
    required: true
  },
  {
    key: 'write',
    name: 'Edit Permission',
    description: 'Allow editing system data',
    enabled: false,
    required: false
  },
  {
    key: 'delete',
    name: 'Delete Permission',
    description: 'Allow deleting system data',
    enabled: false,
    required: false
  }
])

const handlePermissionChange = (permission) => {
  ElMessage.success(`${permission.name} ${permission.enabled ? 'enabled' : 'disabled'}`)
}
</script>
```

### Exercise 2: Theme Switcher

Create a theme switcher component:

```vue
<template>
  <div class="theme-switcher">
    <el-switch
      v-model="isDark"
      inline-prompt
      :active-icon="Moon"
      :inactive-icon="Sunny"
      @change="toggleTheme"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = ref(false)

const toggleTheme = (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('theme', value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  toggleTheme(isDark.value)
})
</script>
```

## Common Issues

### 1. Switch State Not Updating

**Issue**: Switch state is not correctly bound or updated

**Solution**:
```vue
<!-- Ensure correct use of v-model -->
<el-switch v-model="switchValue" />

<!-- If using custom values, ensure type matching -->
<el-switch
  v-model="customValue"
  active-value="on"
  inactive-value="off"
/>
```

### 2. Handling Asynchronous Operations

**Issue**: Need to perform async operations when switch is toggled

**Solution**:
```vue
<template>
  <el-switch
    v-model="switchValue"
    :loading="loading"
    :before-change="beforeChange"
  />
</template>

<script setup>
const beforeChange = async () => {
  loading.value = true
  try {
    await api.updateStatus()
    return true
  } catch (error) {
    ElMessage.error('Operation failed')
    return false
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. Custom Styling

**Issue**: Need to customize switch colors and styles

**Solution**:
```vue
<el-switch
  v-model="value"
  style="
    --el-switch-on-color: #13ce66;
    --el-switch-off-color: #ff4949;
  "
/>
```

## Best Practices

1. **Semantic Labels**: Provide meaningful labels and descriptions for switches
2. **State Feedback**: Provide appropriate user feedback when state changes
3. **Async Handling**: Properly use loading states and before-change hooks
4. **Accessibility**: Ensure keyboard navigation and screen reader support
5. **Consistency**: Maintain consistent switch styles throughout the application
6. **Prevent Mistakes**: Use confirmation mechanisms for important operations

## Summary

The Switch component is a simple yet powerful component that supports:

- Basic switch functionality
- Multiple states (disabled, loading)
- Text and icon customization
- Extended value types
- Size control
- Rich event handling
- Good accessibility support

Mastering the use of the Switch component can help you build more intuitive and user-friendly interface controls.

## References

- [Element Plus Switch Official Documentation](https://element-plus.org/en-US/component/switch.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)