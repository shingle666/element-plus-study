# Unit Testing with Element Plus

## Overview

Testing Element Plus components requires a solid understanding of Vue testing patterns and the specific behaviors of UI components. This guide covers comprehensive testing strategies, from basic component testing to complex interaction scenarios.

## Testing Setup

### Dependencies

```bash
# Vue Test Utils and Jest
npm install --save-dev @vue/test-utils jest vue-jest babel-jest

# For Vitest (recommended)
npm install --save-dev vitest @vue/test-utils jsdom

# Additional testing utilities
npm install --save-dev @testing-library/vue @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
```

### Vitest Configuration

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

### Test Setup File

```javascript
// tests/setup.js
import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { createI18n } from 'vue-i18n'
import '@testing-library/jest-dom'

// Global test configuration
config.global.plugins = [ElementPlus]

// Mock i18n
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      test: {
        message: 'Test message'
      }
    }
  }
})

config.global.plugins.push(i18n)

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Basic Component Testing

### Testing Element Plus Components

```javascript
// tests/components/BasicForm.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import BasicForm from '@/components/BasicForm.vue'

// Component under test
const BasicFormComponent = {
  template: `
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" data-testid="name-input" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" data-testid="email-input" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" data-testid="submit-btn">
          Submit
        </el-button>
        <el-button @click="resetForm" data-testid="reset-btn">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  `,
  setup() {
    const form = ref({
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
    
    const formRef = ref()
    
    const submitForm = async () => {
      await formRef.value.validate()
      // Submit logic
    }
    
    const resetForm = () => {
      formRef.value.resetFields()
    }
    
    return {
      form,
      rules,
      formRef,
      submitForm,
      resetForm
    }
  }
}

describe('BasicForm', () => {
  it('renders form fields correctly', () => {
    const wrapper = mount(BasicFormComponent)
    
    expect(wrapper.find('[data-testid="name-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="submit-btn"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="reset-btn"]').exists()).toBe(true)
  })
  
  it('updates form data when input changes', async () => {
    const wrapper = mount(BasicFormComponent)
    const nameInput = wrapper.find('[data-testid="name-input"] input')
    
    await nameInput.setValue('John Doe')
    
    expect(wrapper.vm.form.name).toBe('John Doe')
  })
  
  it('validates required fields', async () => {
    const wrapper = mount(BasicFormComponent)
    const submitBtn = wrapper.find('[data-testid="submit-btn"]')
    
    await submitBtn.trigger('click')
    
    // Check for validation error messages
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Please input name')
  })
  
  it('validates email format', async () => {
    const wrapper = mount(BasicFormComponent)
    const emailInput = wrapper.find('[data-testid="email-input"] input')
    
    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Please input valid email')
  })
  
  it('resets form when reset button is clicked', async () => {
    const wrapper = mount(BasicFormComponent)
    const nameInput = wrapper.find('[data-testid="name-input"] input')
    const resetBtn = wrapper.find('[data-testid="reset-btn"]')
    
    // Set some values
    await nameInput.setValue('John Doe')
    expect(wrapper.vm.form.name).toBe('John Doe')
    
    // Reset form
    await resetBtn.trigger('click')
    expect(wrapper.vm.form.name).toBe('')
  })
})
```

### Testing with Testing Library

```javascript
// tests/components/UserList.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import { describe, it, expect, vi } from 'vitest'
import UserList from '@/components/UserList.vue'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' }
]

// Mock API call
const mockFetchUsers = vi.fn().mockResolvedValue(mockUsers)

const UserListComponent = {
  template: `
    <div>
      <el-input
        v-model="searchTerm"
        placeholder="Search users..."
        @input="handleSearch"
        data-testid="search-input"
      />
      
      <el-table :data="filteredUsers" v-loading="loading">
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="editUser(row)"
              :data-testid="`edit-user-${row.id}`"
            >
              Edit
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteUser(row.id)"
              :data-testid="`delete-user-${row.id}`"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  `,
  setup() {
    const users = ref([])
    const loading = ref(false)
    const searchTerm = ref('')
    
    const filteredUsers = computed(() => {
      if (!searchTerm.value) return users.value
      return users.value.filter(user => 
        user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    })
    
    const fetchUsers = async () => {
      loading.value = true
      try {
        users.value = await mockFetchUsers()
      } finally {
        loading.value = false
      }
    }
    
    const handleSearch = debounce(() => {
      // Search logic handled by computed property
    }, 300)
    
    const editUser = (user) => {
      console.log('Edit user:', user)
    }
    
    const deleteUser = (userId) => {
      users.value = users.value.filter(user => user.id !== userId)
    }
    
    onMounted(fetchUsers)
    
    return {
      users,
      loading,
      searchTerm,
      filteredUsers,
      handleSearch,
      editUser,
      deleteUser
    }
  }
}

describe('UserList', () => {
  it('renders user list correctly', async () => {
    render(UserListComponent)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })
  
  it('filters users based on search term', async () => {
    render(UserListComponent)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Search for specific user
    const searchInput = screen.getByTestId('search-input')
    await fireEvent.update(searchInput, 'John')
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })
  })
  
  it('deletes user when delete button is clicked', async () => {
    render(UserListComponent)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    // Click delete button
    const deleteBtn = screen.getByTestId('delete-user-1')
    await fireEvent.click(deleteBtn)
    
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
    })
  })
  
  it('shows loading state', () => {
    const wrapper = render(UserListComponent)
    
    // Initially should show loading
    expect(wrapper.container.querySelector('.el-loading-mask')).toBeInTheDocument()
  })
})
```

## Testing Complex Interactions

### Testing Form Validation

```javascript
// tests/components/AdvancedForm.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const AdvancedFormComponent = {
  template: `
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" data-testid="username" />
      </el-form-item>
      
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          data-testid="password"
        />
      </el-form-item>
      
      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          data-testid="confirm-password"
        />
      </el-form-item>
      
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" data-testid="email" />
      </el-form-item>
      
      <el-form-item label="Age" prop="age">
        <el-input-number
          v-model="form.age"
          :min="18"
          :max="100"
          data-testid="age"
        />
      </el-form-item>
      
      <el-form-item label="Gender" prop="gender">
        <el-select v-model="form.gender" data-testid="gender">
          <el-option label="Male" value="male" />
          <el-option label="Female" value="female" />
          <el-option label="Other" value="other" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Interests" prop="interests">
        <el-checkbox-group v-model="form.interests">
          <el-checkbox label="sports" data-testid="interest-sports">Sports</el-checkbox>
          <el-checkbox label="music" data-testid="interest-music">Music</el-checkbox>
          <el-checkbox label="reading" data-testid="interest-reading">Reading</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm" data-testid="submit">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  `,
  setup() {
    const form = ref({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      age: null,
      gender: '',
      interests: []
    })
    
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input password'))
      } else if (value.length < 6) {
        callback(new Error('Password must be at least 6 characters'))
      } else {
        callback()
      }
    }
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please confirm password'))
      } else if (value !== form.value.password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }
    
    const rules = {
      username: [
        { required: true, message: 'Please input username', trigger: 'blur' },
        { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
      ],
      email: [
        { required: true, message: 'Please input email', trigger: 'blur' },
        { type: 'email', message: 'Please input valid email', trigger: 'blur' }
      ],
      age: [
        { required: true, message: 'Please input age', trigger: 'blur' },
        { type: 'number', min: 18, max: 100, message: 'Age must be between 18 and 100', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: 'Please select gender', trigger: 'change' }
      ],
      interests: [
        { type: 'array', min: 1, message: 'Please select at least one interest', trigger: 'change' }
      ]
    }
    
    const formRef = ref()
    
    const submitForm = async () => {
      try {
        await formRef.value.validate()
        console.log('Form submitted:', form.value)
      } catch (error) {
        console.log('Validation failed:', error)
      }
    }
    
    return {
      form,
      rules,
      formRef,
      submitForm
    }
  }
}

describe('AdvancedForm Validation', () => {
  it('validates required fields', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const submitBtn = wrapper.find('[data-testid="submit"]')
    
    await submitBtn.trigger('click')
    await nextTick()
    
    // Check for validation error messages
    expect(wrapper.text()).toContain('Please input username')
    expect(wrapper.text()).toContain('Please input password')
    expect(wrapper.text()).toContain('Please input email')
  })
  
  it('validates password length', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const passwordInput = wrapper.find('[data-testid="password"] input')
    
    await passwordInput.setValue('123')
    await passwordInput.trigger('blur')
    await nextTick()
    
    expect(wrapper.text()).toContain('Password must be at least 6 characters')
  })
  
  it('validates password confirmation', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const passwordInput = wrapper.find('[data-testid="password"] input')
    const confirmPasswordInput = wrapper.find('[data-testid="confirm-password"] input')
    
    await passwordInput.setValue('password123')
    await confirmPasswordInput.setValue('different')
    await confirmPasswordInput.trigger('blur')
    await nextTick()
    
    expect(wrapper.text()).toContain('Passwords do not match')
  })
  
  it('validates email format', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const emailInput = wrapper.find('[data-testid="email"] input')
    
    await emailInput.setValue('invalid-email')
    await emailInput.trigger('blur')
    await nextTick()
    
    expect(wrapper.text()).toContain('Please input valid email')
  })
  
  it('validates age range', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const ageInput = wrapper.find('[data-testid="age"] input')
    
    await ageInput.setValue('15')
    await ageInput.trigger('blur')
    await nextTick()
    
    expect(wrapper.text()).toContain('Age must be between 18 and 100')
  })
  
  it('validates checkbox group selection', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const submitBtn = wrapper.find('[data-testid="submit"]')
    
    // Fill other required fields
    await wrapper.find('[data-testid="username"] input').setValue('testuser')
    await wrapper.find('[data-testid="password"] input').setValue('password123')
    await wrapper.find('[data-testid="confirm-password"] input').setValue('password123')
    await wrapper.find('[data-testid="email"] input').setValue('test@example.com')
    await wrapper.find('[data-testid="age"] input').setValue('25')
    
    // Select gender
    const genderSelect = wrapper.findComponent({ name: 'ElSelect' })
    await genderSelect.vm.$emit('update:modelValue', 'male')
    
    await submitBtn.trigger('click')
    await nextTick()
    
    expect(wrapper.text()).toContain('Please select at least one interest')
  })
  
  it('submits form with valid data', async () => {
    const wrapper = mount(AdvancedFormComponent)
    const consoleSpy = vi.spyOn(console, 'log')
    
    // Fill all fields with valid data
    await wrapper.find('[data-testid="username"] input').setValue('testuser')
    await wrapper.find('[data-testid="password"] input').setValue('password123')
    await wrapper.find('[data-testid="confirm-password"] input').setValue('password123')
    await wrapper.find('[data-testid="email"] input').setValue('test@example.com')
    await wrapper.find('[data-testid="age"] input').setValue('25')
    
    // Select gender
    const genderSelect = wrapper.findComponent({ name: 'ElSelect' })
    await genderSelect.vm.$emit('update:modelValue', 'male')
    
    // Select interests
    const sportsCheckbox = wrapper.find('[data-testid="interest-sports"] input')
    await sportsCheckbox.setChecked(true)
    
    const submitBtn = wrapper.find('[data-testid="submit"]')
    await submitBtn.trigger('click')
    await nextTick()
    
    expect(consoleSpy).toHaveBeenCalledWith('Form submitted:', expect.objectContaining({
      username: 'testuser',
      email: 'test@example.com',
      age: 25,
      gender: 'male',
      interests: ['sports']
    }))
  })
})
```

### Testing Dialog and Modal Interactions

```javascript
// tests/components/UserDialog.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'

const UserDialogComponent = {
  template: `
    <div>
      <el-button @click="showDialog" data-testid="open-dialog">
        Add User
      </el-button>
      
      <el-dialog
        v-model="dialogVisible"
        title="User Information"
        width="500px"
        :before-close="handleClose"
      >
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" data-testid="dialog-name" />
          </el-form-item>
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" data-testid="dialog-email" />
          </el-form-item>
        </el-form>
        
        <template #footer>
          <el-button @click="handleCancel" data-testid="cancel-btn">
            Cancel
          </el-button>
          <el-button
            type="primary"
            @click="handleConfirm"
            :loading="loading"
            data-testid="confirm-btn"
          >
            Confirm
          </el-button>
        </template>
      </el-dialog>
    </div>
  `,
  setup() {
    const dialogVisible = ref(false)
    const loading = ref(false)
    const form = ref({
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
    
    const formRef = ref()
    
    const showDialog = () => {
      dialogVisible.value = true
    }
    
    const handleClose = (done) => {
      if (form.value.name || form.value.email) {
        ElMessageBox.confirm(
          'You have unsaved changes. Are you sure you want to close?',
          'Warning',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        ).then(() => {
          resetForm()
          done()
        }).catch(() => {})
      } else {
        done()
      }
    }
    
    const handleCancel = () => {
      dialogVisible.value = false
      resetForm()
    }
    
    const handleConfirm = async () => {
      try {
        await formRef.value.validate()
        loading.value = true
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('User saved:', form.value)
        dialogVisible.value = false
        resetForm()
      } catch (error) {
        console.log('Validation failed')
      } finally {
        loading.value = false
      }
    }
    
    const resetForm = () => {
      form.value = { name: '', email: '' }
      if (formRef.value) {
        formRef.value.clearValidate()
      }
    }
    
    return {
      dialogVisible,
      loading,
      form,
      rules,
      formRef,
      showDialog,
      handleClose,
      handleCancel,
      handleConfirm
    }
  }
}

describe('UserDialog', () => {
  it('opens dialog when button is clicked', async () => {
    const wrapper = mount(UserDialogComponent)
    const openBtn = wrapper.find('[data-testid="open-dialog"]')
    
    expect(wrapper.vm.dialogVisible).toBe(false)
    
    await openBtn.trigger('click')
    
    expect(wrapper.vm.dialogVisible).toBe(true)
  })
  
  it('closes dialog when cancel is clicked', async () => {
    const wrapper = mount(UserDialogComponent)
    
    // Open dialog
    wrapper.vm.dialogVisible = true
    await nextTick()
    
    const cancelBtn = wrapper.find('[data-testid="cancel-btn"]')
    await cancelBtn.trigger('click')
    
    expect(wrapper.vm.dialogVisible).toBe(false)
  })
  
  it('validates form before confirming', async () => {
    const wrapper = mount(UserDialogComponent)
    const consoleSpy = vi.spyOn(console, 'log')
    
    // Open dialog
    wrapper.vm.dialogVisible = true
    await nextTick()
    
    const confirmBtn = wrapper.find('[data-testid="confirm-btn"]')
    await confirmBtn.trigger('click')
    await nextTick()
    
    // Should show validation errors
    expect(wrapper.text()).toContain('Please input name')
    expect(consoleSpy).toHaveBeenCalledWith('Validation failed')
  })
  
  it('submits form with valid data', async () => {
    const wrapper = mount(UserDialogComponent)
    const consoleSpy = vi.spyOn(console, 'log')
    
    // Open dialog
    wrapper.vm.dialogVisible = true
    await nextTick()
    
    // Fill form
    const nameInput = wrapper.find('[data-testid="dialog-name"] input')
    const emailInput = wrapper.find('[data-testid="dialog-email"] input')
    
    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    
    const confirmBtn = wrapper.find('[data-testid="confirm-btn"]')
    await confirmBtn.trigger('click')
    
    // Should show loading state
    expect(wrapper.vm.loading).toBe(true)
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 1100))
    
    expect(consoleSpy).toHaveBeenCalledWith('User saved:', {
      name: 'John Doe',
      email: 'john@example.com'
    })
    expect(wrapper.vm.dialogVisible).toBe(false)
  })
})
```

## Testing Async Operations

### Testing API Calls

```javascript
// tests/composables/useUserApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUserApi } from '@/composables/useUserApi'

// Mock fetch
global.fetch = vi.fn()

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

describe('useUserApi', () => {
  beforeEach(() => {
    fetch.mockClear()
  })
  
  it('fetches users successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockUsers, total: 2 })
    })
    
    const { users, loading, error, fetchUsers } = useUserApi()
    
    expect(loading.value).toBe(false)
    expect(users.value).toEqual([])
    
    await fetchUsers()
    
    expect(fetch).toHaveBeenCalledWith('/api/users')
    expect(users.value).toEqual(mockUsers)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })
  
  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch'
    fetch.mockRejectedValueOnce(new Error(errorMessage))
    
    const { users, loading, error, fetchUsers } = useUserApi()
    
    await fetchUsers()
    
    expect(users.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBe(errorMessage)
  })
  
  it('creates user successfully', async () => {
    const newUser = { name: 'New User', email: 'new@example.com' }
    const createdUser = { id: 3, ...newUser }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdUser
    })
    
    const { createUser } = useUserApi()
    const result = await createUser(newUser)
    
    expect(fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    expect(result).toEqual(createdUser)
  })
  
  it('updates user successfully', async () => {
    const userId = 1
    const updates = { name: 'Updated Name' }
    const updatedUser = { id: userId, name: 'Updated Name', email: 'john@example.com' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedUser
    })
    
    const { updateUser } = useUserApi()
    const result = await updateUser(userId, updates)
    
    expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    expect(result).toEqual(updatedUser)
  })
  
  it('deletes user successfully', async () => {
    const userId = 1
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })
    
    const { deleteUser } = useUserApi()
    const result = await deleteUser(userId)
    
    expect(fetch).toHaveBeenCalledWith(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    expect(result).toEqual({ success: true })
  })
})
```

### Testing Loading States

```javascript
// tests/components/AsyncComponent.test.js
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'

const AsyncComponentTest = {
  template: `
    <div>
      <el-button @click="loadData" :loading="loading" data-testid="load-btn">
        Load Data
      </el-button>
      
      <div v-if="loading" data-testid="loading-state">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="error" data-testid="error-state">
        <el-alert type="error" :title="error" show-icon />
      </div>
      
      <div v-else-if="data.length > 0" data-testid="data-state">
        <el-card v-for="item in data" :key="item.id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </el-card>
      </div>
      
      <div v-else data-testid="empty-state">
        <el-empty description="No data available" />
      </div>
    </div>
  `,
  setup() {
    const data = ref([])
    const loading = ref(false)
    const error = ref(null)
    
    const loadData = async () => {
      loading.value = true
      error.value = null
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (Math.random() > 0.7) {
          throw new Error('Random error occurred')
        }
        
        data.value = [
          { id: 1, title: 'Item 1', description: 'Description 1' },
          { id: 2, title: 'Item 2', description: 'Description 2' }
        ]
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    return {
      data,
      loading,
      error,
      loadData
    }
  }
}

describe('AsyncComponent', () => {
  it('shows initial empty state', () => {
    const wrapper = mount(AsyncComponentTest)
    
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="data-state"]').exists()).toBe(false)
  })
  
  it('shows loading state when loading data', async () => {
    const wrapper = mount(AsyncComponentTest)
    const loadBtn = wrapper.find('[data-testid="load-btn"]')
    
    await loadBtn.trigger('click')
    
    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(true)
    expect(wrapper.vm.loading).toBe(true)
  })
  
  it('shows data state after successful load', async () => {
    // Mock Math.random to ensure success
    const originalRandom = Math.random
    Math.random = vi.fn(() => 0.5) // Less than 0.7, so no error
    
    const wrapper = mount(AsyncComponentTest)
    const loadBtn = wrapper.find('[data-testid="load-btn"]')
    
    await loadBtn.trigger('click')
    
    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 1100))
    await flushPromises()
    
    expect(wrapper.find('[data-testid="data-state"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Item 1')
    expect(wrapper.text()).toContain('Item 2')
    
    // Restore Math.random
    Math.random = originalRandom
  })
  
  it('shows error state when load fails', async () => {
    // Mock Math.random to ensure error
    const originalRandom = Math.random
    Math.random = vi.fn(() => 0.8) // Greater than 0.7, so error occurs
    
    const wrapper = mount(AsyncComponentTest)
    const loadBtn = wrapper.find('[data-testid="load-btn"]')
    
    await loadBtn.trigger('click')
    
    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 1100))
    await flushPromises()
    
    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading-state"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Random error occurred')
    
    // Restore Math.random
    Math.random = originalRandom
  })
})
```

## Testing Utilities and Helpers

### Custom Test Utilities

```javascript
// tests/utils/test-utils.js
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'

// Create test wrapper with common setup
export function createWrapper(component, options = {}) {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        test: 'Test message'
      }
    }
  })
  
  return mount(component, {
    global: {
      plugins: [ElementPlus, i18n],
      ...options.global
    },
    ...options
  })
}

// Wait for Element Plus components to be ready
export async function waitForElement(wrapper, selector, timeout = 1000) {
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    if (wrapper.find(selector).exists()) {
      return wrapper.find(selector)
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  throw new Error(`Element ${selector} not found within ${timeout}ms`)
}

// Trigger Element Plus component events
export async function triggerElEvent(wrapper, componentName, event, payload) {
  const component = wrapper.findComponent({ name: componentName })
  if (!component.exists()) {
    throw new Error(`Component ${componentName} not found`)
  }
  
  await component.vm.$emit(event, payload)
  await wrapper.vm.$nextTick()
}

// Mock Element Plus message components
export function mockElMessage() {
  return {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}

export function mockElMessageBox() {
  return {
    confirm: vi.fn().mockResolvedValue('confirm'),
    alert: vi.fn().mockResolvedValue('confirm'),
    prompt: vi.fn().mockResolvedValue({ value: 'test' })
  }
}

// Form testing helpers
export async function fillForm(wrapper, formData) {
  for (const [field, value] of Object.entries(formData)) {
    const input = wrapper.find(`[data-testid="${field}"] input`)
    if (input.exists()) {
      await input.setValue(value)
    }
  }
}

export async function submitForm(wrapper, formTestId = 'form') {
  const form = wrapper.find(`[data-testid="${formTestId}"]`)
  if (form.exists()) {
    await form.trigger('submit')
  }
}

// Table testing helpers
export function getTableRows(wrapper) {
  return wrapper.findAll('.el-table__row')
}

export function getTableCell(wrapper, row, column) {
  const rows = getTableRows(wrapper)
  if (rows[row]) {
    const cells = rows[row].findAll('.el-table__cell')
    return cells[column]
  }
  return null
}

export async function sortTable(wrapper, columnIndex) {
  const headers = wrapper.findAll('.el-table__header-wrapper th')
  if (headers[columnIndex]) {
    const sortButton = headers[columnIndex].find('.caret-wrapper')
    if (sortButton.exists()) {
      await sortButton.trigger('click')
    }
  }
}
```

### Using Test Utilities

```javascript
// tests/components/UserTable.test.js
import { describe, it, expect } from 'vitest'
import UserTable from '@/components/UserTable.vue'
import {
  createWrapper,
  getTableRows,
  getTableCell,
  sortTable,
  triggerElEvent
} from '../utils/test-utils'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
]

describe('UserTable', () => {
  it('renders user data correctly', () => {
    const wrapper = createWrapper(UserTable, {
      props: { users: mockUsers }
    })
    
    const rows = getTableRows(wrapper)
    expect(rows).toHaveLength(3)
    
    // Check first row data
    expect(getTableCell(wrapper, 0, 0).text()).toBe('John Doe')
    expect(getTableCell(wrapper, 0, 1).text()).toBe('john@example.com')
    expect(getTableCell(wrapper, 0, 2).text()).toBe('30')
  })
  
  it('sorts table by name column', async () => {
    const wrapper = createWrapper(UserTable, {
      props: { users: mockUsers }
    })
    
    // Sort by name column (index 0)
    await sortTable(wrapper, 0)
    
    // Check if sorting event was emitted
    expect(wrapper.emitted('sort-change')).toBeTruthy()
  })
  
  it('emits edit event when edit button is clicked', async () => {
    const wrapper = createWrapper(UserTable, {
      props: { users: mockUsers }
    })
    
    const editButton = wrapper.find('[data-testid="edit-user-1"]')
    await editButton.trigger('click')
    
    expect(wrapper.emitted('edit-user')).toBeTruthy()
    expect(wrapper.emitted('edit-user')[0]).toEqual([mockUsers[0]])
  })
})
```

## Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe` blocks
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests focused and isolated

### 2. Component Testing
- Test component behavior, not implementation
- Use data-testid attributes for reliable element selection
- Test user interactions and edge cases
- Mock external dependencies

### 3. Async Testing
- Use `await` and `flushPromises()` for async operations
- Test loading states and error handling
- Mock API calls and timers
- Test timeout scenarios

### 4. Form Testing
- Test validation rules thoroughly
- Test form submission and reset
- Test field interactions and dependencies
- Test accessibility features

### 5. Performance
- Use shallow mounting when possible
- Mock heavy components and operations
- Clean up after tests
- Use test utilities for common operations

By following these testing patterns and best practices, you can ensure your Element Plus applications are well-tested, reliable, and maintainable.