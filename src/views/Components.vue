<template>
  <div class="components">
    <div class="page-header">
      <h1>组件展示</h1>
      <p>Element Plus 核心组件演示</p>
    </div>

    <!-- 组件分类 -->
    <el-tabs v-model="activeTab" class="component-tabs">
      <el-tab-pane label="基础组件" name="basic">
        <div class="component-section">
          <h2>按钮 Button</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-button>默认按钮</el-button>
              <el-button type="primary">主要按钮</el-button>
              <el-button type="success">成功按钮</el-button>
              <el-button type="info">信息按钮</el-button>
              <el-button type="warning">警告按钮</el-button>
              <el-button type="danger">危险按钮</el-button>
            </div>
          </el-card>

          <h2>图标 Icon</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-icon :size="20"><Edit /></el-icon>
              <el-icon :size="20"><Share /></el-icon>
              <el-icon :size="20"><Delete /></el-icon>
              <el-icon :size="20"><Search /></el-icon>
              <el-icon :size="20"><Star /></el-icon>
              <el-icon :size="20"><Setting /></el-icon>
            </div>
          </el-card>

          <h2>链接 Link</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-link href="#" type="primary">主要链接</el-link>
              <el-link href="#" type="success">成功链接</el-link>
              <el-link href="#" type="warning">警告链接</el-link>
              <el-link href="#" type="danger">危险链接</el-link>
              <el-link href="#" type="info">信息链接</el-link>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="表单组件" name="form">
        <div class="component-section">
          <h2>输入框 Input</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-input v-model="inputValue" placeholder="请输入内容" style="width: 200px;" />
              <el-input v-model="inputValue" placeholder="请输入内容" disabled style="width: 200px;" />
              <el-input v-model="inputValue" placeholder="请输入内容" clearable style="width: 200px;" />
            </div>
          </el-card>

          <h2>选择器 Select</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-select v-model="selectValue" placeholder="请选择" style="width: 200px;">
                <el-option label="选项1" value="option1" />
                <el-option label="选项2" value="option2" />
                <el-option label="选项3" value="option3" />
              </el-select>
            </div>
          </el-card>

          <h2>开关 Switch</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-switch v-model="switchValue" />
              <el-switch v-model="switchValue" active-text="开启" inactive-text="关闭" />
            </div>
          </el-card>

          <h2>单选框 Radio</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-radio-group v-model="radioValue">
                <el-radio label="1">选项1</el-radio>
                <el-radio label="2">选项2</el-radio>
                <el-radio label="3">选项3</el-radio>
              </el-radio-group>
            </div>
          </el-card>

          <h2>复选框 Checkbox</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-checkbox-group v-model="checkboxValue">
                <el-checkbox label="选项1" />
                <el-checkbox label="选项2" />
                <el-checkbox label="选项3" />
              </el-checkbox-group>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="数据展示" name="data">
        <div class="component-section">
          <h2>表格 Table</h2>
          <el-card class="demo-card">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="name" label="姓名" width="180" />
              <el-table-column prop="age" label="年龄" width="180" />
              <el-table-column prop="address" label="地址" />
            </el-table>
          </el-card>

          <h2>标签 Tag</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-tag>标签一</el-tag>
              <el-tag type="success">标签二</el-tag>
              <el-tag type="info">标签三</el-tag>
              <el-tag type="warning">标签四</el-tag>
              <el-tag type="danger">标签五</el-tag>
            </div>
          </el-card>

          <h2>进度条 Progress</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-progress :percentage="50" />
              <el-progress :percentage="100" type="success" />
              <el-progress :percentage="80" type="warning" />
              <el-progress :percentage="30" type="exception" />
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <el-tab-pane label="反馈组件" name="feedback">
        <div class="component-section">
          <h2>消息提示</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-button @click="showMessage('success')">成功消息</el-button>
              <el-button @click="showMessage('warning')">警告消息</el-button>
              <el-button @click="showMessage('info')">信息消息</el-button>
              <el-button @click="showMessage('error')">错误消息</el-button>
            </div>
          </el-card>

          <h2>通知 Notification</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-button @click="showNotification('success')">成功通知</el-button>
              <el-button @click="showNotification('warning')">警告通知</el-button>
              <el-button @click="showNotification('info')">信息通知</el-button>
              <el-button @click="showNotification('error')">错误通知</el-button>
            </div>
          </el-card>

          <h2>对话框 Dialog</h2>
          <el-card class="demo-card">
            <div class="demo-content">
              <el-button @click="dialogVisible = true">打开对话框</el-button>
              <el-dialog v-model="dialogVisible" title="提示" width="30%">
                <span>这是一段信息</span>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确定</el-button>
                  </span>
                </template>
              </el-dialog>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Edit,
  Share,
  Delete,
  Search,
  Star,
  Setting
} from '@element-plus/icons-vue'

export default {
  name: 'Components',
  components: {
    Edit,
    Share,
    Delete,
    Search,
    Star,
    Setting
  },
  setup() {
    const activeTab = ref('basic')
    const inputValue = ref('')
    const selectValue = ref('')
    const switchValue = ref(false)
    const radioValue = ref('1')
    const checkboxValue = ref(['选项1'])
    const dialogVisible = ref(false)

    const tableData = ref([
      {
        name: '王小虎',
        age: 18,
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        name: '王小虎',
        age: 18,
        address: '上海市普陀区金沙江路 1517 弄'
      },
      {
        name: '王小虎',
        age: 18,
        address: '上海市普陀区金沙江路 1519 弄'
      }
    ])

    const showMessage = (type) => {
      const messages = {
        success: '这是一条成功的提示消息',
        warning: '这是一条警告的提示消息',
        info: '这是一条消息的提示消息',
        error: '这是一条错误的提示消息'
      }
      ElMessage[type](messages[type])
    }

    const showNotification = (type) => {
      const notifications = {
        success: { title: '成功', message: '这是一条成功的通知消息' },
        warning: { title: '警告', message: '这是一条警告的通知消息' },
        info: { title: '消息', message: '这是一条消息的通知消息' },
        error: { title: '错误', message: '这是一条错误的通知消息' }
      }
      ElNotification[type](notifications[type])
    }

    return {
      activeTab,
      inputValue,
      selectValue,
      switchValue,
      radioValue,
      checkboxValue,
      dialogVisible,
      tableData,
      showMessage,
      showNotification
    }
  }
}
</script>

<style scoped>
.components {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1.1rem;
  color: #606266;
}

.component-tabs {
  margin-bottom: 32px;
}

.component-section h2 {
  margin: 32px 0 16px 0;
  color: #303133;
  font-size: 1.5rem;
}

.demo-card {
  margin-bottom: 24px;
}

.demo-content {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.demo-content > * {
  margin-right: 16px;
  margin-bottom: 8px;
}

.demo-content > *:last-child {
  margin-right: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .demo-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .demo-content > * {
    margin-right: 0;
    width: 100%;
  }
}
</style>