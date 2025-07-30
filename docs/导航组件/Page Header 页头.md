# Page Header 页头

## 概述

Page Header 页头组件是一个用于页面顶部导航的组件，提供了返回功能、标题显示和额外操作区域。它适用于路径相对简单的页面，为用户提供清晰的页面层级关系和便捷的导航体验。

### 主要特性

- **简洁导航**：提供简单直观的页面导航功能
- **灵活布局**：支持多个插槽自定义页头内容
- **图标定制**：可自定义或隐藏返回图标
- **面包屑集成**：支持集成面包屑导航
- **扩展操作**：提供额外操作区域放置按钮等元素
- **响应式设计**：适配不同屏幕尺寸

### 适用场景

- **详情页面**：商品详情、用户详情等需要返回的页面
- **表单页面**：新增、编辑表单页面的页头
- **设置页面**：各种设置和配置页面
- **文档页面**：帮助文档、说明页面等
- **简单层级**：路径层级不超过3层的页面导航

## 学习目标

### 基础知识
- 掌握 Page Header 的基本概念和使用场景
- 学会基础页头的创建和配置
- 了解页头组件的插槽系统
- 掌握返回事件的处理方法

### 进阶技能
- 学会自定义页头图标和样式
- 掌握面包屑导航的集成
- 了解复杂页头布局的设计
- 学会响应式页头的实现

### 实战应用
- 能够设计符合业务需求的页头
- 掌握页头与路由系统的集成
- 了解页头的性能优化方法
- 学会页头的可访问性优化

## 基础用法

### 基础用法

简单场景下的标准页头。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script setup>
const goBack = () => {
  console.log('go back')
}
</script>
```

### 自定义图标

默认图标可能无法满足您的需求，您可以通过设置 `icon` 属性来自定义图标。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
</script>
```

### 无图标

有时，页面全是元素，您可能不想展示页面上方的图标，您可以设置 `icon` 属性值为 `null` 来去除它。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="null">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>
```

### 面包屑导航

使用页头组件，您可以通过添加插槽 `breadcrumb` 来设置面包屑路由导航。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header>
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="./page-header.html">route 1</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </el-page-header>
</template>
```

### 额外操作部分

头部可能会变得很复杂，您可以在头部添加更多的区块，以允许丰富的交互。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header :icon="null">
    <template #content>
      <div class="flex items-center">
        <el-avatar
          :size="32"
          class="mr-3"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> Title </span>
        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
          Sub title
        </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
  </el-page-header>
</template>
```

### 主要内容

有时我们想让页头显示一些协同响应内容，我们可以使用 `default` 插槽。<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="./page-header.html">route 1</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>route 2</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <div class="flex items-center">
        <el-avatar
          class="mr-3"
          :size="32"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <span class="text-large font-600 mr-3"> Title </span>
        <span
          class="text-sm mr-2"
          style="color: var(--el-text-color-regular)"
        >
          Sub title
        </span>
        <el-tag>Default</el-tag>
      </div>
    </template>
    <template #extra>
      <div class="flex items-center">
        <el-button>Print</el-button>
        <el-button type="primary" class="ml-2">Edit</el-button>
      </div>
    </template>
    <el-descriptions :column="3" size="small" class="mt-4">
      <el-descriptions-item label="Username">
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item label="Telephone">
        18100000000
      </el-descriptions-item>
      <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
    <p class="mt-4 text-sm">
      Your additional content can be added with default slot, You may put as many content as you want here.
    </p>
  </el-page-header>
</template>

<script setup>
import { ElNotification as notify } from 'element-plus'

const onBack = () => {
  notify('Back')
}
</script>
```

### 组件插槽结构

本组件由这些部件构成：<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

```vue
<template>
  <el-page-header>
    <!-- Line 1 -->
    <template #breadcrumb />
    <!-- Line 2 -->
    <template #icon />
    <template #title />
    <template #content />
    <template #extra />
    <!-- Lines after 2 -->
    <template #default />
  </el-page-header>
</template>
```

## 实际应用示例

### 商品详情页头

电商网站商品详情页的页头设计：

```vue
<template>
  <div class="product-detail">
    <el-page-header @back="goBack">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/category' }">{{ product.category }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      
      <template #content>
        <div class="product-header">
          <el-image 
            :src="product.image" 
            :size="40" 
            class="product-image"
          />
          <div class="product-info">
            <h2 class="product-title">{{ product.name }}</h2>
            <div class="product-meta">
              <el-tag v-if="product.isNew" type="success" size="small">新品</el-tag>
              <el-tag v-if="product.isHot" type="danger" size="small">热销</el-tag>
              <span class="product-price">¥{{ product.price }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <template #extra>
        <div class="product-actions">
          <el-button :icon="Share" circle @click="shareProduct" />
          <el-button :icon="Star" circle @click="toggleFavorite" :type="isFavorite ? 'primary' : 'default'" />
          <el-button type="primary" @click="addToCart">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
        </div>
      </template>
    </el-page-header>
    
    <!-- 商品详情内容 -->
    <div class="product-content">
      <!-- 商品详情展示区域 -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Share, Star, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isFavorite = ref(false)

const product = reactive({
  id: 1,
  name: 'iPhone 15 Pro Max',
  category: '手机数码',
  price: 9999,
  image: '/images/iphone15.jpg',
  isNew: true,
  isHot: true
})

const goBack = () => {
  router.back()
}

const shareProduct = () => {
  // 分享商品逻辑
  ElMessage.success('分享链接已复制到剪贴板')
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
}

const addToCart = () => {
  // 添加到购物车逻辑
  ElMessage.success('已添加到购物车')
}
</script>

<style scoped>
.product-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  border-radius: 8px;
}

.product-info {
  flex: 1;
}

.product-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-content {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
```

### 用户设置页头

用户个人设置页面的页头：

```vue
<template>
  <div class="user-settings">
    <el-page-header @back="goBack">
      <template #content>
        <div class="settings-header">
          <el-avatar :src="userInfo.avatar" :size="32" class="user-avatar" />
          <div class="user-info">
            <h3 class="user-name">{{ userInfo.name }}</h3>
            <span class="user-role">{{ userInfo.role }}</span>
          </div>
        </div>
      </template>
      
      <template #extra>
        <div class="settings-actions">
          <el-button @click="resetSettings">重置设置</el-button>
          <el-button type="primary" @click="saveSettings" :loading="saving">
            保存设置
          </el-button>
        </div>
      </template>
    </el-page-header>
    
    <!-- 设置内容 -->
    <div class="settings-content">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <el-tab-pane label="基本信息" name="basic">
          <!-- 基本信息设置 -->
        </el-tab-pane>
        <el-tab-pane label="安全设置" name="security">
          <!-- 安全设置 -->
        </el-tab-pane>
        <el-tab-pane label="通知设置" name="notification">
          <!-- 通知设置 -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const saving = ref(false)
const activeTab = ref('basic')

const userInfo = reactive({
  name: '张三',
  role: '管理员',
  avatar: '/images/avatar.jpg'
})

const goBack = () => {
  router.push('/dashboard')
}

const resetSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有设置吗？此操作不可撤销。',
      '重置确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 重置设置逻辑
    ElMessage.success('设置已重置')
  } catch {
    ElMessage.info('已取消重置')
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    // 保存设置逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('设置已保存')
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.settings-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.user-role {
  font-size: 12px;
  color: #909399;
}

.settings-actions {
  display: flex;
  gap: 8px;
}

.settings-content {
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.settings-tabs {
  min-height: 400px;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| icon | Page Header 的图标 Icon 组件 | string / Component | Back |
| title | Page Header 的主标题，默认是 Back (内置 a11y) | string | '' |
| content | Page Header 的内容 | string | '' |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| back | 点击左侧区域触发 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

### Slots

| 名称 | 说明 |
|------|------|
| icon | 图标内容 |
| title | 标题内容 |
| content | 内容 |
| extra | 扩展设置 |
| breadcrumb | 面包屑导航内容 |
| default | 默认内容 |

<mcreference link="https://element-plus.org/zh-CN/component/page-header.html" index="1">1</mcreference>

## 最佳实践

1. **简单路径优先**：当页面路径比较简单时，优先使用页头组件而非面包屑组件
2. **图标选择**：根据页面功能选择合适的图标，或在不需要时设置为 `null`
3. **内容布局**：合理使用各个插槽，保持页头信息的层次清晰
4. **响应式设计**：在移动端考虑简化页头内容，避免信息过载
5. **交互一致性**：确保返回按钮的行为与用户预期一致

## 常见问题

### Q: 如何隐藏默认的返回图标？
A: 设置 `icon` 属性为 `null` 或空字符串即可隐藏默认图标。

### Q: 页头组件与面包屑组件如何选择？
A: 当页面路径比较简单时推荐使用页头组件，复杂的多层级路径建议使用面包屑组件。

### Q: 如何在页头中添加更多操作按钮？
A: 使用 `extra` 插槽可以在页头右侧添加操作按钮或其他元素。

### Q: 页头的返回事件如何处理？
A: 监听 `@back` 事件，在事件处理函数中实现具体的返回逻辑，如路由跳转或历史记录回退。

## 总结

Page Header 页头组件是一个功能丰富的导航组件，具有以下特点：

- **简洁高效**：提供简单直观的页面导航体验
- **高度可定制**：支持多个插槽自定义页头内容
- **集成友好**：可与面包屑、路由系统无缝集成
- **响应式设计**：适配各种屏幕尺寸和设备
- **用户体验优先**：注重导航的一致性和可用性

适用于需要简单导航的页面，特别是详情页、设置页等场景。通过合理使用各个插槽和配置选项，可以创建出既美观又实用的页头导航。

## 参考资料

- [Element Plus Page Header 官方文档](https://element-plus.org/zh-CN/component/page-header.html)
- [Vue Router 导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [响应式设计最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Realizing_common_layouts_using_CSS_Grid_Layout)