<template>
  <div class="not-found">
    <div class="not-found-container">
      <!-- 404 图标 -->
      <div class="error-icon">
        <el-icon :size="120" color="#409eff">
          <WarningFilled />
        </el-icon>
      </div>
      
      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">页面未找到</h2>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        
        <!-- 建议操作 -->
        <div class="error-suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>检查网址是否正确</li>
            <li>返回首页重新导航</li>
            <li>使用搜索功能查找内容</li>
            <li>联系管理员获取帮助</li>
          </ul>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" size="large" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button size="large" @click="goBack">
            <el-icon><Back /></el-icon>
            返回上页
          </el-button>
          <el-button size="large" @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 快速导航 -->
    <div class="quick-nav">
      <el-card shadow="hover">
        <template #header>
          <span>快速导航</span>
        </template>
        <div class="nav-links">
          <el-button text @click="$router.push('/')">
            <el-icon><House /></el-icon>
            首页
          </el-button>
          <el-button text @click="$router.push('/components')">
            <el-icon><Grid /></el-icon>
            组件展示
          </el-button>
          <el-button text @click="$router.push('/examples')">
            <el-icon><Document /></el-icon>
            实例演示
          </el-button>
          <el-button text @click="$router.push('/docs')">
            <el-icon><Reading /></el-icon>
            学习文档
          </el-button>
        </div>
      </el-card>
    </div>
    
    <!-- 联系信息 -->
    <div class="contact-info">
      <el-alert
        title="需要帮助？"
        type="info"
        :closable="false"
        show-icon
      >
        <template #default>
          如果您认为这是一个错误，请联系我们：
          <el-link href="https://github.com/shingle666/element-plus-study/issues" target="_blank">
            提交问题反馈
          </el-link>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import {
  WarningFilled,
  HomeFilled,
  Back,
  Refresh,
  House,
  Grid,
  Document,
  Reading
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'NotFound',
  components: {
    WarningFilled,
    HomeFilled,
    Back,
    Refresh,
    House,
    Grid,
    Document,
    Reading
  },
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
      ElMessage.success('已返回首页')
    }
    
    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
        ElMessage.info('没有上一页，已返回首页')
      }
    }
    
    const refresh = () => {
      window.location.reload()
    }
    
    return {
      goHome,
      goBack,
      refresh
    }
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.not-found-container {
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
}

.error-icon {
  margin-bottom: 30px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #409eff;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 2rem;
  color: #303133;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.error-description {
  font-size: 1.1rem;
  color: #606266;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.error-suggestions {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.error-suggestions h3 {
  color: #303133;
  margin: 0 0 12px 0;
  font-size: 1.1rem;
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.error-suggestions li {
  margin: 8px 0;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-nav {
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.nav-links .el-button {
  height: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-links .el-button:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.contact-info {
  width: 100%;
  max-width: 500px;
}

.contact-info .el-alert {
  border-radius: 8px;
}

.contact-info .el-link {
  margin-left: 8px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found {
    padding: 20px 16px;
  }
  
  .error-content {
    padding: 30px 20px;
  }
  
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 100%;
    max-width: 200px;
  }
  
  .nav-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 3rem;
  }
  
  .error-title {
    font-size: 1.3rem;
  }
  
  .nav-links {
    grid-template-columns: 1fr;
  }
}
</style>