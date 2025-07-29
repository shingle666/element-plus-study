# 第40天：Element Plus 工程化配置与构建优化

## 学习目标
- 深入理解 Element Plus 的工程化配置
- 掌握构建优化技术和策略
- 学习模块化和代码分割
- 实践生产环境部署优化

## 学习内容

### 1. Element Plus 工程化概述

#### 1.1 现代前端工程化体系
```typescript
// 工程化配置架构
interface EngineeringConfig {
  // 构建工具配置
  build: {
    bundler: 'vite' | 'webpack' | 'rollup'
    target: string[]
    minify: boolean
    sourcemap: boolean
    splitting: boolean
  }
  
  // 开发环境配置
  development: {
    devServer: {
      port: number
      host: string
      https: boolean
      proxy: Record<string, any>
    }
    hmr: boolean
    mock: boolean
  }
  
  // 生产环境配置
  production: {
    optimization: {
      treeshaking: boolean
      compression: boolean
      bundleAnalysis: boolean
      cdn: boolean
    }
    deployment: {
      staticAssets: string
      caching: Record<string, number>
      preload: string[]
    }
  }
  
  // 质量保证
  quality: {
    linting: boolean
    testing: boolean
    typeChecking: boolean
    coverage: number
  }
}
```

#### 1.2 Vite 配置优化
```typescript
// vite.config.ts - 优化的 Vite 配置
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = command === 'build'
  
  return {
    // 基础配置
    base: env.VITE_PUBLIC_PATH || '/',
    
    // 路径解析
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@api': resolve(__dirname, 'src/api'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@views': resolve(__dirname, 'src/views')
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json']
    },
    
    // 插件配置
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true
        }
      }),
      
      // 自动导入
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            'element-plus': [
              'ElMessage',
              'ElMessageBox',
              'ElNotification',
              'ElLoading'
            ]
          }
        ],
        resolvers: [ElementPlusResolver()],
        dts: true,
        eslintrc: {
          enabled: true
        }
      }),
      
      // 组件自动导入
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true,
            version: '2.4.0'
          })
        ],
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/]
      }),
      
      // SVG 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__'
      }),
      
      // HTML 模板处理
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: env.VITE_APP_TITLE || 'Element Plus App',
            description: env.VITE_APP_DESCRIPTION || '',
            keywords: env.VITE_APP_KEYWORDS || ''
          }
        }
      }),
      
      // 生产环境插件
      ...(isProduction ? [
        // 包分析
        visualizer({
          filename: 'dist/stats.html',
          open: false,
          gzipSize: true,
          brotliSize: true
        }),
        
        // Gzip 压缩
        compression({
          algorithm: 'gzip',
          exclude: [/\.(br)$/, /\.(gz)$/]
        }),
        
        // Brotli 压缩
        compression({
          algorithm: 'brotliCompress',
          exclude: [/\.(br)$/, /\.(gz)$/]
        })
      ] : [])
    ],
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      
      // Terser 配置
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: isProduction ? ['console.log'] : []
        }
      },
      
      // Rollup 配置
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          // 分包策略
          manualChunks: {
            // Vue 生态
            vue: ['vue', 'vue-router', 'pinia'],
            
            // Element Plus
            'element-plus': ['element-plus'],
            
            // 工具库
            utils: ['lodash-es', 'dayjs', 'axios'],
            
            // 图表库
            charts: ['echarts', '@antv/g2']
          },
          
          // 文件命名
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^.]*$/, '')
              : 'chunk'
            return `js/${facadeModuleId}-[hash].js`
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              return `media/[name]-[hash].${ext}`
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash].${ext}`
            }
            return `assets/[name]-[hash].${ext}`
          }
        }
      },
      
      // 包大小警告阈值
      chunkSizeWarningLimit: 1000
    },
    
    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/styles/variables.scss" as *;
            @use "@/styles/mixins.scss" as *;
          `
        }
      },
      postcss: {
        plugins: [
          require('autoprefixer'),
          require('cssnano')({
            preset: 'default'
          })
        ]
      }
    },
    
    // 优化配置
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus/es',
        'element-plus/es/components/button/style/index',
        'element-plus/es/components/input/style/index',
        'element-plus/es/components/form/style/index',
        'element-plus/es/components/table/style/index',
        'lodash-es',
        'dayjs'
      ],
      exclude: ['@iconify/json']
    },
    
    // 环境变量
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
})
```

### 2. 按需加载优化

#### 2.1 Element Plus 按需导入
```typescript
// elementPlus.ts - Element Plus 按需导入配置
import type { App } from 'vue'

// 按需导入的组件列表
const components = [
  'ElButton',
  'ElInput',
  'ElForm',
  'ElFormItem',
  'ElTable',
  'ElTableColumn',
  'ElPagination',
  'ElDialog',
  'ElDrawer',
  'ElCard',
  'ElTabs',
  'ElTabPane',
  'ElSelect',
  'ElOption',
  'ElDatePicker',
  'ElTimePicker',
  'ElUpload',
  'ElImage',
  'ElCarousel',
  'ElCarouselItem'
] as const

// 按需导入的指令列表
const directives = [
  'ElLoading',
  'ElInfiniteScroll',
  'ElPopover'
] as const

// 动态导入函数
const importComponent = async (name: string) => {
  const component = await import(`element-plus/es/components/${name.toLowerCase().replace('el', '')}/index.mjs`)
  return component.default || component
}

const importDirective = async (name: string) => {
  const directive = await import(`element-plus/es/directives/${name.toLowerCase().replace('el', '')}/index.mjs`)
  return directive.default || directive
}

// 按需注册插件
export const setupElementPlus = async (app: App) => {
  // 注册组件
  const componentPromises = components.map(async (name) => {
    try {
      const component = await importComponent(name)
      app.component(name, component)
    } catch (error) {
      console.warn(`Failed to load component ${name}:`, error)
    }
  })
  
  // 注册指令
  const directivePromises = directives.map(async (name) => {
    try {
      const directive = await importDirective(name)
      app.directive(name.replace('El', '').toLowerCase(), directive)
    } catch (error) {
      console.warn(`Failed to load directive ${name}:`, error)
    }
  })
  
  await Promise.all([...componentPromises, ...directivePromises])
}

// 样式按需导入
export const loadElementPlusStyles = () => {
  const styles = [
    'element-plus/theme-chalk/base.css',
    'element-plus/theme-chalk/el-button.css',
    'element-plus/theme-chalk/el-input.css',
    'element-plus/theme-chalk/el-form.css',
    'element-plus/theme-chalk/el-table.css',
    'element-plus/theme-chalk/el-pagination.css',
    'element-plus/theme-chalk/el-dialog.css',
    'element-plus/theme-chalk/el-card.css'
  ]
  
  styles.forEach(style => {
    import(style).catch(error => {
      console.warn(`Failed to load style ${style}:`, error)
    })
  })
}
```

#### 2.2 路由懒加载优化
```typescript
// router/index.ts - 路由懒加载配置
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { defineAsyncComponent } from 'vue'

// 懒加载组件工厂
const createAsyncComponent = (loader: () => Promise<any>) => {
  return defineAsyncComponent({
    loader,
    loadingComponent: () => import('@/components/Loading.vue'),
    errorComponent: () => import('@/components/ErrorComponent.vue'),
    delay: 200,
    timeout: 3000
  })
}

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: createAsyncComponent(() => import('@/views/dashboard/index.vue')),
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          preload: true // 标记为预加载
        }
      },
      {
        path: 'users',
        name: 'Users',
        component: createAsyncComponent(() => import('@/views/users/index.vue')),
        meta: {
          title: '用户管理',
          icon: 'users'
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: createAsyncComponent(() => import('@/views/orders/index.vue')),
        meta: {
          title: '订单管理',
          icon: 'orders'
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: createAsyncComponent(() => import('@/views/analytics/index.vue')),
        meta: {
          title: '数据分析',
          icon: 'analytics',
          heavy: true // 标记为重型组件
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      layout: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由预加载
class RoutePreloader {
  private preloadedRoutes = new Set<string>()
  private preloadPromises = new Map<string, Promise<any>>()
  
  // 预加载路由组件
  async preloadRoute(routeName: string) {
    if (this.preloadedRoutes.has(routeName)) {
      return this.preloadPromises.get(routeName)
    }
    
    const route = routes.find(r => r.name === routeName || 
      r.children?.some(child => child.name === routeName))
    
    if (!route) return
    
    let targetRoute = route
    if (route.children) {
      targetRoute = route.children.find(child => child.name === routeName) || route
    }
    
    if (typeof targetRoute.component === 'function') {
      const promise = (targetRoute.component as Function)()
      this.preloadPromises.set(routeName, promise)
      this.preloadedRoutes.add(routeName)
      return promise
    }
  }
  
  // 预加载相关路由
  async preloadRelatedRoutes(currentRoute: string) {
    const relatedRoutes = this.getRelatedRoutes(currentRoute)
    const promises = relatedRoutes.map(route => this.preloadRoute(route))
    await Promise.allSettled(promises)
  }
  
  // 获取相关路由
  private getRelatedRoutes(currentRoute: string): string[] {
    const routeRelations: Record<string, string[]> = {
      'Dashboard': ['Users', 'Orders'],
      'Users': ['Dashboard', 'Orders'],
      'Orders': ['Users', 'Analytics']
    }
    
    return routeRelations[currentRoute] || []
  }
}

const routePreloader = new RoutePreloader()

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 预加载相关路由
  if (to.name && typeof to.name === 'string') {
    routePreloader.preloadRelatedRoutes(to.name)
  }
  
  next()
})

export default router
export { routePreloader }
```

### 3. 代码分割与模块化

#### 3.1 智能代码分割
```typescript
// bundleOptimizer.ts - 智能代码分割
import type { ManualChunksOption } from 'rollup'

// 分包策略配置
interface ChunkConfig {
  name: string
  test: (id: string) => boolean
  priority: number
  minSize: number
  maxSize: number
}

const chunkConfigs: ChunkConfig[] = [
  {
    name: 'vue-vendor',
    test: (id) => /[\/]node_modules[\/](vue|@vue|vue-router|pinia)[\/]/.test(id),
    priority: 10,
    minSize: 0,
    maxSize: 500000
  },
  {
    name: 'element-plus',
    test: (id) => /[\/]node_modules[\/]element-plus[\/]/.test(id),
    priority: 9,
    minSize: 0,
    maxSize: 800000
  },
  {
    name: 'ui-vendor',
    test: (id) => /[\/]node_modules[\/](@element-plus|@vueuse)[\/]/.test(id),
    priority: 8,
    minSize: 0,
    maxSize: 300000
  },
  {
    name: 'utils-vendor',
    test: (id) => /[\/]node_modules[\/](lodash|dayjs|axios|qs)[\/]/.test(id),
    priority: 7,
    minSize: 0,
    maxSize: 200000
  },
  {
    name: 'charts-vendor',
    test: (id) => /[\/]node_modules[\/](echarts|@antv|d3)[\/]/.test(id),
    priority: 6,
    minSize: 0,
    maxSize: 1000000
  },
  {
    name: 'vendor',
    test: (id) => /[\/]node_modules[\/]/.test(id),
    priority: 5,
    minSize: 0,
    maxSize: 500000
  }
]

// 智能分包函数
export const createManualChunks: ManualChunksOption = (id) => {
  // 排序配置按优先级
  const sortedConfigs = chunkConfigs.sort((a, b) => b.priority - a.priority)
  
  for (const config of sortedConfigs) {
    if (config.test(id)) {
      return config.name
    }
  }
  
  // 业务代码分割
  if (id.includes('/src/views/')) {
    const match = id.match(/\/src\/views\/([^\/]+)/)
    if (match) {
      return `page-${match[1]}`
    }
  }
  
  if (id.includes('/src/components/')) {
    return 'components'
  }
  
  if (id.includes('/src/utils/')) {
    return 'utils'
  }
  
  return undefined
}

// 动态导入优化
class DynamicImportOptimizer {
  private importCache = new Map<string, Promise<any>>()
  private importStats = new Map<string, { count: number, lastUsed: number }>()
  
  // 优化的动态导入
  async optimizedImport<T>(importFn: () => Promise<T>, key: string): Promise<T> {
    // 更新统计信息
    const stats = this.importStats.get(key) || { count: 0, lastUsed: 0 }
    stats.count++
    stats.lastUsed = Date.now()
    this.importStats.set(key, stats)
    
    // 检查缓存
    if (this.importCache.has(key)) {
      return this.importCache.get(key)!
    }
    
    // 执行导入
    const promise = importFn()
    this.importCache.set(key, promise)
    
    try {
      const result = await promise
      return result
    } catch (error) {
      // 导入失败时清除缓存
      this.importCache.delete(key)
      throw error
    }
  }
  
  // 预加载热门模块
  async preloadPopularModules() {
    const popularModules = Array.from(this.importStats.entries())
      .filter(([_, stats]) => stats.count > 3)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([key]) => key)
    
    console.log('Preloading popular modules:', popularModules)
    
    // 这里需要根据实际的模块映射来预加载
    // 示例实现
    for (const key of popularModules) {
      if (!this.importCache.has(key)) {
        // 根据 key 动态构建导入函数
        const importFn = this.createImportFunction(key)
        if (importFn) {
          this.optimizedImport(importFn, key).catch(console.error)
        }
      }
    }
  }
  
  // 创建导入函数
  private createImportFunction(key: string): (() => Promise<any>) | null {
    // 根据 key 的模式创建相应的导入函数
    if (key.startsWith('page-')) {
      const pageName = key.replace('page-', '')
      return () => import(`@/views/${pageName}/index.vue`)
    }
    
    if (key.startsWith('component-')) {
      const componentName = key.replace('component-', '')
      return () => import(`@/components/${componentName}.vue`)
    }
    
    return null
  }
  
  // 清理过期缓存
  cleanupCache() {
    const now = Date.now()
    const expireTime = 30 * 60 * 1000 // 30分钟
    
    for (const [key, stats] of this.importStats.entries()) {
      if (now - stats.lastUsed > expireTime) {
        this.importCache.delete(key)
        this.importStats.delete(key)
      }
    }
  }
  
  // 获取导入统计
  getImportStats() {
    return {
      cacheSize: this.importCache.size,
      statsSize: this.importStats.size,
      popularModules: Array.from(this.importStats.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10)
    }
  }
}

const dynamicImportOptimizer = new DynamicImportOptimizer()
export { dynamicImportOptimizer }
```

#### 3.2 模块联邦配置
```typescript
// moduleFederation.ts - 模块联邦配置
import { defineConfig } from 'vite'
import federation from '@originjs/vite-plugin-federation'

// 模块联邦配置
export const federationConfig = {
  name: 'element-plus-app',
  filename: 'remoteEntry.js',
  
  // 暴露的模块
  exposes: {
    './Button': './src/components/Button.vue',
    './Table': './src/components/Table.vue',
    './Form': './src/components/Form.vue',
    './utils': './src/utils/index.ts'
  },
  
  // 共享依赖
  shared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.3.0'
    },
    'vue-router': {
      singleton: true,
      requiredVersion: '^4.2.0'
    },
    'element-plus': {
      singleton: true,
      requiredVersion: '^2.4.0'
    },
    pinia: {
      singleton: true,
      requiredVersion: '^2.1.0'
    }
  },
  
  // 远程模块
  remotes: {
    'shared-components': 'http://localhost:3001/assets/remoteEntry.js',
    'micro-app': 'http://localhost:3002/assets/remoteEntry.js'
  }
}

// 微前端应用管理器
class MicroAppManager {
  private apps = new Map<string, any>()
  private loadingStates = new Map<string, boolean>()
  
  // 注册微应用
  registerApp(name: string, config: any) {
    this.apps.set(name, config)
  }
  
  // 加载微应用
  async loadApp(name: string): Promise<any> {
    if (this.loadingStates.get(name)) {
      return new Promise((resolve) => {
        const checkLoading = () => {
          if (!this.loadingStates.get(name)) {
            resolve(this.apps.get(name))
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }
    
    const config = this.apps.get(name)
    if (!config) {
      throw new Error(`Micro app ${name} not found`)
    }
    
    this.loadingStates.set(name, true)
    
    try {
      // 动态导入远程模块
      const module = await import(/* @vite-ignore */ config.entry)
      this.apps.set(name, module)
      return module
    } finally {
      this.loadingStates.set(name, false)
    }
  }
  
  // 预加载微应用
  async preloadApps(names: string[]) {
    const promises = names.map(name => 
      this.loadApp(name).catch(error => {
        console.warn(`Failed to preload app ${name}:`, error)
      })
    )
    
    await Promise.allSettled(promises)
  }
  
  // 卸载微应用
  unloadApp(name: string) {
    this.apps.delete(name)
    this.loadingStates.delete(name)
  }
  
  // 获取应用状态
  getAppStatus() {
    return {
      registered: Array.from(this.apps.keys()),
      loading: Array.from(this.loadingStates.entries())
        .filter(([_, loading]) => loading)
        .map(([name]) => name)
    }
  }
}

const microAppManager = new MicroAppManager()
export { microAppManager }
```

### 4. 构建性能优化

#### 4.1 构建缓存策略
```typescript
// buildCache.ts - 构建缓存优化
import { createHash } from 'crypto'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface CacheEntry {
  hash: string
  timestamp: number
  size: number
  dependencies: string[]
}

class BuildCache {
  private cacheDir = resolve(process.cwd(), 'node_modules/.cache/vite-build')
  private cacheIndex = new Map<string, CacheEntry>()
  private indexFile = resolve(this.cacheDir, 'index.json')
  
  constructor() {
    this.loadCacheIndex()
  }
  
  // 加载缓存索引
  private loadCacheIndex() {
    try {
      if (existsSync(this.indexFile)) {
        const data = readFileSync(this.indexFile, 'utf-8')
        const entries = JSON.parse(data)
        this.cacheIndex = new Map(Object.entries(entries))
      }
    } catch (error) {
      console.warn('Failed to load cache index:', error)
    }
  }
  
  // 保存缓存索引
  private saveCacheIndex() {
    try {
      const entries = Object.fromEntries(this.cacheIndex)
      writeFileSync(this.indexFile, JSON.stringify(entries, null, 2))
    } catch (error) {
      console.warn('Failed to save cache index:', error)
    }
  }
  
  // 计算文件哈希
  private calculateHash(content: string): string {
    return createHash('md5').update(content).digest('hex')
  }
  
  // 检查缓存是否有效
  isCacheValid(key: string, content: string, dependencies: string[] = []): boolean {
    const entry = this.cacheIndex.get(key)
    if (!entry) return false
    
    const currentHash = this.calculateHash(content)
    if (entry.hash !== currentHash) return false
    
    // 检查依赖是否变化
    for (const dep of dependencies) {
      if (!existsSync(dep)) return false
      
      const depContent = readFileSync(dep, 'utf-8')
      const depHash = this.calculateHash(depContent)
      const depEntry = this.cacheIndex.get(dep)
      
      if (!depEntry || depEntry.hash !== depHash) return false
    }
    
    return true
  }
  
  // 设置缓存
  setCache(key: string, content: string, dependencies: string[] = []) {
    const hash = this.calculateHash(content)
    const entry: CacheEntry = {
      hash,
      timestamp: Date.now(),
      size: content.length,
      dependencies
    }
    
    this.cacheIndex.set(key, entry)
    
    // 缓存依赖文件
    dependencies.forEach(dep => {
      if (existsSync(dep)) {
        const depContent = readFileSync(dep, 'utf-8')
        const depHash = this.calculateHash(depContent)
        this.cacheIndex.set(dep, {
          hash: depHash,
          timestamp: Date.now(),
          size: depContent.length,
          dependencies: []
        })
      }
    })
    
    this.saveCacheIndex()
  }
  
  // 清理过期缓存
  cleanupCache(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7天
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cacheIndex.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cacheIndex.delete(key)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} cache entries`)
      this.saveCacheIndex()
    }
  }
  
  // 获取缓存统计
  getCacheStats() {
    const entries = Array.from(this.cacheIndex.values())
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0)
    
    return {
      entryCount: entries.length,
      totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
      oldestEntry: Math.min(...entries.map(e => e.timestamp)),
      newestEntry: Math.max(...entries.map(e => e.timestamp))
    }
  }
}

const buildCache = new BuildCache()
export { buildCache }
```

#### 4.2 并行构建优化
```typescript
// parallelBuild.ts - 并行构建优化
import { Worker } from 'worker_threads'
import { cpus } from 'os'
import { resolve } from 'path'

interface BuildTask {
  id: string
  type: 'component' | 'page' | 'chunk'
  input: string
  output: string
  options: any
}

class ParallelBuilder {
  private workers: Worker[] = []
  private taskQueue: BuildTask[] = []
  private activeTasks = new Map<string, BuildTask>()
  private results = new Map<string, any>()
  private maxWorkers = Math.min(cpus().length, 8)
  
  constructor() {
    this.initWorkers()
  }
  
  // 初始化工作线程
  private initWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(resolve(__dirname, 'buildWorker.js'))
      
      worker.on('message', (result) => {
        this.handleWorkerResult(result)
      })
      
      worker.on('error', (error) => {
        console.error(`Worker ${i} error:`, error)
      })
      
      this.workers.push(worker)
    }
  }
  
  // 添加构建任务
  addTask(task: BuildTask) {
    this.taskQueue.push(task)
    this.processQueue()
  }
  
  // 批量添加任务
  addTasks(tasks: BuildTask[]) {
    this.taskQueue.push(...tasks)
    this.processQueue()
  }
  
  // 处理任务队列
  private processQueue() {
    while (this.taskQueue.length > 0 && this.activeTasks.size < this.maxWorkers) {
      const task = this.taskQueue.shift()!
      const availableWorker = this.workers.find(worker => 
        !Array.from(this.activeTasks.values()).some(activeTask => 
          activeTask.workerId === worker.threadId
        )
      )
      
      if (availableWorker) {
        this.activeTasks.set(task.id, { ...task, workerId: availableWorker.threadId })
        availableWorker.postMessage(task)
      } else {
        // 没有可用的工作线程，重新放回队列
        this.taskQueue.unshift(task)
        break
      }
    }
  }
  
  // 处理工作线程结果
  private handleWorkerResult(result: any) {
    const { taskId, success, data, error } = result
    const task = this.activeTasks.get(taskId)
    
    if (task) {
      this.activeTasks.delete(taskId)
      
      if (success) {
        this.results.set(taskId, data)
        console.log(`Task ${taskId} completed successfully`)
      } else {
        console.error(`Task ${taskId} failed:`, error)
      }
      
      // 继续处理队列
      this.processQueue()
    }
  }
  
  // 等待所有任务完成
  async waitForCompletion(): Promise<Map<string, any>> {
    return new Promise((resolve) => {
      const checkCompletion = () => {
        if (this.taskQueue.length === 0 && this.activeTasks.size === 0) {
          resolve(this.results)
        } else {
          setTimeout(checkCompletion, 100)
        }
      }
      checkCompletion()
    })
  }
  
  // 获取构建进度
  getProgress() {
    const total = this.results.size + this.activeTasks.size + this.taskQueue.length
    const completed = this.results.size
    
    return {
      total,
      completed,
      active: this.activeTasks.size,
      pending: this.taskQueue.length,
      progress: total > 0 ? (completed / total) * 100 : 0
    }
  }
  
  // 清理资源
  cleanup() {
    this.workers.forEach(worker => worker.terminate())
    this.workers = []
    this.taskQueue = []
    this.activeTasks.clear()
    this.results.clear()
  }
}

// 构建工作线程代码
const buildWorkerCode = `
const { parentPort } = require('worker_threads')
const { build } = require('vite')

parentPort.on('message', async (task) => {
  try {
    const result = await build({
      configFile: false,
      build: {
        lib: {
          entry: task.input,
          name: task.id,
          fileName: (format) => \`\${task.id}.\${format}.js\`
        },
        outDir: task.output,
        ...task.options
      }
    })
    
    parentPort.postMessage({
      taskId: task.id,
      success: true,
      data: result
    })
  } catch (error) {
    parentPort.postMessage({
      taskId: task.id,
      success: false,
      error: error.message
    })
  }
})
`

// 创建工作线程文件
import { writeFileSync } from 'fs'
const workerFile = resolve(__dirname, 'buildWorker.js')
writeFileSync(workerFile, buildWorkerCode)

const parallelBuilder = new ParallelBuilder()
export { parallelBuilder }
```

### 5. 生产环境优化

#### 5.1 资源优化策略
```typescript
// productionOptimizer.ts - 生产环境优化
import { defineConfig } from 'vite'
import { resolve } from 'path'

// 生产环境优化配置
export const productionConfig = defineConfig({
  build: {
    // 目标环境
    target: ['es2015', 'chrome58', 'firefox57', 'safari11'],
    
    // 输出配置
    outDir: 'dist',
    assetsDir: 'static',
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        // 移除 console
        drop_console: true,
        drop_debugger: true,
        // 移除无用代码
        dead_code: true,
        // 优化条件表达式
        conditionals: true,
        // 优化布尔值
        booleans: true,
        // 优化循环
        loops: true,
        // 移除未使用的函数参数
        unused: true,
        // 内联函数
        inline: 2,
        // 移除无用的变量
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        // 混淆变量名
        toplevel: true,
        // 保留类名
        keep_classnames: true,
        // 保留函数名
        keep_fnames: false
      },
      format: {
        // 移除注释
        comments: false
      }
    },
    
    // CSS 代码分割
    cssCodeSplit: true,
    
    // 生成 sourcemap
    sourcemap: false,
    
    // Rollup 配置
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // 分包配置
        manualChunks: (id) => {
          // 第三方库
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vue-vendor'
            }
            if (id.includes('element-plus')) {
              return 'element-vendor'
            }
            if (id.includes('lodash') || id.includes('dayjs')) {
              return 'utils-vendor'
            }
            if (id.includes('echarts') || id.includes('@antv')) {
              return 'charts-vendor'
            }
            return 'vendor'
          }
          
          // 业务代码
          if (id.includes('/src/views/')) {
            const match = id.match(/\/src\/views\/([^\/]+)/)
            if (match) {
              return `page-${match[1]}`
            }
          }
          
          if (id.includes('/src/components/')) {
            return 'components'
          }
        },
        
        // 文件命名策略
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk'
          return `js/${name}-[hash].js`
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`
          }
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].${ext}`
          }
          
          return `assets/[name]-[hash].${ext}`
        }
      },
      
      // 外部依赖
      external: (id) => {
        // CDN 依赖
        const cdnDeps = ['vue', 'vue-router', 'element-plus']
        return cdnDeps.some(dep => id === dep || id.startsWith(`${dep}/`))
      }
    },
    
    // 包大小分析
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  
  // 实验性功能
  experimental: {
    // 构建优化
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType === 'js') {
        return { js: `window.__assetsPath(${JSON.stringify(filename)})` }
      } else {
        return { relative: true }
      }
    }
  }
})

// 资源优化器
class AssetOptimizer {
  private optimizations = new Map<string, any>()
  
  // 图片优化
  optimizeImages(config: any) {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        // 图片压缩
        {
          name: 'image-optimization',
          generateBundle(options, bundle) {
            Object.keys(bundle).forEach(fileName => {
              const file = bundle[fileName]
              if (file.type === 'asset' && /\.(png|jpe?g|gif|svg)$/i.test(fileName)) {
                // 这里可以集成图片压缩库
                console.log(`Optimizing image: ${fileName}`)
              }
            })
          }
        }
      ]
    }
  }
  
  // CSS 优化
  optimizeCSS(config: any) {
    return {
      ...config,
      css: {
        ...config.css,
        postcss: {
          plugins: [
            require('autoprefixer'),
            require('cssnano')({
              preset: ['default', {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                colormin: true,
                convertValues: true,
                discardDuplicates: true,
                discardEmpty: true,
                mergeRules: true,
                minifyFontValues: true,
                minifySelectors: true
              }]
            })
          ]
        }
      }
    }
  }
  
  // 字体优化
  optimizeFonts(config: any) {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        {
          name: 'font-optimization',
          generateBundle(options, bundle) {
            Object.keys(bundle).forEach(fileName => {
              const file = bundle[fileName]
              if (file.type === 'asset' && /\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
                console.log(`Processing font: ${fileName}`)
                // 可以在这里添加字体子集化逻辑
              }
            })
          }
        }
      ]
    }
  }
  
  // 生成资源清单
  generateManifest(config: any) {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        {
          name: 'asset-manifest',
          generateBundle(options, bundle) {
            const manifest = {}
            
            Object.keys(bundle).forEach(fileName => {
              const file = bundle[fileName]
              if (file.type === 'chunk' && file.isEntry) {
                manifest[file.name] = fileName
              }
            })
            
            this.emitFile({
              type: 'asset',
              fileName: 'manifest.json',
              source: JSON.stringify(manifest, null, 2)
            })
          }
        }
      ]
    }
  }
  
  // 应用所有优化
  applyOptimizations(config: any) {
    let optimizedConfig = config
    
    optimizedConfig = this.optimizeImages(optimizedConfig)
    optimizedConfig = this.optimizeCSS(optimizedConfig)
    optimizedConfig = this.optimizeFonts(optimizedConfig)
    optimizedConfig = this.generateManifest(optimizedConfig)
    
    return optimizedConfig
  }
}

const assetOptimizer = new AssetOptimizer()
export { assetOptimizer }
```

#### 5.2 CDN 和缓存策略
```typescript
// cdnOptimizer.ts - CDN 和缓存优化
interface CDNConfig {
  baseUrl: string
  version: string
  dependencies: Record<string, string>
  fallback: boolean
}

class CDNOptimizer {
  private config: CDNConfig
  private fallbackMap = new Map<string, string>()
  
  constructor(config: CDNConfig) {
    this.config = config
    this.setupFallbacks()
  }
  
  // 设置回退机制
  private setupFallbacks() {
    Object.entries(this.config.dependencies).forEach(([name, version]) => {
      const localPath = `node_modules/${name}/dist/index.js`
      this.fallbackMap.set(name, localPath)
    })
  }
  
  // 生成 CDN 链接
  generateCDNUrl(name: string, version: string, file = 'index.js'): string {
    return `${this.config.baseUrl}/${name}@${version}/${file}`
  }
  
  // 生成 HTML 模板
  generateHTMLTemplate(): string {
    const cdnLinks = Object.entries(this.config.dependencies)
      .map(([name, version]) => {
        const url = this.generateCDNUrl(name, version)
        const fallback = this.fallbackMap.get(name)
        
        return `
    <script>
      (function() {
        var script = document.createElement('script');
        script.src = '${url}';
        script.onerror = function() {
          console.warn('CDN failed for ${name}, loading fallback');
          var fallbackScript = document.createElement('script');
          fallbackScript.src = '${fallback}';
          document.head.appendChild(fallbackScript);
        };
        document.head.appendChild(script);
      })();
    </script>`
      })
      .join('')
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Element Plus App</title>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/css/main.css" as="style">
  
  <!-- DNS prefetch for CDN -->
  <link rel="dns-prefetch" href="${this.config.baseUrl}">
  
  <!-- CDN dependencies -->${cdnLinks}
  
  <!-- Critical CSS -->
  <style>
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
  </style>
</head>
<body>
  <div id="app">
    <div class="loading">Loading...</div>
  </div>
  
  <!-- App scripts will be injected here -->
</body>
</html>`
  }
  
  // 生成缓存配置
  generateCacheConfig() {
    return {
      // 静态资源缓存策略
      staticAssets: {
        // 图片缓存 1 年
        images: {
          pattern: /\.(png|jpe?g|gif|svg|webp|avif)$/,
          maxAge: 365 * 24 * 60 * 60,
          immutable: true
        },
        
        // 字体缓存 1 年
        fonts: {
          pattern: /\.(woff2?|eot|ttf|otf)$/,
          maxAge: 365 * 24 * 60 * 60,
          immutable: true
        },
        
        // JS/CSS 缓存 1 年（带 hash）
        scripts: {
          pattern: /\.(js|css)$/,
          maxAge: 365 * 24 * 60 * 60,
          immutable: true
        },
        
        // HTML 缓存 1 小时
        html: {
          pattern: /\.html$/,
          maxAge: 60 * 60,
          mustRevalidate: true
        }
      },
      
      // Service Worker 配置
      serviceWorker: {
        enabled: true,
        strategies: {
          // 应用外壳缓存优先
          appShell: 'CacheFirst',
          // API 网络优先
          api: 'NetworkFirst',
          // 静态资源缓存优先
          static: 'CacheFirst',
          // 图片缓存优先，网络回退
          images: 'CacheFirst'
        }
      }
    }
  }
  
  // 生成 Service Worker
  generateServiceWorker(): string {
    return `
const CACHE_NAME = 'element-plus-app-v${this.config.version}';
const STATIC_CACHE = 'static-v${this.config.version}';
const API_CACHE = 'api-v${this.config.version}';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/css/main.css',
  '/js/main.js'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('element-plus-app-') && 
                     cacheName !== CACHE_NAME &&
                     cacheName !== STATIC_CACHE &&
                     cacheName !== API_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API 请求 - 网络优先
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  
  // 静态资源 - 缓存优先
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }
  
  // HTML 文档 - 网络优先，缓存回退
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => {
              return response || caches.match('/');
            });
        })
    );
  }
});

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`
  }
}

const cdnOptimizer = new CDNOptimizer({
  baseUrl: 'https://unpkg.com',
  version: '1.0.0',
  dependencies: {
    'vue': '^3.3.0',
    'vue-router': '^4.2.0',
    'element-plus': '^2.4.0'
  },
  fallback: true
})

export { cdnOptimizer }
```

## 实践练习

### 练习1：Vite 配置优化
```typescript
// 创建优化的 Vite 配置
// 1. 配置自动导入
// 2. 设置代码分割策略
// 3. 优化构建性能
// 4. 配置开发服务器
```

### 练习2：按需加载实现
```typescript
// 实现 Element Plus 按需加载
// 1. 配置组件按需导入
// 2. 实现样式按需加载
// 3. 优化路由懒加载
// 4. 实现预加载策略
```

### 练习3：构建性能优化
```typescript
// 优化构建性能
// 1. 实现构建缓存
// 2. 配置并行构建
// 3. 优化包分析
// 4. 实现增量构建
```

### 练习4：生产环境部署
```typescript
// 配置生产环境优化
// 1. 配置资源压缩
// 2. 实现 CDN 部署
// 3. 配置缓存策略
// 4. 实现 Service Worker
```

## 学习资源

### 官方文档
- [Vite 官方文档](https://vitejs.dev/)
- [Rollup 配置指南](https://rollupjs.org/guide/)
- [Terser 压缩配置](https://terser.org/)

### 工具和插件
- [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
- [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
- [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression)

### 性能优化
- [Web Performance](https://web.dev/performance/)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 作业

1. **配置优化**：为项目配置完整的 Vite 构建优化
2. **按需加载**：实现 Element Plus 组件和样式的按需加载
3. **性能分析**：使用工具分析构建产物并优化
4. **部署策略**：设计完整的生产环境部署方案
5. **缓存策略**：实现多层级的缓存优化策略

## 下一步学习

明天我们将学习「Element Plus 主题系统深入定制」，包括：
- CSS 变量系统
- SCSS 变量定制
- 主题切换实现
- 动态主题生成