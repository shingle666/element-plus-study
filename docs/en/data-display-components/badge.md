# Badge

## Overview
The Badge component is used to display message counts or status, typically appearing in the upper right corner of icons or text. Element Plus's Badge component supports various styles, types, and custom configurations, suitable for message notifications, status indicators, quantity displays, and other scenarios.

## Learning Objectives
- Master the basic usage of the Badge component
- Understand different types and styles of badges
- Learn to use dot badges and custom content badges
- Master badge positioning and display control
- Understand badge applications in actual projects

## Basic Usage

### Basic Badge
The simplest badge usage, setting the displayed number through the `value` attribute:

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="12" class="item">
      <el-button size="small">Comments</el-button>
    </el-badge>
    
    <el-badge :value="3" class="item">
      <el-button size="small">Replies</el-button>
    </el-badge>
    
    <el-badge :value="1" class="item" type="primary">
      <el-button size="small">Comments</el-button>
    </el-badge>
    
    <el-badge :value="2" class="item" type="warning">
      <el-button size="small">Replies</el-button>
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

### Maximum Value
Set the maximum value through the `max` attribute. When exceeding the maximum value, it will display `{max}+`:

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="200" :max="99" class="item">
      <el-button size="small">Comments</el-button>
    </el-badge>
    
    <el-badge :value="100" :max="10" class="item">
      <el-button size="small">Replies</el-button>
    </el-badge>
  </div>
</template>
```

### Custom Content
Set custom content through the `value` attribute, or through the default slot:

```vue
<template>
  <div class="badge-demo">
    <el-badge value="new" class="item">
      <el-button size="small">Comments</el-button>
    </el-badge>
    
    <el-badge value="hot" class="item">
      <el-button size="small">Replies</el-button>
    </el-badge>
    
    <el-badge class="item">
      <template #default>
        <el-icon color="#f56c6c"><ChatDotRound /></el-icon>
      </template>
      <el-button size="small">Messages</el-button>
    </el-badge>
  </div>
</template>

<script setup>
import { ChatDotRound } from '@element-plus/icons-vue'
</script>
```

## Dot Badge

### Dot Badge
Set to dot mode through the `is-dot` attribute:

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
      Data Query
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

## Different Types

### Type Styles
The Badge component provides multiple types: `primary`, `success`, `warning`, `danger`, `info`:

```vue
<template>
  <div class="badge-demo">
    <el-badge :value="1" class="item">
      <el-button size="small">Default</el-button>
    </el-badge>
    
    <el-badge :value="2" class="item" type="primary">
      <el-button size="small">Primary</el-button>
    </el-badge>
    
    <el-badge :value="3" class="item" type="success">
      <el-button size="small">Success</el-button>
    </el-badge>
    
    <el-badge :value="4" class="item" type="warning">
      <el-button size="small">Warning</el-button>
    </el-badge>
    
    <el-badge :value="5" class="item" type="danger">
      <el-button size="small">Danger</el-button>
    </el-badge>
    
    <el-badge :value="6" class="item" type="info">
      <el-button size="small">Info</el-button>
    </el-badge>
  </div>
</template>
```

## Dynamic Badge

### Dynamic Values
Implement dynamic badges by combining reactive data:

```vue
<template>
  <div class="dynamic-badge-demo">
    <el-badge :value="dynamicValue" :max="99" class="item">
      <el-button size="small">Messages</el-button>
    </el-badge>
    
    <el-badge :value="notifications" :max="999" class="item" type="danger">
      <el-button size="small">Notifications</el-button>
    </el-badge>
    
    <el-badge :is-dot="showDot" class="item">
      <el-button size="small">To-Do Items</el-button>
    </el-badge>
    
    <div class="demo-controls">
      <el-button-group>
        <el-button @click="increase">Increase Messages</el-button>
        <el-button @click="decrease">Decrease Messages</el-button>
        <el-button @click="addNotification">Add Notification</el-button>
        <el-button @click="toggleDot">Toggle Dot</el-button>
        <el-button @click="reset">Reset</el-button>
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

## Hidden Badge

### Conditional Display
Control the display and hiding of badges through the `hidden` attribute:

```vue
<template>
  <div class="hidden-badge-demo">
    <el-badge :value="messageCount" :hidden="messageCount === 0" class="item">
      <el-button size="small">Messages</el-button>
    </el-badge>
    
    <el-badge :value="taskCount" :hidden="hideTask" class="item" type="warning">
      <el-button size="small">Tasks</el-button>
    </el-badge>
    
    <el-badge :is-dot="showAlert" :hidden="!showAlert" class="item">
      <el-button size="small">Alerts</el-button>
    </el-badge>
    
    <div class="demo-controls">
      <el-button @click="addMessage">Add Message</el-button>
      <el-button @click="clearMessages">Clear Messages</el-button>
      <el-button @click="toggleTask">Toggle Task Display</el-button>
      <el-button @click="toggleAlert">Toggle Alert</el-button>
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

## Practical Application Example

### Message Center Badge System
A complete message center badge management example:

```vue
<template>
  <div class="message-center">
    <!-- Top Navigation Bar -->
    <div class="navbar">
      <div class="nav-left">
        <h2>My Workbench</h2>
      </div>
      
      <div class="nav-right">
        <!-- Message Notifications -->
        <el-badge :value="totalMessages" :max="99" :hidden="totalMessages === 0" class="nav-item">
          <el-button 
            :icon="Message" 
            circle 
            @click="showMessagePanel = !showMessagePanel"
          />
        </el-badge>
        
        <!-- Task Reminders -->
        <el-badge :value="urgentTasks" :max="9" type="danger" :hidden="urgentTasks === 0" class="nav-item">
          <el-button 
            :icon="Bell" 
            circle 
            @click="showTaskPanel = !showTaskPanel"
          />
        </el-badge>
        
        <!-- System Notifications -->
        <el-badge :is-dot="hasSystemNotice" class="nav-item">
          <el-button 
            :icon="Warning" 
            circle 
            @click="showNoticePanel = !showNoticePanel"
          />
        </el-badge>
        
        <!-- User Menu -->
        <el-badge :is-dot="hasProfileUpdate" class="nav-item">
          <el-avatar 
            :size="40" 
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            @click="showUserMenu = !showUserMenu"
          />
        </el-badge>
      </div>
    </div>
    
    <!-- Message Panel -->
    <el-drawer v-model="showMessagePanel" title="Message Center" direction="rtl" size="400px">
      <div class="message-panel">
        <div class="message-tabs">
          <el-tabs v-model="activeMessageTab">
            <el-tab-pane label="All" name="all">
              <el-badge :value="allMessages.length" class="tab-badge" />
            </el-tab-pane>
            <el-tab-pane label="Unread" name="unread">
              <el-badge :value="unreadMessages.length" type="danger" class="tab-badge" />
            </el-tab-pane>
            <el-tab-pane label="System" name="system">
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
            Mark All as Read
          </el-button>
          <el-button @click="clearAllMessages" type="danger">
            Clear All Messages
          </el-button>
        </div>
      </div>
    </el-drawer>
    
    <!-- Task Panel -->
    <el-drawer v-model="showTaskPanel" title="Task Center" direction="rtl" size="400px">
      <div class="task-panel">
        <div class="task-summary">
          <div class="summary-item">
            <el-badge :value="totalTasks" class="summary-badge">
              <div class="summary-label">Total Tasks</div>
            </el-badge>
          </div>
          <div class="summary-item">
            <el-badge :value="urgentTasks" type="danger" class="summary-badge">
              <div class="summary-label">Urgent Tasks</div>
            </el-badge>
          </div>
          <div class="summary-item">
            <el-badge :value="completedTasks" type="success" class="summary-badge">
              <div class="summary-label">Completed</div>
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
    
    <!-- Main Content Area -->
    <div class="main-content">
      <div class="content-cards">
        <el-card class="content-card">
          <template #header>
            <div class="card-header">
              <span>Quick Actions</span>
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
              <span>Data Statistics</span>
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
              <div class="stat-label">Today's Visits</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">
                <el-badge :value="newUsers" type="success">
                  <span class="stat-number">{{ newUsers }}</span>
                </el-badge>
              </div>
              <div class="stat-label">New Users</div>
            </div>
            
            <div class="stat-item">
              <div class="stat-value">
                <el-badge :value="errorCount" type="danger" :hidden="errorCount === 0">
                  <span class="stat-number">{{ errorCount }}</span>
                </el-badge>
              </div>
              <div class="stat-label">System Errors</div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- Simulation Operation Buttons -->
      <div class="demo-controls">
        <h3>Simulation Operations</h3>
        <el-button-group>
          <el-button @click="addMessage">Add Message</el-button>
          <el-button @click="addTask">Add Task</el-button>
          <el-button @click="addUrgentTask">Add Urgent Task</el-button>
          <el-button @click="toggleSystemNotice">Toggle System Notice</el-button>
          <el-button @click="simulateError">Simulate Error</el-button>
          <el-button @click="resetAll" type="danger">Reset All</el-button>
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

// Panel display status
const showMessagePanel = ref(false)
const showTaskPanel = ref(false)
const showNoticePanel = ref(false)
const showUserMenu = ref(false)

// Message related
const activeMessageTab = ref('all')
const messages = ref([
  {
    id: 1,
    title: 'System Update Notification',
    content: 'The system will undergo maintenance updates tonight, please save your work content in advance',
    time: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    type: 'system',
    priority: 1,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    title: 'New Task Assignment',
    content: 'You have a new project task that needs to be handled',
    time: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    type: 'task',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
])

// Task related
const tasks = ref([
  {
    id: 1,
    title: 'Complete Project Documentation',
    description: 'Write project technical documentation and user manual',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24),
    urgent: true,
    completed: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Review code submitted by team members',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48),
    urgent: false,
    completed: true,
    priority: 'medium'
  }
])

// System status
const hasSystemNotice = ref(true)
const hasProfileUpdate = ref(false)
const hasNewData = ref(true)
const todayVisits = ref(1234)
const newUsers = ref(56)
const errorCount = ref(0)

// Quick actions
const quickActions = ref([
  { id: 1, label: 'Document Management', icon: Document, count: 5, type: 'primary' },
  { id: 2, label: 'User Management', icon: User, count: 2, type: 'success' },
  { id: 3, label: 'Data Analysis', icon: DataAnalysis, count: 0, type: 'info' },
  { id: 4, label: 'System Settings', icon: Setting, count: 1, type: 'warning' },
  { id: 5, label: 'Monitoring Center', icon: Monitor, count: 3, type: 'danger' }
])

// Computed properties
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

// Methods
const markAsRead = (message) => {
  message.read = true
  ElMessage.success('Message marked as read')
}

const markAllAsRead = () => {
  messages.value.forEach(m => m.read = true)
  ElMessage.success('All messages marked as read')
}

const clearAllMessages = () => {
  messages.value = []
  ElMessage.success('All messages cleared')
}

const updateTaskStatus = (task) => {
  if (task.completed) {
    ElMessage.success(`Task "${task.title}" completed`)
  }
}

const addMessage = () => {
  const newMessage = {
    id: Date.now(),
    title: 'New Message',
    content: 'This is a new message notification',
    time: new Date(),
    read: false,
    type: 'normal',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
  messages.value.unshift(newMessage)
  ElMessage.success('New message added')
}

const addTask = () => {
  const newTask = {
    id: Date.now(),
    title: 'New Task',
    description: 'This is a new task',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    urgent: false,
    completed: false,
    priority: 'low'
  }
  tasks.value.unshift(newTask)
  ElMessage.success('New task added')
}

const addUrgentTask = () => {
  const urgentTask = {
    id: Date.now(),
    title: 'Urgent Task',
    description: 'This is an urgent task that needs immediate attention',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 2),
    urgent: true,
    completed: false,
    priority: 'high'
  }
  tasks.value.unshift(urgentTask)
  ElMessage.warning('Urgent task added')
}

const toggleSystemNotice = () => {
  hasSystemNotice.value = !hasSystemNotice.value
  ElMessage.info(`System notification ${hasSystemNotice.value ? 'enabled' : 'disabled'}`)
}

const simulateError = () => {
  errorCount.value++
  ElMessage.error('Simulated system error')
}

const resetAll = () => {
  messages.value = []
  tasks.value = []
  errorCount.value = 0
  hasSystemNotice.value = false
  hasNewData.value = false
  ElMessage.success('All data reset')
}

const executeAction = (action) => {
  ElMessage.info(`Execute action: ${action.label}`)
}

const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days} days ago`
  if (hours > 0) return `${hours} hours ago`
  if (minutes > 0) return `${minutes} minutes ago`
  return 'Just now'
}

const formatDeadline = (deadline) => {
  return deadline.toLocaleDateString('en-US')
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
  color: #303133;
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
  font-size: 12px;
  color: #909399;
}

.demo-controls {
  margin-top: 30px;
}
</style>
```

## API Documentation

### Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| value | Display value | string / number | — |
| max | Maximum value, shows '{max}+' when exceeded | number | — |
| is-dot | Whether to display a small dot | boolean | false |
| hidden | Whether to hide the badge | boolean | false |
| type | Badge type | string | danger |

#### Type Options

- `primary`
- `success`
- `warning`
- `danger`
- `info`

### Slots

| Slot Name | Description |
|--------|------|
| default | Custom badge content |

## Best Practices

### 1. Choose the Right Badge Type

```javascript
// Badge type selection guide
const badgeTypes = {
  // For new messages, notifications
  danger: 'High priority, requires attention',
  // For warnings, reminders
  warning: 'Medium priority, should be noticed',
  // For general information
  info: 'Low priority, informational',
  // For success states
  success: 'Positive information',
  // For neutral or brand-related information
  primary: 'Brand-related or neutral information'
}
```

### 2. Optimize Performance

```javascript
// For large lists with many badges
const optimizeBadges = () => {
  // Only show badges for visible items (use virtual scrolling)
  // Hide badges with zero values
  // Group similar notifications
}
```

### 3. Accessibility Considerations

```vue
<template>
  <!-- Make badges accessible -->
  <el-badge 
    :value="unreadCount" 
    :aria-label="`${unreadCount} unread messages`"
    role="status"
  >
    <el-button>Messages</el-button>
  </el-badge>
</template>
```

### 4. Responsive Design

```css
/* Adjust badge size based on screen size */
@media (max-width: 768px) {
  .el-badge__content {
    transform: scale(0.8);
    transform-origin: top right;
  }
}
```

## Common Use Cases

1. **Notification Counters**: Display unread message counts
2. **Status Indicators**: Show online/offline status
3. **Feature Highlights**: Indicate new or updated features
4. **Task Counters**: Display pending task counts
5. **Version Tags**: Show version numbers or update status
