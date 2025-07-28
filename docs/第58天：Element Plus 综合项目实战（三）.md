# 第58天：Element Plus 综合项目实战（三）

## 学习目标

继续我们的智能企业管理平台开发，今天重点实现数据可视化模块、系统监控功能和性能优化实践。

- 集成 ECharts 实现数据可视化
- 开发系统监控和日志管理
- 实现性能监控和优化
- 构建实时数据更新机制
- 添加错误处理和用户反馈

## 1. 数据可视化模块

### 1.1 仪表盘页面

```vue
<!-- src/views/dashboard/index.vue -->
<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="24" :sm="12" :lg="6" v-for="card in statsCards" :key="card.key">
        <div class="stats-card" :class="card.type">
          <div class="stats-card-content">
            <div class="stats-card-icon">
              <el-icon :size="40">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stats-card-info">
              <div class="stats-card-title">{{ card.title }}</div>
              <div class="stats-card-value">
                <CountUp :end-val="card.value" :duration="2" />
              </div>
              <div class="stats-card-trend" :class="card.trend.type">
                <el-icon><component :is="card.trend.icon" /></el-icon>
                <span>{{ card.trend.value }}%</span>
                <span class="trend-text">{{ card.trend.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-section">
      <!-- 用户增长趋势 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-button-group size="small">
                <el-button 
                  v-for="period in timePeriods" 
                  :key="period.value"
                  :type="selectedPeriod === period.value ? 'primary' : 'default'"
                  @click="changePeriod(period.value)"
                >
                  {{ period.label }}
                </el-button>
              </el-button-group>
            </div>
          </template>
          <UserGrowthChart 
            :data="userGrowthData" 
            :loading="chartsLoading.userGrowth"
            height="300px"
          />
        </el-card>
      </el-col>
      
      <!-- 访问量统计 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>访问量统计</span>
              <el-tooltip content="实时数据，每5秒更新一次" placement="top">
                <el-icon class="info-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <VisitChart 
            :data="visitData" 
            :loading="chartsLoading.visit"
            height="300px"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="charts-section">
      <!-- 销售数据 -->
      <el-col :xs="24" :lg="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售数据分析</span>
              <el-select 
                v-model="selectedRegion" 
                size="small" 
                style="width: 120px"
                @change="updateSalesData"
              >
                <el-option label="全国" value="all" />
                <el-option label="华北" value="north" />
                <el-option label="华南" value="south" />
                <el-option label="华东" value="east" />
                <el-option label="华西" value="west" />
              </el-select>
            </div>
          </template>
          <SalesChart 
            :data="salesData" 
            :loading="chartsLoading.sales"
            height="400px"
          />
        </el-card>
      </el-col>
      
      <!-- 用户分布 -->
      <el-col :xs="24" :lg="8">
        <el-card class="chart-card">
          <template #header>
            <span>用户分布</span>
          </template>
          <UserDistributionChart 
            :data="userDistributionData" 
            :loading="chartsLoading.userDistribution"
            height="400px"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 实时活动 -->
    <el-row :gutter="20" class="activity-section">
      <el-col :xs="24" :lg="16">
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>实时活动</span>
              <el-badge :value="unreadCount" class="badge">
                <el-button size="small" @click="markAllRead">全部已读</el-button>
              </el-badge>
            </div>
          </template>
          <ActivityTimeline :activities="activities" :loading="activitiesLoading" />
        </el-card>
      </el-col>
      
      <!-- 快捷操作 -->
      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions-card">
          <template #header>
            <span>快捷操作</span>
          </template>
          <QuickActions :actions="quickActions" @action="handleQuickAction" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  User, 
  TrendCharts, 
  Monitor, 
  InfoFilled,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import CountUp from '@/components/CountUp/index.vue'
import UserGrowthChart from './components/UserGrowthChart.vue'
import VisitChart from './components/VisitChart.vue'
import SalesChart from './components/SalesChart.vue'
import UserDistributionChart from './components/UserDistributionChart.vue'
import ActivityTimeline from './components/ActivityTimeline.vue'
import QuickActions from './components/QuickActions.vue'
import { 
  getDashboardStats, 
  getUserGrowthData, 
  getVisitData, 
  getSalesData, 
  getUserDistributionData,
  getRealtimeActivities
} from '@/api/dashboard'
import type { 
  DashboardStats, 
  UserGrowthData, 
  VisitData, 
  SalesData, 
  UserDistributionData,
  Activity,
  QuickAction
} from '@/types/dashboard'

// 响应式数据
const statsCards = ref<DashboardStats[]>([])
const userGrowthData = ref<UserGrowthData[]>([])
const visitData = ref<VisitData[]>([])
const salesData = ref<SalesData[]>([])
const userDistributionData = ref<UserDistributionData[]>([])
const activities = ref<Activity[]>([])
const unreadCount = ref(0)

// 加载状态
const chartsLoading = reactive({
  userGrowth: false,
  visit: false,
  sales: false,
  userDistribution: false
})
const activitiesLoading = ref(false)

// 控制参数
const selectedPeriod = ref('7d')
const selectedRegion = ref('all')

// 时间周期选项
const timePeriods = [
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '90天', value: '90d' },
  { label: '1年', value: '1y' }
]

// 快捷操作
const quickActions: QuickAction[] = [
  {
    title: '添加用户',
    icon: 'User',
    color: '#409eff',
    action: 'create-user'
  },
  {
    title: '系统设置',
    icon: 'Setting',
    color: '#67c23a',
    action: 'system-settings'
  },
  {
    title: '数据导出',
    icon: 'Download',
    color: '#e6a23c',
    action: 'export-data'
  },
  {
    title: '系统监控',
    icon: 'Monitor',
    color: '#f56c6c',
    action: 'system-monitor'
  }
]

// 定时器
let realtimeTimer: NodeJS.Timeout | null = null

// 生命周期
onMounted(() => {
  initDashboard()
  startRealtimeUpdate()
})

onUnmounted(() => {
  stopRealtimeUpdate()
})

// 初始化仪表盘
async function initDashboard() {
  await Promise.all([
    loadStatsCards(),
    loadUserGrowthData(),
    loadVisitData(),
    loadSalesData(),
    loadUserDistributionData(),
    loadActivities()
  ])
}

// 加载统计卡片数据
async function loadStatsCards() {
  try {
    const response = await getDashboardStats()
    statsCards.value = response.data.map((item: any) => ({
      ...item,
      icon: getIconComponent(item.iconName),
      trend: {
        ...item.trend,
        icon: item.trend.type === 'up' ? ArrowUp : ArrowDown
      }
    }))
  } catch (error) {
    console.error('Load stats cards failed:', error)
    ElMessage.error('加载统计数据失败')
  }
}

// 加载用户增长数据
async function loadUserGrowthData() {
  chartsLoading.userGrowth = true
  try {
    const response = await getUserGrowthData({ period: selectedPeriod.value })
    userGrowthData.value = response.data
  } catch (error) {
    console.error('Load user growth data failed:', error)
    ElMessage.error('加载用户增长数据失败')
  } finally {
    chartsLoading.userGrowth = false
  }
}

// 加载访问数据
async function loadVisitData() {
  chartsLoading.visit = true
  try {
    const response = await getVisitData()
    visitData.value = response.data
  } catch (error) {
    console.error('Load visit data failed:', error)
    ElMessage.error('加载访问数据失败')
  } finally {
    chartsLoading.visit = false
  }
}

// 加载销售数据
async function loadSalesData() {
  chartsLoading.sales = true
  try {
    const response = await getSalesData({ region: selectedRegion.value })
    salesData.value = response.data
  } catch (error) {
    console.error('Load sales data failed:', error)
    ElMessage.error('加载销售数据失败')
  } finally {
    chartsLoading.sales = false
  }
}

// 加载用户分布数据
async function loadUserDistributionData() {
  chartsLoading.userDistribution = true
  try {
    const response = await getUserDistributionData()
    userDistributionData.value = response.data
  } catch (error) {
    console.error('Load user distribution data failed:', error)
    ElMessage.error('加载用户分布数据失败')
  } finally {
    chartsLoading.userDistribution = false
  }
}

// 加载活动数据
async function loadActivities() {
  activitiesLoading.value = true
  try {
    const response = await getRealtimeActivities()
    activities.value = response.data.items
    unreadCount.value = response.data.unreadCount
  } catch (error) {
    console.error('Load activities failed:', error)
    ElMessage.error('加载活动数据失败')
  } finally {
    activitiesLoading.value = false
  }
}

// 切换时间周期
function changePeriod(period: string) {
  selectedPeriod.value = period
  loadUserGrowthData()
}

// 更新销售数据
function updateSalesData() {
  loadSalesData()
}

// 标记全部已读
function markAllRead() {
  unreadCount.value = 0
  activities.value.forEach(activity => {
    activity.read = true
  })
  ElMessage.success('已标记全部为已读')
}

// 处理快捷操作
function handleQuickAction(action: string) {
  switch (action) {
    case 'create-user':
      // 跳转到用户创建页面
      break
    case 'system-settings':
      // 跳转到系统设置页面
      break
    case 'export-data':
      // 执行数据导出
      break
    case 'system-monitor':
      // 跳转到系统监控页面
      break
    default:
      ElMessage.info(`执行操作: ${action}`)
  }
}

// 开始实时更新
function startRealtimeUpdate() {
  realtimeTimer = setInterval(() => {
    loadVisitData()
    loadActivities()
  }, 5000) // 每5秒更新一次
}

// 停止实时更新
function stopRealtimeUpdate() {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
    realtimeTimer = null
  }
}

// 获取图标组件
function getIconComponent(iconName: string) {
  const iconMap: Record<string, any> = {
    User,
    TrendCharts,
    Monitor
  }
  return iconMap[iconName] || User
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 84px);
}

.stats-cards {
  margin-bottom: 20px;
}

.stats-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  }
  
  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.success {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
  
  &.warning {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }
  
  &.danger {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
  }
}

.stats-card-content {
  display: flex;
  align-items: center;
}

.stats-card-icon {
  margin-right: 20px;
  opacity: 0.8;
}

.stats-card-info {
  flex: 1;
}

.stats-card-title {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.stats-card-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stats-card-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  
  &.up {
    color: #67c23a;
  }
  
  &.down {
    color: #f56c6c;
  }
  
  .el-icon {
    margin-right: 4px;
  }
  
  .trend-text {
    margin-left: 4px;
    opacity: 0.8;
  }
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  height: 100%;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .info-icon {
      color: #909399;
      cursor: help;
    }
  }
}

.activity-section {
  margin-bottom: 20px;
}

.activity-card {
  .badge {
    .el-button {
      border: none;
      background: transparent;
      color: #409eff;
    }
  }
}

.quick-actions-card {
  height: 100%;
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .stats-card {
    margin-bottom: 10px;
  }
  
  .stats-card-content {
    flex-direction: column;
    text-align: center;
  }
  
  .stats-card-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
```

### 1.2 用户增长图表组件

```vue
<!-- src/views/dashboard/components/UserGrowthChart.vue -->
<template>
  <div class="chart-container">
    <div 
      ref="chartRef" 
      :style="{ height: height }"
      v-loading="loading"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useResizeObserver } from '@vueuse/core'
import type { UserGrowthData } from '@/types/dashboard'

// Props
interface Props {
  data: UserGrowthData[]
  loading?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: '300px'
})

// 响应式数据
const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据变化
watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听加载状态
watch(
  () => props.loading,
  (loading) => {
    if (chartInstance) {
      if (loading) {
        chartInstance.showLoading()
      } else {
        chartInstance.hideLoading()
      }
    }
  }
)

// 响应式调整
useResizeObserver(chartRef, () => {
  if (chartInstance) {
    chartInstance.resize()
  }
})

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param: any) => {
          result += `${param.marker}${param.seriesName}: ${param.value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['新增用户', '活跃用户', '累计用户'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.3
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '活跃用户',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.3
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '累计用户',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        emphasis: {
          focus: 'series'
        },
        data: []
      }
    ]
  }
  
  chartInstance.setOption(option)
  updateChart()
}

// 更新图表数据
function updateChart() {
  if (!chartInstance || !props.data.length) return
  
  const dates = props.data.map(item => item.date)
  const newUsers = props.data.map(item => item.newUsers)
  const activeUsers = props.data.map(item => item.activeUsers)
  const totalUsers = props.data.map(item => item.totalUsers)
  
  chartInstance.setOption({
    xAxis: {
      data: dates
    },
    series: [
      {
        data: newUsers
      },
      {
        data: activeUsers
      },
      {
        data: totalUsers
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
```

### 1.3 销售数据图表组件

```vue
<!-- src/views/dashboard/components/SalesChart.vue -->
<template>
  <div class="chart-container">
    <div 
      ref="chartRef" 
      :style="{ height: height }"
      v-loading="loading"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import { useResizeObserver } from '@vueuse/core'
import type { SalesData } from '@/types/dashboard'

// Props
interface Props {
  data: SalesData[]
  loading?: boolean
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  height: '400px'
})

// 响应式数据
const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据变化
watch(
  () => props.data,
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听加载状态
watch(
  () => props.loading,
  (loading) => {
    if (chartInstance) {
      if (loading) {
        chartInstance.showLoading()
      } else {
        chartInstance.hideLoading()
      }
    }
  }
)

// 响应式调整
useResizeObserver(chartRef, () => {
  if (chartInstance) {
    chartInstance.resize()
  }
})

// 初始化图表
function initChart() {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param: any) => {
          const value = typeof param.value === 'number' 
            ? param.value.toLocaleString() 
            : param.value
          result += `${param.marker}${param.seriesName}: ¥${value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['销售额', '利润', '成本'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          if (value >= 10000) {
            return (value / 10000) + 'w'
          }
          return value.toString()
        }
      }
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        },
        data: []
      },
      {
        name: '利润',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#67c23a' },
            { offset: 0.5, color: '#5daf34' },
            { offset: 1, color: '#5daf34' }
          ])
        },
        data: []
      },
      {
        name: '成本',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#f56c6c'
        },
        itemStyle: {
          color: '#f56c6c'
        },
        data: []
      }
    ]
  }
  
  chartInstance.setOption(option)
  updateChart()
}

// 更新图表数据
function updateChart() {
  if (!chartInstance || !props.data.length) return
  
  const months = props.data.map(item => item.month)
  const sales = props.data.map(item => item.sales)
  const profit = props.data.map(item => item.profit)
  const cost = props.data.map(item => item.cost)
  
  chartInstance.setOption({
    xAxis: {
      data: months
    },
    series: [
      {
        data: sales
      },
      {
        data: profit
      },
      {
        data: cost
      }
    ]
  })
}
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
```

## 2. 系统监控模块

### 2.1 系统监控页面

```vue
<!-- src/views/system/monitor.vue -->
<template>
  <div class="monitor-container">
    <!-- 系统状态概览 -->
    <el-row :gutter="20" class="status-overview">
      <el-col :xs="24" :sm="12" :lg="6" v-for="metric in systemMetrics" :key="metric.key">
        <el-card class="metric-card" :class="getMetricStatus(metric.value, metric.threshold)">
          <div class="metric-content">
            <div class="metric-icon">
              <el-icon :size="32">
                <component :is="metric.icon" />
              </el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-title">{{ metric.title }}</div>
              <div class="metric-value">
                {{ formatMetricValue(metric.value, metric.unit) }}
              </div>
              <div class="metric-status">
                <el-tag :type="getMetricTagType(metric.value, metric.threshold)" size="small">
                  {{ getMetricStatusText(metric.value, metric.threshold) }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 实时监控图表 -->
    <el-row :gutter="20" class="monitor-charts">
      <!-- CPU 使用率 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>CPU 使用率</span>
              <el-switch 
                v-model="autoRefresh" 
                active-text="自动刷新" 
                @change="toggleAutoRefresh"
              />
            </div>
          </template>
          <RealtimeChart 
            :data="cpuData" 
            :loading="chartsLoading.cpu"
            type="line"
            color="#409eff"
            unit="%"
            height="250px"
          />
        </el-card>
      </el-col>
      
      <!-- 内存使用率 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <span>内存使用率</span>
          </template>
          <RealtimeChart 
            :data="memoryData" 
            :loading="chartsLoading.memory"
            type="area"
            color="#67c23a"
            unit="%"
            height="250px"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="monitor-charts">
      <!-- 网络流量 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <span>网络流量</span>
          </template>
          <NetworkChart 
            :data="networkData" 
            :loading="chartsLoading.network"
            height="250px"
          />
        </el-card>
      </el-col>
      
      <!-- 磁盘使用情况 -->
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <span>磁盘使用情况</span>
          </template>
          <DiskChart 
            :data="diskData" 
            :loading="chartsLoading.disk"
            height="250px"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 服务状态 -->
    <el-row :gutter="20" class="service-status">
      <el-col :span="24">
        <el-card class="service-card">
          <template #header>
            <div class="card-header">
              <span>服务状态</span>
              <el-button size="small" @click="refreshServices">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
          </template>
          <ServiceStatus 
            :services="services" 
            :loading="servicesLoading"
            @restart="handleRestartService"
            @stop="handleStopService"
            @start="handleStartService"
          />
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 系统日志 -->
    <el-row :gutter="20" class="system-logs">
      <el-col :span="24">
        <el-card class="logs-card">
          <template #header>
            <div class="card-header">
              <span>系统日志</span>
              <div class="log-controls">
                <el-select v-model="logLevel" size="small" style="width: 100px">
                  <el-option label="全部" value="all" />
                  <el-option label="错误" value="error" />
                  <el-option label="警告" value="warn" />
                  <el-option label="信息" value="info" />
                </el-select>
                <el-button size="small" @click="clearLogs">
                  <el-icon><Delete /></el-icon>
                  清空
                </el-button>
              </div>
            </div>
          </template>
          <SystemLogs 
            :logs="filteredLogs" 
            :loading="logsLoading"
            height="300px"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Cpu, 
  MemoryCard, 
  Monitor, 
  HardDisk,
  Refresh,
  Delete
} from '@element-plus/icons-vue'
import RealtimeChart from './components/RealtimeChart.vue'
import NetworkChart from './components/NetworkChart.vue'
import DiskChart from './components/DiskChart.vue'
import ServiceStatus from './components/ServiceStatus.vue'
import SystemLogs from './components/SystemLogs.vue'
import { 
  getSystemMetrics, 
  getRealtimeData, 
  getServiceStatus,
  getSystemLogs,
  restartService,
  stopService,
  startService
} from '@/api/monitor'
import type { 
  SystemMetric, 
  RealtimeData, 
  Service, 
  SystemLog 
} from '@/types/monitor'

// 响应式数据
const systemMetrics = ref<SystemMetric[]>([])
const cpuData = ref<RealtimeData[]>([])
const memoryData = ref<RealtimeData[]>([])
const networkData = ref<RealtimeData[]>([])
const diskData = ref<any[]>([])
const services = ref<Service[]>([])
const logs = ref<SystemLog[]>([])

// 控制状态
const autoRefresh = ref(true)
const logLevel = ref('all')

// 加载状态
const chartsLoading = reactive({
  cpu: false,
  memory: false,
  network: false,
  disk: false
})
const servicesLoading = ref(false)
const logsLoading = ref(false)

// 定时器
let refreshTimer: NodeJS.Timeout | null = null

// 计算属性
const filteredLogs = computed(() => {
  if (logLevel.value === 'all') {
    return logs.value
  }
  return logs.value.filter(log => log.level === logLevel.value)
})

// 生命周期
onMounted(() => {
  initMonitor()
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})

// 初始化监控
async function initMonitor() {
  await Promise.all([
    loadSystemMetrics(),
    loadRealtimeData(),
    loadServices(),
    loadLogs()
  ])
}

// 加载系统指标
async function loadSystemMetrics() {
  try {
    const response = await getSystemMetrics()
    systemMetrics.value = response.data.map((metric: any) => ({
      ...metric,
      icon: getMetricIcon(metric.key)
    }))
  } catch (error) {
    console.error('Load system metrics failed:', error)
    ElMessage.error('加载系统指标失败')
  }
}

// 加载实时数据
async function loadRealtimeData() {
  chartsLoading.cpu = true
  chartsLoading.memory = true
  chartsLoading.network = true
  chartsLoading.disk = true
  
  try {
    const response = await getRealtimeData()
    const data = response.data
    
    cpuData.value = data.cpu
    memoryData.value = data.memory
    networkData.value = data.network
    diskData.value = data.disk
  } catch (error) {
    console.error('Load realtime data failed:', error)
    ElMessage.error('加载实时数据失败')
  } finally {
    chartsLoading.cpu = false
    chartsLoading.memory = false
    chartsLoading.network = false
    chartsLoading.disk = false
  }
}

// 加载服务状态
async function loadServices() {
  servicesLoading.value = true
  try {
    const response = await getServiceStatus()
    services.value = response.data
  } catch (error) {
    console.error('Load services failed:', error)
    ElMessage.error('加载服务状态失败')
  } finally {
    servicesLoading.value = false
  }
}

// 加载系统日志
async function loadLogs() {
  logsLoading.value = true
  try {
    const response = await getSystemLogs({ limit: 100 })
    logs.value = response.data
  } catch (error) {
    console.error('Load logs failed:', error)
    ElMessage.error('加载系统日志失败')
  } finally {
    logsLoading.value = false
  }
}

// 切换自动刷新
function toggleAutoRefresh(enabled: boolean) {
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// 开始自动刷新
function startAutoRefresh() {
  refreshTimer = setInterval(() => {
    loadSystemMetrics()
    loadRealtimeData()
  }, 5000) // 每5秒刷新一次
}

// 停止自动刷新
function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 刷新服务
function refreshServices() {
  loadServices()
}

// 清空日志
async function clearLogs() {
  try {
    await ElMessageBox.confirm('确定要清空所有日志吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    logs.value = []
    ElMessage.success('日志已清空')
  } catch (error) {
    // 用户取消
  }
}

// 处理服务操作
async function handleRestartService(serviceName: string) {
  try {
    await restartService(serviceName)
    ElMessage.success(`服务 ${serviceName} 重启成功`)
    loadServices()
  } catch (error) {
    console.error('Restart service failed:', error)
    ElMessage.error(`服务 ${serviceName} 重启失败`)
  }
}

async function handleStopService(serviceName: string) {
  try {
    await stopService(serviceName)
    ElMessage.success(`服务 ${serviceName} 停止成功`)
    loadServices()
  } catch (error) {
    console.error('Stop service failed:', error)
    ElMessage.error(`服务 ${serviceName} 停止失败`)
  }
}

async function handleStartService(serviceName: string) {
  try {
    await startService(serviceName)
    ElMessage.success(`服务 ${serviceName} 启动成功`)
    loadServices()
  } catch (error) {
    console.error('Start service failed:', error)
    ElMessage.error(`服务 ${serviceName} 启动失败`)
  }
}

// 工具函数
function getMetricIcon(key: string) {
  const iconMap: Record<string, any> = {
    cpu: Cpu,
    memory: MemoryCard,
    disk: HardDisk,
    network: Monitor
  }
  return iconMap[key] || Monitor
}

function getMetricStatus(value: number, threshold: { warning: number; danger: number }) {
  if (value >= threshold.danger) return 'danger'
  if (value >= threshold.warning) return 'warning'
  return 'normal'
}

function getMetricTagType(value: number, threshold: { warning: number; danger: number }) {
  if (value >= threshold.danger) return 'danger'
  if (value >= threshold.warning) return 'warning'
  return 'success'
}

function getMetricStatusText(value: number, threshold: { warning: number; danger: number }) {
  if (value >= threshold.danger) return '危险'
  if (value >= threshold.warning) return '警告'
  return '正常'
}

function formatMetricValue(value: number, unit: string) {
  return `${value.toFixed(1)}${unit}`
}
</script>

<style lang="scss" scoped>
.monitor-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 84px);
}

.status-overview {
  margin-bottom: 20px;
}

.metric-card {
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  }
  
  &.normal {
    border-left: 4px solid #67c23a;
  }
  
  &.warning {
    border-left: 4px solid #e6a23c;
  }
  
  &.danger {
    border-left: 4px solid #f56c6c;
  }
}

.metric-content {
  display: flex;
  align-items: center;
}

.metric-icon {
  margin-right: 16px;
  color: #409eff;
}

.metric-info {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.metric-status {
  text-align: right;
}

.monitor-charts {
  margin-bottom: 20px;
}

.service-status {
  margin-bottom: 20px;
}

.system-logs {
  margin-bottom: 20px;
}

.chart-card,
.service-card,
.logs-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.log-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

// 响应式设计
@media (max-width: 768px) {
  .monitor-container {
    padding: 10px;
  }
  
  .metric-content {
    flex-direction: column;
    text-align: center;
  }
  
  .metric-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>
```

## 3. 实践练习

### 练习 1：完善数据可视化

1. 添加更多图表类型（饼图、雷达图等）
2. 实现图表数据的实时更新
3. 添加图表交互功能
4. 实现图表数据导出

### 练习 2：系统监控功能

1. 完善系统指标监控
2. 添加告警功能
3. 实现日志分析
4. 添加性能报告生成

### 练习 3：性能优化

1. 优化图表渲染性能
2. 实现数据懒加载
3. 添加缓存机制
4. 优化内存使用

## 学习资源

* [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
* [Vue 3 性能优化](https://cn.vuejs.org/guide/best-practices/performance.html)
* [Element Plus 数据展示组件](https://element-plus.org/zh-CN/component/table.html)
* [Web 性能监控](https://web.dev/performance/)

## 作业

1. 完成所有数据可视化组件
2. 实现完整的系统监控功能
3. 添加性能优化措施
4. 编写组件文档和使用说明

## 总结

今天我们继续了综合项目实战，主要完成了：

1. **数据可视化模块**：集成 ECharts 实现了多种图表展示
2. **系统监控功能**：实现了实时监控和状态展示
3. **性能优化实践**：应用了多种性能优化技术
4. **实时数据更新**：建立了实时数据更新机制

## 下一步学习计划

明天我们将完成项目实战的最后部分：
- 错误处理和日志系统
- 单元测试和集成测试
- 项目部署和发布
- 项目总结和优化建议