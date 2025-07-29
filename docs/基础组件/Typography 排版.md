# Typography 排版组件

## 学习目标
- 掌握 Typography 排版的基础概念和应用
- 理解标题层级和文本样式的设计原则
- 学会使用不同的字体大小、粗细和对齐方式
- 掌握代码、引用等特殊文本样式
- 能够创建美观统一的排版系统

## 详细学习内容

### 1. Typography 排版基础

#### 1.1 标题层级

Typography 排版系统提供了完整的标题层级，确保内容结构清晰。

```vue
<template>
  <div class="typography-demo">
    <h1 class="heading-1">一级标题 - 主标题</h1>
    <h2 class="heading-2">二级标题 - 章节标题</h2>
    <h3 class="heading-3">三级标题 - 小节标题</h3>
    <h4 class="heading-4">四级标题 - 子标题</h4>
    <h5 class="heading-5">五级标题 - 小标题</h5>
    <h6 class="heading-6">六级标题 - 最小标题</h6>
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

#### 1.2 段落和正文

```vue
<template>
  <div class="paragraph-demo">
    <p class="paragraph-large">
      大号段落文本：这是一个大号的段落文本示例，通常用于重要的介绍性内容或者需要突出显示的文本段落。
    </p>
    
    <p class="paragraph-normal">
      标准段落文本：这是标准的段落文本，是网页中最常用的文本样式。它具有良好的可读性，适合大部分内容展示。
    </p>
    
    <p class="paragraph-small">
      小号段落文本：这是小号的段落文本，通常用于辅助说明、注释或者不太重要的补充信息。
    </p>
    
    <p class="paragraph-caption">
      说明文字：这是说明文字样式，通常用于图片说明、表格说明或者其他需要特殊标注的地方。
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

### 2. 字体样式控制（30分钟）

#### 2.1 字体大小系统

```vue
<template>
  <div class="font-size-demo">
    <h3>字体大小系统</h3>
    
    <div class="size-examples">
      <div class="size-item">
        <span class="size-extra-large">超大字体 (24px)</span>
        <code>.size-extra-large</code>
      </div>
      
      <div class="size-item">
        <span class="size-large">大字体 (20px)</span>
        <code>.size-large</code>
      </div>
      
      <div class="size-item">
        <span class="size-medium">中等字体 (16px)</span>
        <code>.size-medium</code>
      </div>
      
      <div class="size-item">
        <span class="size-small">小字体 (14px)</span>
        <code>.size-small</code>
      </div>
      
      <div class="size-item">
        <span class="size-mini">迷你字体 (12px)</span>
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

#### 2.2 字体粗细

```vue
<template>
  <div class="font-weight-demo">
    <h3>字体粗细</h3>
    
    <div class="weight-examples">
      <p class="weight-thin">细体文字 (font-weight: 100)</p>
      <p class="weight-light">轻体文字 (font-weight: 300)</p>
      <p class="weight-normal">正常文字 (font-weight: 400)</p>
      <p class="weight-medium">中等文字 (font-weight: 500)</p>
      <p class="weight-semibold">半粗体文字 (font-weight: 600)</p>
      <p class="weight-bold">粗体文字 (font-weight: 700)</p>
      <p class="weight-extrabold">超粗体文字 (font-weight: 800)</p>
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

### 3. 文本对齐和布局（25分钟）

#### 3.1 文本对齐方式

```vue
<template>
  <div class="text-align-demo">
    <h3>文本对齐方式</h3>
    
    <div class="align-examples">
      <div class="align-item">
        <h4>左对齐 (text-align: left)</h4>
        <p class="text-left">
          这是左对齐的文本内容。左对齐是最常见的文本对齐方式，适合大部分阅读场景，
          特别是中文和英文的混合内容。它能够提供良好的阅读体验和视觉流畅性。
        </p>
      </div>
      
      <div class="align-item">
        <h4>居中对齐 (text-align: center)</h4>
        <p class="text-center">
          这是居中对齐的文本内容。居中对齐通常用于标题、引用或者需要特别强调的内容。
          它能够创造视觉焦点，但不适合长篇文本阅读。
        </p>
      </div>
      
      <div class="align-item">
        <h4>右对齐 (text-align: right)</h4>
        <p class="text-right">
          这是右对齐的文本内容。右对齐在某些特殊场景下使用，比如数字对齐、
          日期显示或者特殊的设计需求。在阿拉伯语等从右到左的语言中更为常见。
        </p>
      </div>
      
      <div class="align-item">
        <h4>两端对齐 (text-align: justify)</h4>
        <p class="text-justify">
          这是两端对齐的文本内容。两端对齐会调整单词间距，使每行文本的左右两端都对齐。
          这种对齐方式在报纸、杂志等印刷媒体中常见，能够创造整齐的视觉效果，
          但在网页中使用时需要注意可读性。
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

### 4. 特殊文本样式（35分钟）

#### 4.1 代码和引用样式

```vue
<template>
  <div class="special-text-demo">
    <h3>代码和引用样式</h3>
    
    <!-- 行内代码 -->
    <div class="code-examples">
      <h4>行内代码</h4>
      <p>
        在 Vue 3 中，你可以使用 <code class="inline-code">ref()</code> 来创建响应式数据，
        或者使用 <code class="inline-code">reactive()</code> 来创建响应式对象。
        组件的生命周期钩子如 <code class="inline-code">onMounted()</code> 需要在 setup 函数中使用。
      </p>
    </div>
    
    <!-- 代码块 -->
    <div class="code-block-examples">
      <h4>代码块</h4>
      <pre class="code-block"><code>// Vue 3 Composition API 示例
import { ref, reactive, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0'
    })
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return { count, state }
  }
}</code></pre>
    </div>
    
    <!-- 引用样式 -->
    <div class="quote-examples">
      <h4>引用样式</h4>
      
      <blockquote class="quote-primary">
        <p>
          "设计不仅仅是外观和感觉，设计是它如何工作的。"
        </p>
        <cite>— 史蒂夫·乔布斯</cite>
      </blockquote>
      
      <blockquote class="quote-secondary">
        <p>
          好的代码本身就是最好的文档。当你考虑要添加一个注释时，
          问问自己，"如何能改进这段代码，以让它不需要注释？"
        </p>
        <cite>— 史蒂夫·麦康奈尔</cite>
      </blockquote>
    </div>
    
    <!-- 键盘按键样式 -->
    <div class="kbd-examples">
      <h4>键盘按键</h4>
      <p>
        使用 <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">C</kbd> 复制文本，
        <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">V</kbd> 粘贴文本。
        在 Mac 上使用 <kbd class="kbd">⌘</kbd> + <kbd class="kbd">C</kbd> 和 
        <kbd class="kbd">⌘</kbd> + <kbd class="kbd">V</kbd>。
      </p>
      
      <p>
        快捷键组合：
        <kbd class="kbd-combo">
          <kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">Shift</kbd> + <kbd class="kbd">I</kbd>
        </kbd>
        打开开发者工具
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

/* 行内代码样式 */
.inline-code {
  background-color: #f5f7fa;
  color: #e6a23c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
  border: 1px solid #e4e7ed;
}

/* 代码块样式 */
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

/* 引用样式 */
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

/* 键盘按键样式 */
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

### 5. 响应式排版（20分钟）

#### 5.1 响应式字体大小

```vue
<template>
  <div class="responsive-typography">
    <h3>响应式排版</h3>
    
    <div class="responsive-examples">
      <h1 class="responsive-title">
        响应式标题
      </h1>
      
      <p class="responsive-paragraph">
        这是一个响应式段落文本示例。在不同的屏幕尺寸下，
        文字大小会自动调整以确保最佳的阅读体验。
        在移动设备上文字会相对较小，在桌面设备上会相对较大。
      </p>
      
      <div class="responsive-grid">
        <div class="grid-item">
          <h4 class="responsive-subtitle">移动优先</h4>
          <p class="responsive-text">
            采用移动优先的设计策略，确保在小屏幕设备上有良好的阅读体验。
          </p>
        </div>
        
        <div class="grid-item">
          <h4 class="responsive-subtitle">渐进增强</h4>
          <p class="responsive-text">
            随着屏幕尺寸的增加，逐步增强排版效果和字体大小。
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

/* 基础样式（移动优先） */
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

/* 平板样式 */
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

/* 桌面样式 */
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

/* 大屏幕样式 */
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

### 6. 综合应用示例（30分钟）

#### 6.1 文章排版系统

```vue
<template>
  <div class="article-typography">
    <article class="article">
      <header class="article-header">
        <div class="article-category">技术文章</div>
        <h1 class="article-title">
          Element Plus Typography 排版系统设计指南
        </h1>
        <div class="article-meta">
          <span class="author">作者：设计团队</span>
          <span class="date">发布时间：2024年1月15日</span>
          <span class="reading-time">阅读时间：约 8 分钟</span>
        </div>
      </header>
      
      <main class="article-content">
        <p class="lead-paragraph">
          良好的排版是用户体验的基础。本文将详细介绍如何在 Element Plus 中
          构建一套完整的排版系统，包括字体选择、尺寸规范、间距设计等关键要素。
        </p>
        
        <h2>排版的重要性</h2>
        <p>
          排版不仅仅是让文字看起来美观，更重要的是提升内容的可读性和用户的阅读体验。
          一个好的排版系统能够：
        </p>
        
        <ul class="feature-list">
          <li>提高内容的可读性和可扫描性</li>
          <li>建立清晰的信息层级</li>
          <li>增强品牌的一致性</li>
          <li>改善用户的阅读体验</li>
        </ul>
        
        <h3>字体系统设计</h3>
        <p>
          在设计字体系统时，我们需要考虑以下几个方面：
        </p>
        
        <blockquote class="important-quote">
          <p>
            "字体是设计的声音。选择合适的字体就像选择合适的语调一样重要。"
          </p>
          <cite>— 字体设计师 Matthew Carter</cite>
        </blockquote>
        
        <h4>代码示例</h4>
        <p>
          以下是一个基础的字体样式定义：
        </p>
        
        <pre class="code-example"><code>/* 基础字体样式 */
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
        
        <h3>实际应用技巧</h3>
        <p>
          在实际项目中，建议使用 CSS 变量来管理字体样式：
        </p>
        
        <div class="tip-box">
          <h5>💡 专业提示</h5>
          <p>
            使用 <code class="inline-code">CSS Custom Properties</code> 
            可以让你的排版系统更加灵活和易于维护。通过 
            <code class="inline-code">var(--font-size-base)</code> 
            这样的变量，你可以轻松地在整个项目中保持一致性。
          </p>
        </div>
        
        <h2>最佳实践</h2>
        <ol class="best-practices">
          <li>
            <strong>保持一致性：</strong>
            在整个应用中使用统一的字体规范和间距系统。
          </li>
          <li>
            <strong>考虑可访问性：</strong>
            确保文字对比度符合 WCAG 标准，字体大小适合阅读。
          </li>
          <li>
            <strong>响应式设计：</strong>
            在不同设备上调整字体大小和行高以获得最佳体验。
          </li>
          <li>
            <strong>性能优化：</strong>
            合理使用字体文件，避免加载过多不必要的字重。
          </li>
        </ol>
      </main>
      
      <footer class="article-footer">
        <div class="tags">
          <span class="tag">排版</span>
          <span class="tag">设计系统</span>
          <span class="tag">Element Plus</span>
          <span class="tag">用户体验</span>
        </div>
        
        <div class="article-actions">
          <button class="action-btn primary">分享文章</button>
          <button class="action-btn secondary">收藏</button>
          <button class="action-btn secondary">打印</button>
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

/* 文章头部 */
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

/* 文章内容 */
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

/* 列表样式 */
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

/* 引用样式 */
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

/* 代码样式 */
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
  color: #e6a23c;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

/* 提示框 */
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

/* 文章底部 */
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

/* 响应式设计 */
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

## 实践练习

### 练习1：基础排版系统
创建一个包含所有标题层级和段落样式的展示页面。

### 练习2：响应式排版
实现一个在不同屏幕尺寸下自适应的排版系统。

### 练习3：特殊文本样式
设计一套完整的代码、引用和键盘按键样式。

### 练习4：文章排版模板
创建一个可复用的文章排版模板组件。

## 设计原则

1. **层级清晰**：通过字体大小和粗细建立清晰的信息层级
2. **一致性**：保持整个应用中排版样式的一致性
3. **可读性**：确保文本在各种设备上都有良好的可读性
4. **可访问性**：遵循无障碍设计标准，确保所有用户都能正常阅读
5. **响应式**：在不同屏幕尺寸下提供最佳的阅读体验

## 学习资源

- [Typography 排版官方文档](https://element-plus.org/zh-CN/component/typography.html)
- [Web 排版设计指南](https://web.dev/learn/design/typography/)
- [CSS 字体和文本属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Fonts)
- [响应式排版最佳实践](https://www.smashingmagazine.com/2016/05/fluid-typography/)

## 作业

1. **基础作业**：创建一个完整的排版样式库
2. **进阶作业**：实现一个支持主题切换的排版系统
3. **挑战作业**：设计一个自适应的文章阅读器界面

## 总结

Typography 排版是用户界面设计的基础，良好的排版能够显著提升用户体验。通过合理使用字体大小、粗细、间距和对齐方式，结合响应式设计原则，可以创建出既美观又实用的排版系统。掌握排版技巧对于前端开发者来说是必不可少的技能。

---

**学习日期：** ___________
**完成状态：** ___________
**学习笔记：**



**遇到的问题：**



**解决方案：**