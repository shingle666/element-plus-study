# Layout 布局

## 学习目标
- 掌握 24 栅格系统的使用
- 理解响应式断点设计
- 完成响应式布局实现

## 详细学习内容

### 1. Layout 栅格系统

#### 1.1 基础概念
Element Plus 的栅格系统基于 24 分栏，通过 `el-row` 和 `el-col` 组件来创建灵活的布局。

#### 1.2 基础用法

```vue
<template>
  <!-- 基础栅格 -->
  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
```

#### 1.3 分栏间隔

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

#### 1.4 混合布局

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

#### 1.5 列偏移

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

#### 1.6 对齐方式

```vue
<template>
  <el-row class="row-bg">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="end">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-between">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-around">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-evenly">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

#### 1.7 响应式布局

```vue
<template>
  <el-row :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
      <div class="grid-content bg-purple"></div>
    </el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple"></div>
    </el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
  </el-row>
</template>
```

#### 1.8 基于断点的隐藏类

```vue
<template>
  <el-row>
    <el-col :span="6" :xs="{ span: 5, offset: 1 }" :sm="{ span: 6, offset: 2 }">
      <div class="grid-content bg-purple"></div>
    </el-col>
    <el-col :span="6" :xs="{ span: 11, offset: 1 }" :sm="{ span: 6, offset: 2 }">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
    <el-col :span="6" :xs="{ span: 5, offset: 1 }" :sm="{ span: 6, offset: 2 }">
      <div class="grid-content bg-purple"></div>
    </el-col>
  </el-row>
</template>
```

### 2. 实际应用示例

#### 2.1 响应式卡片布局

```vue
<template>
  <div class="card-container">
    <el-row :gutter="20">
      <el-col 
        v-for="(item, index) in cardList" 
        :key="index"
        :xs="24" 
        :sm="12" 
        :md="8" 
        :lg="6" 
        :xl="4"
      >
        <el-card class="card-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ item.title }}</span>
              <el-button class="button" type="text">更多</el-button>
            </div>
          </template>
          <div class="card-content">
            <p>{{ item.description }}</p>
            <div class="card-footer">
              <el-tag>{{ item.tag }}</el-tag>
              <span class="date">{{ item.date }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
const cardList = [
  { title: '卡片1', description: '这是卡片1的描述内容', tag: '标签1', date: '2024-01-01' },
  { title: '卡片2', description: '这是卡片2的描述内容', tag: '标签2', date: '2024-01-02' },
  { title: '卡片3', description: '这是卡片3的描述内容', tag: '标签3', date: '2024-01-03' },
  { title: '卡片4', description: '这是卡片4的描述内容', tag: '标签4', date: '2024-01-04' },
  { title: '卡片5', description: '这是卡片5的描述内容', tag: '标签5', date: '2024-01-05' },
  { title: '卡片6', description: '这是卡片6的描述内容', tag: '标签6', date: '2024-01-06' },
]
</script>

<style>
.card-container {
  padding: 20px;
}

.card-item {
  margin-bottom: 20px;
  height: 200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  color: #999;
  font-size: 12px;
}
</style>
```

#### 2.2 表单布局

```vue
<template>
  <el-form :model="form" label-width="120px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="年龄">
          <el-input v-model="form.age" />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="24">
        <el-form-item label="地址">
          <el-input v-model="form.address" type="textarea" />
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button>重置</el-button>
          <el-button type="info">取消</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  age: '',
  email: '',
  phone: '',
  address: ''
})
</script>
```

## 实践练习

### 练习1：基础栅格布局
使用 24 栅格系统创建不同比例的布局组合。

### 练习2：响应式卡片网格
创建一个响应式的卡片网格，在不同屏幕尺寸下显示不同的列数。

### 练习3：复杂表单布局
使用栅格系统创建一个复杂的表单布局。

### 练习4：仪表板布局
创建一个仪表板布局，包含统计卡片、图表区域和数据表格。

## 设计原则

1. **一致性**：保持间距和对齐的一致性
2. **响应式**：适配不同屏幕尺寸
3. **可读性**：合理的间距提高内容可读性
4. **灵活性**：使用栅格系统创建灵活的布局

## 学习资源

- [Layout 布局官方文档](https://element-plus.org/zh-CN/component/layout.html)
- [CSS Grid 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
- [响应式设计原则](https://web.dev/responsive-web-design-basics/)
- [Flexbox 布局完全指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## 作业

1. **基础作业**：创建一个包含多种栅格布局的展示页面
2. **进阶作业**：实现一个响应式的产品展示网格
3. **挑战作业**：设计一个复杂的仪表板布局，包含多种组件和响应式适配

## 总结

Layout 布局系统是现代 Web 开发的基础，通过掌握栅格系统的使用，可以创建出结构清晰、适配性强的界面布局。合理运用这些布局工具，能够大大提高开发效率和用户体验。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**