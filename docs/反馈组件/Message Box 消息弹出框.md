# Message Box 消息弹出框

## 概述

MessageBox 是模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、确认消息和提交内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

从设计上来说，MessageBox 的作用是美化系统自带的 alert、confirm 和 prompt，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 主要特性

1. **三种基础类型**：提供 alert、confirm、prompt 三种基础弹框类型，满足不同交互需求
2. **高度可定制**：支持自定义图标、按钮文本、样式类名等多种个性化配置
3. **内容丰富**：支持纯文本、VNode 和 HTML 片段等多种内容格式
4. **交互灵活**：可配置关闭方式、拖拽功能、居中布局等交互行为
5. **安全可靠**：内置 HTML 内容安全控制，防止 XSS 攻击
6. **Promise 支持**：基于 Promise 的异步调用，便于处理用户操作结果
7. **全局方法**：提供全局方法调用，使用简单便捷
8. **上下文继承**：支持应用程序上下文继承，保持组件状态一致性

### 适用场景

- **操作确认**：删除数据、提交表单、重要操作等需要用户确认的场景
- **信息提示**：系统通知、操作结果、错误信息等重要信息展示
- **用户输入**：简单的用户输入收集，如邮箱验证、密码输入等
- **状态询问**：询问用户选择、获取用户决策等交互场景
- **警告提醒**：危险操作警告、权限提醒、系统状态变更等
- **流程中断**：需要用户处理后才能继续的业务流程
- **数据验证**：表单提交前的最终确认、数据校验等
- **用户引导**：重要功能介绍、操作指引等用户教育场景

## 基础用法

### 消息提示

当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open the Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

const open = () => {
  ElMessageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}
</script>
```

调用 ElMessageBox.alert 方法以打开 alert 框。它模拟了系统的 alert，无法通过按下 ESC 或点击框外关闭。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 确认消息

提示用户确认其已经触发的动作，并询问是否进行此操作时会用到此对话框。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open the Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const open = () => {
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>
```

调用 ElMessageBox.confirm 方法以打开 confirm 框。它模拟了系统的 confirm。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 提交内容

当需要用户输入内容时，可以使用 Prompt 类型的消息框。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const open = () => {
  ElMessageBox.prompt('Please input your e-mail', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
</script>
```

调用 ElMessageBox.prompt 方法以打开 prompt 框。它模拟了系统的 prompt。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 使用 VNode

message 可以是 VNode。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 个性化

消息弹框可以被定制来展示各种内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

上面提到的三个方法都是对 ElMessageBox 方法的二次包装。本例直接调用 ElMessageBox 方法，使用了 showCancelButton 字段，用于显示取消按钮。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 使用 HTML 片段

message 支持传入 HTML 字符串来作为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

将 dangerouslyUseHTMLString 属性设置为 true，message 属性就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

**警告：** message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 区分取消操作与关闭操作

有些场景下，点击取消按钮与点击关闭按钮有着不同的含义。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

默认情况下，当用户触发取消（点击取消按钮）和触发关闭（点击关闭按钮或遮罩层、按下 ESC 键）时，Promise 的 reject 回调和 callback 回调的参数均为 'cancel'。如果将 distinguishCancelAndClose 属性设置为 true，则上述两种行为的参数分别为 'cancel' 和 'close'。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 内容居中

消息弹框支持使用居中布局。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

将 center 属性设置为 true 可将内容居中显示。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 自定义图标

图标可以使用任意 Vue 组件或渲染函数 (JSX) 来自定义。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 可拖放

设置 MessageBox 可以拖拽。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

设置 draggable 属性为 true 来开启拖拽弹窗能力。设置 overflow 为 true 可以让拖拽范围超出可视区。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 全局方法

如果你完整引入了 Element Plus，它会为 app.config.globalProperties 添加如下全局方法：$msgbox、$alert、$confirm 和 $prompt。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

因此在 Vue 实例中可以采用本页面中的方式来调用 MessageBox。参数如下：<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

- $msgbox(options)
- $alert(message, title, options) 或 $alert(message, options)
- $confirm(message, title, options) 或 $confirm(message, options)
- $prompt(message, title, options) 或 $prompt(message, options)

### 应用程序上下文继承

现在 MessageBox 接受构造器的 context 作为第二个参数，这个参数允许你将当前应用的上下文注入到消息中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

## 实际应用示例

### 用户管理系统

一个完整的用户管理系统，展示不同类型的 MessageBox 应用场景：

```vue
<template>
  <div class="user-management">
    <h2>用户管理系统</h2>
    
    <div class="user-list">
      <div v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-email">{{ user.email }}</span>
          <span class="user-status" :class="user.status">{{ user.status }}</span>
        </div>
        <div class="user-actions">
          <el-button size="small" @click="editUser(user)">编辑</el-button>
          <el-button size="small" type="warning" @click="toggleStatus(user)">{{ user.status === 'active' ? '禁用' : '启用' }}</el-button>
          <el-button size="small" type="danger" @click="deleteUser(user)">删除</el-button>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button @click="showSystemInfo">系统信息</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: 'inactive' }
])

// 添加用户
const addUser = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入新用户的邮箱地址',
      '添加用户',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '请输入有效的邮箱地址',
        inputPlaceholder: '例如：user@example.com'
      }
    )
    
    // 模拟添加用户
    const newUser: User = {
      id: Date.now(),
      name: value.split('@')[0],
      email: value,
      status: 'active'
    }
    
    users.value.push(newUser)
    ElMessage.success('用户添加成功！')
  } catch {
    ElMessage.info('已取消添加用户')
  }
}

// 编辑用户
const editUser = async (user: User) => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入新的用户名',
      '编辑用户',
      {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        inputValue: user.name,
        inputValidator: (value: string) => {
          if (!value || value.trim().length < 2) {
            return '用户名至少需要2个字符'
          }
          return true
        }
      }
    )
    
    user.name = value
    ElMessage.success('用户信息更新成功！')
  } catch {
    ElMessage.info('已取消编辑')
  }
}

// 切换用户状态
const toggleStatus = async (user: User) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  const type = user.status === 'active' ? 'warning' : 'info'
  
  try {
    await ElMessageBox.confirm(
      `确定要${action}用户 "${user.name}" 吗？`,
      '状态变更确认',
      {
        confirmButtonText: `确定${action}`,
        cancelButtonText: '取消',
        type,
        center: true
      }
    )
    
    user.status = user.status === 'active' ? 'inactive' : 'active'
    ElMessage.success(`用户已${action}！`)
  } catch {
    ElMessage.info('已取消操作')
  }
}

// 删除用户
const deleteUser = async (user: User) => {
  try {
    await ElMessageBox.confirm(
      `此操作将永久删除用户 "${user.name}"，是否继续？`,
      '危险操作警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        center: true,
        distinguishCancelAndClose: true
      }
    )
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
      ElMessage.success('用户删除成功！')
    }
  } catch (action) {
    if (action === 'cancel') {
      ElMessage.info('已取消删除操作')
    } else {
      ElMessage.info('操作已关闭')
    }
  }
}

// 显示系统信息
const showSystemInfo = () => {
  ElMessageBox.alert(
    `<div>
      <p><strong>系统版本：</strong>v2.0.1</p>
      <p><strong>用户总数：</strong>${users.value.length}</p>
      <p><strong>活跃用户：</strong>${users.value.filter(u => u.status === 'active').length}</p>
      <p><strong>最后更新：</strong>${new Date().toLocaleString()}</p>
    </div>`,
    '系统信息',
    {
      confirmButtonText: '知道了',
      dangerouslyUseHTMLString: true,
      center: true
    }
  )
}
</script>

<style scoped>
.user-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-list {
  margin: 20px 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fff;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-name {
  font-weight: bold;
  font-size: 16px;
}

.user-email {
  color: #606266;
  font-size: 14px;
}

.user-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.user-status.active {
  background: #f0f9ff;
  color: #1890ff;
}

.user-status.inactive {
  background: #fff2f0;
  color: #ff4d4f;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.actions {
  text-align: center;
  margin-top: 30px;
}
</style>
```

### 文件管理器

展示文件操作中的各种确认场景：

```vue
<template>
  <div class="file-manager">
    <h2>文件管理器</h2>
    
    <div class="toolbar">
      <el-button type="primary" @click="uploadFile">上传文件</el-button>
      <el-button @click="createFolder">新建文件夹</el-button>
      <el-button type="danger" :disabled="selectedFiles.length === 0" @click="batchDelete">批量删除</el-button>
    </div>
    
    <div class="file-list">
      <div 
        v-for="file in files" 
        :key="file.id" 
        class="file-item"
        :class="{ selected: selectedFiles.includes(file.id) }"
        @click="toggleSelect(file.id)"
      >
        <div class="file-info">
          <i :class="getFileIcon(file.type)"></i>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </div>
        <div class="file-actions" @click.stop>
          <el-button size="small" @click="renameFile(file)">重命名</el-button>
          <el-button size="small" type="danger" @click="deleteFile(file)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface FileItem {
  id: number
  name: string
  type: 'folder' | 'image' | 'document' | 'video' | 'other'
  size: number
}

const files = ref<FileItem[]>([
  { id: 1, name: '项目文档', type: 'folder', size: 0 },
  { id: 2, name: '设计图.png', type: 'image', size: 2048576 },
  { id: 3, name: '需求文档.docx', type: 'document', size: 1024000 },
  { id: 4, name: '演示视频.mp4', type: 'video', size: 52428800 }
])

const selectedFiles = ref<number[]>([])

// 切换选择
const toggleSelect = (id: number) => {
  const index = selectedFiles.value.indexOf(id)
  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    selectedFiles.value.push(id)
  }
}

// 上传文件
const uploadFile = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入要上传的文件名',
      '上传文件',
      {
        confirmButtonText: '开始上传',
        cancelButtonText: '取消',
        inputPlaceholder: '例如：新文档.pdf',
        inputValidator: (value: string) => {
          if (!value || !value.includes('.')) {
            return '请输入有效的文件名（包含扩展名）'
          }
          return true
        }
      }
    )
    
    // 模拟文件上传
    const newFile: FileItem = {
      id: Date.now(),
      name: value,
      type: getFileType(value),
      size: Math.floor(Math.random() * 10000000)
    }
    
    files.value.push(newFile)
    ElMessage.success('文件上传成功！')
  } catch {
    ElMessage.info('已取消上传')
  }
}

// 创建文件夹
const createFolder = async () => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入文件夹名称',
      '新建文件夹',
      {
        confirmButtonText: '创建',
        cancelButtonText: '取消',
        inputPlaceholder: '新文件夹',
        inputValidator: (value: string) => {
          if (!value || value.trim().length === 0) {
            return '文件夹名称不能为空'
          }
          if (files.value.some(f => f.name === value && f.type === 'folder')) {
            return '文件夹名称已存在'
          }
          return true
        }
      }
    )
    
    const newFolder: FileItem = {
      id: Date.now(),
      name: value,
      type: 'folder',
      size: 0
    }
    
    files.value.push(newFolder)
    ElMessage.success('文件夹创建成功！')
  } catch {
    ElMessage.info('已取消创建')
  }
}

// 重命名文件
const renameFile = async (file: FileItem) => {
  try {
    const { value } = await ElMessageBox.prompt(
      '请输入新的文件名',
      '重命名',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: file.name,
        inputValidator: (value: string) => {
          if (!value || value.trim().length === 0) {
            return '文件名不能为空'
          }
          if (value !== file.name && files.value.some(f => f.name === value)) {
            return '文件名已存在'
          }
          return true
        }
      }
    )
    
    file.name = value
    ElMessage.success('重命名成功！')
  } catch {
    ElMessage.info('已取消重命名')
  }
}

// 删除文件
const deleteFile = async (file: FileItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${file.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const index = files.value.findIndex(f => f.id === file.id)
    if (index > -1) {
      files.value.splice(index, 1)
      ElMessage.success('文件删除成功！')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 批量删除
const batchDelete = async () => {
  if (selectedFiles.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedFiles.value.length} 个文件吗？此操作不可恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        center: true
      }
    )
    
    files.value = files.value.filter(f => !selectedFiles.value.includes(f.id))
    selectedFiles.value = []
    ElMessage.success('批量删除成功！')
  } catch {
    ElMessage.info('已取消批量删除')
  }
}

// 工具函数
const getFileType = (filename: string): FileItem['type'] => {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return 'image'
  if (['doc', 'docx', 'pdf', 'txt'].includes(ext || '')) return 'document'
  if (['mp4', 'avi', 'mov'].includes(ext || '')) return 'video'
  return 'other'
}

const getFileIcon = (type: FileItem['type']) => {
  const icons = {
    folder: 'el-icon-folder',
    image: 'el-icon-picture',
    document: 'el-icon-document',
    video: 'el-icon-video-camera',
    other: 'el-icon-document'
  }
  return icons[type]
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '-'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.file-manager {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.file-list {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: #f5f7fa;
}

.file-item.selected {
  background-color: #ecf5ff;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-info i {
  font-size: 20px;
  color: #606266;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: #909399;
  font-size: 12px;
}

.file-actions {
  display: flex;
  gap: 8px;
}
</style>
```

## API

### MessageBox 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| autofocus | 是否自动聚焦 | boolean | true |
| title | MessageBox 标题 | string | '' |
| message | MessageBox 消息正文内容 | string / VNode / Function | '' |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| type | 消息类型，用于显示图标 | 'success' / 'info' / 'warning' / 'error' | '' |
| icon | 自定义图标组件，会覆盖 type 的图标 | string / Component | '' |
| customClass | MessageBox 的自定义类名 | string | '' |
| customStyle | MessageBox 的自定义内联样式 | CSSProperties | {} |
| callback | 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调 | Function | null |
| showClose | 是否显示右上角关闭按钮 | boolean | true |
| beforeClose | 关闭前的回调，会暂停 MessageBox 的关闭 | Function | null |
| distinguishCancelAndClose | 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 ESC 键）进行区分 | boolean | false |
| lockScroll | 是否在 MessageBox 出现时将 body 滚动锁定 | boolean | true |
| showCancelButton | 是否显示取消按钮 | boolean | false |
| showConfirmButton | 是否显示确定按钮 | boolean | true |
| cancelButtonText | 取消按钮的文本内容 | string | '取消' |
| confirmButtonText | 确定按钮的文本内容 | string | '确定' |
| cancelButtonClass | 取消按钮的自定义类名 | string | '' |
| confirmButtonClass | 确定按钮的自定义类名 | string | '' |
| closeOnClickModal | 是否可通过点击遮罩关闭 MessageBox | boolean | true |
| closeOnPressEscape | 是否可通过按下 ESC 键关闭 MessageBox | boolean | true |
| closeOnHashChange | 是否在 hashchange 时关闭 MessageBox | boolean | true |
| showInput | 是否显示输入框 | boolean | false |
| inputPlaceholder | 输入框的占位符 | string | '' |
| inputType | 输入框的类型 | string | 'text' |
| inputValue | 输入框的初始文本 | string | null |
| inputPattern | 输入框的校验表达式 | RegExp | null |
| inputValidator | 输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage | Function | null |
| inputErrorMessage | 校验未通过时的提示文本 | string | '输入的数据不合法!' |
| center | 是否居中布局 | boolean | false |
| draggable | 是否可拖拽 | boolean | false |
| overflow | 拖拽时是否可以超出可视区 | boolean | false |
| roundButton | 是否使用圆角按钮 | boolean | false |
| buttonSize | 自定义确认按钮及取消按钮的大小 | 'small' / 'default' / 'large' | 'default' |

### MessageBox 方法

调用 MessageBox 或 this.$msgbox 会返回当前 MessageBox 的实例。如果需要手动关闭实例，可以调用它的 close 方法。

| 名称 | 描述 | 类型 |
|------|------|------|
| close | 关闭当前的 MessageBox | Function |

## 最佳实践

1. **选择合适的类型**：根据场景选择 alert、confirm 或 prompt
2. **安全使用 HTML**：使用 dangerouslyUseHTMLString 时确保内容安全
3. **合理设置关闭方式**：根据业务需求配置关闭行为
4. **提供清晰的按钮文本**：使用明确的按钮文本提升用户体验
5. **适当使用 beforeClose**：在需要异步操作时使用 beforeClose 回调

## 常见问题

**Q: MessageBox 和 Dialog 有什么区别？**
A: MessageBox 适合展示简单内容，模拟系统原生弹框；Dialog 适合展示复杂内容和自定义布局。

**Q: 如何阻止 MessageBox 关闭？**
A: 使用 beforeClose 回调，在其中不调用 done 方法即可阻止关闭。

**Q: 如何区分取消和关闭操作？**
A: 设置 distinguishCancelAndClose 为 true，取消操作返回 'cancel'，关闭操作返回 'close'。

**Q: 输入框验证失败如何处理？**
A: 使用 inputValidator 函数，返回字符串作为错误提示，返回 false 表示验证失败。

## 总结

Message Box 消息弹出框是 Element Plus 中用于用户交互确认的核心组件，具有以下特点：

### 核心特点

1. **三种基础类型**：提供 alert、confirm、prompt 三种弹框类型，覆盖主要交互场景
2. **高度可定制**：支持自定义图标、按钮文本、样式类名等多种个性化配置
3. **内容丰富**：支持纯文本、VNode 和 HTML 片段等多种内容格式
4. **交互灵活**：可配置关闭方式、拖拽功能、居中布局等交互行为
5. **Promise 支持**：基于 Promise 的异步调用，便于处理用户操作结果
6. **输入验证**：内置输入框验证机制，支持正则表达式和自定义验证函数
7. **安全可靠**：内置 HTML 内容安全控制，防止 XSS 攻击
8. **操作区分**：支持区分取消和关闭操作，提供更精确的用户行为反馈

### 适用场景

- **操作确认**：删除数据、提交表单、重要操作等需要用户确认的场景
- **信息提示**：系统通知、操作结果、错误信息等重要信息展示
- **用户输入**：简单的用户输入收集，如邮箱验证、密码输入等
- **状态询问**：询问用户选择、获取用户决策等交互场景
- **流程中断**：需要用户处理后才能继续的业务流程

### 最佳实践建议

1. **选择合适类型**：根据交互需求选择 alert、confirm 或 prompt 类型
2. **明确按钮文本**：使用清晰、具体的按钮文本，避免模糊表达
3. **合理使用图标**：选择合适的图标类型，增强视觉表达效果
4. **安全使用 HTML**：谨慎使用 HTML 内容，确保内容来源可信
5. **提供输入验证**：对用户输入进行适当验证，提升数据质量
6. **区分操作类型**：在需要时启用操作区分，提供更精确的用户反馈
7. **保持一致性**：在应用中统一弹框样式和交互模式
8. **适度使用拖拽**：根据用户需求决定是否启用拖拽功能

通过合理使用 Message Box 组件，可以为用户提供清晰、直观的交互确认体验，提升应用的用户体验和操作安全性。

## 参考资料

- [Element Plus MessageBox 官方文档](https://element-plus.org/zh-CN/component/message-box.html)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Promise 异步编程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Web 安全最佳实践](https://owasp.org/www-project-top-ten/)
- [用户界面设计原则](https://www.nngroup.com/articles/ten-usability-heuristics/)