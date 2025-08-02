# Input Tag 标签输入框

## 概述

Input Tag 组件允许用户添加内容作为标签，是一个功能强大的标签输入组件。用户可以通过键盘输入来添加标签，支持自定义触发器、拖拽排序、数量限制等多种功能。

## 学习目标

- 掌握 Input Tag 的基本概念和使用场景
- 学会基础标签输入和管理
- 了解自定义触发器的配置方法
- 掌握标签数量限制和状态控制
- 学会标签的拖拽排序功能
- 了解分隔符和自定义样式的使用
- 掌握 API 的完整使用方法

## 基础用法

### 基本标签输入

按 Enter 回车键添加输入内容为标签：

```vue
<template>
  <div>
    <el-input-tag
      v-model="tags"
      placeholder="请输入标签，按回车添加"
    />
    <p>当前标签: {{ tags }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tags = ref(['Vue', 'Element Plus'])
</script>
```

### 自定义触发器

您可以自定义用于触发输入标签的键位，默认是 Enter 回车键：

```vue
<template>
  <div>
    <h4>Enter 键触发</h4>
    <el-input-tag
      v-model="enterTags"
      :trigger="['Enter']"
      placeholder="按 Enter 添加标签"
    />
    
    <h4>空格键触发</h4>
    <el-input-tag
      v-model="spaceTags"
      :trigger="['Space']"
      placeholder="按空格添加标签"
    />
    
    <h4>多键触发</h4>
    <el-input-tag
      v-model="multiTags"
      :trigger="['Enter', 'Space']"
      placeholder="按 Enter 或空格添加标签"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enterTags = ref([])
const spaceTags = ref([])
const multiTags = ref([])
</script>
```

## 功能配置

### 最大标签数

您可以设置可以添加的标签数量限制：

```vue
<template>
  <div>
    <el-input-tag
      v-model="limitedTags"
      :max="3"
      placeholder="最多添加3个标签"
    />
    <p>已添加 {{ limitedTags.length }}/3 个标签</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const limitedTags = ref(['tag1', 'tag2'])
</script>
```

### 禁用状态

您可以设置 Input Tag 被禁用：

```vue
<template>
  <div>
    <el-input-tag
      v-model="disabledTags"
      disabled
      placeholder="禁用状态"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const disabledTags = ref(['tag1', 'tag2', 'tag3'])
</script>
```

### 可清空

您可以设置是否显示清除按钮：

```vue
<template>
  <div>
    <el-input-tag
      v-model="clearableTags"
      clearable
      placeholder="可清空的标签输入框"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clearableTags = ref(['tag1', 'tag2', 'tag3'])
</script>
```

### 可拖放

您可以设置是否可以拖动标签：

```vue
<template>
  <div>
    <el-input-tag
      v-model="draggableTags"
      draggable
      placeholder="可拖拽排序的标签"
    />
    <p>拖拽标签可以改变顺序</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const draggableTags = ref(['tag1', 'tag2', 'tag3'])
</script>
```

## 高级功能

### 分隔符

当一个分隔符匹配时，您可以添加一个标签：

```vue
<template>
  <div>
    <h4>逗号分隔符</h4>
    <el-input-tag
      v-model="commaTags"
      delimiter=","
      placeholder="输入逗号自动添加标签"
    />
    
    <h4>正则表达式分隔符</h4>
    <el-input-tag
      v-model="regexTags"
      :delimiter="/[,;]/"
      placeholder="输入逗号或分号自动添加标签"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const commaTags = ref([])
const regexTags = ref([])
</script>
```

### 尺寸

使用 size 属性改变输入框大小：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-input-tag
      v-model="largeTags"
      size="large"
      placeholder="大尺寸标签输入框"
    />
    
    <h4>默认尺寸</h4>
    <el-input-tag
      v-model="defaultTags"
      size="default"
      placeholder="默认尺寸标签输入框"
    />
    
    <h4>小尺寸</h4>
    <el-input-tag
      v-model="smallTags"
      size="small"
      placeholder="小尺寸标签输入框"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const largeTags = ref(['large'])
const defaultTags = ref(['default'])
const smallTags = ref(['small'])
</script>
```

### 自定义标签

您可以通过 tag 插槽自定义标签内容：

```vue
<template>
  <div>
    <el-input-tag
      v-model="customTags"
      placeholder="自定义标签样式"
    >
      <template #tag="{ tag, index }">
        <el-tag
          :type="getTagType(index)"
          :effect="getTagEffect(index)"
          closable
          @close="removeTag(index)"
        >
          {{ tag }}
        </el-tag>
      </template>
    </el-input-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const customTags = ref(['primary', 'success', 'info', 'warning', 'danger'])

const tagTypes = ['primary', 'success', 'info', 'warning', 'danger']
const tagEffects = ['light', 'dark', 'plain']

const getTagType = (index) => {
  return tagTypes[index % tagTypes.length]
}

const getTagEffect = (index) => {
  return tagEffects[index % tagEffects.length]
}

const removeTag = (index) => {
  customTags.value.splice(index, 1)
}
</script>
```

### 自定义前缀和后缀

您可以通过 prefix 和 suffix 插槽自定义 Input Tag 的前缀和后缀：

```vue
<template>
  <div>
    <el-input-tag
      v-model="prefixSuffixTags"
      placeholder="带前缀和后缀的标签输入框"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #suffix>
        <el-icon><Star /></el-icon>
      </template>
    </el-input-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Star } from '@element-plus/icons-vue'

const prefixSuffixTags = ref(['Vue', 'React'])
</script>
```

## 事件处理

### 标签变化事件

```vue
<template>
  <div>
    <el-input-tag
      v-model="eventTags"
      placeholder="监听事件的标签输入框"
      @change="handleChange"
      @add-tag="handleAddTag"
      @remove-tag="handleRemoveTag"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
    />
    
    <div style="margin-top: 20px;">
      <h4>事件日志：</h4>
      <ul>
        <li v-for="(log, index) in eventLogs" :key="index">
          {{ log }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const eventTags = ref(['初始标签'])
const eventLogs = ref([])

const addLog = (message) => {
  eventLogs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const handleChange = (value) => {
  addLog(`标签变化: ${JSON.stringify(value)}`)
}

const handleAddTag = (tag) => {
  addLog(`添加标签: ${tag}`)
}

const handleRemoveTag = (tag) => {
  addLog(`移除标签: ${tag}`)
}

const handleFocus = () => {
  addLog('输入框获得焦点')
}

const handleBlur = () => {
  addLog('输入框失去焦点')
}

const handleClear = () => {
  addLog('清空所有标签')
}
</script>
```

## 实际应用示例

### 技能标签管理器

```vue
<template>
  <div class="skill-manager">
    <h3>技能标签管理器</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="前端技能">
        <el-input-tag
          v-model="form.frontendSkills"
          :max="10"
          placeholder="添加前端技能标签"
          clearable
          draggable
        >
          <template #tag="{ tag, index }">
            <el-tag
              type="primary"
              effect="light"
              closable
              @close="removeFrontendSkill(index)"
            >
              <el-icon style="margin-right: 4px;"><Star /></el-icon>
              {{ tag }}
            </el-tag>
          </template>
        </el-input-tag>
      </el-form-item>
      
      <el-form-item label="后端技能">
        <el-input-tag
          v-model="form.backendSkills"
          :max="10"
          placeholder="添加后端技能标签"
          clearable
          draggable
        >
          <template #tag="{ tag, index }">
            <el-tag
              type="success"
              effect="light"
              closable
              @close="removeBackendSkill(index)"
            >
              <el-icon style="margin-right: 4px;"><Tools /></el-icon>
              {{ tag }}
            </el-tag>
          </template>
        </el-input-tag>
      </el-form-item>
      
      <el-form-item label="兴趣爱好">
        <el-input-tag
          v-model="form.hobbies"
          delimiter=","
          placeholder="输入兴趣爱好，用逗号分隔"
          clearable
        >
          <template #tag="{ tag, index }">
            <el-tag
              type="info"
              effect="plain"
              closable
              @close="removeHobby(index)"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-input-tag>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="saveProfile">
          保存资料
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="savedProfile" class="profile-preview">
      <h4>保存的资料：</h4>
      <pre>{{ JSON.stringify(savedProfile, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, Tools } from '@element-plus/icons-vue'

const form = reactive({
  frontendSkills: ['Vue', 'React', 'JavaScript'],
  backendSkills: ['Node.js', 'Python'],
  hobbies: ['阅读', '旅行']
})

const savedProfile = ref(null)

const removeFrontendSkill = (index) => {
  form.frontendSkills.splice(index, 1)
}

const removeBackendSkill = (index) => {
  form.backendSkills.splice(index, 1)
}

const removeHobby = (index) => {
  form.hobbies.splice(index, 1)
}

const saveProfile = () => {
  savedProfile.value = { ...form }
  ElMessage.success('资料保存成功！')
}

const resetForm = () => {
  form.frontendSkills = []
  form.backendSkills = []
  form.hobbies = []
  savedProfile.value = null
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.skill-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.profile-preview pre {
  margin: 0;
  font-size: 12px;
}
</style>
```

### 搜索关键词管理

```vue
<template>
  <div class="search-manager">
    <h3>搜索关键词管理</h3>
    
    <el-card>
      <template #header>
        <span>热门搜索词</span>
      </template>
      
      <el-input-tag
        v-model="hotKeywords"
        :max="8"
        placeholder="添加热门搜索关键词"
        clearable
        draggable
        @add-tag="handleAddHotKeyword"
        @remove-tag="handleRemoveHotKeyword"
      >
        <template #tag="{ tag, index }">
          <el-tag
            :type="getHotTagType(index)"
            effect="dark"
            closable
            @close="removeHotKeyword(index)"
          >
            <el-icon style="margin-right: 4px;"><TrendCharts /></el-icon>
            {{ tag }}
          </el-tag>
        </template>
      </el-input-tag>
    </el-card>
    
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>搜索历史</span>
      </template>
      
      <el-input-tag
        v-model="searchHistory"
        :max="20"
        placeholder="搜索历史记录"
        readonly
        clearable
      >
        <template #tag="{ tag, index }">
          <el-tag
            type="info"
            effect="plain"
            closable
            @close="removeSearchHistory(index)"
          >
            <el-icon style="margin-right: 4px;"><Clock /></el-icon>
            {{ tag }}
          </el-tag>
        </template>
      </el-input-tag>
    </el-card>
    
    <div class="actions" style="margin-top: 20px;">
      <el-button @click="addRandomKeyword">
        添加随机关键词
      </el-button>
      <el-button @click="clearHistory" type="danger">
        清空历史
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { TrendCharts, Clock } from '@element-plus/icons-vue'

const hotKeywords = ref(['Vue3', 'Element Plus', 'TypeScript', 'Vite'])
const searchHistory = ref(['前端开发', '组件库', '响应式设计', 'JavaScript'])

const randomKeywords = [
  'React', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Webpack', 'Rollup', 'ESLint', 'Prettier', 'Jest'
]

const hotTagTypes = ['', 'success', 'warning', 'danger']

const getHotTagType = (index) => {
  return hotTagTypes[index % hotTagTypes.length]
}

const handleAddHotKeyword = (keyword) => {
  ElMessage.success(`添加热门关键词: ${keyword}`)
}

const handleRemoveHotKeyword = (keyword) => {
  ElMessage.info(`移除热门关键词: ${keyword}`)
}

const removeHotKeyword = (index) => {
  hotKeywords.value.splice(index, 1)
}

const removeSearchHistory = (index) => {
  searchHistory.value.splice(index, 1)
}

const addRandomKeyword = () => {
  const randomKeyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)]
  if (!hotKeywords.value.includes(randomKeyword)) {
    hotKeywords.value.push(randomKeyword)
    ElMessage.success(`添加关键词: ${randomKeyword}`)
  } else {
    ElMessage.warning('关键词已存在')
  }
}

const clearHistory = () => {
  searchHistory.value = []
  ElMessage.success('搜索历史已清空')
}
</script>

<style scoped>
.search-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.actions {
  text-align: center;
}
</style>
```

## API 文档

### Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | array | — |
| max | 可添加标签的最大数量 | number | — |
| tag-type | 标签类型 | enum | info |
| tag-effect | 标签效果 | enum | light |
| trigger | 触发输入标签的按键 | enum | Enter |
| draggable | 是否可以拖动标签 | boolean | false |
| delimiter | 在匹配分隔符时添加标签 | string / regex | — |
| size | 输入框尺寸 | enum | — |
| save-on-blur | 当输入失去焦点时是否保存输入值 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| validate-event | 是否触发表单验证 | boolean | true |
| readonly | 等价于原生 readonly 属性 | boolean | false |
| autofocus | 等价于原生 autofocus 属性 | boolean | false |
| id | 等价于原生 input id 属性 | string | — |
| tabindex | 等价于原生 tabindex 属性 | string / number | — |
| maxlength | 等价于原生 maxlength 属性 | string / number | — |
| minlength | 等价于原生 minlength 属性 | string / number | — |
| placeholder | 输入框占位文本 | string | — |
| autocomplete | 等价于原生 autocomplete 属性 | string | off |
| aria-label | 等价于原生 aria-label 属性 | string | — |

### Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 绑定值变化时触发的事件 | Function |
| input | 在 Input 值改变时触发 | Function |
| add-tag | tag 被添加时触发 | Function |
| remove-tag | tag 被移除时触发 | Function |
| focus | 在 Input 获得焦点时触发 | Function |
| blur | 在 Input 失去焦点时触发 | Function |
| clear | 点击清除图标时触发 | Function |

### Slots

| 名称 | 说明 | 类型 |
|------|------|------|
| tag | 作为 tag 的内容 | object |
| prefix | InputTag 头部内容 | — |
| suffix | InputTag 尾部内容 | — |

### Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

## 实践练习

### 练习1：标签分类管理器

创建一个支持多种分类的标签管理器：

```vue
<template>
  <div class="tag-category-manager">
    <h3>标签分类管理器</h3>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane
        v-for="category in categories"
        :key="category.key"
        :label="category.label"
        :name="category.key"
      >
        <el-input-tag
          v-model="category.tags"
          :placeholder="`添加${category.label}标签`"
          :max="category.max"
          clearable
          draggable
        >
          <template #tag="{ tag, index }">
            <el-tag
              :type="category.tagType"
              :effect="category.tagEffect"
              closable
              @close="removeTag(category.key, index)"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-input-tag>
      </el-tab-pane>
    </el-tabs>
    
    <div class="summary">
      <h4>标签统计：</h4>
      <ul>
        <li v-for="category in categories" :key="category.key">
          {{ category.label }}: {{ category.tags.length }} 个标签
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('tech')

const categories = reactive([
  {
    key: 'tech',
    label: '技术',
    tags: ['Vue', 'React', 'JavaScript'],
    max: 15,
    tagType: 'primary',
    tagEffect: 'light'
  },
  {
    key: 'hobby',
    label: '爱好',
    tags: ['阅读', '旅行', '摄影'],
    max: 10,
    tagType: 'success',
    tagEffect: 'light'
  },
  {
    key: 'work',
    label: '工作',
    tags: ['项目管理', '团队协作'],
    max: 8,
    tagType: 'warning',
    tagEffect: 'light'
  }
])

const removeTag = (categoryKey, index) => {
  const category = categories.find(c => c.key === categoryKey)
  if (category) {
    category.tags.splice(index, 1)
  }
}
</script>

<style scoped>
.tag-category-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.summary {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
```

### 练习2：智能标签推荐

创建一个带有智能推荐功能的标签输入器：

```vue
<template>
  <div class="smart-tag-input">
    <h3>智能标签推荐</h3>
    
    <el-input-tag
      v-model="selectedTags"
      placeholder="输入标签，系统会智能推荐"
      @input="handleInput"
    />
    
    <div v-if="recommendations.length" class="recommendations">
      <h4>推荐标签：</h4>
      <div class="tag-list">
        <el-tag
          v-for="tag in recommendations"
          :key="tag"
          class="recommendation-tag"
          @click="addRecommendation(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
    
    <div class="selected-tags">
      <h4>已选标签：</h4>
      <div v-if="selectedTags.length">
        <el-tag
          v-for="(tag, index) in selectedTags"
          :key="index"
          type="primary"
          closable
          @close="removeSelectedTag(index)"
        >
          {{ tag }}
        </el-tag>
      </div>
      <p v-else class="empty-text">暂无选中标签</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedTags = ref([])
const inputValue = ref('')

// 模拟标签数据库
const tagDatabase = [
  'Vue', 'React', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Express', 'Koa', 'Nest.js', 'Python',
  'Django', 'Flask', 'Java', 'Spring', 'MySQL',
  'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS',
  '前端开发', '后端开发', '全栈开发', '移动开发', '数据库',
  '云计算', '人工智能', '机器学习', '深度学习', '区块链'
]

const recommendations = computed(() => {
  if (!inputValue.value) return []
  
  return tagDatabase
    .filter(tag => 
      tag.toLowerCase().includes(inputValue.value.toLowerCase()) &&
      !selectedTags.value.includes(tag)
    )
    .slice(0, 6)
})

const handleInput = (value) => {
  inputValue.value = value
}

const addRecommendation = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
    inputValue.value = ''
  }
}

const removeSelectedTag = (index) => {
  selectedTags.value.splice(index, 1)
}
</script>

<style scoped>
.smart-tag-input {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.recommendations {
  margin-top: 15px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommendation-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.recommendation-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selected-tags {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.empty-text {
  color: #909399;
  font-style: italic;
}
</style>
```

## 常见问题

### 1. 标签重复添加

**问题**：用户可能会添加重复的标签

**解决方案**：
```vue
<script setup>
const handleAddTag = (tag) => {
  if (tags.value.includes(tag)) {
    ElMessage.warning('标签已存在')
    return false
  }
  return true
}
</script>
```

### 2. 标签长度限制

**问题**：需要限制单个标签的长度

**解决方案**：
```vue
<script setup>
const validateTag = (tag) => {
  if (tag.length > 20) {
    ElMessage.error('标签长度不能超过20个字符')
    return false
  }
  return true
}
</script>
```

### 3. 标签格式验证

**问题**：需要验证标签的格式（如不允许特殊字符）

**解决方案**：
```vue
<script setup>
const validateTagFormat = (tag) => {
  const regex = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  if (!regex.test(tag)) {
    ElMessage.error('标签只能包含字母、数字和中文')
    return false
  }
  return true
}
</script>
```

## 最佳实践

1. **用户体验优化**：提供清晰的操作提示和反馈
2. **数据验证**：对标签内容进行合理的验证和限制
3. **性能考虑**：大量标签时考虑虚拟滚动或分页
4. **可访问性**：确保键盘导航和屏幕阅读器支持
5. **样式一致性**：保持标签样式与整体设计的一致性

## 总结

Input Tag 标签输入框是一个功能丰富的组件，支持：

- 灵活的标签输入和管理
- 自定义触发器和分隔符
- 拖拽排序和数量限制
- 丰富的自定义选项和事件
- 良好的用户交互体验

掌握 Input Tag 组件的使用，能够帮助你构建更加友好和高效的标签管理界面。

## 参考资料

- [Element Plus Input Tag 官方文档](https://element-plus.org/zh-CN/component/input-tag.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Element Plus 图标库](https://element-plus.org/zh-CN/component/icon.html)