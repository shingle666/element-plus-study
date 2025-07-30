# Notification 通知

## 学习目标

通过本章学习，你将掌握：
- 基础通知功能的实现方法
- 通知类型样式和位置设置
- 通知持续时间和操作按钮
- 通知HTML内容和分组管理
- 通知全局配置和最佳实践

**预计学习时间：** 90分钟

## 概述

悬浮出现在页面角落，显示全局的通知提醒消息。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

常用于系统级通知的被动提醒，与 Message 的区别是后者更多用于主动操作后的反馈提示。<mcreference link="https://element-plus.org/zh-CN/component/message.html" index="1">1</mcreference>

## 基础用法

### 基础用法

Element Plus 注册了 `$notify` 方法并且它接受一个 Object 作为其参数。在最简单的情况下，你可以通过设置 `title` 和 `message` 属性来设置通知的标题和正文内容。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> 可自动关闭 </el-button>
  <el-button plain @click="open2"> 不会自动关闭 </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '标题名称',
        message: '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案'
      })
    },
    open2() {
      this.$notify({
        title: '提示',
        message: '这是一条不会自动关闭的消息',
        duration: 0
      })
    }
  }
}
</script>
```

### 不同类型的通知

我们提供了四种不同类型的提醒框：success、warning、info 和 error。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> Success </el-button>
  <el-button plain @click="open2"> Warning </el-button>
  <el-button plain @click="open3"> Info </el-button>
  <el-button plain @click="open4"> Error </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '成功',
        message: '这是一条成功的提示消息',
        type: 'success'
      })
    },
    open2() {
      this.$notify({
        title: '警告',
        message: '这是一条警告的提示消息',
        type: 'warning'
      })
    },
    open3() {
      this.$notify.info({
        title: '消息',
        message: '这是一条消息的提示消息'
      })
    },
    open4() {
      this.$notify.error({
        title: '错误',
        message: '这是一条错误的提示消息'
      })
    }
  }
}
</script>
```

### 自定义消息弹出的位置

可以让 Notification 从屏幕四角中的任意一角弹出。使用 `position` 属性设置 Notification 的弹出位置，支持四个选项：`top-right`、`top-left`、`bottom-right` 和 `bottom-left`，默认为 `top-right`。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open1"> 右上角 </el-button>
  <el-button plain @click="open2"> 右下角 </el-button>
  <el-button plain @click="open3"> 左下角 </el-button>
  <el-button plain @click="open4"> 左上角 </el-button>
</template>

<script>
export default {
  methods: {
    open1() {
      this.$notify({
        title: '自定义位置',
        message: '右上角弹出的消息',
        position: 'top-right'
      })
    },
    open2() {
      this.$notify({
        title: '自定义位置',
        message: '右下角弹出的消息',
        position: 'bottom-right'
      })
    },
    open3() {
      this.$notify({
        title: '自定义位置',
        message: '左下角弹出的消息',
        position: 'bottom-left'
      })
    },
    open4() {
      this.$notify({
        title: '自定义位置',
        message: '左上角弹出的消息',
        position: 'top-left'
      })
    }
  }
}
</script>
```

### 有位置偏移的通知栏

能够设置偏移量来使 Notification 偏移默认位置。Notification 提供设置偏移量的功能，通过设置 `offset` 字段，可以使弹出的消息距屏幕边缘偏移一段距离。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 偏移的消息 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: '偏移',
        message: '这是一条带有偏移的提示消息',
        offset: 100
      })
    }
  }
}
</script>
```

### 使用 HTML 片段作为正文内容

`message` 支持传入 HTML 字符串来作为正文内容。将 `dangerouslyUseHTMLString` 属性设置为 true，`message` 属性就会被当作 HTML 片段处理。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 使用 HTML 片段 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: 'HTML 片段',
        dangerouslyUseHTMLString: true,
        message: '<strong>这是 <i>HTML</i> 片段</strong>'
      })
    }
  }
}
</script>
```

### 隐藏关闭按钮

通知的关闭按钮可以被设置为隐藏。将 `showClose` 属性设置为 false 即可隐藏关闭按钮。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```vue
<template>
  <el-button plain @click="open"> 隐藏关闭按钮 </el-button>
</template>

<script>
export default {
  methods: {
    open() {
      this.$notify({
        title: '提示',
        message: '这是一条没有关闭按钮的消息',
        showClose: false
      })
    }
  }
}
</script>
```

### 全局方法

Element Plus 为 `app.config.globalProperties` 添加了全局方法 `$notify`。因此在 Vue instance 中可以采用本页面中的方式调用 Notification。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

### 单独引用

```javascript
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'

ElNotification({
  title: 'Title',
  message: 'This is a message',
  closeIcon: CloseBold,
})
```

你可以在对应的处理函数内调用 `ElNotification(options)` 来呼出通知栏。我们也提前定义了多个 type 的单独调用方法，如 `ElNotification.success(options)`。当你需要关闭页面上所有的通知栏的时候，可以调用 `ElNotification.closeAll()` 来关闭所有的实例。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

### 应用程序上下文继承

现在 Notification 接受一条 `context` 作为消息构造器的第二个参数，允许你将当前应用的上下文注入到 Notification 中，这将允许你继承应用程序的所有属性。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

```typescript
import { getCurrentInstance } from 'vue'
import { ElNotification } from 'element-plus'

// 在你的 setup 方法中
const { appContext } = getCurrentInstance()!
ElNotification({}, appContext)
```

## API

### 配置项

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题部分 | string | '' |
| message | 通知栏正文内容 | string / VNode / Function | '' |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理 | boolean | false |
| type | 通知的类型 | enum | '' |
| icon | 自定义图标。若设置了 type，则 icon 会被覆盖 | string / Component | — |
| customClass | 自定义类名 | string | '' |
| duration | 显示时间, 单位为毫秒。值为 0 则不会自动关闭 | number | 4500 |
| position | 自定义弹出位置 | enum | top-right |
| showClose | 是否显示关闭按钮 | boolean | true |
| onClose | 关闭时的回调函数 | Function | — |
| onClick | 点击 Notification 时的回调函数 | Function | — |
| offset | 相对屏幕顶部的偏移量，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 | number | 0 |
| appendTo | 设置 notification 的根元素，默认为 document.body | CSSSelector / HTMLElement | — |
| zIndex | 初始 zIndex | number | 0 |
| closeIcon | 自定义关闭图标 | string / Component | Close |

### 方法

Notification 和 `this.$notify` 都返回当前的 Notification 实例。如果需要手动关闭实例，可以调用它的 close 方法。<mcreference link="https://element-plus.org/zh-CN/component/notification" index="4">4</mcreference>

| 名称 | 详情 | 类型 |
|------|------|------|
| close | 关闭当前的 Notification | Function |

## 最佳实践

1. **合理使用通知类型**：根据消息的重要性和性质选择合适的类型（success、warning、info、error）

2. **控制显示时间**：对于重要信息可以设置 `duration: 0` 让用户手动关闭，普通信息使用默认时间

3. **避免过多通知**：同时显示的通知数量不宜过多，可以使用 `ElNotification.closeAll()` 清除所有通知

4. **位置选择**：根据页面布局选择合适的弹出位置，避免遮挡重要内容

5. **安全使用 HTML**：使用 `dangerouslyUseHTMLString` 时确保内容安全，避免 XSS 攻击

6. **响应式设计**：在移动端考虑通知的显示效果和用户体验

## 常见问题

**Q: 如何批量关闭所有通知？**
A: 使用 `ElNotification.closeAll()` 方法可以关闭所有当前显示的通知。

**Q: 通知不会自动关闭怎么办？**
A: 检查 `duration` 属性是否设置为 0，如果是 0 则需要用户手动关闭或调用 close 方法。

**Q: 如何自定义通知的样式？**
A: 可以通过 `customClass` 属性添加自定义类名，然后在 CSS 中定义样式。

**Q: 通知的层级问题如何解决？**
A: 可以通过 `zIndex` 属性设置通知的层级，确保通知能够正确显示在其他元素之上。

**Q: 如何在 setup 语法中使用通知？**
A: 可以直接导入 `ElNotification` 使用，或者通过 `getCurrentInstance()` 获取应用上下文。


## 实践项目

### 通知系统应用

创建一个完整的系统通知中心，包含以下功能：

1. **系统通知中心**
   - 新消息提醒
   - 系统公告通知
   - 任务完成提醒

2. **实时通知推送**
   - WebSocket 消息推送
   - 服务器状态通知
   - 用户行为提醒

3. **通知管理功能**
   - 通知历史记录
   - 通知设置管理
   - 批量操作功能

### 实践要点

- 实现通知的分类和优先级管理
- 设计合理的通知显示策略
- 处理通知的持久化存储
- 优化通知的用户体验

## 学习检查清单

- [ ] 掌握基础通知功能的使用
- [ ] 理解不同通知类型的应用场景
- [ ] 熟练配置通知的位置和持续时间
- [ ] 掌握通知的操作按钮和HTML内容
- [ ] 理解通知分组和全局配置
- [ ] 完成通知系统的实践项目

## 注意事项

1. **消息的优先级管理**
   - 系统级错误通知优先级最高
   - 普通信息通知可以延迟显示
   - 避免通知堆积影响用户体验

2. **用户注意力的引导**
   - 重要通知使用合适的类型和颜色
   - 避免过于频繁的通知打扰
   - 提供通知开关和设置选项

3. **反馈信息的及时性**
   - 系统状态变化要及时通知
   - 异步操作结果要准确反馈
   - 错误信息要提供解决建议

4. **无障碍访问支持**
   - 确保通知内容语义化
   - 提供键盘导航支持
   - 考虑视觉障碍用户的需求

---

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**