# Scrollbar 滚动条组件

## 学习目标
- 掌握 Element Plus Scrollbar 滚动条组件的使用
- 理解自定义滚动条的优势和应用场景
- 学会滚动条的样式定制和配置
- 掌握滚动条的事件处理和方法调用
- 理解滚动条在不同布局中的应用

## 详细学习内容

### 1. Scrollbar 基础使用（30分钟）

#### 1.1 基础滚动条

```vue
<template>
  <div class="scrollbar-demo">
    <h3>基础滚动条</h3>
    <el-scrollbar height="200px">
      <div class="scrollbar-content">
        <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
          这是第 {{ item }} 行内容，用于演示滚动条效果。
        </p>
      </div>
    </el-scrollbar>
  </div>
</template>

<style>
.scrollbar-demo {
  margin-bottom: 24px;
}

.scrollbar-content {
  padding: 16px;
}

.scrollbar-demo-item {
  margin: 8px 0;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}
</style>
```

#### 1.2 横向滚动条

```vue
<template>
  <div class="horizontal-scrollbar-demo">
    <h3>横向滚动条</h3>
    <el-scrollbar>
      <div class="horizontal-content">
        <div 
          v-for="item in 10" 
          :key="item" 
          class="horizontal-item"
        >
          卡片 {{ item }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style>
.horizontal-scrollbar-demo {
  margin-bottom: 24px;
}

.horizontal-content {
  display: flex;
  padding: 16px;
  width: 1200px; /* 超出容器宽度以产生横向滚动 */
}

.horizontal-item {
  flex-shrink: 0;
  width: 200px;
  height: 100px;
  margin-right: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
```

#### 1.3 最大高度滚动条

```vue
<template>
  <div class="max-height-demo">
    <h3>最大高度滚动条</h3>
    <el-scrollbar max-height="300px">
      <div class="max-height-content">
        <el-card 
          v-for="item in 15" 
          :key="item" 
          class="demo-card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <span>卡片标题 {{ item }}</span>
              <el-button class="button" text>操作</el-button>
            </div>
          </template>
          <div class="card-content">
            这是第 {{ item }} 张卡片的内容，包含一些描述信息和详细内容。
            当内容超过最大高度时，会自动显示滚动条。
          </div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<style>
.max-height-demo {
  margin-bottom: 24px;
}

.max-height-content {
  padding: 16px;
}

.demo-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  line-height: 1.6;
  color: #606266;
}
</style>
```

### 2. 滚动条样式定制（25分钟）

#### 2.1 自定义滚动条样式

```vue
<template>
  <div class="custom-scrollbar-demo">
    <h3>自定义滚动条样式</h3>
    
    <!-- 蓝色主题滚动条 -->
    <div class="scrollbar-wrapper">
      <h4>蓝色主题</h4>
      <el-scrollbar height="200px" class="blue-scrollbar">
        <div class="custom-content">
          <div v-for="item in 15" :key="item" class="content-item blue-theme">
            蓝色主题内容项 {{ item }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 绿色主题滚动条 -->
    <div class="scrollbar-wrapper">
      <h4>绿色主题</h4>
      <el-scrollbar height="200px" class="green-scrollbar">
        <div class="custom-content">
          <div v-for="item in 15" :key="item" class="content-item green-theme">
            绿色主题内容项 {{ item }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 圆角滚动条 -->
    <div class="scrollbar-wrapper">
      <h4>圆角滚动条</h4>
      <el-scrollbar height="200px" class="rounded-scrollbar">
        <div class="custom-content">
          <div v-for="item in 15" :key="item" class="content-item rounded-theme">
            圆角主题内容项 {{ item }}
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style>
.custom-scrollbar-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.scrollbar-wrapper h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.custom-content {
  padding: 16px;
}

.content-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: 500;
}

.blue-theme {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
  border-left: 4px solid #2196f3;
}

.green-theme {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  color: #388e3c;
  border-left: 4px solid #4caf50;
}

.rounded-theme {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
  border-left: 4px solid #ff9800;
  border-radius: 20px;
}

/* 蓝色滚动条样式 */
.blue-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: #2196f3;
}

.blue-scrollbar :deep(.el-scrollbar__bar.is-vertical > div) {
  background-color: #2196f3;
  border-radius: 4px;
}

.blue-scrollbar :deep(.el-scrollbar__bar.is-horizontal > div) {
  background-color: #2196f3;
  border-radius: 4px;
}

/* 绿色滚动条样式 */
.green-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: #4caf50;
}

.green-scrollbar :deep(.el-scrollbar__bar.is-vertical > div) {
  background-color: #4caf50;
  border-radius: 4px;
}

.green-scrollbar :deep(.el-scrollbar__bar.is-horizontal > div) {
  background-color: #4caf50;
  border-radius: 4px;
}

/* 圆角滚动条样式 */
.rounded-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: #ff9800;
}

.rounded-scrollbar :deep(.el-scrollbar__bar.is-vertical > div) {
  background-color: #ff9800;
  border-radius: 10px;
  width: 8px;
}

.rounded-scrollbar :deep(.el-scrollbar__bar.is-horizontal > div) {
  background-color: #ff9800;
  border-radius: 10px;
  height: 8px;
}
</style>
```

#### 2.2 滚动条配置选项

```vue
<template>
  <div class="scrollbar-config-demo">
    <h3>滚动条配置选项</h3>
    
    <div class="config-controls">
      <el-form :model="config" label-width="120px" size="small">
        <el-form-item label="高度:">
          <el-input-number v-model="config.height" :min="100" :max="500" />
        </el-form-item>
        <el-form-item label="最大高度:">
          <el-input-number v-model="config.maxHeight" :min="100" :max="500" />
        </el-form-item>
        <el-form-item label="原生滚动条:">
          <el-switch v-model="config.native" />
        </el-form-item>
        <el-form-item label="包裹样式:">
          <el-select v-model="config.wrapStyle" placeholder="选择样式">
            <el-option label="默认" value="default" />
            <el-option label="圆角" value="rounded" />
            <el-option label="阴影" value="shadow" />
          </el-select>
        </el-form-item>
        <el-form-item label="滚动到:">
          <el-button @click="scrollToTop" size="small">顶部</el-button>
          <el-button @click="scrollToBottom" size="small">底部</el-button>
          <el-button @click="scrollToElement" size="small">第10项</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-scrollbar 
      ref="scrollbarRef"
      :height="config.height + 'px'"
      :max-height="config.maxHeight + 'px'"
      :native="config.native"
      :wrap-style="wrapStyleComputed"
      @scroll="handleScroll"
    >
      <div class="config-content">
        <div 
          v-for="item in 30" 
          :key="item" 
          :ref="el => setItemRef(el, item)"
          class="config-item"
          :class="{ 'highlight': item === 10 }"
        >
          <div class="item-number">{{ item }}</div>
          <div class="item-content">
            <h5>内容项 {{ item }}</h5>
            <p>这是第 {{ item }} 项的详细内容，包含一些描述信息。</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
    
    <div class="scroll-info">
      <p>滚动位置: {{ scrollInfo.scrollTop }}px</p>
      <p>滚动比例: {{ scrollInfo.scrollRatio }}%</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'

const scrollbarRef = ref()
const itemRefs = ref({})

const config = reactive({
  height: 300,
  maxHeight: 400,
  native: false,
  wrapStyle: 'default'
})

const scrollInfo = reactive({
  scrollTop: 0,
  scrollRatio: 0
})

const wrapStyleComputed = computed(() => {
  const baseStyle = { padding: '16px' }
  
  switch (config.wrapStyle) {
    case 'rounded':
      return { ...baseStyle, borderRadius: '12px', backgroundColor: '#f8f9fa' }
    case 'shadow':
      return { ...baseStyle, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }
    default:
      return baseStyle
  }
})

const setItemRef = (el, index) => {
  if (el) {
    itemRefs.value[index] = el
  }
}

const handleScroll = ({ scrollTop, scrollLeft }) => {
  scrollInfo.scrollTop = Math.round(scrollTop)
  // 计算滚动比例
  const scrollElement = scrollbarRef.value?.wrapRef
  if (scrollElement) {
    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight
    scrollInfo.scrollRatio = Math.round((scrollTop / maxScroll) * 100)
  }
}

const scrollToTop = () => {
  scrollbarRef.value?.setScrollTop(0)
}

const scrollToBottom = () => {
  nextTick(() => {
    const scrollElement = scrollbarRef.value?.wrapRef
    if (scrollElement) {
      scrollbarRef.value?.setScrollTop(scrollElement.scrollHeight)
    }
  })
}

const scrollToElement = () => {
  const targetElement = itemRefs.value[10]
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>

<style>
.scrollbar-config-demo {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.config-controls {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.config-content {
  padding: 0;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.config-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.config-item.highlight {
  border-color: #f56c6c;
  background-color: #fef0f0;
}

.item-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  margin-right: 16px;
}

.item-content h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.item-content p {
  margin: 0;
  color: #606266;
  line-height: 1.5;
}

.scroll-info {
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.scroll-info p {
  margin: 4px 0;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #303133;
}
</style>
```

### 3. 实际应用场景（25分钟）

#### 4.1 聊天界面滚动条

```vue
<template>
  <div class="chat-demo">
    <h3>聊天界面滚动条</h3>
    
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-title">
          <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span>张三</span>
        </div>
        <div class="chat-actions">
          <el-button @click="addMessage" size="small" type="primary">发送消息</el-button>
          <el-button @click="clearMessages" size="small">清空</el-button>
        </div>
      </div>
      
      <el-divider style="margin: 0;" />
      
      <el-scrollbar 
        ref="chatScrollbar"
        height="300px" 
        class="chat-scrollbar"
      >
        <div class="chat-messages">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'own-message': message.isOwn }"
          >
            <div class="message-avatar">
              <el-avatar 
                :size="28" 
                :src="message.avatar"
              />
            </div>
            <div class="message-content">
              <div class="message-info">
                <span class="message-name">{{ message.name }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-text">{{ message.text }}</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      
      <el-divider style="margin: 0;" />
      
      <div class="chat-input">
        <el-input 
          v-model="newMessage"
          placeholder="输入消息..."
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button @click="sendMessage" type="primary">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const chatScrollbar = ref()
const newMessage = ref('')
const messageId = ref(1)

const messages = ref([
  {
    id: 1,
    name: '张三',
    text: '你好！',
    time: '09:30',
    isOwn: false,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    name: '我',
    text: '你好，有什么可以帮助你的吗？',
    time: '09:31',
    isOwn: true,
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  },
  {
    id: 3,
    name: '张三',
    text: '我想了解一下你们的产品功能',
    time: '09:32',
    isOwn: false,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  }
])

const scrollToBottom = () => {
  nextTick(() => {
    const scrollElement = chatScrollbar.value?.wrapRef
    if (scrollElement) {
      chatScrollbar.value?.setScrollTop(scrollElement.scrollHeight)
    }
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  messages.value.push({
    id: ++messageId.value,
    name: '我',
    text: newMessage.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isOwn: true,
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  })
  
  newMessage.value = ''
  scrollToBottom()
}

const addMessage = () => {
  const responses = [
    '好的，我明白了',
    '这个功能很实用',
    '谢谢你的解答',
    '还有其他问题吗？',
    '非常感谢！'
  ]
  
  messages.value.push({
    id: ++messageId.value,
    name: '张三',
    text: responses[Math.floor(Math.random() * responses.length)],
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isOwn: false,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  })
  
  scrollToBottom()
}

const clearMessages = () => {
  messages.value = []
}
</script>

<style>
.chat-demo {
  margin-bottom: 24px;
}

.chat-container {
  max-width: 500px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #303133;
}

.chat-actions {
  display: flex;
  gap: 8px;
}

.chat-messages {
  padding: 16px;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
}

.message-item.own-message {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 8px;
}

.message-content {
  max-width: 70%;
}

.own-message .message-content {
  text-align: right;
}

.message-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #909399;
}

.own-message .message-info {
  justify-content: flex-end;
}

.message-name {
  font-weight: 500;
}

.message-text {
  padding: 8px 12px;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #303133;
  line-height: 1.4;
}

.own-message .message-text {
  background-color: #409eff;
  color: white;
}

.chat-input {
  padding: 16px;
  background-color: #f8f9fa;
}

/* 聊天滚动条样式 */
.chat-scrollbar :deep(.el-scrollbar__thumb) {
  background-color: #c0c4cc;
  border-radius: 4px;
}

.chat-scrollbar :deep(.el-scrollbar__bar.is-vertical > div) {
  width: 6px;
  border-radius: 3px;
}
</style>
```

## 实践练习

### 练习1：基础滚动条
创建一个新闻列表组件，使用滚动条展示多条新闻，支持滚动到顶部和底部。

### 练习2：自定义滚动条样式
实现一个图片画廊组件，使用横向滚动条展示图片，并自定义滚动条样式。

### 练习3：分割线应用
创建一个用户资料页面，使用不同样式的分割线分隔各个信息模块。

### 练习4：综合应用
实现一个代码编辑器界面，包含文件列表（垂直滚动）和代码内容（水平和垂直滚动）。

## 设计原则

1. **性能优化**：对于大量数据，考虑使用虚拟滚动来提升性能
2. **用户体验**：滚动条样式应该与整体设计风格保持一致
3. **响应式设计**：确保滚动条在不同设备上都有良好的交互体验
4. **可访问性**：支持键盘导航和屏幕阅读器
5. **内容分割**：合理使用分割线来组织页面内容结构

## 学习资源

- [Element Plus Scrollbar 官方文档](https://element-plus.org/zh-CN/component/scrollbar.html)
- [Element Plus Divider 官方文档](https://element-plus.org/zh-CN/component/divider.html)
- [CSS 滚动条样式指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::-webkit-scrollbar)
- [虚拟滚动最佳实践](https://web.dev/virtualize-long-lists-react-window/)
- [无障碍滚动设计](https://www.w3.org/WAI/WCAG21/Understanding/)

## 作业

1. **基础作业**：创建一个带自定义滚动条的文章阅读器
2. **进阶作业**：实现一个支持无限滚动的商品列表组件
3. **挑战作业**：设计一个多面板的代码编辑器，每个面板都有独立的滚动条

## 总结

Scrollbar 滚动条组件和 Divider 分割线组件是构建现代 Web 界面的重要工具。滚动条组件提供了比原生滚动条更好的样式控制和用户体验，而分割线组件则帮助我们更好地组织页面内容结构。掌握这些组件的使用方法和最佳实践，对于创建优秀的用户界面至关重要。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**