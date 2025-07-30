# Avatar 头像

## 概述

Avatar 头像组件可以用来代表人物或对象，支持使用图片、图标或者文字作为 Avatar。它是一个常用的用户界面元素，广泛应用于用户信息展示、评论系统、团队成员展示等场景。

## 学习目标

通过本文档的学习，你将掌握：

1. Avatar 组件的基础用法和配置
2. 不同形状和尺寸的头像设置
3. 图片、图标、文字等不同展示类型的使用
4. 图片加载失败时的回退处理
5. 头像在容器中的适应方式
6. Avatar 组件的实际应用场景

## 基础用法

### 基础头像

使用 `shape` 和 `size` 属性来设置 Avatar 的形状和大小：

```vue
<template>
  <div class="avatar-demo">
    <h4>基础头像</h4>
    <div class="avatar-group">
      <el-avatar :size="50" :src="circleUrl" />
      <el-avatar :size="50" :src="squareUrl" shape="square" />
    </div>
    
    <h4>不同尺寸</h4>
    <div class="avatar-group">
      <el-avatar :size="30" :src="circleUrl" />
      <el-avatar :size="40" :src="circleUrl" />
      <el-avatar :size="50" :src="circleUrl" />
      <el-avatar :size="60" :src="circleUrl" />
      <el-avatar :size="70" :src="circleUrl" />
    </div>
    
    <h4>预设尺寸</h4>
    <div class="avatar-group">
      <el-avatar size="small" :src="circleUrl" />
      <el-avatar size="default" :src="circleUrl" />
      <el-avatar size="large" :src="circleUrl" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const squareUrl = ref('https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
</script>

<style scoped>
.avatar-demo {
  padding: 20px;
}

.avatar-demo h4 {
  margin: 20px 0 10px 0;
  color: #303133;
}

.avatar-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
</style>
```

### 展示类型

支持使用图片、图标或者文字作为 Avatar：

```vue
<template>
  <div class="avatar-types-demo">
    <h4>不同展示类型</h4>
    
    <!-- 图片头像 -->
    <div class="type-section">
      <h5>图片头像</h5>
      <div class="avatar-group">
        <el-avatar :size="50" :src="userAvatar" />
        <el-avatar :size="50" :src="userAvatar" shape="square" />
      </div>
    </div>
    
    <!-- 图标头像 -->
    <div class="type-section">
      <h5>图标头像</h5>
      <div class="avatar-group">
        <el-avatar :size="50" :icon="UserFilled" />
        <el-avatar :size="50" :icon="UserFilled" shape="square" />
        <el-avatar :size="50" :icon="Avatar" background-color="#87d068" />
        <el-avatar :size="50" :icon="Setting" background-color="#f56c6c" />
      </div>
    </div>
    
    <!-- 文字头像 -->
    <div class="type-section">
      <h5>文字头像</h5>
      <div class="avatar-group">
        <el-avatar :size="50">张</el-avatar>
        <el-avatar :size="50" shape="square">李</el-avatar>
        <el-avatar :size="50" background-color="#409eff">王</el-avatar>
        <el-avatar :size="50" background-color="#67c23a">Admin</el-avatar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled, Avatar, Setting } from '@element-plus/icons-vue'

const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
</script>

<style scoped>
.avatar-types-demo {
  padding: 20px;
}

.avatar-types-demo h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.type-section {
  margin-bottom: 25px;
}

.type-section h5 {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.avatar-group {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
```

## 回退行为

图片加载失败时的回退行为处理：

```vue
<template>
  <div class="avatar-fallback-demo">
    <h4>图片加载失败回退</h4>
    
    <div class="fallback-examples">
      <!-- 正常加载的图片 -->
      <div class="example-item">
        <el-avatar :size="60" :src="validImageUrl" @error="handleError" />
        <p>正常图片</p>
      </div>
      
      <!-- 加载失败的图片（回退到图标） -->
      <div class="example-item">
        <el-avatar :size="60" :src="invalidImageUrl" :icon="UserFilled" @error="handleError" />
        <p>失败回退到图标</p>
      </div>
      
      <!-- 加载失败的图片（回退到文字） -->
      <div class="example-item">
        <el-avatar :size="60" :src="invalidImageUrl" @error="handleError">
          用户
        </el-avatar>
        <p>失败回退到文字</p>
      </div>
      
      <!-- 自定义错误处理 -->
      <div class="example-item">
        <el-avatar 
          :size="60" 
          :src="errorImageUrl" 
          @error="handleCustomError"
        >
          {{ errorText }}
        </el-avatar>
        <p>自定义错误处理</p>
      </div>
    </div>
    
    <div class="error-log" v-if="errorMessages.length > 0">
      <h5>错误日志：</h5>
      <ul>
        <li v-for="(msg, index) in errorMessages" :key="index">
          {{ msg }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const validImageUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
const invalidImageUrl = ref('https://invalid-url.com/image.png')
const errorImageUrl = ref('https://error-image.com/not-found.png')
const errorText = ref('ERR')
const errorMessages = ref([])

const handleError = (event) => {
  console.log('图片加载失败:', event)
  const message = `图片加载失败: ${event.target.src}`
  errorMessages.value.push(message)
  ElMessage.warning('图片加载失败，已显示默认内容')
}

const handleCustomError = (event) => {
  console.log('自定义错误处理:', event)
  errorText.value = '404'
  const message = `自定义处理: ${new Date().toLocaleTimeString()}`
  errorMessages.value.push(message)
  ElMessage.error('图片加载失败，已切换到错误状态')
}
</script>

<style scoped>
.avatar-fallback-demo {
  padding: 20px;
}

.avatar-fallback-demo h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.fallback-examples {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.example-item p {
  margin: 0;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.error-log {
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  padding: 15px;
}

.error-log h5 {
  margin: 0 0 10px 0;
  color: #f56c6c;
}

.error-log ul {
  margin: 0;
  padding-left: 20px;
}

.error-log li {
  color: #606266;
  font-size: 12px;
  margin-bottom: 5px;
}
</style>
```

## 适应容器

当使用图片作为用户头像时，设置该图片如何在容器中展示：

```vue
<template>
  <div class="avatar-fit-demo">
    <h4>图片适应容器</h4>
    
    <div class="fit-examples">
      <div class="fit-item" v-for="fit in fitOptions" :key="fit.value">
        <el-avatar 
          :size="80" 
          :src="landscapeImage" 
          :fit="fit.value"
          shape="square"
        />
        <p>{{ fit.label }}</p>
        <span class="fit-description">{{ fit.description }}</span>
      </div>
    </div>
    
    <h4>不同比例图片的适应效果</h4>
    <div class="ratio-examples">
      <div class="ratio-section">
        <h5>横向图片 (16:9)</h5>
        <div class="avatar-group">
          <el-avatar :size="60" :src="landscapeImage" fit="fill" />
          <el-avatar :size="60" :src="landscapeImage" fit="contain" />
          <el-avatar :size="60" :src="landscapeImage" fit="cover" />
          <el-avatar :size="60" :src="landscapeImage" fit="scale-down" />
        </div>
      </div>
      
      <div class="ratio-section">
        <h5>纵向图片 (9:16)</h5>
        <div class="avatar-group">
          <el-avatar :size="60" :src="portraitImage" fit="fill" />
          <el-avatar :size="60" :src="portraitImage" fit="contain" />
          <el-avatar :size="60" :src="portraitImage" fit="cover" />
          <el-avatar :size="60" :src="portraitImage" fit="scale-down" />
        </div>
      </div>
      
      <div class="ratio-section">
        <h5>正方形图片 (1:1)</h5>
        <div class="avatar-group">
          <el-avatar :size="60" :src="squareImage" fit="fill" />
          <el-avatar :size="60" :src="squareImage" fit="contain" />
          <el-avatar :size="60" :src="squareImage" fit="cover" />
          <el-avatar :size="60" :src="squareImage" fit="scale-down" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const landscapeImage = ref('https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg')
const portraitImage = ref('https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg')
const squareImage = ref('https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg')

const fitOptions = ref([
  {
    value: 'fill',
    label: 'fill',
    description: '拉伸填满容器'
  },
  {
    value: 'contain',
    label: 'contain',
    description: '保持比例，完整显示'
  },
  {
    value: 'cover',
    label: 'cover',
    description: '保持比例，裁剪填满'
  },
  {
    value: 'none',
    label: 'none',
    description: '保持原始尺寸'
  },
  {
    value: 'scale-down',
    label: 'scale-down',
    description: '缩小到合适尺寸'
  }
])
</script>

<style scoped>
.avatar-fit-demo {
  padding: 20px;
}

.avatar-fit-demo h4 {
  margin: 20px 0 15px 0;
  color: #303133;
}

.fit-examples {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.fit-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fafafa;
}

.fit-item p {
  margin: 0;
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.fit-description {
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.ratio-examples {
  margin-top: 30px;
}

.ratio-section {
  margin-bottom: 25px;
}

.ratio-section h5 {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.avatar-group {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
```

## 实际应用示例

### 用户信息卡片

```vue
<template>
  <div class="user-card-demo">
    <h4>用户信息卡片</h4>
    
    <div class="user-cards">
      <div class="user-card" v-for="user in users" :key="user.id">
        <div class="user-header">
          <el-avatar 
            :size="60" 
            :src="user.avatar" 
            :icon="UserFilled"
            @error="handleAvatarError"
          >
            {{ user.name.charAt(0) }}
          </el-avatar>
          <div class="user-info">
            <h5>{{ user.name }}</h5>
            <p>{{ user.role }}</p>
            <div class="user-status">
              <el-tag :type="user.status === 'online' ? 'success' : 'info'" size="small">
                {{ user.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ user.posts }}</span>
            <span class="stat-label">文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.followers }}</span>
            <span class="stat-label">关注者</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.following }}</span>
            <span class="stat-label">关注</span>
          </div>
        </div>
        
        <div class="user-actions">
          <el-button size="small" type="primary">关注</el-button>
          <el-button size="small">私信</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const users = ref([
  {
    id: 1,
    name: '张三',
    role: '前端开发工程师',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    status: 'online',
    posts: 128,
    followers: 1234,
    following: 567
  },
  {
    id: 2,
    name: '李四',
    role: 'UI/UX 设计师',
    avatar: '', // 空头像，测试回退
    status: 'offline',
    posts: 89,
    followers: 892,
    following: 234
  },
  {
    id: 3,
    name: '王五',
    role: '产品经理',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    status: 'online',
    posts: 156,
    followers: 2341,
    following: 789
  }
])

const handleAvatarError = (event) => {
  console.log('头像加载失败:', event)
  ElMessage.warning('头像加载失败，显示默认头像')
}
</script>

<style scoped>
.user-card-demo {
  padding: 20px;
}

.user-card-demo h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.user-info h5 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.user-info p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.user-status {
  margin-top: 5px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.user-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
```

### 评论列表

```vue
<template>
  <div class="comment-list-demo">
    <h4>评论列表</h4>
    
    <div class="comment-list">
      <div class="comment-item" v-for="comment in comments" :key="comment.id">
        <el-avatar 
          :size="40" 
          :src="comment.user.avatar"
          :icon="UserFilled"
          class="comment-avatar"
        >
          {{ comment.user.name.charAt(0) }}
        </el-avatar>
        
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.user.name }}</span>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          
          <div class="comment-text">
            {{ comment.content }}
          </div>
          
          <div class="comment-actions">
            <el-button text size="small" @click="likeComment(comment)">
              <el-icon><Like /></el-icon>
              {{ comment.likes }}
            </el-button>
            <el-button text size="small" @click="replyComment(comment)">
              <el-icon><ChatDotRound /></el-icon>
              回复
            </el-button>
          </div>
          
          <!-- 回复列表 -->
          <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
            <div class="reply-item" v-for="reply in comment.replies" :key="reply.id">
              <el-avatar 
                :size="32" 
                :src="reply.user.avatar"
                :icon="UserFilled"
                class="reply-avatar"
              >
                {{ reply.user.name.charAt(0) }}
              </el-avatar>
              
              <div class="reply-content">
                <div class="reply-header">
                  <span class="reply-author">{{ reply.user.name }}</span>
                  <span class="reply-time">{{ formatTime(reply.createdAt) }}</span>
                </div>
                <div class="reply-text">{{ reply.content }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserFilled, Like, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const comments = ref([
  {
    id: 1,
    user: {
      name: '张三',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    content: '这篇文章写得很好，学到了很多新知识！',
    likes: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    replies: [
      {
        id: 11,
        user: {
          name: '作者',
          avatar: ''
        },
        content: '谢谢你的支持！',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1小时前
      }
    ]
  },
  {
    id: 2,
    user: {
      name: '李四',
      avatar: ''
    },
    content: 'Element Plus 的组件确实很实用，特别是这个 Avatar 组件的回退机制设计得很贴心。',
    likes: 8,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4小时前
    replies: []
  },
  {
    id: 3,
    user: {
      name: '王五',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    content: '代码示例很详细，可以直接拿来用。希望能看到更多这样的教程。',
    likes: 15,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
    replies: []
  }
])

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    const days = Math.floor(hours / 24)
    return `${days}天前`
  }
}

const likeComment = (comment) => {
  comment.likes++
  ElMessage.success('点赞成功')
}

const replyComment = (comment) => {
  ElMessage.info(`回复 ${comment.user.name} 的评论`)
}
</script>

<style scoped>
.comment-list-demo {
  padding: 20px;
}

.comment-list-demo h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.comment-list {
  max-width: 600px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-text {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.reply-list {
  margin-top: 15px;
  padding-left: 15px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.reply-item:last-child {
  margin-bottom: 0;
}

.reply-avatar {
  flex-shrink: 0;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.reply-author {
  font-weight: 600;
  color: #303133;
  font-size: 13px;
}

.reply-time {
  font-size: 11px;
  color: #909399;
}

.reply-text {
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}
</style>
```

## API 文档

### Attributes

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| icon | 设置 Avatar 的图标类型，具体参考 Icon 组件 | string / Component | — |
| size | Avatar 大小 | number / enum | default |
| shape | Avatar 形状 | enum | circle |
| src | Avatar 图片的源地址 | string | — |
| src-set | 图片 Avatar 的原生 srcset 属性 | string | — |
| alt | 图片 Avatar 的原生 alt 属性 | string | — |
| fit | 当展示类型为图片的时候，设置图片如何适应容器 | enum | cover |

#### size 可选值

- `large` / `default` / `small`
- 或者数字值（像素）

#### shape 可选值

- `circle`（圆形）
- `square`（方形）

#### fit 可选值

- `fill`：拉伸填满容器
- `contain`：保持比例，完整显示
- `cover`：保持比例，裁剪填满
- `none`：保持原始尺寸
- `scale-down`：缩小到合适尺寸

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| error | 图片加载失败时触发 | Function |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义头像展示内容 |

## 最佳实践

### 1. 尺寸选择

```javascript
// 根据使用场景选择合适的尺寸
const avatarSizes = {
  // 用户列表、评论区
  small: 32,
  // 用户信息卡片、导航栏
  default: 40,
  // 个人资料页、详情页
  large: 64,
  // 特殊展示场景
  xlarge: 80
}
```

### 2. 回退策略

```vue
<template>
  <!-- 推荐的回退策略：图片 -> 图标 -> 文字 -->
  <el-avatar 
    :src="user.avatar"
    :icon="UserFilled"
    @error="handleError"
  >
    {{ user.name.charAt(0) }}
  </el-avatar>
</template>
```

### 3. 性能优化

```javascript
// 使用适当的图片尺寸
const getOptimizedAvatarUrl = (originalUrl, size) => {
  // 根据显示尺寸请求对应大小的图片
  return `${originalUrl}?w=${size * 2}&h=${size * 2}` // 2倍图适配高分屏
}

// 懒加载头像
const lazyLoadAvatar = {
  mounted(el) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          observer.unobserve(img)
        }
      })
    })
    observer.observe(el)
  }
}
```

### 4. 可访问性

```vue
<template>
  <el-avatar 
    :src="user.avatar"
    :alt="`${user.name}的头像`"
    role="img"
    :aria-label="`用户${user.name}`"
  >
    {{ user.name.charAt(0) }}
  </el-avatar>
</template>
```

### 5. 响应式设计

```css
/* 响应式头像尺寸 */
.avatar-responsive {
  --avatar-size: 40px;
}

@media (max-width: 768px) {
  .avatar-responsive {
    --avatar-size: 32px;
  }
}

@media (max-width: 480px) {
  .avatar-responsive {
    --avatar-size: 28px;
  }
}

.avatar-responsive .el-avatar {
  width: var(--avatar-size) !important;
  height: var(--avatar-size) !important;
  font-size: calc(var(--avatar-size) * 0.4);
}
```

## 常见问题

### 1. 图片显示模糊

**问题**：头像图片在高分屏设备上显示模糊。

**解决方案**：
```javascript
// 使用 2倍图或更高分辨率的图片
const getHighDPIAvatar = (url, size) => {
  const dpr = window.devicePixelRatio || 1
  const targetSize = size * dpr
  return `${url}?w=${targetSize}&h=${targetSize}`
}
```

### 2. 加载性能问题

**问题**：大量头像同时加载导致页面卡顿。

**解决方案**：
```javascript
// 实现头像懒加载
const useAvatarLazyLoad = () => {
  const loadedAvatars = new Set()
  
  const loadAvatar = (url) => {
    if (loadedAvatars.has(url)) return Promise.resolve()
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        loadedAvatars.add(url)
        resolve()
      }
      img.onerror = reject
      img.src = url
    })
  }
  
  return { loadAvatar }
}
```

### 3. 文字头像字体大小

**问题**：文字头像在不同尺寸下字体大小不协调。

**解决方案**：
```css
/* 根据头像尺寸自动调整字体大小 */
.el-avatar {
  font-size: calc(var(--el-avatar-size, 40px) * 0.4);
}

/* 或者使用 JavaScript 动态计算 */
.avatar-text {
  font-size: calc(100% * 0.4);
}
```

## 总结

Avatar 头像组件是用户界面中的重要元素，通过本文档的学习，你应该能够：

1. 掌握 Avatar 组件的基础用法和各种配置选项
2. 理解不同展示类型（图片、图标、文字）的使用场景
3. 实现图片加载失败时的优雅回退处理
4. 根据业务需求选择合适的形状和尺寸
5. 在实际项目中应用 Avatar 组件构建用户信息展示
6. 优化头像组件的性能和用户体验

在实际开发中，建议根据具体的设计规范和用户体验需求，合理配置 Avatar 组件的各项属性，并注意性能优化和可访问性。

## 参考资料

- [Element Plus Avatar 官方文档](https://element-plus.org/zh-CN/component/avatar.html)
- [CSS object-fit 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)
- [Web 图片优化最佳实践](https://web.dev/fast/#optimize-your-images)
- [无障碍访问指南](https://www.w3.org/WAI/WCAG21/quickref/)