# 第59天：Element Plus 国际化系统详解

## 学习目标
- 深入理解 Element Plus 国际化架构
- 掌握多语言配置和切换方法
- 学习自定义语言包的创建
- 了解国际化的最佳实践

## 学习内容

### 1. 国际化系统架构

#### 1.1 核心概念
- **Locale**: 语言环境标识符
- **Language Pack**: 语言包，包含翻译文本
- **ConfigProvider**: 全局配置提供者
- **useLocale**: 国际化组合式函数

#### 1.2 系统结构
```
packages/locale/
├── lang/              # 语言包目录
│   ├── zh-cn.ts      # 简体中文
│   ├── en.ts         # 英文
│   ├── ja.ts         # 日文
│   └── ...           # 其他语言
├── index.ts          # 入口文件
└── types.ts          # 类型定义
```

### 2. 语言包结构

#### 2.1 标准语言包格式
```typescript
// packages/locale/lang/zh-cn.ts
export default {
  name: 'zh-cn',
  el: {
    breadcrumb: {
      label: '面包屑导航'
    },
    colorpicker: {
      confirm: '确定',
      clear: '清空',
      defaultLabel: '颜色选择器',
      description: '当前颜色是 {color}。按 Enter 键选择新颜色。'
    },
    datepicker: {
      now: '此刻',
      today: '今天',
      cancel: '取消',
      clear: '清空',
      confirm: '确定',
      dateTablePrompt: '使用方向键并按 Enter 键选择日期',
      monthTablePrompt: '使用方向键并按 Enter 键选择月份',
      yearTablePrompt: '使用方向键并按 Enter 键选择年份',
      selectedDate: '已选日期',
      selectDate: '选择日期',
      selectTime: '选择时间',
      startDate: '开始日期',
      startTime: '开始时间',
      endDate: '结束日期',
      endTime: '结束时间',
      prevYear: '前一年',
      nextYear: '后一年',
      prevMonth: '上个月',
      nextMonth: '下个月',
      year: '年',
      month1: '1 月',
      month2: '2 月',
      // ... 更多月份
      weeks: {
        sun: '日',
        mon: '一',
        tue: '二',
        wed: '三',
        thu: '四',
        fri: '五',
        sat: '六'
      },
      months: {
        jan: '一月',
        feb: '二月',
        // ... 更多月份
      }
    },
    // ... 其他组件的翻译
  }
}
```

#### 2.2 英文语言包
```typescript
// packages/locale/lang/en.ts
export default {
  name: 'en',
  el: {
    breadcrumb: {
      label: 'Breadcrumb'
    },
    colorpicker: {
      confirm: 'OK',
      clear: 'Clear',
      defaultLabel: 'color picker',
      description: 'current color is {color}. press enter to select a new color.'
    },
    datepicker: {
      now: 'Now',
      today: 'Today',
      cancel: 'Cancel',
      clear: 'Clear',
      confirm: 'OK',
      selectDate: 'Select date',
      selectTime: 'Select time',
      startDate: 'Start Date',
      startTime: 'Start Time',
      endDate: 'End Date',
      endTime: 'End Time',
      prevYear: 'Previous Year',
      nextYear: 'Next Year',
      prevMonth: 'Previous Month',
      nextMonth: 'Next Month',
      year: '',
      month1: 'January',
      month2: 'February',
      // ... 更多内容
    }
  }
}
```

### 3. 国际化配置

#### 3.1 全局配置
```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const app = createApp(App)

// 方法1：直接配置语言
app.use(ElementPlus, {
  locale: zhCn,
})

// 方法2：使用 ConfigProvider
app.mount('#app')
```

#### 3.2 使用 ConfigProvider
```vue
<template>
  <el-config-provider :locale="locale">
    <app />
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const locale = ref(zhCn)

// 切换语言
const switchLanguage = (lang: string) => {
  locale.value = lang === 'zh-cn' ? zhCn : en
}
</script>
```

### 4. 动态语言切换

#### 4.1 语言切换组件
```vue
<template>
  <div class="language-switcher">
    <el-dropdown @command="handleLanguageChange">
      <span class="el-dropdown-link">
        {{ currentLanguage.label }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item 
            v-for="lang in languages" 
            :key="lang.value"
            :command="lang.value"
            :disabled="lang.value === currentLanguage.value"
          >
            {{ lang.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import ja from 'element-plus/es/locale/lang/ja'

const languages = [
  { value: 'zh-cn', label: '简体中文', locale: zhCn },
  { value: 'en', label: 'English', locale: en },
  { value: 'ja', label: '日本語', locale: ja }
]

const currentLang = ref('zh-cn')

const currentLanguage = computed(() => 
  languages.find(lang => lang.value === currentLang.value)
)

const emit = defineEmits(['language-change'])

const handleLanguageChange = (langValue: string) => {
  currentLang.value = langValue
  const language = languages.find(lang => lang.value === langValue)
  if (language) {
    emit('language-change', language.locale)
  }
}
</script>
```

#### 4.2 全局语言状态管理
```typescript
// stores/locale.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Language } from 'element-plus/es/locale'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<Language>(zhCn)
  const currentLang = ref('zh-cn')
  
  const locales = {
    'zh-cn': zhCn,
    'en': en
  }
  
  const setLocale = (lang: string) => {
    if (locales[lang]) {
      currentLang.value = lang
      currentLocale.value = locales[lang]
      
      // 保存到本地存储
      localStorage.setItem('preferred-language', lang)
    }
  }
  
  const initLocale = () => {
    const savedLang = localStorage.getItem('preferred-language')
    if (savedLang && locales[savedLang]) {
      setLocale(savedLang)
    }
  }
  
  return {
    currentLocale,
    currentLang,
    setLocale,
    initLocale
  }
})
```

### 5. 自定义语言包

#### 5.1 创建自定义语言包
```typescript
// locale/custom-zh-cn.ts
import type { Language } from 'element-plus/es/locale'

const customZhCn: Language = {
  name: 'custom-zh-cn',
  el: {
    // 继承默认语言包
    ...zhCnDefault.el,
    
    // 自定义翻译
    datepicker: {
      ...zhCnDefault.el.datepicker,
      confirm: '确认选择',
      cancel: '取消选择'
    },
    
    // 添加新的翻译
    custom: {
      welcome: '欢迎使用我们的系统',
      logout: '退出登录',
      settings: '系统设置'
    }
  }
}

export default customZhCn
```

#### 5.2 扩展语言包类型
```typescript
// types/locale.d.ts
declare module 'element-plus/es/locale' {
  interface Language {
    el: {
      // 扩展现有类型
      custom?: {
        welcome: string
        logout: string
        settings: string
      }
    }
  }
}
```

### 6. useLocale 组合式函数

#### 6.1 基础用法
```typescript
// composables/useI18n.ts
import { computed } from 'vue'
import { useLocale } from 'element-plus'

export function useI18n() {
  const { t } = useLocale()
  
  // 获取翻译文本
  const getTranslation = (key: string, fallback?: string) => {
    return t(key) || fallback || key
  }
  
  // 格式化翻译文本
  const formatTranslation = (key: string, params: Record<string, any>) => {
    let text = t(key)
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param])
    })
    return text
  }
  
  return {
    t,
    getTranslation,
    formatTranslation
  }
}
```

#### 6.2 在组件中使用
```vue
<template>
  <div>
    <h1>{{ t('el.datepicker.selectDate') }}</h1>
    <p>{{ formatMessage('welcome', { name: userName }) }}</p>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const { t, formatTranslation } = useI18n()
const userName = ref('张三')

const formatMessage = (key: string, params: Record<string, any>) => {
  return formatTranslation(`el.custom.${key}`, params)
}
</script>
```

### 7. 实践练习

#### 练习1：多语言应用搭建
```vue
<!-- App.vue -->
<template>
  <el-config-provider :locale="currentLocale">
    <div class="app">
      <header>
        <language-switcher @language-change="handleLanguageChange" />
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
const currentLocale = ref(localeStore.currentLocale)

const handleLanguageChange = (locale) => {
  currentLocale.value = locale
  localeStore.setLocale(locale.name)
}

// 初始化语言设置
localeStore.initLocale()
</script>
```

#### 练习2：自定义翻译组件
```vue
<template>
  <div class="custom-form">
    <el-form :model="form" :rules="rules">
      <el-form-item :label="t('form.username')" prop="username">
        <el-input v-model="form.username" :placeholder="t('form.enterUsername')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">
          {{ t('form.submit') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const form = reactive({
  username: ''
})

const rules = {
  username: [
    { required: true, message: t('validation.required'), trigger: 'blur' }
  ]
}

const handleSubmit = () => {
  console.log('Form submitted:', form)
}
</script>
```

## 学习资源
- [Element Plus 国际化文档](https://element-plus.org/zh-CN/guide/i18n.html)
- [Vue I18n 官方文档](https://vue-i18n.intlify.dev/)
- [MDN 国际化指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)

## 作业
1. 创建一个支持中英日三语言的 Element Plus 应用
2. 实现自定义语言包和翻译扩展
3. 添加语言切换的持久化存储

## 下一步
明天我们将学习 Element Plus 多语言切换实现与动态配置。