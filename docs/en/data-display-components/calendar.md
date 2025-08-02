# Calendar

## Overview

The Calendar component is used to display dates, supporting date selection and customization of calendar cell content. It provides a clear monthly view interface, suitable for scheduling, event display, and other scenarios.

## Learning Objectives

- Master the basic usage of the Calendar component
- Learn to customize calendar cell content
- Understand calendar range settings and header customization
- Master internationalization configuration
- Understand Calendar component API and best practices

## Basic Usage

### Basic Calendar

Set `value` to specify the currently displayed month. If `value` is not specified, the current month is displayed. `value` supports two-way binding with `v-model`.

```vue
<template>
  <div class="calendar-demo">
    <h3>Basic Calendar</h3>
    <el-calendar v-model="value" />
    <p>Selected date: {{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(new Date())
</script>
```

### Custom Content

Customize the content displayed in calendar cells by setting a scoped slot named `date-cell`. In the scoped slot, you can access `date` (the date of the current cell) and `data` (including `type`, `isSelected`, and `day` properties).

```vue
<template>
  <div class="custom-calendar">
    <h3>Custom Content Calendar</h3>
    <el-calendar v-model="value">
      <template #date-cell="{ data }">
        <div class="custom-cell">
          <div class="date">{{ data.day.split('-').slice(1).join('-') }}</div>
          <div class="content" v-if="getEventForDate(data.day)">
            <el-tag size="small" :type="getEventForDate(data.day).type">
              {{ getEventForDate(data.day).title }}
            </el-tag>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(new Date())

// Mock event data
const events = {
  '2024-01-15': { title: 'Meeting', type: 'primary' },
  '2024-01-20': { title: 'Birthday', type: 'success' },
  '2024-01-25': { title: 'Deadline', type: 'danger' }
}

const getEventForDate = (date) => {
  return events[date]
}
</script>

<style scoped>
.custom-cell {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.date {
  font-weight: bold;
  margin-bottom: 4px;
}

.content {
  font-size: 12px;
}
</style>
```

## Calendar Range

Set the `range` property to specify the display range of the calendar. The start time must be the first day of the week, the end time must be the last day of the week, and the time span cannot exceed two months.

```vue
<template>
  <div class="range-calendar">
    <h3>Range Calendar</h3>
    <el-calendar :range="range" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Set display range: from the first week of this month to the last week of next month
const range = ref([
  new Date(2024, 0, 1), // January 1, 2024
  new Date(2024, 1, 29)  // February 29, 2024
])
</script>
```

## Custom Calendar Header

Customize the calendar header content through the `header` slot.

```vue
<template>
  <div class="custom-header-calendar">
    <h3>Custom Header Calendar</h3>
    <el-calendar v-model="value">
      <template #header="{ date }">
        <div class="custom-header">
          <el-button-group>
            <el-button @click="selectDate('prev-year')">
              <el-icon><DArrowLeft /></el-icon>
            </el-button>
            <el-button @click="selectDate('prev-month')">
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
          </el-button-group>
          <span class="title">{{ formatDate(date) }}</span>
          <el-button-group>
            <el-button @click="selectDate('next-month')">
              <el-icon><ArrowRight /></el-icon>
            </el-button>
            <el-button @click="selectDate('next-year')">
              <el-icon><DArrowRight /></el-icon>
            </el-button>
          </el-button-group>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DArrowLeft, ArrowLeft, ArrowRight, DArrowRight } from '@element-plus/icons-vue'

const value = ref(new Date())

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

const selectDate = (type) => {
  const currentDate = new Date(value.value)
  
  switch (type) {
    case 'prev-year':
      currentDate.setFullYear(currentDate.getFullYear() - 1)
      break
    case 'prev-month':
      currentDate.setMonth(currentDate.getMonth() - 1)
      break
    case 'next-month':
      currentDate.setMonth(currentDate.getMonth() + 1)
      break
    case 'next-year':
      currentDate.setFullYear(currentDate.getFullYear() + 1)
      break
  }
  
  value.value = currentDate
}
</script>

<style scoped>
.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

.title {
  font-size: 16px;
  font-weight: bold;
}
</style>
```

## Practical Application Example

### Event Calendar System

```vue
<template>
  <div class="event-calendar-system">
    <h3>Event Calendar System</h3>
    
    <!-- Add Event Form -->
    <el-card class="event-form" style="margin-bottom: 20px;">
      <template #header>
        <span>Add Event</span>
      </template>
      
      <el-form :model="eventForm" inline>
        <el-form-item label="Date">
          <el-date-picker
            v-model="eventForm.date"
            type="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="Event">
          <el-input v-model="eventForm.title" placeholder="Event title" />
        </el-form-item>
        
        <el-form-item label="Type">
          <el-select v-model="eventForm.type" placeholder="Select type">
            <el-option label="Work" value="primary" />
            <el-option label="Personal" value="success" />
            <el-option label="Important" value="danger" />
            <el-option label="Other" value="info" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="addEvent">Add</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- Calendar Display -->
    <el-calendar v-model="selectedDate">
      <template #date-cell="{ data }">
        <div class="calendar-cell" :class="{ 'is-selected': data.isSelected }">
          <div class="date-number">{{ data.day.split('-')[2] }}</div>
          <div class="events">
            <div
              v-for="event in getEventsForDate(data.day)"
              :key="event.id"
              class="event-item"
              :class="`event-${event.type}`"
              @click="showEventDetail(event)"
            >
              {{ event.title }}
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    
    <!-- Event Detail Dialog -->
    <el-dialog v-model="eventDetailVisible" title="Event Details" width="400px">
      <div v-if="selectedEvent">
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Date:</strong> {{ selectedEvent.date }}</p>
        <p><strong>Type:</strong> {{ getTypeLabel(selectedEvent.type) }}</p>
      </div>
      <template #footer>
        <el-button @click="eventDetailVisible = false">Close</el-button>
        <el-button type="danger" @click="deleteEvent">Delete</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const selectedDate = ref(new Date())
const eventDetailVisible = ref(false)
const selectedEvent = ref(null)

// Event form
const eventForm = reactive({
  date: '',
  title: '',
  type: 'primary'
})

// Event list
const events = ref([
  { id: 1, date: '2024-01-15', title: 'Team Meeting', type: 'primary' },
  { id: 2, date: '2024-01-20', title: 'Birthday Party', type: 'success' },
  { id: 3, date: '2024-01-25', title: 'Project Deadline', type: 'danger' }
])

// Get events for a specific date
const getEventsForDate = (date) => {
  return events.value.filter(event => event.date === date)
}

// Add event
const addEvent = () => {
  if (!eventForm.date || !eventForm.title) {
    ElMessage.warning('Please fill in all information')
    return
  }
  
  const newEvent = {
    id: Date.now(),
    date: eventForm.date,
    title: eventForm.title,
    type: eventForm.type
  }
  
  events.value.push(newEvent)
  
  // Reset form
  eventForm.date = ''
  eventForm.title = ''
  eventForm.type = 'primary'
  
  ElMessage.success('Event added successfully')
}

// Show event details
const showEventDetail = (event) => {
  selectedEvent.value = event
  eventDetailVisible.value = true
}

// Delete event
const deleteEvent = () => {
  if (selectedEvent.value) {
    const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
    if (index > -1) {
      events.value.splice(index, 1)
      ElMessage.success('Event deleted successfully')
    }
  }
  eventDetailVisible.value = false
}

// Get type label
const getTypeLabel = (type) => {
  const typeMap = {
    primary: 'Work',
    success: 'Personal',
    danger: 'Important',
    info: 'Other'
  }
  return typeMap[type] || 'Other'
}
</script>

<style scoped>
.calendar-cell {
  height: 80px;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.date-number {
  font-weight: bold;
  margin-bottom: 4px;
}

.events {
  flex: 1;
  overflow: hidden;
}

.event-item {
  font-size: 12px;
  padding: 2px 4px;
  margin-bottom: 2px;
  border-radius: 2px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-primary {
  background-color: #e1f3ff;
  color: #409eff;
}

.event-success {
  background-color: #f0f9ff;
  color: #67c23a;
}

.event-danger {
  background-color: #fef0f0;
  color: #f56c6c;
}

.event-info {
  background-color: #f4f4f5;
  color: #909399;
}

.is-selected {
  background-color: #f0f9ff;
}
</style>
```

## API Documentation

### Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| model-value / v-model | Binding value | Date | — |
| range | Time range, including start time and end time. Start time must be the first day of the week, end time must be the last day of the week, and the time span cannot exceed two months | Array | — |

### Slots

| Slot Name | Description | Type |
|--------|------|------|
| date-cell | Custom date cell content. Parameters are `{ date, data }`, where `data` contains `type` (indicating the month to which the date belongs, possible values are `prev-month`, `current-month`, and `next-month`), `isSelected` (indicating whether the date is selected), `day` (formatted date, format is yyyy-MM-dd), and `date` (the date of the cell) | Object |
| header | Card title content | Object |

### Exposed Methods

| Name | Description | Type |
|------|------|------|
| selectedDay | Currently selected date | Object |
| pickDay | Select a specific date | Function |
| selectDate | Select date | Function |
| calculateValidatedDateRange | Calculate validated date range based on start and end dates | Function |

### Type Declarations

```typescript
type CalendarDateType =
  | 'prev-month'
  | 'next-month'
  | 'prev-year'
  | 'next-year'
  | 'today'
```

## Internationalization

Since Element Plus's default language is English, if you need to set another language, please refer to the internationalization documentation. Note that date-related text (months, first day of each week, etc.) is also configured through internationalization.

```javascript
// Configure Chinese in main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
```

## Best Practices

### Performance Optimization

1. **Data Lazy Loading**: Consider lazy loading by month for large amounts of event data
2. **Virtual Scrolling**: Use virtual scrolling when handling a large date range
3. **Event Caching**: Cache loaded event data to avoid repeated requests

### User Experience

1. **Responsive Design**: Ensure good display on mobile devices
2. **Loading State**: Display loading indicators when data is loading
3. **Error Handling**: Gracefully handle date range errors and data loading failures

### Accessibility

1. **Keyboard Navigation**: Support keyboard arrow key navigation for dates
2. **Screen Reader**: Provide appropriate aria labels for dates and events
3. **Focus Management**: Properly manage focus states

## Common Issues

### 1. Incorrect Date Display

**Issue**: Calendar displays date format that doesn't meet expectations

**Solution**:
- Check if internationalization configuration is correct
- Confirm that the input date format is a Date object
- Verify timezone settings

### 2. Custom Content Not Displaying

**Issue**: Content not displaying after using date-cell slot

**Solution**:
- Confirm that the slot name is `date-cell`
- Check if slot parameter destructuring is correct
- Verify that custom content styles are not being overridden

### 3. Range Setting Invalid

**Issue**: Calendar range doesn't change after setting the range property

**Solution**:
- Ensure start time is the first day of the week
- Ensure end time is the last day of the week
- Verify that the time span doesn't exceed two months

## Summary

The Calendar component is a feature-rich date display component that supports basic date selection, custom content, range settings, and more. By properly using slots and APIs, you can build fully functional calendar applications. In actual development, attention should be paid to performance optimization, user experience, and accessibility best practices.

## References

- [Element Plus Calendar Official Documentation](https://element-plus.org/en-US/component/calendar.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [JavaScript Date Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)