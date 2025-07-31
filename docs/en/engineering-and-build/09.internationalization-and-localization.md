# Internationalization and Localization for Element Plus Applications

## Overview

This guide covers comprehensive internationalization (i18n) and localization (l10n) implementation for Element Plus applications, including Vue I18n integration, dynamic language switching, RTL support, and advanced localization features.

## Vue I18n Setup and Configuration

### Advanced I18n Configuration

```typescript
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import type { Locale } from 'vue-i18n'

// Import locale messages
import en from './locales/en.json'
import zh from './locales/zh-CN.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ar from './locales/ar.json'
import ru from './locales/ru.json'

// Import Element Plus locales
import enElementLocale from 'element-plus/dist/locale/en.mjs'
import zhElementLocale from 'element-plus/dist/locale/zh-cn.mjs'
import esElementLocale from 'element-plus/dist/locale/es.mjs'
import frElementLocale from 'element-plus/dist/locale/fr.mjs'
import deElementLocale from 'element-plus/dist/locale/de.mjs'
import jaElementLocale from 'element-plus/dist/locale/ja.mjs'
import koElementLocale from 'element-plus/dist/locale/ko.mjs'
import arElementLocale from 'element-plus/dist/locale/ar.mjs'
import ruElementLocale from 'element-plus/dist/locale/ru.mjs'

// Import date-fns locales
import { enUS, zhCN, es as esDateFns, fr as frDateFns, de as deDateFns, ja as jaDateFns, ko as koDateFns, ar as arDateFns, ru as ruDateFns } from 'date-fns/locale'

export interface LocaleConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl: boolean
  dateFormat: string
  timeFormat: string
  currency: string
  numberFormat: {
    decimal: string
    thousands: string
    precision: number
  }
  elementLocale: any
  dateFnsLocale: any
}

export const SUPPORTED_LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'USD',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2
    },
    elementLocale: enElementLocale,
    dateFnsLocale: enUS
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    rtl: false,
    dateFormat: 'yyyy/MM/dd',
    timeFormat: 'HH:mm:ss',
    currency: 'CNY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2
    },
    elementLocale: zhElementLocale,
    dateFnsLocale: zhCN
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2
    },
    elementLocale: esElementLocale,
    dateFnsLocale: esDateFns
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      precision: 2
    },
    elementLocale: frElementLocale,
    dateFnsLocale: frDateFns
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2
    },
    elementLocale: deElementLocale,
    dateFnsLocale: deDateFns
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    dateFormat: 'yyyy/MM/dd',
    timeFormat: 'HH:mm:ss',
    currency: 'JPY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 0
    },
    elementLocale: jaElementLocale,
    dateFnsLocale: jaDateFns
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    rtl: false,
    dateFormat: 'yyyy. MM. dd.',
    timeFormat: 'HH:mm:ss',
    currency: 'KRW',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 0
    },
    elementLocale: koElementLocale,
    dateFnsLocale: koDateFns
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'SAR',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2
    },
    elementLocale: arElementLocale,
    dateFnsLocale: arDateFns
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    rtl: false,
    dateFormat: 'dd.MM.yyyy',
    timeFormat: 'HH:mm:ss',
    currency: 'RUB',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      precision: 2
    },
    elementLocale: ruElementLocale,
    dateFnsLocale: ruDateFns
  }
}

const messages = {
  en,
  'zh-CN': zh,
  es,
  fr,
  de,
  ja,
  ko,
  ar,
  ru
}

// Get default locale
function getDefaultLocale(): string {
  // Check localStorage first
  const stored = localStorage.getItem('locale')
  if (stored && SUPPORTED_LOCALES[stored]) {
    return stored
  }
  
  // Check browser language
  const browserLang = navigator.language
  if (SUPPORTED_LOCALES[browserLang]) {
    return browserLang
  }
  
  // Check browser language without region
  const langCode = browserLang.split('-')[0]
  const matchingLocale = Object.keys(SUPPORTED_LOCALES).find(locale => 
    locale.startsWith(langCode)
  )
  
  return matchingLocale || 'en'
}

// Create i18n instance
export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  formatFallbackMessages: true,
  warnHtmlMessage: false,
  escapeParameter: true,
  
  // Number formatting
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    },
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    },
    es: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    }
  },
  
  // Date/time formatting
  datetimeFormats: {
    en: {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

// Locale management functions
export async function setLocale(locale: string): Promise<void> {
  if (!SUPPORTED_LOCALES[locale]) {
    throw new Error(`Unsupported locale: ${locale}`)
  }
  
  // Load locale if not already loaded
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale)
  }
  
  i18n.global.locale.value = locale as Locale
  localStorage.setItem('locale', locale)
  
  // Update document attributes
  document.documentElement.lang = locale
  document.documentElement.dir = SUPPORTED_LOCALES[locale].rtl ? 'rtl' : 'ltr'
  
  // Update Element Plus locale
  await updateElementPlusLocale(locale)
  
  // Emit locale change event
  window.dispatchEvent(new CustomEvent('locale-changed', {
    detail: { locale, config: SUPPORTED_LOCALES[locale] }
  }))
}

export async function loadLocaleMessages(locale: string): Promise<void> {
  try {
    const messages = await import(`./locales/${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages.default)
  } catch (error) {
    console.error(`Failed to load locale messages for ${locale}:`, error)
    throw error
  }
}

export async function updateElementPlusLocale(locale: string): Promise<void> {
  const config = SUPPORTED_LOCALES[locale]
  if (config?.elementLocale) {
    // This would typically be handled by Element Plus configuration
    // In a real app, you'd update the Element Plus ConfigProvider
    await nextTick()
  }
}

export function getCurrentLocale(): string {
  return i18n.global.locale.value
}

export function getCurrentLocaleConfig(): LocaleConfig {
  return SUPPORTED_LOCALES[getCurrentLocale()]
}

export function isRTL(): boolean {
  return getCurrentLocaleConfig().rtl
}

export function getSupportedLocales(): LocaleConfig[] {
  return Object.values(SUPPORTED_LOCALES)
}
```

### Locale Message Structure

```json
// src/i18n/locales/en.json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "filter": "Filter",
    "reset": "Reset",
    "submit": "Submit",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "yes": "Yes",
    "no": "No",
    "ok": "OK",
    "apply": "Apply",
    "clear": "Clear",
    "select": "Select",
    "selectAll": "Select All",
    "deselectAll": "Deselect All",
    "required": "Required",
    "optional": "Optional",
    "placeholder": "Please enter...",
    "noData": "No data available",
    "noResults": "No results found",
    "total": "Total: {count}",
    "page": "Page {current} of {total}",
    "itemsPerPage": "Items per page"
  },
  "navigation": {
    "home": "Home",
    "dashboard": "Dashboard",
    "profile": "Profile",
    "settings": "Settings",
    "help": "Help",
    "about": "About",
    "contact": "Contact",
    "logout": "Logout",
    "login": "Login",
    "register": "Register"
  },
  "auth": {
    "login": {
      "title": "Sign In",
      "subtitle": "Welcome back! Please sign in to your account.",
      "email": "Email Address",
      "password": "Password",
      "rememberMe": "Remember me",
      "forgotPassword": "Forgot password?",
      "signIn": "Sign In",
      "signUp": "Don't have an account? Sign up",
      "socialLogin": "Or sign in with",
      "errors": {
        "invalidCredentials": "Invalid email or password",
        "accountLocked": "Account is locked. Please contact support.",
        "emailRequired": "Email is required",
        "passwordRequired": "Password is required",
        "invalidEmail": "Please enter a valid email address"
      }
    },
    "register": {
      "title": "Create Account",
      "subtitle": "Join us today! Create your account to get started.",
      "firstName": "First Name",
      "lastName": "Last Name",
      "email": "Email Address",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "agreeToTerms": "I agree to the {terms} and {privacy}",
      "terms": "Terms of Service",
      "privacy": "Privacy Policy",
      "createAccount": "Create Account",
      "signIn": "Already have an account? Sign in",
      "errors": {
        "emailExists": "Email address is already registered",
        "passwordMismatch": "Passwords do not match",
        "weakPassword": "Password must be at least 8 characters long",
        "termsRequired": "You must agree to the terms and conditions"
      }
    }
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome back, {name}!",
    "stats": {
      "totalUsers": "Total Users",
      "activeUsers": "Active Users",
      "revenue": "Revenue",
      "orders": "Orders"
    },
    "charts": {
      "userGrowth": "User Growth",
      "revenueChart": "Revenue Chart",
      "orderStatus": "Order Status",
      "trafficSources": "Traffic Sources"
    },
    "recentActivity": "Recent Activity",
    "quickActions": "Quick Actions"
  },
  "forms": {
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address",
      "minLength": "Must be at least {min} characters",
      "maxLength": "Must not exceed {max} characters",
      "numeric": "Must be a number",
      "positive": "Must be a positive number",
      "url": "Please enter a valid URL",
      "phone": "Please enter a valid phone number",
      "date": "Please enter a valid date",
      "time": "Please enter a valid time",
      "pattern": "Invalid format",
      "custom": "Invalid value"
    },
    "fileUpload": {
      "dragDrop": "Drag and drop files here, or click to select",
      "selectFiles": "Select Files",
      "maxSize": "Maximum file size: {size}",
      "allowedTypes": "Allowed types: {types}",
      "uploading": "Uploading...",
      "uploadSuccess": "Upload successful",
      "uploadError": "Upload failed",
      "removeFile": "Remove file",
      "preview": "Preview"
    }
  },
  "tables": {
    "actions": "Actions",
    "view": "View",
    "edit": "Edit",
    "delete": "Delete",
    "duplicate": "Duplicate",
    "export": "Export",
    "import": "Import",
    "refresh": "Refresh",
    "columns": "Columns",
    "density": "Density",
    "fullscreen": "Fullscreen",
    "settings": "Settings",
    "sortAsc": "Sort ascending",
    "sortDesc": "Sort descending",
    "clearSort": "Clear sort",
    "clearFilters": "Clear filters",
    "selectRow": "Select row",
    "expandRow": "Expand row",
    "collapseRow": "Collapse row"
  },
  "dates": {
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow",
    "thisWeek": "This Week",
    "lastWeek": "Last Week",
    "nextWeek": "Next Week",
    "thisMonth": "This Month",
    "lastMonth": "Last Month",
    "nextMonth": "Next Month",
    "thisYear": "This Year",
    "lastYear": "Last Year",
    "nextYear": "Next Year",
    "selectDate": "Select date",
    "selectTime": "Select time",
    "selectDateTime": "Select date and time",
    "startDate": "Start date",
    "endDate": "End date",
    "dateRange": "Date range",
    "timeRange": "Time range"
  },
  "errors": {
    "404": {
      "title": "Page Not Found",
      "message": "The page you are looking for does not exist.",
      "action": "Go to Homepage"
    },
    "403": {
      "title": "Access Denied",
      "message": "You don't have permission to access this resource.",
      "action": "Go Back"
    },
    "500": {
      "title": "Server Error",
      "message": "Something went wrong on our end. Please try again later.",
      "action": "Retry"
    },
    "network": {
      "title": "Network Error",
      "message": "Please check your internet connection and try again.",
      "action": "Retry"
    },
    "generic": {
      "title": "Error",
      "message": "An unexpected error occurred.",
      "action": "Try Again"
    }
  },
  "notifications": {
    "success": {
      "saved": "Changes saved successfully",
      "deleted": "Item deleted successfully",
      "created": "Item created successfully",
      "updated": "Item updated successfully",
      "uploaded": "File uploaded successfully",
      "sent": "Message sent successfully"
    },
    "error": {
      "saveFailed": "Failed to save changes",
      "deleteFailed": "Failed to delete item",
      "createFailed": "Failed to create item",
      "updateFailed": "Failed to update item",
      "uploadFailed": "Failed to upload file",
      "sendFailed": "Failed to send message",
      "loadFailed": "Failed to load data"
    },
    "warning": {
      "unsavedChanges": "You have unsaved changes",
      "deleteConfirm": "Are you sure you want to delete this item?",
      "irreversible": "This action cannot be undone"
    }
  }
}
```

## Dynamic Language Switching

### Language Switcher Component

```vue
<!-- src/components/LanguageSwitcher.vue -->
<template>
  <el-dropdown
    trigger="click"
    placement="bottom-end"
    @command="handleLanguageChange"
  >
    <el-button
      type="text"
      class="language-switcher"
      :class="{ 'rtl-mode': isRTL }"
    >
      <span class="flag">{{ currentLocaleConfig.flag }}</span>
      <span class="name">{{ currentLocaleConfig.nativeName }}</span>
      <el-icon class="arrow"><ArrowDown /></el-icon>
    </el-button>
    
    <template #dropdown>
      <el-dropdown-menu class="language-menu">
        <el-dropdown-item
          v-for="locale in supportedLocales"
          :key="locale.code"
          :command="locale.code"
          :class="{ active: locale.code === currentLocale }"
          class="language-item"
        >
          <div class="language-option">
            <span class="flag">{{ locale.flag }}</span>
            <div class="names">
              <span class="name">{{ locale.name }}</span>
              <span class="native-name">{{ locale.nativeName }}</span>
            </div>
            <el-icon v-if="locale.code === currentLocale" class="check">
              <Check />
            </el-icon>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElButton, ElIcon, ElMessage } from 'element-plus'
import { ArrowDown, Check } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { 
  setLocale, 
  getCurrentLocale, 
  getCurrentLocaleConfig, 
  getSupportedLocales,
  isRTL,
  type LocaleConfig 
} from '@/i18n'

const { t } = useI18n()

const loading = ref(false)
const currentLocale = computed(() => getCurrentLocale())
const currentLocaleConfig = computed(() => getCurrentLocaleConfig())
const supportedLocales = computed(() => getSupportedLocales())
const isRTLMode = computed(() => isRTL())

const handleLanguageChange = async (localeCode: string) => {
  if (localeCode === currentLocale.value) return
  
  loading.value = true
  
  try {
    await setLocale(localeCode)
    
    ElMessage({
      type: 'success',
      message: t('notifications.success.languageChanged'),
      duration: 2000
    })
    
    // Optionally reload the page to ensure all components update
    // window.location.reload()
  } catch (error) {
    console.error('Failed to change language:', error)
    
    ElMessage({
      type: 'error',
      message: t('notifications.error.languageChangeFailed'),
      duration: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  min-width: 120px;
}

.language-switcher:hover {
  background-color: var(--el-fill-color-light);
}

.language-switcher.rtl-mode {
  flex-direction: row-reverse;
}

.flag {
  font-size: 18px;
  line-height: 1;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.arrow {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  transition: transform 0.2s ease;
}

.language-menu {
  min-width: 200px;
}

.language-item {
  padding: 0;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  width: 100%;
  transition: background-color 0.2s ease;
}

.language-option:hover {
  background-color: var(--el-fill-color-light);
}

.language-item.active .language-option {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.names {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.names .name {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

.names .native-name {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.2;
}

.check {
  font-size: 16px;
  color: var(--el-color-primary);
}

/* RTL Support */
[dir="rtl"] .language-switcher {
  flex-direction: row-reverse;
}

[dir="rtl"] .language-option {
  flex-direction: row-reverse;
}

[dir="rtl"] .names {
  text-align: right;
}
</style>
```

### Locale Detection and Persistence

```typescript
// src/composables/useLocale.ts
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  setLocale, 
  getCurrentLocale, 
  getCurrentLocaleConfig, 
  getSupportedLocales,
  isRTL,
  type LocaleConfig 
} from '@/i18n'

export function useLocale() {
  const { locale, t, n, d } = useI18n()
  
  const currentLocale = computed(() => getCurrentLocale())
  const currentConfig = computed(() => getCurrentLocaleConfig())
  const supportedLocales = computed(() => getSupportedLocales())
  const isRTLMode = computed(() => isRTL())
  
  const loading = ref(false)
  
  // Watch for locale changes and update document
  watch(currentLocale, (newLocale) => {
    updateDocumentLocale(newLocale)
  }, { immediate: true })
  
  const changeLocale = async (localeCode: string) => {
    if (localeCode === currentLocale.value) return
    
    loading.value = true
    
    try {
      await setLocale(localeCode)
      
      // Update any global state or notify other components
      await updateGlobalLocaleState(localeCode)
      
      return true
    } catch (error) {
      console.error('Failed to change locale:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const updateDocumentLocale = (localeCode: string) => {
    const config = getSupportedLocales().find(l => l.code === localeCode)
    if (!config) return
    
    // Update document attributes
    document.documentElement.lang = localeCode
    document.documentElement.dir = config.rtl ? 'rtl' : 'ltr'
    
    // Update meta tags
    updateMetaTags(config)
    
    // Update CSS custom properties for RTL
    updateCSSProperties(config)
  }
  
  const updateMetaTags = (config: LocaleConfig) => {
    // Update language meta tag
    let langMeta = document.querySelector('meta[name="language"]')
    if (!langMeta) {
      langMeta = document.createElement('meta')
      langMeta.setAttribute('name', 'language')
      document.head.appendChild(langMeta)
    }
    langMeta.setAttribute('content', config.code)
    
    // Update locale meta tag
    let localeMeta = document.querySelector('meta[name="locale"]')
    if (!localeMeta) {
      localeMeta = document.createElement('meta')
      localeMeta.setAttribute('name', 'locale')
      document.head.appendChild(localeMeta)
    }
    localeMeta.setAttribute('content', config.code)
  }
  
  const updateCSSProperties = (config: LocaleConfig) => {
    const root = document.documentElement
    
    // Set RTL/LTR direction
    root.style.setProperty('--text-direction', config.rtl ? 'rtl' : 'ltr')
    root.style.setProperty('--start-direction', config.rtl ? 'right' : 'left')
    root.style.setProperty('--end-direction', config.rtl ? 'left' : 'right')
    
    // Set locale-specific properties
    root.style.setProperty('--locale-code', config.code)
    root.style.setProperty('--is-rtl', config.rtl ? '1' : '0')
  }
  
  const updateGlobalLocaleState = async (localeCode: string) => {
    // Update any global stores or services
    // For example, update user preferences, analytics, etc.
    
    try {
      // Save to user preferences if authenticated
      const userStore = useUserStore()
      if (userStore.isAuthenticated) {
        await userStore.updatePreferences({ locale: localeCode })
      }
      
      // Update analytics
      if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
          custom_map: { locale: localeCode }
        })
      }
    } catch (error) {
      console.warn('Failed to update global locale state:', error)
    }
  }
  
  // Format currency with locale-specific formatting
  const formatCurrency = (amount: number, currency?: string) => {
    const config = currentConfig.value
    const currencyCode = currency || config.currency
    
    return new Intl.NumberFormat(config.code, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: config.numberFormat.precision,
      maximumFractionDigits: config.numberFormat.precision
    }).format(amount)
  }
  
  // Format number with locale-specific formatting
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions) => {
    const config = currentConfig.value
    
    return new Intl.NumberFormat(config.code, {
      minimumFractionDigits: config.numberFormat.precision,
      maximumFractionDigits: config.numberFormat.precision,
      ...options
    }).format(number)
  }
  
  // Format date with locale-specific formatting
  const formatDate = (date: Date | string | number, format?: string) => {
    const config = currentConfig.value
    const dateObj = new Date(date)
    
    if (format) {
      // Use custom format
      return new Intl.DateTimeFormat(config.code, {
        dateStyle: format as any
      }).format(dateObj)
    }
    
    // Use locale-specific default format
    return new Intl.DateTimeFormat(config.code).format(dateObj)
  }
  
  // Format relative time
  const formatRelativeTime = (date: Date | string | number) => {
    const dateObj = new Date(date)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    const rtf = new Intl.RelativeTimeFormat(currentConfig.value.code, {
      numeric: 'auto'
    })
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(-diffInSeconds, 'second')
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    }
  }
  
  // Get localized route
  const getLocalizedRoute = (routeName: string, params?: Record<string, any>) => {
    // This would integrate with your router to provide localized routes
    const localizedRouteName = `${routeName}.${currentLocale.value}`
    return { name: localizedRouteName, params }
  }
  
  return {
    // State
    currentLocale,
    currentConfig,
    supportedLocales,
    isRTLMode,
    loading,
    
    // Actions
    changeLocale,
    
    // Formatters
    formatCurrency,
    formatNumber,
    formatDate,
    formatRelativeTime,
    
    // Utilities
    getLocalizedRoute,
    
    // Vue I18n functions
    t,
    n,
    d
  }
}

// Auto-detect user's preferred locale
export function useLocaleDetection() {
  const detectLocale = (): string => {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlLocale = urlParams.get('locale')
    if (urlLocale && getSupportedLocales().some(l => l.code === urlLocale)) {
      return urlLocale
    }
    
    // Check localStorage
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && getSupportedLocales().some(l => l.code === storedLocale)) {
      return storedLocale
    }
    
    // Check user preferences from server
    const userStore = useUserStore()
    if (userStore.user?.preferences?.locale) {
      const userLocale = userStore.user.preferences.locale
      if (getSupportedLocales().some(l => l.code === userLocale)) {
        return userLocale
      }
    }
    
    // Check browser language
    const browserLangs = navigator.languages || [navigator.language]
    
    for (const browserLang of browserLangs) {
      // Exact match
      if (getSupportedLocales().some(l => l.code === browserLang)) {
        return browserLang
      }
      
      // Language code match (e.g., 'en' from 'en-US')
      const langCode = browserLang.split('-')[0]
      const matchingLocale = getSupportedLocales().find(l => 
        l.code.startsWith(langCode)
      )
      if (matchingLocale) {
        return matchingLocale.code
      }
    }
    
    // Default to English
    return 'en'
  }
  
  const initializeLocale = async () => {
    const detectedLocale = detectLocale()
    await setLocale(detectedLocale)
  }
  
  return {
    detectLocale,
    initializeLocale
  }
}
```

## RTL (Right-to-Left) Support

### RTL Styling System

```scss
// src/styles/rtl.scss

// RTL Mixins
@mixin rtl {
  [dir="rtl"] & {
    @content;
  }
}

@mixin ltr {
  [dir="ltr"] & {
    @content;
  }
}

@mixin margin-start($value) {
  margin-left: $value;
  
  @include rtl {
    margin-left: 0;
    margin-right: $value;
  }
}

@mixin margin-end($value) {
  margin-right: $value;
  
  @include rtl {
    margin-right: 0;
    margin-left: $value;
  }
}

@mixin padding-start($value) {
  padding-left: $value;
  
  @include rtl {
    padding-left: 0;
    padding-right: $value;
  }
}

@mixin padding-end($value) {
  padding-right: $value;
  
  @include rtl {
    padding-right: 0;
    padding-left: $value;
  }
}

@mixin border-start($value) {
  border-left: $value;
  
  @include rtl {
    border-left: none;
    border-right: $value;
  }
}

@mixin border-end($value) {
  border-right: $value;
  
  @include rtl {
    border-right: none;
    border-left: $value;
  }
}

@mixin text-align-start {
  text-align: left;
  
  @include rtl {
    text-align: right;
  }
}

@mixin text-align-end {
  text-align: right;
  
  @include rtl {
    text-align: left;
  }
}

@mixin float-start {
  float: left;
  
  @include rtl {
    float: right;
  }
}

@mixin float-end {
  float: right;
  
  @include rtl {
    float: left;
  }
}

@mixin transform-rotate-rtl($angle) {
  transform: rotate($angle);
  
  @include rtl {
    transform: rotate(-$angle);
  }
}

// CSS Custom Properties for RTL
:root {
  --direction: ltr;
  --start: left;
  --end: right;
  --rotate-factor: 1;
}

[dir="rtl"] {
  --direction: rtl;
  --start: right;
  --end: left;
  --rotate-factor: -1;
}

// Utility Classes
.text-start {
  text-align: var(--start);
}

.text-end {
  text-align: var(--end);
}

.float-start {
  float: var(--start);
}

.float-end {
  float: var(--end);
}

.margin-start-1 {
  margin-#{var(--start)}: 0.25rem;
}

.margin-start-2 {
  margin-#{var(--start)}: 0.5rem;
}

.margin-start-3 {
  margin-#{var(--start)}: 1rem;
}

.margin-start-4 {
  margin-#{var(--start)}: 1.5rem;
}

.margin-end-1 {
  margin-#{var(--end)}: 0.25rem;
}

.margin-end-2 {
  margin-#{var(--end)}: 0.5rem;
}

.margin-end-3 {
  margin-#{var(--end)}: 1rem;
}

.margin-end-4 {
  margin-#{var(--end)}: 1.5rem;
}

.padding-start-1 {
  padding-#{var(--start)}: 0.25rem;
}

.padding-start-2 {
  padding-#{var(--start)}: 0.5rem;
}

.padding-start-3 {
  padding-#{var(--start)}: 1rem;
}

.padding-start-4 {
  padding-#{var(--start)}: 1.5rem;
}

.padding-end-1 {
  padding-#{var(--end)}: 0.25rem;
}

.padding-end-2 {
  padding-#{var(--end)}: 0.5rem;
}

.padding-end-3 {
  padding-#{var(--end)}: 1rem;
}

.padding-end-4 {
  padding-#{var(--end)}: 1.5rem;
}

// Component-specific RTL styles
.el-button {
  @include rtl {
    .el-icon {
      &:first-child {
        margin-left: 4px;
        margin-right: 0;
      }
      
      &:last-child {
        margin-right: 4px;
        margin-left: 0;
      }
    }
  }
}

.el-input {
  @include rtl {
    .el-input__prefix {
      left: auto;
      right: 8px;
    }
    
    .el-input__suffix {
      right: auto;
      left: 8px;
    }
  }
}

.el-select {
  @include rtl {
    .el-select__caret {
      right: auto;
      left: 8px;
    }
  }
}

.el-table {
  @include rtl {
    .el-table__header {
      th {
        text-align: right;
      }
    }
    
    .el-table__body {
      td {
        text-align: right;
      }
    }
    
    .el-table__expand-icon {
      transform: rotate(90deg);
      
      &.el-table__expand-icon--expanded {
        transform: rotate(0deg);
      }
    }
  }
}

.el-menu {
  @include rtl {
    .el-submenu__icon-arrow {
      transform: rotate(180deg);
    }
    
    .el-menu-item {
      text-align: right;
      
      .el-icon {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
}

.el-breadcrumb {
  @include rtl {
    .el-breadcrumb__separator {
      transform: rotate(180deg);
    }
  }
}

.el-steps {
  @include rtl {
    .el-step__arrow {
      &::before,
      &::after {
        transform: rotate(180deg);
      }
    }
  }
}

// Animation adjustments for RTL
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-enter-active {
  animation: slideInRight 0.3s ease;
  
  @include rtl {
    animation: slideInLeft 0.3s ease;
  }
}

.slide-leave-active {
  animation: slideInRight 0.3s ease reverse;
  
  @include rtl {
    animation: slideInLeft 0.3s ease reverse;
  }
}
```

### RTL-Aware Components

```vue
<!-- src/components/RTLAwareIcon.vue -->
<template>
  <el-icon
    :class="[
      'rtl-aware-icon',
      {
        'rtl-flip': shouldFlip && isRTL,
        'rtl-rotate': shouldRotate && isRTL
      }
    ]"
    :style="iconStyle"
  >
    <component :is="icon" />
  </el-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { useLocale } from '@/composables/useLocale'

interface Props {
  icon: any
  shouldFlip?: boolean
  shouldRotate?: boolean
  rotateAngle?: number
}

const props = withDefaults(defineProps<Props>(), {
  shouldFlip: false,
  shouldRotate: false,
  rotateAngle: 180
})

const { isRTLMode } = useLocale()
const isRTL = computed(() => isRTLMode.value)

const iconStyle = computed(() => {
  if (!isRTL.value) return {}
  
  const styles: Record<string, string> = {}
  
  if (props.shouldRotate) {
    styles.transform = `rotate(${props.rotateAngle}deg)`
  }
  
  return styles
})
</script>

<style scoped>
.rtl-aware-icon.rtl-flip {
  transform: scaleX(-1);
}

.rtl-aware-icon.rtl-rotate {
  transition: transform 0.2s ease;
}
</style>
```

This comprehensive internationalization and localization guide provides robust multi-language support for Element Plus applications, including dynamic language switching, RTL support, and advanced localization features.