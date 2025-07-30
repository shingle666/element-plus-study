# Progress 进度条

## 概述
Progress 进度条组件用于展示操作进度，告知用户当前处理进度，并预估剩余时间。Element Plus 的 Progress 组件支持多种样式、动画效果和自定义配置，适用于文件上传、数据加载、任务处理等场景。

## 学习目标
- 掌握 Progress 组件的基础用法
- 理解不同类型和样式的进度条
- 学会使用环形进度条和仪表盘进度条
- 掌握进度条的动画和自定义配置
- 了解进度条在实际项目中的应用

## 基础用法

### 线形进度条
最基础的进度条，通过 `percentage` 属性设置进度：

```vue
<template>
  <div class="progress-demo">
    <el-progress :percentage="50" />
    <el-progress :percentage="100" :format="format" />
    <el-progress :percentage="100" status="success" />
    <el-progress :percentage="100" status="warning" />
    <el-progress :percentage="50" status="exception" />
  </div>
</template>

<script setup>
const format = (percentage) => {
  return percentage === 100 ? '满' : `${percentage}%`
}
</script>

<style>
.progress-demo .el-progress {
  margin-bottom: 15px;
}
</style>
```

### 百分比内显
通过 `text-inside` 属性可以将进度条描述置于进度条内部：

```vue
<template>
  <div class="progress-demo">
    <el-progress :percentage="70" :text-inside="true" :stroke-width="26" />
    <el-progress :percentage="100" :text-inside="true" :stroke-width="24" status="success" />
    <el-progress :percentage="80" :text-inside="true" :stroke-width="22" status="warning" />
    <el-progress :percentage="50" :text-inside="true" :stroke-width="20" status="exception" />
  </div>
</template>
```

### 自定义颜色
通过 `color` 属性设置进度条的颜色，支持字符串、函数和数组：

```vue
<template>
  <div class="progress-demo">
    <!-- 字符串颜色 -->
    <el-progress :percentage="percentage" color="#8e71c7" />
    
    <!-- 函数颜色 -->
    <el-progress :percentage="percentage" :color="customColorMethod" />
    
    <!-- 数组颜色（渐变） -->
    <el-progress :percentage="percentage" :color="customColors" />
    
    <div class="demo-progress-controls">
      <el-button-group>
        <el-button icon="Minus" @click="decrease" />
        <el-button icon="Plus" @click="increase" />
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref(20)

const customColorMethod = (percentage) => {
  if (percentage < 30) {
    return '#909399'
  } else if (percentage < 70) {
    return '#e6a23c'
  } else {
    return '#67c23a'
  }
}

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}

const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>
```

## 环形进度条

### 基础环形进度条
通过 `type="circle"` 设置环形进度条：

```vue
<template>
  <div class="circle-progress-demo">
    <el-progress type="circle" :percentage="0" />
    <el-progress type="circle" :percentage="25" />
    <el-progress type="circle" :percentage="100" status="success" />
    <el-progress type="circle" :percentage="70" status="warning" />
    <el-progress type="circle" :percentage="50" status="exception" />
  </div>
</template>

<style>
.circle-progress-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
```

### 自定义尺寸的环形进度条
通过 `width` 属性设置环形进度条的尺寸：

```vue
<template>
  <div class="circle-progress-demo">
    <el-progress type="circle" :percentage="percentage" :width="80" />
    <el-progress type="circle" :percentage="percentage" :width="120" />
    <el-progress type="circle" :percentage="percentage" :width="140" />
    
    <div class="demo-progress-controls">
      <el-button-group>
        <el-button icon="Minus" @click="decrease" />
        <el-button icon="Plus" @click="increase" />
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref(50)

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}

const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>
```

## 仪表盘进度条

### 仪表盘样式
通过 `type="dashboard"` 设置仪表盘进度条：

```vue
<template>
  <div class="dashboard-progress-demo">
    <el-progress type="dashboard" :percentage="percentage" :color="colors" />
    
    <div class="demo-progress-controls">
      <el-button-group>
        <el-button icon="Minus" @click="decrease" />
        <el-button icon="Plus" @click="increase" />
      </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

const percentage = ref(80)

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}

const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
</script>
```

## 动画进度条

### 动态进度条
结合定时器实现动态进度条效果：

```vue
<template>
  <div class="animated-progress-demo">
    <h4>自动进度条</h4>
    <el-progress :percentage="autoPercentage" :color="autoColors" />
    
    <h4>加载进度条</h4>
    <el-progress 
      :percentage="loadingPercentage" 
      :text-inside="true" 
      :stroke-width="20"
      status="success"
    />
    
    <h4>环形动画进度条</h4>
    <el-progress 
      type="circle" 
      :percentage="circlePercentage" 
      :color="circleColors"
      :width="120"
    />
    
    <div class="demo-progress-controls">
      <el-button @click="startAnimation">开始动画</el-button>
      <el-button @click="stopAnimation">停止动画</el-button>
      <el-button @click="resetAnimation">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const autoPercentage = ref(0)
const loadingPercentage = ref(0)
const circlePercentage = ref(0)

let timer = null

const autoColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

const circleColors = [
  { color: '#909399', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#67c23a', percentage: 60 },
  { color: '#409eff', percentage: 80 },
  { color: '#67c23a', percentage: 100 }
]

const startAnimation = () => {
  if (timer) clearInterval(timer)
  
  timer = setInterval(() => {
    autoPercentage.value += 1
    loadingPercentage.value += 2
    circlePercentage.value += 1.5
    
    if (autoPercentage.value >= 100) {
      autoPercentage.value = 100
    }
    if (loadingPercentage.value >= 100) {
      loadingPercentage.value = 100
    }
    if (circlePercentage.value >= 100) {
      circlePercentage.value = 100
      clearInterval(timer)
      timer = null
    }
  }, 50)
}

const stopAnimation = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const resetAnimation = () => {
  stopAnimation()
  autoPercentage.value = 0
  loadingPercentage.value = 0
  circlePercentage.value = 0
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style>
.animated-progress-demo .el-progress {
  margin-bottom: 15px;
}

.animated-progress-demo .demo-progress-controls {
  margin-top: 20px;
}

.animated-progress-demo .demo-progress-controls .el-button {
  margin-right: 10px;
}
</style>
```

## 实际应用示例

### 文件上传进度管理器
一个完整的文件上传进度管理示例：

```vue
<template>
  <div class="file-upload-manager">
    <div class="upload-area">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        action="#"
        multiple
        :auto-upload="false"
        :on-change="handleFileChange"
        :file-list="fileList"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 jpg/png/gif/pdf 文件，且不超过 500kb
          </div>
        </template>
      </el-upload>
      
      <div class="upload-actions">
        <el-button type="primary" @click="startUpload" :disabled="!fileList.length || uploading">
          开始上传
        </el-button>
        <el-button @click="clearFiles" :disabled="uploading">
          清空文件
        </el-button>
        <el-button @click="pauseUpload" v-if="uploading">
          暂停上传
        </el-button>
      </div>
    </div>
    
    <!-- 上传进度列表 -->
    <div class="upload-progress-list" v-if="fileList.length">
      <h4>上传进度</h4>
      
      <!-- 总体进度 -->
      <div class="overall-progress">
        <h5>总体进度</h5>
        <el-progress 
          :percentage="overallProgress" 
          :color="overallProgressColor"
          :text-inside="true"
          :stroke-width="20"
        />
        <div class="progress-info">
          <span>已完成: {{ completedFiles }}/{{ fileList.length }}</span>
          <span>总大小: {{ formatFileSize(totalSize) }}</span>
          <span>已上传: {{ formatFileSize(uploadedSize) }}</span>
        </div>
      </div>
      
      <!-- 单个文件进度 -->
      <div class="file-progress-list">
        <div 
          v-for="file in fileList" 
          :key="file.uid" 
          class="file-progress-item"
        >
          <div class="file-info">
            <div class="file-name">
              <el-icon><Document /></el-icon>
              {{ file.name }}
            </div>
            <div class="file-size">{{ formatFileSize(file.size) }}</div>
            <div class="file-status">
              <el-tag 
                :type="getFileStatusType(file.status)"
                size="small"
              >
                {{ getFileStatusText(file.status) }}
              </el-tag>
            </div>
          </div>
          
          <div class="file-progress">
            <el-progress 
              :percentage="file.progress || 0"
              :color="getFileProgressColor(file.status)"
              :status="file.status === 'error' ? 'exception' : 
                       file.status === 'success' ? 'success' : null"
            />
          </div>
          
          <div class="file-actions">
            <el-button 
              v-if="file.status === 'ready' || file.status === 'uploading'"
              size="small" 
              @click="cancelFile(file)"
            >
              取消
            </el-button>
            <el-button 
              v-if="file.status === 'error'"
              size="small" 
              type="primary"
              @click="retryFile(file)"
            >
              重试
            </el-button>
            <el-button 
              v-if="file.status === 'success'"
              size="small" 
              type="success"
              @click="previewFile(file)"
            >
              预览
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 上传统计 -->
    <div class="upload-statistics" v-if="fileList.length">
      <h4>上传统计</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ fileList.length }}</div>
          <div class="stat-label">总文件数</div>
          <el-progress type="circle" :percentage="100" :width="60" color="#409eff" />
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ completedFiles }}</div>
          <div class="stat-label">已完成</div>
          <el-progress 
            type="circle" 
            :percentage="completedFiles / fileList.length * 100" 
            :width="60" 
            color="#67c23a" 
          />
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ errorFiles }}</div>
          <div class="stat-label">失败文件</div>
          <el-progress 
            type="circle" 
            :percentage="errorFiles / fileList.length * 100" 
            :width="60" 
            color="#f56c6c" 
          />
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ uploadSpeed }}</div>
          <div class="stat-label">上传速度</div>
          <el-progress 
            type="dashboard" 
            :percentage="Math.min(uploadSpeed / 10, 100)" 
            :width="80" 
            :color="speedColors"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document } from '@element-plus/icons-vue'

const uploadRef = ref()
const fileList = ref([])
const uploading = ref(false)
const uploadSpeed = ref(0)

let uploadTimer = null
let speedTimer = null
let lastUploadedSize = 0

const totalSize = computed(() => {
  return fileList.value.reduce((total, file) => total + file.size, 0)
})

const uploadedSize = computed(() => {
  return fileList.value.reduce((total, file) => {
    return total + (file.size * (file.progress || 0) / 100)
  }, 0)
})

const overallProgress = computed(() => {
  if (!fileList.value.length) return 0
  return Math.round(uploadedSize.value / totalSize.value * 100)
})

const completedFiles = computed(() => {
  return fileList.value.filter(file => file.status === 'success').length
})

const errorFiles = computed(() => {
  return fileList.value.filter(file => file.status === 'error').length
})

const overallProgressColor = computed(() => {
  const progress = overallProgress.value
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
})

const speedColors = [
  { color: '#909399', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#67c23a', percentage: 60 },
  { color: '#409eff', percentage: 80 },
  { color: '#67c23a', percentage: 100 }
]

const handleFileChange = (file, files) => {
  file.status = 'ready'
  file.progress = 0
  fileList.value = files
}

const startUpload = () => {
  uploading.value = true
  lastUploadedSize = 0
  
  // 开始计算上传速度
  speedTimer = setInterval(() => {
    const currentUploadedSize = uploadedSize.value
    uploadSpeed.value = Math.round((currentUploadedSize - lastUploadedSize) / 1024) // KB/s
    lastUploadedSize = currentUploadedSize
  }, 1000)
  
  // 模拟上传过程
  fileList.value.forEach((file, index) => {
    if (file.status === 'ready') {
      uploadFile(file, index)
    }
  })
}

const uploadFile = (file, index) => {
  file.status = 'uploading'
  
  const uploadInterval = setInterval(() => {
    if (!uploading.value) {
      clearInterval(uploadInterval)
      return
    }
    
    file.progress += Math.random() * 10
    
    if (file.progress >= 100) {
      file.progress = 100
      file.status = Math.random() > 0.1 ? 'success' : 'error' // 90% 成功率
      clearInterval(uploadInterval)
      
      // 检查是否所有文件都已完成
      const allCompleted = fileList.value.every(f => 
        f.status === 'success' || f.status === 'error'
      )
      
      if (allCompleted) {
        uploading.value = false
        if (speedTimer) {
          clearInterval(speedTimer)
          speedTimer = null
        }
        ElMessage.success('所有文件上传完成')
      }
    }
  }, 100 + Math.random() * 200) // 随机上传速度
}

const pauseUpload = () => {
  uploading.value = false
  if (speedTimer) {
    clearInterval(speedTimer)
    speedTimer = null
  }
  ElMessage.info('上传已暂停')
}

const clearFiles = () => {
  fileList.value = []
  uploadRef.value.clearFiles()
}

const cancelFile = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

const retryFile = (file) => {
  file.status = 'ready'
  file.progress = 0
  uploadFile(file)
}

const previewFile = (file) => {
  ElMessage.info(`预览文件: ${file.name}`)
}

const formatFileSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / (1024 * 1024)).toFixed(1) + ' MB'
}

const getFileStatusType = (status) => {
  switch (status) {
    case 'ready': return 'info'
    case 'uploading': return 'primary'
    case 'success': return 'success'
    case 'error': return 'danger'
    default: return 'info'
  }
}

const getFileStatusText = (status) => {
  switch (status) {
    case 'ready': return '等待上传'
    case 'uploading': return '上传中'
    case 'success': return '上传成功'
    case 'error': return '上传失败'
    default: return '未知状态'
  }
}

const getFileProgressColor = (status) => {
  switch (status) {
    case 'uploading': return '#409eff'
    case 'success': return '#67c23a'
    case 'error': return '#f56c6c'
    default: return '#909399'
  }
}

onUnmounted(() => {
  if (uploadTimer) clearInterval(uploadTimer)
  if (speedTimer) clearInterval(speedTimer)
})
</script>

<style scoped>
.file-upload-manager {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.upload-area {
  margin-bottom: 30px;
}

.upload-actions {
  margin-top: 15px;
  text-align: center;
}

.upload-actions .el-button {
  margin: 0 5px;
}

.upload-progress-list {
  margin-bottom: 30px;
}

.overall-progress {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}

.file-progress-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.file-info {
  flex: 0 0 300px;
  margin-right: 15px;
}

.file-name {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 5px;
}

.file-name .el-icon {
  margin-right: 5px;
}

.file-size {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.file-progress {
  flex: 1;
  margin-right: 15px;
}

.file-actions {
  flex: 0 0 auto;
}

.upload-statistics {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.stat-card {
  text-align: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
}
</style>
```