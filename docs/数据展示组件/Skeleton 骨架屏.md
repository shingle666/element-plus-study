# Skeleton 骨架屏

## 概述

Skeleton 骨架屏是 Element Plus 提供的一个在需要等待加载内容的位置设置占位符的组件。相比传统的 Loading 加载效果，骨架屏能够更好地保持页面结构的稳定性，提供更好的用户体验，让用户对即将加载的内容有一个预期。

## 学习目标

通过本文档的学习，你将掌握：
- Skeleton 骨架屏的基本概念和使用场景
- 基础用法和参数配置
- 动画效果和自定义样式
- 加载状态控制和防抖动处理
- 实际项目中的应用示例
- 完整的 API 文档和最佳实践

## 基础用法

### 基础骨架效果

最简单的骨架屏用法：

```vue
<template>
  <el-skeleton />
</template>
```

### 更多参数

可以配置骨架屏段落数量，以便更接近真实渲染效果：

```vue
<template>
  <el-skeleton :rows="5" animated />
</template>
```

> 显示的数量会比传入的数量多 1，首行会被渲染一个长度 33% 的段首。

### 动画效果

通过 `animated` 属性开启加载动画：

```vue
<template>
  <div>
    <h4>无动画</h4>
    <el-skeleton :rows="3" />
    
    <h4>有动画</h4>
    <el-skeleton :rows="3" animated />
  </div>
</template>
```

### 自定义样式

使用具名插槽 `template` 来自定义骨架屏模板：

```vue
<template>
  <el-skeleton style="width: 240px">
    <template #template>
      <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
      <div style="padding: 14px">
        <el-skeleton-item variant="p" style="width: 50%" />
        <div
          style="
            display: flex;
            align-items: center;
            justify-items: space-between;
            margin-top: 16px;
            height: 16px;
          "
        >
          <el-skeleton-item variant="text" style="margin-right: 16px" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </div>
    </template>
  </el-skeleton>
</template>
```

### 加载状态

通过 `loading` 属性控制是否显示加载后的真实内容：

```vue
<template>
  <div>
    <el-switch v-model="loading" active-text="Loading" />
    
    <el-skeleton style="width: 240px" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="p" style="width: 50%" />
          <div style="display: flex; align-items: center; justify-items: space-between; margin-top: 16px; height: 16px">
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      
      <template #default>
        <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 240px; display: block"
          />
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom card-header">
              <div class="time">{{ currentDate }}</div>
              <el-button text class="button">Operating button</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(true)
const currentDate = new Date().toLocaleDateString()
</script>

<style scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
```

### 渲染多条数据

使用 `count` 属性控制渲染多少条假数据：

```vue
<template>
  <el-skeleton :rows="5" :count="3" animated />
</template>
```

> **提示**：不推荐在浏览器中渲染过多的虚假 UI 元素，这样会消耗更多时间销毁骨架元素，从而引起性能问题。为了用户体验，请尽量将 `count` 值保持在小一点的数值。

### 防止渲染抖动

通过 `throttle` 属性避免 API 请求过快导致的界面闪烁：

```vue
<template>
  <div>
    <el-switch v-model="loading" active-text="Loading" />
    
    <el-skeleton 
      style="width: 240px" 
      :loading="loading" 
      animated 
      :throttle="500"
    >
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="p" style="width: 50%" />
          <div style="display: flex; align-items: center; margin-top: 16px; height: 16px">
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      
      <template #default>
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            style="width: 240px; display: block"
          />
          <div style="padding: 14px">
            <span>Delicious hamburger</span>
            <div class="bottom">
              <div class="time">{{ currentDate }}</div>
              <el-button text class="button">Operating button</el-button>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const currentDate = new Date().toLocaleDateString()
</script>
```

### 初始渲染加载

当初始值为 `loading: true` 时，可以设置 `throttle: {initVal: true, leading: xxx}` 来控制初始骨架屏的即时显示：

```vue
<template>
  <div>
    <el-switch v-model="loading" active-text="Loading" />
    
    <el-skeleton 
      style="width: 240px" 
      :loading="loading" 
      animated 
      :throttle="{ initVal: true, leading: 500 }"
    >
      <template #template>
        <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
        <div style="padding: 14px">
          <el-skeleton-item variant="p" style="width: 50%" />
        </div>
      </template>
      
      <template #default>
        <el-card>Delicious hamburger</el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(true)
</script>
```

## 实际应用示例

### 文章列表骨架屏

```vue
<template>
  <div class="article-list">
    <div class="toolbar">
      <el-button @click="loadArticles" :loading="loading">
        {{ loading ? '加载中...' : '刷新文章' }}
      </el-button>
    </div>
    
    <div class="articles">
      <el-skeleton 
        v-for="n in 3" 
        :key="n"
        :loading="loading" 
        animated 
        :throttle="300"
        class="article-skeleton"
      >
        <template #template>
          <div class="article-skeleton-item">
            <el-skeleton-item variant="image" style="width: 120px; height: 80px; margin-right: 16px" />
            <div class="content">
              <el-skeleton-item variant="h3" style="width: 60%; margin-bottom: 8px" />
              <el-skeleton-item variant="text" style="width: 100%; margin-bottom: 4px" />
              <el-skeleton-item variant="text" style="width: 80%; margin-bottom: 8px" />
              <div style="display: flex; align-items: center">
                <el-skeleton-item variant="text" style="width: 80px; margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 60px" />
              </div>
            </div>
          </div>
        </template>
        
        <template #default>
          <div class="article-item" v-for="article in articles" :key="article.id">
            <img :src="article.cover" alt="" class="cover" />
            <div class="content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.summary }}</p>
              <div class="meta">
                <span>{{ article.author }}</span>
                <span>{{ article.publishTime }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const articles = ref([])

const loadArticles = async () => {
  loading.value = true
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  articles.value = [
    {
      id: 1,
      title: 'Vue 3 新特性详解',
      summary: '深入了解 Vue 3 带来的新功能和改进...',
      author: '张三',
      publishTime: '2024-01-15',
      cover: 'https://via.placeholder.com/120x80'
    },
    {
      id: 2,
      title: 'Element Plus 组件库实践',
      summary: '如何在项目中高效使用 Element Plus...',
      author: '李四',
      publishTime: '2024-01-14',
      cover: 'https://via.placeholder.com/120x80'
    },
    {
      id: 3,
      title: '前端性能优化指南',
      summary: '提升 Web 应用性能的最佳实践...',
      author: '王五',
      publishTime: '2024-01-13',
      cover: 'https://via.placeholder.com/120x80'
    }
  ]
  
  loading.value = false
}

// 初始加载
loadArticles()
</script>

<style scoped>
.article-list {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.article-skeleton {
  margin-bottom: 20px;
}

.article-skeleton-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.article-skeleton-item .content {
  flex: 1;
}

.article-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 16px;
}

.article-item .cover {
  width: 120px;
  height: 80px;
  object-fit: cover;
  margin-right: 16px;
  border-radius: 4px;
}

.article-item .content {
  flex: 1;
}

.article-item h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.article-item p {
  margin: 0 0 8px 0;
  color: #606266;
  line-height: 1.5;
}

.article-item .meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}
</style>
```

### 用户信息卡片骨架屏

```vue
<template>
  <div class="user-profile">
    <el-button @click="loadUserInfo" :loading="loading">
      {{ loading ? '加载中...' : '加载用户信息' }}
    </el-button>
    
    <el-skeleton 
      :loading="loading" 
      animated 
      :throttle="400"
      style="margin-top: 20px"
    >
      <template #template>
        <div class="user-skeleton">
          <el-skeleton-item variant="image" style="width: 80px; height: 80px; border-radius: 50%" />
          <div class="user-info">
            <el-skeleton-item variant="h3" style="width: 120px; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 200px; margin-bottom: 4px" />
            <el-skeleton-item variant="text" style="width: 150px; margin-bottom: 8px" />
            <div style="display: flex; gap: 8px">
              <el-skeleton-item variant="button" style="width: 60px; height: 32px" />
              <el-skeleton-item variant="button" style="width: 60px; height: 32px" />
            </div>
          </div>
        </div>
      </template>
      
      <template #default>
        <div class="user-card" v-if="userInfo">
          <img :src="userInfo.avatar" alt="" class="avatar" />
          <div class="user-info">
            <h3>{{ userInfo.name }}</h3>
            <p>{{ userInfo.email }}</p>
            <p>{{ userInfo.department }}</p>
            <div class="actions">
              <el-button size="small" type="primary">关注</el-button>
              <el-button size="small">私信</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)
const userInfo = ref(null)

const loadUserInfo = async () => {
  loading.value = true
  userInfo.value = null
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  userInfo.value = {
    name: '张小明',
    email: 'zhangxiaoming@example.com',
    department: '前端开发部',
    avatar: 'https://via.placeholder.com/80x80'
  }
  
  loading.value = false
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.user-skeleton {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.user-skeleton .user-info {
  flex: 1;
}

.user-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.user-card .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card .user-info {
  flex: 1;
}

.user-card h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.user-card p {
  margin: 0 0 4px 0;
  color: #606266;
}

.user-card .actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}
</style>
```

## API 文档

### Skeleton Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| animated | 是否使用动画 | `boolean` | `false` |
| count | 渲染多少个 template，建议使用尽可能小的数字 | `number` | `1` |
| loading | 是否显示加载结束后的 DOM 结构 | `boolean` | `false` |
| rows | 骨架屏段落数量 | `number` | `3` |
| throttle | 渲染延迟（以毫秒为单位）数字代表延迟显示，也可以设置为延迟隐藏，例如 `{ leading: 500, trailing: 500 }` 当需要控制初始加载值时，您可以设置 `{ initVal: true }` | `number / object` | `0` |

### Skeleton Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| default | 真正渲染的DOM | `object` |
| template | 渲染 skeleton 模板的内容 | `object` |

### SkeletonItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| variant | 当前渲染 skeleton 类型 | `'p' / 'text' / 'h1' / 'h3' / 'caption' / 'button' / 'image' / 'circle' / 'rect'` | `'text'` |

## 最佳实践

### 设计原则

1. **结构相似性**：骨架屏应该尽可能接近真实内容的结构和布局
2. **合理的加载时间**：使用 `throttle` 避免过快的加载导致闪烁
3. **适度的动画**：动画能提升体验，但不要过于炫酷影响性能

### 性能优化

1. **控制数量**：避免同时渲染过多的骨架屏元素
2. **合理使用 count**：`count` 属性应该根据实际需要设置，不宜过大
3. **及时销毁**：加载完成后及时切换到真实内容

### 用户体验

1. **预期管理**：骨架屏应该让用户对即将加载的内容有合理预期
2. **加载反馈**：结合适当的加载提示文字或进度指示
3. **错误处理**：加载失败时应该有相应的错误状态

### 响应式设计

1. **移动端适配**：在移动设备上调整骨架屏的尺寸和布局
2. **弹性布局**：使用弹性布局确保在不同屏幕尺寸下的表现
3. **内容优先**：在小屏幕上优先显示重要内容的骨架

## 常见问题

### 骨架屏不显示

**问题**：设置了 `loading="true"` 但骨架屏不显示

**解决方案**：
1. 检查 `loading` 属性是否正确绑定
2. 确认是否有自定义模板但模板为空
3. 检查 CSS 样式是否影响显示

```vue
<!-- 错误示例 -->
<el-skeleton loading="true" />

<!-- 正确示例 -->
<el-skeleton :loading="true" />
```

### 自定义模板不生效

**问题**：使用了 `template` 插槽但显示的还是默认样式

**解决方案**：确保插槽名称正确，并且包含有效的骨架元素

```vue
<!-- 错误示例 -->
<el-skeleton>
  <template #default>
    <el-skeleton-item variant="text" />
  </template>
</el-skeleton>

<!-- 正确示例 -->
<el-skeleton>
  <template #template>
    <el-skeleton-item variant="text" />
  </template>
</el-skeleton>
```

### 动画性能问题

**问题**：开启动画后页面卡顿

**解决方案**：
1. 减少同时显示的骨架屏数量
2. 优化自定义模板的复杂度
3. 考虑在低性能设备上禁用动画

```vue
<template>
  <el-skeleton 
    :animated="!isLowPerformance" 
    :count="isLowPerformance ? 1 : 3"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLowPerformance = ref(false)

onMounted(() => {
  // 检测设备性能
  isLowPerformance.value = navigator.hardwareConcurrency < 4
})
</script>
```

### 防抖动设置无效

**问题**：设置了 `throttle` 但仍然有闪烁

**解决方案**：正确配置 throttle 参数

```vue
<!-- 基础防抖 -->
<el-skeleton :throttle="500" />

<!-- 高级防抖配置 -->
<el-skeleton :throttle="{ leading: 500, trailing: 300 }" />

<!-- 初始加载防抖 -->
<el-skeleton :throttle="{ initVal: true, leading: 500 }" />
```

## 总结

Skeleton 骨架屏是一个提升用户体验的重要组件，能够在内容加载时提供更好的视觉反馈。通过本文档的学习，你应该能够：

1. 理解骨架屏的设计理念和使用场景
2. 掌握基础用法和高级配置
3. 实现自定义骨架屏模板
4. 合理使用防抖动和性能优化
5. 在实际项目中应用骨架屏提升用户体验

在实际开发中，建议根据具体的内容结构设计相应的骨架屏，注意性能和用户体验的平衡，确保骨架屏能够真正提升而不是影响用户体验。

## 参考资料

- [Element Plus Skeleton 官方文档](https://element-plus.org/zh-CN/component/skeleton.html)
- [骨架屏设计指南](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
- [Web 性能优化最佳实践](https://web.dev/performance/)