# Mention 提及

## 概述

Mention 提及组件用于在输入中提及某人或某事，常用于社交应用、评论系统、协作工具等场景。它基于 el-input 组件派生，支持自定义触发字符、远程搜索、自定义模板等功能。<mcreference link="https://element-plus.org/zh-CN/component/mention.html" index="0">0</mcreference>

### 主要特性

- **灵活的触发机制**：支持自定义触发字符（默认 @）
- **智能搜索**：支持本地过滤和远程搜索
- **自定义模板**：可自定义提及项的显示样式
- **整体删除**：支持将提及内容作为整体删除
- **表单集成**：与 el-form 完美集成
- **丰富的事件**：提供搜索、选择、删除等事件

### 适用场景

- 社交媒体评论和动态发布
- 团队协作工具中的成员提及
- 文档编辑器中的引用功能
- 客服系统中的快速回复
- 任务管理系统中的人员分配

## 学习目标

### 基础知识
- 掌握 Mention 组件的基本概念和使用场景
- 学会基础提及功能的实现
- 了解触发字符的配置方法
- 掌握选项数据的配置

### 进阶技能
- 学会自定义提及项模板
- 掌握远程搜索功能的实现
- 了解整体删除功能的使用
- 学会自定义过滤逻辑

### 实战应用
- 能够构建完整的社交评论系统
- 掌握团队协作工具的提及功能
- 了解性能优化和用户体验提升
- 学会与其他组件的集成使用

## 基础用法

### 基本提及

最简单的提及功能：

```vue
<template>
  <div>
    <h4>基础提及</h4>
    <el-mention
      v-model="value"
      :options="options"
      placeholder="输入 @ 来提及用户"
      @select="handleSelect"
    />
    <p>输入内容：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  { value: 'zhangsan', label: '张三' },
  { value: 'lisi', label: '李四' },
  { value: 'wangwu', label: '王五' },
  { value: 'zhaoliu', label: '赵六' },
  { value: 'qianqi', label: '钱七' }
]

const handleSelect = (option) => {
  console.log('选中的选项：', option)
}
</script>
```

### Textarea 类型

输入类型可以设置为 textarea：

```vue
<template>
  <div>
    <h4>Textarea 类型</h4>
    <el-mention
      v-model="value"
      :options="options"
      type="textarea"
      :rows="4"
      placeholder="在多行文本中输入 @ 来提及用户"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  { value: 'frontend', label: '前端团队' },
  { value: 'backend', label: '后端团队' },
  { value: 'design', label: '设计团队' },
  { value: 'product', label: '产品团队' },
  { value: 'qa', label: '测试团队' }
]

const handleSelect = (option) => {
  console.log('选中的团队：', option)
}
</script>
```

### 自定义标签

使用 "label" 插槽自定义标签：

```vue
<template>
  <div>
    <h4>自定义标签</h4>
    <el-mention
      v-model="value"
      :options="options"
      placeholder="输入 @ 来提及用户"
      @select="handleSelect"
    >
      <template #label="{ option }">
        <div class="custom-label">
          <img :src="option.avatar" :alt="option.label" class="avatar" />
          <span class="name">{{ option.label }}</span>
          <span class="role">{{ option.role }}</span>
        </div>
      </template>
    </el-mention>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const options = [
  {
    value: 'zhangsan',
    label: '张三',
    role: '前端工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    value: 'lisi',
    label: '李四',
    role: '后端工程师',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  },
  {
    value: 'wangwu',
    label: '王五',
    role: 'UI设计师',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }
]

const handleSelect = (option) => {
  console.log('选中的用户：', option)
}
</script>

<style scoped>
.custom-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-weight: 500;
  color: #303133;
}

.role {
  font-size: 12px;
  color: #909399;
}
</style>
```

### 加载远程选项

异步加载选项：

```vue
<template>
  <div>
    <h4>远程搜索</h4>
    <el-mention
      v-model="value"
      :options="options"
      :loading="loading"
      placeholder="输入 @ 搜索用户"
      @search="handleSearch"
      @select="handleSelect"
    >
      <template #loading>
        <div class="loading-content">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>搜索中...</span>
        </div>
      </template>
    </el-mention>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Loading } from '@element-plus/icons-vue'

const value = ref('')
const options = ref([])
const loading = ref(false)

// 模拟远程数据
const remoteUsers = [
  { value: 'user1', label: '张三', department: '技术部' },
  { value: 'user2', label: '李四', department: '产品部' },
  { value: 'user3', label: '王五', department: '设计部' },
  { value: 'user4', label: '赵六', department: '运营部' },
  { value: 'user5', label: '钱七', department: '市场部' },
  { value: 'user6', label: '孙八', department: '技术部' },
  { value: 'user7', label: '周九', department: '财务部' },
  { value: 'user8', label: '吴十', department: '人事部' }
]

const handleSearch = (query) => {
  loading.value = true
  
  // 模拟网络请求
  setTimeout(() => {
    if (query) {
      options.value = remoteUsers.filter(user => 
        user.label.includes(query) || user.department.includes(query)
      )
    } else {
      options.value = remoteUsers.slice(0, 5)
    }
    loading.value = false
  }, 300)
}

const handleSelect = (option) => {
  console.log('选中的用户：', option)
}
</script>

<style scoped>
.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #909399;
}
</style>
```

### 自定义触发字段

通过 prefix 属性自定义触发字段：

```vue
<template>
  <div>
    <h4>自定义触发字符</h4>
    
    <div class="trigger-example">
      <label>使用 # 触发标签：</label>
      <el-mention
        v-model="tagValue"
        :options="tagOptions"
        prefix="#"
        placeholder="输入 # 来添加标签"
        @select="handleTagSelect"
      />
    </div>
    
    <div class="trigger-example">
      <label>使用 / 触发命令：</label>
      <el-mention
        v-model="commandValue"
        :options="commandOptions"
        prefix="/"
        placeholder="输入 / 来执行命令"
        @select="handleCommandSelect"
      />
    </div>
    
    <div class="trigger-example">
      <label>多个触发字符：</label>
      <el-mention
        v-model="multiValue"
        :options="multiOptions"
        :prefix="['@', '#']"
        placeholder="输入 @ 提及用户或 # 添加标签"
        @select="handleMultiSelect"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tagValue = ref('')
const commandValue = ref('')
const multiValue = ref('')

const tagOptions = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' }
]

const commandOptions = [
  { value: 'help', label: '帮助', description: '显示帮助信息' },
  { value: 'save', label: '保存', description: '保存当前文档' },
  { value: 'export', label: '导出', description: '导出为PDF' },
  { value: 'share', label: '分享', description: '分享给其他人' },
  { value: 'delete', label: '删除', description: '删除当前内容' }
]

const multiOptions = [
  { value: 'zhangsan', label: '张三', type: 'user' },
  { value: 'lisi', label: '李四', type: 'user' },
  { value: 'frontend', label: '前端', type: 'tag' },
  { value: 'backend', label: '后端', type: 'tag' },
  { value: 'urgent', label: '紧急', type: 'tag' }
]

const handleTagSelect = (option) => {
  console.log('选中的标签：', option)
}

const handleCommandSelect = (option) => {
  console.log('执行命令：', option)
}

const handleMultiSelect = (option) => {
  console.log('选中的项目：', option)
}
</script>

<style scoped>
.trigger-example {
  margin-bottom: 16px;
}

.trigger-example label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### 整体删除

将 whole 属性设置为 true，当按下退格键时，提及区域将作为一个整体被删除：

```vue
<template>
  <div>
    <h4>整体删除功能</h4>
    
    <div class="delete-example">
      <label>启用整体删除：</label>
      <el-mention
        v-model="wholeValue"
        :options="options"
        whole
        placeholder="提及后按退格键整体删除"
        @select="handleSelect"
        @whole-remove="handleWholeRemove"
      />
    </div>
    
    <div class="delete-example">
      <label>自定义删除检查：</label>
      <el-mention
        v-model="customValue"
        :options="options"
        :check-is-whole="checkIsWhole"
        placeholder="自定义删除逻辑"
        @select="handleSelect"
        @whole-remove="handleWholeRemove"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const wholeValue = ref('')
const customValue = ref('')

const options = [
  { value: 'zhangsan', label: '张三' },
  { value: 'lisi', label: '李四' },
  { value: 'wangwu', label: '王五' },
  { value: 'zhaoliu', label: '赵六' }
]

const handleSelect = (option) => {
  console.log('选中的选项：', option)
}

const handleWholeRemove = (option) => {
  ElMessage.info(`整体删除了：${option.label}`)
}

// 自定义删除检查逻辑
const checkIsWhole = (option) => {
  // 只有管理员可以整体删除
  return option.value === 'zhangsan'
}
</script>

<style scoped>
.delete-example {
  margin-bottom: 16px;
}

.delete-example label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}
</style>
```

## 在表单中使用

与 el-form 一起使用：

```vue
<template>
  <div>
    <h4>表单中的提及</h4>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-mention
          v-model="form.content"
          :options="userOptions"
          type="textarea"
          :rows="4"
          placeholder="输入内容，使用 @ 提及相关人员"
          @select="handleUserSelect"
        >
          <template #label="{ option }">
            <div class="user-option">
              <img :src="option.avatar" :alt="option.label" class="user-avatar" />
              <div class="user-info">
                <div class="user-name">{{ option.label }}</div>
                <div class="user-role">{{ option.role }}</div>
              </div>
            </div>
          </template>
        </el-mention>
      </el-form-item>
      
      <el-form-item label="标签" prop="tags">
        <el-mention
          v-model="form.tags"
          :options="tagOptions"
          prefix="#"
          placeholder="使用 # 添加标签"
          @select="handleTagSelect"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="submittedData" class="submitted-data">
      <h4>提交的数据：</h4>
      <pre>{{ JSON.stringify(submittedData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submittedData = ref(null)

const form = reactive({
  title: '',
  content: '',
  tags: ''
})

const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ]
}

const userOptions = [
  {
    value: 'zhangsan',
    label: '张三',
    role: '项目经理',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    value: 'lisi',
    label: '李四',
    role: '技术负责人',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  },
  {
    value: 'wangwu',
    label: '王五',
    role: '设计师',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  }
]

const tagOptions = [
  { value: 'urgent', label: '紧急' },
  { value: 'important', label: '重要' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: '新功能' },
  { value: 'optimization', label: '优化' }
]

const handleUserSelect = (option) => {
  console.log('提及用户：', option)
}

const handleTagSelect = (option) => {
  console.log('添加标签：', option)
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    submittedData.value = { ...form }
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  submittedData.value = null
}
</script>

<style scoped>
.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.user-role {
  font-size: 12px;
  color: #909399;
}

.submitted-data {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.submitted-data pre {
  margin: 0;
  font-size: 12px;
  color: #606266;
}
</style>
```

## 实际应用示例

### 社交评论系统

```vue
<template>
  <div class="comment-system">
    <h3>社交评论系统</h3>
    
    <div class="comment-input">
      <div class="user-avatar">
        <img src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="当前用户" />
      </div>
      
      <div class="input-area">
        <el-mention
          v-model="commentText"
          :options="mentionOptions"
          :loading="searchLoading"
          type="textarea"
          :rows="3"
          placeholder="写下你的评论... 使用 @ 提及其他用户"
          @search="handleUserSearch"
          @select="handleMentionSelect"
        >
          <template #label="{ option }">
            <div class="mention-user">
              <img :src="option.avatar" :alt="option.label" class="mention-avatar" />
              <div class="mention-info">
                <div class="mention-name">{{ option.label }}</div>
                <div class="mention-followers">{{ option.followers }} 关注者</div>
              </div>
              <el-tag v-if="option.verified" type="success" size="small">认证</el-tag>
            </div>
          </template>
        </el-mention>
        
        <div class="comment-actions">
          <div class="comment-tools">
            <el-button text @click="addEmoji">😊</el-button>
            <el-button text @click="addImage">📷</el-button>
            <el-button text @click="addLink">🔗</el-button>
          </div>
          
          <div class="comment-submit">
            <span class="char-count" :class="{ 'over-limit': commentText.length > 280 }">
              {{ commentText.length }}/280
            </span>
            <el-button 
              type="primary" 
              size="small" 
              :disabled="!commentText.trim() || commentText.length > 280"
              @click="submitComment"
            >
              发布评论
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="comments-list">
      <h4>评论列表</h4>
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          <img :src="comment.user.avatar" :alt="comment.user.name" />
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-author">{{ comment.user.name }}</span>
            <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
          </div>
          <div class="comment-text" v-html="formatMentions(comment.text)"></div>
          <div class="comment-actions">
            <el-button text size="small" @click="likeComment(comment)">👍 {{ comment.likes }}</el-button>
            <el-button text size="small" @click="replyComment(comment)">回复</el-button>
            <el-button text size="small" @click="shareComment(comment)">分享</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const commentText = ref('')
const searchLoading = ref(false)
const mentionOptions = ref([])

// 模拟用户数据
const allUsers = [
  {
    value: 'alice',
    label: 'Alice Johnson',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    followers: 1250,
    verified: true
  },
  {
    value: 'bob',
    label: 'Bob Smith',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    followers: 890,
    verified: false
  },
  {
    value: 'carol',
    label: 'Carol Davis',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    followers: 2100,
    verified: true
  },
  {
    value: 'david',
    label: 'David Wilson',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png',
    followers: 567,
    verified: false
  }
]

const comments = reactive([
  {
    id: 1,
    user: {
      name: 'Alice Johnson',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    text: '这个功能真的很棒！@bob 你觉得呢？',
    likes: 12,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    user: {
      name: 'Bob Smith',
      avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    },
    text: '@alice 确实不错，期待更多更新！',
    likes: 8,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
])

const handleUserSearch = (query) => {
  searchLoading.value = true
  
  setTimeout(() => {
    if (query) {
      mentionOptions.value = allUsers.filter(user => 
        user.label.toLowerCase().includes(query.toLowerCase())
      )
    } else {
      mentionOptions.value = allUsers.slice(0, 5)
    }
    searchLoading.value = false
  }, 200)
}

const handleMentionSelect = (option) => {
  console.log('提及用户：', option)
}

const addEmoji = () => {
  commentText.value += ' 😊 '
}

const addImage = () => {
  ElMessage.info('图片上传功能')
}

const addLink = () => {
  ElMessage.info('链接添加功能')
}

const submitComment = () => {
  if (!commentText.value.trim()) return
  
  const newComment = {
    id: comments.length + 1,
    user: {
      name: '当前用户',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
    text: commentText.value,
    likes: 0,
    createdAt: new Date()
  }
  
  comments.unshift(newComment)
  commentText.value = ''
  ElMessage.success('评论发布成功')
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return date.toLocaleDateString()
  }
}

const formatMentions = (text) => {
  return text.replace(/@(\w+)/g, '<span class="mention-highlight">@$1</span>')
}

const likeComment = (comment) => {
  comment.likes++
  ElMessage.success('点赞成功')
}

const replyComment = (comment) => {
  commentText.value = `@${comment.user.name} `
}

const shareComment = (comment) => {
  ElMessage.info('分享功能')
}
</script>

<style scoped>
.comment-system {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.comment-input {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.input-area {
  flex: 1;
}

.mention-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.mention-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.mention-info {
  flex: 1;
}

.mention-name {
  font-weight: 500;
  color: #303133;
}

.mention-followers {
  font-size: 12px;
  color: #909399;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.comment-tools {
  display: flex;
  gap: 8px;
}

.comment-submit {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  font-size: 12px;
  color: #909399;
}

.char-count.over-limit {
  color: #f56c6c;
}

.comments-list {
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.comment-item:hover {
  background-color: #f5f7fa;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 500;
  color: #303133;
}

.comment-time {
  font-size: 12px;
  color: #909399;
}

.comment-text {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #606266;
}

.comment-text :deep(.mention-highlight) {
  color: #409eff;
  font-weight: 500;
}

.comment-actions {
  display: flex;
  gap: 16px;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| options | 提及选项列表 | array | [] |
| prefix | 触发字段的前缀。字符串长度必须且只能为 1 | string \| array | '@' |
| split | 用于拆分提及的字符。字符串长度必须且只能为 1 | string | ' ' |
| filter-option | 定制筛选器选项逻辑 | false \| Function | — |
| placement | 设置弹出位置 | string | 'bottom' |
| show-arrow | 下拉菜单的内容是否有箭头 | boolean | false |
| offset | 下拉面板偏移量 | number | 0 |
| whole | 当退格键被按下做删除操作时，是否将提及部分作为整体删除 | boolean | false |
| check-is-whole | 当退格键被按下做删除操作时，检查是否将提及部分作为整体删除 | Function | — |
| loading | 提及的下拉面板是否处于加载状态 | boolean | false |
| model-value / v-model | 输入值 | string | — |
| popper-class | 自定义浮层类名 | string | — |
| popper-options | popper.js 参数 | object | refer to popper.js doc |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| search | 按下触发字段时触发 | Function |
| select | 当用户选择选项时触发 | Function |
| whole-remove | 当整个 mention 被移除，且 whole 为 true 或 check-is-whole 为 true 时触发 | Function |

### Slots

| 插槽名 | 说明 | 类型 |
|--------|------|------|
| label | 自定义标签内容 | object |
| loading | 自定义 loading 内容 | — |
| header | 下拉列表顶部的内容 | — |
| footer | 下拉列表底部的内容 | — |

### Exposes

| 方法名 | 说明 | 类型 |
|--------|------|------|
| input | el-input 组件实例 | object |
| tooltip | el-tooltip 组件实例 | object |
| dropdownVisible | tooltip 显示状态 | object |

## 最佳实践

### 1. 触发字符选择

```vue
<template>
  <div>
    <!-- 用户提及使用 @ -->
    <el-mention
      v-model="userMention"
      :options="users"
      prefix="@"
      placeholder="@用户名"
    />
    
    <!-- 标签使用 # -->
    <el-mention
      v-model="tagMention"
      :options="tags"
      prefix="#"
      placeholder="#标签"
    />
    
    <!-- 命令使用 / -->
    <el-mention
      v-model="commandMention"
      :options="commands"
      prefix="/"
      placeholder="/命令"
    />
  </div>
</template>
```

### 2. 性能优化

```vue
<script setup>
// 使用防抖优化搜索
import { debounce } from 'lodash-es'

const debouncedSearch = debounce((query, callback) => {
  // 执行搜索逻辑
  searchUsers(query).then(callback)
}, 300)

const handleSearch = (query, callback) => {
  debouncedSearch(query, callback)
}

// 限制选项数量
const limitOptions = (options, limit = 10) => {
  return options.slice(0, limit)
}
</script>
```

### 3. 用户体验优化

```vue
<template>
  <el-mention
    v-model="value"
    :options="options"
    :loading="loading"
    placeholder="输入 @ 搜索用户"
    @search="handleSearch"
  >
    <!-- 自定义加载状态 -->
    <template #loading>
      <div class="loading-state">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>搜索中...</span>
      </div>
    </template>
    
    <!-- 自定义空状态 -->
    <template #footer>
      <div v-if="!loading && options.length === 0" class="empty-state">
        <el-icon><User /></el-icon>
        <span>未找到相关用户</span>
      </div>
    </template>
  </el-mention>
</template>
```

### 4. 权限控制

```vue
<script setup>
// 根据权限过滤用户
const filterUsersByPermission = (users, currentUser) => {
  return users.filter(user => {
    // 只能提及同部门或下级用户
    return user.department === currentUser.department ||
           user.level < currentUser.level
  })
}

// 限制提及数量
const validateMentionCount = (text, maxCount = 5) => {
  const mentions = text.match(/@\w+/g) || []
  return mentions.length <= maxCount
}
</script>
```

## 常见问题

### 1. 下拉菜单不显示

**问题**：输入触发字符后下拉菜单不显示

**解决方案**：
```vue
<script setup>
// 确保 options 数据格式正确
const options = [
  { value: 'user1', label: '用户1' }, // 必须包含 value 和 label
  { value: 'user2', label: '用户2' }
]

// 检查 fetch-suggestions 回调
const handleSearch = (query, callback) => {
  // 必须调用 callback
  callback(filteredOptions)
}
</script>
```

### 2. 自定义过滤逻辑

**问题**：需要自定义搜索过滤逻辑

**解决方案**：
```vue
<template>
  <el-mention
    v-model="value"
    :options="options"
    :filter-option="customFilter"
  />
</template>

<script setup>
const customFilter = (option, query) => {
  // 支持拼音搜索、模糊匹配等
  return option.label.includes(query) ||
         option.pinyin?.includes(query) ||
         option.alias?.includes(query)
}
</script>
```

### 3. 提及内容的存储和显示

**问题**：如何正确存储和显示提及内容

**解决方案**：
```vue
<script setup>
// 存储时保留原始格式
const saveContent = (content) => {
  // content: "Hello @zhangsan, how are you?"
  return content // 直接存储包含 @用户名 的文本
}

// 显示时转换为可点击链接
const formatContent = (content) => {
  return content.replace(
    /@(\w+)/g,
    '<a href="/user/$1" class="mention-link">@$1</a>'
  )
}
</script>
```

### 4. 移动端适配

**问题**：移动端下拉菜单位置不正确

**解决方案**：
```vue
<template>
  <el-mention
    v-model="value"
    :options="options"
    :placement="isMobile ? 'top' : 'bottom'"
    :popper-options="popperOptions"
  />
</template>

<script setup>
const isMobile = ref(window.innerWidth < 768)

const popperOptions = {
  modifiers: [
    {
      name: 'preventOverflow',
      options: {
        boundary: 'viewport'
      }
    }
  ]
}
</script>
```

## 总结

Mention 提及组件是一个功能强大的输入增强组件，主要特点包括：

- **灵活的触发机制**：支持自定义触发字符和多触发字符
- **智能搜索功能**：支持本地过滤和远程搜索
- **丰富的自定义选项**：可自定义模板、样式和行为
- **完善的用户体验**：支持整体删除、加载状态、空状态等
- **良好的集成性**：与表单组件完美集成

### 适用场景
- 社交媒体和评论系统
- 团队协作和沟通工具
- 文档编辑和知识管理
- 任务管理和项目协作

### 设计原则
- 保持简洁直观的交互方式
- 提供清晰的视觉反馈
- 支持键盘和鼠标操作
- 考虑移动端用户体验
- 注重性能和响应速度

## 参考资料

- [Element Plus Mention 官方文档](https://element-plus.org/zh-CN/component/mention.html)
- [MDN - Input Events](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)
- [WAI-ARIA - Combobox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Popper.js 文档](https://popper.js.org/docs/v2/)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)