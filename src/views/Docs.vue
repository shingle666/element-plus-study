<template>
  <div class="docs">
    <div class="page-header">
      <h1>学习文档</h1>
      <p>Element Plus 完整学习指南</p>
    </div>

    <el-row :gutter="24">
      <el-col :xs="24" :sm="8" :md="6">
        <!-- 文档目录 -->
        <el-card class="docs-menu" shadow="never">
          <template #header>
            <span>文档目录</span>
          </template>
          <el-menu
            :default-active="activeDoc"
            class="docs-nav"
            @select="selectDoc"
          >
            <el-menu-item-group title="基础概念">
              <el-menu-item index="design-principles">
                <el-icon><Star /></el-icon>
                设计原则与基础概念
              </el-menu-item>
              <el-menu-item index="quick-start">
                <el-icon><VideoPlay /></el-icon>
                环境搭建与快速开始
              </el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="基础组件">
              <el-menu-item index="button">
                <el-icon><Pointer /></el-icon>
                按钮边框色彩
              </el-menu-item>
              <el-menu-item index="layout">
                <el-icon><Grid /></el-icon>
                布局与样式
              </el-menu-item>
              <el-menu-item index="icon">
                <el-icon><Picture /></el-icon>
                图标与滚动
              </el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="表单组件">
              <el-menu-item index="input">
                <el-icon><Edit /></el-icon>
                基础输入组件
              </el-menu-item>
              <el-menu-item index="select">
                <el-icon><ArrowDown /></el-icon>
                选择器组件
              </el-menu-item>
              <el-menu-item index="form-validation">
                <el-icon><CircleCheck /></el-icon>
                表单验证与优化
              </el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="数据展示">
              <el-menu-item index="table">
                <el-icon><Grid /></el-icon>
                基础数据展示
              </el-menu-item>
              <el-menu-item index="tree">
                <el-icon><Share /></el-icon>
                树形与虚拟化组件
              </el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="反馈组件">
              <el-menu-item index="message">
                <el-icon><ChatDotRound /></el-icon>
                消息反馈组件
              </el-menu-item>
              <el-menu-item index="dialog">
                <el-icon><Monitor /></el-icon>
                弹出层组件
              </el-menu-item>
            </el-menu-item-group>
            
            <el-menu-item-group title="高级主题">
              <el-menu-item index="theme">
                <el-icon><Brush /></el-icon>
                主题系统深入定制
              </el-menu-item>
              <el-menu-item index="i18n">
                <el-icon><Connection /></el-icon>
                国际化深入应用
              </el-menu-item>
              <el-menu-item index="performance">
                <el-icon><Cpu /></el-icon>
                性能优化与最佳实践
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="16" :md="18">
        <!-- 文档内容 -->
        <el-card class="docs-content">
          <template #header>
            <div class="content-header">
              <h2>{{ currentDocTitle }}</h2>
              <div class="header-actions">
                <el-button size="small" @click="openVitePress">
                  <el-icon><Link /></el-icon>
                  查看完整文档
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="doc-body" v-html="currentDocContent"></div>
          
          <!-- 文档导航 -->
          <div class="doc-navigation">
            <el-button-group>
              <el-button @click="prevDoc" :disabled="!hasPrevDoc">
                <el-icon><ArrowLeft /></el-icon>
                上一篇
              </el-button>
              <el-button @click="nextDoc" :disabled="!hasNextDoc">
                下一篇
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import {
  Star,
  VideoPlay,
  Pointer,
  Grid,
  Picture,
  Edit,
  ArrowDown,
  CircleCheck,
  Share,
  ChatDotRound,
  Monitor,
  Brush,
  Connection,
  Cpu,
  Link,
  ArrowLeft,
  ArrowRight
} from '@element-plus/icons-vue'

export default {
  name: 'Docs',
  components: {
    Star,
    VideoPlay,
    Pointer,
    Grid,
    Picture,
    Edit,
    ArrowDown,
    CircleCheck,
    Share,
    ChatDotRound,
    Monitor,
    Brush,
    Connection,
    Cpu,
    Link,
    ArrowLeft,
    ArrowRight
  },
  setup() {
    const activeDoc = ref('design-principles')
    
    // 文档数据
    const docs = {
      'design-principles': {
        title: '设计原则与基础概念',
        content: `
          <h3>设计原则</h3>
          <p>Element Plus 遵循以下设计原则：</p>
          <ul>
            <li><strong>一致性 Consistency</strong> - 与现实生活一致，在界面中一致</li>
            <li><strong>反馈 Feedback</strong> - 控制反馈，页面反馈</li>
            <li><strong>效率 Efficiency</strong> - 简化流程，清晰明确</li>
            <li><strong>可控 Controllability</strong> - 用户决策，结果可控</li>
          </ul>
          
          <h3>基础概念</h3>
          <p>Element Plus 是一套为开发者、设计师和产品经理准备的基于 Vue 3.0 的桌面端组件库。</p>
          
          <h4>特性</h4>
          <ul>
            <li>🎯 基于 Vue 3 Composition API</li>
            <li>🔥 使用 TypeScript 开发</li>
            <li>⚡ 全新的 API 设计</li>
            <li>🎨 主题定制能力</li>
            <li>🌍 国际化支持</li>
          </ul>
        `
      },
      'quick-start': {
        title: '环境搭建与快速开始',
        content: `
          <h3>环境要求</h3>
          <p>在开始之前，请确保你的开发环境满足以下要求：</p>
          <ul>
            <li>Node.js 版本 >= 16.0.0</li>
            <li>Vue 版本 >= 3.2.0</li>
          </ul>
          
          <h3>安装</h3>
          <pre><code># NPM
npm install element-plus --save

# Yarn
yarn add element-plus

# pnpm
pnpm install element-plus</code></pre>
          
          <h3>完整引入</h3>
          <pre><code>import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')</code></pre>
          
          <h3>按需引入</h3>
          <p>借助 unplugin-vue-components 和 unplugin-auto-import 这两款插件，可以实现自动导入。</p>
        `
      },
      'button': {
        title: '按钮边框色彩',
        content: `
          <h3>基础用法</h3>
          <p>使用 type、plain、round 和 circle 来定义按钮的样式。</p>
          
          <h3>禁用状态</h3>
          <p>你可以使用 disabled 属性来定义按钮是否被禁用。</p>
          
          <h3>文字按钮</h3>
          <p>没有边框和背景色的按钮。</p>
          
          <h3>图标按钮</h3>
          <p>带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。</p>
          
          <h3>按钮组</h3>
          <p>以按钮组的方式出现，常用于多项类似操作。</p>
        `
      },
      'layout': {
        title: '布局与样式',
        content: `
          <h3>基础布局</h3>
          <p>通过基础的 24 分栏，迅速简便地创建布局。</p>
          
          <h3>分栏间隔</h3>
          <p>支持列间距。</p>
          
          <h3>混合布局</h3>
          <p>通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。</p>
          
          <h3>分栏偏移</h3>
          <p>支持偏移指定的栏数。</p>
          
          <h3>对齐方式</h3>
          <p>通过 flex 布局来对分栏进行灵活的对齐。</p>
          
          <h3>响应式布局</h3>
          <p>参照了 Bootstrap 的 响应式设计，预设了五个响应尺寸：xs、sm、md、lg 和 xl。</p>
        `
      }
    }
    
    const docKeys = Object.keys(docs)
    
    const currentDocTitle = computed(() => {
      return docs[activeDoc.value]?.title || '文档未找到'
    })
    
    const currentDocContent = computed(() => {
      return docs[activeDoc.value]?.content || '<p>文档内容加载中...</p>'
    })
    
    const currentIndex = computed(() => {
      return docKeys.indexOf(activeDoc.value)
    })
    
    const hasPrevDoc = computed(() => {
      return currentIndex.value > 0
    })
    
    const hasNextDoc = computed(() => {
      return currentIndex.value < docKeys.length - 1
    })
    
    const selectDoc = (key) => {
      activeDoc.value = key
    }
    
    const prevDoc = () => {
      if (hasPrevDoc.value) {
        activeDoc.value = docKeys[currentIndex.value - 1]
      }
    }
    
    const nextDoc = () => {
      if (hasNextDoc.value) {
        activeDoc.value = docKeys[currentIndex.value + 1]
      }
    }
    
    const openVitePress = () => {
      window.open('/docs/', '_blank')
    }
    
    return {
      activeDoc,
      currentDocTitle,
      currentDocContent,
      hasPrevDoc,
      hasNextDoc,
      selectDoc,
      prevDoc,
      nextDoc,
      openVitePress
    }
  }
}
</script>

<style scoped>
.docs {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #303133;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 1.1rem;
  color: #606266;
}

.docs-menu {
  position: sticky;
  top: 20px;
}

.docs-nav {
  border-right: none;
}

.docs-nav .el-menu-item {
  height: 40px;
  line-height: 40px;
}

.docs-content {
  min-height: 600px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-header h2 {
  margin: 0;
  color: #303133;
}

.doc-body {
  line-height: 1.8;
  color: #606266;
}

.doc-body h3 {
  color: #303133;
  margin: 24px 0 16px 0;
  font-size: 1.3rem;
}

.doc-body h4 {
  color: #409eff;
  margin: 20px 0 12px 0;
  font-size: 1.1rem;
}

.doc-body p {
  margin: 12px 0;
}

.doc-body ul {
  margin: 12px 0;
  padding-left: 24px;
}

.doc-body li {
  margin: 8px 0;
}

.doc-body pre {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
}

.doc-body code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #525252;
}

.doc-navigation {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
}

@media (max-width: 768px) {
  .content-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .docs-menu {
    position: static;
    margin-bottom: 24px;
  }
}
</style>