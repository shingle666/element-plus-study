# Time Select 时间选择

## 概述

Time Select 时间选择组件用于选择或输入时间，提供了一个用户友好的时间选择界面。它支持时、分、秒的选择，可以设置时间范围、步长等，适用于各种需要时间输入的场景。

### 主要特性

- **灵活的时间格式**：支持多种时间格式显示
- **时间范围限制**：可设置可选时间的范围
- **步长控制**：支持自定义时间步长
- **禁用时间**：可禁用特定时间段
- **表单集成**：与 el-form 完美集成
- **键盘操作**：支持键盘快捷操作

### 适用场景

- 预约系统的时间选择
- 会议安排和日程管理
- 工作时间设置
- 定时任务配置
- 营业时间设置

## 学习目标

### 基础知识
- 掌握 Time Select 组件的基本概念和使用场景
- 学会基础时间选择功能的实现
- 了解时间格式的配置方法
- 掌握时间范围的设置

### 进阶技能
- 学会自定义时间步长
- 掌握禁用时间的配置
- 了解时间验证和校验
- 学会自定义时间显示格式

### 实战应用
- 能够构建完整的预约系统
- 掌握会议室预订功能
- 了解性能优化和用户体验提升
- 学会与其他组件的集成使用

## 基础用法

### 基本时间选择

最简单的时间选择功能：

```vue
<template>
  <div>
    <h4>基础时间选择</h4>
    <el-time-select
      v-model="value"
      start="08:30"
      step="00:15"
      end="18:30"
      placeholder="选择时间"
      @change="handleChange"
    />
    <p>选择的时间：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const handleChange = (val) => {
  console.log('时间变化：', val)
}
</script>
```

### 固定时间点

设置固定的时间选项：

```vue
<template>
  <div>
    <h4>固定时间点</h4>
    <el-time-select
      v-model="value"
      start="09:00"
      step="01:00"
      end="17:00"
      placeholder="选择工作时间"
      @change="handleChange"
    />
    <p>工作时间：{{ value }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const value = ref('')

const handleChange = (val) => {
  console.log('工作时间：', val)
}
</script>
```

### 限制时间范围

通过 start 和 end 属性限制可选时间范围：

```vue
<template>
  <div>
    <h4>限制时间范围</h4>
    
    <div class="time-range-example">
      <label>上午时间段（9:00-12:00）：</label>
      <el-time-select
        v-model="morningTime"
        start="09:00"
        step="00:30"
        end="12:00"
        placeholder="选择上午时间"
        @change="handleMorningChange"
      />
    </div>
    
    <div class="time-range-example">
      <label>下午时间段（14:00-18:00）：</label>
      <el-time-select
        v-model="afternoonTime"
        start="14:00"
        step="00:30"
        end="18:00"
        placeholder="选择下午时间"
        @change="handleAfternoonChange"
      />
    </div>
    
    <div class="time-range-example">
      <label>晚上时间段（19:00-22:00）：</label>
      <el-time-select
        v-model="eveningTime"
        start="19:00"
        step="00:15"
        end="22:00"
        placeholder="选择晚上时间"
        @change="handleEveningChange"
      />
    </div>
    
    <div class="selected-times">
      <h5>已选择的时间：</h5>
      <p>上午：{{ morningTime || '未选择' }}</p>
      <p>下午：{{ afternoonTime || '未选择' }}</p>
      <p>晚上：{{ eveningTime || '未选择' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const morningTime = ref('')
const afternoonTime = ref('')
const eveningTime = ref('')

const handleMorningChange = (val) => {
  console.log('上午时间：', val)
}

const handleAfternoonChange = (val) => {
  console.log('下午时间：', val)
}

const handleEveningChange = (val) => {
  console.log('晚上时间：', val)
}
</script>

<style scoped>
.time-range-example {
  margin-bottom: 16px;
}

.time-range-example label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.selected-times {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.selected-times h5 {
  margin: 0 0 8px 0;
  color: #303133;
}

.selected-times p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

### 任意时间范围

使用 min-time 和 max-time 属性设置动态时间范围：

```vue
<template>
  <div>
    <h4>任意时间范围</h4>
    
    <div class="dynamic-range">
      <div class="range-controls">
        <el-form :inline="true">
          <el-form-item label="最早时间：">
            <el-time-select
              v-model="minTime"
              start="00:00"
              step="00:30"
              end="23:30"
              placeholder="设置最早时间"
              @change="updateTimeRange"
            />
          </el-form-item>
          
          <el-form-item label="最晚时间：">
            <el-time-select
              v-model="maxTime"
              start="00:00"
              step="00:30"
              end="23:30"
              placeholder="设置最晚时间"
              @change="updateTimeRange"
            />
          </el-form-item>
        </el-form>
      </div>
      
      <div class="time-selector">
        <label>选择时间：</label>
        <el-time-select
          v-model="selectedTime"
          :start="minTime || '00:00'"
          :end="maxTime || '23:30'"
          step="00:15"
          placeholder="在设定范围内选择时间"
          :disabled="!minTime || !maxTime"
          @change="handleTimeChange"
        />
      </div>
      
      <div class="range-info">
        <p>可选时间范围：{{ minTime || '未设置' }} - {{ maxTime || '未设置' }}</p>
        <p>选择的时间：{{ selectedTime || '未选择' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const minTime = ref('')
const maxTime = ref('')
const selectedTime = ref('')

const updateTimeRange = () => {
  if (minTime.value && maxTime.value) {
    if (minTime.value >= maxTime.value) {
      ElMessage.warning('最早时间不能晚于或等于最晚时间')
      return
    }
    
    // 如果选择的时间超出新范围，清空选择
    if (selectedTime.value) {
      if (selectedTime.value < minTime.value || selectedTime.value > maxTime.value) {
        selectedTime.value = ''
        ElMessage.info('已清空超出范围的时间选择')
      }
    }
  }
}

const handleTimeChange = (val) => {
  console.log('选择时间：', val)
}
</script>

<style scoped>
.dynamic-range {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}

.range-controls {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.time-selector {
  margin-bottom: 16px;
}

.time-selector label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #303133;
}

.range-info {
  padding: 12px;
  background-color: #f0f9ff;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.range-info p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

### 禁用状态

设置组件的禁用状态：

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    
    <div class="disabled-example">
      <el-form :inline="true">
        <el-form-item label="启用状态：">
          <el-time-select
            v-model="enabledTime"
            start="09:00"
            step="00:30"
            end="18:00"
            placeholder="正常选择时间"
          />
        </el-form-item>
        
        <el-form-item label="禁用状态：">
          <el-time-select
            v-model="disabledTime"
            start="09:00"
            step="00:30"
            end="18:00"
            placeholder="禁用状态"
            disabled
          />
        </el-form-item>
      </el-form>
      
      <div class="control-section">
        <el-button @click="toggleDisabled">切换禁用状态</el-button>
        <el-button @click="clearTimes">清空时间</el-button>
      </div>
      
      <div class="status-info">
        <p>启用状态时间：{{ enabledTime || '未选择' }}</p>
        <p>禁用状态时间：{{ disabledTime || '未选择' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enabledTime = ref('')
const disabledTime = ref('14:30') // 预设值
const isDisabled = ref(true)

const toggleDisabled = () => {
  isDisabled.value = !isDisabled.value
}

const clearTimes = () => {
  enabledTime.value = ''
  disabledTime.value = ''
}
</script>

<style scoped>
.disabled-example {
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 16px;
}

.control-section {
  margin: 16px 0;
  padding: 12px 0;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}

.status-info {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.status-info p {
  margin: 4px 0;
  color: #606266;
}
</style>
```

## 在表单中使用

与 el-form 一起使用：

```vue
<template>
  <div>
    <h4>表单中的时间选择</h4>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="会议标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入会议标题" />
      </el-form-item>
      
      <el-form-item label="开始时间" prop="startTime">
        <el-time-select
          v-model="form.startTime"
          start="08:00"
          step="00:30"
          end="22:00"
          placeholder="选择开始时间"
          @change="handleStartTimeChange"
        />
      </el-form-item>
      
      <el-form-item label="结束时间" prop="endTime">
        <el-time-select
          v-model="form.endTime"
          :start="getEndTimeStart()"
          step="00:30"
          end="22:00"
          placeholder="选择结束时间"
          :disabled="!form.startTime"
          @change="handleEndTimeChange"
        />
      </el-form-item>
      
      <el-form-item label="会议室" prop="room">
        <el-select v-model="form.room" placeholder="选择会议室">
          <el-option label="会议室A" value="roomA" />
          <el-option label="会议室B" value="roomB" />
          <el-option label="会议室C" value="roomC" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="重复设置" prop="repeat">
        <el-radio-group v-model="form.repeat">
          <el-radio label="none">不重复</el-radio>
          <el-radio label="daily">每天</el-radio>
          <el-radio label="weekly">每周</el-radio>
          <el-radio label="monthly">每月</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">预订会议室</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="presetQuickMeeting">快速会议</el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="submittedData" class="submitted-data">
      <h4>预订信息：</h4>
      <div class="meeting-info">
        <p><strong>会议标题：</strong>{{ submittedData.title }}</p>
        <p><strong>时间：</strong>{{ submittedData.startTime }} - {{ submittedData.endTime }}</p>
        <p><strong>时长：</strong>{{ calculateDuration(submittedData.startTime, submittedData.endTime) }}</p>
        <p><strong>会议室：</strong>{{ getRoomName(submittedData.room) }}</p>
        <p><strong>重复：</strong>{{ getRepeatText(submittedData.repeat) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submittedData = ref(null)

const form = reactive({
  title: '',
  startTime: '',
  endTime: '',
  room: '',
  repeat: 'none'
})

const rules = {
  title: [
    { required: true, message: '请输入会议标题', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    { validator: validateEndTime, trigger: 'change' }
  ],
  room: [
    { required: true, message: '请选择会议室', trigger: 'change' }
  ]
}

function validateEndTime(rule, value, callback) {
  if (!value) {
    callback(new Error('请选择结束时间'))
  } else if (form.startTime && value <= form.startTime) {
    callback(new Error('结束时间必须晚于开始时间'))
  } else {
    callback()
  }
}

const handleStartTimeChange = (val) => {
  console.log('开始时间变化：', val)
  // 如果结束时间早于或等于开始时间，清空结束时间
  if (form.endTime && form.endTime <= val) {
    form.endTime = ''
    ElMessage.info('已清空结束时间，请重新选择')
  }
}

const handleEndTimeChange = (val) => {
  console.log('结束时间变化：', val)
}

const getEndTimeStart = () => {
  if (!form.startTime) return '08:00'
  
  // 结束时间至少比开始时间晚30分钟
  const [hours, minutes] = form.startTime.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + 30
  const newHours = Math.floor(totalMinutes / 60)
  const newMinutes = totalMinutes % 60
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    submittedData.value = { ...form }
    ElMessage.success('会议室预订成功')
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const resetForm = () => {
  formRef.value.resetFields()
  submittedData.value = null
}

const presetQuickMeeting = () => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // 设置为下一个半小时时间点
  let startHour = currentHour
  let startMinute = currentMinute < 30 ? 30 : 0
  if (startMinute === 0) {
    startHour += 1
  }
  
  const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`
  const endTime = `${String(startHour + 1).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`
  
  form.title = '快速会议'
  form.startTime = startTime
  form.endTime = endTime
  form.room = 'roomA'
  
  ElMessage.success('已设置快速会议时间')
}

const calculateDuration = (start, end) => {
  if (!start || !end) return '未知'
  
  const [startHours, startMinutes] = start.split(':').map(Number)
  const [endHours, endMinutes] = end.split(':').map(Number)
  
  const startTotalMinutes = startHours * 60 + startMinutes
  const endTotalMinutes = endHours * 60 + endMinutes
  const durationMinutes = endTotalMinutes - startTotalMinutes
  
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  } else {
    return `${minutes}分钟`
  }
}

const getRoomName = (roomValue) => {
  const roomMap = {
    roomA: '会议室A',
    roomB: '会议室B',
    roomC: '会议室C'
  }
  return roomMap[roomValue] || roomValue
}

const getRepeatText = (repeatValue) => {
  const repeatMap = {
    none: '不重复',
    daily: '每天',
    weekly: '每周',
    monthly: '每月'
  }
  return repeatMap[repeatValue] || repeatValue
}
</script>

<style scoped>
.submitted-data {
  margin-top: 20px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.meeting-info p {
  margin: 8px 0;
  color: #606266;
}

.meeting-info strong {
  color: #303133;
}
</style>
```

## 实际应用示例

### 预约系统

```vue
<template>
  <div class="appointment-system">
    <h3>医生预约系统</h3>
    
    <div class="appointment-form">
      <el-form :model="appointment" :rules="appointmentRules" ref="appointmentRef" label-width="100px">
        <el-form-item label="选择医生" prop="doctor">
          <el-select v-model="appointment.doctor" placeholder="请选择医生" @change="handleDoctorChange">
            <el-option
              v-for="doctor in doctors"
              :key="doctor.id"
              :label="doctor.name"
              :value="doctor.id"
            >
              <div class="doctor-option">
                <span class="doctor-name">{{ doctor.name }}</span>
                <span class="doctor-title">{{ doctor.title }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="预约日期" prop="date">
          <el-date-picker
            v-model="appointment.date"
            type="date"
            placeholder="选择预约日期"
            :disabled-date="disabledDate"
            @change="handleDateChange"
          />
        </el-form-item>
        
        <el-form-item label="预约时间" prop="time">
          <el-time-select
            v-model="appointment.time"
            :start="getAvailableStartTime()"
            :end="getAvailableEndTime()"
            step="00:30"
            placeholder="选择预约时间"
            :disabled="!appointment.doctor || !appointment.date"
            @change="handleTimeChange"
          />
        </el-form-item>
        
        <el-form-item label="患者姓名" prop="patientName">
          <el-input v-model="appointment.patientName" placeholder="请输入患者姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="appointment.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="症状描述" prop="symptoms">
          <el-input
            v-model="appointment.symptoms"
            type="textarea"
            :rows="3"
            placeholder="请简要描述症状"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitAppointment" :loading="submitting">确认预约</el-button>
          <el-button @click="resetAppointment">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div v-if="selectedDoctor" class="doctor-schedule">
      <h4>{{ selectedDoctor.name }} 的可预约时间</h4>
      <div class="schedule-info">
        <p><strong>科室：</strong>{{ selectedDoctor.department }}</p>
        <p><strong>职称：</strong>{{ selectedDoctor.title }}</p>
        <p><strong>出诊时间：</strong>{{ selectedDoctor.schedule }}</p>
        <p><strong>预约费用：</strong>{{ selectedDoctor.fee }}元</p>
      </div>
      
      <div class="available-times">
        <h5>今日可预约时间段：</h5>
        <div class="time-slots">
          <el-tag
            v-for="slot in availableTimeSlots"
            :key="slot"
            :type="appointment.time === slot ? 'success' : 'info'"
            class="time-slot"
            @click="selectTimeSlot(slot)"
          >
            {{ slot }}
          </el-tag>
        </div>
      </div>
    </div>
    
    <div v-if="appointmentResult" class="appointment-result">
      <h4>预约成功</h4>
      <div class="result-info">
        <p><strong>预约号：</strong>{{ appointmentResult.id }}</p>
        <p><strong>医生：</strong>{{ appointmentResult.doctorName }}</p>
        <p><strong>时间：</strong>{{ appointmentResult.date }} {{ appointmentResult.time }}</p>
        <p><strong>患者：</strong>{{ appointmentResult.patientName }}</p>
        <p><strong>联系电话：</strong>{{ appointmentResult.phone }}</p>
      </div>
      
      <div class="result-actions">
        <el-button type="primary" @click="printAppointment">打印预约单</el-button>
        <el-button @click="newAppointment">新建预约</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const appointmentRef = ref()
const submitting = ref(false)
const appointmentResult = ref(null)

const appointment = reactive({
  doctor: '',
  date: '',
  time: '',
  patientName: '',
  phone: '',
  symptoms: ''
})

const appointmentRules = {
  doctor: [{ required: true, message: '请选择医生', trigger: 'change' }],
  date: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
  time: [{ required: true, message: '请选择预约时间', trigger: 'change' }],
  patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

const doctors = [
  {
    id: 'doc1',
    name: '张医生',
    title: '主任医师',
    department: '内科',
    schedule: '周一至周五 9:00-17:00',
    fee: 50,
    workDays: [1, 2, 3, 4, 5], // 周一到周五
    workHours: { start: '09:00', end: '17:00' }
  },
  {
    id: 'doc2',
    name: '李医生',
    title: '副主任医师',
    department: '外科',
    schedule: '周二、周四、周六 8:30-16:30',
    fee: 40,
    workDays: [2, 4, 6], // 周二、周四、周六
    workHours: { start: '08:30', end: '16:30' }
  },
  {
    id: 'doc3',
    name: '王医生',
    title: '主治医师',
    department: '儿科',
    schedule: '周一至周日 8:00-18:00',
    fee: 30,
    workDays: [1, 2, 3, 4, 5, 6, 0], // 每天
    workHours: { start: '08:00', end: '18:00' }
  }
]

const selectedDoctor = computed(() => {
  return doctors.find(doc => doc.id === appointment.doctor)
})

const availableTimeSlots = computed(() => {
  if (!selectedDoctor.value || !appointment.date) return []
  
  const slots = []
  const start = selectedDoctor.value.workHours.start
  const end = selectedDoctor.value.workHours.end
  
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  
  let currentHour = startHour
  let currentMinute = startMinute
  
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
    slots.push(timeSlot)
    
    currentMinute += 30
    if (currentMinute >= 60) {
      currentMinute = 0
      currentHour += 1
    }
  }
  
  return slots
})

const disabledDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // 不能选择过去的日期
  if (date < today) return true
  
  // 如果选择了医生，检查医生的工作日
  if (selectedDoctor.value) {
    const dayOfWeek = date.getDay()
    return !selectedDoctor.value.workDays.includes(dayOfWeek)
  }
  
  return false
}

const handleDoctorChange = () => {
  appointment.date = ''
  appointment.time = ''
}

const handleDateChange = () => {
  appointment.time = ''
}

const handleTimeChange = (val) => {
  console.log('选择时间：', val)
}

const getAvailableStartTime = () => {
  return selectedDoctor.value?.workHours.start || '08:00'
}

const getAvailableEndTime = () => {
  return selectedDoctor.value?.workHours.end || '18:00'
}

const selectTimeSlot = (slot) => {
  appointment.time = slot
}

const submitAppointment = async () => {
  try {
    await appointmentRef.value.validate()
    submitting.value = true
    
    // 模拟提交预约
    setTimeout(() => {
      appointmentResult.value = {
        id: 'APT' + Date.now(),
        doctorName: selectedDoctor.value.name,
        date: appointment.date,
        time: appointment.time,
        patientName: appointment.patientName,
        phone: appointment.phone
      }
      
      submitting.value = false
      ElMessage.success('预约成功')
    }, 2000)
  } catch (error) {
    ElMessage.error('请检查表单内容')
  }
}

const resetAppointment = () => {
  appointmentRef.value.resetFields()
  appointmentResult.value = null
}

const printAppointment = () => {
  ElMessage.info('打印预约单功能')
}

const newAppointment = () => {
  resetAppointment()
}
</script>

<style scoped>
.appointment-system {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.doctor-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doctor-name {
  font-weight: 500;
}

.doctor-title {
  font-size: 12px;
  color: #909399;
}

.doctor-schedule {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.schedule-info p {
  margin: 8px 0;
  color: #606266;
}

.available-times {
  margin-top: 16px;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.time-slot {
  cursor: pointer;
  transition: all 0.2s;
}

.time-slot:hover {
  transform: translateY(-1px);
}

.appointment-result {
  margin-top: 20px;
  padding: 16px;
  background-color: #f0f9ff;
  border-radius: 6px;
  border-left: 4px solid #67c23a;
}

.result-info p {
  margin: 8px 0;
  color: #606266;
}

.result-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 绑定值 | string | — |
| disabled | 禁用状态 | boolean | false |
| editable | 文本框可输入 | boolean | true |
| clearable | 是否显示清除按钮 | boolean | true |
| size | 输入框尺寸 | string | — |
| placeholder | 占位符 | string | — |
| name | 原生属性 | string | — |
| effect | Tooltip 主题 | string | light |
| prefix-icon | 自定义前缀图标 | string \| Component | — |
| clear-icon | 自定义清空图标 | string \| Component | — |
| start | 开始时间 | string | 09:00 |
| end | 结束时间 | string | 18:00 |
| step | 间隔时间 | string | 00:30 |
| min-time | 最小时间，小于该时间的时间段将被禁用 | string | — |
| max-time | 最大时间，大于该时间的时间段将被禁用 | string | — |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| change | 用户确认选定的值时触发 | Function |
| blur | 当 input 失去焦点时触发 | Function |
| focus | 当 input 获得焦点时触发 | Function |

### Methods

| 方法名 | 说明 | 类型 |
|--------|------|------|
| focus | 使 input 获取焦点 | Function |
| blur | 使 input 失去焦点 | Function |

## 最佳实践

### 1. 时间范围设置

```vue
<script setup>
// 根据业务场景设置合理的时间范围
const getBusinessHours = () => {
  return {
    start: '09:00',
    end: '18:00',
    step: '00:30'
  }
}

// 动态调整时间范围
const adjustTimeRange = (type) => {
  const ranges = {
    morning: { start: '08:00', end: '12:00' },
    afternoon: { start: '14:00', end: '18:00' },
    evening: { start: '19:00', end: '22:00' }
  }
  return ranges[type]
}
</script>
```

### 2. 时间验证

```vue
<script setup>
// 验证时间格式
const validateTimeFormat = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

// 验证时间范围
const validateTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false
  return startTime < endTime
}

// 计算时间差
const calculateTimeDifference = (start, end) => {
  const [startHour, startMinute] = start.split(':').map(Number)
  const [endHour, endMinute] = end.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute
  
  return endMinutes - startMinutes
}
</script>
```

### 3. 用户体验优化

```vue
<template>
  <!-- 提供快捷选择 -->
  <div class="quick-select">
    <el-button-group>
      <el-button @click="setQuickTime('09:00')">上午9点</el-button>
      <el-button @click="setQuickTime('14:00')">下午2点</el-button>
      <el-button @click="setQuickTime('19:00')">晚上7点</el-button>
    </el-button-group>
  </div>
  
  <!-- 显示时间提示 -->
  <el-time-select
    v-model="time"
    start="08:00"
    end="22:00"
    step="00:30"
    placeholder="选择时间"
  />
  
  <!-- 时间预览 -->
  <div v-if="time" class="time-preview">
    <p>选择的时间：{{ formatTime(time) }}</p>
  </div>
</template>

<script setup>
const setQuickTime = (quickTime) => {
  time.value = quickTime
}

const formatTime = (time) => {
  const [hour, minute] = time.split(':')
  const hourNum = parseInt(hour)
  const period = hourNum < 12 ? '上午' : '下午'
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum
  return `${period} ${displayHour}:${minute}`
}
</script>
```

### 4. 响应式设计

```vue
<template>
  <div class="responsive-time-select">
    <el-time-select
      v-model="time"
      :class="{ 'mobile-time-select': isMobile }"
      start="08:00"
      end="22:00"
      step="00:30"
      placeholder="选择时间"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.mobile-time-select {
  width: 100%;
}

@media (max-width: 768px) {
  .responsive-time-select {
    width: 100%;
  }
}
</style>
```

## 常见问题

### 1. 时间选择器不显示选项

**问题**：时间选择器下拉列表为空

**解决方案**：
```vue
<script setup>
// 检查 start、end、step 属性设置
const timeConfig = {
  start: '08:00', // 确保格式正确
  end: '18:00',   // 结束时间必须大于开始时间
  step: '00:30'   // 步长格式必须正确
}

// 确保时间格式正确
const validateTimeConfig = (config) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(config.start) && 
         timeRegex.test(config.end) && 
         timeRegex.test(config.step)
}
</script>
```

### 2. 动态时间范围设置

**问题**：需要根据条件动态设置时间范围

**解决方案**：
```vue
<template>
  <el-time-select
    v-model="time"
    :start="dynamicStart"
    :end="dynamicEnd"
    :step="dynamicStep"
  />
</template>

<script setup>
import { computed } from 'vue'

const selectedType = ref('business')

const dynamicStart = computed(() => {
  const configs = {
    business: '09:00',
    extended: '08:00',
    night: '18:00'
  }
  return configs[selectedType.value] || '09:00'
})

const dynamicEnd = computed(() => {
  const configs = {
    business: '18:00',
    extended: '22:00',
    night: '23:59'
  }
  return configs[selectedType.value] || '18:00'
})
</script>
```

### 3. 时间格式转换

**问题**：需要在不同时间格式间转换

**解决方案**：
```vue
<script setup>
// 12小时制转24小时制
const convertTo24Hour = (time12h) => {
  const [time, period] = time12h.split(' ')
  let [hours, minutes] = time.split(':')
  
  if (period === 'PM' && hours !== '12') {
    hours = parseInt(hours) + 12
  } else if (period === 'AM' && hours === '12') {
    hours = '00'
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`
}

// 24小时制转12小时制
const convertTo12Hour = (time24h) => {
  let [hours, minutes] = time24h.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  
  return `${displayHour}:${minutes} ${period}`
}
</script>
```

### 4. 时间冲突检测

**问题**：需要检测时间段是否冲突

**解决方案**：
```vue
<script setup>
// 检测时间段冲突
const checkTimeConflict = (newStart, newEnd, existingTimes) => {
  const newStartMinutes = timeToMinutes(newStart)
  const newEndMinutes = timeToMinutes(newEnd)
  
  return existingTimes.some(existing => {
    const existingStartMinutes = timeToMinutes(existing.start)
    const existingEndMinutes = timeToMinutes(existing.end)
    
    return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes)
  })
}

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// 获取可用时间段
const getAvailableTimeSlots = (allSlots, bookedSlots) => {
  return allSlots.filter(slot => {
    return !bookedSlots.some(booked => booked === slot)
  })
}
</script>
```

## 总结

Time Select 时间选择组件是一个实用的时间输入组件，主要特点包括：

- **灵活的时间配置**：支持自定义时间范围和步长
- **简单易用**：提供直观的时间选择界面
- **验证支持**：内置时间格式验证
- **表单集成**：与表单组件无缝集成
- **响应式设计**：适配不同屏幕尺寸

### 适用场景
- 预约和预订系统
- 会议和日程安排
- 工作时间设置
- 定时任务配置
- 营业时间管理

### 设计原则
- 提供清晰的时间选择界面
- 支持灵活的时间范围配置
- 确保时间数据的准确性
- 考虑用户操作习惯
- 提供良好的错误提示

## 参考资料

- [Element Plus Time Select 官方文档](https://element-plus.org/zh-CN/component/time-select.html)
- [MDN - Date and Time](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [HTML5 Time Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Element Plus Form 组件](https://element-plus.org/zh-CN/component/form.html)