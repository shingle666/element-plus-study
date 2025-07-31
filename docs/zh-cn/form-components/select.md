# Select 选择器

## 概述

Select 选择器是一个下拉选择组件，用于在多个选项中进行选择。它支持单选、多选、搜索、远程搜索、分组等多种功能，是表单中最常用的组件之一。

## 学习目标

- 掌握 Select 的基本概念和使用场景
- 学会基础选择器的使用方法
- 了解单选和多选模式的区别
- 掌握选择器的状态控制和事件处理
- 学会使用选项分组和自定义模板
- 了解远程搜索和大数据量处理
- 掌握 API 的完整使用方法

## 基础用法

### 基本选择器

最简单的选择器用法：

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' }
]
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用选择器或选项：

```vue
<template>
  <div>
    <h4>禁用选择器</h4>
    <el-select v-model="value1" disabled placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>禁用选项</h4>
    <el-select v-model="value2" placeholder="请选择">
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
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二', disabled: true },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四', disabled: true }
]
</script>
```

### 可清空

通过 `clearable` 属性来启用清空功能：

```vue
<template>
  <div>
    <el-select v-model="value" clearable placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' }
]
</script>
```

## 多选模式

### 基础多选

通过 `multiple` 属性启用多选模式：

```vue
<template>
  <div>
    <el-select
      v-model="value"
      multiple
      placeholder="请选择"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' },
  { value: 'option5', label: '选项五' }
]
</script>
```

### 多选折叠标签

使用 `collapse-tags` 和 `collapse-tags-tooltip` 来折叠多选标签：

```vue
<template>
  <div>
    <h4>折叠标签</h4>
    <el-select
      v-model="value1"
      multiple
      collapse-tags
      placeholder="请选择"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>折叠标签 + 提示</h4>
    <el-select
      v-model="value2"
      multiple
      collapse-tags
      collapse-tags-tooltip
      placeholder="请选择"
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
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' },
  { value: 'option4', label: '选项四' },
  { value: 'option5', label: '选项五' }
]
</script>
```

## 可搜索

### 本地搜索

通过 `filterable` 属性启用搜索功能：

```vue
<template>
  <div>
    <el-select
      v-model="value"
      filterable
      placeholder="请选择或搜索"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'nanjing', label: '南京' },
  { value: 'chengdu', label: '成都' },
  { value: 'wuhan', label: '武汉' }
]
</script>
```

### 远程搜索

通过 `remote` 和 `remote-method` 实现远程搜索：

```vue
<template>
  <div>
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词"
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
    <p>选中的值：{{ value }}</p>
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

## 选项分组

使用 `el-option-group` 对选项进行分组：

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="请选择">
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
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const options = [
  {
    label: '热门城市',
    options: [
      { value: 'beijing', label: '北京' },
      { value: 'shanghai', label: '上海' },
      { value: 'guangzhou', label: '广州' },
      { value: 'shenzhen', label: '深圳' }
    ]
  },
  {
    label: '其他城市',
    options: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'nanjing', label: '南京' },
      { value: 'chengdu', label: '成都' },
      { value: 'wuhan', label: '武汉' }
    ]
  }
]
</script>
```

## 自定义模板

### 自定义选项内容

使用插槽自定义选项的显示内容：

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="请选择">
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
    <p>选中的值：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const cities = [
  {
    value: 'beijing',
    label: '北京',
    desc: '中国首都'
  },
  {
    value: 'shanghai',
    label: '上海',
    desc: '魔都'
  },
  {
    value: 'guangzhou',
    label: '广州',
    desc: '花城'
  },
  {
    value: 'shenzhen',
    label: '深圳',
    desc: '科技之城'
  }
]
</script>
```

### 自定义前缀和后缀

使用 `prefix` 和 `suffix` 插槽：

```vue
<template>
  <div>
    <el-select v-model="value" placeholder="请选择">
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
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' }
]
</script>
```

## 尺寸

使用 `size` 属性来设置选择器的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-select v-model="value1" size="large" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>默认尺寸</h4>
    <el-select v-model="value2" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    
    <h4>小尺寸</h4>
    <el-select v-model="value3" size="small" placeholder="请选择">
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
  { value: 'option1', label: '选项一' },
  { value: 'option2', label: '选项二' },
  { value: 'option3', label: '选项三' }
]
</script>
```

## 实际应用示例

### 用户信息选择器

```vue
<template>
  <div class="user-selector">
    <h3>用户选择器</h3>
    
    <div class="selector-group">
      <div class="selector-item">
        <label>选择用户：</label>
        <el-select
          v-model="selectedUser"
          filterable
          remote
          reserve-keyword
          placeholder="请输入用户名搜索"
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
        <label>选择部门：</label>
        <el-select
          v-model="selectedDepartment"
          placeholder="请选择部门"
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
        <label>选择角色：</label>
        <el-select
          v-model="selectedRoles"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择角色"
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
      <h4>选择结果</h4>
      <p>用户：{{ getUserName(selectedUser) }}</p>
      <p>部门：{{ getDepartmentName(selectedDepartment) }}</p>
      <p>角色：{{ getRoleNames(selectedRoles) }}</p>
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
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
]

const departments = [
  {
    label: '技术部门',
    departments: [
      { id: 1, name: '前端开发部' },
      { id: 2, name: '后端开发部' },
      { id: 3, name: '测试部' }
    ]
  },
  {
    label: '业务部门',
    departments: [
      { id: 4, name: '产品部' },
      { id: 5, name: '运营部' },
      { id: 6, name: '销售部' }
    ]
  }
]

const roles = [
  { id: 1, name: '管理员', description: '系统管理员权限' },
  { id: 2, name: '开发者', description: '开发相关权限' },
  { id: 3, name: '测试员', description: '测试相关权限' },
  { id: 4, name: '访客', description: '只读权限', disabled: true }
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
  ElMessage.success(`选择了用户：${getUserName(value)}`)
}

const handleDepartmentChange = (value) => {
  ElMessage.success(`选择了部门：${getDepartmentName(value)}`)
}

const getUserName = (userId) => {
  const user = allUsers.find(u => u.id === userId)
  return user ? user.name : '未选择'
}

const getDepartmentName = (deptId) => {
  for (const group of departments) {
    const dept = group.departments.find(d => d.id === deptId)
    if (dept) return dept.name
  }
  return '未选择'
}

const getRoleNames = (roleIds) => {
  if (!roleIds.length) return '未选择'
  return roleIds.map(id => {
    const role = roles.find(r => r.id === id)
    return role ? role.name : ''
  }).filter(Boolean).join(', ')
}

// 初始化用户列表
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

### 动态表单选择器

```vue
<template>
  <div class="dynamic-form-selector">
    <h3>动态表单配置</h3>
    
    <div class="form-config">
      <div class="config-item">
        <label>表单类型：</label>
        <el-select
          v-model="formType"
          placeholder="请选择表单类型"
          @change="handleFormTypeChange"
        >
          <el-option
            v-for="type in formTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </div>
      
      <div class="config-item" v-if="formType">
        <label>可用字段：</label>
        <el-select
          v-model="selectedFields"
          multiple
          filterable
          placeholder="请选择字段"
          style="width: 300px"
        >
          <el-option
            v-for="field in availableFields"
            :key="field.value"
            :label="field.label"
            :value="field.value"
          >
            <div class="field-option">
              <span class="field-name">{{ field.label }}</span>
              <el-tag :type="field.type" size="small">{{ field.dataType }}</el-tag>
            </div>
          </el-option>
        </el-select>
      </div>
      
      <div class="config-item" v-if="selectedFields.length">
        <label>必填字段：</label>
        <el-select
          v-model="requiredFields"
          multiple
          placeholder="请选择必填字段"
          style="width: 300px"
        >
          <el-option
            v-for="field in selectedFieldOptions"
            :key="field.value"
            :label="field.label"
            :value="field.value"
          />
        </el-select>
      </div>
    </div>
    
    <div class="form-preview" v-if="selectedFields.length">
      <h4>表单预览</h4>
      <div class="preview-content">
        <div
          v-for="field in selectedFieldOptions"
          :key="field.value"
          class="preview-field"
        >
          <label>
            {{ field.label }}
            <span v-if="requiredFields.includes(field.value)" class="required">*</span>
          </label>
          <div class="field-input" :class="field.dataType">
            {{ getFieldPreview(field.dataType) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const formType = ref('')
const selectedFields = ref([])
const requiredFields = ref([])
const availableFields = ref([])

const formTypes = [
  { value: 'user', label: '用户信息表单' },
  { value: 'product', label: '产品信息表单' },
  { value: 'order', label: '订单信息表单' }
]

const fieldsByType = {
  user: [
    { value: 'name', label: '姓名', dataType: 'text', type: 'primary' },
    { value: 'email', label: '邮箱', dataType: 'email', type: 'success' },
    { value: 'phone', label: '电话', dataType: 'tel', type: 'warning' },
    { value: 'age', label: '年龄', dataType: 'number', type: 'info' },
    { value: 'gender', label: '性别', dataType: 'select', type: 'danger' },
    { value: 'address', label: '地址', dataType: 'textarea', type: 'primary' }
  ],
  product: [
    { value: 'title', label: '产品名称', dataType: 'text', type: 'primary' },
    { value: 'price', label: '价格', dataType: 'number', type: 'success' },
    { value: 'category', label: '分类', dataType: 'select', type: 'warning' },
    { value: 'description', label: '描述', dataType: 'textarea', type: 'info' },
    { value: 'status', label: '状态', dataType: 'select', type: 'danger' }
  ],
  order: [
    { value: 'orderNo', label: '订单号', dataType: 'text', type: 'primary' },
    { value: 'customer', label: '客户', dataType: 'select', type: 'success' },
    { value: 'amount', label: '金额', dataType: 'number', type: 'warning' },
    { value: 'date', label: '日期', dataType: 'date', type: 'info' },
    { value: 'status', label: '状态', dataType: 'select', type: 'danger' }
  ]
}

const selectedFieldOptions = computed(() => {
  return availableFields.value.filter(field => 
    selectedFields.value.includes(field.value)
  )
})

const handleFormTypeChange = (type) => {
  availableFields.value = fieldsByType[type] || []
  selectedFields.value = []
  requiredFields.value = []
}

const getFieldPreview = (dataType) => {
  const previews = {
    text: '文本输入框',
    email: '邮箱输入框',
    tel: '电话输入框',
    number: '数字输入框',
    select: '下拉选择器',
    textarea: '多行文本框',
    date: '日期选择器'
  }
  return previews[dataType] || '输入框'
}
</script>

<style scoped>
.dynamic-form-selector {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.form-config {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.config-item label {
  width: 100px;
  font-weight: 500;
}

.field-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.field-name {
  flex: 1;
}

.form-preview {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.form-preview h4 {
  margin-bottom: 16px;
  color: #303133;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-field {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-field label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.required {
  color: #f56c6c;
}

.field-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

.field-input.textarea {
  height: 60px;
}
</style>
```

## API 文档

### Select Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string / number / boolean / object / array | — |
| multiple | 是否多选 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| value-key | 作为 value 唯一标识的键名，绑定值为对象类型时必填 | string | value |
| size | 输入框尺寸 | enum | — |
| clearable | 是否可以清空选项 | boolean | false |
| collapse-tags | 多选时是否将选中值按文字的形式展示 | boolean | false |
| collapse-tags-tooltip | 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签在 tooltip 中 | boolean | false |
| multiple-limit | 多选时用户最多可以选择的项目数，为 0 则不限制 | number | 0 |
| name | Select 的 name 属性 | string | — |
| effect | Tooltip 主题，内置了 dark / light 两种 | enum | light |
| autocomplete | Select 的 autocomplete 属性 | string | off |
| placeholder | 占位符 | string | 请选择 |
| filterable | 是否可搜索 | boolean | false |
| allow-create | 是否允许用户创建新条目，需配合 filterable 使用 | boolean | false |
| filter-method | 自定义搜索方法 | function | — |
| remote | 是否为远程搜索 | boolean | false |
| remote-method | 远程搜索方法 | function | — |
| remote-show-suffix | 远程搜索时显示后缀图标 | boolean | false |
| loading | 是否正在从远程获取数据 | boolean | false |
| loading-text | 远程加载时显示的文字 | string | 加载中 |
| no-match-text | 搜索条件无匹配时显示的文字，也可以使用 empty 插槽设置 | string | 无匹配数据 |
| no-data-text | 选项为空时显示的文字，也可以使用 empty 插槽设置 | string | 无数据 |
| popper-class | Select 下拉框的类名 | string | — |
| reserve-keyword | 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词 | boolean | true |
| default-first-option | 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用 | boolean | false |
| teleported | 是否将弹出框插入至 body 元素 | boolean | true |
| persistent | 当下拉选择器未被激活并且 persistent 设置为 false，选择器会被删除 | boolean | true |
| automatic-dropdown | 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单 | boolean | false |
| clear-icon | 自定义清空图标 | string / Component | CircleClose |
| fit-input-width | 下拉框的宽度是否与输入框相同 | boolean | false |
| suffix-icon | 自定义后缀图标组件 | string / Component | ArrowDown |
| tag-type | 标签类型 | enum | info |
| validate-event | 输入时是否触发表单的校验 | boolean | true |
| placement | 下拉框出现的位置 | enum | bottom-start |

### Select Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 选中值发生变化时触发 | Function |
| visible-change | 下拉框出现/隐藏时触发 | Function |
| remove-tag | 多选模式下移除tag时触发 | Function |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | Function |
| blur | 当 input 失去焦点时触发 | Function |
| focus | 当 input 获得焦点时触发 | Function |

### Select Slots

| 名称 | 说明 | 子标签 |
|------|------|--------|
| default | Option 组件列表 | Option / OptionGroup |
| header | 下拉列表顶部的内容 | — |
| footer | 下拉列表底部的内容 | — |
| prefix | Select 组件头部内容 | — |
| empty | 无选项时的列表 | — |
| tag | 自定义标签内容，只有当 multiple 为 true 时才会生效 | — |
| loading | 自定义加载中内容 | — |

### Option Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 选项的值 | string / number / boolean / object | — |
| label | 选项的标签，若不设置则默认与 value 相同 | string / number | — |
| disabled | 是否禁用该选项 | boolean | false |

### OptionGroup Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 分组的组名 | string | — |
| disabled | 是否将该分组下所有选项置为禁用 | boolean | false |

## 实践练习

### 练习1：智能搜索选择器

创建一个智能搜索选择器，支持多种搜索策略：

```vue
<template>
  <div class="smart-selector">
    <h3>智能搜索选择器</h3>
    <el-select
      v-model="value"
      filterable
      remote
      reserve-keyword
      placeholder="请输入关键词搜索"
      :remote-method="smartSearch"
      :loading="loading"
      style="width: 300px"
    >
      <el-option
        v-for="item in searchResults"
        :key="item.id"
        :label="item.title"
        :value="item.id"
      >
        <div class="search-result-item">
          <div class="result-title">{{ item.title }}</div>
          <div class="result-desc">{{ item.description }}</div>
          <div class="result-tags">
            <el-tag v-for="tag in item.tags" :key="tag" size="small">{{ tag }}</el-tag>
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')
const loading = ref(false)
const searchResults = ref([])

const mockData = [
  {
    id: 1,
    title: 'Vue.js 开发指南',
    description: '现代前端框架开发教程',
    tags: ['前端', 'Vue', '教程']
  },
  {
    id: 2,
    title: 'React 实战项目',
    description: 'React 框架实际项目开发',
    tags: ['前端', 'React', '实战']
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    description: 'JavaScript 后端开发技术',
    tags: ['后端', 'Node.js', 'JavaScript']
  }
]

const smartSearch = (query) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      searchResults.value = mockData.filter(item => {
        return item.title.toLowerCase().includes(query.toLowerCase()) ||
               item.description.toLowerCase().includes(query.toLowerCase()) ||
               item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      })
    }, 300)
  } else {
    searchResults.value = []
  }
}
</script>
```

### 练习2：级联选择器

创建一个地区级联选择器：

```vue
<template>
  <div class="cascader-selector">
    <h3>地区选择器</h3>
    <el-select
      v-model="province"
      placeholder="请选择省份"
      @change="handleProvinceChange"
    >
      <el-option
        v-for="item in provinces"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    
    <el-select
      v-model="city"
      placeholder="请选择城市"
      :disabled="!province"
      @change="handleCityChange"
    >
      <el-option
        v-for="item in cities"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
    
    <el-select
      v-model="district"
      placeholder="请选择区县"
      :disabled="!city"
    >
      <el-option
        v-for="item in districts"
        :key="item.code"
        :label="item.name"
        :value="item.code"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const province = ref('')
const city = ref('')
const district = ref('')
const cities = ref([])
const districts = ref([])

const provinces = [
  { code: '110000', name: '北京市' },
  { code: '310000', name: '上海市' },
  { code: '440000', name: '广东省' }
]

const regionData = {
  '110000': [
    { code: '110100', name: '北京市' }
  ],
  '310000': [
    { code: '310100', name: '上海市' }
  ],
  '440000': [
    { code: '440100', name: '广州市' },
    { code: '440300', name: '深圳市' }
  ]
}

const handleProvinceChange = (value) => {
  cities.value = regionData[value] || []
  city.value = ''
  district.value = ''
  districts.value = []
}

const handleCityChange = (value) => {
  // 模拟获取区县数据
  districts.value = [
    { code: value + '01', name: '区县1' },
    { code: value + '02', name: '区县2' }
  ]
  district.value = ''
}
</script>
```

## 常见问题

### 1. 选项值不更新

**问题**：选择器的值没有正确绑定或更新

**解决方案**：
```vue
<!-- 确保正确使用 v-model -->
<el-select v-model="selectedValue">
  <el-option value="option1" label="选项1" />
</el-select>

<!-- 确保选项的 value 和绑定值类型一致 -->
<script setup>
const selectedValue = ref('') // 字符串类型
// 或者
const selectedValue = ref(null) // 允许为空
</script>
```

### 2. 远程搜索性能问题

**问题**：远程搜索频繁请求导致性能问题

**解决方案**：
```javascript
// 使用防抖优化
import { debounce } from 'lodash-es'

const remoteMethod = debounce((query) => {
  if (query) {
    // 执行搜索逻辑
  }
}, 300)
```

### 3. 多选标签过多显示问题

**问题**：多选时标签过多影响界面

**解决方案**：
```vue
<el-select
  v-model="value"
  multiple
  collapse-tags
  collapse-tags-tooltip
  :multiple-limit="5"
>
  <!-- 选项 -->
</el-select>
```

## 最佳实践

1. **性能优化**：大数据量时使用虚拟滚动或分页加载
2. **用户体验**：提供合适的占位符和加载状态
3. **数据验证**：确保选项数据的完整性和一致性
4. **可访问性**：提供键盘导航和屏幕阅读器支持
5. **响应式设计**：在不同屏幕尺寸下保持良好的显示效果
6. **错误处理**：妥善处理网络错误和数据加载失败

## 总结

Select 选择器是一个功能强大的表单组件，支持：

- 单选和多选模式
- 本地和远程搜索
- 选项分组和自定义模板
- 多种尺寸和状态
- 丰富的配置选项
- 良好的可访问性支持

掌握 Select 组件的使用，能够帮助你构建更加灵活和用户友好的表单界面。

## 参考资料

- [Element Plus Select 官方文档](https://element-plus.org/zh-CN/component/select.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)