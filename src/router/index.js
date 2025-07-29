import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Components from '../views/Components.vue'
import Examples from '../views/Examples.vue'
import Docs from '../views/Docs.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - Element Plus 学习宝典'
    }
  },
  {
    path: '/components',
    name: 'Components',
    component: Components,
    meta: {
      title: '组件展示 - Element Plus 学习宝典'
    }
  },
  {
    path: '/examples',
    name: 'Examples',
    component: Examples,
    meta: {
      title: '实例演示 - Element Plus 学习宝典'
    }
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs,
    meta: {
      title: '文档 - Element Plus 学习宝典'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到 - Element Plus 学习宝典'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router