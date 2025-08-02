// https://vitepress.dev/reference/site-config
import { defineConfig } from 'vitepress'

// 导入语言配置
import enConfig from '../en/config.js'
import zhConfig from '../zh/config.js'

export default defineConfig({
  // 基础配置
  title: 'Element Plus Study Guide',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  
  // 路径重写规则
  rewrites: {},
  
  // 多语言配置
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      ...enConfig
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      ...zhConfig
    }
  },
  
  // Markdown 配置
  markdown: {
    // 代码块配置
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ]
  },
  
  // 站点元数据
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#409eff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en-US' }],
    ['meta', { property: 'og:title', content: 'Element Plus Study Guide' }],
    ['meta', { property: 'og:site_name', content: 'Element Plus Study Guide' }],
    ['meta', { property: 'og:image', content: '/og-image.svg' }],
    ['meta', { property: 'og:url', content: 'https://edlo.cn/' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'keywords', content: 'Element Plus, Vue3, Component Library, Frontend Development, UI Framework' }]
  ],
  
  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    
    // 语言切换路径映射
    i18nRouting: false,
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shingle666/element-plus-study' },
      { icon: 'discord', link: 'https://discord.gg/gXK9XNzW3X' }
    ],

    // 搜索配置
    search: {
      provider: 'local'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/shingle666/element-plus-study/edit/main/docs/:path'
    },
    
    // 最后更新时间
    lastUpdated: {
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 页脚
    footer: {
      message: 'Element Plus Study Guide',
      copyright: 'Copyright © 2025 edlo.cn - Element Plus Study Guide'
    }
  }
})