# Color 色彩

## 学习目标

* 掌握 Element Plus 颜色系统的使用
* 理解色彩设计原则和最佳实践
* 学会使用颜色变量创建主题
* 掌握颜色在用户界面中的应用

## 知识点概览

### 1. 主题色彩

```vue
<template>
  <div class="color-demo">
    <!-- 主要颜色 -->
    <div class="color-section">
      <h3>主要颜色</h3>
      <div class="color-row">
        <div class="color-block primary">
          <span>Primary</span>
          <small>#409EFF</small>
        </div>
        <div class="color-block success">
          <span>Success</span>
          <small>#67C23A</small>
        </div>
        <div class="color-block warning">
          <span>Warning</span>
          <small>#E6A23C</small>
        </div>
        <div class="color-block danger">
          <span>Danger</span>
          <small>#F56C6C</small>
        </div>
        <div class="color-block info">
          <span>Info</span>
          <small>#909399</small>
        </div>
      </div>
    </div>
    
    <!-- 中性颜色 -->
    <div class="color-section">
      <h3>中性颜色</h3>
      <div class="color-row">
        <div class="color-block text-primary">
          <span>主要文字</span>
          <small>#303133</small>
        </div>
        <div class="color-block text-regular">
          <span>常规文字</span>
          <small>#606266</small>
        </div>
        <div class="color-block text-secondary">
          <span>次要文字</span>
          <small>#909399</small>
        </div>
        <div class="color-block text-placeholder">
          <span>占位文字</span>
          <small>#A8ABB2</small>
        </div>
      </div>
    </div>
    
    <!-- 边框颜色 -->
    <div class="color-section">
      <h3>边框颜色</h3>
      <div class="color-row">
        <div class="color-block border-darker">
          <span>深色边框</span>
          <small>#CDD0D6</small>
        </div>
        <div class="color-block border-dark">
          <span>一般边框</span>
          <small>#D4D7DE</small>
        </div>
        <div class="color-block border-base">
          <span>基础边框</span>
          <small>#DCDFE6</small>
        </div>
        <div class="color-block border-light">
          <span>浅色边框</span>
          <small>#E4E7ED</small>
        </div>
      </div>
    </div>
    
    <!-- 背景颜色 -->
    <div class="color-section">
      <h3>背景颜色</h3>
      <div class="color-row">
        <div class="color-block bg-base">
          <span>基础背景</span>
          <small>#F2F3F5</small>
        </div>
        <div class="color-block bg-light">
          <span>浅色背景</span>
          <small>#F5F7FA</small>
        </div>
        <div class="color-block bg-lighter">
          <span>更浅背景</span>
          <small>#FAFAFA</small>
        </div>
        <div class="color-block bg-extra-light">
          <span>极浅背景</span>
          <small>#FAFCFF</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-demo {
  padding: 20px;
}

.color-section {
  margin-bottom: 30px;
}

.color-section h3 {
  margin-bottom: 15px;
  color: var(--el-text-color-primary);
}

.color-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-block {
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: white;
  text-align: center;
}

.color-block span {
  font-weight: bold;
  margin-bottom: 5px;
}

.color-block small {
  font-size: 12px;
  opacity: 0.8;
}

/* 主要颜色 */
.primary { background-color: var(--el-color-primary); }
.success { background-color: var(--el-color-success); }
.warning { background-color: var(--el-color-warning); }
.danger { background-color: var(--el-color-danger); }
.info { background-color: var(--el-color-info); }

/* 文字颜色 */
.text-primary {
  background-color: var(--el-text-color-primary);
}
.text-regular {
  background-color: var(--el-text-color-regular);
}
.text-secondary {
  background-color: var(--el-text-color-secondary);
}
.text-placeholder {
  background-color: var(--el-text-color-placeholder);
}

/* 边框颜色 */
.border-darker {
  background-color: var(--el-border-color-darker);
  color: var(--el-text-color-primary);
}
.border-dark {
  background-color: var(--el-border-color-dark);
  color: var(--el-text-color-primary);
}
.border-base {
  background-color: var(--el-border-color);
  color: var(--el-text-color-primary);
}
.border-light {
  background-color: var(--el-border-color-light);
  color: var(--el-text-color-primary);
}

/* 背景颜色 */
.bg-base {
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}
.bg-light {
  background-color: var(--el-bg-color-light);
  color: var(--el-text-color-primary);
}
.bg-lighter {
  background-color: var(--el-bg-color-lighter);
  color: var(--el-text-color-primary);
}
.bg-extra-light {
  background-color: var(--el-bg-color-extra-light);
  color: var(--el-text-color-primary);
}
</style>
```

### 2. 颜色变量使用

```vue
<template>
  <div class="color-usage-demo">
    <div class="custom-card">
      <h4>自定义卡片</h4>
      <p>使用 Element Plus 颜色变量创建的自定义组件</p>
      <div class="card-actions">
        <button class="custom-btn primary">主要操作</button>
        <button class="custom-btn secondary">次要操作</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-usage-demo {
  padding: 20px;
}

.custom-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
}

.custom-card h4 {
  color: var(--el-text-color-primary);
  margin: 0 0 10px 0;
}

.custom-card p {
  color: var(--el-text-color-regular);
  margin: 0 0 20px 0;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.custom-btn {
  padding: 8px 16px;
  border: none;
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  transition: all 0.3s;
}

.custom-btn.primary {
  background-color: var(--el-color-primary);
  color: white;
}

.custom-btn.primary:hover {
  background-color: var(--el-color-primary-light-3);
}

.custom-btn.secondary {
  background-color: transparent;
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);
}

.custom-btn.secondary:hover {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
</style>
```

### 3. 颜色变量系统

Element Plus 提供了完整的颜色变量系统：

#### 3.1 主题颜色变量

```css
/* 主要颜色 */
--el-color-primary: #409EFF;
--el-color-success: #67C23A;
--el-color-warning: #E6A23C;
--el-color-danger: #F56C6C;
--el-color-error: #F56C6C;
--el-color-info: #909399;

/* 主要颜色的浅色变体 */
--el-color-primary-light-3: #79bbff;
--el-color-primary-light-5: #a0cfff;
--el-color-primary-light-7: #c6e2ff;
--el-color-primary-light-8: #d9ecff;
--el-color-primary-light-9: #ecf5ff;

/* 主要颜色的深色变体 */
--el-color-primary-dark-2: #337ecc;
```

#### 3.2 文字颜色变量

```css
/* 文字颜色 */
--el-text-color-primary: #303133;
--el-text-color-regular: #606266;
--el-text-color-secondary: #909399;
--el-text-color-placeholder: #A8ABB2;
--el-text-color-disabled: #C0C4CC;
```

#### 3.3 背景颜色变量

```css
/* 背景颜色 */
--el-bg-color: #FFFFFF;
--el-bg-color-page: #F2F3F5;
--el-bg-color-overlay: #FFFFFF;
--el-bg-color-light: #F5F7FA;
--el-bg-color-lighter: #FAFAFA;
--el-bg-color-extra-light: #FAFCFF;
```

#### 3.4 边框颜色变量

```css
/* 边框颜色 */
--el-border-color: #DCDFE6;
--el-border-color-light: #E4E7ED;
--el-border-color-lighter: #EBEEF5;
--el-border-color-extra-light: #F2F6FC;
--el-border-color-dark: #D4D7DE;
--el-border-color-darker: #CDD0D6;
```

### 4. 颜色应用示例

#### 4.1 状态指示器

```vue
<template>
  <div class="status-indicators">
    <div class="status-item success">
      <div class="status-icon"></div>
      <span>成功状态</span>
    </div>
    
    <div class="status-item warning">
      <div class="status-icon"></div>
      <span>警告状态</span>
    </div>
    
    <div class="status-item danger">
      <div class="status-icon"></div>
      <span>错误状态</span>
    </div>
    
    <div class="status-item info">
      <div class="status-icon"></div>
      <span>信息状态</span>
    </div>
  </div>
</template>

<style scoped>
.status-indicators {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}

.status-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-item.success {
  border-left: 4px solid var(--el-color-success);
}

.status-item.success .status-icon {
  background-color: var(--el-color-success);
}

.status-item.warning {
  border-left: 4px solid var(--el-color-warning);
}

.status-item.warning .status-icon {
  background-color: var(--el-color-warning);
}

.status-item.danger {
  border-left: 4px solid var(--el-color-danger);
}

.status-item.danger .status-icon {
  background-color: var(--el-color-danger);
}

.status-item.info {
  border-left: 4px solid var(--el-color-info);
}

.status-item.info .status-icon {
  background-color: var(--el-color-info);
}

.status-item span {
  color: var(--el-text-color-primary);
  font-weight: 500;
}
</style>
```

#### 4.2 进度指示器

```vue
<template>
  <div class="progress-demo">
    <div class="progress-item">
      <label>项目进度</label>
      <div class="progress-bar">
        <div class="progress-fill primary" style="width: 75%"></div>
      </div>
      <span class="progress-text">75%</span>
    </div>
    
    <div class="progress-item">
      <label>任务完成</label>
      <div class="progress-bar">
        <div class="progress-fill success" style="width: 100%"></div>
      </div>
      <span class="progress-text">100%</span>
    </div>
    
    <div class="progress-item">
      <label>风险评估</label>
      <div class="progress-bar">
        <div class="progress-fill warning" style="width: 45%"></div>
      </div>
      <span class="progress-text">45%</span>
    </div>
    
    <div class="progress-item">
      <label>错误率</label>
      <div class="progress-bar">
        <div class="progress-fill danger" style="width: 15%"></div>
      </div>
      <span class="progress-text">15%</span>
    </div>
  </div>
</template>

<style scoped>
.progress-demo {
  padding: 20px;
  max-width: 400px;
}

.progress-item {
  margin-bottom: 20px;
}

.progress-item label {
  display: block;
  margin-bottom: 5px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--el-bg-color-light);
  border-radius: var(--el-border-radius-round);
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  border-radius: var(--el-border-radius-round);
  transition: width 0.3s ease;
}

.progress-fill.primary {
  background-color: var(--el-color-primary);
}

.progress-fill.success {
  background-color: var(--el-color-success);
}

.progress-fill.warning {
  background-color: var(--el-color-warning);
}

.progress-fill.danger {
  background-color: var(--el-color-danger);
}

.progress-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
```

#### 4.3 主题切换示例

```vue
<template>
  <div class="theme-demo">
    <div class="theme-controls">
      <button @click="setTheme('light')" :class="{ active: theme === 'light' }">浅色主题</button>
      <button @click="setTheme('dark')" :class="{ active: theme === 'dark' }">深色主题</button>
    </div>
    
    <div class="theme-content" :class="theme">
      <div class="content-card">
        <h3>主题演示</h3>
        <p>这是一个主题切换的演示，展示了如何使用 CSS 变量实现主题切换。</p>
        <div class="color-samples">
          <div class="color-sample primary">Primary</div>
          <div class="color-sample success">Success</div>
          <div class="color-sample warning">Warning</div>
          <div class="color-sample danger">Danger</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')

const setTheme = (newTheme) => {
  theme.value = newTheme
}
</script>

<style scoped>
.theme-demo {
  padding: 20px;
}

.theme-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.theme-controls button {
  padding: 8px 16px;
  border: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  transition: all 0.3s;
}

.theme-controls button:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.theme-controls button.active {
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
}

.theme-content {
  padding: 20px;
  border-radius: var(--el-border-radius-base);
  transition: all 0.3s;
}

.theme-content.light {
  background-color: #ffffff;
  color: #303133;
}

.theme-content.dark {
  background-color: #1d1e1f;
  color: #e5eaf3;
}

.content-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  padding: 20px;
}

.content-card h3 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.content-card p {
  margin: 0 0 20px 0;
  color: var(--el-text-color-regular);
}

.color-samples {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-sample {
  padding: 8px 16px;
  border-radius: var(--el-border-radius-base);
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.color-sample.primary {
  background-color: var(--el-color-primary);
}

.color-sample.success {
  background-color: var(--el-color-success);
}

.color-sample.warning {
  background-color: var(--el-color-warning);
}

.color-sample.danger {
  background-color: var(--el-color-danger);
}
</style>
```

### 5. 综合示例

#### 5.1 状态卡片组件

使用颜色系统创建状态展示卡片：

```vue
<template>
  <div class="card-demo">
    <div class="custom-card primary">
      <h4>主要信息卡片</h4>
      <p>使用主要颜色的信息展示卡片</p>
    </div>
    
    <div class="custom-card success">
      <h4>成功状态卡片</h4>
      <p>使用成功颜色的状态展示卡片</p>
    </div>
    
    <div class="custom-card warning">
      <h4>警告信息卡片</h4>
      <p>使用警告颜色的提醒展示卡片</p>
    </div>
    
    <div class="custom-card danger">
      <h4>错误状态卡片</h4>
      <p>使用危险颜色的错误展示卡片</p>
    </div>
  </div>
</template>

<style scoped>
.card-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.custom-card {
  padding: 20px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s;
}

.custom-card:hover {
  box-shadow: var(--el-box-shadow);
  transform: translateY(-2px);
}

.custom-card.primary {
  border-color: var(--el-color-primary);
}

.custom-card.success {
  border-color: var(--el-color-success);
}

.custom-card.warning {
  border-color: var(--el-color-warning);
}

.custom-card.danger {
  border-color: var(--el-color-danger);
}

.custom-card h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.custom-card p {
  margin: 0;
  color: var(--el-text-color-regular);
}
</style>
```

## 设计原则

### 1. 语义化使用

- Primary：主要操作和重要信息
- Success：成功状态和正面反馈
- Warning：警告信息和需要注意的内容
- Danger：错误状态和危险操作
- Info：一般信息和中性内容

### 2. 对比度和可读性

- 确保文字和背景有足够的对比度
- 遵循 WCAG 无障碍设计标准
- 考虑色盲用户的使用体验

### 3. 一致性

- 在整个应用中保持颜色使用的一致性
- 使用 Element Plus 提供的标准颜色变量
- 避免随意创建新的颜色值

### 4. 层次结构

- 使用颜色的深浅变化创建视觉层次
- 重要内容使用更鲜明的颜色
- 次要内容使用较淡的颜色

## 实践练习

### 练习 1：颜色系统应用

基于 Element Plus 颜色系统创建界面：

1. 创建状态指示组件
2. 实现主题色彩的应用
3. 设计颜色搭配方案
4. 确保颜色的语义化使用

### 练习 2：自定义主题

创建自定义的颜色主题：

1. 定义品牌色彩
2. 扩展颜色变量系统
3. 实现主题切换功能
4. 适配暗色模式

### 练习 3：无障碍设计

确保颜色使用的无障碍性：

1. 检查颜色对比度
2. 提供非颜色的状态指示
3. 测试色盲友好性
4. 实现高对比度模式

## 学习资源

### 官方文档

- [Element Plus Color 色彩](https://element-plus.org/zh-CN/component/color.html)
- [Element Plus 设计规范](https://element-plus.org/zh-CN/guide/design.html)

### 设计指南

- [Material Design 颜色指南](https://material.io/design/color/)
- [Ant Design 色彩设计](https://ant.design/docs/spec/colors-cn)
- [颜色理论基础](https://www.interaction-design.org/literature/topics/color-theory)

### 相关技术

- [CSS 颜色值](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value)
- [CSS 变量使用](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [WCAG 无障碍标准](https://www.w3.org/WAI/WCAG21/quickref/)

## 作业

### 基础作业

1. **颜色系统练习**
   - 创建包含所有颜色类型的展示页面
   - 实现颜色的动态效果
   - 应用颜色创建视觉层次

2. **状态指示设计**
   - 使用颜色设计状态指示器
   - 创建进度条和状态卡片
   - 实现颜色的语义化应用

### 进阶作业

1. **主题系统开发**
   - 创建完整的主题切换系统
   - 实现多套颜色主题
   - 保存用户的主题偏好

2. **响应式颜色设计**
   - 适配不同设备的颜色显示
   - 实现自适应的颜色方案
   - 优化移动端的颜色体验

### 挑战作业

1. **品牌化颜色系统**
   - 基于品牌色彩扩展颜色系统
   - 创建独特的视觉风格
   - 实现品牌一致性

2. **无障碍颜色方案**
   - 设计符合无障碍标准的颜色方案
   - 实现高对比度模式
   - 提供色盲友好的替代方案

## 总结

Color 色彩是用户界面设计的重要组成部分，通过合理使用 Element Plus 的颜色系统，可以创建具有良好视觉层次和用户体验的界面。掌握颜色的语义化使用、对比度控制和主题系统，能够帮助我们构建专业、一致的设计系统。