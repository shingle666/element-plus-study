# Splitter 分隔面板

## 学习目标

通过本章学习，你将掌握：
- Splitter 分隔面板的基本概念和使用场景
- 水平和垂直分隔布局的实现
- 可折叠面板的配置和使用
- 面板大小控制和拖拽功能
- 分隔面板的事件处理和API使用
- 实际项目中的应用场景和最佳实践

## 基础用法

Splitter 分隔面板可将区域水平或垂直分隔，并可自由拖动以调整各个区域的大小。如果未传入默认尺寸，将自动平均分配。

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <template #pane-1>
        <div class="panel-content">面板 1</div>
      </template>
      <template #pane-2>
        <div class="panel-content">面板 2</div>
      </template>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}
</style>
```

## 垂直布局

使用 `layout="vertical"` 属性可以创建垂直方向的分隔面板。

```vue
<template>
  <div class="demo-splitter">
    <el-splitter layout="vertical">
      <template #pane-1>
        <div class="panel-content">上面板</div>
      </template>
      <template #pane-2>
        <div class="panel-content">下面板</div>
      </template>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}
</style>
```

## 可折叠面板

配置 `collapsible` 属性可提供快速收缩功能。你可以使用 `min` 属性来防止折叠后通过拖拽进行扩展。

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <el-splitter-pane size="30%" min="20%" collapsible>
        <div class="panel-content">可折叠面板</div>
      </el-splitter-pane>
      <el-splitter-pane>
        <div class="panel-content">主内容区域</div>
      </el-splitter-pane>
      <el-splitter-pane size="25%" min="15%" collapsible>
        <div class="panel-content">右侧面板</div>
      </el-splitter-pane>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}
</style>
```

## 禁用拖动

当任一面板设置 `resizable="false"` 时，拖拽功能将被禁用。

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <el-splitter-pane size="30%" :resizable="false">
        <div class="panel-content">禁用拖拽</div>
      </el-splitter-pane>
      <el-splitter-pane>
        <div class="panel-content">正常面板</div>
      </el-splitter-pane>
    </el-splitter>
  </div>
</template>

<style scoped>
.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}
</style>
```

## 面板大小控制

使用 `v-model:size` 可以获取和控制面板的大小。

```vue
<template>
  <div class="demo-container">
    <div class="size-display">
      <p>左面板大小: {{ leftPanelSize }}</p>
      <p>右面板大小: {{ rightPanelSize }}</p>
    </div>
    
    <div class="demo-splitter">
      <el-splitter>
        <el-splitter-pane v-model:size="leftPanelSize">
          <div class="panel-content">左面板</div>
        </el-splitter-pane>
        <el-splitter-pane v-model:size="rightPanelSize">
          <div class="panel-content">右面板</div>
        </el-splitter-pane>
      </el-splitter>
    </div>
    
    <div class="controls">
      <el-button @click="resetSize">重置大小</el-button>
      <el-button @click="setCustomSize">设置自定义大小</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const leftPanelSize = ref('50%')
const rightPanelSize = ref('50%')

const resetSize = () => {
  leftPanelSize.value = '50%'
  rightPanelSize.value = '50%'
}

const setCustomSize = () => {
  leftPanelSize.value = '30%'
  rightPanelSize.value = '70%'
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.size-display {
  margin-bottom: 10px;
  padding: 10px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

.size-display p {
  margin: 5px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
  margin-bottom: 20px;
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}

.controls {
  display: flex;
  gap: 10px;
}
</style>
```

## 高级分隔面板应用

### 多面板布局

创建复杂的多面板布局，适用于IDE或复杂应用界面。

```vue
<template>
  <div class="ide-layout">
    <el-splitter layout="vertical">
      <!-- 顶部工具栏 -->
      <el-splitter-pane size="60px" :resizable="false">
        <div class="toolbar">
          <h3>工具栏</h3>
        </div>
      </el-splitter-pane>
      
      <!-- 主要内容区域 -->
      <el-splitter-pane>
        <el-splitter>
          <!-- 左侧边栏 -->
          <el-splitter-pane size="250px" min="200px" max="400px" collapsible>
            <div class="sidebar">
              <h4>文件浏览器</h4>
              <ul>
                <li>📁 src</li>
                <li>📁 components</li>
                <li>📁 views</li>
                <li>📄 App.vue</li>
              </ul>
            </div>
          </el-splitter-pane>
          
          <!-- 中间编辑区域 -->
          <el-splitter-pane>
            <el-splitter layout="vertical">
              <!-- 编辑器 -->
              <el-splitter-pane>
                <div class="editor">
                  <h4>代码编辑器</h4>
                  <pre><code>&lt;template&gt;
  &lt;div class="hello"&gt;
    &lt;h1&gt;{{ msg }}&lt;/h1&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
                </div>
              </el-splitter-pane>
              
              <!-- 底部控制台 -->
              <el-splitter-pane size="150px" min="100px" collapsible>
                <div class="console">
                  <h4>控制台</h4>
                  <p>$ npm run dev</p>
                  <p>✓ 编译成功</p>
                </div>
              </el-splitter-pane>
            </el-splitter>
          </el-splitter-pane>
          
          <!-- 右侧属性面板 -->
          <el-splitter-pane size="300px" min="250px" collapsible>
            <div class="properties">
              <h4>属性面板</h4>
              <div class="property-item">
                <label>宽度:</label>
                <input type="text" value="100%" />
              </div>
              <div class="property-item">
                <label>高度:</label>
                <input type="text" value="auto" />
              </div>
            </div>
          </el-splitter-pane>
        </el-splitter>
      </el-splitter-pane>
    </el-splitter>
  </div>
</template>

<style scoped>
.ide-layout {
  height: 600px;
  border: 1px solid var(--el-border-color);
}

.toolbar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: var(--el-color-primary-light-9);
  border-bottom: 1px solid var(--el-border-color);
}

.sidebar, .editor, .console, .properties {
  height: 100%;
  padding: 15px;
  background: var(--el-fill-color-light);
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.sidebar li {
  padding: 5px 0;
  cursor: pointer;
}

.sidebar li:hover {
  background: var(--el-fill-color);
}

.editor pre {
  background: var(--el-fill-color-darker);
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  overflow: auto;
}

.console {
  background: var(--el-fill-color-darker);
  color: var(--el-text-color-primary);
  font-family: monospace;
}

.property-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.property-item label {
  width: 60px;
  margin-right: 10px;
}

.property-item input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
</style>
```

### 事件处理

监听分隔面板的各种事件，实现更丰富的交互功能。

```vue
<template>
  <div class="event-demo">
    <div class="event-log">
      <h4>事件日志:</h4>
      <div class="log-content">
        <p v-for="(log, index) in eventLogs" :key="index" :class="log.type">
          {{ log.message }}
        </p>
      </div>
      <el-button @click="clearLogs" size="small">清空日志</el-button>
    </div>
    
    <div class="demo-splitter">
      <el-splitter
        @resize-start="onResizeStart"
        @resize="onResize"
        @resize-end="onResizeEnd"
        @collapse="onCollapse"
      >
        <el-splitter-pane size="40%" collapsible>
          <div class="panel-content">左面板 (可折叠)</div>
        </el-splitter-pane>
        <el-splitter-pane>
          <div class="panel-content">右面板</div>
        </el-splitter-pane>
      </el-splitter>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const eventLogs = ref([])

const addLog = (message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.unshift({
    message: `[${timestamp}] ${message}`,
    type
  })
  
  // 限制日志数量
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const onResizeStart = (index) => {
  addLog(`开始调整面板大小 - 拖拽条索引: ${index}`, 'start')
}

const onResize = (index) => {
  addLog(`正在调整面板大小 - 拖拽条索引: ${index}`, 'resize')
}

const onResizeEnd = (index) => {
  addLog(`面板大小调整完成 - 拖拽条索引: ${index}`, 'end')
}

const onCollapse = (index) => {
  addLog(`面板折叠 - 拖拽条索引: ${index}`, 'collapse')
}

const clearLogs = () => {
  eventLogs.value = []
}
</script>

<style scoped>
.event-demo {
  padding: 20px;
}

.event-log {
  margin-bottom: 20px;
  padding: 15px;
  background: var(--el-fill-color-extra-light);
  border-radius: 4px;
}

.log-content {
  height: 150px;
  overflow-y: auto;
  margin: 10px 0;
  padding: 10px;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.log-content p {
  margin: 2px 0;
  padding: 2px 4px;
  border-radius: 2px;
}

.log-content .start {
  color: var(--el-color-primary);
}

.log-content .resize {
  color: var(--el-color-warning);
}

.log-content .end {
  color: var(--el-color-success);
}

.log-content .collapse {
  color: var(--el-color-info);
}

.demo-splitter {
  height: 300px;
  border: 1px solid var(--el-border-color);
}

.panel-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
}
</style>
```

## 综合应用示例

### 文档编辑器布局

创建一个类似文档编辑器的界面布局。

```vue
<template>
  <div class="document-editor">
    <el-splitter layout="vertical">
      <!-- 顶部菜单栏 -->
      <el-splitter-pane size="50px" :resizable="false">
        <div class="menu-bar">
          <el-button-group>
            <el-button size="small" icon="Document">新建</el-button>
            <el-button size="small" icon="FolderOpened">打开</el-button>
            <el-button size="small" icon="Download">保存</el-button>
          </el-button-group>
        </div>
      </el-splitter-pane>
      
      <!-- 主要内容区域 -->
      <el-splitter-pane>
        <el-splitter>
          <!-- 文档大纲 -->
          <el-splitter-pane size="250px" min="200px" collapsible>
            <div class="outline-panel">
              <h4>文档大纲</h4>
              <div class="outline-tree">
                <div class="outline-item level-1">1. 介绍</div>
                <div class="outline-item level-2">1.1 背景</div>
                <div class="outline-item level-2">1.2 目标</div>
                <div class="outline-item level-1">2. 功能特性</div>
                <div class="outline-item level-2">2.1 基础功能</div>
                <div class="outline-item level-2">2.2 高级功能</div>
              </div>
            </div>
          </el-splitter-pane>
          
          <!-- 编辑区域 -->
          <el-splitter-pane>
            <el-splitter layout="vertical">
              <!-- 编辑器 -->
              <el-splitter-pane>
                <div class="editor-panel">
                  <div class="editor-toolbar">
                    <el-button-group size="small">
                      <el-button icon="Bold">粗体</el-button>
                      <el-button icon="Italic">斜体</el-button>
                      <el-button icon="Underline">下划线</el-button>
                    </el-button-group>
                  </div>
                  <div class="editor-content">
                    <h2>文档标题</h2>
                    <p>这里是文档的主要内容区域。你可以在这里编写和编辑文档内容。</p>
                    <p>支持富文本编辑功能，包括<strong>粗体</strong>、<em>斜体</em>等格式。</p>
                  </div>
                </div>
              </el-splitter-pane>
              
              <!-- 状态栏 -->
              <el-splitter-pane size="30px" :resizable="false">
                <div class="status-bar">
                  <span>字数: 156</span>
                  <span>行: 12, 列: 8</span>
                  <span>已保存</span>
                </div>
              </el-splitter-pane>
            </el-splitter>
          </el-splitter-pane>
          
          <!-- 属性面板 -->
          <el-splitter-pane size="280px" min="250px" collapsible>
            <div class="properties-panel">
              <h4>文档属性</h4>
              <div class="property-group">
                <h5>基本信息</h5>
                <div class="property-item">
                  <label>标题:</label>
                  <el-input size="small" value="我的文档" />
                </div>
                <div class="property-item">
                  <label>作者:</label>
                  <el-input size="small" value="张三" />
                </div>
                <div class="property-item">
                  <label>创建时间:</label>
                  <span>2024-01-15</span>
                </div>
              </div>
              
              <div class="property-group">
                <h5>格式设置</h5>
                <div class="property-item">
                  <label>字体:</label>
                  <el-select size="small" value="Arial">
                    <el-option label="Arial" value="Arial" />
                    <el-option label="宋体" value="SimSun" />
                  </el-select>
                </div>
                <div class="property-item">
                  <label>字号:</label>
                  <el-input-number size="small" :value="14" :min="8" :max="72" />
                </div>
              </div>
            </div>
          </el-splitter-pane>
        </el-splitter>
      </el-splitter-pane>
    </el-splitter>
  </div>
</template>

<style scoped>
.document-editor {
  height: 700px;
  border: 1px solid var(--el-border-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.menu-bar {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color);
}

.outline-panel {
  height: 100%;
  padding: 15px;
  background: var(--el-fill-color-light);
}

.outline-tree {
  margin-top: 10px;
}

.outline-item {
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  padding-left: 8px;
}

.outline-item:hover {
  background: var(--el-fill-color);
}

.outline-item.level-1 {
  font-weight: bold;
  color: var(--el-color-primary);
}

.outline-item.level-2 {
  padding-left: 24px;
  color: var(--el-text-color-regular);
}

.editor-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  padding: 10px 15px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color);
}

.editor-content {
  flex: 1;
  padding: 20px;
  background: white;
  overflow-y: auto;
}

.editor-content h2 {
  margin-top: 0;
  color: var(--el-text-color-primary);
}

.editor-content p {
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.status-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: var(--el-fill-color-extra-light);
  border-top: 1px solid var(--el-border-color);
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.properties-panel {
  height: 100%;
  padding: 15px;
  background: var(--el-fill-color-light);
  overflow-y: auto;
}

.property-group {
  margin-bottom: 20px;
}

.property-group h5 {
  margin: 0 0 10px 0;
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.property-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.property-item label {
  width: 60px;
  margin-right: 10px;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.property-item .el-input,
.property-item .el-select,
.property-item .el-input-number {
  flex: 1;
}
</style>
```

## 实践练习

1. **基础练习**：创建一个简单的两栏布局，左侧显示导航菜单，右侧显示内容区域

2. **进阶练习**：实现一个三栏布局的管理后台界面，包含侧边栏、主内容区和属性面板

3. **高级练习**：创建一个类似IDE的复杂布局，支持多个可折叠面板和嵌套分隔

4. **综合练习**：实现一个在线代码编辑器界面，包含文件浏览器、编辑器、控制台和预览面板

## 设计原则

1. **合理的默认尺寸**：为面板设置合适的初始大小和最小/最大限制
2. **用户体验优先**：提供直观的拖拽反馈和折叠功能
3. **响应式设计**：在不同屏幕尺寸下保持良好的布局
4. **性能考虑**：避免频繁的尺寸计算和DOM操作
5. **可访问性**：确保键盘导航和屏幕阅读器支持

## API 参考

### Splitter Attributes

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| layout | 分隔面板的布局方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |

### Splitter Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| resize-start | 开始调整面板大小时触发 | `(index: number)` |
| resize | 调整面板大小时触发 | `(index: number)` |
| resize-end | 面板调整大小结束时触发 | `(index: number)` |
| collapse | 当面板折叠时触发 | `(index: number)` |

### SplitterPane Attributes

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| size / v-model:size | 面板大小(像素或百分比) | `string \| number` | — |
| min | 面板最小尺寸(像素或百分比) | `string \| number` | — |
| max | 面板的最大尺寸(像素或百分比) | `string \| number` | — |
| resizable | 是否可以调整面板大小 | `boolean` | `true` |
| collapsible | 面板是否可折叠 | `boolean` | `false` |

### SplitterPane Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:size | 当面板大小改变时触发 | `(size: string \| number)` |

### SplitterPane Slots

| 插槽名 | 说明 |
|--------|------|
| default | 面板的默认内容 |
| start-collapsible | 自定义起始折叠按钮的内容 |
| end-collapsible | 结束可折叠按钮的自定义内容 |

## 学习资源

- [Element Plus Splitter 官方文档](https://element-plus.org/zh-CN/component/splitter.html)
- [CSS Grid 布局指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox 布局完全指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout)

## 作业

1. 创建一个邮件客户端界面，包含邮件列表、邮件内容和侧边栏
2. 实现一个数据分析仪表板，支持多个图表面板的动态调整
3. 设计一个在线设计工具界面，包含工具栏、画布、图层面板和属性面板

## 总结

Splitter 分隔面板是构建复杂界面布局的重要组件，通过合理使用其各种特性，可以创建出专业且用户友好的应用界面。掌握分隔面板的使用技巧，对于开发现代Web应用具有重要意义。