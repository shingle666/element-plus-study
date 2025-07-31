# Coding Standards for Element Plus Applications

## Overview

This guide establishes coding standards and best practices for developing applications with Element Plus. Following these standards ensures code consistency, maintainability, and team collaboration.

## Vue.js Coding Standards

### Component Structure

```vue
<!-- Good: Consistent component structure -->
<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>{{ title }}</span>
          <el-button 
            type="primary" 
            size="small"
            @click="handleEdit"
          >
            Edit
          </el-button>
        </div>
      </template>
      
      <div class="profile-content">
        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="Name" prop="name">
            <el-input 
              v-model="form.name"
              placeholder="Enter your name"
            />
          </el-form-item>
          
          <el-form-item label="Email" prop="email">
            <el-input 
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// Props
const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  },
  editable: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update', 'delete'])

// Stores
const userStore = useUserStore()

// Refs
const formRef = ref()

// Reactive data
const form = reactive({
  name: '',
  email: ''
})

const rules = {
  name: [
    { required: true, message: 'Please input name', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please input email', trigger: 'blur' },
    { type: 'email', message: 'Please input valid email', trigger: 'blur' }
  ]
}

// Computed
const title = computed(() => {
  return props.editable ? 'Edit Profile' : 'View Profile'
})

// Methods
const handleEdit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      await userStore.updateUser(props.userId, form)
      ElMessage.success('Profile updated successfully')
      emit('update', form)
    }
  } catch (error) {
    ElMessage.error('Failed to update profile')
  }
}

const loadUserData = async () => {
  try {
    const userData = await userStore.getUser(props.userId)
    Object.assign(form, userData)
  } catch (error) {
    ElMessage.error('Failed to load user data')
  }
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
}

.profile-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  padding: 20px 0;
}
</style>
```

### Naming Conventions

#### Components
```javascript
// Good: PascalCase for component names
UserProfile.vue
DataTable.vue
NavigationMenu.vue

// Bad: Other cases
userProfile.vue
data-table.vue
navigation_menu.vue
```

#### Variables and Functions
```javascript
// Good: camelCase for variables and functions
const userName = ref('')
const isLoading = ref(false)
const handleSubmit = () => {}
const fetchUserData = async () => {}

// Bad: Other cases
const user_name = ref('')
const IsLoading = ref(false)
const handle_submit = () => {}
```

#### Constants
```javascript
// Good: SCREAMING_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const DEFAULT_PAGE_SIZE = 20

// Bad: Other cases
const apiBaseUrl = 'https://api.example.com'
const maxFileSize = 5 * 1024 * 1024
```

#### CSS Classes
```css
/* Good: kebab-case for CSS classes */
.user-profile {}
.data-table-header {}
.navigation-menu-item {}

/* Bad: Other cases */
.userProfile {}
.dataTableHeader {}
.navigation_menu_item {}
```

### Props Definition

```javascript
// Good: Detailed prop definitions
const props = defineProps({
  // Required string prop
  title: {
    type: String,
    required: true
  },
  
  // Optional prop with default
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Number prop with validation
  maxLength: {
    type: Number,
    default: 100,
    validator: (value) => value > 0
  },
  
  // Object prop with default factory
  config: {
    type: Object,
    default: () => ({})
  },
  
  // Array prop with default factory
  items: {
    type: Array,
    default: () => []
  }
})

// Bad: Minimal prop definitions
const props = defineProps(['title', 'size', 'maxLength'])
```

### Event Handling

```javascript
// Good: Descriptive event names
const emit = defineEmits([
  'update:modelValue',
  'item-selected',
  'form-submitted',
  'data-loaded',
  'error-occurred'
])

// Good: Event payload structure
const handleItemClick = (item) => {
  emit('item-selected', {
    item,
    timestamp: Date.now(),
    source: 'user-interaction'
  })
}

// Bad: Generic event names
const emit = defineEmits(['change', 'click', 'update'])
```

## Element Plus Best Practices

### Form Handling

```vue
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="120px"
    @submit.prevent="handleSubmit"
  >
    <!-- Use proper form validation -->
    <el-form-item label="Username" prop="username">
      <el-input
        v-model="form.username"
        placeholder="Enter username"
        clearable
        :disabled="loading"
      />
    </el-form-item>
    
    <!-- Provide user feedback -->
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Enter password"
        show-password
        :disabled="loading"
      />
    </el-form-item>
    
    <!-- Clear action buttons -->
    <el-form-item>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="handleSubmit"
      >
        {{ loading ? 'Submitting...' : 'Submit' }}
      </el-button>
      <el-button @click="handleReset">
        Reset
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
// Good: Comprehensive form validation
const rules = {
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers and underscore allowed', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase and number', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value.validate()
    if (valid) {
      loading.value = true
      await submitForm(form)
      ElMessage.success('Form submitted successfully')
    }
  } catch (error) {
    ElMessage.error('Validation failed')
  } finally {
    loading.value = false
  }
}
</script>
```

### Table Implementation

```vue
<template>
  <div class="data-table-container">
    <!-- Search and filters -->
    <div class="table-header">
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        Add New
      </el-button>
    </div>
    
    <!-- Data table -->
    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <!-- Selection column -->
      <el-table-column type="selection" width="55" />
      
      <!-- Data columns -->
      <el-table-column
        prop="name"
        label="Name"
        sortable="custom"
        min-width="150"
      >
        <template #default="{ row }">
          <el-link type="primary" @click="handleView(row)">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="email"
        label="Email"
        min-width="200"
      />
      
      <el-table-column
        prop="status"
        label="Status"
        width="120"
      >
        <template #default="{ row }">
          <el-tag
            :type="getStatusType(row.status)"
            size="small"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      
      <!-- Actions column -->
      <el-table-column label="Actions" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(row)"
          >
            Edit
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- Pagination -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
```

### Dialog and Modal Usage

```vue
<template>
  <!-- Good: Proper dialog structure -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleDialogClose"
  >
    <div class="dialog-content">
      <!-- Dialog content here -->
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">
          Cancel
        </el-button>
        <el-button 
          type="primary" 
          :loading="saving"
          @click="handleConfirm"
        >
          {{ saving ? 'Saving...' : 'Confirm' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
// Good: Proper dialog state management
const dialogVisible = ref(false)
const saving = ref(false)

const openDialog = () => {
  dialogVisible.value = true
  // Reset form or load data
}

const handleDialogClose = () => {
  // Clean up when dialog closes
  resetForm()
}

const handleConfirm = async () => {
  try {
    saving.value = true
    await saveData()
    dialogVisible.value = false
    ElMessage.success('Saved successfully')
  } catch (error) {
    ElMessage.error('Save failed')
  } finally {
    saving.value = false
  }
}
</script>
```

## State Management

### Pinia Store Structure

```javascript
// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const activeUsers = computed(() => 
    users.value.filter(user => user.status === 'active')
  )
  
  const userCount = computed(() => users.value.length)
  
  const isAuthenticated = computed(() => !!currentUser.value)
  
  // Actions
  const fetchUsers = async (params = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await userApi.getUsers(params)
      users.value = response.data
      
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const createUser = async (userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await userApi.createUser(userData)
      users.value.push(response.data)
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const updateUser = async (id, userData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await userApi.updateUser(id, userData)
      const index = users.value.findIndex(user => user.id === id)
      
      if (index !== -1) {
        users.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const deleteUser = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await userApi.deleteUser(id)
      users.value = users.value.filter(user => user.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return {
    // State
    users,
    currentUser,
    loading,
    error,
    
    // Getters
    activeUsers,
    userCount,
    isAuthenticated,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    clearError
  }
})
```

## API Integration

### HTTP Client Setup

```javascript
// api/client.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// Create axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // Add auth token
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // Add request timestamp
    config.metadata = { startTime: Date.now() }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
client.interceptors.response.use(
  (response) => {
    // Log response time
    const duration = Date.now() - response.config.metadata.startTime
    console.log(`API call took ${duration}ms: ${response.config.url}`)
    
    return response
  },
  (error) => {
    const { response } = error
    
    // Handle different error types
    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login
          const authStore = useAuthStore()
          authStore.logout()
          break
          
        case 403:
          ElMessage.error('Access denied')
          break
          
        case 404:
          ElMessage.error('Resource not found')
          break
          
        case 422:
          // Validation errors
          const errors = response.data.errors
          if (errors) {
            Object.values(errors).flat().forEach(error => {
              ElMessage.error(error)
            })
          }
          break
          
        case 500:
          ElMessage.error('Server error. Please try again later.')
          break
          
        default:
          ElMessage.error(response.data.message || 'An error occurred')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('Request timeout. Please check your connection.')
    } else {
      ElMessage.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

export default client
```

### API Service Pattern

```javascript
// api/user.js
import client from './client'

export const userApi = {
  // Get users with pagination and filters
  getUsers: (params = {}) => {
    return client.get('/users', { params })
  },
  
  // Get single user
  getUser: (id) => {
    return client.get(`/users/${id}`)
  },
  
  // Create user
  createUser: (userData) => {
    return client.post('/users', userData)
  },
  
  // Update user
  updateUser: (id, userData) => {
    return client.put(`/users/${id}`, userData)
  },
  
  // Delete user
  deleteUser: (id) => {
    return client.delete(`/users/${id}`)
  },
  
  // Bulk operations
  bulkUpdate: (userIds, updateData) => {
    return client.patch('/users/bulk', {
      ids: userIds,
      data: updateData
    })
  },
  
  // Upload avatar
  uploadAvatar: (id, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    return client.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
```

## Error Handling

### Global Error Handler

```javascript
// utils/errorHandler.js
import { ElMessage, ElNotification } from 'element-plus'

export class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Error in ${context}:`, error)
    
    if (error.response) {
      // Server responded with error status
      this.handleServerError(error.response)
    } else if (error.request) {
      // Request was made but no response received
      this.handleNetworkError()
    } else {
      // Something else happened
      this.handleGenericError(error.message)
    }
  }
  
  static handleServerError(response) {
    const { status, data } = response
    
    switch (status) {
      case 400:
        ElMessage.error(data.message || 'Bad request')
        break
      case 401:
        ElMessage.error('Please log in to continue')
        // Redirect to login
        break
      case 403:
        ElMessage.error('You do not have permission to perform this action')
        break
      case 404:
        ElMessage.error('The requested resource was not found')
        break
      case 422:
        this.handleValidationErrors(data.errors)
        break
      case 500:
        ElNotification({
          title: 'Server Error',
          message: 'An internal server error occurred. Please try again later.',
          type: 'error',
          duration: 5000
        })
        break
      default:
        ElMessage.error(data.message || 'An unexpected error occurred')
    }
  }
  
  static handleNetworkError() {
    ElNotification({
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'error',
      duration: 0 // Don't auto-close
    })
  }
  
  static handleValidationErrors(errors) {
    if (typeof errors === 'object') {
      Object.values(errors).flat().forEach(error => {
        ElMessage.error(error)
      })
    } else {
      ElMessage.error('Validation failed')
    }
  }
  
  static handleGenericError(message) {
    ElMessage.error(message || 'An unexpected error occurred')
  }
}

// Usage in components
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    ErrorHandler.handle(error, context)
  }
  
  return { handleError }
}
```

## Performance Optimization

### Lazy Loading

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Lazy load route components
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings.vue')
  }
]

// Lazy load with chunk names for better debugging
const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  }
]
```

### Component Optimization

```vue
<template>
  <div class="optimized-component">
    <!-- Use v-memo for expensive renders -->
    <div v-memo="[expensiveData]" class="expensive-content">
      {{ processExpensiveData(expensiveData) }}
    </div>
    
    <!-- Use v-show for frequently toggled elements -->
    <div v-show="isVisible" class="toggle-content">
      Content that toggles frequently
    </div>
    
    <!-- Use v-if for conditionally rendered elements -->
    <div v-if="shouldRender" class="conditional-content">
      Content that rarely changes
    </div>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'

// Use shallowRef for large objects that don't need deep reactivity
const largeDataSet = shallowRef([])

// Memoize expensive computations
const expensiveComputation = computed(() => {
  return largeDataSet.value.reduce((acc, item) => {
    // Expensive operation
    return acc + item.value
  }, 0)
})

// Debounce user input
const searchQuery = ref('')
const debouncedSearch = useDebounceFn(() => {
  // Perform search
}, 300)

watch(searchQuery, debouncedSearch)
</script>
```

## Testing Standards

### Unit Test Structure

```javascript
// tests/components/UserProfile.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElButton, ElForm } from 'element-plus'
import UserProfile from '@/components/UserProfile.vue'

describe('UserProfile', () => {
  let wrapper
  
  const defaultProps = {
    userId: '123',
    editable: true
  }
  
  const createWrapper = (props = {}) => {
    return mount(UserProfile, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          ElButton,
          ElForm
        }
      }
    })
  }
  
  beforeEach(() => {
    wrapper = createWrapper()
  })
  
  describe('rendering', () => {
    it('renders correctly with default props', () => {
      expect(wrapper.find('.user-profile').exists()).toBe(true)
      expect(wrapper.find('.profile-card').exists()).toBe(true)
    })
    
    it('shows edit button when editable is true', () => {
      expect(wrapper.find('[data-testid="edit-button"]').exists()).toBe(true)
    })
    
    it('hides edit button when editable is false', () => {
      wrapper = createWrapper({ editable: false })
      expect(wrapper.find('[data-testid="edit-button"]').exists()).toBe(false)
    })
  })
  
  describe('interactions', () => {
    it('emits update event when form is submitted', async () => {
      await wrapper.find('[data-testid="name-input"]').setValue('John Doe')
      await wrapper.find('[data-testid="email-input"]').setValue('john@example.com')
      await wrapper.find('[data-testid="submit-button"]').trigger('click')
      
      expect(wrapper.emitted('update')).toBeTruthy()
      expect(wrapper.emitted('update')[0][0]).toEqual({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
    
    it('validates form before submission', async () => {
      await wrapper.find('[data-testid="submit-button"]').trigger('click')
      
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true)
      expect(wrapper.emitted('update')).toBeFalsy()
    })
  })
})
```

## Documentation Standards

### Component Documentation

```vue
<template>
  <!-- Component template -->
</template>

<script setup>
/**
 * UserProfile Component
 * 
 * A reusable component for displaying and editing user profile information.
 * Supports both view and edit modes with form validation.
 * 
 * @example
 * <UserProfile 
 *   :user-id="123" 
 *   :editable="true" 
 *   @update="handleUpdate"
 *   @delete="handleDelete"
 * />
 */

/**
 * Component props
 * @typedef {Object} Props
 * @property {string|number} userId - The ID of the user to display
 * @property {boolean} [editable=true] - Whether the profile can be edited
 * @property {string} [size='medium'] - Size of the component (small, medium, large)
 */
const props = defineProps({
  userId: {
    type: [String, Number],
    required: true,
    description: 'The ID of the user to display'
  },
  editable: {
    type: Boolean,
    default: true,
    description: 'Whether the profile can be edited'
  }
})

/**
 * Component events
 * @typedef {Object} Events
 * @property {Function} update - Fired when user profile is updated
 * @property {Function} delete - Fired when user profile is deleted
 */
const emit = defineEmits({
  /**
   * Fired when user profile is updated
   * @param {Object} userData - The updated user data
   */
  update: (userData) => {
    return userData && typeof userData === 'object'
  },
  
  /**
   * Fired when user profile is deleted
   * @param {string|number} userId - The ID of the deleted user
   */
  delete: (userId) => {
    return userId != null
  }
})
</script>
```

## Code Quality Tools

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Vue specific rules
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'error',
    'vue/no-unused-vars': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    
    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Code style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'comma-dangle': ['error', 'never']
  }
}
```

### Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid',
  vueIndentScriptAndStyle: false
}
```

## Summary

Following these coding standards ensures:

1. **Consistency** - Code looks and behaves uniformly across the project
2. **Maintainability** - Code is easy to understand and modify
3. **Performance** - Optimized patterns for better application performance
4. **Quality** - Reduced bugs and improved reliability
5. **Collaboration** - Team members can easily work on each other's code

Regularly review and update these standards as the project evolves and new best practices emerge.