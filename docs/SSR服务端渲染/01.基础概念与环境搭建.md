# Element Plus SSR 基础概念与环境搭建

## 学习目标

* 理解 SSR（服务端渲染）的基本概念和优势
* 掌握 Element Plus 在 SSR 环境下的配置方法
* 学会搭建支持 Element Plus 的 SSR 开发环境
* 了解 SSR 与 CSR 的区别和适用场景

## 知识点概览

### 1. SSR 基础概念

#### 1.1 什么是 SSR

**服务端渲染（Server-Side Rendering，SSR）** 是指在服务器端将 Vue 组件渲染为 HTML 字符串，然后将其发送到浏览器，最后在客户端进行"激活"的过程。

```typescript
// SSR 渲染流程示意
// 1. 服务器接收请求
// 2. 服务器执行 Vue 应用
// 3. 将组件渲染为 HTML 字符串
// 4. 发送完整的 HTML 到客户端
// 5. 客户端激活（hydration）

// 传统 CSR 流程
// 1. 服务器发送空白 HTML + JS 包
// 2. 客户端下载并执行 JS
// 3. 客户端渲染页面内容
```

#### 1.2 SSR 的优势

1. **更好的 SEO**：搜索引擎可以直接抓取到完整的 HTML 内容
2. **更快的首屏加载**：用户可以更快看到页面内容
3. **更好的性能指标**：FCP（First Contentful Paint）和 LCP（Largest Contentful Paint）更优
4. **更好的社交媒体分享**：Open Graph 和 Twitter Cards 可以正确显示

#### 1.3 SSR 的挑战

1. **开发复杂度增加**：需要考虑服务端和客户端的差异
2. **服务器负载增加**：每个请求都需要服务器渲染
3. **部署复杂度**：需要 Node.js 服务器环境
4. **调试困难**：需要同时调试服务端和客户端代码

### 2. Element Plus SSR 支持

#### 2.1 Element Plus SSR 兼容性

Element Plus 从设计之初就考虑了 SSR 的兼容性：

```typescript
// Element Plus SSR 特性
// ✅ 支持服务端渲染
// ✅ 支持客户端激活
// ✅ 支持按需导入
// ✅ 支持主题定制
// ✅ 支持国际化
// ⚠️ 需要特殊配置的功能：
//   - 客户端特定的 API（如 window、document）
//   - 异步组件加载
//   - 动态主题切换
```

#### 2.2 SSR 环境下的注意事项

```typescript
// 1. 避免在服务端使用浏览器特定的 API
if (typeof window !== 'undefined') {
  // 客户端特定代码
  window.localStorage.setItem('theme', 'dark')
}

// 2. 使用 onMounted 确保代码只在客户端执行
import { onMounted } from 'vue'

onMounted(() => {
  // 这里的代码只在客户端执行
  console.log('客户端激活完成')
})

// 3. 条件性渲染客户端组件
const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})
```

### 3. Vite + Vue 3 + Element Plus SSR 环境搭建

#### 3.1 项目初始化

```bash
# 创建新项目
npm create vue@latest element-plus-ssr
cd element-plus-ssr

# 安装依赖
npm install

# 安装 Element Plus
npm install element-plus

# 安装 SSR 相关依赖
npm install express compression serve-static
npm install -D @types/express @types/compression
```

#### 3.2 项目结构设计

```
element-plus-ssr/
├── src/
│   ├── components/          # 组件目录
│   ├── views/              # 页面组件
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── styles/             # 样式文件
│   ├── entry-client.ts     # 客户端入口
│   ├── entry-server.ts     # 服务端入口
│   ├── main.ts             # 通用应用创建
│   └── App.vue             # 根组件
├── server.js               # 开发服务器
├── prerender.js            # 预渲染脚本
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
└── package.json
```

#### 3.3 应用入口配置

```typescript
// src/main.ts - 通用应用创建函数
import { createSSRApp } from 'vue'
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { routes } from './router'

export function createApp() {
  const app = createSSRApp(App)
  
  // 创建路由器
  const router = createRouter({
    history: import.meta.env.SSR 
      ? createMemoryHistory() 
      : createWebHistory(),
    routes
  })
  
  // 创建状态管理
  const pinia = createPinia()
  
  // 安装插件
  app.use(router)
  app.use(pinia)
  app.use(ElementPlus)
  
  return { app, router, pinia }
}
```

```typescript
// src/entry-client.ts - 客户端入口
import { createApp } from './main'

const { app, router } = createApp()

// 等待路由器准备就绪
router.isReady().then(() => {
  // 激活应用
  app.mount('#app')
})
```

```typescript
// src/entry-server.ts - 服务端入口
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(url: string) {
  const { app, router } = createApp()
  
  // 设置服务端路由位置
  await router.push(url)
  await router.isReady()
  
  // 渲染应用为字符串
  const html = await renderToString(app)
  
  return html
}
```

#### 3.4 Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // SSR 配置
  ssr: {
    // 需要外部化的依赖
    external: ['element-plus']
  },
  
  // 构建配置
  build: {
    rollupOptions: {
      input: {
        client: resolve(__dirname, 'src/entry-client.ts'),
        server: resolve(__dirname, 'src/entry-server.ts')
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  
  // 开发服务器配置
  server: {
    middlewareMode: true
  }
})
```

#### 3.5 开发服务器配置

```javascript
// server.js - 开发服务器
import fs from 'fs'
import path from 'path'
import express from 'express'
import compression from 'compression'
import { createServer as createViteServer } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 3000

async function createServer() {
  const app = express()
  
  // 添加 gzip 压缩
  app.use(compression())
  
  let vite
  if (!isProduction) {
    // 开发模式：创建 Vite 服务器
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })
    app.use(vite.ssrLoadModule)
  } else {
    // 生产模式：使用构建后的文件
    app.use('/assets', express.static(path.resolve('dist/client/assets')))
  }
  
  // 处理所有路由
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    
    try {
      let template
      let render
      
      if (!isProduction) {
        // 开发模式：读取模板并转换
        template = fs.readFileSync(
          path.resolve('index.html'),
          'utf-8'
        )
        template = await vite.transformIndexHtml(url, template)
        
        // 加载服务端入口
        render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
      } else {
        // 生产模式：使用构建后的文件
        template = fs.readFileSync(
          path.resolve('dist/client/index.html'),
          'utf-8'
        )
        render = (await import('./dist/server/entry-server.js')).render
      }
      
      // 渲染应用
      const appHtml = await render(url)
      
      // 注入渲染后的应用 HTML
      const html = template.replace('<!--ssr-outlet-->', appHtml)
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 错误处理
      if (!isProduction) {
        vite.ssrFixStacktrace(e)
      }
      console.error(e)
      res.status(500).end(e.message)
    }
  })
  
  return { app, vite }
}

createServer().then(({ app }) => {
  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`)
  })
})
```

#### 3.6 HTML 模板

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Element Plus SSR</title>
  <meta name="description" content="Element Plus SSR 示例应用">
</head>
<body>
  <div id="app"><!--ssr-outlet--></div>
  <script type="module" src="/src/entry-client.ts"></script>
</body>
</html>
```

### 4. Element Plus 组件 SSR 示例

#### 4.1 基础组件使用

```vue
<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用 Element Plus SSR</span>
          <el-button type="primary" @click="handleClick">
            点击测试
          </el-button>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="form" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        
        <el-col :span="12">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="age" label="年龄" width="80" />
            <el-table-column prop="address" label="地址" />
          </el-table>
        </el-col>
      </el-row>
      
      <!-- 客户端特定组件 -->
      <div v-if="isClient" class="client-only">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 表单数据
const form = reactive({
  username: '',
  email: ''
})

// 表格数据
const tableData = ref([
  { name: '张三', age: 25, address: '北京市朝阳区' },
  { name: '李四', age: 30, address: '上海市浦东新区' },
  { name: '王五', age: 28, address: '广州市天河区' }
])

// 客户端状态
const isClient = ref(false)
const selectedDate = ref('')

// 客户端激活后设置状态
onMounted(() => {
  isClient.value = true
})

const handleClick = () => {
  if (typeof window !== 'undefined') {
    ElMessage.success('按钮点击成功！')
  }
}

const submitForm = () => {
  console.log('提交表单:', form)
  if (typeof window !== 'undefined') {
    ElMessage.success('表单提交成功！')
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-only {
  margin-top: 20px;
  padding: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
</style>
```

#### 4.2 路由配置

```typescript
// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      description: 'Element Plus SSR 首页示例'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      description: '关于 Element Plus SSR'
    }
  },
  {
    path: '/components',
    name: 'Components',
    component: () => import('../views/Components.vue'),
    meta: {
      title: '组件展示',
      description: 'Element Plus 组件展示页面'
    }
  }
]
```

### 5. 构建和部署

#### 5.1 构建脚本

```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.ts --outDir dist/server",
    "preview": "cross-env NODE_ENV=production node server.js",
    "serve": "node server.js"
  }
}
```

#### 5.2 生产环境优化

```javascript
// 生产环境服务器优化
if (isProduction) {
  // 启用静态文件缓存
  app.use('/assets', express.static(
    path.resolve('dist/client/assets'),
    { maxAge: '1y' }
  ))
  
  // 启用 HTML 缓存（可选）
  const htmlCache = new Map()
  
  app.use('*', async (req, res, next) => {
    const url = req.originalUrl
    
    // 检查缓存
    if (htmlCache.has(url)) {
      return res.status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(htmlCache.get(url))
    }
    
    // 渲染并缓存
    try {
      const html = await renderPage(url)
      htmlCache.set(url, html)
      res.status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(html)
    } catch (error) {
      next(error)
    }
  })
}
```

## 6. 实践练习

1. **搭建基础 SSR 环境**：
   - 按照教程搭建完整的 SSR 开发环境
   - 确保开发和生产模式都能正常运行

2. **Element Plus 组件测试**：
   - 测试各种 Element Plus 组件在 SSR 环境下的表现
   - 识别和解决客户端特定功能的问题

3. **性能优化**：
   - 实现页面缓存机制
   - 优化首屏加载时间
   - 测量和比较 SSR 与 CSR 的性能差异

## 7. 学习资源

- [Vue.js SSR 指南](https://cn.vuejs.org/guide/scaling-up/ssr.html)
- [Vite SSR 文档](https://cn.vitejs.dev/guide/ssr.html)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
- [Web Vitals 性能指标](https://web.dev/vitals/)

## 8. 作业

- 完成 Element Plus SSR 环境的搭建
- 创建一个包含多个页面的 SSR 应用
- 实现基本的 SEO 优化（meta 标签、结构化数据）
- 对比测试 SSR 和 CSR 的首屏加载性能

## 总结

通过第52天的学习，我们掌握了：

1. **SSR 基础概念**：理解了服务端渲染的原理和优势
2. **环境搭建**：学会了搭建支持 Element Plus 的 SSR 开发环境
3. **配置优化**：掌握了 Vite 和 Express 的 SSR 配置方法
4. **组件适配**：了解了 Element Plus 组件在 SSR 环境下的注意事项

这些知识为我们后续深入学习 SSR 框架（如 Nuxt.js）和生产环境部署奠定了坚实的基础。