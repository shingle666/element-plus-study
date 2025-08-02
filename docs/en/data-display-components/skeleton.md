# Skeleton

## Overview

The Skeleton component provided by Element Plus is used to set placeholders in positions where content needs to be loaded. Compared to traditional loading effects, skeleton screens better maintain the stability of page structure, provide a better user experience, and give users an expectation of the content that will be loaded.

## Learning Objectives

Through this documentation, you will master:
- Basic concepts and usage scenarios of Skeleton
- Basic usage and parameter configuration
- Animation effects and custom styles
- Loading state control and debounce handling
- Application examples in actual projects
- Complete API documentation and best practices

## Basic Usage

### Basic Skeleton Effect

The simplest skeleton screen usage:

```vue
<template>
  <el-skeleton />
</template>
```

### More Parameters

You can configure the number of skeleton screen paragraphs to be closer to the real rendering effect:

```vue
<template>
  <el-skeleton :rows="5" animated />
</template>
```

> The displayed number will be 1 more than the input number, with the first line being rendered as a paragraph start with a length of 33%.

### Animation Effect

Enable loading animation through the `animated` attribute:

```vue
<template>
  <div>
    <h4>Without Animation</h4>
    <el-skeleton :rows="3" />
    
    <h4>With Animation</h4>
    <el-skeleton :rows="3" animated />
  </div>
</template>
```

### Custom Style

Use the named slot `template` to customize the skeleton screen template:

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

### Loading State

Control whether to display the real content after loading through the `loading` attribute:

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

### Rendering Multiple Data

Use the `count` attribute to control how many fake data items to render:

```vue
<template>
  <el-skeleton :rows="5" :count="3" animated />
</template>
```

> **Tip**: It is not recommended to render too many fake UI elements in the browser, as this will consume more time to destroy skeleton elements, leading to performance issues. For user experience, please try to keep the `count` value small.

### Preventing Rendering Jitter

Avoid interface flickering caused by too-fast API requests through the `throttle` attribute:

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

### Initial Rendering Loading

When the initial value is `loading: true`, you can set `throttle: {initVal: true, leading: xxx}` to control the immediate display of the initial skeleton screen:

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

## Practical Application Examples

### Article List Skeleton Screen

```vue
<template>
  <div class="article-list">
    <div class="toolbar">
      <el-button @click="loadArticles" :loading="loading">
        {{ loading ? 'Loading...' : 'Refresh Articles' }}
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
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  articles.value = [
    {
      id: 1,
      title: 'Vue 3 New Features Explained',
      summary: 'Deep dive into the new features and improvements in Vue 3...',
      author: 'John Doe',
      publishTime: '2024-01-15',
      cover: 'https://via.placeholder.com/120x80'
    },
    {
      id: 2,
      title: 'Element Plus Component Library Practice',
      summary: 'How to efficiently use Element Plus in your projects...',
      author: 'Jane Smith',
      publishTime: '2024-01-14',
      cover: 'https://via.placeholder.com/120x80'
    },
    {
      id: 3,
      title: 'Frontend Performance Optimization Guide',
      summary: 'Best practices for improving web application performance...',
      author: 'Mike Johnson',
      publishTime: '2024-01-13',
      cover: 'https://via.placeholder.com/120x80'
    }
  ]
  
  loading.value = false
}

// Initial loading
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

### User Information Card Skeleton Screen

```vue
<template>
  <div class="user-profile">
    <el-button @click="loadUserInfo" :loading="loading">
      {{ loading ? 'Loading...' : 'Load User Information' }}
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
              <el-button size="small" type="primary">Follow</el-button>
              <el-button size="small">Message</el-button>
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
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  userInfo.value = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    department: 'Frontend Development',
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

## API Documentation

### Skeleton Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| animated | Whether to use animation | `boolean` | `false` |
| count | How many templates to render, it's advised to use as small number as possible | `number` | `1` |
| loading | Whether to display the DOM structure after loading is complete | `boolean` | `false` |
| rows | Number of skeleton screen paragraphs | `number` | `3` |
| throttle | Rendering delay (in milliseconds). A number represents delay display, or it can be set as delay hide, e.g. `{ leading: 500, trailing: 500 }`. When you need to control the initial loading value, you can set `{ initVal: true }` | `number / object` | `0` |

### Skeleton Slots

| Slot Name | Description | Scope |
|-----------|-------------|-------|
| default | The real DOM to be rendered | `object` |
| template | Content for rendering the skeleton template | `object` |

### SkeletonItem Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| variant | The current rendering skeleton type | `'p' / 'text' / 'h1' / 'h3' / 'caption' / 'button' / 'image' / 'circle' / 'rect'` | `'text'` |

## Best Practices

### Design Principles

1. **Structural Similarity**: Skeleton screens should be as close as possible to the structure and layout of the real content
2. **Reasonable Loading Time**: Use `throttle` to avoid flickering caused by too-fast loading
3. **Moderate Animation**: Animation can enhance the experience, but should not be too flashy to affect performance

### Performance Optimization

1. **Control Quantity**: Avoid rendering too many skeleton screen elements at the same time
2. **Reasonable use of count**: The `count` attribute should be set according to actual needs, not too large
3. **Timely Destruction**: Switch to real content promptly after loading is complete

### User Experience

1. **Expectation Management**: Skeleton screens should give users a reasonable expectation of the content to be loaded
2. **Loading Feedback**: Combine with appropriate loading prompt text or progress indicators
3. **Error Handling**: There should be corresponding error states when loading fails

### Responsive Design

1. **Mobile Adaptation**: Adjust the size and layout of skeleton screens on mobile devices
2. **Flexible Layout**: Use flexible layouts to ensure performance on different screen sizes
3. **Content Priority**: Prioritize displaying skeletons for important content on small screens

## Common Issues

### Skeleton Screen Not Displaying

**Issue**: Set `loading="true"` but the skeleton screen does not display

**Solutions**:
1. Check if the `loading` attribute is correctly bound
2. Confirm if there is a custom template but the template is empty
3. Check if CSS styles affect the display

```vue
<!-- Incorrect example -->
<el-skeleton loading="true" />

<!-- Correct example -->
<el-skeleton :loading="true" />
```

### Custom Template Not Working

**Issue**: Used the `template` slot but still showing the default style

**Solutions**: Ensure the slot name is correct and contains valid skeleton elements

```vue
<!-- Incorrect example -->
<el-skeleton>
  <template #default>
    <el-skeleton-item variant="text" />
  </template>
</el-skeleton>

<!-- Correct example -->
<el-skeleton>
  <template #template>
    <el-skeleton-item variant="text" />
  </template>
</el-skeleton>
```

### Animation Performance Issues

**Issue**: Page stutters after enabling animation

**Solutions**:
1. Reduce the number of skeleton screens displayed simultaneously
2. Optimize the complexity of custom templates
3. Consider disabling animation on low-performance devices

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
  // Detect device performance
  isLowPerformance.value = navigator.hardwareConcurrency < 4
})
</script>
```

### Debounce Setting Not Working

**Issue**: Set `throttle` but still have flickering

**Solutions**: Correctly configure throttle parameters

```vue
<!-- Basic debounce -->
<el-skeleton :throttle="500" />

<!-- Advanced debounce configuration -->
<el-skeleton :throttle="{ leading: 500, trailing: 300 }" />

<!-- Initial loading debounce -->
<el-skeleton :throttle="{ initVal: true, leading: 500 }" />
```

## Summary

The Skeleton component is an important component for enhancing user experience, providing better visual feedback when content is loading. Through this documentation, you should be able to:

1. Understand the design philosophy and usage scenarios of skeleton screens
2. Master basic usage and advanced configuration
3. Implement custom skeleton screen templates
4. Reasonably use debounce and performance optimization
5. Apply skeleton screens in actual projects to enhance user experience

In actual development, it is recommended to design corresponding skeleton screens according to specific content structures, pay attention to the balance between performance and user experience, and ensure that skeleton screens can truly enhance rather than affect user experience.

## References

- [Element Plus Skeleton Official Documentation](https://element-plus.org/en-US/component/skeleton.html)
- [Skeleton Screen Design Guide](https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a)
- [Web Performance Optimization Best Practices](https://web.dev/performance/)