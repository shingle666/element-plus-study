# Message 消息提示

## 学习目标

通过本章学习，你将掌握：
- 基础消息提示的使用方法
- 消息类型设置和样式控制
- 消息持续时间和位置控制
- 消息关闭功能和HTML内容
- 消息分组管理和队列处理
- 消息全局配置和最佳实践

**预计学习时间：** 105分钟

## 概述

Message 消息提示是一个轻量级的反馈组件，常用于主动操作后的反馈提示。与 Notification 的区别是后者更多用于系统级通知的被动提醒。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 主要特性

- **多种消息类型**：支持成功、警告、信息、错误四种状态类型
- **灵活显示控制**：可控制显示时长、位置偏移和自动关闭
- **丰富内容支持**：支持纯文本、VNode 和 HTML 片段内容
- **智能分组合并**：相同内容的消息可自动合并，避免重复显示
- **可关闭设计**：支持手动关闭按钮和程序化关闭控制
- **全局方法调用**：提供便捷的全局调用方式和类型化方法
- **上下文继承**：支持应用程序上下文的继承和传递
- **安全机制**：提供 HTML 内容的安全渲染控制

### 适用场景

- **操作反馈**：表单提交、数据保存、删除操作等的结果提示
- **状态通知**：登录成功、退出登录、权限验证等状态变化
- **错误提示**：网络请求失败、表单验证错误、系统异常等
- **进度提醒**：文件上传、数据处理、批量操作等进度反馈
- **用户引导**：功能介绍、操作提示、帮助信息等
- **系统消息**：版本更新、维护通知、重要公告等
- **交互确认**：操作成功确认、状态变更通知等
- **临时提示**：快捷操作提示、键盘快捷键提醒等

## 基础用法

### 基础用法

从顶部出现，3 秒后自动消失。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

Message 在配置上与 Notification 非常类似，所以部分 options 在此不做详尽解释。文末有 options 列表，可以结合 Notification 的文档理解它们。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

Element Plus 注册了一个全局的 $message方法用于调用。Message 可以接收一个字符串或一个 VNode 作为参数，它会被显示为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open">打开消息提示</el-button>
  <el-button :plain="true" @click="openVn">VNode</el-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { ElMessage } from 'element-plus'

const open = () => {
  ElMessage('只是一条消息提示')
}

const openVn = () => {
  ElMessage({
    message: h('p', null, [
      h('span', null, '内容可以是 '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
  })
}
</script>
```

### 不同状态

用来显示「成功、警告、消息、错误」类的操作反馈。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

当需要自定义更多属性时，Message 也可以接收一个对象为参数。比如，设置 type 字段可以定义不同的状态，默认为info。此时正文内容以 message 的值传入。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

同时，我们也为 Message 的各种 type 注册了方法，可以在不传入 type 字段的情况下像 open4 那样直接调用。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage.success({
    message: '恭喜你，这是一条成功消息',
    type: 'success',
  })
}

const open2 = () => {
  ElMessage.warning({
    message: '警告哦，这是一条警告消息',
    type: 'warning',
  })
}

const open3 = () => {
  ElMessage('这是一条消息提示')
}

const open4 = () => {
  ElMessage.error('错了哦，这是一条错误消息')
}
</script>
```

### Plain 背景

设置 plain 为 plain 背景。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage.success({
    message: '恭喜你，这是一条成功消息',
    plain: true,
  })
}

const open2 = () => {
  ElMessage.warning({
    message: '警告哦，这是一条警告消息',
    plain: true,
  })
}

const open3 = () => {
  ElMessage({
    message: '这是一条消息提示',
    plain: true,
  })
}

const open4 = () => {
  ElMessage.error({
    message: '错了哦，这是一条错误消息',
    plain: true,
  })
}
</script>
```

### 可关闭的消息提示

可以添加关闭按钮。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

默认的 Message 是不可以被人工关闭的。如果你需要手动关闭功能，你可以把 showClose 设置为 true。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

此外，和 Notification 一样，Message 拥有可控的 duration，默认的关闭时间为 3000 毫秒，当把这个属性的值设置为0便表示该消息不会被自动关闭。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">消息</el-button>
  <el-button :plain="true" @click="open2">成功</el-button>
  <el-button :plain="true" @click="open3">警告</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage({
    showClose: true,
    message: '这是一条消息提示',
  })
}

const open2 = () => {
  ElMessage({
    showClose: true,
    message: '恭喜你，这是一条成功消息',
    type: 'success',
  })
}

const open3 = () => {
  ElMessage({
    showClose: true,
    message: '警告哦，这是一条警告消息',
    type: 'warning',
  })
}

const open4 = () => {
  ElMessage({
    showClose: true,
    message: '错了哦，这是一条错误消息',
    type: 'error',
  })
}
</script>
```

### 使用 HTML 片段作为正文内容

message 还支持使用 HTML 字符串作为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

将dangerouslyUseHTMLString属性设置为 true,message 就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="openHTML">使用 HTML 片段</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const openHTML = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: '<strong>这是 <i>HTML</i> 片段</strong>',
  })
}
</script>
```

**安全警告**：message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 分组消息合并

合并相同内容的消息。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

设置 grouping 为 true，内容相同的 message 将被合并。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage({
    message: '恭喜你，这是一条成功消息',
    type: 'success',
    grouping: true,
  })
}

const open2 = () => {
  ElMessage({
    message: '警告哦，这是一条警告消息',
    type: 'warning',
    grouping: true,
  })
}

const open3 = () => {
  ElMessage({
    message: '这是一条消息提示',
    grouping: true,
  })
}

const open4 = () => {
  ElMessage({
    message: '错了哦，这是一条错误消息',
    type: 'error',
    grouping: true,
  })
}
</script>
```

### 全局方法

Element Plus 为 app.config.globalProperties 添加了全局方法 $message。因此在 vue 实例中你可以使用当前页面中的调用方式调用 Message。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 单独引用

```typescript
import { ElMessage } from 'element-plus'
```

此时调用方法为 ElMessage(options)。我们也为每个 type 定义了各自的方法，如 ElMessage.success(options)。并且可以调用 ElMessage.closeAll() 手动关闭所有实例。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 应用程序上下文继承

现在 Message 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Message 中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

你可以像这样使用它：

```typescript
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

// 在你的 setup 方法中
const { appContext } = getCurrentInstance()!
ElMessage({}, appContext)
```

如果您全局注册了 ElMessage 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 实际应用示例

### 用户管理系统消息反馈

一个完整的用户管理系统，展示各种操作的消息反馈：

```vue
<template>
  <div class="user-management-demo">
    <div class="header">
      <h2>用户管理系统</h2>
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
    </div>

    <el-table :data="users" style="width: 100%">
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
          <el-button 
            size="small" 
            :type="row.status === 'active' ? 'warning' : 'success'"
            @click="toggleUserStatus(row)"
          >
            {{ row.status === 'active' ? '禁用' : '激活' }}
          </el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          <el-button size="small" type="info" @click="resetPassword(row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="编辑者" value="editor" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 批量操作区域 -->
    <div class="batch-operations" style="margin-top: 20px">
      <h3>批量操作演示</h3>
      <el-button @click="batchActivateUsers">批量激活用户</el-button>
      <el-button @click="batchDeactivateUsers">批量禁用用户</el-button>
      <el-button @click="batchDeleteUsers" type="danger">批量删除用户</el-button>
      <el-button @click="exportUsers" type="success">导出用户数据</el-button>
    </div>

    <!-- 消息测试区域 -->
    <div class="message-test" style="margin-top: 20px">
      <h3>消息类型演示</h3>
      <el-button @click="showSuccessMessage">成功消息</el-button>
      <el-button @click="showWarningMessage">警告消息</el-button>
      <el-button @click="showInfoMessage">信息消息</el-button>
      <el-button @click="showErrorMessage">错误消息</el-button>
      <el-button @click="showGroupedMessages">分组消息</el-button>
      <el-button @click="showHTMLMessage">HTML 消息</el-button>
      <el-button @click="showPersistentMessage">持久消息</el-button>
      <el-button @click="closeAllMessages" type="danger">关闭所有消息</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'editor', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'viewer', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'editor', status: 'active' }
])

const dialogVisible = ref(false)
const isEdit = ref(false)
const saving = ref(false)
const userFormRef = ref()

const userForm = reactive({
  id: null,
  name: '',
  email: '',
  role: ''
})

const userRules = {
  name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
}

const showAddUserDialog = () => {
  isEdit.value = false
  Object.assign(userForm, { id: null, name: '', email: '', role: '' })
  dialogVisible.value = true
}

const editUser = (user) => {
  isEdit.value = true
  Object.assign(userForm, { ...user })
  dialogVisible.value = true
}

const saveUser = async () => {
  try {
    await userFormRef.value.validate()
    saving.value = true
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEdit.value) {
      const index = users.value.findIndex(u => u.id === userForm.id)
      if (index > -1) {
        users.value[index] = { ...userForm }
      }
      ElMessage.success({
        message: `用户 ${userForm.name} 更新成功`,
        showClose: true,
        duration: 3000
      })
    } else {
      const newUser = {
        ...userForm,
        id: Math.max(...users.value.map(u => u.id)) + 1,
        status: 'active'
      }
      users.value.push(newUser)
      ElMessage.success({
        message: `用户 ${userForm.name} 添加成功`,
        showClose: true,
        duration: 3000
      })
    }
    
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error({
      message: '表单验证失败，请检查输入内容',
      showClose: true,
      duration: 5000
    })
  } finally {
    saving.value = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    // 模拟状态切换操作
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    user.status = newStatus
    
    ElMessage({
      message: `用户 ${user.name} 已${newStatus === 'active' ? '激活' : '禁用'}`,
      type: newStatus === 'active' ? 'success' : 'warning',
      showClose: true
    })
  } catch (error) {
    ElMessage.error(`操作失败：${error.message}`)
  }
}

const deleteUser = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.name} 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟删除操作
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
    
    ElMessage.success({
      message: `用户 ${user.name} 删除成功`,
      showClose: true
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`删除失败：${error.message}`)
    }
  }
}

const resetPassword = async (user) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 ${user.name} 的密码吗？`,
      '重置密码确认',
      {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // 模拟重置密码操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success({
      message: `用户 ${user.name} 的密码已重置，新密码已发送到邮箱`,
      showClose: true,
      duration: 5000
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`重置密码失败：${error.message}`)
    }
  }
}

// 批量操作
const batchActivateUsers = async () => {
  const inactiveUsers = users.value.filter(u => u.status === 'inactive')
  if (inactiveUsers.length === 0) {
    ElMessage.warning('没有需要激活的用户')
    return
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    inactiveUsers.forEach(user => user.status = 'active')
    
    ElMessage.success({
      message: `成功激活 ${inactiveUsers.length} 个用户`,
      grouping: true,
      showClose: true
    })
  } catch (error) {
    ElMessage.error('批量激活失败')
  }
}

const batchDeactivateUsers = async () => {
  const activeUsers = users.value.filter(u => u.status === 'active')
  if (activeUsers.length === 0) {
    ElMessage.warning('没有需要禁用的用户')
    return
  }
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    activeUsers.forEach(user => user.status = 'inactive')
    
    ElMessage.warning({
      message: `成功禁用 ${activeUsers.length} 个用户`,
      grouping: true,
      showClose: true
    })
  } catch (error) {
    ElMessage.error('批量禁用失败')
  }
}

const batchDeleteUsers = async () => {
  if (users.value.length === 0) {
    ElMessage.warning('没有可删除的用户')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除所有 ${users.value.length} 个用户吗？此操作不可恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    const deletedCount = users.value.length
    users.value = []
    
    ElMessage.success({
      message: `成功删除 ${deletedCount} 个用户`,
      showClose: true,
      duration: 5000
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const exportUsers = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success({
      message: '用户数据导出成功，文件已下载到本地',
      showClose: true,
      duration: 4000
    })
  } catch (error) {
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 消息类型演示
const showSuccessMessage = () => {
  ElMessage.success({
    message: '这是一条成功消息，操作已完成',
    showClose: true
  })
}

const showWarningMessage = () => {
  ElMessage.warning({
    message: '这是一条警告消息，请注意检查',
    showClose: true
  })
}

const showInfoMessage = () => {
  ElMessage.info({
    message: '这是一条信息消息，仅供参考',
    showClose: true
  })
}

const showErrorMessage = () => {
  ElMessage.error({
    message: '这是一条错误消息，操作失败',
    showClose: true
  })
}

const showGroupedMessages = () => {
  // 连续显示相同内容的消息，会被自动合并
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      ElMessage({
        message: '这是一条会被分组的消息',
        grouping: true,
        showClose: true
      })
    }, i * 200)
  }
}

const showHTMLMessage = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: '<strong>这是包含 <em style="color: #409EFF">HTML</em> 的消息</strong>',
    showClose: true,
    duration: 5000
  })
}

const showPersistentMessage = () => {
  ElMessage({
    message: '这是一条持久消息，不会自动关闭',
    type: 'info',
    showClose: true,
    duration: 0
  })
}

const closeAllMessages = () => {
  ElMessage.closeAll()
  ElMessage.success('所有消息已关闭')
}
</script>

<style scoped>
.user-management-demo {
  padding: 20px;
  max-width: 1200px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.batch-operations,
.message-test {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-top: 20px;
}

.batch-operations h3,
.message-test h3 {
  margin: 0 0 12px 0;
  color: #303133;
}

.batch-operations .el-button,
.message-test .el-button {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
```

### 表单验证消息系统

一个展示表单验证和提交反馈的完整示例：

```vue
<template>
  <div class="form-validation-demo">
    <h2>用户注册表单</h2>
    
    <el-form 
      ref="registerFormRef" 
      :model="registerForm" 
      :rules="registerRules" 
      label-width="100px"
      style="max-width: 600px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="registerForm.username" 
          placeholder="请输入用户名"
          @blur="checkUsername"
        />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input 
          v-model="registerForm.email" 
          placeholder="请输入邮箱地址"
          @blur="checkEmail"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input 
          v-model="registerForm.password" 
          type="password" 
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input 
          v-model="registerForm.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码"
          show-password
        />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input 
          v-model="registerForm.phone" 
          placeholder="请输入手机号"
        />
      </el-form-item>
      
      <el-form-item label="验证码" prop="captcha">
        <div style="display: flex; gap: 12px">
          <el-input 
            v-model="registerForm.captcha" 
            placeholder="请输入验证码"
            style="flex: 1"
          />
          <el-button 
            @click="sendCaptcha" 
            :disabled="captchaCountdown > 0"
            :loading="sendingCaptcha"
          >
            {{ captchaCountdown > 0 ? `${captchaCountdown}s` : '发送验证码' }}
          </el-button>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitForm" 
          :loading="submitting"
          style="width: 100%"
        >
          注册
        </el-button>
      </el-form-item>
    </el-form>
    
    <!-- 消息配置测试 -->
    <div class="message-config-test" style="margin-top: 40px">
      <h3>消息配置测试</h3>
      <div class="config-options">
        <el-form :inline="true">
          <el-form-item label="消息类型">
            <el-select v-model="messageConfig.type">
              <el-option label="成功" value="success" />
              <el-option label="警告" value="warning" />
              <el-option label="信息" value="info" />
              <el-option label="错误" value="error" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="显示时长">
            <el-input-number 
              v-model="messageConfig.duration" 
              :min="0" 
              :max="10000" 
              :step="1000"
            />
          </el-form-item>
          
          <el-form-item label="偏移量">
            <el-input-number 
              v-model="messageConfig.offset" 
              :min="0" 
              :max="200"
            />
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="messageConfig.showClose">显示关闭按钮</el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="messageConfig.plain">纯色背景</el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-checkbox v-model="messageConfig.grouping">消息分组</el-checkbox>
          </el-form-item>
        </el-form>
        
        <el-button @click="showConfiguredMessage">显示配置的消息</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const registerFormRef = ref()
const submitting = ref(false)
const sendingCaptcha = ref(false)
const captchaCountdown = ref(0)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  captcha: ''
})

const messageConfig = reactive({
  type: 'info',
  duration: 3000,
  offset: 16,
  showClose: false,
  plain: false,
  grouping: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const checkUsername = async () => {
  if (!registerForm.username) return
  
  try {
    // 模拟检查用户名是否存在
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟用户名已存在的情况
    if (registerForm.username === 'admin') {
      ElMessage.warning({
        message: '用户名已存在，请选择其他用户名',
        showClose: true
      })
    } else {
      ElMessage.success({
        message: '用户名可用',
        duration: 2000
      })
    }
  } catch (error) {
    ElMessage.error('检查用户名失败，请稍后重试')
  }
}

const checkEmail = async () => {
  if (!registerForm.email) return
  
  try {
    // 模拟检查邮箱是否已注册
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟邮箱已注册的情况
    if (registerForm.email === 'admin@example.com') {
      ElMessage.warning({
        message: '该邮箱已被注册，请使用其他邮箱',
        showClose: true
      })
    } else {
      ElMessage.success({
        message: '邮箱可用',
        duration: 2000
      })
    }
  } catch (error) {
    ElMessage.error('检查邮箱失败，请稍后重试')
  }
}

const sendCaptcha = async () => {
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.phone)) {
    ElMessage.error('请输入正确的手机号')
    return
  }
  
  sendingCaptcha.value = true
  
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success({
      message: '验证码已发送到您的手机，请注意查收',
      showClose: true,
      duration: 5000
    })
    
    // 开始倒计时
    captchaCountdown.value = 60
    const timer = setInterval(() => {
      captchaCountdown.value--
      if (captchaCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    ElMessage.error('发送验证码失败，请稍后重试')
  } finally {
    sendingCaptcha.value = false
  }
}

const submitForm = async () => {
  try {
    await registerFormRef.value.validate()
    
    submitting.value = true
    
    // 模拟表单提交
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟提交成功
    ElMessage.success({
      message: '注册成功！欢迎加入我们',
      showClose: true,
      duration: 5000
    })
    
    // 重置表单
    registerFormRef.value.resetFields()
    
  } catch (error) {
    if (error.message) {
      ElMessage.error({
        message: `注册失败：${error.message}`,
        showClose: true,
        duration: 5000
      })
    } else {
      ElMessage.error({
        message: '表单验证失败，请检查输入内容',
        showClose: true
      })
    }
  } finally {
    submitting.value = false
  }
}

const showConfiguredMessage = () => {
  ElMessage({
    message: '这是一条根据配置显示的消息',
    type: messageConfig.type,
    duration: messageConfig.duration,
    offset: messageConfig.offset,
    showClose: messageConfig.showClose,
    plain: messageConfig.plain,
    grouping: messageConfig.grouping
  })
}
</script>

<style scoped>
.form-validation-demo {
  padding: 20px;
  max-width: 800px;
}

.message-config-test {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.config-options {
  margin-top: 16px;
}

.config-options .el-form-item {
  margin-bottom: 12px;
}
</style>
```

## API

### Message 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| message | 消息文字 | string / VNode / Function | '' |
| type | 消息类型 | 'success' / 'warning' / 'info' / 'error' | 'info' |
| plain | 是否纯色 | boolean | false |
| icon | 自定义图标，该属性会覆盖 type 的图标 | string / Component | — |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| customClass | 自定义类名 | string | '' |
| duration | 显示时间，单位为毫秒。设为 0 则不会自动关闭 | number | 3000 |
| showClose | 是否显示关闭按钮 | boolean | false |
| onClose | 关闭时的回调函数, 参数为被关闭的 message 实例 | Function | — |
| offset | Message 距离窗口顶部的偏移量 | number | 16 |
| appendTo | 设置 message 的根元素，默认为 document.body | CSSSelector / HTMLElement | — |
| grouping | 合并内容相同的消息，不支持 VNode 类型的消息 | boolean | false |
| repeatNum | 重复次数，类似于 Badge 。当和 grouping 属性一起使用时作为初始数量使用 | number | 1 |

<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Message 方法

调用 Message 或 this.$message 会返回当前 Message 的实例。如果需要手动关闭实例，可以调用它的 close 方法。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

| 名称 | 描述 | 类型 |
|------|------|------|
| close | 关闭当前的 Message | Function |

<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 最佳实践

1. **合理选择消息类型**：根据操作结果选择合适的消息类型（success、warning、info、error）
2. **控制显示时长**：根据消息重要性设置合适的 duration，重要消息可设置为 0 不自动关闭
3. **避免消息堆积**：使用 grouping 属性合并相同内容的消息，避免界面混乱
4. **安全使用 HTML**：谨慎使用 dangerouslyUseHTMLString，确保内容安全可信
5. **适当使用关闭按钮**：对于重要或持久显示的消息，启用 showClose 选项
6. **合理设置偏移量**：根据页面布局调整 offset 值，避免遮挡重要内容

## 常见问题

### Q: Message 和 Notification 有什么区别？
A: Message 常用于主动操作后的反馈提示，从顶部出现。Notification 更多用于系统级通知的被动提醒，从右上角弹出。Message 更适合简短的操作反馈，Notification 适合较复杂的通知内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 实践项目

### 消息系统实现

创建一个完整的消息反馈系统，包含以下功能：

1. **操作成功提示**
   - 数据保存成功
   - 文件上传完成
   - 表单提交成功

2. **错误消息处理**
   - 网络请求失败
   - 表单验证错误
   - 权限不足提示

3. **消息队列管理**
   - 批量操作反馈
   - 消息分组显示
   - 消息优先级处理

### 实践要点

- 根据不同操作类型选择合适的消息类型
- 实现消息的统一管理和配置
- 处理并发消息的显示策略
- 优化用户体验和视觉效果

## 学习检查清单

- [ ] 掌握基础消息提示的使用
- [ ] 理解不同消息类型的应用场景
- [ ] 熟练配置消息的显示时长和位置
- [ ] 掌握消息的关闭和HTML内容功能
- [ ] 理解消息分组和队列处理机制
- [ ] 完成消息系统的实践项目

## 注意事项

1. **消息的优先级管理**
   - 错误消息优先级最高
   - 成功消息可以适当延迟显示
   - 避免同时显示过多消息

2. **用户注意力的引导**
   - 重要消息使用醒目的颜色
   - 关键操作结果需要明确反馈
   - 避免频繁的消息打扰

3. **反馈信息的及时性**
   - 操作后立即给出反馈
   - 异步操作要有加载状态
   - 错误信息要准确描述问题

4. **无障碍访问支持**
   - 确保消息内容可被屏幕阅读器识别
   - 提供键盘操作支持
   - 考虑色盲用户的使用体验

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**

### Q: 如何手动关闭所有 Message 实例？
A: 可以调用 ElMessage.closeAll() 方法手动关闭所有实例。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何安全地使用 HTML 片段？
A: message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何实现消息分组合并？
A: 设置 grouping 为 true，内容相同的 message 将被合并。这个功能不支持 VNode 类型的消息。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何在应用中继承上下文？
A: 现在 Message 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Message 中。如果您全局注册了 ElMessage 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 总结

Message 消息提示是 Element Plus 中用于操作反馈的核心组件，具有以下特点：

### 核心特点

1. **多样化类型**：支持成功、警告、信息、错误四种消息类型，满足不同场景需求
2. **灵活配置**：可控制显示时长、位置偏移、关闭按钮等多种显示属性
3. **内容丰富**：支持纯文本、VNode 和 HTML 片段等多种内容格式
4. **智能管理**：提供消息分组合并功能，避免重复消息堆积
5. **便捷调用**：提供全局方法和类型化方法，调用简单直观
6. **安全可靠**：内置 HTML 内容安全控制，防止 XSS 攻击

### 适用场景

- **操作反馈**：表单提交、数据保存、删除操作等结果提示
- **状态通知**：登录状态、权限验证、系统状态变化等
- **错误提示**：网络异常、验证失败、系统错误等问题反馈
- **进度提醒**：文件处理、数据同步、批量操作等进度通知

### 最佳实践建议

1. **合理选择类型**：根据操作结果和重要性选择合适的消息类型
2. **控制显示时长**：重要消息适当延长显示时间或设为持久显示
3. **避免消息泛滥**：使用分组功能合并相同内容，控制消息数量
4. **安全使用 HTML**：谨慎使用 HTML 内容，确保内容来源可信
5. **提供关闭选项**：对于重要或持久消息，启用手动关闭功能
6. **保持一致性**：在应用中统一消息样式和交互模式

通过合理使用 Message 组件，可以为用户提供及时、准确的操作反馈，提升应用的用户体验和交互质量。

## 参考资料

- [Element Plus Message 官方文档](https://element-plus.org/zh-CN/component/message.html)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Web 安全最佳实践](https://owasp.org/www-project-top-ten/)
- [用户界面设计原则](https://www.nngroup.com/articles/ten-usability-heuristics/)