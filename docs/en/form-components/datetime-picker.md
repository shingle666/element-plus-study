# DateTime Picker

## Overview

DateTime Picker is a combination of Date Picker and Time Picker, allowing users to select both date and time simultaneously. It provides flexible configuration options, supports various date-time formats and selection modes, making it an ideal choice for handling complete time information.

## Learning Objectives

- Master the basic concepts and use cases of DateTime Picker
- Learn how to implement basic date-time selection functionality
- Understand date-time range selection
- Master date-time formatting and display
- Learn how to disable dates/times and limit selections
- Understand custom date-time pickers
- Master the application of date-time pickers in real projects
- Master the complete usage of the API

## Basic Usage

### Basic Date-Time Selection

The simplest date-time picker:

```vue
<template>
  <div>
    <h4>Basic Date-Time Selection</h4>
    <el-date-picker
      v-model="datetime1"
      type="datetime"
      placeholder="Select date and time"
    />
    <p>Selected date and time: {{ datetime1 }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

const selectedQuick = ref('today')
const customRange = ref('')
const currentRange = ref([new Date(), new Date()])
const chartType = ref('hourly')
const chartMetric = ref('views')

const quickOptions = [
  {
    key: 'today',
    label: 'Today',
    getValue: () => {
      const start = dayjs().startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    getValue: () => {
      const start = dayjs().subtract(1, 'day').startOf('day').toDate()
      const end = dayjs().subtract(1, 'day').endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last7days',
    label: 'Last 7 Days',
    getValue: () => {
      const start = dayjs().subtract(6, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last30days',
    label: 'Last 30 Days',
    getValue: () => {
      const start = dayjs().subtract(29, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    getValue: () => {
      const start = dayjs().startOf('month').toDate()
      const end = dayjs().endOf('month').toDate()
      return [start, end]
    }
  },
  {
    key: 'lastMonth',
    label: 'Last Month',
    getValue: () => {
      const start = dayjs().subtract(1, 'month').startOf('month').toDate()
      const end = dayjs().subtract(1, 'month').endOf('month').toDate()
      return [start, end]
    }
  }
]

const rangeShortcuts = [
  {
    text: 'Last 1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: 'Last 24 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

const statistics = computed(() => {
  // Simulated statistics data, in a real application this would be fetched from backend based on currentRange
  return {
    totalViews: 125680,
    viewsChange: 12.5,
    uniqueVisitors: 8432,
    visitorsChange: -3.2,
    avgDuration: 245, // seconds
    durationChange: 8.7,
    conversionRate: 3.45,
    conversionChange: 1.2
  }
})

// Initialize current time range
const initCurrentRange = () => {
  const todayOption = quickOptions.find(opt => opt.key === 'today')
  currentRange.value = todayOption.getValue()
}

const selectQuickOption = (option) => {
  selectedQuick.value = option.key
  currentRange.value = option.getValue()
  customRange.value = ''
}

const handleCustomRangeChange = (value) => {
  if (value && Array.isArray(value)) {
    selectedQuick.value = ''
    currentRange.value = value
  }
}

const formatTimeRange = (range) => {
  if (!range || !Array.isArray(range)) return ''
  
  const [start, end] = range
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  return `${startStr} to ${endStr}`
}

const getDataDuration = (range) => {
  if (!range || !Array.isArray(range)) return ''
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  if (duration < 24) {
    return `${duration} hours`
  } else {
    const days = Math.floor(duration / 24)
    const hours = duration % 24
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`
  }
}

const getDataPoints = (range) => {
  if (!range || !Array.isArray(range)) return 0
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  // Simulated data point calculation
  return Math.min(duration * 60, 10000) // Assume one data point per minute, max 10000
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`
  } else {
    return `${minutes}m ${remainingSeconds}s`
  }
}

const updateChart = () => {
  // Chart update logic
  console.log('Updating chart:', chartType.value, chartMetric.value)
}

const getChartTypeLabel = (type) => {
  const labels = {
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  }
  return labels[type] || type
}

const getMetricLabel = (metric) => {
  const labels = {
    views: 'Views',
    visitors: 'Unique Visitors',
    duration: 'Duration',
    conversion: 'Conversion Rate'
  }
  return labels[metric] || metric
}

// Watch for time range changes to update chart
watch(currentRange, () => {
  updateChart()
}, { deep: true })

// Initialize
initCurrentRange()
</script>

<style scoped>
.data-analytics {
  max-width: 1200px;
  padding: 20px;
}

.time-filter {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.time-filter h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.filter-options {
  margin-bottom: 20px;
}

.quick-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.custom-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-range label {
  font-weight: 500;
  color: #303133;
}

.time-info {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  color: #606266;
  font-size: 12px;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

.statistics-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 24px;
}

.statistics-panel h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.stat-title {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.chart-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.chart-panel h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.chart-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.chart-container {
  height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin: 4px 0;
}
</style>

<script setup>
import { ref } from 'vue'

const datetime1 = ref('')
</script>
```

### Date-Time Range Selection

Select a date-time range:

```vue
<template>
  <div>
    <h4>Date-Time Range Selection</h4>
    <el-date-picker
      v-model="datetimeRange"
      type="datetimerange"
      range-separator="to"
      start-placeholder="Start date and time"
      end-placeholder="End date and time"
    />
    <p>Selected date-time range: {{ datetimeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetimeRange = ref('')
</script>
```

### Default Time Setting

Set default time for the date picker:

```vue
<template>
  <div>
    <h4>Default Time Setting</h4>
    <el-date-picker
      v-model="datetime2"
      type="datetime"
      placeholder="Select date and time"
      :default-time="defaultTime"
    />
    <p>Default time is 12:00:00</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime2 = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
</script>
```

### Date-Time Formatting

Customize date-time display format:

```vue
<template>
  <div>
    <h4>Date-Time Formatting</h4>
    <div class="format-demo">
      <div class="format-item">
        <label>Standard format:</label>
        <el-date-picker
          v-model="datetime3"
          type="datetime"
          placeholder="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>Custom format:</label>
        <el-date-picker
          v-model="datetime4"
          type="datetime"
          placeholder="YYYY/MM/DD HH:mm"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>12-hour format:</label>
        <el-date-picker
          v-model="datetime5"
          type="datetime"
          placeholder="YYYY/MM/DD hh:mm:ss A"
          format="YYYY/MM/DD hh:mm:ss A"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
    </div>
    
    <div class="chart-panel">
      <h4>Trend Chart</h4>
      
      <div class="chart-controls">
        <el-radio-group v-model="chartType" @change="updateChart">
          <el-radio-button label="hourly">Hourly</el-radio-button>
          <el-radio-button label="daily">Daily</el-radio-button>
          <el-radio-button label="weekly">Weekly</el-radio-button>
          <el-radio-button label="monthly">Monthly</el-radio-button>
        </el-radio-group>
        
        <el-select v-model="chartMetric" @change="updateChart">
          <el-option label="Views" value="views" />
          <el-option label="Visitors" value="visitors" />
          <el-option label="Duration" value="duration" />
          <el-option label="Conversion" value="conversion" />
        </el-select>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>Chart Area</p>
          <p>Time Range: {{ formatTimeRange(currentRange) }}</p>
          <p>Chart Type: {{ getChartTypeLabel(chartType) }}</p>
          <p>Metric: {{ getMetricLabel(chartMetric) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <div class="format-result">
      <p>Standard format: {{ datetime3 }}</p>
      <p>Custom format: {{ datetime4 }}</p>
      <p>12-hour format: {{ datetime5 }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime3 = ref('')
const datetime4 = ref('')
const datetime5 = ref('')
</script>

<style scoped>
.format-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-item label {
  width: 100px;
  font-weight: 500;
  color: #303133;
}

.format-result {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.format-result p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

## Advanced Features

### Disabling Date-Time

Disable specific dates or times:

```vue
<template>
  <div>
    <h4>Disabling Date-Time</h4>
    <div class="disabled-demo">
      <div class="disabled-item">
        <label>Disable past dates:</label>
        <el-date-picker
          v-model="datetime6"
          type="datetime"
          placeholder="Only future times allowed"
          :disabled-date="disabledPastDates"
        />
      </div>
      
      <div class="disabled-item">
        <label>Disable non-working hours:</label>
        <el-date-picker
          v-model="datetime7"
          type="datetime"
          placeholder="Only working hours allowed"
          :disabled-date="disabledWeekends"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime6 = ref('')
const datetime7 = ref('')

const disabledPastDates = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const disabledWeekends = (time) => {
  const day = time.getDay()
  return day === 0 || day === 6 // Disable weekends
}

const disabledHours = () => {
  const hours = []
  for (let i = 0; i < 9; i++) {
    hours.push(i)
  }
  for (let i = 18; i < 24; i++) {
    hours.push(i)
  }
  return hours
}

const disabledMinutes = (hour) => {
  // No restrictions on minutes during working hours
  return []
}
</script>

<style scoped>
.disabled-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.disabled-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.disabled-item label {
  width: 150px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### Shortcuts

Provide commonly used date-time shortcuts:

```vue
<template>
  <div>
    <h4>Shortcuts</h4>
    <div class="shortcuts-demo">
      <div class="shortcuts-item">
        <label>Single date-time:</label>
        <el-date-picker
          v-model="datetime8"
          type="datetime"
          placeholder="Select date and time"
          :shortcuts="datetimeShortcuts"
        />
      </div>
      
      <div class="shortcuts-item">
        <label>Date-time range:</label>
        <el-date-picker
          v-model="datetimeRange2"
          type="datetimerange"
          range-separator="to"
          start-placeholder="Start time"
          end-placeholder="End time"
          :shortcuts="rangeShortcuts"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime8 = ref('')
const datetimeRange2 = ref('')

const datetimeShortcuts = [
  {
    text: 'Now',
    value: new Date()
  },
  {
    text: 'Today at 9 AM',
    value: () => {
      const date = new Date()
      date.setHours(9, 0, 0, 0)
      return date
    }
  },
  {
    text: 'Today at 6 PM',
    value: () => {
      const date = new Date()
      date.setHours(18, 0, 0, 0)
      return date
    }
  },
  {
    text: 'Tomorrow at 9 AM',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0)
      return date
    }
  }
]

const rangeShortcuts = [
  {
    text: 'Last 1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: 'Last 6 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 6)
      return [start, end]
    }
  },
  {
    text: 'Last 24 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last 30 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]
</script>

<style scoped>
.shortcuts-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shortcuts-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shortcuts-item label {
  width: 150px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### Different Sizes

Provide date-time pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
    <div class="size-demo">
      <el-date-picker
        v-model="datetime9"
        type="datetime"
        size="large"
        placeholder="Large size"
      />
      <el-date-picker
        v-model="datetime10"
        type="datetime"
        placeholder="Default size"
      />
      <el-date-picker
        v-model="datetime11"
        type="datetime"
        size="small"
        placeholder="Small size"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime9 = ref('')
const datetime10 = ref('')
const datetime11 = ref('')
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

## Practical Application Examples

### Event Management System

Create a date-time selection component for event management:

```vue
<template>
  <div class="event-management">
    <h3>Event Management System</h3>
    
    <div class="event-form">
      <h4>Create Event</h4>
      
      <div class="form-section">
        <div class="form-item">
          <label>Event Name:</label>
          <el-input v-model="eventForm.name" placeholder="Enter event name" />
        </div>
        
        <div class="form-item">
          <label>Event Type:</label>
          <el-select v-model="eventForm.type" placeholder="Select event type">
            <el-option label="Meeting" value="meeting" />
            <el-option label="Training" value="training" />
            <el-option label="Activity" value="activity" />
            <el-option label="Other" value="other" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Event Time:</label>
          <el-date-picker
            v-model="eventForm.timeRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="eventShortcuts"
            :disabled-date="disabledEventDates"
            @change="handleTimeChange"
          />
        </div>
        
        <div v-if="eventDuration" class="duration-display">
          <span class="duration-label">Event Duration:</span>
          <span class="duration-value">{{ eventDuration }}</span>
        </div>
        
        <div class="form-item">
          <label>Reminder:</label>
          <el-select v-model="eventForm.reminder" placeholder="Select reminder time">
            <el-option label="No reminder" value="none" />
            <el-option label="15 minutes before" value="15min" />
            <el-option label="30 minutes before" value="30min" />
            <el-option label="1 hour before" value="1hour" />
            <el-option label="1 day before" value="1day" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Description:</label>
          <el-input
            v-model="eventForm.description"
            type="textarea"
            :rows="3"
            placeholder="Enter event description"
          />
        </div>
        
        <div class="form-actions">
          <el-button type="primary" @click="createEvent">Create Event</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </div>
      </div>
    </div>
    
    <div class="event-list">
      <h4>Event List</h4>
      
      <div class="filter-bar">
        <el-date-picker
          v-model="filterDate"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="filterEvents"
        />
        <el-select v-model="filterType" placeholder="Event type" @change="filterEvents">
          <el-option label="All" value="" />
          <el-option label="Meeting" value="meeting" />
          <el-option label="Training" value="training" />
          <el-option label="Activity" value="activity" />
          <el-option label="Other" value="other" />
        </el-select>
      </div>
      
      <div class="events">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-item"
          :class="getEventStatus(event)"
        >
          <div class="event-header">
            <div class="event-title">{{ event.name }}</div>
            <div class="event-type">
              <el-tag :type="getTypeColor(event.type)" size="small">
                {{ getTypeName(event.type) }}
              </el-tag>
            </div>
          </div>
          
          <div class="event-time">
            <el-icon><Clock /></el-icon>
            <span>{{ formatEventTime(event.timeRange) }}</span>
          </div>
          
          <div v-if="event.description" class="event-description">
            {{ event.description }}
          </div>
          
          <div class="event-actions">
            <el-button size="small" @click="editEvent(event)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteEvent(event.id)">Delete</el-button>
          </div>
        </div>
        
        <div v-if="filteredEvents.length === 0" class="no-events">
          No events found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const eventForm = ref({
  name: '',
  type: '',
  timeRange: '',
  reminder: 'none',
  description: ''
})

const events = ref([
  {
    id: 1,
    name: 'Project Kickoff Meeting',
    type: 'meeting',
    timeRange: [new Date('2024-01-15 09:00:00'), new Date('2024-01-15 11:00:00')],
    reminder: '30min',
    description: 'Discuss project plan and assignments'
  },
  {
    id: 2,
    name: 'Vue 3 Training',
    type: 'training',
    timeRange: [new Date('2024-01-16 14:00:00'), new Date('2024-01-16 17:00:00')],
    reminder: '1hour',
    description: 'Learning Vue 3 new features'
  }
])

const filterDate = ref('')
const filterType = ref('')

const eventDuration = computed(() => {
  if (!eventForm.value.timeRange || !Array.isArray(eventForm.value.timeRange)) {
    return ''
  }
  
  const [start, end] = eventForm.value.timeRange
  if (!start || !end) return ''
  
  const duration = dayjs(end).diff(dayjs(start), 'minute')
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  
  if (hours === 0) {
    return `${minutes} minutes`
  } else if (minutes === 0) {
    return `${hours} hours`
  } else {
    return `${hours} hours ${minutes} minutes`
  }
})

const filteredEvents = computed(() => {
  let result = events.value
  
  if (filterDate.value && Array.isArray(filterDate.value)) {
    const [start, end] = filterDate.value
    result = result.filter(event => {
      const eventStart = dayjs(event.timeRange[0])
      return eventStart.isAfter(dayjs(start)) && eventStart.isBefore(dayjs(end).add(1, 'day'))
    })
  }
  
  if (filterType.value) {
    result = result.filter(event => event.type === filterType.value)
  }
  
  return result.sort((a, b) => new Date(a.timeRange[0]) - new Date(b.timeRange[0]))
})

const eventShortcuts = [
  {
    text: 'Today morning',
    value: () => {
      const start = new Date()
      start.setHours(9, 0, 0, 0)
      const end = new Date()
      end.setHours(12, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Today afternoon',
    value: () => {
      const start = new Date()
      start.setHours(14, 0, 0, 0)
      const end = new Date()
      end.setHours(18, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Tomorrow morning',
    value: () => {
      const start = new Date()
      start.setDate(start.getDate() + 1)
      start.setHours(9, 0, 0, 0)
      const end = new Date()
      end.setDate(end.getDate() + 1)
      end.setHours(12, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Next Monday morning',
    value: () => {
      const today = new Date()
      const nextMonday = new Date(today)
      nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7)
      nextMonday.setHours(9, 0, 0, 0)
      
      const end = new Date(nextMonday)
      end.setHours(12, 0, 0, 0)
      
      return [nextMonday, end]
    }
  }
]

const disabledEventDates = (time) => {
  // Disable past dates
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const handleTimeChange = (value) => {
  if (value && Array.isArray(value)) {
    const [start, end] = value
    if (dayjs(end).diff(dayjs(start), 'minute') < 30) {
      ElMessage.warning('Event duration cannot be less than 30 minutes')
      eventForm.value.timeRange = ''
    }
  }
}

const createEvent = () => {
  if (!eventForm.value.name) {
    ElMessage.warning('Please enter event name')
    return
  }
  
  if (!eventForm.value.type) {
    ElMessage.warning('Please select event type')
    return
  }
  
  if (!eventForm.value.timeRange) {
    ElMessage.warning('Please select event time')
    return
  }
  
  const newEvent = {
    id: Date.now(),
    ...eventForm.value
  }
  
  events.value.push(newEvent)
  ElMessage.success('Event created successfully')
  resetForm()
}

const resetForm = () => {
  eventForm.value = {
    name: '',
    type: '',
    timeRange: '',
    reminder: 'none',
    description: ''
  }
}

const editEvent = (event) => {
  eventForm.value = { ...event }
}

const deleteEvent = (eventId) => {
  const index = events.value.findIndex(e => e.id === eventId)
  if (index > -1) {
    events.value.splice(index, 1)
    ElMessage.success('Event deleted successfully')
  }
}

const filterEvents = () => {
  // Filtering logic is handled in computed property
}

const getEventStatus = (event) => {
  const now = new Date()
  const start = new Date(event.timeRange[0])
  const end = new Date(event.timeRange[1])
  
  if (now < start) {
    return 'upcoming'
  } else if (now >= start && now <= end) {
    return 'ongoing'
  } else {
    return 'completed'
  }
}

const getTypeColor = (type) => {
  const colors = {
    meeting: 'primary',
    training: 'success',
    activity: 'warning',
    other: 'info'
  }
  return colors[type] || 'info'
}

const getTypeName = (type) => {
  const names = {
    meeting: 'Meeting',
    training: 'Training',
    activity: 'Activity',
    other: 'Other'
  }
  return names[type] || 'Other'
}

const formatEventTime = (timeRange) => {
  if (!timeRange || !Array.isArray(timeRange)) return ''
  
  const [start, end] = timeRange
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  if (dayjs(start).format('YYYY-MM-DD') === dayjs(end).format('YYYY-MM-DD')) {
    return `${dayjs(start).format('YYYY-MM-DD')} ${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`
  } else {
    return `${startStr} - ${endStr}`
  }
}
</script>

<style scoped>
.event-management {
  max-width: 1000px;
  padding: 20px;
}

.event-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.event-form h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-item label {
  width: 100px;
  font-weight: 500;
  color: #303133;
  flex-shrink: 0;
}

.duration-display {
  padding: 12px;
  background: #e1f3d8;
  border-radius: 6px;
  border-left: 4px solid #67c23a;
}

.duration-label {
  color: #529b2e;
  font-weight: 500;
}

.duration-value {
  color: #529b2e;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.event-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.event-list h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: white;
}

.event-item.upcoming {
  border-left: 4px solid #409EFF;
}

.event-item.ongoing {
  border-left: 4px solid #67c23a;
  background: #f0f9ff;
}

.event-item.completed {
  border-left: 4px solid #909399;
  background: #f5f7fa;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-title {
  font-weight: 500;
  color: #303133;
  font-size: 16px;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  margin-bottom: 8px;
}

.event-description {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.no-events {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}
</style>
```

### Data Analytics Time Filter

Create a time filter component for data analytics:

```vue
<template>
  <div class="data-analytics">
    <h3>Data Analytics</h3>
    
    <div class="time-filter">
      <h4>Time Filter</h4>
      
      <div class="filter-options">
        <div class="quick-filters">
          <el-button
            v-for="option in quickOptions"
            :key="option.key"
            :type="selectedQuick === option.key ? 'primary' : 'default'"
            size="small"
            @click="selectQuickOption(option)"
          >
            {{ option.label }}
          </el-button>
        </div>
        
        <div class="custom-range">
          <label>Custom time range:</label>
          <el-date-picker
            v-model="customRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="rangeShortcuts"
            @change="handleCustomRangeChange"
          />
        </div>
      </div>
      
      <div class="time-info">
        <div class="info-item">
          <span class="label">Current time range:</span>
          <span class="value">{{ formatTimeRange(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Data duration:</span>
          <span class="value">{{ getDataDuration(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Data points:</span>
          <span class="value">{{ getDataPoints(currentRange) }}</span>
        </div>
      </div>
    </div>
    
    <div class="statistics-panel">
      <h4>Statistics</h4>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Total Views</div>
          <div class="stat-value">{{ statistics.totalViews.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.viewsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.viewsChange >= 0 ? '+' : '' }}{{ statistics.viewsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Unique Visitors</div>
          <div class="stat-value">{{ statistics.uniqueVisitors.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.visitorsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.visitorsChange >= 0 ? '+' : '' }}{{ statistics.visitorsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Average Duration</div>
          <div class="stat-value">{{ formatDuration(statistics.avgDuration) }}</div>
          <div class="stat-change" :class="statistics.durationChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.durationChange >= 0 ? '+' : '' }}{{ statistics.durationChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Conversion Rate</div>
          <div class="stat-value">{{ statistics.conversionRate }}%</div>
          <div class="stat-change" :class="statistics.conversionChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.conversionChange >= 0 ? '+' : '' }}{{ statistics.conversionChange }}%
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-panel">
      <h4>Trend Chart</h4>
      
      <div class="chart-controls">
        <el-radio-group v-model="chartType" @change="updateChart">
          <el-radio-button label="hourly">Hourly</el-radio-button>
          <el-radio-button label="daily">Daily</el-radio-button>
          <el-radio-button label="weekly">Weekly</el-radio-button>
          <el-radio-button label="monthly">Monthly</el-radio-button>
        </el-radio-group>
        
        <el-select v-model="chartMetric" @change="updateChart">
          <el-option label="Views" value="views" />
          <el-option label="Visitors" value="visitors" />
          <el-option label="Duration" value="duration" />
          <el-option label="Conversion" value="conversion" />
        </el-select>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>Chart Area</p>
          <p>Time Range: {{ formatTimeRange(currentRange) }}</p>
          <p>Chart Type: {{ getChartTypeLabel(chartType) }}</p>
          <p>Metric: {{ getMetricLabel(chartMetric) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

const selectedQuick = ref('today')
const customRange = ref('')
const currentRange = ref([new Date(), new Date()])
const chartType = ref('hourly')
const chartMetric = ref('views')

const quickOptions = [
  {
    key: 'today',
    label: 'Today',
    getValue: () => {
      const start = dayjs().startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'yesterday',
    label: 'Yesterday',
    getValue: () => {
      const start = dayjs().subtract(1, 'day').startOf('day').toDate()
      const end = dayjs().subtract(1, 'day').endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last7days',
    label: 'Last 7 Days',
    getValue: () => {
      const start = dayjs().subtract(6, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last30days',
    label: 'Last 30 Days',
    getValue: () => {
      const start = dayjs().subtract(29, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    getValue: () => {
      const start = dayjs().startOf('month').toDate()
      const end = dayjs().endOf('month').toDate()
      return [start, end]
    }
  },
  {
    key: 'lastMonth',
    label: 'Last Month',
    getValue: () => {
      const start = dayjs().subtract(1, 'month').startOf('month').toDate()
      const end = dayjs().subtract(1, 'month').endOf('month').toDate()
      return [start, end]
    }
  }
]

const rangeShortcuts = [
  {
    text: 'Last 1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: 'Last 24 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

const statistics = computed(() => {
  // Simulated statistics data, in a real application this would be fetched from backend based on currentRange
  return {
    totalViews: 125680,
    viewsChange: 12.5,
    uniqueVisitors: 8432,
    visitorsChange: -3.2,
    avgDuration: 245, // seconds
    durationChange: 8.7,
    conversionRate: 3.45,
    conversionChange: 1.2
  }
})

// Initialize current time range
const initCurrentRange = () => {
  const todayOption = quickOptions.find(opt => opt.key === 'today')
  currentRange.value = todayOption.getValue()
}

const selectQuickOption = (option) => {
  selectedQuick.value = option.key
  currentRange.value = option.getValue()
  customRange.value = ''
}

const handleCustomRangeChange = (value) => {
  if (value && Array.isArray(value)) {
    selectedQuick.value = ''
    currentRange.value = value
  }
}

const formatTimeRange = (range) => {
  if (!range || !Array.isArray(range)) return ''
  
  const [start, end] = range
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  return `${startStr} to ${endStr}`
}

const getDataDuration = (range) => {
  if (!range || !Array.isArray(range)) return ''
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  if (duration < 24) {
    return `${duration} hours`
  } else {
    const days = Math.floor(duration / 24)
    const hours = duration % 24
    return hours > 0 ? `${days} days ${hours} hours` : `${days} days`
  }
}

const getDataPoints = (range) => {
  if (!range || !Array.isArray(range)) return 0
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  // Simulated data point calculation
  return Math.min(duration * 60, 10000) // Assume one data point per minute, max 10000
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds} seconds`
  } else {
    return `${minutes}m ${remainingSeconds}s`
  }
}

const updateChart = () => {
  // Chart update logic
  console.log('Updating chart:', chartType.value, chartMetric.value)
}

const getChartTypeLabel = (type) => {
  const labels = {
    hourly: 'Hourly',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly'
  }
  return labels[type] || type
}

const getMetricLabel = (metric) => {
  const labels = {
    views: 'Views',
    visitors: 'Unique Visitors',
    duration: 'Duration',
    conversion: 'Conversion Rate'
  }
  return labels[metric] || metric
}

// Watch for time range changes to update chart
watch(currentRange, () => {
  updateChart()
}, { deep: true })

// Initialize
initCurrentRange()
</script>

<style scoped>
.data-analytics {
  max-width: 1200px;
  padding: 20px;
}

.time-filter {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.time-filter h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.filter-options {
  margin-bottom: 20px;
}

.quick-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.custom-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-range label {
  font-weight: 500;
  color: #303133;
}

.time-info {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  color: #606266;
  font-size: 12px;
}

.info-item .value {
  color: #303133;
  font-weight: 500;
}

.statistics-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 24px;
}

.statistics-panel h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.stat-title {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  color: #303133;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change.negative {
  color: #f56c6c;
}

.chart-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.chart-panel h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.chart-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.chart-container {
  height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin: 4px 0;
}
</style>
```

## API Documentation

### DateTimePicker Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | Binding value | Date / string / Array | — |
| readonly | Whether DateTimePicker is read only | boolean | false |
| disabled | Whether DateTimePicker is disabled | boolean | false |
| editable | Whether the input is editable | boolean | true |
| clearable | Whether to show clear button | boolean | true |
| size | Size of the input | enum | default |
| placeholder | Placeholder in non-range mode | string | — |
| start-placeholder | Placeholder for the start date in range mode | string | — |
| end-placeholder | Placeholder for the end date in range mode | string | — |
| type | Type of the picker | enum | date |
| format | Format of the displayed value in the input box | string | YYYY-MM-DD HH:mm:ss |
| value-format | Format of binding value | string | — |
| default-value | Optional, default date of the calendar | Date / string | — |
| default-time | Default time value after picking a date | Date / Array | — |
| range-separator | Range separator | string | '-' |
| picker-options | Options for the picker | object | {} |
| shortcuts | An object array to set shortcut options | Array | — |
| disabled-date | A function determining if a date is disabled | Function | — |
| disabled-hours | A function determining if hours are disabled | Function | — |
| disabled-minutes | A function determining if minutes are disabled | Function | — |
| disabled-seconds | A function determining if seconds are disabled | Function | — |
| cell-class-name | Set custom class name for date cells | Function | — |
| teleported | Whether to teleport the picker dropdown to the body | boolean | true |

### DateTimePicker Events

| Name | Description | Type |
|------|-------------|------|
| change | Triggers when user confirms the value | Function |
| blur | Triggers when input blurs | Function |
| focus | Triggers when input focuses | Function |
| calendar-change | Triggers when the calendar selected date is changed | Function |
| panel-change | Triggers when the calendar panel changes | Function |
| visible-change | Triggers when the dropdown appears/disappears | Function |

### DateTimePicker Methods

| Name | Description | Type |
|------|-------------|------|
| focus | Focus the input element | Function |
| blur | Blur the input element | Function |

## Practice Exercises

### Exercise 1: Appointment System

Create a complete appointment system:

```vue
<template>
  <div class="appointment-system">
    <h3>Online Appointment System</h3>
    
    <div class="appointment-form">
      <h4>Appointment Information</h4>
      
      <div class="form-grid">
        <div class="form-item">
          <label>Appointment Type:</label>
          <el-select v-model="appointment.type" placeholder="Select appointment type">
            <el-option label="Medical Consultation" value="medical" />
            <el-option label="Legal Consultation" value="legal" />
            <el-option label="Technical Support" value="technical" />
            <el-option label="Business Meeting" value="business" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Appointment Time:</label>
          <el-date-picker
            v-model="appointment.datetime"
            type="datetime"
            placeholder="Select appointment time"
            :shortcuts="appointmentShortcuts"
            :disabled-date="disabledAppointmentDates"
            :disabled-hours="disabledAppointmentHours"
            :disabled-minutes="disabledAppointmentMinutes"
          />
        </div>
        
        <div class="form-item">
          <label>Expected Duration:</label>
          <el-select v-model="appointment.duration" placeholder="Select duration">
            <el-option label="30 minutes" :value="30" />
            <el-option label="1 hour" :value="60" />
            <el-option label="1.5 hours" :value="90" />
            <el-option label="2 hours" :value="120" />
          </el-select>
        </div>
        
        <div class="form-item full-width">
          <label>Description:</label>
          <el-input
            v-model="appointment.description"
            type="textarea"
            :rows="3"
            placeholder="Please briefly describe your appointment"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <el-button type="primary" @click="submitAppointment">Submit</el-button>
        <el-button @click="resetAppointment">Reset</el-button>
      </div>
    </div>
    
    <div class="appointment-calendar">
      <h4>Appointment Calendar</h4>
      <div class="calendar-placeholder">
        <p>Calendar View</p>
        <p>Shows already booked time slots</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const appointment = ref({
  type: '',
  datetime: '',
  duration: 60,
  description: ''
})

const appointmentShortcuts = [
  {
    text: 'Tomorrow at 9 AM',
    value: () => {
      const tomorrow = dayjs().add(1, 'day')
      return tomorrow.hour(9).minute(0).second(0).toDate()
    }
  },
  {
    text: 'Tomorrow at 2 PM',
    value: () => {
      const tomorrow = dayjs().add(1, 'day')
      return tomorrow.hour(14).minute(0).second(0).toDate()
    }
  },
  {
    text: 'Day after tomorrow at 10 AM',
    value: () => {
      const dayAfterTomorrow = dayjs().add(2, 'day')
      return dayAfterTomorrow.hour(10).minute(0).second(0).toDate()
    }
  }
]

const disabledAppointmentDates = (time) => {
  // Disable past dates and weekends
  const day = time.getDay()
  const isPast = time.getTime() < Date.now() - 24 * 60 * 60 * 1000
  const isWeekend = day === 0 || day === 6
  
  return isPast || isWeekend
}

const disabledAppointmentHours = () => {
  // Only allow working hours 9:00-17:00
  const hours = []
  for (let i = 0; i < 9; i++) {
    hours.push(i)
  }
  for (let i = 17; i < 24; i++) {
    hours.push(i)
  }
  return hours
}

const disabledAppointmentMinutes = (hour) => {
  // Only allow on the hour and half hour
  const minutes = []
  for (let i = 1; i < 60; i++) {
    if (i !== 30) {
      minutes.push(i)
    }
  }
  return minutes
}

const submitAppointment = () => {
  if (!appointment.value.type) {
    ElMessage.warning('Please select appointment type')
    return
  }
  
  if (!appointment.value.datetime) {
    ElMessage.warning('Please select appointment time')
    return
  }
  
  ElMessage.success('Appointment submitted successfully, we will contact you shortly to confirm')
  resetAppointment()
}

const resetAppointment = () => {
  appointment.value = {
    type: '',
    datetime: '',
    duration: 60,
    description: ''
  }
}
</script>

<style scoped>
.appointment-system {
  max-width: 800px;
  padding: 20px;
}

.appointment-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.appointment-form h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item.full-width {
  grid-column: 1 / -1;
}

.form-item label {
  font-weight: 500;
  color: #303133;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.appointment-calendar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.appointment-calendar h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.calendar-placeholder {
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}
</style>
```

### Exercise 2: Log Query System

Create a time filter component for log queries:

```vue
<template>
  <div class="log-query-system">
    <h3>System Log Query</h3>
    
    <div class="query-form">
      <h4>Query Criteria</h4>
      
      <div class="query-grid">
        <div class="query-item">
          <label>Log Level:</label>
          <el-select v-model="queryForm.level" placeholder="Select log level" multiple>
            <el-option label="DEBUG" value="debug" />
            <el-option label="INFO" value="info" />
            <el-option label="WARN" value="warn" />
            <el-option label="ERROR" value="error" />
            <el-option label="FATAL" value="fatal" />
          </el-select>
        </div>
        
        <div class="query-item">
          <label>Time Range:</label>
          <el-date-picker
            v-model="queryForm.timeRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="logShortcuts"
            @change="handleTimeRangeChange"
          />
        </div>
        
        <div class="query-item">
          <label>Keyword:</label>
          <el-input
            v-model="queryForm.keyword"
            placeholder="Enter keyword to search"
            clearable
          />
        </div>
        
        <div class="query-item">
          <label>Service Module:</label>
          <el-select v-model="queryForm.module" placeholder="Select service module">
            <el-option label="All" value="" />
            <el-option label="User Service" value="user" />
            <el-option label="Order Service" value="order" />
            <el-option label="Payment Service" value="payment" />
            <el-option label="Notification Service" value="notification" />
          </el-select>
        </div>
      </div>
      
      <div class="query-actions">
        <el-button type="primary" @click="searchLogs">Query Logs</el-button>
        <el-button @click="resetQuery">Reset</el-button>
        <el-button @click="exportLogs">Export Logs</el-button>
      </div>
    </div>
    
    <div class="log-results">
      <h4>Query Results</h4>
      
      <div class="result-info">
        <span>Found {{ totalLogs }} logs</span>
        <span v-if="queryForm.timeRange">Time Range: {{ formatQueryTimeRange() }}</span>
      </div>
      
      <div class="log-list">
        <div
          v-for="log in logs"
          :key="log.id"
          class="log-item"
          :class="`level-${log.level}`"
        >
          <div class="log-header">
            <div class="log-time">{{ formatLogTime(log.timestamp) }}</div>
            <div class="log-level">
              <el-tag :type="getLevelColor(log.level)" size="small">
                {{ log.level.toUpperCase() }}
              </el-tag>
            </div>
            <div class="log-module">{{ log.module }}</div>
          </div>
          
          <div class="log-message">{{ log.message }}</div>
          
          <div v-if="log.details" class="log-details">
            <el-collapse>
              <el-collapse-item title="Details">
                <pre>{{ log.details }}</pre>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        
        <div v-if="logs.length === 0" class="no-logs">
          No logs found
        </div>
      </div>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalLogs"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const queryForm = ref({
  level: [],
  timeRange: '',
  keyword: '',
  module: ''
})

const currentPage = ref(1)
const pageSize = ref(20)
const totalLogs = ref(156)

const logs = ref([
  {
    id: 1,
    timestamp: new Date('2024-01-15 10:30:25'),
    level: 'info',
    module: 'user',
    message: 'User login successful',
    details: 'User ID: 12345\nIP: 192.168.1.100\nUser-Agent: Mozilla/5.0...'
  },
  {
    id: 2,
    timestamp: new Date('2024-01-15 10:32:15'),
    level: 'warn',
    module: 'order',
    message: 'Order inventory low warning',
    details: 'Product ID: 67890\nRequested: 10\nAvailable: 5'
  },
  {
    id: 3,
    timestamp: new Date('2024-01-15 10:35:42'),
    level: 'error',
    module: 'payment',
    message: 'Payment API call failed',
    details: 'Error Code: 500\nError Message: Internal Server Error\nRequest ID: req_123456'
  }
])

const logShortcuts = [
  {
    text: 'Last 1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: 'Last 6 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 6)
      return [start, end]
    }
  },
  {
    text: 'Today',
    value: () => {
      const start = dayjs().startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    text: 'Yesterday',
    value: () => {
      const start = dayjs().subtract(1, 'day').startOf('day').toDate()
      const end = dayjs().subtract(1, 'day').endOf('day').toDate()
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

const handleTimeRangeChange = (value) => {
  if (value && Array.isArray(value)) {
    const [start, end] = value
    const duration = dayjs(end).diff(dayjs(start), 'day')
    
    if (duration > 30) {
      ElMessage.warning('Query time range cannot exceed 30 days')
      queryForm.value.timeRange = ''
    }
  }
}

const searchLogs = () => {
  if (!queryForm.value.timeRange) {
    ElMessage.warning('Please select a time range')
    return
  }
  
  ElMessage.success('Query completed')
  currentPage.value = 1
}

const resetQuery = () => {
  queryForm.value = {
    level: [],
    timeRange: '',
    keyword: '',
    module: ''
  }
  currentPage.value = 1
}

const exportLogs = () => {
  if (!queryForm.value.timeRange) {
    ElMessage.warning('Please set query criteria first')
    return
  }
  
  ElMessage.success('Log export task submitted, please download later')
}

const formatQueryTimeRange = () => {
  if (!queryForm.value.timeRange || !Array.isArray(queryForm.value.timeRange)) return ''
  
  const [start, end] = queryForm.value.timeRange
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  return `${startStr} to ${endStr}`
}

const formatLogTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const getLevelColor = (level) => {
  const colors = {
    debug: 'info',
    info
# DateTime Picker

## Overview

DateTime Picker is a combination of Date Picker and Time Picker, allowing users to select both date and time simultaneously. It provides flexible configuration options, supports various date-time formats and selection modes, making it an ideal choice for handling complete time information.

## Learning Objectives

- Master the basic concepts and use cases of DateTime Picker
- Learn how to implement basic date-time selection functionality
- Understand date-time range selection
- Master date-time formatting and display
- Learn how to disable dates/times and limit selections
- Understand custom date-time pickers
- Master the application of date-time pickers in real projects
- Master the complete usage of the API

## Basic Usage

### Basic Date-Time Selection

The simplest date-time picker:

```vue
<template>
  <div>
    <h4>Basic Date-Time Selection</h4>
    <el-date-picker
      v-model="datetime1"
      type="datetime"
      placeholder="Select date and time"
    />
    <p>Selected date and time: {{ datetime1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime1 = ref('')
</script>
```

### Date-Time Range Selection

Select a date-time range:

```vue
<template>
  <div>
    <h4>Date-Time Range Selection</h4>
    <el-date-picker
      v-model="datetimeRange"
      type="datetimerange"
      range-separator="to"
      start-placeholder="Start date and time"
      end-placeholder="End date and time"
    />
    <p>Selected date-time range: {{ datetimeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetimeRange = ref('')
</script>
```

### Default Time Setting

Set default time for the date picker:

```vue
<template>
  <div>
    <h4>Default Time Setting</h4>
    <el-date-picker
      v-model="datetime2"
      type="datetime"
      placeholder="Select date and time"
      :default-time="defaultTime"
    />
    <p>Default time is 12:00:00</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime2 = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
</script>
```

### Date-Time Formatting

Customize date-time display format:

```vue
<template>
  <div>
    <h4>Date-Time Formatting</h4>
    <div class="format-demo">
      <div class="format-item">
        <label>Standard format:</label>
        <el-date-picker
          v-model="datetime3"
          type="datetime"
          placeholder="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>Custom format:</label>
        <el-date-picker
          v-model="datetime4"
          type="datetime"
          placeholder="YYYY/MM/DD HH:mm"
          format="YYYY/MM/DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>12-hour format:</label>
        <el-date-picker
          v-model="datetime5"
          type="datetime"
          placeholder="YYYY/MM/DD hh:mm:ss A"
          format="YYYY/MM/DD hh:mm:ss A"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
    </div>
    
    <div class="format-result">
      <p>Standard format: {{ datetime3 }}</p>
      <p>Custom format: {{ datetime4 }}</p>
      <p>12-hour format: {{ datetime5 }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime3 = ref('')
const datetime4 = ref('')
const datetime5 = ref('')
</script>

<style scoped>
.format-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-item label {
  width: 100px;
  font-weight: 500;
  color: #303133;
}

.format-result {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.format-result p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

## Advanced Features

### Disabling Date-Time

Disable specific dates or times:

```vue
<template>
  <div>
    <h4>Disabling Date-Time</h4>
    <div class="disabled-demo">
      <div class="disabled-item">
        <label>Disable past dates:</label>
        <el-date-picker
          v-model="datetime6"
          type="datetime"
          placeholder="Only future times allowed"
          :disabled-date="disabledPastDates"
        />
      </div>
      
      <div class="disabled-item">
        <label>Disable non-working hours:</label>
        <el-date-picker
          v-model="datetime7"
          type="datetime"
          placeholder="Only working hours allowed"
          :disabled-date="disabledWeekends"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime6 = ref('')
const datetime7 = ref('')

const disabledPastDates = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const disabledWeekends = (time) => {
  const day = time.getDay()
  return day === 0 || day === 6 // Disable weekends
}

const disabledHours = () => {
  const hours = []
  for (let i = 0; i < 9; i++) {
    hours.push(i)
  }
  for (let i = 18; i < 24; i++) {
    hours.push(i)
  }
  return hours
}

const disabledMinutes = (hour) => {
  // No restrictions on minutes during working hours
  return []
}
</script>

<style scoped>
.disabled-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.disabled-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.disabled-item label {
  width: 150px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### Shortcuts

Provide commonly used date-time shortcuts:

```vue
<template>
  <div>
    <h4>Shortcuts</h4>
    <div class="shortcuts-demo">
      <div class="shortcuts-item">
        <label>Single date-time:</label>
        <el-date-picker
          v-model="datetime8"
          type="datetime"
          placeholder="Select date and time"
          :shortcuts="datetimeShortcuts"
        />
      </div>
      
      <div class="shortcuts-item">
        <label>Date-time range:</label>
        <el-date-picker
          v-model="datetimeRange2"
          type="datetimerange"
          range-separator="to"
          start-placeholder="Start time"
          end-placeholder="End time"
          :shortcuts="rangeShortcuts"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime8 = ref('')
const datetimeRange2 = ref('')

const datetimeShortcuts = [
  {
    text: 'Now',
    value: new Date()
  },
  {
    text: 'Today at 9 AM',
    value: () => {
      const date = new Date()
      date.setHours(9, 0, 0, 0)
      return date
    }
  },
  {
    text: 'Today at 6 PM',
    value: () => {
      const date = new Date()
      date.setHours(18, 0, 0, 0)
      return date
    }
  },
  {
    text: 'Tomorrow at 9 AM',
    value: () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      date.setHours(9, 0, 0, 0)
      return date
    }
  }
]

const rangeShortcuts = [
  {
    text: 'Last 1 hour',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: 'Last 6 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 6)
      return [start, end]
    }
  },
  {
    text: 'Last 24 hours',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: 'Last 7 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last 30 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]
</script>

<style scoped>
.shortcuts-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shortcuts-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.shortcuts-item label {
  width: 150px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### Different Sizes

Provide date-time pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
    <div class="size-demo">
      <el-date-picker
        v-model="datetime9"
        type="datetime"
        size="large"
        placeholder="Large size"
      />
      <el-date-picker
        v-model="datetime10"
        type="datetime"
        placeholder="Default size"
      />
      <el-date-picker
        v-model="datetime11"
        type="datetime"
        size="small"
        placeholder="Small size"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime9 = ref('')
const datetime10 = ref('')
const datetime11 = ref('')
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

## Practical Application Examples

### Event Management System

Create a date-time selection component for event management:

```vue
<template>
  <div class="event-management">
    <h3>Event Management System</h3>
    
    <div class="event-form">
      <h4>Create Event</h4>
      
      <div class="form-section">
        <div class="form-item">
          <label>Event Name:</label>
          <el-input v-model="eventForm.name" placeholder="Enter event name" />
        </div>
        
        <div class="form-item">
          <label>Event Type:</label>
          <el-select v-model="eventForm.type" placeholder="Select event type">
            <el-option label="Meeting" value="meeting" />
            <el-option label="Training" value="training" />
            <el-option label="Activity" value="activity" />
            <el-option label="Other" value="other" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Event Time:</label>
          <el-date-picker
            v-model="eventForm.timeRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="eventShortcuts"
            :disabled-date="disabledEventDates"
            @change="handleTimeChange"
          />
        </div>
        
        <div v-if="eventDuration" class="duration-display">
          <span class="duration-label">Event Duration:</span>
          <span class="duration-value">{{ eventDuration }}</span>
        </div>
        
        <div class="form-item">
          <label>Reminder:</label>
          <el-select v-model="eventForm.reminder" placeholder="Select reminder time">
            <el-option label="No reminder" value="none" />
            <el-option label="15 minutes before" value="15min" />
            <el-option label="30 minutes before" value="30min" />
            <el-option label="1 hour before" value="1hour" />
            <el-option label="1 day before" value="1day" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>Description:</label>
          <el-input
            v-model="eventForm.description"
            type="textarea"
            :rows="3"
            placeholder="Enter event description"
          />
        </div>
        
        <div class="form-actions">
          <el-button type="primary" @click="createEvent">Create Event</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </div>
      </div>
    </div>
    
    <div class="event-list">
      <h4>Event List</h4>
      
      <div class="filter-bar">
        <el-date-picker
          v-model="filterDate"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
          @change="filterEvents"
        />
        <el-select v-model="filterType" placeholder="Event type" @change="filterEvents">
          <el-option label="All" value="" />
          <el-option label="Meeting" value="meeting" />
          <el-option label="Training" value="training" />
          <el-option label="Activity" value="activity" />
          <el-option label="Other" value="other" />
        </el-select>
      </div>
      
      <div class="events">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          class="event-item"
          :class="getEventStatus(event)"
        >
          <div class="event-header">
            <div class="event-title">{{ event.name }}</div>
            <div class="event-type">
              <el-tag :type="getTypeColor(event.type)" size="small">
                {{ getTypeName(event.type) }}
              </el-tag>
            </div>
          </div>
          
          <div class="event-time">
            <el-icon><Clock /></el-icon>
            <span>{{ formatEventTime(event.timeRange) }}</span>
          </div>
          
          <div v-if="event.description" class="event-description">
            {{ event.description }}
          </div>
          
          <div class="event-actions">
            <el-button size="small" @click="editEvent(event)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteEvent(event.id)">Delete</el-button>
          </div>
        </div>
        
        <div v-if="filteredEvents.length === 0" class="no-events">
          No events found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const eventForm = ref({
  name: '',
  type: '',
  timeRange: '',
  reminder: 'none',
  description: ''
})

const events = ref([
  {
    id: 1,
    name: 'Project Kickoff Meeting',
    type: 'meeting',
    timeRange: [new Date('2024-01-15 09:00:00'), new Date('2024-01-15 11:00:00')],
    reminder: '30min',
    description: 'Discuss project plan and assignments'
  },
  {
    id: 2,
    name: 'Vue 3 Training',
    type: 'training',
    timeRange: [new Date('2024-01-16 14:00:00'), new Date('2024-01-16 17:00:00')],
    reminder: '1hour',
    description: 'Learning Vue 3 new features'
  }
])

const filterDate = ref('')
const filterType = ref('')

const eventDuration = computed(() => {
  if (!eventForm.value.timeRange || !Array.isArray(eventForm.value.timeRange)) {
    return ''
  }
  
  const [start, end] = eventForm.value.timeRange
  if (!start || !end) return ''
  
  const duration = dayjs(end).diff(dayjs(start), 'minute')
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60
  
  if (hours === 0) {
    return `${minutes} minutes`
  } else if (minutes === 0) {
    return `${hours} hours`
  } else {
    return `${hours} hours ${minutes} minutes`
  }
})

const filteredEvents = computed(() => {
  let result = events.value
  
  if (filterDate.value && Array.isArray(filterDate.value)) {
    const [start, end] = filterDate.value
    result = result.filter(event => {
      const eventStart = dayjs(event.timeRange[0])
      return eventStart.isAfter(dayjs(start)) && eventStart.isBefore(dayjs(end).add(1, 'day'))
    })
  }
  
  if (filterType.value) {
    result = result.filter(event => event.type === filterType.value)
  }
  
  return result.sort((a, b) => new Date(a.timeRange[0]) - new Date(b.timeRange[0]))
})

const eventShortcuts = [
  {
    text: 'Today morning',
    value: () => {
      const start = new Date()
      start.setHours(9, 0, 0, 0)
      const end = new Date()
      end.setHours(12, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Today afternoon',
    value: () => {
      const start = new Date()
      start.setHours(14, 0, 0, 0)
      const end = new Date()
      end.setHours(18, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Tomorrow morning',
    value: () => {
      const start = new Date()
      start.setDate(start.getDate() + 1)
      start.setHours(9, 0, 0, 0)
      const end = new Date()
      end.setDate(end.getDate() + 1)
      end.setHours(12, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: 'Next Monday morning',
    value: () => {
      const today = new Date()
      const nextMonday = new Date(today)
      nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7)
      nextMonday.setHours(9, 0, 0, 0)
      
      const end = new Date(nextMonday)
      end.setHours(12, 0, 0, 0)
      
      return [nextMonday, end]
    }
  }
]

const disabledEventDates = (time) => {
  // Disable past dates
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const handleTimeChange = (value) => {
  if (value && Array.isArray(value)) {
    const [start, end] = value
    if (dayjs(end).diff(dayjs(start), 'minute') < 30) {
      ElMessage.warning('Event duration cannot be less than 30 minutes')
      eventForm.value.timeRange = ''
    }
  }
}

const createEvent = () => {
  if (!eventForm.value.name) {
    ElMessage.warning('Please enter event name')
    return
  }
  
  if (!eventForm.value.type) {
    ElMessage.warning('Please select event type')
    return
  }
  
  if (!eventForm.value.timeRange) {
    ElMessage.warning('Please select event time')
    return
  }
  
  const newEvent = {
    id: Date.now(),
    ...eventForm.value
  }
  
  events.value.push(newEvent)
  ElMessage.success('Event created successfully')
  resetForm()
}

const resetForm = () => {
  eventForm.value = {
    name: '',
    type: '',
    timeRange: '',
    reminder: 'none',
    description: ''
  }
}

const editEvent = (event) => {
  eventForm.value = { ...event }
}

const deleteEvent = (eventId) => {
  const index = events.value.findIndex(e => e.id === eventId)
  if (index > -1) {
    events.value.splice(index, 1)
    ElMessage.success('Event deleted successfully')
  }
}

const filterEvents = () => {
  // Filtering logic is handled in computed property
}

const getEventStatus = (event) => {
  const now = new Date()
  const start = new Date(event.timeRange[0])
  const end = new Date(event.timeRange[1])
  
  if (now < start) {
    return 'upcoming'
  } else if (now >= start && now <= end) {
    return 'ongoing'
  } else {
    return 'completed'
  }
}

const getTypeColor = (type) => {
  const colors = {
    meeting: 'primary',
    training: 'success',
    activity: 'warning',
    other: 'info'
  }
  return colors[type] || 'info'
}

const getTypeName = (type) => {
  const names = {
    meeting: 'Meeting',
    training: 'Training',
    activity: 'Activity',
    other: 'Other'
  }
  return names[type] || 'Other'
}

const formatEventTime = (timeRange) => {
  if (!timeRange || !Array.isArray(timeRange)) return ''
  
  const [start, end] = timeRange
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  if (dayjs(start).format('YYYY-MM-DD') === dayjs(end).format('YYYY-MM-DD')) {
    return `${dayjs(start).format('YYYY-MM-DD')} ${dayjs(start).format('HH:mm')} - ${dayjs(end).format('HH:mm')}`
  } else {
    return `${startStr} - ${endStr}`
  }
}
</script>

<style scoped>
.event-management {
  max-width: 1000px;
  padding: 20px;
}

.event-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.event-form h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-item label {
  width: 100px;
  font-weight: 500;
  color: #303133;
  flex-shrink: 0;
}

.duration-display {
  padding: 12px;
  background: #e1f3d8;
  border-radius: 6px;
  border-left: 4px solid #67c23a;
}

.duration-label {
  color: #529b2e;
  font-weight: 500;
}

.duration-value {
  color: #529b2e;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.event-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.event-list h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: white;
}

.event-item.upcoming {
  border-left: 4px solid #409EFF;
}

.event-item.ongoing {
  border-left: 4px solid #67c23a;
  background: #f0f9ff;
}

.event-item.completed {
  border-left: 4px solid #909399;
  background: #f5f7fa;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.event-title {
  font-weight: 500;
  color: #303133;
  font-size: 16px;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  margin-bottom: 8px;
}

.event-description {
  color: #909399;
  font-size: 14px;
  margin-bottom: 12px;
}

.event-actions {
  display: flex;
  gap: 8px;
}

.no-events {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}
</style>
```

### Data Analytics Time Filter

Create a time filter component for data analytics:

```vue
<template>
  <div class="data-analytics">
    <h3>Data Analytics</h3>
    
    <div class="time-filter">
      <h4>Time Filter</h4>
      
      <div class="filter-options">
        <div class="quick-filters">
          <el-button
            v-for="option in quickOptions"
            :key="option.key"
            :type="selectedQuick === option.key ? 'primary' : 'default'"
            size="small"
            @click="selectQuickOption(option)"
          >
            {{ option.label }}
          </el-button>
        </div>
        
        <div class="custom-range">
          <label>Custom time range:</label>
          <el-date-picker
            v-model="customRange"
            type="datetimerange"
            range-separator="to"
            start-placeholder="Start time"
            end-placeholder="End time"
            :shortcuts="rangeShortcuts"
            @change="handleCustomRangeChange"
          />
        </div>
      </div>
      
      <div class="time-info">
        <div class="info-item">
          <span class="label">Current time range:</span>
          <span class="value">{{ formatTimeRange(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Data duration:</span>
          <span class="value">{{ getDataDuration(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Data points:</span>
          <span class="value">{{ getDataPoints(currentRange) }}</span>
        </div>
      </div>
    </div>
    
    <div class="statistics-panel">
      <h4>Statistics</h4>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">Total Views</div>
          <div class="stat-value">{{ statistics.totalViews.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.viewsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.viewsChange >= 0 ? '+' : '' }}{{ statistics.viewsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Unique Visitors</div>
          <div class="stat-value">{{ statistics.uniqueVisitors.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.visitorsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.visitorsChange >= 0 ? '+' : '' }}{{ statistics.visitorsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Average Duration</div>
          <div class="stat-value">{{ formatDuration(statistics.avgDuration) }}</div>
          <div class="stat-change" :class="statistics.durationChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.durationChange >= 0 ? '+' : '' }}{{ statistics.durationChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">Conversion Rate</div>
          <div class="stat-value">{{ statistics.conversionRate }}%</div>
          <div class="stat-change" :class="statistics.conversionChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.conversionChange >= 0 ? '+' : '' }}{{ statistics.conversionChange }}%
          </div>
        </div>
      </div>
    </div>
