# Tour 漫游式引导

## 学习目标

通过本章学习，你将掌握：
- Tour 漫游式引导组件的基本概念和使用场景
- 引导步骤的配置和管理
- 自定义引导内容和样式
- 引导遮罩和位置控制
- 引导事件处理和交互
- 条件引导显示和动态控制
- 实际项目中的应用场景和最佳实践

## 基础用法

Tour 组件用于分步引导用户了解产品功能，常用于新手引导、功能介绍等场景。

```vue
<template>
  <div class="tour-basic-demo">
    <div class="demo-header">
      <h3>基础引导示例</h3>
      <el-button type="primary" @click="startTour">开始引导</el-button>
    </div>
    
    <div class="demo-content">
      <div class="feature-area">
        <el-card id="feature-1" class="feature-card">
          <template #header>
            <span>功能一：数据统计</span>
          </template>
          <div class="feature-content">
            <el-statistic title="今日访问" :value="1234" />
            <el-statistic title="总用户数" :value="56789" />
          </div>
        </el-card>
        
        <el-card id="feature-2" class="feature-card">
          <template #header>
            <span>功能二：快速操作</span>
          </template>
          <div class="feature-content">
            <el-button type="primary" id="action-btn">新建项目</el-button>
            <el-button type="success">导入数据</el-button>
            <el-button type="warning">导出报告</el-button>
          </div>
        </el-card>
        
        <el-card id="feature-3" class="feature-card">
          <template #header>
            <span>功能三：设置中心</span>
          </template>
          <div class="feature-content">
            <el-switch v-model="settings.notifications" />
            <span>消息通知</span>
            <br>
            <el-switch v-model="settings.darkMode" />
            <span>暗黑模式</span>
          </div>
        </el-card>
      </div>
    </div>
    
    <el-tour
      v-model="tourOpen"
      :steps="tourSteps"
      @close="onTourClose"
      @finish="onTourFinish"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const tourOpen = ref(false)
const settings = ref({
  notifications: true,
  darkMode: false
})

const tourSteps = [
  {
    target: '#feature-1',
    title: '数据统计',
    description: '这里显示了系统的核心数据统计信息，包括访问量、用户数等关键指标。'
  },
  {
    target: '#feature-2',
    title: '快速操作',
    description: '通过这些按钮可以快速执行常用操作，提高工作效率。'
  },
  {
    target: '#action-btn',
    title: '新建项目',
    description: '点击此按钮可以创建新的项目，开始您的工作流程。',
    placement: 'bottom'
  },
  {
    target: '#feature-3',
    title: '个性化设置',
    description: '在这里可以调整系统设置，个性化您的使用体验。',
    placement: 'left'
  }
]

const startTour = () => {
  tourOpen.value = true
}

const onTourClose = () => {
  ElMessage.info('引导已关闭')
}

const onTourFinish = () => {
  ElMessage.success('引导完成！欢迎使用我们的产品')
}
</script>

<style scoped>
.tour-basic-demo {
  padding: 20px;
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.demo-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.feature-area {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  min-height: 150px;
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: flex-start;
}

.feature-content span {
  margin-left: 10px;
  color: var(--el-text-color-regular);
}
</style>
```

## 自定义引导内容

可以通过插槽自定义引导步骤的内容，包括标题、描述和操作按钮。

```vue
<template>
  <div class="custom-tour-demo">
    <div class="demo-toolbar">
      <h3>自定义引导内容</h3>
      <div class="toolbar-actions">
        <el-button @click="startCustomTour">开始自定义引导</el-button>
        <el-button @click="startInteractiveTour" type="success">交互式引导</el-button>
      </div>
    </div>
    
    <div class="workspace">
      <div class="sidebar" id="sidebar">
        <h4>导航菜单</h4>
        <el-menu default-active="1">
          <el-menu-item index="1" id="menu-dashboard">
            <el-icon><House /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="2" id="menu-projects">
            <el-icon><Folder /></el-icon>
            <span>项目管理</span>
          </el-menu-item>
          <el-menu-item index="3" id="menu-users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <div class="main-content">
        <div class="content-header" id="content-header">
          <h2>欢迎使用管理系统</h2>
          <div class="header-actions">
            <el-button id="search-btn" circle>
              <el-icon><Search /></el-icon>
            </el-button>
            <el-button id="notification-btn" circle>
              <el-icon><Bell /></el-icon>
            </el-button>
            <el-avatar id="user-avatar" :size="32">U</el-avatar>
          </div>
        </div>
        
        <div class="content-body" id="content-body">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card id="card-1">
                <el-statistic title="项目总数" :value="42" />
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card id="card-2">
                <el-statistic title="活跃用户" :value="1205" />
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card id="card-3">
                <el-statistic title="今日收入" :value="8926" prefix="¥" />
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    
    <!-- 自定义内容引导 -->
    <el-tour
      v-model="customTourOpen"
      :steps="customTourSteps"
      @close="onCustomTourClose"
    >
      <template #default="{ current, total }">
        <div class="custom-tour-content">
          <div class="tour-progress">
            <span>步骤 {{ current + 1 }} / {{ total }}</span>
            <el-progress :percentage="((current + 1) / total) * 100" :show-text="false" />
          </div>
        </div>
      </template>
    </el-tour>
    
    <!-- 交互式引导 -->
    <el-tour
      v-model="interactiveTourOpen"
      :steps="interactiveTourSteps"
      @close="onInteractiveTourClose"
      @change="onTourStepChange"
    >
      <template #default="{ current, total, step }">
        <div class="interactive-tour-content">
          <div class="tour-header">
            <h4>{{ step.title }}</h4>
            <el-tag size="small">{{ current + 1 }}/{{ total }}</el-tag>
          </div>
          <div class="tour-body">
            <p>{{ step.description }}</p>
            <div v-if="step.interactive" class="interactive-section">
              <p class="interactive-tip">{{ step.interactive.tip }}</p>
              <el-button 
                v-if="step.interactive.action"
                size="small" 
                type="primary"
                @click="handleInteractiveAction(step.interactive.action)"
              >
                {{ step.interactive.actionText }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-tour>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { House, Folder, User, Search, Bell } from '@element-plus/icons-vue'

const customTourOpen = ref(false)
const interactiveTourOpen = ref(false)
const currentStep = ref(0)

const customTourSteps = [
  {
    target: '#sidebar',
    title: '导航菜单',
    description: '左侧导航菜单包含了系统的主要功能模块，点击可以切换不同的页面。',
    placement: 'right'
  },
  {
    target: '#content-header',
    title: '页面头部',
    description: '页面头部显示当前页面标题和常用操作按钮。',
    placement: 'bottom'
  },
  {
    target: '#content-body',
    title: '主要内容区',
    description: '这里显示页面的主要内容，包括数据统计、表格、表单等。',
    placement: 'top'
  }
]

const interactiveTourSteps = [
  {
    target: '#menu-dashboard',
    title: '仪表盘',
    description: '仪表盘提供了系统的整体概览和关键指标。',
    placement: 'right',
    interactive: {
      tip: '点击下方按钮体验仪表盘功能',
      action: 'dashboard',
      actionText: '进入仪表盘'
    }
  },
  {
    target: '#search-btn',
    title: '搜索功能',
    description: '使用搜索功能可以快速找到您需要的内容。',
    placement: 'bottom',
    interactive: {
      tip: '尝试点击搜索按钮',
      action: 'search',
      actionText: '打开搜索'
    }
  },
  {
    target: '#notification-btn',
    title: '消息通知',
    description: '这里会显示系统通知和重要消息。',
    placement: 'bottom',
    interactive: {
      tip: '查看您的通知消息',
      action: 'notification',
      actionText: '查看通知'
    }
  },
  {
    target: '#card-1',
    title: '数据统计',
    description: '统计卡片展示了关键业务数据，帮助您了解系统状态。',
    placement: 'top'
  }
]

const startCustomTour = () => {
  customTourOpen.value = true
}

const startInteractiveTour = () => {
  interactiveTourOpen.value = true
  currentStep.value = 0
}

const onCustomTourClose = () => {
  ElMessage.info('自定义引导已关闭')
}

const onInteractiveTourClose = () => {
  ElMessage.info('交互式引导已关闭')
}

const onTourStepChange = (current) => {
  currentStep.value = current
}

const handleInteractiveAction = (action) => {
  switch (action) {
    case 'dashboard':
      ElMessage.success('已切换到仪表盘')
      break
    case 'search':
      ElMessage.info('搜索功能已打开')
      break
    case 'notification':
      ElMessage.info('通知面板已打开')
      break
    default:
      ElMessage.info('执行操作：' + action)
  }
}
</script>

<style scoped>
.custom-tour-demo {
  padding: 20px;
}

.demo-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.demo-toolbar h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.toolbar-actions {
  display: flex;
  gap: 10px;
}

.workspace {
  display: flex;
  min-height: 500px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: var(--el-fill-color-extra-light);
  padding: 20px;
  border-right: 1px solid var(--el-border-color);
}

.sidebar h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid var(--el-border-color);
}

.content-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content-body {
  flex: 1;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
}

.custom-tour-content {
  padding: 10px 0;
}

.tour-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tour-progress span {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.interactive-tour-content {
  max-width: 300px;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tour-header h4 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.tour-body p {
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: var(--el-text-color-regular);
}

.interactive-section {
  padding: 10px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
  margin-top: 10px;
}

.interactive-tip {
  font-size: 12px;
  color: var(--el-color-primary);
  margin-bottom: 8px !important;
}
</style>
```

## 引导遮罩和位置控制

通过配置遮罩样式和位置参数来优化引导体验。

```vue
<template>
  <div class="mask-position-demo">
    <div class="demo-controls">
      <h3>遮罩和位置控制</h3>
      <div class="control-panel">
        <div class="control-group">
          <label>遮罩类型:</label>
          <el-radio-group v-model="maskConfig.type">
            <el-radio value="default">默认</el-radio>
            <el-radio value="hollow">镂空</el-radio>
            <el-radio value="none">无遮罩</el-radio>
          </el-radio-group>
        </div>
        
        <div class="control-group">
          <label>遮罩颜色:</label>
          <el-color-picker v-model="maskConfig.color" />
        </div>
        
        <div class="control-group">
          <label>默认位置:</label>
          <el-select v-model="defaultPlacement">
            <el-option label="上方" value="top" />
            <el-option label="下方" value="bottom" />
            <el-option label="左侧" value="left" />
            <el-option label="右侧" value="right" />
            <el-option label="上左" value="top-start" />
            <el-option label="上右" value="top-end" />
            <el-option label="下左" value="bottom-start" />
            <el-option label="下右" value="bottom-end" />
          </el-select>
        </div>
        
        <el-button type="primary" @click="startMaskTour">开始引导</el-button>
      </div>
    </div>
    
    <div class="demo-layout">
      <div class="layout-header" id="header">
        <div class="logo" id="logo">LOGO</div>
        <div class="nav" id="nav">
          <span>首页</span>
          <span>产品</span>
          <span>服务</span>
          <span>关于</span>
        </div>
        <div class="user-area" id="user-area">
          <el-button size="small" id="login-btn">登录</el-button>
        </div>
      </div>
      
      <div class="layout-content">
        <div class="content-left" id="content-left">
          <h4>侧边栏</h4>
          <ul>
            <li id="menu-item-1">菜单项 1</li>
            <li id="menu-item-2">菜单项 2</li>
            <li id="menu-item-3">菜单项 3</li>
          </ul>
        </div>
        
        <div class="content-main" id="content-main">
          <div class="main-header" id="main-header">
            <h2>主要内容区域</h2>
            <div class="action-buttons">
              <el-button id="btn-1" type="primary">按钮1</el-button>
              <el-button id="btn-2" type="success">按钮2</el-button>
              <el-button id="btn-3" type="warning">按钮3</el-button>
            </div>
          </div>
          
          <div class="main-body" id="main-body">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="demo-box" id="box-1">区域1</div>
              </el-col>
              <el-col :span="6">
                <div class="demo-box" id="box-2">区域2</div>
              </el-col>
              <el-col :span="6">
                <div class="demo-box" id="box-3">区域3</div>
              </el-col>
              <el-col :span="6">
                <div class="demo-box" id="box-4">区域4</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    
    <el-tour
      v-model="maskTourOpen"
      :steps="maskTourSteps"
      :mask="maskConfig"
      @close="onMaskTourClose"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const maskTourOpen = ref(false)
const defaultPlacement = ref('bottom')
const maskConfig = ref({
  type: 'default',
  color: 'rgba(0, 0, 0, 0.5)'
})

const maskTourSteps = computed(() => [
  {
    target: '#logo',
    title: '网站标识',
    description: '这是网站的Logo，点击可以返回首页。',
    placement: defaultPlacement.value
  },
  {
    target: '#nav',
    title: '主导航',
    description: '主导航菜单，包含网站的主要功能入口。',
    placement: 'bottom'
  },
  {
    target: '#login-btn',
    title: '用户登录',
    description: '点击此按钮进行用户登录或注册。',
    placement: 'bottom-end'
  },
  {
    target: '#content-left',
    title: '侧边菜单',
    description: '左侧菜单提供了详细的功能分类。',
    placement: 'right'
  },
  {
    target: '#main-header',
    title: '操作区域',
    description: '这里包含了页面的主要操作按钮。',
    placement: 'bottom'
  },
  {
    target: '#box-1',
    title: '功能区域1',
    description: '这是第一个功能区域，展示相关内容。',
    placement: 'top-start'
  },
  {
    target: '#box-4',
    title: '功能区域4',
    description: '这是最后一个功能区域，完成引导流程。',
    placement: 'top-end'
  }
])

const startMaskTour = () => {
  maskTourOpen.value = true
}

const onMaskTourClose = () => {
  ElMessage.info('遮罩引导已关闭')
}
</script>

<style scoped>
.mask-position-demo {
  padding: 20px;
}

.demo-controls {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

.demo-controls h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.control-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.demo-layout {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  min-height: 400px;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background: var(--el-color-primary);
  color: white;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav span {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav span:hover {
  background: rgba(255, 255, 255, 0.1);
}

.layout-content {
  display: flex;
  min-height: 340px;
}

.content-left {
  width: 200px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-right: 1px solid var(--el-border-color);
}

.content-left h4 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.content-left ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.content-left li {
  padding: 8px 12px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.content-left li:hover {
  background: var(--el-color-primary-light-9);
}

.content-main {
  flex: 1;
  padding: 20px;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--el-border-color);
}

.main-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.demo-box {
  height: 100px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
```

## 条件引导显示

根据用户状态、权限或其他条件动态显示引导内容。

```vue
<template>
  <div class="conditional-tour-demo">
    <div class="user-simulation">
      <h3>用户状态模拟</h3>
      <div class="user-controls">
        <div class="control-item">
          <label>用户类型:</label>
          <el-select v-model="userState.type" @change="updateTourSteps">
            <el-option label="新用户" value="new" />
            <el-option label="普通用户" value="normal" />
            <el-option label="VIP用户" value="vip" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </div>
        
        <div class="control-item">
          <label>是否首次访问:</label>
          <el-switch v-model="userState.isFirstVisit" @change="updateTourSteps" />
        </div>
        
        <div class="control-item">
          <label>功能权限:</label>
          <el-checkbox-group v-model="userState.permissions" @change="updateTourSteps">
            <el-checkbox value="read">查看</el-checkbox>
            <el-checkbox value="write">编辑</el-checkbox>
            <el-checkbox value="admin">管理</el-checkbox>
          </el-checkbox-group>
        </div>
        
        <el-button type="primary" @click="startConditionalTour">开始条件引导</el-button>
      </div>
    </div>
    
    <div class="feature-showcase">
      <div class="feature-grid">
        <div class="feature-item" id="basic-feature">
          <h4>基础功能</h4>
          <p>所有用户都可以使用的基础功能</p>
          <el-button size="small">使用功能</el-button>
        </div>
        
        <div class="feature-item" id="advanced-feature" :class="{ disabled: !hasPermission('write') }">
          <h4>高级功能</h4>
          <p>需要编辑权限的高级功能</p>
          <el-button size="small" :disabled="!hasPermission('write')">使用功能</el-button>
        </div>
        
        <div class="feature-item" id="vip-feature" :class="{ disabled: userState.type !== 'vip' && userState.type !== 'admin' }">
          <h4>VIP功能</h4>
          <p>VIP用户专享功能</p>
          <el-button size="small" :disabled="userState.type !== 'vip' && userState.type !== 'admin'">使用功能</el-button>
        </div>
        
        <div class="feature-item" id="admin-feature" :class="{ disabled: !hasPermission('admin') }">
          <h4>管理功能</h4>
          <p>管理员专用功能</p>
          <el-button size="small" :disabled="!hasPermission('admin')">使用功能</el-button>
        </div>
        
        <div class="feature-item" id="new-user-tip" v-if="userState.isFirstVisit">
          <h4>新手提示</h4>
          <p>首次访问用户的特别提示</p>
          <el-button size="small" type="success">了解更多</el-button>
        </div>
        
        <div class="feature-item" id="user-center">
          <h4>个人中心</h4>
          <p>管理您的个人信息和设置</p>
          <el-button size="small">进入中心</el-button>
        </div>
      </div>
    </div>
    
    <el-tour
      v-model="conditionalTourOpen"
      :steps="currentTourSteps"
      @close="onConditionalTourClose"
      @finish="onConditionalTourFinish"
    >
      <template #default="{ current, total, step }">
        <div class="conditional-tour-content">
          <div class="tour-badge" v-if="step.userType">
            <el-tag :type="getUserTypeColor(step.userType)" size="small">
              {{ getUserTypeText(step.userType) }}
            </el-tag>
          </div>
          <h4>{{ step.title }}</h4>
          <p>{{ step.description }}</p>
          <div v-if="step.tip" class="tour-tip">
            <el-alert :title="step.tip" type="info" :show-icon="false" :closable="false" />
          </div>
        </div>
      </template>
    </el-tour>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const conditionalTourOpen = ref(false)
const userState = ref({
  type: 'new',
  isFirstVisit: true,
  permissions: ['read']
})

const baseTourSteps = [
  {
    target: '#basic-feature',
    title: '基础功能介绍',
    description: '这是系统的基础功能，所有用户都可以使用。',
    userType: 'all'
  },
  {
    target: '#user-center',
    title: '个人中心',
    description: '在个人中心可以管理您的账户信息和偏好设置。',
    userType: 'all'
  }
]

const conditionalSteps = {
  newUser: [
    {
      target: '#new-user-tip',
      title: '欢迎新用户！',
      description: '欢迎使用我们的系统！这里有一些专门为新用户准备的提示。',
      tip: '建议先完善个人资料，以获得更好的使用体验。',
      userType: 'new'
    }
  ],
  writePermission: [
    {
      target: '#advanced-feature',
      title: '高级功能',
      description: '您拥有编辑权限，可以使用这些高级功能来提高工作效率。',
      tip: '使用高级功能时请注意数据安全。',
      userType: 'normal'
    }
  ],
  vipUser: [
    {
      target: '#vip-feature',
      title: 'VIP专享功能',
      description: '作为VIP用户，您可以享受这些专属功能和服务。',
      tip: 'VIP功能包含更多定制化选项和优先支持。',
      userType: 'vip'
    }
  ],
  adminUser: [
    {
      target: '#admin-feature',
      title: '管理员功能',
      description: '管理员可以使用系统管理功能，包括用户管理、权限设置等。',
      tip: '管理员操作会影响所有用户，请谨慎使用。',
      userType: 'admin'
    }
  ]
}

const currentTourSteps = ref([])

const hasPermission = (permission) => {
  return userState.value.permissions.includes(permission)
}

const updateTourSteps = () => {
  let steps = [...baseTourSteps]
  
  // 新用户引导
  if (userState.value.isFirstVisit) {
    steps = [...conditionalSteps.newUser, ...steps]
  }
  
  // 根据权限添加步骤
  if (hasPermission('write')) {
    steps.push(...conditionalSteps.writePermission)
  }
  
  // VIP用户引导
  if (userState.value.type === 'vip') {
    steps.push(...conditionalSteps.vipUser)
  }
  
  // 管理员引导
  if (userState.value.type === 'admin') {
    steps.push(...conditionalSteps.adminUser)
    // 管理员也有VIP功能
    steps.push(...conditionalSteps.vipUser)
  }
  
  currentTourSteps.value = steps
}

const startConditionalTour = () => {
  updateTourSteps()
  conditionalTourOpen.value = true
}

const onConditionalTourClose = () => {
  ElMessage.info('条件引导已关闭')
}

const onConditionalTourFinish = () => {
  ElMessage.success(`${getUserTypeText(userState.value.type)}引导完成！`)
}

const getUserTypeColor = (type) => {
  const colors = {
    new: 'success',
    normal: 'info',
    vip: 'warning',
    admin: 'danger',
    all: 'info'
  }
  return colors[type] || 'info'
}

const getUserTypeText = (type) => {
  const texts = {
    new: '新用户',
    normal: '普通用户',
    vip: 'VIP用户',
    admin: '管理员',
    all: '通用'
  }
  return texts[type] || '用户'
}

// 初始化
updateTourSteps()
</script>

<style scoped>
.conditional-tour-demo {
  padding: 20px;
}

.user-simulation {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

.user-simulation h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.user-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-item label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
}

.feature-showcase {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  padding: 20px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-item {
  padding: 20px;
  background: white;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  text-align: center;
  transition: all 0.3s;
}

.feature-item:hover:not(.disabled) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-item.disabled {
  opacity: 0.5;
  background: var(--el-fill-color-light);
}

.feature-item h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}

.feature-item p {
  margin-bottom: 15px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.conditional-tour-content {
  max-width: 300px;
}

.tour-badge {
  margin-bottom: 10px;
}

.conditional-tour-content h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.conditional-tour-content p {
  margin: 0 0 10px 0;
  line-height: 1.5;
  color: var(--el-text-color-regular);
}

.tour-tip {
  margin-top: 10px;
}
</style>
```

## API 文档

### Tour Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| model-value / v-model | 是否显示引导 | boolean | — | false |
| steps | 引导步骤配置 | TourStep[] | — | [] |
| current | 当前步骤索引 | number | — | 0 |
| placement | 引导框位置 | string | top/bottom/left/right/top-start/top-end/bottom-start/bottom-end/left-start/left-end/right-start/right-end | bottom |
| mask | 遮罩配置 | boolean \| object | — | true |
| gap | 引导框与目标元素的间距 | object | — | { offset: 6, radius: 2 } |
| scrollIntoViewOptions | 滚动配置 | boolean \| object | — | true |
| z-index | 引导层级 | number | — | 2001 |
| show-arrow | 是否显示箭头 | boolean | — | true |
| show-close | 是否显示关闭按钮 | boolean | — | true |
| close-icon | 自定义关闭图标 | string \| Component | — | Close |
| prev-button-props | 上一步按钮属性 | object | — | {} |
| next-button-props | 下一步按钮属性 | object | — | {} |

### TourStep 配置

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| target | 目标元素选择器 | string \| HTMLElement | — | — |
| title | 步骤标题 | string | — | — |
| description | 步骤描述 | string | — | — |
| placement | 当前步骤的位置 | string | 同 Tour placement | — |
| mask | 当前步骤的遮罩配置 | boolean \| object | — | — |
| content | 自定义内容 | string \| VNode | — | — |
| prevButtonProps | 当前步骤的上一步按钮属性 | object | — | — |
| nextButtonProps | 当前步骤的下一步按钮属性 | object | — | — |
| scrollIntoViewOptions | 当前步骤的滚动配置 | boolean \| object | — | — |

### Tour Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| close | 关闭引导时触发 | — |
| finish | 完成引导时触发 | — |
| change | 步骤改变时触发 | (current: number) |

### Tour Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| close | 关闭引导 | — |
| finish | 完成引导 | — |
| next | 下一步 | — |
| prev | 上一步 | — |
| goTo | 跳转到指定步骤 | (step: number) |

### Tour Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| default | 自定义引导内容 | { current, total, step } |
| indicators | 自定义指示器 | { current, total } |

## 实践练习

### 练习1：新手引导系统

创建一个完整的新手引导系统，包含多个页面的引导流程：

```vue
<template>
  <div class="onboarding-system">
    <div class="system-header">
      <h2>新手引导系统</h2>
      <div class="header-actions">
        <el-button @click="startOnboarding">开始引导</el-button>
        <el-button @click="resetProgress">重置进度</el-button>
        <el-switch v-model="autoStart" active-text="自动开始" />
      </div>
    </div>
    
    <div class="progress-indicator">
      <h4>引导进度</h4>
      <el-steps :active="onboardingProgress" finish-status="success">
        <el-step title="欢迎" description="系统介绍" />
        <el-step title="基础功能" description="核心功能介绍" />
        <el-step title="高级功能" description="进阶功能" />
        <el-step title="完成" description="引导结束" />
      </el-steps>
    </div>
    
    <div class="app-simulation">
      <!-- 模拟应用界面 -->
      <div class="app-header" id="app-header">
        <div class="app-logo" id="app-logo">MyApp</div>
        <div class="app-nav" id="app-nav">
          <span id="nav-home">首页</span>
          <span id="nav-workspace">工作台</span>
          <span id="nav-projects">项目</span>
          <span id="nav-settings">设置</span>
        </div>
        <div class="app-user" id="app-user">
          <el-avatar :size="32" id="user-avatar">U</el-avatar>
        </div>
      </div>
      
      <div class="app-body">
        <div class="app-sidebar" id="app-sidebar">
          <div class="sidebar-section">
            <h4>快速操作</h4>
            <el-button id="quick-create" type="primary" block>新建项目</el-button>
            <el-button id="quick-import" block>导入数据</el-button>
          </div>
          
          <div class="sidebar-section">
            <h4>最近项目</h4>
            <div class="recent-item" id="recent-1">项目 A</div>
            <div class="recent-item" id="recent-2">项目 B</div>
            <div class="recent-item" id="recent-3">项目 C</div>
          </div>
        </div>
        
        <div class="app-main" id="app-main">
          <div class="welcome-section" id="welcome-section">
            <h3>欢迎使用 MyApp</h3>
            <p>这是一个功能强大的项目管理工具</p>
          </div>
          
          <div class="stats-section" id="stats-section">
            <div class="stat-card" id="stat-projects">
              <h4>项目总数</h4>
              <div class="stat-value">12</div>
            </div>
            <div class="stat-card" id="stat-tasks">
              <h4>待办任务</h4>
              <div class="stat-value">34</div>
            </div>
            <div class="stat-card" id="stat-team">
              <h4>团队成员</h4>
              <div class="stat-value">8</div>
            </div>
          </div>
          
          <div class="action-section" id="action-section">
            <h4>快速开始</h4>
            <div class="action-grid">
              <div class="action-item" id="action-create">
                <el-icon><Plus /></el-icon>
                <span>创建项目</span>
              </div>
              <div class="action-item" id="action-team">
                <el-icon><User /></el-icon>
                <span>邀请团队</span>
              </div>
              <div class="action-item" id="action-template">
                <el-icon><Document /></el-icon>
                <span>使用模板</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分阶段引导 -->
    <el-tour
      v-model="tourVisible"
      :steps="currentSteps"
      @close="onTourClose"
      @finish="onTourFinish"
      @change="onStepChange"
    >
      <template #default="{ current, total, step }">
        <div class="onboarding-content">
          <div class="onboarding-header">
            <h4>{{ step.title }}</h4>
            <div class="step-indicator">
              <el-tag size="small">{{ current + 1 }}/{{ total }}</el-tag>
              <el-tag size="small" type="info">阶段 {{ currentPhase }}</el-tag>
            </div>
          </div>
          <div class="onboarding-body">
            <p>{{ step.description }}</p>
            <div v-if="step.tips" class="onboarding-tips">
              <h5>💡 小贴士：</h5>
              <ul>
                <li v-for="tip in step.tips" :key="tip">{{ tip }}</li>
              </ul>
            </div>
            <div v-if="step.action" class="onboarding-action">
              <el-button 
                size="small" 
                type="primary"
                @click="handleStepAction(step.action)"
              >
                {{ step.actionText || '试试看' }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-tour>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, User, Document } from '@element-plus/icons-vue'

const tourVisible = ref(false)
const onboardingProgress = ref(0)
const currentPhase = ref(1)
const autoStart = ref(false)

// 分阶段引导步骤
const phaseSteps = {
  1: [ // 欢迎阶段
    {
      target: '#welcome-section',
      title: '欢迎使用 MyApp！',
      description: '欢迎来到 MyApp！我们将通过几个简单的步骤帮助您快速上手。',
      tips: [
        '整个引导过程大约需要2-3分钟',
        '您可以随时点击关闭按钮退出引导',
        '完成引导后可以在设置中重新查看'
      ]
    },
    {
      target: '#app-header',
      title: '应用头部',
      description: '这里是应用的主要导航区域，包含Logo、主菜单和用户信息。',
      tips: [
        '点击Logo可以随时返回首页',
        '主菜单包含了所有主要功能入口'
      ]
    }
  ],
  2: [ // 基础功能阶段
    {
      target: '#app-sidebar',
      title: '侧边栏功能',
      description: '左侧边栏提供了快速操作和最近项目的便捷入口。',
      tips: [
        '快速操作可以帮您节省时间',
        '最近项目让您快速访问常用内容'
      ]
    },
    {
      target: '#quick-create',
      title: '新建项目',
      description: '点击这个按钮可以快速创建新项目，开始您的工作。',
      action: 'create-project',
      actionText: '创建项目'
    },
    {
      target: '#stats-section',
      title: '数据统计',
      description: '这里显示了您的项目统计信息，帮助您了解工作进展。',
      tips: [
        '数据会实时更新',
        '点击卡片可以查看详细信息'
      ]
    }
  ],
  3: [ // 高级功能阶段
    {
      target: '#action-section',
      title: '快速开始',
      description: '这些快捷操作可以帮助您快速开始工作。',
      tips: [
        '创建项目：从零开始新项目',
        '邀请团队：协作更高效',
        '使用模板：快速启动标准项目'
      ]
    },
    {
      target: '#app-user',
      title: '用户中心',
      description: '点击头像可以访问个人设置、账户管理等功能。',
      action: 'open-profile',
      actionText: '打开设置'
    },
    {
      target: '#nav-settings',
      title: '系统设置',
      description: '在设置页面可以个性化您的使用体验。',
      tips: [
        '可以调整主题、语言等偏好',
        '设置通知和提醒选项',
        '管理账户安全设置'
      ]
    }
  ]
}

const currentSteps = computed(() => {
  return phaseSteps[currentPhase.value] || []
})

const startOnboarding = () => {
  currentPhase.value = 1
  onboardingProgress.value = 0
  tourVisible.value = true
}

const resetProgress = () => {
  currentPhase.value = 1
  onboardingProgress.value = 0
  tourVisible.value = false
  ElMessage.info('引导进度已重置')
}

const onTourClose = () => {
  ElMessage.info('引导已暂停，您可以随时重新开始')
}

const onTourFinish = () => {
  if (currentPhase.value < 3) {
    // 进入下一阶段
    currentPhase.value++
    onboardingProgress.value = currentPhase.value - 1
    
    setTimeout(() => {
      tourVisible.value = true
    }, 500)
    
    ElMessage.success(`第${currentPhase.value - 1}阶段完成！进入第${currentPhase.value}阶段`)
  } else {
    // 完成所有引导
    onboardingProgress.value = 4
    ElMessage.success('🎉 恭喜！您已完成所有引导，现在可以开始使用 MyApp 了！')
  }
}

const onStepChange = (current) => {
  // 步骤变化时的处理
}

const handleStepAction = (action) => {
  switch (action) {
    case 'create-project':
      ElMessage.success('项目创建功能演示')
      break
    case 'open-profile':
      ElMessage.info('用户设置面板演示')
      break
    default:
      ElMessage.info('功能演示：' + action)
  }
}

onMounted(() => {
  // 模拟新用户自动开始引导
  if (autoStart.value) {
    setTimeout(() => {
      startOnboarding()
    }, 1000)
  }
})
</script>

<style scoped>
.onboarding-system {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.system-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-indicator {
  margin-bottom: 30px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

.progress-indicator h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.app-simulation {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
  background: white;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: var(--el-color-primary);
  color: white;
}

.app-logo {
  font-size: 20px;
  font-weight: bold;
}

.app-nav {
  display: flex;
  gap: 30px;
}

.app-nav span {
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.app-nav span:hover {
  background: rgba(255, 255, 255, 0.1);
}

.app-body {
  display: flex;
  min-height: 500px;
}

.app-sidebar {
  width: 250px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-right: 1px solid var(--el-border-color);
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-section h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.recent-item {
  padding: 8px 12px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--el-text-color-regular);
}

.recent-item:hover {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.app-main {
  flex: 1;
  padding: 30px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background: var(--el-fill-color-extra-light);
  border-radius: 8px;
}

.welcome-section h3 {
  margin-top: 0;
  color: var(--el-text-color-primary);
  font-size: 24px;
}

.welcome-section p {
  color: var(--el-text-color-regular);
  font-size: 16px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  padding: 20px;
  background: white;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-card h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--el-color-primary);
}

.action-section h4 {
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 20px;
  background: white;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.action-item:hover {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
}

.action-item .el-icon {
  font-size: 24px;
  color: var(--el-color-primary);
}

.action-item span {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.onboarding-content {
  max-width: 350px;
}

.onboarding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.onboarding-header h4 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.step-indicator {
  display: flex;
  gap: 8px;
}

.onboarding-body p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.onboarding-tips {
  background: var(--el-fill-color-extra-light);
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
}

.onboarding-tips h5 {
  margin: 0 0 10px 0;
  color: var(--el-color-primary);
  font-size: 14px;
}

.onboarding-tips ul {
  margin: 0;
  padding-left: 20px;
}

.onboarding-tips li {
  margin: 5px 0;
  color: var(--el-text-color-regular);
  font-size: 13px;
  line-height: 1.4;
}

.onboarding-action {
  margin-top: 15px;
  text-align: center;
}
</style>
```

### 练习2：功能发现引导

创建一个帮助用户发现新功能的引导系统：

```vue
<template>
  <div class="feature-discovery-demo">
    <div class="discovery-header">
      <h2>功能发现引导</h2>
      <div class="discovery-controls">
        <el-button @click="startFeatureDiscovery">发现新功能</el-button>
        <el-button @click="startContextualHelp" type="success">上下文帮助</el-button>
        <el-switch v-model="showBadges" active-text="显示功能标记" />
      </div>
    </div>
    
    <div class="feature-workspace">
      <div class="toolbar" id="main-toolbar">
        <div class="toolbar-group">
          <el-button id="save-btn" type="primary">
            <el-icon><DocumentAdd /></el-icon>
            保存
          </el-button>
          <el-button id="export-btn">
            <el-icon><Download /></el-icon>
            导出
            <el-badge v-if="showBadges" value="新" class="feature-badge" />
          </el-button>
          <el-button id="share-btn">
            <el-icon><Share /></el-icon>
            分享
            <el-badge v-if="showBadges" value="热" type="warning" class="feature-badge" />
          </el-button>
        </div>
        
        <div class="toolbar-group">
          <el-button id="undo-btn" circle>
            <el-icon><RefreshLeft /></el-icon>
          </el-button>
          <el-button id="redo-btn" circle>
            <el-icon><RefreshRight /></el-icon>
          </el-button>
          <el-divider direction="vertical" />
          <el-button id="ai-assist-btn" type="success" circle>
            <el-icon><MagicStick /></el-icon>
            <el-badge v-if="showBadges" value="AI" type="success" class="feature-badge" />
          </el-button>
        </div>
      </div>
      
      <div class="workspace-content">
        <div class="canvas-area" id="canvas-area">
          <div class="canvas-header">
            <h3>设计画布</h3>
            <div class="canvas-tools">
              <el-button id="grid-toggle" size="small">
                <el-icon><Grid /></el-icon>
                网格
              </el-button>
              <el-button id="ruler-toggle" size="small">
                <el-icon><Ruler /></el-icon>
                标尺
                <el-badge v-if="showBadges" value="新" class="feature-badge" />
              </el-button>
              <el-button id="snap-toggle" size="small">
                <el-icon><Magnet /></el-icon>
                吸附
              </el-button>
            </div>
          </div>
          
          <div class="canvas-body">
            <div class="design-element" id="element-1">
              <div class="element-content">元素 1</div>
              <div class="element-controls" v-if="showBadges">
                <el-badge value="智能" type="info" class="feature-badge" />
              </div>
            </div>
            
            <div class="design-element" id="element-2">
              <div class="element-content">元素 2</div>
            </div>
          </div>
        </div>
        
        <div class="properties-panel" id="properties-panel">
          <h4>属性面板</h4>
          <div class="property-group">
            <label>位置</label>
            <div class="property-controls">
              <el-input-number v-model="elementProps.x" size="small" />
              <el-input-number v-model="elementProps.y" size="small" />
            </div>
          </div>
          
          <div class="property-group">
            <label>尺寸</label>
            <div class="property-controls">
              <el-input-number v-model="elementProps.width" size="small" />
              <el-input-number v-model="elementProps.height" size="small" />
            </div>
          </div>
          
          <div class="property-group" id="advanced-props">
            <label>
              高级属性
              <el-badge v-if="showBadges" value="增强" type="warning" class="feature-badge" />
            </label>
            <div class="property-controls">
              <el-slider v-model="elementProps.opacity" :max="100" />
              <el-color-picker v-model="elementProps.color" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能发现引导 -->
    <el-tour
      v-model="discoveryTourOpen"
      :steps="discoverySteps"
      @close="onDiscoveryTourClose"
      @finish="onDiscoveryTourFinish"
    >
      <template #default="{ current, total, step }">
        <div class="discovery-tour-content">
          <div class="discovery-header">
            <div class="feature-icon">
              <el-icon v-if="step.icon" :class="step.icon"></el-icon>
              <span v-else>🎯</span>
            </div>
            <div class="feature-info">
              <h4>{{ step.title }}</h4>
              <el-tag v-if="step.featureType" :type="getFeatureTypeColor(step.featureType)" size="small">
                {{ step.featureType }}
              </el-tag>
            </div>
          </div>
          <div class="discovery-body">
            <p>{{ step.description }}</p>
            <div v-if="step.benefits" class="feature-benefits">
              <h5>✨ 功能亮点：</h5>
              <ul>
                <li v-for="benefit in step.benefits" :key="benefit">{{ benefit }}</li>
              </ul>
            </div>
            <div v-if="step.howTo" class="feature-howto">
              <h5>🔧 使用方法：</h5>
              <p>{{ step.howTo }}</p>
            </div>
          </div>
        </div>
      </template>
    </el-tour>
    
    <!-- 上下文帮助引导 -->
    <el-tour
      v-model="contextualTourOpen"
      :steps="contextualSteps"
      @close="onContextualTourClose"
    >
      <template #default="{ current, total, step }">
        <div class="contextual-tour-content">
          <div class="help-header">
            <el-icon><QuestionFilled /></el-icon>
            <h4>{{ step.title }}</h4>
          </div>
          <div class="help-body">
            <p>{{ step.description }}</p>
            <div v-if="step.shortcut" class="keyboard-shortcut">
              <span>快捷键：</span>
              <el-tag>{{ step.shortcut }}</el-tag>
            </div>
          </div>
        </div>
      </template>
    </el-tour>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  DocumentAdd, Download, Share, RefreshLeft, RefreshRight, 
  MagicStick, Grid, Ruler, Magnet, QuestionFilled 
} from '@element-plus/icons-vue'

const discoveryTourOpen = ref(false)
const contextualTourOpen = ref(false)
const showBadges = ref(true)
const elementProps = ref({
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  opacity: 80,
  color: '#409EFF'
})

const discoverySteps = [
  {
    target: '#export-btn',
    title: '批量导出功能',
    description: '新增的批量导出功能可以一次性导出多种格式的文件。',
    featureType: '新功能',
    icon: 'Download',
    benefits: [
      '支持PDF、PNG、SVG等多种格式',
      '可自定义导出质量和尺寸',
      '支持批量处理多个设计'
    ],
    howTo: '点击导出按钮，选择"批量导出"选项，然后选择需要的格式和设置。'
  },
  {
    target: '#share-btn',
    title: '实时协作分享',
    description: '与团队成员实时协作，共同编辑设计项目。',
    featureType: '热门功能',
    icon: 'Share',
    benefits: [
      '实时同步编辑状态',
      '支持评论和标注',
      '版本历史记录'
    ],
    howTo: '点击分享按钮，邀请团队成员加入协作，或生成分享链接。'
  },
  {
    target: '#ai-assist-btn',
    title: 'AI 智能助手',
    description: 'AI助手可以帮助您快速生成设计元素和优化布局。',
    featureType: 'AI功能',
    icon: 'MagicStick',
    benefits: [
      '智能布局建议',
      '自动颜色搭配',
      '设计元素生成'
    ],
    howTo: '点击AI助手按钮，描述您的需求，AI将为您提供设计建议。'
  },
  {
    target: '#ruler-toggle',
    title: '精确标尺工具',
    description: '新增的标尺工具帮助您精确定位和测量设计元素。',
    featureType: '新功能',
    icon: 'Ruler',
    benefits: [
      '像素级精确测量',
      '多种单位支持',
      '智能对齐辅助线'
    ],
    howTo: '点击标尺按钮开启，拖拽可创建辅助线，双击可设置精确数值。'
  },
  {
    target: '#advanced-props',
    title: '增强属性面板',
    description: '属性面板新增了更多高级设置选项，让您的设计更加精细。',
    featureType: '增强功能',
    benefits: [
      '更多样式选项',
      '动画效果设置',
      '响应式属性配置'
    ],
    howTo: '在属性面板中展开"高级属性"部分，探索更多设置选项。'
  }
]

const contextualSteps = [
  {
    target: '#save-btn',
    title: '保存项目',
    description: '保存当前的设计项目，支持自动保存和版本管理。',
    shortcut: 'Ctrl+S'
  },
  {
    target: '#undo-btn',
    title: '撤销操作',
    description: '撤销上一步操作，支持多级撤销。',
    shortcut: 'Ctrl+Z'
  },
  {
    target: '#redo-btn',
    title: '重做操作',
    description: '重做已撤销的操作。',
    shortcut: 'Ctrl+Y'
  },
  {
    target: '#canvas-area',
    title: '设计画布',
    description: '主要的设计工作区域，支持拖拽、缩放和多选操作。',
    shortcut: '空格+拖拽 平移画布'
  }
]

const startFeatureDiscovery = () => {
  discoveryTourOpen.value = true
}

const startContextualHelp = () => {
  contextualTourOpen.value = true
}

const onDiscoveryTourClose = () => {
  ElMessage.info('功能发现引导已关闭')
}

const onDiscoveryTourFinish = () => {
  ElMessage.success('🎉 恭喜！您已了解所有新功能，开始创作吧！')
}

const onContextualTourClose = () => {
  ElMessage.info('上下文帮助已关闭')
}

const getFeatureTypeColor = (type) => {
  const colors = {
    '新功能': 'success',
    '热门功能': 'warning',
    'AI功能': 'danger',
    '增强功能': 'info'
  }
  return colors[type] || 'info'
}
</script>

<style scoped>
.feature-discovery-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.discovery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.discovery-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.discovery-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.feature-workspace {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color);
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
}

.workspace-content {
  display: flex;
  min-height: 600px;
}

.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color);
}

.canvas-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.canvas-tools {
  display: flex;
  gap: 8px;
}

.canvas-body {
  flex: 1;
  position: relative;
  padding: 40px;
  background: #fafafa;
  background-image: 
    linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.design-element {
  position: absolute;
  width: 120px;
  height: 80px;
  background: white;
  border: 2px solid var(--el-color-primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  transition: all 0.3s;
}

.design-element:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

#element-1 {
  top: 50px;
  left: 100px;
}

#element-2 {
  top: 200px;
  left: 300px;
}

.element-content {
  color: var(--el-color-primary);
  font-weight: 500;
}

.element-controls {
  position: absolute;
  top: -10px;
  right: -10px;
}

.properties-panel {
  width: 280px;
  padding: 20px;
  background: var(--el-fill-color-extra-light);
  border-left: 1px solid var(--el-border-color);
}

.properties-panel h4 {
  margin-top: 0;
  margin-bottom: 20px;
  color: var(--el-text-color-primary);
}

.property-group {
  margin-bottom: 20px;
}

.property-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: 500;
}

.property-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.discovery-tour-content {
  max-width: 350px;
}

.discovery-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: var(--el-color-primary-light-9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  font-size: 18px;
}

.feature-info h4 {
  margin: 0 0 5px 0;
  color: var(--el-text-color-primary);
}

.discovery-body p {
  margin: 0 0 15px 0;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.feature-benefits,
.feature-howto {
  background: var(--el-fill-color-extra-light);
  padding: 12px;
  border-radius: 4px;
  margin: 12px 0;
}

.feature-benefits h5,
.feature-howto h5 {
  margin: 0 0 8px 0;
  color: var(--el-color-primary);
  font-size: 13px;
}

.feature-benefits ul {
  margin: 0;
  padding-left: 16px;
}

.feature-benefits li {
  margin: 4px 0;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.4;
}

.feature-howto p {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 12px;
  line-height: 1.4;
}

.contextual-tour-content {
  max-width: 280px;
}

.help-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.help-header .el-icon {
  color: var(--el-color-primary);
}

.help-header h4 {
  margin: 0;
  color: var(--el-text-color-primary);
}

.help-body p {
  margin: 0 0 12px 0;
  line-height: 1.5;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.keyboard-shortcut {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}
</style>
```

## 常见问题

### 1. 引导目标元素不存在

**问题**：引导步骤中指定的目标元素在页面中不存在。

**解决方案**：
```javascript
// 检查目标元素是否存在
const checkTargetExists = (target) => {
  if (typeof target === 'string') {
    return document.querySelector(target) !== null
  }
  return target instanceof HTMLElement
}

// 过滤有效的引导步骤
const validSteps = tourSteps.filter(step => checkTargetExists(step.target))

// 动态等待元素出现
const waitForElement = (selector, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    setTimeout(() => {
      observer.disconnect()
      reject(new Error('Element not found within timeout'))
    }, timeout)
  })
}
```

### 2. 引导位置偏移

**问题**：引导框位置不准确，特别是在页面滚动或元素动态变化时。

**解决方案**：
```javascript
// 自定义位置计算
const customPlacement = {
  name: 'custom',
  fn: ({ reference, floating, placement }) => {
    const referenceRect = reference.getBoundingClientRect()
    const floatingRect = floating.getBoundingClientRect()
    
    // 考虑滚动偏移
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
    
    let x = referenceRect.left + scrollLeft
    let y = referenceRect.bottom + scrollTop + 10
    
    // 边界检测
    if (x + floatingRect.width > window.innerWidth) {
      x = window.innerWidth - floatingRect.width - 10
    }
    
    if (y + floatingRect.height > window.innerHeight + scrollTop) {
      y = referenceRect.top + scrollTop - floatingRect.height - 10
    }
    
    return { x, y }
  }
}

// 监听窗口变化
const handleResize = () => {
  // 重新计算引导位置
  tourRef.value?.updatePosition()
}

window.addEventListener('resize', handleResize)
window.addEventListener('scroll', handleResize)
```

### 3. 引导遮罩层级问题

**问题**：引导遮罩被其他元素覆盖，或者遮罩覆盖了不应该覆盖的元素。

**解决方案**：
```javascript
// 动态调整 z-index
const getHighestZIndex = () => {
  const elements = document.querySelectorAll('*')
  let highest = 0
  
  elements.forEach(el => {
    const zIndex = parseInt(window.getComputedStyle(el).zIndex)
    if (!isNaN(zIndex) && zIndex > highest) {
      highest = zIndex
    }
  })
  
  return highest + 1
}

// 设置合适的 z-index
const tourZIndex = ref(getHighestZIndex())

// 处理特殊元素
const handleSpecialElements = () => {
  // 临时降低某些元素的 z-index
  const specialElements = document.querySelectorAll('.high-z-index-element')
  const originalZIndexes = []
  
  specialElements.forEach((el, index) => {
    originalZIndexes[index] = el.style.zIndex
    el.style.zIndex = '1'
  })
  
  // 引导结束后恢复
  return () => {
    specialElements.forEach((el, index) => {
      el.style.zIndex = originalZIndexes[index]
    })
  }
}
```

### 4. 移动端适配问题

**问题**：在移动设备上引导体验不佳，位置不准确或操作困难。

**解决方案**：
```javascript
// 检测设备类型
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 移动端专用配置
const mobileConfig = {
  gap: { offset: 10, radius: 4 },
  placement: 'bottom',
  mask: {
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)'
    }
  },
  scrollIntoViewOptions: {
    behavior: 'smooth',
    block: 'center'
  }
}

// 响应式步骤配置
const getResponsiveSteps = () => {
  if (isMobile()) {
    return tourSteps.map(step => ({
      ...step,
      placement: 'bottom',
      description: step.mobileDescription || step.description
    }))
  }
  return tourSteps
}

// 触摸事件处理
const handleTouchEvents = () => {
  let touchStartY = 0
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
  })
  
  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY
    const diff = touchStartY - touchY
    
    // 防止滚动时引导位置错乱
    if (Math.abs(diff) > 10) {
      tourRef.value?.updatePosition()
    }
  })
}
```

## 最佳实践

### 1. 用户体验优化

```javascript
// 渐进式引导
const progressiveOnboarding = {
  // 首次访问：基础功能引导
  firstVisit: [
    { target: '#main-nav', title: '导航菜单', priority: 'high' },
    { target: '#user-profile', title: '个人中心', priority: 'medium' }
  ],
  
  // 功能使用后：相关功能引导
  afterAction: {
    'create-project': [
      { target: '#project-settings', title: '项目设置' },
      { target: '#collaboration', title: '团队协作' }
    ]
  },
  
  // 定期提醒：新功能介绍
  periodic: [
    { target: '#new-feature', title: '新功能', condition: 'hasNewFeatures' }
  ]
}

// 智能触发时机
const smartTrigger = {
  // 用户空闲时触发
  onIdle: (callback, delay = 30000) => {
    let timer
    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(callback, delay)
    }
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })
    
    resetTimer()
  },
  
  // 功能使用频率低时提醒
  onLowUsage: (feature, threshold = 3) => {
    const usage = getFeatureUsage(feature)
    if (usage < threshold) {
      showFeatureTour(feature)
    }
  }
}
```

### 2. 性能优化

```javascript
// 懒加载引导内容
const lazyLoadTour = {
  // 按需加载引导步骤
  loadSteps: async (category) => {
    const { default: steps } = await import(`./tours/${category}.js`)
    return steps
  },
  
  // 预加载关键引导
  preloadCritical: () => {
    const criticalTours = ['onboarding', 'core-features']
    criticalTours.forEach(tour => {
      import(`./tours/${tour}.js`)
    })
  }
}

// 引导状态管理
const tourStateManager = {
  // 本地存储引导状态
  saveProgress: (tourId, stepIndex) => {
    const progress = JSON.parse(localStorage.getItem('tour-progress') || '{}')
    progress[tourId] = stepIndex
    localStorage.setItem('tour-progress', JSON.stringify(progress))
  },
  
  // 恢复引导进度
  restoreProgress: (tourId) => {
    const progress = JSON.parse(localStorage.getItem('tour-progress') || '{}')
    return progress[tourId] || 0
  },
  
  // 标记引导完成
  markCompleted: (tourId) => {
    const completed = JSON.parse(localStorage.getItem('completed-tours') || '[]')
    if (!completed.includes(tourId)) {
      completed.push(tourId)
      localStorage.setItem('completed-tours', JSON.stringify(completed))
    }
  }
}
```

### 3. 可访问性

```javascript
// 键盘导航支持
const keyboardNavigation = {
  setup: () => {
    document.addEventListener('keydown', (e) => {
      if (!tourVisible.value) return
      
      switch (e.key) {
        case 'Escape':
          closeTour()
          break
        case 'ArrowRight':
        case 'Enter':
          nextStep()
          break
        case 'ArrowLeft':
          prevStep()
          break
        case 'Home':
          goToStep(0)
          break
        case 'End':
          goToStep(steps.length - 1)
          break
      }
    })
  }
}

// 屏幕阅读器支持
const screenReaderSupport = {
  // 添加 ARIA 属性
  addAriaAttributes: (element) => {
    element.setAttribute('role', 'dialog')
    element.setAttribute('aria-modal', 'true')
    element.setAttribute('aria-labelledby', 'tour-title')
    element.setAttribute('aria-describedby', 'tour-description')
  },
  
  // 焦点管理
  manageFocus: () => {
    const tourElement = document.querySelector('.el-tour')
    const focusableElements = tourElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  },
  
  // 实时通知
  announceStep: (step, current, total) => {
    const announcement = `第 ${current + 1} 步，共 ${total} 步。${step.title}。${step.description}`
    
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.style.position = 'absolute'
    announcer.style.left = '-10000px'
    announcer.textContent = announcement
    
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)
  }
}
```

### 4. 数据分析

```javascript
// 引导效果分析
const tourAnalytics = {
  // 跟踪引导完成率
  trackCompletion: (tourId, completed, totalSteps, completedSteps) => {
    const data = {
      tourId,
      completed,
      completionRate: completedSteps / totalSteps,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    }
    
    // 发送到分析服务
    sendAnalytics('tour_completion', data)
  },
  
  // 跟踪步骤停留时间
  trackStepDuration: (tourId, stepIndex, duration) => {
    sendAnalytics('step_duration', {
      tourId,
      stepIndex,
      duration,
      timestamp: Date.now()
    })
  },
  
  // 跟踪退出点
  trackExit: (tourId, stepIndex, reason) => {
    sendAnalytics('tour_exit', {
      tourId,
      exitStep: stepIndex,
      reason, // 'close_button', 'escape_key', 'outside_click'
      timestamp: Date.now()
    })
  }
}

// A/B 测试支持
const abTesting = {
  // 测试不同的引导流程
  getVariant: (tourId) => {
    const userId = getUserId()
    const hash = simpleHash(userId + tourId)
    return hash % 2 === 0 ? 'A' : 'B'
  },
  
  // 根据变体调整引导内容
  adaptTour: (steps, variant) => {
    if (variant === 'B') {
      return steps.map(step => ({
        ...step,
        description: step.alternativeDescription || step.description
      }))
    }
    return steps
  }
}
```

## 总结

Tour 漫游式引导组件是提升用户体验的重要工具，通过本章学习，你应该掌握了：

1. **基础使用**：了解 Tour 组件的基本用法和配置选项
2. **自定义内容**：学会通过插槽自定义引导内容和样式
3. **位置控制**：掌握引导框位置和遮罩的配置方法
4. **条件显示**：实现基于用户状态的动态引导内容
5. **实践应用**：通过实际项目了解引导系统的设计和实现
6. **问题解决**：掌握常见问题的解决方案和调试技巧
7. **最佳实践**：学习用户体验优化、性能优化和可访问性的实现方法

在实际项目中使用 Tour 组件时，要注意：
- 保持引导内容简洁明了，避免信息过载
- 合理安排引导时机，不要打断用户的正常操作流程
- 提供跳过和暂停选项，尊重用户的选择
- 定期更新引导内容，确保与产品功能保持同步
- 收集用户反馈，持续优化引导体验

## 参考资料

- [Element Plus Tour 组件文档](https://element-plus.org/zh-CN/component/tour.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [User Onboarding Best Practices](https://www.nngroup.com/articles/user-onboarding/)
- [Progressive Disclosure in UX](https://www.nngroup.com/articles/progressive-disclosure/)
- [Mobile Tour Design Patterns](https://mobbin.design/patterns/tour)