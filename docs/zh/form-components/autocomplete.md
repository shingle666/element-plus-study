# Autocomplete 自动补全输入框

## 概述

Autocomplete 自动补全输入框是一个带输入建议的输入框组件，可以根据用户输入提供相关的建议选项。它结合了输入框和下拉选择的功能，为用户提供智能的输入辅助。

## 学习目标

- 掌握 Autocomplete 的基本概念和使用场景
- 学会基础自动补全功能的实现
- 了解数据源配置和过滤机制
- 掌握自定义建议项模板
- 学会远程搜索功能的实现
- 了解防抖优化和性能提升
- 掌握 API 的完整使用方法

## 基础用法

### 基本自动补全

最简单的自动补全功能：

```vue
<template>
  <div>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入餐厅名称"
      @select="handleSelect"
    />
    <p>选中的值：{{ state }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const restaurants = [
  { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
  { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
  { value: '泷千家(天山西路店)', address: '天山西路438号' },
  { value: '胖仙女烧烤-精酿啤酒·新疆烧烤', address: '金沙江路1699号鑫乐惠美食广场A13' },
  { value: '麦当劳(天山西路店)', address: '天山西路438号' },
  { value: '肯德基(延安西路店)', address: '延安西路1228号' },
  { value: '星巴克(中山公园店)', address: '长宁路1158号' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurants.filter(createFilter(queryString))
    : restaurants
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item) => {
  console.log('选中的项目：', item)
}
</script>
```

### 自定义模板

使用作用域插槽自定义建议项的显示：

```vue
<template>
  <div>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入餐厅名称"
      @select="handleSelect"
    >
      <template #default="{ item }">
        <div class="suggestion-item">
          <div class="name">{{ item.value }}</div>
          <div class="address">{{ item.address }}</div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const restaurants = [
  { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
  { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号创邑金沙谷6号楼113' },
  { value: '泷千家(天山西路店)', address: '天山西路438号' },
  { value: '胖仙女烧烤-精酿啤酒·新疆烧烤', address: '金沙江路1699号鑫乐惠美食广场A13' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurants.filter(createFilter(queryString))
    : restaurants
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item) => {
  console.log('选中的项目：', item)
}
</script>

<style scoped>
.suggestion-item {
  padding: 4px 0;
}

.name {
  font-weight: 500;
  color: #303133;
}

.address {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
```

### 远程搜索

从服务器搜索数据：

```vue
<template>
  <div>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入关键词"
      :debounce="600"
      @select="handleSelect"
    />
    <p>选中的值：{{ state }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

// 模拟远程数据
const mockData = [
  { value: 'Vue.js', category: '前端框架' },
  { value: 'React', category: '前端框架' },
  { value: 'Angular', category: '前端框架' },
  { value: 'Node.js', category: '后端技术' },
  { value: 'Express', category: '后端框架' },
  { value: 'Koa', category: '后端框架' },
  { value: 'MongoDB', category: '数据库' },
  { value: 'MySQL', category: '数据库' },
  { value: 'Redis', category: '缓存' },
  { value: 'Docker', category: '容器技术' }
]

const querySearchAsync = (queryString, cb) => {
  // 模拟网络延迟
  setTimeout(() => {
    const results = queryString
      ? mockData.filter(item => 
          item.value.toLowerCase().includes(queryString.toLowerCase())
        )
      : mockData
    cb(results)
  }, Math.random() * 200 + 200)
}

const handleSelect = (item) => {
  console.log('选中的项目：', item)
}
</script>
```

### 输入长度限制

设置触发搜索的最小输入长度：

```vue
<template>
  <div>
    <h4>至少输入2个字符才触发搜索</h4>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入至少2个字符"
      :trigger-on-focus="false"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const cities = [
  { value: '北京', code: 'BJ' },
  { value: '上海', code: 'SH' },
  { value: '广州', code: 'GZ' },
  { value: '深圳', code: 'SZ' },
  { value: '杭州', code: 'HZ' },
  { value: '南京', code: 'NJ' },
  { value: '苏州', code: 'SZ' },
  { value: '成都', code: 'CD' },
  { value: '重庆', code: 'CQ' },
  { value: '武汉', code: 'WH' }
]

const querySearch = (queryString, cb) => {
  // 至少输入2个字符才进行搜索
  if (queryString.length < 2) {
    cb([])
    return
  }
  
  const results = cities.filter(city => 
    city.value.toLowerCase().includes(queryString.toLowerCase())
  )
  cb(results)
}

const handleSelect = (item) => {
  console.log('选中的城市：', item)
}
</script>
```

### 高亮匹配文本

自定义模板实现匹配文本高亮：

```vue
<template>
  <div>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入技术名称"
      @select="handleSelect"
    >
      <template #default="{ item }">
        <div class="suggestion-item">
          <div class="name" v-html="highlightMatch(item.value, state)"></div>
          <div class="category">{{ item.category }}</div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const technologies = [
  { value: 'JavaScript', category: '编程语言' },
  { value: 'TypeScript', category: '编程语言' },
  { value: 'Python', category: '编程语言' },
  { value: 'Java', category: '编程语言' },
  { value: 'Vue.js', category: '前端框架' },
  { value: 'React', category: '前端框架' },
  { value: 'Angular', category: '前端框架' },
  { value: 'Node.js', category: '运行时环境' },
  { value: 'Express', category: '后端框架' },
  { value: 'Nest.js', category: '后端框架' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? technologies.filter(tech => 
        tech.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : technologies
  cb(results)
}

const highlightMatch = (text, query) => {
  if (!query) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const handleSelect = (item) => {
  console.log('选中的技术：', item)
}
</script>

<style scoped>
.suggestion-item {
  padding: 4px 0;
}

.name {
  font-weight: 500;
  color: #303133;
}

.name :deep(mark) {
  background-color: #409eff;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}

.category {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
```

## 不同状态

### 禁用状态

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="禁用状态"
      disabled
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('已禁用的输入框')

const querySearch = (queryString, cb) => {
  cb([])
}
</script>
```

### 可清空

```vue
<template>
  <div>
    <h4>可清空</h4>
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="可清空的输入框"
      clearable
      @clear="handleClear"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const state = ref('')

const suggestions = [
  { value: 'Vue.js' },
  { value: 'React' },
  { value: 'Angular' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? suggestions.filter(item => 
        item.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : suggestions
  cb(results)
}

const handleClear = () => {
  console.log('输入框已清空')
}
</script>
```

## 带输入建议

### 前置/后置内容

```vue
<template>
  <div>
    <h4>前置内容</h4>
    <el-autocomplete
      v-model="state1"
      :fetch-suggestions="querySearch"
      placeholder="请输入网址"
    >
      <template #prepend>https://</template>
    </el-autocomplete>
    
    <h4>后置内容</h4>
    <el-autocomplete
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="请输入邮箱"
    >
      <template #append>@gmail.com</template>
    </el-autocomplete>
    
    <h4>前缀/后缀图标</h4>
    <el-autocomplete
      v-model="state3"
      :fetch-suggestions="querySearch"
      placeholder="搜索"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #suffix>
        <el-icon><Star /></el-icon>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Star } from '@element-plus/icons-vue'

const state1 = ref('')
const state2 = ref('')
const state3 = ref('')

const websites = [
  { value: 'www.github.com' },
  { value: 'www.stackoverflow.com' },
  { value: 'www.vue.js.org' },
  { value: 'www.element-plus.org' }
]

const querySearch = (queryString, cb) => {
  const results = queryString
    ? websites.filter(site => 
        site.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : websites
  cb(results)
}
</script>
```

## 实际应用示例

### 用户搜索组件

```vue
<template>
  <div class="user-search">
    <h3>用户搜索</h3>
    
    <div class="search-container">
      <el-autocomplete
        v-model="searchQuery"
        :fetch-suggestions="searchUsers"
        placeholder="搜索用户（姓名、邮箱、部门）"
        :debounce="300"
        clearable
        @select="handleUserSelect"
        @clear="handleClear"
      >
        <template #default="{ item }">
          <div class="user-item">
            <div class="user-avatar">
              <img :src="item.avatar" :alt="item.name" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ item.name }}</div>
              <div class="user-details">
                <span class="email">{{ item.email }}</span>
                <span class="department">{{ item.department }}</span>
              </div>
            </div>
            <div class="user-status">
              <el-tag :type="item.status === 'active' ? 'success' : 'info'" size="small">
                {{ item.status === 'active' ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
        </template>
        
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-autocomplete>
    </div>
    
    <div v-if="selectedUser" class="selected-user">
      <h4>选中的用户</h4>
      <div class="user-card">
        <img :src="selectedUser.avatar" :alt="selectedUser.name" class="avatar" />
        <div class="info">
          <h5>{{ selectedUser.name }}</h5>
          <p>{{ selectedUser.email }}</p>
          <p>{{ selectedUser.department }}</p>
          <el-tag :type="selectedUser.status === 'active' ? 'success' : 'info'" size="small">
            {{ selectedUser.status === 'active' ? '在线' : '离线' }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const selectedUser = ref(null)

// 模拟用户数据
const users = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@company.com',
    department: '技术部',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@company.com',
    department: '产品部',
    status: 'inactive',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@company.com',
    department: '设计部',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@company.com',
    department: '运营部',
    status: 'active',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48png.png'
  },
  {
    id: 5,
    name: '钱七',
    email: 'qianqi@company.com',
    department: '技术部',
    status: 'inactive',
    avatar: 'https://cube.elemecdn.com/f/4a/ce7e1961e1a051d0f2bf113d6018apng.png'
  }
]

const searchUsers = (queryString, cb) => {
  if (!queryString) {
    cb(users.slice(0, 5)) // 默认显示前5个用户
    return
  }
  
  const query = queryString.toLowerCase()
  const results = users.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.department.toLowerCase().includes(query)
  )
  
  cb(results)
}

const handleUserSelect = (user) => {
  selectedUser.value = user
  ElMessage.success(`选择了用户：${user.name}`)
}

const handleClear = () => {
  selectedUser.value = null
  ElMessage.info('已清空选择')
}
</script>

<style scoped>
.user-search {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.search-container {
  margin-bottom: 20px;
}

.search-container .el-autocomplete {
  width: 100%;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  gap: 12px;
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

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.user-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #909399;
}

.user-status {
  margin-left: auto;
}

.selected-user {
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.user-card .avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card .info h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.user-card .info p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}
</style>
```

### 标签输入组件

```vue
<template>
  <div class="tag-input">
    <h3>标签输入</h3>
    
    <div class="input-container">
      <div class="tags">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag.id"
          closable
          @close="removeTag(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
      
      <el-autocomplete
        v-model="tagInput"
        :fetch-suggestions="searchTags"
        placeholder="输入标签名称"
        :debounce="200"
        @select="addTag"
        @keyup.enter="addCustomTag"
        class="tag-autocomplete"
      >
        <template #default="{ item }">
          <div class="tag-item">
            <span class="tag-name">{{ item.name }}</span>
            <span class="tag-count">{{ item.count }} 次使用</span>
          </div>
        </template>
      </el-autocomplete>
    </div>
    
    <div class="tag-suggestions">
      <h4>推荐标签</h4>
      <div class="suggestion-tags">
        <el-tag
          v-for="tag in recommendedTags"
          :key="tag.id"
          :type="isTagSelected(tag) ? 'success' : 'info'"
          @click="toggleTag(tag)"
          style="cursor: pointer; margin: 4px;"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
    
    <div class="selected-tags-info">
      <h4>已选标签 ({{ selectedTags.length }})</h4>
      <p v-if="selectedTags.length === 0" class="no-tags">暂无选中的标签</p>
      <div v-else class="tags-list">
        <span v-for="(tag, index) in selectedTags" :key="tag.id">
          {{ tag.name }}<span v-if="index < selectedTags.length - 1">, </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const tagInput = ref('')
const selectedTags = ref([])

// 模拟标签数据
const allTags = [
  { id: 1, name: 'Vue.js', count: 1250 },
  { id: 2, name: 'React', count: 980 },
  { id: 3, name: 'JavaScript', count: 2100 },
  { id: 4, name: 'TypeScript', count: 750 },
  { id: 5, name: 'Node.js', count: 650 },
  { id: 6, name: 'CSS', count: 1800 },
  { id: 7, name: 'HTML', count: 1900 },
  { id: 8, name: 'Python', count: 1100 },
  { id: 9, name: 'Java', count: 900 },
  { id: 10, name: 'Go', count: 400 },
  { id: 11, name: 'Rust', count: 200 },
  { id: 12, name: 'Docker', count: 550 },
  { id: 13, name: 'Kubernetes', count: 300 },
  { id: 14, name: 'MongoDB', count: 450 },
  { id: 15, name: 'MySQL', count: 800 }
]

const recommendedTags = computed(() => {
  return allTags.slice(0, 8) // 显示前8个推荐标签
})

const searchTags = (queryString, cb) => {
  if (!queryString) {
    cb(allTags.slice(0, 10))
    return
  }
  
  const query = queryString.toLowerCase()
  const results = allTags.filter(tag => 
    tag.name.toLowerCase().includes(query) &&
    !selectedTags.value.some(selected => selected.id === tag.id)
  )
  
  cb(results)
}

const addTag = (tag) => {
  if (!selectedTags.value.some(selected => selected.id === tag.id)) {
    selectedTags.value.push(tag)
    tagInput.value = ''
    ElMessage.success(`添加标签：${tag.name}`)
  } else {
    ElMessage.warning('标签已存在')
  }
}

const addCustomTag = () => {
  const tagName = tagInput.value.trim()
  if (!tagName) return
  
  // 检查是否已存在
  if (selectedTags.value.some(tag => tag.name.toLowerCase() === tagName.toLowerCase())) {
    ElMessage.warning('标签已存在')
    return
  }
  
  // 创建新标签
  const newTag = {
    id: Date.now(),
    name: tagName,
    count: 0
  }
  
  selectedTags.value.push(newTag)
  tagInput.value = ''
  ElMessage.success(`添加自定义标签：${newTag.name}`)
}

const removeTag = (tag) => {
  const index = selectedTags.value.findIndex(selected => selected.id === tag.id)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
    ElMessage.info(`移除标签：${tag.name}`)
  }
}

const isTagSelected = (tag) => {
  return selectedTags.value.some(selected => selected.id === tag.id)
}

const toggleTag = (tag) => {
  if (isTagSelected(tag)) {
    removeTag(tag)
  } else {
    addTag(tag)
  }
}
</script>

<style scoped>
.tag-input {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.input-container {
  margin-bottom: 20px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  min-height: 32px;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fafafa;
}

.tag-autocomplete {
  width: 100%;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.tag-name {
  font-weight: 500;
  color: #303133;
}

.tag-count {
  font-size: 12px;
  color: #909399;
}

.tag-suggestions {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.tag-suggestions h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tags-info {
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.selected-tags-info h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.no-tags {
  color: #909399;
  font-style: italic;
}

.tags-list {
  color: #606266;
  line-height: 1.5;
}
</style>
```

## API 文档

### Autocomplete Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string | — |
| placeholder | 输入框占位文本 | string | — |
| clearable | 是否可清空 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| value-key | 输入建议对象中用于显示的键名 | string | value |
| debounce | 获取输入建议的去抖延时 | number | 300 |
| placement | 菜单弹出位置 | enum | bottom-start |
| fetch-suggestions | 返回输入建议的方法 | function | — |
| popper-class | Autocomplete 下拉列表的类名 | string | — |
| trigger-on-focus | 是否在输入框 focus 时显示建议列表 | boolean | true |
| name | 原生属性 | string | — |
| select-when-unmatched | 在输入没有任何匹配建议的情况下，按下回车是否触发 select 事件 | boolean | false |
| label | 输入框关联的 label 文字 | string | — |
| prefix-icon | 输入框头部图标 | string / Component | — |
| suffix-icon | 输入框尾部图标 | string / Component | — |
| hide-loading | 是否隐藏远程加载时的加载图标 | boolean | false |
| popper-append-to-body | 是否将下拉列表插入至 body 元素 | boolean | false |
| highlight-first-item | 是否默认突出显示远程搜索建议中的第一项 | boolean | false |

### Autocomplete Events

| 名称 | 说明 | 类型 |
|------|------|------|
| select | 点击选中建议项时触发 | Function |
| change | 在 Input 值改变时触发 | Function |
| focus | 在 Input 获得焦点时触发 | Function |
| blur | 在 Input 失去焦点时触发 | Function |
| clear | 在点击由 clearable 属性生成的清空按钮时触发 | Function |

### Autocomplete Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

### Autocomplete Slots

| 名称 | 说明 |
|------|------|
| default | 自定义输入建议的内容，参数为 { item } |
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |
| prepend | 输入框前置内容 |
| append | 输入框后置内容 |

## 实践练习

### 练习1：搜索引擎建议

创建一个类似搜索引擎的自动补全功能：

```vue
<template>
  <div class="search-engine">
    <h3>搜索引擎</h3>
    <el-autocomplete
      v-model="searchQuery"
      :fetch-suggestions="getSearchSuggestions"
      placeholder="搜索任何内容..."
      :debounce="200"
      @select="handleSearch"
      @keyup.enter="handleSearch"
      class="search-input"
    >
      <template #default="{ item }">
        <div class="search-suggestion">
          <el-icon class="search-icon"><Search /></el-icon>
          <span class="suggestion-text">{{ item.value }}</span>
          <span class="suggestion-type">{{ item.type }}</span>
        </div>
      </template>
      
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')

const searchSuggestions = [
  { value: 'Vue.js 教程', type: '教程' },
  { value: 'React 开发指南', type: '指南' },
  { value: 'JavaScript 基础', type: '基础' },
  { value: 'TypeScript 进阶', type: '进阶' },
  { value: 'Node.js 实战', type: '实战' },
  { value: 'CSS 布局技巧', type: '技巧' },
  { value: 'HTML5 新特性', type: '特性' },
  { value: 'Webpack 配置', type: '配置' },
  { value: 'Git 版本控制', type: '工具' },
  { value: 'Docker 容器化', type: '容器' }
]

const getSearchSuggestions = (queryString, cb) => {
  if (!queryString) {
    cb(searchSuggestions.slice(0, 5))
    return
  }
  
  const results = searchSuggestions.filter(item => 
    item.value.toLowerCase().includes(queryString.toLowerCase())
  )
  
  cb(results)
}

const handleSearch = (item) => {
  const query = typeof item === 'string' ? item : item.value
  console.log('搜索：', query)
  // 这里可以跳转到搜索结果页面
}
</script>

<style scoped>
.search-engine {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
}

.search-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.search-icon {
  color: #909399;
}

.suggestion-text {
  flex: 1;
  color: #303133;
}

.suggestion-type {
  font-size: 12px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
```

### 练习2：邮箱地址补全

创建一个邮箱地址自动补全功能：

```vue
<template>
  <div class="email-autocomplete">
    <h3>邮箱地址补全</h3>
    <el-autocomplete
      v-model="email"
      :fetch-suggestions="getEmailSuggestions"
      placeholder="请输入邮箱地址"
      @select="handleEmailSelect"
    >
      <template #default="{ item }">
        <div class="email-suggestion">
          <el-icon class="email-icon"><Message /></el-icon>
          <span class="email-text">{{ item.value }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from '@element-plus/icons-vue'

const email = ref('')

const emailDomains = [
  '@gmail.com',
  '@qq.com',
  '@163.com',
  '@126.com',
  '@sina.com',
  '@hotmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@foxmail.com',
  '@sohu.com'
]

const getEmailSuggestions = (queryString, cb) => {
  if (!queryString || !queryString.includes('@')) {
    // 如果没有@符号，提供域名建议
    const suggestions = emailDomains.map(domain => ({
      value: queryString + domain
    }))
    cb(suggestions)
    return
  }
  
  const [localPart, domainPart] = queryString.split('@')
  if (!domainPart) {
    const suggestions = emailDomains.map(domain => ({
      value: localPart + domain
    }))
    cb(suggestions)
  } else {
    const matchingDomains = emailDomains.filter(domain => 
      domain.toLowerCase().includes('@' + domainPart.toLowerCase())
    )
    const suggestions = matchingDomains.map(domain => ({
      value: localPart + domain
    }))
    cb(suggestions)
  }
}

const handleEmailSelect = (item) => {
  console.log('选中的邮箱：', item.value)
}
</script>

<style scoped>
.email-autocomplete {
  max-width: 400px;
  padding: 20px;
}

.email-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.email-icon {
  color: #409eff;
}

.email-text {
  color: #303133;
}
</style>
```

## 常见问题

### 1. 防抖优化

**问题**：频繁的输入导致过多的搜索请求

**解决方案**：
```javascript
// 使用 debounce 属性
<el-autocomplete
  :debounce="600"
  :fetch-suggestions="querySearch"
/>

// 或者在 fetch-suggestions 方法中实现防抖
let timeout = null
const querySearch = (queryString, cb) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // 执行搜索逻辑
    const results = performSearch(queryString)
    cb(results)
  }, 300)
}
```

### 2. 远程搜索错误处理

**问题**：远程搜索失败时的处理

**解决方案**：
```javascript
const querySearchAsync = async (queryString, cb) => {
  try {
    const response = await fetch(`/api/search?q=${queryString}`)
    if (!response.ok) {
      throw new Error('搜索失败')
    }
    const data = await response.json()
    cb(data.results)
  } catch (error) {
    console.error('搜索错误：', error)
    cb([]) // 返回空数组
    ElMessage.error('搜索失败，请稍后重试')
  }
}
```

### 3. 大数据量优化

**问题**：建议列表数据量过大影响性能

**解决方案**：
```javascript
const querySearch = (queryString, cb) => {
  const results = queryString
    ? largeDataSet.filter(createFilter(queryString)).slice(0, 20) // 限制结果数量
    : largeDataSet.slice(0, 10)
  cb(results)
}
```

## 最佳实践

1. **合理设置防抖时间**：根据数据源类型调整防抖延时
2. **限制建议数量**：避免显示过多建议项影响用户体验
3. **提供清空功能**：让用户能够快速清空输入
4. **键盘导航支持**：确保组件支持键盘操作
5. **错误处理**：妥善处理远程搜索的错误情况
6. **加载状态**：为远程搜索提供加载指示

## 总结

Autocomplete 自动补全输入框是一个强大的输入辅助组件，支持：

- 本地和远程数据搜索
- 自定义建议项模板
- 防抖优化和性能控制
- 丰富的配置选项
- 良好的用户体验

掌握 Autocomplete 组件的使用，能够为用户提供更智能、更便捷的输入体验。

## 参考资料

- [Element Plus Autocomplete 官方文档](https://element-plus.org/zh-CN/component/autocomplete.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [JavaScript 防抖和节流](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)