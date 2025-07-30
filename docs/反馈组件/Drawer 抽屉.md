# Drawer 抽屉

## 学习目标

通过本章学习，你将掌握：
- **基础抽屉功能**：掌握 Drawer 的基本使用方法和属性配置
- **抽屉方向设置**：学会控制抽屉的打开方向和位置
- **抽屉尺寸控制**：掌握抽屉大小的设置和响应式调整
- **抽屉嵌套使用**：处理复杂的嵌套抽屉场景
- **抽屉事件处理**：掌握各种事件的监听和处理
- **抽屉动画定制**：自定义抽屉的显示和隐藏动画
- **抽屉内容懒加载**：优化抽屉的渲染性能

**预计学习时间：** 90分钟

## 概述

有些时候, Dialog 组件并不满足我们的需求, 比如你的表单很长, 亦或是你需要临时展示一些文档, Drawer 拥有和 Dialog 几乎相同的 API, 在 UI 上带来不一样的体验。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

## 基础用法

### 基础用法

你必须像 Dialog一样为 Drawer 设置 model-value 属性来控制 Drawer 的显示与隐藏状态，该属性接受一个 boolean 类型。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

Drawer 包含三部分: title & body & footer, 其中 title 是一个具名 slot, 你还可以通过 title 属性来设置标题, 默认情况下它是一个空字符串, 其中 body 部分是 Drawer 组件的主区域, 它包含了用户定义的主要内容。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" title="我是标题">
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 不添加 Title

通过设置 with-header 属性为 false 来控制是否显示标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

如果你的应用需要具备可访问性，请务必设置好 title。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" :with-header="false">
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 自定义头部

header 可用于自定义显示标题的区域。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

为了保持可用性，除了使用此插槽外，使用 title 属性，或使用 titleId 插槽属性来指定哪些元素应该读取为抽屉标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">自定义头部</h4>
    </template>
    <span>Hi there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(false)
</script>
```

### 自定义内容

和 Dialog 组件一样，Drawer 同样可以在其内部嵌套各种丰富的操作。

```vue
<template>
  <el-button text @click="drawer = true">
    点击打开 Drawer
  </el-button>

  <el-drawer v-model="drawer" title="我是外层 Drawer">
    <el-button @click="innerDrawer = true">打开里层 Drawer</el-button>
    <el-drawer
      v-model="innerDrawer"
      title="我是里层 Drawer"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <p>_(:зゝ∠)_</p>
    </el-drawer>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const innerDrawer = ref(false)

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

### 不同方向

当 Drawer 打开时，默认设置是从右至左打开 30% 浏览器宽度。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

你可以通过传入对应的 direction 和 size 属性来修改这一默认行为。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

```vue
<template>
  <el-radio-group v-model="direction">
    <el-radio label="ltr">从左往右开</el-radio>
    <el-radio label="rtl">从右往左开</el-radio>
    <el-radio label="ttb">从上往下开</el-radio>
    <el-radio label="btt">从下往上开</el-radio>
  </el-radio-group>

  <el-button style="margin-left: 16px" type="primary" @click="drawer = true">
    打开 Drawer
  </el-button>

  <el-drawer
    v-model="drawer"
    title="我是标题"
    :direction="direction"
    :before-close="handleClose"
  >
    <span>Hi, there!</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const direction = ref('rtl')

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| model-value / v-model | 是否显示 Drawer | boolean | — | — |
| append-to-body | Drawer 自身是否插入至 body 元素上 | boolean | — | false |
| before-close | 关闭前的回调，会暂停 Drawer 的关闭 | function(done)，done 用于关闭 Drawer | — | — |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Drawer | boolean | — | true |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Drawer | boolean | — | true |
| custom-class | Drawer 的自定义类名 | string | — | — |
| destroy-on-close | 控制是否在关闭 Drawer 之后将子元素全部销毁 | boolean | — | false |
| modal | 是否需要遮罩层 | boolean | — | true |
| direction | Drawer 打开的方向 | string | rtl / ltr / ttb / btt | rtl |
| show-close | 是否显示关闭按钮 | boolean | — | true |
| size | Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 | number / string | — | 30% |
| title | Drawer 的标题，也可通过具名 slot 传入 | string | — | — |
| with-header | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 | boolean | — | true |
| modal-class | 遮罩层的自定义类名 | string | — | — |
| z-index | 设置 z-index | number | — | — |
| header-height | Header 区域的高度 | string / number | — | — |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| open | Drawer 打开的回调 | Function |
| opened | Drawer 打开动画结束时的回调 | Function |
| close | Drawer 关闭的回调 | Function |
| closed | Drawer 关闭动画结束时的回调 | Function |
| open-auto-focus | 输入焦点聚焦在 Drawer 内容时的回调 | Function |
| close-auto-focus | 输入焦点从 Drawer 内容失焦时的回调 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | Drawer 的内容 | — |
| header | Drawer 标题区的内容；会替换标题部分，但不会移除关闭按钮。 | { close: Function, titleId: string, titleClass: string } |
| title | 与 header 作用相同 请使用 header | { close: Function, titleId: string, titleClass: string } |
| footer | Drawer 页脚区的内容 | — |

<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

## 最佳实践

1. **合理使用懒渲染**：Drawer 的内容是懒渲染的，如果需要执行 DOM 操作，请在 open 事件回调中进行
2. **嵌套 Drawer 使用 append-to-body**：在嵌套 Drawer 时，内层 Drawer 需要设置 append-to-body 为 true
3. **选择合适的方向**：根据页面布局和用户习惯选择合适的 direction
4. **合理设置大小**：根据内容量设置合适的 size，避免内容过于拥挤或空旷
5. **关闭前确认**：对于重要操作，使用 before-close 回调进行确认
6. **可访问性**：当不显示头部时，请务必设置好 title 属性以保持可访问性

## 常见问题

### Q: Drawer 的内容什么时候渲染？
A: Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。因此，如果需要执行 DOM 操作，或通过 ref 获取相应组件，请在 open 事件回调中进行。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Q: 如何自定义 Drawer 的头部？
A: 可以使用 header 插槽来自定义显示标题的区域。为了保持可用性，除了使用此插槽外，建议使用 title 属性，或使用 titleId 插槽属性来指定哪些元素应该读取为抽屉标题。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="2">2</mcreference>

### Q: Drawer 和 Dialog 有什么区别？
A: Drawer 拥有和 Dialog 几乎相同的 API，主要区别在于 UI 体验上。Drawer 从页面边缘滑出，适合展示表单、文档等需要更多空间的内容。

### Q: 如何控制 Drawer 不显示头部？
A: 通过设置 with-header 属性为 false 来控制是否显示标题。如果你的应用需要具备可访问性，请务必设置好 title。<mcreference link="https://element-plus.org/zh-CN/component/drawer.html" index="3">3</mcreference>

## 实践项目

### 侧边抽屉导航系统
创建一个完整的侧边抽屉导航系统，包含以下功能：

1. **多方向抽屉**
   - 实现左侧、右侧、顶部、底部四个方向的抽屉
   - 根据内容类型选择合适的抽屉方向
   - 处理不同方向抽屉的尺寸设置

2. **抽屉内容管理**
   - 实现抽屉内容的动态加载
   - 支持表单、列表、详情等不同类型内容
   - 处理抽屉内容的滚动和布局

3. **抽屉状态同步**
   - 使用 Pinia 管理抽屉的全局状态
   - 实现多个抽屉之间的状态同步
   - 处理抽屉的持久化存储

4. **响应式抽屉**
   - 根据屏幕尺寸调整抽屉大小
   - 在移动端自动切换为全屏模式
   - 处理横竖屏切换的适配

### 实践要点
- 合理选择抽屉的打开方向和尺寸
- 实现抽屉内容的懒加载和性能优化
- 处理抽屉的嵌套和层级管理
- 确保抽屉的无障碍访问支持
- 优化移动端的交互体验

## 学习检查清单

### 基础功能
- [ ] 掌握 Drawer 的基本使用方法
- [ ] 理解 `model-value` 的双向绑定机制
- [ ] 熟练使用 `direction`、`size` 等基础属性
- [ ] 掌握 `before-close` 回调的使用

### 高级功能
- [ ] 实现不同方向的抽屉
- [ ] 处理嵌套抽屉的场景
- [ ] 自定义抽屉的头部和底部
- [ ] 控制抽屉头部的显示和隐藏

### 性能优化
- [ ] 理解抽屉的懒渲染机制
- [ ] 合理使用 `destroy-on-close` 属性
- [ ] 优化抽屉的动画效果
- [ ] 处理大量数据的显示

### 用户体验
- [ ] 实现抽屉的响应式设计
- [ ] 处理键盘导航和焦点管理
- [ ] 提供清晰的操作反馈
- [ ] 确保抽屉的无障碍访问

## 注意事项

### 弹出层的层级管理
- 合理设置抽屉的层级关系
- 使用 `append-to-body` 处理定位问题
- 注意嵌套抽屉的层级冲突
- 避免过多的抽屉同时显示

### 用户操作的连贯性
- 保持抽屉操作的逻辑性
- 提供明确的打开和关闭反馈
- 避免突然的界面变化
- 确保用户能够轻松导航

### 移动端的交互体验
- 在小屏幕设备上优化抽屉尺寸
- 支持手势操作和触摸交互
- 考虑虚拟键盘对抽屉的影响
- 提供合适的关闭方式

### 弹出层的性能影响
- 避免在抽屉中渲染过多内容
- 使用懒加载减少初始渲染时间
- 及时销毁不需要的抽屉实例
- 监控抽屉对页面性能的影响

---

## 学习记录

**学习日期：** ___________  
**完成状态：** ___________  
**学习笔记：**



**遇到的问题：**



**解决方案：**



**实践项目完成情况：**
- [ ] 侧边抽屉导航系统
- [ ] 多方向抽屉实现
- [ ] 抽屉内容管理
- [ ] 状态同步机制
- [ ] 响应式适配