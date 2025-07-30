# Popconfirm 气泡确认框

## 概述

点击某个元素弹出一个简单的气泡确认框。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

Popconfirm 的属性与 Popover 很类似，因此对于重复属性，请参考 Popover 的文档，在此文档中不做详尽解释。在 Popconfirm 中，只有 title 属性可用，content 属性会被忽略。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

## 基础用法

### 基础用法

Popconfirm 的属性与 Popover 很类似，因此对于重复属性，请参考 Popover 的文档，在此文档中不做详尽解释。在 Popconfirm 中，只有 title 属性可用，content 属性不会被展示。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm title="Are you sure to delete this?">
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>
```

### 自定义弹出框的内容

可以在 Popconfirm 中自定义内容。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm
    confirm-button-text="OK"
    cancel-button-text="No, Thanks"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="Are you sure to delete this?"
  >
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>
```

### 多种让 Popconfirm 出现的方法

点击按钮触发事件。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/42c40ac3d748fd4f.md" index="2">2</mcreference>

```vue
<template>
  <el-popconfirm
    confirm-button-text="Yes"
    cancel-button-text="No"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="Are you sure to delete this?"
    @confirm="confirmEvent"
    @cancel="cancelEvent"
  >
    <template #reference>
      <el-button>Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'

const confirmEvent = () => {
  console.log('confirm!')
}

const cancelEvent = () => {
  console.log('cancel!')
}
</script>
```

### 展示位置

Popconfirm 提供 9 种展示位置。使用 `title` 属性来设置点击参考元素时显示的信息。由 `placement` 属性决定 Popconfirm 的位置。该属性值格式为：[方向]-[对齐位置]，可供选择的四个方向分别是 top、left、right、bottom，可供选择的三种对齐方式分别是 start、end、null，默认的对齐方式为 null。<mcreference link="https://element-plus.org/zh-CN/component/popconfirm.html" index="1">1</mcreference>

```vue
<template>
  <div class="popconfirm-base-box">
    <div class="row center">
      <el-popconfirm
        class="box-item"
        title="Top Left prompts info"
        placement="top-start"
      >
        <template #reference>
          <el-button>top-start</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Top Center prompts info"
        placement="top"
      >
        <template #reference>
          <el-button>top</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Top Right prompts info"
        placement="top-end"
      >
        <template #reference>
          <el-button>top-end</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="row">
      <el-popconfirm
        class="box-item"
        title="Left prompts info"
        placement="left"
      >
        <template #reference>
          <el-button>left</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Right prompts info"
        placement="right"
      >
        <template #reference>
          <el-button>right</el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="row center">
      <el-popconfirm
        class="box-item"
        title="Bottom Left prompts info"
        placement="bottom-start"
      >
        <template #reference>
          <el-button>bottom-start</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Bottom Center prompts info"
        placement="bottom"
      >
        <template #reference>
          <el-button>bottom</el-button>
        </template>
      </el-popconfirm>
      <el-popconfirm
        class="box-item"
        title="Bottom Right prompts info"
        placement="bottom-end"
      >
        <template #reference>
          <el-button>bottom-end</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style>
.popconfirm-base-box {
  width: 520px;
}
.popconfirm-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.popconfirm-base-box .center {
  justify-content: center;
}
.popconfirm-base-box .box-item {
  margin: 4px;
}
</style>
```

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| title | 标题 | string | — |
| confirm-button-text | 确认按钮文字 | string | — |
| cancel-button-text | 取消按钮文字 | string | — |
| confirm-button-type | 确认按钮类型 | enum | primary |
| cancel-button-type | 取消按钮类型 | enum | text |
| icon | 自定义图标 | string / Component | QuestionFilled |
| icon-color | Icon 颜色 | string | #f90 |
| hide-icon | 是否隐藏 Icon | boolean | false |
| hide-after | 关闭时的延迟 | number | 200 |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | boolean | true |
| persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时, popover 将会被删除 | boolean | false |
| width | 弹层宽度，最小宽度 150px | string / number | 150 |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| confirm | 点击确认按钮时触发 | Function |
| cancel | 点击取消按钮时触发 | Function |

### Slots

| 插槽名 | 说明 | 类型 |
|--------|------|------|
| reference | 触发 Popconfirm 显示的 HTML 元素 | — |
| actions | 页脚的内容 | object |

## 最佳实践

1. **合理使用场景**：Popconfirm 适用于需要用户确认的简单操作，如删除、提交等

2. **明确的提示文字**：使用清晰、简洁的 title 文字，让用户明确知道操作的后果

3. **自定义按钮文字**：根据具体场景自定义确认和取消按钮的文字，提高用户体验

4. **合适的图标**：选择合适的图标来表达操作的性质，如警告、信息等

5. **位置选择**：根据触发元素的位置选择合适的弹出位置，避免遮挡重要内容

6. **事件处理**：正确处理确认和取消事件，确保用户操作得到正确响应

## 常见问题

**Q: 为什么 @confirm 事件不生效？**
A: 在某些版本中，事件名可能需要使用 @onConfirm 和 @onCancel，或者确保使用正确的事件名格式。<mcreference link="https://blog.csdn.net/xdtz_z/article/details/128946029" index="3">3</mcreference>

**Q: 如何自定义 Popconfirm 的样式？**
A: 可以通过 CSS 类名覆盖默认样式，或者使用 width、icon-color 等属性进行基本自定义。

**Q: Popconfirm 与 Popover 有什么区别？**
A: Popconfirm 是专门用于确认操作的简化版 Popover，只支持 title 属性，不支持 content 属性。

**Q: 如何在表格中使用 Popconfirm？**
A: 可以在表格的操作列中使用 Popconfirm 包裹操作按钮，提供删除确认等功能。

**Q: 如何解决 Popconfirm 与其他组件的冲突？**
A: 可以使用 @click.stop 阻止事件冒泡，或者调整组件的嵌套结构。<mcreference link="https://blog.csdn.net/qq_36330228/article/details/108810875" index="5">5</mcreference>