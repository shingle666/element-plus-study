# Dropdown 下拉菜单

## 学习目标

通过本章学习，你将掌握：
- 基础下拉菜单和触发方式的配置
- 下拉菜单的事件处理和指令传递
- 分割按钮模式和不同尺寸的使用
- 下拉菜单的样式定制和最佳实践
- 复杂交互场景下的下拉菜单应用

**预计学习时间：** 75分钟

## 概述

Dropdown 下拉菜单组件用于将动作或菜单折叠到下拉菜单中，节省页面空间的同时提供丰富的操作选项。它支持多种触发方式、灵活的配置选项和完善的事件处理机制。

### 主要特性

- **多种触发方式**：支持悬停和点击两种触发模式
- **灵活的菜单结构**：支持分组、分隔符和禁用状态
- **分割按钮模式**：提供主操作按钮和下拉菜单的组合
- **事件处理机制**：完善的指令传递和事件回调
- **样式定制**：支持不同尺寸和主题样式
- **无障碍访问**：良好的键盘导航和屏幕阅读器支持

### 适用场景

- 操作按钮的扩展菜单
- 用户头像的个人中心菜单
- 表格行操作的更多选项
- 导航栏的二级菜单
- 工具栏的功能分组

## 基础用法

### 基础下拉菜单

悬停在下拉菜单上以展开更多操作。通过组件 slot 来设置下拉触发的元素以及需要通过具名 slot 为 dropdown 来设置下拉菜单。默认情况下，只需要悬停在触发菜单的元素上即可，无需点击也会显示下拉菜单。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 触发对象

可使用按钮触发下拉菜单。设置 `split-button` 属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为 true 即可。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown>
    <el-button type="primary">
      更多菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary" @click="handleClick">
    默认按钮
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'

const handleClick = () => {
  console.log('按钮被点击')
}
</script>
```

### 触发方式

可以配置点击激活或者悬停激活。将 `trigger` 属性设置为 click 即可，默认为 hover。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-row class="block-col-2">
    <el-col :span="12">
      <span class="demonstration">hover 激活</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          下拉菜单
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="Circle">狮子头</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="12">
      <span class="demonstration">click 激活</span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          下拉菜单
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="Circle">狮子头</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 菜单隐藏方式

可以通过 `hide-on-click` 属性来配置。下拉菜单默认在点击菜单项后会被隐藏，将 `hide-on-click` 属性设置为 false 可以关闭此功能。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown :hide-on-click="false">
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">黄金糕</el-dropdown-item>
        <el-dropdown-item command="b">狮子头</el-dropdown-item>
        <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
        <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command) => {
  console.log('click on item ' + command)
}
</script>
```

### 不同尺寸

Dropdown 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。使用 `size` 属性配置尺寸，可选的尺寸大小有: large, default 或 small。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown split-button type="primary" size="large">
    大型下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary">
    默认下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary" size="small">
    小型下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

## 实际应用示例

### 1. 用户头像菜单

```vue
<template>
  <div class="user-header">
    <el-dropdown trigger="click" @command="handleUserCommand">
      <div class="user-avatar">
        <el-avatar :src="userInfo.avatar" :size="40" />
        <span class="username">{{ userInfo.name }}</span>
        <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <el-icon><User /></el-icon>
            个人资料
          </el-dropdown-item>
          <el-dropdown-item command="settings">
            <el-icon><Setting /></el-icon>
            账户设置
          </el-dropdown-item>
          <el-dropdown-item command="orders">
            <el-icon><Document /></el-icon>
            我的订单
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  User,
  Setting,
  Document,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()

const userInfo = ref({
  name: '张三',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  email: 'zhangsan@example.com'
})

const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 执行退出登录逻辑
        localStorage.removeItem('token')
        router.push('/login')
        ElMessage.success('已退出登录')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.user-header {
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}
</style>
```

### 2. 表格操作菜单

```vue
<template>
  <div class="table-operations">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row, $index }">
          <el-dropdown 
            trigger="click" 
            @command="(command) => handleRowCommand(command, row, $index)"
          >
            <el-button size="small" type="primary" link>
              更多操作
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="view">
                  <el-icon><View /></el-icon>
                  查看详情
                </el-dropdown-item>
                <el-dropdown-item command="edit">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-dropdown-item>
                <el-dropdown-item 
                  command="status" 
                  :disabled="row.status === '已禁用'"
                >
                  <el-icon><Switch /></el-icon>
                  {{ row.status === '正常' ? '禁用' : '启用' }}
                </el-dropdown-item>
                <el-dropdown-item command="reset" divided>
                  <el-icon><RefreshRight /></el-icon>
                  重置密码
                </el-dropdown-item>
                <el-dropdown-item command="delete" class="danger-item">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowDown,
  View,
  Edit,
  Switch,
  RefreshRight,
  Delete
} from '@element-plus/icons-vue'

const tableData = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    status: '正常'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    status: '已禁用'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    status: '正常'
  }
])

const getStatusType = (status) => {
  const typeMap = {
    '正常': 'success',
    '已禁用': 'danger',
    '待审核': 'warning'
  }
  return typeMap[status] || 'info'
}

const handleRowCommand = async (command, row, index) => {
  switch (command) {
    case 'view':
      ElMessage.info(`查看用户：${row.name}`)
      // 跳转到详情页面
      break
      
    case 'edit':
      ElMessage.info(`编辑用户：${row.name}`)
      // 打开编辑对话框
      break
      
    case 'status':
      try {
        const action = row.status === '正常' ? '禁用' : '启用'
        await ElMessageBox.confirm(
          `确定要${action}用户 ${row.name} 吗？`,
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        // 更新状态
        tableData.value[index].status = row.status === '正常' ? '已禁用' : '正常'
        ElMessage.success(`${action}成功`)
      } catch {
        // 用户取消操作
      }
      break
      
    case 'reset':
      try {
        await ElMessageBox.confirm(
          `确定要重置用户 ${row.name} 的密码吗？`,
          '确认操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        
        ElMessage.success('密码重置成功，新密码已发送到用户邮箱')
      } catch {
        // 用户取消操作
      }
      break
      
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `确定要删除用户 ${row.name} 吗？此操作不可恢复！`,
          '危险操作',
          {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'error'
          }
        )
        
        // 删除用户
        tableData.value.splice(index, 1)
        ElMessage.success('删除成功')
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.table-operations {
  padding: 20px;
}

:deep(.danger-item) {
  color: #f56c6c;
}

:deep(.danger-item:hover) {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
```

### 3. 工具栏功能菜单

```vue
<template>
  <div class="toolbar">
    <!-- 文件操作 -->
    <el-dropdown split-button type="primary" @click="handleNewFile" @command="handleFileCommand">
      新建文件
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="new-folder">
            <el-icon><Folder /></el-icon>
            新建文件夹
          </el-dropdown-item>
          <el-dropdown-item command="new-document">
            <el-icon><Document /></el-icon>
            新建文档
          </el-dropdown-item>
          <el-dropdown-item command="new-spreadsheet">
            <el-icon><Grid /></el-icon>
            新建表格
          </el-dropdown-item>
          <el-dropdown-item command="upload" divided>
            <el-icon><Upload /></el-icon>
            上传文件
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 导出操作 -->
    <el-dropdown trigger="click" @command="handleExportCommand">
      <el-button>
        导出数据
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="excel">
            <el-icon><Document /></el-icon>
            导出为 Excel
          </el-dropdown-item>
          <el-dropdown-item command="pdf">
            <el-icon><Document /></el-icon>
            导出为 PDF
          </el-dropdown-item>
          <el-dropdown-item command="csv">
            <el-icon><Document /></el-icon>
            导出为 CSV
          </el-dropdown-item>
          <el-dropdown-item command="json" divided>
            <el-icon><Document /></el-icon>
            导出为 JSON
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 批量操作 -->
    <el-dropdown 
      trigger="click" 
      :disabled="selectedItems.length === 0"
      @command="handleBatchCommand"
    >
      <el-button :disabled="selectedItems.length === 0">
        批量操作 ({{ selectedItems.length }})
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="batch-edit">
            <el-icon><Edit /></el-icon>
            批量编辑
          </el-dropdown-item>
          <el-dropdown-item command="batch-move">
            <el-icon><FolderOpened /></el-icon>
            批量移动
          </el-dropdown-item>
          <el-dropdown-item command="batch-copy">
            <el-icon><CopyDocument /></el-icon>
            批量复制
          </el-dropdown-item>
          <el-dropdown-item command="batch-delete" divided class="danger-item">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 视图切换 -->
    <el-dropdown trigger="click" @command="handleViewCommand">
      <el-button>
        <el-icon><Grid /></el-icon>
        视图
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="list" :class="{ active: currentView === 'list' }">
            <el-icon><List /></el-icon>
            列表视图
          </el-dropdown-item>
          <el-dropdown-item command="grid" :class="{ active: currentView === 'grid' }">
            <el-icon><Grid /></el-icon>
            网格视图
          </el-dropdown-item>
          <el-dropdown-item command="card" :class="{ active: currentView === 'card' }">
            <el-icon><Postcard /></el-icon>
            卡片视图
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  Folder,
  Document,
  Grid,
  Upload,
  Edit,
  FolderOpened,
  CopyDocument,
  Delete,
  List,
  Postcard
} from '@element-plus/icons-vue'

const selectedItems = ref([1, 2, 3]) // 模拟选中的项目
const currentView = ref('list')

const handleNewFile = () => {
  ElMessage.success('创建新文件')
}

const handleFileCommand = (command) => {
  const actions = {
    'new-folder': '创建新文件夹',
    'new-document': '创建新文档',
    'new-spreadsheet': '创建新表格',
    'upload': '上传文件'
  }
  ElMessage.success(actions[command])
}

const handleExportCommand = (command) => {
  const formats = {
    'excel': 'Excel',
    'pdf': 'PDF',
    'csv': 'CSV',
    'json': 'JSON'
  }
  ElMessage.success(`正在导出为 ${formats[command]} 格式...`)
}

const handleBatchCommand = (command) => {
  const actions = {
    'batch-edit': '批量编辑',
    'batch-move': '批量移动',
    'batch-copy': '批量复制',
    'batch-delete': '批量删除'
  }
  ElMessage.success(`执行${actions[command]}操作`)
}

const handleViewCommand = (command) => {
  currentView.value = command
  const views = {
    'list': '列表视图',
    'grid': '网格视图',
    'card': '卡片视图'
  }
  ElMessage.success(`切换到${views[command]}`)
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  align-items: center;
}

:deep(.danger-item) {
  color: #f56c6c;
}

:deep(.danger-item:hover) {
  background-color: #fef0f0;
  color: #f56c6c;
}

:deep(.active) {
  background-color: #ecf5ff;
  color: #409eff;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
```

## API

### Dropdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 菜单按钮类型，同 Button 组件一样，仅在 split-button 为 true 的情况下有效 | enum | '' |
| size | 菜单尺寸，在 split-button 为 true 的情况下也对触发按钮生效 | enum | '' |
| max-height | 菜单最大高度 | string / number | '' |
| split-button | 下拉触发元素呈现为按钮组 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| placement | 菜单弹出位置 | enum | bottom |
| trigger | 触发下拉的行为 | enum | hover |
| hide-on-click | 是否在点击菜单项后隐藏菜单 | boolean | true |
| show-timeout | 展开下拉菜单的延时，仅在 trigger 为 hover 时有效 | number | 150 |
| hide-timeout | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效） | number | 150 |
| tabindex | Dropdown 组件的 tabindex | number / string | 0 |
| teleported | 是否将下拉列表插入至 body 元素 | boolean | true |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| click | split-button 为 true 时，点击左侧按钮的回调 | Function |
| command | 当下拉项被点击时触发，参数是从下拉菜单中发送的命令 | Function |
| visible-change | 当下拉菜单出现/消失时触发器, 当它出现时, 参数将是 true, 否则将是 false | Function |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 下拉菜单的内容。注意：必须是有效的 html DOM 元素（例如 `<span>`、`<button>` 等）或 el-component，以附加监听触发器 | — |
| dropdown | 下拉列表，通常是 `<el-dropdown-menu>` 组件 | Dropdown-Menu |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Exposes

| 方法名 | 说明 | 类型 |
|--------|------|------|
| handleOpen | 打开下拉菜单 | Function |
| handleClose | 关闭下拉菜单 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| command | 派发到command回调函数的指令参数 | string / number / object | — |
| disabled | 是否禁用 | boolean | false |
| divided | 是否显示分隔符 | boolean | false |
| icon | 自定义图标 | string / Component | — |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown-Item Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义Dropdown-Item内容 |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

## 最佳实践

### 1. 触发方式选择

```vue
<template>
  <div class="trigger-examples">
    <!-- 导航菜单 - 推荐 hover -->
    <el-dropdown trigger="hover" @command="handleNavCommand">
      <span class="nav-item">产品中心</span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="web">Web 应用</el-dropdown-item>
          <el-dropdown-item command="mobile">移动应用</el-dropdown-item>
          <el-dropdown-item command="desktop">桌面应用</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 操作菜单 - 推荐 click -->
    <el-dropdown trigger="click" @command="handleActionCommand">
      <el-button type="primary">操作</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="edit">编辑</el-dropdown-item>
          <el-dropdown-item command="delete">删除</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 右键菜单 - contextmenu -->
    <div 
      class="context-area" 
      @contextmenu.prevent="showContextMenu"
    >
      右键点击此区域
      <el-dropdown 
        ref="contextDropdown"
        trigger="contextmenu"
        @command="handleContextCommand"
      >
        <span></span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="copy">复制</el-dropdown-item>
            <el-dropdown-item command="paste">粘贴</el-dropdown-item>
            <el-dropdown-item command="refresh">刷新</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const contextDropdown = ref()

const handleNavCommand = (command) => {
  ElMessage.info(`导航到：${command}`)
}

const handleActionCommand = (command) => {
  ElMessage.success(`执行操作：${command}`)
}

const handleContextCommand = (command) => {
  ElMessage.info(`右键操作：${command}`)
}

const showContextMenu = (event) => {
  // 手动触发右键菜单
  contextDropdown.value.handleOpen()
}
</script>

<style scoped>
.trigger-examples {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 20px;
}

.nav-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
}

.context-area {
  width: 200px;
  height: 100px;
  border: 2px dashed #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: context-menu;
  border-radius: 4px;
}
</style>
```

### 2. 菜单项设计与分组

```vue
<template>
  <div class="menu-design">
    <!-- 良好的菜单项设计 -->
    <el-dropdown trigger="click" @command="handleWellDesignedCommand">
      <el-button>用户操作</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- 主要操作组 -->
          <el-dropdown-item command="profile">
            <el-icon><User /></el-icon>
            个人资料
          </el-dropdown-item>
          <el-dropdown-item command="settings">
            <el-icon><Setting /></el-icon>
            账户设置
          </el-dropdown-item>
          
          <!-- 次要操作组 -->
          <el-dropdown-item command="help" divided>
            <el-icon><QuestionFilled /></el-icon>
            帮助中心
          </el-dropdown-item>
          <el-dropdown-item command="feedback">
            <el-icon><ChatDotRound /></el-icon>
            意见反馈
          </el-dropdown-item>
          
          <!-- 危险操作组 -->
          <el-dropdown-item command="logout" divided class="danger-item">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <!-- 避免过多菜单项 -->
    <el-dropdown trigger="click" @command="handleCategoryCommand">
      <el-button>分类管理</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="view-all">查看全部</el-dropdown-item>
          <el-dropdown-item command="electronics" divided>
            电子产品
          </el-dropdown-item>
          <el-dropdown-item command="clothing">
            服装配饰
          </el-dropdown-item>
          <el-dropdown-item command="books">
            图书音像
          </el-dropdown-item>
          <el-dropdown-item command="home">
            家居用品
          </el-dropdown-item>
          <el-dropdown-item command="more" divided>
            更多分类...
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import {
  User,
  Setting,
  QuestionFilled,
  ChatDotRound,
  SwitchButton
} from '@element-plus/icons-vue'

const handleWellDesignedCommand = (command) => {
  ElMessage.success(`执行：${command}`)
}

const handleCategoryCommand = (command) => {
  if (command === 'more') {
    ElMessage.info('打开完整分类页面')
  } else {
    ElMessage.success(`选择分类：${command}`)
  }
}
</script>

<style scoped>
.menu-design {
  display: flex;
  gap: 20px;
  padding: 20px;
}

:deep(.danger-item) {
  color: #f56c6c;
}

:deep(.danger-item:hover) {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
```

### 3. 禁用状态与提示

```vue
<template>
  <div class="disabled-examples">
    <el-dropdown trigger="click" @command="handlePermissionCommand">
      <el-button>权限操作</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="read">查看</el-dropdown-item>
          <el-dropdown-item 
            command="edit" 
            :disabled="!hasEditPermission"
          >
            <el-tooltip 
              content="您没有编辑权限" 
              placement="left"
              :disabled="hasEditPermission"
            >
              <span>编辑</span>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item 
            command="delete" 
            :disabled="!hasDeletePermission"
          >
            <el-tooltip 
              content="您没有删除权限" 
              placement="left"
              :disabled="hasDeletePermission"
            >
              <span>删除</span>
            </el-tooltip>
          </el-dropdown-item>
          <el-dropdown-item 
            command="admin" 
            :disabled="!isAdmin"
          >
            <el-tooltip 
              content="仅管理员可用" 
              placement="left"
              :disabled="isAdmin"
            >
              <span>管理员功能</span>
            </el-tooltip>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <div class="permission-controls">
      <el-checkbox v-model="hasEditPermission">编辑权限</el-checkbox>
      <el-checkbox v-model="hasDeletePermission">删除权限</el-checkbox>
      <el-checkbox v-model="isAdmin">管理员</el-checkbox>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const hasEditPermission = ref(false)
const hasDeletePermission = ref(false)
const isAdmin = ref(false)

const handlePermissionCommand = (command) => {
  ElMessage.success(`执行：${command}`)
}
</script>

<style scoped>
.disabled-examples {
  padding: 20px;
}

.permission-controls {
  margin-top: 20px;
  display: flex;
  gap: 16px;
}
</style>
```

### 4. 响应式设计

```vue
<template>
  <div class="responsive-dropdown">
    <el-dropdown 
      :trigger="isMobile ? 'click' : 'hover'"
      :placement="isMobile ? 'bottom' : 'bottom-start'"
      @command="handleResponsiveCommand"
    >
      <el-button :size="isMobile ? 'large' : 'default'">
        响应式菜单
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu :class="{ 'mobile-menu': isMobile }">
          <el-dropdown-item command="home">
            <el-icon><House /></el-icon>
            首页
          </el-dropdown-item>
          <el-dropdown-item command="products">
            <el-icon><Goods /></el-icon>
            产品
          </el-dropdown-item>
          <el-dropdown-item command="about">
            <el-icon><InfoFilled /></el-icon>
            关于我们
          </el-dropdown-item>
          <el-dropdown-item command="contact">
            <el-icon><Phone /></el-icon>
            联系我们
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <div class="device-info">
      <p>当前设备：{{ isMobile ? '移动端' : '桌面端' }}</p>
      <p>触发方式：{{ isMobile ? 'click' : 'hover' }}</p>
      <el-button @click="toggleDevice" size="small">
        切换设备模拟
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowDown,
  House,
  Goods,
  InfoFilled,
  Phone
} from '@element-plus/icons-vue'

const isMobile = ref(false)

const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

const toggleDevice = () => {
  isMobile.value = !isMobile.value
}

const handleResponsiveCommand = (command) => {
  ElMessage.success(`导航到：${command}`)
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
})
</script>

<style scoped>
.responsive-dropdown {
  padding: 20px;
}

.device-info {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.device-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

:deep(.mobile-menu) {
  min-width: 200px;
}

:deep(.mobile-menu .el-dropdown-menu__item) {
  padding: 12px 16px;
  font-size: 16px;
}
</style>
```

### 5. 性能优化

```vue
<template>
  <div class="performance-optimized">
    <!-- 懒加载菜单内容 -->
    <el-dropdown 
      trigger="click" 
      @visible-change="handleVisibleChange"
      @command="handleLazyCommand"
    >
      <el-button :loading="menuLoading">
        动态菜单
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu v-if="menuItems.length > 0">
          <el-dropdown-item 
            v-for="item in menuItems" 
            :key="item.id"
            :command="item.command"
            :disabled="item.disabled"
          >
            <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
        <div v-else class="loading-placeholder">
          <el-icon class="is-loading"><Loading /></el-icon>
          加载中...
        </div>
      </template>
    </el-dropdown>
    
    <!-- 防抖处理 -->
    <el-dropdown 
      trigger="hover"
      @visible-change="handleDebouncedVisibleChange"
      @command="handleDebouncedCommand"
    >
      <el-button>防抖菜单</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="action1">操作 1</el-dropdown-item>
          <el-dropdown-item command="action2">操作 2</el-dropdown-item>
          <el-dropdown-item command="action3">操作 3</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowDown, Loading, User, Setting, Document } from '@element-plus/icons-vue'

const menuLoading = ref(false)
const menuItems = ref([])

// 模拟异步加载菜单数据
const loadMenuItems = async () => {
  menuLoading.value = true
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  menuItems.value = [
    { id: 1, command: 'profile', label: '个人资料', icon: User },
    { id: 2, command: 'settings', label: '设置', icon: Setting },
    { id: 3, command: 'documents', label: '文档', icon: Document, disabled: false }
  ]
  
  menuLoading.value = false
}

const handleVisibleChange = (visible) => {
  if (visible && menuItems.value.length === 0) {
    loadMenuItems()
  }
}

const handleLazyCommand = (command) => {
  ElMessage.success(`执行：${command}`)
}

// 防抖函数
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const handleDebouncedVisibleChange = debounce((visible) => {
  console.log('防抖处理的可见性变化:', visible)
}, 300)

const handleDebouncedCommand = (command) => {
  ElMessage.success(`防抖菜单：${command}`)
}
</script>

<style scoped>
.performance-optimized {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.loading-placeholder {
  padding: 16px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.loading-placeholder .el-icon {
  margin-right: 8px;
}
</style>
```

## 常见问题

### Q: 下拉菜单不显示？
A: 检查是否正确使用了 `#dropdown` 插槽，确保 `el-dropdown-menu` 和 `el-dropdown-item` 的嵌套关系正确。

### Q: 如何阻止菜单项点击后自动关闭？
A: 设置 `hide-on-click="false"` 属性，菜单将不会在点击菜单项后自动关闭。

### Q: 如何自定义下拉菜单的位置？
A: 使用 `placement` 属性设置菜单弹出位置，支持 6 个位置选项。

### Q: split-button 模式下如何处理左侧按钮点击？
A: 监听 `@click` 事件处理左侧按钮点击，监听 `@command` 事件处理下拉菜单项点击。

## 总结

Dropdown 下拉菜单是一个功能强大且灵活的组件，适用于多种场景：

### 主要特点
- **多种触发方式**：支持 hover、click、contextmenu 等触发方式
- **灵活的菜单结构**：支持图标、分隔符、禁用状态等
- **丰富的配置选项**：可自定义位置、尺寸、隐藏方式等
- **良好的可访问性**：支持键盘导航和屏幕阅读器

### 适用场景
- **导航菜单**：网站主导航的子菜单
- **操作菜单**：表格行操作、工具栏功能菜单
- **用户菜单**：用户头像下拉菜单
- **上下文菜单**：右键菜单
- **选择器**：作为选择组件的基础

### 设计原则
- **简洁明了**：菜单项数量适中，分组清晰
- **一致性**：保持触发方式和交互的一致性
- **可访问性**：提供清晰的视觉反馈和状态提示
- **响应式**：适配不同设备和屏幕尺寸

## 参考资料

- [Element Plus Dropdown 官方文档](https://element-plus.org/zh-CN/component/dropdown.html)
- [MDN - HTML select 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/select)
- [WAI-ARIA 菜单设计模式](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [Material Design - Menus](https://material.io/components/menus)
- [Ant Design - Dropdown 设计指南](https://ant.design/components/dropdown-cn/)