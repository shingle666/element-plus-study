# Table

## Overview

The Table component is used to display large amounts of structured data. It supports features like sorting, filtering, pagination, selection, and custom rendering.

## Basic Usage

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles'
  }
]
</script>
```

## Table with Stripe

```vue
<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

## Table with Border

```vue
<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

## Table with Status

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
    <el-table-column prop="status" label="Status" width="100">
      <template #default="scope">
        <el-tag
          :type="scope.row.status === 'success' ? 'success' : 'danger'"
          disable-transitions
        >
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'success'
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'danger'
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'success'
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'danger'
  }
]
</script>
```

## Fixed Header

```vue
<template>
  <el-table :data="tableData" height="250" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

## Fixed Columns

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="150" fixed />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="state" label="State" width="120" />
    <el-table-column prop="city" label="City" width="120" />
    <el-table-column prop="address" label="Address" width="300" />
    <el-table-column prop="zip" label="Zip" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="handleClick(scope.$index, scope.row)"
        >
          Detail
        </el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
const handleClick = (index, row) => {
  console.log(index, row)
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: '90036'
  },
  // ... more data
]
</script>
```

## Selection

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
    <el-table-column prop="address" label="Address" show-overflow-tooltip />
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">
      Toggle selection status of second and third rows
    </el-button>
    <el-button @click="toggleSelection()">Clear selection</el-button>
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

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const tableData = [
  // ... table data
]
</script>
```

## Sorting

```vue
<template>
  <el-table :data="tableData" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }">
    <el-table-column prop="date" label="Date" sortable width="180" />
    <el-table-column prop="name" label="Name" sortable width="180" />
    <el-table-column prop="address" label="Address" :formatter="formatter" />
  </el-table>
</template>

<script setup>
const formatter = (row, column) => {
  return row.address
}

const tableData = [
  // ... table data
]
</script>
```

## Filtering

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" sortable width="180" />
    <el-table-column
      prop="name"
      label="Name"
      width="180"
      :filters="[
        { text: 'Joe', value: 'Joe' },
        { text: 'John', value: 'John' }
      ]"
      :filter-method="filterHandler"
      filter-placement="bottom-end"
    />
    <el-table-column prop="address" label="Address" :formatter="formatter" />
  </el-table>
</template>

<script setup>
const formatter = (row, column) => {
  return row.address
}

const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}

const tableData = [
  // ... table data
]
</script>
```

## Custom Column Template

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="Date" width="180">
      <template #default="scope">
        <el-icon><Timer /></el-icon>
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Name" width="180">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top" width="auto">
          <template #default>
            <p>Name: {{ scope.row.name }}</p>
            <p>Address: {{ scope.row.address }}</p>
          </template>
          <template #reference>
            <el-tag>{{ scope.row.name }}</el-tag>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="Operations">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { Timer } from '@element-plus/icons-vue'

const handleEdit = (index, row) => {
  console.log(index, row)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

const tableData = [
  // ... table data
]
</script>
```

## Expandable Row

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div style="padding: 20px">
          <p>State: {{ props.row.state }}</p>
          <p>City: {{ props.row.city }}</p>
          <p>Address: {{ props.row.address }}</p>
          <p>Zip: {{ props.row.zip }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Name" prop="name" />
  </el-table>
</template>

<script setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: '90036'
  },
  // ... more data
]
</script>
```

## Tree Data

```vue
<template>
  <el-table
    :data="tableData"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    default-expand-all
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="date" label="Date" sortable width="180" />
    <el-table-column prop="name" label="Name" sortable width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script setup>
const tableData = [
  {
    id: 1,
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    id: 2,
    date: '2016-05-04',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
    children: [
      {
        id: 31,
        date: '2016-05-01',
        name: 'John',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        id: 32,
        date: '2016-05-01',
        name: 'John',
        address: 'No. 189, Grove St, Los Angeles'
      }
    ]
  },
  {
    id: 3,
    date: '2016-05-01',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
    hasChildren: true
  }
]
</script>
```

## Table Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| data | Table data | array | — |
| height | Table height | string / number | — |
| max-height | Table max height | string / number | — |
| stripe | Whether Table is striped | boolean | false |
| border | Whether Table has vertical border | boolean | false |
| size | Table size | string | — |
| fit | Whether width of column automatically fits its container | boolean | true |
| show-header | Whether Table header is visible | boolean | true |
| highlight-current-row | Whether current row is highlighted | boolean | false |
| current-row-key | Key of current row | string / number | — |
| row-class-name | Function that returns custom class names for a row | Function({row, rowIndex}) / string | — |
| row-style | Function that returns custom style for a row | Function({row, rowIndex}) / object | — |
| cell-class-name | Function that returns custom class names for a cell | Function({row, column, rowIndex, columnIndex}) / string | — |
| cell-style | Function that returns custom style for a cell | Function({row, column, rowIndex, columnIndex}) / object | — |
| header-row-class-name | Function that returns custom class names for a header row | Function({row, rowIndex}) / string | — |
| header-row-style | Function that returns custom style for a header row | Function({row, rowIndex}) / object | — |
| header-cell-class-name | Function that returns custom class names for a header cell | Function({row, column, rowIndex, columnIndex}) / string | — |
| header-cell-style | Function that returns custom style for a header cell | Function({row, column, rowIndex, columnIndex}) / object | — |
| row-key | Key of row data | Function(row) / string | — |
| empty-text | Displayed text when data is empty | string | No Data |
| default-expand-all | Whether to expand all rows by default | boolean | false |
| expand-row-keys | Set expanded rows by this prop | array | — |
| default-sort | Set the default sort column and order | object | — |
| tooltip-effect | Tooltip effect property | string | dark |
| show-summary | Whether to display a summary row | boolean | false |
| sum-text | Displayed text for the first column of summary row | string | Sum |
| summary-method | Custom summary method | Function({ columns, data }) | — |
| span-method | Method that returns rowspan and colspan | Function({ row, column, rowIndex, columnIndex }) | — |
| select-on-indeterminate | Controls the behavior of master checkbox in multi-select tables when only some rows are selected | boolean | true |
| indent | Horizontal indentation of tree data | number | 16 |
| lazy | Whether to lazy loading data | boolean | — |
| load | Method for loading child row data | Function(row, treeNode, resolve) | — |
| tree-props | Configuration for rendering nested data | object | — |

## Table Events

| Event | Description | Parameters |
|-------|-------------|------------|
| select | Triggers when user clicks the checkbox in a row | selection, row |
| select-all | Triggers when user clicks the checkbox in table header | selection |
| selection-change | Triggers when selection changes | selection |
| cell-mouse-enter | Triggers when hovering into a cell | row, column, cell, event |
| cell-mouse-leave | Triggers when hovering out of a cell | row, column, cell, event |
| cell-click | Triggers when clicking a cell | row, column, cell, event |
| cell-dblclick | Triggers when double clicking a cell | row, column, cell, event |
| row-click | Triggers when clicking a row | row, column, event |
| row-contextmenu | Triggers when user right clicks on a row | row, column, event |
| row-dblclick | Triggers when double clicking a row | row, column, event |
| header-click | Triggers when clicking a column header | column, event |
| header-contextmenu | Triggers when user right clicks on a column header | column, event |
| sort-change | Triggers when Table's sorting changes | { column, prop, order } |
| filter-change | Triggers when Table's filter changes | filters |
| current-change | Triggers when current row changes | currentRow, oldCurrentRow |
| header-dragend | Triggers after changing a column's width by dragging the column header's border | newWidth, oldWidth, column, event |
| expand-change | Triggers when user expands or collapses a row | row, expandedRows |

## Table Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| clearSelection | Clear selection | — |
| toggleRowSelection | Toggle if a certain row is selected | row, selected |
| toggleAllSelection | Toggle select all rows | — |
| toggleRowExpansion | Toggle if a certain row is expanded | row, expanded |
| setCurrentRow | Set a certain row as current row | row |
| clearSort | Clear sorting | — |
| clearFilter | Clear filters for columns whose columnKey are passed in | columnKeys |
| doLayout | Refresh the layout of Table | — |
| sort | Sort Table manually | prop, order |

## Table-column Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| type | Type of the column | string | — |
| index | Customize indices for each row | number / Function(index) | — |
| label | Column label | string | — |
| column-key | Column's key | string | — |
| prop | Field name | string | — |
| width | Column width | string / number | — |
| min-width | Column minimum width | string / number | — |
| fixed | Whether column is fixed at left/right | string / boolean | — |
| render-header | Render function for table header | Function({ column, $index }) | — |
| sortable | Whether column can be sorted | boolean / string | false |
| sort-method | Sorting method | Function(a, b) | — |
| sort-by | Specify which property to sort by | Function(row, index) / string | — |
| sort-orders | The order of the sorting strategies | array | ['ascending', 'descending', null] |
| resizable | Whether column width can be resized | boolean | true |
| formatter | Function that formats cell content | Function(row, column, cellValue, index) | — |
| show-overflow-tooltip | Whether to hide extra content and show them in a tooltip when hovering on the cell | boolean | false |
| align | Alignment | string | left |
| header-align | Alignment of the table header | string | — |
| class-name | Class name of cells in the column | string | — |
| label-class-name | Class name of the label of this column | string | — |
| selectable | Function that determines if a certain row can be selected | Function(row, index) | — |
| reserve-selection | Whether to reserve selection after data refreshing | boolean | false |
| filters | An array of data filtering options | Array[{ text, value }] | — |
| filter-placement | Placement for the filter dropdown | string | — |
| filter-multiple | Whether data filtering supports multiple options | boolean | true |
| filter-method | Data filtering method | Function(value, row, column) | — |
| filtered-value | Filter value for selected data | array | — |

## Best Practices

1. **Performance**: Use virtual scrolling for large datasets
2. **Accessibility**: Provide proper ARIA labels and keyboard navigation
3. **User Experience**: Include loading states and empty states
4. **Responsive Design**: Consider how tables display on mobile devices
5. **Data Management**: Implement proper sorting and filtering on the server side for large datasets

## Related Components

- [Pagination](/en/data-display-components/Pagination) - Table pagination
- [Loading](/en/feedback-components/Loading) - Loading states
- [Empty](/en/data-display-components/Empty) - Empty states