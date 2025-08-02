# Badge 徽章

## 概述
Badge 徽章组件用于显示消息数量或状态，通常出现在图标或文字的右上角。Element Plus 的 Badge 组件支持多种样式、类型和自定义配置，适用于消息提醒、状态标识、数量显示等场景。

## 学习目标
- 掌握 Badge 组件的基础用法
- 理解不同类型和样式的徽章
- 学会使用小红点和自定义内容徽章
- 掌握徽章的位置和显示控制
- 了解徽章在实际项目中的应用

## 基础用法

### 基础徽章
最简单的徽章使用，通过 `value` 属性设置显示的数字：

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="12" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    
    <el-badge :value="3" class="item">
      <el-button size="small">回复</el-button>
    </el-badge>
    
    <el-badge :value="1" class="item" type="primary">
      <el-button size="small">评论</el-button>
    </el-badge>
    
    <el-badge :value="2" class="item" type="warning">
      <el-button size="small">回复</el-button>
    </el-badge>
  </div>
</template>

<style>
.badge-demo .item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```

### 最大值
通过 `max` 属性设置最大值，超过最大值会显示 `{max}+`：

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="200" :max="99" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    
    <el-badge :value="100" :max="10" class="item">
      <el-button size="small">回复</el-button>
    </el-badge>
  </div>
</template>
```

### 自定义内容
通过 `value` 属性设置自定义内容，也可以通过默认插槽设置：

```vue
<template>
  <div class="badge-demo">
    <el-badge value="new" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    
    <el-badge value="hot" class="item">
      <el-button size="small">回复</el-button>
    </el-badge>
    
    <el-badge class="item">
      <template #default>
        <el-icon color="#f56c6c"><ChatDotRound /></el-icon>
      </template>
      <el-button size="small">消息</el-button>
    </el-badge>
  </div>
</template>

<script setup>
import { ChatDotRound } from '@element-plus/icons-vue'
</script>
```

## 小红点

### 小红点徽章
通过 `is-dot` 属性设置为小红点模式：

```vue
<template>
  <div class="badge-demo">
    <el-badge is-dot class="item">
      <el-button class="share-button" icon="Share" />
    </el-badge>
    
    <el-badge is-dot class="item">
      <el-button class="share-button" icon="ChatDotRound" />
    </el-badge>
    
    <el-badge is-dot class="item">
      数据查询
    </el-badge>
    
    <el-badge is-dot class="item">
      <el-icon><Message /></el-icon>
    </el-badge>
  </div>
</template>

<script setup>
import { Share, ChatDotRound, Message } from '@element-plus/icons-vue'
</script>
```

## 不同类型

### 类型样式
Badge 组件提供了多种类型：`primary`、`success`、`warning`、`danger`、`info`：

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="1" class="item">
      <el-button size="small">默认</el-button>
    </el-badge>
    
    <el-badge :value="2" class="item" type="primary">
      <el-button size="small">主要</el-button>
    </el-badge>
    
    <el-badge :value="3" class="item" type="success">
      <el-button size="small">成功</el-button>
    </el-badge>
    
    <el-badge :value="4" class="item" type="warning">
      <el-button size="small">警告</el-button>
    </el-badge>
    
    <el-badge :value="5" class="item" type="danger">
      <el-button size="small">危险</el-button>
    </el-badge>
    
    <el-badge :value="6" class="item" type="info">
      <el-button size="small">信息</el-button>
    </el-badge>
  </div>
</template>
```

## 动态徽章

### 动态数值
结合响应式数据实现动态徽章：

```vue
<template>
  <div class="dynamic-badge-demo">
    <el-badge :value="dynamicValue" :max="99" class="item">
      <el-button size="small">消息</el-button>
    </el-badge>
    
    <el-badge :value="notifications" :max="999" class="item" type="danger">
      <el-button size="small">通知</el-button>
    </el-badge>
    
    <el-badge :is-dot="showDot" class="item">
      <el-button size="small">待办事项</el-button>
    </el-badge>
    
    <div class="demo-controls">
      <el-button-group>
        <el-button @click="increase">增加消息</el-button>
        <el-button @click="decrease">减少消息</el-button>
        <el-button @click="addNotification">添加通知</el-button>
        <el-button @click="toggleDot">切换小红点</el-button>
        <el-button @click="reset">重置</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dynamicValue = ref(5)
const notifications = ref(12)
const showDot = ref(true)

const increase = () => {
  dynamicValue.value++
}

const decrease = () => {
  if (dynamicValue.value > 0) {
    dynamicValue.value--
  }
}

const addNotification = () => {
  notifications.value += Math.floor(Math.random() * 10) + 1
}

const toggleDot = () => {
  showDot.value = !showDot.value
}

const reset = () => {
  dynamicValue.value = 0
  notifications.value = 0
  showDot.value = false
}
</script>

<style>
.dynamic-badge-demo .item {
  margin: 10px 20px 10px 0;
}

.dynamic-badge-demo .demo-controls {
  margin-top: 20px;
}

.dynamic-badge-demo .demo-controls .el-button {
  margin: 5px;
}
</style>
```

## 隐藏徽章

### 条件显示
通过 `hidden` 属性控制徽章的显示和隐藏：

```vue
<template>
  <div class="hidden-badge-demo">
    <el-badge :value="messageCount" :hidden="messageCount === 0" class="item">
      <el-button size="small">消息</el-button>
    </el-badge>
    
    <el-badge :value="taskCount" :hidden="hideTask" class="item" type="warning">
      <el-button size="small">任务</el-button>
    </el-badge>
    
    <el-badge :is-dot="showAlert" :hidden="!showAlert" class="item">
      <el-button size="small">提醒</el-button>
    </el-badge>
    
    <div class="demo-controls">
      <el-button @click="addMessage">添加消息</el-button>
      <el-button @click="clearMessages">清空消息</el-button>
      <el-button @click="toggleTask">切换任务显示</el-button>
      <el-button @click="toggleAlert">切换提醒</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const messageCount = ref(0)
const taskCount = ref(3)
const hideTask = ref(false)
const showAlert = ref(false)

const addMessage = () => {
  messageCount.value++
}

const clearMessages = () => {
  messageCount.value = 0
}

const toggleTask = () => {
  hideTask.value = !hideTask.value
}

const toggleAlert = () => {
  showAlert.value = !showAlert.value
}
</script>
```

## 实际应用示例

### 消息中心徽章系统
一个完整的消息中心徽章管理示例：

```vue
<template>
  <div class="message-center">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="nav-left">
        <h2>我的工作台</h2>
      </div>
      
      <div class="nav-right">
        <!-- 消息通知 -->
        <el-badge :value="totalMessages" :max="99" :hidden="totalMessages === 0" class="nav-item">
          <el-button 
            :icon="Message" 
            circle 
            @click="showMessagePanel = !showMessagePanel"
          />
        </el-badge>
        
        <!-- 任务提醒 -->
        <el-badge :value="urgentTasks" :max="9" type="danger" :hidden="urgentTasks === 0" class="nav-item">
          <el-button 
            :icon="Bell" 
            circle 
            @click="showTaskPanel = !showTaskPanel"
          />
        </el-badge>
        
        <!-- 系统通知 -->
        <el-badge :is-dot="hasSystemNotice" class="nav-item">
          <el-button 
            :icon="Warning" 
            circle 
            @click="showNoticePanel = !showNoticePanel"
          />
        </el-badge>
        
        <!-- 用户菜单 -->
        <el-badge :is-dot="hasProfileUpdate" class="nav-item">
          <el-avatar 
            :size="40" 
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            @click="showUserMenu = !showUserMenu"
          />
        </el-badge>
      </div>
    </div>
    
    <!-- 消息面板 -->
    <el-drawer v-model="showMessagePanel" title="消息中心" direction="rtl" size="400px">
      <div class="message-panel">
        <div class="message-tabs">
          <el-tabs v-model="activeMessageTab">
            <el-tab-pane label="全部" name="all">
              <el-badge :value="allMessages.length" class="tab-badge" />
            </el-tab-pane>
            <el-tab-pane label="未读" name="unread">
              <el-badge :value="unreadMessages.length" type="danger" class="tab-badge" />
            </el-tab-pane>
            <el-tab-pane label="系统" name="system">
              <el-badge :value="systemMessages.length" type="warning" class="tab-badge" />
            </el-tab-pane>
          </el-tabs>
        </div>
        
        <div class="message-list">
          <div 
            v-for="message in currentMessages" 
            :key="message.id" 
            class="message-item"
            :class="{ 'unread': !message.read }"
            @click="markAsRead(message)"
          >
            <div class="message-avatar">
              <el-badge :is-dot="!message.read" :offset="[0, 0]">
                <el-avatar :size="40" :src="message.avatar" />
              </el-badge>
            </div>
            
            <div class="message-content">
              <div class="message-title">{{ message.title }}</div>
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.time) }}</div>
            </div>
            
            <div class="message-actions">
              <el-badge :value="message.priority" v-if="message.priority" type="danger" />
            </div>
          </div>
        </div>
        
        <div class="message-actions">
          <el-button @click="markAllAsRead" :disabled="unreadMessages.length === 0">
            全部标记为已读
          </el-button>
          <el-button @click="clearAllMessages" type="danger">
            清空所有消息
          </el-button>
        </div>
      </div>
    </el-drawer>
    
    <!-- 任务面板 -->
    <el-drawer v-model="showTaskPanel" title="任务中心" direction="rtl" size="400px">
      <div class="task-panel">
        <div class="task-summary">
          <div class="summary-item">
            <el-badge :value="totalTasks" class="summary-badge">
              <div class="summary-label">总任务</div>
            </el-badge>
          </div>
          <div class="summary-item">
            <el-badge :value="urgentTasks" type="danger" class="summary-badge">
              <div class="summary-label">紧急任务</div>
            </el-badge>
          </div>
          <div class="summary-item">
            <el-badge :value="completedTasks" type="success" class="summary-badge">
              <div class="summary-label">已完成</div>
            </el-badge>
          </div>
        </div>
        
        <div class="task-list">
          <div 
            v-for="task in tasks" 
            :key="task.id" 
            class="task-item"
            :class="{ 'urgent': task.urgent, 'completed': task.completed }"
          >
            <div class="task-status">
              <el-badge 
                :is-dot="task.urgent && !task.completed" 
                type="danger"
                :offset="[0, 0]"
              >
                <el-checkbox 
                  v-model="task.completed" 
                  @change="updateTaskStatus(task)"
                />
              </el-badge>
            </div>
            
            <div class="task-content">
              <div class="task-title">{{ task.title }}</div>
              <div class="task-desc">{{ task.description }}</div>
              <div class="task-meta">
                <span class="task-deadline">{{ formatDeadline(task.deadline) }}</span>
                <el-badge 
                  v-if="task.priority" 
                  :value="task.priority" 
                  :type="getPriorityType(task.priority)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-cards">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
              <el-badge :value="quickActions.length" type="primary" />
            </div>
          </template>
          
          <div class="quick-actions">
            <div 
              v-for="action in quickActions" 
              :key="action.id" 
              class="action-item"
              @click="executeAction(action)"
            >
              <el-badge :value="action.count" :hidden="action.count === 0" :type="action.type">
                <div class="action-icon">
                  <el-icon :size="24"><component :is="action.icon" /></el-icon>
                </div>
              </el-badge>
              <div class="action-label">{{ action.label }}</div>
            </div>
          </div>
        </el-card>
        
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>数据统计</span>
              <el-badge :is-dot="hasNewData" />
            </div>
          </template>
          
          <div class="statistics">
            <div class="stat-item">
              <div class="stat-value">
                <el-badge :value="todayVisits" :max="9999">
                  <span class="stat-number">{{ todayVisits }}</span>
                </el-badge>
              </div>
              <div class="stat-label">今日访问</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">
                <el-badge :value="newUsers" type="success">
                  <span class="stat-number">{{ newUsers }}</span>
                </el-badge>
              </div>
              <div class="stat-label">新增用户</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">
                <el-badge :value="errorCount" type="danger" :hidden="errorCount === 0">
                  <span class="stat-number">{{ errorCount }}</span>
                </el-badge>
              </div>
              <div class="stat-label">系统错误</div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 模拟操作按钮 -->
      <div class="demo-controls">
        <h3>模拟操作</h3>
        <el-button-group>
          <el-button @click="addMessage">新增消息</el-button>
          <el-button @click="addTask">新增任务</el-button>
          <el-button @click="addUrgentTask">新增紧急任务</el-button>
          <el-button @click="toggleSystemNotice">切换系统通知</el-button>
          <el-button @click="simulateError">模拟错误</el-button>
          <el-button @click="resetAll" type="danger">重置所有</el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Message, 
  Bell, 
  Warning, 
  Document, 
  User, 
  DataAnalysis, 
  Setting,
  Monitor
} from '@element-plus/icons-vue'

// 面板显示状态
const showMessagePanel = ref(false)
const showTaskPanel = ref(false)
const showNoticePanel = ref(false)
const showUserMenu = ref(false)

// 消息相关
const activeMessageTab = ref('all')
const messages = ref([
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将在今晚进行维护更新，请提前保存工作内容',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: 'system',
    priority: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    title: '新任务分配',
    content: '您有一个新的项目任务需要处理',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    type: 'task',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
])

// 任务相关
const tasks = ref([
  {
    id: 1,
    title: '完成项目文档',
    description: '编写项目技术文档和用户手册',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24),
    urgent: true,
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: '代码审查',
    description: '审查团队成员提交的代码',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48),
    urgent: false,
    completed: true,
    priority: 'medium'
  }
])

// 系统状态
const hasSystemNotice = ref(true)
const hasProfileUpdate = ref(false)
const hasNewData = ref(true)
const todayVisits = ref(1234)
const newUsers = ref(56)
const errorCount = ref(0)

// 快捷操作
const quickActions = ref([
  { id: 1, label: '文档管理', icon: Document, count: 5, type: 'primary' },
  { id: 2, label: '用户管理', icon: User, count: 2, type: 'success' },
  { id: 3, label: '数据分析', icon: DataAnalysis, count: 0, type: 'info' },
  { id: 4, label: '系统设置', icon: Setting, count: 1, type: 'warning' },
  { id: 5, label: '监控中心', icon: Monitor, count: 3, type: 'danger' }
])

// 计算属性
const totalMessages = computed(() => messages.value.length)
const unreadMessages = computed(() => messages.value.filter(m => !m.read))
const allMessages = computed(() => messages.value)
const systemMessages = computed(() => messages.value.filter(m => m.type === 'system'))

const currentMessages = computed(() => {
  switch (activeMessageTab.value) {
    case 'unread':
      return unreadMessages.value
    case 'system':
      return systemMessages.value
    default:
      return allMessages.value
  }
})

const totalTasks = computed(() => tasks.value.length)
const urgentTasks = computed(() => tasks.value.filter(t => t.urgent && !t.completed).length)
const completedTasks = computed(() => tasks.value.filter(t => t.completed).length)

// 方法
const markAsRead = (message) => {
  message.read = true
  ElMessage.success('消息已标记为已读')
}

const markAllAsRead = () => {
  messages.value.forEach(m => m.read = true)
  ElMessage.success('所有消息已标记为已读')
}

const clearAllMessages = () => {
  messages.value = []
  ElMessage.success('所有消息已清空')
}

const updateTaskStatus = (task) => {
  if (task.completed) {
    ElMessage.success(`任务"${task.title}"已完成`)
  }
}

const addMessage = () => {
  const newMessage = {
    id: Date.now(),
    title: '新消息',
    content: '这是一条新的消息通知',
    time: new Date(),
    read: false,
    type: 'normal',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
  messages.value.unshift(newMessage)
  ElMessage.success('新消息已添加')
}

const addTask = () => {
  const newTask = {
    id: Date.now(),
    title: '新任务',
    description: '这是一个新的任务',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    urgent: false,
    completed: false,
    priority: 'low'
  }
  tasks.value.unshift(newTask)
  ElMessage.success('新任务已添加')
}

const addUrgentTask = () => {
  const urgentTask = {
    id: Date.now(),
    title: '紧急任务',
    description: '这是一个紧急任务，需要立即处理',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 2),
    urgent: true,
    completed: false,
    priority: 'high'
  }
  tasks.value.unshift(urgentTask)
  ElMessage.warning('紧急任务已添加')
}

const toggleSystemNotice = () => {
  hasSystemNotice.value = !hasSystemNotice.value
  ElMessage.info(`系统通知已${hasSystemNotice.value ? '开启' : '关闭'}`)
}

const simulateError = () => {
  errorCount.value++
  ElMessage.error('模拟系统错误')
}

const resetAll = () => {
  messages.value = []
  tasks.value = []
  errorCount.value = 0
  hasSystemNotice.value = false
  hasNewData.value = false
  ElMessage.success('所有数据已重置')
}

const executeAction = (action) => {
  ElMessage.info(`执行操作：${action.label}`)
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const formatDeadline = (deadline) => {
  return deadline.toLocaleDateString('zh-CN')
}

const getPriorityType = (priority) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}
</script>

<style scoped>
.message-center {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-left h2 {
  margin: 0;
  color: #303133;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-item {
  position: relative;
}

.main-content {
  padding: 20px;
}

.content-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.content-card {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
}

.action-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
}

.action-icon {
  margin-bottom: 8px;
}

.action-label {
  font-size: 14px;
  color: #606266;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  margin-bottom: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.message-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.message-tabs {
  margin-bottom: 20px;
}

.tab-badge {
  margin-left: 8px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.unread {
  background-color: #f0f9ff;
}

.message-avatar {
  margin-right: 12px;
}

.message-content {
  flex: 1;
}

.message-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.message-text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 4px;
}

.message-time {
  color: #909399;
  font-size: 12px;
}

.message-actions {
  margin-top: 20px;
  text-align: center;
}

.message-actions .el-button {
  margin: 0 5px;
}

.task-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.task-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-badge {
  margin-bottom: 8px;
}

.summary-label {
  font-size: 14px;
  color: #606266;
}

.task-list {
  flex: 1;
  overflow-y: auto;
}

.task-item {
  display: flex;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #e4e7ed;
}

.task-item.urgent {
  border-left-color: #f56c6c;
}

.task-item.completed {
  opacity: 0.6;
}

.task-status {
  margin-right: 12px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.task-desc {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-deadline {
  color: #909399;
  font-size: 12px;
}

.demo-controls {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-controls h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.demo-controls .el-button {
  margin: 5px;
}
</style>
```