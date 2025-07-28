# 第62天：Element Plus Day.js 时间本地化配置

## 学习目标

* 掌握 Day.js 在 Element Plus 中的应用
* 学习时间本地化的配置方法
* 理解不同地区的时间格式差异
* 实现动态时间本地化切换

## 知识点概览

### 1. Day.js 基础概念

#### 1.1 Day.js 简介

* **轻量级**：仅 2KB 的现代化日期库
* **API 兼容**：与 Moment.js 类似的 API
* **插件系统**：模块化设计，按需加载
* **国际化支持**：内置多语言支持

#### 1.2 Day.js 核心配置

```typescript
// dayjs/config.ts
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localeData from 'dayjs/plugin/localeData'

// 导入语言包
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import 'dayjs/locale/ar'
import 'dayjs/locale/ja'
import 'dayjs/locale/ko'
import 'dayjs/locale/fr'
import 'dayjs/locale/de'
import 'dayjs/locale/es'
import 'dayjs/locale/ru'

// 注册插件
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(advancedFormat)
dayjs.extend(localeData)

// Day.js 配置管理器
export class DayjsConfigManager {
  private static instance: DayjsConfigManager
  private currentLocale: string = 'en'
  private currentTimezone: string = 'UTC'
  
  private constructor() {}
  
  static getInstance(): DayjsConfigManager {
    if (!DayjsConfigManager.instance) {
      DayjsConfigManager.instance = new DayjsConfigManager()
    }
    return DayjsConfigManager.instance
  }
  
  // 设置语言
  setLocale(locale: string): void {
    this.currentLocale = locale
    dayjs.locale(locale)
  }
  
  // 获取当前语言
  getLocale(): string {
    return this.currentLocale
  }
  
  // 设置时区
  setTimezone(timezone: string): void {
    this.currentTimezone = timezone
  }
  
  // 获取当前时区
  getTimezone(): string {
    return this.currentTimezone
  }
  
  // 获取支持的语言列表
  getSupportedLocales(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh-cn', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' }
    ]
  }
  
  // 格式化日期
  format(date: dayjs.ConfigType, format?: string): string {
    const dayjsInstance = dayjs(date)
    if (this.currentTimezone !== 'UTC') {
      return dayjsInstance.tz(this.currentTimezone).format(format)
    }
    return dayjsInstance.format(format)
  }
  
  // 获取相对时间
  fromNow(date: dayjs.ConfigType): string {
    return dayjs(date).fromNow()
  }
  
  // 获取本地化数据
  getLocaleData() {
    return dayjs.localeData()
  }
}

export default DayjsConfigManager.getInstance()
```

### 2. Element Plus 时间组件本地化

#### 2.1 DatePicker 本地化配置

```vue
<!-- LocalizedDatePicker.vue -->
<template>
  <div class="localized-date-picker">
    <div class="locale-selector">
      <el-select v-model="currentLocale" @change="handleLocaleChange">
        <el-option
          v-for="locale in supportedLocales"
          :key="locale.code"
          :label="locale.nativeName"
          :value="locale.code"
        />
      </el-select>
    </div>
    
    <div class="date-picker-container">
      <el-date-picker
        v-model="selectedDate"
        type="date"
        :placeholder="$t('datePicker.selectDate')"
        :format="dateFormat"
        :value-format="valueFormat"
        @change="handleDateChange"
      />
      
      <el-date-picker
        v-model="selectedDateTime"
        type="datetime"
        :placeholder="$t('datePicker.selectDateTime')"
        :format="dateTimeFormat"
        :value-format="valueFormat"
        @change="handleDateTimeChange"
      />
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        :range-separator="$t('datePicker.to')"
        :start-placeholder="$t('datePicker.startDate')"
        :end-placeholder="$t('datePicker.endDate')"
        :format="dateFormat"
        :value-format="valueFormat"
        @change="handleRangeChange"
      />
    </div>
    
    <div class="time-display">
      <h3>{{ $t('timeDisplay.title') }}</h3>
      <div class="time-info">
        <p><strong>{{ $t('timeDisplay.selected') }}:</strong> {{ formattedSelectedDate }}</p>
        <p><strong>{{ $t('timeDisplay.now') }}:</strong> {{ formattedNow }}</p>
        <p><strong>{{ $t('timeDisplay.relative') }}:</strong> {{ relativeTime }}</p>
        <p><strong>{{ $t('timeDisplay.weekday') }}:</strong> {{ weekdayName }}</p>
        <p><strong>{{ $t('timeDisplay.month') }}:</strong> {{ monthName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import DayjsConfigManager from '@/utils/dayjs-config'

const { t, locale } = useI18n()
const dayjsConfig = DayjsConfigManager

// 响应式数据
const currentLocale = ref('en')
const selectedDate = ref('')
const selectedDateTime = ref('')
const dateRange = ref<[string, string]>(['', ''])
const now = ref(dayjs())

// 支持的语言
const supportedLocales = computed(() => dayjsConfig.getSupportedLocales())

// 日期格式配置
const dateFormats = {
  'en': 'MM/DD/YYYY',
  'zh-cn': 'YYYY年MM月DD日',
  'ar': 'DD/MM/YYYY',
  'ja': 'YYYY年MM月DD日',
  'ko': 'YYYY년 MM월 DD일',
  'fr': 'DD/MM/YYYY',
  'de': 'DD.MM.YYYY',
  'es': 'DD/MM/YYYY',
  'ru': 'DD.MM.YYYY'
}

const dateTimeFormats = {
  'en': 'MM/DD/YYYY HH:mm:ss',
  'zh-cn': 'YYYY年MM月DD日 HH:mm:ss',
  'ar': 'DD/MM/YYYY HH:mm:ss',
  'ja': 'YYYY年MM月DD日 HH:mm:ss',
  'ko': 'YYYY년 MM월 DD일 HH:mm:ss',
  'fr': 'DD/MM/YYYY HH:mm:ss',
  'de': 'DD.MM.YYYY HH:mm:ss',
  'es': 'DD/MM/YYYY HH:mm:ss',
  'ru': 'DD.MM.YYYY HH:mm:ss'
}

// 计算属性
const dateFormat = computed(() => dateFormats[currentLocale.value] || dateFormats['en'])
const dateTimeFormat = computed(() => dateTimeFormats[currentLocale.value] || dateTimeFormats['en'])
const valueFormat = computed(() => 'YYYY-MM-DD')

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '-'
  return dayjsConfig.format(selectedDate.value, dateFormat.value)
})

const formattedNow = computed(() => {
  return dayjsConfig.format(now.value, dateTimeFormat.value)
})

const relativeTime = computed(() => {
  if (!selectedDate.value) return '-'
  return dayjsConfig.fromNow(selectedDate.value)
})

const weekdayName = computed(() => {
  if (!selectedDate.value) return '-'
  return dayjs(selectedDate.value).format('dddd')
})

const monthName = computed(() => {
  if (!selectedDate.value) return '-'
  return dayjs(selectedDate.value).format('MMMM')
})

// 方法
const handleLocaleChange = (newLocale: string) => {
  dayjsConfig.setLocale(newLocale)
  locale.value = newLocale
  // 更新当前时间以反映语言变化
  now.value = dayjs()
}

const handleDateChange = (value: string) => {
  console.log('Date changed:', value)
}

const handleDateTimeChange = (value: string) => {
  console.log('DateTime changed:', value)
}

const handleRangeChange = (value: [string, string]) => {
  console.log('Range changed:', value)
}

// 定时更新当前时间
let timer: NodeJS.Timeout

onMounted(() => {
  // 初始化语言
  dayjsConfig.setLocale(currentLocale.value)
  
  // 每秒更新时间
  timer = setInterval(() => {
    now.value = dayjs()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 监听语言变化
watch(currentLocale, (newLocale) => {
  handleLocaleChange(newLocale)
})
</script>

<style scoped>
.localized-date-picker {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.locale-selector {
  margin-bottom: 20px;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.time-display {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.time-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.time-info p {
  margin: 5px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .time-info {
    grid-template-columns: 1fr;
  }
  
  .date-picker-container {
    gap: 10px;
  }
}
</style>
```

#### 2.2 时区处理组件

```vue
<!-- TimezoneHandler.vue -->
<template>
  <div class="timezone-handler">
    <div class="timezone-selector">
      <el-select v-model="currentTimezone" @change="handleTimezoneChange">
        <el-option
          v-for="timezone in supportedTimezones"
          :key="timezone.value"
          :label="timezone.label"
          :value="timezone.value"
        />
      </el-select>
    </div>
    
    <div class="time-zones-display">
      <div 
        v-for="zone in displayTimezones" 
        :key="zone.timezone"
        class="timezone-card"
      >
        <h4>{{ zone.name }}</h4>
        <div class="time-info">
          <p class="current-time">{{ zone.currentTime }}</p>
          <p class="timezone-offset">{{ zone.offset }}</p>
          <p class="timezone-abbr">{{ zone.abbreviation }}</p>
        </div>
      </div>
    </div>
    
    <div class="meeting-scheduler">
      <h3>{{ $t('meetingScheduler.title') }}</h3>
      <el-form :model="meetingForm" label-width="120px">
        <el-form-item :label="$t('meetingScheduler.dateTime')">
          <el-date-picker
            v-model="meetingForm.dateTime"
            type="datetime"
            :placeholder="$t('meetingScheduler.selectDateTime')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        
        <el-form-item :label="$t('meetingScheduler.timezone')">
          <el-select v-model="meetingForm.timezone">
            <el-option
              v-for="timezone in supportedTimezones"
              :key="timezone.value"
              :label="timezone.label"
              :value="timezone.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      
      <div v-if="meetingForm.dateTime" class="meeting-times">
        <h4>{{ $t('meetingScheduler.convertedTimes') }}</h4>
        <div 
          v-for="conversion in convertedMeetingTimes"
          :key="conversion.timezone"
          class="converted-time"
        >
          <span class="timezone-name">{{ conversion.name }}:</span>
          <span class="converted-datetime">{{ conversion.dateTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import DayjsConfigManager from '@/utils/dayjs-config'

interface TimezoneInfo {
  timezone: string
  name: string
  currentTime: string
  offset: string
  abbreviation: string
}

interface MeetingForm {
  dateTime: string
  timezone: string
}

const { t } = useI18n()
const dayjsConfig = DayjsConfigManager

// 响应式数据
const currentTimezone = ref('UTC')
const meetingForm = ref<MeetingForm>({
  dateTime: '',
  timezone: 'UTC'
})

// 支持的时区
const supportedTimezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' }
]

// 显示的时区
const displayTimezones = computed((): TimezoneInfo[] => {
  const zones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Shanghai']
  
  return zones.map(timezone => {
    const now = dayjs().tz(timezone)
    return {
      timezone,
      name: supportedTimezones.find(tz => tz.value === timezone)?.label.split(' ')[0] || timezone,
      currentTime: now.format('YYYY-MM-DD HH:mm:ss'),
      offset: now.format('Z'),
      abbreviation: now.format('z')
    }
  })
})

// 转换后的会议时间
const convertedMeetingTimes = computed(() => {
  if (!meetingForm.value.dateTime) return []
  
  const baseMeeting = dayjs.tz(meetingForm.value.dateTime, meetingForm.value.timezone)
  
  return supportedTimezones.map(timezone => {
    const convertedTime = baseMeeting.tz(timezone.value)
    return {
      timezone: timezone.value,
      name: timezone.label.split(' ')[0],
      dateTime: convertedTime.format('YYYY-MM-DD HH:mm:ss')
    }
  })
})

// 方法
const handleTimezoneChange = (timezone: string) => {
  dayjsConfig.setTimezone(timezone)
}

// 定时更新
let timer: NodeJS.Timeout

onMounted(() => {
  // 每分钟更新时间显示
  timer = setInterval(() => {
    // 触发重新计算
    currentTimezone.value = currentTimezone.value
  }, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.timezone-handler {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.timezone-selector {
  margin-bottom: 20px;
}

.time-zones-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.timezone-card {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.timezone-card h4 {
  margin: 0 0 10px 0;
  color: #409eff;
}

.current-time {
  font-size: 16px;
  font-weight: bold;
  margin: 5px 0;
}

.timezone-offset,
.timezone-abbr {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
}

.meeting-scheduler {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.meeting-times {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.converted-time {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.converted-time:last-child {
  border-bottom: none;
}

.timezone-name {
  font-weight: bold;
  color: #333;
}

.converted-datetime {
  color: #666;
}
</style>
```

### 3. 自定义时间格式化工具

```typescript
// utils/time-formatter.ts
import dayjs from 'dayjs'
import DayjsConfigManager from './dayjs-config'

export interface TimeFormatOptions {
  locale?: string
  timezone?: string
  format?: string
  relative?: boolean
}

export class TimeFormatter {
  private dayjsConfig = DayjsConfigManager
  
  // 格式化日期时间
  format(date: dayjs.ConfigType, options: TimeFormatOptions = {}): string {
    const {
      locale = this.dayjsConfig.getLocale(),
      timezone = this.dayjsConfig.getTimezone(),
      format = 'YYYY-MM-DD HH:mm:ss',
      relative = false
    } = options
    
    let dayjsInstance = dayjs(date)
    
    // 设置语言
    if (locale !== this.dayjsConfig.getLocale()) {
      dayjsInstance = dayjsInstance.locale(locale)
    }
    
    // 设置时区
    if (timezone !== 'UTC') {
      dayjsInstance = dayjsInstance.tz(timezone)
    }
    
    // 返回相对时间或格式化时间
    return relative ? dayjsInstance.fromNow() : dayjsInstance.format(format)
  }
  
  // 获取本地化的日期格式
  getLocalizedFormat(type: 'date' | 'datetime' | 'time', locale?: string): string {
    const currentLocale = locale || this.dayjsConfig.getLocale()
    
    const formats = {
      'en': {
        date: 'MM/DD/YYYY',
        datetime: 'MM/DD/YYYY HH:mm:ss',
        time: 'HH:mm:ss'
      },
      'zh-cn': {
        date: 'YYYY年MM月DD日',
        datetime: 'YYYY年MM月DD日 HH:mm:ss',
        time: 'HH:mm:ss'
      },
      'ar': {
        date: 'DD/MM/YYYY',
        datetime: 'DD/MM/YYYY HH:mm:ss',
        time: 'HH:mm:ss'
      }
    }
    
    return formats[currentLocale]?.[type] || formats['en'][type]
  }
  
  // 解析多种格式的日期
  parse(dateString: string, format?: string): dayjs.Dayjs | null {
    try {
      if (format) {
        return dayjs(dateString, format)
      }
      return dayjs(dateString)
    } catch (error) {
      console.error('Date parsing error:', error)
      return null
    }
  }
  
  // 获取时间范围描述
  getTimeRangeDescription(start: dayjs.ConfigType, end: dayjs.ConfigType, locale?: string): string {
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const currentLocale = locale || this.dayjsConfig.getLocale()
    
    const duration = endDate.diff(startDate)
    const days = Math.floor(duration / (1000 * 60 * 60 * 24))
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    
    // 根据语言返回不同的描述
    switch (currentLocale) {
      case 'zh-cn':
        return `${days}天 ${hours}小时 ${minutes}分钟`
      case 'ar':
        return `${days} أيام ${hours} ساعات ${minutes} دقائق`
      default:
        return `${days} days ${hours} hours ${minutes} minutes`
    }
  }
  
  // 获取工作日信息
  getWorkdayInfo(date: dayjs.ConfigType, locale?: string) {
    const dateObj = dayjs(date)
    const currentLocale = locale || this.dayjsConfig.getLocale()
    
    return {
      isWeekend: dateObj.day() === 0 || dateObj.day() === 6,
      weekdayName: dateObj.locale(currentLocale).format('dddd'),
      weekNumber: dateObj.week(),
      quarter: dateObj.quarter(),
      dayOfYear: dateObj.dayOfYear()
    }
  }
}

export default new TimeFormatter()
```

## 实践练习

### 练习 1：创建多语言日历组件

开发一个支持多语言的日历组件：
1. 月份和星期的本地化显示
2. 不同地区的周开始日配置
3. 节假日标记功能

### 练习 2：实现时区转换工具

构建一个时区转换工具：
1. 实时显示多个时区时间
2. 会议时间安排助手
3. 时差计算功能

### 练习 3：开发本地化时间选择器

设计一个智能时间选择器：
1. 根据用户地区自动调整格式
2. 支持多种时间输入方式
3. 智能时间建议功能

## 学习资源

* [Day.js 官方文档](https://day.js.org/)
* [Day.js 国际化指南](https://day.js.org/docs/en/i18n/i18n)
* [Element Plus DatePicker](https://element-plus.org/zh-CN/component/date-picker.html)
* [时区数据库](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## 作业

1. 完成所有实践练习
2. 创建一个支持多时区的项目管理系统
3. 实现自动检测用户时区的功能
4. 编写时间本地化的单元测试

## 下一步学习计划

接下来我们将学习 **Element Plus 无障碍设计实践与 ARIA 属性应用**，深入了解如何让 Element Plus 应用更好地支持残障用户的使用需求。