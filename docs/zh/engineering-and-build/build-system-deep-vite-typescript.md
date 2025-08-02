# 第82天：Element Plus 构建系统深入（Vite + TypeScript）

## 学习目标

- 深入理解 Element Plus 的构建系统架构
- 掌握 Vite + TypeScript 的高级配置
- 学习组件库的打包和发布流程
- 构建现代化的前端工程化体系

## 1. Element Plus 构建系统架构

### 1.1 项目结构分析

```typescript
// 构建系统配置分析器
class BuildSystemAnalyzer {
  private projectRoot: string
  private buildConfig: any
  private dependencies: Map<string, string> = new Map()
  
  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
    this.analyzeBuildSystem()
  }
  
  // 分析构建系统
  private analyzeBuildSystem(): void {
    this.analyzePackageJson()
    this.analyzeViteConfig()
    this.analyzeTsConfig()
    this.analyzeBuildScripts()
  }
  
  // 分析 package.json
  private analyzePackageJson(): void {
    try {
      const packagePath = `${this.projectRoot}/package.json`
      const packageJson = require(packagePath)
      
      // 分析依赖
      this.extractDependencies(packageJson.dependencies, 'production')
      this.extractDependencies(packageJson.devDependencies, 'development')
      this.extractDependencies(packageJson.peerDependencies, 'peer')
      
      // 分析脚本
      this.analyzeBuildScripts(packageJson.scripts)
      
      console.log('Package.json analysis completed:', {
        name: packageJson.name,
        version: packageJson.version,
        dependencies: this.dependencies.size,
        scripts: Object.keys(packageJson.scripts || {}).length
      })
    } catch (error) {
      console.error('Failed to analyze package.json:', error)
    }
  }
  
  // 提取依赖信息
  private extractDependencies(deps: Record<string, string> | undefined, type: string): void {
    if (!deps) return
    
    Object.entries(deps).forEach(([name, version]) => {
      this.dependencies.set(name, `${version} (${type})`)
    })
  }
  
  // 分析构建脚本
  private analyzeBuildScripts(scripts: Record<string, string> | undefined): void {
    if (!scripts) return
    
    const buildRelatedScripts = Object.entries(scripts)
      .filter(([name]) => {
        return name.includes('build') || 
               name.includes('dev') || 
               name.includes('test') || 
               name.includes('lint')
      })
    
    console.log('Build-related scripts:', buildRelatedScripts)
  }
  
  // 分析 Vite 配置
  private analyzeViteConfig(): void {
    try {
      const viteConfigPaths = [
        `${this.projectRoot}/vite.config.ts`,
        `${this.projectRoot}/vite.config.js`,
        `${this.projectRoot}/build/vite.config.ts`
      ]
      
      for (const configPath of viteConfigPaths) {
        if (this.fileExists(configPath)) {
          console.log(`Found Vite config: ${configPath}`)
          this.parseViteConfig(configPath)
          break
        }
      }
    } catch (error) {
      console.error('Failed to analyze Vite config:', error)
    }
  }
  
  // 解析 Vite 配置
  private parseViteConfig(configPath: string): void {
    // 这里可以实现更复杂的配置解析逻辑
    console.log('Parsing Vite config from:', configPath)
  }
  
  // 分析 TypeScript 配置
  private analyzeTsConfig(): void {
    try {
      const tsConfigPath = `${this.projectRoot}/tsconfig.json`
      if (this.fileExists(tsConfigPath)) {
        const tsConfig = require(tsConfigPath)
        
        console.log('TypeScript configuration:', {
          target: tsConfig.compilerOptions?.target,
          module: tsConfig.compilerOptions?.module,
          strict: tsConfig.compilerOptions?.strict,
          declaration: tsConfig.compilerOptions?.declaration
        })
      }
    } catch (error) {
      console.error('Failed to analyze tsconfig.json:', error)
    }
  }
  
  // 检查文件是否存在
  private fileExists(path: string): boolean {
    try {
      require('fs').accessSync(path)
      return true
    } catch {
      return false
    }
  }
  
  // 获取构建系统报告
  getBuildSystemReport(): any {
    return {
      projectRoot: this.projectRoot,
      dependencies: Object.fromEntries(this.dependencies),
      buildTools: this.detectBuildTools(),
      recommendations: this.generateRecommendations()
    }
  }
  
  // 检测构建工具
  private detectBuildTools(): string[] {
    const tools: string[] = []
    
    if (this.dependencies.has('vite')) tools.push('Vite')
    if (this.dependencies.has('webpack')) tools.push('Webpack')
    if (this.dependencies.has('rollup')) tools.push('Rollup')
    if (this.dependencies.has('typescript')) tools.push('TypeScript')
    if (this.dependencies.has('esbuild')) tools.push('ESBuild')
    if (this.dependencies.has('swc')) tools.push('SWC')
    
    return tools
  }
  
  // 生成建议
  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    if (!this.dependencies.has('typescript')) {
      recommendations.push('建议添加 TypeScript 以提供更好的类型安全')
    }
    
    if (!this.dependencies.has('vite')) {
      recommendations.push('建议使用 Vite 作为构建工具以获得更快的开发体验')
    }
    
    if (!this.dependencies.has('eslint')) {
      recommendations.push('建议添加 ESLint 进行代码质量检查')
    }
    
    return recommendations
  }
}
```

### 1.2 Vite 高级配置

```typescript
// vite.config.ts
import { defineConfig, UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 构建配置工厂
class ViteBuildConfigFactory {
  private env: ConfigEnv
  private isDev: boolean
  private isProd: boolean
  private isLib: boolean
  
  constructor(env: ConfigEnv) {
    this.env = env
    this.isDev = env.command === 'serve'
    this.isProd = env.command === 'build'
    this.isLib = env.mode === 'lib'
  }
  
  // 创建基础配置
  createBaseConfig(): UserConfig {
    return {
      resolve: this.createResolveConfig(),
      plugins: this.createPlugins(),
      css: this.createCssConfig(),
      server: this.createServerConfig(),
      build: this.createBuildConfig(),
      optimizeDeps: this.createOptimizeDepsConfig(),
      define: this.createDefineConfig(),
      esbuild: this.createEsbuildConfig()
    }
  }
  
  // 创建路径解析配置
  private createResolveConfig() {
    return {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'src'),
        'vue': 'vue/dist/vue.esm-bundler.js',
        // Element Plus 内部别名
        '@element-plus/components': resolve(__dirname, 'packages/components'),
        '@element-plus/theme-chalk': resolve(__dirname, 'packages/theme-chalk'),
        '@element-plus/utils': resolve(__dirname, 'packages/utils'),
        '@element-plus/hooks': resolve(__dirname, 'packages/hooks'),
        '@element-plus/tokens': resolve(__dirname, 'packages/tokens'),
        '@element-plus/directives': resolve(__dirname, 'packages/directives'),
        '@element-plus/locale': resolve(__dirname, 'packages/locale')
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json', '.mjs']
    }
  }
  
  // 创建插件配置
  private createPlugins() {
    const plugins = [
      // Vue 支持
      vue({
        include: [/\.vue$/, /\.md$/],
        reactivityTransform: true,
        script: {
          defineModel: true,
          propsDestructure: true
        }
      }),
      
      // Vue JSX 支持
      vueJsx({
        mergeProps: false,
        enableObjectSlots: false
      }),
      
      // 自动导入
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core'
        ],
        resolvers: [
          ElementPlusResolver()
        ],
        dts: true,
        eslintrc: {
          enabled: true
        }
      }),
      
      // 组件自动导入
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ],
        dts: true
      }),
      
      // SVG 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(__dirname, 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
        customDomId: '__svg__icons__dom__'
      })
    ]
    
    // 开发环境插件
    if (this.isDev) {
      // 可以添加开发专用插件
    }
    
    // 生产环境插件
    if (this.isProd) {
      plugins.push(
        // TypeScript 声明文件生成
        dts({
          include: ['src/**/*', 'packages/**/*'],
          exclude: ['src/**/*.test.*', 'src/**/*.spec.*'],
          staticImport: true,
          insertTypesEntry: true,
          rollupTypes: true
        }),
        
        // 打包分析
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        })
      )
    }
    
    // 库模式插件
    if (this.isLib) {
      plugins.push(
        // 库专用插件配置
      )
    }
    
    return plugins
  }
  
  // 创建 CSS 配置
  private createCssConfig() {
    return {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@element-plus/theme-chalk/src/mixins/mixins" as *;
            @use "@element-plus/theme-chalk/src/common/var" as *;
          `,
          charset: false
        }
      },
      postcss: {
        plugins: [
          require('autoprefixer')({
            overrideBrowserslist: [
              'Chrome > 40',
              'ff > 31',
              'ie 11',
              'last 2 versions'
            ]
          })
        ]
      }
    }
  }
  
  // 创建开发服务器配置
  private createServerConfig() {
    return {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      },
      hmr: {
        overlay: true
      }
    }
  }
  
  // 创建构建配置
  private createBuildConfig() {
    const baseConfig = {
      target: 'es2015',
      cssCodeSplit: true,
      sourcemap: this.isDev,
      minify: this.isProd ? 'esbuild' : false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        external: this.getExternalDependencies(),
        output: this.getRollupOutput()
      }
    }
    
    // 库模式配置
    if (this.isLib) {
      return {
        ...baseConfig,
        lib: {
          entry: resolve(__dirname, 'packages/element-plus/index.ts'),
          name: 'ElementPlus',
          fileName: (format: string) => `element-plus.${format}.js`,
          formats: ['es', 'umd', 'cjs']
        }
      }
    }
    
    return baseConfig
  }
  
  // 获取外部依赖
  private getExternalDependencies(): string[] {
    if (this.isLib) {
      return [
        'vue',
        '@vue/shared',
        '@floating-ui/dom',
        '@popperjs/core',
        'async-validator',
        'dayjs',
        'escape-html',
        'lodash-unified',
        'memoize-one',
        'normalize-wheel-es'
      ]
    }
    
    return []
  }
  
  // 获取 Rollup 输出配置
  private getRollupOutput() {
    if (this.isLib) {
      return {
        globals: {
          vue: 'Vue'
        },
        exports: 'named',
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name === 'style.css') {
            return 'index.css'
          }
          return assetInfo.name
        }
      }
    }
    
    return {
      manualChunks: {
        vue: ['vue'],
        'element-plus': ['element-plus']
      }
    }
  }
  
  // 创建依赖优化配置
  private createOptimizeDepsConfig() {
    return {
      include: [
        'vue',
        '@vue/shared',
        'element-plus',
        '@element-plus/icons-vue'
      ],
      exclude: [
        'vue-demi'
      ]
    }
  }
  
  // 创建全局定义配置
  private createDefineConfig() {
    return {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  }
  
  // 创建 ESBuild 配置
  private createEsbuildConfig() {
    return {
      target: 'es2015',
      drop: this.isProd ? ['console', 'debugger'] : []
    }
  }
}

// 导出配置
export default defineConfig((env: ConfigEnv) => {
  const factory = new ViteBuildConfigFactory(env)
  return factory.createBaseConfig()
})
```

## 2. TypeScript 高级配置

### 2.1 TypeScript 编译配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@element-plus/*": ["packages/*"]
    },
    "types": [
      "node",
      "vite/client",
      "element-plus/global"
    ],
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*",
    "packages/**/*",
    "typings/**/*",
    "*.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.*",
    "**/*.spec.*"
  ],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
}
```

### 2.2 TypeScript 构建工具

```typescript
// build/typescript-builder.ts
import { Project, SourceFile, ts } from 'ts-morph'
import { resolve, dirname, basename, extname } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

// TypeScript 构建器
class TypeScriptBuilder {
  private project: Project
  private sourceRoot: string
  private outputRoot: string
  
  constructor(sourceRoot: string, outputRoot: string) {
    this.sourceRoot = sourceRoot
    this.outputRoot = outputRoot
    
    this.project = new Project({
      tsConfigFilePath: resolve(process.cwd(), 'tsconfig.json'),
      skipAddingFilesFromTsConfig: false
    })
  }
  
  // 构建类型声明文件
  async buildDeclarations(): Promise<void> {
    console.log('Building TypeScript declarations...')
    
    const sourceFiles = this.project.getSourceFiles()
    const declarationFiles = new Map<string, string>()
    
    // 生成声明文件
    for (const sourceFile of sourceFiles) {
      if (this.shouldProcessFile(sourceFile)) {
        const declaration = await this.generateDeclaration(sourceFile)
        if (declaration) {
          const outputPath = this.getOutputPath(sourceFile.getFilePath())
          declarationFiles.set(outputPath, declaration)
        }
      }
    }
    
    // 写入声明文件
    for (const [outputPath, content] of declarationFiles) {
      this.writeDeclarationFile(outputPath, content)
    }
    
    // 生成入口声明文件
    await this.generateEntryDeclaration()
    
    console.log(`Generated ${declarationFiles.size} declaration files`)
  }
  
  // 判断是否应该处理文件
  private shouldProcessFile(sourceFile: SourceFile): boolean {
    const filePath = sourceFile.getFilePath()
    
    // 排除测试文件
    if (filePath.includes('.test.') || filePath.includes('.spec.')) {
      return false
    }
    
    // 排除 node_modules
    if (filePath.includes('node_modules')) {
      return false
    }
    
    // 只处理源码目录下的文件
    return filePath.startsWith(this.sourceRoot)
  }
  
  // 生成声明文件内容
  private async generateDeclaration(sourceFile: SourceFile): Promise<string | null> {
    try {
      const emitResult = sourceFile.getEmitOutput({
        emitOnlyDtsFiles: true
      })
      
      const declarationFile = emitResult.getOutputFiles().find(
        file => file.getFilePath().endsWith('.d.ts')
      )
      
      if (declarationFile) {
        let content = declarationFile.getText()
        
        // 处理路径映射
        content = this.processPathMappings(content)
        
        // 添加版权信息
        content = this.addCopyright(content)
        
        return content
      }
      
      return null
    } catch (error) {
      console.error(`Failed to generate declaration for ${sourceFile.getFilePath()}:`, error)
      return null
    }
  }
  
  // 处理路径映射
  private processPathMappings(content: string): string {
    // 替换内部路径引用
    content = content.replace(
      /@element-plus\/(\w+)/g,
      (match, packageName) => `element-plus/es/${packageName}`
    )
    
    // 处理相对路径
    content = content.replace(
      /from ['"]\.\.\//g,
      "from '../"
    )
    
    return content
  }
  
  // 添加版权信息
  private addCopyright(content: string): string {
    const copyright = `/**
 * Element Plus v${this.getVersion()}
 * (c) 2021-present Element Plus Team
 * Released under the MIT License.
 */\n\n`
    
    return copyright + content
  }
  
  // 获取版本号
  private getVersion(): string {
    try {
      const packageJson = require(resolve(process.cwd(), 'package.json'))
      return packageJson.version || '0.0.0'
    } catch {
      return '0.0.0'
    }
  }
  
  // 获取输出路径
  private getOutputPath(inputPath: string): string {
    const relativePath = inputPath.replace(this.sourceRoot, '')
    const outputPath = resolve(this.outputRoot, relativePath)
    
    // 替换扩展名为 .d.ts
    return outputPath.replace(/\.(ts|tsx|vue)$/, '.d.ts')
  }
  
  // 写入声明文件
  private writeDeclarationFile(outputPath: string, content: string): void {
    const dir = dirname(outputPath)
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
    writeFileSync(outputPath, content, 'utf-8')
  }
  
  // 生成入口声明文件
  private async generateEntryDeclaration(): Promise<void> {
    const entryContent = this.generateEntryContent()
    const entryPath = resolve(this.outputRoot, 'index.d.ts')
    
    this.writeDeclarationFile(entryPath, entryContent)
  }
  
  // 生成入口文件内容
  private generateEntryContent(): string {
    const exports = [
      "export * from './components'",
      "export * from './composables'",
      "export * from './directives'",
      "export * from './locale'",
      "export * from './utils'",
      "export { default } from './defaults'"
    ]
    
    return this.addCopyright(exports.join('\n') + '\n')
  }
  
  // 验证声明文件
  async validateDeclarations(): Promise<boolean> {
    console.log('Validating TypeScript declarations...')
    
    try {
      const diagnostics = this.project.getPreEmitDiagnostics()
      
      if (diagnostics.length > 0) {
        console.error('TypeScript validation errors:')
        diagnostics.forEach(diagnostic => {
          console.error(diagnostic.getMessageText())
        })
        return false
      }
      
      console.log('TypeScript declarations are valid')
      return true
    } catch (error) {
      console.error('Failed to validate declarations:', error)
      return false
    }
  }
  
  // 清理输出目录
  clean(): void {
    console.log('Cleaning TypeScript output directory...')
    
    try {
      const rimraf = require('rimraf')
      rimraf.sync(this.outputRoot)
      console.log('TypeScript output directory cleaned')
    } catch (error) {
      console.error('Failed to clean output directory:', error)
    }
  }
}

// 导出构建器
export { TypeScriptBuilder }

// 构建脚本
if (require.main === module) {
  const builder = new TypeScriptBuilder(
    resolve(__dirname, '../packages'),
    resolve(__dirname, '../dist/types')
  )
  
  async function build() {
    try {
      builder.clean()
      await builder.buildDeclarations()
      
      const isValid = await builder.validateDeclarations()
      if (!isValid) {
        process.exit(1)
      }
      
      console.log('TypeScript build completed successfully')
    } catch (error) {
      console.error('TypeScript build failed:', error)
      process.exit(1)
    }
  }
  
  build()
}
```

## 3. 组件库打包策略

### 3.1 多格式打包配置

```typescript
// build/build-lib.ts
import { build, InlineConfig } from 'vite'
import { resolve } from 'path'
import { writeFileSync } from 'fs'

// 打包格式配置
interface BuildFormat {
  format: 'es' | 'cjs' | 'umd' | 'iife'
  fileName: string
  external?: string[]
  globals?: Record<string, string>
  minify?: boolean
}

// 组件库打包器
class LibraryBuilder {
  private packageRoot: string
  private outputDir: string
  
  constructor(packageRoot: string, outputDir: string) {
    this.packageRoot = packageRoot
    this.outputDir = outputDir
  }
  
  // 构建所有格式
  async buildAllFormats(): Promise<void> {
    const formats: BuildFormat[] = [
      {
        format: 'es',
        fileName: 'index.mjs',
        external: this.getExternalDependencies()
      },
      {
        format: 'cjs',
        fileName: 'index.cjs',
        external: this.getExternalDependencies()
      },
      {
        format: 'umd',
        fileName: 'index.umd.js',
        globals: {
          vue: 'Vue'
        }
      },
      {
        format: 'umd',
        fileName: 'index.umd.min.js',
        globals: {
          vue: 'Vue'
        },
        minify: true
      }
    ]
    
    for (const formatConfig of formats) {
      await this.buildFormat(formatConfig)
    }
    
    // 生成 package.json
    this.generatePackageJson()
  }
  
  // 构建指定格式
  private async buildFormat(formatConfig: BuildFormat): Promise<void> {
    console.log(`Building ${formatConfig.format} format...`)
    
    const config: InlineConfig = {
      configFile: false,
      build: {
        lib: {
          entry: resolve(this.packageRoot, 'index.ts'),
          name: 'ElementPlus',
          fileName: () => formatConfig.fileName,
          formats: [formatConfig.format]
        },
        outDir: this.outputDir,
        rollupOptions: {
          external: formatConfig.external || [],
          output: {
            globals: formatConfig.globals || {},
            exports: 'named'
          }
        },
        minify: formatConfig.minify ? 'esbuild' : false,
        sourcemap: true,
        emptyOutDir: false
      }
    }
    
    await build(config)
    console.log(`${formatConfig.format} format built successfully`)
  }
  
  // 获取外部依赖
  private getExternalDependencies(): string[] {
    return [
      'vue',
      '@vue/shared',
      '@floating-ui/dom',
      '@popperjs/core',
      'async-validator',
      'dayjs',
      'escape-html',
      'lodash-unified',
      'memoize-one',
      'normalize-wheel-es'
    ]
  }
  
  // 生成 package.json
  private generatePackageJson(): void {
    const packageJson = {
      name: 'element-plus',
      version: this.getVersion(),
      description: 'A Vue.js 3 UI Library made by Element team',
      main: 'index.cjs',
      module: 'index.mjs',
      unpkg: 'index.umd.min.js',
      jsdelivr: 'index.umd.min.js',
      types: 'index.d.ts',
      exports: {
        '.': {
          import: './index.mjs',
          require: './index.cjs',
          types: './index.d.ts'
        },
        './dist/index.css': './index.css',
        './package.json': './package.json'
      },
      files: [
        'index.*',
        'es/',
        'lib/',
        'theme-chalk/'
      ],
      sideEffects: [
        '*.css',
        '*.scss'
      ],
      peerDependencies: {
        vue: '^3.2.0'
      },
      browserslist: [
        '> 1%',
        'last 2 versions',
        'not dead'
      ]
    }
    
    const outputPath = resolve(this.outputDir, 'package.json')
    writeFileSync(outputPath, JSON.stringify(packageJson, null, 2))
    
    console.log('package.json generated')
  }
  
  // 获取版本号
  private getVersion(): string {
    try {
      const packageJson = require(resolve(process.cwd(), 'package.json'))
      return packageJson.version || '0.0.0'
    } catch {
      return '0.0.0'
    }
  }
}

// 按需打包器
class TreeShakingBuilder {
  private componentsDir: string
  private outputDir: string
  
  constructor(componentsDir: string, outputDir: string) {
    this.componentsDir = componentsDir
    this.outputDir = outputDir
  }
  
  // 构建按需加载版本
  async buildTreeShaking(): Promise<void> {
    console.log('Building tree-shaking version...')
    
    // 构建 ES 模块版本
    await this.buildESModules()
    
    // 构建 CommonJS 版本
    await this.buildCommonJS()
    
    // 生成入口文件
    this.generateEntryFiles()
    
    console.log('Tree-shaking version built successfully')
  }
  
  // 构建 ES 模块
  private async buildESModules(): Promise<void> {
    const config: InlineConfig = {
      configFile: false,
      build: {
        lib: {
          entry: resolve(this.componentsDir, 'index.ts'),
          formats: ['es']
        },
        outDir: resolve(this.outputDir, 'es'),
        rollupOptions: {
          external: this.getExternalDependencies(),
          preserveEntrySignatures: 'strict',
          output: {
            preserveModules: true,
            preserveModulesRoot: this.componentsDir,
            entryFileNames: '[name].mjs'
          }
        },
        minify: false,
        sourcemap: true
      }
    }
    
    await build(config)
  }
  
  // 构建 CommonJS 模块
  private async buildCommonJS(): Promise<void> {
    const config: InlineConfig = {
      configFile: false,
      build: {
        lib: {
          entry: resolve(this.componentsDir, 'index.ts'),
          formats: ['cjs']
        },
        outDir: resolve(this.outputDir, 'lib'),
        rollupOptions: {
          external: this.getExternalDependencies(),
          preserveEntrySignatures: 'strict',
          output: {
            preserveModules: true,
            preserveModulesRoot: this.componentsDir,
            entryFileNames: '[name].cjs',
            exports: 'named'
          }
        },
        minify: false,
        sourcemap: true
      }
    }
    
    await build(config)
  }
  
  // 生成入口文件
  private generateEntryFiles(): void {
    // 生成 ES 入口
    const esEntry = `export * from './es/index.mjs'\n`
    writeFileSync(resolve(this.outputDir, 'index.mjs'), esEntry)
    
    // 生成 CommonJS 入口
    const cjsEntry = `module.exports = require('./lib/index.cjs')\n`
    writeFileSync(resolve(this.outputDir, 'index.cjs'), cjsEntry)
  }
  
  // 获取外部依赖
  private getExternalDependencies(): string[] {
    return [
      'vue',
      '@vue/shared',
      /^@element-plus\//,
      /^lodash-unified/,
      /^dayjs/
    ]
  }
}

// 导出构建器
export { LibraryBuilder, TreeShakingBuilder }
```

## 4. 实践练习

1. **构建系统优化**：
   - 分析现有构建配置
   - 优化构建性能
   - 实现增量构建

2. **TypeScript 集成**：
   - 配置严格的类型检查
   - 生成完整的类型声明
   - 实现类型安全的构建

3. **多格式打包**：
   - 实现 ES/CJS/UMD 多格式输出
   - 优化包体积
   - 支持按需加载

## 5. 学习资源

- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 编译选项](https://www.typescriptlang.org/tsconfig)
- [Rollup 配置指南](https://rollupjs.org/guide/en/)
- [Element Plus 构建源码](https://github.com/element-plus/element-plus/tree/dev/build)

## 6. 作业

- 搭建完整的组件库构建系统
- 实现多格式打包配置
- 优化构建性能和输出质量
- 编写构建文档和最佳实践

## 总结

通过第82天的学习，我们深入掌握了：

1. **构建系统架构**：理解了 Element Plus 的完整构建体系
2. **Vite 高级配置**：掌握了现代化的构建工具配置
3. **TypeScript 集成**：实现了类型安全的构建流程
4. **打包策略**：构建了多格式、可按需加载的组件库

这些技能将帮助我们构建现代化、高效的前端工程化体系。