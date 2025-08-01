# Time Picker

## Overview

The Time Picker component is used for selecting time, supporting various time selection modes including single time and time range selection. It provides rich configuration options and customization features to meet various time selection needs.

## Learning Objectives

- Master the basic concepts and use cases of Time Picker
- Learn how to implement basic time selection functionality
- Understand time range selection and time restrictions
- Master time formatting and display
- Learn about disabled time and step configuration
- Understand custom time pickers
- Master the application of time pickers in real projects
- Master the complete usage of the API

## Basic Usage

### Basic Time Selection

The simplest time picker:

```vue
<template>
  <div>
    <h4>Basic Time Selection</h4>
    <el-time-picker
      v-model="time1"
      placeholder="Select time"
    />
    <p>Selected time: {{ time1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref('')
</script>
```

### Time Range Restriction

Restrict the selectable time range:

```vue
<template>
  <div>
    <h4>Time Range Restriction</h4>
    <el-time-picker
      v-model="time2"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      placeholder="Select time"
    />
    <p>Only 9:00-18:00 can be selected</p>
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
  // No restrictions on minutes during work hours
  return []
}

const disabledSeconds = (hour, minute) => {
  // No restrictions on seconds
  return []
}
</script>
```

### Time Range Selection

Select a time range:

```vue
<template>
  <div>
    <h4>Time Range Selection</h4>
    <el-time-picker
      v-model="timeRange"
      is-range
      range-separator="to"
      start-placeholder="Start time"
      end-placeholder="End time"
    />
    <p>Selected time range: {{ timeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timeRange = ref('')
</script>
```

### Fixed Time Points

Provide fixed time points for selection:

```vue
<template>
  <div>
    <h4>Fixed Time Points</h4>
    <el-time-select
      v-model="time3"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="Select time"
    />
    <p>Selected time: {{ time3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time3 = ref('')
</script>
```

### Time Formatting

Customize time display format:

```vue
<template>
  <div>
    <h4>Time Formatting</h4>
    <el-time-picker
      v-model="time4"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      placeholder="Select time"
    />
    <p>Formatted time: {{ time4 }}</p>
    
    <el-time-picker
      v-model="time5"
      format="hh:mm:ss A"
      value-format="HH:mm:ss"
      placeholder="12-hour format"
    />
    <p>12-hour format time: {{ time5 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time4 = ref('')
const time5 = ref('')
</script>
```

## Advanced Features

### Step Settings

Set the step for time selection:

```vue
<template>
  <div>
    <h4>Step Settings</h4>
    <div class="step-demo">
      <div class="step-item">
        <label>5-minute step:</label>
        <el-time-select
          v-model="stepTime1"
          start="00:00"
          step="00:05"
          end="23:59"
          placeholder="Select time"
        />
      </div>
      
      <div class="step-item">
        <label>15-minute step:</label>
        <el-time-select
          v-model="stepTime2"
          start="00:00"
          step="00:15"
          end="23:59"
          placeholder="Select time"
        />
      </div>
      
      <div class="step-item">
        <label>30-minute step:</label>
        <el-time-select
          v-model="stepTime3"
          start="00:00"
          step="00:30"
          end="23:59"
          placeholder="Select time"
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

### Disabled State

Disable the time picker:

```vue
<template>
  <div>
    <h4>Disabled State</h4>
    <div class="disabled-demo">
      <el-time-picker
        v-model="disabledTime"
        disabled
        placeholder="Disabled state"
      />
      
      <el-time-picker
        v-model="readonlyTime"
        readonly
        placeholder="Read-only state"
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

### Different Sizes

Provide time pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
    <div class="size-demo">
      <el-time-picker
        v-model="time6"
        size="large"
        placeholder="Large size"
      />
      <el-time-picker
        v-model="time7"
        placeholder="Default size"
      />
      <el-time-picker
        v-model="time8"
        size="small"
        placeholder="Small size"
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

### Clearable

Add clear functionality:

```vue
<template>
  <div>
    <h4>Clearable</h4>
    <el-time-picker
      v-model="clearableTime"
      clearable
      placeholder="Clearable time picker"
    />
    <p>Selected time: {{ clearableTime || 'Not selected' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clearableTime = ref('')
</script>
```

## Practical Application Examples

### Meeting Room Booking Time Selection

Create a time selection component for meeting room booking:

```vue
<template>
  <div class="meeting-room-booking">
    <h3>Meeting Room Booking</h3>
    
    <div class="booking-form">
      <div class="form-section">
        <h4>Select Meeting Room</h4>
        <el-select v-model="selectedRoom" placeholder="Please select a meeting room">
          <el-option
            v-for="room in meetingRooms"
            :key="room.id"
            :label="room.name"
            :value="room.id"
          >
            <span>{{ room.name }}</span>
            <span class="room-capacity">({{ room.capacity }} people)</span>
          </el-option>
        </el-select>
      </div>
      
      <div class="form-section">
        <h4>Select Time Slot</h4>
        <div class="time-selection">
          <div class="time-item">
            <label>Start time:</label>
            <el-time-select
              v-model="startTime"
              start="08:00"
              step="00:30"
              end="18:00"
              placeholder="Select start time"
              @change="handleStartTimeChange"
            />
          </div>
          
          <div class="time-item">
            <label>End time:</label>
            <el-time-select
              v-model="endTime"
              :start="minEndTime"
              step="00:30"
              end="18:30"
              placeholder="Select end time"
              :disabled="!startTime"
            />
          </div>
        </div>
        
        <div v-if="duration" class="duration-info">
          <span class="duration-label">Meeting duration:</span>
          <span class="duration-value">{{ duration }}</span>
        </div>
      </div>
      
      <div v-if="selectedRoom && startTime && endTime" class="booking-summary">
        <h4>Booking Information</h4>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">Meeting room:</span>
            <span class="value">{{ getRoomName(selectedRoom) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Time:</span>
            <span class="value">{{ startTime }} - {{ endTime }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Duration:</span>
            <span class="value">{{ duration }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Cost:</span>
            <span class="value cost">¥{{ calculateCost() }}</span>
          </div>
        </div>
        
        <div class="booking-actions">
          <el-button type="primary" @click="confirmBooking">Confirm Booking</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </div>
      </div>
    </div>
    
    <div v-if="bookings.length > 0" class="booking-history">
      <h4>Booking History</h4>
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
              v-if="booking.status === 'Booked'"
              size="small"
              type="danger"
              @click="cancelBooking(booking.id)"
            >
              Cancel
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
    status: 'Booked'
  },
  {
    id: 2,
    roomId: 2,
    startTime: '14:00',
    endTime: '16:00',
    date: new Date(),
    status: 'Completed'
  }
])

const meetingRooms = ref([
  { id: 1, name: 'Meeting Room A', capacity: 10, hourlyRate: 50 },
  { id: 2, name: 'Meeting Room B', capacity: 20, hourlyRate: 80 },
  { id: 3, name: 'Meeting Room C', capacity: 50, hourlyRate: 150 },
  { id: 4, name: 'Multi-function Hall', capacity: 100, hourlyRate: 300 }
])

const minEndTime = computed(() => {
  if (!startTime.value) return '08:30'
  
  const [hours, minutes] = startTime.value.split(':').map(Number)
  const startMinutes = hours * 60 + minutes + 30 // minimum 30 minutes
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
    return `${minutes} minutes`
  } else if (minutes === 0) {
    return `${hours} hours`
  } else {
    return `${hours} hours ${minutes} minutes`
  }
})

const handleStartTimeChange = () => {
  // If end time is less than start time, clear end time
  if (endTime.value && startTime.value >= endTime.value) {
    endTime.value = ''
  }
}

const getRoomName = (roomId) => {
  const room = meetingRooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Meeting Room'
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
  
  const hours = Math.ceil(durationMinutes / 60) // Charged by hour, less than an hour is calculated as one hour
  
  return hours * room.hourlyRate
}

const confirmBooking = () => {
  const newBooking = {
    id: Date.now(),
    roomId: selectedRoom.value,
    startTime: startTime.value,
    endTime: endTime.value,
    date: new Date(),
    status: 'Booked'
  }
  
  bookings.value.unshift(newBooking)
  ElMessage.success('Meeting room booked successfully!')
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
    booking.status = 'Cancelled'
    ElMessage.success('Booking cancelled')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusType = (status) => {
  const statusMap = {
    'Booked': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
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

### Work Schedule Management

Create a work schedule management component:

```vue
<template>
  <div class="work-schedule">
    <h3>Work Schedule Management</h3>
    
    <div class="schedule-form">
      <h4>Set Work Hours</h4>
      
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
                placeholder="Start time"
                @change="validateTimeSlot(day, slot)"
              />
              <span class="time-separator">to</span>
              <el-time-select
                v-model="slot.end"
                :start="slot.start || '00:30'"
                step="00:30"
                end="23:59"
                placeholder="End time"
                :disabled="!slot.start"
              />
              <el-button
                v-if="day.timeSlots.length > 1"
                size="small"
                type="danger"
                @click="removeTimeSlot(day, index)"
              >
                Remove
              </el-button>
            </div>
            
            <el-button
              size="small"
              type="primary"
              @click="addTimeSlot(day)"
            >
              Add Time Slot
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="schedule-actions">
        <el-button type="primary" @click="saveSchedule">Save Settings</el-button>
        <el-button @click="resetSchedule">Reset</el-button>
        <el-button @click="applyTemplate">Apply Template</el-button>
      </div>
    </div>
    
    <div class="schedule-preview">
      <h4>Work Schedule Preview</h4>
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
          No work hours set yet
        </div>
      </div>
      
      <div class="schedule-stats">
        <div class="stat-item">
          <span class="stat-label">Working days:</span>
          <span class="stat-value">{{ enabledDays.length }} days/week</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total work hours:</span>
          <span class="stat-value">{{ totalWorkHours }} hours/week</span>
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
    name: 'Monday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'tuesday',
    name: 'Tuesday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'wednesday',
    name: 'Wednesday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'thursday',
    name: 'Thursday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'friday',
    name: 'Friday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'saturday',
    name: 'Saturday',
    enabled: false,
    timeSlots: [{ start: '', end: '' }]
  },
  {
    key: 'sunday',
    name: 'Sunday',
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
    // Clear time slots when disabled
    day.timeSlots = [{ start: '', end: '' }]
  } else {
    // Set default time slot when enabled
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
    ElMessage.warning('End time must be greater than start time')
    slot.end = ''
  }
}

const saveSchedule = () => {
  // Validate time slots
  let isValid = true
  
  enabledDays.value.forEach(day => {
    day.timeSlots.forEach(slot => {
      if (!slot.start || !slot.end) {
        isValid = false
      }
    })
  })
  
  if (!isValid) {
    ElMessage.warning('Please complete all time slot settings')
    return
  }
  
  ElMessage.success('Work schedule settings saved')
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
  
  ElMessage.success('Reset to default work schedule')
}

const applyTemplate = () => {
  // Apply flexible work schedule template
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
  
  ElMessage.success('Applied flexible work schedule template')
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
  width: 80px;
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

## API Documentation

### TimePicker Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | Date / string | — |
| readonly | whether TimePicker is read only | boolean | false |
| disabled | whether TimePicker is disabled | boolean | false |
| editable | whether the input is editable | boolean | true |
| clearable | whether to show clear button | boolean | true |
| size | size of Input | string | — |
| placeholder | placeholder in non-range mode | string | — |
| start-placeholder | placeholder for the start time in range mode | string | — |
| end-placeholder | placeholder for the end time in range mode | string | — |
| is-range | whether to pick a time range | boolean | false |
| arrow-control | whether to pick time using arrow buttons | boolean | false |
| align | alignment | left / center / right | left |
| popper-class | custom class name for TimePicker's dropdown | string | — |
| range-separator | range separator | string | '-' |
| format | format of the displayed value in the input box | string | HH:mm:ss |
| default-value | optional, default date of the calendar | Date / [Date, Date] | — |
| id | same as native input's `id` | string / array | — |
| name | same as native input's `name` | string | — |
| prefix-icon | Custom prefix icon component | string / Component | Clock |
| clear-icon | Custom clear icon component | string / Component | CircleClose |
| disabled-hours | a function that disables specific hours | function | — |
| disabled-minutes | a function that disables specific minutes | function | — |
| disabled-seconds | a function that disables specific seconds | function | — |
| teleported | whether TimePicker dropdown is teleported to the body | boolean | true |

### TimePicker Events

| Name | Description | Parameters |
|------|-------------|------------|
| change | triggers when user confirms the value | component's binding value |
| blur | triggers when Input blurs | component instance |
| focus | triggers when Input focuses | component instance |
| visible-change | triggers when the TimePicker's dropdown appears/disappears | true when it appears, and false otherwise |

### TimePicker Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| focus | focus the Input component | — |
| blur | blur the Input component | — |
| id | same as native input's `id` | string / array | — |
| name | same as native input's `name` | string | — |
| prefix-icon | Custom prefix icon component | string / Component | Clock |
| clear-icon | Custom clear icon component | string / Component | CircleClose |
| disabled-hours | a function that disables specific hours | function | — |
| disabled-minutes | a function that disables specific minutes | function | — |
| disabled-seconds | a function that disables specific seconds | function | — |
| teleported | whether TimePicker dropdown is teleported to the body | boolean | true |

### TimePicker Events

| Name | Description | Parameters |
|------|-------------|------------|
| change | triggers when user confirms the value | component's binding value |
| blur | triggers when Input blurs | component instance |
| focus | triggers when Input focuses | component instance |
| visible-change | triggers when the TimePicker's dropdown appears/disappears | true when it appears, and false otherwise |

### TimePicker Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| focus | focus the Input component | — |
| blur | blur the Input component | — |

### TimeSelect Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string | — |
| disabled | whether TimeSelect is disabled | boolean | false |
| editable | whether the input is editable | boolean | true |
| clearable | whether to show clear button | boolean | true |
| size | size of Input | string | — |
| placeholder | placeholder in non-range mode | string | — |
| name | same as native input's `name` | string | — |
| prefix-icon | Custom prefix icon component | string / Component | Clock |
| clear-icon | Custom clear icon component | string / Component | CircleClose |
| start | start time | string | 09:00 |
| end | end time | string | 18:00 |
| step | time step | string | 00:30 |
| min-time | minimum time, any time before this time will be disabled | string | 00:00 |
| max-time | maximum time, any time after this time will be disabled | string | — |
| format | format of the displayed value in the input box | string | HH:mm |

### TimeSelect Events

| Name | Description | Parameters |
|------|-------------|------------|
| change | triggers when user confirms the value | component's binding value |
| blur | triggers when Input blurs | component instance |
| focus | triggers when Input focuses | component instance |
| visible-change | triggers when the TimeSelect's dropdown appears/disappears | true when it appears, and false otherwise |

### TimeSelect Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| focus | focus the Input component | — |
| blur | blur the Input component | — |

## Practice Exercises

### Exercise 1: Create a Time Slot Booking System

Create a time slot booking system for a service provider:

```vue
<template>
  <div class="time-slot-booking">
    <h3>Service Appointment Booking</h3>
    
    <div class="booking-steps">
      <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-title">Select Service</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-title">Choose Time</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ 'active': currentStep === 3, 'completed': currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-title">Confirm Details</div>
      </div>
    </div>
    
    <!-- Step 1: Service Selection -->
    <div v-if="currentStep === 1" class="step-content">
      <h4>Select a Service</h4>
      <div class="service-list">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          :class="{ 'selected': selectedService === service.id }"
          @click="selectService(service.id)"
        >
          <div class="service-info">
            <h5>{{ service.name }}</h5>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-details">
              <span class="service-duration">{{ service.duration }} minutes</span>
              <span class="service-price">{{ formatPrice(service.price) }}</span>
            </div>
          </div>
          <div class="service-select">
            <el-radio v-model="selectedService" :label="service.id" />
          </div>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button type="primary" :disabled="!selectedService" @click="nextStep">Continue</el-button>
      </div>
    </div>
    
    <!-- Step 2: Time Selection -->
    <div v-if="currentStep === 2" class="step-content">
      <h4>Choose Appointment Time</h4>
      
      <div class="date-selection">
        <div class="date-navigation">
          <el-button @click="previousWeek">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span class="date-range">{{ formatDateRange() }}</span>
          <el-button @click="nextWeek">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div class="date-grid">
          <div
            v-for="(day, index) in availableDays"
            :key="index"
            class="date-column"
          >
            <div class="date-header" :class="{ 'today': isToday(day.date) }">
              <div class="day-name">{{ formatDayName(day.date) }}</div>
              <div class="day-number">{{ formatDayNumber(day.date) }}</div>
            </div>
            
            <div class="time-slots">
              <div
                v-for="slot in day.timeSlots"
                :key="`${day.date}-${slot.time}`"
                class="time-slot-item"
                :class="{
                  'selected': isSelectedTimeSlot(day.date, slot.time),
                  'unavailable': !slot.available
                }"
                @click="selectTimeSlot(day.date, slot.time, slot.available)"
              >
                {{ slot.time }}
              </div>
              
              <div v-if="day.timeSlots.length === 0" class="no-slots">
                No available slots
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button @click="previousStep">Back</el-button>
        <el-button type="primary" :disabled="!selectedDate || !selectedTime" @click="nextStep">Continue</el-button>
      </div>
    </div>
    
    <!-- Step 3: Confirmation -->
    <div v-if="currentStep === 3" class="step-content">
      <h4>Confirm Your Appointment</h4>
      
      <div class="confirmation-details">
        <div class="confirmation-section">
          <h5>Service</h5>
          <div class="confirmation-item">
            <span class="item-label">Service:</span>
            <span class="item-value">{{ getServiceName(selectedService) }}</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Duration:</span>
            <span class="item-value">{{ getServiceDuration(selectedService) }} minutes</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Price:</span>
            <span class="item-value">{{ formatPrice(getServicePrice(selectedService)) }}</span>
          </div>
        </div>
        
        <div class="confirmation-section">
          <h5>Date & Time</h5>
          <div class="confirmation-item">
            <span class="item-label">Date:</span>
            <span class="item-value">{{ formatFullDate(selectedDate) }}</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Time:</span>
            <span class="item-value">{{ selectedTime }}</span>
          </div>
        </div>
        
        <div class="confirmation-section">
          <h5>Your Information</h5>
          <el-form :model="userInfo" label-position="top">
            <el-form-item label="Name">
              <el-input v-model="userInfo.name" placeholder="Your full name" />
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="userInfo.email" placeholder="Your email address" />
            </el-form-item>
            <el-form-item label="Phone">
              <el-input v-model="userInfo.phone" placeholder="Your phone number" />
            </el-form-item>
            <el-form-item label="Notes">
              <el-input
                v-model="userInfo.notes"
                type="textarea"
                placeholder="Any special requests or information"
                rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button @click="previousStep">Back</el-button>
        <el-button type="primary" @click="confirmBooking">Confirm Booking</el-button>
      </div>
    </div>
    
    <!-- Success Message -->
    <div v-if="currentStep === 4" class="step-content success-message">
      <el-result
        icon="success"
        title="Booking Confirmed!"
        sub-title="Your appointment has been successfully scheduled."
      >
        <template #extra>
          <div class="booking-summary">
            <div class="summary-item">
              <span class="summary-label">Service:</span>
              <span class="summary-value">{{ getServiceName(selectedService) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ formatFullDate(selectedDate) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Time:</span>
              <span class="summary-value">{{ selectedTime }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Confirmation #:</span>
              <span class="summary-value">{{ bookingReference }}</span>
            </div>
          </div>
          <el-button type="primary" @click="resetBooking">Book Another Appointment</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// Step tracking
const currentStep = ref(1)

// Service selection
const selectedService = ref(null)
const services = [
  {
    id: 1,
    name: 'Basic Consultation',
    description: 'Initial consultation to discuss your needs and goals.',
    duration: 30,
    price: 50
  },
  {
    id: 2,
    name: 'Standard Service',
    description: 'Our most popular service package with comprehensive coverage.',
    duration: 60,
    price: 100
  },
  {
    id: 3,
    name: 'Premium Package',
    description: 'Extended session with additional premium features and benefits.',
    duration: 90,
    price: 150
  }
]

// Time selection
const currentWeekStart = ref(new Date())
const selectedDate = ref(null)
const selectedTime = ref(null)

// User information
const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

// Booking reference
const bookingReference = ref('')

// Generate available days for the current week
const availableDays = computed(() => {
  const days = []
  const startDate = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Skip past dates
    if (date < new Date().setHours(0, 0, 0, 0)) {
      continue
    }
    
    // Generate time slots for this day
    const timeSlots = generateTimeSlots(date)
    
    days.push({
      date: date.toISOString().split('T')[0],
      timeSlots
    })
  }
  
  return days
})

// Helper functions
const generateTimeSlots = (date) => {
  const slots = []
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  
  // Different hours for weekends
  const startHour = isWeekend ? 10 : 9
  const endHour = isWeekend ? 16 : 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      // Randomly determine availability (in a real app, this would come from a backend)
      const available = Math.random() > 0.3
      
      slots.push({
        time,
        available
      })
    }
  }
  
  return slots
}

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

const formatDayName = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const formatDayNumber = (dateString) => {
  const date = new Date(dateString)
  return date.getDate()
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateRange = () => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

const isSelectedTimeSlot = (date, time) => {
  return selectedDate.value === date && selectedTime.value === time
}

const getServiceName = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.name : ''
}

const getServiceDuration = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.duration : 0
}

const getServicePrice = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.price : 0
}

// Action handlers
const selectService = (serviceId) => {
  selectedService.value = serviceId
}

const selectTimeSlot = (date, time, available) => {
  if (!available) return
  
  selectedDate.value = date
  selectedTime.value = time
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const previousWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  
  // Don't allow selecting past weeks
  if (newStart >= new Date().setHours(0, 0, 0, 0)) {
    currentWeekStart.value = newStart
  }
}

const nextWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

const confirmBooking = () => {
  // Validate user information
  if (!userInfo.value.name || !userInfo.value.email || !userInfo.value.phone) {
    ElMessage.warning('Please fill in all required fields')
    return
  }
  
  // Generate a booking reference
  bookingReference.value = `BK-${Date.now().toString().slice(-6)}`
  
  // In a real app, you would send this data to your backend
  console.log('Booking confirmed:', {
    service: getServiceName(selectedService.value),
    date: selectedDate.value,
    time: selectedTime.value,
    userInfo: userInfo.value,
    reference: bookingReference.value
  })
  
  // Show success message
  nextStep()
}

const resetBooking = () => {
  currentStep.value = 1
  selectedService.value = null
  selectedDate.value = null
  selectedTime.value = null
  userInfo.value = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  }
  bookingReference.value = ''
  currentWeekStart.value = new Date()
}
</script>

<style scoped>
.time-slot-booking {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.booking-steps {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e4e7ed;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.step.active .step-number {
  background-color: #409eff;
  color: white;
}

.step.completed .step-number {
  background-color: #67c23a;
  color: white;
}

.step-title {
  font-size: 14px;
  color: #606266;
}

.step.active .step-title {
  color: #409eff;
  font-weight: 500;
}

.step.completed .step-title {
  color: #67c23a;
}

.step-connector {
  flex-grow: 1;
  height: 2px;
  background-color: #e4e7ed;
  margin: 0 10px;
}

.step-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.service-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.service-card:hover {
  border-color: #c6e2ff;
  background-color: #f5f7fa;
}

.service-card.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.service-info {
  flex-grow: 1;
}

.service-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.service-description {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.service-details {
  display: flex;
  gap: 16px;
}

.service-duration {
  color: #909399;
  font-size: 14px;
}

.service-price {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.service-select {
  display: flex;
  align-items: center;
}

.date-selection {
  margin-bottom: 24px;
}

.date-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.date-range {
  font-weight: 500;
  color: #303133;
}

.date-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.date-column {
  min-width: 120px;
  flex: 1;
}

.date-header {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e4e7ed;
}

.date-header.today {
  background: #ecf5ff;
  border-color: #c6e2ff;
}

.day-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.day-number {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.time-slots {
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 12px;
  height: 300px;
  overflow-y: auto;
}

.time-slot-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  text-align: center;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.time-slot-item:hover:not(.unavailable) {
  background: #ecf5ff;
}

.time-slot-item.selected {
  background: #409eff;
  color: white;
}

.time-slot-item.unavailable {
  background: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
  text-decoration: line-through;
}

.no-slots {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.confirmation-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.confirmation-section {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.confirmation-section h5 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.confirmation-item {
  display: flex;
  margin-bottom: 8px;
}

.item-label {
  width: 100px;
  color: #606266;
}

.item-value {
  font-weight: 500;
  color: #303133;
}

.success-message {
  text-align: center;
}

.booking-summary {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.summary-item {
  display: flex;
  margin-bottom: 8px;
}

.summary-label {
  width: 120px;
  color: #606266;
}

.summary-value {
  font-weight: 500;
  color: #303133;
}
</style>
```

### Exercise 2: Create a Time Tracking Application

Create a time tracking application for recording work hours:

```vue
<template>
  <div class="time-tracker">
    <h3>Time Tracking Application</h3>
    
    <div class="tracker-container">
      <div class="timer-section">
        <div class="current-task">
          <h4>Current Task</h4>
          <el-input
            v-model="currentTask.description"
            placeholder="What are you working on?"
            :disabled="currentTask.isRunning"
          />
          
          <div class="task-project">
            <el-select
              v-model="currentTask.projectId"
              placeholder="Select project"
              :disabled="currentTask.isRunning"
            >
              <el-option
                v-for="project in projects"
                :key="project.id"
                :label="project.name"
                :value="project.id"
              />
            </el-select>
          </div>
          
          <div class="timer-display">
            <span class="time">{{ formatTime(currentTask.elapsedTime) }}</span>
          </div>
          
          <div class="timer-controls">
            <el-button
              v-if="!currentTask.isRunning"
              type="primary"
              @click="startTimer"
              :disabled="!currentTask.description || !currentTask.projectId"
            >
              Start Timer
            </el-button>
            <el-button
              v-else
              type="danger"
              @click="stopTimer"
            >
              Stop Timer
            </el-button>
          </div>
        </div>
        
        <div class="manual-entry">
          <h4>Manual Time Entry</h4>
          <div class="manual-form">
            <div class="form-row">
              <el-input
                v-model="manualEntry.description"
                placeholder="Task description"
              />
            </div>
            
            <div class="form-row">
              <el-select
                v-model="manualEntry.projectId"
                placeholder="Select project"
                style="width: 100%"
              >
                <el-option
                  v-for="project in projects"
                  :key="project.id"
                  :label="project.name"
                  :value="project.id"
                />
              </el-select>
            </div>
            
            <div class="form-row time-inputs">
              <div class="time-input">
                <label>Date</label>
                <el-date-picker
                  v-model="manualEntry.date"
                  type="date"
                  placeholder="Select date"
                  style="width: 100%"
                />
              </div>
              
              <div class="time-input">
                <label>Start Time</label>
                <el-time-picker
                  v-model="manualEntry.startTime"
                  placeholder="Start time"
                  format="HH:mm"
                  @change="calculateManualDuration"
                />
              </div>
              
              <div class="time-input">
                <label>End Time</label>
                <el-time-picker
                  v-model="manualEntry.endTime"
                  placeholder="End time"
                  format="HH:mm"
                  @change="calculateManualDuration"
                />
              </div>
            </div>
            
            <div class="form-row">
              <label>Duration</label>
              <div class="duration-display">
                {{ formatTime(manualEntry.duration) }}
              </div>
            </div>
            
            <div class="form-actions">
              <el-button
                type="primary"
                @click="addManualEntry"
                :disabled="!isManualEntryValid"
              >
                Add Entry
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="entries-section">
        <div class="entries-header">
          <h4>Time Entries</h4>
          <div class="date-filter">
            <el-date-picker
              v-model="dateFilter"
              type="daterange"
              range-separator="to"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="filterEntries"
            />
          </div>
        </div>
        
        <div class="entries-list">
          <div v-if="filteredEntries.length === 0" class="no-entries">
            No time entries for the selected period
          </div>
| model-value / v-model | binding value | string | — |
| disabled | whether TimeSelect is disabled | boolean | false |
| editable | whether the input is editable | boolean | true |
| clearable | whether to show clear button | boolean | true |
| size | size of Input | string | — |
| placeholder | placeholder in non-range mode | string | — |
| name | same as native input's `name` | string | — |
| prefix-icon | Custom prefix icon component | string / Component | Clock |
| clear-icon | Custom clear icon component | string / Component | CircleClose |
| start | start time | string | 09:00 |
| end | end time | string | 18:00 |
| step | time step | string | 00:30 |
| min-time | minimum time, any time before this time will be disabled | string | 00:00 |
| max-time | maximum time, any time after this time will be disabled | string | — |
| format | format of the displayed value in the input box | string | HH:mm |

### TimeSelect Events

| Name | Description | Parameters |
|------|-------------|------------|
| change | triggers when user confirms the value | component's binding value |
| blur | triggers when Input blurs | component instance |
| focus | triggers when Input focuses | component instance |
| visible-change | triggers when the TimeSelect's dropdown appears/disappears | true when it appears, and false otherwise |

### TimeSelect Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| focus | focus the Input component | — |
| blur | blur the Input component | — |

## Practice Exercises

### Exercise 1: Create a Time Slot Booking System

Create a time slot booking system for a service provider:

```vue
<template>
  <div class="time-slot-booking">
    <h3>Service Appointment Booking</h3>
    
    <div class="booking-steps">
      <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-title">Select Service</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-title">Choose Time</div>
      </div>
      <div class="step-connector"></div>
      <div class="step" :class="{ 'active': currentStep === 3, 'completed': currentStep > 3 }">
        <div class="step-number">3</div>
        <div class="step-title">Confirm Details</div>
      </div>
    </div>
    
    <!-- Step 1: Service Selection -->
    <div v-if="currentStep === 1" class="step-content">
      <h4>Select a Service</h4>
      <div class="service-list">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          :class="{ 'selected': selectedService === service.id }"
          @click="selectService(service.id)"
        >
          <div class="service-info">
            <h5>{{ service.name }}</h5>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-details">
              <span class="service-duration">{{ service.duration }} minutes</span>
              <span class="service-price">{{ formatPrice(service.price) }}</span>
            </div>
          </div>
          <div class="service-select">
            <el-radio v-model="selectedService" :label="service.id" />
          </div>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button type="primary" :disabled="!selectedService" @click="nextStep">Continue</el-button>
      </div>
    </div>
    
    <!-- Step 2: Time Selection -->
    <div v-if="currentStep === 2" class="step-content">
      <h4>Choose Appointment Time</h4>
      
      <div class="date-selection">
        <div class="date-navigation">
          <el-button @click="previousWeek">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <span class="date-range">{{ formatDateRange() }}</span>
          <el-button @click="nextWeek">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        
        <div class="date-grid">
          <div
            v-for="(day, index) in availableDays"
            :key="index"
            class="date-column"
          >
            <div class="date-header" :class="{ 'today': isToday(day.date) }">
              <div class="day-name">{{ formatDayName(day.date) }}</div>
              <div class="day-number">{{ formatDayNumber(day.date) }}</div>
            </div>
            
            <div class="time-slots">
              <div
                v-for="slot in day.timeSlots"
                :key="`${day.date}-${slot.time}`"
                class="time-slot-item"
                :class="{
                  'selected': isSelectedTimeSlot(day.date, slot.time),
                  'unavailable': !slot.available
                }"
                @click="selectTimeSlot(day.date, slot.time, slot.available)"
              >
                {{ slot.time }}
              </div>
              
              <div v-if="day.timeSlots.length === 0" class="no-slots">
                No available slots
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button @click="previousStep">Back</el-button>
        <el-button type="primary" :disabled="!selectedDate || !selectedTime" @click="nextStep">Continue</el-button>
      </div>
    </div>
    
    <!-- Step 3: Confirmation -->
    <div v-if="currentStep === 3" class="step-content">
      <h4>Confirm Your Appointment</h4>
      
      <div class="confirmation-details">
        <div class="confirmation-section">
          <h5>Service</h5>
          <div class="confirmation-item">
            <span class="item-label">Service:</span>
            <span class="item-value">{{ getServiceName(selectedService) }}</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Duration:</span>
            <span class="item-value">{{ getServiceDuration(selectedService) }} minutes</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Price:</span>
            <span class="item-value">{{ formatPrice(getServicePrice(selectedService)) }}</span>
          </div>
        </div>
        
        <div class="confirmation-section">
          <h5>Date & Time</h5>
          <div class="confirmation-item">
            <span class="item-label">Date:</span>
            <span class="item-value">{{ formatFullDate(selectedDate) }}</span>
          </div>
          <div class="confirmation-item">
            <span class="item-label">Time:</span>
            <span class="item-value">{{ selectedTime }}</span>
          </div>
        </div>
        
        <div class="confirmation-section">
          <h5>Your Information</h5>
          <el-form :model="userInfo" label-position="top">
            <el-form-item label="Name">
              <el-input v-model="userInfo.name" placeholder="Your full name" />
            </el-form-item>
            <el-form-item label="Email">
              <el-input v-model="userInfo.email" placeholder="Your email address" />
            </el-form-item>
            <el-form-item label="Phone">
              <el-input v-model="userInfo.phone" placeholder="Your phone number" />
            </el-form-item>
            <el-form-item label="Notes">
              <el-input
                v-model="userInfo.notes"
                type="textarea"
                placeholder="Any special requests or information"
                rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <div class="step-actions">
        <el-button @click="previousStep">Back</el-button>
        <el-button type="primary" @click="confirmBooking">Confirm Booking</el-button>
      </div>
    </div>
    
    <!-- Success Message -->
    <div v-if="currentStep === 4" class="step-content success-message">
      <el-result
        icon="success"
        title="Booking Confirmed!"
        sub-title="Your appointment has been successfully scheduled."
      >
        <template #extra>
          <div class="booking-summary">
            <div class="summary-item">
              <span class="summary-label">Service:</span>
              <span class="summary-value">{{ getServiceName(selectedService) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Date:</span>
              <span class="summary-value">{{ formatFullDate(selectedDate) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Time:</span>
              <span class="summary-value">{{ selectedTime }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Confirmation #:</span>
              <span class="summary-value">{{ bookingReference }}</span>
            </div>
          </div>
          <el-button type="primary" @click="resetBooking">Book Another Appointment</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

// Step tracking
const currentStep = ref(1)

// Service selection
const selectedService = ref(null)
const services = [
  {
    id: 1,
    name: 'Basic Consultation',
    description: 'Initial consultation to discuss your needs and goals.',
    duration: 30,
    price: 50
  },
  {
    id: 2,
    name: 'Standard Service',
    description: 'Our most popular service package with comprehensive coverage.',
    duration: 60,
    price: 100
  },
  {
    id: 3,
    name: 'Premium Package',
    description: 'Extended session with additional premium features and benefits.',
    duration: 90,
    price: 150
  }
]

// Time selection
const currentWeekStart = ref(new Date())
const selectedDate = ref(null)
const selectedTime = ref(null)

// User information
const userInfo = ref({
  name: '',
  email: '',
  phone: '',
  notes: ''
})

// Booking reference
const bookingReference = ref('')

// Generate available days for the current week
const availableDays = computed(() => {
  const days = []
  const startDate = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    // Skip past dates
    if (date < new Date().setHours(0, 0, 0, 0)) {
      continue
    }
    
    // Generate time slots for this day
    const timeSlots = generateTimeSlots(date)
    
    days.push({
      date: date.toISOString().split('T')[0],
      timeSlots
    })
  }
  
  return days
})

// Helper functions
const generateTimeSlots = (date) => {
  const slots = []
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  
  // Different hours for weekends
  const startHour = isWeekend ? 10 : 9
  const endHour = isWeekend ? 16 : 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      // Randomly determine availability (in a real app, this would come from a backend)
      const available = Math.random() > 0.3
      
      slots.push({
        time,
        available
      })
    }
  }
  
  return slots
}

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

const formatDayName = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

const formatDayNumber = (dateString) => {
  const date = new Date(dateString)
  return date.getDate()
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatDateRange = () => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const isToday = (dateString) => {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

const isSelectedTimeSlot = (date, time) => {
  return selectedDate.value === date && selectedTime.value === time
}

const getServiceName = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.name : ''
}

const getServiceDuration = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.duration : 0
}

const getServicePrice = (serviceId) => {
  const service = services.find(s => s.id === serviceId)
  return service ? service.price : 0
}

// Action handlers
const selectService = (serviceId) => {
  selectedService.value = serviceId
}

const selectTimeSlot = (date, time, available) => {
  if (!available) return
  
  selectedDate.value = date
  selectedTime.value = time
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const previousWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() - 7)
  
  // Don't allow selecting past weeks
  if (newStart >= new Date().setHours(0, 0, 0, 0)) {
    currentWeekStart.value = newStart
  }
}

const nextWeek = () => {
  const newStart = new Date(currentWeekStart.value)
  newStart.setDate(newStart.getDate() + 7)
  currentWeekStart.value = newStart
}

const confirmBooking = () => {
  // Validate user information
  if (!userInfo.value.name || !userInfo.value.email || !userInfo.value.phone) {
    ElMessage.warning('Please fill in all required fields')
    return
  }
  
  // Generate a booking reference
  bookingReference.value = `BK-${Date.now().toString().slice(-6)}`
  
  // In a real app, you would send this data to your backend
  console.log('Booking confirmed:', {
    service: getServiceName(selectedService.value),
    date: selectedDate.value,
    time: selectedTime.value,
    userInfo: userInfo.value,
    reference: bookingReference.value
  })
  
  // Show success message
  nextStep()
}

const resetBooking = () => {
  currentStep.value = 1
  selectedService.value = null
  selectedDate.value = null
  selectedTime.value = null
  userInfo.value = {
    name: '',
    email: '',
    phone: '',
    notes: ''
  }
  bookingReference.value = ''
  currentWeekStart.value = new Date()
}
</script>

<style scoped>
.time-slot-booking {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.booking-steps {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e4e7ed;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.step.active .step-number {
  background-color: #409eff;
  color: white;
}

.step.completed .step-number {
  background-color: #67c23a;
  color: white;
}

.step-title {
  font-size: 14px;
  color: #606266;
}

.step.active .step-title {
  color: #409eff;
  font-weight: 500;
}

.step.completed .step-title {
  color: #67c23a;
}

.step-connector {
  flex-grow: 1;
  height: 2px;
  background-color: #e4e7ed;
  margin: 0 10px;
}

.step-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.service-card {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.service-card:hover {
  border-color: #c6e2ff;
  background-color: #f5f7fa;
}

.service-card.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.service-info {
  flex-grow: 1;
}

.service-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.service-description {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
}

.service-details {
  display: flex;
  gap: 16px;
}

.service-duration {
  color: #909399;
  font-size: 14px;
}

.service-price {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.service-select {
  display: flex;
  align-items: center;
}

.date-selection {
  margin-bottom: 24px;
}

.date-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.date-range {
  font-weight: 500;
  color: #303133;
}

.date-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.date-column {
  min-width: 120px;
  flex: 1;
}

.date-header {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e4e7ed;
}

.date-header.today {
  background: #ecf5ff;
  border-color: #c6e2ff;
}

.day-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.day-number {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.time-slots {
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 12px;
  height: 300px;
  overflow-y: auto;
}

.time-slot-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  text-align: center;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.time-slot-item:hover:not(.unavailable) {
  background: #ecf5ff;
}

.time-slot-item.selected {
  background: #409eff;
  color: white;
}

.time-slot-item.unavailable {
  background: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
  text-decoration: line-through;
}

.no-slots {
  text-align: center;
  color: #909399;
  padding: 20px 0;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.confirmation-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.confirmation-section {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.confirmation-section h5 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.confirmation-item {
  display: flex;
  margin-bottom: 8px;
}

.item-label {
  width: 100px;
  color: #606266;
}

.item-value {
  font-weight: 500;
  color: #303133;
}

.success-message {
  text-align: center;
}

.booking-summary {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: left;
}

.summary-item {
  display: flex;
  margin-bottom: 8px;
}

.summary-label {
  width: 120px;
  color: #606266;
}

.summary-value {
  font-weight: 500;
  color: #303133;
}
</style>
```

### Exercise 2: Create a Time Tracking Application

Create a time tracking application for recording work hours:

```vue
<template>
  <div class="time-tracker">
    <h3>Time Tracking Application</h3>
    
    <div class="tracker-container">
      <div class="timer-section">
        <div class="current-task">
          <h4>Current Task</h4>
          <el-input
            v-model="currentTask.description"
            placeholder="What are you working on?"
            :disabled="currentTask.isRunning"
          />
          
          <div class="task-project">
            <el-select
              v-model="currentTask.projectId"
              placeholder="Select project"
              :disabled="currentTask.isRunning"
            >
              <el-option
                v-for="project in projects"
                :key="project.id"
                :label="project.name"
                :value="project.id"
              />
            </el-select>
          </div>
          
          <div class="timer-display">
            <span class="time">{{ formatTime(currentTask.elapsedTime) }}</span>
          </div>
          
          <div class="timer-controls">
            <el-button
              v-if="!currentTask.isRunning"
              type="primary"
              @click="startTimer"
              :disabled="!currentTask.description || !currentTask.projectId"
            >
              Start Timer
            </el-button>
            <el-button
              v-else
              type="danger"
              @click="stopTimer"
            >
              Stop Timer
            </el-button>
          </div>
        </div>
        
        <div class="manual-entry">
          <h4>Manual Time Entry</h4>
          <div class="manual-form">
            <div class="form-row">
              <el-input
                v-model="manualEntry.description"
                placeholder="Task description"
              />
            </div>
            
            <div class="form-row">
              <el-select
                v-model="manualEntry.projectId"
                placeholder="Select project"
                style="width: 100%"
              >
                <el-option
                  v-for="project in projects"
                  :key="project.id"
                  :label="project.name"
                  :value="project.id"
                />
              </el-select>
            </div>
            
            <div class="form-row time-inputs">
              <div class="time-input">
                <label>Date</label>
                <el-date-picker
                  v-model="manualEntry.date"
                  type="date"
                  placeholder="Select date"
                  style="width: 100%"
                />
              </div>
              
              <div class="time-input">
                <label>Start Time</label>
                <el-time-picker
                  v-model="manualEntry.startTime"
                  placeholder="Start time"
                  format="HH:mm"
                  @change="calculateManualDuration"
                />
              </div>
              
              <div class="time-input">
                <label>End Time</label>
                <el-time-picker
                  v-model="manualEntry.endTime"
                  placeholder="End time"
                  format="HH:mm"
                  @change="calculateManualDuration"
                />
              </div>
            </div>
            
            <div class="form-row">
              <label>Duration</label>
              <div class="duration-display">
                {{ formatTime(manualEntry.duration) }}
              </div>
            </div>
            
            <div class="form-actions">
              <el-button
                type="primary"
                @click="addManualEntry"
                :disabled="!isManualEntryValid"
              >
                Add Entry
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="entries-section">
        <div class="entries-header">
          <h4>Time Entries</h4>
          <div class="date-filter">
            <el-date-picker
              v-model="dateFilter"
              type="daterange"
              range-separator="to"
              start-placeholder="Start date"
              end-placeholder="End date"
              @change="filterEntries"
            />
          </div>
        </div>
        
        <div class="entries-list">
          <div v-if="filteredEntries.length === 0" class="no-entries">
            No time entries for the selected period
          </div>
# Time Picker

## Overview

The Time Picker component is used for selecting time, supporting various time selection modes including single time and time range selection. It provides rich configuration options and customization features to meet various time selection needs.

## Learning Objectives

- Master the basic concepts and use cases of Time Picker
- Learn how to implement basic time selection functionality
- Understand time range selection and time restrictions
- Master time formatting and display
- Learn about disabled time and step configuration
- Understand custom time pickers
- Master the application of time pickers in real projects
- Master the complete usage of the API

## Basic Usage

### Basic Time Selection

The simplest time picker:

```vue
<template>
  <div>
    <h4>Basic Time Selection</h4>
    <el-time-picker
      v-model="time1"
      placeholder="Select time"
    />
    <p>Selected time: {{ time1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time1 = ref('')
</script>
```

### Time Range Restriction

Restrict the selectable time range:

```vue
<template>
  <div>
    <h4>Time Range Restriction</h4>
    <el-time-picker
      v-model="time2"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      placeholder="Select time"
    />
    <p>Only 9:00-18:00 can be selected</p>
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
  // No restrictions on minutes during work hours
  return []
}

const disabledSeconds = (hour, minute) => {
  // No restrictions on seconds
  return []
}
</script>
```

### Time Range Selection

Select a time range:

```vue
<template>
  <div>
    <h4>Time Range Selection</h4>
    <el-time-picker
      v-model="timeRange"
      is-range
      range-separator="to"
      start-placeholder="Start time"
      end-placeholder="End time"
    />
    <p>Selected time range: {{ timeRange }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const timeRange = ref('')
</script>
```

### Fixed Time Points

Provide fixed time points for selection:

```vue
<template>
  <div>
    <h4>Fixed Time Points</h4>
    <el-time-select
      v-model="time3"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="Select time"
    />
    <p>Selected time: {{ time3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time3 = ref('')
</script>
```

### Time Formatting

Customize time display format:

```vue
<template>
  <div>
    <h4>Time Formatting</h4>
    <el-time-picker
      v-model="time4"
      format="HH:mm:ss"
      value-format="HH:mm:ss"
      placeholder="Select time"
    />
    <p>Formatted time: {{ time4 }}</p>
    
    <el-time-picker
      v-model="time5"
      format="hh:mm:ss A"
      value-format="HH:mm:ss"
      placeholder="12-hour format"
    />
    <p>12-hour format time: {{ time5 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const time4 = ref('')
const time5 = ref('')
</script>
```

## Advanced Features

### Step Settings

Set the step for time selection:

```vue
<template>
  <div>
    <h4>Step Settings</h4>
    <div class="step-demo">
      <div class="step-item">
        <label>5-minute step:</label>
        <el-time-select
          v-model="stepTime1"
          start="00:00"
          step="00:05"
          end="23:59"
          placeholder="Select time"
        />
      </div>
      
      <div class="step-item">
        <label>15-minute step:</label>
        <el-time-select
          v-model="stepTime2"
          start="00:00"
          step="00:15"
          end="23:59"
          placeholder="Select time"
        />
      </div>
      
      <div class="step-item">
        <label>30-minute step:</label>
        <el-time-select
          v-model="stepTime3"
          start="00:00"
          step="00:30"
          end="23:59"
          placeholder="Select time"
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

### Disabled State

Disable the time picker:

```vue
<template>
  <div>
    <h4>Disabled State</h4>
    <div class="disabled-demo">
      <el-time-picker
        v-model="disabledTime"
        disabled
        placeholder="Disabled state"
      />
      
      <el-time-picker
        v-model="readonlyTime"
        readonly
        placeholder="Read-only state"
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

### Different Sizes

Provide time pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
    <div class="size-demo">
      <el-time-picker
        v-model="time6"
        size="large"
        placeholder="Large size"
      />
      <el-time-picker
        v-model="time7"
        placeholder="Default size"
      />
      <el-time-picker
        v-model="time8"
        size="small"
        placeholder="Small size"
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

### Clearable

Add clear functionality:

```vue
<template>
  <div>
    <h4>Clearable</h4>
    <el-time-picker
      v-model="clearableTime"
      clearable
      placeholder="Clearable time picker"
    />
    <p>Selected time: {{ clearableTime || 'Not selected' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const clearableTime = ref('')
</script>
```

## Practical Application Examples

### Meeting Room Booking Time Selection

Create a time selection component for meeting room booking:

```vue
<template>
  <div class="meeting-room-booking">
    <h3>Meeting Room Booking</h3>
    
    <div class="booking-form">
      <div class="form-section">
        <h4>Select Meeting Room</h4>
        <el-select v-model="selectedRoom" placeholder="Please select a meeting room">
          <el-option
            v-for="room in meetingRooms"
            :key="room.id"
            :label="room.name"
            :value="room.id"
          >
            <span>{{ room.name }}</span>
            <span class="room-capacity">({{ room.capacity }} people)</span>
          </el-option>
        </el-select>
      </div>
      
      <div class="form-section">
        <h4>Select Time Slot</h4>
        <div class="time-selection">
          <div class="time-item">
            <label>Start time:</label>
            <el-time-select
              v-model="startTime"
              start="08:00"
              step="00:30"
              end="18:00"
              placeholder="Select start time"
              @change="handleStartTimeChange"
            />
          </div>
          
          <div class="time-item">
            <label>End time:</label>
            <el-time-select
              v-model="endTime"
              :start="minEndTime"
              step="00:30"
              end="18:30"
              placeholder="Select end time"
              :disabled="!startTime"
            />
          </div>
        </div>
        
        <div v-if="duration" class="duration-info">
          <span class="duration-label">Meeting duration:</span>
          <span class="duration-value">{{ duration }}</span>
        </div>
      </div>
      
      <div v-if="selectedRoom && startTime && endTime" class="booking-summary">
        <h4>Booking Information</h4>
        <div class="summary-content">
          <div class="summary-item">
            <span class="label">Meeting room:</span>
            <span class="value">{{ getRoomName(selectedRoom) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Time:</span>
            <span class="value">{{ startTime }} - {{ endTime }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Duration:</span>
            <span class="value">{{ duration }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Cost:</span>
            <span class="value cost">¥{{ calculateCost() }}</span>
          </div>
        </div>
        
        <div class="booking-actions">
          <el-button type="primary" @click="confirmBooking">Confirm Booking</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </div>
      </div>
    </div>
    
    <div v-if="bookings.length > 0" class="booking-history">
      <h4>Booking History</h4>
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
              v-if="booking.status === 'Booked'"
              size="small"
              type="danger"
              @click="cancelBooking(booking.id)"
            >
              Cancel
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
    status: 'Booked'
  },
  {
    id: 2,
    roomId: 2,
    startTime: '14:00',
    endTime: '16:00',
    date: new Date(),
    status: 'Completed'
  }
])

const meetingRooms = ref([
  { id: 1, name: 'Meeting Room A', capacity: 10, hourlyRate: 50 },
  { id: 2, name: 'Meeting Room B', capacity: 20, hourlyRate: 80 },
  { id: 3, name: 'Meeting Room C', capacity: 50, hourlyRate: 150 },
  { id: 4, name: 'Multi-function Hall', capacity: 100, hourlyRate: 300 }
])

const minEndTime = computed(() => {
  if (!startTime.value) return '08:30'
  
  const [hours, minutes] = startTime.value.split(':').map(Number)
  const startMinutes = hours * 60 + minutes + 30 // minimum 30 minutes
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
    return `${minutes} minutes`
  } else if (minutes === 0) {
    return `${hours} hours`
  } else {
    return `${hours} hours ${minutes} minutes`
  }
})

const handleStartTimeChange = () => {
  // If end time is less than start time, clear end time
  if (endTime.value && startTime.value >= endTime.value) {
    endTime.value = ''
  }
}

const getRoomName = (roomId) => {
  const room = meetingRooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Meeting Room'
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
  
  const hours = Math.ceil(durationMinutes / 60) // Charged by hour, less than an hour is calculated as one hour
  
  return hours * room.hourlyRate
}

const confirmBooking = () => {
  const newBooking = {
    id: Date.now(),
    roomId: selectedRoom.value,
    startTime: startTime.value,
    endTime: endTime.value,
    date: new Date(),
    status: 'Booked'
  }
  
  bookings.value.unshift(newBooking)
  ElMessage.success('Meeting room booked successfully!')
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
    booking.status = 'Cancelled'
    ElMessage.success('Booking cancelled')
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusType = (status) => {
  const statusMap = {
    'Booked': 'warning',
    'Completed': 'success',
    'Cancelled': 'danger'
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

### Work Schedule Management

Create a work schedule management component:

```vue
<template>
  <div class="work-schedule">
    <h3>Work Schedule Management</h3>
    
    <div class="schedule-form">
      <h4>Set Work Hours</h4>
      
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
                placeholder="Start time"
                @change="validateTimeSlot(day, slot)"
              />
              <span class="time-separator">to</span>
              <el-time-select
                v-model="slot.end"
                :start="slot.start || '00:30'"
                step="00:30"
                end="23:59"
                placeholder="End time"
                :disabled="!slot.start"
              />
              <el-button
                v-if="day.timeSlots.length > 1"
                size="small"
                type="danger"
                @click="removeTimeSlot(day, index)"
              >
                Remove
              </el-button>
            </div>
            
            <el-button
              size="small"
              type="primary"
              @click="addTimeSlot(day)"
            >
              Add Time Slot
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="schedule-actions">
        <el-button type="primary" @click="saveSchedule">Save Settings</el-button>
        <el-button @click="resetSchedule">Reset</el-button>
        <el-button @click="applyTemplate">Apply Template</el-button>
      </div>
    </div>
    
    <div class="schedule-preview">
      <h4>Work Schedule Preview</h4>
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
          No work hours set yet
        </div>
      </div>
      
      <div class="schedule-stats">
        <div class="stat-item">
          <span class="stat-label">Working days:</span>
          <span class="stat-value">{{ enabledDays.length }} days/week</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total work hours:</span>
          <span class="stat-value">{{ totalWorkHours }} hours/week</span>
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
    name: 'Monday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'tuesday',
    name: 'Tuesday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'wednesday',
    name: 'Wednesday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'thursday',
    name: 'Thursday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'friday',
    name: 'Friday',
    enabled: true,
    timeSlots: [{ start: '09:00', end: '18:00' }]
  },
  {
    key: 'saturday',
    name: 'Saturday',
    enabled: false,
    timeSlots: [{ start: '', end: '' }]
  },
  {
    key: 'sunday',
    name: 'Sunday',
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
    // Clear time slots when disabled
    day.timeSlots = [{ start: '', end: '' }]
  } else {
    // Set default time slot when enabled
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
    ElMessage.warning('End time must be greater than start time')
    slot.end = ''
  }
}

const saveSchedule = () => {
  // Validate time slots
  let isValid = true
  
  enabledDays.value.forEach(day => {
    day.timeSlots.forEach(slot => {
      if (!slot.start || !slot.end) {
        isValid = false
      }
    })
  })
  
  if (!isValid) {
    ElMessage.warning('Please complete all time slot settings')
    return
  }
  
  ElMessage.success('Work schedule settings saved')
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
  
  ElMessage.success('Reset to default work schedule')
}

const applyTemplate = () => {
  // Apply flexible work schedule template
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
  
  ElMessage.success('Applied flexible work schedule template')
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
  width: 80px;
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

## API Documentation

### TimePicker Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | Date / string | — |
| readonly | whether TimePicker is read only | boolean | false |
| disabled | whether TimePicker is disabled | boolean | false |
| editable | whether the input is editable | boolean | true |
| clearable | whether to show clear button | boolean | true |
| size | size of Input | string | — |
| placeholder | placeholder in non-range mode | string | — |
| start-placeholder | placeholder for the start time in range mode | string | — |
| end-placeholder | placeholder for the end time in range mode | string | — |
| is-range | whether to pick a time range | boolean | false |
| arrow-control | whether to pick time using arrow buttons | boolean | false |
| align | alignment | left / center / right | left |
| popper-class | custom class name for TimePicker's dropdown | string | — |
| range-separator | range separator | string | '-' |
| format | format of the displayed value in the input box | string | HH:mm:ss |
| default-value | optional, default date of the calendar | Date / [Date, Date] | — |
