# Pagination Component

## Overview

The Pagination component is used to display data in pages when dealing with large amounts of data, providing page navigation functionality. It's an essential component for data display that effectively improves user experience and page performance.

## Learning Objectives

Through this documentation, you will master:

1. Basic usage of the Pagination component
2. Different pagination layouts and styles
3. Pagination event handling
4. Integration with table components
5. Pagination performance optimization
6. Practical application scenarios

## Basic Usage

### Basic Pagination
The simplest pagination component:

```vue
<template>
  <div>
    <p>Current page: {{ currentPage }}, Per page: {{ pageSize }}, Total: {{ total }}</p>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
</script>
```

### Full-featured Pagination
Pagination component with all features:

```vue
<template>
  <div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(1000)

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  ElMessage.info(`Showing ${val} items per page`)
  // Reload data
  loadData()
}

const handleCurrentChange = (val) => {
  console.log(`Current page: ${val}`)
  ElMessage.info(`Navigated to page ${val}`)
  // Reload data
  loadData()
}

const loadData = () => {
  console.log('Loading data...', {
    page: currentPage.value,
    size: pageSize.value
  })
}
</script>
```

### Small Pagination
Suitable for scenarios with limited space:

```vue
<template>
  <div>
    <h4>Small Pagination</h4>
    <el-pagination
      small
      v-model:current-page="currentPage"
      :total="total"
      layout="prev, pager, next"
    />
    
    <h4>Pagination with Background</h4>
    <el-pagination
      background
      v-model:current-page="currentPage"
      :total="total"
      layout="prev, pager, next"
    />
    
    <h4>Small Pagination with Background</h4>
    <el-pagination
      small
      background
      v-model:current-page="currentPage"
      :total="total"
      layout="prev, pager, next"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const total = ref(50)
</script>

<style scoped>
h4 {
  margin: 20px 0 10px 0;
  color: #303133;
}
</style>
```

## Pagination Layout

### Custom Layout
Customize the pagination component layout using the `layout` property:

```vue
<template>
  <div class="pagination-layouts">
    <div class="layout-item">
      <h4>Basic Layout</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>With Total</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>With Page Size Selector</h4>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>With Jumper</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="prev, pager, next, jumper"
      />
    </div>
    
    <div class="layout-item">
      <h4>Complete Layout</h4>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
    
    <div class="layout-item">
      <h4>Custom Layout Order</h4>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="jumper, prev, pager, next, sizes, total"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(400)
</script>

<style scoped>
.pagination-layouts {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.layout-item {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.layout-item h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 14px;
}
</style>
```

### Responsive Pagination
Adjust pagination layout based on screen size:

```vue
<template>
  <div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      :layout="paginationLayout"
      :small="isMobile"
      background
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(1000)
const screenWidth = ref(window.innerWidth)

const isMobile = computed(() => screenWidth.value < 768)

const paginationLayout = computed(() => {
  if (screenWidth.value < 480) {
    // Mobile: show only basic navigation
    return 'prev, pager, next'
  } else if (screenWidth.value < 768) {
    // Tablet: show total and basic navigation
    return 'total, prev, pager, next'
  } else {
    // Desktop: show full features
    return 'total, sizes, prev, pager, next, jumper'
  }
})

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## Integration with Table

### Table Pagination Example
Complete table pagination functionality:

```vue
<template>
  <div class="table-pagination">
    <!-- Search and action area -->
    <div class="table-header">
      <el-input
        v-model="searchKeyword"
        placeholder="Search username or email"
        style="width: 300px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <div class="header-actions">
        <el-button type="primary" @click="addUser">Add User</el-button>
        <el-button @click="refreshData">Refresh</el-button>
      </div>
    </div>
    
    <!-- Table -->
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="email" label="Email" width="200" />
      <el-table-column prop="department" label="Department" width="120" />
      <el-table-column prop="position" label="Position" width="150" />
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'Active' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="Created At" width="150" />
      <el-table-column label="Actions" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="editUser(row)">Edit</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Pagination -->
    <div class="pagination-wrapper">
      <div class="pagination-info">
        <span>{{ selectedRows.length }} items selected</span>
        <el-button 
          v-if="selectedRows.length > 0" 
          size="small" 
          type="danger" 
          @click="batchDelete"
        >
          Batch Delete
        </el-button>
      </div>
      
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { debounce } from 'lodash-es'

const loading = ref(false)
const searchKeyword = ref('')
const selectedRows = ref([])
const tableData = ref([])

const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// Mock data generation
const generateUsers = (page, size, keyword = '') => {
  const allUsers = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `User${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: ['Engineering', 'Marketing', 'HR', 'Finance'][index % 4],
    position: ['Developer', 'Manager', 'Director', 'Specialist'][index % 4],
    status: index % 5 === 0 ? 'Inactive' : 'Active',
    createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }))
  
  // Search filter
  let filteredUsers = allUsers
  if (keyword) {
    filteredUsers = allUsers.filter(user => 
      user.name.includes(keyword) || user.email.includes(keyword)
    )
  }
  
  // Pagination
  const start = (page - 1) * size
  const end = start + size
  
  return {
    data: filteredUsers.slice(start, end),
    total: filteredUsers.length
  }
}

// Load data
const loadData = async () => {
  loading.value = true
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = generateUsers(
      pagination.currentPage, 
      pagination.pageSize, 
      searchKeyword.value
    )
    
    tableData.value = result.data
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// Debounced search
const handleSearch = debounce(() => {
  pagination.currentPage = 1
  loadData()
}, 300)

// Pagination event handlers
const handleSizeChange = () => {
  pagination.currentPage = 1
  loadData()
}

const handleCurrentChange = () => {
  loadData()
}

// Table selection
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// Action methods
const addUser = () => {
  ElMessage.info('Add user functionality')
}

const editUser = (user) => {
  ElMessage.info(`Edit user: ${user.name}`)
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user "${user.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    ElMessage.success('Deleted successfully')
    loadData()
  } catch {
    ElMessage.info('Delete cancelled')
  }
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedRows.value.length} selected users?`,
      'Batch Delete',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    ElMessage.success(`Deleted ${selectedRows.value.length} users`)
    selectedRows.value = []
    loadData()
  } catch {
    ElMessage.info('Delete cancelled')
  }
}

const refreshData = () => {
  searchKeyword.value = ''
  pagination.currentPage = 1
  loadData()
}

// Watch for search keyword changes
watch(searchKeyword, () => {
  if (!searchKeyword.value) {
    pagination.currentPage = 1
    loadData()
  }
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.table-pagination {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 0;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .pagination-info {
    justify-content: center;
  }
}
</style>
```

## Advanced Features

### Custom Paginator
Create a custom pagination component:

```vue
<template>
  <div class="custom-pagination">
    <div class="pagination-info">
      <span>Showing {{ startIndex }} to {{ endIndex }} of {{ total }} items</span>
    </div>
    
    <div class="pagination-controls">
      <!-- First page -->
      <el-button 
        :disabled="currentPage === 1" 
        @click="goToPage(1)"
        size="small"
      >
        First
      </el-button>
      
      <!-- Previous page -->
      <el-button 
        :disabled="currentPage === 1" 
        @click="goToPage(currentPage - 1)"
        size="small"
      >
        Previous
      </el-button>
      
      <!-- Page numbers -->
      <div class="page-numbers">
        <el-button
          v-for="page in visiblePages"
          :key="page"
          :type="page === currentPage ? 'primary' : 'default'"
          @click="goToPage(page)"
          size="small"
          class="page-btn"
        >
          {{ page }}
        </el-button>
      </div>
      
      <!-- Next page -->
      <el-button 
        :disabled="currentPage === totalPages" 
        @click="goToPage(currentPage + 1)"
        size="small"
      >
        Next
      </el-button>
      
      <!-- Last page -->
      <el-button 
        :disabled="currentPage === totalPages" 
        @click="goToPage(totalPages)"
        size="small"
      >
        Last
      </el-button>
    </div>
    
    <div class="pagination-jumper">
      <span>Go to</span>
      <el-input
        v-model="jumpPage"
        size="small"
        style="width: 60px; margin: 0 5px"
        @keyup.enter="handleJump"
      />
      <span>page</span>
      <el-button size="small" @click="handleJump">Go</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

const emit = defineEmits(['update:currentPage', 'change'])

const jumpPage = ref('')

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

const startIndex = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const endIndex = computed(() => {
  const end = props.currentPage * props.pageSize
  return end > props.total ? props.total : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = props.maxVisiblePages
  const current = props.currentPage
  const total = totalPages.value
  
  if (total <= maxVisible) {
    // Total pages less than or equal to max visible pages, show all page numbers
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Total pages greater than max visible pages, calculate display range
    const half = Math.floor(maxVisible / 2)
    let start = current - half
    let end = current + half
    
    if (start < 1) {
      start = 1
      end = maxVisible
    }
    
    if (end > total) {
      end = total
      start = total - maxVisible + 1
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) {
    return
  }
  
  emit('update:currentPage', page)
  emit('change', page)
}

const handleJump = () => {
  const page = parseInt(jumpPage.value)
  
  if (isNaN(page)) {
    ElMessage.warning('Please enter a valid page number')
    return
  }
  
  if (page < 1 || page > totalPages.value) {
    ElMessage.warning(`Page range: 1 - ${totalPages.value}`)
    return
  }
  
  goToPage(page)
  jumpPage.value = ''
}

watch(() => props.currentPage, (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) {
    goToPage(1)
  }
})
</script>

<style scoped>
.custom-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
}

.pagination-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-numbers {
  display: flex;
  gap: 2px;
  margin: 0 10px;
}

.page-btn {
  min-width: 32px;
}

.pagination-jumper {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .custom-pagination {
    flex-direction: column;
    gap: 15px;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
```

### Infinite Scroll Pagination
Implement infinite scroll pagination effect:

```vue
<template>
  <div class="infinite-scroll-container" ref="scrollContainer">
    <div class="data-list">
      <div 
        v-for="item in dataList" 
        :key="item.id" 
        class="data-item"
      >
        <div class="item-header">
          <h4>{{ item.title }}</h4>
          <span class="item-time">{{ item.createTime }}</span>
        </div>
        <p class="item-content">{{ item.content }}</p>
        <div class="item-footer">
          <el-tag size="small">{{ item.category }}</el-tag>
          <span class="item-author">Author: {{ item.author }}</span>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>Loading...</span>
    </div>
    
    <!-- No more data -->
    <div v-if="!hasMore && dataList.length > 0" class="no-more">
      <span>No more data</span>
    </div>
    
    <!-- Empty state -->
    <div v-if="!loading && dataList.length === 0" class="empty-state">
      <el-empty description="No data available" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const scrollContainer = ref()
const dataList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 20

// Generate mock data
const generateData = (page, size) => {
  const categories = ['Technology', 'Product', 'Design', 'Operations', 'Marketing']
  const authors = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson']
  
  return Array.from({ length: size }, (_, index) => {
    const id = (page - 1) * size + index + 1
    return {
      id,
      title: `Article Title ${id}`,
      content: `This is the content summary for article ${id}, containing some interesting information and insights. The article is rich in content and worth reading.`,
      category: categories[id % categories.length],
      author: authors[id % authors.length],
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  })
}

// Load data
const loadData = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newData = generateData(currentPage.value, pageSize)
    dataList.value.push(...newData)
    currentPage.value++
    
    // Simulate data limit
    if (dataList.value.length >= 200) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

// Scroll event handler
const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return
  
  const { scrollTop, scrollHeight, clientHeight } = container
  
  // Load more data when scrolled near the bottom
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadData()
  }
}

// Throttle function
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  
  return function (...args) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

const throttledScroll = throttle(handleScroll, 200)

onMounted(() => {
  loadData()
  scrollContainer.value?.addEventListener('scroll', throttledScroll)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', throttledScroll)
})
</script>

<style scoped>
.infinite-scroll-container {
  height: 600px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.data-list {
  padding: 20px;
}

.data-item {
  padding: 20px;
  margin-bottom: 15px;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.data-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.item-time {
  color: #909399;
  font-size: 12px;
}

.item-content {
  color: #606266;
  line-height: 1.6;
  margin: 10px 0;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.item-author {
  color: #909399;
  font-size: 12px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #606266;
}

.loading-indicator .el-icon {
  margin-right: 8px;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

.empty-state {
  padding: 40px;
}
</style>
```

## API Documentation

### Pagination Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| small | whether to use small pagination | boolean | — | false |
| background | whether the buttons have a background color | boolean | — | false |
| page-size | item count of each page | number | — | 10 |
| total | total item count | number | — | — |
| page-count | total page count. Set either total or page-count and pages will be displayed | number | — | — |
| pager-count | number of pagers. Pagination collapses when the total page count exceeds this value | number | odd number between 5 and 21 | 7 |
| current-page | current page number | number | — | 1 |
| layout | layout of pagination, elements separated with a comma | string | sizes, prev, pager, next, jumper, ->, total, slot | 'prev, pager, next, jumper, ->, total' |
| page-sizes | options of item count per page | number[] | — | [10, 20, 50, 100] |
| popper-class | custom class name for the page size Select's dropdown | string | — | — |
| prev-text | text for the prev button | string | — | — |
| next-text | text for the next button | string | — | — |
| disabled | whether Pagination is disabled | boolean | — | false |
| hide-on-single-page | whether to hide when there's only one page | boolean | — | — |

### Pagination Events

| Event Name | Description | Parameters |
|--------|------|----------|
| size-change | triggers when pageSize changes | the new page size |
| current-change | triggers when currentPage changes | the new current page |
| prev-click | triggers when the prev button is clicked and current page changes | the new current page |
| next-click | triggers when the next button is clicked and current page changes | the new current page |

### Pagination Slots

| Name | Description |
|--------|------|
| — | custom content. To use this slot, you need to declare it in the layout |

## Best Practices

### Performance Optimization

1. **Set appropriate page size**:
   - Choose a suitable pageSize based on data complexity and network conditions
   - Provide multiple page size options for users to choose from

2. **Data caching**:
   - Cache already loaded page data
   - Avoid requesting the same data repeatedly

3. **Lazy loading**:
   - Use lazy loading for resources like images
   - Reduce initial loading time

### User Experience

1. **Loading states**:
   - Display loading indicators
   - Provide friendly error messages

2. **Responsive design**:
   - Adapt to different screen sizes
   - Optimize for mobile devices

3. **Quick operations**:
   - Provide quick jump functionality
   - Support keyboard navigation

### Accessibility

1. **Semantic tags**:
   - Use correct ARIA labels
   - Provide screen reader support

2. **Keyboard navigation**:
   - Support Tab key navigation
   - Support Enter key confirmation

## Summary

The Pagination component is an important component for data display. Through this documentation, you should be able to:

1. Skillfully use various features of the Pagination component
2. Master the integration of pagination with tables
3. Understand different pagination implementation solutions for various scenarios
4. Master pagination component performance optimization techniques
5. Understand pagination component best practices

In actual projects, choose the appropriate pagination solution based on specific requirements, pay attention to performance optimization and user experience, and you can build high-quality data display interfaces.

## References

- [Element Plus Pagination Official Documentation](https://element-plus.org/en-US/component/pagination.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Infinite Scroll Best Practices](https://web.dev/infinite-scroll/)
