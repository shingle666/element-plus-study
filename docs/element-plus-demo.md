# Element Plus 组件演示

本页面展示了如何在 VitePress 文档中直接使用 Element Plus 组件。

## 基础组件

### 按钮组件

<div class="demo-block">
  <div class="demo-title">基础按钮</div>
  <div class="demo-description">使用 type、plain、round 和 circle 来定义按钮的样式。</div>
  <div class="demo-content">
    <el-button>默认按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
  </div>
</div>

<div class="demo-block">
  <div class="demo-title">圆角按钮</div>
  <div class="demo-content">
    <el-button round>圆角按钮</el-button>
    <el-button type="primary" round>主要按钮</el-button>
    <el-button type="success" round>成功按钮</el-button>
    <el-button type="info" round>信息按钮</el-button>
    <el-button type="warning" round>警告按钮</el-button>
    <el-button type="danger" round>危险按钮</el-button>
  </div>
</div>

<div class="demo-block">
  <div class="demo-title">图标按钮</div>
  <div class="demo-content">
    <el-button type="primary" :icon="Search" circle />
    <el-button type="success" :icon="Edit" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </div>
</div>

## 表单组件

### 输入框

<div class="demo-block">
  <div class="demo-title">基础输入框</div>
  <div class="demo-content">
    <el-input v-model="input" placeholder="请输入内容" style="width: 200px;" />
    <br><br>
    <el-input v-model="textarea" type="textarea" placeholder="请输入内容" style="width: 300px;" />
  </div>
</div>

### 选择器

<div class="demo-block">
  <div class="demo-title">基础选择器</div>
  <div class="demo-content">
    <el-select v-model="value" placeholder="请选择" style="width: 200px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</div>

### 开关

<div class="demo-block">
  <div class="demo-title">开关组件</div>
  <div class="demo-content">
    <el-switch v-model="switch1" />
    <br><br>
    <el-switch
      v-model="switch2"
      active-text="开启"
      inactive-text="关闭"
    />
  </div>
</div>

## 数据展示

### 标签

<div class="demo-block">
  <div class="demo-title">基础标签</div>
  <div class="demo-content">
    <el-tag>标签一</el-tag>
    <el-tag type="success">标签二</el-tag>
    <el-tag type="info">标签三</el-tag>
    <el-tag type="warning">标签四</el-tag>
    <el-tag type="danger">标签五</el-tag>
  </div>
</div>

### 进度条

<div class="demo-block">
  <div class="demo-title">进度条</div>
  <div class="demo-content">
    <el-progress :percentage="50" />
    <br>
    <el-progress :percentage="100" :format="format" />
    <br>
    <el-progress :percentage="100" status="success" />
    <br>
    <el-progress :percentage="50" status="exception" />
  </div>
</div>

## 反馈组件

### 消息提示

<div class="demo-block">
  <div class="demo-title">消息提示</div>
  <div class="demo-content">
    <el-button @click="showMessage">显示消息</el-button>
    <el-button @click="showSuccess">成功消息</el-button>
    <el-button @click="showWarning">警告消息</el-button>
    <el-button @click="showError">错误消息</el-button>
  </div>
</div>

### 通知

<div class="demo-block">
  <div class="demo-title">通知</div>
  <div class="demo-content">
    <el-button @click="showNotification">显示通知</el-button>
    <el-button @click="showSuccessNotification">成功通知</el-button>
    <el-button @click="showWarningNotification">警告通知</el-button>
    <el-button @click="showErrorNotification">错误通知</el-button>
  </div>
</div>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { Search, Edit, Message, Star, Delete } from '@element-plus/icons-vue'

const input = ref('')
const textarea = ref('')
const value = ref('')
const switch1 = ref(true)
const switch2 = ref(false)

const options = [
  { value: 'option1', label: '选项1' },
  { value: 'option2', label: '选项2' },
  { value: 'option3', label: '选项3' },
  { value: 'option4', label: '选项4' }
]

const format = (percentage) => {
  return percentage === 100 ? '满' : `${percentage}%`
}

const showMessage = () => {
  ElMessage('这是一条消息提示')
}

const showSuccess = () => {
  ElMessage.success('这是一条成功消息')
}

const showWarning = () => {
  ElMessage.warning('这是一条警告消息')
}

const showError = () => {
  ElMessage.error('这是一条错误消息')
}

const showNotification = () => {
  ElNotification({
    title: '通知',
    message: '这是一条通知消息'
  })
}

const showSuccessNotification = () => {
  ElNotification.success({
    title: '成功',
    message: '这是一条成功通知'
  })
}

const showWarningNotification = () => {
  ElNotification.warning({
    title: '警告',
    message: '这是一条警告通知'
  })
}

const showErrorNotification = () => {
  ElNotification.error({
    title: '错误',
    message: '这是一条错误通知'
  })
}
</script>

<style scoped>
.demo-block {
  margin: 20px 0;
}

.demo-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.demo-description {
  color: #666;
  margin-bottom: 15px;
}

.demo-content {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fafafa;
}
</style>