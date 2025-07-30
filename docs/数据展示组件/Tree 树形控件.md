# Tree 树形控件

## 概述

Tree 树形控件用于展示具有层级关系的数据结构，如文件目录、组织架构、分类菜单等。Element Plus 的 Tree 组件提供了丰富的功能，包括节点选择、展开折叠、拖拽排序、懒加载等，能够满足各种复杂的业务需求。

## 学习目标

通过本文档的学习，你将掌握：

1. Tree 组件的基础用法和数据结构
2. 树形节点的各种操作方式
3. 树形选择功能的实现
4. 树形拖拽排序的应用
5. 树形懒加载的性能优化
6. 自定义节点内容的渲染
7. 树形搜索过滤功能
8. 树形组件的性能优化技巧

## 基础用法

### 基础树形结构
最简单的树形展示：

```vue
<template>
  <div class="basic-tree-demo">
    <h4>基础树形结构</h4>
    <el-tree
      :data="basicTreeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const basicTreeData = ref([
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

const defaultProps = {
  children: 'children',
  label: 'label'
}

const handleNodeClick = (data) => {
  ElMessage.info(`点击了节点：${data.label}`)
}
</script>

<style scoped>
.basic-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.basic-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}
</style>
```

### 可选择树形
带有复选框的树形结构：

```vue
<template>
  <div class="selectable-tree-demo">
    <div class="demo-section">
      <h4>可选择树形（复选框）</h4>
      <el-tree
        ref="treeRef"
        :data="selectableTreeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        @check-change="handleCheckChange"
      />
      
      <div class="tree-actions">
        <el-button @click="getCheckedNodes">获取选中节点</el-button>
        <el-button @click="getCheckedKeys">获取选中键值</el-button>
        <el-button @click="setCheckedNodes">设置选中节点</el-button>
        <el-button @click="resetChecked">重置选择</el-button>
      </div>
    </div>
    
    <div class="demo-section">
      <h4>单选树形</h4>
      <el-tree
        :data="selectableTreeData"
        :props="defaultProps"
        :highlight-current="true"
        node-key="id"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const treeRef = ref()

const selectableTreeData = ref([
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

const defaultProps = {
  children: 'children',
  label: 'label'
}

const handleCheckChange = (data, checked, indeterminate) => {
  console.log('节点选择变化：', data, checked, indeterminate)
}

const handleCurrentChange = (data, node) => {
  ElMessage.info(`当前选中：${data ? data.label : '无'}`)
}

const getCheckedNodes = () => {
  const checkedNodes = treeRef.value.getCheckedNodes()
  ElMessage.info(`选中节点数量：${checkedNodes.length}`)
  console.log('选中的节点：', checkedNodes)
}

const getCheckedKeys = () => {
  const checkedKeys = treeRef.value.getCheckedKeys()
  ElMessage.info(`选中键值：${checkedKeys.join(', ')}`)
}

const setCheckedNodes = () => {
  treeRef.value.setCheckedKeys([1, 4, 9])
  ElMessage.success('已设置选中节点')
}

const resetChecked = () => {
  treeRef.value.setCheckedKeys([])
  ElMessage.success('已重置选择')
}
</script>

<style scoped>
.selectable-tree-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 20px;
}

.demo-section {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.demo-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.tree-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
```

### 自定义节点内容
使用插槽自定义节点的显示内容：

```vue
<template>
  <div class="custom-tree-demo">
    <h4>自定义节点内容</h4>
    <el-tree
      :data="customTreeData"
      :props="defaultProps"
      node-key="id"
      :default-expanded-keys="[1, 2]"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <div class="node-content">
            <el-icon class="node-icon">
              <component :is="getNodeIcon(data)" />
            </el-icon>
            <span class="node-label">{{ node.label }}</span>
            <el-tag v-if="data.type" :type="getTagType(data.type)" size="small">
              {{ data.type }}
            </el-tag>
          </div>
          <div class="node-actions">
            <el-button
              size="small"
              type="primary"
              @click="() => append(data)"
            >
              添加
            </el-button>
            <el-button
              size="small"
              @click="() => edit(data)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Picture, VideoPlay } from '@element-plus/icons-vue'

let id = 1000

const customTreeData = ref([
  {
    id: 1,
    label: '项目文件夹',
    type: 'folder',
    children: [
      {
        id: 4,
        label: 'src',
        type: 'folder',
        children: [
          {
            id: 9,
            label: 'main.js',
            type: 'file'
          },
          {
            id: 10,
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
            id: 11,
            label: 'index.html',
            type: 'file'
          },
          {
            id: 12,
            label: 'favicon.ico',
            type: 'image'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '媒体文件',
    type: 'folder',
    children: [
      {
        id: 6,
        label: 'images',
        type: 'folder',
        children: [
          {
            id: 13,
            label: 'logo.png',
            type: 'image'
          }
        ]
      },
      {
        id: 7,
        label: 'videos',
        type: 'folder',
        children: [
          {
            id: 14,
            label: 'intro.mp4',
            type: 'video'
          }
        ]
      }
    ]
  }
])

const defaultProps = {
  children: 'children',
  label: 'label'
}

const getNodeIcon = (data) => {
  switch (data.type) {
    case 'folder':
      return Folder
    case 'image':
      return Picture
    case 'video':
      return VideoPlay
    default:
      return Document
  }
}

const getTagType = (type) => {
  switch (type) {
    case 'folder':
      return 'primary'
    case 'file':
      return 'success'
    case 'image':
      return 'warning'
    case 'video':
      return 'danger'
    default:
      return 'info'
  }
}

const append = async (data) => {
  try {
    const { value: name } = await ElMessageBox.prompt('请输入节点名称', '添加节点', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    
    const newChild = {
      id: id++,
      label: name,
      type: data.type === 'folder' ? 'file' : 'folder',
      children: []
    }
    
    if (!data.children) {
      data.children = []
    }
    data.children.push(newChild)
    ElMessage.success('添加成功')
  } catch {
    ElMessage.info('已取消添加')
  }
}

const edit = async (data) => {
  try {
    const { value: name } = await ElMessageBox.prompt('请输入新名称', '编辑节点', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: data.label
    })
    
    data.label = name
    ElMessage.success('编辑成功')
  } catch {
    ElMessage.info('已取消编辑')
  }
}

const remove = async (node, data) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除节点 "${data.label}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const parent = node.parent
    const children = parent.data.children || parent.data
    const index = children.findIndex(d => d.id === data.id)
    children.splice(index, 1)
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}
</script>

<style scoped>
.custom-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.custom-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.node-icon {
  color: #606266;
}

.node-label {
  font-size: 14px;
  color: #303133;
}

.node-actions {
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}
</style>
```

## 高级功能

### 树形拖拽排序
支持节点拖拽重新排序：

```vue
<template>
  <div class="draggable-tree-demo">
    <h4>可拖拽树形</h4>
    <div class="demo-controls">
      <el-switch
        v-model="draggable"
        active-text="启用拖拽"
        inactive-text="禁用拖拽"
      />
    </div>
    
    <el-tree
      :data="draggableTreeData"
      :props="defaultProps"
      :draggable="draggable"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      node-key="id"
      @node-drop="handleDrop"
    >
      <template #default="{ node, data }">
        <div class="draggable-node">
          <el-icon class="drag-handle">
            <component :is="getDragIcon(data)" />
          </el-icon>
          <span>{{ node.label }}</span>
          <el-tag v-if="data.level" size="small" type="info">
            Level {{ data.level }}
          </el-tag>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Menu } from '@element-plus/icons-vue'

const draggable = ref(true)

const draggableTreeData = ref([
  {
    id: 1,
    label: '一级 1',
    level: 1,
    type: 'folder',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        level: 2,
        type: 'folder',
        children: [
          {
            id: 9,
            label: '三级 1-1-1',
            level: 3,
            type: 'file'
          },
          {
            id: 10,
            label: '三级 1-1-2',
            level: 3,
            type: 'file'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '一级 2',
    level: 1,
    type: 'folder',
    children: [
      {
        id: 5,
        label: '二级 2-1',
        level: 2,
        type: 'file'
      },
      {
        id: 6,
        label: '二级 2-2',
        level: 2,
        type: 'file'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    level: 1,
    type: 'folder',
    children: [
      {
        id: 7,
        label: '二级 3-1',
        level: 2,
        type: 'file'
      },
      {
        id: 8,
        label: '二级 3-2',
        level: 2,
        type: 'file'
      }
    ]
  }
])

const defaultProps = {
  children: 'children',
  label: 'label'
}

const getDragIcon = (data) => {
  if (data.type === 'folder') {
    return Folder
  } else if (data.type === 'file') {
    return Document
  }
  return Menu
}

const allowDrop = (draggingNode, dropNode, type) => {
  // 不允许拖拽到根节点之外
  if (dropNode.data.level === 1 && type === 'prev') {
    return false
  }
  
  // 文件不能包含子节点
  if (dropNode.data.type === 'file' && type === 'inner') {
    return false
  }
  
  return true
}

const allowDrag = (draggingNode) => {
  // 可以根据需要限制某些节点不能拖拽
  return draggingNode.data.label.indexOf('三级') === -1
}

const handleDrop = (draggingNode, dropNode, dropType, ev) => {
  ElMessage.success(`拖拽成功：${draggingNode.data.label} -> ${dropNode.data.label} (${dropType})`)
  console.log('拖拽详情：', {
    dragging: draggingNode.data,
    drop: dropNode.data,
    type: dropType
  })
}
</script>

<style scoped>
.draggable-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.draggable-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.demo-controls {
  margin-bottom: 20px;
}

.draggable-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  color: #909399;
  cursor: move;
}
</style>
```

### 树形懒加载
大数据量时使用懒加载提升性能：

```vue
<template>
  <div class="lazy-tree-demo">
    <h4>懒加载树形</h4>
    <div class="demo-info">
      <p>节点数据将在展开时动态加载</p>
      <el-button @click="refreshTree">刷新树形</el-button>
    </div>
    
    <el-tree
      :props="lazyProps"
      :load="loadNode"
      lazy
      show-checkbox
      node-key="id"
      @check-change="handleLazyCheckChange"
    >
      <template #default="{ node, data }">
        <div class="lazy-node">
          <el-icon>
            <component :is="getLazyNodeIcon(data)" />
          </el-icon>
          <span>{{ node.label }}</span>
          <el-tag v-if="node.loading" size="small" type="warning">加载中...</el-tag>
          <el-tag v-else-if="data.children && data.children.length" size="small" type="success">
            {{ data.children.length }} 项
          </el-tag>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Loading } from '@element-plus/icons-vue'

const lazyProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf'
}

const getLazyNodeIcon = (data) => {
  if (data.loading) {
    return Loading
  }
  return data.leaf ? Document : Folder
}

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    // 根节点
    setTimeout(() => {
      resolve([
        {
          id: 'region1',
          name: '华北地区',
          leaf: false
        },
        {
          id: 'region2',
          name: '华东地区',
          leaf: false
        },
        {
          id: 'region3',
          name: '华南地区',
          leaf: false
        }
      ])
    }, 500)
    return
  }
  
  if (node.level > 3) {
    // 超过3级的节点设为叶子节点
    resolve([])
    return
  }
  
  // 模拟异步加载
  setTimeout(() => {
    const data = []
    for (let i = 1; i <= Math.floor(Math.random() * 5) + 1; i++) {
      data.push({
        id: `${node.data.id}-${i}`,
        name: `${node.data.name}-子节点${i}`,
        leaf: node.level >= 2 // 第3级设为叶子节点
      })
    }
    resolve(data)
  }, Math.random() * 1000 + 500) // 随机延迟
}

const handleLazyCheckChange = (data, checked, indeterminate) => {
  console.log('懒加载节点选择变化：', data, checked, indeterminate)
}

const refreshTree = () => {
  ElMessage.info('树形组件已刷新')
  // 在实际应用中，这里可以重新加载根节点数据
}
</script>

<style scoped>
.lazy-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.lazy-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.demo-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.demo-info p {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.lazy-node {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

### 树形搜索过滤
实现树形数据的搜索和过滤功能：

```vue
<template>
  <div class="filterable-tree-demo">
    <h4>可搜索树形</h4>
    
    <div class="search-controls">
      <el-input
        v-model="filterText"
        placeholder="输入关键字进行过滤"
        clearable
        @input="handleFilterChange"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <div class="filter-options">
        <el-checkbox v-model="highlightMatch">高亮匹配</el-checkbox>
        <el-checkbox v-model="expandOnFilter">过滤时展开</el-checkbox>
      </div>
    </div>
    
    <el-tree
      ref="filterTreeRef"
      :data="filterableTreeData"
      :props="defaultProps"
      :filter-node-method="filterNode"
      node-key="id"
      :default-expand-all="expandOnFilter && filterText"
    >
      <template #default="{ node, data }">
        <div class="filterable-node">
          <el-icon>
            <component :is="getFilterNodeIcon(data)" />
          </el-icon>
          <span 
            class="node-text"
            :class="{ 'highlight': highlightMatch && isMatched(data.label) }"
            v-html="getHighlightedText(data.label)"
          ></span>
          <el-tag v-if="data.category" size="small" :type="getCategoryType(data.category)">
            {{ data.category }}
          </el-tag>
        </div>
      </template>
    </el-tree>
    
    <div v-if="filterText && !hasMatchedNodes" class="no-results">
      <el-empty description="没有找到匹配的节点" :image-size="60" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { Search, Folder, Document, User, Setting } from '@element-plus/icons-vue'

const filterTreeRef = ref()
const filterText = ref('')
const highlightMatch = ref(true)
const expandOnFilter = ref(true)
const hasMatchedNodes = ref(true)

const filterableTreeData = ref([
  {
    id: 1,
    label: '系统管理',
    category: 'system',
    children: [
      {
        id: 4,
        label: '用户管理',
        category: 'user',
        children: [
          {
            id: 9,
            label: '用户列表',
            category: 'page'
          },
          {
            id: 10,
            label: '角色管理',
            category: 'page'
          },
          {
            id: 11,
            label: '权限设置',
            category: 'page'
          }
        ]
      },
      {
        id: 5,
        label: '系统设置',
        category: 'setting',
        children: [
          {
            id: 12,
            label: '基础配置',
            category: 'page'
          },
          {
            id: 13,
            label: '安全设置',
            category: 'page'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '内容管理',
    category: 'content',
    children: [
      {
        id: 6,
        label: '文章管理',
        category: 'article',
        children: [
          {
            id: 14,
            label: '文章列表',
            category: 'page'
          },
          {
            id: 15,
            label: '分类管理',
            category: 'page'
          }
        ]
      },
      {
        id: 7,
        label: '媒体库',
        category: 'media',
        children: [
          {
            id: 16,
            label: '图片管理',
            category: 'page'
          },
          {
            id: 17,
            label: '视频管理',
            category: 'page'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    label: '数据统计',
    category: 'analytics',
    children: [
      {
        id: 8,
        label: '访问统计',
        category: 'stats'
      },
      {
        id: 18,
        label: '用户行为分析',
        category: 'stats'
      }
    ]
  }
])

const defaultProps = {
  children: 'children',
  label: 'label'
}

const getFilterNodeIcon = (data) => {
  switch (data.category) {
    case 'system':
    case 'setting':
      return Setting
    case 'user':
      return User
    case 'content':
    case 'article':
    case 'media':
      return Folder
    default:
      return Document
  }
}

const getCategoryType = (category) => {
  const typeMap = {
    system: 'danger',
    user: 'primary',
    setting: 'warning',
    content: 'success',
    article: 'info',
    media: 'warning',
    analytics: 'primary',
    stats: 'success',
    page: 'info'
  }
  return typeMap[category] || 'info'
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const isMatched = (text) => {
  if (!filterText.value) return false
  return text.toLowerCase().includes(filterText.value.toLowerCase())
}

const getHighlightedText = (text) => {
  if (!highlightMatch.value || !filterText.value) {
    return text
  }
  
  const regex = new RegExp(`(${filterText.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const handleFilterChange = () => {
  // 检查是否有匹配的节点
  checkMatchedNodes()
}

const checkMatchedNodes = () => {
  if (!filterText.value) {
    hasMatchedNodes.value = true
    return
  }
  
  const checkNode = (nodes) => {
    for (const node of nodes) {
      if (filterNode(filterText.value, node)) {
        return true
      }
      if (node.children && checkNode(node.children)) {
        return true
      }
    }
    return false
  }
  
  hasMatchedNodes.value = checkNode(filterableTreeData.value)
}

watch(filterText, (val) => {
  filterTreeRef.value?.filter(val)
  
  if (expandOnFilter.value && val) {
    nextTick(() => {
      // 展开所有匹配的节点
      const expandMatchedNodes = (nodes) => {
        nodes.forEach(node => {
          if (node.children) {
            const hasMatchedChild = node.children.some(child => 
              filterNode(val, child) || (child.children && hasMatchedChild)
            )
            if (hasMatchedChild) {
              filterTreeRef.value?.getNode(node.id)?.expand()
            }
            expandMatchedNodes(node.children)
          }
        })
      }
      expandMatchedNodes(filterableTreeData.value)
    })
  }
})
</script>

<style scoped>
.filterable-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.filterable-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.search-controls {
  margin-bottom: 20px;
}

.filter-options {
  margin-top: 10px;
  display: flex;
  gap: 15px;
}

.filterable-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-text {
  flex: 1;
}

.node-text.highlight {
  font-weight: 500;
}

.node-text :deep(mark) {
  background-color: #f56c6c;
  color: white;
  padding: 1px 2px;
  border-radius: 2px;
}

.no-results {
  margin-top: 20px;
  text-align: center;
}
</style>
```

## 实际应用示例

### 组织架构树
企业组织架构管理系统：

```vue
<template>
  <div class="organization-tree-demo">
    <div class="demo-header">
      <h3>组织架构管理</h3>
      <div class="header-actions">
        <el-button type="primary" @click="addDepartment">
          <el-icon><Plus /></el-icon>
          添加部门
        </el-button>
        <el-button @click="expandAll">展开全部</el-button>
        <el-button @click="collapseAll">收起全部</el-button>
      </div>
    </div>
    
    <div class="tree-container">
      <el-tree
        ref="orgTreeRef"
        :data="organizationData"
        :props="orgProps"
        node-key="id"
        :default-expanded-keys="[1]"
        draggable
        :allow-drop="allowOrgDrop"
        @node-drop="handleOrgDrop"
      >
        <template #default="{ node, data }">
          <div class="org-node">
            <div class="node-info">
              <el-avatar 
                :size="24" 
                :src="data.avatar" 
                :icon="data.type === 'department' ? OfficeBuilding : User"
              />
              <div class="node-details">
                <div class="node-name">{{ data.name }}</div>
                <div class="node-meta">
                  <span class="position">{{ data.position || data.type }}</span>
                  <span v-if="data.employeeCount" class="count">
                    {{ data.employeeCount }}人
                  </span>
                </div>
              </div>
            </div>
            
            <div class="node-actions">
              <el-dropdown @command="handleOrgCommand">
                <el-button size="small" type="text">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ action: 'view', data }">查看详情</el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'edit', data }">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="data.type === 'department'" :command="{ action: 'addChild', data }">
                      添加子部门
                    </el-dropdown-item>
                    <el-dropdown-item :command="{ action: 'addEmployee', data }">添加员工</el-dropdown-item>
                    <el-dropdown-item divided :command="{ action: 'delete', data }" class="danger">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    
    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="详细信息" width="500px">
      <div v-if="selectedNode" class="detail-content">
        <div class="detail-header">
          <el-avatar :size="60" :src="selectedNode.avatar" />
          <div class="detail-info">
            <h4>{{ selectedNode.name }}</h4>
            <p>{{ selectedNode.position || selectedNode.type }}</p>
          </div>
        </div>
        
        <el-descriptions :column="1" border>
          <el-descriptions-item label="类型">
            {{ selectedNode.type === 'department' ? '部门' : '员工' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedNode.email" label="邮箱">
            {{ selectedNode.email }}
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedNode.phone" label="电话">
            {{ selectedNode.phone }}
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedNode.employeeCount" label="员工数量">
            {{ selectedNode.employeeCount }}人
          </el-descriptions-item>
          <el-descriptions-item v-if="selectedNode.description" label="描述">
            {{ selectedNode.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, OfficeBuilding, User, MoreFilled } from '@element-plus/icons-vue'

const orgTreeRef = ref()
const detailDialogVisible = ref(false)
const selectedNode = ref(null)

const organizationData = ref([
  {
    id: 1,
    name: '科技有限公司',
    type: 'department',
    position: '总公司',
    employeeCount: 156,
    description: '一家专注于技术创新的公司',
    children: [
      {
        id: 2,
        name: '技术部',
        type: 'department',
        position: '技术部门',
        employeeCount: 45,
        children: [
          {
            id: 5,
            name: '前端组',
            type: 'department',
            position: '前端开发组',
            employeeCount: 15,
            children: [
              {
                id: 9,
                name: '张三',
                type: 'employee',
                position: '前端工程师',
                email: 'zhangsan@company.com',
                phone: '138****1234',
                avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
              },
              {
                id: 10,
                name: '李四',
                type: 'employee',
                position: '高级前端工程师',
                email: 'lisi@company.com',
                phone: '139****5678'
              }
            ]
          },
          {
            id: 6,
            name: '后端组',
            type: 'department',
            position: '后端开发组',
            employeeCount: 20,
            children: [
              {
                id: 11,
                name: '王五',
                type: 'employee',
                position: 'Java工程师',
                email: 'wangwu@company.com',
                phone: '137****9012'
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '市场部',
        type: 'department',
        position: '市场营销部',
        employeeCount: 25,
        children: [
          {
            id: 7,
            name: '赵六',
            type: 'employee',
            position: '市场经理',
            email: 'zhaoliu@company.com',
            phone: '136****3456'
          }
        ]
      },
      {
        id: 4,
        name: '人事部',
        type: 'department',
        position: '人力资源部',
        employeeCount: 12,
        children: [
          {
            id: 8,
            name: '孙七',
            type: 'employee',
            position: 'HR专员',
            email: 'sunqi@company.com',
            phone: '135****7890'
          }
        ]
      }
    ]
  }
])

const orgProps = {
  children: 'children',
  label: 'name'
}

const allowOrgDrop = (draggingNode, dropNode, type) => {
  // 员工不能包含子节点
  if (dropNode.data.type === 'employee' && type === 'inner') {
    return false
  }
  
  // 不允许将部门拖拽到员工下面
  if (draggingNode.data.type === 'department' && dropNode.data.type === 'employee') {
    return false
  }
  
  return true
}

const handleOrgDrop = (draggingNode, dropNode, dropType) => {
  ElMessage.success(`组织架构调整成功：${draggingNode.data.name} -> ${dropNode.data.name}`)
  // 这里可以调用API更新组织架构
}

const handleOrgCommand = ({ action, data }) => {
  switch (action) {
    case 'view':
      selectedNode.value = data
      detailDialogVisible.value = true
      break
    case 'edit':
      ElMessage.info(`编辑：${data.name}`)
      break
    case 'addChild':
      ElMessage.info(`为 ${data.name} 添加子部门`)
      break
    case 'addEmployee':
      ElMessage.info(`为 ${data.name} 添加员工`)
      break
    case 'delete':
      handleDelete(data)
      break
  }
}

const handleDelete = async (data) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${data.name}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
  } catch {
    ElMessage.info('已取消删除')
  }
}

const addDepartment = () => {
  ElMessage.info('添加新部门')
}

const expandAll = () => {
  // 展开所有节点
  const expandNode = (nodes) => {
    nodes.forEach(node => {
      orgTreeRef.value?.getNode(node.id)?.expand()
      if (node.children) {
        expandNode(node.children)
      }
    })
  }
  expandNode(organizationData.value)
}

const collapseAll = () => {
  // 收起所有节点
  const collapseNode = (nodes) => {
    nodes.forEach(node => {
      if (node.children) {
        collapseNode(node.children)
        orgTreeRef.value?.getNode(node.id)?.collapse()
      }
    })
  }
  collapseNode(organizationData.value)
}
</script>

<style scoped>
.organization-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: white;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.demo-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.tree-container {
  max-height: 600px;
  overflow-y: auto;
}

.org-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
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

.node-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #909399;
}

.position {
  color: #606266;
}

.count {
  color: #409eff;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.org-node:hover .node-actions {
  opacity: 1;
}

.detail-content {
  padding: 10px 0;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.detail-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
}

.detail-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

:deep(.el-dropdown-menu__item.danger) {
  color: #f56c6c;
}
</style>
```

## API 文档

### Tree Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| data | 展示数据 | array | — | — |
| empty-text | 内容为空的时候展示的文本 | string | — | — |
| node-key | 每个树节点用来作为唯一标识的属性 | string | — | — |
| props | 配置选项 | object | — | — |
| render-after-expand | 是否在第一次展开某个树节点后才渲染其子节点 | boolean | — | true |
| load | 加载子树数据的方法，仅当 lazy 属性为true 时生效 | function(node, resolve) | — | — |
| render-content | 树节点的内容区的渲染 Function | Function(h, { node, data, store }) | — | — |
| highlight-current | 是否高亮当前选中节点 | boolean | — | false |
| default-expand-all | 是否默认展开所有节点 | boolean | — | false |
| expand-on-click-node | 是否在点击节点的时候展开或者收缩节点 | boolean | — | true |
| check-on-click-node | 是否在点击节点的时候选中节点 | boolean | — | false |
| auto-expand-parent | 展开子节点的时候是否自动展开父节点 | boolean | — | true |
| default-expanded-keys | 默认展开的节点的 key 的数组 | array | — | — |
| show-checkbox | 节点是否可被选择 | boolean | — | false |
| check-strictly | 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法 | boolean | — | false |
| default-checked-keys | 默认勾选的节点的 key 的数组 | array | — | — |
| current-node-key | 当前选中的节点 | string, number | — | — |
| filter-node-method | 对树节点进行筛选时执行的方法 | Function(value, data, node) | — | — |
| accordion | 是否每次只打开一个同级树节点展开 | boolean | — | false |
| indent | 相邻级节点间的水平缩进，单位为像素 | number | — | 18 |
| icon | 自定义树节点的图标 | string / Component | — | — |
| lazy | 是否懒加载子节点，需与 load 方法结合使用 | boolean | — | false |
| draggable | 是否开启拖拽节点功能 | boolean | — | false |
| allow-drag | 判断节点能否被拖拽 | Function(node) | — | — |
| allow-drop | 拖拽时判定目标节点能否被放置 | Function(draggingNode, dropNode, type) | — | — |

### Tree Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| node-click | 节点被点击时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| node-contextmenu | 当某一节点被鼠标右键点击时会触发该事件 | 共四个参数，依次为：event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身 |
| check-change | 节点选中状态发生变化时的回调 | 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点 |
| check | 当复选框被点击的时候触发 | 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象 |
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
| setChecked | 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node-key 属性 | (key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点，默认为 false |
| getHalfCheckedNodes | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点所组成的数组 | — |
| getHalfCheckedKeys | 若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组 | — |
| getCurrentKey | 获取当前被焦点的节点的 key，使用此方法必须设置 node-key 属性 | — |
| getCurrentNode | 获取当前被焦点的节点，使用此方法必须设置 node-key 属性 | — |
| setCurrentKey | 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (key) 待被选节点的 key，若为 null 则取消当前高亮的节点 |
| setCurrentNode | 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性 | (node) 待被选节点的 node |
| getNode | 根据 data 或者 key 拿到 Tree 组件中的 node | (data) 要获得 node 的 key 或者 data |
| remove | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性 | (data) 要删除的节点的 data 或者 node |
| append | 为 Tree 中的一个节点追加一个子节点 | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node |
| insertBefore | 为 Tree 的一个节点的前面增加一个节点 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的位置的 data、key 或者 node |
| insertAfter | 为 Tree 的一个节点的后面增加一个节点 | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的位置的 data、key 或者 node |

### Tree Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义树节点的内容，参数为 { node, data } | — |
| empty | 内容为空的时候的占位符 | — |

### props 配置项

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 指定节点标签为节点对象的某个属性值 | string, function(data, node) | — |
| children | 指定子树为节点对象的某个属性值 | string | — |
| disabled | 指定节点选择框是否禁用为节点对象的某个属性值 | string, function(data, node) | — |
| isLeaf | 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效 | string, function(data, node) | — |
| class | 自定义节点类名 | string, function(data, node) | — |

## 性能优化

### 虚拟滚动
对于大量数据的树形结构，可以考虑使用虚拟滚动：

```vue
<template>
  <div class="virtual-tree-demo">
    <h4>虚拟滚动树形（大数据量）</h4>
    <div class="tree-stats">
      <el-tag>总节点数：{{ totalNodes }}</el-tag>
      <el-tag type="success">可见节点数：{{ visibleNodes }}</el-tag>
    </div>
    
    <div class="virtual-tree-container">
      <el-tree
        ref="virtualTreeRef"
        :data="virtualTreeData"
        :props="defaultProps"
        node-key="id"
        :render-after-expand="false"
        :default-expand-all="false"
        virtual
        :height="400"
        :item-size="26"
      >
        <template #default="{ node, data }">
          <div class="virtual-node">
            <span>{{ node.label }}</span>
            <el-tag v-if="data.level" size="small">
              Level {{ data.level }}
            </el-tag>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const virtualTreeRef = ref()
const virtualTreeData = ref([])

const totalNodes = computed(() => {
  const countNodes = (nodes) => {
    let count = 0
    nodes.forEach(node => {
      count++
      if (node.children) {
        count += countNodes(node.children)
      }
    })
    return count
  }
  return countNodes(virtualTreeData.value)
})

const visibleNodes = computed(() => {
  // 这里可以根据实际的可见区域计算
  return Math.min(totalNodes.value, 15)
})

const defaultProps = {
  children: 'children',
  label: 'label'
}

// 生成大量测试数据
const generateLargeTreeData = () => {
  const data = []
  let id = 1
  
  for (let i = 1; i <= 10; i++) {
    const level1 = {
      id: id++,
      label: `一级节点 ${i}`,
      level: 1,
      children: []
    }
    
    for (let j = 1; j <= 20; j++) {
      const level2 = {
        id: id++,
        label: `二级节点 ${i}-${j}`,
        level: 2,
        children: []
      }
      
      for (let k = 1; k <= 10; k++) {
        level2.children.push({
          id: id++,
          label: `三级节点 ${i}-${j}-${k}`,
          level: 3
        })
      }
      
      level1.children.push(level2)
    }
    
    data.push(level1)
  }
  
  return data
}

onMounted(() => {
  virtualTreeData.value = generateLargeTreeData()
})
</script>

<style scoped>
.virtual-tree-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.virtual-tree-demo h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.tree-stats {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

.virtual-tree-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.virtual-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;
}
</style>
```

### 懒加载优化
对于动态数据，合理使用懒加载可以显著提升性能：

```javascript
// 懒加载最佳实践
const loadNode = async (node, resolve) => {
  try {
    // 显示加载状态
    node.loading = true
    
    // 调用API获取数据
    const response = await api.getTreeNodes({
      parentId: node.data?.id || null,
      level: node.level
    })
    
    // 处理数据
    const children = response.data.map(item => ({
      ...item,
      leaf: item.type === 'file' // 根据业务逻辑判断是否为叶子节点
    }))
    
    resolve(children)
  } catch (error) {
    console.error('加载节点失败：', error)
    resolve([])
  } finally {
    node.loading = false
  }
}
```

## 最佳实践

### 数据结构设计

1. **统一的数据格式**：
```javascript
const treeNodeStructure = {
  id: 'unique_id',           // 唯一标识
  label: 'display_name',     // 显示名称
  children: [],              // 子节点数组
  disabled: false,           // 是否禁用
  leaf: false,              // 是否为叶子节点
  level: 1,                 // 节点层级
  type: 'folder',           // 节点类型
  metadata: {}              // 额外数据
}
```

2. **性能考虑**：
- 避免过深的嵌套层级（建议不超过5层）
- 单个节点的子节点数量控制在合理范围内
- 使用懒加载处理大数据量

### 用户体验优化

1. **交互反馈**：
```javascript
// 提供清晰的操作反馈
const handleNodeOperation = async (operation, node) => {
  const loading = ElLoading.service({
    target: '.tree-container',
    text: '处理中...'
  })
  
  try {
    await performOperation(operation, node)
    ElMessage.success('操作成功')
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  } finally {
    loading.close()
  }
}
```

2. **键盘导航支持**：
```javascript
// 支持键盘操作
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      // 上下箭头导航
      break
    case 'ArrowLeft':
      // 折叠节点
      break
    case 'ArrowRight':
      // 展开节点
      break
    case 'Enter':
    case ' ':
      // 选择节点
      break
  }
}
```

### 可访问性

1. **ARIA 属性**：
```vue
<el-tree
  :data="treeData"
  role="tree"
  :aria-label="'文件目录树'"
  :aria-multiselectable="showCheckbox"
>
  <template #default="{ node, data }">
    <div
      :role="'treeitem'"
      :aria-expanded="node.expanded"
      :aria-selected="node.checked"
      :aria-level="node.level"
    >
      {{ node.label }}
    </div>
  </template>
</el-tree>
```

2. **焦点管理**：
```javascript
// 确保焦点在树形组件内正确移动
const manageFocus = () => {
  const currentNode = treeRef.value.getCurrentNode()
  if (currentNode) {
    // 将焦点设置到当前选中的节点
    const nodeElement = treeRef.value.$el.querySelector(`[data-key="${currentNode.key}"]`)
    nodeElement?.focus()
  }
}
```

## 常见问题

### 1. 数据更新不响应

**问题**：修改树形数据后，视图没有更新。

**解决方案**：
```javascript
// 错误做法
data.children.push(newNode) // 直接修改可能不会触发响应式更新

// 正确做法
data.children = [...data.children, newNode]
// 或者使用 Vue 3 的响应式 API
import { nextTick } from 'vue'
data.children.push(newNode)
await nextTick() // 等待 DOM 更新
```

### 2. 节点选择状态异常

**问题**：父子节点选择状态不同步。

**解决方案**：
```vue
<el-tree
  :check-strictly="false"  <!-- 确保父子节点关联 -->
  :check-on-click-node="false"  <!-- 避免点击节点时意外选择 -->
/>
```

### 3. 拖拽功能限制

**问题**：需要限制某些节点的拖拽行为。

**解决方案**：
```javascript
const allowDrag = (draggingNode) => {
  // 根据业务规则限制拖拽
  return !draggingNode.data.readonly && 
         draggingNode.data.type !== 'system'
}

const allowDrop = (draggingNode, dropNode, type) => {
  // 限制放置位置
  if (dropNode.data.type === 'file' && type === 'inner') {
    return false // 文件不能包含子节点
  }
  return true
}
```

## 总结

Tree 树形控件是 Element Plus 中功能最丰富的组件之一，适用于各种层级数据的展示和操作。通过本文档的学习，你应该能够：

1. 掌握 Tree 组件的基础用法和配置
2. 实现复杂的树形交互功能
3. 优化大数据量下的性能表现
4. 提供良好的用户体验和可访问性
5. 解决常见的开发问题

在实际项目中，建议根据具体的业务需求选择合适的功能组合，并注意性能优化和用户体验的平衡。

## 参考资料

- [Element Plus Tree 官方文档](https://element-plus.org/zh-CN/component/tree.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [树形数据结构最佳实践](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tree_role)