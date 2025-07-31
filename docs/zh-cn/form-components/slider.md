# Slider 滑块

## 概述

Slider 滑块是一种通过拖拽滑块来选择数值的输入组件。它提供了直观的数值选择方式，特别适用于需要在一定范围内选择数值的场景，如音量调节、价格筛选、评分等。

## 学习目标

通过本章学习，你将掌握：

1. **基础功能**：基本滑块、范围选择、垂直滑块
2. **高级特性**：标记点、格式化显示、自定义样式
3. **事件处理**：滑块变化事件、拖拽事件
4. **实际应用**：价格筛选、评分系统、设置面板
5. **最佳实践**：性能优化、用户体验、可访问性

## 基础用法

### 1. 基本滑块

最简单的滑块用法：

```vue
<template>
  <div class="slider-demo">
    <h3>基本滑块</h3>
    
    <div class="demo-item">
      <label>音量控制：</label>
      <el-slider v-model="volume" :max="100" />
      <span class="value-display">{{ volume }}%</span>
    </div>
    
    <div class="demo-item">
      <label>进度设置：</label>
      <el-slider 
        v-model="progress" 
        :max="100" 
        :step="5"
        show-stops
      />
      <span class="value-display">{{ progress }}%</span>
    </div>
    
    <div class="demo-item">
      <label>温度调节：</label>
      <el-slider 
        v-model="temperature" 
        :min="-10" 
        :max="40" 
        :step="0.5"
      />
      <span class="value-display">{{ temperature }}°C</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const volume = ref(50)
const progress = ref(30)
const temperature = ref(20)
</script>

<style scoped>
.slider-demo {
  max-width: 600px;
  padding: 20px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.demo-item label {
  min-width: 100px;
  font-weight: 500;
  color: #303133;
}

.demo-item .el-slider {
  flex: 1;
}

.value-display {
  min-width: 60px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}
</style>
```

### 2. 范围选择滑块

选择数值范围的滑块：

```vue
<template>
  <div class="range-slider-demo">
    <h3>范围选择滑块</h3>
    
    <div class="demo-item">
      <label>价格区间：</label>
      <el-slider 
        v-model="priceRange" 
        range 
        :min="0" 
        :max="10000" 
        :step="100"
        :format-tooltip="formatPrice"
      />
      <span class="range-display">
        ¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}
      </span>
    </div>
    
    <div class="demo-item">
      <label>时间段：</label>
      <el-slider 
        v-model="timeRange" 
        range 
        :min="0" 
        :max="24" 
        :step="0.5"
        :format-tooltip="formatTime"
      />
      <span class="range-display">
        {{ formatTime(timeRange[0]) }} - {{ formatTime(timeRange[1]) }}
      </span>
    </div>
    
    <div class="demo-item">
      <label>年龄范围：</label>
      <el-slider 
        v-model="ageRange" 
        range 
        :min="18" 
        :max="65" 
        show-stops
        :step="5"
      />
      <span class="range-display">
        {{ ageRange[0] }}岁 - {{ ageRange[1] }}岁
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const priceRange = ref([1000, 5000])
const timeRange = ref([9, 18])
const ageRange = ref([25, 45])

const formatPrice = (value) => {
  return `¥${value}`
}

const formatTime = (value) => {
  const hours = Math.floor(value)
  const minutes = (value - hours) * 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.range-slider-demo {
  max-width: 600px;
  padding: 20px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.demo-item label {
  min-width: 100px;
  font-weight: 500;
  color: #303133;
}

.demo-item .el-slider {
  flex: 1;
}

.range-display {
  min-width: 120px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}
</style>
```

### 3. 垂直滑块

垂直方向的滑块：

```vue
<template>
  <div class="vertical-slider-demo">
    <h3>垂直滑块</h3>
    
    <div class="vertical-container">
      <div class="slider-group">
        <label>音量</label>
        <el-slider 
          v-model="audioVolume" 
          vertical 
          height="200px"
          :max="100"
        />
        <span class="value">{{ audioVolume }}%</span>
      </div>
      
      <div class="slider-group">
        <label>亮度</label>
        <el-slider 
          v-model="brightness" 
          vertical 
          height="200px"
          :max="100"
          :step="5"
          show-stops
        />
        <span class="value">{{ brightness }}%</span>
      </div>
      
      <div class="slider-group">
        <label>温度</label>
        <el-slider 
          v-model="roomTemp" 
          vertical 
          height="200px"
          :min="16"
          :max="30"
          :step="0.5"
          :format-tooltip="(val) => val + '°C'"
        />
        <span class="value">{{ roomTemp }}°C</span>
      </div>
      
      <div class="slider-group">
        <label>范围</label>
        <el-slider 
          v-model="verticalRange" 
          vertical 
          range
          height="200px"
          :min="0"
          :max="100"
          :step="10"
        />
        <span class="value">{{ verticalRange[0] }}-{{ verticalRange[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const audioVolume = ref(60)
const brightness = ref(80)
const roomTemp = ref(22)
const verticalRange = ref([20, 80])
</script>

<style scoped>
.vertical-slider-demo {
  max-width: 600px;
  padding: 20px;
}

.vertical-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  padding: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.slider-group label {
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.slider-group .value {
  color: #409eff;
  font-weight: 500;
  font-size: 14px;
  margin-top: 8px;
}
</style>
```

### 4. 滑块标记点

带有标记点的滑块：

```vue
<template>
  <div class="marks-slider-demo">
    <h3>滑块标记点</h3>
    
    <div class="demo-item">
      <label>评分等级：</label>
      <el-slider 
        v-model="rating" 
        :min="1" 
        :max="5" 
        :marks="ratingMarks"
        :step="1"
      />
      <span class="rating-text">{{ getRatingText(rating) }}</span>
    </div>
    
    <div class="demo-item">
      <label>性能等级：</label>
      <el-slider 
        v-model="performance" 
        :min="0" 
        :max="100" 
        :marks="performanceMarks"
        :step="10"
      />
      <span class="performance-text">{{ getPerformanceLevel(performance) }}</span>
    </div>
    
    <div class="demo-item">
      <label>时间节点：</label>
      <el-slider 
        v-model="timePoint" 
        :min="0" 
        :max="24" 
        :marks="timeMarks"
        :step="1"
        :format-tooltip="(val) => val + ':00'"
      />
      <span class="time-text">{{ timePoint }}:00</span>
    </div>
    
    <div class="demo-item">
      <label>价格档次：</label>
      <el-slider 
        v-model="priceLevel" 
        :min="0" 
        :max="5" 
        :marks="priceLevelMarks"
        :step="1"
      />
      <span class="price-text">{{ getPriceLevelText(priceLevel) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const rating = ref(3)
const performance = ref(60)
const timePoint = ref(12)
const priceLevel = ref(2)

const ratingMarks = {
  1: '很差',
  2: '较差', 
  3: '一般',
  4: '较好',
  5: '很好'
}

const performanceMarks = {
  0: '低',
  25: '中低',
  50: '中等',
  75: '中高',
  100: '高'
}

const timeMarks = {
  0: '0:00',
  6: '6:00',
  12: '12:00',
  18: '18:00',
  24: '24:00'
}

const priceLevelMarks = {
  0: '免费',
  1: '低价',
  2: '中价',
  3: '高价',
  4: '奢华',
  5: '顶级'
}

const getRatingText = (value) => {
  return ratingMarks[value] || '未知'
}

const getPerformanceLevel = (value) => {
  if (value <= 20) return '低性能'
  if (value <= 40) return '中低性能'
  if (value <= 60) return '中等性能'
  if (value <= 80) return '中高性能'
  return '高性能'
}

const getPriceLevelText = (value) => {
  return priceLevelMarks[value] || '未知'
}
</script>

<style scoped>
.marks-slider-demo {
  max-width: 600px;
  padding: 20px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  gap: 16px;
}

.demo-item label {
  min-width: 100px;
  font-weight: 500;
  color: #303133;
}

.demo-item .el-slider {
  flex: 1;
}

.rating-text,
.performance-text,
.time-text,
.price-text {
  min-width: 80px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}
</style>
```

## 高级功能

### 1. 自定义滑块样式

自定义滑块的外观和样式：

```vue
<template>
  <div class="custom-slider-demo">
    <h3>自定义滑块样式</h3>
    
    <div class="demo-section">
      <h4>主题色彩滑块</h4>
      <div class="color-sliders">
        <div class="color-item">
          <label>红色 (R):</label>
          <el-slider 
            v-model="colorR" 
            :max="255"
            class="red-slider"
          />
          <span>{{ colorR }}</span>
        </div>
        
        <div class="color-item">
          <label>绿色 (G):</label>
          <el-slider 
            v-model="colorG" 
            :max="255"
            class="green-slider"
          />
          <span>{{ colorG }}</span>
        </div>
        
        <div class="color-item">
          <label>蓝色 (B):</label>
          <el-slider 
            v-model="colorB" 
            :max="255"
            class="blue-slider"
          />
          <span>{{ colorB }}</span>
        </div>
        
        <div class="color-preview" :style="{ backgroundColor: rgbColor }">
          {{ rgbColor }}
        </div>
      </div>
    </div>
    
    <div class="demo-section">
      <h4>大尺寸滑块</h4>
      <el-slider 
        v-model="bigSlider" 
        :max="100"
        size="large"
        class="big-slider"
      />
    </div>
    
    <div class="demo-section">
      <h4>小尺寸滑块</h4>
      <el-slider 
        v-model="smallSlider" 
        :max="100"
        size="small"
        class="small-slider"
      />
    </div>
    
    <div class="demo-section">
      <h4>禁用状态</h4>
      <el-slider 
        v-model="disabledSlider" 
        :max="100"
        disabled
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const colorR = ref(255)
const colorG = ref(100)
const colorB = ref(50)
const bigSlider = ref(60)
const smallSlider = ref(40)
const disabledSlider = ref(30)

const rgbColor = computed(() => {
  return `rgb(${colorR.value}, ${colorG.value}, ${colorB.value})`
})
</script>

<style scoped>
.custom-slider-demo {
  max-width: 600px;
  padding: 20px;
}

.demo-section {
  margin-bottom: 32px;
}

.demo-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.color-sliders {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.color-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.color-item label {
  min-width: 80px;
  font-weight: 500;
}

.color-item .el-slider {
  flex: 1;
}

.color-item span {
  min-width: 40px;
  text-align: right;
  font-weight: 500;
}

.color-preview {
  height: 60px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  margin-top: 16px;
}

/* 自定义滑块颜色 */
.red-slider :deep(.el-slider__runway) {
  background-color: #fde2e2;
}

.red-slider :deep(.el-slider__bar) {
  background-color: #f56565;
}

.red-slider :deep(.el-slider__button) {
  border-color: #f56565;
}

.green-slider :deep(.el-slider__runway) {
  background-color: #e2f8e2;
}

.green-slider :deep(.el-slider__bar) {
  background-color: #48bb78;
}

.green-slider :deep(.el-slider__button) {
  border-color: #48bb78;
}

.blue-slider :deep(.el-slider__runway) {
  background-color: #e2f4ff;
}

.blue-slider :deep(.el-slider__bar) {
  background-color: #4299e1;
}

.blue-slider :deep(.el-slider__button) {
  border-color: #4299e1;
}

.big-slider :deep(.el-slider__runway) {
  height: 8px;
}

.big-slider :deep(.el-slider__button) {
  width: 24px;
  height: 24px;
}

.small-slider :deep(.el-slider__runway) {
  height: 4px;
}

.small-slider :deep(.el-slider__button) {
  width: 16px;
  height: 16px;
}
</style>
```

### 2. 滑块事件处理

处理滑块的各种事件：

```vue
<template>
  <div class="slider-events-demo">
    <h3>滑块事件处理</h3>
    
    <div class="demo-item">
      <label>音量控制：</label>
      <el-slider 
        v-model="volume" 
        :max="100"
        @change="handleVolumeChange"
        @input="handleVolumeInput"
      />
      <span class="value">{{ volume }}%</span>
    </div>
    
    <div class="demo-item">
      <label>实时反馈：</label>
      <el-slider 
        v-model="realtime" 
        :max="100"
        @input="handleRealtimeInput"
      />
      <span class="value">{{ realtime }}%</span>
    </div>
    
    <div class="demo-item">
      <label>延迟更新：</label>
      <el-slider 
        v-model="delayed" 
        :max="100"
        @change="handleDelayedChange"
      />
      <span class="value">{{ delayed }}%</span>
    </div>
    
    <div class="event-log">
      <h4>事件日志</h4>
      <div class="log-container">
        <div 
          v-for="(log, index) in eventLogs" 
          :key="index"
          class="log-item"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-event">{{ log.event }}</span>
          <span class="log-value">{{ log.value }}</span>
        </div>
      </div>
      
      <el-button @click="clearLogs" size="small">清空日志</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const volume = ref(50)
const realtime = ref(30)
const delayed = ref(70)
const eventLogs = ref([])

const addLog = (event, value) => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  
  eventLogs.value.unshift({
    time,
    event,
    value
  })
  
  // 限制日志数量
  if (eventLogs.value.length > 20) {
    eventLogs.value = eventLogs.value.slice(0, 20)
  }
}

const handleVolumeChange = (value) => {
  addLog('音量变化 (change)', value)
  
  // 模拟音量变化的业务逻辑
  if (value > 80) {
    ElMessage.warning('音量过高，请注意保护听力')
  }
}

const handleVolumeInput = (value) => {
  addLog('音量输入 (input)', value)
}

const handleRealtimeInput = (value) => {
  addLog('实时反馈 (input)', value)
  
  // 实时更新某些状态
  updateRealtimeStatus(value)
}

const handleDelayedChange = (value) => {
  addLog('延迟更新 (change)', value)
  
  // 延迟执行某些操作
  setTimeout(() => {
    addLog('延迟操作完成', value)
  }, 1000)
}

const updateRealtimeStatus = (value) => {
  // 模拟实时状态更新
  console.log('实时状态更新:', value)
}

const clearLogs = () => {
  eventLogs.value = []
  ElMessage.success('日志已清空')
}
</script>

<style scoped>
.slider-events-demo {
  max-width: 600px;
  padding: 20px;
}

.demo-item {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.demo-item label {
  min-width: 100px;
  font-weight: 500;
  color: #303133;
}

.demo-item .el-slider {
  flex: 1;
}

.value {
  min-width: 60px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}

.event-log {
  margin-top: 32px;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.event-log h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 16px;
  background: white;
  border-radius: 6px;
  padding: 12px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #f0f2f5;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #909399;
  min-width: 80px;
}

.log-event {
  color: #303133;
  min-width: 120px;
}

.log-value {
  color: #409eff;
  font-weight: 500;
}
</style>
```

## 实际应用示例

### 1. 价格筛选器

电商网站的价格筛选功能：

```vue
<template>
  <div class="price-filter-demo">
    <h3>商品价格筛选</h3>
    
    <div class="filter-container">
      <div class="filter-section">
        <h4>价格范围</h4>
        <div class="price-slider-container">
          <el-slider 
            v-model="priceRange" 
            range 
            :min="0" 
            :max="10000" 
            :step="100"
            :format-tooltip="formatPrice"
            @change="handlePriceChange"
          />
          
          <div class="price-inputs">
            <el-input-number 
              v-model="priceRange[0]" 
              :min="0" 
              :max="priceRange[1]" 
              :step="100"
              size="small"
              @change="handleMinPriceChange"
            />
            <span class="separator">-</span>
            <el-input-number 
              v-model="priceRange[1]" 
              :min="priceRange[0]" 
              :max="10000" 
              :step="100"
              size="small"
              @change="handleMaxPriceChange"
            />
          </div>
        </div>
        
        <div class="quick-filters">
          <el-button 
            v-for="preset in pricePresets" 
            :key="preset.label"
            size="small"
            @click="applyPricePreset(preset.range)"
          >
            {{ preset.label }}
          </el-button>
        </div>
      </div>
      
      <div class="filter-section">
        <h4>其他筛选</h4>
        
        <div class="filter-item">
          <label>评分：</label>
          <el-slider 
            v-model="minRating" 
            :min="1" 
            :max="5" 
            :step="0.5"
            :marks="ratingMarks"
            @change="handleRatingChange"
          />
        </div>
        
        <div class="filter-item">
          <label>销量：</label>
          <el-slider 
            v-model="minSales" 
            :min="0" 
            :max="10000" 
            :step="100"
            :format-tooltip="(val) => val + '+'"
            @change="handleSalesChange"
          />
        </div>
      </div>
    </div>
    
    <div class="products-container">
      <h4>商品列表 ({{ filteredProducts.length }} 件)</h4>
      
      <div class="products-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          
          <div class="product-info">
            <h5>{{ product.name }}</h5>
            <div class="product-price">¥{{ product.price }}</div>
            <div class="product-rating">
              <el-rate 
                v-model="product.rating" 
                disabled 
                size="small"
              />
              <span>({{ product.sales }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const priceRange = ref([1000, 5000])
const minRating = ref(3)
const minSales = ref(100)

const pricePresets = [
  { label: '100以下', range: [0, 100] },
  { label: '100-500', range: [100, 500] },
  { label: '500-1000', range: [500, 1000] },
  { label: '1000-3000', range: [1000, 3000] },
  { label: '3000以上', range: [3000, 10000] }
]

const ratingMarks = {
  1: '1星',
  2: '2星',
  3: '3星',
  4: '4星',
  5: '5星'
}

const products = ref([
  {
    id: 1,
    name: '智能手机 A',
    price: 2999,
    rating: 4.5,
    sales: 1250,
    image: 'https://via.placeholder.com/150x150?text=Phone+A'
  },
  {
    id: 2,
    name: '笔记本电脑 B',
    price: 5999,
    rating: 4.2,
    sales: 856,
    image: 'https://via.placeholder.com/150x150?text=Laptop+B'
  },
  {
    id: 3,
    name: '平板电脑 C',
    price: 1999,
    rating: 4.0,
    sales: 2100,
    image: 'https://via.placeholder.com/150x150?text=Tablet+C'
  },
  {
    id: 4,
    name: '智能手表 D',
    price: 1299,
    rating: 3.8,
    sales: 650,
    image: 'https://via.placeholder.com/150x150?text=Watch+D'
  },
  {
    id: 5,
    name: '耳机 E',
    price: 599,
    rating: 4.3,
    sales: 3200,
    image: 'https://via.placeholder.com/150x150?text=Headphone+E'
  },
  {
    id: 6,
    name: '键盘 F',
    price: 299,
    rating: 4.1,
    sales: 1800,
    image: 'https://via.placeholder.com/150x150?text=Keyboard+F'
  }
])

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    return product.price >= priceRange.value[0] &&
           product.price <= priceRange.value[1] &&
           product.rating >= minRating.value &&
           product.sales >= minSales.value
  })
})

const formatPrice = (value) => {
  return `¥${value}`
}

const handlePriceChange = (value) => {
  ElMessage.success(`价格范围更新: ¥${value[0]} - ¥${value[1]}`)
}

const handleMinPriceChange = (value) => {
  if (value > priceRange.value[1]) {
    priceRange.value[1] = value
  }
}

const handleMaxPriceChange = (value) => {
  if (value < priceRange.value[0]) {
    priceRange.value[0] = value
  }
}

const applyPricePreset = (range) => {
  priceRange.value = [...range]
  ElMessage.success(`已应用价格预设: ¥${range[0]} - ¥${range[1]}`)
}

const handleRatingChange = (value) => {
  ElMessage.success(`最低评分更新: ${value}星`)
}

const handleSalesChange = (value) => {
  ElMessage.success(`最低销量更新: ${value}+`)
}
</script>

<style scoped>
.price-filter-demo {
  max-width: 800px;
  padding: 20px;
}

.filter-container {
  background: #f5f7fa;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.price-slider-container {
  margin-bottom: 16px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.separator {
  color: #909399;
  font-weight: 500;
}

.quick-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.filter-item label {
  min-width: 60px;
  font-weight: 500;
  color: #303133;
}

.filter-item .el-slider {
  flex: 1;
}

.products-container h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-image {
  text-align: center;
  margin-bottom: 12px;
}

.product-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info h5 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 14px;
}

.product-price {
  color: #f56c6c;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
```

### 2. 设置面板

应用设置的滑块控制面板：

```vue
<template>
  <div class="settings-panel-demo">
    <h3>应用设置面板</h3>
    
    <div class="settings-container">
      <div class="settings-section">
        <h4>显示设置</h4>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>屏幕亮度</span>
            <el-icon><Sunny /></el-icon>
          </div>
          <el-slider 
            v-model="settings.brightness" 
            :max="100"
            @change="handleBrightnessChange"
          />
          <span class="setting-value">{{ settings.brightness }}%</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>字体大小</span>
            <el-icon><Document /></el-icon>
          </div>
          <el-slider 
            v-model="settings.fontSize" 
            :min="12" 
            :max="24" 
            :step="2"
            :marks="fontSizeMarks"
            @change="handleFontSizeChange"
          />
          <span class="setting-value">{{ settings.fontSize }}px</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>缩放比例</span>
            <el-icon><ZoomIn /></el-icon>
          </div>
          <el-slider 
            v-model="settings.zoom" 
            :min="50" 
            :max="200" 
            :step="25"
            :marks="zoomMarks"
            :format-tooltip="(val) => val + '%'"
            @change="handleZoomChange"
          />
          <span class="setting-value">{{ settings.zoom }}%</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>音频设置</h4>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>主音量</span>
            <el-icon><VideoPlay /></el-icon>
          </div>
          <el-slider 
            v-model="settings.masterVolume" 
            :max="100"
            @change="handleMasterVolumeChange"
          />
          <span class="setting-value">{{ settings.masterVolume }}%</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>音效音量</span>
            <el-icon><Bell /></el-icon>
          </div>
          <el-slider 
            v-model="settings.effectVolume" 
            :max="100"
            :disabled="settings.masterVolume === 0"
            @change="handleEffectVolumeChange"
          />
          <span class="setting-value">{{ settings.effectVolume }}%</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>音乐音量</span>
            <el-icon><Headphone /></el-icon>
          </div>
          <el-slider 
            v-model="settings.musicVolume" 
            :max="100"
            :disabled="settings.masterVolume === 0"
            @change="handleMusicVolumeChange"
          />
          <span class="setting-value">{{ settings.musicVolume }}%</span>
        </div>
      </div>
      
      <div class="settings-section">
        <h4>性能设置</h4>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>图形质量</span>
            <el-icon><Picture /></el-icon>
          </div>
          <el-slider 
            v-model="settings.graphicsQuality" 
            :min="1" 
            :max="5" 
            :step="1"
            :marks="qualityMarks"
            @change="handleGraphicsQualityChange"
          />
          <span class="setting-value">{{ getQualityText(settings.graphicsQuality) }}</span>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">
            <span>帧率限制</span>
            <el-icon><Timer /></el-icon>
          </div>
          <el-slider 
            v-model="settings.frameRate" 
            :min="30" 
            :max="144" 
            :step="30"
            :marks="frameRateMarks"
            :format-tooltip="(val) => val + ' FPS'"
            @change="handleFrameRateChange"
          />
          <span class="setting-value">{{ settings.frameRate }} FPS</span>
        </div>
      </div>
      
      <div class="settings-actions">
        <el-button @click="resetSettings">重置默认</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </div>
    </div>
    
    <div class="preview-section">
      <h4>设置预览</h4>
      <div class="preview-container" :style="previewStyles">
        <p>这是一个预览文本，展示当前的字体大小和缩放设置。</p>
        <div class="volume-indicator">
          <span>音量指示器</span>
          <div class="volume-bars">
            <div 
              v-for="i in 10" 
              :key="i"
              class="volume-bar"
              :class="{ active: i <= Math.floor(settings.masterVolume / 10) }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Sunny, 
  Document, 
  ZoomIn, 
  VideoPlay, 
  Bell, 
  Headphone, 
  Picture, 
  Timer 
} from '@element-plus/icons-vue'

const settings = ref({
  brightness: 80,
  fontSize: 16,
  zoom: 100,
  masterVolume: 70,
  effectVolume: 60,
  musicVolume: 50,
  graphicsQuality: 3,
  frameRate: 60
})

const fontSizeMarks = {
  12: '小',
  16: '中',
  20: '大',
  24: '特大'
}

const zoomMarks = {
  50: '50%',
  75: '75%',
  100: '100%',
  125: '125%',
  150: '150%',
  200: '200%'
}

const qualityMarks = {
  1: '低',
  2: '中低',
  3: '中',
  4: '高',
  5: '极高'
}

const frameRateMarks = {
  30: '30',
  60: '60',
  90: '90',
  120: '120',
  144: '144'
}

const previewStyles = computed(() => {
  return {
    fontSize: settings.value.fontSize + 'px',
    transform: `scale(${settings.value.zoom / 100})`,
    transformOrigin: 'top left',
    filter: `brightness(${settings.value.brightness}%)`
  }
})

const getQualityText = (value) => {
  return qualityMarks[value] || '未知'
}

const handleBrightnessChange = (value) => {
  ElMessage.success(`屏幕亮度设置为 ${value}%`)
}

const handleFontSizeChange = (value) => {
  ElMessage.success(`字体大小设置为 ${value}px`)
}

const handleZoomChange = (value) => {
  ElMessage.success(`缩放比例设置为 ${value}%`)
}

const handleMasterVolumeChange = (value) => {
  if (value === 0) {
    settings.value.effectVolume = 0
    settings.value.musicVolume = 0
  }
  ElMessage.success(`主音量设置为 ${value}%`)
}

const handleEffectVolumeChange = (value) => {
  ElMessage.success(`音效音量设置为 ${value}%`)
}

const handleMusicVolumeChange = (value) => {
  ElMessage.success(`音乐音量设置为 ${value}%`)
}

const handleGraphicsQualityChange = (value) => {
  ElMessage.success(`图形质量设置为 ${getQualityText(value)}`)
}

const handleFrameRateChange = (value) => {
  ElMessage.success(`帧率限制设置为 ${value} FPS`)
}

const resetSettings = () => {
  settings.value = {
    brightness: 80,
    fontSize: 16,
    zoom: 100,
    masterVolume: 70,
    effectVolume: 60,
    musicVolume: 50,
    graphicsQuality: 3,
    frameRate: 60
  }
  ElMessage.success('设置已重置为默认值')
}

const saveSettings = () => {
  // 模拟保存设置到本地存储或服务器
  localStorage.setItem('appSettings', JSON.stringify(settings.value))
  ElMessage.success('设置已保存')
}
</script>

<style scoped>
.settings-panel-demo {
  max-width: 700px;
  padding: 20px;
}

.settings-container {
  background: #f5f7fa;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.settings-section {
  margin-bottom: 32px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h4 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
}

.setting-label {
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #303133;
}

.setting-item .el-slider {
  flex: 1;
}

.setting-value {
  min-width: 60px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}

.settings-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.preview-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.preview-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.preview-container {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 6px;
  transition: all 0.3s;
}

.volume-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.volume-bars {
  display: flex;
  gap: 2px;
}

.volume-bar {
  width: 4px;
  height: 20px;
  background: #e4e7ed;
  border-radius: 2px;
  transition: background-color 0.3s;
}

.volume-bar.active {
  background: #409eff;
}
</style>
```

## API 文档

### Slider Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| model-value / v-model | 绑定值 | number / number[] | — | 0 |
| min | 最小值 | number | — | 0 |
| max | 最大值 | number | — | 100 |
| disabled | 是否禁用 | boolean | — | false |
| step | 步长 | number | — | 1 |
| show-input | 是否显示输入框 | boolean | — | false |
| show-input-controls | 是否显示输入框的控制按钮 | boolean | — | true |
| size | 输入框的尺寸 | string | large / default / small | default |
| show-stops | 是否显示间断点 | boolean | — | false |
| show-tooltip | 是否显示 tooltip | boolean | — | true |
| format-tooltip | 格式化 tooltip message | function(value) | — | — |
| range | 是否为范围选择 | boolean | — | false |
| vertical | 是否竖向模式 | boolean | — | false |
| height | Slider 高度，竖向模式时必填 | string | — | — |
| label | 屏幕阅读器标签 | string | — | — |
| debounce | 输入时的去抖延迟，毫秒 | number | — | 300 |
| tooltip-class | tooltip 的自定义类名 | string | — | — |
| marks | 标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内 | object | — | — |

### Slider Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 值改变时触发（使用鼠标拖拽时，只在松开鼠标后触发） | value |
| input | 数据改变时触发（使用鼠标拖拽时，活动过程实时触发） | value |

### Slider Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| focus | 使 slider 获取焦点 | — |
| blur | 使 slider 失去焦点 | — |

## 实践练习

### 练习1：音乐播放器控制面板

创建一个音乐播放器的控制面板：

```vue
<template>
  <div class="music-player-demo">
    <h3>音乐播放器控制面板</h3>
    
    <div class="player-container">
      <div class="player-header">
        <div class="song-info">
          <h4>{{ currentSong.title }}</h4>
          <p>{{ currentSong.artist }}</p>
        </div>
        
        <div class="album-cover">
          <img :src="currentSong.cover" :alt="currentSong.title" />
        </div>
      </div>
      
      <div class="player-controls">
        <div class="progress-section">
          <span class="time-display">{{ formatTime(currentTime) }}</span>
          <el-slider 
            v-model="currentTime" 
            :max="duration"
            :format-tooltip="formatTimeTooltip"
            @change="handleSeek"
            class="progress-slider"
          />
          <span class="time-display">{{ formatTime(duration) }}</span>
        </div>
        
        <div class="control-buttons">
          <el-button circle @click="previousSong">
            <el-icon><DArrowLeft /></el-icon>
          </el-button>
          
          <el-button 
            circle 
            type="primary" 
            size="large"
            @click="togglePlay"
          >
            <el-icon>
              <VideoPlay v-if="!isPlaying" />
              <VideoPause v-else />
            </el-icon>
          </el-button>
          
          <el-button circle @click="nextSong">
            <el-icon><DArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div class="volume-section">
          <el-icon class="volume-icon"><Mute v-if="volume === 0" /><Microphone v-else /></el-icon>
          <el-slider 
            v-model="volume" 
            :max="100"
            :format-tooltip="(val) => val + '%'"
            @change="handleVolumeChange"
            class="volume-slider"
          />
        </div>
        
        <div class="equalizer-section">
          <h5>均衡器</h5>
          <div class="eq-controls">
            <div 
              v-for="(freq, index) in equalizer" 
              :key="index"
              class="eq-band"
            >
              <label>{{ freq.label }}</label>
              <el-slider 
                v-model="freq.value" 
                vertical
                height="100px"
                :min="-12"
                :max="12"
                :step="1"
                :format-tooltip="(val) => val + 'dB'"
                @change="handleEqChange(index, $event)"
              />
              <span class="eq-value">{{ freq.value }}dB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  DArrowLeft, 
  DArrowRight, 
  VideoPlay, 
  VideoPause, 
  Mute, 
  Microphone 
} from '@element-plus/icons-vue'

const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(240) // 4分钟
const volume = ref(70)

const currentSong = ref({
  title: '示例歌曲',
  artist: '示例艺术家',
  cover: 'https://via.placeholder.com/100x100?text=Album'
})

const equalizer = ref([
  { label: '60Hz', value: 0 },
  { label: '170Hz', value: 2 },
  { label: '310Hz', value: -1 },
  { label: '600Hz', value: 1 },
  { label: '1kHz', value: 0 },
  { label: '3kHz', value: 3 },
  { label: '6kHz', value: -2 },
  { label: '12kHz', value: 1 },
  { label: '14kHz', value: 0 },
  { label: '16kHz', value: 2 }
])

let playTimer = null

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatTimeTooltip = (value) => {
  return formatTime(value)
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    startPlayTimer()
    ElMessage.success('开始播放')
  } else {
    stopPlayTimer()
    ElMessage.info('暂停播放')
  }
}

const startPlayTimer = () => {
  playTimer = setInterval(() => {
    if (currentTime.value < duration.value) {
      currentTime.value += 1
    } else {
      // 歌曲结束
      isPlaying.value = false
      currentTime.value = 0
      stopPlayTimer()
      ElMessage.info('歌曲播放完毕')
    }
  }, 1000)
}

const stopPlayTimer = () => {
  if (playTimer) {
    clearInterval(playTimer)
    playTimer = null
  }
}

const handleSeek = (value) => {
  currentTime.value = value
  ElMessage.success(`跳转到 ${formatTime(value)}`)
}

const handleVolumeChange = (value) => {
  ElMessage.success(`音量设置为 ${value}%`)
}

const previousSong = () => {
  ElMessage.info('上一首歌曲')
}

const nextSong = () => {
  ElMessage.info('下一首歌曲')
}

const handleEqChange = (index, value) => {
  ElMessage.success(`${equalizer.value[index].label} 设置为 ${value}dB`)
}

onMounted(() => {
  // 组件挂载时的初始化
})

onUnmounted(() => {
  // 清理定时器
  stopPlayTimer()
})
</script>

<style scoped>
.music-player-demo {
  max-width: 800px;
  padding: 20px;
}

.player-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.song-info h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.song-info p {
  margin: 0;
  opacity: 0.8;
  font-size: 14px;
}

.album-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.time-display {
  font-size: 14px;
  min-width: 40px;
  text-align: center;
}

.progress-slider {
  flex: 1;
}

.progress-slider :deep(.el-slider__runway) {
  background-color: rgba(255,255,255,0.3);
}

.progress-slider :deep(.el-slider__bar) {
  background-color: white;
}

.progress-slider :deep(.el-slider__button) {
  border-color: white;
  background-color: white;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.volume-icon {
  font-size: 18px;
}

.volume-slider {
  flex: 1;
  max-width: 200px;
}

.volume-slider :deep(.el-slider__runway) {
  background-color: rgba(255,255,255,0.3);
}

.volume-slider :deep(.el-slider__bar) {
  background-color: white;
}

.volume-slider :deep(.el-slider__button) {
  border-color: white;
  background-color: white;
}

.equalizer-section h5 {
  margin: 0 0 16px 0;
  text-align: center;
  font-size: 16px;
}

.eq-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.eq-band {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.eq-band label {
  font-size: 12px;
  opacity: 0.8;
}

.eq-value {
  font-size: 12px;
  opacity: 0.8;
}

.eq-band .el-slider {
  margin: 8px 0;
}

.eq-band :deep(.el-slider__runway) {
  background-color: rgba(255,255,255,0.3);
}

.eq-band :deep(.el-slider__bar) {
  background-color: white;
}

.eq-band :deep(.el-slider__button) {
  border-color: white;
  background-color: white;
}
</style>
```

### 练习2：图片编辑器滑块控制

创建一个图片编辑器的滑块控制面板：

```vue
<template>
  <div class="image-editor-demo">
    <h3>图片编辑器滑块控制</h3>
    
    <div class="editor-container">
      <div class="image-preview">
        <div class="preview-image" :style="imageStyles">
          <img src="https://via.placeholder.com/400x300?text=Sample+Image" alt="预览图片" />
        </div>
      </div>
      
      <div class="controls-panel">
        <div class="control-group">
          <h4>基础调整</h4>
          
          <div class="control-item">
            <label>亮度</label>
            <el-slider 
              v-model="adjustments.brightness" 
              :min="-100" 
              :max="100" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ adjustments.brightness }}</span>
          </div>
          
          <div class="control-item">
            <label>对比度</label>
            <el-slider 
              v-model="adjustments.contrast" 
              :min="-100" 
              :max="100" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ adjustments.contrast }}</span>
          </div>
          
          <div class="control-item">
            <label>饱和度</label>
            <el-slider 
              v-model="adjustments.saturation" 
              :min="-100" 
              :max="100" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ adjustments.saturation }}</span>
          </div>
          
          <div class="control-item">
            <label>色相</label>
            <el-slider 
              v-model="adjustments.hue" 
              :min="-180" 
              :max="180" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ adjustments.hue }}°</span>
          </div>
        </div>
        
        <div class="control-group">
          <h4>滤镜效果</h4>
          
          <div class="control-item">
            <label>模糊</label>
            <el-slider 
              v-model="filters.blur" 
              :min="0" 
              :max="10" 
              :step="0.1"
              @input="updatePreview"
            />
            <span class="value">{{ filters.blur }}px</span>
          </div>
          
          <div class="control-item">
            <label>锐化</label>
            <el-slider 
              v-model="filters.sharpen" 
              :min="0" 
              :max="5" 
              :step="0.1"
              @input="updatePreview"
            />
            <span class="value">{{ filters.sharpen }}</span>
          </div>
          
          <div class="control-item">
            <label>噪点</label>
            <el-slider 
              v-model="filters.noise" 
              :min="0" 
              :max="100" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ filters.noise }}%</span>
          </div>
          
          <div class="control-item">
            <label>透明度</label>
            <el-slider 
              v-model="filters.opacity" 
              :min="0" 
              :max="100" 
              :step="1"
              @input="updatePreview"
            />
            <span class="value">{{ filters.opacity }}%</span>
          </div>
        </div>
        
        <div class="control-actions">
          <el-button @click="resetAll">重置全部</el-button>
          <el-button @click="applyPreset('vintage')">复古</el-button>
          <el-button @click="applyPreset('vivid')">鲜艳</el-button>
          <el-button @click="applyPreset('bw')">黑白</el-button>
          <el-button type="primary" @click="saveImage">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const adjustments = ref({
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0
})

const filters = ref({
  blur: 0,
  sharpen: 0,
  noise: 0,
  opacity: 100
})

const imageStyles = computed(() => {
  const filterString = [
    `brightness(${100 + adjustments.value.brightness}%)`,
    `contrast(${100 + adjustments.value.contrast}%)`,
    `saturate(${100 + adjustments.value.saturation}%)`,
    `hue-rotate(${adjustments.value.hue}deg)`,
    `blur(${filters.value.blur}px)`,
    `opacity(${filters.value.opacity}%)`
  ].join(' ')
  
  return {
    filter: filterString,
    transform: `scale(${1 + filters.value.sharpen * 0.1})`
  }
})

const updatePreview = () => {
  // 实时更新预览
  console.log('更新预览', { adjustments: adjustments.value, filters: filters.value })
}

const resetAll = () => {
  adjustments.value = {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0
  }
  
  filters.value = {
    blur: 0,
    sharpen: 0,
    noise: 0,
    opacity: 100
  }
  
  ElMessage.success('已重置所有调整')
}

const applyPreset = (preset) => {
  switch (preset) {
    case 'vintage':
      adjustments.value = { brightness: -10, contrast: 20, saturation: -30, hue: 15 }
      filters.value = { blur: 0.5, sharpen: 0, noise: 10, opacity: 90 }
      break
    case 'vivid':
      adjustments.value = { brightness: 10, contrast: 30, saturation: 40, hue: 0 }
      filters.value = { blur: 0, sharpen: 1, noise: 0, opacity: 100 }
      break
    case 'bw':
      adjustments.value = { brightness: 0, contrast: 20, saturation: -100, hue: 0 }
      filters.value = { blur: 0, sharpen: 0.5, noise: 5, opacity: 100 }
      break
  }
  
  ElMessage.success(`已应用${preset}预设`)
}

const saveImage = () => {
  ElMessage.success('图片已保存')
}
</script>

<style scoped>
.image-editor-demo {
  max-width: 1000px;
  padding: 20px;
}

.editor-container {
  display: flex;
  gap: 24px;
  background: #f5f7fa;
  padding: 24px;
  border-radius: 12px;
}

.image-preview {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}

.preview-image {
  transition: all 0.3s ease;
}

.preview-image img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.controls-panel {
  width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.control-group {
  margin-bottom: 24px;
}

.control-group h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  border-bottom: 2px solid #409eff;
  padding-bottom: 8px;
}

.control-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.control-item label {
  min-width: 60px;
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.control-item .el-slider {
  flex: 1;
}

.control-item .value {
  min-width: 50px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
  font-size: 12px;
}

.control-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.control-actions .el-button {
  flex: 1;
  min-width: 60px;
}
</style>
```

## 常见问题

### 1. 性能优化

**问题**：滑块拖拽时频繁触发事件导致性能问题

**解决方案**：
- 使用防抖（debounce）或节流（throttle）
- 区分 `input` 和 `change` 事件
- 避免在滑块事件中进行复杂计算

```javascript
// 使用防抖
import { debounce } from 'lodash-es'

const handleSliderChange = debounce((value) => {
  // 执行复杂操作
  performExpensiveOperation(value)
}, 300)
```

### 2. 数值精度

**问题**：浮点数计算精度问题

**解决方案**：
- 使用适当的 `step` 值
- 对结果进行四舍五入处理
- 使用数值格式化函数

```javascript
const formatValue = (value) => {
  return Math.round(value * 100) / 100
}
```

### 3. 响应式布局

**问题**：在小屏幕设备上滑块操作困难

**解决方案**：
- 增加滑块按钮大小
- 调整滑块轨道高度
- 提供替代输入方式

```css
@media (max-width: 768px) {
  .el-slider__button {
    width: 24px;
    height: 24px;
  }
  
  .el-slider__runway {
    height: 8px;
  }
}
```

### 4. 可访问性

**问题**：屏幕阅读器用户无法有效使用滑块

**解决方案**：
- 添加适当的 `aria-label`
- 提供键盘导航支持
- 显示当前值的文本描述

```vue
<el-slider 
  v-model="value"
  :aria-label="`音量控制，当前值：${value}%`"
  :format-tooltip="(val) => `${val}%`"
/>
```

## 最佳实践

### 1. 用户体验优化

- **提供视觉反馈**：使用颜色、动画等方式提供即时反馈
- **合理的步长**：根据使用场景设置合适的步长值
- **标记点**：在关键数值位置添加标记点
- **范围提示**：显示最小值和最大值

### 2. 数据处理

- **数据验证**：确保滑块值在有效范围内
- **格式化显示**：使用合适的格式化函数显示数值
- **默认值**：设置合理的默认值
- **数据持久化**：保存用户的设置偏好

### 3. 性能考虑

- **事件优化**：合理使用 `input` 和 `change` 事件
- **防抖节流**：对频繁触发的操作进行优化
- **虚拟化**：对大量滑块进行虚拟化处理
- **懒加载**：延迟加载非关键滑块

### 4. 可访问性

- **键盘支持**：确保可以通过键盘操作
- **屏幕阅读器**：提供适当的标签和描述
- **高对比度**：支持高对比度模式
- **触摸友好**：在移动设备上提供良好的触摸体验

## 总结

Slider 滑块组件是一个功能强大且灵活的输入控件，适用于各种数值选择场景。通过本章的学习，你应该掌握了：

1. **基础用法**：基本滑块、范围选择、垂直滑块的实现
2. **高级特性**：标记点、自定义样式、事件处理
3. **实际应用**：价格筛选、设置面板、音乐播放器等场景
4. **性能优化**：防抖节流、事件优化、响应式设计
5. **最佳实践**：用户体验、可访问性、数据处理

在实际开发中，要根据具体需求选择合适的滑块类型和配置，注意性能优化和用户体验，确保组件在各种设备和环境下都能正常工作。

## 参考资料

- [Element Plus Slider 官方文档](https://element-plus.org/zh-CN/component/slider.html)
- [MDN - input type="range"](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input/range)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [CSS Filter Effects](https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter)