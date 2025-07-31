# Tag 标签

## 概述
Tag 标签组件用于标记和选择，是一种轻量级的信息展示组件。Element Plus 的 Tag 组件支持多种类型、尺寸和交互方式，适用于分类标记、状态显示、标签输入等场景。

## 学习目标
- 掌握 Tag 组件的基础用法
- 理解不同类型和主题的标签
- 学会使用可关闭和动态编辑标签
- 掌握标签的事件处理
- 了解标签的高级特性和应用场景

## 基础用法

### 基础标签
最简单的标签使用，通过 `type` 属性设置不同的主题：

```vue
<template>
  <div class="tag-demo">
    <el-tag>标签一</el-tag>
    <el-tag type="success">标签二</el-tag>
    <el-tag type="info">标签三</el-tag>
    <el-tag type="warning">标签四</el-tag>
    <el-tag type="danger">标签五</el-tag>
  </div>
</template>

<style>
.tag-demo .el-tag {
  margin-right: 10px;
}
</style>
```

### 可移除标签
设置 `closable` 属性可以定义一个标签是否可移除：

```vue
<template>
  <div class="tag-demo">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      :type="tag.type"
      closable
      @close="handleClose(tag)"
    >
      {{ tag.name }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tags = ref([
  { name: '标签一', type: '' },
  { name: '标签二', type: 'success' },
  { name: '标签三', type: 'info' },
  { name: '标签四', type: 'warning' },
  { name: '标签五', type: 'danger' }
])

const handleClose = (tag) => {
  const index = tags.value.indexOf(tag)
  if (index > -1) {
    tags.value.splice(index, 1)
  }
}
</script>
```

### 不同尺寸
通过 `size` 属性设置标签的尺寸：

```vue
<template>
  <div class="tag-demo">
    <el-tag size="large">大型标签</el-tag>
    <el-tag>默认标签</el-tag>
    <el-tag size="small">小型标签</el-tag>
  </div>
</template>
```

## 标签主题

### 不同效果
Tag 组件提供了三种不同的主题：`dark`、`light` 和 `plain`：

```vue
<template>
  <div class="tag-demo">
    <h4>Dark</h4>
    <el-tag effect="dark">标签一</el-tag>
    <el-tag type="success" effect="dark">标签二</el-tag>
    <el-tag type="info" effect="dark">标签三</el-tag>
    <el-tag type="warning" effect="dark">标签四</el-tag>
    <el-tag type="danger" effect="dark">标签五</el-tag>
    
    <h4>Light</h4>
    <el-tag effect="light">标签一</el-tag>
    <el-tag type="success" effect="light">标签二</el-tag>
    <el-tag type="info" effect="light">标签三</el-tag>
    <el-tag type="warning" effect="light">标签四</el-tag>
    <el-tag type="danger" effect="light">标签五</el-tag>
    
    <h4>Plain</h4>
    <el-tag effect="plain">标签一</el-tag>
    <el-tag type="success" effect="plain">标签二</el-tag>
    <el-tag type="info" effect="plain">标签三</el-tag>
    <el-tag type="warning" effect="plain">标签四</el-tag>
    <el-tag type="danger" effect="plain">标签五</el-tag>
  </div>
</template>
```

### 圆形标签
通过 `round` 属性设置为圆形标签：

```vue
<template>
  <div class="tag-demo">
    <el-tag round>标签一</el-tag>
    <el-tag type="success" round>标签二</el-tag>
    <el-tag type="info" round>标签三</el-tag>
    <el-tag type="warning" round>标签四</el-tag>
    <el-tag type="danger" round>标签五</el-tag>
  </div>
</template>
```

## 动态编辑标签

### 可编辑标签列表
结合输入框实现动态添加和删除标签：

```vue
<template>
  <div class="tag-editor">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="input-new-tag"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 新标签
    </el-button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const dynamicTags = ref(['标签一', '标签二', '标签三'])
const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref()

const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>

<style>
.tag-editor .el-tag {
  margin-right: 10px;
}

.tag-editor .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.tag-editor .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
```

## 标签选择器

### 可选择标签
实现标签的选择和取消选择功能：

```vue
<template>
  <div class="tag-selector">
    <h4>选择你感兴趣的技术：</h4>
    <el-tag
      v-for="tag in tags"
      :key="tag.id"
      :type="tag.selected ? 'primary' : 'info'"
      :effect="tag.selected ? 'dark' : 'plain'"
      class="selectable-tag"
      @click="toggleTag(tag)"
    >
      {{ tag.name }}
      <el-icon v-if="tag.selected" class="selected-icon">
        <Check />
      </el-icon>
    </el-tag>
    
    <div class="selected-result">
      <h4>已选择：</h4>
      <el-tag
        v-for="tag in selectedTags"
        :key="tag.id"
        type="success"
        closable
        @close="toggleTag(tag)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check } from '@element-plus/icons-vue'

const tags = ref([
  { id: 1, name: 'Vue.js', selected: false },
  { id: 2, name: 'React', selected: false },
  { id: 3, name: 'Angular', selected: false },
  { id: 4, name: 'Node.js', selected: true },
  { id: 5, name: 'TypeScript', selected: false },
  { id: 6, name: 'JavaScript', selected: true },
  { id: 7, name: 'Python', selected: false },
  { id: 8, name: 'Java', selected: false }
])

const selectedTags = computed(() => {
  return tags.value.filter(tag => tag.selected)
})

const toggleTag = (tag) => {
  tag.selected = !tag.selected
}
</script>

<style>
.tag-selector .selectable-tag {
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tag-selector .selectable-tag:hover {
  transform: scale(1.05);
}

.tag-selector .selected-icon {
  margin-left: 5px;
}

.tag-selector .selected-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.tag-selector .selected-result .el-tag {
  margin: 3px;
}
</style>
```

## 实际应用示例

### 文章标签管理系统
一个完整的文章标签管理示例：

```vue
<template>
  <div class="article-tag-manager">
    <div class="article-info">
      <h3>{{ article.title }}</h3>
      <p>{{ article.summary }}</p>
    </div>
    
    <!-- 当前文章标签 -->
    <div class="current-tags">
      <h4>当前标签：</h4>
      <el-tag
        v-for="tag in article.tags"
        :key="tag.id"
        :type="getTagType(tag.category)"
        closable
        @close="removeTag(tag)"
      >
        {{ tag.name }}
      </el-tag>
      
      <el-button 
        v-if="!showAddTag" 
        size="small" 
        @click="showAddTag = true"
      >
        + 添加标签
      </el-button>
    </div>
    
    <!-- 添加标签区域 -->
    <div v-if="showAddTag" class="add-tag-section">
      <h4>添加标签：</h4>
      
      <!-- 标签分类 -->
      <div class="tag-categories">
        <el-tag
          v-for="category in tagCategories"
          :key="category.id"
          :type="selectedCategory?.id === category.id ? 'primary' : 'info'"
          :effect="selectedCategory?.id === category.id ? 'dark' : 'plain'"
          class="category-tag"
          @click="selectCategory(category)"
        >
          {{ category.name }}
        </el-tag>
      </div>
      
      <!-- 可选标签 -->
      <div v-if="selectedCategory" class="available-tags">
        <h5>{{ selectedCategory.name }} 标签：</h5>
        <el-tag
          v-for="tag in availableTags"
          :key="tag.id"
          :type="getTagType(selectedCategory.id)"
          effect="plain"
          class="available-tag"
          @click="addTag(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      
      <!-- 自定义标签输入 -->
      <div class="custom-tag-input">
        <h5>自定义标签：</h5>
        <el-input
          v-model="customTagName"
          placeholder="输入自定义标签名称"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="addCustomTag"
        />
        <el-button type="primary" @click="addCustomTag">添加</el-button>
      </div>
      
      <div class="add-tag-actions">
        <el-button @click="showAddTag = false">取消</el-button>
        <el-button type="primary" @click="saveTags">保存</el-button>
      </div>
    </div>
    
    <!-- 标签统计 -->
    <div class="tag-statistics">
      <h4>标签统计：</h4>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">总标签数：</span>
          <el-tag type="info">{{ article.tags.length }}</el-tag>
        </div>
        <div class="stat-item">
          <span class="stat-label">技术标签：</span>
          <el-tag type="primary">{{ getTechTagCount() }}</el-tag>
        </div>
        <div class="stat-item">
          <span class="stat-label">分类标签：</span>
          <el-tag type="success">{{ getCategoryTagCount() }}</el-tag>
        </div>
        <div class="stat-item">
          <span class="stat-label">自定义标签：</span>
          <el-tag type="warning">{{ getCustomTagCount() }}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const showAddTag = ref(false)
const selectedCategory = ref(null)
const customTagName = ref('')

const article = ref({
  id: 1,
  title: 'Vue 3 组合式 API 深入解析',
  summary: '本文详细介绍了 Vue 3 组合式 API 的使用方法和最佳实践...',
  tags: [
    { id: 1, name: 'Vue.js', category: 1 },
    { id: 2, name: '前端开发', category: 2 },
    { id: 3, name: 'JavaScript', category: 1 }
  ]
})

const tagCategories = ref([
  { id: 1, name: '技术栈', type: 'primary' },
  { id: 2, name: '分类', type: 'success' },
  { id: 3, name: '难度', type: 'warning' },
  { id: 4, name: '自定义', type: 'info' }
])

const allTags = ref([
  { id: 1, name: 'Vue.js', category: 1 },
  { id: 2, name: 'React', category: 1 },
  { id: 3, name: 'Angular', category: 1 },
  { id: 4, name: 'JavaScript', category: 1 },
  { id: 5, name: 'TypeScript', category: 1 },
  { id: 6, name: '前端开发', category: 2 },
  { id: 7, name: '后端开发', category: 2 },
  { id: 8, name: '全栈开发', category: 2 },
  { id: 9, name: '初级', category: 3 },
  { id: 10, name: '中级', category: 3 },
  { id: 11, name: '高级', category: 3 }
])

const availableTags = computed(() => {
  if (!selectedCategory.value) return []
  
  return allTags.value.filter(tag => 
    tag.category === selectedCategory.value.id &&
    !article.value.tags.some(articleTag => articleTag.id === tag.id)
  )
})

const getTagType = (categoryId) => {
  const category = tagCategories.value.find(cat => cat.id === categoryId)
  return category ? category.type : 'info'
}

const selectCategory = (category) => {
  selectedCategory.value = category
}

const addTag = (tag) => {
  if (!article.value.tags.some(t => t.id === tag.id)) {
    article.value.tags.push({ ...tag })
    ElMessage.success(`已添加标签：${tag.name}`)
  }
}

const addCustomTag = () => {
  if (!customTagName.value.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }
  
  const newTag = {
    id: Date.now(),
    name: customTagName.value.trim(),
    category: 4 // 自定义分类
  }
  
  article.value.tags.push(newTag)
  customTagName.value = ''
  ElMessage.success(`已添加自定义标签：${newTag.name}`)
}

const removeTag = (tag) => {
  const index = article.value.tags.findIndex(t => t.id === tag.id)
  if (index > -1) {
    article.value.tags.splice(index, 1)
    ElMessage.success(`已移除标签：${tag.name}`)
  }
}

const saveTags = () => {
  // 模拟保存到服务器
  ElMessage.success('标签保存成功')
  showAddTag.value = false
  selectedCategory.value = null
}

const getTechTagCount = () => {
  return article.value.tags.filter(tag => tag.category === 1).length
}

const getCategoryTagCount = () => {
  return article.value.tags.filter(tag => tag.category === 2).length
}

const getCustomTagCount = () => {
  return article.value.tags.filter(tag => tag.category === 4).length
}
</script>

<style scoped>
.article-tag-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.article-info {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.article-info h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.article-info p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.current-tags {
  margin-bottom: 30px;
}

.current-tags .el-tag {
  margin: 5px 5px 5px 0;
}

.add-tag-section {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 30px;
}

.tag-categories {
  margin-bottom: 20px;
}

.category-tag {
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-tag:hover {
  transform: scale(1.05);
}

.available-tags {
  margin-bottom: 20px;
}

.available-tag {
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.available-tag:hover {
  transform: scale(1.05);
}

.custom-tag-input {
  margin-bottom: 20px;
}

.add-tag-actions {
  text-align: right;
}

.tag-statistics {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-weight: 500;
  color: #606266;
}
</style>
```