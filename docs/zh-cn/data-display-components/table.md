# Table 表格

## 概述
Table 表格组件用于展示行列数据，是数据展示的核心组件之一。Element Plus 的 Table 组件功能强大，支持排序、筛选、分页、选择、展开等多种功能。

## 学习目标
- 掌握 Table 组件的基础用法
- 理解表格列配置和数据绑定
- 学会使用表格的排序和筛选功能
- 掌握表格分页和选择功能
- 了解表格的高级特性

## 基础用法

### 基础表格
最简单的表格展示，只需要配置 `data` 和 `el-table-column`：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }
])
</script>
```

### 带斑马纹表格
使用 `stripe` 属性可以创建带斑马纹的表格：

```vue
<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>
```

### 带边框表格
使用 `border` 属性可以为表格添加边框：

```vue
<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>
```

## 表格排序

### 默认排序
在列中设置 `sortable` 属性即可实现以该列为基准的排序：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" sortable width="180" />
    <el-table-column prop="name" label="姓名" sortable width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>
```

### 自定义排序
通过 `sort-method` 或者 `sort-by` 来自定义排序规则：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column 
      prop="date" 
      label="日期" 
      sortable 
      :sort-method="sortByDate"
      width="180" 
    />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="score" label="分数" sortable width="180" />
  </el-table>
</template>

<script setup>
const sortByDate = (a, b) => {
  return new Date(a.date) - new Date(b.date)
}
</script>
```

## 表格筛选

### 列筛选
在列中设置 `filters` 和 `filter-method` 属性即可开启该列的筛选：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column 
      prop="name" 
      label="姓名" 
      width="180"
      :filters="[
        { text: '王小虎', value: '王小虎' },
        { text: '张小刚', value: '张小刚' },
        { text: '李小红', value: '李小红' }
      ]"
      :filter-method="filterHandler"
    />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>

<script setup>
const filterHandler = (value, row, column) => {
  const property = column['property']
  return row[property] === value
}
</script>
```

## 表格选择

### 多选
通过添加 `type="selection"` 的列来实现多选：

```vue
<template>
  <el-table 
    ref="multipleTableRef"
    :data="tableData" 
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column prop="date" label="日期" width="120" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="address" label="地址" />
  </el-table>
  
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection()">切换选择状态</el-button>
    <el-button @click="toggleSelection(tableData.slice(0, 2))">
      切换前两行选择状态
    </el-button>
    <el-button @click="clearSelection">清空选择</el-button>
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

## 表格展开行

通过设置 `type="expand"` 和 `slot` 可以开启展开行功能：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <div style="padding: 20px">
          <p>姓名: {{ props.row.name }}</p>
          <p>地址: {{ props.row.address }}</p>
          <p>详细信息: {{ props.row.detail }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="日期" prop="date" />
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="地址" prop="address" />
  </el-table>
</template>
```

## 固定列和表头

### 固定表头
通过设置 `height` 属性可以固定表头：

```vue
<template>
  <el-table :data="tableData" height="250" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
  </el-table>
</template>
```

### 固定列
通过设置 `fixed` 属性可以固定列：

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="date" label="日期" width="150" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="province" label="省份" width="120" />
    <el-table-column prop="city" label="市区" width="120" />
    <el-table-column prop="address" label="地址" width="300" />
    <el-table-column prop="zip" label="邮编" width="120" />
    <el-table-column fixed="right" label="操作" width="100">
      <template #default>
        <el-button link type="primary" size="small">查看</el-button>
        <el-button link type="primary" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

## 实际应用示例

### 用户管理表格
一个完整的用户管理表格示例：

```vue
<template>
  <div class="user-table-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索用户名或邮箱"
        style="width: 300px; margin-right: 10px"
        clearable
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="filteredTableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="name" label="用户名" width="120" sortable />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="role" label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" sortable />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

// 响应式数据
const loading = ref(false)
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const multipleSelection = ref([])

// 计算属性
const filteredTableData = computed(() => {
  if (!searchText.value) return tableData.value
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 方法
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
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    row.status = !row.status // 回滚状态
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  // 跳转到新增页面或打开弹窗
  console.log('新增用户')
}

const handleEdit = (row) => {
  // 跳转到编辑页面或打开弹窗
  console.log('编辑用户', row)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    loading.value = true
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 从表格数据中移除
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
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
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    const mockData = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `用户${index + 1}`,
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
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
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

## API 文档

### Table Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 显示的数据 | array | — | — |
| height | Table 的高度 | string/number | — | — |
| max-height | Table 的最大高度 | string/number | — | — |
| stripe | 是否为斑马纹 table | boolean | — | false |
| border | 是否带有纵向边框 | boolean | — | false |
| size | Table 的尺寸 | string | large/default/small | — |
| fit | 列的宽度是否自撑开 | boolean | — | true |
| show-header | 是否显示表头 | boolean | — | true |
| highlight-current-row | 是否要高亮当前行 | boolean | — | false |
| current-row-key | 当前行的 key | string/number | — | — |
| row-class-name | 行的 className 的回调方法 | function({row, rowIndex})/string | — | — |
| row-style | 行的 style 的回调方法 | function({row, rowIndex})/object | — | — |
| cell-class-name | 单元格的 className 的回调方法 | function({row, column, rowIndex, columnIndex})/string | — | — |
| cell-style | 单元格的 style 的回调方法 | function({row, column, rowIndex, columnIndex})/object | — | — |
| header-row-class-name | 表头行的 className 的回调方法 | function({row, rowIndex})/string | — | — |
| header-row-style | 表头行的 style 的回调方法 | function({row, rowIndex})/object | — | — |
| header-cell-class-name | 表头单元格的 className 的回调方法 | function({row, column, rowIndex, columnIndex})/string | — | — |
| header-cell-style | 表头单元格的 style 的回调方法 | function({row, column, rowIndex, columnIndex})/object | — | — |
| row-key | 行数据的 Key | function(row)/string | — | — |
| empty-text | 空数据时显示的文本内容 | string | — | 暂无数据 |
| default-expand-all | 是否默认展开所有行 | boolean | — | false |
| expand-row-keys | 可以通过该属性设置 Table 目前的展开行 | array | — | — |
| default-sort | 默认的排序列的 prop 和顺序 | object | order: ascending, descending | — |
| tooltip-effect | tooltip effect 属性 | string | dark/light | dark |
| show-summary | 是否在表尾显示合计行 | boolean | — | false |
| sum-text | 合计行第一列的文本 | string | — | 合计 |
| summary-method | 自定义的合计计算方法 | function({columns, data}) | — | — |
| span-method | 合并行或列的计算方法 | function({row, column, rowIndex, columnIndex}) | — | — |
| select-on-indeterminate | 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为 | boolean | — | true |
| indent | 展示树形数据时，树节点的缩进 | number | — | 16 |
| lazy | 是否懒加载子节点数据 | boolean | — | — |
| load | 加载子节点数据的函数 | function(row, treeNode, resolve) | — | — |
| tree-props | 渲染嵌套数据的配置选项 | object | — | { hasChildren: 'hasChildren', children: 'children' } |
| table-layout | 设置表格单元、行和列的布局方式 | string | fixed/auto | fixed |
| scrollbar-always-on | 总是显示滚动条 | boolean | — | false |
| flexible | 确保主轴的最小尺寸 | boolean | — | false |

### Table Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件 | selection |
| cell-mouse-enter | 当单元格 hover 进入时会触发该事件 | row, column, cell, event |
| cell-mouse-leave | 当单元格 hover 退出时会触发该事件 | row, column, cell, event |
| cell-click | 当某个单元格被点击时会触发该事件 | row, column, cell, event |
| cell-dblclick | 当某个单元格被双击击时会触发该事件 | row, column, cell, event |
| row-click | 当某一行被点击时会触发该事件 | row, column, event |
| row-contextmenu | 当某一行被鼠标右键点击时会触发该事件 | row, column, event |
| row-dblclick | 当某一行被双击时会触发该事件 | row, column, event |
| header-click | 当某一列的表头被点击时会触发该事件 | column, event |
| header-contextmenu | 当某一列的表头被鼠标右键点击时触发该事件 | column, event |
| sort-change | 当表格的排序条件发生变化的时候会触发该事件 | { column, prop, order } |
| filter-change | 当表格的筛选条件发生变化的时候会触发该事件 | filters |
| current-change | 当表格的当前行发生变化的时候会触发该事件 | currentRow, oldCurrentRow |
| header-dragend | 当拖动表头改变了列的宽度的时候会触发该事件 | newWidth, oldWidth, column, event |
| expand-change | 当用户对某一行展开或者关闭的时候会触发该事件 | row, expandedRows |

### Table Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| clearSelection | 用于多选表格，清空用户的选择 | — |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态 | row, selected |
| toggleAllSelection | 用于多选表格，切换全选和全不选 | — |
| setCurrentRow | 用于单选表格，设定某一行为选中行 | row |
| clearSort | 用于清空排序条件，数据会恢复成未排序的状态 | — |
| clearFilter | 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态 | columnKeys |
| doLayout | 对 Table 进行重新布局 | — |
| sort | 手动对 Table 进行排序 | prop, order |
| scrollTo | 滚动到一组特定坐标 | (options: ScrollToOptions \| number, yCoord?: number) |
| setScrollTop | 设置垂直滚动位置 | top |
| setScrollLeft | 设置水平滚动位置 | left |

### Table-column Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| type | 对应列的类型 | string | selection/index/expand | — |
| index | 如果设置了 type=index，可以通过传递 index 属性来自定义索引 | number/function(index) | — | — |
| label | 显示的标题 | string | — | — |
| column-key | column 的 key | string | — | — |
| prop | 对应列内容的字段名 | string | — | — |
| width | 对应列的宽度 | string/number | — | — |
| min-width | 对应列的最小宽度 | string/number | — | — |
| fixed | 列是否固定在左侧或者右侧 | string/boolean | true/left/right | — |
| render-header | 列标题 Label 区域渲染使用的 Function | function(h, { column, $index }) | — | — |
| sortable | 对应列是否可以排序 | boolean/string | true/false/'custom' | false |
| sort-method | 对数据进行排序的时候使用的方法 | function(a, b) | — | — |
| sort-by | 指定数据按照哪个属性进行排序 | string/array/function(row, index) | — | — |
| sort-orders | 数据在排序时所使用排序策略的轮转顺序 | array | 数组中的元素需为以下三者之一：ascending 表示升序，descending 表示降序，null 表示还原为原始顺序 | ['ascending', 'descending', null] |
| resizable | 对应列是否可以通过拖动改变宽度 | boolean | — | true |
| formatter | 用来格式化内容 | function(row, column, cellValue, index) | — | — |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip | boolean/object | — | undefined |
| align | 对齐方式 | string | left/center/right | left |
| header-align | 表头对齐方式 | string | left/center/right | 同 align |
| class-name | 列的 className | string | — | — |
| label-class-name | 当前列标题的自定义类名 | string | — | — |
| filters | 数据过滤的选项 | array[{ text, value }] | — | — |
| filter-placement | 过滤弹出框的定位 | string | 与 Tooltip 的 placement 属性相同 | — |
| filter-multiple | 数据过滤的选项是否多选 | boolean | — | true |
| filter-method | 数据过滤使用的方法 | function(value, row, column) | — | — |
| filtered-value | 选中的数据过滤项 | array | — | — |

## 实践练习

### 练习1：商品管理表格
创建一个商品管理表格，包含以下功能：
- 商品列表展示（名称、价格、库存、状态）
- 按价格排序
- 按状态筛选
- 批量操作（上架/下架）
- 分页功能

```vue
<template>
  <div class="product-management">
    <div class="toolbar">
      <el-button type="primary" @click="handleBatchOnline" :disabled="!hasSelection">
        批量上架
      </el-button>
      <el-button @click="handleBatchOffline" :disabled="!hasSelection">
        批量下架
      </el-button>
      <el-button type="success" @click="handleAdd">新增商品</el-button>
    </div>

    <el-table
      ref="tableRef"
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="商品名称" width="200" />
      <el-table-column 
        prop="price" 
        label="价格" 
        width="120" 
        sortable
        :formatter="priceFormatter"
      />
      <el-table-column prop="stock" label="库存" width="100" sortable />
      <el-table-column 
        prop="status" 
        label="状态" 
        width="120"
        :filters="[
          { text: '在售', value: 'online' },
          { text: '下架', value: 'offline' },
          { text: '缺货', value: 'out_of_stock' }
        ]"
        :filter-method="filterStatus"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button 
            link 
            :type="row.status === 'online' ? 'warning' : 'success'" 
            size="small" 
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'online' ? '下架' : '上架' }}
          </el-button>
          <el-button link type="danger" size="small" @click="handleDelete(row)">
            删除
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
  return `¥${cellValue.toFixed(2)}`
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
    'online': '在售',
    'offline': '下架',
    'out_of_stock': '缺货'
  }
  return textMap[status] || '未知'
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
      `确定要将选中的 ${multipleSelection.value.length} 个商品上架吗？`,
      '批量上架',
      { type: 'warning' }
    )
    
    // 模拟批量上架操作
    multipleSelection.value.forEach(item => {
      item.status = 'online'
    })
    
    ElMessage.success('批量上架成功')
    tableRef.value.clearSelection()
  } catch (error) {
    // 用户取消操作
  }
}

const handleBatchOffline = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要将选中的 ${multipleSelection.value.length} 个商品下架吗？`,
      '批量下架',
      { type: 'warning' }
    )
    
    // 模拟批量下架操作
    multipleSelection.value.forEach(item => {
      item.status = 'offline'
    })
    
    ElMessage.success('批量下架成功')
    tableRef.value.clearSelection()
  } catch (error) {
    // 用户取消操作
  }
}

const handleAdd = () => {
  console.log('新增商品')
}

const handleEdit = (row) => {
  console.log('编辑商品', row)
}

const handleToggleStatus = (row) => {
  const newStatus = row.status === 'online' ? 'offline' : 'online'
  const action = newStatus === 'online' ? '上架' : '下架'
  
  ElMessageBox.confirm(
    `确定要${action}商品 "${row.name}" 吗？`,
    `确认${action}`,
    { type: 'warning' }
  ).then(() => {
    row.status = newStatus
    ElMessage.success(`${action}成功`)
  }).catch(() => {
    // 用户取消操作
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除商品 "${row.name}" 吗？`,
    '确认删除',
    { type: 'warning' }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    // 用户取消操作
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
  // 模拟数据加载
  const mockData = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `商品${index + 1}`,
    price: Math.random() * 1000 + 10,
    stock: Math.floor(Math.random() * 100),
    status: ['online', 'offline', 'out_of_stock'][index % 3],
    createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
  }))
  
  total.value = mockData.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = mockData.slice(start, end)
}

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
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
```

## 常见问题

### 1. 表格数据更新后不重新渲染
**问题：** 修改表格数据后，表格没有重新渲染。

**解决方案：**
```javascript
// 确保数据是响应式的
const tableData = ref([])

// 更新数据时使用正确的方式
// ❌ 错误方式
tableData.value[0].name = '新名称'

// ✅ 正确方式
tableData.value[0] = { ...tableData.value[0], name: '新名称' }
// 或者
tableData.value = [...tableData.value]
```

### 2. 表格高度自适应问题
**问题：** 表格高度无法自适应容器。

**解决方案：**
```vue
<template>
  <div class="table-container">
    <el-table :data="tableData" height="100%">
      <!-- 列定义 -->
    </el-table>
  </div>
</template>

<style>
.table-container {
  height: calc(100vh - 200px); /* 减去其他元素的高度 */
}
</style>
```

### 3. 表格列宽度问题
**问题：** 表格列宽度分配不合理。

**解决方案：**
```vue
<!-- 固定宽度列 -->
<el-table-column prop="id" label="ID" width="80" />

<!-- 最小宽度列 -->
<el-table-column prop="name" label="名称" min-width="120" />

<!-- 自适应列（不设置 width 和 min-width） -->
<el-table-column prop="description" label="描述" />
```

### 4. 表格性能优化
**问题：** 大数据量时表格渲染缓慢。

**解决方案：**
```vue
<template>
  <!-- 使用虚拟滚动 -->
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script setup>
// 或者使用分页减少渲染数据量
const pageSize = ref(50) // 减少每页显示数量

// 使用 Object.freeze 冻结不变的数据
const frozenData = Object.freeze(largeDataArray)
</script>
```

## 最佳实践

### 1. 用户体验优化
- **加载状态**：使用 `v-loading` 指令显示加载状态
- **空状态**：自定义 `empty-text` 提供友好的空状态提示
- **错误处理**：妥善处理数据加载失败的情况
- **操作反馈**：及时给用户操作反馈

### 2. 性能优化
- **分页加载**：避免一次性加载大量数据
- **虚拟滚动**：对于超大数据集使用虚拟滚动
- **数据冻结**：使用 `Object.freeze()` 冻结不变的数据
- **防抖搜索**：搜索功能使用防抖处理

### 3. 可访问性
- **键盘导航**：确保表格支持键盘导航
- **屏幕阅读器**：为重要操作添加 `aria-label`
- **颜色对比**：确保文字和背景有足够的对比度

### 4. 代码组织
- **组件拆分**：将复杂的表格拆分为多个组件
- **逻辑复用**：提取公共的表格逻辑为 composables
- **类型安全**：使用 TypeScript 确保类型安全

## Table 高级功能

### 表格虚拟滚动
虚拟滚动适用于大数据量的表格展示，只渲染可视区域的数据：

```vue
<template>
  <el-table
    :data="tableData"
    height="400"
    v-loading="loading"
    style="width: 100%"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="department" label="部门" width="150" />
    <el-table-column prop="position" label="职位" width="150" />
    <el-table-column prop="salary" label="薪资" width="120" />
  </el-table>
  
  <!-- 虚拟滚动分页 -->
  <div class="virtual-pagination">
    <el-button @click="loadMore" :loading="loading" :disabled="!hasMore">
      加载更多 ({{ tableData.length }}/{{ totalCount }})
    </el-button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const tableData = ref([])
const loading = ref(false)
const hasMore = ref(true)
const totalCount = ref(10000)
const pageSize = 50

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const startIndex = tableData.value.length
    const newData = Array.from({ length: pageSize }, (_, index) => ({
      id: startIndex + index + 1,
      name: `用户${startIndex + index + 1}`,
      email: `user${startIndex + index + 1}@example.com`,
      department: ['技术部', '市场部', '人事部', '财务部'][Math.floor(Math.random() * 4)],
      position: ['工程师', '经理', '主管', '专员'][Math.floor(Math.random() * 4)],
      salary: Math.floor(Math.random() * 50000) + 50000
    }))
    
    tableData.value.push(...newData)
    hasMore.value = tableData.value.length < totalCount.value
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMore()
})
</script>

<style scoped>
.virtual-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
```

### 表格树形数据
展示具有层级关系的数据：

```vue
<template>
  <el-table
    :data="treeData"
    style="width: 100%"
    row-key="id"
    border
    default-expand-all
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column prop="name" label="部门名称" width="200" />
    <el-table-column prop="manager" label="负责人" width="150" />
    <el-table-column prop="employeeCount" label="员工数" width="100" />
    <el-table-column prop="budget" label="预算" width="150">
      <template #default="{ row }">
        ¥{{ row.budget?.toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="{ row }">
        <el-button size="small" @click="addChild(row)">添加子部门</el-button>
        <el-button size="small" type="danger" @click="deleteNode(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const treeData = ref([
  {
    id: 1,
    name: '技术部',
    manager: '张三',
    employeeCount: 50,
    budget: 5000000,
    children: [
      {
        id: 11,
        name: '前端组',
        manager: '李四',
        employeeCount: 15,
        budget: 1500000
      },
      {
        id: 12,
        name: '后端组',
        manager: '王五',
        employeeCount: 20,
        budget: 2000000
      },
      {
        id: 13,
        name: '测试组',
        manager: '赵六',
        employeeCount: 15,
        budget: 1500000
      }
    ]
  },
  {
    id: 2,
    name: '市场部',
    manager: '钱七',
    employeeCount: 30,
    budget: 3000000,
    children: [
      {
        id: 21,
        name: '销售组',
        manager: '孙八',
        employeeCount: 20,
        budget: 2000000
      },
      {
        id: 22,
        name: '推广组',
        manager: '周九',
        employeeCount: 10,
        budget: 1000000
      }
    ]
  }
])

const addChild = (row) => {
  const newChild = {
    id: Date.now(),
    name: '新部门',
    manager: '待分配',
    employeeCount: 0,
    budget: 0
  }
  
  if (!row.children) {
    row.children = []
  }
  row.children.push(newChild)
  ElMessage.success('添加成功')
}

const deleteNode = (row) => {
  // 这里需要实现删除逻辑
  ElMessage.warning('删除功能需要结合具体的数据结构实现')
}
</script>
```

### 表格合并行列
通过 `span-method` 实现单元格合并：

```vue
<template>
  <el-table
    :data="mergeData"
    :span-method="spanMethod"
    border
    style="width: 100%"
  >
    <el-table-column prop="date" label="日期" width="150" />
    <el-table-column prop="name" label="姓名" width="100" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="amount" label="金额" width="100" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const mergeData = ref([
  { date: '2023-01-01', name: '张三', address: '北京市朝阳区', amount: 1000 },
  { date: '2023-01-01', name: '张三', address: '北京市朝阳区', amount: 2000 },
  { date: '2023-01-02', name: '李四', address: '上海市浦东区', amount: 1500 },
  { date: '2023-01-02', name: '李四', address: '上海市浦东区', amount: 2500 },
  { date: '2023-01-03', name: '王五', address: '广州市天河区', amount: 3000 }
])

const spanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    const currentValue = row[column.property]
    let spanCount = 1
    let spanStart = rowIndex
    
    // 向上查找相同值
    for (let i = rowIndex - 1; i >= 0; i--) {
      if (mergeData.value[i][column.property] === currentValue) {
        spanStart = i
      } else {
        break
      }
    }
    
    // 向下查找相同值
    for (let i = rowIndex + 1; i < mergeData.value.length; i++) {
      if (mergeData.value[i][column.property] === currentValue) {
        spanCount++
      } else {
        break
      }
    }
    
    if (rowIndex === spanStart) {
      return {
        rowspan: spanCount,
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
</script>
```

### 表格自定义渲染
使用插槽和渲染函数自定义单元格内容：

```vue
<template>
  <el-table :data="customData" style="width: 100%">
    <el-table-column prop="name" label="姓名" width="120" />
    
    <!-- 自定义状态列 -->
    <el-table-column label="状态" width="120">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
      </template>
    </el-table-column>
    
    <!-- 自定义进度列 -->
    <el-table-column label="进度" width="200">
      <template #default="{ row }">
        <div class="progress-container">
          <el-progress 
            :percentage="row.progress" 
            :color="getProgressColor(row.progress)"
            :stroke-width="8"
          />
          <span class="progress-text">{{ row.progress }}%</span>
        </div>
      </template>
    </el-table-column>
    
    <!-- 自定义评分列 -->
    <el-table-column label="评分" width="150">
      <template #default="{ row }">
        <el-rate 
          v-model="row.rating" 
          :disabled="row.readonly"
          @change="handleRatingChange(row)"
        />
      </template>
    </el-table-column>
    
    <!-- 自定义操作列 -->
    <el-table-column label="操作" width="200">
      <template #default="{ row, $index }">
        <el-button-group>
          <el-button size="small" type="primary" @click="editRow(row, $index)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button size="small" type="success" @click="viewRow(row)">
            <el-icon><View /></el-icon>
          </el-button>
          <el-button size="small" type="danger" @click="deleteRow(row, $index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, View, Delete } from '@element-plus/icons-vue'

const customData = ref([
  { name: '项目A', status: '进行中', progress: 75, rating: 4, readonly: false },
  { name: '项目B', status: '已完成', progress: 100, rating: 5, readonly: true },
  { name: '项目C', status: '待开始', progress: 0, rating: 0, readonly: false },
  { name: '项目D', status: '已暂停', progress: 30, rating: 2, readonly: false }
])

const getStatusType = (status) => {
  const typeMap = {
    '进行中': 'primary',
    '已完成': 'success',
    '待开始': 'info',
    '已暂停': 'warning',
    '已取消': 'danger'
  }
  return typeMap[status] || 'info'
}

const getProgressColor = (percentage) => {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

const handleRatingChange = (row) => {
  ElMessage.success(`${row.name} 评分已更新为 ${row.rating} 星`)
}

const editRow = (row, index) => {
  ElMessage.info(`编辑第 ${index + 1} 行：${row.name}`)
}

const viewRow = (row) => {
  ElMessage.info(`查看详情：${row.name}`)
}

const deleteRow = (row, index) => {
  customData.value.splice(index, 1)
  ElMessage.success(`已删除：${row.name}`)
}
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-text {
  font-size: 12px;
  color: #606266;
  min-width: 35px;
}
</style>
```

### 表格导出功能
实现表格数据导出为 Excel 或 CSV：

```vue
<template>
  <div>
    <div class="export-controls">
      <el-button type="primary" @click="exportToExcel">导出 Excel</el-button>
      <el-button @click="exportToCSV">导出 CSV</el-button>
      <el-button @click="exportSelected" :disabled="!hasSelection">导出选中</el-button>
    </div>
    
    <el-table
      ref="exportTable"
      :data="exportData"
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="department" label="部门" width="120" />
      <el-table-column prop="position" label="职位" width="120" />
      <el-table-column prop="salary" label="薪资" width="100">
        <template #default="{ row }">
          ¥{{ row.salary.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="joinDate" label="入职日期" width="120" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'

const exportTable = ref()
const selectedRows = ref([])
const hasSelection = ref(false)

const exportData = ref([
  { id: 1, name: '张三', department: '技术部', position: '前端工程师', salary: 15000, joinDate: '2023-01-15' },
  { id: 2, name: '李四', department: '技术部', position: '后端工程师', salary: 16000, joinDate: '2023-02-20' },
  { id: 3, name: '王五', department: '市场部', position: '销售经理', salary: 18000, joinDate: '2023-03-10' },
  { id: 4, name: '赵六', department: '人事部', position: 'HR专员', salary: 12000, joinDate: '2023-04-05' }
])

const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  hasSelection.value = selection.length > 0
}

const exportToExcel = () => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(exportData.value)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '员工数据')
    
    // 设置列宽
    const colWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // 姓名
      { wch: 15 }, // 部门
      { wch: 20 }, // 职位
      { wch: 15 }, // 薪资
      { wch: 15 }  // 入职日期
    ]
    worksheet['!cols'] = colWidths
    
    XLSX.writeFile(workbook, `员工数据_${new Date().toISOString().slice(0, 10)}.xlsx`)
    ElMessage.success('Excel 导出成功')
  } catch (error) {
    ElMessage.error('Excel 导出失败')
    console.error(error)
  }
}

const exportToCSV = () => {
  try {
    const headers = ['ID', '姓名', '部门', '职位', '薪资', '入职日期']
    const csvContent = [
      headers.join(','),
      ...exportData.value.map(row => [
        row.id,
        row.name,
        row.department,
        row.position,
        row.salary,
        row.joinDate
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `员工数据_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    
    ElMessage.success('CSV 导出成功')
  } catch (error) {
    ElMessage.error('CSV 导出失败')
    console.error(error)
  }
}

const exportSelected = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的数据')
    return
  }
  
  try {
    const worksheet = XLSX.utils.json_to_sheet(selectedRows.value)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '选中数据')
    
    XLSX.writeFile(workbook, `选中数据_${new Date().toISOString().slice(0, 10)}.xlsx`)
    ElMessage.success(`已导出 ${selectedRows.value.length} 条选中数据`)
  } catch (error) {
    ElMessage.error('导出失败')
    console.error(error)
  }
}
</script>

<style scoped>
.export-controls {
  margin-bottom: 20px;
}

.export-controls .el-button {
  margin-right: 10px;
}
</style>
```

## 总结

Table 表格组件是 Element Plus 中最复杂也是最强大的组件之一。通过本文的学习，你应该掌握了：

1. **基础用法**：表格的基本配置和数据绑定
2. **高级功能**：排序、筛选、选择、展开等功能
3. **性能优化**：大数据量表格的优化策略
4. **实际应用**：完整的表格应用示例
5. **最佳实践**：用户体验和代码质量的优化
6. **高级特性**：虚拟滚动、树形数据、合并单元格、自定义渲染、导出功能等

在实际项目中，根据具体需求选择合适的表格功能，注意性能优化和用户体验，就能构建出高质量的数据展示界面。

## 参考资料

- [Element Plus Table 官方文档](https://element-plus.org/zh-CN/component/table.html)
- [Element Plus Table-v2 虚拟化表格](https://element-plus.org/zh-CN/component/table-v2.html)
- [Vue 3 响应式系统](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [SheetJS Excel 处理库](https://sheetjs.com/)
- [虚拟滚动最佳实践](https://cn.vuejs.org/guide/best-practices/performance.html)