# Result

## Overview

The Result component is used to display the results of operations, such as success, warning, error, or information. It provides visual feedback to users about the outcome of their actions, enhancing the user experience by clearly communicating the status of operations.

## Learning Objectives

- Master the basic usage of the Result component
- Learn to customize the Result component's appearance
- Understand how to use different result types
- Learn to add custom content to the Result component
- Apply the Result component in practical scenarios

## Basic Usage

### Basic Result

The basic Result component displays an icon, title, and optional description:

```vue
<template>
  <div class="result-demo">
    <h3>Basic Result</h3>
    
    <el-result
      title="Success"
      sub-title="The operation completed successfully"
      icon="success"
    >
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.result-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
```

### Different Result Types

The Result component supports different types to represent various operation outcomes:

```vue
<template>
  <div class="result-types-demo">
    <h3>Result Types</h3>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="Success" name="success">
        <el-result
          title="Success"
          sub-title="The operation completed successfully"
          icon="success"
        >
          <template #extra>
            <el-button type="primary">Back</el-button>
          </template>
        </el-result>
      </el-tab-pane>
      
      <el-tab-pane label="Warning" name="warning">
        <el-result
          title="Warning"
          sub-title="There are some issues with your operation"
          icon="warning"
        >
          <template #extra>
            <el-button type="warning">View Details</el-button>
            <el-button>Back</el-button>
          </template>
        </el-result>
      </el-tab-pane>
      
      <el-tab-pane label="Error" name="error">
        <el-result
          title="Error"
          sub-title="The operation has failed"
          icon="error"
        >
          <template #extra>
            <el-button type="danger">Report Error</el-button>
            <el-button>Try Again</el-button>
          </template>
        </el-result>
      </el-tab-pane>
      
      <el-tab-pane label="Info" name="info">
        <el-result
          title="Information"
          sub-title="Additional information about the operation"
          icon="info"
        >
          <template #extra>
            <el-button type="primary">Learn More</el-button>
          </template>
        </el-result>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('success')
</script>

<style scoped>
.result-types-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
```

### Custom Icon

You can customize the icon displayed in the Result component:

```vue
<template>
  <div class="custom-icon-demo">
    <h3>Custom Icon</h3>
    
    <el-result title="Custom Icon">
      <template #icon>
        <el-icon :size="64" color="#409eff">
          <Star />
        </el-icon>
      </template>
      <template #sub-title>
        <p>You can customize the icon based on your needs</p>
      </template>
      <template #extra>
        <el-button type="primary">Action</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup>
import { Star } from '@element-plus/icons-vue'
</script>

<style scoped>
.custom-icon-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
```

### Custom Content

You can add custom content to the Result component using slots:

```vue
<template>
  <div class="custom-content-demo">
    <h3>Custom Content</h3>
    
    <el-result
      title="Order Submitted"
      sub-title="Order number: 2023042601"
      icon="success"
    >
      <template #extra>
        <el-button type="primary">View Order</el-button>
        <el-button>Back to Shopping</el-button>
      </template>
      
      <!-- Custom content -->
      <div class="order-info">
        <h4>Order Information</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Product">Element Plus Pro</el-descriptions-item>
          <el-descriptions-item label="Order ID">OD202304260001</el-descriptions-item>
          <el-descriptions-item label="Amount">$199.00</el-descriptions-item>
          <el-descriptions-item label="Payment">Credit Card</el-descriptions-item>
          <el-descriptions-item label="Status" :span="2">
            <el-tag type="success">Paid</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-result>
  </div>
</template>

<style scoped>
.custom-content-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.order-info {
  margin-top: 20px;
  text-align: left;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.order-info h4 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #303133;
}
</style>
```

## Practical Application Examples

### Form Submission Result

```vue
<template>
  <div class="form-submission-demo">
    <h3>Form Submission Example</h3>
    
    <div v-if="!submitted">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="submission-form"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        
        <el-form-item label="Message" prop="message">
          <el-input v-model="form.message" type="textarea" rows="4" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
          <el-button @click="resetForm(formRef)">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div v-else>
      <el-result
        :title="resultInfo.title"
        :sub-title="resultInfo.subTitle"
        :icon="resultInfo.icon"
      >
        <template #extra>
          <el-button type="primary" @click="submitted = false">
            Submit Another Form
          </el-button>
          <el-button @click="goHome">Back to Home</el-button>
        </template>
        
        <div v-if="resultInfo.icon === 'success'" class="submission-details">
          <h4>Submission Details</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Name">{{ form.name }}</el-descriptions-item>
            <el-descriptions-item label="Email">{{ form.email }}</el-descriptions-item>
            <el-descriptions-item label="Phone">{{ form.phone }}</el-descriptions-item>
            <el-descriptions-item label="Message">{{ form.message }}</el-descriptions-item>
            <el-descriptions-item label="Submission Time">{{ submissionTime }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref()
const submitted = ref(false)
const submissionTime = ref('')
const resultInfo = ref({
  title: '',
  subTitle: '',
  icon: ''
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const rules = {
  name: [
    { required: true, message: 'Please enter your name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter your phone number', trigger: 'blur' }
  ],
  message: [
    { required: true, message: 'Please enter your message', trigger: 'blur' },
    { min: 10, max: 500, message: 'Length should be 10 to 500 characters', trigger: 'blur' }
  ]
}

const submitForm = async (formEl) => {
  if (!formEl) return
  
  await formEl.validate((valid, fields) => {
    if (valid) {
      // Simulate API call
      setTimeout(() => {
        // Randomly succeed or fail for demonstration
        const success = Math.random() > 0.3
        
        if (success) {
          resultInfo.value = {
            title: 'Submission Successful',
            subTitle: 'Your form has been submitted successfully. We will contact you soon.',
            icon: 'success'
          }
          submissionTime.value = new Date().toLocaleString()
        } else {
          resultInfo.value = {
            title: 'Submission Failed',
            subTitle: 'There was an error processing your submission. Please try again later.',
            icon: 'error'
          }
        }
        
        submitted.value = true
      }, 1000)
      
      ElMessage.success('Form validation passed')
    } else {
      ElMessage.error('Form validation failed')
      console.log('Validation failed fields:', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const goHome = () => {
  console.log('Navigate to home page')
}
</script>

<style scoped>
.form-submission-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.submission-form {
  max-width: 600px;
  margin: 0 auto;
}

.submission-details {
  margin-top: 20px;
  text-align: left;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.submission-details h4 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #303133;
}
</style>
```

### Payment Result Page

```vue
<template>
  <div class="payment-result-demo">
    <h3>Payment Result Example</h3>
    
    <div class="payment-simulator">
      <p>Simulate payment result:</p>
      <el-radio-group v-model="paymentStatus">
        <el-radio-button label="success">Success</el-radio-button>
        <el-radio-button label="processing">Processing</el-radio-button>
        <el-radio-button label="error">Error</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="processPayment" style="margin-left: 16px">
        Process Payment
      </el-button>
    </div>
    
    <div v-if="showResult" class="payment-result">
      <el-result
        :title="paymentInfo.title"
        :sub-title="paymentInfo.subTitle"
        :icon="paymentInfo.icon"
      >
        <template #extra>
          <div class="action-buttons">
            <el-button 
              v-if="paymentStatus === 'error'" 
              type="primary" 
              @click="processPayment"
            >
              Try Again
            </el-button>
            <el-button 
              v-if="paymentStatus === 'success'" 
              type="primary" 
              @click="viewOrder"
            >
              View Order
            </el-button>
            <el-button @click="contactSupport">
              Contact Support
            </el-button>
            <el-button @click="goToOrders">
              My Orders
            </el-button>
          </div>
        </template>
        
        <div v-if="paymentStatus === 'success'" class="payment-details">
          <h4>Payment Details</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Order ID">{{ orderDetails.id }}</el-descriptions-item>
            <el-descriptions-item label="Amount">{{ orderDetails.amount }}</el-descriptions-item>
            <el-descriptions-item label="Payment Method">{{ orderDetails.paymentMethod }}</el-descriptions-item>
            <el-descriptions-item label="Transaction ID">{{ orderDetails.transactionId }}</el-descriptions-item>
            <el-descriptions-item label="Date">{{ orderDetails.date }}</el-descriptions-item>
          </el-descriptions>
          
          <h4 style="margin-top: 20px">Delivery Information</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Recipient">{{ orderDetails.recipient }}</el-descriptions-item>
            <el-descriptions-item label="Address">{{ orderDetails.address }}</el-descriptions-item>
            <el-descriptions-item label="Expected Delivery">{{ orderDetails.deliveryDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        
        <div v-if="paymentStatus === 'processing'" class="processing-info">
          <el-alert
            title="Your payment is being processed"
            type="info"
            description="This may take a few minutes. Please do not refresh the page."
            show-icon
          />
          <div class="processing-progress">
            <el-progress :percentage="processingProgress" />
          </div>
          <p class="processing-note">
            You will receive an email confirmation once the payment is complete.
          </p>
        </div>
        
        <div v-if="paymentStatus === 'error'" class="error-info">
          <el-alert
            title="Payment Error Details"
            type="error"
            description="There was an issue processing your payment. This could be due to insufficient funds, expired card, or a temporary system issue."
            show-icon
          />
          <div class="error-code">
            <p>Error Code: <strong>{{ errorDetails.code }}</strong></p>
            <p>Message: {{ errorDetails.message }}</p>
          </div>
        </div>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const paymentStatus = ref('success')
const showResult = ref(false)
const processingProgress = ref(0)
const progressInterval = ref(null)

const orderDetails = ref({
  id: 'ORD-2023-04-26-001',
  amount: '$299.99',
  paymentMethod: 'Credit Card (Visa ****1234)',
  transactionId: 'TXN-987654321',
  date: new Date().toLocaleString(),
  recipient: 'John Doe',
  address: '123 Main St, Apt 4B, New York, NY 10001',
  deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
})

const errorDetails = ref({
  code: 'ERR-PAYMENT-5001',
  message: 'The transaction was declined by your bank. Please try another payment method or contact your bank for assistance.'
})

const paymentInfo = computed(() => {
  const infoMap = {
    success: {
      title: 'Payment Successful',
      subTitle: `Order ID: ${orderDetails.value.id} - Thank you for your purchase!`,
      icon: 'success'
    },
    processing: {
      title: 'Payment Processing',
      subTitle: 'Your payment is being processed. Please wait...',
      icon: 'info'
    },
    error: {
      title: 'Payment Failed',
      subTitle: 'There was an error processing your payment.',
      icon: 'error'
    }
  }
  
  return infoMap[paymentStatus.value]
})

const processPayment = () => {
  showResult.value = true
  
  if (paymentStatus.value === 'processing') {
    processingProgress.value = 0
    startProgressSimulation()
  }
}

const startProgressSimulation = () => {
  clearInterval(progressInterval.value)
  
  progressInterval.value = setInterval(() => {
    processingProgress.value += 10
    
    if (processingProgress.value >= 100) {
      clearInterval(progressInterval.value)
      paymentStatus.value = 'success'
      ElMessage.success('Payment processed successfully')
    }
  }, 1000)
}

const viewOrder = () => {
  ElMessage.info('Navigating to order details')
}

const contactSupport = () => {
  ElMessage.info('Opening support chat')
}

const goToOrders = () => {
  ElMessage.info('Navigating to orders page')
}

onMounted(() => {
  // Clean up interval on component unmount
  return () => {
    clearInterval(progressInterval.value)
  }
})
</script>

<style scoped>
.payment-result-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.payment-simulator {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-simulator p {
  margin: 0;
  margin-right: 10px;
}

.payment-result {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.payment-details {
  margin-top: 20px;
  text-align: left;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.payment-details h4 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #303133;
}

.processing-info {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.processing-progress {
  margin: 20px 0;
}

.processing-note {
  color: #606266;
  font-size: 14px;
}

.error-info {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.error-code {
  margin-top: 16px;
  padding: 16px;
  background-color: #fef0f0;
  border-radius: 4px;
  text-align: left;
}

.error-code p {
  margin: 8px 0;
  color: #606266;
}
</style>
```

### 404 Page Not Found

```vue
<template>
  <div class="not-found-demo">
    <h3>404 Page Example</h3>
    
    <el-result
      title="404"
      sub-title="Sorry, the page you visited does not exist."
      icon="error"
    >
      <template #extra>
        <div class="not-found-actions">
          <el-button type="primary" @click="goHome">Back to Home</el-button>
          <el-button @click="goBack">Go Back</el-button>
          <el-button @click="reportIssue">Report Issue</el-button>
        </div>
      </template>
      
      <div class="not-found-help">
        <h4>Looking for something?</h4>
        <p>Try one of these popular pages:</p>
        <ul class="popular-links">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">User Profile</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
        
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Search..."
            @keyup.enter="search"
          >
            <template #append>
              <el-button @click="search">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-result>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')

const goHome = () => {
  ElMessage.info('Navigating to home page')
}

const goBack = () => {
  ElMessage.info('Going back to previous page')
}

const reportIssue = () => {
  ElMessage.info('Opening issue report form')
}

const search = () => {
  if (searchQuery.value.trim()) {
    ElMessage.info(`Searching for: ${searchQuery.value}`)
  }
}
</script>

<style scoped>
.not-found-demo {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 20px;
}

.not-found-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.not-found-help {
  margin-top: 30px;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.not-found-help h4 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}

.not-found-help p {
  margin-bottom: 16px;
  color: #606266;
}

.popular-links {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.popular-links li a {
  color: #409eff;
  text-decoration: none;
}

.popular-links li a:hover {
  text-decoration: underline;
}

.search-box {
  max-width: 400px;
  margin: 0 auto;
}
</style>
```

## API Documentation

### Result Attributes

| Parameter | Description | Type | Accepted Values | Default |
|------|------|------|--------|--------|
| title | Title | string | — | — |
| sub-title | Sub title | string | — | — |
| icon | Icon type | string | success / warning / info / error | info |

### Result Slots

| Name | Description |
|------|------|
| icon | Custom icon |
| title | Custom title |
| sub-title | Custom sub title |
| extra | Custom extra area |
| default | Custom content |

## Best Practices

### When to Use the Result Component

- **Operation Feedback**: Use the Result component to provide clear feedback after user operations, such as form submissions, payments, or other actions that require confirmation.
- **Empty States**: Use it to display empty states or when no data is available, providing guidance on what users can do next.
- **Error Pages**: Use it for error pages like 404, 403, or 500 errors, offering users helpful information and navigation options.

### Design Tips

1. **Choose the Right Icon**: Select an appropriate icon that clearly communicates the status of the operation:
   - Success (check mark): For successful operations
   - Warning (exclamation mark): For operations that completed but with issues
   - Error (X mark): For failed operations
   - Info (i): For informational messages

2. **Clear and Concise Messaging**:
   - Title: Use a short, clear title that immediately conveys the status
   - Sub-title: Provide additional context or instructions
   - Avoid technical jargon unless your audience is technical

3. **Actionable Next Steps**:
   - Always include at least one action button
   - The primary action should be the most likely next step
   - Consider including secondary actions for alternative paths

4. **Consistent Styling**:
   - Maintain consistent color coding across your application
   - Use the same icon and color combinations for similar states

### Accessibility Considerations

- Ensure proper color contrast for text and background
- Use semantic HTML elements for custom content
- Include appropriate ARIA attributes when adding custom interactive elements
- Ensure keyboard navigation works for all interactive elements

## Summary

The Result component is a versatile tool for providing feedback to users about the outcome of their actions. It can be used in various scenarios, from simple success messages to complex error pages with multiple actions.

Through this document, you should be able to:

1. Implement basic Result components with different status types
2. Customize the appearance and content of Result components
3. Apply the Result component in practical scenarios like form submissions, payment results, and error pages
4. Follow best practices for effective user feedback

By using the Result component effectively, you can enhance the user experience of your application by providing clear, actionable feedback that guides users through their journey.

## References

- [Element Plus Result Official Documentation](https://element-plus.org/en-US/component/result.html)
- [UX Design for Form Validation](https://www.smashingmagazine.com/2012/06/form-field-validation-errors-only-approach/)
- [Error Page Design Best Practices](https://www.smashingmagazine.com/2009/01/404-error-pages-one-more-time/)