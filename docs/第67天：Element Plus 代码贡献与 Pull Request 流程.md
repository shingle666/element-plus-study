# 第67天：Element Plus 代码贡献与 Pull Request 流程

## 学习目标

* 掌握 Element Plus 的贡献流程和规范
* 学习如何提交高质量的 Pull Request
* 了解代码审查的标准和流程
* 理解开源项目的协作模式

## 知识点概览

### 1. 贡献准备工作

#### 1.1 环境搭建

```bash
# 1. Fork Element Plus 仓库
# 在 GitHub 上点击 Fork 按钮

# 2. 克隆你的 Fork
git clone https://github.com/YOUR_USERNAME/element-plus.git
cd element-plus

# 3. 添加上游仓库
git remote add upstream https://github.com/element-plus/element-plus.git

# 4. 验证远程仓库
git remote -v
# origin    https://github.com/YOUR_USERNAME/element-plus.git (fetch)
# origin    https://github.com/YOUR_USERNAME/element-plus.git (push)
# upstream  https://github.com/element-plus/element-plus.git (fetch)
# upstream  https://github.com/element-plus/element-plus.git (push)

# 5. 安装依赖
pnpm install

# 6. 启动开发服务器
pnpm dev
```

#### 1.2 开发工具配置

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "stylelint.validate": [
    "css",
    "scss",
    "vue"
  ],
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false,
  "volar.takeOverMode.enabled": true
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",
    "stylelint.vscode-stylelint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### 2. 贡献类型和流程

#### 2.1 Bug 修复流程

```typescript
// 1. 创建 Bug 修复分支
// git checkout -b fix/button-loading-state

// 2. Bug 修复示例：修复按钮加载状态问题
// packages/components/button/src/button.vue

// 修复前的问题代码
/*
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <el-icon v-if="loading">
      <Loading />
    </el-icon>
    <slot />
  </button>
</template>

<script setup>
// 问题：loading 状态下仍然可以触发点击事件
const handleClick = (event) => {
  emit('click', event)
}
</script>
*/

// 修复后的代码
const handleClick = (event: MouseEvent) => {
  // 修复：在 loading 或 disabled 状态下阻止事件
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  
  emit('click', event)
}

// 3. 添加测试用例
// packages/components/button/__tests__/button.test.tsx
describe('Button loading state', () => {
  it('should not emit click event when loading', async () => {
    const handleClick = vi.fn()
    const wrapper = mount(Button, {
      props: {
        loading: true,
        onClick: handleClick
      }
    })

    await wrapper.trigger('click')
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should prevent default and stop propagation when loading', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      }
    })

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    }

    await wrapper.vm.handleClick(mockEvent as any)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.stopPropagation).toHaveBeenCalled()
  })
})

// 4. 更新文档（如果需要）
// docs/en-US/component/button.md
```

#### 2.2 新功能开发流程

```typescript
// 1. 创建功能分支
// git checkout -b feat/button-custom-loading-icon

// 2. 新功能实现：自定义加载图标
// packages/components/button/src/button.ts
export const buttonProps = buildProps({
  // ... 其他 props
  
  /**
   * @description custom loading icon component
   */
  loadingIcon: {
    type: iconPropType,
    default: () => Loading
  }
} as const)

// packages/components/button/src/button.vue
<template>
  <component
    :is="tag"
    :class="buttonClasses"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <el-icon v-else :class="ns.is('loading')">
        <!-- 使用自定义加载图标 -->
        <component :is="loadingIcon" />
      </el-icon>
    </template>
    <!-- ... 其他内容 -->
  </component>
</template>

<script setup lang="ts">
// 添加 loadingIcon 的响应式处理
const props = defineProps(buttonProps)

// 确保 loadingIcon 是响应式的
const loadingIcon = computed(() => props.loadingIcon)
</script>

// 3. 添加类型导出
// packages/components/button/index.ts
export * from './src/button'

// 4. 添加测试
// packages/components/button/__tests__/button.test.tsx
import { Search } from '@element-plus/icons-vue'

describe('Button custom loading icon', () => {
  it('should render custom loading icon', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        loadingIcon: Search
      }
    })

    expect(wrapper.findComponent(Search).exists()).toBe(true)
    expect(wrapper.findComponent(Loading).exists()).toBe(false)
  })

  it('should use loading slot when provided', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        loadingIcon: Search
      },
      slots: {
        loading: '<span class="custom-loading">Loading...</span>'
      }
    })

    expect(wrapper.find('.custom-loading').exists()).toBe(true)
    expect(wrapper.findComponent(Search).exists()).toBe(false)
  })
})

// 5. 更新文档
// docs/en-US/component/button.md
// 添加新的示例和 API 文档
```

#### 2.3 文档改进流程

```markdown
<!-- docs/en-US/component/button.md -->
<!-- 1. 添加新的示例 -->

## Custom Loading Icon

You can customize the loading icon.

:::demo Use `loading-icon` prop to set custom loading icon, or use `loading` slot for more complex loading content.

button/custom-loading-icon

:::

<!-- 2. 更新 API 文档 -->
### Button Attributes

| Name         | Description                    | Type                 | Default   |
| ------------ | ------------------------------ | -------------------- | --------- |
| loading-icon | Custom loading icon component  | `string \| Component` | `Loading` |

### Button Slots

| Name    | Description              |
| ------- | ------------------------ |
| loading | Custom loading content   |
```

```vue
<!-- docs/examples/button/custom-loading-icon.vue -->
<template>
  <div class="demo-button">
    <div class="mb-4">
      <el-button type="primary" loading loading-icon="Search">
        Custom Icon
      </el-button>
      
      <el-button type="success" loading :loading-icon="ElIconRefresh">
        Refresh Icon
      </el-button>
    </div>
    
    <div class="mb-4">
      <el-button type="warning" loading>
        <template #loading>
          <div class="custom-loading">
            <i class="custom-spinner"></i>
            Loading...
          </div>
        </template>
        Custom Loading Slot
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { Refresh as ElIconRefresh } from '@element-plus/icons-vue'
</script>

<style scoped>
.demo-button .el-button {
  margin-right: 10px;
  margin-bottom: 10px;
}

.custom-loading {
  display: flex;
  align-items: center;
  gap: 6px;
}

.custom-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
```

### 3. Pull Request 最佳实践

#### 3.1 提交信息规范

```bash
# 提交信息格式
# type(scope): description
#
# [optional body]
#
# [optional footer]

# 示例：
git commit -m "feat(button): add custom loading icon support

- Add loadingIcon prop to Button component
- Support custom loading icon component
- Add loading slot for complex loading content
- Update documentation and examples

Closes #1234"

# 提交类型：
# feat: 新功能
# fix: Bug 修复
# docs: 文档更新
# style: 代码格式调整
# refactor: 代码重构
# perf: 性能优化
# test: 测试相关
# chore: 构建过程或辅助工具的变动
# ci: CI 配置文件和脚本的变动
# build: 影响构建系统或外部依赖的更改
# revert: 回滚之前的提交

# 作用域示例：
# button, input, table, form, dialog, etc.
```

#### 3.2 PR 模板和检查清单

```markdown
<!-- .github/pull_request_template.md -->
## PR Checklist

Please check if your PR fulfills the following requirements:

- [ ] The commit message follows our guidelines
- [ ] Tests for the changes have been added (for bug fixes / features)
- [ ] Docs have been added / updated (for bug fixes / features)
- [ ] The code follows the project's coding standards
- [ ] Self-review has been performed
- [ ] No breaking changes (or breaking changes are documented)

## PR Type

What kind of change does this PR introduce?

<!-- Please check the one that applies to this PR using "x". -->

- [ ] Bugfix
- [ ] Feature
- [ ] Code style update (formatting, local variables)
- [ ] Refactoring (no functional changes, no api changes)
- [ ] Build related changes
- [ ] CI related changes
- [ ] Documentation content changes
- [ ] Other... Please describe:

## What is the current behavior?

<!-- Please describe the current behavior that you are modifying, or link to a relevant issue. -->

Issue Number: N/A

## What is the new behavior?

<!-- Please describe the behavior or changes that are being added by this PR. -->

## Does this PR introduce a breaking change?

- [ ] Yes
- [ ] No

<!-- If this PR contains a breaking change, please describe the impact and migration path for existing applications below. -->

## Other information

<!-- Any other information that is important to this PR such as screenshots of how the component looks before and after the change. -->
```

#### 3.3 代码审查准备

```typescript
// 1. 自我审查检查清单
interface CodeReviewChecklist {
  // 代码质量
  codeQuality: {
    followsCodingStandards: boolean
    hasProperErrorHandling: boolean
    isWellDocumented: boolean
    hasNoCodeSmells: boolean
  }
  
  // 功能性
  functionality: {
    meetsRequirements: boolean
    handlesEdgeCases: boolean
    hasNoRegressions: boolean
    isBackwardCompatible: boolean
  }
  
  // 测试
  testing: {
    hasUnitTests: boolean
    hasIntegrationTests: boolean
    hasE2eTests: boolean
    achievesGoodCoverage: boolean
  }
  
  // 性能
  performance: {
    noPerformanceRegressions: boolean
    optimizedForSize: boolean
    efficientAlgorithms: boolean
  }
  
  // 安全性
  security: {
    noSecurityVulnerabilities: boolean
    properInputValidation: boolean
    noSensitiveDataExposure: boolean
  }
  
  // 可访问性
  accessibility: {
    followsA11yGuidelines: boolean
    hasProperAriaLabels: boolean
    supportsKeyboardNavigation: boolean
    worksWithScreenReaders: boolean
  }
}

// 2. 性能检查工具
class PerformanceChecker {
  // 检查包大小影响
  static checkBundleSize(): void {
    // 运行 pnpm build 并检查输出
    console.log('Checking bundle size impact...')
    // 比较构建前后的大小差异
  }
  
  // 检查运行时性能
  static checkRuntimePerformance(): void {
    // 运行性能测试
    console.log('Running performance benchmarks...')
  }
  
  // 检查内存使用
  static checkMemoryUsage(): void {
    // 检查是否有内存泄漏
    console.log('Checking for memory leaks...')
  }
}

// 3. 兼容性检查
class CompatibilityChecker {
  // 检查 API 兼容性
  static checkApiCompatibility(): boolean {
    // 检查是否有破坏性变更
    return true
  }
  
  // 检查浏览器兼容性
  static checkBrowserCompatibility(): boolean {
    // 检查新代码是否支持目标浏览器
    return true
  }
  
  // 检查 Vue 版本兼容性
  static checkVueCompatibility(): boolean {
    // 检查是否与支持的 Vue 版本兼容
    return true
  }
}
```

### 4. 协作和沟通

#### 4.1 Issue 讨论参与

```markdown
<!-- 参与 Issue 讨论的最佳实践 -->

## 报告 Bug

### Bug 报告模板

**描述**
简洁明了地描述这个 bug。

**重现步骤**
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
简洁明了地描述你期望发生什么。

**实际行为**
简洁明了地描述实际发生了什么。

**截图**
如果适用，添加截图来帮助解释你的问题。

**环境信息**
- Element Plus 版本: [例如 2.4.0]
- Vue 版本: [例如 3.3.0]
- 浏览器: [例如 Chrome 115]
- 操作系统: [例如 macOS 13.0]

**重现链接**
提供一个最小的重现示例（推荐使用 Element Plus Playground）

**附加信息**
在这里添加关于问题的任何其他信息。
```

#### 4.2 代码审查参与

```typescript
// 代码审查评论指南
interface ReviewComment {
  type: 'suggestion' | 'question' | 'issue' | 'praise'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'functionality' | 'performance' | 'security' | 'style' | 'documentation'
  message: string
  suggestion?: string
  reference?: string
}

// 好的审查评论示例
const goodReviewComments: ReviewComment[] = [
  {
    type: 'suggestion',
    severity: 'medium',
    category: 'performance',
    message: '这里可以使用 computed 来优化性能',
    suggestion: `
// 建议改为：
const buttonClasses = computed(() => ({
  'el-button': true,
  \`el-button--\${props.type}\`: props.type,
  'is-disabled': props.disabled
}))
    `,
    reference: 'https://vuejs.org/guide/essentials/computed.html'
  },
  {
    type: 'issue',
    severity: 'high',
    category: 'functionality',
    message: '这里缺少对 null 值的处理，可能会导致运行时错误',
    suggestion: '建议添加空值检查：if (value != null) { ... }'
  },
  {
    type: 'question',
    severity: 'low',
    category: 'style',
    message: '为什么这里使用 any 类型？是否可以提供更具体的类型？'
  },
  {
    type: 'praise',
    severity: 'low',
    category: 'documentation',
    message: '很好的文档注释，清楚地解释了这个函数的用途和参数！'
  }
]

// 审查评论最佳实践
class ReviewBestPractices {
  // 1. 保持建设性和友善
  static beConstructive(): string {
    return `
    ✅ 好的评论："建议使用 computed 来优化这里的性能，因为..."
    ❌ 不好的评论："这个代码很糟糕"
    `
  }
  
  // 2. 提供具体的建议
  static provideSpecificSuggestions(): string {
    return `
    ✅ 好的评论："建议将这个逻辑提取到一个单独的 composable 中"
    ❌ 不好的评论："这里需要重构"
    `
  }
  
  // 3. 解释原因
  static explainReasoning(): string {
    return `
    ✅ 好的评论："建议使用 ref 而不是 reactive，因为这里只需要一个简单的响应式值"
    ❌ 不好的评论："用 ref"
    `
  }
  
  // 4. 区分重要性
  static categorizeImportance(): string {
    return `
    🔴 Critical: 安全漏洞、功能破坏
    🟡 Important: 性能问题、API 设计
    🔵 Minor: 代码风格、文档改进
    💡 Suggestion: 可选的改进建议
    `
  }
}
```

#### 4.3 社区互动

```typescript
// 社区参与指南
interface CommunityParticipation {
  // Discord/讨论区参与
  discussions: {
    askQuestions: boolean
    helpOthers: boolean
    shareExperience: boolean
    provideFeeback: boolean
  }
  
  // 文档贡献
  documentation: {
    improveExamples: boolean
    fixTypos: boolean
    addTranslations: boolean
    createTutorials: boolean
  }
  
  // 测试和反馈
  testing: {
    testBetaVersions: boolean
    reportBugs: boolean
    validateFixes: boolean
    provideUseCases: boolean
  }
  
  // 推广和教育
  promotion: {
    writeBlogPosts: boolean
    createVideos: boolean
    givePresentation: boolean
    mentorNewcomers: boolean
  }
}

// 社区贡献示例
class CommunityContribution {
  // 1. 帮助新手
  static helpNewcomers(): void {
    const helpfulResponse = `
    欢迎来到 Element Plus 社区！
    
    关于你的问题，这是一个常见的使用场景。你可以这样解决：
    
    \`\`\`vue
    <template>
      <el-button @click="handleClick">
        点击我
      </el-button>
    </template>
    
    <script setup>
    const handleClick = () => {
      // 你的逻辑
    }
    </script>
    \`\`\`
    
    这里有一些相关的文档链接：
    - [Button 组件文档](https://element-plus.org/zh-CN/component/button.html)
    - [事件处理指南](https://vuejs.org/guide/essentials/event-handling.html)
    
    如果还有问题，随时提问！
    `
  }
  
  // 2. 分享最佳实践
  static shareBestPractices(): void {
    const bestPracticePost = `
    # Element Plus 表单验证最佳实践
    
    在使用 Element Plus 进行表单验证时，我发现以下几个技巧很有用：
    
    ## 1. 使用 TypeScript 定义表单数据
    
    \`\`\`typescript
    interface FormData {
      username: string
      email: string
      password: string
    }
    
    const formData = reactive<FormData>({
      username: '',
      email: '',
      password: ''
    })
    \`\`\`
    
    ## 2. 自定义验证规则
    
    \`\`\`typescript
    const validateEmail = (rule: any, value: string, callback: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        callback(new Error('请输入有效的邮箱地址'))
      } else {
        callback()
      }
    }
    \`\`\`
    
    希望这些技巧对大家有帮助！
    `
  }
  
  // 3. 报告和验证 Bug
  static reportBug(): void {
    const bugReport = `
    我在使用 Element Plus 2.4.0 时发现了一个问题：
    
    **问题描述：**
    当 Table 组件的数据为空时，loading 状态无法正确显示。
    
    **重现步骤：**
    1. 创建一个 Table 组件
    2. 设置 data 为空数组
    3. 设置 loading 为 true
    4. loading 指示器不显示
    
    **重现链接：**
    [Element Plus Playground](https://element-plus.run/...)
    
    **环境信息：**
    - Element Plus: 2.4.0
    - Vue: 3.3.4
    - 浏览器: Chrome 115
    
    我已经检查了相关代码，怀疑是 CSS 层级问题。
    `
  }
}
```

### 5. 持续集成和自动化

#### 5.1 CI/CD 流程理解

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [dev]
  pull_request:
    branches: [dev]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Test
        run: pnpm test
      
      - name: Coverage
        run: pnpm test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm build
      
      - name: Size check
        run: pnpm size-check
```

#### 5.2 自动化检查工具

```typescript
// scripts/check-pr.ts
// PR 自动检查脚本

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

interface PRCheckResult {
  passed: boolean
  errors: string[]
  warnings: string[]
}

class PRChecker {
  // 检查提交信息格式
  static checkCommitMessage(): PRCheckResult {
    const result: PRCheckResult = {
      passed: true,
      errors: [],
      warnings: []
    }
    
    try {
      const commitMsg = execSync('git log -1 --pretty=%B', { encoding: 'utf8' })
      const commitRegex = /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .{1,50}/
      
      if (!commitRegex.test(commitMsg.trim())) {
        result.passed = false
        result.errors.push('Commit message does not follow conventional format')
      }
    } catch (error) {
      result.passed = false
      result.errors.push('Failed to check commit message')
    }
    
    return result
  }
  
  // 检查代码覆盖率
  static checkCoverage(): PRCheckResult {
    const result: PRCheckResult = {
      passed: true,
      errors: [],
      warnings: []
    }
    
    try {
      const coverageReport = readFileSync(
        join(process.cwd(), 'coverage/coverage-summary.json'),
        'utf8'
      )
      const coverage = JSON.parse(coverageReport)
      const totalCoverage = coverage.total.lines.pct
      
      if (totalCoverage < 80) {
        result.passed = false
        result.errors.push(`Code coverage is ${totalCoverage}%, minimum required is 80%`)
      } else if (totalCoverage < 90) {
        result.warnings.push(`Code coverage is ${totalCoverage}%, consider improving to 90%+`)
      }
    } catch (error) {
      result.warnings.push('Could not read coverage report')
    }
    
    return result
  }
  
  // 检查包大小影响
  static checkBundleSize(): PRCheckResult {
    const result: PRCheckResult = {
      passed: true,
      errors: [],
      warnings: []
    }
    
    try {
      // 构建并检查包大小
      execSync('pnpm build', { stdio: 'pipe' })
      
      // 这里应该比较构建前后的大小
      // 实际实现需要更复杂的逻辑
      const sizeIncrease = 0 // 计算大小增加
      
      if (sizeIncrease > 50 * 1024) { // 50KB
        result.passed = false
        result.errors.push(`Bundle size increased by ${sizeIncrease} bytes, which exceeds the limit`)
      } else if (sizeIncrease > 10 * 1024) { // 10KB
        result.warnings.push(`Bundle size increased by ${sizeIncrease} bytes`)
      }
    } catch (error) {
      result.warnings.push('Could not check bundle size')
    }
    
    return result
  }
  
  // 运行所有检查
  static runAllChecks(): void {
    const checks = [
      { name: 'Commit Message', check: this.checkCommitMessage },
      { name: 'Code Coverage', check: this.checkCoverage },
      { name: 'Bundle Size', check: this.checkBundleSize }
    ]
    
    let allPassed = true
    const allWarnings: string[] = []
    
    for (const { name, check } of checks) {
      console.log(`\n🔍 Checking ${name}...`)
      const result = check()
      
      if (result.passed) {
        console.log(`✅ ${name} check passed`)
      } else {
        console.log(`❌ ${name} check failed`)
        allPassed = false
      }
      
      result.errors.forEach(error => {
        console.log(`  ❌ ${error}`)
      })
      
      result.warnings.forEach(warning => {
        console.log(`  ⚠️  ${warning}`)
        allWarnings.push(warning)
      })
    }
    
    console.log('\n' + '='.repeat(50))
    
    if (allPassed) {
      console.log('🎉 All checks passed!')
      if (allWarnings.length > 0) {
        console.log(`⚠️  ${allWarnings.length} warning(s) found`)
      }
    } else {
      console.log('💥 Some checks failed!')
      process.exit(1)
    }
  }
}

// 运行检查
PRChecker.runAllChecks()
```

## 实践练习

### 练习 1：修复一个真实的 Bug

1. 在 Element Plus 仓库中找到一个标记为 "good first issue" 的 Bug
2. Fork 仓库并创建修复分支
3. 实现修复并添加测试
4. 提交 Pull Request

### 练习 2：贡献一个小功能

1. 提出一个小的功能改进建议
2. 在 Issue 中讨论可行性
3. 实现功能并完善文档
4. 通过代码审查流程

### 练习 3：改进文档

1. 找到文档中的不足之处
2. 改进示例或添加新的使用场景
3. 确保文档的准确性和完整性
4. 提交文档改进 PR

## 学习资源

* [Element Plus 贡献指南](https://github.com/element-plus/element-plus/blob/dev/.github/CONTRIBUTING.md)
* [Conventional Commits](https://www.conventionalcommits.org/)
* [GitHub Flow](https://guides.github.com/introduction/flow/)
* [Code Review Best Practices](https://google.github.io/eng-practices/review/)

## 作业

1. 完成所有实践练习
2. 参与至少一个 Element Plus 的 Issue 讨论
3. 提交一个文档改进的 Pull Request
4. 学习并实践代码审查技巧

## 下一步学习计划

接下来我们将学习 **Element Plus 测试编写与代码质量保证**，深入了解如何编写高质量的测试用例，确保代码的可靠性和稳定性。