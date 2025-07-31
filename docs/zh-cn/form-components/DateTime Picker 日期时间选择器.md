# DateTime Picker 日期时间选择器

## 概述

DateTime Picker 日期时间选择器是 Date Picker 和 Time Picker 的组合，允许用户同时选择日期和时间。它提供了灵活的配置选项，支持多种日期时间格式和选择模式，是处理完整时间信息的理想选择。

## 学习目标

- 掌握 DateTime Picker 的基本概念和使用场景
- 学会基础日期时间选择功能的实现
- 了解日期时间范围选择
- 掌握日期时间格式化和显示
- 学会禁用日期时间和限制选择
- 了解自定义日期时间选择器
- 掌握日期时间选择器在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基本日期时间选择

最简单的日期时间选择器：

```vue
<template>
  <div>
    <h4>基本日期时间选择</h4>
    <el-date-picker
      v-model="datetime1"
      type="datetime"
      placeholder="选择日期时间"
    />
    <p>选中的日期时间：{{ datetime1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime1 = ref('')
</script>
```

### 日期时间范围选择

选择一个日期时间范围：

```vue
<template>
  <div>
    <h4>日期时间范围选择</h4>
    <el-date-picker
      v-model="datetimeRange"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期时间"
      end-placeholder="结束日期时间"
    />
    <p>选中的日期时间范围：{{ datetimeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetimeRange = ref('')
</script>
```

### 默认时间设置

为日期选择器设置默认时间：

```vue
<template>
  <div>
    <h4>默认时间设置</h4>
    <el-date-picker
      v-model="datetime2"
      type="datetime"
      placeholder="选择日期时间"
      :default-time="defaultTime"
    />
    <p>默认时间为 12:00:00</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const datetime2 = ref('')
const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
</script>
```

### 日期时间格式化

自定义日期时间显示格式：

```vue
<template>
  <div>
    <h4>日期时间格式化</h4>
    <div class="format-demo">
      <div class="format-item">
        <label>标准格式：</label>
        <el-date-picker
          v-model="datetime3"
          type="datetime"
          placeholder="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>中文格式：</label>
        <el-date-picker
          v-model="datetime4"
          type="datetime"
          placeholder="YYYY年MM月DD日 HH时mm分"
          format="YYYY年MM月DD日 HH时mm分"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </div>
      
      <div class="format-item">
        <label>12小时制：</label>
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
      <p>标准格式：{{ datetime3 }}</p>
      <p>中文格式：{{ datetime4 }}</p>
      <p>12小时制：{{ datetime5 }}</p>
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

## 高级功能

### 禁用日期时间

禁用特定的日期或时间：

```vue
<template>
  <div>
    <h4>禁用日期时间</h4>
    <div class="disabled-demo">
      <div class="disabled-item">
        <label>禁用过去日期：</label>
        <el-date-picker
          v-model="datetime6"
          type="datetime"
          placeholder="只能选择未来时间"
          :disabled-date="disabledPastDates"
        />
      </div>
      
      <div class="disabled-item">
        <label>禁用工作时间外：</label>
        <el-date-picker
          v-model="datetime7"
          type="datetime"
          placeholder="只能选择工作时间"
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
  return day === 0 || day === 6 // 禁用周末
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
  // 在工作时间内，分钟不限制
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

### 快捷选项

提供常用的日期时间快捷选项：

```vue
<template>
  <div>
    <h4>快捷选项</h4>
    <div class="shortcuts-demo">
      <div class="shortcuts-item">
        <label>单个日期时间：</label>
        <el-date-picker
          v-model="datetime8"
          type="datetime"
          placeholder="选择日期时间"
          :shortcuts="datetimeShortcuts"
        />
      </div>
      
      <div class="shortcuts-item">
        <label>日期时间范围：</label>
        <el-date-picker
          v-model="datetimeRange2"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
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
    text: '现在',
    value: new Date()
  },
  {
    text: '今天上午9点',
    value: () => {
      const date = new Date()
      date.setHours(9, 0, 0, 0)
      return date
    }
  },
  {
    text: '今天下午6点',
    value: () => {
      const date = new Date()
      date.setHours(18, 0, 0, 0)
      return date
    }
  },
  {
    text: '明天上午9点',
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
    text: '最近1小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近6小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 6)
      return [start, end]
    }
  },
  {
    text: '最近24小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
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

### 不同尺寸

提供不同尺寸的日期时间选择器：

```vue
<template>
  <div>
    <h4>不同尺寸</h4>
    <div class="size-demo">
      <el-date-picker
        v-model="datetime9"
        type="datetime"
        size="large"
        placeholder="大尺寸"
      />
      <el-date-picker
        v-model="datetime10"
        type="datetime"
        placeholder="默认尺寸"
      />
      <el-date-picker
        v-model="datetime11"
        type="datetime"
        size="small"
        placeholder="小尺寸"
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

## 实际应用示例

### 活动管理系统

创建一个活动管理的日期时间选择组件：

```vue
<template>
  <div class="event-management">
    <h3>活动管理系统</h3>
    
    <div class="event-form">
      <h4>创建活动</h4>
      
      <div class="form-section">
        <div class="form-item">
          <label>活动名称：</label>
          <el-input v-model="eventForm.name" placeholder="请输入活动名称" />
        </div>
        
        <div class="form-item">
          <label>活动类型：</label>
          <el-select v-model="eventForm.type" placeholder="请选择活动类型">
            <el-option label="会议" value="meeting" />
            <el-option label="培训" value="training" />
            <el-option label="活动" value="activity" />
            <el-option label="其他" value="other" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>活动时间：</label>
          <el-date-picker
            v-model="eventForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="eventShortcuts"
            :disabled-date="disabledEventDates"
            @change="handleTimeChange"
          />
        </div>
        
        <div v-if="eventDuration" class="duration-display">
          <span class="duration-label">活动时长：</span>
          <span class="duration-value">{{ eventDuration }}</span>
        </div>
        
        <div class="form-item">
          <label>提醒时间：</label>
          <el-select v-model="eventForm.reminder" placeholder="选择提醒时间">
            <el-option label="不提醒" value="none" />
            <el-option label="活动开始前15分钟" value="15min" />
            <el-option label="活动开始前30分钟" value="30min" />
            <el-option label="活动开始前1小时" value="1hour" />
            <el-option label="活动开始前1天" value="1day" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>活动描述：</label>
          <el-input
            v-model="eventForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入活动描述"
          />
        </div>
        
        <div class="form-actions">
          <el-button type="primary" @click="createEvent">创建活动</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </div>
    
    <div class="event-list">
      <h4>活动列表</h4>
      
      <div class="filter-bar">
        <el-date-picker
          v-model="filterDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="filterEvents"
        />
        <el-select v-model="filterType" placeholder="活动类型" @change="filterEvents">
          <el-option label="全部" value="" />
          <el-option label="会议" value="meeting" />
          <el-option label="培训" value="training" />
          <el-option label="活动" value="activity" />
          <el-option label="其他" value="other" />
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
            <el-button size="small" @click="editEvent(event)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteEvent(event.id)">删除</el-button>
          </div>
        </div>
        
        <div v-if="filteredEvents.length === 0" class="no-events">
          暂无活动
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
    name: '项目启动会议',
    type: 'meeting',
    timeRange: [new Date('2024-01-15 09:00:00'), new Date('2024-01-15 11:00:00')],
    reminder: '30min',
    description: '讨论项目计划和分工'
  },
  {
    id: 2,
    name: 'Vue 3 培训',
    type: 'training',
    timeRange: [new Date('2024-01-16 14:00:00'), new Date('2024-01-16 17:00:00')],
    reminder: '1hour',
    description: 'Vue 3 新特性学习'
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
    return `${minutes}分钟`
  } else if (minutes === 0) {
    return `${hours}小时`
  } else {
    return `${hours}小时${minutes}分钟`
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
    text: '今天上午',
    value: () => {
      const start = new Date()
      start.setHours(9, 0, 0, 0)
      const end = new Date()
      end.setHours(12, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: '今天下午',
    value: () => {
      const start = new Date()
      start.setHours(14, 0, 0, 0)
      const end = new Date()
      end.setHours(18, 0, 0, 0)
      return [start, end]
    }
  },
  {
    text: '明天上午',
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
    text: '下周一上午',
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
  // 禁用过去的日期
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const handleTimeChange = (value) => {
  if (value && Array.isArray(value)) {
    const [start, end] = value
    if (dayjs(end).diff(dayjs(start), 'minute') < 30) {
      ElMessage.warning('活动时长不能少于30分钟')
      eventForm.value.timeRange = ''
    }
  }
}

const createEvent = () => {
  if (!eventForm.value.name) {
    ElMessage.warning('请输入活动名称')
    return
  }
  
  if (!eventForm.value.type) {
    ElMessage.warning('请选择活动类型')
    return
  }
  
  if (!eventForm.value.timeRange) {
    ElMessage.warning('请选择活动时间')
    return
  }
  
  const newEvent = {
    id: Date.now(),
    ...eventForm.value
  }
  
  events.value.push(newEvent)
  ElMessage.success('活动创建成功')
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
    ElMessage.success('活动删除成功')
  }
}

const filterEvents = () => {
  // 过滤逻辑在 computed 中处理
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
    meeting: '会议',
    training: '培训',
    activity: '活动',
    other: '其他'
  }
  return names[type] || '其他'
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

### 数据统计时间筛选

创建一个数据统计的时间筛选组件：

```vue
<template>
  <div class="data-analytics">
    <h3>数据统计分析</h3>
    
    <div class="time-filter">
      <h4>时间筛选</h4>
      
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
          <label>自定义时间范围：</label>
          <el-date-picker
            v-model="customRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="rangeShortcuts"
            @change="handleCustomRangeChange"
          />
        </div>
      </div>
      
      <div class="time-info">
        <div class="info-item">
          <span class="label">当前时间范围：</span>
          <span class="value">{{ formatTimeRange(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">数据时长：</span>
          <span class="value">{{ getDataDuration(currentRange) }}</span>
        </div>
        <div class="info-item">
          <span class="label">数据点数：</span>
          <span class="value">{{ getDataPoints(currentRange) }}个</span>
        </div>
      </div>
    </div>
    
    <div class="statistics-panel">
      <h4>统计数据</h4>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">总访问量</div>
          <div class="stat-value">{{ statistics.totalViews.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.viewsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.viewsChange >= 0 ? '+' : '' }}{{ statistics.viewsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">独立访客</div>
          <div class="stat-value">{{ statistics.uniqueVisitors.toLocaleString() }}</div>
          <div class="stat-change" :class="statistics.visitorsChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.visitorsChange >= 0 ? '+' : '' }}{{ statistics.visitorsChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">平均停留时间</div>
          <div class="stat-value">{{ formatDuration(statistics.avgDuration) }}</div>
          <div class="stat-change" :class="statistics.durationChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.durationChange >= 0 ? '+' : '' }}{{ statistics.durationChange }}%
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-title">转化率</div>
          <div class="stat-value">{{ statistics.conversionRate }}%</div>
          <div class="stat-change" :class="statistics.conversionChange >= 0 ? 'positive' : 'negative'">
            {{ statistics.conversionChange >= 0 ? '+' : '' }}{{ statistics.conversionChange }}%
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-panel">
      <h4>趋势图表</h4>
      
      <div class="chart-controls">
        <el-radio-group v-model="chartType" @change="updateChart">
          <el-radio-button label="hourly">按小时</el-radio-button>
          <el-radio-button label="daily">按天</el-radio-button>
          <el-radio-button label="weekly">按周</el-radio-button>
          <el-radio-button label="monthly">按月</el-radio-button>
        </el-radio-group>
        
        <el-select v-model="chartMetric" @change="updateChart">
          <el-option label="访问量" value="views" />
          <el-option label="独立访客" value="visitors" />
          <el-option label="停留时间" value="duration" />
          <el-option label="转化率" value="conversion" />
        </el-select>
      </div>
      
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>图表区域</p>
          <p>时间范围: {{ formatTimeRange(currentRange) }}</p>
          <p>图表类型: {{ getChartTypeLabel(chartType) }}</p>
          <p>指标: {{ getMetricLabel(chartMetric) }}</p>
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
    label: '今天',
    getValue: () => {
      const start = dayjs().startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'yesterday',
    label: '昨天',
    getValue: () => {
      const start = dayjs().subtract(1, 'day').startOf('day').toDate()
      const end = dayjs().subtract(1, 'day').endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last7days',
    label: '最近7天',
    getValue: () => {
      const start = dayjs().subtract(6, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'last30days',
    label: '最近30天',
    getValue: () => {
      const start = dayjs().subtract(29, 'day').startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    key: 'thisMonth',
    label: '本月',
    getValue: () => {
      const start = dayjs().startOf('month').toDate()
      const end = dayjs().endOf('month').toDate()
      return [start, end]
    }
  },
  {
    key: 'lastMonth',
    label: '上月',
    getValue: () => {
      const start = dayjs().subtract(1, 'month').startOf('month').toDate()
      const end = dayjs().subtract(1, 'month').endOf('month').toDate()
      return [start, end]
    }
  }
]

const rangeShortcuts = [
  {
    text: '最近1小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近24小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [start, end]
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }
]

const statistics = computed(() => {
  // 模拟统计数据，实际应用中应该根据 currentRange 从后端获取
  return {
    totalViews: 125680,
    viewsChange: 12.5,
    uniqueVisitors: 8432,
    visitorsChange: -3.2,
    avgDuration: 245, // 秒
    durationChange: 8.7,
    conversionRate: 3.45,
    conversionChange: 1.2
  }
})

// 初始化当前时间范围
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
  
  return `${startStr} 至 ${endStr}`
}

const getDataDuration = (range) => {
  if (!range || !Array.isArray(range)) return ''
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  if (duration < 24) {
    return `${duration}小时`
  } else {
    const days = Math.floor(duration / 24)
    const hours = duration % 24
    return hours > 0 ? `${days}天${hours}小时` : `${days}天`
  }
}

const getDataPoints = (range) => {
  if (!range || !Array.isArray(range)) return 0
  
  const [start, end] = range
  const duration = dayjs(end).diff(dayjs(start), 'hour')
  
  // 模拟数据点数量计算
  return Math.min(duration * 60, 10000) // 假设每分钟一个数据点，最多10000个
}

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `${remainingSeconds}秒`
  } else {
    return `${minutes}分${remainingSeconds}秒`
  }
}

const updateChart = () => {
  // 更新图表逻辑
  console.log('更新图表:', chartType.value, chartMetric.value)
}

const getChartTypeLabel = (type) => {
  const labels = {
    hourly: '按小时',
    daily: '按天',
    weekly: '按周',
    monthly: '按月'
  }
  return labels[type] || type
}

const getMetricLabel = (metric) => {
  const labels = {
    views: '访问量',
    visitors: '独立访客',
    duration: '停留时间',
    conversion: '转化率'
  }
  return labels[metric] || metric
}

// 监听时间范围变化，更新图表
watch(currentRange, () => {
  updateChart()
}, { deep: true })

// 初始化
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

## API 文档

### DateTimePicker Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | Date / string / Array | — |
| readonly | 只读 | boolean | false |
| disabled | 禁用 | boolean | false |
| editable | 文本框可输入 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | true |
| size | 输入框尺寸 | enum | default |
| placeholder | 非范围选择时的占位内容 | string | — |
| start-placeholder | 范围选择时开始日期的占位内容 | string | — |
| end-placeholder | 范围选择时结束日期的占位内容 | string | — |
| type | 显示类型 | enum | date |
| format | 显示在输入框中的格式 | string | YYYY-MM-DD HH:mm:ss |
| value-format | 绑定值的格式 | string | — |
| default-value | 可选，选择器打开时默认显示的时间 | Date / string | — |
| default-time | 选中日期后的默认具体时刻 | Date / Array | — |
| range-separator | 选择范围时的分隔符 | string | '-' |
| picker-options | 当前时间日期选择器特有的选项 | object | {} |
| shortcuts | 设置快捷选项 | Array | — |
| disabled-date | 设置禁用状态，参数为当前日期 | Function | — |
| disabled-hours | 禁止选择部分小时选项 | Function | — |
| disabled-minutes | 禁止选择部分分钟选项 | Function | — |
| disabled-seconds | 禁止选择部分秒选项 | Function | — |
| cell-class-name | 设置日期的 className | Function | — |
| teleported | 是否将 picker 的下拉列表插入至 body 元素 | boolean | true |

### DateTimePicker Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 用户确认选定的值时触发 | Function |
| blur | 当 input 失去焦点时触发 | Function |
| focus | 当 input 获得焦点时触发 | Function |
| calendar-change | 如果用户没有选择日期，那默认展示当前日的月份 | Function |
| panel-change | 当日期面板改变时触发 | Function |
| visible-change | 当 DatePicker 的下拉列表出现/消失时触发 | Function |

### DateTimePicker Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

## 实践练习

### 练习1：预约系统

创建一个完整的预约系统：

```vue
<template>
  <div class="appointment-system">
    <h3>在线预约系统</h3>
    
    <div class="appointment-form">
      <h4>预约信息</h4>
      
      <div class="form-grid">
        <div class="form-item">
          <label>预约类型：</label>
          <el-select v-model="appointment.type" placeholder="请选择预约类型">
            <el-option label="医疗咨询" value="medical" />
            <el-option label="法律咨询" value="legal" />
            <el-option label="技术支持" value="technical" />
            <el-option label="商务洽谈" value="business" />
          </el-select>
        </div>
        
        <div class="form-item">
          <label>预约时间：</label>
          <el-date-picker
            v-model="appointment.datetime"
            type="datetime"
            placeholder="选择预约时间"
            :shortcuts="appointmentShortcuts"
            :disabled-date="disabledAppointmentDates"
            :disabled-hours="disabledAppointmentHours"
            :disabled-minutes="disabledAppointmentMinutes"
          />
        </div>
        
        <div class="form-item">
          <label>预计时长：</label>
          <el-select v-model="appointment.duration" placeholder="选择时长">
            <el-option label="30分钟" :value="30" />
            <el-option label="1小时" :value="60" />
            <el-option label="1.5小时" :value="90" />
            <el-option label="2小时" :value="120" />
          </el-select>
        </div>
        
        <div class="form-item full-width">
          <label>预约说明：</label>
          <el-input
            v-model="appointment.description"
            type="textarea"
            :rows="3"
            placeholder="请简要说明预约事项"
          />
        </div>
      </div>
      
      <div class="form-actions">
        <el-button type="primary" @click="submitAppointment">提交预约</el-button>
        <el-button @click="resetAppointment">重置</el-button>
      </div>
    </div>
    
    <div class="appointment-calendar">
      <h4>预约日历</h4>
      <div class="calendar-placeholder">
        <p>日历视图</p>
        <p>显示已预约的时间段</p>
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
    text: '明天上午9点',
    value: () => {
      const tomorrow = dayjs().add(1, 'day')
      return tomorrow.hour(9).minute(0).second(0).toDate()
    }
  },
  {
    text: '明天下午2点',
    value: () => {
      const tomorrow = dayjs().add(1, 'day')
      return tomorrow.hour(14).minute(0).second(0).toDate()
    }
  },
  {
    text: '后天上午10点',
    value: () => {
      const dayAfterTomorrow = dayjs().add(2, 'day')
      return dayAfterTomorrow.hour(10).minute(0).second(0).toDate()
    }
  }
]

const disabledAppointmentDates = (time) => {
  // 禁用过去的日期和周末
  const day = time.getDay()
  const isPast = time.getTime() < Date.now() - 24 * 60 * 60 * 1000
  const isWeekend = day === 0 || day === 6
  
  return isPast || isWeekend
}

const disabledAppointmentHours = () => {
  // 只允许工作时间 9:00-17:00
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
  // 只允许整点和半点
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
    ElMessage.warning('请选择预约类型')
    return
  }
  
  if (!appointment.value.datetime) {
    ElMessage.warning('请选择预约时间')
    return
  }
  
  ElMessage.success('预约提交成功，我们会尽快与您联系确认')
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

### 练习2：日志查询系统

创建一个日志查询的时间筛选组件：

```vue
<template>
  <div class="log-query-system">
    <h3>系统日志查询</h3>
    
    <div class="query-form">
      <h4>查询条件</h4>
      
      <div class="query-grid">
        <div class="query-item">
          <label>日志级别：</label>
          <el-select v-model="queryForm.level" placeholder="选择日志级别" multiple>
            <el-option label="DEBUG" value="debug" />
            <el-option label="INFO" value="info" />
            <el-option label="WARN" value="warn" />
            <el-option label="ERROR" value="error" />
            <el-option label="FATAL" value="fatal" />
          </el-select>
        </div>
        
        <div class="query-item">
          <label>时间范围：</label>
          <el-date-picker
            v-model="queryForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="logShortcuts"
            @change="handleTimeRangeChange"
          />
        </div>
        
        <div class="query-item">
          <label>关键词：</label>
          <el-input
            v-model="queryForm.keyword"
            placeholder="输入关键词搜索"
            clearable
          />
        </div>
        
        <div class="query-item">
          <label>服务模块：</label>
          <el-select v-model="queryForm.module" placeholder="选择服务模块">
            <el-option label="全部" value="" />
            <el-option label="用户服务" value="user" />
            <el-option label="订单服务" value="order" />
            <el-option label="支付服务" value="payment" />
            <el-option label="通知服务" value="notification" />
          </el-select>
        </div>
      </div>
      
      <div class="query-actions">
        <el-button type="primary" @click="searchLogs">查询日志</el-button>
        <el-button @click="resetQuery">重置条件</el-button>
        <el-button @click="exportLogs">导出日志</el-button>
      </div>
    </div>
    
    <div class="log-results">
      <h4>查询结果</h4>
      
      <div class="result-info">
        <span>共找到 {{ totalLogs }} 条日志</span>
        <span v-if="queryForm.timeRange">时间范围: {{ formatQueryTimeRange() }}</span>
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
              <el-collapse-item title="详细信息">
                <pre>{{ log.details }}</pre>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        
        <div v-if="logs.length === 0" class="no-logs">
          暂无日志数据
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
    message: '用户登录成功',
    details: 'User ID: 12345\nIP: 192.168.1.100\nUser-Agent: Mozilla/5.0...'
  },
  {
    id: 2,
    timestamp: new Date('2024-01-15 10:32:15'),
    level: 'warn',
    module: 'order',
    message: '订单库存不足警告',
    details: 'Product ID: 67890\nRequested: 10\nAvailable: 5'
  },
  {
    id: 3,
    timestamp: new Date('2024-01-15 10:35:42'),
    level: 'error',
    module: 'payment',
    message: '支付接口调用失败',
    details: 'Error Code: 500\nError Message: Internal Server Error\nRequest ID: req_123456'
  }
])

const logShortcuts = [
  {
    text: '最近1小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近6小时',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 6)
      return [start, end]
    }
  },
  {
    text: '今天',
    value: () => {
      const start = dayjs().startOf('day').toDate()
      const end = dayjs().endOf('day').toDate()
      return [start, end]
    }
  },
  {
    text: '昨天',
    value: () => {
      const start = dayjs().subtract(1, 'day').startOf('day').toDate()
      const end = dayjs().subtract(1, 'day').endOf('day').toDate()
      return [start, end]
    }
  },
  {
    text: '最近7天',
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
      ElMessage.warning('查询时间范围不能超过30天')
      queryForm.value.timeRange = ''
    }
  }
}

const searchLogs = () => {
  if (!queryForm.value.timeRange) {
    ElMessage.warning('请选择查询时间范围')
    return
  }
  
  ElMessage.success('查询完成')
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
    ElMessage.warning('请先设置查询条件')
    return
  }
  
  ElMessage.success('日志导出任务已提交，请稍后下载')
}

const formatQueryTimeRange = () => {
  if (!queryForm.value.timeRange || !Array.isArray(queryForm.value.timeRange)) return ''
  
  const [start, end] = queryForm.value.timeRange
  const startStr = dayjs(start).format('YYYY-MM-DD HH:mm')
  const endStr = dayjs(end).format('YYYY-MM-DD HH:mm')
  
  return `${startStr} 至 ${endStr}`
}

const formatLogTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const getLevelColor = (level) => {
  const colors = {
    debug: 'info',
    info: 'success',
    warn: 'warning',
    error: 'danger',
    fatal: 'danger'
  }
  return colors[level] || 'info'
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.log-query-system {
  max-width: 1200px;
  padding: 20px;
}

.query-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.query-form h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.query-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.query-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.query-item label {
  font-weight: 500;
  color: #303133;
}

.query-actions {
  display: flex;
  gap: 12px;
}

.log-results {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.log-results h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.result-info {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  color: #606266;
  font-size: 14px;
}

.log-list {
  margin-bottom: 20px;
}

.log-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 12px;
  background: white;
}

.log-item.level-error,
.log-item.level-fatal {
  border-left: 4px solid #f56c6c;
  background: #fef0f0;
}

.log-item.level-warn {
  border-left: 4px solid #e6a23c;
  background: #fdf6ec;
}

.log-item.level-info {
  border-left: 4px solid #409eff;
  background: #ecf5ff;
}

.log-item.level-debug {
  border-left: 4px solid #909399;
  background: #f4f4f5;
}

.log-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
}

.log-time {
  color: #606266;
  font-family: monospace;
  font-size: 14px;
}

.log-module {
  color: #909399;
  font-size: 12px;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.log-message {
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.5;
}

.log-details pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  white-space: pre-wrap;
  word-break: break-all;
}

.no-logs {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
```

## 常见问题

### 1. 日期时间格式问题

**问题**：如何处理不同的日期时间格式？

**解决方案**：

```javascript
// 使用 format 和 value-format 属性
const formatOptions = {
  // 显示格式
  format: 'YYYY年MM月DD日 HH时mm分ss秒',
  // 绑定值格式
  valueFormat: 'YYYY-MM-DD HH:mm:ss'
}

// 手动格式化
import dayjs from 'dayjs'

const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}
```

### 2. 时区处理

**问题**：如何处理不同时区的日期时间？

**解决方案**：

```javascript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// 转换为特定时区
const convertToTimezone = (date, tz = 'Asia/Shanghai') => {
  return dayjs(date).tz(tz)
}

// 获取 UTC 时间
const getUTCTime = (date) => {
  return dayjs(date).utc()
}
```

### 3. 性能优化

**问题**：大量日期时间选择器导致页面卡顿？

**解决方案**：

```vue
<template>
  <!-- 使用 v-show 而不是 v-if -->
  <el-date-picker
    v-show="showPicker"
    v-model="datetime"
    type="datetime"
    :teleported="false"
  />
</template>

<script setup>
// 延迟加载
import { defineAsyncComponent } from 'vue'

const DateTimePicker = defineAsyncComponent(() =>
  import('./components/DateTimePicker.vue')
)

// 防抖处理
import { debounce } from 'lodash-es'

const handleDateChange = debounce((value) => {
  // 处理日期变化
}, 300)
</script>
```

### 4. 验证和限制

**问题**：如何添加自定义验证规则？

**解决方案**：

```javascript
// 自定义验证函数
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return '请选择完整的日期范围'
  }
  
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  
  if (end.isBefore(start)) {
    return '结束时间不能早于开始时间'
  }
  
  if (end.diff(start, 'day') > 365) {
    return '日期范围不能超过一年'
  }
  
  return true
}

// 在表单中使用
const rules = {
  dateRange: [
    {
      validator: (rule, value, callback) => {
        const result = validateDateRange(value[0], value[1])
        if (result === true) {
          callback()
        } else {
          callback(new Error(result))
        }
      },
      trigger: 'change'
    }
  ]
}
```

## 最佳实践

### 1. 用户体验优化

- **提供快捷选项**：为常用的日期时间范围提供快捷按钮
- **智能默认值**：根据业务场景设置合理的默认时间
- **清晰的提示**：使用明确的占位符和标签
- **即时反馈**：在用户选择时提供即时的验证反馈

### 2. 数据处理

- **统一格式**：在应用中使用统一的日期时间格式
- **时区处理**：明确处理时区转换，避免时间错乱
- **边界检查**：设置合理的日期时间范围限制
- **数据验证**：在前端和后端都进行日期时间验证

### 3. 性能考虑

- **按需加载**：对于复杂的日期时间组件使用异步加载
- **防抖处理**：对频繁的日期变化事件进行防抖处理
- **缓存策略**：缓存常用的日期时间计算结果
- **虚拟滚动**：对于大量日期数据使用虚拟滚动

### 4. 可访问性

- **键盘导航**：确保组件支持键盘操作
- **屏幕阅读器**：提供适当的 ARIA 标签
- **对比度**：确保足够的颜色对比度
- **焦点管理**：合理管理焦点状态

## 总结

DateTime Picker 日期时间选择器是处理时间相关数据的重要组件。通过本章的学习，你应该掌握了：

1. **基础功能**：日期时间选择、范围选择、格式化等
2. **高级特性**：禁用规则、快捷选项、自定义验证等
3. **实际应用**：活动管理、数据统计、日志查询等场景
4. **最佳实践**：性能优化、用户体验、可访问性等

在实际项目中，要根据具体的业务需求选择合适的配置选项，注意处理时区、格式化和验证等细节问题，确保为用户提供良好的日期时间选择体验。

## 参考资料

- [Element Plus DateTimePicker 官方文档](https://element-plus.org/zh-CN/component/datetime-picker.html)
- [Day.js 官方文档](https://dayjs.gitee.io/zh-CN/)
- [JavaScript Date 对象 MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [时区处理最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)