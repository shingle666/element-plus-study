# Alert

## Overview

The Alert component is used to display important information to users. It supports different types, themes, and interactive features to provide clear feedback and notifications.

## Basic Usage

```vue
<template>
  <div>
    <el-alert title="Success alert" type="success" />
    <el-alert title="Info alert" type="info" />
    <el-alert title="Warning alert" type="warning" />
    <el-alert title="Error alert" type="error" />
  </div>
</template>
```

## Alert Types

### Success Alert
```vue
<template>
  <el-alert
    title="Congratulations, it's a success"
    type="success"
    :closable="false"
  />
</template>
```

### Info Alert
```vue
<template>
  <el-alert
    title="Info: this is a info alert"
    type="info"
    :closable="false"
  />
</template>
```

### Warning Alert
```vue
<template>
  <el-alert
    title="Warning: this is a warning alert"
    type="warning"
    :closable="false"
  />
</template>
```

### Error Alert
```vue
<template>
  <el-alert
    title="Error: this is an error alert"
    type="error"
    :closable="false"
  />
</template>
```

## Theme Variations

### Light Theme (Default)
```vue
<template>
  <div>
    <el-alert title="Success alert" type="success" />
    <el-alert title="Info alert" type="info" />
    <el-alert title="Warning alert" type="warning" />
    <el-alert title="Error alert" type="error" />
  </div>
</template>
```

### Dark Theme
```vue
<template>
  <div>
    <el-alert title="Success alert" type="success" effect="dark" />
    <el-alert title="Info alert" type="info" effect="dark" />
    <el-alert title="Warning alert" type="warning" effect="dark" />
    <el-alert title="Error alert" type="error" effect="dark" />
  </div>
</template>
```

## Alert with Description

```vue
<template>
  <div>
    <el-alert
      title="Success"
      type="success"
      description="More text description"
    />
    
    <el-alert
      title="Info"
      type="info"
      description="More text description"
    />
    
    <el-alert
      title="Warning"
      type="warning"
      description="More text description"
    />
    
    <el-alert
      title="Error"
      type="error"
      description="More text description"
    />
  </div>
</template>
```

## Alert with Icon

```vue
<template>
  <div>
    <el-alert title="Success alert" type="success" show-icon />
    <el-alert title="Info alert" type="info" show-icon />
    <el-alert title="Warning alert" type="warning" show-icon />
    <el-alert title="Error alert" type="error" show-icon />
  </div>
</template>
```

## Alert with Icon and Description

```vue
<template>
  <div>
    <el-alert
      title="Success"
      type="success"
      description="More text description"
      show-icon
    />
    
    <el-alert
      title="Info"
      type="info"
      description="More text description"
      show-icon
    />
    
    <el-alert
      title="Warning"
      type="warning"
      description="More text description"
      show-icon
    />
    
    <el-alert
      title="Error"
      type="error"
      description="More text description"
      show-icon
    />
  </div>
</template>
```

## Centered Alert

```vue
<template>
  <div>
    <el-alert
      title="Success"
      type="success"
      center
      show-icon
    />
    
    <el-alert
      title="Info"
      type="info"
      center
      show-icon
    />
    
    <el-alert
      title="Warning"
      type="warning"
      center
      show-icon
    />
    
    <el-alert
      title="Error"
      type="error"
      center
      show-icon
    />
  </div>
</template>
```

## Closable Alert

```vue
<template>
  <div>
    <el-alert
      title="Unclosable alert"
      type="success"
      :closable="false"
    />
    
    <el-alert
      title="Closable alert"
      type="info"
      closable
      @close="handleClose"
    />
    
    <el-alert
      title="Customized close-text"
      type="warning"
      close-text="Gotcha"
    />
  </div>
</template>

<script setup>
const handleClose = () => {
  console.log('Alert closed')
}
</script>
```

## Custom Content

```vue
<template>
  <div>
    <el-alert title="Alert with custom content" type="info">
      <template #default>
        <p>This is a custom content area.</p>
        <p>You can put any content here, including:</p>
        <ul>
          <li>Lists</li>
          <li>Links: <a href="#">Click here</a></li>
          <li>Other components</li>
        </ul>
      </template>
    </el-alert>
    
    <el-alert type="warning">
      <template #title>
        <span>Custom Title with <strong>HTML</strong></span>
      </template>
      <template #default>
        <p>Custom content with <em>emphasis</em> and other formatting.</p>
      </template>
    </el-alert>
  </div>
</template>
```

## Alert with Actions

```vue
<template>
  <div>
    <el-alert
      title="Action Required"
      type="warning"
      description="Please review and confirm your settings before proceeding."
      show-icon
    >
      <template #default>
        <div style="margin-top: 10px;">
          <el-button size="small" type="primary" @click="handleConfirm">
            Confirm
          </el-button>
          <el-button size="small" @click="handleCancel">
            Cancel
          </el-button>
        </div>
      </template>
    </el-alert>
    
    <el-alert
      title="Update Available"
      type="info"
      description="A new version is available. Would you like to update now?"
      show-icon
    >
      <template #default>
        <div style="margin-top: 10px;">
          <el-button size="small" type="primary" @click="handleUpdate">
            Update Now
          </el-button>
          <el-button size="small" type="text" @click="handleLater">
            Remind Me Later
          </el-button>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup>
const handleConfirm = () => {
  console.log('Confirmed')
}

const handleCancel = () => {
  console.log('Cancelled')
}

const handleUpdate = () => {
  console.log('Update started')
}

const handleLater = () => {
  console.log('Remind later')
}
</script>
```

## Dynamic Alerts

```vue
<template>
  <div>
    <el-button @click="addAlert">Add Alert</el-button>
    <el-button @click="clearAlerts">Clear All</el-button>
    
    <div style="margin-top: 20px;">
      <el-alert
        v-for="alert in alerts"
        :key="alert.id"
        :title="alert.title"
        :type="alert.type"
        :description="alert.description"
        show-icon
        closable
        @close="removeAlert(alert.id)"
        style="margin-bottom: 10px;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const alerts = ref([])
let alertId = 0

const alertTypes = ['success', 'info', 'warning', 'error']
const alertMessages = {
  success: { title: 'Success!', description: 'Operation completed successfully.' },
  info: { title: 'Information', description: 'Here is some important information.' },
  warning: { title: 'Warning!', description: 'Please pay attention to this warning.' },
  error: { title: 'Error!', description: 'An error occurred. Please try again.' }
}

const addAlert = () => {
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
  const message = alertMessages[type]
  
  alerts.value.push({
    id: ++alertId,
    type,
    title: message.title,
    description: message.description
  })
}

const removeAlert = (id) => {
  const index = alerts.value.findIndex(alert => alert.id === id)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
}

const clearAlerts = () => {
  alerts.value = []
}
</script>
```

## Alert with Progress

```vue
<template>
  <div>
    <el-alert
      title="Upload in Progress"
      type="info"
      :closable="false"
      show-icon
    >
      <template #default>
        <p>Uploading files... {{ progress }}%</p>
        <el-progress :percentage="progress" :show-text="false" />
        <div style="margin-top: 10px;">
          <el-button size="small" @click="startUpload" :disabled="uploading">
            {{ uploading ? 'Uploading...' : 'Start Upload' }}
          </el-button>
          <el-button size="small" @click="cancelUpload" :disabled="!uploading">
            Cancel
          </el-button>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0)
const uploading = ref(false)
let uploadTimer = null

const startUpload = () => {
  uploading.value = true
  progress.value = 0
  
  uploadTimer = setInterval(() => {
    progress.value += Math.random() * 10
    if (progress.value >= 100) {
      progress.value = 100
      uploading.value = false
      clearInterval(uploadTimer)
    }
  }, 200)
}

const cancelUpload = () => {
  uploading.value = false
  progress.value = 0
  if (uploadTimer) {
    clearInterval(uploadTimer)
    uploadTimer = null
  }
}
</script>
```

## Alert Attributes

| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| title | Title of Alert | string | — |
| type | Alert type | string | info |
| description | Descriptive text | string | — |
| closable | Whether Alert can be dismissed | boolean | true |
| center | Whether to center the text | boolean | false |
| close-text | Customized close button text | string | — |
| show-icon | Whether to show an icon | boolean | false |
| effect | Theme of Alert | string | light |

## Alert Events

| Event | Description | Parameters |
|-------|-------------|------------|
| close | Triggered when Alert is closed | — |

## Alert Slots

| Name | Description |
|------|-------------|
| — | Content of Alert |
| title | Content of Alert title |

## Alert Types

The Alert component supports four types:

- **success**: Used for successful operations and positive feedback
- **info**: Used for general information and neutral messages
- **warning**: Used for warnings and cautionary messages
- **error**: Used for errors and critical issues

## Best Practices

1. **Appropriate Usage**: Use the correct alert type for the message context
2. **Clear Messaging**: Write concise and actionable alert messages
3. **Accessibility**: Ensure alerts are announced to screen readers
4. **Positioning**: Place alerts where users expect to see feedback
5. **Auto-dismiss**: Consider auto-dismissing non-critical alerts
6. **Action Buttons**: Provide clear actions when user intervention is required

## Common Use Cases

### Form Validation Alerts
```vue
<template>
  <el-form @submit="handleSubmit">
    <el-alert
      v-if="formErrors.length > 0"
      title="Please fix the following errors:"
      type="error"
      show-icon
    >
      <template #default>
        <ul>
          <li v-for="error in formErrors" :key="error">{{ error }}</li>
        </ul>
      </template>
    </el-alert>
    
    <!-- Form fields -->
  </el-form>
</template>
```

### System Status Alerts
```vue
<template>
  <div>
    <el-alert
      v-if="systemStatus === 'maintenance'"
      title="System Maintenance"
      type="warning"
      description="The system will be under maintenance from 2:00 AM to 4:00 AM UTC."
      show-icon
      :closable="false"
    />
    
    <el-alert
      v-if="systemStatus === 'offline'"
      title="System Offline"
      type="error"
      description="The system is currently offline. Please try again later."
      show-icon
      :closable="false"
    />
  </div>
</template>
```

### Success Confirmation
```vue
<template>
  <el-alert
    v-if="showSuccess"
    title="Changes Saved Successfully"
    type="success"
    description="Your changes have been saved and will take effect immediately."
    show-icon
    @close="showSuccess = false"
  />
</template>
```

## Related Components

- [Message](/en/feedback-components/Message) - Floating message notifications
- [Notification](/en/feedback-components/Notification) - Desktop-style notifications
- [Dialog](/en/feedback-components/Dialog) - Modal dialogs for important messages
- [Popover](/en/feedback-components/Popover) - Contextual information popups