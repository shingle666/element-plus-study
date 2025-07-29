import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['element-plus']
    },
    optimizeDeps: {
      include: ['element-plus']
    }
  },
  title: "Element Plus 学习宝典",
  description: "Element Plus 深度学习计划 - 系统掌握组件库开发",
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#409eff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:title', content: 'Element Plus 学习宝典' }],
    ['meta', { property: 'og:site_name', content: 'Element Plus 学习宝典' }],
    ['meta', { property: 'og:image', content: '/og-image.svg' }],
    ['meta', { property: 'og:url', content: 'https://edlo.cn/' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Element Plus 学习宝典',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 首页', link: '/' },
      { text: '📚 学习宝典', link: '/Element Plus学习宝典' },
      {
        text: '📋 基础学习',
        items: [
          { text: '🎯 基础概念', link: '/基础概念/01.设计原则与基础概念' },
          { text: '🧩 基础组件', link: '/基础组件/Button 按钮' },
          { text: '📝 表单组件', link: '/表单组件/01.基础输入组件' },
          { text: '📊 数据展示', link: '/数据展示组件/01.基础数据展示' },
          { text: '🧭 导航组件', link: '/导航组件/01.菜单面包屑步骤条' },
          { text: '💬 反馈组件', link: '/反馈组件/01.消息反馈组件' },
          { text: '🔧 其他组件', link: '/其他组件/01.布局与容器进阶' }
        ]
      },
      {
        text: '🏗️ 架构设计',
        items: [
          { text: '🏛️ 架构设计', link: '/架构设计/01.整体架构与设计理念' },
          { text: '⚡ 高级特性', link: '/高级特性/01.综合实践' },
          { text: '🎨 高级主题', link: '/高级主题/01.组件扩展与自定义' },
          { text: '🚀 性能优化', link: '/性能优化/01.组件性能分析' }
        ]
      },
      {
        text: '🌐 企业级应用',
        items: [
          { text: '🖥️ SSR渲染', link: '/SSR服务端渲染/01.基础概念与环境搭建' },
          { text: '🌍 国际化无障碍', link: '/国际化与无障碍/01.国际化系统详解' },
          { text: '🔗 Vue生态', link: '/Vue生态集成/01.与VueRouter深度集成' },
          { text: '⚙️ 工程化构建', link: '/工程化与构建/01.构建系统深入ViteTypeScript' },
          { text: '📱 跨平台开发', link: '/跨平台开发/01.跨平台开发实践' }
        ]
      },
      {
        text: '🤝 贡献与实践',
        items: [
          { text: '💼 项目实践', link: '/项目实践/01.综合项目实战一' },
          { text: '🔓 开源贡献', link: '/开源贡献/01.开发流程与代码规范' },
          { text: '👥 社区贡献', link: '/社区贡献/01.社区贡献与开源实践' },
          { text: '📈 总结规划', link: '/总结与规划/01.学习总结与进阶规划' }
        ]
      }
    ],

    sidebar: {
      '/基础概念/': [
        {
          text: '基础概念',
          items: [
            { text: '设计原则与基础概念', link: '/基础概念/01.设计原则与基础概念' },
            { text: '环境搭建与快速开始', link: '/基础概念/02.环境搭建与快速开始' }
          ]
        }
      ],
      '/基础组件/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/基础组件/Button 按钮' },
            { text: 'Border 边框', link: '/基础组件/Border 边框' },
            { text: 'Color 色彩', link: '/基础组件/Color 色彩' },
            { text: 'Container 布局容器', link: '/基础组件/Container 布局容器' },
            { text: 'Layout 布局', link: '/基础组件/Layout 布局' },
            { text: 'Space 间距', link: '/基础组件/Space 间距' },
            { text: 'Text 文本', link: '/基础组件/Text 文本' },
            { text: 'Link 链接', link: '/基础组件/Link 链接' },
            { text: 'Typography 排版', link: '/基础组件/Typography 排版' },
            { text: 'Icon 图标', link: '/基础组件/Icon 图标' },
            { text: 'Scrollbar 滚动条', link: '/基础组件/Scrollbar 滚动条' },
            { text: 'Splitter 分隔面板', link: '/基础组件/Splitter 分隔面板' }
          ]
        }
      ],
      '/表单组件/': [
        {
          text: '表单组件',
          items: [
            { text: '基础输入组件', link: '/表单组件/01.基础输入组件' },
            { text: '选择器组件', link: '/表单组件/02.选择器组件' },
            { text: '高级选择器一', link: '/表单组件/03.高级选择器一' },
            { text: '高级选择器二', link: '/表单组件/04.高级选择器二' },
            { text: '日期时间组件', link: '/表单组件/05.日期时间组件' },
            { text: '特殊输入组件', link: '/表单组件/06.特殊输入组件' },
            { text: '新特性组件', link: '/表单组件/07.新特性组件' },
            { text: '表单验证与优化', link: '/表单组件/08.表单验证与优化' }
          ]
        }
      ],
      '/数据展示组件/': [
        {
          text: '数据展示组件',
          items: [
            { text: '基础数据展示', link: '/数据展示组件/01.基础数据展示' },
            { text: '高级数据展示', link: '/数据展示组件/02.高级数据展示' },
            { text: '树形与虚拟化组件', link: '/数据展示组件/03.树形与虚拟化组件' }
          ]
        }
      ],
      '/导航组件/': [
        {
          text: '导航组件',
          items: [
            { text: '菜单面包屑步骤条', link: '/导航组件/01.菜单面包屑步骤条' }
          ]
        }
      ],
      '/反馈组件/': [
        {
          text: '反馈组件',
          items: [
            { text: '消息反馈组件', link: '/反馈组件/01.消息反馈组件' },
            { text: '弹出层组件', link: '/反馈组件/02.弹出层组件' },
            { text: '加载与引导组件', link: '/反馈组件/03.加载与引导组件' }
          ]
        }
      ],
      '/其他组件/': [
        {
          text: '其他组件',
          items: [
            { text: '布局与容器进阶', link: '/其他组件/01.布局与容器进阶' },
            { text: '工具类组件', link: '/其他组件/02.工具类组件' },
            { text: '特效与动画', link: '/其他组件/03.特效与动画' },
            { text: '特殊功能组件', link: '/其他组件/04.特殊功能组件' },
            { text: 'Divider 分割线', link: '/其他组件/Divider 分割线' },
            { text: 'Watermark 水印', link: '/其他组件/Watermark 水印' }
          ]
        }
      ],
      '/架构设计/': [
        {
          text: '架构设计',
          items: [
            { text: '整体架构与设计理念', link: '/架构设计/01.整体架构与设计理念' },
            { text: '组件设计模式分析', link: '/架构设计/02.组件设计模式分析' },
            { text: 'Vue3CompositionAPI应用', link: '/架构设计/03.Vue3CompositionAPI应用' },
            { text: '组件通信机制深入', link: '/架构设计/04.组件通信机制深入' },
            { text: '响应式系统与数据绑定', link: '/架构设计/05.响应式系统与数据绑定' },
            { text: '生命周期管理与钩子函数', link: '/架构设计/06.生命周期管理与钩子函数' },
            { text: '插件系统与扩展机制', link: '/架构设计/07.插件系统与扩展机制' },
            { text: '测试策略与质量保证', link: '/架构设计/08.测试策略与质量保证' },
            { text: '性能优化策略', link: '/架构设计/09.性能优化策略' }
          ]
        }
      ],
      '/高级特性/': [
        {
          text: '高级特性',
          items: [
            { text: '综合实践', link: '/高级特性/01.综合实践' },
            { text: '插件系统深入', link: '/高级特性/02.插件系统深入' },
            { text: '高级主题定制与设计系统', link: '/高级特性/03.高级主题定制与设计系统' },
            { text: '微前端架构实践', link: '/高级特性/04.微前端架构实践' },
            { text: '自定义指令在组件中的应用', link: '/高级特性/05.自定义指令在组件中的应用' },
            { text: '组件库二次开发', link: '/高级特性/06.组件库二次开发' },
            { text: '组件间复杂通信模式', link: '/高级特性/07.组件间复杂通信模式' }
          ]
        }
      ],
      '/高级主题/': [
        {
          text: '高级主题',
          items: [
            { text: '组件扩展与自定义', link: '/高级主题/01.组件扩展与自定义' },
            { text: '性能优化与最佳实践', link: '/高级主题/02.性能优化与最佳实践' },
            { text: '主题系统深入定制', link: '/高级主题/03.主题系统深入定制' },
            { text: '国际化深入应用', link: '/高级主题/04.国际化深入应用' },
            { text: '全局配置与命名空间', link: '/高级主题/05.全局配置与命名空间' },
            { text: '暗黑模式与自适应主题', link: '/高级主题/06.暗黑模式与自适应主题' },
            { text: '响应式设计与移动端适配', link: '/高级主题/07.响应式设计与移动端适配' },
            { text: '微前端架构与模块联邦', link: '/高级主题/08.微前端架构与模块联邦' },
            { text: '可视化编辑器开发', link: '/高级主题/09.可视化编辑器开发' },
            { text: '数据可视化与图表集成', link: '/高级主题/10.数据可视化与图表集成' },
            { text: '自定义组件库开发', link: '/高级主题/11.自定义组件库开发' },
            { text: '插件生态系统构建', link: '/高级主题/12.插件生态系统构建' },
            { text: '企业级应用架构设计', link: '/高级主题/13.企业级应用架构设计' }
          ]
        }
      ],
      '/性能优化/': [
        {
          text: '性能优化',
          items: [
            { text: '组件性能分析', link: '/性能优化/01.组件性能分析' },
            { text: 'Table组件大数据优化', link: '/性能优化/02.Table组件大数据优化' },
            { text: 'Select组件大选项优化', link: '/性能优化/03.Select组件大选项优化' },
            { text: 'Tree组件大数据渲染优化', link: '/性能优化/04.Tree组件大数据渲染优化' },
            { text: '综合实践', link: '/性能优化/05.综合实践' }
          ]
        }
      ],
      '/国际化与无障碍/': [
        {
          text: '国际化与无障碍',
          items: [
            { text: '国际化系统详解', link: '/国际化与无障碍/01.国际化系统详解' },
            { text: '多语言切换实现与动态配置', link: '/国际化与无障碍/02.多语言切换实现与动态配置' },
            { text: 'RTL右到左布局支持', link: '/国际化与无障碍/03.RTL右到左布局支持' },
            { text: 'Day.js时间本地化配置', link: '/国际化与无障碍/04.Day.js时间本地化配置' },
            { text: '无障碍设计实践与ARIA属性应用', link: '/国际化与无障碍/05.无障碍设计实践与ARIA属性应用' },
            { text: '键盘导航与屏幕阅读器支持', link: '/国际化与无障碍/06.键盘导航与屏幕阅读器支持' },
            { text: '综合实践', link: '/国际化与无障碍/07.综合实践' }
          ]
        }
      ],
      '/项目实践/': [
        {
          text: '项目实践',
          items: [
            { text: '综合项目实战一', link: '/项目实践/01.综合项目实战一' },
            { text: '综合项目实战二', link: '/项目实践/02.综合项目实战二' },
            { text: '综合项目实战三', link: '/项目实践/03.综合项目实战三' },
            { text: '综合项目实战四', link: '/项目实践/04.综合项目实战四' },
            { text: '第二周项目实践', link: '/项目实践/05.第二周项目实践' },
            { text: '第三周项目实践', link: '/项目实践/06.第三周项目实践' },
            { text: '综合项目开发', link: '/项目实践/07.综合项目开发' },
            { text: '第一周总结与项目实践', link: '/项目实践/08.第一周总结与项目实践' },
            { text: '项目实战总结与最佳实践', link: '/项目实践/09.项目实战总结与最佳实践' },
            { text: '高级特性综合项目实践', link: '/项目实践/10.高级特性综合项目实践' },
            { text: '综合项目展示与作品集', link: '/项目实践/11.综合项目展示与作品集' },
            { text: '综合项目展示与作品集最终版', link: '/项目实践/12.综合项目展示与作品集最终版' },
            { text: '项目实战总结与最佳实践补充', link: '/项目实践/13.项目实战总结与最佳实践补充' }
          ]
        }
      ],
      '/SSR服务端渲染/': [
        {
          text: 'SSR服务端渲染',
          items: [
            { text: '基础概念与环境搭建', link: '/SSR服务端渲染/01.基础概念与环境搭建' },
            { text: 'Nuxt.js集成与配置', link: '/SSR服务端渲染/02.Nuxt.js集成与配置' },
            { text: '服务端渲染支持与配置', link: '/SSR服务端渲染/03.服务端渲染支持与配置' },
            { text: '水合错误处理与优化', link: '/SSR服务端渲染/04.水合错误处理与优化' },
            { text: '性能优化与缓存策略', link: '/SSR服务端渲染/05.性能优化与缓存策略' },
            { text: '部署与运维', link: '/SSR服务端渲染/06.部署与运维' },
            { text: '综合实践', link: '/SSR服务端渲染/07.综合实践' }
          ]
        }
      ],
      '/Vue生态集成/': [
        {
          text: 'Vue生态集成',
          items: [
            { text: '与VueRouter深度集成', link: '/Vue生态集成/01.与VueRouter深度集成' },
            { text: '与Pinia状态管理', link: '/Vue生态集成/02.与Pinia状态管理' },
            { text: '迁移工具使用与实践', link: '/Vue生态集成/03.迁移工具使用与实践' }
          ]
        }
      ],
      '/工程化与构建/': [
        {
          text: '工程化与构建',
          items: [
            { text: '构建系统深入ViteTypeScript', link: '/工程化与构建/01.构建系统深入ViteTypeScript' },
            { text: '测试体系与质量保证', link: '/工程化与构建/02.测试体系与质量保证' },
            { text: '工程化配置与构建优化', link: '/工程化与构建/03.工程化配置与构建优化' },
            { text: '部署与生产环境优化', link: '/工程化与构建/04.部署与生产环境优化' }
          ]
        }
      ],
      '/开源贡献/': [
        {
          text: '开源贡献',
          items: [
            { text: '开发流程与代码规范', link: '/开源贡献/01.开发流程与代码规范' },
            { text: '代码贡献与PullRequest流程', link: '/开源贡献/02.代码贡献与PullRequest流程' },
            { text: '测试编写与代码质量保证', link: '/开源贡献/03.测试编写与代码质量保证' },
            { text: '社区参与建设与维护实践', link: '/开源贡献/04.社区参与建设与维护实践' },
            { text: '社区参与建设与维护实践补充', link: '/开源贡献/05.社区参与建设与维护实践补充' }
          ]
        }
      ],
      '/社区贡献/': [
        {
          text: '社区贡献',
          items: [
            { text: '社区贡献与开源实践', link: '/社区贡献/01.社区贡献与开源实践' },
            { text: '开源项目深度参与', link: '/社区贡献/02.开源项目深度参与' },
            { text: 'Bug修复与功能增强贡献', link: '/社区贡献/03.Bug修复与功能增强贡献' },
            { text: '文档改进与翻译', link: '/社区贡献/04.文档改进与翻译' },
            { text: '版本发布与变更管理', link: '/社区贡献/05.版本发布与变更管理' },
            { text: '生态系统建设', link: '/社区贡献/06.生态系统建设' },
            { text: '开源贡献综合实践', link: '/社区贡献/07.开源贡献综合实践' },
            { text: '源码贡献实践', link: '/社区贡献/08.源码贡献实践' }
          ]
        }
      ],
      '/跨平台开发/': [
        {
          text: '跨平台开发',
          items: [
            { text: '跨平台开发实践', link: '/跨平台开发/01.跨平台开发实践' }
          ]
        }
      ],
      '/总结与规划/': [
        {
          text: '总结与规划',
          items: [
            { text: '学习总结与进阶规划', link: '/总结与规划/01.学习总结与进阶规划' },
            { text: '第二阶段总结与评估', link: '/总结与规划/02.第二阶段总结与评估' },
            { text: '最佳实践总结', link: '/总结与规划/03.最佳实践总结' },
            { text: '技术分享与知识传播', link: '/总结与规划/04.技术分享与知识传播' },
            { text: '未来发展趋势分析', link: '/总结与规划/05.未来发展趋势分析' },
            { text: '基于ElementPlus的组件库设计', link: '/总结与规划/06.基于ElementPlus的组件库设计' },
            { text: '相关职业发展规划', link: '/总结与规划/07.相关职业发展规划' },
            { text: '进阶学习规划', link: '/总结与规划/08.进阶学习规划' },
            { text: '精通总结与持续学习计划', link: '/总结与规划/09.精通总结与持续学习计划' },
            { text: '未来发展趋势与技术展望', link: '/总结与规划/10.未来发展趋势与技术展望' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/element-plus/element-plus' },
      { icon: 'discord', link: 'https://discord.gg/gXK9XNzW3X' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/shingle666/element-plus-study/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
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
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 edlo.cn - Element Plus Study Guide'
    }
  }
})
