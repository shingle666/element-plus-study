# Radio 单选框

## 概述

Radio 单选框组件用于在一组选项中选择单个选项。它是表单中最常用的组件之一，提供了多种样式和配置选项，支持单个单选框和单选框组的使用方式。

## 学习目标

- 掌握 Radio 的基本概念和使用场景
- 学会基础单选框的使用方法
- 了解单选框组的配置和管理
- 掌握不同样式的单选框实现
- 学会单选框的状态控制和事件处理
- 了解单选框的尺寸和禁用状态
- 掌握 API 的完整使用方法

## 基础用法

### 基本单选框

最简单的单选框用法：

```vue
<template>
  <div>
    <el-radio v-model="radio" label="1">选项A</el-radio>
    <el-radio v-model="radio" label="2">选项B</el-radio>
    <p>选中的值：{{ radio }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio = ref('1')
</script>
```

### 禁用状态

通过 `disabled` 属性来禁用单选框：

```vue
<template>
  <div>
    <el-radio v-model="radio1" label="禁用" disabled>禁用</el-radio>
    <el-radio v-model="radio1" label="选中且禁用" disabled>选中且禁用</el-radio>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radio1 = ref('选中且禁用')
</script>
```

## 单选框组

### 基础单选框组

使用 `el-radio-group` 元素能把多个 radio 管理为一组：

```vue
<template>
  <div>
    <el-radio-group v-model="radioGroup">
      <el-radio label="上海">上海</el-radio>
      <el-radio label="北京">北京</el-radio>
      <el-radio label="广州">广州</el-radio>
      <el-radio label="深圳">深圳</el-radio>
    </el-radio-group>
    <p>选中的城市：{{ radioGroup }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioGroup = ref('上海')
</script>
```

### 按钮样式

使用 `el-radio-button` 元素来实现按钮样式的单选框：

```vue
<template>
  <div>
    <h4>默认按钮样式</h4>
    <el-radio-group v-model="radioButton1">
      <el-radio-button label="上海">上海</el-radio-button>
      <el-radio-button label="北京">北京</el-radio-button>
      <el-radio-button label="广州">广州</el-radio-button>
      <el-radio-button label="深圳">深圳</el-radio-button>
    </el-radio-group>
    
    <h4>禁用状态</h4>
    <el-radio-group v-model="radioButton2">
      <el-radio-button label="上海">上海</el-radio-button>
      <el-radio-button label="北京" disabled>北京</el-radio-button>
      <el-radio-button label="广州">广州</el-radio-button>
      <el-radio-button label="深圳">深圳</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioButton1 = ref('上海')
const radioButton2 = ref('上海')
</script>
```

### 带有边框

设置 `border` 属性可以渲染为带有边框的单选框：

```vue
<template>
  <div>
    <h4>带边框的单选框</h4>
    <el-radio v-model="radioBorder1" label="1" border>选项A</el-radio>
    <el-radio v-model="radioBorder1" label="2" border>选项B</el-radio>
    
    <h4>带边框的单选框组</h4>
    <el-radio-group v-model="radioBorder2">
      <el-radio label="上海" border>上海</el-radio>
      <el-radio label="北京" border>北京</el-radio>
      <el-radio label="广州" border disabled>广州</el-radio>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioBorder1 = ref('1')
const radioBorder2 = ref('上海')
</script>
```

## 尺寸

使用 `size` 属性来设置单选框的尺寸：

```vue
<template>
  <div>
    <h4>大尺寸</h4>
    <el-radio-group v-model="radioSize1" size="large">
      <el-radio-button label="上海">上海</el-radio-button>
      <el-radio-button label="北京">北京</el-radio-button>
      <el-radio-button label="广州">广州</el-radio-button>
    </el-radio-group>
    
    <h4>默认尺寸</h4>
    <el-radio-group v-model="radioSize2">
      <el-radio-button label="上海">上海</el-radio-button>
      <el-radio-button label="北京">北京</el-radio-button>
      <el-radio-button label="广州">广州</el-radio-button>
    </el-radio-group>
    
    <h4>小尺寸</h4>
    <el-radio-group v-model="radioSize3" size="small">
      <el-radio-button label="上海">上海</el-radio-button>
      <el-radio-button label="北京">北京</el-radio-button>
      <el-radio-button label="广州">广州</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const radioSize1 = ref('上海')
const radioSize2 = ref('上海')
const radioSize3 = ref('上海')
</script>
```

## 实际应用示例

### 用户偏好设置表单

```vue
<template>
  <div class="preference-form">
    <h3>用户偏好设置</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="male">男</el-radio>
          <el-radio label="female">女</el-radio>
          <el-radio label="other">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="年龄段">
        <el-radio-group v-model="form.ageGroup">
          <el-radio-button label="18-25">18-25岁</el-radio-button>
          <el-radio-button label="26-35">26-35岁</el-radio-button>
          <el-radio-button label="36-45">36-45岁</el-radio-button>
          <el-radio-button label="46+">46岁以上</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="职业">
        <el-radio-group v-model="form.profession">
          <el-radio label="developer" border>开发者</el-radio>
          <el-radio label="designer" border>设计师</el-radio>
          <el-radio label="manager" border>管理者</el-radio>
          <el-radio label="student" border>学生</el-radio>
          <el-radio label="other" border>其他</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="主题偏好">
        <el-radio-group v-model="form.theme" size="large">
          <el-radio-button label="light">浅色主题</el-radio-button>
          <el-radio-button label="dark">深色主题</el-radio-button>
          <el-radio-button label="auto">跟随系统</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="语言偏好">
        <el-radio-group v-model="form.language" @change="handleLanguageChange">
          <el-radio label="zh-CN">简体中文</el-radio>
          <el-radio label="zh-TW">繁体中文</el-radio>
          <el-radio label="en-US">English</el-radio>
          <el-radio label="ja-JP">日本語</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="savePreferences">
          保存设置
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="savedPreferences" class="preferences-preview">
      <h4>当前设置：</h4>
      <pre>{{ JSON.stringify(savedPreferences, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  gender: 'male',
  ageGroup: '26-35',
  profession: 'developer',
  theme: 'light',
  language: 'zh-CN'
})

const savedPreferences = ref(null)

const handleLanguageChange = (value) => {
  ElMessage.info(`语言已切换为: ${getLanguageName(value)}`)
}

const getLanguageName = (code) => {
  const languages = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en-US': 'English',
    'ja-JP': '日本語'
  }
  return languages[code] || code
}

const savePreferences = () => {
  savedPreferences.value = { ...form }
  ElMessage.success('偏好设置保存成功！')
}

const resetForm = () => {
  form.gender = 'male'
  form.ageGroup = '26-35'
  form.profession = 'developer'
  form.theme = 'light'
  form.language = 'zh-CN'
  savedPreferences.value = null
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.preference-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.preferences-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preferences-preview pre {
  margin: 0;
  font-size: 12px;
}
</style>
```

### 问卷调查组件

```vue
<template>
  <div class="survey-form">
    <h3>产品满意度调查</h3>
    
    <el-form :model="survey" label-width="200px">
      <el-form-item label="您的使用频率是？">
        <el-radio-group v-model="survey.frequency">
          <el-radio label="daily">每天使用</el-radio>
          <el-radio label="weekly">每周使用</el-radio>
          <el-radio label="monthly">每月使用</el-radio>
          <el-radio label="rarely">很少使用</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="您认为最重要的功能是？">
        <el-radio-group v-model="survey.importantFeature">
          <el-radio label="performance" border>性能</el-radio>
          <el-radio label="ui" border>界面设计</el-radio>
          <el-radio label="features" border>功能丰富</el-radio>
          <el-radio label="stability" border>稳定性</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="您会推荐给朋友吗？">
        <el-radio-group v-model="survey.recommend" size="large">
          <el-radio-button label="definitely">一定会</el-radio-button>
          <el-radio-button label="probably">可能会</el-radio-button>
          <el-radio-button label="maybe">不确定</el-radio-button>
          <el-radio-button label="no">不会</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="您的整体满意度？">
        <el-radio-group v-model="survey.satisfaction">
          <el-radio label="5">非常满意</el-radio>
          <el-radio label="4">满意</el-radio>
          <el-radio label="3">一般</el-radio>
          <el-radio label="2">不满意</el-radio>
          <el-radio label="1">非常不满意</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitSurvey">
          提交调查
        </el-button>
        <el-button @click="clearSurvey">
          清空
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="surveyResult" class="survey-result">
      <h4>调查结果：</h4>
      <el-alert
        :title="getSurveyResultMessage()"
        type="success"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const survey = reactive({
  frequency: '',
  importantFeature: '',
  recommend: '',
  satisfaction: ''
})

const surveyResult = ref(null)

const submitSurvey = () => {
  // 验证表单完整性
  const requiredFields = ['frequency', 'importantFeature', 'recommend', 'satisfaction']
  const missingFields = requiredFields.filter(field => !survey[field])
  
  if (missingFields.length > 0) {
    ElMessage.warning('请完成所有问题后再提交')
    return
  }
  
  surveyResult.value = { ...survey }
  ElMessage.success('调查提交成功，感谢您的参与！')
}

const clearSurvey = () => {
  survey.frequency = ''
  survey.importantFeature = ''
  survey.recommend = ''
  survey.satisfaction = ''
  surveyResult.value = null
  ElMessage.info('调查已清空')
}

const getSurveyResultMessage = () => {
  if (!surveyResult.value) return ''
  
  const satisfaction = parseInt(surveyResult.value.satisfaction)
  if (satisfaction >= 4) {
    return '感谢您的高度评价！我们会继续努力提供更好的服务。'
  } else if (satisfaction >= 3) {
    return '感谢您的反馈！我们会根据您的建议持续改进。'
  } else {
    return '非常抱歉没有达到您的期望，我们会认真对待您的意见并积极改进。'
  }
}
</script>

<style scoped>
.survey-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.survey-result {
  margin-top: 20px;
}
</style>
```

## API 文档

### Radio Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string / number / boolean | — |
| label | Radio 的 value | string / number / boolean | — |
| disabled | 是否禁用 | boolean | false |
| border | 是否显示边框 | boolean | false |
| size | Radio 的尺寸 | enum | — |
| name | 原生 name 属性 | string | — |
| validate-event | 是否触发表单验证 | boolean | true |

### Radio Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 绑定值变化时触发的事件 | Function |

### Radio Slots

| 名称 | 说明 |
|------|------|
| default | Radio 的内容 |

### RadioGroup Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model-value / v-model | 绑定值 | string / number / boolean | — |
| size | 单选框组尺寸 | enum | — |
| disabled | 是否禁用 | boolean | false |
| text-color | 按钮形式的 Radio 激活时的文本颜色 | string | #ffffff |
| fill | 按钮形式的 Radio 激活时的填充色和边框色 | string | #409eff |
| validate-event | 是否触发表单验证 | boolean | true |
| label | 为屏幕阅读器准备的标签 | string | — |
| name | 原生 name 属性 | string | — |
| id | 原生 id 属性 | string | — |

### RadioGroup Events

| 名称 | 说明 | 类型 |
|------|------|------|
| change | 绑定值变化时触发的事件 | Function |

### RadioGroup Slots

| 名称 | 说明 |
|------|------|
| default | 自定义默认内容 |

### RadioButton Attributes

| 名称 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | Radio 的 value | string / number | — |
| disabled | 是否禁用 | boolean | false |
| name | 原生 name 属性 | string | — |

### RadioButton Slots

| 名称 | 说明 |
|------|------|
| default | Radio 的内容 |

## 实践练习

### 练习1：动态单选框组

创建一个可以动态添加选项的单选框组：

```vue
<template>
  <div class="dynamic-radio">
    <h3>动态单选框组</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="添加选项">
        <el-input
          v-model="newOption"
          placeholder="输入新选项"
          @keyup.enter="addOption"
        >
          <template #append>
            <el-button @click="addOption">添加</el-button>
          </template>
        </el-input>
      </el-form-item>
      
      <el-form-item label="选择选项">
        <el-radio-group v-model="form.selectedOption">
          <el-radio
            v-for="(option, index) in options"
            :key="index"
            :label="option.value"
            border
          >
            {{ option.label }}
            <el-button
              type="danger"
              size="small"
              text
              @click.stop="removeOption(index)"
            >
              删除
            </el-button>
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    
    <div class="result">
      <p>当前选中：{{ form.selectedOption }}</p>
      <p>总选项数：{{ options.length }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const newOption = ref('')
const form = reactive({
  selectedOption: ''
})

const options = ref([
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
])

const addOption = () => {
  if (!newOption.value.trim()) {
    ElMessage.warning('请输入选项内容')
    return
  }
  
  const value = `option${Date.now()}`
  options.value.push({
    label: newOption.value.trim(),
    value: value
  })
  
  newOption.value = ''
  ElMessage.success('选项添加成功')
}

const removeOption = (index) => {
  const removedOption = options.value[index]
  
  // 如果删除的是当前选中的选项，清空选择
  if (form.selectedOption === removedOption.value) {
    form.selectedOption = ''
  }
  
  options.value.splice(index, 1)
  ElMessage.info('选项已删除')
}
</script>

<style scoped>
.dynamic-radio {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
</style>
```

### 练习2：条件显示单选框

创建一个根据条件显示不同选项的单选框：

```vue
<template>
  <div class="conditional-radio">
    <h3>条件显示单选框</h3>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户类型">
        <el-radio-group v-model="form.userType" @change="handleUserTypeChange">
          <el-radio-button label="student">学生</el-radio-button>
          <el-radio-button label="teacher">教师</el-radio-button>
          <el-radio-button label="enterprise">企业</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'student'" label="年级">
        <el-radio-group v-model="form.grade">
          <el-radio label="freshman">大一</el-radio>
          <el-radio label="sophomore">大二</el-radio>
          <el-radio label="junior">大三</el-radio>
          <el-radio label="senior">大四</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'teacher'" label="职称">
        <el-radio-group v-model="form.title">
          <el-radio label="assistant" border>助教</el-radio>
          <el-radio label="lecturer" border>讲师</el-radio>
          <el-radio label="associate" border>副教授</el-radio>
          <el-radio label="professor" border>教授</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item v-if="form.userType === 'enterprise'" label="企业规模">
        <el-radio-group v-model="form.companySize">
          <el-radio-button label="startup">初创企业</el-radio-button>
          <el-radio-button label="small">小型企业</el-radio-button>
          <el-radio-button label="medium">中型企业</el-radio-button>
          <el-radio-button label="large">大型企业</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">
          提交
        </el-button>
        <el-button @click="resetForm">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="formResult" class="form-result">
      <h4>表单结果：</h4>
      <pre>{{ JSON.stringify(formResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  userType: '',
  grade: '',
  title: '',
  companySize: ''
})

const formResult = ref(null)

const handleUserTypeChange = (value) => {
  // 清空其他字段
  form.grade = ''
  form.title = ''
  form.companySize = ''
  
  ElMessage.info(`用户类型已切换为: ${getUserTypeName(value)}`)
}

const getUserTypeName = (type) => {
  const types = {
    student: '学生',
    teacher: '教师',
    enterprise: '企业'
  }
  return types[type] || type
}

const submitForm = () => {
  if (!form.userType) {
    ElMessage.warning('请选择用户类型')
    return
  }
  
  // 根据用户类型验证必填字段
  if (form.userType === 'student' && !form.grade) {
    ElMessage.warning('请选择年级')
    return
  }
  
  if (form.userType === 'teacher' && !form.title) {
    ElMessage.warning('请选择职称')
    return
  }
  
  if (form.userType === 'enterprise' && !form.companySize) {
    ElMessage.warning('请选择企业规模')
    return
  }
  
  formResult.value = { ...form }
  ElMessage.success('表单提交成功！')
}

const resetForm = () => {
  form.userType = ''
  form.grade = ''
  form.title = ''
  form.companySize = ''
  formResult.value = null
  ElMessage.info('表单已重置')
}
</script>

<style scoped>
.conditional-radio {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.form-result pre {
  margin: 0;
  font-size: 12px;
}
</style>
```

## 常见问题

### 1. 单选框值不更新

**问题**：单选框的值没有正确绑定或更新

**解决方案**：
```vue
<!-- 错误写法 -->
<el-radio v-model="value" :label="item">{{ item }}</el-radio>

<!-- 正确写法 -->
<el-radio v-model="value" :label="item.value">{{ item.label }}</el-radio>
```

### 2. 单选框组事件重复触发

**问题**：在单选框组中，change 事件被重复触发

**解决方案**：
```vue
<!-- 只在 radio-group 上监听事件 -->
<el-radio-group v-model="value" @change="handleChange">
  <el-radio label="1">选项1</el-radio>
  <el-radio label="2">选项2</el-radio>
</el-radio-group>
```

### 3. 动态选项的 key 问题

**问题**：动态生成的单选框选项可能出现渲染问题

**解决方案**：
```vue
<el-radio
  v-for="option in options"
  :key="option.id"
  :label="option.value"
>
  {{ option.label }}
</el-radio>
```

## 最佳实践

1. **语义化标签**：为单选框组提供有意义的标签
2. **合理分组**：相关的选项应该放在同一个单选框组中
3. **状态管理**：合理使用禁用状态来引导用户操作
4. **用户反馈**：在值变化时提供适当的反馈
5. **可访问性**：确保键盘导航和屏幕阅读器支持

## 总结

Radio 单选框是表单中的基础组件，支持：

- 基础单选框和单选框组
- 多种样式（默认、按钮、边框）
- 尺寸控制和状态管理
- 丰富的事件处理机制
- 良好的可访问性支持

掌握 Radio 组件的使用，能够帮助你构建更加友好和高效的表单界面。

## 参考资料

- [Element Plus Radio 官方文档](https://element-plus.org/zh-CN/component/radio.html)
- [Vue 3 响应式 API](https://cn.vuejs.org/api/reactivity-core.html)
- [Web 可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)