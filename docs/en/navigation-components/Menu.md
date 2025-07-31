# Menu

## Overview

The Menu component is used to create navigation menus. It supports vertical and horizontal layouts, multi-level nesting, and various interactive features.

## Basic Usage

### Vertical Menu
```vue
<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><Icon /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><Document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><Setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {
  Document,
  Menu as Icon,
  Location,
  Setting
} from '@element-plus/icons-vue'

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

### Horizontal Menu
```vue
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">
      <a href="https://www.ele.me" target="_blank">Orders</a>
    </el-menu-item>
  </el-menu>
  <div class="line"></div>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">
      <a href="https://www.ele.me" target="_blank">Orders</a>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const activeIndex2 = ref('1')

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-demo {
  border-bottom: solid 1px var(--el-menu-border-color);
}
.line {
  height: 1px;
  background-color: var(--el-border-color);
  margin: 35px 0;
}
</style>
```

## Collapsed Menu

```vue
<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">expand</el-radio-button>
    <el-radio-button :label="true">collapse</el-radio-button>
  </el-radio-group>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item index="1">
      <el-icon><House /></el-icon>
      <template #title>Navigator One</template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Location /></el-icon>
        <span>Navigator Two</span>
      </template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon><Document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><Setting /></el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  House,
  Location,
  Setting
} from '@element-plus/icons-vue'

const isCollapse = ref(true)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}

const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
```

## Router Integration

```vue
<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    router
  >
    <el-menu-item index="/home">
      <el-icon><House /></el-icon>
      <template #title>Home</template>
    </el-menu-item>
    <el-sub-menu index="/products">
      <template #title>
        <el-icon><Goods /></el-icon>
        <span>Products</span>
      </template>
      <el-menu-item index="/products/list">Product List</el-menu-item>
      <el-menu-item index="/products/categories">Categories</el-menu-item>
      <el-menu-item index="/products/inventory">Inventory</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/orders">
      <el-icon><Document /></el-icon>
      <template #title>Orders</template>
    </el-menu-item>
    <el-menu-item index="/settings">
      <el-icon><Setting /></el-icon>
      <template #title>Settings</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {
  Document,
  Goods,
  House,
  Setting
} from '@element-plus/icons-vue'
</script>
```

## Dynamic Menu

```vue
<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    @select="handleMenuSelect"
  >
    <template v-for="item in menuItems" :key="item.index">
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.index"
          :index="child.index"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="item.index" :disabled="item.disabled">
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  House,
  Location,
  Setting,
  User
} from '@element-plus/icons-vue'

const activeMenu = ref('1')

const menuItems = ref([
  {
    index: '1',
    title: 'Dashboard',
    icon: House
  },
  {
    index: '2',
    title: 'User Management',
    icon: User,
    children: [
      { index: '2-1', title: 'User List' },
      { index: '2-2', title: 'User Roles' },
      { index: '2-3', title: 'Permissions' }
    ]
  },
  {
    index: '3',
    title: 'Content Management',
    icon: Document,
    children: [
      { index: '3-1', title: 'Articles' },
      { index: '3-2', title: 'Categories' },
      { index: '3-3', title: 'Tags' }
    ]
  },
  {
    index: '4',
    title: 'System Settings',
    icon: Setting,
    disabled: false
  },
  {
    index: '5',
    title: 'Analytics',
    icon: Location,
    disabled: true
  }
])

const handleMenuSelect = (index, indexPath) => {
  console.log('Selected:', index, indexPath)
  activeMenu.value = index
}
</script>
```

## Menu with Badges

```vue
<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
  >
    <el-menu-item index="1">
      <el-icon><House /></el-icon>
      <template #title>
        <span>Dashboard</span>
      </template>
    </el-menu-item>
    
    <el-menu-item index="2">
      <el-icon><Message /></el-icon>
      <template #title>
        <span>Messages</span>
        <el-badge :value="12" class="menu-badge" />
      </template>
    </el-menu-item>
    
    <el-menu-item index="3">
      <el-icon><Bell /></el-icon>
      <template #title>
        <span>Notifications</span>
        <el-badge :value="3" type="danger" class="menu-badge" />
      </template>
    </el-menu-item>
    
    <el-sub-menu index="4">
      <template #title>
        <el-icon><Document /></el-icon>
        <span>Orders</span>
        <el-badge :value="newOrdersCount" type="warning" class="menu-badge" />
      </template>
      <el-menu-item index="4-1">Pending Orders</el-menu-item>
      <el-menu-item index="4-2">Completed Orders</el-menu-item>
      <el-menu-item index="4-3">Cancelled Orders</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  Bell,
  Document,
  House,
  Message
} from '@element-plus/icons-vue'

const newOrdersCount = ref(5)
</script>

<style>
.menu-badge {
  margin-left: auto;
}
</style>
```

## Menu Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| mode | Menu display mode | string | vertical |
| collapse | Whether the menu is collapsed (available only in vertical mode) | boolean | false |
| background-color | Background color of Menu | string | #ffffff |
| text-color | Text color of Menu | string | #303133 |
| active-text-color | Text color of currently active menu item | string | #409EFF |
| default-active | Index of currently active menu item | string | — |
| default-openeds | Array that contains indexes of currently opened sub-menus | Array | — |
| unique-opened | Whether only one sub-menu can be active | boolean | false |
| menu-trigger | How sub-menus are triggered, only works when mode is 'horizontal' | string | hover |
| router | Whether vue-router mode is activated | boolean | false |
| collapse-transition | Whether to enable the collapse transition | boolean | true |

## Menu Events

| Event | Description | Parameters |
|-------|-------------|------------|
| select | Callback function when menu item is selected | index: index of activated menu item, indexPath: index path of activated menu item, item: the selected menu item, routeResult: result returned by vue-router if router is enabled |
| open | Callback function when sub-menu expands | index: index of expanded sub-menu, indexPath: index path of expanded sub-menu |
| close | Callback function when sub-menu collapses | index: index of collapsed sub-menu, indexPath: index path of collapsed sub-menu |

## Menu Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| open | Open a specific sub-menu | index: index of the sub-menu to open |
| close | Close a specific sub-menu | index: index of the sub-menu to close |

## SubMenu Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| index | Unique identification | string | — |
| popper-class | Custom class name for the popup menu | string | — |
| show-timeout | Timeout before showing a sub-menu | number | 300 |
| hide-timeout | Timeout before hiding a sub-menu | number | 300 |
| disabled | Whether the sub-menu is disabled | boolean | false |
| popper-append-to-body | Whether to append the popup menu to body | boolean | level one Submenu: true / other Submenus: false |

## Menu-Item Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| index | Unique identification | string/null | — |
| route | Vue Router object | object | — |
| disabled | Whether disabled | boolean | false |

## Menu-Item-Group Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| title | Group title | string | — |

## SubMenu Slots

| Name | Description |
|------|-------------|
| — | Content of SubMenu |
| title | Content of SubMenu title |

## Menu-Item Slots

| Name | Description |
|------|-------------|
| — | Content of Menu Item |
| title | Content of Menu Item title |

## Best Practices

1. **Navigation Structure**: Keep menu hierarchy logical and not too deep
2. **Visual Feedback**: Provide clear active states and hover effects
3. **Accessibility**: Ensure keyboard navigation and screen reader support
4. **Performance**: Use dynamic loading for large menu structures
5. **Responsive Design**: Consider collapsible menus for mobile devices
6. **Consistency**: Maintain consistent styling and behavior across the application

## Common Patterns

### Admin Sidebar Menu
```vue
<template>
  <el-menu
    :default-active="currentRoute"
    class="admin-menu"
    :collapse="isCollapsed"
    router
  >
    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    
    <el-sub-menu index="/users">
      <template #title>
        <el-icon><User /></el-icon>
        <span>User Management</span>
      </template>
      <el-menu-item index="/users/list">User List</el-menu-item>
      <el-menu-item index="/users/roles">Roles & Permissions</el-menu-item>
    </el-sub-menu>
    
    <el-sub-menu index="/content">
      <template #title>
        <el-icon><Document /></el-icon>
        <span>Content</span>
      </template>
      <el-menu-item index="/content/posts">Posts</el-menu-item>
      <el-menu-item index="/content/pages">Pages</el-menu-item>
      <el-menu-item index="/content/media">Media Library</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
```

### Top Navigation Menu
```vue
<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    class="top-nav"
    router
  >
    <el-menu-item index="/">
      <img src="/logo.png" alt="Logo" class="logo" />
    </el-menu-item>
    
    <el-menu-item index="/products">Products</el-menu-item>
    <el-menu-item index="/solutions">Solutions</el-menu-item>
    <el-menu-item index="/pricing">Pricing</el-menu-item>
    <el-menu-item index="/support">Support</el-menu-item>
    
    <div class="flex-grow" />
    
    <el-sub-menu index="/account">
      <template #title>
        <el-avatar :size="32" :src="userAvatar" />
      </template>
      <el-menu-item index="/profile">Profile</el-menu-item>
      <el-menu-item index="/settings">Settings</el-menu-item>
      <el-menu-item index="/logout">Logout</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
```

## Related Components

- [Breadcrumb](/en/navigation-components/Breadcrumb) - Breadcrumb navigation
- [Tabs](/en/navigation-components/Tabs) - Tab navigation
- [Steps](/en/navigation-components/Steps) - Step navigation
- [Dropdown](/en/navigation-components/Dropdown) - Dropdown menus