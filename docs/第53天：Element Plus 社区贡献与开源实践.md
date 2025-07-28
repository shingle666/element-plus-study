# 第53天：Element Plus 社区贡献与开源实践

## 学习目标

今天我们将学习如何参与 Element Plus 社区贡献和开源实践，掌握开源项目的贡献流程、代码规范、文档编写和社区建设。

- 理解开源项目的贡献流程和规范
- 掌握代码质量保证和审查流程
- 学习文档编写和维护最佳实践
- 了解社区建设和管理策略
- 实践版本发布和项目维护

## 1. 开源贡献流程

### 1.1 贡献流程管理

```typescript
// packages/contribution/src/core/contribution-manager.ts

export enum ContributionType {
  BUG_FIX = 'bug-fix',
  FEATURE = 'feature',
  DOCUMENTATION = 'documentation',
  REFACTOR = 'refactor',
  PERFORMANCE = 'performance',
  TEST = 'test',
  CHORE = 'chore'
}

export enum ContributionStatus {
  DRAFT = 'draft',
  READY_FOR_REVIEW = 'ready-for-review',
  IN_REVIEW = 'in-review',
  CHANGES_REQUESTED = 'changes-requested',
  APPROVED = 'approved',
  MERGED = 'merged',
  CLOSED = 'closed'
}

export interface Contributor {
  id: string
  username: string
  email: string
  name: string
  avatar: string
  contributions: number
  firstContribution: Date
  lastContribution: Date
  specialties: string[]
  reputation: number
}

export interface Contribution {
  id: string
  type: ContributionType
  status: ContributionStatus
  title: string
  description: string
  contributor: Contributor
  assignees: Contributor[]
  reviewers: Contributor[]
  labels: string[]
  milestone?: string
  branch: string
  commits: string[]
  filesChanged: string[]
  linesAdded: number
  linesDeleted: number
  createdAt: Date
  updatedAt: Date
  mergedAt?: Date
  closedAt?: Date
}

export interface Review {
  id: string
  contributionId: string
  reviewer: Contributor
  status: 'pending' | 'approved' | 'changes-requested' | 'commented'
  comments: ReviewComment[]
  createdAt: Date
  updatedAt: Date
}

export interface ReviewComment {
  id: string
  reviewer: Contributor
  file?: string
  line?: number
  content: string
  type: 'general' | 'inline' | 'suggestion'
  resolved: boolean
  createdAt: Date
}

export class ContributionManager {
  private contributions = new Map<string, Contribution>()
  private contributors = new Map<string, Contributor>()
  private reviews = new Map<string, Review>()
  private webhooks: ContributionWebhook[] = []

  /**
   * 创建贡献
   */
  async createContribution(data: Omit<Contribution, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contribution> {
    const contribution: Contribution = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 验证贡献数据
    this.validateContribution(contribution)

    // 保存贡献
    this.contributions.set(contribution.id, contribution)

    // 更新贡献者统计
    this.updateContributorStats(contribution.contributor.id)

    // 触发 webhook
    await this.triggerWebhooks('contribution:created', contribution)

    return contribution
  }

  /**
   * 更新贡献状态
   */
  async updateContributionStatus(id: string, status: ContributionStatus): Promise<void> {
    const contribution = this.contributions.get(id)
    if (!contribution) {
      throw new Error(`Contribution ${id} not found`)
    }

    const oldStatus = contribution.status
    contribution.status = status
    contribution.updatedAt = new Date()

    if (status === ContributionStatus.MERGED) {
      contribution.mergedAt = new Date()
    } else if (status === ContributionStatus.CLOSED) {
      contribution.closedAt = new Date()
    }

    // 触发状态变更事件
    await this.triggerWebhooks('contribution:status-changed', {
      contribution,
      oldStatus,
      newStatus: status
    })
  }

  /**
   * 分配审查者
   */
  async assignReviewers(contributionId: string, reviewerIds: string[]): Promise<void> {
    const contribution = this.contributions.get(contributionId)
    if (!contribution) {
      throw new Error(`Contribution ${contributionId} not found`)
    }

    const reviewers = reviewerIds.map(id => {
      const reviewer = this.contributors.get(id)
      if (!reviewer) {
        throw new Error(`Reviewer ${id} not found`)
      }
      return reviewer
    })

    contribution.reviewers = reviewers
    contribution.updatedAt = new Date()

    // 创建审查记录
    for (const reviewer of reviewers) {
      const review: Review = {
        id: this.generateId(),
        contributionId,
        reviewer,
        status: 'pending',
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this.reviews.set(review.id, review)
    }

    // 通知审查者
    await this.notifyReviewers(contribution, reviewers)
  }

  /**
   * 提交审查
   */
  async submitReview(reviewId: string, status: Review['status'], comments: Omit<ReviewComment, 'id' | 'createdAt'>[]): Promise<void> {
    const review = this.reviews.get(reviewId)
    if (!review) {
      throw new Error(`Review ${reviewId} not found`)
    }

    review.status = status
    review.updatedAt = new Date()

    // 添加评论
    const reviewComments = comments.map(comment => ({
      ...comment,
      id: this.generateId(),
      createdAt: new Date()
    }))
    review.comments.push(...reviewComments)

    // 检查是否所有审查都完成
    await this.checkReviewCompletion(review.contributionId)

    // 触发审查事件
    await this.triggerWebhooks('review:submitted', review)
  }

  /**
   * 获取贡献统计
   */
  getContributionStats(): {
    total: number
    byType: Record<ContributionType, number>
    byStatus: Record<ContributionStatus, number>
    topContributors: Contributor[]
  } {
    const contributions = Array.from(this.contributions.values())
    
    const byType = contributions.reduce((acc, contribution) => {
      acc[contribution.type] = (acc[contribution.type] || 0) + 1
      return acc
    }, {} as Record<ContributionType, number>)

    const byStatus = contributions.reduce((acc, contribution) => {
      acc[contribution.status] = (acc[contribution.status] || 0) + 1
      return acc
    }, {} as Record<ContributionStatus, number>)

    const topContributors = Array.from(this.contributors.values())
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10)

    return {
      total: contributions.length,
      byType,
      byStatus,
      topContributors
    }
  }

  /**
   * 注册 webhook
   */
  registerWebhook(webhook: ContributionWebhook): void {
    this.webhooks.push(webhook)
  }

  /**
   * 验证贡献
   */
  private validateContribution(contribution: Contribution): void {
    if (!contribution.title || contribution.title.trim().length === 0) {
      throw new Error('Contribution title is required')
    }

    if (!contribution.description || contribution.description.trim().length === 0) {
      throw new Error('Contribution description is required')
    }

    if (!contribution.branch || contribution.branch.trim().length === 0) {
      throw new Error('Contribution branch is required')
    }

    // 验证分支命名规范
    const branchPattern = /^(feature|bugfix|hotfix|docs|refactor|test|chore)\/[a-z0-9-]+$/
    if (!branchPattern.test(contribution.branch)) {
      throw new Error('Branch name does not follow naming convention')
    }
  }

  /**
   * 更新贡献者统计
   */
  private updateContributorStats(contributorId: string): void {
    const contributor = this.contributors.get(contributorId)
    if (contributor) {
      contributor.contributions++
      contributor.lastContribution = new Date()
    }
  }

  /**
   * 检查审查完成状态
   */
  private async checkReviewCompletion(contributionId: string): Promise<void> {
    const contribution = this.contributions.get(contributionId)
    if (!contribution) return

    const reviews = Array.from(this.reviews.values())
      .filter(review => review.contributionId === contributionId)

    const allReviewed = reviews.every(review => review.status !== 'pending')
    const hasChangesRequested = reviews.some(review => review.status === 'changes-requested')
    const allApproved = reviews.every(review => review.status === 'approved')

    if (allReviewed) {
      if (hasChangesRequested) {
        await this.updateContributionStatus(contributionId, ContributionStatus.CHANGES_REQUESTED)
      } else if (allApproved) {
        await this.updateContributionStatus(contributionId, ContributionStatus.APPROVED)
      }
    }
  }

  /**
   * 通知审查者
   */
  private async notifyReviewers(contribution: Contribution, reviewers: Contributor[]): Promise<void> {
    for (const reviewer of reviewers) {
      // 发送通知邮件或消息
      console.log(`Notifying reviewer ${reviewer.username} for contribution ${contribution.title}`)
    }
  }

  /**
   * 触发 webhook
   */
  private async triggerWebhooks(event: string, data: any): Promise<void> {
    for (const webhook of this.webhooks) {
      try {
        await webhook.handle(event, data)
      } catch (error) {
        console.error(`Webhook error for event ${event}:`, error)
      }
    }
  }

  /**
   * 生成 ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

export interface ContributionWebhook {
  handle(event: string, data: any): Promise<void>
}
```

### 1.2 代码质量保证

```typescript
// packages/contribution/src/quality/quality-checker.ts

export interface QualityRule {
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  check(files: FileChange[]): Promise<QualityIssue[]>
}

export interface FileChange {
  path: string
  content: string
  oldContent?: string
  type: 'added' | 'modified' | 'deleted'
}

export interface QualityIssue {
  rule: string
  severity: 'error' | 'warning' | 'info'
  message: string
  file: string
  line?: number
  column?: number
  suggestion?: string
}

export interface QualityReport {
  passed: boolean
  issues: QualityIssue[]
  summary: {
    errors: number
    warnings: number
    infos: number
  }
  coverage?: {
    lines: number
    functions: number
    branches: number
    statements: number
  }
}

export class QualityChecker {
  private rules: QualityRule[] = []

  constructor() {
    this.registerDefaultRules()
  }

  /**
   * 注册质量规则
   */
  registerRule(rule: QualityRule): void {
    this.rules.push(rule)
  }

  /**
   * 检查代码质量
   */
  async checkQuality(files: FileChange[]): Promise<QualityReport> {
    const allIssues: QualityIssue[] = []

    // 运行所有规则
    for (const rule of this.rules) {
      try {
        const issues = await rule.check(files)
        allIssues.push(...issues)
      } catch (error) {
        console.error(`Error running rule ${rule.name}:`, error)
      }
    }

    // 统计问题
    const summary = {
      errors: allIssues.filter(issue => issue.severity === 'error').length,
      warnings: allIssues.filter(issue => issue.severity === 'warning').length,
      infos: allIssues.filter(issue => issue.severity === 'info').length
    }

    // 检查是否通过（没有错误）
    const passed = summary.errors === 0

    return {
      passed,
      issues: allIssues,
      summary
    }
  }

  /**
   * 注册默认规则
   */
  private registerDefaultRules(): void {
    // TypeScript 类型检查规则
    this.registerRule({
      name: 'typescript-types',
      description: 'Check TypeScript type definitions',
      severity: 'error',
      async check(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = []
        
        for (const file of files) {
          if (file.path.endsWith('.ts') || file.path.endsWith('.vue')) {
            // 检查是否有 any 类型
            const anyMatches = file.content.match(/:\s*any\b/g)
            if (anyMatches) {
              issues.push({
                rule: 'typescript-types',
                severity: 'warning',
                message: 'Avoid using "any" type, use specific types instead',
                file: file.path,
                suggestion: 'Define proper TypeScript interfaces or types'
              })
            }

            // 检查是否缺少返回类型
            const functionMatches = file.content.match(/function\s+\w+\([^)]*\)\s*{/g)
            if (functionMatches) {
              issues.push({
                rule: 'typescript-types',
                severity: 'info',
                message: 'Consider adding explicit return types to functions',
                file: file.path,
                suggestion: 'Add return type annotations for better type safety'
              })
            }
          }
        }
        
        return issues
      }
    })

    // 代码风格规则
    this.registerRule({
      name: 'code-style',
      description: 'Check code style consistency',
      severity: 'warning',
      async check(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = []
        
        for (const file of files) {
          const lines = file.content.split('\n')
          
          lines.forEach((line, index) => {
            // 检查行尾空格
            if (line.endsWith(' ') || line.endsWith('\t')) {
              issues.push({
                rule: 'code-style',
                severity: 'warning',
                message: 'Remove trailing whitespace',
                file: file.path,
                line: index + 1,
                suggestion: 'Configure your editor to remove trailing whitespace'
              })
            }

            // 检查过长的行
            if (line.length > 120) {
              issues.push({
                rule: 'code-style',
                severity: 'info',
                message: 'Line too long (>120 characters)',
                file: file.path,
                line: index + 1,
                suggestion: 'Break long lines for better readability'
              })
            }
          })
        }
        
        return issues
      }
    })

    // 测试覆盖率规则
    this.registerRule({
      name: 'test-coverage',
      description: 'Check test coverage for new code',
      severity: 'warning',
      async check(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = []
        
        const sourceFiles = files.filter(file => 
          (file.path.endsWith('.ts') || file.path.endsWith('.vue')) &&
          !file.path.includes('test') &&
          !file.path.includes('spec') &&
          file.type !== 'deleted'
        )

        const testFiles = files.filter(file => 
          (file.path.includes('test') || file.path.includes('spec')) &&
          file.type !== 'deleted'
        )

        // 检查是否有对应的测试文件
        for (const sourceFile of sourceFiles) {
          const baseName = sourceFile.path.replace(/\.(ts|vue)$/, '')
          const hasTest = testFiles.some(testFile => 
            testFile.path.includes(baseName) ||
            testFile.content.includes(baseName)
          )

          if (!hasTest) {
            issues.push({
              rule: 'test-coverage',
              severity: 'warning',
              message: 'Missing tests for new/modified code',
              file: sourceFile.path,
              suggestion: 'Add unit tests to ensure code quality'
            })
          }
        }
        
        return issues
      }
    })

    // 文档规则
    this.registerRule({
      name: 'documentation',
      description: 'Check documentation completeness',
      severity: 'info',
      async check(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = []
        
        for (const file of files) {
          if (file.path.endsWith('.ts') || file.path.endsWith('.vue')) {
            // 检查公共函数是否有 JSDoc 注释
            const exportMatches = file.content.match(/export\s+(function|class|interface|type)\s+\w+/g)
            if (exportMatches) {
              const hasJSDoc = file.content.includes('/**')
              if (!hasJSDoc) {
                issues.push({
                  rule: 'documentation',
                  severity: 'info',
                  message: 'Consider adding JSDoc comments for exported functions/classes',
                  file: file.path,
                  suggestion: 'Add JSDoc comments to improve code documentation'
                })
              }
            }
          }
        }
        
        return issues
      }
    })

    // 安全性规则
    this.registerRule({
      name: 'security',
      description: 'Check for potential security issues',
      severity: 'error',
      async check(files: FileChange[]): Promise<QualityIssue[]> {
        const issues: QualityIssue[] = []
        
        for (const file of files) {
          // 检查是否有硬编码的敏感信息
          const sensitivePatterns = [
            /password\s*=\s*['"][^'"]+['"]/i,
            /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
            /secret\s*=\s*['"][^'"]+['"]/i,
            /token\s*=\s*['"][^'"]+['"]/i
          ]

          for (const pattern of sensitivePatterns) {
            if (pattern.test(file.content)) {
              issues.push({
                rule: 'security',
                severity: 'error',
                message: 'Potential hardcoded sensitive information detected',
                file: file.path,
                suggestion: 'Use environment variables or secure configuration'
              })
            }
          }

          // 检查是否使用了不安全的函数
          const unsafeFunctions = ['eval', 'innerHTML', 'document.write']
          for (const func of unsafeFunctions) {
            if (file.content.includes(func)) {
              issues.push({
                rule: 'security',
                severity: 'warning',
                message: `Potentially unsafe function "${func}" detected`,
                file: file.path,
                suggestion: 'Use safer alternatives to prevent security vulnerabilities'
              })
            }
          }
        }
        
        return issues
      }
    })
  }
}
```

## 2. 文档编写和维护

### 2.1 文档管理系统

```typescript
// packages/documentation/src/core/doc-manager.ts

export interface DocumentationSection {
  id: string
  title: string
  content: string
  type: 'guide' | 'api' | 'example' | 'tutorial' | 'reference'
  category: string
  tags: string[]
  author: string
  lastUpdated: Date
  version: string
  status: 'draft' | 'review' | 'published' | 'deprecated'
  translations: Record<string, string>
}

export interface APIDocumentation {
  component: string
  description: string
  props: PropertyDoc[]
  events: EventDoc[]
  slots: SlotDoc[]
  methods: MethodDoc[]
  examples: ExampleDoc[]
}

export interface PropertyDoc {
  name: string
  type: string
  description: string
  default?: any
  required: boolean
  validator?: string
  version?: string
}

export interface EventDoc {
  name: string
  description: string
  parameters: ParameterDoc[]
  version?: string
}

export interface SlotDoc {
  name: string
  description: string
  bindings?: ParameterDoc[]
  version?: string
}

export interface MethodDoc {
  name: string
  description: string
  parameters: ParameterDoc[]
  returns: {
    type: string
    description: string
  }
  version?: string
}

export interface ParameterDoc {
  name: string
  type: string
  description: string
  required: boolean
  default?: any
}

export interface ExampleDoc {
  title: string
  description: string
  code: string
  language: string
  live?: boolean
}

export class DocumentationManager {
  private sections = new Map<string, DocumentationSection>()
  private apiDocs = new Map<string, APIDocumentation>()
  private generators: DocumentationGenerator[] = []

  /**
   * 添加文档章节
   */
  addSection(section: DocumentationSection): void {
    this.sections.set(section.id, section)
  }

  /**
   * 更新文档章节
   */
  updateSection(id: string, updates: Partial<DocumentationSection>): void {
    const section = this.sections.get(id)
    if (section) {
      Object.assign(section, updates, { lastUpdated: new Date() })
    }
  }

  /**
   * 生成 API 文档
   */
  async generateAPIDocumentation(componentPath: string): Promise<APIDocumentation> {
    const generator = this.generators.find(g => g.canHandle(componentPath))
    if (!generator) {
      throw new Error(`No generator found for ${componentPath}`)
    }

    const apiDoc = await generator.generate(componentPath)
    this.apiDocs.set(componentPath, apiDoc)
    return apiDoc
  }

  /**
   * 验证文档完整性
   */
  validateDocumentation(): DocumentationValidationResult {
    const issues: DocumentationIssue[] = []
    const sections = Array.from(this.sections.values())

    // 检查必需的章节
    const requiredSections = ['getting-started', 'installation', 'basic-usage']
    for (const required of requiredSections) {
      if (!sections.some(section => section.id === required)) {
        issues.push({
          type: 'missing-section',
          severity: 'error',
          message: `Missing required section: ${required}`
        })
      }
    }

    // 检查过期文档
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    for (const section of sections) {
      if (section.lastUpdated < sixMonthsAgo && section.status === 'published') {
        issues.push({
          type: 'outdated',
          severity: 'warning',
          message: `Section "${section.title}" hasn't been updated in 6+ months`,
          section: section.id
        })
      }
    }

    // 检查 API 文档完整性
    for (const [component, apiDoc] of this.apiDocs) {
      if (!apiDoc.description || apiDoc.description.trim().length === 0) {
        issues.push({
          type: 'missing-description',
          severity: 'warning',
          message: `Component "${component}" is missing description`,
          component
        })
      }

      if (apiDoc.examples.length === 0) {
        issues.push({
          type: 'missing-examples',
          severity: 'info',
          message: `Component "${component}" has no examples`,
          component
        })
      }
    }

    return {
      valid: issues.filter(issue => issue.severity === 'error').length === 0,
      issues
    }
  }

  /**
   * 生成文档站点
   */
  async generateSite(outputPath: string): Promise<void> {
    const siteGenerator = new DocumentationSiteGenerator()
    
    const siteData = {
      sections: Array.from(this.sections.values()),
      apiDocs: Array.from(this.apiDocs.values()),
      navigation: this.generateNavigation(),
      searchIndex: this.generateSearchIndex()
    }

    await siteGenerator.generate(siteData, outputPath)
  }

  /**
   * 注册文档生成器
   */
  registerGenerator(generator: DocumentationGenerator): void {
    this.generators.push(generator)
  }

  /**
   * 生成导航结构
   */
  private generateNavigation(): NavigationItem[] {
    const sections = Array.from(this.sections.values())
      .filter(section => section.status === 'published')
      .sort((a, b) => a.title.localeCompare(b.title))

    const navigation: NavigationItem[] = []
    const categories = new Map<string, NavigationItem>()

    for (const section of sections) {
      if (!categories.has(section.category)) {
        const categoryItem: NavigationItem = {
          title: section.category,
          children: []
        }
        categories.set(section.category, categoryItem)
        navigation.push(categoryItem)
      }

      const categoryItem = categories.get(section.category)!
      categoryItem.children!.push({
        title: section.title,
        path: `/docs/${section.id}`,
        type: section.type
      })
    }

    return navigation
  }

  /**
   * 生成搜索索引
   */
  private generateSearchIndex(): SearchIndexItem[] {
    const index: SearchIndexItem[] = []
    
    // 索引文档章节
    for (const section of this.sections.values()) {
      if (section.status === 'published') {
        index.push({
          id: section.id,
          title: section.title,
          content: section.content,
          type: 'section',
          category: section.category,
          tags: section.tags,
          path: `/docs/${section.id}`
        })
      }
    }

    // 索引 API 文档
    for (const [component, apiDoc] of this.apiDocs) {
      index.push({
        id: component,
        title: component,
        content: apiDoc.description,
        type: 'component',
        category: 'API',
        tags: [],
        path: `/components/${component}`
      })
    }

    return index
  }
}

export interface DocumentationGenerator {
  canHandle(path: string): boolean
  generate(path: string): Promise<APIDocumentation>
}

export interface DocumentationIssue {
  type: string
  severity: 'error' | 'warning' | 'info'
  message: string
  section?: string
  component?: string
}

export interface DocumentationValidationResult {
  valid: boolean
  issues: DocumentationIssue[]
}

export interface NavigationItem {
  title: string
  path?: string
  type?: string
  children?: NavigationItem[]
}

export interface SearchIndexItem {
  id: string
  title: string
  content: string
  type: string
  category: string
  tags: string[]
  path: string
}

export class DocumentationSiteGenerator {
  async generate(data: any, outputPath: string): Promise<void> {
    // 实现文档站点生成逻辑
    console.log(`Generating documentation site to ${outputPath}`)
  }
}
```

### 2.2 Vue 组件文档生成器

```typescript
// packages/documentation/src/generators/vue-doc-generator.ts
import { parse } from '@vue/compiler-sfc'
import * as ts from 'typescript'
import type { DocumentationGenerator, APIDocumentation, PropertyDoc, EventDoc, SlotDoc, MethodDoc } from '../core/doc-manager'

export class VueDocumentationGenerator implements DocumentationGenerator {
  /**
   * 检查是否可以处理该文件
   */
  canHandle(path: string): boolean {
    return path.endsWith('.vue')
  }

  /**
   * 生成 Vue 组件文档
   */
  async generate(path: string): Promise<APIDocumentation> {
    const fs = await import('fs/promises')
    const content = await fs.readFile(path, 'utf-8')
    
    const { descriptor } = parse(content)
    
    const props = this.extractProps(descriptor.script?.content || '')
    const events = this.extractEvents(descriptor.script?.content || '')
    const slots = this.extractSlots(descriptor.template?.content || '')
    const methods = this.extractMethods(descriptor.script?.content || '')
    const examples = await this.generateExamples(path)
    
    const componentName = this.extractComponentName(path)
    const description = this.extractDescription(descriptor.script?.content || '')

    return {
      component: componentName,
      description,
      props,
      events,
      slots,
      methods,
      examples
    }
  }

  /**
   * 提取组件属性
   */
  private extractProps(scriptContent: string): PropertyDoc[] {
    const props: PropertyDoc[] = []
    
    // 解析 TypeScript 代码
    const sourceFile = ts.createSourceFile(
      'component.ts',
      scriptContent,
      ts.ScriptTarget.Latest,
      true
    )

    // 查找 props 定义
    const visit = (node: ts.Node) => {
      if (ts.isPropertyAssignment(node) && 
          ts.isIdentifier(node.name) && 
          node.name.text === 'props') {
        
        if (ts.isObjectLiteralExpression(node.initializer)) {
          for (const prop of node.initializer.properties) {
            if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
              const propDoc = this.parsePropDefinition(prop)
              if (propDoc) {
                props.push(propDoc)
              }
            }
          }
        }
      }
      
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return props
  }

  /**
   * 解析属性定义
   */
  private parsePropDefinition(prop: ts.PropertyAssignment): PropertyDoc | null {
    if (!ts.isIdentifier(prop.name)) return null
    
    const name = prop.name.text
    let type = 'any'
    let description = ''
    let defaultValue: any = undefined
    let required = false
    
    if (ts.isObjectLiteralExpression(prop.initializer)) {
      for (const property of prop.initializer.properties) {
        if (ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)) {
          const propertyName = property.name.text
          
          switch (propertyName) {
            case 'type':
              type = this.extractType(property.initializer)
              break
            case 'default':
              defaultValue = this.extractDefaultValue(property.initializer)
              break
            case 'required':
              required = this.extractBooleanValue(property.initializer)
              break
          }
        }
      }
    }
    
    // 提取 JSDoc 注释
    const jsDocComment = this.extractJSDocComment(prop)
    if (jsDocComment) {
      description = jsDocComment.description || ''
    }

    return {
      name,
      type,
      description,
      default: defaultValue,
      required
    }
  }

  /**
   * 提取事件
   */
  private extractEvents(scriptContent: string): EventDoc[] {
    const events: EventDoc[] = []
    
    // 查找 emit 调用
    const emitPattern = /emit\s*\(\s*['"]([^'"]+)['"]([^)]*)?\)/g
    let match
    
    while ((match = emitPattern.exec(scriptContent)) !== null) {
      const eventName = match[1]
      const parametersStr = match[2] || ''
      
      if (!events.some(e => e.name === eventName)) {
        events.push({
          name: eventName,
          description: `Emitted when ${eventName} occurs`,
          parameters: this.parseEventParameters(parametersStr)
        })
      }
    }
    
    return events
  }

  /**
   * 提取插槽
   */
  private extractSlots(templateContent: string): SlotDoc[] {
    const slots: SlotDoc[] = []
    
    // 查找 slot 标签
    const slotPattern = /<slot\s+(?:name=['"]([^'"]+)['"])?[^>]*>/g
    let match
    
    while ((match = slotPattern.exec(templateContent)) !== null) {
      const slotName = match[1] || 'default'
      
      if (!slots.some(s => s.name === slotName)) {
        slots.push({
          name: slotName,
          description: `${slotName} slot`,
          bindings: []
        })
      }
    }
    
    return slots
  }

  /**
   * 提取方法
   */
  private extractMethods(scriptContent: string): MethodDoc[] {
    const methods: MethodDoc[] = []
    
    // 解析 TypeScript 代码查找导出的方法
    const sourceFile = ts.createSourceFile(
      'component.ts',
      scriptContent,
      ts.ScriptTarget.Latest,
      true
    )

    const visit = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const method = this.parseMethodDefinition(node)
        if (method) {
          methods.push(method)
        }
      }
      
      ts.forEachChild(node, visit)
    }

    visit(sourceFile)
    return methods
  }

  /**
   * 生成示例
   */
  private async generateExamples(componentPath: string): Promise<any[]> {
    // 查找同目录下的示例文件
    const examplesPath = componentPath.replace('.vue', '.examples.ts')
    
    try {
      const fs = await import('fs/promises')
      const examplesContent = await fs.readFile(examplesPath, 'utf-8')
      return this.parseExamples(examplesContent)
    } catch {
      return []
    }
  }

  /**
   * 提取组件名称
   */
  private extractComponentName(path: string): string {
    const fileName = path.split('/').pop() || ''
    return fileName.replace('.vue', '')
  }

  /**
   * 提取描述
   */
  private extractDescription(scriptContent: string): string {
    // 查找文件顶部的注释
    const commentPattern = /\/\*\*([\s\S]*?)\*\//
    const match = commentPattern.exec(scriptContent)
    
    if (match) {
      return match[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, ''))
        .join('\n')
        .trim()
    }
    
    return ''
  }

  /**
   * 提取类型
   */
  private extractType(node: ts.Node): string {
    if (ts.isIdentifier(node)) {
      return node.text
    }
    if (ts.isArrayLiteralExpression(node)) {
      return node.elements.map(el => this.extractType(el)).join(' | ')
    }
    return 'any'
  }

  /**
   * 提取默认值
   */
  private extractDefaultValue(node: ts.Node): any {
    if (ts.isStringLiteral(node)) {
      return node.text
    }
    if (ts.isNumericLiteral(node)) {
      return Number(node.text)
    }
    if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return true
    }
    if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return false
    }
    return undefined
  }

  /**
   * 提取布尔值
   */
  private extractBooleanValue(node: ts.Node): boolean {
    return node.kind === ts.SyntaxKind.TrueKeyword
  }

  /**
   * 提取 JSDoc 注释
   */
  private extractJSDocComment(node: ts.Node): { description?: string } | null {
    // 简化实现，实际需要解析 JSDoc
    return null
  }

  /**
   * 解析事件参数
   */
  private parseEventParameters(parametersStr: string): any[] {
    // 简化实现
    return []
  }

  /**
   * 解析方法定义
   */
  private parseMethodDefinition(node: ts.FunctionDeclaration): MethodDoc | null {
    if (!node.name) return null
    
    return {
      name: node.name.text,
      description: '',
      parameters: [],
      returns: {
        type: 'void',
        description: ''
      }
    }
  }

  /**
   * 解析示例
   */
  private parseExamples(content: string): any[] {
    // 简化实现
    return []
  }
}
```

## 3. 实践练习

### 练习1：贡献流程
```typescript
// 实现完整的贡献流程
// 1. Fork 项目并创建分支
// 2. 实现功能或修复 bug
// 3. 编写测试和文档
// 4. 提交 Pull Request
```

### 练习2：代码质量
```typescript
// 建立代码质量保证体系
// 1. 配置 ESLint 和 Prettier
// 2. 设置 Git hooks
// 3. 实现自动化测试
// 4. 配置 CI/CD 流程
```

### 练习3：文档编写
```markdown
<!-- 编写高质量文档 -->
<!-- 1. 组件 API 文档 -->
<!-- 2. 使用指南和教程 -->
<!-- 3. 最佳实践文档 -->
<!-- 4. 故障排除指南 -->
```

### 练习4：社区建设
```typescript
// 参与社区建设
// 1. 回答社区问题
// 2. 审查他人的 PR
// 3. 提出改进建议
// 4. 组织技术分享
```

## 学习资源

### 开源贡献
- [GitHub 开源指南](https://opensource.guide/zh-hans/)
- [如何参与开源项目](https://github.com/firstcontributions/first-contributions)
- [开源贡献最佳实践](https://docs.github.com/en/communities)

### 代码质量
- [ESLint 官方文档](https://eslint.org/)
- [Prettier 官方文档](https://prettier.io/)
- [Husky Git Hooks](https://typicode.github.io/husky/)

### 文档工具
- [VitePress 官方文档](https://vitepress.dev/)
- [Storybook 官方文档](https://storybook.js.org/)
- [JSDoc 官方文档](https://jsdoc.app/)

## 作业

1. **贡献实践**：向 Element Plus 或其他开源项目提交一个 Pull Request
2. **质量工具**：为项目配置完整的代码质量检查工具链
3. **文档编写**：为自己的组件编写完整的 API 文档和使用指南
4. **社区参与**：在开源社区中回答问题或参与讨论
5. **流程优化**：设计并实现一套开源项目的贡献流程

## 下一步学习

明天我们将学习「Element Plus 未来发展趋势与技术展望」，包括：
- Vue 生态系统发展趋势
- 前端技术发展方向
- Element Plus 路线图
- 新兴技术集成
- 职业发展规划

## 总结

今天我们深入学习了 Element Plus 社区贡献与开源实践：

1. **贡献流程**：掌握了完整的开源项目贡献流程和管理系统
2. **代码质量**：学习了代码质量保证的工具和最佳实践
3. **文档系统**：实现了自动化的文档生成和管理系统
4. **社区建设**：了解了开源社区的建设和维护策略
5. **最佳实践**：掌握了开源项目的各种最佳实践

通过这些学习，你现在能够：
- 有效参与开源项目的贡献
- 建立完善的代码质量保证体系
- 编写和维护高质量的技术文档
- 参与开源社区的建设和管理
- 遵循开源项目的最佳实践