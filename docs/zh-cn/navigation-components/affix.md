# Affix 固钉

## 概述

Affix 固钉组件可以将页面元素固定在特定的可视区域，当页面滚动时，被固定的元素会始终保持在指定位置。这在创建导航栏、工具栏、侧边栏等需要持续可见的界面元素时非常有用。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

## 学习目标

- 掌握 Affix 固钉的基本概念和使用场景
- 学会基础固钉功能的实现
- 了解不同固定位置的配置方法
- 掌握容器内固钉的使用技巧
- 学会监听固钉状态变化事件
- 了解性能优化和最佳实践
- 掌握实际项目中的应用场景

## 基础用法

### 基础固钉

固钉默认固定在页面顶部。通过设置 `offset` 属性来改变吸顶距离，默认值为 0。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <div>
    <div style="height: 100px; background: #f0f0f0; text-align: center; line-height: 100px;">
      页面顶部内容
    </div>
    
    <!-- 基础固钉 -->
    <el-affix :offset="0">
      <el-button type="primary">固定在顶部</el-button>
    </el-affix>
    
    <!-- 带偏移的固钉 -->
    <el-affix :offset="120">
      <el-button type="success">固定在距离顶部 120px 的位置</el-button>
    </el-affix>
    
    <div style="height: 1000px; background: linear-gradient(to bottom, #e3f2fd, #bbdefb); padding: 20px;">
      <p>滚动页面查看固钉效果</p>
      <p>这里是页面内容...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>
```

### 指定容器

通过设置 `target` 属性，让固钉始终保持在容器内，超过范围则隐藏。请注意容器避免出现滚动条。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <div>
    <h4>容器内固钉示例</h4>
    <div id="scroll-container" class="scroll-container">
      <div class="container-content">
        <p>容器顶部内容</p>
        
        <el-affix target="#scroll-container" :offset="10">
          <el-button type="warning">固定在容器内</el-button>
        </el-affix>
        
        <div style="height: 800px; padding: 20px; background: #f9f9f9;">
          <p>滚动容器查看固钉效果</p>
          <p>固钉会在容器范围内保持固定</p>
          <p>超出容器范围时会隐藏</p>
          <div v-for="i in 20" :key="i" style="margin: 20px 0; padding: 10px; background: white; border-radius: 4px;">
            容器内容 {{ i }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.scroll-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  position: relative;
}

.container-content {
  padding: 20px;
}
</style>
```

### 固定位置

Affix 组件提供 2 个固定的位置参数 `top` 和 `bottom`。通过设置 `position` 属性来改变固定位置，默认值为 `top`。<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

```vue
<template>
  <div>
    <h4>不同固定位置示例</h4>
    
    <!-- 固定在顶部 -->
    <el-affix position="top" :offset="60">
      <el-button type="primary">固定在顶部</el-button>
    </el-affix>
    
    <!-- 固定在底部 -->
    <el-affix position="bottom" :offset="20">
      <el-button type="danger">固定在底部</el-button>
    </el-affix>
    
    <div style="height: 1500px; padding: 20px; background: linear-gradient(to bottom, #fff3e0, #ffe0b2);">
      <h3>页面内容</h3>
      <p>滚动页面查看不同位置的固钉效果</p>
      <div v-for="i in 30" :key="i" style="margin: 20px 0; padding: 15px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h4>内容块 {{ i }}</h4>
        <p>这是第 {{ i }} 个内容块，用于演示固钉效果。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>
```

### 监听状态变化

可以监听固钉状态的变化，在固定和取消固定时执行相应的逻辑：

```vue
<template>
  <div>
    <div class="status-info">
      <p>固钉状态：{{ affixStatus ? '已固定' : '未固定' }}</p>
      <p>滚动位置：{{ scrollTop }}px</p>
    </div>
    
    <el-affix 
      :offset="100" 
      @change="handleAffixChange"
      @scroll="handleScroll"
    >
      <div class="affix-content">
        <el-button type="primary">状态监听固钉</el-button>
        <span class="status-badge" :class="{ active: affixStatus }">{{ affixStatus ? '固定中' : '正常' }}</span>
      </div>
    </el-affix>
    
    <div style="height: 1200px; padding: 20px; background: #f5f5f5;">
      <p>滚动页面查看状态变化</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const affixStatus = ref(false)
const scrollTop = ref(0)

const handleAffixChange = (fixed) => {
  affixStatus.value = fixed
  ElMessage({
    message: fixed ? '固钉已激活' : '固钉已取消',
    type: fixed ? 'success' : 'info'
  })
}

const handleScroll = ({ scrollTop: top, fixed }) => {
  scrollTop.value = Math.round(top)
}
</script>

<style scoped>
.status-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
}

.affix-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: #f0f0f0;
  color: #666;
  transition: all 0.3s;
}

.status-badge.active {
  background: #67c23a;
  color: white;
}
</style>
```

## 实际应用示例

### 导航工具栏

创建一个固定的导航工具栏，包含常用操作按钮：

```vue
<template>
  <div class="page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>文档编辑器</h1>
      <p>这是一个带有固定工具栏的文档编辑器示例</p>
    </div>
    
    <!-- 固定工具栏 -->
    <el-affix :offset="0" :z-index="100">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button-group>
            <el-button type="primary" :icon="Edit">编辑</el-button>
            <el-button :icon="View">预览</el-button>
            <el-button :icon="Share">分享</el-button>
          </el-button-group>
        </div>
        
        <div class="toolbar-center">
          <el-input 
            v-model="searchText" 
            placeholder="搜索文档内容" 
            :prefix-icon="Search"
            style="width: 300px;"
          />
        </div>
        
        <div class="toolbar-right">
          <el-button :icon="Download">导出</el-button>
          <el-button type="success" :icon="Check">保存</el-button>
        </div>
      </div>
    </el-affix>
    
    <!-- 文档内容 -->
    <div class="document-content">
      <div v-for="i in 50" :key="i" class="content-block">
        <h3>章节 {{ i }}</h3>
        <p>这是第 {{ i }} 个章节的内容。在滚动过程中，上方的工具栏会始终保持固定，方便用户随时使用编辑功能。</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Edit, View, Share, Search, Download, Check } from '@element-plus/icons-vue'

const searchText = ref('')
</script>

<style scoped>
.page-container {
  min-height: 100vh;
}

.page-header {
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5em;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.document-content {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.content-block {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-block h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.content-block p {
  line-height: 1.6;
  color: #606266;
  margin: 10px 0;
}
</style>
```

### 侧边栏目录

创建一个固定的侧边栏目录，方便用户导航：

```vue
<template>
  <div class="layout-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="article-header">
        <h1>技术文档</h1>
        <p>这是一个带有固定侧边栏目录的文档页面</p>
      </div>
      
      <div v-for="section in sections" :key="section.id" :id="section.id" class="section">
        <h2>{{ section.title }}</h2>
        <div v-for="i in 5" :key="i" class="paragraph">
          <p>{{ section.title }} 的第 {{ i }} 段内容。这里是详细的说明文字，用于演示页面滚动和目录定位效果。</p>
        </div>
      </div>
    </div>
    
    <!-- 固定侧边栏目录 -->
    <el-affix :offset="20" class="sidebar-affix">
      <div class="sidebar">
        <h3>目录</h3>
        <ul class="toc-list">
          <li 
            v-for="section in sections" 
            :key="section.id"
            class="toc-item"
            :class="{ active: activeSection === section.id }"
            @click="scrollToSection(section.id)"
          >
            {{ section.title }}
          </li>
        </ul>
        
        <div class="sidebar-actions">
          <el-button size="small" type="primary" @click="scrollToTop">回到顶部</el-button>
          <el-button size="small" @click="toggleTheme">{{ isDark ? '浅色' : '深色' }}</el-button>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('')
const isDark = ref(false)

const sections = [
  { id: 'introduction', title: '介绍' },
  { id: 'installation', title: '安装' },
  { id: 'usage', title: '使用方法' },
  { id: 'examples', title: '示例' },
  { id: 'api', title: 'API 参考' },
  { id: 'faq', title: '常见问题' }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark-theme', isDark.value)
}

const handleScroll = () => {
  const scrollTop = window.pageYOffset
  
  for (const section of sections) {
    const element = document.getElementById(section.id)
    if (element) {
      const { offsetTop, offsetHeight } = element
      if (scrollTop >= offsetTop - 100 && scrollTop < offsetTop + offsetHeight - 100) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-right: 280px;
}

.article-header {
  text-align: center;
  padding: 40px 0;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.article-header h1 {
  margin: 0 0 10px 0;
  color: #303133;
}

.section {
  background: white;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.section h2 {
  margin: 0 0 20px 0;
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

.paragraph {
  margin-bottom: 15px;
}

.paragraph p {
  line-height: 1.6;
  color: #606266;
}

.sidebar-affix {
  position: fixed;
  right: 20px;
  width: 240px;
}

.sidebar {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sidebar h3 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.toc-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #606266;
  font-size: 14px;
}

.toc-item:hover {
  background: #f5f7fa;
  color: #409eff;
}

.toc-item.active {
  background: #409eff;
  color: white;
}

.sidebar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
```

### 浮动操作面板

创建一个固定的浮动操作面板，提供快捷功能：

```vue
<template>
  <div class="demo-container">
    <div class="content-area">
      <h1>商品列表</h1>
      
      <div class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image"></div>
          <h3>{{ product.name }}</h3>
          <p class="price">¥{{ product.price }}</p>
          <el-button size="small" type="primary">加入购物车</el-button>
        </div>
      </div>
    </div>
    
    <!-- 浮动操作面板 -->
    <el-affix position="bottom" :offset="20" class="float-panel-affix">
      <div class="float-panel">
        <div class="panel-item" @click="scrollToTop">
          <el-icon><ArrowUp /></el-icon>
          <span>回顶部</span>
        </div>
        
        <div class="panel-item" @click="showCart">
          <el-badge :value="cartCount" class="cart-badge">
            <el-icon><ShoppingCart /></el-icon>
          </el-badge>
          <span>购物车</span>
        </div>
        
        <div class="panel-item" @click="showFavorites">
          <el-badge :value="favoriteCount" class="favorite-badge">
            <el-icon><Star /></el-icon>
          </el-badge>
          <span>收藏</span>
        </div>
        
        <div class="panel-item" @click="contactService">
          <el-icon><ChatDotRound /></el-icon>
          <span>客服</span>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp, ShoppingCart, Star, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const cartCount = ref(3)
const favoriteCount = ref(8)

const products = ref([
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `商品 ${i + 1}`,
    price: (Math.random() * 1000 + 100).toFixed(2)
  }))
])

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showCart = () => {
  ElMessage.info('打开购物车')
}

const showFavorites = () => {
  ElMessage.info('打开收藏夹')
}

const contactService = () => {
  ElMessage.info('联系客服')
}
</script>

<style scoped>
.demo-container {
  min-height: 200vh;
  padding: 20px;
  background: #f5f5f5;
}

.content-area h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: 150px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  border-radius: 4px;
  margin-bottom: 15px;
}

.product-card h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin: 10px 0;
}

.float-panel-affix {
  position: fixed;
  right: 20px;
}

.float-panel {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
}

.panel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.panel-item:last-child {
  border-bottom: none;
}

.panel-item:hover {
  background: #f5f7fa;
}

.panel-item .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
  color: #409eff;
}

.panel-item span {
  font-size: 12px;
  color: #606266;
}

.cart-badge :deep(.el-badge__content) {
  background: #f56c6c;
}

.favorite-badge :deep(.el-badge__content) {
  background: #e6a23c;
}
</style>
```

## API

### Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| offset | 偏移距离 | number | 0 |
| position | 固钉位置 | enum | top |
| target | 指定容器（CSS 选择器） | string | — |
| z-index | z-index | number | 100 |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 固钉状态改变时触发的事件 | Function |
| scroll | 滚动时触发的事件 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

### 暴露方法

| 名称 | 说明 | 类型 |
|------|------|------|
| update | 手动更新固钉状态 | Function |
| updateRoot | 手动更新根元素的盒模型信息 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/affix.html" index="0">0</mcreference>

## 最佳实践

### 1. 合理设置偏移量
根据页面布局设置合适的 `offset` 值，避免遮挡重要内容：

```javascript
// 考虑页面头部导航栏高度
const headerHeight = 60
const offset = headerHeight + 10 // 额外留出10px间距
```

### 2. 容器固钉注意事项
在有限高度的容器中使用固钉时的最佳实践：

```vue
<template>
  <!-- 确保容器有明确的高度和定位 -->
  <div class="container" style="height: 400px; position: relative; overflow-y: auto;">
    <el-affix target=".container" :offset="10">
      <div class="sticky-content">固定内容</div>
    </el-affix>
  </div>
</template>
```

### 3. 性能优化
- 避免在固钉内容中放置过于复杂的组件
- 使用 `v-show` 而不是 `v-if` 来控制固钉内容的显示
- 合理设置 `z-index` 避免层级冲突

### 4. 响应式设计
在不同屏幕尺寸下适配固钉效果：

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const offset = ref(60)

const updateOffset = () => {
  // 根据屏幕尺寸调整偏移量
  if (window.innerWidth < 768) {
    offset.value = 40 // 移动端较小偏移
  } else {
    offset.value = 60 // 桌面端正常偏移
  }
}

onMounted(() => {
  updateOffset()
  window.addEventListener('resize', updateOffset)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateOffset)
})
</script>
```

### 5. 无障碍访问
确保固钉内容对屏幕阅读器友好：

```vue
<template>
  <el-affix :offset="60">
    <nav role="navigation" aria-label="固定导航">
      <el-button>导航按钮</el-button>
    </nav>
  </el-affix>
</template>
```

## 常见问题

### 1. 固钉不生效的问题

**问题**：固钉在某些情况下不生效

**原因**：
- 父容器有 `transform`、`perspective`、`filter` 等 CSS 属性
- 容器的 `position` 设置不当
- z-index 层级冲突

**解决方案**：
```css
/* 确保父容器不影响 position: fixed */
.parent-container {
  /* 避免使用这些属性 */
  /* transform: translateZ(0); */
  /* perspective: 1000px; */
  /* filter: blur(0); */
}

/* 或者为固钉设置更高的 z-index */
.el-affix {
  z-index: 9999;
}
```

### 2. 容器内固钉的滚动问题

**问题**：容器内固钉在滚动时表现异常

**解决方案**：
```vue
<template>
  <!-- 确保容器有正确的样式 -->
  <div 
    id="scroll-container" 
    style="
      height: 400px; 
      overflow-y: auto; 
      position: relative;
    "
  >
    <el-affix target="#scroll-container" :offset="0">
      <div>固定内容</div>
    </el-affix>
  </div>
</template>
```

### 3. 性能优化问题

**问题**：页面滚动时出现卡顿

**解决方案**：
```javascript
// 使用防抖优化滚动事件
import { debounce } from 'lodash-es'

const handleScroll = debounce(({ scrollTop, fixed }) => {
  // 处理滚动逻辑
  console.log('滚动位置：', scrollTop)
}, 16) // 约60fps
```

### 4. 移动端适配问题

**问题**：移动端固钉位置不准确

**解决方案**：
```vue
<script setup>
import { ref, computed } from 'vue'

const isMobile = ref(window.innerWidth < 768)

const affixOffset = computed(() => {
  return isMobile.value ? 0 : 60
})

const affixZIndex = computed(() => {
  return isMobile.value ? 1000 : 100
})
</script>

<template>
  <el-affix 
    :offset="affixOffset" 
    :z-index="affixZIndex"
  >
    <div>响应式固钉</div>
  </el-affix>
</template>
```

### 5. 多个固钉的层级管理

**问题**：页面有多个固钉时的层级冲突

**解决方案**：
```vue
<template>
  <!-- 主导航 - 最高层级 -->
  <el-affix :offset="0" :z-index="1000">
    <nav>主导航</nav>
  </el-affix>
  
  <!-- 工具栏 - 中等层级 -->
  <el-affix :offset="60" :z-index="999">
    <div>工具栏</div>
  </el-affix>
  
  <!-- 侧边栏 - 较低层级 -->
  <el-affix :offset="120" :z-index="998">
    <aside>侧边栏</aside>
  </el-affix>
</template>
```

## 性能优化建议

### 1. 减少重绘和回流
```vue
<script setup>
// 使用 CSS transform 而不是改变 top/left
const affixStyle = computed(() => ({
  transform: isFixed.value ? 'translateY(0)' : 'translateY(-100%)'
}))
</script>
```

### 2. 合理使用事件监听
```javascript
// 使用 Intersection Observer API 优化滚动监听
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 元素进入视口
    }
  })
})
```

### 3. 内容懒加载
```vue
<template>
  <el-affix :offset="60">
    <!-- 只在固定时加载复杂内容 -->
    <div v-if="isFixed">
      <ComplexComponent />
    </div>
    <div v-else>
      <SimpleComponent />
    </div>
  </el-affix>
</template>
```

## 总结

Affix 固钉组件是一个功能强大的导航辅助组件，主要特点包括：

### 核心功能
- **位置固定**：支持顶部和底部两种固定位置
- **容器限制**：可以限制在指定容器内固定
- **偏移控制**：灵活设置固定位置的偏移距离
- **状态监听**：提供状态变化和滚动事件监听

### 应用场景
- **导航栏固定**：页面主导航或工具栏
- **侧边栏目录**：文档或文章的目录导航
- **操作面板**：购物车、客服等快捷操作
- **回到顶部**：页面滚动辅助功能

### 最佳实践要点
1. 合理设置偏移量和层级
2. 注意容器样式对固钉的影响
3. 考虑移动端适配和响应式设计
4. 优化性能，避免滚动卡顿
5. 确保无障碍访问友好

掌握 Affix 组件的使用，能够为用户提供更好的页面导航体验，提升界面的易用性和专业性。

## 参考资料

- [Element Plus Affix 官方文档](https://element-plus.org/zh-CN/component/affix.html)
- [CSS position 属性详解](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
- [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- [Web 无障碍访问指南](https://www.w3.org/WAI/WCAG21/quickref/)