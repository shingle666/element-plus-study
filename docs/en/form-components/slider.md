# Slider Component

## Overview

The Slider component allows users to select a value or range of values within a specified range. It provides an intuitive way to adjust values through a sliding interface, making it ideal for settings like volume control, price ranges, or any numeric value selection.

## Learning Objectives

- Master the basic concepts and use cases of Slider
- Learn how to use basic sliders for single value selection
- Understand range selection with dual sliders
- Master different styles and customization options
- Learn about discrete values and step control
- Understand slider state control and event handling
- Master the complete usage of the API

## Basic Usage

### Basic Slider

The simplest slider usage for selecting a single value:

```vue
<template>
  <div>
    <el-slider v-model="value" />
    <p>Selected value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(50)
</script>
```

### Disabled State

Use the `disabled` attribute to disable a slider:

```vue
<template>
  <div>
    <el-slider v-model="value" disabled />
    <p>Disabled slider value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(30)
</script>
```

### Step Control

Use the `step` attribute to control the step size:

```vue
<template>
  <div>
    <h4>Step: 10</h4>
    <el-slider v-model="value1" :step="10" />
    <p>Value: {{ value1 }}</p>
    
    <h4>Step: 5</h4>
    <el-slider v-model="value2" :step="5" />
    <p>Value: {{ value2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(50)
const value2 = ref(25)
</script>
```

### Custom Min and Max Values

Set the `min` and `max` attributes to define the range:

```vue
<template>
  <div>
    <h4>Temperature (0°C - 40°C)</h4>
    <el-slider v-model="temperature" :min="0" :max="40" />
    <p>Temperature: {{ temperature }}°C</p>
    
    <h4>Year (1900 - 2023)</h4>
    <el-slider v-model="year" :min="1900" :max="2023" :step="1" />
    <p>Year: {{ year }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const temperature = ref(25)
const year = ref(2023)
</script>
```

## Advanced Features

### Range Selection

Use the `range` attribute to enable range selection:

```vue
<template>
  <div>
    <h4>Price Range</h4>
    <el-slider v-model="priceRange" range :min="0" :max="1000" />
    <p>Selected price range: ${{ priceRange[0] }} - ${{ priceRange[1] }}</p>
    
    <h4>Age Range</h4>
    <el-slider v-model="ageRange" range :min="18" :max="80" :step="1" />
    <p>Selected age range: {{ ageRange[0] }} - {{ ageRange[1] }} years</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const priceRange = ref([200, 800])
const ageRange = ref([25, 50])
</script>
```

### Show Tooltip

Control the tooltip display with the `show-tooltip` attribute:

```vue
<template>
  <div>
    <h4>With Tooltip (default)</h4>
    <el-slider v-model="value1" />
    
    <h4>Without Tooltip</h4>
    <el-slider v-model="value2" :show-tooltip="false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref(50)
const value2 = ref(50)
</script>
```

### Format Tooltip

Customize the tooltip content with the `format-tooltip` function:

```vue
<template>
  <div>
    <h4>Price Slider</h4>
    <el-slider 
      v-model="price" 
      :min="0" 
      :max="1000" 
      :format-tooltip="formatPrice" 
    />
    <p>Selected price: {{ formatPrice(price) }}</p>
    
    <h4>Temperature Slider</h4>
    <el-slider 
      v-model="temperature" 
      :min="-20" 
      :max="40" 
      :format-tooltip="formatTemperature" 
    />
    <p>Selected temperature: {{ formatTemperature(temperature) }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const price = ref(500)
const temperature = ref(25)

const formatPrice = (val) => {
  return `$${val}`
}

const formatTemperature = (val) => {
  return `${val}°C`
}
</script>
```

### Marks

Add marks to the slider with the `marks` attribute:

```vue
<template>
  <div>
    <h4>Satisfaction Level</h4>
    <el-slider
      v-model="satisfaction"
      :step="25"
      :marks="satisfactionMarks"
    />
    <p>Satisfaction level: {{ getSatisfactionLabel(satisfaction) }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const satisfaction = ref(75)

const satisfactionMarks = {
  0: 'Very Dissatisfied',
  25: 'Dissatisfied',
  50: 'Neutral',
  75: 'Satisfied',
  100: 'Very Satisfied'
}

const getSatisfactionLabel = (value) => {
  return satisfactionMarks[value] || value
}
</script>
```

### Vertical Slider

Use the `vertical` attribute to create a vertical slider:

```vue
<template>
  <div style="height: 300px;">
    <h4>Vertical Slider</h4>
    <el-slider
      v-model="value"
      vertical
      height="200px"
    />
    <p>Value: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(50)
</script>
```

## Practical Application Examples

### Price Range Filter

```vue
<template>
  <div class="price-filter">
    <h3>Price Range Filter</h3>
    
    <div class="filter-section">
      <el-slider
        v-model="priceRange"
        range
        :min="0"
        :max="1000"
        :step="10"
        :format-tooltip="formatPrice"
        @change="handlePriceChange"
      />
      
      <div class="price-inputs">
        <el-input-number
          v-model="priceRange[0]"
          :min="0"
          :max="priceRange[1]"
          :step="10"
          @change="handleMinPriceChange"
        />
        <span class="separator">to</span>
        <el-input-number
          v-model="priceRange[1]"
          :min="priceRange[0]"
          :max="1000"
          :step="10"
          @change="handleMaxPriceChange"
        />
      </div>
      
      <div class="filter-actions">
        <el-button type="primary" @click="applyFilter">Apply Filter</el-button>
        <el-button @click="resetFilter">Reset</el-button>
      </div>
    </div>
    
    <div class="filter-results">
      <h4>Products in Price Range: {{ formatPrice(priceRange[0]) }} - {{ formatPrice(priceRange[1]) }}</h4>
      <p v-if="filteredProducts.length === 0">No products found in this price range.</p>
      <ul v-else class="product-list">
        <li v-for="product in filteredProducts" :key="product.id" class="product-item">
          <span class="product-name">{{ product.name }}</span>
          <span class="product-price">{{ formatPrice(product.price) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const priceRange = ref([200, 800])
const initialPriceRange = [200, 800]

const products = [
  { id: 1, name: 'Basic Headphones', price: 150 },
  { id: 2, name: 'Wireless Earbuds', price: 250 },
  { id: 3, name: 'Premium Headphones', price: 350 },
  { id: 4, name: 'Gaming Headset', price: 450 },
  { id: 5, name: 'Professional Headphones', price: 550 },
  { id: 6, name: 'Noise Cancelling Headphones', price: 650 },
  { id: 7, name: 'Studio Headphones', price: 750 },
  { id: 8, name: 'Audiophile Headphones', price: 850 },
  { id: 9, name: 'Limited Edition Headphones', price: 950 }
]

const filteredProducts = computed(() => {
  return products.filter(product => 
    product.price >= priceRange.value[0] && 
    product.price <= priceRange.value[1]
  )
})

const formatPrice = (val) => {
  return `$${val}`
}

const handlePriceChange = (value) => {
  // This function is called when the slider value changes
  console.log('Price range changed:', value)
}

const handleMinPriceChange = (value) => {
  if (value > priceRange.value[1]) {
    priceRange.value[0] = priceRange.value[1]
  }
}

const handleMaxPriceChange = (value) => {
  if (value < priceRange.value[0]) {
    priceRange.value[1] = priceRange.value[0]
  }
}

const applyFilter = () => {
  ElMessage.success(`Filter applied: ${formatPrice(priceRange.value[0])} - ${formatPrice(priceRange.value[1])}`)
}

const resetFilter = () => {
  priceRange.value = [...initialPriceRange]
  ElMessage.info('Filter has been reset')
}
</script>

<style scoped>
.price-filter {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.filter-section {
  margin-bottom: 20px;
}

.price-inputs {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.separator {
  margin: 0 10px;
}

.filter-actions {
  margin-top: 20px;
}

.filter-results {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.product-list {
  list-style: none;
  padding: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}
</style>
```

### Audio Player Volume Control

```vue
<template>
  <div class="audio-player">
    <h3>Audio Player</h3>
    
    <div class="player-controls">
      <div class="track-info">
        <h4>{{ currentTrack.title }}</h4>
        <p>{{ currentTrack.artist }}</p>
      </div>
      
      <div class="playback-controls">
        <el-button type="primary" circle @click="togglePlay">
          <el-icon>
            <component :is="isPlaying ? 'Pause' : 'VideoPlay'" />
          </el-icon>
        </el-button>
        
        <el-button circle @click="previousTrack">
          <el-icon><Back /></el-icon>
        </el-button>
        
        <el-button circle @click="nextTrack">
          <el-icon><Right /></el-icon>
        </el-button>
      </div>
      
      <div class="progress-control">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <el-slider
          v-model="currentTime"
          :min="0"
          :max="currentTrack.duration"
          :format-tooltip="formatTime"
          @change="seekTrack"
        />
        <span class="time">{{ formatTime(currentTrack.duration) }}</span>
      </div>
      
      <div class="volume-control">
        <el-icon @click="toggleMute">
          <component :is="volumeIcon" />
        </el-icon>
        <el-slider
          v-model="volume"
          :min="0"
          :max="100"
          :format-tooltip="formatVolume"
          @change="changeVolume"
        />
      </div>
    </div>
    
    <div class="playlist">
      <h4>Playlist</h4>
      <ul class="track-list">
        <li
          v-for="(track, index) in playlist"
          :key="index"
          :class="{ 'active': currentTrackIndex === index }"
          @click="selectTrack(index)"
        >
          <span class="track-title">{{ track.title }}</span>
          <span class="track-artist">{{ track.artist }}</span>
          <span class="track-duration">{{ formatTime(track.duration) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Mute, VolumeHigh, VolumeMedium, VolumeLow, VideoPlay, Pause, Back, Right } from '@element-plus/icons-vue'

const isPlaying = ref(false)
const volume = ref(60)
const isMuted = ref(false)
const previousVolume = ref(60)
const currentTime = ref(0)
const currentTrackIndex = ref(0)

const playlist = [
  { title: 'Summer Breeze', artist: 'Chill Waves', duration: 240 },
  { title: 'Mountain Echo', artist: 'Nature Sounds', duration: 180 },
  { title: 'Urban Rhythm', artist: 'City Beats', duration: 210 },
  { title: 'Ocean Waves', artist: 'Sea Sounds', duration: 300 }
]

const currentTrack = computed(() => {
  return playlist[currentTrackIndex.value]
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return Mute
  if (volume.value > 60) return VolumeHigh
  if (volume.value > 20) return VolumeMedium
  return VolumeLow
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatVolume = (val) => {
  return `${val}%`
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  ElMessage.success(`${isPlaying.value ? 'Playing' : 'Paused'}: ${currentTrack.value.title}`)
}

const previousTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.length) % playlist.length
  currentTime.value = 0
  ElMessage.info(`Playing: ${currentTrack.value.title}`)
}

const nextTrack = () => {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.length
  currentTime.value = 0
  ElMessage.info(`Playing: ${currentTrack.value.title}`)
}

const seekTrack = (value) => {
  currentTime.value = value
  ElMessage.info(`Seeking to ${formatTime(value)}`)
}

const changeVolume = (value) => {
  volume.value = value
  if (isMuted.value && value > 0) {
    isMuted.value = false
  }
  previousVolume.value = value > 0 ? value : previousVolume.value
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (isMuted.value) {
    previousVolume.value = volume.value > 0 ? volume.value : previousVolume.value
    volume.value = 0
  } else {
    volume.value = previousVolume.value
  }
  ElMessage.info(`Sound ${isMuted.value ? 'muted' : 'unmuted'}`)
}

const selectTrack = (index) => {
  currentTrackIndex.value = index
  currentTime.value = 0
  if (!isPlaying.value) {
    isPlaying.value = true
  }
  ElMessage.success(`Playing: ${currentTrack.value.title}`)
}
</script>

<style scoped>
.audio-player {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.player-controls {
  margin-bottom: 20px;
}

.track-info {
  margin-bottom: 15px;
  text-align: center;
}

.track-info h4 {
  margin: 0;
  font-size: 18px;
}

.track-info p {
  margin: 5px 0 0;
  color: #909399;
}

.playback-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.progress-control {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.progress-control .el-slider {
  margin: 0 10px;
  flex-grow: 1;
}

.time {
  font-size: 12px;
  color: #909399;
  min-width: 40px;
}

.volume-control {
  display: flex;
  align-items: center;
}

.volume-control .el-icon {
  margin-right: 10px;
  cursor: pointer;
}

.volume-control .el-slider {
  flex-grow: 1;
}

.playlist {
  margin-top: 30px;
}

.track-list {
  list-style: none;
  padding: 0;
}

.track-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.track-list li:hover {
  background-color: #f5f7fa;
}

.track-list li.active {
  background-color: #ecf5ff;
  color: #409eff;
}

.track-artist {
  color: #909399;
  margin: 0 10px;
}
</style>
```

## API Documentation

### Slider Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | number / array | 0 |
| min | minimum value | number | 0 |
| max | maximum value | number | 100 |
| disabled | whether Slider is disabled | boolean | false |
| step | step size | number | 1 |
| show-input | whether to display an input box | boolean | false |
| show-input-controls | whether to display control buttons when show-input is true | boolean | true |
| input-size | size of the input box | string | small |
| show-stops | whether to display breakpoints | boolean | false |
| show-tooltip | whether to display tooltip value | boolean | true |
| format-tooltip | format to display tooltip value | function(value) | — |
| range | whether to select a range | boolean | false |
| vertical | vertical mode | boolean | false |
| height | Slider height, required in vertical mode | string | — |
| label | label for screen reader | string | — |
| range-start-label | label for screen reader when range mode is enabled | string | — |
| range-end-label | label for screen reader when range mode is enabled | string | — |
| format | custom initial value format that will be displayed in the input box | function(value) | — |
| marks | marks, type of key must be number and must in closed interval [min, max], each mark can custom style | object | — |
| validate-event | whether to trigger form validation | boolean | true |
| placement | position of Tooltip | string | top |

### Slider Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the value changes (if the mouse is being dragged, this event only fires when the mouse is released) | Function |
| input | triggers when the data changes (It'll be emitted in real time during dragging) | Function |

### Slider Slots

| Name | Description |
|------|-------------|
| default | Customize the mark content. Parameter is { value } |

## Practice Exercises

### Exercise 1: Custom Range Slider

Create a custom range slider with colored segments:

```vue
<template>
  <div class="custom-range-slider">
    <h3>Risk Tolerance Assessment</h3>
    
    <div class="slider-container">
      <el-slider
        v-model="riskLevel"
        :min="1"
        :max="5"
        :step="1"
        :marks="riskMarks"
        :format-tooltip="formatRiskLevel"
        @change="handleRiskChange"
      />
    </div>
    
    <div class="risk-description">
      <h4>{{ getRiskTitle(riskLevel) }}</h4>
      <p>{{ getRiskDescription(riskLevel) }}</p>
    </div>
    
    <div class="recommendation">
      <h4>Recommended Portfolio:</h4>
      <div class="portfolio-allocation">
        <div 
          v-for="(allocation, asset) in getPortfolioAllocation(riskLevel)" 
          :key="asset"
          class="allocation-item"
        >
          <div class="asset-name">{{ asset }}</div>
          <div class="allocation-bar">
            <div 
              class="allocation-value" 
              :style="{ width: `${allocation}%`, backgroundColor: getAssetColor(asset) }"
            ></div>
          </div>
          <div class="allocation-percentage">{{ allocation }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const riskLevel = ref(3)

const riskMarks = {
  1: 'Very Conservative',
  2: 'Conservative',
  3: 'Moderate',
  4: 'Aggressive',
  5: 'Very Aggressive'
}

const formatRiskLevel = (val) => {
  return riskMarks[val]
}

const getRiskTitle = (level) => {
  return riskMarks[level]
}

const getRiskDescription = (level) => {
  const descriptions = {
    1: 'Focus on preserving capital with minimal risk. Suitable for short-term goals or those close to retirement.',
    2: 'Emphasis on stability with some growth potential. Suitable for medium-term goals with low risk tolerance.',
    3: 'Balance between growth and stability. Suitable for medium to long-term goals with moderate risk tolerance.',
    4: 'Focus on growth with higher volatility. Suitable for long-term goals with higher risk tolerance.',
    5: 'Maximum growth potential with significant volatility. Suitable for very long-term goals with high risk tolerance.'
  }
  return descriptions[level]
}

const getPortfolioAllocation = (level) => {
  const allocations = {
    1: { 'Bonds': 70, 'Stocks': 20, 'Cash': 10, 'Alternative': 0 },
    2: { 'Bonds': 60, 'Stocks': 30, 'Cash': 5, 'Alternative': 5 },
    3: { 'Bonds': 40, 'Stocks': 50, 'Cash': 5, 'Alternative': 5 },
    4: { 'Bonds': 20, 'Stocks': 70, 'Cash': 0, 'Alternative': 10 },
    5: { 'Bonds': 10, 'Stocks': 80, 'Cash': 0, 'Alternative': 10 }
  }
  return allocations[level]
}

const getAssetColor = (asset) => {
  const colors = {
    'Bonds': '#409EFF',
    'Stocks': '#67C23A',
    'Cash': '#E6A23C',
    'Alternative': '#F56C6C'
  }
  return colors[asset]
}

const handleRiskChange = (value) => {
  ElMessage.success(`Risk tolerance set to: ${getRiskTitle(value)}`)
}
</script>

<style scoped>
.custom-range-slider {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.slider-container {
  margin: 30px 0;
}

.risk-description {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.risk-description h4 {
  margin-top: 0;
  color: #303133;
}

.portfolio-allocation {
  margin-top: 15px;
}

.allocation-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.asset-name {
  width: 100px;
}

.allocation-bar {
  flex-grow: 1;
  height: 20px;
  background-color: #ebeef5;
  border-radius: 10px;
  overflow: hidden;
}

.allocation-value {
  height: 100%;
  border-radius: 10px;
}

.allocation-percentage {
  width: 50px;
  text-align: right;
  margin-left: 10px;
}
</style>
```

### Exercise 2: Interactive Data Filter

Create an interactive data filter using sliders:

```vue
<template>
  <div class="data-filter">
    <h3>Product Filter</h3>
    
    <div class="filter-controls">
      <div class="filter-group">
        <h4>Price Range ($)</h4>
        <el-slider
          v-model="filters.price"
          range
          :min="0"
          :max="1000"
          :step="10"
          :format-tooltip="formatPrice"
        />
        <div class="range-values">
          <span>{{ formatPrice(filters.price[0]) }}</span>
          <span>{{ formatPrice(filters.price[1]) }}</span>
        </div>
      </div>
      
      <div class="filter-group">
        <h4>Rating ({{ filters.rating }}+ stars)</h4>
        <el-slider
          v-model="filters.rating"
          :min="1"
          :max="5"
          :step="0.5"
          :format-tooltip="formatRating"
          :marks="ratingMarks"
        />
      </div>
      
      <div class="filter-group">
        <h4>Year ({{ filters.year }}+)</h4>
        <el-slider
          v-model="filters.year"
          :min="2018"
          :max="2023"
          :step="1"
        />
      </div>
      
      <div class="filter-actions">
        <el-button type="primary" @click="applyFilters">Apply Filters</el-button>
        <el-button @click="resetFilters">Reset</el-button>
      </div>
    </div>
    
    <div class="filter-results">
      <h4>Filtered Products ({{ filteredProducts.length }})</h4>
      
      <el-empty v-if="filteredProducts.length === 0" description="No products match your filters" />
      
      <div v-else class="product-grid">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-rating">
            <el-rate
              v-model="product.rating"
              disabled
              text-color="#ff9900"
            />
          </div>
          <h5>{{ product.name }}</h5>
          <div class="product-details">
            <span class="product-price">{{ formatPrice(product.price) }}</span>
            <span class="product-year">{{ product.year }}</span>
          </div>
          <p class="product-description">{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const initialFilters = {
  price: [0, 1000],
  rating: 3,
  year: 2020
}

const filters = reactive({...initialFilters})

const ratingMarks = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5'
}

const products = [
  {
    id: 1,
    name: 'Basic Laptop',
    price: 499,
    rating: 3.5,
    year: 2020,
    description: 'Entry-level laptop for everyday tasks.'
  },
  {
    id: 2,
    name: 'Pro Laptop',
    price: 899,
    rating: 4.5,
    year: 2021,
    description: 'Professional-grade laptop for demanding applications.'
  },
  {
    id: 3,
    name: 'Gaming Laptop',
    price: 1299,
    rating: 4.8,
    year: 2022,
    description: 'High-performance laptop for gaming enthusiasts.'
  },
  {
    id: 4,
    name: 'Ultrabook',
    price: 799,
    rating: 4.2,
    year: 2021,
    description: 'Thin and light laptop for professionals on the go.'
  },
  {
    id: 5,
    name: 'Budget Tablet',
    price: 299,
    rating: 3.0,
    year: 2019,
    description: 'Affordable tablet for basic web browsing and media consumption.'
  },
  {
    id: 6,
    name: 'Premium Tablet',
    price: 699,
    rating: 4.7,
    year: 2022,
    description: 'High-end tablet with powerful performance and premium display.'
  }
]

const filteredProducts = computed(() => {
  return products.filter(product => 
    product.price >= filters.price[0] &&
    product.price <= filters.price[1] &&
    product.rating >= filters.rating &&
    product.year >= filters.year
  )
})

const formatPrice = (val) => {
  return `$${val}`
}

const formatRating = (val) => {
  return `${val} stars`
}

const applyFilters = () => {
  ElMessage.success('Filters applied successfully')
}

const resetFilters = () => {
  Object.assign(filters, initialFilters)
  ElMessage.info('Filters have been reset')
}
</script>

<style scoped>
.data-filter {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.filter-controls {
  margin-bottom: 30px;
}

.filter-group {
  margin-bottom: 20px;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 14px;
  color: #606266;
}

.filter-actions {
  margin-top: 30px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  transition: all 0.3s;
}

.product-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-rating {
  margin-bottom: 10px;
}

.product-card h5 {
  margin: 0 0 10px;
  font-size: 16px;
}

.product-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.product-price {
  font-weight: bold;
  color: #409eff;
}

.product-year {
  color: #909399;
}

.product-description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #606266;
}
</style>
```

## Common Issues

### 1. Slider Value Not Updating

**Issue**: Slider value is not correctly bound or updated

**Solution**:
```vue
<!-- Ensure correct v-model binding -->
<el-slider v-model="value" />

<!-- For range sliders, ensure the value is an array -->
<el-slider v-model="rangeValue" range />

<script setup>
import { ref } from 'vue'

const value = ref(50) // Single value
const rangeValue = ref([20, 80]) // Range value must be an array
</script>
```

### 2. Step Size Issues

**Issue**: Slider steps are not working as expected

**Solution**:
```vue
<!-- Ensure step is a number and makes sense with min/max values -->
<el-slider
  v-model="value"
  :min="0"
  :max="100"
  :step="5" <!-- This will create steps at 0, 5, 10, 15, etc. -->
/>
```

### 3. Range Slider Constraints

**Issue**: Range slider values can cross or become invalid

**Solution**:
```vue
<template>
  <el-slider
    v-model="rangeValue"
    range
    :min="0"
    :max="100"
    @input="validateRange"
  />
</template>

<script setup>
import { ref } from 'vue'

const rangeValue = ref([30, 70])

const validateRange = (value) => {
  // Ensure minimum separation between handles
  const minSeparation = 10
  if (value[1] - value[0] < minSeparation) {
    // Adjust values to maintain minimum separation
    if (value[0] > rangeValue.value[0]) {
      // Moving right handle
      value[1] = value[0] + minSeparation
    } else {
      // Moving left handle
      value[0] = value[1] - minSeparation
    }
  }
}
</script>
```

## Best Practices

1. **Provide Visual Feedback**: Use marks, tooltips, and appropriate step sizes to provide clear visual feedback
2. **Appropriate Range**: Set min and max values that make sense for the data being represented
3. **Accessibility**: Ensure keyboard navigation and screen reader support
4. **Responsive Design**: Adjust slider size and orientation based on screen size
5. **Validation**: Implement validation to ensure slider values make sense in context
6. **Performance**: Be mindful of performance when using complex formatting or frequent updates
7. **User Experience**: Consider the precision needed for the task when setting step sizes

## Summary

The Slider component is a versatile input control that supports:

- Basic single value selection
- Range selection with dual handles
- Customizable steps and marks
- Vertical and horizontal orientations
- Rich formatting options for tooltips and values
- Good accessibility support

Mastering the use of the Slider component can help you build more intuitive and user-friendly interfaces for numeric input and range selection.

## References

- [Element Plus Slider Official Documentation](https://element-plus.org/en-US/component/slider.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
