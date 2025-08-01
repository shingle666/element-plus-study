# Date Picker

## Overview

Date Picker is a component used for selecting dates, supporting various date selection modes, including single date, date range, month, year, and other selection methods. It provides rich configuration options and customization features to meet various date selection requirements.

## Learning Objectives

- Master the basic concepts and use cases of Date Picker
- Learn how to implement basic date selection functionality
- Understand date range selection and multiple date selection
- Master date formatting and internationalization
- Learn how to disable dates and configure shortcuts
- Understand custom date cell rendering
- Master the application of date pickers in real projects
- Master the complete usage of the API

## Basic Usage

### Basic Date Selection

The simplest date picker:

```vue
<template>
  <div>
    <h4>Basic Date Selection</h4>
    <el-date-picker
      v-model="date1"
      type="date"
      placeholder="Select date"
    />
    <p>Selected date: {{ date1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date1 = ref('')
</script>
```

### With Shortcuts

Provide commonly used date shortcuts:

```vue
<template>
  <div>
    <h4>With Shortcuts</h4>
    <el-date-picker
      v-model="date2"
      type="date"
      placeholder="Select date"
      :shortcuts="shortcuts"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date2 = ref('')

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
</script>
```

### Date Range Selection

Select a date range:

```vue
<template>
  <div>
    <h4>Date Range Selection</h4>
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      range-separator="to"
      start-placeholder="Start date"
      end-placeholder="End date"
      :shortcuts="rangeShortcuts"
    />
    <p>Selected date range: {{ dateRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dateRange = ref('')

const rangeShortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
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

### Month and Year Selection

Select month or year:

```vue
<template>
  <div>
    <h4>Month Picker</h4>
    <el-date-picker
      v-model="month"
      type="month"
      placeholder="Select month"
    />
    <p>Selected month: {{ month }}</p>
    
    <h4>Year Picker</h4>
    <el-date-picker
      v-model="year"
      type="year"
      placeholder="Select year"
    />
    <p>Selected year: {{ year }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const month = ref('')
const year = ref('')
</script>
```

### Multiple Date Selection

Select multiple non-consecutive dates:

```vue
<template>
  <div>
    <h4>Multiple Date Selection</h4>
    <el-date-picker
      v-model="dates"
      type="dates"
      placeholder="Select multiple dates"
    />
    <p>Selected dates: {{ dates }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dates = ref([])
</script>
```

## Advanced Features

### Disabled Dates

Disable specific dates:

```vue
<template>
  <div>
    <h4>Disabled Dates</h4>
    <el-date-picker
      v-model="date3"
      type="date"
      placeholder="Select date"
      :disabled-date="disabledDate"
    />
    <p>Can only select dates after today</p>
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

### Date Formatting

Customize date display format:

```vue
<template>
  <div>
    <h4>Date Formatting</h4>
    <el-date-picker
      v-model="date4"
      type="date"
      placeholder="Select date"
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
    />
    <p>Formatted date: {{ date4 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date4 = ref('')
</script>
```

### Custom Date Cell

Customize the content of date cells:

```vue
<template>
  <div>
    <h4>Custom Date Cell</h4>
    <el-date-picker
      v-model="date5"
      type="date"
      placeholder="Select date"
    >
      <template #default="{ cell }">
        <div class="custom-cell">
          <span class="date-text">{{ cell.text }}</span>
          <span v-if="isSpecialDate(cell.date)" class="special-mark">S</span>
        </div>
      </template>
    </el-date-picker>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const date5 = ref('')

const isSpecialDate = (date) => {
  // Mark the 15th of each month as a special date
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

### Different Sizes

Provide date pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
    <div class="size-demo">
      <el-date-picker
        v-model="date6"
        type="date"
        placeholder="Large size"
        size="large"
      />
      <el-date-picker
        v-model="date7"
        type="date"
        placeholder="Default size"
      />
      <el-date-picker
        v-model="date8"
        type="date"
        placeholder="Small size"
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

## Real Application Examples

### Appointment System Date Selection

Create a date selection component for an appointment system:

```vue
<template>
  <div class="appointment-date-picker">
    <h3>Appointment System</h3>
    
    <div class="appointment-form">
      <div class="form-item">
        <label>Select appointment date:</label>
        <el-date-picker
          v-model="appointmentDate"
          type="date"
          placeholder="Please select appointment date"
          :disabled-date="disabledAppointmentDate"
          :shortcuts="appointmentShortcuts"
          @change="handleDateChange"
        />
      </div>
      
      <div v-if="appointmentDate" class="available-slots">
        <h4>Available Time Slots</h4>
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
            <span v-if="!slot.available" class="unavailable">(Full)</span>
          </el-button>
        </div>
      </div>
      
      <div v-if="selectedSlot" class="appointment-summary">
        <h4>Appointment Information</h4>
        <div class="summary-item">
          <span class="label">Appointment Date:</span>
          <span class="value">{{ formatDate(appointmentDate) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Appointment Time:</span>
          <span class="value">{{ selectedSlot.time }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Service Type:</span>
          <el-select v-model="serviceType" placeholder="Please select service type">
            <el-option
              v-for="service in services"
              :key="service.id"
              :label="service.name"
              :value="service.id"
            />
          </el-select>
        </div>
        
        <div class="action-buttons">
          <el-button type="primary" @click="confirmAppointment">Confirm Appointment</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </div>
      </div>
    </div>
    
    <div v-if="appointments.length > 0" class="appointment-history">
      <h4>Appointment History</h4>
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
    status: 'Confirmed'
  },
  {
    id: 2,
    date: new Date('2024-01-20'),
    time: '14:00-15:00',
    serviceType: 2,
    status: 'Completed'
  }
])

const services = ref([
  { id: 1, name: 'Regular Check-up', duration: 60 },
  { id: 2, name: 'Expert Consultation', duration: 90 },
  { id: 3, name: 'Health Examination', duration: 120 }
])

const appointmentShortcuts = [
  {
    text: 'Tomorrow',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'One week later',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    },
  },
  {
    text: 'One month later',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
      return date
    },
  },
]

const availableTimeSlots = computed(() => {
  if (!appointmentDate.value) return []
  
  // Simulate time slot data
  const slots = [
    { id: 1, time: '09:00-10:00', available: true },
    { id: 2, time: '10:00-11:00', available: true },
    { id: 3, time: '11:00-12:00', available: false },
    { id: 4, time: '14:00-15:00', available: true },
    { id: 5, time: '15:00-16:00', available: true },
    { id: 6, time: '16:00-17:00', available: false },
  ]
  
  // Dynamically adjust availability based on selected date
  const selectedDate = new Date(appointmentDate.value)
  const dayOfWeek = selectedDate.getDay()
  
  // Only afternoon slots available on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return slots.filter(slot => slot.id >= 4)
  }
  
  return slots
})

const disabledAppointmentDate = (time) => {
  // Disable past dates and Sundays
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
    ElMessage.warning('Please complete appointment information')
    return
  }
  
  const newAppointment = {
    id: Date.now(),
    date: new Date(appointmentDate.value),
    time: selectedSlot.value.time,
    serviceType: serviceType.value,
    status: 'Confirmed'
  }
  
  appointments.value.unshift(newAppointment)
  ElMessage.success('Appointment successful!')
  resetForm()
}

const resetForm = () => {
  appointmentDate.value = ''
  selectedSlot.value = null
  serviceType.value = ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getServiceName = (serviceId) => {
  const service = services.value.find(s => s.id === serviceId)
  return service ? service.name : 'Unknown Service'
}

const getStatusType = (status) => {
  const statusMap = {
    'Confirmed': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
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

### Data Statistics Date Filtering

Create a date filtering component for data statistics:

```vue
<template>
  <div class="data-filter">
    <h3>Data Statistics</h3>
    
    <div class="filter-controls">
      <div class="filter-item">
        <label>Statistics Type:</label>
        <el-radio-group v-model="statisticsType" @change="handleTypeChange">
          <el-radio label="daily">Daily</el-radio>
          <el-radio label="weekly">Weekly</el-radio>
          <el-radio label="monthly">Monthly</el-radio>
          <el-radio label="yearly">Yearly</el-radio>
        </el-radio-group>
      </div>
      
      <div class="filter-item">
        <label>Select Time Range:</label>
        <el-date-picker
          v-if="statisticsType === 'daily'"
          v-model="dateRange"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          :shortcuts="dailyShortcuts"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'weekly'"
          v-model="weekRange"
          type="week"
          placeholder="Select week"
          format="YYYY Week ww"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'monthly'"
          v-model="monthRange"
          type="monthrange"
          range-separator="to"
          start-placeholder="Start month"
          end-placeholder="End month"
          @change="handleDateChange"
        />
        <el-date-picker
          v-else-if="statisticsType === 'yearly'"
          v-model="yearRange"
          type="year"
          placeholder="Select year"
          @change="handleDateChange"
        />
      </div>
      
      <div class="filter-item">
        <el-button type="primary" @click="generateReport">Generate Report</el-button>
        <el-button @click="exportData">Export Data</el-button>
      </div>
    </div>
    
    <div v-if="statisticsData" class="statistics-result">
      <h4>Statistics Results</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Total Visits</div>
          <div class="stat-value">{{ statisticsData.totalVisits }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.visitChange > 0 }">
            {{ statisticsData.visitChange > 0 ? '+' : '' }}{{ statisticsData.visitChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">New Users</div>
          <div class="stat-value">{{ statisticsData.newUsers }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.userChange > 0 }">
            {{ statisticsData.userChange > 0 ? '+' : '' }}{{ statisticsData.userChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Conversion Rate</div>
          <div class="stat-value">{{ statisticsData.conversionRate }}%</div>
          <div class="stat-change" :class="{ positive: statisticsData.conversionChange > 0 }">
            {{ statisticsData.conversionChange > 0 ? '+' : '' }}{{ statisticsData.conversionChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Revenue</div>
          <div class="stat-value">${{ statisticsData.revenue.toLocaleString() }}</div>
          <div class="stat-change" :class="{ positive: statisticsData.revenueChange > 0 }">
            {{ statisticsData.revenueChange > 0 ? '+' : '' }}{{ statisticsData.revenueChange }}%
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>Chart Area - Here you can integrate ECharts or other chart libraries</p>
          <p>Time Range: {{ formatTimeRange() }}</p>
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
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const handleTypeChange = () => {
  // Clear previous selections
  dateRange.value = ''
  weekRange.value = ''
  monthRange.value = ''
  yearRange.value = ''
  statisticsData.value = null
}

const handleDateChange = () => {
  // Automatically generate report
  generateReport()
}

const generateReport = () => {
  const hasValidDate = 
    (statisticsType.value === 'daily' && dateRange.value) ||
    (statisticsType.value === 'weekly' && weekRange.value) ||
    (statisticsType.value === 'monthly' && monthRange.value) ||
    (statisticsType.value === 'yearly' && yearRange.value)
  
  if (!hasValidDate) {
    ElMessage.warning('Please select a time range')
    return
  }
  
  // Simulate generating statistics data
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
  
  ElMessage.success('Report generated successfully')
}

const exportData = () => {
  if (!statisticsData.value) {
    ElMessage.warning('Please generate a report first')
    return
  }
  
  // Simulate export functionality
  ElMessage.success('Data exported successfully')
}

const formatTimeRange = () => {
  switch (statisticsType.value) {
    case 'daily':
      if (dateRange.value && dateRange.value.length === 2) {
        return `${formatDate(dateRange.value[0])} to ${formatDate(dateRange.value[1])}`
      }
      break
    case 'weekly':
      if (weekRange.value) {
        return formatDate(weekRange.value)
      }
      break
    case 'monthly':
      if (monthRange.value && monthRange.value.length === 2) {
        return `${formatMonth(monthRange.value[0])} to ${formatMonth(monthRange.value[1])}`
      }
      break
    case 'yearly':
      if (yearRange.value) {
        return `${yearRange.value.getFullYear()}`
      }
      break
  }
  return 'Not selected'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US')
}

const formatMonth = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
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

## API Documentation

### DatePicker Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | Binding value | Date / Array | — |
| readonly | Whether DatePicker is read only | boolean | false |
| disabled | Whether DatePicker is disabled | boolean | false |
| size | Size of the input | enum | default |
| editable | Whether the input is editable | boolean | true |
| clearable | Whether to show clear button | boolean | true |
| placeholder | Placeholder in non-range mode | string | — |
| start-placeholder | Placeholder for the start date in range mode | string | — |
| end-placeholder | Placeholder for the end date in range mode | string | — |
| type | Type of the picker | enum | date |
| format | Format of the displayed value in the input box | string | YYYY-MM-DD |
| value-format | Format of binding value | string | — |
| popper-class | Custom class name for DatePicker's dropdown | string | — |
| range-separator | Range separator | string | '-' |
| default-value | Optional, default date of the calendar | Date / Array | — |
| default-time | Optional, the time value to use when selecting date range | Date / Array | — |
| disabled-date | A function determining if a date is disabled | Function | — |
| shortcuts | An object array to set shortcut options | Array | — |
| cell-class-name | Set custom className for date cell | Function | — |
| teleported | Whether to append the dropdown to body | boolean | true |

### DatePicker Events

| Name | Description | Parameters |
|------|-------------|------------|
| change | Triggers when user confirms the value | component's binding value |
| blur | Triggers when Input blurs | component instance |
| focus | Triggers when Input focuses | component instance |
| calendar-change | Triggers when the calendar selected date is changed. Only for date / dates / week / month / year / multiple-month / multiple-year | [Date, Date] |
| panel-change | Triggers when the navigation panel changes | (date, mode, view) |
| visible-change | Triggers when the DatePicker's dropdown appears/disappears | true when it appears, and false otherwise |

### DatePicker Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| focus | Focus the input element | — |
| handleOpen | Open the DatePicker dropdown | — |
| handleClose | Close the DatePicker dropdown | — |

### DatePicker Slots

| Name | Description |
|------|-------------|
| default | Custom cell content |
| range-separator | Custom range separator content |

## Practice Exercises

### Exercise 1: Event Registration Date Selection

Create a date selection system for event registration:

```vue
<template>
  <div class="event-registration">
    <h3>Event Registration</h3>
    
    <div class="event-info">
      <h4>{{ eventInfo.name }}</h4>
      <p>{{ eventInfo.description }}</p>
    </div>
    
    <div class="registration-form">
      <div class="form-item">
        <label>Select participation dates:</label>
        <el-date-picker
          v-model="selectedDates"
          type="dates"
          placeholder="Select participation dates"
          :disabled-date="disabledEventDate"
        />
      </div>
      
      <div v-if="selectedDates.length > 0" class="selected-dates">
        <h4>Selected Dates</h4>
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
        Confirm Registration
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const selectedDates = ref([])

const eventInfo = ref({
  name: 'Tech Sharing Week',
  description: 'A week-long tech sharing event with different topics each day',
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
  ElMessage.success(`Registered for ${selectedDates.value.length} days of the event`)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
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

### Exercise 2: Birthday Reminder Management

Create a birthday reminder management system:

```vue
<template>
  <div class="birthday-manager">
    <h3>Birthday Reminder Management</h3>
    
    <div class="add-birthday">
      <h4>Add Birthday Reminder</h4>
      <div class="birthday-form">
        <el-input
          v-model="newBirthday.name"
          placeholder="Name"
          style="margin-bottom: 12px;"
        />
        <el-date-picker
          v-model="newBirthday.date"
          type="date"
          placeholder="Select birthday"
          format="MM/DD"
          value-format="MM-DD"
          style="margin-bottom: 12px;"
        />
        <el-button type="primary" @click="addBirthday">Add</el-button>
      </div>
    </div>
    
    <div class="birthday-list">
      <h4>Birthday List</h4>
      <div v-if="birthdays.length === 0" class="empty-state">
        No birthday reminders yet
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
              Coming Soon
            </span>
            <el-button size="small" @click="removeBirthday(birthday.id)">
              Delete
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
  { id: 1, name: 'John Smith', date: '01-15' },
  { id: 2, name: 'Jane Doe', date: '03-22' },
  { id: 3, name: 'Mike Johnson', date: '12-08' }
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
    ElMessage.warning('Please fill in all information')
    return
  }
  
  const birthday = {
    id: Date.now(),
    name: newBirthday.value.name,
    date: newBirthday.value.date
  }
  
  birthdays.value.push(birthday)
  newBirthday.value = { name: '', date: '' }
  ElMessage.success('Birthday reminder added successfully')
}

const removeBirthday = (id) => {
  const index = birthdays.value.findIndex(b => b.id === id)
  if (index > -1) {
    birthdays.value.splice(index, 1)
    ElMessage.success('Birthday reminder deleted successfully')
  }
}

const isUpcoming = (dateStr) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthdayThisYear = new Date(`${currentYear}-${dateStr}`)
  
  // If this year's birthday has passed, check next year's
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

## Common Issues

### 1. Date Format Issues

**Problem**: Date format doesn't match expectations

**Solution**:
```javascript
// Use format to control display format
<el-date-picker
  v-model="date"
  format="YYYY/MM/DD"
  value-format="YYYY-MM-DD"
/>

// Common formats
const formats = {
  display: 'YYYY/MM/DD',     // Display format
  value: 'YYYY-MM-DD',       // Value format
  timestamp: 'x',            // Timestamp
  iso: 'YYYY-MM-DDTHH:mm:ss.sssZ' // ISO format
}
```

### 2. Timezone Handling

**Problem**: Handling dates in different timezones

**Solution**:
```javascript
// Use Day.js to handle timezones
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// Convert timezone
const convertTimezone = (date, targetTimezone) => {
  return dayjs(date).tz(targetTimezone).toDate()
}

// Get local timezone
const localTimezone = dayjs.tz.guess()
```

### 3. Performance Optimization

**Problem**: Performance issues with many date pickers

**Solution**:
```javascript
// Use v-show instead of v-if
<el-date-picker
  v-show="showPicker"
  v-model="date"
/>

// Lazy loading
const lazyLoadPicker = () => {
  nextTick(() => {
    showPicker.value = true
  })
}

// Debounce handling
const debouncedChange = debounce((value) => {
  handleDateChange(value)
}, 300)
```

## Best Practices

1. **Standardize Formats**: Maintain consistent date format standards across your project
2. **Consider Timezones**: Pay attention to timezone conversions in cross-timezone applications
3. **User Experience**: Provide shortcuts to improve selection efficiency
4. **Complete Validation**: Add date range and format validation
5. **Internationalization**: Consider date display in multi-language environments
6. **Mobile Adaptation**: Ensure good experience on mobile devices

## Summary

The Date Picker component is a feature-rich component that supports:

- Multiple date selection modes (single date, range, multiple, etc.)
- Flexible formatting and display options
- Rich shortcut options and customization features
- Comprehensive disabling and validation mechanisms
- Good internationalization support

Mastering the Date Picker usage can provide users with a convenient and intuitive date selection experience, widely applicable in forms, filtering, statistics, and various other scenarios.

## References

- [Element Plus DatePicker Official Documentation](https://element-plus.org/en-US/component/date-picker.html)
- [Day.js Date Processing Library](https://day.js.org/)
- [JavaScript Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Internationalization Date Format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
