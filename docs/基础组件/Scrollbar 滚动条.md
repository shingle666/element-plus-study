# Scrollbar 滚动条组件

## 学习目标
- 掌握 Element Plus Scrollbar 滚动条组件的使用
- 理解自定义滚动条的优势和应用场景
- 学会滚动条的样式定制和配置
- 掌握滚动条的事件处理和方法调用
- 理解滚动条在不同布局中的应用

## 详细学习内容

### 1. Scrollbar 基础使用

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

### 2. 滚动条样式定制

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

### 3. 实际应用场景

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

## Scrollbar API

### Scrollbar Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| height | 滚动条高度 | string / number | — | — |
| max-height | 滚动条最大高度 | string / number | — | — |
| native | 是否使用原生滚动条样式 | boolean | — | false |
| wrap-style | 包裹容器的自定义样式 | string / object | — | — |
| wrap-class | 包裹容器的自定义类名 | string | — | — |
| view-style | 视图的自定义样式 | string / object | — | — |
| view-class | 视图的自定义类名 | string | — | — |
| noresize | 不响应容器尺寸变化，如果容器尺寸不会发生变化，最好设置它可以优化性能 | boolean | — | false |
| tag | 视图的元素标签 | string | — | div |
| always | 滚动条总是显示 | boolean | — | false |
| min-size | 滚动条最小尺寸 | number | — | 20 |
| id | 视图ID | string | — | — |
| role | 视图的角色 | string | — | — |
| aria-label | 视图的 aria-label | string | — | — |
| aria-orientation | 视图的 aria-orientation | enum | — | — |
| tabindex | 容器的tabindex | number / string | — | — |

#### Attributes 使用示例

```vue
<template>
  <div class="attributes-demo">
    <h3>Scrollbar Attributes 示例</h3>
    
    <!-- 基础属性示例 -->
    <div class="demo-section">
      <h4>高度和最大高度</h4>
      <div class="demo-grid">
        <div>
          <p>固定高度 (height="200px")</p>
          <el-scrollbar height="200px" class="demo-scrollbar">
            <div class="demo-content">
              <p v-for="i in 15" :key="i">内容行 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
        
        <div>
          <p>最大高度 (max-height="200px")</p>
          <el-scrollbar max-height="200px" class="demo-scrollbar">
            <div class="demo-content">
              <p v-for="i in 8" :key="i">内容行 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    
    <!-- 样式自定义示例 -->
    <div class="demo-section">
      <h4>自定义样式</h4>
      <el-scrollbar 
        height="200px"
        :wrap-style="{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px' }"
        wrap-class="custom-wrap"
        :view-style="{ color: '#1976d2' }"
        view-class="custom-view"
      >
        <div class="styled-content">
          <div v-for="i in 12" :key="i" class="styled-item">
            自定义样式内容项 {{ i }}
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 原生滚动条对比 -->
    <div class="demo-section">
      <h4>原生 vs 自定义滚动条</h4>
      <div class="demo-grid">
        <div>
          <p>自定义滚动条 (native=false)</p>
          <el-scrollbar height="150px" :native="false">
            <div class="demo-content">
              <p v-for="i in 10" :key="i">自定义滚动条 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
        
        <div>
          <p>原生滚动条 (native=true)</p>
          <el-scrollbar height="150px" :native="true">
            <div class="demo-content">
              <p v-for="i in 10" :key="i">原生滚动条 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    
    <!-- 其他属性示例 -->
    <div class="demo-section">
      <h4>其他属性</h4>
      <div class="demo-grid">
        <div>
          <p>总是显示滚动条 (always=true)</p>
          <el-scrollbar height="150px" :always="true">
            <div class="demo-content">
              <p v-for="i in 5" :key="i">内容较少 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
        
        <div>
          <p>自定义标签 (tag="section")</p>
          <el-scrollbar height="150px" tag="section">
            <div class="demo-content">
              <p v-for="i in 8" :key="i">Section 标签 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    
    <!-- 高级配置示例 -->
    <div class="demo-section">
      <h4>高级配置</h4>
      <div class="demo-grid">
        <div>
          <p>不响应尺寸变化 (noresize=true)</p>
          <el-scrollbar height="150px" :noresize="true">
            <div class="demo-content">
              <p v-for="i in 8" :key="i">固定尺寸内容 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
        
        <div>
          <p>自定义最小尺寸 (min-size=30)</p>
          <el-scrollbar height="150px" :min-size="30">
            <div class="demo-content">
              <p v-for="i in 8" :key="i">自定义最小尺寸 {{ i }}</p>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    
    <!-- 无障碍访问示例 -->
    <div class="demo-section">
      <h4>无障碍访问配置</h4>
      <el-scrollbar 
        height="150px"
        id="accessible-scrollbar"
        role="region"
        aria-label="可滚动内容区域"
        aria-orientation="vertical"
        tabindex="0"
      >
        <div class="demo-content">
          <p v-for="i in 10" :key="i">无障碍访问内容 {{ i }}</p>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style>
.attributes-demo {
  margin-bottom: 24px;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.demo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.demo-scrollbar {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.demo-content {
  padding: 16px;
}

.demo-content p {
  margin: 8px 0;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.styled-content {
  padding: 0;
}

.styled-item {
  margin-bottom: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 6px;
  border-left: 4px solid #2196f3;
  font-weight: 500;
}

.custom-wrap {
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);
}
</style>
```

### Scrollbar Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| scroll | 滚动时触发 | ({ scrollLeft, scrollTop }) |
| end-reached | 滚动条到达底部时触发 | — |

#### Events 使用示例

```vue
<template>
  <div class="events-demo">
    <h3>Scrollbar Events 示例</h3>
    
    <div class="event-info">
      <div class="info-item">
        <span class="label">滚动位置:</span>
        <span class="value">X: {{ scrollPosition.scrollLeft }}px, Y: {{ scrollPosition.scrollTop }}px</span>
      </div>
      <div class="info-item">
        <span class="label">滚动方向:</span>
        <span class="value">{{ scrollDirection }}</span>
      </div>
      <div class="info-item">
        <span class="label">滚动状态:</span>
        <span class="value" :class="scrollStatus">{{ scrollStatus }}</span>
      </div>
      <div class="info-item" v-if="reachedEnd">
        <span class="label">状态:</span>
        <span class="value reached-end">已到达底部</span>
      </div>
    </div>
    
    <el-scrollbar 
      height="300px"
      @scroll="handleScroll"
      @end-reached="handleEndReached"
      class="event-scrollbar"
    >
      <div class="scroll-content">
        <div class="content-section" v-for="section in 5" :key="section">
          <h4>区域 {{ section }}</h4>
          <div class="section-grid">
            <div 
              v-for="item in 8" 
              :key="`${section}-${item}`"
              class="grid-item"
              :style="{ backgroundColor: getRandomColor() }"
            >
              项目 {{ section }}-{{ item }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    
    <!-- 无限滚动示例 -->
    <div class="infinite-scroll-demo">
      <h4>无限滚动示例</h4>
      <div class="load-info">
        <span>已加载项目: {{ infiniteItems.length }}</span>
        <span v-if="loading" class="loading-text">正在加载...</span>
      </div>
      
      <el-scrollbar 
        height="250px"
        @end-reached="loadMoreItems"
        class="infinite-scrollbar"
      >
        <div class="infinite-content">
          <div 
            v-for="item in infiniteItems" 
            :key="item.id"
            class="infinite-item"
          >
            <div class="item-avatar">{{ item.id }}</div>
            <div class="item-info">
              <h5>{{ item.title }}</h5>
              <p>{{ item.description }}</p>
            </div>
          </div>
          <div v-if="loading" class="loading-indicator">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>加载更多内容...</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <div class="scroll-controls">
      <el-button @click="scrollToPosition(0, 0)" size="small">回到顶部</el-button>
      <el-button @click="scrollToPosition(200, 100)" size="small">滚动到 (200,100)</el-button>
      <el-button @click="scrollToBottom" size="small">滚动到底部</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const scrollbarRef = ref()
const scrollPosition = reactive({ scrollLeft: 0, scrollTop: 0 })
const scrollDirection = ref('静止')
const scrollStatus = ref('idle')
const lastScrollPosition = reactive({ scrollLeft: 0, scrollTop: 0 })
const reachedEnd = ref(false)
const loading = ref(false)
const infiniteItems = ref([])
const itemIdCounter = ref(1)

let scrollTimer = null

// 初始化无限滚动数据
const initInfiniteItems = () => {
  for (let i = 0; i < 10; i++) {
    infiniteItems.value.push({
      id: itemIdCounter.value++,
      title: `项目标题 ${itemIdCounter.value - 1}`,
      description: `这是第 ${itemIdCounter.value - 1} 个项目的详细描述信息。`
    })
  }
}

// 初始化数据
initInfiniteItems()

const handleScroll = ({ scrollLeft, scrollTop }) => {
  // 更新滚动位置
  scrollPosition.scrollLeft = Math.round(scrollLeft)
  scrollPosition.scrollTop = Math.round(scrollTop)
  
  // 判断滚动方向
  const deltaX = scrollLeft - lastScrollPosition.scrollLeft
  const deltaY = scrollTop - lastScrollPosition.scrollTop
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    scrollDirection.value = deltaX > 0 ? '向右滚动' : '向左滚动'
  } else if (deltaY !== 0) {
    scrollDirection.value = deltaY > 0 ? '向下滚动' : '向上滚动'
  }
  
  // 更新滚动状态
  scrollStatus.value = 'scrolling'
  
  // 重置到达底部状态
  reachedEnd.value = false
  
  // 清除之前的定时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  
  // 设置新的定时器，500ms 后认为滚动停止
  scrollTimer = setTimeout(() => {
    scrollStatus.value = 'idle'
    scrollDirection.value = '静止'
  }, 500)
  
  // 更新上次滚动位置
  lastScrollPosition.scrollLeft = scrollLeft
  lastScrollPosition.scrollTop = scrollTop
}

// 处理到达底部事件
const handleEndReached = () => {
  reachedEnd.value = true
  console.log('已滚动到底部')
}

// 加载更多项目
const loadMoreItems = () => {
  if (loading.value) return
  
  loading.value = true
  
  // 模拟异步加载
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      infiniteItems.value.push({
        id: itemIdCounter.value++,
        title: `项目标题 ${itemIdCounter.value - 1}`,
        description: `这是第 ${itemIdCounter.value - 1} 个项目的详细描述信息。`
      })
    }
    loading.value = false
  }, 1000)
}

const scrollToPosition = (x, y) => {
  scrollbarRef.value?.setScrollLeft(x)
  scrollbarRef.value?.setScrollTop(y)
}

const scrollToBottom = () => {
  const scrollElement = scrollbarRef.value?.wrapRef
  if (scrollElement) {
    scrollbarRef.value?.setScrollTop(scrollElement.scrollHeight)
  }
}

const getRandomColor = () => {
  const colors = [
    '#e3f2fd', '#f3e5f5', '#e8f5e8', '#fff3e0',
    '#fce4ec', '#e0f2f1', '#f1f8e9', '#fff8e1'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
</script>

<style>
.events-demo {
  margin-bottom: 24px;
}

.event-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.value {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.value.scrolling {
  color: #67c23a;
}

.value.idle {
  color: #909399;
}

.value.reached-end {
  color: #f56c6c;
  font-weight: 600;
}

.infinite-scroll-demo {
  margin-top: 32px;
}

.infinite-scroll-demo h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.load-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  font-size: 14px;
}

.loading-text {
  color: #409eff;
  font-weight: 500;
}

.infinite-scrollbar {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.infinite-content {
  padding: 16px;
}

.infinite-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  transition: all 0.3s;
}

.infinite-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.item-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  margin-right: 12px;
}

.item-info h5 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 14px;
}

.item-info p {
  margin: 0;
  color: #606266;
  font-size: 12px;
  line-height: 1.4;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  color: #409eff;
  font-size: 14px;
}

.event-scrollbar {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 16px;
}

.scroll-content {
  padding: 16px;
  width: 800px; /* 超出容器宽度以产生横向滚动 */
}

.content-section {
  margin-bottom: 24px;
}

.content-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.grid-item {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  color: #303133;
  border: 1px solid #e4e7ed;
  transition: transform 0.2s;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.scroll-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
```

### Scrollbar Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |

#### Slots 使用示例

```vue
<template>
  <div class="slots-demo">
    <h3>Scrollbar Slots 示例</h3>
    
    <!-- 基础插槽使用 -->
    <div class="demo-section">
      <h4>默认插槽 - 文本内容</h4>
      <el-scrollbar height="200px" class="demo-scrollbar">
        <div class="text-content">
          <h5>文章标题</h5>
          <p>这是一段很长的文本内容，用来演示滚动条的默认插槽功能。</p>
          <p>Element Plus 的 Scrollbar 组件提供了比原生滚动条更好的用户体验。</p>
          <p>通过默认插槽，我们可以放置任何类型的内容，包括文本、图片、表单等。</p>
          <p>滚动条会根据内容的高度自动显示或隐藏。</p>
          <p>这种设计让开发者能够更灵活地控制滚动区域的内容。</p>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 复杂内容插槽 -->
    <div class="demo-section">
      <h4>默认插槽 - 复杂内容</h4>
      <el-scrollbar height="300px" class="demo-scrollbar">
        <div class="complex-content">
          <!-- 用户卡片列表 -->
          <div v-for="user in users" :key="user.id" class="user-card">
            <div class="user-avatar">
              <el-avatar :size="50" :src="user.avatar" />
            </div>
            <div class="user-info">
              <h6 class="user-name">{{ user.name }}</h6>
              <p class="user-title">{{ user.title }}</p>
              <div class="user-tags">
                <el-tag 
                  v-for="tag in user.tags" 
                  :key="tag"
                  size="small"
                  :type="getTagType(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="user-actions">
              <el-button size="small" type="primary">关注</el-button>
              <el-button size="small">消息</el-button>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    
    <!-- 表单内容插槽 -->
    <div class="demo-section">
      <h4>默认插槽 - 表单内容</h4>
      <el-scrollbar height="250px" class="demo-scrollbar">
        <el-form :model="formData" label-width="100px" class="form-content">
          <el-form-item label="用户名:">
            <el-input v-model="formData.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱:">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机号:">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="地址:">
            <el-input v-model="formData.address" type="textarea" :rows="3" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="兴趣爱好:">
            <el-checkbox-group v-model="formData.hobbies">
              <el-checkbox label="reading">阅读</el-checkbox>
              <el-checkbox label="music">音乐</el-checkbox>
              <el-checkbox label="sports">运动</el-checkbox>
              <el-checkbox label="travel">旅行</el-checkbox>
              <el-checkbox label="photography">摄影</el-checkbox>
              <el-checkbox label="cooking">烹饪</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="个人简介:">
            <el-input 
              v-model="formData.bio" 
              type="textarea" 
              :rows="4" 
              placeholder="请输入个人简介"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">提交</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const users = [
  {
    id: 1,
    name: '张三',
    title: '前端开发工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: ['Vue', 'JavaScript', 'CSS']
  },
  {
    id: 2,
    name: '李四',
    title: '后端开发工程师',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    tags: ['Node.js', 'Python', 'MySQL']
  },
  {
    id: 3,
    name: '王五',
    title: 'UI/UX 设计师',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    tags: ['Figma', 'Sketch', 'Photoshop']
  },
  {
    id: 4,
    name: '赵六',
    title: '产品经理',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    tags: ['产品设计', '用户研究', '数据分析']
  },
  {
    id: 5,
    name: '钱七',
    title: '测试工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: ['自动化测试', 'Selenium', 'Jest']
  }
]

const formData = reactive({
  username: '',
  email: '',
  phone: '',
  address: '',
  hobbies: [],
  bio: ''
})

const getTagType = (tag) => {
  const typeMap = {
    'Vue': 'success',
    'JavaScript': 'warning',
    'CSS': 'info',
    'Node.js': 'success',
    'Python': 'warning',
    'MySQL': 'danger',
    'Figma': 'info',
    'Sketch': 'success',
    'Photoshop': 'warning'
  }
  return typeMap[tag] || ''
}
</script>

<style>
.slots-demo {
  margin-bottom: 24px;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.demo-scrollbar {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.text-content {
  padding: 20px;
  line-height: 1.6;
}

.text-content h5 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 18px;
}

.text-content p {
  margin: 12px 0;
  color: #606266;
}

.complex-content {
  padding: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.user-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
}

.user-avatar {
  margin-right: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.user-title {
  margin: 0 0 8px 0;
  color: #909399;
  font-size: 14px;
}

.user-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.form-content {
  padding: 20px;
}
</style>
```

### Scrollbar Exposes

| 方法名 | 说明 | 参数 |
|--------|------|------|
| handleScroll | 触发滚动事件 | — |
| scrollTo | 滚动到一组特定坐标 | (options: ScrollToOptions \| number, yCoord?: number) |
| setScrollTop | 设置滚动条到顶部的距离 | (scrollTop: number) |
| setScrollLeft | 设置滚动条到左边的距离 | (scrollLeft: number) |
| update | 手动更新滚动条状态 | — |
| wrapRef | 滚动条包裹的 ref 对象 | — |

#### Exposes 使用示例

```vue
<template>
  <div class="exposes-demo">
    <h3>Scrollbar Exposes 示例</h3>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <h4>滚动控制</h4>
        <div class="control-buttons">
          <el-button @click="scrollToTop" size="small" type="primary">
            滚动到顶部
          </el-button>
          <el-button @click="scrollToBottom" size="small" type="primary">
            滚动到底部
          </el-button>
          <el-button @click="scrollToCenter" size="small" type="primary">
            滚动到中间
          </el-button>
        </div>
      </div>
      
      <div class="control-group">
        <h4>精确定位</h4>
        <div class="position-controls">
          <el-input-number 
            v-model="targetPosition.x" 
            :min="0" 
            :max="500"
            size="small"
            placeholder="X 坐标"
          />
          <el-input-number 
            v-model="targetPosition.y" 
            :min="0" 
            :max="1000"
            size="small"
            placeholder="Y 坐标"
          />
          <el-button @click="scrollToPosition" size="small">
            滚动到指定位置
          </el-button>
        </div>
      </div>
      
      <div class="control-group">
        <h4>滚动条信息</h4>
        <div class="scroll-info">
          <div class="info-item">
            <span>当前位置:</span>
            <span>X: {{ currentPosition.x }}px, Y: {{ currentPosition.y }}px</span>
          </div>
          <div class="info-item">
            <span>容器尺寸:</span>
            <span>{{ containerSize.width }} × {{ containerSize.height }}</span>
          </div>
          <div class="info-item">
            <span>内容尺寸:</span>
            <span>{{ contentSize.width }} × {{ contentSize.height }}</span>
          </div>
        </div>
      </div>
      
      <div class="control-group">
        <h4>其他操作</h4>
        <div class="control-buttons">
          <el-button @click="updateScrollbar" size="small">
            更新滚动条
          </el-button>
          <el-button @click="triggerScroll" size="small">
            触发滚动事件
          </el-button>
          <el-button @click="getWrapRef" size="small">
            获取包裹元素
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 滚动内容区域 -->
    <el-scrollbar 
      ref="scrollbarRef"
      height="400px"
      class="expose-scrollbar"
      @scroll="handleScrollEvent"
    >
      <div class="expose-content">
        <!-- 网格内容 -->
        <div class="content-grid">
          <div 
            v-for="i in 100" 
            :key="i"
            class="grid-item"
            :class="{ 'highlight': i === highlightItem }"
            @click="scrollToItem(i)"
          >
            <div class="item-number">{{ i }}</div>
            <div class="item-label">项目 {{ i }}</div>
          </div>
        </div>
        
        <!-- 额外的横向内容 -->
        <div class="horizontal-content">
          <div 
            v-for="j in 20" 
            :key="`h-${j}`"
            class="horizontal-item"
          >
            横向项目 {{ j }}
          </div>
        </div>
      </div>
    </el-scrollbar>
    
    <!-- 快速导航 -->
    <div class="quick-nav">
      <h4>快速导航</h4>
      <div class="nav-buttons">
        <el-button 
          v-for="section in quickNavSections" 
          :key="section.id"
          @click="scrollToItem(section.item)"
          size="small"
          :type="highlightItem === section.item ? 'primary' : 'default'"
        >
          {{ section.label }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const scrollbarRef = ref()
const highlightItem = ref(1)

const targetPosition = reactive({ x: 0, y: 0 })
const currentPosition = reactive({ x: 0, y: 0 })
const containerSize = reactive({ width: 0, height: 0 })
const contentSize = reactive({ width: 0, height: 0 })

const quickNavSections = [
  { id: 1, label: '开始', item: 1 },
  { id: 2, label: '第25项', item: 25 },
  { id: 3, label: '第50项', item: 50 },
  { id: 4, label: '第75项', item: 75 },
  { id: 5, label: '结束', item: 100 }
]

// 滚动到顶部
const scrollToTop = () => {
  scrollbarRef.value?.setScrollTop(0)
  highlightItem.value = 1
  ElMessage.success('已滚动到顶部')
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const wrapEl = scrollbarRef.value?.wrapRef
    if (wrapEl) {
      scrollbarRef.value?.setScrollTop(wrapEl.scrollHeight)
      highlightItem.value = 100
      ElMessage.success('已滚动到底部')
    }
  })
}

// 滚动到中间
const scrollToCenter = () => {
  nextTick(() => {
    const wrapEl = scrollbarRef.value?.wrapRef
    if (wrapEl) {
      const centerY = (wrapEl.scrollHeight - wrapEl.clientHeight) / 2
      const centerX = (wrapEl.scrollWidth - wrapEl.clientWidth) / 2
      scrollbarRef.value?.setScrollTop(centerY)
      scrollbarRef.value?.setScrollLeft(centerX)
      highlightItem.value = 50
      ElMessage.success('已滚动到中间位置')
    }
  })
}

// 滚动到指定位置
const scrollToPosition = () => {
  scrollbarRef.value?.scrollTo(targetPosition.x, targetPosition.y)
  ElMessage.success(`已滚动到位置 (${targetPosition.x}, ${targetPosition.y})`)
}

// 滚动到指定项目
const scrollToItem = (itemNumber) => {
  // 计算项目位置（假设每行5个项目，每个项目高度约120px）
  const row = Math.ceil(itemNumber / 5)
  const targetY = (row - 1) * 120
  
  scrollbarRef.value?.setScrollTop(targetY)
  highlightItem.value = itemNumber
  ElMessage.success(`已滚动到项目 ${itemNumber}`)
}

// 更新滚动条
const updateScrollbar = () => {
  scrollbarRef.value?.update()
  updateSizeInfo()
  ElMessage.success('滚动条状态已更新')
}

// 触发滚动事件
const triggerScroll = () => {
  scrollbarRef.value?.handleScroll()
  ElMessage.info('已触发滚动事件')
}

// 获取包裹元素引用
const getWrapRef = () => {
  const wrapEl = scrollbarRef.value?.wrapRef
  if (wrapEl) {
    console.log('包裹元素:', wrapEl)
    ElMessage.success('包裹元素信息已输出到控制台')
  } else {
    ElMessage.warning('无法获取包裹元素')
  }
}

// 处理滚动事件
const handleScrollEvent = ({ scrollLeft, scrollTop }) => {
  currentPosition.x = Math.round(scrollLeft)
  currentPosition.y = Math.round(scrollTop)
  
  // 根据滚动位置更新高亮项目
  const row = Math.floor(scrollTop / 120) + 1
  const estimatedItem = Math.min((row - 1) * 5 + 1, 100)
  highlightItem.value = estimatedItem
}

// 更新尺寸信息
const updateSizeInfo = () => {
  nextTick(() => {
    const wrapEl = scrollbarRef.value?.wrapRef
    if (wrapEl) {
      containerSize.width = wrapEl.clientWidth
      containerSize.height = wrapEl.clientHeight
      contentSize.width = wrapEl.scrollWidth
      contentSize.height = wrapEl.scrollHeight
    }
  })
}

// 组件挂载后更新尺寸信息
onMounted(() => {
  updateSizeInfo()
})
</script>

<style>
.exposes-demo {
  margin-bottom: 24px;
}

.control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.control-group h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.position-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.scroll-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.info-item span:first-child {
  color: #909399;
  font-weight: 500;
}

.info-item span:last-child {
  color: #303133;
  font-family: 'Monaco', 'Menlo', monospace;
}

.expose-scrollbar {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 20px;
}

.expose-content {
  padding: 20px;
  width: 800px; /* 超出容器宽度以产生横向滚动 */
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.grid-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.grid-item.highlight {
  border-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
}

.item-number {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.grid-item.highlight .item-number {
  color: #f56c6c;
}

.item-label {
  font-size: 12px;
  color: #606266;
}

.horizontal-content {
  display: flex;
  gap: 16px;
  padding: 20px 0;
}

.horizontal-item {
  flex-shrink: 0;
  width: 150px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 500;
}

.quick-nav {
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.quick-nav h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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