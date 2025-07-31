# Select Component

## Overview

The Select component is a dropdown selection component used to choose from multiple options. It supports single selection, multiple selection, search, remote search, grouping, and many other features, making it one of the most commonly used components in forms.

## Learning Objectives

- Master the basic concepts and use cases of Select
- Learn how to use basic selectors
- Understand the difference between single and multiple selection modes
- Master state control and event handling of selectors
- Learn to use option grouping and custom templates
- Understand remote search and large data handling
- Master the complete usage of the API

## Basic Usage

### Basic Selector

The simplest selector usage:

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' }
]
</script>
```

### Disabled State

Disable the selector or options using the `disabled` attribute:

```vue
<template>
  <div>
    <h4>Disabled Selector</h4>
    <el-select v-model="value1" disabled placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>Disabled Options</h4>
    <el-select v-model="value2" placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2', disabled: true },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4', disabled: true }
]
</script>
```

### Clearable

Enable clear functionality using the `clearable` attribute:

```vue
<template>
  <div>
    <el-select v-model="value" clearable placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' }
]
</script>
```

## Multiple Selection Mode

### Basic Multiple Selection

Enable multiple selection mode using the `multiple` attribute:

```vue
<template>
  <div>
    <el-select
      v-model="value"
      multiple
      placeholder="Please select"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>Selected values: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' }
]
</script>
```

### Collapsed Tags

Use `collapse-tags` and `collapse-tags-tooltip` to collapse multiple selection tags:

```vue
<template>
  <div>
    <h4>Collapsed Tags</h4>
    <el-select
      v-model="value1"
      multiple
      collapse-tags
      placeholder="Please select"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>Collapsed Tags + Tooltip</h4>
    <el-select
      v-model="value2"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="Please select"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(['option1', 'option2', 'option3'])
const value2 = ref(['option1', 'option2', 'option3', 'option4'])
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' }
]
</script>
```

## Searchable

### Local Search

Enable search functionality using the `filterable` attribute:

```vue
<template>
  <div>
    <el-select
      v-model="value"
      filterable
      placeholder="Please select or search"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'beijing', label: 'Beijing' },
  { value: 'shanghai', label: 'Shanghai' },
  { value: 'guangzhou', label: 'Guangzhou' },
  { value: 'shenzhen', label: 'Shenzhen' },
  { value: 'hangzhou', label: 'Hangzhou' },
  { value: 'nanjing', label: 'Nanjing' },
  { value: 'chengdu', label: 'Chengdu' },
  { value: 'wuhan', label: 'Wuhan' }
]
</script>
```

### Remote Search

Implement remote search using `remote` and `remote-method`:

```vue
<template>
  <div>
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="Please enter keyword"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const value = ref('')
const options = ref([])
const loading = ref(false)

const list = [
  { value: 'Alabama', label: 'Alabama' },
  { value: 'Alaska', label: 'Alaska' },
  { value: 'Arizona', label: 'Arizona' },
  { value: 'Arkansas', label: 'Arkansas' },
  { value: 'California', label: 'California' },
  { value: 'Colorado', label: 'Colorado' },
  { value: 'Connecticut', label: 'Connecticut' },
  { value: 'Delaware', label: 'Delaware' },
  { value: 'Florida', label: 'Florida' },
  { value: 'Georgia', label: 'Georgia' }
]

const remoteMethod = (query) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      options.value = list.filter(item => {
        return item.label.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    options.value = []
  }
}

onMounted(() => {
  options.value = list
})
</script>
```

## Option Grouping

Use `el-option-group` to group options:

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="Please select">
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-option-group>
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  {
    label: 'Popular Cities',
    options: [
      { value: 'beijing', label: 'Beijing' },
      { value: 'shanghai', label: 'Shanghai' },
      { value: 'guangzhou', label: 'Guangzhou' },
      { value: 'shenzhen', label: 'Shenzhen' }
    ]
  },
  {
    label: 'Other Cities',
    options: [
      { value: 'hangzhou', label: 'Hangzhou' },
      { value: 'nanjing', label: 'Nanjing' },
      { value: 'chengdu', label: 'Chengdu' },
      { value: 'wuhan', label: 'Wuhan' }
    ]
  }
]
</script>
```

## Custom Templates

### Custom Option Content

Use slots to customize option display content:

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="Please select">
      <el-option
        v-for="item in cities"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">
          {{ item.desc }}
        </span>
      </el-option>
    </el-select>
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const cities = [
  {
    value: 'beijing',
    label: 'Beijing',
    desc: 'Capital of China'
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    desc: 'Magic City'
  },
  {
    value: 'guangzhou',
    label: 'Guangzhou',
    desc: 'Flower City'
  },
  {
    value: 'shenzhen',
    label: 'Shenzhen',
    desc: 'Tech City'
  }
]
</script>
```

### Custom Prefix and Suffix

Use `prefix` and `suffix` slots:

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="Please select">
      <template #prefix>
        <el-icon><Location /></el-icon>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Location } from '@element-plus/icons-vue'

const value = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]
</script>
```

## Sizes

Use the `size` attribute to set the selector size:

```vue
<template>
  <div>
    <h4>Large Size</h4>
    <el-select v-model="value1" size="large" placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>Default Size</h4>
    <el-select v-model="value2" placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>Small Size</h4>
    <el-select v-model="value3" size="small" placeholder="Please select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
]
</script>
```

## Practical Application Examples

### User Information Selector

```vue
<template>
  <div class="user-selector">
    <h3>User Selector</h3>
    
    <div class="selector-group">
      <div class="selector-item">
        <label>Select User:</label>
        <el-select
          v-model="selectedUser"
          filterable
          remote
          reserve-keyword
          placeholder="Enter username to search"
          :remote-method="searchUsers"
          :loading="loading"
          @change="handleUserChange"
        >
          <el-option
            v-for="user in users"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          >
            <div class="user-option">
              <img :src="user.avatar" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
      
      <div class="selector-item">
        <label>Select Department:</label>
        <el-select
          v-model="selectedDepartment"
          placeholder="Please select department"
          @change="handleDepartmentChange"
        >
          <el-option-group
            v-for="group in departments"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="dept in group.departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-option-group>
        </el-select>
      </div>
      
      <div class="selector-item">
        <label>Select Roles:</label>
        <el-select
          v-model="selectedRoles"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="Please select roles"
        >
          <el-option
            v-for="role in roles"
            :key="role.id"
            :label="role.name"
            :value="role.id"
            :disabled="role.disabled"
          >
            <span>{{ role.name }}</span>
            <span class="role-desc">{{ role.description }}</span>
          </el-option>
        </el-select>
      </div>
    </div>
    
    <div class="selection-summary">
      <h4>Selection Results</h4>
      <p>User: {{ getUserName(selectedUser) }}</p>
      <p>Department: {{ getDepartmentName(selectedDepartment) }}</p>
      <p>Roles: {{ getRoleNames(selectedRoles) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const selectedUser = ref('')
const selectedDepartment = ref('')
const selectedRoles = ref([])
const loading = ref(false)
const users = ref([])

const allUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
]

const departments = [
  {
    label: 'Technical Departments',
    departments: [
      { id: 1, name: 'Frontend Development' },
      { id: 2, name: 'Backend Development' },
      { id: 3, name: 'QA Testing' }
    ]
  },
  {
    label: 'Business Departments',
    departments: [
      { id: 4, name: 'Product Management' },
      { id: 5, name: 'Operations' },
      { id: 6, name: 'Sales' }
    ]
  }
]

const roles = [
  { id: 1, name: 'Administrator', description: 'System admin privileges' },
  { id: 2, name: 'Developer', description: 'Development privileges' },
  { id: 3, name: 'Tester', description: 'Testing privileges' },
  { id: 4, name: 'Guest', description: 'Read-only privileges', disabled: true }
]

const searchUsers = (query) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      users.value = allUsers.filter(user => {
        return user.name.toLowerCase().includes(query.toLowerCase()) ||
               user.email.toLowerCase().includes(query.toLowerCase())
      })
    }, 200)
  } else {
    users.value = allUsers
  }
}

const handleUserChange = (value) => {
  ElMessage.success(`Selected user: ${getUserName(value)}`)
}

const handleDepartmentChange = (value) => {
  ElMessage.success(`Selected department: ${getDepartmentName(value)}`)
}

const getUserName = (userId) => {
  const user = allUsers.find(u => u.id === userId)
  return user ? user.name : 'Not selected'
}

const getDepartmentName = (deptId) => {
  for (const group of departments) {
    const dept = group.departments.find(d => d.id === deptId)
    if (dept) return dept.name
  }
  return 'Not selected'
}

const getRoleNames = (roleIds) => {
  if (!roleIds.length) return 'Not selected'
  return roleIds.map(id => {
    const role = roles.find(r => r.id === id)
    return role ? role.name : ''
  }).filter(Boolean).join(', ')
}

// Initialize user list
users.value = allUsers
</script>

<style scoped>
.user-selector {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selector-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-item label {
  width: 100px;
  font-weight: 500;
}

.selector-item .el-select {
  flex: 1;
  max-width: 300px;
}

.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.user-email {
  font-size: 12px;
  color: #909399;
}

.role-desc {
  float: right;
  color: #8492a6;
  font-size: 12px;
}

.selection-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.selection-summary h4 {
  margin-bottom: 12px;
  color: #303133;
}

.selection-summary p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

## API Reference

### Select Attributes

| Name | Description | Type | Default |
|------|-------------|------|----------|
| model-value / v-model | Binding value | string / number / boolean / object / array | — |
| multiple | Whether multiple-select is activated | boolean | false |
| disabled | Whether Select is disabled | boolean | false |
| value-key | Unique identity key name for value, required when value is an object | string | value |
| size | Size of Input | enum | — |
| clearable | Whether select can be cleared | boolean | false |
| collapse-tags | Whether to collapse tags to a text when multiple selecting | boolean | false |
| collapse-tags-tooltip | Whether show all selected tags in tooltip when mouse hover collapsed tags | boolean | false |
| multiple-limit | Maximum number of options user can select when multiple is true. No limit when set to 0 | number | 0 |
| name | The name attribute of select input | string | — |
| effect | Tooltip theme, built-in theme: dark / light | enum | light |
| autocomplete | The autocomplete attribute of select input | string | off |
| placeholder | Placeholder | string | Please select |
| filterable | Whether Select is filterable | boolean | false |
| allow-create | Whether creating new items is allowed. To use this, filterable must be true | boolean | false |
| filter-method | Custom filter method | function | — |
| remote | Whether options are loaded from server | boolean | false |
| remote-method | Custom remote search method | function | — |
| remote-show-suffix | Whether to show suffix icon in remote search | boolean | false |
| loading | Whether Select is loading data from server | boolean | false |
| loading-text | Displayed text while loading data from server | string | Loading |
| no-match-text | Displayed text when no data matches the filtering query | string | No matching data |
| no-data-text | Displayed text when there is no options | string | No data |
| popper-class | Custom class name for Select's dropdown | string | — |
| reserve-keyword | When multiple and filterable is true, whether to reserve current keyword after selecting an option | boolean | true |
| default-first-option | Select first matching option on enter key. Use with filterable or remote | boolean | false |
| teleported | Whether select dropdown is teleported to the body | boolean | true |
| persistent | When select dropdown is inactive and persistent is false, select dropdown will be destroyed | boolean | true |
| automatic-dropdown | For non-filterable Select, this prop decides if the option menu pops up when the input is focused | boolean | false |
| clear-icon | Custom clear icon component | string / Component | CircleClose |
| fit-input-width | Whether the width of the dropdown is the same as the input | boolean | false |
| suffix-icon | Custom suffix icon component | string / Component | ArrowDown |
| tag-type | Tag type | enum | info |
| validate-event | Whether to trigger form validation | boolean | true |
| placement | Position of dropdown | enum | bottom-start |

### Select Events

| Name | Description | Type |
|------|-------------|------|
| change | Triggers when the selected value changes | Function |
| visible-change | Triggers when the dropdown appears/disappears | Function |
| remove-tag | Triggers when a tag is removed in multiple mode | Function |
| clear | Triggers when the clear icon is clicked in a clearable Select | Function |
| blur | Triggers when Input blurs | Function |
| focus | Triggers when Input focuses | Function |

### Select Slots

| Name | Description | Subtags |
|------|-------------|----------|
| default | Option component list | Option / OptionGroup |
| header | Content at the top of the dropdown list | — |
| footer | Content at the bottom of the dropdown list | — |
| prefix | Content as Select prefix | — |
| empty | Content when there are no options | — |
| tag | Content of custom tags, only works when multiple is true | — |
| loading | Content of custom loading | — |

### Option Attributes

| Name | Description | Type | Default |
|------|-------------|------|----------|
| value | Value of option | string / number / boolean / object | — |
| label | Label of option, same as value if omitted | string / number | — |
| disabled | Whether option is disabled | boolean | false |

### OptionGroup Attributes

| Name | Description | Type | Default |
|------|-------------|------|----------|
| label | Name of the group | string | — |
| disabled | Whether to disable all options in this group | boolean | false |

## Best Practices

1. **Performance Optimization**: Use virtual scrolling or pagination for large datasets
2. **User Experience**: Provide appropriate placeholders and loading states
3. **Data Validation**: Ensure data integrity and consistency of options
4. **Accessibility**: Provide keyboard navigation and screen reader support
5. **Responsive Design**: Maintain good display across different screen sizes
6. **Error Handling**: Handle network errors and data loading failures gracefully

## Summary

The Select component is a powerful form component that supports:

- Single and multiple selection modes
- Local and remote search
- Option grouping and custom templates
- Multiple sizes and states
- Rich configuration options
- Good accessibility support

Mastering the Select component will help you build more flexible and user-friendly form interfaces.

## References

- [Element Plus Select Official Documentation](https://element-plus.org/en-US/component/select.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)