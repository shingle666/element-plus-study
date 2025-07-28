# 第56天：Element Plus 综合项目实战（一）

## 学习目标

今天我们开始 Element Plus 综合项目实战，将前面学到的所有知识综合运用到一个完整的企业级管理系统中。

- 设计并实现企业级管理系统架构
- 应用 Element Plus 组件构建复杂界面
- 实现用户权限管理系统
- 集成数据可视化功能
- 应用性能优化技术

## 项目概述

### 项目名称：智能企业管理平台（Smart Enterprise Management Platform）

### 项目特点
- **技术栈**：Vue 3 + TypeScript + Element Plus + Pinia + Vue Router
- **架构模式**：微前端 + 模块化设计
- **功能模块**：用户管理、权限控制、数据分析、系统监控
- **设计理念**：响应式设计 + 暗黑模式 + 国际化

## 1. 项目架构设计

### 1.1 整体架构

```typescript
// packages/smart-platform/src/types/architecture.ts

/**
 * 系统架构接口定义
 */
export interface SystemArchitecture {
  core: CoreModule
  modules: ApplicationModule[]
  shared: SharedModule
  infrastructure: InfrastructureModule
}

export interface CoreModule {
  router: RouterConfig
  store: StoreConfig
  i18n: I18nConfig
  theme: ThemeConfig
  auth: AuthConfig
}

export interface ApplicationModule {
  name: string
  path: string
  component: any
  meta: ModuleMeta
  children?: ApplicationModule[]
}

export interface ModuleMeta {
  title: string
  icon: string
  permissions: string[]
  cache: boolean
  hidden: boolean
}

export interface SharedModule {
  components: ComponentRegistry
  composables: ComposableRegistry
  utils: UtilityRegistry
  constants: ConstantRegistry
}

export interface InfrastructureModule {
  http: HttpConfig
  storage: StorageConfig
  monitoring: MonitoringConfig
  logging: LoggingConfig
}

/**
 * 应用程序配置
 */
export interface AppConfig {
  name: string
  version: string
  environment: 'development' | 'staging' | 'production'
  api: {
    baseURL: string
    timeout: number
    retries: number
  }
  features: {
    darkMode: boolean
    i18n: boolean
    monitoring: boolean
    analytics: boolean
  }
  security: {
    tokenExpiry: number
    refreshThreshold: number
    maxLoginAttempts: number
  }
}
```

### 1.2 项目结构

```
smart-platform/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── main.ts                 # 应用入口
│   ├── App.vue                 # 根组件
│   ├── router/                 # 路由配置
│   │   ├── index.ts
│   │   ├── guards.ts
│   │   └── modules/
│   ├── store/                  # 状态管理
│   │   ├── index.ts
│   │   ├── modules/
│   │   └── types.ts
│   ├── views/                  # 页面组件
│   │   ├── dashboard/
│   │   ├── user/
│   │   ├── system/
│   │   └── analytics/
│   ├── components/             # 公共组件
│   │   ├── layout/
│   │   ├── common/
│   │   └── business/
│   ├── composables/            # 组合式函数
│   │   ├── useAuth.ts
│   │   ├── usePermission.ts
│   │   └── useTheme.ts
│   ├── utils/                  # 工具函数
│   │   ├── request.ts
│   │   ├── storage.ts
│   │   └── validation.ts
│   ├── assets/                 # 静态资源
│   │   ├── styles/
│   │   ├── images/
│   │   └── icons/
│   ├── locales/                # 国际化
│   │   ├── zh-CN.ts
│   │   ├── en-US.ts
│   │   └── index.ts
│   └── types/                  # 类型定义
│       ├── api.ts
│       ├── user.ts
│       └── common.ts
├── tests/                      # 测试文件
├── docs/                       # 项目文档
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 2. 核心模块实现

### 2.1 应用入口配置

```typescript
// src/main.ts

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import i18n from './locales'
import { setupGlobalComponents } from './components'
import { setupGlobalDirectives } from './directives'
import { setupErrorHandler } from './utils/error-handler'
import { setupPerformanceMonitor } from './utils/performance'
import { setupTheme } from './utils/theme'

// 样式导入
import './assets/styles/index.scss'

/**
 * 创建应用实例
 */
function createApplication() {
  const app = createApp(App)
  
  // 状态管理
  const pinia = createPinia()
  app.use(pinia)
  
  // 路由
  app.use(router)
  
  // 国际化
  app.use(i18n)
  
  // Element Plus
  app.use(ElementPlus, {
    locale: i18n.global.locale.value === 'zh-CN' ? zhCn : en,
    size: 'default'
  })
  
  // 注册 Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
  // 全局组件
  setupGlobalComponents(app)
  
  // 全局指令
  setupGlobalDirectives(app)
  
  // 错误处理
  setupErrorHandler(app)
  
  // 性能监控
  setupPerformanceMonitor(app)
  
  // 主题设置
  setupTheme()
  
  return app
}

/**
 * 应用初始化
 */
async function initializeApp() {
  try {
    // 创建应用
    const app = createApplication()
    
    // 等待路由准备就绪
    await router.isReady()
    
    // 挂载应用
    app.mount('#app')
    
    console.log('🚀 Smart Platform initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize application:', error)
  }
}

// 启动应用
initializeApp()
```

### 2.2 路由配置

```typescript
// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'
import { useAuthStore } from '@/store/modules/auth'
import { usePermissionStore } from '@/store/modules/permission'

// 布局组件
const Layout = () => import('@/components/layout/index.vue')

/**
 * 基础路由（无需权限）
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '登录',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/',
    redirect: '/dashboard',
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由（需要权限）
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    meta: {
      title: '仪表盘',
      icon: 'Dashboard',
      permissions: ['dashboard:view']
    },
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'House',
          affix: true
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/dashboard/analytics.vue'),
        meta: {
          title: '数据分析',
          icon: 'TrendCharts',
          permissions: ['analytics:view']
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: '用户管理',
      icon: 'User',
      permissions: ['user:view']
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: {
          title: '用户列表',
          icon: 'UserFilled'
        }
      },
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/views/user/roles.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          permissions: ['role:view']
        }
      },
      {
        path: 'permissions',
        name: 'PermissionList',
        component: () => import('@/views/user/permissions.vue'),
        meta: {
          title: '权限管理',
          icon: 'Key',
          permissions: ['permission:view']
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/settings',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      permissions: ['system:view']
    },
    children: [
      {
        path: 'settings',
        name: 'SystemSettings',
        component: () => import('@/views/system/settings.vue'),
        meta: {
          title: '系统设置',
          icon: 'Tools'
        }
      },
      {
        path: 'logs',
        name: 'SystemLogs',
        component: () => import('@/views/system/logs.vue'),
        meta: {
          title: '系统日志',
          icon: 'Document',
          permissions: ['log:view']
        }
      },
      {
        path: 'monitor',
        name: 'SystemMonitor',
        component: () => import('@/views/system/monitor.vue'),
        meta: {
          title: '系统监控',
          icon: 'Monitor',
          permissions: ['monitor:view']
        }
      }
    ]
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 设置路由守卫
setupRouterGuards(router)

export default router
```

### 2.3 路由守卫

```typescript
// src/router/guards.ts

import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置进度条
NProgress.configure({ showSpinner: false })

// 白名单路由（无需登录）
const whiteList = ['/login', '/404', '/401']

/**
 * 设置路由守卫
 */
export function setupRouterGuards(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()
    
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - Smart Platform` : 'Smart Platform'
    
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()
    const userStore = useUserStore()
    
    const hasToken = getToken()
    
    if (hasToken) {
      if (to.path === '/login') {
        // 已登录且要跳转的页面是登录页
        next({ path: '/' })
        NProgress.done()
      } else {
        // 判断当前用户是否已拉取完user_info信息
        const hasUserInfo = userStore.name
        
        if (hasUserInfo) {
          // 已获取用户信息，直接放行
          next()
        } else {
          try {
            // 获取用户信息
            await userStore.getUserInfo()
            
            // 生成可访问的路由表
            const accessRoutes = await permissionStore.generateRoutes(userStore.roles)
            
            // 动态添加可访问路由
            accessRoutes.forEach(route => {
              router.addRoute(route)
            })
            
            // hack方法 确保addRoutes已完成
            next({ ...to, replace: true })
          } catch (error) {
            // 移除token并跳转登录页
            await authStore.resetToken()
            ElMessage.error('获取用户信息失败，请重新登录')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        // 其他没有访问权限的页面将被重定向到登录页面
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })
  
  // 全局后置守卫
  router.afterEach((to, from) => {
    // 结束进度条
    NProgress.done()
    
    // 记录路由访问日志
    console.log(`Route changed: ${from.path} -> ${to.path}`)
  })
  
  // 路由错误处理
  router.onError((error) => {
    console.error('Router error:', error)
    NProgress.done()
  })
}

/**
 * 权限检查函数
 */
export function hasPermission(permissions: string[], route: any): boolean {
  if (route.meta && route.meta.permissions) {
    return permissions.some(permission => {
      return route.meta.permissions.includes(permission)
    })
  } else {
    return true
  }
}

/**
 * 过滤异步路由
 */
export function filterAsyncRoutes(routes: any[], permissions: string[]): any[] {
  const res: any[] = []
  
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })
  
  return res
}
```

## 3. 状态管理设计

### 3.1 Pinia Store 配置

```typescript
// src/store/index.ts

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()

// 添加持久化插件
pinia.use(
  createPersistedState({
    storage: localStorage,
    key: id => `smart-platform-${id}`,
    auto: true
  })
)

export default pinia

// 导出所有 store
export * from './modules/auth'
export * from './modules/user'
export * from './modules/permission'
export * from './modules/app'
export * from './modules/settings'
```

### 3.2 认证状态管理

```typescript
// src/store/modules/auth.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, logout, refreshToken } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import type { LoginForm, LoginResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>(getToken() || '')
  const refreshTokenValue = ref<string>('')
  const loginTime = ref<number>(0)
  const expiresIn = ref<number>(0)
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isTokenExpired = computed(() => {
    if (!loginTime.value || !expiresIn.value) return false
    return Date.now() > loginTime.value + expiresIn.value * 1000
  })
  
  /**
   * 登录
   */
  async function loginAction(loginForm: LoginForm): Promise<void> {
    try {
      const response = await login(loginForm)
      const { access_token, refresh_token, expires_in } = response.data
      
      // 保存 token
      token.value = access_token
      refreshTokenValue.value = refresh_token
      expiresIn.value = expires_in
      loginTime.value = Date.now()
      
      setToken(access_token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }
  
  /**
   * 登出
   */
  async function logoutAction(): Promise<void> {
    try {
      if (token.value) {
        await logout()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // 清除本地数据
      resetToken()
      resetRouter()
    }
  }
  
  /**
   * 重置 token
   */
  function resetToken(): void {
    token.value = ''
    refreshTokenValue.value = ''
    loginTime.value = 0
    expiresIn.value = 0
    removeToken()
  }
  
  /**
   * 刷新 token
   */
  async function refreshTokenAction(): Promise<string> {
    try {
      const response = await refreshToken(refreshTokenValue.value)
      const { access_token, expires_in } = response.data
      
      token.value = access_token
      expiresIn.value = expires_in
      loginTime.value = Date.now()
      
      setToken(access_token)
      return access_token
    } catch (error) {
      console.error('Refresh token failed:', error)
      resetToken()
      throw error
    }
  }
  
  /**
   * 检查并刷新 token
   */
  async function checkAndRefreshToken(): Promise<void> {
    if (isTokenExpired.value && refreshTokenValue.value) {
      try {
        await refreshTokenAction()
      } catch (error) {
        // 刷新失败，需要重新登录
        await logoutAction()
        throw new Error('Token refresh failed, please login again')
      }
    }
  }
  
  return {
    // 状态
    token,
    refreshTokenValue,
    loginTime,
    expiresIn,
    
    // 计算属性
    isLoggedIn,
    isTokenExpired,
    
    // 方法
    loginAction,
    logoutAction,
    resetToken,
    refreshTokenAction,
    checkAndRefreshToken
  }
}, {
  persist: {
    paths: ['token', 'refreshTokenValue', 'loginTime', 'expiresIn']
  }
})
```

### 3.3 用户状态管理

```typescript
// src/store/modules/user.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, updateUserProfile } from '@/api/user'
import type { UserInfo, UserProfile } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null)
  const avatar = ref<string>('')
  const name = ref<string>('')
  const email = ref<string>('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const department = ref<string>('')
  const position = ref<string>('')
  
  /**
   * 获取用户信息
   */
  async function getUserInfoAction(): Promise<UserInfo> {
    try {
      const response = await getUserInfo()
      const data = response.data
      
      // 更新状态
      userInfo.value = data
      avatar.value = data.avatar || ''
      name.value = data.name || ''
      email.value = data.email || ''
      roles.value = data.roles || []
      permissions.value = data.permissions || []
      department.value = data.department || ''
      position.value = data.position || ''
      
      return data
    } catch (error) {
      console.error('Get user info failed:', error)
      throw error
    }
  }
  
  /**
   * 更新用户资料
   */
  async function updateUserProfileAction(profile: UserProfile): Promise<void> {
    try {
      const response = await updateUserProfile(profile)
      
      // 更新本地状态
      if (userInfo.value) {
        Object.assign(userInfo.value, profile)
        avatar.value = profile.avatar || avatar.value
        name.value = profile.name || name.value
        email.value = profile.email || email.value
        department.value = profile.department || department.value
        position.value = profile.position || position.value
      }
    } catch (error) {
      console.error('Update user profile failed:', error)
      throw error
    }
  }
  
  /**
   * 重置用户信息
   */
  function resetUserInfo(): void {
    userInfo.value = null
    avatar.value = ''
    name.value = ''
    email.value = ''
    roles.value = []
    permissions.value = []
    department.value = ''
    position.value = ''
  }
  
  /**
   * 检查权限
   */
  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission)
  }
  
  /**
   * 检查角色
   */
  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }
  
  /**
   * 检查多个权限（AND 关系）
   */
  function hasAllPermissions(permissionList: string[]): boolean {
    return permissionList.every(permission => hasPermission(permission))
  }
  
  /**
   * 检查多个权限（OR 关系）
   */
  function hasAnyPermission(permissionList: string[]): boolean {
    return permissionList.some(permission => hasPermission(permission))
  }
  
  return {
    // 状态
    userInfo,
    avatar,
    name,
    email,
    roles,
    permissions,
    department,
    position,
    
    // 方法
    getUserInfo: getUserInfoAction,
    updateUserProfile: updateUserProfileAction,
    resetUserInfo,
    hasPermission,
    hasRole,
    hasAllPermissions,
    hasAnyPermission
  }
}, {
  persist: {
    paths: ['userInfo', 'avatar', 'name', 'email', 'roles', 'permissions', 'department', 'position']
  }
})
```

## 4. 实践练习

### 练习 1：项目初始化

1. 创建新的 Vue 3 + TypeScript 项目
2. 安装并配置 Element Plus
3. 设置项目目录结构
4. 配置 Vite 构建工具

### 练习 2：路由和状态管理

1. 实现路由配置和守卫
2. 设置 Pinia 状态管理
3. 实现用户认证流程
4. 添加权限控制机制

### 练习 3：基础布局

1. 创建主布局组件
2. 实现侧边栏导航
3. 添加顶部导航栏
4. 设置面包屑导航

## 学习资源

* [Vue 3 官方文档](https://cn.vuejs.org/)
* [Element Plus 官方文档](https://element-plus.org/)
* [Pinia 官方文档](https://pinia.vuejs.org/)
* [Vue Router 官方文档](https://router.vuejs.org/)
* [TypeScript 官方文档](https://www.typescriptlang.org/)
* [Vite 官方文档](https://cn.vitejs.dev/)

## 作业

1. 完成项目基础架构搭建
2. 实现用户登录和权限验证
3. 创建主要页面的基础布局
4. 编写单元测试用例

## 总结

今天我们开始了 Element Plus 综合项目实战，主要完成了：

1. **项目架构设计**：设计了完整的企业级应用架构
2. **核心模块实现**：实现了应用入口、路由配置和守卫
3. **状态管理设计**：使用 Pinia 实现了认证和用户状态管理
4. **权限控制系统**：建立了完整的权限验证机制

## 下一步学习计划

明天我们将继续项目实战，重点实现：
- 主布局组件设计
- 用户管理模块
- 数据表格组件
- 表单验证系统