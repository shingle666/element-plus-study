import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 基础配置
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  
  // 多语言配置
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      title: 'Element Plus 学习宝典',
      description: 'Element Plus 深度学习计划 - 系统掌握组件库开发'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Element Plus Study Guide',
      description: 'Element Plus Deep Learning Plan - Master Component Library Development'
    }
  },
  vite: {
    ssr: {
      noExternal: ['element-plus']
    },
    optimizeDeps: {
      include: ['element-plus']
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus']
          }
        }
      }
    }
  },
  // 全局标题和描述（作为默认值）
  title: "Element Plus 学习宝典",
  description: "Element Plus 深度学习计划 - 系统掌握组件库开发",
  
  // 站点元数据
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#409eff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:title', content: 'Element Plus 学习宝典' }],
    ['meta', { property: 'og:site_name', content: 'Element Plus 学习宝典' }],
    ['meta', { property: 'og:image', content: '/og-image.svg' }],
    ['meta', { property: 'og:url', content: 'https://edlo.cn/' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'keywords', content: 'Element Plus, Vue3, 组件库, 前端开发, UI框架' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    
    locales: {
      root: {
         label: '简体中文',
         selectText: '选择语言',
         ariaLabel: '选择语言',
         editLinkText: '在 GitHub 上编辑此页面',
        nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📚 学习宝典', link: '/zh-cn/element-plus-study-guide' },
      { text: '📝 更新日志', link: '/zh-cn/changelog' },
      {
        text: '📋 基础学习',
        items: [
          { text: '🎯 基础概念', link: '/zh-cn/basic-concepts/design-principles-and-basic-concepts' },
          { text: '🧩 基础组件', link: '/zh-cn/basic-components/button' },
          { text: '📝 表单组件', link: '/zh-cn/form-components/input' },
          { text: '📊 数据展示', link: '/zh-cn/data-display-components/table' },
          { text: '🧭 导航组件', link: '/zh-cn/navigation-components/menu' },
          { text: '💬 反馈组件', link: '/zh-cn/feedback-components/alert' },
          { text: '⚙️ 配置组件', link: '/zh-cn/configuration-components/config-provider' },
          { text: '🔧 其他组件', link: '/zh-cn/other-components/layout-and-container-advanced' }
        ]
      },
      {
        text: '🏗️ 架构设计',
        items: [
          { text: '🏛️ 架构设计', link: '/zh-cn/architecture-design/overall-architecture-and-design-philosophy' },
          { text: '⚡ 高级特性', link: '/zh-cn/advanced-features/comprehensive-practice' },
          { text: '🎨 高级主题', link: '/zh-cn/advanced-topics/component-extension-and-customization' },
          { text: '🚀 性能优化', link: '/zh-cn/performance-optimization/component-performance-analysis' }
        ]
      },
      {
        text: '🌐 企业级应用',
        items: [
          { text: '🖥️ SSR渲染', link: '/zh-cn/ssr-server-side-rendering/basic-concepts-and-environment-setup' },
          { text: '🌍 国际化无障碍', link: '/zh-cn/internationalization-and-accessibility/internationalization-system-detailed' },
          { text: '🔗 Vue生态', link: '/zh-cn/vue-ecosystem-integration/deep-integration-with-vue-router' },
          { text: '⚙️ 工程化构建', link: '/zh-cn/engineering-and-build/build-system-deep-dive-vite-typescript' },
          { text: '📱 跨平台开发', link: '/zh-cn/cross-platform-development/cross-platform-development-practice' }
        ]
      },
      {
        text: '🤝 贡献与实践',
        items: [
          { text: '💼 项目实践', link: '/zh-cn/project-practice/comprehensive-project-practice-one' },
          { text: '🔓 开源贡献', link: '/zh-cn/open-source-contribution/development-process-and-code-standards' },
          { text: '👥 社区贡献', link: '/zh-cn/community-contribution/community-contribution-and-open-source-practice' },
          { text: '📈 总结规划', link: '/zh-cn/summary-and-planning/learning-summary-and-advanced-planning' }
        ]
      }
    ],

        sidebar: {
      '/basic-concepts/': [
        {
          text: '基础概念',
          items: [
            { text: '设计原则与基础概念', link: '/basic-concepts/design-principles-and-basic-concepts' },
            { text: '环境搭建与快速开始', link: '/quickstart' }
          ]
        }
      ],
      '/basic-components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/basic-components/button' },
            { text: 'Border 边框', link: '/basic-components/border' },
            { text: 'Color 色彩', link: '/basic-components/color' },
            { text: 'Container 布局容器', link: '/basic-components/container' },
            { text: 'Layout 布局', link: '/basic-components/layout' },
            { text: 'Space 间距', link: '/basic-components/space' },
            { text: 'Text 文本', link: '/basic-components/text' },
            { text: 'Link 链接', link: '/basic-components/link' },
            { text: 'Typography 排版', link: '/basic-components/typography' },
            { text: 'Icon 图标', link: '/basic-components/icon' },
            { text: 'Scrollbar 滚动条', link: '/basic-components/scrollbar' },
            { text: 'Splitter 分隔面板', link: '/basic-components/splitter' }
          ]
        }
      ],
      '/form-components/': [
        {
          text: '表单组件',
          items: [
            { text: 'Autocomplete 自动补全输入框', link: '/form-components/autocomplete' },
            { text: 'Cascader 级联选择器', link: '/form-components/cascader' },
            { text: 'Checkbox 多选框', link: '/form-components/checkbox' },
            { text: 'Color Picker 取色器', link: '/form-components/color-picker' },
            { text: 'Date Picker 日期选择器', link: '/form-components/date-picker' },
            { text: 'DateTime Picker 日期时间选择器', link: '/form-components/datetime-picker' },
            { text: 'Form 表单', link: '/form-components/form' },
            { text: 'Form 表单验证与优化', link: '/form-components/form-validation-optimization' },
            { text: 'Input Number 数字输入框', link: '/form-components/input-number' },
            { text: 'Input Tag 标签输入框', link: '/form-components/input-tag' },
            { text: 'Input 输入框', link: '/form-components/input' },
            { text: 'Mention 提及', link: '/form-components/mention' },
            { text: 'Radio 单选框', link: '/form-components/radio' },
            { text: 'Rate 评分', link: '/form-components/rate' },
            { text: 'Select 选择器', link: '/form-components/select' },
            { text: 'Slider 滑块', link: '/form-components/slider' },
            { text: 'Switch 开关', link: '/form-components/switch' },
            { text: 'Time Picker 时间选择器', link: '/form-components/time-picker' },
            { text: 'Time Select 时间选择', link: '/form-components/time-select' },
            { text: 'Transfer 穿梭框', link: '/form-components/transfer' },
            { text: 'TreeSelect 树形选择', link: '/form-components/tree-select' },
            { text: 'Upload 上传', link: '/form-components/upload' },
            { text: 'Virtualized Select 虚拟化选择器', link: '/form-components/virtualized-select' }
          ]
        }
      ],
      '/data-display-components/': [
        {
          text: '数据展示组件',
          items: [
            { text: 'Avatar 头像', link: '/data-display-components/avatar' },
            { text: 'Badge 徽章', link: '/data-display-components/badge' },
            { text: 'Calendar 日历', link: '/data-display-components/calendar' },
            { text: 'Card 卡片', link: '/data-display-components/card' },
            { text: 'Carousel 走马灯', link: '/data-display-components/carousel' },
            { text: 'Collapse 折叠面板', link: '/data-display-components/collapse' },
            { text: 'Descriptions 描述列表', link: '/data-display-components/descriptions' },
            { text: 'Empty 空状态', link: '/data-display-components/empty' },
            { text: 'Image 图片', link: '/data-display-components/image' },
            { text: 'Infinite Scroll 无限滚动', link: '/data-display-components/infinite-scroll' },
            { text: 'Pagination 分页', link: '/data-display-components/pagination' },
            { text: 'Progress 进度条', link: '/data-display-components/progress' },
            { text: 'Result 结果', link: '/data-display-components/result' },
            { text: 'Segmented 分段控制器', link: '/data-display-components/segmented' },
            { text: 'Skeleton 骨架屏', link: '/data-display-components/skeleton' },
            { text: 'Statistic 统计组件', link: '/data-display-components/statistic' },
            { text: 'Table 表格', link: '/data-display-components/table' },
            { text: 'Tag 标签', link: '/data-display-components/tag' },
            { text: 'Timeline 时间线', link: '/data-display-components/timeline' },
            { text: 'Tour 漫游式引导', link: '/data-display-components/tour' },
            { text: 'Tree 树形控件', link: '/data-display-components/tree' },
            { text: 'Virtualized Table 虚拟化表格', link: '/data-display-components/virtualized-table' },
            { text: 'Virtualized Tree 虚拟化树形控件', link: '/data-display-components/virtualized-tree' }
          ]
        }
      ],
      '/navigation-components/': [
        {
          text: '导航组件',
          items: [
            { text: 'Affix 固钉', link: '/navigation-components/affix' },
            { text: 'Anchor 锚点', link: '/navigation-components/anchor' },
            { text: 'Backtop 回到顶部', link: '/navigation-components/backtop' },
            { text: 'Breadcrumb 面包屑', link: '/navigation-components/breadcrumb' },
            { text: 'Dropdown 下拉菜单', link: '/navigation-components/dropdown' },
            { text: 'Menu 菜单', link: '/navigation-components/menu' },
            { text: 'Page Header 页头', link: '/navigation-components/page-header' },
            { text: 'Steps 步骤条', link: '/navigation-components/steps' },
            { text: 'Tabs 标签页', link: '/navigation-components/tabs' }
          ]
        }
      ],
      '/feedback-components/': [
        {
          text: '反馈组件',
          items: [
            { text: 'Alert 提示', link: '/feedback-components/alert' },
            { text: 'Dialog 对话框', link: '/feedback-components/dialog' },
            { text: 'Drawer 抽屉', link: '/feedback-components/drawer' },
            { text: 'Loading 加载', link: '/feedback-components/loading' },
            { text: 'Message Box 消息弹出框', link: '/feedback-components/message-box' },
            { text: 'Message 消息提示', link: '/feedback-components/message' },
            { text: 'Notification 通知', link: '/feedback-components/notification' },
            { text: 'Popconfirm 气泡确认框', link: '/feedback-components/popconfirm' },
            { text: 'Popover 弹出框', link: '/feedback-components/popover' },
            { text: 'Tooltip 文字提示', link: '/feedback-components/tooltip' }
          ]
        }
      ],
      '/other-components/': [
        {
          text: '其他组件',
          items: [
            { text: '布局与容器进阶', link: '/other-components/01-layout-container-advanced' },
            { text: '工具类组件', link: '/other-components/02-utility-components' },
            { text: '特效与动画', link: '/other-components/03-effects-animations' },
            { text: '特殊功能组件', link: '/other-components/04-special-function-components' },
            { text: 'Divider 分割线', link: '/other-components/divider' },
            { text: 'Watermark 水印', link: '/other-components/watermark' }
          ]
        }
      ],
      '/architecture-design/': [
        {
          text: '架构设计',
          items: [
            { text: '整体架构与设计理念', link: '/architecture-design/01-overall-architecture-design-philosophy' },
            { text: '组件设计模式分析', link: '/architecture-design/02-component-design-pattern-analysis' },
            { text: 'Vue3CompositionAPI应用', link: '/architecture-design/03-vue3-composition-api-application' },
            { text: '组件通信机制深入', link: '/architecture-design/04-component-communication-mechanism' },
            { text: '响应式系统与数据绑定', link: '/architecture-design/05-reactive-system-data-binding' },
            { text: '生命周期管理与钩子函数', link: '/architecture-design/06-lifecycle-management-hooks' },
            { text: '插件系统与扩展机制', link: '/architecture-design/07-plugin-system-extension-mechanism' },
            { text: '测试策略与质量保证', link: '/architecture-design/08-testing-strategy-quality-assurance' },
            { text: '性能优化策略', link: '/architecture-design/09-performance-optimization-strategy' }
          ]
        }
      ],
      '/advanced-features/': [
        {
          text: '高级特性',
          items: [
            { text: '综合实践', link: '/advanced-features/01-comprehensive-practice' },
            { text: '插件系统深入', link: '/advanced-features/02-plugin-system-deep-dive' },
            { text: '高级主题定制与设计系统', link: '/advanced-features/03-advanced-theme-customization-design-system' },
            { text: '微前端架构实践', link: '/advanced-features/04-micro-frontend-architecture-practice' },
            { text: '自定义指令在组件中的应用', link: '/advanced-features/05-custom-directives-in-components' },
            { text: '组件库二次开发', link: '/advanced-features/06-component-library-secondary-development' },
            { text: '组件间复杂通信模式', link: '/advanced-features/07-complex-component-communication-patterns' }
          ]
        }
      ],
      '/advanced-topics/': [
        {
          text: '高级主题',
          items: [
            { text: '组件扩展与自定义', link: '/advanced-topics/01-component-extension-customization' },
            { text: '性能优化与最佳实践', link: '/advanced-topics/02-performance-optimization-best-practices' },
            { text: '主题系统深入定制', link: '/advanced-topics/03-theme-system-deep-customization' },
            { text: '国际化深入应用', link: '/advanced-topics/04-internationalization-deep-application' },
            { text: '全局配置与命名空间', link: '/advanced-topics/05-global-configuration-namespace' },
            { text: '暗黑模式与自适应主题', link: '/advanced-topics/06-dark-mode-adaptive-theme' },
            { text: '响应式设计与移动端适配', link: '/advanced-topics/07-responsive-design-mobile-adaptation' },
            { text: '微前端架构与模块联邦', link: '/advanced-topics/08-micro-frontend-module-federation' },
            { text: '可视化编辑器开发', link: '/advanced-topics/09-visual-editor-development' },
            { text: '数据可视化与图表集成', link: '/advanced-topics/10-data-visualization-chart-integration' },
            { text: '自定义组件库开发', link: '/advanced-topics/11-custom-component-library-development' },
            { text: '插件生态系统构建', link: '/advanced-topics/12-plugin-ecosystem-construction' },
            { text: '企业级应用架构设计', link: '/advanced-topics/13-enterprise-application-architecture-design' }
          ]
        }
      ],
      '/zh-cn/performance-optimization/': [
        {
          text: '性能优化',
          items: [
            { text: '组件性能分析', link: '/zh-cn/performance-optimization/component-performance-analysis' },
            { text: 'Table组件大数据优化', link: '/zh-cn/performance-optimization/table-component-large-data-optimization' },
            { text: 'Select组件大选项优化', link: '/zh-cn/performance-optimization/select-component-large-options-optimization' },
            { text: 'Tree组件大数据渲染优化', link: '/zh-cn/performance-optimization/tree-component-large-data-rendering-optimization' },
            { text: '综合实践', link: '/zh-cn/performance-optimization/comprehensive-practice' }
          ]
        }
      ],
      '/zh-cn/internationalization-and-accessibility/': [
        {
          text: '国际化与无障碍',
          items: [
            { text: '国际化系统详解', link: '/zh-cn/internationalization-and-accessibility/internationalization-system-detailed' },
            { text: '多语言切换实现与动态配置', link: '/zh-cn/internationalization-and-accessibility/multi-language-switching-implementation-and-dynamic-configuration' },
            { text: 'RTL右到左布局支持', link: '/zh-cn/internationalization-and-accessibility/rtl-right-to-left-layout-support' },
            { text: 'Day.js时间本地化配置', link: '/zh-cn/internationalization-and-accessibility/dayjs-time-localization-configuration' },
            { text: '无障碍设计实践与ARIA属性应用', link: '/zh-cn/internationalization-and-accessibility/accessibility-design-practice-and-aria-attributes' },
            { text: '键盘导航与屏幕阅读器支持', link: '/zh-cn/internationalization-and-accessibility/keyboard-navigation-and-screen-reader-support' },
            { text: '综合实践', link: '/zh-cn/internationalization-and-accessibility/comprehensive-practice' }
          ]
        }
      ],
      '/zh-cn/project-practice/': [
        {
          text: '项目实践',
          items: [
            { text: '综合项目实战一', link: '/zh-cn/project-practice/comprehensive-project-practice-one' },
            { text: '综合项目实战二', link: '/zh-cn/project-practice/comprehensive-project-practice-two' },
            { text: '综合项目实战三', link: '/zh-cn/project-practice/comprehensive-project-practice-three' },
            { text: '综合项目实战四', link: '/zh-cn/project-practice/comprehensive-project-practice-four' },
            { text: '第二周项目实践', link: '/zh-cn/project-practice/second-week-project-practice' },
            { text: '第三周项目实践', link: '/zh-cn/project-practice/third-week-project-practice' },
            { text: '综合项目开发', link: '/zh-cn/project-practice/comprehensive-project-development' },
            { text: '第一周总结与项目实践', link: '/zh-cn/project-practice/first-week-summary-and-project-practice' },
            { text: '项目实战总结与最佳实践', link: '/zh-cn/project-practice/project-practice-summary-and-best-practices' },
            { text: '高级特性综合项目实践', link: '/zh-cn/project-practice/advanced-features-comprehensive-project-practice' },
            { text: '综合项目展示与作品集', link: '/zh-cn/project-practice/comprehensive-project-showcase-and-portfolio' },
            { text: '综合项目展示与作品集最终版', link: '/zh-cn/project-practice/comprehensive-project-showcase-and-portfolio-final' },
            { text: '项目实战总结与最佳实践补充', link: '/zh-cn/project-practice/project-practice-summary-and-best-practices-supplement' }
          ]
        }
      ],
      '/zh-cn/ssr-server-side-rendering/': [
        {
          text: 'SSR服务端渲染',
          items: [
            { text: '基础概念与环境搭建', link: '/zh-cn/ssr-server-side-rendering/basic-concepts-and-environment-setup' },
            { text: 'Nuxt.js集成与配置', link: '/zh-cn/ssr-server-side-rendering/nuxtjs-integration-and-configuration' },
            { text: '服务端渲染支持与配置', link: '/zh-cn/ssr-server-side-rendering/server-side-rendering-support-and-configuration' },
            { text: '水合错误处理与优化', link: '/zh-cn/ssr-server-side-rendering/hydration-error-handling-and-optimization' },
            { text: '性能优化与缓存策略', link: '/zh-cn/ssr-server-side-rendering/performance-optimization-and-caching-strategies' },
            { text: '部署与运维', link: '/zh-cn/ssr-server-side-rendering/deployment-and-operations' },
            { text: '综合实践', link: '/zh-cn/ssr-server-side-rendering/comprehensive-practice' }
          ]
        }
      ],
      '/zh-cn/vue-ecosystem-integration/': [
        {
          text: 'Vue生态集成',
          items: [
            { text: '与VueRouter深度集成', link: '/zh-cn/vue-ecosystem-integration/vue-router-deep-integration' },
            { text: '与Pinia状态管理', link: '/zh-cn/vue-ecosystem-integration/pinia-state-management' },
            { text: '迁移工具使用与实践', link: '/zh-cn/vue-ecosystem-integration/migration-tools-usage-and-practice' }
          ]
        }
      ],
      '/zh-cn/engineering-and-build/': [
        {
          text: '工程化与构建',
          items: [
            { text: '构建系统深入ViteTypeScript', link: '/zh-cn/engineering-and-build/build-system-deep-vite-typescript' },
            { text: '测试体系与质量保证', link: '/zh-cn/engineering-and-build/testing-strategies-and-quality-assurance' },
            { text: '工程化配置与构建优化', link: '/zh-cn/engineering-and-build/engineering-configuration-and-build-optimization' },
            { text: '部署与生产环境优化', link: '/zh-cn/engineering-and-build/deployment-and-production-optimization' }
          ]
        }
      ],
      '/zh-cn/open-source-contribution/': [
        {
          text: '开源贡献',
          items: [
            { text: '开发流程与代码规范', link: '/zh-cn/open-source-contribution/development-process-and-code-standards' },
            { text: '代码贡献与PullRequest流程', link: '/zh-cn/open-source-contribution/code-contribution-and-pull-request-process' },
            { text: '测试编写与代码质量保证', link: '/zh-cn/open-source-contribution/test-writing-and-code-quality-assurance' },
            { text: '社区参与建设与维护实践', link: '/zh-cn/open-source-contribution/community-support-and-issue-handling' },
            { text: '社区参与建设与维护实践补充', link: '/zh-cn/open-source-contribution/community-participation-and-maintenance-practice-supplement' }
          ]
        }
      ],
      '/zh-cn/community-contribution/': [
        {
          text: '社区贡献',
          items: [
            { text: '社区贡献与开源实践', link: '/zh-cn/community-contribution/community-contribution-and-open-source-practice' },
            { text: '开源项目深度参与', link: '/zh-cn/community-contribution/open-source-project-deep-participation' },
            { text: 'Bug修复与功能增强贡献', link: '/zh-cn/community-contribution/bug-fixing-and-feature-development' },
            { text: '文档改进与翻译', link: '/zh-cn/community-contribution/documentation-writing-and-translation' },
            { text: '版本发布与变更管理', link: '/zh-cn/community-contribution/version-release-and-change-management' },
            { text: '生态系统建设', link: '/zh-cn/community-contribution/ecosystem-tool-development' },
            { text: '开源贡献综合实践', link: '/zh-cn/community-contribution/open-source-contribution-comprehensive-practice' },
            { text: '源码贡献实践', link: '/zh-cn/community-contribution/source-code-contribution-practice' }
          ]
        }
      ],
      '/zh-cn/configuration-components/': [
        {
          text: '配置组件',
          items: [
            { text: 'Config Provider 全局配置', link: '/zh-cn/configuration-components/config-provider' }
          ]
        }
      ],
      '/zh-cn/cross-platform-development/': [
        {
          text: '跨平台开发',
          items: [
            { text: '跨平台开发实践', link: '/zh-cn/cross-platform-development/cross-platform-development-practice' }
          ]
        }
      ],
      '/zh-cn/summary-and-planning/': [
        {
          text: '总结与规划',
          items: [
            { text: '学习总结与进阶规划', link: '/zh-cn/summary-and-planning/learning-summary-and-advanced-planning' },
            { text: '第二阶段总结与评估', link: '/zh-cn/summary-and-planning/second-phase-summary-and-evaluation' },
            { text: '最佳实践总结', link: '/zh-cn/summary-and-planning/best-practices-summary' },
            { text: '技术分享与知识传播', link: '/zh-cn/summary-and-planning/technical-sharing-and-knowledge-dissemination' },
            { text: '未来发展趋势分析', link: '/zh-cn/summary-and-planning/future-development-trend-analysis' },
            { text: '基于ElementPlus的组件库设计', link: '/zh-cn/summary-and-planning/element-plus-based-component-library-design' },
            { text: '相关职业发展规划', link: '/zh-cn/summary-and-planning/related-career-development-planning' },
            { text: '进阶学习规划', link: '/zh-cn/summary-and-planning/advanced-learning-planning' },
            { text: '精通总结与持续学习计划', link: '/zh-cn/summary-and-planning/mastery-summary-and-continuous-learning-plan' },
            { text: '未来发展趋势与技术展望', link: '/zh-cn/summary-and-planning/future-development-trends-and-technology-outlook' }
          ]
        }
      ]
    },

        socialLinks: [
          { icon: 'github', link: 'https://cnb.cool/zxui/element-plus-study' }
        ],

        search: {
          provider: 'local'
        },

        editLink: {
          pattern: 'https://cnb.cool/zxui/element-plus-study/edit/main/docs/:path',
          text: '在 Git 上编辑此页面'
        },
        
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },



        docFooter: {
          prev: '上一页',
          next: '下一页'
        },

        outline: {
          label: '页面导航'
        },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',

        footer: {
          message: 'Element Plus 学习红宝书',
          copyright: 'Copyright © 2025 edlo.cn - Element Plus Study Guide'
        }
      },

      en: {
         label: 'English',
         selectText: 'Languages',
         ariaLabel: 'Select language',
         editLinkText: 'Edit this page on GitHub',
        nav: [
          { text: '🏠 Home', link: '/en/' },
          { text: '📚 Study Guide', link: '/en/element-plus-study-guide' },
          { text: '📝 Changelog', link: '/en/changelog' },
          {
            text: '📋 Basic Learning',
            items: [
              { text: '🎯 Basic Concepts', link: '/en/basic-concepts/design-principles-and-basic-concepts' },
              { text: '🧩 Basic Components', link: '/en/basic-components/button' },
              { text: '📝 Form Components', link: '/en/form-components/input' },
              { text: '📊 Data Display', link: '/en/data-display-components/table' },
              { text: '🧭 Navigation', link: '/en/navigation-components/menu' },
              { text: '💬 Feedback', link: '/en/feedback-components/alert' },
              { text: '⚙️ Configuration', link: '/en/components/config-provider' },
              { text: '🔧 Others', link: '/en/other-components/divider' }
            ]
          },
          {
            text: '🏗️ Architecture',
            items: [
              { text: '🏛️ Architecture Design', link: '/en/architecture-design/overall-architecture-and-design-philosophy' },
              { text: '⚡ Advanced Features', link: '/en/advanced-features/comprehensive-practice' },
              { text: '🎨 Advanced Topics', link: '/en/advanced-topics/component-extension-and-customization' },
              { text: '🚀 Performance Optimization', link: '/en/performance-optimization/component-performance-analysis' }
            ]
          },
          {
            text: '🌐 Enterprise Applications',
            items: [
              { text: '🖥️ SSR Rendering', link: '/en/ssr-server-side-rendering/basic-concepts-and-environment-setup' },
              { text: '🌍 Internationalization', link: '/en/internationalization-and-accessibility/internationalization-system-detailed' },
              { text: '🔗 Vue Ecosystem', link: '/en/vue-ecosystem-integration/deep-integration-with-vue-router' },
              { text: '⚙️ Engineering', link: '/en/engineering-and-build/build-system-deep-vite-typescript' },
              { text: '📱 Cross-platform', link: '/en/cross-platform-development/cross-platform-development-practice' }
            ]
          },
          {
            text: '🤝 Contribution & Practice',
            items: [
              { text: '💼 Project Practice', link: '/en/project-practice/comprehensive-project-practice-one' },
              { text: '🔓 Open Source Contribution', link: '/en/open-source-contribution/development-process-and-code-standards' },
              { text: '👥 Community Contribution', link: '/en/community-contribution/community-contribution-and-open-source-practice' },
              { text: '📈 Summary & Planning', link: '/en/summary-and-planning/learning-summary-and-advanced-planning' }
            ]
          }
        ],

        sidebar: {
          '/en/basic-concepts/': [
            {
              text: 'Basic Concepts',
              items: [
                { text: 'Design Principles & Basic Concepts', link: '/en/basic-concepts/design-principles-and-basic-concepts' },
                { text: 'Environment Setup & Quick Start', link: '/en/quickstart' }
              ]
            }
          ],
          '/en/basic-components/': [
            {
              text: 'Basic Components',
              items: [
                { text: 'Button', link: '/en/basic-components/button' },
                { text: 'Border', link: '/en/basic-components/border' },
                { text: 'Color', link: '/en/basic-components/color' },
                { text: 'Container', link: '/en/basic-components/container' },
                { text: 'Layout', link: '/en/basic-components/layout' },
                { text: 'Space', link: '/en/basic-components/space' }
              ]
            }
          ],
          '/en/form-components/': [
            {
              text: 'Form Components',
              items: [
                { text: 'Form', link: '/en/form-components/form' },
                { text: 'Input', link: '/en/form-components/input' },
                { text: 'Select', link: '/en/form-components/select' },
                { text: 'Autocomplete', link: '/en/form-components/autocomplete' }
              ]
            }
          ],
          '/en/data-display-components/': [
            {
              text: 'Data Display Components',
              items: [
                { text: 'Table', link: '/en/data-display-components/table' },
                { text: 'Tag', link: '/en/data-display-components/tag' },
                { text: 'Card', link: '/en/data-display-components/card' },
                { text: 'Empty', link: '/en/data-display-components/empty' },
                { text: 'Pagination', link: '/en/data-display-components/pagination' }
              ]
            }
          ],
          '/en/navigation-components/': [
            {
              text: 'Navigation Components',
              items: [
                { text: 'Menu', link: '/en/navigation-components/menu' },
                { text: 'Breadcrumb', link: '/en/navigation-components/breadcrumb' },
                { text: 'Dropdown', link: '/en/navigation-components/dropdown' },
                { text: 'Steps', link: '/en/navigation-components/steps' },
                { text: 'Tabs', link: '/en/navigation-components/tabs' }
              ]
            }
          ],
          '/en/feedback-components/': [
            {
              text: 'Feedback Components',
              items: [
                { text: 'Alert', link: '/en/feedback-components/alert' },
                { text: 'Dialog', link: '/en/feedback-components/dialog' },
                { text: 'Loading', link: '/en/feedback-components/loading' },
                { text: 'Message', link: '/en/feedback-components/message' },
                { text: 'Notification', link: '/en/feedback-components/notification' },
                { text: 'Popover', link: '/en/feedback-components/popover' }
              ]
            }
          ],
          '/en/other-components/': [
            {
              text: 'Other Components',
              items: [
                { text: 'Divider', link: '/en/other-components/divider' }
              ]
            }
          ],
          '/en/architecture-design/': [
            {
              text: 'Architecture Design',
              items: [
                { text: 'Overall Architecture & Design Philosophy', link: '/en/architecture-design/overall-architecture-and-design-philosophy' },
                { text: 'Component Design Pattern Analysis', link: '/en/architecture-design/component-design-pattern-analysis' },
                { text: 'Component Design Patterns', link: '/en/architecture-design/component-design-patterns' },
                { text: 'Vue3 Composition API Application', link: '/en/architecture-design/vue3-composition-api-application' }
              ]
            }
          ],
          '/en/advanced-features/': [
            {
              text: 'Advanced Features',
              items: [
                { text: 'Advanced Theme Customization & Design System', link: '/en/advanced-features/advanced-theme-customization-and-design-system' },
                { text: 'Comprehensive Practice', link: '/en/advanced-features/comprehensive-practice' },
                { text: 'Performance Optimization', link: '/en/advanced-features/performance-optimization' },
                { text: 'Plugin System Deep', link: '/en/advanced-features/plugin-system-deep' },
                { text: 'Theme Customization', link: '/en/advanced-features/theme-customization' }
              ]
            }
          ],
          '/en/advanced-topics/': [
            {
              text: 'Advanced Topics',
              items: [
                { text: 'Component Extension & Customization', link: '/en/advanced-topics/component-extension-and-customization' },
                { text: 'Component Library Architecture Design', link: '/en/advanced-topics/component-library-architecture-design' },
                { text: 'Vue3 New Features Deep Application', link: '/en/advanced-topics/vue3-new-features-deep-application' }
              ]
            }
          ],
          '/en/performance-optimization/': [
            {
              text: 'Performance Optimization',
              items: [
                { text: 'Component Performance Analysis', link: '/en/performance-optimization/component-performance-analysis' },
                { text: 'Component Performance Optimization Strategies', link: '/en/performance-optimization/component-performance-optimization-strategies' },
                { text: 'Large Data Processing & Virtual Scrolling', link: '/en/performance-optimization/large-data-processing-and-virtual-scrolling' },
                { text: 'Select Component Large Options Optimization', link: '/en/performance-optimization/select-component-large-options-optimization' },
                { text: 'Table Component Large Data Optimization', link: '/en/performance-optimization/table-component-large-data-optimization' }
              ]
            }
          ],
          '/en/internationalization-and-accessibility/': [
            {
              text: 'Internationalization & Accessibility',
              items: [
                { text: 'Accessibility Design & Implementation', link: '/en/internationalization-and-accessibility/accessibility-design-and-implementation' },
                { text: 'Internationalization System Detailed', link: '/en/internationalization-and-accessibility/internationalization-system-detailed' },
                { text: 'Multi-language Component Development', link: '/en/internationalization-and-accessibility/multi-language-component-development' },
                { text: 'Multi-language Switching Implementation & Dynamic Configuration', link: '/en/internationalization-and-accessibility/multi-language-switching-implementation-and-dynamic-configuration' },
                { text: 'RTL Right-to-left Layout Support', link: '/en/internationalization-and-accessibility/rtl-right-to-left-layout-support' }
              ]
            }
          ],
          '/en/project-practice/': [
            {
              text: 'Project Practice',
              items: [
                { text: 'Advanced Features Comprehensive Project Practice', link: '/en/project-practice/advanced-features-comprehensive-project-practice' },
                { text: 'Component Library Design & Maintenance', link: '/en/project-practice/component-library-design-and-maintenance' },
                { text: 'Comprehensive Project Practice One', link: '/en/project-practice/comprehensive-project-practice-one' },
                { text: 'Comprehensive Project Practice Two', link: '/en/project-practice/comprehensive-project-practice-two' },
                { text: 'Enterprise Level Project Architecture Design', link: '/en/project-practice/enterprise-level-project-architecture-design' },
                { text: 'Large Scale Application Performance Optimization', link: '/en/project-practice/large-scale-application-performance-optimization' }
              ]
            }
          ],
          '/en/ssr-server-side-rendering/': [
            {
              text: 'SSR Server Side Rendering',
              items: [
                { text: 'Basic Concepts & Environment Setup', link: '/en/ssr-server-side-rendering/basic-concepts-and-environment-setup' },
                { text: 'Comprehensive Practice', link: '/en/ssr-server-side-rendering/comprehensive-practice' },
                { text: 'Deployment & Operations', link: '/en/ssr-server-side-rendering/deployment-and-operations' },
                { text: 'Hydration Error Handling & Optimization', link: '/en/ssr-server-side-rendering/hydration-error-handling-and-optimization' },
                { text: 'Nuxt.js Integration', link: '/en/ssr-server-side-rendering/nuxtjs-integration' },
                { text: 'Nuxt.js Integration & Configuration', link: '/en/ssr-server-side-rendering/nuxtjs-integration-and-configuration' },
                { text: 'Performance Monitoring & Debugging', link: '/en/ssr-server-side-rendering/performance-monitoring-and-debugging' },
                { text: 'Performance Optimization', link: '/en/ssr-server-side-rendering/performance-optimization' }
              ]
            }
          ],
          '/en/vue-ecosystem-integration/': [
            {
              text: 'Vue Ecosystem Integration',
              items: [
                { text: 'Deep Integration with Vue Router', link: '/en/vue-ecosystem-integration/deep-integration-with-vue-router' },
                { text: 'Pinia State Management', link: '/en/vue-ecosystem-integration/pinia-state-management' },
                { text: 'Pinia State Management Integration', link: '/en/vue-ecosystem-integration/pinia-state-management-integration' },
                { text: 'Vite Build Tool Integration', link: '/en/vue-ecosystem-integration/vite-build-tool-integration' },
                { text: 'Vue Router Integration', link: '/en/vue-ecosystem-integration/vue-router-integration' },
                { text: 'Vue Router Integration & Optimization', link: '/en/vue-ecosystem-integration/vue-router-integration-and-optimization' },
                { text: 'VueUse Utilities Integration', link: '/en/vue-ecosystem-integration/vueuse-utilities-integration' }
              ]
            }
          ],
          '/en/engineering-and-build/': [
            {
              text: 'Engineering & Build',
              items: [
                { text: 'Build Optimization & Deployment', link: '/en/engineering-and-build/build-optimization-and-deployment' },
                { text: 'Build System Deep Vite TypeScript', link: '/en/engineering-and-build/build-system-deep-vite-typescript' },
                { text: 'Code Quality & Static Analysis', link: '/en/engineering-and-build/code-quality-and-static-analysis' },
                { text: 'Deployment Strategies & Environment Management', link: '/en/engineering-and-build/deployment-strategies-and-environment-management' },
                { text: 'Internationalization & Localization', link: '/en/engineering-and-build/internationalization-and-localization' },
                { text: 'Micro Frontend Architecture & Module Federation', link: '/en/engineering-and-build/micro-frontend-architecture-and-module-federation' },
                { text: 'Monitoring & Logging Systems', link: '/en/engineering-and-build/monitoring-and-logging-systems' },
                { text: 'Performance Optimization & Monitoring', link: '/en/engineering-and-build/performance-optimization-and-monitoring' },
                { text: 'Project Structure & Standards', link: '/en/engineering-and-build/project-structure-and-standards' },
                { text: 'Security Best Practices', link: '/en/engineering-and-build/security-best-practices' },
                { text: 'Testing Strategies & Quality Assurance', link: '/en/engineering-and-build/testing-strategies-and-quality-assurance' }
              ]
            }
          ],
          '/en/cross-platform-development/': [
            {
              text: 'Cross Platform Development',
              items: [
                { text: 'Cross Platform Development Practice', link: '/en/cross-platform-development/cross-platform-development-practice' },
                { text: 'Electron Desktop Application Development', link: '/en/cross-platform-development/electron-desktop-application-development' },
                { text: 'Mobile Adaptation & Responsive Design', link: '/en/cross-platform-development/mobile-adaptation-and-responsive-design' },
                { text: 'PWA Progressive Web App Integration', link: '/en/cross-platform-development/pwa-progressive-web-app-integration' }
              ]
            }
          ],
          '/en/open-source-contribution/': [
            {
              text: 'Open Source Contribution',
              items: [
                { text: 'Bug Fixing & Feature Development', link: '/en/open-source-contribution/bug-fixing-and-feature-development' },
                { text: 'Code Contribution & Pull Request Process', link: '/en/open-source-contribution/code-contribution-and-pull-request-process' },
                { text: 'Contribution Guide & Development Process', link: '/en/open-source-contribution/contribution-guide-and-development-process' },
                { text: 'Development Process & Code Standards', link: '/en/open-source-contribution/development-process-and-code-standards' },
                { text: 'Element Plus Source Code Analysis', link: '/en/open-source-contribution/element-plus-source-code-analysis' }
              ]
            }
          ],
          '/en/community-contribution/': [
            {
              text: 'Community Contribution',
              items: [
                { text: 'Community Contribution & Open Source Practice', link: '/en/community-contribution/community-contribution-and-open-source-practice' },
                { text: 'Community Support & Issue Handling', link: '/en/community-contribution/community-support-and-issue-handling' },
                { text: 'Documentation Writing & Translation', link: '/en/community-contribution/documentation-writing-and-translation' },
                { text: 'Ecosystem Tool Development', link: '/en/community-contribution/ecosystem-tool-development' }
              ]
            }
          ],
          '/en/summary-and-planning/': [
            {
              text: 'Summary & Planning',
              items: [
                { text: 'Learning Summary & Advanced Planning', link: '/en/summary-and-planning/learning-summary-and-advanced-planning' }
              ]
            }
          ],
          '/en/best-practices/': [
            {
              text: 'Best Practices',
              items: [
                { text: 'Coding Standards', link: '/en/best-practices/coding-standards' },
                { text: 'Performance Best Practices', link: '/en/best-practices/performance-best-practices' },
                { text: 'Security Best Practices', link: '/en/best-practices/security-best-practices' }
              ]
            }
          ],
          '/en/components/': [
            {
              text: 'Components Advanced Usage',
              items: [
                { text: 'Basic Components', link: '/en/components/basic-components/button-component-advanced-usage' },
                { text: 'Form Components', link: '/en/components/form-components/form-component-advanced-usage' },
                { text: 'Data Display', link: '/en/components/data-display/table-component-advanced-usage' },
                { text: 'Navigation Components', link: '/en/components/navigation-components/menu-component-advanced-usage' },
                { text: 'Feedback Components', link: '/en/components/feedback-components/dialog-component-advanced-usage' }
              ]
            }
          ],
          '/en/engineering-build-and-toolchain/': [
            {
              text: 'Engineering Build & Toolchain',
              items: [
                { text: 'Build System & Packaging Strategy', link: '/en/engineering-build-and-toolchain/build-system-and-packaging-strategy' },
                { text: 'CI/CD & Automated Testing', link: '/en/engineering-build-and-toolchain/ci-cd-and-automated-testing' },
                { text: 'Development Environment & Debugging Tools', link: '/en/engineering-build-and-toolchain/development-environment-and-debugging-tools' }
              ]
            }
          ],
          '/en/internationalization/': [
            {
              text: 'Internationalization',
              items: [
                { text: 'I18n & Localization', link: '/en/internationalization/i18n-and-localization' }
              ]
            }
          ],
          '/en/ssr-and-isomorphic-applications/': [
            {
              text: 'SSR & Isomorphic Applications',
              items: [
                { text: 'Component SSR Compatibility', link: '/en/ssr-and-isomorphic-applications/component-ssr-compatibility' },
                { text: 'Hydration Strategy & Performance', link: '/en/ssr-and-isomorphic-applications/hydration-strategy-and-performance' },
                { text: 'SSR Integration & Optimization', link: '/en/ssr-and-isomorphic-applications/ssr-integration-and-optimization' }
              ]
            }
          ],
          '/en/testing/': [
            {
              text: 'Testing',
              items: [
                { text: 'Unit Testing', link: '/en/testing/unit-testing' },
                { text: 'Integration Testing', link: '/en/testing/integration-testing' },
                { text: 'E2E Testing', link: '/en/testing/e2e-testing' }
              ]
            }
          ]
        },

        socialLinks: [
          { icon: 'github', link: 'https://github.com/shingle666/element-plus-study' },
          { icon: 'discord', link: 'https://discord.gg/gXK9XNzW3X' }
        ],

        search: {
          provider: 'local'
        },

        editLink: {
          pattern: 'https://cnb.cool/zxui/element-plus-study/edit/main/docs/:path',
          text: 'Edit this page on Git'
        },
        
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },



        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },

        outline: {
          label: 'On this page'
        },

        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',

        footer: {
          message: 'Element Plus Study Guide',
          copyright: 'Copyright © 2025 edlo.cn - Element Plus Study Guide'
        }
      }
    }
  }
})
