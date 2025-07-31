# Border

## Overview

Element Plus provides a unified border design system that helps create consistent visual boundaries and hierarchical relationships in your application.

## Border Width

Element Plus defines different border widths for various use cases:

- **Base**: 1px - Standard border width for most components
- **Medium**: 2px - Emphasized borders for important elements
- **Thick**: 3px - Strong visual separation
- **Extra Thick**: 4px - Maximum emphasis

## Border Style

### Solid Borders
The most common border style, providing clear visual separation:

```css
.el-border {
  border: 1px solid var(--el-border-color);
}
```

### Dashed Borders
Used for temporary or secondary elements:

```css
.el-border-dashed {
  border: 1px dashed var(--el-border-color);
}
```

## Border Colors

Element Plus provides a comprehensive color system for borders:

- **Base**: `var(--el-border-color)` - Default border color
- **Light**: `var(--el-border-color-light)` - Subtle borders
- **Lighter**: `var(--el-border-color-lighter)` - Very subtle borders
- **Extra Light**: `var(--el-border-color-extra-light)` - Minimal borders
- **Dark**: `var(--el-border-color-dark)` - Emphasized borders
- **Darker**: `var(--el-border-color-darker)` - Strong borders

## Border Radius

Rounded corners for modern, friendly interfaces:

- **Small**: `var(--el-border-radius-small)` - 2px
- **Base**: `var(--el-border-radius-base)` - 4px
- **Round**: `var(--el-border-radius-round)` - 20px
- **Circle**: `var(--el-border-radius-circle)` - 100%

## Usage Examples

### Basic Border
```vue
<template>
  <div class="bordered-container">
    <p>Content with border</p>
  </div>
</template>

<style>
.bordered-container {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 16px;
}
</style>
```

### Conditional Borders
```vue
<template>
  <div :class="{ 'has-border': showBorder }">
    <p>Conditional border content</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showBorder = ref(true)
</script>

<style>
.has-border {
  border: 1px solid var(--el-border-color);
  transition: border-color 0.3s;
}

.has-border:hover {
  border-color: var(--el-color-primary);
}
</style>
```

## Best Practices

1. **Consistency**: Use the predefined border variables for consistent styling
2. **Hierarchy**: Use different border weights to establish visual hierarchy
3. **Accessibility**: Ensure sufficient contrast between borders and backgrounds
4. **Performance**: Avoid excessive border animations on large lists
5. **Responsive**: Consider how borders appear on different screen sizes

## CSS Variables

```css
:root {
  --el-border-width: 1px;
  --el-border-style: solid;
  --el-border-color-hover: var(--el-text-color-disabled);
  --el-border: var(--el-border-width) var(--el-border-style) var(--el-border-color);
}
```

## Related Components

- [Card](../data-display-components/card.md) - Uses borders for container definition
- [Input](../form-components/input.md) - Border states for form validation
- [Button](./button.md) - Border styling for different button types