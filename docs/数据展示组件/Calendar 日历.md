# Calendar 日历

## 概述

Calendar 日历组件用于显示日期，支持选择日期和自定义日历单元格内容。它提供了清晰的月视图界面，适用于日程安排、事件展示等场景。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

## 学习目标

- 掌握 Calendar 组件的基础用法
- 学会自定义日历单元格内容
- 理解日历范围设置和头部自定义
- 掌握国际化配置
- 了解 Calendar 组件的 API 和最佳实践

## 基础用法

### 基础日历

设置 `value` 来指定当前显示的月份。如果 `value` 未指定，则显示当月。`value` 支持 `v-model` 双向绑定。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

```vue
<template>
  <div class="calendar-demo">
    <h3>基础日历</h3>
    <el-calendar v-model="value" />
    <p>选中的日期：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref(new Date())
</script>
```

### 自定义内容

通过设置名为 `date-cell` 的 scoped-slot 来自定义日历单元格中显示的内容。在 scoped-slot 可以获取到 `date`（当前单元格的日期）、`data`（包括 `type`、`isSelected`、`day` 属性）。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-calendar">
    <h3>自定义内容日历</h3>
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

// 模拟事件数据
const events = {
  '2024-01-15': { title: '会议', type: 'primary' },
  '2024-01-20': { title: '生日', type: 'success' },
  '2024-01-25': { title: '截止日', type: 'danger' }
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

## 日历范围

设置 `range` 属性指定日历的显示范围。开始时间必须是周起始日，结束时间必须是周结束日，且时间跨度不能超过两个月。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

```vue
<template>
  <div class="range-calendar">
    <h3>范围日历</h3>
    <el-calendar :range="range" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 设置显示范围：从本月第一周开始到下月最后一周结束
const range = ref([
  new Date(2024, 0, 1), // 2024年1月1日
  new Date(2024, 1, 29)  // 2024年2月29日
])
</script>
```

## 自定义日历头部

通过 `header` 插槽可以自定义日历头部内容。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-header-calendar">
    <h3>自定义头部日历</h3>
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
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
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

## 实际应用示例

### 事件日历系统

```vue
<template>
  <div class="event-calendar-system">
    <h3>事件日历系统</h3>
    
    <!-- 添加事件表单 -->
    <el-card class="event-form" style="margin-bottom: 20px;">
      <template #header>
        <span>添加事件</span>
      </template>
      
      <el-form :model="eventForm" inline>
        <el-form-item label="日期">
          <el-date-picker
            v-model="eventForm.date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item label="事件">
          <el-input v-model="eventForm.title" placeholder="事件标题" />
        </el-form-item>
        
        <el-form-item label="类型">
          <el-select v-model="eventForm.type" placeholder="选择类型">
            <el-option label="工作" value="primary" />
            <el-option label="个人" value="success" />
            <el-option label="重要" value="danger" />
            <el-option label="其他" value="info" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="addEvent">添加</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 日历显示 -->
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
    
    <!-- 事件详情对话框 -->
    <el-dialog v-model="eventDetailVisible" title="事件详情" width="400px">
      <div v-if="selectedEvent">
        <p><strong>标题：</strong>{{ selectedEvent.title }}</p>
        <p><strong>日期：</strong>{{ selectedEvent.date }}</p>
        <p><strong>类型：</strong>{{ getTypeLabel(selectedEvent.type) }}</p>
      </div>
      <template #footer>
        <el-button @click="eventDetailVisible = false">关闭</el-button>
        <el-button type="danger" @click="deleteEvent">删除</el-button>
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

// 事件表单
const eventForm = reactive({
  date: '',
  title: '',
  type: 'primary'
})

// 事件列表
const events = ref([
  { id: 1, date: '2024-01-15', title: '团队会议', type: 'primary' },
  { id: 2, date: '2024-01-20', title: '生日聚会', type: 'success' },
  { id: 3, date: '2024-01-25', title: '项目截止', type: 'danger' }
])

// 获取指定日期的事件
const getEventsForDate = (date) => {
  return events.value.filter(event => event.date === date)
}

// 添加事件
const addEvent = () => {
  if (!eventForm.date || !eventForm.title) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const newEvent = {
    id: Date.now(),
    date: eventForm.date,
    title: eventForm.title,
    type: eventForm.type
  }
  
  events.value.push(newEvent)
  
  // 重置表单
  eventForm.date = ''
  eventForm.title = ''
  eventForm.type = 'primary'
  
  ElMessage.success('事件添加成功')
}

// 显示事件详情
const showEventDetail = (event) => {
  selectedEvent.value = event
  eventDetailVisible.value = true
}

// 删除事件
const deleteEvent = () => {
  if (selectedEvent.value) {
    const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
    if (index > -1) {
      events.value.splice(index, 1)
      ElMessage.success('事件删除成功')
    }
  }
  eventDetailVisible.value = false
}

// 获取类型标签
const getTypeLabel = (type) => {
  const typeMap = {
    primary: '工作',
    success: '个人',
    danger: '重要',
    info: '其他'
  }
  return typeMap[type] || '其他'
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

## API 文档

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 选中项绑定值 | Date | — |
| range | 时间范围，包括开始时间与结束时间。开始时间必须是周起始日，结束时间必须是周结束日，且时间跨度不能超过两个月 | Array | — |

### Slots

| 插槽名 | 说明 | 类型 |
|--------|------|------|
| date-cell | 自定义日期单元格内容。参数为 `{ date, data }`，其中 `data` 包含 `type`（表示该日期的所属月份，可选值有 `prev-month`、`current-month` 和 `next-month`）、`isSelected`（标明该日期是否被选中）、`day`（格式化的日期，格式为 yyyy-MM-dd）、`date`（单元格的日期） | Object |
| header | 卡片标题内容 | Object |

### 暴露的方法

| 名称 | 说明 | 类型 |
|------|------|------|
| selectedDay | 当前已选日期 | Object |
| pickDay | 选择一个具体日期 | Function |
| selectDate | 选择日期 | Function |
| calculateValidatedDateRange | 根据开始与结束日期计算验证日期范围 | Function |

### 类型声明

```typescript
type CalendarDateType =
  | 'prev-month'
  | 'next-month'
  | 'prev-year'
  | 'next-year'
  | 'today'
```

## 国际化

由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考国际化文档。要注意的是：日期相关的文字（月份，每一周的第一天等等）也都是通过国际化来配置的。<mcreference link="https://element-plus.org/zh-CN/component/calendar.html" index="0">0</mcreference>

```javascript
// 在 main.js 中配置中文
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
```

## 最佳实践

### 性能优化

1. **数据懒加载**：对于大量事件数据，考虑按月份懒加载
2. **虚拟滚动**：处理大量日期范围时使用虚拟滚动
3. **事件缓存**：缓存已加载的事件数据，避免重复请求

### 用户体验

1. **响应式设计**：确保在移动设备上的良好显示
2. **加载状态**：在数据加载时显示加载指示器
3. **错误处理**：优雅处理日期范围错误和数据加载失败

### 可访问性

1. **键盘导航**：支持键盘方向键导航日期
2. **屏幕阅读器**：为日期和事件提供适当的 aria 标签
3. **焦点管理**：合理管理焦点状态

## 常见问题

### 1. 日期显示不正确

**问题**：日历显示的日期格式不符合预期

**解决方案**：
- 检查国际化配置是否正确
- 确认传入的日期格式是否为 Date 对象
- 验证时区设置

### 2. 自定义内容不显示

**问题**：使用 date-cell 插槽后内容不显示

**解决方案**：
- 确认插槽名称为 `date-cell`
- 检查插槽参数解构是否正确
- 验证自定义内容的样式是否被覆盖

### 3. 范围设置无效

**问题**：设置 range 属性后日历范围没有变化

**解决方案**：
- 确保开始时间是周起始日
- 确保结束时间是周结束日
- 验证时间跨度不超过两个月

## 总结

Calendar 日历组件是一个功能丰富的日期展示组件，支持基础日期选择、自定义内容、范围设置等功能。通过合理使用插槽和 API，可以构建出功能完善的日历应用。在实际开发中，需要注意性能优化、用户体验和可访问性等方面的最佳实践。

## 参考资料

- [Element Plus Calendar 官方文档](https://element-plus.org/zh-CN/component/calendar.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [JavaScript Date 对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)