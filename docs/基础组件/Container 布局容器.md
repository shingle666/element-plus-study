# Container 布局容器

## 学习目标
- 掌握 el-container 基础用法
- 理解布局容器的组合使用
- 学会创建常见的页面布局模式
- 完成基础页面布局实践

## 详细学习内容

### 1. Container 布局容器基础（30分钟）

#### 1.1 基础概念
Container 布局容器是 Element Plus 提供的用于快速搭建页面基本结构的容器组件。它包含以下几个子组件：
- `el-container`：外层容器
- `el-header`：顶栏容器
- `el-aside`：侧边栏容器
- `el-main`：主要区域容器
- `el-footer`：底栏容器

#### 1.2 基础用法

```vue
<template>
  <!-- 基础布局 -->
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
  </el-container>

  <!-- 带侧边栏的布局 -->
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

  <!-- 完整布局 -->
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
    <el-footer>Footer</el-footer>
  </el-container>
</template>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
```

#### 1.3 常见布局模式

##### 上中下布局
```vue
<template>
  <el-container direction="vertical">
    <el-header height="60px">顶部导航</el-header>
    <el-main>主要内容区域</el-main>
    <el-footer height="60px">底部信息</el-footer>
  </el-container>
</template>
```

##### 左右布局
```vue
<template>
  <el-container>
    <el-aside width="200px">侧边栏</el-aside>
    <el-main>主要内容</el-main>
  </el-container>
</template>
```

##### 上左右下布局（经典后台布局）
```vue
<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="logo">管理系统</div>
      <div class="user-info">用户信息</div>
    </el-header>
    <el-container>
      <el-aside class="layout-aside" width="200px">
        <el-menu default-active="1" class="el-menu-vertical">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">用户管理</el-menu-item>
          <el-menu-item index="3">系统设置</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="layout-main">
        <div class="content-wrapper">
          主要内容区域
        </div>
      </el-main>
    </el-container>
    <el-footer class="layout-footer">
      © 2024 管理系统. All rights reserved.
    </el-footer>
  </el-container>
</template>

<style>
.layout-container {
  height: 100vh;
}

.layout-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.layout-aside {
  background-color: #304156;
}

.layout-main {
  background-color: #f0f2f5;
  padding: 20px;
}

.layout-footer {
  background-color: #f5f5f5;
  text-align: center;
  color: #666;
}

.content-wrapper {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
```

#### 1.4 布局容器的嵌套使用

```vue
<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
```

### 2. 实际应用示例

#### 2.1 响应式侧边栏
```vue
<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <el-button 
        @click="toggleAside" 
        :icon="isCollapse ? 'Expand' : 'Fold'"
        circle
      />
      <span class="title">管理后台</span>
    </el-header>
    <el-container>
      <el-aside 
        class="app-aside" 
        :width="isCollapse ? '64px' : '200px'"
      >
        <el-menu 
          :collapse="isCollapse"
          :collapse-transition="false"
          class="sidebar-menu"
        >
          <el-menu-item index="1">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><User /></el-icon>
            <span>用户</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="app-main">
        <div class="content">
          主要内容区域
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { House, User } from '@element-plus/icons-vue'

const isCollapse = ref(false)

const toggleAside = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style>
.app-container {
  height: 100vh;
}

.app-header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
}

.app-aside {
  background-color: #304156;
  transition: width 0.3s;
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

.app-main {
  background-color: #f0f2f5;
  padding: 20px;
}

.content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  min-height: calc(100vh - 140px);
}
</style>
```

## 实践练习

### 练习1：基础布局
创建一个包含头部、侧边栏、主内容区和底部的基础布局。

### 练习2：可收缩侧边栏
实现一个可以通过按钮控制收缩/展开的侧边栏布局。

### 练习3：多级嵌套布局
创建一个复杂的嵌套布局，包含多个容器的组合使用。

## 设计原则

1. **语义化**：使用合适的容器组件表达页面结构
2. **一致性**：保持布局的一致性和规范性
3. **响应式**：考虑不同屏幕尺寸的适配
4. **可维护性**：结构清晰，易于维护和扩展

## 学习资源

- [Container 布局容器官方文档](https://element-plus.org/zh-CN/component/container.html)
- [CSS Flexbox 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)

## 作业

1. **基础作业**：创建一个包含所有容器组件的完整布局
2. **进阶作业**：实现一个带有动画效果的可收缩侧边栏
3. **挑战作业**：设计一个适配移动端的响应式布局

## 总结

Container 布局容器是构建现代 Web 应用界面的基础，通过合理使用这些组件，可以快速搭建出结构清晰、功能完善的页面布局。掌握这些基础组件的使用方法，为后续的复杂界面开发打下坚实基础。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**