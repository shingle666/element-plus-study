# Popconfirm 气泡确认框

## 概述

点击某个元素弹出一个简单的气泡确认框。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

Popconfirm 的属性与 Popover 很类似，因此对于重复属性，请参考 Popover 的文档，在此文档中不做详尽解释。在 Popconfirm 中，只有 title 属性可用，content 属性会被忽略。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

### 主要特性

- **简洁确认** - 提供简单直观的确认对话框，避免误操作
- **灵活定位** - 支持 12 种不同的弹出位置，适应各种布局需求
- **高度可定制** - 支持自定义按钮文字、图标、颜色等外观属性
- **事件响应** - 提供确认和取消事件回调，便于处理用户操作
- **轻量级设计** - 相比 MessageBox 更轻量，适合简单的确认场景
- **无障碍支持** - 支持键盘导航和屏幕阅读器
- **继承 Popover** - 继承 Popover 的大部分属性，功能丰富
- **插槽支持** - 支持自定义触发元素和操作按钮

### 适用场景

- **删除确认** - 删除数据、文件等不可逆操作的确认
- **提交确认** - 表单提交、数据保存等重要操作的确认
- **状态切换** - 启用/禁用、上线/下线等状态变更确认
- **批量操作** - 批量删除、批量修改等影响多个项目的操作
- **敏感操作** - 涉及权限、安全等敏感操作的二次确认
- **不可撤销操作** - 清空数据、重置设置等无法撤销的操作
- **费用相关** - 涉及付费、扣费等金钱相关的操作确认
- **系统操作** - 重启服务、清理缓存等系统级操作确认

## 基础用法

### 基础用法

Popconfirm 的属性与 Popover 很类似，因此对于重复属性，请参考 Popover 的文档，在此文档中不做详尽解释。在 Popconfirm 中，只有 title 属性可用，content 属性不会被展示。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm title="Are you sure to delete this?">
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>
```

### 自定义弹出框的内容

可以在 Popconfirm 中自定义内容。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm
    confirm-button-text="OK"
    cancel-button-text="No, Thanks"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="Are you sure to delete this?"
  >
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>
```

### 多种让 Popconfirm 出现的方法

点击按钮触发事件。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm
    confirm-button-text="Yes"
    cancel-button-text="No"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="Are you sure to delete this?"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

const confirmEvent = () => {
  console.log('confirm!')
}

const cancelEvent = () => {
  console.log('cancel!')
}
</script>
```

### 展示位置

Popconfirm 提供 9 种展示位置。使用 `title` 属性来设置点击参考元素时显示的信息。由 `placement` 属性决定 Popconfirm 的位置。该属性值格式为：[方向]-[对齐位置]，可供选择的四个方向分别是 top、left、right、bottom，可供选择的三种对齐方式分别是 start、end、null，默认的对齐方式为 null。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

```vue
<template>
  <div class="popconfirm-base-box">
    <div class="row center">
      <el-popconfirm
        class="box-item"
        title="Top Left prompts info"
        placement="top-start"
      >
        <template #reference>
          <el-button>top-start</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Top Center prompts info"
        placement="top"
      >
        <template #reference>
          <el-button>top</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Top Right prompts info"
        placement="top-end"
      >
        <template #reference>
          <el-button>top-end</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="row">
      <el-popconfirm
        class="box-item"
        title="Left prompts info"
        placement="left"
      >
        <template #reference>
          <el-button>left</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Right prompts info"
        placement="right"
      >
        <template #reference>
          <el-button>right</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="row center">
      <el-popconfirm
        class="box-item"
        title="Bottom Left prompts info"
        placement="bottom-start"
      >
        <template #reference>
          <el-button>bottom-start</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Bottom Center prompts info"
        placement="bottom"
      >
        <template #reference>
          <el-button>bottom</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Bottom Right prompts info"
        placement="bottom-end"
      >
        <template #reference>
          <el-button>bottom-end</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style>
.popconfirm-base-box {
  width: 520px;
}
.popconfirm-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popconfirm-base-box .center {
  justify-content: center;
}
.popconfirm-base-box .box-item {
  margin: 4px;
}
</style>
```

## 实际应用示例

### 数据管理系统

一个完整的数据管理系统，展示 Popconfirm 在各种操作场景中的应用：

```vue
<template>
  <div class="data-management-system">
    <h2>数据管理系统</h2>
    
    <!-- 用户列表 -->
    <div class="user-list-section">
      <h3>用户管理</h3>
      <div class="toolbar">
        <el-button @click="addUser" type="primary">添加用户</el-button>
        <el-popconfirm
          title="确定要删除所有选中的用户吗？此操作不可撤销！"
          confirm-button-text="确定删除"
          cancel-button-text="取消"
          confirm-button-type="danger"
          :icon="WarningFilled"
          icon-color="#f56c6c"
          @confirm="batchDeleteUsers"
          @cancel="handleCancel"
        >
          <template #reference>
            <el-button 
              type="danger" 
              :disabled="selectedUsers.length === 0"
            >
              批量删除 ({{ selectedUsers.length }})
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      
      <el-table 
        :data="users" 
        @selection-change="handleSelectionChange"
        style="width: 100%; margin-top: 20px;"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            
            <!-- 状态切换确认 -->
            <el-popconfirm
              :title="`确定要${row.status === 'active' ? '禁用' : '激活'}用户 ${row.name} 吗？`"
              :confirm-button-text="row.status === 'active' ? '禁用' : '激活'"
              cancel-button-text="取消"
              :confirm-button-type="row.status === 'active' ? 'warning' : 'success'"
              :icon="row.status === 'active' ? WarningFilled : CircleCheckFilled"
              :icon-color="row.status === 'active' ? '#e6a23c' : '#67c23a'"
              @confirm="toggleUserStatus(row)"
            >
              <template #reference>
                <el-button 
                  size="small" 
                  :type="row.status === 'active' ? 'warning' : 'success'"
                >
                  {{ row.status === 'active' ? '禁用' : '激活' }}
                </el-button>
              </template>
            </el-popconfirm>
            
            <!-- 删除确认 -->
            <el-popconfirm
              :title="`确定要删除用户 ${row.name} 吗？删除后无法恢复！`"
              confirm-button-text="确定删除"
              cancel-button-text="取消"
              confirm-button-type="danger"
              :icon="DeleteFilled"
              icon-color="#f56c6c"
              placement="top"
              @confirm="deleteUser(row)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 系统操作区 -->
    <div class="system-operations">
      <h3>系统操作</h3>
      <div class="operation-grid">
        <!-- 数据备份 -->
        <div class="operation-card">
          <h4>数据备份</h4>
          <p>备份当前系统数据</p>
          <el-popconfirm
            title="确定要开始数据备份吗？备份过程可能需要几分钟时间。"
            confirm-button-text="开始备份"
            cancel-button-text="取消"
            confirm-button-type="primary"
            :icon="DocumentCopy"
            icon-color="#409eff"
            @confirm="backupData"
          >
            <template #reference>
              <el-button type="primary" :loading="isBackingUp">数据备份</el-button>
            </template>
          </el-popconfirm>
        </div>
        
        <!-- 清理缓存 -->
        <div class="operation-card">
          <h4>清理缓存</h4>
          <p>清理系统缓存数据</p>
          <el-popconfirm
            title="确定要清理所有缓存吗？清理后系统性能可能暂时下降。"
            confirm-button-text="确定清理"
            cancel-button-text="取消"
            confirm-button-type="warning"
            :icon="Delete"
            icon-color="#e6a23c"
            @confirm="clearCache"
          >
            <template #reference>
              <el-button type="warning" :loading="isClearingCache">清理缓存</el-button>
            </template>
          </el-popconfirm>
        </div>
        
        <!-- 重置系统 -->
        <div class="operation-card">
          <h4>重置系统</h4>
          <p>重置系统到初始状态</p>
          <el-popconfirm
            title="警告：此操作将重置系统到初始状态，所有数据将被清空！确定要继续吗？"
            confirm-button-text="确定重置"
            cancel-button-text="取消"
            confirm-button-type="danger"
            :icon="WarningFilled"
            icon-color="#f56c6c"
            width="300"
            @confirm="resetSystem"
          >
            <template #reference>
              <el-button type="danger" :loading="isResetting">重置系统</el-button>
            </template>
          </el-popconfirm>
        </div>
        
        <!-- 导出数据 -->
        <div class="operation-card">
          <h4>导出数据</h4>
          <p>导出用户数据为Excel</p>
          <el-popconfirm
            title="确定要导出所有用户数据吗？"
            confirm-button-text="开始导出"
            cancel-button-text="取消"
            :icon="Download"
            icon-color="#67c23a"
            @confirm="exportData"
          >
            <template #reference>
              <el-button type="success" :loading="isExporting">导出数据</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
    
    <!-- 操作日志 -->
    <div class="operation-log">
      <h3>操作日志</h3>
      <div class="log-list">
        <div v-for="log in operationLogs" :key="log.id" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-action" :class="log.type">{{ log.action }}</span>
          <span class="log-details">{{ log.details }}</span>
        </div>
      </div>
      <el-popconfirm
        title="确定要清空所有操作日志吗？"
        confirm-button-text="清空"
        cancel-button-text="取消"
        confirm-button-type="danger"
        @confirm="clearLogs"
      >
        <template #reference>
          <el-button size="small" type="danger" style="margin-top: 10px;">清空日志</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  WarningFilled,
  DeleteFilled,
  CircleCheckFilled,
  DocumentCopy,
  Delete,
  Download
} from '@element-plus/icons-vue'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

interface OperationLog {
  id: number
  time: string
  action: string
  details: string
  type: 'success' | 'warning' | 'danger' | 'info'
}

// 用户数据
const users = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: '用户', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: '用户', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: '编辑', status: 'active' }
])

// 选中的用户
const selectedUsers = ref<User[]>([])

// 操作状态
const isBackingUp = ref(false)
const isClearingCache = ref(false)
const isResetting = ref(false)
const isExporting = ref(false)

// 操作日志
const operationLogs = ref<OperationLog[]>([])

// 添加日志
const addLog = (action: string, details: string, type: OperationLog['type'] = 'info') => {
  operationLogs.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleString(),
    action,
    details,
    type
  })
  
  // 限制日志数量
  if (operationLogs.value.length > 20) {
    operationLogs.value = operationLogs.value.slice(0, 20)
  }
}

// 处理选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

// 添加用户
const addUser = () => {
  const newUser: User = {
    id: Date.now(),
    name: `新用户${users.value.length + 1}`,
    email: `user${users.value.length + 1}@example.com`,
    role: '用户',
    status: 'active'
  }
  users.value.push(newUser)
  addLog('添加用户', `添加了用户: ${newUser.name}`, 'success')
  ElMessage.success('用户添加成功')
}

// 编辑用户
const editUser = (user: User) => {
  ElMessage.info(`编辑用户: ${user.name}`)
  addLog('编辑用户', `编辑了用户: ${user.name}`, 'info')
}

// 切换用户状态
const toggleUserStatus = (user: User) => {
  const oldStatus = user.status
  user.status = user.status === 'active' ? 'inactive' : 'active'
  const action = user.status === 'active' ? '激活' : '禁用'
  addLog(`${action}用户`, `${action}了用户: ${user.name}`, user.status === 'active' ? 'success' : 'warning')
  ElMessage.success(`用户${action}成功`)
}

// 删除用户
const deleteUser = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index > -1) {
    users.value.splice(index, 1)
    addLog('删除用户', `删除了用户: ${user.name}`, 'danger')
    ElMessage.success('用户删除成功')
  }
}

// 批量删除用户
const batchDeleteUsers = () => {
  const deleteCount = selectedUsers.value.length
  const deleteNames = selectedUsers.value.map(u => u.name).join(', ')
  
  selectedUsers.value.forEach(user => {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  })
  
  selectedUsers.value = []
  addLog('批量删除', `批量删除了 ${deleteCount} 个用户: ${deleteNames}`, 'danger')
  ElMessage.success(`成功删除 ${deleteCount} 个用户`)
}

// 处理取消
const handleCancel = () => {
  ElMessage.info('操作已取消')
}

// 数据备份
const backupData = async () => {
  isBackingUp.value = true
  addLog('数据备份', '开始数据备份', 'info')
  
  try {
    // 模拟备份过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    addLog('数据备份', '数据备份完成', 'success')
    ElMessage.success('数据备份完成')
  } catch (error) {
    addLog('数据备份', '数据备份失败', 'danger')
    ElMessage.error('数据备份失败')
  } finally {
    isBackingUp.value = false
  }
}

// 清理缓存
const clearCache = async () => {
  isClearingCache.value = true
  addLog('清理缓存', '开始清理缓存', 'info')
  
  try {
    // 模拟清理过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    addLog('清理缓存', '缓存清理完成', 'success')
    ElMessage.success('缓存清理完成')
  } catch (error) {
    addLog('清理缓存', '缓存清理失败', 'danger')
    ElMessage.error('缓存清理失败')
  } finally {
    isClearingCache.value = false
  }
}

// 重置系统
const resetSystem = async () => {
  isResetting.value = true
  addLog('重置系统', '开始重置系统', 'warning')
  
  try {
    // 模拟重置过程
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // 重置数据
    users.value = [
      { id: 1, name: '管理员', email: 'admin@example.com', role: '管理员', status: 'active' }
    ]
    selectedUsers.value = []
    operationLogs.value = []
    
    addLog('重置系统', '系统重置完成', 'success')
    ElMessage.success('系统重置完成')
  } catch (error) {
    addLog('重置系统', '系统重置失败', 'danger')
    ElMessage.error('系统重置失败')
  } finally {
    isResetting.value = false
  }
}

// 导出数据
const exportData = async () => {
  isExporting.value = true
  addLog('导出数据', '开始导出用户数据', 'info')
  
  try {
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建并下载文件（模拟）
    const dataStr = JSON.stringify(users.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users_data.json'
    a.click()
    URL.revokeObjectURL(url)
    
    addLog('导出数据', `导出了 ${users.value.length} 条用户数据`, 'success')
    ElMessage.success('数据导出完成')
  } catch (error) {
    addLog('导出数据', '数据导出失败', 'danger')
    ElMessage.error('数据导出失败')
  } finally {
    isExporting.value = false
  }
}

// 清空日志
const clearLogs = () => {
  operationLogs.value = []
  ElMessage.success('操作日志已清空')
}
</script>

<style scoped>
.data-management-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-list-section {
  margin-bottom: 30px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.system-operations {
  margin-bottom: 30px;
}

.operation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.operation-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fff;
}

.operation-card h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.operation-card p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.operation-log {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.operation-log h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.log-list {
  max-height: 300px;
  overflow-y: auto;
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
  width: 150px;
  color: #909399;
  font-size: 12px;
}

.log-action {
  width: 100px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  margin-right: 10px;
}

.log-action.success {
  background: #f0f9ff;
  color: #67c23a;
}

.log-action.warning {
  background: #fdf6ec;
  color: #e6a23c;
}

.log-action.danger {
  background: #fef0f0;
  color: #f56c6c;
}

.log-action.info {
  background: #f4f4f5;
  color: #909399;
}

.log-details {
  flex: 1;
  color: #606266;
}
</style>
```

### 电商订单管理

展示 Popconfirm 在电商订单管理中的应用：

```vue
<template>
  <div class="order-management">
    <h2>订单管理系统</h2>
    
    <div class="order-stats">
      <div class="stat-card">
        <h3>{{ orders.length }}</h3>
        <p>总订单数</p>
      </div>
      <div class="stat-card">
        <h3>{{ orders.filter(o => o.status === 'pending').length }}</h3>
        <p>待处理</p>
      </div>
      <div class="stat-card">
        <h3>{{ orders.filter(o => o.status === 'shipped').length }}</h3>
        <p>已发货</p>
      </div>
      <div class="stat-card">
        <h3>{{ orders.filter(o => o.status === 'completed').length }}</h3>
        <p>已完成</p>
      </div>
    </div>
    
    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <h4>订单 #{{ order.id }}</h4>
            <p>{{ order.customerName }} - {{ order.createTime }}</p>
          </div>
          <div class="order-status">
            <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
          </div>
        </div>
        
        <div class="order-content">
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>¥{{ item.price }}</span>
            </div>
          </div>
          <div class="order-total">
            <strong>总计: ¥{{ order.total }}</strong>
          </div>
        </div>
        
        <div class="order-actions">
          <!-- 确认订单 -->
          <el-popconfirm
            v-if="order.status === 'pending'"
            title="确定要确认这个订单吗？确认后将开始备货。"
            confirm-button-text="确认订单"
            cancel-button-text="取消"
            confirm-button-type="primary"
            :icon="CircleCheckFilled"
            icon-color="#409eff"
            @confirm="confirmOrder(order)"
          >
            <template #reference>
              <el-button type="primary" size="small">确认订单</el-button>
            </template>
          </el-popconfirm>
          
          <!-- 发货 -->
          <el-popconfirm
            v-if="order.status === 'confirmed'"
            title="确定要标记此订单为已发货吗？请确保商品已经发出。"
            confirm-button-text="确认发货"
            cancel-button-text="取消"
            confirm-button-type="success"
            :icon="Truck"
            icon-color="#67c23a"
            @confirm="shipOrder(order)"
          >
            <template #reference>
              <el-button type="success" size="small">发货</el-button>
            </template>
          </el-popconfirm>
          
          <!-- 完成订单 -->
          <el-popconfirm
            v-if="order.status === 'shipped'"
            title="确定要完成此订单吗？完成后订单将无法修改。"
            confirm-button-text="完成订单"
            cancel-button-text="取消"
            :icon="CircleCheckFilled"
            icon-color="#67c23a"
            @confirm="completeOrder(order)"
          >
            <template #reference>
              <el-button type="success" size="small">完成订单</el-button>
            </template>
          </el-popconfirm>
          
          <!-- 取消订单 -->
          <el-popconfirm
            v-if="['pending', 'confirmed'].includes(order.status)"
            :title="`确定要取消订单 #${order.id} 吗？取消后需要退款给客户。`"
            confirm-button-text="确认取消"
            cancel-button-text="保留订单"
            confirm-button-type="danger"
            :icon="WarningFilled"
            icon-color="#f56c6c"
            width="280"
            @confirm="cancelOrder(order)"
          >
            <template #reference>
              <el-button type="danger" size="small">取消订单</el-button>
            </template>
          </el-popconfirm>
          
          <!-- 退款 -->
          <el-popconfirm
            v-if="order.status === 'completed'"
            :title="`确定要为订单 #${order.id} 退款 ¥${order.total} 吗？`"
            confirm-button-text="确认退款"
            cancel-button-text="取消"
            confirm-button-type="warning"
            :icon="Money"
            icon-color="#e6a23c"
            @confirm="refundOrder(order)"
          >
            <template #reference>
              <el-button type="warning" size="small">退款</el-button>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  CircleCheckFilled,
  WarningFilled,
  Truck,
  Money
} from '@element-plus/icons-vue'

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  customerName: string
  createTime: string
  status: 'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled' | 'refunded'
  items: OrderItem[]
  total: number
}

const orders = ref<Order[]>([
  {
    id: 1001,
    customerName: '张三',
    createTime: '2024-01-15 10:30:00',
    status: 'pending',
    items: [
      { id: 1, name: 'iPhone 15', quantity: 1, price: 5999 },
      { id: 2, name: '手机壳', quantity: 1, price: 99 }
    ],
    total: 6098
  },
  {
    id: 1002,
    customerName: '李四',
    createTime: '2024-01-15 11:15:00',
    status: 'confirmed',
    items: [
      { id: 3, name: 'MacBook Pro', quantity: 1, price: 12999 }
    ],
    total: 12999
  },
  {
    id: 1003,
    customerName: '王五',
    createTime: '2024-01-14 16:20:00',
    status: 'shipped',
    items: [
      { id: 4, name: 'iPad Air', quantity: 1, price: 4399 },
      { id: 5, name: 'Apple Pencil', quantity: 1, price: 899 }
    ],
    total: 5298
  },
  {
    id: 1004,
    customerName: '赵六',
    createTime: '2024-01-13 14:45:00',
    status: 'completed',
    items: [
      { id: 6, name: 'AirPods Pro', quantity: 2, price: 1999 }
    ],
    total: 3998
  }
])

const getStatusType = (status: Order['status']) => {
  const typeMap = {
    pending: 'warning',
    confirmed: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'danger',
    refunded: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: Order['status']) => {
  const textMap = {
    pending: '待处理',
    confirmed: '已确认',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return textMap[status] || '未知'
}

const confirmOrder = (order: Order) => {
  order.status = 'confirmed'
  ElMessage.success(`订单 #${order.id} 已确认`)
}

const shipOrder = (order: Order) => {
  order.status = 'shipped'
  ElMessage.success(`订单 #${order.id} 已发货`)
}

const completeOrder = (order: Order) => {
  order.status = 'completed'
  ElMessage.success(`订单 #${order.id} 已完成`)
}

const cancelOrder = (order: Order) => {
  order.status = 'cancelled'
  ElMessage.warning(`订单 #${order.id} 已取消`)
}

const refundOrder = (order: Order) => {
  order.status = 'refunded'
  ElMessage.success(`订单 #${order.id} 已退款 ¥${order.total}`)
}
</script>

<style scoped>
.order-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.order-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
  color: #409eff;
}

.stat-card p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
}

.order-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.order-content {
  margin-bottom: 15px;
}

.order-items {
  margin-bottom: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  color: #606266;
}

.order-total {
  text-align: right;
  color: #303133;
}

.order-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | — |
| confirm-button-text | 确认按钮文字 | string | — |
| cancel-button-text | 取消按钮文字 | string | — |
| confirm-button-type | 确认按钮类型 | enum | primary |
| cancel-button-type | 取消按钮类型 | enum | text |
| icon | 自定义图标 | string / Component | QuestionFilled |
| icon-color | Icon 颜色 | string | #f90 |
| hide-icon | 是否隐藏 Icon | boolean | false |
| hide-after | 关闭时的延迟 | number | 200 |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | boolean | true |
| persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除 | boolean | false |
| width | 弹层宽度，最小宽度 150px | string / number | 150 |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| confirm | 点击确认按钮时触发 | Function |
| cancel | 点击取消按钮时触发 | Function |

### Slots

| 插槽名 | 说明 | 类型 |
|--------|------|------|
| reference | 触发 Popconfirm 显示的 HTML 元素 | — |
| actions | 页脚的内容 | object |

## 最佳实践

1. **合理使用场景**：Popconfirm 适用于需要用户确认的简单操作，如删除、提交等

2. **明确的提示文字**：使用清晰、简洁的 title 文字，让用户明确知道操作的后果

3. **自定义按钮文字**：根据具体场景自定义确认和取消按钮的文字，提高用户体验

4. **合适的图标**：选择合适的图标来表达操作的性质，如警告、信息等

5. **位置选择**：根据触发元素的位置选择合适的弹出位置，避免遮挡重要内容

6. **事件处理**：正确处理确认和取消事件，确保用户操作得到正确响应

## 常见问题

**Q: 为什么 @confirm 事件不生效？**
A: 在某些版本中，事件名可能需要使用 @onConfirm 和 @onCancel，或者确保使用正确的事件名格式。<mcreference link="https://blog.csdn.net/xdtz_z/article/details/128946029" index="3">3</mcreference>

**Q: 如何自定义 Popconfirm 的样式？**
A: 可以通过 CSS 类名覆盖默认样式，或者使用 width、icon-color 等属性进行基本自定义。

**Q: Popconfirm 与 Popover 有什么区别？**
A: Popconfirm 是专门用于确认操作的简化版 Popover，只支持 title 属性，不支持 content 属性。

**Q: 如何在表格中使用 Popconfirm？**
A: 可以在表格的操作列中使用 Popconfirm 包裹操作按钮，提供删除确认等功能。

**Q: 如何解决 Popconfirm 与其他组件的冲突？**
A: 可以使用 @click.stop 阻止事件冒泡，或者调整组件的嵌套结构。<mcreference link="https://blog.csdn.net/qq_36330228/article/details/108810875" index="5">5</mcreference>

## 学习记录

在这里记录你的学习心得、遇到的问题和解决方案。

## 总结

Popconfirm 气泡确认框是一个轻量级的确认组件，具有以下核心特点：

### 核心特点

1. **简洁确认** - 提供简单直接的确认交互方式
2. **灵活定位** - 支持多种弹出位置，适应不同布局需求
3. **高度可定制** - 支持自定义按钮文字、类型、图标等
4. **事件响应** - 提供完整的确认和取消事件处理
5. **轻量级设计** - 相比 MessageBox 更轻量，适合简单确认场景
6. **无障碍支持** - 良好的键盘导航和屏幕阅读器支持
7. **继承 Popover** - 继承 Popover 的所有特性和配置
8. **插槽支持** - 支持自定义触发元素和内容

### 适用场景

- **删除确认** - 删除数据、文件等不可逆操作
- **提交确认** - 表单提交、数据保存等重要操作
- **状态切换** - 启用/禁用、激活/停用等状态变更
- **批量操作** - 批量删除、批量修改等操作确认
- **敏感操作** - 涉及权限、安全等敏感操作
- **不可撤销操作** - 清空数据、重置系统等操作
- **费用相关** - 涉及付费、扣费等财务操作
- **系统操作** - 重启、关闭、备份等系统级操作

### 最佳实践

1. **合理选择使用场景**
   - 简单确认使用 Popconfirm
   - 复杂交互使用 MessageBox
   - 重要操作提供明确提示

2. **明确提示文字**
   - 使用清晰、具体的提示文字
   - 说明操作的后果和影响
   - 避免模糊或歧义的表述

3. **自定义按钮文字**
   - 使用具体的动作词汇
   - 避免使用"确定"、"取消"等通用词汇
   - 让用户明确知道点击后的结果

4. **合适的图标选择**
   - 危险操作使用警告图标
   - 普通操作使用信息图标
   - 保持图标与操作类型的一致性

5. **合理的位置选择**
   - 考虑触发元素的位置
   - 避免遮挡重要内容
   - 确保在可视区域内显示

6. **完善的事件处理**
   - 处理确认和取消事件
   - 提供操作反馈
   - 考虑异步操作的处理

7. **保持一致性**
   - 在同一应用中保持风格一致
   - 相同类型操作使用相同的确认方式
   - 统一按钮文字和图标使用

8. **考虑用户体验**
   - 避免过度使用确认框
   - 对于可撤销操作考虑使用撤销功能
   - 提供快捷键支持

Popconfirm 是一个实用的确认组件，通过合理使用可以有效提升用户体验，防止误操作，确保重要操作的安全性。

## 参考资料

- [Element Plus Popconfirm 官方文档](https://element-plus.org/zh-CN/component/popconfirm.html)
- [Element Plus Popover 官方文档](https://element-plus.org/zh-CN/component/popover.html)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Web 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [用户体验设计原则](https://www.nngroup.com/articles/)
```