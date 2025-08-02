export default {
  title: 'Element Plus 学习宝典',
  description: 'Element Plus 深度学习计划 - 系统掌握组件库开发',
  
  themeConfig: {
    nav: [
      { text: '🏠 首页', link: '/zh/' },
      { text: '📚 学习宝典', link: '/zh/element-plus-study-guide' },
      { text: '📝 更新日志', link: '/zh/changelog' },
      {
        text: '📋 基础学习',
        items: [
          { text: '🎯 基础概念', link: '/zh/basic-concepts/design-principles-and-basic-concepts' },
          { text: '🧩 基础组件', link: '/zh/basic-components/button' },
          { text: '📝 表单组件', link: '/zh/form-components/input' },
          { text: '📊 数据展示', link: '/zh/data-display-components/table' },
          { text: '🧭 导航组件', link: '/zh/navigation-components/menu' },
          { text: '💬 反馈组件', link: '/zh/feedback-components/alert' },
          { text: '⚙️ 配置组件', link: '/zh/configuration-components/config-provider' },
          { text: '🔧 其他组件', link: '/zh/other-components/layout-and-container-advanced' }
        ]
      },
      {
        text: '🏗️ 架构设计',
        items: [
          { text: '🏛️ 架构设计', link: '/zh/architecture-design/overall-architecture-and-design-philosophy' },
          { text: '⚡ 高级特性', link: '/zh/advanced-features/comprehensive-practice' },
          { text: '🎨 高级主题', link: '/zh/advanced-topics/component-extension-and-customization' },
          { text: '🚀 性能优化', link: '/zh/performance-optimization/component-performance-analysis' }
        ]
      }
    ],
    
    sidebar: {
      '/zh/basic-concepts/': [
        {
          text: '基础概念',
          items: [
            { text: '设计原则与基础概念', link: '/zh/basic-concepts/design-principles-and-basic-concepts' },
            { text: '环境搭建与快速开始', link: '/zh/quickstart' }
          ]
        }
      ],
      '/zh/basic-components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/zh/basic-components/button' },
            { text: 'Border 边框', link: '/zh/basic-components/border' },
            { text: 'Color 色彩', link: '/zh/basic-components/color' },
            { text: 'Container 布局容器', link: '/zh/basic-components/container' },
            { text: 'Layout 布局', link: '/zh/basic-components/layout' },
            { text: 'Space 间距', link: '/zh/basic-components/space' },
            { text: 'Icon 图标', link: '/zh/basic-components/icon' }
          ]
        }
      ],
      '/zh/form-components/': [
        {
          text: '表单组件',
          items: [
            { text: 'Input 输入框', link: '/zh/form-components/input' },
            { text: 'Radio 单选框', link: '/zh/form-components/radio' },
            { text: 'Checkbox 多选框', link: '/zh/form-components/checkbox' },
            { text: 'Select 选择器', link: '/zh/form-components/select' },
            { text: 'Form 表单', link: '/zh/form-components/form' }
          ]
        }
      ]
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '本页目录'
    },

    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色主题',
    darkModeSwitchTitle: '切换到深色主题'
  }
}