# Design Principles & Basic Concepts

## Overview

Element Plus is a Vue 3 based component library that provides a set of high-quality components and design guidelines. Understanding its design principles and basic concepts is crucial for effective usage and customization.

## Design Principles

### 1. Consistency

**Visual Consistency**
- Unified color scheme and typography
- Consistent spacing and layout patterns
- Standardized component behaviors and interactions

**Functional Consistency**
- Similar components share common APIs
- Predictable component behaviors
- Consistent naming conventions

### 2. Efficiency

**Development Efficiency**
- Rich component library reduces development time
- Comprehensive documentation and examples
- TypeScript support for better development experience

**Performance Efficiency**
- Tree-shaking support for optimal bundle size
- Virtual scrolling for large datasets
- Optimized rendering performance

### 3. Controllability

**Customization**
- Flexible theming system
- Extensive configuration options
- Custom component development support

**Accessibility**
- ARIA attributes support
- Keyboard navigation
- Screen reader compatibility

## Core Concepts

### Component Architecture

```typescript
// Basic component structure
interface ComponentProps {
  // Component-specific properties
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  // ... other props
}

interface ComponentEmits {
  // Component events
  (e: 'change', value: any): void
  (e: 'click', event: MouseEvent): void
  // ... other events
}
```

### Design Tokens

Element Plus uses design tokens for consistent styling:

```scss
// Color tokens
$el-color-primary: #409eff;
$el-color-success: #67c23a;
$el-color-warning: #e6a23c;
$el-color-danger: #f56c6c;
$el-color-info: #909399;

// Size tokens
$el-component-size-large: 40px;
$el-component-size-default: 32px;
$el-component-size-small: 24px;

// Spacing tokens
$el-spacing-xs: 4px;
$el-spacing-sm: 8px;
$el-spacing-md: 12px;
$el-spacing-lg: 16px;
$el-spacing-xl: 20px;
```

### Component Composition

Element Plus components are designed to work together:

```vue
<template>
  <!-- Form composition example -->
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" type="email" />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm">Submit</el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
</template>
```

## Component Categories

### 1. Basic Components
- **Layout**: Container, Row, Col, Space
- **Typography**: Text, Link, Divider
- **Buttons**: Button, Button Group
- **Icons**: Icon system and usage

### 2. Form Components
- **Input**: Input, Textarea, Number Input
- **Selection**: Select, Cascader, Tree Select
- **Picker**: Date Picker, Time Picker, Color Picker
- **Upload**: File upload with various configurations

### 3. Data Display
- **Table**: Data tables with sorting, filtering, pagination
- **List**: Various list layouts and configurations
- **Tree**: Hierarchical data display
- **Timeline**: Chronological data presentation

### 4. Navigation
- **Menu**: Navigation menus and submenus
- **Breadcrumb**: Navigation breadcrumbs
- **Pagination**: Data pagination controls
- **Steps**: Step-by-step navigation

### 5. Feedback
- **Alert**: Information alerts and notifications
- **Message**: Toast-style messages
- **Dialog**: Modal dialogs and confirmations
- **Loading**: Loading states and spinners

## Global Configuration

### Provider Pattern

Element Plus uses the provider pattern for global configuration:

```vue
<template>
  <el-config-provider :locale="locale" :size="size">
    <app />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = zhCn
const size = 'default'
</script>
```

### Theme Customization

```scss
// Custom theme variables
:root {
  --el-color-primary: #1890ff;
  --el-border-radius-base: 6px;
  --el-font-size-base: 14px;
}

// Component-specific customization
.el-button {
  --el-button-font-weight: 500;
  --el-button-border-color: var(--el-color-primary);
}
```

## Best Practices

### 1. Component Usage

```vue
<!-- ✅ Good: Use semantic HTML structure -->
<el-form>
  <el-form-item label="Name">
    <el-input v-model="name" placeholder="Enter your name" />
  </el-form-item>
</el-form>

<!-- ❌ Bad: Missing semantic structure -->
<el-input v-model="name" />
```

### 2. Event Handling

```vue
<script setup>
// ✅ Good: Use descriptive event handlers
const handleSubmit = () => {
  // Handle form submission
}

const handleCancel = () => {
  // Handle cancellation
}

// ❌ Bad: Generic event handlers
const onClick = () => {
  // Unclear purpose
}
</script>
```

### 3. Prop Validation

```typescript
// ✅ Good: Define prop types
interface Props {
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  modelValue: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  disabled: false
})
```

## Accessibility Considerations

### ARIA Support

```vue
<template>
  <!-- Proper ARIA attributes -->
  <el-button 
    :aria-label="buttonLabel"
    :aria-disabled="disabled"
    role="button"
  >
    {{ text }}
  </el-button>
</template>
```

### Keyboard Navigation

- All interactive components support keyboard navigation
- Tab order follows logical flow
- Enter and Space keys trigger actions
- Escape key closes modals and dropdowns

## Next Steps

- [Environment Setup & Quick Start](/en/quickstart)
- [Basic Components](/en/basic-components/Button)
- [Form Components](/en/form-components/Input)
- [Architecture Design](/en/architecture-design/01.overall-architecture-and-design-philosophy)

---

**Understanding these principles will help you use Element Plus more effectively and build better user interfaces.** 🎯