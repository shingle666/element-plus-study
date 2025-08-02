export default {
  title: 'Element Plus Study Guide',
  description: 'Element Plus Deep Learning Plan - Master Component Library Development',
  
  themeConfig: {
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
          { text: '🧭 Navigation Components', link: '/en/navigation-components/menu' },
          { text: '💬 Feedback Components', link: '/en/feedback-components/alert' },
          { text: '⚙️ Configuration Components', link: '/en/configuration-components/config-provider' },
          { text: '🔧 Other Components', link: '/en/other-components/layout-and-container-advanced' }
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
            { text: 'Space', link: '/en/basic-components/space' },
            { text: 'Icon', link: '/en/basic-components/icon' }
          ]
        }
      ],
      '/en/form-components/': [
        {
          text: 'Form Components',
          items: [
            { text: 'Input', link: '/en/form-components/input' },
            { text: 'Radio', link: '/en/form-components/radio' },
            { text: 'Checkbox', link: '/en/form-components/checkbox' },
            { text: 'Select', link: '/en/form-components/select' },
            { text: 'Form', link: '/en/form-components/form' }
          ]
        }
      ]
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
    darkModeSwitchTitle: 'Switch to dark theme'
  }
}