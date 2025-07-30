# Tooltip 文字提示

## 学习目标

通过本章学习，你将掌握：
- **基础文字提示**：掌握 Tooltip 的基本使用方法和属性配置
- **主题和样式**：学会使用内置主题和自定义样式
- **位置控制**：掌握提示框的位置设置和自动调整
- **触发方式**：理解不同触发方式的应用场景
- **HTML内容支持**：安全地使用HTML内容和富文本
- **虚拟触发**：实现高级的虚拟触发功能
- **受控模式**：掌握手动控制提示框的显示和隐藏
- **性能优化**：优化提示框的渲染和交互性能

**预计学习时间：** 45分钟

## 概述

Tooltip 文字提示组件常用于展示鼠标 hover 时的提示信息。它基于 ElPopper 开发，提供了丰富的配置选项和多种展示方式。Tooltip 支持多个方向的展示位置、自定义主题、HTML 内容、虚拟触发等高级功能。

### 主要特性

1. **多方向定位**：支持 12 个方向的精确定位，满足各种布局需求
2. **多种触发方式**：支持 hover、focus、click、contextmenu 四种触发方式
3. **内置主题系统**：提供 dark、light 主题，支持完全自定义主题
4. **富文本内容**：支持纯文本、HTML 内容和 Vue 组件
5. **虚拟触发**：支持触发元素与提示内容分离的高级用法
6. **受控模式**：支持手动控制显示和隐藏状态
7. **动画定制**：支持自定义过渡动画效果
8. **无障碍支持**：完整的键盘导航和屏幕阅读器支持
9. **性能优化**：智能渲染和内存管理
10. **响应式设计**：自动适应不同屏幕尺寸

### 适用场景

- **功能说明**：为按钮、图标等元素提供功能说明
- **表单辅助**：为表单字段提供输入提示和验证信息
- **数据展示**：显示数据的详细信息或统计数据
- **状态说明**：解释当前状态、进度或结果
- **操作指引**：为复杂操作提供步骤指导
- **错误提示**：显示错误信息和解决建议
- **快捷信息**：快速预览内容而无需跳转页面
- **帮助文档**：提供上下文相关的帮助信息

## 基础用法

### 基础用法

在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。使用 `content` 属性来决定 hover 时的提示信息。由 `placement` 属性决定展示效果：`placement` 属性值为：`[方向]-[对齐位置]`；四个方向：`top`、`left`、`right`、`bottom`；三种对齐位置：`start`、`end`，默认为空。如 `placement="left-end"`，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。

```vue
<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Left prompts info"
        placement="top-start"
      >
        <el-button>top-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Center prompts info"
        placement="top"
      >
        <el-button>top</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Top Right prompts info"
        placement="top-end"
      >
        <el-button>top-end</el-button>
      </el-tooltip>
    </div>
    
    <div class="row">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Left Top prompts info"
        placement="left-start"
      >
        <el-button>left-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Right Top prompts info"
        placement="right-start"
      >
        <el-button>right-start</el-button>
      </el-tooltip>
    </div>
    
    <div class="row center">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <el-button>bottom-start</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <el-button>bottom</el-button>
      </el-tooltip>
      
      <el-tooltip
        class="box-item"
        effect="dark"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <el-button>bottom-end</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
```

### 主题

Tooltip 组件内置了两个主题：`dark` 和 `light`。通过设置 `effect` 来修改主题，默认值为 `dark`。

```vue
<template>
  <el-tooltip content="Top center" placement="top">
    <el-button>Dark</el-button>
  </el-tooltip>
  
  <el-tooltip content="Bottom center" placement="bottom" effect="light">
    <el-button>Light</el-button>
  </el-tooltip>
  
  <el-tooltip content="Bottom center" effect="customized">
    <el-button>Customized theme</el-button>
  </el-tooltip>
</template>

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}
.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
```

### 更多内容的文字提示

展示多行文本或者是设置文本内容的格式。用具名 slot `content`，替代 tooltip 中的 `content` 属性。

```vue
<template>
  <el-tooltip placement="top">
    <template #content>
      multiple lines<br />second line
    </template>
    <el-button>Top center</el-button>
  </el-tooltip>
</template>
```

### 高级扩展

除了这些基本设置外，还有一些属性可以让使用者更好的定制自己的效果：`transition` 属性可以定制显隐的动画效果，默认为 `fade-in-linear`。如果需要关闭 tooltip 功能，`disabled` 属性可以满足这个需求，你只需要将其设置为 `true`。

```vue
<template>
  <el-tooltip
    :disabled="disabled"
    content="点击关闭 tooltip 功能"
    placement="bottom"
    effect="light"
  >
    <el-button @click="disabled = !disabled">
      点击{{ disabled ? '开启' : '关闭' }} tooltip 功能
    </el-button>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
const disabled = ref(false)
</script>
```

### 显示 HTML 内容

内容属性可以设置为 HTML 字符串。

```vue
<template>
  <el-tooltip raw-content>
    <template #content>
      <span>HTML content with <strong>bold text</strong></span>
    </template>
    <el-button>HTML Content</el-button>
  </el-tooltip>
</template>
```

**警告**：`content` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 `raw-content` 打开的情况下，请确保 `content` 的内容是可信的，永远不要将用户提交的内容赋值给 `content` 属性。

### 虚拟触发

有时候我们想把 tooltip 的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。

```vue
<template>
  <el-button ref="triggerRef">Trigger</el-button>
  
  <el-tooltip
    ref="tooltipRef"
    virtual-triggering
    :virtual-ref="triggerRef"
    content="Virtual trigger content"
  />
</template>

<script setup>
import { ref } from 'vue'
const triggerRef = ref()
const tooltipRef = ref()
</script>
```

**提示**：需要注意的是，虚拟触发的 tooltip 是受控组件，因此你必须自己去控制 tooltip 是否显示，你将无法通过点击空白处来关闭 tooltip。

### 受控模式

Tooltip 可以通过父组件使用 `:visible` 来控制它的显示与关闭。

```vue
<template>
  <el-tooltip
    :visible="visible"
    content="Controlled tooltip"
    placement="top"
  >
    <el-button @click="visible = !visible">
      Click to {{ visible ? 'hide' : 'show' }} tooltip
    </el-button>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

### 自定义动画

Tooltip 可以自定义动画，您可以使用 `transition` 设置所需的动画效果。

```vue
<template>
  <el-tooltip
    content="Custom animation"
    transition="my-fade"
    placement="top"
  >
    <el-button>Custom Animation</el-button>
  </el-tooltip>
</template>

<style>
.my-fade-enter-active,
.my-fade-leave-active {
  transition: opacity 0.5s ease;
}
.my-fade-enter-from,
.my-fade-leave-to {
  opacity: 0;
}
</style>
```

## 实际应用示例

### 表单辅助系统

```vue
<template>
  <div class="form-helper-demo">
    <h3>表单辅助系统</h3>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="用户名" prop="username">
        <el-tooltip
          content="用户名长度为 3-20 个字符，支持字母、数字和下划线"
          placement="right"
          effect="light"
        >
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            :prefix-icon="User"
          />
        </el-tooltip>
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-tooltip
          placement="right"
          effect="light"
        >
          <template #content>
            <div class="tooltip-content">
              <p><strong>邮箱格式要求：</strong></p>
              <ul>
                <li>必须包含 @ 符号</li>
                <li>域名部分必须有效</li>
                <li>支持常见邮箱服务商</li>
              </ul>
              <p class="example">示例：user@example.com</p>
            </div>
          </template>
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱地址"
            :prefix-icon="Message"
          />
        </el-tooltip>
      </el-form-item>
      
      <el-form-item label="密码强度" prop="password">
        <div class="password-wrapper">
          <el-input 
            v-model="form.password" 
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            @input="checkPasswordStrength"
          />
          <el-tooltip
            :content="passwordTooltip"
            placement="right"
            :effect="passwordStrength.level >= 3 ? 'dark' : 'light'"
            :disabled="!form.password"
          >
            <div class="password-strength">
              <div 
                v-for="(item, index) in 4" 
                :key="index"
                class="strength-bar"
                :class="{
                  'weak': index < passwordStrength.level && passwordStrength.level <= 1,
                  'medium': index < passwordStrength.level && passwordStrength.level === 2,
                  'strong': index < passwordStrength.level && passwordStrength.level === 3,
                  'very-strong': index < passwordStrength.level && passwordStrength.level === 4
                }"
              ></div>
            </div>
          </el-tooltip>
        </div>
      </el-form-item>
      
      <el-form-item label="生日" prop="birthday">
        <el-tooltip
          content="选择您的出生日期，用于年龄验证和生日提醒"
          placement="right"
          effect="light"
        >
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
        </el-tooltip>
      </el-form-item>
      
      <el-form-item label="技能标签" prop="skills">
        <div class="skills-wrapper">
          <el-tooltip
            content="点击添加您擅长的技能标签，最多可添加 10 个"
            placement="top"
            effect="light"
          >
            <el-tag
              v-for="skill in form.skills"
              :key="skill"
              closable
              @close="removeSkill(skill)"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
          </el-tooltip>
          
          <el-input
            v-if="inputVisible"
            ref="inputRef"
            v-model="inputValue"
            class="skill-input"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          
          <el-tooltip
            content="添加新技能"
            placement="top"
            v-else
          >
            <el-button 
              class="add-skill-btn" 
              size="small" 
              @click="showInput"
              :disabled="form.skills.length >= 10"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-tooltip
          :content="submitTooltip"
          placement="top"
          :disabled="isFormValid"
        >
          <el-button 
            type="primary" 
            @click="submitForm"
            :disabled="!isFormValid"
          >
            提交表单
          </el-button>
        </el-tooltip>
        
        <el-tooltip
          content="重置所有表单字段"
          placement="top"
        >
          <el-button @click="resetForm">重置</el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { User, Message, Lock, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const inputRef = ref()
const inputVisible = ref(false)
const inputValue = ref('')

const form = ref({
  username: '',
  email: '',
  password: '',
  birthday: '',
  skills: ['JavaScript', 'Vue.js']
})

const passwordStrength = ref({
  level: 0,
  text: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' }
  ],
  birthday: [
    { required: true, message: '请选择生日', trigger: 'change' }
  ]
}

const passwordTooltip = computed(() => {
  if (!form.value.password) return '请输入密码'
  
  const tips = {
    0: '密码强度：无',
    1: '密码强度：弱 - 建议包含大小写字母、数字和特殊字符',
    2: '密码强度：中等 - 可以增加特殊字符提高安全性',
    3: '密码强度：强 - 密码安全性良好',
    4: '密码强度：非常强 - 密码安全性极佳'
  }
  
  return tips[passwordStrength.value.level] || tips[0]
})

const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password && 
         form.value.birthday &&
         passwordStrength.value.level >= 2
})

const submitTooltip = computed(() => {
  if (isFormValid.value) return '提交表单'
  
  const missing = []
  if (!form.value.username) missing.push('用户名')
  if (!form.value.email) missing.push('邮箱')
  if (!form.value.password) missing.push('密码')
  if (!form.value.birthday) missing.push('生日')
  if (passwordStrength.value.level < 2) missing.push('密码强度不足')
  
  return `请完善以下信息：${missing.join('、')}`
})

const checkPasswordStrength = (password) => {
  let level = 0
  
  if (password.length >= 6) level++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) level++
  if (/\d/.test(password)) level++
  if (/[^\w\s]/.test(password)) level++
  
  passwordStrength.value.level = level
}

const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const removeSkill = (skill) => {
  const index = form.value.skills.indexOf(skill)
  if (index > -1) {
    form.value.skills.splice(index, 1)
  }
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && !form.value.skills.includes(inputValue.value)) {
    form.value.skills.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('表单提交成功！')
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.value.skills = []
  passwordStrength.value = { level: 0, text: '' }
}
</script>

<style scoped>
.form-helper-demo {
  max-width: 600px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.tooltip-content {
  max-width: 250px;
}

.tooltip-content p {
  margin: 0 0 8px 0;
}

.tooltip-content ul {
  margin: 8px 0;
  padding-left: 16px;
}

.tooltip-content li {
  margin-bottom: 4px;
}

.example {
  color: #909399;
  font-style: italic;
}

.password-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.password-strength {
  display: flex;
  gap: 2px;
  cursor: pointer;
}

.strength-bar {
  width: 4px;
  height: 20px;
  background-color: #e4e7ed;
  border-radius: 2px;
  transition: background-color 0.3s;
}

.strength-bar.weak {
  background-color: #f56c6c;
}

.strength-bar.medium {
  background-color: #e6a23c;
}

.strength-bar.strong {
  background-color: #67c23a;
}

.strength-bar.very-strong {
  background-color: #409eff;
}

.skills-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.skill-tag {
  margin: 0;
}

.skill-input {
  width: 80px;
}

.add-skill-btn {
  border-style: dashed;
}
</style>
```

### 数据可视化提示

```vue
<template>
  <div class="data-visualization-demo">
    <h3>数据可视化提示</h3>
    
    <div class="dashboard">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div 
          v-for="stat in stats" 
          :key="stat.id"
          class="stat-card"
        >
          <el-tooltip
            placement="top"
            :show-after="300"
          >
            <template #content>
              <div class="stat-tooltip">
                <h4>{{ stat.title }}</h4>
                <p class="current-value">当前值：{{ stat.value }}</p>
                <p class="trend">较昨日：
                  <span :class="stat.trend > 0 ? 'positive' : 'negative'">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                </p>
                <div class="details">
                  <p>最高值：{{ stat.max }}</p>
                  <p>最低值：{{ stat.min }}</p>
                  <p>平均值：{{ stat.avg }}</p>
                </div>
                <p class="update-time">更新时间：{{ stat.updateTime }}</p>
              </div>
            </template>
            
            <div class="stat-content">
              <div class="stat-icon" :class="stat.iconClass">
                <el-icon><component :is="stat.icon" /></el-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stat.value }}</h3>
                <p>{{ stat.title }}</p>
                <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
                  <el-icon>
                    <component :is="stat.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
                  </el-icon>
                  <span>{{ Math.abs(stat.trend) }}%</span>
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="chart-section">
        <h4>销售趋势图</h4>
        <div class="chart-container">
          <div 
            v-for="(point, index) in chartData" 
            :key="index"
            class="chart-point"
            :style="{ 
              left: `${(index / (chartData.length - 1)) * 100}%`,
              bottom: `${(point.value / maxValue) * 100}%`
            }"
          >
            <el-tooltip
              placement="top"
              :show-after="200"
              :hide-after="100"
            >
              <template #content>
                <div class="chart-tooltip">
                  <p class="date">{{ point.date }}</p>
                  <p class="value">销售额：¥{{ point.value.toLocaleString() }}</p>
                  <p class="orders">订单数：{{ point.orders }}</p>
                  <p class="conversion">转化率：{{ point.conversion }}%</p>
                  <div class="comparison">
                    <p>环比：
                      <span :class="point.change > 0 ? 'positive' : 'negative'">
                        {{ point.change > 0 ? '+' : '' }}{{ point.change }}%
                      </span>
                    </p>
                  </div>
                </div>
              </template>
              
              <div class="point" :class="point.change > 0 ? 'positive' : 'negative'"></div>
            </el-tooltip>
          </div>
        </div>
      </div>
      
      <!-- 用户列表 -->
      <div class="user-list-section">
        <h4>活跃用户</h4>
        <div class="user-list">
          <div 
            v-for="user in users" 
            :key="user.id"
            class="user-item"
          >
            <el-tooltip
              placement="right"
              :show-after="500"
            >
              <template #content>
                <div class="user-tooltip">
                  <div class="user-header">
                    <img :src="user.avatar" :alt="user.name" class="avatar" />
                    <div>
                      <h4>{{ user.name }}</h4>
                      <p class="user-id">ID: {{ user.id }}</p>
                    </div>
                  </div>
                  
                  <div class="user-stats">
                    <div class="stat-row">
                      <span>注册时间：</span>
                      <span>{{ user.registerDate }}</span>
                    </div>
                    <div class="stat-row">
                      <span>最后登录：</span>
                      <span>{{ user.lastLogin }}</span>
                    </div>
                    <div class="stat-row">
                      <span>总消费：</span>
                      <span class="amount">¥{{ user.totalSpent.toLocaleString() }}</span>
                    </div>
                    <div class="stat-row">
                      <span>订单数：</span>
                      <span>{{ user.orderCount }}</span>
                    </div>
                    <div class="stat-row">
                      <span>会员等级：</span>
                      <el-tag :type="user.levelType" size="small">{{ user.level }}</el-tag>
                    </div>
                  </div>
                  
                  <div class="user-actions">
                    <el-button size="small" type="primary">查看详情</el-button>
                    <el-button size="small">发送消息</el-button>
                  </div>
                </div>
              </template>
              
              <div class="user-basic">
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <div class="user-info">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-status" :class="user.online ? 'online' : 'offline'">
                    {{ user.online ? '在线' : '离线' }}
                  </span>
                </div>
                <div class="user-value">¥{{ user.totalSpent.toLocaleString() }}</div>
              </div>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  TrendCharts,
  User,
  ShoppingBag,
  Money,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

const stats = ref([
  {
    id: 1,
    title: '总销售额',
    value: '¥1,234,567',
    trend: 12.5,
    max: '¥1,500,000',
    min: '¥800,000',
    avg: '¥1,100,000',
    updateTime: '2024-01-15 14:30:00',
    icon: 'Money',
    iconClass: 'money'
  },
  {
    id: 2,
    title: '订单数量',
    value: '8,456',
    trend: -3.2,
    max: '10,000',
    min: '6,000',
    avg: '8,200',
    updateTime: '2024-01-15 14:30:00',
    icon: 'ShoppingBag',
    iconClass: 'orders'
  },
  {
    id: 3,
    title: '活跃用户',
    value: '12,345',
    trend: 8.7,
    max: '15,000',
    min: '10,000',
    avg: '12,000',
    updateTime: '2024-01-15 14:30:00',
    icon: 'User',
    iconClass: 'users'
  },
  {
    id: 4,
    title: '转化率',
    value: '3.45%',
    trend: 1.2,
    max: '4.2%',
    min: '2.8%',
    avg: '3.3%',
    updateTime: '2024-01-15 14:30:00',
    icon: 'TrendCharts',
    iconClass: 'conversion'
  }
])

const chartData = ref([
  { date: '01-10', value: 120000, orders: 450, conversion: 3.2, change: 5.2 },
  { date: '01-11', value: 135000, orders: 520, conversion: 3.5, change: 12.5 },
  { date: '01-12', value: 148000, orders: 580, conversion: 3.8, change: 9.6 },
  { date: '01-13', value: 132000, orders: 490, conversion: 3.3, change: -10.8 },
  { date: '01-14', value: 156000, orders: 620, conversion: 4.1, change: 18.2 },
  { date: '01-15', value: 142000, orders: 550, conversion: 3.6, change: -9.0 }
])

const maxValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value))
})

const users = ref([
  {
    id: 'U001',
    name: '张三',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    online: true,
    registerDate: '2023-06-15',
    lastLogin: '2024-01-15 13:45',
    totalSpent: 15680,
    orderCount: 28,
    level: '金牌会员',
    levelType: 'warning'
  },
  {
    id: 'U002',
    name: '李四',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    online: false,
    registerDate: '2023-08-22',
    lastLogin: '2024-01-14 20:30',
    totalSpent: 8920,
    orderCount: 15,
    level: '银牌会员',
    levelType: 'info'
  },
  {
    id: 'U003',
    name: '王五',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    online: true,
    registerDate: '2023-03-10',
    lastLogin: '2024-01-15 14:20',
    totalSpent: 32450,
    orderCount: 56,
    level: '钻石会员',
    levelType: 'success'
  }
])
</script>

<style scoped>
.data-visualization-demo {
  max-width: 1000px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.money { background: linear-gradient(135deg, #67c23a, #85ce61); }
.stat-icon.orders { background: linear-gradient(135deg, #409eff, #66b1ff); }
.stat-icon.users { background: linear-gradient(135deg, #e6a23c, #ebb563); }
.stat-icon.conversion { background: linear-gradient(135deg, #f56c6c, #f78989); }

.stat-info h3 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-info p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-trend.up { color: #67c23a; }
.stat-trend.down { color: #f56c6c; }

.stat-tooltip h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

.stat-tooltip .current-value {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-tooltip .trend {
  margin-bottom: 12px;
}

.stat-tooltip .positive { color: #67c23a; }
.stat-tooltip .negative { color: #f56c6c; }

.stat-tooltip .details {
  padding: 8px 0;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  margin: 12px 0;
}

.stat-tooltip .details p {
  margin: 4px 0;
  font-size: 12px;
}

.stat-tooltip .update-time {
  font-size: 11px;
  color: #909399;
  margin: 8px 0 0 0;
}

.chart-section {
  background: white;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.chart-container {
  position: relative;
  height: 200px;
  margin-top: 20px;
  border-bottom: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed;
}

.chart-point {
  position: absolute;
  cursor: pointer;
}

.point {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, 50%);
  transition: transform 0.2s;
}

.point.positive {
  background-color: #67c23a;
}

.point.negative {
  background-color: #f56c6c;
}

.point:hover {
  transform: translate(-50%, 50%) scale(1.2);
}

.chart-tooltip .date {
  font-weight: 600;
  margin-bottom: 8px;
}

.chart-tooltip .value {
  font-size: 16px;
  color: #409eff;
  margin-bottom: 4px;
}

.chart-tooltip .comparison {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e4e7ed;
}

.user-list-section {
  background: white;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.user-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-basic {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: #303133;
}

.user-status {
  font-size: 12px;
}

.user-status.online {
  color: #67c23a;
}

.user-status.offline {
  color: #909399;
}

.user-value {
  font-weight: 600;
  color: #409eff;
}

.user-tooltip .user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-tooltip .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.user-tooltip h4 {
  margin: 0;
  color: #303133;
}

.user-tooltip .user-id {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #909399;
}

.user-stats {
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.stat-row span:first-child {
  color: #606266;
}

.stat-row .amount {
  color: #409eff;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 8px;
}
</style>
```

## API

### Attributes

| 名称 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | CSSSelector / HTMLElement | — | — |
| effect | Tooltip 主题，内置了 dark / light 两种 | string | dark / light | dark |
| content | 显示的内容，也可被 slot#content 覆盖 | string | — | '' |
| raw-content | content 中的内容是否作为 HTML 字符串处理 | boolean | — | false |
| placement | Tooltip 组件出现的位置 | string | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom |
| fallback-placements | Tooltip 可用的 positions 请查看 popper.js 文档 | array | — | — |
| visible / v-model:visible | Tooltip 组件可见性 | boolean | — | — |
| disabled | Tooltip 组件是否禁用 | boolean | — | — |
| offset | 出现位置的偏移量 | number | — | 12 |
| transition | 动画名称 | string | — | — |
| popper-options | popper.js 参数 | object | — | {} |
| arrow-offset | 控制 Tooltip 的箭头相对于弹出窗口的偏移 | number | — | 5 |
| show-after | 在触发后多久显示内容，单位毫秒 | number | — | 0 |
| show-arrow | tooltip 的内容是否有箭头 | boolean | — | true |
| hide-after | 延迟关闭，单位毫秒 | number | — | 200 |
| auto-close | tooltip 出现后自动隐藏延时，单位毫秒 | number | — | 0 |
| popper-class | 为 Tooltip 的 popper 添加类名 | string | — | — |
| enterable | 鼠标是否可进入到 tooltip 中 | boolean | — | true |
| teleported | 是否使用 teleport。设置成 true 则会被追加到 append-to 的位置 | boolean | — | true |
| trigger | 如何触发 Tooltip | string | hover / focus / click / contextmenu | hover |
| virtual-triggering | 用来标识虚拟触发是否被启用 | boolean | — | — |
| virtual-ref | 标识虚拟触发时的触发元素 | HTMLElement | — | — |
| trigger-keys | 当鼠标点击或者聚焦在触发元素上时，可以定义一组键盘按键并且通过它们来控制 Tooltip 的显示 | Array | — | ['Enter', 'Space'] |
| persistent | 当 tooltip 组件长时间不触发且 persistent 属性设置为 false 时，popconfirm 将会被删除 | boolean | — | — |
| aria-label | a11y 和 aria-label 属性保持一致 | string | — | — |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | Tooltip 触发 & 引用的元素 |
| content | 自定义内容 |

### Exposes

| 名称 | 详情 | 类型 |
|------|------|------|
| popperRef | el-popper 组件实例 | object |
| contentRef | el-tooltip-content 组件实例 | object |
| isFocusInsideContent | 验证当前焦点事件是否在 el-tooltip-content 中触发 | Function |

## 常见问题

### Tooltip 不显示或位置不正确

**问题描述：** Tooltip 无法正常显示或显示位置偏移

**解决方案：**

```vue
<template>
  <div class="tooltip-issues-demo">
    <h4>常见问题解决方案</h4>
    
    <!-- 问题1：父容器 overflow 导致的显示问题 -->
    <div class="container-issue">
      <h5>1. 父容器 overflow 问题</h5>
      <div class="overflow-container">
        <el-tooltip
          content="这个 tooltip 可能会被父容器裁剪"
          placement="top"
          :teleported="true"
        >
          <el-button>悬停查看（已修复）</el-button>
        </el-tooltip>
      </div>
      <p class="solution">解决方案：使用 <code>:teleported="true"</code> 将弹出层渲染到 body</p>
    </div>
    
    <!-- 问题2：动态内容更新 -->
    <div class="dynamic-content-issue">
      <h5>2. 动态内容更新问题</h5>
      <el-tooltip
        ref="dynamicTooltip"
        :content="dynamicContent"
        placement="right"
      >
        <el-button @click="updateContent">点击更新内容</el-button>
      </el-tooltip>
      <p class="solution">解决方案：使用响应式数据或手动调用 updatePopper 方法</p>
    </div>
    
    <!-- 问题3：disabled 元素的 tooltip -->
    <div class="disabled-element-issue">
      <h5>3. Disabled 元素 Tooltip 问题</h5>
      <div class="disabled-wrapper">
        <el-tooltip content="禁用按钮的提示信息" placement="top">
          <span class="disabled-container">
            <el-button disabled>禁用按钮</el-button>
          </span>
        </el-tooltip>
      </div>
      <p class="solution">解决方案：用 span 包装 disabled 元素</p>
    </div>
    
    <!-- 问题4：性能优化 -->
    <div class="performance-issue">
      <h5>4. 大量 Tooltip 性能问题</h5>
      <div class="tooltip-list">
        <div 
          v-for="item in largeList" 
          :key="item.id"
          class="list-item"
        >
          <el-tooltip
            :content="item.tooltip"
            placement="top"
            :show-after="300"
            :hide-after="100"
          >
            <span>{{ item.name }}</span>
          </el-tooltip>
        </div>
      </div>
      <p class="solution">解决方案：设置合适的延迟时间，避免频繁触发</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const dynamicTooltip = ref()
const dynamicContent = ref('初始内容')
const contentIndex = ref(0)

const contents = [
  '初始内容',
  '更新后的内容',
  '再次更新的内容',
  '最终内容'
]

const updateContent = () => {
  contentIndex.value = (contentIndex.value + 1) % contents.length
  dynamicContent.value = contents[contentIndex.value]
  
  // 手动更新 popper 位置（如果需要）
  nextTick(() => {
    dynamicTooltip.value?.updatePopper?.()
  })
}

const largeList = ref(
  Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `项目 ${index + 1}`,
    tooltip: `这是项目 ${index + 1} 的详细说明信息`
  }))
)
</script>

<style scoped>
.tooltip-issues-demo {
  max-width: 800px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.container-issue,
.dynamic-content-issue,
.disabled-element-issue,
.performance-issue {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.overflow-container {
  width: 200px;
  height: 60px;
  overflow: hidden;
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
}

.disabled-wrapper {
  margin: 10px 0;
}

.disabled-container {
  display: inline-block;
}

.tooltip-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.list-item {
  padding: 8px;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f0f9ff;
}

.solution {
  margin-top: 8px;
  padding: 8px;
  background-color: #e8f5e8;
  border-left: 3px solid #67c23a;
  font-size: 14px;
  color: #606266;
}

.solution code {
  background-color: #f1f1f1;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}
</style>
```

### 自定义样式问题

**问题描述：** 需要自定义 Tooltip 的样式但不知道如何覆盖默认样式

**解决方案：**

```vue
<template>
  <div class="custom-style-demo">
    <h4>自定义样式示例</h4>
    
    <!-- 使用 popper-class 自定义样式 -->
    <el-tooltip
      content="自定义样式的 tooltip"
      placement="top"
      popper-class="custom-tooltip"
    >
      <el-button type="primary">自定义样式</el-button>
    </el-tooltip>
    
    <!-- 使用 CSS 变量自定义主题 -->
    <el-tooltip
      content="使用 CSS 变量的 tooltip"
      placement="right"
      popper-class="theme-tooltip"
    >
      <el-button type="success">主题样式</el-button>
    </el-tooltip>
  </div>
</template>

<style>
/* 全局样式，注意不要使用 scoped */
.custom-tooltip {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.custom-tooltip .el-tooltip__arrow::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
}

.theme-tooltip {
  --el-tooltip-bg-color: #2c3e50;
  --el-tooltip-text-color: #ecf0f1;
  --el-tooltip-border-color: #34495e;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
```

### 虚拟触发使用问题

**问题描述：** 虚拟触发模式下如何正确控制显示和隐藏

**解决方案：**

```vue
<template>
  <div class="virtual-trigger-demo">
    <h4>虚拟触发最佳实践</h4>
    
    <el-tooltip
      ref="virtualTooltip"
      virtual-triggering
      :virtual-ref="triggerRef"
      content="虚拟触发的 tooltip"
      placement="top"
    />
    
    <div class="trigger-area">
      <div 
        ref="triggerRef"
        class="virtual-trigger"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
        @click="toggleTooltip"
      >
        虚拟触发区域
      </div>
    </div>
    
    <div class="controls">
      <el-button @click="showTooltip">显示</el-button>
      <el-button @click="hideTooltip">隐藏</el-button>
      <el-button @click="toggleTooltip">切换</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const virtualTooltip = ref()
const triggerRef = ref()

const showTooltip = () => {
  virtualTooltip.value?.show()
}

const hideTooltip = () => {
  virtualTooltip.value?.hide()
}

const toggleTooltip = () => {
  if (virtualTooltip.value?.visible) {
    hideTooltip()
  } else {
    showTooltip()
  }
}
</script>

<style scoped>
.virtual-trigger-demo {
  max-width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.trigger-area {
  margin: 20px 0;
}

.virtual-trigger {
  width: 200px;
  height: 100px;
  border: 2px dashed #409eff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #409eff;
  font-weight: 500;
}

.virtual-trigger:hover {
  background-color: #ecf5ff;
  border-color: #66b1ff;
}

.controls {
  display: flex;
  gap: 8px;
}
</style>
```

## 最佳实践

### 选择合适的触发方式
- **hover**：适用于桌面端的信息提示，提供即时反馈
- **click**：适用于需要用户主动触发的场景，避免误触
- **focus**：适用于表单元素的辅助说明，符合无障碍规范
- **manual**：适用于需要程序控制的复杂交互场景

### 合理设置位置和延迟
- 根据触发元素在页面中的位置选择合适的方向
- 设置适当的 `show-after` 延迟，避免鼠标快速划过时频繁触发
- 使用 `hide-after` 给用户足够时间阅读内容
- 考虑移动端的触摸交互体验

### 控制内容长度和格式
- 保持提示内容简洁明了，一般不超过 2-3 行
- 使用清晰的层次结构组织复杂内容
- 避免在 Tooltip 中放置交互元素（除非必要）
- 考虑使用 Popover 替代内容较多的 Tooltip

### 安全使用 HTML 内容
- 只在必要时使用 `raw-content` 属性
- 确保 HTML 内容来源可信，防止 XSS 攻击
- 避免复杂的 HTML 结构影响性能
- 优先使用插槽方式自定义内容

### 性能优化策略
- 在大量元素场景下合理设置延迟时间
- 考虑使用虚拟触发减少 DOM 节点数量
- 避免在 Tooltip 内容中使用复杂的响应式数据
- 适当使用 `teleported` 属性优化渲染性能

### 无障碍访问支持
- 确保 Tooltip 内容对屏幕阅读器友好
- 提供键盘导航支持（Tab 键聚焦）
- 考虑色彩对比度符合 WCAG 标准
- 为重要信息提供替代的访问方式

### 一致性和用户体验
- 在整个应用中保持 Tooltip 样式的一致性
- 避免过度使用，只在真正需要时添加 Tooltip
- 确保 Tooltip 不会遮挡重要的页面内容
- 在移动端考虑使用其他交互方式替代 hover 触发

## 总结

Tooltip 文字提示组件是 Element Plus 中一个功能强大且灵活的组件，具有以下核心特点：

### 核心特点
- **多方向定位**：支持 12 个方向的智能定位
- **多种触发方式**：hover、click、focus、manual 等触发模式
- **内置主题系统**：dark、light 主题及自定义主题支持
- **富文本内容**：支持纯文本、HTML 内容和 Vue 插槽
- **虚拟触发**：支持虚拟元素触发，提供更大的灵活性
- **受控模式**：完全的程序化控制显示状态
- **动画定制**：可自定义过渡动画效果
- **无障碍支持**：符合 ARIA 规范的无障碍访问
- **性能优化**：智能的显示延迟和位置计算
- **响应式设计**：自适应不同屏幕尺寸和设备

### 适用场景
- **功能说明**：为按钮、图标等元素提供功能说明
- **表单辅助**：为表单字段提供输入提示和验证信息
- **数据展示**：在图表、列表中显示详细数据信息
- **状态说明**：解释当前状态或操作结果
- **操作指引**：为复杂操作提供步骤指导
- **错误提示**：显示错误信息和解决建议
- **快捷信息**：提供快速访问的补充信息
- **帮助文档**：嵌入式的帮助和说明文档

### 最佳实践建议
1. **合理选择触发方式**，根据使用场景选择最适合的交互模式
2. **控制内容长度**，保持信息简洁明了，避免信息过载
3. **注意性能影响**，在大量元素场景下优化渲染和交互性能
4. **保持一致性**，在整个应用中维护统一的视觉和交互风格
5. **考虑无障碍**，确保所有用户都能正常访问和使用
6. **移动端适配**，为触摸设备提供合适的交互体验
7. **安全第一**，谨慎使用 HTML 内容，防范安全风险
8. **用户体验优先**，避免过度使用，确保不干扰正常操作

Tooltip 组件通过其丰富的功能和灵活的配置选项，能够满足各种复杂的用户界面需求，是构建现代 Web 应用不可或缺的基础组件。

## 参考资料

- [Element Plus Tooltip 官方文档](https://element-plus.org/zh-CN/component/tooltip.html)
- [Floating UI 定位引擎](https://floating-ui.com/)
- [Vue 3 组合式 API](https://cn.vuejs.org/guide/extras/composition-api-faq.html)
- [Web 无障碍访问指南 (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA 最佳实践指南](https://www.w3.org/WAI/ARIA/apg/)
- [CSS 动画性能优化](https://web.dev/animations-guide/)
- [前端安全防护指南](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

1. **Q: Tooltip 不显示？**
   A: 检查触发元素是否能接收相应的事件，确保 `disabled` 属性未设置为 `true`

2. **Q: 如何在 disabled 的表单元素上显示 Tooltip？**
   A: 在 disabled 表单元素外层添加一层包裹元素，将 Tooltip 应用到包裹元素上

3. **Q: Tooltip 内容可以包含链接吗？**
   A: Tooltip 内不支持 `router-link` 组件，请使用 `vm.$router.push` 代替

4. **Q: 如何自定义 Tooltip 的样式？**
   A: 使用 `popper-class` 属性添加自定义类名，或者使用 `effect` 属性设置自定义主题

5. **Q: 虚拟触发模式下如何关闭 Tooltip？**
   A: 虚拟触发的 Tooltip 是受控组件，需要手动控制 `visible` 属性来关闭

6. **Q: 如何设置 Tooltip 的延迟显示和隐藏？**
   A: 使用 `show-after` 和 `hide-after` 属性分别控制显示和隐藏的延迟时间

## 实践项目

### 智能提示系统
创建一个完整的智能提示系统，包含以下功能：

1. **多场景提示**
   - 实现表单字段的帮助提示
   - 支持按钮和图标的功能说明
   - 处理数据展示的详细信息提示

2. **自适应提示**
   - 实现提示内容的自动截断和展开
   - 支持动态内容的加载和更新
   - 处理多语言环境下的提示显示

3. **主题定制系统**
   - 实现多套提示主题
   - 支持暗黑模式和亮色模式
   - 处理品牌色彩的定制

4. **提示管理器**
   - 实现提示的全局配置
   - 支持提示的批量控制
   - 处理提示的性能监控

### 实践要点
- 合理选择触发方式和显示时机
- 实现提示内容的动态加载
- 处理提示的位置自适应
- 确保提示的无障碍访问
- 优化大量提示的性能

## 学习检查清单

### 基础功能
- [ ] 掌握 Tooltip 的基本使用方法
- [ ] 理解不同触发方式的特点
- [ ] 熟练使用 `placement`、`effect` 等基础属性
- [ ] 掌握 `content` 和插槽的使用

### 高级功能
- [ ] 实现虚拟触发功能
- [ ] 处理HTML内容的安全显示
- [ ] 自定义提示的样式和动画
- [ ] 实现受控模式的提示

### 性能优化
- [ ] 理解提示的渲染机制
- [ ] 合理使用延迟显示和隐藏
- [ ] 优化提示的内存使用
- [ ] 处理大量提示的性能问题

### 用户体验
- [ ] 实现提示的响应式设计
- [ ] 处理键盘导航和焦点管理
- [ ] 提供清晰的视觉层次
- [ ] 确保提示的无障碍访问

## 注意事项

### 弹出层的层级管理
- 合理设置提示的层级关系
- 避免提示被其他元素遮挡
- 注意提示与页面元素的层级冲突
- 控制同时显示的提示数量

### 用户操作的连贯性
- 保持提示操作的逻辑性
- 提供合适的显示和隐藏时机
- 避免过于频繁的提示显示
- 确保提示不会干扰用户操作

### 移动端的交互体验
- 在小屏幕设备上优化提示尺寸
- 支持触摸操作的提示触发
- 考虑手指遮挡对提示的影响
- 提供合适的触发区域大小

### 弹出层的性能影响
- 避免在提示中渲染复杂内容
- 使用合适的显示延迟减少闪烁
- 及时清理不需要的提示实例
- 监控提示对页面性能的影响

---

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 智能提示系统
- [ ] 多场景提示实现
- [ ] 自适应提示功能
- [ ] 主题定制系统
- [ ] 提示管理器