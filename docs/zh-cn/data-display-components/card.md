# Card 卡片

## 概述

Card 卡片组件用于将信息聚合在卡片容器中展示。卡片包含标题、内容以及操作区域，提供了清晰的信息组织方式，适用于各种内容展示场景。<mcreference link="https://element-plus.org/zh-CN/component/card.html" index="0">0</mcreference>

## 学习目标

- 掌握 Card 组件的基础用法
- 学会使用不同的卡片样式和配置
- 理解卡片的结构组成（header、body、footer）
- 掌握卡片阴影效果的设置
- 了解 Card 组件的 API 和最佳实践

## 基础用法

### 基础卡片

Card 组件由 header、body 和 footer 组成。header 和 footer 是可选的，其内容取决于一个具名的 slot。<mcreference link="https://element-plus.org/zh-CN/component/card.html" index="0">0</mcreference>

```vue
<template>
  <div class="card-demo">
    <h3>基础卡片</h3>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>卡片名称</span>
          <el-button class="button" text>操作按钮</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
```

### 简单卡片

卡片可以只有内容区域。<mcreference link="https://element-plus.org/zh-CN/component/card.html" index="0">0</mcreference>

```vue
<template>
  <div class="simple-card-demo">
    <h3>简单卡片</h3>
    <el-card class="box-card">
      <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
```

## 有图片内容的卡片

可配置定义更丰富的内容展示。配置 `body-style` 属性来自定义 body 部分的样式。<mcreference link="https://element-plus.org/zh-CN/component/card.html" index="0">0</mcreference>

```vue
<template>
  <div class="image-card-demo">
    <h3>有图片内容的卡片</h3>
    <el-row :gutter="12">
      <el-col :span="8" v-for="(o, index) in 2" :key="o">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>好吃的汉堡</span>
            <div class="bottom">
              <time class="time">{{ currentDate }}</time>
              <el-button text class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentDate = ref(new Date().toLocaleDateString())
</script>

<style scoped>
.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}
</style>
```

## 带有阴影效果的卡片

你可以定义什么时候展示卡片的阴影效果。通过 `shadow` 属性设置卡片阴影出现的时机。该属性的值可以是：`always`、`hover` 或 `never`。<mcreference link="https://element-plus.org/zh-CN/component/card.html" index="0">0</mcreference>

```vue
<template>
  <div class="shadow-card-demo">
    <h3>带有阴影效果的卡片</h3>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="always">
          Always
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          Hover
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          Never
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
```

## 实际应用示例

### 用户信息卡片

```vue
<template>
  <div class="user-card-demo">
    <h3>用户信息卡片</h3>
    <el-row :gutter="20">
      <el-col :span="8" v-for="user in users" :key="user.id">
        <el-card class="user-card" shadow="hover">
          <template #header>
            <div class="user-header">
              <el-avatar :size="50" :src="user.avatar" />
              <div class="user-info">
                <h4>{{ user.name }}</h4>
                <p>{{ user.title }}</p>
              </div>
            </div>
          </template>
          
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ user.projects }}</span>
              <span class="stat-label">项目</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.followers }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.following }}</span>
              <span class="stat-label">关注</span>
            </div>
          </div>
          
          <template #footer>
            <div class="user-actions">
              <el-button type="primary" size="small">关注</el-button>
              <el-button size="small">消息</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    name: '张三',
    title: '前端开发工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    projects: 12,
    followers: 156,
    following: 89
  },
  {
    id: 2,
    name: '李四',
    title: '后端开发工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    projects: 8,
    followers: 203,
    following: 67
  },
  {
    id: 3,
    name: '王五',
    title: 'UI/UX 设计师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    projects: 15,
    followers: 298,
    following: 124
  }
])
</script>

<style scoped>
.user-card {
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.user-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
```

### 产品展示卡片

```vue
<template>
  <div class="product-card-demo">
    <h3>产品展示卡片</h3>
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in products" :key="product.id">
        <el-card class="product-card" shadow="hover" :body-style="{ padding: '0' }">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div class="product-badge" v-if="product.isNew">
              <el-tag type="danger" size="small">新品</el-tag>
            </div>
          </div>
          
          <div class="product-content">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-description">{{ product.description }}</p>
            
            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice">
                ¥{{ product.originalPrice }}
              </span>
            </div>
            
            <div class="product-rating">
              <el-rate v-model="product.rating" disabled show-score />
              <span class="sales">({{ product.sales }}人已购买)</span>
            </div>
            
            <div class="product-actions">
              <el-button type="primary" size="small" @click="addToCart(product)">
                加入购物车
              </el-button>
              <el-button size="small" @click="buyNow(product)">
                立即购买
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const products = ref([
  {
    id: 1,
    name: 'MacBook Pro',
    description: '强大的专业级笔记本电脑',
    price: 12999,
    originalPrice: 14999,
    rating: 4.8,
    sales: 1234,
    isNew: true,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: '创新科技，非凡体验',
    price: 8999,
    rating: 4.9,
    sales: 2567,
    isNew: false,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  }
])

const addToCart = (product) => {
  ElMessage.success(`${product.name} 已加入购物车`)
}

const buyNow = (product) => {
  ElMessage.info(`正在跳转到 ${product.name} 购买页面`)
}
</script>

<style scoped>
.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.product-content {
  padding: 16px;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.product-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.product-price {
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  margin-left: 8px;
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.sales {
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.product-actions .el-button {
  flex: 1;
}
</style>
```

## API 文档

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| header | 卡片的标题。你既可以通过设置 header 来修改标题，也可以通过 slot#header 传入 DOM 节点 | string | — |
| footer | 卡片页脚。你既可以通过设置 footer 来修改卡片底部内容，也可以通过 slot#footer 传入 DOM 节点 | string | — |
| body-style | body 的 CSS 样式 | object | — |
| header-class | card header 的自定义类名 | string | — |
| body-class | body 的自定义类名 | string | — |
| footer-class | footer 的自定义类名 | string | — |
| shadow | 卡片阴影显示时机 | enum: `always` / `hover` / `never` | always |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义默认内容 |
| header | 卡片标题内容 |
| footer | 卡片页脚内容 |

## 最佳实践

### 设计原则

1. **内容层次**：合理使用 header、body、footer 区分内容层次
2. **视觉一致性**：保持卡片间距、阴影、圆角等样式的一致性
3. **响应式设计**：确保卡片在不同屏幕尺寸下的良好显示

### 用户体验

1. **加载状态**：为卡片内容提供骨架屏或加载指示器
2. **交互反馈**：使用 hover 阴影效果提供视觉反馈
3. **操作便捷**：将主要操作放在易于点击的位置

### 性能优化

1. **图片优化**：使用适当尺寸的图片，考虑懒加载
2. **内容截断**：对长文本进行合理截断
3. **虚拟滚动**：处理大量卡片时考虑虚拟滚动

## 常见问题

### 1. 卡片高度不一致

**问题**：多个卡片并排显示时高度不一致

**解决方案**：
- 使用 CSS Grid 或 Flexbox 布局
- 设置固定高度或最小高度
- 使用 Element Plus 的 Row/Col 组件

### 2. 图片显示异常

**问题**：卡片中的图片变形或显示不完整

**解决方案**：
- 使用 `object-fit: cover` 保持图片比例
- 设置合适的容器尺寸
- 提供默认占位图

### 3. 移动端适配问题

**问题**：卡片在移动设备上显示效果不佳

**解决方案**：
- 使用响应式栅格系统
- 调整卡片间距和内边距
- 优化触摸交互体验

## 总结

Card 卡片组件是一个灵活且实用的容器组件，通过合理的结构设计和样式配置，可以创建出美观且功能丰富的卡片界面。在实际应用中，需要注意内容层次、视觉一致性和用户体验等方面的最佳实践。

## 参考资料

- [Element Plus Card 官方文档](https://element-plus.org/zh-CN/component/card.html)
- [CSS Flexbox 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)