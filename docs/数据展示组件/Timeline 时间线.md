# Timeline 时间线

## 概述

Timeline 时间线是 Element Plus 提供的一个用于垂直展示时间流信息的组件。它能够清晰地展示事件发生的时间顺序，常用于展示历史记录、操作日志、项目进度、订单状态等场景。

## 学习目标

通过本文档的学习，你将掌握：
- Timeline 时间线的基本概念和使用场景
- 基础用法和时间线项配置
- 自定义节点样式和内容
- 时间戳显示和位置控制
- 实际项目中的应用示例
- 完整的 API 文档和最佳实践

## 基础用法

### 基础时间线

最简单的时间线用法：

```vue
<template>
  <el-timeline>
    <el-timeline-item timestamp="2024/1/15 10:30" placement="top">
      创建成功
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:32" placement="top">
      通过审核
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:35" placement="top">
      活动按期开始
    </el-timeline-item>
  </el-timeline>
</template>
```

### 自定义节点样式

通过 `color`、`size`、`type` 等属性自定义节点样式：

```vue
<template>
  <el-timeline>
    <el-timeline-item 
      timestamp="2024/1/15 10:30" 
      placement="top"
      color="#0bbd87"
    >
      支持使用自定义颜色
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 10:32" 
      placement="top"
      size="large"
    >
      支持自定义节点尺寸
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 10:35" 
      placement="top"
      type="primary"
    >
      支持自定义节点类型
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 10:38" 
      placement="top"
      hollow
    >
      支持空心点
    </el-timeline-item>
  </el-timeline>
</template>
```

### 自定义时间戳

可以将时间戳显示在内容的上方或下方：

```vue
<template>
  <el-timeline>
    <el-timeline-item timestamp="2024/1/15 10:30">
      <h4>更新 Github 模板</h4>
      <p>王小虎 提交于 2024/1/15 10:30</p>
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:32">
      <h4>更新 Github 模板</h4>
      <p>王小虎 提交于 2024/1/15 10:32</p>
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:35">
      <h4>更新 Github 模板</h4>
      <p>王小虎 提交于 2024/1/15 10:35</p>
    </el-timeline-item>
  </el-timeline>
</template>
```

### 自定义节点

通过 `dot` 插槽可以自定义时间线节点：

```vue
<template>
  <el-timeline>
    <el-timeline-item timestamp="2024/1/15 10:30" placement="top">
      <template #dot>
        <el-icon class="timeline-icon">
          <More />
        </el-icon>
      </template>
      自定义图标
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:32" placement="top">
      <template #dot>
        <span class="custom-dot">1</span>
      </template>
      自定义内容
    </el-timeline-item>
    <el-timeline-item timestamp="2024/1/15 10:35" placement="top">
      <template #dot>
        <el-avatar :size="20" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </template>
      自定义头像
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
import { More } from '@element-plus/icons-vue'
</script>

<style scoped>
.timeline-icon {
  color: #409eff;
  font-size: 16px;
}

.custom-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  font-size: 12px;
  font-weight: bold;
}
</style>
```

### 不同状态的时间线

使用不同的颜色和图标表示不同的状态：

```vue
<template>
  <el-timeline>
    <el-timeline-item 
      timestamp="2024/1/15 10:30" 
      placement="top"
      type="success"
    >
      <template #dot>
        <el-icon><Check /></el-icon>
      </template>
      订单创建成功
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 11:00" 
      placement="top"
      type="warning"
    >
      <template #dot>
        <el-icon><Clock /></el-icon>
      </template>
      等待付款
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 11:30" 
      placement="top"
      type="primary"
    >
      <template #dot>
        <el-icon><Money /></el-icon>
      </template>
      付款成功
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/15 14:00" 
      placement="top"
      type="info"
    >
      <template #dot>
        <el-icon><Van /></el-icon>
      </template>
      商品发货
    </el-timeline-item>
    <el-timeline-item 
      timestamp="2024/1/16 10:00" 
      placement="top"
      type="success"
    >
      <template #dot>
        <el-icon><CircleCheck /></el-icon>
      </template>
      订单完成
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
import { Check, Clock, Money, Van, CircleCheck } from '@element-plus/icons-vue'
</script>
```

## 实际应用示例

### 订单状态跟踪

```vue
<template>
  <div class="order-tracking">
    <div class="order-header">
      <h3>订单状态跟踪</h3>
      <div class="order-info">
        <span>订单号：{{ orderInfo.orderNo }}</span>
        <span>下单时间：{{ orderInfo.createTime }}</span>
      </div>
    </div>
    
    <el-timeline class="order-timeline">
      <el-timeline-item 
        v-for="(step, index) in orderSteps" 
        :key="index"
        :timestamp="step.time" 
        placement="top"
        :type="getStepType(step.status)"
        :class="getStepClass(step.status)"
      >
        <template #dot>
          <el-icon :class="getIconClass(step.status)">
            <component :is="getStepIcon(step.status)" />
          </el-icon>
        </template>
        
        <div class="step-content">
          <h4>{{ step.title }}</h4>
          <p>{{ step.description }}</p>
          <div v-if="step.details" class="step-details">
            <div v-for="detail in step.details" :key="detail.label" class="detail-item">
              <span class="label">{{ detail.label }}：</span>
              <span class="value">{{ detail.value }}</span>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Document, Clock, Money, Van, 
  CircleCheck, Close, Warning 
} from '@element-plus/icons-vue'

const orderInfo = ref({
  orderNo: 'ORD202401150001',
  createTime: '2024-01-15 10:30:00'
})

const orderSteps = ref([
  {
    title: '订单创建',
    description: '您的订单已成功创建',
    time: '2024-01-15 10:30',
    status: 'completed',
    details: [
      { label: '订单金额', value: '¥299.00' },
      { label: '支付方式', value: '微信支付' }
    ]
  },
  {
    title: '等待付款',
    description: '请在30分钟内完成付款',
    time: '2024-01-15 10:31',
    status: 'completed'
  },
  {
    title: '付款成功',
    description: '您已成功付款，商家正在准备发货',
    time: '2024-01-15 10:45',
    status: 'completed',
    details: [
      { label: '付款时间', value: '2024-01-15 10:45:23' },
      { label: '交易流水号', value: 'TXN202401150001' }
    ]
  },
  {
    title: '商品发货',
    description: '您的商品已发货，请注意查收',
    time: '2024-01-15 14:00',
    status: 'completed',
    details: [
      { label: '快递公司', value: '顺丰速运' },
      { label: '快递单号', value: 'SF1234567890' }
    ]
  },
  {
    title: '运输中',
    description: '您的商品正在运输途中',
    time: '2024-01-15 16:30',
    status: 'current'
  },
  {
    title: '待收货',
    description: '商品即将送达，请准备签收',
    time: '',
    status: 'pending'
  },
  {
    title: '交易完成',
    description: '感谢您的购买，欢迎再次光临',
    time: '',
    status: 'pending'
  }
])

const getStepType = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'current': return 'primary'
    case 'pending': return 'info'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const getStepClass = (status) => {
  return `step-${status}`
}

const getStepIcon = (status) => {
  switch (status) {
    case 'completed': return CircleCheck
    case 'current': return Van
    case 'pending': return Clock
    case 'failed': return Close
    default: return Document
  }
}

const getIconClass = (status) => {
  return `icon-${status}`
}
</script>

<style scoped>
.order-tracking {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.order-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.order-header h3 {
  margin: 0 0 10px 0;
  color: #303133;
}

.order-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

.order-timeline {
  padding-left: 20px;
}

.step-content {
  padding: 10px 0;
}

.step-content h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
}

.step-content p {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
}

.step-details {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.detail-item {
  margin-bottom: 5px;
  font-size: 13px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  color: #909399;
}

.detail-item .value {
  color: #303133;
  font-weight: 500;
}

.step-completed .step-content h4 {
  color: #67c23a;
}

.step-current .step-content h4 {
  color: #409eff;
  font-weight: bold;
}

.step-pending .step-content h4 {
  color: #c0c4cc;
}

.step-pending .step-content p {
  color: #c0c4cc;
}

.icon-completed {
  color: #67c23a;
}

.icon-current {
  color: #409eff;
  animation: pulse 2s infinite;
}

.icon-pending {
  color: #c0c4cc;
}

.icon-failed {
  color: #f56c6c;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>
```

### 项目进度时间线

```vue
<template>
  <div class="project-timeline">
    <div class="timeline-header">
      <h3>项目进度时间线</h3>
      <el-select v-model="selectedProject" placeholder="选择项目" style="width: 200px">
        <el-option 
          v-for="project in projects" 
          :key="project.id" 
          :label="project.name" 
          :value="project.id"
        />
      </el-select>
    </div>
    
    <el-timeline>
      <el-timeline-item 
        v-for="(milestone, index) in milestones" 
        :key="index"
        :timestamp="milestone.date" 
        placement="top"
        :type="getMilestoneType(milestone.status)"
        :size="milestone.important ? 'large' : 'normal'"
      >
        <template #dot>
          <el-icon v-if="milestone.status === 'completed'">
            <CircleCheck />
          </el-icon>
          <el-icon v-else-if="milestone.status === 'current'">
            <Loading />
          </el-icon>
          <el-icon v-else-if="milestone.status === 'delayed'">
            <Warning />
          </el-icon>
          <el-icon v-else>
            <Clock />
          </el-icon>
        </template>
        
        <div class="milestone-content">
          <div class="milestone-header">
            <h4>{{ milestone.title }}</h4>
            <el-tag 
              :type="getTagType(milestone.status)" 
              size="small"
            >
              {{ getStatusText(milestone.status) }}
            </el-tag>
          </div>
          
          <p>{{ milestone.description }}</p>
          
          <div v-if="milestone.deliverables" class="deliverables">
            <h5>交付物：</h5>
            <ul>
              <li v-for="item in milestone.deliverables" :key="item">
                {{ item }}
              </li>
            </ul>
          </div>
          
          <div v-if="milestone.team" class="team-info">
            <span class="team-label">负责团队：</span>
            <el-tag 
              v-for="member in milestone.team" 
              :key="member" 
              size="small" 
              type="info"
              style="margin-right: 5px"
            >
              {{ member }}
            </el-tag>
          </div>
          
          <div v-if="milestone.progress !== undefined" class="progress-info">
            <span class="progress-label">完成进度：</span>
            <el-progress 
              :percentage="milestone.progress" 
              :status="milestone.progress === 100 ? 'success' : 'primary'"
              style="width: 200px; margin-left: 10px"
            />
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  CircleCheck, Loading, Warning, Clock 
} from '@element-plus/icons-vue'

const selectedProject = ref('project1')

const projects = ref([
  { id: 'project1', name: '电商平台重构项目' },
  { id: 'project2', name: '移动端APP开发' },
  { id: 'project3', name: '数据分析系统' }
])

const projectMilestones = ref({
  project1: [
    {
      title: '项目启动',
      description: '项目正式启动，团队组建完成',
      date: '2024-01-01',
      status: 'completed',
      important: true,
      deliverables: ['项目章程', '团队组织架构', '项目计划'],
      team: ['项目经理', '技术负责人'],
      progress: 100
    },
    {
      title: '需求分析',
      description: '完成业务需求调研和系统需求分析',
      date: '2024-01-15',
      status: 'completed',
      deliverables: ['需求规格说明书', '用例图', '原型设计'],
      team: ['产品经理', 'UI设计师', '业务分析师'],
      progress: 100
    },
    {
      title: '系统设计',
      description: '完成系统架构设计和详细设计',
      date: '2024-02-01',
      status: 'completed',
      deliverables: ['系统架构图', '数据库设计', 'API设计文档'],
      team: ['架构师', '后端开发'],
      progress: 100
    },
    {
      title: '开发阶段一',
      description: '核心功能模块开发',
      date: '2024-02-15',
      status: 'current',
      deliverables: ['用户管理模块', '商品管理模块', '订单管理模块'],
      team: ['前端开发', '后端开发', '测试工程师'],
      progress: 75
    },
    {
      title: '开发阶段二',
      description: '高级功能和优化',
      date: '2024-03-01',
      status: 'pending',
      deliverables: ['支付模块', '推荐系统', '数据分析'],
      team: ['全栈开发', '算法工程师'],
      progress: 0
    },
    {
      title: '系统测试',
      description: '全面系统测试和性能优化',
      date: '2024-03-15',
      status: 'pending',
      deliverables: ['测试报告', '性能测试报告', 'Bug修复'],
      team: ['测试团队', '运维工程师'],
      progress: 0
    },
    {
      title: '项目上线',
      description: '系统正式上线运行',
      date: '2024-04-01',
      status: 'pending',
      important: true,
      deliverables: ['生产环境部署', '用户培训', '运维文档'],
      team: ['运维团队', '技术支持'],
      progress: 0
    }
  ]
})

const milestones = computed(() => {
  return projectMilestones.value[selectedProject.value] || []
})

const getMilestoneType = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'current': return 'primary'
    case 'delayed': return 'warning'
    case 'pending': return 'info'
    default: return 'info'
  }
}

const getTagType = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'current': return 'primary'
    case 'delayed': return 'warning'
    case 'pending': return 'info'
    default: return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return '已完成'
    case 'current': return '进行中'
    case 'delayed': return '延期'
    case 'pending': return '待开始'
    default: return '未知'
  }
}
</script>

<style scoped>
.project-timeline {
  padding: 20px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e4e7ed;
}

.timeline-header h3 {
  margin: 0;
  color: #303133;
}

.milestone-content {
  padding: 15px 0;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.milestone-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
}

.milestone-content p {
  margin: 0 0 15px 0;
  color: #606266;
  line-height: 1.5;
}

.deliverables {
  margin-bottom: 15px;
}

.deliverables h5 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 14px;
}

.deliverables ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.deliverables li {
  margin-bottom: 4px;
}

.team-info {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.team-label {
  color: #303133;
  font-size: 14px;
  margin-right: 10px;
}

.progress-info {
  display: flex;
  align-items: center;
}

.progress-label {
  color: #303133;
  font-size: 14px;
}
</style>
```

### 操作日志时间线

```vue
<template>
  <div class="activity-log">
    <div class="log-header">
      <h3>操作日志</h3>
      <div class="log-filters">
        <el-select v-model="filterUser" placeholder="选择用户" clearable style="width: 150px; margin-right: 10px">
          <el-option label="全部用户" value="" />
          <el-option label="张三" value="张三" />
          <el-option label="李四" value="李四" />
          <el-option label="王五" value="王五" />
        </el-select>
        <el-select v-model="filterAction" placeholder="选择操作" clearable style="width: 150px">
          <el-option label="全部操作" value="" />
          <el-option label="登录" value="login" />
          <el-option label="创建" value="create" />
          <el-option label="更新" value="update" />
          <el-option label="删除" value="delete" />
        </el-select>
      </div>
    </div>
    
    <el-timeline>
      <el-timeline-item 
        v-for="(log, index) in filteredLogs" 
        :key="index"
        :timestamp="log.timestamp" 
        placement="top"
        :type="getLogType(log.action)"
        size="normal"
      >
        <template #dot>
          <el-icon :class="getLogIconClass(log.action)">
            <component :is="getLogIcon(log.action)" />
          </el-icon>
        </template>
        
        <div class="log-content">
          <div class="log-header-info">
            <span class="user-name">{{ log.user }}</span>
            <span class="action-text">{{ getActionText(log.action) }}</span>
            <span class="target">{{ log.target }}</span>
          </div>
          
          <div v-if="log.details" class="log-details">
            <p>{{ log.details }}</p>
          </div>
          
          <div class="log-meta">
            <span class="ip">IP: {{ log.ip }}</span>
            <span class="device">设备: {{ log.device }}</span>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
    
    <div v-if="filteredLogs.length === 0" class="empty-state">
      <el-empty description="暂无操作日志" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  User, Plus, Edit, Delete, 
  Key, Document, Setting 
} from '@element-plus/icons-vue'

const filterUser = ref('')
const filterAction = ref('')

const logs = ref([
  {
    user: '张三',
    action: 'login',
    target: '系统',
    details: '用户成功登录系统',
    timestamp: '2024-01-15 14:30:25',
    ip: '192.168.1.100',
    device: 'Chrome 120.0 / Windows 10'
  },
  {
    user: '张三',
    action: 'create',
    target: '用户账户',
    details: '创建了新用户账户 "李四"',
    timestamp: '2024-01-15 14:25:10',
    ip: '192.168.1.100',
    device: 'Chrome 120.0 / Windows 10'
  },
  {
    user: '李四',
    action: 'update',
    target: '个人资料',
    details: '更新了个人资料信息，包括手机号码和邮箱地址',
    timestamp: '2024-01-15 14:20:45',
    ip: '192.168.1.101',
    device: 'Safari 17.0 / macOS'
  },
  {
    user: '王五',
    action: 'delete',
    target: '文档',
    details: '删除了文档 "项目需求说明书v1.0.pdf"',
    timestamp: '2024-01-15 14:15:30',
    ip: '192.168.1.102',
    device: 'Firefox 121.0 / Ubuntu'
  },
  {
    user: '张三',
    action: 'update',
    target: '系统设置',
    details: '修改了系统安全设置，启用了双因子认证',
    timestamp: '2024-01-15 14:10:15',
    ip: '192.168.1.100',
    device: 'Chrome 120.0 / Windows 10'
  },
  {
    user: '李四',
    action: 'create',
    target: '项目',
    details: '创建了新项目 "移动端APP开发"',
    timestamp: '2024-01-15 14:05:00',
    ip: '192.168.1.101',
    device: 'Safari 17.0 / macOS'
  },
  {
    user: '王五',
    action: 'login',
    target: '系统',
    details: '用户成功登录系统',
    timestamp: '2024-01-15 14:00:30',
    ip: '192.168.1.102',
    device: 'Firefox 121.0 / Ubuntu'
  }
])

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const userMatch = !filterUser.value || log.user === filterUser.value
    const actionMatch = !filterAction.value || log.action === filterAction.value
    return userMatch && actionMatch
  })
})

const getLogType = (action) => {
  switch (action) {
    case 'login': return 'success'
    case 'create': return 'primary'
    case 'update': return 'warning'
    case 'delete': return 'danger'
    default: return 'info'
  }
}

const getLogIcon = (action) => {
  switch (action) {
    case 'login': return Key
    case 'create': return Plus
    case 'update': return Edit
    case 'delete': return Delete
    default: return Document
  }
}

const getLogIconClass = (action) => {
  return `log-icon log-icon-${action}`
}

const getActionText = (action) => {
  switch (action) {
    case 'login': return '登录了'
    case 'create': return '创建了'
    case 'update': return '更新了'
    case 'delete': return '删除了'
    default: return '操作了'
  }
}
</script>

<style scoped>
.activity-log {
  padding: 20px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.log-header h3 {
  margin: 0;
  color: #303133;
}

.log-filters {
  display: flex;
  align-items: center;
}

.log-content {
  padding: 10px 0;
}

.log-header-info {
  margin-bottom: 8px;
}

.user-name {
  font-weight: bold;
  color: #409eff;
  margin-right: 5px;
}

.action-text {
  color: #303133;
  margin-right: 5px;
}

.target {
  color: #67c23a;
  font-weight: 500;
}

.log-details {
  margin-bottom: 8px;
}

.log-details p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.log-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.log-icon {
  font-size: 14px;
}

.log-icon-login {
  color: #67c23a;
}

.log-icon-create {
  color: #409eff;
}

.log-icon-update {
  color: #e6a23c;
}

.log-icon-delete {
  color: #f56c6c;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}
</style>
```

## API 文档

### Timeline Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| — | — | — | — |

### Timeline Slots

| 插槽名 | 说明 |
|--------|------|
| default | 时间线内容 |

### TimelineItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| timestamp | 时间戳 | `string` | — |
| hide-timestamp | 是否隐藏时间戳 | `boolean` | `false` |
| center | 是否垂直居中 | `boolean` | `false` |
| placement | 时间戳位置 | `'top' / 'bottom'` | `'bottom'` |
| type | 节点类型 | `'primary' / 'success' / 'warning' / 'danger' / 'info'` | — |
| color | 节点颜色 | `string` | — |
| size | 节点尺寸 | `'normal' / 'large'` | `'normal'` |
| icon | 节点图标 | `string / Component` | — |
| hollow | 是否空心点 | `boolean` | `false` |

### TimelineItem Slots

| 插槽名 | 说明 |
|--------|------|
| default | 时间线项内容 |
| dot | 自定义节点 |

## 最佳实践

### 设计原则

1. **时间顺序**：按照时间顺序排列，通常最新的在上方
2. **信息层次**：合理使用标题、描述、详情建立信息层次
3. **视觉区分**：使用不同颜色和图标区分不同类型的事件

### 内容组织

1. **简洁明了**：每个时间点的描述应该简洁明了
2. **关键信息**：突出显示关键信息和重要节点
3. **详情展示**：提供必要的详细信息但不要过于冗长

### 交互设计

1. **筛选功能**：提供用户、类型、时间等筛选功能
2. **展开收起**：对于详细信息可以提供展开收起功能
3. **实时更新**：对于实时数据应该提供自动刷新功能

### 响应式设计

1. **移动端适配**：在移动设备上调整时间戳位置和内容布局
2. **内容优先**：在小屏幕上优先显示重要信息
3. **触摸友好**：确保在触摸设备上有良好的交互体验

## 常见问题

### 时间戳不显示

**问题**：设置了 `timestamp` 但时间戳不显示

**解决方案**：
1. 检查是否设置了 `hide-timestamp="true"`
2. 确认 `timestamp` 属性值不为空
3. 检查 CSS 样式是否影响显示

```vue
<!-- 错误示例 -->
<el-timeline-item hide-timestamp timestamp="2024/1/15">
  内容
</el-timeline-item>

<!-- 正确示例 -->
<el-timeline-item timestamp="2024/1/15">
  内容
</el-timeline-item>
```

### 自定义节点不生效

**问题**：使用了 `dot` 插槽但自定义节点不显示

**解决方案**：确保插槽内容不为空，并且有适当的样式

```vue
<!-- 错误示例 -->
<el-timeline-item>
  <template #dot></template>
  内容
</el-timeline-item>

<!-- 正确示例 -->
<el-timeline-item>
  <template #dot>
    <el-icon><Star /></el-icon>
  </template>
  内容
</el-timeline-item>
```

### 节点样式问题

**问题**：节点颜色或大小设置不生效

**解决方案**：
1. 确保 `color` 属性值为有效的颜色值
2. 检查是否同时设置了 `type` 和 `color`（color 优先级更高）
3. 确认 `size` 属性值正确

```vue
<!-- type 会被 color 覆盖 -->
<el-timeline-item type="success" color="#f56c6c">
  内容
</el-timeline-item>

<!-- 正确使用 -->
<el-timeline-item color="#67c23a">
  内容
</el-timeline-item>
```

### 时间戳位置问题

**问题**：时间戳位置不符合预期

**解决方案**：正确使用 `placement` 属性

```vue
<!-- 时间戳在上方 -->
<el-timeline-item timestamp="2024/1/15" placement="top">
  内容
</el-timeline-item>

<!-- 时间戳在下方（默认） -->
<el-timeline-item timestamp="2024/1/15" placement="bottom">
  内容
</el-timeline-item>
```

## 总结

Timeline 时间线是展示时间序列信息的重要组件，能够清晰地展示事件的时间顺序和状态变化。通过本文档的学习，你应该能够：

1. 理解时间线组件的设计理念和使用场景
2. 掌握基础用法和节点自定义
3. 实现不同状态和样式的时间线
4. 合理使用时间戳和内容布局
5. 在实际项目中构建专业的时间线界面

在实际开发中，建议根据业务场景选择合适的样式和交互方式，注意信息的层次性和可读性，确保时间线能够有效地传达时间序列信息。

## 参考资料

- [Element Plus Timeline 官方文档](https://element-plus.org/zh-CN/component/timeline.html)
- [时间线设计模式](https://ui-patterns.com/patterns/Timeline)
- [信息架构设计指南](https://www.usability.gov/what-and-why/information-architecture.html)