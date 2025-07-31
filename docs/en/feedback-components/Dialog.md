# Dialog Component

## Learning Objectives

Through this chapter, you will master:
- **Basic Dialog**: Master the basic usage and property configuration of Dialog
- **Dialog Size Settings**: Learn to control the width, height, and position of dialogs
- **Dialog Drag Functionality**: Implement draggable dialog interactions
- **Dialog Nesting Handling**: Handle complex nested dialog scenarios
- **Dialog Animation Effects**: Customize dialog show and hide animations
- **Dialog Event Handling**: Master listening and handling of various events
- **Dialog Accessibility**: Implement dialogs that meet accessibility standards
- **Dialog Performance Optimization**: Optimize dialog rendering and memory usage

**Estimated Learning Time:** 105 minutes

## Overview

Dialog is a modal popup layer component used to display important information or carry related operations while preserving the current page state. It provides high customizability and is suitable for complex interaction scenarios.

### Main Features

- **Modal Interaction**: Prevents users from interacting with the background page, ensuring focus on dialog content
- **Lazy Rendering**: Content is rendered only when first opened, optimizing initial loading performance
- **Clear Structure**: Divided into header, body, and footer sections, supporting flexible customization
- **Size Control**: Supports custom width, height, and position settings
- **Close Control**: Provides multiple closing methods and pre-close confirmation mechanisms
- **Nesting Support**: Supports multi-layer dialog nesting to meet complex business requirements
- **Accessibility**: Built-in keyboard navigation and screen reader support
- **Animation Effects**: Provides smooth show and hide animations

### Use Cases

- **Information Display**: Such as user details, product introductions, help instructions, etc.
- **Form Operations**: Such as adding, editing, settings, and other scenarios requiring user input
- **Confirmation Operations**: Such as delete confirmations, important operation reminders, etc.
- **Content Preview**: Such as image viewing, document preview, video playback, etc.
- **Complex Interactions**: Such as multi-step wizards, nested selections, data filtering, etc.
- **Error Handling**: Such as error detail display, exception information explanation, etc.

## Basic Usage

### Basic Usage

You need to set the `model-value` / `v-model` attribute, which accepts a Boolean. When it's true, the Dialog is displayed. The `title` attribute is used to define the title, which is optional and defaults to empty.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Confirm to close?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

### Custom Content

The content of Dialog can be anything, even a table or form. This example shows how to use Element Plus's table and form in Dialog.

```vue
<template>
  <!-- Table Dialog -->
  <el-button plain @click="dialogTableVisible = true">
    Open Dialog with nested table
  </el-button>
  <el-dialog v-model="dialogTableVisible" title="Shipping Address">
    <el-table :data="gridData">
      <el-table-column property="date" label="Date" width="150" />
      <el-table-column property="name" label="Name" width="200" />
      <el-table-column property="address" label="Address" />
    </el-table>
  </el-dialog>

  <!-- Form Dialog -->
  <el-button plain @click="dialogFormVisible = true">
    Open Dialog with nested form
  </el-button>
  <el-dialog v-model="dialogFormVisible" title="Shipping Address">
    <el-form :model="form">
      <el-form-item label="Activity name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Activity zone" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select activity zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '120px'

const gridData = [
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No.1518, Jinshajiang Road, Putuo District, Shanghai'
  },
  {
    date: '2016-05-04',
    name: 'John',
    address: 'No.1518, Jinshajiang Road, Putuo District, Shanghai'
  }
]

const form = ref({
  name: '',
  region: ''
})
</script>
```

### Custom Header

The `header` can be used to customize the area that displays the title. To maintain usability, in addition to using this slot, use the `title` attribute, or use the `titleId` slot property to specify which elements should be read as the dialog title.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Custom Header
  </el-button>

  <el-dialog v-model="dialogVisible" width="500">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">Custom Header</h4>
        <el-button type="danger" @click="close">
          <el-icon><CloseBold /></el-icon>
        </el-button>
      </div>
    </template>
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
```

### Nested Dialog

If you need to nest another Dialog inside a Dialog, you need to use the `append-to-body` attribute. Usually we don't recommend using nested dialogs. If you must display another dialog within a dialog, you can set the `append-to-body` attribute of the inner nested dialog to true.

```vue
<template>
  <el-button plain @click="outerVisible = true">
    Click to open outer Dialog
  </el-button>

  <el-dialog v-model="outerVisible" title="Outer Dialog">
    <el-dialog
      v-model="innerVisible"
      width="30%"
      title="Inner Dialog"
      append-to-body
    >
      <span>Inner dialog content</span>
    </el-dialog>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="innerVisible = true">
          Open inner Dialog
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const outerVisible = ref(false)
const innerVisible = ref(false)
</script>
```

### Centered Content

Set `center` to true to center the title and footer. `center` only affects the title and footer areas.

```vue
<template>
  <el-button plain @click="centerDialogVisible = true">
    Click to open centered Dialog
  </el-button>

  <el-dialog v-model="centerDialogVisible" title="Tips" width="30%" center>
    <span>Note that the content is arbitrary, centering refers to centering the header and footer.</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
```

### Align Center Dialog

Set `align-center` to true to center the dialog horizontally and vertically. Since the dialog is vertically centered in a flex box, the `top` property will not work.

```vue
<template>
  <el-button plain @click="centerDialogVisible = true">
    Click to open centered Dialog
  </el-button>

  <el-dialog
    v-model="centerDialogVisible"
    title="Tips"
    width="30%"
    align-center
  >
    <span>Dialog displays in the center of the screen</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
```

### Destroy on Close

When this feature is enabled, the content under the default slot will be destroyed using the v-if directive. This feature can be enabled when performance issues occur.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    destroy-on-close
  >
    <span>Content destroyed on close</span>
  </el-dialog>
</template>
```

### Draggable Dialog

Set the `draggable` attribute to true to enable dragging. Set `overflow` to true to allow the drag range to exceed the visible area.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open draggable Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Draggable Dialog"
    width="30%"
    draggable
    overflow
  >
    <span>Try dragging the header part</span>
  </el-dialog>
</template>
```

### Fullscreen

Set the `fullscreen` attribute to open a fullscreen dialog. If `fullscreen` is true, the `width`, `top`, and `draggable` attributes are invalid.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open fullscreen Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Fullscreen Dialog"
    fullscreen
  >
    <span>This is a fullscreen dialog</span>
  </el-dialog>
</template>
```

### Modal

Setting `modal` to false will hide the dialog's modal (overlay). When the value of `modal` is false, make sure the `append-to-body` attribute is true.

```vue
<template>
  <el-button plain @click="dialogVisible = true">
    Click to open non-modal Dialog
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="Non-modal Dialog"
    :modal="false"
    append-to-body
  >
    <span>This is a non-modal dialog</span>
  </el-dialog>
</template>
```

## Practical Application Examples

### User Information Edit Dialog

This example shows how to create a user information edit dialog, including form validation, submission handling, and error handling.

```vue
<template>
  <div class="user-management">
    <el-button type="primary" @click="openEditDialog">Edit User Info</el-button>
    
    <el-dialog
      v-model="dialogVisible"
      title="Edit User Information"
      width="600px"
      :before-close="handleClose"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item label="Username" prop="username">
          <el-input v-model="userForm.username" placeholder="Please enter username" />
        </el-form-item>
        
        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" placeholder="Please enter email" />
        </el-form-item>
        
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="userForm.phone" placeholder="Please enter phone number" />
        </el-form-item>
        
        <el-form-item label="Role" prop="role">
          <el-select v-model="userForm.role" placeholder="Please select role">
            <el-option label="Admin" value="admin" />
            <el-option label="User" value="user" />
            <el-option label="Guest" value="guest" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" :loading="loading" @click="submitForm">
            {{ loading ? 'Saving...' : 'Save' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  role: ''
})

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Please enter phone number', trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Please select role', trigger: 'change' }
  ]
}

const openEditDialog = () => {
  dialogVisible.value = true
}

const handleClose = (done) => {
  if (loading.value) {
    ElMessage.warning('Please wait for the operation to complete')
    return
  }
  done()
}

const submitForm = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('User information updated successfully')
    dialogVisible.value = false
    
    // Reset form
    Object.assign(userForm, {
      username: '',
      email: '',
      phone: '',
      role: ''
    })
  } catch (error) {
    ElMessage.error('Please check the form data')
  } finally {
    loading.value = false
  }
}
</script>
```

## API Reference

### Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| model-value / v-model | visibility of Dialog | boolean | — | — |
| title | title of Dialog. Can also be passed with a named slot | string | — | — |
| width | width of Dialog | string / number | — | 50% |
| fullscreen | whether the Dialog takes up full screen | boolean | — | false |
| top | value for margin-top of Dialog CSS | string | — | 15vh |
| modal | whether a mask is displayed | boolean | — | true |
| append-to-body | whether to append Dialog to body | boolean | — | false |
| lock-scroll | whether scroll of body is disabled while Dialog is displayed | boolean | — | true |
| custom-class | custom class names for Dialog | string | — | — |
| open-delay | Time(milliseconds) before open | number | — | 0 |
| close-delay | Time(milliseconds) before close | number | — | 0 |
| close-on-click-modal | whether the Dialog can be closed by clicking the mask | boolean | — | true |
| close-on-press-escape | whether the Dialog can be closed by pressing ESC | boolean | — | true |
| show-close | whether to show a close button | boolean | — | true |
| before-close | callback before Dialog closes, and it will prevent Dialog from closing | function(done)，done is used to close the Dialog | — | — |
| draggable | enable dragging feature for Dialog | boolean | — | false |
| overflow | dragging overflow the viewport | boolean | — | false |
| center | whether to align the header and footer in center | boolean | — | false |
| align-center | whether to align the dialog both horizontally and vertically | boolean | — | false |
| destroy-on-close | Destroy elements in Dialog when closed | boolean | — | false |

### Slots

| Name | Description |
|------|-------------|
| — | content of Dialog |
| header | content of the Dialog header; Replaces the title |
| title | content of the Dialog title; Replaces the title, but the header slot has a higher priority |
| footer | content of Dialog footer |

### Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| open | triggered when the Dialog opens | — |
| opened | triggered when the Dialog opening animation ends | — |
| close | triggered when the Dialog closes | — |
| closed | triggered when the Dialog closing animation ends | — |
| open-auto-focus | triggered when the Dialog opens and the content element gains focus | — |
| close-auto-focus | triggered when the Dialog closes and the content element loses focus | — |

## Best Practices

### Design Principles

1. **Clear Purpose**: Each dialog should have a clear purpose and action
2. **Appropriate Size**: Choose appropriate dialog size based on content
3. **Consistent Interaction**: Maintain consistent interaction patterns across dialogs
4. **Accessibility**: Ensure keyboard navigation and screen reader support

### User Experience

1. **Loading States**: Show loading indicators during operations
2. **Error Handling**: Provide clear error messages and recovery options
3. **Data Persistence**: Preserve user input when appropriate
4. **Confirmation**: Ask for confirmation before destructive actions

### Performance Optimization

1. **Lazy Loading**: Use destroy-on-close for heavy content
2. **Event Cleanup**: Clean up event listeners when dialog closes
3. **Memory Management**: Avoid memory leaks in nested dialogs
4. **Animation Performance**: Use CSS transforms for smooth animations

## Summary

The Dialog component is a powerful tool for creating modal interactions in web applications. By understanding its various features and following best practices, you can create user-friendly and accessible dialog experiences that enhance your application's usability.