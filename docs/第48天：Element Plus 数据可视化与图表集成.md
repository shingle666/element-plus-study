# 第48天：Element Plus 数据可视化与图表集成

## 学习目标

今天我们将学习如何在 Element Plus 项目中集成数据可视化和图表功能，掌握现代图表库的使用和优化技术。

- 掌握主流图表库的集成方案
- 学习数据绑定和实时更新机制
- 实现交互式图表和仪表板
- 掌握图表主题和样式定制
- 学习图表性能优化技术

## 1. 图表库集成方案

### 1.1 ECharts 集成

```typescript
// echarts-integration.ts
import * as echarts from 'echarts/core'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart
} from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SingleAxisComponent,
  BrushComponent
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

// 注册必要的组件
echarts.use([
  // 图表类型
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  
  // 组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  SingleAxisComponent,
  BrushComponent,
  
  // 渲染器
  CanvasRenderer
])

export interface ChartConfig {
  type: string
  data: any
  options: echarts.EChartsOption
  theme?: string
  responsive?: boolean
  animation?: boolean
  loading?: boolean
  loadingOptions?: object
}

export interface ChartInstance {
  id: string
  chart: echarts.ECharts
  config: ChartConfig
  container: HTMLElement
}

export class EChartsManager {
  private instances: Map<string, ChartInstance> = new Map()
  private themes: Map<string, object> = new Map()
  private resizeObserver: ResizeObserver
  
  constructor() {
    this.setupResizeObserver()
    this.registerDefaultThemes()
  }
  
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const container = entry.target as HTMLElement
        const instanceId = container.getAttribute('data-chart-id')
        
        if (instanceId) {
          const instance = this.instances.get(instanceId)
          if (instance) {
            instance.chart.resize()
          }
        }
      })
    })
  }
  
  private registerDefaultThemes(): void {
    // Element Plus 主题
    const elementPlusTheme = {
      color: [
        '#409eff', '#67c23a', '#e6a23c', '#f56c6c',
        '#909399', '#c45656', '#73767a', '#d4237a'
      ],
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
        fontSize: 12,
        color: '#303133'
      },
      title: {
        textStyle: {
          color: '#303133',
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtextStyle: {
          color: '#909399',
          fontSize: 12
        }
      },
      line: {
        itemStyle: {
          borderWidth: 2
        },
        lineStyle: {
          width: 2
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: false
      },
      radar: {
        itemStyle: {
          borderWidth: 2
        },
        lineStyle: {
          width: 2
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: false
      },
      bar: {
        itemStyle: {
          barBorderWidth: 0,
          barBorderColor: '#ccc'
        }
      },
      pie: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      scatter: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      boxplot: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      parallel: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      sankey: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      funnel: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      gauge: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        }
      },
      candlestick: {
        itemStyle: {
          color: '#67c23a',
          color0: '#f56c6c',
          borderColor: '#67c23a',
          borderColor0: '#f56c6c',
          borderWidth: 1
        }
      },
      graph: {
        itemStyle: {
          borderWidth: 0,
          borderColor: '#ccc'
        },
        lineStyle: {
          width: 1,
          color: '#aaa'
        },
        symbolSize: 6,
        symbol: 'circle',
        smooth: false,
        color: [
          '#409eff', '#67c23a', '#e6a23c', '#f56c6c',
          '#909399', '#c45656', '#73767a', '#d4237a'
        ],
        label: {
          color: '#303133'
        }
      },
      map: {
        itemStyle: {
          areaColor: '#f3f3f3',
          borderColor: '#999',
          borderWidth: 0.5
        },
        label: {
          color: '#303133'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#409eff',
            borderColor: '#409eff',
            borderWidth: 1
          },
          label: {
            color: '#fff'
          }
        }
      },
      geo: {
        itemStyle: {
          areaColor: '#f3f3f3',
          borderColor: '#999',
          borderWidth: 0.5
        },
        label: {
          color: '#303133'
        },
        emphasis: {
          itemStyle: {
            areaColor: '#409eff',
            borderColor: '#409eff',
            borderWidth: 1
          },
          label: {
            color: '#fff'
          }
        }
      },
      categoryAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisLabel: {
          show: true,
          color: '#606266'
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: ['#f5f7fa']
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
          }
        }
      },
      valueAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisLabel: {
          show: true,
          color: '#606266'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#f5f7fa']
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
          }
        }
      },
      logAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisLabel: {
          show: true,
          color: '#606266'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#f5f7fa']
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
          }
        }
      },
      timeAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisTick: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        axisLabel: {
          show: true,
          color: '#606266'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#f5f7fa']
          }
        },
        splitArea: {
          show: false,
          areaStyle: {
            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
          }
        }
      },
      toolbox: {
        iconStyle: {
          borderColor: '#606266'
        },
        emphasis: {
          iconStyle: {
            borderColor: '#409eff'
          }
        }
      },
      legend: {
        textStyle: {
          color: '#303133'
        }
      },
      tooltip: {
        axisPointer: {
          lineStyle: {
            color: '#409eff',
            width: 1
          },
          crossStyle: {
            color: '#409eff',
            width: 1
          }
        }
      },
      timeline: {
        lineStyle: {
          color: '#409eff',
          width: 1
        },
        itemStyle: {
          color: '#409eff',
          borderWidth: 1
        },
        controlStyle: {
          color: '#409eff',
          borderColor: '#409eff',
          borderWidth: 0.5
        },
        checkpointStyle: {
          color: '#409eff',
          borderColor: '#409eff'
        },
        label: {
          color: '#409eff'
        },
        emphasis: {
          itemStyle: {
            color: '#409eff'
          },
          controlStyle: {
            color: '#409eff',
            borderColor: '#409eff',
            borderWidth: 0.5
          },
          label: {
            color: '#409eff'
          }
        }
      },
      visualMap: {
        color: ['#409eff', '#67c23a']
      },
      dataZoom: {
        backgroundColor: 'rgba(47,69,84,0)',
        dataBackgroundColor: 'rgba(47,69,84,0.3)',
        fillerColor: 'rgba(167,183,204,0.4)',
        handleColor: '#a7b7cc',
        handleSize: '100%',
        textStyle: {
          color: '#333'
        }
      },
      markPoint: {
        label: {
          color: '#303133'
        },
        emphasis: {
          label: {
            color: '#303133'
          }
        }
      }
    }
    
    this.registerTheme('element-plus', elementPlusTheme)
    
    // 暗黑主题
    const darkTheme = {
      ...elementPlusTheme,
      backgroundColor: '#1d1e1f',
      textStyle: {
        ...elementPlusTheme.textStyle,
        color: '#e4e7ed'
      },
      title: {
        textStyle: {
          color: '#e4e7ed',
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtextStyle: {
          color: '#909399',
          fontSize: 12
        }
      }
    }
    
    this.registerTheme('dark', darkTheme)
  }
  
  public registerTheme(name: string, theme: object): void {
    this.themes.set(name, theme)
    echarts.registerTheme(name, theme)
  }
  
  public createChart(container: HTMLElement, config: ChartConfig): string {
    const instanceId = this.generateId()
    
    // 设置容器属性
    container.setAttribute('data-chart-id', instanceId)
    
    // 创建图表实例
    const chart = echarts.init(container, config.theme || 'element-plus', {
      renderer: 'canvas',
      useDirtyRect: true
    })
    
    // 设置配置
    chart.setOption(config.options, true)
    
    // 处理加载状态
    if (config.loading) {
      chart.showLoading(config.loadingOptions)
    }
    
    // 创建实例记录
    const instance: ChartInstance = {
      id: instanceId,
      chart,
      config,
      container
    }
    
    this.instances.set(instanceId, instance)
    
    // 监听容器大小变化
    if (config.responsive !== false) {
      this.resizeObserver.observe(container)
    }
    
    return instanceId
  }
  
  public updateChart(instanceId: string, options: echarts.EChartsOption, notMerge = false): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.chart.setOption(options, notMerge)
      instance.config.options = { ...instance.config.options, ...options }
    }
  }
  
  public updateData(instanceId: string, data: any): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      const newOptions = this.processData(data, instance.config.type)
      this.updateChart(instanceId, newOptions)
    }
  }
  
  public destroyChart(instanceId: string): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      // 停止监听大小变化
      this.resizeObserver.unobserve(instance.container)
      
      // 销毁图表
      instance.chart.dispose()
      
      // 清理容器属性
      instance.container.removeAttribute('data-chart-id')
      
      // 删除实例记录
      this.instances.delete(instanceId)
    }
  }
  
  public resizeChart(instanceId: string): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.chart.resize()
    }
  }
  
  public showLoading(instanceId: string, options?: object): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.chart.showLoading(options)
    }
  }
  
  public hideLoading(instanceId: string): void {
    const instance = this.instances.get(instanceId)
    if (instance) {
      instance.chart.hideLoading()
    }
  }
  
  public getChart(instanceId: string): echarts.ECharts | null {
    const instance = this.instances.get(instanceId)
    return instance ? instance.chart : null
  }
  
  public getAllCharts(): ChartInstance[] {
    return Array.from(this.instances.values())
  }
  
  private processData(data: any, chartType: string): echarts.EChartsOption {
    // 根据图表类型处理数据
    switch (chartType) {
      case 'line':
      case 'bar':
        return {
          xAxis: {
            data: data.categories || []
          },
          series: data.series || []
        }
      
      case 'pie':
        return {
          series: [{
            type: 'pie',
            data: data.data || []
          }]
        }
      
      case 'scatter':
        return {
          series: [{
            type: 'scatter',
            data: data.data || []
          }]
        }
      
      default:
        return data
    }
  }
  
  private generateId(): string {
    return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  public destroy(): void {
    // 销毁所有图表实例
    this.instances.forEach((instance) => {
      this.destroyChart(instance.id)
    })
    
    // 断开 ResizeObserver
    this.resizeObserver.disconnect()
  }
}

// 全局实例
export const echartsManager = new EChartsManager()
```

### 1.2 Vue 3 图表组件

```vue
<!-- EChart.vue -->
<template>
  <div
    ref="chartContainer"
    class="echart-container"
    :style="containerStyle"
  >
    <div v-if="loading && !chartInstance" class="chart-loading">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-if="error" class="chart-error">
      <el-alert
        :title="error.message"
        type="error"
        show-icon
        :closable="false"
      />
      <el-button @click="retry" type="primary" size="small" style="margin-top: 12px">
        重试
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, CSSProperties } from 'vue'
import { ElSkeleton, ElAlert, ElButton } from 'element-plus'
import { echartsManager, type ChartConfig } from './echarts-integration'
import type { EChartsOption } from 'echarts'

interface Props {
  type: string
  data?: any
  options: EChartsOption
  theme?: string
  width?: string | number
  height?: string | number
  responsive?: boolean
  animation?: boolean
  loading?: boolean
  loadingOptions?: object
  autoResize?: boolean
  notMerge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'element-plus',
  width: '100%',
  height: '400px',
  responsive: true,
  animation: true,
  loading: false,
  autoResize: true,
  notMerge: false
})

const emit = defineEmits<{
  'chart-ready': [chart: any]
  'chart-click': [params: any]
  'chart-dblclick': [params: any]
  'chart-mouseover': [params: any]
  'chart-mouseout': [params: any]
  'chart-selectchanged': [params: any]
  'chart-finished': []
  'error': [error: Error]
}>()

// 响应式状态
const chartContainer = ref<HTMLElement>()
const chartInstance = ref<string | null>(null)
const loading = ref(props.loading)
const error = ref<Error | null>(null)

// 计算属性
const containerStyle = computed((): CSSProperties => {
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height
  }
})

const chartConfig = computed((): ChartConfig => {
  return {
    type: props.type,
    data: props.data,
    options: props.options,
    theme: props.theme,
    responsive: props.responsive,
    animation: props.animation,
    loading: loading.value,
    loadingOptions: props.loadingOptions
  }
})

// 方法
const initChart = async (): Promise<void> => {
  if (!chartContainer.value) return
  
  try {
    loading.value = true
    error.value = null
    
    // 等待 DOM 更新
    await nextTick()
    
    // 创建图表
    const instanceId = echartsManager.createChart(chartContainer.value, chartConfig.value)
    chartInstance.value = instanceId
    
    // 获取图表实例
    const chart = echartsManager.getChart(instanceId)
    if (chart) {
      // 绑定事件
      setupChartEvents(chart)
      
      // 触发就绪事件
      emit('chart-ready', chart)
    }
  } catch (err) {
    error.value = err as Error
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

const setupChartEvents = (chart: any): void => {
  chart.on('click', (params: any) => emit('chart-click', params))
  chart.on('dblclick', (params: any) => emit('chart-dblclick', params))
  chart.on('mouseover', (params: any) => emit('chart-mouseover', params))
  chart.on('mouseout', (params: any) => emit('chart-mouseout', params))
  chart.on('selectchanged', (params: any) => emit('chart-selectchanged', params))
  chart.on('finished', () => emit('chart-finished'))
}

const updateChart = (): void => {
  if (chartInstance.value) {
    echartsManager.updateChart(chartInstance.value, props.options, props.notMerge)
  }
}

const updateData = (): void => {
  if (chartInstance.value && props.data) {
    echartsManager.updateData(chartInstance.value, props.data)
  }
}

const resize = (): void => {
  if (chartInstance.value) {
    echartsManager.resizeChart(chartInstance.value)
  }
}

const showLoading = (): void => {
  if (chartInstance.value) {
    echartsManager.showLoading(chartInstance.value, props.loadingOptions)
  }
}

const hideLoading = (): void => {
  if (chartInstance.value) {
    echartsManager.hideLoading(chartInstance.value)
  }
}

const retry = (): void => {
  destroyChart()
  initChart()
}

const destroyChart = (): void => {
  if (chartInstance.value) {
    echartsManager.destroyChart(chartInstance.value)
    chartInstance.value = null
  }
}

// 监听器
watch(
  () => props.options,
  () => {
    updateChart()
  },
  { deep: true }
)

watch(
  () => props.data,
  () => {
    updateData()
  },
  { deep: true }
)

watch(
  () => props.loading,
  (newLoading) => {
    loading.value = newLoading
    
    if (chartInstance.value) {
      if (newLoading) {
        showLoading()
      } else {
        hideLoading()
      }
    }
  }
)

watch(
  () => [props.width, props.height],
  () => {
    nextTick(() => {
      resize()
    })
  }
)

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  destroyChart()
})

// 暴露方法
defineExpose({
  resize,
  showLoading,
  hideLoading,
  updateChart,
  updateData,
  getChart: () => chartInstance.value ? echartsManager.getChart(chartInstance.value) : null,
  retry
})
</script>

<style scoped>
.echart-container {
  position: relative;
  overflow: hidden;
}

.chart-loading,
.chart-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
}

.chart-error {
  padding: 20px;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
}
</style>
```

## 2. 数据绑定和实时更新

### 2.1 数据管理系统

```typescript
// chart-data-manager.ts
export interface DataSource {
  id: string
  name: string
  type: 'static' | 'api' | 'websocket' | 'polling'
  config: DataSourceConfig
  transformer?: DataTransformer
  cache?: CacheConfig
}

export interface DataSourceConfig {
  // 静态数据
  data?: any
  
  // API 配置
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
  
  // WebSocket 配置
  wsUrl?: string
  protocols?: string[]
  
  // 轮询配置
  interval?: number
  maxRetries?: number
}

export interface DataTransformer {
  (data: any): any
}

export interface CacheConfig {
  enabled: boolean
  ttl: number // 缓存时间（毫秒）
  key?: string
}

export interface DataSubscription {
  id: string
  dataSourceId: string
  callback: (data: any, error?: Error) => void
  active: boolean
}

export class ChartDataManager {
  private dataSources: Map<string, DataSource> = new Map()
  private subscriptions: Map<string, DataSubscription> = new Map()
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private pollingTimers: Map<string, NodeJS.Timeout> = new Map()
  private websockets: Map<string, WebSocket> = new Map()
  
  public registerDataSource(dataSource: DataSource): void {
    this.dataSources.set(dataSource.id, dataSource)
    
    // 如果是轮询类型，启动轮询
    if (dataSource.type === 'polling' && dataSource.config.interval) {
      this.startPolling(dataSource.id)
    }
    
    // 如果是 WebSocket 类型，建立连接
    if (dataSource.type === 'websocket' && dataSource.config.wsUrl) {
      this.connectWebSocket(dataSource.id)
    }
  }
  
  public unregisterDataSource(id: string): void {
    const dataSource = this.dataSources.get(id)
    if (dataSource) {
      // 停止轮询
      this.stopPolling(id)
      
      // 关闭 WebSocket
      this.disconnectWebSocket(id)
      
      // 清理缓存
      this.clearCache(id)
      
      // 删除数据源
      this.dataSources.delete(id)
      
      // 清理相关订阅
      this.subscriptions.forEach((subscription, subId) => {
        if (subscription.dataSourceId === id) {
          this.subscriptions.delete(subId)
        }
      })
    }
  }
  
  public subscribe(dataSourceId: string, callback: (data: any, error?: Error) => void): string {
    const subscriptionId = this.generateId()
    
    const subscription: DataSubscription = {
      id: subscriptionId,
      dataSourceId,
      callback,
      active: true
    }
    
    this.subscriptions.set(subscriptionId, subscription)
    
    // 立即获取数据
    this.fetchData(dataSourceId).then(data => {
      if (subscription.active) {
        callback(data)
      }
    }).catch(error => {
      if (subscription.active) {
        callback(null, error)
      }
    })
    
    return subscriptionId
  }
  
  public unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId)
    if (subscription) {
      subscription.active = false
      this.subscriptions.delete(subscriptionId)
    }
  }
  
  public async fetchData(dataSourceId: string, forceRefresh = false): Promise<any> {
    const dataSource = this.dataSources.get(dataSourceId)
    if (!dataSource) {
      throw new Error(`Data source ${dataSourceId} not found`)
    }
    
    // 检查缓存
    if (!forceRefresh && dataSource.cache?.enabled) {
      const cached = this.getFromCache(dataSourceId)
      if (cached) {
        return cached
      }
    }
    
    let data: any
    
    switch (dataSource.type) {
      case 'static':
        data = dataSource.config.data
        break
        
      case 'api':
        data = await this.fetchFromAPI(dataSource.config)
        break
        
      case 'polling':
        data = await this.fetchFromAPI(dataSource.config)
        break
        
      case 'websocket':
        // WebSocket 数据通过事件推送，这里返回缓存的数据
        data = this.getFromCache(dataSourceId)
        break
        
      default:
        throw new Error(`Unsupported data source type: ${dataSource.type}`)
    }
    
    // 应用数据转换器
    if (dataSource.transformer) {
      data = dataSource.transformer(data)
    }
    
    // 缓存数据
    if (dataSource.cache?.enabled) {
      this.setCache(dataSourceId, data, dataSource.cache.ttl)
    }
    
    return data
  }
  
  private async fetchFromAPI(config: DataSourceConfig): Promise<any> {
    const { url, method = 'GET', headers = {}, params, body } = config
    
    if (!url) {
      throw new Error('API URL is required')
    }
    
    // 构建 URL
    let requestUrl = url
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params)
      requestUrl += (url.includes('?') ? '&' : '?') + searchParams.toString()
    }
    
    // 构建请求选项
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }
    
    if (body && method !== 'GET') {
      options.body = typeof body === 'string' ? body : JSON.stringify(body)
    }
    
    // 发送请求
    const response = await fetch(requestUrl, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return await response.json()
  }
  
  private startPolling(dataSourceId: string): void {
    const dataSource = this.dataSources.get(dataSourceId)
    if (!dataSource || !dataSource.config.interval) return
    
    const timer = setInterval(async () => {
      try {
        const data = await this.fetchData(dataSourceId, true)
        this.notifySubscribers(dataSourceId, data)
      } catch (error) {
        this.notifySubscribers(dataSourceId, null, error as Error)
      }
    }, dataSource.config.interval)
    
    this.pollingTimers.set(dataSourceId, timer)
  }
  
  private stopPolling(dataSourceId: string): void {
    const timer = this.pollingTimers.get(dataSourceId)
    if (timer) {
      clearInterval(timer)
      this.pollingTimers.delete(dataSourceId)
    }
  }
  
  private connectWebSocket(dataSourceId: string): void {
    const dataSource = this.dataSources.get(dataSourceId)
    if (!dataSource || !dataSource.config.wsUrl) return
    
    const ws = new WebSocket(dataSource.config.wsUrl, dataSource.config.protocols)
    
    ws.onopen = () => {
      console.log(`WebSocket connected: ${dataSourceId}`)
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // 应用数据转换器
        const transformedData = dataSource.transformer ? dataSource.transformer(data) : data
        
        // 缓存数据
        if (dataSource.cache?.enabled) {
          this.setCache(dataSourceId, transformedData, dataSource.cache.ttl)
        }
        
        // 通知订阅者
        this.notifySubscribers(dataSourceId, transformedData)
      } catch (error) {
        this.notifySubscribers(dataSourceId, null, error as Error)
      }
    }
    
    ws.onerror = (error) => {
      console.error(`WebSocket error: ${dataSourceId}`, error)
      this.notifySubscribers(dataSourceId, null, new Error('WebSocket connection error'))
    }
    
    ws.onclose = () => {
      console.log(`WebSocket closed: ${dataSourceId}`)
      this.websockets.delete(dataSourceId)
      
      // 尝试重连
      setTimeout(() => {
        if (this.dataSources.has(dataSourceId)) {
          this.connectWebSocket(dataSourceId)
        }
      }, 5000)
    }
    
    this.websockets.set(dataSourceId, ws)
  }
  
  private disconnectWebSocket(dataSourceId: string): void {
    const ws = this.websockets.get(dataSourceId)
    if (ws) {
      ws.close()
      this.websockets.delete(dataSourceId)
    }
  }
  
  private notifySubscribers(dataSourceId: string, data: any, error?: Error): void {
    this.subscriptions.forEach(subscription => {
      if (subscription.dataSourceId === dataSourceId && subscription.active) {
        subscription.callback(data, error)
      }
    })
  }
  
  private getFromCache(dataSourceId: string): any | null {
    const cached = this.cache.get(dataSourceId)
    if (cached) {
      const now = Date.now()
      if (now - cached.timestamp < cached.ttl) {
        return cached.data
      } else {
        this.cache.delete(dataSourceId)
      }
    }
    return null
  }
  
  private setCache(dataSourceId: string, data: any, ttl: number): void {
    this.cache.set(dataSourceId, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  private clearCache(dataSourceId?: string): void {
    if (dataSourceId) {
      this.cache.delete(dataSourceId)
    } else {
      this.cache.clear()
    }
  }
  
  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  public destroy(): void {
    // 停止所有轮询
    this.pollingTimers.forEach((timer) => {
      clearInterval(timer)
    })
    this.pollingTimers.clear()
    
    // 关闭所有 WebSocket
    this.websockets.forEach((ws) => {
      ws.close()
    })
    this.websockets.clear()
    
    // 清理所有数据
    this.dataSources.clear()
    this.subscriptions.clear()
    this.cache.clear()
  }
}

// 全局实例
export const chartDataManager = new ChartDataManager()
```

### 2.2 实时图表组件

```vue
<!-- RealTimeChart.vue -->
<template>
  <div class="realtime-chart">
    <div class="chart-header">
      <div class="chart-title">
        <h3>{{ title }}</h3>
        <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
      </div>
      
      <div class="chart-controls">
        <el-button-group>
          <el-button
            :type="autoUpdate ? 'primary' : 'default'"
            size="small"
            @click="toggleAutoUpdate"
          >
            <el-icon><VideoPlay v-if="!autoUpdate" /><VideoPause v-else /></el-icon>
            {{ autoUpdate ? '暂停' : '开始' }}
          </el-button>
          
          <el-button size="small" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
          
          <el-button size="small" @click="exportData">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </el-button-group>
        
        <el-dropdown @command="handleTimeRangeChange">
          <el-button size="small">
            {{ currentTimeRange.label }}
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="range in timeRanges"
                :key="range.value"
                :command="range.value"
                :disabled="range.value === currentTimeRange.value"
              >
                {{ range.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <div class="chart-content">
      <EChart
        ref="chartRef"
        :type="chartType"
        :data="chartData"
        :options="chartOptions"
        :loading="loading"
        :height="height"
        @chart-ready="handleChartReady"
        @error="handleChartError"
      />
      
      <div v-if="showStats" class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">数据点数:</span>
          <span class="stat-value">{{ dataPointCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">更新频率:</span>
          <span class="stat-value">{{ updateFrequency }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最后更新:</span>
          <span class="stat-value">{{ lastUpdateTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  ElButton,
  ElButtonGroup,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElIcon,
  ElMessage
} from 'element-plus'
import {
  VideoPlay,
  VideoPause,
  Refresh,
  Download,
  ArrowDown
} from '@element-plus/icons-vue'
import EChart from './EChart.vue'
import { chartDataManager, type DataSource } from './chart-data-manager'
import type { EChartsOption } from 'echarts'

interface Props {
  title: string
  subtitle?: string
  chartType: string
  dataSource: DataSource
  options?: EChartsOption
  height?: string
  maxDataPoints?: number
  autoUpdate?: boolean
  showStats?: boolean
  timeRanges?: { label: string; value: string; duration: number }[]
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  maxDataPoints: 100,
  autoUpdate: true,
  showStats: true,
  timeRanges: () => [
    { label: '最近 5 分钟', value: '5m', duration: 5 * 60 * 1000 },
    { label: '最近 15 分钟', value: '15m', duration: 15 * 60 * 1000 },
    { label: '最近 1 小时', value: '1h', duration: 60 * 60 * 1000 },
    { label: '最近 6 小时', value: '6h', duration: 6 * 60 * 60 * 1000 },
    { label: '最近 24 小时', value: '24h', duration: 24 * 60 * 60 * 1000 }
  ]
})

const emit = defineEmits<{
  'data-update': [data: any]
  'error': [error: Error]
}>()

// 响应式状态
const chartRef = ref<InstanceType<typeof EChart>>()
const loading = ref(false)
const autoUpdate = ref(props.autoUpdate)
const rawData = ref<any[]>([])
const subscriptionId = ref<string | null>(null)
const lastUpdateTime = ref<string>('')
const updateCount = ref(0)
const startTime = ref(Date.now())
const currentTimeRange = ref(props.timeRanges[0])

// 计算属性
const chartData = computed(() => {
  if (!rawData.value.length) return null
  
  // 根据时间范围过滤数据
  const now = Date.now()
  const cutoff = now - currentTimeRange.value.duration
  
  const filteredData = rawData.value.filter(item => {
    const timestamp = item.timestamp || item.time || now
    return timestamp >= cutoff
  })
  
  // 限制数据点数量
  if (filteredData.length > props.maxDataPoints) {
    const step = Math.ceil(filteredData.length / props.maxDataPoints)
    return filteredData.filter((_, index) => index % step === 0)
  }
  
  return filteredData
})

const chartOptions = computed((): EChartsOption => {
  const baseOptions: EChartsOption = {
    title: {
      text: props.title,
      subtext: props.subtitle
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['数据']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '数据',
        type: props.chartType as any,
        data: chartData.value || [],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2
        },
        areaStyle: {
          opacity: 0.3
        }
      }
    ],
    animation: true,
    animationDuration: 300
  }
  
  return { ...baseOptions, ...props.options }
})

const dataPointCount = computed(() => {
  return chartData.value ? chartData.value.length : 0
})

const updateFrequency = computed(() => {
  const elapsed = Date.now() - startTime.value
  if (elapsed === 0 || updateCount.value === 0) return '0 次/秒'
  
  const frequency = (updateCount.value / elapsed) * 1000
  return `${frequency.toFixed(2)} 次/秒`
})

// 方法
const setupDataSubscription = (): void => {
  if (subscriptionId.value) {
    chartDataManager.unsubscribe(subscriptionId.value)
  }
  
  // 注册数据源
  chartDataManager.registerDataSource(props.dataSource)
  
  // 订阅数据更新
  subscriptionId.value = chartDataManager.subscribe(
    props.dataSource.id,
    handleDataUpdate
  )
}

const handleDataUpdate = (data: any, error?: Error): void => {
  if (error) {
    console.error('Data update error:', error)
    emit('error', error)
    return
  }
  
  if (!autoUpdate.value) return
  
  // 更新原始数据
  if (Array.isArray(data)) {
    rawData.value = data
  } else if (data && typeof data === 'object') {
    // 假设数据是单个数据点
    const timestamp = data.timestamp || data.time || Date.now()
    rawData.value.push({ ...data, timestamp })
    
    // 限制数据数量
    if (rawData.value.length > props.maxDataPoints * 2) {
      rawData.value = rawData.value.slice(-props.maxDataPoints)
    }
  }
  
  // 更新统计信息
  updateCount.value++
  lastUpdateTime.value = new Date().toLocaleTimeString()
  
  emit('data-update', data)
}

const toggleAutoUpdate = (): void => {
  autoUpdate.value = !autoUpdate.value
  
  if (autoUpdate.value) {
    ElMessage.success('已开启自动更新')
  } else {
    ElMessage.info('已暂停自动更新')
  }
}

const refreshData = async (): Promise<void> => {
  if (!props.dataSource.id) return
  
  try {
    loading.value = true
    const data = await chartDataManager.fetchData(props.dataSource.id, true)
    handleDataUpdate(data)
    ElMessage.success('数据刷新成功')
  } catch (error) {
    console.error('Refresh data error:', error)
    ElMessage.error('数据刷新失败')
    emit('error', error as Error)
  } finally {
    loading.value = false
  }
}

const exportData = (): void => {
  if (!chartData.value || !chartData.value.length) {
    ElMessage.warning('没有数据可导出')
    return
  }
  
  try {
    const dataStr = JSON.stringify(chartData.value, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${props.title}_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('Export data error:', error)
    ElMessage.error('数据导出失败')
  }
}

const handleTimeRangeChange = (value: string): void => {
  const range = props.timeRanges.find(r => r.value === value)
  if (range) {
    currentTimeRange.value = range
  }
}

const handleChartReady = (chart: any): void => {
  console.log('Chart ready:', chart)
}

const handleChartError = (error: Error): void => {
  console.error('Chart error:', error)
  emit('error', error)
}

// 监听器
watch(
  () => props.dataSource,
  () => {
    setupDataSubscription()
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  setupDataSubscription()
})

onUnmounted(() => {
  if (subscriptionId.value) {
    chartDataManager.unsubscribe(subscriptionId.value)
  }
  
  chartDataManager.unregisterDataSource(props.dataSource.id)
})

// 暴露方法
defineExpose({
  refreshData,
  exportData,
  toggleAutoUpdate,
  getChart: () => chartRef.value?.getChart()
})
</script>

<style scoped>
.realtime-chart {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-bottom: 1px solid var(--el-border-color);
}

.chart-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-left: 8px;
}

.chart-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.chart-content {
  position: relative;
}

.chart-stats {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: var(--el-border-radius-small);
  box-shadow: var(--el-box-shadow-light);
  font-size: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: var(--el-text-color-secondary);
  margin-right: 8px;
}

.stat-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}
</style>
```

## 3. 实践练习

### 练习1：多图表仪表板
```vue
<!-- 构建多图表仪表板 -->
<!-- 1. 网格布局系统 -->
<!-- 2. 图表联动交互 -->
<!-- 3. 数据筛选和钻取 -->
<!-- 4. 响应式设计 -->
```

### 练习2：自定义图表组件
```typescript
// 开发自定义图表类型
// 1. 扩展 ECharts 图表类型
// 2. 自定义渲染逻辑
// 3. 交互事件处理
// 4. 主题和样式定制
```

### 练习3：图表性能优化
```typescript
// 实现图表性能优化
// 1. 数据虚拟化
// 2. 渲染优化
// 3. 内存管理
// 4. 动画优化
```

### 练习4：图表导出功能
```typescript
// 开发图表导出系统
// 1. 图片导出（PNG、SVG）
// 2. 数据导出（Excel、CSV）
// 3. 报告生成（PDF）
// 4. 批量导出
```

## 学习资源

### 官方文档
- [Apache ECharts](https://echarts.apache.org/)
- [Chart.js](https://www.chartjs.org/)
- [D3.js](https://d3js.org/)

### 技术文章
- [数据可视化最佳实践](https://www.tableau.com/learn/articles/data-visualization)
- [图表性能优化指南](https://echarts.apache.org/handbook/en/best-practice/performance/)
- [实时数据可视化](https://observablehq.com/@d3/real-time-data)

### 工具和库
- [ECharts for Vue](https://github.com/ecomfe/vue-echarts)
- [Chart.js Vue](https://vue-chartjs.org/)
- [Vue D3](https://github.com/MainRo/vue-d3)

## 作业

1. **图表集成**：集成多种图表库并实现统一的接口
2. **实时数据**：构