# Carousel

## Overview

The Carousel component is used to display images, text, and other content of the same type in a limited space through cyclic playback. It is commonly used in scenarios such as image sliders, product showcases, and advertisement spaces, providing features like automatic playback, manual switching, and indicators.

## Learning Objectives

- Master the basic usage of the Carousel component
- Learn to configure automatic playback and transition effects
- Understand the use of indicators and switching arrows
- Master vertical direction and card-style carousels
- Understand the Carousel component's API and best practices

## Basic Usage

### Basic Carousel

A widely applicable basic usage. By combining the `el-carousel` and `el-carousel-item` tags, you get a carousel. The content of the slides can be anything and needs to be placed within the `el-carousel-item` tags. By default, hovering over the indicators at the bottom triggers switching. By setting the `trigger` property to `click`, you can achieve a click-triggered effect.

```vue
<template>
  <div class="carousel-demo">
    <h3>Basic Carousel</h3>
    <el-carousel height="150px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

### Indicators

You can set the display position of indicators outside the container. The `indicator-position` property defines the position of indicators. By default, they are displayed inside the carousel; setting it to `outside` will display them outside; setting it to `none` will not display indicators.

```vue
<template>
  <div class="indicator-demo">
    <h3>External Indicators</h3>
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="medium" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

### Switching Arrows

You can set when the switching arrows are displayed. The `arrow` property defines when the switching arrows are displayed. By default, the switching arrows are only displayed when the mouse hovers over the carousel; setting `arrow` to `always` will always display them; setting it to `never` will always hide them.

```vue
<template>
  <div class="arrow-demo">
    <h3>Switching Arrows</h3>
    <el-carousel :interval="4000" arrow="always">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="medium" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

## Card Style

When there is excess space in the width direction but limited space in the height direction, you can use the card style. Set `type` to `card` to enable card mode. From a performance perspective, when switching to card mode, only the cards on both sides will be rendered.

```vue
<template>
  <div class="card-demo">
    <h3>Card Style</h3>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3 class="medium" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

## Direction

By default, `direction` is set to `horizontal`. By setting `direction` to `vertical`, you can make the carousel display in the vertical direction.

```vue
<template>
  <div class="vertical-demo">
    <h3>Vertical Direction</h3>
    <el-carousel height="200px" direction="vertical" :autoplay="false">
      <el-carousel-item v-for="item in 3" :key="item">
        <h3 class="medium" justify="center">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
```

## Practical Application Examples

### Image Carousel

```vue
<template>
  <div class="image-carousel-demo">
    <h3>Image Carousel</h3>
    <el-carousel 
      :interval="5000" 
      arrow="always" 
      indicator-position="outside"
      height="300px"
    >
      <el-carousel-item v-for="(image, index) in images" :key="index">
        <div class="carousel-image">
          <img :src="image.url" :alt="image.title" />
          <div class="image-overlay">
            <h4>{{ image.title }}</h4>
            <p>{{ image.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const images = ref([
  {
    url: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    title: 'Delicious Hamburger',
    description: 'Freshly made, rich in flavor'
  },
  {
    url: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    title: 'Selected Ingredients',
    description: 'Quality ingredients, healthy and delicious'
  },
  {
    url: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    title: 'Special Combo',
    description: 'Paired with drinks, great value'
  }
])
</script>

<style scoped>
.carousel-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
}

.image-overlay h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.image-overlay p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}
</style>
```

### Product Showcase Carousel

```vue
<template>
  <div class="product-carousel-demo">
    <h3>Product Showcase Carousel</h3>
    <el-carousel 
      type="card" 
      height="250px" 
      :autoplay="false"
      @change="handleCarouselChange"
    >
      <el-carousel-item v-for="product in products" :key="product.id">
        <div class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="price">${{ product.price }}</p>
            <el-rate v-model="product.rating" disabled size="small" />
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    
    <div class="current-product" v-if="currentProduct">
      <h4>Currently Displaying: {{ currentProduct.name }}</h4>
      <p>{{ currentProduct.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'MacBook Pro',
    price: 1299,
    rating: 5,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    description: 'Powerful professional laptop, suitable for development and design work'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 999,
    rating: 5,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    description: 'The latest smartphone with excellent photography and performance'
  },
  {
    id: 3,
    name: 'iPad Air',
    price: 599,
    rating: 4,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    description: 'Lightweight and portable tablet, suitable for entertainment and light office work'
  },
  {
    id: 4,
    name: 'Apple Watch',
    price: 399,
    rating: 4,
    image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
    description: 'Smart watch with powerful health monitoring and fitness tracking features'
  }
])

const currentProduct = ref(null)

const handleCarouselChange = (index) => {
  currentProduct.value = products.value[index]
}

onMounted(() => {
  currentProduct.value = products.value[0]
})
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-image {
  height: 150px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.price {
  margin: 8px 0;
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.current-product {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.current-product h4 {
  margin: 0 0 8px 0;
  color: #409eff;
}

.current-product p {
  margin: 0;
  color: #666;
}
</style>
```

### News Announcement Carousel

```vue
<template>
  <div class="news-carousel-demo">
    <h3>News Announcement Carousel</h3>
    <el-carousel 
      direction="vertical" 
      height="120px" 
      :autoplay="true"
      :interval="3000"
      indicator-position="none"
      arrow="never"
    >
      <el-carousel-item v-for="news in newsList" :key="news.id">
        <div class="news-item" @click="handleNewsClick(news)">
          <div class="news-content">
            <h4>{{ news.title }}</h4>
            <p>{{ news.summary }}</p>
            <span class="news-date">{{ news.date }}</span>
          </div>
          <div class="news-type">
            <el-tag :type="news.type === 'important' ? 'danger' : 'info'" size="small">
              {{ news.type === 'important' ? 'Important' : 'Notice' }}
            </el-tag>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const newsList = ref([
  {
    id: 1,
    title: 'System Maintenance Notice',
    summary: 'The system will undergo maintenance upgrade tonight from 22:00 to 24:00',
    date: '2024-01-15',
    type: 'important'
  },
  {
    id: 2,
    title: 'New Feature Launch',
    summary: 'Data export feature is now available, supporting multiple formats',
    date: '2024-01-14',
    type: 'normal'
  },
  {
    id: 3,
    title: 'Security Reminder',
    summary: 'Please update your password regularly to ensure account security',
    date: '2024-01-13',
    type: 'important'
  },
  {
    id: 4,
    title: 'User Guide',
    summary: 'New user guide has been updated, welcome to check it out',
    date: '2024-01-12',
    type: 'normal'
  }
])

const handleNewsClick = (news) => {
  ElMessage.info(`Clicked on news: ${news.title}`)
}
</script>

<style scoped>
.news-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.news-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.news-content {
  flex: 1;
}

.news-content h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.news-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.news-date {
  font-size: 12px;
  color: #909399;
}

.news-type {
  margin-left: 16px;
}
</style>
```

## API Documentation

### Carousel Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| height | Height of the carousel | string | — |
| initial-index | Index of the initially active slide, starting from 0 | number | 0 |
| trigger | How indicators are triggered | enum: `hover` / `click` | hover |
| autoplay | Whether to automatically cycle the carousel | boolean | true |
| interval | Interval of the auto loop, in milliseconds | number | 3000 |
| indicator-position | Position of the indicators | enum: `none` / `outside` | — |
| arrow | When arrows are shown | enum: `always` / `hover` / `never` | hover |
| type | Type of the carousel | enum: `card` | — |
| loop | Whether the carousel should cycle continuously | boolean | true |
| direction | Direction in which the carousel is displayed | enum: `horizontal` / `vertical` | horizontal |
| pause-on-hover | Whether to pause automatic cycling on hover | boolean | true |

### Carousel Events

| Event Name | Description | Parameters |
|--------|------|----------|
| change | Triggered when the active slide changes | Index of the new active slide, index of the old active slide |

### Carousel Methods

| Method | Description | Parameters |
|--------|------|------|
| setActiveItem | Manually switch slide | Index of the slide to be switched to, starting from 0; or the `name` of the corresponding `el-carousel-item` |
| prev | Switch to the previous slide | — |
| next | Switch to the next slide | — |

### Carousel-Item Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| name | Name of the slide, can be used as a parameter for `setActiveItem` | string | — |
| label | Text content for the corresponding indicator | string | — |

## Best Practices

### Performance Optimization

1. **Image Lazy Loading**: For image carousels, use lazy loading to reduce initial loading time
2. **Reasonable Switching Interval**: Set appropriate auto-switching time based on content type
3. **Card Mode Optimization**: In card mode, only render necessary slides

### User Experience

1. **Pause Control**: Pause auto-play when mouse hovers
2. **Indicator Design**: Provide clear indication of current position
3. **Touch Support**: Support swipe gestures on mobile devices

### Accessibility

1. **Keyboard Navigation**: Support keyboard arrow keys for switching
2. **Screen Reader**: Provide alt attributes for images
3. **Focus Management**: Properly manage focus states

### Responsive Design

1. **Breakpoint Adaptation**: Adjust display method at different screen sizes
2. **Touch-Friendly**: Optimize touch experience on mobile devices
3. **Content Adaptation**: Ensure content displays properly on various devices

## Common Issues

### 1. Auto-play Not Working

**Issue**: Carousel doesn't automatically switch

**Solution**:
- Check if the `autoplay` property is set to `true`
- Confirm that the `interval` time is set reasonably
- Check if there are JavaScript errors preventing execution

### 2. Image Display Issues

**Issue**: Images appear distorted or incomplete in the carousel

**Solution**:
- Use `object-fit: cover` to maintain image ratio
- Set appropriate container height
- Ensure images are of appropriate size

### 3. Indicator Position Issues

**Issue**: Indicators don't display as expected

**Solution**:
- Check the `indicator-position` property setting
- Adjust the container's CSS styles
- Ensure there's enough space to display indicators

### 4. Card Mode Display Issues

**Issue**: Poor display effect in card mode

**Solution**:
- Ensure container width is sufficient
- Adjust card content styles
- Check for CSS conflicts

## Summary

The Carousel component is a feature-rich slider component that supports various display modes and interaction methods. By properly configuring properties and styles, you can create carousel effects suitable for different scenarios. In practical applications, attention should be paid to performance optimization, user experience, and accessibility best practices.

## References

- [Element Plus Carousel Official Documentation](https://element-plus.org/en-US/component/carousel.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)