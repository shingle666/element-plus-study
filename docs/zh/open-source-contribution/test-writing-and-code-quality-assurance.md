# 第68天：Element Plus 测试编写与代码质量保证

## 学习目标

* 掌握 Element Plus 的测试体系和测试工具
* 学习编写高质量的单元测试和集成测试
* 了解代码质量保证的最佳实践
* 理解测试驱动开发（TDD）在组件库开发中的应用

## 知识点概览

### 1. 测试体系架构

#### 1.1 测试金字塔

```typescript
// 测试金字塔结构
interface TestPyramid {
  // 单元测试（70%）- 快速、隔离、大量
  unitTests: {
    componentLogic: boolean
    utilityFunctions: boolean
    composables: boolean
    stores: boolean
  }
  
  // 集成测试（20%）- 组件间交互
  integrationTests: {
    componentInteraction: boolean
    apiIntegration: boolean
    routerIntegration: boolean
    storeIntegration: boolean
  }
  
  // E2E 测试（10%）- 用户场景
  e2eTests: {
    userWorkflows: boolean
    crossBrowserTesting: boolean
    performanceTesting: boolean
    accessibilityTesting: boolean
  }
}

// Element Plus 测试配置
interface ElementPlusTestConfig {
  // 测试框架
  framework: 'vitest'
  
  // 测试环境
  environment: 'jsdom' | 'happy-dom'
  
  // 测试工具
  tools: {
    testingLibrary: '@vue/test-utils'
    userEvents: '@testing-library/user-event'
    mockLibrary: 'vitest/mock'
    coverageProvider: 'v8'
  }
  
  // 覆盖率要求
  coverage: {
    statements: 80
    branches: 80
    functions: 80
    lines: 80
  }
}
```

#### 1.2 测试环境配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局设置
    globals: true,
    
    // 设置文件
    setupFiles: ['./test/setup.ts'],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts'
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    
    // 测试文件匹配
    include: [
      'packages/**/__tests__/**/*.{test,spec}.{js,ts,tsx}',
      'packages/**/*.{test,spec}.{js,ts,tsx}'
    ],
    
    // 排除文件
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache'
    ]
  },
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages'),
      '~': resolve(__dirname, './packages')
    }
  }
})
```

```typescript
// test/setup.ts
import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import ElementPlus from 'element-plus'

// 全局组件注册
config.global.plugins = [ElementPlus]

// 全局 mocks
config.global.mocks = {
  $t: (key: string) => key, // i18n mock
  $route: {
    path: '/',
    query: {},
    params: {}
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn()
  }
}

// 全局 stubs
config.global.stubs = {
  'router-link': true,
  'router-view': true
}

// 模拟 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// 模拟 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// 模拟 matchMedia
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
    dispatchEvent: vi.fn()
  }))
})
```

### 2. 单元测试编写

#### 2.1 组件基础测试

```typescript
// packages/components/button/__tests__/button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '../src/button.vue'
import { Loading } from '@element-plus/icons-vue'

describe('Button', () => {
  // 基础渲染测试
  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = mount(Button, {
        slots: {
          default: 'Test Button'
        }
      })
      
      expect(wrapper.text()).toBe('Test Button')
      expect(wrapper.classes()).toContain('el-button')
    })
    
    it('should render with different types', () => {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      
      types.forEach(type => {
        const wrapper = mount(Button, {
          props: { type },
          slots: { default: 'Button' }
        })
        
        expect(wrapper.classes()).toContain(`el-button--${type}`)
      })
    })
    
    it('should render with different sizes', () => {
      const sizes = ['large', 'default', 'small']
      
      sizes.forEach(size => {
        const wrapper = mount(Button, {
          props: { size },
          slots: { default: 'Button' }
        })
        
        if (size !== 'default') {
          expect(wrapper.classes()).toContain(`el-button--${size}`)
        }
      })
    })
  })
  
  // 属性测试
  describe('props', () => {
    it('should be disabled when disabled prop is true', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
    
    it('should show loading state', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.classes()).toContain('is-loading')
      expect(wrapper.findComponent(Loading).exists()).toBe(true)
    })
    
    it('should render custom loading icon', () => {
      const CustomIcon = {
        name: 'CustomIcon',
        template: '<div class="custom-icon"></div>'
      }
      
      const wrapper = mount(Button, {
        props: {
          loading: true,
          loadingIcon: CustomIcon
        },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
      expect(wrapper.findComponent(Loading).exists()).toBe(false)
    })
  })
  
  // 事件测试
  describe('events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(Button, {
        slots: { default: 'Button' }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
    
    it('should not emit click when disabled', async () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeUndefined()
    })
    
    it('should not emit click when loading', async () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: { default: 'Button' }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })
  
  // 插槽测试
  describe('slots', () => {
    it('should render default slot', () => {
      const wrapper = mount(Button, {
        slots: {
          default: '<span class="custom-content">Custom Content</span>'
        }
      })
      
      expect(wrapper.find('.custom-content').exists()).toBe(true)
      expect(wrapper.text()).toBe('Custom Content')
    })
    
    it('should render loading slot when provided', () => {
      const wrapper = mount(Button, {
        props: { loading: true },
        slots: {
          default: 'Button',
          loading: '<span class="custom-loading">Loading...</span>'
        }
      })
      
      expect(wrapper.find('.custom-loading').exists()).toBe(true)
      expect(wrapper.findComponent(Loading).exists()).toBe(false)
    })
  })
  
  // 可访问性测试
  describe('accessibility', () => {
    it('should have correct ARIA attributes', () => {
      const wrapper = mount(Button, {
        props: { disabled: true },
        slots: { default: 'Button' }
      })
      
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
    
    it('should support keyboard navigation', async () => {
      const wrapper = mount(Button, {
        slots: { default: 'Button' }
      })
      
      await wrapper.trigger('keydown.enter')
      expect(wrapper.emitted('click')).toHaveLength(1)
      
      await wrapper.trigger('keydown.space')
      expect(wrapper.emitted('click')).toHaveLength(2)
    })
  })
})
```

#### 2.2 复杂组件测试

```typescript
// packages/components/table/__tests__/table.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'

describe('Table', () => {
  const testData = [
    { id: 1, name: 'John', age: 25, email: 'john@example.com' },
    { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
    { id: 3, name: 'Bob', age: 35, email: 'bob@example.com' }
  ]
  
  let wrapper: any
  
  beforeEach(() => {
    wrapper = mount({
      template: `
        <el-table :data="tableData" ref="tableRef">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="age" label="Age" />
          <el-table-column prop="email" label="Email" />
        </el-table>
      `,
      components: {
        ElTable: Table,
        ElTableColumn: TableColumn
      },
      data() {
        return {
          tableData: testData
        }
      }
    })
  })
  
  describe('data rendering', () => {
    it('should render table data correctly', async () => {
      await nextTick()
      
      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(3)
      
      // 检查第一行数据
      const firstRowCells = rows[0].findAll('td')
      expect(firstRowCells[0].text()).toBe('John')
      expect(firstRowCells[1].text()).toBe('25')
      expect(firstRowCells[2].text()).toBe('john@example.com')
    })
    
    it('should show empty state when no data', async () => {
      await wrapper.setData({ tableData: [] })
      await nextTick()
      
      expect(wrapper.find('.el-table__empty-block').exists()).toBe(true)
    })
    
    it('should show loading state', async () => {
      const loadingWrapper = mount(Table, {
        props: {
          data: testData,
          loading: true
        }
      })
      
      expect(loadingWrapper.find('.el-loading-mask').exists()).toBe(true)
    })
  })
  
  describe('selection', () => {
    beforeEach(() => {
      wrapper = mount({
        template: `
          <el-table 
            :data="tableData" 
            ref="tableRef"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" />
            <el-table-column prop="name" label="Name" />
          </el-table>
        `,
        components: {
          ElTable: Table,
          ElTableColumn: TableColumn
        },
        data() {
          return {
            tableData: testData,
            selectedRows: []
          }
        },
        methods: {
          handleSelectionChange(selection: any[]) {
            this.selectedRows = selection
          }
        }
      })
    })
    
    it('should handle row selection', async () => {
      await nextTick()
      
      const checkboxes = wrapper.findAll('input[type="checkbox"]')
      
      // 点击第一行的复选框
      await checkboxes[1].trigger('change')
      await nextTick()
      
      expect(wrapper.emitted('selection-change')).toBeTruthy()
      const selectionEvent = wrapper.emitted('selection-change')[0][0]
      expect(selectionEvent).toHaveLength(1)
      expect(selectionEvent[0].id).toBe(1)
    })
    
    it('should handle select all', async () => {
      await nextTick()
      
      const selectAllCheckbox = wrapper.find('thead input[type="checkbox"]')
      await selectAllCheckbox.trigger('change')
      await nextTick()
      
      const selectionEvent = wrapper.emitted('selection-change')
      const lastSelection = selectionEvent[selectionEvent.length - 1][0]
      expect(lastSelection).toHaveLength(3)
    })
  })
  
  describe('sorting', () => {
    beforeEach(() => {
      wrapper = mount({
        template: `
          <el-table 
            :data="tableData" 
            @sort-change="handleSortChange"
          >
            <el-table-column prop="name" label="Name" sortable />
            <el-table-column prop="age" label="Age" sortable />
          </el-table>
        `,
        components: {
          ElTable: Table,
          ElTableColumn: TableColumn
        },
        data() {
          return {
            tableData: testData
          }
        },
        methods: {
          handleSortChange(sortInfo: any) {
            // 处理排序
          }
        }
      })
    })
    
    it('should handle column sorting', async () => {
      await nextTick()
      
      const sortButton = wrapper.find('.caret-wrapper')
      await sortButton.trigger('click')
      
      expect(wrapper.emitted('sort-change')).toBeTruthy()
    })
  })
  
  describe('pagination integration', () => {
    it('should work with pagination', async () => {
      const paginationWrapper = mount({
        template: `
          <div>
            <el-table :data="currentPageData">
              <el-table-column prop="name" label="Name" />
            </el-table>
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handlePageChange"
            />
          </div>
        `,
        components: {
          ElTable: Table,
          ElTableColumn: TableColumn
        },
        data() {
          return {
            allData: testData,
            currentPage: 1,
            pageSize: 2,
            total: testData.length
          }
        },
        computed: {
          currentPageData() {
            const start = (this.currentPage - 1) * this.pageSize
            return this.allData.slice(start, start + this.pageSize)
          }
        },
        methods: {
          handlePageChange(page: number) {
            this.currentPage = page
          }
        }
      })
      
      await nextTick()
      
      // 检查当前页显示的数据
      let rows = paginationWrapper.findAll('tbody tr')
      expect(rows).toHaveLength(2)
      
      // 切换到下一页
      await paginationWrapper.setData({ currentPage: 2 })
      await nextTick()
      
      rows = paginationWrapper.findAll('tbody tr')
      expect(rows).toHaveLength(1) // 最后一页只有一条数据
    })
  })
})
```

#### 2.3 Composables 测试

```typescript
// packages/hooks/__tests__/use-form-validation.test.ts
import { describe, it, expect } from 'vitest'
import { ref, reactive } from 'vue'
import { renderHook } from '@testing-library/vue'
import { useFormValidation } from '../use-form-validation'

describe('useFormValidation', () => {
  interface FormData {
    username: string
    email: string
    password: string
    confirmPassword: string
  }
  
  const createValidationRules = () => ({
    username: [
      { required: true, message: 'Username is required' },
      { min: 3, max: 20, message: 'Username must be 3-20 characters' }
    ],
    email: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' }
    ],
    password: [
      { required: true, message: 'Password is required' },
      { min: 6, message: 'Password must be at least 6 characters' }
    ],
    confirmPassword: [
      { required: true, message: 'Please confirm password' },
      {
        validator: (rule: any, value: string, callback: Function, formData: FormData) => {
          if (value !== formData.password) {
            callback(new Error('Passwords do not match'))
          } else {
            callback()
          }
        }
      }
    ]
  })
  
  it('should validate required fields', async () => {
    const { result } = renderHook(() => {
      const formData = reactive<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      
      const rules = createValidationRules()
      
      return useFormValidation(formData, rules)
    })
    
    const { validateField, errors } = result.value
    
    // 验证空的用户名
    await validateField('username')
    expect(errors.value.username).toBe('Username is required')
    
    // 验证空的邮箱
    await validateField('email')
    expect(errors.value.email).toBe('Email is required')
  })
  
  it('should validate field formats', async () => {
    const { result } = renderHook(() => {
      const formData = reactive<FormData>({
        username: 'ab', // 太短
        email: 'invalid-email', // 格式错误
        password: '123', // 太短
        confirmPassword: ''
      })
      
      const rules = createValidationRules()
      
      return useFormValidation(formData, rules)
    })
    
    const { validateField, errors } = result.value
    
    await validateField('username')
    expect(errors.value.username).toBe('Username must be 3-20 characters')
    
    await validateField('email')
    expect(errors.value.email).toBe('Invalid email format')
    
    await validateField('password')
    expect(errors.value.password).toBe('Password must be at least 6 characters')
  })
  
  it('should validate custom rules', async () => {
    const { result } = renderHook(() => {
      const formData = reactive<FormData>({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different-password'
      })
      
      const rules = createValidationRules()
      
      return useFormValidation(formData, rules)
    })
    
    const { validateField, errors } = result.value
    
    await validateField('confirmPassword')
    expect(errors.value.confirmPassword).toBe('Passwords do not match')
  })
  
  it('should validate entire form', async () => {
    const { result } = renderHook(() => {
      const formData = reactive<FormData>({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })
      
      const rules = createValidationRules()
      
      return useFormValidation(formData, rules)
    })
    
    const { validateForm, isValid } = result.value
    
    const result = await validateForm()
    expect(result).toBe(true)
    expect(isValid.value).toBe(true)
  })
  
  it('should clear validation errors', async () => {
    const { result } = renderHook(() => {
      const formData = reactive<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      
      const rules = createValidationRules()
      
      return useFormValidation(formData, rules)
    })
    
    const { validateField, clearValidation, errors } = result.value
    
    // 先产生错误
    await validateField('username')
    expect(errors.value.username).toBeTruthy()
    
    // 清除验证错误
    clearValidation('username')
    expect(errors.value.username).toBe('')
    
    // 清除所有验证错误
    await validateField('email')
    clearValidation()
    expect(Object.values(errors.value).every(error => error === '')).toBe(true)
  })
})
```

### 3. 集成测试

#### 3.1 组件交互测试

```typescript
// packages/components/form/__tests__/form-integration.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Form from '../src/form.vue'
import FormItem from '../src/form-item.vue'
import Input from '../../input/src/input.vue'
import Button from '../../button/src/button.vue'

describe('Form Integration', () => {
  it('should handle form submission with validation', async () => {
    const onSubmit = vi.fn()
    const onValidationError = vi.fn()
    
    const wrapper = mount({
      template: `
        <el-form 
          ref="formRef"
          :model="formData"
          :rules="rules"
          @submit="onSubmit"
          @validation-error="onValidationError"
        >
          <el-form-item label="Username" prop="username">
            <el-input v-model="formData.username" />
          </el-form-item>
          
          <el-form-item label="Email" prop="email">
            <el-input v-model="formData.email" type="email" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">
              Submit
            </el-button>
            <el-button @click="handleReset">
              Reset
            </el-button>
          </el-form-item>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem,
        ElInput: Input,
        ElButton: Button
      },
      data() {
        return {
          formData: {
            username: '',
            email: ''
          },
          rules: {
            username: [
              { required: true, message: 'Username is required' }
            ],
            email: [
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' }
            ]
          }
        }
      },
      methods: {
        async handleSubmit() {
          try {
            await this.$refs.formRef.validate()
            onSubmit(this.formData)
          } catch (error) {
            onValidationError(error)
          }
        },
        handleReset() {
          this.$refs.formRef.resetFields()
        }
      }
    })
    
    await nextTick()
    
    // 测试验证失败的情况
    const submitButton = wrapper.find('button[type="button"]')
    await submitButton.trigger('click')
    await nextTick()
    
    expect(onSubmit).not.toHaveBeenCalled()
    expect(onValidationError).toHaveBeenCalled()
    
    // 填写有效数据
    const usernameInput = wrapper.find('input[type="text"]')
    const emailInput = wrapper.find('input[type="email"]')
    
    await usernameInput.setValue('testuser')
    await emailInput.setValue('test@example.com')
    await nextTick()
    
    // 再次提交
    await submitButton.trigger('click')
    await nextTick()
    
    expect(onSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com'
    })
  })
  
  it('should handle form reset', async () => {
    const wrapper = mount({
      template: `
        <el-form ref="formRef" :model="formData">
          <el-form-item label="Username" prop="username">
            <el-input v-model="formData.username" />
          </el-form-item>
          
          <el-button @click="handleReset">
            Reset
          </el-button>
        </el-form>
      `,
      components: {
        ElForm: Form,
        ElFormItem: FormItem,
        ElInput: Input,
        ElButton: Button
      },
      data() {
        return {
          formData: {
            username: 'initial-value'
          }
        }
      },
      methods: {
        handleReset() {
          this.$refs.formRef.resetFields()
        }
      }
    })
    
    await nextTick()
    
    // 修改输入值
    const input = wrapper.find('input')
    await input.setValue('modified-value')
    expect(wrapper.vm.formData.username).toBe('modified-value')
    
    // 重置表单
    const resetButton = wrapper.find('button')
    await resetButton.trigger('click')
    await nextTick()
    
    expect(wrapper.vm.formData.username).toBe('initial-value')
  })
})
```

#### 3.2 路由集成测试

```typescript
// packages/components/menu/__tests__/menu-router.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Menu from '../src/menu.vue'
import MenuItem from '../src/menu-item.vue'

describe('Menu Router Integration', () => {
  const routes = [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/about', component: { template: '<div>About</div>' } },
    { path: '/contact', component: { template: '<div>Contact</div>' } }
  ]
  
  const router = createRouter({
    history: createWebHistory(),
    routes
  })
  
  it('should navigate when menu item is clicked', async () => {
    const wrapper = mount({
      template: `
        <el-menu router>
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/about">About</el-menu-item>
          <el-menu-item index="/contact">Contact</el-menu-item>
        </el-menu>
      `,
      components: {
        ElMenu: Menu,
        ElMenuItem: MenuItem
      }
    }, {
      global: {
        plugins: [router]
      }
    })
    
    // 点击 About 菜单项
    const aboutMenuItem = wrapper.findAll('.el-menu-item')[1]
    await aboutMenuItem.trigger('click')
    
    expect(router.currentRoute.value.path).toBe('/about')
  })
  
  it('should highlight active menu item based on current route', async () => {
    await router.push('/about')
    
    const wrapper = mount({
      template: `
        <el-menu router>
          <el-menu-item index="/">Home</el-menu-item>
          <el-menu-item index="/about">About</el-menu-item>
          <el-menu-item index="/contact">Contact</el-menu-item>
        </el-menu>
      `,
      components: {
        ElMenu: Menu,
        ElMenuItem: MenuItem
      }
    }, {
      global: {
        plugins: [router]
      }
    })
    
    await nextTick()
    
    const menuItems = wrapper.findAll('.el-menu-item')
    expect(menuItems[1].classes()).toContain('is-active')
  })
})
```

### 4. E2E 测试

#### 4.1 Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  
  // 并行运行测试
  fullyParallel: true,
  
  // 失败时重试
  retries: process.env.CI ? 2 : 0,
  
  // 并发数
  workers: process.env.CI ? 1 : undefined,
  
  // 报告器
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  
  use: {
    // 基础 URL
    baseURL: 'http://localhost:5173',
    
    // 截图
    screenshot: 'only-on-failure',
    
    // 视频
    video: 'retain-on-failure',
    
    // 追踪
    trace: 'on-first-retry'
  },
  
  // 项目配置
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
  
  // 开发服务器
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

#### 4.2 E2E 测试用例

```typescript
// e2e/form-workflow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Form Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/form')
  })
  
  test('should complete user registration flow', async ({ page }) => {
    // 填写注册表单
    await page.fill('[data-testid="username-input"]', 'testuser')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'password123')
    
    // 选择用户类型
    await page.selectOption('[data-testid="user-type-select"]', 'premium')
    
    // 同意条款
    await page.check('[data-testid="terms-checkbox"]')
    
    // 提交表单
    await page.click('[data-testid="submit-button"]')
    
    // 验证成功消息
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Registration successful')
  })
  
  test('should show validation errors for invalid input', async ({ page }) => {
    // 提交空表单
    await page.click('[data-testid="submit-button"]')
    
    // 验证错误消息
    await expect(page.locator('[data-testid="username-error"]')).toContainText('Username is required')
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Email is required')
    
    // 填写无效邮箱
    await page.fill('[data-testid="email-input"]', 'invalid-email')
    await page.blur('[data-testid="email-input"]')
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email format')
  })
  
  test('should handle password confirmation validation', async ({ page }) => {
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.fill('[data-testid="confirm-password-input"]', 'different-password')
    await page.blur('[data-testid="confirm-password-input"]')
    
    await expect(page.locator('[data-testid="confirm-password-error"]')).toContainText('Passwords do not match')
  })
})

test.describe('Table Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/table')
  })
  
  test('should handle table sorting', async ({ page }) => {
    // 点击名称列排序
    await page.click('[data-testid="name-column-sort"]')
    
    // 验证排序结果
    const firstRowName = await page.textContent('[data-testid="table-row-0"] [data-testid="name-cell"]')
    expect(firstRowName).toBe('Alice') // 假设按字母顺序排序
    
    // 再次点击进行降序排序
    await page.click('[data-testid="name-column-sort"]')
    
    const firstRowNameDesc = await page.textContent('[data-testid="table-row-0"] [data-testid="name-cell"]')
    expect(firstRowNameDesc).toBe('Zoe') // 假设按字母倒序排序
  })
  
  test('should handle row selection', async ({ page }) => {
    // 选择第一行
    await page.check('[data-testid="table-row-0"] [data-testid="row-checkbox"]')
    
    // 验证选择状态
    await expect(page.locator('[data-testid="selected-count"]')).toContainText('1 selected')
    
    // 全选
    await page.check('[data-testid="select-all-checkbox"]')
    
    // 验证全选状态
    await expect(page.locator('[data-testid="selected-count"]')).toContainText('10 selected')
  })
  
  test('should handle pagination', async ({ page }) => {
    // 验证当前页
    await expect(page.locator('[data-testid="current-page"]')).toContainText('1')
    
    // 点击下一页
    await page.click('[data-testid="next-page-button"]')
    
    // 验证页面变化
    await expect(page.locator('[data-testid="current-page"]')).toContainText('2')
    
    // 验证数据变化
    const firstRowId = await page.textContent('[data-testid="table-row-0"] [data-testid="id-cell"]')
    expect(parseInt(firstRowId!)).toBeGreaterThan(10) // 假设每页10条数据
  })
})
```

### 5. 性能测试

#### 5.1 组件性能测试

```typescript
// packages/components/table/__tests__/table-performance.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { performance } from 'perf_hooks'
import Table from '../src/table.vue'
import TableColumn from '../src/table-column.vue'

describe('Table Performance', () => {
  // 生成大量测试数据
  const generateLargeDataset = (size: number) => {
    return Array.from({ length: size }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 20,
      department: `Department ${Math.floor(index / 100) + 1}`,
      salary: Math.floor(Math.random() * 50000) + 30000
    }))
  }
  
  it('should render large dataset within acceptable time', async () => {
    const largeData = generateLargeDataset(1000)
    
    const startTime = performance.now()
    
    const wrapper = mount({
      template: `
        <el-table :data="tableData" height="400">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="Name" width="120" />
          <el-table-column prop="email" label="Email" width="200" />
          <el-table-column prop="age" label="Age" width="80" />
          <el-table-column prop="department" label="Department" width="150" />
          <el-table-column prop="salary" label="Salary" width="120" />
        </el-table>
      `,
      components: {
        ElTable: Table,
        ElTableColumn: TableColumn
      },
      data() {
        return {
          tableData: largeData
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // 渲染时间应该在合理范围内（例如小于1秒）
    expect(renderTime).toBeLessThan(1000)
    
    // 验证虚拟滚动是否生效（只渲染可见行）
    const renderedRows = wrapper.findAll('tbody tr')
    expect(renderedRows.length).toBeLessThan(largeData.length)
  })
  
  it('should handle frequent data updates efficiently', async () => {
    const initialData = generateLargeDataset(500)
    
    const wrapper = mount({
      template: `
        <el-table :data="tableData">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="age" label="Age" />
        </el-table>
      `,
      components: {
        ElTable: Table,
        ElTableColumn: TableColumn
      },
      data() {
        return {
          tableData: initialData
        }
      }
    })
    
    await wrapper.vm.$nextTick()
    
    const startTime = performance.now()
    
    // 模拟频繁的数据更新
    for (let i = 0; i < 10; i++) {
      const updatedData = initialData.map(item => ({
        ...item,
        age: item.age + 1
      }))
      
      await wrapper.setData({ tableData: updatedData })
      await wrapper.vm.$nextTick()
    }
    
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    // 更新时间应该在合理范围内
    expect(updateTime).toBeLessThan(500)
  })
  
  it('should not cause memory leaks', async () => {
    const initialMemory = process.memoryUsage().heapUsed
    
    // 创建和销毁多个表格实例
    for (let i = 0; i < 100; i++) {
      const wrapper = mount({
        template: `
          <el-table :data="tableData">
            <el-table-column prop="name" label="Name" />
          </el-table>
        `,
        components: {
          ElTable: Table,
          ElTableColumn: TableColumn
        },
        data() {
          return {
            tableData: generateLargeDataset(100)
          }
        }
      })
      
      await wrapper.vm.$nextTick()
      wrapper.unmount()
    }
    
    // 强制垃圾回收
    if (global.gc) {
      global.gc()
    }
    
    const finalMemory = process.memoryUsage().heapUsed
    const memoryIncrease = finalMemory - initialMemory
    
    // 内存增长应该在合理范围内（例如小于50MB）
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
  })
})
```

### 6. 代码质量保证

#### 6.1 代码覆盖率配置

```typescript
// scripts/coverage-check.ts
import { readFileSync } from 'fs'
import { join } from 'path'

interface CoverageReport {
  total: {
    lines: { pct: number }
    statements: { pct: number }
    functions: { pct: number }
    branches: { pct: number }
  }
}

class CoverageChecker {
  private static readonly THRESHOLDS = {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
  }
  
  static checkCoverage(): void {
    try {
      const coverageReport: CoverageReport = JSON.parse(
        readFileSync(join(process.cwd(), 'coverage/coverage-summary.json'), 'utf8')
      )
      
      const { total } = coverageReport
      const results = {
        statements: total.statements.pct,
        branches: total.branches.pct,
        functions: total.functions.pct,
        lines: total.lines.pct
      }
      
      console.log('\n📊 Coverage Report:')
      console.log('===================')
      
      let allPassed = true
      
      Object.entries(results).forEach(([key, value]) => {
        const threshold = this.THRESHOLDS[key as keyof typeof this.THRESHOLDS]
        const status = value >= threshold ? '✅' : '❌'
        const color = value >= threshold ? '\x1b[32m' : '\x1b[31m'
        
        console.log(`${status} ${key.padEnd(12)}: ${color}${value.toFixed(2)}%\x1b[0m (threshold: ${threshold}%)`)
        
        if (value < threshold) {
          allPassed = false
        }
      })
      
      console.log('\n')
      
      if (!allPassed) {
        console.error('❌ Coverage check failed! Some metrics are below the threshold.')
        process.exit(1)
      } else {
        console.log('🎉 All coverage thresholds met!')
      }
    } catch (error) {
      console.error('❌ Failed to read coverage report:', error)
      process.exit(1)
    }
  }
}

CoverageChecker.checkCoverage()
```

#### 6.2 测试质量检查

```typescript
// scripts/test-quality-check.ts
import { execSync } from 'child_process'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, extname } from 'path'

interface TestQualityMetrics {
  totalTests: number
  testFiles: number
  averageTestsPerFile: number
  testCoverage: {
    components: number
    utils: number
    composables: number
  }
  testTypes: {
    unit: number
    integration: number
    e2e: number
  }
}

class TestQualityChecker {
  private static scanDirectory(dir: string, pattern: RegExp): string[] {
    const files: string[] = []
    
    const scan = (currentDir: string) => {
      const items = readdirSync(currentDir)
      
      items.forEach(item => {
        const fullPath = join(currentDir, item)
        const stat = statSync(fullPath)
        
        if (stat.isDirectory()) {
          scan(fullPath)
        } else if (pattern.test(item)) {
          files.push(fullPath)
        }
      })
    }
    
    scan(dir)
    return files
  }
  
  private static countTestsInFile(filePath: string): number {
    const content = readFileSync(filePath, 'utf8')
    const testMatches = content.match(/\b(it|test)\s*\(/g)
    return testMatches ? testMatches.length : 0
  }
  
  private static getTestType(filePath: string): 'unit' | 'integration' | 'e2e' {
    if (filePath.includes('e2e')) return 'e2e'
    if (filePath.includes('integration')) return 'integration'
    return 'unit'
  }
  
  static analyzeTestQuality(): TestQualityMetrics {
    const testFiles = this.scanDirectory(
      join(process.cwd(), 'packages'),
      /\.(test|spec)\.(ts|tsx|js|jsx)$/
    )
    
    const e2eFiles = this.scanDirectory(
      join(process.cwd(), 'e2e'),
      /\.spec\.(ts|js)$/
    )
    
    const allTestFiles = [...testFiles, ...e2eFiles]
    
    let totalTests = 0
    const testTypes = { unit: 0, integration: 0, e2e: 0 }
    
    allTestFiles.forEach(file => {
      const testsInFile = this.countTestsInFile(file)
      totalTests += testsInFile
      
      const type = this.getTestType(file)
      testTypes[type] += testsInFile
    })
    
    // 分析组件覆盖率
    const componentFiles = this.scanDirectory(
      join(process.cwd(), 'packages/components'),
      /\.vue$/
    )
    
    const utilFiles = this.scanDirectory(
      join(process.cwd(), 'packages/utils'),
      /\.(ts|js)$/
    )
    
    const composableFiles = this.scanDirectory(
      join(process.cwd(), 'packages/hooks'),
      /\.(ts|js)$/
    )
    
    const componentTestFiles = testFiles.filter(file => 
      file.includes('components')
    )
    
    const utilTestFiles = testFiles.filter(file => 
      file.includes('utils')
    )
    
    const composableTestFiles = testFiles.filter(file => 
      file.includes('hooks')
    )
    
    return {
      totalTests,
      testFiles: allTestFiles.length,
      averageTestsPerFile: totalTests / allTestFiles.length,
      testCoverage: {
        components: (componentTestFiles.length / componentFiles.length) * 100,
        utils: (utilTestFiles.length / utilFiles.length) * 100,
        composables: (composableTestFiles.length / composableFiles.length) * 100
      },
      testTypes
    }
  }
  
  static checkTestQuality(): void {
    console.log('\n🧪 Test Quality Analysis:')
    console.log('=========================')
    
    const metrics = this.analyzeTestQuality()
    
    console.log(`📊 Total Tests: ${metrics.totalTests}`)
    console.log(`📁 Test Files: ${metrics.testFiles}`)
    console.log(`📈 Average Tests per File: ${metrics.averageTestsPerFile.toFixed(2)}`)
    
    console.log('\n📋 Test Coverage by Category:')
    console.log(`  Components: ${metrics.testCoverage.components.toFixed(2)}%`)
    console.log(`  Utils: ${metrics.testCoverage.utils.toFixed(2)}%`)
    console.log(`  Composables: ${metrics.testCoverage.composables.toFixed(2)}%`)
    
    console.log('\n🏷️  Test Types Distribution:')
    console.log(`  Unit Tests: ${metrics.testTypes.unit} (${((metrics.testTypes.unit / metrics.totalTests) * 100).toFixed(2)}%)`)
    console.log(`  Integration Tests: ${metrics.testTypes.integration} (${((metrics.testTypes.integration / metrics.totalTests) * 100).toFixed(2)}%)`)
    console.log(`  E2E Tests: ${metrics.testTypes.e2e} (${((metrics.testTypes.e2e / metrics.totalTests) * 100).toFixed(2)}%)`)
    
    // 质量检查
    const issues: string[] = []
    
    if (metrics.averageTestsPerFile < 5) {
      issues.push('Average tests per file is too low (< 5)')
    }
    
    if (metrics.testCoverage.components < 80) {
      issues.push('Component test coverage is below 80%')
    }
    
    if (metrics.testCoverage.utils < 90) {
      issues.push('Utils test coverage is below 90%')
    }
    
    if (metrics.testTypes.unit / metrics.totalTests < 0.7) {
      issues.push('Unit tests should comprise at least 70% of all tests')
    }
    
    if (issues.length > 0) {
      console.log('\n⚠️  Quality Issues:')
      issues.forEach(issue => console.log(`  ❌ ${issue}`))
    } else {
      console.log('\n✅ Test quality looks good!')
    }
    
    console.log('\n')
  }
}

TestQualityChecker.checkTestQuality()
```

## 实践练习

### 练习 1：编写组件单元测试

为一个自定义的 `Rating` 组件编写完整的单元测试，包括：
1. 基础渲染测试
2. 属性测试（value、max、disabled 等）
3. 事件测试（change、hover 等）
4. 键盘导航测试
5. 可访问性测试

### 练习 2：编写集成测试

为一个包含表单验证的用户注册页面编写集成测试，测试：
1. 表单提交流程
2. 验证错误处理
3. 成功提交后的页面跳转
4. 与后端 API 的交互

### 练习 3：编写 E2E 测试

为一个完整的用户管理系统编写 E2E 测试，包括：
1. 用户登录流程
2. 用户列表的增删改查
3. 搜索和筛选功能
4. 分页功能

## 学习资源

* [Vitest 官方文档](https://vitest.dev/)
* [Vue Test Utils 官方文档](https://test-utils.vuejs.org/)
* [Playwright 官方文档](https://playwright.dev/)
* [Testing Library 官方文档](https://testing-library.com/)
* [Jest 官方文档](https://jestjs.io/)

## 作业

1. 完成所有实践练习
2. 为你之前开发的自定义组件编写完整的测试套件
3. 设置 CI/CD 流程，确保所有测试在提交代码时自动运行
4. 分析现有项目的测试覆盖率，并制定改进计划

## 下一步学习计划

接下来我们将学习 **Element Plus 部署与生产环境优化**，了解如何将 Element Plus 应用部署到生产环境，并进行性能优化。