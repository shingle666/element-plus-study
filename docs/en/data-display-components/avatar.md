# Avatar

## Overview

The Avatar component can be used to represent people or objects, supporting the use of images, icons, or text as avatars. It is a commonly used user interface element, widely applied in user information display, comment systems, team member displays, and other scenarios.

## Learning Objectives

Through this document, you will master:

1. Basic usage and configuration of the Avatar component
2. Setting different shapes and sizes of avatars
3. Using different display types: images, icons, and text
4. Fallback handling when image loading fails
5. How avatars adapt to containers
6. Practical application scenarios for the Avatar component

## Basic Usage

### Basic Avatar

Use the `shape` and `size` attributes to set the Avatar's shape and size:

```vue
<template>
  <div class="avatar-demo">
    <h4>Basic Avatar</h4>
    <div class="avatar-group">
      <el-avatar :size="50" :src="circleUrl" />
      <el-avatar :size="50" :src="squareUrl" shape="square" />
    </div>
    
    <h4>Different Sizes</h4>
    <div class="avatar-group">
      <el-avatar :size="30" :src="circleUrl" />
      <el-avatar :size="40" :src="circleUrl" />
      <el-avatar :size="50" :src="circleUrl" />
      <el-avatar :size="60" :src="circleUrl" />
      <el-avatar :size="70" :src="circleUrl" />
    </div>
    
    <h4>Preset Sizes</h4>
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

### Display Types

Support using images, icons, or text as Avatar:

```vue
<template>
  <div class="avatar-types-demo">
    <h4>Different Display Types</h4>
    
    <!-- Image Avatar -->
    <div class="type-section">
      <h5>Image Avatar</h5>
      <div class="avatar-group">
        <el-avatar :size="50" :src="userAvatar" />
        <el-avatar :size="50" :src="userAvatar" shape="square" />
      </div>
    </div>
    
    <!-- Icon Avatar -->
    <div class="type-section">
      <h5>Icon Avatar</h5>
      <div class="avatar-group">
        <el-avatar :size="50" :icon="UserFilled" />
        <el-avatar :size="50" :icon="UserFilled" shape="square" />
        <el-avatar :size="50" :icon="Avatar" background-color="#87d068" />
        <el-avatar :size="50" :icon="Setting" background-color="#f56c6c" />
      </div>
    </div>
    
    <!-- Text Avatar -->
    <div class="type-section">
      <h5>Text Avatar</h5>
      <div class="avatar-group">
        <el-avatar :size="50">Z</el-avatar>
        <el-avatar :size="50" shape="square">L</el-avatar>
        <el-avatar :size="50" background-color="#409eff">W</el-avatar>
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

## Fallback Behavior

Handling fallback behavior when image loading fails:

```vue
<template>
  <div class="avatar-fallback-demo">
    <h4>Image Loading Failure Fallback</h4>
    
    <div class="fallback-examples">
      <!-- Normal loading image -->
      <div class="example-item">
        <el-avatar :size="60" :src="validImageUrl" @error="handleError" />
        <p>Normal Image</p>
      </div>
      
      <!-- Failed loading image (fallback to icon) -->
      <div class="example-item">
        <el-avatar :size="60" :src="invalidImageUrl" :icon="UserFilled" @error="handleError" />
        <p>Fallback to Icon</p>
      </div>
      
      <!-- Failed loading image (fallback to text) -->
      <div class="example-item">
        <el-avatar :size="60" :src="invalidImageUrl" @error="handleError">
          User
        </el-avatar>
        <p>Fallback to Text</p>
      </div>
      
      <!-- Custom error handling -->
      <div class="example-item">
        <el-avatar 
          :size="60" 
          :src="errorImageUrl" 
          @error="handleCustomError"
        >
          {{ errorText }}
        </el-avatar>
        <p>Custom Error Handling</p>
      </div>
    </div>
    
    <div class="error-log" v-if="errorMessages.length > 0">
      <h5>Error Log:</h5>
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
  console.log('Image loading failed:', event)
  const message = `Image loading failed: ${event.target.src}`
  errorMessages.value.push(message)
  ElMessage.warning('Image loading failed, default content displayed')
}

const handleCustomError = (event) => {
  console.log('Custom error handling:', event)
  errorText.value = '404'
  const message = `Custom handling: ${new Date().toLocaleTimeString()}`
  errorMessages.value.push(message)
  ElMessage.error('Image loading failed, switched to error state')
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

## Adapting to Container

When using an image as a user avatar, set how the image is displayed in the container:

```vue
<template>
  <div class="avatar-fit-demo">
    <h4>Image Adaptation to Container</h4>
    
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
    
    <h4>Adaptation Effects for Different Image Ratios</h4>
    <div class="ratio-examples">
      <div class="ratio-section">
        <h5>Landscape Image (16:9)</h5>
        <div class="avatar-group">
          <el-avatar :size="60" :src="landscapeImage" fit="fill" />
          <el-avatar :size="60" :src="landscapeImage" fit="contain" />
          <el-avatar :size="60" :src="landscapeImage" fit="cover" />
          <el-avatar :size="60" :src="landscapeImage" fit="scale-down" />
        </div>
      </div>
      
      <div class="ratio-section">
        <h5>Portrait Image (9:16)</h5>
        <div class="avatar-group">
          <el-avatar :size="60" :src="portraitImage" fit="fill" />
          <el-avatar :size="60" :src="portraitImage" fit="contain" />
          <el-avatar :size="60" :src="portraitImage" fit="cover" />
          <el-avatar :size="60" :src="portraitImage" fit="scale-down" />
        </div>
      </div>
      
      <div class="ratio-section">
        <h5>Square Image (1:1)</h5>
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
    description: 'Stretch to fill container'
  },
  {
    value: 'contain',
    label: 'contain',
    description: 'Keep aspect ratio, show completely'
  },
  {
    value: 'cover',
    label: 'cover',
    description: 'Keep aspect ratio, crop to fill'
  },
  {
    value: 'none',
    label: 'none',
    description: 'Keep original size'
  },
  {
    value: 'scale-down',
    label: 'scale-down',
    description: 'Scale down to fit'
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

## Practical Application Examples

### User Information Card

```vue
<template>
  <div class="user-card-demo">
    <h4>User Information Card</h4>
    
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
                {{ user.status === 'online' ? 'Online' : 'Offline' }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-value">{{ user.posts }}</span>
            <span class="stat-label">Posts</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.followers }}</span>
            <span class="stat-label">Followers</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ user.following }}</span>
            <span class="stat-label">Following</span>
          </div>
        </div>
        
        <div class="user-actions">
          <el-button size="small" type="primary">Follow</el-button>
          <el-button size="small">Message</el-button>
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
    name: 'John Doe',
    role: 'Frontend Developer',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    status: 'online',
    posts: 128,
    followers: 1234,
    following: 567
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'UI/UX Designer',
    avatar: '', // Empty avatar, test fallback
    status: 'offline',
    posts: 89,
    followers: 892,
    following: 234
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Product Manager',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    status: 'online',
    posts: 156,
    followers: 2341,
    following: 789
  }
])

const handleAvatarError = (event) => {
  console.log('Avatar loading failed:', event)
  ElMessage.warning('Avatar loading failed, displaying default avatar')
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

### Comment List

```vue
<template>
  <div class="comment-list-demo">
    <h4>Comment List</h4>
    
    <div class="comment-list">
      <div class="comment-item" v-for="comment in comments" :key="comment.id">
        <el-avatar 
          :size="40"
          :src="comment.user.avatar"
          :alt="`${comment.user.name}'s avatar`"
          role="img"
          :aria-label="`User ${comment.user.name}`"
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
              Reply
            </el-button>
          </div>
          
          <!-- Reply list -->
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
      name: 'John Doe',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    content: 'This article is well-written, I learned a lot of new knowledge!',
    likes: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    replies: [
      {
        id: 11,
        user: {
          name: 'Author',
          avatar: ''
        },
        content: 'Thank you for your support!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ]
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      avatar: ''
    },
    content: 'Element Plus components are indeed very useful, especially the fallback mechanism of this Avatar component is very thoughtful.',
    likes: 8,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    replies: []
  },
  {
    id: 3,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    content: 'The code examples are very detailed and can be used directly. I hope to see more tutorials like this.',
    likes: 15,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    replies: []
  }
])

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes} minutes ago`
  } else if (hours < 24) {
    return `${hours} hours ago`
  } else {
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }
}

const likeComment = (comment) => {
  comment.likes++
  ElMessage.success('Like successful')
}

const replyComment = (comment) => {
  ElMessage.info(`Reply to ${comment.user.name}'s comment`)
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

### Responsive Design

```vue
<template>
  <div class="responsive-avatar-demo">
    <h4>Responsive Avatar Design</h4>
    
    <div class="responsive-section">
      <h5>Desktop View</h5>
      <div class="avatar-group avatar-responsive desktop">
        <el-avatar :src="userAvatar" class="user-avatar" />
        <span class="username">John Doe</span>
      </div>
    </div>
    
    <div class="responsive-section">
      <h5>Tablet View</h5>
      <div class="avatar-group avatar-responsive tablet">
        <el-avatar :src="userAvatar" class="user-avatar" />
        <span class="username">John Doe</span>
      </div>
    </div>
    
    <div class="responsive-section">
      <h5>Mobile View</h5>
      <div class="avatar-group avatar-responsive mobile">
        <el-avatar :src="userAvatar" class="user-avatar" />
        <span class="username">John Doe</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
</script>

<style scoped>
.responsive-avatar-demo {
  padding: 20px;
}

.responsive-avatar-demo h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.responsive-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.responsive-section h5 {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.avatar-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-responsive {
  --avatar-size: 40px;
}

.avatar-responsive.desktop {
  --avatar-size: 48px;
}

.avatar-responsive.tablet {
  --avatar-size: 40px;
}

.avatar-responsive.mobile {
  --avatar-size: 32px;
}

.avatar-responsive .el-avatar {
  width: var(--avatar-size) !important;
  height: var(--avatar-size) !important;
  font-size: calc(var(--avatar-size) * 0.4);
}

.username {
  font-size: calc(var(--avatar-size) * 0.45);
}

/* Responsive media queries */
@media (max-width: 768px) {
  .avatar-responsive.desktop {
    --avatar-size: 40px;
  }
  
  .avatar-responsive.tablet {
    --avatar-size: 36px;
  }
  
  .avatar-responsive.mobile {
    --avatar-size: 28px;
  }
}

@media (max-width: 480px) {
  .avatar-responsive.desktop {
    --avatar-size: 36px;
  }
  
  .avatar-responsive.tablet {
    --avatar-size: 32px;
  }
  
  .avatar-responsive.mobile {
    --avatar-size: 24px;
  }
}
</style>
```

## API Documentation

### Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| icon | Set the Avatar's icon type, refer to the Icon component | string / Component | — |
| size | Avatar size | number / enum | default |
| shape | Avatar shape | enum | circle |
| src | Avatar image source | string | — |
| src-set | Native srcset attribute for image Avatar | string | — |
| alt | Native alt attribute for image Avatar | string | — |
| fit | How the image fits in the container when the display type is an image | enum | cover |

#### Size Options

- `large` / `default` / `small`
- Or numeric value (pixels)

#### Shape Options

- `circle`
- `square`

#### Fit Options

- `fill`: Stretch to fill container
- `contain`: Keep aspect ratio, show completely
- `cover`: Keep aspect ratio, crop to fill
- `none`: Keep original size
- `scale-down`: Scale down to fit

### Events

| Event Name | Description | Type |
|--------|------|------|
| error | Triggered when image loading fails | Function |

### Slots

| Slot Name | Description |
|--------|------|
| default | Custom avatar display content |

## Best Practices

### 1. Size Selection

```javascript
// Choose appropriate sizes based on usage scenarios
const avatarSizes = {
  // User list, comment section
  small: 32,
  // User info card, navigation bar
  default: 40,
  // Profile page, detail page
  large: 64,
  // Special display scenarios
  xlarge: 80
}
```

### 2. Fallback Strategy

```vue
<template>
  <!-- Recommended fallback strategy: Image -> Icon -> Text -->
  <el-avatar 
    :src="user.avatar"
    :icon="UserFilled"
    @error="handleError"
  >
    {{ user.name.charAt(0) }}
  </el-avatar>
</template>
```

### 3. Performance Optimization

```javascript
// Use appropriate image sizes
const getOptimizedAvatarUrl = (originalUrl, size) => {
  // Request images of corresponding size based on display size
  return `${originalUrl}?w=${size * 2}&h=${size * 2}` // 2x image for high-DPI screens
}

// Lazy load avatars
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

### 4. Accessibility

```vue
<template>
  <el-avatar 
    :src="user.avatar"
    :alt="`${user.name}'s avatar`"
    role="img"
    :aria-label="`User ${user.name}`"
  >
    {{ user.name.charAt(0) }}
  </el-avatar>
</template>
```

## Common Issues

### 1. Blurry Image Display

**Issue**: Avatar images appear blurry on high-DPI screens.

**Solution**:
```javascript
// Use 2x or higher resolution images
const getHighDPIAvatar = (url, size) => {
  const dpr = window.devicePixelRatio || 1
  const targetSize = size * dpr
  return `${url}?w=${targetSize}&h=${targetSize}`
}
```

### 2. Loading Performance Issues

**Issue**: Loading many avatars simultaneously causes page lag.

**Solution**:
```javascript
// Implement avatar lazy loading
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

### 3. Text Avatar Font Size

**Issue**: Text avatar font size is inconsistent across different sizes.

**Solution**:
```css
/* Automatically adjust font size based on avatar size */
.el-avatar {
  font-size: calc(var(--el-avatar-size, 40px) * 0.4);
}

/* Or use JavaScript to dynamically calculate */
.avatar-text {
  font-size: calc(100% * 0.4);
}
```

## Summary

The Avatar component is an important element in user interfaces. Through this document, you should be able to:

1. Master the basic usage and various configuration options of the Avatar component
2. Understand different display types (image, icon, text) and their usage scenarios
3. Implement elegant fallback handling when image loading fails
4. Choose appropriate shapes and sizes based on business requirements
5. Apply the Avatar component in actual projects to build user information displays
6. Optimize avatar component performance and user experience

In actual development, it is recommended to configure the Avatar component's attributes according to specific design specifications and user experience requirements, and pay attention to performance optimization and accessibility.

## References

- [Element Plus Avatar Official Documentation](https://element-plus.org/en-US/component/avatar.html)
- [CSS object-fit Property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- [Web Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
