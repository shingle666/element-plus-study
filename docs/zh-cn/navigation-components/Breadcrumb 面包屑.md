# Breadcrumb 面包屑

## 学习目标

通过本章学习，你将掌握：
- 基础面包屑和面包屑分隔符的使用
- 面包屑路由集成和动态面包屑的实现
- 面包屑样式定制和事件处理机制
- 面包屑无障碍访问和最佳实践
- 复杂导航场景下的面包屑应用

**预计学习时间：** 90分钟

## 概述

Breadcrumb 面包屑组件用于显示当前页面的路径，帮助用户快速返回之前的任意页面。它是网站导航的重要组成部分，能够清晰地展示页面层级关系，提升用户的浏览体验。

### 主要特性

- **层级导航**：清晰展示页面层级结构
- **快速跳转**：支持点击任意层级进行页面跳转
- **灵活分隔符**：支持文字和图标分隔符
- **路由集成**：与 Vue Router 无缝集成
- **动态生成**：可根据路由信息自动生成面包屑
- **样式定制**：支持自定义样式和主题

### 适用场景

- 多层级的管理后台系统
- 电商网站的商品分类导航
- 文档站点的章节导航
- 复杂表单的步骤指引
- 文件系统的路径导航

## 基础用法

### 基础面包屑

在 `el-breadcrumb` 中使用 `el-breadcrumb-item` 标签表示从首页开始的每一级。该组件接受一个 String 类型的参数 `separator` 来作为分隔符。默认值为 '/'。<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

```vue
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <el-breadcrumb-item>活动详情</el-breadcrumb-item>
  </el-breadcrumb>
</template>
```

### 图标分隔符

通过设置 `separator-icon` 可使用相应的 iconfont 作为分隔符，注意这将使 `separator` 失效。<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

```vue
<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>应用中心</el-breadcrumb-item>
    <el-breadcrumb-item>应用列表</el-breadcrumb-item>
    <el-breadcrumb-item>某应用</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
</script>
```

### 路由跳转

配合 Vue Router 使用，实现页面跳转功能。

```vue
<template>
  <el-breadcrumb separator=">">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/user' }">用户管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/user/list' }">用户列表</el-breadcrumb-item>
    <el-breadcrumb-item>用户详情</el-breadcrumb-item>
  </el-breadcrumb>
</template>
```

### 自定义分隔符

使用不同的分隔符样式。

```vue
<template>
  <div>
    <!-- 默认分隔符 -->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>组件</el-breadcrumb-item>
      <el-breadcrumb-item>面包屑</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 自定义分隔符 -->
    <el-breadcrumb separator="|">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>组件</el-breadcrumb-item>
      <el-breadcrumb-item>面包屑</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 图标分隔符 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>组件</el-breadcrumb-item>
      <el-breadcrumb-item>面包屑</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
</script>
```

### 动态面包屑

根据路由动态生成面包屑导航。

```vue
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in breadcrumbList" 
      :key="index"
      :to="item.path"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    title: item.meta.title,
    path: item.path
  }))
})
</script>
```

## 实际应用示例

### 1. 电商网站商品导航

```vue
<template>
  <div class="product-navigation">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">
        <el-icon><House /></el-icon>
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/category' }">
        {{ categoryInfo.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item 
        v-if="subCategoryInfo"
        :to="{ path: `/category/${categoryInfo.id}` }"
      >
        {{ subCategoryInfo.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ productInfo.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 商品信息展示 -->
    <div class="product-info">
      <h1>{{ productInfo.name }}</h1>
      <p class="product-price">¥{{ productInfo.price }}</p>
      <p class="product-description">{{ productInfo.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, House } from '@element-plus/icons-vue'

const route = useRoute()

const categoryInfo = ref({
  id: 1,
  name: '电子产品'
})

const subCategoryInfo = ref({
  id: 11,
  name: '智能手机'
})

const productInfo = ref({
  id: 101,
  name: 'iPhone 15 Pro',
  price: 8999,
  description: '强大的 A17 Pro 芯片，钛金属设计'
})

// 根据路由参数获取商品信息
onMounted(async () => {
  const productId = route.params.id
  // 模拟 API 调用
  // const product = await fetchProduct(productId)
  // productInfo.value = product
})
</script>

<style scoped>
.product-navigation {
  padding: 20px;
  background: #f5f7fa;
}

.product-info {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-price {
  font-size: 24px;
  color: #e6a23c;
  font-weight: bold;
  margin: 10px 0;
}

.product-description {
  color: #606266;
  line-height: 1.6;
}
</style>
```

### 2. 管理后台系统导航

```vue
<template>
  <div class="admin-layout">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin' }">
          <el-icon><Monitor /></el-icon>
          控制台
        </el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(item, index) in breadcrumbItems" 
          :key="index"
          :to="index < breadcrumbItems.length - 1 ? item.path : undefined"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- 操作按钮 -->
      <div class="breadcrumb-actions">
        <el-button size="small" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button size="small" type="primary" @click="refresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>
    
    <!-- 页面内容 -->
    <div class="page-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Monitor, 
  User, 
  Setting, 
  ArrowLeft, 
  Refresh,
  Document,
  Goods
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 图标映射
const iconMap = {
  user: User,
  setting: Setting,
  document: Document,
  goods: Goods
}

// 动态生成面包屑
const breadcrumbItems = computed(() => {
  const matched = route.matched.slice(1) // 排除根路由
  return matched
    .filter(item => item.meta && item.meta.title)
    .map(item => ({
      title: item.meta.title,
      path: item.path,
      icon: item.meta.icon ? iconMap[item.meta.icon] : null
    }))
})

const goBack = () => {
  router.go(-1)
}

const refresh = () => {
  window.location.reload()
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f0f2f5;
}

.breadcrumb-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 16px;
}

.breadcrumb-actions {
  display: flex;
  gap: 8px;
}

.page-content {
  padding: 0 24px 24px;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 500;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
```

### 3. 文档站点章节导航

```vue
<template>
  <div class="doc-layout">
    <!-- 文档面包屑 -->
    <div class="doc-breadcrumb">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/docs' }">
          <el-icon><Document /></el-icon>
          文档
        </el-breadcrumb-item>
        <el-breadcrumb-item 
          v-for="(crumb, index) in documentBreadcrumbs"
          :key="index"
          :to="index < documentBreadcrumbs.length - 1 ? crumb.path : undefined"
        >
          {{ crumb.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      
      <!-- 文档元信息 -->
      <div class="doc-meta">
        <span class="update-time">更新时间：{{ updateTime }}</span>
        <span class="reading-time">预计阅读：{{ readingTime }}分钟</span>
      </div>
    </div>
    
    <!-- 文档内容 -->
    <div class="doc-content">
      <article class="markdown-body">
        <h1>{{ currentDoc.title }}</h1>
        <div v-html="currentDoc.content"></div>
      </article>
      
      <!-- 文档导航 -->
      <div class="doc-navigation">
        <el-button 
          v-if="prevDoc"
          @click="navigateToDoc(prevDoc)"
          class="nav-button prev"
        >
          <el-icon><ArrowLeft /></el-icon>
          {{ prevDoc.title }}
        </el-button>
        
        <el-button 
          v-if="nextDoc"
          @click="navigateToDoc(nextDoc)"
          class="nav-button next"
          type="primary"
        >
          {{ nextDoc.title }}
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowRight, 
  ArrowLeft, 
  Document 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const currentDoc = ref({
  title: 'Breadcrumb 面包屑组件',
  content: '<p>面包屑组件的详细使用说明...</p>',
  category: '导航组件',
  section: '基础组件'
})

const updateTime = ref('2024-01-15')
const readingTime = ref(8)

const prevDoc = ref({
  title: 'Anchor 锚点',
  path: '/docs/navigation/anchor'
})

const nextDoc = ref({
  title: 'Dropdown 下拉菜单',
  path: '/docs/navigation/dropdown'
})

// 文档面包屑
const documentBreadcrumbs = computed(() => {
  const breadcrumbs = []
  
  if (currentDoc.value.section) {
    breadcrumbs.push({
      title: currentDoc.value.section,
      path: `/docs/section/${currentDoc.value.section}`
    })
  }
  
  if (currentDoc.value.category) {
    breadcrumbs.push({
      title: currentDoc.value.category,
      path: `/docs/category/${currentDoc.value.category}`
    })
  }
  
  breadcrumbs.push({
    title: currentDoc.value.title,
    path: route.path
  })
  
  return breadcrumbs
})

const navigateToDoc = (doc) => {
  router.push(doc.path)
}

onMounted(() => {
  // 根据路由加载文档内容
  // loadDocumentContent(route.params.slug)
})
</script>

<style scoped>
.doc-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.doc-breadcrumb {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 24px;
}

.doc-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #909399;
}

.doc-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.markdown-body {
  line-height: 1.6;
  color: #303133;
}

.doc-navigation {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;
  border-top: 1px solid #e4e7ed;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 200px;
}

.nav-button.prev {
  margin-right: auto;
}

.nav-button.next {
  margin-left: auto;
}

@media (max-width: 768px) {
  .doc-breadcrumb {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .doc-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
```

## API

### Breadcrumb Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| separator | 分隔符 | string | / |
| separator-icon | 图标分隔符的组件或组件名 | string / Component | — |

<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

### Breadcrumb Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | Breadcrumb Item |

<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

### BreadcrumbItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| to | 路由跳转目标，同 vue-router 的 to 属性 | string / object | '' |
| replace | 如果设置该属性为 true, 导航将不会留下历史记录 | boolean | false |

<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

### BreadcrumbItem Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |

<mcreference link="https://element-plus.org/zh-CN/component/breadcrumb.html" index="3">3</mcreference>

## 最佳实践

### 1. 层级结构设计

```vue
<template>
  <!-- 良好的层级结构 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/products' }">商品管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/products/category' }">分类管理</el-breadcrumb-item>
    <el-breadcrumb-item>编辑分类</el-breadcrumb-item>
  </el-breadcrumb>
  
  <!-- 避免过深的层级 -->
  <el-breadcrumb separator="/" class="simplified-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>...</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/products/category' }">分类管理</el-breadcrumb-item>
    <el-breadcrumb-item>编辑分类</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.simplified-breadcrumb :deep(.el-breadcrumb__item:nth-child(2) .el-breadcrumb__inner) {
  color: #909399;
  cursor: default;
}
</style>
```

### 2. 响应式设计

```vue
<template>
  <div class="responsive-breadcrumb">
    <!-- 桌面端完整面包屑 -->
    <el-breadcrumb v-if="!isMobile" :separator-icon="ArrowRight">
      <el-breadcrumb-item 
        v-for="(item, index) in breadcrumbItems" 
        :key="index"
        :to="item.path"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 移动端简化面包屑 -->
    <div v-else class="mobile-breadcrumb">
      <el-button 
        size="small" 
        @click="goBack"
        class="back-button"
      >
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <span class="current-page">{{ currentPageTitle }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const isMobile = ref(false)

const breadcrumbItems = ref([
  { title: '首页', path: '/' },
  { title: '商品管理', path: '/products' },
  { title: '商品列表', path: '/products/list' },
  { title: '商品详情', path: null }
])

const currentPageTitle = computed(() => {
  return breadcrumbItems.value[breadcrumbItems.value.length - 1]?.title
})

const checkDevice = () => {
  isMobile.value = window.innerWidth < 768
}

const goBack = () => {
  router.go(-1)
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
.responsive-breadcrumb {
  padding: 12px 0;
}

.mobile-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  border: none;
  background: transparent;
  color: #409eff;
}

.current-page {
  font-weight: 500;
  color: #303133;
}
</style>
```

### 3. 动态面包屑生成

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 路由配置示例
const routeConfig = {
  '/': { title: '首页', icon: 'House' },
  '/admin': { title: '管理后台', icon: 'Setting' },
  '/admin/users': { title: '用户管理', icon: 'User' },
  '/admin/users/list': { title: '用户列表' },
  '/admin/users/detail': { title: '用户详情' }
}

// 自动生成面包屑
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const items = [{ title: '首页', path: '/', icon: 'House' }]
  
  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const config = routeConfig[currentPath]
    if (config) {
      items.push({
        title: config.title,
        path: currentPath,
        icon: config.icon
      })
    }
  })
  
  return items
})

// 处理动态路由参数
const enhancedBreadcrumbs = computed(() => {
  return breadcrumbItems.value.map(item => {
    // 替换动态参数
    if (item.title.includes(':')) {
      const paramName = item.title.replace(':', '')
      const paramValue = route.params[paramName]
      return {
        ...item,
        title: paramValue || item.title
      }
    }
    return item
  })
})
</script>
```

### 4. 权限控制

```vue
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in accessibleBreadcrumbs" 
      :key="index"
      :to="item.clickable ? item.path : undefined"
      :class="{ 'disabled': !item.clickable }"
    >
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const breadcrumbItems = ref([
  { title: '首页', path: '/', permission: null },
  { title: '管理后台', path: '/admin', permission: 'admin' },
  { title: '用户管理', path: '/admin/users', permission: 'user:read' },
  { title: '用户详情', path: null, permission: 'user:detail' }
])

// 根据权限过滤面包屑
const accessibleBreadcrumbs = computed(() => {
  return breadcrumbItems.value
    .filter(item => {
      if (!item.permission) return true
      return userStore.hasPermission(item.permission)
    })
    .map(item => ({
      ...item,
      clickable: item.path && userStore.hasPermission(item.permission || 'public')
    }))
})
</script>

<style scoped>
.disabled :deep(.el-breadcrumb__inner) {
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
```

### 5. 性能优化

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumbCache = new Map()

// 缓存面包屑数据
const getCachedBreadcrumb = (path) => {
  if (breadcrumbCache.has(path)) {
    return breadcrumbCache.get(path)
  }
  
  const breadcrumb = generateBreadcrumb(path)
  breadcrumbCache.set(path, breadcrumb)
  return breadcrumb
}

// 防抖处理路由变化
let routeChangeTimer = null
const debouncedUpdateBreadcrumb = () => {
  clearTimeout(routeChangeTimer)
  routeChangeTimer = setTimeout(() => {
    currentBreadcrumb.value = getCachedBreadcrumb(route.path)
  }, 100)
}

watch(() => route.path, debouncedUpdateBreadcrumb, { immediate: true })
</script>
```

## 常见问题

### Q: 面包屑导航不显示？
A: 检查是否正确使用了 `el-breadcrumb` 和 `el-breadcrumb-item` 组件，确保组件嵌套关系正确。

### Q: 如何实现面包屑的路由跳转？
A: 在 `el-breadcrumb-item` 上使用 `to` 属性，配合 Vue Router 实现页面跳转功能。

### Q: 图标分隔符和文字分隔符能同时使用吗？
A: 不能，设置了 `separator-icon` 后，`separator` 属性将失效，只能使用其中一种分隔符。

### Q: 如何根据路由自动生成面包屑？
A: 可以通过监听路由变化，结合路由的 meta 信息动态生成面包屑数据，参考上面的动态面包屑示例。

## 实践项目

### 面包屑导航

创建一个完整的面包屑导航系统，包含以下功能：

1. **动态面包屑**
   - 根据路由自动生成
   - 支持多级页面导航
   - 实时更新面包屑路径

2. **面包屑样式定制**
   - 自定义分隔符样式
   - 图标分隔符支持
   - 响应式布局适配

3. **面包屑事件处理**
   - 点击跳转功能
   - 路由历史管理
   - 权限验证集成

### 实践要点

- 设计合理的面包屑层级结构
- 实现面包屑的动态生成机制
- 处理面包屑的样式定制
- 优化面包屑的用户体验

## 学习检查清单

- [ ] 掌握基础面包屑的使用
- [ ] 理解面包屑分隔符的设置
- [ ] 熟练配置面包屑路由集成
- [ ] 掌握动态面包屑的实现
- [ ] 理解面包屑样式定制方法
- [ ] 完成面包屑导航的实践项目

## 注意事项

1. **导航的层级结构**
   - 面包屑应反映真实的页面层级关系
   - 避免面包屑层级过深或过浅
   - 保持面包屑路径的逻辑性

2. **用户操作的一致性**
   - 除当前页面外，其他层级都应可点击
   - 面包屑的交互行为要统一
   - 提供清晰的视觉反馈

3. **移动端的适配**
   - 在小屏幕设备上简化面包屑显示
   - 考虑使用省略号处理长路径
   - 优化触摸操作体验

4. **导航的可访问性**
   - 确保面包屑支持键盘导航
   - 提供合适的语义化标签
   - 考虑屏幕阅读器的兼容性

## 总结

Breadcrumb 面包屑组件是网站导航的重要组成部分，支持：

- **清晰的层级展示**：帮助用户理解当前页面在网站中的位置
- **快速导航跳转**：支持点击任意层级进行页面跳转
- **灵活的分隔符配置**：支持文字和图标分隔符
- **路由系统集成**：与 Vue Router 无缝配合
- **动态内容生成**：可根据路由信息自动生成面包屑
- **响应式适配**：在不同设备上提供最佳的用户体验

掌握 Breadcrumb 组件的使用，能够为用户提供清晰的导航体验，特别适用于多层级的管理系统、电商网站和文档站点等场景。

## 参考资料

- [Element Plus Breadcrumb 官方文档](https://element-plus.org/zh-CN/component/breadcrumb.html)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [Web 无障碍访问指南 - 导航](https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html)
- [用户体验设计 - 面包屑导航最佳实践](https://www.nngroup.com/articles/breadcrumbs/)

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**