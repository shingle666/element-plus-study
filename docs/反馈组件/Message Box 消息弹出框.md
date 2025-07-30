# Message Box 消息弹出框

## 概述

MessageBox 是模拟系统的消息提示框而实现的一套模态对话框组件，用于消息提示、确认消息和提交内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

从设计上来说，MessageBox 的作用是美化系统自带的 alert、confirm 和 prompt，因此适合展示较为简单的内容。如果需要弹出较为复杂的内容，请使用 Dialog。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

## 基础用法

### 消息提示

当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open the Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'

const open = () => {
  ElMessageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`,
      })
    },
  })
}
</script>
```

调用 ElMessageBox.alert 方法以打开 alert 框。它模拟了系统的 alert，无法通过按下 ESC 或点击框外关闭。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 确认消息

提示用户确认其已经触发的动作，并询问是否进行此操作时会用到此对话框。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open the Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const open = () => {
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>
```

调用 ElMessageBox.confirm 方法以打开 confirm 框。它模拟了系统的 confirm。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 提交内容

当需要用户输入内容时，可以使用 Prompt 类型的消息框。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

```vue
<template>
  <el-button text @click="open">Click to open Message Box</el-button>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'

const open = () => {
  ElMessageBox.prompt('Please input your e-mail', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
</script>
```

调用 ElMessageBox.prompt 方法以打开 prompt 框。它模拟了系统的 prompt。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 使用 VNode

message 可以是 VNode。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 个性化

消息弹框可以被定制来展示各种内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

上面提到的三个方法都是对 ElMessageBox 方法的二次包装。本例直接调用 ElMessageBox 方法，使用了 showCancelButton 字段，用于显示取消按钮。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 使用 HTML 片段

message 支持传入 HTML 字符串来作为正文内容。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

将 dangerouslyUseHTMLString 属性设置为 true，message 属性就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

**警告：** message 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 dangerouslyUseHTMLString 打开的情况下，请确保 message 的内容是可信的，永远不要将用户提交的内容赋值给 message 属性。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 区分取消操作与关闭操作

有些场景下，点击取消按钮与点击关闭按钮有着不同的含义。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

默认情况下，当用户触发取消（点击取消按钮）和触发关闭（点击关闭按钮或遮罩层、按下 ESC 键）时，Promise 的 reject 回调和 callback 回调的参数均为 'cancel'。如果将 distinguishCancelAndClose 属性设置为 true，则上述两种行为的参数分别为 'cancel' 和 'close'。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 内容居中

消息弹框支持使用居中布局。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

将 center 属性设置为 true 可将内容居中显示。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 自定义图标

图标可以使用任意 Vue 组件或渲染函数 (JSX) 来自定义。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 可拖放

设置 MessageBox 可以拖拽。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

设置 draggable 属性为 true 来开启拖拽弹窗能力。设置 overflow 为 true 可以让拖拽范围超出可视区。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

### 全局方法

如果你完整引入了 Element Plus，它会为 app.config.globalProperties 添加如下全局方法：$msgbox、$alert、$confirm 和 $prompt。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

因此在 Vue 实例中可以采用本页面中的方式来调用 MessageBox。参数如下：<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

- $msgbox(options)
- $alert(message, title, options) 或 $alert(message, options)
- $confirm(message, title, options) 或 $confirm(message, options)
- $prompt(message, title, options) 或 $prompt(message, options)

### 应用程序上下文继承

现在 MessageBox 接受构造器的 context 作为第二个参数，这个参数允许你将当前应用的上下文注入到消息中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/message-box.html" index="1">1</mcreference>

## API

### MessageBox 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| autofocus | 是否自动聚焦 | boolean | true |
| title | MessageBox 标题 | string | '' |
| message | MessageBox 消息正文内容 | string / VNode / Function | '' |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| type | 消息类型，用于显示图标 | 'success' / 'info' / 'warning' / 'error' | '' |
| icon | 自定义图标组件，会覆盖 type 的图标 | string / Component | '' |
| customClass | MessageBox 的自定义类名 | string | '' |
| customStyle | MessageBox 的自定义内联样式 | CSSProperties | {} |
| callback | 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调 | Function | null |
| showClose | 是否显示右上角关闭按钮 | boolean | true |
| beforeClose | 关闭前的回调，会暂停 MessageBox 的关闭 | Function | null |
| distinguishCancelAndClose | 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 ESC 键）进行区分 | boolean | false |
| lockScroll | 是否在 MessageBox 出现时将 body 滚动锁定 | boolean | true |
| showCancelButton | 是否显示取消按钮 | boolean | false |
| showConfirmButton | 是否显示确定按钮 | boolean | true |
| cancelButtonText | 取消按钮的文本内容 | string | '取消' |
| confirmButtonText | 确定按钮的文本内容 | string | '确定' |
| cancelButtonClass | 取消按钮的自定义类名 | string | '' |
| confirmButtonClass | 确定按钮的自定义类名 | string | '' |
| closeOnClickModal | 是否可通过点击遮罩关闭 MessageBox | boolean | true |
| closeOnPressEscape | 是否可通过按下 ESC 键关闭 MessageBox | boolean | true |
| closeOnHashChange | 是否在 hashchange 时关闭 MessageBox | boolean | true |
| showInput | 是否显示输入框 | boolean | false |
| inputPlaceholder | 输入框的占位符 | string | '' |
| inputType | 输入框的类型 | string | 'text' |
| inputValue | 输入框的初始文本 | string | null |
| inputPattern | 输入框的校验表达式 | RegExp | null |
| inputValidator | 输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage | Function | null |
| inputErrorMessage | 校验未通过时的提示文本 | string | '输入的数据不合法!' |
| center | 是否居中布局 | boolean | false |
| draggable | 是否可拖拽 | boolean | false |
| overflow | 拖拽时是否可以超出可视区 | boolean | false |
| roundButton | 是否使用圆角按钮 | boolean | false |
| buttonSize | 自定义确认按钮及取消按钮的大小 | 'small' / 'default' / 'large' | 'default' |

### MessageBox 方法

调用 MessageBox 或 this.$msgbox 会返回当前 MessageBox 的实例。如果需要手动关闭实例，可以调用它的 close 方法。

| 名称 | 描述 | 类型 |
|------|------|------|
| close | 关闭当前的 MessageBox | Function |

## 最佳实践

1. **选择合适的类型**：根据场景选择 alert、confirm 或 prompt
2. **安全使用 HTML**：使用 dangerouslyUseHTMLString 时确保内容安全
3. **合理设置关闭方式**：根据业务需求配置关闭行为
4. **提供清晰的按钮文本**：使用明确的按钮文本提升用户体验
5. **适当使用 beforeClose**：在需要异步操作时使用 beforeClose 回调

## 常见问题

**Q: MessageBox 和 Dialog 有什么区别？**
A: MessageBox 适合展示简单内容，模拟系统原生弹框；Dialog 适合展示复杂内容和自定义布局。

**Q: 如何阻止 MessageBox 关闭？**
A: 使用 beforeClose 回调，在其中不调用 done 方法即可阻止关闭。

**Q: 如何区分取消和关闭操作？**
A: 设置 distinguishCancelAndClose 为 true，取消操作返回 'cancel'，关闭操作返回 'close'。

**Q: 输入框验证失败如何处理？**
A: 使用 inputValidator 函数，返回字符串作为错误提示，返回 false 表示验证失败。