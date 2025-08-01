# Icon Component

## Learning Objectives
- Master the use of Element Plus icon system
- Learn how to install, import, and register icons
- Understand the difference between global registration and on-demand import
- Master icon size and color control
- Learn to use icons in different components
- Be able to use custom SVG icons
- Understand icon semantics and accessibility

## Detailed Learning Content

### 1. Icon System Installation and Configuration (20 minutes)

#### 1.1 Installing the Icon Library

```bash
# Install Element Plus icon library
npm install @element-plus/icons-vue
# Or
yarn add @element-plus/icons-vue
# Or
pnpm install @element-plus/icons-vue
```

#### 1.2 Global Registration of Icons

```javascript
// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

const app = createApp(App)

// Register Element Plus
app.use(ElementPlus)

// Global registration of all icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
```

#### 1.3 On-demand Import of Icons

```vue
<template>
  <div class="icon-demo">
    <!-- Directly use icon components -->
    <el-icon><Edit /></el-icon>
    <el-icon><Delete /></el-icon>
    <el-icon><Search /></el-icon>
  </div>
</template>

<script setup>
// On-demand import of icons
import { Edit, Delete, Search } from '@element-plus/icons-vue'
</script>
```

### 2. Basic Icon Usage (30 minutes)

#### 2.1 Basic Usage

```vue
<template>
  <div class="basic-icon-demo">
    <!-- Basic icons -->
    <el-icon><Star /></el-icon>
    <el-icon><StarFilled /></el-icon>
    <el-icon><Heart /></el-icon>
    <el-icon><Like /></el-icon>
    
    <!-- Icons with text -->
    <div class="icon-with-text">
      <el-icon><User /></el-icon>
      <span>User</span>
    </div>
    
    <div class="icon-with-text">
      <el-icon><Setting /></el-icon>
      <span>Settings</span>
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

#### 2.2 Icon Size Control

```vue
<template>
  <div class="icon-size-demo">
    <!-- Using size property -->
    <el-icon :size="12"><Star /></el-icon>
    <el-icon :size="16"><Star /></el-icon>
    <el-icon :size="20"><Star /></el-icon>
    <el-icon :size="24"><Star /></el-icon>
    <el-icon :size="32"><Star /></el-icon>
    
    <!-- Using CSS control -->
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

#### 2.3 Icon Color Control

```vue
<template>
  <div class="icon-color-demo">
    <!-- Using color property -->
    <el-icon color="#409eff"><Star /></el-icon>
    <el-icon color="#67c23a"><Star /></el-icon>
    <el-icon color="#e6a23c"><Star /></el-icon>
    <el-icon color="#f56c6c"><Star /></el-icon>
    <el-icon color="#909399"><Star /></el-icon>
    
    <!-- Using CSS classes -->
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

### 3. Icons in Components (40 minutes)

#### 3.1 Icons in Buttons

```vue
<template>
  <div class="button-icon-demo">
    <!-- Icon buttons -->
    <el-button type="primary" :icon="Edit">Edit</el-button>
    <el-button type="success" :icon="Check">Confirm</el-button>
    <el-button type="warning" :icon="Warning">Warning</el-button>
    <el-button type="danger" :icon="Delete">Delete</el-button>
    
    <!-- Pure icon buttons -->
    <el-button type="primary" :icon="Search" circle />
    <el-button type="success" :icon="Edit" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
    
    <!-- Icons on the right -->
    <el-button type="primary">
      Download
      <el-icon class="el-icon--right"><Download /></el-icon>
    </el-button>
    
    <el-button type="success">
      Upload
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

#### 3.2 Icons in Input Fields

```vue
<template>
  <div class="input-icon-demo">
    <!-- Prefix icon -->
    <el-input
      v-model="searchText"
      placeholder="Search content"
      :prefix-icon="Search"
      style="width: 200px;"
    />
    
    <!-- Suffix icon -->
    <el-input
      v-model="password"
      type="password"
      placeholder="Please enter password"
      :suffix-icon="View"
      style="width: 200px;"
      show-password
    />
    
    <!-- Custom icon slots -->
    <el-input
      v-model="username"
      placeholder="Username"
      style="width: 200px;"
    >
      <template #prefix>
        <el-icon><User /></el-icon>
      </template>
    </el-input>
    
    <el-input
      v-model="email"
      placeholder="Email address"
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

#### 3.3 Icons in Menus and Navigation

```vue
<template>
  <div class="menu-icon-demo">
    <!-- Vertical menu -->
    <el-menu
      default-active="1"
      class="el-menu-vertical"
      style="width: 200px;"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        <span>Home</span>
      </el-menu-item>
      
      <el-sub-menu index="2">
        <template #title>
          <el-icon><User /></el-icon>
          <span>User Management</span>
        </template>
        <el-menu-item index="2-1">
          <el-icon><UserFilled /></el-icon>
          <span>User List</span>
        </el-menu-item>
        <el-menu-item index="2-2">
          <el-icon><Plus /></el-icon>
          <span>Add User</span>
        </el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="3">
        <el-icon><Setting /></el-icon>
        <span>System Settings</span>
      </el-menu-item>
      
      <el-menu-item index="4">
        <el-icon><Document /></el-icon>
        <span>Documentation</span>
      </el-menu-item>
    </el-menu>
    
    <!-- Horizontal navigation -->
    <el-menu
      mode="horizontal"
      default-active="1"
      class="horizontal-menu"
    >
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        Home
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Goods /></el-icon>
        Products
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><Service /></el-icon>
        Services
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><Phone /></el-icon>
        Contact Us
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

### 4. Custom Icons (30 minutes)

#### 4.1 Using Custom SVG Icons

```vue
<template>
  <div class="custom-icon-demo">
    <!-- Inline SVG icon -->
    <el-icon :size="24">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
        <path fill="currentColor" d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.4-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.8 41.3-19.8 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.4-103.3z"/>
        <div>
          <path fill="currentColor" d="M512 732a40 40 0 1 0 0 80 40 40 0 0 0 0-80z"/>
        </div>
      </svg>
    </el-icon>
    
    <!-- Custom icon component -->
    <el-icon :size="24" color="#409eff">
      <CustomIcon />
    </el-icon>
    
    <!-- Icon font -->
    <i class="custom-font-icon">&#xe001;</i>
  </div>
</template>

<script setup>
// Custom icon component
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

#### 4.2 Icon Component Encapsulation

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

### 5. Icon Gallery Component (40 minutes)

#### 5.1 Icon Display Grid

```vue
<template>
  <div class="icon-gallery">
    <div class="gallery-header">
      <h2>Element Plus Icon Library</h2>
      <el-input
        v-model="searchKeyword"
        placeholder="Search icons..."
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
    
    <!-- Copy notification -->
    <el-dialog v-model="showCopyDialog" title="Copy Successful" width="400px">
      <p>Icon name has been copied to clipboard:</p>
      <el-input v-model="copiedIconName" readonly />
      <p class="usage-tip">Usage:</p>
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
    label: 'Common Icons',
    icons: ['Edit', 'Delete', 'Plus', 'Minus', 'Search', 'Star', 'Heart']
  },
  {
    name: 'user',
    label: 'User Related',
    icons: ['User', 'Setting', 'Bell', 'Message']
  },
  {
    name: 'navigation',
    label: 'Navigation Icons',
    icons: ['House', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
  },
  {
    name: 'media',
    label: 'Media Icons',
    icons: ['Picture', 'VideoCamera', 'Headset', 'Document', 'Folder']
  },
  {
    name: 'status',
    label: 'Status Icons',
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
    ElMessage.success('Icon name copied to clipboard')
  } catch (err) {
    ElMessage.error('Copy failed, please copy manually')
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

## Practice Exercises

### Exercise 1: Basic Icon Usage
Create a toolbar component that includes common operation icons (edit, delete, search, settings, etc.).

### Exercise 2: Icon Button Combinations
Implement a set of operation buttons that include different states and styles of icon buttons.

### Exercise 3: Navigation Menu
Create a sidebar navigation menu with icons that supports expansion and collapse.

### Exercise 4: Icon Gallery
Implement a complete icon gallery page with search, categorization, and copy functionality.

## Design Principles

1. **Semantic Usage**: Choose icons that match the functionality to ensure users can intuitively understand
2. **Consistency**: Maintain consistency in icon style and usage standards throughout the application
3. **Accessibility**: Add appropriate aria-label or title attributes to icons
4. **Performance Optimization**: Import icons on demand to avoid large bundle sizes
5. **Responsive Design**: Ensure icons display well on different devices

## Learning Resources

- [Element Plus Icon Official Documentation](https://element-plus.org/en-US/component/icon.html)
- [Element Plus Icons Library](https://element-plus.org/en-US/component/icon.html#icon-collection)
- [SVG Icon Design Guide](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [Icon Design Best Practices](https://www.smashingmagazine.com/2016/05/easy-steps-to-better-icon-design/)
- [Accessible Icon Design](https://www.w3.org/WAI/WCAG21/Understanding/)

## Assignments

1. **Basic Assignment**: Create a display page containing all commonly used icons
2. **Advanced Assignment**: Implement an icon selector component with search functionality
3. **Challenge Assignment**: Design an icon management system that supports custom icon uploads

## Summary

The Icon component is an important element in building modern web interfaces. By properly using the icon system provided by Element Plus, you can greatly enhance the visual effect and user experience of your user interface. Mastering the installation, import, usage, and customization methods of icons is an essential skill for front-end developers.

---

**Learning Date:** ___________
**Completion Status:** ___________
**Learning Notes:**



**Problems Encountered:**



**Solutions:**