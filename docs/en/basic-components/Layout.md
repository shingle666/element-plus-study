# Layout Component

## Learning Objectives
- Master the 24-grid system usage
- Understand responsive breakpoint design
- Complete responsive layout implementation

## Detailed Learning Content

### 1. Layout Grid System

#### 1.1 Basic Concepts
Element Plus's grid system is based on 24 columns, using `el-row` and `el-col` components to create flexible layouts.

#### 1.2 Basic Usage

```vue
<template>
  <!-- Basic Grid -->
  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
```

### 2. Column Spacing

Use the `gutter` attribute to specify spacing between columns.

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

### 3. Column Offset

Use the `offset` attribute to specify the number of columns to offset.

```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

### 4. Alignment

Use the `justify` attribute to define how the columns are aligned.

```vue
<template>
  <el-row class="row-bg">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="center">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="end">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-between">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-around">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
  <el-row class="row-bg" justify="space-evenly">
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
  </el-row>
</template>
```

### 5. Responsive Layout

Referring to the responsive design of Bootstrap, five breakpoints are preset: `xs`, `sm`, `md`, `lg` and `xl`.

```vue
<template>
  <el-row :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
      <div class="grid-content bg-purple"></div>
    </el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple"></div>
    </el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
  </el-row>
</template>
```

## API Reference

### Row Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| gutter | grid spacing | number | — | 0 |
| justify | horizontal alignment of flex layout | string | start/end/center/space-around/space-between/space-evenly | start |
| align | vertical alignment of flex layout | string | top/middle/bottom | top |
| tag | custom element tag | string | * | div |

### Col Attributes

| Attribute | Description | Type | Accepted Values | Default |
|-----------|-------------|------|-----------------|----------|
| span | number of column the grid spans | number | — | 24 |
| offset | number of spacing on the left side of the grid | number | — | 0 |
| push | number of columns that grid moves to the right | number | — | 0 |
| pull | number of columns that grid moves to the left | number | — | 0 |
| xs | `<768px` Responsive columns or column props object | number/object (e.g. {span: 4, offset: 4}) | — | — |
| sm | `≥768px` Responsive columns or column props object | number/object (e.g. {span: 4, offset: 4}) | — | — |
| md | `≥992px` Responsive columns or column props object | number/object (e.g. {span: 4, offset: 4}) | — | — |
| lg | `≥1200px` Responsive columns or column props object | number/object (e.g. {span: 4, offset: 4}) | — | — |
| xl | `≥1920px` Responsive columns or column props object | number/object (e.g. {span: 4, offset: 4}) | — | — |
| tag | custom element tag | string | * | div |

## Best Practices

1. **Use appropriate grid spans**: Choose grid spans that make sense for your content
2. **Consider mobile-first**: Design for mobile devices first, then enhance for larger screens
3. **Use consistent spacing**: Maintain consistent gutter values throughout your application
4. **Test responsiveness**: Always test your layouts on different screen sizes
5. **Semantic HTML**: Use appropriate HTML tags for better accessibility

## Common Use Cases

### Dashboard Layout
```vue
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <!-- Sidebar -->
    </el-col>
    <el-col :span="18">
      <!-- Main content -->
    </el-col>
  </el-row>
</template>
```

### Card Grid
```vue
<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in items" :key="item.id">
      <!-- Card component -->
    </el-col>
  </el-row>
</template>
```