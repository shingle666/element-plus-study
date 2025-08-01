# Button 按钮组件

按钮用于开始一个即时操作。

## 学习目标

* 掌握 Element Plus Button 组件的各种类型和属性
* 了解按钮的基本设计原则和使用场景
* 学习按钮的状态管理和交互效果
* 掌握按钮组合和布局技巧

## 基础用法

使用 `type`、`plain`、`round` 和 `circle` 来定义按钮的样式。

<div class="demo-block">
  <div class="demo-title">基础按钮</div>
  <div class="demo-description">使用 type 属性来定义按钮的类型。</div>
  <div class="demo-content">
    <el-button>默认按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="button-demo">
    <el-button>默认按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
  </div>
</template>

<style scoped>
.button-demo {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
```

## 朴素按钮

朴素按钮同样设置了 `type` 属性，它们的表现与常规按钮不同，边框和文字颜色都是彩色的。

<div class="demo-block">
  <div class="demo-title">朴素按钮</div>
  <div class="demo-content">
    <el-button plain>朴素按钮</el-button>
    <el-button type="primary" plain>主要按钮</el-button>
    <el-button type="success" plain>成功按钮</el-button>
    <el-button type="info" plain>信息按钮</el-button>
    <el-button type="warning" plain>警告按钮</el-button>
    <el-button type="danger" plain>危险按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="plain-button-demo">
    <el-button plain>朴素按钮</el-button>
    <el-button type="primary" plain>主要按钮</el-button>
    <el-button type="success" plain>成功按钮</el-button>
    <el-button type="info" plain>信息按钮</el-button>
    <el-button type="warning" plain>警告按钮</el-button>
    <el-button type="danger" plain>危险按钮</el-button>
  </div>
</template>
```

## 圆角按钮

通过 `round` 属性来确定按钮是否为圆角按钮。

<div class="demo-block">
  <div class="demo-title">圆角按钮</div>
  <div class="demo-content">
    <el-button round>圆角按钮</el-button>
    <el-button type="primary" round>主要按钮</el-button>
    <el-button type="success" round>成功按钮</el-button>
    <el-button type="info" round>信息按钮</el-button>
    <el-button type="warning" round>警告按钮</el-button>
    <el-button type="danger" round>危险按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="round-button-demo">
    <el-button round>圆角按钮</el-button>
    <el-button type="primary" round>主要按钮</el-button>
    <el-button type="success" round>成功按钮</el-button>
    <el-button type="info" round>信息按钮</el-button>
    <el-button type="warning" round>警告按钮</el-button>
    <el-button type="danger" round>危险按钮</el-button>
  </div>
</template>
```

## 图标按钮

使用图标为按钮添加更多的含义。你也可以单独使用图标不添加文字来节省显示区域占用。

<div class="demo-block">
  <div class="demo-title">图标按钮</div>
  <div class="demo-content">
    <!-- 带图标的按钮 -->
    <el-button type="primary" :icon="Edit">编辑</el-button>
    <el-button type="primary" :icon="Share">分享</el-button>
    <el-button type="primary" :icon="Delete">删除</el-button>
    <el-button type="primary" :icon="Search">搜索</el-button>
    <br><br>
    <!-- 只有图标的按钮 -->
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </div>
</div>

```vue
<template>
  <div class="icon-button-demo">
    <!-- 带图标的按钮 -->
    <el-button type="primary" :icon="Edit">编辑</el-button>
    <el-button type="primary" :icon="Share">分享</el-button>
    <el-button type="primary" :icon="Delete">删除</el-button>
    <el-button type="primary" :icon="Search">搜索</el-button>
    
    <!-- 只有图标的按钮 -->
    <el-button type="primary" :icon="Edit" circle />
    <el-button type="success" :icon="Check" circle />
    <el-button type="info" :icon="Message" circle />
    <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle />
  </div>
</template>

<script setup>
import {
  Edit,
  Share,
  Delete,
  Search,
  Check,
  Message,
  Star
} from '@element-plus/icons-vue'
</script>

<style scoped>
.button-group-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
```

## 按钮尺寸

Button 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

<div class="demo-block">
  <div class="demo-title">按钮尺寸</div>
  <div class="demo-content">
    <el-row style="margin-bottom: 20px;">
      <el-button size="large">大型按钮</el-button>
      <el-button>默认按钮</el-button>
      <el-button size="small">小型按钮</el-button>
    </el-row>
    <el-row style="margin-bottom: 20px;">
      <el-button size="large" round>大型按钮</el-button>
      <el-button round>默认按钮</el-button>
      <el-button size="small" round>小型按钮</el-button>
    </el-row>
    <el-row>
      <el-button size="large" :icon="Search" circle />
      <el-button :icon="Search" circle />
      <el-button size="small" :icon="Search" circle />
    </el-row>
  </div>
</div>

```vue
<template>
  <div class="size-button-demo">
    <el-row>
      <el-button size="large">大型按钮</el-button>
      <el-button>默认按钮</el-button>
      <el-button size="small">小型按钮</el-button>
    </el-row>
    <el-row>
      <el-button size="large" round>大型按钮</el-button>
      <el-button round>默认按钮</el-button>
      <el-button size="small" round>小型按钮</el-button>
    </el-row>
    <el-row>
      <el-button size="large" :icon="Search" circle />
      <el-button :icon="Search" circle />
      <el-button size="small" :icon="Search" circle />
    </el-row>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
</script>

<style scoped>
.size-button-demo .el-row {
  margin-bottom: 20px;
}
.size-button-demo .el-row:last-child {
  margin-bottom: 0;
}
</style>
```

## 禁用状态

你可以使用 `disabled` 属性来定义按钮是否被禁用。

<div class="demo-block">
  <div class="demo-title">禁用状态</div>
  <div class="demo-content">
    <el-row style="margin-bottom: 20px;">
      <el-button disabled>默认按钮</el-button>
      <el-button type="primary" disabled>主要按钮</el-button>
      <el-button type="success" disabled>成功按钮</el-button>
      <el-button type="info" disabled>信息按钮</el-button>
      <el-button type="warning" disabled>警告按钮</el-button>
      <el-button type="danger" disabled>危险按钮</el-button>
    </el-row>
    <el-row>
      <el-button plain disabled>朴素按钮</el-button>
      <el-button type="primary" plain disabled>主要按钮</el-button>
      <el-button type="success" plain disabled>成功按钮</el-button>
      <el-button type="info" plain disabled>信息按钮</el-button>
      <el-button type="warning" plain disabled>警告按钮</el-button>
      <el-button type="danger" plain disabled>危险按钮</el-button>
    </el-row>
  </div>
</div>

```vue
<template>
  <div class="disabled-button-demo">
    <el-row>
      <el-button disabled>默认按钮</el-button>
      <el-button type="primary" disabled>主要按钮</el-button>
      <el-button type="success" disabled>成功按钮</el-button>
      <el-button type="info" disabled>信息按钮</el-button>
      <el-button type="warning" disabled>警告按钮</el-button>
      <el-button type="danger" disabled>危险按钮</el-button>
    </el-row>
    
    <el-row>
      <el-button plain disabled>朴素按钮</el-button>
      <el-button type="primary" plain disabled>主要按钮</el-button>
      <el-button type="success" plain disabled>成功按钮</el-button>
      <el-button type="info" plain disabled>信息按钮</el-button>
      <el-button type="warning" plain disabled>警告按钮</el-button>
      <el-button type="danger" plain disabled>危险按钮</el-button>
    </el-row>
  </div>
</template>
```

## 链接按钮

链接按钮用于创建类似链接的按钮样式。

<div class="demo-block">
  <div class="demo-title">链接按钮</div>
  <div class="demo-content">
    <el-button type="primary" link>基础链接按钮</el-button>
    <el-button type="primary" link disabled>禁用链接按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="link-button-demo">
    <el-button type="primary" link>基础链接按钮</el-button>
    <el-button type="primary" link disabled>禁用链接按钮</el-button>
  </div>
</template>
```

## 文字按钮

没有边框和背景色的按钮。

<div class="demo-block">
  <div class="demo-title">文字按钮</div>
  <div class="demo-content">
    <el-button type="primary" text>文字按钮</el-button>
    <el-button type="primary" text bg>背景文字按钮</el-button>
    <el-button type="primary" text disabled>禁用文字按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="text-button-demo">
    <el-button type="primary" text>文字按钮</el-button>
    <el-button type="primary" text bg>背景文字按钮</el-button>
    <el-button type="primary" text disabled>禁用文字按钮</el-button>
  </div>
</template>
```

## 加载状态

点击按钮来加载数据，并向用户反馈加载状态。

<div class="demo-block">
  <div class="demo-title">加载状态</div>
  <div class="demo-content">
    <el-button type="primary" loading>加载中</el-button>
    <el-button type="primary" :loading="loading" @click="handleClick">
      点击加载
    </el-button>
  </div>
</div>

```vue
<template>
  <div class="loading-button-demo">
    <el-button type="primary" loading>加载中</el-button>
    <el-button type="primary" :loading="loading" @click="handleClick">
      点击加载
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
```

## 自定义颜色

您可以自定义按钮的颜色，我们将自动计算按钮处于 hover 和 active 状态时的颜色。

<div class="demo-block">
  <div class="demo-title">自定义颜色</div>
  <div class="demo-content">
    <el-button color="#95d475">#95d475</el-button>
    <el-button color="#95d475" plain>#95d475</el-button>
    <el-button color="#95d475" round plain>圆角按钮</el-button>
    <el-button color="#95d475" round>圆角按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="custom-color-demo">
    <el-button color="#95d475">#95d475</el-button>
    <el-button color="#95d475" plain>#95d475</el-button>
    <el-button color="#95d475" round plain>圆角按钮</el-button>
    <el-button color="#95d475" round>圆角按钮</el-button>
  </div>
</template>
```

## 自定义元素标签

您可以自定义元素标签，例如按钮、div、路由链接、nuxt链接。

<div class="demo-block">
  <div class="demo-title">自定义元素标签</div>
  <div class="demo-content">
    <el-button tag="div" role="button" tabindex="0">div</el-button>
    <el-button tag="span" role="button" tabindex="0">span</el-button>
  </div>
</div>

```vue
<template>
  <div class="custom-tag-demo">
    <el-button tag="div" role="button" tabindex="0">div</el-button>
    <el-button tag="span" role="button" tabindex="0">span</el-button>
  </div>
</template>
```

## 自动插入空格

当按钮内容为两个中文字符时，可以自动在字符之间插入空格。

<div class="demo-block">
  <div class="demo-title">自动插入空格</div>
  <div class="demo-content">
    <el-button auto-insert-space>按钮</el-button>
    <el-button :auto-insert-space="false">按钮</el-button>
  </div>
</div>

```vue
<template>
  <div class="auto-space-demo">
    <el-button auto-insert-space>按钮</el-button>
    <el-button :auto-insert-space="false">按钮</el-button>
  </div>
</template>
```

## 按钮组

以按钮组的方式出现，常用于多项类似操作。

<div class="demo-block">
  <div class="demo-title">按钮组</div>
  <div class="demo-content">
    <el-button-group>
      <el-button type="primary" :icon="ArrowLeft">上一页</el-button>
      <el-button type="primary" :icon="ArrowRight">下一页</el-button>
    </el-button-group>
    <br><br>
    <el-button-group>
      <el-button type="primary" :icon="Edit" />
      <el-button type="primary" :icon="Share" />
      <el-button type="primary" :icon="Delete" />
    </el-button-group>
  </div>
</div>

```vue
<template>
  <div class="button-group-demo">
    <el-button-group>
      <el-button type="primary" :icon="ArrowLeft">上一页</el-button>
      <el-button type="primary" :icon="ArrowRight">下一页</el-button>
    </el-button-group>
    <br><br>
    <el-button-group>
      <el-button type="primary" :icon="Edit" />
      <el-button type="primary" :icon="Share" />
      <el-button type="primary" :icon="Delete" />
    </el-button-group>
  </div>
</template>

<script setup>
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Share,
  Delete
} from '@element-plus/icons-vue'
</script>

<style scoped>
.button-group-demo {
  display: flex;
  gap: 20px;
}
</style>
```

## 综合示例

### 按钮工具栏

<div class="demo-block">
  <div class="demo-title">按钮工具栏</div>
  <div class="demo-content">
    <div class="toolbar">
      <!-- 主要操作 -->
      <div class="toolbar-section">
        <el-button type="primary" :icon="Plus">新建</el-button>
        <el-button type="success" :icon="Upload">导入</el-button>
        <el-button type="warning" :icon="Download">导出</el-button>
      </div>
      <div class="toolbar-section">
        <el-button :icon="Refresh" circle />
        <el-button :icon="Setting" circle />
        <el-button :icon="More" circle />
      </div>
    </div>
    <div class="action-groups">
      <el-button-group>
        <el-button type="primary" :icon="Edit">编辑</el-button>
        <el-button type="primary" :icon="Share">分享</el-button>
        <el-button type="primary" :icon="Delete">删除</el-button>
      </el-button-group>
      <el-button-group>
        <el-button :icon="ZoomIn"></el-button>
        <el-button :icon="ZoomOut"></el-button>
        <el-button :icon="FullScreen"></el-button>
      </el-button-group>
  </div>
  </div>
</div>

### 状态指示器

<div class="demo-block">
  <div class="demo-title">状态指示器</div>
  <div class="demo-content">
    <div class="status-list">
      <div class="status-item">
        <div class="status-indicator success"></div>
        <span>运行中</span>
        <el-button size="small" type="success" text>查看</el-button>
      </div>
      <div class="status-item">
        <div class="status-indicator warning"></div>
        <span>警告</span>
        <el-button size="small" type="warning" text>处理</el-button>
      </div>
      <div class="status-item">
        <div class="status-indicator danger"></div>
        <span>错误</span>
        <el-button size="small" type="danger" text>修复</el-button>
      </div>
      <div class="status-item">
        <div class="status-indicator info"></div>
        <span>停止</span>
        <el-button size="small" type="info" text>启动</el-button>
      </div>
  </div>
  </div>
</div>

## Button API

### Button Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| size | 尺寸 | string | large / default / small | — |
| type | 类型 | string | primary / success / warning / danger / info | — |
| plain | 是否朴素按钮 | boolean | — | false |
| text ^(2.2.0) | 是否文字按钮 | boolean | — | false |
| bg ^(2.2.0) | 是否显示文字按钮背景颜色 | boolean | — | false |
| link ^(2.2.1) | 是否链接按钮 | boolean | — | false |
| round | 是否圆角按钮 | boolean | — | false |
| circle | 是否圆形按钮 | boolean | — | false |
| loading | 是否加载中状态 | boolean | — | false |
| loading-icon | 自定义加载中状态图标组件 | string / Component | — | Loading |
| disabled | 是否禁用状态 | boolean | — | false |
| icon | 图标组件 | string / Component | — | — |
| autofocus | 是否默认聚焦 | boolean | — | false |
| native-type | 原生 type 属性 | string | button / submit / reset | button |
| auto-insert-space | 自动在两个中文字符之间插入空格 | boolean | — | false |
| color | 自定义按钮颜色, 并自动计算 hover 和 active 触发后的颜色 | string | — | — |
| dark | dark 模式, 意味着自动设置 color 为 dark 模式的颜色 | boolean | — | false |
| tag ^(2.3.4) | 自定义元素标签 | string / Component | — | button |

### Button Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击时触发 | (evt: MouseEvent) |

### Button Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义默认内容 |
| loading | 自定义加载中组件 |
| icon | 自定义图标组件 |

### Button Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| ref | 按钮 html 元素 | Ref\<HTMLButtonElement\> |
| size | 按钮尺寸 | ComputedRef\<string\> |
| type | 按钮类型 | ComputedRef\<string\> |
| disabled | 按钮是否禁用 | ComputedRef\<boolean\> |
| shouldAddSpace | 是否在两个字符之间添加空格 | ComputedRef\<boolean\> |

#### Button Exposes 使用示例

通过模板引用可以访问按钮组件暴露的属性和方法：

```vue
<template>
  <div class="button-exposes-demo">
    <h3>Button Exposes 示例</h3>
    
    <!-- 按钮组件 -->
    <div class="button-section">
      <el-button 
        ref="primaryButtonRef"
        type="primary" 
        :size="buttonSize"
        :disabled="isDisabled"
        @click="handleButtonClick"
      >
        主要按钮
      </el-button>
      
      <el-button 
        ref="successButtonRef"
        type="success" 
        size="large"
        auto-insert-space
      >
        成功按钮
      </el-button>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <h4>控制面板</h4>
      <div class="control-item">
        <label>按钮尺寸：</label>
        <el-select v-model="buttonSize" style="width: 120px">
          <el-option label="Large" value="large" />
          <el-option label="Default" value="default" />
          <el-option label="Small" value="small" />
        </el-select>
      </div>
      
      <div class="control-item">
        <el-checkbox v-model="isDisabled">禁用按钮</el-checkbox>
      </div>
      
      <div class="control-item">
        <el-button @click="getButtonInfo">获取按钮信息</el-button>
        <el-button @click="focusButton">聚焦按钮</el-button>
      </div>
    </div>
    
    <!-- 信息显示 -->
    <div class="info-panel">
      <h4>按钮信息</h4>
      <div class="info-item">
        <strong>主要按钮尺寸：</strong> {{ primaryButtonInfo.size }}
      </div>
      <div class="info-item">
        <strong>主要按钮类型：</strong> {{ primaryButtonInfo.type }}
      </div>
      <div class="info-item">
        <strong>主要按钮禁用状态：</strong> {{ primaryButtonInfo.disabled }}
      </div>
      <div class="info-item">
        <strong>成功按钮是否添加空格：</strong> {{ successButtonInfo.shouldAddSpace }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

// 模板引用
const primaryButtonRef = ref()
const successButtonRef = ref()

// 响应式数据
const buttonSize = ref('default')
const isDisabled = ref(false)

// 按钮信息
const primaryButtonInfo = reactive({
  size: '',
  type: '',
  disabled: false
})

const successButtonInfo = reactive({
  shouldAddSpace: false
})

// 获取按钮信息
const getButtonInfo = () => {
  if (primaryButtonRef.value) {
    primaryButtonInfo.size = primaryButtonRef.value.size
    primaryButtonInfo.type = primaryButtonRef.value.type
    primaryButtonInfo.disabled = primaryButtonRef.value.disabled
  }
  
  if (successButtonRef.value) {
    successButtonInfo.shouldAddSpace = successButtonRef.value.shouldAddSpace
  }
}

// 聚焦按钮
const focusButton = async () => {
  await nextTick()
  if (primaryButtonRef.value?.ref) {
    primaryButtonRef.value.ref.focus()
  }
}

// 按钮点击事件
const handleButtonClick = () => {
  console.log('按钮被点击了')
  getButtonInfo() // 点击时自动更新信息
}

// 初始化信息
nextTick(() => {
  getButtonInfo()
})
</script>

<style scoped>
.button-exposes-demo {
  padding: 20px;
}

.button-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}

.button-section .el-button {
  margin-right: 10px;
}

.control-panel {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-lighter);
}

.control-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.control-item label {
  width: 80px;
  margin-right: 10px;
  font-weight: 500;
}

.control-item .el-button {
  margin-right: 10px;
}

.info-panel {
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-extra-light);
}

.info-item {
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}

.info-item strong {
  color: var(--el-color-primary);
}
</style>
```

#### 高级用法：动态按钮管理

```vue
<template>
  <div class="advanced-button-demo">
    <h3>动态按钮管理</h3>
    
    <!-- 动态按钮列表 -->
    <div class="button-list">
      <el-button
        v-for="(button, index) in buttons"
        :key="button.id"
        :ref="el => setButtonRef(el, index)"
        :type="button.type"
        :size="button.size"
        :disabled="button.disabled"
        :loading="button.loading"
        @click="handleDynamicButtonClick(button, index)"
      >
        {{ button.text }}
      </el-button>
    </div>
    
    <!-- 操作控制 -->
    <div class="operations">
      <el-button @click="addButton">添加按钮</el-button>
      <el-button @click="removeLastButton">移除最后一个</el-button>
      <el-button @click="toggleAllButtons">切换全部状态</el-button>
      <el-button @click="getAllButtonsInfo">获取所有按钮信息</el-button>
    </div>
    
    <!-- 按钮信息展示 -->
    <div class="buttons-info" v-if="buttonsInfo.length > 0">
      <h4>按钮信息列表</h4>
      <div 
        v-for="(info, index) in buttonsInfo" 
        :key="index"
        class="button-info-item"
      >
        <strong>按钮 {{ index + 1 }}:</strong>
        类型: {{ info.type }}, 
        尺寸: {{ info.size }}, 
        禁用: {{ info.disabled }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

// 按钮数据
const buttons = ref([
  { id: 1, text: '按钮 1', type: 'primary', size: 'default', disabled: false, loading: false },
  { id: 2, text: '按钮 2', type: 'success', size: 'default', disabled: false, loading: false },
  { id: 3, text: '按钮 3', type: 'warning', size: 'default', disabled: false, loading: false }
])

// 按钮引用数组
const buttonRefs = ref([])

// 按钮信息
const buttonsInfo = ref([])

// 设置按钮引用
const setButtonRef = (el, index) => {
  if (el) {
    buttonRefs.value[index] = el
  }
}

// 添加按钮
const addButton = () => {
  const newId = Math.max(...buttons.value.map(b => b.id)) + 1
  const types = ['primary', 'success', 'warning', 'danger', 'info']
  const randomType = types[Math.floor(Math.random() * types.length)]
  
  buttons.value.push({
    id: newId,
    text: `按钮 ${newId}`,
    type: randomType,
    size: 'default',
    disabled: false,
    loading: false
  })
}

// 移除最后一个按钮
const removeLastButton = () => {
  if (buttons.value.length > 1) {
    buttons.value.pop()
    buttonRefs.value.pop()
  }
}

// 切换所有按钮状态
const toggleAllButtons = () => {
  buttons.value.forEach(button => {
    button.disabled = !button.disabled
  })
}

// 动态按钮点击事件
const handleDynamicButtonClick = async (button, index) => {
  // 设置加载状态
  button.loading = true
  
  // 模拟异步操作
  setTimeout(() => {
    button.loading = false
    console.log(`点击了按钮: ${button.text}`)
  }, 1000)
  
  // 获取当前按钮信息
  await nextTick()
  if (buttonRefs.value[index]) {
    const buttonRef = buttonRefs.value[index]
    console.log('按钮信息:', {
      type: buttonRef.type,
      size: buttonRef.size,
      disabled: buttonRef.disabled
    })
  }
}

// 获取所有按钮信息
const getAllButtonsInfo = async () => {
  await nextTick()
  buttonsInfo.value = buttonRefs.value.map(buttonRef => {
    if (buttonRef) {
      return {
        type: buttonRef.type,
        size: buttonRef.size,
        disabled: buttonRef.disabled
      }
    }
    return null
  }).filter(Boolean)
}
</script>

<style scoped>
.advanced-button-demo {
  padding: 20px;
}

.button-list {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-bg-color);
}

.button-list .el-button {
  margin: 0 10px 10px 0;
}

.operations {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-lighter);
}

.operations .el-button {
  margin-right: 10px;
}

.buttons-info {
  padding: 15px;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-extra-light);
}

.button-info-item {
  margin-bottom: 8px;
  padding: 8px;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-small);
  color: var(--el-text-color-primary);
}

.button-info-item strong {
  color: var(--el-color-primary);
}
</style>
```

### ButtonGroup Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| size | 用于控制该按钮组内按钮的大小 | string | large / default / small | — |
| type | 用于控制该按钮组内按钮的类型 | string | primary / success / warning / danger / info | — |

### ButtonGroup Slots

| 插槽名 | 说明 | 子标签 |
| --- | --- | --- |
| default | 自定义按钮组内容 | Button |

## 实践练习

### 练习 1：创建按钮组合

创建一个包含不同类型、尺寸和状态的按钮组合：

1. 实现一个工具栏，包含主要操作按钮
2. 添加按钮的加载状态和禁用状态
3. 使用按钮组创建分页控件
4. 实现响应式按钮布局

### 练习 2：按钮交互效果

练习按钮的交互和状态管理：

1. 实现按钮的点击反馈效果
2. 创建动态加载状态的按钮
3. 实现按钮的条件禁用
4. 添加按钮的确认对话框

### 练习 3：自定义按钮样式

基于 Element Plus 按钮创建自定义样式：

1. 定义自己的按钮主题色彩
2. 创建特殊形状的按钮
3. 实现按钮的动画效果
4. 适配移动端的按钮样式

## 学习资源

* [Element Plus Button 组件文档](https://element-plus.org/zh-CN/component/button.html)
* [Element Plus 设计规范](https://element-plus.org/zh-CN/guide/design.html)
* [Vue 3 事件处理](https://cn.vuejs.org/guide/essentials/event-handling.html)
* [CSS 按钮设计指南](https://web.dev/learn/design/buttons/)

## 作业

1. 完成所有实践练习
2. 创建一个完整的按钮展示页面，包含所有类型和状态
3. 实现一个带有确认功能的删除按钮组件
4. 研究其他 UI 框架的按钮设计，对比分析优缺点

## 下一步学习计划

接下来我们将学习 **表单组件**，包括：
- Input 输入框组件
- Select 选择器组件
- Checkbox 复选框组件
- Radio 单选框组件

<script setup>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Search,
  Edit,
  Message,
  Star,
  Delete,
  Share,
  Check,
  ArrowLeft,
  ArrowRight,
  Plus,
  Upload,
  Download,
  Refresh,
  Setting,
  More,
  ZoomIn,
  ZoomOut,
  FullScreen
} from '@element-plus/icons-vue'

const loading = ref(false)

const handleClick = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>

<style scoped>
.demo-block {
  margin: 20px 0;
}

.demo-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.demo-description {
  color: #666;
  margin-bottom: 15px;
}

.demo-content {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fafafa;
}

.demo-content .el-button {
  margin: 0 8px 8px 0;
}

.demo-content .el-row {
  margin-bottom: 20px;
}

.demo-content .el-row:last-child {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  margin-bottom: 20px;
}

.toolbar-section {
  display: flex;
  gap: 10px;
}

.action-groups {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.success {
  background-color: var(--el-color-success);
}

.status-indicator.warning {
  background-color: var(--el-color-warning);
}

.status-indicator.danger {
  background-color: var(--el-color-danger);
}

.status-indicator.info {
  background-color: var(--el-color-info);
}

.status-item span {
  flex: 1;
  color: var(--el-text-color-primary);
}
</style>