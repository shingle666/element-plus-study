# Date Picker 日期选择器

## 概述

Date Picker 日期选择器是一个用于选择日期的组件，支持多种日期选择模式，包括单日期、日期范围、月份、年份等选择方式。它提供了丰富的配置选项和自定义功能，能够满足各种日期选择需求。

## 学习目标

- 掌握 Date Picker 的基本概念和使用场景
- 学会基础日期选择功能的实现
- 了解日期范围选择和多日期选择
- 掌握日期格式化和国际化
- 学会禁用日期和快捷选项配置
- 了解自定义日期单元格渲染
- 掌握日期选择器在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基本日期选择

最简单的日期选择器：

```vue
<template>
  <div>
    <h4>基本日期选择</h4>
    <el-date-picker
      v-model="date1"
      type="date"
      placeholder="选择日期"
    />
    <p>选中的日期：{{ date1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date1 = ref('')
</script>
```

### 带快捷选项

提供常用的日期快捷选项：

```vue
<template>
  <div>
    <h4>带快捷选项</h4>
    <el-date-picker
      v-model="date2"
      type="date"
      placeholder="选择日期"
      :shortcuts="shortcuts"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date2 = ref('')

const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
</script>
```

### 日期范围选择

选择一个日期范围：

```vue
<template>
  <div>
    <h4>日期范围选择</h4>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :shortcuts="rangeShortcuts"
    />
    <p>选中的日期范围：{{ dateRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref('')

const rangeShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
</script>
```

### 月份和年份选择

选择月份或年份：

```vue
<template>
  <div>
    <h4>月份选择器</h4>
    <el-date-picker
      v-model="month"
      type="month"
      placeholder="选择月份"
    />
    <p>选中的月份：{{ month }}</p>
    
    <h4>年份选择器</h4>
    <el-date-picker
      v-model="year"
      type="year"
      placeholder="选择年份"
    />
    <p>选中的年份：{{ year }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const month = ref('')
const year = ref('')
</script>
```

### 多个日期选择

选择多个不连续的日期：

```vue
<template>
  <div>
    <h4>多个日期选择</h4>
    <el-date-picker
      v-model="dates"
      type="dates"
      placeholder="选择多个日期"
    />
    <p>选中的日期：{{ dates }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dates = ref([])
</script>
```

## 高级功能

### 禁用日期

禁用特定的日期：

```vue
<template>
  <div>
    <h4>禁用日期</h4>
    <el-date-picker
      v-model="date3"
      type="date"
      placeholder="选择日期"
      :disabled-date="disabledDate"
    />
    <p>只能选择今天之后的日期</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date3 = ref('')

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7
}
</script>
```

### 日期格式化

自定义日期显示格式：

```vue
<template>
  <div>
    <h4>日期格式化</h4>
    <el-date-picker
      v-model="date4"
      type="date"
      placeholder="选择日期"
      format="YYYY年MM月DD日"
      value-format="YYYY-MM-DD"
    />
    <p>格式化后的日期：{{ date4 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date4 = ref('')
</script>
```

### 自定义日期单元格

自定义日期单元格的内容：

```vue
<template>
  <div>
    <h4>自定义日期单元格</h4>
    <el-date-picker
      v-model="date5"
      type="date"
      placeholder="选择日期"
    >
      <template #default="{ cell }">
        <div class="custom-cell">
          <span class="date-text">{{ cell.text }}</span>
          <span v-if="isSpecialDate(cell.date)" class="special-mark">特</span>
        </div>
      </template>
    </el-date-picker>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date5 = ref('')

const isSpecialDate = (date) => {
  // 标记每月的15号为特殊日期
  return date.getDate() === 15
}
</script>

<style scoped>
.custom-cell {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.special-mark {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #f56c6c;
  color: white;
  font-size: 10px;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

### 不同尺寸

提供不同尺寸的日期选择器：

```vue
<template>
  <div>
    <h4>不同尺寸</h4>
    <div class="size-demo">
      <el-date-picker
        v-model="date6"
        type="date"
        placeholder="大尺寸"
        size="large"
      />
      <el-date-picker
        v-model="date7"
        type="date"
        placeholder="默认尺寸"
      />
      <el-date-picker
        v-model="date8"
        type="date"
        placeholder="小尺寸"
        size="small"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date6 = ref('')
const date7 = ref('')
const date8 = ref('')
</script>

<style scoped>
.size-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
```

## 实际应用示例

### 预约系统日期选择

创建一个预约系统的日期选择组件：

```vue
<template>
  <div class="appointment-date-picker">
    <h3>预约系统</h3>
    
    <div class="appointment-form">
      <div class="form-item">
        <label>选择预约日期：</label>
        <el-date-picker
          v-model="appointmentDate"
          type="date"
          placeholder="请选择预约日期"
          :disabled-date="disabledAppointmentDate"
          :shortcuts="appointmentShortcuts"
          @change="handleDateChange"
        />
      </div>
      
      <div v-if="appointmentDate" class="available-slots">
        <h4>可预约时间段</h4>
        <div class="time-slots">
          <el-button
            v-for="slot in availableTimeSlots"
            :key="slot.id"
            :type="selectedSlot?.id === slot.id ? 'primary' : 'default'"
            :disabled="!slot.available"
            size="small"
            @click="selectTimeSlot(slot)"
          >
            {{ slot.time }}
            <span v-if="!slot.available" class="unavailable">(已约满)</span>
          </el-button>
        </div>
      </div>
      
      <div v-if="selectedSlot" class="appointment-summary">
        <h4>预约信息</h4>
        <div class="summary-item">
          <span class="label">预约日期：</span>
          <span class="value">{{ formatDate(appointmentDate) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">预约时间：</span>
          <span class="value">{{ selectedSlot.time }}</span>
        </div>
        <div class="summary-item">
          <span class="label">服务类型：</span>
          <el-select v-model="serviceType" placeholder="请选择服务类型">
            <el-option
              v-for="service in services"
              :key="service.id"
              :label="service.name"
              :value="service.id"
            />
          </el-select>
        </div>
        
        <div class="action-buttons">
          <el-button type="primary" @click="confirmAppointment">确认预约</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </div>
    
    <div v-if="appointments.length > 0" class="appointment-history">
      <h4>预约历史</h4>
      <div class="history-list">
        <div
          v-for="appointment in appointments"
          :key="appointment.id"
          class="history-item"
        >
          <div class="appointment-info">
            <span class="date">{{ formatDate(appointment.date) }}</span>
            <span class="time">{{ appointment.time }}</span>
            <span class="service">{{ getServiceName(appointment.serviceType) }}</span>
          </div>
          <div class="appointment-status">
            <el-tag
              :type="getStatusType(appointment.status)"
              size="small"
            >
              {{ appointment.status }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const appointmentDate = ref('')
const selectedSlot = ref(null)
const serviceType = ref('')
const appointments = ref([
  {
    id: 1,
    date: new Date('2024-01-15'),
    time: '09:00-10:00',
    serviceType: 1,
    status: '已确认'
  },
  {
    id: 2,
    date: new Date('2024-01-20'),
    time: '14:00-15:00',
    serviceType: 2,
    status: '已完成'
  }
])

const services = ref([
  { id: 1, name: '常规检查', duration: 60 },
  { id: 2, name: '专家咨询', duration: 90 },
  { id: 3, name: '健康体检', duration: 120 }
])

const appointmentShortcuts = [
  {
    text: '明天',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: '一周后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    },
  },
  {
    text: '一个月后',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
      return date
    },
  },
]

const availableTimeSlots = computed(() => {
  if (!appointmentDate.value) return []
  
  // 模拟时间段数据
  const slots = [
    { id: 1, time: '09:00-10:00', available: true },
    { id: 2, time: '10:00-11:00', available: true },
    { id: 3, time: '11:00-12:00', available: false },
    { id: 4, time: '14:00-15:00', available: true },
    { id: 5, time: '15:00-16:00', available: true },
    { id: 6, time: '16:00-17:00', available: false },
  ]
  
  // 根据选择的日期动态调整可用性
  const selectedDate = new Date(appointmentDate.value)
  const dayOfWeek = selectedDate.getDay()
  
  // 周末只开放下午时段
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return slots.filter(slot => slot.id >= 4)
  }
  
  return slots
})

const disabledAppointmentDate = (time) => {
  // 禁用过去的日期和周日
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return time.getTime() < today.getTime() || time.getDay() === 0
}

const handleDateChange = (date) => {
  selectedSlot.value = null
  serviceType.value = ''
}

const selectTimeSlot = (slot) => {
  if (slot.available) {
    selectedSlot.value = slot
  }
}

const confirmAppointment = () => {
  if (!appointmentDate.value || !selectedSlot.value || !serviceType.value) {
    ElMessage.warning('请完善预约信息')
    return
  }
  
  const newAppointment = {
    id: Date.now(),
    date: new Date(appointmentDate.value),
    time: selectedSlot.value.time,
    serviceType: serviceType.value,
    status: '已确认'
  }
  
  appointments.value.unshift(newAppointment)
  ElMessage.success('预约成功！')
  resetForm()
}

const resetForm = () => {
  appointmentDate.value = ''
  selectedSlot.value = null
  serviceType.value = ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getServiceName = (serviceId) => {
  const service = services.value.find(s => s.id === serviceId)
  return service ? service.name : '未知服务'
}

const getStatusType = (status) => {
  const statusMap = {
    '已确认': 'warning',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.appointment-date-picker {
  max-width: 800px;
  padding: 20px;
}

.appointment-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.available-slots {
  margin-top: 20px;
}

.available-slots h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.unavailable {
  color: #909399;
  font-size: 12px;
}

.appointment-summary {
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.appointment-summary h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.summary-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.summary-item .label {
  width: 100px;
  color: #606266;
  font-weight: 500;
}

.summary-item .value {
  color: #303133;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.appointment-history {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.appointment-history h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.appointment-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.appointment-info .date {
  font-weight: 500;
  color: #303133;
}

.appointment-info .time {
  color: #409EFF;
  font-size: 14px;
}

.appointment-info .service {
  color: #606266;
  font-size: 14px;
}
</style>
```

### 数据统计日期筛选

创建一个数据统计的日期筛选组件：

```vue
<template>
  <div class="data-filter">
    <h3>数据统计</h3>
    
    <div class="filter-controls">
      <div class="filter-item">
        <label>统计类型：</label>
        <el-radio-group v-model="statisticsType" @change="handleTypeChange">
          <el-radio label="daily">日统计</el-radio>
          <el-radio label="weekly">周统计</el-radio>
          <el-radio label="monthly">月统计</el-radio>
          <el-radio label="yearly">年统计</el-radio>
        </el-radio-group>
      </div>
      
      <div class="filter-item">
        <label>选择时间范围：</label>
        <el-date-picker
          v-if="statisticsType === 'daily'"
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dailyShortcuts"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'weekly'"
          v-model="weekRange"
          type="week"
          placeholder="选择周"
          format="YYYY 第 ww 周"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'monthly'"
          v-model="monthRange"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'yearly'"
          v-model="yearRange"
          type="year"
          placeholder="选择年份"
          @change="handleDateChange"
        />
      </div>
      
      <div class="filter-item">
        <el-button type="primary" @click="generateReport">生成报表</el-button>
        <el-button @click="exportData">导出数据</el-button>
      </div>
    </div>
    
    <div v-if="statisticsData" class="statistics-result">
      <h4>统计结果</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">总访问量</div>
          <div class="stat-value">{{ statisticsData.totalVisits }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.visitChange > 0 }">
            {{ statisticsData.visitChange > 0 ? '+' : '' }}{{ statisticsData.visitChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">新用户数</div>
          <div class="stat-value">{{ statisticsData.newUsers }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.userChange > 0 }">
            {{ statisticsData.userChange > 0 ? '+' : '' }}{{ statisticsData.userChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">转化率</div>
          <div class="stat-value">{{ statisticsData.conversionRate }}%</div>
          <div class="stat-change" :class="{ positive: statisticsData.conversionChange > 0 }">
            {{ statisticsData.conversionChange > 0 ? '+' : '' }}{{ statisticsData.conversionChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">收入</div>
          <div class="stat-value">¥{{ statisticsData.revenue.toLocaleString() }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.revenueChange > 0 }">
            {{ statisticsData.revenueChange > 0 ? '+' : '' }}{{ statisticsData.revenueChange }}%
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>图表区域 - 这里可以集成 ECharts 或其他图表库</p>
          <p>时间范围：{{ formatTimeRange() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const statisticsType = ref('daily')
const dateRange = ref('')
const weekRange = ref('')
const monthRange = ref('')
const yearRange = ref('')
const statisticsData = ref(null)

const dailyShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const handleTypeChange = () => {
  // 清空之前的选择
  dateRange.value = ''
  weekRange.value = ''
  monthRange.value = ''
  yearRange.value = ''
  statisticsData.value = null
}

const handleDateChange = () => {
  // 自动生成报表
  generateReport()
}

const generateReport = () => {
  const hasValidDate = 
    (statisticsType.value === 'daily' && dateRange.value) ||
    (statisticsType.value === 'weekly' && weekRange.value) ||
    (statisticsType.value === 'monthly' && monthRange.value) ||
    (statisticsType.value === 'yearly' && yearRange.value)
  
  if (!hasValidDate) {
    ElMessage.warning('请选择时间范围')
    return
  }
  
  // 模拟生成统计数据
  statisticsData.value = {
    totalVisits: Math.floor(Math.random() * 100000) + 50000,
    visitChange: Math.floor(Math.random() * 40) - 20,
    newUsers: Math.floor(Math.random() * 5000) + 1000,
    userChange: Math.floor(Math.random() * 30) - 15,
    conversionRate: (Math.random() * 10 + 5).toFixed(2),
    conversionChange: Math.floor(Math.random() * 20) - 10,
    revenue: Math.floor(Math.random() * 1000000) + 100000,
    revenueChange: Math.floor(Math.random() * 50) - 25
  }
  
  ElMessage.success('报表生成成功')
}

const exportData = () => {
  if (!statisticsData.value) {
    ElMessage.warning('请先生成报表')
    return
  }
  
  // 模拟导出功能
  ElMessage.success('数据导出成功')
}

const formatTimeRange = () => {
  switch (statisticsType.value) {
    case 'daily':
      if (dateRange.value && dateRange.value.length === 2) {
        return `${formatDate(dateRange.value[0])} 至 ${formatDate(dateRange.value[1])}`
      }
      break
    case 'weekly':
      if (weekRange.value) {
        return formatDate(weekRange.value)
      }
      break
    case 'monthly':
      if (monthRange.value && monthRange.value.length === 2) {
        return `${formatMonth(monthRange.value[0])} 至 ${formatMonth(monthRange.value[1])}`
      }
      break
    case 'yearly':
      if (yearRange.value) {
        return `${yearRange.value.getFullYear()}年`
      }
      break
  }
  return '未选择'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatMonth = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit'
  })
}
</script>

<style scoped>
.data-filter {
  max-width: 1000px;
  padding: 20px;
}

.filter-controls {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.filter-item {
  margin-bottom: 20px;
}

.filter-item:last-child {
  margin-bottom: 0;
}

.filter-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.statistics-result {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.statistics-result h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #212529;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  color: #dc3545;
}

.stat-change.positive {
  color: #28a745;
}

.chart-container {
  margin-top: 24px;
}

.chart-placeholder {
  height: 300px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}
</style>
```

## API 文档

### DatePicker Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | Date / Array | — |
| readonly | 只读 | boolean | false |
| disabled | 禁用 | boolean | false |
| size | 输入框尺寸 | enum | default |
| editable | 文本框可输入 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | true |
| placeholder | 非范围选择时的占位内容 | string | — |
| start-placeholder | 范围选择时开始日期的占位内容 | string | — |
| end-placeholder | 范围选择时结束日期的占位内容 | string | — |
| type | 显示类型 | enum | date |
| format | 显示在输入框中的格式 | string | YYYY-MM-DD |
| value-format | 绑定值的格式 | string | — |
| popper-class | DatePicker 下拉框的类名 | string | — |
| range-separator | 选择范围时的分隔符 | string | '-' |
| default-value | 可选，选择器打开时默认显示的时间 | Date / Array | — |
| default-time | 范围选择时选中日期所使用的当日内具体时刻 | Date / Array | — |
| disabled-date | 设置禁用状态，参数为当前日期 | Function | — |
| shortcuts | 设置快捷选项 | Array | — |
| cell-class-name | 设置日期的 className | Function | — |
| teleported | 是否将 picker 的下拉列表插入至 body 元素 | boolean | true |

### DatePicker Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 用户确认选定的值时触发 | Function |
| blur | 当 input 失去焦点时触发 | Function |
| focus | 当 input 获得焦点时触发 | Function |
| calendar-change | 如果用户没有选择日期，那默认展示当前日的月份 | Function |
| panel-change | 当日期面板改变时触发 | Function |
| visible-change | 当 DatePicker 的下拉列表出现/消失时触发 | Function |

### DatePicker Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| handleOpen | 打开日期选择器 | Function |
| handleClose | 关闭日期选择器 | Function |

### DatePicker Slots

| 名称 | 说明 |
|------|------|
| default | 自定义日期单元格的内容 |
| range-separator | 自定义范围分隔符 |

## 实践练习

### 练习1：活动报名日期选择

创建一个活动报名的日期选择系统：

```vue
<template>
  <div class="event-registration">
    <h3>活动报名</h3>
    
    <div class="event-info">
      <h4>{{ eventInfo.name }}</h4>
      <p>{{ eventInfo.description }}</p>
    </div>
    
    <div class="registration-form">
      <div class="form-item">
        <label>选择参加日期：</label>
        <el-date-picker
          v-model="selectedDates"
          type="dates"
          placeholder="选择参加日期"
          :disabled-date="disabledEventDate"
        />
      </div>
      
      <div v-if="selectedDates.length > 0" class="selected-dates">
        <h4>已选择的日期</h4>
        <div class="date-list">
          <el-tag
            v-for="date in selectedDates"
            :key="date.getTime()"
            closable
            @close="removeDate(date)"
          >
            {{ formatDate(date) }}
          </el-tag>
        </div>
      </div>
      
      <el-button
        v-if="selectedDates.length > 0"
        type="primary"
        @click="submitRegistration"
      >
        确认报名
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selectedDates = ref([])

const eventInfo = ref({
  name: '技术分享会',
  description: '为期一周的技术分享活动，每天都有不同的主题',
  startDate: new Date('2024-02-01'),
  endDate: new Date('2024-02-07')
})

const disabledEventDate = (time) => {
  const start = eventInfo.value.startDate
  const end = eventInfo.value.endDate
  return time.getTime() < start.getTime() || time.getTime() > end.getTime()
}

const removeDate = (date) => {
  const index = selectedDates.value.findIndex(d => d.getTime() === date.getTime())
  if (index > -1) {
    selectedDates.value.splice(index, 1)
  }
}

const submitRegistration = () => {
  ElMessage.success(`已报名 ${selectedDates.value.length} 天的活动`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.event-registration {
  max-width: 600px;
  padding: 20px;
}

.event-info {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #409EFF;
}

.event-info h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.event-info p {
  margin: 0;
  color: #606266;
}

.registration-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.selected-dates {
  margin-bottom: 20px;
}

.selected-dates h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.date-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
```

### 练习2：生日提醒管理

创建一个生日提醒管理系统：

```vue
<template>
  <div class="birthday-manager">
    <h3>生日提醒管理</h3>
    
    <div class="add-birthday">
      <h4>添加生日提醒</h4>
      <div class="birthday-form">
        <el-input
          v-model="newBirthday.name"
          placeholder="姓名"
          style="margin-bottom: 12px;"
        />
        <el-date-picker
          v-model="newBirthday.date"
          type="date"
          placeholder="选择生日"
          format="MM月DD日"
          value-format="MM-DD"
          style="margin-bottom: 12px;"
        />
        <el-button type="primary" @click="addBirthday">添加</el-button>
      </div>
    </div>
    
    <div class="birthday-list">
      <h4>生日列表</h4>
      <div v-if="birthdays.length === 0" class="empty-state">
        暂无生日提醒
      </div>
      <div v-else class="birthday-items">
        <div
          v-for="birthday in sortedBirthdays"
          :key="birthday.id"
          class="birthday-item"
          :class="{ upcoming: isUpcoming(birthday.date) }"
        >
          <div class="birthday-info">
            <span class="name">{{ birthday.name }}</span>
            <span class="date">{{ birthday.date }}</span>
          </div>
          <div class="birthday-actions">
            <span v-if="isUpcoming(birthday.date)" class="upcoming-tag">
              即将到来
            </span>
            <el-button size="small" @click="removeBirthday(birthday.id)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const newBirthday = ref({
  name: '',
  date: ''
})

const birthdays = ref([
  { id: 1, name: '张三', date: '01-15' },
  { id: 2, name: '李四', date: '03-22' },
  { id: 3, name: '王五', date: '12-08' }
])

const sortedBirthdays = computed(() => {
  return [...birthdays.value].sort((a, b) => {
    const dateA = new Date(`2024-${a.date}`)
    const dateB = new Date(`2024-${b.date}`)
    return dateA.getTime() - dateB.getTime()
  })
})

const addBirthday = () => {
  if (!newBirthday.value.name || !newBirthday.value.date) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const birthday = {
    id: Date.now(),
    name: newBirthday.value.name,
    date: newBirthday.value.date
  }
  
  birthdays.value.push(birthday)
  newBirthday.value = { name: '', date: '' }
  ElMessage.success('生日提醒添加成功')
}

const removeBirthday = (id) => {
  const index = birthdays.value.findIndex(b => b.id === id)
  if (index > -1) {
    birthdays.value.splice(index, 1)
    ElMessage.success('生日提醒删除成功')
  }
}

const isUpcoming = (dateStr) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthdayThisYear = new Date(`${currentYear}-${dateStr}`)
  
  // 如果今年的生日已过，检查明年的
  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(currentYear + 1)
  }
  
  const diffTime = birthdayThisYear.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= 30 && diffDays >= 0
}
</script>

<style scoped>
.birthday-manager {
  max-width: 600px;
  padding: 20px;
}

.add-birthday {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.add-birthday h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.birthday-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.birthday-list h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}

.birthday-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.birthday-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.birthday-item.upcoming {
  border-color: #f56c6c;
  background: #fef0f0;
}

.birthday-info .name {
  font-weight: 500;
  color: #303133;
  margin-right: 12px;
}

.birthday-info .date {
  color: #606266;
  font-size: 14px;
}

.birthday-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upcoming-tag {
  background: #f56c6c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```

## 常见问题

### 1. 日期格式问题

**问题**：日期格式不符合预期

**解决方案**：
```javascript
// 使用 format 控制显示格式
<el-date-picker
  v-model="date"
  format="YYYY年MM月DD日"
  value-format="YYYY-MM-DD"
/>

// 常用格式
const formats = {
  display: 'YYYY年MM月DD日',    // 显示格式
  value: 'YYYY-MM-DD',         // 值格式
  timestamp: 'x',              // 时间戳
  iso: 'YYYY-MM-DDTHH:mm:ss.sssZ' // ISO格式
}
```

### 2. 时区处理

**问题**：不同时区的日期处理

**解决方案**：
```javascript
// 使用 Day.js 处理时区
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 转换时区
const convertTimezone = (date, targetTimezone) => {
  return dayjs(date).tz(targetTimezone).toDate()
}

// 获取本地时区
const localTimezone = dayjs.tz.guess()
```

### 3. 性能优化

**问题**：大量日期选择器性能问题

**解决方案**：
```javascript
// 使用 v-show 代替 v-if
<el-date-picker
  v-show="showPicker"
  v-model="date"
/>

// 延迟加载
const lazyLoadPicker = () => {
  nextTick(() => {
    showPicker.value = true
  })
}

// 防抖处理
const debouncedChange = debounce((value) => {
  handleDateChange(value)
}, 300)
```

## 最佳实践

1. **格式统一**：在项目中统一日期格式标准
2. **时区考虑**：处理跨时区应用时注意时区转换
3. **用户体验**：提供快捷选项提升选择效率
4. **验证完整**：添加日期范围和格式验证
5. **国际化支持**：考虑多语言环境下的日期显示
6. **移动端适配**：确保在移动设备上的良好体验

## 总结

Date Picker 日期选择器是一个功能丰富的组件，支持：

- 多种日期选择模式（单日期、范围、多选等）
- 灵活的格式化和显示选项
- 丰富的快捷选项和自定义功能
- 完善的禁用和验证机制
- 良好的国际化支持

掌握 Date Picker 的使用，能够为用户提供便捷、直观的日期选择体验，广泛应用于表单、筛选、统计等各种场景。

## 参考资料

- [Element Plus DatePicker 官方文档](https://element-plus.org/zh-CN/component/date-picker.html)
- [Day.js 日期处理库](https://dayjs.gitee.io/zh-CN/)
- [JavaScript Date 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [国际化日期格式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)