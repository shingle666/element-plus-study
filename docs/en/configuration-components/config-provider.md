# Config Provider

## Overview

Config Provider is used to provide global configuration options, making your configurations accessible throughout the application. With Config Provider, you can configure internationalization, global component size, button styles, message configurations, and other global settings.

## Learning Objectives

- Master the basic concepts and functions of Config Provider
- Learn how to configure internationalization (i18n) settings
- Understand global component size and style configuration
- Master global configuration for buttons, links, messages, and other components
- Learn about empty value and clear value configurations
- Understand the use of experimental features

## Basic Usage

### Basic Configuration

```vue
<template>
  <el-config-provider :locale="locale" :size="size">
    <el-button>Button</el-button>
    <el-input placeholder="Please input"></el-input>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import enUS from 'element-plus/dist/locale/en.mjs'

const locale = ref(enUS)
const size = ref('default')
</script>
```

### Internationalization Configuration

Configure multiple languages through Config Provider, allowing your application to switch languages at any time:

```vue
<template>
  <el-config-provider :locale="currentLocale">
    <div>
      <el-button @click="switchLanguage">Switch Language</el-button>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="Select date"
      />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const date = ref('')
const currentLocale = ref(en)
const isEnglish = ref(true)

const switchLanguage = () => {
  isEnglish.value = !isEnglish.value
  currentLocale.value = isEnglish.value ? en : zhCn
}
</script>
```

## Global Component Configuration

### Global Size Configuration

```vue
<template>
  <el-config-provider :size="globalSize">
    <div>
      <el-radio-group v-model="globalSize">
        <el-radio value="large">Large</el-radio>
        <el-radio value="default">Default</el-radio>
        <el-radio value="small">Small</el-radio>
      </el-radio-group>
      
      <div style="margin-top: 20px;">
        <el-button>Button</el-button>
        <el-input placeholder="Input" style="width: 200px; margin-left: 10px;" />
        <el-select placeholder="Select" style="width: 200px; margin-left: 10px;">
          <el-option label="Option 1" value="1" />
          <el-option label="Option 2" value="2" />
        </el-select>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const globalSize = ref('default')
</script>
```

### Button Global Configuration

```vue
<template>
  <el-config-provider :button="buttonConfig">
    <div>
      <el-button>Default Button</el-button>
      <el-button type="primary">Primary Button</el-button>
      <el-button>中文按钮</el-button>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const buttonConfig = ref({
  autoInsertSpace: true, // Automatically insert space between two Chinese characters
  plain: false,          // Whether to use plain button
  round: false           // Whether to use round button
})
</script>
```

### Message Global Configuration

```vue
<template>
  <el-config-provider :message="messageConfig">
    <div>
      <el-button @click="showMessage">Show Message</el-button>
      <el-button @click="showMultipleMessages">Show Multiple Messages</el-button>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const messageConfig = ref({
  max: 3,           // Maximum number of messages that can be displayed simultaneously
  grouping: true,   // Group messages with the same content
  duration: 3000,   // Display time
  showClose: true,  // Whether to show close button
  offset: 20        // Offset from the top of the window
})

const showMessage = () => {
  ElMessage.success('This is a success message')
}

const showMultipleMessages = () => {
  for (let i = 1; i <= 5; i++) {
    ElMessage.info(`Message ${i}`)
  }
}
</script>
```

## Empty Value Configuration

### Empty and Clear Value Configuration

```vue
<template>
  <el-config-provider 
    :empty-values="emptyValues" 
    :value-on-clear="valueOnClear"
  >
    <div>
      <el-select 
        v-model="selectValue" 
        placeholder="Please select" 
        clearable
        style="width: 200px;"
      >
        <el-option label="Option 1" value="option1" />
        <el-option label="Option 2" value="option2" />
        <el-option label="Empty string" value="" />
      </el-select>
      
      <el-date-picker
        v-model="dateValue"
        type="date"
        placeholder="Select date"
        clearable
        style="margin-left: 10px;"
      />
      
      <div style="margin-top: 10px;">
        <p>Select value: {{ selectValue }}</p>
        <p>Date value: {{ dateValue }}</p>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const selectValue = ref('')
const dateValue = ref(null)

// Configure empty values: does not include empty string
const emptyValues = ref([undefined, null])

// Configure value on clear
const valueOnClear = ref(() => undefined)
</script>
```

## Advanced Configuration

### Namespace Configuration

```vue
<template>
  <el-config-provider namespace="my-app">
    <el-button>Custom Namespace Button</el-button>
  </el-config-provider>
</template>

<style>
/* Use custom namespace styles */
.my-app-button {
  --el-button-bg-color: #custom-color;
}
</style>
```

### zIndex Configuration

```vue
<template>
  <el-config-provider :z-index="3000">
    <el-button @click="showDialog">Show Dialog</el-button>
    <el-dialog v-model="dialogVisible" title="Tip">
      <span>This dialog's z-index starts from 3000</span>
    </el-dialog>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)

const showDialog = () => {
  dialogVisible.value = true
}
</script>
```

## Experimental Features

```vue
<template>
  <el-config-provider :experimental-features="experimentalConfig">
    <!-- Experimental features will take effect here -->
    <div>Experimental Features Demo</div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

// Experimental features configuration (currently no specific features)
const experimentalConfig = ref({
  // Future experimental features will be configured here
})
</script>
```

## API Documentation

### Config Provider Attributes

| Attribute | Description | Type | Default |
|--------|------|------|--------|
| locale | Translation text object | object | languages |
| size | Global component size | enum | default |
| zIndex | Global initial zIndex value | number | — |
| namespace | Global component class name prefix | string | el |
| button | Button related configuration | object | See table below |
| link | Link related configuration | object | See table below |
| message | Message related configuration | object | See table below |
| experimental-features | Experimental stage features | object | — |
| empty-values | Input component empty values | array | — |
| value-on-clear | Input component clear value | string/number/boolean/Function | — |

### Button Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| autoInsertSpace | Automatically insert space between two Chinese characters | boolean | false |
| plain | Whether to use plain button | boolean | false |
| round | Whether to use round button | boolean | false |

### Link Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| type | Type | enum | default |
| underline | Control whether the underline appears | enum | hover |

### Message Attributes

| Attribute | Description | Type | Default |
|------|------|------|--------|
| max | Maximum number of messages that can be displayed simultaneously | number | — |
| grouping | Group messages with the same content | boolean | — |
| duration | Display time in milliseconds | number | — |
| showClose | Whether to show close button | boolean | — |
| offset | Message offset from the top of the window | number | — |
| plain | Whether to use plain style | boolean | — |

### Config Provider Slots

| Name | Description | Scope |
|------|------|-------|
| default | Custom default content | config: Provides global configuration |

## Practice Exercises

### Exercise 1: Multilingual Application Configuration

Create an application that supports switching between Chinese and English:

```vue
<template>
  <el-config-provider :locale="currentLocale">
    <div class="language-demo">
      <el-button-group>
        <el-button 
          :type="isEnglish ? 'default' : 'primary'"
          @click="setLanguage('zh-cn')"
        >
          中文
        </el-button>
        <el-button 
          :type="isEnglish ? 'primary' : 'default'"
          @click="setLanguage('en')"
        >
          English
        </el-button>
      </el-button-group>
      
      <div style="margin-top: 20px;">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="to"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>
      
      <div style="margin-top: 20px;">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const date = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const language = ref('en')

const isEnglish = computed(() => language.value === 'en')
const currentLocale = computed(() => isEnglish.value ? en : zhCn)

const setLanguage = (lang) => {
  language.value = lang
}
</script>
```

### Exercise 2: Theme Configuration System

Create a system that can dynamically configure themes:

```vue
<template>
  <el-config-provider 
    :size="globalConfig.size"
    :button="globalConfig.button"
    :message="globalConfig.message"
  >
    <div class="theme-config">
      <el-card header="Theme Configuration">
        <el-form :model="globalConfig" label-width="120px">
          <el-form-item label="Component Size">
            <el-radio-group v-model="globalConfig.size">
              <el-radio value="large">Large</el-radio>
              <el-radio value="default">Default</el-radio>
              <el-radio value="small">Small</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="Button Config">
            <el-checkbox v-model="globalConfig.button.autoInsertSpace">
              Auto Insert Space
            </el-checkbox>
            <el-checkbox v-model="globalConfig.button.plain">
              Plain Button
            </el-checkbox>
            <el-checkbox v-model="globalConfig.button.round">
              Round Button
            </el-checkbox>
          </el-form-item>
          
          <el-form-item label="Message Config">
            <el-input-number 
              v-model="globalConfig.message.max" 
              :min="1" 
              :max="10"
              controls-position="right"
            />
            <span style="margin-left: 10px;">Max Message Count</span>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card header="Preview" style="margin-top: 20px;">
        <div>
          <el-button>Default Button</el-button>
          <el-button type="primary">Primary Button</el-button>
          <el-button>中文按钮</el-button>
        </div>
        
        <div style="margin-top: 10px;">
          <el-input placeholder="Please input" style="width: 200px;" />
          <el-button @click="showTestMessage" style="margin-left: 10px;">
            Test Message
          </el-button>
        </div>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const globalConfig = ref({
  size: 'default',
  button: {
    autoInsertSpace: true,
    plain: false,
    round: false
  },
  message: {
    max: 3,
    grouping: true,
    duration: 3000,
    showClose: true,
    offset: 20
  }
})

let messageCount = 0
const showTestMessage = () => {
  messageCount++
  ElMessage.info(`Test Message ${messageCount}`)
}
</script>
```

## Common Issues

### 1. Internationalization Configuration Not Working

**Issue**: Configured locale but components still display in English

**Solution**:
- Ensure language packages are correctly imported
- Check if Config Provider correctly wraps the components that need internationalization
- Confirm that the language package version matches the Element Plus version

### 2. Global Configuration Overridden by Local Configuration

**Issue**: Component local configuration overrides global configuration

**Solution**:
- Local configuration has higher priority than global configuration, this is normal behavior
- To force using global configuration, remove the component's local configuration attributes

### 3. Empty Value Configuration Not Working

**Issue**: Still considers empty string as empty value after configuring empty-values

**Solution**:
- Ensure the component supports empty value configuration
- Check if the array format is correct
- Support for empty value configuration is limited, refer to the official documentation

## Best Practices

1. **Unified Configuration Management**: Use Config Provider in the root component for global configuration
2. **Configure as Needed**: Only configure necessary attributes, avoid over-configuration
3. **Theme Consistency**: Use global configuration to maintain application theme consistency
4. **Internationalization Support**: Plan internationalization configuration in advance for multilingual applications
5. **Performance Considerations**: Avoid frequently changing global configuration, which affects performance

## Summary

Config Provider is a powerful global configuration tool provided by Element Plus, through which you can:

- Implement application internationalization configuration
- Uniformly manage global styles and behaviors of components
- Configure default properties for messages, buttons, links, and other components
- Handle global logic for empty values and clear values
- Provide configuration entry points for future experimental features

Mastering the use of Config Provider can help you build more consistent and maintainable Element Plus applications.

## References

- [Element Plus Config Provider Official Documentation](https://element-plus.org/en-US/component/config-provider.html)
- [Element Plus Internationalization Documentation](https://element-plus.org/en-US/guide/i18n.html)
- [Element Plus Theme Configuration Documentation](https://element-plus.org/en-US/guide/theming.html)