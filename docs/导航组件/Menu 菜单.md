# Menu 菜单

## 概述

Menu 菜单是网站导航的核心组件，为用户提供清晰的页面结构和快速的导航功能。它支持垂直和水平两种布局模式，可以构建多层级的导航结构，并与 Vue Router 无缝集成，是构建现代 Web 应用不可或缺的组件。

### 主要特性
- **多种布局模式**：支持垂直和水平菜单布局
- **多层级结构**：支持无限层级的子菜单嵌套
- **折叠功能**：垂直菜单支持折叠收起，节省空间
- **路由集成**：与 Vue Router 深度集成，实现导航联动
- **主题定制**：支持自定义颜色、图标和样式
- **响应式设计**：适配不同屏幕尺寸和设备
- **权限控制**：支持菜单项的禁用和动态显示

### 适用场景
- **管理后台**：构建复杂的后台管理系统导航
- **网站导航**：实现网站的主导航和子导航
- **移动应用**：创建移动端的侧边栏菜单
- **文档站点**：构建文档的章节导航
- **电商平台**：实现商品分类导航

## 学习目标

通过本章学习，你将掌握：

### 基础知识
- Menu 组件的基本结构和属性
- 垂直和水平菜单的创建方法
- 子菜单和菜单分组的使用
- 菜单项的状态管理和事件处理

### 进阶技能
- 菜单与 Vue Router 的集成
- 动态菜单的生成和权限控制
- 菜单主题的自定义和样式优化
- 响应式菜单的设计和实现

### 实战应用
- 构建完整的管理系统导航
- 实现菜单的折叠和展开功能
- 处理菜单的权限验证和动态显示
- 优化菜单的用户体验和性能

**预计学习时间：** 120分钟

## 基础用法

### 顶栏

顶部栏菜单可以在各种场景中使用。导航菜单默认为垂直模式，通过将 `mode` 属性设置为 `horizontal` 来使导航菜单变更为水平模式。另外，在菜单中通过 `sub-menu` 组件可以生成二级菜单。Menu 还提供了 `background-color`、`text-color` 和 `active-text-color`，分别用于设置菜单的背景色、菜单的文字颜色和当前激活菜单的文字颜色。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-sub-menu index="2">
      <template #title>我的工作台</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>选项4</template>
        <el-menu-item index="2-4-1">选项1</el-menu-item>
        <el-menu-item index="2-4-2">选项2</el-menu-item>
        <el-menu-item index="2-4-3">选项3</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>消息中心</el-menu-item>
    <el-menu-item index="4">订单管理</el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

### 侧栏

垂直菜单，可内嵌子菜单。通过 `el-menu-item-group` 组件可以实现菜单进行分组，分组名可以通过 `title` 属性直接设定，也可以通过具名 slot 来设定。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-row class="tac">
    <el-col :span="12">
      <h5>默认颜色</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>导航一</span>
          </template>
          <el-menu-item-group title="分组一">
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>导航二</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <el-icon><document /></el-icon>
          <span>导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><setting /></el-icon>
          <span>导航四</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

### 折叠

垂直导航菜单可以被折叠。<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

```vue
<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">展开</el-radio-button>
    <el-radio-button :label="true">收起</el-radio-button>
  </el-radio-group>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template #title><span>分组一</span></template>
        <el-menu-item index="1-1">选项1</el-menu-item>
        <el-menu-item index="1-2">选项2</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>选项4</template>
        <el-menu-item index="1-4-1">选项1</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <template #title>导航二</template>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><document /></el-icon>
      <template #title>导航三</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
```

## 实际应用示例

### 1. 管理后台导航系统

```vue
<template>
  <div class="admin-layout">
    <!-- 侧边栏菜单 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <img src="/logo.png" alt="Logo" v-if="!isCollapsed" />
        <img src="/logo-mini.png" alt="Logo" v-else />
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        @select="handleMenuSelect"
      >
        <!-- 仪表盘 -->
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <!-- 用户管理 -->
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item index="/user/list">
            <el-icon><List /></el-icon>
            <template #title>用户列表</template>
          </el-menu-item>
          <el-menu-item index="/user/roles">
            <el-icon><UserFilled /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/user/permissions">
            <el-icon><Key /></el-icon>
            <template #title>权限管理</template>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 内容管理 -->
        <el-sub-menu index="/content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/content/articles">
            <el-icon><EditPen /></el-icon>
            <template #title>文章管理</template>
          </el-menu-item>
          <el-menu-item index="/content/categories">
            <el-icon><Collection /></el-icon>
            <template #title>分类管理</template>
          </el-menu-item>
          <el-menu-item index="/content/tags">
            <el-icon><PriceTag /></el-icon>
            <template #title>标签管理</template>
          </el-menu-item>
        </el-sub-menu>
        
        <!-- 系统设置 -->
        <el-sub-menu index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/system/config">
            <el-icon><Tools /></el-icon>
            <template #title>系统配置</template>
          </el-menu-item>
          <el-menu-item index="/system/logs">
            <el-icon><Document /></el-icon>
            <template #title>系统日志</template>
          </el-menu-item>
          <el-menu-item index="/system/backup">
            <el-icon><FolderOpened /></el-icon>
            <template #title>数据备份</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="main-content">
      <div class="header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item 
            v-for="item in breadcrumbs" 
            :key="item.path"
            :to="item.path"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer,
  User,
  UserFilled,
  Key,
  Document,
  EditPen,
  Collection,
  PriceTag,
  Setting,
  Tools,
  FolderOpened,
  List,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const isCollapsed = ref(false)
const activeMenu = ref('/dashboard')

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title
  }))
})

// 监听路由变化，更新激活菜单
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
  { immediate: true }
)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleMenuSelect = (index) => {
  console.log('选择菜单:', index)
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  background-color: #304156;
  transition: width 0.3s;
  position: relative;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #434a50;
}

.logo img {
  height: 32px;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: #66b1ff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f5f5f5;
  overflow-y: auto;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #409eff !important;
}
</style>
```

### 2. 电商网站导航

```vue
<template>
  <div class="ecommerce-nav">
    <!-- 顶部导航 -->
    <div class="top-nav">
      <div class="container">
        <div class="logo">
          <img src="/ecommerce-logo.png" alt="商城" />
        </div>
        
        <el-menu
          mode="horizontal"
          :default-active="activeIndex"
          class="main-menu"
          @select="handleSelect"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            首页
          </el-menu-item>
          
          <!-- 商品分类 -->
          <el-sub-menu index="/products">
            <template #title>
              <el-icon><Goods /></el-icon>
              商品分类
            </template>
            
            <el-menu-item-group title="数码电器">
              <el-menu-item index="/products/phones">手机通讯</el-menu-item>
              <el-menu-item index="/products/computers">电脑办公</el-menu-item>
              <el-menu-item index="/products/appliances">家用电器</el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="服装配饰">
              <el-menu-item index="/products/clothing">服装服饰</el-menu-item>
              <el-menu-item index="/products/shoes">鞋靴箱包</el-menu-item>
              <el-menu-item index="/products/jewelry">珠宝首饰</el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="生活用品">
              <el-menu-item index="/products/home">家居用品</el-menu-item>
              <el-menu-item index="/products/beauty">美妆个护</el-menu-item>
              <el-menu-item index="/products/sports">运动户外</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          
          <!-- 品牌专区 -->
          <el-sub-menu index="/brands">
            <template #title>
              <el-icon><Star /></el-icon>
              品牌专区
            </template>
            <el-menu-item index="/brands/apple">Apple</el-menu-item>
            <el-menu-item index="/brands/samsung">Samsung</el-menu-item>
            <el-menu-item index="/brands/huawei">华为</el-menu-item>
            <el-menu-item index="/brands/xiaomi">小米</el-menu-item>
            <el-menu-item index="/brands/nike">Nike</el-menu-item>
            <el-menu-item index="/brands/adidas">Adidas</el-menu-item>
          </el-sub-menu>
          
          <!-- 促销活动 -->
          <el-menu-item index="/promotions">
            <el-icon><Present /></el-icon>
            促销活动
          </el-menu-item>
          
          <!-- 客户服务 -->
          <el-sub-menu index="/service">
            <template #title>
              <el-icon><Service /></el-icon>
              客户服务
            </template>
            <el-menu-item index="/service/help">帮助中心</el-menu-item>
            <el-menu-item index="/service/contact">联系我们</el-menu-item>
            <el-menu-item index="/service/feedback">意见反馈</el-menu-item>
            <el-menu-item index="/service/returns">退换货</el-menu-item>
          </el-sub-menu>
        </el-menu>
        
        <!-- 用户操作区 -->
        <div class="user-actions">
          <el-button type="text" @click="goToCart">
            <el-icon><ShoppingCart /></el-icon>
            购物车 ({{ cartCount }})
          </el-button>
          <el-button type="text" @click="goToProfile">
            <el-icon><User /></el-icon>
            我的账户
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div class="mobile-nav" v-if="isMobile">
      <el-drawer v-model="drawerVisible" direction="ltr" size="280px">
        <template #header>
          <h3>导航菜单</h3>
        </template>
        
        <el-menu
          :default-active="activeIndex"
          class="mobile-menu"
          @select="handleMobileSelect"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          
          <el-sub-menu index="/products">
            <template #title>
              <el-icon><Goods /></el-icon>
              <span>商品分类</span>
            </template>
            <el-menu-item index="/products/phones">手机通讯</el-menu-item>
            <el-menu-item index="/products/computers">电脑办公</el-menu-item>
            <el-menu-item index="/products/clothing">服装服饰</el-menu-item>
            <el-menu-item index="/products/home">家居用品</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/promotions">
            <el-icon><Present /></el-icon>
            <template #title>促销活动</template>
          </el-menu-item>
          
          <el-menu-item index="/service">
            <el-icon><Service /></el-icon>
            <template #title>客户服务</template>
          </el-menu-item>
        </el-menu>
      </el-drawer>
      
      <el-button @click="drawerVisible = true" class="menu-trigger">
        <el-icon><Menu /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  House,
  Goods,
  Star,
  Present,
  Service,
  ShoppingCart,
  User,
  Menu
} from '@element-plus/icons-vue'

const router = useRouter()

const activeIndex = ref('/')
const cartCount = ref(3)
const isMobile = ref(false)
const drawerVisible = ref(false)

// 检测设备类型
const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleSelect = (key, keyPath) => {
  console.log('选择菜单:', key, keyPath)
  router.push(key)
}

const handleMobileSelect = (key) => {
  handleSelect(key)
  drawerVisible.value = false
}

const goToCart = () => {
  router.push('/cart')
}

const goToProfile = () => {
  router.push('/profile')
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
.ecommerce-nav {
  position: relative;
}

.top-nav {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.logo {
  margin-right: 40px;
}

.logo img {
  height: 40px;
}

.main-menu {
  flex: 1;
}

.user-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.mobile-nav {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.menu-trigger {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  border: none;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal .el-menu-item) {
  height: 60px;
  line-height: 60px;
}

:deep(.el-menu--horizontal .el-sub-menu__title) {
  height: 60px;
  line-height: 60px;
}

:deep(.mobile-menu .el-menu-item),
:deep(.mobile-menu .el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

@media (max-width: 768px) {
  .top-nav {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}
</style>
```

### 3. 文档导航系统

```vue
<template>
  <div class="docs-layout">
    <!-- 侧边栏导航 -->
    <div class="docs-sidebar">
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文档..."
          prefix-icon="Search"
          @input="handleSearch"
        />
      </div>
      
      <el-menu
        :default-active="activeDoc"
        :default-openeds="defaultOpeneds"
        router
        class="docs-menu"
        @select="handleDocSelect"
      >
        <!-- 快速开始 -->
        <el-sub-menu index="/docs/getting-started">
          <template #title>
            <el-icon><Rocket /></el-icon>
            <span>快速开始</span>
          </template>
          <el-menu-item index="/docs/installation">安装</el-menu-item>
          <el-menu-item index="/docs/quickstart">快速上手</el-menu-item>
          <el-menu-item index="/docs/examples">示例</el-menu-item>
        </el-sub-menu>
        
        <!-- 基础组件 -->
        <el-sub-menu index="/docs/basic">
          <template #title>
            <el-icon><Grid /></el-icon>
            <span>基础组件</span>
          </template>
          <el-menu-item index="/docs/button">Button 按钮</el-menu-item>
          <el-menu-item index="/docs/icon">Icon 图标</el-menu-item>
          <el-menu-item index="/docs/link">Link 链接</el-menu-item>
          <el-menu-item index="/docs/text">Text 文本</el-menu-item>
        </el-sub-menu>
        
        <!-- 表单组件 -->
        <el-sub-menu index="/docs/form">
          <template #title>
            <el-icon><Edit /></el-icon>
            <span>表单组件</span>
          </template>
          <el-menu-item index="/docs/input">Input 输入框</el-menu-item>
          <el-menu-item index="/docs/select">Select 选择器</el-menu-item>
          <el-menu-item index="/docs/checkbox">Checkbox 多选框</el-menu-item>
          <el-menu-item index="/docs/radio">Radio 单选框</el-menu-item>
          <el-menu-item index="/docs/form">Form 表单</el-menu-item>
        </el-sub-menu>
        
        <!-- 数据展示 -->
        <el-sub-menu index="/docs/data">
          <template #title>
            <el-icon><DataBoard /></el-icon>
            <span>数据展示</span>
          </template>
          <el-menu-item index="/docs/table">Table 表格</el-menu-item>
          <el-menu-item index="/docs/pagination">Pagination 分页</el-menu-item>
          <el-menu-item index="/docs/tree">Tree 树形控件</el-menu-item>
          <el-menu-item index="/docs/card">Card 卡片</el-menu-item>
        </el-sub-menu>
        
        <!-- 导航组件 -->
        <el-sub-menu index="/docs/navigation">
          <template #title>
            <el-icon><Guide /></el-icon>
            <span>导航组件</span>
          </template>
          <el-menu-item index="/docs/menu">Menu 菜单</el-menu-item>
          <el-menu-item index="/docs/breadcrumb">Breadcrumb 面包屑</el-menu-item>
          <el-menu-item index="/docs/tabs">Tabs 标签页</el-menu-item>
          <el-menu-item index="/docs/steps">Steps 步骤条</el-menu-item>
        </el-sub-menu>
        
        <!-- 反馈组件 -->
        <el-sub-menu index="/docs/feedback">
          <template #title>
            <el-icon><Bell /></el-icon>
            <span>反馈组件</span>
          </template>
          <el-menu-item index="/docs/alert">Alert 提示</el-menu-item>
          <el-menu-item index="/docs/message">Message 消息提示</el-menu-item>
          <el-menu-item index="/docs/notification">Notification 通知</el-menu-item>
          <el-menu-item index="/docs/loading">Loading 加载</el-menu-item>
        </el-sub-menu>
        
        <!-- 高级指南 -->
        <el-sub-menu index="/docs/advanced">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>高级指南</span>
          </template>
          <el-menu-item index="/docs/theme">主题定制</el-menu-item>
          <el-menu-item index="/docs/i18n">国际化</el-menu-item>
          <el-menu-item index="/docs/typescript">TypeScript</el-menu-item>
          <el-menu-item index="/docs/ssr">服务端渲染</el-menu-item>
        </el-sub-menu>
      </el-menu>
      
      <!-- 版本信息 -->
      <div class="version-info">
        <el-tag size="small" type="info">v2.4.0</el-tag>
        <el-link href="/changelog" type="primary" size="small">
          更新日志
        </el-link>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="docs-content">
      <div class="content-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item to="/docs">文档</el-breadcrumb-item>
          <el-breadcrumb-item 
            v-for="crumb in breadcrumbs" 
            :key="crumb.path"
            :to="crumb.path"
          >
            {{ crumb.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        
        <div class="content-actions">
          <el-button size="small" @click="toggleToc">
            <el-icon><List /></el-icon>
            目录
          </el-button>
          <el-button size="small" @click="editPage">
            <el-icon><Edit /></el-icon>
            编辑页面
          </el-button>
        </div>
      </div>
      
      <div class="content-body">
        <router-view />
      </div>
      
      <!-- 页面导航 -->
      <div class="page-nav">
        <el-button 
          v-if="prevPage" 
          @click="goToPage(prevPage.path)"
          class="prev-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
          {{ prevPage.title }}
        </el-button>
        <el-button 
          v-if="nextPage" 
          @click="goToPage(nextPage.path)"
          class="next-btn"
          type="primary"
        >
          {{ nextPage.title }}
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>
    
    <!-- 目录侧边栏 -->
    <div class="toc-sidebar" v-if="showToc">
      <h4>目录</h4>
      <ul class="toc-list">
        <li v-for="item in tocItems" :key="item.id">
          <a :href="`#${item.id}`" :class="{ active: item.id === activeAnchor }">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Rocket,
  Grid,
  Edit,
  DataBoard,
  Guide,
  Bell,
  TrendCharts,
  List,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeDoc = ref('/docs/installation')
const defaultOpeneds = ref(['/docs/getting-started', '/docs/basic'])
const searchKeyword = ref('')
const showToc = ref(true)
const activeAnchor = ref('')

// 模拟文档数据
const docsData = {
  '/docs/installation': { title: '安装', prev: null, next: '/docs/quickstart' },
  '/docs/quickstart': { title: '快速上手', prev: '/docs/installation', next: '/docs/button' },
  '/docs/button': { title: 'Button 按钮', prev: '/docs/quickstart', next: '/docs/icon' },
  '/docs/icon': { title: 'Icon 图标', prev: '/docs/button', next: '/docs/input' }
}

// 面包屑导航
const breadcrumbs = computed(() => {
  const path = route.path
  const segments = path.split('/').filter(Boolean)
  const crumbs = []
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    if (index > 0) { // 跳过 'docs'
      crumbs.push({
        path: currentPath,
        title: segment.charAt(0).toUpperCase() + segment.slice(1)
      })
    }
  })
  
  return crumbs
})

// 上一页和下一页
const prevPage = computed(() => {
  const current = docsData[route.path]
  return current?.prev ? {
    path: current.prev,
    title: docsData[current.prev]?.title
  } : null
})

const nextPage = computed(() => {
  const current = docsData[route.path]
  return current?.next ? {
    path: current.next,
    title: docsData[current.next]?.title
  } : null
})

// 目录项
const tocItems = ref([
  { id: 'overview', title: '概述' },
  { id: 'basic-usage', title: '基础用法' },
  { id: 'api', title: 'API' },
  { id: 'examples', title: '示例' }
])

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeDoc.value = newPath
  },
  { immediate: true }
)

const handleDocSelect = (index) => {
  console.log('选择文档:', index)
}

const handleSearch = (keyword) => {
  console.log('搜索:', keyword)
  // 实现搜索逻辑
}

const toggleToc = () => {
  showToc.value = !showToc.value
}

const editPage = () => {
  window.open(`https://github.com/example/docs/edit/main${route.path}.md`)
}

const goToPage = (path) => {
  router.push(path)
}
</script>

<style scoped>
.docs-layout {
  display: flex;
  height: 100vh;
}

.docs-sidebar {
  width: 280px;
  background: #fafafa;
  border-right: 1px solid #e6e6e6;
  display: flex;
  flex-direction: column;
}

.search-box {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.docs-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
}

.version-info {
  padding: 16px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.docs-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  height: 60px;
  padding: 0 24px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.content-actions {
  display: flex;
  gap: 8px;
}

.content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
}

.page-nav {
  padding: 24px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  background: white;
}

.prev-btn {
  margin-right: auto;
}

.next-btn {
  margin-left: auto;
}

.toc-sidebar {
  width: 200px;
  background: #fafafa;
  border-left: 1px solid #e6e6e6;
  padding: 24px 16px;
}

.toc-sidebar h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 8px;
}

.toc-list a {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  line-height: 1.5;
  display: block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.toc-list a:hover,
.toc-list a.active {
  color: #409eff;
  background: #ecf5ff;
}

:deep(.docs-menu .el-menu-item),
:deep(.docs-menu .el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

:deep(.docs-menu .el-menu-item) {
  padding-left: 40px !important;
}
</style>
```

## API

### Menu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| mode | 菜单展示模式 | enum | vertical |
| collapse | 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） | boolean | false |
| ellipsis | 是否省略多余的子项（仅在横向模式生效） | boolean | true |
| ellipsis-icon | 自定义省略图标 (仅在水平模式下可用) | string / Component | — |
| popper-offset | 弹出层的偏移量(对所有子菜单有效) | number | 6 |
| default-active | 页面加载时默认激活菜单的 index | string | '' |
| default-openeds | 默认打开的 sub-menu 的 index 的数组 | object[] | [] |
| unique-opened | 是否只保持一个子菜单的展开 | boolean | false |
| menu-trigger | 子菜单打开的触发方式，只在 mode 为 horizontal 时有效 | enum | hover |
| router | 是否启用 vue-router 模式 | boolean | false |
| collapse-transition | 是否开启折叠动画 | boolean | true |
| popper-effect | Tooltip 主题，内置了 dark / light 两种主题，当菜单折叠时生效 | enum / string | dark |
| close-on-click-outside | 可选，单击外部时是否折叠菜单 | boolean | false |
| popper-class | 为 popper 添加类名 | string | — |
| show-timeout | 菜单出现前的延迟 | number | 300 |
| hide-timeout | 菜单消失前的延迟 | number | 300 |
| background-color | 菜单的背景颜色 (十六进制格式) | string | #ffffff |
| text-color | 菜单的文字颜色 (十六进制格式) | string | #303133 |
| active-text-color | 活动菜单项的文本颜色（十六进制格式） | string | #409eff |
| persistent | 当菜单处于非活动状态且 persistent 为 false 时，下拉菜单将被销毁 | boolean | true |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| select | 菜单激活回调 | Function |
| open | sub-menu 展开的回调 | Function |
| close | sub-menu 收起的回调 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu Methods

| 方法名 | 说明 | 类型 |
|--------|------|------|
| open | 打开一个特定的子菜单，参数是要打开的子菜单的索引 | Function |
| close | 关闭一个特定的子菜单，参数是要关闭子菜单的索引 | Function |
| updateActiveIndex | 通过索引激活指定菜单 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### SubMenu Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| index | 唯一标志 | string | — |
| popper-class | 为 popper 添加类名 | string | — |
| show-timeout | 子菜单出现之前的延迟 | number | — |
| hide-timeout | 子菜单消失之前的延迟 | number | — |
| disabled | 是否禁用 | boolean | false |
| teleported | 是否将弹出菜单挂载到 body 上 | boolean | undefined |
| popper-offset | 弹出窗口的偏移量 | number | — |
| expand-close-icon | 父菜单展开且子菜单关闭时的图标 | string / Component | — |
| expand-open-icon | 父菜单展开且子菜单打开时的图标 | string / Component | — |
| collapse-close-icon | 父菜单收起且子菜单关闭时的图标 | string / Component | — |
| collapse-open-icon | 父菜单收起且子菜单打开时的图标 | string / Component | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### SubMenu Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | SubMenu / Menu-Item / Menu-Item-Group |
| title | 自定义标题内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| index | 唯一标志 | string | — |
| route | Vue Route 路由位置参数 | string / object | — |
| disabled | 是否禁用 | boolean | false |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| click | 点击菜单项时回调函数, 参数为菜单项实例 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |
| title | 自定义标题内容 |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item-Group Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 组标题 | string | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

### Menu-Item-Group Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 默认插槽内容 | Menu-Item |
| title | 自定义组标题内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/menu.html" index="1">1</mcreference>

## 最佳实践

### 1. 菜单结构设计

#### 层级控制
```vue
<template>
  <!-- 推荐：不超过3级的菜单结构 -->
  <el-menu>
    <!-- 一级菜单 -->
    <el-sub-menu index="/system">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </template>
      
      <!-- 二级菜单 -->
      <el-sub-menu index="/system/user">
        <template #title>用户管理</template>
        
        <!-- 三级菜单（最深层级） -->
        <el-menu-item index="/system/user/list">用户列表</el-menu-item>
        <el-menu-item index="/system/user/roles">角色管理</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/system/config">系统配置</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
```

#### 功能分组
```vue
<template>
  <el-menu>
    <!-- 核心功能组 -->
    <el-menu-item-group title="核心功能">
      <el-menu-item index="/dashboard">仪表盘</el-menu-item>
      <el-menu-item index="/workspace">工作台</el-menu-item>
    </el-menu-item-group>
    
    <!-- 业务管理组 -->
    <el-menu-item-group title="业务管理">
      <el-sub-menu index="/business">
        <template #title>业务模块</template>
        <el-menu-item index="/business/orders">订单管理</el-menu-item>
        <el-menu-item index="/business/products">商品管理</el-menu-item>
      </el-sub-menu>
    </el-menu-item-group>
    
    <!-- 系统设置组 -->
    <el-menu-item-group title="系统设置">
      <el-menu-item index="/settings">基础设置</el-menu-item>
      <el-menu-item index="/logs">系统日志</el-menu-item>
    </el-menu-item-group>
  </el-menu>
</template>
```

### 2. 响应式设计

#### 自适应布局
```vue
<template>
  <div class="responsive-menu">
    <!-- 桌面端菜单 -->
    <el-menu 
      v-if="!isMobile"
      :mode="menuMode"
      :collapse="isCollapsed"
      class="desktop-menu"
    >
      <!-- 菜单项 -->
    </el-menu>
    
    <!-- 移动端菜单 -->
    <div v-else class="mobile-menu">
      <el-button @click="drawerVisible = true" class="menu-trigger">
        <el-icon><Menu /></el-icon>
      </el-button>
      
      <el-drawer v-model="drawerVisible" direction="ltr">
        <el-menu>
          <!-- 移动端菜单项 -->
        </el-menu>
      </el-drawer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)
const isCollapsed = ref(false)
const drawerVisible = ref(false)

// 响应式菜单模式
const menuMode = computed(() => {
  return window.innerWidth > 1200 ? 'vertical' : 'horizontal'
})

// 检测设备类型
const checkDevice = () => {
  const width = window.innerWidth
  isMobile.value = width <= 768
  
  // 平板设备自动折叠菜单
  if (width <= 1024 && width > 768) {
    isCollapsed.value = true
  }
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
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-menu {
    display: none;
  }
}

.menu-trigger {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
```

### 3. 权限控制

#### 基于角色的菜单显示
```vue
<template>
  <el-menu>
    <template v-for="item in filteredMenus" :key="item.index">
      <!-- 有子菜单 -->
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        
        <template v-for="child in item.children" :key="child.index">
          <el-menu-item 
            v-if="hasPermission(child.permission)"
            :index="child.index"
          >
            {{ child.title }}
          </el-menu-item>
        </template>
      </el-sub-menu>
      
      <!-- 单个菜单项 -->
      <el-menu-item 
        v-else-if="hasPermission(item.permission)"
        :index="item.index"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 菜单配置
const menuConfig = [
  {
    index: '/dashboard',
    title: '仪表盘',
    icon: 'Odometer',
    permission: 'dashboard:view'
  },
  {
    index: '/user',
    title: '用户管理',
    icon: 'User',
    permission: 'user:manage',
    children: [
      {
        index: '/user/list',
        title: '用户列表',
        permission: 'user:list'
      },
      {
        index: '/user/roles',
        title: '角色管理',
        permission: 'user:roles'
      }
    ]
  },
  {
    index: '/system',
    title: '系统设置',
    icon: 'Setting',
    permission: 'system:manage',
    children: [
      {
        index: '/system/config',
        title: '系统配置',
        permission: 'system:config'
      }
    ]
  }
]

// 权限检查
const hasPermission = (permission) => {
  if (!permission) return true
  return userStore.permissions.includes(permission)
}

// 过滤有权限的菜单
const filteredMenus = computed(() => {
  return menuConfig.filter(item => {
    if (!hasPermission(item.permission)) return false
    
    // 过滤子菜单
    if (item.children) {
      item.children = item.children.filter(child => 
        hasPermission(child.permission)
      )
      // 如果子菜单全部被过滤，则隐藏父菜单
      return item.children.length > 0
    }
    
    return true
  })
})
</script>
```

### 4. 性能优化

#### 菜单懒加载
```vue
<template>
  <el-menu @open="handleSubMenuOpen">
    <el-sub-menu 
      v-for="item in menuItems" 
      :key="item.index"
      :index="item.index"
    >
      <template #title>
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </template>
      
      <!-- 懒加载子菜单 -->
      <template v-if="loadedMenus.includes(item.index)">
        <el-menu-item 
          v-for="child in item.children" 
          :key="child.index"
          :index="child.index"
        >
          {{ child.title }}
        </el-menu-item>
      </template>
      
      <!-- 加载中状态 -->
      <div v-else-if="loadingMenus.includes(item.index)" class="menu-loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const loadedMenus = ref([])
const loadingMenus = ref([])

// 异步加载子菜单
const handleSubMenuOpen = async (index) => {
  if (loadedMenus.value.includes(index)) return
  
  loadingMenus.value.push(index)
  
  try {
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 加载子菜单数据
    await loadSubMenuData(index)
    
    loadedMenus.value.push(index)
  } catch (error) {
    console.error('加载菜单失败:', error)
  } finally {
    const loadingIndex = loadingMenus.value.indexOf(index)
    if (loadingIndex > -1) {
      loadingMenus.value.splice(loadingIndex, 1)
    }
  }
}

const loadSubMenuData = async (menuIndex) => {
  // 实际的数据加载逻辑
  const response = await fetch(`/api/menus/${menuIndex}/children`)
  const data = await response.json()
  // 更新菜单数据
}
</script>

<style scoped>
.menu-loading {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 12px;
}
</style>
```

#### 菜单状态缓存
```vue
<script setup>
import { ref, watch, onMounted } from 'vue'

const activeMenu = ref('')
const openedMenus = ref([])

// 缓存菜单状态
const MENU_STATE_KEY = 'menu-state'

// 保存菜单状态
const saveMenuState = () => {
  const state = {
    activeMenu: activeMenu.value,
    openedMenus: openedMenus.value,
    timestamp: Date.now()
  }
  localStorage.setItem(MENU_STATE_KEY, JSON.stringify(state))
}

// 恢复菜单状态
const restoreMenuState = () => {
  try {
    const saved = localStorage.getItem(MENU_STATE_KEY)
    if (saved) {
      const state = JSON.parse(saved)
      
      // 检查缓存是否过期（24小时）
      const isExpired = Date.now() - state.timestamp > 24 * 60 * 60 * 1000
      
      if (!isExpired) {
        activeMenu.value = state.activeMenu || ''
        openedMenus.value = state.openedMenus || []
      }
    }
  } catch (error) {
    console.error('恢复菜单状态失败:', error)
  }
}

// 监听状态变化并保存
watch([activeMenu, openedMenus], saveMenuState, { deep: true })

onMounted(() => {
  restoreMenuState()
})
</script>
```

### 5. 用户体验优化

#### 菜单搜索功能
```vue
<template>
  <div class="menu-with-search">
    <!-- 搜索框 -->
    <div class="menu-search">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索菜单..."
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
    </div>
    
    <!-- 搜索结果 -->
    <div v-if="searchKeyword && searchResults.length" class="search-results">
      <div class="search-title">搜索结果</div>
      <el-menu>
        <el-menu-item 
          v-for="item in searchResults" 
          :key="item.index"
          :index="item.index"
          @click="handleSearchItemClick(item)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-html="highlightKeyword(item.title)"></span>
          <span class="search-path">{{ item.path }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 无搜索结果 -->
    <div v-else-if="searchKeyword && !searchResults.length" class="no-results">
      <el-empty description="未找到相关菜单" :image-size="60" />
    </div>
    
    <!-- 正常菜单 -->
    <el-menu v-else>
      <!-- 正常菜单内容 -->
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchKeyword = ref('')

// 所有菜单项（扁平化）
const allMenuItems = [
  { index: '/dashboard', title: '仪表盘', icon: 'Odometer', path: '首页 / 仪表盘' },
  { index: '/user/list', title: '用户列表', icon: 'User', path: '用户管理 / 用户列表' },
  { index: '/user/roles', title: '角色管理', icon: 'UserFilled', path: '用户管理 / 角色管理' },
  { index: '/system/config', title: '系统配置', icon: 'Setting', path: '系统设置 / 系统配置' }
]

// 搜索结果
const searchResults = computed(() => {
  if (!searchKeyword.value) return []
  
  const keyword = searchKeyword.value.toLowerCase()
  return allMenuItems.filter(item => 
    item.title.toLowerCase().includes(keyword) ||
    item.path.toLowerCase().includes(keyword)
  )
})

// 高亮关键词
const highlightKeyword = (text) => {
  if (!searchKeyword.value) return text
  
  const regex = new RegExp(`(${searchKeyword.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// 处理搜索项点击
const handleSearchItemClick = (item) => {
  searchKeyword.value = ''
  router.push(item.index)
}

const handleSearch = (value) => {
  // 可以添加防抖逻辑
}
</script>

<style scoped>
.menu-search {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

.search-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
}

.search-path {
  font-size: 12px;
  color: #999;
  margin-left: auto;
}

.no-results {
  padding: 40px 20px;
  text-align: center;
}

:deep(mark) {
  background: #fff3cd;
  color: #856404;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
```

## 常见问题

### Q: 菜单项点击后没有反应？
A: 检查是否正确设置了 `index` 属性，确保每个菜单项都有唯一的 `index` 值。

### Q: 如何实现菜单与路由的联动？
A: 设置 `router="true"` 属性，并确保菜单项的 `index` 值与路由路径一致。

### Q: 折叠菜单后子菜单无法正常显示？
A: 确保在折叠模式下使用了正确的插槽结构，特别是 `#title` 插槽的使用。

### Q: 如何自定义菜单的样式？
A: 可以通过 CSS 变量或直接设置 `background-color`、`text-color`、`active-text-color` 属性来自定义样式。

## 实践项目

### 菜单系统实现

创建一个完整的管理系统导航菜单，包含以下功能：

1. **多级菜单系统**
   - 垂直导航菜单
   - 水平顶部菜单
   - 多层级子菜单

2. **菜单功能特性**
   - 菜单折叠展开
   - 菜单项状态管理
   - 菜单权限控制

3. **路由集成**
   - 菜单与路由联动
   - 动态菜单生成
   - 面包屑导航配合

### 实践要点

- 设计合理的菜单层级结构
- 实现菜单的响应式布局
- 处理菜单的权限验证
- 优化菜单的用户体验

## 学习检查清单

- [ ] 掌握基础菜单结构的创建
- [ ] 理解垂直和水平菜单布局
- [ ] 熟练使用菜单分组功能
- [ ] 掌握子菜单展开和状态管理
- [ ] 理解菜单路由集成机制
- [ ] 完成菜单系统的实践项目

## 注意事项

1. **导航的层级结构**
   - 菜单层级不宜过深，建议不超过3层
   - 保持菜单结构的逻辑性和一致性
   - 合理使用菜单分组功能

2. **用户操作的一致性**
   - 菜单项的交互行为要统一
   - 激活状态的视觉反馈要明确
   - 菜单的展开收起要有合适的动画

3. **移动端的适配**
   - 在小屏幕设备上使用折叠菜单
   - 考虑触摸操作的便利性
   - 优化菜单的响应式布局

4. **导航的可访问性**
   - 确保菜单支持键盘导航
   - 提供合适的ARIA标签
   - 考虑屏幕阅读器的兼容性

## 总结

Menu 菜单组件是构建导航系统的核心组件，具有以下特点：

### 主要优势
- **灵活的布局模式**：支持垂直和水平两种布局方式
- **丰富的交互功能**：支持折叠、展开、路由跳转等交互
- **完善的主题定制**：提供多种样式配置选项
- **良好的可访问性**：支持键盘导航和屏幕阅读器

### 适用场景
- **管理后台系统**：构建多层级的功能导航
- **电商网站导航**：展示商品分类和功能入口
- **文档站点导航**：组织文档章节和内容结构
- **企业官网导航**：展示公司业务和服务内容

### 设计原则
- **层级清晰**：合理控制菜单层级深度，避免过度嵌套
- **功能分组**：将相关功能归类到同一菜单组
- **响应式设计**：适配不同设备和屏幕尺寸
- **性能优化**：大量菜单项时采用懒加载策略
- **用户体验**：提供搜索、缓存等增强功能

通过合理使用 Menu 组件，可以构建出功能完善、用户体验良好的导航系统。

## 参考资料

- [Element Plus Menu 官方文档](https://element-plus.org/zh-CN/component/menu.html)
- [Vue Router 官方文档](https://router.vuejs.org/zh/)
- [MDN - ARIA Navigation](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA/Roles/navigation_role)
- [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)
- [Material Design - Navigation](https://material.io/components/navigation-drawer)
- [Ant Design Menu 设计规范](https://ant.design/components/menu-cn/)

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**