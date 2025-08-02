# Text Component

## Learning Objectives
- Master the basic usage of the Text component
- Understand text types and style control
- Learn to use text truncation and ellipsis features
- Create aesthetically pleasing text interfaces

## Detailed Learning Content

### 1. Text Component

#### 1.1 Basic Usage

The Text component is used to display text content and supports various types and styles.

```vue
<template>
  <div class="text-demo">
    <!-- Basic text -->
    <el-text>Default text</el-text>
    
    <!-- Different types of text -->
    <el-text type="primary">Primary text</el-text>
    <el-text type="success">Success text</el-text>
    <el-text type="info">Info text</el-text>
    <el-text type="warning">Warning text</el-text>
    <el-text type="danger">Danger text</el-text>
  </div>
</template>

<style>
.text-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
```

#### 1.2 Text Size

```vue
<template>
  <div class="text-size-demo">
    <el-text size="large">Large text</el-text>
    <el-text>Default text</el-text>
    <el-text size="small">Small text</el-text>
  </div>
</template>
```

#### 1.3 Text Truncation

```vue
<template>
  <div class="text-truncate-demo">
    <!-- Single line truncation -->
    <el-text truncated style="width: 200px;">
      This is a very long text content that will be truncated with an ellipsis
    </el-text>
    
    <!-- Multi-line truncation -->
    <el-text 
      :line-clamp="2" 
      style="width: 200px;"
    >
      This is a very long text content that supports multiple lines of display. After exceeding the specified number of lines, it will be truncated and display an ellipsis
    </el-text>
  </div>
</template>
```

#### 1.4 Text Tags

```vue
<template>
  <div class="text-tag-demo">
    <el-text tag="p">Paragraph text</el-text>
    <el-text tag="span">Inline text</el-text>
    <el-text tag="div">Block-level text</el-text>
    <el-text tag="b">Bold text</el-text>
    <el-text tag="i">Italic text</el-text>
  </div>
</template>
```

### 2. Advanced Text Applications

#### 2.1 Text State Control

```vue
<template>
  <div class="text-state-demo">
    <h3>Text States</h3>
    
    <!-- Disabled state -->
    <div class="state-group">
      <h4>Disabled State</h4>
      <el-text disabled>Disabled text</el-text>
      <el-text type="primary" disabled>Disabled primary text</el-text>
      <el-text type="success" disabled>Disabled success text</el-text>
    </div>
    
    <!-- Loading state -->
    <div class="state-group">
      <h4>Loading State</h4>
      <el-text v-loading="loading">Loading text</el-text>
      <el-button @click="toggleLoading">Toggle loading state</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const toggleLoading = () => {
  loading.value = !loading.value
}
</script>

<style>
.text-state-demo {
  margin-bottom: 32px;
}

.state-group {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.state-group h4 {
  margin-bottom: 12px;
  color: #409eff;
}
</style>
```

#### 2.2 Custom Text Styling

```vue
<template>
  <div class="text-custom-demo">
    <h3>Custom Text Styles</h3>
    
    <!-- Custom colors -->
    <div class="custom-group">
      <h4>Custom Colors</h4>
      <el-text style="color: #ff6b6b;">Red text</el-text>
      <el-text style="color: #4ecdc4;">Cyan text</el-text>
      <el-text style="color: #45b7d1;">Blue text</el-text>
      <el-text style="color: #96ceb4;">Green text</el-text>
    </div>
    
    <!-- Custom fonts -->
    <div class="custom-group">
      <h4>Custom Fonts</h4>
      <el-text class="custom-font-1">Custom font style 1</el-text>
      <el-text class="custom-font-2">Custom font style 2</el-text>
      <el-text class="custom-font-3">Custom font style 3</el-text>
    </div>
    
    <!-- Text decoration -->
    <div class="custom-group">
      <h4>Text Decoration</h4>
      <el-text class="underline">Underlined text</el-text>
      <el-text class="strikethrough">Strikethrough text</el-text>
      <el-text class="overline">Overlined text</el-text>
    </div>
  </div>
</template>

<style>
.text-custom-demo {
  margin-bottom: 32px;
}

.custom-group {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.custom-group h4 {
  margin-bottom: 12px;
  color: #409eff;
}

.custom-group .el-text {
  display: block;
  margin-bottom: 8px;
}

.custom-font-1 {
  font-family: 'Georgia', serif;
  font-style: italic;
}

.custom-font-2 {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.custom-font-3 {
  font-family: 'Arial', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.underline {
  text-decoration: underline;
}

.strikethrough {
  text-decoration: line-through;
}

.overline {
  text-decoration: overline;
}
</style>
```

#### 2.3 Responsive Text

```vue
<template>
  <div class="responsive-text-demo">
    <h3>Responsive Text</h3>
    
    <div class="responsive-container">
      <el-text class="responsive-title">
        Responsive Title Text
      </el-text>
      
      <el-text class="responsive-content">
        This is responsive content text. The font size will automatically adjust on different screen sizes to ensure the best reading experience.
        The text will be relatively smaller on mobile devices and larger on desktop devices.
      </el-text>
      
      <el-text class="responsive-caption">
        Responsive caption text
      </el-text>
    </div>
  </div>
</template>

<style>
.responsive-text-demo {
  margin-bottom: 32px;
}

.responsive-container {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

/* Base styles (mobile first) */
.responsive-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.responsive-content {
  display: block;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: #606266;
}

.responsive-caption {
  display: block;
  font-size: 12px;
  color: #909399;
}

/* Tablet styles */
@media (min-width: 768px) {
  .responsive-title {
    font-size: 20px;
  }
  
  .responsive-content {
    font-size: 15px;
    line-height: 1.7;
  }
  
  .responsive-caption {
    font-size: 13px;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .responsive-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .responsive-content {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 12px;
  }
  
  .responsive-caption {
    font-size: 14px;
  }
}
</style>
```

### 3. Comprehensive Application Examples

#### 3.1 Article Content Display

This example demonstrates how to use the `el-text` component to build a complete article page.

```vue
<template>
  <div class="article-demo">
    <article class="article">
      <!-- Article header -->
      <header class="article-header">
        <el-text tag="h1" class="article-title">
          Complete Guide to Element Plus Text Component
        </el-text>
        
        <div class="article-meta">
          <el-text class="meta-item">
            <el-icon><Document /></el-icon>
            Technical Documentation
          </el-text>
          <el-text class="meta-item">
            <el-icon><Calendar /></el-icon>
            January 15, 2024
          </el-text>
          <el-text class="meta-item">
            <el-icon><User /></el-icon>
            Element Plus Team
          </el-text>
        </div>
      </header>
      
      <!-- Article content -->
      <main class="article-content">
        <el-text tag="p" class="lead-text">
          The Text component is one of the most basic and important components in Element Plus.
          It provides rich text display features, supporting various types, sizes, and styles.
        </el-text>
        
        <el-text tag="h2" class="section-title">
          Main Features
        </el-text>
        
        <el-text tag="p" class="content-text">
          The Text component has the following main features:
        </el-text>
        
        <ul class="feature-list">
          <li>
            <el-text type="primary">Multiple Type Support</el-text>
            <el-text>: Supports primary, success, warning, danger, info, and other types</el-text>
          </li>
          <li>
            <el-text type="success">Flexible Size Control</el-text>
            <el-text>: Provides large, default, and small sizes</el-text>
          </li>
          <li>
            <el-text type="warning">Text Truncation</el-text>
            <el-text>: Supports single-line and multi-line text truncation</el-text>
          </li>
          <li>
            <el-text type="info">Custom Tags</el-text>
            <el-text>: Can be rendered as any HTML tag</el-text>
          </li>
        </ul>
        
        <el-text tag="h2" class="section-title">
          Usage Recommendations
        </el-text>
        
        <el-text tag="p" class="content-text">
          In actual projects, it is recommended to choose appropriate text types and styles based on the importance and semantics of the content.
          Use primary type for important information, success type for success states,
          warning type for warning messages, and danger type for error messages.
        </el-text>
        
        <div class="code-example">
          <el-text tag="h3" class="example-title">Code Example</el-text>
          <el-text tag="pre" class="code-block">
&lt;el-text type="primary"&gt;Important information&lt;/el-text&gt;
&lt;el-text type="success"&gt;Operation successful&lt;/el-text&gt;
&lt;el-text type="warning"&gt;Notes&lt;/el-text&gt;
&lt;el-text type="danger"&gt;Error message&lt;/el-text&gt;
          </el-text>
        </div>
      </main>
      
      <!-- Article footer -->
      <footer class="article-footer">
        <el-text class="footer-text">
          We hope this article helps you better understand and use the Element Plus Text component.
        </el-text>
        
        <div class="tags">
          <el-text class="tag">Element Plus</el-text>
          <el-text class="tag">Text Component</el-text>
          <el-text class="tag">Frontend Development</el-text>
          <el-text class="tag">Vue.js</el-text>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup>
import { Document, Calendar, User } from '@element-plus/icons-vue'
</script>

<style>
.article-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.article {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* Article header */
.article-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #303133;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #909399;
}

/* Article content */
.article-content {
  line-height: 1.8;
}

.lead-text {
  font-size: 18px;
  font-weight: 500;
  color: #409eff;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ecf5ff;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 24px 0 12px 0;
}

.content-text {
  color: #606266;
  margin-bottom: 16px;
}

.feature-list {
  margin: 16px 0;
  padding-left: 0;
  list-style: none;
}

.feature-list li {
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #e4e7ed;
}

.code-example {
  margin: 24px 0;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.example-title {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 12px;
}

.code-block {
  background-color: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

/* Article footer */
.article-footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.footer-text {
  color: #606266;
  margin-bottom: 16px;
  font-style: italic;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background-color: #f0f2f5;
  color: #606266;
  border-radius: 16px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: #409eff;
  color: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .article {
    padding: 20px;
  }
  
  .article-title {
    font-size: 22px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .lead-text {
    font-size: 16px;
    padding: 12px;
  }
  
  .section-title {
    font-size: 18px;
  }
}
</style>
```

## Practical Exercises

### Exercise 1: Basic Text Display
Create a display page containing all text types and sizes.

### Exercise 2: Text Truncation Application
Implement a news list that uses text truncation to display news summaries.

### Exercise 3: Typography System Application
Create a blog post page applying a complete typography system.

### Exercise 4: Interactive Text Component
Implement an editable text display component that supports switching between edit and preview modes.

## Design Principles

1. **Readability First**: Ensure text has good contrast and appropriate font size
2. **Clear Hierarchy**: Use different text styles to establish clear information hierarchy
3. **Consistency**: Maintain consistency of text styles throughout the application
4. **Semantics**: Use appropriate HTML tags and ARIA attributes
5. **Responsiveness**: Ensure text displays well on different devices

## Learning Resources

- [Text Component Official Documentation](https://element-plus.org/en-US/component/text.html)
- [Link Component Official Documentation](https://element-plus.org/en-US/component/link.html)
- [Typography Guide](https://element-plus.org/en-US/guide/design.html)
- [Web Typography Best Practices](https://web.dev/learn/design/typography/)
- [Accessible Text Design](https://www.w3.org/WAI/WCAG21/Understanding/)

## Assignments

1. **Basic Assignment**: Create a display page containing all text component types
2. **Advanced Assignment**: Implement a news article page applying a complete typography system
3. **Challenge Assignment**: Design a text display component that supports theme switching

## Summary

Text and Link components are fundamental elements for building user interfaces. By properly using these components and combining them with good typography principles, you can create text interfaces that are both beautiful and readable. Mastering the use of these basic components is important for improving the overall user experience.

---

**Study Date:** ___________
**Completion Status:** ___________
**Study Notes:**



**Problems Encountered:**



**Solutions:**