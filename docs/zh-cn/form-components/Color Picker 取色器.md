# Color Picker 取色器

## 概述

Color Picker 取色器是一个用于颜色选择的表单组件，提供多种颜色选择方式，包括色板选择、HSV 调节、RGB 输入等。它支持多种颜色格式，并提供了丰富的自定义选项。

## 学习目标

- 掌握 Color Picker 的基本概念和使用场景
- 学会基础颜色选择功能的实现
- 了解不同颜色格式的支持
- 掌握预设颜色和自定义颜色的配置
- 学会颜色选择器的高级功能
- 了解颜色选择器在实际项目中的应用
- 掌握 API 的完整使用方法

## 基础用法

### 基本颜色选择器

最简单的颜色选择器：

```vue
<template>
  <div>
    <h4>基本颜色选择器</h4>
    <el-color-picker v-model="color1" />
    <p>选中的颜色：{{ color1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color1 = ref('#409EFF')
</script>
```

### 选择透明度

支持透明度选择的颜色选择器：

```vue
<template>
  <div>
    <h4>支持透明度</h4>
    <el-color-picker v-model="color2" show-alpha />
    <p>选中的颜色：{{ color2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color2 = ref('rgba(64, 158, 255, 0.8)')
</script>
```

### 预设颜色

提供预设颜色选项：

```vue
<template>
  <div>
    <h4>预设颜色</h4>
    <el-color-picker
      v-model="color3"
      :predefine="predefineColors"
    />
    <p>选中的颜色：{{ color3 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color3 = ref('#409EFF')

const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]
</script>
```

### 不同尺寸

提供不同尺寸的颜色选择器：

```vue
<template>
  <div>
    <h4>不同尺寸</h4>
    <div class="size-demo">
      <el-color-picker v-model="color4" size="large" />
      <el-color-picker v-model="color4" />
      <el-color-picker v-model="color4" size="small" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color4 = ref('#409EFF')
</script>

<style scoped>
.size-demo {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
```

## 高级功能

### 颜色格式

支持多种颜色格式：

```vue
<template>
  <div>
    <h4>不同颜色格式</h4>
    
    <div class="format-demo">
      <div class="format-item">
        <label>HEX 格式：</label>
        <el-color-picker v-model="hexColor" color-format="hex" />
        <span>{{ hexColor }}</span>
      </div>
      
      <div class="format-item">
        <label>RGB 格式：</label>
        <el-color-picker v-model="rgbColor" color-format="rgb" />
        <span>{{ rgbColor }}</span>
      </div>
      
      <div class="format-item">
        <label>HSL 格式：</label>
        <el-color-picker v-model="hslColor" color-format="hsl" />
        <span>{{ hslColor }}</span>
      </div>
      
      <div class="format-item">
        <label>HSV 格式：</label>
        <el-color-picker v-model="hsvColor" color-format="hsv" />
        <span>{{ hsvColor }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hexColor = ref('#409EFF')
const rgbColor = ref('rgb(64, 158, 255)')
const hslColor = ref('hsl(209, 100%, 63%)')
const hsvColor = ref('hsv(209, 75%, 100%)')
</script>

<style scoped>
.format-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-item label {
  width: 100px;
  font-weight: 500;
}

.format-item span {
  min-width: 200px;
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
}
</style>
```

### 禁用状态

```vue
<template>
  <div>
    <h4>禁用状态</h4>
    <el-color-picker v-model="color5" disabled />
    <p>禁用的颜色选择器</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color5 = ref('#409EFF')
</script>
```

## 实际应用示例

### 主题配置器

创建一个主题颜色配置组件：

```vue
<template>
  <div class="theme-configurator">
    <h3>主题配置器</h3>
    
    <div class="config-section">
      <h4>主要颜色</h4>
      <div class="color-configs">
        <div class="color-config">
          <label>主色调：</label>
          <el-color-picker
            v-model="themeColors.primary"
            :predefine="primaryPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.primary }}</span>
        </div>
        
        <div class="color-config">
          <label>成功色：</label>
          <el-color-picker
            v-model="themeColors.success"
            :predefine="successPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.success }}</span>
        </div>
        
        <div class="color-config">
          <label>警告色：</label>
          <el-color-picker
            v-model="themeColors.warning"
            :predefine="warningPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.warning }}</span>
        </div>
        
        <div class="color-config">
          <label>危险色：</label>
          <el-color-picker
            v-model="themeColors.danger"
            :predefine="dangerPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.danger }}</span>
        </div>
      </div>
    </div>
    
    <div class="config-section">
      <h4>背景颜色</h4>
      <div class="color-configs">
        <div class="color-config">
          <label>页面背景：</label>
          <el-color-picker
            v-model="themeColors.background"
            show-alpha
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.background }}</span>
        </div>
        
        <div class="color-config">
          <label>卡片背景：</label>
          <el-color-picker
            v-model="themeColors.cardBackground"
            show-alpha
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.cardBackground }}</span>
        </div>
      </div>
    </div>
    
    <div class="preview-section">
      <h4>预览效果</h4>
      <div class="theme-preview" :style="previewStyles">
        <div class="preview-card">
          <h5>示例卡片</h5>
          <p>这是一个示例文本内容。</p>
          <div class="preview-buttons">
            <button class="btn btn-primary">主要按钮</button>
            <button class="btn btn-success">成功按钮</button>
            <button class="btn btn-warning">警告按钮</button>
            <button class="btn btn-danger">危险按钮</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <el-button @click="resetTheme">重置主题</el-button>
      <el-button type="primary" @click="exportTheme">导出配置</el-button>
      <el-button type="success" @click="applyTheme">应用主题</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const themeColors = ref({
  primary: '#409EFF',
  success: '#67C23A',
  warning: '#E6A23C',
  danger: '#F56C6C',
  background: '#ffffff',
  cardBackground: '#f5f7fa'
})

const primaryPresets = [
  '#409EFF', '#1890ff', '#722ed1', '#eb2f96', '#52c41a'
]

const successPresets = [
  '#67C23A', '#52c41a', '#73d13d', '#95de64', '#b7eb8f'
]

const warningPresets = [
  '#E6A23C', '#fa8c16', '#ffa940', '#ffc53d', '#ffd666'
]

const dangerPresets = [
  '#F56C6C', '#ff4d4f', '#ff7875', '#ffa39e', '#ffccc7'
]

const previewStyles = computed(() => ({
  backgroundColor: themeColors.value.background,
  '--primary-color': themeColors.value.primary,
  '--success-color': themeColors.value.success,
  '--warning-color': themeColors.value.warning,
  '--danger-color': themeColors.value.danger,
  '--card-background': themeColors.value.cardBackground
}))

const updateTheme = () => {
  ElMessage.success('主题已更新')
}

const resetTheme = () => {
  themeColors.value = {
    primary: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    background: '#ffffff',
    cardBackground: '#f5f7fa'
  }
  ElMessage.info('主题已重置')
}

const exportTheme = () => {
  const config = JSON.stringify(themeColors.value, null, 2)
  navigator.clipboard.writeText(config)
  ElMessage.success('主题配置已复制到剪贴板')
}

const applyTheme = () => {
  // 这里可以实现应用主题的逻辑
  ElMessage.success('主题已应用')
}
</script>

<style scoped>
.theme-configurator {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.config-section {
  margin-bottom: 24px;
}

.config-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.color-configs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-config {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-config label {
  width: 100px;
  font-weight: 500;
  color: #606266;
}

.color-value {
  min-width: 120px;
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #909399;
}

.preview-section {
  margin-bottom: 24px;
}

.theme-preview {
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.preview-card {
  background-color: var(--card-background);
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-card h5 {
  margin: 0 0 12px 0;
  color: #303133;
}

.preview-card p {
  margin: 0 0 16px 0;
  color: #606266;
  line-height: 1.5;
}

.preview-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-success {
  background-color: var(--success-color);
  color: white;
}

.btn-warning {
  background-color: var(--warning-color);
  color: white;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}
</style>
```

### 图表颜色配置

创建一个图表颜色配置组件：

```vue
<template>
  <div class="chart-color-config">
    <h3>图表颜色配置</h3>
    
    <div class="config-panel">
      <div class="color-series">
        <h4>数据系列颜色</h4>
        <div class="series-colors">
          <div
            v-for="(color, index) in chartColors"
            :key="index"
            class="color-item"
          >
            <span class="color-label">系列 {{ index + 1 }}：</span>
            <el-color-picker
              v-model="chartColors[index]"
              @change="updateChart"
            />
            <button
              v-if="chartColors.length > 1"
              @click="removeColor(index)"
              class="remove-btn"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="color-actions">
          <el-button @click="addColor" size="small">添加颜色</el-button>
          <el-button @click="randomColors" size="small" type="primary">随机颜色</el-button>
        </div>
      </div>
      
      <div class="background-config">
        <h4>背景配置</h4>
        <div class="bg-colors">
          <div class="color-item">
            <span class="color-label">图表背景：</span>
            <el-color-picker
              v-model="chartBackground"
              show-alpha
              @change="updateChart"
            />
          </div>
          
          <div class="color-item">
            <span class="color-label">网格颜色：</span>
            <el-color-picker
              v-model="gridColor"
              show-alpha
              @change="updateChart"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-preview">
      <h4>预览效果</h4>
      <div class="mock-chart" :style="chartStyles">
        <div class="chart-title">示例图表</div>
        <div class="chart-content">
          <div class="chart-bars">
            <div
              v-for="(color, index) in chartColors.slice(0, 5)"
              :key="index"
              class="chart-bar"
              :style="{
                backgroundColor: color,
                height: `${Math.random() * 80 + 20}%`
              }"
            >
              <span class="bar-label">{{ index + 1 }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <div
              v-for="(color, index) in chartColors.slice(0, 5)"
              :key="index"
              class="legend-item"
            >
              <span class="legend-color" :style="{ backgroundColor: color }"></span>
              <span class="legend-text">数据系列 {{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="export-section">
      <h4>导出配置</h4>
      <div class="export-options">
        <el-button @click="exportAsJSON">导出 JSON</el-button>
        <el-button @click="exportAsCSS">导出 CSS</el-button>
        <el-button @click="exportAsArray">导出数组</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const chartColors = ref([
  '#409EFF',
  '#67C23A',
  '#E6A23C',
  '#F56C6C',
  '#909399'
])

const chartBackground = ref('#ffffff')
const gridColor = ref('rgba(0, 0, 0, 0.1)')

const chartStyles = computed(() => ({
  backgroundColor: chartBackground.value,
  '--grid-color': gridColor.value
}))

const addColor = () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  chartColors.value.push(randomColor)
  updateChart()
}

const removeColor = (index) => {
  if (chartColors.value.length > 1) {
    chartColors.value.splice(index, 1)
    updateChart()
  }
}

const randomColors = () => {
  chartColors.value = chartColors.value.map(() => 
    `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  )
  updateChart()
}

const updateChart = () => {
  ElMessage.success('图表已更新')
}

const exportAsJSON = () => {
  const config = {
    colors: chartColors.value,
    background: chartBackground.value,
    grid: gridColor.value
  }
  const json = JSON.stringify(config, null, 2)
  navigator.clipboard.writeText(json)
  ElMessage.success('JSON 配置已复制到剪贴板')
}

const exportAsCSS = () => {
  let css = ':root {\n'
  chartColors.value.forEach((color, index) => {
    css += `  --chart-color-${index + 1}: ${color};\n`
  })
  css += `  --chart-background: ${chartBackground.value};\n`
  css += `  --chart-grid: ${gridColor.value};\n`
  css += '}'
  
  navigator.clipboard.writeText(css)
  ElMessage.success('CSS 变量已复制到剪贴板')
}

const exportAsArray = () => {
  const array = `const chartColors = ${JSON.stringify(chartColors.value, null, 2)}`
  navigator.clipboard.writeText(array)
  ElMessage.success('颜色数组已复制到剪贴板')
}
</script>

<style scoped>
.chart-color-config {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.config-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.color-series h4,
.background-config h4 {
  margin: 0 0 16px 0;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.series-colors,
.bg-colors {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-label {
  width: 100px;
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background-color: #f78989;
}

.color-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.chart-preview {
  margin-bottom: 24px;
}

.chart-preview h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.mock-chart {
  border: 1px solid var(--grid-color);
  border-radius: 8px;
  padding: 20px;
  min-height: 300px;
}

.chart-title {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 20px;
}

.chart-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 0 20px;
  border-bottom: 2px solid var(--grid-color);
  border-left: 2px solid var(--grid-color);
}

.chart-bar {
  flex: 1;
  min-height: 20px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.bar-label {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #909399;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-text {
  font-size: 12px;
  color: #606266;
}

.export-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.export-options {
  display: flex;
  gap: 12px;
}

@media (max-width: 768px) {
  .config-panel {
    grid-template-columns: 1fr;
  }
  
  .chart-bars {
    padding: 0 10px;
  }
  
  .chart-legend {
    gap: 12px;
  }
}
</style>
```

## API 文档

### ColorPicker Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string | — |
| disabled | 是否禁用 | boolean | false |
| size | 尺寸 | enum | — |
| show-alpha | 是否支持透明度选择 | boolean | false |
| color-format | 写入 v-model 的颜色的格式 | enum | hex |
| popper-class | ColorPicker 下拉框的类名 | string | — |
| predefine | 预定义颜色 | array | — |
| validate-event | 输入时是否触发表单的校验 | boolean | true |
| tabindex | ColorPicker 的 tabindex | string / number | 0 |
| label | ColorPicker 的 aria-label | string | — |
| id | ColorPicker 的 id | string | — |

### ColorPicker Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 当绑定值变化时触发 | Function |
| active-change | 面板中当前显示的颜色发生改变时触发 | Function |

### ColorPicker Methods

| 名称 | 说明 | 类型 |
|------|------|------|
| focus | 使 ColorPicker 获取焦点 | Function |
| blur | 使 ColorPicker 失去焦点 | Function |

## 实践练习

### 练习1：品牌色彩管理器

创建一个品牌色彩管理系统：

```vue
<template>
  <div class="brand-color-manager">
    <h3>品牌色彩管理器</h3>
    
    <div class="brand-colors">
      <div
        v-for="(brand, index) in brandColors"
        :key="index"
        class="brand-item"
      >
        <div class="brand-header">
          <input
            v-model="brand.name"
            class="brand-name"
            placeholder="品牌名称"
          />
          <button @click="removeBrand(index)" class="remove-brand">删除</button>
        </div>
        
        <div class="color-palette">
          <div
            v-for="(color, colorIndex) in brand.colors"
            :key="colorIndex"
            class="color-slot"
          >
            <el-color-picker
              v-model="brand.colors[colorIndex]"
              :predefine="commonColors"
            />
            <button
              @click="removeColor(index, colorIndex)"
              class="remove-color"
            >
              ×
            </button>
          </div>
          
          <button @click="addColor(index)" class="add-color">+</button>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <el-button @click="addBrand">添加品牌</el-button>
      <el-button type="primary" @click="exportBrands">导出配置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const brandColors = ref([
  {
    name: '主品牌',
    colors: ['#409EFF', '#67C23A', '#E6A23C']
  }
])

const commonColors = [
  '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1',
  '#1e90ff', '#c71585', '#409EFF', '#67C23A', '#E6A23C'
]

const addBrand = () => {
  brandColors.value.push({
    name: `品牌 ${brandColors.value.length + 1}`,
    colors: ['#409EFF']
  })
}

const removeBrand = (index) => {
  brandColors.value.splice(index, 1)
}

const addColor = (brandIndex) => {
  brandColors.value[brandIndex].colors.push('#409EFF')
}

const removeColor = (brandIndex, colorIndex) => {
  if (brandColors.value[brandIndex].colors.length > 1) {
    brandColors.value[brandIndex].colors.splice(colorIndex, 1)
  }
}

const exportBrands = () => {
  const config = JSON.stringify(brandColors.value, null, 2)
  navigator.clipboard.writeText(config)
  ElMessage.success('品牌配置已复制到剪贴板')
}
</script>

<style scoped>
.brand-color-manager {
  max-width: 800px;
  padding: 20px;
}

.brand-colors {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.brand-item {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.brand-name {
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  background: transparent;
  outline: none;
}

.brand-name:focus {
  border-bottom: 1px solid #409EFF;
}

.remove-brand {
  padding: 4px 8px;
  border: 1px solid #f56c6c;
  background: white;
  color: #f56c6c;
  border-radius: 4px;
  cursor: pointer;
}

.color-palette {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.color-slot {
  position: relative;
  display: flex;
  align-items: center;
}

.remove-color {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  border: none;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-color {
  width: 32px;
  height: 32px;
  border: 2px dashed #dcdfe6;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #909399;
  font-size: 18px;
}

.add-color:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
```

### 练习2：渐变色生成器

创建一个渐变色生成器：

```vue
<template>
  <div class="gradient-generator">
    <h3>渐变色生成器</h3>
    
    <div class="gradient-config">
      <div class="color-stops">
        <h4>颜色节点</h4>
        <div class="stops-list">
          <div
            v-for="(stop, index) in colorStops"
            :key="index"
            class="color-stop"
          >
            <el-color-picker v-model="stop.color" @change="updateGradient" />
            <input
              v-model.number="stop.position"
              type="range"
              min="0"
              max="100"
              @input="updateGradient"
              class="position-slider"
            />
            <span class="position-value">{{ stop.position }}%</span>
            <button
              v-if="colorStops.length > 2"
              @click="removeStop(index)"
              class="remove-stop"
            >
              ×
            </button>
          </div>
        </div>
        
        <el-button @click="addStop" size="small">添加节点</el-button>
      </div>
      
      <div class="gradient-direction">
        <h4>渐变方向</h4>
        <div class="direction-options">
          <label v-for="dir in directions" :key="dir.value">
            <input
              v-model="direction"
              type="radio"
              :value="dir.value"
              @change="updateGradient"
            />
            {{ dir.label }}
          </label>
        </div>
      </div>
    </div>
    
    <div class="gradient-preview">
      <h4>预览效果</h4>
      <div class="preview-box" :style="{ background: gradientCSS }">
        <div class="preview-content">
          <h5>渐变预览</h5>
          <p>这是渐变背景效果</p>
        </div>
      </div>
    </div>
    
    <div class="gradient-output">
      <h4>CSS 代码</h4>
      <div class="code-output">
        <pre>{{ gradientCSS }}</pre>
        <el-button @click="copyCSS" size="small" type="primary">复制代码</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const colorStops = ref([
  { color: '#409EFF', position: 0 },
  { color: '#67C23A', position: 100 }
])

const direction = ref('to right')

const directions = [
  { label: '向右', value: 'to right' },
  { label: '向左', value: 'to left' },
  { label: '向下', value: 'to bottom' },
  { label: '向上', value: 'to top' },
  { label: '右下角', value: 'to bottom right' },
  { label: '左下角', value: 'to bottom left' },
  { label: '右上角', value: 'to top right' },
  { label: '左上角', value: 'to top left' }
]

const gradientCSS = computed(() => {
  const stops = colorStops.value
    .sort((a, b) => a.position - b.position)
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ')
  
  return `linear-gradient(${direction.value}, ${stops})`
})

const addStop = () => {
  const newPosition = Math.floor(Math.random() * 100)
  colorStops.value.push({
    color: '#409EFF',
    position: newPosition
  })
  updateGradient()
}

const removeStop = (index) => {
  colorStops.value.splice(index, 1)
  updateGradient()
}

const updateGradient = () => {
  // 触发重新计算
}

const copyCSS = () => {
  navigator.clipboard.writeText(`background: ${gradientCSS.value};`)
  ElMessage.success('CSS 代码已复制到剪贴板')
}
</script>

<style scoped>
.gradient-generator {
  max-width: 800px;
  padding: 20px;
}

.gradient-config {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.color-stops h4,
.gradient-direction h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.color-stop {
  display: flex;
  align-items: center;
  gap: 12px;
}

.position-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e4e7ed;
  outline: none;
  cursor: pointer;
}

.position-value {
  width: 40px;
  text-align: center;
  font-size: 12px;
  color: #909399;
}

.remove-stop {
  width: 20px;
  height: 20px;
  border: none;
  background: #f56c6c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
}

.direction-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.direction-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.preview-box {
  height: 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.preview-content {
  text-align: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.preview-content h5 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.preview-content p {
  margin: 0;
  opacity: 0.9;
}

.code-output {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
}

.code-output pre {
  flex: 1;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #303133;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
```

## 常见问题

### 1. 颜色格式转换

**问题**：需要在不同颜色格式之间转换

**解决方案**：
```javascript
// 颜色格式转换工具函数
const colorUtils = {
  // HEX 转 RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },
  
  // RGB 转 HEX
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },
  
  // HSL 转 RGB
  hslToRgb(h, s, l) {
    h /= 360
    s /= 100
    l /= 100
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    return {
      r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
    }
  }
}
```

### 2. 颜色对比度检查

**问题**：需要检查颜色对比度是否符合无障碍标准

**解决方案**：
```javascript
const checkContrast = (color1, color2) => {
  // 计算相对亮度
  const getLuminance = (color) => {
    const rgb = colorUtils.hexToRgb(color)
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

// 使用示例
const contrastRatio = checkContrast('#ffffff', '#000000')
if (contrastRatio >= 4.5) {
  console.log('符合 WCAG AA 标准')
} else if (contrastRatio >= 3) {
  console.log('符合 WCAG AA 大文本标准')
} else {
  console.log('不符合无障碍标准')
}
```

### 3. 颜色主题生成

**问题**：根据主色生成完整的颜色主题

**解决方案**：
```javascript
const generateTheme = (primaryColor) => {
  const rgb = colorUtils.hexToRgb(primaryColor)
  
  // 生成不同深浅的颜色
  const generateShades = (baseRgb, steps = 9) => {
    const shades = []
    for (let i = 0; i < steps; i++) {
      const factor = (i + 1) / (steps + 1)
      const r = Math.round(baseRgb.r + (255 - baseRgb.r) * (1 - factor))
      const g = Math.round(baseRgb.g + (255 - baseRgb.g) * (1 - factor))
      const b = Math.round(baseRgb.b + (255 - baseRgb.b) * (1 - factor))
      shades.push(colorUtils.rgbToHex(r, g, b))
    }
    return shades
  }
  
  return {
    primary: primaryColor,
    shades: generateShades(rgb),
    success: '#67C23A',
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  }
}
```

## 最佳实践

1. **提供预设颜色**：为常用场景提供预设颜色选项
2. **支持透明度**：在需要时启用透明度选择
3. **颜色格式统一**：在项目中保持颜色格式的一致性
4. **无障碍考虑**：确保颜色对比度符合无障碍标准
5. **性能优化**：避免频繁的颜色变化导致的重渲染
6. **用户体验**：提供颜色预览和实时反馈

## 总结

Color Picker 取色器是一个功能丰富的颜色选择组件，支持：

- 多种颜色格式（HEX、RGB、HSL、HSV）
- 透明度选择
- 预设颜色配置
- 不同尺寸和状态
- 丰富的事件和方法

掌握 Color Picker 组件的使用，能够为用户提供直观、便捷的颜色选择体验，广泛应用于主题配置、图表设计、UI 定制等场景。

## 参考资料

- [Element Plus ColorPicker 官方文档](https://element-plus.org/zh-CN/component/color-picker.html)
- [CSS 颜色规范](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color)
- [WCAG 颜色对比度指南](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [颜色理论基础](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Colors/Color_picker_tool)