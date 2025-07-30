# Virtualized Select 虚拟化选择器

## 概述

Virtualized Select 虚拟化选择器是 Element Plus 提供的高性能选择器组件，专门用于处理大量数据的选择场景。通过虚拟滚动技术，它可以高效渲染数万条数据而不会造成性能问题，为用户提供流畅的交互体验。

### 主要特性

- **虚拟滚动**：只渲染可见区域的选项，支持大量数据
- **高性能**：优化的渲染机制，避免 DOM 节点过多
- **多选支持**：支持单选和多选模式
- **过滤搜索**：内置搜索过滤功能
- **自定义模板**：支持自定义选项和标签模板
- **远程搜索**：支持异步数据加载
- **分组显示**：支持选项分组展示
- **标签管理**：多选时的标签折叠和管理

### 适用场景

- **大数据选择**：需要从数千或数万条数据中选择
- **用户选择器**：企业级应用的用户/部门选择
- **商品选择**：电商系统的商品选择器
- **地区选择**：多级地区选择器
- **标签管理**：内容管理系统的标签选择
- **数据筛选**：报表系统的筛选条件选择

## 学习目标

- 掌握 Virtualized Select 的基本概念和使用场景
- 学会基础选择器功能的实现
- 了解虚拟滚动的性能优势
- 掌握多选和标签管理功能
- 学会自定义选项模板
- 了解远程搜索和数据加载
- 掌握 API 的完整使用方法

## 基础用法

### 基本选择器

最简单的虚拟化选择器：

```vue
<template>
  <div>
    <h4>基础用法</h4>
    <el-select-v2
      v-model="value"
      :options="options"
      placeholder="请选择"
      style="width: 240px"
    />
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

// 生成大量选项数据
const options = Array.from({ length: 10000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))
</script>
```

### 多选模式

支持选择多个选项：

```vue
<template>
  <div>
    <h4>多选模式</h4>
    <el-select-v2
      v-model="multipleValue"
      :options="options"
      placeholder="请选择多个选项"
      multiple
      style="width: 240px"
    />
    <p>选中的值：{{ multipleValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const multipleValue = ref([])

const options = Array.from({ length: 5000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))
</script>
```

### 不同尺寸

使用 `size` 属性改变选择器大小：

```vue
<template>
  <div>
    <h4>不同尺寸</h4>
    
    <div style="margin-bottom: 20px;">
      <span>Large: </span>
      <el-select-v2
        v-model="value1"
        :options="options"
        placeholder="请选择"
        size="large"
        style="width: 240px"
      />
    </div>
    
    <div style="margin-bottom: 20px;">
      <span>Default: </span>
      <el-select-v2
        v-model="value2"
        :options="options"
        placeholder="请选择"
        style="width: 240px"
      />
    </div>
    
    <div>
      <span>Small: </span>
      <el-select-v2
        v-model="value3"
        :options="options"
        placeholder="请选择"
        size="small"
        style="width: 240px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')

const options = Array.from({ length: 1000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))
</script>
```

## 高级功能

### 标签折叠

多选时折叠显示标签：

```vue
<template>
  <div>
    <h4>标签折叠</h4>
    
    <div style="margin-bottom: 20px;">
      <span>使用 collapse-tags: </span>
      <el-select-v2
        v-model="collapseValue"
        :options="options"
        placeholder="请选择"
        multiple
        collapse-tags
        style="width: 240px"
      />
    </div>
    
    <div style="margin-bottom: 20px;">
      <span>使用 collapse-tags-tooltip: </span>
      <el-select-v2
        v-model="tooltipValue"
        :options="options"
        placeholder="请选择"
        multiple
        collapse-tags
        collapse-tags-tooltip
        style="width: 240px"
      />
    </div>
    
    <div>
      <span>使用 max-collapse-tags: </span>
      <el-select-v2
        v-model="maxValue"
        :options="options"
        placeholder="请选择"
        multiple
        :max-collapse-tags="3"
        style="width: 240px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const collapseValue = ref([])
const tooltipValue = ref([])
const maxValue = ref([])

const options = Array.from({ length: 1000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))
</script>
```

### 可过滤搜索

启用搜索过滤功能：

```vue
<template>
  <div>
    <h4>可过滤搜索</h4>
    <el-select-v2
      v-model="filterValue"
      :options="options"
      placeholder="请输入关键词搜索"
      filterable
      style="width: 240px"
    />
    <p>选中的值：{{ filterValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterValue = ref('')

const options = Array.from({ length: 10000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1} - 这是一个很长的选项描述`
}))
</script>
```

### 禁用状态

禁用选择器或特定选项：

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    
    <div style="margin-bottom: 20px;">
      <span>禁用选择器: </span>
      <el-select-v2
        v-model="disabledValue"
        :options="options"
        placeholder="禁用状态"
        disabled
        style="width: 240px"
      />
    </div>
    
    <div>
      <span>禁用部分选项: </span>
      <el-select-v2
        v-model="partialDisabledValue"
        :options="optionsWithDisabled"
        placeholder="请选择"
        style="width: 240px"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const disabledValue = ref('')
const partialDisabledValue = ref('')

const options = Array.from({ length: 100 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))

const optionsWithDisabled = Array.from({ length: 100 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`,
  disabled: index % 10 === 0 // 每10个选项禁用一个
}))
</script>
```

### 选项分组

对选项进行分组显示：

```vue
<template>
  <div>
    <h4>选项分组</h4>
    <el-select-v2
      v-model="groupValue"
      :options="groupOptions"
      placeholder="请选择"
      style="width: 240px"
    />
    <p>选中的值：{{ groupValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const groupValue = ref('')

const groupOptions = [
  {
    label: '前端技术',
    options: [
      { value: 'vue', label: 'Vue.js' },
      { value: 'react', label: 'React' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' }
    ]
  },
  {
    label: '后端技术',
    options: [
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
      { value: 'go', label: 'Go' }
    ]
  },
  {
    label: '数据库',
    options: [
      { value: 'mysql', label: 'MySQL' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'redis', label: 'Redis' },
      { value: 'postgresql', label: 'PostgreSQL' }
    ]
  }
]
</script>
```

### 一键清除

支持清除所有选中的选项：

```vue
<template>
  <div>
    <h4>一键清除</h4>
    
    <div style="margin-bottom: 20px;">
      <span>单选清除: </span>
      <el-select-v2
        v-model="clearValue1"
        :options="options"
        placeholder="请选择"
        clearable
        style="width: 240px"
        @clear="handleClear"
      />
    </div>
    
    <div>
      <span>多选清除: </span>
      <el-select-v2
        v-model="clearValue2"
        :options="options"
        placeholder="请选择"
        multiple
        clearable
        style="width: 240px"
        @clear="handleClear"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const clearValue1 = ref('')
const clearValue2 = ref([])

const options = Array.from({ length: 1000 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))

const handleClear = () => {
  ElMessage.info('已清除选择')
}
</script>
```

## 自定义模板

### 自定义选项模板

自定义选项的显示内容：

```vue
<template>
  <div>
    <h4>自定义选项模板</h4>
    <el-select-v2
      v-model="customValue"
      :options="customOptions"
      placeholder="请选择用户"
      style="width: 300px"
    >
      <template #default="{ item }">
        <div class="custom-option">
          <img :src="item.avatar" :alt="item.label" class="avatar" />
          <div class="info">
            <div class="name">{{ item.label }}</div>
            <div class="email">{{ item.email }}</div>
          </div>
          <el-tag :type="item.status === 'online' ? 'success' : 'info'" size="small">
            {{ item.status === 'online' ? '在线' : '离线' }}
          </el-tag>
        </div>
      </template>
    </el-select-v2>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customValue = ref('')

const customOptions = Array.from({ length: 1000 }, (_, index) => ({
  value: `user_${index}`,
  label: `用户 ${index + 1}`,
  email: `user${index + 1}@example.com`,
  avatar: `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`,
  status: index % 3 === 0 ? 'online' : 'offline'
}))
</script>

<style scoped>
.custom-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-weight: 500;
  color: #303133;
}

.email {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
```

### 自定义标签模板

自定义多选时标签的显示：

```vue
<template>
  <div>
    <h4>自定义标签模板</h4>
    <el-select-v2
      v-model="tagValue"
      :options="tagOptions"
      placeholder="请选择技术栈"
      multiple
      style="width: 400px"
    >
      <template #tag="{ props, onClose }">
        <el-tag
          v-bind="props"
          closable
          :type="getTagType(props.value)"
          @close="onClose"
        >
          {{ getTagLabel(props.value) }}
        </el-tag>
      </template>
    </el-select-v2>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tagValue = ref([])

const tagOptions = [
  { value: 'vue', label: 'Vue.js', category: 'frontend' },
  { value: 'react', label: 'React', category: 'frontend' },
  { value: 'angular', label: 'Angular', category: 'frontend' },
  { value: 'nodejs', label: 'Node.js', category: 'backend' },
  { value: 'python', label: 'Python', category: 'backend' },
  { value: 'java', label: 'Java', category: 'backend' },
  { value: 'mysql', label: 'MySQL', category: 'database' },
  { value: 'mongodb', label: 'MongoDB', category: 'database' },
  { value: 'redis', label: 'Redis', category: 'database' }
]

const getTagType = (value) => {
  const option = tagOptions.find(opt => opt.value === value)
  if (!option) return 'info'
  
  switch (option.category) {
    case 'frontend': return 'primary'
    case 'backend': return 'success'
    case 'database': return 'warning'
    default: return 'info'
  }
}

const getTagLabel = (value) => {
  const option = tagOptions.find(opt => opt.value === value)
  return option ? option.label : value
}
</script>
```

### 自定义下拉菜单头部和底部

自定义下拉菜单的头部和底部内容：

```vue
<template>
  <div>
    <h4>自定义下拉菜单</h4>
    <el-select-v2
      v-model="menuValue"
      :options="menuOptions"
      placeholder="请选择"
      multiple
      style="width: 300px"
    >
      <template #header>
        <div class="menu-header">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索选项..."
            size="small"
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </template>
      
      <template #footer>
        <div class="menu-footer">
          <el-button size="small" @click="selectAll">全选</el-button>
          <el-button size="small" @click="clearAll">清空</el-button>
          <span class="count">共 {{ filteredOptions.length }} 项</span>
        </div>
      </template>
    </el-select-v2>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

const menuValue = ref([])
const searchKeyword = ref('')

const allOptions = Array.from({ length: 100 }, (_, index) => ({
  value: `option_${index}`,
  label: `选项 ${index + 1}`
}))

const filteredOptions = computed(() => {
  if (!searchKeyword.value) return allOptions
  return allOptions.filter(option => 
    option.label.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const menuOptions = computed(() => filteredOptions.value)

const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

const selectAll = () => {
  menuValue.value = filteredOptions.value.map(option => option.value)
}

const clearAll = () => {
  menuValue.value = []
}
</script>

<style scoped>
.menu-header {
  padding: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.menu-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-top: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.count {
  font-size: 12px;
  color: #909399;
}
</style>
```

## 远程搜索

### 基础远程搜索

从服务器搜索数据：

```vue
<template>
  <div>
    <h4>远程搜索</h4>
    <el-select-v2
      v-model="remoteValue"
      :options="remoteOptions"
      placeholder="请输入关键词搜索"
      filterable
      remote
      :remote-method="remoteSearch"
      :loading="loading"
      style="width: 300px"
    />
    <p>选中的值：{{ remoteValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const remoteValue = ref('')
const remoteOptions = ref([])
const loading = ref(false)

// 模拟远程数据
const mockData = Array.from({ length: 10000 }, (_, index) => ({
  value: `remote_${index}`,
  label: `远程选项 ${index + 1}`,
  description: `这是第 ${index + 1} 个远程选项的描述`
}))

const remoteSearch = async (query) => {
  if (!query) {
    remoteOptions.value = []
    return
  }
  
  loading.value = true
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const results = mockData.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50) // 限制返回结果数量
  
  remoteOptions.value = results
  loading.value = false
}
</script>
```

### 创建临时选项

允许用户创建不在选项列表中的新选项：

```vue
<template>
  <div>
    <h4>创建临时选项</h4>
    <el-select-v2
      v-model="createValue"
      :options="createOptions"
      placeholder="输入新选项或选择现有选项"
      filterable
      allow-create
      default-first-option
      :reserve-keyword="false"
      style="width: 300px"
      @change="handleCreateChange"
    />
    <p>选中的值：{{ createValue }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const createValue = ref('')
const createOptions = ref([
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3' },
  { value: 'option4', label: '选项4' },
  { value: 'option5', label: '选项5' }
])

const handleCreateChange = (value) => {
  // 检查是否是新创建的选项
  const exists = createOptions.value.some(option => option.value === value)
  if (!exists && value) {
    ElMessage.success(`创建了新选项：${value}`)
    // 可以在这里将新选项添加到选项列表中
    createOptions.value.push({
      value: value,
      label: value
    })
  }
}
</script>
```

## 实际应用示例

### 员工选择器

企业级应用中的员工选择组件：

```vue
<template>
  <div class="employee-selector">
    <h3>员工选择器</h3>
    
    <div class="selector-container">
      <el-select-v2
        v-model="selectedEmployees"
        :options="employeeOptions"
        placeholder="搜索并选择员工"
        multiple
        filterable
        remote
        :remote-method="searchEmployees"
        :loading="loading"
        collapse-tags
        collapse-tags-tooltip
        :max-collapse-tags="3"
        clearable
        style="width: 100%"
        @change="handleEmployeeChange"
      >
        <template #default="{ item }">
          <div class="employee-option">
            <img :src="item.avatar" :alt="item.label" class="employee-avatar" />
            <div class="employee-info">
              <div class="employee-name">{{ item.label }}</div>
              <div class="employee-details">
                <span class="department">{{ item.department }}</span>
                <span class="position">{{ item.position }}</span>
              </div>
            </div>
            <div class="employee-status">
              <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
                {{ item.status === 'active' ? '在职' : '离职' }}
              </el-tag>
            </div>
          </div>
        </template>
        
        <template #tag="{ props, onClose }">
          <el-tag
            v-bind="props"
            closable
            type="primary"
            @close="onClose"
          >
            {{ getEmployeeName(props.value) }}
          </el-tag>
        </template>
        
        <template #header>
          <div class="selector-header">
            <div class="search-tips">
              <el-icon><InfoFilled /></el-icon>
              <span>支持按姓名、部门、职位搜索</span>
            </div>
          </div>
        </template>
        
        <template #footer>
          <div class="selector-footer">
            <span class="result-count">找到 {{ employeeOptions.length }} 名员工</span>
            <el-button size="small" @click="clearSelection">清空选择</el-button>
          </div>
        </template>
      </el-select-v2>
    </div>
    
    <div v-if="selectedEmployees.length > 0" class="selected-employees">
      <h4>已选择的员工 ({{ selectedEmployees.length }})</h4>
      <div class="employee-list">
        <div
          v-for="employeeId in selectedEmployees"
          :key="employeeId"
          class="employee-card"
        >
          <img :src="getEmployeeById(employeeId)?.avatar" class="card-avatar" />
          <div class="card-info">
            <h5>{{ getEmployeeById(employeeId)?.label }}</h5>
            <p>{{ getEmployeeById(employeeId)?.department }} - {{ getEmployeeById(employeeId)?.position }}</p>
            <p class="email">{{ getEmployeeById(employeeId)?.email }}</p>
          </div>
          <el-button
            size="small"
            type="danger"
            @click="removeEmployee(employeeId)"
          >
            移除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const selectedEmployees = ref([])
const employeeOptions = ref([])
const loading = ref(false)
const allEmployees = ref([])

// 模拟员工数据
const generateEmployees = () => {
  const departments = ['技术部', '产品部', '设计部', '运营部', '市场部', '人事部', '财务部']
  const positions = ['工程师', '高级工程师', '技术专家', '经理', '总监', '专员', '主管']
  
  return Array.from({ length: 5000 }, (_, index) => ({
    value: `emp_${index}`,
    label: `员工${index + 1}`,
    email: `employee${index + 1}@company.com`,
    department: departments[index % departments.length],
    position: positions[index % positions.length],
    status: index % 10 === 0 ? 'inactive' : 'active',
    avatar: `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`
  }))
}

allEmployees.value = generateEmployees()

const searchEmployees = async (query) => {
  if (!query) {
    employeeOptions.value = allEmployees.value.slice(0, 50)
    return
  }
  
  loading.value = true
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const searchQuery = query.toLowerCase()
  const results = allEmployees.value.filter(emp => 
    emp.label.toLowerCase().includes(searchQuery) ||
    emp.department.toLowerCase().includes(searchQuery) ||
    emp.position.toLowerCase().includes(searchQuery) ||
    emp.email.toLowerCase().includes(searchQuery)
  ).slice(0, 100)
  
  employeeOptions.value = results
  loading.value = false
}

const getEmployeeName = (employeeId) => {
  const employee = allEmployees.value.find(emp => emp.value === employeeId)
  return employee ? employee.label : employeeId
}

const getEmployeeById = (employeeId) => {
  return allEmployees.value.find(emp => emp.value === employeeId)
}

const handleEmployeeChange = (value) => {
  ElMessage.success(`已选择 ${value.length} 名员工`)
}

const removeEmployee = (employeeId) => {
  const index = selectedEmployees.value.indexOf(employeeId)
  if (index > -1) {
    selectedEmployees.value.splice(index, 1)
    ElMessage.info('已移除员工')
  }
}

const clearSelection = () => {
  selectedEmployees.value = []
  ElMessage.info('已清空选择')
}

// 初始化显示一些员工
searchEmployees('')
</script>

<style scoped>
.employee-selector {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.selector-container {
  margin-bottom: 24px;
}

.employee-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.employee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.employee-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.employee-status {
  margin-left: auto;
}

.selector-header {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.search-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
}

.selector-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.result-count {
  font-size: 12px;
  color: #909399;
}

.selected-employees {
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.selected-employees h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.employee-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.employee-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.card-info {
  flex: 1;
}

.card-info h5 {
  margin: 0 0 4px 0;
  color: #303133;
}

.card-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #606266;
}

.email {
  color: #909399 !important;
}
</style>
```

### 商品选择器

电商系统中的商品选择组件：

```vue
<template>
  <div class="product-selector">
    <h3>商品选择器</h3>
    
    <div class="filters">
      <el-select
        v-model="categoryFilter"
        placeholder="选择分类"
        clearable
        style="width: 150px; margin-right: 12px;"
        @change="handleCategoryChange"
      >
        <el-option
          v-for="category in categories"
          :key="category.value"
          :label="category.label"
          :value="category.value"
        />
      </el-select>
      
      <el-select
        v-model="priceFilter"
        placeholder="价格范围"
        clearable
        style="width: 150px;"
        @change="handlePriceChange"
      >
        <el-option label="0-100" value="0-100" />
        <el-option label="100-500" value="100-500" />
        <el-option label="500-1000" value="500-1000" />
        <el-option label="1000+" value="1000+" />
      </el-select>
    </div>
    
    <div class="selector-container">
      <el-select-v2
        v-model="selectedProducts"
        :options="filteredProducts"
        placeholder="搜索商品名称、SKU或描述"
        multiple
        filterable
        remote
        :remote-method="searchProducts"
        :loading="loading"
        collapse-tags
        :max-collapse-tags="2"
        clearable
        style="width: 100%"
        @change="handleProductChange"
      >
        <template #default="{ item }">
          <div class="product-option">
            <img :src="item.image" :alt="item.label" class="product-image" />
            <div class="product-info">
              <div class="product-name">{{ item.label }}</div>
              <div class="product-details">
                <span class="sku">SKU: {{ item.sku }}</span>
                <span class="category">{{ item.category }}</span>
              </div>
              <div class="product-price">¥{{ item.price }}</div>
            </div>
            <div class="product-stock">
              <el-tag :type="item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'danger'" size="small">
                库存: {{ item.stock }}
              </el-tag>
            </div>
          </div>
        </template>
        
        <template #footer>
          <div class="selector-footer">
            <span class="result-count">找到 {{ filteredProducts.length }} 个商品</span>
            <span class="total-value">总价值: ¥{{ totalValue }}</span>
          </div>
        </template>
      </el-select-v2>
    </div>
    
    <div v-if="selectedProducts.length > 0" class="selected-products">
      <h4>已选择的商品 ({{ selectedProducts.length }})</h4>
      <div class="product-summary">
        <div class="summary-item">
          <span class="label">总数量:</span>
          <span class="value">{{ selectedProducts.length }} 件</span>
        </div>
        <div class="summary-item">
          <span class="label">总价值:</span>
          <span class="value">¥{{ totalValue }}</span>
        </div>
      </div>
      
      <div class="product-list">
        <div
          v-for="productId in selectedProducts"
          :key="productId"
          class="product-card"
        >
          <img :src="getProductById(productId)?.image" class="card-image" />
          <div class="card-info">
            <h5>{{ getProductById(productId)?.label }}</h5>
            <p>SKU: {{ getProductById(productId)?.sku }}</p>
            <p>分类: {{ getProductById(productId)?.category }}</p>
            <div class="price-stock">
              <span class="price">¥{{ getProductById(productId)?.price }}</span>
              <span class="stock">库存: {{ getProductById(productId)?.stock }}</span>
            </div>
          </div>
          <el-button
            size="small"
            type="danger"
            @click="removeProduct(productId)"
          >
            移除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const selectedProducts = ref([])
const filteredProducts = ref([])
const loading = ref(false)
const categoryFilter = ref('')
const priceFilter = ref('')
const allProducts = ref([])

const categories = [
  { value: 'electronics', label: '电子产品' },
  { value: 'clothing', label: '服装' },
  { value: 'books', label: '图书' },
  { value: 'home', label: '家居' },
  { value: 'sports', label: '运动' }
]

// 生成模拟商品数据
const generateProducts = () => {
  const categoryNames = ['电子产品', '服装', '图书', '家居', '运动']
  const productNames = {
    '电子产品': ['iPhone', 'iPad', 'MacBook', '耳机', '充电器'],
    '服装': ['T恤', '牛仔裤', '连衣裙', '外套', '运动鞋'],
    '图书': ['小说', '技术书籍', '历史', '传记', '科幻'],
    '家居': ['沙发', '餐桌', '床', '衣柜', '台灯'],
    '运动': ['篮球', '足球', '跑鞋', '健身器材', '瑜伽垫']
  }
  
  return Array.from({ length: 10000 }, (_, index) => {
    const category = categoryNames[index % categoryNames.length]
    const productName = productNames[category][index % productNames[category].length]
    const price = Math.floor(Math.random() * 2000) + 10
    const stock = Math.floor(Math.random() * 100)
    
    return {
      value: `product_${index}`,
      label: `${productName} ${index + 1}`,
      sku: `SKU${String(index + 1).padStart(6, '0')}`,
      category,
      price,
      stock,
      image: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png'
    }
  })
}

allProducts.value = generateProducts()

const totalValue = computed(() => {
  return selectedProducts.value.reduce((total, productId) => {
    const product = getProductById(productId)
    return total + (product ? product.price : 0)
  }, 0)
})

const searchProducts = async (query) => {
  loading.value = true
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  let results = allProducts.value
  
  // 应用分类过滤
  if (categoryFilter.value) {
    results = results.filter(product => product.category === categoryFilter.value)
  }
  
  // 应用价格过滤
  if (priceFilter.value) {
    const [min, max] = priceFilter.value.split('-').map(Number)
    if (max) {
      results = results.filter(product => product.price >= min && product.price <= max)
    } else {
      results = results.filter(product => product.price >= min)
    }
  }
  
  // 应用搜索查询
  if (query) {
    const searchQuery = query.toLowerCase()
    results = results.filter(product => 
      product.label.toLowerCase().includes(searchQuery) ||
      product.sku.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
    )
  }
  
  filteredProducts.value = results.slice(0, 100)
  loading.value = false
}

const getProductById = (productId) => {
  return allProducts.value.find(product => product.value === productId)
}

const handleCategoryChange = () => {
  searchProducts('')
}

const handlePriceChange = () => {
  searchProducts('')
}

const handleProductChange = (value) => {
  ElMessage.success(`已选择 ${value.length} 个商品`)
}

const removeProduct = (productId) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
    ElMessage.info('已移除商品')
  }
}

// 初始化显示一些商品
searchProducts('')
</script>

<style scoped>
.product-selector {
  max-width: 900px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.filters {
  display: flex;
  margin-bottom: 16px;
}

.selector-container {
  margin-bottom: 24px;
}

.product-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.product-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.product-price {
  font-weight: 600;
  color: #f56c6c;
}

.product-stock {
  margin-left: auto;
}

.selector-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  font-size: 12px;
}

.result-count {
  color: #909399;
}

.total-value {
  color: #f56c6c;
  font-weight: 600;
}

.selected-products {
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.selected-products h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.product-summary {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.summary-item {
  display: flex;
  gap: 8px;
}

.summary-item .label {
  color: #606266;
}

.summary-item .value {
  font-weight: 600;
  color: #303133;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.card-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.card-info {
  flex: 1;
}

.card-info h5 {
  margin: 0 0 4px 0;
  color: #303133;
}

.card-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #606266;
}

.price-stock {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.price {
  font-weight: 600;
  color: #f56c6c;
}

.stock {
  font-size: 12px;
  color: #909399;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 选中项绑定值 | string / number / boolean / object / array | — |
| options | 选项的数据源 | array | — |
| props | 配置选项，具体看下表 | object | — |
| multiple | 是否多选 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| value-key | 作为 value 唯一标识的键名，绑定值为对象类型时必填 | string | value |
| size | 组件大小 | enum: '' / 'large' / 'small' | '' |
| clearable | 是否可以清空选项 | boolean | false |
| clear-icon | 自定义清除图标 | string / object | CircleClose |
| collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | false |
| multiple-limit | 多选时可被选择的最大数目。当被设置为0时，可被选择的数目不设限 | number | 0 |
| name | 选择器的原生name属性 | string | — |
| effect | tooltip 主题，内置了 dark / light 两种 | enum: 'dark' / 'light' | light |
| autocomplete | 自动补全 | string | off |
| placeholder | 占位符 | string | 请选择 |
| filterable | 是否可搜索 | boolean | false |
| allow-create | 是否允许用户创建新条目，需配合 filterable 使用 | boolean | false |
| filter-method | 自定义搜索方法 | function | — |
| remote | 是否为远程搜索 | boolean | false |
| remote-method | 远程搜索方法 | function | — |
| loading | 是否正在从远程获取数据 | boolean | false |
| loading-text | 远程加载时显示的文字 | string | 加载中 |
| no-match-text | 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置 | string | 无匹配数据 |
| no-data-text | 选项为空时显示的文字，也可以使用slot="empty"设置 | string | 无数据 |
| popper-class | Select 下拉框的类名 | string | — |
| reserve-keyword | 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词 | boolean | true |
| default-first-option | 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用 | boolean | false |
| teleported | 是否将弹出层元素插入 append-to 指向的元素下 | boolean | true |
| persistent | 当下拉选择器未被激活并且persistent设置为false，选择器会被删除 | boolean | true |
| automatic-dropdown | 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单 | boolean | false |
| fit-input-width | 下拉框的宽度是否与输入框相同 | boolean | false |
| suffix-icon | 自定义后缀图标组件 | string / Component | ArrowDown |
| tag-type | 标签类型 | enum: 'success' / 'info' / 'warning' / 'danger' | info |
| validate-event | 输入时是否触发表单的校验 | boolean | true |
| placement | 下拉框出现的位置 | enum | bottom-start |
| collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。要使用此属性，collapse-tags属性必须设定为 true | boolean | false |
| max-collapse-tags | 需要显示的 Tag 的最大数量 只有当 collapse-tags 设置为 false 时才会生效 | number | 1 |
| popper-options | popper.js 参数 | object | {} |
| aria-label | 等价于原生 input aria-label 属性 | string | — |
| empty-values | 组件的空值配置 参考config-provider | array | — |
| value-on-clear | 清空选项的值 参考config-provider | string / number / boolean / Function | — |

### Props 配置

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| value | 指定选项的值为选项对象的某个属性值 | string | value |
| label | 指定选项标签为选项对象的某个属性值 | string | label |
| children | 指定选项的子选项为选项对象的某个属性值 | string | children |
| disabled | 指定选项的禁用为选项对象的某个属性值 | string | disabled |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 选中值发生变化时触发 | 目前的选中值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| remove-tag | 多选模式下移除tag时触发 | 移除的tag值 |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
| blur | 当 input 失去焦点时触发 | (event: Event) |
| focus | 当 input 获得焦点时触发 | (event: Event) |

### Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义选项的内容，参数为 { item, index, disabled } | — |
| header | 下拉选项顶部的内容 | — |
| footer | 下拉选项底部的内容 | — |
| tag | 自定义标签内容，参数为 { props, onClose } | — |
| loading | 自定义加载中内容 | — |
| empty | 自定义当选项为空时的内容 | — |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使选择器的输入框获取焦点 | — |
| blur | 使选择器的输入框失去焦点，并隐藏下拉框 | — |

## 最佳实践

### 性能优化

1. **合理设置选项数量**
   - 单次渲染的选项数量不宜过多
   - 使用远程搜索减少初始数据量
   - 合理使用分页或懒加载

2. **优化搜索体验**
   - 设置合适的防抖时间
   - 提供搜索提示和帮助信息
   - 支持多种搜索方式（拼音、首字母等）

3. **内存管理**
   - 及时清理不需要的数据
   - 避免在组件中存储大量数据
   - 使用虚拟滚动减少DOM节点

### 用户体验优化

1. **交互反馈**
   - 提供加载状态提示
   - 显示搜索结果数量
   - 合理的错误提示信息

2. **视觉设计**
   - 保持选项样式一致
   - 合理使用图标和标签
   - 适配不同屏幕尺寸

3. **键盘操作**
   - 支持方向键导航
   - 支持回车选择
   - 支持ESC关闭

### 数据处理

1. **数据结构设计**
   - 统一的数据格式
   - 合理的字段命名
   - 支持扩展属性

2. **搜索优化**
   - 前端搜索 vs 后端搜索
   - 搜索算法选择
   - 结果排序和高亮

## 常见问题

### 性能相关

**Q: 选项数据很多时，组件卡顿怎么办？**

A: 使用虚拟化选择器就是为了解决这个问题：

```vue
<template>
  <!-- 使用 el-select-v2 而不是 el-select -->
  <el-select-v2
    v-model="value"
    :options="largeDataset"
    placeholder="请选择"
    filterable
    remote
    :remote-method="searchMethod"
  />
</template>
```

**Q: 如何优化远程搜索的性能？**

A: 使用防抖和缓存：

```javascript
import { debounce } from 'lodash-es'

const searchCache = new Map()

const searchMethod = debounce(async (query) => {
  if (searchCache.has(query)) {
    options.value = searchCache.get(query)
    return
  }
  
  const results = await fetchData(query)
  searchCache.set(query, results)
  options.value = results
}, 300)
```

**Q: 多选时标签太多怎么办？**

A: 使用标签折叠功能：

```vue
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    multiple
    collapse-tags
    collapse-tags-tooltip
    :max-collapse-tags="3"
  />
</template>
```

### 数据相关

**Q: 如何处理分组数据？**

A: 使用嵌套的数据结构：

```javascript
const groupOptions = [
  {
    label: '分组1',
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' }
    ]
  },
  {
    label: '分组2',
    options: [
      { value: 'option3', label: '选项3' },
      { value: 'option4', label: '选项4' }
    ]
  }
]
```

**Q: 如何自定义选项的显示格式？**

A: 使用默认插槽：

```vue
<template>
  <el-select-v2 v-model="value" :options="options">
    <template #default="{ item }">
      <div class="custom-option">
        <span class="label">{{ item.label }}</span>
        <span class="description">{{ item.description }}</span>
      </div>
    </template>
  </el-select-v2>
</template>
```

### 样式相关

**Q: 如何自定义下拉框的样式？**

A: 使用 `popper-class` 属性：

```vue
<template>
  <el-select-v2
    v-model="value"
    :options="options"
    popper-class="custom-select-dropdown"
  />
</template>

<style>
.custom-select-dropdown {
  max-height: 300px;
}

.custom-select-dropdown .el-select-dropdown__item {
  padding: 12px 20px;
}
</style>
```

**Q: 如何调整选择器的宽度？**

A: 直接设置样式或使用 `fit-input-width` 属性：

```vue
<template>
  <!-- 方式1：直接设置宽度 -->
  <el-select-v2
    v-model="value"
    :options="options"
    style="width: 300px"
  />
  
  <!-- 方式2：下拉框宽度跟随输入框 -->
  <el-select-v2
    v-model="value"
    :options="options"
    fit-input-width
    style="width: 200px"
  />
</template>
```

## 总结

Virtualized Select 虚拟化选择器是 Element Plus 为处理大量数据选择场景而设计的高性能组件。它具有以下特点：

### 核心特点

- **高性能**：通过虚拟滚动技术，可以流畅处理数万条数据
- **功能完整**：支持单选、多选、搜索、远程加载等完整功能
- **高度定制**：提供丰富的插槽和配置选项，满足各种定制需求
- **用户友好**：优秀的交互体验和无障碍访问支持
- **易于集成**：简单的 API 设计，易于在项目中集成使用

### 适用场景

- **企业级应用**：员工选择、部门选择、权限分配等
- **电商系统**：商品选择、分类筛选、库存管理等
- **数据管理**：大量数据的筛选和选择操作
- **内容管理**：标签管理、分类选择等
- **报表系统**：数据维度选择、筛选条件设置等

### 最佳实践建议

1. **性能优先**：合理使用虚拟滚动和远程搜索
2. **用户体验**：提供清晰的反馈和帮助信息
3. **数据管理**：设计合理的数据结构和缓存策略
4. **样式统一**：保持与整体设计风格的一致性
5. **无障碍访问**：确保组件的可访问性

通过合理使用 Virtualized Select 组件，可以在保证性能的同时，为用户提供优秀的数据选择体验。

## 参考资料

- [Element Plus 官方文档 - Virtualized Select](https://element-plus.org/zh-CN/component/select-v2.html)
- [Vue 3 虚拟滚动原理](https://vuejs.org/guide/extras/virtual-scrolling.html)
- [Web 性能优化最佳实践](https://web.dev/performance/)
- [用户界面设计模式](https://ui-patterns.com/patterns/Dropdown)
- [无障碍访问设计指南](https://www.w3.org/WAI/WCAG21/quickref/)