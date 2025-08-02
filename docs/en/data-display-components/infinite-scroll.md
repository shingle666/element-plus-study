# Infinite Scroll

## Overview

Infinite Scroll is a directive component provided by Element Plus, used to implement the functionality of automatically loading more content when scrolling to the bottom. It can significantly improve the user experience of long lists, avoiding the interaction interruption caused by traditional pagination.

## Learning Objectives

- Master the basic usage of the Infinite Scroll directive
- Learn to configure loading distance and delay
- Understand disable conditions and loading state management
- Master application in different containers
- Learn about performance optimization and best practices

## Basic Usage

### Basic Infinite Scroll

The simplest usage, triggering more data loading when scrolling to the bottom.

```vue
<template>
  <div class="infinite-scroll-demo">
    <h3>Basic Infinite Scroll</h3>
    
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

const list = ref(Array.from({ length: 10 }, (_, i) => `List Item ${i + 1}`))
const count = ref(10)

const loadMore = () => {
  // Simulate asynchronous loading
  setTimeout(() => {
    const newItems = Array.from({ length: 5 }, (_, i) => `List Item ${count.value + i + 1}`)
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

### Disabling Infinite Scroll

The infinite scroll functionality can be disabled through the `infinite-scroll-disabled` attribute.

```vue
<template>
  <div class="disabled-demo">
    <h3>Disable Infinite Scroll</h3>
    
    <div class="controls">
      <el-button @click="toggleDisabled">
        {{ disabled ? 'Enable' : 'Disable' }} Infinite Scroll
      </el-button>
      <el-button @click="resetList" type="primary">
        Reset List
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
        Loading...
      </li>
      <li v-if="disabled && !loading" class="infinite-list-item disabled">
        Infinite scroll is disabled
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 10 }, (_, i) => `List Item ${i + 1}`))
const count = ref(10)
const disabled = ref(false)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  // Simulate asynchronous loading
  setTimeout(() => {
    const newItems = Array.from({ length: 5 }, (_, i) => `List Item ${count.value + i + 1}`)
    list.value.push(...newItems)
    count.value += 5
    loading.value = false
    
    // Simulate data loading completion
    if (count.value >= 50) {
      disabled.value = true
    }
  }, 1000)
}

const toggleDisabled = () => {
  disabled.value = !disabled.value
}

const resetList = () => {
  list.value = Array.from({ length: 10 }, (_, i) => `List Item ${i + 1}`)
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

### Custom Loading Distance

The trigger distance for loading can be set through the `infinite-scroll-distance` attribute.

```vue
<template>
  <div class="distance-demo">
    <h3>Custom Loading Distance</h3>
    
    <div class="controls">
      <span>Trigger Distance:</span>
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
        Triggers loading when {{ distance }}px from bottom
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 10 }, (_, i) => `List Item ${i + 1}`))
const count = ref(10)
const distance = ref(50)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const newItems = Array.from({ length: 3 }, (_, i) => `List Item ${count.value + i + 1}`)
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

### Delayed Loading

The delay time for triggering loading can be set through the `infinite-scroll-delay` attribute.

```vue
<template>
  <div class="delay-demo">
    <h3>Delayed Loading</h3>
    
    <div class="controls">
      <span>Delay Time:</span>
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
        Triggers loading after {{ delay }}ms delay
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const list = ref(Array.from({ length: 8 }, (_, i) => `List Item ${i + 1}`))
const count = ref(8)
const delay = ref(500)
const loading = ref(false)

const loadMore = () => {
  if (loading.value) return
  
  loading.value = true
  
  setTimeout(() => {
    const newItems = Array.from({ length: 3 }, (_, i) => `List Item ${count.value + i + 1}`)
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

## Practical Application Examples

### News List with Infinite Scroll

```vue
<template>
  <div class="news-list-demo">
    <h3>News List with Infinite Scroll</h3>
    
    <div class="news-header">
      <el-input
        v-model="searchKeyword"
        placeholder="Search news..."
        @input="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button @click="refreshNews" type="primary">
        <el-icon><Refresh /></el-icon>
        Refresh
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
      
      <!-- Loading state -->
      <div v-if="loading" class="loading-item">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>Loading more news...</span>
      </div>
      
      <!-- No more data -->
      <div v-if="noMore && !loading" class="no-more-item">
        <el-icon><InfoFilled /></el-icon>
        <span>No more news</span>
      </div>
      
      <!-- Empty state -->
      <div v-if="newsList.length === 0 && !loading" class="empty-state">
        <el-icon><DocumentRemove /></el-icon>
        <span>No news data available</span>
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

// Simulate news data
const generateNews = (page, size, keyword = '') => {
  const categories = ['Technology', 'Finance', 'Sports', 'Entertainment', 'Society']
  const sources = ['Reuters', 'AP News', 'CNN', 'BBC', 'The Guardian']
  
  return Array.from({ length: size }, (_, i) => {
    const id = (page - 1) * size + i + 1
    const category = categories[Math.floor(Math.random() * categories.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    
    return {
      id,
      title: keyword 
        ? `${keyword} related news title ${id}` 
        : `News title ${id} - Important ${category} update`,
      summary: `This is the summary of news ${id}, containing important information overview and key points...`,
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
  
  // Simulate API request
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
  // Reset state
  newsList.value = []
  currentPage.value = 1
  noMore.value = false
  
  // Load search results
  loadMoreNews()
}

const refreshNews = () => {
  searchKeyword.value = ''
  newsList.value = []
  currentPage.value = 1
  noMore.value = false
  loadMoreNews()
  ElMessage.success('News list has been refreshed')
}

const getTagType = (category) => {
  const typeMap = {
    'Technology': 'primary',
    'Finance': 'success',
    'Sports': 'warning',
    'Entertainment': 'danger',
    'Society': 'info'
  }
  return typeMap[category] || 'info'
}

// Initialize loading
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

### Image Waterfall Layout

```vue
<template>
  <div class="photo-waterfall-demo">
    <h3>Image Waterfall Layout</h3>
    
    <div class="waterfall-controls">
      <el-radio-group v-model="columns" @change="resetPhotos">
        <el-radio-button :label="2">2 Columns</el-radio-button>
        <el-radio-button :label="3">3 Columns</el-radio-button>
        <el-radio-button :label="4">4 Columns</el-radio-button>
      </el-radio-group>
      <el-button @click="resetPhotos" type="primary">
        <el-icon><Refresh /></el-icon>
        Reload
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
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-more">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>Loading more images...</span>
    </div>
    
    <!-- No more -->
    <div v-if="noMore && !loading" class="no-more">
      <el-icon><InfoFilled /></el-icon>
      <span>All images have been loaded</span>
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

// Simulate photo data
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
    const height = Math.floor(originalHeight * 0.8) // Waterfall display height
    
    return {
      id,
      title: `Beautiful Image ${id}`,
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
  
  // Simulate API request
  setTimeout(() => {
    const newPhotos = generatePhotos(currentPage.value, pageSize.value)
    
    // Simulate data loading completion
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

// Initialize loading
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

### Chat Messages with Infinite Scroll

```vue
<template>
  <div class="chat-demo">
    <h3>Chat Messages with Infinite Scroll</h3>
    
    <div class="chat-container">
      <div class="chat-header">
        <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
        <div class="chat-info">
          <span class="chat-name">Technical Discussion Group</span>
          <span class="chat-status">{{ messageList.length }} messages</span>
        </div>
        <el-button size="small" @click="scrollToBottom">
          <el-icon><Bottom /></el-icon>
          Back to Bottom
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
        <!-- Load more history messages -->
        <div v-if="loading" class="loading-history">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>Loading history messages...</span>
        </div>
        
        <div v-if="noMore && !loading" class="no-more-history">
          <span>No more history messages</span>
        </div>
        
        <!-- Message list -->
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
      
      <!-- Message input -->
      <div class="chat-input">
        <el-input
          v-model="newMessage"
          placeholder="Type a message..."
          @keyup.enter="sendMessage"
          maxlength="500"
          show-word-limit
        >
          <template #append>
            <el-button @click="sendMessage" type="primary" :disabled="!newMessage.trim()">
              Send
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

// Simulate user data
const users = [
  { id: 1, name: 'John', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 2, name: 'Sarah', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 3, name: 'Mike', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 4, name: 'Lisa', avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  { id: 5, name: 'You', avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', isOwn: true }
]

// Generate random message
const generateMessage = (page, size) => {
  const messages = []
  const startId = (page - 1) * size + 1
  const baseTime = new Date(Date.now() - page * 24 * 60 * 60 * 1000)
  
  for (let i = 0; i < size; i++) {
    const id = startId + i
    const user = users[Math.floor(Math.random() * (users.length - 1))]
    const isOwn = Math.random() > 0.7
    const selectedUser = isOwn ? users[4] : user
    
    messages.push({
      id,
      userId: selectedUser.id,
      username: selectedUser.name,
      avatar: selectedUser.avatar,
      content: `This is message #${id}. ${isOwn ? 'You sent this message.' : `${selectedUser.name} sent this message.`}`,
      time: new Date(baseTime.getTime() + i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn
    })
  }
  
  return messages
}

const loadMoreMessages = () => {
  if (loading.value || noMore.value) return
  
  loading.value = true
  
  // Simulate API request
  setTimeout(() => {
    const newMessages = generateMessage(currentPage.value, pageSize.value)
    
    // Simulate data loading completion
    if (currentPage.value >= 5) {
      noMore.value = true
    }
    
    // Prepend new messages to the beginning of the list
    messageList.value = [...newMessages, ...messageList.value]
    currentPage.value++
    loading.value = false
  }, 1000)
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: Date.now(),
    userId: users[4].id,
    username: users[4].name,
    avatar: users[4].avatar,
    content: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isOwn: true
  }
  
  messageList.value.push(message)
  newMessage.value = ''
  
  // Scroll to bottom after sending a message
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// Initialize with some messages
setTimeout(() => {
  const initialMessages = generateMessage(0, 10)
  messageList.value = initialMessages
  
  // Scroll to bottom after initial messages load
  nextTick(() => {
    scrollToBottom()
  })
}, 500)
</script>

<style scoped>
.chat-demo {
  padding: 20px;
}

.chat-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  height: 600px;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background-color: #f5f7fa;
}

.chat-info {
  flex: 1;
  min-width: 0;
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
  gap: 16px;
}

.loading-history,
.no-more-history {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  color: #909399;
  font-size: 12px;
}

.message-item {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.message-item.is-own {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-name {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.message-bubble {
  background-color: #f0f9ff;
  padding: 10px 12px;
  border-radius: 8px;
  border-top-left-radius: 2px;
  color: #303133;
  word-break: break-word;
}

.message-bubble.is-own {
  background-color: #ecf5ff;
  border-top-right-radius: 2px;
  border-top-left-radius: 8px;
}

.message-time {
  font-size: 11px;
  color: #c0c4cc;
  align-self: flex-end;
  margin: 0 8px;
}

.chat-input {
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
}
</style>
```

## API Documentation

### Directive Arguments

| Name | Description | Type | Default |
|------|------|------|--------|
| v-infinite-scroll | Callback function when scrolling to the bottom | Function | — |
| infinite-scroll-disabled | Whether to disable infinite scroll | Boolean | false |
| infinite-scroll-delay | Throttle delay (ms) | Number | 200 |
| infinite-scroll-distance | Trigger distance (px) | Number | 0 |
| infinite-scroll-immediate | Whether to execute the loading method immediately | Boolean | true |

## Best Practices

### When to Use Infinite Scroll

Infinite scroll is particularly useful in the following scenarios:

1. **Content Feeds**: Social media feeds, news articles, blog posts, etc.
2. **Image Galleries**: Photo collections, product listings with images
3. **Search Results**: When displaying large sets of search results
4. **Chat Applications**: Loading message history as the user scrolls up
5. **Product Listings**: E-commerce product catalogs with many items

### When to Use Pagination Instead

While infinite scroll improves the browsing experience in many cases, traditional pagination might be more appropriate in some scenarios:

1. **Data-heavy Applications**: Where users need to reference specific pages or positions
2. **Printable Content**: When users might want to print the content
3. **SEO Requirements**: When search engine optimization is critical
4. **Performance Concerns**: When loading too many items could impact performance

### Performance Optimization

To ensure smooth performance when using infinite scroll:

1. **Limit Batch Size**: Load a reasonable number of items per batch (10-20 items)
2. **Use Virtual Scrolling**: For extremely large lists, consider combining infinite scroll with virtual scrolling
3. **Implement Throttling**: Use the built-in delay parameter to prevent excessive API calls
4. **Clean Up Old Items**: Consider removing items that are far out of view to save memory
5. **Optimize Images**: Use lazy loading for images and optimize their size
6. **Show Loading States**: Always provide visual feedback during loading

```javascript
// Example of cleaning up old items when the list gets too large
const MAX_ITEMS = 200
const cleanupList = () => {
  if (list.value.length > MAX_ITEMS) {
    // Remove items from the beginning of the list
    list.value = list.value.slice(-MAX_ITEMS)
  }
}
```

### User Experience Considerations

1. **Loading Indicators**: Always show a loading indicator when fetching more data
2. **Error Handling**: Provide clear error messages and retry options if loading fails
3. **End of Content**: Clearly indicate when there is no more content to load
4. **Scroll Position**: Maintain scroll position when new content is loaded
5. **Back Button Behavior**: Consider how the back button will work with infinite scroll
6. **Initial Load**: Load enough content initially to fill the viewport

```vue
<template>
  <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading || noMore">
    <!-- Content items -->
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-indicator">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>Loading more items...</span>
    </div>
    
    <!-- Error state -->
    <div v-if="error" class="error-state">
      <span>Failed to load items</span>
      <el-button size="small" @click="retry">Retry</el-button>
    </div>
    
    <!-- End of content -->
    <div v-if="noMore && !loading" class="end-of-content">
      <span>You've reached the end</span>
    </div>
  </div>
</template>
```

### Accessibility Considerations

1. **Keyboard Navigation**: Ensure content is navigable via keyboard
2. **Screen Reader Support**: Announce new content as it loads
3. **Focus Management**: Maintain focus position when new content is loaded
4. **Alternative Navigation**: Provide alternative navigation methods for users who prefer them

## Summary

The Infinite Scroll directive is a powerful tool for enhancing the user experience when dealing with large data sets. By automatically loading more content as the user scrolls, it creates a seamless browsing experience without the need for manual pagination.

Through this document, you should be able to:

1. Implement basic infinite scrolling functionality
2. Configure loading distance, delay, and disable conditions
3. Handle loading states and end-of-content scenarios
4. Apply infinite scroll in practical applications like news feeds, image galleries, and chat interfaces
5. Optimize performance and user experience

When implemented correctly, infinite scroll can significantly improve user engagement by reducing friction in content consumption. However, it's important to consider performance implications and ensure the implementation follows best practices for accessibility and user experience.

## References

- [Element Plus Infinite Scroll Official Documentation](https://element-plus.org/en-US/component/infinite-scroll.html)
- [Web Accessibility Guidelines for Infinite Scroll](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html)
- [Performance Optimization for Long Lists](https://web.dev/virtualize-lists-with-vue-virtual-scroller/)
