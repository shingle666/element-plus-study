# Rate Component

## Overview

The Rate component is used for ratings, supporting half-star selection and auxiliary text prompts. It's an intuitive evaluation component commonly used in scenarios such as product reviews and user feedback.

## Learning Objectives

- Master the basic concepts and use cases of Rate
- Learn how to use basic rating functionality
- Understand rating state control and event handling
- Master different styles and sizes of ratings
- Learn to customize rating icons and colors
- Understand half-star ratings and auxiliary text
- Master the complete usage of the API

## Basic Usage

### Basic Rating

The simplest rating usage:

```vue
<template>
  <div>
    <el-rate v-model="value1" />
    <p>Rating: {{ value1 }}</p>
    
    <el-rate v-model="value2" :max="10" />
    <p>Rating (out of 10): {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(7)
</script>
```

### Disabled State

Use the `disabled` attribute to disable rating:

```vue
<template>
  <div>
    <el-rate v-model="value1" disabled />
    <p>Disabled rating: {{ value1 }}</p>
    
    <el-rate v-model="value2" disabled show-text />
    <p>Disabled rating with text: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3.5)
const value2 = ref(4)
</script>
```

### Read-only State

Use the `readonly` attribute to set read-only state:

```vue
<template>
  <div>
    <el-rate v-model="value1" readonly />
    <p>Read-only rating: {{ value1 }}</p>
    
    <el-rate v-model="value2" readonly show-score />
    <p>Read-only rating with score: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4.5)
const value2 = ref(3.7)
</script>
```

## Auxiliary Text

### Display Text

Use the `show-text` attribute to display auxiliary text:

```vue
<template>
  <div>
    <el-rate
      v-model="value1"
      show-text
    />
    <p>Current rating: {{ value1 }}</p>
    
    <el-rate
      v-model="value2"
      :texts="customTexts"
      show-text
    />
    <p>Custom text rating: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(2)

const customTexts = [
  'Terrible',
  'Disappointing', 
  'Average',
  'Satisfactory',
  'Excellent'
]
</script>
```

### Display Score

Use the `show-score` attribute to display the current score:

```vue
<template>
  <div>
    <el-rate
      v-model="value1"
      show-score
    />
    <p>Display score: {{ value1 }}</p>
    
    <el-rate
      v-model="value2"
      show-score
      score-template="{value} points"
    />
    <p>Custom score template: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4.5)
const value2 = ref(3.2)
</script>
```

## Half-Star Rating

Use the `allow-half` attribute to support half-star ratings:

```vue
<template>
  <div>
    <h4>Full-star rating</h4>
    <el-rate v-model="value1" />
    <p>Rating: {{ value1 }}</p>
    
    <h4>Half-star rating</h4>
    <el-rate v-model="value2" allow-half />
    <p>Rating: {{ value2 }}</p>
    
    <h4>Half-star rating + Display score</h4>
    <el-rate v-model="value3" allow-half show-score />
    <p>Rating: {{ value3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(3.5)
const value3 = ref(4.2)
</script>
```

## Custom Icons

### Using Icons

Use the `icons` attribute to customize icons for different levels:

```vue
<template>
  <div>
    <h4>Custom icons</h4>
    <el-rate
      v-model="value1"
      :icons="customIcons"
      :void-icon="ChatDotRound"
      :colors="customColors"
    />
    <p>Rating: {{ value1 }}</p>
    
    <h4>Emoji rating</h4>
    <el-rate
      v-model="value2"
      :icons="faceIcons"
      :void-icon="ChatDotRound"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
    />
    <p>Rating: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChatDotRound,
  Star,
  StarFilled,
  Sunny,
  Moon
} from '@element-plus/icons-vue'

const value1 = ref(3)
const value2 = ref(2)

const customIcons = [Star, Star, StarFilled]
const customColors = ['#99A9BF', '#F7BA2A', '#FF9900']

const faceIcons = [Sunny, Sunny, Moon]
</script>
```

### Custom Colors

Use the `colors` attribute to customize colors for different levels:

```vue
<template>
  <div>
    <h4>Custom colors</h4>
    <el-rate
      v-model="value1"
      :colors="customColors"
    />
    <p>Rating: {{ value1 }}</p>
    
    <h4>Gradient color rating</h4>
    <el-rate
      v-model="value2"
      :colors="gradientColors"
      allow-half
    />
    <p>Rating: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4)
const value2 = ref(3.5)

const customColors = {
  2: '#99A9BF',
  4: '#F7BA2A', 
  5: '#FF9900'
}

const gradientColors = [
  '#ff4d4f',
  '#ff7a45', 
  '#ffa940',
  '#ffec3d',
  '#52c41a'
]
</script>
```

## Sizes

Use the `size` attribute to set the size of the rating:

```vue
<template>
  <div>
    <h4>Large size</h4>
    <el-rate v-model="value1" size="large" />
    
    <h4>Default size</h4>
    <el-rate v-model="value2" />
    
    <h4>Small size</h4>
    <el-rate v-model="value3" size="small" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4)
const value2 = ref(4)
const value3 = ref(4)
</script>
```

## Practical Application Examples

### Product Review Component

```vue
<template>
  <div class="product-review">
    <h3>Product Review</h3>
    
    <div class="review-form">
      <div class="review-item">
        <label>Product Quality:</label>
        <el-rate
          v-model="review.quality"
          :texts="qualityTexts"
          show-text
          @change="handleRateChange('quality', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>Shipping Speed:</label>
        <el-rate
          v-model="review.delivery"
          :texts="deliveryTexts"
          show-text
          @change="handleRateChange('delivery', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>Customer Service:</label>
        <el-rate
          v-model="review.service"
          :texts="serviceTexts"
          show-text
          @change="handleRateChange('service', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>Overall Rating:</label>
        <el-rate
          v-model="review.overall"
          allow-half
          show-score
          readonly
          :colors="['#ff4d4f', '#ffa940', '#52c41a']"
        />
      </div>
      
      <div class="review-actions">
        <el-button type="primary" @click="submitReview">Submit Review</el-button>
        <el-button @click="resetReview">Reset</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const review = reactive({
  quality: 0,
  delivery: 0,
  service: 0,
  overall: 0
})

const qualityTexts = ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
const deliveryTexts = ['Very Slow', 'Slow', 'Average', 'Fast', 'Very Fast']
const serviceTexts = ['Poor', 'Fair', 'Average', 'Good', 'Excellent']

const handleRateChange = (type, value) => {
  // Calculate overall rating
  const total = review.quality + review.delivery + review.service
  const count = [review.quality, review.delivery, review.service].filter(v => v > 0).length
  review.overall = count > 0 ? Number((total / count).toFixed(1)) : 0
  
  ElMessage.success(`${type} rating updated: ${value} stars`)
}

const submitReview = () => {
  if (review.quality === 0 || review.delivery === 0 || review.service === 0) {
    ElMessage.warning('Please complete all rating items')
    return
  }
  
  ElMessage.success('Review submitted successfully!')
  console.log('Review data:', review)
}

const resetReview = () => {
  review.quality = 0
  review.delivery = 0
  review.service = 0
  review.overall = 0
  ElMessage.info('Ratings have been reset')
}
</script>

<style scoped>
.product-review {
  max-width: 500px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.review-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.review-item label {
  width: 120px;
  margin-right: 12px;
  font-weight: 500;
}

.review-actions {
  margin-top: 20px;
  text-align: center;
}

.review-actions .el-button {
  margin: 0 8px;
}
</style>
```

### User Feedback Rating

```vue
<template>
  <div class="feedback-rating">
    <h3>User Experience Feedback</h3>
    
    <div class="feedback-list">
      <div v-for="item in feedbackItems" :key="item.id" class="feedback-item">
        <div class="feedback-info">
          <h4>{{ item.title }}</h4>
          <p>{{ item.description }}</p>
        </div>
        <div class="feedback-rating-control">
          <el-rate
            v-model="item.rating"
            :icons="item.icons"
            :colors="item.colors"
            :allow-half="item.allowHalf"
            :show-text="item.showText"
            :texts="item.texts"
            @change="handleFeedbackChange(item)"
          />
        </div>
      </div>
    </div>
    
    <div class="feedback-summary">
      <h4>Overall Satisfaction</h4>
      <el-rate
        v-model="overallSatisfaction"
        :max="10"
        allow-half
        show-score
        score-template="{value}/10 points"
        readonly
        :colors="['#ff4d4f', '#ffa940', '#52c41a']"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, Sunny } from '@element-plus/icons-vue'

const feedbackItems = reactive([
  {
    id: 1,
    title: 'Interface Design',
    description: 'Are you satisfied with our interface design?',
    rating: 0,
    icons: [Star, Star, StarFilled],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    allowHalf: true,
    showText: true,
    texts: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
  },
  {
    id: 2,
    title: 'Feature Completeness',
    description: 'Do our features meet your needs?',
    rating: 0,
    icons: [Star, Star, StarFilled],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    allowHalf: true,
    showText: true,
    texts: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
  },
  {
    id: 3,
    title: 'User Experience',
    description: 'How is the overall user experience?',
    rating: 0,
    icons: [Sunny, Sunny, Sunny],
    colors: ['#ff4d4f', '#ffa940', '#52c41a'],
    allowHalf: false,
    showText: true,
    texts: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
  }
])

const overallSatisfaction = computed(() => {
  const total = feedbackItems.reduce((sum, item) => sum + item.rating, 0)
  const count = feedbackItems.filter(item => item.rating > 0).length
  return count > 0 ? Number(((total / count) * 2).toFixed(1)) : 0
})

const handleFeedbackChange = (item) => {
  ElMessage.success(`${item.title} rating updated: ${item.rating} stars`)
}
</script>

<style scoped>
.feedback-rating {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.feedback-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.feedback-item:last-child {
  border-bottom: none;
}

.feedback-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #303133;
}

.feedback-info p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.feedback-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e4e7ed;
  text-align: center;
}

.feedback-summary h4 {
  margin-bottom: 12px;
  color: #303133;
}
</style>
```

## API Documentation

### Rate Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | number | 0 |
| max | maximum score | number | 5 |
| disabled | whether Rate is disabled | boolean | false |
| readonly | whether Rate is read-only | boolean | false |
| allow-half | whether picking half start is allowed | boolean | false |
| low-threshold | threshold value between low and medium level. The value itself will be included in low level | number | 2 |
| high-threshold | threshold value between medium and high level. The value itself will be included in high level | number | 4 |
| colors | colors for icons. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding color | object / array | ['#F7BA2A', '#F7BA2A', '#F7BA2A'] |
| void-color | color of unselected icons | string | #C6D1DE |
| disabled-void-color | color of unselected read-only icons | string | #EFF2F7 |
| icons | icon components. If array, it should have 3 elements, each of which corresponds with a score level, else if object, the key should be threshold value between two levels, and the value should be corresponding icon component | object / array | [StarFilled, StarFilled, StarFilled] |
| void-icon | component of unselected icons | string / Component | Star |
| disabled-void-icon | component of unselected read-only icons | string / Component | StarFilled |
| show-text | whether to display texts | boolean | false |
| show-score | whether to display current score. show-score and show-text cannot be true at the same time | boolean | false |
| text-color | color of texts | string | #1F2D3D |
| texts | text array | array | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
| score-template | score template | string | {value} |
| size | size of Rate | enum | — |
| label | screen reader label | string | — |
| id | native id attribute | string | — |

### Rate Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the value changes | Function |

### Rate Exposes

| Name | Description | Type |
|------|-------------|------|
| setCurrentValue | set current value | Function |
| resetCurrentValue | reset current value | Function |

## Practice Exercises

### Exercise 1: Multi-dimensional Rating System

Create a multi-dimensional rating system:

```vue
<template>
  <div class="multi-dimension-rating">
    <h3>Course Evaluation</h3>
    <div v-for="dimension in dimensions" :key="dimension.key" class="dimension-item">
      <label>{{ dimension.label }}:</label>
      <el-rate
        v-model="dimension.value"
        :allow-half="dimension.allowHalf"
        :show-text="dimension.showText"
        :texts="dimension.texts"
        @change="updateOverallRating"
      />
    </div>
    
    <div class="overall-rating">
      <label>Overall Rating:</label>
      <el-rate
        v-model="overallRating"
        allow-half
        show-score
        readonly
        :colors="['#ff4d4f', '#ffa940', '#52c41a']"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const dimensions = reactive([
  {
    key: 'content',
    label: 'Content Quality',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
  },
  {
    key: 'teacher',
    label: 'Instructor Level',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['Poor', 'Fair', 'Average', 'Good', 'Excellent']
  },
  {
    key: 'difficulty',
    label: 'Appropriate Difficulty',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['Very Hard', 'Hard', 'Moderate', 'Easy', 'Very Easy']
  }
])

const overallRating = ref(0)

const updateOverallRating = () => {
  const total = dimensions.reduce((sum, dim) => sum + dim.value, 0)
  const count = dimensions.filter(dim => dim.value > 0).length
  overallRating.value = count > 0 ? Number((total / count).toFixed(1)) : 0
}
</script>
```

### Exercise 2: Dynamic Rating Display

Create a dynamic rating display component:

```vue
<template>
  <div class="dynamic-rating-display">
    <h3>User Rating Statistics</h3>
    <div v-for="rating in ratingStats" :key="rating.stars" class="rating-row">
      <span class="stars">{{ rating.stars }} stars</span>
      <el-rate
        :model-value="rating.stars"
        readonly
        :max="5"
      />
      <div class="progress-bar">
        <div 
          class="progress-fill"
          :style="{ width: rating.percentage + '%' }"
        ></div>
      </div>
      <span class="count">{{ rating.count }} users</span>
    </div>
    
    <div class="average-rating">
      <span>Average Rating:</span>
      <el-rate
        :model-value="averageRating"
        allow-half
        readonly
        show-score
        :colors="['#ff4d4f', '#ffa940', '#52c41a']"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const ratingStats = [
  { stars: 5, count: 120 },
  { stars: 4, count: 80 },
  { stars: 3, count: 30 },
  { stars: 2, count: 10 },
  { stars: 1, count: 5 }
]

const totalCount = computed(() => {
  return ratingStats.reduce((sum, rating) => sum + rating.count, 0)
})

const averageRating = computed(() => {
  const totalScore = ratingStats.reduce((sum, rating) => {
    return sum + (rating.stars * rating.count)
  }, 0)
  return Number((totalScore / totalCount.value).toFixed(1))
})

// Calculate percentages
ratingStats.forEach(rating => {
  rating.percentage = (rating.count / totalCount.value * 100).toFixed(1)
})
</script>
```

## Common Issues

### 1. Rating Value Not Updating

**Issue**: Rating value is not correctly bound or updated

**Solution**:
```vue
<!-- Ensure correct v-model usage -->
<el-rate v-model="ratingValue" />

<!-- Ensure initial value is a number type -->
<script setup>
const ratingValue = ref(0) // not ref('0')
</script>
```

### 2. Custom Icons Not Displaying

**Issue**: Custom icons are not displaying correctly

**Solution**:
```vue
<template>
  <el-rate
    v-model="value"
    :icons="[Star, Star, StarFilled]"
    :void-icon="ChatDotRound"
  />
</template>

<script setup>
import { Star, StarFilled, ChatDotRound } from '@element-plus/icons-vue'
</script>
```

### 3. Half-Star Rating Precision Issues

**Issue**: Precision control for half-star ratings

**Solution**:
```vue
<el-rate
  v-model="value"
  allow-half
  @change="handleRateChange"
/>

<script setup>
const handleRateChange = (value) => {
  // Ensure precision of 0.5
  const roundedValue = Math.round(value * 2) / 2
  console.log('Rating:', roundedValue)
}
</script>
```

## Best Practices

1. **Semantic Labels**: Provide meaningful labels for rating components
2. **User Feedback**: Provide appropriate feedback when ratings change
3. **Data Validation**: Ensure the validity of rating data
4. **Accessibility**: Ensure keyboard navigation and screen reader support
5. **Visual Consistency**: Maintain consistent rating styles throughout an application
6. **Reasonable Defaults**: Set reasonable default configurations for rating components

## Summary

The Rate component is a feature-rich evaluation component that supports:

- Basic rating functionality
- Multiple states (disabled, read-only)
- Half-star ratings
- Custom icons and colors
- Auxiliary text and score display
- Size control
- Rich configuration options
- Good accessibility support

Mastering the Rate component can help you build more intuitive and user-friendly evaluation systems.

## References

- [Element Plus Rate Official Documentation](https://element-plus.org/en-US/component/rate.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)