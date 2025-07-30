# Dropdown 下拉菜单

## 概述

将动作或菜单折叠到下拉菜单中。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

## 基础用法

### 基础下拉菜单

悬停在下拉菜单上以展开更多操作。通过组件 slot 来设置下拉触发的元素以及需要通过具名 slot 为 dropdown 来设置下拉菜单。默认情况下，只需要悬停在触发菜单的元素上即可，无需点击也会显示下拉菜单。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 触发对象

可使用按钮触发下拉菜单。设置 `split-button` 属性来让触发下拉元素呈现为按钮组，左边是功能按钮，右边是触发下拉菜单的按钮，设置为 true 即可。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown>
    <el-button type="primary">
      更多菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary" @click="handleClick">
    默认按钮
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'

const handleClick = () => {
  console.log('按钮被点击')
}
</script>
```

### 触发方式

可以配置点击激活或者悬停激活。将 `trigger` 属性设置为 click 即可，默认为 hover。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-row class="block-col-2">
    <el-col :span="12">
      <span class="demonstration">hover 激活</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          下拉菜单
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="Circle">狮子头</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
    <el-col :span="12">
      <span class="demonstration">click 激活</span>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          下拉菜单
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="Plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="Circle">狮子头</el-dropdown-item>
            <el-dropdown-item icon="CirclePlus">螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 菜单隐藏方式

可以通过 `hide-on-click` 属性来配置。下拉菜单默认在点击菜单项后会被隐藏，将 `hide-on-click` 属性设置为 false 可以关闭此功能。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown :hide-on-click="false">
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>
```

### 指令事件

点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      下拉菜单
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">黄金糕</el-dropdown-item>
        <el-dropdown-item command="b">狮子头</el-dropdown-item>
        <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
        <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
        <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'

const handleCommand = (command) => {
  console.log('click on item ' + command)
}
</script>
```

### 不同尺寸

Dropdown 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。使用 `size` 属性配置尺寸，可选的尺寸大小有: large, default 或 small。<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

```vue
<template>
  <el-dropdown split-button type="primary" size="large">
    大型下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary">
    默认下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  
  <el-dropdown split-button type="primary" size="small">
    小型下拉菜单
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
```

## API

### Dropdown Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| type | 菜单按钮类型，同 Button 组件一样，仅在 split-button 为 true 的情况下有效 | enum | '' |
| size | 菜单尺寸，在 split-button 为 true 的情况下也对触发按钮生效 | enum | '' |
| max-height | 菜单最大高度 | string / number | '' |
| split-button | 下拉触发元素呈现为按钮组 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| placement | 菜单弹出位置 | enum | bottom |
| trigger | 触发下拉的行为 | enum | hover |
| hide-on-click | 是否在点击菜单项后隐藏菜单 | boolean | true |
| show-timeout | 展开下拉菜单的延时，仅在 trigger 为 hover 时有效 | number | 150 |
| hide-timeout | 收起下拉菜单的延时（仅在 trigger 为 hover 时有效） | number | 150 |
| tabindex | Dropdown 组件的 tabindex | number / string | 0 |
| teleported | 是否将下拉列表插入至 body 元素 | boolean | true |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Events

| 事件名 | 说明 | 类型 |
|--------|------|------|
| click | split-button 为 true 时，点击左侧按钮的回调 | Function |
| command | 当下拉项被点击时触发，参数是从下拉菜单中发送的命令 | Function |
| visible-change | 当下拉菜单出现/消失时触发器, 当它出现时, 参数将是 true, 否则将是 false | Function |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Slots

| 插槽名 | 说明 | 子标签 |
|--------|------|--------|
| default | 下拉菜单的内容。注意：必须是有效的 html DOM 元素（例如 `<span>`、`<button>` 等）或 el-component，以附加监听触发器 | — |
| dropdown | 下拉列表，通常是 `<el-dropdown-menu>` 组件 | Dropdown-Menu |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown Exposes

| 方法名 | 说明 | 类型 |
|--------|------|------|
| handleOpen | 打开下拉菜单 | Function |
| handleClose | 关闭下拉菜单 | Function |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| command | 派发到command回调函数的指令参数 | string / number / object | — |
| disabled | 是否禁用 | boolean | false |
| divided | 是否显示分隔符 | boolean | false |
| icon | 自定义图标 | string / Component | — |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

### Dropdown-Item Slots

| 插槽名 | 说明 |
|--------|------|
| default | 自定义Dropdown-Item内容 |

<mcreference link="https://element-plus.org/zh-CN/component/dropdown.html" index="4">4</mcreference>

## 最佳实践

1. **触发方式选择**：根据使用场景选择合适的触发方式，hover 适合快速操作，click 适合需要确认的操作
2. **菜单项数量**：避免菜单项过多，必要时可以使用分组或二级菜单
3. **禁用状态**：合理使用禁用状态，并提供相应的提示信息
4. **分隔符使用**：使用分隔符对相关功能进行分组，提升用户体验
5. **响应式设计**：在移动端考虑使用更大的触发区域和菜单项

## 常见问题

### Q: 下拉菜单不显示？
A: 检查是否正确使用了 `#dropdown` 插槽，确保 `el-dropdown-menu` 和 `el-dropdown-item` 的嵌套关系正确。

### Q: 如何阻止菜单项点击后自动关闭？
A: 设置 `hide-on-click="false"` 属性，菜单将不会在点击菜单项后自动关闭。

### Q: 如何自定义下拉菜单的位置？
A: 使用 `placement` 属性设置菜单弹出位置，支持 6 个位置选项。

### Q: split-button 模式下如何处理左侧按钮点击？
A: 监听 `@click` 事件处理左侧按钮点击，监听 `@command` 事件处理下拉菜单项点击。