# 第76天：Element Plus 迁移工具使用与实践

## 学习目标

* 掌握 Element Plus 官方迁移工具的使用方法
* 了解从 Element UI 到 Element Plus 的迁移策略
* 学习版本升级和代码重构的最佳实践
* 实现自动化迁移和手动优化的结合

## 知识点概览

### 1. 迁移工具概述

#### 1.1 Element Plus 迁移背景

```typescript
// 迁移原因分析
interface MigrationReason {
  // Vue 3 兼容性
  vue3Compatibility: {
    compositionAPI: boolean
    reactivitySystem: boolean
    performanceImprovement: boolean
  }
  
  // TypeScript 支持
  typescriptSupport: {
    betterTypeInference: boolean
    strictTypeChecking: boolean
    intellisenseImprovement: boolean
  }
  
  // 现代化特性
  modernFeatures: {
    treeShaking: boolean
    esModules: boolean
    viteSupport: boolean
  }
  
  // 维护状态
  maintenanceStatus: {
    activeDevelopment: boolean
    bugFixes: boolean
    newFeatures: boolean
  }
}

// 迁移挑战
interface MigrationChallenges {
  // 破坏性变更
  breakingChanges: {
    componentAPI: string[]
    propNames: string[]
    eventNames: string[]
    slotNames: string[]
  }
  
  // 依赖更新
  dependencyUpdates: {
    vue: string
    vueRouter: string
    vuex: string
    otherLibraries: string[]
  }
  
  // 构建工具
  buildTools: {
    webpack: boolean
    vite: boolean
    rollup: boolean
  }
}
```

#### 1.2 迁移工具生态

```typescript
// 官方迁移工具
interface OfficialMigrationTools {
  // Element Plus 迁移助手
  elementPlusMigrator: {
    name: '@element-plus/migration'
    features: [
      'component-name-migration',
      'prop-name-migration', 
      'event-name-migration',
      'import-statement-migration'
    ]
    usage: 'npx @element-plus/migration'
  }
  
  // Vue 3 迁移构建
  vue3MigrationBuild: {
    name: '@vue/compat'
    purpose: 'Vue 2 兼容模式'
    features: [
      'compatibility-mode',
      'migration-warnings',
      'gradual-migration'
    ]
  }
}

// 第三方工具
interface ThirdPartyTools {
  // AST 转换工具
  astTransformers: {
    jscodeshift: {
      purpose: 'JavaScript 代码转换'
      elementPlusCodemods: string[]
    }
    
    babel: {
      purpose: 'Babel 插件转换'
      plugins: string[]
    }
  }
  
  // 静态分析工具
  staticAnalysis: {
    eslint: {
      rules: 'element-plus/recommended'
      customRules: string[]
    }
    
    typescript: {
      strictMode: boolean
      typeChecking: boolean
    }
  }
}
```

### 2. 自动化迁移工具

#### 2.1 Element Plus 官方迁移工具

```bash
# 安装迁移工具
npm install -g @element-plus/migration

# 或者直接使用 npx
npx @element-plus/migration

# 指定项目目录
npx @element-plus/migration --src ./src

# 指定文件类型
npx @element-plus/migration --src ./src --ext .vue,.js,.ts

# 预览模式（不实际修改文件）
npx @element-plus/migration --src ./src --dry-run

# 生成迁移报告
npx @element-plus/migration --src ./src --report
```

#### 2.2 自定义迁移脚本

```typescript
// migration/migrator.ts
import { Project, SourceFile, SyntaxKind } from 'ts-morph'
import { glob } from 'glob'
import path from 'path'
import fs from 'fs'

// 迁移配置
interface MigrationConfig {
  // 源码目录
  sourceDir: string
  
  // 文件扩展名
  extensions: string[]
  
  // 排除目录
  excludeDirs: string[]
  
  // 迁移规则
  rules: MigrationRule[]
  
  // 输出选项
  output: {
    backup: boolean
    report: boolean
    dryRun: boolean
  }
}

// 迁移规则接口
interface MigrationRule {
  name: string
  description: string
  transform: (sourceFile: SourceFile) => void
  validate?: (sourceFile: SourceFile) => string[]
}

// Element Plus 迁移器
class ElementPlusMigrator {
  private project: Project
  private config: MigrationConfig
  private migrationReport: MigrationReport
  
  constructor(config: MigrationConfig) {
    this.config = config
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json'
    })
    this.migrationReport = {
      totalFiles: 0,
      processedFiles: 0,
      errors: [],
      warnings: [],
      changes: []
    }
  }
  
  // 执行迁移
  async migrate(): Promise<MigrationReport> {
    console.log('🚀 开始 Element Plus 迁移...')
    
    try {
      // 1. 扫描文件
      const files = await this.scanFiles()
      this.migrationReport.totalFiles = files.length
      
      // 2. 备份文件
      if (this.config.output.backup) {
        await this.createBackup(files)
      }
      
      // 3. 处理文件
      for (const filePath of files) {
        await this.processFile(filePath)
      }
      
      // 4. 保存更改
      if (!this.config.output.dryRun) {
        await this.project.save()
      }
      
      // 5. 生成报告
      if (this.config.output.report) {
        await this.generateReport()
      }
      
      console.log('✅ 迁移完成！')
      return this.migrationReport
      
    } catch (error) {
      console.error('❌ 迁移失败:', error)
      throw error
    }
  }
  
  // 扫描文件
  private async scanFiles(): Promise<string[]> {
    const patterns = this.config.extensions.map(ext => 
      `${this.config.sourceDir}/**/*${ext}`
    )
    
    const files: string[] = []
    
    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        ignore: this.config.excludeDirs.map(dir => `${dir}/**`)
      })
      files.push(...matches)
    }
    
    return [...new Set(files)] // 去重
  }
  
  // 创建备份
  private async createBackup(files: string[]): Promise<void> {
    const backupDir = `backup-${Date.now()}`
    
    for (const filePath of files) {
      const backupPath = path.join(backupDir, filePath)
      const backupDirPath = path.dirname(backupPath)
      
      await fs.promises.mkdir(backupDirPath, { recursive: true })
      await fs.promises.copyFile(filePath, backupPath)
    }
    
    console.log(`📦 备份已创建: ${backupDir}`)
  }
  
  // 处理单个文件
  private async processFile(filePath: string): Promise<void> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath)
      const originalText = sourceFile.getFullText()
      
      // 应用迁移规则
      for (const rule of this.config.rules) {
        try {
          rule.transform(sourceFile)
          
          // 验证规则
          if (rule.validate) {
            const warnings = rule.validate(sourceFile)
            this.migrationReport.warnings.push(...warnings.map(warning => ({
              file: filePath,
              rule: rule.name,
              message: warning
            })))
          }
          
        } catch (error) {
          this.migrationReport.errors.push({
            file: filePath,
            rule: rule.name,
            error: error instanceof Error ? error.message : String(error)
          })
        }
      }
      
      // 记录变更
      const newText = sourceFile.getFullText()
      if (originalText !== newText) {
        this.migrationReport.changes.push({
          file: filePath,
          type: 'modified'
        })
      }
      
      this.migrationReport.processedFiles++
      
    } catch (error) {
      this.migrationReport.errors.push({
        file: filePath,
        rule: 'file-processing',
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }
  
  // 生成迁移报告
  private async generateReport(): Promise<void> {
    const reportPath = `migration-report-${Date.now()}.json`
    await fs.promises.writeFile(
      reportPath,
      JSON.stringify(this.migrationReport, null, 2)
    )
    
    console.log(`📊 迁移报告已生成: ${reportPath}`)
  }
}

// 迁移报告接口
interface MigrationReport {
  totalFiles: number
  processedFiles: number
  errors: Array<{
    file: string
    rule: string
    error: string
  }>
  warnings: Array<{
    file: string
    rule: string
    message: string
  }>
  changes: Array<{
    file: string
    type: 'modified' | 'created' | 'deleted'
  }>
}
```

#### 2.3 具体迁移规则实现

```typescript
// migration/rules.ts
import { SourceFile, SyntaxKind, Node } from 'ts-morph'

// 组件名称迁移规则
export const componentNameMigrationRule: MigrationRule = {
  name: 'component-name-migration',
  description: '迁移组件名称从 el- 到 ElXxx',
  
  transform: (sourceFile: SourceFile) => {
    // 组件名称映射
    const componentNameMap = new Map([
      ['el-button', 'ElButton'],
      ['el-input', 'ElInput'],
      ['el-form', 'ElForm'],
      ['el-form-item', 'ElFormItem'],
      ['el-table', 'ElTable'],
      ['el-table-column', 'ElTableColumn'],
      ['el-dialog', 'ElDialog'],
      ['el-message-box', 'ElMessageBox'],
      // ... 更多映射
    ])
    
    // 处理 Vue 模板中的组件标签
    const templateBlocks = sourceFile.getDescendantsOfKind(SyntaxKind.TemplateExpression)
    
    templateBlocks.forEach(block => {
      let content = block.getFullText()
      
      componentNameMap.forEach((newName, oldName) => {
        // 替换开始标签
        content = content.replace(
          new RegExp(`<${oldName}\\b`, 'g'),
          `<${newName}`
        )
        
        // 替换结束标签
        content = content.replace(
          new RegExp(`</${oldName}>`, 'g'),
          `</${newName}>`
        )
        
        // 替换自闭合标签
        content = content.replace(
          new RegExp(`<${oldName}\\s*/>`, 'g'),
          `<${newName} />`
        )
      })
      
      block.replaceWithText(content)
    })
  },
  
  validate: (sourceFile: SourceFile) => {
    const warnings: string[] = []
    const content = sourceFile.getFullText()
    
    // 检查是否还有未迁移的 el- 组件
    const elComponentRegex = /<el-[a-z-]+/g
    const matches = content.match(elComponentRegex)
    
    if (matches) {
      warnings.push(`发现未迁移的组件: ${matches.join(', ')}`)
    }
    
    return warnings
  }
}

// 导入语句迁移规则
export const importMigrationRule: MigrationRule = {
  name: 'import-migration',
  description: '迁移导入语句从 element-ui 到 element-plus',
  
  transform: (sourceFile: SourceFile) => {
    const importDeclarations = sourceFile.getImportDeclarations()
    
    importDeclarations.forEach(importDecl => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue()
      
      // 替换 element-ui 导入
      if (moduleSpecifier === 'element-ui') {
        importDecl.setModuleSpecifier('element-plus')
      }
      
      // 替换样式导入
      if (moduleSpecifier.includes('element-ui/lib/theme-chalk')) {
        const newPath = moduleSpecifier.replace(
          'element-ui/lib/theme-chalk',
          'element-plus/dist/index.css'
        )
        importDecl.setModuleSpecifier(newPath)
      }
      
      // 替换按需导入
      if (moduleSpecifier.startsWith('element-ui/lib/')) {
        const componentName = moduleSpecifier.replace('element-ui/lib/', '')
        const newPath = `element-plus/es/components/${componentName}`
        importDecl.setModuleSpecifier(newPath)
      }
    })
  }
}

// 属性名称迁移规则
export const propMigrationRule: MigrationRule = {
  name: 'prop-migration',
  description: '迁移组件属性名称',
  
  transform: (sourceFile: SourceFile) => {
    // 属性名称映射
    const propNameMap = new Map([
      ['append-to-body', 'teleported'],
      ['custom-class', 'class'],
      ['popper-class', 'popper-class'],
      // ... 更多映射
    ])
    
    let content = sourceFile.getFullText()
    
    propNameMap.forEach((newProp, oldProp) => {
      // 替换属性名
      content = content.replace(
        new RegExp(`\\b${oldProp}=`, 'g'),
        `${newProp}=`
      )
      
      // 替换 v-bind 属性
      content = content.replace(
        new RegExp(`:${oldProp}=`, 'g'),
        `:${newProp}=`
      )
    })
    
    sourceFile.replaceWithText(content)
  }
}

// 事件名称迁移规则
export const eventMigrationRule: MigrationRule = {
  name: 'event-migration',
  description: '迁移事件名称',
  
  transform: (sourceFile: SourceFile) => {
    // 事件名称映射
    const eventNameMap = new Map([
      ['@on-change', '@change'],
      ['@on-input', '@input'],
      ['@on-focus', '@focus'],
      ['@on-blur', '@blur'],
      // ... 更多映射
    ])
    
    let content = sourceFile.getFullText()
    
    eventNameMap.forEach((newEvent, oldEvent) => {
      content = content.replace(
        new RegExp(`\\${oldEvent}=`, 'g'),
        `${newEvent}=`
      )
    })
    
    sourceFile.replaceWithText(content)
  }
}

// 样式类名迁移规则
export const styleMigrationRule: MigrationRule = {
  name: 'style-migration',
  description: '迁移样式类名和变量',
  
  transform: (sourceFile: SourceFile) => {
    let content = sourceFile.getFullText()
    
    // CSS 变量迁移
    const cssVariableMap = new Map([
      ['--color-primary', '--el-color-primary'],
      ['--color-success', '--el-color-success'],
      ['--color-warning', '--el-color-warning'],
      ['--color-danger', '--el-color-danger'],
      ['--color-info', '--el-color-info'],
      // ... 更多映射
    ])
    
    cssVariableMap.forEach((newVar, oldVar) => {
      content = content.replace(
        new RegExp(`\\${oldVar}\\b`, 'g'),
        newVar
      )
    })
    
    // SCSS 变量迁移
    const scssVariableMap = new Map([
      ['$--color-primary', '$el-color-primary'],
      ['$--font-size-base', '$el-font-size-base'],
      ['$--border-radius-base', '$el-border-radius-base'],
      // ... 更多映射
    ])
    
    scssVariableMap.forEach((newVar, oldVar) => {
      content = content.replace(
        new RegExp(`\\${oldVar}\\b`, 'g'),
        newVar
      )
    })
    
    sourceFile.replaceWithText(content)
  }
}
```

### 3. 手动迁移策略

#### 3.1 分阶段迁移计划

```typescript
// migration/strategy.ts

// 迁移阶段定义
interface MigrationPhase {
  name: string
  description: string
  tasks: MigrationTask[]
  dependencies: string[]
  estimatedTime: string
  riskLevel: 'low' | 'medium' | 'high'
}

// 迁移任务
interface MigrationTask {
  id: string
  title: string
  description: string
  type: 'automatic' | 'manual' | 'verification'
  priority: 'high' | 'medium' | 'low'
  assignee?: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  checklist: string[]
}

// Element Plus 迁移策略
class MigrationStrategy {
  private phases: MigrationPhase[] = [
    {
      name: 'preparation',
      description: '迁移准备阶段',
      dependencies: [],
      estimatedTime: '1-2 天',
      riskLevel: 'low',
      tasks: [
        {
          id: 'prep-001',
          title: '项目备份',
          description: '创建完整的项目备份',
          type: 'manual',
          priority: 'high',
          status: 'pending',
          checklist: [
            '创建 Git 分支',
            '备份 node_modules',
            '备份配置文件',
            '记录当前版本信息'
          ]
        },
        {
          id: 'prep-002',
          title: '依赖分析',
          description: '分析项目依赖和兼容性',
          type: 'manual',
          priority: 'high',
          status: 'pending',
          checklist: [
            '检查 Vue 版本',
            '检查第三方组件库',
            '检查构建工具版本',
            '识别潜在冲突'
          ]
        },
        {
          id: 'prep-003',
          title: '测试环境准备',
          description: '准备迁移测试环境',
          type: 'manual',
          priority: 'medium',
          status: 'pending',
          checklist: [
            '搭建测试环境',
            '准备测试数据',
            '配置 CI/CD',
            '准备回滚方案'
          ]
        }
      ]
    },
    
    {
      name: 'core-migration',
      description: '核心迁移阶段',
      dependencies: ['preparation'],
      estimatedTime: '3-5 天',
      riskLevel: 'high',
      tasks: [
        {
          id: 'core-001',
          title: 'Vue 3 升级',
          description: '升级 Vue 到 3.x 版本',
          type: 'manual',
          priority: 'high',
          status: 'pending',
          checklist: [
            '更新 package.json',
            '更新构建配置',
            '修复 API 变更',
            '测试基础功能'
          ]
        },
        {
          id: 'core-002',
          title: 'Element Plus 安装',
          description: '安装和配置 Element Plus',
          type: 'automatic',
          priority: 'high',
          status: 'pending',
          checklist: [
            '卸载 element-ui',
            '安装 element-plus',
            '更新导入语句',
            '配置按需加载'
          ]
        },
        {
          id: 'core-003',
          title: '组件迁移',
          description: '迁移所有 Element 组件',
          type: 'automatic',
          priority: 'high',
          status: 'pending',
          checklist: [
            '运行自动迁移工具',
            '检查迁移结果',
            '手动修复问题',
            '验证组件功能'
          ]
        }
      ]
    },
    
    {
      name: 'optimization',
      description: '优化和完善阶段',
      dependencies: ['core-migration'],
      estimatedTime: '2-3 天',
      riskLevel: 'medium',
      tasks: [
        {
          id: 'opt-001',
          title: '性能优化',
          description: '优化应用性能',
          type: 'manual',
          priority: 'medium',
          status: 'pending',
          checklist: [
            '配置 Tree Shaking',
            '优化打包体积',
            '优化加载速度',
            '性能测试'
          ]
        },
        {
          id: 'opt-002',
          title: 'TypeScript 优化',
          description: '优化 TypeScript 类型支持',
          type: 'manual',
          priority: 'medium',
          status: 'pending',
          checklist: [
            '更新类型定义',
            '修复类型错误',
            '添加严格模式',
            '类型检查测试'
          ]
        },
        {
          id: 'opt-003',
          title: '样式优化',
          description: '优化样式和主题',
          type: 'manual',
          priority: 'low',
          status: 'pending',
          checklist: [
            '更新 CSS 变量',
            '优化主题配置',
            '检查样式兼容性',
            '响应式测试'
          ]
        }
      ]
    },
    
    {
      name: 'testing',
      description: '测试验证阶段',
      dependencies: ['optimization'],
      estimatedTime: '2-3 天',
      riskLevel: 'medium',
      tasks: [
        {
          id: 'test-001',
          title: '功能测试',
          description: '全面功能测试',
          type: 'verification',
          priority: 'high',
          status: 'pending',
          checklist: [
            '单元测试',
            '集成测试',
            '端到端测试',
            '回归测试'
          ]
        },
        {
          id: 'test-002',
          title: '兼容性测试',
          description: '浏览器兼容性测试',
          type: 'verification',
          priority: 'high',
          status: 'pending',
          checklist: [
            'Chrome 测试',
            'Firefox 测试',
            'Safari 测试',
            'Edge 测试'
          ]
        },
        {
          id: 'test-003',
          title: '性能测试',
          description: '应用性能测试',
          type: 'verification',
          priority: 'medium',
          status: 'pending',
          checklist: [
            '加载性能测试',
            '运行时性能测试',
            '内存使用测试',
            '网络性能测试'
          ]
        }
      ]
    },
    
    {
      name: 'deployment',
      description: '部署上线阶段',
      dependencies: ['testing'],
      estimatedTime: '1-2 天',
      riskLevel: 'medium',
      tasks: [
        {
          id: 'deploy-001',
          title: '预发布部署',
          description: '部署到预发布环境',
          type: 'manual',
          priority: 'high',
          status: 'pending',
          checklist: [
            '构建生产版本',
            '部署到预发布',
            '验证功能',
            '性能监控'
          ]
        },
        {
          id: 'deploy-002',
          title: '生产部署',
          description: '部署到生产环境',
          type: 'manual',
          priority: 'high',
          status: 'pending',
          checklist: [
            '灰度发布',
            '监控指标',
            '用户反馈',
            '问题修复'
          ]
        },
        {
          id: 'deploy-003',
          title: '文档更新',
          description: '更新项目文档',
          type: 'manual',
          priority: 'medium',
          status: 'pending',
          checklist: [
            '更新 README',
            '更新开发文档',
            '更新部署文档',
            '培训团队'
          ]
        }
      ]
    }
  ]
  
  // 获取迁移计划
  getMigrationPlan(): MigrationPhase[] {
    return this.phases
  }
  
  // 获取当前阶段
  getCurrentPhase(): MigrationPhase | null {
    return this.phases.find(phase => 
      phase.tasks.some(task => task.status === 'in-progress')
    ) || this.phases.find(phase => 
      phase.tasks.every(task => task.status === 'pending')
    ) || null
  }
  
  // 更新任务状态
  updateTaskStatus(taskId: string, status: MigrationTask['status']): void {
    for (const phase of this.phases) {
      const task = phase.tasks.find(t => t.id === taskId)
      if (task) {
        task.status = status
        break
      }
    }
  }
  
  // 获取进度统计
  getProgress(): {
    totalTasks: number
    completedTasks: number
    inProgressTasks: number
    pendingTasks: number
    blockedTasks: number
    progressPercentage: number
  } {
    const allTasks = this.phases.flatMap(phase => phase.tasks)
    
    const stats = {
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === 'completed').length,
      inProgressTasks: allTasks.filter(t => t.status === 'in-progress').length,
      pendingTasks: allTasks.filter(t => t.status === 'pending').length,
      blockedTasks: allTasks.filter(t => t.status === 'blocked').length,
      progressPercentage: 0
    }
    
    stats.progressPercentage = Math.round(
      (stats.completedTasks / stats.totalTasks) * 100
    )
    
    return stats
  }
}

export const migrationStrategy = new MigrationStrategy()
```

#### 3.2 迁移检查清单

```typescript
// migration/checklist.ts

// 迁移检查项
interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  automated: boolean
  checked: boolean
  notes?: string
}

// 迁移检查清单
export const migrationChecklist: ChecklistItem[] = [
  // 依赖检查
  {
    id: 'dep-001',
    category: '依赖检查',
    title: 'Vue 版本检查',
    description: '确保 Vue 版本 >= 3.2.0',
    priority: 'critical',
    automated: true,
    checked: false
  },
  {
    id: 'dep-002',
    category: '依赖检查',
    title: 'Element Plus 版本',
    description: '安装最新稳定版 Element Plus',
    priority: 'critical',
    automated: true,
    checked: false
  },
  {
    id: 'dep-003',
    category: '依赖检查',
    title: '第三方依赖兼容性',
    description: '检查所有第三方依赖的 Vue 3 兼容性',
    priority: 'high',
    automated: false,
    checked: false
  },
  
  // 组件迁移
  {
    id: 'comp-001',
    category: '组件迁移',
    title: '组件名称更新',
    description: '所有 el-xxx 组件名称已更新为 ElXxx',
    priority: 'critical',
    automated: true,
    checked: false
  },
  {
    id: 'comp-002',
    category: '组件迁移',
    title: '属性名称更新',
    description: '组件属性名称已按照新 API 更新',
    priority: 'high',
    automated: true,
    checked: false
  },
  {
    id: 'comp-003',
    category: '组件迁移',
    title: '事件名称更新',
    description: '组件事件名称已按照新 API 更新',
    priority: 'high',
    automated: true,
    checked: false
  },
  {
    id: 'comp-004',
    category: '组件迁移',
    title: '插槽名称更新',
    description: '组件插槽名称已按照新 API 更新',
    priority: 'medium',
    automated: false,
    checked: false
  },
  
  // 样式迁移
  {
    id: 'style-001',
    category: '样式迁移',
    title: 'CSS 变量更新',
    description: '所有 CSS 变量已更新为新的命名规范',
    priority: 'medium',
    automated: true,
    checked: false
  },
  {
    id: 'style-002',
    category: '样式迁移',
    title: 'SCSS 变量更新',
    description: '所有 SCSS 变量已更新为新的命名规范',
    priority: 'medium',
    automated: true,
    checked: false
  },
  {
    id: 'style-003',
    category: '样式迁移',
    title: '主题配置更新',
    description: '主题配置已按照新的格式更新',
    priority: 'medium',
    automated: false,
    checked: false
  },
  
  // 功能测试
  {
    id: 'test-001',
    category: '功能测试',
    title: '表单组件测试',
    description: '所有表单组件功能正常',
    priority: 'critical',
    automated: false,
    checked: false
  },
  {
    id: 'test-002',
    category: '功能测试',
    title: '表格组件测试',
    description: '所有表格组件功能正常',
    priority: 'critical',
    automated: false,
    checked: false
  },
  {
    id: 'test-003',
    category: '功能测试',
    title: '导航组件测试',
    description: '所有导航组件功能正常',
    priority: 'high',
    automated: false,
    checked: false
  },
  {
    id: 'test-004',
    category: '功能测试',
    title: '反馈组件测试',
    description: '所有反馈组件功能正常',
    priority: 'high',
    automated: false,
    checked: false
  },
  
  // 性能检查
  {
    id: 'perf-001',
    category: '性能检查',
    title: '打包体积检查',
    description: '打包体积没有显著增加',
    priority: 'medium',
    automated: true,
    checked: false
  },
  {
    id: 'perf-002',
    category: '性能检查',
    title: '加载性能检查',
    description: '页面加载性能没有显著下降',
    priority: 'medium',
    automated: true,
    checked: false
  },
  {
    id: 'perf-003',
    category: '性能检查',
    title: '运行时性能检查',
    description: '运行时性能没有显著下降',
    priority: 'medium',
    automated: false,
    checked: false
  },
  
  // 兼容性检查
  {
    id: 'compat-001',
    category: '兼容性检查',
    title: '浏览器兼容性',
    description: '在所有目标浏览器中正常运行',
    priority: 'high',
    automated: false,
    checked: false
  },
  {
    id: 'compat-002',
    category: '兼容性检查',
    title: '移动端兼容性',
    description: '在移动设备上正常运行',
    priority: 'high',
    automated: false,
    checked: false
  },
  
  // 文档更新
  {
    id: 'doc-001',
    category: '文档更新',
    title: 'README 更新',
    description: 'README 文档已更新',
    priority: 'low',
    automated: false,
    checked: false
  },
  {
    id: 'doc-002',
    category: '文档更新',
    title: '开发文档更新',
    description: '开发文档已更新',
    priority: 'low',
    automated: false,
    checked: false
  },
  {
    id: 'doc-003',
    category: '文档更新',
    title: '部署文档更新',
    description: '部署文档已更新',
    priority: 'low',
    automated: false,
    checked: false
  }
]

// 检查清单管理器
class ChecklistManager {
  private checklist: ChecklistItem[]
  
  constructor(checklist: ChecklistItem[]) {
    this.checklist = [...checklist]
  }
  
  // 获取检查清单
  getChecklist(): ChecklistItem[] {
    return this.checklist
  }
  
  // 按分类获取
  getByCategory(category: string): ChecklistItem[] {
    return this.checklist.filter(item => item.category === category)
  }
  
  // 按优先级获取
  getByPriority(priority: ChecklistItem['priority']): ChecklistItem[] {
    return this.checklist.filter(item => item.priority === priority)
  }
  
  // 获取未完成项
  getUnchecked(): ChecklistItem[] {
    return this.checklist.filter(item => !item.checked)
  }
  
  // 获取关键未完成项
  getCriticalUnchecked(): ChecklistItem[] {
    return this.checklist.filter(item => 
      !item.checked && item.priority === 'critical'
    )
  }
  
  // 更新检查状态
  updateChecked(id: string, checked: boolean, notes?: string): void {
    const item = this.checklist.find(item => item.id === id)
    if (item) {
      item.checked = checked
      if (notes) {
        item.notes = notes
      }
    }
  }
  
  // 获取完成度统计
  getProgress(): {
    total: number
    checked: number
    unchecked: number
    critical: number
    criticalUnchecked: number
    percentage: number
  } {
    const total = this.checklist.length
    const checked = this.checklist.filter(item => item.checked).length
    const critical = this.checklist.filter(item => item.priority === 'critical').length
    const criticalUnchecked = this.checklist.filter(item => 
      item.priority === 'critical' && !item.checked
    ).length
    
    return {
      total,
      checked,
      unchecked: total - checked,
      critical,
      criticalUnchecked,
      percentage: Math.round((checked / total) * 100)
    }
  }
  
  // 生成报告
  generateReport(): string {
    const progress = this.getProgress()
    const categories = [...new Set(this.checklist.map(item => item.category))]
    
    let report = `# 迁移检查报告\n\n`
    report += `## 总体进度\n\n`
    report += `- 总计: ${progress.total} 项\n`
    report += `- 已完成: ${progress.checked} 项\n`
    report += `- 未完成: ${progress.unchecked} 项\n`
    report += `- 完成度: ${progress.percentage}%\n\n`
    
    if (progress.criticalUnchecked > 0) {
      report += `⚠️ **警告**: 还有 ${progress.criticalUnchecked} 个关键项未完成！\n\n`
    }
    
    categories.forEach(category => {
      const items = this.getByCategory(category)
      const checkedItems = items.filter(item => item.checked)
      
      report += `## ${category}\n\n`
      report += `进度: ${checkedItems.length}/${items.length}\n\n`
      
      items.forEach(item => {
        const status = item.checked ? '✅' : '❌'
        const priority = item.priority === 'critical' ? '🔴' : 
                        item.priority === 'high' ? '🟡' : '🟢'
        
        report += `${status} ${priority} **${item.title}**\n`
        report += `   ${item.description}\n`
        
        if (item.notes) {
          report += `   📝 ${item.notes}\n`
        }
        
        report += `\n`
      })
    })
    
    return report
  }
}

export const checklistManager = new ChecklistManager(migrationChecklist)
```

### 4. 迁移工具集成

#### 4.1 CLI 工具开发

```typescript
// cli/migration-cli.ts
import { Command } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'
import ora from 'ora'
import { ElementPlusMigrator } from '../migration/migrator'
import { migrationStrategy } from '../migration/strategy'
import { checklistManager } from '../migration/checklist'

// CLI 程序
const program = new Command()

program
  .name('element-plus-migrator')
  .description('Element Plus 迁移工具')
  .version('1.0.0')

// 迁移命令
program
  .command('migrate')
  .description('执行 Element Plus 迁移')
  .option('-s, --src <path>', '源码目录', './src')
  .option('-e, --ext <extensions>', '文件扩展名', '.vue,.js,.ts')
  .option('--dry-run', '预览模式，不实际修改文件')
  .option('--backup', '创建备份')
  .option('--report', '生成迁移报告')
  .action(async (options) => {
    console.log(chalk.blue('🚀 Element Plus 迁移工具'))
    console.log()
    
    // 确认迁移
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: '确定要开始迁移吗？建议先备份项目。',
        default: false
      }
    ])
    
    if (!confirm) {
      console.log(chalk.yellow('迁移已取消'))
      return
    }
    
    const spinner = ora('正在执行迁移...').start()
    
    try {
      const config = {
        sourceDir: options.src,
        extensions: options.ext.split(','),
        excludeDirs: ['node_modules', 'dist', '.git'],
        rules: [], // 这里应该导入具体的迁移规则
        output: {
          backup: options.backup || false,
          report: options.report || false,
          dryRun: options.dryRun || false
        }
      }
      
      const migrator = new ElementPlusMigrator(config)
      const report = await migrator.migrate()
      
      spinner.succeed('迁移完成！')
      
      // 显示结果
      console.log()
      console.log(chalk.green('✅ 迁移结果:'))
      console.log(`   处理文件: ${report.processedFiles}/${report.totalFiles}`)
      console.log(`   修改文件: ${report.changes.length}`)
      console.log(`   错误数量: ${report.errors.length}`)
      console.log(`   警告数量: ${report.warnings.length}`)
      
      if (report.errors.length > 0) {
        console.log()
        console.log(chalk.red('❌ 错误列表:'))
        report.errors.forEach(error => {
          console.log(`   ${error.file}: ${error.error}`)
        })
      }
      
      if (report.warnings.length > 0) {
        console.log()
        console.log(chalk.yellow('⚠️ 警告列表:'))
        report.warnings.forEach(warning => {
          console.log(`   ${warning.file}: ${warning.message}`)
        })
      }
      
    } catch (error) {
      spinner.fail('迁移失败')
      console.error(chalk.red(error))
      process.exit(1)
    }
  })

// 策略命令
program
  .command('strategy')
  .description('显示迁移策略')
  .action(() => {
    console.log(chalk.blue('📋 Element Plus 迁移策略'))
    console.log()
    
    const phases = migrationStrategy.getMigrationPlan()
    const progress = migrationStrategy.getProgress()
    
    console.log(chalk.green(`总体进度: ${progress.progressPercentage}%`))
    console.log(`完成任务: ${progress.completedTasks}/${progress.totalTasks}`)
    console.log()
    
    phases.forEach((phase, index) => {
      const phaseProgress = phase.tasks.filter(t => t.status === 'completed').length
      const phaseTotal = phase.tasks.length
      const phasePercentage = Math.round((phaseProgress / phaseTotal) * 100)
      
      console.log(chalk.cyan(`${index + 1}. ${phase.name} (${phasePercentage}%)`))
      console.log(`   ${phase.description}`)
      console.log(`   预计时间: ${phase.estimatedTime}`)
      console.log(`   风险等级: ${phase.riskLevel}`)
      console.log(`   任务进度: ${phaseProgress}/${phaseTotal}`)
      console.log()
      
      phase.tasks.forEach(task => {
        const statusIcon = {
          'pending': '⏳',
          'in-progress': '🔄',
          'completed': '✅',
          'blocked': '🚫'
        }[task.status]
        
        const priorityColor = {
          'high': chalk.red,
          'medium': chalk.yellow,
          'low': chalk.green
        }[task.priority]
        
        console.log(`     ${statusIcon} ${priorityColor(task.title)}`)
        console.log(`        ${task.description}`)
      })
      
      console.log()
    })
  })

// 检查清单命令
program
  .command('checklist')
  .description('显示迁移检查清单')
  .option('--category <category>', '按分类筛选')
  .option('--unchecked', '只显示未完成项')
  .action((options) => {
    console.log(chalk.blue('📝 迁移检查清单'))
    console.log()
    
    let items = checklistManager.getChecklist()
    
    if (options.category) {
      items = checklistManager.getByCategory(options.category)
    }
    
    if (options.unchecked) {
      items = items.filter(item => !item.checked)
    }
    
    const progress = checklistManager.getProgress()
    console.log(chalk.green(`总体进度: ${progress.percentage}%`))
    console.log(`完成项目: ${progress.checked}/${progress.total}`)
    
    if (progress.criticalUnchecked > 0) {
      console.log(chalk.red(`⚠️ 关键未完成项: ${progress.criticalUnchecked}`)) 
    }
    
    console.log()
    
    const categories = [...new Set(items.map(item => item.category))]
    
    categories.forEach(category => {
      const categoryItems = items.filter(item => item.category === category)
      
      console.log(chalk.cyan(`## ${category}`))
      console.log()
      
      categoryItems.forEach(item => {
        const statusIcon = item.checked ? '✅' : '❌'
        const priorityIcon = {
          'critical': '🔴',
          'high': '🟡',
          'medium': '🟠',
          'low': '🟢'
        }[item.priority]
        
        console.log(`${statusIcon} ${priorityIcon} ${item.title}`)
        console.log(`   ${item.description}`)
        
        if (item.notes) {
          console.log(`   📝 ${item.notes}`)
        }
        
        console.log()
      })
    })
  })

// 报告命令
program
  .command('report')
  .description('生成迁移报告')
  .option('-o, --output <file>', '输出文件', 'migration-report.md')
  .action(async (options) => {
    const spinner = ora('正在生成报告...').start()
    
    try {
      const report = checklistManager.generateReport()
      
      await require('fs').promises.writeFile(options.output, report)
      
      spinner.succeed(`报告已生成: ${options.output}`)
      
    } catch (error) {
      spinner.fail('生成报告失败')
      console.error(chalk.red(error))
    }
  })

// 解析命令行参数
program.parse()
```

## 实践练习

### 练习 1：使用官方迁移工具

1. 创建一个使用 Element UI 的示例项目
2. 使用官方迁移工具进行自动迁移
3. 分析迁移结果和遗留问题
4. 手动修复自动迁移无法处理的问题

### 练习 2：开发自定义迁移规则

1. 分析项目中的特殊迁移需求
2. 开发自定义的 AST 转换规则
3. 集成到迁移工具中
4. 测试迁移规则的准确性

### 练习 3：构建完整迁移方案

1. 制定详细的迁移计划
2. 实现分阶段迁移策略
3. 建立迁移检查清单
4. 开发迁移监控和报告系统

## 学习资源

* [Element Plus 迁移指南](https://element-plus.org/zh-CN/guide/migration.html)
* [Vue 3 迁移指南](https://v3-migration.vuejs.org/)
* [AST Explorer](https://astexplorer.net/)
* [jscodeshift 文档](https://github.com/facebook/jscodeshift)

## 作业

1. 完成所有实践练习
2. 为一个真实项目制定迁移方案
3. 开发项目特定的迁移工具
4. 编写迁移最佳实践文档

## 下一步学习计划

接下来我们将学习 **Element Plus 社区贡献与开源实践**，了解如何参与 Element Plus 社区建设和开源贡献。