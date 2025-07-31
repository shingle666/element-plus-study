# Result 结果

## 概述

Result 结果组件用于对用户的一系列操作任务或者异常状态做反馈，当有重要操作需告知用户处理结果，且反馈内容较为复杂时使用。它提供了成功、警告、错误、信息等多种状态的反馈展示。<mcreference link="https://element-plus.org/zh-CN/component/result.html" index="0">0</mcreference>

## 学习目标

- 掌握 Result 组件的基础用法
- 学会使用不同的状态类型
- 理解自定义图标和内容的方法
- 掌握在实际场景中的应用
- 了解最佳实践和设计原则

## 基础用法

### 基础结果页面

最简单的用法，展示操作结果的反馈信息。<mcreference link="https://element-plus.org/zh-CN/component/result.html" index="0">0</mcreference>

```vue
<template>
  <div class="result-demo">
    <h3>基础结果页面</h3>
    
    <div class="result-container">
      <el-result
        icon="success"
        title="操作成功"
        sub-title="您的操作已经成功完成，可以继续进行下一步操作。"
      >
        <template #extra>
          <el-button type="primary" @click="handleContinue">
            继续操作
          </el-button>
          <el-button @click="handleBack">
            返回首页
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const handleContinue = () => {
  ElMessage.success('继续操作')
}

const handleBack = () => {
  ElMessage.info('返回首页')
}
</script>

<style scoped>
.result-container {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
</style>
```

### 不同状态类型

Result 组件支持 success、warning、error、info 四种状态。<mcreference link="https://element-plus.org/zh-CN/component/result.html" index="0">0</mcreference>

```vue
<template>
  <div class="status-demo">
    <h3>不同状态类型</h3>
    
    <div class="status-controls">
      <el-radio-group v-model="currentStatus">
        <el-radio-button label="success">成功</el-radio-button>
        <el-radio-button label="warning">警告</el-radio-button>
        <el-radio-button label="error">错误</el-radio-button>
        <el-radio-button label="info">信息</el-radio-button>
      </el-radio-group>
    </div>
    
    <div class="result-container">
      <el-result
        :icon="currentStatus"
        :title="statusConfig[currentStatus].title"
        :sub-title="statusConfig[currentStatus].subTitle"
      >
        <template #extra>
          <el-button
            v-for="action in statusConfig[currentStatus].actions"
            :key="action.text"
            :type="action.type"
            @click="action.handler"
          >
            {{ action.text }}
          </el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const currentStatus = ref('success')

const statusConfig = {
  success: {
    title: '操作成功',
    subTitle: '您的操作已经成功完成，系统已为您保存相关信息。',
    actions: [
      { text: '继续操作', type: 'primary', handler: () => ElMessage.success('继续操作') },
      { text: '查看详情', type: '', handler: () => ElMessage.info('查看详情') }
    ]
  },
  warning: {
    title: '操作警告',
    subTitle: '操作已完成，但存在一些需要注意的问题，请仔细检查。',
    actions: [
      { text: '重新检查', type: 'warning', handler: () => ElMessage.warning('重新检查') },
      { text: '忽略警告', type: '', handler: () => ElMessage.info('忽略警告') }
    ]
  },
  error: {
    title: '操作失败',
    subTitle: '很抱歉，操作执行失败，请检查输入信息或稍后重试。',
    actions: [
      { text: '重试', type: 'danger', handler: () => ElMessage.error('重试操作') },
      { text: '联系客服', type: '', handler: () => ElMessage.info('联系客服') }
    ]
  },
  info: {
    title: '信息提示',
    subTitle: '这是一条重要的信息提示，请仔细阅读相关内容。',
    actions: [
      { text: '我知道了', type: 'primary', handler: () => ElMessage.info('已确认') },
      { text: '查看帮助', type: '', handler: () => ElMessage.info('查看帮助') }
    ]
  }
}
</script>

<style scoped>
.status-controls {
  margin-bottom: 24px;
  text-align: center;
}

.result-container {
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
</style>
```

### 自定义图标

可以通过 icon 插槽自定义图标内容。<mcreference link="https://element-plus.org/zh-CN/component/result.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-icon-demo">
    <h3>自定义图标</h3>
    
    <div class="icon-examples">
      <!-- 自定义 SVG 图标 -->
      <div class="result-item">
        <el-result
          title="自定义 SVG 图标"
          sub-title="使用自定义的 SVG 图标展示特殊状态"
        >
          <template #icon>
            <div class="custom-icon custom-svg">
              <svg viewBox="0 0 1024 1024" width="64" height="64">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" fill="#52c41a"/>
              </svg>
            </div>
          </template>
          <template #extra>
            <el-button type="success">确认</el-button>
          </template>
        </el-result>
      </div>
      
      <!-- Element Plus 图标 -->
      <div class="result-item">
        <el-result
          title="Element Plus 图标"
          sub-title="使用 Element Plus 提供的图标组件"
        >
          <template #icon>
            <div class="custom-icon element-icon">
              <el-icon :size="64" color="#409eff">
                <Trophy />
              </el-icon>
            </div>
          </template>
          <template #extra>
            <el-button type="primary">领取奖励</el-button>
          </template>
        </el-result>
      </div>
      
      <!-- 图片图标 -->
      <div class="result-item">
        <el-result
          title="图片图标"
          sub-title="使用自定义图片作为状态图标"
        >
          <template #icon>
            <div class="custom-icon image-icon">
              <el-image
                :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
                style="width: 64px; height: 64px;"
                fit="cover"
              />
            </div>
          </template>
          <template #extra>
            <el-button type="warning">查看详情</el-button>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trophy } from '@element-plus/icons-vue'
</script>

<style scoped>
.icon-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.result-item {
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.custom-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.custom-svg svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.element-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.image-icon {
  border-radius: 50%;
  overflow: hidden;
  width: 64px;
  height: 64px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
```

### 自定义内容

可以通过插槽自定义标题、副标题和额外内容。<mcreference link="https://element-plus.org/zh-CN/component/result.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-content-demo">
    <h3>自定义内容</h3>
    
    <div class="result-container">
      <el-result icon="success">
        <!-- 自定义标题 -->
        <template #title>
          <div class="custom-title">
            <span class="title-text">🎉 恭喜您！</span>
            <el-tag type="success" size="small" style="margin-left: 8px;">
              VIP用户
            </el-tag>
          </div>
        </template>
        
        <!-- 自定义副标题 -->
        <template #sub-title>
          <div class="custom-subtitle">
            <p>您的账户已成功升级为VIP会员</p>
            <div class="benefits">
              <div class="benefit-item">
                <el-icon color="#67c23a"><Check /></el-icon>
                <span>专属客服支持</span>
              </div>
              <div class="benefit-item">
                <el-icon color="#67c23a"><Check /></el-icon>
                <span>优先处理权限</span>
              </div>
              <div class="benefit-item">
                <el-icon color="#67c23a"><Check /></el-icon>
                <span>专享折扣优惠</span>
              </div>
            </div>
          </div>
        </template>
        
        <!-- 自定义额外内容 -->
        <template #extra>
          <div class="custom-extra">
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="handleExplore">
                <el-icon><Star /></el-icon>
                探索VIP特权
              </el-button>
              <el-button size="large" @click="handleShare">
                <el-icon><Share /></el-icon>
                分享好友
              </el-button>
            </div>
            
            <div class="additional-info">
              <el-alert
                title="温馨提示"
                description="VIP会员有效期至 2024年12月31日，请及时享受专属服务。"
                type="info"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Check, Star, Share } from '@element-plus/icons-vue'

const handleExplore = () => {
  ElMessage.success('正在跳转到VIP特权页面...')
}

const handleShare = () => {
  ElMessage.info('分享功能已开启')
}
</script>

<style scoped>
.result-container {
  padding: 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  border: 1px solid #e4e7ed;
}

.custom-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.custom-subtitle {
  text-align: center;
}

.custom-subtitle p {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #606266;
}

.benefits {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #67c23a;
  font-weight: 500;
}

.custom-extra {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.additional-info {
  width: 100%;
  max-width: 500px;
}
</style>
```

## 实际应用示例

### 支付结果页面

```vue
<template>
  <div class="payment-result-demo">
    <h3>支付结果页面</h3>
    
    <div class="payment-scenarios">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="支付成功" name="success">
          <el-result icon="success">
            <template #title>
              <div class="payment-title">
                <span>支付成功</span>
                <el-tag type="success" size="small">已完成</el-tag>
              </div>
            </template>
            
            <template #sub-title>
              <div class="payment-details">
                <p>您的订单已支付成功，我们将尽快为您处理。</p>
                <div class="order-info">
                  <div class="info-item">
                    <span class="label">订单号：</span>
                    <span class="value">{{ orderInfo.orderNo }}</span>
                    <el-button text type="primary" size="small" @click="copyOrderNo">
                      复制
                    </el-button>
                  </div>
                  <div class="info-item">
                    <span class="label">支付金额：</span>
                    <span class="value amount">¥{{ orderInfo.amount }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">支付时间：</span>
                    <span class="value">{{ orderInfo.payTime }}</span>
                  </div>
                </div>
              </div>
            </template>
            
            <template #extra>
              <div class="payment-actions">
                <el-button type="primary" @click="viewOrder">
                  查看订单
                </el-button>
                <el-button @click="continueShopping">
                  继续购物
                </el-button>
                <el-button @click="downloadReceipt">
                  下载凭证
                </el-button>
              </div>
            </template>
          </el-result>
        </el-tab-pane>
        
        <el-tab-pane label="支付失败" name="error">
          <el-result icon="error">
            <template #title>
              <div class="payment-title">
                <span>支付失败</span>
                <el-tag type="danger" size="small">失败</el-tag>
              </div>
            </template>
            
            <template #sub-title>
              <div class="payment-details">
                <p>很抱歉，您的支付未能成功完成。</p>
                <div class="error-info">
                  <el-alert
                    title="失败原因"
                    :description="errorInfo.reason"
                    type="error"
                    :closable="false"
                    show-icon
                  />
                  <div class="order-info">
                    <div class="info-item">
                      <span class="label">订单号：</span>
                      <span class="value">{{ orderInfo.orderNo }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">失败时间：</span>
                      <span class="value">{{ errorInfo.failTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            
            <template #extra>
              <div class="payment-actions">
                <el-button type="danger" @click="retryPayment">
                  重新支付
                </el-button>
                <el-button @click="changePaymentMethod">
                  更换支付方式
                </el-button>
                <el-button @click="contactService">
                  联系客服
                </el-button>
              </div>
            </template>
          </el-result>
        </el-tab-pane>
        
        <el-tab-pane label="支付处理中" name="info">
          <el-result icon="info">
            <template #title>
              <div class="payment-title">
                <span>支付处理中</span>
                <el-tag type="warning" size="small">处理中</el-tag>
              </div>
            </template>
            
            <template #sub-title>
              <div class="payment-details">
                <p>您的支付正在处理中，请稍候...</p>
                <div class="processing-info">
                  <el-progress
                    :percentage="processingProgress"
                    :status="processingProgress === 100 ? 'success' : undefined"
                    :stroke-width="8"
                  />
                  <p class="processing-text">{{ processingText }}</p>
                </div>
              </div>
            </template>
            
            <template #extra>
              <div class="payment-actions">
                <el-button @click="refreshStatus">
                  刷新状态
                </el-button>
                <el-button @click="cancelPayment">
                  取消支付
                </el-button>
              </div>
            </template>
          </el-result>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('success')
const processingProgress = ref(0)
const processingText = ref('正在验证支付信息...')
let progressTimer = null

const orderInfo = {
  orderNo: 'ORD202312150001',
  amount: '299.00',
  payTime: new Date().toLocaleString()
}

const errorInfo = {
  reason: '银行卡余额不足，请检查您的账户余额或更换其他支付方式。',
  failTime: new Date().toLocaleString()
}

const copyOrderNo = () => {
  navigator.clipboard.writeText(orderInfo.orderNo)
  ElMessage.success('订单号已复制到剪贴板')
}

const viewOrder = () => {
  ElMessage.success('正在跳转到订单详情页面...')
}

const continueShopping = () => {
  ElMessage.info('返回商城继续购物')
}

const downloadReceipt = () => {
  ElMessage.success('支付凭证下载中...')
}

const retryPayment = () => {
  ElMessage.warning('正在重新发起支付...')
}

const changePaymentMethod = () => {
  ElMessage.info('正在跳转到支付方式选择页面...')
}

const contactService = () => {
  ElMessage.info('正在为您接入客服...')
}

const refreshStatus = () => {
  ElMessage.info('正在刷新支付状态...')
  startProcessing()
}

const cancelPayment = () => {
  ElMessage.warning('支付已取消')
  stopProcessing()
}

const startProcessing = () => {
  processingProgress.value = 0
  processingText.value = '正在验证支付信息...'
  
  progressTimer = setInterval(() => {
    processingProgress.value += Math.random() * 15
    
    if (processingProgress.value >= 30 && processingProgress.value < 60) {
      processingText.value = '正在处理银行响应...'
    } else if (processingProgress.value >= 60 && processingProgress.value < 90) {
      processingText.value = '正在确认交易结果...'
    } else if (processingProgress.value >= 90) {
      processingText.value = '支付处理完成'
      processingProgress.value = 100
      clearInterval(progressTimer)
    }
  }, 500)
}

const stopProcessing = () => {
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
}

const handleTabClick = (tab) => {
  if (tab.props.name === 'info') {
    startProcessing()
  } else {
    stopProcessing()
  }
}

onMounted(() => {
  if (activeTab.value === 'info') {
    startProcessing()
  }
})

onUnmounted(() => {
  stopProcessing()
})
</script>

<style scoped>
.payment-scenarios {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e4e7ed;
}

.payment-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
}

.payment-details {
  text-align: center;
}

.payment-details > p {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #606266;
}

.order-info {
  background: #fff;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #909399;
  font-size: 14px;
}

.value {
  color: #303133;
  font-weight: 500;
}

.amount {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.error-info {
  margin: 16px 0;
}

.processing-info {
  margin: 20px 0;
}

.processing-text {
  margin: 12px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.payment-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
```

### 表单提交结果

```vue
<template>
  <div class="form-result-demo">
    <h3>表单提交结果</h3>
    
    <div class="form-container">
      <!-- 提交表单 -->
      <div v-if="!submitted" class="form-section">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          @submit.prevent="handleSubmit"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
          
          <el-form-item label="电话" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入电话号码" />
          </el-form-item>
          
          <el-form-item label="留言" prop="message">
            <el-input
              v-model="formData.message"
              type="textarea"
              :rows="4"
              placeholder="请输入您的留言"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
              {{ submitting ? '提交中...' : '提交申请' }}
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 提交结果 -->
      <div v-else class="result-section">
        <el-result
          :icon="submitResult.status"
          :title="submitResult.title"
          :sub-title="submitResult.subTitle"
        >
          <template #extra>
            <div class="result-actions">
              <el-button
                v-for="action in submitResult.actions"
                :key="action.text"
                :type="action.type"
                @click="action.handler"
              >
                {{ action.text }}
              </el-button>
            </div>
            
            <!-- 成功时显示额外信息 -->
            <div v-if="submitResult.status === 'success'" class="success-info">
              <el-card shadow="never">
                <template #header>
                  <span>提交信息</span>
                </template>
                <div class="submitted-data">
                  <div class="data-item">
                    <span class="data-label">申请编号：</span>
                    <span class="data-value">{{ applicationId }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">提交时间：</span>
                    <span class="data-value">{{ submitTime }}</span>
                  </div>
                  <div class="data-item">
                    <span class="data-label">预计处理：</span>
                    <span class="data-value">3-5个工作日</span>
                  </div>
                </div>
              </el-card>
            </div>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const submitted = ref(false)
const submitting = ref(false)
const applicationId = ref('')
const submitTime = ref('')

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入留言内容', trigger: 'blur' }
  ]
}

const submitResult = ref({
  status: 'success',
  title: '提交成功',
  subTitle: '您的申请已成功提交，我们将在3-5个工作日内处理您的申请。',
  actions: [
    { text: '查看进度', type: 'primary', handler: () => ElMessage.info('查看申请进度') },
    { text: '重新提交', type: '', handler: () => resetToForm() },
    { text: '返回首页', type: '', handler: () => ElMessage.info('返回首页') }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟提交过程
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% 成功率
      
      if (success) {
        // 成功情况
        applicationId.value = 'APP' + Date.now()
        submitTime.value = new Date().toLocaleString()
        submitResult.value = {
          status: 'success',
          title: '提交成功',
          subTitle: '您的申请已成功提交，我们将在3-5个工作日内处理您的申请。',
          actions: [
            { text: '查看进度', type: 'primary', handler: () => ElMessage.info('查看申请进度') },
            { text: '重新提交', type: '', handler: () => resetToForm() },
            { text: '返回首页', type: '', handler: () => ElMessage.info('返回首页') }
          ]
        }
      } else {
        // 失败情况
        submitResult.value = {
          status: 'error',
          title: '提交失败',
          subTitle: '很抱歉，系统繁忙导致提交失败，请稍后重试或联系客服。',
          actions: [
            { text: '重新提交', type: 'danger', handler: () => resetToForm() },
            { text: '联系客服', type: '', handler: () => ElMessage.info('正在为您接入客服...') },
            { text: '保存草稿', type: '', handler: () => ElMessage.success('草稿已保存') }
          ]
        }
      }
      
      submitted.value = true
      submitting.value = false
    }, 2000)
  } catch (error) {
    ElMessage.error('请完善表单信息')
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const resetToForm = () => {
  submitted.value = false
  submitting.value = false
  resetForm()
}
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.form-section {
  background: #fff;
  padding: 24px;
  border-radius: 6px;
}

.result-section {
  padding: 20px;
}

.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.success-info {
  max-width: 400px;
  margin: 0 auto;
}

.submitted-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-label {
  color: #909399;
  font-size: 14px;
}

.data-value {
  color: #303133;
  font-weight: 500;
}
</style>
```

### 404 错误页面

```vue
<template>
  <div class="error-page-demo">
    <h3>404 错误页面</h3>
    
    <div class="error-container">
      <el-result>
        <template #icon>
          <div class="error-icon">
            <div class="error-number">404</div>
            <div class="error-animation">
              <div class="floating-element">🔍</div>
              <div class="floating-element">📄</div>
              <div class="floating-element">❓</div>
            </div>
          </div>
        </template>
        
        <template #title>
          <div class="error-title">
            页面未找到
          </div>
        </template>
        
        <template #sub-title>
          <div class="error-subtitle">
            <p>抱歉，您访问的页面不存在或已被移除。</p>
            <div class="error-details">
              <el-collapse>
                <el-collapse-item title="可能的原因" name="reasons">
                  <ul class="reason-list">
                    <li>页面地址输入错误</li>
                    <li>页面已被删除或移动</li>
                    <li>您没有访问权限</li>
                    <li>服务器临时故障</li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </template>
        
        <template #extra>
          <div class="error-actions">
            <div class="primary-actions">
              <el-button type="primary" size="large" @click="goHome">
                <el-icon><House /></el-icon>
                返回首页
              </el-button>
              <el-button size="large" @click="goBack">
                <el-icon><Back /></el-icon>
                返回上页
              </el-button>
            </div>
            
            <div class="secondary-actions">
              <el-button text @click="reportProblem">
                <el-icon><Warning /></el-icon>
                报告问题
              </el-button>
              <el-button text @click="contactSupport">
                <el-icon><Service /></el-icon>
                联系客服
              </el-button>
            </div>
            
            <!-- 搜索建议 -->
            <div class="search-suggestion">
              <el-divider>或者尝试搜索</el-divider>
              <el-input
                v-model="searchKeyword"
                placeholder="搜索您需要的内容..."
                @keyup.enter="handleSearch"
                clearable
              >
                <template #append>
                  <el-button @click="handleSearch">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            
            <!-- 热门链接 -->
            <div class="popular-links">
              <el-divider>热门页面</el-divider>
              <div class="link-grid">
                <el-button
                  v-for="link in popularLinks"
                  :key="link.name"
                  text
                  @click="navigateTo(link.path)"
                >
                  <el-icon :class="link.icon"></el-icon>
                  {{ link.name }}
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { House, Back, Warning, Service, Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')

const popularLinks = [
  { name: '首页', path: '/', icon: 'House' },
  { name: '产品中心', path: '/products', icon: 'Goods' },
  { name: '用户中心', path: '/profile', icon: 'User' },
  { name: '帮助中心', path: '/help', icon: 'QuestionFilled' },
  { name: '关于我们', path: '/about', icon: 'InfoFilled' },
  { name: '联系我们', path: '/contact', icon: 'Phone' }
]

const goHome = () => {
  ElMessage.success('正在跳转到首页...')
  // 实际项目中使用 router.push('/')
}

const goBack = () => {
  ElMessage.info('返回上一页')
  // 实际项目中使用 router.go(-1) 或 history.back()
}

const reportProblem = () => {
  ElMessage.info('问题报告功能已开启')
}

const contactSupport = () => {
  ElMessage.info('正在为您接入客服...')
}

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  ElMessage.success(`正在搜索：${searchKeyword.value}`)
  // 实际项目中跳转到搜索结果页
}

const navigateTo = (path) => {
  ElMessage.success(`正在跳转到：${path}`)
  // 实际项目中使用 router.push(path)
}
</script>

<style scoped>
.error-container {
  min-height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 40px 20px;
  color: white;
}

.error-icon {
  position: relative;
  margin-bottom: 20px;
}

.error-number {
  font-size: 120px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
}

.error-animation {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 120px;
  pointer-events: none;
}

.floating-element {
  position: absolute;
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

.floating-element:nth-child(1) {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.floating-element:nth-child(2) {
  top: 60px;
  right: 30px;
  animation-delay: 1s;
}

.floating-element:nth-child(3) {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.error-title {
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
}

.error-subtitle {
  color: rgba(255, 255, 255, 0.9);
}

.error-subtitle > p {
  margin: 0 0 20px 0;
  font-size: 16px;
}

.error-details {
  max-width: 400px;
  margin: 0 auto;
}

.reason-list {
  margin: 0;
  padding-left: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.reason-list li {
  margin-bottom: 4px;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

.primary-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.secondary-actions {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.search-suggestion {
  width: 100%;
  max-width: 400px;
}

.popular-links {
  width: 100%;
  max-width: 500px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  justify-items: center;
}

:deep(.el-divider__text) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.el-divider) {
  border-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-collapse) {
  background: transparent;
  border: none;
}

:deep(.el-collapse-item__header) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 16px;
}

:deep(.el-collapse-item__content) {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 0 0 4px 4px;
  padding: 16px;
}
</style>
```

## API 文档

### Result Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| title | 标题 | string | — | — |
| sub-title | 二级标题 | string | — | — |
| icon | 图标类型 | string | success / warning / info / error | info |

### Result Slots

| 插槽名 | 说明 |
|--------|------|
| icon | 自定义图标 |
| title | 自定义标题 |
| sub-title | 自定义二级标题 |
| extra | 自定义底部额外区域 |

## 最佳实践

### 设计原则

1. **清晰明确**：结果状态要清晰，用户能快速理解当前状态
2. **信息完整**：提供足够的信息帮助用户了解结果详情
3. **操作引导**：提供明确的后续操作指引
4. **视觉层次**：合理的信息层次和视觉重点

### 内容策略

1. **标题简洁**：使用简短明确的标题描述结果
2. **描述详细**：在副标题中提供详细的说明信息
3. **操作明确**：提供清晰的下一步操作建议
4. **错误友好**：错误信息要友好，避免技术术语

### 交互设计

1. **按钮层次**：主要操作使用主色调，次要操作使用默认样式
2. **操作分组**：相关操作进行分组，提高可用性
3. **响应及时**：操作反馈要及时，避免用户等待
4. **状态保持**：合理保持页面状态，避免信息丢失

### 可访问性

1. **语义化**：使用语义化的HTML结构
2. **键盘导航**：支持键盘操作和导航
3. **屏幕阅读器**：提供适当的ARIA标签
4. **色彩对比**：确保足够的色彩对比度

## 常见问题

### 1. 图标不显示

**问题**：自定义图标或默认图标不显示

**解决方案**：
- 检查图标名称是否正确
- 确认图标库是否正确引入
- 验证自定义图标的路径和格式
- 检查CSS样式是否影响图标显示

### 2. 内容布局问题

**问题**：内容布局不符合预期

**解决方案**：
- 使用插槽自定义内容布局
- 调整容器的CSS样式
- 检查内容长度和换行处理
- 考虑响应式设计需求

### 3. 操作按钮过多

**问题**：底部操作按钮过多导致布局混乱

**解决方案**：
- 对操作进行优先级排序
- 使用下拉菜单收纳次要操作
- 分组显示相关操作
- 考虑使用分步骤的操作流程

### 4. 移动端适配

**问题**：在移动端显示效果不佳

**解决方案**：
- 调整字体大小和间距
- 优化按钮大小和布局
- 使用响应式设计
- 考虑移动端的交互习惯

## 总结

Result 结果组件是用户体验中的重要环节，它承担着向用户反馈操作结果的重要职责。通过合理使用不同的状态类型、自定义内容和操作按钮，可以为用户提供清晰、友好的结果反馈。在实际应用中，需要注意信息的完整性、操作的引导性和设计的一致性，以提升整体的用户体验。

## 参考资料

- [Element Plus Result 官方文档](https://element-plus.org/zh-CN/component/result.html)
- [用户体验设计原则](https://www.nngroup.com/articles/)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)