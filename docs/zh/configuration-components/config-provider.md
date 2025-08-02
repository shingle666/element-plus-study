# Config Provider 全局配置

## 概述

Config Provider 被用来提供全局的配置选项，让你的配置能够在全局都能够被访问到。通过 Config Provider，你可以配置多语言、全局组件大小、按钮样式、消息配置等全局设置。

## 学习目标

- 掌握 Config Provider 的基本概念和作用
- 学会配置国际化（i18n）设置
- 了解全局组件大小和样式配置
- 掌握按钮、链接、消息等组件的全局配置
- 学会空值配置和清空值配置
- 了解实验性功能的使用

## 基础用法

### 基本配置

```vue
<template>
  <el-config-provider :locale="locale" :size="size">
    <el-button>按钮</el-button>
    <el-input placeholder="请输入内容"></el-input>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = ref(zhCn)
const size = ref('default')
</script>
```

### 国际化配置

通过 Config Provider 来配置多语言，让你的应用可以随时切换语言：

```vue
<template>
  <el-config-provider :locale="currentLocale">
    <div>
      <el-button @click="switchLanguage">切换语言</el-button>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
      />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const date = ref('')
const currentLocale = ref(zhCn)
const isZhCn = ref(true)

const switchLanguage = () => {
  isZhCn.value = !isZhCn.value
  currentLocale.value = isZhCn.value ? zhCn : en
}
</script>
```

## 全局组件配置

### 全局尺寸配置

```vue
<template>
  <el-config-provider :size="globalSize">
    <div>
      <el-radio-group v-model="globalSize">
        <el-radio value="large">大号</el-radio>
        <el-radio value="default">默认</el-radio>
        <el-radio value="small">小号</el-radio>
      </el-radio-group>
      
      <div style="margin-top: 20px;">
        <el-button>按钮</el-button>
        <el-input placeholder="输入框" style="width: 200px; margin-left: 10px;" />
        <el-select placeholder="选择器" style="width: 200px; margin-left: 10px;">
          <el-option label="选项1" value="1" />
          <el-option label="选项2" value="2" />
        </el-select>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const globalSize = ref('default')
</script>
```

### 按钮全局配置

```vue
<template>
  <el-config-provider :button="buttonConfig">
    <div>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button>中文按钮</el-button>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const buttonConfig = ref({
  autoInsertSpace: true, // 两个中文字符之间自动插入空格
  plain: false,          // 是否为朴素按钮
  round: false           // 是否为圆角按钮
})
</script>
```

### 消息全局配置

```vue
<template>
  <el-config-provider :message="messageConfig">
    <div>
      <el-button @click="showMessage">显示消息</el-button>
      <el-button @click="showMultipleMessages">显示多条消息</el-button>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const messageConfig = ref({
  max: 3,           // 可同时显示的消息最大数量
  grouping: true,   // 合并内容相同的消息
  duration: 3000,   // 显示时间
  showClose: true,  // 是否显示关闭按钮
  offset: 20        // 距离窗口顶部的偏移量
})

const showMessage = () => {
  ElMessage.success('这是一条成功消息')
}

const showMultipleMessages = () => {
  for (let i = 1; i <= 5; i++) {
    ElMessage.info(`消息 ${i}`)
  }
}
</script>
```

## 空值配置

### 空值和清空值配置

```vue
<template>
  <el-config-provider 
    :empty-values="emptyValues" 
    :value-on-clear="valueOnClear"
  >
    <div>
      <el-select 
        v-model="selectValue" 
        placeholder="请选择" 
        clearable
        style="width: 200px;"
      >
        <el-option label="选项1" value="option1" />
        <el-option label="选项2" value="option2" />
        <el-option label="空字符串" value="" />
      </el-select>
      
      <el-date-picker
        v-model="dateValue"
        type="date"
        placeholder="选择日期"
        clearable
        style="margin-left: 10px;"
      />
      
      <div style="margin-top: 10px;">
        <p>选择器值: {{ selectValue }}</p>
        <p>日期值: {{ dateValue }}</p>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const selectValue = ref('')
const dateValue = ref(null)

// 配置空值：不包含空字符串
const emptyValues = ref([undefined, null])

// 配置清空时的值
const valueOnClear = ref(() => undefined)
</script>
```

## 高级配置

### 命名空间配置

```vue
<template>
  <el-config-provider namespace="my-app">
    <el-button>自定义命名空间按钮</el-button>
  </el-config-provider>
</template>

<style>
/* 使用自定义命名空间的样式 */
.my-app-button {
  --el-button-bg-color: #custom-color;
}
</style>
```

### zIndex 配置

```vue
<template>
  <el-config-provider :z-index="3000">
    <el-button @click="showDialog">显示对话框</el-button>
    <el-dialog v-model="dialogVisible" title="提示">
      <span>这个对话框的 z-index 从 3000 开始</span>
    </el-dialog>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)

const showDialog = () => {
  dialogVisible.value = true
}
</script>
```

## 实验性功能

```vue
<template>
  <el-config-provider :experimental-features="experimentalConfig">
    <!-- 实验性功能将在这里生效 -->
    <div>实验性功能演示</div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'

// 实验性功能配置（目前暂无具体功能）
const experimentalConfig = ref({
  // 未来的实验性功能将在这里配置
})
</script>
```

## API 文档

### Config Provider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| locale | 翻译文本对象 | object | languages |
| size | 全局组件大小 | enum | default |
| zIndex | 全局初始化 zIndex 的值 | number | — |
| namespace | 全局组件类名称前缀 | string | el |
| button | 按钮相关配置 | object | 详见下表 |
| link | 链接相关的配置 | object | 详见下表 |
| message | 消息相关配置 | object | 详见下表 |
| experimental-features | 实验阶段的功能 | object | — |
| empty-values | 输入类组件空值 | array | — |
| value-on-clear | 输入类组件清空值 | string/number/boolean/Function | — |

### Button Attributes

| 参数 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| autoInsertSpace | 两个中文字符之间自动插入空格 | boolean | false |
| plain | 是否为朴素按钮 | boolean | false |
| round | 是否为圆角按钮 | boolean | false |

### Link Attributes

| 参数 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| type | 类型 | enum | default |
| underline | 控制下划线是否出现 | enum | hover |

### Message Attributes

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| max | 可同时显示的消息最大数量 | number | — |
| grouping | 合并内容相同的消息 | boolean | — |
| duration | 显示时间，单位为毫秒 | number | — |
| showClose | 是否显示关闭按钮 | boolean | — |
| offset | Message 距离窗口顶部的偏移量 | number | — |
| plain | 是否纯色 | boolean | — |

### Config Provider Slots

| 名称 | 描述 | Scope |
|------|------|-------|
| default | 自定义默认内容 | config: 提供全局配置 |

## 实践练习

### 练习1：多语言应用配置

创建一个支持中英文切换的应用：

```vue
<template>
  <el-config-provider :locale="currentLocale">
    <div class="language-demo">
      <el-button-group>
        <el-button 
          :type="isZhCn ? 'primary' : 'default'"
          @click="setLanguage('zh-cn')"
        >
          中文
        </el-button>
        <el-button 
          :type="!isZhCn ? 'primary' : 'default'"
          @click="setLanguage('en')"
        >
          English
        </el-button>
      </el-button-group>
      
      <div style="margin-top: 20px;">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
      
      <div style="margin-top: 20px;">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const date = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const language = ref('zh-cn')

const isZhCn = computed(() => language.value === 'zh-cn')
const currentLocale = computed(() => isZhCn.value ? zhCn : en)

const setLanguage = (lang) => {
  language.value = lang
}
</script>
```

### 练习2：主题配置系统

创建一个可以动态配置主题的系统：

```vue
<template>
  <el-config-provider 
    :size="globalConfig.size"
    :button="globalConfig.button"
    :message="globalConfig.message"
  >
    <div class="theme-config">
      <el-card header="主题配置">
        <el-form :model="globalConfig" label-width="120px">
          <el-form-item label="组件大小">
            <el-radio-group v-model="globalConfig.size">
              <el-radio value="large">大号</el-radio>
              <el-radio value="default">默认</el-radio>
              <el-radio value="small">小号</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="按钮配置">
            <el-checkbox v-model="globalConfig.button.autoInsertSpace">
              自动插入空格
            </el-checkbox>
            <el-checkbox v-model="globalConfig.button.plain">
              朴素按钮
            </el-checkbox>
            <el-checkbox v-model="globalConfig.button.round">
              圆角按钮
            </el-checkbox>
          </el-form-item>
          
          <el-form-item label="消息配置">
            <el-input-number 
              v-model="globalConfig.message.max" 
              :min="1" 
              :max="10"
              controls-position="right"
            />
            <span style="margin-left: 10px;">最大消息数</span>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card header="效果预览" style="margin-top: 20px;">
        <div>
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button>中文按钮</el-button>
        </div>
        
        <div style="margin-top: 10px;">
          <el-input placeholder="请输入内容" style="width: 200px;" />
          <el-button @click="showTestMessage" style="margin-left: 10px;">
            测试消息
          </el-button>
        </div>
      </el-card>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const globalConfig = ref({
  size: 'default',
  button: {
    autoInsertSpace: true,
    plain: false,
    round: false
  },
  message: {
    max: 3,
    grouping: true,
    duration: 3000,
    showClose: true,
    offset: 20
  }
})

let messageCount = 0
const showTestMessage = () => {
  messageCount++
  ElMessage.info(`测试消息 ${messageCount}`)
}
</script>
```

## 常见问题

### 1. 国际化配置不生效

**问题**：配置了 locale 但组件仍显示英文

**解决方案**：
- 确保正确导入了语言包
- 检查 Config Provider 是否正确包裹了需要国际化的组件
- 确认语言包版本与 Element Plus 版本匹配

### 2. 全局配置被局部配置覆盖

**问题**：组件的局部配置覆盖了全局配置

**解决方案**：
- 局部配置的优先级高于全局配置，这是正常行为
- 如需强制使用全局配置，移除组件的局部配置属性

### 3. 空值配置不生效

**问题**：empty-values 配置后仍然认为空字符串是空值

**解决方案**：
- 确保配置的组件支持空值配置
- 检查配置的数组格式是否正确
- 支持空值配置的组件有限，参考官方文档

## 最佳实践

1. **统一配置管理**：在应用根组件使用 Config Provider 进行全局配置
2. **按需配置**：只配置需要的属性，避免过度配置
3. **主题一致性**：使用全局配置保持应用主题的一致性
4. **国际化支持**：为多语言应用提前规划国际化配置
5. **性能考虑**：避免频繁更改全局配置，影响性能

## 总结

Config Provider 是 Element Plus 提供的强大全局配置工具，通过它可以：

- 实现应用的国际化配置
- 统一管理组件的全局样式和行为
- 配置消息、按钮、链接等组件的默认属性
- 处理空值和清空值的全局逻辑
- 为未来的实验性功能提供配置入口

掌握 Config Provider 的使用，能够帮助你构建更加一致和可维护的 Element Plus 应用。

## 参考资料

- [Element Plus Config Provider 官方文档](https://element-plus.org/zh-CN/component/config-provider.html)
- [Element Plus 国际化文档](https://element-plus.org/zh-CN/guide/i18n.html)
- [Element Plus 主题配置文档](https://element-plus.org/zh-CN/guide/theming.html)