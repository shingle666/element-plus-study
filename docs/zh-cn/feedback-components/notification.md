# Notification 通知

## 学习目标

通过本章学习，你将掌握：
- 基础通知功能的实现方法
- 通知类型样式和位置设置
- 通知持续时间和操作按钮
- 通知HTML内容和分组管理
- 通知全局配置和最佳实践

**预计学习时间：** 90分钟

## 概述

悬浮出现在页面角落，显示全局的通知提醒消息。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

常用于系统级通知的被动提醒，与 Message 的区别是后者更多用于主动操作后的反馈提示。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="1">1</mcreference>

### 主要特性

1. **四种通知类型**：提供 success、warning、info、error 四种通知类型，满足不同场景需求
2. **灵活位置控制**：支持四个角落位置显示，可自定义偏移量
3. **丰富内容支持**：支持纯文本、VNode 和 HTML 片段等多种内容格式
4. **智能显示管理**：可控制显示时长、关闭按钮、自动关闭等行为
5. **全局方法调用**：提供全局方法和类型化方法，使用简单便捷
6. **批量操作支持**：支持批量关闭所有通知实例
7. **上下文继承**：支持应用程序上下文继承，保持组件状态一致性
8. **高度可定制**：支持自定义图标、样式类名、层级等个性化配置

### 适用场景

- **系统通知**：系统状态变化、服务器消息、版本更新等系统级提醒
- **操作反馈**：后台任务完成、数据同步结果、批量操作状态等
- **实时消息**：新消息提醒、好友请求、评论通知等社交功能
- **状态提醒**：网络连接状态、权限变更、账户安全等重要状态
- **错误警告**：系统异常、网络错误、权限不足等错误提示
- **进度通知**：文件上传进度、数据处理状态、任务执行结果等
- **定时提醒**：会议提醒、任务截止、系统维护等时间相关通知
- **用户引导**：功能介绍、操作提示、帮助信息等用户教育

## 基础用法

### 基础用法

Element Plus 注册了 `$notify` 方法并且它接受一个 Object 作为其参数。在最简单的情况下，你可以通过设置 `title` 和 `message` 属性来设置通知的标题和正文内容。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> 可自动关闭 </el-button>
  <el-button plain @click="open2"> 不会自动关闭 </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '标题名称',
        message: '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
      })
    },
    open2() {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 0
      })
    }
  }
}
</script>
```

### 不同类型的通知

我们提供了四种不同类型的提醒框：success、warning、info 和 error。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> Success </el-button>
  <el-button plain @click="open2"> Warning </el-button>
  <el-button plain @click="open3"> Info </el-button>
  <el-button plain @click="open4"> Error </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '成功',
        message: '这是一条成功的提示消息',
        type: 'success'
      })
    },
    open2() {
      this.$notify({
        title: '警告',
        message: '这是一条警告的提示消息',
        type: 'warning'
      })
    },
    open3() {
      this.$notify.info({
        title: '消息',
        message: '这是一条消息的提示消息'
      })
    },
    open4() {
      this.$notify.error({
        title: '错误',
        message: '这是一条错误的提示消息'
      })
    }
  }
}
</script>
```

### 自定义消息弹出的位置

可以让 Notification 从屏幕四角中的任意一角弹出。使用 `position` 属性设置 Notification 的弹出位置，支持四个选项：`top-right`、`top-left`、`bottom-right` 和 `bottom-left`，默认为 `top-right`。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> 右上角 </el-button>
  <el-button plain @click="open2"> 右下角 </el-button>
  <el-button plain @click="open3"> 左下角 </el-button>
  <el-button plain @click="open4"> 左上角 </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '自定义位置',
        message: '右上角弹出的消息',
        position: 'top-right'
      })
    },
    open2() {
      this.$notify({
        title: '自定义位置',
        message: '右下角弹出的消息',
        position: 'bottom-right'
      })
    },
    open3() {
      this.$notify({
        title: '自定义位置',
        message: '左下角弹出的消息',
        position: 'bottom-left'
      })
    },
    open4() {
      this.$notify({
        title: '自定义位置',
        message: '左上角弹出的消息',
        position: 'top-left'
      })
    }
  }
}
</script>
```

### 有位置偏移的通知栏

能够设置偏移量来使 Notification 偏移默认位置。Notification 提供设置偏移量的功能，通过设置 `offset` 字段，可以使弹出的消息距屏幕边缘偏移一段距离。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 偏移的消息 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: '偏移',
        message: '这是一条带有偏移的提示消息',
        offset: 100
      })
    }
  }
}
</script>
```

### 使用 HTML 片段作为正文内容

`message` 支持传入 HTML 字符串来作为正文内容。将 `dangerouslyUseHTMLString` 属性设置为 true，`message` 属性就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 使用 HTML 片段 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: 'HTML 片段',
        dangerouslyUseHTMLString: true,
        message: '<strong>这是 <i>HTML</i> 片段</strong>'
      })
    }
  }
}
</script>
```

### 隐藏关闭按钮

通知的关闭按钮可以被设置为隐藏。将 `showClose` 属性设置为 false 即可隐藏关闭按钮。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 隐藏关闭按钮 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: '提示',
        message: '这是一条没有关闭按钮的消息',
        showClose: false
      })
    }
  }
}
</script>
```

### 全局方法

Element Plus 为 `app.config.globalProperties` 添加了全局方法 `$notify`。因此在 Vue instance 中可以采用本页面中的方式调用 Notification。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

### 单独引用

```javascript
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

ElNotification({
  title: 'Title',
  message: 'This is a message',
  closeIcon: CloseBold,
})
```

你可以在对应的处理函数内调用 `ElNotification(options)` 来呼出通知栏。我们也提前定义了多个 type 的单独调用方法，如 `ElNotification.success(options)`。当你需要关闭页面上所有的通知栏的时候，可以调用 `ElNotification.closeAll()` 来关闭所有的实例。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

### 应用程序上下文继承

现在 Notification 接受一条 `context` 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Notification 中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```typescript
import { getCurrentInstance } from 'vue'
import { ElNotification } from 'element-plus'

// 在你的 setup 方法中
const { appContext } = getCurrentInstance()!
ElNotification({}, appContext)
```

## 实际应用示例

### 系统通知中心

一个完整的系统通知管理中心，展示各种通知场景的应用：

```vue
<template>
  <div class="notification-center">
    <h2>系统通知中心</h2>
    
    <div class="notification-controls">
      <div class="control-group">
        <h3>基础通知</h3>
        <el-button @click="showSuccess">成功通知</el-button>
        <el-button @click="showWarning">警告通知</el-button>
        <el-button @click="showInfo">信息通知</el-button>
        <el-button @click="showError">错误通知</el-button>
      </div>
      
      <div class="control-group">
        <h3>位置控制</h3>
        <el-button @click="showTopRight">右上角</el-button>
        <el-button @click="showTopLeft">左上角</el-button>
        <el-button @click="showBottomRight">右下角</el-button>
        <el-button @click="showBottomLeft">左下角</el-button>
      </div>
      
      <div class="control-group">
        <h3>特殊功能</h3>
        <el-button @click="showPersistent">持久通知</el-button>
        <el-button @click="showHtmlContent">HTML内容</el-button>
        <el-button @click="showWithOffset">偏移通知</el-button>
        <el-button @click="showNoClose">无关闭按钮</el-button>
      </div>
      
      <div class="control-group">
        <h3>系统模拟</h3>
        <el-button @click="simulateSystemUpdate">系统更新</el-button>
        <el-button @click="simulateNetworkStatus">网络状态</el-button>
        <el-button @click="simulateTaskComplete">任务完成</el-button>
        <el-button @click="simulateSecurityAlert">安全警告</el-button>
      </div>
      
      <div class="control-group">
        <h3>批量操作</h3>
        <el-button @click="showMultipleNotifications">显示多个通知</el-button>
        <el-button @click="closeAllNotifications" type="danger">关闭所有通知</el-button>
      </div>
    </div>
    
    <div class="notification-log">
      <h3>通知日志</h3>
      <div class="log-list">
        <div v-for="log in notificationLogs" :key="log.id" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-type" :class="log.type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <el-button @click="clearLogs" size="small">清空日志</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

interface NotificationLog {
  id: number
  time: string
  type: string
  message: string
}

const notificationLogs = ref<NotificationLog[]>([])

// 添加日志记录
const addLog = (type: string, message: string) => {
  notificationLogs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    type,
    message
  })
  
  // 限制日志数量
  if (notificationLogs.value.length > 50) {
    notificationLogs.value = notificationLogs.value.slice(0, 50)
  }
}

// 基础通知
const showSuccess = () => {
  ElNotification({
    title: '操作成功',
    message: '您的操作已成功完成！',
    type: 'success',
    duration: 3000
  })
  addLog('success', '显示成功通知')
}

const showWarning = () => {
  ElNotification({
    title: '注意',
    message: '请注意检查您的输入信息',
    type: 'warning',
    duration: 4000
  })
  addLog('warning', '显示警告通知')
}

const showInfo = () => {
  ElNotification({
    title: '信息提示',
    message: '这是一条普通的信息提示',
    type: 'info',
    duration: 3000
  })
  addLog('info', '显示信息通知')
}

const showError = () => {
  ElNotification({
    title: '错误',
    message: '操作失败，请稍后重试',
    type: 'error',
    duration: 5000
  })
  addLog('error', '显示错误通知')
}

// 位置控制
const showTopRight = () => {
  ElNotification({
    title: '右上角通知',
    message: '这是一个显示在右上角的通知',
    position: 'top-right'
  })
  addLog('position', '右上角位置通知')
}

const showTopLeft = () => {
  ElNotification({
    title: '左上角通知',
    message: '这是一个显示在左上角的通知',
    position: 'top-left'
  })
  addLog('position', '左上角位置通知')
}

const showBottomRight = () => {
  ElNotification({
    title: '右下角通知',
    message: '这是一个显示在右下角的通知',
    position: 'bottom-right'
  })
  addLog('position', '右下角位置通知')
}

const showBottomLeft = () => {
  ElNotification({
    title: '左下角通知',
    message: '这是一个显示在左下角的通知',
    position: 'bottom-left'
  })
  addLog('position', '左下角位置通知')
}

// 特殊功能
const showPersistent = () => {
  ElNotification({
    title: '持久通知',
    message: '这个通知不会自动关闭，需要手动关闭',
    type: 'warning',
    duration: 0
  })
  addLog('persistent', '显示持久通知')
}

const showHtmlContent = () => {
  ElNotification({
    title: 'HTML 内容',
    message: '<strong>这是粗体文本</strong><br><em>这是斜体文本</em><br><span style="color: #409EFF;">这是彩色文本</span>',
    dangerouslyUseHTMLString: true,
    duration: 6000
  })
  addLog('html', '显示HTML内容通知')
}

const showWithOffset = () => {
  ElNotification({
    title: '偏移通知',
    message: '这个通知有100px的偏移量',
    offset: 100,
    type: 'info'
  })
  addLog('offset', '显示偏移通知')
}

const showNoClose = () => {
  ElNotification({
    title: '无关闭按钮',
    message: '这个通知没有关闭按钮，会自动消失',
    showClose: false,
    duration: 3000
  })
  addLog('no-close', '显示无关闭按钮通知')
}

// 系统模拟
const simulateSystemUpdate = () => {
  ElNotification({
    title: '系统更新',
    message: '系统将在今晚23:00进行维护更新，预计耗时2小时',
    type: 'warning',
    duration: 0,
    position: 'top-right'
  })
  addLog('system', '系统更新通知')
}

const simulateNetworkStatus = () => {
  const isOnline = Math.random() > 0.5
  ElNotification({
    title: '网络状态',
    message: isOnline ? '网络连接已恢复' : '网络连接已断开，请检查网络设置',
    type: isOnline ? 'success' : 'error',
    duration: isOnline ? 3000 : 0
  })
  addLog('network', `网络${isOnline ? '连接' : '断开'}通知`)
}

const simulateTaskComplete = () => {
  ElNotification({
    title: '任务完成',
    message: '数据导出任务已完成，共处理1,234条记录',
    type: 'success',
    duration: 5000,
    onClick: () => {
      console.log('用户点击了任务完成通知')
      addLog('click', '用户点击任务完成通知')
    }
  })
  addLog('task', '任务完成通知')
}

const simulateSecurityAlert = () => {
  ElNotification({
    title: '安全警告',
    message: '检测到异常登录行为，如非本人操作请立即修改密码',
    type: 'error',
    duration: 0,
    position: 'top-right'
  })
  addLog('security', '安全警告通知')
}

// 批量操作
const showMultipleNotifications = () => {
  const notifications = [
    { title: '邮件提醒', message: '您有3封新邮件', type: 'info' },
    { title: '会议提醒', message: '距离下次会议还有15分钟', type: 'warning' },
    { title: '系统消息', message: '您的账户余额不足', type: 'error' },
    { title: '好友请求', message: '张三向您发送了好友请求', type: 'success' }
  ]
  
  notifications.forEach((notif, index) => {
    setTimeout(() => {
      ElNotification({
        title: notif.title,
        message: notif.message,
        type: notif.type as any,
        duration: 4000
      })
      addLog('batch', `批量通知: ${notif.title}`)
    }, index * 500)
  })
}

const closeAllNotifications = () => {
  ElNotification.closeAll()
  addLog('close-all', '关闭所有通知')
}

const clearLogs = () => {
  notificationLogs.value = []
}
</script>

<style scoped>
.notification-center {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.notification-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.control-group {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
}

.control-group h3 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.control-group .el-button {
  margin: 5px;
}

.notification-log {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
  background: #fff;
}

.notification-log h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.log-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  width: 80px;
  color: #909399;
  font-size: 12px;
}

.log-type {
  width: 80px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
}

.log-type.success {
  background: #f0f9ff;
  color: #67c23a;
}

.log-type.warning {
  background: #fdf6ec;
  color: #e6a23c;
}

.log-type.error {
  background: #fef0f0;
  color: #f56c6c;
}

.log-type.info {
  background: #f4f4f5;
  color: #909399;
}

.log-message {
  flex: 1;
  margin-left: 10px;
  color: #606266;
}
</style>
```

### 实时消息推送系统

模拟实时消息推送的应用场景：

```vue
<template>
  <div class="message-push-system">
    <h2>实时消息推送系统</h2>
    
    <div class="system-status">
      <div class="status-item">
        <span class="status-label">连接状态:</span>
        <span class="status-value" :class="connectionStatus">{{ connectionStatus }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">消息队列:</span>
        <span class="status-value">{{ messageQueue.length }} 条待处理</span>
      </div>
      <div class="status-item">
        <span class="status-label">推送统计:</span>
        <span class="status-value">今日已推送 {{ pushCount }} 条</span>
      </div>
    </div>
    
    <div class="control-panel">
      <el-button @click="toggleConnection" :type="connectionStatus === 'connected' ? 'danger' : 'primary'">
        {{ connectionStatus === 'connected' ? '断开连接' : '建立连接' }}
      </el-button>
      <el-button @click="simulateMessage" :disabled="connectionStatus !== 'connected'">模拟消息</el-button>
      <el-button @click="simulateBatch" :disabled="connectionStatus !== 'connected'">批量消息</el-button>
      <el-button @click="clearQueue">清空队列</el-button>
    </div>
    
    <div class="message-types">
      <h3>消息类型配置</h3>
      <div class="type-config">
        <el-checkbox v-model="messageTypes.chat" label="聊天消息" />
        <el-checkbox v-model="messageTypes.system" label="系统通知" />
        <el-checkbox v-model="messageTypes.order" label="订单状态" />
        <el-checkbox v-model="messageTypes.security" label="安全警告" />
      </div>
    </div>
    
    <div class="message-queue">
      <h3>消息队列</h3>
      <div class="queue-list">
        <div v-for="msg in messageQueue" :key="msg.id" class="queue-item">
          <span class="msg-type" :class="msg.type">{{ msg.type }}</span>
          <span class="msg-content">{{ msg.content }}</span>
          <span class="msg-time">{{ msg.time }}</span>
          <el-button size="small" @click="processMessage(msg)">处理</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElNotification } from 'element-plus'

interface Message {
  id: number
  type: string
  content: string
  time: string
  priority: number
}

const connectionStatus = ref<'connected' | 'disconnected' | 'connecting'>('disconnected')
const messageQueue = ref<Message[]>([])
const pushCount = ref(0)
const messageTypes = ref({
  chat: true,
  system: true,
  order: true,
  security: true
})

let messageInterval: NodeJS.Timeout | null = null

// 切换连接状态
const toggleConnection = () => {
  if (connectionStatus.value === 'connected') {
    disconnect()
  } else {
    connect()
  }
}

// 建立连接
const connect = () => {
  connectionStatus.value = 'connecting'
  
  ElNotification({
    title: '正在连接',
    message: '正在建立WebSocket连接...',
    type: 'info',
    duration: 2000
  })
  
  setTimeout(() => {
    connectionStatus.value = 'connected'
    ElNotification({
      title: '连接成功',
      message: 'WebSocket连接已建立，开始接收消息',
      type: 'success',
      duration: 3000
    })
    
    // 开始模拟消息接收
    startMessageSimulation()
  }, 2000)
}

// 断开连接
const disconnect = () => {
  connectionStatus.value = 'disconnected'
  stopMessageSimulation()
  
  ElNotification({
    title: '连接已断开',
    message: 'WebSocket连接已断开',
    type: 'warning',
    duration: 3000
  })
}

// 开始消息模拟
const startMessageSimulation = () => {
  messageInterval = setInterval(() => {
    if (Math.random() > 0.7) { // 30% 概率收到消息
      generateRandomMessage()
    }
  }, 3000)
}

// 停止消息模拟
const stopMessageSimulation = () => {
  if (messageInterval) {
    clearInterval(messageInterval)
    messageInterval = null
  }
}

// 生成随机消息
const generateRandomMessage = () => {
  const types = Object.keys(messageTypes.value).filter(type => messageTypes.value[type as keyof typeof messageTypes.value])
  if (types.length === 0) return
  
  const type = types[Math.floor(Math.random() * types.length)]
  const messages = {
    chat: ['您有新的聊天消息', '群聊中有人@了您', '好友发送了文件'],
    system: ['系统维护通知', '版本更新提醒', '服务状态变更'],
    order: ['订单支付成功', '商品已发货', '订单已完成'],
    security: ['异常登录检测', '密码修改提醒', '账户安全警告']
  }
  
  const content = messages[type as keyof typeof messages][Math.floor(Math.random() * 3)]
  
  const message: Message = {
    id: Date.now(),
    type,
    content,
    time: new Date().toLocaleTimeString(),
    priority: type === 'security' ? 1 : type === 'system' ? 2 : 3
  }
  
  messageQueue.value.push(message)
  
  // 自动处理高优先级消息
  if (message.priority <= 2) {
    setTimeout(() => processMessage(message), 1000)
  }
}

// 处理消息
const processMessage = (message: Message) => {
  const index = messageQueue.value.findIndex(m => m.id === message.id)
  if (index > -1) {
    messageQueue.value.splice(index, 1)
  }
  
  const typeConfig = {
    chat: { type: 'info', duration: 4000 },
    system: { type: 'warning', duration: 5000 },
    order: { type: 'success', duration: 4000 },
    security: { type: 'error', duration: 0 }
  }
  
  const config = typeConfig[message.type as keyof typeof typeConfig]
  
  ElNotification({
    title: `${message.type.toUpperCase()} 消息`,
    message: message.content,
    type: config.type as any,
    duration: config.duration,
    position: message.priority === 1 ? 'top-right' : 'bottom-right'
  })
  
  pushCount.value++
}

// 模拟单条消息
const simulateMessage = () => {
  generateRandomMessage()
}

// 模拟批量消息
const simulateBatch = () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => generateRandomMessage(), i * 500)
  }
}

// 清空队列
const clearQueue = () => {
  messageQueue.value = []
  ElNotification({
    title: '队列已清空',
    message: '所有待处理消息已清空',
    type: 'info',
    duration: 2000
  })
}

onMounted(() => {
  // 组件挂载时的初始化
})

onUnmounted(() => {
  stopMessageSimulation()
})
</script>

<style scoped>
.message-push-system {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.system-status {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.status-label {
  font-size: 12px;
  color: #909399;
}

.status-value {
  font-weight: bold;
  font-size: 14px;
}

.status-value.connected {
  color: #67c23a;
}

.status-value.disconnected {
  color: #f56c6c;
}

.status-value.connecting {
  color: #e6a23c;
}

.control-panel {
  margin-bottom: 20px;
}

.control-panel .el-button {
  margin-right: 10px;
}

.message-types {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.message-types h3 {
  margin: 0 0 15px 0;
}

.type-config {
  display: flex;
  gap: 20px;
}

.message-queue {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 15px;
}

.message-queue h3 {
  margin: 0 0 15px 0;
}

.queue-list {
  max-height: 300px;
  overflow-y: auto;
}

.queue-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.queue-item:last-child {
  border-bottom: none;
}

.msg-type {
  width: 80px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
}

.msg-type.chat {
  background: #e1f3d8;
  color: #67c23a;
}

.msg-type.system {
  background: #fdf6ec;
  color: #e6a23c;
}

.msg-type.order {
  background: #f0f9ff;
  color: #409eff;
}

.msg-type.security {
  background: #fef0f0;
  color: #f56c6c;
}

.msg-content {
  flex: 1;
  margin-right: 10px;
}

.msg-time {
  width: 80px;
  font-size: 12px;
  color: #909399;
  margin-right: 10px;
}
</style>
```

## API

### 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题部分 | string | '' |
| message | 通知栏正文内容 | string / VNode / Function | '' |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| type | 通知的类型 | enum | '' |
| icon | 自定义图标。若设置了 type，则 icon 会被覆盖 | string / Component | — |
| customClass | 自定义类名 | string | '' |
| duration | 显示时间, 单位为毫秒。值为 0 则不会自动关闭 | number | 4500 |
| position | 自定义弹出位置 | enum | top-right |
| showClose | 是否显示关闭按钮 | boolean | true |
| onClose | 关闭时的回调函数 | Function | — |
| onClick | 点击 Notification 时的回调函数 | Function | — |
| offset | 相对屏幕顶部的偏移量，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 | number | 0 |
| appendTo | 设置 notification 的根元素，默认为 document.body | CSSSelector / HTMLElement | — |
| zIndex | 初始 zIndex | number | 0 |
| closeIcon | 自定义关闭图标 | string / Component | Close |

### 方法

Notification 和 `this.$notify` 都返回当前的 Notification 实例。如果需要手动关闭实例，可以调用它的 close 方法。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

| 名称 | 详情 | 类型 |
|------|------|------|
| close | 关闭当前的 Notification | Function |

## 最佳实践

1. **合理使用通知类型**：根据消息的重要性和性质选择合适的类型（success、warning、info、error）

2. **控制显示时间**：对于重要信息可以设置 `duration: 0` 让用户手动关闭，普通信息使用默认时间

3. **避免过多通知**：同时显示的通知数量不宜过多，可以使用 `ElNotification.closeAll()` 清除所有通知

4. **位置选择**：根据页面布局选择合适的弹出位置，避免遮挡重要内容

5. **安全使用 HTML**：使用 `dangerouslyUseHTMLString` 时确保内容安全，避免 XSS 攻击

6. **响应式设计**：在移动端考虑通知的显示效果和用户体验

## 常见问题

**Q: 如何批量关闭所有通知？**
A: 使用 `ElNotification.closeAll()` 方法可以关闭所有当前显示的通知。

**Q: 通知不会自动关闭怎么办？**
A: 检查 `duration` 属性是否设置为 0，如果是 0 则需要用户手动关闭或调用 close 方法。

**Q: 如何自定义通知的样式？**
A: 可以通过 `customClass` 属性添加自定义类名，然后在 CSS 中定义样式。

**Q: 通知的层级问题如何解决？**
A: 可以通过 `zIndex` 属性设置通知的层级，确保通知能够正确显示在其他元素之上。

**Q: 如何在 setup 语法中使用通知？**
A: 可以直接导入 `ElNotification` 使用，或者通过 `getCurrentInstance()` 获取应用上下文。


## 实践项目

### 通知系统应用

创建一个完整的系统通知中心，包含以下功能：

1. **系统通知中心**
   - 新消息提醒
   - 系统公告通知
   - 任务完成提醒

2. **实时通知推送**
   - WebSocket 消息推送
   - 服务器状态通知
   - 用户行为提醒

3. **通知管理功能**
   - 通知历史记录
   - 通知设置管理
   - 批量操作功能

### 实践要点

- 实现通知的分类和优先级管理
- 设计合理的通知显示策略
- 处理通知的持久化存储
- 优化通知的用户体验

## 学习检查清单

- [ ] 掌握基础通知功能的使用
- [ ] 理解不同通知类型的应用场景
- [ ] 熟练配置通知的位置和持续时间
- [ ] 掌握通知的操作按钮和HTML内容
- [ ] 理解通知分组和全局配置
- [ ] 完成通知系统的实践项目

## 注意事项

1. **消息的优先级管理**
   - 系统级错误通知优先级最高
   - 普通信息通知可以延迟显示
   - 避免通知堆积影响用户体验

2. **用户注意力的引导**
   - 重要通知使用合适的类型和颜色
   - 避免过于频繁的通知打扰
   - 提供通知开关和设置选项

3. **反馈信息的及时性**
   - 系统状态变化要及时通知
   - 异步操作结果要准确反馈
   - 错误信息要提供解决建议

4. **无障碍访问支持**
   - 确保通知内容语义化
   - 提供键盘导航支持
   - 考虑视觉障碍用户的需求

---

## 总结

Notification 通知组件是 Element Plus 中用于显示全局通知信息的重要组件，具有以下核心特点：

### 核心特点

1. **四种通知类型** - 支持 success、warning、info、error 四种状态，满足不同场景需求
2. **灵活位置控制** - 支持四个角落位置显示，可自定义偏移量
3. **丰富内容支持** - 支持纯文本、HTML 内容和 VNode，内容展示灵活
4. **智能显示管理** - 可控制显示时长、关闭按钮显示，支持手动关闭
5. **全局方法调用** - 提供便捷的全局方法，支持链式调用
6. **批量操作支持** - 支持一键关闭所有通知实例
7. **上下文继承** - 在 setup 中正确继承应用上下文
8. **高度可定制** - 支持自定义图标、样式、点击事件等

### 适用场景

- **系统通知** - 系统维护、更新提醒等重要信息
- **操作反馈** - 用户操作成功、失败的及时反馈
- **实时消息** - 聊天消息、推送通知等实时信息
- **状态提醒** - 网络状态、连接状态等系统状态变化
- **错误警告** - 系统错误、安全警告等重要提示
- **进度通知** - 任务完成、文件上传等进度提醒
- **定时提醒** - 会议提醒、截止日期等时间相关提醒
- **用户引导** - 功能介绍、操作指引等用户教育

### 最佳实践建议

1. **合理选择类型** - 根据消息重要性和性质选择合适的通知类型
2. **控制显示时长** - 重要消息可设置持久显示，一般消息设置合理的自动关闭时间
3. **注意显示位置** - 根据页面布局和用户习惯选择合适的显示位置
4. **避免过度使用** - 控制通知频率，避免打扰用户正常操作
5. **提供交互能力** - 重要通知可添加点击事件，引导用户进行后续操作
6. **安全使用 HTML** - 谨慎使用 HTML 内容，避免 XSS 攻击风险
7. **保持内容简洁** - 通知内容应简洁明了，突出重点信息
8. **考虑无障碍访问** - 确保通知内容对屏幕阅读器友好

通过合理使用 Notification 组件，可以有效提升用户体验，及时传达重要信息，增强应用的交互性和用户友好性。

## 参考资料

- [Element Plus Notification 官方文档](https://element-plus.org/zh-CN/component/notification.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [UX Design Patterns for Notifications](https://uxplanet.org/notification-design-patterns-f6d16b8b4c8a)

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**