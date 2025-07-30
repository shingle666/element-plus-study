# Steps 步骤条

## 概述

引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

## 基础用法

### 基础用法

简单的步骤条。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

设置 `active` 属性，接受一个 Number，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置 `space` 属性即可，它接受 Number，单位为 px，如果不设置，则为自适应。设置 `finish-status` 属性可以改变已经完成的步骤的状态。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :active="active" finish-status="success">
    <el-step title="Step 1" />
    <el-step title="Step 2" />
    <el-step title="Step 3" />
  </el-steps>
  <el-button style="margin-top: 12px" @click="next">Next step</el-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const active = ref(0)
const next = () => {
  if (active.value++ > 2) active.value = 0
}
</script>
```

### 含状态的步骤条

每一步骤显示出该步骤的状态。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

也可以使用 `title` 具名插槽，可以用 slot 的方式来取代属性的设置。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :space="200" :active="1" finish-status="success">
    <el-step title="Done" />
    <el-step title="Processing" />
    <el-step title="Step 3" />
  </el-steps>
</template>
```

### 居中的步骤条

标题和描述可以居中。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :active="2" align-center>
    <el-step title="Step 1" description="Some description" />
    <el-step title="Step 2" description="Some description" />
    <el-step title="Step 3" description="Some description" />
    <el-step title="Step 4" description="Some description" />
  </el-steps>
</template>
```

### 带描述的步骤条

每一步都有描述。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :active="1">
    <el-step title="Step 1" description="Some description" />
    <el-step title="Step 2" description="Some description" />
    <el-step title="Step 3" description="Some description" />
  </el-steps>
</template>
```

### 带图标的步骤条

可以在步骤栏中使用各种自定义图标。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

通过 `icon` 属性来设置图标，图标的类型可以参考 Icon 组件的文档，除此以外，还能通过具名 slot 来使用自定义的图标。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :active="1">
    <el-step title="Step 1" :icon="Edit" />
    <el-step title="Step 2" :icon="Upload" />
    <el-step title="Step 3" :icon="Picture" />
  </el-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, Upload } from '@element-plus/icons-vue'
</script>
```

### 垂直的步骤条

垂直方向的步骤条。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

只需要在 `el-steps` 元素中设置 `direction` 属性为 `vertical` 即可。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <div style="height: 300px">
    <el-steps direction="vertical" :active="1">
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>
  </div>
</template>
```

### 简洁风格的步骤条

设置 `simple` 可应用简洁风格，该条件下 `align-center` / `description` / `direction` / `space` 都将失效。<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

```vue
<template>
  <el-steps :space="200" :active="1" simple>
    <el-step title="Step 1" :icon="Edit" />
    <el-step title="Step 2" :icon="UploadFilled" />
    <el-step title="Step 3" :icon="Picture" />
  </el-steps>
  <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
    <el-step title="Step 1" />
    <el-step title="Step 2" />
    <el-step title="Step 3" />
  </el-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue'
</script>
```

### 插槽的使用

在 Vue 3.0 项目中使用插槽的方式。<mcreference link="https://blog.csdn.net/qq_39669919/article/details/128455837" index="4">4</mcreference>

```vue
<template>
  <el-steps :active="2" direction="vertical" align-center>
    <el-step title="步骤1" description="描述">
      <template v-slot:description>
        <span>这是测试1</span>
      </template>
    </el-step>
    <el-step title="步骤2" description="描述">
      <template v-slot:description>
        <span>这是测试2</span>
      </template>
    </el-step>
  </el-steps>
</template>
```

## API

### Steps Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| space | 每个 step 的间距，不填写将自适应间距。支持百分比。 | number / string | — | — |
| direction | 显示方向 | string | vertical/horizontal | horizontal |
| active | 设置当前激活步骤 | number | — | 0 |
| process-status | 设置当前步骤的状态 | string | wait / process / finish / error / success | process |
| finish-status | 设置结束步骤的状态 | string | wait / process / finish / error / success | finish |
| align-center | 进行居中对齐 | boolean | — | false |
| simple | 是否应用简洁风格 | boolean | — | false |

<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

### Steps Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| — | 默认插槽 | Step |

<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

### Step Attributes

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| title | 标题 | string | — | — |
| description | 描述文案 | string | — | — |
| icon | Step 组件的自定义图标。也支持 slot 方式写入 | string / Component | — | — |
| status | 设置当前步骤的状态，不设置则根据 steps 确定状态 | string | wait / process / finish / error / success | — |

<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

### Step Slots

| 插槽名 | 说明 |
|--------|------|
| icon | 自定义图标 |
| title | 自定义标题 |
| description | 自定义描述文案 |

<mcreference link="https://www.bookstack.cn/read/element-plus-2.2-zh/67a3421ca4487f22.md" index="3">3</mcreference>

## 最佳实践

1. **步骤数量**：步骤不得少于 2 步，建议不超过 6 步以保持清晰
2. **状态管理**：合理使用 `process-status` 和 `finish-status` 来表示不同的步骤状态
3. **响应式设计**：在移动端考虑使用垂直布局或简洁风格
4. **图标选择**：选择语义明确的图标来增强用户理解
5. **描述信息**：为复杂流程提供必要的描述信息
6. **交互反馈**：可以通过点击事件实现步骤间的跳转<mcreference link="https://www.cnblogs.com/Antwan-Dmy/p/13164252.html" index="5">5</mcreference>

## 常见问题

### Q: 如何实现步骤条的点击跳转？
A: 可以通过 `@click.native` 事件监听步骤的点击，然后更新 `active` 属性值。<mcreference link="https://www.cnblogs.com/Antwan-Dmy/p/13164252.html" index="5">5</mcreference>

### Q: Vue 3.0 中如何使用插槽？
A: 在 Vue 3.0 中需要使用 `<template v-slot:slotName>` 的方式，不能再使用 `slot-scope`。<mcreference link="https://blog.csdn.net/qq_39669919/article/details/128455837" index="4">4</mcreference>

### Q: 简洁风格下哪些属性会失效？
A: 设置 `simple` 为 true 时，`align-center`、`description`、`direction`、`space` 属性都将失效。

### Q: 如何自定义步骤条的样式？
A: 可以通过 CSS 覆盖默认样式，如修改 `.el-steps`、`.el-step__head`、`.el-step__title` 等类名的样式。<mcreference link="https://blog.csdn.net/gusushantang/article/details/144012017" index="1">1</mcreference>