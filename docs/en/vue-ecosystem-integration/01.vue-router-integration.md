# Vue Router Integration with Element Plus

## Overview

Vue Router is the official routing library for Vue.js applications. When combined with Element Plus, it enables the creation of sophisticated single-page applications with rich UI components and seamless navigation. This guide covers comprehensive integration patterns, best practices, and advanced techniques.

## Basic Setup and Configuration

### Installation and Initial Setup

```bash
# Install Vue Router
npm install vue-router@4

# For TypeScript projects
npm install @types/vue-router
```

### Router Configuration

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// Lazy-loaded components
const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Profile = () => import('../views/Profile.vue')
const Settings = () => import('../views/Settings.vue')
const NotFound = () => import('../views/NotFound.vue')

// Admin components
const AdminLayout = () => import('../layouts/AdminLayout.vue')
const AdminDashboard = () => import('../views/admin/Dashboard.vue')
const UserManagement = () => import('../views/admin/UserManagement.vue')
const SystemSettings = () => import('../views/admin/SystemSettings.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      requiresAuth: false,
      breadcrumb: [{ text: 'Home', to: '/' }]
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'About Us',
      requiresAuth: false,
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'About', to: '/about' }
      ]
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
      roles: ['user', 'admin'],
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Dashboard', to: '/dashboard' }
      ]
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'User Profile',
      requiresAuth: true,
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Profile', to: '/profile' }
      ]
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings',
      requiresAuth: true,
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Settings', to: '/settings' }
      ]
    }
  },
  
  // Admin routes with nested layout
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin']
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: {
          title: 'Admin Dashboard',
          breadcrumb: [
            { text: 'Home', to: '/' },
            { text: 'Admin', to: '/admin' },
            { text: 'Dashboard', to: '/admin' }
          ]
        }
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement,
        meta: {
          title: 'User Management',
          breadcrumb: [
            { text: 'Home', to: '/' },
            { text: 'Admin', to: '/admin' },
            { text: 'Users', to: '/admin/users' }
          ]
        }
      },
      {
        path: 'settings',
        name: 'SystemSettings',
        component: SystemSettings,
        meta: {
          title: 'System Settings',
          breadcrumb: [
            { text: 'Home', to: '/' },
            { text: 'Admin', to: '/admin' },
            { text: 'Settings', to: '/admin/settings' }
          ]
        }
      }
    ]
  },
  
  // Dynamic routes
  {
    path: '/user/:id',
    name: 'UserDetail',
    component: () => import('../views/UserDetail.vue'),
    props: true,
    meta: {
      title: 'User Details',
      requiresAuth: true,
      breadcrumb: [
        { text: 'Home', to: '/' },
        { text: 'Users', to: '/users' },
        { text: 'Details', to: '' }
      ]
    }
  },
  
  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Smooth scroll behavior
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
```

### Navigation Guards

```javascript
// router/guards.js
import { ElMessage, ElLoading } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import { useAppStore } from '../stores/app'

let loadingInstance = null

// Global before guard
router.beforeEach(async (to, from, next) => {
  // Show loading for route changes
  if (to.name !== from.name) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Loading...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  
  const authStore = useAuthStore()
  const appStore = useAppStore()
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - My App`
  }
  
  // Check authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      ElMessage.warning('Please login to access this page')
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check user roles
    if (to.meta.roles && !to.meta.roles.includes(authStore.user.role)) {
      ElMessage.error('You do not have permission to access this page')
      next({ name: 'Dashboard' })
      return
    }
  }
  
  // Update breadcrumb
  if (to.meta.breadcrumb) {
    appStore.setBreadcrumb(to.meta.breadcrumb)
  }
  
  next()
})

// Global after guard
router.afterEach((to, from) => {
  // Hide loading
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
  
  // Track page view for analytics
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_TRACKING_ID', {
      page_path: to.fullPath
    })
  }
})

// Global error handler
router.onError((error) => {
  console.error('Router error:', error)
  
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
  
  ElMessage.error('Navigation error occurred')
})
```

## Navigation Components

### Main Navigation Menu

```vue
<!-- components/Navigation/MainMenu.vue -->
<template>
  <el-menu
    :default-active="activeIndex"
    mode="horizontal"
    :router="true"
    class="main-menu"
    @select="handleSelect"
  >
    <el-menu-item index="/">
      <el-icon><House /></el-icon>
      <span>Home</span>
    </el-menu-item>
    
    <el-menu-item index="/about">
      <el-icon><InfoFilled /></el-icon>
      <span>About</span>
    </el-menu-item>
    
    <el-sub-menu index="/dashboard" v-if="isAuthenticated">
      <template #title>
        <el-icon><Monitor /></el-icon>
        <span>Dashboard</span>
      </template>
      <el-menu-item index="/dashboard">Overview</el-menu-item>
      <el-menu-item index="/dashboard/analytics">Analytics</el-menu-item>
      <el-menu-item index="/dashboard/reports">Reports</el-menu-item>
    </el-sub-menu>
    
    <el-sub-menu index="/admin" v-if="isAdmin">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>Admin</span>
      </template>
      <el-menu-item index="/admin">Dashboard</el-menu-item>
      <el-menu-item index="/admin/users">Users</el-menu-item>
      <el-menu-item index="/admin/settings">Settings</el-menu-item>
    </el-sub-menu>
    
    <div class="flex-grow" />
    
    <!-- User menu -->
    <el-sub-menu index="user" v-if="isAuthenticated">
      <template #title>
        <el-avatar :size="32" :src="user.avatar">
          <el-icon><User /></el-icon>
        </el-avatar>
        <span class="username">{{ user.name }}</span>
      </template>
      <el-menu-item index="/profile">
        <el-icon><User /></el-icon>
        <span>Profile</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <span>Settings</span>
      </el-menu-item>
      <el-menu-item @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        <span>Logout</span>
      </el-menu-item>
    </el-sub-menu>
    
    <!-- Login button -->
    <el-menu-item index="/login" v-else>
      <el-icon><User /></el-icon>
      <span>Login</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import {
  House,
  InfoFilled,
  Monitor,
  Setting,
  User,
  SwitchButton
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeIndex = computed(() => {
  // Handle nested routes
  if (route.path.startsWith('/admin')) {
    return '/admin'
  }
  if (route.path.startsWith('/dashboard')) {
    return '/dashboard'
  }
  return route.path
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.user?.role === 'admin')
const user = computed(() => authStore.user)

const handleSelect = (index) => {
  // Custom handling for menu selection
  console.log('Menu selected:', index)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to logout?',
      'Confirm Logout',
      {
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await authStore.logout()
    ElMessage.success('Logged out successfully')
    router.push('/')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Logout failed')
    }
  }
}
</script>

<style scoped>
.main-menu {
  border-bottom: none;
}

.flex-grow {
  flex-grow: 1;
}

.username {
  margin-left: 8px;
}

.el-menu--horizontal .el-menu-item {
  height: 60px;
  line-height: 60px;
}

.el-menu--horizontal .el-sub-menu .el-sub-menu__title {
  height: 60px;
  line-height: 60px;
}
</style>
```

### Sidebar Navigation

```vue
<!-- components/Navigation/Sidebar.vue -->
<template>
  <el-aside :width="isCollapsed ? '64px' : '200px'" class="sidebar">
    <div class="sidebar-header">
      <el-button
        :icon="isCollapsed ? Expand : Fold"
        @click="toggleCollapse"
        text
        class="collapse-btn"
      />
    </div>
    
    <el-menu
      :default-active="activeIndex"
      :collapse="isCollapsed"
      :router="true"
      class="sidebar-menu"
      @select="handleSelect"
    >
      <el-menu-item index="/dashboard">
        <el-icon><Monitor /></el-icon>
        <template #title>Dashboard</template>
      </el-menu-item>
      
      <el-sub-menu index="analytics">
        <template #title>
          <el-icon><DataAnalysis /></el-icon>
          <span>Analytics</span>
        </template>
        <el-menu-item index="/analytics/overview">Overview</el-menu-item>
        <el-menu-item index="/analytics/reports">Reports</el-menu-item>
        <el-menu-item index="/analytics/charts">Charts</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="users">
        <template #title>
          <el-icon><User /></el-icon>
          <span>Users</span>
        </template>
        <el-menu-item index="/users/list">User List</el-menu-item>
        <el-menu-item index="/users/roles">Roles</el-menu-item>
        <el-menu-item index="/users/permissions">Permissions</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>Settings</template>
      </el-menu-item>
      
      <el-menu-item index="/help">
        <el-icon><QuestionFilled /></el-icon>
        <template #title>Help</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Monitor,
  DataAnalysis,
  User,
  Setting,
  QuestionFilled,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const route = useRoute()
const isCollapsed = ref(false)

const activeIndex = computed(() => route.path)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleSelect = (index) => {
  console.log('Sidebar menu selected:', index)
}
</script>

<style scoped>
.sidebar {
  background-color: var(--el-bg-color-page);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s ease;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.collapse-btn {
  font-size: 18px;
}

.sidebar-menu {
  border-right: none;
  height: calc(100vh - 60px);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>
```

### Breadcrumb Navigation

```vue
<!-- components/Navigation/Breadcrumb.vue -->
<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <transition-group name="breadcrumb" tag="div" class="breadcrumb-container">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbItems"
        :key="item.path || item.text"
        :to="item.to"
        class="breadcrumb-item"
      >
        <el-icon v-if="item.icon" class="breadcrumb-icon">
          <component :is="item.icon" />
        </el-icon>
        {{ item.text }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../stores/app'
import { House } from '@element-plus/icons-vue'

const route = useRoute()
const appStore = useAppStore()

const breadcrumbItems = computed(() => {
  // Get breadcrumb from store or route meta
  const breadcrumb = appStore.breadcrumb || route.meta.breadcrumb || []
  
  // Add home icon to first item
  return breadcrumb.map((item, index) => ({
    ...item,
    icon: index === 0 ? House : null
  }))
})
</script>

<style scoped>
.app-breadcrumb {
  padding: 12px 16px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.breadcrumb-container {
  display: flex;
  align-items: center;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-icon {
  margin-right: 4px;
  font-size: 14px;
}

/* Breadcrumb transitions */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
```

## Advanced Routing Patterns

### Route-based Code Splitting

```javascript
// router/lazy-loading.js
import { defineAsyncComponent } from 'vue'
import { ElLoading } from 'element-plus'

// Enhanced lazy loading with loading states
export const createLazyComponent = (importFn, options = {}) => {
  return defineAsyncComponent({
    loader: importFn,
    
    loadingComponent: {
      template: `
        <div class="lazy-loading">
          <el-skeleton :rows="5" animated />
        </div>
      `
    },
    
    errorComponent: {
      template: `
        <div class="lazy-error">
          <el-result
            icon="error"
            title="Loading Error"
            sub-title="Failed to load component"
          >
            <template #extra>
              <el-button type="primary" @click="$emit('retry')">
                Retry
              </el-button>
            </template>
          </el-result>
        </div>
      `
    },
    
    delay: options.delay || 200,
    timeout: options.timeout || 10000,
    
    onError(error, retry, fail, attempts) {
      console.error('Component loading error:', error)
      
      if (attempts <= 3) {
        // Retry up to 3 times
        setTimeout(retry, 1000 * attempts)
      } else {
        fail()
      }
    }
  })
}

// Route-specific lazy components
export const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: createLazyComponent(
      () => import('../views/Dashboard.vue'),
      { delay: 100 }
    )
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: createLazyComponent(
      () => import('../views/Analytics.vue'),
      { delay: 300 } // Longer delay for heavy components
    )
  }
]
```

### Dynamic Route Generation

```javascript
// router/dynamic-routes.js
import { useAuthStore } from '../stores/auth'

// Generate routes based on user permissions
export const generateDynamicRoutes = (userPermissions) => {
  const routes = []
  
  // Base routes available to all users
  routes.push(
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    }
  )
  
  // Admin routes
  if (userPermissions.includes('admin')) {
    routes.push(
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('../layouts/AdminLayout.vue'),
        children: [
          {
            path: 'dashboard',
            name: 'AdminDashboard',
            component: () => import('../views/admin/Dashboard.vue')
          },
          {
            path: 'users',
            name: 'UserManagement',
            component: () => import('../views/admin/Users.vue')
          }
        ]
      }
    )
  }
  
  // Manager routes
  if (userPermissions.includes('manager')) {
    routes.push(
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('../views/Reports.vue')
      }
    )
  }
  
  return routes
}

// Add routes dynamically after authentication
export const addDynamicRoutes = (router, userPermissions) => {
  const dynamicRoutes = generateDynamicRoutes(userPermissions)
  
  dynamicRoutes.forEach(route => {
    router.addRoute(route)
  })
}

// Remove dynamic routes on logout
export const removeDynamicRoutes = (router, routeNames) => {
  routeNames.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}
```

### Route Transitions

```vue
<!-- App.vue with route transitions -->
<template>
  <div id="app">
    <MainNavigation />
    
    <el-container>
      <Sidebar v-if="showSidebar" />
      
      <el-main class="main-content">
        <Breadcrumb />
        
        <router-view v-slot="{ Component, route }">
          <transition
            :name="getTransitionName(route)"
            mode="out-in"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
          >
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from './stores/app'
import MainNavigation from './components/Navigation/MainNavigation.vue'
import Sidebar from './components/Navigation/Sidebar.vue'
import Breadcrumb from './components/Navigation/Breadcrumb.vue'

const route = useRoute()
const appStore = useAppStore()

const showSidebar = computed(() => {
  return !['Login', 'Register', 'NotFound'].includes(route.name)
})

const cachedViews = computed(() => appStore.cachedViews)

const getTransitionName = (route) => {
  // Different transitions for different route types
  if (route.meta.transition) {
    return route.meta.transition
  }
  
  if (route.path.startsWith('/admin')) {
    return 'slide-left'
  }
  
  if (route.path.startsWith('/dashboard')) {
    return 'fade'
  }
  
  return 'slide-right'
}

const onBeforeEnter = () => {
  // Show loading indicator
  appStore.setLoading(true)
}

const onAfterEnter = () => {
  // Hide loading indicator
  appStore.setLoading(false)
}
</script>

<style>
/* Route transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.main-content {
  min-height: calc(100vh - 60px);
  padding: 0;
}
</style>
```

## Route-based Data Fetching

### Data Fetching Strategies

```javascript
// composables/useRouteData.js
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'

export const useRouteData = (fetchFn, options = {}) => {
  const route = useRoute()
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const {
    immediate = true,
    watchParams = true,
    showLoading = true,
    loadingText = 'Loading...',
    errorHandler = null
  } = options
  
  let loadingInstance = null
  
  const fetchData = async () => {
    try {
      loading.value = true
      error.value = null
      
      if (showLoading) {
        loadingInstance = ElLoading.service({
          lock: true,
          text: loadingText,
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      
      const result = await fetchFn(route.params, route.query)
      data.value = result
      
    } catch (err) {
      error.value = err
      
      if (errorHandler) {
        errorHandler(err)
      } else {
        ElMessage.error(`Failed to load data: ${err.message}`)
      }
    } finally {
      loading.value = false
      
      if (loadingInstance) {
        loadingInstance.close()
        loadingInstance = null
      }
    }
  }
  
  // Watch route parameters for changes
  if (watchParams) {
    watch(
      () => [route.params, route.query],
      () => fetchData(),
      { deep: true }
    )
  }
  
  // Initial fetch
  if (immediate) {
    onMounted(fetchData)
  }
  
  return {
    data,
    loading,
    error,
    fetchData,
    refetch: fetchData
  }
}
```

### Route-specific Data Loading

```vue
<!-- views/UserDetail.vue -->
<template>
  <div class="user-detail">
    <el-page-header @back="goBack" :content="pageTitle">
      <template #extra>
        <el-button-group>
          <el-button :icon="Edit" @click="editUser">Edit</el-button>
          <el-button :icon="Delete" type="danger" @click="deleteUser">
            Delete
          </el-button>
        </el-button-group>
      </template>
    </el-page-header>
    
    <el-card v-if="user" class="user-card">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="Name">
          {{ user.name }}
        </el-descriptions-item>
        <el-descriptions-item label="Email">
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item label="Role">
          <el-tag :type="getRoleType(user.role)">{{ user.role }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Status">
          <el-tag :type="user.active ? 'success' : 'danger'">
            {{ user.active ? 'Active' : 'Inactive' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Created At">
          {{ formatDate(user.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="Last Login">
          {{ formatDate(user.lastLogin) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    
    <!-- User activity timeline -->
    <el-card v-if="activities" class="activity-card">
      <template #header>
        <h3>Recent Activity</h3>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="activity in activities"
          :key="activity.id"
          :timestamp="formatDate(activity.timestamp)"
          :type="getActivityType(activity.type)"
        >
          {{ activity.description }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
    
    <!-- Error state -->
    <el-result
      v-if="error"
      icon="error"
      title="Failed to Load User"
      :sub-title="error.message"
    >
      <template #extra>
        <el-button type="primary" @click="refetch">Retry</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteData } from '../composables/useRouteData'
import { userApi } from '../api/users'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()

// Fetch user data
const {
  data: user,
  loading: userLoading,
  error,
  refetch
} = useRouteData(
  async (params) => {
    const response = await userApi.getUser(params.id)
    return response.data
  },
  {
    loadingText: 'Loading user details...'
  }
)

// Fetch user activities
const {
  data: activities,
  loading: activitiesLoading
} = useRouteData(
  async (params) => {
    const response = await userApi.getUserActivities(params.id)
    return response.data
  },
  {
    showLoading: false
  }
)

const pageTitle = computed(() => {
  return user.value ? `User: ${user.value.name}` : 'User Details'
})

const goBack = () => {
  router.go(-1)
}

const editUser = () => {
  router.push(`/users/${props.id}/edit`)
}

const deleteUser = async () => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete the user. Continue?',
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    
    await userApi.deleteUser(props.id)
    ElMessage.success('User deleted successfully')
    router.push('/users')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete user')
    }
  }
}

const getRoleType = (role) => {
  const types = {
    admin: 'danger',
    manager: 'warning',
    user: 'info'
  }
  return types[role] || 'info'
}

const getActivityType = (type) => {
  const types = {
    login: 'primary',
    logout: 'info',
    update: 'warning',
    delete: 'danger'
  }
  return types[type] || 'primary'
}

const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.user-card,
.activity-card {
  margin-top: 20px;
}

.el-page-header {
  margin-bottom: 20px;
}
</style>
```

## Best Practices and Performance

### Route Caching Strategy

```javascript
// stores/routeCache.js
import { defineStore } from 'pinia'

export const useRouteCacheStore = defineStore('routeCache', {
  state: () => ({
    cachedViews: [],
    cachedData: new Map(),
    maxCacheSize: 10
  }),
  
  actions: {
    addCachedView(view) {
      if (this.cachedViews.includes(view.name)) return
      
      if (this.cachedViews.length >= this.maxCacheSize) {
        // Remove oldest cached view
        const removed = this.cachedViews.shift()
        this.cachedData.delete(removed)
      }
      
      this.cachedViews.push(view.name)
    },
    
    removeCachedView(view) {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
        this.cachedData.delete(view.name)
      }
    },
    
    clearCache() {
      this.cachedViews = []
      this.cachedData.clear()
    },
    
    setCachedData(routeName, data) {
      this.cachedData.set(routeName, {
        data,
        timestamp: Date.now()
      })
    },
    
    getCachedData(routeName, maxAge = 5 * 60 * 1000) {
      const cached = this.cachedData.get(routeName)
      
      if (!cached) return null
      
      if (Date.now() - cached.timestamp > maxAge) {
        this.cachedData.delete(routeName)
        return null
      }
      
      return cached.data
    }
  }
})
```

### SEO and Meta Management

```javascript
// composables/useMeta.js
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export const useMeta = () => {
  const route = useRoute()
  
  const setMeta = (meta) => {
    // Set page title
    if (meta.title) {
      document.title = `${meta.title} - My App`
    }
    
    // Set meta description
    if (meta.description) {
      updateMetaTag('description', meta.description)
    }
    
    // Set Open Graph tags
    if (meta.ogTitle) {
      updateMetaTag('og:title', meta.ogTitle, 'property')
    }
    
    if (meta.ogDescription) {
      updateMetaTag('og:description', meta.ogDescription, 'property')
    }
    
    if (meta.ogImage) {
      updateMetaTag('og:image', meta.ogImage, 'property')
    }
    
    // Set canonical URL
    if (meta.canonical) {
      updateCanonicalLink(meta.canonical)
    }
  }
  
  const updateMetaTag = (name, content, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`)
    
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, name)
      document.head.appendChild(element)
    }
    
    element.setAttribute('content', content)
  }
  
  const updateCanonicalLink = (href) => {
    let element = document.querySelector('link[rel="canonical"]')
    
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', 'canonical')
      document.head.appendChild(element)
    }
    
    element.setAttribute('href', href)
  }
  
  // Watch route changes
  watch(
    () => route.meta,
    (meta) => {
      if (meta) {
        setMeta(meta)
      }
    },
    { immediate: true }
  )
  
  return {
    setMeta
  }
}
```

### Error Handling

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div class="error-boundary">
    <slot v-if="!hasError" />
    
    <el-result
      v-else
      icon="error"
      :title="errorTitle"
      :sub-title="errorMessage"
    >
      <template #extra>
        <el-button type="primary" @click="retry">
          Try Again
        </el-button>
        <el-button @click="goHome">
          Go Home
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const hasError = ref(false)
const errorTitle = ref('Something went wrong')
const errorMessage = ref('An unexpected error occurred')

onErrorCaptured((error, instance, info) => {
  console.error('Error caught by boundary:', error, info)
  
  hasError.value = true
  errorTitle.value = 'Component Error'
  errorMessage.value = error.message || 'An error occurred while rendering this component'
  
  // Report error to monitoring service
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      contexts: {
        vue: {
          componentName: instance?.$options.name || 'Unknown',
          errorInfo: info
        }
      }
    })
  }
  
  return false // Prevent error from propagating
})

const retry = () => {
  hasError.value = false
  errorTitle.value = 'Something went wrong'
  errorMessage.value = 'An unexpected error occurred'
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

This comprehensive guide covers all aspects of Vue Router integration with Element Plus, from basic setup to advanced patterns like dynamic routing, data fetching, and error handling. The examples provide a solid foundation for building robust, scalable applications with excellent user experience.