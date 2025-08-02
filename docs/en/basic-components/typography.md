# Typography Component

## Learning Objectives
- Master the basic concepts and applications of Typography
- Understand the design principles of heading hierarchy and text styles
- Learn to use different font sizes, weights, and alignment methods
- Master special text styles such as code and quotes
- Create an aesthetically pleasing and unified typography system

## Detailed Learning Content

### 1. Typography Basics (40 minutes)

#### 1.1 Heading Hierarchy

The Typography system provides a complete heading hierarchy to ensure clear content structure.

```vue
<template>
  <div class="typography-demo">
    <h1 class="heading-1">Level 1 Heading - Main Title</h1>
    <h2 class="heading-2">Level 2 Heading - Section Title</h2>
    <h3 class="heading-3">Level 3 Heading - Subsection Title</h3>
    <h4 class="heading-4">Level 4 Heading - Subtitle</h4>
    <h5 class="heading-5">Level 5 Heading - Small Title</h5>
    <h6 class="heading-6">Level 6 Heading - Smallest Title</h6>
  </div>
</template>

<style>
.typography-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.heading-1 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 24px;
  color: #303133;
}

.heading-2 {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 20px;
  color: #303133;
}

.heading-3 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 16px;
  color: #303133;
}

.heading-4 {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 12px;
  color: #606266;
}

.heading-5 {
  font-size: 18px;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 8px;
  color: #606266;
}

.heading-6 {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 8px;
  color: #909399;
}
</style>
```

#### 1.2 Paragraphs and Body Text

```vue
<template>
  <div class="paragraph-demo">
    <p class="paragraph-large">
      Large paragraph text: This is an example of large paragraph text, typically used for important introductory content or text paragraphs that need to be highlighted.
    </p>
    
    <p class="paragraph-normal">
      Standard paragraph text: This is standard paragraph text, the most commonly used text style in web pages. It has good readability and is suitable for most content displays.
    </p>
    
    <p class="paragraph-small">
      Small paragraph text: This is small paragraph text, typically used for auxiliary explanations, annotations, or less important supplementary information.
    </p>
    
    <p class="paragraph-caption">
      Caption text: This is caption text style, typically used for image captions, table captions, or other places that need special notation.
    </p>
  </div>
</template>

<style>
.paragraph-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.paragraph-large {
  font-size: 18px;
  line-height: 1.8;
  color: #303133;
  margin-bottom: 16px;
}

.paragraph-normal {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 16px;
}

.paragraph-small {
  font-size: 14px;
  line-height: 1.6;
  color: #909399;
  margin-bottom: 12px;
}

.paragraph-caption {
  font-size: 12px;
  line-height: 1.5;
  color: #C0C4CC;
  margin-bottom: 8px;
}
</style>
```

### 2. Font Style Control (30 minutes)

#### 2.1 Font Size System

```vue
<template>
  <div class="font-size-demo">
    <h3>Font Size System</h3>
    
    <div class="size-examples">
      <div class="size-item">
        <span class="size-extra-large">Extra Large Font (24px)</span>
        <code>.size-extra-large</code>
      </div>
      
      <div class="size-item">
        <span class="size-large">Large Font (20px)</span>
        <code>.size-large</code>
      </div>
      
      <div class="size-item">
        <span class="size-medium">Medium Font (16px)</span>
        <code>.size-medium</code>
      </div>
      
      <div class="size-item">
        <span class="size-small">Small Font (14px)</span>
        <code>.size-small</code>
      </div>
      
      <div class="size-item">
        <span class="size-mini">Mini Font (12px)</span>
        <code>.size-mini</code>
      </div>
    </div>
  </div>
</template>

<style>
.font-size-demo {
  margin-bottom: 32px;
}

.size-examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}

.size-extra-large {
  font-size: 24px;
  color: #303133;
}

.size-large {
  font-size: 20px;
  color: #303133;
}

.size-medium {
  font-size: 16px;
  color: #606266;
}

.size-small {
  font-size: 14px;
  color: #909399;
}

.size-mini {
  font-size: 12px;
  color: #C0C4CC;
}

code {
  background-color: #f5f7fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #e6a23c;
}
</style>
```

#### 2.2 Font Weight

```vue
<template>
  <div class="font-weight-demo">
    <h3>Font Weight</h3>
    
    <div class="weight-examples">
      <p class="weight-thin">Thin Text (font-weight: 100)</p>
      <p class="weight-light">Light Text (font-weight: 300)</p>
      <p class="weight-normal">Normal Text (font-weight: 400)</p>
      <p class="weight-medium">Medium Text (font-weight: 500)</p>
      <p class="weight-semibold">Semi-bold Text (font-weight: 600)</p>
      <p class="weight-bold">Bold Text (font-weight: 700)</p>
      <p class="weight-extrabold">Extra Bold Text (font-weight: 800)</p>
    </div>
  </div>
</template>

<style>
.font-weight-demo {
  margin-bottom: 32px;
}

.weight-examples p {
  font-size: 16px;
  margin-bottom: 8px;
  color: #303133;
}

.weight-thin {
  font-weight: 100;
}

.weight-light {
  font-weight: 300;
}

.weight-normal {
  font-weight: 400;
}

.weight-medium {
  font-weight: 500;
}

.weight-semibold {
  font-weight: 600;
}

.weight-bold {
  font-weight: 700;
}

.weight-extrabold {
  font-weight: 800;
}
</style>
```

### 3. Text Alignment and Layout (25 minutes)

#### 3.1 Text Alignment Methods

```vue
<template>
  <div class="text-align-demo">
    <h3>Text Alignment Methods</h3>
    
    <div class="align-examples">
      <div class="align-item">
        <h4>Left Alignment (text-align: left)</h4>
        <p class="text-left">
          This is left-aligned text content. Left alignment is the most common text alignment method, suitable for most reading scenarios,
          especially for mixed content of Chinese and English. It provides a good reading experience and visual fluency.
        </p>
      </div>
      
      <div class="align-item">
        <h4>Center Alignment (text-align: center)</h4>
        <p class="text-center">
          This is center-aligned text content. Center alignment is typically used for titles, quotes, or content that needs special emphasis.
          It creates a visual focus but is not suitable for long text reading.
        </p>
      </div>
      
      <div class="align-item">
        <h4>Right Alignment (text-align: right)</h4>
        <p class="text-right">
          This is right-aligned text content. Right alignment is used in certain special scenarios, such as number alignment,
          date display, or special design requirements. It is more common in right-to-left languages like Arabic.
        </p>
      </div>
      
      <div class="align-item">
        <h4>Justified Alignment (text-align: justify)</h4>
        <p class="text-justify">
          This is justified text content. Justified alignment adjusts word spacing to align both the left and right edges of each line of text.
          This alignment method is common in newspapers, magazines, and other print media, creating a neat visual effect,
          but attention should be paid to readability when used on web pages.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.text-align-demo {
  margin-bottom: 32px;
}

.align-examples {
  display: grid;
  gap: 24px;
}

.align-item {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.align-item h4 {
  margin-bottom: 12px;
  color: #409eff;
  font-size: 14px;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-justify {
  text-align: justify;
}

.align-item p {
  margin: 0;
  line-height: 1.6;
  color: #606266;
}
</style>
```

### 4. Special Text Styles (35 minutes)

#### 4.1 Code and Quote Styles

```vue
<template>
  <div class="special-text-demo">
    <h3>Code and Quote Styles</h3>
    
    <!-- Inline code -->
    <div class="code-examples">
      <h4>Inline Code</h4>
      <p>
        In Vue 3, you can use <code class="inline-code">ref()</code> to create reactive data,
        or use <code class="inline-code">reactive()</code> to create reactive objects.
        Component lifecycle hooks like <code class="inline-code">onMounted()</code> need to be used in the setup function.
      </p>
    </div>
    
    <!-- Code block -->
    <div class="code-block-examples">
      <h4>Code Block</h4>
      <pre class="code-block"><code>// Vue 3 Composition API Example
import { ref, reactive, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    onMounted(() => {
      console.log('Component mounted')
    })
    
    return { count, state }
  }
}</code></pre>
    </div>
    
    <!-- Quote styles -->
    <div class="quote-examples">
      <h4>Quote Styles</h4>
      
      <blockquote class="quote-primary">
        <p>
          "Design is not just what it looks like and feels like. Design is how it works."
        </p>
        <cite>— Steve Jobs</cite>
      </blockquote>
      
      <blockquote class="quote-secondary">
        <p>
          Good code is its own best documentation. As you're about to add a comment, ask yourself,
          "How can I improve the code so that this comment isn't needed?"
        </p>
        <cite>— Steve McConnell</cite>
      </blockquote>
    </div>
    
    <!-- Keyboard key styles -->
    <div class="kbd-examples">
      <h4>Keyboard Keys</h4>
      <p>
        Use <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">C</kbd> to copy text,
        <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">V</kbd> to paste text.
        On Mac, use <kbd class="kbd">⌘</kbd> + <kbd class="kbd">C</kbd> and 
        <kbd class="kbd">⌘</kbd> + <kbd class="kbd">V</kbd>.
      </p>
      
      <p>
        Keyboard shortcuts:
        <kbd class="kbd-combo">
          <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">Shift</kbd> + <kbd class="kbd">I</kbd>
        </kbd>
        to open developer tools
      </p>
    </div>
  </div>
</template>

<style>
.special-text-demo {
  margin-bottom: 32px;
}

.code-examples,
.code-block-examples,
.quote-examples,
.kbd-examples {
  margin-bottom: 24px;
}

.code-examples h4,
.code-block-examples h4,
.quote-examples h4,
.kbd-examples h4 {
  color: #409eff;
  margin-bottom: 12px;
  font-size: 16px;
}

/* Inline code styles */
.inline-code {
  background-color: #f5f7fa;
  color: #e6a23c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

/* Tip box */
.tip-box {
  background-color: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 20px 0;
}

.tip-box h5 {
  margin: 0 0 8px 0;
  color: #fa8c16;
  font-size: 14px;
  font-weight: 600;
}

.tip-box p {
  margin: 0;
  color: #8c6e00;
  line-height: 1.6;
}

/* Article footer */
.article-footer {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 2px solid #f0f2f5;
}

.tags {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f0f2f5;
  color: #606266;
  font-size: 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: #409eff;
  color: white;
}

.article-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background-color: #409eff;
  color: white;
}

.action-btn.primary:hover {
  background-color: #337ecc;
}

.action-btn.secondary {
  background-color: #f0f2f5;
  color: #606266;
}

.action-btn.secondary:hover {
  background-color: #e4e7ed;
}

/* Responsive design */
@media (max-width: 768px) {
  .article {
    padding: 24px 20px;
  }
  
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .lead-paragraph {
    font-size: 16px;
    padding: 16px;
  }
  
  .article-content h2 {
    font-size: 20px;
  }
  
  .article-content h3 {
    font-size: 18px;
  }
  
  .article-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
```

## Practical Exercises

### Exercise 1: Basic Typography System
Create a display page containing all heading levels and paragraph styles.

### Exercise 2: Responsive Typography
Implement a typography system that adapts to different screen sizes.

### Exercise 3: Special Text Styles
Design a complete set of code, quote, and keyboard key styles.

### Exercise 4: Article Typography Template
Create a reusable article typography template component.

## Design Principles

1. **Clear Hierarchy**: Establish clear information hierarchy through font size and weight
2. **Consistency**: Maintain consistency of typography styles throughout the application
3. **Readability**: Ensure text is readable on all devices
4. **Accessibility**: Follow accessibility design standards to ensure all users can read normally
5. **Responsiveness**: Provide the best reading experience on different screen sizes

## Learning Resources

- [Typography Official Documentation](https://element-plus.org/en-US/component/typography.html)
- [Web Typography Design Guide](https://web.dev/learn/design/typography/)
- [CSS Font and Text Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts)
- [Responsive Typography Best Practices](https://www.smashingmagazine.com/2016/05/fluid-typography/)

## Assignments

1. **Basic Assignment**: Create a complete typography style library
2. **Advanced Assignment**: Implement a typography system that supports theme switching
3. **Challenge Assignment**: Design an adaptive article reader interface

## Summary

Typography is the foundation of user interface design, and good typography can significantly enhance the user experience. By properly using font sizes, weights, spacing, and alignment, combined with responsive design principles, you can create a typography system that is both beautiful and practical. Mastering typography skills is essential for front-end developers.

---

**Study Date:** ___________
**Completion Status:** ___________
**Study Notes:**



**Problems Encountered:**



**Solutions:**
  color: #e6a23c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
  border: 1px solid #e4e7ed;
}

/* Code block styles */
.code-block {
  background-color: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.code-block code {
  background: none;
  color: inherit;
  padding: 0;
  border: none;
}

/* Quote styles */
.quote-primary {
  border-left: 4px solid #409eff;
  background-color: #ecf5ff;
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
}

.quote-secondary {
  border-left: 4px solid #67c23a;
  background-color: #f0f9ff;
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: 0 8px 8px 0;
}

.quote-primary p,
.quote-secondary p {
  margin: 0 0 8px 0;
  font-style: italic;
  color: #606266;
  line-height: 1.6;
}

.quote-primary cite,
.quote-secondary cite {
  display: block;
  text-align: right;
  font-size: 14px;
  color: #909399;
  font-style: normal;
}

/* Keyboard key styles */
.kbd {
  display: inline-block;
  padding: 2px 6px;
  font-size: 12px;
  line-height: 1;
  color: #606266;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0,0,0,0.1);
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-weight: 600;
}

.kbd-combo {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 8px;
  background-color: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
}
</style>
```

### 5. Responsive Typography (20 minutes)

#### 5.1 Responsive Font Size

```vue
<template>
  <div class="responsive-typography">
    <h3>Responsive Typography</h3>
    
    <div class="responsive-examples">
      <h1 class="responsive-title">
        Responsive Title
      </h1>
      
      <p class="responsive-paragraph">
        This is a responsive paragraph text example. Under different screen sizes,
        the font size will automatically adjust to ensure the best reading experience.
        Text will be relatively smaller on mobile devices and larger on desktop devices.
      </p>
      
      <div class="responsive-grid">
        <div class="grid-item">
          <h4 class="responsive-subtitle">Mobile First</h4>
          <p class="responsive-text">
            Adopt a mobile-first design strategy to ensure a good reading experience on small-screen devices.
          </p>
        </div>
        
        <div class="grid-item">
          <h4 class="responsive-subtitle">Progressive Enhancement</h4>
          <p class="responsive-text">
            Gradually enhance typography effects and font sizes as screen size increases.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.responsive-typography {
  margin-bottom: 32px;
}

/* Base styles (mobile first) */
.responsive-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  color: #303133;
  margin-bottom: 16px;
}

.responsive-paragraph {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 20px;
}

.responsive-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.responsive-text {
  font-size: 13px;
  line-height: 1.5;
  color: #909399;
  margin: 0;
}

.responsive-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

.grid-item {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

/* Tablet styles */
@media (min-width: 768px) {
  .responsive-title {
    font-size: 28px;
  }
  
  .responsive-paragraph {
    font-size: 15px;
    line-height: 1.7;
  }
  
  .responsive-subtitle {
    font-size: 18px;
  }
  
  .responsive-text {
    font-size: 14px;
    line-height: 1.6;
  }
  
  .responsive-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .responsive-title {
    font-size: 32px;
    margin-bottom: 20px;
  }
  
  .responsive-paragraph {
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 24px;
  }
  
  .responsive-subtitle {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .responsive-text {
    font-size: 15px;
    line-height: 1.7;
  }
  
  .responsive-grid {
    gap: 24px;
  }
  
  .grid-item {
    padding: 20px;
  }
}

/* Large screen styles */
@media (min-width: 1440px) {
  .responsive-title {
    font-size: 36px;
  }
  
  .responsive-paragraph {
    font-size: 18px;
  }
  
  .responsive-subtitle {
    font-size: 22px;
  }
  
  .responsive-text {
    font-size: 16px;
  }
}
</style>
```

### 6. Comprehensive Application Example (30 minutes)

#### 6.1 Article Typography System

```vue
<template>
  <div class="article-typography">
    <article class="article">
      <header class="article-header">
        <div class="article-category">Technical Article</div>
        <h1 class="article-title">
          Element Plus Typography System Design Guide
        </h1>
        <div class="article-meta">
          <span class="author">Author: Design Team</span>
          <span class="date">Published: January 15, 2024</span>
          <span class="reading-time">Reading time: About 8 minutes</span>
        </div>
      </header>
      
      <main class="article-content">
        <p class="lead-paragraph">
          Good typography is the foundation of user experience. This article will detail how to build
          a complete typography system in Element Plus, including font selection, size specifications,
          spacing design, and other key elements.
        </p>
        
        <h2>The Importance of Typography</h2>
        <p>
          Typography is not just about making text look beautiful; more importantly, it enhances content readability
          and the user's reading experience. A good typography system can:
        </p>
        
        <ul class="feature-list">
          <li>Improve content readability and scannability</li>
          <li>Establish clear information hierarchy</li>
          <li>Enhance brand consistency</li>
          <li>Improve the user's reading experience</li>
        </ul>
        
        <h3>Font System Design</h3>
        <p>
          When designing a font system, we need to consider the following aspects:
        </p>
        
        <blockquote class="important-quote">
          <p>
            "Typography is the voice of design. Choosing the right font is as important as choosing the right tone."
          </p>
          <cite>— Font Designer Matthew Carter</cite>
        </blockquote>
        
        <h4>Code Example</h4>
        <p>
          Here is a basic font style definition:
        </p>
        
        <pre class="code-example"><code>/* Basic font styles */
.text-primary {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #303133;
}

.text-secondary {
  font-size: 14px;
  color: #606266;
}

.text-caption {
  font-size: 12px;
  color: #909399;
}</code></pre>
        
        <h3>Practical Application Tips</h3>
        <p>
          In actual projects, it is recommended to use CSS variables to manage font styles:
        </p>
        
        <div class="tip-box">
          <h5>💡 Pro Tip</h5>
          <p>
            Using <code class="inline-code">CSS Custom Properties</code> 
            can make your typography system more flexible and easier to maintain. With variables like 
            <code class="inline-code">var(--font-size-base)</code>, 
            you can easily maintain consistency throughout your project.
          </p>
        </div>
        
        <h2>Best Practices</h2>
        <ol class="best-practices">
          <li>
            <strong>Maintain Consistency:</strong>
            Use unified font specifications and spacing systems throughout the application.
          </li>
          <li>
            <strong>Consider Accessibility:</strong>
            Ensure text contrast meets WCAG standards and font sizes are suitable for reading.
          </li>
          <li>
            <strong>Responsive Design:</strong>
            Adjust font sizes and line heights on different devices for the best experience.
          </li>
          <li>
            <strong>Performance Optimization:</strong>
            Use font files reasonably and avoid loading too many unnecessary font weights.
          </li>
        </ol>
      </main>
      
      <footer class="article-footer">
        <div class="tags">
          <span class="tag">Typography</span>
          <span class="tag">Design System</span>
          <span class="tag">Element Plus</span>
          <span class="tag">User Experience</span>
        </div>
        
        <div class="article-actions">
          <button class="action-btn primary">Share Article</button>
          <button class="action-btn secondary">Bookmark</button>
          <button class="action-btn secondary">Print</button>
        </div>
      </footer>
    </article>
  </div>
</template>

<style>
.article-typography {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.article {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

/* Article header */
.article-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f2f5;
}

.article-category {
  display: inline-block;
  padding: 4px 12px;
  background-color: #409eff;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 16px;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: #303133;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #909399;
}

.article-meta span {
  display: flex;
  align-items: center;
}

/* Article content */
.article-content {
  line-height: 1.8;
  color: #606266;
}

.lead-paragraph {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 32px;
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 4px solid #409eff;
  border-radius: 0 8px 8px 0;
}

.article-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 32px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e4e7ed;
}

.article-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 24px 0 12px 0;
}

.article-content h4 {
  font-size: 18px;
  font-weight: 500;
  color: #606266;
  margin: 20px 0 8px 0;
}

.article-content h5 {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 16px 0 8px 0;
}

.article-content p {
  margin-bottom: 16px;
}

/* List styles */
.feature-list,
.best-practices {
  margin: 16px 0;
  padding-left: 20px;
}

.feature-list li,
.best-practices li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.best-practices li strong {
  color: #303133;
  font-weight: 600;
}

/* Quote styles */
.important-quote {
  margin: 24px 0;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  position: relative;
}

.important-quote::before {
  content: '"';
  font-size: 48px;
  position: absolute;
  top: 10px;
  left: 20px;
  opacity: 0.3;
}

.important-quote p {
  margin: 0 0 8px 0;
  font-style: italic;
  font-size: 16px;
  padding-left: 20px;
}

.important-quote cite {
  display: block;
  text-align: right;
  font-size: 14px;
  opacity: 0.9;
  font-style: normal;
}

/* Code styles */
.code-example {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.inline-code {
  background-color: #f5f7fa;