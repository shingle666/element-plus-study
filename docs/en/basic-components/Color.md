# Color

## Overview

Element Plus provides a comprehensive color system that ensures consistency, accessibility, and visual harmony across your application. The color palette is carefully designed to work well in both light and dark themes.

## Primary Colors

The primary color is the main brand color used throughout your application:

- **Primary**: `var(--el-color-primary)` - Main brand color (#409EFF)
- **Primary Light**: Various shades from light-3 to light-9
- **Primary Dark**: Various shades from dark-2 to dark-2

```css
:root {
  --el-color-primary: #409eff;
  --el-color-primary-light-3: #79bbff;
  --el-color-primary-light-5: #a0cfff;
  --el-color-primary-light-7: #c6e2ff;
  --el-color-primary-light-8: #d9ecff;
  --el-color-primary-light-9: #ecf5ff;
  --el-color-primary-dark-2: #337ecc;
}
```

## Functional Colors

### Success Colors
Used for positive actions and successful states:

```css
:root {
  --el-color-success: #67c23a;
  --el-color-success-light-3: #95d475;
  --el-color-success-light-5: #b3e19d;
  --el-color-success-light-7: #d1edc4;
  --el-color-success-light-8: #e1f3d8;
  --el-color-success-light-9: #f0f9eb;
  --el-color-success-dark-2: #529b2e;
}
```

### Warning Colors
Used for cautionary messages and attention-grabbing elements:

```css
:root {
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: #eebe77;
  --el-color-warning-light-5: #f3d19e;
  --el-color-warning-light-7: #f8e3c5;
  --el-color-warning-light-8: #faecd8;
  --el-color-warning-light-9: #fdf6ec;
  --el-color-warning-dark-2: #b88230;
}
```

### Danger Colors
Used for error states and destructive actions:

```css
:root {
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: #f89898;
  --el-color-danger-light-5: #fab6b6;
  --el-color-danger-light-7: #fcd3d3;
  --el-color-danger-light-8: #fde2e2;
  --el-color-danger-light-9: #fef0f0;
  --el-color-danger-dark-2: #c45656;
}
```

### Info Colors
Used for informational content and neutral states:

```css
:root {
  --el-color-info: #909399;
  --el-color-info-light-3: #b1b3b8;
  --el-color-info-light-5: #c8c9cc;
  --el-color-info-light-7: #dedfe0;
  --el-color-info-light-8: #e9e9eb;
  --el-color-info-light-9: #f4f4f5;
  --el-color-info-dark-2: #73767a;
}
```

## Text Colors

Element Plus provides a hierarchy of text colors for different content types:

```css
:root {
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-text-color-disabled: #c0c4cc;
}
```

## Background Colors

Background colors for different UI elements:

```css
:root {
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f2f3f5;
  --el-bg-color-overlay: #ffffff;
}
```

## Border Colors

Border colors for consistent visual separation:

```css
:root {
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-border-color-extra-light: #f2f6fc;
  --el-border-color-dark: #d4d7de;
  --el-border-color-darker: #cdd0d6;
}
```

## Usage Examples

### Using Color Variables
```vue
<template>
  <div class="color-demo">
    <div class="primary-section">Primary Content</div>
    <div class="success-section">Success Message</div>
    <div class="warning-section">Warning Alert</div>
    <div class="danger-section">Error State</div>
  </div>
</template>

<style>
.primary-section {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border: 1px solid var(--el-color-primary-light-5);
}

.success-section {
  background-color: var(--el-color-success-light-9);
  color: var(--el-color-success);
  border: 1px solid var(--el-color-success-light-5);
}

.warning-section {
  background-color: var(--el-color-warning-light-9);
  color: var(--el-color-warning-dark-2);
  border: 1px solid var(--el-color-warning-light-5);
}

.danger-section {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  border: 1px solid var(--el-color-danger-light-5);
}
</style>
```

### Dynamic Color Usage
```vue
<template>
  <div>
    <el-button 
      v-for="type in buttonTypes" 
      :key="type"
      :type="type"
      @click="handleClick(type)"
    >
      {{ type }} Button
    </el-button>
  </div>
</template>

<script setup>
const buttonTypes = ['primary', 'success', 'warning', 'danger', 'info']

const handleClick = (type) => {
  console.log(`Clicked ${type} button`)
}
</script>
```

## Dark Theme Support

Element Plus automatically adjusts colors for dark theme:

```css
.dark {
  --el-color-primary: #409eff;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-bg-color: #141414;
  --el-bg-color-page: #0a0a0a;
}
```

## Accessibility Considerations

1. **Contrast Ratios**: All color combinations meet WCAG AA standards
2. **Color Blindness**: Colors are distinguishable for users with color vision deficiencies
3. **Focus States**: Clear focus indicators using color and other visual cues
4. **Semantic Colors**: Consistent use of colors for semantic meaning

## Best Practices

1. **Use CSS Variables**: Always use the provided CSS variables instead of hardcoded colors
2. **Semantic Usage**: Use functional colors (success, warning, danger) for their intended purposes
3. **Consistency**: Maintain color consistency across your application
4. **Testing**: Test your color choices in both light and dark themes
5. **Accessibility**: Ensure sufficient contrast ratios for text and background combinations

## Customization

You can customize the color palette by overriding CSS variables:

```css
:root {
  --el-color-primary: #your-brand-color;
  --el-color-success: #your-success-color;
  /* Override other colors as needed */
}
```

## Related Components

- [Button](/en/basic-components/Button) - Uses color system for different button types
- [Alert](/en/feedback-components/Alert) - Implements functional colors for message types
- [Tag](/en/data-display-components/Tag) - Utilizes color variations for categorization