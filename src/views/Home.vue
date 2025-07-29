<template>
  <div class="home">
    <!-- 欢迎横幅 -->
    <el-card class="welcome-banner" shadow="never">
      <div class="banner-content">
        <div class="banner-text">
          <h1>Element Plus 学习宝典</h1>
          <p class="subtitle">全面掌握 Element Plus 框架的使用，构建现代化的 Vue 3 应用程序</p>
          <div class="banner-actions">
            <el-button type="primary" size="large" @click="$router.push('/components')">
              <el-icon><View /></el-icon>
              开始学习
            </el-button>
            <el-button size="large" @click="$router.push('/docs')">
              <el-icon><Document /></el-icon>
              查看文档
            </el-button>
          </div>
        </div>
        <div class="banner-image">
          <el-image
            src="/docs/public/logo.svg"
            alt="Element Plus Logo"
            style="width: 200px; height: 200px;"
          />
        </div>
      </div>
    </el-card>

    <!-- 特性介绍 -->
    <div class="features">
      <h2>核心特性</h2>
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" v-for="feature in features" :key="feature.title">
          <el-card class="feature-card" shadow="hover">
            <div class="feature-icon">
              <el-icon :size="40" :color="feature.color">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速开始 -->
    <el-card class="quick-start">
      <template #header>
        <h2>快速开始</h2>
      </template>
      <el-steps :active="1" align-center>
        <el-step title="安装依赖" description="npm install element-plus" />
        <el-step title="引入组件" description="import ElementPlus from 'element-plus'" />
        <el-step title="开始使用" description="app.use(ElementPlus)" />
      </el-steps>
      
      <div class="code-example">
        <h3>示例代码</h3>
        <el-card class="code-card">
          <pre><code>{{ codeExample }}</code></pre>
        </el-card>
      </div>
    </el-card>

    <!-- 统计信息 -->
    <div class="stats">
      <el-row :gutter="24">
        <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.label">
          <el-card class="stat-card" shadow="hover">
            <el-statistic
              :value="stat.value"
              :title="stat.label"
              :suffix="stat.suffix"
            >
              <template #prefix>
                <el-icon :color="stat.color">
                  <component :is="stat.icon" />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import {
  View,
  Document,
  Star,
  Trophy,
  DataAnalysis,
  Cpu,
  User,
  Files,
  Timer,
  Check
} from '@element-plus/icons-vue'

export default {
  name: 'Home',
  components: {
    View,
    Document,
    Star,
    Trophy,
    DataAnalysis,
    Cpu,
    User,
    Files,
    Timer,
    Check
  },
  setup() {
    const features = ref([
      {
        title: '丰富的组件',
        description: '提供60+个高质量组件，覆盖大部分业务场景',
        icon: 'Star',
        color: '#409eff'
      },
      {
        title: '开箱即用',
        description: '简单易用的API设计，快速上手，提升开发效率',
        icon: 'Trophy',
        color: '#67c23a'
      },
      {
        title: '主题定制',
        description: '支持主题定制，满足不同设计需求',
        icon: 'DataAnalysis',
        color: '#e6a23c'
      },
      {
        title: '高性能',
        description: '基于Vue 3构建，享受更好的性能和开发体验',
        icon: 'Cpu',
        color: '#f56c6c'
      },
      {
        title: '国际化',
        description: '内置国际化支持，轻松构建多语言应用',
        icon: 'User',
        color: '#909399'
      },
      {
        title: '完善文档',
        description: '详细的文档和示例，助你快速掌握每个组件',
        icon: 'Files',
        color: '#606266'
      }
    ])

    const stats = ref([
      {
        label: '组件数量',
        value: 60,
        suffix: '+',
        icon: 'Star',
        color: '#409eff'
      },
      {
        label: '学习天数',
        value: 100,
        suffix: '天',
        icon: 'Timer',
        color: '#67c23a'
      },
      {
        label: '实例数量',
        value: 200,
        suffix: '+',
        icon: 'Check',
        color: '#e6a23c'
      },
      {
        label: 'GitHub Stars',
        value: 24,
        suffix: 'k+',
        icon: 'Trophy',
        color: '#f56c6c'
      }
    ])

    const codeExample = ref(`import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')`)

    return {
      features,
      stats,
      codeExample
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-banner {
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-banner :deep(.el-card__body) {
  padding: 60px 40px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-text h1 {
  font-size: 3rem;
  margin-bottom: 16px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 32px;
  opacity: 0.9;
}

.banner-actions {
  display: flex;
  gap: 16px;
}

.banner-image {
  flex-shrink: 0;
}

.features {
  margin-bottom: 40px;
}

.features h2 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 2rem;
  color: #303133;
}

.feature-card {
  text-align: center;
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  margin-bottom: 16px;
}

.feature-card h3 {
  margin-bottom: 12px;
  color: #303133;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
}

.quick-start {
  margin-bottom: 40px;
}

.quick-start h2 {
  margin: 0;
  color: #303133;
}

.code-example {
  margin-top: 32px;
}

.code-example h3 {
  margin-bottom: 16px;
  color: #303133;
}

.code-card {
  background-color: #f8f9fa;
}

.code-card pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #525252;
}

.stats {
  margin-bottom: 40px;
}

.stat-card {
  text-align: center;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }
  
  .banner-text h1 {
    font-size: 2rem;
  }
  
  .banner-actions {
    justify-content: center;
  }
  
  .banner-image {
    margin-top: 32px;
  }
}
</style>