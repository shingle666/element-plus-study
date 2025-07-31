# Border 边框

## 学习目标

* 掌握 Element Plus 边框样式的应用
* 理解边框设计原则和最佳实践
* 学会使用边框创建视觉层次
* 掌握阴影效果的应用

## 知识点概览

### 1. 边框样式

Element Plus 提供了统一的边框样式规范：

```vue
<template>
  <div class="border-demo">
    <!-- 基础边框 -->
    <div class="demo-border">
      <div class="block border-base">基础边框</div>
      <div class="block border-light">浅色边框</div>
      <div class="block border-lighter">更浅边框</div>
      <div class="block border-extra-light">极浅边框</div>
    </div>
    
    <!-- 圆角边框 -->
    <div class="demo-radius">
      <div class="block radius-base">基础圆角</div>
      <div class="block radius-small">小圆角</div>
      <div class="block radius-round">圆形</div>
      <div class="block radius-circle">圆</div>
    </div>
  </div>
</template>

<style scoped>
.border-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-border,
.demo-radius {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.block {
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
}

/* 边框样式 */
.border-base {
  border: 1px solid var(--el-border-color);
}

.border-light {
  border: 1px solid var(--el-border-color-light);
}

.border-lighter {
  border: 1px solid var(--el-border-color-lighter);
}

.border-extra-light {
  border: 1px solid var(--el-border-color-extra-light);
}

/* 圆角样式 */
.radius-base {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.radius-small {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-small);
}

.radius-round {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-round);
}

.radius-circle {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-circle);
  width: 60px;
  height: 60px;
}
</style>
```

### 2. 阴影效果

```vue
<template>
  <div class="shadow-demo">
    <div class="block shadow-base">基础阴影</div>
    <div class="block shadow-light">浅色阴影</div>
    <div class="block shadow-lighter">更浅阴影</div>
    <div class="block shadow-dark">深色阴影</div>
  </div>
</template>

<style scoped>
.shadow-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.block {
  width: 120px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
}

.shadow-base {
  box-shadow: var(--el-box-shadow);
}

.shadow-light {
  box-shadow: var(--el-box-shadow-light);
}

.shadow-lighter {
  box-shadow: var(--el-box-shadow-lighter);
}

.shadow-dark {
  box-shadow: var(--el-box-shadow-dark);
}
</style>
```

### 3. 边框变量系统

Element Plus 提供了完整的边框变量系统：

#### 3.1 边框颜色变量

```css
/* 边框颜色 */
--el-border-color-darker: #CDD0D6;
--el-border-color-dark: #D4D7DE;
--el-border-color: #DCDFE6;
--el-border-color-light: #E4E7ED;
--el-border-color-lighter: #EBEEF5;
--el-border-color-extra-light: #F2F6FC;
```

#### 3.2 圆角变量

```css
/* 圆角 */
--el-border-radius-base: 4px;
--el-border-radius-small: 2px;
--el-border-radius-round: 20px;
--el-border-radius-circle: 100%;
```

#### 3.3 阴影变量

```css
/* 阴影 */
--el-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
--el-box-shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
--el-box-shadow-lighter: 0 2px 4px rgba(0, 0, 0, 0.12);
--el-box-shadow-dark: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06);
```

### 4. 实际应用示例

#### 4.1 卡片组件边框设计

```vue
<template>
  <div class="card-examples">
    <div class="card basic-card">
      <h4>基础卡片</h4>
      <p>使用基础边框的简单卡片</p>
    </div>
    
    <div class="card elevated-card">
      <h4>提升卡片</h4>
      <p>使用阴影效果的卡片</p>
    </div>
    
    <div class="card rounded-card">
      <h4>圆角卡片</h4>
      <p>使用圆角边框的卡片</p>
    </div>
    
    <div class="card interactive-card">
      <h4>交互卡片</h4>
      <p>悬停时有边框变化的卡片</p>
    </div>
  </div>
</template>

<style scoped>
.card-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  padding: 20px;
  background-color: var(--el-bg-color);
  transition: all 0.3s ease;
}

.basic-card {
  border: 1px solid var(--el-border-color);
}

.elevated-card {
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
}

.rounded-card {
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-round);
}

.interactive-card {
  border: 2px solid var(--el-border-color-lighter);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
}

.interactive-card:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--el-box-shadow);
  transform: translateY(-2px);
}

.card h4 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
}

.card p {
  margin: 0;
  color: var(--el-text-color-regular);
}
</style>
```

#### 4.2 表单边框设计

```vue
<template>
  <div class="form-border-demo">
    <div class="form-group">
      <label>基础输入框</label>
      <input class="input basic-input" placeholder="请输入内容" />
    </div>
    
    <div class="form-group">
      <label>聚焦输入框</label>
      <input class="input focus-input" placeholder="聚焦时边框变化" />
    </div>
    
    <div class="form-group">
      <label>错误状态输入框</label>
      <input class="input error-input" placeholder="错误状态" />
    </div>
    
    <div class="form-group">
      <label>成功状态输入框</label>
      <input class="input success-input" placeholder="成功状态" />
    </div>
  </div>
</template>

<style scoped>
.form-border-demo {
  max-width: 400px;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--el-border-radius-base);
  transition: all 0.3s ease;
  font-size: 14px;
  background-color: var(--el-bg-color);
}

.basic-input {
  border: 1px solid var(--el-border-color);
}

.focus-input {
  border: 1px solid var(--el-border-color);
}

.focus-input:focus {
  outline: none;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.error-input {
  border: 1px solid var(--el-color-danger);
}

.success-input {
  border: 1px solid var(--el-color-success);
}
</style>
```

## 设计原则

### 1. 层次结构

- 使用不同的边框粗细和颜色创建视觉层次
- 重要元素使用更明显的边框
- 次要元素使用较淡的边框

### 2. 一致性

- 在整个应用中保持边框样式的一致性
- 使用 Element Plus 提供的标准边框变量
- 避免随意创建新的边框样式

### 3. 功能性

- 边框应该有明确的功能目的
- 使用边框来分组相关内容
- 通过边框状态反馈用户交互

## 实践练习

### 练习 1：边框样式应用

创建不同边框样式的组件：

1. 实现基础边框、圆角边框和阴影效果
2. 创建交互式边框（悬停、聚焦状态）
3. 使用边框创建视觉分组
4. 实现响应式边框设计

### 练习 2：自定义边框组件

基于 Element Plus 边框系统创建自定义组件：

1. 设计一个信息卡片组件
2. 实现不同状态的边框样式
3. 添加动画过渡效果
4. 确保无障碍访问支持

### 练习 3：边框系统设计

设计完整的边框使用规范：

1. 定义边框使用场景
2. 创建边框样式指南
3. 实现边框组件库
4. 编写使用文档

## 学习资源

### 官方文档

- [Element Plus Border 边框](https://element-plus.org/zh-CN/component/border.html)
- [Element Plus 设计规范](https://element-plus.org/zh-CN/guide/design.html)

### 设计指南

- [Material Design 边框指南](https://material.io/design/environment/elevation.html)
- [CSS 边框属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border)
- [CSS 盒子模型](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Box_Model)

### 相关技术

- [CSS 变量使用](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS 阴影效果](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)
- [CSS 圆角属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)

## 作业

### 基础作业

1. **边框样式练习**
   - 创建包含所有边框类型的展示页面
   - 实现边框的动态效果
   - 应用边框创建视觉层次

2. **阴影效果应用**
   - 使用不同阴影创建深度感
   - 实现悬停状态的阴影变化
   - 创建立体的界面效果

### 进阶作业

1. **响应式边框设计**
   - 创建适应不同屏幕的边框样式
   - 实现边框的自适应行为
   - 优化移动端的边框显示

2. **边框动画效果**
   - 实现边框的动画过渡
   - 创建交互式的边框效果
   - 添加微交互细节

### 挑战作业

1. **自定义边框系统**
   - 扩展 Element Plus 边框系统
   - 创建新的边框样式和效果
   - 实现复杂的边框组合

2. **边框主题系统**
   - 构建可切换的边框主题
   - 实现暗色模式的边框适配
   - 创建品牌化的边框风格

## 总结

Border 边框是构建用户界面的重要元素，通过合理使用边框样式、圆角和阴影效果，可以创建清晰的视觉层次和良好的用户体验。掌握 Element Plus 的边框系统，能够帮助我们构建一致、美观的界面设计。