# Radio Component

## Overview

The Radio component is used to select a single option from a set of choices. It is one of the most commonly used components in forms, providing various styles and configuration options, supporting both single radio and radio group usage methods.

## Learning Objectives

- Master the basic concepts and use cases of Radio
- Learn how to use basic radio buttons
- Understand radio group configuration and management
- Master different radio styles implementation
- Learn radio state control and event handling
- Understand radio sizes and disabled states
- Master the complete usage of the API

## Basic Usage

### Basic Radio

The simplest radio usage:

```vue
<template>
  <div>
    <el-radio v-model="radio" label="1">Option A</el-radio>
    <el-radio v-model="radio" label="2">Option B</el-radio>
    <p>Selected value: {{ radio }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('1')
</script>
```

### Disabled State

Use the `disabled` attribute to disable a radio:

```vue
<template>
  <div>
    <el-radio v-model="radio1" label="Disabled" disabled>Disabled</el-radio>
    <el-radio v-model="radio1" label="Selected and disabled" disabled>Selected and disabled</el-radio>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio1 = ref('Selected and disabled')
</script>
```

## Radio Group

### Basic Radio Group

Use the `el-radio-group` element to manage multiple radios as a group:

```vue
<template>
  <div>
    <el-radio-group v-model="radioGroup">
      <el-radio label="Shanghai">Shanghai</el-radio>
      <el-radio label="Beijing">Beijing</el-radio>
      <el-radio label="Guangzhou">Guangzhou</el-radio>
      <el-radio label="Shenzhen">Shenzhen</el-radio>
    </el-radio-group>
    <p>Selected city: {{ radioGroup }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioGroup = ref('Shanghai')
</script>
```

### Button Style

Use the `el-radio-button` element to implement button-style radios:

```vue
<template>
  <div>
    <h4>Default Button Style</h4>
    <el-radio-group v-model="radioButton1">
      <el-radio-button label="Shanghai">Shanghai</el-radio-button>
      <el-radio-button label="Beijing">Beijing</el-radio-button>
      <el-radio-button label="Guangzhou">Guangzhou</el-radio-button>
      <el-radio-button label="Shenzhen">Shenzhen</el-radio-button>
    </el-radio-group>
    
    <h4>Disabled State</h4>
    <el-radio-group v-model="radioButton2">
      <el-radio-button label="Shanghai">Shanghai</el-radio-button>
      <el-radio-button label="Beijing" disabled>Beijing</el-radio-button>
      <el-radio-button label="Guangzhou">Guangzhou</el-radio-button>
      <el-radio-button label="Shenzhen">Shenzhen</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioButton1 = ref('Shanghai')
const radioButton2 = ref('Shanghai')
</script>
```

### With Border

Set the `border` attribute to render radios with borders:

```vue
<template>
  <div>
    <h4>Radio with Border</h4>
    <el-radio v-model="radioBorder1" label="1" border>Option A</el-radio>
    <el-radio v-model="radioBorder1" label="2" border>Option B</el-radio>
    
    <h4>Radio Group with Border</h4>
    <el-radio-group v-model="radioBorder2">
      <el-radio label="Shanghai" border>Shanghai</el-radio>
      <el-radio label="Beijing" border>Beijing</el-radio>
      <el-radio label="Guangzhou" border disabled>Guangzhou</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioBorder1 = ref('1')
const radioBorder2 = ref('Shanghai')
</script>
```

## Sizes

Use the `size` attribute to set the size of radios:

```vue
<template>
  <div>
    <h4>Large Size</h4>
    <el-radio-group v-model="radioSize1" size="large">
      <el-radio-button label="Shanghai">Shanghai</el-radio-button>
      <el-radio-button label="Beijing">Beijing</el-radio-button>
      <el-radio-button label="Guangzhou">Guangzhou</el-radio-button>
    </el-radio-group>
    
    <h4>Default Size</h4>
    <el-radio-group v-model="radioSize2">
      <el-radio-button label="Shanghai">Shanghai</el-radio-button>
      <el-radio-button label="Beijing">Beijing</el-radio-button>
      <el-radio-button label="Guangzhou">Guangzhou</el-radio-button>
    </el-radio-group>
    
    <h4>Small Size</h4>
    <el-radio-group v-model="radioSize3" size="small">
      <el-radio-button label="Shanghai">Shanghai</el-radio-button>
      <el-radio-button label="Beijing">Beijing</el-radio-button>
      <el-radio-button label="Guangzhou">Guangzhou</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioSize1 = ref('Shanghai')
const radioSize2 = ref('Shanghai')
const radioSize3 = ref('Shanghai')
</script>
```

## Practical Application Examples

### User Preferences Form

```vue
<template>
  <div class="preference-form">
    <h3>User Preferences</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="Gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="male">Male</el-radio>
          <el-radio label="female">Female</el-radio>
          <el-radio label="other">Other</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Age Group">
        <el-radio-group v-model="form.ageGroup">
          <el-radio-button label="18-25">18-25</el-radio-button>
          <el-radio-button label="26-35">26-35</el-radio-button>
          <el-radio-button label="36-45">36-45</el-radio-button>
          <el-radio-button label="46+">46+</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Profession">
        <el-radio-group v-model="form.profession">
          <el-radio label="developer" border>Developer</el-radio>
          <el-radio label="designer" border>Designer</el-radio>
          <el-radio label="manager" border>Manager</el-radio>
          <el-radio label="student" border>Student</el-radio>
          <el-radio label="other" border>Other</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Theme Preference">
        <el-radio-group v-model="form.theme" size="large">
          <el-radio-button label="light">Light Theme</el-radio-button>
          <el-radio-button label="dark">Dark Theme</el-radio-button>
          <el-radio-button label="auto">System Default</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Language Preference">
        <el-radio-group v-model="form.language" @change="handleLanguageChange">
          <el-radio label="zh-CN">Simplified Chinese</el-radio>
          <el-radio label="zh-TW">Traditional Chinese</el-radio>
          <el-radio label="en-US">English</el-radio>
          <el-radio label="ja-JP">Japanese</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="savePreferences">
          Save Settings
        </el-button>
        <el-button @click="resetForm">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="savedPreferences" class="preferences-preview">
      <h4>Current Settings:</h4>
      <pre>{{ JSON.stringify(savedPreferences, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  gender: 'male',
  ageGroup: '26-35',
  profession: 'developer',
  theme: 'light',
  language: 'en-US'
})

const savedPreferences = ref(null)

const handleLanguageChange = (value) => {
  ElMessage.info(`Language switched to: ${getLanguageName(value)}`)
}

const getLanguageName = (code) => {
  const languages = {
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'en-US': 'English',
    'ja-JP': 'Japanese'
  }
  return languages[code] || code
}

const savePreferences = () => {
  savedPreferences.value = { ...form }
  ElMessage.success('Preferences saved successfully!')
}

const resetForm = () => {
  form.gender = 'male'
  form.ageGroup = '26-35'
  form.profession = 'developer'
  form.theme = 'light'
  form.language = 'en-US'
  savedPreferences.value = null
  ElMessage.info('Form has been reset')
}
</script>

<style scoped>
.preference-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.preferences-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preferences-preview pre {
  margin: 0;
  font-size: 12px;
}
</style>
```

### Survey Component

```vue
<template>
  <div class="survey-form">
    <h3>Product Satisfaction Survey</h3>
    
    <el-form :model="survey" label-width="200px">
      <el-form-item label="How often do you use it?">
        <el-radio-group v-model="survey.frequency">
          <el-radio label="daily">Daily</el-radio>
          <el-radio label="weekly">Weekly</el-radio>
          <el-radio label="monthly">Monthly</el-radio>
          <el-radio label="rarely">Rarely</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="What feature is most important?">
        <el-radio-group v-model="survey.importantFeature">
          <el-radio label="performance" border>Performance</el-radio>
          <el-radio label="ui" border>UI Design</el-radio>
          <el-radio label="features" border>Feature Rich</el-radio>
          <el-radio label="stability" border>Stability</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Would you recommend to friends?">
        <el-radio-group v-model="survey.recommend" size="large">
          <el-radio-button label="definitely">Definitely</el-radio-button>
          <el-radio-button label="probably">Probably</el-radio-button>
          <el-radio-button label="maybe">Maybe</el-radio-button>
          <el-radio-button label="no">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="Overall satisfaction?">
        <el-radio-group v-model="survey.satisfaction">
          <el-radio label="5">Very Satisfied</el-radio>
          <el-radio label="4">Satisfied</el-radio>
          <el-radio label="3">Neutral</el-radio>
          <el-radio label="2">Dissatisfied</el-radio>
          <el-radio label="1">Very Dissatisfied</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitSurvey">
          Submit Survey
        </el-button>
        <el-button @click="clearSurvey">
          Clear
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="surveyResult" class="survey-result">
      <h4>Survey Result:</h4>
      <el-alert
        :title="getSurveyResultMessage()"
        type="success"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const survey = reactive({
  frequency: '',
  importantFeature: '',
  recommend: '',
  satisfaction: ''
})

const surveyResult = ref(null)

const submitSurvey = () => {
  // Validate form completeness
  const requiredFields = ['frequency', 'importantFeature', 'recommend', 'satisfaction']
  const missingFields = requiredFields.filter(field => !survey[field])
  
  if (missingFields.length > 0) {
    ElMessage.warning('Please complete all questions before submitting')
    return
  }
  
  surveyResult.value = { ...survey }
  ElMessage.success('Survey submitted successfully, thank you for your participation!')
}

const clearSurvey = () => {
  survey.frequency = ''
  survey.importantFeature = ''
  survey.recommend = ''
  survey.satisfaction = ''
  surveyResult.value = null
  ElMessage.info('Survey has been cleared')
}

const getSurveyResultMessage = () => {
  if (!surveyResult.value) return ''
  
  const satisfaction = parseInt(surveyResult.value.satisfaction)
  if (satisfaction >= 4) {
    return 'Thank you for your high rating! We will continue to work hard to provide better service.'
  } else if (satisfaction >= 3) {
    return 'Thank you for your feedback! We will continue to improve based on your suggestions.'
  } else {
    return 'We are sorry we did not meet your expectations. We will take your feedback seriously and actively improve.'
  }
}
</script>

<style scoped>
.survey-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.survey-result {
  margin-top: 20px;
}
</style>
```

## API Documentation

### Radio Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string / number / boolean | — |
| label | the value of Radio | string / number / boolean | — |
| disabled | whether Radio is disabled | boolean | false |
| border | whether to add a border around Radio | boolean | false |
| size | size of the Radio | enum | — |
| name | native 'name' attribute | string | — |
| validate-event | whether to trigger form validation | boolean | true |

### Radio Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |

### Radio Slots

| Name | Description |
|------|-------------|
| default | content of Radio |

### RadioGroup Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| model-value / v-model | binding value | string / number / boolean | — |
| size | size of radio buttons or bordered radios | enum | — |
| disabled | whether the nesting radios are disabled | boolean | false |
| text-color | font color when button is active | string | #ffffff |
| fill | border and background color when button is active | string | #409eff |
| validate-event | whether to trigger form validation | boolean | true |
| label | label for screen reader | string | — |
| name | native 'name' attribute | string | — |
| id | native 'id' attribute | string | — |

### RadioGroup Events

| Name | Description | Type |
|------|-------------|------|
| change | triggers when the binding value changes | Function |

### RadioGroup Slots

| Name | Description |
|------|-------------|
| default | customize default content |

### RadioButton Attributes

| Name | Description | Type | Default |
|------|-------------|------|---------|
| label | the value of Radio | string / number | — |
| disabled | whether Radio is disabled | boolean | false |
| name | native 'name' attribute | string | — |

### RadioButton Slots

| Name | Description |
|------|-------------|
| default | content of Radio |

## Practice Exercises

### Exercise 1: Dynamic Radio Group

Create a radio group with dynamically added options:

```vue
<template>
  <div class="dynamic-radio">
    <h3>Dynamic Radio Group</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="Add Option">
        <el-input
          v-model="newOption"
          placeholder="Enter new option"
          @keyup.enter="addOption"
        >
          <template #append>
            <el-button @click="addOption">Add</el-button>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="Select Option">
        <el-radio-group v-model="form.selectedOption">
          <el-radio
            v-for="(option, index) in options"
            :key="index"
            :label="option.value"
            border
          >
            {{ option.label }}
            <el-button
              type="danger"
              size="small"
              text
              @click.stop="removeOption(index)"
            >
              Delete
            </el-button>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <div class="result">
      <p>Currently selected: {{ form.selectedOption }}</p>
      <p>Total options: {{ options.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const newOption = ref('')
const form = reactive({
  selectedOption: ''
})

const options = ref([
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
])

const addOption = () => {
  if (!newOption.value.trim()) {
    ElMessage.warning('Please enter option content')
    return
  }
  
  const value = `option${Date.now()}`
  options.value.push({
    label: newOption.value.trim(),
    value: value
  })
  
  newOption.value = ''
  ElMessage.success('Option added successfully')
}

const removeOption = (index) => {
  const removedOption = options.value[index]
  
  // If the deleted option is currently selected, clear the selection
  if (form.selectedOption === removedOption.value) {
    form.selectedOption = ''
  }
  
  options.value.splice(index, 1)
  ElMessage.info('Option has been deleted')
}
</script>

<style scoped>
.dynamic-radio {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
```

### Exercise 2: Conditional Radio Display

Create a radio that displays different options based on conditions:

```vue
<template>
  <div class="conditional-radio">
    <h3>Conditional Radio Display</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="User Type">
        <el-radio-group v-model="form.userType" @change="handleUserTypeChange">
          <el-radio-button label="student">Student</el-radio-button>
          <el-radio-button label="teacher">Teacher</el-radio-button>
          <el-radio-button label="enterprise">Enterprise</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'student'" label="Grade">
        <el-radio-group v-model="form.grade">
          <el-radio label="freshman">Freshman</el-radio>
          <el-radio label="sophomore">Sophomore</el-radio>
          <el-radio label="junior">Junior</el-radio>
          <el-radio label="senior">Senior</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'teacher'" label="Title">
        <el-radio-group v-model="form.title">
          <el-radio label="assistant" border>Assistant</el-radio>
          <el-radio label="lecturer" border>Lecturer</el-radio>
          <el-radio label="associate" border>Associate Professor</el-radio>
          <el-radio label="professor" border>Professor</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'enterprise'" label="Company Size">
        <el-radio-group v-model="form.companySize">
          <el-radio-button label="startup">Startup</el-radio-button>
          <el-radio-button label="small">Small Business</el-radio-button>
          <el-radio-button label="medium">Medium Business</el-radio-button>
          <el-radio-button label="large">Large Enterprise</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          Submit
        </el-button>
        <el-button @click="resetForm">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="formResult" class="form-result">
      <h4>Form Result:</h4>
      <pre>{{ JSON.stringify(formResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  userType: '',
  grade: '',
  title: '',
  companySize: ''
})

const formResult = ref(null)

const handleUserTypeChange = (value) => {
  // Clear other fields
  form.grade = ''
  form.title = ''
  form.companySize = ''
  
  ElMessage.info(`User type switched to: ${getUserTypeName(value)}`)
}

const getUserTypeName = (type) => {
  const types = {
    student: 'Student',
    teacher: 'Teacher',
    enterprise: 'Enterprise'
  }
  return types[type] || type
}

const submitForm = () => {
  if (!form.userType) {
    ElMessage.warning('Please select user type')
    return
  }
  
  // Validate required fields based on user type
  if (form.userType === 'student' && !form.grade) {
    ElMessage.warning('Please select grade')
    return
  }
  
  if (form.userType === 'teacher' && !form.title) {
    ElMessage.warning('Please select title')
    return
  }
  
  if (form.userType === 'enterprise' && !form.companySize) {
    ElMessage.warning('Please select company size')
    return
  }
  
  formResult.value = { ...form }
  ElMessage.success('Form submitted successfully!')
}

const resetForm = () => {
  form.userType = ''
  form.grade = ''
  form.title = ''
  form.companySize = ''
  formResult.value = null
  ElMessage.info('Form has been reset')
}
</script>

<style scoped>
.conditional-radio {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.form-result pre {
  margin: 0;
  font-size: 12px;
}
</style>
```

## Common Issues

### 1. Radio Value Not Updating

**Issue**: Radio value is not correctly bound or updated

**Solution**:
```vue
<!-- Incorrect usage -->
<el-radio v-model="value" :label="item">{{ item }}</el-radio>

<!-- Correct usage -->
<el-radio v-model="value" :label="item.value">{{ item.label }}</el-radio>
```

### 2. Radio Group Events Firing Multiple Times

**Issue**: In a radio group, the change event is triggered multiple times

**Solution**:
```vue
<!-- Only listen for events on the radio-group -->
<el-radio-group v-model="value" @change="handleChange">
  <el-radio label="1">Option 1</el-radio>
  <el-radio label="2">Option 2</el-radio>
</el-radio-group>
```

### 3. Key Issues with Dynamic Options

**Issue**: Dynamically generated radio options may have rendering problems

**Solution**:
```vue
<el-radio
  v-for="option in options"
  :key="option.id"
  :label="option.value"
>
  {{ option.label }}
</el-radio>
```

## Best Practices

1. **Semantic Labels**: Provide meaningful labels for radio groups
2. **Logical Grouping**: Related options should be placed in the same radio group
3. **State Management**: Use disabled states appropriately to guide user operations
4. **User Feedback**: Provide appropriate feedback when values change
5. **Accessibility**: Ensure keyboard navigation and screen reader support

## Summary

The Radio component is a fundamental form component that supports:

- Basic radios and radio groups
- Multiple styles (default, button, border)
- Size control and state management
- Rich event handling mechanisms
- Good accessibility support

Mastering the use of the Radio component can help you build more friendly and efficient form interfaces.

## References

- [Element Plus Radio Official Documentation](https://element-plus.org/en-US/component/radio.html)
- [Vue 3 Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)