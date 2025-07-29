import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import store from '../store'
import router from '../router'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 显示加载状态
    store.dispatch('app/setLoading', true)
    
    // 添加 token
    const token = store.getters['user/token']
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    store.dispatch('app/setLoading', false)
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    store.dispatch('app/setLoading', false)
    
    const { code, message, data } = response.data
    
    // 根据业务状态码处理
    if (code === 200 || code === 0) {
      return data || response.data
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message || '请求失败'))
    }
  },
  error => {
    store.dispatch('app/setLoading', false)
    
    const { response } = error
    let message = '网络错误'
    
    if (response) {
      switch (response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 清除用户信息并跳转到登录页
          store.dispatch('user/logout')
          router.push('/login')
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `连接错误${response.status}`
      }
    } else {
      if (error.code === 'ECONNABORTED') {
        message = '请求超时'
      } else if (error.message.includes('Network Error')) {
        message = '网络连接异常'
      }
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 封装常用的请求方法
export const http = {
  get(url, params = {}) {
    return service.get(url, { params })
  },
  
  post(url, data = {}) {
    return service.post(url, data)
  },
  
  put(url, data = {}) {
    return service.put(url, data)
  },
  
  delete(url, params = {}) {
    return service.delete(url, { params })
  },
  
  upload(url, formData) {
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default service