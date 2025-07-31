# Internationalization and Localization

## Overview

Element Plus provides comprehensive internationalization (i18n) support, allowing you to create applications that work seamlessly across different languages and regions. This guide covers setting up i18n, using built-in locales, creating custom translations, and implementing advanced localization features.

## Basic Setup

### Installing Dependencies

```bash
npm install vue-i18n@9
```

### Basic Configuration

```javascript
// main.js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Import Element Plus locales
import enLocale from 'element-plus/es/locale/lang/en'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import esLocale from 'element-plus/es/locale/lang/es'

// Your custom messages
const messages = {
  en: {
    ...enLocale,
    message: {
      hello: 'Hello World',
      welcome: 'Welcome to our application'
    }
  },
  'zh-cn': {
    ...zhLocale,
    message: {
      hello: '你好世界',
      welcome: '欢迎使用我们的应用程序'
    }
  },
  es: {
    ...esLocale,
    message: {
      hello: 'Hola Mundo',
      welcome: 'Bienvenido a nuestra aplicación'
    }
  }
}

const i18n = createI18n({
  locale: 'en', // default locale
  fallbackLocale: 'en',
  messages
})

const app = createApp(App)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
```

### Component Usage

```vue
<template>
  <div>
    <h1>{{ $t('message.hello') }}</h1>
    <p>{{ $t('message.welcome') }}</p>
    
    <!-- Element Plus components will use the configured locale -->
    <el-date-picker 
      v-model="date" 
      type="date" 
      :placeholder="$t('el.datepicker.selectDate')"
    />
    
    <el-button @click="changeLocale">{{ $t('message.changeLanguage') }}</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const date = ref('')

const changeLocale = () => {
  locale.value = locale.value === 'en' ? 'zh-cn' : 'en'
}
</script>
```

## Element Plus Locale Configuration

### Using ConfigProvider

```vue
<template>
  <el-config-provider :locale="currentLocale">
    <div id="app">
      <!-- Your application content -->
      <el-date-picker v-model="date" type="date" />
      <el-pagination 
        :total="100" 
        :page-size="10" 
        layout="prev, pager, next"
      />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import enLocale from 'element-plus/es/locale/lang/en'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import esLocale from 'element-plus/es/locale/lang/es'
import frLocale from 'element-plus/es/locale/lang/fr'
import deLocale from 'element-plus/es/locale/lang/de'
import jaLocale from 'element-plus/es/locale/lang/ja'

const { locale } = useI18n()
const date = ref('')

const localeMap = {
  'en': enLocale,
  'zh-cn': zhLocale,
  'es': esLocale,
  'fr': frLocale,
  'de': deLocale,
  'ja': jaLocale
}

const currentLocale = computed(() => localeMap[locale.value] || enLocale)
</script>
```

### Global Locale Configuration

```javascript
// main.js
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)
app.use(ElementPlus, { locale })
```

## Available Locales

Element Plus supports numerous locales out of the box:

```javascript
// Common locales
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import es from 'element-plus/es/locale/lang/es'
import fr from 'element-plus/es/locale/lang/fr'
import de from 'element-plus/es/locale/lang/de'
import ja from 'element-plus/es/locale/lang/ja'
import ko from 'element-plus/es/locale/lang/ko'
import ru from 'element-plus/es/locale/lang/ru'
import it from 'element-plus/es/locale/lang/it'
import pt from 'element-plus/es/locale/lang/pt'
import ar from 'element-plus/es/locale/lang/ar'
import th from 'element-plus/es/locale/lang/th'
import vi from 'element-plus/es/locale/lang/vi'

// And many more...
const supportedLocales = {
  'en': en,
  'zh-cn': zhCn,
  'zh-tw': zhTw,
  'es': es,
  'fr': fr,
  'de': de,
  'ja': ja,
  'ko': ko,
  'ru': ru,
  'it': it,
  'pt': pt,
  'ar': ar,
  'th': th,
  'vi': vi
}
```

## Custom Locale Creation

### Creating a Custom Locale

```javascript
// locales/custom-en.js
export default {
  name: 'en',
  el: {
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
      month3: 'March',
      month4: 'April',
      month5: 'May',
      month6: 'June',
      month7: 'July',
      month8: 'August',
      month9: 'September',
      month10: 'October',
      month11: 'November',
      month12: 'December',
      weeks: {
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat'
      },
      months: {
        jan: 'Jan',
        feb: 'Feb',
        mar: 'Mar',
        apr: 'Apr',
        may: 'May',
        jun: 'Jun',
        jul: 'Jul',
        aug: 'Aug',
        sep: 'Sep',
        oct: 'Oct',
        nov: 'Nov',
        dec: 'Dec'
      }
    },
    select: {
      loading: 'Loading',
      noMatch: 'No matching data',
      noData: 'No data',
      placeholder: 'Select'
    },
    cascader: {
      noMatch: 'No matching data',
      loading: 'Loading',
      placeholder: 'Select',
      noData: 'No data'
    },
    pagination: {
      goto: 'Go to',
      pagesize: '/page',
      total: 'Total {total}',
      pageClassifier: '',
      page: 'Page',
      prev: 'Go to previous page',
      next: 'Go to next page',
      currentPage: 'page {pager}',
      prevPages: 'Previous {pager} pages',
      nextPages: 'Next {pager} pages'
    },
    messagebox: {
      title: 'Message',
      confirm: 'OK',
      cancel: 'Cancel',
      error: 'Illegal input'
    },
    upload: {
      deleteTip: 'press delete to remove',
      delete: 'Delete',
      preview: 'Preview',
      continue: 'Continue'
    },
    table: {
      emptyText: 'No Data',
      confirmFilter: 'Confirm',
      resetFilter: 'Reset',
      clearFilter: 'All',
      sumText: 'Sum'
    },
    tree: {
      emptyText: 'No data'
    },
    transfer: {
      noMatch: 'No matching data',
      noData: 'No data',
      titles: ['List 1', 'List 2'],
      filterPlaceholder: 'Enter keyword',
      noCheckedFormat: '{total} items',
      hasCheckedFormat: '{checked}/{total} checked'
    },
    image: {
      error: 'FAILED'
    },
    pageHeader: {
      title: 'Back'
    },
    popconfirm: {
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }
  }
}
```

### Extending Existing Locales

```javascript
// locales/extended-en.js
import enLocale from 'element-plus/es/locale/lang/en'

export default {
  ...enLocale,
  el: {
    ...enLocale.el,
    // Override specific translations
    datepicker: {
      ...enLocale.el.datepicker,
      selectDate: 'Choose a date',
      selectTime: 'Choose a time'
    },
    // Add custom component translations
    customComponent: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit'
    }
  },
  // Add your application-specific translations
  app: {
    navigation: {
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    },
    forms: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      password: 'Password must be at least 8 characters'
    }
  }
}
```

## Advanced I18n Features

### Dynamic Locale Loading

```javascript
// i18n/index.js
import { createI18n } from 'vue-i18n'

// Lazy load locale messages
const loadLocaleMessages = async (locale) => {
  const messages = await import(`./locales/${locale}.js`)
  return messages.default
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {}
})

// Load locale dynamically
export const loadLocale = async (locale) => {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await loadLocaleMessages(locale)
    i18n.global.setLocaleMessage(locale, messages)
  }
  i18n.global.locale.value = locale
}

export default i18n
```

### Locale Detection

```javascript
// utils/locale-detection.js
export const detectLocale = () => {
  // 1. Check URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const urlLocale = urlParams.get('lang')
  if (urlLocale) return urlLocale
  
  // 2. Check localStorage
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) return savedLocale
  
  // 3. Check browser language
  const browserLocale = navigator.language.toLowerCase()
  const supportedLocales = ['en', 'zh-cn', 'es', 'fr', 'de']
  
  // Exact match
  if (supportedLocales.includes(browserLocale)) {
    return browserLocale
  }
  
  // Language code match (e.g., 'en-US' -> 'en')
  const languageCode = browserLocale.split('-')[0]
  if (supportedLocales.includes(languageCode)) {
    return languageCode
  }
  
  // Default fallback
  return 'en'
}

export const saveLocale = (locale) => {
  localStorage.setItem('locale', locale)
}
```

### Language Switcher Component

```vue
<template>
  <el-dropdown @command="changeLanguage">
    <el-button>
      <el-icon><Globe /></el-icon>
      {{ currentLanguageLabel }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="lang in languages" 
          :key="lang.code"
          :command="lang.code"
          :class="{ 'is-active': currentLocale === lang.code }"
        >
          <span class="flag">{{ lang.flag }}</span>
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, ArrowDown } from '@element-plus/icons-vue'
import { loadLocale, saveLocale } from '@/utils/locale-detection'

const { locale } = useI18n()

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh-cn', label: '简体中文', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' }
]

const currentLocale = computed(() => locale.value)

const currentLanguageLabel = computed(() => {
  const current = languages.find(lang => lang.code === currentLocale.value)
  return current ? current.label : 'Language'
})

const changeLanguage = async (langCode) => {
  await loadLocale(langCode)
  saveLocale(langCode)
  
  // Update URL parameter
  const url = new URL(window.location)
  url.searchParams.set('lang', langCode)
  window.history.replaceState({}, '', url)
}
</script>

<style scoped>
.flag {
  margin-right: 8px;
  font-size: 16px;
}

.is-active {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>
```

### Pluralization

```javascript
// messages/en.js
export default {
  message: {
    item: 'no items | one item | {count} items',
    notification: 'You have {count} notification | You have {count} notifications'
  }
}

// messages/zh-cn.js
export default {
  message: {
    item: '没有项目 | {count} 个项目',
    notification: '您有 {count} 条通知'
  }
}
```

```vue
<template>
  <div>
    <!-- Pluralization usage -->
    <p>{{ $tc('message.item', itemCount, { count: itemCount }) }}</p>
    <p>{{ $tc('message.notification', notificationCount, { count: notificationCount }) }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const itemCount = ref(5)
const notificationCount = ref(1)
</script>
```

### Date and Number Formatting

```vue
<template>
  <div>
    <!-- Date formatting -->
    <p>{{ $d(new Date(), 'short') }}</p>
    <p>{{ $d(new Date(), 'long') }}</p>
    
    <!-- Number formatting -->
    <p>{{ $n(1234.56, 'currency') }}</p>
    <p>{{ $n(0.75, 'percent') }}</p>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { d, n } = useI18n({
  dateTimeFormats: {
    'en': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'zh-cn': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }
    }
  },
  numberFormats: {
    'en': {
      currency: {
        style: 'currency',
        currency: 'USD'
      },
      percent: {
        style: 'percent'
      }
    },
    'zh-cn': {
      currency: {
        style: 'currency',
        currency: 'CNY'
      },
      percent: {
        style: 'percent'
      }
    }
  }
})
</script>
```

## RTL (Right-to-Left) Support

### RTL Configuration

```vue
<template>
  <el-config-provider :locale="currentLocale" :direction="direction">
    <div class="app" :dir="direction">
      <!-- Your application content -->
      <el-form :model="form" label-width="120px">
        <el-form-item :label="$t('form.name')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('form.email')">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
    </div>
  </el-config-provider>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import arLocale from 'element-plus/es/locale/lang/ar'
import enLocale from 'element-plus/es/locale/lang/en'

const { locale } = useI18n()

const form = reactive({
  name: '',
  email: ''
})

const rtlLocales = ['ar', 'he', 'fa']

const direction = computed(() => {
  return rtlLocales.includes(locale.value) ? 'rtl' : 'ltr'
})

const currentLocale = computed(() => {
  return locale.value === 'ar' ? arLocale : enLocale
})
</script>

<style>
/* RTL-specific styles */
[dir="rtl"] .el-form-item__label {
  text-align: right;
}

[dir="rtl"] .el-input__inner {
  text-align: right;
}

[dir="rtl"] .el-button {
  margin-left: 0;
  margin-right: 10px;
}
</style>
```

## Testing I18n

### Unit Testing with Vue Test Utils

```javascript
// tests/components/LanguageSwitcher.test.js
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const messages = {
  en: {
    language: 'Language'
  },
  'zh-cn': {
    language: '语言'
  }
}

const i18n = createI18n({
  locale: 'en',
  messages
})

describe('LanguageSwitcher', () => {
  it('displays current language', () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n]
      }
    })
    
    expect(wrapper.text()).toContain('English')
  })
  
  it('changes language when option is selected', async () => {
    const wrapper = mount(LanguageSwitcher, {
      global: {
        plugins: [i18n]
      }
    })
    
    await wrapper.find('[data-testid="language-option-zh-cn"]').trigger('click')
    
    expect(i18n.global.locale.value).toBe('zh-cn')
  })
})
```

### E2E Testing

```javascript
// tests/e2e/i18n.spec.js
import { test, expect } from '@playwright/test'

test('language switching works correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check default language
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome')
  
  // Switch to Chinese
  await page.click('[data-testid="language-switcher"]')
  await page.click('[data-testid="language-option-zh-cn"]')
  
  // Check Chinese translation
  await expect(page.locator('[data-testid="welcome-message"]')).toContainText('欢迎')
  
  // Check Element Plus components are translated
  await expect(page.locator('.el-pagination__total')).toContainText('共')
})
```

## Performance Optimization

### Lazy Loading Translations

```javascript
// composables/useI18nLazy.js
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const loadedLocales = ref(new Set(['en'])) // Default locale is pre-loaded

export function useI18nLazy() {
  const { locale, setLocaleMessage } = useI18n()
  
  const isLocaleLoaded = computed(() => {
    return loadedLocales.value.has(locale.value)
  })
  
  const loadLocale = async (targetLocale) => {
    if (loadedLocales.value.has(targetLocale)) {
      locale.value = targetLocale
      return
    }
    
    try {
      // Load Element Plus locale
      const elLocale = await import(`element-plus/es/locale/lang/${targetLocale}.js`)
      
      // Load app-specific translations
      const appMessages = await import(`@/locales/${targetLocale}.js`)
      
      // Merge messages
      const messages = {
        ...elLocale.default,
        ...appMessages.default
      }
      
      setLocaleMessage(targetLocale, messages)
      loadedLocales.value.add(targetLocale)
      locale.value = targetLocale
      
      // Save to localStorage
      localStorage.setItem('locale', targetLocale)
    } catch (error) {
      console.error(`Failed to load locale ${targetLocale}:`, error)
    }
  }
  
  return {
    isLocaleLoaded,
    loadLocale
  }
}
```

### Bundle Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate i18n chunks
          'i18n-en': ['./src/locales/en.js'],
          'i18n-zh': ['./src/locales/zh-cn.js'],
          'i18n-es': ['./src/locales/es.js'],
          // Element Plus locales
          'el-i18n': [
            'element-plus/es/locale/lang/en',
            'element-plus/es/locale/lang/zh-cn',
            'element-plus/es/locale/lang/es'
          ]
        }
      }
    }
  }
})
```

## Best Practices

### 1. Organization

- Keep translation files organized by feature or page
- Use consistent key naming conventions
- Implement translation validation
- Document translation guidelines

### 2. Performance

- Lazy load translations for better initial load times
- Use tree-shaking to include only needed locales
- Cache translations in localStorage
- Implement fallback strategies

### 3. Maintenance

- Use translation management tools
- Implement automated translation checks
- Keep translations up to date with code changes
- Provide context for translators

### 4. Accessibility

- Support RTL languages properly
- Test with screen readers in different languages
- Ensure proper text direction and alignment
- Consider cultural differences in UI patterns

### 5. User Experience

- Detect user's preferred language automatically
- Provide easy language switching
- Remember user's language preference
- Handle missing translations gracefully

## Conclusion

Element Plus provides robust internationalization support that integrates seamlessly with Vue I18n. By following these patterns and best practices, you can create applications that work effectively across different languages and cultures while maintaining good performance and user experience.