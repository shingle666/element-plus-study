# Message

## Overview

The Message component is used to display brief messages at the top of the screen. It provides feedback for user actions and automatically disappears after a few seconds.

## Basic Usage

```javascript
import { ElMessage } from 'element-plus'

// Basic message
ElMessage('This is a message.')

// Message with type
ElMessage({
  message: 'Congrats, this is a success message.',
  type: 'success',
})
```

## Message Types

### Success Message
```javascript
ElMessage({
  message: 'Congrats, this is a success message.',
  type: 'success'
})

// Or use shorthand
ElMessage.success('Congrats, this is a success message.')
```

### Warning Message
```javascript
ElMessage({
  message: 'Warning, this is a warning message.',
  type: 'warning'
})

// Or use shorthand
ElMessage.warning('Warning, this is a warning message.')
```

### Info Message
```javascript
ElMessage({
  message: 'This is a message.',
  type: 'info'
})

// Or use shorthand
ElMessage.info('This is a message.')
```

### Error Message
```javascript
ElMessage({
  message: 'Oops, this is an error message.',
  type: 'error'
})

// Or use shorthand
ElMessage.error('Oops, this is an error message.')
```

## Closable Messages

```javascript
ElMessage({
  message: 'This is a closable message',
  showClose: true
})

ElMessage({
  message: 'Congrats, this is a success message.',
  type: 'success',
  showClose: true
})
```

## Centered Text

```javascript
ElMessage({
  message: 'Centered text',
  center: true
})
```

## HTML Content

```javascript
ElMessage({
  dangerouslyUseHTMLString: true,
  message: '<strong>This is <i>HTML</i> string</strong>'
})
```

**Warning**: Setting `dangerouslyUseHTMLString` to true can be dangerous because it's easy to get XSS attacks. Please make sure the content is trusted.

## Custom Duration

```javascript
// Message that stays for 10 seconds
ElMessage({
  message: 'This message will disappear after 10 seconds',
  duration: 10000
})

// Message that doesn't auto-close
ElMessage({
  message: 'This message will not auto-close',
  duration: 0,
  showClose: true
})
```

## Custom Icon

```javascript
import { Edit } from '@element-plus/icons-vue'

ElMessage({
  message: 'Message with custom icon',
  icon: Edit
})
```

## Grouping Messages

```javascript
// Enable grouping to prevent duplicate messages
ElMessage({
  message: 'This message will be grouped',
  grouping: true
})

// Multiple calls with same message will only show one
ElMessage({
  message: 'Same message',
  grouping: true
})
ElMessage({
  message: 'Same message',
  grouping: true
})
```

## Message with Offset

```javascript
ElMessage({
  message: 'Message with custom offset',
  offset: 100
})
```

## Programmatic Control

```javascript
// Get message instance for manual control
const messageInstance = ElMessage({
  message: 'This message can be closed manually',
  duration: 0,
  showClose: true
})

// Close the message programmatically
setTimeout(() => {
  messageInstance.close()
}, 3000)
```

## Close All Messages

```javascript
// Close all messages
ElMessage.closeAll()
```

## Vue Component Usage

```vue
<template>
  <div>
    <el-button @click="showMessage">Show Message</el-button>
    <el-button @click="showSuccess">Success</el-button>
    <el-button @click="showWarning">Warning</el-button>
    <el-button @click="showError">Error</el-button>
    <el-button @click="showInfo">Info</el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const showMessage = () => {
  ElMessage('This is a message')
}

const showSuccess = () => {
  ElMessage.success('Success message')
}

const showWarning = () => {
  ElMessage.warning('Warning message')
}

const showError = () => {
  ElMessage.error('Error message')
}

const showInfo = () => {
  ElMessage.info('Info message')
}
</script>
```

## Advanced Examples

### Message with Loading
```vue
<template>
  <el-button @click="handleSave" :loading="saving">Save</el-button>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const saving = ref(false)

const handleSave = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('Data saved successfully!')
  } catch (error) {
    ElMessage.error('Failed to save data. Please try again.')
  } finally {
    saving.value = false
  }
}
</script>
```

### Message Queue Management
```vue
<template>
  <div>
    <el-button @click="addMessage">Add Message</el-button>
    <el-button @click="clearMessages">Clear All</el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

let messageCount = 0

const addMessage = () => {
  messageCount++
  ElMessage({
    message: `Message ${messageCount}`,
    duration: 5000,
    showClose: true
  })
}

const clearMessages = () => {
  ElMessage.closeAll()
}
</script>
```

### Conditional Messages
```vue
<template>
  <div>
    <el-form @submit="handleSubmit">
      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  username: '',
  email: ''
})

const validateForm = () => {
  const errors = []
  
  if (!form.username) {
    errors.push('Username is required')
  }
  
  if (!form.email) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Please enter a valid email address')
  }
  
  return errors
}

const handleSubmit = () => {
  const errors = validateForm()
  
  if (errors.length > 0) {
    errors.forEach(error => {
      ElMessage.error(error)
    })
    return
  }
  
  ElMessage.success('Form submitted successfully!')
}
</script>
```

### Message with Custom Styling
```vue
<template>
  <el-button @click="showCustomMessage">Custom Message</el-button>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const showCustomMessage = () => {
  ElMessage({
    message: 'Custom styled message',
    type: 'success',
    customClass: 'custom-message',
    duration: 5000
  })
}
</script>

<style>
.custom-message {
  background: linear-gradient(45deg, #42b883, #35495e);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}
</style>
```

## Message Options

| Option | Description | Type | Default |
|--------|-------------|------|---------|
| message | Message text | string / VNode | — |
| type | Message type | string | info |
| icon | Custom icon component | Component | — |
| dangerouslyUseHTMLString | Whether message is treated as HTML string | boolean | false |
| customClass | Custom class name | string | — |
| duration | Display duration, milliseconds. If set to 0, it will not turn off automatically | number | 3000 |
| showClose | Whether to show a close button | boolean | false |
| center | Whether to center the text | boolean | false |
| onClose | Callback function when closed | function | — |
| offset | Set the distance to the top of viewport | number | 16 |
| appendTo | Set the root element for the message | string / HTMLElement | document.body |
| grouping | Merge messages with the same content | boolean | false |
| repeatNum | The number of repetitions, similar to badge, is used as the initial number when used with grouping | number | 1 |

## Message Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| close | Close the Message | — |

## Global Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| ElMessage | Show a message | options |
| ElMessage.success | Show a success message | message or options |
| ElMessage.warning | Show a warning message | message or options |
| ElMessage.info | Show an info message | message or options |
| ElMessage.error | Show an error message | message or options |
| ElMessage.closeAll | Close all messages | — |

## Message Types

The Message component supports four types:

- **success**: Used for successful operations
- **warning**: Used for warnings
- **info**: Used for general information (default)
- **error**: Used for errors

## Best Practices

1. **Appropriate Duration**: Use appropriate duration based on message importance
2. **Clear Messages**: Write concise and actionable messages
3. **Avoid Spam**: Use grouping to prevent duplicate messages
4. **Accessibility**: Ensure messages are accessible to screen readers
5. **Error Handling**: Always show error messages for failed operations
6. **Success Feedback**: Confirm successful operations with success messages

## Common Patterns

### API Response Handling
```javascript
const handleApiCall = async () => {
  try {
    const response = await api.call()
    ElMessage.success('Operation completed successfully')
    return response
  } catch (error) {
    ElMessage.error(error.message || 'An error occurred')
    throw error
  }
}
```

### Form Validation Messages
```javascript
const showValidationErrors = (errors) => {
  errors.forEach(error => {
    ElMessage.error(error.message)
  })
}
```

### Progress Updates
```javascript
const showProgress = (step, total) => {
  ElMessage.info(`Processing step ${step} of ${total}...`)
}
```

## Accessibility

- Messages are announced to screen readers
- Keyboard navigation is supported for closable messages
- Color is not the only way to convey information (icons are used)
- Sufficient color contrast is maintained

## Related Components

- [Alert](./alert.md) - Static alert messages
- [Notification](./notification.md) - Desktop-style notifications
- [Dialog](./dialog.md) - Modal dialogs
- [Loading](./loading.md) - Loading indicators