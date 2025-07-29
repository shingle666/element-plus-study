# Space 间距

## 学习目标
- 掌握 Space 间距组件的基础用法
- 理解不同方向的间距布局
- 学会控制间距大小和自动换行
- 掌握分隔符的使用方法
- 完成复杂布局中的间距应用

## 详细学习内容

### 1. 基础用法（10分钟）

Space 组件用于设置一组元素之间的间距，避免手动设置边距。

```vue
<template>
  <el-space>
    <el-button>按钮1</el-button>
    <el-button>按钮2</el-button>
    <el-button>按钮3</el-button>
  </el-space>
</template>
```

### 2. 垂直布局（10分钟）

通过 `direction` 属性控制间距方向。

```vue
<template>
  <el-space direction="vertical">
    <el-card class="box-card" style="width: 480px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" type="text">Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        List item {{ o }}
      </div>
    </el-card>
    <el-card class="box-card" style="width: 480px">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
          <el-button class="button" type="text">Operation button</el-button>
        </div>
      </template>
      <div v-for="o in 2" :key="o" class="text item">
        List item {{ o }}
      </div>
    </el-card>
  </el-space>
</template>
```

### 3. 控制间距大小（10分钟）

使用 `size` 属性控制间距大小，支持数字、字符串和数组。

```vue
<template>
  <div>
    <el-slider v-model="size" :min="0" :max="20" />
    <el-space :size="size">
      <el-card class="box-card" style="width: 200px">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div class="text item">List item</div>
      </el-card>
      <el-card class="box-card" style="width: 200px">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div class="text item">List item</div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const size = ref(8)
</script>
```

### 4. 自动换行（10分钟）

使用 `wrap` 属性实现自动换行功能。

```vue
<template>
  <el-space wrap>
    <el-card class="box-card" style="width: 250px" v-for="i in 3" :key="i">
      <template #header>
        <div class="card-header">
          <span>Card name</span>
        </div>
      </template>
      <div class="text item">List item</div>
    </el-card>
  </el-space>
</template>
```

### 5. 分隔符（15分钟）

#### 5.1 字符串分隔符

```vue
<template>
  <el-space :size="20" spacer="|">
    <div>item1</div>
    <div>item2</div>
    <div>item3</div>
  </el-space>
</template>
```

#### 5.2 组件分隔符

```vue
<template>
  <el-space>
    <template #spacer>
      <el-divider direction="vertical" />
    </template>
    <div>item1</div>
    <div>item2</div>
    <div>item3</div>
  </el-space>
</template>
```

### 6. 高级间距应用（20分钟）

#### 6.1 不同尺寸的间距

```vue
<template>
  <div class="space-demo">
    <h3>小间距</h3>
    <el-space size="small">
      <el-button>按钮1</el-button>
      <el-button>按钮2</el-button>
      <el-button>按钮3</el-button>
    </el-space>
    
    <h3>中等间距</h3>
    <el-space size="default">
      <el-button>按钮1</el-button>
      <el-button>按钮2</el-button>
      <el-button>按钮3</el-button>
    </el-space>
    
    <h3>大间距</h3>
    <el-space size="large">
      <el-button>按钮1</el-button>
      <el-button>按钮2</el-button>
      <el-button>按钮3</el-button>
    </el-space>
    
    <h3>自定义间距</h3>
    <el-space :size="30">
      <el-button>按钮1</el-button>
      <el-button>按钮2</el-button>
      <el-button>按钮3</el-button>
    </el-space>
  </div>
</template>

<style>
.space-demo h3 {
  margin: 20px 0 10px 0;
  color: #409eff;
}
</style>
```

#### 6.2 响应式间距

```vue
<template>
  <div class="responsive-space">
    <el-space 
      :size="screenSize"
      wrap
    >
      <el-card 
        v-for="i in 6" 
        :key="i" 
        class="space-card"
        shadow="hover"
      >
        <div class="card-content">
          <h4>卡片 {{ i }}</h4>
          <p>这是卡片内容</p>
        </div>
      </el-card>
    </el-space>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const screenSize = ref(16)

const updateSpacing = () => {
  const width = window.innerWidth
  if (width < 768) {
    screenSize.value = 8
  } else if (width < 1024) {
    screenSize.value = 12
  } else {
    screenSize.value = 16
  }
}

onMounted(() => {
  updateSpacing()
  window.addEventListener('resize', updateSpacing)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSpacing)
})
</script>

<style>
.responsive-space {
  padding: 20px;
}

.space-card {
  width: 200px;
  height: 150px;
}

.card-content {
  text-align: center;
}

.card-content h4 {
  margin: 0 0 10px 0;
  color: #409eff;
}

.card-content p {
  margin: 0;
  color: #666;
}
</style>
```

### 7. 综合应用示例（25分钟）

#### 7.1 工具栏布局

```vue
<template>
  <div class="toolbar-demo">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工具栏示例</span>
        </div>
      </template>
      
      <!-- 主要操作区 -->
      <el-space class="main-actions" size="large">
        <el-space>
          <el-button type="primary" :icon="Plus">新建</el-button>
          <el-button :icon="Edit">编辑</el-button>
          <el-button :icon="Delete" type="danger">删除</el-button>
        </el-space>
        
        <el-divider direction="vertical" />
        
        <el-space>
          <el-button :icon="Download">导出</el-button>
          <el-button :icon="Upload">导入</el-button>
        </el-space>
        
        <el-divider direction="vertical" />
        
        <el-space>
          <el-input 
            v-model="searchText" 
            placeholder="搜索..." 
            :prefix-icon="Search"
            style="width: 200px"
          />
          <el-button type="primary">搜索</el-button>
        </el-space>
      </el-space>
      
      <!-- 次要操作区 -->
      <el-space class="secondary-actions" size="small">
        <el-space>
          <span>显示：</span>
          <el-switch v-model="showImages" active-text="图片" />
          <el-switch v-model="showDetails" active-text="详情" />
        </el-space>
        
        <el-space>
          <span>排序：</span>
          <el-select v-model="sortBy" style="width: 120px">
            <el-option label="名称" value="name" />
            <el-option label="时间" value="time" />
            <el-option label="大小" value="size" />
          </el-select>
        </el-space>
      </el-space>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Edit, Delete, Download, Upload, Search } from '@element-plus/icons-vue'

const searchText = ref('')
const showImages = ref(true)
const showDetails = ref(false)
const sortBy = ref('name')
</script>

<style>
.toolbar-demo {
  padding: 20px;
}

.main-actions {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.secondary-actions {
  color: #666;
}
</style>
```

#### 7.2 表单按钮组

```vue
<template>
  <div class="form-demo">
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" />
      </el-form-item>
      
      <!-- 按钮组 -->
      <el-form-item>
        <el-space>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
          <el-button type="info" @click="onCancel">取消</el-button>
        </el-space>
      </el-form-item>
      
      <!-- 额外操作 -->
      <el-form-item>
        <el-space size="small">
          <el-button type="text" @click="onSaveDraft">保存草稿</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" @click="onPreview">预览</el-button>
          <el-divider direction="vertical" />
          <el-button type="text" @click="onHelp">帮助</el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  username: '',
  email: '',
  description: ''
})

const onSubmit = () => {
  ElMessage.success('提交成功')
}

const onReset = () => {
  Object.assign(form, {
    username: '',
    email: '',
    description: ''
  })
  ElMessage.info('表单已重置')
}

const onCancel = () => {
  ElMessage.info('操作已取消')
}

const onSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const onPreview = () => {
  ElMessage.info('预览功能')
}

const onHelp = () => {
  ElMessage.info('帮助信息')
}
</script>

<style>
.form-demo {
  padding: 20px;
  max-width: 600px;
}
</style>
```

## 实践练习

### 练习1：基础间距布局
创建一个包含不同间距大小的按钮组合。

### 练习2：垂直卡片列表
使用垂直间距创建一个卡片列表布局。

### 练习3：工具栏设计
设计一个包含多种操作的工具栏，合理使用间距和分隔符。

### 练习4：响应式间距
创建一个响应式的间距布局，在不同屏幕尺寸下调整间距大小。

## 设计原则

1. **一致性**：在整个应用中保持间距的一致性
2. **层次感**：使用不同的间距大小创建视觉层次
3. **呼吸感**：适当的间距让界面更加舒适
4. **功能分组**：使用间距和分隔符对功能进行分组

## 学习资源

- [Space 间距官方文档](https://element-plus.org/zh-CN/component/space.html)
- [CSS 间距设计指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model)
- [界面设计中的间距原则](https://material.io/design/layout/spacing-methods.html)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)

## 作业

1. **基础作业**：创建一个包含多种间距效果的展示页面
2. **进阶作业**：实现一个复杂的工具栏布局，包含多级操作分组
3. **挑战作业**：设计一个响应式的卡片网格，使用 Space 组件控制间距

## 总结

Space 间距组件是创建清晰、有序界面布局的重要工具。通过合理使用间距，可以提高界面的可读性和用户体验。掌握不同的间距控制方法，能够帮助我们创建更加专业和美观的界面设计。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**