# Time Picker 时间选择器

## 概述

Time Picker 时间选择器是一个用于选择时间的组件，支持多种时间选择模式，包括单时间、时间范围等选择方式。它提供了丰富的配置选项和自定义功能，能够满足各种时间选择需求。

## 学习目标

- 掌握 Time Picker 的基本概念和使用场景
- 学会基础时间选择功能的实现
- 了解时间范围选择和时间限制
- 掌握时间格式化和显示
- 学会禁用时间和步长配置
- 了解自定义时间选择器
- 掌握时间选择器在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基本时间选择

最简单的时间选择器：

```vue
<template>
  <div>
    <h4>基本时间选择</h4>
    <el-time-picker
      v-model="time1"
      placeholder="选择时间"
    />
    <p>选中的时间：{{ time1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref('')
</script>
```

### 限制时间范围

限制可选择的时间范围：

```vue
<template>
  <div>
    <h4>限制时间范围</h4>
    <el-time-picker
      v-model="time2"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      placeholder="选择时间"
    />
    <p>只能选择 9:00-18:00 的时间</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time2 = ref('')

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

const disabledSeconds = (hour, minute) => {
  // 秒数不限制
  return []
}
</script>
```

### 时间范围选择

选择一个时间范围：

```vue
<template>
  <div>
    <h4>时间范围选择</h4>
    <el-time-picker
      v-model="timeRange"
      is-range
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
    />
    <p>选中的时间范围：{{ timeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timeRange = ref('')
</script>
```

### 固定时间点

提供固定的时间点选择：

```vue
<template>
  <div>
    <h4>固定时间点</h4>
    <el-time-select
      v-model="time3"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="选择时间"
    />
    <p>选中的时间：{{ time3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time3 = ref('')
</script>
```

### 时间格式化

自定义时间显示格式：

```vue
<template>
  <div>
    <h4>时间格式化</h4>
    <el-time-picker
      v-model="time4"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      placeholder="选择时间"
    />
    <p>格式化后的时间：{{ time4 }}</p>
    
    <el-time-picker
      v-model="time5"
      format="hh:mm:ss A"
      value-format="HH:mm:ss"
      placeholder="12小时制"
    />
    <p>12小时制时间：{{ time5 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time4 = ref('')
const time5 = ref('')
</script>
```

## 高级功能

### 步长设置

设置时间选择的步长：

```vue
<template>
  <div>
    <h4>步长设置</h4>
    <div class="step-demo">
      <div class="step-item">
        <label>5分钟步长：</label>
        <el-time-select
          v-model="stepTime1"
          start="00:00"
          step="00:05"
          end="23:59"
          placeholder="选择时间"
        />
      </div>
      
      <div class="step-item">
        <label>15分钟步长：</label>
        <el-time-select
          v-model="stepTime2"
          start="00:00"
          step="00:15"
          end="23:59"
          placeholder="选择时间"
        />
      </div>
      
      <div class="step-item">
        <label>30分钟步长：</label>
        <el-time-select
          v-model="stepTime3"
          start="00:00"
          step="00:30"
          end="23:59"
          placeholder="选择时间"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stepTime1 = ref('')
const stepTime2 = ref('')
const stepTime3 = ref('')
</script>

<style scoped>
.step-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-item label {
  width: 120px;
  font-weight: 500;
  color: #303133;
}
</style>
```

### 禁用状态

禁用时间选择器：

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    <div class="disabled-demo">
      <el-time-picker
        v-model="disabledTime"
        disabled
        placeholder="禁用状态"
      />
      
      <el-time-picker
        v-model="readonlyTime"
        readonly
        placeholder="只读状态"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const disabledTime = ref('12:30:00')
const readonlyTime = ref('15:45:30')
</script>

<style scoped>
.disabled-demo {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
```

### 不同尺寸

提供不同尺寸的时间选择器：

```vue
<template>
  <div>
    <h4>不同尺寸</h4>
    <div class="size-demo">
      <el-time-picker
        v-model="time6"
        size="large"
        placeholder="大尺寸"
      />
      <el-time-picker
        v-model="time7"
        placeholder="默认尺寸"
      />
      <el-time-picker
        v-model="time8"
        size="small"
        placeholder="小尺寸"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time6 = ref('')
const time7 = ref('')
const time8 = ref('')
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

### 可清空

添加清空功能：

```vue
<template>
  <div>
    <h4>可清空</h4>
    <el-time-picker
      v-model="clearableTime"
      clearable
      placeholder="可清空的时间选择器"
    />
    <p>选中的时间：{{ clearableTime || '未选择' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clearableTime = ref('')
</script>
```

## 实际应用示例

### 会议室预约时间选择

创建一个会议室预约的时间选择组件：

```vue
<template>
  <div class="meeting-room-booking">
    <h3>会议室预约</h3>
    
    <div class="booking-form">
      <div class="form-section">
        <h4>选择会议室</h4>
        <el-select v-model="selectedRoom" placeholder="请选择会议室">
          <el-option
            v-for="room in meetingRooms"
            :key="room.id"
            :label="room.name"
            :value="room.id"
          >
            <span>{{ room.name }}</span>
            <span class="room-capacity">({{ room.capacity }}人)</span>
          </el-option>
        </el-select>
      </div>
      
      <div class="form-section">
        <h4>选择时间段</h4>
        <div class="time-selection">
          <div class="time-item">
            <label>开始时间：</label>
            <el-time-select
              v-model="startTime"
              start="08:00"
              step="00:30"
              end="18:00"
              placeholder="选择开始时间"
              @change="handleStartTimeChange"
            />
          </div>
          
          <div class="time-item">
            <label>结束时间：</label>
            <el-time-select
              v-model="endTime"
              :start="minEndTime"
              step="00:30"
              end="18:30"
              placeholder="选择结束时间"
              :disabled="!startTime"
            />
          </div>
        </div>
        
        <div v-if="duration" class="duration-info">
          <span class="duration-label">会议时长：</span>
          <span class="duration-value">{{ duration }}</span>
        </div>
      </div>
      
      <div v-if="selectedRoom && startTime && endTime" class="booking-summary">
        <h4>预约信息</h4>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">会议室：</span>
            <span class="value">{{ getRoomName(selectedRoom) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">时间：</span>
            <span class="value">{{ startTime }} - {{ endTime }}</span>
          </div>
          <div class="summary-item">
            <span class="label">时长：</span>
            <span class="value">{{ duration }}</span>
          </div>
          <div class="summary-item">
            <span class="label">费用：</span>
            <span class="value cost">¥{{ calculateCost() }}</span>
          </div>
        </div>
        
        <div class="booking-actions">
          <el-button type="primary" @click="confirmBooking">确认预约</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </div>
    </div>
    
    <div v-if="bookings.length > 0" class="booking-history">
      <h4>预约记录</h4>
      <div class="history-list">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="history-item"
        >
          <div class="booking-info">
            <div class="booking-room">{{ getRoomName(booking.roomId) }}</div>
            <div class="booking-time">{{ booking.startTime }} - {{ booking.endTime }}</div>
            <div class="booking-date">{{ formatDate(booking.date) }}</div>
          </div>
          <div class="booking-status">
            <el-tag
              :type="getStatusType(booking.status)"
              size="small"
            >
              {{ booking.status }}
            </el-tag>
            <el-button
              v-if="booking.status === '已预约'"
              size="small"
              type="danger"
              @click="cancelBooking(booking.id)"
            >
              取消
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

const selectedRoom = ref('')
const startTime = ref('')
const endTime = ref('')
const bookings = ref([
  {
    id: 1,
    roomId: 1,
    startTime: '09:00',
    endTime: '10:30',
    date: new Date(),
    status: '已预约'
  },
  {
    id: 2,
    roomId: 2,
    startTime: '14:00',
    endTime: '16:00',
    date: new Date(),
    status: '已完成'
  }
])

const meetingRooms = ref([
  { id: 1, name: '会议室A', capacity: 10, hourlyRate: 50 },
  { id: 2, name: '会议室B', capacity: 20, hourlyRate: 80 },
  { id: 3, name: '会议室C', capacity: 50, hourlyRate: 150 },
  { id: 4, name: '多功能厅', capacity: 100, hourlyRate: 300 }
])

const minEndTime = computed(() => {
  if (!startTime.value) return '08:30'
  
  const [hours, minutes] = startTime.value.split(':').map(Number)
  const startMinutes = hours * 60 + minutes + 30 // 最少30分钟
  const endHours = Math.floor(startMinutes / 60)
  const endMins = startMinutes % 60
  
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`
})

const duration = computed(() => {
  if (!startTime.value || !endTime.value) return ''
  
  const [startHours, startMinutes] = startTime.value.split(':').map(Number)
  const [endHours, endMinutes] = endTime.value.split(':').map(Number)
  
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  
  const durationMinutes = endTotalMinutes - startTotalMinutes
  
  if (durationMinutes <= 0) return ''
  
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  
  if (hours === 0) {
    return `${minutes}分钟`
  } else if (minutes === 0) {
    return `${hours}小时`
  } else {
    return `${hours}小时${minutes}分钟`
  }
})

const handleStartTimeChange = () => {
  // 如果结束时间小于开始时间，清空结束时间
  if (endTime.value && startTime.value >= endTime.value) {
    endTime.value = ''
  }
}

const getRoomName = (roomId) => {
  const room = meetingRooms.value.find(r => r.id === roomId)
  return room ? room.name : '未知会议室'
}

const calculateCost = () => {
  if (!selectedRoom.value || !duration.value) return 0
  
  const room = meetingRooms.value.find(r => r.id === selectedRoom.value)
  if (!room) return 0
  
  const [startHours, startMinutes] = startTime.value.split(':').map(Number)
  const [endHours, endMinutes] = endTime.value.split(':').map(Number)
  
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  const durationMinutes = endTotalMinutes - startTotalMinutes
  
  const hours = Math.ceil(durationMinutes / 60) // 按小时计费，不足一小时按一小时计算
  
  return hours * room.hourlyRate
}

const confirmBooking = () => {
  const newBooking = {
    id: Date.now(),
    roomId: selectedRoom.value,
    startTime: startTime.value,
    endTime: endTime.value,
    date: new Date(),
    status: '已预约'
  }
  
  bookings.value.unshift(newBooking)
  ElMessage.success('会议室预约成功！')
  resetForm()
}

const resetForm = () => {
  selectedRoom.value = ''
  startTime.value = ''
  endTime.value = ''
}

const cancelBooking = (bookingId) => {
  const booking = bookings.value.find(b => b.id === bookingId)
  if (booking) {
    booking.status = '已取消'
    ElMessage.success('预约已取消')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusType = (status) => {
  const statusMap = {
    '已预约': 'warning',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.meeting-room-booking {
  max-width: 800px;
  padding: 20px;
}

.booking-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.room-capacity {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.time-selection {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.time-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item label {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.duration-info {
  padding: 12px;
  background: #e1f3d8;
  border-radius: 8px;
  text-align: center;
}

.finished-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.finished-message h3 {
  margin: 0;
  color: #529b2e;
}

.finished-message p {
  margin: 0;
  color: #606266;
}
</style>
```

### 工作时间管理

创建一个工作时间管理组件：

```vue
<template>
  <div class="work-schedule">
    <h3>工作时间管理</h3>
    
    <div class="schedule-form">
      <h4>设置工作时间</h4>
      
      <div class="weekdays-schedule">
        <div
          v-for="day in weekdays"
          :key="day.key"
          class="day-schedule"
        >
          <div class="day-header">
            <el-checkbox
              v-model="day.enabled"
              @change="handleDayToggle(day)"
            >
              {{ day.name }}
            </el-checkbox>
          </div>
          
          <div v-if="day.enabled" class="time-slots">
            <div
              v-for="(slot, index) in day.timeSlots"
              :key="index"
              class="time-slot"
            >
              <el-time-select
                v-model="slot.start"
                start="00:00"
                step="00:30"
                end="23:30"
                placeholder="开始时间"
                @change="validateTimeSlot(day, slot)"
              />
              <span class="time-separator">至</span>
              <el-time-select
                v-model="slot.end"
                :start="slot.start || '00:30'"
                step="00:30"
                end="23:59"
                placeholder="结束时间"
                :disabled="!slot.start"
              />
              <el-button
                v-if="day.timeSlots.length > 1"
                size="small"
                type="danger"
                @click="removeTimeSlot(day, index)"
              >
                删除
              </el-button>
            </div>
            
            <el-button
              size="small"
              type="primary"
              @click="addTimeSlot(day)"
            >
              添加时间段
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="schedule-actions">
        <el-button type="primary" @click="saveSchedule">保存设置</el-button>
        <el-button @click="resetSchedule">重置</el-button>
        <el-button @click="applyTemplate">应用模板</el-button>
      </div>
    </div>
    
    <div class="schedule-preview">
      <h4>工作时间预览</h4>
      <div class="preview-content">
        <div
          v-for="day in enabledDays"
          :key="day.key"
          class="preview-day"
        >
          <div class="preview-day-name">{{ day.name }}</div>
          <div class="preview-time-slots">
            <span
              v-for="(slot, index) in day.timeSlots"
              :key="index"
              class="preview-slot"
            >
              {{ slot.start }} - {{ slot.end }}
            </span>
          </div>
        </div>
        
        <div v-if="enabledDays.length === 0" class="no-schedule">
          暂未设置工作时间
        </div>
      </div>
      
      <div class="schedule-stats">
        <div class="stat-item">
          <span class="stat-label">工作天数：</span>
          <span class="stat-value">{{ enabledDays.length }}天/周</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总工作时长：</span>
          <span class="stat-value">{{ totalWorkHours }}小时/周</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const weekdays = ref([
  {
    key: 'monday',
    name: '周一',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'tuesday',
    name: '周二',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'wednesday',
    name: '周三',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'thursday',
    name: '周四',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'friday',
    name: '周五',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'saturday',
    name: '周六',
    enabled: false,
    timeSlots: [{ start: '', end: '' }]
  },
  {
    key: 'sunday',
    name: '周日',
    enabled: false,
    timeSlots: [{ start: '', end: '' }]
  }
])

const enabledDays = computed(() => {
  return weekdays.value.filter(day => 
    day.enabled && day.timeSlots.some(slot => slot.start && slot.end)
  )
})

const totalWorkHours = computed(() => {
  let total = 0
  
  enabledDays.value.forEach(day => {
    day.timeSlots.forEach(slot => {
      if (slot.start && slot.end) {
        const [startHours, startMinutes] = slot.start.split(':').map(Number)
        const [endHours, endMinutes] = slot.end.split(':').map(Number)
        
        const startTotalMinutes = startHours * 60 + startMinutes
        const endTotalMinutes = endHours * 60 + endMinutes
        
        const duration = (endTotalMinutes - startTotalMinutes) / 60
        total += duration
      }
    })
  })
  
  return total.toFixed(1)
})

const handleDayToggle = (day) => {
  if (!day.enabled) {
    // 禁用时清空时间段
    day.timeSlots = [{ start: '', end: '' }]
  } else {
    // 启用时设置默认时间段
    if (!day.timeSlots[0].start) {
      day.timeSlots[0] = { start: '09:00', end: '18:00' }
    }
  }
}

const addTimeSlot = (day) => {
  day.timeSlots.push({ start: '', end: '' })
}

const removeTimeSlot = (day, index) => {
  day.timeSlots.splice(index, 1)
}

const validateTimeSlot = (day, slot) => {
  if (slot.start && slot.end && slot.start >= slot.end) {
    ElMessage.warning('结束时间必须大于开始时间')
    slot.end = ''
  }
}

const saveSchedule = () => {
  // 验证时间段
  let isValid = true
  
  enabledDays.value.forEach(day => {
    day.timeSlots.forEach(slot => {
      if (!slot.start || !slot.end) {
        isValid = false
      }
    })
  })
  
  if (!isValid) {
    ElMessage.warning('请完善所有时间段设置')
    return
  }
  
  ElMessage.success('工作时间设置已保存')
}

const resetSchedule = () => {
  weekdays.value.forEach(day => {
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key)) {
      day.enabled = true
      day.timeSlots = [{ start: '09:00', end: '18:00' }]
    } else {
      day.enabled = false
      day.timeSlots = [{ start: '', end: '' }]
    }
  })
  
  ElMessage.success('已重置为默认工作时间')
}

const applyTemplate = () => {
  // 应用弹性工作制模板
  weekdays.value.forEach(day => {
    if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.key)) {
      day.enabled = true
      day.timeSlots = [
        { start: '09:00', end: '12:00' },
        { start: '13:30', end: '18:30' }
      ]
    } else {
      day.enabled = false
      day.timeSlots = [{ start: '', end: '' }]
    }
  })
  
  ElMessage.success('已应用弹性工作制模板')
}
</script>

<style scoped>
.work-schedule {
  max-width: 800px;
  padding: 20px;
}

.schedule-form {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.schedule-form h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.weekdays-schedule {
  margin-bottom: 24px;
}

.day-schedule {
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.day-header {
  margin-bottom: 12px;
}

.time-slots {
  margin-left: 24px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.time-separator {
  color: #606266;
  font-weight: 500;
}

.schedule-actions {
  display: flex;
  gap: 12px;
}

.schedule-preview {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.schedule-preview h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.preview-content {
  margin-bottom: 20px;
}

.preview-day {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f2f5;
}

.preview-day-name {
  width: 60px;
  font-weight: 500;
  color: #303133;
}

.preview-time-slots {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-slot {
  background: #e1f3d8;
  color: #529b2e;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.no-schedule {
  text-align: center;
  color: #909399;
  padding: 40px;
  background: #f5f7fa;
  border-radius: 6px;
}

.schedule-stats {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  color: #606266;
  font-size: 14px;
}

.stat-value {
  color: #303133;
  font-weight: 500;
}
</style>
```

## API 文档

### TimePicker Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | Date / string | — |
| readonly | 只读 | boolean | false |
| disabled | 禁用 | boolean | false |
| editable | 文本框可输入 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | true |
| size | 输入框尺寸 | enum | default |
| placeholder | 非范围选择时的占位内容 | string | — |
| start-placeholder | 范围选择时开始时间的占位内容 | string | — |
| end-placeholder | 范围选择时结束时间的占位内容 | string | — |
| is-range | 是否为时间范围选择 | boolean | false |
| arrow-control | 是否使用箭头进行时间选择 | boolean | false |
| format | 显示在输入框中的格式 | string | HH:mm:ss |
| value-format | 绑定值的格式 | string | — |
| default-value | 可选，选择器打开时默认显示的时间 | Date / string | — |
| name | 原生属性 | string | — |
| prefix-icon | 自定义前缀图标 | string / Component | Clock |
| clear-icon | 自定义清空图标 | string / Component | CircleClose |
| disabled-hours | 禁止选择部分小时选项 | Function | — |
| disabled-minutes | 禁止选择部分分钟选项 | Function | — |
| disabled-seconds | 禁止选择部分秒选项 | Function | — |
| teleported | 是否将 picker 的下拉列表插入至 body 元素 | boolean | true |

### TimeSelect Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string | — |
| disabled | 禁用状态 | boolean | false |
| editable | 文本框可输入 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | true |
| size | 输入框尺寸 | enum | default |
| placeholder | 占位内容 | string | — |
| name | 原生属性 | string | — |
| effect | Tooltip 主题 | enum | light |
| prefix-icon | 自定义前缀图标 | string / Component | Clock |
| clear-icon | 自定义清空图标 | string / Component | CircleClose |
| start | 开始时间 | string | 09:00 |
| end | 结束时间 | string | 18:00 |
| step | 间隔时间 | string | 00:30 |
| min-time | 最早时间点 | string | — |
| max-time | 最晚时间点 | string | — |

### TimePicker Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 用户确认选定的值时触发 | Function |
| blur | 当 input 失去焦点时触发 | Function |
| focus | 当 input 获得焦点时触发 | Function |
| visible-change | 当 TimePicker 的下拉列表出现/消失时触发 | Function |

### TimePicker Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

## 实践练习

### 练习1：课程表时间设置

创建一个课程表的时间设置系统：

```vue
<template>
  <div class="course-schedule">
    <h3>课程表设置</h3>
    
    <div class="schedule-settings">
      <h4>设置上课时间</h4>
      
      <div class="time-periods">
        <div
          v-for="(period, index) in timePeriods"
          :key="index"
          class="period-item"
        >
          <div class="period-label">第{{ index + 1 }}节课</div>
          <el-time-select
            v-model="period.start"
            start="08:00"
            step="00:05"
            end="22:00"
            placeholder="开始时间"
          />
          <span class="time-separator">-</span>
          <el-time-select
            v-model="period.end"
            :start="period.start || '08:05'"
            step="00:05"
            end="22:00"
            placeholder="结束时间"
            :disabled="!period.start"
          />
          <el-button
            v-if="timePeriods.length > 1"
            size="small"
            type="danger"
            @click="removePeriod(index)"
          >
            删除
          </el-button>
        </div>
      </div>
      
      <div class="period-actions">
        <el-button size="small" @click="addPeriod">添加课时</el-button>
        <el-button size="small" @click="applyStandardSchedule">应用标准课表</el-button>
      </div>
    </div>
    
    <div class="schedule-preview">
      <h4>课程表预览</h4>
      <div class="preview-table">
        <div class="time-column">
          <div class="time-header">时间</div>
          <div
            v-for="(period, index) in validPeriods"
            :key="index"
            class="time-cell"
          >
            {{ period.start }} - {{ period.end }}
          </div>
        </div>
        
        <div
          v-for="day in weekDays"
          :key="day"
          class="day-column"
        >
          <div class="day-header">{{ day }}</div>
          <div
            v-for="(period, index) in validPeriods"
            :key="index"
            class="course-cell"
          >
            <!-- 这里可以添加课程内容 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const timePeriods = ref([
  { start: '08:00', end: '08:45' },
  { start: '08:55', end: '09:40' },
  { start: '10:00', end: '10:45' },
  { start: '10:55', end: '11:40' },
  { start: '14:00', end: '14:45' },
  { start: '14:55', end: '15:40' },
  { start: '16:00', end: '16:45' },
  { start: '16:55', end: '17:40' }
])

const weekDays = ['周一', '周二', '周三', '周四', '周五']

const validPeriods = computed(() => {
  return timePeriods.value.filter(period => period.start && period.end)
})

const addPeriod = () => {
  timePeriods.value.push({ start: '', end: '' })
}

const removePeriod = (index) => {
  timePeriods.value.splice(index, 1)
}

const applyStandardSchedule = () => {
  timePeriods.value = [
    { start: '08:00', end: '08:45' },
    { start: '08:55', end: '09:40' },
    { start: '10:00', end: '10:45' },
    { start: '10:55', end: '11:40' },
    { start: '14:00', end: '14:45' },
    { start: '14:55', end: '15:40' },
    { start: '16:00', end: '16:45' },
    { start: '16:55', end: '17:40' }
  ]
  
  ElMessage.success('已应用标准课表时间')
}
</script>

<style scoped>
.course-schedule {
  max-width: 1000px;
  padding: 20px;
}

.schedule-settings {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.schedule-settings h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.time-periods {
  margin-bottom: 16px;
}

.period-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.period-label {
  width: 80px;
  font-weight: 500;
  color: #303133;
}

.time-separator {
  color: #606266;
}

.period-actions {
  display: flex;
  gap: 12px;
}

.schedule-preview {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.schedule-preview h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.preview-table {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.time-column,
.day-column {
  flex: 1;
  border-right: 1px solid #e4e7ed;
}

.day-column:last-child {
  border-right: none;
}

.time-header,
.day-header {
  padding: 12px 8px;
  background: #f5f7fa;
  font-weight: 500;
  text-align: center;
  border-bottom: 1px solid #e4e7ed;
}

.time-cell,
.course-cell {
  padding: 8px;
  min-height: 40px;
  border-bottom: 1px solid #f0f2f5;
  font-size: 12px;
  text-align: center;
}

.time-cell {
  background: #fafafa;
  color: #606266;
}

.course-cell {
  background: white;
}
</style>
```

### 练习2：倒计时器设置

创建一个倒计时器的时间设置组件：

```vue
<template>
  <div class="countdown-timer">
    <h3>倒计时器</h3>
    
    <div class="timer-settings">
      <h4>设置倒计时时间</h4>
      
      <div class="time-input">
        <div class="input-group">
          <label>小时：</label>
          <el-input-number
            v-model="hours"
            :min="0"
            :max="23"
            controls-position="right"
          />
        </div>
        
        <div class="input-group">
          <label>分钟：</label>
          <el-input-number
            v-model="minutes"
            :min="0"
            :max="59"
            controls-position="right"
          />
        </div>
        
        <div class="input-group">
          <label>秒数：</label>
          <el-input-number
            v-model="seconds"
            :min="0"
            :max="59"
            controls-position="right"
          />
        </div>
      </div>
      
      <div class="quick-settings">
        <h5>快速设置</h5>
        <div class="quick-buttons">
          <el-button size="small" @click="setTime(0, 1, 0)">1分钟</el-button>
          <el-button size="small" @click="setTime(0, 5, 0)">5分钟</el-button>
          <el-button size="small" @click="setTime(0, 10, 0)">10分钟</el-button>
          <el-button size="small" @click="setTime(0, 30, 0)">30分钟</el-button>
          <el-button size="small" @click="setTime(1, 0, 0)">1小时</el-button>
        </div>
      </div>
      
      <div class="timer-controls">
        <el-button
          type="primary"
          :disabled="totalSeconds === 0"
          @click="startTimer"
        >
          开始倒计时
        </el-button>
        <el-button @click="resetTimer">重置</el-button>
      </div>
    </div>
    
    <div v-if="isRunning || remainingTime > 0" class="timer-display">
      <div class="countdown-circle">
        <div class="time-display">
          {{ formatTime(remainingTime) }}
        </div>
        <div class="progress-ring">
          <svg width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e4e7ed"
              stroke-width="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#409EFF"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashoffset"
              transform="rotate(-90 100 100)"
            />
          </svg>
        </div>
      </div>
      
      <div class="timer-controls">
        <el-button
          v-if="!isRunning"
          type="primary"
          @click="startTimer"
        >
          继续
        </el-button>
        <el-button
          v-if="isRunning"
          type="warning"
          @click="pauseTimer"
        >
          暂停
        </el-button>
        <el-button @click="stopTimer">停止</el-button>
      </div>
    </div>
    
    <div v-if="isFinished" class="timer-finished">
      <div class="finished-message">
        <el-icon size="48" color="#67c23a">
          <Check />
        </el-icon>
        <h3>倒计时结束！</h3>
        <p>设定的时间已到</p>
      </div>
      
      <el-button type="primary" @click="resetTimer">
        重新设置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const hours = ref(0)
const minutes = ref(5)
const seconds = ref(0)
const remainingTime = ref(0)
const isRunning = ref(false)
const isFinished = ref(false)
const timer = ref(null)

const totalSeconds = computed(() => {
  return hours.value * 3600 + minutes.value * 60 + seconds.value
})

const circumference = computed(() => {
  return 2 * Math.PI * 90 // r = 90
})

const strokeDashoffset = computed(() => {
  if (totalSeconds.value === 0) return circumference.value
  const progress = remainingTime.value / totalSeconds.value
  return circumference.value * (1 - progress)
})

const setTime = (h, m, s) => {
  hours.value = h
  minutes.value = m
  seconds.value = s
}

const startTimer = () => {
  if (remainingTime.value === 0) {
    remainingTime.value = totalSeconds.value
  }
  
  if (remainingTime.value === 0) {
    ElMessage.warning('请设置倒计时时间')
    return
  }
  
  isRunning.value = true
  isFinished.value = false
  
  timer.value = setInterval(() => {
    remainingTime.value--
    
    if (remainingTime.value <= 0) {
      clearInterval(timer.value)
      isRunning.value = false
      isFinished.value = true
      remainingTime.value = 0
      
      // 播放提示音或显示通知
      ElMessage.success('倒计时结束！')
    }
  }, 1000)
}

const pauseTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  isRunning.value = false
}

const stopTimer = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  isRunning.value = false
  remainingTime.value = 0
  isFinished.value = false
}

const resetTimer = () => {
  stopTimer()
  hours.value = 0
  minutes.value = 5
  seconds.value = 0
}

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  } else {
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
}

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.countdown-timer {
  max-width: 600px;
  padding: 20px;
  margin: 0 auto;
}

.timer-settings {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.timer-settings h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.time-input {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.input-group label {
  font-weight: 500;
  color: #303133;
}

.quick-settings {
  margin-bottom: 20px;
}

.quick-settings h5 {
  margin: 0 0 12px 0;
  color: #303133;
  text-align: center;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.timer-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  margin-bottom: 24px;
}

.countdown-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-display {
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  text-align: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.timer-finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;