# Splitter Component

## Learning Objectives

Through this chapter, you will master:
- Basic concepts and use cases of the Splitter component
- Implementation of horizontal and vertical split layouts
- Configuration and use of collapsible panels
- Panel size control and drag functionality
- Event handling and API usage for split panels
- Practical application scenarios and best practices

## Basic Usage

The Splitter component can divide an area horizontally or vertically, allowing free dragging to adjust the size of each area. If no default size is provided, it will automatically distribute space evenly.

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <template #pane-1>
        <div class="panel-content">Panel 1</div>
      </template>
      <template #pane-2>
        <div class="panel-content">Panel 2</div>
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

## Vertical Layout

Use the `layout="vertical"` attribute to create a vertically oriented split panel.

```vue
<template>
  <div class="demo-splitter">
    <el-splitter layout="vertical">
      <template #pane-1>
        <div class="panel-content">Top Panel</div>
      </template>
      <template #pane-2>
        <div class="panel-content">Bottom Panel</div>
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

## Collapsible Panels

Configure the `collapsible` attribute to provide quick collapse functionality. You can use the `min` attribute to prevent expansion through dragging after collapse.

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <el-splitter-pane size="30%" min="20%" collapsible>
        <div class="panel-content">Collapsible Panel</div>
      </el-splitter-pane>
      <el-splitter-pane>
        <div class="panel-content">Main Content Area</div>
      </el-splitter-pane>
      <el-splitter-pane size="25%" min="15%" collapsible>
        <div class="panel-content">Right Panel</div>
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

## Disable Dragging

When any panel is set with `resizable="false"`, the drag functionality will be disabled.

```vue
<template>
  <div class="demo-splitter">
    <el-splitter>
      <el-splitter-pane size="30%" :resizable="false">
        <div class="panel-content">Dragging Disabled</div>
      </el-splitter-pane>
      <el-splitter-pane>
        <div class="panel-content">Normal Panel</div>
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

## Panel Size Control

Use `v-model:size` to get and control the size of panels.

```vue
<template>
  <div class="demo-container">
    <div class="size-display">
      <p>Left Panel Size: {{ leftPanelSize }}</p>
      <p>Right Panel Size: {{ rightPanelSize }}</p>
    </div>
    
    <div class="demo-splitter">
      <el-splitter>
        <el-splitter-pane v-model:size="leftPanelSize">
          <div class="panel-content">Left Panel</div>
        </el-splitter-pane>
        <el-splitter-pane v-model:size="rightPanelSize">
          <div class="panel-content">Right Panel</div>
        </el-splitter-pane>
      </el-splitter>
    </div>
    
    <div class="controls">
      <el-button @click="resetSize">Reset Size</el-button>
      <el-button @click="setCustomSize">Set Custom Size</el-button>
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

## Advanced Splitter Applications

### Multi-Panel Layout

Create complex multi-panel layouts suitable for IDEs or complex application interfaces.

```vue
<template>
  <div class="ide-layout">
    <el-splitter layout="vertical">
      <!-- Top Toolbar -->
      <el-splitter-pane size="60px" :resizable="false">
        <div class="toolbar">
          <h3>Toolbar</h3>
        </div>
      </el-splitter-pane>
      
      <!-- Main Content Area -->
      <el-splitter-pane>
        <el-splitter>
          <!-- Left Sidebar -->
          <el-splitter-pane size="250px" min="200px" max="400px" collapsible>
            <div class="sidebar">
              <h4>File Explorer</h4>
              <ul>
                <li>📁 src</li>
                <li>📁 components</li>
                <li>📁 views</li>
                <li>📄 App.vue</li>
              </ul>
            </div>
          </el-splitter-pane>
          
          <!-- Middle Editor Area -->
          <el-splitter-pane>
            <el-splitter layout="vertical">
              <!-- Editor -->
              <el-splitter-pane>
                <div class="editor">
                  <h4>Code Editor</h4>
                  <pre><code>&lt;template&gt;
  &lt;div class="hello"&gt;
    &lt;h1&gt;{{ msg }}&lt;/h1&gt;
  &lt;/div&gt;
&lt;/template&gt;</code></pre>
                </div>
              </el-splitter-pane>
              
              <!-- Bottom Console -->
              <el-splitter-pane size="150px" min="100px" collapsible>
                <div class="console">
                  <h4>Console</h4>
                  <p>$ npm run dev</p>
                  <p>✓ Compilation successful</p>
                </div>
              </el-splitter-pane>
            </el-splitter>
          </el-splitter-pane>
          
          <!-- Right Properties Panel -->
          <el-splitter-pane size="300px" min="250px" collapsible>
            <div class="properties">
              <h4>Properties Panel</h4>
              <div class="property-item">
                <label>Width:</label>
                <input type="text" value="100%" />
              </div>
              <div class="property-item">
                <label>Height:</label>
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

### Event Handling

Monitor various events of the split panel to implement richer interaction features.

```vue
<template>
  <div class="event-demo">
    <div class="event-log">
      <h4>Event Log:</h4>
      <div class="log-content">
        <p v-for="(log, index) in eventLogs" :key="index" :class="log.type">
          {{ log.message }}
        </p>
      </div>
      <el-button @click="clearLogs" size="small">Clear Logs</el-button>
    </div>
    
    <div class="demo-splitter">
      <el-splitter
        @resize-start="onResizeStart"
        @resize="onResize"
        @resize-end="onResizeEnd"
        @collapse="onCollapse"
      >
        <el-splitter-pane size="40%" collapsible>
          <div class="panel-content">Left Panel (Collapsible)</div>
        </el-splitter-pane>
        <el-splitter-pane>
          <div class="panel-content">Right Panel</div>
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
  
  // Limit log count
  if (eventLogs.value.length > 10) {
    eventLogs.value.pop()
  }
}

const onResizeStart = (index) => {
  addLog(`Started resizing panel - Drag bar index: ${index}`, 'start')
}

const onResize = (index) => {
  addLog(`Resizing panel - Drag bar index: ${index}`, 'resize')
}

const onResizeEnd = (index) => {
  addLog(`Panel resize completed - Drag bar index: ${index}`, 'end')
}

const onCollapse = (index) => {
  addLog(`Panel collapsed - Drag bar index: ${index}`, 'collapse')
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

## Comprehensive Application Example

### Document Editor Layout

Create an interface layout similar to a document editor.

```vue
<template>
  <div class="document-editor">
    <el-splitter layout="vertical">
      <!-- Top Menu Bar -->
      <el-splitter-pane size="50px" :resizable="false">
        <div class="menu-bar">
          <el-button-group>
            <el-button size="small" icon="Document">New</el-button>
            <el-button size="small" icon="FolderOpened">Open</el-button>
            <el-button size="small" icon="Download">Save</el-button>
          </el-button-group>
        </div>
      </el-splitter-pane>
      
      <!-- Main Content Area -->
      <el-splitter-pane>
        <el-splitter>
          <!-- Document Outline -->
          <el-splitter-pane size="250px" min="200px" collapsible>
            <div class="outline-panel">
              <h4>Document Outline</h4>
              <div class="outline-tree">
                <div class="outline-item level-1">1. Introduction</div>
                <div class="outline-item level-2">1.1 Background</div>
                <div class="outline-item level-2">1.2 Objectives</div>
                <div class="outline-item level-1">2. Features</div>
                <div class="outline-item level-2">2.1 Basic Features</div>
                <div class="outline-item level-2">2.2 Advanced Features</div>
              </div>
            </div>
          </el-splitter-pane>
          
          <!-- Editing Area -->
          <el-splitter-pane>
            <el-splitter layout="vertical">
              <!-- Editor -->
              <el-splitter-pane>
                <div class="editor-panel">
                  <div class="editor-toolbar">
                    <el-button-group size="small">
                      <el-button icon="Bold">Bold</el-button>
                      <el-button icon="Italic">Italic</el-button>
                      <el-button icon="Underline">Underline</el-button>
                    </el-button-group>
                  </div>
                  <div class="editor-content">
                    <h2>Document Title</h2>
                    <p>This is the main content area of the document. You can write and edit document content here.</p>
                    <p>Supports rich text editing features, including <strong>bold</strong>, <em>italic</em>, and other formats.</p>
                  </div>
                </div>
              </el-splitter-pane>
              
              <!-- Status Bar -->
              <el-splitter-pane size="30px" :resizable="false">
                <div class="status-bar">
                  <span>Words: 156</span>
                  <span>Line: 12, Column: 8</span>
                  <span>Saved</span>
                </div>
              </el-splitter-pane>
            </el-splitter>
          </el-splitter-pane>
          
          <!-- Properties Panel -->
          <el-splitter-pane size="280px" min="250px" collapsible>
            <div class="properties-panel">
              <h4>Document Properties</h4>
              <div class="property-group">
                <h5>Basic Information</h5>
                <div class="property-item">
                  <label>Title:</label>
                  <el-input size="small" value="My Document" />
                </div>
                <div class="property-item">
                  <label>Author:</label>
                  <el-input size="small" value="John Doe" />
                </div>
                <div class="property-item">
                  <label>Created:</label>
                  <span>2024-01-15</span>
                </div>
              </div>
              
              <div class="property-group">
                <h5>Format Settings</h5>
                <div class="property-item">
                  <label>Font:</label>
                  <el-select size="small" value="Arial">
                    <el-option label="Arial" value="Arial" />
                    <el-option label="Times New Roman" value="Times New Roman" />
                  </el-select>
                </div>
                <div class="property-item">
                  <label>Size:</label>
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

## Practice Exercises

1. **Basic Exercise**: Create a simple two-column layout with a navigation menu on the left and content area on the right

2. **Intermediate Exercise**: Implement a three-column layout for an admin interface, including a sidebar, main content area, and properties panel

3. **Advanced Exercise**: Create a complex IDE-like layout with multiple collapsible panels and nested splitters

4. **Comprehensive Exercise**: Implement an online code editor interface with a file browser, editor, console, and preview panel

## Design Principles

1. **Reasonable Default Sizes**: Set appropriate initial sizes and min/max limits for panels
2. **User Experience First**: Provide intuitive drag feedback and collapse functionality
3. **Responsive Design**: Maintain good layout across different screen sizes
4. **Performance Considerations**: Avoid frequent size calculations and DOM operations
5. **Accessibility**: Ensure keyboard navigation and screen reader support

## API Reference

### Splitter Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| layout | Direction of the split panel | `'horizontal' \| 'vertical'` | `'horizontal'` |

### Splitter Events

| Event Name | Description | Parameters |
|--------|------|------|
| resize-start | Triggered when panel resizing starts | `(index: number)` |
| resize | Triggered during panel resizing | `(index: number)` |
| resize-end | Triggered when panel resizing ends | `(index: number)` |
| collapse | Triggered when a panel is collapsed | `(index: number)` |

### SplitterPane Attributes

| Parameter | Description | Type | Default |
|------|------|------|--------|
| size / v-model:size | Panel size (pixels or percentage) | `string \| number` | — |
| min | Minimum panel size (pixels or percentage) | `string \| number` | — |
| max | Maximum panel size (pixels or percentage) | `string \| number` | — |
| resizable | Whether the panel can be resized | `boolean` | `true` |
| collapsible | Whether the panel can be collapsed | `boolean` | `false` |

### SplitterPane Events

| Event Name | Description | Parameters |
|--------|------|------|
| update:size | Triggered when panel size changes | `(size: string \| number)` |

### SplitterPane Slots

| Slot Name | Description |
|--------|------|
| default | Default content of the panel |
| start-collapsible | Custom content for the start collapse button |
| end-collapsible | Custom content for the end collapse button |

## Learning Resources

- [Element Plus Splitter Official Documentation](https://element-plus.org/en-US/component/splitter.html)
- [CSS Grid Layout Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Complete Guide to Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)

## Assignments

1. Create an email client interface with an email list, email content, and sidebar
2. Implement a data analysis dashboard that supports dynamic adjustment of multiple chart panels
3. Design an online design tool interface with a toolbar, canvas, layer panel, and properties panel

## Summary

The Splitter component is an important tool for building complex interface layouts. By properly using its various features, you can create professional and user-friendly application interfaces. Mastering the techniques of using split panels is significant for developing modern web applications.