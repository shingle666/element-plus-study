---
layout: home

hero:
  name: "Element Plus Study"
  text: "Vue 3 组件库学习指南"
  tagline: 深入学习 Element Plus 组件库的完整教程
  image:
    src: /logo.svg
    alt: Element Plus Study
  actions:
    - theme: brand
      text: 开始学习
      link: /zh-cn/
    - theme: alt
      text: English Guide
      link: /en/
    - theme: alt
      text: 查看源码
      link: https://github.com/element-plus/element-plus

features:
  - icon: 🎯
    title: 基础概念
    details: 从设计原则到基本概念，全面了解 Element Plus 的核心思想
  - icon: 🧩
    title: 组件详解
    details: 深入学习每个组件的用法、API 和最佳实践
  - icon: 🏗️
    title: 架构设计
    details: 探索组件库的整体架构和设计模式
  - icon: ⚡
    title: 高级特性
    details: 主题定制、插件系统、性能优化等高级功能
  - icon: 🌐
    title: 企业应用
    details: SSR、国际化、工程化等企业级应用场景
  - icon: 🤝
    title: 实践贡献
    details: 项目实践、开源贡献和社区参与指南
---

## 快速开始

选择你的学习路径：

- **中文学习** - [开始中文教程](/zh-cn/)
- **English Learning** - [Start English Tutorial](/en/)

## 学习内容

### 📚 基础学习
- 设计原则与基本概念
- 环境搭建与快速开始
- 基础组件使用
- 表单组件详解
- 数据展示组件
- 导航组件
- 反馈组件

### 🏗️ 架构设计
- 整体架构与设计哲学
- 组件设计模式分析
- Vue 3 Composition API 应用
- 高级特性与主题定制

### 🌐 企业应用
- SSR 服务端渲染
- 国际化与无障碍
- Vue 生态集成
- 工程化与构建
- 跨平台开发

### 🤝 贡献与实践
- 项目实践案例
- 开源贡献指南
- 社区参与
- 学习总结与规划

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>