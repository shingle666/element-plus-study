# Switch 开关

## 概述

Switch 开关组件表示两种相互对立的状态间的切换，多用于触发「开/关」。它是一个简单而直观的组件，提供了清晰的视觉反馈和良好的用户体验。

## 学习目标

- 掌握 Switch 的基本概念和使用场景
- 学会基础开关的使用方法
- 了解开关的状态控制和事件处理
- 掌握不同样式和尺寸的开关实现
- 学会自定义开关的文本和图标
- 了解开关的禁用状态和加载状态
- 掌握 API 的完整使用方法

## 基础用法

### 基本开关

最简单的开关用法：

```vue
<template>
  <div>
    <el-switch v-model="value1" />
    <el-switch v-model="value2" />
    <p>开关1状态：{{ value1 }}</p>
    <p>开关2状态：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用开关：

```vue
<template>
  <div>
    <el-switch v-model="value1" disabled />
    <el-switch v-model="value2" disabled />
    <p>禁用状态（关）：{{ value1 }}</p>
    <p>禁用状态（开）：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(false)
const value2 = ref(true)
</script>
```

### 加载状态

通过 `loading` 属性来设置开关的加载状态：

```vue
<template>
  <div>
    <el-switch v-model="value1" loading />
    <el-switch v-model="value2" loading />
    <p>加载状态（关）：{{ value1 }}</p>
    <p>加载状态（开）：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(false)
const value2 = ref(true)
</script>
```

## 文字描述

### 基础文字描述

使用 `active-text` 和 `inactive-text` 属性来设置开关的文字描述：

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      active-text="开启"
      inactive-text="关闭"
    />
    <br />
    <el-switch
      v-model="value2"
      active-text="启用"
      inactive-text="禁用"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

### 文字内显示

设置 `inline-prompt` 属性，可以在开关内显示文字：

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      inline-prompt
      active-text="开"
      inactive-text="关"
    />
    <br />
    <el-switch
      v-model="value2"
      inline-prompt
      active-text="Y"
      inactive-text="N"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

## 显示自定义图标

使用 `active-icon` 和 `inactive-icon` 属性来设置开关的图标：

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      :active-icon="Check"
      :inactive-icon="Close"
    />
    <br />
    <el-switch
      v-model="value2"
      inline-prompt
      :active-icon="Check"
      :inactive-icon="Close"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'

const value1 = ref(true)
const value2 = ref(false)
</script>
```

## 扩展的 value 类型

设置 `active-value` 和 `inactive-value` 属性，接受 `Boolean`、`String` 或 `Number` 类型的值：

```vue
<template>
  <div>
    <el-switch
      v-model="value1"
      active-value="100"
      inactive-value="0"
    />
    <p>当前值：{{ value1 }}（类型：{{ typeof value1 }}）</p>
    
    <el-switch
      v-model="value2"
      active-value="on"
      inactive-value="off"
    />
    <p>当前值：{{ value2 }}（类型：{{ typeof value2 }}）</p>
    
    <el-switch
      v-model="value3"
      :active-value="1"
      :inactive-value="0"
    />
    <p>当前值：{{ value3 }}（类型：{{ typeof value3 }}）</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('100')
const value2 = ref('on')
const value3 = ref(1)
</script>
```

## 尺寸

使用 `size` 属性来设置开关的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-switch v-model="value1" size="large" />
    
    <h4>默认尺寸</h4>
    <el-switch v-model="value2" />
    
    <h4>小尺寸</h4>
    <el-switch v-model="value3" size="small" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(true)
const value3 = ref(true)
</script>
```

## 实际应用示例

### 设置面板开关

```vue
<template>
  <div class="settings-panel">
    <h3>系统设置</h3>
    
    <div class="setting-item">
      <span>消息通知</span>
      <el-switch
        v-model="settings.notification"
        active-text="开启"
        inactive-text="关闭"
        @change="handleNotificationChange"
      />
    </div>
    
    <div class="setting-item">
      <span>自动保存</span>
      <el-switch
        v-model="settings.autoSave"
        :loading="autoSaveLoading"
        @change="handleAutoSaveChange"
      />
    </div>
    
    <div class="setting-item">
      <span>深色模式</span>
      <el-switch
        v-model="settings.darkMode"
        inline-prompt
        active-text="暗"
        inactive-text="亮"
        @change="handleThemeChange"
      />
    </div>
    
    <div class="setting-item">
      <span>维护模式</span>
      <el-switch
        v-model="settings.maintenance"
        :disabled="!isAdmin"
        style="--el-switch-on-color: #ff4949"
        @change="handleMaintenanceChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const isAdmin = ref(true)
const autoSaveLoading = ref(false)

const settings = reactive({
  notification: true,
  autoSave: false,
  darkMode: false,
  maintenance: false
})

const handleNotificationChange = (value) => {
  ElMessage.success(`消息通知已${value ? '开启' : '关闭'}`)
}

const handleAutoSaveChange = async (value) => {
  autoSaveLoading.value = true
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000))
  autoSaveLoading.value = false
  ElMessage.success(`自动保存已${value ? '开启' : '关闭'}`)
}

const handleThemeChange = (value) => {
  document.documentElement.classList.toggle('dark', value)
  ElMessage.success(`已切换到${value ? '深色' : '浅色'}模式`)
}

const handleMaintenanceChange = (value) => {
  if (value) {
    ElMessage.warning('系统已进入维护模式')
  } else {
    ElMessage.success('系统已退出维护模式')
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}
</style>
```

### 表格行状态控制

```vue
<template>
  <div>
    <h3>用户管理</h3>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-switch
            v-model="row.active"
            active-text="启用"
            inactive-text="禁用"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="VIP" width="80">
        <template #default="{ row }">
          <el-switch
            v-model="row.vip"
            inline-prompt
            active-text="V"
            inactive-text="N"
            style="--el-switch-on-color: #f56c6c"
            @change="handleVipChange(row)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const users = reactive([
  { id: 1, name: '张三', email: 'zhangsan@example.com', active: true, vip: false },
  { id: 2, name: '李四', email: 'lisi@example.com', active: false, vip: true },
  { id: 3, name: '王五', email: 'wangwu@example.com', active: true, vip: false }
])

const handleStatusChange = (user) => {
  ElMessage.success(`用户 ${user.name} 已${user.active ? '启用' : '禁用'}`)
}

const handleVipChange = (user) => {
  ElMessage.success(`用户 ${user.name} VIP状态已${user.vip ? '开启' : '关闭'}`)
}
</script>
```

## API 文档

### Switch Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值，必须等于 active-value 或 inactive-value，默认为 Boolean 类型 | boolean / string / number | false |
| disabled | 是否禁用 | boolean | false |
| loading | 是否显示加载中 | boolean | false |
| size | switch 的尺寸 | enum | — |
| width | switch 的宽度 | number / string | — |
| inline-prompt | 是否在按钮内显示图标或文本 | boolean | false |
| active-icon | switch 状态为 on 时所显示图标，设置此项会忽略 active-text | string / Component | — |
| inactive-icon | switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text | string / Component | — |
| active-text | switch 状态为 on 时的文字描述 | string | — |
| inactive-text | switch 状态为 off 时的文字描述 | string | — |
| active-value | switch 状态为 on 时的值 | boolean / string / number | true |
| inactive-value | switch 状态为 off 时的值 | boolean / string / number | false |
| name | switch 对应的 name 属性 | string | — |
| validate-event | 是否触发表单验证 | boolean | true |
| before-change | switch 状态改变前的钩子，返回 false 或者返回 Promise 且被 reject 则停止切换 | Function | — |
| id | input 的 id | string | — |
| tabindex | input 的 tabindex | string / number | — |
| label | 与 switch 关联的标签文字 | string | — |

### Switch Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | switch 状态发生变化时的回调函数 | Function |

### Switch Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 switch 获取焦点 | Function |
| checked | 当前是否选中 | boolean |

## 实践练习

### 练习1：权限控制面板

创建一个权限控制面板，包含多个功能开关：

```vue
<template>
  <div class="permission-panel">
    <h3>权限设置</h3>
    <div v-for="permission in permissions" :key="permission.key" class="permission-item">
      <div class="permission-info">
        <span class="permission-name">{{ permission.name }}</span>
        <span class="permission-desc">{{ permission.description }}</span>
      </div>
      <el-switch
        v-model="permission.enabled"
        :disabled="permission.required"
        @change="handlePermissionChange(permission)"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const permissions = reactive([
  {
    key: 'read',
    name: '查看权限',
    description: '允许查看系统数据',
    enabled: true,
    required: true
  },
  {
    key: 'write',
    name: '编辑权限',
    description: '允许编辑系统数据',
    enabled: false,
    required: false
  },
  {
    key: 'delete',
    name: '删除权限',
    description: '允许删除系统数据',
    enabled: false,
    required: false
  }
])

const handlePermissionChange = (permission) => {
  ElMessage.success(`${permission.name}已${permission.enabled ? '开启' : '关闭'}`)
}
</script>
```

### 练习2：主题切换器

创建一个主题切换器组件：

```vue
<template>
  <div class="theme-switcher">
    <el-switch
      v-model="isDark"
      inline-prompt
      :active-icon="Moon"
      :inactive-icon="Sunny"
      @change="toggleTheme"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = ref(false)

const toggleTheme = (value) => {
  document.documentElement.classList.toggle('dark', value)
  localStorage.setItem('theme', value ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  isDark.value = savedTheme === 'dark'
  toggleTheme(isDark.value)
})
</script>
```

## 常见问题

### 1. 开关状态不更新

**问题**：开关的状态没有正确绑定或更新

**解决方案**：
```vue
<!-- 确保正确使用 v-model -->
<el-switch v-model="switchValue" />

<!-- 如果使用自定义值，确保类型匹配 -->
<el-switch
  v-model="customValue"
  active-value="on"
  inactive-value="off"
/>
```

### 2. 异步操作处理

**问题**：需要在开关切换时执行异步操作

**解决方案**：
```vue
<template>
  <el-switch
    v-model="switchValue"
    :loading="loading"
    :before-change="beforeChange"
  />
</template>

<script setup>
const beforeChange = async () => {
  loading.value = true
  try {
    await api.updateStatus()
    return true
  } catch (error) {
    ElMessage.error('操作失败')
    return false
  } finally {
    loading.value = false
  }
}
</script>
```

### 3. 样式自定义

**问题**：需要自定义开关的颜色和样式

**解决方案**：
```vue
<el-switch
  v-model="value"
  style="
    --el-switch-on-color: #13ce66;
    --el-switch-off-color: #ff4949;
  "
/>
```

## 最佳实践

1. **语义化标签**：为开关提供有意义的标签和描述
2. **状态反馈**：在状态变化时提供适当的用户反馈
3. **异步处理**：合理使用 loading 状态和 before-change 钩子
4. **可访问性**：确保键盘导航和屏幕阅读器支持
5. **一致性**：在同一应用中保持开关样式的一致性
6. **防误操作**：对重要操作使用确认机制

## 总结

Switch 开关是一个简单而强大的组件，支持：

- 基础开关功能
- 多种状态（禁用、加载）
- 文字和图标自定义
- 扩展的值类型
- 尺寸控制
- 丰富的事件处理
- 良好的可访问性支持

掌握 Switch 组件的使用，能够帮助你构建更加直观和用户友好的界面控制元素。

## 参考资料

- [Element Plus Switch 官方文档](https://element-plus.org/zh-CN/component/switch.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)