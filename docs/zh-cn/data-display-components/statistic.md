# Statistic 统计组件

## 概述

Statistic 统计组件是 Element Plus 提供的一个用于展示统计数值的组件。它能够突出显示某个统计数值，支持设置数值精度、前缀、后缀等，常用于数据大屏、仪表板、统计报表等场景。

## 学习目标

通过本文档的学习，你将掌握：
- Statistic 统计组件的基本概念和使用场景
- 基础用法和数值格式化
- 前缀、后缀和自定义内容
- 数值动画和加载状态
- 实际项目中的应用示例
- 完整的 API 文档和最佳实践

## 基础用法

### 基础统计数值

最简单的统计数值展示：

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-statistic title="用户总数" :value="268500" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="账户余额" :value="268500" precision="2" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="活跃用户" :value="268500" suffix="人" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="转化率" :value="0.85" suffix="%" :precision="2" />
    </el-col>
  </el-row>
</template>
```

### 设置数值精度

通过 `precision` 属性设置数值的小数位数：

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-statistic title="精度为0" :value="268500" :precision="0" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="精度为2" :value="268500.123" :precision="2" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="精度为4" :value="268500.123456" :precision="4" />
    </el-col>
  </el-row>
</template>
```

### 前缀和后缀

使用 `prefix` 和 `suffix` 属性添加前缀和后缀：

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-statistic title="销售额" :value="268500" prefix="¥" :precision="2" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="用户数" :value="268500" suffix="人" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="增长率" :value="85.6" prefix="+" suffix="%" :precision="1" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="下载量" :value="268500" suffix="次" />
    </el-col>
  </el-row>
</template>
```

### 使用插槽自定义内容

通过插槽可以自定义标题、数值和前后缀的显示：

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
            用户总数
          </div>
        </template>
        <template #suffix>
          <span style="color: #409eff">人</span>
        </template>
      </el-statistic>
    </el-col>
    <el-col :span="12">
      <el-statistic title="销售额" :value="268500">
        <template #prefix>
          <el-icon style="color: #67c23a">
            <Money />
          </el-icon>
        </template>
        <template #suffix>
          <span style="color: #67c23a">元</span>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
</template>

<script setup>
import { User, Money } from '@element-plus/icons-vue'
</script>
```

### 数值格式化

使用 `formatter` 属性自定义数值格式化：

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-statistic 
        title="千分位格式" 
        :value="268500" 
        :formatter="(value) => value.toLocaleString()"
      />
    </el-col>
    <el-col :span="8">
      <el-statistic 
        title="文件大小" 
        :value="1024000" 
        :formatter="formatFileSize"
      />
    </el-col>
    <el-col :span="8">
      <el-statistic 
        title="时间格式" 
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

### 加载状态

通过 `loading` 属性显示加载状态：

```vue
<template>
  <div>
    <el-button @click="toggleLoading" style="margin-bottom: 20px">
      {{ loading ? '停止加载' : '开始加载' }}
    </el-button>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-statistic title="用户总数" :value="268500" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="销售额" :value="268500" prefix="¥" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="订单数" :value="1680" suffix="单" :loading="loading" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="转化率" :value="85.6" suffix="%" :loading="loading" />
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

## 实际应用示例

### 数据大屏统计面板

```vue
<template>
  <div class="dashboard">
    <h2>数据大屏统计</h2>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic 
            title="今日访问量" 
            :value="todayVisits" 
            :loading="loading"
            :formatter="(value) => value.toLocaleString()"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><View /></el-icon>
                <span>今日访问量</span>
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
            title="总销售额" 
            :value="totalSales" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Money /></el-icon>
                <span>总销售额</span>
              </div>
            </template>
            <template #prefix>
              <span class="currency">¥</span>
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
            title="新增用户" 
            :value="newUsers" 
            :loading="loading"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><UserFilled /></el-icon>
                <span>新增用户</span>
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
            title="转化率" 
            :value="conversionRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><TrendCharts /></el-icon>
                <span>转化率</span>
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
            title="服务器响应时间" 
            :value="responseTime" 
            :loading="loading"
            :formatter="formatResponseTime"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Timer /></el-icon>
                <span>服务器响应时间</span>
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic 
            title="存储使用量" 
            :value="storageUsed" 
            :loading="loading"
            :formatter="formatFileSize"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><FolderOpened /></el-icon>
                <span>存储使用量</span>
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic 
            title="在线用户" 
            :value="onlineUsers" 
            :loading="loading"
          >
            <template #title>
              <div class="stat-title">
                <el-icon><Connection /></el-icon>
                <span>在线用户</span>
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
        刷新数据
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
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 模拟数据更新
  todayVisits.value = Math.floor(Math.random() * 100000) + 50000
  totalSales.value = Math.floor(Math.random() * 1000000) + 500000
  newUsers.value = Math.floor(Math.random() * 5000) + 1000
  conversionRate.value = Math.random() * 10 + 85
  responseTime.value = Math.floor(Math.random() * 100) + 50
  storageUsed.value = Math.floor(Math.random() * 1024 * 1024 * 1024) + 1024 * 1024 * 500
  onlineUsers.value = Math.floor(Math.random() * 1000) + 200
  
  loading.value = false
}

// 初始加载数据
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

### 电商销售统计

```vue
<template>
  <div class="sales-dashboard">
    <div class="header">
      <h3>销售数据统计</h3>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleDateChange"
      />
    </div>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="总订单数" 
            :value="metrics.totalOrders" 
            :loading="loading"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Document /></el-icon>
                总订单数
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
            title="总销售额" 
            :value="metrics.totalRevenue" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Money /></el-icon>
                总销售额
              </div>
            </template>
            <template #prefix>
              <span class="currency">¥</span>
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
            title="平均客单价" 
            :value="metrics.avgOrderValue" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Wallet /></el-icon>
                平均客单价
              </div>
            </template>
            <template #prefix>
              <span class="currency">¥</span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="metric-card">
          <el-statistic 
            title="转化率" 
            :value="metrics.conversionRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><TrendCharts /></el-icon>
                转化率
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
            title="新客户数" 
            :value="metrics.newCustomers" 
            :loading="loading"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><UserFilled /></el-icon>
                新客户数
              </div>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="metric-card">
          <el-statistic 
            title="退款率" 
            :value="metrics.refundRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><RefreshLeft /></el-icon>
                退款率
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
            title="复购率" 
            :value="metrics.repeatPurchaseRate" 
            :loading="loading"
            :precision="2"
          >
            <template #title>
              <div class="metric-title">
                <el-icon><Refresh /></el-icon>
                复购率
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
  
  // 模拟 API 请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟数据
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
  console.log('日期范围变更:', dates)
  loadMetrics()
}

onMounted(() => {
  // 设置默认日期范围（最近30天）
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

## API 文档

### Statistic Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| value | 数值内容 | `number` | `0` |
| decimal-separator | 设置小数点 | `string` | `.` |
| formatter | 自定义数值展示 | `function` | — |
| group-separator | 设置千分位标识符 | `string` | `,` |
| precision | 数值精度 | `number` | `0` |
| prefix | 设置数值的前缀 | `string` | — |
| suffix | 设置数值的后缀 | `string` | — |
| title | 数值的标题 | `string` | — |
| value-style | 设置数值的样式 | `object` | — |
| loading | 数值是否加载中 | `boolean` | `false` |

### Statistic Slots

| 插槽名 | 说明 |
|--------|------|
| title | 标题内容 |
| prefix | 数值前缀 |
| suffix | 数值后缀 |
| formatter | 数值内容 |

## 最佳实践

### 设计原则

1. **数据突出**：统计数值应该是页面的视觉焦点
2. **信息层次**：合理使用标题、数值、前后缀建立信息层次
3. **一致性**：同一页面的统计组件应保持样式一致

### 数值格式化

1. **精度控制**：根据数据类型选择合适的小数位数
2. **千分位分隔**：大数值使用千分位分隔提高可读性
3. **单位标识**：明确标注数值单位，避免歧义

### 用户体验

1. **加载状态**：数据加载时显示骨架屏或加载动画
2. **趋势指示**：通过颜色和图标显示数据趋势
3. **交互反馈**：提供数据刷新和时间范围选择功能

### 响应式设计

1. **移动端适配**：在小屏幕上调整字体大小和布局
2. **弹性布局**：使用栅格系统确保不同屏幕下的表现
3. **内容优先**：在空间有限时优先显示重要指标

## 常见问题

### 数值不显示

**问题**：设置了 `value` 但数值不显示

**解决方案**：
1. 检查 `value` 是否为有效数字
2. 确认是否有自定义 `formatter` 返回了空值
3. 检查 CSS 样式是否影响显示

```vue
<!-- 错误示例 -->
<el-statistic :value="undefined" />
<el-statistic :value="'abc'" />

<!-- 正确示例 -->
<el-statistic :value="0" />
<el-statistic :value="123.45" />
```

### 格式化函数不生效

**问题**：设置了 `formatter` 但格式化不生效

**解决方案**：确保 `formatter` 函数返回字符串或数字

```vue
<!-- 错误示例 -->
<el-statistic 
  :value="1234" 
  :formatter="(value) => { console.log(value) }"
/>

<!-- 正确示例 -->
<el-statistic 
  :value="1234" 
  :formatter="(value) => value.toLocaleString()"
/>
```

### 精度设置无效

**问题**：设置了 `precision` 但小数位数不正确

**解决方案**：
1. 确保 `precision` 为非负整数
2. 检查是否同时使用了 `formatter`（formatter 优先级更高）

```vue
<!-- precision 会被 formatter 覆盖 -->
<el-statistic 
  :value="123.456" 
  :precision="2"
  :formatter="(value) => Math.floor(value)"
/>

<!-- 正确使用 precision -->
<el-statistic 
  :value="123.456" 
  :precision="2"
/>
```

### 样式自定义问题

**问题**：无法修改统计组件的样式

**解决方案**：使用 `value-style` 属性或深度选择器

```vue
<template>
  <!-- 使用 value-style -->
  <el-statistic 
    :value="123" 
    :value-style="{ color: '#f56c6c', fontSize: '24px' }"
  />
  
  <!-- 使用 CSS 深度选择器 -->
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

## 总结

Statistic 统计组件是展示关键数据指标的重要工具，能够有效突出重要数值信息。通过本文档的学习，你应该能够：

1. 理解统计组件的设计理念和使用场景
2. 掌握基础用法和数值格式化
3. 实现自定义前缀、后缀和样式
4. 合理使用加载状态和交互功能
5. 在实际项目中构建专业的数据展示界面

在实际开发中，建议根据业务需求选择合适的数值格式和展示样式，注意数据的准确性和实时性，确保统计组件能够真正帮助用户理解和分析数据。

## 参考资料

- [Element Plus Statistic 官方文档](https://element-plus.org/zh-CN/component/statistic.html)
- [数据可视化设计指南](https://www.interaction-design.org/literature/topics/data-visualization)
- [仪表板设计最佳实践](https://www.klipfolio.com/resources/articles/what-is-a-dashboard)