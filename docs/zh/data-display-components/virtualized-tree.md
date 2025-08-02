# Virtualized Tree 虚拟化树形控件

## 概述

Virtualized Tree 虚拟化树形控件是 Element Plus 提供的一个高性能树形组件，专门用于处理大量层级数据的展示。它通过虚拟滚动技术，只渲染可视区域内的节点，从而实现在展示数万个节点时仍能保持流畅的性能。

## 学习目标

通过本文档的学习，你将掌握：
- Virtualized Tree 的基本概念和性能优势
- 基础用法和树形结构配置
- 节点展开、选择、搜索等功能
- 自定义节点渲染和样式定制
- 懒加载和异步数据处理
- 实际项目中的应用示例
- 完整的 API 文档和性能优化技巧

## 基础用法

### 基础虚拟化树

最简单的虚拟化树用法：

```vue
<template>
  <el-tree-v2
    :data="data"
    :props="defaultProps"
    :height="400"
  />
</template>

<script setup>
import { ref } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'label'
}

const data = ref([
  {
    id: 1,
    label: '一级 1',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1'
          },
          {
            id: 10,
            label: '三级 1-1-2'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1'
      },
      {
        id: 6,
        label: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1'
      },
      {
        id: 8,
        label: '二级 3-2'
      }
    ]
  }
])
</script>
```

### 可选择的树

支持节点选择功能：

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <el-button @click="getCheckedNodes">获取选中节点</el-button>
      <el-button @click="getCheckedKeys">获取选中节点 key</el-button>
      <el-button @click="resetChecked">清空选择</el-button>
    </div>
    
    <el-tree-v2
      ref="treeRef"
      :data="data"
      :props="defaultProps"
      :height="400"
      show-checkbox
      node-key="id"
      :default-checked-keys="[5, 9]"
      @check="handleCheck"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const treeRef = ref()

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 生成大量测试数据
const generateTreeData = (level = 1, parentId = '', count = 100) => {
  const data = []
  for (let i = 1; i <= count; i++) {
    const id = parentId ? `${parentId}-${i}` : `${i}`
    const node = {
      id,
      label: `节点 ${id}`,
      children: level < 3 ? generateTreeData(level + 1, id, Math.floor(count / 2)) : []
    }
    data.push(node)
  }
  return data
}

const data = ref(generateTreeData())

const handleCheck = (data, checked) => {
  console.log('节点选择状态改变:', data, checked)
}

const getCheckedNodes = () => {
  const checkedNodes = treeRef.value.getCheckedNodes()
  ElMessage.success(`选中了 ${checkedNodes.length} 个节点`)
  console.log('选中的节点:', checkedNodes)
}

const getCheckedKeys = () => {
  const checkedKeys = treeRef.value.getCheckedKeys()
  ElMessage.success(`选中了 ${checkedKeys.length} 个节点`)
  console.log('选中的节点 keys:', checkedKeys)
}

const resetChecked = () => {
  treeRef.value.setCheckedKeys([])
  ElMessage.success('已清空选择')
}
</script>
```

### 自定义节点内容

通过插槽自定义节点显示内容：

```vue
<template>
  <el-tree-v2
    :data="data"
    :props="defaultProps"
    :height="400"
    show-checkbox
    node-key="id"
  >
    <template #default="{ node, data }">
      <div class="custom-tree-node">
        <el-icon v-if="data.type === 'folder'" class="node-icon">
          <Folder />
        </el-icon>
        <el-icon v-else-if="data.type === 'file'" class="node-icon">
          <Document />
        </el-icon>
        <el-icon v-else class="node-icon">
          <Grid />
        </el-icon>
        
        <span class="node-label">{{ data.label }}</span>
        
        <div class="node-actions">
          <el-tag v-if="data.size" size="small" type="info">
            {{ formatSize(data.size) }}
          </el-tag>
          
          <el-button
            size="small"
            type="primary"
            link
            @click.stop="handleEdit(data)"
          >
            编辑
          </el-button>
          
          <el-button
            size="small"
            type="danger"
            link
            @click.stop="handleDelete(data)"
          >
            删除
          </el-button>
        </div>
      </div>
    </template>
  </el-tree-v2>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Grid } from '@element-plus/icons-vue'

const defaultProps = {
  children: 'children',
  label: 'label'
}

const data = ref([
  {
    id: 1,
    label: '项目根目录',
    type: 'folder',
    children: [
      {
        id: 2,
        label: 'src',
        type: 'folder',
        children: [
          {
            id: 3,
            label: 'components',
            type: 'folder',
            children: [
              {
                id: 4,
                label: 'Header.vue',
                type: 'file',
                size: 2048
              },
              {
                id: 5,
                label: 'Footer.vue',
                type: 'file',
                size: 1536
              }
            ]
          },
          {
            id: 6,
            label: 'views',
            type: 'folder',
            children: [
              {
                id: 7,
                label: 'Home.vue',
                type: 'file',
                size: 4096
              },
              {
                id: 8,
                label: 'About.vue',
                type: 'file',
                size: 2560
              }
            ]
          },
          {
            id: 9,
            label: 'main.js',
            type: 'file',
            size: 1024
          }
        ]
      },
      {
        id: 10,
        label: 'public',
        type: 'folder',
        children: [
          {
            id: 11,
            label: 'index.html',
            type: 'file',
            size: 512
          }
        ]
      },
      {
        id: 12,
        label: 'package.json',
        type: 'file',
        size: 2048
      }
    ]
  }
])

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleEdit = (data) => {
  ElMessage.info(`编辑: ${data.label}`)
}

const handleDelete = async (data) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${data.label}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success(`已删除: ${data.label}`)
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
}

.node-icon {
  margin-right: 8px;
  color: #606266;
}

.node-label {
  flex: 1;
  font-size: 14px;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}
</style>
```

### 懒加载树

支持异步加载子节点：

```vue
<template>
  <el-tree-v2
    :data="data"
    :props="defaultProps"
    :height="400"
    lazy
    :load="loadNode"
    show-checkbox
    node-key="id"
  />
</template>

<script setup>
import { ref } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'leaf'
}

const data = ref([
  {
    id: 1,
    label: '根节点 1',
    leaf: false
  },
  {
    id: 2,
    label: '根节点 2',
    leaf: false
  }
])

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    return resolve(data.value)
  }
  
  // 模拟异步加载
  setTimeout(() => {
    const children = []
    const childCount = Math.floor(Math.random() * 5) + 1
    
    for (let i = 1; i <= childCount; i++) {
      const childId = `${node.data.id}-${i}`
      children.push({
        id: childId,
        label: `节点 ${childId}`,
        leaf: node.level >= 3 // 限制层级深度
      })
    }
    
    resolve(children)
  }, 500)
}
</script>
```

### 可搜索的树

支持节点搜索过滤：

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <el-input
        v-model="filterText"
        placeholder="搜索节点"
        clearable
        @input="handleFilter"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <el-tree-v2
      ref="treeRef"
      :data="filteredData"
      :props="defaultProps"
      :height="400"
      :filter-node-method="filterNode"
      show-checkbox
      node-key="id"
      :expand-on-click-node="false"
      :default-expand-all="!!filterText"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const treeRef = ref()
const filterText = ref('')

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 生成大量测试数据
const generateTreeData = () => {
  const departments = ['技术部', '销售部', '市场部', '人事部', '财务部']
  const positions = ['经理', '主管', '专员', '助理']
  const data = []
  
  departments.forEach((dept, deptIndex) => {
    const deptNode = {
      id: `dept-${deptIndex}`,
      label: dept,
      children: []
    }
    
    positions.forEach((pos, posIndex) => {
      const posNode = {
        id: `pos-${deptIndex}-${posIndex}`,
        label: pos,
        children: []
      }
      
      // 为每个职位添加员工
      for (let i = 1; i <= 10; i++) {
        posNode.children.push({
          id: `emp-${deptIndex}-${posIndex}-${i}`,
          label: `${pos}${i}`,
          email: `${pos.toLowerCase()}${i}@company.com`,
          phone: `138${String(deptIndex * 100 + posIndex * 10 + i).padStart(8, '0')}`
        })
      }
      
      deptNode.children.push(posNode)
    })
    
    data.push(deptNode)
  })
  
  return data
}

const originalData = ref(generateTreeData())

// 过滤节点
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

// 递归过滤数据
const filterTreeData = (data, keyword) => {
  if (!keyword) return data
  
  const filtered = []
  
  data.forEach(node => {
    const nodeMatches = node.label.toLowerCase().includes(keyword.toLowerCase())
    let childrenMatches = []
    
    if (node.children && node.children.length > 0) {
      childrenMatches = filterTreeData(node.children, keyword)
    }
    
    if (nodeMatches || childrenMatches.length > 0) {
      filtered.push({
        ...node,
        children: childrenMatches
      })
    }
  })
  
  return filtered
}

const filteredData = computed(() => {
  return filterTreeData(originalData.value, filterText.value)
})

const handleFilter = () => {
  // 搜索时自动展开所有节点
  if (filterText.value && treeRef.value) {
    // 延迟执行以确保数据已更新
    setTimeout(() => {
      // 这里可以添加展开逻辑
    }, 100)
  }
}
</script>
```

### 拖拽排序

支持节点拖拽排序：

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <el-switch
        v-model="draggable"
        active-text="启用拖拽"
        inactive-text="禁用拖拽"
      />
    </div>
    
    <el-tree-v2
      :data="data"
      :props="defaultProps"
      :height="400"
      :draggable="draggable"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      @node-drop="handleDrop"
      node-key="id"
      show-checkbox
    >
      <template #default="{ node, data }">
        <div class="drag-tree-node">
          <el-icon v-if="data.type === 'folder'" class="node-icon">
            <Folder />
          </el-icon>
          <el-icon v-else class="node-icon">
            <Document />
          </el-icon>
          <span>{{ data.label }}</span>
          <el-tag v-if="data.type" size="small" :type="data.type === 'folder' ? 'warning' : 'info'">
            {{ data.type === 'folder' ? '文件夹' : '文件' }}
          </el-tag>
        </div>
      </template>
    </el-tree-v2>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document } from '@element-plus/icons-vue'

const draggable = ref(true)

const defaultProps = {
  children: 'children',
  label: 'label'
}

const data = ref([
  {
    id: 1,
    label: '项目文件夹',
    type: 'folder',
    children: [
      {
        id: 2,
        label: 'src',
        type: 'folder',
        children: [
          {
            id: 3,
            label: 'main.js',
            type: 'file'
          },
          {
            id: 4,
            label: 'App.vue',
            type: 'file'
          }
        ]
      },
      {
        id: 5,
        label: 'public',
        type: 'folder',
        children: [
          {
            id: 6,
            label: 'index.html',
            type: 'file'
          }
        ]
      },
      {
        id: 7,
        label: 'package.json',
        type: 'file'
      }
    ]
  },
  {
    id: 8,
    label: '文档文件夹',
    type: 'folder',
    children: [
      {
        id: 9,
        label: 'README.md',
        type: 'file'
      },
      {
        id: 10,
        label: 'CHANGELOG.md',
        type: 'file'
      }
    ]
  }
])

// 允许拖拽的条件
const allowDrag = (draggingNode) => {
  // 不允许拖拽根节点
  return draggingNode.level > 1
}

// 允许放置的条件
const allowDrop = (draggingNode, dropNode, type) => {
  // 文件不能作为容器
  if (type === 'inner' && dropNode.data.type === 'file') {
    return false
  }
  
  // 不允许拖拽到自己的子节点
  if (type === 'inner') {
    let parent = dropNode.parent
    while (parent) {
      if (parent.data.id === draggingNode.data.id) {
        return false
      }
      parent = parent.parent
    }
  }
  
  return true
}

// 处理拖拽完成
const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  const dragLabel = draggingNode.data.label
  const dropLabel = dropNode.data.label
  
  let message = ''
  if (dropType === 'before') {
    message = `"${dragLabel}" 移动到 "${dropLabel}" 之前`
  } else if (dropType === 'after') {
    message = `"${dragLabel}" 移动到 "${dropLabel}" 之后`
  } else {
    message = `"${dragLabel}" 移动到 "${dropLabel}" 内部`
  }
  
  ElMessage.success(message)
  console.log('拖拽完成:', {
    draggingNode: draggingNode.data,
    dropNode: dropNode.data,
    dropType
  })
}
</script>

<style scoped>
.drag-tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.node-icon {
  color: #606266;
}
</style>
```

## 实际应用示例

### 组织架构树

```vue
<template>
  <div class="org-tree-container">
    <div class="tree-header">
      <h3>组织架构管理</h3>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索员工或部门"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-button type="primary" @click="handleAddDepartment">
          <el-icon><Plus /></el-icon>
          新增部门
        </el-button>
        
        <el-button @click="expandAll">
          <el-icon><Expand /></el-icon>
          展开全部
        </el-button>
        
        <el-button @click="collapseAll">
          <el-icon><Fold /></el-icon>
          收起全部
        </el-button>
      </div>
    </div>
    
    <div class="tree-content">
      <el-tree-v2
        ref="treeRef"
        :data="filteredData"
        :props="defaultProps"
        :height="600"
        node-key="id"
        :expand-on-click-node="false"
        :default-expand-all="false"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <div class="org-tree-node">
            <div class="node-info">
              <el-avatar
                v-if="data.type === 'employee'"
                :size="32"
                :src="data.avatar"
                class="node-avatar"
              >
                {{ data.name?.charAt(0) }}
              </el-avatar>
              
              <el-icon v-else class="node-icon department-icon">
                <OfficeBuilding />
              </el-icon>
              
              <div class="node-details">
                <div class="node-name">{{ data.name || data.label }}</div>
                <div v-if="data.position" class="node-position">{{ data.position }}</div>
                <div v-if="data.type === 'department'" class="node-count">
                  {{ getEmployeeCount(data) }} 人
                </div>
              </div>
            </div>
            
            <div class="node-actions">
              <el-tag
                v-if="data.status"
                :type="data.status === 'active' ? 'success' : 'danger'"
                size="small"
              >
                {{ data.status === 'active' ? '在职' : '离职' }}
              </el-tag>
              
              <el-dropdown @command="handleCommand">
                <el-button size="small" type="primary" link>
                  <el-icon><More /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'view', data }">
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'edit', data }">
                      编辑信息
                    </el-dropdown-item>
                    <el-dropdown-item 
                      v-if="data.type === 'department'"
                      :command="{ action: 'addEmployee', data }"
                    >
                      添加员工
                    </el-dropdown-item>
                    <el-dropdown-item 
                      :command="{ action: 'delete', data }"
                      divided
                    >
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-tree-v2>
    </div>
    
    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
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
        
        <el-form-item v-if="formData.type === 'employee'" label="职位" prop="position">
          <el-input v-model="formData.position" />
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'employee'" label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'employee'" label="电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        
        <el-form-item v-if="formData.type === 'employee'" label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">在职</el-radio>
            <el-radio label="inactive">离职</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
          />
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
import { ref, computed } from 'vue'
import { 
  ElMessage, ElMessageBox, ElIcon 
} from 'element-plus'
import { 
  Search, Plus, Expand, Fold, OfficeBuilding, More 
} from '@element-plus/icons-vue'

const treeRef = ref()
const formRef = ref()
const dialogVisible = ref(false)
const dialogMode = ref('view')
const searchKeyword = ref('')

const defaultProps = {
  children: 'children',
  label: 'name'
}

const formData = ref({
  id: null,
  name: '',
  type: 'employee',
  position: '',
  email: '',
  phone: '',
  status: 'active',
  description: ''
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => {
  const typeText = formData.value.type === 'department' ? '部门' : '员工'
  const actionText = dialogMode.value === 'add' ? '新增' : 
                    dialogMode.value === 'edit' ? '编辑' : '查看'
  return `${actionText}${typeText}`
})

// 组织架构数据
const orgData = ref([
  {
    id: 1,
    name: '总经理办公室',
    type: 'department',
    children: [
      {
        id: 101,
        name: '张总',
        type: 'employee',
        position: '总经理',
        email: 'zhang@company.com',
        phone: '13800138001',
        status: 'active',
        avatar: ''
      }
    ]
  },
  {
    id: 2,
    name: '技术部',
    type: 'department',
    children: [
      {
        id: 201,
        name: '李经理',
        type: 'employee',
        position: '技术经理',
        email: 'li@company.com',
        phone: '13800138002',
        status: 'active',
        avatar: ''
      },
      {
        id: 202,
        name: '前端组',
        type: 'department',
        children: [
          {
            id: 2021,
            name: '王工程师',
            type: 'employee',
            position: '前端工程师',
            email: 'wang@company.com',
            phone: '13800138003',
            status: 'active',
            avatar: ''
          },
          {
            id: 2022,
            name: '赵工程师',
            type: 'employee',
            position: '前端工程师',
            email: 'zhao@company.com',
            phone: '13800138004',
            status: 'active',
            avatar: ''
          }
        ]
      },
      {
        id: 203,
        name: '后端组',
        type: 'department',
        children: [
          {
            id: 2031,
            name: '刘工程师',
            type: 'employee',
            position: '后端工程师',
            email: 'liu@company.com',
            phone: '13800138005',
            status: 'active',
            avatar: ''
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: '销售部',
    type: 'department',
    children: [
      {
        id: 301,
        name: '陈经理',
        type: 'employee',
        position: '销售经理',
        email: 'chen@company.com',
        phone: '13800138006',
        status: 'active',
        avatar: ''
      },
      {
        id: 302,
        name: '孙专员',
        type: 'employee',
        position: '销售专员',
        email: 'sun@company.com',
        phone: '13800138007',
        status: 'active',
        avatar: ''
      }
    ]
  }
])

// 递归搜索过滤
const filterTreeData = (data, keyword) => {
  if (!keyword) return data
  
  const filtered = []
  
  data.forEach(node => {
    const nodeMatches = node.name.toLowerCase().includes(keyword.toLowerCase()) ||
                       (node.position && node.position.toLowerCase().includes(keyword.toLowerCase()))
    
    let childrenMatches = []
    if (node.children && node.children.length > 0) {
      childrenMatches = filterTreeData(node.children, keyword)
    }
    
    if (nodeMatches || childrenMatches.length > 0) {
      filtered.push({
        ...node,
        children: childrenMatches
      })
    }
  })
  
  return filtered
}

const filteredData = computed(() => {
  return filterTreeData(orgData.value, searchKeyword.value)
})

// 计算部门员工数量
const getEmployeeCount = (department) => {
  let count = 0
  
  const countEmployees = (node) => {
    if (node.type === 'employee') {
      count++
    } else if (node.children) {
      node.children.forEach(countEmployees)
    }
  }
  
  if (department.children) {
    department.children.forEach(countEmployees)
  }
  
  return count
}

const handleSearch = () => {
  // 搜索时自动展开
}

const handleNodeClick = (data) => {
  console.log('节点点击:', data)
}

const handleCommand = ({ action, data }) => {
  switch (action) {
    case 'view':
      viewDetails(data)
      break
    case 'edit':
      editNode(data)
      break
    case 'addEmployee':
      addEmployee(data)
      break
    case 'delete':
      deleteNode(data)
      break
  }
}

const viewDetails = (data) => {
  dialogMode.value = 'view'
  formData.value = { ...data }
  dialogVisible.value = true
}

const editNode = (data) => {
  dialogMode.value = 'edit'
  formData.value = { ...data }
  dialogVisible.value = true
}

const addEmployee = (department) => {
  dialogMode.value = 'add'
  formData.value = {
    id: null,
    name: '',
    type: 'employee',
    position: '',
    email: '',
    phone: '',
    status: 'active',
    description: '',
    parentId: department.id
  }
  dialogVisible.value = true
}

const deleteNode = async (data) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${data.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success(`已删除: ${data.name}`)
    // 这里添加删除逻辑
  } catch {
    // 用户取消删除
  }
}

const handleAddDepartment = () => {
  dialogMode.value = 'add'
  formData.value = {
    id: null,
    name: '',
    type: 'department',
    description: ''
  }
  dialogVisible.value = true
}

const expandAll = () => {
  // 展开所有节点的逻辑
  ElMessage.success('已展开全部节点')
}

const collapseAll = () => {
  // 收起所有节点的逻辑
  ElMessage.success('已收起全部节点')
}

const handleSubmit = async () => {
  if (dialogMode.value === 'view') {
    dialogVisible.value = false
    return
  }
  
  try {
    await formRef.value.validate()
    
    if (dialogMode.value === 'add') {
      ElMessage.success('新增成功')
    } else {
      ElMessage.success('编辑成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.org-tree-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tree-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
}

.tree-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.org-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
}

.node-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.node-avatar {
  margin-right: 12px;
}

.node-icon {
  margin-right: 12px;
  font-size: 24px;
}

.department-icon {
  color: #409eff;
}

.node-details {
  flex: 1;
}

.node-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 2px;
}

.node-position {
  font-size: 12px;
  color: #909399;
}

.node-count {
  font-size: 12px;
  color: #67c23a;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.org-tree-node:hover .node-actions {
  opacity: 1;
}
</style>
```

### 文件管理器

```vue
<template>
  <div class="file-manager">
    <div class="manager-header">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbItems"
            :key="index"
            :to="index < breadcrumbItems.length - 1 ? { path: item.path } : null"
          >
            {{ item.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      
      <div class="header-actions">
        <el-button-group>
          <el-button :type="viewMode === 'tree' ? 'primary' : ''" @click="viewMode = 'tree'">
            <el-icon><List /></el-icon>
            树形视图
          </el-button>
          <el-button :type="viewMode === 'grid' ? 'primary' : ''" @click="viewMode = 'grid'">
            <el-icon><Grid /></el-icon>
            网格视图
          </el-button>
        </el-button-group>
        
        <el-button type="primary" @click="handleUpload">
          <el-icon><Upload /></el-icon>
          上传文件
        </el-button>
        
        <el-button @click="handleNewFolder">
          <el-icon><FolderAdd /></el-icon>
          新建文件夹
        </el-button>
      </div>
    </div>
    
    <div class="manager-content">
      <div class="sidebar">
        <el-tree-v2
          ref="treeRef"
          :data="fileTree"
          :props="defaultProps"
          :height="500"
          node-key="id"
          :expand-on-click-node="false"
          :current-node-key="currentNodeId"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextMenu"
        >
          <template #default="{ node, data }">
            <div class="file-tree-node">
              <el-icon class="node-icon">
                <Folder v-if="data.type === 'folder'" />
                <Document v-else />
              </el-icon>
              <span class="node-label">{{ data.name }}</span>
              <div class="node-size" v-if="data.size">
                {{ formatFileSize(data.size) }}
              </div>
            </div>
          </template>
        </el-tree-v2>
      </div>
      
      <div class="main-content">
        <div class="content-header">
          <h4>{{ currentFolder?.name || '根目录' }}</h4>
          <div class="content-info">
            <span>{{ currentFolderItems.length }} 项</span>
            <span v-if="selectedItems.length > 0">
              已选择 {{ selectedItems.length }} 项
            </span>
          </div>
        </div>
        
        <div v-if="viewMode === 'grid'" class="grid-view">
          <div
            v-for="item in currentFolderItems"
            :key="item.id"
            class="grid-item"
            :class="{ selected: selectedItems.includes(item.id) }"
            @click="handleItemClick(item)"
            @dblclick="handleItemDoubleClick(item)"
            @contextmenu.prevent="handleItemContextMenu(item, $event)"
          >
            <div class="item-icon">
              <el-icon size="48">
                <Folder v-if="item.type === 'folder'" />
                <Document v-else-if="item.type === 'file'" />
                <Picture v-else-if="item.type === 'image'" />
                <VideoPlay v-else-if="item.type === 'video'" />
              </el-icon>
            </div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-info">
              <div v-if="item.size" class="item-size">
                {{ formatFileSize(item.size) }}
              </div>
              <div class="item-date">
                {{ formatDate(item.modifiedTime) }}
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="list-view">
          <el-table
            :data="currentFolderItems"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleItemDoubleClick"
          >
            <el-table-column type="selection" width="55" />
            
            <el-table-column label="名称" min-width="200">
              <template #default="{ row }">
                <div class="list-item-name">
                  <el-icon class="item-icon">
                    <Folder v-if="row.type === 'folder'" />
                    <Document v-else-if="row.type === 'file'" />
                    <Picture v-else-if="row.type === 'image'" />
                    <VideoPlay v-else-if="row.type === 'video'" />
                  </el-icon>
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="大小" width="100">
              <template #default="{ row }">
                {{ row.size ? formatFileSize(row.size) : '-' }}
              </template>
            </el-table-column>
            
            <el-table-column label="类型" width="100">
              <template #default="{ row }">
                {{ getFileTypeText(row.type) }}
              </template>
            </el-table-column>
            
            <el-table-column label="修改时间" width="160">
              <template #default="{ row }">
                {{ formatDate(row.modifiedTime) }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button size="small" type="primary" link @click="handleDownload(row)">
                  下载
                </el-button>
                <el-button size="small" type="danger" link @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    
    <!-- 右键菜单 -->
    <el-dropdown
      ref="contextMenuRef"
      trigger="contextmenu"
      @command="handleContextMenuCommand"
    >
      <span></span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="open">打开</el-dropdown-item>
          <el-dropdown-item command="rename">重命名</el-dropdown-item>
          <el-dropdown-item command="copy">复制</el-dropdown-item>
          <el-dropdown-item command="cut">剪切</el-dropdown-item>
          <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  List, Grid, Upload, FolderAdd, Folder, Document, 
  Picture, VideoPlay
} from '@element-plus/icons-vue'

const treeRef = ref()
const contextMenuRef = ref()
const viewMode = ref('tree')
const currentNodeId = ref(1)
const selectedItems = ref([])
const contextMenuItem = ref(null)

const defaultProps = {
  children: 'children',
  label: 'name'
}

// 文件树数据
const fileTree = ref([
  {
    id: 1,
    name: '我的文档',
    type: 'folder',
    path: '/documents',
    children: [
      {
        id: 11,
        name: '工作文档',
        type: 'folder',
        path: '/documents/work',
        children: [
          {
            id: 111,
            name: '项目计划.docx',
            type: 'file',
            size: 1024000,
            modifiedTime: new Date('2024-01-15')
          },
          {
            id: 112,
            name: '会议纪要.pdf',
            type: 'file',
            size: 512000,
            modifiedTime: new Date('2024-01-14')
          }
        ]
      },
      {
        id: 12,
        name: '个人文档',
        type: 'folder',
        path: '/documents/personal',
        children: [
          {
            id: 121,
            name: '简历.pdf',
            type: 'file',
            size: 256000,
            modifiedTime: new Date('2024-01-10')
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: '图片',
    type: 'folder',
    path: '/images',
    children: [
      {
        id: 21,
        name: '头像.jpg',
        type: 'image',
        size: 128000,
        modifiedTime: new Date('2024-01-12')
      },
      {
        id: 22,
        name: '风景.png',
        type: 'image',
        size: 2048000,
        modifiedTime: new Date('2024-01-11')
      }
    ]
  },
  {
    id: 3,
    name: '视频',
    type: 'folder',
    path: '/videos',
    children: [
      {
        id: 31,
        name: '演示视频.mp4',
        type: 'video',
        size: 10240000,
        modifiedTime: new Date('2024-01-08')
      }
    ]
  }
])

// 当前文件夹
const currentFolder = computed(() => {
  const findNode = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.children) {
        const found = findNode(node.children, id)
        if (found) return found
      }
    }
    return null
  }
  return findNode(fileTree.value, currentNodeId.value)
})

// 当前文件夹内容
const currentFolderItems = computed(() => {
  return currentFolder.value?.children || []
})

// 面包屑导航
const breadcrumbItems = computed(() => {
  const items = []
  const findPath = (nodes, id, path = []) => {
    for (const node of nodes) {
      const currentPath = [...path, { name: node.name, path: node.path, id: node.id }]
      if (node.id === id) {
        return currentPath
      }
      if (node.children) {
        const found = findPath(node.children, id, currentPath)
        if (found) return found
      }
    }
    return null
  }
  
  const path = findPath(fileTree.value, currentNodeId.value)
  return path || [{ name: '根目录', path: '/', id: 0 }]
})

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取文件类型文本
const getFileTypeText = (type) => {
  const typeMap = {
    folder: '文件夹',
    file: '文件',
    image: '图片',
    video: '视频'
  }
  return typeMap[type] || '未知'
}

// 处理节点点击
const handleNodeClick = (data) => {
  if (data.type === 'folder') {
    currentNodeId.value = data.id
    selectedItems.value = []
  }
}

// 处理项目点击
const handleItemClick = (item) => {
  if (selectedItems.value.includes(item.id)) {
    selectedItems.value = selectedItems.value.filter(id => id !== item.id)
  } else {
    selectedItems.value = [item.id]
  }
}

// 处理项目双击
const handleItemDoubleClick = (item) => {
  if (item.type === 'folder') {
    currentNodeId.value = item.id
    selectedItems.value = []
  } else {
    ElMessage.info(`打开文件: ${item.name}`)
  }
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection.map(item => item.id)
}

// 处理右键菜单
const handleContextMenu = (event, data) => {
  contextMenuItem.value = data
  // 显示右键菜单逻辑
}

const handleItemContextMenu = (item, event) => {
  contextMenuItem.value = item
  // 显示右键菜单逻辑
}

const handleContextMenuCommand = (command) => {
  const item = contextMenuItem.value
  if (!item) return
  
  switch (command) {
    case 'open':
      handleItemDoubleClick(item)
      break
    case 'rename':
      ElMessage.info(`重命名: ${item.name}`)
      break
    case 'copy':
      ElMessage.info(`复制: ${item.name}`)
      break
    case 'cut':
      ElMessage.info(`剪切: ${item.name}`)
      break
    case 'delete':
      handleDelete(item)
      break
  }
}

// 处理上传
const handleUpload = () => {
  ElMessage.info('上传文件功能')
}

// 处理新建文件夹
const handleNewFolder = () => {
  ElMessage.info('新建文件夹功能')
}

// 处理下载
const handleDownload = (item) => {
  ElMessage.info(`下载: ${item.name}`)
}

// 处理删除
const handleDelete = (item) => {
  ElMessage.warning(`删除: ${item.name}`)
}
</script>

<style scoped>
.file-manager {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
}

.breadcrumb {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.manager-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 16px;
}

.main-content {
  flex: 1;
  background: white;
  padding: 16px;
  overflow: auto;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.content-header h4 {
  margin: 0;
  color: #303133;
}

.content-info {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #909399;
}

.file-tree-node {
   display: flex;
   align-items: center;
   width: 100%;
   padding: 4px 0;
 }
 
 .node-icon {
   margin-right: 8px;
   color: #606266;
 }
 
 .node-label {
   flex: 1;
   font-size: 14px;
 }
 
 .node-size {
   font-size: 12px;
   color: #909399;
 }
 
 .grid-view {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
   gap: 16px;
   padding: 16px 0;
 }
 
 .grid-item {
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 12px;
   border: 1px solid transparent;
   border-radius: 8px;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .grid-item:hover {
   background: #f5f7fa;
   border-color: #e4e7ed;
 }
 
 .grid-item.selected {
   background: #ecf5ff;
   border-color: #409eff;
 }
 
 .item-icon {
   margin-bottom: 8px;
   color: #606266;
 }
 
 .item-name {
   font-size: 12px;
   text-align: center;
   word-break: break-all;
   margin-bottom: 4px;
 }
 
 .item-info {
   font-size: 10px;
   color: #909399;
   text-align: center;
 }
 
 .item-size {
   margin-bottom: 2px;
 }
 
 .list-view {
   margin-top: 16px;
 }
 
 .list-item-name {
   display: flex;
   align-items: center;
 }
 
 .list-item-name .item-icon {
   margin-right: 8px;
   color: #606266;
 }
 </style>
 ```
 
 ## API 文档
 
 ### Tree Attributes
 
 | 参数 | 说明 | 类型 | 可选值 | 默认值 |
 |------|------|------|--------|--------|
 | data | 展示数据 | Array | — | — |
 | empty-text | 内容为空的时候展示的文本 | String | — | — |
 | props | 配置选项，具体看下表 | Object | — | — |
 | highlight-current | 是否高亮当前选中节点 | Boolean | — | false |
 | default-expand-all | 是否默认展开所有节点 | Boolean | — | false |
 | expand-on-click-node | 是否在点击节点的时候展开或者收缩节点 | Boolean | — | true |
 | check-on-click-node | 是否在点击节点的时候选中节点 | Boolean | — | false |
 | auto-expand-parent | 展开子节点的时候是否自动展开父节点 | Boolean | — | true |
 | default-expanded-keys | 默认展开的节点的 key 的数组 | Array | — | — |
 | show-checkbox | 节点是否可被选择 | Boolean | — | false |
 | check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法 | Boolean | — | false |
 | default-checked-keys | 默认勾选的节点的 key 的数组 | Array | — | — |
 | current-node-key | 当前选中的节点 | String/Number | — | — |
 | filter-node-method | 对树节点进行筛选时执行的方法 | Function(value, data, node) | — | — |
 | accordion | 是否每次只打开一个同级树节点展开 | Boolean | — | false |
 | indent | 相邻级节点间的水平缩进，单位为像素 | Number | — | 16 |
 | icon | 自定义树节点的图标 | String/Component | — | — |
 | lazy | 是否懒加载子节点，需与 load 方法结合使用 | Boolean | — | false |
 | load | 加载子树数据的方法，仅当 lazy 属性为true 时生效 | Function(node, resolve) | — | — |
 | draggable | 是否开启拖拽节点功能 | Boolean | — | false |
 | allow-drag | 判断节点能否被拖拽 | Function(node) | — | — |
 | allow-drop | 拖拽时判定目标节点能否被放置 | Function(draggingNode, dropNode, type) | — | — |
 | node-key | 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 | String | — | — |
 | height | 树的高度，必须设置 | Number | — | — |
 | item-size | 每个节点的高度 | Number | — | 26 |
 | perfMode | 性能模式，大数据场景下建议开启 | Boolean | — | true |
 
 ### Tree Props
 
 | 参数 | 说明 | 类型 | 默认值 |
 |------|------|------|--------|
 | label | 指定节点标签为节点对象的某个属性值 | String/Function(data, node) | — |
 | children | 指定子树为节点对象的某个属性值 | String | — |
 | disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | String/Function(data, node) | — |
 | isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | String/Function(data, node) | — |
 | class | 自定义节点类名 | String/Function(data, node) | — |
 
 ### Tree Events
 
 | 事件名称 | 说明 | 回调参数 |
 |----------|------|----------|
 | node-click | 节点被点击时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
 | node-contextmenu | 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
 | check-change | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
 | check | 当复选框被点击的时候触发 | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性 |
 | current-change | 当前选中节点变化时触发的事件 | 共两个参数，依次为：当前节点的数据，当前节点的 Node 对象 |
 | node-expand | 节点被展开时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
 | node-collapse | 节点被关闭时触发的事件 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
 | node-drag-start | 节点开始拖拽时触发的事件 | 共两个参数，依次为：被拖拽节点对应的 Node、event |
 | node-drag-enter | 拖拽进入其他节点时触发的事件 | 共三个参数，依次为：被拖拽节点对应的 Node、所进入节点对应的 Node、event |
 | node-drag-leave | 拖拽离开某个节点时触发的事件 | 共三个参数，依次为：被拖拽节点对应的 Node、所离开节点对应的 Node、event |
 | node-drag-over | 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件） | 共三个参数，依次为：被拖拽节点对应的 Node、当前进入节点对应的 Node、event |
 | node-drag-end | 拖拽结束时（可能未成功）触发的事件 | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点（可能为空）、被拖拽节点的放置位置（before、after、inner）、event |
 | node-drop | 拖拽成功完成时触发的事件 | 共四个参数，依次为：被拖拽节点对应的 Node、结束拖拽时最后进入的节点、被拖拽节点的放置位置（before、after、inner）、event |
 
 ### Tree Methods
 
 | 方法名 | 说明 | 参数 |
 |--------|------|------|
 | filter | 对树节点进行筛选操作 | 接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数 |
 | updateKeyChildren | 通过 keys 设置节点子元素，使用此方法必须设置 node-key 属性 | (key, data) 接收两个参数，1. 节点 key 2. 节点数据的数组 |
 | getCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组 | (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false |
 | setCheckedNodes | 设置目前勾选的节点，使用此方法必须设置 node-key 属性 | (nodes) 接收勾选节点数据的数组 |
 | getCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组 | (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false |
 | setCheckedKeys | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性 | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型，若为 true 则仅设置叶子节点的选中状态，默认值为 false |
 | setChecked | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性 | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中  3. boolean 类型，是否设置子节点 ，默认为 false |
 | getHalfCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组 | — |
 | getHalfCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组 | — |
 | getCurrentKey | 获取当前被焦点选中的节点的 key，使用此方法必须设置 node-key 属性，若没有节点被选中则返回 null | — |
 | getCurrentNode | 获取当前被焦点选中的节点的 data，若没有节点被选中则返回 null | — |
 | setCurrentKey | 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (key) 待被选节点的 key，若为 null 则取消当前高亮的节点 |
 | setCurrentNode | 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (node) 待被选节点的 node |
 | getNode | 根据 data 或者 key 拿到 Tree 组件中的 node | (data) 要获得 node 的 key 或者 data |
 | remove | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性 | (data) 要删除的节点的 data 或者 node |
 | append | 为 Tree 中的一个节点追加一个子节点 | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node |
 | insertBefore | 为 Tree 的一个节点的前面增加一个节点 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node |
 | insertAfter | 为 Tree 的一个节点的后面增加一个节点 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node |
 
 ### Tree Slots
 
 | 插槽名 | 说明 | 参数 |
 |--------|------|------|
 | default | 自定义树节点的内容 | { node, data } |
 | empty | 内容为空时的占位符 | — |
 
 ## 最佳实践
 
 ### 性能优化
 
 1. **启用性能模式**：
    ```javascript
    // 大数据场景下建议开启性能模式
    <el-tree-v2 :perf-mode="true" />
    ```
 
 2. **合理设置高度**：
    ```javascript
    // 必须设置固定高度以启用虚拟滚动
    <el-tree-v2 :height="400" />
    ```
 
 3. **优化节点渲染**：
    ```javascript
    // 避免在节点模板中进行复杂计算
    // 将计算结果预处理到数据中
    const processedData = computed(() => {
      return rawData.value.map(item => ({
        ...item,
        displayText: formatDisplayText(item),
        statusColor: getStatusColor(item.status)
      }))
    })
    ```
 
 4. **懒加载优化**：
    ```javascript
    // 使用懒加载减少初始渲染压力
    const loadNode = async (node, resolve) => {
      try {
        const children = await fetchNodeChildren(node.data.id)
        resolve(children)
      } catch (error) {
        console.error('加载失败:', error)
        resolve([])
      }
    }
    ```
 
 ### 数据处理
 
 1. **数据结构优化**：
    ```javascript
    // 推荐的数据结构
    const treeData = [
      {
        id: 'unique-id',
        label: '显示文本',
        children: [],
        // 其他业务字段
        type: 'folder',
        status: 'active',
        metadata: {}
      }
    ]
    ```
 
 2. **搜索过滤优化**：
    ```javascript
    // 使用防抖优化搜索性能
    import { debounce } from 'lodash-es'
    
    const debouncedFilter = debounce((keyword) => {
      filteredData.value = filterTreeData(originalData.value, keyword)
    }, 300)
    ```
 
 3. **状态管理**：
    ```javascript
    // 使用 Pinia 管理复杂的树状态
    import { defineStore } from 'pinia'
    
    export const useTreeStore = defineStore('tree', {
      state: () => ({
        treeData: [],
        selectedKeys: [],
        expandedKeys: []
      }),
      actions: {
        updateTreeData(data) {
          this.treeData = data
        },
        toggleNode(key) {
          const index = this.expandedKeys.indexOf(key)
          if (index > -1) {
            this.expandedKeys.splice(index, 1)
          } else {
            this.expandedKeys.push(key)
          }
        }
      }
    })
    ```
 
 ### 用户体验
 
 1. **加载状态**：
    ```vue
    <template>
      <div v-loading="loading" class="tree-container">
        <el-tree-v2
          :data="treeData"
          :height="400"
          lazy
          :load="loadNode"
        />
      </div>
    </template>
    ```
 
 2. **错误处理**：
    ```javascript
    const loadNode = async (node, resolve) => {
      try {
        const children = await api.getChildren(node.data.id)
        resolve(children)
      } catch (error) {
        ElMessage.error('加载失败，请重试')
        resolve([])
      }
    }
    ```
 
 3. **键盘导航**：
    ```vue
    <el-tree-v2
      @keydown="handleKeydown"
      tabindex="0"
    />
    ```
 
 ### 响应式设计
 
 1. **自适应高度**：
    ```javascript
    import { useWindowSize } from '@vueuse/core'
    
    const { height } = useWindowSize()
    const treeHeight = computed(() => height.value - 200)
    ```
 
 2. **移动端适配**：
    ```css
    @media (max-width: 768px) {
      .tree-container {
        padding: 8px;
      }
      
      .tree-node {
        padding: 12px 8px;
        font-size: 16px;
      }
    }
    ```
 
 ## 常见问题
 
 ### 1. 树形数据不显示
 
 **问题**：树形组件没有显示任何数据
 
 **原因**：
 - 未设置 `height` 属性
 - 数据结构不正确
 - `props` 配置错误
 
 **解决方案**：
 ```vue
 <template>
   <!-- 必须设置 height -->
   <el-tree-v2
     :data="treeData"
     :height="400"
     :props="{
       children: 'children',
       label: 'label'
     }"
   />
 </template>
 
 <script setup>
 // 确保数据结构正确
 const treeData = ref([
   {
     id: 1,
     label: '节点1',
     children: [
       {
         id: 2,
         label: '子节点1'
       }
     ]
   }
 ])
 </script>
 ```
 
 ### 2. 懒加载不生效
 
 **问题**：设置了 `lazy` 但子节点不会动态加载
 
 **原因**：
 - 未正确实现 `load` 方法
 - 节点数据缺少 `isLeaf` 标识
 - `resolve` 回调未正确调用
 
 **解决方案**：
 ```javascript
 const props = {
   children: 'children',
   label: 'label',
   isLeaf: 'isLeaf' // 重要：指定叶子节点标识
 }
 
 const loadNode = (node, resolve) => {
   // 根节点
   if (node.level === 0) {
     return resolve(rootData)
   }
   
   // 异步加载子节点
   setTimeout(() => {
     const children = generateChildren(node.data)
     resolve(children) // 必须调用 resolve
   }, 500)
 }
 ```
 
 ### 3. 自定义节点内容不显示
 
 **问题**：使用插槽自定义节点内容但不显示
 
 **原因**：
 - 插槽语法错误
 - 作用域插槽参数错误
 - CSS 样式覆盖
 
 **解决方案**：
 ```vue
 <template>
   <el-tree-v2 :data="data" :height="400">
     <!-- 正确的插槽语法 -->
     <template #default="{ node, data }">
       <div class="custom-node">
         <span>{{ data.label }}</span>
         <el-button size="small" @click.stop="handleEdit(data)">
           编辑
         </el-button>
       </div>
     </template>
   </el-tree-v2>
 </template>
 
 <style scoped>
 .custom-node {
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
 }
 </style>
 ```
 
 ### 4. 拖拽功能异常
 
 **问题**：拖拽功能不工作或行为异常
 
 **原因**：
 - 未设置 `node-key`
 - `allow-drag` 或 `allow-drop` 返回值错误
 - 事件处理逻辑错误
 
 **解决方案**：
 ```vue
 <template>
   <el-tree-v2
     :data="data"
     :height="400"
     draggable
     node-key="id"
     :allow-drag="allowDrag"
     :allow-drop="allowDrop"
     @node-drop="handleDrop"
   />
 </template>
 
 <script setup>
 const allowDrag = (draggingNode) => {
   // 返回 boolean 值
   return !draggingNode.data.disabled
 }
 
 const allowDrop = (draggingNode, dropNode, type) => {
   // 检查拖拽规则
   if (type === 'inner' && dropNode.data.type === 'file') {
     return false
   }
   return true
 }
 
 const handleDrop = (draggingNode, dropNode, dropType) => {
   console.log('拖拽完成', {
     from: draggingNode.data,
     to: dropNode.data,
     type: dropType
   })
 }
 </script>
 ```
 
 ### 5. 性能问题
 
 **问题**：大量数据时出现卡顿
 
 **原因**：
 - 未启用虚拟滚动
 - 节点渲染过于复杂
 - 频繁的数据更新
 
 **解决方案**：
 ```vue
 <template>
   <!-- 启用性能模式 -->
   <el-tree-v2
     :data="data"
     :height="400"
     :perf-mode="true"
     :item-size="32"
   >
     <template #default="{ data }">
       <!-- 简化节点内容 -->
       <span>{{ data.label }}</span>
     </template>
   </el-tree-v2>
 </template>
 
 <script setup>
 // 使用 shallowRef 优化大数据
 import { shallowRef } from 'vue'
 
 const data = shallowRef([])
 
 // 批量更新数据
 const updateData = (newData) => {
   data.value = newData
 }
 </script>
 ```
 
 ## 总结
 
 Virtualized Tree 虚拟化树形控件是 Element Plus 中处理大量层级数据的最佳选择。通过本文档的学习，你应该掌握了：
 
 ### 核心优势
 
 1. **高性能**：虚拟滚动技术，支持万级数据展示
 2. **功能丰富**：支持选择、搜索、拖拽、懒加载等功能
 3. **高度可定制**：灵活的插槽和配置选项
 4. **易于使用**：简洁的 API 设计
 
 ### 适用场景
 
 - 组织架构管理
 - 文件目录浏览
 - 分类数据展示
 - 权限树管理
 - 大数据量的层级结构
 
 ### 关键要点
 
 1. **必须设置 height**：启用虚拟滚动的前提
 2. **合理使用懒加载**：优化大数据场景的性能
 3. **注意数据结构**：确保符合组件要求的格式
 4. **性能优化**：启用性能模式，简化节点渲染
 5. **用户体验**：提供加载状态和错误处理
 
通过合理使用 Virtualized Tree 组件，你可以构建出高性能、用户友好的树形数据展示界面。
 
 ## 参考资料
 
 - [Element Plus Virtualized Tree 官方文档](https://element-plus.org/zh-CN/component/tree-v2.html)
 - [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
 - [虚拟滚动原理](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Virtual_scrolling)
 - [树形数据结构最佳实践](https://zh.javascript.info/tree-structure)