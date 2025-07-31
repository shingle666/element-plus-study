# Testing Strategies and Quality Assurance for Element Plus Applications

## Overview

This guide covers comprehensive testing strategies and quality assurance practices for Element Plus applications, including unit testing, integration testing, end-to-end testing, and automated quality checks.

## Testing Framework Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.ts' // Re-export files
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,ts,vue}',
      'tests/unit/**/*.{test,spec}.{js,ts,vue}'
    ],
    
    // Mock configuration
    deps: {
      inline: ['element-plus']
    }
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tests': resolve(__dirname, 'tests')
    }
  }
})
```

```typescript
// tests/setup.ts
import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Global test configuration
config.global.plugins = [createPinia(), ElementPlus]

// Register Element Plus icons globally for tests
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  config.global.components[key] = component
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}

// Setup global test utilities
global.console.warn = vi.fn()
global.console.error = vi.fn()
```

## Unit Testing Strategies

### Component Testing

```typescript
// tests/unit/components/UserForm.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import UserForm from '@/components/UserForm.vue'
import type { User } from '@/types/user'

describe('UserForm', () => {
  let wrapper: VueWrapper<any>
  
  const defaultProps = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    } as User,
    loading: false
  }
  
  const createWrapper = (props = {}) => {
    return mount(UserForm, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          ElForm,
          ElFormItem,
          ElInput,
          ElButton
        }
      }
    })
  }
  
  beforeEach(() => {
    wrapper = createWrapper()
  })
  
  afterEach(() => {
    wrapper.unmount()
  })
  
  describe('Rendering', () => {
    it('should render form with user data', () => {
      expect(wrapper.find('[data-testid="user-name"]').element.value)
        .toBe('John Doe')
      expect(wrapper.find('[data-testid="user-email"]').element.value)
        .toBe('john@example.com')
    })
    
    it('should show loading state', async () => {
      await wrapper.setProps({ loading: true })
      
      const submitButton = wrapper.find('[data-testid="submit-button"]')
      expect(submitButton.attributes('loading')).toBeDefined()
      expect(submitButton.text()).toContain('Saving...')
    })
    
    it('should disable form when loading', async () => {
      await wrapper.setProps({ loading: true })
      
      const form = wrapper.findComponent(ElForm)
      expect(form.attributes('disabled')).toBeDefined()
    })
  })
  
  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      const nameInput = wrapper.find('[data-testid="user-name"]')
      const emailInput = wrapper.find('[data-testid="user-email"]')
      
      await nameInput.setValue('')
      await emailInput.setValue('')
      
      const form = wrapper.findComponent(ElForm)
      const isValid = await form.vm.validate().catch(() => false)
      
      expect(isValid).toBe(false)
    })
    
    it('should validate email format', async () => {
      const emailInput = wrapper.find('[data-testid="user-email"]')
      await emailInput.setValue('invalid-email')
      
      const form = wrapper.findComponent(ElForm)
      const isValid = await form.vm.validate().catch(() => false)
      
      expect(isValid).toBe(false)
    })
    
    it('should pass validation with valid data', async () => {
      const form = wrapper.findComponent(ElForm)
      const isValid = await form.vm.validate().catch(() => false)
      
      expect(isValid).toBe(true)
    })
  })
  
  describe('Events', () => {
    it('should emit submit event with form data', async () => {
      const form = wrapper.findComponent(ElForm)
      await form.vm.validate()
      
      const submitButton = wrapper.find('[data-testid="submit-button"]')
      await submitButton.trigger('click')
      
      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')[0]).toEqual([defaultProps.user])
    })
    
    it('should emit cancel event', async () => {
      const cancelButton = wrapper.find('[data-testid="cancel-button"]')
      await cancelButton.trigger('click')
      
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
    
    it('should not submit invalid form', async () => {
      const nameInput = wrapper.find('[data-testid="user-name"]')
      await nameInput.setValue('')
      
      const submitButton = wrapper.find('[data-testid="submit-button"]')
      await submitButton.trigger('click')
      
      expect(wrapper.emitted('submit')).toBeFalsy()
    })
  })
  
  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const nameInput = wrapper.find('[data-testid="user-name"]')
      const emailInput = wrapper.find('[data-testid="user-email"]')
      
      expect(nameInput.attributes('aria-label')).toBe('User name')
      expect(emailInput.attributes('aria-label')).toBe('User email')
    })
    
    it('should have proper form structure', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
      
      const fieldsets = wrapper.findAll('fieldset')
      expect(fieldsets.length).toBeGreaterThan(0)
    })
  })
})
```

### Composables Testing

```typescript
// tests/unit/composables/useApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import * as apiService from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}))

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('GET requests', () => {
    it('should handle successful GET request', async () => {
      const mockData = { id: 1, name: 'Test User' }
      vi.mocked(apiService.get).mockResolvedValue({ data: mockData })
      
      const { data, loading, error, execute } = useApi('/users/1')
      
      expect(loading.value).toBe(false)
      expect(data.value).toBeNull()
      expect(error.value).toBeNull()
      
      await execute()
      
      expect(loading.value).toBe(false)
      expect(data.value).toEqual(mockData)
      expect(error.value).toBeNull()
      expect(apiService.get).toHaveBeenCalledWith('/users/1')
    })
    
    it('should handle GET request errors', async () => {
      const mockError = new Error('Network error')
      vi.mocked(apiService.get).mockRejectedValue(mockError)
      
      const { data, loading, error, execute } = useApi('/users/1')
      
      await execute()
      
      expect(loading.value).toBe(false)
      expect(data.value).toBeNull()
      expect(error.value).toBe(mockError)
    })
    
    it('should set loading state during request', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      
      vi.mocked(apiService.get).mockReturnValue(promise)
      
      const { loading, execute } = useApi('/users/1')
      
      const executePromise = execute()
      
      expect(loading.value).toBe(true)
      
      resolvePromise({ data: {} })
      await executePromise
      
      expect(loading.value).toBe(false)
    })
  })
  
  describe('POST requests', () => {
    it('should handle successful POST request', async () => {
      const mockData = { id: 1, name: 'New User' }
      const postData = { name: 'New User', email: 'new@example.com' }
      
      vi.mocked(apiService.post).mockResolvedValue({ data: mockData })
      
      const { data, execute } = useApi('/users', {
        method: 'POST',
        immediate: false
      })
      
      await execute(postData)
      
      expect(data.value).toEqual(mockData)
      expect(apiService.post).toHaveBeenCalledWith('/users', postData)
    })
  })
  
  describe('Configuration options', () => {
    it('should execute immediately when immediate is true', async () => {
      const mockData = { id: 1, name: 'Test User' }
      vi.mocked(apiService.get).mockResolvedValue({ data: mockData })
      
      const { data } = useApi('/users/1', { immediate: true })
      
      // Wait for next tick
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(apiService.get).toHaveBeenCalledWith('/users/1')
      expect(data.value).toEqual(mockData)
    })
    
    it('should not execute immediately when immediate is false', async () => {
      const { data } = useApi('/users/1', { immediate: false })
      
      await new Promise(resolve => setTimeout(resolve, 0))
      
      expect(apiService.get).not.toHaveBeenCalled()
      expect(data.value).toBeNull()
    })
    
    it('should transform response data', async () => {
      const mockData = { id: 1, name: 'Test User' }
      const transformedData = { userId: 1, userName: 'Test User' }
      
      vi.mocked(apiService.get).mockResolvedValue({ data: mockData })
      
      const { data, execute } = useApi('/users/1', {
        transform: (data: any) => ({
          userId: data.id,
          userName: data.name
        })
      })
      
      await execute()
      
      expect(data.value).toEqual(transformedData)
    })
  })
})
```

### Store Testing

```typescript
// tests/unit/stores/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import * as authApi from '@/api/auth'
import type { User, LoginCredentials } from '@/types/auth'

// Mock the auth API
vi.mock('@/api/auth', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  refreshToken: vi.fn(),
  getCurrentUser: vi.fn()
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>
  
  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
  })
  
  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.loading).toBe(false)
    })
  })
  
  describe('Login', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
    
    const mockToken = 'mock-jwt-token'
    const credentials: LoginCredentials = {
      email: 'john@example.com',
      password: 'password123'
    }
    
    it('should login successfully', async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        user: mockUser,
        token: mockToken
      })
      
      await authStore.login(credentials)
      
      expect(authStore.user).toEqual(mockUser)
      expect(authStore.token).toBe(mockToken)
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.loading).toBe(false)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockToken)
      expect(authApi.login).toHaveBeenCalledWith(credentials)
    })
    
    it('should handle login failure', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(authApi.login).mockRejectedValue(error)
      
      await expect(authStore.login(credentials)).rejects.toThrow('Invalid credentials')
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.loading).toBe(false)
    })
    
    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise(resolve => {
        resolveLogin = resolve
      })
      
      vi.mocked(authApi.login).mockReturnValue(loginPromise)
      
      const loginCall = authStore.login(credentials)
      
      expect(authStore.loading).toBe(true)
      
      resolveLogin({ user: mockUser, token: mockToken })
      await loginCall
      
      expect(authStore.loading).toBe(false)
    })
  })
  
  describe('Logout', () => {
    beforeEach(async () => {
      // Set up authenticated state
      authStore.$patch({
        user: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        token: 'mock-token'
      })
    })
    
    it('should logout successfully', async () => {
      vi.mocked(authApi.logout).mockResolvedValue(undefined)
      
      await authStore.logout()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
      expect(authApi.logout).toHaveBeenCalled()
    })
    
    it('should clear state even if API call fails', async () => {
      vi.mocked(authApi.logout).mockRejectedValue(new Error('Network error'))
      
      await authStore.logout()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })
  
  describe('Token Refresh', () => {
    it('should refresh token successfully', async () => {
      const newToken = 'new-mock-token'
      vi.mocked(authApi.refreshToken).mockResolvedValue({ token: newToken })
      
      authStore.$patch({ token: 'old-token' })
      
      await authStore.refreshToken()
      
      expect(authStore.token).toBe(newToken)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', newToken)
    })
    
    it('should logout on refresh failure', async () => {
      vi.mocked(authApi.refreshToken).mockRejectedValue(new Error('Token expired'))
      
      authStore.$patch({ token: 'old-token' })
      
      await authStore.refreshToken()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })
  
  describe('Getters', () => {
    it('should compute isAuthenticated correctly', () => {
      expect(authStore.isAuthenticated).toBe(false)
      
      authStore.$patch({ token: 'mock-token' })
      expect(authStore.isAuthenticated).toBe(true)
      
      authStore.$patch({ token: null })
      expect(authStore.isAuthenticated).toBe(false)
    })
    
    it('should compute userRole correctly', () => {
      expect(authStore.userRole).toBeNull()
      
      authStore.$patch({
        user: { id: 1, name: 'John', email: 'john@example.com', role: 'admin' }
      })
      expect(authStore.userRole).toBe('admin')
    })
  })
})
```

## Integration Testing

### API Integration Tests

```typescript
// tests/integration/api.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { userApi } from '@/api/users'
import type { User } from '@/types/user'

// Mock server setup
const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
        ],
        total: 2,
        page: 1,
        limit: 10
      })
    )
  }),
  
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params
    
    if (id === '1') {
      return res(
        ctx.json({
          data: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' }
        })
      )
    }
    
    return res(ctx.status(404), ctx.json({ error: 'User not found' }))
  }),
  
  rest.post('/api/users', async (req, res, ctx) => {
    const userData = await req.json()
    
    return res(
      ctx.status(201),
      ctx.json({
        data: {
          id: 3,
          ...userData,
          createdAt: new Date().toISOString()
        }
      })
    )
  }),
  
  rest.put('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params
    const userData = await req.json()
    
    return res(
      ctx.json({
        data: {
          id: parseInt(id as string),
          ...userData,
          updatedAt: new Date().toISOString()
        }
      })
    )
  }),
  
  rest.delete('/api/users/:id', (req, res, ctx) => {
    return res(ctx.status(204))
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('User API Integration', () => {
  describe('GET /api/users', () => {
    it('should fetch users list', async () => {
      const response = await userApi.getUsers()
      
      expect(response.data).toHaveLength(2)
      expect(response.total).toBe(2)
      expect(response.data[0]).toMatchObject({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      })
    })
    
    it('should handle pagination parameters', async () => {
      const response = await userApi.getUsers({ page: 1, limit: 5 })
      
      expect(response.page).toBe(1)
      expect(response.limit).toBe(10) // Server returns default
    })
  })
  
  describe('GET /api/users/:id', () => {
    it('should fetch single user', async () => {
      const user = await userApi.getUser(1)
      
      expect(user).toMatchObject({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      })
    })
    
    it('should handle user not found', async () => {
      await expect(userApi.getUser(999)).rejects.toThrow('User not found')
    })
  })
  
  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'user' as const
      }
      
      const createdUser = await userApi.createUser(newUser)
      
      expect(createdUser).toMatchObject({
        id: 3,
        ...newUser
      })
      expect(createdUser.createdAt).toBeDefined()
    })
  })
  
  describe('PUT /api/users/:id', () => {
    it('should update user', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'admin' as const
      }
      
      const updatedUser = await userApi.updateUser(1, updateData)
      
      expect(updatedUser).toMatchObject({
        id: 1,
        ...updateData
      })
      expect(updatedUser.updatedAt).toBeDefined()
    })
  })
  
  describe('DELETE /api/users/:id', () => {
    it('should delete user', async () => {
      await expect(userApi.deleteUser(1)).resolves.toBeUndefined()
    })
  })
})
```

### Component Integration Tests

```typescript
// tests/integration/UserManagement.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ElTable, ElButton, ElDialog } from 'element-plus'
import UserManagement from '@/views/UserManagement.vue'
import { useUserStore } from '@/stores/users'
import * as userApi from '@/api/users'

// Mock the user API
vi.mock('@/api/users', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn()
}))

describe('UserManagement Integration', () => {
  let wrapper: any
  let userStore: any
  
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
  ]
  
  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    
    vi.mocked(userApi.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10
    })
    
    wrapper = mount(UserManagement, {
      global: {
        components: {
          ElTable,
          ElButton,
          ElDialog
        }
      }
    })
  })
  
  afterEach(() => {
    wrapper.unmount()
    vi.clearAllMocks()
  })
  
  describe('Data Loading', () => {
    it('should load users on mount', async () => {
      await wrapper.vm.$nextTick()
      
      expect(userApi.getUsers).toHaveBeenCalled()
      expect(userStore.users).toEqual(mockUsers)
    })
    
    it('should display users in table', async () => {
      await wrapper.vm.$nextTick()
      
      const table = wrapper.findComponent(ElTable)
      expect(table.exists()).toBe(true)
      
      // Check if user data is displayed
      const tableRows = wrapper.findAll('[data-testid="user-row"]')
      expect(tableRows).toHaveLength(2)
      
      expect(tableRows[0].text()).toContain('John Doe')
      expect(tableRows[0].text()).toContain('john@example.com')
    })
  })
  
  describe('User Creation', () => {
    it('should open create dialog', async () => {
      const createButton = wrapper.find('[data-testid="create-user-button"]')
      await createButton.trigger('click')
      
      const dialog = wrapper.findComponent(ElDialog)
      expect(dialog.props('modelValue')).toBe(true)
    })
    
    it('should create new user', async () => {
      const newUser = {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'user'
      }
      
      vi.mocked(userApi.createUser).mockResolvedValue({
        id: 3,
        ...newUser
      })
      
      // Open create dialog
      const createButton = wrapper.find('[data-testid="create-user-button"]')
      await createButton.trigger('click')
      
      // Fill form
      const nameInput = wrapper.find('[data-testid="user-name-input"]')
      const emailInput = wrapper.find('[data-testid="user-email-input"]')
      
      await nameInput.setValue(newUser.name)
      await emailInput.setValue(newUser.email)
      
      // Submit form
      const submitButton = wrapper.find('[data-testid="submit-user-button"]')
      await submitButton.trigger('click')
      
      expect(userApi.createUser).toHaveBeenCalledWith(newUser)
    })
  })
  
  describe('User Editing', () => {
    it('should open edit dialog with user data', async () => {
      await wrapper.vm.$nextTick()
      
      const editButton = wrapper.find('[data-testid="edit-user-1"]')
      await editButton.trigger('click')
      
      const dialog = wrapper.findComponent(ElDialog)
      expect(dialog.props('modelValue')).toBe(true)
      
      // Check if form is populated with user data
      const nameInput = wrapper.find('[data-testid="user-name-input"]')
      const emailInput = wrapper.find('[data-testid="user-email-input"]')
      
      expect(nameInput.element.value).toBe('John Doe')
      expect(emailInput.element.value).toBe('john@example.com')
    })
    
    it('should update user', async () => {
      const updatedUser = {
        name: 'John Updated',
        email: 'john.updated@example.com',
        role: 'admin'
      }
      
      vi.mocked(userApi.updateUser).mockResolvedValue({
        id: 1,
        ...updatedUser
      })
      
      await wrapper.vm.$nextTick()
      
      // Open edit dialog
      const editButton = wrapper.find('[data-testid="edit-user-1"]')
      await editButton.trigger('click')
      
      // Update form
      const nameInput = wrapper.find('[data-testid="user-name-input"]')
      const emailInput = wrapper.find('[data-testid="user-email-input"]')
      
      await nameInput.setValue(updatedUser.name)
      await emailInput.setValue(updatedUser.email)
      
      // Submit form
      const submitButton = wrapper.find('[data-testid="submit-user-button"]')
      await submitButton.trigger('click')
      
      expect(userApi.updateUser).toHaveBeenCalledWith(1, updatedUser)
    })
  })
  
  describe('User Deletion', () => {
    it('should delete user with confirmation', async () => {
      vi.mocked(userApi.deleteUser).mockResolvedValue(undefined)
      
      await wrapper.vm.$nextTick()
      
      const deleteButton = wrapper.find('[data-testid="delete-user-1"]')
      await deleteButton.trigger('click')
      
      // Confirm deletion
      const confirmButton = wrapper.find('[data-testid="confirm-delete"]')
      await confirmButton.trigger('click')
      
      expect(userApi.deleteUser).toHaveBeenCalledWith(1)
    })
  })
  
  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      vi.mocked(userApi.getUsers).mockRejectedValue(new Error('Network error'))
      
      const wrapper = mount(UserManagement, {
        global: {
          components: { ElTable, ElButton, ElDialog }
        }
      })
      
      await wrapper.vm.$nextTick()
      
      // Check if error message is displayed
      const errorMessage = wrapper.find('[data-testid="error-message"]')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toContain('Failed to load users')
    })
  })
})
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

### E2E Test Examples

```typescript
// tests/e2e/user-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/users', async route => {
      await route.fulfill({
        json: {
          data: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
          ],
          total: 2,
          page: 1,
          limit: 10
        }
      })
    })
    
    await page.goto('/users')
  })
  
  test('should display users list', async ({ page }) => {
    // Wait for the table to load
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible()
    
    // Check if users are displayed
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=jane@example.com')).toBeVisible()
    
    // Check table structure
    const rows = page.locator('[data-testid="user-row"]')
    await expect(rows).toHaveCount(2)
  })
  
  test('should create new user', async ({ page }) => {
    // Mock create user API
    await page.route('/api/users', async route => {
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          json: {
            data: {
              id: 3,
              ...postData,
              createdAt: new Date().toISOString()
            }
          }
        })
      }
    })
    
    // Click create button
    await page.click('[data-testid="create-user-button"]')
    
    // Wait for dialog to open
    await expect(page.locator('.el-dialog')).toBeVisible()
    
    // Fill form
    await page.fill('[data-testid="user-name-input"]', 'Bob Wilson')
    await page.fill('[data-testid="user-email-input"]', 'bob@example.com')
    await page.selectOption('[data-testid="user-role-select"]', 'user')
    
    // Submit form
    await page.click('[data-testid="submit-user-button"]')
    
    // Wait for dialog to close
    await expect(page.locator('.el-dialog')).not.toBeVisible()
    
    // Check if success message is shown
    await expect(page.locator('.el-message--success')).toBeVisible()
  })
  
  test('should edit user', async ({ page }) => {
    // Mock update user API
    await page.route('/api/users/1', async route => {
      if (route.request().method() === 'PUT') {
        const putData = route.request().postDataJSON()
        await route.fulfill({
          json: {
            data: {
              id: 1,
              ...putData,
              updatedAt: new Date().toISOString()
            }
          }
        })
      }
    })
    
    // Click edit button for first user
    await page.click('[data-testid="edit-user-1"]')
    
    // Wait for dialog to open
    await expect(page.locator('.el-dialog')).toBeVisible()
    
    // Check if form is pre-filled
    await expect(page.locator('[data-testid="user-name-input"]')).toHaveValue('John Doe')
    
    // Update name
    await page.fill('[data-testid="user-name-input"]', 'John Updated')
    
    // Submit form
    await page.click('[data-testid="submit-user-button"]')
    
    // Wait for dialog to close
    await expect(page.locator('.el-dialog')).not.toBeVisible()
    
    // Check if success message is shown
    await expect(page.locator('.el-message--success')).toBeVisible()
  })
  
  test('should delete user', async ({ page }) => {
    // Mock delete user API
    await page.route('/api/users/1', async route => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 })
      }
    })
    
    // Click delete button
    await page.click('[data-testid="delete-user-1"]')
    
    // Wait for confirmation dialog
    await expect(page.locator('.el-message-box')).toBeVisible()
    
    // Confirm deletion
    await page.click('.el-message-box__btns .el-button--primary')
    
    // Wait for confirmation dialog to close
    await expect(page.locator('.el-message-box')).not.toBeVisible()
    
    // Check if success message is shown
    await expect(page.locator('.el-message--success')).toBeVisible()
  })
  
  test('should handle form validation', async ({ page }) => {
    // Click create button
    await page.click('[data-testid="create-user-button"]')
    
    // Wait for dialog to open
    await expect(page.locator('.el-dialog')).toBeVisible()
    
    // Try to submit empty form
    await page.click('[data-testid="submit-user-button"]')
    
    // Check for validation errors
    await expect(page.locator('.el-form-item__error')).toHaveCount(2)
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
    
    // Fill invalid email
    await page.fill('[data-testid="user-name-input"]', 'Test User')
    await page.fill('[data-testid="user-email-input"]', 'invalid-email')
    
    // Try to submit
    await page.click('[data-testid="submit-user-button"]')
    
    // Check for email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible()
  })
  
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile layout is applied
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible()
    
    // Check if action buttons are properly sized
    const actionButtons = page.locator('[data-testid^="edit-user-"], [data-testid^="delete-user-"]')
    for (const button of await actionButtons.all()) {
      await expect(button).toBeVisible()
    }
  })
})
```

### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('should match user management page screenshot', async ({ page }) => {
    await page.goto('/users')
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="users-table"]')
    
    // Take screenshot
    await expect(page).toHaveScreenshot('user-management.png')
  })
  
  test('should match create user dialog screenshot', async ({ page }) => {
    await page.goto('/users')
    
    // Open create dialog
    await page.click('[data-testid="create-user-button"]')
    await page.waitForSelector('.el-dialog')
    
    // Take screenshot of dialog
    await expect(page.locator('.el-dialog')).toHaveScreenshot('create-user-dialog.png')
  })
  
  test('should match form validation errors screenshot', async ({ page }) => {
    await page.goto('/users')
    
    // Open create dialog
    await page.click('[data-testid="create-user-button"]')
    await page.waitForSelector('.el-dialog')
    
    // Try to submit empty form to trigger validation
    await page.click('[data-testid="submit-user-button"]')
    
    // Wait for validation errors
    await page.waitForSelector('.el-form-item__error')
    
    // Take screenshot
    await expect(page.locator('.el-dialog')).toHaveScreenshot('form-validation-errors.png')
  })
})
```

## Quality Assurance Automation

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-push": "npm run test:unit && npm run type-check"
    }
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss,vue}": [
      "stylelint --fix"
    ],
    "*.{md,json}": [
      "prettier --write"
    ]
  }
}
```

### Quality Gates

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run linting
      run: pnpm run lint
    
    - name: Run type checking
      run: pnpm run type-check
    
    - name: Run unit tests with coverage
      run: pnpm run test:unit --coverage
    
    - name: Check coverage thresholds
      run: |
        COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
        if (( $(echo "$COVERAGE < 80" | bc -l) )); then
          echo "Coverage $COVERAGE% is below threshold of 80%"
          exit 1
        fi
    
    - name: Run security audit
      run: pnpm audit --audit-level moderate
    
    - name: Check bundle size
      run: |
        pnpm run build
        BUNDLE_SIZE=$(du -sb dist | cut -f1)
        MAX_SIZE=5242880  # 5MB
        if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
          echo "Bundle size $BUNDLE_SIZE bytes exceeds maximum of $MAX_SIZE bytes"
          exit 1
        fi
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

This comprehensive testing strategy ensures high-quality Element Plus applications through automated testing at multiple levels, from unit tests to end-to-end scenarios, with robust quality assurance processes.