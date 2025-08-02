# Statistic

## Overview

The Statistic component provided by Element Plus is used to display statistical values. It can highlight specific statistical values, supports setting value precision, prefixes, suffixes, and is commonly used in data dashboards, control panels, statistical reports, and other scenarios.

## Learning Objectives

Through this documentation, you will master:
- Basic concepts and usage scenarios of the Statistic component
- Basic usage and value formatting
- Prefixes, suffixes, and custom content
- Value animation and loading states
- Application examples in actual projects
- Complete API documentation and best practices

## Basic Usage

### Basic Statistical Values

The simplest statistical value display:

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-statistic title="Total Users" :value="268500" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Account Balance" :value="268500" precision="2" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Active Users" :value="268500" suffix="people" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Conversion Rate" :value="0.85" suffix="%" :precision="2" />
    </el-col>
  </el-row>
</template>
```

### Setting Value Precision

Set the number of decimal places using the `precision` attribute:

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-statistic title="Precision 0" :value="268500" :precision="0" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="Precision 2" :value="268500.123" :precision="2" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="Precision 4" :value="268500.123456" :precision="4" />
    </el-col>
  </el-row>
</template>
```

### Prefixes and Suffixes

Add prefixes and suffixes using the `prefix` and `suffix` attributes:

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-statistic title="Sales" :value="268500" prefix="$" :precision="2" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Users" :value="268500" suffix="people" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Growth Rate" :value="85.6" prefix="+" suffix="%" :precision="1" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Downloads" :value="268500" suffix="times" />
    </el-col>
  </el-row>
</template>
```

### Using Slots for Custom Content

Customize the display of titles, values, and prefixes/suffixes through slots:

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-statistic :value="268500">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            <el-icon style="margin-right: 4px">
              <User />
            </el-icon>
            Total Users
          </div>
        </template>
        <template #suffix>
          <span style="color: #409eff">people</span>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="12">
      <el-statistic title="Sales" :value="268500">
        <template #prefix>
          <el-icon style="color: #67c23a">
            <Money />
          </el-icon>
        </template>
        <template #suffix>
          <span style="color: #67c23a">dollars</span>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
</template>

<script setup>
import { User, Money } from '@element-plus/icons-vue'
</script>
```

### Value Formatting

Use the `formatter` attribute to customize value formatting:

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-statistic 
        title="Thousands Format" 
        :value="268500" 
        :formatter="(value) => value.toLocaleString()"
      />
    </el-col>
    <el-col :span="8">
      <el-statistic 
        title="File Size" 
        :value="1024000" 
        :formatter="formatFileSize"
      />
    </el-col>
    <el-col :span="8">
      <el-statistic 
        title="Time Format" 
        :value="3661" 
        :formatter="formatTime"
      />
    </el-col>
  </el-row>
</template>

<script setup>
const formatFileSize = (value) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = value
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const formatTime = (value) => {
  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = value % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
</script>
```

### Loading State

Display loading state using the `loading` attribute:

```vue
<template>
  <div>
    <el-button @click="toggleLoading" style="margin-bottom: 20px">
      {{ loading ? 'Stop Loading' : 'Start Loading' }}
    </el-button>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="Total Users" :value="268500" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Sales" :value="268500" prefix="$" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Orders" :value="1680" suffix="orders" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="Conversion Rate" :value="85.6" suffix="%" :loading="loading" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value
}
</script>
```

## Practical Application Examples

### Data Dashboard Statistics Panel

```vue
<template>
  <div class="dashboard">
    <h2>Data Dashboard Statistics</h2>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic 
            title="Today's Visits" 
            :value="todayVisits" 
            :loading="loading"
            :formatter="(value) => value.toLocaleString()"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><View /></el-icon>
                <span>Today's Visits</span>
              </div>
            </template>
            <template #suffix>
              <span class="trend-up">↗ +12.5%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic 
            title="Total Sales" 
            :value="totalSales" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Money /></el-icon>
                <span>Total Sales</span>
              </div>
            </template>
            <template #prefix>
              <span class="currency">$</span>
            </template>
            <template #suffix>
              <span class="trend-up">↗ +8.3%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic 
            title="New Users" 
            :value="newUsers" 
            :loading="loading"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><UserFilled /></el-icon>
                <span>New Users</span>
              </div>
            </template>
            <template #suffix>
              <span class="trend-down">↘ -2.1%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic 
            title="Conversion Rate" 
            :value="conversionRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><TrendCharts /></el-icon>
                <span>Conversion Rate</span>
              </div>
            </template>
            <template #suffix>
              <span>%</span>
              <span class="trend-up">↗ +1.2%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic 
            title="Server Response Time" 
            :value="responseTime" 
            :loading="loading"
            :formatter="formatResponseTime"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Timer /></el-icon>
                <span>Server Response Time</span>
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic 
            title="Storage Used" 
            :value="storageUsed" 
            :loading="loading"
            :formatter="formatFileSize"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><FolderOpened /></el-icon>
                <span>Storage Used</span>
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic 
            title="Online Users" 
            :value="onlineUsers" 
            :loading="loading"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Connection /></el-icon>
                <span>Online Users</span>
              </div>
            </template>
            <template #suffix>
              <span class="online-indicator">●</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="refresh-btn">
      <el-button type="primary" @click="refreshData" :loading="loading">
        Refresh Data
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  View, Money, UserFilled, TrendCharts, 
  Timer, FolderOpened, Connection 
} from '@element-plus/icons-vue'

const loading = ref(false)
const todayVisits = ref(0)
const totalSales = ref(0)
const newUsers = ref(0)
const conversionRate = ref(0)
const responseTime = ref(0)
const storageUsed = ref(0)
const onlineUsers = ref(0)

const formatResponseTime = (value) => {
  return `${value} ms`
}

const formatFileSize = (value) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = value
  let unitIndex = 0
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

const refreshData = async () => {
  loading.value = true
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Simulate data update
  todayVisits.value = Math.floor(Math.random() * 100000) + 50000
  totalSales.value = Math.floor(Math.random() * 1000000) + 500000
  newUsers.value = Math.floor(Math.random() * 5000) + 1000
  conversionRate.value = Math.random() * 10 + 85
  responseTime.value = Math.floor(Math.random() * 100) + 50
  storageUsed.value = Math.floor(Math.random() * 1024 * 1024 * 1024) + 1024 * 1024 * 500
  onlineUsers.value = Math.floor(Math.random() * 1000) + 200
  
  loading.value = false
}

// Initial data loading
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.dashboard h2 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-weight: 500;
}

.stat-title .el-icon {
  font-size: 18px;
  color: #409eff;
}

.currency {
  color: #67c23a;
  font-weight: bold;
}

.trend-up {
  color: #67c23a;
  font-size: 12px;
  margin-left: 8px;
}

.trend-down {
  color: #f56c6c;
  font-size: 12px;
  margin-left: 8px;
}

.online-indicator {
  color: #67c23a;
  font-size: 8px;
  margin-left: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.refresh-btn {
  text-align: center;
  margin-top: 30px;
}

:deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

:deep(.el-statistic__head) {
  margin-bottom: 12px;
}
</style>
```

### E-commerce Sales Statistics

```vue
<template>
  <div class="sales-dashboard">
    <div class="header">
      <h3>Sales Data Statistics</h3>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="to"
        start-placeholder="Start date"
        end-placeholder="End date"
        @change="handleDateChange"
      />
    </div>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="Total Orders" 
            :value="metrics.totalOrders" 
            :loading="loading"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Document /></el-icon>
                Total Orders
              </div>
            </template>
            <template #suffix>
              <el-tag :type="metrics.ordersGrowth >= 0 ? 'success' : 'danger'" size="small">
                {{ metrics.ordersGrowth >= 0 ? '+' : '' }}{{ metrics.ordersGrowth }}%
              </el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="Total Revenue" 
            :value="metrics.totalRevenue" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Money /></el-icon>
                Total Revenue
              </div>
            </template>
            <template #prefix>
              <span class="currency">$</span>
            </template>
            <template #suffix>
              <el-tag :type="metrics.revenueGrowth >= 0 ? 'success' : 'danger'" size="small">
                {{ metrics.revenueGrowth >= 0 ? '+' : '' }}{{ metrics.revenueGrowth }}%
              </el-tag>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="Average Order Value" 
            :value="metrics.avgOrderValue" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Wallet /></el-icon>
                Average Order Value
              </div>
            </template>
            <template #prefix>
              <span class="currency">$</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="Conversion Rate" 
            :value="metrics.conversionRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><TrendCharts /></el-icon>
                Conversion Rate
              </div>
            </template>
            <template #suffix>
              <span>%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card class="metric-card">
          <el-statistic 
            title="New Customers" 
            :value="metrics.newCustomers" 
            :loading="loading"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><UserFilled /></el-icon>
                New Customers
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="metric-card">
          <el-statistic 
            title="Refund Rate" 
            :value="metrics.refundRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><RefreshLeft /></el-icon>
                Refund Rate
              </div>
            </template>
            <template #suffix>
              <span>%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="metric-card">
          <el-statistic 
            title="Repeat Purchase Rate" 
            :value="metrics.repeatPurchaseRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Refresh /></el-icon>
                Repeat Purchase Rate
              </div>
            </template>
            <template #suffix>
              <span>%</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  Document, Money, Wallet, TrendCharts, 
  UserFilled, RefreshLeft, Refresh 
} from '@element-plus/icons-vue'

const loading = ref(false)
const dateRange = ref([])

const metrics = reactive({
  totalOrders: 0,
  totalRevenue: 0,
  avgOrderValue: 0,
  conversionRate: 0,
  newCustomers: 0,
  refundRate: 0,
  repeatPurchaseRate: 0,
  ordersGrowth: 0,
  revenueGrowth: 0
})

const loadMetrics = async () => {
  loading.value = true
  
  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate data
  metrics.totalOrders = Math.floor(Math.random() * 10000) + 5000
  metrics.totalRevenue = Math.floor(Math.random() * 1000000) + 500000
  metrics.avgOrderValue = metrics.totalRevenue / metrics.totalOrders
  metrics.conversionRate = Math.random() * 5 + 2
  metrics.newCustomers = Math.floor(Math.random() * 1000) + 200
  metrics.refundRate = Math.random() * 3 + 1
  metrics.repeatPurchaseRate = Math.random() * 30 + 20
  metrics.ordersGrowth = Math.random() * 20 - 5
  metrics.revenueGrowth = Math.random() * 25 - 5
  
  loading.value = false
}

const handleDateChange = (dates) => {
  console.log('Date range changed:', dates)
  loadMetrics()
}

onMounted(() => {
  // Set default date range (last 30 days)
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  dateRange.value = [start, end]
  
  loadMetrics()
})
</script>

<style scoped>
.sales-dashboard {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h3 {
  margin: 0;
  color: #303133;
}

.metric-card {
  height: 120px;
  display: flex;
  align-items: center;
}

.metric-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
}

.metric-title .el-icon {
  font-size: 16px;
  color: #409eff;
}

.currency {
  color: #67c23a;
  font-weight: bold;
}

:deep(.el-statistic__content) {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

:deep(.el-statistic__head) {
  margin-bottom: 8px;
}
</style>
```

## API Documentation

### Statistic Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| value | Value content | `number` | `0` |
| decimal-separator | Decimal separator | `string` | `.` |
| formatter | Custom value display | `function` | — |
| group-separator | Thousands separator | `string` | `,` |
| precision | Value precision | `number` | `0` |
| prefix | Value prefix | `string` | — |
| suffix | Value suffix | `string` | — |
| title | Value title | `string` | — |
| value-style | Value style | `object` | — |
| loading | Whether the value is loading | `boolean` | `false` |

### Statistic Slots

| Slot Name | Description |
|-----------|-------------|
| title | Title content |
| prefix | Value prefix |
| suffix | Value suffix |
| formatter | Value content |

## Best Practices

### Design Principles

1. **Data Highlighting**: Statistical values should be the visual focus of the page
2. **Information Hierarchy**: Reasonably use titles, values, and prefixes/suffixes to establish information hierarchy
3. **Consistency**: Statistics components on the same page should maintain consistent styles

### Value Formatting

1. **Precision Control**: Choose appropriate decimal places based on data type
2. **Thousands Separator**: Use thousands separators for large values to improve readability
3. **Unit Identification**: Clearly label value units to avoid ambiguity

### User Experience

1. **Loading State**: Display skeleton screens or loading animations when data is loading
2. **Trend Indication**: Show data trends through colors and icons
3. **Interactive Feedback**: Provide data refresh and time range selection functionality

### Responsive Design

1. **Mobile Adaptation**: Adjust font sizes and layouts on small screens
2. **Flexible Layout**: Use grid systems to ensure performance on different screens
3. **Content Priority**: Prioritize displaying important metrics when space is limited

## Common Issues

### Value Not Displaying

**Issue**: Set `value` but the value is not displayed

**Solutions**:
1. Check if `value` is a valid number
2. Confirm if a custom `formatter` is returning an empty value
3. Check if CSS styles are affecting the display

```vue
<!-- Incorrect examples -->
<el-statistic :value="undefined" />
<el-statistic :value="'abc'" />

<!-- Correct examples -->
<el-statistic :value="0" />
<el-statistic :value="123.45" />
```

### Formatter Function Not Working

**Issue**: Set `formatter` but formatting is not working

**Solution**: Ensure the `formatter` function returns a string or number

```vue
<!-- Incorrect example -->
<el-statistic 
  :value="1234" 
  :formatter="(value) => { console.log(value) }"
/>

<!-- Correct example -->
<el-statistic 
  :value="1234" 
  :formatter="(value) => value.toLocaleString()"
/>
```

### Precision Setting Invalid

**Issue**: Set `precision` but decimal places are incorrect

**Solutions**:
1. Ensure `precision` is a non-negative integer
2. Check if `formatter` is also being used (formatter has higher priority)

```vue
<!-- precision will be overridden by formatter -->
<el-statistic 
  :value="123.456" 
  :precision="2"
  :formatter="(value) => Math.floor(value)"
/>

<!-- Correct use of precision -->
<el-statistic 
  :value="123.456" 
  :precision="2"
/>
```

### Style Customization Issues

**Issue**: Cannot modify the style of the statistics component

**Solution**: Use the `value-style` attribute or deep selectors

```vue
<template>
  <!-- Using value-style -->
  <el-statistic 
    :value="123" 
    :value-style="{ color: '#f56c6c', fontSize: '24px' }"
  />
  
  <!-- Using CSS deep selectors -->
  <el-statistic :value="123" class="custom-statistic" />
</template>

<style scoped>
.custom-statistic :deep(.el-statistic__content) {
  color: #67c23a;
  font-size: 28px;
  font-weight: bold;
}
</style>
```

## Summary

The Statistic component is an important tool for displaying key data metrics, effectively highlighting important numerical information. Through this documentation, you should be able to:

1. Understand the design philosophy and usage scenarios of the statistics component
2. Master basic usage and value formatting
3. Implement custom prefixes, suffixes, and styles
4. Properly use loading states and interactive features
5. Build professional data display interfaces in actual projects

In actual development, it is recommended to choose appropriate value formats and display styles based on business requirements, pay attention to data accuracy and real-time performance, and ensure that the statistics component can truly help users understand and analyze data.

## References

- [Element Plus Statistic Official Documentation](https://element-plus.org/en-US/component/statistic.html)
- [Data Visualization Design Guide](https://www.interaction-design.org/literature/topics/data-visualization)
- [Dashboard Design Best Practices](https://www.klipfolio.com/resources/articles/what-is-a-dashboard)