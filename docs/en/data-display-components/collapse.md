# Collapse

## Overview

The Collapse component organizes content through collapsible panels. Multiple panels can be expanded simultaneously without affecting each other. It is suitable for scenarios with a large amount of content that needs to be categorized, such as FAQs, settings panels, detail displays, etc.

## Learning Objectives

- Master the basic usage of the Collapse component
- Learn to configure accordion mode and custom trigger areas
- Understand the expansion/collapse control of panels
- Master methods for customizing titles and content
- Understand the Collapse component's API and best practices

## Basic Usage

### Basic Collapse Panel

Multiple panels can be expanded simultaneously without affecting each other.

```vue
<template>
  <div class="collapse-demo">
    <h3>Basic Collapse Panel</h3>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to.
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects.
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive.
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions.
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Controllability" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do not make decisions for the users.
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.
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

### Accordion Effect

Only one panel can be expanded at a time. Use the `accordion` attribute to set whether to display in accordion mode.

```vue
<template>
  <div class="accordion-demo">
    <h3>Accordion Effect</h3>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="Consistency" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to.
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Feedback" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects.
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="Efficiency" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive.
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions.
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.
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

### Custom Panel Title

In addition to using the `title` attribute, you can also use a named `slot` to customize the panel title content, such as adding icons.

```vue
<template>
  <div class="custom-title-demo">
    <h3>Custom Panel Title</h3>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <el-icon class="header-icon"><InfoFilled /></el-icon>
          Consistency
        </template>
        <div>
          Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to.
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template #title>
          <el-icon class="header-icon"><ChatDotRound /></el-icon>
          Feedback
        </template>
        <div>
          Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects.
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template #title>
          <el-icon class="header-icon"><Setting /></el-icon>
          Efficiency
        </template>
        <div>
          Simplify the process: keep operating process simple and intuitive.
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions.
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.
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

## Practical Application Examples

### FAQ

```vue
<template>
  <div class="faq-demo">
    <h3>FAQ</h3>
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
              Hot
            </el-tag>
          </div>
        </template>
        <div class="faq-answer">
          <div v-html="faq.answer"></div>
          <div class="faq-meta">
            <span class="update-time">Updated: {{ faq.updateTime }}</span>
            <div class="faq-actions">
              <el-button 
                text 
                type="primary" 
                size="small" 
                @click="handleHelpful(faq)"
              >
                <el-icon><Select /></el-icon>
                Helpful ({{ faq.helpful }})
              </el-button>
              <el-button 
                text 
                size="small" 
                @click="handleFeedback(faq)"
              >
                <el-icon><ChatDotRound /></el-icon>
                Feedback
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
    question: 'How to reset password?',
    answer: `
      <p>You can reset your password by following these steps:</p>
      <ol>
        <li>Click on the "Forgot Password" link on the login page</li>
        <li>Enter your email address</li>
        <li>Check your email and click on the reset link</li>
        <li>Set a new password</li>
      </ol>
      <p><strong>Note:</strong> The reset link is valid for 24 hours.</p>
    `,
    updateTime: '2024-01-15',
    helpful: 156,
    isHot: true
  },
  {
    id: 2,
    question: 'How to contact customer service?',
    answer: `
      <p>We provide multiple contact methods:</p>
      <ul>
        <li><strong>Online Support:</strong> Weekdays 9:00-18:00</li>
        <li><strong>Customer Service Phone:</strong> 400-123-4567</li>
        <li><strong>Email:</strong> support@example.com</li>
        <li><strong>WeChat:</strong> Scan the QR code to add customer service WeChat</li>
      </ul>
    `,
    updateTime: '2024-01-14',
    helpful: 89,
    isHot: false
  },
  {
    id: 3,
    question: 'What payment methods are supported?',
    answer: `
      <p>We support the following payment methods:</p>
      <ul>
        <li>Alipay</li>
        <li>WeChat Pay</li>
        <li>Bank Card Payment</li>
        <li>Apple Pay</li>
        <li>Google Pay</li>
      </ul>
      <p>All payments are encrypted to ensure your financial security.</p>
    `,
    updateTime: '2024-01-13',
    helpful: 234,
    isHot: true
  },
  {
    id: 4,
    question: 'How to apply for a refund?',
    answer: `
      <p>Refund application process:</p>
      <ol>
        <li>Log in to your account</li>
        <li>Go to "My Orders" page</li>
        <li>Find the order that needs a refund</li>
        <li>Click "Apply for Refund"</li>
        <li>Fill in the refund reason</li>
        <li>Wait for review (usually 1-3 business days)</li>
      </ol>
      <p><strong>Refund Policy:</strong> Products that are unused and within 7 days can be refunded.</p>
    `,
    updateTime: '2024-01-12',
    helpful: 67,
    isHot: false
  }
])

const handleHelpful = (faq) => {
  faq.helpful++
  ElMessage.success('Thank you for your feedback!')
}

const handleFeedback = (faq) => {
  ElMessage.info('Feedback feature is under development...')
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

### Settings Panel

```vue
<template>
  <div class="settings-demo">
    <h3>Settings Panel</h3>
    <el-collapse v-model="activeSettings">
      <el-collapse-item title="Account Settings" name="account">
        <div class="setting-section">
          <div class="setting-item">
            <label>Username</label>
            <el-input v-model="settings.username" placeholder="Please enter username" />
          </div>
          <div class="setting-item">
            <label>Email</label>
            <el-input v-model="settings.email" placeholder="Please enter email" />
          </div>
          <div class="setting-item">
            <label>Phone</label>
            <el-input v-model="settings.phone" placeholder="Please enter phone number" />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="Privacy Settings" name="privacy">
        <div class="setting-section">
          <div class="setting-item">
            <label>Profile Visibility</label>
            <el-select v-model="settings.profileVisibility" placeholder="Please select">
              <el-option label="Public" value="public" />
              <el-option label="Friends Only" value="friends" />
              <el-option label="Private" value="private" />
            </el-select>
          </div>
          <div class="setting-item">
            <label>Allow Search</label>
            <el-switch v-model="settings.allowSearch" />
          </div>
          <div class="setting-item">
            <label>Show Online Status</label>
            <el-switch v-model="settings.showOnlineStatus" />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="Notification Settings" name="notification">
        <div class="setting-section">
          <div class="setting-item">
            <label>Email Notifications</label>
            <el-switch v-model="settings.emailNotification" />
          </div>
          <div class="setting-item">
            <label>SMS Notifications</label>
            <el-switch v-model="settings.smsNotification" />
          </div>
          <div class="setting-item">
            <label>Push Notifications</label>
            <el-switch v-model="settings.pushNotification" />
          </div>
          <div class="setting-item">
            <label>Notification Time</label>
            <el-time-picker
              v-model="settings.notificationTime"
              format="HH:mm"
              placeholder="Select time"
            />
          </div>
        </div>
      </el-collapse-item>
      
      <el-collapse-item title="Security Settings" name="security">
        <div class="setting-section">
          <div class="setting-item">
            <label>Two-Factor Authentication</label>
            <el-switch v-model="settings.twoFactorAuth" />
          </div>
          <div class="setting-item">
            <label>Login Alert</label>
            <el-switch v-model="settings.loginAlert" />
          </div>
          <div class="setting-item">
            <label>Password Strength Requirement</label>
            <el-select v-model="settings.passwordStrength" placeholder="Please select">
              <el-option label="Low" value="low" />
              <el-option label="Medium" value="medium" />
              <el-option label="High" value="high" />
            </el-select>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    
    <div class="setting-actions">
      <el-button type="primary" @click="saveSettings">Save Settings</el-button>
      <el-button @click="resetSettings">Reset</el-button>
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
  ElMessage.success('Settings saved')
}

const resetSettings = () => {
  ElMessage.info('Settings reset')
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

### Product Details Display

```vue
<template>
  <div class="product-details-demo">
    <h3>Product Details Display</h3>
    <el-collapse v-model="activeDetails">
      <el-collapse-item name="description">
        <template #title>
          <div class="detail-title">
            <el-icon><Document /></el-icon>
            <span>Product Description</span>
          </div>
        </template>
        <div class="detail-content">
          <p>This is a revolutionary smartphone that uses the latest processor technology and advanced photography system.</p>
          <ul>
            <li>6.7-inch Super Retina XDR display</li>
            <li>A17 Pro chip, 20% performance improvement</li>
            <li>Professional-grade triple camera system</li>
            <li>All-day battery life</li>
            <li>5G network support</li>
          </ul>
        </div>
      </el-collapse-item>
      
      <el-collapse-item name="specifications">
        <template #title>
          <div class="detail-title">
            <el-icon><List /></el-icon>
            <span>Technical Specifications</span>
          </div>
        </template>
        <div class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="Screen Size">6.7 inches</el-descriptions-item>
            <el-descriptions-item label="Resolution">2796 x 1290</el-descriptions-item>
            <el-descriptions-item label="Processor">A17 Pro</el-descriptions-item>
            <el-descriptions-item label="Storage">128GB/256GB/512GB</el-descriptions-item>
            <el-descriptions-item label="Camera">48MP main + 12MP ultra-wide + 12MP telephoto</el-descriptions-item>
            <el-descriptions-item label="Battery">4422mAh</el-descriptions-item>
            <el-descriptions-item label="Weight">221g</el-descriptions-item>
            <el-descriptions-item label="Colors">Deep Black, Silver, Gold, Deep Purple</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-collapse-item>
      
      <el-collapse-item name="reviews">
        <template #title>
          <div class="detail-title">
            <el-icon><Star /></el-icon>
            <span>User Reviews</span>
            <el-tag type="warning" size="small" class="review-count">
              4.8 stars (1,234 reviews)
            </el-tag>
          </div>
        </template>
        <div class="detail-content">
          <div class="review-summary">
            <el-rate v-model="averageRating" disabled show-score />
            <span class="rating-text">Overall Rating {{ averageRating }}/5</span>
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
            <span>Shipping Information</span>
          </div>
        </template>
        <div class="detail-content">
          <div class="shipping-options">
            <div class="shipping-option">
              <h4>Standard Shipping</h4>
              <p>Free shipping, estimated delivery in 3-5 business days</p>
            </div>
            <div class="shipping-option">
              <h4>Express Shipping</h4>
              <p>$15, estimated delivery in 1-2 business days</p>
            </div>
            <div class="shipping-option">
              <h4>Same-Day Delivery</h4>
              <p>$25, order before 18:00 for same-day delivery (limited areas)</p>
            </div>
          </div>
          
          <div class="shipping-note">
            <el-alert
              title="Shipping Notes"
              type="info"
              :closable="false"
              show-icon
            >
              <ul>
                <li>Nationwide shipping available, remote areas may require additional time</li>
                <li>Large items may require scheduled delivery</li>
                <li>Delivery times may be extended during holidays</li>
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
    name: 'John Doe',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 5,
    date: '2024-01-15',
    content: 'Very satisfied with this purchase. The phone has powerful performance and excellent photo quality. Highly recommended!'
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 4,
    date: '2024-01-14',
    content: 'Overall good, just a bit expensive, but the quality is indeed very good.'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    rating: 5,
    date: '2024-01-13',
    content: 'Been using it for a week now, very satisfied with all aspects, especially the battery life is very strong.'
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

## API Documentation

### Collapse Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| model-value / v-model | Currently active panel (if accordion mode, binding value type needs to be string, otherwise array) | string / array | — |
| accordion | Whether to activate accordion mode | boolean | false |

### Collapse Events

| Event Name | Description | Callback Parameters |
|--------|------|----------|
| change | Triggered when active panels change (if accordion mode, parameter activeNames type is string, otherwise array) | activeNames: array / string |

### Collapse Slots

| Slot Name | Description | Sub-tags |
|--------|------|--------|
| default | Custom default content | Collapse Item |

### Collapse Item Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| name | Unique identifier | string / number | — |
| title | Panel title | string | — |
| disabled | Whether to disable | boolean | false |

### Collapse Item Slots

| Slot Name | Description |
|--------|------|
| default | Content of Collapse Item |
| title | Title of Collapse Item |

## Best Practices

### Content Organization

1. **Logical Grouping**: Categorize related content into the same panel
2. **Clear Titles**: Use concise and clear titles to describe panel content
3. **Hierarchical Structure**: Arrange panel expansion order and importance reasonably

### User Experience

1. **Default State**: Set appropriate default expanded panels based on user needs
2. **Loading Performance**: Consider lazy loading for panels with large content
3. **Visual Feedback**: Provide clear expansion/collapse animation effects

### Responsive Design

1. **Mobile Adaptation**: Optimize touch experience on mobile devices
2. **Content Adaptation**: Ensure panel content displays normally on different screen sizes
3. **Interaction Optimization**: Provide larger click areas on small screens

### Accessibility

1. **Keyboard Navigation**: Support keyboard operation to expand/collapse panels
2. **Screen Readers**: Provide appropriate ARIA labels for panels
3. **Focus Management**: Properly manage focus states and order

## Common Issues

### 1. Panel Content Not Displaying

**Issue**: Content area does not expand after clicking panel title

**Solutions**:
- Check if `v-model` binding is correct
- Confirm `name` attribute is set correctly
- Check for CSS style conflicts

### 2. Accordion Mode Abnormality

**Issue**: Multiple panels can still be expanded despite setting `accordion`

**Solutions**:
- Confirm `v-model` is binding a string type rather than an array
- Check if `accordion` attribute is correctly set to `true`

### 3. Custom Title Style Issues

**Issue**: Style displays abnormally after using `title` slot

**Solutions**:
- Check CSS styles of slot content
- Ensure the original layout structure is not broken
- Use appropriate CSS selectors to avoid style conflicts

### 4. Animation Not Smooth

**Issue**: Panel expansion/collapse animation is jerky or unnatural

**Solutions**:
- Check if panel content is too complex
- Optimize CSS animation performance
- Consider using CSS `will-change` property

## Summary

The Collapse panel component is a practical content organization tool. Through proper configuration and use, it can effectively manage and display large amounts of information. In practical applications, attention should be paid to content organization, user experience, and accessibility best practices to provide a good user interaction experience.

## References

- [Element Plus Collapse Official Documentation](https://element-plus.org/en-US/component/collapse.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Animation Best Practices](https://web.dev/animations/)
- [Responsive Design Principles](https://web.dev/responsive-web-design-basics/)