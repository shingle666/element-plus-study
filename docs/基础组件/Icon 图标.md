# Icon 图标组件

## 学习目标
- 掌握 Element Plus 图标系统的使用
- 学会图标的安装、导入和注册
- 理解全局注册与按需导入的区别
- 掌握图标尺寸和颜色控制
- 学会在不同组件中使用图标
- 能够使用自定义 SVG 图标
- 理解图标的语义化和可访问性

## 详细学习内容

### 1. 图标系统安装与配置（20分钟）

#### 1.1 安装图标库

```bash
# 安装 Element Plus 图标库
npm install @element-plus/icons-vue
# 或者
yarn add @element-plus/icons-vue
# 或者
pnpm install @element-plus/icons-vue
```

#### 1.2 全局注册图标

```javascript
// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 全局注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
```

#### 1.3 按需导入图标

```vue
<template>
  <div class="icon-demo">
    <!-- 直接使用图标组件 -->
    <el-icon><Edit /></el-icon>
    <el-icon><Delete /></el-icon>
    <el-icon><Search /></el-icon>
  </div>
</template>

<script setup>
// 按需导入图标
import { Edit, Delete, Search } from '@element-plus/icons-vue'
</script>
```

### 2. 基础图标使用（30分钟）

#### 2.1 基础用法

```vue
<template>
  <div class="basic-icon-demo">
    <!-- 基础图标 -->
    <el-icon><Star /></el-icon>
    <el-icon><StarFilled /></el-icon>
    <el-icon><Heart /></el-icon>
    <el-icon><Like /></el-icon>
    
    <!-- 带文字的图标 -->
    <div class="icon-with-text">
      <el-icon><User /></el-icon>
      <span>用户</span>
    </div>
    
    <div class="icon-with-text">
      <el-icon><Setting /></el-icon>
      <span>设置</span>
    </div>
  </div>
</template>

<script setup>
import { 
  Star, 
  StarFilled, 
  Heart, 
  Like, 
  User, 
  Setting 
} from '@element-plus/icons-vue'
</script>

<style>
.basic-icon-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-with-text {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.icon-with-text:hover {
  color: var(--el-color-primary);
}
</style>
```

#### 2.2 图标尺寸控制

```vue
<template>
  <div class="icon-size-demo">
    <!-- 使用 size 属性 -->
    <el-icon :size="12"><Star /></el-icon>
    <el-icon :size="16"><Star /></el-icon>
    <el-icon :size="20"><Star /></el-icon>
    <el-icon :size="24"><Star /></el-icon>
    <el-icon :size="32"><Star /></el-icon>
    
    <!-- 使用 CSS 控制 -->
    <el-icon class="icon-small"><Heart /></el-icon>
    <el-icon class="icon-medium"><Heart /></el-icon>
    <el-icon class="icon-large"><Heart /></el-icon>
    <el-icon class="icon-xlarge"><Heart /></el-icon>
  </div>
</template>

<script setup>
import { Star, Heart } from '@element-plus/icons-vue'
</script>

<style>
.icon-size-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-small {
  font-size: 14px;
}

.icon-medium {
  font-size: 18px;
}

.icon-large {
  font-size: 24px;
}

.icon-xlarge {
  font-size: 32px;
}
</style>
```

#### 2.3 图标颜色控制

```vue
<template>
  <div class="icon-color-demo">
    <!-- 使用 color 属性 -->
    <el-icon color="#409eff"><Star /></el-icon>
    <el-icon color="#67c23a"><Star /></el-icon>
    <el-icon color="#e6a23c"><Star /></el-icon>
    <el-icon color="#f56c6c"><Star /></el-icon>
    <el-icon color="#909399"><Star /></el-icon>
    
    <!-- 使用 CSS 类控制 -->
    <el-icon class="icon-primary"><Heart /></el-icon>
    <el-icon class="icon-success"><Heart /></el-icon>
    <el-icon class="icon-warning"><Heart /></el-icon>
    <el-icon class="icon-danger"><Heart /></el-icon>
    <el-icon class="icon-info"><Heart /></el-icon>
  </div>
</template>

<script setup>
import { Star, Heart } from '@element-plus/icons-vue'
</script>

<style>
.icon-color-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-primary {
  color: var(--el-color-primary);
}

.icon-success {
  color: var(--el-color-success);
}

.icon-warning {
  color: var(--el-color-warning);
}

.icon-danger {
  color: var(--el-color-danger);
}

.icon-info {
  color: var(--el-color-info);
}
</style>
```

### 3. 图标在组件中的应用（40分钟）

#### 3.1 按钮中的图标

```vue
<template>
  <div class="button-icon-demo">
    <!-- 图标按钮 -->
    <el-button type="primary" :icon="Edit">编辑</el-button>
    <el-button type="success" :icon="Check">确认</el-button>
    <el-button type="warning" :icon="Warning">警告</el-button>
    <el-button type="danger" :icon="Delete">删除</el-button>
    
    <!-- 纯图标按钮 -->
    <el-button type="primary" :icon="Search" circle />
    <el-button type="success" :icon="Edit" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
    
    <!-- 图标在右侧 -->
    <el-button type="primary">
      下载
      <el-icon class="el-icon--right"><Download /></el-icon>
    </el-button>
    
    <el-button type="success">
      上传
      <el-icon class="el-icon--right"><Upload /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { 
  Edit, 
  Check, 
  Warning, 
  Delete, 
  Search, 
  Star, 
  Download, 
  Upload 
} from '@element-plus/icons-vue'
</script>

<style>
.button-icon-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
```

#### 3.2 输入框中的图标

```vue
<template>
  <div class="input-icon-demo">
    <!-- 前缀图标 -->
    <el-input
      v-model="searchText"
      placeholder="搜索内容"
      :prefix-icon="Search"
      style="width: 200px;"
    />
    
    <!-- 后缀图标 -->
    <el-input
      v-model="password"
      type="password"
      placeholder="请输入密码"
      :suffix-icon="View"
      style="width: 200px;"
      show-password
    />
    
    <!-- 自定义图标插槽 -->
    <el-input
      v-model="username"
      placeholder="用户名"
      style="width: 200px;"
    >
      <template #prefix>
        <el-icon><User /></el-icon>
      </template>
    </el-input>
    
    <el-input
      v-model="email"
      placeholder="邮箱地址"
      style="width: 200px;"
    >
      <template #suffix>
        <el-icon><Message /></el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, View, User, Message } from '@element-plus/icons-vue'

const searchText = ref('')
const password = ref('')
const username = ref('')
const email = ref('')
</script>

<style>
.input-icon-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
```

#### 3.3 菜单和导航中的图标

```vue
<template>
  <div class="menu-icon-demo">
    <!-- 垂直菜单 -->
    <el-menu
      default-active="1"
      class="el-menu-vertical"
      style="width: 200px;"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      
      <el-sub-menu index="2">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="2-1">
          <el-icon><UserFilled /></el-icon>
          <span>用户列表</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-icon><Plus /></el-icon>
          <span>添加用户</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="3">
        <el-icon><Setting /></el-icon>
        <span>系统设置</span>
      </el-menu-item>
      
      <el-menu-item index="4">
        <el-icon><Document /></el-icon>
        <span>文档中心</span>
      </el-menu-item>
    </el-menu>
    
    <!-- 水平导航 -->
    <el-menu
      mode="horizontal"
      default-active="1"
      class="horizontal-menu"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        首页
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Goods /></el-icon>
        产品
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><Service /></el-icon>
        服务
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><Phone /></el-icon>
        联系我们
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { 
  House, 
  User, 
  UserFilled, 
  Plus, 
  Setting, 
  Document, 
  Goods, 
  Service, 
  Phone 
} from '@element-plus/icons-vue'
</script>

<style>
.menu-icon-demo {
  display: flex;
  gap: 32px;
}

.horizontal-menu {
  border-bottom: none;
}
</style>
```

### 4. 自定义图标（30分钟）

#### 4.1 使用自定义 SVG 图标

```vue
<template>
  <div class="custom-icon-demo">
    <!-- 内联 SVG 图标 -->
    <el-icon :size="24">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
        <path fill="currentColor" d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.4-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.8 41.3-19.8 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.4-103.3z"/>
        <div>
          <path fill="currentColor" d="M512 732a40 40 0 1 0 0 80 40 40 0 0 0 0-80z"/>
        </div>
      </svg>
    </el-icon>
    
    <!-- 自定义图标组件 -->
    <el-icon :size="24" color="#409eff">
      <CustomIcon />
    </el-icon>
    
    <!-- 图标字体 -->
    <i class="custom-font-icon">&#xe001;</i>
  </div>
</template>

<script setup>
// 自定义图标组件
const CustomIcon = {
  name: 'CustomIcon',
  render() {
    return (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path 
          fill="currentColor" 
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
        />
      </svg>
    )
  }
}
</script>

<style>
.custom-icon-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.custom-font-icon {
  font-family: 'iconfont';
  font-size: 24px;
  color: #67c23a;
}
</style>
```

#### 4.2 图标组件封装

```vue
<!-- IconWrapper.vue -->
<template>
  <el-icon 
    :size="size" 
    :color="color" 
    :class="iconClass"
    @click="handleClick"
  >
    <component :is="icon" v-if="icon" />
    <slot v-else />
  </el-icon>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: [String, Object],
    default: null
  },
  size: {
    type: [Number, String],
    default: 16
  },
  color: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const iconClass = computed(() => {
  return {
    'icon-clickable': props.clickable && !props.disabled,
    'icon-disabled': props.disabled
  }
})

const handleClick = (event) => {
  if (!props.disabled && props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.icon-clickable {
  cursor: pointer;
  transition: color 0.3s;
}

.icon-clickable:hover {
  color: var(--el-color-primary);
}

.icon-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

### 5. 图标库展示组件（40分钟）

#### 5.1 图标展示网格

```vue
<template>
  <div class="icon-gallery">
    <div class="gallery-header">
      <h2>Element Plus 图标库</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索图标..."
        :prefix-icon="Search"
        style="width: 300px;"
        clearable
      />
    </div>
    
    <div class="icon-categories">
      <el-tabs v-model="activeCategory" @tab-click="handleCategoryChange">
        <el-tab-pane 
          v-for="category in categories" 
          :key="category.name"
          :label="category.label" 
          :name="category.name"
        >
          <div class="icon-grid">
            <div 
              v-for="iconName in filteredIcons(category.icons)" 
              :key="iconName"
              class="icon-item"
              @click="copyIconName(iconName)"
            >
              <el-icon :size="32">
                <component :is="iconName" />
              </el-icon>
              <span class="icon-name">{{ iconName }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 复制提示 -->
    <el-dialog v-model="showCopyDialog" title="复制成功" width="400px">
      <p>图标名称已复制到剪贴板：</p>
      <el-input v-model="copiedIconName" readonly />
      <p class="usage-tip">使用方式：</p>
      <pre><code>&lt;el-icon&gt;&lt;{{ copiedIconName }} /&gt;&lt;/el-icon&gt;</code></pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search,
  Edit,
  Delete,
  Plus,
  Minus,
  Star,
  Heart,
  User,
  Setting,
  House,
  Document,
  Folder,
  Picture,
  VideoCamera,
  Headset,
  Phone,
  Message,
  Bell,
  Warning,
  Check,
  Close,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

const searchKeyword = ref('')
const activeCategory = ref('common')
const showCopyDialog = ref(false)
const copiedIconName = ref('')

const categories = ref([
  {
    name: 'common',
    label: '常用图标',
    icons: ['Edit', 'Delete', 'Plus', 'Minus', 'Search', 'Star', 'Heart']
  },
  {
    name: 'user',
    label: '用户相关',
    icons: ['User', 'Setting', 'Bell', 'Message']
  },
  {
    name: 'navigation',
    label: '导航图标',
    icons: ['House', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  },
  {
    name: 'media',
    label: '媒体图标',
    icons: ['Picture', 'VideoCamera', 'Headset', 'Document', 'Folder']
  },
  {
    name: 'status',
    label: '状态图标',
    icons: ['Check', 'Close', 'Warning', 'Phone']
  }
])

const filteredIcons = (icons) => {
  if (!searchKeyword.value) return icons
  return icons.filter(icon => 
    icon.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
}

const handleCategoryChange = (tab) => {
  activeCategory.value = tab.name
}

const copyIconName = async (iconName) => {
  try {
    await navigator.clipboard.writeText(iconName)
    copiedIconName.value = iconName
    showCopyDialog.value = true
    ElMessage.success('图标名称已复制到剪贴板')
  } catch (err) {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style>
.icon-gallery {
  padding: 24px;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.gallery-header h2 {
  margin: 0;
  color: #303133;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.icon-name {
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
  text-align: center;
  word-break: break-all;
}

.usage-tip {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: #303133;
}

pre {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  margin: 0;
  overflow-x: auto;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #e74c3c;
}
</style>
```

## 实践练习

### 练习1：基础图标使用
创建一个工具栏组件，包含常用的操作图标（编辑、删除、搜索、设置等）。

### 练习2：图标按钮组合
实现一个操作按钮组，包含不同状态和样式的图标按钮。

### 练习3：导航菜单
创建一个带图标的侧边栏导航菜单，支持展开收起。

### 练习4：图标库展示
实现一个完整的图标库展示页面，支持搜索、分类和复制功能。

## 设计原则

1. **语义化使用**：选择与功能相符的图标，确保用户能够直观理解
2. **一致性**：在整个应用中保持图标风格和使用规范的一致性
3. **可访问性**：为图标添加适当的 aria-label 或 title 属性
4. **性能优化**：按需导入图标，避免全量引入造成包体积过大
5. **响应式设计**：确保图标在不同设备上都有良好的显示效果

## 学习资源

- [Element Plus Icon 官方文档](https://element-plus.org/zh-CN/component/icon.html)
- [Element Plus Icons 图标库](https://element-plus.org/zh-CN/component/icon.html#icon-collection)
- [SVG 图标设计指南](https://developer.mozilla.org/zh-CN/docs/Web/SVG)
- [图标设计最佳实践](https://www.smashingmagazine.com/2016/05/easy-steps-to-better-icon-design/)
- [无障碍图标设计](https://www.w3.org/WAI/WCAG21/Understanding/)

## 作业

1. **基础作业**：创建一个包含所有常用图标的展示页面
2. **进阶作业**：实现一个带搜索功能的图标选择器组件
3. **挑战作业**：设计一个支持自定义图标上传的图标管理系统

## 总结

Icon 图标组件是构建现代 Web 界面的重要元素。通过合理使用 Element Plus 提供的图标系统，可以大大提升用户界面的视觉效果和用户体验。掌握图标的安装、导入、使用和自定义方法，对于前端开发者来说是必备技能。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**