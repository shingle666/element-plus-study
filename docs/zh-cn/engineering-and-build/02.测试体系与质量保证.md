# 第83天：Element Plus 测试体系与质量保证

## 学习目标

- 深入理解 Element Plus 的测试体系架构
- 掌握组件库的单元测试、集成测试和 E2E 测试
- 学习测试驱动开发（TDD）在组件库中的应用
- 构建完整的质量保证体系

## 1. 测试体系架构

### 1.1 测试金字塔模型

```typescript
// 测试策略管理器
class TestStrategyManager {
  private testLevels: Map<string, TestLevel> = new Map()
  private testMetrics: TestMetrics = new TestMetrics()
  
  constructor() {
    this.initializeTestLevels()
  }
  
  // 初始化测试层级
  private initializeTestLevels(): void {
    // 单元测试层
    this.testLevels.set('unit', {
      name: '单元测试',
      description: '测试单个组件或函数的功能',
      tools: ['Vitest', 'Vue Test Utils', '@testing-library/vue'],
      coverage: 80,
      speed: 'fast',
      cost: 'low',
      confidence: 'medium'
    })
    
    // 集成测试层
    this.testLevels.set('integration', {
      name: '集成测试',
      description: '测试组件间的交互和集成',
      tools: ['Vitest', 'Vue Test Utils', 'Happy DOM'],
      coverage: 60,
      speed: 'medium',
      cost: 'medium',
      confidence: 'high'
    })
    
    // E2E测试层
    this.testLevels.set('e2e', {
      name: 'E2E测试',
      description: '测试完整的用户流程',
      tools: ['Playwright', 'Cypress'],
      coverage: 20,
      speed: 'slow',
      cost: 'high',
      confidence: 'very high'
    })
    
    // 视觉回归测试
    this.testLevels.set('visual', {
      name: '视觉回归测试',
      description: '检测UI变化和视觉问题',
      tools: ['Chromatic', 'Percy', 'BackstopJS'],
      coverage: 30,
      speed: 'medium',
      cost: 'medium',
      confidence: 'high'
    })
  }
  
  // 获取测试策略
  getTestStrategy(): TestStrategy {
    return {
      levels: Array.from(this.testLevels.values()),
      distribution: {
        unit: 70,      // 70% 单元测试
        integration: 20, // 20% 集成测试
        e2e: 10        // 10% E2E测试
      },
      principles: [
        '快速反馈',
        '高覆盖率',
        '可维护性',
        '可靠性'
      ]
    }
  }
  
  // 分析测试覆盖率
  analyzeCoverage(coverageData: CoverageData): CoverageAnalysis {
    const analysis: CoverageAnalysis = {
      overall: coverageData.overall,
      byType: {
        statements: coverageData.statements,
        branches: coverageData.branches,
        functions: coverageData.functions,
        lines: coverageData.lines
      },
      byComponent: this.analyzeCoverageByComponent(coverageData),
      recommendations: this.generateCoverageRecommendations(coverageData)
    }
    
    return analysis
  }
  
  // 按组件分析覆盖率
  private analyzeCoverageByComponent(coverageData: CoverageData): ComponentCoverage[] {
    return coverageData.files
      .filter(file => file.path.includes('/components/'))
      .map(file => ({
        component: this.extractComponentName(file.path),
        coverage: file.coverage,
        uncoveredLines: file.uncoveredLines,
        complexity: file.complexity
      }))
      .sort((a, b) => a.coverage - b.coverage)
  }
  
  // 提取组件名称
  private extractComponentName(filePath: string): string {
    const match = filePath.match(/\/components\/([^/]+)/)
    return match ? match[1] : 'unknown'
  }
  
  // 生成覆盖率建议
  private generateCoverageRecommendations(coverageData: CoverageData): string[] {
    const recommendations: string[] = []
    
    if (coverageData.overall < 80) {
      recommendations.push('整体覆盖率低于80%，需要增加测试用例')
    }
    
    if (coverageData.branches < 70) {
      recommendations.push('分支覆盖率较低，需要测试更多条件分支')
    }
    
    const lowCoverageComponents = this.analyzeCoverageByComponent(coverageData)
      .filter(comp => comp.coverage < 60)
    
    if (lowCoverageComponents.length > 0) {
      recommendations.push(
        `以下组件覆盖率较低: ${lowCoverageComponents.map(c => c.component).join(', ')}`
      )
    }
    
    return recommendations
  }
}

// 测试指标收集器
class TestMetrics {
  private metrics: Map<string, any> = new Map()
  
  // 收集测试执行指标
  collectExecutionMetrics(testResults: TestResults): ExecutionMetrics {
    const metrics: ExecutionMetrics = {
      totalTests: testResults.numTotalTests,
      passedTests: testResults.numPassedTests,
      failedTests: testResults.numFailedTests,
      skippedTests: testResults.numPendingTests,
      executionTime: testResults.testExecTime,
      successRate: (testResults.numPassedTests / testResults.numTotalTests) * 100,
      averageTestTime: testResults.testExecTime / testResults.numTotalTests
    }
    
    this.metrics.set('execution', metrics)
    return metrics
  }
  
  // 收集性能指标
  collectPerformanceMetrics(performanceData: PerformanceData): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      setupTime: performanceData.setupTime,
      teardownTime: performanceData.teardownTime,
      memoryUsage: performanceData.memoryUsage,
      cpuUsage: performanceData.cpuUsage,
      slowestTests: performanceData.slowestTests
    }
    
    this.metrics.set('performance', metrics)
    return metrics
  }
  
  // 生成测试报告
  generateReport(): TestReport {
    return {
      timestamp: new Date().toISOString(),
      execution: this.metrics.get('execution'),
      performance: this.metrics.get('performance'),
      coverage: this.metrics.get('coverage'),
      trends: this.calculateTrends()
    }
  }
  
  // 计算趋势
  private calculateTrends(): TrendData {
    // 简化实现，实际应该从历史数据计算
    return {
      coverageTrend: 'increasing',
      performanceTrend: 'stable',
      reliabilityTrend: 'improving'
    }
  }
}

// 类型定义
interface TestLevel {
  name: string
  description: string
  tools: string[]
  coverage: number
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  confidence: 'low' | 'medium' | 'high' | 'very high'
}

interface TestStrategy {
  levels: TestLevel[]
  distribution: Record<string, number>
  principles: string[]
}

interface CoverageData {
  overall: number
  statements: number
  branches: number
  functions: number
  lines: number
  files: Array<{
    path: string
    coverage: number
    uncoveredLines: number[]
    complexity: number
  }>
}

interface CoverageAnalysis {
  overall: number
  byType: Record<string, number>
  byComponent: ComponentCoverage[]
  recommendations: string[]
}

interface ComponentCoverage {
  component: string
  coverage: number
  uncoveredLines: number[]
  complexity: number
}
```

### 1.2 测试配置管理

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

// 测试配置工厂
class TestConfigFactory {
  private environment: 'unit' | 'integration' | 'e2e'
  
  constructor(environment: 'unit' | 'integration' | 'e2e') {
    this.environment = environment
  }
  
  // 创建基础配置
  createBaseConfig() {
    return defineConfig({
      plugins: [
        vue(),
        vueJsx()
      ],
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
          '@element-plus': resolve(__dirname, 'packages')
        }
      },
      test: {
        ...this.getTestConfig(),
        setupFiles: this.getSetupFiles(),
        coverage: this.getCoverageConfig(),
        reporters: this.getReporters(),
        globals: true
      }
    })
  }
  
  // 获取测试配置
  private getTestConfig() {
    const baseConfig = {
      environment: 'happy-dom',
      transformMode: {
        web: [/\.[jt]sx?$/, /\.vue$/]
      },
      threads: true,
      isolate: true
    }
    
    switch (this.environment) {
      case 'unit':
        return {
          ...baseConfig,
          include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/e2e/**'
          ],
          testTimeout: 10000
        }
      
      case 'integration':
        return {
          ...baseConfig,
          include: ['**/integration/**/*.{test,spec}.{js,ts,jsx,tsx}'],
          testTimeout: 30000,
          hookTimeout: 30000
        }
      
      case 'e2e':
        return {
          environment: 'node',
          include: ['**/e2e/**/*.{test,spec}.{js,ts}'],
          testTimeout: 60000,
          hookTimeout: 60000
        }
      
      default:
        return baseConfig
    }
  }
  
  // 获取设置文件
  private getSetupFiles(): string[] {
    const setupFiles = ['./test/setup.ts']
    
    if (this.environment === 'unit') {
      setupFiles.push('./test/unit-setup.ts')
    }
    
    if (this.environment === 'integration') {
      setupFiles.push('./test/integration-setup.ts')
    }
    
    return setupFiles
  }
  
  // 获取覆盖率配置
  private getCoverageConfig() {
    return {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock/**',
        '**/__tests__/**'
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 80,
          lines: 80
        },
        perFile: {
          statements: 70,
          branches: 65,
          functions: 70,
          lines: 70
        }
      },
      watermarks: {
        statements: [70, 80],
        branches: [65, 75],
        functions: [70, 80],
        lines: [70, 80]
      }
    }
  }
  
  // 获取报告器
  private getReporters(): string[] {
    const reporters = ['default']
    
    if (process.env.CI) {
      reporters.push('junit')
    }
    
    if (this.environment === 'unit') {
      reporters.push('verbose')
    }
    
    return reporters
  }
}

// 导出配置
export default new TestConfigFactory('unit').createBaseConfig()
```

## 2. 单元测试实践

### 2.1 组件测试工具类

```typescript
// test/utils/component-test-utils.ts
import { mount, VueWrapper, MountingOptions } from '@vue/test-utils'
import { Component, App } from 'vue'
import { ElConfigProvider } from 'element-plus'

// 组件测试工具类
class ComponentTestUtils {
  private defaultGlobalConfig: any
  
  constructor() {
    this.defaultGlobalConfig = {
      global: {
        components: {
          ElConfigProvider
        },
        provide: {
          // 提供默认的全局配置
        }
      }
    }
  }
  
  // 挂载组件
  mountComponent<T extends Component>(
    component: T,
    options: MountingOptions<any> = {}
  ): VueWrapper<any> {
    const mergedOptions = this.mergeOptions(options)
    return mount(component, mergedOptions)
  }
  
  // 挂载带配置提供者的组件
  mountWithProvider<T extends Component>(
    component: T,
    providerProps: any = {},
    options: MountingOptions<any> = {}
  ): VueWrapper<any> {
    const wrapper = mount({
      template: `
        <el-config-provider v-bind="providerProps">
          <test-component v-bind="componentProps" />
        </el-config-provider>
      `,
      components: {
        ElConfigProvider,
        TestComponent: component
      },
      data() {
        return {
          providerProps,
          componentProps: options.props || {}
        }
      }
    }, this.mergeOptions(options))
    
    return wrapper
  }
  
  // 合并选项
  private mergeOptions(options: MountingOptions<any>): MountingOptions<any> {
    return {
      ...this.defaultGlobalConfig,
      ...options,
      global: {
        ...this.defaultGlobalConfig.global,
        ...options.global
      }
    }
  }
  
  // 等待异步更新
  async waitForUpdate(wrapper: VueWrapper<any>, timeout: number = 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout waiting for update'))
      }, timeout)
      
      wrapper.vm.$nextTick(() => {
        clearTimeout(timer)
        resolve()
      })
    })
  }
  
  // 触发事件并等待
  async triggerAndWait(
    wrapper: VueWrapper<any>,
    selector: string,
    event: string,
    payload?: any
  ): Promise<void> {
    const element = wrapper.find(selector)
    await element.trigger(event, payload)
    await this.waitForUpdate(wrapper)
  }
  
  // 模拟用户输入
  async simulateUserInput(
    wrapper: VueWrapper<any>,
    selector: string,
    value: string
  ): Promise<void> {
    const input = wrapper.find(selector)
    await input.setValue(value)
    await input.trigger('input')
    await input.trigger('change')
    await this.waitForUpdate(wrapper)
  }
  
  // 检查可访问性
  checkAccessibility(wrapper: VueWrapper<any>): AccessibilityReport {
    const element = wrapper.element as HTMLElement
    
    return {
      hasAriaLabel: this.hasAriaLabel(element),
      hasTabIndex: this.hasTabIndex(element),
      hasKeyboardSupport: this.hasKeyboardSupport(wrapper),
      hasSemanticMarkup: this.hasSemanticMarkup(element),
      colorContrast: this.checkColorContrast(element)
    }
  }
  
  // 检查 ARIA 标签
  private hasAriaLabel(element: HTMLElement): boolean {
    return !!(element.getAttribute('aria-label') || 
             element.getAttribute('aria-labelledby') ||
             element.getAttribute('aria-describedby'))
  }
  
  // 检查 Tab 索引
  private hasTabIndex(element: HTMLElement): boolean {
    const tabIndex = element.getAttribute('tabindex')
    return tabIndex !== null && tabIndex !== '-1'
  }
  
  // 检查键盘支持
  private hasKeyboardSupport(wrapper: VueWrapper<any>): boolean {
    // 简化实现，实际应该检查键盘事件监听器
    const element = wrapper.element as HTMLElement
    return element.tagName === 'BUTTON' || 
           element.tagName === 'INPUT' ||
           element.hasAttribute('tabindex')
  }
  
  // 检查语义化标记
  private hasSemanticMarkup(element: HTMLElement): boolean {
    const semanticTags = ['button', 'input', 'select', 'textarea', 'label']
    return semanticTags.includes(element.tagName.toLowerCase()) ||
           element.hasAttribute('role')
  }
  
  // 检查颜色对比度
  private checkColorContrast(element: HTMLElement): ContrastResult {
    // 简化实现，实际应该计算真实的对比度
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const backgroundColor = styles.backgroundColor
    
    return {
      ratio: 4.5, // 模拟值
      level: 'AA',
      passes: true
    }
  }
  
  // 性能测试
  async measurePerformance(
    testFunction: () => Promise<void> | void,
    iterations: number = 100
  ): Promise<PerformanceResult> {
    const times: number[] = []
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await testFunction()
      const end = performance.now()
      times.push(end - start)
    }
    
    return {
      average: times.reduce((sum, time) => sum + time, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      median: this.calculateMedian(times),
      standardDeviation: this.calculateStandardDeviation(times)
    }
  }
  
  // 计算中位数
  private calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2
    }
    
    return sorted[middle]
  }
  
  // 计算标准差
  private calculateStandardDeviation(numbers: number[]): number {
    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length
    const squaredDifferences = numbers.map(num => Math.pow(num - average, 2))
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / numbers.length
    
    return Math.sqrt(variance)
  }
}

// 类型定义
interface AccessibilityReport {
  hasAriaLabel: boolean
  hasTabIndex: boolean
  hasKeyboardSupport: boolean
  hasSemanticMarkup: boolean
  colorContrast: ContrastResult
}

interface ContrastResult {
  ratio: number
  level: 'AA' | 'AAA' | 'fail'
  passes: boolean
}

interface PerformanceResult {
  average: number
  min: number
  max: number
  median: number
  standardDeviation: number
}

// 导出工具实例
export const testUtils = new ComponentTestUtils()
```

### 2.2 Button 组件测试示例

```typescript
// packages/components/button/__tests__/button.test.ts
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import Button from '../src/button.vue'
import { testUtils } from '../../../test/utils/component-test-utils'

describe('Button Component', () => {
  // 基础功能测试
  describe('Basic Functionality', () => {
    it('should render correctly', () => {
      const wrapper = testUtils.mountComponent(Button, {
        slots: {
          default: 'Test Button'
        }
      })
      
      expect(wrapper.text()).toBe('Test Button')
      expect(wrapper.classes()).toContain('el-button')
    })
    
    it('should handle different types', () => {
      const types = ['primary', 'success', 'warning', 'danger', 'info']
      
      types.forEach(type => {
        const wrapper = testUtils.mountComponent(Button, {
          props: { type }
        })
        
        expect(wrapper.classes()).toContain(`el-button--${type}`)
      })
    })
    
    it('should handle different sizes', () => {
      const sizes = ['large', 'default', 'small']
      
      sizes.forEach(size => {
        const wrapper = testUtils.mountComponent(Button, {
          props: { size }
        })
        
        if (size !== 'default') {
          expect(wrapper.classes()).toContain(`el-button--${size}`)
        }
      })
    })
    
    it('should be disabled when disabled prop is true', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { disabled: true }
      })
      
      expect(wrapper.classes()).toContain('is-disabled')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })
  
  // 事件测试
  describe('Events', () => {
    it('should emit click event', async () => {
      const wrapper = testUtils.mountComponent(Button)
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
    
    it('should not emit click when disabled', async () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { disabled: true }
      })
      
      await wrapper.trigger('click')
      
      expect(wrapper.emitted('click')).toBeFalsy()
    })
    
    it('should handle keyboard events', async () => {
      const wrapper = testUtils.mountComponent(Button)
      
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeTruthy()
      
      await wrapper.trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toHaveLength(2)
    })
  })
  
  // 加载状态测试
  describe('Loading State', () => {
    it('should show loading icon when loading', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { loading: true }
      })
      
      expect(wrapper.classes()).toContain('is-loading')
      expect(wrapper.find('.el-icon-loading').exists()).toBe(true)
    })
    
    it('should be disabled when loading', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { loading: true }
      })
      
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })
  
  // 图标测试
  describe('Icon', () => {
    it('should render icon when icon prop is provided', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { icon: 'el-icon-search' }
      })
      
      expect(wrapper.find('.el-icon-search').exists()).toBe(true)
    })
    
    it('should render icon slot', () => {
      const wrapper = testUtils.mountComponent(Button, {
        slots: {
          icon: '<i class="custom-icon"></i>'
        }
      })
      
      expect(wrapper.find('.custom-icon').exists()).toBe(true)
    })
  })
  
  // 可访问性测试
  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { disabled: true }
      })
      
      expect(wrapper.attributes('role')).toBe('button')
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })
    
    it('should be keyboard accessible', async () => {
      const wrapper = testUtils.mountComponent(Button)
      
      expect(wrapper.attributes('tabindex')).toBe('0')
      
      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })
    
    it('should pass accessibility checks', () => {
      const wrapper = testUtils.mountComponent(Button, {
        slots: { default: 'Accessible Button' }
      })
      
      const report = testUtils.checkAccessibility(wrapper)
      
      expect(report.hasSemanticMarkup).toBe(true)
      expect(report.hasKeyboardSupport).toBe(true)
    })
  })
  
  // 性能测试
  describe('Performance', () => {
    it('should render quickly', async () => {
      const result = await testUtils.measurePerformance(() => {
        const wrapper = testUtils.mountComponent(Button, {
          slots: { default: 'Performance Test' }
        })
        wrapper.unmount()
      }, 50)
      
      expect(result.average).toBeLessThan(10) // 平均渲染时间小于10ms
    })
    
    it('should handle rapid clicks efficiently', async () => {
      const wrapper = testUtils.mountComponent(Button)
      const clickHandler = vi.fn()
      
      wrapper.vm.$on('click', clickHandler)
      
      const result = await testUtils.measurePerformance(async () => {
        await wrapper.trigger('click')
      }, 100)
      
      expect(result.average).toBeLessThan(5) // 平均点击处理时间小于5ms
      expect(clickHandler).toHaveBeenCalledTimes(100)
    })
  })
  
  // 边界情况测试
  describe('Edge Cases', () => {
    it('should handle empty slots gracefully', () => {
      const wrapper = testUtils.mountComponent(Button)
      
      expect(wrapper.element).toBeDefined()
      expect(wrapper.classes()).toContain('el-button')
    })
    
    it('should handle invalid props gracefully', () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: {
          type: 'invalid-type',
          size: 'invalid-size'
        }
      })
      
      expect(wrapper.element).toBeDefined()
      // 应该回退到默认值
      expect(wrapper.classes()).toContain('el-button')
    })
    
    it('should handle rapid prop changes', async () => {
      const wrapper = testUtils.mountComponent(Button, {
        props: { type: 'primary' }
      })
      
      // 快速切换属性
      await wrapper.setProps({ type: 'success' })
      await wrapper.setProps({ type: 'warning' })
      await wrapper.setProps({ type: 'danger' })
      
      expect(wrapper.classes()).toContain('el-button--danger')
    })
  })
  
  // 集成测试
  describe('Integration', () => {
    it('should work with form validation', async () => {
      const wrapper = testUtils.mountComponent({
        template: `
          <form @submit.prevent="handleSubmit">
            <el-button type="submit" :disabled="!isValid">
              Submit
            </el-button>
          </form>
        `,
        components: { ElButton: Button },
        data() {
          return {
            isValid: false
          }
        },
        methods: {
          handleSubmit: vi.fn()
        }
      })
      
      const button = wrapper.findComponent(Button)
      expect(button.attributes('disabled')).toBeDefined()
      
      await wrapper.setData({ isValid: true })
      expect(button.attributes('disabled')).toBeUndefined()
    })
    
    it('should work with config provider', () => {
      const wrapper = testUtils.mountWithProvider(Button, {
        size: 'large'
      })
      
      const button = wrapper.findComponent(Button)
      expect(button.classes()).toContain('el-button--large')
    })
  })
})
```

## 3. 集成测试实践

### 3.1 表单组件集成测试

```typescript
// test/integration/form.test.ts
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { testUtils } from '../utils/component-test-utils'

describe('Form Integration', () => {
  // 表单验证集成测试
  describe('Form Validation Integration', () => {
    it('should validate form fields correctly', async () => {
      const wrapper = testUtils.mountComponent({
        template: `
          <el-form ref="formRef" :model="form" :rules="rules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" type="email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">
                提交
              </el-button>
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
            form: {
              username: '',
              email: ''
            },
            rules: {
              username: [
                { required: true, message: '请输入用户名', trigger: 'blur' }
              ],
              email: [
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
              ]
            }
          }
        },
        methods: {
          async submitForm() {
            try {
              await this.$refs.formRef.validate()
              this.$emit('submit', this.form)
            } catch (error) {
              console.log('Validation failed')
            }
          }
        }
      })
      
      // 测试空表单提交
      const submitButton = wrapper.find('button')
      await submitButton.trigger('click')
      await nextTick()
      
      // 应该显示验证错误
      const errorMessages = wrapper.findAll('.el-form-item__error')
      expect(errorMessages).toHaveLength(2)
      
      // 填写有效数据
      const usernameInput = wrapper.find('input[type="text"]')
      const emailInput = wrapper.find('input[type="email"]')
      
      await testUtils.simulateUserInput(wrapper, 'input[type="text"]', 'testuser')
      await testUtils.simulateUserInput(wrapper, 'input[type="email"]', 'test@example.com')
      
      // 再次提交
      await submitButton.trigger('click')
      await nextTick()
      
      // 应该成功提交
      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')[0][0]).toEqual({
        username: 'testuser',
        email: 'test@example.com'
      })
    })
    
    it('should handle async validation', async () => {
      const asyncValidator = vi.fn().mockImplementation((rule, value, callback) => {
        setTimeout(() => {
          if (value === 'taken') {
            callback(new Error('用户名已被占用'))
          } else {
            callback()
          }
        }, 100)
      })
      
      const wrapper = testUtils.mountComponent({
        template: `
          <el-form :model="form" :rules="rules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
          </el-form>
        `,
        components: { ElForm, ElFormItem, ElInput },
        data() {
          return {
            form: { username: '' },
            rules: {
              username: [{ validator: asyncValidator, trigger: 'blur' }]
            }
          }
        }
      })
      
      // 输入已占用的用户名
      await testUtils.simulateUserInput(wrapper, 'input', 'taken')
      
      // 触发失焦验证
      await wrapper.find('input').trigger('blur')
      
      // 等待异步验证完成
      await new Promise(resolve => setTimeout(resolve, 150))
      await nextTick()
      
      // 应该显示错误信息
      expect(wrapper.find('.el-form-item__error').text()).toBe('用户名已被占用')
      expect(asyncValidator).toHaveBeenCalledWith(
        expect.any(Object),
        'taken',
        expect.any(Function)
      )
    })
  })
  
  // 表单联动测试
  describe('Form Field Interaction', () => {
    it('should handle field dependencies', async () => {
      const wrapper = testUtils.mountComponent({
        template: `
          <el-form :model="form">
            <el-form-item label="国家">
              <el-select v-model="form.country" @change="onCountryChange">
                <el-option label="中国" value="china" />
                <el-option label="美国" value="usa" />
              </el-select>
            </el-form-item>
            <el-form-item label="城市">
              <el-select v-model="form.city" :disabled="!form.country">
                <el-option 
                  v-for="city in availableCities" 
                  :key="city.value"
                  :label="city.label" 
                  :value="city.value" 
                />
              </el-select>
            </el-form-item>
          </el-form>
        `,
        components: { ElForm, ElFormItem, ElSelect: ElInput, ElOption: ElInput },
        data() {
          return {
            form: {
              country: '',
              city: ''
            },
            cityOptions: {
              china: [
                { label: '北京', value: 'beijing' },
                { label: '上海', value: 'shanghai' }
              ],
              usa: [
                { label: '纽约', value: 'newyork' },
                { label: '洛杉矶', value: 'losangeles' }
              ]
            }
          }
        },
        computed: {
          availableCities() {
            return this.cityOptions[this.form.country] || []
          }
        },
        methods: {
          onCountryChange() {
            this.form.city = '' // 重置城市选择
          }
        }
      })
      
      // 初始状态城市选择应该被禁用
      const citySelect = wrapper.findAll('select')[1]
      expect(citySelect.attributes('disabled')).toBeDefined()
      
      // 选择国家
      const countrySelect = wrapper.findAll('select')[0]
      await countrySelect.setValue('china')
      await nextTick()
      
      // 城市选择应该被启用
      expect(citySelect.attributes('disabled')).toBeUndefined()
      
      // 切换国家应该重置城市
      await wrapper.setData({ 'form.city': 'beijing' })
      await countrySelect.setValue('usa')
      await nextTick()
      
      expect(wrapper.vm.form.city).toBe('')
    })
  })
})
```

## 4. E2E 测试实践

### 4.1 Playwright E2E 测试

```typescript
// e2e/button.spec.ts
import { test, expect, Page } from '@playwright/test'

// E2E 测试工具类
class E2ETestUtils {
  constructor(private page: Page) {}
  
  // 等待组件加载
  async waitForComponent(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout })
  }
  
  // 截图对比
  async compareScreenshot(name: string, options: any = {}): Promise<void> {
    await expect(this.page).toHaveScreenshot(`${name}.png`, {
      threshold: 0.2,
      ...options
    })
  }
  
  // 检查可访问性
  async checkAccessibility(): Promise<void> {
    // 使用 axe-core 进行可访问性检查
    const accessibilityScanResults = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        // @ts-ignore
        axe.run(document, (err, results) => {
          if (err) throw err
          resolve(results)
        })
      })
    })
    
    // @ts-ignore
    expect(accessibilityScanResults.violations).toHaveLength(0)
  }
  
  // 性能测试
  async measurePerformance(): Promise<any> {
    const metrics = await this.page.evaluate(() => {
      return JSON.parse(JSON.stringify(performance.getEntriesByType('navigation')[0]))
    })
    
    return {
      loadTime: metrics.loadEventEnd - metrics.navigationStart,
      domContentLoaded: metrics.domContentLoadedEventEnd - metrics.navigationStart,
      firstPaint: metrics.responseEnd - metrics.navigationStart
    }
  }
}

test.describe('Button E2E Tests', () => {
  let utils: E2ETestUtils
  
  test.beforeEach(async ({ page }) => {
    utils = new E2ETestUtils(page)
    await page.goto('/components/button')
    await utils.waitForComponent('.el-button')
  })
  
  test('should render different button types', async ({ page }) => {
    // 检查所有按钮类型是否正确渲染
    const buttonTypes = ['default', 'primary', 'success', 'warning', 'danger', 'info']
    
    for (const type of buttonTypes) {
      const button = page.locator(`[data-testid="button-${type}"]`)
      await expect(button).toBeVisible()
      
      if (type !== 'default') {
        await expect(button).toHaveClass(new RegExp(`el-button--${type}`))
      }
    }
    
    // 截图对比
    await utils.compareScreenshot('button-types')
  })
  
  test('should handle click interactions', async ({ page }) => {
    const button = page.locator('[data-testid="button-primary"]')
    const clickCounter = page.locator('[data-testid="click-counter"]')
    
    // 初始状态
    await expect(clickCounter).toHaveText('0')
    
    // 点击按钮
    await button.click()
    await expect(clickCounter).toHaveText('1')
    
    // 多次点击
    await button.click({ clickCount: 3 })
    await expect(clickCounter).toHaveText('4')
  })
  
  test('should handle keyboard navigation', async ({ page }) => {
    const firstButton = page.locator('[data-testid="button-first"]')
    const secondButton = page.locator('[data-testid="button-second"]')
    
    // 聚焦第一个按钮
    await firstButton.focus()
    await expect(firstButton).toBeFocused()
    
    // Tab 导航到下一个按钮
    await page.keyboard.press('Tab')
    await expect(secondButton).toBeFocused()
    
    // 使用 Enter 键激活按钮
    await page.keyboard.press('Enter')
    
    // 检查按钮是否被激活
    const clickCounter = page.locator('[data-testid="click-counter"]')
    await expect(clickCounter).toHaveText('1')
  })
  
  test('should handle disabled state', async ({ page }) => {
    const disabledButton = page.locator('[data-testid="button-disabled"]')
    const clickCounter = page.locator('[data-testid="click-counter"]')
    
    // 检查按钮是否被禁用
    await expect(disabledButton).toBeDisabled()
    await expect(disabledButton).toHaveClass(/is-disabled/)
    
    // 尝试点击禁用的按钮
    await disabledButton.click({ force: true })
    
    // 计数器不应该改变
    await expect(clickCounter).toHaveText('0')
  })
  
  test('should handle loading state', async ({ page }) => {
    const loadingButton = page.locator('[data-testid="button-loading"]')
    const toggleButton = page.locator('[data-testid="toggle-loading"]')
    
    // 触发加载状态
    await toggleButton.click()
    
    // 检查加载状态
    await expect(loadingButton).toHaveClass(/is-loading/)
    await expect(loadingButton).toBeDisabled()
    
    // 检查加载图标
    const loadingIcon = loadingButton.locator('.el-icon-loading')
    await expect(loadingIcon).toBeVisible()
    
    // 截图对比
    await utils.compareScreenshot('button-loading')
  })
  
  test('should be accessible', async ({ page }) => {
    // 检查可访问性
    await utils.checkAccessibility()
    
    // 检查 ARIA 属性
    const button = page.locator('[data-testid="button-primary"]')
    await expect(button).toHaveAttribute('role', 'button')
    
    // 检查键盘可访问性
    await button.focus()
    await page.keyboard.press('Enter')
    
    const clickCounter = page.locator('[data-testid="click-counter"]')
    await expect(clickCounter).toHaveText('1')
  })
  
  test('should perform well', async ({ page }) => {
    // 测试性能
    const metrics = await utils.measurePerformance()
    
    // 页面加载时间应该小于2秒
    expect(metrics.loadTime).toBeLessThan(2000)
    
    // DOM内容加载时间应该小于1秒
    expect(metrics.domContentLoaded).toBeLessThan(1000)
  })
  
  test('should work on different screen sizes', async ({ page }) => {
    const button = page.locator('[data-testid="button-responsive"]')
    
    // 桌面尺寸
    await page.setViewportSize({ width: 1200, height: 800 })
    await utils.compareScreenshot('button-desktop')
    
    // 平板尺寸
    await page.setViewportSize({ width: 768, height: 1024 })
    await utils.compareScreenshot('button-tablet')
    
    // 手机尺寸
    await page.setViewportSize({ width: 375, height: 667 })
    await utils.compareScreenshot('button-mobile')
    
    // 在所有尺寸下按钮都应该可点击
    await button.click()
    const clickCounter = page.locator('[data-testid="click-counter"]')
    await expect(clickCounter).toHaveText('1')
  })
  
  test('should handle rapid interactions', async ({ page }) => {
    const button = page.locator('[data-testid="button-rapid"]')
    const clickCounter = page.locator('[data-testid="click-counter"]')
    
    // 快速点击多次
    for (let i = 0; i < 10; i++) {
      await button.click()
    }
    
    // 检查所有点击都被正确处理
    await expect(clickCounter).toHaveText('10')
  })
})
```

## 5. 实践练习

1. **测试体系搭建**：
   - 配置完整的测试环境
   - 实现测试工具类
   - 建立测试规范

2. **组件测试实践**：
   - 编写单元测试用例
   - 实现集成测试
   - 添加 E2E 测试

3. **质量保证体系**：
   - 建立代码覆盖率标准
   - 实现自动化测试流程
   - 添加性能测试

## 6. 学习资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright 文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

## 7. 作业

- 为一个完整组件编写全套测试
- 实现测试覆盖率报告
- 搭建 CI/CD 测试流程
- 编写测试最佳实践文档

## 总结

通过第83天的学习，我们深入掌握了：

1. **测试体系架构**：理解了完整的测试金字塔和策略
2. **单元测试**：掌握了组件单元测试的编写方法
3. **集成测试**：学会了组件间交互的测试技巧
4. **E2E测试**：实现了端到端的用户流程测试
5. **质量保证**：建立了完整的质量保证体系

这些技能将帮助我们构建高质量、可靠的组件库。