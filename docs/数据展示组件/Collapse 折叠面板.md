# Collapse 折叠面板

## 概述

Collapse 折叠面板组件通过折叠面板收纳内容区域。可以同时展开多个面板，面板之间不影响。适用于内容较多且需要分类展示的场景，如 FAQ、设置面板、详情展示等。<mcreference link="https://element-plus.org/zh-CN/component/collapse.html" index="0">0</mcreference>

## 学习目标

- 掌握 Collapse 组件的基础用法
- 学会配置手风琴模式和自定义触发区域
- 理解折叠面板的展开/收起控制
- 掌握自定义标题和内容的方法
- 了解 Collapse 组件的 API 和最佳实践

## 基础用法

### 基础折叠面板

可同时展开多个面板，面板之间不影响。<mcreference link="https://element-plus.org/zh-CN/component/collapse.html" index="0">0</mcreference>

```vue
<template>
  <div class="collapse-demo">
    <h3>基础折叠面板</h3>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="一致性 Consistency" name="1">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>
          控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
        </div>
        <div>
          页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
        </div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency" name="3">
        <div>
          简化流程：设计简洁直观的操作流程；
        </div>
        <div>
          清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
        </div>
        <div>
          帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
        </div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability" name="4">
        <div>
          用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；
        </div>
        <div>
          结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeNames = ref(['1'])

const handleChange = (val) => {
  console.log(val)
}
</script>
```

### 手风琴效果

每次只能展开一个面板。通过 `accordion` 属性来设置是否以手风琴模式显示。<mcreference link="https://element-plus.org/zh-CN/component/collapse.html" index="0">0</mcreference>

```vue
<template>
  <div class="accordion-demo">
    <h3>手风琴效果</h3>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="一致性 Consistency" name="1">
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>
          控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
        </div>
        <div>
          页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
        </div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency" name="3">
        <div>
          简化流程：设计简洁直观的操作流程；
        </div>
        <div>
          清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
        </div>
        <div>
          帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeName = ref('1')
</script>
```

### 自定义面板标题

除了可以通过 `title` 属性以外，还可以通过具名 `slot` 来实现自定义面板的标题内容，以实现增加图标等效果。<mcreference link="https://element-plus.org/zh-CN/component/collapse.html" index="0">0</mcreference>

```vue
<template>
  <div class="custom-title-demo">
    <h3>自定义面板标题</h3>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <el-icon class="header-icon"><InfoFilled /></el-icon>
          一致性 Consistency
        </template>
        <div>
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div>
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <el-icon class="header-icon"><ChatDotRound /></el-icon>
          反馈 Feedback
        </template>
        <div>
          控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；
        </div>
        <div>
          页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <el-icon class="header-icon"><Setting /></el-icon>
          效率 Efficiency
        </template>
        <div>
          简化流程：设计简洁直观的操作流程；
        </div>
        <div>
          清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；
        </div>
        <div>
          帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { InfoFilled, ChatDotRound, Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.header-icon {
  margin-right: 8px;
}
</style>
```

## 实际应用示例

### FAQ 常见问题

```vue
<template>
  <div class="faq-demo">
    <h3>FAQ 常见问题</h3>
    <el-collapse v-model="activeFaq" accordion>
      <el-collapse-item 
        v-for="faq in faqList" 
        :key="faq.id" 
        :name="faq.id.toString()"
      >
        <template #title>
          <div class="faq-title">
            <el-icon class="question-icon"><QuestionFilled /></el-icon>
            <span>{{ faq.question }}</span>
            <el-tag 
              v-if="faq.isHot" 
              type="danger" 
              size="small" 
              class="hot-tag"
            >
              热门
            </el-tag>
          </div>
        </template>
        <div class="faq-answer">
          <div v-html="faq.answer"></div>
          <div class="faq-meta">
            <span class="update-time">更新时间：{{ faq.updateTime }}</span>
            <div class="faq-actions">
              <el-button 
                text 
                type="primary" 
                size="small" 
                @click="handleHelpful(faq)"
              >
                <el-icon><Select /></el-icon>
                有帮助 ({{ faq.helpful }})
              </el-button>
              <el-button 
                text 
                size="small" 
                @click="handleFeedback(faq)"
              >
                <el-icon><ChatDotRound /></el-icon>
                反馈
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled, Select, ChatDotRound } from '@element-plus/icons-vue'

const activeFaq = ref('')

const faqList = ref([
  {
    id: 1,
    question: '如何重置密码？',
    answer: `
      <p>您可以通过以下步骤重置密码：</p>
      <ol>
        <li>点击登录页面的"忘记密码"链接</li>
        <li>输入您的邮箱地址</li>
        <li>查收邮件并点击重置链接</li>
        <li>设置新密码</li>
      </ol>
      <p><strong>注意：</strong>重置链接有效期为24小时。</p>
    `,
    updateTime: '2024-01-15',
    helpful: 156,
    isHot: true
  },
  {
    id: 2,
    question: '如何联系客服？',
    answer: `
      <p>我们提供多种联系方式：</p>
      <ul>
        <li><strong>在线客服：</strong>工作日 9:00-18:00</li>
        <li><strong>客服电话：</strong>400-123-4567</li>
        <li><strong>邮箱：</strong>support@example.com</li>
        <li><strong>微信：</strong>扫描二维码添加客服微信</li>
      </ul>
    `,
    updateTime: '2024-01-14',
    helpful: 89,
    isHot: false
  },
  {
    id: 3,
    question: '支持哪些支付方式？',
    answer: `
      <p>我们支持以下支付方式：</p>
      <ul>
        <li>支付宝</li>
        <li>微信支付</li>
        <li>银行卡支付</li>
        <li>Apple Pay</li>
        <li>Google Pay</li>
      </ul>
      <p>所有支付都经过加密处理，确保您的资金安全。</p>
    `,
    updateTime: '2024-01-13',
    helpful: 234,
    isHot: true
  },
  {
    id: 4,
    question: '如何申请退款？',
    answer: `
      <p>退款申请流程：</p>
      <ol>
        <li>登录您的账户</li>
        <li>进入"我的订单"页面</li>
        <li>找到需要退款的订单</li>
        <li>点击"申请退款"</li>
        <li>填写退款原因</li>
        <li>等待审核（通常1-3个工作日）</li>
      </ol>
      <p><strong>退款政策：</strong>商品未使用且在7天内可申请退款。</p>
    `,
    updateTime: '2024-01-12',
    helpful: 67,
    isHot: false
  }
])

const handleHelpful = (faq) => {
  faq.helpful++
  ElMessage.success('感谢您的反馈！')
}

const handleFeedback = (faq) => {
  ElMessage.info('反馈功能开发中...')
}
</script>

<style scoped>
.faq-title {
  display: flex;
  align-items: center;
  width: 100%;
}

.question-icon {
  margin-right: 8px;
  color: #409eff;
}

.hot-tag {
  margin-left: auto;
}

.faq-answer {
  padding: 16px 0;
  line-height: 1.6;
}

.faq-answer :deep(p) {
  margin: 0 0 12px 0;
}

.faq-answer :deep(ul),
.faq-answer :deep(ol) {
  margin: 12px 0;
  padding-left: 20px;
}

.faq-answer :deep(li) {
  margin: 4px 0;
}

.faq-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.update-time {
  font-size: 12px;
  color: #909399;
}

.faq-actions {
  display: flex;
  gap: 8px;
}
</style>
```

### 设置面板

```vue
<template>
  <div class="settings-demo">
    <h3>设置面板</h3>
    <el-collapse v-model="activeSettings">
      <el-collapse-item title="账户设置" name="account">
        <div class="setting-section">
          <div class="setting-item">
            <label>用户名</label>
            <el-input v-model="settings.username" placeholder="请输入用户名" />
          </div>
          <div class="setting-item">
            <label>邮箱</label>
            <el-input v-model="settings.email" placeholder="请输入邮箱" />
          </div>
          <div class="setting-item">
            <label>手机号</label>
            <el-input v-model="settings.phone" placeholder="请输入手机号" />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="隐私设置" name="privacy">
        <div class="setting-section">
          <div class="setting-item">
            <label>个人资料可见性</label>
            <el-select v-model="settings.profileVisibility" placeholder="请选择">
              <el-option label="公开" value="public" />
              <el-option label="仅好友" value="friends" />
              <el-option label="私密" value="private" />
            </el-select>
          </div>
          <div class="setting-item">
            <label>允许搜索</label>
            <el-switch v-model="settings.allowSearch" />
          </div>
          <div class="setting-item">
            <label>显示在线状态</label>
            <el-switch v-model="settings.showOnlineStatus" />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="通知设置" name="notification">
        <div class="setting-section">
          <div class="setting-item">
            <label>邮件通知</label>
            <el-switch v-model="settings.emailNotification" />
          </div>
          <div class="setting-item">
            <label>短信通知</label>
            <el-switch v-model="settings.smsNotification" />
          </div>
          <div class="setting-item">
            <label>推送通知</label>
            <el-switch v-model="settings.pushNotification" />
          </div>
          <div class="setting-item">
            <label>通知时间</label>
            <el-time-picker
              v-model="settings.notificationTime"
              format="HH:mm"
              placeholder="选择时间"
            />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="安全设置" name="security">
        <div class="setting-section">
          <div class="setting-item">
            <label>两步验证</label>
            <el-switch v-model="settings.twoFactorAuth" />
          </div>
          <div class="setting-item">
            <label>登录提醒</label>
            <el-switch v-model="settings.loginAlert" />
          </div>
          <div class="setting-item">
            <label>密码强度要求</label>
            <el-select v-model="settings.passwordStrength" placeholder="请选择">
              <el-option label="低" value="low" />
              <el-option label="中" value="medium" />
              <el-option label="高" value="high" />
            </el-select>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    
    <div class="setting-actions">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
      <el-button @click="resetSettings">重置</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const activeSettings = ref(['account'])

const settings = ref({
  username: 'john_doe',
  email: 'john@example.com',
  phone: '13800138000',
  profileVisibility: 'friends',
  allowSearch: true,
  showOnlineStatus: false,
  emailNotification: true,
  smsNotification: false,
  pushNotification: true,
  notificationTime: '09:00',
  twoFactorAuth: false,
  loginAlert: true,
  passwordStrength: 'medium'
})

const saveSettings = () => {
  ElMessage.success('设置已保存')
}

const resetSettings = () => {
  ElMessage.info('设置已重置')
}
</script>

<style scoped>
.setting-section {
  padding: 16px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.setting-item label {
  font-weight: 500;
  min-width: 120px;
}

.setting-item .el-input,
.setting-item .el-select,
.setting-item .el-time-picker {
  width: 200px;
}

.setting-actions {
  margin-top: 24px;
  text-align: center;
}

.setting-actions .el-button {
  margin: 0 8px;
}
</style>
```

### 产品详情展示

```vue
<template>
  <div class="product-details-demo">
    <h3>产品详情展示</h3>
    <el-collapse v-model="activeDetails">
      <el-collapse-item name="description">
        <template #title>
          <div class="detail-title">
            <el-icon><Document /></el-icon>
            <span>产品描述</span>
          </div>
        </template>
        <div class="detail-content">
          <p>这是一款革命性的智能手机，采用最新的处理器技术和先进的摄影系统。</p>
          <ul>
            <li>6.7英寸 Super Retina XDR 显示屏</li>
            <li>A17 Pro 芯片，性能提升20%</li>
            <li>专业级三摄系统</li>
            <li>全天候电池续航</li>
            <li>5G 网络支持</li>
          </ul>
        </div>
      </el-collapse-item>
      
      <el-collapse-item name="specifications">
        <template #title>
          <div class="detail-title">
            <el-icon><List /></el-icon>
            <span>技术规格</span>
          </div>
        </template>
        <div class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="屏幕尺寸">6.7英寸</el-descriptions-item>
            <el-descriptions-item label="分辨率">2796 x 1290</el-descriptions-item>
            <el-descriptions-item label="处理器">A17 Pro</el-descriptions-item>
            <el-descriptions-item label="存储">128GB/256GB/512GB</el-descriptions-item>
            <el-descriptions-item label="摄像头">48MP 主摄 + 12MP 超广角 + 12MP 长焦</el-descriptions-item>
            <el-descriptions-item label="电池">4422mAh</el-descriptions-item>
            <el-descriptions-item label="重量">221g</el-descriptions-item>
            <el-descriptions-item label="颜色">深空黑、银色、金色、深紫色</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-collapse-item>
      
      <el-collapse-item name="reviews">
        <template #title>
          <div class="detail-title">
            <el-icon><Star /></el-icon>
            <span>用户评价</span>
            <el-tag type="warning" size="small" class="review-count">
              4.8分 (1,234条评价)
            </el-tag>
          </div>
        </template>
        <div class="detail-content">
          <div class="review-summary">
            <el-rate v-model="averageRating" disabled show-score />
            <span class="rating-text">综合评分 {{ averageRating }}/5</span>
          </div>
          
          <div class="review-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <el-avatar :size="32" :src="review.avatar" />
                <div class="review-info">
                  <span class="reviewer-name">{{ review.name }}</span>
                  <el-rate v-model="review.rating" disabled size="small" />
                </div>
                <span class="review-date">{{ review.date }}</span>
              </div>
              <div class="review-content">
                {{ review.content }}
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item name="shipping">
        <template #title>
          <div class="detail-title">
            <el-icon><Van /></el-icon>
            <span>配送信息</span>
          </div>
        </template>
        <div class="detail-content">
          <div class="shipping-options">
            <div class="shipping-option">
              <h4>标准配送</h4>
              <p>免费配送，预计3-5个工作日送达</p>
            </div>
            <div class="shipping-option">
              <h4>加急配送</h4>
              <p>¥15，预计1-2个工作日送达</p>
            </div>
            <div class="shipping-option">
              <h4>当日达</h4>
              <p>¥25，当日18:00前下单，当日送达（限部分地区）</p>
            </div>
          </div>
          
          <div class="shipping-note">
            <el-alert
              title="配送说明"
              type="info"
              :closable="false"
              show-icon
            >
              <ul>
                <li>支持全国配送，偏远地区可能需要额外时间</li>
                <li>大件商品可能需要预约配送时间</li>
                <li>节假日配送时间可能延长</li>
              </ul>
            </el-alert>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document, List, Star, Van } from '@element-plus/icons-vue'

const activeDetails = ref(['description'])
const averageRating = ref(4.8)

const reviews = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 5,
    date: '2024-01-15',
    content: '非常满意的一次购买，手机性能强劲，拍照效果出色，值得推荐！'
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 4,
    date: '2024-01-14',
    content: '整体不错，就是价格有点贵，但是质量确实很好。'
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 5,
    date: '2024-01-13',
    content: '用了一周了，各方面都很满意，特别是电池续航能力很强。'
  }
])
</script>

<style scoped>
.detail-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-count {
  margin-left: auto;
}

.detail-content {
  padding: 16px 0;
  line-height: 1.6;
}

.review-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.rating-text {
  font-weight: 500;
}

.review-list {
  space-y: 16px;
}

.review-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.review-info {
  flex: 1;
}

.reviewer-name {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}

.review-date {
  font-size: 12px;
  color: #909399;
}

.review-content {
  color: #606266;
}

.shipping-options {
  margin-bottom: 20px;
}

.shipping-option {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 12px;
}

.shipping-option h4 {
  margin: 0 0 8px 0;
  color: #409eff;
}

.shipping-option p {
  margin: 0;
  color: #606266;
}

.shipping-note :deep(.el-alert__content) ul {
  margin: 0;
  padding-left: 20px;
}

.shipping-note :deep(.el-alert__content) li {
  margin: 4px 0;
}
</style>
```

## API 文档

### Collapse Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| model-value / v-model | 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array) | string / array | — |
| accordion | 是否手风琴模式 | boolean | false |

### Collapse Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为string，否则为array) | activeNames: array / string |

### Collapse Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 自定义默认内容 | Collapse Item |

### Collapse Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| name | 唯一标志符 | string / number | — |
| title | 面板标题 | string | — |
| disabled | 是否禁用 | boolean | false |

### Collapse Item Slots

| 插槽名 | 说明 |
|--------|------|
| default | Collapse Item 的内容 |
| title | Collapse Item 的标题 |

## 最佳实践

### 内容组织

1. **逻辑分组**：将相关内容归类到同一个面板中
2. **标题清晰**：使用简洁明了的标题描述面板内容
3. **层次结构**：合理安排面板的展开顺序和重要性

### 用户体验

1. **默认状态**：根据用户需求设置合适的默认展开面板
2. **加载性能**：对于内容较多的面板，考虑懒加载
3. **视觉反馈**：提供清晰的展开/收起动画效果

### 响应式设计

1. **移动适配**：在移动设备上优化触摸体验
2. **内容适配**：确保面板内容在不同屏幕尺寸下正常显示
3. **交互优化**：在小屏幕上提供更大的点击区域

### 可访问性

1. **键盘导航**：支持键盘操作展开/收起面板
2. **屏幕阅读器**：为面板提供合适的 ARIA 标签
3. **焦点管理**：合理管理焦点状态和顺序

## 常见问题

### 1. 面板内容不显示

**问题**：点击面板标题后内容区域没有展开

**解决方案**：
- 检查 `v-model` 绑定是否正确
- 确认 `name` 属性设置正确
- 检查是否有 CSS 样式冲突

### 2. 手风琴模式异常

**问题**：设置了 `accordion` 但仍可以展开多个面板

**解决方案**：
- 确认 `v-model` 绑定的是字符串类型而不是数组
- 检查 `accordion` 属性是否正确设置为 `true`

### 3. 自定义标题样式问题

**问题**：使用 `title` 插槽后样式显示异常

**解决方案**：
- 检查插槽内容的 CSS 样式
- 确保没有破坏原有的布局结构
- 使用适当的 CSS 选择器避免样式冲突

### 4. 动画效果不流畅

**问题**：面板展开/收起动画卡顿或不自然

**解决方案**：
- 检查面板内容是否过于复杂
- 优化 CSS 动画性能
- 考虑使用 CSS `will-change` 属性

## 总结

Collapse 折叠面板组件是一个实用的内容组织工具，通过合理的配置和使用，可以有效地管理和展示大量信息。在实际应用中，需要注意内容组织、用户体验和可访问性等方面的最佳实践，以提供良好的用户交互体验。

## 参考资料

- [Element Plus Collapse 官方文档](https://element-plus.org/zh-CN/component/collapse.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS 动画最佳实践](https://web.dev/animations/)
- [响应式设计原则](https://web.dev/responsive-web-design-basics/)