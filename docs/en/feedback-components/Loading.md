# Loading Component

## Learning Objectives

Through this chapter, you will master:
- **Basic Loading Functionality**: Master the basic usage methods and directive forms of Loading
- **Area Loading Mask**: Learn to display loading states in specific areas
- **Fullscreen Loading State**: Implement fullscreen loading masks and state management
- **Custom Loading Icons**: Customize loading icons and animation effects
- **Loading Text Prompts**: Add appropriate loading prompt text
- **Loading State Management**: Manage loading states in complex scenarios
- **Loading Performance Optimization**: Optimize the performance of loading components
- **Loading Accessibility**: Implement loading experiences that meet accessibility standards
- **Custom Loading Animations**: Create custom loading animation effects

**Estimated Learning Time:** 105 minutes

## Overview

The Loading component is used to display loading states during data loading or asynchronous operations, providing visual feedback to users and enhancing user experience. Element Plus provides two ways to invoke Loading: directive and service.

### Main Features

- **Dual Invocation Methods**: Supports both directive (v-loading) and service (ElLoading.service) invocation methods
- **Flexible Coverage Range**: Supports both area loading and fullscreen loading modes
- **Highly Customizable**: Supports custom loading text, icons, background colors, etc.
- **Singleton Pattern**: Fullscreen loading uses singleton pattern to avoid duplicate creation
- **Safe and Reliable**: Provides secure custom icon mechanisms
- **Context Inheritance**: Supports inheritance of application context
- **Responsive Design**: Adapts to different screen sizes and devices
- **Accessibility**: Supports screen readers and keyboard navigation

### Use Cases

- **Data Loading**: Asynchronous loading of table data, list content
- **Form Submission**: Status feedback during form data submission
- **File Operations**: Progress display during file upload and download
- **Page Switching**: Loading states during route jumping and page initialization
- **API Requests**: Waiting state display during network requests
- **Complex Calculations**: Progress feedback for frontend computation-intensive operations
- **Resource Loading**: Loading states for images, videos, and other media resources
- **Batch Operations**: Progress indication for batch data processing

## Basic Usage

### Area Loading

Display loading animation when needed to prevent page from becoming unresponsive and improve user experience (e.g., tables).

For the custom directive v-loading, you only need to bind a Boolean value.

By default, the Loading mask is inserted as a child node of the bound element. By adding the body modifier, the mask can be inserted into the body of the DOM.

```vue
<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518, Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518, Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518, Jinshajiang Road, Putuo District',
  },
]

setTimeout(() => {
  loading.value = false
}, 2000)
</script>
```

### Customizing Loading Content

You can customize the text, icon, and background color of the loading component.

Add the element-loading-text attribute to the element bound with the v-loading directive, and its value will be rendered as loading text and displayed below the loading icon.

Similarly, the element-loading-spinner, element-loading-background, and element-loading-svg attributes are used to set the svg icon, background color value, and loading icon respectively.

```vue
<template>
  <el-table
    v-loading="loading"
    element-loading-text="Loading with great effort"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :data="tableData"
    style="width: 100%"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const loading = ref(true)

const tableData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518, Jinshajiang Road, Putuo District',
  },
]
</script>
```

**Security Warning**: Although the element-loading-spinner / element-loading-svg attributes support passing HTML fragments, dynamically rendering arbitrary HTML on a website is very dangerous as it can easily lead to XSS attacks.

Please ensure that the content of element-loading-spinner / element-loading-svg is trustworthy, and do not assign user-submitted content to the element-loading-spinner / element-loading-svg attributes.

### Fullscreen Loading

Display fullscreen animation when loading data.

When using the directive method, fullscreen mask requires adding the fullscreen modifier (the mask will be inserted into the body). If you need to lock the screen scrolling, you can use the lock modifier.

When using the service method, the mask is fullscreen by default and requires no additional settings.

```vue
<template>
  <el-button
    type="primary"
    @click="openFullScreen1"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    Directive Method
  </el-button>
  <el-button type="primary" @click="openFullScreen2">
    Service Method
  </el-button>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ElLoading } from 'element-plus'

const fullscreenLoading = ref(false)

const openFullScreen1 = () => {
  fullscreenLoading.value = true
  setTimeout(() => {
    fullscreenLoading.value = false
  }, 2000)
}

const openFullScreen2 = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 2000)
}
</script>
```

### Service Invocation

Loading can also be invoked as a service.

You can import the Loading service like this:

```typescript
import { ElLoading } from 'element-plus'
```

Invoke it when needed:

```typescript
ElLoading.service(options)
```

LoadingService returns a Loading instance, which can be closed by calling the close method of the instance:

```typescript
const loadingInstance = ElLoading.service(options)
nextTick(() => {
  // Loading should be closed asynchronously
  loadingInstance.close()
})
```

Note that fullscreen Loading invoked as a service is singleton.

If you call fullscreen Loading again before the previous fullscreen Loading is closed, it will not create a new Loading instance, but return the existing fullscreen Loading instance:

```typescript
const loadingInstance1 = ElLoading.service({ fullscreen: true })
const loadingInstance2 = ElLoading.service({ fullscreen: true })
console.log(loadingInstance1 === loadingInstance2) // true
```

If Element Plus is fully imported, there will be a global method $loading on app.config.globalProperties, which can be called as: this.$loading(options), and will also return a Loading instance.

### Application Context

Now Loading accepts a context as the second parameter of the message constructor, allowing you to inject the current application's context into Loading, which will allow you to inherit all properties of the application.

You can use it like this:

```typescript
import { getCurrentInstance } from 'vue'
import { ElLoading } from 'element-plus'

// in your setup method
const { appContext } = getCurrentInstance()!
ElLoading.service({}, appContext)
```

If you have globally registered the ELLoading component, it will automatically inherit the application's context environment.

## Practical Application Examples

### Data Table Loading Management

A complete data table loading management example, including search, pagination, and other functions:

```vue
<template>
  <div class="table-loading-demo">
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="Enter search keyword"
        style="width: 300px; margin-right: 12px"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch" :loading="searchLoading">
        Search
      </el-button>
      <el-button @click="handleRefresh" :loading="refreshLoading">
        Refresh
      </el-button>
    </div>

    <el-table
      v-loading="tableLoading"
      element-loading-text="Loading data..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData"
      style="width: 100%; margin-top: 20px"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="email" label="Email" width="200" />
      <el-table-column prop="department" label="Department" width="150" />
      <el-table-column prop="position" label="Position" width="150" />
      <el-table-column prop="createTime" label="Create Time" width="180" sortable="custom" />
      <el-table-column label="Actions" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)" :loading="editingIds.includes(row.id)">
            Edit
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)" :loading="deletingIds.includes(row.id)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; text-align: right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const tableLoading = ref(false)
const searchLoading = ref(false)
const refreshLoading = ref(false)
const editingIds = ref([])
const deletingIds = ref([])

// Mock data
const mockData = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `User${index + 1}`,
  email: `user${index + 1}@example.com`,
  department: ['Tech', 'Product', 'Operations', 'Marketing'][index % 4],
  position: ['Engineer', 'Product Manager', 'Operations Specialist', 'Marketing Specialist'][index % 4],
  createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}))

const loadTableData = async (showLoading = true) => {
  if (showLoading) {
    tableLoading.value = true
  }
  
  try {
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    // Simulate search and pagination
    let filteredData = mockData
    if (searchKeyword.value) {
      filteredData = mockData.filter(item => 
        item.name.includes(searchKeyword.value) || 
        item.email.includes(searchKeyword.value)
      )
    }
    
    total.value = filteredData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    tableLoading.value = false
    searchLoading.value = false
    refreshLoading.value = false
  }
}

const handleSearch = () => {
  searchLoading.value = true
  currentPage.value = 1
  loadTableData(false)
}

const handleRefresh = () => {
  refreshLoading.value = true
  searchKeyword.value = ''
  currentPage.value = 1
  loadTableData(false)
}

const handleSizeChange = () => {
  currentPage.value = 1
  loadTableData()
}

const handleCurrentChange = () => {
  loadTableData()
}

const handleSortChange = ({ prop, order }) => {
  // Simulate sorting
  loadTableData()
}

const handleEdit = async (row) => {
  editingIds.value.push(row.id)
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Edit successful')
  } catch (error) {
    ElMessage.error('Edit failed')
  } finally {
    editingIds.value = editingIds.value.filter(id => id !== row.id)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('Confirm to delete this user?', 'Warning', {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })
    
    deletingIds.value.push(row.id)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('Delete successful')
    loadTableData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
    }
  } finally {
    deletingIds.value = deletingIds.value.filter(id => id !== row.id)
  }
}

onMounted(() => {
  loadTableData()
})
</script>

<style scoped>
.table-loading-demo {
  padding: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
}
</style>
```

## API Reference

### Options (Service Method)

| Name | Description | Type | Default |
|------|-------------|------|----------|
| target | The DOM node that Loading needs to cover. Can pass a DOM object or string; if a string is passed, it will be used as a parameter for document.querySelector to get the corresponding DOM node | string / HTMLElement | document.body |
| body | Same as the body modifier in v-loading directive | boolean | false |
| fullscreen | Same as the fullscreen modifier in v-loading directive | boolean | true |
| lock | Same as the lock modifier in v-loading directive | boolean | false |
| text | Loading text displayed below the loading icon | string | — |
| spinner | Custom loading icon class name | string | — |
| background | Mask background color | string | — |
| customClass | Custom class name for Loading | string | — |
| svg | Custom SVG element to override default loader | string | — |
| svgViewBox | Set the viewBox attribute for loading svg element | string | — |
| beforeClose | Function executed before Loading closes. If this function returns false, the closing process will be aborted. Otherwise, loading will be closed. | Function | — |
| closed | Function triggered after Loading is completely closed | Function | — |

### Directive

| Name | Description | Type |
|------|-------------|------|
| v-loading | Whether to show animation | boolean / LoadingOptions |
| element-loading-text | Loading text displayed below the loading icon | string |
| element-loading-spinner | Custom loading icon | string |
| element-loading-svg | Custom loading icon (same as element-loading-spinner) | string |
| element-loading-background | Set mask layer background color | string |

## Best Practices

### Design Principles

1. **Reasonable Loading Method Selection**: Area loading is suitable for tables, lists, and other local content; fullscreen loading is suitable for page-level operations
2. **Custom Loading Content**: Customize loading text and icons according to business scenarios to enhance user experience
3. **Safe Use of Custom Icons**: Ensure that the content of element-loading-spinner / element-loading-svg is trustworthy
4. **Singleton Feature of Service Method**: Understand the singleton feature of fullscreen Loading to avoid duplicate creation
5. **Asynchronous Closing**: When using the service method, close the Loading instance in nextTick
6. **Lock Scrolling**: Use the lock modifier to lock page scrolling during fullscreen loading

### User Experience

1. **Loading States**: Show loading indicators during operations
2. **Error Handling**: Provide clear error messages and recovery options
3. **Data Persistence**: Preserve user input when appropriate
4. **Confirmation**: Ask for confirmation before destructive actions

### Performance Optimization

1. **Lazy Loading**: Use destroy-on-close for heavy content
2. **Event Cleanup**: Clean up event listeners when loading closes
3. **Memory Management**: Avoid memory leaks in nested loading
4. **Animation Performance**: Use CSS transforms for smooth animations

## Summary

The Loading component is a powerful tool for displaying loading states during asynchronous operations in web applications. By understanding its various features and following best practices, you can create user-friendly loading experiences that enhance your application's usability and provide clear feedback to users during waiting periods.