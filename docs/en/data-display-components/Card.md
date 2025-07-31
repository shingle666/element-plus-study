# Card Component

## Overview

The Card component is used to aggregate information and display it in a card container. Cards contain titles, content, and action areas, providing a clear way to organize information and are suitable for various content display scenarios.

## Learning Objectives

- Master the basic usage of the Card component
- Learn to use different card styles and configurations
- Understand the structural composition of cards (header, body, footer)
- Master the setting of card shadow effects
- Understand the API and best practices of the Card component

## Basic Usage

### Basic Card

The Card component consists of header, body, and footer. The header and footer are optional, and their content depends on a named slot.

```vue
<template>
  <div class="card-demo">
    <h3>Basic Card</h3>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Card Name</span>
          <el-button class="button" text>Action Button</el-button>
        </div>
      </template>
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
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

### Simple Card

Cards can have only a content area.

```vue
<template>
  <div class="simple-card-demo">
    <h3>Simple Card</h3>
    <el-card class="box-card">
      <div v-for="o in 4" :key="o" class="text item">
        {{ 'List item ' + o }}
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

## Card with Image Content

You can configure richer content display. Configure the `body-style` attribute to customize the style of the body part.

```vue
<template>
  <div class="image-card-demo">
    <h3>Card with Image Content</h3>
    <el-row :gutter="12">
      <el-col :span="8" v-for="(o, index) in 2" :key="o">
        <el-card :body-style="{ padding: '0px' }">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px">
            <span>Delicious Hamburger</span>
            <div class="bottom">
              <time class="time">{{ currentDate }}</time>
              <el-button text class="button">Action Button</el-button>
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

## Card with Shadow Effects

You can define when to show the shadow effect of the card. Set when the card shadow appears through the `shadow` attribute. The value of this attribute can be: `always`, `hover`, or `never`.

```vue
<template>
  <div class="shadow-card-demo">
    <h3>Card with Shadow Effects</h3>
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

## Practical Application Examples

### User Information Card

```vue
<template>
  <div class="user-card-demo">
    <h3>User Information Card</h3>
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
              <span class="stat-label">Projects</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.followers }}</span>
              <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ user.following }}</span>
              <span class="stat-label">Following</span>
            </div>
          </div>
          
          <template #footer>
            <div class="user-actions">
              <el-button type="primary" size="small">Follow</el-button>
              <el-button size="small">Message</el-button>
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
    name: 'John Doe',
    title: 'Frontend Developer',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    projects: 12,
    followers: 156,
    following: 89
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Backend Developer',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    projects: 8,
    followers: 203,
    following: 67
  },
  {
    id: 3,
    name: 'Mike Johnson',
    title: 'UI/UX Designer',
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

### Product Display Card

```vue
<template>
  <div class="product-card-demo">
    <h3>Product Display Card</h3>
    <el-row :gutter="20">
      <el-col :span="6" v-for="product in products" :key="product.id">
        <el-card class="product-card" shadow="hover" :body-style="{ padding: '0' }">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
            <div class="product-badge" v-if="product.isNew">
              <el-tag type="danger" size="small">New</el-tag>
            </div>
          </div>
          
          <div class="product-content">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-description">{{ product.description }}</p>
            
            <div class="product-price">
              <span class="current-price">${{ product.price }}</span>
              <span class="original-price" v-if="product.originalPrice">
                ${{ product.originalPrice }}
              </span>
            </div>
            
            <div class="product-rating">
              <el-rate v-model="product.rating" disabled show-score />
              <span class="sales">({{ product.sales }} sold)</span>
            </div>
            
            <div class="product-actions">
              <el-button type="primary" size="small" @click="addToCart(product)">
                Add to Cart
              </el-button>
              <el-button size="small" @click="buyNow(product)">
                Buy Now
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
    description: 'Powerful professional laptop',
    price: 1999,
    originalPrice: 2299,
    rating: 4.8,
    sales: 1234,
    isNew: true,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: 'Innovation and extraordinary experience',
    price: 1299,
    rating: 4.9,
    sales: 2567,
    isNew: false,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
  }
])

const addToCart = (product) => {
  ElMessage.success(`${product.name} added to cart`)
}

const buyNow = (product) => {
  ElMessage.info(`Redirecting to ${product.name} purchase page`)
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

## API Reference

### Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| header | Card title. You can modify the title by setting header, or pass in DOM nodes through slot#header | string | — |
| footer | Card footer. You can modify the card bottom content by setting footer, or pass in DOM nodes through slot#footer | string | — |
| body-style | CSS style of body | object | — |
| header-class | Custom class name of card header | string | — |
| body-class | Custom class name of body | string | — |
| footer-class | Custom class name of footer | string | — |
| shadow | When to show card shadow | enum: `always` / `hover` / `never` | always |

### Slots

| Slot Name | Description |
|-----------|-------------|
| default | Custom default content |
| header | Card title content |
| footer | Card footer content |

## Best Practices

### Design Principles

1. **Content Hierarchy**: Properly use header, body, footer to distinguish content hierarchy
2. **Visual Consistency**: Maintain consistency in card spacing, shadows, rounded corners, and other styles
3. **Responsive Design**: Ensure good display of cards on different screen sizes

### User Experience

1. **Loading States**: Provide skeleton screens or loading indicators for card content
2. **Interactive Feedback**: Use hover shadow effects to provide visual feedback
3. **Convenient Operations**: Place main actions in easily clickable positions

### Performance Optimization

1. **Image Optimization**: Use appropriately sized images, consider lazy loading
2. **Content Truncation**: Properly truncate long text
3. **Virtual Scrolling**: Consider virtual scrolling when handling large numbers of cards

## Common Issues

### 1. Inconsistent Card Heights

**Problem**: Cards have inconsistent heights when displayed side by side

**Solution**:
- Use CSS Grid or Flexbox layout
- Set fixed height or minimum height
- Use Element Plus Row/Col components

### 2. Image Display Issues

**Problem**: Images in cards are distorted or display incompletely

**Solution**:
- Use `object-fit: cover` to maintain image proportions
- Set appropriate container dimensions
- Provide default placeholder images

### 3. Mobile Adaptation Issues

**Problem**: Cards don't display well on mobile devices

**Solution**:
- Use responsive grid system
- Adjust card spacing and padding
- Optimize touch interaction experience

## Summary

The Card component is a flexible and practical container component. Through proper structural design and style configuration, you can create beautiful and feature-rich card interfaces. In practical applications, attention should be paid to best practices in content hierarchy, visual consistency, and user experience.

## References

- [Element Plus Card Official Documentation](https://element-plus.org/en-US/component/card.html)
- [CSS Flexbox Layout Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)