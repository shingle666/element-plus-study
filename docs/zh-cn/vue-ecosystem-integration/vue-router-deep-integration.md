# 第74天：Element Plus 与 Vue Router 深度集成

## 学习目标

* 掌握 Element Plus 组件与 Vue Router 的深度集成技术
* 学习路由级别的组件懒加载和代码分割
* 了解基于路由的权限控制和导航守卫
* 实现动态路由和菜单系统的完美结合

## 知识点概览

### 1. 路由与组件集成基础

#### 1.1 路由配置与组件映射

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由元信息接口
interface RouteMeta {
  title?: string
  icon?: string
  hidden?: boolean
  roles?: string[]
  permissions?: string[]
  keepAlive?: boolean
  breadcrumb?: boolean
  affix?: boolean
  activeMenu?: string
  noCache?: boolean
  alwaysShow?: boolean
}

// 扩展路由记录类型
interface AppRouteRecord extends Omit<RouteRecordRaw, 'meta'> {
  meta?: RouteMeta
  children?: AppRouteRecord[]
}

// 路由配置管理器
class RouterConfigManager {
  private routes: AppRouteRecord[] = []
  private dynamicRoutes: AppRouteRecord[] = []
  private constantRoutes: AppRouteRecord[] = []
  
  constructor() {
    this.initializeConstantRoutes()
  }
  
  // 初始化固定路由
  private initializeConstantRoutes(): void {
    this.constantRoutes = [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
          title: '登录',
          hidden: true
        }
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {
          title: '404',
          hidden: true
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
  }
  
  // 生成动态路由
  generateDynamicRoutes(userPermissions: string[]): AppRouteRecord[] {
    const asyncRoutes: AppRouteRecord[] = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/layout/index.vue'),
        redirect: '/dashboard/workplace',
        meta: {
          title: '仪表盘',
          icon: 'Dashboard',
          alwaysShow: true
        },
        children: [
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/workplace/index.vue'),
            meta: {
              title: '工作台',
              icon: 'Monitor',
              affix: true
            }
          },
          {
            path: 'analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/analysis/index.vue'),
            meta: {
              title: '分析页',
              icon: 'TrendCharts',
              permissions: ['dashboard:analysis']
            }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        component: () => import('@/layout/index.vue'),
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          icon: 'Setting',
          roles: ['admin']
        },
        children: [
          {
            path: 'user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'User',
              permissions: ['system:user:list']
            }
          },
          {
            path: 'role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              icon: 'UserFilled',
              permissions: ['system:role:list']
            }
          },
          {
            path: 'menu',
            name: 'SystemMenu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              icon: 'Menu',
              permissions: ['system:menu:list']
            }
          }
        ]
      }
    ]
    
    // 根据权限过滤路由
    this.dynamicRoutes = this.filterRoutesByPermissions(asyncRoutes, userPermissions)
    return this.dynamicRoutes
  }
  
  // 根据权限过滤路由
  private filterRoutesByPermissions(
    routes: AppRouteRecord[],
    permissions: string[]
  ): AppRouteRecord[] {
    const filteredRoutes: AppRouteRecord[] = []
    
    routes.forEach(route => {
      const hasPermission = this.checkRoutePermission(route, permissions)
      
      if (hasPermission) {
        const filteredRoute = { ...route }
        
        if (route.children) {
          filteredRoute.children = this.filterRoutesByPermissions(
            route.children,
            permissions
          )
          
          // 如果子路由被全部过滤掉，则隐藏父路由
          if (filteredRoute.children.length === 0 && !route.meta?.alwaysShow) {
            return
          }
        }
        
        filteredRoutes.push(filteredRoute)
      }
    })
    
    return filteredRoutes
  }
  
  // 检查路由权限
  private checkRoutePermission(route: AppRouteRecord, userPermissions: string[]): boolean {
    const { roles, permissions } = route.meta || {}
    
    // 如果没有设置权限要求，则允许访问
    if (!roles && !permissions) {
      return true
    }
    
    // 检查角色权限
    if (roles) {
      const userRoles = this.getUserRoles() // 获取用户角色
      if (!roles.some(role => userRoles.includes(role))) {
        return false
      }
    }
    
    // 检查具体权限
    if (permissions) {
      if (!permissions.some(permission => userPermissions.includes(permission))) {
        return false
      }
    }
    
    return true
  }
  
  // 获取用户角色（示例）
  private getUserRoles(): string[] {
    // 实际实现中应该从用户状态中获取
    return ['admin', 'user']
  }
  
  // 获取所有路由
  getAllRoutes(): AppRouteRecord[] {
    return [...this.constantRoutes, ...this.dynamicRoutes]
  }
  
  // 获取菜单路由（排除隐藏的路由）
  getMenuRoutes(): AppRouteRecord[] {
    return this.dynamicRoutes.filter(route => !route.meta?.hidden)
  }
}

// 创建路由实例
const routerConfigManager = new RouterConfigManager()

const router = createRouter({
  history: createWebHistory(),
  routes: routerConfigManager.getAllRoutes(),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export { router, routerConfigManager }
export type { AppRouteRecord, RouteMeta }
```

#### 1.2 路由守卫与权限控制

```typescript
// router/guards.ts
import { Router } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { routerConfigManager } from './index'

// 路由守卫管理器
class RouterGuardManager {
  private router: Router
  private loadingInstance: any = null
  
  constructor(router: Router) {
    this.router = router
    this.setupGuards()
  }
  
  // 设置路由守卫
  private setupGuards(): void {
    this.setupBeforeEachGuard()
    this.setupAfterEachGuard()
    this.setupBeforeResolveGuard()
    this.setupErrorHandler()
  }
  
  // 前置守卫
  private setupBeforeEachGuard(): void {
    this.router.beforeEach(async (to, from, next) => {
      // 显示加载状态
      this.showLoading()
      
      try {
        // 设置页面标题
        this.setPageTitle(to.meta?.title)
        
        // 白名单路由直接放行
        if (this.isWhiteListRoute(to.path)) {
          next()
          return
        }
        
        const userStore = useUserStore()
        const permissionStore = usePermissionStore()
        
        // 检查用户是否已登录
        if (!userStore.token) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
          return
        }
        
        // 检查用户信息是否已获取
        if (!userStore.userInfo.id) {
          try {
            // 获取用户信息
            await userStore.getUserInfo()
            
            // 生成动态路由
            const accessRoutes = routerConfigManager.generateDynamicRoutes(
              userStore.permissions
            )
            
            // 添加动态路由
            accessRoutes.forEach(route => {
              this.router.addRoute(route)
            })
            
            // 存储路由信息
            permissionStore.setRoutes(accessRoutes)
            
            // 重新导航到目标路由
            next({ ...to, replace: true })
            return
          } catch (error) {
            // 获取用户信息失败，清除token并跳转到登录页
            await userStore.logout()
            ElMessage.error('获取用户信息失败，请重新登录')
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
            return
          }
        }
        
        // 检查路由权限
        if (!this.checkRoutePermission(to, userStore.permissions)) {
          ElMessage.error('您没有访问该页面的权限')
          next({ path: '/403' })
          return
        }
        
        next()
      } catch (error) {
        console.error('路由守卫错误:', error)
        ElMessage.error('页面加载失败')
        next(false)
      }
    })
  }
  
  // 后置守卫
  private setupAfterEachGuard(): void {
    this.router.afterEach((to, from) => {
      // 隐藏加载状态
      this.hideLoading()
      
      // 记录路由访问日志
      this.logRouteAccess(to, from)
      
      // 更新面包屑
      this.updateBreadcrumb(to)
    })
  }
  
  // 解析守卫
  private setupBeforeResolveGuard(): void {
    this.router.beforeResolve((to, from, next) => {
      // 在路由解析之前执行的逻辑
      next()
    })
  }
  
  // 错误处理
  private setupErrorHandler(): void {
    this.router.onError((error) => {
      console.error('路由错误:', error)
      ElMessage.error('页面加载出错')
      this.hideLoading()
    })
  }
  
  // 显示加载状态
  private showLoading(): void {
    if (!this.loadingInstance) {
      this.loadingInstance = ElLoading.service({
        lock: true,
        text: '页面加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
  
  // 隐藏加载状态
  private hideLoading(): void {
    if (this.loadingInstance) {
      this.loadingInstance.close()
      this.loadingInstance = null
    }
  }
  
  // 设置页面标题
  private setPageTitle(title?: string): void {
    const appTitle = 'Element Plus Admin'
    document.title = title ? `${title} - ${appTitle}` : appTitle
  }
  
  // 检查是否为白名单路由
  private isWhiteListRoute(path: string): boolean {
    const whiteList = ['/login', '/404', '/403']
    return whiteList.includes(path)
  }
  
  // 检查路由权限
  private checkRoutePermission(route: any, userPermissions: string[]): boolean {
    const { roles, permissions } = route.meta || {}
    
    if (!roles && !permissions) {
      return true
    }
    
    if (permissions) {
      return permissions.some((permission: string) => 
        userPermissions.includes(permission)
      )
    }
    
    return true
  }
  
  // 记录路由访问日志
  private logRouteAccess(to: any, from: any): void {
    console.log(`路由跳转: ${from.path} -> ${to.path}`)
    
    // 实际项目中可以发送到后端进行统计
    // analytics.track('page_view', {
    //   from: from.path,
    //   to: to.path,
    //   timestamp: Date.now()
    // })
  }
  
  // 更新面包屑
  private updateBreadcrumb(route: any): void {
    // 生成面包屑数据
    const breadcrumbs = this.generateBreadcrumbs(route)
    
    // 存储到状态管理中
    const permissionStore = usePermissionStore()
    permissionStore.setBreadcrumbs(breadcrumbs)
  }
  
  // 生成面包屑数据
  private generateBreadcrumbs(route: any): Array<{ title: string; path?: string }> {
    const breadcrumbs: Array<{ title: string; path?: string }> = []
    const matched = route.matched
    
    matched.forEach((item: any) => {
      if (item.meta?.title && item.meta?.breadcrumb !== false) {
        breadcrumbs.push({
          title: item.meta.title,
          path: item.path === route.path ? undefined : item.path
        })
      }
    })
    
    return breadcrumbs
  }
}

// 初始化路由守卫
export function setupRouterGuards(router: Router): void {
  new RouterGuardManager(router)
}
```

### 2. 动态菜单系统

#### 2.1 菜单组件实现

```vue
<!-- components/Menu/SidebarMenu.vue -->
<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="isCollapse"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
    class="sidebar-menu"
    @select="handleMenuSelect"
  >
    <sidebar-menu-item
      v-for="route in menuRoutes"
      :key="route.path"
      :item="route"
      :base-path="route.path"
    />
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'
import { useAppStore } from '@/stores/app'
import SidebarMenuItem from './SidebarMenuItem.vue'
import type { AppRouteRecord } from '@/router'

// 状态管理
const route = useRoute()
const router = useRouter()
const permissionStore = usePermissionStore()
const appStore = useAppStore()

// 计算属性
const menuRoutes = computed(() => permissionStore.menuRoutes)
const isCollapse = computed(() => appStore.sidebar.collapsed)
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta?.activeMenu) {
    return meta.activeMenu
  }
  return path
})

// 菜单选择处理
function handleMenuSelect(index: string): void {
  if (index !== route.path) {
    router.push(index)
  }
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
  border: none;
  height: 100%;
  width: 100% !important;
  
  :deep(.el-menu-item),
  :deep(.el-submenu__title) {
    height: 50px;
    line-height: 50px;
    
    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--el-color-primary);
      }
    }
  }
  
  :deep(.el-submenu) {
    .el-menu-item {
      padding-left: 50px !important;
    }
    
    .el-submenu .el-menu-item {
      padding-left: 70px !important;
    }
  }
  
  &.el-menu--collapse {
    :deep(.el-submenu) {
      .el-submenu__title {
        padding-left: 20px !important;
      }
    }
  }
}
</style>
```

```vue
<!-- components/Menu/SidebarMenuItem.vue -->
<template>
  <template v-if="!item.meta?.hidden">
    <!-- 单个菜单项 -->
    <el-menu-item
      v-if="!hasChildren"
      :index="resolvePath(item.path)"
      :class="{ 'submenu-title-noDropdown': !isNest }"
    >
      <menu-item-content :item="item" />
    </el-menu-item>
    
    <!-- 子菜单 -->
    <el-submenu
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template #title>
        <menu-item-content :item="item" />
      </template>
      
      <sidebar-menu-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
        :is-nest="true"
      />
    </el-submenu>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import path from 'path-browserify'
import MenuItemContent from './MenuItemContent.vue'
import type { AppRouteRecord } from '@/router'

interface Props {
  item: AppRouteRecord
  basePath: string
  isNest?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isNest: false
})

// 计算属性
const hasChildren = computed(() => {
  const children = props.item.children
  if (!children || children.length === 0) {
    return false
  }
  
  // 过滤隐藏的子菜单
  const visibleChildren = children.filter(child => !child.meta?.hidden)
  return visibleChildren.length > 0
})

// 解析路径
function resolvePath(routePath: string): string {
  if (isExternalLink(routePath)) {
    return routePath
  }
  
  if (isExternalLink(props.basePath)) {
    return props.basePath
  }
  
  return path.resolve(props.basePath, routePath)
}

// 检查是否为外部链接
function isExternalLink(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}
</script>
```

```vue
<!-- components/Menu/MenuItemContent.vue -->
<template>
  <div class="menu-item-content">
    <!-- 图标 -->
    <el-icon v-if="item.meta?.icon" class="menu-icon">
      <component :is="item.meta.icon" />
    </el-icon>
    
    <!-- 标题 -->
    <span class="menu-title">{{ item.meta?.title }}</span>
    
    <!-- 外部链接图标 -->
    <el-icon v-if="isExternalLink" class="external-link-icon">
      <Link />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Link } from '@element-plus/icons-vue'
import type { AppRouteRecord } from '@/router'

interface Props {
  item: AppRouteRecord
}

const props = defineProps<Props>()

// 计算属性
const isExternalLink = computed(() => {
  return /^(https?:|mailto:|tel:)/.test(props.item.path)
})
</script>

<style lang="scss" scoped>
.menu-item-content {
  display: flex;
  align-items: center;
  
  .menu-icon {
    margin-right: 8px;
    font-size: 16px;
  }
  
  .menu-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .external-link-icon {
    margin-left: 8px;
    font-size: 12px;
    opacity: 0.6;
  }
}
</style>
```

#### 2.2 面包屑导航组件

```vue
<!-- components/Breadcrumb/index.vue -->
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path || item.title"
        :to="item.path && index < breadcrumbs.length - 1 ? { path: item.path } : undefined"
        :class="{ 'no-redirect': !item.path || index === breadcrumbs.length - 1 }"
      >
        <span class="breadcrumb-title">{{ item.title }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const permissionStore = usePermissionStore()

// 计算属性
const breadcrumbs = computed(() => {
  // 从状态管理中获取面包屑数据
  const storedBreadcrumbs = permissionStore.breadcrumbs
  
  if (storedBreadcrumbs.length > 0) {
    return storedBreadcrumbs
  }
  
  // 如果状态管理中没有数据，则从路由中生成
  return generateBreadcrumbsFromRoute()
})

// 从路由生成面包屑
function generateBreadcrumbsFromRoute() {
  const matched = route.matched.filter(item => item.meta?.title)
  const breadcrumbs = matched.map(item => ({
    title: item.meta?.title || '',
    path: item.path === route.path ? undefined : item.path
  }))
  
  return breadcrumbs
}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  
  .no-redirect {
    color: var(--el-text-color-secondary);
    cursor: text;
  }
  
  .breadcrumb-title {
    font-weight: 400;
  }
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
```

### 3. 路由级别的组件懒加载

#### 3.1 智能懒加载策略

```typescript
// utils/lazyLoad.ts
import { defineAsyncComponent, AsyncComponentLoader } from 'vue'
import { ElLoading } from 'element-plus'

// 懒加载配置接口
interface LazyLoadOptions {
  loading?: boolean
  delay?: number
  timeout?: number
  errorComponent?: any
  loadingComponent?: any
  retryTimes?: number
}

// 懒加载管理器
class LazyLoadManager {
  private loadingInstances: Map<string, any> = new Map()
  private loadedComponents: Map<string, any> = new Map()
  private failedComponents: Set<string> = new Set()
  
  // 创建懒加载组件
  createLazyComponent(
    loader: AsyncComponentLoader,
    options: LazyLoadOptions = {}
  ) {
    const {
      loading = true,
      delay = 200,
      timeout = 10000,
      retryTimes = 3
    } = options
    
    return defineAsyncComponent({
      loader: this.createRetryLoader(loader, retryTimes),
      
      loadingComponent: loading ? this.createLoadingComponent() : undefined,
      
      errorComponent: this.createErrorComponent(),
      
      delay,
      timeout,
      
      onError: (error, retry, fail, attempts) => {
        console.error(`组件加载失败 (尝试 ${attempts}/${retryTimes}):`, error)
        
        if (attempts < retryTimes) {
          // 延迟重试
          setTimeout(() => {
            retry()
          }, 1000 * attempts)
        } else {
          fail()
        }
      }
    })
  }
  
  // 创建重试加载器
  private createRetryLoader(
    loader: AsyncComponentLoader,
    retryTimes: number
  ): AsyncComponentLoader {
    return async () => {
      let lastError: any
      
      for (let i = 0; i < retryTimes; i++) {
        try {
          const component = await loader()
          return component
        } catch (error) {
          lastError = error
          
          if (i < retryTimes - 1) {
            // 等待一段时间后重试
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
          }
        }
      }
      
      throw lastError
    }
  }
  
  // 创建加载组件
  private createLoadingComponent() {
    return {
      template: `
        <div class="lazy-loading">
          <el-skeleton :rows="5" animated />
        </div>
      `
    }
  }
  
  // 创建错误组件
  private createErrorComponent() {
    return {
      template: `
        <div class="lazy-error">
          <el-result
            icon="error"
            title="组件加载失败"
            sub-title="请检查网络连接或刷新页面重试"
          >
            <template #extra>
              <el-button type="primary" @click="$emit('retry')">
                重新加载
              </el-button>
            </template>
          </el-result>
        </div>
      `,
      emits: ['retry']
    }
  }
  
  // 预加载组件
  async preloadComponent(loader: AsyncComponentLoader): Promise<any> {
    try {
      const component = await loader()
      return component
    } catch (error) {
      console.error('组件预加载失败:', error)
      throw error
    }
  }
  
  // 批量预加载
  async preloadComponents(loaders: AsyncComponentLoader[]): Promise<void> {
    const promises = loaders.map(loader => 
      this.preloadComponent(loader).catch(error => {
        console.warn('预加载组件失败:', error)
        return null
      })
    )
    
    await Promise.all(promises)
  }
  
  // 智能预加载（基于路由预测）
  async smartPreload(currentRoute: string): Promise<void> {
    const predictedRoutes = this.predictNextRoutes(currentRoute)
    const loaders = this.getLoadersForRoutes(predictedRoutes)
    
    // 在空闲时间预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.preloadComponents(loaders)
      })
    } else {
      setTimeout(() => {
        this.preloadComponents(loaders)
      }, 100)
    }
  }
  
  // 预测下一个可能访问的路由
  private predictNextRoutes(currentRoute: string): string[] {
    // 基于用户行为模式预测
    const routePatterns: Record<string, string[]> = {
      '/dashboard': ['/system/user', '/system/role'],
      '/system/user': ['/system/role', '/system/menu'],
      '/system/role': ['/system/user', '/system/menu']
    }
    
    return routePatterns[currentRoute] || []
  }
  
  // 获取路由对应的加载器
  private getLoadersForRoutes(routes: string[]): AsyncComponentLoader[] {
    const routeLoaderMap: Record<string, AsyncComponentLoader> = {
      '/system/user': () => import('@/views/system/user/index.vue'),
      '/system/role': () => import('@/views/system/role/index.vue'),
      '/system/menu': () => import('@/views/system/menu/index.vue')
    }
    
    return routes
      .map(route => routeLoaderMap[route])
      .filter(Boolean)
  }
}

// 创建全局懒加载管理器实例
const lazyLoadManager = new LazyLoadManager()

// 便捷函数
export function lazyLoad(
  loader: AsyncComponentLoader,
  options?: LazyLoadOptions
) {
  return lazyLoadManager.createLazyComponent(loader, options)
}

export function preloadRoute(loader: AsyncComponentLoader) {
  return lazyLoadManager.preloadComponent(loader)
}

export function smartPreload(currentRoute: string) {
  return lazyLoadManager.smartPreload(currentRoute)
}

export { lazyLoadManager }
```

#### 3.2 代码分割优化

```typescript
// utils/chunkSplit.ts

// 代码分割策略
interface ChunkSplitStrategy {
  vendor: string[]
  common: string[]
  routes: Record<string, string[]>
}

// 代码分割配置
const chunkSplitConfig: ChunkSplitStrategy = {
  // 第三方库分割
  vendor: [
    'vue',
    'vue-router',
    'pinia',
    'element-plus',
    '@element-plus/icons-vue'
  ],
  
  // 公共模块分割
  common: [
    '@/utils',
    '@/components',
    '@/stores',
    '@/api'
  ],
  
  // 路由级别分割
  routes: {
    dashboard: ['@/views/dashboard'],
    system: ['@/views/system'],
    user: ['@/views/user']
  }
}

// Vite 构建配置
export function getChunkSplitConfig() {
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // 第三方库
            if (id.includes('node_modules')) {
              for (const vendor of chunkSplitConfig.vendor) {
                if (id.includes(vendor)) {
                  return 'vendor'
                }
              }
              return 'vendor-other'
            }
            
            // 公共模块
            for (const common of chunkSplitConfig.common) {
              if (id.includes(common)) {
                return 'common'
              }
            }
            
            // 路由模块
            for (const [chunk, paths] of Object.entries(chunkSplitConfig.routes)) {
              for (const path of paths) {
                if (id.includes(path)) {
                  return chunk
                }
              }
            }
            
            return undefined
          }
        }
      }
    }
  }
}

// 动态导入优化
export function optimizedImport(path: string) {
  return () => import(
    /* webpackChunkName: "[request]" */
    /* webpackPreload: true */
    path
  )
}

// 路由级别的代码分割
export function createRouteChunk(routeName: string, componentPath: string) {
  return () => import(
    /* webpackChunkName: "route-[request]" */
    componentPath
  ).then(module => {
    // 添加路由标识
    if (module.default) {
      module.default.__routeName = routeName
    }
    return module
  })
}
```

### 4. 路由状态管理

#### 4.1 权限状态管理

```typescript
// stores/permission.ts
import { defineStore } from 'pinia'
import type { AppRouteRecord } from '@/router'

interface PermissionState {
  routes: AppRouteRecord[]
  menuRoutes: AppRouteRecord[]
  breadcrumbs: Array<{ title: string; path?: string }>
  permissions: string[]
  roles: string[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    menuRoutes: [],
    breadcrumbs: [],
    permissions: [],
    roles: []
  }),
  
  getters: {
    // 获取扁平化的路由列表
    flatRoutes: (state) => {
      const flatten = (routes: AppRouteRecord[]): AppRouteRecord[] => {
        const result: AppRouteRecord[] = []
        
        routes.forEach(route => {
          result.push(route)
          if (route.children) {
            result.push(...flatten(route.children))
          }
        })
        
        return result
      }
      
      return flatten(state.routes)
    },
    
    // 根据路径查找路由
    getRouteByPath: (state) => (path: string) => {
      const flatRoutes = state.flatRoutes
      return flatRoutes.find(route => route.path === path)
    },
    
    // 检查是否有权限
    hasPermission: (state) => (permission: string) => {
      return state.permissions.includes(permission)
    },
    
    // 检查是否有角色
    hasRole: (state) => (role: string) => {
      return state.roles.includes(role)
    }
  },
  
  actions: {
    // 设置路由
    setRoutes(routes: AppRouteRecord[]) {
      this.routes = routes
      this.menuRoutes = routes.filter(route => !route.meta?.hidden)
    },
    
    // 设置面包屑
    setBreadcrumbs(breadcrumbs: Array<{ title: string; path?: string }>) {
      this.breadcrumbs = breadcrumbs
    },
    
    // 设置权限
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },
    
    // 设置角色
    setRoles(roles: string[]) {
      this.roles = roles
    },
    
    // 清除权限信息
    clearPermissions() {
      this.routes = []
      this.menuRoutes = []
      this.breadcrumbs = []
      this.permissions = []
      this.roles = []
    },
    
    // 添加动态路由
    addRoute(route: AppRouteRecord) {
      this.routes.push(route)
      if (!route.meta?.hidden) {
        this.menuRoutes.push(route)
      }
    },
    
    // 移除路由
    removeRoute(routeName: string) {
      this.routes = this.routes.filter(route => route.name !== routeName)
      this.menuRoutes = this.menuRoutes.filter(route => route.name !== routeName)
    }
  },
  
  persist: {
    key: 'permission-store',
    storage: localStorage,
    paths: ['permissions', 'roles']
  }
})
```

#### 4.2 路由历史管理

```typescript
// stores/routeHistory.ts
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

interface RouteHistoryItem {
  path: string
  name?: string
  title?: string
  query?: Record<string, any>
  params?: Record<string, any>
  timestamp: number
}

interface RouteHistoryState {
  history: RouteHistoryItem[]
  maxHistoryLength: number
  currentIndex: number
}

export const useRouteHistoryStore = defineStore('routeHistory', {
  state: (): RouteHistoryState => ({
    history: [],
    maxHistoryLength: 50,
    currentIndex: -1
  }),
  
  getters: {
    // 获取当前路由
    currentRoute: (state) => {
      return state.history[state.currentIndex]
    },
    
    // 获取前一个路由
    previousRoute: (state) => {
      return state.history[state.currentIndex - 1]
    },
    
    // 获取后一个路由
    nextRoute: (state) => {
      return state.history[state.currentIndex + 1]
    },
    
    // 是否可以后退
    canGoBack: (state) => {
      return state.currentIndex > 0
    },
    
    // 是否可以前进
    canGoForward: (state) => {
      return state.currentIndex < state.history.length - 1
    },
    
    // 获取最近访问的路由
    recentRoutes: (state) => {
      return state.history
        .slice(-10)
        .reverse()
        .filter((item, index, arr) => 
          arr.findIndex(route => route.path === item.path) === index
        )
    }
  },
  
  actions: {
    // 添加路由到历史
    addRoute(route: RouteLocationNormalized) {
      const historyItem: RouteHistoryItem = {
        path: route.path,
        name: route.name as string,
        title: route.meta?.title as string,
        query: route.query,
        params: route.params,
        timestamp: Date.now()
      }
      
      // 如果当前不在历史末尾，删除后面的记录
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1)
      }
      
      // 添加新记录
      this.history.push(historyItem)
      this.currentIndex = this.history.length - 1
      
      // 限制历史长度
      if (this.history.length > this.maxHistoryLength) {
        this.history = this.history.slice(-this.maxHistoryLength)
        this.currentIndex = this.history.length - 1
      }
    },
    
    // 后退
    goBack() {
      if (this.canGoBack) {
        this.currentIndex--
        return this.currentRoute
      }
      return null
    },
    
    // 前进
    goForward() {
      if (this.canGoForward) {
        this.currentIndex++
        return this.currentRoute
      }
      return null
    },
    
    // 跳转到指定历史记录
    goToHistory(index: number) {
      if (index >= 0 && index < this.history.length) {
        this.currentIndex = index
        return this.currentRoute
      }
      return null
    },
    
    // 清除历史
    clearHistory() {
      this.history = []
      this.currentIndex = -1
    },
    
    // 移除指定路由
    removeRoute(path: string) {
      const index = this.history.findIndex(item => item.path === path)
      if (index !== -1) {
        this.history.splice(index, 1)
        if (this.currentIndex >= index) {
          this.currentIndex = Math.max(0, this.currentIndex - 1)
        }
      }
    }
  },
  
  persist: {
    key: 'route-history-store',
    storage: sessionStorage
  }
})
```

## 实践练习

### 练习 1：实现动态路由系统

1. 创建基于权限的动态路由配置
2. 实现路由守卫和权限验证
3. 开发动态菜单组件
4. 测试不同权限用户的路由访问

### 练习 2：优化路由性能

1. 实现智能懒加载策略
2. 配置代码分割优化
3. 添加路由预加载功能
4. 监控路由性能指标

### 练习 3：完善导航体验

1. 实现面包屑导航组件
2. 添加路由历史管理
3. 开发快速导航功能
4. 优化移动端路由体验

## 学习资源

* [Vue Router 官方文档](https://router.vuejs.org/)
* [Element Plus 导航组件](https://element-plus.org/zh-CN/component/menu.html)
* [Vue 3 异步组件](https://cn.vuejs.org/guide/components/async.html)
* [Vite 代码分割](https://vitejs.dev/guide/build.html#chunking-strategy)

## 作业

1. 完成所有实践练习
2. 设计一个完整的权限路由系统
3. 实现路由级别的性能监控
4. 编写路由最佳实践文档

## 下一步学习计划

接下来我们将学习 **Element Plus 与 Pinia 状态管理**，了解如何在 Element Plus 应用中实现高效的状态管理和数据流控制。