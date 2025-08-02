# Color Picker

## Overview

The Color Picker is a form component used for color selection, providing multiple color selection methods including color panel selection, HSV adjustment, RGB input, etc. It supports various color formats and offers rich customization options.

## Learning Objectives

- Master the basic concepts and usage scenarios of Color Picker
- Learn how to implement basic color selection functionality
- Understand support for different color formats
- Master the configuration of preset colors and custom colors
- Learn advanced features of the color picker
- Understand the application of color pickers in actual projects
- Master the complete usage of the API

## Basic Usage

### Basic Color Picker

The simplest color picker:

```vue
<template>
  <div>
    <h4>Basic Color Picker</h4>
    <el-color-picker v-model="color1" />
    <p>Selected color: {{ color1 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color1 = ref('#409EFF')
</script>
```

### Alpha Selection

Color picker with transparency selection support:

```vue
<template>
  <div>
    <h4>With Alpha</h4>
    <el-color-picker v-model="color2" show-alpha />
    <p>Selected color: {{ color2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color2 = ref('rgba(64, 158, 255, 0.8)')
</script>
```

### Preset Colors

Provide preset color options:

```vue
<template>
  <div>
    <h4>Preset Colors</h4>
    <el-color-picker
      v-model="color3"
      :predefine="predefineColors"
    />
    <p>Selected color: {{ color3 }}</p>
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

### Different Sizes

Provide color pickers in different sizes:

```vue
<template>
  <div>
    <h4>Different Sizes</h4>
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

## Advanced Features

### Color Formats

Support for multiple color formats:

```vue
<template>
  <div>
    <h4>Different Color Formats</h4>
    
    <div class="format-demo">
      <div class="format-item">
        <label>HEX Format:</label>
        <el-color-picker v-model="hexColor" color-format="hex" />
        <span>{{ hexColor }}</span>
      </div>
      
      <div class="format-item">
        <label>RGB Format:</label>
        <el-color-picker v-model="rgbColor" color-format="rgb" />
        <span>{{ rgbColor }}</span>
      </div>
      
      <div class="format-item">
        <label>HSL Format:</label>
        <el-color-picker v-model="hslColor" color-format="hsl" />
        <span>{{ hslColor }}</span>
      </div>
      
      <div class="format-item">
        <label>HSV Format:</label>
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

### Disabled State

```vue
<template>
  <div>
    <h4>Disabled State</h4>
    <el-color-picker v-model="color5" disabled />
    <p>Disabled color picker</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const color5 = ref('#409EFF')
</script>
```

## Practical Application Examples

### Theme Configurator

Create a theme color configuration component:

```vue
<template>
  <div class="theme-configurator">
    <h3>Theme Configurator</h3>
    
    <div class="config-section">
      <h4>Main Colors</h4>
      <div class="color-configs">
        <div class="color-config">
          <label>Primary Color:</label>
          <el-color-picker
            v-model="themeColors.primary"
            :predefine="primaryPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.primary }}</span>
        </div>
        
        <div class="color-config">
          <label>Success Color:</label>
          <el-color-picker
            v-model="themeColors.success"
            :predefine="successPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.success }}</span>
        </div>
        
        <div class="color-config">
          <label>Warning Color:</label>
          <el-color-picker
            v-model="themeColors.warning"
            :predefine="warningPresets"
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.warning }}</span>
        </div>
        
        <div class="color-config">
          <label>Danger Color:</label>
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
      <h4>Background Colors</h4>
      <div class="color-configs">
        <div class="color-config">
          <label>Page Background:</label>
          <el-color-picker
            v-model="themeColors.background"
            show-alpha
            @change="updateTheme"
          />
          <span class="color-value">{{ themeColors.background }}</span>
        </div>
        
        <div class="color-config">
          <label>Card Background:</label>
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
      <h4>Preview</h4>
      <div class="theme-preview" :style="previewStyles">
        <div class="preview-card">
          <h5>Sample Card</h5>
          <p>This is a sample text content.</p>
          <div class="preview-buttons">
            <button class="btn btn-primary">Primary Button</button>
            <button class="btn btn-success">Success Button</button>
            <button class="btn btn-warning">Warning Button</button>
            <button class="btn btn-danger">Danger Button</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <el-button @click="resetTheme">Reset Theme</el-button>
      <el-button type="primary" @click="exportTheme">Export Config</el-button>
      <el-button type="success" @click="applyTheme">Apply Theme</el-button>
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
  ElMessage.success('Theme updated')
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
  ElMessage.info('Theme reset')
}

const exportTheme = () => {
  const config = JSON.stringify(themeColors.value, null, 2)
  navigator.clipboard.writeText(config)
  ElMessage.success('Theme configuration copied to clipboard')
}

const applyTheme = () => {
  // Logic to apply the theme can be implemented here
  ElMessage.success('Theme applied')
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

### Chart Color Configuration

Create a chart color configuration component:

```vue
<template>
  <div class="chart-color-config">
    <h3>Chart Color Configuration</h3>
    
    <div class="config-panel">
      <div class="color-series">
        <h4>Data Series Colors</h4>
        <div class="series-colors">
          <div
            v-for="(color, index) in chartColors"
            :key="index"
            class="color-item"
          >
            <span class="color-label">Series {{ index + 1 }}:</span>
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
          <el-button @click="addColor" size="small">Add Color</el-button>
          <el-button @click="randomColors" size="small" type="primary">Random Colors</el-button>
        </div>
      </div>
      
      <div class="background-config">
        <h4>Background Configuration</h4>
        <div class="bg-colors">
          <div class="color-item">
            <span class="color-label">Chart Background:</span>
            <el-color-picker
              v-model="chartBackground"
              show-alpha
              @change="updateChart"
            />
          </div>
          
          <div class="color-item">
            <span class="color-label">Grid Color:</span>
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
      <h4>Preview</h4>
      <div class="mock-chart" :style="chartStyles">
        <div class="chart-title">Sample Chart</div>
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
              <span class="legend-text">Data Series {{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="export-section">
      <h4>Export Configuration</h4>
      <div class="export-options">
        <el-button @click="exportAsJSON">Export JSON</el-button>
        <el-button @click="exportAsCSS">Export CSS</el-button>
        <el-button @click="exportAsArray">Export Array</el-button>
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
  ElMessage.success('Chart updated')
}

const exportAsJSON = () => {
  const config = {
    colors: chartColors.value,
    background: chartBackground.value,
    grid: gridColor.value
  }
  const json = JSON.stringify(config, null, 2)
  navigator.clipboard.writeText(json)
  ElMessage.success('JSON configuration copied to clipboard')
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
  ElMessage.success('CSS variables copied to clipboard')
}

const exportAsArray = () => {
  const array = `const chartColors = ${JSON.stringify(chartColors.value, null, 2)}`
  navigator.clipboard.writeText(array)
  ElMessage.success('Color array copied to clipboard')
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

## API Documentation

### ColorPicker Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string | — |
| disabled | whether to disable the ColorPicker | boolean | false |
| size | size of ColorPicker | enum | — |
| show-alpha | whether to display the alpha slider | boolean | false |
| color-format | color format of v-model | enum | hex |
| popper-class | custom class name for ColorPicker's dropdown | string | — |
| predefine | predefined color options | array | — |
| validate-event | whether to trigger form validation | boolean | true |
| tabindex | ColorPicker tabindex | string / number | 0 |
| label | ColorPicker aria-label | string | — |
| id | ColorPicker id | string | — |

### ColorPicker Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when binding value changes | Function |
| active-change | triggers when the current active color changes | Function |

### ColorPicker Methods

| Name | Description | Type |
|------|-------------|------|
| focus | focus the ColorPicker | Function |
| blur | blur the ColorPicker | Function |

## Practical Exercises

### Exercise 1: Brand Color Manager

Create a brand color management system:

```vue
<template>
  <div class="brand-color-manager">
    <h3>Brand Color Manager</h3>
    
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
            placeholder="Brand name"
          />
          <button @click="removeBrand(index)" class="remove-brand">Delete</button>
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
      <el-button @click="addBrand">Add Brand</el-button>
      <el-button type="primary" @click="exportBrands">Export Config</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const brandColors = ref([
  {
    name: 'Main Brand',
    colors: ['#409EFF', '#67C23A', '#E6A23C']
  }
])

const commonColors = [
  '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1',
  '#1e90ff', '#c71585', '#409EFF', '#67C23A', '#E6A23C'
]

const addBrand = () => {
  brandColors.value.push({
    name: `Brand ${brandColors.value.length + 1}`,
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
  ElMessage.success('Brand configuration copied to clipboard')
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

### Exercise 2: Gradient Generator

Create a gradient color generator:

```vue
<template>
  <div class="gradient-generator">
    <h3>Gradient Generator</h3>
    
    <div class="gradient-config">
      <div class="color-stops">
        <h4>Color Stops</h4>
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
        
        <el-button @click="addStop" size="small">Add Stop</el-button>
      </div>
      
      <div class="gradient-direction">
        <h4>Gradient Direction</h4>
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
      <h4>Preview</h4>
      <div class="preview-box" :style="{ background: gradientCSS }">
        <div class="preview-content">
          <h5>Gradient Preview</h5>
          <p>This is a gradient background effect</p>
        </div>
      </div>
    </div>
    
    <div class="gradient-output">
      <h4>CSS Code</h4>
      <div class="code-output">
        <pre>{{ gradientCSS }}</pre>
        <el-button @click="copyCSS" size="small" type="primary">Copy Code</el-button>
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
  { label: 'To Right', value: 'to right' },
  { label: 'To Left', value: 'to left' },
  { label: 'To Bottom', value: 'to bottom' },
  { label: 'To Top', value: 'to top' },
  { label: 'To Bottom Right', value: 'to bottom right' },
  { label: 'To Bottom Left', value: 'to bottom left' },
  { label: 'To Top Right', value: 'to top right' },
  { label: 'To Top Left', value: 'to top left' }
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
  // Trigger recalculation
}

const copyCSS = () => {
  navigator.clipboard.writeText(`background: ${gradientCSS.value};`)
  ElMessage.success('CSS code copied to clipboard')
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

## Common Issues

### 1. Color Format Conversion

**Problem**: Need to convert between different color formats

**Solution**:
```javascript
// Color format conversion utility functions
const colorUtils = {
  // HEX to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },
  
  // RGB to HEX
  rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },
  
  // HSL to RGB
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

### 2. Color Contrast Check

**Problem**: Need to check if color contrast meets accessibility standards

**Solution**:
```javascript
const checkContrast = (color1, color2) => {
  // Calculate relative luminance
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

// Usage example
const contrastRatio = checkContrast('#ffffff', '#000000')
if (contrastRatio >= 4.5) {
  console.log('Meets WCAG AA standard')
} else if (contrastRatio >= 3) {
  console.log('Meets WCAG AA standard for large text')
} else {
  console.log('Does not meet accessibility standards')
}
```

### 3. Color Theme Generation

**Problem**: Generate a complete color theme based on a primary color

**Solution**:
```javascript
const generateTheme = (primaryColor) => {
  const rgb = colorUtils.hexToRgb(primaryColor)
  
  // Generate different shades of colors
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

## Best Practices

1. **Provide Preset Colors**: Offer preset color options for common scenarios
2. **Support Transparency**: Enable transparency selection when needed
3. **Color Format Consistency**: Maintain consistency of color formats throughout the project
4. **Accessibility Considerations**: Ensure color contrast meets accessibility standards
5. **Performance Optimization**: Avoid frequent color changes that cause re-rendering
6. **User Experience**: Provide color previews and real-time feedback

## Summary

The Color Picker is a feature-rich color selection component that supports:

- Multiple color formats (HEX, RGB, HSL, HSV)
- Transparency selection
- Preset color configuration
- Different sizes and states
- Rich events and methods

Mastering the use of the Color Picker component can provide users with an intuitive and convenient color selection experience, widely used in theme configuration, chart design, UI customization, and other scenarios.

## References

- [Element Plus ColorPicker Official Documentation](https://element-plus.org/en-US/component/color-picker.html)
- [CSS Color Specification](https://developer.mozilla.org/en-US/docs/Web/CSS/color)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Theory Basics](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool)
