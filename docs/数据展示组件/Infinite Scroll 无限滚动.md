# Infinite Scroll 无限滚动

## 概述

Infinite Scroll 无限滚动是 Element Plus 提供的指令式组件，用于实现滚动到底部时自动加载更多内容的功能。它可以显著提升长列表的用户体验，避免传统分页带来的交互中断。<mcreference link="https://element-plus.org/zh-CN/component/infinite-scroll.html" index="0">0</mcreference>

## 学习目标

- 掌握 Infinite Scroll 指令的基础用法
- 学会配置加载距离和延迟
- 理解禁用条件和加载状态管理
- 掌握在不同容器中的应用
- 了解性能优化和最佳实践

## 基础用法

### 基础无限滚动

最简单的用法，当滚动到底部时触发加载更多数据。<mcreference link="https://element-plus.org/zh-CN/component/infinite-scroll.html" index="0">0</mcreference>

```vue
<template>
  <div class="infinite-scroll-demo">
    <h3>基础无限滚动</h3>
    
    <ul
      v-infinite-scroll="loadMore"
      class="infinite-list"
      style="overflow: auto; height: 300px;"
    >
      <li v-for="item in list" :key="item" class="infinite-list-item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const list = ref(Array.from({ length: 10 }, (_, i) => `列表项 ${i + 1}`))
const count = ref(10)

const loadMore = () => {
  // 模拟异步加载
  setTimeout(() => {
    const newItems = Array.from({ length: 5 }, (_, i) => `列表项 ${count.value + i + 1}`)
    list.value.push(...newItems)
    count.value += 5
  }, 500)
}
</script>

<style scoped>
.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #f0f9ff;
  margin: 10px;
  color: #7c3aed;
  border-radius: 4px;
}
</style>
```

### 禁用无限滚动

通过 `infinite-scroll-disabled` 属性可以禁用无限滚动功能。<mcreference link="https://element-plus.org/zh-CN/component/infinite-scroll.html" index="0">0</mcreference>

```vue
<template>
  <div class="disabled-demo">
    <h3>禁用无限滚动</h3>
    
    <div class="controls">
      <el-button @click="toggleDisabled">
        {{ disabled ? '启用' : '禁用' }}无限滚动
      </el-button>
      <el-button @click="resetList" type="primary">
        重置列表
      </el-button>
    </div>
    
    <ul
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="disabled"
      class="infinite-list"
      style="overflow: auto; height: 300px;"
    >
      <li v-for="item in list" :key="item" class="infinite-list-item">
        {{ item }}
      </li>
      <li v-if="loading" class="infinite-list-item loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        加载中...
      </li>
      <li v-if="disabled && !loading" class="infinite-list-item disabled">
        无限滚动已禁用
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 10 }, (_, i) => `列表项 ${i + 1}`))
const count = ref(10)
const disabled = ref(false)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  // 模拟异步加载
  setTimeout(() => {
    const newItems = Array.from({ length: 5 }, (_, i) => `列表项 ${count.value + i + 1}`)
    list.value.push(...newItems)
    count.value += 5
    loading.value = false
    
    // 模拟数据加载完毕
    if (count.value >= 50) {
      disabled.value = true
    }
  }, 1000)
}

const toggleDisabled = () => {
  disabled.value = !disabled.value
}

const resetList = () => {
  list.value = Array.from({ length: 10 }, (_, i) => `列表项 ${i + 1}`)
  count.value = 10
  disabled.value = false
  loading.value = false
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
}

.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #f0f9ff;
  margin: 10px;
  color: #7c3aed;
  border-radius: 4px;
  gap: 8px;
}

.infinite-list-item.loading {
  background: #fff7ed;
  color: #ea580c;
}

.infinite-list-item.disabled {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
```

### 自定义加载距离

通过 `infinite-scroll-distance` 属性可以设置触发加载的距离。<mcreference link="https://element-plus.org/zh-CN/component/infinite-scroll.html" index="0">0</mcreference>

```vue
<template>
  <div class="distance-demo">
    <h3>自定义加载距离</h3>
    
    <div class="controls">
      <span>触发距离：</span>
      <el-slider
        v-model="distance"
        :min="0"
        :max="200"
        :step="10"
        style="width: 200px; margin: 0 16px;"
      />
      <span>{{ distance }}px</span>
    </div>
    
    <ul
      v-infinite-scroll="loadMore"
      :infinite-scroll-distance="distance"
      class="infinite-list"
      style="overflow: auto; height: 300px;"
    >
      <li v-for="item in list" :key="item" class="infinite-list-item">
        {{ item }}
      </li>
      <li v-if="loading" class="infinite-list-item loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        距离底部 {{ distance }}px 时触发加载
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 10 }, (_, i) => `列表项 ${i + 1}`))
const count = ref(10)
const distance = ref(50)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const newItems = Array.from({ length: 3 }, (_, i) => `列表项 ${count.value + i + 1}`)
    list.value.push(...newItems)
    count.value += 3
    loading.value = false
  }, 800)
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #f0f9ff;
  margin: 10px;
  color: #7c3aed;
  border-radius: 4px;
  gap: 8px;
}

.infinite-list-item.loading {
  background: #fff7ed;
  color: #ea580c;
}
</style>
```

### 延迟加载

通过 `infinite-scroll-delay` 属性可以设置触发加载的延迟时间。<mcreference link="https://element-plus.org/zh-CN/component/infinite-scroll.html" index="0">0</mcreference>

```vue
<template>
  <div class="delay-demo">
    <h3>延迟加载</h3>
    
    <div class="controls">
      <span>延迟时间：</span>
      <el-slider
        v-model="delay"
        :min="0"
        :max="2000"
        :step="100"
        style="width: 200px; margin: 0 16px;"
      />
      <span>{{ delay }}ms</span>
    </div>
    
    <ul
      v-infinite-scroll="loadMore"
      :infinite-scroll-delay="delay"
      class="infinite-list"
      style="overflow: auto; height: 300px;"
    >
      <li v-for="item in list" :key="item" class="infinite-list-item">
        {{ item }}
      </li>
      <li v-if="loading" class="infinite-list-item loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        延迟 {{ delay }}ms 后触发加载
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 8 }, (_, i) => `列表项 ${i + 1}`))
const count = ref(8)
const delay = ref(500)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const newItems = Array.from({ length: 3 }, (_, i) => `列表项 ${count.value + i + 1}`)
    list.value.push(...newItems)
    count.value += 3
    loading.value = false
  }, 600)
}
</script>

<style scoped>
.controls {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.infinite-list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: #f0f9ff;
  margin: 10px;
  color: #7c3aed;
  border-radius: 4px;
  gap: 8px;
}

.infinite-list-item.loading {
  background: #fff7ed;
  color: #ea580c;
}
</style>
```

## 实际应用示例

### 新闻列表无限滚动

```vue
<template>
  <div class="news-list-demo">
    <h3>新闻列表无限滚动</h3>
    
    <div class="news-header">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索新闻..."
        @input="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button @click="refreshNews" type="primary">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <div
      v-infinite-scroll="loadMoreNews"
      :infinite-scroll-disabled="loading || noMore"
      :infinite-scroll-distance="100"
      :infinite-scroll-delay="300"
      class="news-container"
    >
      <div v-for="news in newsList" :key="news.id" class="news-item">
        <div class="news-image">
          <el-image
            :src="news.image"
            fit="cover"
            style="width: 120px; height: 80px;"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="news-content">
          <h4 class="news-title">{{ news.title }}</h4>
          <p class="news-summary">{{ news.summary }}</p>
          <div class="news-meta">
            <span class="news-source">{{ news.source }}</span>
            <span class="news-time">{{ news.publishTime }}</span>
            <el-tag size="small" :type="getTagType(news.category)">
              {{ news.category }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-item">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在加载更多新闻...</span>
      </div>
      
      <!-- 没有更多数据 -->
      <div v-if="noMore && !loading" class="no-more-item">
        <el-icon><InfoFilled /></el-icon>
        <span>没有更多新闻了</span>
      </div>
      
      <!-- 空状态 -->
      <div v-if="newsList.length === 0 && !loading" class="empty-state">
        <el-icon><DocumentRemove /></el-icon>
        <span>暂无新闻数据</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Picture, Loading, InfoFilled, DocumentRemove } from '@element-plus/icons-vue'

const searchKeyword = ref('')
const newsList = ref([])
const loading = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟新闻数据
const generateNews = (page, size, keyword = '') => {
  const categories = ['科技', '财经', '体育', '娱乐', '社会']
  const sources = ['新华网', '人民网', '央视新闻', '澎湃新闻', '界面新闻']
  
  return Array.from({ length: size }, (_, i) => {
    const id = (page - 1) * size + i + 1
    const category = categories[Math.floor(Math.random() * categories.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    
    return {
      id,
      title: keyword 
        ? `${keyword}相关新闻标题 ${id}` 
        : `新闻标题 ${id} - ${category}重要资讯`,
      summary: `这是新闻 ${id} 的摘要内容，包含了重要的信息概述和关键要点...`,
      image: `https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg`,
      source,
      category,
      publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString()
    }
  })
}

const loadMoreNews = () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  
  // 模拟 API 请求
  setTimeout(() => {
    const newNews = generateNews(currentPage.value, pageSize.value, searchKeyword.value)
    
    if (newNews.length < pageSize.value) {
      noMore.value = true
    }
    
    newsList.value.push(...newNews)
    currentPage.value++
    loading.value = false
  }, 1000)
}

const handleSearch = () => {
  // 重置状态
  newsList.value = []
  currentPage.value = 1
  noMore.value = false
  
  // 加载搜索结果
  loadMoreNews()
}

const refreshNews = () => {
  searchKeyword.value = ''
  newsList.value = []
  currentPage.value = 1
  noMore.value = false
  loadMoreNews()
  ElMessage.success('新闻列表已刷新')
}

const getTagType = (category) => {
  const typeMap = {
    '科技': 'primary',
    '财经': 'success',
    '体育': 'warning',
    '娱乐': 'danger',
    '社会': 'info'
  }
  return typeMap[category] || 'info'
}

// 初始化加载
loadMoreNews()
</script>

<style scoped>
.news-header {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.news-container {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
}

.news-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.news-item:last-child {
  border-bottom: none;
}

.news-image {
  flex-shrink: 0;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-summary {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.news-source {
  font-weight: 500;
}

.loading-item,
.no-more-item,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

.empty-state {
  flex-direction: column;
  padding: 40px;
  color: #c0c4cc;
}
</style>
```

### 图片瀑布流

```vue
<template>
  <div class="photo-waterfall-demo">
    <h3>图片瀑布流</h3>
    
    <div class="waterfall-controls">
      <el-radio-group v-model="columns" @change="resetPhotos">
        <el-radio-button :label="2">2列</el-radio-button>
        <el-radio-button :label="3">3列</el-radio-button>
        <el-radio-button :label="4">4列</el-radio-button>
      </el-radio-group>
      <el-button @click="resetPhotos" type="primary">
        <el-icon><Refresh /></el-icon>
        重新加载
      </el-button>
    </div>
    
    <div
      v-infinite-scroll="loadMorePhotos"
      :infinite-scroll-disabled="loading || noMore"
      :infinite-scroll-distance="200"
      class="waterfall-container"
      :style="{ columns: columns }"
    >
      <div
        v-for="photo in photoList"
        :key="photo.id"
        class="photo-item"
        :style="{ height: photo.height + 'px' }"
      >
        <el-image
          :src="photo.url"
          :preview-src-list="photoUrls"
          :initial-index="photoList.indexOf(photo)"
          style="width: 100%; height: 100%;"
          fit="cover"
          lazy
          preview-teleported
        >
          <template #placeholder>
            <div class="photo-placeholder">
              <el-icon><Loading /></el-icon>
            </div>
          </template>
        </el-image>
        
        <div class="photo-overlay">
          <div class="photo-info">
            <span class="photo-title">{{ photo.title }}</span>
            <span class="photo-size">{{ photo.width }} × {{ photo.originalHeight }}</span>
          </div>
          <div class="photo-actions">
            <el-button size="small" type="primary" text>
              <el-icon><View /></el-icon>
            </el-button>
            <el-button size="small" type="success" text>
              <el-icon><Download /></el-icon>
            </el-button>
            <el-button size="small" type="danger" text>
              <el-icon><Heart /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-more">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在加载更多图片...</span>
    </div>
    
    <!-- 没有更多 -->
    <div v-if="noMore && !loading" class="no-more">
      <el-icon><InfoFilled /></el-icon>
      <span>所有图片已加载完毕</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh, Loading, View, Download, Heart, InfoFilled } from '@element-plus/icons-vue'

const columns = ref(3)
const photoList = ref([])
const loading = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)

const photoUrls = computed(() => photoList.value.map(photo => photo.url))

// 模拟图片数据
const generatePhotos = (page, size) => {
  const baseUrls = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'
  ]
  
  return Array.from({ length: size }, (_, i) => {
    const id = (page - 1) * size + i + 1
    const originalHeight = Math.floor(Math.random() * 300) + 200
    const height = Math.floor(originalHeight * 0.8) // 瀑布流显示高度
    
    return {
      id,
      title: `美丽图片 ${id}`,
      url: baseUrls[Math.floor(Math.random() * baseUrls.length)],
      width: 300,
      originalHeight,
      height
    }
  })
}

const loadMorePhotos = () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  
  // 模拟 API 请求
  setTimeout(() => {
    const newPhotos = generatePhotos(currentPage.value, pageSize.value)
    
    // 模拟数据加载完毕
    if (currentPage.value >= 5) {
      noMore.value = true
    }
    
    photoList.value.push(...newPhotos)
    currentPage.value++
    loading.value = false
  }, 1200)
}

const resetPhotos = () => {
  photoList.value = []
  currentPage.value = 1
  noMore.value = false
  loading.value = false
  loadMorePhotos()
}

// 初始化加载
loadMorePhotos()
</script>

<style scoped>
.waterfall-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.waterfall-container {
  column-gap: 16px;
  max-height: 600px;
  overflow-y: auto;
}

.photo-item {
  position: relative;
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.photo-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.photo-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px 12px 12px;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.photo-title {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.photo-size {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.photo-actions {
  display: flex;
  gap: 4px;
}

.loading-more,
.no-more {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}
</style>
```

### 聊天消息无限滚动

```vue
<template>
  <div class="chat-demo">
    <h3>聊天消息无限滚动</h3>
    
    <div class="chat-container">
      <div class="chat-header">
        <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="chat-info">
          <span class="chat-name">技术交流群</span>
          <span class="chat-status">{{ messageList.length }} 条消息</span>
        </div>
        <el-button size="small" @click="scrollToBottom">
          <el-icon><Bottom /></el-icon>
          回到底部
        </el-button>
      </div>
      
      <div
        ref="chatMessagesRef"
        v-infinite-scroll="loadMoreMessages"
        :infinite-scroll-disabled="loading || noMore"
        :infinite-scroll-distance="50"
        infinite-scroll-immediate="false"
        class="chat-messages"
      >
        <!-- 加载更多历史消息 -->
        <div v-if="loading" class="loading-history">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载历史消息中...</span>
        </div>
        
        <div v-if="noMore && !loading" class="no-more-history">
          <span>没有更多历史消息</span>
        </div>
        
        <!-- 消息列表 -->
        <div
          v-for="message in messageList"
          :key="message.id"
          class="message-item"
          :class="{ 'is-own': message.isOwn }"
        >
          <el-avatar
            v-if="!message.isOwn"
            :size="32"
            :src="message.avatar"
            class="message-avatar"
          />
          
          <div class="message-content">
            <div v-if="!message.isOwn" class="message-name">{{ message.username }}</div>
            <div class="message-bubble" :class="{ 'is-own': message.isOwn }">
              <span>{{ message.content }}</span>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
          
          <el-avatar
            v-if="message.isOwn"
            :size="32"
            :src="message.avatar"
            class="message-avatar"
          />
        </div>
      </div>
      
      <!-- 消息输入 -->
      <div class="chat-input">
        <el-input
          v-model="newMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
          maxlength="500"
          show-word-limit
        >
          <template #append>
            <el-button @click="sendMessage" type="primary" :disabled="!newMessage.trim()">
              发送
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { Loading, Bottom } from '@element-plus/icons-vue'

const chatMessagesRef = ref(null)
const messageList = ref([])
const newMessage = ref('')
const loading = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)

// 模拟用户数据
const users = [
  { id: 1, name: '张三', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 2, name: '李四', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 3, name: '王五', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 4, name: '我', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png', isOwn: true }
]

// 模拟消息内容
const messageContents = [
  '大家好！',
  '今天天气不错',
  '有人在吗？',
  '这个问题怎么解决？',
  '谢谢大家的帮助',
  '我觉得这个方案不错',
  '可以试试这个方法',
  '明天见！',
  '周末愉快',
  '新年快乐！'
]

// 生成模拟消息
const generateMessages = (page, size) => {
  const messages = []
  const startId = (page - 1) * size + 1
  
  for (let i = 0; i < size; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const content = messageContents[Math.floor(Math.random() * messageContents.length)]
    const time = new Date(Date.now() - (size - i) * 60000).toLocaleTimeString()
    
    messages.push({
      id: startId + i,
      username: user.name,
      avatar: user.avatar,
      content,
      time,
      isOwn: user.isOwn || false
    })
  }
  
  return messages
}

const loadMoreMessages = () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  
  // 模拟加载历史消息
  setTimeout(() => {
    const newMessages = generateMessages(currentPage.value, pageSize.value)
    
    // 模拟没有更多历史消息
    if (currentPage.value >= 3) {
      noMore.value = true
    }
    
    // 将新消息插入到列表开头（历史消息）
    messageList.value.unshift(...newMessages.reverse())
    currentPage.value++
    loading.value = false
  }, 1000)
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: Date.now(),
    username: '我',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    content: newMessage.value,
    time: new Date().toLocaleTimeString(),
    isOwn: true
  }
  
  messageList.value.push(message)
  newMessage.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 初始化加载最新消息
const initMessages = () => {
  const initialMessages = generateMessages(1, 10)
  messageList.value = initialMessages
  nextTick(() => {
    scrollToBottom()
  })
}

initMessages()
</script>

<style scoped>
.chat-container {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #f8f9fa;
}

.chat-info {
  flex: 1;
}

.chat-name {
  display: block;
  font-weight: 500;
  color: #303133;
}

.chat-status {
  font-size: 12px;
  color: #909399;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.loading-history,
.no-more-history {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #909399;
  font-size: 12px;
}

.message-item {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.message-item.is-own {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-item.is-own .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-name {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.message-bubble {
  display: inline-block;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f0f0f0;
  color: #303133;
  word-wrap: break-word;
}

.message-bubble.is-own {
  background: #409eff;
  color: white;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 4px;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #e4e7ed;
  background: #f8f9fa;
}
</style>
```

## API 文档

### Infinite Scroll Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| infinite-scroll-disabled | 是否禁用无限滚动 | boolean | false |
| infinite-scroll-delay | 节流时延，单位为ms | number | 200 |
| infinite-scroll-distance | 触发加载的距离阈值，单位为px | number | 0 |
| infinite-scroll-immediate | 是否立即执行加载方法，以防初始状态下内容无法撑满容器 | boolean | true |

### Infinite Scroll Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| infinite-scroll | 滚动到底部时触发的加载方法 | — |

## 最佳实践

### 性能优化

1. **虚拟滚动**：对于大量数据，结合虚拟滚动技术
2. **节流控制**：合理设置 `infinite-scroll-delay` 避免频繁触发
3. **数据分页**：控制每次加载的数据量
4. **内存管理**：及时清理不可见的 DOM 元素

### 用户体验

1. **加载状态**：显示清晰的加载指示器
2. **错误处理**：优雅处理网络错误和加载失败
3. **空状态**：提供友好的空数据提示
4. **加载完成**：明确告知用户数据已全部加载

### 数据管理

1. **状态管理**：合理管理加载状态和数据状态
2. **缓存策略**：实现适当的数据缓存机制
3. **去重处理**：避免重复数据的加载
4. **数据更新**：处理实时数据更新的场景

### 可访问性

1. **键盘导航**：支持键盘操作
2. **屏幕阅读器**：提供适当的 ARIA 标签
3. **焦点管理**：合理管理焦点状态

## 常见问题

### 1. 无限滚动不触发

**问题**：滚动到底部但不触发加载

**解决方案**：
- 确保容器有明确的高度和 `overflow: auto`
- 检查 `infinite-scroll-disabled` 状态
- 验证 `infinite-scroll-distance` 设置
- 确认加载函数绑定正确

### 2. 重复加载数据

**问题**：同一批数据被重复加载

**解决方案**：
- 在加载过程中设置 `loading` 状态
- 使用 `infinite-scroll-disabled` 控制加载
- 实现数据去重逻辑
- 合理设置 `infinite-scroll-delay`

### 3. 性能问题

**问题**：大量数据导致页面卡顿

**解决方案**：
- 使用虚拟滚动技术
- 限制 DOM 元素数量
- 优化渲染性能
- 实现数据懒加载

### 4. 初始加载问题

**问题**：页面初始化时不自动加载

**解决方案**：
- 检查 `infinite-scroll-immediate` 设置
- 确保容器初始状态正确
- 手动触发初始加载
- 验证数据初始化逻辑

## 总结

Infinite Scroll 无限滚动是提升长列表用户体验的重要功能。通过合理配置参数和状态管理，可以实现流畅的数据加载体验。在实际应用中，需要注意性能优化、错误处理和用户反馈，以确保功能的稳定性和易用性。

## 参考资料

- [Element Plus Infinite Scroll 官方文档](https://element-plus.org/zh-CN/component/infinite-scroll.html)
- [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
- [虚拟滚动最佳实践](https://web.dev/virtualize-long-lists-react-window/)
- [Web 性能优化指南](https://web.dev/performance/)