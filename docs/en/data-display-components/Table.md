# Table

## Overview
The Table component is used to display row and column data, and is one of the core components for data display. Element Plus's Table component is powerful, supporting sorting, filtering, pagination, selection, expansion, and many other features.

## Learning Objectives
- Master the basic usage of the Table component
- Understand table column configuration and data binding
- Learn to use table sorting and filtering functions
- Master table pagination and selection features
- Understand advanced table features

## Basic Usage

### Basic Table
The simplest table display, just configure `data` and `el-table-column`:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: '1518 Jinshajiang Road, Putuo District, Shanghai'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: '1518 Jinshajiang Road, Putuo District, Shanghai'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: '1518 Jinshajiang Road, Putuo District, Shanghai'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: '1518 Jinshajiang Road, Putuo District, Shanghai'
  }
])
</script>
```

### Striped Table
Use the `stripe` attribute to create a striped table:

```vue
<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

### Bordered Table
Use the `border` attribute to add borders to the table:

```vue
<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

## Table Sorting

### Default Sorting
Set the `sortable` attribute in a column to enable sorting based on that column:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" sortable width="180" />
    <el-table-column prop="name" label="Name" sortable width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

### Custom Sorting
Use `sort-method` or `sort-by` to customize sorting rules:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column 
      prop="date" 
      label="Date" 
      sortable 
      :sort-method="sortByDate"
      width="180" 
    />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="score" label="Score" sortable width="180" />
  </el-table>
</template>

<script setup>
const sortByDate = (a, b) => {
  return new Date(a.date) - new Date(b.date)
}
</script>
```

## Table Filtering

### Column Filtering
Set the `filters` and `filter-method` attributes in a column to enable filtering:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column 
      prop="name" 
      label="Name" 
      width="180"
      :filters="[
        { text: 'Tom', value: 'Tom' },
        { text: 'Jerry', value: 'Jerry' },
        { text: 'Lucy', value: 'Lucy' }
      ]"
      :filter-method="filterHandler"
    />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script setup>
const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}
</script>
```

## Table Selection

### Multiple Selection
Add a column with `type="selection"` to implement multiple selection:

```vue
<template>
  <el-table 
    ref="multipleTableRef"
    :data="tableData" 
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="date" label="Date" width="120" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection()">Toggle Selection</el-button>
    <el-button @click="toggleSelection(tableData.slice(0, 2))">
      Toggle First Two Rows
    </el-button>
    <el-button @click="clearSelection">Clear Selection</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const multipleTableRef = ref()
const multipleSelection = ref([])

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}

const clearSelection = () => {
  multipleTableRef.value!.clearSelection()
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
</script>
```

## Table Expandable Rows

Set `type="expand"` and use slots to enable expandable rows:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div style="padding: 20px">
          <p>Name: {{ props.row.name }}</p>
          <p>Address: {{ props.row.address }}</p>
          <p>Details: {{ props.row.detail }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Name" prop="name" />
    <el-table-column label="Address" prop="address" />
  </el-table>
</template>
```

## Fixed Columns and Headers

### Fixed Header
Set the `height` attribute to fix the table header:

```vue
<template>
  <el-table :data="tableData" height="250" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

### Fixed Columns
Set the `fixed` attribute to fix columns:

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="date" label="Date" width="150" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="province" label="Province" width="120" />
    <el-table-column prop="city" label="City" width="120" />
    <el-table-column prop="address" label="Address" width="300" />
    <el-table-column prop="zip" label="Zip" width="120" />
    <el-table-column fixed="right" label="Operations" width="100">
      <template #default>
        <el-button link type="primary" size="small">View</el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

## Practical Application Examples

### User Management Table
A complete user management table example:

```vue
<template>
  <div class="user-table-container">
    <!-- Search Bar -->
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="Search username or email"
        style="width: 300px; margin-right: 10px"
        clearable
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">Add User</el-button>
    </div>

    <!-- Table -->
    <el-table
      v-loading="loading"
      :data="filteredTableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="name" label="Username" width="120" sortable />
      <el-table-column prop="email" label="Email" width="200" />
      <el-table-column prop="role" label="Role" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="Status" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="Created Time" width="180" sortable />
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            Edit
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-container">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Reactive data
const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const multipleSelection = ref([])

// Computed properties
const filteredTableData = computed(() => {
  if (!searchText.value) return tableData.value
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// Methods
const getRoleType = (role) => {
  const typeMap = {
    'admin': 'danger',
    'user': 'primary',
    'guest': 'info'
  }
  return typeMap[role] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
}

const handleStatusChange = async (row) => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Status updated successfully')
  } catch (error) {
    ElMessage.error('Status update failed')
    row.status = !row.status // Rollback status
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  // Navigate to add page or open dialog
  console.log('Add user')
}

const handleEdit = (row) => {
  // Navigate to edit page or open dialog
  console.log('Edit user', row)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete user "${row.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remove from table data
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    
    ElMessage.success('Deleted successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Delete failed')
    }
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

const fetchData = async () => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data
    const mockData = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `User${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: ['admin', 'user', 'guest'][index % 3],
      status: Math.random() > 0.3,
      createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
    }))
    
    total.value = mockData.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = mockData.slice(start, end)
  } catch (error) {
    ElMessage.error('Failed to load data')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-table-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
```

## API Documentation

### Table Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| data | Table data | array | — | — |
| height | Table height | string/number | — | — |
| max-height | Table maximum height | string/number | — | — |
| stripe | Whether to apply stripe style | boolean | — | false |
| border | Whether to show vertical borders | boolean | — | false |
| size | Table size | string | large/default/small | — |
| fit | Whether column width automatically fits its container | boolean | — | true |
| show-header | Whether to show table header | boolean | — | true |
| highlight-current-row | Whether to highlight current row | boolean | — | false |
| current-row-key | Key of the current row | string/number | — | — |
| row-class-name | Function that returns custom class names for rows | function({row, rowIndex})/string | — | — |
| row-style | Function that returns custom styles for rows | function({row, rowIndex})/object | — | — |
| cell-class-name | Function that returns custom class names for cells | function({row, column, rowIndex, columnIndex})/string | — | — |
| cell-style | Function that returns custom styles for cells | function({row, column, rowIndex, columnIndex})/object | — | — |
| header-row-class-name | Function that returns custom class names for header rows | function({row, rowIndex})/string | — | — |
| header-row-style | Function that returns custom styles for header rows | function({row, rowIndex})/object | — | — |
| header-cell-class-name | Function that returns custom class names for header cells | function({row, column, rowIndex, columnIndex})/string | — | — |
| header-cell-style | Function that returns custom styles for header cells | function({row, column, rowIndex, columnIndex})/object | — | — |
| row-key | Key of row data | function(row)/string | — | — |
| empty-text | Text to show when data is empty | string | — | No Data |
| default-expand-all | Whether to expand all rows by default | boolean | — | false |
| expand-row-keys | Set expanded rows by keys | array | — | — |
| default-sort | Default sort column and order | object | order: ascending, descending | — |
| tooltip-effect | Tooltip effect property | string | dark/light | dark |
| show-summary | Whether to show summary row | boolean | — | false |
| sum-text | Text for the first column of summary row | string | — | Sum |
| summary-method | Custom summary method | function({columns, data}) | — | — |
| span-method | Method for merging cells | function({row, column, rowIndex, columnIndex}) | — | — |
| select-on-indeterminate | Whether to select all rows when clicking the header checkbox in indeterminate state | boolean | — | true |
| indent | Horizontal indentation of tree data | number | — | 16 |
| lazy | Whether to lazy load tree data | boolean | — | — |
| load | Method for loading child nodes | function(row, treeNode, resolve) | — | — |
| tree-props | Configuration for rendering nested data | object | — | { hasChildren: 'hasChildren', children: 'children' } |
| table-layout | Sets the algorithm used for table layout | string | fixed/auto | fixed |
| scrollbar-always-on | Whether to always show scrollbars | boolean | — | false |
| flexible | Ensures minimum size on the main axis | boolean | — | false |

### Table Events

| Event Name | Description | Parameters |
|--------|------|------|
| select | Triggered when user clicks the checkbox in a row | selection, row |
| select-all | Triggered when user clicks the checkbox in table header | selection |
| selection-change | Triggered when selection changes | selection |
| cell-mouse-enter | Triggered when hovering into a cell | row, column, cell, event |
| cell-mouse-leave | Triggered when hovering out of a cell | row, column, cell, event |
| cell-click | Triggered when clicking a cell | row, column, cell, event |
| cell-dblclick | Triggered when double-clicking a cell | row, column, cell, event |
| row-click | Triggered when clicking a row | row, column, event |
| row-contextmenu | Triggered when right-clicking a row | row, column, event |
| row-dblclick | Triggered when double-clicking a row | row, column, event |
| header-click | Triggered when clicking a column header | column, event |
| header-contextmenu | Triggered when right-clicking a column header | column, event |
| sort-change | Triggered when table's sorting changes | { column, prop, order } |
| filter-change | Triggered when table's filters change | filters |
| current-change | Triggered when current row changes | currentRow, oldCurrentRow |
| header-dragend | Triggered after a column is dragged to a new width | newWidth, oldWidth, column, event |
| expand-change | Triggered when a row is expanded or collapsed | row, expandedRows |

### Table Methods

| Method | Description | Parameters |
|--------|------|------|
| clearSelection | Clears selection | — |
| toggleRowSelection | Toggles selection state of a row | row, selected |
| toggleAllSelection | Toggles selection state of all rows | — |
| setCurrentRow | Sets a row as the current row | row |
| clearSort | Clears sorting | — |
| clearFilter | Clears filters | columnKeys |
| doLayout | Refreshes the layout of the table | — |
| sort | Sorts the table manually | prop, order |
| scrollTo | Scrolls to a specific position | (options: ScrollToOptions \| number, yCoord?: number) |
| setScrollTop | Sets vertical scroll position | top |
| setScrollLeft | Sets horizontal scroll position | left |

### Table-column Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| type | Type of the column | string | selection/index/expand | — |
| index | Customize indices when using type=index | number/function(index) | — | — |
| label | Column label | string | — | — |
| column-key | Column's key | string | — | — |
| prop | Field name corresponding to column's data | string | — | — |
| width | Column width | string/number | — | — |
| min-width | Column minimum width | string/number | — | — |
| fixed | Whether column is fixed (true means fixed left) | string/boolean | true/left/right | — |
| render-header | Function for rendering column header | function(h, { column, $index }) | — | — |
| sortable | Whether column can be sorted | boolean/string | true/false/'custom' | false |
| sort-method | Sorting method | function(a, b) | — | — |
| sort-by | Specifies which property to sort by | string/array/function(row, index) | — | — |
| sort-orders | The order of the sorting strategies used when sorting the data | array | Elements in array need to be one of: ascending, descending, null | ['ascending', 'descending', null] |
| resizable | Whether column width can be resized | boolean | — | true |
| formatter | Function that formats cell content | function(row, column, cellValue, index) | — | — |
| show-overflow-tooltip | Whether to show tooltip when content overflows | boolean/object | — | undefined |
| align | Alignment | string | left/center/right | left |
| header-align | Alignment of the table header | string | left/center/right | Same as align |
| class-name | Class name of cells in the column | string | — | — |
| label-class-name | Class name of the label of this column | string | — | — |
| filters | Filter options | array[{ text, value }] | — | — |
| filter-placement | Placement of the filter dropdown | string | Same as Tooltip's placement | — |
| filter-multiple | Whether data filtering supports multiple options | boolean | — | true |
| filter-method | Data filtering method | function(value, row, column) | — | — |
| filtered-value | Filter value for selected data | array | — | — |

## Practice Exercises

### Exercise 1: Product Management Table
Create a product management table with the following features:
- Product list display (name, price, stock, status)
- Sort by price
- Filter by status
- Batch operations (list/delist)
- Pagination

```vue
<template>
  <div class="product-management">
    <div class="toolbar">
      <el-button type="primary" @click="handleBatchOnline" :disabled="!hasSelection">
        Batch List
      </el-button>
      <el-button @click="handleBatchOffline" :disabled="!hasSelection">
        Batch Delist
      </el-button>
      <el-button type="success" @click="handleAdd">Add Product</el-button>
    </div>

    <el-table
      ref="tableRef"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="Product Name" width="200" />
      <el-table-column 
        prop="price" 
        label="Price" 
        width="120" 
        sortable
        :formatter="priceFormatter"
      />
      <el-table-column prop="stock" label="Stock" width="100" sortable />
      <el-table-column 
        prop="status" 
        label="Status" 
        width="120"
        :filters="[
          { text: 'Listed', value: 'online' },
          { text: 'Delisted', value: 'offline' },
          { text: 'Out of Stock', value: 'out_of_stock' }
        ]"
        :filter-method="filterStatus"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="Created Time" width="180" />
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            Edit
          </el-button>
          <el-button 
            link 
            :type="row.status === 'online' ? 'warning' : 'success'" 
            size="small" 
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'online' ? 'Delist' : 'List' }}
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableRef = ref()
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const multipleSelection = ref([])

const hasSelection = computed(() => multipleSelection.value.length > 0)

const priceFormatter = (row, column, cellValue) => {
  return `$${cellValue.toFixed(2)}`
}

const getStatusType = (status) => {
  const typeMap = {
    'online': 'success',
    'offline': 'info',
    'out_of_stock': 'warning'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    'online': 'Listed',
    'offline': 'Delisted',
    'out_of_stock': 'Out of Stock'
  }
  return textMap[status] || 'Unknown'
}

const filterStatus = (value, row) => {
  return row.status === value
}

const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
}

const handleBatchOnline = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to list ${multipleSelection.value.length} selected products?`,
      'Batch List',
      { type: 'warning' }
    )
    
    // Simulate batch listing operation
    multipleSelection.value.forEach(item => {
      item.status = 'online'
    })
    
    ElMessage.success('Batch listing successful')
    tableRef.value.clearSelection()
  } catch (error) {
    // User canceled operation
  }
}

const handleBatchOffline = async () => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delist ${multipleSelection.value.length} selected products?`,
      'Batch Delist',
      { type: 'warning' }
    )
    
    // Simulate batch delisting operation
    multipleSelection.value.forEach(item => {
      item.status = 'offline'
    })
    
    ElMessage.success('Batch delisting successful')
    tableRef.value.clearSelection()
  } catch (error) {
    // User canceled operation
  }
}

const handleAdd = () => {
  console.log('Add product')
}

const handleEdit = (row) => {
  console.log('Edit product', row)
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'online' ? 'offline' : 'online'
  const action = newStatus === 'online' ? 'list' : 'delist'
  
  ElMessageBox.confirm(
    `Are you sure you want to ${action} product "${row.name}"?`,
    `Confirm ${action}`,
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    ElMessage.success(`${action} successful`)
  }).catch(() => {
    // User canceled operation
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure you want to delete product "${row.name}"?`,
    'Confirm Delete',
    { type: 'warning' }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('Delete successful')
  }).catch(() => {
    // User canceled operation
  })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

const fetchData = () => {
  // Simulate data loading
  loading.value = true
  
  setTimeout(() => {
    // Generate mock product data
    const mockProducts = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      price: Math.round(Math.random() * 1000) / 10,
      stock: Math.floor(Math.random() * 1000),
      status: ['online', 'offline', 'out_of_stock'][Math.floor(Math.random() * 3)],
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString()
    }))
    
    total.value = mockProducts.length
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = mockProducts.slice(start, end)
    
    loading.value = false
  }, 500)
}

// Initialize data
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.product-management {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
```

### Exercise 2: Data Analysis Table

Create a data analysis table with the following features:
- Summary row
- Cell merging
- Custom cell styles
- Conditional formatting

```vue
<template>
  <div class="data-analysis">
    <h3>Sales Data Analysis</h3>
    
    <el-table
      :data="salesData"
      :span-method="objectSpanMethod"
      :cell-style="cellStyle"
      border
      show-summary
      :summary-method="getSummaries"
      style="width: 100%"
    >
      <el-table-column prop="region" label="Region" width="120" />
      <el-table-column prop="product" label="Product" width="180" />
      <el-table-column prop="quarter" label="Quarter" width="100" />
      <el-table-column prop="sales" label="Sales" width="120" sortable>
        <template #default="{ row }">
          {{ formatCurrency(row.sales) }}
        </template>
      </el-table-column>
      <el-table-column prop="cost" label="Cost" width="120" sortable>
        <template #default="{ row }">
          {{ formatCurrency(row.cost) }}
        </template>
      </el-table-column>
      <el-table-column prop="profit" label="Profit" width="120" sortable>
        <template #default="{ row }">
          <span :class="getProfitClass(row.profit)">
            {{ formatCurrency(row.profit) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="growth" label="Growth" width="120">
        <template #default="{ row }">
          <div class="growth-indicator">
            <span :class="getGrowthClass(row.growth)">
              {{ formatPercentage(row.growth) }}
            </span>
            <el-icon v-if="row.growth > 0"><CaretTop /></el-icon>
            <el-icon v-else-if="row.growth < 0"><CaretBottom /></el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CaretTop, CaretBottom } from '@element-plus/icons-vue'

// Sample data
const salesData = ref([
  {
    region: 'North',
    product: 'Laptop',
    quarter: 'Q1',
    sales: 125000,
    cost: 87500,
    profit: 37500,
    growth: 0.12
  },
  {
    region: 'North',
    product: 'Laptop',
    quarter: 'Q2',
    sales: 140000,
    cost: 95000,
    profit: 45000,
    growth: 0.2
  },
  {
    region: 'North',
    product: 'Smartphone',
    quarter: 'Q1',
    sales: 85000,
    cost: 51000,
    profit: 34000,
    growth: 0.05
  },
  {
    region: 'North',
    product: 'Smartphone',
    quarter: 'Q2',
    sales: 95000,
    cost: 57000,
    profit: 38000,
    growth: 0.12
  },
  {
    region: 'South',
    product: 'Laptop',
    quarter: 'Q1',
    sales: 115000,
    cost: 86250,
    profit: 28750,
    growth: -0.05
  },
  {
    region: 'South',
    product: 'Laptop',
    quarter: 'Q2',
    sales: 125000,
    cost: 93750,
    profit: 31250,
    growth: 0.09
  },
  {
    region: 'South',
    product: 'Smartphone',
    quarter: 'Q1',
    sales: 75000,
    cost: 48750,
    profit: 26250,
    growth: -0.08
  },
  {
    region: 'South',
    product: 'Smartphone',
    quarter: 'Q2',
    sales: 82000,
    cost: 51250,
    profit: 30750,
    growth: 0.17
  }
])

// Cell merging
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex % 4 === 0) {
      return {
        rowspan: 4,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
  
  if (columnIndex === 1) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// Cell styling
const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.property === 'profit') {
    if (row.profit > 40000) {
      return { backgroundColor: '#f0f9eb', color: '#67c23a' }
    } else if (row.profit < 30000) {
      return { backgroundColor: '#fef0f0', color: '#f56c6c' }
    }
  }
  
  if (column.property === 'growth') {
    if (row.growth > 0.15) {
      return { backgroundColor: '#f0f9eb' }
    } else if (row.growth < 0) {
      return { backgroundColor: '#fef0f0' }
    }
  }
}

// Summary method
const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = 'Total'
      return
    }
    
    if (index === 1 || index === 2) {
      sums[index] = ''
      return
    }
    
    const values = data.map(item => Number(item[column.property]))
    
    if (!values.every(value => isNaN(value))) {
      const sum = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + value
        } else {
          return prev
        }
      }, 0)
      
      if (column.property === 'growth') {
        // Calculate average growth
        const avg = sum / values.length
        sums[index] = `${(avg * 100).toFixed(2)}%`
      } else {
        sums[index] = formatCurrency(sum)
      }
    } else {
      sums[index] = 'N/A'
    }
  })
  
  return sums
}

// Formatting functions
const formatCurrency = (value) => {
  return `$${value.toLocaleString()}`
}

const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`
}

// Style classes
const getProfitClass = (profit) => {
  if (profit > 40000) return 'profit-high'
  if (profit < 30000) return 'profit-low'
  return ''
}

const getGrowthClass = (growth) => {
  if (growth > 0) return 'growth-positive'
  if (growth < 0) return 'growth-negative'
  return ''
}
</script>

<style scoped>
.data-analysis {
  padding: 20px;
}

.data-analysis h3 {
  margin-bottom: 20px;
}

.profit-high {
  color: #67c23a;
  font-weight: bold;
}

.profit-low {
  color: #f56c6c;
}

.growth-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
}

.growth-positive {
  color: #67c23a;
}

.growth-negative {
  color: #f56c6c;
}
</style>
```

## Summary

The Table component is one of the most important data display components in Element Plus. Through this document, you should be able to:

1. Master the basic usage of the Table component
2. Understand how to configure table columns and bind data
3. Learn to use table sorting and filtering functions
4. Master table pagination and selection features
5. Understand advanced table features like fixed columns, expandable rows, and cell merging

In actual development, you can combine these features according to business requirements to create powerful data display interfaces.

## References

- [Element Plus Table Official Documentation](https://element-plus.org/en-US/component/table.html)
- [Vue 3 Documentation](https://v3.vuejs.org/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
