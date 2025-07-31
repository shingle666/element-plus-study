# Container

## Overview

The Container component is used to layout sections of a page. It provides a flexible and responsive container system that adapts to different screen sizes and layout requirements.

## Basic Usage

The Container component automatically arranges child components in a vertical or horizontal layout based on the components used:

```vue
<template>
  <el-container>
    <el-header>Header</el-header>
    <el-main>Main</el-main>
    <el-footer>Footer</el-footer>
  </el-container>
</template>
```

## Container Components

### el-container
The main container wrapper that can contain other container components.

### el-header
Container for the header section of the page.

### el-aside
Container for the sidebar section.

### el-main
Container for the main content area.

### el-footer
Container for the footer section.

## Layout Examples

### Vertical Layout
```vue
<template>
  <el-container>
    <el-header height="60px">Header</el-header>
    <el-main>Main Content</el-main>
    <el-footer height="60px">Footer</el-footer>
  </el-container>
</template>

<style>
.el-header {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-main {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 160px;
}

.el-footer {
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
</style>
```

### Horizontal Layout with Sidebar
```vue
<template>
  <el-container>
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header height="60px">Header</el-header>
      <el-main>Main Content</el-main>
      <el-footer height="60px">Footer</el-footer>
    </el-container>
  </el-container>
</template>

<style>
.el-aside {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}
</style>
```

### Complex Layout
```vue
<template>
  <el-container>
    <el-header height="60px">Header</el-header>
    <el-container>
      <el-aside width="200px">Sidebar</el-aside>
      <el-container>
        <el-main>Main Content</el-main>
        <el-aside width="200px">Right Sidebar</el-aside>
      </el-container>
    </el-container>
    <el-footer height="60px">Footer</el-footer>
  </el-container>
</template>
```

## Container Attributes

### el-container
| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| direction | Layout direction | string | vertical when nested with `el-header` or `el-footer`; horizontal otherwise |

### el-header
| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| height | Height of the header | string | 60px |

### el-aside
| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| width | Width of the sidebar | string | 300px |

### el-footer
| Attribute | Description | Type | Default |
|-----------|-------------|------|---------|
| height | Height of the footer | string | 60px |

## Responsive Design

The Container components work well with CSS media queries for responsive layouts:

```vue
<template>
  <el-container class="responsive-container">
    <el-aside class="sidebar" width="250px">Sidebar</el-aside>
    <el-main class="main-content">Main Content</el-main>
  </el-container>
</template>

<style>
.responsive-container {
  height: 100vh;
}

.sidebar {
  background-color: var(--el-bg-color-page);
  transition: width 0.3s;
}

.main-content {
  padding: 20px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .responsive-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100% !important;
    height: auto;
  }
}
</style>
```

## Advanced Usage

### Collapsible Sidebar
```vue
<template>
  <el-container>
    <el-aside :width="isCollapsed ? '64px' : '200px'" class="sidebar">
      <div class="sidebar-header">
        <el-button 
          @click="toggleSidebar" 
          :icon="isCollapsed ? Expand : Fold"
          text
        />
      </div>
      <div class="sidebar-content">
        <div v-if="!isCollapsed">Expanded Content</div>
        <div v-else>Icons Only</div>
      </div>
    </el-aside>
    <el-main>
      <h1>Main Content Area</h1>
      <p>This is the main content that adjusts when sidebar is collapsed.</p>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style>
.sidebar {
  background-color: var(--el-bg-color-page);
  transition: width 0.3s ease;
  border-right: 1px solid var(--el-border-color);
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar-content {
  padding: 20px;
}
</style>
```

### Sticky Header and Footer
```vue
<template>
  <el-container class="full-height">
    <el-header class="sticky-header">Sticky Header</el-header>
    <el-main class="scrollable-main">
      <div v-for="i in 50" :key="i" class="content-item">
        Content Item {{ i }}
      </div>
    </el-main>
    <el-footer class="sticky-footer">Sticky Footer</el-footer>
  </el-container>
</template>

<style>
.full-height {
  height: 100vh;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}

.scrollable-main {
  overflow-y: auto;
  flex: 1;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
}

.content-item {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
```

## Best Practices

1. **Semantic Structure**: Use container components to create a logical page structure
2. **Responsive Design**: Consider how your layout will adapt to different screen sizes
3. **Accessibility**: Ensure proper heading hierarchy and navigation landmarks
4. **Performance**: Avoid deeply nested containers when not necessary
5. **Consistency**: Maintain consistent spacing and sizing across your application

## Common Patterns

### Admin Dashboard Layout
```vue
<template>
  <el-container class="admin-layout">
    <el-aside width="250px" class="admin-sidebar">
      <!-- Navigation menu -->
    </el-aside>
    <el-container>
      <el-header height="60px" class="admin-header">
        <!-- Top navigation and user menu -->
      </el-header>
      <el-main class="admin-main">
        <!-- Page content -->
      </el-main>
    </el-container>
  </el-container>
</template>
```

### Blog Layout
```vue
<template>
  <el-container class="blog-layout">
    <el-header height="80px" class="blog-header">
      <!-- Site header and navigation -->
    </el-header>
    <el-container>
      <el-main class="blog-content">
        <!-- Blog posts -->
      </el-main>
      <el-aside width="300px" class="blog-sidebar">
        <!-- Widgets and sidebar content -->
      </el-aside>
    </el-container>
    <el-footer height="60px" class="blog-footer">
      <!-- Site footer -->
    </el-footer>
  </el-container>
</template>
```

## Related Components

- [Layout](/en/basic-components/Layout) - Grid-based layout system
- [Space](/en/basic-components/Space) - Spacing utilities
- [Divider](/en/other-components/Divider) - Visual separation elements