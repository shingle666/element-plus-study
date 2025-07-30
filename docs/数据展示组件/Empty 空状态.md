# Empty 空状态组件

## 概述

Empty 空状态组件用于在没有数据或内容为空时向用户展示友好的提示信息。它能够提升用户体验，避免用户在面对空白页面时产生困惑，并可以引导用户进行相应的操作。

## 学习目标

通过本文档的学习，你将掌握：

1. Empty 组件的基础用法
2. 自定义空状态的图片和描述
3. 空状态的操作按钮设计
4. 不同场景下的空状态应用
5. 空状态组件的最佳实践
6. 与其他组件的结合使用

## 基础用法

### 基础空状态
最简单的空状态展示：

```vue
<template>
  <div>
    <h4>基础空状态</h4>
    <el-empty description="暂无数据" />
    
    <h4>无描述空状态</h4>
    <el-empty />
  </div>
</template>

<style scoped>
h4 {
  margin: 20px 0 10px 0;
  color: #303133;
}
</style>
```

### 自定义图片
使用自定义图片替换默认的空状态图标：

```vue
<template>
  <div class="custom-empty-demo">
    <div class="empty-item">
      <h4>自定义图片 URL</h4>
      <el-empty
        image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        description="找不到相关数据"
      />
    </div>
    
    <div class="empty-item">
      <h4>自定义图片大小</h4>
      <el-empty
        image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        :image-size="200"
        description="数据为空"
      />
    </div>
    
    <div class="empty-item">
      <h4>使用 SVG 图片</h4>
      <el-empty description="网络连接失败">
        <template #image>
          <svg viewBox="0 0 1024 1024" width="64" height="64">
            <path
              d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
              fill="#faad14"
            />
            <path
              d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"
              fill="#faad14"
            />
          </svg>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<style scoped>
.custom-empty-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.empty-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.empty-item h4 {
  margin: 0 0 15px 0;
  color: #303133;
  text-align: center;
}
</style>
```

### 自定义操作
为空状态添加操作按钮：

```vue
<template>
  <div class="empty-actions-demo">
    <div class="demo-section">
      <h4>单个操作按钮</h4>
      <el-empty description="暂无收藏内容">
        <el-button type="primary" @click="goToBrowse">去浏览</el-button>
      </el-empty>
    </div>
    
    <div class="demo-section">
      <h4>多个操作按钮</h4>
      <el-empty description="购物车为空">
        <div class="empty-actions">
          <el-button @click="continueShopping">继续购物</el-button>
          <el-button type="primary" @click="viewRecommendations">查看推荐</el-button>
        </div>
      </el-empty>
    </div>
    
    <div class="demo-section">
      <h4>带图标的操作</h4>
      <el-empty description="暂无通知消息">
        <div class="empty-actions">
          <el-button @click="refreshNotifications">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          <el-button type="primary" @click="createNotification">
            <el-icon><Plus /></el-icon>
            创建通知
          </el-button>
        </div>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Refresh, Plus } from '@element-plus/icons-vue'

const goToBrowse = () => {
  ElMessage.info('跳转到浏览页面')
}

const continueShopping = () => {
  ElMessage.info('继续购物')
}

const viewRecommendations = () => {
  ElMessage.info('查看推荐商品')
}

const refreshNotifications = () => {
  ElMessage.info('刷新通知列表')
}

const createNotification = () => {
  ElMessage.info('创建新通知')
}
</script>

<style scoped>
.empty-actions-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.demo-section {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.demo-section h4 {
  margin: 0 0 20px 0;
  color: #303133;
  text-align: center;
}

.empty-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
```

## 不同场景应用

### 数据列表空状态
在数据列表为空时的应用：

```vue
<template>
  <div class="data-list-demo">
    <div class="list-header">
      <h3>用户列表</h3>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索用户"
          style="width: 200px; margin-right: 10px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="addUser">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <el-table 
      :data="filteredUsers" 
      v-loading="loading"
      style="width: 100%"
      height="400"
    >
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="department" label="部门" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '在职' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="editUser(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
      
      <!-- 空状态插槽 -->
      <template #empty>
        <div class="table-empty">
          <el-empty v-if="!searchKeyword" description="暂无用户数据">
            <el-button type="primary" @click="addUser">
              <el-icon><Plus /></el-icon>
              添加第一个用户
            </el-button>
          </el-empty>
          
          <el-empty v-else description="未找到匹配的用户">
            <div class="search-empty-actions">
              <el-button @click="clearSearch">清空搜索</el-button>
              <el-button type="primary" @click="addUser">添加用户</el-button>
            </div>
          </el-empty>
        </div>
      </template>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const searchKeyword = ref('')

const users = ref([
  // 初始为空数组，模拟无数据状态
  // { name: '张三', email: 'zhangsan@example.com', department: '技术部', status: '在职' },
  // { name: '李四', email: 'lisi@example.com', department: '市场部', status: '在职' },
])

const filteredUsers = computed(() => {
  if (!searchKeyword.value) {
    return users.value
  }
  return users.value.filter(user => 
    user.name.includes(searchKeyword.value) || 
    user.email.includes(searchKeyword.value)
  )
})

const handleSearch = () => {
  // 搜索逻辑
}

const addUser = () => {
  ElMessage.info('打开添加用户对话框')
  // 模拟添加用户
  users.value.push({
    name: `用户${users.value.length + 1}`,
    email: `user${users.value.length + 1}@example.com`,
    department: '技术部',
    status: '在职'
  })
}

const editUser = (user) => {
  ElMessage.info(`编辑用户：${user.name}`)
}

const deleteUser = (user) => {
  const index = users.value.findIndex(u => u.email === user.email)
  if (index > -1) {
    users.value.splice(index, 1)
    ElMessage.success('删除成功')
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}
</script>

<style scoped>
.data-list-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
}

.table-empty {
  padding: 40px 20px;
}

.search-empty-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
```

### 页面级空状态
整个页面内容为空时的处理：

```vue
<template>
  <div class="page-empty-demo">
    <div class="page-container">
      <!-- 导航栏 -->
      <div class="page-header">
        <h2>我的项目</h2>
        <el-button type="primary" @click="createProject">
          <el-icon><Plus /></el-icon>
          新建项目
        </el-button>
      </div>
      
      <!-- 内容区域 -->
      <div class="page-content">
        <div v-if="projects.length > 0" class="projects-grid">
          <div 
            v-for="project in projects" 
            :key="project.id" 
            class="project-card"
          >
            <h4>{{ project.name }}</h4>
            <p>{{ project.description }}</p>
            <div class="card-actions">
              <el-button size="small" @click="openProject(project)">打开</el-button>
              <el-button size="small" type="danger" @click="deleteProject(project)">删除</el-button>
            </div>
          </div>
        </div>
        
        <!-- 页面级空状态 -->
        <div v-else class="page-empty">
          <el-empty
            image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            :image-size="120"
            description="还没有创建任何项目"
          >
            <div class="empty-content">
              <p class="empty-tip">创建您的第一个项目，开始您的工作之旅</p>
              <div class="empty-actions">
                <el-button type="primary" size="large" @click="createProject">
                  <el-icon><Plus /></el-icon>
                  创建项目
                </el-button>
                <el-button size="large" @click="importProject">
                  <el-icon><Upload /></el-icon>
                  导入项目
                </el-button>
              </div>
              <div class="help-links">
                <el-link type="primary" @click="viewTutorial">查看教程</el-link>
                <span class="divider">|</span>
                <el-link type="primary" @click="viewExamples">示例项目</el-link>
              </div>
            </div>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Upload } from '@element-plus/icons-vue'

const projects = ref([
  // 初始为空，展示空状态
])

const createProject = () => {
  ElMessage.info('打开创建项目对话框')
  // 模拟创建项目
  projects.value.push({
    id: Date.now(),
    name: `项目 ${projects.value.length + 1}`,
    description: '这是一个新创建的项目'
  })
}

const importProject = () => {
  ElMessage.info('打开导入项目对话框')
}

const openProject = (project) => {
  ElMessage.info(`打开项目：${project.name}`)
}

const deleteProject = (project) => {
  const index = projects.value.findIndex(p => p.id === project.id)
  if (index > -1) {
    projects.value.splice(index, 1)
    ElMessage.success('项目删除成功')
  }
}

const viewTutorial = () => {
  ElMessage.info('跳转到教程页面')
}

const viewExamples = () => {
  ElMessage.info('查看示例项目')
}
</script>

<style scoped>
.page-empty-demo {
  min-height: 600px;
  background: #f5f7fa;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.page-content {
  min-height: 500px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.project-card p {
  margin: 0 0 15px 0;
  color: #606266;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.page-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-tip {
  margin: 20px 0;
  color: #606266;
  font-size: 16px;
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
}

.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.divider {
  color: #dcdfe6;
}
</style>
```

### 错误状态
网络错误或其他异常情况的空状态：

```vue
<template>
  <div class="error-states-demo">
    <div class="state-grid">
      <!-- 网络错误 -->
      <div class="state-item">
        <h4>网络错误</h4>
        <el-empty description="网络连接失败，请检查网络设置">
          <template #image>
            <svg viewBox="0 0 1024 1024" width="64" height="64">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1 1.9-11.2c1.5-1.2 3.5-1.9 5.6-1.8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130.1 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
                fill="#ff4d4f"
              />
            </svg>
          </template>
          <div class="error-actions">
            <el-button @click="retryConnection">
              <el-icon><Refresh /></el-icon>
              重试
            </el-button>
            <el-button type="primary" @click="checkNetworkSettings">检查网络</el-button>
          </div>
        </el-empty>
      </div>
      
      <!-- 服务器错误 -->
      <div class="state-item">
        <h4>服务器错误</h4>
        <el-empty description="服务器暂时无法响应，请稍后再试">
          <template #image>
            <svg viewBox="0 0 1024 1024" width="64" height="64">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"
                fill="#faad14"
              />
            </svg>
          </template>
          <div class="error-actions">
            <el-button @click="retryRequest">
              <el-icon><Refresh /></el-icon>
              重新加载
            </el-button>
            <el-button @click="contactSupport">联系客服</el-button>
          </div>
        </el-empty>
      </div>
      
      <!-- 权限不足 -->
      <div class="state-item">
        <h4>权限不足</h4>
        <el-empty description="您没有权限访问此内容">
          <template #image>
            <svg viewBox="0 0 1024 1024" width="64" height="64">
              <path
                d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 1 0-56 0z"
                fill="#722ed1"
              />
            </svg>
          </template>
          <div class="error-actions">
            <el-button @click="requestAccess">申请权限</el-button>
            <el-button type="primary" @click="switchAccount">切换账号</el-button>
          </div>
        </el-empty>
      </div>
      
      <!-- 页面不存在 -->
      <div class="state-item">
        <h4>页面不存在</h4>
        <el-empty description="抱歉，您访问的页面不存在">
          <template #image>
            <div class="not-found-image">
              <span class="not-found-text">404</span>
            </div>
          </template>
          <div class="error-actions">
            <el-button @click="goHome">
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
            <el-button type="primary" @click="goBack">返回上页</el-button>
          </div>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Refresh, House } from '@element-plus/icons-vue'

const retryConnection = () => {
  ElMessage.info('正在重试连接...')
}

const checkNetworkSettings = () => {
  ElMessage.info('打开网络设置')
}

const retryRequest = () => {
  ElMessage.info('正在重新加载...')
}

const contactSupport = () => {
  ElMessage.info('联系客服')
}

const requestAccess = () => {
  ElMessage.info('申请访问权限')
}

const switchAccount = () => {
  ElMessage.info('切换账号')
}

const goHome = () => {
  ElMessage.info('返回首页')
}

const goBack = () => {
  ElMessage.info('返回上一页')
}
</script>

<style scoped>
.error-states-demo {
  padding: 20px;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.state-item {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: white;
}

.state-item h4 {
  margin: 0 0 20px 0;
  color: #303133;
  text-align: center;
  font-size: 16px;
}

.error-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.not-found-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.not-found-text {
  color: white;
  font-size: 24px;
  font-weight: bold;
}
</style>
```

## 高级功能

### 动态空状态
根据不同条件显示不同的空状态：

```vue
<template>
  <div class="dynamic-empty-demo">
    <div class="controls">
      <h3>动态空状态演示</h3>
      <div class="control-buttons">
        <el-button @click="setState('loading')">加载中</el-button>
        <el-button @click="setState('empty')">无数据</el-button>
        <el-button @click="setState('error')">错误</el-button>
        <el-button @click="setState('success')">有数据</el-button>
      </div>
    </div>
    
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="currentState === 'loading'" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>
      
      <!-- 成功状态 -->
      <div v-else-if="currentState === 'success'" class="success-state">
        <el-table :data="mockData" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="department" label="部门" />
        </el-table>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="currentState === 'error'" class="error-state">
        <el-empty description="加载失败，请重试">
          <template #image>
            <svg viewBox="0 0 1024 1024" width="64" height="64">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1 1.9-11.2c1.5-1.2 3.5-1.9 5.6-1.8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130.1 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
                fill="#ff4d4f"
              />
            </svg>
          </template>
          <el-button type="primary" @click="retryLoad">
            <el-icon><Refresh /></el-icon>
            重新加载
          </el-button>
        </el-empty>
      </div>
      
      <!-- 空数据状态 -->
      <div v-else class="empty-state">
        <el-empty description="暂无数据">
          <el-button type="primary" @click="addData">
            <el-icon><Plus /></el-icon>
            添加数据
          </el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Plus } from '@element-plus/icons-vue'

const currentState = ref('empty')

const mockData = [
  { name: '张三', email: 'zhangsan@example.com', department: '技术部' },
  { name: '李四', email: 'lisi@example.com', department: '市场部' },
  { name: '王五', email: 'wangwu@example.com', department: '人事部' }
]

const setState = (state) => {
  currentState.value = state
  ElMessage.info(`切换到${getStateLabel(state)}状态`)
}

const getStateLabel = (state) => {
  const labels = {
    loading: '加载中',
    empty: '空数据',
    error: '错误',
    success: '成功'
  }
  return labels[state] || '未知'
}

const retryLoad = () => {
  setState('loading')
  setTimeout(() => {
    setState('success')
  }, 2000)
}

const addData = () => {
  setState('success')
  ElMessage.success('数据添加成功')
}
</script>

<style scoped>
.dynamic-empty-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.controls {
  margin-bottom: 30px;
}

.controls h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.control-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.content-area {
  min-height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
}

.loading-state,
.success-state,
.error-state,
.empty-state {
  height: 100%;
}
</style>
```

### 自定义空状态组件
创建可复用的自定义空状态组件：

```vue
<!-- CustomEmpty.vue -->
<template>
  <div class="custom-empty">
    <div class="empty-image">
      <slot name="image">
        <img v-if="image" :src="image" :alt="description" />
        <div v-else class="default-icon">
          <el-icon :size="iconSize"><component :is="iconComponent" /></el-icon>
        </div>
      </slot>
    </div>
    
    <div class="empty-content">
      <h4 v-if="title" class="empty-title">{{ title }}</h4>
      <p class="empty-description">{{ description }}</p>
      
      <div v-if="$slots.extra" class="empty-extra">
        <slot name="extra" />
      </div>
      
      <div v-if="$slots.default" class="empty-actions">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document, Warning, Lock, WifiOff } from '@element-plus/icons-vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error', 'network', 'permission'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: '暂无数据'
  },
  image: {
    type: String,
    default: ''
  },
  iconSize: {
    type: Number,
    default: 64
  }
})

const iconComponent = computed(() => {
  const iconMap = {
    default: Document,
    error: Warning,
    network: WifiOff,
    permission: Lock
  }
  return iconMap[props.type] || Document
})
</script>

<style scoped>
.custom-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-image {
  margin-bottom: 20px;
}

.empty-image img {
  max-width: 120px;
  height: auto;
}

.default-icon {
  color: #c0c4cc;
}

.empty-content {
  max-width: 400px;
}

.empty-title {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.empty-description {
  margin: 0 0 20px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.empty-extra {
  margin-bottom: 20px;
  color: #909399;
  font-size: 12px;
}

.empty-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
```

使用自定义空状态组件：

```vue
<template>
  <div class="custom-empty-usage">
    <div class="demo-grid">
      <div class="demo-item">
        <h4>默认类型</h4>
        <CustomEmpty 
          title="暂无内容"
          description="您还没有创建任何内容，点击下方按钮开始创建"
        >
          <el-button type="primary">创建内容</el-button>
        </CustomEmpty>
      </div>
      
      <div class="demo-item">
        <h4>错误类型</h4>
        <CustomEmpty 
          type="error"
          title="加载失败"
          description="数据加载过程中发生错误，请稍后重试"
        >
          <template #extra>
            <span>错误代码: 500</span>
          </template>
          <el-button @click="retry">重试</el-button>
          <el-button type="primary">联系客服</el-button>
        </CustomEmpty>
      </div>
      
      <div class="demo-item">
        <h4>网络类型</h4>
        <CustomEmpty 
          type="network"
          title="网络连接失败"
          description="请检查您的网络连接并重试"
        >
          <el-button type="primary">检查网络</el-button>
        </CustomEmpty>
      </div>
      
      <div class="demo-item">
        <h4>权限类型</h4>
        <CustomEmpty 
          type="permission"
          title="权限不足"
          description="您没有权限访问此内容，请联系管理员"
        >
          <el-button>申请权限</el-button>
          <el-button type="primary">切换账号</el-button>
        </CustomEmpty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import CustomEmpty from './CustomEmpty.vue'

const retry = () => {
  ElMessage.info('正在重试...')
}
</script>

<style scoped>
.custom-empty-usage {
  padding: 20px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.demo-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.demo-item h4 {
  margin: 0;
  padding: 15px 20px;
  background: #f5f7fa;
  color: #303133;
  font-size: 14px;
  border-bottom: 1px solid #ebeef5;
}
</style>
```

## API 文档

### Empty Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| image | 图片地址 | string | — | — |
| image-size | 图片大小（宽度） | number | — | — |
| description | 文本描述 | string | — | — |

### Empty Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义底部内容 |
| image | 自定义图片 |
| description | 自定义描述文字 |

## 最佳实践

### 设计原则

1. **清晰的信息传达**：
   - 使用简洁明了的描述文字
   - 选择合适的图标或插图
   - 避免使用技术术语

2. **提供明确的操作指引**：
   - 告诉用户可以做什么
   - 提供相关的操作按钮
   - 引导用户到相关页面

3. **保持一致性**：
   - 统一的视觉风格
   - 一致的交互模式
   - 标准化的文案表达

### 用户体验

1. **情感化设计**：
   - 使用友好的插图和图标
   - 避免让用户感到挫败
   - 提供积极的引导

2. **响应式设计**：
   - 适配不同屏幕尺寸
   - 移动端优化
   - 触摸友好的操作

3. **加载状态**：
   - 区分加载中和真正的空状态
   - 提供加载指示器
   - 合理的超时处理

### 技术实现

1. **组件复用**：
   - 创建通用的空状态组件
   - 支持多种类型和场景
   - 提供灵活的自定义选项

2. **状态管理**：
   - 明确区分不同的空状态类型
   - 合理的状态转换逻辑
   - 错误处理和重试机制

3. **性能优化**：
   - 图片懒加载
   - 组件按需加载
   - 避免不必要的重渲染

## 总结

Empty 空状态组件是提升用户体验的重要组件，通过本文档的学习，你应该能够：

1. 熟练使用 Empty 组件的各种功能
2. 掌握不同场景下的空状态设计
3. 了解空状态的最佳实践
4. 能够创建自定义的空状态组件
5. 理解空状态在用户体验中的重要作用

在实际项目中，合理使用空状态组件能够：
- 提升用户体验和满意度
- 减少用户的困惑和挫败感
- 引导用户进行有效的操作
- 增强产品的专业性和完整性

## 参考资料

- [Element Plus Empty 官方文档](https://element-plus.org/zh-CN/component/empty.html)
- [空状态设计指南](https://www.nngroup.com/articles/empty-states/)
- [用户体验设计原则](https://www.interaction-design.org/literature/topics/ux-design)
- [Vue 3 插槽使用指南](https://cn.vuejs.org/guide/components/slots.html)