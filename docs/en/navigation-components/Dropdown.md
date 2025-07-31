# Dropdown Component

## Learning Objectives

Through this chapter, you will master:
- Basic dropdown menu and trigger configuration
- Event handling and command passing for dropdown menus
- Split button mode and different size usage
- Style customization and best practices for dropdown menus
- Dropdown menu applications in complex interaction scenarios

**Estimated Learning Time:** 75 minutes

## Overview

The Dropdown component is used to collapse actions or menus into a dropdown menu, saving page space while providing rich operation options. It supports multiple trigger methods, flexible configuration options, and comprehensive event handling mechanisms.

### Key Features

- **Multiple Trigger Methods**: Supports both hover and click trigger modes
- **Flexible Menu Structure**: Supports grouping, dividers, and disabled states
- **Split Button Mode**: Provides combination of main action button and dropdown menu
- **Event Handling Mechanism**: Complete command passing and event callbacks
- **Style Customization**: Supports different sizes and theme styles
- **Accessibility**: Good keyboard navigation and screen reader support

### Use Cases

- Extended menu for action buttons
- Personal center menu for user avatars
- More options for table row actions
- Secondary menus in navigation bars
- Feature grouping in toolbars

## Basic Usage

### Basic Dropdown Menu

Hover over the dropdown menu to expand more operations. Set the dropdown trigger element through the component slot and set the dropdown menu through the named slot `dropdown`. By default, you only need to hover over the element that triggers the menu, and the dropdown menu will be displayed without clicking.

```vue
<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      Dropdown Menu
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item disabled>Action 4</el-dropdown-item>
        <el-dropdown-item divided>Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
```

### Trigger Methods

Use the `trigger` attribute to define how the dropdown is triggered.

```vue
<template>
  <el-row class="block-col-2">
    <el-col :span="12">
      <span class="demonstration">Hover to trigger</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          Dropdown Menu
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">Action 1</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">Action 2</el-dropdown-item>
            <el-dropdown-item icon="CirclePlusFilled">Action 3</el-dropdown-item>
            <el-dropdown-item icon="Check">Action 4</el-dropdown-item>
            <el-dropdown-item icon="CircleCheck">Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="12">
      <span class="demonstration">Click to trigger</span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          Dropdown Menu
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">Action 1</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">Action 2</el-dropdown-item>
            <el-dropdown-item icon="CirclePlusFilled">Action 3</el-dropdown-item>
            <el-dropdown-item icon="Check">Action 4</el-dropdown-item>
            <el-dropdown-item icon="CircleCheck">Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
```

### Command Event

Clicking each dropdown item will trigger an event, and the parameter is the command assigned to the dropdown item.

```vue
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      Dropdown Menu
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">Action 1</el-dropdown-item>
        <el-dropdown-item command="b">Action 2</el-dropdown-item>
        <el-dropdown-item command="c">Action 3</el-dropdown-item>
        <el-dropdown-item command="d" disabled>Action 4</el-dropdown-item>
        <el-dropdown-item command="e" divided>Action 5</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command) => {
  ElMessage(`click on item ${command}`)
}
</script>
```

### Sizes

Besides default size, Dropdown component provides three additional sizes for you to choose among different scenarios.

```vue
<template>
  <el-dropdown split-button type="primary" @click="handleClick">
    Default
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item>Action 4</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dropdown size="large" split-button type="primary" @click="handleClick">
    Large
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item>Action 4</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dropdown size="small" split-button type="primary" @click="handleClick">
    Small
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>Action 1</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
        <el-dropdown-item>Action 3</el-dropdown-item>
        <el-dropdown-item>Action 4</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
const handleClick = () => {
  alert('button click')
}
</script>
```

### Split Button

In split-button mode, the left button behaves like a normal button, and right side is the actual dropdown trigger.

```vue
<template>
  <el-dropdown split-button type="primary" @click="handleClick" @command="handleCommand">
    Split Button
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">Action 1</el-dropdown-item>
        <el-dropdown-item command="b">Action 2</el-dropdown-item>
        <el-dropdown-item command="c">Action 3</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const handleClick = () => {
  ElMessage.info('click on left button!')
}

const handleCommand = (command) => {
  ElMessage(`click on item ${command}`)
}
</script>
```

## API Reference

### Dropdown Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| type | menu button type, refer to Button Component, only works when `split-button` is true | string | — | — |
| size | menu size, also works on the split button | string | large / default / small | default |
| max-height | the max height of menu | string / number | — | — |
| split-button | whether a button group is displayed | boolean | — | false |
| disabled | whether to disable | boolean | — | false |
| placement | placement of pop menu | string | top/top-start/top-end/bottom/bottom-start/bottom-end | bottom |
| trigger | how to trigger | string | hover/click | hover |
| hide-on-click | whether to hide menu after clicking menu-item | boolean | — | true |
| show-timeout | delay time before show a dropdown (only works when trigger is `hover`) | number | — | 250 |
| hide-timeout | delay time before hide a dropdown (only works when trigger is `hover`) | number | — | 150 |
| role | the ARIA role attribute for the dropdown menu | string | — | menu |
| tabindex | tabindex of Dropdown | number | — | 0 |
| popper-class | custom class name for Dropdown's dropdown | string | — | — |
| popper-options | [popper.js](https://popper.js.org/docs/v2/) parameters | object | refer to popper.js doc | {} |
| teleported | whether dropdown list is teleported | boolean | — | true |

### Dropdown Slots

| Name | Description | Subtags |
|------|-------------|----------|
| — | content of Dropdown, notice that it's a slot of Dropdown, not Dropdown-Menu | — |
| dropdown | content of the Dropdown Menu | Dropdown-Menu |

### Dropdown Events

| Event Name | Description | Parameters |
|------------|-------------|------------|
| click | if `split-button` is `true`, triggers when left button is clicked | — |
| command | triggers when a dropdown item is clicked | the command dispatched from the dropdown item |
| visible-change | triggers when the dropdown appears/disappears | true when it appears, and false otherwise |

### Dropdown-Menu Slots

| Name | Description | Subtags |
|------|-------------|----------|
| — | content of Dropdown Menu | Dropdown-Item |

### Dropdown-Item Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| command | a command to be dispatched to Dropdown's `command` callback | string/number/object | — | — |
| disabled | whether the item is disabled | boolean | — | false |
| divided | whether a divider is displayed | boolean | — | false |
| icon | custom icon | string / Component | — | — |

### Dropdown-Item Slots

| Name | Description |
|------|-------------|
| — | content of Dropdown Item |

## Best Practices

1. **Choose appropriate trigger method**: Use hover for quick access, click for more deliberate actions
2. **Provide clear visual feedback**: Use icons and proper spacing to make menu items easily distinguishable
3. **Group related actions**: Use dividers to separate different types of actions
4. **Handle disabled states**: Clearly indicate when actions are not available
5. **Consider accessibility**: Ensure keyboard navigation works properly
6. **Limit menu items**: Keep the number of items manageable to avoid overwhelming users

## Common Use Cases

### User Profile Menu
```vue
<template>
  <el-dropdown @command="handleCommand">
    <el-avatar :src="userAvatar" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">Profile</el-dropdown-item>
        <el-dropdown-item command="settings">Settings</el-dropdown-item>
        <el-dropdown-item divided command="logout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

### Table Actions
```vue
<template>
  <el-dropdown @command="handleRowAction">
    <el-button type="text">Actions</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="{action: 'edit', row}">Edit</el-dropdown-item>
        <el-dropdown-item :command="{action: 'delete', row}">Delete</el-dropdown-item>
        <el-dropdown-item :command="{action: 'duplicate', row}">Duplicate</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```