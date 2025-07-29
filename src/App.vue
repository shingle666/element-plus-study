<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 顶部导航 -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="logo">
            <el-icon><ElementPlus /></el-icon>
            <span class="title">Element Plus 学习宝典</span>
          </div>
          <el-menu
            :default-active="activeIndex"
            class="header-menu"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/components">组件展示</el-menu-item>
            <el-menu-item index="/examples">实例演示</el-menu-item>
            <el-menu-item index="/docs">文档</el-menu-item>
          </el-menu>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>

      <!-- 底部 -->
      <el-footer class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 Element Plus 学习宝典. All rights reserved.</p>
          <p>
            <el-link href="https://github.com/shingle666/element-plus-study" target="_blank">
              <el-icon><Link /></el-icon>
              GitHub
            </el-link>
          </p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElementPlus, Link } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    ElementPlus,
    Link
  },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const activeIndex = computed(() => route.path)

    const handleSelect = (key) => {
      router.push(key)
    }

    return {
      activeIndex,
      handleSelect
    }
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.header-menu {
  border-bottom: none;
}

.app-main {
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.app-footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  text-align: center;
  color: #909399;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content p {
  margin: 5px 0;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  width: 100%;
}
</style>