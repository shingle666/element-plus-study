# Pagination 分页组件

## 概述

Pagination 分页组件用于在数据量较大时，将数据分页展示，提供页码导航功能。它是数据展示中不可缺少的组件，能够有效提升用户体验和页面性能。

## 学习目标

通过本文档的学习，你将掌握：

1. Pagination 组件的基础用法
2. 不同的分页布局和样式
3. 分页组件的事件处理
4. 与表格组件的结合使用
5. 分页组件的性能优化
6. 实际项目中的应用场景

## 基础用法

### 基础分页
最简单的分页组件：

```vue
<template>
  <div>
    <p>当前页：{{ currentPage }}，每页：{{ pageSize }}，总数：{{ total }}</p>
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

### 完整功能分页
包含所有功能的分页组件：

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
  console.log(`每页 ${val} 条`)
  ElMessage.info(`每页显示 ${val} 条数据`)
  // 重新加载数据
  loadData()
}

const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`)
  ElMessage.info(`跳转到第 ${val} 页`)
  // 重新加载数据
  loadData()
}

const loadData = () => {
  console.log('加载数据...', {
    page: currentPage.value,
    size: pageSize.value
  })
}
</script>
```

### 小型分页
适用于空间有限的场景：

```vue
<template>
  <div>
    <h4>小型分页</h4>
    <el-pagination
      small
      v-model:current-page="currentPage"
      :total="total"
      layout="prev, pager, next"
    />
    
    <h4>背景色分页</h4>
    <el-pagination
      background
      v-model:current-page="currentPage"
      :total="total"
      layout="prev, pager, next"
    />
    
    <h4>小型背景色分页</h4>
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

## 分页布局

### 自定义布局
通过 `layout` 属性自定义分页组件的布局：

```vue
<template>
  <div class="pagination-layouts">
    <div class="layout-item">
      <h4>基础布局</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>带总数</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="total, prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>带页面大小选择器</h4>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next"
      />
    </div>
    
    <div class="layout-item">
      <h4>带跳转</h4>
      <el-pagination
        v-model:current-page="currentPage"
        :total="total"
        layout="prev, pager, next, jumper"
      />
    </div>
    
    <div class="layout-item">
      <h4>完整布局</h4>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
    
    <div class="layout-item">
      <h4>自定义布局顺序</h4>
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

### 响应式分页
根据屏幕尺寸调整分页布局：

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
    // 手机端：只显示基础导航
    return 'prev, pager, next'
  } else if (screenWidth.value < 768) {
    // 平板端：显示总数和基础导航
    return 'total, prev, pager, next'
  } else {
    // 桌面端：显示完整功能
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

## 与表格结合

### 表格分页示例
完整的表格分页功能：

```vue
<template>
  <div class="table-pagination">
    <!-- 搜索和操作区域 -->
    <div class="table-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或邮箱"
        style="width: 300px"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <div class="header-actions">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button @click="refreshData">刷新</el-button>
      </div>
    </div>
    
    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="department" label="部门" width="120" />
      <el-table-column prop="position" label="职位" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '在职' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="editUser(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination-info">
        <span>已选择 {{ selectedRows.length }} 项</span>
        <el-button 
          v-if="selectedRows.length > 0" 
          size="small" 
          type="danger" 
          @click="batchDelete"
        >
          批量删除
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

// 模拟数据生成
const generateUsers = (page, size, keyword = '') => {
  const allUsers = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: ['技术部', '市场部', '人事部', '财务部'][index % 4],
    position: ['工程师', '经理', '主管', '专员'][index % 4],
    status: index % 5 === 0 ? '离职' : '在职',
    createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }))
  
  // 搜索过滤
  let filteredUsers = allUsers
  if (keyword) {
    filteredUsers = allUsers.filter(user => 
      user.name.includes(keyword) || user.email.includes(keyword)
    )
  }
  
  // 分页
  const start = (page - 1) * size
  const end = start + size
  
  return {
    data: filteredUsers.slice(start, end),
    total: filteredUsers.length
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = generateUsers(
      pagination.currentPage, 
      pagination.pageSize, 
      searchKeyword.value
    )
    
    tableData.value = result.data
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 防抖搜索
const handleSearch = debounce(() => {
  pagination.currentPage = 1
  loadData()
}, 300)

// 分页事件处理
const handleSizeChange = () => {
  pagination.currentPage = 1
  loadData()
}

const handleCurrentChange = () => {
  loadData()
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 操作方法
const addUser = () => {
  ElMessage.info('添加用户功能')
}

const editUser = (user) => {
  ElMessage.info(`编辑用户：${user.name}`)
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success('删除成功')
    loadData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    ElMessage.success(`已删除 ${selectedRows.value.length} 个用户`)
    selectedRows.value = []
    loadData()
  } catch {
    ElMessage.info('已取消删除')
  }
}

const refreshData = () => {
  searchKeyword.value = ''
  pagination.currentPage = 1
  loadData()
}

// 监听搜索关键词变化
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

## 高级功能

### 自定义分页器
创建自定义的分页组件：

```vue
<template>
  <div class="custom-pagination">
    <div class="pagination-info">
      <span>显示第 {{ startIndex }} 到第 {{ endIndex }} 项，共 {{ total }} 项</span>
    </div>
    
    <div class="pagination-controls">
      <!-- 首页 -->
      <el-button 
        :disabled="currentPage === 1" 
        @click="goToPage(1)"
        size="small"
      >
        首页
      </el-button>
      
      <!-- 上一页 -->
      <el-button 
        :disabled="currentPage === 1" 
        @click="goToPage(currentPage - 1)"
        size="small"
      >
        上一页
      </el-button>
      
      <!-- 页码 -->
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
      
      <!-- 下一页 -->
      <el-button 
        :disabled="currentPage === totalPages" 
        @click="goToPage(currentPage + 1)"
        size="small"
      >
        下一页
      </el-button>
      
      <!-- 末页 -->
      <el-button 
        :disabled="currentPage === totalPages" 
        @click="goToPage(totalPages)"
        size="small"
      >
        末页
      </el-button>
    </div>
    
    <div class="pagination-jumper">
      <span>跳转到</span>
      <el-input
        v-model="jumpPage"
        size="small"
        style="width: 60px; margin: 0 5px"
        @keyup.enter="handleJump"
      />
      <span>页</span>
      <el-button size="small" @click="handleJump">确定</el-button>
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
    // 总页数小于等于最大显示页数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于最大显示页数，需要计算显示范围
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
    ElMessage.warning('请输入有效的页码')
    return
  }
  
  if (page < 1 || page > totalPages.value) {
    ElMessage.warning(`页码范围：1 - ${totalPages.value}`)
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

### 无限滚动分页
实现无限滚动的分页效果：

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
          <span class="item-author">作者：{{ item.author }}</span>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    
    <!-- 没有更多数据 -->
    <div v-if="!hasMore && dataList.length > 0" class="no-more">
      <span>没有更多数据了</span>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!loading && dataList.length === 0" class="empty-state">
      <el-empty description="暂无数据" />
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

// 生成模拟数据
const generateData = (page, size) => {
  const categories = ['技术', '产品', '设计', '运营', '市场']
  const authors = ['张三', '李四', '王五', '赵六', '钱七']
  
  return Array.from({ length: size }, (_, index) => {
    const id = (page - 1) * size + index + 1
    return {
      id,
      title: `文章标题 ${id}`,
      content: `这是第 ${id} 篇文章的内容摘要，包含了一些有趣的信息和见解。文章内容丰富，值得一读。`,
      category: categories[id % categories.length],
      author: authors[id % authors.length],
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }
  })
}

// 加载数据
const loadData = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  try {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newData = generateData(currentPage.value, pageSize)
    dataList.value.push(...newData)
    currentPage.value++
    
    // 模拟数据总量限制
    if (dataList.value.length >= 200) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 滚动事件处理
const handleScroll = () => {
  const container = scrollContainer.value
  if (!container) return
  
  const { scrollTop, scrollHeight, clientHeight } = container
  
  // 当滚动到底部附近时加载更多数据
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadData()
  }
}

// 节流函数
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

## API 文档

### Pagination Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| small | 是否使用小型分页样式 | boolean | — | false |
| background | 是否为分页按钮添加背景色 | boolean | — | false |
| page-size | 每页显示条目个数 | number | — | 10 |
| total | 总条目数 | number | — | — |
| page-count | 总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能 | number | — | — |
| pager-count | 页码按钮的数量，当总页数超过该值时会折叠 | number | 大于等于 5 且小于等于 21 的奇数 | 7 |
| current-page | 当前页数 | number | — | 1 |
| layout | 组件布局，子组件名用逗号分隔 | string | sizes, prev, pager, next, jumper, ->, total, slot | 'prev, pager, next, jumper, ->, total' |
| page-sizes | 每页显示个数选择器的选项设置 | number[] | — | [10, 20, 50, 100] |
| popper-class | 每页显示个数选择器的下拉框类名 | string | — | — |
| prev-text | 替代图标显示的上一页文字 | string | — | — |
| next-text | 替代图标显示的下一页文字 | string | — | — |
| disabled | 是否禁用 | boolean | — | false |
| hide-on-single-page | 只有一页时是否隐藏 | boolean | — | — |

### Pagination Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| size-change | pageSize 改变时会触发 | 每页条数 |
| current-change | currentPage 改变时会触发 | 当前页 |
| prev-click | 用户点击上一页按钮改变当前页后触发 | 当前页 |
| next-click | 用户点击下一页按钮改变当前页后触发 | 当前页 |

### Pagination Slots

| 插槽名 | 说明 |
|--------|------|
| — | 自定义内容，需要在 layout 中列出 slot |

## 最佳实践

### 性能优化

1. **合理设置页面大小**：
   - 根据数据复杂度和网络状况设置合适的 pageSize
   - 提供多种页面大小选项供用户选择

2. **数据缓存**：
   - 缓存已加载的页面数据
   - 避免重复请求相同数据

3. **懒加载**：
   - 对于图片等资源使用懒加载
   - 减少初始加载时间

### 用户体验

1. **加载状态**：
   - 显示加载指示器
   - 提供友好的错误提示

2. **响应式设计**：
   - 适配不同屏幕尺寸
   - 移动端优化

3. **快捷操作**：
   - 提供快速跳转功能
   - 支持键盘导航

### 可访问性

1. **语义化标签**：
   - 使用正确的 ARIA 标签
   - 提供屏幕阅读器支持

2. **键盘导航**：
   - 支持 Tab 键导航
   - 支持回车键确认

## 总结

Pagination 分页组件是数据展示中的重要组件，通过本文档的学习，你应该能够：

1. 熟练使用 Pagination 组件的各种功能
2. 掌握分页与表格的结合使用
3. 了解不同场景下的分页实现方案
4. 掌握分页组件的性能优化技巧
5. 理解分页组件的最佳实践

在实际项目中，根据具体需求选择合适的分页方案，注意性能优化和用户体验，就能构建出高质量的数据展示界面。

## 参考资料

- [Element Plus Pagination 官方文档](https://element-plus.org/zh-CN/component/pagination.html)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [无限滚动最佳实践](https://web.dev/infinite-scroll/)