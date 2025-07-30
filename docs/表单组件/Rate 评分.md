# Rate 评分

## 概述

Rate 评分组件用于评分，支持半星选择，支持辅助文字提示。它是一个直观的评价组件，常用于商品评价、用户反馈等场景。

## 学习目标

- 掌握 Rate 的基本概念和使用场景
- 学会基础评分的使用方法
- 了解评分的状态控制和事件处理
- 掌握不同样式和尺寸的评分实现
- 学会自定义评分的图标和颜色
- 了解半星评分和辅助文字
- 掌握 API 的完整使用方法

## 基础用法

### 基本评分

最简单的评分用法：

```vue
<template>
  <div>
    <el-rate v-model="value1" />
    <p>评分：{{ value1 }}</p>
    
    <el-rate v-model="value2" :max="10" />
    <p>评分（满分10分）：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(7)
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用评分：

```vue
<template>
  <div>
    <el-rate v-model="value1" disabled />
    <p>禁用状态评分：{{ value1 }}</p>
    
    <el-rate v-model="value2" disabled show-text />
    <p>禁用状态带文字：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3.5)
const value2 = ref(4)
</script>
```

### 只读状态

通过 `readonly` 属性来设置只读状态：

```vue
<template>
  <div>
    <el-rate v-model="value1" readonly />
    <p>只读状态评分：{{ value1 }}</p>
    
    <el-rate v-model="value2" readonly show-score />
    <p>只读状态显示分数：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4.5)
const value2 = ref(3.7)
</script>
```

## 辅助文字

### 显示文字

使用 `show-text` 属性显示辅助文字：

```vue
<template>
  <div>
    <el-rate
      v-model="value1"
      show-text
    />
    <p>当前评分：{{ value1 }}</p>
    
    <el-rate
      v-model="value2"
      :texts="customTexts"
      show-text
    />
    <p>自定义文字评分：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(2)

const customTexts = [
  '极差',
  '失望', 
  '一般',
  '满意',
  '惊喜'
]
</script>
```

### 显示分数

使用 `show-score` 属性显示当前分数：

```vue
<template>
  <div>
    <el-rate
      v-model="value1"
      show-score
    />
    <p>显示分数：{{ value1 }}</p>
    
    <el-rate
      v-model="value2"
      show-score
      score-template="{value} 分"
    />
    <p>自定义分数模板：{{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(4.5)
const value2 = ref(3.2)
</script>
```

## 半星评分

使用 `allow-half` 属性支持半星评分：

```vue
<template>
  <div>
    <h4>整星评分</h4>
    <el-rate v-model="value1" />
    <p>评分：{{ value1 }}</p>
    
    <h4>半星评分</h4>
    <el-rate v-model="value2" allow-half />
    <p>评分：{{ value2 }}</p>
    
    <h4>半星评分 + 显示分数</h4>
    <el-rate v-model="value3" allow-half show-score />
    <p>评分：{{ value3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(3)
const value2 = ref(3.5)
const value3 = ref(4.2)
</script>
```

## 自定义图标

### 使用图标

使用 `icons` 属性自定义不同等级的图标：

```vue
<template>
  <div>
    <h4>自定义图标</h4>
    <el-rate
      v-model="value1"
      :icons="customIcons"
      :void-icon="ChatDotRound"
      :colors="customColors"
    />
    <p>评分：{{ value1 }}</p>
    
    <h4>表情评分</h4>
    <el-rate
      v-model="value2"
      :icons="faceIcons"
      :void-icon="ChatDotRound"
      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
    />
    <p>评分：{{ value2 }}</p>
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

### 自定义颜色

使用 `colors` 属性自定义不同等级的颜色：

```vue
<template>
  <div>
    <h4>自定义颜色</h4>
    <el-rate
      v-model="value1"
      :colors="customColors"
    />
    <p>评分：{{ value1 }}</p>
    
    <h4>渐变色评分</h4>
    <el-rate
      v-model="value2"
      :colors="gradientColors"
      allow-half
    />
    <p>评分：{{ value2 }}</p>
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

## 尺寸

使用 `size` 属性来设置评分的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-rate v-model="value1" size="large" />
    
    <h4>默认尺寸</h4>
    <el-rate v-model="value2" />
    
    <h4>小尺寸</h4>
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

## 实际应用示例

### 商品评价组件

```vue
<template>
  <div class="product-review">
    <h3>商品评价</h3>
    
    <div class="review-form">
      <div class="review-item">
        <label>商品质量：</label>
        <el-rate
          v-model="review.quality"
          :texts="qualityTexts"
          show-text
          @change="handleRateChange('quality', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>物流速度：</label>
        <el-rate
          v-model="review.delivery"
          :texts="deliveryTexts"
          show-text
          @change="handleRateChange('delivery', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>服务态度：</label>
        <el-rate
          v-model="review.service"
          :texts="serviceTexts"
          show-text
          @change="handleRateChange('service', $event)"
        />
      </div>
      
      <div class="review-item">
        <label>综合评分：</label>
        <el-rate
          v-model="review.overall"
          allow-half
          show-score
          readonly
          :colors="['#ff4d4f', '#ffa940', '#52c41a']"
        />
      </div>
      
      <div class="review-actions">
        <el-button type="primary" @click="submitReview">提交评价</el-button>
        <el-button @click="resetReview">重置</el-button>
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

const qualityTexts = ['很差', '较差', '一般', '较好', '很好']
const deliveryTexts = ['很慢', '较慢', '一般', '较快', '很快']
const serviceTexts = ['很差', '较差', '一般', '较好', '很好']

const handleRateChange = (type, value) => {
  // 计算综合评分
  const total = review.quality + review.delivery + review.service
  const count = [review.quality, review.delivery, review.service].filter(v => v > 0).length
  review.overall = count > 0 ? Number((total / count).toFixed(1)) : 0
  
  ElMessage.success(`${type}评分已更新：${value}分`)
}

const submitReview = () => {
  if (review.quality === 0 || review.delivery === 0 || review.service === 0) {
    ElMessage.warning('请完成所有评分项')
    return
  }
  
  ElMessage.success('评价提交成功！')
  console.log('评价数据：', review)
}

const resetReview = () => {
  review.quality = 0
  review.delivery = 0
  review.service = 0
  review.overall = 0
  ElMessage.info('评分已重置')
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
  width: 80px;
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

### 用户反馈评分

```vue
<template>
  <div class="feedback-rating">
    <h3>用户体验反馈</h3>
    
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
      <h4>总体满意度</h4>
      <el-rate
        v-model="overallSatisfaction"
        :max="10"
        allow-half
        show-score
        score-template="{value}/10 分"
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
    title: '界面设计',
    description: '您对我们的界面设计满意吗？',
    rating: 0,
    icons: [Star, Star, StarFilled],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    allowHalf: true,
    showText: true,
    texts: ['很差', '较差', '一般', '较好', '很好']
  },
  {
    id: 2,
    title: '功能完整性',
    description: '您认为我们的功能是否满足需求？',
    rating: 0,
    icons: [Star, Star, StarFilled],
    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    allowHalf: true,
    showText: true,
    texts: ['很差', '较差', '一般', '较好', '很好']
  },
  {
    id: 3,
    title: '使用体验',
    description: '整体使用体验如何？',
    rating: 0,
    icons: [Sunny, Sunny, Sunny],
    colors: ['#ff4d4f', '#ffa940', '#52c41a'],
    allowHalf: false,
    showText: true,
    texts: ['很差', '较差', '一般', '较好', '很好']
  }
])

const overallSatisfaction = computed(() => {
  const total = feedbackItems.reduce((sum, item) => sum + item.rating, 0)
  const count = feedbackItems.filter(item => item.rating > 0).length
  return count > 0 ? Number(((total / count) * 2).toFixed(1)) : 0
})

const handleFeedbackChange = (item) => {
  ElMessage.success(`${item.title}评分已更新：${item.rating}分`)
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

## API 文档

### Rate Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | number | 0 |
| max | 最大分值 | number | 5 |
| disabled | 是否为禁用状态 | boolean | false |
| readonly | 是否为只读状态 | boolean | false |
| allow-half | 是否允许半选 | boolean | false |
| low-threshold | 低分和中等分数的界限值，值本身被划分在低分中 | number | 2 |
| high-threshold | 高分和中等分数的界限值，值本身被划分在高分中 | number | 4 |
| colors | icon 的颜色。若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段 | object / array | ['#F7BA2A', '#F7BA2A', '#F7BA2A'] |
| void-color | 未选中 icon 的颜色 | string | #C6D1DE |
| disabled-void-color | 只读时未选中 icon 的颜色 | string | #EFF2F7 |
| icons | 图标组件。若传入数组，共有 3 个元素，为 3 个分段所对应的类名；若传入对象，可自定义分段 | object / array | [StarFilled, StarFilled, StarFilled] |
| void-icon | 未选中时的图标组件 | string / Component | Star |
| disabled-void-icon | 禁用状态下未选中时的图标组件 | string / Component | StarFilled |
| show-text | 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容 | boolean | false |
| show-score | 是否显示当前分数，show-score 和 show-text 不能同时为真 | boolean | false |
| text-color | 辅助文字的颜色 | string | #1F2D3D |
| texts | 辅助文字数组 | array | ['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] |
| score-template | 分数显示模板 | string | {value} |
| size | 尺寸 | enum | — |
| label | 屏幕阅读器标签 | string | — |
| id | 原生 id 属性 | string | — |

### Rate Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 分值改变时触发 | Function |

### Rate Exposes

| 名称 | 说明 | 类型 |
|------|------|------|
| setCurrentValue | 设置当前分数 | Function |
| resetCurrentValue | 重置当前分数 | Function |

## 实践练习

### 练习1：多维度评分系统

创建一个多维度评分系统：

```vue
<template>
  <div class="multi-dimension-rating">
    <h3>课程评价</h3>
    <div v-for="dimension in dimensions" :key="dimension.key" class="dimension-item">
      <label>{{ dimension.label }}：</label>
      <el-rate
        v-model="dimension.value"
        :allow-half="dimension.allowHalf"
        :show-text="dimension.showText"
        :texts="dimension.texts"
        @change="updateOverallRating"
      />
    </div>
    
    <div class="overall-rating">
      <label>综合评分：</label>
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
    label: '内容质量',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['很差', '较差', '一般', '较好', '很好']
  },
  {
    key: 'teacher',
    label: '讲师水平',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['很差', '较差', '一般', '较好', '很好']
  },
  {
    key: 'difficulty',
    label: '难度适中',
    value: 0,
    allowHalf: true,
    showText: true,
    texts: ['很难', '较难', '适中', '较易', '很易']
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

### 练习2：动态评分展示

创建一个动态评分展示组件：

```vue
<template>
  <div class="dynamic-rating-display">
    <h3>用户评分统计</h3>
    <div v-for="rating in ratingStats" :key="rating.stars" class="rating-row">
      <span class="stars">{{ rating.stars }}星</span>
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
      <span class="count">{{ rating.count }}人</span>
    </div>
    
    <div class="average-rating">
      <span>平均评分：</span>
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

// 计算百分比
ratingStats.forEach(rating => {
  rating.percentage = (rating.count / totalCount.value * 100).toFixed(1)
})
</script>
```

## 常见问题

### 1. 评分值不更新

**问题**：评分的值没有正确绑定或更新

**解决方案**：
```vue
<!-- 确保正确使用 v-model -->
<el-rate v-model="ratingValue" />

<!-- 确保初始值是数字类型 -->
<script setup>
const ratingValue = ref(0) // 不是 ref('0')
</script>
```

### 2. 自定义图标不显示

**问题**：自定义图标没有正确显示

**解决方案**：
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

### 3. 半星评分精度问题

**问题**：半星评分的精度控制

**解决方案**：
```vue
<el-rate
  v-model="value"
  allow-half
  @change="handleRateChange"
/>

<script setup>
const handleRateChange = (value) => {
  // 确保精度为0.5
  const roundedValue = Math.round(value * 2) / 2
  console.log('评分：', roundedValue)
}
</script>
```

## 最佳实践

1. **语义化标签**：为评分组件提供有意义的标签
2. **用户反馈**：在评分变化时提供适当的反馈
3. **数据验证**：确保评分数据的有效性
4. **可访问性**：确保键盘导航和屏幕阅读器支持
5. **视觉一致性**：在同一应用中保持评分样式的一致性
6. **合理默认值**：为评分组件设置合理的默认配置

## 总结

Rate 评分是一个功能丰富的评价组件，支持：

- 基础评分功能
- 多种状态（禁用、只读）
- 半星评分
- 自定义图标和颜色
- 辅助文字和分数显示
- 尺寸控制
- 丰富的配置选项
- 良好的可访问性支持

掌握 Rate 组件的使用，能够帮助你构建更加直观和用户友好的评价系统。

## 参考资料

- [Element Plus Rate 官方文档](https://element-plus.org/zh-CN/component/rate.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)