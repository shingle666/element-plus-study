# Message 消息提示

## 学习目标

通过本章学习，你将掌握：
- 基础消息提示的使用方法
- 消息类型设置和样式控制
- 消息持续时间和位置控制
- 消息关闭功能和HTML内容
- 消息分组管理和队列处理
- 消息全局配置和最佳实践

**预计学习时间：** 105分钟

## 概述

常用于主动操作后的反馈提示。与 Notification 的区别是后者更多用于系统级通知的被动提醒。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 基础用法

### 基础用法

从顶部出现，3 秒后自动消失。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

Message 在配置上与 Notification 非常类似，所以部分 options 在此不做详尽解释。文末有 options 列表，可以结合 Notification 的文档理解它们。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

Element Plus 注册了一个全局的 $message方法用于调用。Message 可以接收一个字符串或一个 VNode 作为参数，它会被显示为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open">打开消息提示</el-button>
  <el-button :plain="true" @click="openVn">VNode</el-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { ElMessage } from 'element-plus'

const open = () => {
  ElMessage('只是一条消息提示')
}

const openVn = () => {
  ElMessage({
    message: h('p', null, [
      h('span', null, '内容可以是 '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
  })
}
</script>
```

### 不同状态

用来显示「成功、警告、消息、错误」类的操作反馈。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

当需要自定义更多属性时，Message 也可以接收一个对象为参数。比如，设置 type 字段可以定义不同的状态，默认为info。此时正文内容以 message 的值传入。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

同时，我们也为 Message 的各种 type 注册了方法，可以在不传入 type 字段的情况下像 open4 那样直接调用。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage.success({
    message: '恭喜你，这是一条成功消息',
    type: 'success',
  })
}

const open2 = () => {
  ElMessage.warning({
    message: '警告哦，这是一条警告消息',
    type: 'warning',
  })
}

const open3 = () => {
  ElMessage('这是一条消息提示')
}

const open4 = () => {
  ElMessage.error('错了哦，这是一条错误消息')
}
</script>
```

### Plain 背景

设置 plain 为 plain 背景。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage.success({
    message: '恭喜你，这是一条成功消息',
    plain: true,
  })
}

const open2 = () => {
  ElMessage.warning({
    message: '警告哦，这是一条警告消息',
    plain: true,
  })
}

const open3 = () => {
  ElMessage({
    message: '这是一条消息提示',
    plain: true,
  })
}

const open4 = () => {
  ElMessage.error({
    message: '错了哦，这是一条错误消息',
    plain: true,
  })
}
</script>
```

### 可关闭的消息提示

可以添加关闭按钮。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

默认的 Message 是不可以被人工关闭的。如果你需要手动关闭功能，你可以把 showClose 设置为 true。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

此外，和 Notification 一样，Message 拥有可控的 duration，默认的关闭时间为 3000 毫秒，当把这个属性的值设置为0便表示该消息不会被自动关闭。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">消息</el-button>
  <el-button :plain="true" @click="open2">成功</el-button>
  <el-button :plain="true" @click="open3">警告</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage({
    showClose: true,
    message: '这是一条消息提示',
  })
}

const open2 = () => {
  ElMessage({
    showClose: true,
    message: '恭喜你，这是一条成功消息',
    type: 'success',
  })
}

const open3 = () => {
  ElMessage({
    showClose: true,
    message: '警告哦，这是一条警告消息',
    type: 'warning',
  })
}

const open4 = () => {
  ElMessage({
    showClose: true,
    message: '错了哦，这是一条错误消息',
    type: 'error',
  })
}
</script>
```

### 使用 HTML 片段作为正文内容

message 还支持使用 HTML 字符串作为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

将dangerouslyUseHTMLString属性设置为 true,message 就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="openHTML">使用 HTML 片段</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const openHTML = () => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: '<strong>这是 <i>HTML</i> 片段</strong>',
  })
}
</script>
```

**安全警告**：message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 分组消息合并

合并相同内容的消息。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

设置 grouping 为 true，内容相同的 message 将被合并。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

```vue
<template>
  <el-button :plain="true" @click="open1">成功</el-button>
  <el-button :plain="true" @click="open2">警告</el-button>
  <el-button :plain="true" @click="open3">消息</el-button>
  <el-button :plain="true" @click="open4">错误</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage({
    message: '恭喜你，这是一条成功消息',
    type: 'success',
    grouping: true,
  })
}

const open2 = () => {
  ElMessage({
    message: '警告哦，这是一条警告消息',
    type: 'warning',
    grouping: true,
  })
}

const open3 = () => {
  ElMessage({
    message: '这是一条消息提示',
    grouping: true,
  })
}

const open4 = () => {
  ElMessage({
    message: '错了哦，这是一条错误消息',
    type: 'error',
    grouping: true,
  })
}
</script>
```

### 全局方法

Element Plus 为 app.config.globalProperties 添加了全局方法 $message。因此在 vue 实例中你可以使用当前页面中的调用方式调用 Message。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 单独引用

```typescript
import { ElMessage } from 'element-plus'
```

此时调用方法为 ElMessage(options)。我们也为每个 type 定义了各自的方法，如 ElMessage.success(options)。并且可以调用 ElMessage.closeAll() 手动关闭所有实例。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### 应用程序上下文继承

现在 Message 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Message 中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

你可以像这样使用它：

```typescript
import { getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

// 在你的 setup 方法中
const { appContext } = getCurrentInstance()!
ElMessage({}, appContext)
```

如果您全局注册了 ElMessage 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## API

### Message 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| message | 消息文字 | string / VNode / Function | '' |
| type | 消息类型 | 'success' / 'warning' / 'info' / 'error' | 'info' |
| plain | 是否纯色 | boolean | false |
| icon | 自定义图标，该属性会覆盖 type 的图标 | string / Component | — |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| customClass | 自定义类名 | string | '' |
| duration | 显示时间，单位为毫秒。设为 0 则不会自动关闭 | number | 3000 |
| showClose | 是否显示关闭按钮 | boolean | false |
| onClose | 关闭时的回调函数, 参数为被关闭的 message 实例 | Function | — |
| offset | Message 距离窗口顶部的偏移量 | number | 16 |
| appendTo | 设置 message 的根元素，默认为 document.body | CSSSelector / HTMLElement | — |
| grouping | 合并内容相同的消息，不支持 VNode 类型的消息 | boolean | false |
| repeatNum | 重复次数，类似于 Badge 。当和 grouping 属性一起使用时作为初始数量使用 | number | 1 |

<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Message 方法

调用 Message 或 this.$message 会返回当前 Message 的实例。如果需要手动关闭实例，可以调用它的 close 方法。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

| 名称 | 描述 | 类型 |
|------|------|------|
| close | 关闭当前的 Message | Function |

<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 最佳实践

1. **合理选择消息类型**：根据操作结果选择合适的消息类型（success、warning、info、error）
2. **控制显示时长**：根据消息重要性设置合适的 duration，重要消息可设置为 0 不自动关闭
3. **避免消息堆积**：使用 grouping 属性合并相同内容的消息，避免界面混乱
4. **安全使用 HTML**：谨慎使用 dangerouslyUseHTMLString，确保内容安全可信
5. **适当使用关闭按钮**：对于重要或持久显示的消息，启用 showClose 选项
6. **合理设置偏移量**：根据页面布局调整 offset 值，避免遮挡重要内容

## 常见问题

### Q: Message 和 Notification 有什么区别？
A: Message 常用于主动操作后的反馈提示，从顶部出现。Notification 更多用于系统级通知的被动提醒，从右上角弹出。Message 更适合简短的操作反馈，Notification 适合较复杂的通知内容。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

## 实践项目

### 消息系统实现

创建一个完整的消息反馈系统，包含以下功能：

1. **操作成功提示**
   - 数据保存成功
   - 文件上传完成
   - 表单提交成功

2. **错误消息处理**
   - 网络请求失败
   - 表单验证错误
   - 权限不足提示

3. **消息队列管理**
   - 批量操作反馈
   - 消息分组显示
   - 消息优先级处理

### 实践要点

- 根据不同操作类型选择合适的消息类型
- 实现消息的统一管理和配置
- 处理并发消息的显示策略
- 优化用户体验和视觉效果

## 学习检查清单

- [ ] 掌握基础消息提示的使用
- [ ] 理解不同消息类型的应用场景
- [ ] 熟练配置消息的显示时长和位置
- [ ] 掌握消息的关闭和HTML内容功能
- [ ] 理解消息分组和队列处理机制
- [ ] 完成消息系统的实践项目

## 注意事项

1. **消息的优先级管理**
   - 错误消息优先级最高
   - 成功消息可以适当延迟显示
   - 避免同时显示过多消息

2. **用户注意力的引导**
   - 重要消息使用醒目的颜色
   - 关键操作结果需要明确反馈
   - 避免频繁的消息打扰

3. **反馈信息的及时性**
   - 操作后立即给出反馈
   - 异步操作要有加载状态
   - 错误信息要准确描述问题

4. **无障碍访问支持**
   - 确保消息内容可被屏幕阅读器识别
   - 提供键盘操作支持
   - 考虑色盲用户的使用体验

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**

### Q: 如何手动关闭所有 Message 实例？
A: 可以调用 ElMessage.closeAll() 方法手动关闭所有实例。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何安全地使用 HTML 片段？
A: message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何实现消息分组合并？
A: 设置 grouping 为 true，内容相同的 message 将被合并。这个功能不支持 VNode 类型的消息。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>

### Q: 如何在应用中继承上下文？
A: 现在 Message 接受一条 context 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Message 中。如果您全局注册了 ElMessage 组件，它将自动继承应用的上下文环境。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="3">3</mcreference>