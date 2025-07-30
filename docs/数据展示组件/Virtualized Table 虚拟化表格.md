# Virtualized Table 虚拟化表格

## 概述

Virtualized Table 虚拟化表格是 Element Plus 提供的一个高性能表格组件，专门用于处理大量数据的展示。它通过虚拟滚动技术，只渲染可视区域内的行，从而实现在展示数万甚至数十万条数据时仍能保持流畅的性能。

## 学习目标

通过本文档的学习，你将掌握：
- Virtualized Table 的基本概念和性能优势
- 基础用法和表格配置
- 列定义和数据绑定
- 选择、排序、筛选等高级功能
- 自定义渲染和样式定制
- 实际项目中的应用示例
- 完整的 API 文档和性能优化技巧

## 基础用法

### 基础虚拟化表格

最简单的虚拟化表格用法：

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
  },
  {
    key: 'email',
    title: '邮箱',
    dataKey: 'email',
    width: 200,
  },
  {
    key: 'age',
    title: '年龄',
    dataKey: 'age',
    width: 80,
  },
  {
    key: 'address',
    title: '地址',
    dataKey: 'address',
    width: 200,
  }
])

// 生成大量测试数据
const data = ref(
  Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    age: Math.floor(Math.random() * 50) + 20,
    address: `地址${index + 1}号`
  }))
)
</script>
```

### 自定义列渲染

通过 `cellRenderer` 自定义单元格内容：

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="800"
    :height="400"
    fixed
  />
</template>

<script setup>
import { ref, h } from 'vue'
import { ElTag, ElButton } from 'element-plus'

const columns = ref([
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
  },
  {
    key: 'status',
    title: '状态',
    dataKey: 'status',
    width: 120,
    cellRenderer: ({ cellData }) => {
      const tagType = cellData === 'active' ? 'success' : 
                     cellData === 'inactive' ? 'danger' : 'warning'
      const tagText = cellData === 'active' ? '活跃' : 
                     cellData === 'inactive' ? '禁用' : '待审核'
      return h(ElTag, { type: tagType }, () => tagText)
    }
  },
  {
    key: 'score',
    title: '评分',
    dataKey: 'score',
    width: 100,
    cellRenderer: ({ cellData }) => {
      const color = cellData >= 80 ? '#67c23a' : 
                   cellData >= 60 ? '#e6a23c' : '#f56c6c'
      return h('span', { style: { color, fontWeight: 'bold' } }, cellData)
    }
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
    cellRenderer: ({ rowData }) => {
      return h('div', [
        h(ElButton, {
          size: 'small',
          type: 'primary',
          onClick: () => handleEdit(rowData)
        }, () => '编辑'),
        h(ElButton, {
          size: 'small',
          type: 'danger',
          style: { marginLeft: '8px' },
          onClick: () => handleDelete(rowData)
        }, () => '删除')
      ])
    }
  }
])

const data = ref(
  Array.from({ length: 10000 }, (_, index) => {
    const statuses = ['active', 'inactive', 'pending']
    return {
      id: index + 1,
      name: `用户${index + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      score: Math.floor(Math.random() * 100),
    }
  })
)

const handleEdit = (row) => {
  console.log('编辑用户:', row)
}

const handleDelete = (row) => {
  console.log('删除用户:', row)
}
</script>
```

### 固定列

设置列的固定位置：

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="800"
    :height="400"
    fixed
  />
</template>

<script setup>
import { ref } from 'vue'

const columns = ref([
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
    fixed: 'left', // 固定在左侧
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
    fixed: 'left', // 固定在左侧
  },
  {
    key: 'email',
    title: '邮箱',
    dataKey: 'email',
    width: 250,
  },
  {
    key: 'phone',
    title: '电话',
    dataKey: 'phone',
    width: 150,
  },
  {
    key: 'department',
    title: '部门',
    dataKey: 'department',
    width: 150,
  },
  {
    key: 'position',
    title: '职位',
    dataKey: 'position',
    width: 150,
  },
  {
    key: 'salary',
    title: '薪资',
    dataKey: 'salary',
    width: 120,
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
    fixed: 'right', // 固定在右侧
    cellRenderer: () => {
      return h('div', [
        h(ElButton, { size: 'small', type: 'primary' }, () => '编辑'),
        h(ElButton, { size: 'small', type: 'danger', style: { marginLeft: '8px' } }, () => '删除')
      ])
    }
  }
])

const data = ref(
  Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `员工${index + 1}`,
    email: `employee${index + 1}@company.com`,
    phone: `138${String(index + 1).padStart(8, '0')}`,
    department: ['技术部', '销售部', '市场部', '人事部'][Math.floor(Math.random() * 4)],
    position: ['工程师', '经理', '主管', '专员'][Math.floor(Math.random() * 4)],
    salary: Math.floor(Math.random() * 20000) + 5000
  }))
)
</script>
```

### 行选择

支持单选和多选：

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <el-button @click="clearSelection">清空选择</el-button>
      <el-button @click="selectAll">全选</el-button>
      <span style="margin-left: 16px">
        已选择 {{ selectedRows.length }} 项
      </span>
    </div>
    
    <el-table-v2
      ref="tableRef"
      :columns="columns"
      :data="data"
      :width="700"
      :height="400"
      fixed
      @row-select="onRowSelect"
      @select-all="onSelectAll"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'
import { ElCheckbox } from 'element-plus'

const tableRef = ref()
const selectedRows = ref([])

const columns = ref([
  {
    key: 'selection',
    width: 50,
    cellRenderer: ({ rowData }) => {
      return h(ElCheckbox, {
        modelValue: selectedRows.value.some(row => row.id === rowData.id),
        onChange: (checked) => {
          if (checked) {
            if (!selectedRows.value.some(row => row.id === rowData.id)) {
              selectedRows.value.push(rowData)
            }
          } else {
            const index = selectedRows.value.findIndex(row => row.id === rowData.id)
            if (index > -1) {
              selectedRows.value.splice(index, 1)
            }
          }
        }
      })
    },
    headerCellRenderer: () => {
      const allSelected = data.value.length > 0 && 
        selectedRows.value.length === data.value.length
      const indeterminate = selectedRows.value.length > 0 && 
        selectedRows.value.length < data.value.length
      
      return h(ElCheckbox, {
        modelValue: allSelected,
        indeterminate,
        onChange: (checked) => {
          if (checked) {
            selectedRows.value = [...data.value]
          } else {
            selectedRows.value = []
          }
        }
      })
    }
  },
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
  },
  {
    key: 'email',
    title: '邮箱',
    dataKey: 'email',
    width: 200,
  },
  {
    key: 'department',
    title: '部门',
    dataKey: 'department',
    width: 150,
  }
])

const data = ref(
  Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: ['技术部', '销售部', '市场部'][Math.floor(Math.random() * 3)]
  }))
)

const onRowSelect = (selected, row) => {
  console.log('行选择:', selected, row)
}

const onSelectAll = (selected) => {
  console.log('全选:', selected)
}

const clearSelection = () => {
  selectedRows.value = []
}

const selectAll = () => {
  selectedRows.value = [...data.value]
}
</script>
```

### 排序功能

支持列排序：

```vue
<template>
  <el-table-v2
    :columns="columns"
    :data="sortedData"
    :width="700"
    :height="400"
    :sort-by="sortBy"
    :sort-state="sortState"
    @column-sort="onSort"
    fixed
  />
</template>

<script setup>
import { ref, computed } from 'vue'

const sortBy = ref({ key: 'id', order: 'asc' })
const sortState = ref({})

const columns = ref([
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
    sortable: true,
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
    sortable: true,
  },
  {
    key: 'age',
    title: '年龄',
    dataKey: 'age',
    width: 100,
    sortable: true,
  },
  {
    key: 'score',
    title: '评分',
    dataKey: 'score',
    width: 100,
    sortable: true,
  },
  {
    key: 'createTime',
    title: '创建时间',
    dataKey: 'createTime',
    width: 180,
    sortable: true,
  }
])

const rawData = ref(
  Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    score: Math.floor(Math.random() * 100),
    createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
  }))
)

const sortedData = computed(() => {
  if (!sortBy.value.key) return rawData.value
  
  return [...rawData.value].sort((a, b) => {
    const aVal = a[sortBy.value.key]
    const bVal = b[sortBy.value.key]
    
    let result = 0
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      result = aVal - bVal
    } else {
      result = String(aVal).localeCompare(String(bVal))
    }
    
    return sortBy.value.order === 'desc' ? -result : result
  })
})

const onSort = ({ key, order }) => {
  sortBy.value = { key, order }
  sortState.value = { [key]: order }
}
</script>
```

## 实际应用示例

### 数据管理表格

```vue
<template>
  <div class="data-management">
    <div class="table-header">
      <div class="header-left">
        <h3>用户数据管理</h3>
        <span class="data-count">共 {{ totalCount }} 条数据</span>
      </div>
      
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户名或邮箱"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="filterDepartment"
          placeholder="筛选部门"
          style="width: 120px; margin-right: 10px"
          clearable
          @change="handleFilter"
        >
          <el-option label="全部" value="" />
          <el-option label="技术部" value="技术部" />
          <el-option label="销售部" value="销售部" />
          <el-option label="市场部" value="市场部" />
          <el-option label="人事部" value="人事部" />
        </el-select>
        
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增用户
        </el-button>
      </div>
    </div>
    
    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-button 
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          批量删除 ({{ selectedRows.length }})
        </el-button>
        <el-button 
          :disabled="selectedRows.length === 0"
          @click="handleBatchExport"
        >
          导出选中
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        <el-button @click="handleExportAll">
          <el-icon><Download /></el-icon>
          导出全部
        </el-button>
      </div>
    </div>
    
    <el-table-v2
      ref="tableRef"
      :columns="columns"
      :data="filteredData"
      :width="1200"
      :height="600"
      :loading="loading"
      :sort-by="sortBy"
      :sort-state="sortState"
      @column-sort="onSort"
      @row-click="handleRowClick"
      fixed
      class="data-table"
    />
    
    <!-- 用户详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增用户' : '编辑用户'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" :min="18" :max="65" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" style="width: 100%">
            <el-option label="技术部" value="技术部" />
            <el-option label="销售部" value="销售部" />
            <el-option label="市场部" value="市场部" />
            <el-option label="人事部" value="人事部" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">活跃</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, h, nextTick } from 'vue'
import { 
  ElButton, ElTag, ElCheckbox, ElMessage, ElMessageBox,
  ElIcon
} from 'element-plus'
import { 
  Search, Plus, Refresh, Download, Edit, Delete 
} from '@element-plus/icons-vue'

const tableRef = ref()
const formRef = ref()
const loading = ref(false)
const dialogVisible = ref(false)
const dialogMode = ref('add')
const selectedRows = ref([])
const searchKeyword = ref('')
const filterDepartment = ref('')
const sortBy = ref({ key: 'id', order: 'asc' })
const sortState = ref({})

const formData = ref({
  id: null,
  name: '',
  email: '',
  age: 25,
  department: '',
  position: '',
  status: 'active'
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }]
}

const columns = ref([
  {
    key: 'selection',
    width: 50,
    cellRenderer: ({ rowData }) => {
      return h(ElCheckbox, {
        modelValue: selectedRows.value.some(row => row.id === rowData.id),
        onChange: (checked) => {
          if (checked) {
            if (!selectedRows.value.some(row => row.id === rowData.id)) {
              selectedRows.value.push(rowData)
            }
          } else {
            const index = selectedRows.value.findIndex(row => row.id === rowData.id)
            if (index > -1) {
              selectedRows.value.splice(index, 1)
            }
          }
        }
      })
    },
    headerCellRenderer: () => {
      const allSelected = filteredData.value.length > 0 && 
        selectedRows.value.length === filteredData.value.length
      const indeterminate = selectedRows.value.length > 0 && 
        selectedRows.value.length < filteredData.value.length
      
      return h(ElCheckbox, {
        modelValue: allSelected,
        indeterminate,
        onChange: (checked) => {
          if (checked) {
            selectedRows.value = [...filteredData.value]
          } else {
            selectedRows.value = []
          }
        }
      })
    }
  },
  {
    key: 'id',
    title: 'ID',
    dataKey: 'id',
    width: 80,
    sortable: true,
    fixed: 'left'
  },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 120,
    sortable: true,
    fixed: 'left'
  },
  {
    key: 'email',
    title: '邮箱',
    dataKey: 'email',
    width: 200,
    sortable: true
  },
  {
    key: 'age',
    title: '年龄',
    dataKey: 'age',
    width: 80,
    sortable: true
  },
  {
    key: 'department',
    title: '部门',
    dataKey: 'department',
    width: 100,
    sortable: true
  },
  {
    key: 'position',
    title: '职位',
    dataKey: 'position',
    width: 120,
    sortable: true
  },
  {
    key: 'status',
    title: '状态',
    dataKey: 'status',
    width: 100,
    cellRenderer: ({ cellData }) => {
      const tagType = cellData === 'active' ? 'success' : 'danger'
      const tagText = cellData === 'active' ? '活跃' : '禁用'
      return h(ElTag, { type: tagType, size: 'small' }, () => tagText)
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    dataKey: 'createTime',
    width: 160,
    sortable: true
  },
  {
    key: 'actions',
    title: '操作',
    width: 150,
    fixed: 'right',
    cellRenderer: ({ rowData }) => {
      return h('div', { class: 'action-buttons' }, [
        h(ElButton, {
          size: 'small',
          type: 'primary',
          link: true,
          onClick: () => handleEdit(rowData)
        }, () => [h(ElIcon, () => h(Edit)), '编辑']),
        h(ElButton, {
          size: 'small',
          type: 'danger',
          link: true,
          onClick: () => handleDelete(rowData)
        }, () => [h(ElIcon, () => h(Delete)), '删除'])
      ])
    }
  }
])

// 生成测试数据
const rawData = ref(
  Array.from({ length: 50000 }, (_, index) => {
    const departments = ['技术部', '销售部', '市场部', '人事部']
    const positions = ['工程师', '经理', '主管', '专员', '总监']
    const statuses = ['active', 'inactive']
    
    return {
      id: index + 1,
      name: `用户${String(index + 1).padStart(5, '0')}`,
      email: `user${index + 1}@company.com`,
      age: Math.floor(Math.random() * 40) + 22,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 19).replace('T', ' ')
    }
  })
)

const filteredData = computed(() => {
  let result = rawData.value
  
  // 搜索过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) ||
      item.email.toLowerCase().includes(keyword)
    )
  }
  
  // 部门过滤
  if (filterDepartment.value) {
    result = result.filter(item => item.department === filterDepartment.value)
  }
  
  // 排序
  if (sortBy.value.key) {
    result = [...result].sort((a, b) => {
      const aVal = a[sortBy.value.key]
      const bVal = b[sortBy.value.key]
      
      let compareResult = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        compareResult = aVal - bVal
      } else {
        compareResult = String(aVal).localeCompare(String(bVal))
      }
      
      return sortBy.value.order === 'desc' ? -compareResult : compareResult
    })
  }
  
  return result
})

const totalCount = computed(() => filteredData.value.length)

const handleSearch = () => {
  selectedRows.value = []
}

const handleFilter = () => {
  selectedRows.value = []
}

const onSort = ({ key, order }) => {
  sortBy.value = { key, order }
  sortState.value = { [key]: order }
}

const handleRowClick = (event) => {
  console.log('行点击:', event)
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = {
    id: null,
    name: '',
    email: '',
    age: 25,
    department: '',
    position: '',
    status: 'active'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
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
    
    // 模拟删除操作
    const index = rawData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      rawData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟批量删除
    const selectedIds = selectedRows.value.map(row => row.id)
    rawData.value = rawData.value.filter(item => !selectedIds.includes(item.id))
    selectedRows.value = []
    ElMessage.success(`成功删除 ${selectedIds.length} 个用户`)
  } catch {
    // 用户取消删除
  }
}

const handleBatchExport = () => {
  ElMessage.success(`导出 ${selectedRows.value.length} 条数据`)
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据刷新成功')
  }, 1000)
}

const handleExportAll = () => {
  ElMessage.success(`导出全部 ${totalCount.value} 条数据`)
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    if (dialogMode.value === 'add') {
      // 新增用户
      const newId = Math.max(...rawData.value.map(item => item.id)) + 1
      const newUser = {
        ...formData.value,
        id: newId,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      rawData.value.unshift(newUser)
      ElMessage.success('新增用户成功')
    } else {
      // 编辑用户
      const index = rawData.value.findIndex(item => item.id === formData.value.id)
      if (index > -1) {
        rawData.value[index] = { ...formData.value }
        ElMessage.success('编辑用户成功')
      }
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.data-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left h3 {
  margin: 0 0 4px 0;
  color: #303133;
}

.data-count {
  color: #909399;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.data-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

:deep(.el-table-v2__header-cell) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-table-v2__row:hover) {
  background-color: #f5f7fa;
}
</style>
```

### 实时数据监控表格

```vue
<template>
  <div class="monitoring-dashboard">
    <div class="dashboard-header">
      <h2>实时数据监控</h2>
      <div class="status-indicators">
        <el-tag :type="connectionStatus === 'connected' ? 'success' : 'danger'">
          {{ connectionStatus === 'connected' ? '已连接' : '连接断开' }}
        </el-tag>
        <span class="update-time">最后更新: {{ lastUpdateTime }}</span>
      </div>
    </div>
    
    <div class="metrics-cards">
      <div class="metric-card">
        <div class="metric-value">{{ totalServers }}</div>
        <div class="metric-label">服务器总数</div>
      </div>
      <div class="metric-card">
        <div class="metric-value online">{{ onlineServers }}</div>
        <div class="metric-label">在线服务器</div>
      </div>
      <div class="metric-card">
        <div class="metric-value warning">{{ warningServers }}</div>
        <div class="metric-label">警告服务器</div>
      </div>
      <div class="metric-card">
        <div class="metric-value error">{{ errorServers }}</div>
        <div class="metric-label">故障服务器</div>
      </div>
    </div>
    
    <el-table-v2
      :columns="columns"
      :data="serverData"
      :width="1400"
      :height="500"
      :sort-by="sortBy"
      :sort-state="sortState"
      @column-sort="onSort"
      fixed
      class="monitoring-table"
    />
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onUnmounted } from 'vue'
import { ElTag, ElProgress, ElIcon } from 'element-plus'
import { Warning, CircleCheck, CircleClose } from '@element-plus/icons-vue'

const connectionStatus = ref('connected')
const lastUpdateTime = ref('')
const sortBy = ref({ key: 'id', order: 'asc' })
const sortState = ref({})
let updateTimer = null

const columns = ref([
  {
    key: 'id',
    title: '服务器ID',
    dataKey: 'id',
    width: 100,
    sortable: true,
    fixed: 'left'
  },
  {
    key: 'name',
    title: '服务器名称',
    dataKey: 'name',
    width: 150,
    sortable: true,
    fixed: 'left'
  },
  {
    key: 'status',
    title: '状态',
    dataKey: 'status',
    width: 100,
    cellRenderer: ({ cellData }) => {
      const statusConfig = {
        online: { type: 'success', text: '在线', icon: CircleCheck },
        warning: { type: 'warning', text: '警告', icon: Warning },
        error: { type: 'danger', text: '故障', icon: CircleClose },
        offline: { type: 'info', text: '离线', icon: CircleClose }
      }
      const config = statusConfig[cellData] || statusConfig.offline
      
      return h('div', { style: 'display: flex; align-items: center; gap: 4px' }, [
        h(ElIcon, { style: `color: var(--el-color-${config.type})` }, () => h(config.icon)),
        h(ElTag, { type: config.type, size: 'small' }, () => config.text)
      ])
    }
  },
  {
    key: 'cpu',
    title: 'CPU使用率',
    dataKey: 'cpu',
    width: 150,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const percentage = Math.round(cellData)
      const status = percentage > 80 ? 'exception' : percentage > 60 ? 'warning' : 'success'
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h(ElProgress, {
          percentage,
          status,
          strokeWidth: 8,
          showText: false,
          style: 'flex: 1'
        }),
        h('span', { style: 'font-weight: 500; min-width: 35px' }, `${percentage}%`)
      ])
    }
  },
  {
    key: 'memory',
    title: '内存使用率',
    dataKey: 'memory',
    width: 150,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const percentage = Math.round(cellData)
      const status = percentage > 85 ? 'exception' : percentage > 70 ? 'warning' : 'success'
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h(ElProgress, {
          percentage,
          status,
          strokeWidth: 8,
          showText: false,
          style: 'flex: 1'
        }),
        h('span', { style: 'font-weight: 500; min-width: 35px' }, `${percentage}%`)
      ])
    }
  },
  {
    key: 'disk',
    title: '磁盘使用率',
    dataKey: 'disk',
    width: 150,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const percentage = Math.round(cellData)
      const status = percentage > 90 ? 'exception' : percentage > 75 ? 'warning' : 'success'
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h(ElProgress, {
          percentage,
          status,
          strokeWidth: 8,
          showText: false,
          style: 'flex: 1'
        }),
        h('span', { style: 'font-weight: 500; min-width: 35px' }, `${percentage}%`)
      ])
    }
  },
  {
    key: 'network',
    title: '网络流量',
    dataKey: 'network',
    width: 120,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const { inbound, outbound } = cellData
      return h('div', { style: 'font-size: 12px' }, [
        h('div', { style: 'color: #67c23a' }, `↓ ${inbound} MB/s`),
        h('div', { style: 'color: #e6a23c' }, `↑ ${outbound} MB/s`)
      ])
    }
  },
  {
    key: 'uptime',
    title: '运行时间',
    dataKey: 'uptime',
    width: 120,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const days = Math.floor(cellData / 24)
      const hours = cellData % 24
      return h('span', { style: 'font-family: monospace' }, `${days}d ${hours}h`)
    }
  },
  {
    key: 'location',
    title: '位置',
    dataKey: 'location',
    width: 120,
    sortable: true
  },
  {
    key: 'lastCheck',
    title: '最后检查',
    dataKey: 'lastCheck',
    width: 160,
    sortable: true,
    cellRenderer: ({ cellData }) => {
      const now = Date.now()
      const checkTime = new Date(cellData).getTime()
      const diff = now - checkTime
      const minutes = Math.floor(diff / 60000)
      
      let color = '#67c23a'
      if (minutes > 5) color = '#e6a23c'
      if (minutes > 10) color = '#f56c6c'
      
      return h('span', { style: `color: ${color}` }, 
        minutes < 1 ? '刚刚' : `${minutes}分钟前`
      )
    }
  }
])

const serverData = ref([])

// 生成初始服务器数据
const generateServerData = () => {
  const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都']
  const statuses = ['online', 'warning', 'error', 'offline']
  const weights = [0.7, 0.15, 0.1, 0.05] // 状态权重
  
  return Array.from({ length: 200 }, (_, index) => {
    // 根据权重随机选择状态
    const random = Math.random()
    let status = 'online'
    let cumulative = 0
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i]
      if (random <= cumulative) {
        status = statuses[i]
        break
      }
    }
    
    return {
      id: `SRV-${String(index + 1).padStart(3, '0')}`,
      name: `服务器-${index + 1}`,
      status,
      cpu: status === 'error' ? Math.random() * 20 + 80 : 
           status === 'warning' ? Math.random() * 30 + 60 :
           Math.random() * 60,
      memory: status === 'error' ? Math.random() * 15 + 85 : 
              status === 'warning' ? Math.random() * 25 + 70 :
              Math.random() * 70,
      disk: status === 'error' ? Math.random() * 10 + 90 : 
            status === 'warning' ? Math.random() * 20 + 75 :
            Math.random() * 75,
      network: {
        inbound: (Math.random() * 100).toFixed(1),
        outbound: (Math.random() * 50).toFixed(1)
      },
      uptime: Math.floor(Math.random() * 8760), // 小时
      location: locations[Math.floor(Math.random() * locations.length)],
      lastCheck: new Date(Date.now() - Math.random() * 600000).toISOString() // 最近10分钟内
    }
  })
}

// 更新服务器数据
const updateServerData = () => {
  serverData.value = serverData.value.map(server => {
    // 随机更新一些服务器的状态
    if (Math.random() < 0.1) { // 10%的概率更新
      const statuses = ['online', 'warning', 'error']
      const weights = [0.8, 0.15, 0.05]
      
      const random = Math.random()
      let newStatus = 'online'
      let cumulative = 0
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i]
        if (random <= cumulative) {
          newStatus = statuses[i]
          break
        }
      }
      
      return {
        ...server,
        status: newStatus,
        cpu: newStatus === 'error' ? Math.random() * 20 + 80 : 
             newStatus === 'warning' ? Math.random() * 30 + 60 :
             Math.random() * 60,
        memory: newStatus === 'error' ? Math.random() * 15 + 85 : 
                newStatus === 'warning' ? Math.random() * 25 + 70 :
                Math.random() * 70,
        network: {
          inbound: (Math.random() * 100).toFixed(1),
          outbound: (Math.random() * 50).toFixed(1)
        },
        lastCheck: new Date().toISOString()
      }
    }
    return server
  })
  
  lastUpdateTime.value = new Date().toLocaleTimeString()
}

const totalServers = computed(() => serverData.value.length)
const onlineServers = computed(() => 
  serverData.value.filter(s => s.status === 'online').length
)
const warningServers = computed(() => 
  serverData.value.filter(s => s.status === 'warning').length
)
const errorServers = computed(() => 
  serverData.value.filter(s => s.status === 'error').length
)

const onSort = ({ key, order }) => {
  sortBy.value = { key, order }
  sortState.value = { [key]: order }
}

onMounted(() => {
  serverData.value = generateServerData()
  lastUpdateTime.value = new Date().toLocaleTimeString()
  
  // 每5秒更新一次数据
  updateTimer = setInterval(updateServerData, 5000)
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped>
.monitoring-dashboard {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-header h2 {
  margin: 0;
  color: #303133;
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 16px;
}

.update-time {
  color: #909399;
  font-size: 14px;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.metric-value.online {
  color: #67c23a;
}

.metric-value.warning {
  color: #e6a23c;
}

.metric-value.error {
  color: #f56c6c;
}

.metric-label {
  color: #909399;
  font-size: 14px;
}

.monitoring-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-table-v2__header-cell) {
  background-color: #fafafa;
  font-weight: 600;
  border-bottom: 2px solid #e4e7ed;
}

:deep(.el-table-v2__row:hover) {
  background-color: #f5f7fa;
}
</style>
```

## API 文档

### Table Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| columns | 列配置 | `Column[]` | `[]` |
| data | 表格数据 | `any[]` | `[]` |
| width | 表格宽度 | `number` | — |
| height | 表格高度 | `number` | — |
| fixed | 是否固定表格 | `boolean` | `false` |
| row-height | 行高 | `number` | `50` |
| header-height | 表头高度 | `number` | `50` |
| estimated-row-height | 预估行高 | `number` | — |
| cache | 缓存行数 | `number` | `2` |
| sort-by | 排序配置 | `SortBy` | — |
| sort-state | 排序状态 | `SortState` | `{}` |

### Table Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| row-click | 行点击事件 | `(event)` |
| row-select | 行选择事件 | `(selected, row)` |
| select-all | 全选事件 | `(selected)` |
| column-sort | 列排序事件 | `({ key, order })` |
| scroll | 滚动事件 | `(event)` |

### Table Exposes

| 方法名 | 说明 | 参数 |
|--------|------|------|
| scrollTo | 滚动到指定位置 | `(options)` |
| scrollToRow | 滚动到指定行 | `(rowIndex, align?)` |
| scrollToTop | 滚动到顶部 | — |
| scrollToBottom | 滚动到底部 | — |

### Column 类型定义

```typescript
interface Column {
  key: string
  title?: string
  dataKey?: string
  width: number
  minWidth?: number
  maxWidth?: number
  fixed?: 'left' | 'right'
  sortable?: boolean
  resizable?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  cellRenderer?: (props: CellRendererProps) => VNode
  headerCellRenderer?: (props: HeaderCellRendererProps) => VNode
}

interface CellRendererProps {
  cellData: any
  rowData: any
  rowIndex: number
  column: Column
}

interface HeaderCellRendererProps {
  column: Column
  columnIndex: number
}
```

### SortBy 类型定义

```typescript
interface SortBy {
  key: string
  order: 'asc' | 'desc'
}

type SortState = Record<string, 'asc' | 'desc'>
```

## 最佳实践

### 性能优化

1. **合理设置行高**：固定行高能获得最佳性能
2. **控制列数量**：避免过多列导致水平滚动性能问题
3. **优化渲染函数**：避免在 cellRenderer 中进行复杂计算
4. **使用缓存**：合理设置 cache 属性缓存行数

### 数据处理

1. **分页加载**：对于超大数据集，建议结合分页
2. **虚拟滚动**：利用虚拟滚动处理大量数据
3. **数据预处理**：在数据传入前进行格式化和计算
4. **避免频繁更新**：使用防抖或节流控制数据更新频率

### 用户体验

1. **加载状态**：显示加载状态提升用户体验
2. **错误处理**：优雅处理数据加载错误
3. **响应式设计**：适配不同屏幕尺寸
4. **键盘导航**：支持键盘操作提升可访问性

### 内存管理

1. **及时清理**：组件销毁时清理定时器和事件监听
2. **避免内存泄漏**：注意闭包和循环引用
3. **合理缓存**：平衡性能和内存使用

## 常见问题

### 表格不显示数据

**问题**：设置了 data 但表格不显示内容

**解决方案**：
1. 检查 columns 配置是否正确
2. 确认 dataKey 与数据字段匹配
3. 检查表格宽高设置

```vue
<!-- 错误示例 -->
<el-table-v2 :columns="columns" :data="data" />

<!-- 正确示例 -->
<el-table-v2 
  :columns="columns" 
  :data="data" 
  :width="800" 
  :height="400" 
/>
```

### 自定义渲染不生效

**问题**：cellRenderer 函数不执行或显示异常

**解决方案**：确保返回有效的 VNode

```javascript
// 错误示例
cellRenderer: ({ cellData }) => cellData

// 正确示例
cellRenderer: ({ cellData }) => h('span', cellData)
```

### 性能问题

**问题**：大量数据时滚动卡顿

**解决方案**：
1. 设置固定行高提升性能
2. 减少 cellRenderer 中的复杂计算
3. 使用 memo 优化渲染函数
4. 合理设置缓存行数

```javascript
// 优化示例
const cellRenderer = useMemo(() => ({ cellData }) => {
  return h('span', cellData)
}, [])
```

### 固定列不生效

**问题**：设置了 fixed 但列没有固定

**解决方案**：确保表格有固定宽度

```vue
<!-- 错误示例 -->
<el-table-v2 :columns="columns" :data="data" />

<!-- 正确示例 -->
<el-table-v2 
  :columns="columns" 
  :data="data" 
  :width="800" 
  fixed 
/>
```

### 排序不生效

**问题**：点击列头排序没有反应

**解决方案**：
1. 确保列配置了 `sortable: true`
2. 监听 `column-sort` 事件
3. 更新数据排序

```javascript
const onSort = ({ key, order }) => {
  // 更新排序状态
  sortBy.value = { key, order }
  // 重新排序数据
  data.value = sortData(data.value, key, order)
}
```

## 总结

Virtualized Table 虚拟化表格是处理大量数据的理想选择，通过虚拟滚动技术实现了卓越的性能表现。掌握其核心特性和最佳实践，能够帮助你构建高效、流畅的数据展示界面。

### 核心优势

- **高性能**：虚拟滚动技术，支持数万条数据流畅展示
- **灵活定制**：丰富的自定义渲染选项
- **功能完整**：支持排序、选择、固定列等常用功能
- **易于使用**：简洁的 API 设计，快速上手

### 适用场景

- 大数据量表格展示
- 实时数据监控面板
- 数据管理后台
- 报表系统

通过合理的配置和优化，Virtualized Table 能够为你的应用提供出色的数据展示体验。

## 参考资料

- [Element Plus Virtualized Table 官方文档](https://element-plus.org/zh-CN/component/table-v2.html)
- [Vue 3 渲染函数文档](https://cn.vuejs.org/guide/extras/render-function.html)
- [虚拟滚动原理解析](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Virtual_scrolling)