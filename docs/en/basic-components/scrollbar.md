# Scrollbar Component

## Learning Objectives
- Master the use of Element Plus Scrollbar component
- Understand the basic and advanced usage of scrollbars
- Learn how to customize scrollbar appearance and behavior
- Implement virtual scrolling for large data sets
- Apply best practices for scrollbar accessibility

## Detailed Learning Content

### 1. Scrollbar Component Basics (30 minutes)

#### 1.1 Basic Usage

The Scrollbar component provides a custom scrollbar that can replace the browser's native scrollbar.

```vue
<template>
  <div class="scrollbar-demo-basic">
    <el-scrollbar height="400px">
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </el-scrollbar>
  </div>
</template>

<style>
.scrollbar-demo-basic {
  width: 300px;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
}
</style>
```

#### 1.2 Horizontal Scrollbar

```vue
<template>
  <div class="scrollbar-demo-horizontal">
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
          {{ item }}
        </p>
      </div>
    </el-scrollbar>
  </div>
</template>

<style>
.scrollbar-demo-horizontal {
  width: 100%;
}

.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
}
</style>
```

#### 1.3 Maximum Height

When the content exceeds the maximum height, the scrollbar will appear.

```vue
<template>
  <div class="scrollbar-demo-max-height">
    <el-scrollbar max-height="400px">
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </el-scrollbar>
  </div>
</template>
```

### 2. Advanced Scrollbar Features (40 minutes)

#### 2.1 Manual Scroll Control

You can programmatically control the scrollbar position using the `setScrollTop` and `setScrollLeft` methods.

```vue
<template>
  <div class="scrollbar-demo-control">
    <el-scrollbar ref="scrollbarRef" height="400px">
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </el-scrollbar>
    
    <div class="scrollbar-control-panel">
      <el-button @click="scrollToTop">Scroll to Top</el-button>
      <el-button @click="scrollToBottom">Scroll to Bottom</el-button>
      <el-button @click="scrollToPosition">Scroll to Item #10</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollbarRef = ref(null)

const scrollToTop = () => {
  scrollbarRef.value.setScrollTop(0)
}

const scrollToBottom = () => {
  const scrollbar = scrollbarRef.value
  const { scrollHeight, clientHeight } = scrollbar.wrap
  scrollbar.setScrollTop(scrollHeight - clientHeight)
}

const scrollToPosition = () => {
  // Scroll to the 10th item (approximately)
  scrollbarRef.value.setScrollTop(10 * 60 - 60)
}
</script>

<style>
.scrollbar-control-panel {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
```

#### 2.2 Scroll Events

You can listen to scroll events to implement features like infinite scrolling or lazy loading.

```vue
<template>
  <div class="scrollbar-demo-events">
    <el-scrollbar 
      height="400px" 
      @scroll="handleScroll"
      ref="scrollbarRef"
    >
      <p v-for="item in items" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
      <div v-if="loading" class="loading-indicator">
        Loading more items...
      </div>
    </el-scrollbar>
    
    <div class="scroll-info">
      <p>Scroll Position: {{ scrollPosition.top }}px</p>
      <p>Scroll Percentage: {{ scrollPercentage }}%</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scrollbarRef = ref(null)
const items = ref(Array.from({ length: 20 }, (_, i) => i + 1))
const loading = ref(false)
const scrollPosition = ref({ top: 0, left: 0 })

const scrollPercentage = computed(() => {
  if (!scrollbarRef.value) return 0
  
  const { scrollTop, scrollHeight, clientHeight } = scrollbarRef.value.wrap
  return Math.round((scrollTop / (scrollHeight - clientHeight)) * 100) || 0
})

const handleScroll = ({ scrollTop, scrollLeft }) => {
  scrollPosition.value = { top: scrollTop, left: scrollLeft }
  
  // Check if we're near the bottom to load more items
  const { scrollHeight, clientHeight } = scrollbarRef.value.wrap
  const bottomThreshold = 50 // pixels from bottom
  
  if (scrollHeight - scrollTop - clientHeight < bottomThreshold) {
    loadMoreItems()
  }
}

const loadMoreItems = () => {
  if (loading.value) return
  
  loading.value = true
  
  // Simulate API call with timeout
  setTimeout(() => {
    const lastItem = items.value.length
    const newItems = Array.from({ length: 10 }, (_, i) => lastItem + i + 1)
    items.value = [...items.value, ...newItems]
    loading.value = false
  }, 1000)
}
</script>

<style>
.loading-indicator {
  text-align: center;
  padding: 10px;
  color: #909399;
}

.scroll-info {
  margin-top: 20px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>
```

#### 2.3 Custom Scrollbar Styling

You can customize the appearance of the scrollbar using CSS.

```vue
<template>
  <div class="scrollbar-demo-custom">
    <el-scrollbar 
      height="400px" 
      always
      class="custom-scrollbar"
    >
      <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
        {{ item }}
      </p>
    </el-scrollbar>
  </div>
</template>

<style>
.custom-scrollbar .el-scrollbar__bar.is-vertical {
  width: 8px;
}

.custom-scrollbar .el-scrollbar__bar.is-horizontal {
  height: 8px;
}

.custom-scrollbar .el-scrollbar__thumb {
  background-color: #6b778c;
  opacity: 0.8;
  border-radius: 4px;
}

.custom-scrollbar .el-scrollbar__thumb:hover {
  background-color: #409eff;
  opacity: 1;
}

.custom-scrollbar .el-scrollbar__wrap {
  scrollbar-width: none; /* Firefox */
}

.custom-scrollbar .el-scrollbar__wrap::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>
```

### 3. Virtual Scrolling Implementation (50 minutes)

#### 3.1 Basic Virtual Scrolling

For large data sets, virtual scrolling can significantly improve performance by only rendering visible items.

```vue
<template>
  <div class="virtual-scroll-demo">
    <el-scrollbar 
      ref="scrollbarRef" 
      height="400px"
      @scroll="handleScroll"
    >
      <div 
        class="virtual-scroll-container" 
        :style="{ height: totalHeight + 'px' }"
      >
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          class="virtual-scroll-item"
          :style="{ 
            transform: `translateY(${item.offset}px)`,
            height: `${itemHeight}px`
          }"
        >
          Item #{{ item.id }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Configuration
const itemHeight = 50
const bufferSize = 5 // Number of items to render above and below visible area
const totalItems = 10000

// Data
const scrollbarRef = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(400)

// Calculate total height of all items
const totalHeight = computed(() => totalItems * itemHeight)

// Calculate which items should be visible
const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight) - bufferSize
  const end = Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + bufferSize
  
  const startIndex = Math.max(0, start)
  const endIndex = Math.min(totalItems - 1, end)
  
  const items = []
  for (let i = startIndex; i <= endIndex; i++) {
    items.push({
      id: i + 1,
      offset: i * itemHeight
    })
  }
  
  return items
})

const handleScroll = ({ scrollTop: newScrollTop }) => {
  scrollTop.value = newScrollTop
}

onMounted(() => {
  if (scrollbarRef.value) {
    containerHeight.value = scrollbarRef.value.wrap.clientHeight
  }
})
</script>

<style>
.virtual-scroll-container {
  position: relative;
}

.virtual-scroll-item {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #ecf5ff;
  color: #409eff;
  margin: 5px;
  border-radius: 4px;
}
</style>
```

#### 3.2 Advanced Virtual Scrolling with Variable Heights

```vue
<template>
  <div class="variable-height-scroll-demo">
    <el-scrollbar 
      ref="scrollbarRef" 
      height="400px"
      @scroll="handleScroll"
    >
      <div 
        class="virtual-scroll-container" 
        :style="{ height: totalHeight + 'px' }"
      >
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          class="virtual-scroll-item"
          :style="{ 
            transform: `translateY(${item.offset}px)`,
            height: `${item.height}px`
          }"
        >
          <div class="item-content">
            <h3>Item #{{ item.id }}</h3>
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Generate sample data with variable heights
const generateItems = (count) => {
  const items = []
  let currentOffset = 0
  
  for (let i = 0; i < count; i++) {
    // Generate random height between 60 and 120px
    const height = Math.floor(Math.random() * 60) + 60
    
    items.push({
      id: i + 1,
      height,
      offset: currentOffset,
      content: `This is item ${i + 1} with a height of ${height}px.`
    })
    
    currentOffset += height + 10 // 10px for margin
  }
  
  return items
}

// Configuration
const totalItems = 1000
const allItems = ref(generateItems(totalItems))
const scrollbarRef = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(400)
const bufferSize = 5 // Number of items to render above and below visible area

// Calculate total height of all items
const totalHeight = computed(() => {
  const lastItem = allItems.value[allItems.value.length - 1]
  return lastItem.offset + lastItem.height
})

// Find the index of the first visible item
const findStartIndex = (scrollTop) => {
  let low = 0
  let high = allItems.value.length - 1
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const item = allItems.value[mid]
    
    if (item.offset < scrollTop) {
      if (mid === allItems.value.length - 1 || allItems.value[mid + 1].offset >= scrollTop) {
        return mid
      }
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  
  return 0
}

// Calculate which items should be visible
const visibleItems = computed(() => {
  const startIndex = Math.max(0, findStartIndex(scrollTop.value) - bufferSize)
  
  let endIndex = startIndex
  while (
    endIndex < allItems.value.length && 
    allItems.value[endIndex].offset < scrollTop.value + containerHeight.value + bufferSize * 100
  ) {
    endIndex++
  }
  
  return allItems.value.slice(startIndex, endIndex)
})

const handleScroll = ({ scrollTop: newScrollTop }) => {
  scrollTop.value = newScrollTop
}

onMounted(() => {
  if (scrollbarRef.value) {
    containerHeight.value = scrollbarRef.value.wrap.clientHeight
  }
})
</script>

<style>
.virtual-scroll-container {
  position: relative;
}

.virtual-scroll-item {
  position: absolute;
  left: 0;
  right: 0;
  margin: 5px;
}

.item-content {
  background: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  padding: 10px 20px;
  height: 100%;
  box-sizing: border-box;
}

.item-content h3 {
  margin: 0 0 8px 0;
}

.item-content p {
  margin: 0;
}
</style>
```

### 4. Practical Applications (40 minutes)

#### 4.1 Scrollable Tabs

```vue
<template>
  <div class="scrollable-tabs-demo">
    <el-scrollbar class="tab-scrollbar" ref="tabScrollbar">
      <div class="tabs-container">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="selectTab(tab.id)"
        >
          {{ tab.label }}
        </div>
      </div>
    </el-scrollbar>
    
    <div class="tab-content">
      <div v-if="activeTab">
        Content for tab {{ activeTab }}
      </div>
    </div>
    
    <div class="tab-controls">
      <el-button @click="scrollLeft" icon="ArrowLeft" circle></el-button>
      <el-button @click="scrollRight" icon="ArrowRight" circle></el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// Generate a large number of tabs
const tabs = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  label: `Tab ${i + 1}`
}))

const activeTab = ref(1)
const tabScrollbar = ref(null)

const selectTab = (tabId) => {
  activeTab.value = tabId
}

const scrollLeft = () => {
  if (!tabScrollbar.value) return
  
  const { scrollLeft } = tabScrollbar.value.wrap
  tabScrollbar.value.setScrollLeft(Math.max(0, scrollLeft - 200))
}

const scrollRight = () => {
  if (!tabScrollbar.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tabScrollbar.value.wrap
  tabScrollbar.value.setScrollLeft(Math.min(scrollWidth - clientWidth, scrollLeft + 200))
}
</script>

<style>
.scrollable-tabs-demo {
  position: relative;
  width: 100%;
}

.tab-scrollbar {
  width: 100%;
}

.tabs-container {
  display: flex;
  padding: 10px 0;
}

.tab-item {
  flex-shrink: 0;
  padding: 10px 20px;
  margin-right: 5px;
  background: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  background: #409eff;
  color: white;
}

.tab-content {
  margin-top: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
  height: 200px;
}

.tab-controls {
  position: absolute;
  top: 5px;
  right: 0;
  display: flex;
  gap: 5px;
}
</style>
```

#### 4.2 Chat Message List

```vue
<template>
  <div class="chat-container">
    <div class="chat-header">
      <h3>Chat with Support</h3>
    </div>
    
    <el-scrollbar 
      height="400px" 
      class="chat-messages"
      ref="messagesScrollbar"
    >
      <div class="messages-container">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="{ 'message-self': message.sender === 'self' }"
        >
          <div class="message-avatar">
            {{ message.sender === 'self' ? 'You' : 'Support' }}
          </div>
          <div class="message-content">
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    
    <div class="chat-input">
      <el-input 
        v-model="newMessage" 
        placeholder="Type a message..." 
        @keyup.enter="sendMessage"
      >
        <template #append>
          <el-button @click="sendMessage">Send</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'

const messages = ref([
  {
    id: 1,
    sender: 'support',
    text: 'Hello! How can I help you today?',
    time: '10:00 AM'
  },
  {
    id: 2,
    sender: 'self',
    text: 'I have a question about the Scrollbar component.',
    time: '10:01 AM'
  },
  {
    id: 3,
    sender: 'support',
    text: 'Sure, what would you like to know?',
    time: '10:02 AM'
  }
])

const newMessage = ref('')
const messagesScrollbar = ref(null)

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  const message = {
    id: messages.value.length + 1,
    sender: 'self',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  messages.value.push(message)
  newMessage.value = ''
  
  // Simulate response
  setTimeout(() => {
    const response = {
      id: messages.value.length + 1,
      sender: 'support',
      text: 'Thank you for your message. Our team will get back to you shortly.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    messages.value.push(response)
  }, 1000)
}

// Scroll to bottom when messages change
watch(
  () => [...messages.value],
  () => {
    nextTick(() => {
      if (messagesScrollbar.value) {
        const { wrap } = messagesScrollbar.value
        wrap.scrollTop = wrap.scrollHeight
      }
    })
  }
)

onMounted(() => {
  // Initial scroll to bottom
  nextTick(() => {
    if (messagesScrollbar.value) {
      const { wrap } = messagesScrollbar.value
      wrap.scrollTop = wrap.scrollHeight
    }
  })
})
</script>

<style>
.chat-container {
  width: 100%;
  max-width: 500px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  background: #409eff;
  color: white;
}

.chat-header h3 {
  margin: 0;
}

.messages-container {
  padding: 15px;
}

.message {
  display: flex;
  margin-bottom: 15px;
}

.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ecf5ff;
  color: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.message-self .message-avatar {
  background: #409eff;
  color: white;
}

.message-content {
  margin: 0 10px;
  max-width: 70%;
}

.message-text {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 8px;
  word-break: break-word;
}

.message-self .message-text {
  background: #ecf5ff;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  text-align: right;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #e4e7ed;
}
</style>
```

## Scrollbar API

### Props

| Name | Description | Type | Default |
|------|-------------|------|---------|
| height | Height of scrollbar | string / number | - |
| max-height | Max height of scrollbar | string / number | - |
| native | Whether to use native scrollbar | boolean | false |
| wrap-style | Style of wrap container | string / object | - |
| wrap-class | Class of wrap container | string | - |
| view-style | Style of view | string / object | - |
| view-class | Class of view | string / object | - |
| noresize | Do not respond to container size changes | boolean | false |
| tag | Element tag of the view | string | div |
| always | Always show scrollbar | boolean | false |
| min-size | Minimum size of scrollbar | number | 20 |

### Events

| Name | Description | Parameters |
|------|-------------|------------|
| scroll | Triggers when scrolling | { scrollLeft, scrollTop } |

### Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| setScrollTop | Set scroll top position | (scrollTop: number) |
| setScrollLeft | Set scroll left position | (scrollLeft: number) |
| update | Update scrollbar state | - |

### Slots

| Name | Description |
|------|-------------|
| default | Custom content |

## Practice Exercises

### Exercise 1: Basic Scrollbar Implementation
Create a simple document viewer with custom scrollbar styling.

### Exercise 2: Infinite Scrolling
Implement an infinite scrolling list that loads more items when the user scrolls to the bottom.

### Exercise 3: Virtual Scrolling
Create a virtual scrolling component that can handle thousands of items efficiently.

### Exercise 4: Custom Scrollbar Themes
Implement a scrollbar component with multiple theme options (light, dark, colorful).

## Design Principles

1. **Performance**: Use virtual scrolling for large data sets to maintain smooth performance
2. **Consistency**: Maintain consistent scrollbar behavior across different parts of your application
3. **Feedback**: Provide visual feedback during scrolling operations
4. **Accessibility**: Ensure scrollable content is accessible to keyboard users and screen readers
5. **Responsiveness**: Adapt scrollbar behavior to different screen sizes and devices

## Learning Resources

- [Element Plus Scrollbar Documentation](https://element-plus.org/en-US/component/scrollbar.html)
- [MDN Web Docs: Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)
- [CSS-Tricks: Scrollbar Styling](https://css-tricks.com/almanac/properties/s/scrollbar/)
- [Web.dev: Virtual Scrolling](https://web.dev/patterns/web-vitals-patterns/infinite-scroll/)
- [Accessibility Guidelines for Scrollable Content](https://www.w3.org/WAI/WCAG21/Understanding/scrolling.html)

## Assignments

1. **Basic Assignment**: Create a custom scrollbar for a content area with different styling for horizontal and vertical scrollbars
2. **Advanced Assignment**: Implement a virtual scrolling component for a large data table
3. **Challenge Assignment**: Build a complete document reader with custom scrollbars, bookmarks, and scroll position memory

## Summary

The Scrollbar component is an essential tool for managing content overflow in web applications. By mastering Element Plus's Scrollbar component, you can create custom scrolling experiences that are both performant and visually appealing. The component offers flexibility for styling, programmatic control, and advanced features like virtual scrolling for handling large data sets efficiently.

When implementing scrollbars, always consider performance implications, especially for large data sets, and ensure that your scrollable interfaces are accessible to all users. With proper implementation, custom scrollbars can significantly enhance the user experience of your application.

---

**Learning Date:** ___________
**Completion Status:** ___________
**Learning Notes:**



**Problems Encountered:**



**Solutions:**