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
| value-format | binding value format | string | — |
| default-value | optional, default date of the calendar | Date / string | — |
| name | native attribute | string | — |
| prefix-icon | custom prefix icon | string / Component | Clock |
| clear-icon | custom clear icon | string / Component | CircleClose |
| disabled-hours | a function that disables specific hours | Function | — |
| disabled-minutes | a function that disables specific minutes | Function | — |
| disabled-seconds | a function that disables specific seconds | Function | — |
| teleported | whether TimePicker dropdown is teleported to the body | boolean | true |

### TimeSelect Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string | — |
| disabled | whether TimeSelect is disabled | boolean | false |
| editable | whether the input is editable | boolean | true |
| clearable | whether to show clear button | boolean | true |
| size | size of Input | string | — |
| placeholder | placeholder | string | — |
| name | native attribute | string | — |
| effect | Tooltip theme | string | light |
| prefix-icon | custom prefix icon | string / Component | Clock |
| clear-icon | custom clear icon | string / Component | CircleClose |
| start | start time | string | 09:00 |
| end | end time | string | 18:00 |
| step | time step | string | 00:30 |
| min-time | minimum time | string | 00:00 |
| max-time | maximum time | string | — |
| format | format of the displayed value in the input box | string | HH:mm |

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

## Practice Exercises

### Exercise 1: Class Schedule Time Setting

Create a class schedule time setting system:

```vue
<template>
  <div class="course-schedule">
    <h3>Class Schedule Setting</h3>
    
    <div class="schedule-settings">
      <h4>Set Class Times</h4>
      
      <div class="time-periods">
        <div
          v-for="(period, index) in timePeriods"
          :key="index"
          class="period-item"
        >
          <div class="period-label">Class {{ index + 1 }}</div>
          <el-time-select
            v-model="period.start"
            start="08:00"
            step="00:05"
            end="22:00"
            placeholder="Start time"
          />
          <span class="time-separator">-</span>
          <el-time-select
            v-model="period.end"
            :start="period.start || '08:05'"
            step="00:05"
            end="22:00"
            placeholder="End time"
            :disabled="!period.start"
          />
          <el-button
            v-if="timePeriods.length > 1"
            size="small"
            type="danger"
            @click="removePeriod(index)"
          >
            Delete
          </el-button>
        </div>
      </div>
      
      <div class="period-actions">
        <el-button size="small" @click="addPeriod">Add Class Period</el-button>
        <el-button size="small" @click="applyStandardSchedule">Apply Standard Schedule</el-button>
      </div>
    </div>
    
    <div class="schedule-preview">
      <h4>Schedule Preview</h4>
      <div class="preview-table">
        <div class="time-column">
          <div class="time-header">Time</div>
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
            <!-- Course content can be added here -->
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

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

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
  
  ElMessage.success('Standard class schedule applied')
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

### Exercise 2: Countdown Timer Setting

Create a countdown timer setting component:

```vue
<template>
  <div class="countdown-timer">
    <h3>Countdown Timer</h3>
    
    <div class="timer-settings">
      <h4>Set Countdown Time</h4>
      
      <div class="time-input">
        <div class="input-group">
          <label>Hours:</label>
          <el-input-number
            v-model="hours"
            :min="0"
            :max="23"
            controls-position="right"
          />
        </div>
        
        <div class="input-group">
          <label>Minutes:</label>
          <el-input-number
            v-model="minutes"
            :min="0"
            :max="59"
            controls-position="right"
          />
        </div>
        
        <div class="input-group">
          <label>Seconds:</label>
          <el-input-number
            v-model="seconds"
            :min="0"
            :max="59"
            controls-position="right"
          />
        </div>
      </div>
      
      <div class="quick-settings">
        <h5>Quick Settings</h5>
        <div class="quick-buttons">
          <el-button size="small" @click="setTime(0, 1, 0)">1 minute</el-button>
          <el-button size="small" @click="setTime(0, 5, 0)">5 minutes</el-button>
          <el-button size="small" @click="setTime(0, 10, 0)">10 minutes</el-button>
          <el-button size="small" @click="setTime(0, 30, 0)">30 minutes</el-button>
          <el-button size="small" @click="setTime(1, 0, 0)">1 hour</el-button>
        </div>
      </div>
      
      <div class="timer-controls">
        <el-button
          type="primary"
          :disabled="totalSeconds === 0"
          @click="startTimer"
        >
          Start Countdown
        </el-button>
        <el-button @click="resetTimer">Reset</el-button>
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
          Continue
        </el-button>
        <el-button
          v-if="isRunning"
          type="warning"
          @click="pauseTimer"
        >
          Pause
        </el-button>
        <el-button @click="stopTimer">Stop</el-button>
      </div>
    </div>
    
    <div v-if="isFinished" class="timer-finished">
      <div class="finished-message">
        <el-icon size="48" color="#67c23a">
          <Check />
        </el-icon>
        <h3>Countdown Complete!</h3>
        <p>The set time has elapsed</p>
      </div>
      
      <el-button type="primary" @click="resetTimer">
        Set New Timer
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
    ElMessage.warning('Please set a countdown time')
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
      
      // Play sound or show notification
      ElMessage.success('Countdown complete!')
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
  padding: 40px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.finished-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.finished-message h3 {
  margin: 0;
  color: #67c23a;
}

.finished-message p {
  margin: 0;
  color: #606266;
}
</style>
```
