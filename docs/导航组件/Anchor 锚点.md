# Anchor 锚点

## 概述

Anchor 锚点组件用于快速定位页面内容，提供页面内导航功能。它可以自动高亮当前视口内的锚点链接，支持平滑滚动和自定义滚动容器，是构建文档导航、目录索引等功能的理想选择。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

## 学习目标

- 掌握 Anchor 锚点的基本概念和使用场景
- 学会基础锚点导航的实现
- 了解水平和垂直两种布局模式
- 掌握自定义滚动容器的配置
- 学会锚点样式和交互的定制
- 了解锚点在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基础锚点

最简单的锚点导航，自动高亮当前视口内的锚点：

```vue
<template>
  <div class="anchor-demo">
    <div class="anchor-nav">
      <el-anchor>
        <el-anchor-link href="#section1" title="第一部分" />
        <el-anchor-link href="#section2" title="第二部分" />
        <el-anchor-link href="#section3" title="第三部分" />
        <el-anchor-link href="#section4" title="第四部分">
          <template #sub-link>
            <el-anchor-link href="#section4-1" title="子章节 4.1" />
            <el-anchor-link href="#section4-2" title="子章节 4.2" />
          </template>
        </el-anchor-link>
      </el-anchor>
    </div>
    
    <div class="content">
      <div id="section1" class="section">
        <h2>第一部分</h2>
        <p>这里是第一部分的内容...</p>
      </div>
      
      <div id="section2" class="section">
        <h2>第二部分</h2>
        <p>这里是第二部分的内容...</p>
      </div>
      
      <div id="section3" class="section">
        <h2>第三部分</h2>
        <p>这里是第三部分的内容...</p>
      </div>
      
      <div id="section4" class="section">
        <h2>第四部分</h2>
        <p>这里是第四部分的内容...</p>
        
        <div id="section4-1" class="subsection">
          <h3>子章节 4.1</h3>
          <p>子章节内容...</p>
        </div>
        
        <div id="section4-2" class="subsection">
          <h3>子章节 4.2</h3>
          <p>子章节内容...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 20px;
}

.anchor-nav {
  width: 200px;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.content {
  flex: 1;
}

.section {
  min-height: 400px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  margin-bottom: 20px;
  border-radius: 4px;
}

.subsection {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
```

### 水平模式

水平排列的锚点，适用于顶部导航栏。水平模式不支持 sub-link 槽位：

```vue
<template>
  <div class="horizontal-demo">
    <div class="horizontal-nav">
      <el-anchor direction="horizontal" type="underline">
        <el-anchor-link href="#intro" title="产品介绍" />
        <el-anchor-link href="#features" title="核心功能" />
        <el-anchor-link href="#pricing" title="价格方案" />
        <el-anchor-link href="#contact" title="联系我们" />
      </el-anchor>
    </div>
    
    <div class="horizontal-content">
      <div id="intro" class="content-section">
        <h2>产品介绍</h2>
        <p>这里是产品介绍的详细内容，包括产品的核心价值和主要特点...</p>
      </div>
      
      <div id="features" class="content-section">
        <h2>核心功能</h2>
        <p>详细介绍产品的各项核心功能和技术优势...</p>
      </div>
      
      <div id="pricing" class="content-section">
        <h2>价格方案</h2>
        <p>不同的价格套餐和服务内容对比...</p>
      </div>
      
      <div id="contact" class="content-section">
        <h2>联系我们</h2>
        <p>联系方式和客服信息...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-demo {
  width: 100%;
}

.horizontal-nav {
  position: sticky;
  top: 0;
  background: white;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
  z-index: 100;
}

.horizontal-content {
  padding: 20px;
}

.content-section {
  min-height: 500px;
  padding: 40px 0;
  border-bottom: 1px solid #f0f0f0;
}

.content-section:last-child {
  border-bottom: none;
}
</style>
```

### 自定义滚动容器

自定义滚动区域，使用 `offset` props 可以设置锚点滚动偏移。监听 `link-click` 事件并阻止浏览器的默认行为，然后它不会改变历史。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <div style="height: 400px; overflow: auto;" id="scroll-container">
    <el-anchor 
      container="#scroll-container" 
      :offset="50"
      @link-click="handleLinkClick"
    >
      <el-anchor-link href="#section1" title="Section 1" />
      <el-anchor-link href="#section2" title="Section 2" />
    </el-anchor>
  </div>
</template>

<script setup>
const handleLinkClick = (e, link) => {
  e.preventDefault()
  // 自定义滚动逻辑
}
</script>
```

### 下划线类型

设置 `type="underline"` 更改为下划线类型。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-anchor type="underline">
    <el-anchor-link href="#section1" title="Section 1" />
    <el-anchor-link href="#section2" title="Section 2" />
  </el-anchor>
</template>
```

### 固定模式

使用 affix 组件来固定住页面中的锚点。<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

```vue
<template>
  <el-affix :offset="50">
    <el-anchor>
      <el-anchor-link href="#section1" title="Section 1" />
      <el-anchor-link href="#section2" title="Section 2" />
    </el-anchor>
  </el-affix>
</template>
```

## 实际应用示例

### 文档导航

在文档页面中使用锚点导航：

```vue
<template>
  <div class="doc-layout">
    <aside class="doc-sidebar">
      <el-affix :offset="20">
        <el-anchor :offset="80" :bound="20">
          <el-anchor-link href="#installation" title="安装">
            <template #sub-link>
              <el-anchor-link href="#npm-install" title="NPM 安装" />
              <el-anchor-link href="#cdn-install" title="CDN 引入" />
            </template>
          </el-anchor-link>
          <el-anchor-link href="#quickstart" title="快速开始">
            <template #sub-link>
              <el-anchor-link href="#import-component" title="导入组件" />
              <el-anchor-link href="#basic-usage" title="基础用法" />
            </template>
          </el-anchor-link>
          <el-anchor-link href="#api" title="API 文档">
            <template #sub-link>
              <el-anchor-link href="#props" title="Props" />
              <el-anchor-link href="#events" title="Events" />
              <el-anchor-link href="#methods" title="Methods" />
            </template>
          </el-anchor-link>
        </el-anchor>
      </el-affix>
    </aside>
    
    <main class="doc-content">
      <section id="installation" class="doc-section">
        <h1>安装</h1>
        <div id="npm-install" class="doc-subsection">
          <h2>NPM 安装</h2>
          <p>使用 npm 安装组件库...</p>
        </div>
        <div id="cdn-install" class="doc-subsection">
          <h2>CDN 引入</h2>
          <p>通过 CDN 方式引入...</p>
        </div>
      </section>
      
      <section id="quickstart" class="doc-section">
        <h1>快速开始</h1>
        <div id="import-component" class="doc-subsection">
          <h2>导入组件</h2>
          <p>如何正确导入组件...</p>
        </div>
        <div id="basic-usage" class="doc-subsection">
          <h2>基础用法</h2>
          <p>组件的基本使用方法...</p>
        </div>
      </section>
      
      <section id="api" class="doc-section">
        <h1>API 文档</h1>
        <div id="props" class="doc-subsection">
          <h2>Props</h2>
          <p>组件属性说明...</p>
        </div>
        <div id="events" class="doc-subsection">
          <h2>Events</h2>
          <p>组件事件说明...</p>
        </div>
        <div id="methods" class="doc-subsection">
          <h2>Methods</h2>
          <p>组件方法说明...</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.doc-layout {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 40px;
}

.doc-sidebar {
  width: 240px;
  flex-shrink: 0;
}

.doc-content {
  flex: 1;
  min-width: 0;
}

.doc-section {
  margin-bottom: 60px;
  padding: 20px 0;
}

.doc-subsection {
  margin: 30px 0;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
}
</style>
```

### 页面目录

为长页面添加目录导航：

```vue
<template>
  <div class="page-with-toc">
    <div class="toc-container">
      <h3>目录</h3>
      <el-anchor 
        :offset="60" 
        :duration="500"
        @change="handleAnchorChange"
      >
        <el-anchor-link href="#chapter1" title="第一章：基础概念" />
        <el-anchor-link href="#chapter2" title="第二章：核心原理" />
        <el-anchor-link href="#chapter3" title="第三章：实践应用" />
        <el-anchor-link href="#chapter4" title="第四章：进阶技巧" />
        <el-anchor-link href="#chapter5" title="第五章：最佳实践" />
      </el-anchor>
    </div>
    
    <div class="page-content">
      <article id="chapter1" class="chapter">
        <h2>第一章：基础概念</h2>
        <p>详细介绍基础概念和理论知识...</p>
      </article>
      
      <article id="chapter2" class="chapter">
        <h2>第二章：核心原理</h2>
        <p>深入解析核心原理和实现机制...</p>
      </article>
      
      <article id="chapter3" class="chapter">
        <h2>第三章：实践应用</h2>
        <p>通过实际案例展示应用方法...</p>
      </article>
      
      <article id="chapter4" class="chapter">
        <h2>第四章：进阶技巧</h2>
        <p>介绍高级技巧和优化方法...</p>
      </article>
      
      <article id="chapter5" class="chapter">
        <h2>第五章：最佳实践</h2>
        <p>总结最佳实践和经验分享...</p>
      </article>
    </div>
  </div>
</template>

<script setup>
const handleAnchorChange = (href) => {
  console.log('当前锚点：', href)
  // 可以在这里添加统计或其他逻辑
}
</script>

<style scoped>
.page-with-toc {
  display: flex;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.toc-container {
  width: 200px;
  position: sticky;
  top: 20px;
  height: fit-content;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.toc-container h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #303133;
}

.page-content {
  flex: 1;
}

.chapter {
  min-height: 600px;
  padding: 30px 0;
  border-bottom: 2px solid #e4e7ed;
}

.chapter:last-child {
  border-bottom: none;
}
</style>
```

## API

### Anchor Attributes

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| container | 滚动的容器 | string / HTMLElement / Window | — |
| offset | 设置锚点滚动的偏移量 | number | 0 |
| bound | 触发锚点的元素的位置偏移量 | number | 15 |
| duration | 设置容器滚动持续时间，单位为毫秒 | number | 300 |
| marker | 是否显示标记 | boolean | true |
| type | 设置锚点类型 | enum | default |
| direction | 设置锚点方向 | enum | vertical |
| select-scroll-top | 滚动时，链接是否选中位于顶部 | boolean | false |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| change | step 改变时的回调 | Function |
| click | 当用户点击链接时触发 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| scrollTo | 手动滚动到特定位置 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### Anchor Slots

| 名称 | 说明 |
|------|------|
| default | AnchorLink 组件列表 |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### AnchorLink Attributes

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 链接的文本内容 | string | — |
| href | 链接的地址 | string | — |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

### AnchorLink Slots

| 名称 | 说明 |
|------|------|
| default | 链接的内容 |
| sub-link | 子链接的槽位 |

<mcreference link="https://element-plus.org/zh-CN/component/anchor.html" index="1">1</mcreference>

## 最佳实践

### 1. 合理设置偏移量

```vue
<template>
  <!-- 考虑固定头部的高度 -->
  <el-anchor :offset="80" :bound="20">
    <el-anchor-link href="#section1" title="章节一" />
  </el-anchor>
</template>

<style>
/* 确保目标元素有足够的上边距 */
.section {
  scroll-margin-top: 80px;
}
</style>
```

### 2. 容器滚动配置

```vue
<template>
  <div class="scroll-container" id="container">
    <el-anchor 
      container="#container"
      :offset="20"
      @change="handleChange"
    >
      <el-anchor-link href="#item1" title="项目 1" />
    </el-anchor>
  </div>
</template>

<style>
.scroll-container {
  height: 400px;
  overflow-y: auto;
  position: relative;
}
</style>
```

### 3. 响应式设计

```vue
<template>
  <el-anchor 
    :direction="isMobile ? 'horizontal' : 'vertical'"
    :type="isMobile ? 'underline' : 'default'"
  >
    <el-anchor-link href="#section1" title="章节一" />
  </el-anchor>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
```

### 4. 性能优化

```vue
<script setup>
import { ref, nextTick } from 'vue'

// 防抖处理锚点变化
let changeTimer = null
const handleAnchorChange = (href) => {
  clearTimeout(changeTimer)
  changeTimer = setTimeout(() => {
    // 处理锚点变化逻辑
    console.log('锚点变化：', href)
  }, 100)
}

// 延迟初始化锚点
const anchorReady = ref(false)
nextTick(() => {
  anchorReady.value = true
})
</script>
```

## 常见问题

### 1. 锚点滚动不够平滑

**问题**：点击锚点时滚动效果生硬

**解决方案**：
```vue
<!-- 方案一：调整动画时长 -->
<el-anchor :duration="800">
  <el-anchor-link href="#section1" title="章节一" />
</el-anchor>

<!-- 方案二：使用 CSS 平滑滚动 -->
<style>
html {
  scroll-behavior: smooth;
}
</style>
```

### 2. 自定义容器滚动异常

**问题**：在自定义滚动容器中锚点不工作

**解决方案**：
```vue
<template>
  <div class="custom-container" ref="containerRef">
    <el-anchor 
      :container="containerRef"
      :offset="10"
    >
      <el-anchor-link href="#item1" title="项目 1" />
    </el-anchor>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const containerRef = ref(null)
</script>

<style>
.custom-container {
  height: 400px;
  overflow-y: auto;
  position: relative; /* 重要：确保定位上下文 */
}
</style>
```

### 3. 锚点定位不准确

**问题**：点击锚点后目标位置偏移

**解决方案**：
```vue
<!-- 调整 offset 和 bound 参数 -->
<el-anchor 
  :offset="headerHeight + 20" 
  :bound="30"
>
  <el-anchor-link href="#section1" title="章节一" />
</el-anchor>

<script setup>
import { ref, onMounted } from 'vue'

const headerHeight = ref(60)

onMounted(() => {
  // 动态计算头部高度
  const header = document.querySelector('.header')
  if (header) {
    headerHeight.value = header.offsetHeight
  }
})
</script>
```

### 4. 移动端适配问题

**问题**：移动端锚点导航体验不佳

**解决方案**：
```vue
<template>
  <el-anchor 
    v-if="!isMobile"
    class="desktop-anchor"
  >
    <!-- 桌面端完整导航 -->
    <el-anchor-link href="#section1" title="详细章节标题" />
  </el-anchor>
  
  <el-anchor 
    v-else
    direction="horizontal"
    type="underline"
    class="mobile-anchor"
  >
    <!-- 移动端简化导航 -->
    <el-anchor-link href="#section1" title="章节1" />
  </el-anchor>
</template>

<style>
.mobile-anchor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 1000;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
```

## 性能优化建议

1. **懒加载锚点**：对于长列表，考虑动态加载锚点链接
2. **防抖处理**：对频繁的滚动事件进行防抖处理
3. **虚拟滚动**：超长内容考虑使用虚拟滚动技术
4. **缓存计算**：缓存元素位置计算结果，避免重复计算

## 总结

Anchor 锚点组件是构建页面导航的重要工具，支持：

- **多种布局模式**：垂直和水平两种排列方式
- **灵活的容器支持**：支持全页面和自定义容器滚动
- **丰富的定制选项**：偏移量、动画时长、样式类型等
- **良好的交互体验**：自动高亮、平滑滚动、事件回调
- **响应式适配**：适应不同设备和屏幕尺寸

掌握 Anchor 组件的使用，能够为用户提供清晰、便捷的页面导航体验，特别适用于文档站点、长页面内容和产品介绍页面。

## 参考资料

- [Element Plus Anchor 官方文档](https://element-plus.org/zh-CN/component/anchor.html)
- [MDN - Element.scrollIntoView()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)
- [CSS scroll-behavior](https://developer.mozilla.org/zh-CN/docs/Web/CSS/scroll-behavior)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)