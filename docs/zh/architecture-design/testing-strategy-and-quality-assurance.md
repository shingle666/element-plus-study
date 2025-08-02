# 第38天：Element Plus 测试策略与质量保证

## 学习目标
- 深入理解 Element Plus 的测试体系
- 掌握组件单元测试的编写方法
- 学习集成测试和端到端测试
- 实践测试驱动开发（TDD）

## 学习内容

### 1. Element Plus 测试体系概述

#### 1.1 测试金字塔
```typescript
// Element Plus 测试层次结构
/*
    E2E Tests (端到端测试)
         ↑
  Integration Tests (集成测试)
         ↑
    Unit Tests (单元测试)
         ↑
  Static Analysis (静态分析)
*/

// 测试配置文件结构
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        'dist/'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

#### 1.2 测试环境配置
```typescript
// test/setup.ts - 测试环境设置
import { config } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import { vi } from 'vitest'

// 全局组件注册
config.global.plugins = [ElementPlus]

// 模拟浏览器 API
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

// 模拟 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    display: 'none',
    visibility: 'hidden',
    width: '0px',
    height: '0px'
  })
})
```

### 2. 组件单元测试

#### 2.1 基础组件测试
```typescript
// test/components/Button.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElButton } from 'element-plus'

describe('ElButton', () => {
  // 基础渲染测试
  it('renders correctly', () => {
    const wrapper = mount(ElButton, {
      props: {
        type: 'primary'
      },
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.classes()).toContain('el-button')
    expect(wrapper.classes()).toContain('el-button--primary')
    expect(wrapper.text()).toBe('Click me')
  })
  
  // Props 测试
  it('handles size prop correctly', () => {
    const wrapper = mount(ElButton, {
      props: {
        size: 'large'
      }
    })
    
    expect(wrapper.classes()).toContain('el-button--large')
  })
  
  // 事件测试
  it('emits click event', async () => {
    const wrapper = mount(ElButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  // 禁用状态测试
  it('handles disabled state', async () => {
    const wrapper = mount(ElButton, {
      props: {
        disabled: true
      }
    })
    
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
  
  // 加载状态测试
  it('shows loading state', () => {
    const wrapper = mount(ElButton, {
      props: {
        loading: true
      }
    })
    
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
  })
  
  // 图标测试
  it('renders icon correctly', () => {
    const wrapper = mount(ElButton, {
      props: {
        icon: 'el-icon-search'
      }
    })
    
    expect(wrapper.find('.el-icon-search').exists()).toBe(true)
  })
})
```

#### 2.2 复杂组件测试
```typescript
// test/components/Form.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { nextTick } from 'vue'

describe('ElForm', () => {
  let wrapper: VueWrapper<any>
  
  const formData = {
    username: '',
    email: '',
    password: ''
  }
  
  const rules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ]
  }
  
  beforeEach(() => {
    wrapper = mount({
      template: `
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" type="email" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      `,
      components: {
        ElForm,
        ElFormItem,
        ElInput,
        ElButton
      },
      data() {
        return {
          form: { ...formData },
          rules
        }
      },
      methods: {
        submitForm() {
          this.$refs.formRef.validate((valid) => {
            if (valid) {
              this.$emit('submit', this.form)
            }
          })
        },
        resetForm() {
          this.$refs.formRef.resetFields()
        }
      }
    })
  })
  
  // 表单渲染测试
  it('renders form correctly', () => {
    expect(wrapper.find('.el-form').exists()).toBe(true)
    expect(wrapper.findAll('.el-form-item')).toHaveLength(4)
    expect(wrapper.findAll('.el-input')).toHaveLength(3)
  })
  
  // 表单验证测试
  it('validates required fields', async () => {
    const submitButton = wrapper.find('button[type="button"]')
    await submitButton.trigger('click')
    await nextTick()
    
    const errorMessages = wrapper.findAll('.el-form-item__error')
    expect(errorMessages.length).toBeGreaterThan(0)
  })
  
  // 表单数据绑定测试
  it('binds form data correctly', async () => {
    const usernameInput = wrapper.find('input[type="text"]')
    await usernameInput.setValue('testuser')
    
    expect(wrapper.vm.form.username).toBe('testuser')
  })
  
  // 表单重置测试
  it('resets form correctly', async () => {
    // 填写表单
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('testuser')
    await inputs[1].setValue('test@example.com')
    await inputs[2].setValue('password123')
    
    // 重置表单
    const resetButton = wrapper.findAll('button')[1]
    await resetButton.trigger('click')
    await nextTick()
    
    expect(wrapper.vm.form.username).toBe('')
    expect(wrapper.vm.form.email).toBe('')
    expect(wrapper.vm.form.password).toBe('')
  })
  
  // 表单提交测试
  it('submits valid form', async () => {
    // 填写有效数据
    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('testuser')
    await inputs[1].setValue('test@example.com')
    await inputs[2].setValue('password123')
    
    // 提交表单
    const submitButton = wrapper.find('button[type="button"]')
    await submitButton.trigger('click')
    await nextTick()
    
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

#### 2.3 组合式函数测试
```typescript
// test/composables/useForm.test.ts
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useForm } from '@/composables/useForm'

describe('useForm', () => {
  it('initializes form state correctly', () => {
    const initialData = { name: '', email: '' }
    const { formData, errors, isValid } = useForm(initialData)
    
    expect(formData.value).toEqual(initialData)
    expect(errors.value).toEqual({})
    expect(isValid.value).toBe(true)
  })
  
  it('validates form fields', async () => {
    const initialData = { name: '', email: '' }
    const rules = {
      name: [(value: string) => value.length > 0 || '姓名不能为空'],
      email: [(value: string) => /\S+@\S+\.\S+/.test(value) || '邮箱格式不正确']
    }
    
    const { formData, validate, errors, isValid } = useForm(initialData, rules)
    
    // 验证空表单
    await validate()
    expect(errors.value.name).toBe('姓名不能为空')
    expect(errors.value.email).toBe('邮箱格式不正确')
    expect(isValid.value).toBe(false)
    
    // 填写正确数据
    formData.value.name = 'John Doe'
    formData.value.email = 'john@example.com'
    
    await validate()
    expect(errors.value).toEqual({})
    expect(isValid.value).toBe(true)
  })
  
  it('resets form correctly', () => {
    const initialData = { name: '', email: '' }
    const { formData, reset } = useForm(initialData)
    
    // 修改数据
    formData.value.name = 'John'
    formData.value.email = 'john@example.com'
    
    // 重置
    reset()
    expect(formData.value).toEqual(initialData)
  })
})
```

### 3. 集成测试

#### 3.1 组件交互测试
```typescript
// test/integration/FormDialog.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { nextTick } from 'vue'

const FormDialog = {
  template: `
    <el-dialog
      v-model="visible"
      title="用户信息"
      width="500px"
      @close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </template>
    </el-dialog>
  `,
  components: {
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  props: {
    modelValue: Boolean,
    userData: Object
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  data() {
    return {
      form: {
        name: '',
        email: ''
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    userData: {
      handler(newData) {
        if (newData) {
          Object.assign(this.form, newData)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.resetForm()
    },
    handleCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('confirm', { ...this.form })
          this.visible = false
        }
      })
    },
    resetForm() {
      this.form = { name: '', email: '' }
      this.$refs.formRef?.clearValidate()
    }
  }
}

describe('FormDialog Integration', () => {
  it('opens and closes dialog correctly', async () => {
    const wrapper = mount(FormDialog, {
      props: {
        modelValue: false
      }
    })
    
    expect(wrapper.find('.el-dialog').isVisible()).toBe(false)
    
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    
    expect(wrapper.find('.el-dialog').isVisible()).toBe(true)
  })
  
  it('handles form submission correctly', async () => {
    const wrapper = mount(FormDialog, {
      props: {
        modelValue: true,
        userData: { name: 'John', email: 'john@example.com' }
      }
    })
    
    await nextTick()
    
    // 检查数据是否正确填充
    const nameInput = wrapper.find('input[type="text"]')
    expect(nameInput.element.value).toBe('John')
    
    // 点击确认按钮
    const confirmButton = wrapper.find('.el-button--primary')
    await confirmButton.trigger('click')
    await nextTick()
    
    // 检查事件是否正确触发
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')[0][0]).toEqual({
      name: 'John',
      email: 'john@example.com'
    })
  })
  
  it('validates form before submission', async () => {
    const wrapper = mount(FormDialog, {
      props: {
        modelValue: true
      }
    })
    
    await nextTick()
    
    // 点击确认按钮（表单为空）
    const confirmButton = wrapper.find('.el-button--primary')
    await confirmButton.trigger('click')
    await nextTick()
    
    // 检查验证错误
    const errorMessages = wrapper.findAll('.el-form-item__error')
    expect(errorMessages.length).toBeGreaterThan(0)
    
    // 确认事件不应该被触发
    expect(wrapper.emitted('confirm')).toBeFalsy()
  })
})
```

### 4. 端到端测试

#### 4.1 Playwright E2E 测试
```typescript
// e2e/form-submission.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Form Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form-demo')
  })
  
  test('should submit form successfully', async ({ page }) => {
    // 填写表单
    await page.fill('[data-testid="username-input"]', 'testuser')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    
    // 提交表单
    await page.click('[data-testid="submit-button"]')
    
    // 验证成功消息
    await expect(page.locator('.el-message--success')).toBeVisible()
    await expect(page.locator('.el-message--success')).toContainText('提交成功')
  })
  
  test('should show validation errors for empty form', async ({ page }) => {
    // 直接点击提交按钮
    await page.click('[data-testid="submit-button"]')
    
    // 验证错误消息
    await expect(page.locator('.el-form-item__error')).toHaveCount(3)
    await expect(page.locator('.el-form-item__error').first()).toContainText('请输入用户名')
  })
  
  test('should reset form correctly', async ({ page }) => {
    // 填写表单
    await page.fill('[data-testid="username-input"]', 'testuser')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    
    // 重置表单
    await page.click('[data-testid="reset-button"]')
    
    // 验证表单已清空
    await expect(page.locator('[data-testid="username-input"]')).toHaveValue('')
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('')
  })
  
  test('should handle network errors gracefully', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/api/submit', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    // 填写并提交表单
    await page.fill('[data-testid="username-input"]', 'testuser')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="submit-button"]')
    
    // 验证错误消息
    await expect(page.locator('.el-message--error')).toBeVisible()
    await expect(page.locator('.el-message--error')).toContainText('提交失败')
  })
})
```

#### 4.2 Cypress E2E 测试
```typescript
// cypress/e2e/table-operations.cy.ts
describe('Table Operations', () => {
  beforeEach(() => {
    cy.visit('/table-demo')
  })
  
  it('should load table data correctly', () => {
    cy.get('[data-testid="data-table"]').should('be.visible')
    cy.get('.el-table__row').should('have.length.greaterThan', 0)
  })
  
  it('should sort table by column', () => {
    // 点击姓名列排序
    cy.get('[data-testid="name-column"] .caret-wrapper').click()
    
    // 验证排序结果
    cy.get('.el-table__row').first().should('contain', 'Alice')
    
    // 再次点击反向排序
    cy.get('[data-testid="name-column"] .caret-wrapper').click()
    cy.get('.el-table__row').first().should('contain', 'Zoe')
  })
  
  it('should filter table data', () => {
    // 输入搜索关键词
    cy.get('[data-testid="search-input"]').type('John')
    
    // 验证过滤结果
    cy.get('.el-table__row').should('have.length', 1)
    cy.get('.el-table__row').should('contain', 'John')
  })
  
  it('should paginate table correctly', () => {
    // 检查分页器
    cy.get('.el-pagination').should('be.visible')
    
    // 点击下一页
    cy.get('.el-pagination .btn-next').click()
    
    // 验证页码变化
    cy.get('.el-pagination .number.active').should('contain', '2')
  })
  
  it('should select and delete rows', () => {
    // 选择第一行
    cy.get('.el-table__row').first().find('.el-checkbox').click()
    
    // 点击删除按钮
    cy.get('[data-testid="delete-button"]').click()
    
    // 确认删除
    cy.get('.el-message-box__btns .el-button--primary').click()
    
    // 验证删除成功
    cy.get('.el-message--success').should('be.visible')
  })
})
```

### 5. 性能测试

#### 5.1 组件性能测试
```typescript
// test/performance/component-performance.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElTable, ElTableColumn } from 'element-plus'
import { performance } from 'perf_hooks'

describe('Component Performance', () => {
  it('should render large table efficiently', () => {
    const startTime = performance.now()
    
    // 生成大量数据
    const data = Array.from({ length: 1000 }, (_, index) => ({
      id: index,
      name: `User ${index}`,
      email: `user${index}@example.com`,
      age: 20 + (index % 50)
    }))
    
    const wrapper = mount({
      template: `
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="age" label="年龄" width="80" />
        </el-table>
      `,
      components: {
        ElTable,
        ElTableColumn
      },
      data() {
        return {
          tableData: data
        }
      }
    })
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // 渲染时间应该在合理范围内（小于1秒）
    expect(renderTime).toBeLessThan(1000)
    expect(wrapper.findAll('.el-table__row')).toHaveLength(1000)
  })
  
  it('should handle frequent updates efficiently', async () => {
    const data = Array.from({ length: 100 }, (_, index) => ({
      id: index,
      value: Math.random()
    }))
    
    const wrapper = mount({
      template: `
        <div>
          <div v-for="item in items" :key="item.id">
            {{ item.value.toFixed(2) }}
          </div>
        </div>
      `,
      data() {
        return {
          items: data
        }
      }
    })
    
    const startTime = performance.now()
    
    // 执行100次更新
    for (let i = 0; i < 100; i++) {
      wrapper.vm.items.forEach(item => {
        item.value = Math.random()
      })
      await wrapper.vm.$nextTick()
    }
    
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    // 更新时间应该在合理范围内
    expect(updateTime).toBeLessThan(2000)
  })
})
```

### 6. 测试工具与辅助函数

#### 6.1 测试工具函数
```typescript
// test/utils/test-helpers.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 创建带有 Element Plus 配置的包装器
export function createWrapper(component: any, options: any = {}) {
  return mount(component, {
    global: {
      components: {
        ElConfigProvider
      },
      provide: {
        locale: zhCn
      }
    },
    ...options
  })
}

// 等待异步操作完成
export async function waitFor(condition: () => boolean, timeout = 5000) {
  const startTime = Date.now()
  
  while (!condition() && Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  if (!condition()) {
    throw new Error(`Condition not met within ${timeout}ms`)
  }
}

// 模拟用户输入
export async function userInput(wrapper: VueWrapper<any>, selector: string, value: string) {
  const input = wrapper.find(selector)
  await input.setValue(value)
  await input.trigger('input')
  await input.trigger('blur')
}

// 模拟表单提交
export async function submitForm(wrapper: VueWrapper<any>, formSelector = '.el-form') {
  const form = wrapper.find(formSelector)
  await form.trigger('submit')
}

// 检查元素是否可见
export function isVisible(wrapper: VueWrapper<any>, selector: string): boolean {
  const element = wrapper.find(selector)
  return element.exists() && element.isVisible()
}

// 获取表单验证错误
export function getFormErrors(wrapper: VueWrapper<any>): string[] {
  return wrapper.findAll('.el-form-item__error').map(error => error.text())
}

// 模拟网络请求
export function mockApiResponse(url: string, response: any, status = 200) {
  return vi.fn().mockImplementation(() => 
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response)
    })
  )
}
```

#### 6.2 自定义测试匹配器
```typescript
// test/utils/custom-matchers.ts
import { expect } from 'vitest'

// 扩展 expect 匹配器
expect.extend({
  toBeVisible(received) {
    const pass = received.exists() && received.isVisible()
    return {
      pass,
      message: () => 
        pass 
          ? `Expected element not to be visible`
          : `Expected element to be visible`
    }
  },
  
  toHaveClass(received, className) {
    const pass = received.classes().includes(className)
    return {
      pass,
      message: () => 
        pass 
          ? `Expected element not to have class "${className}"`
          : `Expected element to have class "${className}"`
    }
  },
  
  toHaveFormError(received, errorMessage) {
    const errors = received.findAll('.el-form-item__error')
    const hasError = errors.some(error => error.text().includes(errorMessage))
    
    return {
      pass: hasError,
      message: () => 
        hasError 
          ? `Expected form not to have error "${errorMessage}"`
          : `Expected form to have error "${errorMessage}"`
    }
  }
})

// 类型声明
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeVisible(): T
    toHaveClass(className: string): T
    toHaveFormError(errorMessage: string): T
  }
}
```

### 7. 测试覆盖率与质量保证

#### 7.1 覆盖率配置
```typescript
// vitest.config.ts - 覆盖率配置
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        'dist/',
        '**/*.config.{js,ts}',
        '**/mock/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

#### 7.2 质量检查脚本
```json
// package.json - 测试脚本
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:run && npm run test:e2e",
    "test:watch": "vitest --watch",
    "test:debug": "vitest --inspect-brk --no-coverage"
  }
}
```

## 学习资源
- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright 文档](https://playwright.dev/)
- [Element Plus 测试源码](https://github.com/element-plus/element-plus/tree/dev/packages)

## 作业
1. 为自定义组件编写完整的单元测试
2. 实现一个复杂表单的集成测试
3. 编写端到端测试覆盖主要用户流程
4. 设置测试覆盖率目标并达到要求

## 下一步
明天我们将学习 Element Plus 的性能优化策略。